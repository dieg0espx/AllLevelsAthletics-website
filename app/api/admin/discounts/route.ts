import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET - Fetch current discounts
export async function GET(request: NextRequest) {
  try {
    const { data: discounts, error } = await supabaseAdmin
      .from('discounts')
      .select('*')
      .eq('is_active', true)
      .order('discount_type')

    if (error) {
      console.error('Error fetching discounts:', error)
      console.error('Error details:', error.message, error.details, error.hint)
      
      // Check if it's a table not found error
      if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
        return NextResponse.json(
          { 
            error: 'Discounts table not found. Please run the database migration first.',
            details: 'Run the SQL migration: supabase-migrations/create-discounts-table.sql'
          },
          { status: 500 }
        )
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to fetch discounts',
          details: error.message 
        },
        { status: 500 }
      )
    }

    // Handle empty results - return default discounts
    if (!discounts || discounts.length === 0) {
      return NextResponse.json({ 
        discounts: {
          coaching: { percentage: 0, id: null, isActive: false },
          products: { percentage: 0, id: null, isActive: false }
        },
        message: 'No discounts found. Defaults will be used.'
      })
    }

    // Convert to a more convenient format
    const discountMap = discounts.reduce((acc: any, discount: any) => {
      acc[discount.discount_type] = {
        percentage: parseFloat(discount.discount_percentage),
        id: discount.id,
        isActive: discount.is_active
      }
      return acc
    }, {})

    return NextResponse.json({ discounts: discountMap })

  } catch (error) {
    console.error('Error in GET /api/admin/discounts:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// PUT - Update discount
export async function PUT(request: NextRequest) {
  try {
    const { discountType, percentage, userId } = await request.json()

    // Validate admin role
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId)
    
    if (userError || !userData || userData.user?.user_metadata?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      )
    }

    // Validate input
    if (!discountType || !['coaching', 'products'].includes(discountType)) {
      return NextResponse.json(
        { error: 'Invalid discount type. Must be "coaching" or "products"' },
        { status: 400 }
      )
    }

    if (percentage === undefined || percentage === null || percentage < 0 || percentage > 100) {
      return NextResponse.json(
        { error: 'Invalid percentage. Must be between 0 and 100' },
        { status: 400 }
      )
    }

    // First, deactivate all existing discounts of this type
    await supabaseAdmin
      .from('discounts')
      .update({ is_active: false })
      .eq('discount_type', discountType)
      .eq('is_active', true)

    // Then create a new active discount
    const { data: newDiscount, error: insertError } = await supabaseAdmin
      .from('discounts')
      .insert([{
        discount_type: discountType,
        discount_percentage: percentage,
        is_active: true,
        created_by: userId,
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (insertError) {
      console.error('Error updating discount:', insertError)
      return NextResponse.json(
        { error: 'Failed to update discount' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      discount: {
        type: newDiscount.discount_type,
        percentage: parseFloat(newDiscount.discount_percentage),
        isActive: newDiscount.is_active
      }
    })

  } catch (error) {
    console.error('Error in PUT /api/admin/discounts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

