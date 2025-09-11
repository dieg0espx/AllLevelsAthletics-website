import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'SupabaseAdmin not available' },
        { status: 500 }
      )
    }

    // Get all profiles
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')

    // Get specific user profile
    const { data: specificProfile, error: specificError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('user_id', 'cfdefd9f-e87a-480d-9467-d111c1a732da')

    // Get user from auth
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserByEmail('aletxa.pascual@gmail.com')

    return NextResponse.json({
      allProfiles: profiles || [],
      specificProfile: specificProfile || null,
      authUser: authUser?.user || null,
      profilesError: profilesError?.message || null,
      specificError: specificError?.message || null,
      authError: authError?.message || null,
      success: true
    })

  } catch (error) {
    console.error('Debug profiles error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    )
  }
}
