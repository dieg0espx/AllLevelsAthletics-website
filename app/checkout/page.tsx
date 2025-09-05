"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ShoppingCart, ArrowLeft, CreditCard, Truck, CheckCircle, Lock, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { loadStripe } from "@stripe/stripe-js"
import { AuthModal } from "@/components/auth-modal"
import { usePathname, useRouter } from "next/navigation"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

// Debug: Log the Stripe key
console.log('Stripe publishable key loaded:', process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? 'Yes' : 'No')
console.log('Stripe key length:', process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.length || 0)
console.log('Stripe key starts with pk_:', process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_') || false)

interface ShippingInfo {
  firstName: string
  lastName: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

export default function CheckoutPage() {
  const { state, getTotalPrice, clearCart } = useCart()
  const { user, loading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States"
  })
  const [useProfileInfo, setUseProfileInfo] = useState(false)
  const [profileData, setProfileData] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [step, setStep] = useState<'cart' | 'shipping' | 'payment' | 'confirmation'>('cart')

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

     const handleShippingSubmit = (e: React.FormEvent) => {
     e.preventDefault()
     setStep('payment')
     // Scroll to top of the page when transitioning to payment
     window.scrollTo({ top: 0, behavior: 'smooth' })
   }

     const handleStepChange = (newStep: 'cart' | 'shipping' | 'payment' | 'confirmation') => {
    setStep(newStep)
    // Scroll to top of the page when changing steps
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Fetch user profile data when user is available
  useEffect(() => {
    if (user?.id) {
      fetchUserProfile()
    }
  }, [user])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`/api/user-profile?userId=${user?.id}`)
      const data = await response.json()
      
      if (response.ok && data.profile) {
        setProfileData(data.profile)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const handleUseProfileInfo = (useProfile: boolean) => {
    setUseProfileInfo(useProfile)
    
    if (useProfile && profileData) {
      // Parse full name into first and last name
      const nameParts = (profileData.full_name || "").split(" ")
      const firstName = nameParts[0] || ""
      const lastName = nameParts.slice(1).join(" ") || ""
      
      // Parse phone number (remove country code if present)
      const phone = profileData.phone?.replace(/^\+\d{1,3}\s?/, "") || ""
      
      setShippingInfo({
        firstName,
        lastName,
        phone,
        address: profileData.address || "",
        city: profileData.city || "",
        state: profileData.state || "",
        zipCode: profileData.zip_code || "",
        country: profileData.country || "United States"
      })
    } else {
      // Reset to empty form
      setShippingInfo({
        firstName: "",
        lastName: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "United States"
      })
    }
  }

     const handleCheckout = async () => {
     setIsProcessing(true)
     
     try {
       // Check if Stripe is properly configured
       if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 
           !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.startsWith('pk_')) {
         throw new Error('Stripe is not properly configured. Please check your environment variables.')
       }
       
               // Validate required fields
        if (!shippingInfo.firstName || !shippingInfo.lastName || 
            !shippingInfo.phone || !shippingInfo.address || !shippingInfo.city || 
            !shippingInfo.state || !shippingInfo.zipCode) {
          throw new Error('Please fill in all required shipping information')
        }

       // Debug: Log the data being sent
       console.log('Cart items:', state.items)
       console.log('Shipping info:', shippingInfo)

       // Store cart items and shipping info in localStorage for order saving
       localStorage.setItem('cartItems', JSON.stringify(state.items))
       localStorage.setItem('shippingInfo', JSON.stringify(shippingInfo))

       // Create checkout session with all cart items
       const response = await fetch('/api/create-checkout-session', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
           items: state.items,
           shippingInfo,
         }),
       })

       if (!response.ok) {
         const errorData = await response.json().catch(() => ({}))
         console.error('Server error response:', errorData)
         throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`)
       }

       const { sessionId } = await response.json()

       if (!sessionId) {
         throw new Error('No session ID received from server')
       }

       // Redirect to Stripe checkout
       const stripe = await stripePromise
       if (stripe) {
         console.log('Stripe loaded successfully, redirecting to checkout...')
         const { error } = await stripe.redirectToCheckout({ sessionId })
         if (error) {
           console.error('Stripe redirect error:', error)
           throw new Error(`Stripe error: ${error.message}`)
         }
       } else {
         console.error('Stripe failed to load')
         throw new Error('Stripe failed to load')
       }
     } catch (error) {
       console.error('Checkout error:', error)
       const errorMessage = error instanceof Error ? error.message : 'Something went wrong. Please try again.'
       alert(`Checkout Error: ${errorMessage}`)
     } finally {
       setIsProcessing(false)
     }
   }

           // Show loading state while checking authentication
    if (loading) {
      return (
        <div className="min-h-screen gradient-bg-variant-a py-12 mt-16">
          <div className="max-w-2xl mx-auto px-4 text-center">
                       <div className="relative mb-8 pt-16">
              <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-3xl"></div>
              <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-orange-500 mx-auto relative z-10"></div>
            </div>
           <h1 className="text-2xl font-bold text-white mb-4">Loading...</h1>
           <p className="text-gray-300">Please wait while we prepare your checkout experience</p>
         </div>
       </div>
     )
   }

                       // Check if user is authenticated
     if (!user) {
       return (
         <div className="min-h-screen gradient-bg-variant-a py-12 mt-16">
           <div className="max-w-2xl mx-auto px-4 text-center">
                       <div className="relative mb-8 pt-24">
              <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-3xl"></div>
              <Lock className="w-20 h-20 text-orange-500 mx-auto relative z-10" />
            </div>
           <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
             Authentication Required
           </h1>
           <p className="text-gray-300 text-lg mb-8 leading-relaxed max-w-lg mx-auto">
             Please log in or create an account to complete your purchase and access exclusive member benefits.
           </p>
                       <div className="space-y-6">
              <Button 
                onClick={() => setShowAuthModal(true)}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-10 py-4 text-lg font-semibold shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105"
              >
                <User className="w-5 h-5 mr-2" />
                Login / Register
              </Button>
                             <div className="pt-4">
                                                                       <Button 
                                      variant="outline" 
                                      onClick={() => {
                                        router.push('/services?scrollTo=products');
                                        // Force scroll to products section after navigation
                                        setTimeout(() => {
                                          const productsSection = document.getElementById('products');
                                          if (productsSection) {
                                            productsSection.scrollIntoView({ behavior: 'smooth' });
                                          }
                                        }, 1000);
                                      }}
                                      className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-orange-500 transition-all duration-300 px-8 py-3"
                                    >
                                      <ShoppingCart className="w-5 h-5 mr-2" />
                                      Continue Shopping
                                    </Button>
               </div>
            </div>
         </div>
         
         <AuthModal 
           isOpen={showAuthModal} 
           onClose={() => setShowAuthModal(false)} 
           redirectTo={pathname}
         />
       </div>
     )
   }

                                                                                               if (state.items.length === 0) {
           return (
                           <div className="min-h-screen gradient-bg-variant-a py-12 mt-8">
           <div className="max-w-2xl mx-auto px-4 text-center">
                       <div className="relative mb-8 pt-16">
              <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-3xl"></div>
              <ShoppingCart className="w-20 h-20 text-orange-500 mx-auto relative z-10" />
            </div>
           <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
             Your Cart is Empty
           </h1>
           <p className="text-gray-300 text-lg mb-8 leading-relaxed max-w-lg mx-auto">
             Start building your fitness journey by adding some amazing products to your cart.
           </p>
           <div className="space-y-6">
                                                       <Button 
                              onClick={() => {
                                router.push('/services?scrollTo=products');
                                // Force scroll to products section after navigation
                                setTimeout(() => {
                                  const productsSection = document.getElementById('products');
                                  if (productsSection) {
                                    productsSection.scrollIntoView({ behavior: 'smooth' });
                                  }
                                }, 1000);
                              }}
                              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-10 py-4 text-lg font-semibold shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105"
                            >
                              <ShoppingCart className="w-5 h-5 mr-2" />
                              Start Shopping
                            </Button>
           </div>
           
           
         </div>
       </div>
     )
   }

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               return (
                               <div className="min-h-screen gradient-bg-variant-a pt-16 pb-16 mt-16">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                           {/* Header */}
             <div className="mb-16 text-center pt-8">
           <Link href="/services" className="inline-flex items-center text-orange-500 hover:text-orange-400 mb-8 transition-all duration-300 hover:scale-105 group">
             <div className="p-2 bg-orange-500/10 rounded-full mr-3 group-hover:bg-orange-500/20 transition-colors">
               <ArrowLeft className="w-5 h-5" />
             </div>
             Back to Services
           </Link>
           <div className="relative mb-8">
             <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-3xl"></div>
             <h1 className="text-5xl md:text-6xl font-bold text-white relative z-10 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
               Checkout
             </h1>
           </div>
           <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
             Complete your purchase and get ready to transform your fitness journey with premium products and expert guidance
           </p>
           
           {/* Progress indicator */}
           <div className="mt-12 flex justify-center">
             <div className="flex items-center space-x-4">
               <div className={`flex items-center ${step === 'cart' ? 'text-orange-500' : 'text-gray-500'}`}>
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                   step === 'cart' ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-400'
                 }`}>
                   1
                 </div>
                 <span className="ml-2 font-medium">Cart Review</span>
               </div>
               <div className="w-16 h-0.5 bg-gray-700"></div>
               <div className={`flex items-center ${step === 'shipping' ? 'text-orange-500' : 'text-gray-500'}`}>
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                   step === 'shipping' ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-400'
                 }`}>
                   2
                 </div>
                 <span className="ml-2 font-medium">Shipping</span>
               </div>
               <div className="w-16 h-0.5 bg-gray-700"></div>
               <div className={`flex items-center ${step === 'payment' ? 'text-orange-500' : 'text-gray-500'}`}>
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                   step === 'payment' ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-400'
                 }`}>
                   3
                 </div>
                 <span className="ml-2 font-medium">Payment</span>
               </div>
             </div>
           </div>
         </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
                                     {/* Cart Review */}
             {step === 'cart' && (
               <Card className="bg-gray-900/80 border-gray-700 shadow-2xl backdrop-blur-sm animate-in slide-in-from-bottom-4 duration-500">
                 <CardHeader className="pb-6">
                   <CardTitle className="flex items-center gap-3 text-white text-2xl">
                     <div className="p-3 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-xl">
                       <ShoppingCart className="w-7 h-7 text-orange-500" />
                     </div>
                     Cart Review
                   </CardTitle>
                   <p className="text-gray-300 text-lg">Review your selected products before proceeding to checkout</p>
                 </CardHeader>
                 <CardContent>
                   <div className="space-y-6">
                     {state.items.map((item, index) => (
                       <div 
                         key={item.id} 
                         className="flex gap-6 p-6 border border-gray-700 rounded-xl bg-gradient-to-r from-gray-800/50 to-gray-800/30 hover:from-gray-800 hover:to-gray-700 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 transform hover:scale-[1.02]"
                         style={{ animationDelay: `${index * 100}ms` }}
                       >
                         <div className="relative w-28 h-28 flex-shrink-0">
                           <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent rounded-xl"></div>
                           <Image
                             src={
                               item.name.includes("All Levels Knot Roller") 
                                 ? "/roller/roller7.jpg"
                                 : item.name.includes("Body Tension Reset Course")
                                 ? "/gymTools.jpg"
                                 : item.name.includes("Complete Bundle")
                                 ? "/roller/roller12.jpg"
                                 : item.image
                             }
                             alt={item.name}
                             fill
                             className="object-cover rounded-xl shadow-2xl"
                           />
                         </div>
                         <div className="flex-1 min-w-0">
                           <h3 className="font-bold text-white text-xl mb-3">{item.name}</h3>
                           <p className="text-gray-300 mb-4 line-clamp-2 leading-relaxed">{item.description}</p>
                           <div className="flex items-center justify-between">
                             <div className="flex items-center gap-2">
                               <span className="text-sm text-gray-400">Price:</span>
                               <p className="text-xl font-bold text-orange-500">
                                 {formatPrice(item.price)} × {item.quantity}
                               </p>
                             </div>
                             <div className="text-right">
                               <p className="text-2xl font-bold text-white">
                                 {formatPrice(item.price * item.quantity)}
                               </p>
                               <p className="text-sm text-gray-400">Total</p>
                             </div>
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>
                   
                   {/* Cart summary */}
                   <div className="mt-8 p-6 bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-xl">
                     <div className="flex justify-between items-center mb-4">
                       <span className="text-lg font-semibold text-white">Cart Total:</span>
                       <span className="text-2xl font-bold text-orange-500">{formatPrice(getTotalPrice())}</span>
                     </div>
                     <p className="text-orange-300 text-sm text-center">Ready to proceed with your purchase?</p>
                   </div>
                   
                                       <div className="mt-8 pt-6 border-t border-gray-700">
                      <Button 
                        onClick={() => handleStepChange('shipping')}
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-5 text-lg font-semibold shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-[1.02]"
                      >
                        Continue to Shipping
                        <ArrowLeft className="w-6 h-6 ml-3 rotate-180" />
                      </Button>
                    </div>
                 </CardContent>
               </Card>
             )}

            {/* Shipping Information */}
            {step === 'shipping' && (
              <Card className="bg-gray-900 border-gray-700 shadow-2xl">
                <CardHeader className="pb-6">
                                     <CardTitle className="flex items-center gap-3 text-white text-2xl">
                     <div className="p-2 bg-orange-500/20 rounded-lg">
                       <Truck className="w-6 h-6 text-orange-500" />
                     </div>
                     Shipping Information
                   </CardTitle>
                   <p className="text-gray-400">
                     Please provide your shipping details to receive your products. 
                     <span className="text-orange-400"> Your email ({user?.email}) will be automatically included.</span>
                   </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleShippingSubmit} className="space-y-6">
                    {/* Use Profile Information Option */}
                    {profileData && (profileData.address || profileData.city || profileData.state) && (
                      <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/20 p-6 rounded-xl">
                        <div className="flex items-start gap-4">
                          <Checkbox
                            id="useProfileInfo"
                            checked={useProfileInfo}
                            onCheckedChange={handleUseProfileInfo}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <Label htmlFor="useProfileInfo" className="text-orange-300 font-semibold cursor-pointer">
                              Use my profile information
                            </Label>
                            <p className="text-gray-300 text-sm mt-1">
                              Use the address and contact information from your profile
                            </p>
                            {useProfileInfo && (
                              <div className="mt-3 p-3 bg-white/5 rounded-lg">
                                <div className="text-white text-sm">
                                  <div className="font-medium">{profileData.full_name}</div>
                                  <div className="text-gray-300">
                                    {profileData.address && <div>{profileData.address}</div>}
                                    {profileData.city && profileData.state && (
                                      <div>{profileData.city}, {profileData.state} {profileData.zip_code}</div>
                                    )}
                                    {profileData.country && <div>{profileData.country}</div>}
                                    {profileData.phone && <div className="mt-1">{profileData.phone}</div>}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Manual Entry Form */}
                    <div className={`space-y-6 ${useProfileInfo ? 'opacity-50 pointer-events-none' : ''}`}>
                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                         <Label htmlFor="firstName" className="text-white font-medium">First Name</Label>
                         <Input
                           id="firstName"
                           value={shippingInfo.firstName}
                           onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                           required
                           className="bg-gray-800 border-gray-600 text-white h-12 px-4 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                           placeholder="Enter your first name"
                         />
                       </div>
                       <div className="space-y-2">
                         <Label htmlFor="lastName" className="text-white font-medium">Last Name</Label>
                         <Input
                           id="lastName"
                           value={shippingInfo.lastName}
                           onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                           required
                           className="bg-gray-800 border-gray-600 text-white h-12 px-4 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                           placeholder="Enter your last name"
                         />
                       </div>
                     </div>
                     
                     
                    
                                         <div className="space-y-2">
                       <Label htmlFor="phone" className="text-white font-medium">Phone</Label>
                       <Input
                         id="phone"
                         type="tel"
                         value={shippingInfo.phone}
                         onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                         required
                         className="bg-gray-800 border-gray-600 text-white h-12 px-4 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                         placeholder="Enter your phone number"
                       />
                     </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-white font-medium">Address</Label>
                      <Input
                        id="address"
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                        required
                        className="bg-gray-800 border-gray-600 text-white h-12 px-4 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                        placeholder="Enter your street address"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-white font-medium">City</Label>
                        <Input
                          id="city"
                          value={shippingInfo.city}
                          onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                          required
                          className="bg-gray-800 border-gray-600 text-white h-12 px-4 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                          placeholder="Enter city"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state" className="text-white font-medium">State</Label>
                        <Input
                          id="state"
                          value={shippingInfo.state}
                          onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                          required
                          className="bg-gray-800 border-gray-600 text-white h-12 px-4 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                          placeholder="Enter state"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode" className="text-white font-medium">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          value={shippingInfo.zipCode}
                          onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                          required
                          className="bg-gray-800 border-gray-600 text-white h-12 px-4 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                          placeholder="Enter ZIP code"
                        />
                      </div>
                    </div>

                    </div>

                    {/* Profile Information Note */}
                    {!profileData || (!profileData.address && !profileData.city && !profileData.state) && (
                      <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                        <p className="text-blue-300 text-sm">
                          💡 <strong>Tip:</strong> You can save time by adding your address information to your profile. 
                          <Link href="/dashboard/profile" className="text-blue-400 hover:text-blue-300 underline ml-1">
                            Update your profile
                          </Link> to use it for future purchases.
                        </p>
                      </div>
                    )}

                    <div className="flex gap-4 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleStepChange('cart')}
                        className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                      >
                        Back to Cart
                      </Button>
                      <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white">
                        Continue to Payment
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Payment */}
            {step === 'payment' && (
              <Card className="bg-gray-900 border-gray-700 shadow-2xl">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-white text-2xl">
                    <div className="p-2 bg-orange-500/20 rounded-lg">
                      <CreditCard className="w-6 h-6 text-orange-500" />
                    </div>
                    Payment
                  </CardTitle>
                  <p className="text-gray-400">Secure payment processing through Stripe</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                                         <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/20 p-6 rounded-xl">
                       <div className="flex items-start gap-4">
                         <div className="p-2 bg-orange-500/20 rounded-lg">
                           <CreditCard className="w-5 h-5 text-orange-500" />
                         </div>
                         <div>
                           <h4 className="text-orange-300 font-semibold mb-2">Secure Payment Processing</h4>
                           <p className="text-gray-300 text-sm leading-relaxed">
                             You'll be redirected to Stripe's secure payment page to complete your purchase. 
                             Your payment information is encrypted and secure.
                           </p>
                         </div>
                       </div>
                     </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        variant="outline"
                        onClick={() => handleStepChange('shipping')}
                        className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white py-3 px-6 transition-all duration-200"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Shipping
                      </Button>
                      <Button
                        onClick={handleCheckout}
                        disabled={isProcessing}
                        className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-8 text-lg font-semibold shadow-lg hover:shadow-orange-500/25 transition-all duration-200 flex-1"
                      >
                        {isProcessing ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            Proceed to Payment
                            <CreditCard className="w-5 h-5 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

                     {/* Order Summary Sidebar */}
           <div className="lg:col-span-1">
             <Card className="sticky top-8 bg-gray-900/80 border-gray-700 shadow-2xl backdrop-blur-sm">
               <CardHeader className="pb-6">
                 <CardTitle className="text-white text-xl flex items-center gap-3">
                   <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full animate-pulse"></div>
                   Order Summary
                 </CardTitle>
                 <p className="text-gray-300 text-sm">Review your order details and total</p>
               </CardHeader>
               <CardContent>
                 <div className="space-y-4">
                   {state.items.map((item, index) => (
                     <div 
                       key={item.id} 
                       className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-800/50 to-gray-800/30 rounded-xl border border-gray-700/50 hover:border-orange-500/30 transition-all duration-300"
                       style={{ animationDelay: `${index * 100}ms` }}
                     >
                       <div className="flex-1 min-w-0">
                         <p className="text-sm text-white font-semibold truncate mb-1">{item.name}</p>
                         <p className="text-xs text-gray-400">Quantity: {item.quantity}</p>
                       </div>
                       <span className="text-sm font-bold text-white ml-3">{formatPrice(item.price * item.quantity)}</span>
                     </div>
                   ))}
                   
                   <div className="border-t border-gray-700 pt-6 space-y-4">
                     <div className="flex justify-between text-sm text-gray-300">
                       <span className="font-medium">Subtotal</span>
                       <span className="font-semibold">{formatPrice(getTotalPrice())}</span>
                     </div>
                     <div className="flex justify-between text-sm text-gray-300">
                       <span className="font-medium">Shipping</span>
                       <span className="text-green-400 font-bold">Free</span>
                     </div>
                     <div className="flex justify-between text-xl font-bold border-t border-gray-700 pt-4 text-white">
                       <span>Total</span>
                       <span className="text-2xl text-orange-500">{formatPrice(getTotalPrice())}</span>
                     </div>
                   </div>
                   
                   <div className="mt-6 p-4 bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-xl">
                     <div className="flex items-center justify-center gap-2 mb-2">
                       <Truck className="w-4 h-4 text-orange-500" />
                       <p className="text-orange-300 text-sm font-medium text-center">
                         Free standard shipping on all US orders
                       </p>
                     </div>
                     <p className="text-orange-200 text-xs text-center">Estimated delivery: 3-5 business days</p>
                   </div>
                   
                   {/* Security badge */}
                   <div className="mt-4 p-3 bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20 rounded-lg">
                     <div className="flex items-center justify-center gap-2">
                       <CheckCircle className="w-4 h-4 text-green-500" />
                       <p className="text-green-300 text-xs font-medium">Secure Checkout</p>
                     </div>
                   </div>
                 </div>
               </CardContent>
             </Card>
           </div>
                 </div>
       </div>
       
       {/* Auth Modal for checkout process */}
       <AuthModal 
         isOpen={showAuthModal} 
         onClose={() => setShowAuthModal(false)} 
         redirectTo={pathname}
       />
     </div>
   )
 }