import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service role not configured' }, { status: 500 })
    }

    // Get all coaching sessions
    const { data: sessions, error } = await supabaseAdmin
      .from('coaching_check_ins')
      .select('*')
      .order('scheduled_date', { ascending: false })

    if (error) {
      console.error('Error fetching sessions:', error)
      return NextResponse.json({ error: 'Failed to fetch coaching sessions' }, { status: 500 })
    }

    // Transform sessions data with client information
    const transformedSessions = await Promise.all(
      (sessions || []).map(async (session) => {
        // Get client profile information
        const { data: profile, error: profileError } = await supabaseAdmin
          .from('user_profiles')
          .select('*')
          .eq('user_id', session.user_id)
          .single()

        return {
          id: session.id,
          client_id: session.user_id,
          client_name: profile?.full_name || 'Unknown',
          client_email: profile?.email || 'Unknown',
          scheduled_date: session.scheduled_date,
          check_in_type: session.check_in_type || 'video',
          status: session.status || 'scheduled',
          notes: session.notes || '',
          feedback: session.feedback || '',
          goals_achieved: session.goals_achieved || [],
          next_goals: session.next_goals || [],
          duration_minutes: session.duration_minutes || 60
        }
      })
    )

    return NextResponse.json({ sessions: transformedSessions })
  } catch (error) {
    console.error('Error in coaching sessions API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { client_id, scheduled_date, check_in_type, notes } = body
    
    if (!client_id || !scheduled_date) {
      return NextResponse.json({ error: 'Client ID and scheduled date are required' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service role not configured' }, { status: 500 })
    }
    
    // Create new coaching session
    const { data: session, error } = await supabaseAdmin
      .from('coaching_check_ins')
      .insert({
        user_id: client_id,
        scheduled_date: scheduled_date,
        check_in_type: check_in_type || 'video',
        notes: notes || null,
        status: 'scheduled'
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating session:', error)
      return NextResponse.json({ error: 'Failed to create coaching session' }, { status: 500 })
    }

    return NextResponse.json({ session })
  } catch (error) {
    console.error('Error in coaching sessions POST API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, status, feedback, goals_achieved, next_goals, notes, duration_minutes } = body
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service role not configured' }, { status: 500 })
    }
    
    const updateData: any = {}
    if (status) updateData.status = status
    if (feedback) updateData.feedback = feedback
    if (goals_achieved) updateData.goals_achieved = goals_achieved
    if (next_goals) updateData.next_goals = next_goals
    if (notes !== undefined) updateData.notes = notes
    if (duration_minutes) updateData.duration_minutes = duration_minutes
    
    if (status === 'completed') {
      updateData.completed_date = new Date().toISOString()
    }

    // Update session
    const { data: session, error } = await supabaseAdmin
      .from('coaching_check_ins')
      .update(updateData)
      .eq('id', sessionId)
      .select()
      .single()

    if (error) {
      console.error('Error updating session:', error)
      return NextResponse.json({ error: 'Failed to update coaching session' }, { status: 500 })
    }

    return NextResponse.json({ session })
  } catch (error) {
    console.error('Error in coaching sessions PUT API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service role not configured' }, { status: 500 })
    }
    
    // Delete session
    const { error } = await supabaseAdmin
      .from('coaching_check_ins')
      .delete()
      .eq('id', sessionId)

    if (error) {
      console.error('Error deleting session:', error)
      return NextResponse.json({ error: 'Failed to delete coaching session' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in coaching sessions DELETE API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
