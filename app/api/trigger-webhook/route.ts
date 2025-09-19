import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json()
    
    console.log('=== MANUALLY TRIGGERING WEBHOOK ===')
    console.log('Session ID:', sessionId)

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Get the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    
    console.log('Retrieved session:', {
      id: session.id,
      mode: session.mode,
      payment_status: session.payment_status,
      metadata: session.metadata
    })

    // Create a mock webhook event
    const mockEvent = {
      id: `evt_${Date.now()}`,
      object: 'event',
      type: 'checkout.session.completed',
      data: {
        object: session
      },
      created: Math.floor(Date.now() / 1000),
      livemode: false,
      pending_webhooks: 1,
      request: {
        id: null,
        idempotency_key: null
      }
    }

    console.log('Mock webhook event created:', mockEvent.id)

    // Call our webhook handler directly
    const webhookResponse = await fetch('http://localhost:3000/api/stripe-webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': 'manual_trigger'
      },
      body: JSON.stringify(mockEvent)
    })

    const webhookResult = await webhookResponse.json()
    
    console.log('Webhook response:', webhookResult)

    return NextResponse.json({
      success: true,
      message: 'Webhook triggered manually',
      sessionId: sessionId,
      webhookResult: webhookResult
    })

  } catch (error) {
    console.error('❌ Error triggering webhook:', error)
    return NextResponse.json(
      { error: 'Failed to trigger webhook' },
      { status: 500 }
    )
  }
}
