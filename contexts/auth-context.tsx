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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [fetchingRole, setFetchingRole] = useState(false)
  const [lastFetchTime, setLastFetchTime] = useState(0)

  // Function to fetch user role with debouncing
  const fetchUserRole = async (userId: string) => {
    const now = Date.now()
    
    // Prevent multiple simultaneous calls and rapid successive calls
    if (fetchingRole || (now - lastFetchTime < 1000)) {
      return
    }

    try {
      setFetchingRole(true)
      
      // First try to get role from user metadata
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user?.user_metadata?.role) {
        setUserRole(user.user_metadata.role)
        return
      }

      // Fallback to API call
      const response = await fetch(`/api/user-profile?userId=${userId}`)
      const data = await response.json()
      
      if (response.ok && data.profile) {
        setUserRole(data.profile.role || 'client')
      } else {
        setUserRole('client') // Default role
      }
    } catch (error) {
      setUserRole('client') // Default role
    } finally {
      setFetchingRole(false)
      setLastFetchTime(Date.now())
    }
  }

  useEffect(() => {
    let isInitialLoad = true

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchUserRole(session.user.id)
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
      } finally {
        setLoading(false)
        isInitialLoad = false
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Skip the initial session event since we already handled it
        if (isInitialLoad && event === 'INITIAL_SESSION') {
          return
        }
        
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchUserRole(session.user.id)
        } else {
          setUserRole(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    try {
      console.log('🚪 Attempting to sign out...')
      await supabase.auth.signOut()
      console.log('✅ Sign out successful')
      setUser(null)
      setUserRole(null)
    } catch (error) {
      console.error('❌ Error signing out:', error)
    }
  }

  const value = {
    user,
    userRole,
    loading,
    signOut,
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
