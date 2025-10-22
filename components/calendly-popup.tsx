"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { X, Calendar, Loader2 } from "lucide-react"

// Declare Calendly global
declare global {
  interface Window {
    Calendly?: any;
  }
}

interface CalendlyPopupProps {
  isOpen: boolean
  onClose: () => void
  url?: string
}

export default function CalendlyPopup({ isOpen, onClose, url = "https://calendly.com/alllevelsathletics/fitnessconsultation" }: CalendlyPopupProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const widgetRef = useRef<HTMLDivElement>(null)

  // Load Calendly script when popup opens
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return
    
    if (isOpen) {
      setIsLoading(true)
      setHasError(false)
      console.log('Calendly popup opened, checking for script...')
      
      // Check if Calendly is already available
      if (window.Calendly) {
        console.log('Calendly already available')
        setIsLoading(false)
        return
      }

      // Check if script is already in DOM
      const existingScript = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]')
      
      if (existingScript) {
        console.log('Script exists in DOM, waiting for Calendly...')
        // Script exists, wait for it to load
        const checkCalendly = setInterval(() => {
          if (window.Calendly) {
            console.log('Calendly loaded successfully')
            setIsLoading(false)
            clearInterval(checkCalendly)
          }
        }, 100)

        // Timeout after 10 seconds (increased from 5)
        setTimeout(() => {
          console.log('Timeout reached, stopping loading')
          clearInterval(checkCalendly)
          setIsLoading(false)
          setHasError(true)
        }, 10000)

        return () => clearInterval(checkCalendly)
      }

      console.log('Loading Calendly script...')
      // Load the script
      const script = document.createElement('script')
      script.src = 'https://assets.calendly.com/assets/external/widget.js'
      script.async = true
      script.onload = () => {
        console.log('Script loaded, waiting for Calendly initialization...')
        // Wait for Calendly to be available
        const checkCalendly = setInterval(() => {
          if (window.Calendly) {
            console.log('Calendly loaded successfully')
            setIsLoading(false)
            clearInterval(checkCalendly)
          }
        }, 100)

        // Timeout after 10 seconds
        setTimeout(() => {
          console.log('Timeout reached, stopping loading')
          clearInterval(checkCalendly)
          setIsLoading(false)
          setHasError(true)
        }, 10000)
      }
      script.onerror = () => {
        console.error('Failed to load Calendly script')
        setIsLoading(false)
        setHasError(true)
      }
      
      document.body.appendChild(script)
    }
  }, [isOpen])

  // Initialize Calendly widget when not loading
  useEffect(() => {
    if (!isLoading && isOpen && window.Calendly && widgetRef.current) {
      console.log('Initializing Calendly widget...')
      try {
        window.Calendly.initInlineWidget({
          url: url,
          parentElement: widgetRef.current,
          prefill: {},
          utm: {}
        })
      } catch (error) {
        console.error('Error initializing Calendly widget:', error)
      }
    }
  }, [isLoading, isOpen, url])

  // Handle escape key
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Schedule Your Free Consultation</h2>
                <p className="text-orange-100">Choose a time that works for you</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20 hover:text-white"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="relative">
          {/* Loading State */}
          {isLoading && !hasError && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
                <p className="text-gray-600">Loading calendar...</p>
                <div className="mt-4 space-y-2">
                  <Button 
                    onClick={onClose}
                    variant="outline" 
                  >
                    Close
                  </Button>
                  <Button 
                    onClick={() => window.open(url, '_blank')}
                    className="ml-2"
                  >
                    Open in New Tab
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {hasError && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Calendar</h3>
                <p className="text-gray-600 mb-6">
                  There was an issue loading the calendar. You can still book your session by clicking the button below.
                </p>
                <div className="space-y-3">
                  <Button 
                    onClick={() => window.open(url, '_blank')}
                    className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold py-3 hover:from-orange-600 hover:to-yellow-600 transition-all duration-300"
                  >
                    Open Calendar in New Tab
                  </Button>
                  <Button 
                    onClick={onClose}
                    variant="outline"
                    className="w-full"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Calendly Content */}
          {!isLoading && !hasError && (
            <div className="p-0">
              <div 
                ref={widgetRef}
                className="calendly-inline-widget" 
                data-url={url}
                style={{ minWidth: '320px', height: '600px' }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
