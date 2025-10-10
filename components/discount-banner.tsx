"use client"

/**
 * Discount Banner Component
 * 
 * Displays a site-wide discount notification banner at the top of pages
 * when discounts are active. Automatically hides on dashboard and admin pages.
 * 
 * Features:
 * - Animated flame icons
 * - Dynamic messaging based on active discounts
 * - Responsive design
 * - Auto-updates when discounts change
 */

import { usePathname } from "next/navigation"
import { Flame } from "lucide-react"
import { useDiscount } from "@/contexts/discount-context"

export function DiscountBanner() {
  const pathname = usePathname()
  const { coachingDiscount, productsDiscount } = useDiscount()

  // Hide banner on dashboard and admin pages for cleaner UX
  const isDashboard = pathname?.startsWith('/dashboard')
  const isAdmin = pathname?.startsWith('/admin')
  
  if (isDashboard || isAdmin) {
    return null
  }

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

