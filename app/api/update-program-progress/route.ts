import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireUser } from '@/lib/api-auth'

export async function POST(request: NextRequest) {
  const auth = await requireUser(request)
  if (auth.error) return auth.error
  const userId = auth.user.id

  try {
    const body = await request.json()
    const { programId, progress, watchedVideos } = body

    if (!programId || progress === undefined) {
      return NextResponse.json(
        { error: 'Program ID and progress are required' },
        { status: 400 }
      )
    }

    console.log('=== UPDATING PROGRAM PROGRESS ===')
    console.log('User ID:', userId)
    console.log('Program ID:', programId)
    console.log('Progress:', progress)
    console.log('Watched Videos:', watchedVideos)

    // First, try to update with watched_videos column
    let data, error
    
    try {
      const result = await supabaseAdmin
        .from('user_programs')
        .update({ 
          progress: Math.round(progress),
          watched_videos: watchedVideos || [],
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('program_id', programId)
        .select()
      
      data = result.data
      error = result.error
    } catch (err) {
      console.warn('⚠️ watched_videos column might not exist, trying without it...')
      
      // Fallback: Update without watched_videos if column doesn't exist
      const result = await supabaseAdmin
        .from('user_programs')
        .update({ 
          progress: Math.round(progress),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('program_id', programId)
        .select()
      
      data = result.data
      error = result.error
    }

    if (error) {
      console.error('❌ Error updating progress:', error)
      return NextResponse.json(
        { error: 'Failed to update progress', details: error.message },
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
