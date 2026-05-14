import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'
import { requireUser } from '@/lib/api-auth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

export async function POST(request: NextRequest) {
  const auth = await requireUser(request)
  if (auth.error) return auth.error
  const userId = auth.user.id

  try {
    console.log('🔄 MANUAL SYNC - Syncing subscription for user:', userId)

    // Get user's Stripe customer ID from profile
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single()

    if (profileError || !userProfile?.stripe_customer_id) {
      console.log('❌ No Stripe customer ID found in profile')
      return NextResponse.json(
        { error: 'No Stripe customer found. Please complete checkout first.' },
        { status: 404 }
      )
    }

    const stripeCustomerId = userProfile.stripe_customer_id
    console.log('🔍 Found Stripe customer ID:', stripeCustomerId)

    // Fetch all subscriptions for this customer from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      limit: 10,
    })

    console.log('📋 Found', subscriptions.data.length, 'subscription(s) in Stripe')

    if (subscriptions.data.length === 0) {
      return NextResponse.json(
        { error: 'No subscriptions found in Stripe for this customer' },
        { status: 404 }
      )
    }

    // Get the most recent active or trialing subscription
    const activeSubscription = subscriptions.data.find(
      sub => sub.status === 'active' || sub.status === 'trialing'
    ) || subscriptions.data[0]

    console.log('💳 Processing subscription:', activeSubscription.id)
    console.log('💳 Status:', activeSubscription.status)
    console.log('💳 Metadata:', activeSubscription.metadata)

    // Determine plan details from metadata or price
    const planId = activeSubscription.metadata?.planId || 'foundation'
    const planName = activeSubscription.metadata?.planName || 'Foundation Plan'
    const billingPeriod = activeSubscription.metadata?.billingPeriod || 'monthly'

    // Create/update subscription in database
    const subscriptionData = {
      user_id: userId,
      stripe_customer_id: stripeCustomerId,
      stripe_subscription_id: activeSubscription.id,
      plan_id: planId,
      plan_name: planName,
      status: activeSubscription.status,
      current_period_start: new Date(activeSubscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(activeSubscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: activeSubscription.cancel_at_period_end,
      canceled_at: activeSubscription.canceled_at 
        ? new Date(activeSubscription.canceled_at * 1000).toISOString() 
        : null,
      trial_start: activeSubscription.trial_start 
        ? new Date(activeSubscription.trial_start * 1000).toISOString() 
        : null,
      trial_end: activeSubscription.trial_end 
        ? new Date(activeSubscription.trial_end * 1000).toISOString() 
        : null,
    }

    const { data: savedSubscription, error: saveError } = await supabaseAdmin
      .from('user_subscriptions')
      .upsert(subscriptionData, { 
        onConflict: 'stripe_subscription_id',
        ignoreDuplicates: false 
      })
      .select()
      .single()

    if (saveError) {
      console.error('❌ Error saving subscription:', saveError)
      return NextResponse.json(
        { error: 'Failed to save subscription', details: saveError.message },
        { status: 500 }
      )
    }

    // Update user profile with subscription info
    const { error: profileUpdateError } = await supabaseAdmin
      .from('user_profiles')
      .update({
        current_plan: planId,
        subscription_status: activeSubscription.status,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)

    if (profileUpdateError) {
      console.error('❌ Error updating user profile:', profileUpdateError)
    }

    console.log('✅ Subscription synced successfully!')

    return NextResponse.json({ 
      success: true,
      subscription: savedSubscription || subscriptionData,
      message: 'Subscription synced successfully'
    })

  } catch (error) {
    console.error('❌ Error syncing subscription:', error)
    return NextResponse.json(
      { error: 'Failed to sync subscription', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
