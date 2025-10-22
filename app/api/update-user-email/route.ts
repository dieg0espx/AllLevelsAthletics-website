import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { userId, newEmail } = await request.json()

    if (!userId || !newEmail) {
      return NextResponse.json(
        { error: 'User ID and new email are required' },
        { status: 400 }
      )
    }

    // Update the user's email in Supabase
    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      email: newEmail
    })

    if (error) {
      console.error('Error updating user email:', error)
      return NextResponse.json(
        { error: 'Failed to update user email' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'User email updated successfully',
      user: data.user
    })

  } catch (error) {
    console.error('Error in update-user-email:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
