import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const checkInId = searchParams.get('checkInId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service role not configured' }, { status: 500 })
    }
    
    let query = supabaseAdmin
      .from('coaching_progress')
      .select('*')
      .eq('user_id', userId)
      .order('recorded_date', { ascending: false })

    if (checkInId) {
      query = query.eq('check_in_id', checkInId)
    }

    const { data: progress, error } = await query

    if (error) {
      console.error('Error fetching progress:', error)
      return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
    }

    // Calculate metrics for dashboard
    const sessionsCompleted = progress?.length || 0
    const totalHours = progress?.reduce((sum, p) => sum + (p.duration_minutes || 0), 0) / 60 || 0
    const goalsAchieved = progress?.filter(p => p.goal_achieved).length || 0
    const progressScore = Math.min(100, Math.round((goalsAchieved / Math.max(1, sessionsCompleted)) * 100))

    // Get next session from check-ins
    const { data: nextCheckIn } = await supabaseAdmin
      .from('coaching_check_ins')
      .select('scheduled_date')
      .eq('user_id', userId)
      .eq('status', 'scheduled')
      .gte('scheduled_date', new Date().toISOString())
      .order('scheduled_date', { ascending: true })
      .limit(1)
      .single()

    return NextResponse.json({ 
      progress,
      sessionsCompleted,
      totalHours: Math.round(totalHours * 10) / 10, // Round to 1 decimal
      goalsAchieved,
      progressScore,
      nextSession: nextCheckIn?.scheduled_date || null
    })
  } catch (error) {
    console.error('Error in progress API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, checkInId, metricName, metricValue, metricUnit, notes } = body
    
    if (!userId || !metricName) {
      return NextResponse.json({ error: 'User ID and metric name are required' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service role not configured' }, { status: 500 })
    }
    
    // Create new progress entry
    const { data: progress, error } = await supabaseAdmin
      .from('coaching_progress')
      .insert({
        user_id: userId,
        check_in_id: checkInId || null,
        metric_name: metricName,
        metric_value: metricValue || null,
        metric_unit: metricUnit || null,
        notes: notes || null
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating progress entry:', error)
      return NextResponse.json({ error: 'Failed to create progress entry' }, { status: 500 })
    }

    // Save metric template for future use
    try {
      await supabaseAdmin
        .from('metric_templates')
        .upsert({
          user_id: userId,
          metric_name: metricName,
          default_unit: metricUnit || null
        })
    } catch (templateError) {
      console.error('Error saving metric template:', templateError)
      // Don't fail the request if template saving fails
    }

    return NextResponse.json({ progress })
  } catch (error) {
    console.error('Error in progress API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { progressId, metricName, metricValue, metricUnit, notes } = body
    
    if (!progressId) {
      return NextResponse.json({ error: 'Progress ID is required' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service role not configured' }, { status: 500 })
    }
    
    const updateData: any = {}
    if (metricName) updateData.metric_name = metricName
    if (metricValue !== undefined) updateData.metric_value = metricValue
    if (metricUnit) updateData.metric_unit = metricUnit
    if (notes) updateData.notes = notes

    // Update progress entry
    const { data: progress, error } = await supabaseAdmin
      .from('coaching_progress')
      .update(updateData)
      .eq('id', progressId)
      .select()
      .single()

    if (error) {
      console.error('Error updating progress entry:', error)
      return NextResponse.json({ error: 'Failed to update progress entry' }, { status: 500 })
    }

    return NextResponse.json({ progress })
  } catch (error) {
    console.error('Error in progress API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const progressId = searchParams.get('progressId')
    
    if (!progressId) {
      return NextResponse.json({ error: 'Progress ID is required' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service role not configured' }, { status: 500 })
    }
    
    // Delete progress entry
    const { error } = await supabase
      .from('coaching_progress')
      .delete()
      .eq('id', progressId)

    if (error) {
      console.error('Error deleting progress entry:', error)
      return NextResponse.json({ error: 'Failed to delete progress entry' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in progress API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
