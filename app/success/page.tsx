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
  const { user } = useAuth()

  useEffect(() => {
    // Simulate loading for better UX
    const timer = setTimeout(() => setIsLoading(false), 2000)
    
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
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-yellow-500/5 to-orange-500/10"></div>
        
        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-yellow-500/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            {/* Success Icon */}
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-500/25">
                <CheckCircle className="w-14 h-14 text-white" />
              </div>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent">
              Order Successful!
            </h1>
                         <p className="text-xl md:text-2xl text-white/80 mb-6 leading-relaxed">
               Thank you for your purchase! 
             </p>
             
             {/* Order ID Badge */}
             {sessionId && (
               <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-6">
                 <Package className="w-5 h-5 text-orange-400" />
                 <span className="text-white/90 font-mono text-sm">Order ID: {sessionId}</span>
               </div>
             )}
             
             {/* Order Status */}
             <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-6 max-w-3xl mx-auto">
               <div className="flex items-center justify-center gap-3 mb-3">
                 <Clock className="w-5 h-5 text-green-400" />
                 <h3 className="text-lg font-semibold text-green-400">What happens next?</h3>
               </div>
               <p className="text-white/90 text-base leading-relaxed">
                 You'll receive an email confirmation with your order details and tracking information. 
                 Your product will ship within 24 hours and arrive at your doorstep in 3-7 business days!
               </p>
             </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          


          {/* Product Details Card */}
          <Card className="bg-gradient-to-br from-white/5 to-white/10 border-orange-500/30 backdrop-blur-sm mb-12 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-orange-400" />
                </div>
                All Levels Knot Roller
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="relative group">
                                     <img
                     src="/roller/roller 5.jpeg"
                     alt="All Levels Knot Roller"
                     className="w-full h-64 lg:h-80 object-cover rounded-2xl shadow-2xl group-hover:scale-105 transition-transform duration-500"
                   />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                </div>
                
                {/* Product Info */}
                <div className="space-y-6">
                  {/* Features */}
                  <div>
                    <h4 className="font-semibold text-orange-400 mb-4 text-lg flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      Product Features
                    </h4>
                    <ul className="space-y-3 text-white/80">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Precision ball bearings for smooth operation</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Non-slip rubber base for stability</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Versatile design for multiple uses</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Durable stainless steel construction</span>
                      </li>
                    </ul>
                  </div>
                  
                  {/* Shipping Info */}
                  <div>
                    <h4 className="font-semibold text-orange-400 mb-4 text-lg flex items-center gap-2">
                      <Truck className="w-5 h-5" />
                      Shipping Information
                    </h4>
                    <p className="text-white/80 leading-relaxed">
                      Your order will ship within 24 hours and includes tracking information. 
                      You'll receive updates via email and can track your package every step of the way.
                    </p>
                  </div>
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
                 <div className="text-center">
                   <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-orange-500/40">
                     <CheckCircle className="w-8 h-8 text-orange-400" />
                   </div>
                   <h4 className="font-semibold text-white mb-2">Order Confirmed</h4>
                   <p className="text-white/70 text-sm">Payment processed successfully</p>
                 </div>
                 
                 <div className="text-center">
                   <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-orange-500/40">
                     <Package className="w-8 h-8 text-orange-400" />
                   </div>
                   <h4 className="font-semibold text-white mb-2">Processing</h4>
                   <p className="text-white/70 text-sm">Preparing your order</p>
                 </div>
                 
                 <div className="text-center">
                   <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-orange-500/40">
                     <Truck className="w-8 h-8 text-orange-400" />
                   </div>
                   <h4 className="font-semibold text-white mb-2">Shipping</h4>
                   <p className="text-white/70 text-sm">On its way to you</p>
                 </div>
                 
                 <div className="text-center">
                   <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-orange-500/40">
                     <Mail className="w-8 h-8 text-orange-400" />
                   </div>
                   <h4 className="font-semibold text-white mb-2">Delivered</h4>
                   <p className="text-white/70 text-sm">Enjoy your product!</p>
                 </div>
               </div>
             </CardContent>
           </Card>

          {/* Action Buttons */}
          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button asChild className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105">
                <Link href="/dashboard">
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
              <p>Need help? Contact us at support@alllevelsathletics.com</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
