import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    console.log('=== SYNCING SUBSCRIPTION AFTER UPGRADE ===')
    console.log('User ID:', userId)

    // Get user's current subscription from database
    const { data: subscription, error: subscriptionError } = await supabaseAdmin
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    if (subscriptionError || !subscription) {
      console.error('Error fetching subscription:', subscriptionError)
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      )
    }

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
    const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripe_subscription_id)
    
    // Get the current price ID from Stripe to determine the plan
    const currentPriceId = stripeSubscription.items.data[0].price.id
    console.log('Current price ID from Stripe:', currentPriceId)
    
    // Map price ID to plan information
    const PRICE_TO_PLAN = {
      [process.env.STRIPE_FOUNDATION_MONTHLY_PRICE_ID!]: { plan_id: 'foundation', plan_name: 'Foundation' },
      [process.env.STRIPE_GROWTH_MONTHLY_PRICE_ID!]: { plan_id: 'growth', plan_name: 'Growth' },
      [process.env.STRIPE_ELITE_MONTHLY_PRICE_ID!]: { plan_id: 'elite', plan_name: 'Elite' },
    }
    
    const planInfo = PRICE_TO_PLAN[currentPriceId]
    console.log('Plan info from price ID:', planInfo)
    
    if (!planInfo) {
      console.error('Unknown price ID:', currentPriceId)
      return NextResponse.json(
        { error: 'Unknown subscription plan' },
        { status: 400 }
      )
    }

    // Update the subscription in our database
    const { error: updateError } = await supabaseAdmin
      .from('user_subscriptions')
      .update({
        plan_id: planInfo.plan_id,
        plan_name: planInfo.plan_name,
        status: stripeSubscription.status,
        current_period_start: new Date(stripeSubscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)

    if (updateError) {
      console.error('Error updating subscription:', updateError)
      return NextResponse.json(
        { error: 'Failed to update subscription' },
        { status: 500 }
      )
    }

    // Update user profile
    const { error: profileUpdateError } = await supabaseAdmin
      .from('user_profiles')
      .update({
        current_plan: planInfo.plan_id,
        subscription_status: stripeSubscription.status,
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

    console.log('✅ Subscription synced successfully')
    console.log('Updated plan:', planInfo.plan_name)

    return NextResponse.json({ 
      success: true,
      plan: planInfo,
      subscription: {
        id: subscription.id,
        status: stripeSubscription.status,
        plan_id: planInfo.plan_id,
        plan_name: planInfo.plan_name,
        current_period_start: new Date(stripeSubscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
      }
    })

  } catch (error) {
    console.error('Error syncing subscription:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
