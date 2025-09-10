"use client"

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useSubscription } from '@/contexts/subscription-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  CreditCard, 
  Calendar, 
  Settings, 
  Crown, 
  TrendingUp, 
  Star,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

interface SubscriptionManagementProps {
  onUpgrade?: () => void
}

export function SubscriptionManagement({ onUpgrade }: SubscriptionManagementProps) {
  const { user } = useAuth()
  const { 
    subscription, 
    userProfile, 
    loading, 
    error, 
    refreshSubscription,
    hasActiveSubscription,
    isTrialing 
  } = useSubscription()
  
  const [isLoading, setIsLoading] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)

  const handleSubscribe = async (planId: string, billingPeriod: 'monthly' | 'annual') => {
    if (!user) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/create-subscription-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          billingPeriod,
          userId: user.id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe checkout
      const stripe = await stripePromise
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        })

        if (error) {
          console.error('Stripe checkout error:', error)
        }
      }
    } catch (error) {
      console.error('Error creating subscription:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleManageSubscription = async () => {
    if (!user) return

    setPortalLoading(true)
    try {
      const response = await fetch('/api/create-customer-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create portal session')
      }

      // Redirect to Stripe customer portal
      window.location.href = data.sessionUrl
    } catch (error) {
      console.error('Error opening customer portal:', error)
    } finally {
      setPortalLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>
      case 'trialing':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Trial</Badge>
      case 'past_due':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Past Due</Badge>
      case 'canceled':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Canceled</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'foundation':
        return <Star className="h-5 w-5 text-orange-400" />
      case 'growth':
        return <TrendingUp className="h-5 w-5 text-yellow-400" />
      case 'elite':
        return <Crown className="h-5 w-5 text-orange-300" />
      default:
        return <CreditCard className="h-5 w-5" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2">Loading subscription...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error loading subscription: {error}
        </AlertDescription>
      </Alert>
    )
  }

  if (!hasActiveSubscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Subscription
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="h-8 w-8 text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Active Subscription</h3>
            <p className="text-muted-foreground mb-4">
              Subscribe to one of our coaching plans to access personalized training programs and expert guidance.
            </p>
            <Button 
              onClick={() => onUpgrade?.()}
              className="bg-orange-500 hover:bg-orange-600"
            >
              View Plans
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Subscription
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Plan */}
        <div className="flex items-center justify-between p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
          <div className="flex items-center gap-3">
            {getPlanIcon(subscription?.plan_id || '')}
            <div>
              <h3 className="font-semibold">{subscription?.plan_name}</h3>
              <p className="text-sm text-muted-foreground">
                {subscription?.plan_id === 'foundation' && 'Perfect for beginners'}
                {subscription?.plan_id === 'growth' && 'Ideal for committed individuals'}
                {subscription?.plan_id === 'elite' && 'Maximum support for serious athletes'}
              </p>
            </div>
          </div>
          {getStatusBadge(subscription?.status || '')}
        </div>

        {/* Trial Information */}
        {isTrialing && subscription?.trial_end && (
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              Your free trial ends on {formatDate(subscription.trial_end)}. 
              You'll be charged automatically unless you cancel.
            </AlertDescription>
          </Alert>
        )}

        {/* Subscription Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Current Period:</span>
            </div>
            <p className="text-sm">
              {subscription?.current_period_start && subscription?.current_period_end && (
                <>
                  {formatDate(subscription.current_period_start)} - {formatDate(subscription.current_period_end)}
                </>
              )}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Settings className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Status:</span>
            </div>
            <p className="text-sm capitalize">{subscription?.status?.replace('_', ' ')}</p>
          </div>
        </div>

        {/* Cancellation Notice */}
        {subscription?.cancel_at_period_end && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your subscription will be canceled at the end of the current billing period.
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-4">
          <Button 
            onClick={handleManageSubscription}
            disabled={portalLoading}
            variant="outline"
            className="flex-1"
          >
            {portalLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Loading...
              </>
            ) : (
              <>
                <Settings className="h-4 w-4 mr-2" />
                Manage Subscription
              </>
            )}
          </Button>
          
          {!hasActiveSubscription && (
            <Button 
              onClick={() => onUpgrade?.()}
              className="flex-1 bg-orange-500 hover:bg-orange-600"
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade Plan
            </Button>
          )}
        </div>

        {/* Refresh Button */}
        <Button 
          onClick={refreshSubscription}
          variant="ghost"
          size="sm"
          className="w-full"
        >
          Refresh Status
        </Button>
      </CardContent>
    </Card>
  )
}



