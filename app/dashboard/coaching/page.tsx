"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProgressPanel } from "@/components/ProgressPanel"
import { 
  ArrowLeft,
  Users,
  Crown,
  CheckCircle,
  Clock,
  MessageSquare,
  Video,
  Target,
  Zap,
  Star,
  Calendar,
  TrendingUp
} from "lucide-react"

export default function CoachingPage() {
  const router = useRouter()
  const { user, signOut, loading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'progress'>('overview')
  const [subscriptionData, setSubscriptionData] = useState<any>(null)
  const [subscriptionLoading, setSubscriptionLoading] = useState(true)
  const [upgrading, setUpgrading] = useState<string | null>(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [upgradeDetails, setUpgradeDetails] = useState<any>(null)
  const [upgradeSuccess, setUpgradeSuccess] = useState<string | null>(null)

  // Plan features mapping
  const PLAN_FEATURES = {
    foundation: [
      "1x/month personalized check-ins",
      "Fully customized training program",
      "Email support & guidance",
      "Access to exercise library",
      "Nutrition guidelines"
    ],
    growth: [
      "2x/month detailed check-ins",
      "Form review & video feedback",
      "Progressive training adjustments",
      "Priority email support",
      "Meal planning assistance",
      "Recovery optimization"
    ],
    elite: [
      "Weekly personalized check-ins",
      "Complete tension reset coaching",
      "Advanced Mobility - Custom Range of Motion Plan",
      "All Day text support access",
      "Supplement recommendations"
    ]
  }

  // Default plan data - will be updated with real data from API
  const [currentPlan, setCurrentPlan] = useState({
    name: "Foundation",
    status: "active",
    startDate: "2024-01-01",
    nextCheckIn: "2024-02-01",
    features: PLAN_FEATURES.foundation,
    price: "$197/month"
  })

  const [upgradePlans] = useState([
    {
      id: 1,
      planId: "growth",
      name: "Growth",
      badge: "POPULAR",
      badgeColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      subtitle: "Ideal for committed individuals seeking faster results",
      monthlyPrice: 297,
      features: [
        "2x/month detailed check-ins",
        "Form review & video feedback",
        "Progressive training adjustments",
        "Priority email support",
        "Meal planning assistance",
        "Recovery optimization"
      ],
      popular: true
    },
    {
      id: 2,
      planId: "elite",
      name: "Elite",
      badge: "PREMIUM",
      badgeColor: "bg-orange-600/20 text-orange-300 border-orange-600/30",
      subtitle: "Maximum support for serious athletes and professionals",
      monthlyPrice: 497,
      features: [
        "Weekly personalized check-ins",
        "Complete tension reset coaching",
        "Advanced Mobility - Custom Range of Motion Plan",
        "All Day text support access",
        "Supplement recommendations"
      ],
      popular: false
    }
  ])

  useEffect(() => {
    // Wait for auth to finish loading before checking user
    if (authLoading) {
      return // Still loading auth, don't do anything
    }
    
    if (user === null) {
      // User is explicitly not authenticated, redirect
      router.push('/')
      return
    }
    
    if (user) {
      // User is authenticated, proceed
      const timer = setTimeout(() => setIsLoading(false), 1000)
      
      // Fetch subscription data and auto-schedule check-ins
      fetchSubscriptionData()
      scheduleCheckIns()
      
      return () => clearTimeout(timer)
    }
  }, [user, authLoading, router])

  // Check for upgrade success in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const upgradeParam = urlParams.get('upgrade')
    const planParam = urlParams.get('plan')
    const sessionId = urlParams.get('session_id')
    
    console.log('URL params:', { upgradeParam, planParam, sessionId })
    
    if (upgradeParam === 'success' && planParam) {
      console.log('Upgrade success detected, setting success state')
      setUpgradeSuccess(planParam)
      // Clean up URL
      window.history.replaceState({}, '', '/dashboard/coaching')
      // Refresh subscription data to show updated plan
      fetchSubscriptionData()
      
      // Also sync subscription data from Stripe
      setTimeout(async () => {
        try {
          const response = await fetch('/api/sync-subscription-after-upgrade', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user?.id })
          })
          
          if (response.ok) {
            console.log('Subscription synced successfully')
            // Refresh subscription data
            fetchSubscriptionData()
          } else {
            console.error('Failed to sync subscription')
            // Fallback to page reload
            window.location.reload()
          }
        } catch (error) {
          console.error('Error syncing subscription:', error)
          // Fallback to page reload
          window.location.reload()
        }
      }, 2000) // Wait 2 seconds to show success message first
    } else if (upgradeParam === 'cancelled') {
      console.log('Upgrade cancelled')
      // Clean up URL
      window.history.replaceState({}, '', '/dashboard/coaching')
    }
  }, [])

  const fetchSubscriptionData = async () => {
    if (!user?.id) return

    try {
      setSubscriptionLoading(true)
      const response = await fetch(`/api/user-subscription?userId=${user.id}`)
      
      if (response.ok) {
        const data = await response.json()
        setSubscriptionData(data)
        
        // Update current plan with real data if available
        if (data.subscription) {
          const subscription = data.subscription
          const planId = subscription.plan_id?.toLowerCase() || 'foundation'
          const features = PLAN_FEATURES[planId as keyof typeof PLAN_FEATURES] || PLAN_FEATURES.foundation
          
          setCurrentPlan(prev => ({
            ...prev,
            name: subscription.plan_name || prev.name,
            status: subscription.status || prev.status,
            startDate: subscription.created_at || prev.startDate,
            price: subscription.plan_price ? `$${subscription.plan_price}/month` : prev.price,
            features: features
          }))
        }
      } else {
        console.error('Failed to fetch subscription data')
      }
    } catch (error) {
      console.error('Error fetching subscription data:', error)
    } finally {
      setSubscriptionLoading(false)
    }
  }

  const scheduleCheckIns = async () => {
    if (!user?.id) return
    
    try {
      const response = await fetch('/api/coaching/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          planType: currentPlan.name
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('Check-ins scheduled:', data.message)
      }
    } catch (error) {
      console.error('Error scheduling check-ins:', error)
    }
  }

  const handleUpgrade = async (planId: string, planName: string) => {
    if (!user?.id) return

    try {
      setUpgrading(planId)
      
      const response = await fetch('/api/upgrade-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newPlanId: planId,
          userId: user.id
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        // Show upgrade details in custom modal
        setUpgradeDetails({
          planName,
          proratedAmount: data.proratedAmount,
          remainingDays: data.remainingDays,
          monthlyPrice: data.monthlyPrice,
          sessionUrl: data.sessionUrl
        })
        setShowUpgradeModal(true)
        setUpgrading(null)
      } else {
        const errorData = await response.json()
        console.error('Failed to start upgrade:', errorData.error)
        setUpgrading(null)
      }
    } catch (error) {
      console.error('Error upgrading plan:', error)
      setUpgrading(null)
    }
  }

  const confirmUpgrade = () => {
    if (upgradeDetails?.sessionUrl) {
      window.location.href = upgradeDetails.sessionUrl
    }
  }

  const cancelUpgrade = () => {
    setShowUpgradeModal(false)
    setUpgradeDetails(null)
  }






  const handleSignOut = async () => {
    await signOut()
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-white">Loading Coaching...</h1>
          <p className="text-white/70 mt-4">If this takes too long, try refreshing the page</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-orange-500 text-black rounded hover:bg-orange-600"
          >
            Refresh Page
          </button>
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
                variant="outline"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:border-orange-400/50 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-orange-400">1-on-1 Coaching</h1>
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

      {/* Upgrade Success Message */}
      {upgradeSuccess && (
        <div className="bg-green-500/10 border border-green-500/30 mx-4 mt-4 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <div>
              <h3 className="text-green-400 font-semibold">Upgrade Successful!</h3>
              <p className="text-white/90 text-sm">
                You've successfully upgraded to the {upgradeSuccess.charAt(0).toUpperCase() + upgradeSuccess.slice(1)} plan. 
                Your new features are now active!
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setUpgradeSuccess(null)}
              className="text-green-400 hover:text-green-300 ml-auto"
            >
              ×
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button - Prominent */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard')}
            className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:border-orange-400/50 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/5 p-1 rounded-lg border border-orange-500/30">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all duration-300 ${
                activeTab === 'overview'
                  ? 'bg-orange-500 text-black font-medium'
                  : 'text-white/70 hover:text-orange-400 hover:bg-white/10'
              }`}
            >
              <Users className="w-4 h-4" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all duration-300 ${
                activeTab === 'progress'
                  ? 'bg-orange-500 text-black font-medium'
                  : 'text-white/70 hover:text-orange-400 hover:bg-white/10'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Progress Panel
            </button>
          </div>
        </div>

        {activeTab === 'progress' ? (
          <ProgressPanel userId={user?.id || ''} currentPlan={currentPlan.name} />
        ) : (
          <>
        {/* Current Plan - Only show if user has an active subscription */}
        {subscriptionData?.subscription && subscriptionData?.subscription?.status === 'active' && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-orange-400" />
            Current Coaching Plan
          </h2>
          
          <Card className="bg-white/5 border-orange-500/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white text-2xl">
                    {subscriptionLoading ? (
                      <span className="text-orange-400">Loading...</span>
                    ) : (
                      currentPlan.name
                    )}
                  </CardTitle>
                  <CardDescription className="text-white/70">Your active coaching plan</CardDescription>
                </div>
                <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                  {currentPlan.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Plan Features</h4>
                  <ul className="space-y-3">
                    {currentPlan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3 text-white/80">
                        <CheckCircle className="w-5 h-5 text-orange-400 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Plan Details</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Monthly Price:</span>
                      <span className="text-2xl font-bold text-orange-400">
                        {subscriptionLoading ? (
                          <span className="text-orange-400">Loading...</span>
                        ) : (
                          currentPlan.price
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <Clock className="w-4 h-4" />
                      <span>
                        Started: {subscriptionLoading ? (
                          <span className="text-orange-400">Loading...</span>
                        ) : (
                          new Date(currentPlan.startDate).toLocaleDateString()
                        )}
                      </span>
                    </div>
                  </div>
                  <Button 
                    onClick={() => {
                      setActiveTab('progress')
                      // Scroll to check-in section after tab switch
                      setTimeout(() => {
                        const checkInSection = document.querySelector('[data-checkin-section]')
                        if (checkInSection) {
                          checkInSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        }
                      }, 100)
                    }}
                    className="w-full mt-6 bg-orange-500 hover:bg-orange-600"
                  >
                    Schedule Check-in
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        )}


        {/* Subscribe Options - Show if user doesn't have an active subscription */}
        {(!subscriptionData?.subscription || subscriptionData?.subscription?.status !== 'active') && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Crown className="w-6 h-6 text-orange-400" />
            Choose Your Coaching Plan
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upgradePlans.map((plan) => (
              <Card key={plan.id} className={`bg-white/5 border-orange-500/30 hover:border-orange-400/50 transition-all duration-300 ${plan.popular ? 'ring-2 ring-yellow-500/50' : ''}`}>
                <CardHeader>
                  <div className="text-center">
                    {plan.badge && (
                      <Badge className={`${plan.badgeColor} mb-3`}>
                        {plan.badge}
                      </Badge>
                    )}
                    <CardTitle className="text-white text-xl">{plan.name}</CardTitle>
                    <CardDescription className="text-white/70">{plan.subtitle}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <span className="text-3xl font-bold text-orange-400">${plan.monthlyPrice}</span>
                      <span className="text-white/70">/month</span>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-white">What's included:</h4>
                      <ul className="space-y-1">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-white/80">
                            <CheckCircle className="w-4 h-4 text-orange-400" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button 
                      onClick={() => router.push(`/checkout?plan=${plan.planId}`)}
                      className={`w-full ${plan.popular ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-orange-500 hover:bg-orange-600'}`}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Subscribe to {plan.name}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        )}

        {/* Coaching Benefits */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Target className="w-6 h-6 text-orange-400" />
            Why Choose 1-on-1 Coaching?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/5 border-orange-500/30 text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Personalized Attention</h3>
                <p className="text-white/70 text-sm">Get customized programs and feedback tailored specifically to your goals and needs.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 border-orange-500/30 text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Ongoing Support</h3>
                <p className="text-white/70 text-sm">Regular check-ins and continuous guidance to keep you motivated and on track.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 border-orange-500/30 text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Proven Results</h3>
                <p className="text-white/70 text-sm">Our coaching methodology has helped hundreds of athletes achieve their fitness goals.</p>
              </CardContent>
            </Card>
          </div>
        </div>
          </>
        )}
      </main>

      {/* Upgrade Confirmation Modal */}
      {showUpgradeModal && upgradeDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-black border-orange-500/30 w-full max-w-2xl mx-4">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-orange-400" />
              </div>
              <CardTitle className="text-white text-xl">
                Upgrade to {upgradeDetails.planName} Plan
              </CardTitle>
              <CardDescription className="text-white/70">
                Review your upgrade details below
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Current Plan Info */}
              <div className="bg-white/5 border border-orange-500/20 rounded-lg p-4">
                <h4 className="text-orange-400 font-semibold mb-2">Current Plan</h4>
                <p className="text-white/90">{currentPlan.name} - {currentPlan.price}</p>
              </div>

              {/* New Plan Info */}
              <div className="bg-white/5 border border-orange-500/20 rounded-lg p-4">
                <h4 className="text-orange-400 font-semibold mb-2">New Plan</h4>
                <p className="text-white/90">{upgradeDetails.planName} - ${upgradeDetails.monthlyPrice}/month</p>
              </div>

              {/* Prorated Billing Info */}
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <h4 className="text-yellow-400 font-semibold mb-2">This Month's Payment</h4>
                <p className="text-white/90">
                  You'll pay <span className="text-yellow-400 font-semibold">${Number(upgradeDetails.proratedAmount).toFixed(2)}</span>{' '}
                  for the remaining <span className="text-yellow-400 font-semibold">{upgradeDetails.remainingDays} days</span>{' '}
                  of your current cycle.
                </p>
              </div>

              {/* Starting Next Month */}
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <h4 className="text-yellow-400 font-semibold mb-2">Starting Next Month</h4>
                <p className="text-white/90">
                  You'll pay the full <span className="text-yellow-400 font-semibold">${upgradeDetails.monthlyPrice}/month</span>{' '}
                  for your new {upgradeDetails.planName} plan.
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={cancelUpgrade}
                className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:border-orange-400/50"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmUpgrade}
                className="bg-orange-500 hover:bg-orange-600 text-black font-semibold"
              >
                Continue to Payment
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

    </div>
  )
}
