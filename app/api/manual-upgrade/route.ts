import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

export async function POST(request: NextRequest) {
  try {
    console.log('=== MANUAL UPGRADE API CALLED ===')
    
    const body = await request.json()
    const { userId, newPlanId } = body
    
    console.log('Request body:', body)
    console.log('User ID:', userId)
    console.log('New Plan ID:', newPlanId)

    if (!userId || !newPlanId) {
      return NextResponse.json(
        { error: 'User ID and new plan ID are required' },
        { status: 400 }
      )
    }

    // Get user's current subscription (including canceled ones for upgrades)
    console.log('Fetching current subscription for user:', userId)
    const { data: currentSubscription, error: subscriptionError } = await supabaseAdmin
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .single()

    console.log('Subscription query result:', { currentSubscription, subscriptionError })

    if (subscriptionError || !currentSubscription) {
      console.error('Error fetching current subscription:', subscriptionError)
      return NextResponse.json(
        { error: `No subscription found: ${subscriptionError?.message || 'Unknown error'}` },
        { status: 400 }
      )
    }

    // Check if the current subscription is canceled in Stripe
    if (currentSubscription.stripe_subscription_id) {
      try {
        const stripeSubscription = await stripe.subscriptions.retrieve(currentSubscription.stripe_subscription_id)
        console.log('Current Stripe subscription status:', stripeSubscription.status)
        
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
      }
    }

    // If subscription is canceled, treat this as a new subscription rather than upgrade
    if (currentSubscription.status === 'canceled') {
      return NextResponse.json(
        { 
          error: 'Your current subscription has been canceled. Please create a new subscription instead of upgrading.',
          requiresNewSubscription: true 
        },
        { status: 400 }
      )
    }

    // Get user's Stripe customer ID
    console.log('Fetching user profile for user:', userId)
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single()

    console.log('User profile query result:', { userProfile, profileError })

    if (profileError || !userProfile?.stripe_customer_id) {
      console.error('Error fetching user profile:', profileError)
      return NextResponse.json(
        { error: `User profile or Stripe customer ID not found: ${profileError?.message || 'Unknown error'}` },
        { status: 500 }
      )
    }

    // Define the new plan price ID
    const SUBSCRIPTION_PLANS = {
      foundation: {
        name: 'Foundation',
        priceId: process.env.STRIPE_FOUNDATION_MONTHLY_PRICE_ID,
        price: 197,
      },
      growth: {
        name: 'Growth',
        priceId: process.env.STRIPE_GROWTH_MONTHLY_PRICE_ID,
        price: 297,
      },
      elite: {
        name: 'Elite',
        priceId: process.env.STRIPE_ELITE_MONTHLY_PRICE_ID,
        price: 497,
      },
    }

    const newPlan = SUBSCRIPTION_PLANS[newPlanId as keyof typeof SUBSCRIPTION_PLANS]
    
    if (!newPlan) {
      return NextResponse.json(
        { error: 'Invalid plan ID' },
        { status: 400 }
      )
    }

    // Get the current Stripe subscription
    console.log('Retrieving Stripe subscription:', currentSubscription.stripe_subscription_id)
    const stripeSubscription = await stripe.subscriptions.retrieve(currentSubscription.stripe_subscription_id)
    console.log('Current Stripe subscription:', stripeSubscription.id)
    
    // Update the Stripe subscription to the new plan
    console.log('Updating Stripe subscription to new plan:', newPlan.name, 'Price ID:', newPlan.priceId)
    const updatedSubscription = await stripe.subscriptions.update(stripeSubscription.id, {
      items: [{
        id: stripeSubscription.items.data[0].id,
        price: newPlan.priceId,
      }],
      proration_behavior: 'none', // No proration since we already handled it
    })
    console.log('Updated Stripe subscription:', updatedSubscription.id)

    console.log('✅ Stripe subscription updated successfully')
    console.log('New subscription ID:', updatedSubscription.id)

    // Update the subscription in our database
    console.log('Updating subscription in database for user:', userId)
    const { error: updateError } = await supabaseAdmin
      .from('user_subscriptions')
      .update({
        plan_name: newPlan.name,
        plan_id: newPlanId,
        current_period_start: new Date(updatedSubscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(updatedSubscription.current_period_end * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)

    console.log('Database update result:', { updateError })

    if (updateError) {
      console.error('Error updating subscription in database:', updateError)
      return NextResponse.json(
        { error: `Failed to update subscription in database: ${updateError.message}` },
        { status: 500 }
      )
    }

    console.log('✅ Database subscription updated successfully')

    return NextResponse.json({ 
      success: true,
      message: `Successfully upgraded to ${newPlan.name} plan`,
      newPlan: newPlan.name,
      newPrice: newPlan.price
    })

  } catch (error) {
    console.error('❌ Error processing manual upgrade:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    })
    return NextResponse.json(
      { 
        error: 'Failed to process upgrade',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
