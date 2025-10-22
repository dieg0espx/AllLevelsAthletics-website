import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * POST /api/apply-elite-discount
 * 
 * Applies Elite discount to cart items
 * Pure database approach - no Stripe coupons needed
 */
export async function POST(request: NextRequest) {
  try {
    const { userEmail, userId, items } = await request.json()

    if (!userEmail || !userId || !items) {
      return NextResponse.json(
        { error: 'User email, user ID, and items are required' },
        { status: 400 }
      )
    }

    console.log('🔍 Checking Elite discount eligibility for:', userEmail)

    // Check if user has Elite subscription
    const { data: subscription, error: subError } = await supabaseAdmin
      .from('user_subscriptions')
      .select('plan_name, status')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    if (subError || !subscription || subscription.plan_name !== 'Elite') {
      console.log('❌ User does not have Elite subscription')
      return NextResponse.json({
        success: false,
        message: 'No Elite subscription found'
      })
    }

    // Check if user has valid Elite coupon
    const { data: coupon, error: couponError } = await supabaseAdmin
      .from('elite_coupons')
      .select('*')
      .eq('user_id', userId)
      .eq('customer_email', userEmail)
      .eq('is_used', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (couponError || !coupon) {
      console.log('❌ No valid Elite coupon found')
      return NextResponse.json({
        success: false,
        message: 'No valid Elite coupon found'
      })
    }

    // Check if coupon has expired
    const now = new Date()
    const expiresAt = new Date(coupon.expires_at)
    
    if (now > expiresAt) {
      console.log('❌ Elite coupon has expired')
      return NextResponse.json({
        success: false,
        message: 'Elite coupon has expired'
      })
    }

    // Apply discount to MF Roller items
    const discountedItems = items.map((item: any) => {
      if (item.id === 'knot-roller' || item.name?.includes('MFRoller')) {
        return {
          ...item,
          originalPrice: item.price,
          price: 0, // 100% discount
          discount: 100,
          discountReason: 'Elite Plan Benefit',
          couponCode: coupon.coupon_code
        }
      }
      return item
    })

    console.log('✅ Elite discount applied successfully')

    return NextResponse.json({
      success: true,
      discountedItems,
      coupon: {
        code: coupon.coupon_code,
        discount: coupon.discount_percentage,
        expiresAt: coupon.expires_at
      }
    })

  } catch (error) {
    console.error('❌ Error applying Elite discount:', error)
    return NextResponse.json(
      { error: 'Failed to apply discount' },
      { status: 500 }
    )
  }
}
