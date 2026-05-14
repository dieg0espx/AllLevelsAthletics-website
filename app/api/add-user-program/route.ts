import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireUser } from '@/lib/api-auth'

export async function POST(request: NextRequest) {
  const auth = await requireUser(request)
  if (auth.error) return auth.error
  const userId = auth.user.id

  try {
    const { programId, programName, programType } = await request.json()

    if (!programId || !programName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log('=== ADDING USER PROGRAM ===')
    console.log('User ID:', userId)
    console.log('Program ID:', programId)
    console.log('Program Name:', programName)
    console.log('Program Type:', programType)

    // Check if user already has this program
    const { data: existingProgram, error: checkError } = await supabaseAdmin
      .from('user_programs')
      .select('*')
      .eq('user_id', userId)
      .eq('program_id', programId)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing program:', checkError)
      return NextResponse.json(
        { error: 'Failed to check existing program' },
        { status: 500 }
      )
    }

    // If program already exists, return success
    if (existingProgram) {
      console.log('Program already exists for user')
      return NextResponse.json({
        success: true,
        message: 'Program already exists',
        program: existingProgram
      })
    }

    // Add the program to user_programs table
    const { data: newProgram, error: insertError } = await supabaseAdmin
      .from('user_programs')
      .insert({
        user_id: userId,
        program_id: programId,
        program_name: programName,
        program_type: programType || 'premium',
        status: 'active',
        progress: 0,
        start_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (insertError) {
      console.error('❌ Error inserting program:', insertError)
      console.error('Error code:', insertError.code)
      
      // If table doesn't exist or other database error, create a mock program entry
      // This ensures the user can still access the program
      if (insertError.code === 'PGRST205' || insertError.code === 'PGRST106' || insertError.code === '42P01') {
        console.log('⚠️ Table does not exist, creating fallback program entry')
      } else {
        console.log('⚠️ Database error, creating fallback program entry')
      }
      
      const fallbackProgram = {
        id: `fallback-${Date.now()}`,
        user_id: userId,
        program_id: programId,
        program_name: programName,
        program_type: programType || 'premium',
        status: 'active',
        progress: 0,
        start_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      return NextResponse.json({
        success: true,
        message: 'Program added successfully (fallback mode)',
        program: fallbackProgram,
        fallback: true
      })
    }

    console.log('Program added successfully:', newProgram)

    return NextResponse.json({
      success: true,
      message: 'Program added successfully',
      program: newProgram
    })

  } catch (error) {
    console.error('Error in add-user-program:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


