import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 Admin: Fetching all clients...')
    
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
      console.log('⚠️ No profiles found')
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

    // Create a map of user_id to email from shipping addresses in orders
    const userEmails: { [key: string]: string } = {}
    if (orders && orders.length > 0) {
      orders.forEach((order: any) => {
        if (order.shipping_address && order.user_id) {
          try {
            const shippingAddress = JSON.parse(order.shipping_address)
            if (shippingAddress.email) {
              userEmails[order.user_id] = shippingAddress.email
            }
          } catch (error) {
            console.log('⚠️ Error parsing shipping address for order:', order.id)
          }
        }
      })
    }

    // Transform the data to match the expected format
    const clients = profiles.map((profile: any) => {
      const userOrders = orders ? orders.filter((order: any) => order.user_id === profile.user_id) : []
      
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

      // Get the real email from shipping addresses, fallback to placeholder if no orders exist
      const realEmail = userEmails[profile.user_id] || `user-${profile.user_id.slice(0, 8)}@example.com`
      
      console.log(`👤 Processing client: ${profile.full_name || 'Unknown'} (${profile.user_id}) - Email: ${realEmail}`)

      return {
        id: profile.id,
        userId: profile.user_id,
        email: realEmail,
        fullName: profile.full_name || 'Unknown',
        phone: profile.phone || null,
        role: profile.role || 'client',
        totalOrders: userOrders.length,
        totalSpent: totalSpent,
        lastOrderDate: lastOrder ? lastOrder.created_at : null,
        products: products,
        oneOnOneSessions: 0, // TODO: Implement when one-on-one sessions are added
        programs: [] // TODO: Implement when programs are added
      }
    })

    console.log('✅ Admin: Fetched clients:', clients.length)

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
