"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
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
  const { user, signOut, loading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [purchasedProductsCount, setPurchasedProductsCount] = useState(0)
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [subscriptionData, setSubscriptionData] = useState<any>(null)
  const [hasCoachingSubscription, setHasCoachingSubscription] = useState(false)
  const [userPrograms, setUserPrograms] = useState<any[]>([])
  const [refreshingSubscription, setRefreshingSubscription] = useState(false)

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
  }, [user, authLoading, router])

  const fetchPurchasedProductsCount = async () => {
    if (!user?.id) return
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
      
      const response = await fetch(`/api/user-orders?userId=${user.id}`, {
        signal: controller.signal
      })
      clearTimeout(timeoutId)
      
      if (response.ok) {
        const data = await response.json()
        setPurchasedProductsCount(data.orders?.length || 0)
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Fetch aborted for products count')
        return
      }
      console.error('Error fetching products count:', error)
      // Set default value on error
      setPurchasedProductsCount(0)
    }
  }

  const fetchSubscriptionData = async () => {
    if (!user?.id) {
      console.log('⚠️ No user ID, skipping subscription fetch')
      return
    }

    console.log('🔄 Fetching subscription for user:', user.id)
    
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
      
      const response = await fetch(`/api/user-subscription?userId=${user.id}`, {
        signal: controller.signal
      })
      clearTimeout(timeoutId)
      
      console.log('📡 Subscription API response status:', response.status, response.ok)
      
      if (response.ok) {
        const data = await response.json()
        console.log('💳 Subscription data received:', JSON.stringify(data, null, 2))
        console.log('💳 Subscription object:', data.subscription)
        console.log('💳 Subscription status:', data.subscription?.status)
        console.log('💳 Subscription plan_name:', data.subscription?.plan_name)
        setSubscriptionData(data)
        
        // Check if user has an active coaching subscription (active or trialing)
        if (data.subscription && (data.subscription.status === 'active' || data.subscription.status === 'trialing')) {
          console.log('✅ Has active subscription:', data.subscription.plan_name)
          setHasCoachingSubscription(true)
        } else {
          console.log('❌ No active subscription found. Data:', data.subscription)
          setHasCoachingSubscription(false)
          
          // Auto-sync if we have a Stripe customer ID but no subscription
          if (data.userProfile?.stripe_customer_id && !data.subscription) {
            console.log('🔄 Auto-syncing: Found Stripe customer ID but no subscription in database')
            console.log('🔄 This likely means the webhook didn\'t fire. Attempting manual sync...')
            
            // Try to sync from Stripe automatically
            setTimeout(async () => {
              try {
                const syncResponse = await fetch('/api/sync-subscription-status', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ userId: user.id })
                })
                
                const syncData = await syncResponse.json()
                
                if (syncResponse.ok) {
                  console.log('✅ Auto-sync successful! Refreshing page...')
                  // Refresh the page to show the synced subscription
                  window.location.reload()
                } else {
                  console.log('⚠️ Auto-sync failed:', syncData.error)
                }
              } catch (error) {
                console.error('❌ Auto-sync error:', error)
              }
            }, 1000) // Wait 1 second before auto-syncing
          }
        }
      } else {
        const errorData = await response.text()
        console.error('❌ Subscription API failed:', response.status, errorData)
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Fetch aborted for subscription data')
        return
      }
      console.error('💥 Error fetching subscription data:', error)
      // Set default values on error
      setSubscriptionData(null)
      setHasCoachingSubscription(false)
    }
  }

  const handleRefreshSubscription = async () => {
    setRefreshingSubscription(true)
    try {
      console.log('🔄 Manual sync - fetching subscription from Stripe...')
      
      // First, try to sync from Stripe
      const syncResponse = await fetch('/api/sync-subscription-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id })
      })
      
      const syncData = await syncResponse.json()
      
      if (syncResponse.ok) {
        console.log('✅ Subscription synced from Stripe:', syncData)
        alert('✅ Subscription synced successfully! Refreshing...')
      } else {
        console.log('⚠️ Sync failed, trying regular fetch:', syncData.error)
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

  const fetchUserPrograms = async () => {
    if (!user?.id) return

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
      
      const response = await fetch(`/api/user-programs?userId=${user.id}`, {
        signal: controller.signal
      })
      clearTimeout(timeoutId)
      
      if (response.ok) {
        const data = await response.json()
        console.log('📊 Dashboard - API response:', data)
        console.log('📊 Dashboard - Programs found:', data.programs?.length || 0)
        setUserPrograms(data.programs || [])
      } else {
        // If API fails, check localStorage as fallback
        console.log('⚠️ API failed, checking localStorage for programs')
        const localPrograms = JSON.parse(localStorage.getItem('userPrograms') || '[]')
        console.log('📊 Dashboard - Local programs found:', localPrograms.length)
        setUserPrograms(localPrograms)
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Fetch aborted for user programs')
        return
      }
      console.error('Error fetching user programs:', error)
      // If API fails, check localStorage as fallback
      console.log('API error, checking localStorage for programs')
      try {
        const localPrograms = JSON.parse(localStorage.getItem('userPrograms') || '[]')
        setUserPrograms(localPrograms)
      } catch (localError) {
        console.error('Error reading localStorage:', localError)
        setUserPrograms([])
      }
    }
  }

  const fetchRecentActivity = async () => {
    if (!user?.id) return

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 8000) // 8 second timeout for this complex function
      
      // Fetch all data in parallel with timeout
      const [ordersResponse, subscriptionResponse, programsResponse] = await Promise.allSettled([
        fetch(`/api/user-orders?userId=${user.id}`, { signal: controller.signal }),
        fetch(`/api/user-subscription?userId=${user.id}`, { signal: controller.signal }),
        fetch(`/api/user-programs?userId=${user.id}`, { signal: controller.signal })
      ])
      
      clearTimeout(timeoutId)

      const activities: any[] = []

      // Process orders data
      if (ordersResponse.status === 'fulfilled' && ordersResponse.value.ok) {
        const ordersData = await ordersResponse.value.json()
        if (ordersData.orders && ordersData.orders.length > 0) {
          ordersData.orders.slice(0, 3).forEach((order: any) => {
            activities.push({
              id: order.id,
              type: 'purchase',
              title: `Purchased ${order.name}`,
              description: `Order #${order.orderNumber}`,
              date: order.purchaseDate,
              icon: <Package className="w-4 h-4 text-yellow-400" />,
              color: 'yellow'
            })
          })
        }
      }

      // Process subscription data
      if (subscriptionResponse.status === 'fulfilled' && subscriptionResponse.value.ok) {
        const subscriptionData = await subscriptionResponse.value.json()
        if (subscriptionData.subscription) {
          const sub = subscriptionData.subscription
          activities.push({
            id: `sub-${sub.id}`,
            type: 'subscription',
            title: `Started ${sub.plan_name} Plan`,
            description: sub.status === 'active' ? 'Active subscription' : `Status: ${sub.status}`,
            date: sub.created_at,
            icon: <CheckCircle className="w-4 h-4 text-green-400" />,
            color: 'green'
          })
        }
      }

      // Process programs data
      if (programsResponse.status === 'fulfilled' && programsResponse.value.ok) {
        const programsData = await programsResponse.value.json()
        if (programsData.programs && programsData.programs.length > 0) {
          programsData.programs.slice(0, 2).forEach((program: any) => {
            activities.push({
              id: `program-${program.id}`,
              type: 'program',
              title: `Started ${program.name}`,
              description: `${program.progress}% complete`,
              date: program.startDate,
              icon: <BookOpen className="w-4 h-4 text-orange-400" />,
              color: 'orange'
            })
          })
        }
      } else {
        // If API failed, check localStorage for programs
        try {
          const localPrograms = JSON.parse(localStorage.getItem('userPrograms') || '[]')
          if (localPrograms.length > 0) {
            localPrograms.slice(0, 2).forEach((program: any) => {
              activities.push({
                id: `program-${program.id}`,
                type: 'program',
                title: `Started ${program.name}`,
                description: `${program.progress}% complete`,
                date: program.startDate || program.registeredAt,
                icon: <BookOpen className="w-4 h-4 text-orange-400" />,
                color: 'orange'
              })
            })
          }
        } catch (localError) {
          console.error('Error reading localStorage for activities:', localError)
        }
      }

      // Sort by date (most recent first) and limit to 3
      activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      setRecentActivity(activities.slice(0, 3))

    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Fetch aborted for recent activity')
        return
      }
      console.error('Error fetching recent activity:', error)
      // Set empty array on error
      setRecentActivity([])
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
    <AdminRedirect>
      <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Header */}
      <header className="bg-black/95 backdrop-blur-md border-b border-orange-500/30 sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-orange-400">Client Dashboard</h1>
              <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                {user.user_metadata?.role || 'Client'}
              </Badge>
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
        {/* Dashboard Navigation */}
        <nav className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 backdrop-blur-md border border-orange-500/30 rounded-lg p-3 sm:p-4 mb-6 sm:mb-8">
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-2 sm:gap-6 overflow-x-auto">
            <Link href="/dashboard/programs" className="text-white/90 hover:text-orange-400 hover:scale-105 transition-all duration-300 font-medium text-sm sm:text-base flex items-center justify-center p-2 sm:p-0">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Programs</span>
              <span className="sm:hidden">Programs</span>
            </Link>
            <Link href="/dashboard/coaching" className="text-white/90 hover:text-orange-400 hover:scale-105 transition-all duration-300 font-medium text-sm sm:text-base flex items-center justify-center p-2 sm:p-0">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 sm:mr-2" />
              <span className="hidden sm:inline">1-on-1 Coaching</span>
              <span className="sm:hidden">Coaching</span>
            </Link>
            <Link href="/dashboard/products" className="text-white/90 hover:text-orange-400 hover:scale-105 transition-all duration-300 font-medium text-sm sm:text-base flex items-center justify-center p-2 sm:p-0">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Purchased Products</span>
              <span className="sm:hidden">Products</span>
            </Link>
            <Link href="/dashboard/profile" className="text-white/90 hover:text-orange-400 hover:scale-105 transition-all duration-300 font-medium text-sm sm:text-base flex items-center justify-center p-2 sm:p-0">
              <User className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 sm:mr-2" />
              <span className="hidden sm:inline">My Information</span>
              <span className="sm:hidden">Profile</span>
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative mb-6 sm:mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-yellow-500/10 to-orange-500/20 rounded-2xl"></div>
          <div className="relative p-4 sm:p-6 md:p-8 text-center">
            <div className="mb-3 sm:mb-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                <Dumbbell className="w-8 h-8 sm:w-10 sm:h-10 text-black" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3">
              Welcome back, {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Athlete'}!
            </h2>
            <p className="text-white/80 text-lg sm:text-xl mb-3 sm:mb-4">
              Ready to crush your fitness goals today?
            </p>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="mb-8 text-center">
          <blockquote className="text-lg text-white/70 italic">
            "Success is the sum of small efforts repeated day in and day out."
          </blockquote>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent mx-auto mt-3"></div>
        </div>


        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Programs Summary */}
          <Card className="bg-white/5 border-orange-500/30 hover:border-orange-400/50 transition-all duration-300 cursor-pointer" onClick={() => router.push('/dashboard/programs')}>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-orange-400" />
                My Programs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Dumbbell className="w-6 h-6 text-orange-400" />
                </div>
                {userPrograms.length > 0 ? (
                  <>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {userPrograms.length} Active Program{userPrograms.length > 1 ? 's' : ''}
                    </h3>
                    <p className="text-white/70 text-sm mb-3">
                      {userPrograms[0]?.name || 'Continue your fitness journey'}
                    </p>
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                      View Programs
                    </Button>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-white mb-2">No Programs Yet</h3>
                    <p className="text-white/70 text-sm mb-3">Start your fitness journey</p>
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600 w-full">
                      Explore Programs
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 1-on-1 Coaching Summary */}
          <Card className="bg-white/5 border-orange-500/30 hover:border-orange-400/50 transition-all duration-300 cursor-pointer" onClick={() => router.push('/dashboard/coaching')}>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-400" />
                1-on-1 Coaching
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {hasCoachingSubscription ? (subscriptionData?.subscription?.plan_name || 'Foundation') : 'No Active Plan'}
                </h3>
                <p className="text-white/70 text-sm mb-3">
                  {hasCoachingSubscription ? 'Active coaching subscription' : 'Start your coaching journey'}
                </p>
                {hasCoachingSubscription ? (
                  <Button 
                    size="sm" 
                    className="bg-orange-500 hover:bg-orange-600 w-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push('/dashboard/coaching')
                    }}
                  >
                    View Details
                  </Button>
                ) : (
                  <div className="flex gap-2 justify-center">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push('/services')
                      }}
                    >
                      Get Started
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-orange-400 hover:bg-orange-500/10 text-xs"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRefreshSubscription()
                      }}
                      disabled={refreshingSubscription}
                    >
                      {refreshingSubscription ? '⟳' : 'Refresh'}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Products Summary */}
          <Card className="bg-white/5 border-orange-500/30 hover:border-orange-400/50 transition-all duration-300 cursor-pointer" onClick={() => router.push('/dashboard/products')}>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-orange-400" />
                Purchased Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Package className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {purchasedProductsCount > 0 ? `${purchasedProductsCount} Products` : 'No Products Yet'}
                </h3>
                <p className="text-white/70 text-sm mb-3">
                  {purchasedProductsCount > 0 ? 'Track your orders' : 'Start shopping'}
                </p>
                <Button size="sm" variant="outline" className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10">
                  {purchasedProductsCount > 0 ? 'View Details' : 'Browse Products'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>


        {/* Recent Activity */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
            Recent Activity
          </h3>
          <div className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-orange-500/20">
                  <div className={`w-8 h-8 ${activity.color === 'green' ? 'bg-green-500/20' : activity.color === 'yellow' ? 'bg-yellow-500/20' : activity.color === 'orange' ? 'bg-orange-500/20' : 'bg-blue-500/20'} rounded-full flex items-center justify-center`}>
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white">{activity.title}</p>
                    <p className="text-xs text-white/60">{activity.description}</p>
                    <p className="text-xs text-white/50">{formatTimeAgo(activity.date)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white/40" />
                </div>
                <p className="text-white/60">No recent activity</p>
                <p className="text-sm text-white/40">Your activity will appear here</p>
              </div>
            )}
          </div>
        </div>

      </main>
      </div>
    </AdminRedirect>
  )
}
