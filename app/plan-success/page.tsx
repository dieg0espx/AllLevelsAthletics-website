"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Trophy, Home, User, Mail, Calendar, Star, Award } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

export default function PlanSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [isLoading, setIsLoading] = useState(true)
  const [orderSaved, setOrderSaved] = useState(false)
  const [orderSaveAttempted, setOrderSaveAttempted] = useState(false)
  const [planData, setPlanData] = useState<any>({})
  const { user, userRole } = useAuth()

  useEffect(() => {
    // Simulate loading for better UX
    const timer = setTimeout(() => setIsLoading(false), 2000)
    
    // Load plan data from localStorage
    const storedPlanData = JSON.parse(localStorage.getItem('planData') || '{}')
    setPlanData(storedPlanData)
    
    // Save plan purchase to user account if we have session ID and user
    if (sessionId && user) {
      savePlanPurchaseToAccount()
    }
    
    return () => clearTimeout(timer)
  }, [sessionId, user])

  const savePlanPurchaseToAccount = async () => {
    // Prevent duplicate calls
    if (orderSaveAttempted) {
      console.log('🔄 Plan purchase save already attempted, skipping...')
      return
    }
    
    setOrderSaveAttempted(true)
    
    try {
      console.log('🔄 Starting to save plan purchase...')
      console.log('Session ID:', sessionId)
      console.log('User ID:', user?.id)
      console.log('User email:', user?.email)
      
      // Get plan data from localStorage
      const planData = JSON.parse(localStorage.getItem('planData') || '{}')
      
      console.log('📦 Plan data from localStorage:', planData)
      
      if (!planData.id) {
        console.log('❌ No plan data found in localStorage')
        return
      }

      const totalAmount = planData.price || 0
      console.log('💰 Total amount:', totalAmount)

      // Create order data for plan purchase
      const orderData = {
        sessionId,
        items: [planData], // Single plan as an item
        shippingInfo: {
          email: user?.email || '',
          firstName: user?.user_metadata?.first_name || '',
          lastName: user?.user_metadata?.last_name || '',
          // No physical shipping needed for digital plans
          address: 'Digital Plan - No Shipping Required',
          city: 'Digital',
          state: 'Digital',
          zipCode: '00000',
          country: 'Digital',
          phone: user?.user_metadata?.phone || ''
        },
        userId: user?.id,
        totalAmount
      }
      console.log('📤 Sending plan purchase data to API:', orderData)

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
        const result = await response.json()
        console.log('✅ Plan purchase saved successfully:', result)
        setOrderSaved(true)
        
        // Clear localStorage after successful save
        localStorage.removeItem('planData')
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('❌ Failed to save plan purchase:', errorData)
      }
    } catch (error) {
      console.error('❌ Error saving plan purchase:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500/10 via-yellow-500/5 to-orange-600/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Processing your plan purchase...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500/10 via-yellow-500/5 to-orange-600/10">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Plan Purchase Successful!
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Welcome to your new training plan! You're now ready to start your fitness journey with professional guidance.
            </p>
          </div>

          {/* Plan Details Card */}
          <Card className="mb-8 border-2 border-green-500/20 bg-green-50/50">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-3 text-2xl">
                <Trophy className="w-8 h-8 text-orange-500" />
                {planData.name || 'Training Plan'}
              </CardTitle>
              <CardDescription className="text-lg">
                {planData.description || 'Professional training plan'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Plan Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Award className="w-5 h-5 text-orange-500" />
                    Plan Details
                  </h3>
                  <div className="space-y-2 text-muted-foreground">
                    <p><strong>Plan:</strong> {planData.name}</p>
                    <p><strong>Price:</strong> ${planData.price}</p>
                    <p><strong>Type:</strong> Digital Training Plan</p>
                    <p><strong>Access:</strong> Immediate</p>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Star className="w-5 h-5 text-orange-500" />
                    What's Next?
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">1</span>
                      </div>
                      <p className="text-sm">Check your email for plan details and access instructions</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">2</span>
                      </div>
                      <p className="text-sm">Access your personalized training dashboard</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">3</span>
                      </div>
                      <p className="text-sm">Start your fitness journey with expert guidance</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Status */}
              <div className="bg-white/50 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-orange-500" />
                    <span className="font-medium">Confirmation Email</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {orderSaved ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-green-600 text-sm">Sent</span>
                      </>
                    ) : (
                      <>
                        <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-orange-600 text-sm">Sending...</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="gradient-orange-yellow text_black font-bold hover:scale-105 transition-all">
              <Link href={(userRole === 'admin' || user?.user_metadata?.role === 'admin') ? '/admin' : '/dashboard'}>
                <User className="w-5 h-5 mr-2" />
                Go to Dashboard
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="hover:scale-105 transition-all">
              <Link href="/services">
                <Trophy className="w-5 h-5 mr-2" />
                View All Plans
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link href="/">
                <Home className="w-5 h-5 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <Card className="bg-white/50 border-orange-200">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-3">Need Help?</h3>
                <p className="text-muted-foreground mb-4">
                  If you have any questions about your training plan or need assistance getting started, 
                  don't hesitate to reach out to our support team.
                </p>
                <Button asChild variant="outline">
                  <Link href="/contact">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Support
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
