"use client"

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, ArrowRight, Crown, Calendar, Clock } from 'lucide-react'
import Link from 'next/link'
import { ErrorBoundary } from '@/components/error-boundary'

function SubscriptionSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // All state declarations must come before any early returns to follow Rules of Hooks
  const [isLoading, setIsLoading] = useState(true)
  const [sessionData, setSessionData] = useState<any>(null)
  const [hasRefreshed, setHasRefreshed] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  // Simple hydration check
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Don't render until hydrated to prevent SSR issues
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  const sessionId = searchParams.get('session_id')

  // Separate effect for timeout
  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log('⏰ Loading timeout reached, stopping loading')
      setIsLoading(false)
    }, 5000)
    
    return () => clearTimeout(timeout)
  }, []) // Only run once on mount

  // Separate effect for session data fetching
  useEffect(() => {
    console.log('🔍 Subscription Success Page Debug:')
    console.log('- sessionId:', sessionId)
    console.log('- isHydrated:', isHydrated)
    console.log('- hasRefreshed:', hasRefreshed)
    
    // Only run if we have sessionId and haven't fetched yet
    if (!sessionId || hasRefreshed) {
      if (!sessionId) {
        console.log('⚠️ Missing sessionId, skipping data fetch')
        setIsLoading(false)
      }
      return
    }
    
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
        console.log('🔄 Session data fetch completed')
        setIsLoading(false)
      })
  }, [sessionId, hasRefreshed]) // Only depend on sessionId and hasRefreshed

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-white mb-4">Processing your subscription...</h1>
          <p className="text-gray-300 mb-6">This may take a few moments</p>
          <Button 
            onClick={() => {
              console.log('🔄 User manually stopped loading')
              setIsLoading(false)
            }}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Continue Anyway
          </Button>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500/10 via-yellow-500/5 to-orange-600/10">
      {/* Navigation */}
      <nav className="bg-black/50 backdrop-blur-sm border-b border-orange-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">VA</span>
              </div>
              <span className="text-white font-bold text-xl">ALL LEVELS ATHLETICS</span>
            </Link>
            <Button asChild className="bg-orange-500 hover:bg-orange-600">
              <Link href="/dashboard">
                <ArrowRight className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-2xl mx-auto">
          
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-400" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Subscription Successful!
            </h1>
            <p className="text-xl text-gray-300">
              Your subscription has been successfully activated.
            </p>
          </div>

          {/* Subscription Details */}
          {sessionData && (
            <Card className="bg-gradient-to-br from-white/5 to-white/10 border-orange-500/30 backdrop-blur-sm mb-8">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-3">
                  <Crown className="w-6 h-6 text-orange-400" />
                  Subscription Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-orange-400 font-semibold mb-2">Plan</h4>
                    <p className="text-white text-lg">
                      {sessionData?.metadata?.planName || 'Processing...'}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-orange-400 font-semibold mb-2">Status</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-white">Active</span>
                    </div>
                  </div>
                </div>

                {sessionData?.subscription && (
                  <div>
                    <h4 className="text-orange-400 font-semibold mb-2">Next Billing Date</h4>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-orange-400" />
                      <span className="text-white">
                        {sessionData.subscription.current_period_end
                          ? formatDate(new Date(sessionData.subscription.current_period_end * 1000).toISOString())
                          : 'Processing...'}
                      </span>
                    </div>
                  </div>
                )}

                {!sessionData?.subscription && (
                  <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-400 font-semibold">Processing</span>
                    </div>
                    <p className="text-blue-300 text-sm mt-1">
                      Your subscription is being processed. You'll receive a confirmation email shortly.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Elite Bonus */}
          {(sessionData?.metadata?.planName === 'Elite' || sessionData?.metadata?.freeMFRoller === 'true') && (
            <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30 backdrop-blur-sm mb-8">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-3">
                  <Crown className="w-6 h-6 text-yellow-400" />
                  Elite Bonus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-6">
                  <h4 className="font-semibold text-yellow-400 mb-4 text-lg flex items-center gap-2">
                    <Crown className="w-5 h-5" />
                    FREE MFRoller Included!
                  </h4>
                  <p className="text-white/90 mb-4">
                    Professional myofascial release tool - FREE bonus with your Elite subscription!
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                      <img
                        src="/roller/roller7.jpg"
                        alt="MFRoller"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h5 className="font-semibold text-white">MFRoller</h5>
                      <p className="text-white/70 text-sm">Professional Grade</p>
                      <p className="text-green-400 text-sm font-semibold">FREE!</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3">
              <Link href="/dashboard">
                <ArrowRight className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-3">
              <Link href="/">
                Back to Home
              </Link>
            </Button>
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