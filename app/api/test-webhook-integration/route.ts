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

    console.log('=== TESTING WEBHOOK INTEGRATION ===')
    console.log('User ID:', userId)

    // Check environment variables
    const envCheck = {
      STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET: !!process.env.STRIPE_WEBHOOK_SECRET,
      STRIPE_FOUNDATION_MONTHLY_PRICE_ID: !!process.env.STRIPE_FOUNDATION_MONTHLY_PRICE_ID,
      STRIPE_GROWTH_MONTHLY_PRICE_ID: !!process.env.STRIPE_GROWTH_MONTHLY_PRICE_ID,
      STRIPE_ELITE_MONTHLY_PRICE_ID: !!process.env.STRIPE_ELITE_MONTHLY_PRICE_ID,
    }

    console.log('Environment variables check:', envCheck)

    // Get user's subscription
    const { data: subscription, error: subError } = await supabaseAdmin
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .single()

    if (subError || !subscription) {
      return NextResponse.json({ 
        error: 'No subscription found',
        envCheck,
        recommendation: 'Create a subscription first'
      }, { status: 404 })
    }

    console.log('Current subscription:', {
      id: subscription.id,
      plan_name: subscription.plan_name,
      plan_id: subscription.plan_id,
      stripe_subscription_id: subscription.stripe_subscription_id,
      status: subscription.status
    })

    // Get Stripe subscription
    let stripeSubscription = null
    if (subscription.stripe_subscription_id) {
      try {
        stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripe_subscription_id)
        console.log('Stripe subscription:', {
          id: stripeSubscription.id,
          status: stripeSubscription.status,
          current_price_id: stripeSubscription.items.data[0].price.id
        })
      } catch (error) {
        console.error('Error fetching Stripe subscription:', error)
      }
    }

    // Test webhook endpoint accessibility
    const webhookTest = await fetch('http://localhost:3000/api/stripe-webhook', {
      method: 'GET'
    }).catch(err => ({ error: err.message }))

    return NextResponse.json({
      success: true,
      envCheck,
      currentSubscription: {
        database: {
          id: subscription.id,
          plan_name: subscription.plan_name,
          plan_id: subscription.plan_id,
          status: subscription.status,
          stripe_subscription_id: subscription.stripe_subscription_id,
          updated_at: subscription.updated_at
        },
        stripe: stripeSubscription ? {
          id: stripeSubscription.id,
          status: stripeSubscription.status,
          current_price_id: stripeSubscription.items.data[0].price.id,
          current_period_start: new Date(stripeSubscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
        } : null
      },
      webhookEndpoint: {
        accessible: !webhookTest.error,
        error: webhookTest.error
      },
      recommendations: [
        '1. Check Stripe Dashboard → Developers → Webhooks',
        '2. Verify endpoint URL is: https://your-domain.com/api/stripe-webhook',
        '3. Ensure these events are enabled: checkout.session.completed, customer.subscription.updated',
        '4. Check webhook secret matches STRIPE_WEBHOOK_SECRET in .env.local'
      ]
    })

  } catch (error) {
    console.error('Error testing webhook integration:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, testType } = await request.json()
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    console.log('=== TESTING WEBHOOK TRIGGER ===')
    console.log('User ID:', userId)
    console.log('Test Type:', testType)

    if (testType === 'create_test_session') {
      // Create a test checkout session to trigger webhook
      const { data: subscription, error: subError } = await supabaseAdmin
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single()

      if (subError || !subscription) {
        return NextResponse.json({ error: 'No active subscription found' }, { status: 404 })
      }

      // Get user's Stripe customer ID
      const { data: userProfile, error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .select('stripe_customer_id')
        .eq('user_id', userId)
        .single()

      if (profileError || !userProfile?.stripe_customer_id) {
        return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
      }

      // Create a test checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price: process.env.STRIPE_GROWTH_MONTHLY_PRICE_ID,
          quantity: 1,
        }],
        mode: 'payment',
        customer: userProfile.stripe_customer_id,
        success_url: 'http://localhost:3000/dashboard/coaching?upgrade=success&plan=growth',
        cancel_url: 'http://localhost:3000/dashboard/coaching',
        metadata: {
          userId: userId,
          planId: 'growth',
          planName: 'Growth',
          type: 'upgrade',
          fromPlan: subscription.plan_name,
          isUpgrade: 'true'
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Test checkout session created',
        sessionId: session.id,
        sessionUrl: session.url,
        instructions: [
          '1. Complete the checkout session',
          '2. Check server logs for webhook events',
          '3. Verify subscription is updated'
        ]
      })
    }

    if (testType === 'trigger_webhook') {
      // Manually trigger webhook for existing session
      const { sessionId } = await request.json()
      
      if (!sessionId) {
        return NextResponse.json({ error: 'Session ID is required for webhook trigger' }, { status: 400 })
      }

      // Get the session from Stripe
      const session = await stripe.checkout.sessions.retrieve(sessionId)
      
      // Create mock webhook event
      const mockEvent = {
        id: `evt_test_${Date.now()}`,
        object: 'event',
        type: 'checkout.session.completed',
        data: { object: session },
        created: Math.floor(Date.now() / 1000),
        livemode: false,
        pending_webhooks: 1,
        request: { id: null, idempotency_key: null }
      }

      // Trigger webhook
      const webhookResponse = await fetch('http://localhost:3000/api/stripe-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'stripe-signature': 'manual_trigger'
        },
        body: JSON.stringify(mockEvent)
      })

      const webhookResult = await webhookResponse.json()

      return NextResponse.json({
        success: true,
        message: 'Webhook triggered manually',
        webhookResult,
        sessionData: {
          id: session.id,
          metadata: session.metadata,
          payment_status: session.payment_status
        }
      })
    }

    return NextResponse.json({ error: 'Invalid test type' }, { status: 400 })

  } catch (error) {
    console.error('Error testing webhook:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
