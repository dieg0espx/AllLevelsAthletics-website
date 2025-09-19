import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    console.log('=== DEBUGGING UPGRADE ISSUE ===')
    console.log('User ID:', userId)

    // Get user's subscription from database
    const { data: subscription, error: subError } = await supabaseAdmin
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .single()

    if (subError || !subscription) {
      console.error('Error fetching subscription:', subError)
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
    }

    console.log('Database subscription:', {
      id: subscription.id,
      status: subscription.status,
      plan_name: subscription.plan_name,
      plan_id: subscription.plan_id,
      stripe_subscription_id: subscription.stripe_subscription_id,
      updated_at: subscription.updated_at
    })

    // Get Stripe subscription details
    let stripeSubscription = null
    if (subscription.stripe_subscription_id) {
      try {
        stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripe_subscription_id)
        console.log('Stripe subscription:', {
          id: stripeSubscription.id,
          status: stripeSubscription.status,
          current_period_start: new Date(stripeSubscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
          items: stripeSubscription.items.data.map(item => ({
            price_id: item.price.id,
            amount: item.price.unit_amount,
            currency: item.price.currency,
            interval: item.price.recurring?.interval,
          }))
        })
      } catch (error) {
        console.error('Error fetching Stripe subscription:', error)
      }
    }

    // Get user profile
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('stripe_customer_id, current_plan, subscription_status')
      .eq('user_id', userId)
      .single()

    console.log('User profile:', userProfile)

    // Map price ID to plan information
    const PRICE_TO_PLAN = {
      [process.env.STRIPE_FOUNDATION_MONTHLY_PRICE_ID!]: { plan_id: 'foundation', plan_name: 'Foundation' },
      [process.env.STRIPE_GROWTH_MONTHLY_PRICE_ID!]: { plan_id: 'growth', plan_name: 'Growth' },
      [process.env.STRIPE_ELITE_MONTHLY_PRICE_ID!]: { plan_id: 'elite', plan_name: 'Elite' },
    }

    const currentPriceId = stripeSubscription?.items.data[0]?.price.id
    const planInfo = currentPriceId ? PRICE_TO_PLAN[currentPriceId] : null

    return NextResponse.json({
      success: true,
      database: {
        id: subscription.id,
        status: subscription.status,
        plan_name: subscription.plan_name,
        plan_id: subscription.plan_id,
        stripe_subscription_id: subscription.stripe_subscription_id,
        updated_at: subscription.updated_at,
      },
      stripe: stripeSubscription ? {
        id: stripeSubscription.id,
        status: stripeSubscription.status,
        current_period_start: new Date(stripeSubscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
        items: stripeSubscription.items.data.map(item => ({
          price_id: item.price.id,
          amount: item.price.unit_amount,
          currency: item.price.currency,
          interval: item.price.recurring?.interval,
        }))
      } : null,
      userProfile: userProfile,
      planMapping: {
        currentPriceId: currentPriceId,
        mappedPlan: planInfo,
        allPriceIds: {
          foundation: process.env.STRIPE_FOUNDATION_MONTHLY_PRICE_ID,
          growth: process.env.STRIPE_GROWTH_MONTHLY_PRICE_ID,
          elite: process.env.STRIPE_ELITE_MONTHLY_PRICE_ID,
        }
      },
      isInSync: stripeSubscription ? 
        subscription.status === stripeSubscription.status && 
        subscription.plan_name === planInfo?.plan_name : false
    })

  } catch (error) {
    console.error('Error debugging upgrade:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, sessionId } = await request.json()
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    console.log('=== MANUALLY SYNCING SUBSCRIPTION ===')
    console.log('User ID:', userId)
    console.log('Session ID:', sessionId)

    // If sessionId is provided, trigger webhook for that session
    if (sessionId) {
      const response = await fetch('http://localhost:3000/api/trigger-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      })
      
      const result = await response.json()
      console.log('Webhook trigger result:', result)
    }

    // Then sync the subscription
    const syncResponse = await fetch('http://localhost:3000/api/sync-subscription-after-upgrade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    })
    
    const syncResult = await syncResponse.json()
    console.log('Sync result:', syncResult)

    return NextResponse.json({
      success: true,
      webhookResult: sessionId ? await fetch('http://localhost:3000/api/trigger-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      }).then(r => r.json()) : null,
      syncResult: syncResult
    })

  } catch (error) {
    console.error('Error manually syncing:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
