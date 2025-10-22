"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSafeAuth } from "@/contexts/safe-auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users,
  Package,
  BookOpen,
  Percent
} from "lucide-react"

// Import section components
import { ClientsSection } from "@/components/admin/ClientsSection"
import { OrdersSection } from "@/components/admin/OrdersSection"
import { CoachingManagementSection } from "@/components/admin/CoachingManagementSection"
import { DiscountManagementSection } from "@/components/admin/DiscountManagementSection"

interface Client {
  id: string
  email: string
  full_name: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  totalOrders: number
  totalSpent: number
  lastOrderDate?: string
  products: Array<{
    name: string
    price: number
    orderDate?: string
    purchaseDate?: string
  }>
  programs?: Array<{
    program_name: string
    program_id: string
    progress: number
    status: string
    start_date: string
  }>
  subscription?: {
    plan_name: string
    status: string
    current_period_end?: string
  }
}

interface Order {
  id: string
  name: string
  orderNumber: string
  purchaseDate: string
  price: number
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled'
  trackingNumber: string
  estimatedDelivery: string
  actualDelivery: string | null
  shippingMethod?: string
  carrier?: string
  comment?: string
  shippingAddress: any
}

interface CheckIn {
  id: string
  scheduled_date: string
  check_in_type: string
  status: string
  notes?: string
  user?: {
    id: string
    email: string
    raw_user_meta_data?: {
      full_name?: string
    }
  }
}

export default function AdminPage() {
  const { user, loading, isHydrated } = useSafeAuth()
  const router = useRouter()

  // State for different sections
  const [clients, setClients] = useState<Client[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [checkIns, setCheckIns] = useState<CheckIn[]>([])
  const [coachingLoading, setCoachingLoading] = useState(false)
  
  const [clientsLoading, setClientsLoading] = useState(false)
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [checkInsLoading, setCheckInsLoading] = useState(false)

  // Client management state
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [clientSearchTerm, setClientSearchTerm] = useState('')

  // Check if user is admin
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
      return
    }
    
    if (user && user.user_metadata?.role !== 'admin') {
      router.push('/dashboard')
      return
    }
  }, [user, loading, router])

  // Fetch data functions
  const fetchClients = async () => {
    setClientsLoading(true)
    try {
      const response = await fetch('/api/admin/clients')
      if (response.ok) {
        const data = await response.json()
        setClients(data.clients || [])
      } else {
        console.error('Failed to fetch clients:', response.status)
        setClients([])
      }
    } catch (error) {
      console.error('Error fetching clients:', error)
      setClients([])
    } finally {
      setClientsLoading(false)
    }
  }

  const fetchOrders = async () => {
    setOrdersLoading(true)
    try {
      const response = await fetch('/api/admin/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      } else {
        console.error('Failed to fetch orders:', response.status)
        setOrders([])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      setOrders([])
    } finally {
      setOrdersLoading(false)
    }
  }

  const fetchCheckIns = async () => {
    setCheckInsLoading(true)
    try {
      const response = await fetch('/api/admin/check-ins')
      if (response.ok) {
        const data = await response.json()
        setCheckIns(data.checkIns || [])
      } else {
        console.error('Failed to fetch check-ins:', response.status)
        setCheckIns([])
      }
    } catch (error) {
      console.error('Error fetching check-ins:', error)
      setCheckIns([])
    } finally {
      setCheckInsLoading(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    if (user && user.user_metadata?.role === 'admin') {
      fetchClients()
      fetchOrders()
      fetchCheckIns()
    }
  }, [user])

  // Client management handlers
  const handleEditClient = (client: Client) => {
    setEditingClient(client)
  }

  const handleSaveClient = async (updatedClient: Client) => {
    try {
      const response = await fetch('/api/admin/clients', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedClient)
      })
      
      if (response.ok) {
        setClients(clients.map(c => c.id === updatedClient.id ? updatedClient : c))
        setEditingClient(null)
      }
    } catch (error) {
      console.error('Error updating client:', error)
    }
  }

  const handleCancelEdit = () => {
    setEditingClient(null)
  }

  // Order management handlers
  const handleUpdateOrder = async (orderId: string, updates: Partial<Order>) => {
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, ...updates })
      })
      
      if (response.ok) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, ...updates } : o))
      }
    } catch (error) {
      console.error('Error updating order:', error)
    }
  }

  // Check-ins refresh handler
  const handleRefreshCheckIns = () => {
    fetchCheckIns()
  }

  // Coaching refresh handler
  const handleRefreshCoaching = () => {
    setCoachingLoading(true)
    // The CoachingManagementSection will handle its own data fetching
    setTimeout(() => setCoachingLoading(false), 1000)
  }

  // Don't render until hydrated to prevent SSR issues
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!user || user.user_metadata?.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 pt-24 pb-8 md:pt-28">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-white/70">Manage your business operations</p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="coaching" className="space-y-6">
          <TabsList className="flex w-full bg-white/5 border-orange-500/30">
            <TabsTrigger 
              value="coaching" 
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-white/70"
            >
              <Users className="w-4 h-4 mr-2" />
              Coaching
            </TabsTrigger>
            <TabsTrigger 
              value="clients" 
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-white/70"
            >
              <Users className="w-4 h-4 mr-2" />
              Clients
            </TabsTrigger>
            <TabsTrigger 
              value="orders" 
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-white/70"
            >
              <Package className="w-4 h-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger 
              value="discounts" 
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-white/70"
            >
              <Percent className="w-4 h-4 mr-2" />
              Discounts
            </TabsTrigger>
          </TabsList>

          {/* Coaching Management Section */}
          <TabsContent value="coaching">
            <CoachingManagementSection 
              coachingLoading={coachingLoading}
              onRefresh={handleRefreshCoaching}
              checkIns={checkIns}
              checkInsLoading={checkInsLoading}
              onRefreshCheckIns={handleRefreshCheckIns}
            />
          </TabsContent>

          {/* Clients Section */}
          <TabsContent value="clients">
            <ClientsSection
              clients={clients}
              clientsLoading={clientsLoading}
              selectedClient={selectedClient}
              onSelectClient={setSelectedClient}
              onEditClient={handleEditClient}
              onSaveClient={handleSaveClient}
              onCancelEdit={handleCancelEdit}
              editingClient={editingClient}
              searchTerm={clientSearchTerm}
              onSearchChange={setClientSearchTerm}
            />
          </TabsContent>

          {/* Orders Section */}
          <TabsContent value="orders">
            <OrdersSection
              orders={orders}
              ordersLoading={ordersLoading}
              onUpdateOrder={handleUpdateOrder}
            />
          </TabsContent>

          {/* Discounts Section */}
          <TabsContent value="discounts">
            <DiscountManagementSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

