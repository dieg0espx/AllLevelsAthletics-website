import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'SupabaseAdmin not available' },
        { status: 500 }
      )
    }

    // Get the user_id for the email from auth.users
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserByEmail(email)
    
    if (authError || !authUser.user) {
      return NextResponse.json(
        { error: `User with email ${email} not found` },
        { status: 404 }
      )
    }

    const userId = authUser.user.id

    // Check if profile exists
    const { data: existingProfile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    let result
    if (existingProfile) {
      // Update existing profile to admin
      const { data, error } = await supabaseAdmin
        .from('user_profiles')
        .update({ 
          role: 'admin',
          email: email,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single()

      result = { data, error }
    } else {
      // Create new profile with admin role
      const { data, error } = await supabaseAdmin
        .from('user_profiles')
        .insert([{
          user_id: userId,
          email: email,
          role: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()

      result = { data, error }
    }

    if (result.error) {
      console.error('Error setting admin role:', result.error)
      return NextResponse.json(
        { error: 'Failed to set admin role' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: `Successfully set ${email} as admin`,
      profile: result.data,
      success: true
    })

  } catch (error) {
    console.error('Set admin error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
