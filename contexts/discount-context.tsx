"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

interface DiscountContextType {
  coachingDiscount: number
  productsDiscount: number
  loading: boolean
  refreshDiscounts: () => Promise<void>
}

const DiscountContext = createContext<DiscountContextType>({
  coachingDiscount: 0,
  productsDiscount: 0,
  loading: true,
  refreshDiscounts: async () => {},
})

export function DiscountProvider({ children }: { children: React.ReactNode }) {
  const [coachingDiscount, setCoachingDiscount] = useState(0)
  const [productsDiscount, setProductsDiscount] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchDiscounts = async () => {
    try {
      const response = await fetch('/api/discounts')
      if (response.ok) {
        const data = await response.json()
        setCoachingDiscount(data.coaching || 0)
        setProductsDiscount(data.products || 0)
      }
    } catch (error) {
      console.error('Error fetching discounts:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch discounts on mount and refresh every 60 seconds
  useEffect(() => {
    let mounted = true
    
    const fetchDiscountsIfMounted = async () => {
      if (mounted) {
        await fetchDiscounts()
      }
    }
    
    fetchDiscountsIfMounted()
    
    // Refresh discounts every minute to stay in sync
    const interval = setInterval(fetchDiscountsIfMounted, 60000)
    
    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [])

  return (
    <DiscountContext.Provider
      value={{
        coachingDiscount,
        productsDiscount,
        loading,
        refreshDiscounts: fetchDiscounts,
      }}
    >
      {children}
    </DiscountContext.Provider>
  )
}

export function useDiscount() {
  const context = useContext(DiscountContext)
  if (!context) {
    throw new Error('useDiscount must be used within DiscountProvider')
  }
  return context
}

