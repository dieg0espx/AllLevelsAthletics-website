"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { useSubscription } from '@/contexts/subscription-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, ArrowRight, Crown, Calendar } from 'lucide-react'
import Link from 'next/link'

export default function SubscriptionSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { refreshSubscription, subscription, loading } = useSubscription()
  const [isLoading, setIsLoading] = useState(true)
  const [sessionData, setSessionData] = useState<any>(null)

  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    if (sessionId && user) {
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
          // Only refresh subscription data if we don't already have it
          if (!subscription) {
            refreshSubscription().finally(() => {
              setIsLoading(false)
            })
          } else {
            setIsLoading(false)
          }
        })
    } else {
      setIsLoading(false)
    }

    // Fallback timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      setIsLoading(false)
    }, 10000) // 10 seconds timeout

    return () => clearTimeout(timeout)
  }, [sessionId, user, refreshSubscription, subscription])

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
              <Link href="/dashboard">
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
