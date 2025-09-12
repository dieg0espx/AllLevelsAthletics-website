"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

  // Mock data - replace with real data from your backend
  const [currentPlan] = useState({
    name: "Foundation",
    status: "active",
    startDate: "2024-01-01",
    nextCheckIn: "2024-02-01",
    features: [
      "1x/month personalized check-ins",
      "Fully customized training program",
      "Email support & guidance",
      "Access to exercise library",
      "Nutrition guidelines"
    ],
    price: "$197/month"
  })

  const [upgradePlans] = useState([
    {
      id: 1,
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
      name: "Elite",
      badge: "PREMIUM",
      badgeColor: "bg-orange-600/20 text-orange-300 border-orange-600/30",
      subtitle: "Maximum support for serious athletes and professionals",
      monthlyPrice: 497,
      features: [
        "Weekly personalized check-ins",
        "Complete tension reset coaching",
        "Video analysis & technique review",
        "Mobility prioritization program",
        "24/7 text support access",
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
      
      // Auto-schedule check-ins based on current plan
      scheduleCheckIns()
      
      return () => clearTimeout(timer)
    }
  }, [user, authLoading, router])

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

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-white">Loading Coaching...</h1>
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
        {/* Current Plan */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-orange-400" />
            Current Coaching Plan
          </h2>
          
          <Card className="bg-white/5 border-orange-500/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white text-2xl">{currentPlan.name}</CardTitle>
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
                      <span className="text-2xl font-bold text-orange-400">{currentPlan.price}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <Clock className="w-4 h-4" />
                      <span>Started: {new Date(currentPlan.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <MessageSquare className="w-4 h-4" />
                      <span>Next Check-in: {new Date(currentPlan.nextCheckIn).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-6 bg-orange-500 hover:bg-orange-600">
                    Schedule Check-in
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upgrade Options */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Crown className="w-6 h-6 text-orange-400" />
            Upgrade Your Plan
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
                      onClick={() => router.push('/pricing')} 
                      className={`w-full ${plan.popular ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-orange-500 hover:bg-orange-600'}`}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Upgrade to {plan.name}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

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
    </div>
  )
}
