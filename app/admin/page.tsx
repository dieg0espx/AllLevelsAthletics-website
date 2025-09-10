"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  Package,
  Truck,
  CheckCircle,
  Clock,
  Search,
  Edit,
  Save,
  X,
  Users,
  DollarSign,
  Calendar,
  MapPin,
  UserCheck,
  BookOpen,
  BarChart3,
  Mail,
  Phone,
  Star,
  Shield,
  Lock
} from "lucide-react"

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
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
}

interface Client {
  id: string
  userId: string
  email: string
  fullName: string
  phone?: string
  role: string
  totalOrders: number
  totalSpent: number
  lastOrderDate?: string
  products: Array<{
    name: string
    quantity: number
    price: number
    orderDate: string
  }>
  oneOnOneSessions: number
  programs: Array<{
    name: string
    status: string
    startDate: string
  }>
}

interface OneOnOneSession {
  id: string
  clientId: string
  clientName: string
  clientEmail: string
  sessionDate: string
  duration: number
  status: 'scheduled' | 'completed' | 'cancelled'
  notes?: string
  price: number
}

interface Program {
  id: string
  name: string
  description: string
  price: number
  duration: number
  enrolledClients: number
  status: 'active' | 'inactive'
  startDate: string
  endDate?: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const { user, userRole, loading } = useAuth()
  const [activeTab, setActiveTab] = useState("clients")
  
  // Orders state
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [editingOrder, setEditingOrder] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    status: '',
    trackingNumber: '',
    estimatedDelivery: '',
    actualDelivery: '',
    shippingMethod: '',
    carrier: '',
    comment: ''
  })

  // Clients state
  const [clients, setClients] = useState<Client[]>([])
  const [clientsLoading, setClientsLoading] = useState(false)
  const [clientSearchTerm, setClientSearchTerm] = useState("")
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  // One-on-one sessions state
  const [sessions, setSessions] = useState<OneOnOneSession[]>([])
  const [sessionsLoading, setSessionsLoading] = useState(false)

  // Programs state
  const [programs, setPrograms] = useState<Program[]>([])
  const [programsLoading, setProgramsLoading] = useState(false)

  // Authorization check
  useEffect(() => {
    if (!loading) {
      if (!user) {
        // User is not logged in, redirect to home page
        router.push('/')
        return
      }
      if (userRole !== 'admin') {
        // User is logged in but not an admin, redirect to home page
        router.push('/')
        return
      }
    }
  }, [user, userRole, loading, router])

  useEffect(() => {
    fetchAllOrders()
    fetchClients() // Load clients data since it's the default tab
  }, [])

  const fetchAllOrders = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      } else {
        console.error('Failed to fetch orders')
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchClients = async () => {
    try {
      setClientsLoading(true)
      const response = await fetch('/api/admin/clients')
      if (response.ok) {
        const data = await response.json()
        setClients(data.clients || [])
      } else {
        console.error('Failed to fetch clients')
      }
    } catch (error) {
      console.error('Error fetching clients:', error)
    } finally {
      setClientsLoading(false)
    }
  }

  const fetchSessions = async () => {
    try {
      setSessionsLoading(true)
      const response = await fetch('/api/admin/sessions')
      if (response.ok) {
        const data = await response.json()
        setSessions(data.sessions || [])
      } else {
        console.error('Failed to fetch sessions')
      }
    } catch (error) {
      console.error('Error fetching sessions:', error)
    } finally {
      setSessionsLoading(false)
    }
  }

  const fetchPrograms = async () => {
    try {
      setProgramsLoading(true)
      const response = await fetch('/api/admin/programs')
      if (response.ok) {
        const data = await response.json()
        setPrograms(data.programs || [])
      } else {
        console.error('Failed to fetch programs')
      }
    } catch (error) {
      console.error('Error fetching programs:', error)
    } finally {
      setProgramsLoading(false)
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    
    // Fetch data when switching tabs
    switch (value) {
      case 'clients':
        if (clients.length === 0) fetchClients()
        break
      case 'sessions':
        if (sessions.length === 0) fetchSessions()
        break
      case 'programs':
        if (programs.length === 0) fetchPrograms()
        break
    }
  }

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order.id)
    setEditForm({
      status: order.status,
      trackingNumber: order.trackingNumber === 'N/A' ? '' : order.trackingNumber,
      estimatedDelivery: order.estimatedDelivery === 'TBD' ? '' : order.estimatedDelivery,
      actualDelivery: order.actualDelivery || '',
      shippingMethod: order.shippingMethod || '',
      carrier: order.carrier || '',
      comment: order.comment || ''
    })
  }

  const handleSaveOrder = async (orderId: string) => {
    try {
      const response = await fetch('/api/update-order-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          ...editForm
        })
      })

      if (response.ok) {
        const data = await response.json()
        // Update the order in the local state
        setOrders(orders.map(order => 
          order.id === orderId ? data.order : order
        ))
        setEditingOrder(null)
        setEditForm({ status: '', trackingNumber: '', estimatedDelivery: '', actualDelivery: '' })
      } else {
        console.error('Failed to update order')
      }
    } catch (error) {
      console.error('Error updating order:', error)
    }
  }

  const handleCancelEdit = () => {
    setEditingOrder(null)
    setEditForm({ 
      status: '', 
      trackingNumber: '', 
      estimatedDelivery: '', 
      actualDelivery: '',
      shippingMethod: '',
      carrier: '',
      comment: ''
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "shipped":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "processing":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-4 h-4" />
      case "shipped":
        return <Truck className="w-4 h-4" />
      case "processing":
        return <Clock className="w-4 h-4" />
      case "cancelled":
        return <X className="w-4 h-4" />
      default:
        return <Package className="w-4 h-4" />
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: orders.length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    totalRevenue: orders.reduce((sum, o) => sum + o.price, 0)
  }

  // Show loading while checking authentication
  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-white">Loading Admin Dashboard...</h1>
        </div>
      </div>
    )
  }

  // Show unauthorized access screen if user is not admin
  if (!user || userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-12 h-12 text-red-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-white/70 text-lg mb-8">
            You don't have permission to access the admin dashboard. Only administrators can view this page.
          </p>
          <div className="space-y-4">
            <Button
              onClick={() => router.push('/')}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg font-semibold"
            >
              Return to Home
            </Button>
            {!user && (
              <Button
                onClick={() => router.push('/auth')}
                variant="outline"
                className="w-full border-orange-500/30 text-orange-400 hover:bg-orange-500/10 py-3 text-lg"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black/95 backdrop-blur-md border-b border-orange-500/30 sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-orange-400">Admin Dashboard</h1>
              <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                {activeTab === 'clients' && 'Client Overview'}
                {activeTab === 'orders' && 'Order Management'}
                {activeTab === 'sessions' && 'One-on-One Sessions'}
                {activeTab === 'programs' && 'Programs Management'}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/')}
                className="text-white/90 hover:text-orange-400 hover:bg-white/10"
              >
                Back to Site
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-8 sm:px-12 lg:px-16 xl:px-20 py-12">
        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white/5 border-orange-500/30 mb-8">
            <TabsTrigger 
              value="clients" 
              className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 text-white/70 hover:text-orange-400"
            >
              <Users className="w-4 h-4 mr-2" />
              Clients
            </TabsTrigger>
            <TabsTrigger 
              value="orders" 
              className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 text-white/70 hover:text-orange-400"
            >
              <Package className="w-4 h-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger 
              value="sessions" 
              className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 text-white/70 hover:text-orange-400"
            >
              <UserCheck className="w-4 h-4 mr-2" />
              One-on-One
            </TabsTrigger>
            <TabsTrigger 
              value="programs" 
              className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 text-white/70 hover:text-orange-400"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Programs
            </TabsTrigger>
            <TabsTrigger 
              value="subscriptions" 
              className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 text-white/70 hover:text-orange-400"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Subscriptions
            </TabsTrigger>
          </TabsList>

          {/* Clients Tab */}
          <TabsContent value="clients" className="space-y-8">
            {clientsLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h2 className="text-xl font-bold text-white">Loading Clients...</h2>
              </div>
            ) : (
              <>
                {/* Client Search */}
                <div className="mb-8">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                    <Input
                      placeholder="Search clients..."
                      value={clientSearchTerm}
                      onChange={(e) => setClientSearchTerm(e.target.value)}
                      className="pl-10 bg-white/5 border-orange-500/30 text-white placeholder:text-white/50"
                    />
                  </div>
                </div>

                {/* Clients Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {clients
                    .filter(client => 
                      client.fullName.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
                      client.email.toLowerCase().includes(clientSearchTerm.toLowerCase())
                    )
                    .map((client) => (
                    <Card key={client.id} className="bg-gradient-to-br from-white/5 to-white/10 border-orange-500/30 shadow-xl hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 cursor-pointer" onClick={() => setSelectedClient(client)}>
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                              <Users className="w-6 h-6 text-orange-400" />
                            </div>
                            <div>
                              <CardTitle className="text-white text-lg">{client.fullName}</CardTitle>
                              <CardDescription className="text-white/70">{client.email}</CardDescription>
                            </div>
                          </div>
                          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                            {client.role}
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white/5 rounded-lg p-3">
                            <div className="text-2xl font-bold text-orange-400">{client.totalOrders}</div>
                            <div className="text-white/70 text-sm">Orders</div>
                          </div>
                          <div className="bg-white/5 rounded-lg p-3">
                            <div className="text-2xl font-bold text-orange-400">${client.totalSpent}</div>
                            <div className="text-white/70 text-sm">Total Spent</div>
                          </div>
                        </div>

                        {client.products.length > 0 && (
                          <div>
                            <h4 className="text-white font-semibold mb-2">Recent Products:</h4>
                            <div className="space-y-2">
                              {client.products.slice(0, 2).map((product, index) => (
                                <div key={index} className="flex justify-between items-center bg-white/5 rounded-lg p-2">
                                  <span className="text-white/80 text-sm">{product.name}</span>
                                  <span className="text-orange-400 text-sm font-semibold">${product.price}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Plan Status Indicator */}
                        <div className="mt-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${client.products.length > 0 ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                            <span className="text-white/70 text-sm">
                              {client.products.length > 0 ? 'Active Plan' : 'No Plan'}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            Email
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            Call
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {clients.length === 0 && (
                  <Card className="bg-gradient-to-br from-white/5 to-white/10 border-orange-500/30 shadow-xl">
                    <CardContent className="text-center py-16">
                      <div className="w-24 h-24 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <Users className="w-12 h-12 text-orange-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">No Clients Found</h3>
                      <p className="text-white/70 mb-8 text-lg">
                        {clientSearchTerm ? "No clients match your search criteria" : "No clients have registered yet"}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          <Card className="bg-gradient-to-br from-white/5 to-white/10 border-orange-500/30 text-center shadow-xl hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300">
            <CardContent className="pt-6 pb-6">
              <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Package className="w-6 h-6 text-orange-400" />
              </div>
              <div className="text-3xl font-bold text-orange-400 mb-1">{stats.total}</div>
              <p className="text-white/70 text-sm font-medium">Total Orders</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-white/5 to-white/10 border-orange-500/30 text-center shadow-xl hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300">
            <CardContent className="pt-6 pb-6">
              <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-orange-400" />
              </div>
              <div className="text-3xl font-bold text-orange-400 mb-1">{stats.processing}</div>
              <p className="text-white/70 text-sm font-medium">Processing</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-white/5 to-white/10 border-orange-500/30 text-center shadow-xl hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300">
            <CardContent className="pt-6 pb-6">
              <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Truck className="w-6 h-6 text-orange-400" />
              </div>
              <div className="text-3xl font-bold text-orange-400 mb-1">{stats.shipped}</div>
              <p className="text-white/70 text-sm font-medium">Shipped</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-white/5 to-white/10 border-orange-500/30 text-center shadow-xl hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300">
            <CardContent className="pt-6 pb-6">
              <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-orange-400" />
              </div>
              <div className="text-3xl font-bold text-orange-400 mb-1">{stats.delivered}</div>
              <p className="text-white/70 text-sm font-medium">Delivered</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-white/5 to-white/10 border-orange-500/30 text-center shadow-xl hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300">
            <CardContent className="pt-6 pb-6">
              <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-orange-400" />
              </div>
              <div className="text-3xl font-bold text-orange-400 mb-1">${stats.totalRevenue.toFixed(2)}</div>
              <p className="text-white/70 text-sm font-medium">Total Revenue</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-10 flex flex-col sm:flex-row gap-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-orange-500/30 text-white placeholder:text-white/50"
              />
            </div>
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-white/5 border-orange-500/30 text-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders Table */}
        <div className="space-y-8">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="bg-gradient-to-br from-white/5 to-white/10 border-orange-500/30 shadow-xl hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    {/* Product Images - Show all products in order */}
                    <div className="flex gap-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-orange-500/30 shadow-lg">
                          <img
                            src={
                              item.name.includes("All Levels Knot Roller") 
                                ? "/roller/roller7.jpg"
                                : item.name.includes("Body Tension Reset Course")
                                ? "/gymTools.jpg"
                                : item.name.includes("Complete Bundle")
                                ? "/roller/roller12.jpg"
                                : item.name.includes("MF Roller")
                                ? "/roller2.png"
                                : item.name.includes("Tension Reset")
                                ? "/tension-reset-coaching.png"
                                : item.name.includes("Body Tension Reset")
                                ? "/body-tension-reset-course.png"
                                : item.name.includes("MF Roller Course")
                                ? "/mfroller-course-bundle.png"
                                : "/placeholder.jpg"
                            }
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                          {item.quantity > 1 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">{item.quantity}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex-1">
                      <CardTitle className="text-white text-xl mb-1">
                        {order.items.length === 1 
                          ? order.items[0].name 
                          : `${order.items.length} Products`
                        }
                      </CardTitle>
                      <CardDescription className="text-white/70 text-base">
                        {order.orderNumber} • {new Date(order.purchaseDate).toLocaleDateString()}
                      </CardDescription>
                      <div className="mt-2 text-2xl font-bold text-orange-400">
                        ${order.price}
                      </div>
                      {order.items.length > 1 && (
                        <div className="mt-1 text-sm text-white/60">
                          {order.items.map((item, index) => (
                            <span key={index}>
                              {item.name} {item.quantity > 1 && `(x${item.quantity})`}
                              {index < order.items.length - 1 && ', '}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge className={`${getStatusColor(order.status)} px-4 py-2 text-sm font-semibold`}>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </div>
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditOrder(order)}
                      className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:border-orange-500/50 transition-all duration-300"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              {editingOrder === order.id ? (
                <CardContent className="pt-0">
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                      <Edit className="w-5 h-5 text-orange-400" />
                      Edit Order Status
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <Label htmlFor="status" className="text-white font-medium">Order Status</Label>
                          <Select value={editForm.status} onValueChange={(value) => setEditForm({...editForm, status: value})}>
                            <SelectTrigger className="bg-white/5 border-orange-500/30 text-white mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="trackingNumber" className="text-white font-medium">Tracking Number</Label>
                          <Input
                            id="trackingNumber"
                            value={editForm.trackingNumber}
                            onChange={(e) => setEditForm({...editForm, trackingNumber: e.target.value})}
                            className="bg-white/5 border-orange-500/30 text-white mt-2"
                            placeholder="Enter tracking number"
                          />
                        </div>

                        <div>
                          <Label htmlFor="carrier" className="text-white font-medium">Shipping Carrier</Label>
                          <Input
                            id="carrier"
                            value={editForm.carrier}
                            onChange={(e) => setEditForm({...editForm, carrier: e.target.value})}
                            className="bg-white/5 border-orange-500/30 text-white mt-2"
                            placeholder="e.g., UPS, FedEx, USPS"
                          />
                        </div>

                        <div>
                          <Label htmlFor="shippingMethod" className="text-white font-medium">Shipping Method</Label>
                          <Input
                            id="shippingMethod"
                            value={editForm.shippingMethod}
                            onChange={(e) => setEditForm({...editForm, shippingMethod: e.target.value})}
                            className="bg-white/5 border-orange-500/30 text-white mt-2"
                            placeholder="e.g., Standard, Express, Overnight"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        <div>
                          <Label htmlFor="estimatedDelivery" className="text-white font-medium">Estimated Delivery</Label>
                          <Input
                            id="estimatedDelivery"
                            type="date"
                            value={editForm.estimatedDelivery}
                            onChange={(e) => setEditForm({...editForm, estimatedDelivery: e.target.value})}
                            className="bg-white/5 border-orange-500/30 text-white mt-2"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="actualDelivery" className="text-white font-medium">Actual Delivery</Label>
                          <Input
                            id="actualDelivery"
                            type="date"
                            value={editForm.actualDelivery}
                            onChange={(e) => setEditForm({...editForm, actualDelivery: e.target.value})}
                            className="bg-white/5 border-orange-500/30 text-white mt-2"
                          />
                        </div>


                        <div>
                          <Label htmlFor="comment" className="text-white font-medium">Order Comments</Label>
                          <textarea
                            id="comment"
                            value={editForm.comment}
                            onChange={(e) => setEditForm({...editForm, comment: e.target.value})}
                            className="w-full bg-white/5 border border-orange-500/30 text-white mt-2 rounded-md px-3 py-2 min-h-[100px] resize-none"
                            placeholder="Add any notes or comments about this order..."
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 mt-6">
                      <Button
                        onClick={() => handleSaveOrder(order.id)}
                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2 font-semibold shadow-xl hover:shadow-orange-500/25 transition-all duration-300"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCancelEdit}
                        className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:border-orange-500/50 px-6 py-2 transition-all duration-300"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              ) : (
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Order Details */}
                    <div className="space-y-6">
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <Package className="w-5 h-5 text-orange-400" />
                          Order Details
                        </h4>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-white/70">Total Amount:</span>
                            <span className="text-orange-400 font-semibold text-lg">${order.price}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-white/70">Items:</span>
                            <span className="text-white font-medium">{order.items.length}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-white/70">Tracking:</span>
                            <span className="text-white font-mono text-sm bg-white/10 px-2 py-1 rounded">{order.trackingNumber}</span>
                          </div>

                          {order.carrier && (
                            <div className="flex items-center justify-between">
                              <span className="text-white/70">Carrier:</span>
                              <span className="text-white font-medium">{order.carrier}</span>
                            </div>
                          )}

                          {order.shippingMethod && (
                            <div className="flex items-center justify-between">
                              <span className="text-white/70">Method:</span>
                              <span className="text-white font-medium">{order.shippingMethod}</span>
                            </div>
                          )}

                        </div>
                      </div>
                    </div>

                    {/* Delivery Information */}
                    <div className="space-y-6">
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-orange-400" />
                          Delivery Info
                        </h4>
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                              <Calendar className="w-4 h-4 text-orange-400" />
                            </div>
                            <div>
                              <div className="text-white/70 text-sm">Estimated Delivery</div>
                              <div className="text-white font-medium">{order.estimatedDelivery}</div>
                            </div>
                          </div>
                          
                          {order.actualDelivery && (
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-orange-400" />
                              </div>
                              <div>
                                <div className="text-white/70 text-sm">Delivered</div>
                                <div className="text-orange-400 font-medium">{order.actualDelivery}</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Shipping Address & Comments */}
                    <div className="space-y-6">
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-orange-400" />
                          Shipping Address
                        </h4>
                        
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <MapPin className="w-4 h-4 text-orange-400" />
                            </div>
                            <div className="text-white/80 space-y-1">
                              <div className="font-medium text-white text-lg">
                                {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                              </div>
                              {order.shippingAddress?.address && (
                                <div className="text-white/70">
                                  {order.shippingAddress.address}
                                </div>
                              )}
                              <div className="text-white/70">
                                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
                              </div>
                              {order.shippingAddress?.country && (
                                <div className="text-white/70">
                                  {order.shippingAddress.country}
                                </div>
                              )}
                              <div className="text-orange-400 mt-2 font-medium">
                                {order.shippingAddress?.email}
                              </div>
                              {order.shippingAddress?.phone && (
                                <div className="text-white/70">
                                  {order.shippingAddress.phone}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order Comments */}
                      {order.comment && (
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Edit className="w-5 h-5 text-orange-400" />
                            Order Comments
                          </h4>
                          <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                            <p className="text-white/80 leading-relaxed whitespace-pre-wrap">
                              {order.comment}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <Card className="bg-gradient-to-br from-white/5 to-white/10 border-orange-500/30 shadow-xl">
            <CardContent className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Package className="w-12 h-12 text-orange-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">No Orders Found</h3>
              <p className="text-white/70 mb-8 text-lg">
                {searchTerm || statusFilter !== "all" 
                  ? "No orders match your current filters" 
                  : "No orders have been placed yet"
                }
              </p>
            </CardContent>
          </Card>
            )}
          </TabsContent>


          {/* One-on-One Sessions Tab */}
          <TabsContent value="sessions" className="space-y-8">
            {sessionsLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h2 className="text-xl font-bold text-white">Loading Sessions...</h2>
              </div>
            ) : (
              <div className="space-y-6">
                {sessions.map((session) => (
                  <Card key={session.id} className="bg-gradient-to-br from-white/5 to-white/10 border-orange-500/30 shadow-xl hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-white">{session.clientName}</CardTitle>
                          <CardDescription className="text-white/70">{session.clientEmail}</CardDescription>
                        </div>
                        <Badge className={`${
                          session.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                          session.status === 'scheduled' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                          'bg-red-500/20 text-red-400 border-red-500/30'
                        }`}>
                          {session.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <div className="text-white/70 text-sm">Session Date</div>
                          <div className="text-white font-semibold">{new Date(session.sessionDate).toLocaleDateString()}</div>
                        </div>
                        <div>
                          <div className="text-white/70 text-sm">Duration</div>
                          <div className="text-white font-semibold">{session.duration} minutes</div>
                        </div>
                        <div>
                          <div className="text-white/70 text-sm">Price</div>
                          <div className="text-orange-400 font-semibold">${session.price}</div>
                        </div>
                      </div>
                      {session.notes && (
                        <div className="mt-4">
                          <div className="text-white/70 text-sm mb-2">Notes</div>
                          <div className="bg-white/5 rounded-lg p-3 text-white/80">{session.notes}</div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Programs Tab */}
          <TabsContent value="programs" className="space-y-8">
            {programsLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h2 className="text-xl font-bold text-white">Loading Programs...</h2>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {programs.map((program) => (
                  <Card key={program.id} className="bg-gradient-to-br from-white/5 to-white/10 border-orange-500/30 shadow-xl hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-white text-xl">{program.name}</CardTitle>
                          <CardDescription className="text-white/70 mt-2">{program.description}</CardDescription>
                        </div>
                        <Badge className={`${
                          program.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                          'bg-gray-500/20 text-gray-400 border-gray-500/30'
                        }`}>
                          {program.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-lg p-3">
                          <div className="text-2xl font-bold text-orange-400">${program.price}</div>
                          <div className="text-white/70 text-sm">Price</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                          <div className="text-2xl font-bold text-orange-400">{program.enrolledClients}</div>
                          <div className="text-white/70 text-sm">Enrolled</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-white/70 text-sm">Duration</div>
                          <div className="text-white font-semibold">{program.duration} weeks</div>
                        </div>
                        <div>
                          <div className="text-white/70 text-sm">Start Date</div>
                          <div className="text-white font-semibold">{new Date(program.startDate).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions" className="space-y-8">
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <DollarSign className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Subscription Management</h2>
                <p className="text-white/70">
                  View and manage user subscriptions. This feature will be implemented in the next update.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Client Details Modal */}
      <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
        <DialogContent className="w-[70vw] max-w-none bg-black border-orange-500/30 text-white max-h-[90vh] overflow-y-auto" style={{ width: '70vw', maxWidth: 'none' }}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-orange-400 flex items-center gap-3">
              <Users className="w-6 h-6" />
              {selectedClient?.fullName}
            </DialogTitle>
          </DialogHeader>
          
          {selectedClient && (
            <div className="space-y-8">
              {/* Client Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white/5 border-orange-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-orange-400" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-white/70 text-sm">Full Name</Label>
                      <div className="text-white font-semibold">{selectedClient.fullName}</div>
                    </div>
                    <div>
                      <Label className="text-white/70 text-sm">Email</Label>
                      <div className="text-white font-semibold">{selectedClient.email}</div>
                    </div>
                    {selectedClient.phone && (
                      <div>
                        <Label className="text-white/70 text-sm">Phone</Label>
                        <div className="text-white font-semibold">{selectedClient.phone}</div>
                      </div>
                    )}
                    <div>
                      <Label className="text-white/70 text-sm">Role</Label>
                      <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                        {selectedClient.role}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-orange-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-orange-400" />
                      Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-orange-400">{selectedClient.totalOrders}</div>
                        <div className="text-white/70 text-sm">Total Orders</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-orange-400">${selectedClient.totalSpent}</div>
                        <div className="text-white/70 text-sm">Total Spent</div>
                      </div>
                    </div>
                    {selectedClient.lastOrderDate && (
                      <div>
                        <Label className="text-white/70 text-sm">Last Order</Label>
                        <div className="text-white font-semibold">
                          {new Date(selectedClient.lastOrderDate).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Purchase History - Compact */}
              <Card className="bg-white/5 border-orange-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Package className="w-5 h-5 text-orange-400" />
                    Purchase History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedClient.products.length > 0 ? (
                    <div className="space-y-2">
                      {selectedClient.products.slice(0, 3).map((product, index) => (
                        <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                              <Package className="w-4 h-4 text-orange-400" />
                            </div>
                            <div>
                              <div className="text-white font-medium text-sm">{product.name}</div>
                              <div className="text-white/60 text-xs">
                                {new Date(product.orderDate).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="text-orange-400 font-semibold">${product.price}</div>
                        </div>
                      ))}
                      {selectedClient.products.length > 3 && (
                        <div className="text-center text-white/60 text-sm py-2">
                          +{selectedClient.products.length - 3} more purchases
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Package className="w-12 h-12 text-white/30 mx-auto mb-3" />
                      <div className="text-white/70 text-sm">No purchases yet</div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* One-on-One Sessions - Enhanced */}
              <Card className="bg-white/5 border-orange-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-orange-400" />
                    One-on-One Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Session Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/5 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-orange-400">0</div>
                      <div className="text-white/70 text-sm">Completed</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-400">0</div>
                      <div className="text-white/70 text-sm">Scheduled</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-orange-400">$0</div>
                      <div className="text-white/70 text-sm">Total Revenue</div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-4">
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white h-12">
                      <UserCheck className="w-4 h-4 mr-2" />
                      Schedule New Session
                    </Button>
                    <Button variant="outline" className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10 h-12">
                      <Calendar className="w-4 h-4 mr-2" />
                      View Calendar
                    </Button>
                  </div>

                  {/* Recent Sessions */}
                  <div>
                    <h4 className="text-white font-semibold mb-3">Recent Sessions</h4>
                    <div className="text-center py-6 bg-white/5 rounded-lg">
                      <UserCheck className="w-12 h-12 text-white/30 mx-auto mb-3" />
                      <div className="text-white/70 text-sm">No sessions yet</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Programs - Enhanced */}
              <Card className="bg-white/5 border-orange-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-orange-400" />
                    Programs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Program Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-orange-400">0</div>
                      <div className="text-white/70 text-sm">Active Programs</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-400">0</div>
                      <div className="text-white/70 text-sm">Completed</div>
                    </div>
                  </div>

                  {/* Available Programs */}
                  <div>
                    <h4 className="text-white font-semibold mb-3">Available Programs</h4>
                    <div className="space-y-3">
                      <div className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">Beginner Fitness Program</div>
                          <div className="text-white/60 text-sm">8 weeks • $299</div>
                        </div>
                        <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                          Enroll
                        </Button>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">Weight Loss Transformation</div>
                          <div className="text-white/60 text-sm">16 weeks • $399</div>
                        </div>
                        <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                          Enroll
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Current Enrollments */}
                  <div>
                    <h4 className="text-white font-semibold mb-3">Current Enrollments</h4>
                    <div className="text-center py-6 bg-white/5 rounded-lg">
                      <BookOpen className="w-12 h-12 text-white/30 mx-auto mb-3" />
                      <div className="text-white/70 text-sm">No active enrollments</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-end">
                <Button
                  variant="outline"
                  className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
                <Button
                  variant="outline"
                  className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Client
                </Button>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
