import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * POST /api/validate-elite-coupon
 * 
 * Validates that an Elite coupon can be used by the current user
 * Checks email match and single-use restriction
 */
export async function POST(request: NextRequest) {
  try {
    const { couponCode, customerEmail, userId } = await request.json()

    if (!couponCode || !customerEmail || !userId) {
      return NextResponse.json(
        { error: 'Coupon code, customer email, and user ID are required' },
        { status: 400 }
      )
    }

    console.log('🔍 Validating Elite coupon:', couponCode, 'for email:', customerEmail)

    // Check if coupon exists and is valid
    const { data: coupon, error: couponError } = await supabaseAdmin
      .from('elite_coupons')
      .select('*')
      .eq('coupon_code', couponCode)
      .eq('customer_email', customerEmail)
      .eq('user_id', userId)
      .eq('is_used', false)
      .single()

    if (couponError || !coupon) {
      console.log('❌ Invalid or expired coupon')
      return NextResponse.json(
        { 
          valid: false, 
          error: 'Invalid coupon code or email mismatch' 
        },
        { status: 400 }
      )
    }

    // Check if coupon has expired
    const now = new Date()
    const expiresAt = new Date(coupon.expires_at)
    
    if (now > expiresAt) {
      console.log('❌ Coupon has expired')
      return NextResponse.json(
        { 
          valid: false, 
          error: 'Coupon has expired' 
        },
        { status: 400 }
      )
    }

    console.log('✅ Elite coupon is valid for this user')

    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.coupon_code,
        discount: coupon.discount_percentage,
        product: 'MFRoller',
        expiresAt: coupon.expires_at
      }
    })

  } catch (error) {
    console.error('❌ Error validating Elite coupon:', error)
    return NextResponse.json(
      { error: 'Failed to validate coupon' },
      { status: 500 }
    )
  }
}
