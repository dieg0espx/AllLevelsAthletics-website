"use client"

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSafeAuth } from '@/contexts/safe-auth-context'
import { useSubscription } from '@/contexts/subscription-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, ArrowRight, Crown, Calendar, Clock } from 'lucide-react'
import Link from 'next/link'

function SubscriptionSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, userRole, isHydrated } = useSafeAuth()
  const { refreshSubscription, subscription, loading } = useSubscription()

  // Don't render until hydrated to prevent SSR issues
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }
  const [isLoading, setIsLoading] = useState(true)
  const [sessionData, setSessionData] = useState<any>(null)
  const [hasRefreshed, setHasRefreshed] = useState(false)
  const [autoRedirectCountdown, setAutoRedirectCountdown] = useState<number | null>(null)
  const [eliteCoupon, setEliteCoupon] = useState<any>(null)

  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    // Only run once when component mounts with sessionId and user
    if (sessionId && user && !hasRefreshed) {
      setHasRefreshed(true)
      
      // First, try to get session data from Stripe
      fetch(`/api/get-checkout-session?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          if (data.session) {
            setSessionData(data.session)
          }
        })
        .catch(err => console.error('Error fetching session:', err))
        .finally(() => {
          // Refresh subscription data from Stripe
          refreshSubscription().finally(() => {
            setIsLoading(false)
          })
        })
    } else if (!sessionId || !user) {
      setIsLoading(false)
    }

    // Fallback timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      setIsLoading(false)
    }, 10000) // 10 seconds timeout

    return () => clearTimeout(timeout)
  }, [sessionId, user])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-white">Processing your subscription...</h1>
        </div>
      </div>
    )
  }

  const dashboardHref = (userRole === 'admin' || user?.user_metadata?.role === 'admin') ? '/admin' : '/dashboard'

  // Fetch Elite coupon if user has Elite subscription
  useEffect(() => {
    const fetchEliteCoupon = async () => {
      const isEliteCustomer = subscription?.plan_name === 'Elite' || sessionData?.metadata?.planName === 'Elite' || sessionData?.metadata?.freeMFRoller === 'true'
      
      if (isEliteCustomer && user?.id && !isLoading && !loading) {
        try {
          const response = await fetch(`/api/get-elite-coupon?userId=${user.id}`)
          if (response.ok) {
            const data = await response.json()
            if (data.success) {
              setEliteCoupon(data.coupon)
            }
          }
        } catch (error) {
          console.error('Error fetching Elite coupon:', error)
        }
      }
    }

    fetchEliteCoupon()
  }, [subscription, sessionData, user, isLoading, loading])

  // Auto-redirect for Elite customers to claim their free MF roller
  useEffect(() => {
    const isEliteCustomer = subscription?.plan_name === 'Elite' || sessionData?.metadata?.planName === 'Elite' || sessionData?.metadata?.freeMFRoller === 'true'
    
    if (isEliteCustomer && !isLoading && !loading && autoRedirectCountdown === null) {
      // Start 5-second countdown only once
      setAutoRedirectCountdown(5)
    }
  }, [subscription?.plan_name, sessionData?.metadata?.planName, sessionData?.metadata?.freeMFRoller, isLoading, loading, autoRedirectCountdown])

  // Handle countdown timer
  useEffect(() => {
    if (autoRedirectCountdown && autoRedirectCountdown > 0) {
      const timer = setTimeout(() => {
        setAutoRedirectCountdown(prev => {
          if (prev && prev <= 1) {
            // Auto-redirect to checkout with free MF roller
            const mfRollerItem = {
              id: 'knot-roller',
              name: 'MFRoller',
              price: 0,
              quantity: 1,
              image: '/roller/roller7.jpg',
              description: 'Professional myofascial release tool - FREE bonus with your Elite subscription!'
            }
            // Only run on client side
            if (typeof window !== 'undefined') {
              localStorage.setItem('cartItems', JSON.stringify([mfRollerItem]))
              window.location.href = '/checkout'
            }
            return null
          }
          return prev ? prev - 1 : null
        })
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [autoRedirectCountdown])

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-400" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Welcome to All Levels Athletics!</h1>
            <p className="text-xl text-gray-300">
              Your subscription has been successfully activated.
            </p>
          </div>

          {/* Elite Coupon Display */}
          {(subscription?.plan_name === 'Elite' || sessionData?.metadata?.planName === 'Elite' || sessionData?.metadata?.freeMFRoller === 'true') && (
            <Card className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border-orange-500/30 mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-400">
                  <Crown className="h-5 w-5 text-orange-400" />
                  🎁 FREE MF Roller Coupon!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-orange-200 mb-4">
                    As an Elite subscriber, you get a FREE MFRoller (100% discount)!
                  </p>
                  <div className="bg-black/20 border border-orange-500/30 rounded-lg p-4 mb-4">
                    <p className="text-orange-300 text-sm mb-2">Your exclusive coupon code:</p>
                    <div className="bg-black text-orange-400 px-4 py-2 rounded font-mono text-lg font-bold border border-orange-500/50">
                      {eliteCoupon?.code || 'Loading...'}
                    </div>
                    <p className="text-orange-300 text-xs mt-2">
                      This coupon is tied to your email and can only be used once.
                    </p>
                    {eliteCoupon?.expiresAt && (
                      <p className="text-orange-300 text-xs mt-1">
                        Expires: {new Date(eliteCoupon.expiresAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <p className="text-orange-200 text-sm">
                    Use this code at checkout to get your FREE MFRoller - valid for 30 days!
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Subscription Details */}
          {(subscription || sessionData) && (
            <Card className="bg-gray-900 border-gray-800 mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Crown className="h-5 w-5 text-orange-400" />
                  Your Subscription
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Plan:</span>
                  <span className="font-semibold text-white">
                    {subscription?.plan_name || sessionData?.metadata?.planName || 'Processing...'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Status:</span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    subscription?.status === 'active' 
                      ? 'bg-green-500/20 text-green-400' 
                      : subscription?.status === 'trialing'
                      ? 'bg-blue-500/20 text-blue-400'
                      : sessionData?.payment_status === 'paid'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {subscription?.status === 'trialing' ? 'Trial' : 
                     subscription?.status === 'active' ? 'Active' :
                     subscription?.status || 
                     (sessionData?.payment_status === 'paid' ? 'Active' : 'Processing')}
                  </span>
                </div>

                {subscription?.trial_end && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Trial ends:</span>
                    <span className="text-white">{formatDate(subscription.trial_end)}</span>
                  </div>
                )}

                {(subscription?.current_period_end || sessionData?.subscription) && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Next billing:</span>
                    <span className="text-white">
                      {subscription?.current_period_end 
                        ? formatDate(subscription.current_period_end)
                        : sessionData?.subscription?.current_period_end
                        ? formatDate(new Date(sessionData.subscription.current_period_end * 1000).toISOString())
                        : 'Processing...'}
                    </span>
                  </div>
                )}

                {!subscription && sessionData && (
                  <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-blue-400 text-sm">
                      Your subscription is being processed. You'll receive a confirmation email shortly.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Free MF Roller Bonus for Elite Plan */}
          {(subscription?.plan_name === 'Elite' || sessionData?.metadata?.planName === 'Elite' || sessionData?.metadata?.freeMFRoller === 'true') && (
            <Card className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border-orange-500/30 mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-400">
                  <Crown className="h-5 w-5 text-orange-400" />
                  🎁 FREE BONUS: MFRoller Included!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <img 
                    src="/roller/roller7.jpg" 
                    alt="MFRoller" 
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-2">Professional MFRoller - FREE!</h3>
                    <p className="text-orange-200 text-sm mb-3">
                      As a thank you for choosing our Elite plan, you're getting a professional 
                      myofascial release tool absolutely free! This $99 value is yours at no extra cost.
                    </p>
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 mb-4">
                      <p className="text-orange-300 text-sm font-medium">
                        🎁 Your free MFRoller has been automatically added to your cart! 
                        {autoRedirectCountdown ? (
                          <span className="block mt-2 text-orange-400 font-bold">
                            Redirecting to checkout in {autoRedirectCountdown} seconds...
                          </span>
                        ) : (
                          <span className="block mt-2">You'll be redirected to checkout where the roller will be completely free.</span>
                        )}
                      </p>
                    </div>
                    <Button 
                      onClick={() => {
                        // Add MF roller to cart automatically
                        const mfRollerItem = {
                          id: 'knot-roller',
                          name: 'MFRoller',
                          price: 0, // Free for Elite customers
                          quantity: 1,
                          image: '/roller/roller7.jpg',
                          description: 'Professional myofascial release tool - FREE bonus with your Elite subscription!'
                        }
                        
                        // Only run on client side
                        if (typeof window !== 'undefined') {
                          // Store in localStorage for checkout
                          localStorage.setItem('cartItems', JSON.stringify([mfRollerItem]))
                          
                          // Redirect to checkout
                          window.location.href = '/checkout'
                        }
                      }}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-black font-bold"
                    >
                      {autoRedirectCountdown ? `Go to Checkout Now (${autoRedirectCountdown}s)` : 'Go to Checkout (Free MFRoller Added)'}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* What's Next */}
          <Card className="bg-gray-900 border-gray-800 mb-8">
            <CardHeader>
              <CardTitle className="text-white">What's Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-black">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Access Your Dashboard</h3>
                  <p className="text-gray-300 text-sm">
                    Visit your personalized dashboard to access your training programs and coaching resources.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-black">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Complete Your Profile</h3>
                  <p className="text-gray-300 text-sm">
                    Fill out your fitness profile so we can create a personalized training program for you.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-black">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Start Your Journey</h3>
                  <p className="text-gray-300 text-sm">
                    Begin your personalized training program and start working towards your fitness goals.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              asChild
              className="flex-1 bg-orange-500 hover:bg-orange-600"
            >
              <Link href={dashboardHref}>
                Go to Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            
            <Button 
              asChild
              variant="outline"
              className="flex-1 border-gray-600 text-white hover:bg-gray-800"
            >
              <Link href="/dashboard/profile#contact-info">
                Complete Profile
              </Link>
            </Button>
          </div>

          {/* Support */}
          <div className="text-center mt-8">
            <p className="text-gray-400 text-sm">
              Need help? Contact our support team at{' '}
              <a href="mailto:support@alllevelsathletics.com" className="text-orange-400 hover:underline">
                support@alllevelsathletics.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SubscriptionSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-orange-500/10 via-yellow-500/5 to-orange-600/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <SubscriptionSuccessContent />
    </Suspense>
  )
}
