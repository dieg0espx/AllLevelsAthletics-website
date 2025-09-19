import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service role not configured' }, { status: 500 })
    }

    // Get all users with active coaching subscriptions
    const { data: subscriptions, error: subError } = await supabaseAdmin
      .from('user_subscriptions')
      .select('*')
      .eq('status', 'active')
      .in('plan_name', ['Foundation', 'Growth', 'Elite'])

    if (subError) {
      console.error('Error fetching subscriptions:', subError)
      return NextResponse.json({ error: 'Failed to fetch coaching clients' }, { status: 500 })
    }

    // Get coaching statistics for each client
    const clients = await Promise.all(
      subscriptions.map(async (subscription) => {
        // Get user profile data
        const { data: profile, error: profileError } = await supabaseAdmin
          .from('user_profiles')
          .select('*')
          .eq('user_id', subscription.user_id)
          .single()

        if (profileError) {
          console.error('Error fetching profile for user:', subscription.user_id, profileError)
          return null
        }
        
        // Get session counts
        const { data: sessions } = await supabaseAdmin
          .from('coaching_check_ins')
          .select('id, status')
          .eq('user_id', subscription.user_id)

        const totalSessions = sessions?.length || 0
        const completedSessions = sessions?.filter(s => s.status === 'completed').length || 0

        // Get next session
        const { data: nextSession } = await supabaseAdmin
          .from('coaching_check_ins')
          .select('scheduled_date')
          .eq('user_id', subscription.user_id)
          .eq('status', 'scheduled')
          .gte('scheduled_date', new Date().toISOString())
          .order('scheduled_date', { ascending: true })
          .limit(1)
          .single()

        // Get last check-in
        const { data: lastCheckIn } = await supabaseAdmin
          .from('coaching_check_ins')
          .select('scheduled_date')
          .eq('user_id', subscription.user_id)
          .eq('status', 'completed')
          .order('scheduled_date', { ascending: false })
          .limit(1)
          .single()

        // Calculate progress score (simplified - could be more sophisticated)
        const progressScore = totalSessions > 0 ? Math.min(100, Math.round((completedSessions / totalSessions) * 100)) : 0

        return {
          id: subscription.user_id,
          email: profile.email || 'Unknown',
          full_name: profile.full_name || 'Unknown',
          plan_name: subscription.plan_name,
          subscription_status: subscription.status,
          total_sessions: totalSessions,
          completed_sessions: completedSessions,
          next_session: nextSession?.scheduled_date || null,
          progress_score: progressScore,
          last_check_in: lastCheckIn?.scheduled_date || null
        }
      })
    )

    // Filter out any null results (users without profiles)
    const validClients = clients.filter(client => client !== null)

    return NextResponse.json({ clients: validClients })
  } catch (error) {
    console.error('Error in coaching clients API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
