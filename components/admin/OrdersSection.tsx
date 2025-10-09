"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  DollarSign,
  MapPin,
  User
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
  email?: string
  phone?: string
  customerName?: string
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
                         (order.orderNumber?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (order.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (order.phone?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (order.customerName?.toLowerCase() || '').includes(searchTerm.toLowerCase())
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
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <h2 className="text-xl md:text-2xl font-bold text-white">Orders Management</h2>
        <div className="text-xs md:text-sm text-white/70">
          {orders.length} total orders
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className="bg-white/5 border-orange-500/30">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 md:w-10 md:h-10 text-orange-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-white/70 text-xs md:text-sm">Total Orders</p>
                <p className="text-xl md:text-2xl font-bold text-orange-400">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 border-orange-500/30">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 md:w-10 md:h-10 text-yellow-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-white/70 text-xs md:text-sm">Processing</p>
                <p className="text-xl md:text-2xl font-bold text-yellow-400">{stats.processing}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 border-orange-500/30">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-3">
              <Truck className="w-8 h-8 md:w-10 md:h-10 text-blue-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-white/70 text-xs md:text-sm">Shipped</p>
                <p className="text-xl md:text-2xl font-bold text-blue-400">{stats.shipped}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 border-orange-500/30">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 md:w-10 md:h-10 text-green-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-white/70 text-xs md:text-sm">Total Revenue</p>
                <p className="text-xl md:text-2xl font-bold text-green-400">${stats.totalRevenue}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/5 border-orange-500/30 text-white placeholder-white/50 focus:ring-orange-500/50 h-10 md:h-11 text-sm md:text-base"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40 md:w-48 bg-white/5 border-orange-500/30 text-white h-10 md:h-11 text-sm md:text-base">
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
      <div className="space-y-3 md:space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="bg-white/5 border-orange-500/20">
            <CardContent className="p-4 md:p-6">
              {/* Order Header */}
              <div className="flex items-start gap-3 mb-4 md:mb-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  {getStatusIcon(order.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base md:text-lg font-semibold text-white truncate">{order.name}</h3>
                  <p className="text-white/70 text-xs md:text-sm">Order #{order.orderNumber}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <p className="text-white/70 text-xs md:text-sm">
                      {new Date(order.purchaseDate).toLocaleDateString()}
                    </p>
                    <span className="text-white/50">•</span>
                    <p className="text-orange-400 font-semibold text-sm md:text-base">
                      ${order.price}
                    </p>
                  </div>
                </div>
              </div>
                  
              {/* Customer Contact Information */}
              <div className="bg-white/5 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
                <h4 className="text-sm md:text-base text-white font-semibold mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 md:w-5 md:h-5 text-orange-400" />
                  Customer Information
                </h4>
                <div className="grid grid-cols-1 gap-3 md:gap-4">
                  {(order.customerName || order.shippingAddress?.firstName || order.shippingAddress?.lastName) && (
                    <div className="pb-3 border-b border-white/10 last:border-b-0 last:pb-0">
                      <Label className="text-white/70 text-xs md:text-sm mb-1.5 block">Name</Label>
                      <div className="text-white font-medium text-sm md:text-base break-words">
                        {order.customerName || `${order.shippingAddress?.firstName || ''} ${order.shippingAddress?.lastName || ''}`.trim()}
                      </div>
                    </div>
                  )}
                  {(order.email || order.shippingAddress?.email) && (
                    <div className="pb-3 border-b border-white/10 last:border-b-0 last:pb-0">
                      <Label className="text-white/70 text-xs md:text-sm mb-1.5 block">Email</Label>
                      <div className="text-white font-medium text-sm md:text-base break-all">
                        <a href={`mailto:${order.email || order.shippingAddress?.email}`} className="text-blue-400 hover:text-blue-300">
                          {order.email || order.shippingAddress?.email}
                        </a>
                      </div>
                    </div>
                  )}
                  {(order.phone || order.shippingAddress?.phone) && (
                    <div className="pb-3 border-b border-white/10 last:border-b-0 last:pb-0">
                      <Label className="text-white/70 text-xs md:text-sm mb-1.5 block">Phone</Label>
                      <div className="text-white font-medium text-sm md:text-base">
                        <a href={`tel:${order.phone || order.shippingAddress?.phone}`} className="text-blue-400 hover:text-blue-300">
                          {order.phone || order.shippingAddress?.phone}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
                  
              {/* Order Details Grid */}
              <div className="bg-white/5 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
                <h4 className="text-sm md:text-base text-white font-semibold mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4 md:w-5 md:h-5 text-orange-400" />
                  Order Details
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="pb-3 border-b border-white/10">
                    <Label className="text-white/70 text-xs md:text-sm mb-1.5 block">Status</Label>
                    <div>
                      <Badge className={`${getStatusColor(order.status)} text-xs md:text-sm py-1 px-2 md:px-3`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  
                  {order.trackingNumber && order.trackingNumber !== 'N/A' && (
                    <div className="pb-3 border-b border-white/10">
                      <Label className="text-white/70 text-xs md:text-sm mb-1.5 block">Tracking Number</Label>
                      <div className="text-white font-medium text-sm md:text-base break-all">
                        {order.trackingNumber}
                      </div>
                    </div>
                  )}
                  
                  {order.carrier && (
                    <div className="pb-3 border-b border-white/10">
                      <Label className="text-white/70 text-xs md:text-sm mb-1.5 block">Carrier</Label>
                      <div className="text-white font-medium text-sm md:text-base">
                        {order.carrier.toUpperCase()}
                      </div>
                    </div>
                  )}
                  
                  {order.shippingMethod && (
                    <div className="pb-3 border-b border-white/10 last:border-b-0 last:pb-0">
                      <Label className="text-white/70 text-xs md:text-sm mb-1.5 block">Shipping Method</Label>
                      <div className="text-white font-medium text-sm md:text-base">
                        {order.shippingMethod}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {order.shippingAddress && (order.shippingAddress.address || order.shippingAddress.city) && (
                <div className="bg-white/5 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
                  <h4 className="text-sm md:text-base text-white font-semibold mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 md:w-5 md:h-5 text-orange-400" />
                    Shipping Address
                  </h4>
                  <div className="text-white font-medium text-sm md:text-base space-y-1">
                    {order.shippingAddress.address && (
                      <div className="break-words">{order.shippingAddress.address}</div>
                    )}
                    {order.shippingAddress.city && order.shippingAddress.state && (
                      <div>
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode || ''}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {order.comment && (
                <div className="bg-white/5 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
                  <h4 className="text-sm md:text-base text-white font-semibold mb-3">Comments</h4>
                  <div className="text-white/80 text-sm md:text-base break-words">
                    {order.comment}
                  </div>
                </div>
              )}

              <div className="border-t border-white/10 pt-4 md:pt-6">
                <Button
                  onClick={() => handleEditClick(order)}
                  variant="outline"
                  className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10 w-full sm:w-auto h-11 md:h-12 text-sm md:text-base font-medium"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Order
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12 md:py-16 px-4">
          <Package className="w-12 h-12 md:w-16 md:h-16 text-orange-400 mx-auto mb-3 md:mb-4" />
          <h3 className="text-lg md:text-xl font-semibold text-white mb-2">No Orders Found</h3>
          <p className="text-sm md:text-base text-white/70 max-w-md mx-auto">
            {searchTerm || statusFilter !== 'all' 
              ? 'No orders match your search criteria. Try adjusting your filters.' 
              : 'No orders have been placed yet.'}
          </p>
        </div>
      )}

      {/* Edit Order Modal */}
      <Dialog open={!!editingOrder} onOpenChange={() => setEditingOrder(null)}>
        <DialogContent className="bg-gray-900 border-orange-500/30 text-white w-[96vw] sm:max-w-[600px] md:max-w-3xl max-h-[92vh] p-0">
          <div className="overflow-y-auto max-h-[92vh] p-4 sm:p-5 md:p-6">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-white flex items-center gap-2 text-base md:text-lg">
                <Edit className="w-4 h-4 md:w-5 md:h-5 text-orange-400" />
                Edit Order
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
            {/* Form Fields in Cards */}
            <Card className="bg-white/5 border-orange-500/30 overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm md:text-base flex items-center gap-2">
                  <Package className="w-4 h-4 text-orange-400" />
                  Order Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-status" className="text-white text-sm mb-2 block">Status</Label>
                    <Select
                      value={editForm.status}
                      onValueChange={(value) => setEditForm({...editForm, status: value})}
                    >
                      <SelectTrigger className="bg-white/5 border-orange-500/30 text-white h-11">
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
                    <Label htmlFor="edit-carrier" className="text-white text-sm mb-2 block">Carrier</Label>
                    <Select
                      value={editForm.carrier}
                      onValueChange={(value) => setEditForm({...editForm, carrier: value})}
                    >
                      <SelectTrigger className="bg-white/5 border-orange-500/30 text-white h-11">
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
                  <Label htmlFor="edit-tracking" className="text-white text-sm mb-2 block">Tracking Number</Label>
                  <Input
                    id="edit-tracking"
                    value={editForm.trackingNumber}
                    onChange={(e) => setEditForm({...editForm, trackingNumber: e.target.value})}
                    className="bg-white/5 border-orange-500/30 text-white h-11"
                    placeholder="Enter tracking number"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-orange-500/30 overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm md:text-base">Comments</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  id="edit-comment"
                  value={editForm.comment}
                  onChange={(e) => setEditForm({...editForm, comment: e.target.value})}
                  className="w-full p-3 bg-white/5 border border-orange-500/30 rounded-lg text-white placeholder-white/50 resize-none"
                  rows={4}
                  placeholder="Add any notes or comments about this order..."
                />
              </CardContent>
            </Card>

            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
              <Button
                onClick={() => setEditingOrder(null)}
                variant="outline"
                className="border-gray-500/30 text-gray-400 hover:bg-gray-500/10 h-11 flex-1 sm:flex-initial"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (editingOrder) {
                    handleSave(editingOrder)
                  }
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white h-11 flex-1 sm:flex-initial"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

