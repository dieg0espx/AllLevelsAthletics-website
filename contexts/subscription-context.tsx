"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useAuth } from './auth-context'
import { supabase } from '@/lib/supabase'

interface Subscription {
  id: string
  user_id: string
  stripe_customer_id: string
  stripe_subscription_id: string
  plan_id: string
  plan_name: string
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'incomplete' | 'trialing'
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  canceled_at?: string
  trial_start?: string
  trial_end?: string
  created_at: string
  updated_at: string
}

interface UserProfile {
  stripe_customer_id?: string
  current_plan?: string
  subscription_status?: string
}

interface SubscriptionContextType {
  subscription: Subscription | null
  userProfile: UserProfile | null
  loading: boolean
  error: string | null
  refreshSubscription: () => Promise<void>
  hasActiveSubscription: boolean
  isTrialing: boolean
  canAccessContent: boolean
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fetching, setFetching] = useState(false)
  const [lastFetchTime, setLastFetchTime] = useState(0)

  const fetchSubscription = async (forceRefresh = false) => {
    if (!user) {
      setSubscription(null)
      setUserProfile(null)
      setLoading(false)
      return
    }

    const now = Date.now()
    
    // Prevent multiple simultaneous calls and rapid successive calls (unless forced)
    if (fetching || (!forceRefresh && (now - lastFetchTime < 2000))) {
      console.log('⏳ Subscription fetch already in progress or too recent, skipping...')
      return
    }

    try {
      setFetching(true)
      setLoading(true)
      setError(null)

      console.log('🔄 Fetching subscription for user:', user.id)
      const response = await fetch(`/api/user-subscription?userId=${user.id}`)
      
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch subscription')
      }

      console.log('✅ Subscription data fetched successfully')
      setSubscription(data.subscription)
      setUserProfile(data.userProfile)
    } catch (err) {
      console.error('❌ Error fetching subscription:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch subscription')
    } finally {
      setLoading(false)
      setFetching(false)
      setLastFetchTime(Date.now())
    }
  }

  const refreshSubscription = async () => {
    await fetchSubscription(true) // Force refresh
  }

  useEffect(() => {
    fetchSubscription()
  }, [user])

  // Computed values
  const hasActiveSubscription = subscription?.status === 'active' || subscription?.status === 'trialing'
  const isTrialing = subscription?.status === 'trialing'
  const canAccessContent = hasActiveSubscription

  const value = {
    subscription,
    userProfile,
    loading,
    error,
    refreshSubscription,
    hasActiveSubscription,
    isTrialing,
    canAccessContent,
  }

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider')
  }
  return context
}



