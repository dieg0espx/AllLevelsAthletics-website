import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service role not configured' }, { status: 500 })
    }
    
    // First, get all check-ins
    const { data: checkIns, error: checkInsError } = await supabaseAdmin
      .from('coaching_check_ins')
      .select('*')
      .order('scheduled_date', { ascending: true })

    if (checkInsError) {
      console.error('Error fetching check-ins:', checkInsError)
      return NextResponse.json({ error: 'Failed to fetch check-ins', details: checkInsError.message }, { status: 500 })
    }

    // Get unique user IDs from check-ins
    const userIds = [...new Set(checkIns.map(checkIn => checkIn.user_id))]
    
    // Fetch user profiles for all users
    const { data: userProfiles, error: usersError } = await supabaseAdmin
      .from('user_profiles')
      .select('user_id, full_name')
      .in('user_id', userIds)

    if (usersError) {
      console.error('Error fetching user profiles:', usersError)
      // Continue without user data if profiles can't be fetched
    }

    // Get auth users to get real email addresses
    const authUsers = {}
    for (const userId of userIds) {
      try {
        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(userId)
        if (!authError && authUser.user) {
          authUsers[userId] = authUser.user
        }
      } catch (error) {
        console.error(`Error fetching auth user ${userId}:`, error)
      }
    }

    // Combine check-ins with user data
    const checkInsWithUsers = checkIns.map(checkIn => {
      const userProfile = userProfiles?.find(profile => profile.user_id === checkIn.user_id)
      const authUser = authUsers[checkIn.user_id]
      
      return {
        ...checkIn,
        user: {
          id: checkIn.user_id,
          email: authUser?.email || checkIn.user_id, // Use real email from auth, fallback to user_id
          raw_user_meta_data: {
            full_name: authUser?.user_metadata?.full_name || userProfile?.full_name || 'Unknown User'
          }
        }
      }
    })

    console.log('Successfully fetched check-ins:', checkInsWithUsers.length)
    return NextResponse.json({ checkIns: checkInsWithUsers })
  } catch (error) {
    console.error('Error in check-ins API:', error)
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
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
