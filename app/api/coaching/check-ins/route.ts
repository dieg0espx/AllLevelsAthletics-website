import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service role not configured' }, { status: 500 })
    }
    
    // Get user's check-ins
    const { data: checkIns, error } = await supabaseAdmin
      .from('coaching_check_ins')
      .select(`
        *,
        coaching_progress(*)
      `)
      .eq('user_id', userId)
      .order('scheduled_date', { ascending: true })

    if (error) {
      console.error('Error fetching check-ins:', error)
      return NextResponse.json({ error: 'Failed to fetch check-ins' }, { status: 500 })
    }

    // Transform check-ins to sessions format for the component
    const sessions = checkIns?.map(checkIn => ({
      id: checkIn.id,
      date: checkIn.scheduled_date?.split('T')[0] || '',
      time: checkIn.scheduled_date?.split('T')[1]?.substring(0, 5) || '00:00',
      type: checkIn.check_in_type === 'video' ? 'video' : 
            checkIn.check_in_type === 'phone' ? 'phone' : 'in-person',
      status: checkIn.status === 'completed' ? 'completed' :
              checkIn.status === 'cancelled' ? 'cancelled' : 'scheduled',
      notes: checkIn.notes || '',
      duration: 60 // Default duration, could be made configurable
    })) || []

    return NextResponse.json({ 
      checkIns,
      sessions 
    })
  } catch (error) {
    console.error('Error in check-ins API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, scheduledDate, checkInType = 'regular', notes } = body
    
    if (!userId || !scheduledDate) {
      return NextResponse.json({ error: 'User ID and scheduled date are required' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service role not configured' }, { status: 500 })
    }
    
    // Create new check-in
    // Add timezone info to make it clear this is local time
    const scheduledDateTime = scheduledDate.includes('T') ? scheduledDate : `${scheduledDate}T00:00:00`
    
    const { data: checkIn, error } = await supabaseAdmin
      .from('coaching_check_ins')
      .insert({
        user_id: userId,
        scheduled_date: scheduledDateTime,
        check_in_type: checkInType,
        notes: notes || null,
        status: 'scheduled'
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating check-in:', error)
      return NextResponse.json({ error: 'Failed to create check-in' }, { status: 500 })
    }

    return NextResponse.json({ checkIn })
  } catch (error) {
    console.error('Error in check-ins API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { checkInId, status, feedback, goalsAchieved, nextGoals, progressMetrics, notes } = body
    
    if (!checkInId) {
      return NextResponse.json({ error: 'Check-in ID is required' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service role not configured' }, { status: 500 })
    }
    
    const updateData: any = {}
    if (status) updateData.status = status
    if (feedback) updateData.feedback = feedback
    if (goalsAchieved) updateData.goals_achieved = goalsAchieved
    if (nextGoals) updateData.next_goals = nextGoals
    if (progressMetrics) updateData.progress_metrics = progressMetrics
    if (notes !== undefined) updateData.notes = notes
    
    if (status === 'completed') {
      updateData.completed_date = new Date().toISOString()
    }

    // Update check-in
    const { data: checkIn, error } = await supabaseAdmin
      .from('coaching_check_ins')
      .update(updateData)
      .eq('id', checkInId)
      .select()
      .single()

    if (error) {
      console.error('Error updating check-in:', error)
      return NextResponse.json({ error: 'Failed to update check-in' }, { status: 500 })
    }

    return NextResponse.json({ checkIn })
  } catch (error) {
    console.error('Error in check-ins API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const checkInId = searchParams.get('checkInId')
    
    if (!checkInId) {
      return NextResponse.json({ error: 'Check-in ID is required' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service role not configured' }, { status: 500 })
    }
    
    // Delete check-in
    const { error } = await supabaseAdmin
      .from('coaching_check_ins')
      .delete()
      .eq('id', checkInId)

    if (error) {
      console.error('Error deleting check-in:', error)
      return NextResponse.json({ error: 'Failed to delete check-in' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in check-ins API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
