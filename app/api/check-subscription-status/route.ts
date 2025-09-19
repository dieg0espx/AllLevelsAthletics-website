import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    console.log('=== CHECKING SUBSCRIPTION STATUS ===')
    console.log('User ID:', userId)

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

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
      current_period_start: subscription.current_period_start,
      current_period_end: subscription.current_period_end,
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

    return NextResponse.json({
      success: true,
      database: {
        id: subscription.id,
        status: subscription.status,
        plan_name: subscription.plan_name,
        plan_id: subscription.plan_id,
        stripe_subscription_id: subscription.stripe_subscription_id,
        current_period_start: subscription.current_period_start,
        current_period_end: subscription.current_period_end,
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
      isInSync: stripeSubscription ? subscription.status === stripeSubscription.status : false
    })

  } catch (error) {
    console.error('Error checking subscription status:', error)
    return NextResponse.json({ error: 'Failed to check subscription status' }, { status: 500 })
  }
}

