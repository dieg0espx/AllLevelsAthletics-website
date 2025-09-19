"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  Users,
  Search,
  Edit,
  Save,
  X,
  Package,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  BarChart3,
  Star,
  Shield,
  Lock
} from "lucide-react"

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

interface ClientsSectionProps {
  clients: Client[]
  clientsLoading: boolean
  selectedClient: Client | null
  onSelectClient: (client: Client | null) => void
  onEditClient: (client: Client) => void
  onSaveClient: (client: Client) => void
  onCancelEdit: () => void
  editingClient: Client | null
  searchTerm: string
  onSearchChange: (term: string) => void
}

export function ClientsSection({
  clients,
  clientsLoading,
  selectedClient,
  onSelectClient,
  onEditClient,
  onSaveClient,
  onCancelEdit,
  editingClient,
  searchTerm,
  onSearchChange
}: ClientsSectionProps) {
  const [editForm, setEditForm] = useState({
    full_name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: ''
  })

  const handleEditClick = (client: Client) => {
    setEditForm({
      full_name: client.full_name || '',
      phone: client.phone || '',
      address: client.address || '',
      city: client.city || '',
      state: client.state || '',
      zip_code: client.zip_code || ''
    })
    onEditClient(client)
  }

  const handleSave = () => {
    if (editingClient) {
      const updatedClient = {
        ...editingClient,
        ...editForm
      }
      onSaveClient(updatedClient)
    }
  }

  const filteredClients = clients.filter(client =>
    (client.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (client.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  )

  if (clientsLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Clients Management</h2>
        <div className="text-sm text-white/70">
          {clients.length} total clients
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
        <Input
          type="text"
          placeholder="Search clients by name or email..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-white/5 border-orange-500/30 text-white placeholder-white/50 focus:ring-orange-500/50"
        />
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client) => (
          <Card 
            key={client.id} 
            className="bg-white/5 border-orange-500/20 cursor-pointer hover:border-orange-400/50 transition-colors"
            onClick={() => onSelectClient(client)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{client.full_name || 'Unknown'}</h3>
                    <p className="text-white/70 text-sm">{client.email || 'No email'}</p>
                  </div>
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEditClick(client)
                  }}
                  variant="outline"
                  size="sm"
                  className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Orders:</span>
                  <span className="text-orange-400 font-medium">{client.totalOrders || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Total Spent:</span>
                  <span className="text-orange-400 font-medium">${client.totalSpent || 0}</span>
                </div>
                {client.lastOrderDate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Last Order:</span>
                    <span className="text-white/80">{new Date(client.lastOrderDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-16">
          <Users className="w-16 h-16 text-orange-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Clients Found</h3>
          <p className="text-white/70">
            {searchTerm ? 'No clients match your search criteria.' : 'No clients have been registered yet.'}
          </p>
        </div>
      )}

      {/* Client Details Modal */}
      <Dialog open={!!selectedClient} onOpenChange={() => onSelectClient(null)}>
        <DialogContent 
          className="bg-gray-900 border-orange-500/30 text-white max-h-[90vh] overflow-y-auto"
          style={{ width: '60vw', maxWidth: 'none' }}
        >
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-400" />
              Client Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedClient && (
            <div className="space-y-6">
              {/* Client Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white/5 border-orange-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Shield className="w-5 h-5 text-orange-400" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-white/70 text-sm">Full Name</Label>
                      <div className="text-white font-semibold">{selectedClient.full_name}</div>
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
                    {(selectedClient.address || selectedClient.city || selectedClient.state) && (
                      <div>
                        <Label className="text-white/70 text-sm">Address</Label>
                        <div className="text-white font-semibold">
                          {[selectedClient.address, selectedClient.city, selectedClient.state, selectedClient.zip_code]
                            .filter(Boolean)
                            .join(', ')}
                        </div>
                      </div>
                    )}
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
                        <div className="text-white font-semibold">{new Date(selectedClient.lastOrderDate).toLocaleDateString()}</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Purchase History */}
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
                              <div className="text-white/70 text-xs">{new Date(product.purchaseDate).toLocaleDateString()}</div>
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
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-white/40 mx-auto mb-3" />
                      <p className="text-white/60">No purchases yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Client Modal */}
      <Dialog open={!!editingClient} onOpenChange={onCancelEdit}>
        <DialogContent className="bg-gray-900 border-orange-500/30 text-white max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Edit className="w-5 h-5 text-orange-400" />
              Edit Client Information
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="full_name" className="text-white">Full Name</Label>
                <Input
                  id="full_name"
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                  className="bg-white/5 border-orange-500/30 text-white"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-white">Phone</Label>
                <Input
                  id="phone"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                  className="bg-white/5 border-orange-500/30 text-white"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="address" className="text-white">Address</Label>
              <Input
                id="address"
                value={editForm.address}
                onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                className="bg-white/5 border-orange-500/30 text-white"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city" className="text-white">City</Label>
                <Input
                  id="city"
                  value={editForm.city}
                  onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                  className="bg-white/5 border-orange-500/30 text-white"
                />
              </div>
              <div>
                <Label htmlFor="state" className="text-white">State</Label>
                <Input
                  id="state"
                  value={editForm.state}
                  onChange={(e) => setEditForm({...editForm, state: e.target.value})}
                  className="bg-white/5 border-orange-500/30 text-white"
                />
              </div>
              <div>
                <Label htmlFor="zip_code" className="text-white">ZIP Code</Label>
                <Input
                  id="zip_code"
                  value={editForm.zip_code}
                  onChange={(e) => setEditForm({...editForm, zip_code: e.target.value})}
                  className="bg-white/5 border-orange-500/30 text-white"
                />
              </div>
            </div>
            
            <div className="flex gap-3 justify-end">
              <Button
                onClick={onCancelEdit}
                variant="outline"
                className="border-gray-500/30 text-gray-400 hover:bg-gray-500/10"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

