"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Percent, ShoppingCart, Users, Save, RefreshCw } from "lucide-react"
import { useSafeAuth } from "@/contexts/safe-auth-context"

interface DiscountManagementSectionProps {
  onRefresh?: () => void
}

export function DiscountManagementSection({ onRefresh }: DiscountManagementSectionProps) {
  const { user, isHydrated } = useSafeAuth()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [coachingDiscount, setCoachingDiscount] = useState<number>(0)
  const [productsDiscount, setProductsDiscount] = useState<number>(0)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Fetch current discounts
  const fetchDiscounts = async () => {
    setLoading(true)
    setMessage(null)
    try {
      const response = await fetch('/api/admin/discounts')
      const data = await response.json()
      
      if (response.ok) {
        setCoachingDiscount(data.discounts?.coaching?.percentage || 0)
        setProductsDiscount(data.discounts?.products?.percentage || 0)
      } else {
        console.error('Failed to fetch discounts:', data)
        
        // Show specific error message if table doesn't exist
        if (data.error?.includes('table not found') || data.error?.includes('migration')) {
          setMessage({ 
            type: 'error', 
            text: '⚠️ Database not setup! Please run the migration: supabase-migrations/create-discounts-table.sql in your Supabase SQL Editor.' 
          })
        } else {
          setMessage({ 
            type: 'error', 
            text: data.error || 'Failed to fetch discounts' 
          })
        }
      }
    } catch (error) {
      console.error('Error fetching discounts:', error)
      setMessage({ 
        type: 'error', 
        text: 'Failed to connect to the server. Please check your connection.' 
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDiscounts()
  }, [])

  // Save discount
  const handleSaveDiscount = async (discountType: 'coaching' | 'products', percentage: number) => {
    if (!user) return

    setSaving(true)
    setMessage(null)

    try {
      const response = await fetch('/api/admin/discounts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          discountType,
          percentage,
          userId: user.id
        })
      })

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: `${discountType === 'coaching' ? 'Coaching' : 'Products'} discount updated successfully!` 
        })
        
        // Refresh discounts
        await fetchDiscounts()
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage(null), 3000)
      } else {
        const data = await response.json()
        setMessage({ type: 'error', text: data.error || 'Failed to update discount' })
      }
    } catch (error) {
      console.error('Error saving discount:', error)
      setMessage({ type: 'error', text: 'An error occurred while saving the discount' })
    } finally {
      setSaving(false)
    }
  }

  const calculateDiscountedPrice = (originalPrice: number, discountPercentage: number) => {
    const discount = originalPrice * (discountPercentage / 100)
    return originalPrice - discount
  }

  // Don't render until hydrated to prevent SSR issues
  if (!isHydrated) {
    return (
      <Card className="bg-card/80 border-orange-500/30">
        <CardContent className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className="bg-card/80 border-orange-500/30">
        <CardContent className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Discount Management</h2>
          <p className="text-white/70">Set site-wide discounts for coaching packages and products</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchDiscounts}
          className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-500/20 border border-green-500/30 text-green-400' 
            : 'bg-red-500/20 border border-red-500/30 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Coaching Packages Discount */}
        <Card className="bg-card/80 border-2 border-orange-500/30">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center">
                <Users className="w-5 h-5 text-black" />
              </div>
              <div>
                <CardTitle className="text-white">Coaching Packages</CardTitle>
                <CardDescription>1-on-1 Training Subscriptions</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="coaching-discount" className="text-white mb-2 block">
                Discount Percentage
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="coaching-discount"
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={coachingDiscount}
                    onChange={(e) => setCoachingDiscount(parseFloat(e.target.value) || 0)}
                    className="bg-black/50 border-orange-500/30 text-white pr-10"
                  />
                  <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                </div>
                <Button
                  onClick={() => handleSaveDiscount('coaching', coachingDiscount)}
                  disabled={saving}
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold hover:from-orange-600 hover:to-yellow-600"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>

            {/* Current Discount Display */}
            {coachingDiscount > 0 && (
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                <p className="text-sm text-white/70 mb-3">Price Examples:</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/80">Foundation ($197)</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white/50 line-through">${197}</span>
                      <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                        ${calculateDiscountedPrice(197, coachingDiscount).toFixed(0)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Growth ($297)</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white/50 line-through">${297}</span>
                      <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                        ${calculateDiscountedPrice(297, coachingDiscount).toFixed(0)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Elite ($497)</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white/50 line-through">${497}</span>
                      <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                        ${calculateDiscountedPrice(497, coachingDiscount).toFixed(0)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Products Discount */}
        <Card className="bg-card/80 border-2 border-yellow-500/30">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-black" />
              </div>
              <div>
                <CardTitle className="text-white">Products</CardTitle>
                <CardDescription>MFRoller & Digital Products</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="products-discount" className="text-white mb-2 block">
                Discount Percentage
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="products-discount"
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={productsDiscount}
                    onChange={(e) => setProductsDiscount(parseFloat(e.target.value) || 0)}
                    className="bg-black/50 border-yellow-500/30 text-white pr-10"
                  />
                  <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                </div>
                <Button
                  onClick={() => handleSaveDiscount('products', productsDiscount)}
                  disabled={saving}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold hover:from-yellow-600 hover:to-orange-600"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>

            {/* Current Discount Display */}
            {productsDiscount > 0 && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-sm text-white/70 mb-3">Price Examples:</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/80">MFRoller ($99)</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white/50 line-through">${99}</span>
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        ${calculateDiscountedPrice(99, productsDiscount).toFixed(0)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Information Box */}
      <Card className="bg-blue-500/10 border-2 border-blue-500/30">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Percent className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">How Discounts Work</h4>
              <ul className="text-sm text-white/70 space-y-1">
                <li>• Discounts are applied site-wide immediately after saving</li>
                <li>• For coaching packages: Discounts show on the services page with strikethrough prices</li>
                <li>• For products: Discounted prices are applied at checkout</li>
                <li>• Set to 0% to remove any active discount</li>
                <li>• All prices update automatically across the website</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

