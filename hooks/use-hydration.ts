"use client"

import { useEffect, useState } from 'react'

/**
 * Custom hook to handle hydration state
 * Returns true only after the component has mounted on the client side
 * This prevents hydration mismatches by ensuring client-side only rendering
 */
export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // Mark as hydrated after the component mounts on the client
    setIsHydrated(true)
  }, [])

  return isHydrated
}

/**
 * Custom hook to safely access browser APIs
 * Returns null during SSR and the actual value after hydration
 */
export function useClientOnly<T>(value: T): T | null {
  const isHydrated = useHydration()
  return isHydrated ? value : null
}

/**
 * Custom hook for safe localStorage access
 * Returns null during SSR and the actual value after hydration
 */
export function useSafeLocalStorage<T>(key: string, defaultValue: T): T | null {
  const isHydrated = useHydration()
  
  if (!isHydrated) return null
  
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error)
    return defaultValue
  }
}

/**
 * Custom hook for safe window object access
 * Returns null during SSR and the actual value after hydration
 */
export function useSafeWindow(): Window | null {
  const isHydrated = useHydration()
  return isHydrated ? window : null
}
