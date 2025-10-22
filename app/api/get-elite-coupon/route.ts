import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET /api/get-elite-coupon
 * 
 * Fetches the Elite coupon for a specific user
 * Used to display the coupon code on the success page
 */
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

    console.log('🔍 Fetching Elite coupon for user:', userId)

    // Get the user's Elite coupon
    const { data: coupon, error: couponError } = await supabaseAdmin
      .from('elite_coupons')
      .select('*')
      .eq('user_id', userId)
      .eq('is_used', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (couponError || !coupon) {
      console.log('❌ No Elite coupon found for user')
      return NextResponse.json(
        { 
          success: false,
          message: 'No Elite coupon found' 
        },
        { status: 404 }
      )
    }

    // Check if coupon has expired
    const now = new Date()
    const expiresAt = new Date(coupon.expires_at)
    
    if (now > expiresAt) {
      console.log('❌ Elite coupon has expired')
      return NextResponse.json(
        { 
          success: false,
          message: 'Coupon has expired' 
        },
        { status: 400 }
      )
    }

    console.log('✅ Elite coupon found:', coupon.coupon_code)

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.coupon_code,
        discount: coupon.discount_percentage,
        product: 'MFRoller',
        expiresAt: coupon.expires_at,
        isUsed: coupon.is_used
      }
    })

  } catch (error) {
    console.error('❌ Error fetching Elite coupon:', error)
    return NextResponse.json(
      { error: 'Failed to fetch coupon' },
      { status: 500 }
    )
  }
}
