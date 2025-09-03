"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft,
  ShoppingBag,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  DollarSign,
  Search
} from "lucide-react"

export default function ProductsPage() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  // Mock data - replace with real data from your backend
  const [purchasedProducts] = useState([
    {
      id: 1,
      name: "All Levels Knot Roller",
      orderNumber: "ORD-2024-001",
      purchaseDate: "2024-01-10",
      price: 99.00,
      status: "delivered",
      trackingNumber: "TRK123456789",
      estimatedDelivery: "2024-01-15",
      actualDelivery: "2024-01-14",
      shippingAddress: "123 Fitness St, Gym City, GC 12345",
      items: [
        { name: "All Levels Knot Roller", quantity: 1, price: 99.00 }
      ]
    },
    {
      id: 2,
      name: "Body Tension Reset Course",
      orderNumber: "ORD-2024-002",
      purchaseDate: "2024-01-05",
      price: 49.00,
      status: "delivered",
      trackingNumber: "TRK987654321",
      estimatedDelivery: "2024-01-12",
      actualDelivery: "2024-01-11",
      shippingAddress: "123 Fitness St, Gym City, GC 12345",
      items: [
        { name: "Body Tension Reset Course", quantity: 1, price: 49.00 }
      ]
    }
  ])

  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    if (!user) {
      router.push('/')
      return
    }
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [user, router])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "shipped":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "processing":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
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
      default:
        return <Package className="w-4 h-4" />
    }
  }

  const filteredProducts = filterStatus === "all" 
    ? purchasedProducts 
    : purchasedProducts.filter(product => product.status === filterStatus)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-white">Loading Products...</h1>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black/95 backdrop-blur-md border-b border-orange-500/30 sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="text-white/90 hover:text-orange-400 hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-orange-400">Purchased Products</h1>
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
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-white/90 hover:text-red-400 hover:bg-white/10"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-orange-400" />
            Track Your Orders
          </h2>
          <p className="text-white/70">Monitor your purchases, shipping status, and delivery information</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex space-x-2 border-b border-white/10">
            {["all", "processing", "shipped", "delivered"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  filterStatus === status
                    ? "bg-orange-500 text-white"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Products List */}
        {filteredProducts.length > 0 ? (
          <div className="space-y-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="bg-white/5 border-orange-500/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">{product.name}</CardTitle>
                      <CardDescription className="text-white/70">
                        Order #{product.orderNumber}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(product.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(product.status)}
                        {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                      </div>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Order Details */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-white">Order Details</h4>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/70">Purchase Date:</span>
                          <span className="text-white">{new Date(product.purchaseDate).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/70">Total Amount:</span>
                          <span className="text-2xl font-bold text-orange-400">${product.price}</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/70">Tracking Number:</span>
                          <span className="text-white font-mono">{product.trackingNumber}</span>
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="mt-4">
                        <h5 className="text-sm font-medium text-white mb-2">Items:</h5>
                        <div className="space-y-2">
                          {product.items.map((item, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <span className="text-white/80">
                                {item.name} x{item.quantity}
                              </span>
                              <span className="text-white">${item.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Shipping Information */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-white">Shipping Information</h4>
                      
                      <div className="space-y-3">
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                          <span className="text-white/80">{product.shippingAddress}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-orange-400" />
                          <span className="text-white/80">
                            Estimated: {new Date(product.estimatedDelivery).toLocaleDateString()}
                          </span>
                        </div>
                        
                        {product.actualDelivery && (
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-green-400">
                              Delivered: {new Date(product.actualDelivery).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-6 space-y-2">
                        <Button 
                          variant="outline" 
                          className="w-full border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                        >
                          <Truck className="w-4 h-4 mr-2" />
                          Track Package
                        </Button>
                        
                        {product.status === "delivered" && (
                          <Button 
                            variant="outline" 
                            className="w-full border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark as Received
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-white/5 border-orange-500/30">
            <CardContent className="text-center py-12">
              <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-10 h-10 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Products Found</h3>
              <p className="text-white/70 mb-6">
                {filterStatus === "all" 
                  ? "You haven't purchased any products yet" 
                  : `No products with status "${filterStatus}" found`
                }
              </p>
              {filterStatus === "all" && (
                <Button onClick={() => router.push('/shop')} className="bg-orange-500 hover:bg-orange-600">
                  Browse Products
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white/5 border-orange-500/30 text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-400">{purchasedProducts.length}</div>
              <p className="text-white/70 text-sm">Total Orders</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 border-orange-500/30 text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-400">
                ${purchasedProducts.reduce((sum, p) => sum + p.price, 0).toFixed(2)}
              </div>
              <p className="text-white/70 text-sm">Total Spent</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 border-orange-500/30 text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-400">
                {purchasedProducts.filter(p => p.status === "delivered").length}
              </div>
              <p className="text-white/70 text-sm">Delivered</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 border-orange-500/30 text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-400">
                {purchasedProducts.filter(p => p.status === "shipped").length}
              </div>
              <p className="text-white/70 text-sm">In Transit</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
