"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'

interface AdminRedirectProps {
  children: React.ReactNode
}

export function AdminRedirect({ children }: AdminRedirectProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
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

  return <>{children}</>
}


