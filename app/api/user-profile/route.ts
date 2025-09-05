import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

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

    // Fetch user profile from Supabase using service role
    const client = supabaseAdmin || supabase
    const { data: profile, error } = await client
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error fetching user profile:', error)
      return NextResponse.json(
        { error: 'Failed to fetch profile' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      profile: profile || null,
      success: true 
    })

  } catch (error) {
    console.error('Error in user profile GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, profileData } = body
    
    if (!userId || !profileData) {
      return NextResponse.json(
        { error: 'User ID and profile data are required' },
        { status: 400 }
      )
    }

    // Use service role client for admin operations
    const client = supabaseAdmin || supabase
    
    // Check if profile exists
    const { data: existingProfile, error: checkError } = await client
      .from('user_profiles')
      .select('id')
      .eq('user_id', userId)
      .single()

    let result
    if (existingProfile) {
      // Update existing profile
      const { data, error } = await client
        .from('user_profiles')
        .update({
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single()

      result = { data, error }
    } else {
      // Create new profile
      const { data, error } = await client
        .from('user_profiles')
        .insert([{
          user_id: userId,
          ...profileData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()

      result = { data, error }
    }

    if (result.error) {
      console.error('Error saving user profile:', result.error)
      return NextResponse.json(
        { error: 'Failed to save profile' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      profile: result.data,
      success: true 
    })

  } catch (error) {
    console.error('Error in user profile PUT:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
