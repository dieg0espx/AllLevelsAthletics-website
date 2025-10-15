import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('=== DEBUG SUBSCRIPTION REQUEST ===')
    console.log('Request body:', JSON.stringify(body, null, 2))
    console.log('Plan ID:', body.planId)
    console.log('Billing Period:', body.billingPeriod)
    console.log('User ID:', body.userId)
    
    // Check environment variables
    console.log('=== ENVIRONMENT VARIABLES ===')
    console.log('STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY)
    console.log('STRIPE_SECRET_KEY starts with sk_live:', process.env.STRIPE_SECRET_KEY?.startsWith('sk_live_'))
    console.log('STRIPE_SECRET_KEY starts with sk_test:', process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_'))
    
    // Check all price IDs
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
    
    console.log('Price IDs:', JSON.stringify(priceIds, null, 2))
    
    // Check which price ID would be selected
    const planId = body.planId
    const billingPeriod = body.billingPeriod
    
    let selectedPriceId = null
    if (planId === 'foundation') {
      if (billingPeriod === 'annual') {
        selectedPriceId = process.env.STRIPE_FOUNDATION_ANNUAL_PRICE_ID
      } else if (billingPeriod === 'sixmonth') {
        selectedPriceId = process.env.STRIPE_FOUNDATION_SIXMONTH_PRICE_ID
      } else {
        selectedPriceId = process.env.STRIPE_FOUNDATION_MONTHLY_PRICE_ID
      }
    } else if (planId === 'growth') {
      if (billingPeriod === 'annual') {
        selectedPriceId = process.env.STRIPE_GROWTH_ANNUAL_PRICE_ID
      } else if (billingPeriod === 'sixmonth') {
        selectedPriceId = process.env.STRIPE_GROWTH_SIXMONTH_PRICE_ID
      } else {
        selectedPriceId = process.env.STRIPE_GROWTH_MONTHLY_PRICE_ID
      }
    } else if (planId === 'elite') {
      if (billingPeriod === 'annual') {
        selectedPriceId = process.env.STRIPE_ELITE_ANNUAL_PRICE_ID
      } else if (billingPeriod === 'sixmonth') {
        selectedPriceId = process.env.STRIPE_ELITE_SIXMONTH_PRICE_ID
      } else {
        selectedPriceId = process.env.STRIPE_ELITE_MONTHLY_PRICE_ID
      }
    }
    
    console.log('Selected Price ID:', selectedPriceId)
    console.log('Selected Price ID exists:', !!selectedPriceId)
    
    return NextResponse.json({
      success: true,
      debug: {
        requestBody: body,
        environment: {
          hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
          stripeKeyType: process.env.STRIPE_SECRET_KEY?.startsWith('sk_live_') ? 'live' : 
                        process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_') ? 'test' : 'unknown',
          priceIds: priceIds,
          selectedPriceId: selectedPriceId,
          selectedPriceIdExists: !!selectedPriceId
        }
      }
    })
    
  } catch (error) {
    console.error('Debug endpoint error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
