import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

export async function POST(request: NextRequest) {
  let baseUrl: string
  let successUrl: string
  let cancelUrl: string

  try {
    const { plan } = await request.json()
    
    console.log('=== PLAN CHECKOUT SESSION CREATION ===')
    console.log('Plan data received:', plan)

    if (!plan) {
      console.error('❌ No plan data provided')
      return NextResponse.json(
        { error: 'Plan data is required' },
        { status: 400 }
      )
    }

    // Validate plan data
    if (!plan.id || !plan.name || !plan.price) {
      console.error('❌ Invalid plan data:', plan)
      return NextResponse.json(
        { error: 'Invalid plan data. Plan must have id, name, and price.' },
        { status: 400 }
      )
    }

    // Ensure price is a valid number
    const price = typeof plan.price === 'number' ? plan.price : parseFloat(plan.price)
    if (isNaN(price) || price <= 0) {
      console.error('❌ Invalid price for plan:', plan.name, plan.price)
      return NextResponse.json(
        { error: `Invalid price for plan ${plan.name}: ${plan.price}` },
        { status: 400 }
      )
    }

    // Get base URL - use environment variable or fallback
    if (process.env.NODE_ENV === 'production') {
      baseUrl = 'https://www.alllevelsathletics.com'
    } else {
      // For development, use localhost or the configured development URL
      baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    }
    
    console.log('Using baseUrl from env:', baseUrl)
    
    // Create URLs for plan checkout (no shipping needed)
    successUrl = `${baseUrl}/plan-success?session_id={CHECKOUT_SESSION_ID}`
    cancelUrl = `${baseUrl}/services`
    
    console.log('Success URL:', successUrl)
    console.log('Cancel URL:', cancelUrl)

    // Convert relative image URLs to absolute URLs for Stripe
    let imageUrl = null
    if (plan.image) {
      if (plan.image.startsWith('http')) {
        // Already an absolute URL
        imageUrl = plan.image
      } else {
        // Convert relative URL to absolute URL
        imageUrl = `${baseUrl}${plan.image}`
      }
    }

    // Create line item for the training plan
    const lineItem = {
      price_data: {
        currency: 'usd',
        product_data: {
          name: plan.name || 'Training Plan',
          description: plan.description || 'Professional training plan',
          images: imageUrl ? [imageUrl] : [],
        },
        unit_amount: Math.round(price * 100), // Convert to cents
      },
      quantity: plan.quantity || 1,
    }
    
    console.log('Created line item:', lineItem)
    if (imageUrl) {
      console.log('Plan image URL:', imageUrl)
    }

    // Create Stripe checkout session for training plan
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [lineItem],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        planId: plan.id,
        planName: plan.name,
        planType: 'training_plan',
        // No shipping info needed for digital plans
      },
      // No shipping address collection needed for digital plans
      shipping_address_collection: undefined,
      // No automatic tax calculation for now
      automatic_tax: { enabled: false },
      // Add custom shipping information for display
      custom_text: {
        submit: {
          message: 'Free standard shipping on all US orders\n\nEstimated delivery: 3-5 business days\n\nYour training plan will be delivered digitally via email within 24 hours of purchase.',
        },
      },
    })

    console.log('✅ Stripe checkout session created successfully')
    console.log('Session ID:', session.id)
    console.log('Session URL:', session.url)

    return NextResponse.json({ 
      sessionId: session.id,
      sessionUrl: session.url 
    })

  } catch (error) {
    console.error('❌ Error creating plan checkout session:', error)
    
    // Handle specific Stripe errors
    if (error instanceof Stripe.errors.StripeError) {
      console.error('Stripe error details:', {
        type: error.type,
        code: error.code,
        message: error.message,
        decline_code: error.decline_code,
      })
      
      return NextResponse.json(
        { 
          error: `Stripe error: ${error.message}`,
          type: error.type,
          code: error.code 
        },
        { status: 400 }
      )
    }
    
    // Handle other errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    console.error('Non-Stripe error:', errorMessage)
    
    return NextResponse.json(
      { error: `Failed to create checkout session: ${errorMessage}` },
      { status: 500 }
    )
  }
}
