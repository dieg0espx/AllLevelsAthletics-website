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

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    console.log('=== DEBUGGING STRIPE SUBSCRIPTION ===')
    console.log('User ID:', userId)

    // Get user's subscription from database (get the most recent one)
    const { data: subscriptions, error: subError } = await supabaseAdmin
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    if (subError || !subscriptions || subscriptions.length === 0) {
      console.error('Error fetching subscription:', subError)
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
    }

    const subscription = subscriptions[0] // Get the most recent subscription

    console.log('Database subscription:', {
      plan_name: subscription.plan_name,
      plan_id: subscription.plan_id,
      stripe_subscription_id: subscription.stripe_subscription_id,
      current_period_start: subscription.current_period_start,
      current_period_end: subscription.current_period_end,
    })

    // Get Stripe subscription details
    const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripe_subscription_id)
    
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
        product_name: item.price.product,
      })),
      latest_invoice: stripeSubscription.latest_invoice,
    })

    // Get the latest invoice
    if (stripeSubscription.latest_invoice) {
      const invoice = await stripe.invoices.retrieve(stripeSubscription.latest_invoice as string)
      console.log('Latest invoice:', {
        id: invoice.id,
        amount_paid: invoice.amount_paid,
        amount_due: invoice.amount_due,
        total: invoice.total,
        currency: invoice.currency,
        status: invoice.status,
        period_start: new Date(invoice.period_start * 1000).toISOString(),
        period_end: new Date(invoice.period_end * 1000).toISOString(),
      })
    }

    // Get upcoming invoice (only if subscription is active)
    let upcomingInvoice = null
    if (stripeSubscription.status === 'active') {
      try {
        upcomingInvoice = await stripe.invoices.retrieveUpcoming({
          customer: subscription.stripe_customer_id,
        })
        
        console.log('Upcoming invoice:', {
          amount_due: upcomingInvoice.amount_due,
          total: upcomingInvoice.total,
          currency: upcomingInvoice.currency,
          period_start: new Date(upcomingInvoice.period_start * 1000).toISOString(),
          period_end: new Date(upcomingInvoice.period_end * 1000).toISOString(),
        })
      } catch (error) {
        console.log('No upcoming invoice found or error retrieving it:', error)
      }
    } else {
      console.log('Subscription is not active, skipping upcoming invoice retrieval')
    }

    return NextResponse.json({
      success: true,
      database_subscription: subscription,
      stripe_subscription: {
        id: stripeSubscription.id,
        status: stripeSubscription.status,
        current_period_start: new Date(stripeSubscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
        items: stripeSubscription.items.data.map(item => ({
          price_id: item.price.id,
          amount: item.price.unit_amount,
          currency: item.price.currency,
          interval: item.price.recurring?.interval,
        })),
      },
      latest_invoice: stripeSubscription.latest_invoice ? {
        id: stripeSubscription.latest_invoice,
        amount_paid: (await stripe.invoices.retrieve(stripeSubscription.latest_invoice as string)).amount_paid,
        amount_due: (await stripe.invoices.retrieve(stripeSubscription.latest_invoice as string)).amount_due,
        total: (await stripe.invoices.retrieve(stripeSubscription.latest_invoice as string)).total,
        currency: (await stripe.invoices.retrieve(stripeSubscription.latest_invoice as string)).currency,
        status: (await stripe.invoices.retrieve(stripeSubscription.latest_invoice as string)).status,
      } : null,
      upcoming_invoice: upcomingInvoice ? {
        amount_due: upcomingInvoice.amount_due,
        total: upcomingInvoice.total,
        currency: upcomingInvoice.currency,
        period_start: new Date(upcomingInvoice.period_start * 1000).toISOString(),
        period_end: new Date(upcomingInvoice.period_end * 1000).toISOString(),
      } : null
    })

  } catch (error) {
    console.error('Error debugging Stripe subscription:', error)
    return NextResponse.json({ error: 'Failed to debug subscription' }, { status: 500 })
  }
}
