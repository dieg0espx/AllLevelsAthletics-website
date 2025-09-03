"use client"

import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"

export default function TestCartPage() {
  const { addItem, toggleCart, getTotalItems, state } = useCart()

  const testItems = [
    {
      id: "test-1",
      name: "Test Product 1",
      price: 29.99,
      quantity: 1,
      image: "/placeholder.jpg",
      description: "This is a test product"
    }
  ]

  const handleAddItem = (item: any) => {
    console.log('➕ Adding item:', item)
    addItem(item)
  }

  const handleToggleCart = () => {
    console.log('🔄 Toggling cart')
    console.log('🔄 Current state before toggle:', state)
    toggleCart()
    console.log('🔄 Toggle completed')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Cart Test Page</h1>
      
      <div className="space-y-6">
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Cart Status</h2>
          <p>Total items in cart: {getTotalItems()}</p>
          <p>Cart isOpen: {state.isOpen ? 'true' : 'false'}</p>
          <p>Cart items: {state.items.length}</p>
          <Button 
            onClick={handleToggleCart}
            className="mt-4 bg-orange-500 hover:bg-orange-600"
          >
            Toggle Cart
          </Button>
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Test Products</h2>
          <div className="space-y-4">
            {testItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded">
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-gray-600">{item.description}</p>
                  <p className="text-lg font-semibold text-orange-600">${item.price}</p>
                </div>
                <Button 
                  onClick={() => handleAddItem(item)}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  Add to Cart
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
