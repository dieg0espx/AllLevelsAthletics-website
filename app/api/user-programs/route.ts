import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    console.log('=== FETCHING USER PROGRAMS ===')
    console.log('User ID:', userId)
    console.log('Checking if user_programs table exists...')

    // Get user's programs
    const { data: programs, error: programsError } = await supabaseAdmin
      .from('user_programs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (programsError) {
      console.error('❌ Error fetching programs:', programsError)
      console.error('Error code:', programsError.code)
      console.error('Error message:', programsError.message)
      
      // If table doesn't exist, return empty array instead of error
      if (programsError.code === 'PGRST106' || programsError.code === 'PGRST205' || programsError.message?.includes('relation "user_programs" does not exist') || programsError.code === '42P01') {
        console.log('⚠️ user_programs table does not exist, returning empty array')
        return NextResponse.json({
          success: true,
          programs: [],
          message: 'Table does not exist - please run database setup'
        })
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch programs' },
        { status: 500 }
      )
    }

    console.log('Programs found:', programs?.length || 0)

    // Transform programs to include additional fields for display
    const transformedPrograms = programs?.map(program => ({
      id: program.id,
      name: program.program_name,
      description: getProgramDescription(program.program_id),
      progress: program.progress || 0,
      startDate: program.start_date,
      endDate: program.end_date || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: program.status,
      duration: getProgramDuration(program.program_id),
      workoutsCompleted: Math.floor((program.progress || 0) / 100 * getTotalWorkouts(program.program_id)),
      totalWorkouts: getTotalWorkouts(program.program_id),
      type: program.program_type,
      slug: program.program_id
    })) || []

    return NextResponse.json({
      success: true,
      programs: transformedPrograms
    })

  } catch (error) {
    console.error('Error in user-programs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to get program description
function getProgramDescription(programId: string): string {
  switch (programId) {
    case 'tension-release-program':
      return 'Premium program with 18 video modules for tension release and performance enhancement'
    default:
      return 'Comprehensive training program'
  }
}

// Helper function to get total workouts for a program
function getTotalWorkouts(programId: string): number {
  switch (programId) {
    case 'tension-release-program':
      return 18
    default:
      return 12
  }
}

// Helper function to get program duration
function getProgramDuration(programId: string): string {
  switch (programId) {
    case 'tension-release-program':
      return '18 modules'
    default:
      return '12 weeks'
  }
}


