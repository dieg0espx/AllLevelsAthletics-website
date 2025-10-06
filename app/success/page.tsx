"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Package, Home, ShoppingBag, Mail, Truck, Clock, Star } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [isLoading, setIsLoading] = useState(true)
  const [orderSaved, setOrderSaved] = useState(false)
  const [orderSaveAttempted, setOrderSaveAttempted] = useState(false)
  const [cartItems, setCartItems] = useState<any[]>([])
  const [shippingInfo, setShippingInfo] = useState<any>({})
  const [totalAmount, setTotalAmount] = useState(0)
  const { user, userRole } = useAuth()

  useEffect(() => {
    // Simulate loading for better UX
    const timer = setTimeout(() => setIsLoading(false), 2000)
    
    // Load cart items and shipping info into state
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]')
    const storedShippingInfo = JSON.parse(localStorage.getItem('shippingInfo') || '{}')
    const calculatedTotal = storedCartItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
    
    setCartItems(storedCartItems)
    setShippingInfo(storedShippingInfo)
    setTotalAmount(calculatedTotal)
    
    // Save order to user account if we have session ID and user
    if (sessionId && user) {
      saveOrderToAccount()
    }
    
    return () => clearTimeout(timer)
  }, [sessionId, user])

  const saveOrderToAccount = async () => {
    // Prevent duplicate calls
    if (orderSaveAttempted) {
      console.log('🔄 Order save already attempted, skipping...')
      return
    }
    
    setOrderSaveAttempted(true)
    
    try {
      console.log('🔄 Starting to save order...')
      console.log('Session ID:', sessionId)
      console.log('User ID:', user?.id)
      console.log('User email:', user?.email)
      
      // Get cart items from localStorage (you might want to store this in context instead)
      const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]')
      const shippingInfo = JSON.parse(localStorage.getItem('shippingInfo') || '{}')
      
      console.log('📦 Cart items from localStorage:', cartItems)
      console.log('🚚 Shipping info from localStorage:', shippingInfo)
      
      if (cartItems.length === 0) {
        console.log('❌ No cart items found in localStorage')
        return
      }

      const totalAmount = cartItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
      console.log('💰 Total amount:', totalAmount)

      // Add user's email to shipping info
      const shippingInfoWithEmail = {
        ...shippingInfo,
        email: user?.email || ''
      }
      console.log('📧 Shipping info with email:', shippingInfoWithEmail)

      const orderData = {
        sessionId,
        items: cartItems,
        shippingInfo: shippingInfoWithEmail,
        userId: user?.id,
        totalAmount
      }
      console.log('📤 Sending order data to API:', orderData)

      const response = await fetch('/api/save-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      console.log('📡 API response status:', response.status)
      console.log('📡 API response ok:', response.ok)

      if (response.ok) {
        const responseData = await response.json()
        console.log('✅ Order saved successfully:', responseData)
        
        if (responseData.message === 'Order already exists') {
          setOrderSaved(true)
          console.log('✅ Order was already saved previously')
        } else {
          setOrderSaved(true)
          console.log('✅ New order saved successfully')
        }
        
        // Clear cart after successful save
        localStorage.removeItem('cartItems')
        localStorage.removeItem('shippingInfo')
        console.log('🧹 Cart cleared from localStorage')
      } else {
        const errorData = await response.json().catch(() => 'Failed to parse error response')
        console.error('❌ Failed to save order:', errorData)
        console.error('❌ Response status:', response.status)
        console.error('❌ Response status text:', response.statusText)
        console.error('❌ DETAILED ERROR INFO:', errorData)
        
        // Display all error properties
        if (errorData.details) console.error('❌ Error details:', errorData.details)
        if (errorData.stack) console.error('❌ Error stack:', errorData.stack)
        if (errorData.fullError) console.error('❌ Full error:', errorData.fullError)
        if (errorData.error) console.error('❌ Error message:', errorData.error)
        if (errorData.errorName) console.error('❌ Error name:', errorData.errorName)
        
        // Log the entire error object structure
        console.error('❌ Complete error object:', JSON.stringify(errorData, null, 2))
      }
    } catch (error) {
      console.error('💥 Error saving order:', error)
      if (error instanceof Error) {
        console.error('💥 Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        })
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-white">Processing your order...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          


                                                                                       {/* Order Receipt Card */}
             <Card className="bg-gradient-to-br from-white/5 to-white/10 border-orange-500/30 backdrop-blur-sm mb-12 shadow-2xl mt-16">
              <CardHeader className="pt-8 pb-6">
                <div className="flex items-center justify-between mb-6">
                  <CardTitle className="text-2xl text-white flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-orange-400" />
                    </div>
                    Order Receipt
                  </CardTitle>
                  {sessionId && (
                    <div className="inline-flex items-center gap-2 bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 rounded-full px-4 py-2">
                      <Package className="w-4 h-4 text-orange-400" />
                      <span className="text-white/90 font-mono text-sm">ID: {sessionId}</span>
                    </div>
                  )}
                </div>
                <CardDescription className="text-white/70 text-base">
                  Your purchase summary and order details
                </CardDescription>
              </CardHeader>
                          <CardContent className="pt-6 pb-8">
                <div className="space-y-8">
                {/* Order Summary */}
                <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-xl p-6">
                  <h4 className="font-semibold text-orange-400 mb-4 text-lg flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Products Purchased
                  </h4>
                  
                                                                           {/* Products List */}
                   <div className="space-y-4">
                     {cartItems.length > 0 ? (
                       <>
                         {cartItems.map((item: any, index: number) => (
                           <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                             <div className="flex items-center gap-4">
                               <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                                 <img
                                   src={
                                    item.name.includes("MFRoller") 
                                       ? "/roller/roller7.jpg"
                                       : item.name.includes("Body Tension Reset Course")
                                       ? "/gymTools.jpg"
                                       : item.name.includes("Complete Bundle")
                                       ? "/roller/roller12.jpg"
                                       : item.image || "/placeholder.jpg"
                                   }
                                   alt={item.name}
                                   className="w-full h-full object-cover"
                                 />
                               </div>
                               <div>
                                 <h5 className="font-semibold text-white">{item.name}</h5>
                                 <p className="text-white/70 text-sm">Quantity: {item.quantity}</p>
                                 <p className="text-white/60 text-sm">${item.price} each</p>
                               </div>
                             </div>
                             <div className="text-right">
                               <p className="text-xl font-bold text-orange-400">${(item.price * item.quantity).toFixed(2)}</p>
                             </div>
                           </div>
                         ))}
                         
                         {/* Total */}
                         <div className="border-t border-orange-500/20 pt-4">
                           <div className="flex justify-between items-center">
                             <span className="text-lg font-semibold text-white">Total Amount:</span>
                             <span className="text-2xl font-bold text-orange-400">${totalAmount.toFixed(2)}</span>
                           </div>
                         </div>
                       </>
                     ) : (
                       <div className="text-center py-8">
                         <Package className="w-16 h-16 text-orange-400 mx-auto mb-4 opacity-50" />
                         <p className="text-white/60">No products found in this order</p>
                       </div>
                     )}
                   </div>
                </div>

                                 {/* Shipping Information */}
                 <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-xl p-6">
                   <h4 className="font-semibold text-orange-400 mb-4 text-lg flex items-center gap-2">
                     <Truck className="w-5 h-5 text-orange-400" />
                     Shipping Details
                   </h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/80">
                     <div>
                       <p className="font-medium text-white">Name:</p>
                       <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                     </div>
                     <div>
                       <p className="font-medium text-white">Email:</p>
                       <p className="text-orange-400">{user?.email}</p>
                     </div>
                     <div>
                       <p className="font-medium text-white">Phone:</p>
                       <p>{shippingInfo.phone}</p>
                     </div>
                     <div>
                       <p className="font-medium text-white">Address:</p>
                       <p>{shippingInfo.address}</p>
                       <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                       <p>{shippingInfo.country}</p>
                     </div>
                   </div>
                 </div>

                                 {/* Order Status */}
                 <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-xl p-6">
                   <h4 className="font-semibold text-orange-400 mb-4 text-lg flex items-center gap-2">
                     <CheckCircle className="w-5 h-5 text-orange-400" />
                     Order Status
                   </h4>
                   <div className="flex items-center gap-3">
                     <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
                     <span className="text-white/80">Order confirmed and processing</span>
                   </div>
                   <p className="text-white/60 text-sm mt-2">
                     Estimated delivery: 3-7 business days
                   </p>
                 </div>
              </div>
            </CardContent>
          </Card>

                     {/* Process Timeline */}
           <Card className="bg-gradient-to-br from-white/5 to-white/10 border-orange-500/30 backdrop-blur-sm mb-12 shadow-2xl">
             <CardHeader className="text-center">
               <CardTitle className="text-2xl text-white">Your Order Journey</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 {/* Order Confirmed - HIGHLIGHTED */}
                 <div className="text-center">
                   <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-orange-400 shadow-lg shadow-orange-500/30">
                     <CheckCircle className="w-8 h-8 text-white" />
                   </div>
                   <h4 className="font-bold text-orange-400 mb-2">Order Confirmed</h4>
                   <p className="text-orange-300 text-sm font-medium">Payment processed successfully</p>
                   <div className="mt-2 inline-flex items-center gap-1 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-semibold">
                     <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                     COMPLETED
                   </div>
                 </div>
                 
                 {/* Processing - Next Step */}
                 <div className="text-center">
                   <div className="w-16 h-16 bg-orange-500/30 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-orange-500/60 shadow-md">
                     <Package className="w-8 h-8 text-orange-400" />
                   </div>
                   <h4 className="font-semibold text-white mb-2">Processing</h4>
                   <p className="text-white/70 text-sm">Preparing your order</p>
                   <div className="mt-2 inline-flex items-center gap-1 bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-xs font-semibold">
                     <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                     NEXT
                   </div>
                 </div>
                 
                 {/* Shipping - Future Step */}
                 <div className="text-center">
                   <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/20">
                     <Truck className="w-8 h-8 text-white/50" />
                   </div>
                   <h4 className="font-semibold text-white/70 mb-2">Shipping</h4>
                   <p className="text-white/50 text-sm">On its way to you</p>
                   <div className="mt-2 inline-flex items-center gap-1 bg-white/10 text-white/50 px-3 py-1 rounded-full text-xs font-semibold">
                     <Clock className="w-3 h-3" />
                     PENDING
                   </div>
                 </div>
                 
                 {/* Delivered - Future Step */}
                 <div className="text-center">
                   <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/20">
                     <Mail className="w-8 h-8 text-white/50" />
                   </div>
                   <h4 className="font-semibold text-white/70 mb-2">Delivered</h4>
                   <p className="text-white/50 text-sm">Enjoy your product!</p>
                   <div className="mt-2 inline-flex items-center gap-1 bg-white/10 text-white/50 px-3 py-1 rounded-full text-xs font-semibold">
                     <Clock className="w-3 h-3" />
                     PENDING
                   </div>
                 </div>
               </div>
               
               {/* Progress Bar */}
               <div className="mt-8">
                 <div className="flex items-center justify-between mb-2">
                   <span className="text-sm text-orange-400 font-medium">Order Progress</span>
                   <span className="text-sm text-white/70">25% Complete</span>
                 </div>
                 <div className="w-full bg-white/10 rounded-full h-2">
                   <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full w-1/4 transition-all duration-1000 ease-out"></div>
                 </div>
               </div>
             </CardContent>
           </Card>

          {/* Action Buttons */}
          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button asChild className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105">
                <Link href={(userRole === 'admin' || user?.user_metadata?.role === 'admin') ? '/admin' : '/dashboard'}>
                  <Home className="w-5 h-5 mr-2" />
                  Go to My Account
                </Link>
              </Button>
                             <Button asChild variant="outline" className="border-orange-500/40 text-orange-400 hover:bg-orange-500/10 hover:border-orange-500/60 px-8 py-4 text-lg font-semibold transition-all duration-300">
                 <Link href="/services?scrollTo=products">
                   <ShoppingBag className="w-5 h-5 mr-2" />
                   Browse More Products
                 </Link>
               </Button>
            </div>
            
            {/* Additional Info */}
            <div className="text-white/60 text-sm">
              <p>Need help? Contact us at AllLevelsAthletics@gmail.com</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
