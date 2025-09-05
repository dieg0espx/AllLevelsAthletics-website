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

    // Get all orders for all users
    const { data: orders, error: ordersError } = await supabaseAdmin
      .from('orders')
      .select(`
        id,
        user_id,
        total_amount,
        created_at,
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

    // Get user emails from auth.users (we'll need to do this differently)
    // For now, we'll use mock email data since we can't directly query auth.users
    const mockEmails: { [key: string]: string } = {
      // This would be populated from actual user data
    }

    // Transform the data to match the expected format
    const clients = profiles.map((profile: any) => {
      const userOrders = orders.filter((order: any) => order.user_id === profile.user_id)
      
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

      return {
        id: profile.id,
        userId: profile.user_id,
        email: mockEmails[profile.user_id] || 'user@example.com', // TODO: Get actual email
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
