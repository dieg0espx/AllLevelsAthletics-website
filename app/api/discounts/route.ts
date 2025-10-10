import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET - Fetch active discounts (public endpoint)
export async function GET(request: NextRequest) {
  try {
    const { data: discounts, error } = await supabaseAdmin
      .from('discounts')
      .select('discount_type, discount_percentage')
      .eq('is_active', true)

    if (error) {
      console.error('Error fetching discounts:', error)
      
      // If table doesn't exist, return default values (no discounts)
      if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
        console.log('Discounts table not found, returning default values (0% discount)')
        return NextResponse.json({ 
          discounts: {},
          coaching: 0,
          products: 0
        })
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to fetch discounts',
          details: error.message 
        },
        { status: 500 }
      )
    }

    // Convert to a more convenient format
    const discountMap = discounts?.reduce((acc: any, discount: any) => {
      acc[discount.discount_type] = parseFloat(discount.discount_percentage)
      return acc
    }, {}) || {}

    return NextResponse.json({ 
      discounts: discountMap,
      coaching: discountMap.coaching || 0,
      products: discountMap.products || 0
    })

  } catch (error) {
    console.error('Error in GET /api/discounts:', error)
    // Return default values on error to avoid breaking the frontend
    return NextResponse.json({ 
      discounts: {},
      coaching: 0,
      products: 0
    })
  }
}

