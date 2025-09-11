import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()
    
    console.log('=== CUSTOMER PORTAL SESSION CREATION ===')
    console.log('User ID:', userId)

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get user's Stripe customer ID from profile first
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error fetching user profile:', profileError)
      return NextResponse.json(
        { error: 'Failed to fetch user profile' },
        { status: 500 }
      )
    }

    let stripeCustomerId = userProfile?.stripe_customer_id

    // If no customer ID in profile, check subscription data
    if (!stripeCustomerId) {
      console.log('No customer ID in profile, checking subscription data...')
      const { data: subscription, error: subscriptionError } = await supabaseAdmin
        .from('user_subscriptions')
        .select('stripe_customer_id')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (subscriptionError && subscriptionError.code !== 'PGRST116') {
        console.error('Error fetching subscription:', subscriptionError)
        return NextResponse.json(
          { error: 'Failed to fetch subscription data' },
          { status: 500 }
        )
      }

      stripeCustomerId = subscription?.stripe_customer_id

      // If we found the customer ID in subscription data, update the user profile
      if (stripeCustomerId && !userProfile?.stripe_customer_id) {
        console.log('Updating user profile with Stripe customer ID from subscription data...')
        const { error: updateError } = await supabaseAdmin
          .from('user_profiles')
          .update({ stripe_customer_id: stripeCustomerId })
          .eq('user_id', userId)

        if (updateError) {
          console.error('Error updating user profile with customer ID:', updateError)
          // Don't fail the request, just log the error
        } else {
          console.log('✅ Updated user profile with Stripe customer ID')
        }
      }
    }

    if (!stripeCustomerId) {
      return NextResponse.json(
        { error: 'No Stripe customer found for this user. Please subscribe to a plan first.' },
        { status: 404 }
      )
    }

    // Get base URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'http://localhost:3000'
    const returnUrl = `${baseUrl}/dashboard`

    // Create customer portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: returnUrl,
    })

    console.log('✅ Customer portal session created successfully')
    console.log('Session URL:', session.url)

    return NextResponse.json({ 
      sessionUrl: session.url,
      success: true 
    })

  } catch (error) {
    console.error('❌ Error creating customer portal session:', error)
    return NextResponse.json(
      { error: 'Failed to create customer portal session' },
      { status: 500 }
    )
  }
}
