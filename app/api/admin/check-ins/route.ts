import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service role not configured' }, { status: 500 })
    }
    
    // Get all check-ins with user information
    const { data: checkIns, error } = await supabaseAdmin
      .from('coaching_check_ins')
      .select(`
        *,
        user:user_id (
          id,
          email,
          raw_user_meta_data
        )
      `)
      .order('scheduled_date', { ascending: true })

    if (error) {
      console.error('Error fetching check-ins:', error)
      return NextResponse.json({ error: 'Failed to fetch check-ins' }, { status: 500 })
    }

    return NextResponse.json({ checkIns })
  } catch (error) {
    console.error('Error in check-ins API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { checkInId, notes, status } = body
    
    if (!checkInId) {
      return NextResponse.json({ error: 'Check-in ID is required' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service role not configured' }, { status: 500 })
    }
    
    const updateData: any = {}
    if (notes !== undefined) updateData.notes = notes
    if (status) updateData.status = status
    
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
