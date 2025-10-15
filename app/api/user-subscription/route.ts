import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const requestedUserId = searchParams.get('userId')
    
    if (!requestedUserId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }
    
    console.log('🔍 Querying subscription for user:', requestedUserId)

    // Check if supabaseAdmin is available
    if (!supabaseAdmin) {
      console.error('❌ SupabaseAdmin not available - missing SUPABASE_SERVICE_ROLE_KEY')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Get user's subscription data using admin client
    const { data: subscription, error: subscriptionError } = await supabaseAdmin
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', requestedUserId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (subscriptionError && subscriptionError.code !== 'PGRST116') {
      console.error('Error fetching subscription:', subscriptionError)
      return NextResponse.json(
        { error: 'Failed to fetch subscription' },
        { status: 500 }
      )
    }

    // Get user profile data for additional context using admin client
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('stripe_customer_id, current_plan, subscription_status')
      .eq('user_id', requestedUserId)
      .single()

    // If profile doesn't exist, that's okay - user might not have subscribed yet
    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error fetching user profile:', profileError)
      return NextResponse.json(
        { error: 'Failed to fetch user profile' },
        { status: 500 }
      )
    }

    // Add pricing information based on plan_id
    const PLAN_PRICES = {
      foundation: 197,
      growth: 297,
      elite: 497
    }

    // Enrich subscription data with price if plan_id exists
    let enrichedSubscription = subscription
    if (subscription && subscription.plan_id) {
      enrichedSubscription = {
        ...subscription,
        plan_price: PLAN_PRICES[subscription.plan_id as keyof typeof PLAN_PRICES] || null
      }
    }

    return NextResponse.json({ 
      subscription: enrichedSubscription || null,
      userProfile: userProfile || null,
      success: true 
    })

  } catch (error) {
    console.error('Error in user subscription GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, subscriptionData } = body
    
    if (!userId || !subscriptionData) {
      return NextResponse.json(
        { error: 'User ID and subscription data are required' },
        { status: 400 }
      )
    }

    // Update subscription record
    const { data, error } = await supabaseAdmin
      .from('user_subscriptions')
      .update({
        ...subscriptionData,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating subscription:', error)
      return NextResponse.json(
        { error: 'Failed to update subscription' },
        { status: 500 }
      )
    }

    // Update user profile with subscription info
    if (subscriptionData.plan_id || subscriptionData.status) {
      const profileUpdate: any = {}
      if (subscriptionData.plan_id) profileUpdate.current_plan = subscriptionData.plan_id
      if (subscriptionData.status) profileUpdate.subscription_status = subscriptionData.status

      const { error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .update(profileUpdate)
        .eq('user_id', userId)

      if (profileError) {
        console.error('Error updating user profile:', profileError)
        // Don't fail the request, just log the error
      }
    }

    return NextResponse.json({ 
      subscription: data,
      success: true 
    })

  } catch (error) {
    console.error('Error in user subscription PUT:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
