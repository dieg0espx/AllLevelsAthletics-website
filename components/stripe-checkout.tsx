"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { useCart } from "@/contexts/cart-context"

interface AddToCartProps {
  productId: string
  productName: string
  price: number
  image: string
  description: string
  className?: string
  children?: React.ReactNode
}

export default function AddToCart({
  productId,
  productName,
  price,
  image,
  description,
  className = "",
  children
}: AddToCartProps) {
  const [isAdded, setIsAdded] = useState(false)
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem({
      id: productId,
      name: productName,
      price,
      quantity: 1,
      image,
      description,
    })
    
    setIsAdded(true)
    
    // Reset the added state after 2 seconds
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isAdded}
      className={`${className} ${isAdded ? 'bg-green-500 hover:bg-green-600' : ''}`}
    >
      {isAdded ? (
        <Check className="w-4 h-4 mr-2" />
      ) : null}
      {isAdded ? 'Added to Cart!' : (children || `Add to Cart - $${price}`)}
    </Button>
  )
}
