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

    // Use service role client to bypass RLS for API operations
    const client = supabaseAdmin || supabase
    const { data: profile, error } = await client
      .from('user_profiles')
      .select(`
        id,
        user_id,
        full_name,
        phone,
        address,
        city,
        state,
        zip_code,
        country,
        date_of_birth,
        role,
        created_at,
        updated_at
      `)
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      return NextResponse.json(
        { error: 'Failed to fetch profile', details: error.message },
        { status: 500 }
      )
    }

    if (error && error.code === 'PGRST116') {
      console.log('📋 No profile found for user:', userId)
      return NextResponse.json({ 
        profile: null,
        success: true 
      })
    }
    
    console.log('📋 Profile fetched successfully:', profile)
    return NextResponse.json({ 
      profile: profile,
      success: true 
    })

  } catch (error) {
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
    const body = await request.json()
    const { userId, profileData } = body
    
    console.log('🔄 Profile update request:', { userId, profileData })
    
    if (!userId || !profileData) {
      return NextResponse.json(
        { error: 'User ID and profile data are required' },
        { status: 400 }
      )
    }

    // Check if supabaseAdmin is available
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Server configuration error - missing service role key' },
        { status: 500 }
      )
    }

    // Use service role client for admin operations
    const client = supabaseAdmin
    
    // Check if profile exists
    const { data: existingProfile, error: checkError } = await client
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    console.log('🔍 Existing profile check:', { existingProfile, checkError })

    if (checkError && checkError.code !== 'PGRST116') {
      return NextResponse.json(
        { error: 'Failed to check existing profile', details: checkError.message },
        { status: 500 }
      )
    }

    // Only use columns that we know exist in the user_profiles table
    // Based on the errors, it seems the table might only have basic columns
    const safeProfileData = {
      full_name: profileData.first_name && profileData.last_name 
        ? `${profileData.first_name} ${profileData.last_name}`.trim()
        : profileData.full_name || '',
      phone: profileData.phone || '',
      address: profileData.address || '',
      city: profileData.city || '',
      state: profileData.state || '',
      zip_code: profileData.zip_code || '',
      country: profileData.country || 'United States',
      date_of_birth: profileData.date_of_birth && profileData.date_of_birth.trim() !== '' 
        ? profileData.date_of_birth 
        : null, // Use null instead of empty string for date fields
      role: profileData.role || 'client'
    }
    
    console.log('🔧 Processed profile data:', safeProfileData)

    // Update Supabase auth user metadata with the new full name
    if (safeProfileData.full_name && safeProfileData.full_name.trim() !== '') {
      try {
        console.log('🔄 Updating auth user metadata for user:', userId, 'with name:', safeProfileData.full_name)
        const { error: authError } = await client.auth.admin.updateUserById(userId, {
          user_metadata: {
            full_name: safeProfileData.full_name
          }
        })
        
        if (authError) {
          console.error('❌ Failed to update auth user metadata:', authError)
        } else {
          console.log('✅ Updated auth user metadata with full_name:', safeProfileData.full_name)
        }
      } catch (authError) {
        console.error('❌ Error updating auth user metadata:', authError)
      }
    } else {
      console.log('⚠️ No full_name provided, skipping auth metadata update')
    }

    let result
    if (existingProfile) {
      // Update existing profile
      const { data, error } = await client
        .from('user_profiles')
        .update({
          ...safeProfileData,
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
          ...safeProfileData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()

      result = { data, error }
    }

    if (result.error) {
      console.error('❌ Database operation failed:', result.error)
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
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
