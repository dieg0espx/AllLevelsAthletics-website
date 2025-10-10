"use client"

import { useEffect, useState } from "react"
import { Flame } from "lucide-react"

export function DiscountBanner() {
  const [coachingDiscount, setCoachingDiscount] = useState(0)
  const [productsDiscount, setProductsDiscount] = useState(0)

  // Fetch discounts on component mount
  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await fetch('/api/discounts')
        if (response.ok) {
          const data = await response.json()
          setCoachingDiscount(data.coaching || 0)
          setProductsDiscount(data.products || 0)
        }
      } catch (error) {
        console.error('Error fetching discounts:', error)
      }
    }
    fetchDiscounts()
  }, [])

  // Don't render if no discounts
  if (coachingDiscount === 0 && productsDiscount === 0) {
    return null
  }

  return (
    <div className="fixed top-14 sm:top-16 left-0 right-0 z-40 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 text-white pt-3 sm:pt-6 pb-3 shadow-lg animate-in slide-in-from-top">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-3 text-center">
          <Flame className="w-6 h-6 animate-bounce text-yellow-300" />
          <p className="font-bold text-sm sm:text-base md:text-lg">
            {coachingDiscount > 0 && productsDiscount > 0 ? (
              <>LIMITED TIME: {Math.max(coachingDiscount, productsDiscount)}% OFF ALL SERVICES & PRODUCTS!</>
            ) : coachingDiscount > 0 ? (
              <>SPECIAL OFFER: {coachingDiscount}% OFF ALL COACHING PACKAGES!</>
            ) : (
              <>SPECIAL DEAL: {productsDiscount}% OFF ALL PRODUCTS!</>
            )}
          </p>
          <Flame className="w-6 h-6 animate-bounce text-yellow-300" />
        </div>
      </div>
    </div>
  )
}

