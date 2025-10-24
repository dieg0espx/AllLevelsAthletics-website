import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')
    
    console.log('🔍 GET Checkout Session Request:', { sessionId })
    
    if (!sessionId) {
      console.log('❌ No session ID provided')
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Validate session ID format (Stripe session IDs start with 'cs_')
    if (!sessionId.startsWith('cs_')) {
      console.log('⚠️ Invalid session ID format:', sessionId)
      return NextResponse.json(
        { 
          error: 'Invalid session ID format',
          details: 'Session ID must start with "cs_"'
        },
        { status: 400 }
      )
    }

    console.log('🔍 Retrieving session from Stripe:', sessionId)

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer']
    })

    console.log('✅ Session retrieved successfully:', {
      id: session.id,
      status: session.payment_status,
      mode: session.mode,
      customer: session.customer,
      subscription: session.subscription
    })

    return NextResponse.json({ 
      session: session,
      success: true 
    })

  } catch (error) {
    console.error('❌ Error retrieving checkout session:', error)
    
    // Handle specific Stripe errors
    if (error instanceof Error) {
      if (error.message.includes('No such checkout.session')) {
        return NextResponse.json(
          { 
            error: 'Checkout session not found',
            details: 'The session may have expired or been invalidated',
            code: 'SESSION_NOT_FOUND'
          },
          { status: 404 }
        )
      }
      
      if (error.message.includes('Invalid API key')) {
        return NextResponse.json(
          { 
            error: 'Stripe configuration error',
            details: 'Invalid API key configuration',
            code: 'STRIPE_CONFIG_ERROR'
          },
          { status: 500 }
        )
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to retrieve checkout session',
        details: error instanceof Error ? error.message : 'Unknown error',
        code: 'UNKNOWN_ERROR'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== GET CHECKOUT SESSION POST ===')
    
    const body = await request.json()
    console.log('Request body:', body)
    
    const { sessionId } = body
    
    if (!sessionId) {
      console.log('No session ID provided')
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    console.log('Retrieving session:', sessionId)

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    console.log('Retrieved session:', session.id, 'Client secret exists:', !!session.client_secret)

    if (!session) {
      console.log('Session not found')
      return NextResponse.json(
        { error: 'Checkout session not found' },
        { status: 404 }
      )
    }

    const response = { 
      clientSecret: session.client_secret,
      session: session,
      success: true 
    }
    
    console.log('Returning response with client secret:', !!response.clientSecret)
    return NextResponse.json(response)

  } catch (error) {
    console.error('Error retrieving checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve checkout session', details: error.message },
      { status: 500 }
    )
  }
}



