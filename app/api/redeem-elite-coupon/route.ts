import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * POST /api/redeem-elite-coupon
 * 
 * Marks an Elite coupon as used after successful redemption
 * This prevents the coupon from being used again
 */
export async function POST(request: NextRequest) {
  try {
    const { couponCode, customerEmail, userId, orderId } = await request.json()

    if (!couponCode || !customerEmail || !userId) {
      return NextResponse.json(
        { error: 'Coupon code, customer email, and user ID are required' },
        { status: 400 }
      )
    }

    console.log('🎫 Redeeming Elite coupon:', couponCode, 'for user:', userId)

    // Mark coupon as used
    const { data: updatedCoupon, error: updateError } = await supabaseAdmin
      .from('elite_coupons')
      .update({
        is_used: true,
        used_at: new Date().toISOString(),
        order_id: orderId || null
      })
      .eq('coupon_code', couponCode)
      .eq('customer_email', customerEmail)
      .eq('user_id', userId)
      .eq('is_used', false)
      .select()
      .single()

    if (updateError || !updatedCoupon) {
      console.error('❌ Error marking coupon as used:', updateError)
      return NextResponse.json(
        { error: 'Failed to redeem coupon' },
        { status: 500 }
      )
    }

    console.log('✅ Elite coupon marked as used successfully')

    return NextResponse.json({
      success: true,
      message: 'Coupon redeemed successfully'
    })

  } catch (error) {
    console.error('❌ Error redeeming Elite coupon:', error)
    return NextResponse.json(
      { error: 'Failed to redeem coupon' },
      { status: 500 }
    )
  }
}
