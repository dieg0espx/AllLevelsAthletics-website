"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { useHydration } from '@/hooks/use-hydration'

interface SafeAuthContextType {
  user: User | null
  userRole: string | null
  loading: boolean
  isHydrated: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const SafeAuthContext = createContext<SafeAuthContextType | undefined>(undefined)

export function SafeAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [roleCache, setRoleCache] = useState<Map<string, string>>(new Map())
  const isHydrated = useHydration()

  // Optimized function to fetch user role with caching
  const fetchUserRole = async (userId: string) => {
    // Check cache first
    if (roleCache.has(userId)) {
      setUserRole(roleCache.get(userId)!)
      return
    }

    try {
      // First try to get role from user metadata (fastest)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user?.user_metadata?.role) {
        const role = user.user_metadata.role
        setUserRole(role)
        setRoleCache(prev => new Map(prev).set(userId, role))
        return
      }

      // Fallback to API call only if needed
      const response = await fetch(`/api/user-profile?userId=${userId}`, {
        cache: 'no-store' // Prevent caching issues
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch user profile')
      }
      
      const data = await response.json()
      const role = data.profile?.role || 'client'
      
      setUserRole(role)
      setRoleCache(prev => new Map(prev).set(userId, role))
    } catch (error) {
      console.error('Error fetching user role:', error)
      const defaultRole = 'client'
      setUserRole(defaultRole)
      setRoleCache(prev => new Map(prev).set(userId, defaultRole))
    }
  }

  useEffect(() => {
    // Only run after hydration is complete
    if (!isHydrated) return
    
    let mounted = true
    let isInitialLoad = true
    let lastEventTime = 0
    let lastUserId: string | null = null

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!mounted) return
        
        setUser(session?.user ?? null)
        if (session?.user) {
          lastUserId = session.user.id
          await fetchUserRole(session.user.id)
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
      } finally {
        if (mounted) {
          setLoading(false)
          isInitialLoad = false
        }
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        
        // Skip duplicate initial session events
        if (isInitialLoad && event === 'INITIAL_SESSION') {
          return
        }
        
        // Prevent rapid duplicate events (within 100ms)
        const now = Date.now()
        if (now - lastEventTime < 100 && session?.user?.id === lastUserId) {
          console.log('🔐 Skipping duplicate auth event:', event)
          return
        }
        lastEventTime = now
        
        // Log auth events for debugging
        console.log('🔐 Auth state changed:', event, session?.user?.id ? `(User: ${session.user.id.substring(0, 8)}...)` : '(No user)')
        
        setUser(session?.user ?? null)
        if (session?.user) {
          lastUserId = session.user.id
          // Only fetch role if we don't have it cached
          if (!roleCache.has(session.user.id)) {
            await fetchUserRole(session.user.id)
          } else {
            setUserRole(roleCache.get(session.user.id)!)
          }
        } else {
          lastUserId = null
          setUserRole(null)
        }
        
        if (mounted) {
          setLoading(false)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [isHydrated])

  const refreshUser = async () => {
    try {
      console.log('🔄 Refreshing user data...')
      const { data: { user: refreshedUser } } = await supabase.auth.getUser()
      setUser(refreshedUser)
      
      if (refreshedUser) {
        await fetchUserRole(refreshedUser.id)
      }
      console.log('✅ User data refreshed')
    } catch (error) {
      console.error('❌ Error refreshing user data:', error)
    }
  }

  const signOut = async () => {
    try {
      console.log('🚪 Attempting to sign out...')
      
      // Clear local state immediately for better UX
      setUser(null)
      setUserRole(null)
      setRoleCache(new Map())
      
      // Sign out from Supabase
      await supabase.auth.signOut()
      console.log('✅ Sign out successful')
      
      // Redirect to home page
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    } catch (error) {
      console.error('❌ Error signing out:', error)
      // Even if there's an error, we've already cleared local state
      // Still redirect to home page
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    }
  }

  const value = {
    user,
    userRole,
    loading,
    isHydrated,
    signOut,
    refreshUser,
  }

  return (
    <SafeAuthContext.Provider value={value}>
      {children}
    </SafeAuthContext.Provider>
  )
}

export function useSafeAuth() {
  const context = useContext(SafeAuthContext)
  if (context === undefined) {
    throw new Error('useSafeAuth must be used within a SafeAuthProvider')
  }
  return context
}
