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

  // Mock data - replace with real data from your backend
  const [userPrograms] = useState([
    {
      id: 1,
      name: "Foundation Strength Program",
      description: "12-week program for building fundamental strength",
      progress: 75,
      startDate: "2024-01-01",
      endDate: "2024-03-25",
      status: "active",
      workoutsCompleted: 9,
      totalWorkouts: 12
    }
  ])

  const [availablePrograms] = useState([
    {
      id: 1,
      name: "Beginner's Journey",
      description: "Perfect for those just starting their fitness journey",
      duration: "8 weeks",
      difficulty: "Beginner",
      price: "$97",
      features: ["Full body workouts", "Nutrition guide", "Progress tracking", "Video demonstrations"]
    },
    {
      id: 2,
      name: "Intermediate Power",
      description: "Build strength and muscle for intermediate lifters",
      duration: "12 weeks",
      difficulty: "Intermediate",
      price: "$147",
      features: ["Progressive overload", "Advanced techniques", "Recovery protocols", "Personalized adjustments"]
    }
  ])

  useEffect(() => {
    if (!user) {
      router.push('/')
      return
    }
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [user, router])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
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
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black/95 backdrop-blur-md border-b border-orange-500/30 sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="text-white/90 hover:text-orange-400 hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-orange-400">My Programs</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/')}
                className="text-white/90 hover:text-orange-400 hover:bg-white/10"
              >
                Back to Site
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-white/90 hover:text-red-400 hover:bg-white/10"
              >
                Sign Out
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {userPrograms.map((program) => (
                <Card key={program.id} className="bg-white/5 border-orange-500/30">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">{program.name}</CardTitle>
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                        {program.status}
                      </Badge>
                    </div>
                    <CardDescription className="text-white/70">{program.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/70">Progress</span>
                        <span className="text-orange-400 font-medium">{program.progress}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${program.progress}%` }}
                        ></div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-white/70">Workouts:</span>
                          <span className="text-white ml-2">{program.workoutsCompleted}/{program.totalWorkouts}</span>
                        </div>
                        <div>
                          <span className="text-white/70">Duration:</span>
                          <span className="text-white ml-2">{program.duration}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/70">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(program.startDate).toLocaleDateString()} - {new Date(program.endDate).toLocaleDateString()}</span>
                      </div>
                      <Button className="w-full bg-orange-500 hover:bg-orange-600">
                        <Play className="w-4 h-4 mr-2" />
                        Continue Program
                      </Button>
                    </div>
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

        {/* Available Programs */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Dumbbell className="w-6 h-6 text-orange-400" />
            Available Programs
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availablePrograms.map((program) => (
              <Card key={program.id} className="bg-white/5 border-orange-500/30 hover:border-orange-400/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white">{program.name}</CardTitle>
                  <CardDescription className="text-white/70">{program.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/70">Duration:</span>
                      <span className="text-white">{program.duration}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/70">Difficulty:</span>
                      <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                        {program.difficulty}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-white">Features:</h4>
                      <ul className="space-y-1">
                        {program.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-white/80">
                            <CheckCircle className="w-4 h-4 text-orange-400" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-orange-400">{program.price}</span>
                      <Button onClick={() => router.push('/contact')} className="bg-orange-500 hover:bg-orange-600">
                        Get Started
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
