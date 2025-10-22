"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useSafeAuth } from "@/contexts/safe-auth-context"
import { AdminRedirect } from "@/components/admin-redirect"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  BookOpen,
  Dumbbell,
  Users,
  ShoppingBag,
  Package,
  User,
  CheckCircle
} from "lucide-react"

export default function ClientDashboard() {
  const router = useRouter()
  const { user, signOut, loading: authLoading, isHydrated } = useSafeAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [purchasedProductsCount, setPurchasedProductsCount] = useState(0)
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [subscriptionData, setSubscriptionData] = useState<any>(null)
  const [hasCoachingSubscription, setHasCoachingSubscription] = useState(false)
  const [userPrograms, setUserPrograms] = useState<any[]>([])
  const [refreshingSubscription, setRefreshingSubscription] = useState(false)

  // Define fetch functions before useEffect to avoid dependency issues
  const fetchPurchasedProductsCount = useCallback(async () => {
    if (!user?.id) return
    try {
      const controller = new AbortController()
      const response = await fetch(`/api/user-products?userId=${user.id}`, {
        signal: controller.signal
      })
      
      if (response.ok) {
        const data = await response.json()
        setPurchasedProductsCount(data.count || 0)
      }
    } catch (error) {
      console.error('Error fetching purchased products count:', error)
    }
  }, [user?.id])

  const fetchSubscriptionData = useCallback(async () => {
    if (!user?.id) {
      console.log('⚠️ No user ID, skipping subscription fetch')
      return
    }

    try {
      const response = await fetch(`/api/user-subscription?userId=${user.id}`)
      
      if (response.ok) {
        const data = await response.json()
        setSubscriptionData(data)
      } else {
        console.error('Failed to fetch subscription data')
      }
    } catch (error) {
      console.error('Error fetching subscription data:', error)
    }
  }, [user?.id])

  const fetchUserPrograms = useCallback(async () => {
    if (!user?.id) return

    try {
      const response = await fetch(`/api/user-programs?userId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setUserPrograms(data.programs || [])
      }
    } catch (error) {
      console.error('Error fetching user programs:', error)
    }
  }, [user?.id])

  const fetchRecentActivity = useCallback(async () => {
    if (!user?.id) return

    try {
      const response = await fetch(`/api/user-activity?userId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setRecentActivity(data.activities || [])
      }
    } catch (error) {
      console.error('Error fetching recent activity:', error)
    }
  }, [user?.id])

  useEffect(() => {
    // Only run on client side to prevent hydration mismatches
    if (typeof window === 'undefined') return
    
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
      
      // Set a maximum loading time of 3 seconds as fallback
      const fallbackTimer = setTimeout(() => {
        console.log('Dashboard loading timeout - forcing load complete')
        setIsLoading(false)
      }, 3000)
      
      // Fetch data in parallel with error handling
      Promise.allSettled([
        fetchPurchasedProductsCount(),
        fetchRecentActivity(),
        fetchSubscriptionData(),
        fetchUserPrograms()
      ]).then(() => {
        // Ensure loading is set to false even if some requests fail
        clearTimeout(fallbackTimer)
        setIsLoading(false)
      }).catch(() => {
        // Fallback to ensure loading state is cleared
        clearTimeout(fallbackTimer)
        setIsLoading(false)
      })
      
      return () => clearTimeout(fallbackTimer)
    }
  }, [user, authLoading, router, fetchPurchasedProductsCount, fetchRecentActivity, fetchSubscriptionData, fetchUserPrograms])

  const refreshSubscription = async () => {
    try {
      setRefreshingSubscription(true)
      
      // First refresh the subscription data
      const response = await fetch('/api/refresh-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user?.id }),
      })
      
      if (response.ok) {
        console.log('✅ Subscription refreshed successfully')
        alert('Subscription refreshed successfully!')
      } else {
        const errorData = await response.json()
        console.error('❌ Failed to refresh subscription:', errorData.error)
        alert(`Failed to refresh subscription: ${errorData.error}`)
      }
      
      // Then fetch the updated data
      await fetchSubscriptionData()
    } catch (error) {
      console.error('❌ Error refreshing subscription:', error)
      alert('Failed to refresh subscription. Please try again.')
    } finally {
      setRefreshingSubscription(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
    
    const diffInWeeks = Math.floor(diffInDays / 7)
    if (diffInWeeks < 4) return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`
    
    const diffInMonths = Math.floor(diffInDays / 30)
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`
  }

  // Don't render until hydrated to prevent SSR issues
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-white">Loading Dashboard...</h1>
        </div>
      </div>
    )
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-white">Loading Dashboard...</h1>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-black">
      <AdminRedirect>{null}</AdminRedirect>
      
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-black">Welcome back!</h1>
              <p className="text-orange-800 mt-1">Ready to continue your fitness journey?</p>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="bg-white/20 border-white/30 text-black hover:bg-white/30"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-card/90 border-2 border-orange-500/30 hover:border-orange-500/60 transition-all hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Products Purchased</CardTitle>
              <ShoppingBag className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{purchasedProductsCount}</div>
              <p className="text-xs text-muted-foreground">Total purchases</p>
            </CardContent>
          </Card>

          <Card className="bg-card/90 border-2 border-yellow-500/30 hover:border-yellow-500/60 transition-all hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Active Programs</CardTitle>
              <BookOpen className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{userPrograms.length}</div>
              <p className="text-xs text-muted-foreground">Programs enrolled</p>
            </CardContent>
          </Card>

          <Card className="bg-card/90 border-2 border-green-500/30 hover:border-green-500/60 transition-all hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Subscription</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {subscriptionData?.subscription?.status === 'active' ? 'Active' : 'Inactive'}
              </div>
              <p className="text-xs text-muted-foreground">
                {subscriptionData?.subscription?.plan_name || 'No plan'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/90 border-2 border-blue-500/30 hover:border-blue-500/60 transition-all hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Coaching</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {hasCoachingSubscription ? 'Available' : 'Not Available'}
              </div>
              <p className="text-xs text-muted-foreground">
                {hasCoachingSubscription ? '1-on-1 coaching' : 'Upgrade required'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-card/90 border-2 border-orange-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Package className="h-5 w-5 text-orange-400" />
              Recent Activity
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Your latest purchases and program progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-card/50 rounded-lg">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{activity.title}</h4>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatTimeAgo(activity.date)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-card/90 border-2 border-orange-500/30 hover:border-orange-500/60 transition-all hover:scale-105">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-orange-400" />
                My Programs
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Access your enrolled programs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/programs">
                <Button className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold hover:from-orange-600 hover:to-yellow-600 transition-all duration-300">
                  View Programs
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-card/90 border-2 border-yellow-500/30 hover:border-yellow-500/60 transition-all hover:scale-105">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-yellow-400" />
                Shop Products
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Browse and purchase new products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/services">
                <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold hover:from-yellow-600 hover:to-orange-600 transition-all duration-300">
                  Browse Products
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Subscription Management */}
        {subscriptionData?.subscription && (
          <Card className="bg-card/90 border-2 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                Subscription Management
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Manage your subscription and billing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-card/50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-white">{subscriptionData.subscription.plan_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Status: <Badge variant={subscriptionData.subscription.status === 'active' ? 'default' : 'secondary'}>
                        {subscriptionData.subscription.status}
                      </Badge>
                    </p>
                  </div>
                  <Button
                    onClick={refreshSubscription}
                    disabled={refreshingSubscription}
                    variant="outline"
                    className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                  >
                    {refreshingSubscription ? 'Refreshing...' : 'Refresh'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
