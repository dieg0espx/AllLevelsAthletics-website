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
      
      // Fetch purchased products count and recent activity
      fetchPurchasedProductsCount()
      fetchRecentActivity()
      fetchSubscriptionData()
      
      return () => clearTimeout(timer)
    }
  }, [user, authLoading, router])

  const fetchPurchasedProductsCount = async () => {
    try {
      const response = await fetch(`/api/user-orders?userId=${user?.id}`)
      if (response.ok) {
        const data = await response.json()
        setPurchasedProductsCount(data.orders?.length || 0)
      }
    } catch (error) {
      console.error('Error fetching products count:', error)
    }
  }

  const fetchSubscriptionData = async () => {
    if (!user?.id) return

    try {
      const response = await fetch(`/api/user-subscription?userId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setSubscriptionData(data)
        
        // Check if user has an active coaching subscription
        if (data.subscription && data.subscription.status === 'active') {
          setHasCoachingSubscription(true)
        }
      }
    } catch (error) {
      console.error('Error fetching subscription data:', error)
    }
  }

  const fetchRecentActivity = async () => {
    if (!user?.id) return

    try {
      // Fetch recent orders
      const ordersResponse = await fetch(`/api/user-orders?userId=${user.id}`)
      const ordersData = await ordersResponse.json()
      
      // Fetch subscription data
      const subscriptionResponse = await fetch(`/api/user-subscription?userId=${user.id}`)
      const subscriptionData = await subscriptionResponse.json()

      const activities: any[] = []

      // Add recent orders as activities
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

      // Add subscription activity if exists
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

      // Sort by date (most recent first) and limit to 3
      activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      setRecentActivity(activities.slice(0, 3))

    } catch (error) {
      console.error('Error fetching recent activity:', error)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
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
      <div className="min-h-screen bg-black text-white">
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
        <nav className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 backdrop-blur-md border border-orange-500/30 rounded-lg p-4 mb-8">
          <div className="flex flex-wrap items-center justify-center space-x-6">
            <Link href="/dashboard/programs" className="text-white/90 hover:text-orange-400 hover:scale-105 transition-all duration-300 font-medium">
              <BookOpen className="w-5 h-5 inline mr-2" />
              Programs
            </Link>
            <Link href="/dashboard/coaching" className="text-white/90 hover:text-orange-400 hover:scale-105 transition-all duration-300 font-medium">
              <Users className="w-5 h-5 inline mr-2" />
              1-on-1 Coaching
            </Link>
            <Link href="/dashboard/products" className="text-white/90 hover:text-orange-400 hover:scale-105 transition-all duration-300 font-medium">
              <ShoppingBag className="w-5 h-5 inline mr-2" />
              Purchased Products
            </Link>
            <Link href="/dashboard/profile" className="text-white/90 hover:text-orange-400 hover:scale-105 transition-all duration-300 font-medium">
              <User className="w-5 h-5 inline mr-2" />
              My Information
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-yellow-500/10 to-orange-500/20 rounded-2xl"></div>
          <div className="relative p-8 text-center">
            <div className="mb-4">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Dumbbell className="w-10 h-10 text-black" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-white mb-3">
              Welcome back, {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Athlete'}!
            </h2>
            <p className="text-white/80 text-xl mb-4">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                <h3 className="text-lg font-semibold text-white mb-2">No Programs Yet</h3>
                <p className="text-white/70 text-sm mb-3">Start your fitness journey</p>
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                  Explore Programs
                </Button>
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
                <Button size="sm" variant="outline" className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10">
                  {hasCoachingSubscription ? 'View Details' : 'Get Started'}
                </Button>
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
                  <div className={`w-8 h-8 ${activity.color === 'green' ? 'bg-green-500/20' : activity.color === 'yellow' ? 'bg-yellow-500/20' : 'bg-blue-500/20'} rounded-full flex items-center justify-center`}>
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
