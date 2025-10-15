import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

export async function POST(request: NextRequest) {
  try {
    const { customerId } = await request.json()
    
    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      )
    }

    console.log('🔍 Fetching Stripe customer:', customerId)

    // Fetch customer details
    const customer = await stripe.customers.retrieve(customerId)
    
    // Fetch all subscriptions for this customer
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 10,
    })

    // Fetch all payment intents for this customer
    const paymentIntents = await stripe.paymentIntents.list({
      customer: customerId,
      limit: 10,
    })

    // Fetch all checkout sessions for this customer
    const checkoutSessions = await stripe.checkout.sessions.list({
      customer: customerId,
      limit: 10,
    })

    console.log('📊 Customer:', customer)
    console.log('📋 Subscriptions:', subscriptions.data.length)
    console.log('💳 Payment Intents:', paymentIntents.data.length)
    console.log('🛒 Checkout Sessions:', checkoutSessions.data.length)

    return NextResponse.json({ 
      success: true,
      customer,
      subscriptions: subscriptions.data,
      paymentIntents: paymentIntents.data,
      checkoutSessions: checkoutSessions.data
    })

  } catch (error) {
    console.error('❌ Error fetching Stripe data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Stripe data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

