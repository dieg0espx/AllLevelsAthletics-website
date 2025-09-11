import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function PUT(request: NextRequest) {
  try {
    console.log('🔄 Updating order status...')
    
    const body = await request.json()
    const { orderId, status, trackingNumber, estimatedDelivery, actualDelivery, shippingMethod, carrier, comment } = body
    
    console.log('📦 Update request:', { orderId, status, trackingNumber, estimatedDelivery, actualDelivery, shippingMethod, carrier, comment })

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Order ID and status are required' },
        { status: 400 }
      )
    }

    // Validate status
    const validStatuses = ['processing', 'shipped', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      )
    }

    // Prepare update data
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    }

    // Add optional fields if provided
    if (trackingNumber) {
      updateData.tracking_number = trackingNumber
    }
    
    if (estimatedDelivery) {
      updateData.estimated_delivery = estimatedDelivery
    }
    
    if (actualDelivery) {
      updateData.actual_delivery = actualDelivery
    }

    if (shippingMethod) {
      updateData.shipping_method = shippingMethod
    }

    if (carrier) {
      updateData.carrier = carrier
    }

    if (comment) {
      updateData.comment = comment
    }

    // If status is delivered and no actual delivery date provided, set it to now
    if (status === 'delivered' && !actualDelivery) {
      updateData.actual_delivery = new Date().toISOString().split('T')[0]
    }

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

    console.log('✅ Order updated successfully:', updatedOrder)

    // Transform the response to match the expected format
    const transformedOrder = {
      id: updatedOrder.id,
      name: updatedOrder.order_items[0]?.product_name || 'Product',
      orderNumber: `ORD-${updatedOrder.id.toString().padStart(6, '0')}`,
      purchaseDate: updatedOrder.created_at,
      price: updatedOrder.total_amount,
      status: updatedOrder.status,
      trackingNumber: updatedOrder.tracking_number || 'N/A',
      estimatedDelivery: updatedOrder.estimated_delivery || 'TBD',
      actualDelivery: updatedOrder.actual_delivery || null,
      shippingMethod: updatedOrder.shipping_method || null,
      carrier: updatedOrder.carrier || null,
      comment: updatedOrder.comment || null,
      shippingAddress: updatedOrder.shipping_address ? JSON.parse(updatedOrder.shipping_address) : {},
      items: updatedOrder.order_items.map((item: any) => ({
        name: item.product_name,
        quantity: item.quantity,
        price: item.unit_price
      }))
    }

    // Send email notification (async, don't wait for response)
    try {
      const shippingAddress = updatedOrder.shipping_address ? JSON.parse(updatedOrder.shipping_address) : {}
      
      fetch('/api/send-status-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: updatedOrder.id,
          orderNumber: transformedOrder.orderNumber,
          customerEmail: shippingAddress.email,
          customerName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
          status: updatedOrder.status,
          trackingNumber: updatedOrder.tracking_number,
          estimatedDelivery: updatedOrder.estimated_delivery,
          productName: updatedOrder.order_items[0]?.product_name
        })
      }).catch(error => {
        console.error('Failed to send status notification email:', error)
        // Don't fail the main request if email fails
      })
    } catch (error) {
      console.error('Error sending status notification:', error)
    }

    return NextResponse.json({ 
      order: transformedOrder,
      success: true,
      message: `Order status updated to ${status}`
    })

  } catch (error) {
    console.error('Error updating order status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
