"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Package, Home, ShoppingBag } from "lucide-react"
import Link from "next/link"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading for better UX
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-white">Processing your order...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border-b border-orange-500/30">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Order Successful!</h1>
            <p className="text-xl text-white/70">Thank you for your purchase</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Order Confirmation */}
          <Card className="bg-white/5 border-orange-500/30 mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-white">Order Confirmation</CardTitle>
              <CardDescription className="text-white/70">
                Your order has been processed successfully
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-green-400 mb-2">What happens next?</h3>
                <p className="text-white/80">
                  You'll receive an email confirmation with your order details and tracking information.
                  Your product will ship within 24 hours!
                </p>
              </div>
              
              {sessionId && (
                <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
                  <p className="text-sm text-white/60">Order ID: {sessionId}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Product Details */}
          <Card className="bg-white/5 border-orange-500/30 mb-8">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-orange-400" />
                All Levels Knot Roller
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src="/roller/roller 5.jpeg"
                    alt="All Levels Knot Roller"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-orange-400 mb-2">Product Features</h4>
                    <ul className="space-y-2 text-white/80 text-sm">
                      <li>• Precision ball bearings for smooth operation</li>
                      <li>• Non-slip rubber base for stability</li>
                      <li>• Versatile design for multiple uses</li>
                      <li>• Durable stainless steel construction</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-400 mb-2">Shipping Information</h4>
                    <p className="text-white/80 text-sm">
                      Your order will ship within 24 hours and includes tracking information.
                      You'll receive updates via email.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="bg-white/5 border-orange-500/30 mb-8">
            <CardHeader>
              <CardTitle className="text-xl text-white">What's Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-6 h-6 text-orange-400" />
                  </div>
                  <h4 className="font-semibold text-white mb-2">Shipping</h4>
                  <p className="text-white/70 text-sm">Your product ships within 24 hours</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-orange-400" />
                  </div>
                  <h4 className="font-semibold text-white mb-2">Tracking</h4>
                  <p className="text-white/70 text-sm">Get updates via email</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-6 h-6 text-orange-400" />
                  </div>
                  <h4 className="font-semibold text-white mb-2">Support</h4>
                  <p className="text-white/70 text-sm">We're here to help</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-orange-500 hover:bg-orange-600">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10">
              <Link href="/services">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Browse More Products
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
