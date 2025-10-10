"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  userRole: string | null
  loading: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [roleCache, setRoleCache] = useState<Map<string, string>>(new Map())

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
    let mounted = true
    let isInitialLoad = true

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!mounted) return
        
        setUser(session?.user ?? null)
        if (session?.user) {
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
        
        // Log auth events for debugging
        console.log('🔐 Auth state changed:', event)
        
        setUser(session?.user ?? null)
        if (session?.user) {
          // Only fetch role if we don't have it cached
          if (!roleCache.has(session.user.id)) {
            await fetchUserRole(session.user.id)
          } else {
            setUserRole(roleCache.get(session.user.id)!)
          }
        } else {
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
  }, [])

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
    signOut,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
