"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSafeAuth } from "@/contexts/safe-auth-context"
import { AdminRedirect } from "@/components/admin-redirect"
import { supabase } from "@/lib/supabase"
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
  Search,
  X
} from "lucide-react"

export default function ProductsPage() {
  const router = useRouter()
  const { user, signOut, isHydrated } = useSafeAuth()
  const [isLoading, setIsLoading] = useState(true)

  const [purchasedProducts, setPurchasedProducts] = useState([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(true)

  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    if (!user) {
      router.push('/')
      return
    }
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [user, router])

  useEffect(() => {
    if (user) {
      fetchUserOrders()
    }
  }, [user])

  const fetchUserOrders = async () => {
    try {
      console.log('🔄 Dashboard: Fetching user orders...')
      console.log('👤 User object:', user)
      console.log('👤 User ID:', user.id)
      console.log('👤 User ID type:', typeof user.id)
      
      setIsLoadingOrders(true)
      
      // Get the current session token
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      
      if (!token) {
        console.error('❌ No access token available')
        return
      }
      
      console.log('🔐 Using token for API call')
      
      const response = await fetch(`/api/user-orders?userId=${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      console.log('📡 API response status:', response.status)
      console.log('📡 API response ok:', response.ok)
      
      if (response.ok) {
        const data = await response.json()
        console.log('📦 Orders data received:', data)
        console.log('📦 Orders count:', data.orders?.length || 0)
        setPurchasedProducts(data.orders || [])
        
        if (!data.orders || data.orders.length === 0) {
          console.log('ℹ️ No orders found for this user')
        }
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }))
        console.error('❌ Failed to fetch orders:', errorData)
        
        // Log error details
        const errorMessage = errorData.details || errorData.error || 'Unknown error occurred'
        console.error('Failed to load orders:', errorMessage)
      }
    } catch (error) {
      console.error('💥 Error fetching orders:', error)
    } finally {
      setIsLoadingOrders(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
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

  const filteredProducts = filterStatus === "all" 
    ? purchasedProducts 
    : purchasedProducts.filter(product => product.status === filterStatus)

  console.log('🎨 Rendering page with:')
  console.log('- isLoading:', isLoading)
  console.log('- isLoadingOrders:', isLoadingOrders)
  console.log('- purchasedProducts:', purchasedProducts)
  console.log('- purchasedProducts.length:', purchasedProducts.length)
  console.log('- filterStatus:', filterStatus)
  console.log('- filteredProducts:', filteredProducts)
  console.log('- filteredProducts.length:', filteredProducts.length)

  // Don't render until hydrated to prevent SSR issues
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-white">Loading Products...</h1>
        </div>
      </div>
    )
  }

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
    <AdminRedirect>
      <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black/95 backdrop-blur-md border-b border-orange-500/30 sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 sm:py-0 sm:h-16 gap-3 sm:gap-0">
            <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="text-white/90 hover:text-orange-400 hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Back to Dashboard</span>
              </Button>
              <h1 className="text-lg sm:text-2xl font-bold text-orange-400">Purchased Products</h1>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/')}
                className="text-white/90 hover:text-orange-400 hover:bg-white/10 text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">Back to Site</span>
                <span className="sm:hidden">Home</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-white/90 hover:text-red-400 hover:bg-white/10 text-xs sm:text-sm"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-4 sm:py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
                Track Your Orders
              </h2>
              <p className="text-sm sm:text-base text-white/70">Monitor your purchases, shipping status, and delivery information</p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard')}
              className="hidden sm:flex border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:border-orange-500/50 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex overflow-x-auto space-x-2 border-b border-white/10 pb-px scrollbar-hide">
            {["all", "processing", "shipped", "delivered", "cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap flex-shrink-0 ${
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
          <div className="space-y-8">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="bg-gradient-to-br from-white/5 to-white/10 border-orange-500/30 shadow-xl hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                    <div className="flex items-start gap-3 sm:gap-4 w-full lg:w-auto">
                      {/* Product Images - Show all products in order */}
                      <div className="flex gap-2 flex-shrink-0">
                        {product.items.map((item, index) => (
                          <div key={index} className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 border-orange-500/30 shadow-lg">
                            <img
                              src={
                                item.name.includes("MFRoller") 
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
                      
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-white text-base sm:text-xl mb-1 break-words">
                          {product.items.length === 1 
                            ? product.items[0].name 
                            : `${product.items.length} Products`
                          }
                        </CardTitle>
                        <CardDescription className="text-white/70 text-sm sm:text-base">
                          Order #{product.orderNumber}
                        </CardDescription>
                        <div className="mt-2 text-xl sm:text-2xl font-bold text-orange-400">
                          ${product.price}
                        </div>
                        {product.items.length > 1 && (
                          <div className="mt-1 text-xs sm:text-sm text-white/60 break-words">
                            {product.items.map((item, index) => (
                              <span key={index}>
                                {item.name} {item.quantity > 1 && `(x${item.quantity})`}
                                {index < product.items.length - 1 && ', '}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-start lg:items-end gap-3 w-full lg:w-auto">
                      <Badge className={`${getStatusColor(product.status)} px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold`}>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(product.status)}
                          {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                        </div>
                      </Badge>
                      
                      {/* Progress Tracking */}
                      <div className="hidden md:flex items-center space-x-2 lg:space-x-3 text-xs lg:text-sm overflow-x-auto">
                        <div className={`flex items-center gap-1 whitespace-nowrap ${product.status === 'processing' || product.status === 'shipped' || product.status === 'delivered' ? 'text-orange-400' : 'text-white/30'}`}>
                          <Clock className="w-3 h-3 lg:w-4 lg:h-4" />
                          <span className="font-medium hidden lg:inline">Processing</span>
                        </div>
                        <div className={`w-4 lg:w-6 h-0.5 ${product.status === 'shipped' || product.status === 'delivered' ? 'bg-orange-400' : 'bg-white/20'}`}></div>
                        <div className={`flex items-center gap-1 whitespace-nowrap ${product.status === 'shipped' || product.status === 'delivered' ? 'text-orange-400' : 'text-white/30'}`}>
                          <Truck className="w-3 h-3 lg:w-4 lg:h-4" />
                          <span className="font-medium hidden lg:inline">Shipped</span>
                        </div>
                        <div className={`w-4 lg:w-6 h-0.5 ${product.status === 'delivered' ? 'bg-orange-400' : 'bg-white/20'}`}></div>
                        <div className={`flex items-center gap-1 whitespace-nowrap ${product.status === 'delivered' ? 'text-orange-400' : 'text-white/30'}`}>
                          <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4" />
                          <span className="font-medium hidden lg:inline">Delivered</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    {/* Order Details */}
                    <div className="space-y-4 sm:space-y-6">
                      <div className="bg-white/5 rounded-xl p-3 sm:p-4 border border-white/10">
                        <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                          <Package className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
                          Order Details
                        </h4>
                        
                        <div className="space-y-2 sm:space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                            <span className="text-xs sm:text-sm text-white/70">Purchase Date:</span>
                            <span className="text-sm sm:text-base text-white font-medium">{new Date(product.purchaseDate).toLocaleDateString()}</span>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                            <span className="text-xs sm:text-sm text-white/70">Tracking Number:</span>
                            <span className="text-white font-mono text-xs sm:text-sm bg-white/10 px-2 py-1 rounded break-all">{product.trackingNumber}</span>
                          </div>
                        </div>

                        {/* Items List */}
                        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/10">
                          <h5 className="text-xs sm:text-sm font-medium text-white mb-2 sm:mb-3">Items Purchased:</h5>
                          <div className="space-y-2">
                            {product.items.map((item, index) => (
                              <div key={index} className="flex items-center justify-between text-xs sm:text-sm bg-white/5 p-2 rounded">
                                <span className="text-white/80 break-words pr-2">
                                  {item.name} x{item.quantity}
                                </span>
                                <span className="text-orange-400 font-medium whitespace-nowrap">${item.price}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Information */}
                    <div className="space-y-4 sm:space-y-6">
                      <div className="bg-white/5 rounded-xl p-3 sm:p-4 border border-white/10">
                        <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
                          Shipping Information
                        </h4>
                        
                        <div className="space-y-3 sm:space-y-4">
                          {/* Shipping Address */}
                          <div className="flex items-start gap-2 sm:gap-3">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400" />
                            </div>
                            <div className="text-white/80 space-y-1 min-w-0 flex-1">
                              <div className="font-medium text-white text-sm sm:text-base lg:text-lg break-words">{product.shippingAddress?.firstName} {product.shippingAddress?.lastName}</div>
                              {product.shippingAddress?.address && (
                                <div className="text-xs sm:text-sm text-white/70 break-words">{product.shippingAddress.address}</div>
                              )}
                              <div className="text-xs sm:text-sm text-white/70 break-words">{product.shippingAddress?.city}, {product.shippingAddress?.state} {product.shippingAddress?.zipCode}</div>
                              {product.shippingAddress?.country && (
                                <div className="text-xs sm:text-sm text-white/70">{product.shippingAddress.country}</div>
                              )}
                              <div className="text-xs sm:text-sm text-orange-400 mt-2 font-medium break-all">{product.shippingAddress?.email}</div>
                              {product.shippingAddress?.phone && (
                                <div className="text-xs sm:text-sm text-white/70">{product.shippingAddress.phone}</div>
                              )}
                            </div>
                          </div>

                          {/* Shipping Details */}
                          {(product.carrier || product.shippingMethod) && (
                            <div className="pt-3 sm:pt-4 border-t border-white/10">
                              <h5 className="text-xs sm:text-sm font-medium text-white mb-2 sm:mb-3">Shipping Details:</h5>
                              <div className="space-y-2">
                                {product.carrier && (
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 text-xs sm:text-sm">
                                    <span className="text-white/70">Carrier:</span>
                                    <span className="text-white font-medium">{product.carrier}</span>
                                  </div>
                                )}
                                {product.shippingMethod && (
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 text-xs sm:text-sm">
                                    <span className="text-white/70">Method:</span>
                                    <span className="text-white font-medium">{product.shippingMethod}</span>
                                  </div>
                                )}
                                {product.trackingNumber && product.trackingNumber !== 'N/A' && (
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 text-xs sm:text-sm">
                                    <span className="text-white/70">Tracking:</span>
                                    <span className="text-orange-400 font-mono text-xs bg-white/10 px-2 py-1 rounded break-all">{product.trackingNumber}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Order Comments */}
                          {product.comment && (
                            <div className="pt-3 sm:pt-4 border-t border-white/10">
                              <h5 className="text-xs sm:text-sm font-medium text-white mb-2 sm:mb-3">Order Notes:</h5>
                              <div className="bg-white/10 rounded-lg p-2 sm:p-3 border border-white/20">
                                <p className="text-white/80 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
                                  {product.comment}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Delivery Timeline */}
                    <div className="space-y-4 sm:space-y-6 md:col-span-2 lg:col-span-1">
                      <div className="bg-white/5 rounded-xl p-3 sm:p-4 border border-white/10">
                        <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
                          Delivery Timeline
                        </h4>
                        
                        <div className="space-y-3 sm:space-y-4">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-white/70 text-xs sm:text-sm">Estimated Delivery</div>
                              <div className="text-white font-medium text-sm sm:text-base">{new Date(product.estimatedDelivery).toLocaleDateString()}</div>
                            </div>
                          </div>
                          
                          {product.actualDelivery && (
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-white/70 text-xs sm:text-sm">Delivered</div>
                                <div className="text-green-400 font-medium text-sm sm:text-base">{new Date(product.actualDelivery).toLocaleDateString()}</div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
                          {product.status === "delivered" ? (
                            <Button 
                              variant="outline" 
                              className="w-full border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:border-orange-500/50 transition-all duration-300 text-xs sm:text-sm"
                              onClick={() => window.open('mailto:AllLevelsAthletics@gmail.com?subject=Order Support - ' + product.orderNumber, '_blank')}
                            >
                              <Package className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                              Need Help with This Order?
                            </Button>
                          ) : (
                            <>
                              <Button 
                                variant="outline" 
                                className="w-full border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:border-orange-500/50 transition-all duration-300 text-xs sm:text-sm"
                                onClick={() => {
                                  if (product.carrier && product.trackingNumber && product.trackingNumber !== 'N/A') {
                                    // Open carrier tracking page based on carrier
                                    let trackingUrl = ''
                                    switch (product.carrier.toLowerCase()) {
                                      case 'ups':
                                        trackingUrl = `https://www.ups.com/track?track=yes&trackNums=${product.trackingNumber}`
                                        break
                                      case 'fedex':
                                        trackingUrl = `https://www.fedex.com/fedextrack/?trknbr=${product.trackingNumber}`
                                        break
                                      case 'usps':
                                        trackingUrl = `https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=${product.trackingNumber}`
                                        break
                                      case 'dhl':
                                        trackingUrl = `https://www.dhl.com/us-en/home/tracking.html?trackingNumber=${product.trackingNumber}`
                                        break
                                      default:
                                        trackingUrl = `https://www.google.com/search?q=track+${product.trackingNumber}+${product.carrier}`
                                    }
                                    window.open(trackingUrl, '_blank')
                                  } else {
                                    console.log('Tracking information not available for this order')
                                  }
                                }}
                              >
                                <Truck className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                Track Package
                              </Button>
                              
                              <Button 
                                variant="outline" 
                                className="w-full border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:border-orange-500/50 transition-all duration-300 text-xs sm:text-sm"
                                onClick={() => window.open('mailto:AllLevelsAthletics@gmail.com?subject=Order Support - ' + product.orderNumber, '_blank')}
                              >
                                <Package className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                Need Help with This Order?
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-gradient-to-br from-white/5 to-white/10 border-orange-500/30 shadow-xl">
            <CardContent className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <ShoppingBag className="w-12 h-12 text-orange-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">No Products Found</h3>
              <p className="text-white/70 mb-8 text-lg">
                {filterStatus === "all" 
                  ? "You haven't purchased any products yet" 
                  : `No products with status "${filterStatus}" found`
                }
              </p>
              {filterStatus === "all" && (
                <Button 
                  onClick={() => router.push('/services?scrollTo=products')} 
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 text-lg font-semibold shadow-xl hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Browse Products
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-white/5 to-white/10 border-orange-500/30 text-center shadow-xl hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300">
            <CardContent className="pt-6 pb-6">
              <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShoppingBag className="w-6 h-6 text-orange-400" />
              </div>
              <div className="text-3xl font-bold text-orange-400 mb-1">{purchasedProducts.length}</div>
              <p className="text-white/70 text-sm font-medium">Total Orders</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-white/5 to-white/10 border-orange-500/30 text-center shadow-xl hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300">
            <CardContent className="pt-6 pb-6">
              <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-orange-400" />
              </div>
              <div className="text-3xl font-bold text-orange-400 mb-1">
                {purchasedProducts.filter(p => p.status === "processing").length}
              </div>
              <p className="text-white/70 text-sm font-medium">Processing</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-white/5 to-white/10 border-orange-500/30 text-center shadow-xl hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300">
            <CardContent className="pt-6 pb-6">
              <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Truck className="w-6 h-6 text-orange-400" />
              </div>
              <div className="text-3xl font-bold text-orange-400 mb-1">
                {purchasedProducts.filter(p => p.status === "shipped").length}
              </div>
              <p className="text-white/70 text-sm font-medium">In Transit</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-white/5 to-white/10 border-orange-500/30 text-center shadow-xl hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300">
            <CardContent className="pt-6 pb-6">
              <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-orange-400" />
              </div>
              <div className="text-3xl font-bold text-orange-400 mb-1">
                {purchasedProducts.filter(p => p.status === "delivered").length}
              </div>
              <p className="text-white/70 text-sm font-medium">Delivered</p>
            </CardContent>
          </Card>
        </div>
      </main>
      </div>
    </AdminRedirect>
  )
}
