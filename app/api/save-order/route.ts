import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  // Force immediate logging
  console.log('🚀 ===== SAVE ORDER API STARTED =====')
  console.log('🚀 ===== SAVE ORDER API STARTED =====')
  console.log('🚀 ===== SAVE ORDER API STARTED =====')
  
  // Check if service role key is configured
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('🚨 CRITICAL: SUPABASE_SERVICE_ROLE_KEY is not configured!')
    return NextResponse.json(
      { 
        error: 'Server configuration error: Missing Supabase service role key',
        details: 'Add SUPABASE_SERVICE_ROLE_KEY to your .env.local file'
      },
      { status: 500 }
    )
  }

  // Check if supabaseAdmin client is available
  if (!supabaseAdmin) {
    console.error('🚨 CRITICAL: supabaseAdmin client is not available!')
    return NextResponse.json(
      { 
        error: 'Server configuration error: Supabase admin client not initialized',
        details: 'Check your SUPABASE_SERVICE_ROLE_KEY configuration'
      },
      { status: 500 }
    )
  }
  
  try {
    console.log('🔄 Save order API called')
    console.log('🔄 Save order API called')
    console.log('🔄 Save order API called')
    
    const requestBody = await request.json()
    console.log('📥 Request body received:', requestBody)
    
    const { sessionId, items, shippingInfo, userId, totalAmount } = requestBody

    console.log('🔍 Validating order data:')
    console.log('- sessionId:', sessionId)
    console.log('- items count:', items?.length)
    console.log('- shippingInfo:', shippingInfo)
    console.log('- userId:', userId)
    console.log('- totalAmount:', totalAmount)
    console.log('- userId type:', typeof userId)
    console.log('- userId length:', userId?.toString().length)

    if (!sessionId || !items || !shippingInfo || !userId) {
      console.log('❌ Missing required fields')
      const missingFields = []
      if (!sessionId) missingFields.push('sessionId')
      if (!items) missingFields.push('items')
      if (!shippingInfo) missingFields.push('shippingInfo')
      if (!userId) missingFields.push('userId')
      
      return NextResponse.json(
        { error: `Missing required order information: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Check if order already exists for this session
    const { data: existingOrder, error: checkError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('stripe_session_id', sessionId)
      .single()

    if (existingOrder) {
      console.log('✅ Order already exists for this session:', existingOrder.id)
      return NextResponse.json({ 
        success: true, 
        orderId: existingOrder.id,
        message: 'Order already exists',
        orderData: existingOrder,
        itemsCount: 0
      })
    }

    // Create order record
    const { data: orderData, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert([
        {
          user_id: userId,
          stripe_session_id: sessionId,
          total_amount: totalAmount,
          status: 'processing',
          shipping_address: JSON.stringify(shippingInfo),
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (orderError) {
      console.error('❌ Error creating order:', orderError)
      
      // Check if it's a table doesn't exist error
      if (orderError.code === '42P01') {
        console.error('🚨 TABLE DOES NOT EXIST: The "orders" table is missing!')
        return NextResponse.json(
          { 
            error: 'Database table "orders" does not exist. Please create the required database tables first.',
            details: 'Follow the setup guide in SUPABASE_SETUP_GUIDE.md'
          },
          { status: 500 }
        )
      }
      
      return NextResponse.json(
        { error: `Failed to create order: ${orderError.message}` },
        { status: 500 }
      )
    }

    console.log('🔍 Creating order items...')
    console.log('📦 Items to process:', items)
    
    // Create order items records
    const orderItems = items.map((item: any) => {
      console.log('🔍 Processing item:', item)
      
      const orderItem = {
        order_id: orderData.id,
        product_id: item.id,
        product_name: item.name,
        product_description: item.description,
        product_image: item.image,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity
      }
      
      console.log('📦 Created order item:', orderItem)
      return orderItem
    })
    
    console.log('📦 All order items prepared:', orderItems)

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('❌ Error creating order items:', itemsError)
      
      // Check if it's a table doesn't exist error
      if (itemsError.code === '42P01') {
        console.error('🚨 TABLE DOES NOT EXIST: The "order_items" table is missing!')
        // Try to delete the order if items creation fails
        await supabaseAdmin.from('orders').delete().eq('id', orderData.id)
        return NextResponse.json(
          { 
            error: 'Database table "order_items" does not exist. Please create the required database tables first.',
            details: 'Follow the setup guide in SUPABASE_SETUP_GUIDE.md'
          },
          { status: 500 }
        )
      }
      
      // Try to delete the order if items creation fails
      await supabaseAdmin.from('orders').delete().eq('id', orderData.id)
      return NextResponse.json(
        { error: `Failed to create order items: ${itemsError.message}` },
        { status: 500 }
      )
    }

    console.log('🎉 Order and items created successfully!')
    console.log('📊 Order ID:', orderData.id)
    console.log('📦 Items count:', orderItems.length)
    
    return NextResponse.json({ 
      success: true, 
      orderId: orderData.id,
      message: 'Order saved successfully',
      orderData: orderData,
      itemsCount: orderItems.length
    })

  } catch (error) {
    console.error('🚨 ===== CRITICAL ERROR IN SAVE ORDER API =====')
    console.error('💥 CRITICAL ERROR in save-order API:', error)
    
    // Log more details about the error
    if (error instanceof Error) {
      console.error('💥 Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      })
    }
    
    // Check if it's a Supabase connection error
    if (error && typeof error === 'object' && 'message' in error) {
      const errorMessage = (error as any).message
      if (errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('connection')) {
        console.error('🌐 NETWORK/CONNECTION ERROR detected')
        return NextResponse.json(
          { error: 'Database connection failed. Please check your internet connection and try again.' },
          { status: 500 }
        )
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        errorName: error instanceof Error ? error.name : 'Unknown error type',
        fullError: JSON.stringify(error, null, 2)
      },
      { status: 500 }
    )
  }
}
