"use client"

import { ReactNode, useEffect, useState } from 'react'
import { useHydration } from '@/hooks/use-hydration'

interface SafeContextWrapperProps {
  children: ReactNode
  fallback?: ReactNode
}

/**
 * Wrapper for contexts that might cause hydration issues
 * Only renders children after hydration is complete
 */
export function SafeContextWrapper({ children, fallback = null }: SafeContextWrapperProps) {
  const isHydrated = useHydration()

  if (!isHydrated) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

/**
 * Wrapper specifically for auth-related components
 * Prevents auth state from causing hydration mismatches
 */
export function SafeAuthWrapper({ children, fallback = null }: SafeContextWrapperProps) {
  const isHydrated = useHydration()

  if (!isHydrated) {
    return <>{fallback}</>
  }

  return (
    <div suppressHydrationWarning>
      {children}
    </div>
  )
}

/**
 * Wrapper for subscription-related components
 * Prevents subscription API calls from causing hydration mismatches
 */
export function SafeSubscriptionWrapper({ children, fallback = null }: SafeContextWrapperProps) {
  const isHydrated = useHydration()

  if (!isHydrated) {
    return <>{fallback}</>
  }

  return (
    <div suppressHydrationWarning>
      {children}
    </div>
  )
}
