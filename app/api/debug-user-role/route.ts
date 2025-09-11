import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      )
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'SupabaseAdmin not available' },
        { status: 500 }
      )
    }

    // Get the user from auth.users
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserByEmail(email)
    
    if (authError || !authUser.user) {
      return NextResponse.json({
        error: `User with email ${email} not found in auth.users`,
        authError: authError?.message,
        success: false
      })
    }

    const userId = authUser.user.id

    // Check if profile exists in user_profiles
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    return NextResponse.json({
      email,
      userId,
      authUser: {
        id: authUser.user.id,
        email: authUser.user.email,
        user_metadata: authUser.user.user_metadata
      },
      profile: profile || null,
      profileError: profileError?.message || null,
      success: true
    })

  } catch (error) {
    console.error('Debug user role error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    )
  }
}
