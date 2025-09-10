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
      console.log('⏳ Role fetch already in progress or too recent, skipping...')
      return
    }

    try {
      setFetchingRole(true)
      console.log('🔍 Fetching user role for:', userId)
      
      // First try to get role from user metadata
      const { data: { user } } = await supabase.auth.getUser()
      console.log('👤 Current user:', user?.email, 'Metadata:', user?.user_metadata)
      
      if (user?.user_metadata?.role) {
        console.log('✅ Found role in metadata:', user.user_metadata.role)
        setUserRole(user.user_metadata.role)
        return
      }

      // Fallback to API call
      console.log('🔄 Trying API call for role...')
      const response = await fetch(`/api/user-profile?userId=${userId}`)
      const data = await response.json()
      console.log('📡 API response status:', response.status)
      console.log('📡 API response data:', JSON.stringify(data, null, 2))
      
      if (response.ok && data.profile) {
        console.log('✅ Found role in profile:', data.profile.role)
        setUserRole(data.profile.role || 'client')
      } else {
        console.log('❌ No role found, defaulting to client')
        console.log('❌ Response ok:', response.ok, 'Profile exists:', !!data.profile)
        setUserRole('client') // Default role
      }
    } catch (error) {
      console.error('❌ Error fetching user role:', error)
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
