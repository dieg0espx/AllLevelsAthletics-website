import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer']
    })

    return NextResponse.json({ 
      session: session,
      success: true 
    })

  } catch (error) {
    console.error('Error retrieving checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve checkout session' },
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



