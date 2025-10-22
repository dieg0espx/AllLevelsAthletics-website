"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSafeAuth } from '@/contexts/safe-auth-context'

interface AdminRedirectProps {
  children: React.ReactNode
}

export function AdminRedirect({ children }: AdminRedirectProps) {
  const { user, loading, isHydrated } = useSafeAuth()
  const router = useRouter()

  useEffect(() => {
    // Only run on client side to prevent hydration mismatches
    if (typeof window === 'undefined') return
    
    // Only redirect if user is loaded and authenticated
    if (!loading && user && user.user_metadata?.role === 'admin') {
      // Check if we're already on an admin page
      const currentPath = window.location.pathname
      const isAdminPage = currentPath.startsWith('/admin')
      
      console.log('🔍 AdminRedirect check:', { currentPath, isAdminPage, userRole: user.user_metadata?.role })
      
      if (!isAdminPage) {
        console.log('🔄 Redirecting admin to /admin')
        router.push('/admin')
      }
    }
  }, [user, loading, router])

  // Don't render until hydrated to prevent SSR issues
  if (!isHydrated) {
    return null
  }

  return <>{children}</>
}


