import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 Fetching user orders...')
    
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
    
    // Use service role client to bypass RLS for API operations
    const client = supabaseAdmin || supabase
    console.log('🔍 Querying orders for user:', userId)

    // First, check if the orders table exists by trying a simple query
    console.log('🔍 Testing database connection...')
    const { data: testData, error: testError } = await client
      .from('orders')
      .select('id')
      .limit(1)

    if (testError) {
      console.error('❌ Database connection error:', testError)
      if (testError.code === '42P01') {
        return NextResponse.json(
          { 
            error: 'Database table "orders" does not exist. Please run the database schema setup.',
            details: 'Run the SQL commands in database-schema.sql in your Supabase SQL Editor'
          },
          { status: 500 }
        )
      }
      return NextResponse.json(
        { error: 'Database connection failed', details: testError.message },
        { status: 500 }
      )
    }

    console.log('✅ Database connection successful')

    // First, let's see all orders in the database (for debugging)
    const { data: allOrders, error: allOrdersError } = await client
      .from('orders')
      .select('id, user_id, created_at')
      .order('created_at', { ascending: false })
      .limit(10)
    
    console.log('📊 All orders in database (last 10):', allOrders)
    console.log('📊 Looking for user_id:', userId)
    
    // Fetch orders with items for the user using service role client
    const { data: orders, error: ordersError } = await client
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    console.log('📊 Final Supabase response:')
    console.log('- Orders data:', orders)
    console.log('- Orders error:', ordersError)
    console.log('- Orders count:', orders?.length || 0)
    
    // If no orders found, log it
    if (!orders || orders.length === 0) {
      console.log('🔍 No orders found for user:', userId)
    }

    if (ordersError) {
      console.error('❌ Error fetching orders:', ordersError)
      return NextResponse.json(
        { error: 'Failed to fetch orders', details: ordersError.message },
        { status: 500 }
      )
    }

    // Transform the data to match the expected format
    const transformedOrders = orders.map((order: any) => ({
      id: order.id,
      name: order.order_items?.[0]?.product_name || 'Product',
      orderNumber: `ORD-${order.id.toString().padStart(6, '0')}`,
      purchaseDate: order.created_at,
      price: order.total_amount,
      status: order.status,
      trackingNumber: order.tracking_number || 'N/A',
      estimatedDelivery: order.estimated_delivery || 'TBD',
      actualDelivery: order.actual_delivery || null,
      shippingMethod: order.shipping_method || null,
      carrier: order.carrier || null,
      comment: order.comment || null,
      shippingAddress: order.shipping_address ? 
        (typeof order.shipping_address === 'string' ? 
          JSON.parse(order.shipping_address) : 
          order.shipping_address) : {},
      items: order.order_items?.map((item: any) => ({
        name: item.product_name,
        quantity: item.quantity,
        price: item.unit_price
      })) || []
    }))

    console.log('✅ Transformed orders:', transformedOrders)

    return NextResponse.json({ 
      orders: transformedOrders,
      success: true 
    })

  } catch (error) {
    console.error('💥 Error fetching user orders:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
