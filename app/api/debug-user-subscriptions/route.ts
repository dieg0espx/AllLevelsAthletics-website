import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    console.log('=== DEBUGGING USER SUBSCRIPTIONS ===')
    console.log('User ID:', userId)

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Get all subscriptions for this user
    const { data: subscriptions, error: subError } = await supabaseAdmin
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    console.log('Query result:', {
      count: subscriptions?.length || 0,
      subscriptions: subscriptions,
      error: subError
    })

    if (subError) {
      console.error('Error fetching subscriptions:', subError)
      return NextResponse.json({ 
        error: 'Failed to fetch subscriptions',
        details: subError.message 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      userId: userId,
      subscriptionCount: subscriptions?.length || 0,
      subscriptions: subscriptions || [],
      latestSubscription: subscriptions && subscriptions.length > 0 ? subscriptions[0] : null
    })

  } catch (error) {
    console.error('Error debugging user subscriptions:', error)
    return NextResponse.json({ error: 'Failed to debug user subscriptions' }, { status: 500 })
  }
}

