import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function GET(request: NextRequest) {
  try {
    console.log('=== STRIPE CONFIGURATION TEST ===')
    
    // Test 1: Check if Stripe key exists
    const hasStripeKey = !!process.env.STRIPE_SECRET_KEY
    console.log('STRIPE_SECRET_KEY exists:', hasStripeKey)
    
    if (!hasStripeKey) {
      return NextResponse.json({
        success: false,
        error: 'STRIPE_SECRET_KEY not found in environment variables'
      }, { status: 500 })
    }
    
    // Test 2: Check key type
    const isLiveKey = process.env.STRIPE_SECRET_KEY!.startsWith('sk_live_')
    const isTestKey = process.env.STRIPE_SECRET_KEY!.startsWith('sk_test_')
    console.log('Key type - Live:', isLiveKey, 'Test:', isTestKey)
    
    // Test 3: Initialize Stripe
    let stripe: Stripe
    try {
      stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2025-05-28.basil',
      })
      console.log('✅ Stripe initialized successfully')
    } catch (stripeInitError) {
      console.error('❌ Stripe initialization failed:', stripeInitError)
      return NextResponse.json({
        success: false,
        error: 'Stripe initialization failed',
        details: stripeInitError instanceof Error ? stripeInitError.message : 'Unknown error'
      }, { status: 500 })
    }
    
    // Test 4: Check all price IDs
    const priceIds = {
      foundation_monthly: process.env.STRIPE_FOUNDATION_MONTHLY_PRICE_ID,
      foundation_annual: process.env.STRIPE_FOUNDATION_ANNUAL_PRICE_ID,
      foundation_sixmonth: process.env.STRIPE_FOUNDATION_SIXMONTH_PRICE_ID,
      growth_monthly: process.env.STRIPE_GROWTH_MONTHLY_PRICE_ID,
      growth_annual: process.env.STRIPE_GROWTH_ANNUAL_PRICE_ID,
      growth_sixmonth: process.env.STRIPE_GROWTH_SIXMONTH_PRICE_ID,
      elite_monthly: process.env.STRIPE_ELITE_MONTHLY_PRICE_ID,
      elite_annual: process.env.STRIPE_ELITE_ANNUAL_PRICE_ID,
      elite_sixmonth: process.env.STRIPE_ELITE_SIXMONTH_PRICE_ID,
    }
    
    console.log('Price IDs check:', priceIds)
    
    // Test 5: Validate one price ID with Stripe
    const testPriceId = process.env.STRIPE_FOUNDATION_MONTHLY_PRICE_ID
    let priceValidation = null
    
    if (testPriceId) {
      try {
        const price = await stripe.prices.retrieve(testPriceId)
        priceValidation = {
          id: price.id,
          active: price.active,
          amount: price.unit_amount,
          currency: price.currency,
          type: price.type
        }
        console.log('✅ Price validation successful:', priceValidation)
      } catch (priceError) {
        console.error('❌ Price validation failed:', priceError)
        priceValidation = {
          error: priceError instanceof Error ? priceError.message : 'Unknown error'
        }
      }
    }
    
    // Test 6: Check site URLs
    const siteUrls = {
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
      SITE_URL: process.env.SITE_URL,
      NODE_ENV: process.env.NODE_ENV
    }
    console.log('Site URLs:', siteUrls)
    
    return NextResponse.json({
      success: true,
      results: {
        stripeKey: {
          exists: hasStripeKey,
          type: isLiveKey ? 'live' : isTestKey ? 'test' : 'unknown',
          length: process.env.STRIPE_SECRET_KEY?.length || 0
        },
        stripeInitialized: true,
        priceIds: priceIds,
        priceValidation: priceValidation,
        siteUrls: siteUrls,
        allPriceIdsExist: Object.values(priceIds).every(id => !!id)
      }
    })
    
  } catch (error) {
    console.error('❌ Test endpoint error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
