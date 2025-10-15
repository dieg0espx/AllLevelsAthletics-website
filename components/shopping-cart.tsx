"use client"

import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { X, Minus, Plus, Trash2, ShoppingCart as ShoppingCartIcon, ArrowRight, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { AuthModal } from "@/components/auth-modal"

export function ShoppingCart() {
  const { state, removeItem, updateQuantity, closeCart, getTotalItems, getTotalPrice } = useCart()
  const { user } = useAuth()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(id, newQuantity)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  const handleCheckout = () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }
    
    setIsCheckingOut(true)
    closeCart()
    // Navigation will be handled by the Link component
  }

  if (!state.isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={closeCart}
      />
      
      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm sm:max-w-md bg-black shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700">
            <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
              <ShoppingCartIcon className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
              <span className="hidden sm:inline">Shopping Cart</span>
              <span className="sm:hidden">Cart</span>
            </h2>
            <button
              onClick={closeCart}
              className="text-gray-400 hover:text-gray-200 transition-colors p-1"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {state.items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCartIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">Your cart is empty</h3>
                <p className="text-gray-400 mb-6">Add some products to get started!</p>
                <Link href="/services#products">
                  <Button 
                    onClick={closeCart}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Browse Products
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-700 rounded-lg bg-gray-900">
                    {/* Product Image */}
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                      <Image
                        src={
                          item.name.includes("MFRoller") 
                            ? "/roller/roller7.jpg"
                            : item.name.includes("Body Tension Reset Course")
                            ? "/gymTools.jpg"
                            : item.name.includes("Complete Bundle")
                            ? "/roller/roller12.jpg"
                            : item.image
                        }
                        alt={item.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white text-sm sm:text-base truncate">{item.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-400 truncate">{item.description}</p>
                      <p className="text-base sm:text-lg font-semibold text-orange-500 mt-1">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex flex-col items-end gap-1 sm:gap-2">
                      <div className="flex items-center border border-gray-600 rounded-md bg-gray-800">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-700 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300" />
                        </button>
                        <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-white min-w-[1.5rem] sm:min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-700 transition-colors"
                        >
                          <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300" />
                        </button>
                      </div>
                      
                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-400 hover:text-red-300 transition-colors p-1"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {state.items.length > 0 && (
            <div className="border-t border-gray-700 p-4 sm:p-6 space-y-3 sm:space-y-4">
              {/* Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs sm:text-sm text-gray-400">
                  <span>Subtotal ({getTotalItems()} items)</span>
                  <span>{formatPrice(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm text-gray-400">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-base sm:text-lg font-semibold text-white pt-2 border-t border-gray-700">
                  <span>Total</span>
                  <span>{formatPrice(getTotalPrice())}</span>
                </div>
              </div>

              {/* Checkout Button */}
              {user ? (
                <Link href="/checkout" className="block">
                  <Button 
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 sm:py-3 text-sm sm:text-lg font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isCheckingOut ? (
                      <>
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Loading Checkout...
                      </>
                    ) : (
                      <>
                        Proceed to Checkout
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </Link>
              ) : (
                <Button 
                  onClick={handleCheckout}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 sm:py-3 text-sm sm:text-lg font-medium flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  Login to Checkout
                </Button>
              )}

              {/* Continue Shopping */}
              <Button
                variant="outline"
                onClick={closeCart}
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white text-sm sm:text-base py-2 sm:py-3"
              >
                Continue Shopping
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        redirectTo="/checkout"
      />
    </>
  )
}
