"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Calendar, 
  Clock, 
  Target, 
  TrendingUp, 
  Activity, 
  Trophy, 
  Settings, 
  LogOut,
  User,
  Heart,
  Zap,
  Dumbbell,
  Timer,
  BarChart3
} from "lucide-react"

export default function ClientDashboard() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  // Mock data - replace with real data from your backend
  const [userStats] = useState({
    totalWorkouts: 47,
    currentStreak: 8,
    totalCalories: 12450,
    averageWorkoutTime: 45,
    weeklyGoal: 4,
    weeklyCompleted: 3
  })

  const [recentWorkouts] = useState([
    {
      id: 1,
      name: "Upper Body Strength",
      date: "2024-01-15",
      duration: 52,
      calories: 320,
      type: "Strength"
    },
    {
      id: 2,
      name: "Cardio HIIT",
      date: "2024-01-13",
      duration: 38,
      calories: 450,
      type: "Cardio"
    },
    {
      id: 3,
      name: "Lower Body Power",
      date: "2024-01-11",
      duration: 45,
      calories: 380,
      type: "Strength"
    }
  ])

  const [upcomingSessions] = useState([
    {
      id: 1,
      type: "Personal Training",
      date: "2024-01-17",
      time: "10:00 AM",
      trainer: "Coach Mike",
      duration: 60
    },
    {
      id: 2,
      type: "Group Class",
      date: "2024-01-19",
      time: "6:00 PM",
      trainer: "Coach Sarah",
      duration: 45
    }
  ])

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      router.push('/')
      return
    }

    // Simulate loading
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
          <h1 className="text-2xl font-bold text-white">Loading Dashboard...</h1>
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
              <h1 className="text-2xl font-bold text-orange-400">Client Dashboard</h1>
              <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                {user.user_metadata?.role || 'Client'}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/')}
                className="text-white/90 hover:text-orange-400 hover:bg-white/10"
              >
                <User className="w-4 h-4 mr-2" />
                Back to Site
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-white/90 hover:text-red-400 hover:bg-white/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Athlete'}! 🏋️‍♂️
          </h2>
          <p className="text-white/70 text-lg">
            Ready to crush your fitness goals today?
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/5 border-orange-500/30 hover:border-orange-400/50 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-orange-400" />
                Total Workouts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-400">{userStats.totalWorkouts}</div>
              <p className="text-white/60 text-sm">Lifetime achievement</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-orange-500/30 hover:border-orange-400/50 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-400" />
                Current Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-400">{userStats.currentStreak}</div>
              <p className="text-white/60 text-sm">Days in a row</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-orange-500/30 hover:border-orange-400/50 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-orange-400" />
                Calories Burned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-400">{userStats.totalCalories.toLocaleString()}</div>
              <p className="text-white/60 text-sm">Total calories</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-orange-500/30 hover:border-orange-400/50 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Timer className="w-5 h-5 text-orange-400" />
                Avg. Duration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-400">{userStats.averageWorkoutTime}</div>
              <p className="text-white/60 text-sm">Minutes per workout</p>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Progress */}
        <Card className="bg-white/5 border-orange-500/30 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-400" />
              Weekly Goal Progress
            </CardTitle>
            <CardDescription className="text-white/70">
              {userStats.weeklyCompleted} of {userStats.weeklyGoal} workouts completed this week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-white/70">
                <span>Progress</span>
                <span>{Math.round((userStats.weeklyCompleted / userStats.weeklyGoal) * 100)}%</span>
              </div>
              <Progress 
                value={(userStats.weeklyCompleted / userStats.weeklyGoal) * 100} 
                className="h-3 bg-white/10"
              />
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Goal: {userStats.weeklyGoal} workouts</span>
                <span className="text-orange-400 font-medium">{userStats.weeklyCompleted} completed</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Workouts */}
          <div className="lg:col-span-2">
            <Card className="bg-white/5 border-orange-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-orange-400" />
                  Recent Workouts
                </CardTitle>
                <CardDescription className="text-white/70">
                  Your latest fitness achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentWorkouts.map((workout) => (
                    <div 
                      key={workout.id}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:border-orange-500/30 transition-all duration-300"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                          <Dumbbell className="w-6 h-6 text-orange-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{workout.name}</h4>
                          <div className="flex items-center space-x-4 text-sm text-white/60">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(workout.date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {workout.duration} min
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant="secondary" 
                          className={`${
                            workout.type === 'Cardio' 
                              ? 'bg-red-500/20 text-red-400 border-red-500/30' 
                              : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                          }`}
                        >
                          {workout.type}
                        </Badge>
                        <div className="text-sm text-orange-400 font-medium mt-1">
                          {workout.calories} cal
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-6 border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:border-orange-400"
                >
                  View All Workouts
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Sessions */}
            <Card className="bg-white/5 border-orange-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-orange-400" />
                  Upcoming Sessions
                </CardTitle>
                <CardDescription className="text-white/70">
                  Your scheduled training sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <div 
                      key={session.id}
                      className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-orange-500/30 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                          {session.type}
                        </Badge>
                        <span className="text-sm text-white/60">{session.duration} min</span>
                      </div>
                      <h4 className="font-semibold text-white mb-1">{session.trainer}</h4>
                      <div className="text-sm text-white/60">
                        {new Date(session.date).toLocaleDateString()} at {session.time}
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4 border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:border-orange-400"
                >
                  Schedule Session
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/5 border-orange-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-400" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:border-orange-400"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Progress
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:border-orange-400"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Set Goals
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:border-orange-400"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Profile Settings
                </Button>
              </CardContent>
            </Card>

            {/* Achievement Badge */}
            <Card className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500/50">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-orange-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">8-Day Streak!</h3>
                <p className="text-white/70 text-sm">
                  You're on fire! Keep up the amazing work and maintain your momentum.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
