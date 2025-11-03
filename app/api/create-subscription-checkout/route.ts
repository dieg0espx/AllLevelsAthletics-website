import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase, supabaseAdmin } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

// Define the subscription plans with their Stripe price IDs
const SUBSCRIPTION_PLANS = {
  foundation: {
    name: 'Foundation',
    monthlyPriceId: process.env.STRIPE_FOUNDATION_MONTHLY_PRICE_ID,
    annualPriceId: process.env.STRIPE_FOUNDATION_ANNUAL_PRICE_ID,
    sixMonthPriceId: process.env.STRIPE_FOUNDATION_SIXMONTH_PRICE_ID,
    monthlyPrice: 197,
    annualPrice: 167,
    sixMonthPrice: 180,
  },
  growth: {
    name: 'Growth',
    monthlyPriceId: process.env.STRIPE_GROWTH_MONTHLY_PRICE_ID,
    annualPriceId: process.env.STRIPE_GROWTH_ANNUAL_PRICE_ID,
    sixMonthPriceId: process.env.STRIPE_GROWTH_SIXMONTH_PRICE_ID,
    monthlyPrice: 297,
    annualPrice: 252,
    sixMonthPrice: 275,
  },
  elite: {
    name: 'Elite',
    monthlyPriceId: process.env.STRIPE_ELITE_MONTHLY_PRICE_ID,
    annualPriceId: process.env.STRIPE_ELITE_ANNUAL_PRICE_ID,
    sixMonthPriceId: process.env.STRIPE_ELITE_SIXMONTH_PRICE_ID,
    monthlyPrice: 497,
    annualPrice: 422,
    sixMonthPrice: 460,
  },
}

export async function POST(request: NextRequest) {
  try {
    // Force immediate logging
    console.log('🚀 ===== SUBSCRIPTION CHECKOUT API STARTED =====')
    
    const { planId, billingPeriod, userId } = await request.json()
    
    console.log('=== SUBSCRIPTION CHECKOUT CREATION ===')
    console.log('Plan ID:', planId)
    console.log('Billing Period:', billingPeriod)
    console.log('User ID:', userId)
    
    // Validate required fields immediately
    if (!planId || !billingPeriod || !userId) {
      console.error('❌ Missing required fields:', { planId, billingPeriod, userId })
      return NextResponse.json(
        { error: 'Plan ID, billing period, and user ID are required' },
        { status: 400 }
      )
    }
    
    // Debug: Log environment variables for troubleshooting
    console.log('=== ENVIRONMENT VARIABLES DEBUG ===')
    console.log('STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY)
    console.log('STRIPE_FOUNDATION_MONTHLY_PRICE_ID:', process.env.STRIPE_FOUNDATION_MONTHLY_PRICE_ID)
    console.log('STRIPE_FOUNDATION_ANNUAL_PRICE_ID:', process.env.STRIPE_FOUNDATION_ANNUAL_PRICE_ID)
    console.log('STRIPE_FOUNDATION_SIXMONTH_PRICE_ID:', process.env.STRIPE_FOUNDATION_SIXMONTH_PRICE_ID)
    console.log('STRIPE_GROWTH_MONTHLY_PRICE_ID:', process.env.STRIPE_GROWTH_MONTHLY_PRICE_ID)
    console.log('STRIPE_GROWTH_ANNUAL_PRICE_ID:', process.env.STRIPE_GROWTH_ANNUAL_PRICE_ID)
    console.log('STRIPE_GROWTH_SIXMONTH_PRICE_ID:', process.env.STRIPE_GROWTH_SIXMONTH_PRICE_ID)
    console.log('STRIPE_ELITE_MONTHLY_PRICE_ID:', process.env.STRIPE_ELITE_MONTHLY_PRICE_ID)
    console.log('STRIPE_ELITE_ANNUAL_PRICE_ID:', process.env.STRIPE_ELITE_ANNUAL_PRICE_ID)
    console.log('STRIPE_ELITE_SIXMONTH_PRICE_ID:', process.env.STRIPE_ELITE_SIXMONTH_PRICE_ID)
    console.log('=====================================')

    // Fetch active coaching discount
    const { data: discounts, error: discountError } = await supabaseAdmin
      .from('discounts')
      .select('discount_percentage')
      .eq('discount_type', 'coaching')
      .eq('is_active', true)
      .single()
    
    // Default to 0 if table doesn't exist or no discount found
    let coachingDiscount = 0
    if (discountError) {
      console.log('No discount found (table may not exist yet):', discountError.message)
    } else if (discounts?.discount_percentage) {
      coachingDiscount = parseFloat(discounts.discount_percentage)
    }
    console.log('Coaching Discount:', coachingDiscount + '%')

    // This validation is now done above

    // Validate plan exists
    const plan = SUBSCRIPTION_PLANS[planId as keyof typeof SUBSCRIPTION_PLANS]
    if (!plan) {
      return NextResponse.json(
        { error: 'Invalid plan ID' },
        { status: 400 }
      )
    }

    // Get the appropriate price ID based on billing period
    let priceId: string | undefined
    if (billingPeriod === 'annual') {
      priceId = plan.annualPriceId
    } else if (billingPeriod === 'sixmonth') {
      priceId = plan.sixMonthPriceId
    } else {
      priceId = plan.monthlyPriceId
    }
    
    console.log(`Looking for ${billingPeriod} price ID for ${plan.name}:`, priceId)
    
    if (!priceId) {
      console.error(`❌ Price ID not configured for ${plan.name} ${billingPeriod} plan`)
      console.error('Available price IDs:', {
        monthly: plan.monthlyPriceId,
        annual: plan.annualPriceId,
        sixmonth: plan.sixMonthPriceId
      })
      return NextResponse.json(
        { error: `Price ID not configured for ${plan.name} ${billingPeriod} plan. Please check environment variables.` },
        { status: 500 }
      )
    }

    // Get base URL - use environment variable or fallback
    let baseUrl: string
    if (process.env.NODE_ENV === 'production') {
      baseUrl = 'https://www.alllevelsathletics.com'
    } else {
      // For development, use localhost or the configured development URL
      baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    }
    
    // Create URLs for subscription checkout
    const successUrl = `${baseUrl}/subscription-success?session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl = `${baseUrl}/services`

    // Get or create Stripe customer
    let stripeCustomerId: string

    // First, get user's email from Supabase auth
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(userId)
    if (authError) {
      console.error('Error fetching auth user:', authError)
      return NextResponse.json(
        { error: 'Failed to fetch user information' },
        { status: 500 }
      )
    }

    const userEmail = authUser.user?.email
    const userName = authUser.user?.user_metadata?.full_name

    // Check if user already has a Stripe customer ID in their profile
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('stripe_customer_id, full_name')
      .eq('user_id', userId)
      .single()

    // If profile doesn't exist, that's okay - we'll create a Stripe customer anyway
    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error fetching user profile:', profileError)
      // Continue anyway - we can still create a Stripe customer
    }

    if (userProfile?.stripe_customer_id) {
      // User already has a Stripe customer ID - verify it still exists in Stripe
      try {
        const existingCustomer = await stripe.customers.retrieve(userProfile.stripe_customer_id)
        if (existingCustomer && !existingCustomer.deleted) {
          stripeCustomerId = userProfile.stripe_customer_id
          console.log('Using existing Stripe customer ID:', stripeCustomerId)
        } else {
          console.log('Stored customer ID is deleted, will create new one')
          throw new Error('Customer deleted')
        }
      } catch (error) {
        console.log('Error retrieving customer, will create new one:', error)
        // Customer doesn't exist or was deleted, create a new one
        userProfile.stripe_customer_id = null
      }
    }
    
    if (!userProfile?.stripe_customer_id) {
      // First, search for existing customer by email to avoid duplicates
      if (userEmail) {
        const existingCustomers = await stripe.customers.list({
          email: userEmail,
          limit: 1
        })
        
        if (existingCustomers.data.length > 0 && !existingCustomers.data[0].deleted) {
          stripeCustomerId = existingCustomers.data[0].id
          console.log('Found existing Stripe customer by email:', stripeCustomerId)
          
          // Update user profile with this customer ID
          if (userProfile) {
            await supabaseAdmin
              .from('user_profiles')
              .update({ stripe_customer_id: stripeCustomerId })
              .eq('user_id', userId)
          }
        }
      }
      
      // If still no customer, create new one
      if (!stripeCustomerId) {
        const customerData: any = {
          metadata: {
            userId: userId,
          },
        }

        // Add email from Supabase auth (this is the primary source)
        if (userEmail) {
          customerData.email = userEmail
        }

        // Add name from Supabase auth or user profile
        if (userName) {
          customerData.name = userName
        } else if (userProfile?.full_name) {
          customerData.name = userProfile.full_name
        }

        const customer = await stripe.customers.create(customerData)
        stripeCustomerId = customer.id
        console.log('Created new Stripe customer:', stripeCustomerId)
      }
    }

    // Try to update user profile with Stripe customer ID (if profile exists and not already set)
    if (userProfile && stripeCustomerId) {
        const { error: updateError } = await supabaseAdmin
          .from('user_profiles')
          .update({ stripe_customer_id: stripeCustomerId })
          .eq('user_id', userId)

        if (updateError) {
          console.error('Error updating user profile with Stripe customer ID:', updateError)
          // Don't fail the checkout, just log the error
        }
      } else {
        // If no profile exists, create one with the Stripe customer ID
        const { error: createError } = await supabaseAdmin
          .from('user_profiles')
          .insert([{
            user_id: userId,
            stripe_customer_id: stripeCustomerId,
            role: 'client',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])

        if (createError) {
          console.error('Error creating user profile:', createError)
          // Don't fail the checkout, just log the error
        } else {
          console.log('✅ Created user profile with role: client')
        }
      }
    

    // Check if user already has an active subscription
    const { data: existingSubscription, error: subscriptionError } = await supabaseAdmin
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    if (subscriptionError && subscriptionError.code !== 'PGRST116') {
      console.error('Error checking existing subscription:', subscriptionError)
      return NextResponse.json(
        { error: 'Failed to check existing subscription' },
        { status: 500 }
      )
    }

    if (existingSubscription) {
      return NextResponse.json(
        { error: 'User already has an active subscription. Please manage it through the customer portal.' },
        { status: 400 }
      )
    }

    // Create or get Stripe coupon if discount is active
    let stripeCouponId: string | undefined
    if (coachingDiscount > 0) {
      const couponId = `coaching-${Math.round(coachingDiscount)}`
      
      try {
        // Try to retrieve existing coupon
        await stripe.coupons.retrieve(couponId)
        stripeCouponId = couponId
        console.log('Using existing Stripe coupon:', couponId)
      } catch (error) {
        // Coupon doesn't exist, create it
        try {
          const coupon = await stripe.coupons.create({
            id: couponId,
            percent_off: coachingDiscount,
            duration: 'forever',
            name: `Coaching ${Math.round(coachingDiscount)}% Discount`,
          })
          stripeCouponId = coupon.id
          console.log('Created new Stripe coupon:', coupon.id)
        } catch (createError) {
          console.error('Error creating Stripe coupon:', createError)
          // Continue without coupon if creation fails
        }
      }
    }

    // Prepare session configuration
    const sessionConfig: any = {
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      customer: stripeCustomerId,
      success_url: successUrl,
      cancel_url: cancelUrl,
      subscription_data: {
        metadata: {
          userId: userId,
          planId: planId,
          planName: plan.name,
          billingPeriod: billingPeriod,
        },
      },
      metadata: {
        userId: userId,
        planId: planId,
        planName: plan.name,
        billingPeriod: billingPeriod,
        type: 'subscription',
      },
    }

    // Check if this is ONLY the Elite plan (Premium program) - if so, mark for free MF roller
    if (planId === 'elite') {
      console.log('🎁 Elite plan detected - customer will get free MF roller!')
      
      // Update metadata to indicate free roller will be available
      sessionConfig.metadata.freeMFRoller = 'true'
      sessionConfig.subscription_data.metadata.freeMFRoller = 'true'
      
      console.log('✅ Elite plan marked for free MF roller bonus')
    }

    // Auto-apply discount if available, otherwise allow promo codes
    if (stripeCouponId) {
      sessionConfig.discounts = [{
        coupon: stripeCouponId
      }]
      console.log('Auto-applying discount coupon:', stripeCouponId)
    } else {
      // Only allow promotion codes if we're not auto-applying a discount
      sessionConfig.allow_promotion_codes = true
    }

    // Create Stripe checkout session for subscription
    const session = await stripe.checkout.sessions.create(sessionConfig)

    console.log('✅ Stripe subscription checkout session created successfully')
    console.log('Session ID:', session.id)
    console.log('Session URL:', session.url)

    return NextResponse.json({ 
      sessionId: session.id,
      sessionUrl: session.url,
      success: true 
    })

  } catch (error) {
    console.error('❌ Error creating subscription checkout session:', error)
    
    // Log more details for debugging
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to create subscription checkout session',
        details: error instanceof Error ? error.message : 'Unknown error',
        debug: {
          hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
          hasPriceIds: {
            foundation_monthly: !!process.env.STRIPE_FOUNDATION_MONTHLY_PRICE_ID,
            foundation_annual: !!process.env.STRIPE_FOUNDATION_ANNUAL_PRICE_ID,
            foundation_sixmonth: !!process.env.STRIPE_FOUNDATION_SIXMONTH_PRICE_ID,
            growth_monthly: !!process.env.STRIPE_GROWTH_MONTHLY_PRICE_ID,
            growth_annual: !!process.env.STRIPE_GROWTH_ANNUAL_PRICE_ID,
            growth_sixmonth: !!process.env.STRIPE_GROWTH_SIXMONTH_PRICE_ID,
            elite_monthly: !!process.env.STRIPE_ELITE_MONTHLY_PRICE_ID,
            elite_annual: !!process.env.STRIPE_ELITE_ANNUAL_PRICE_ID,
            elite_sixmonth: !!process.env.STRIPE_ELITE_SIXMONTH_PRICE_ID,
          }
        }
      },
      { status: 500 }
    )
  }
}
