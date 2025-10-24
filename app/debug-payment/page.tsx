"use client"

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function DebugPaymentPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const runDiagnostics = async () => {
    setIsLoading(true)
    
    const diagnostics = {
      url: window.location.href,
      sessionId: sessionId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      localStorage: {
        cartItems: localStorage.getItem('cartItems'),
        shippingInfo: localStorage.getItem('shippingInfo'),
        planData: localStorage.getItem('planData')
      },
      apiTests: {}
    }

    // Test API endpoints
    try {
      if (sessionId) {
        const response = await fetch(`/api/get-checkout-session?session_id=${sessionId}`)
        const data = await response.json()
        diagnostics.apiTests.sessionRetrieval = {
          status: response.status,
          ok: response.ok,
          data: data
        }
      }
    } catch (error) {
      diagnostics.apiTests.sessionRetrieval = {
        error: error.message
      }
    }

    // Test user subscription endpoint
    try {
      const response = await fetch('/api/user-subscription?userId=test')
      const data = await response.json()
      diagnostics.apiTests.userSubscription = {
        status: response.status,
        ok: response.ok,
        data: data
      }
    } catch (error) {
      diagnostics.apiTests.userSubscription = {
        error: error.message
      }
    }

    setDebugInfo(diagnostics)
    setIsLoading(false)
  }

  useEffect(() => {
    runDiagnostics()
  }, [])

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Payment Debug Information</h1>
        
        <Card className="bg-gray-900 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle>Current Page Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div><strong>URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}</div>
              <div><strong>Session ID:</strong> {sessionId || 'None'}</div>
              <div><strong>Page:</strong> {typeof window !== 'undefined' ? window.location.pathname : 'N/A'}</div>
              <div><strong>Timestamp:</strong> {new Date().toISOString()}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle>Diagnostic Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={runDiagnostics}
              disabled={isLoading}
              className="bg-orange-500 hover:bg-orange-600 text-white mb-4"
            >
              {isLoading ? 'Running Diagnostics...' : 'Run Diagnostics'}
            </Button>
            
            {debugInfo && (
              <div className="mt-4">
                <pre className="text-xs text-gray-300 bg-gray-800 p-4 rounded overflow-auto max-h-96">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle>Common Issues & Solutions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-orange-400 mb-2">1. Session Not Found</h3>
              <p className="text-sm text-gray-300">
                If you see "No such checkout.session", the session may have expired or been invalidated.
                This can happen if you refresh the page after payment completion.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-orange-400 mb-2">2. Missing Session ID</h3>
              <p className="text-sm text-gray-300">
                If sessionId is "None", the redirect from Stripe didn't include the session_id parameter.
                Check your Stripe checkout session configuration.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-orange-400 mb-2">3. Authentication Issues</h3>
              <p className="text-sm text-gray-300">
                If user data is missing, there may be an issue with the authentication context.
                Try logging out and back in.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
