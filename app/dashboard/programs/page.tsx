"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft,
  BookOpen,
  Dumbbell,
  Clock,
  Users,
  CheckCircle,
  Play,
  Calendar
} from "lucide-react"

export default function ProgramsPage() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [userPrograms, setUserPrograms] = useState<any[]>([])


  const fetchUserPrograms = async () => {
    if (!user?.id) return

    try {
      const response = await fetch(`/api/user-programs?userId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setUserPrograms(data.programs || [])
      }
    } catch (error) {
      console.error('Error fetching user programs:', error)
    }
  }

  useEffect(() => {
    if (!user) {
      router.push('/')
      return
    }
    
    fetchUserPrograms()
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [user, router])

  const handleSignOut = async () => {
    await signOut()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-white">Loading Programs...</h1>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Header */}
      <header className="bg-black/95 backdrop-blur-md border-b border-orange-500/30 sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="text-white/90 hover:text-orange-400 hover:bg-white/10 text-xs sm:text-sm flex-shrink-0"
              >
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Back to Dashboard</span>
                <span className="sm:hidden">Back</span>
              </Button>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-orange-400 truncate min-w-0">My Programs</h1>
            </div>
            
            <div className="flex items-center space-x-1 sm:space-x-3 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/')}
                className="text-white/90 hover:text-orange-400 hover:bg-white/10 text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">Back to Site</span>
                <span className="sm:hidden">Site</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-white/90 hover:text-red-400 hover:bg-white/10 text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">Sign Out</span>
                <span className="sm:hidden">Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Current Programs */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-orange-400" />
            Current Programs
          </h2>
          
          {userPrograms.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
              {userPrograms.map((program) => (
                <Card key={program.id} className="bg-white/5 border-orange-500/30">
                  <CardHeader className="pb-3 sm:pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-base sm:text-lg">{program.name}</CardTitle>
                    </div>
                    <CardDescription className="text-white/70 text-sm">{program.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-white/70">Progress</span>
                      <span className="text-orange-400 font-medium">{program.progress}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${program.progress}%` }}
                      ></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                      <div>
                        <span className="text-white/70">Workouts:</span>
                        <span className="text-white ml-2">{program.workoutsCompleted}/{program.totalWorkouts}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-white/70">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="truncate">{new Date(program.startDate).toLocaleDateString()} - {new Date(program.endDate).toLocaleDateString()}</span>
                    </div>
                    <Button 
                      className="w-full bg-orange-500 hover:bg-orange-600 text-sm sm:text-base py-2 sm:py-3"
                      onClick={() => router.push(`/dashboard/programs/${program.slug}`)}
                    >
                      <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      {program.progress > 0 ? 'Continue Program' : 'Start Program'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-white/5 border-orange-500/30">
              <CardContent className="text-center py-12">
                <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-10 h-10 text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Active Programs</h3>
                <p className="text-white/70 mb-6">Start your fitness journey with one of our proven programs</p>
                <Button onClick={() => router.push('/programs')} className="bg-orange-500 hover:bg-orange-600">
                  Explore Programs
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

      </main>
    </div>
  )
}
