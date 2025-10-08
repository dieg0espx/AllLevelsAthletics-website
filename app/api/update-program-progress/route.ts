import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, programId, progress, watchedVideos } = body

    if (!userId || !programId || progress === undefined) {
      return NextResponse.json(
        { error: 'User ID, program ID, and progress are required' },
        { status: 400 }
      )
    }

    console.log('=== UPDATING PROGRAM PROGRESS ===')
    console.log('User ID:', userId)
    console.log('Program ID:', programId)
    console.log('Progress:', progress)
    console.log('Watched Videos:', watchedVideos)

    // Update the user_programs table with the new progress and watched videos
    const { data, error } = await supabaseAdmin
      .from('user_programs')
      .update({ 
        progress: Math.round(progress),
        watched_videos: watchedVideos || [],
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('program_id', programId)
      .select()

    if (error) {
      console.error('❌ Error updating progress:', error)
      return NextResponse.json(
        { error: 'Failed to update progress' },
        { status: 500 }
      )
    }

    console.log('✅ Progress updated successfully:', data)

    return NextResponse.json({
      success: true,
      message: 'Progress updated successfully',
      data: data
    })

  } catch (error) {
    console.error('Error in update-program-progress:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
