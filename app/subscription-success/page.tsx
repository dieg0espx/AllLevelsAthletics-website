"use client"

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSafeAuth } from '@/contexts/safe-auth-context'
import { useSafeSubscription } from '@/contexts/safe-subscription-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, ArrowRight, Crown, Calendar, Clock } from 'lucide-react'
import Link from 'next/link'
import { ErrorBoundary } from '@/components/error-boundary'

// Client-side only debug component to prevent hydration mismatch
function DebugInfo({ sessionId, user, isHydrated, hasRefreshed, isLoading, loading, error, sessionData, subscription }: any) {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Only render in development and after mounting
  if (!mounted) return null
  if (process.env.NODE_ENV !== 'development') return null
  
  return (
    <Card className="bg-gray-800 border-gray-600 mb-6">
      <CardHeader>
        <CardTitle className="text-sm text-gray-300">Debug Info</CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-gray-400">
        <div>Session ID: {sessionId || 'None'}</div>
        <div>User ID: {user?.id || 'None'}</div>
        <div>Is Hydrated: {isHydrated ? 'Yes' : 'No'}</div>
        <div>Has Refreshed: {hasRefreshed ? 'Yes' : 'No'}</div>
        <div>Is Loading: {isLoading ? 'Yes' : 'No'}</div>
        <div>Loading State: {loading ? 'Yes' : 'No'}</div>
        <div>Error: {error || 'None'}</div>
        <div>Session Data: {sessionData ? 'Loaded' : 'Not loaded'}</div>
        <div>Subscription: {subscription ? `${subscription.plan_name} (${subscription.status})` : 'None'}</div>
      </CardContent>
    </Card>
  )
}

function SubscriptionSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, userRole, isHydrated } = useSafeAuth()
  const { refreshSubscription, subscription, loading } = useSafeSubscription()

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
  const [error, setError] = useState<string | null>(null)

  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    console.log('🔍 Subscription Success Page Debug:')
    console.log('- sessionId:', sessionId)
    console.log('- user:', user?.id)
    console.log('- isHydrated:', isHydrated)
    console.log('- hasRefreshed:', hasRefreshed)
    
    // Only run once when component mounts with sessionId and user
    if (sessionId && user && !hasRefreshed) {
      setHasRefreshed(true)
      console.log('🔄 Starting session data fetch...')
      
      // First, try to get session data from Stripe
      fetch(`/api/get-checkout-session?session_id=${sessionId}`)
        .then(res => {
          console.log('📡 Session fetch response:', res.status, res.statusText)
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
          }
          return res.json()
        })
        .then(data => {
          console.log('📦 Session data received:', data)
          if (data.error) {
            // Handle specific error cases
            if (data.code === 'SESSION_NOT_FOUND') {
              console.log('⚠️ Session not found - may be expired or invalid')
              setError('This checkout session has expired or is invalid. Please contact support if you completed a payment.')
            } else if (data.code === 'STRIPE_CONFIG_ERROR') {
              console.log('❌ Stripe configuration error')
              setError('Payment system configuration error. Please contact support.')
            } else {
              throw new Error(data.error)
            }
          } else if (data.session) {
            setSessionData(data.session)
            console.log('✅ Session data set successfully')
          }
        })
        .catch(err => {
          console.error('❌ Error fetching session:', err)
          setError(`Failed to load session data: ${err.message}`)
        })
        .finally(() => {
          console.log('🔄 Refreshing subscription data...')
          // Refresh subscription data from Stripe
          refreshSubscription().catch(err => {
            console.error('❌ Error refreshing subscription:', err)
            setError(`Failed to refresh subscription: ${err.message}`)
          }).finally(() => {
            console.log('✅ Subscription refresh completed')
            setIsLoading(false)
          })
        })
    } else if (!sessionId || !user) {
      console.log('⚠️ Missing sessionId or user, skipping data fetch')
      setIsLoading(false)
    }

    // Fallback timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.log('⏰ Timeout reached, stopping loading')
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

  // Show error state if there's an error
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-red-400 text-2xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Something went wrong</h1>
          <p className="text-gray-300 mb-6">{error}</p>
          <div className="space-y-4">
            <Button 
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.reload()
                }
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3"
            >
              Try Again
            </Button>
            <Button 
              asChild
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <Link href="/dashboard">
                Go to Dashboard
              </Link>
            </Button>
          </div>
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
            } else {
              console.warn('Elite coupon not available:', data.error)
            }
          } else {
            console.warn('Failed to fetch Elite coupon:', response.status)
          }
        } catch (error) {
          console.error('Error fetching Elite coupon:', error)
          // Don't set error state for coupon fetch failure as it's not critical
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
          
          {/* Debug Info - Only in development */}
          {process.env.NODE_ENV === 'development' && (
            <DebugInfo 
              sessionId={sessionId}
              user={user}
              isHydrated={isHydrated}
              hasRefreshed={hasRefreshed}
              isLoading={isLoading}
              loading={loading}
              error={error}
              sessionData={sessionData}
              subscription={subscription}
            />
          )}
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
    <ErrorBoundary>
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
    </ErrorBoundary>
  )
}
