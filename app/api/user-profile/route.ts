import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 User Profile GET API called')
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    console.log('👤 Requested user ID:', userId)
    
    if (!userId) {
      console.error('❌ No user ID provided')
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Use regular supabase client for user operations (respects RLS)
    console.log('🔍 Fetching profile from database...')
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    console.log('📊 Database response:', { profile, error })

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('❌ Error fetching user profile:', error)
      return NextResponse.json(
        { error: 'Failed to fetch profile', details: error.message },
        { status: 500 }
      )
    }

    if (error && error.code === 'PGRST116') {
      console.log('ℹ️ No profile found for user:', userId)
      return NextResponse.json({ 
        profile: null,
        success: true 
      })
    }

    console.log('✅ Profile found:', profile)
    return NextResponse.json({ 
      profile: profile,
      success: true 
    })

  } catch (error) {
    console.error('💥 Error in user profile GET:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('🔄 User Profile PUT API called')
    
    const body = await request.json()
    const { userId, profileData } = body
    
    console.log('📝 Request data:', { userId, profileData })
    
    if (!userId || !profileData) {
      console.error('❌ Missing required data:', { userId: !!userId, profileData: !!profileData })
      return NextResponse.json(
        { error: 'User ID and profile data are required' },
        { status: 400 }
      )
    }

    // Check if supabaseAdmin is available
    if (!supabaseAdmin) {
      console.error('❌ SupabaseAdmin not available - missing SUPABASE_SERVICE_ROLE_KEY')
      return NextResponse.json(
        { error: 'Server configuration error - missing service role key' },
        { status: 500 }
      )
    }

    // Use service role client for admin operations
    const client = supabaseAdmin
    
    console.log('🔍 Checking if profile exists for user:', userId)
    
    // Check if profile exists
    const { data: existingProfile, error: checkError } = await client
      .from('user_profiles')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ Error checking existing profile:', checkError)
      return NextResponse.json(
        { error: 'Failed to check existing profile', details: checkError.message },
        { status: 500 }
      )
    }

    console.log('📊 Existing profile check result:', { exists: !!existingProfile, error: checkError?.message })

    let result
    if (existingProfile) {
      console.log('🔄 Updating existing profile...')
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
      console.log('📝 Update result:', { data: !!data, error: error?.message })
    } else {
      console.log('🆕 Creating new profile...')
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
      console.log('📝 Insert result:', { data: !!data, error: error?.message })
    }

    if (result.error) {
      console.error('❌ Error saving user profile:', result.error)
      return NextResponse.json(
        { 
          error: 'Failed to save profile', 
          details: result.error.message,
          code: result.error.code
        },
        { status: 500 }
      )
    }

    console.log('✅ Profile saved successfully:', result.data)
    return NextResponse.json({ 
      profile: result.data,
      success: true 
    })

  } catch (error) {
    console.error('💥 Error in user profile PUT:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
