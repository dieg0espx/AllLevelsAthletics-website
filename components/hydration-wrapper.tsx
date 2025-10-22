"use client"

import { useEffect, useState, ReactNode } from 'react'
import { useHydration } from '@/hooks/use-hydration'

interface HydrationWrapperProps {
  children: ReactNode
  fallback?: ReactNode
  suppressHydrationWarning?: boolean
}

/**
 * Global hydration wrapper component
 * Prevents hydration mismatches by only rendering children after client-side hydration
 * 
 * Usage:
 * <HydrationWrapper>
 *   <ComponentThatUsesBrowserAPIs />
 * </HydrationWrapper>
 */
export function HydrationWrapper({ 
  children, 
  fallback = null,
  suppressHydrationWarning = true 
}: HydrationWrapperProps) {
  const isHydrated = useHydration()

  // Show fallback during SSR and initial hydration
  if (!isHydrated) {
    return <>{fallback}</>
  }

  // Render children only after hydration is complete
  return (
    <div suppressHydrationWarning={suppressHydrationWarning}>
      {children}
    </div>
  )
}

/**
 * Conditional hydration wrapper
 * Only renders children if a condition is met AND after hydration
 */
export function ConditionalHydrationWrapper({ 
  children, 
  condition, 
  fallback = null 
}: HydrationWrapperProps & { condition: boolean }) {
  const isHydrated = useHydration()

  if (!isHydrated || !condition) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

/**
 * Safe browser API wrapper
 * Wraps components that need to access browser APIs safely
 */
export function SafeBrowserAPIWrapper({ 
  children, 
  fallback = null 
}: HydrationWrapperProps) {
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
