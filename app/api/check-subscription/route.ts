import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireUser } from '@/lib/api-auth'

export async function GET(request: NextRequest) {
  const auth = await requireUser(request)
  if (auth.error) return auth.error
  const userId = auth.user.id

  try {
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
