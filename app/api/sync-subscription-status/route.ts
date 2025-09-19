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

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()
    
    console.log('=== SYNCING SUBSCRIPTION STATUS ===')
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

    console.log('Database subscription status:', subscription.status)
    console.log('Stripe subscription ID:', subscription.stripe_subscription_id)

    // Get Stripe subscription details
    if (!subscription.stripe_subscription_id) {
      return NextResponse.json({ error: 'No Stripe subscription ID found' }, { status: 400 })
    }

    const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripe_subscription_id)
    console.log('Stripe subscription status:', stripeSubscription.status)

    // Compare statuses and sync if different
    if (subscription.status !== stripeSubscription.status) {
      console.log(`Status mismatch detected: DB=${subscription.status}, Stripe=${stripeSubscription.status}`)
      
      // Update database to match Stripe
      const { error: updateError } = await supabaseAdmin
        .from('user_subscriptions')
        .update({
          status: stripeSubscription.status,
          current_period_start: new Date(stripeSubscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', subscription.id)

      if (updateError) {
        console.error('Error updating subscription status:', updateError)
        return NextResponse.json({ error: 'Failed to update subscription status' }, { status: 500 })
      }

      console.log('✅ Subscription status synced successfully')
      
      return NextResponse.json({
        success: true,
        message: 'Subscription status synced successfully',
        previousStatus: subscription.status,
        newStatus: stripeSubscription.status,
        subscription: {
          id: subscription.id,
          status: stripeSubscription.status,
          current_period_start: new Date(stripeSubscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
        }
      })
    } else {
      console.log('✅ Subscription statuses are already in sync')
      
      return NextResponse.json({
        success: true,
        message: 'Subscription statuses are already in sync',
        status: subscription.status,
        subscription: {
          id: subscription.id,
          status: subscription.status,
          current_period_start: subscription.current_period_start,
          current_period_end: subscription.current_period_end,
        }
      })
    }

  } catch (error) {
    console.error('Error syncing subscription status:', error)
    return NextResponse.json({ error: 'Failed to sync subscription status' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    console.log('=== CHECKING SUBSCRIPTION SYNC STATUS ===')
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

    // Get Stripe subscription details
    if (!subscription.stripe_subscription_id) {
      return NextResponse.json({ 
        error: 'No Stripe subscription ID found',
        databaseStatus: subscription.status 
      }, { status: 400 })
    }

    const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripe_subscription_id)

    const isInSync = subscription.status === stripeSubscription.status

    return NextResponse.json({
      success: true,
      isInSync,
      database: {
        status: subscription.status,
        current_period_start: subscription.current_period_start,
        current_period_end: subscription.current_period_end,
      },
      stripe: {
        status: stripeSubscription.status,
        current_period_start: new Date(stripeSubscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
      },
      needsSync: !isInSync
    })

  } catch (error) {
    console.error('Error checking subscription sync status:', error)
    return NextResponse.json({ error: 'Failed to check subscription sync status' }, { status: 500 })
  }
}

