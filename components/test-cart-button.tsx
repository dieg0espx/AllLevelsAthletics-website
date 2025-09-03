"use client"

import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"

export function TestCartButton() {
  const { toggleCart, getTotalItems } = useCart()

  const handleTestCart = () => {
    console.log('Test cart button clicked')
    try {
      toggleCart()
    } catch (error) {
      console.error('Error toggling cart:', error)
    }
  }

  return (
    <div className="space-y-2">
      <Button 
        onClick={handleTestCart}
        className="bg-orange-500 hover:bg-orange-600 text-white"
      >
        Test Cart ({getTotalItems()})
      </Button>
      <div className="text-xs text-white/70">
        Click to test cart functionality
      </div>
    </div>
  )
}
