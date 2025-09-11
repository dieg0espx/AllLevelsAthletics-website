import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      )
    }

    console.log('🔔 Received Stripe webhook:', event.type)

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('❌ Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('🛒 Checkout session completed:', session.id)
  
  if (session.mode === 'subscription' && session.subscription) {
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
    await handleSubscriptionCreated(subscription)
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('📝 Subscription created:', subscription.id)
  
  const userId = subscription.metadata?.userId
  if (!userId) {
    console.error('❌ No userId in subscription metadata')
    return
  }

  const planId = subscription.metadata?.planId
  const planName = subscription.metadata?.planName || 'Unknown Plan'
  const billingPeriod = subscription.metadata?.billingPeriod || 'monthly'

  // Get customer details
  const customer = await stripe.customers.retrieve(subscription.customer as string)
  const customerId = typeof customer === 'string' ? customer : customer.id

  // Create or update subscription record
  const subscriptionData = {
    user_id: userId,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription.id,
    plan_id: planId,
    plan_name: planName,
    status: subscription.status,
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    cancel_at_period_end: subscription.cancel_at_period_end,
    canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
    trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : null,
    trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
  }

  const { error } = await supabaseAdmin
    .from('user_subscriptions')
    .upsert(subscriptionData, { 
      onConflict: 'stripe_subscription_id',
      ignoreDuplicates: false 
    })

  if (error) {
    console.error('❌ Error saving subscription:', error)
    return
  }

  // Check if user profile exists, if not create it
  const { data: existingProfile, error: checkError } = await supabaseAdmin
    .from('user_profiles')
    .select('id, role')
    .eq('user_id', userId)
    .single()

  if (checkError && checkError.code === 'PGRST116') {
    // Profile doesn't exist, create it
    const { error: createError } = await supabaseAdmin
      .from('user_profiles')
      .insert([{
        user_id: userId,
        role: 'client',
        current_plan: planId,
        subscription_status: subscription.status,
        stripe_customer_id: customerId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])

    if (createError) {
      console.error('❌ Error creating user profile:', createError)
    } else {
      console.log('✅ Created new user profile with role: client')
    }
  } else if (checkError) {
    console.error('❌ Error checking user profile:', checkError)
  } else {
    // Profile exists, update it
    const { error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .update({
        current_plan: planId,
        subscription_status: subscription.status,
        stripe_customer_id: customerId,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)

    if (profileError) {
      console.error('❌ Error updating user profile:', profileError)
    } else {
      console.log('✅ Updated existing user profile')
    }
  }

  console.log('✅ Subscription created and saved successfully')
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('🔄 Subscription updated:', subscription.id)
  
  const userId = subscription.metadata?.userId
  if (!userId) {
    console.error('❌ No userId in subscription metadata')
    return
  }

  // Update subscription record
  const subscriptionData = {
    status: subscription.status,
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    cancel_at_period_end: subscription.cancel_at_period_end,
    canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
    trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : null,
    trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
  }

  const { error } = await supabaseAdmin
    .from('user_subscriptions')
    .update(subscriptionData)
    .eq('stripe_subscription_id', subscription.id)

  if (error) {
    console.error('❌ Error updating subscription:', error)
    return
  }

  // Update user profile status
  const { error: profileError } = await supabaseAdmin
    .from('user_profiles')
    .update({
      subscription_status: subscription.status,
    })
    .eq('user_id', userId)

  if (profileError) {
    console.error('❌ Error updating user profile:', profileError)
  }

  console.log('✅ Subscription updated successfully')
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('🗑️ Subscription deleted:', subscription.id)
  
  // Update subscription status to canceled
  const { error } = await supabaseAdmin
    .from('user_subscriptions')
    .update({
      status: 'canceled',
      canceled_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id)

  if (error) {
    console.error('❌ Error updating deleted subscription:', error)
    return
  }

  // Update user profile
  const { error: profileError } = await supabaseAdmin
    .from('user_profiles')
    .update({
      subscription_status: 'canceled',
      current_plan: null,
    })
    .eq('user_id', subscription.metadata?.userId)

  if (profileError) {
    console.error('❌ Error updating user profile for deleted subscription:', profileError)
  }

  console.log('✅ Subscription deletion handled successfully')
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('💰 Invoice payment succeeded:', invoice.id)
  
  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string)
    await handleSubscriptionUpdated(subscription)
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('❌ Invoice payment failed:', invoice.id)
  
  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string)
    await handleSubscriptionUpdated(subscription)
  }
}



