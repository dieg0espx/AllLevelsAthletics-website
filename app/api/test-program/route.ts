import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    console.log('=== TESTING PROGRAM INSERTION ===')
    console.log('User ID:', userId)

    // Try to insert a test program
    const { data: testProgram, error: insertError } = await supabaseAdmin
      .from('user_programs')
      .insert({
        user_id: userId,
        program_id: 'test-program',
        program_name: 'Test Program',
        program_type: 'premium',
        status: 'active',
        progress: 0,
        start_date: new Date().toISOString()
      })
      .select()
      .single()

    if (insertError) {
      console.error('❌ Insert error:', insertError)
      return NextResponse.json({
        success: false,
        error: insertError.message,
        code: insertError.code,
        details: insertError.details,
        hint: insertError.hint
      })
    }

    console.log('✅ Test program inserted successfully:', testProgram)

    // Clean up - delete the test program
    await supabaseAdmin
      .from('user_programs')
      .delete()
      .eq('id', testProgram.id)

    return NextResponse.json({
      success: true,
      message: 'Test program inserted and cleaned up successfully',
      testProgram
    })

  } catch (error) {
    console.error('Error in test-program:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
