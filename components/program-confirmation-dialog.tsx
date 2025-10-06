"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Target, Users, Award, Zap, Heart, Clock } from "lucide-react"

interface ProgramConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function ProgramConfirmationDialog({ isOpen, onClose, onConfirm }: ProgramConfirmationDialogProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      console.log('🚀 Starting program registration for user:', user?.id)
      
      // Call the program registration API
      const response = await fetch('/api/add-user-program', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          programId: 'tension-release-program',
          programName: 'Comprehensive Tension Release & Performance Enhancement',
          programType: 'premium'
        })
      })

      const data = await response.json()
      console.log('📡 API Response:', data)

      if (response.ok) {
        console.log('✅ Program registered successfully!')
        
        // Store program in localStorage as backup
        const programData = {
          id: data.program?.id || `local-${Date.now()}`,
          name: 'Comprehensive Tension Release & Performance Enhancement',
          programId: 'tension-release-program',
          programType: 'premium',
          status: 'active',
          progress: 0,
          duration: '18 modules',
          startDate: new Date().toISOString(),
          registeredAt: new Date().toISOString()
        }
        
        // Store in localStorage for dashboard display
        const existingPrograms = JSON.parse(localStorage.getItem('userPrograms') || '[]')
        const updatedPrograms = [...existingPrograms.filter((p: any) => p.programId !== 'tension-release-program'), programData]
        localStorage.setItem('userPrograms', JSON.stringify(updatedPrograms))
        
        console.log('💾 Program stored in localStorage:', programData)
        
        onConfirm()
        // Navigate directly to the program page
        router.push('/dashboard/programs/tension-release-program')
      } else {
        console.error('❌ Failed to register program:', data.error)
        
        // Even if database fails, store in localStorage and allow access
        const programData = {
          id: `local-${Date.now()}`,
          name: 'Comprehensive Tension Release & Performance Enhancement',
          programId: 'tension-release-program',
          programType: 'premium',
          status: 'active',
          progress: 0,
          duration: '18 modules',
          startDate: new Date().toISOString(),
          registeredAt: new Date().toISOString()
        }
        
        // Store in localStorage for dashboard display
        const existingPrograms = JSON.parse(localStorage.getItem('userPrograms') || '[]')
        const updatedPrograms = [...existingPrograms.filter((p: any) => p.programId !== 'tension-release-program'), programData]
        localStorage.setItem('userPrograms', JSON.stringify(updatedPrograms))
        
        console.log('💾 Program stored in localStorage (fallback mode):', programData)
        
        onConfirm()
        // Still allow access even if registration fails
        router.push('/dashboard/programs/tension-release-program')
      }
    } catch (error) {
      console.error('❌ Error registering program:', error)
      
      // Even if everything fails, store in localStorage and allow access
      const programData = {
        id: `local-${Date.now()}`,
        name: 'Comprehensive Tension Release & Performance Enhancement',
        programId: 'tension-release-program',
        programType: 'premium',
        status: 'active',
        progress: 0,
        duration: '18 modules',
        startDate: new Date().toISOString(),
        registeredAt: new Date().toISOString()
      }
      
      // Store in localStorage for dashboard display
      const existingPrograms = JSON.parse(localStorage.getItem('userPrograms') || '[]')
      const updatedPrograms = [...existingPrograms.filter((p: any) => p.programId !== 'tension-release-program'), programData]
      localStorage.setItem('userPrograms', JSON.stringify(updatedPrograms))
      
      console.log('💾 Program stored in localStorage (error fallback):', programData)
      
      // Still allow access even if registration fails
      onConfirm()
      router.push('/dashboard/programs/tension-release-program')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-black border-orange-500/30 text-white">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-black" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-white">
                Start Your Transformation
              </DialogTitle>
              <div className="flex gap-2 mt-1">
                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                  Premium Program
                </Badge>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  ✓ Access Granted
                </Badge>
              </div>
            </div>
          </div>
          <DialogDescription className="text-lg text-white/80">
            You're about to start the Comprehensive Tension Release & Performance Enhancement program. 
            This will add the program to your dashboard and give you access to all 18 video modules.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Program Overview */}
          <div className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-xl p-6 border border-orange-500/20">
            <h3 className="text-xl font-semibold text-white mb-4">Program Overview</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-orange-400" />
                  <span className="text-white/80">18 comprehensive video modules</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-400" />
                  <span className="text-white/80">Self-paced learning</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-orange-400" />
                  <span className="text-white/80">All fitness levels</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-orange-400" />
                  <span className="text-white/80">Runners & athletes focus</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-orange-400" />
                  <span className="text-white/80">Progress tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-orange-400" />
                  <span className="text-white/80">Completion certificate</span>
                </div>
              </div>
            </div>
          </div>

          {/* Program Components */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-4 border border-orange-500/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                  <Zap className="w-4 h-4 text-orange-400" />
                </div>
                <h4 className="font-semibold text-white">Tension Release</h4>
              </div>
              <p className="text-sm text-white/70">Targeted techniques to unlock your body's potential</p>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 border border-orange-500/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 text-orange-400" />
                </div>
                <h4 className="font-semibold text-white">Performance Enhancement</h4>
              </div>
              <p className="text-sm text-white/70">Scientifically-backed methodology for better results</p>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/20">
            <h4 className="font-semibold text-white mb-3">What You'll Get:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-white/80">Access to all 18 video modules</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-white/80">Progress tracking dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-white/80">Program added to your dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-white/80">Lifetime access to materials</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-white/20 text-white hover:bg-white/10"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold hover:scale-105 transition-all"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                Adding Program...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Start Program
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
