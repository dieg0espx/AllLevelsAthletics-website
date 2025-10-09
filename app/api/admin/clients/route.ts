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

    // Get all user programs to show enrollment and progress
    const { data: userPrograms, error: programsError } = await supabaseAdmin
      .from('user_programs')
      .select('*')

    if (programsError) {
      console.error('❌ Error fetching user programs:', programsError)
      console.error('Error details:', programsError.message)
    }

    console.log('📊 User programs data:', userPrograms?.length || 0, 'enrollments found')
    
    // Debug: Show programs by user
    if (userPrograms && userPrograms.length > 0) {
      console.log('📚 Programs by user:')
      userPrograms.forEach((program: any) => {
        console.log(`  User ${program.user_id}: ${program.program_name} - ${program.progress}% progress`)
      })
    }

    // Get all user subscriptions to show one-on-one coaching enrollments
    const { data: userSubscriptions, error: subscriptionsError } = await supabaseAdmin
      .from('user_subscriptions')
      .select('*')

    if (subscriptionsError) {
      console.error('❌ Error fetching user subscriptions:', subscriptionsError)
      console.error('Error details:', subscriptionsError.message)
    }

    console.log('💳 User subscriptions data:', userSubscriptions?.length || 0, 'subscriptions found')
    
    // Debug: Show subscriptions by user
    if (userSubscriptions && userSubscriptions.length > 0) {
      console.log('💳 Subscriptions by user:')
      userSubscriptions.forEach((sub: any) => {
        console.log(`  User ${sub.user_id}: ${sub.plan_name} - ${sub.status}`)
      })
    }
    
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

    // Get auth user data for all profiles (SAME AS COACHING-CLIENTS)
    const authUsers: { [key: string]: any } = {}
    for (const profile of profiles) {
      try {
        const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(profile.user_id)
        if (authUser?.user) {
          authUsers[profile.user_id] = authUser.user
        }
      } catch (error) {
        console.log('⚠️ Error fetching auth user for:', profile.user_id)
      }
    }

    // Create a map to group clients by email
    const clientsByEmail: { [email: string]: any } = {}

    // Process each profile - use ONLY auth user data, one user per email
    profiles.forEach((profile: any) => {
      // Get auth user for this profile
      const authUser = authUsers[profile.user_id]
      
      // Get the real email - MUST come from auth user to ensure uniqueness
      const realEmail = authUser?.email || userEmails[profile.user_id]
      
      // Skip profiles without a valid email (shouldn't happen but safety check)
      if (!realEmail) {
        console.log(`⚠️ Skipping profile ${profile.user_id} - no valid email found`)
        return
      }
      
      // If we already have this email, skip it (first one wins)
      if (clientsByEmail[realEmail]) {
        console.log(`⚠️ Duplicate email detected: ${realEmail} - Skipping profile ${profile.user_id} (already have ${clientsByEmail[realEmail].user_id})`)
        return
      }
      
      const userOrders = orders ? orders.filter((order: any) => order.user_id === profile.user_id) : []
      
      const realName = authUser?.user_metadata?.full_name || 
                      profile.full_name || 
                      userNames[profile.user_id] || 
                      authUser?.email?.split('@')[0] || 
                      'Unknown'
      
      console.log(`👤 Processing client: ${realName} (${profile.user_id}) - Email: ${realEmail}`)
      
      // Debug: Check if we're accidentally counting order items
      if (userOrders.length > 0) {
        const totalOrderItems = userOrders.reduce((sum, order) => sum + (order.order_items?.length || 0), 0)
        console.log(`   📊 Order items total: ${totalOrderItems} (should be different from order count: ${userOrders.length})`)
      }

      // Create client entry (no merging - one email = one client)
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

      console.log(`🆕 Creating client ${realEmail}: orders: ${userOrders.length}`)

      clientsByEmail[realEmail] = {
        id: profile.id,
        user_id: profile.user_id, // Single user_id
        email: realEmail,
        full_name: realName,
        phone: profile.phone || null,
        role: profile.role || 'client',
        totalOrders: userOrders.length,
        totalSpent: totalSpent,
        lastOrderDate: lastOrder ? lastOrder.created_at : null,
        products: products,
        oneOnOneSessions: 0
      }
    })

    // Convert the map back to an array and add program enrollments and subscriptions
    const clients = Object.values(clientsByEmail).map((client: any) => {
      // Get programs for this single user_id
      const clientPrograms = userPrograms ? userPrograms.filter((p: any) => 
        p.user_id === client.user_id
      ) : []
      
      // Get active subscription for this user_id
      const clientSubscription = userSubscriptions ? userSubscriptions.find((s: any) => 
        s.user_id === client.user_id && (s.status === 'active' || s.status === 'trialing')
      ) : null
      
      console.log(`👤 Client ${client.email} (${client.user_id}): ${clientPrograms.length} program(s), ${clientSubscription ? 'HAS subscription' : 'NO subscription'}`)
      if (clientPrograms.length > 0) {
        console.log(`   📚 Programs:`, clientPrograms.map((p: any) => `${p.program_name} (${p.progress}%)`).join(', '))
      }
      if (clientSubscription) {
        console.log(`   💳 Subscription: ${clientSubscription.plan_name} (${clientSubscription.status})`)
      }
      
      return {
        ...client,
        programs: clientPrograms.map((p: any) => ({
          program_name: p.program_name,
          program_id: p.program_id,
          progress: p.progress || 0,
          status: p.status,
          start_date: p.start_date
        })),
        subscription: clientSubscription ? {
          plan_name: clientSubscription.plan_name,
          status: clientSubscription.status,
          current_period_end: clientSubscription.current_period_end
        } : null
      }
    })

    console.log('✅ Admin: Fetched clients:', clients.length)
    console.log('📊 Client order counts:', clients.map(c => `${c.email}: ${c.totalOrders} orders`))
    console.log('📚 Client program enrollments:', clients.map(c => `${c.email}: ${c.programs?.length || 0} programs`))
    console.log('💳 Client subscriptions:', clients.map(c => `${c.email}: ${c.subscription ? c.subscription.plan_name : 'None'}`))

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
