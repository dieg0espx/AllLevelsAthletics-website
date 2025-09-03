import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 Fetching user orders...')
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    console.log('👤 User ID received:', userId)
    console.log('🔍 User ID type:', typeof userId)
    console.log('🔍 User ID length:', userId?.length)
    console.log('🔍 User ID value:', JSON.stringify(userId))

    if (!userId) {
      console.log('❌ No user ID provided')
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    console.log('🔍 Querying Supabase for orders...')
    console.log('🔍 Query: SELECT * FROM orders WHERE user_id = ?', userId)
    
    // First, let's check if the orders table exists and has any data
    const { data: allOrders, error: allOrdersError } = await supabase
      .from('orders')
      .select('id, user_id, created_at')
      .limit(5)
    
    console.log('📊 All orders check (first 5):', allOrders)
    console.log('📊 All orders error:', allOrdersError)
    
    // Check if there are any orders for this specific user
    const { data: userOrdersCheck, error: userOrdersCheckError } = await supabase
      .from('orders')
      .select('id, user_id, created_at')
      .eq('user_id', userId)
      .limit(1)
    
    console.log('📊 User orders check:', userOrdersCheck)
    console.log('📊 User orders check error:', userOrdersCheckError)
    
    // Fetch orders with items for the user
    const { data: orders, error: ordersError } = await supabase
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
    
    // If no orders found, let's check if there are any orders at all
    if (!orders || orders.length === 0) {
      console.log('🔍 No orders found for user, checking if any orders exist...')
      const { data: totalOrders, error: totalOrdersError } = await supabase
        .from('orders')
        .select('count')
      
      console.log('📊 Total orders in table:', totalOrders)
      console.log('📊 Total orders error:', totalOrdersError)
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
      name: order.order_items[0]?.product_name || 'Product',
      orderNumber: `ORD-${order.id.toString().padStart(6, '0')}`,
      purchaseDate: order.created_at,
      price: order.total_amount,
      status: order.status,
      trackingNumber: order.tracking_number || 'N/A',
      estimatedDelivery: order.estimated_delivery || 'TBD',
      actualDelivery: order.actual_delivery || null,
      shippingAddress: order.shipping_address ? JSON.parse(order.shipping_address) : {},
      items: order.order_items.map((item: any) => ({
        name: item.product_name,
        quantity: item.quantity,
        price: item.unit_price
      }))
    }))

    console.log('✅ Transformed orders:', transformedOrders)

    return NextResponse.json({ 
      orders: transformedOrders,
      success: true 
    })

  } catch (error) {
    console.error('Error fetching user orders:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
