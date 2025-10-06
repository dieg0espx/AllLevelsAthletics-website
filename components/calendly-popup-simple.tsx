"use client"

import { Button } from "@/components/ui/button"
import { X, Calendar, ExternalLink } from "lucide-react"

interface CalendlyPopupProps {
  isOpen: boolean
  onClose: () => void
  url?: string
}

export default function CalendlyPopupSimple({ isOpen, onClose, url = "https://calendly.com/alllevelsathletics/fitnessconsultation?back=1&month=2025-09" }: CalendlyPopupProps) {
  console.log('CalendlyPopupSimple rendered with isOpen:', isOpen)
  // Handle escape key
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const openCalendly = () => {
    window.open(url, '_blank')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleBackdropClick}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Schedule Your Free Consultation</h2>
                <p className="text-orange-100 text-sm">Choose a time that works for you</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Book Your Session?</h3>
            <p className="text-gray-600">
              Click below to open our scheduling calendar in a new tab where you can choose your preferred time.
            </p>
          </div>
          
          <div className="space-y-3">
            <Button
              onClick={openCalendly}
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold py-3 hover:from-orange-600 hover:to-yellow-600 transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="w-5 h-5" />
                Open Calendar
              </span>
            </Button>
            
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full"
            >
              Cancel
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 mt-4">
            The calendar will open in a new tab so you don't lose your place on our site.
          </p>
        </div>
      </div>
    </div>
  )
}
