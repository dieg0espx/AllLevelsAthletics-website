"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react'

export default function CheckoutDebugPage() {
  const [sessionId, setSessionId] = useState('')
  const [debugResult, setDebugResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runDebug = async () => {
    if (!sessionId.trim()) {
      setError('Please enter a session ID')
      return
    }

    setIsLoading(true)
    setError(null)
    setDebugResult(null)

    try {
      const response = await fetch(`/api/debug-checkout-flow?session_id=${sessionId}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Debug request failed')
      }
      
      setDebugResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'unpaid':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Paid</Badge>
      case 'unpaid':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Unpaid</Badge>
      default:
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Unknown</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Checkout Flow Debug Tool</h1>
          <p className="text-gray-300">
            Use this tool to diagnose checkout confirmation issues. Enter a Stripe session ID to get detailed information.
          </p>
        </div>

        <Card className="bg-gray-900 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Debug Session</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Input
                placeholder="Enter Stripe session ID (cs_xxxxx)"
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
                className="flex-1 bg-gray-800 border-gray-600 text-white"
              />
              <Button 
                onClick={runDebug}
                disabled={isLoading}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  'Debug'
                )}
              </Button>
            </div>
            
            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-400">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {debugResult && (
          <div className="space-y-6">
            {/* Environment Check */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Environment Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400">Stripe Secret Key</p>
                    <Badge className={debugResult.envCheck.STRIPE_SECRET_KEY ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                      {debugResult.envCheck.STRIPE_SECRET_KEY ? 'Configured' : 'Missing'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-gray-400">Key Type</p>
                    <Badge className="bg-blue-500/20 text-blue-400">
                      {debugResult.envCheck.STRIPE_SECRET_KEY_TYPE}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-gray-400">Webhook Secret</p>
                    <Badge className={debugResult.envCheck.STRIPE_WEBHOOK_SECRET ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                      {debugResult.envCheck.STRIPE_WEBHOOK_SECRET ? 'Configured' : 'Missing'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-gray-400">Environment</p>
                    <Badge className="bg-purple-500/20 text-purple-400">
                      {debugResult.envCheck.NODE_ENV}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Session Status */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  {getStatusIcon(debugResult.sessionStatus.payment_status)}
                  Session Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Payment Status</span>
                    {getStatusBadge(debugResult.sessionStatus.payment_status)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Mode</span>
                    <Badge className="bg-blue-500/20 text-blue-400">
                      {debugResult.sessionStatus.mode}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Customer ID</span>
                    <span className="text-white font-mono text-sm">
                      {debugResult.sessionStatus.customer_id || 'None'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Subscription ID</span>
                    <span className="text-white font-mono text-sm">
                      {debugResult.sessionStatus.subscription_id || 'None'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Diagnosis */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Diagnosis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                    <h4 className="font-semibold text-blue-400 mb-2">Issue Identified:</h4>
                    <p className="text-white">{debugResult.diagnosis}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-2">Recommendations:</h4>
                    <ul className="space-y-2">
                      {debugResult.recommendations.map((rec: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-orange-400 mt-1">•</span>
                          <span className="text-gray-300">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Webhook Events */}
            {debugResult.webhookEvents.length > 0 && (
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Webhook Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {debugResult.webhookEvents.map((event: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <p className="text-white font-mono text-sm">{event.id}</p>
                          <p className="text-gray-400 text-xs">
                            {new Date(event.created * 1000).toLocaleString()}
                          </p>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400">Processed</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
