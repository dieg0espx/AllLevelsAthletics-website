"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'

interface AdminRedirectProps {
  children: React.ReactNode
}

export function AdminRedirect({ children }: AdminRedirectProps) {
  const { user, userRole, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Only redirect if user is loaded and authenticated
    if (!loading && user && userRole === 'admin') {
      // Check if we're already on an admin page
      const currentPath = window.location.pathname
      const isAdminPage = currentPath.startsWith('/admin')
      
      if (!isAdminPage) {
        router.push('/admin')
      }
    }
  }, [user, userRole, loading, router])

  // Don't render children if user is admin and not on admin page
  if (!loading && user && userRole === 'admin') {
    const currentPath = window.location.pathname
    const isAdminPage = currentPath.startsWith('/admin')
    
    if (!isAdminPage) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-white/70">Redirecting to admin dashboard...</p>
          </div>
        </div>
      )
    }
  }

  return <>{children}</>
}
