import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    
    // Fetch all user profiles
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('user_profiles')
      .select(`
        id,
        user_id,
        full_name,
        phone,
        role,
        created_at
      `)

    if (profilesError) {
      console.error('❌ Error fetching profiles:', profilesError)
      return NextResponse.json(
        { error: 'Failed to fetch profiles', details: profilesError.message },
        { status: 500 }
      )
    }

    if (!profiles || profiles.length === 0) {
      return NextResponse.json({ 
        clients: [],
        success: true 
      })
    }

    console.log('📊 Found profiles:', profiles.length)

    // Get all orders for all users
    const { data: orders, error: ordersError } = await supabaseAdmin
      .from('orders')
      .select(`
        id,
        user_id,
        total_amount,
        created_at,
        shipping_address,
        order_items (
          product_name,
          quantity,
          unit_price
        )
      `)

    if (ordersError) {
      console.error('❌ Error fetching orders:', ordersError)
      return NextResponse.json(
        { error: 'Failed to fetch orders', details: ordersError.message },
        { status: 500 }
      )
    }

    console.log('📊 Orders data:', orders?.length || 0, 'orders found')
    console.log('📊 Profiles data:', profiles?.length || 0, 'profiles found')
    
    // Debug: Show all orders with their user_ids
    if (orders && orders.length > 0) {
      console.log('📋 All orders by user_id:')
      const ordersByUser: { [userId: string]: any[] } = {}
      orders.forEach((order: any) => {
        if (!ordersByUser[order.user_id]) {
          ordersByUser[order.user_id] = []
        }
        ordersByUser[order.user_id].push(order)
      })
      Object.entries(ordersByUser).forEach(([userId, userOrders]) => {
        console.log(`  User ${userId}: ${userOrders.length} orders`)
      })
    }

    // Create a map of user_id to email and name from shipping addresses in orders
    const userEmails: { [key: string]: string } = {}
    const userNames: { [key: string]: string } = {}
    if (orders && orders.length > 0) {
      orders.forEach((order: any) => {
        if (order.shipping_address && order.user_id) {
          try {
            const shippingAddress = JSON.parse(order.shipping_address)
            if (shippingAddress.email) {
              userEmails[order.user_id] = shippingAddress.email
            }
            // Get name from shipping address
            if (shippingAddress.firstName && shippingAddress.lastName) {
              userNames[order.user_id] = `${shippingAddress.firstName} ${shippingAddress.lastName}`
            }
          } catch (error) {
            console.log('⚠️ Error parsing shipping address for order:', order.id)
          }
        }
      })
    }

    // Create a map to group clients by email
    const clientsByEmail: { [email: string]: any } = {}

    // Process each profile and group by email
    profiles.forEach((profile: any) => {
      const userOrders = orders ? orders.filter((order: any) => order.user_id === profile.user_id) : []
      
      // Get the real email and name from shipping addresses, fallback to placeholder if no orders exist
      const realEmail = userEmails[profile.user_id] || `user-${profile.user_id.slice(0, 8)}@example.com`
      const realName = userNames[profile.user_id] || profile.full_name || 'Unknown'
      
      console.log(`👤 Processing client: ${profile.full_name || 'Unknown'} (${profile.user_id}) - Email: ${realEmail}`)
      console.log(`📦 Found ${userOrders.length} orders for user ${profile.user_id}:`, userOrders.map(o => `Order ${o.id} - $${o.total_amount}`))
      console.log(`   Profile data:`, { full_name: profile.full_name, phone: profile.phone, role: profile.role })
      console.log(`   Real name from shipping: ${userNames[profile.user_id] || 'Not found'}`)
      console.log(`   Final name: ${realName}`)
      
      // Debug: Check if we're accidentally counting order items
      if (userOrders.length > 0) {
        const totalOrderItems = userOrders.reduce((sum, order) => sum + (order.order_items?.length || 0), 0)
        console.log(`   📊 Order items total: ${totalOrderItems} (should be different from order count: ${userOrders.length})`)
      }

      // If we already have this email, merge the data
      if (clientsByEmail[realEmail]) {
        const existingClient = clientsByEmail[realEmail]
        
        // Merge orders - ensure we don't duplicate orders
        const existingOrderIds = new Set(existingClient.userOrders.map((o: any) => o.id))
        const newUniqueOrders = userOrders.filter((order: any) => !existingOrderIds.has(order.id))
        const allOrders = [...existingClient.userOrders, ...newUniqueOrders]
        
        const totalSpent = allOrders.reduce((sum: number, order: any) => sum + order.total_amount, 0)
        const lastOrder = allOrders.length > 0 ? allOrders.sort((a: any, b: any) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0] : null

        console.log(`🔄 Merging client ${realEmail}: existing orders: ${existingClient.userOrders.length}, new orders: ${userOrders.length}, unique new: ${newUniqueOrders.length}, total: ${allOrders.length}`)
        console.log(`   Existing order IDs: [${existingClient.userOrders.map((o: any) => o.id).join(', ')}]`)
        console.log(`   New order IDs: [${userOrders.map((o: any) => o.id).join(', ')}]`)
        console.log(`   Final order IDs: [${allOrders.map((o: any) => o.id).join(', ')}]`)

        // Merge products
        const allProducts = allOrders.flatMap((order: any) => 
          order.order_items.map((item: any) => ({
            name: item.product_name,
            quantity: item.quantity,
            price: item.unit_price,
            orderDate: order.created_at
          }))
        )

        // Update the existing client with merged data
        clientsByEmail[realEmail] = {
          ...existingClient,
          userIds: [...existingClient.userIds, profile.user_id], // Keep track of all user IDs
          totalOrders: allOrders.length, // This is now the correct total count
          totalSpent: totalSpent,
          lastOrderDate: lastOrder ? lastOrder.created_at : null,
          products: allProducts,
          // Use the most recent profile data for name and phone
          fullName: realName || existingClient.fullName,
          phone: profile.phone || existingClient.phone,
          userOrders: allOrders // Update the userOrders for potential future merges
        }
      } else {
        // First time seeing this email, create new client
        const totalSpent = userOrders.reduce((sum: number, order: any) => sum + order.total_amount, 0)
        const lastOrder = userOrders.length > 0 ? userOrders.sort((a: any, b: any) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0] : null

        // Get all products purchased by this user
        const products = userOrders.flatMap((order: any) => 
          order.order_items.map((item: any) => ({
            name: item.product_name,
            quantity: item.quantity,
            price: item.unit_price,
            orderDate: order.created_at
          }))
        )

        console.log(`🆕 Creating new client ${realEmail}: orders: ${userOrders.length}`)

        clientsByEmail[realEmail] = {
          id: profile.id,
          userIds: [profile.user_id], // Array to track all user IDs for this email
          email: realEmail,
          fullName: realName,
          phone: profile.phone || null,
          role: profile.role || 'client',
          totalOrders: userOrders.length,
          totalSpent: totalSpent,
          lastOrderDate: lastOrder ? lastOrder.created_at : null,
          products: products,
          oneOnOneSessions: 0, // TODO: Implement when one-on-one sessions are added
          programs: [], // TODO: Implement when programs are added
          userOrders: userOrders // Keep for merging
        }
      }
    })

    // Convert the map back to an array
    const clients = Object.values(clientsByEmail).map((client: any) => {
      // Remove the temporary userOrders field
      const { userOrders, ...clientData } = client
      return clientData
    })

    console.log('✅ Admin: Fetched clients:', clients.length)
    console.log('📊 Client order counts:', clients.map(c => `${c.email}: ${c.totalOrders} orders`))

    return NextResponse.json({ 
      clients: clients,
      success: true 
    })

  } catch (error) {
    console.error('Error fetching admin clients:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
