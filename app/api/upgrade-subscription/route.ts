import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

// Define the subscription plans with their Stripe price IDs
const SUBSCRIPTION_PLANS = {
  foundation: {
    name: 'Foundation',
    monthlyPriceId: process.env.STRIPE_FOUNDATION_MONTHLY_PRICE_ID,
    monthlyPrice: 197,
  },
  growth: {
    name: 'Growth',
    monthlyPriceId: process.env.STRIPE_GROWTH_MONTHLY_PRICE_ID,
    monthlyPrice: 297,
  },
  elite: {
    name: 'Elite',
    monthlyPriceId: process.env.STRIPE_ELITE_MONTHLY_PRICE_ID,
    monthlyPrice: 497,
  },
}

export async function POST(request: NextRequest) {
  try {
    const { newPlanId, userId } = await request.json()
    
    console.log('=== SUBSCRIPTION UPGRADE CREATION ===')
    console.log('New Plan ID:', newPlanId)
    console.log('User ID:', userId)

    // Validate required fields
    if (!newPlanId || !userId) {
      return NextResponse.json(
        { error: 'New plan ID and user ID are required' },
        { status: 400 }
      )
    }

    // Validate new plan exists
    console.log('Validating new plan ID:', newPlanId)
    console.log('Available plan IDs:', Object.keys(SUBSCRIPTION_PLANS))
    
    const newPlan = SUBSCRIPTION_PLANS[newPlanId as keyof typeof SUBSCRIPTION_PLANS]
    if (!newPlan) {
      console.error('❌ Invalid plan ID:', newPlanId)
      return NextResponse.json(
        { error: 'Invalid plan ID' },
        { status: 400 }
      )
    }
    
    console.log('✅ New plan validated:', newPlan.name)

    // Get user's current subscription (including canceled ones for upgrades)
    console.log('🔍 Fetching subscription for user:', userId)
    const { data: currentSubscription, error: subscriptionError } = await supabaseAdmin
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    console.log('Subscription query result:', {
      data: currentSubscription,
      error: subscriptionError,
      errorCode: subscriptionError?.code,
      message: subscriptionError?.message
    })

    if (subscriptionError && subscriptionError.code !== 'PGRST116') {
      console.error('Error fetching current subscription:', subscriptionError)
      return NextResponse.json(
        { error: 'Failed to fetch current subscription' },
        { status: 500 }
      )
    }

    if (!currentSubscription) {
      console.error('❌ No subscription found for user:', userId)
      
      // Let's also check if there are any subscriptions at all for this user
      const { data: allSubscriptions, error: allSubsError } = await supabaseAdmin
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      console.log('All subscriptions for user:', {
        count: allSubscriptions?.length || 0,
        subscriptions: allSubscriptions,
        error: allSubsError
      })

      return NextResponse.json(
        { error: 'No subscription found. Please subscribe to a plan first.' },
        { status: 400 }
      )
    }

    console.log('✅ Subscription found:', {
      id: currentSubscription.id,
      status: currentSubscription.status,
      plan_name: currentSubscription.plan_name,
      stripe_subscription_id: currentSubscription.stripe_subscription_id
    })

    // Check if the current subscription is canceled in Stripe
    let stripeSubscription = null
    if (currentSubscription.stripe_subscription_id) {
      try {
        stripeSubscription = await stripe.subscriptions.retrieve(currentSubscription.stripe_subscription_id)
        console.log('Current Stripe subscription status:', stripeSubscription.status)
        console.log('Current database subscription status:', currentSubscription.status)
        
        // If Stripe subscription is canceled but database shows active, update database
        if (stripeSubscription.status === 'canceled' && currentSubscription.status === 'active') {
          console.log('Syncing canceled subscription status to database')
          await supabaseAdmin
            .from('user_subscriptions')
            .update({ status: 'canceled', updated_at: new Date().toISOString() })
            .eq('id', currentSubscription.id)
          
          currentSubscription.status = 'canceled'
        }
      } catch (error) {
        console.error('Error fetching Stripe subscription:', error)
        console.log('Stripe subscription ID:', currentSubscription.stripe_subscription_id)
      }
    } else {
      console.log('No Stripe subscription ID found in database')
    }

    // If subscription is canceled, treat this as a new subscription rather than upgrade
    if (currentSubscription.status === 'canceled') {
      console.log('❌ Subscription is canceled, cannot upgrade')
      return NextResponse.json(
        { 
          error: 'Your current subscription has been canceled. Please create a new subscription instead of upgrading.',
          requiresNewSubscription: true 
        },
        { status: 400 }
      )
    }

    // Allow upgrades for active, trialing, and past_due subscriptions
    const allowedStatuses = ['active', 'trialing', 'past_due']
    if (!allowedStatuses.includes(currentSubscription.status)) {
      console.log('❌ Subscription status not allowed for upgrade:', currentSubscription.status)
      return NextResponse.json(
        { 
          error: `Your subscription status (${currentSubscription.status}) is not eligible for upgrade. Please contact support.`,
          currentStatus: currentSubscription.status
        },
        { status: 400 }
      )
    }

    console.log('✅ Subscription is active, proceeding with upgrade')
    console.log('Current plan:', currentSubscription.plan_name)
    console.log('Target plan:', newPlan.name)

    // Get user's Stripe customer ID
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single()

    if (profileError || !userProfile?.stripe_customer_id) {
      console.error('Error fetching user profile or missing Stripe customer ID:', profileError)
      return NextResponse.json(
        { error: 'User profile or Stripe customer ID not found' },
        { status: 500 }
      )
    }

    // Get current plan details
    const currentPlanName = currentSubscription.plan_name?.toLowerCase()
    console.log('Current plan name from database:', currentSubscription.plan_name)
    console.log('Normalized plan name:', currentPlanName)
    console.log('Available plans:', Object.keys(SUBSCRIPTION_PLANS))
    
    const currentPlan = SUBSCRIPTION_PLANS[currentPlanName as keyof typeof SUBSCRIPTION_PLANS]
    
    if (!currentPlan) {
      console.error('❌ Current plan not found in pricing configuration')
      console.error('Plan name:', currentSubscription.plan_name)
      console.error('Normalized:', currentPlanName)
      return NextResponse.json(
        { error: 'Current plan not found in pricing configuration' },
        { status: 500 }
      )
    }
    
    console.log('✅ Current plan found:', currentPlan.name)

    // Calculate prorated billing
    const currentBillingStart = new Date(currentSubscription.current_period_start)
    const currentBillingEnd = new Date(currentSubscription.current_period_end)
    const now = new Date()
    
    // Calculate remaining days in current billing cycle
    const totalDaysInCycle = Math.ceil((currentBillingEnd.getTime() - currentBillingStart.getTime()) / (1000 * 60 * 60 * 24))
    const remainingDays = Math.ceil((currentBillingEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    const remainingDaysRatio = Math.max(0, remainingDays / totalDaysInCycle)
    
    // Calculate prorated amount for remaining days
    const currentPlanProrated = currentPlan.monthlyPrice * remainingDaysRatio
    const newPlanProrated = newPlan.monthlyPrice * remainingDaysRatio
    const proratedDifference = newPlanProrated - currentPlanProrated

    console.log('Current plan:', currentPlan.name, '- $' + currentPlan.monthlyPrice)
    console.log('New plan:', newPlan.name, '- $' + newPlan.monthlyPrice)
    console.log('Remaining days in cycle:', remainingDays, 'of', totalDaysInCycle)
    console.log('Prorated difference to pay:', proratedDifference.toFixed(2))

    // Get base URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'http://localhost:3000'
    
    // Create URLs for upgrade checkout
    const successUrl = `${baseUrl}/dashboard/coaching?upgrade=success&plan=${newPlanId}&session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl = `${baseUrl}/dashboard/coaching?upgrade=cancelled`
    
    console.log('Success URL:', successUrl)
    console.log('Cancel URL:', cancelUrl)

    // Create line items for the checkout session - only the prorated amount
    const lineItems: any[] = []

    // Create prorated charge for the difference
    if (proratedDifference > 0) {
      try {
        const prorationPrice = await stripe.prices.create({
          unit_amount: Math.round(proratedDifference * 100), // Convert to cents
          currency: 'usd',
          product_data: {
            name: `Upgrade to ${newPlan.name} - Prorated Payment`,
          },
          metadata: {
            type: 'upgrade_proration',
            from_plan: currentPlan.name,
            to_plan: newPlan.name,
            user_id: userId,
            remaining_days: remainingDays.toString(),
            description: `Covers remaining ${remainingDays} days in current billing cycle (${currentPlan.name} → ${newPlan.name})`
          }
        })
        
        // Add only the prorated amount as line item
        lineItems.push({
          price: prorationPrice.id,
          quantity: 1,
        })
        
        console.log('Created proration price:', prorationPrice.id, 'Amount: $' + proratedDifference.toFixed(2))
      } catch (prorationError) {
        console.error('Error creating proration price:', prorationError)
        return NextResponse.json(
          { error: 'Failed to create prorated pricing' },
          { status: 500 }
        )
      }
    } else {
      // If no prorated amount needed, create a $0 charge to trigger the upgrade
      try {
        const zeroPrice = await stripe.prices.create({
          unit_amount: 0,
          currency: 'usd',
          product_data: {
            name: `Upgrade to ${newPlan.name}`,
          },
          metadata: {
            type: 'free_upgrade',
            from_plan: currentPlan.name,
            to_plan: newPlan.name,
            user_id: userId,
            description: `Free upgrade from ${currentPlan.name} to ${newPlan.name}`
          }
        })
        
        lineItems.push({
          price: zeroPrice.id,
          quantity: 1,
        })
      } catch (zeroPriceError) {
        console.error('Error creating zero price:', zeroPriceError)
        return NextResponse.json(
          { error: 'Failed to create upgrade pricing' },
          { status: 500 }
        )
      }
    }

    // Create Stripe checkout session for upgrade
    const sessionConfig: any = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment', // Use payment mode for prorated billing
      customer: userProfile.stripe_customer_id,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: userId,
        planId: newPlanId,
        planName: newPlan.name,
        type: 'upgrade',
        fromPlan: currentPlan.name,
        proratedAmount: proratedDifference.toFixed(2),
        remainingDays: remainingDays.toString(),
        isUpgrade: 'true'
      },
      allow_promotion_codes: false,
    }

    const session = await stripe.checkout.sessions.create(sessionConfig)

    console.log('✅ Stripe upgrade checkout session created successfully')
    console.log('Session ID:', session.id)
    console.log('Session URL:', session.url)
    console.log('Prorated amount to pay:', proratedDifference > 0 ? `$${proratedDifference.toFixed(2)}` : 'None')

    return NextResponse.json({ 
      sessionId: session.id,
      sessionUrl: session.url,
      success: true,
      proratedAmount: proratedDifference,
      remainingDays: remainingDays,
      currentPlan: currentPlan.name,
      newPlan: newPlan.name,
      monthlyPrice: newPlan.monthlyPrice,
      billingInfo: {
        totalDaysInCycle: totalDaysInCycle,
        remainingDays: remainingDays,
        currentPlanProrated: currentPlanProrated,
        newPlanProrated: newPlanProrated
      }
    })

  } catch (error) {
    console.error('❌ Error creating upgrade checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create upgrade checkout session' },
      { status: 500 }
    )
  }
}
