"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Package,
  Truck,
  CheckCircle,
  Clock,
  Search,
  Edit,
  Save,
  X,
  DollarSign,
  MapPin
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
}

interface OrdersSectionProps {
  orders: Order[]
  ordersLoading: boolean
  onUpdateOrder: (orderId: string, updates: Partial<Order>) => void
}

export function OrdersSection({ orders, ordersLoading, onUpdateOrder }: OrdersSectionProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [editingOrder, setEditingOrder] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    status: '',
    trackingNumber: '',
    carrier: '',
    comment: ''
  })

  const handleEditClick = (order: Order) => {
    setEditForm({
      status: order.status,
      trackingNumber: order.trackingNumber,
      carrier: order.carrier || '',
      comment: order.comment || ''
    })
    setEditingOrder(order.id)
  }

  const handleSave = async (orderId: string) => {
    try {
      await onUpdateOrder(orderId, editForm)
      setEditingOrder(null)
    } catch (error) {
      console.error('Error updating order:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'shipped':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'processing':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />
      case 'shipped':
        return <Truck className="w-4 h-4" />
      case 'processing':
        return <Clock className="w-4 h-4" />
      case 'cancelled':
        return <X className="w-4 h-4" />
      default:
        return <Package className="w-4 h-4" />
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = (order.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (order.orderNumber?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: orders.length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    totalRevenue: orders.reduce((sum, o) => sum + o.price, 0)
  }

  if (ordersLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Orders Management</h2>
        <div className="text-sm text-white/70">
          {orders.length} total orders
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/5 border-orange-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-orange-400">{stats.total}</p>
              </div>
              <Package className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 border-orange-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Processing</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.processing}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 border-orange-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Shipped</p>
                <p className="text-2xl font-bold text-blue-400">{stats.shipped}</p>
              </div>
              <Truck className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 border-orange-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-green-400">${stats.totalRevenue}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search orders by name or order number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/5 border-orange-500/30 text-white placeholder-white/50 focus:ring-orange-500/50"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-48 bg-white/5 border-orange-500/30 text-white">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-orange-500/30">
            <SelectItem value="all" className="text-white">All Status</SelectItem>
            <SelectItem value="processing" className="text-white">Processing</SelectItem>
            <SelectItem value="shipped" className="text-white">Shipped</SelectItem>
            <SelectItem value="delivered" className="text-white">Delivered</SelectItem>
            <SelectItem value="cancelled" className="text-white">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="bg-white/5 border-orange-500/20">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                      {getStatusIcon(order.status)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{order.name}</h3>
                      <p className="text-white/70 text-sm">Order #{order.orderNumber}</p>
                      <p className="text-white/70 text-sm">
                        {new Date(order.purchaseDate).toLocaleDateString()} • ${order.price}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label className="text-white/70 text-sm">Status</Label>
                      <div className="mt-1">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    
                    {order.trackingNumber && (
                      <div>
                        <Label className="text-white/70 text-sm">Tracking Number</Label>
                        <div className="text-white font-medium">{order.trackingNumber}</div>
                      </div>
                    )}
                    
                    {order.shippingMethod && (
                      <div>
                        <Label className="text-white/70 text-sm">Shipping Method</Label>
                        <div className="text-white font-medium">{order.shippingMethod}</div>
                      </div>
                    )}
                    
                    {order.carrier && (
                      <div>
                        <Label className="text-white/70 text-sm">Carrier</Label>
                        <div className="text-white font-medium">{order.carrier.toUpperCase()}</div>
                      </div>
                    )}
                  </div>

                  {order.shippingAddress && (
                    <div className="mb-4">
                      <Label className="text-white/70 text-sm">Shipping Address</Label>
                      <div className="text-white font-medium mt-1">
                        {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                      </div>
                    </div>
                  )}

                  {order.comment && (
                    <div className="mb-4">
                      <Label className="text-white/70 text-sm">Comments</Label>
                      <div className="text-white/80 bg-white/5 p-3 rounded-lg mt-1">
                        {order.comment}
                      </div>
                    </div>
                  )}

                  {editingOrder === order.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="status" className="text-white">Status</Label>
                          <Select
                            value={editForm.status}
                            onValueChange={(value) => setEditForm({...editForm, status: value})}
                          >
                            <SelectTrigger className="bg-white/5 border-orange-500/30 text-white">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 border-orange-500/30">
                              <SelectItem value="processing" className="text-white">Processing</SelectItem>
                              <SelectItem value="shipped" className="text-white">Shipped</SelectItem>
                              <SelectItem value="delivered" className="text-white">Delivered</SelectItem>
                              <SelectItem value="cancelled" className="text-white">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="carrier" className="text-white">Carrier</Label>
                          <Select
                            value={editForm.carrier}
                            onValueChange={(value) => setEditForm({...editForm, carrier: value})}
                          >
                            <SelectTrigger className="bg-white/5 border-orange-500/30 text-white">
                              <SelectValue placeholder="Select carrier" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 border-orange-500/30">
                              <SelectItem value="ups" className="text-white">UPS</SelectItem>
                              <SelectItem value="fedex" className="text-white">FedEx</SelectItem>
                              <SelectItem value="usps" className="text-white">USPS</SelectItem>
                              <SelectItem value="dhl" className="text-white">DHL</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="tracking" className="text-white">Tracking Number</Label>
                        <Input
                          id="tracking"
                          value={editForm.trackingNumber}
                          onChange={(e) => setEditForm({...editForm, trackingNumber: e.target.value})}
                          className="bg-white/5 border-orange-500/30 text-white"
                          placeholder="Enter tracking number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="comment" className="text-white">Comments</Label>
                        <textarea
                          id="comment"
                          value={editForm.comment}
                          onChange={(e) => setEditForm({...editForm, comment: e.target.value})}
                          className="w-full p-3 bg-white/5 border border-orange-500/30 rounded-lg text-white placeholder-white/50 resize-none"
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleSave(order.id)}
                          className="bg-orange-500 hover:bg-orange-600 text-white"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button
                          onClick={() => setEditingOrder(null)}
                          variant="outline"
                          className="border-gray-500/30 text-gray-400 hover:bg-gray-500/10"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleEditClick(order)}
                      variant="outline"
                      className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Order
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-16">
          <Package className="w-16 h-16 text-orange-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Orders Found</h3>
          <p className="text-white/70">
            {searchTerm || statusFilter !== 'all' 
              ? 'No orders match your search criteria.' 
              : 'No orders have been placed yet.'}
          </p>
        </div>
      )}
    </div>
  )
}

