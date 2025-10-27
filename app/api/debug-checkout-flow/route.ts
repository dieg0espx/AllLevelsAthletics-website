import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')
    
    console.log('🔍 DEBUG CHECKOUT FLOW - Session ID:', sessionId)
    
    // Check environment variables
    const envCheck = {
      STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
      STRIPE_SECRET_KEY_TYPE: process.env.STRIPE_SECRET_KEY?.startsWith('sk_live_') ? 'live' : 
                             process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_') ? 'test' : 'unknown',
      STRIPE_WEBHOOK_SECRET: !!process.env.STRIPE_WEBHOOK_SECRET,
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    }
    
    console.log('🔍 Environment Check:', envCheck)
    
    if (!sessionId) {
      return NextResponse.json({
        success: false,
        error: 'No session ID provided',
        envCheck,
        instructions: 'Add ?session_id=cs_xxxxx to the URL'
      })
    }
    
    // Validate session ID format
    if (!sessionId.startsWith('cs_')) {
      return NextResponse.json({
        success: false,
        error: 'Invalid session ID format',
        sessionId,
        envCheck,
        instructions: 'Session ID must start with "cs_"'
      })
    }
    
    // Try to retrieve the session from Stripe
    let session: any = null
    let stripeError: any = null
    
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['subscription', 'customer', 'payment_intent']
      })
      console.log('✅ Session retrieved successfully:', {
        id: session.id,
        status: session.payment_status,
        mode: session.mode,
        success_url: session.success_url,
        cancel_url: session.cancel_url,
        customer: session.customer,
        subscription: session.subscription
      })
    } catch (error) {
      stripeError = error
      console.error('❌ Error retrieving session:', error)
    }
    
    // Check if session exists and is completed
    const sessionStatus = {
      exists: !!session,
      payment_status: session?.payment_status,
      mode: session?.mode,
      success_url: session?.success_url,
      cancel_url: session?.cancel_url,
      customer_id: session?.customer,
      subscription_id: session?.subscription,
      metadata: session?.metadata,
      created: session?.created,
      expires_at: session?.expires_at,
    }
    
    // Check webhook events for this session
    let webhookEvents: any[] = []
    try {
      const events = await stripe.events.list({
        type: 'checkout.session.completed',
        created: {
          gte: Math.floor(Date.now() / 1000) - 3600 // Last hour
        }
      })
      
      webhookEvents = events.data.filter(event => 
        event.data.object.id === sessionId
      )
      
      console.log('🔍 Webhook events found:', webhookEvents.length)
    } catch (error) {
      console.error('❌ Error checking webhook events:', error)
    }
    
    // Determine the issue
    let diagnosis = 'Unknown issue'
    let recommendations: string[] = []
    
    if (!session) {
      diagnosis = 'Session not found in Stripe'
      recommendations = [
        'Check if the session ID is correct',
        'Verify the session hasn\'t expired',
        'Ensure you\'re using the correct Stripe environment (test vs live)'
      ]
    } else if (session.payment_status !== 'paid') {
      diagnosis = 'Payment not completed'
      recommendations = [
        'The payment may still be processing',
        'Check if the payment was actually completed',
        'Verify the payment method was valid'
      ]
    } else if (webhookEvents.length === 0) {
      diagnosis = 'Webhook not processed'
      recommendations = [
        'Check webhook endpoint configuration in Stripe dashboard',
        'Verify webhook secret is correct',
        'Check webhook endpoint is accessible from Stripe',
        'Look for webhook processing errors in logs'
      ]
    } else {
      diagnosis = 'Session completed successfully'
      recommendations = [
        'Check success page logic',
        'Verify user authentication state',
        'Check if session data is being retrieved correctly'
      ]
    }
    
    return NextResponse.json({
      success: true,
      sessionId,
      envCheck,
      sessionStatus,
      webhookEvents: webhookEvents.map(event => ({
        id: event.id,
        created: event.created,
        type: event.type,
        processed: true
      })),
      stripeError: stripeError ? {
        message: stripeError.message,
        type: stripeError.type,
        code: stripeError.code
      } : null,
      diagnosis,
      recommendations,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Debug checkout flow error:', error)
    return NextResponse.json({
      success: false,
      error: 'Debug failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
