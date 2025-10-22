import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * POST /api/create-elite-coupon
 * 
 * Creates a 100% discount coupon for MF Roller for Elite plan customers
 * This is called after successful Elite plan subscription
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, customerEmail, planName } = await request.json()

    if (!userId || !customerEmail || planName !== 'Elite') {
      return NextResponse.json(
        { error: 'Invalid request - Elite plan required' },
        { status: 400 }
      )
    }

    console.log('🎁 Creating Elite MF Roller coupon for user:', userId)

    // Generate unique coupon code
    const couponCode = `ELITE-MF-${Date.now().toString(36).toUpperCase()}`
    
    // Store coupon info in database (pure database approach)
    const { data: couponData, error: dbError } = await supabaseAdmin
      .from('elite_coupons')
      .insert({
        user_id: userId,
        customer_email: customerEmail,
        coupon_code: couponCode,
        discount_percentage: 100,
        product_restriction: 'knot-roller', // MF Roller product ID
        is_used: false,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      })
      .select()
      .single()

    if (dbError) {
      console.error('❌ Error saving coupon to database:', dbError)
      return NextResponse.json(
        { error: 'Failed to save coupon' },
        { status: 500 }
      )
    }

    console.log('✅ Elite coupon created and saved successfully')

    return NextResponse.json({
      success: true,
      coupon: {
        code: couponCode,
        discount: 100,
        product: 'MFRoller',
        expiresAt: couponData.expires_at
      }
    })

  } catch (error) {
    console.error('❌ Error creating Elite coupon:', error)
    return NextResponse.json(
      { error: 'Failed to create coupon' },
      { status: 500 }
    )
  }
}
