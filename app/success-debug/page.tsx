"use client"

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSafeAuth } from '@/contexts/safe-auth-context'
import { useSafeSubscription } from '@/contexts/safe-subscription-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, User, CreditCard, Database } from 'lucide-react'

export default function SuccessPageDebug() {
  const searchParams = useSearchParams()
  const { user, userRole, isHydrated, loading: authLoading } = useSafeAuth()
  const { subscription, loading: subscriptionLoading } = useSafeSubscription()
  
  const [sessionData, setSessionData] = useState<any>(null)
  const [sessionError, setSessionError] = useState<string | null>(null)
  const [isLoadingSession, setIsLoadingSession] = useState(false)
  
  const sessionId = searchParams.get('session_id')
  
  useEffect(() => {
    if (sessionId && isHydrated) {
      setIsLoadingSession(true)
      setSessionError(null)
      
      fetch(`/api/get-checkout-session?session_id=${sessionId}`)
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
          }
          return res.json()
        })
        .then(data => {
          if (data.error) {
            setSessionError(data.error)
          } else {
            setSessionData(data.session)
          }
        })
        .catch(err => {
          setSessionError(err.message)
        })
        .finally(() => {
          setIsLoadingSession(false)
        })
    }
  }, [sessionId, isHydrated])
  
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
          <h1 className="text-3xl font-bold mb-4">Success Page Debug</h1>
          <p className="text-gray-300">
            This page shows the current state of the success page components and data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Authentication Status */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="w-5 h-5" />
                Authentication Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Is Hydrated</span>
                <Badge className={isHydrated ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                  {isHydrated ? 'Yes' : 'No'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Auth Loading</span>
                <Badge className={authLoading ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}>
                  {authLoading ? 'Loading' : 'Loaded'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">User ID</span>
                <span className="text-white font-mono text-sm">
                  {user?.id ? `${user.id.substring(0, 8)}...` : 'None'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">User Role</span>
                <Badge className="bg-blue-500/20 text-blue-400">
                  {userRole || 'None'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Session Status */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Session Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Session ID</span>
                <span className="text-white font-mono text-sm">
                  {sessionId ? `${sessionId.substring(0, 12)}...` : 'None'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Loading Session</span>
                <Badge className={isLoadingSession ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}>
                  {isLoadingSession ? 'Loading' : 'Loaded'}
                </Badge>
              </div>
              {sessionData && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Payment Status</span>
                    {getStatusBadge(sessionData.payment_status)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Mode</span>
                    <Badge className="bg-blue-500/20 text-blue-400">
                      {sessionData.mode}
                    </Badge>
                  </div>
                </>
              )}
              {sessionError && (
                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm">{sessionError}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Subscription Status */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Database className="w-5 h-5" />
                Subscription Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Loading</span>
                <Badge className={subscriptionLoading ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}>
                  {subscriptionLoading ? 'Loading' : 'Loaded'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Plan Name</span>
                <Badge className="bg-purple-500/20 text-purple-400">
                  {subscription?.plan_name || 'None'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Status</span>
                <Badge className="bg-orange-500/20 text-orange-400">
                  {subscription?.status || 'None'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Page State Analysis */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Page State Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Determine what the page should show */}
                {!isHydrated && (
                  <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                    <p className="text-yellow-400 text-sm">
                      <strong>Current State:</strong> Waiting for hydration
                    </p>
                    <p className="text-yellow-300 text-xs mt-1">
                      Page should show loading spinner
                    </p>
                  </div>
                )}
                
                {isHydrated && authLoading && (
                  <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                    <p className="text-yellow-400 text-sm">
                      <strong>Current State:</strong> Loading authentication
                    </p>
                    <p className="text-yellow-300 text-xs mt-1">
                      Page should show loading spinner
                    </p>
                  </div>
                )}
                
                {isHydrated && !authLoading && !user && (
                  <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                    <p className="text-red-400 text-sm">
                      <strong>Current State:</strong> No authenticated user
                    </p>
                    <p className="text-red-300 text-xs mt-1">
                      This might cause issues with session data loading
                    </p>
                  </div>
                )}
                
                {isHydrated && !authLoading && user && isLoadingSession && (
                  <div className="p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                    <p className="text-blue-400 text-sm">
                      <strong>Current State:</strong> Loading session data
                    </p>
                    <p className="text-blue-300 text-xs mt-1">
                      Page should show loading spinner
                    </p>
                  </div>
                )}
                
                {isHydrated && !authLoading && user && !isLoadingSession && sessionError && (
                  <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                    <p className="text-red-400 text-sm">
                      <strong>Current State:</strong> Session data error
                    </p>
                    <p className="text-red-300 text-xs mt-1">
                      Page should show error message
                    </p>
                  </div>
                )}
                
                {isHydrated && !authLoading && user && !isLoadingSession && sessionData && (
                  <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                    <p className="text-green-400 text-sm">
                      <strong>Current State:</strong> Ready to show success page
                    </p>
                    <p className="text-green-300 text-xs mt-1">
                      All data loaded successfully
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <Button 
            onClick={() => window.location.reload()}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Page
          </Button>
          <Button 
            onClick={() => window.location.href = '/success' + (sessionId ? `?session_id=${sessionId}` : '')}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Go to Success Page
          </Button>
        </div>
      </div>
    </div>
  )
}
