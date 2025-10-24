"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestCheckoutPage() {
  const [testResults, setTestResults] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const testCheckoutCreation = async () => {
    setIsLoading(true)
    
    try {
      // Test product checkout
      const productResponse = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{
            id: 'test-product',
            name: 'Test Product',
            price: 10.00,
            quantity: 1,
            description: 'Test product for checkout'
          }],
          shippingInfo: {
            firstName: 'Test',
            lastName: 'User',
            phone: '555-1234',
            address: '123 Test St',
            city: 'Test City',
            state: 'TS',
            zipCode: '12345',
            country: 'United States'
          },
          userEmail: 'test@example.com'
        })
      })
      
      const productData = await productResponse.json()
      
      // Test subscription checkout
      const subscriptionResponse = await fetch('/api/create-subscription-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: 'foundation',
          billingPeriod: 'monthly',
          userId: '123e4567-e89b-12d3-a456-426614174000' // Valid UUID format
        })
      })
      
      const subscriptionData = await subscriptionResponse.json()
      
      setTestResults({
        product: {
          status: productResponse.status,
          ok: productResponse.ok,
          data: productData
        },
        subscription: {
          status: subscriptionResponse.status,
          ok: subscriptionResponse.ok,
          data: subscriptionData
        }
      })
      
    } catch (error) {
      setTestResults({
        error: error.message
      })
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout Session Test</h1>
        
        <Card className="bg-gray-900 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle>Test Checkout Session Creation</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={testCheckoutCreation}
              disabled={isLoading}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isLoading ? 'Testing...' : 'Test Checkout Creation'}
            </Button>
          </CardContent>
        </Card>

        {testResults && (
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs text-gray-300 bg-gray-800 p-4 rounded overflow-auto max-h-96">
                {JSON.stringify(testResults, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
