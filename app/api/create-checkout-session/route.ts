import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  // Declare variables at function scope for error handling
  let baseUrl: string
  let successUrl: string
  let cancelUrl: string
  
  try {
    // Debug: Log all environment variables
    console.log('=== ENVIRONMENT VARIABLES DEBUG ===')
    console.log('NODE_ENV:', process.env.NODE_ENV)
    console.log('STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY)
    console.log('STRIPE_SECRET_KEY length:', process.env.STRIPE_SECRET_KEY?.length || 0)
    console.log('SITE_URL:', process.env.SITE_URL)
    console.log('NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL)
    console.log('All env keys:', Object.keys(process.env).filter(key => key.includes('SITE') || key.includes('URL')))
    console.log('================================')
    
    // Check if Stripe secret key is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not configured')
      return NextResponse.json(
        { error: 'Stripe is not configured. Please check environment variables.' },
        { status: 500 }
      )
    }
    
    // Initialize Stripe
    let stripe: Stripe
    try {
      stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2025-05-28.basil',
        typescript: true,
        appInfo: {
          name: 'All Levels Athletics',
          version: '1.0.0',
        },
      })
      console.log('Stripe instance created successfully')
    } catch (stripeInitError) {
      console.error('Failed to initialize Stripe:', stripeInitError)
      return NextResponse.json(
        { error: 'Failed to initialize Stripe payment processor' },
        { status: 500 }
      )
    }

  let items: any[]
  let shippingInfo: any
  let userEmail: string
  
  try {
    const requestBody = await request.json()
    items = requestBody.items
    shippingInfo = requestBody.shippingInfo
    userEmail = requestBody.userEmail
      
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid request body format' },
        { status: 400 }
      )
    }

    // Validate required data
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or empty items array' },
        { status: 400 }
      )
    }

    if (!shippingInfo) {
      console.error('Validation failed: shippingInfo is missing')
      return NextResponse.json(
        { error: 'Shipping information is required' },
        { status: 400 }
      )
    }

    // Validate required shipping fields
    const requiredFields = ['firstName', 'lastName', 'phone', 'address', 'city', 'state', 'zipCode']
    const missingFields = requiredFields.filter(field => !shippingInfo[field])
    
    if (missingFields.length > 0) {
      console.error('Validation failed: missing shipping fields:', missingFields)
      return NextResponse.json(
        { error: `Missing required shipping fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Get base URL from environment or fallback to localhost
    baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'http://localhost:3000'
    
    console.log('=== URL DEBUGGING ===')
    console.log('Using baseUrl from env:', baseUrl)

    // Create line items from cart items
    const lineItems = items.map((item: any) => {
      console.log('Processing item:', item)
      
      // Ensure price is a valid number
      const price = typeof item.price === 'number' ? item.price : parseFloat(item.price)
      if (isNaN(price) || price <= 0) {
        throw new Error(`Invalid price for item ${item.name}: ${item.price}`)
      }
      
      // Convert relative image URLs to absolute URLs for Stripe
      let imageUrl = null
      if (item.image) {
        if (item.image.startsWith('http')) {
          // Already an absolute URL
          imageUrl = item.image
        } else {
          // Convert relative URL to absolute URL
          imageUrl = `${baseUrl}${item.image}`
        }
      }
      
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name || 'Product',
            description: item.description || 'Product description',
            images: imageUrl ? [imageUrl] : [],
          },
          unit_amount: Math.round(price * 100), // Convert to cents
        },
        quantity: item.quantity || 1,
      }
    })
    
    console.log('Created line items:', lineItems)
    console.log('Image URLs being sent to Stripe:')
    lineItems.forEach((item, index) => {
      if (item.price_data.product_data.images && item.price_data.product_data.images.length > 0) {
        console.log(`Item ${index + 1} image:`, item.price_data.product_data.images[0])
      }
    })
    
    console.log('=== URL DEBUGGING ===')
    console.log('Using baseUrl from env:', baseUrl)
    
    // Validate that the URLs are properly formatted
    // Stripe requires the exact format: {CHECKOUT_SESSION_ID} as a placeholder
    successUrl = `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`
    cancelUrl = `${baseUrl}/checkout`
    
    console.log('Success URL:', successUrl)
    console.log('Cancel URL:', cancelUrl)
    console.log('Success URL length:', successUrl.length)
    console.log('Cancel URL length:', cancelUrl.length)
    
    // Additional URL validation for Stripe
    if (successUrl.length > 2048) {
      throw new Error('Success URL is too long for Stripe (max 2048 characters)')
    }
    if (cancelUrl.length > 2048) {
      throw new Error('Cancel URL is too long for Stripe (max 2048 characters)')
    }
    
    // Test URL validity and ensure they're properly formatted for Stripe
    try {
      const successUrlObj = new URL(successUrl)
      const cancelUrlObj = new URL(cancelUrl)
      
      // Ensure URLs are HTTP/HTTPS
      if (!['http:', 'https:'].includes(successUrlObj.protocol)) {
        throw new Error(`Invalid protocol for success URL: ${successUrlObj.protocol}`)
      }
      if (!['http:', 'https:'].includes(cancelUrlObj.protocol)) {
        throw new Error(`Invalid protocol for cancel URL: ${cancelUrlObj.protocol}`)
      }
      
      console.log('URLs are valid and properly formatted')
      console.log('Success URL protocol:', successUrlObj.protocol)
      console.log('Cancel URL protocol:', cancelUrlObj.protocol)
    } catch (urlError) {
      console.error('URL validation failed:', urlError)
      return NextResponse.json(
        { 
          error: 'Invalid checkout URLs. Please check your site configuration.',
          details: {
            urlError: urlError.message,
            baseUrl,
            successUrl,
            cancelUrl
          }
        },
        { status: 400 }
      )
    }
    console.log('=== END URL DEBUGGING ===')

    // Create Stripe checkout session
    const sessionData = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: userEmail, // Use the logged-in user's email
      metadata: {
        items: JSON.stringify(items.map((item: any) => ({ id: item.id, name: item.name }))),
        shippingInfo: JSON.stringify(shippingInfo),
      },
      // Removed shipping_address_collection - using registered user's address
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 0,
              currency: 'usd',
            },
            display_name: 'Free shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 3,
              },
              maximum: {
                unit: 'business_day',
                value: 7,
              },
            },
          },
        },
      ],
    }

    console.log('Creating Stripe session with data:', JSON.stringify(sessionData, null, 2))

    console.log('Attempting to create Stripe session...')
    console.log('Final session data being sent to Stripe:')
    console.log('- success_url:', sessionData.success_url)
    console.log('- cancel_url:', sessionData.cancel_url)
    console.log('- mode:', sessionData.mode)
    console.log('- line_items count:', sessionData.line_items.length)
    
    let session: any
    try {
      session = await stripe.checkout.sessions.create(sessionData)
      console.log('Stripe session created successfully:', session.id)
    } catch (stripeError) {
      console.error('Stripe session creation failed:', stripeError)
      if (stripeError instanceof Stripe.errors.StripeError) {
        console.error('Stripe error type:', stripeError.type)
        console.error('Stripe error code:', stripeError.code)
        console.error('Stripe error message:', stripeError.message)
      }
      throw stripeError // Re-throw to be caught by outer catch
    }

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    
    // Provide more specific error messages
    if (error instanceof Stripe.errors.StripeError) {
      console.error('Stripe error details:', {
        type: error.type,
        code: error.code,
        message: error.message,
        decline_code: error.decline_code,
        param: error.param
      })
      
      // Handle specific URL-related errors
      if (error.message.includes('Not a valid URL') || error.message.includes('Invalid checkout URLs')) {
        console.error('URL validation failed. Base URL:', baseUrl)
        console.error('Success URL:', successUrl)
        console.error('Cancel URL:', cancelUrl)
        console.error('Environment variables:')
        console.error('- NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL)
        console.error('- SITE_URL:', process.env.SITE_URL)
        console.error('- NODE_ENV:', process.env.NODE_ENV)
        return NextResponse.json(
          { 
            error: 'Invalid checkout URLs. Please check your site configuration.',
            details: {
              baseUrl,
              successUrl,
              cancelUrl,
              envVars: {
                NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
                SITE_URL: process.env.SITE_URL,
                NODE_ENV: process.env.NODE_ENV
              }
            }
          },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { error: `Stripe error: ${error.message}` },
        { status: 400 }
      )
    }
    
    // Log the full error for debugging
    console.error('Full error object:', JSON.stringify(error, null, 2))
    
    return NextResponse.json(
      { error: 'Failed to create checkout session. Please try again.' },
      { status: 500 }
    )
  }
}
