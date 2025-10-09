import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 Admin: Fetching all orders...')
    
    // Fetch all orders with their items
    const { data: orders, error: ordersError } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .order('created_at', { ascending: false })

    if (ordersError) {
      console.error('❌ Error fetching orders:', ordersError)
      return NextResponse.json(
        { error: 'Failed to fetch orders', details: ordersError.message },
        { status: 500 }
      )
    }

    console.log('✅ Admin: Fetched orders:', orders?.length || 0)

    // Transform the data to match the expected format
    const transformedOrders = orders.map((order: any) => {
      const shippingAddress = order.shipping_address ? JSON.parse(order.shipping_address) : {}
      return {
        id: order.id,
        name: order.order_items[0]?.product_name || 'Product',
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
        shippingAddress: shippingAddress,
        email: shippingAddress.email || null,
        phone: shippingAddress.phone || null,
        customerName: shippingAddress.firstName && shippingAddress.lastName 
          ? `${shippingAddress.firstName} ${shippingAddress.lastName}` 
          : null,
        items: order.order_items.map((item: any) => ({
          name: item.product_name,
          quantity: item.quantity,
          price: item.unit_price
        }))
      }
    })

    return NextResponse.json({ 
      orders: transformedOrders,
      success: true 
    })

  } catch (error) {
    console.error('Error fetching admin orders:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('🔄 Admin: Updating order...')
    
    const body = await request.json()
    const { orderId, status, trackingNumber, carrier, comment } = body
    
    console.log('📦 Update request:', { orderId, status, trackingNumber, carrier, comment })

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    // Prepare update data
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    // Add fields if provided
    if (status) updateData.status = status
    if (trackingNumber) updateData.tracking_number = trackingNumber
    if (carrier) updateData.carrier = carrier
    if (comment !== undefined) updateData.comment = comment

    console.log('📦 Update data:', updateData)

    // Update the order
    const { data: updatedOrder, error: updateError } = await supabaseAdmin
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select(`
        *,
        order_items (*)
      `)
      .single()

    if (updateError) {
      console.error('❌ Error updating order:', updateError)
      return NextResponse.json(
        { error: `Failed to update order: ${updateError.message}` },
        { status: 500 }
      )
    }

    console.log('✅ Order updated successfully')

    return NextResponse.json({ 
      order: updatedOrder,
      success: true,
      message: 'Order updated successfully'
    })

  } catch (error) {
    console.error('Error updating admin order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}