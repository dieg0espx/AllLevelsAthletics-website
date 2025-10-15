import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

export async function POST(request: NextRequest) {
  try {
    const { userId, newPlanId } = await request.json()
    
    if (!userId || !newPlanId) {
      return NextResponse.json(
        { error: 'User ID and new plan ID are required' },
        { status: 400 }
      )
    }

    console.log('=== FORCING SUBSCRIPTION UPGRADE ===')
    console.log('User ID:', userId)
    console.log('New Plan ID:', newPlanId)

    // Define the subscription plans
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

    // Get user's current subscription
    const { data: currentSubscription, error: subscriptionError } = await supabaseAdmin
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    if (subscriptionError || !currentSubscription) {
      console.error('Error fetching subscription:', subscriptionError)
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      )
    }

    console.log('Current subscription:', {
      id: currentSubscription.id,
      plan_name: currentSubscription.plan_name,
      stripe_subscription_id: currentSubscription.stripe_subscription_id
    })

    // Get user's Stripe customer ID
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single()

    if (profileError || !userProfile?.stripe_customer_id) {
      console.error('Error fetching user profile:', profileError)
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    // Get the current Stripe subscription
    const stripeSubscription = await stripe.subscriptions.retrieve(currentSubscription.stripe_subscription_id)
    console.log('Current Stripe subscription:', stripeSubscription.id)

    // Update the Stripe subscription to the new plan
    console.log('Updating Stripe subscription to:', newPlan.name, 'Price ID:', newPlan.priceId)
    const updatedSubscription = await stripe.subscriptions.update(stripeSubscription.id, {
      items: [{
        id: stripeSubscription.items.data[0].id,
        price: newPlan.priceId,
      }],
      proration_behavior: 'none',
    })

    console.log('✅ Stripe subscription updated successfully')

    // Update the subscription in our database
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

    if (updateError) {
      console.error('Error updating subscription in database:', updateError)
      return NextResponse.json(
        { error: 'Failed to update subscription in database' },
        { status: 500 }
      )
    }

    // Update user profile
    const { error: profileUpdateError } = await supabaseAdmin
      .from('user_profiles')
      .update({
        current_plan: newPlanId,
        subscription_status: updatedSubscription.status,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)

    if (profileUpdateError) {
      console.error('Error updating user profile:', profileUpdateError)
      return NextResponse.json(
        { error: 'Failed to update user profile' },
        { status: 500 }
      )
    }

    console.log('✅ Database updated successfully')

    return NextResponse.json({ 
      success: true,
      message: `Successfully upgraded to ${newPlan.name}`,
      plan: {
        id: newPlanId,
        name: newPlan.name,
        price: newPlan.price
      },
      subscription: {
        id: currentSubscription.id,
        status: updatedSubscription.status,
        plan_id: newPlanId,
        plan_name: newPlan.name,
        current_period_start: new Date(updatedSubscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(updatedSubscription.current_period_end * 1000).toISOString(),
      }
    })

  } catch (error) {
    console.error('Error forcing upgrade:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
