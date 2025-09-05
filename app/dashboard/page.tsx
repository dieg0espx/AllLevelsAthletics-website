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
  User
} from "lucide-react"

export default function ClientDashboard() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [purchasedProductsCount, setPurchasedProductsCount] = useState(0)

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      router.push('/')
      return
    }

    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000)
    
    // Fetch purchased products count
    if (user) {
      fetchPurchasedProductsCount()
    }
    
    return () => clearTimeout(timer)
  }, [user, router])

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

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (isLoading) {
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

        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Athlete'}!
          </h2>
          <p className="text-white/70 text-lg">
            Ready to crush your fitness goals today?
          </p>
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
                <h3 className="text-lg font-semibold text-white mb-2">Foundation Plan</h3>
                <p className="text-white/70 text-sm mb-3">Monthly check-ins</p>
                <Button size="sm" variant="outline" className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10">
                  View Details
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
      </main>
      </div>
    </AdminRedirect>
  )
}
