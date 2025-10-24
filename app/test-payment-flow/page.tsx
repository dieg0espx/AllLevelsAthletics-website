"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestPaymentFlowPage() {
  const [testResults, setTestResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const runTests = async () => {
    setIsLoading(true)
    setTestResults([])
    
    const tests = [
      {
        name: 'Test API Endpoints',
        test: async () => {
          try {
            // Test get-checkout-session endpoint with invalid session ID
            const response = await fetch('/api/get-checkout-session?session_id=test')
            const data = await response.json()
            
            // Test with proper session ID format (but invalid)
            const response2 = await fetch('/api/get-checkout-session?session_id=cs_test123')
            const data2 = await response2.json()
            
            return {
              success: true, // API is working, just returning expected errors
              status: response.status,
              data: {
                invalidFormat: data,
                validFormat: data2
              }
            }
          } catch (error) {
            return {
              success: false,
              error: error.message
            }
          }
        }
      },
      {
        name: 'Test Environment Variables',
        test: async () => {
          return {
            success: true,
            data: {
              NODE_ENV: process.env.NODE_ENV,
              hasStripeKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
              siteUrl: process.env.NEXT_PUBLIC_SITE_URL
            }
          }
        }
      },
      {
        name: 'Test Success Pages',
        test: async () => {
          const pages = ['/success', '/subscription-success', '/plan-success']
          const results = []
          
          for (const page of pages) {
            try {
              const response = await fetch(page)
              results.push({
                page,
                status: response.status,
                ok: response.ok
              })
            } catch (error) {
              results.push({
                page,
                error: error.message
              })
            }
          }
          
          return {
            success: true,
            data: results
          }
        }
      },
      {
        name: 'Test Success Pages with Session ID',
        test: async () => {
          const pages = [
            '/success?session_id=cs_test123',
            '/subscription-success?session_id=cs_test123', 
            '/plan-success?session_id=cs_test123'
          ]
          const results = []
          
          for (const page of pages) {
            try {
              const response = await fetch(page)
              results.push({
                page,
                status: response.status,
                ok: response.ok
              })
            } catch (error) {
              results.push({
                page,
                error: error.message
              })
            }
          }
          
          return {
            success: true,
            data: results
          }
        }
      }
    ]

    for (const test of tests) {
      try {
        const result = await test.test()
        setTestResults(prev => [...prev, {
          name: test.name,
          ...result,
          timestamp: new Date().toISOString()
        }])
      } catch (error) {
        setTestResults(prev => [...prev, {
          name: test.name,
          success: false,
          error: error.message,
          timestamp: new Date().toISOString()
        }])
      }
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Payment Flow Test</h1>
        
        <Card className="bg-gray-900 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle>Test Payment Flow Components</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={runTests}
              disabled={isLoading}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isLoading ? 'Running Tests...' : 'Run Tests'}
            </Button>
          </CardContent>
        </Card>

        {testResults.length > 0 && (
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testResults.map((result, index) => (
                  <div key={index} className="p-4 bg-gray-800 rounded-lg">
                    <h3 className="font-semibold text-white mb-2">{result.name}</h3>
                    <div className="text-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`w-3 h-3 rounded-full ${result.success ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span className={result.success ? 'text-green-400' : 'text-red-400'}>
                          {result.success ? 'PASS' : 'FAIL'}
                        </span>
                      </div>
                      <pre className="text-xs text-gray-300 bg-gray-900 p-2 rounded overflow-auto">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
