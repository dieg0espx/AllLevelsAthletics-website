"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users,
  Package,
  BookOpen,
  Calendar,
  BarChart3
} from "lucide-react"

// Import section components
import { ClientsSection } from "@/components/admin/ClientsSection"
import { OrdersSection } from "@/components/admin/OrdersSection"
import { ProgramsSection } from "@/components/admin/ProgramsSection"
import { CheckInsSection } from "@/components/admin/CheckInsSection"
import { CoachingManagementSection } from "@/components/admin/CoachingManagementSection"

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
    purchaseDate: string
  }>
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

interface Program {
  id: string
  name: string
  description: string
  price: number
  duration: string
  category: string
  level: 'beginner' | 'intermediate' | 'advanced'
  isActive: boolean
  enrollmentCount: number
  totalRevenue: number
  createdAt: string
  updatedAt: string
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
  const { user, loading } = useAuth()
  const router = useRouter()

  // State for different sections
  const [clients, setClients] = useState<Client[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [programs, setPrograms] = useState<Program[]>([])
  const [checkIns, setCheckIns] = useState<CheckIn[]>([])
  const [coachingLoading, setCoachingLoading] = useState(false)
  
  const [clientsLoading, setClientsLoading] = useState(false)
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [programsLoading, setProgramsLoading] = useState(false)
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

  const fetchPrograms = async () => {
    setProgramsLoading(true)
    try {
      const response = await fetch('/api/admin/programs')
      if (response.ok) {
        const data = await response.json()
        setPrograms(data.programs || [])
      } else {
        console.error('Failed to fetch programs:', response.status)
        setPrograms([])
      }
    } catch (error) {
      console.error('Error fetching programs:', error)
      setPrograms([])
    } finally {
      setProgramsLoading(false)
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
      fetchPrograms()
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

  // Program management handlers
  const handleAddProgram = async (programData: Omit<Program, 'id' | 'enrollmentCount' | 'totalRevenue' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/admin/programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(programData)
      })
      
      if (response.ok) {
        const newProgram = await response.json()
        setPrograms([...programs, newProgram])
      }
    } catch (error) {
      console.error('Error adding program:', error)
    }
  }

  const handleUpdateProgram = async (programId: string, updates: Partial<Program>) => {
    try {
      const response = await fetch('/api/admin/programs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ programId, ...updates })
      })
      
      if (response.ok) {
        setPrograms(programs.map(p => p.id === programId ? { ...p, ...updates } : p))
      }
    } catch (error) {
      console.error('Error updating program:', error)
    }
  }

  const handleDeleteProgram = async (programId: string) => {
    try {
      const response = await fetch('/api/admin/programs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ programId })
      })
      
      if (response.ok) {
        setPrograms(programs.filter(p => p.id !== programId))
      }
    } catch (error) {
      console.error('Error deleting program:', error)
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
      <div className="container mx-auto px-4 py-8">
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
              value="checkins" 
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-white/70"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Check-ins
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
              value="programs" 
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-white/70"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Programs
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-white/70"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Coaching Management Section */}
          <TabsContent value="coaching">
            <CoachingManagementSection 
              coachingLoading={coachingLoading}
              onRefresh={handleRefreshCoaching}
            />
          </TabsContent>

          {/* Check-ins Section */}
          <TabsContent value="checkins">
            <CheckInsSection 
              checkIns={checkIns}
              checkInsLoading={checkInsLoading}
              onRefresh={handleRefreshCheckIns}
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

          {/* Programs Section */}
          <TabsContent value="programs">
            <ProgramsSection
              programs={programs}
              programsLoading={programsLoading}
              onAddProgram={handleAddProgram}
              onUpdateProgram={handleUpdateProgram}
              onDeleteProgram={handleDeleteProgram}
            />
          </TabsContent>

          {/* Analytics Section */}
          <TabsContent value="analytics">
            <Card className="bg-white/5 border-orange-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-orange-400" />
                  Analytics Dashboard
                </CardTitle>
                <CardDescription className="text-white/70">
                  Business insights and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-16">
                  <BarChart3 className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Analytics Coming Soon</h3>
                  <p className="text-white/70">
                    Advanced analytics and reporting features will be available here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

