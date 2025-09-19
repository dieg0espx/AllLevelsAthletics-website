import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }
    
    console.log('=== CHECKING SUBSCRIPTION ===')
    console.log('User ID:', userId)
    
    // Get user's current subscription
    const { data: subscription, error: subscriptionError } = await supabaseAdmin
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()
    
    console.log('Subscription query result:', { subscription, subscriptionError })
    
    // Get user's profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single()
    
    console.log('Profile query result:', { profile, profileError })
    
    return NextResponse.json({
      success: true,
      subscription: subscription,
      profile: profile,
      errors: {
        subscription: subscriptionError,
        profile: profileError
      }
    })
    
  } catch (error) {
    console.error('Error checking subscription:', error)
    return NextResponse.json(
      { error: 'Failed to check subscription' },
      { status: 500 }
    )
  }
}
