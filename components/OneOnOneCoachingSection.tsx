"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users,
  Calendar,
  MessageSquare,
  Video,
  Target,
  TrendingUp,
  CheckCircle,
  Clock,
  Star,
  Zap,
  Award,
  BookOpen,
  Phone,
  Mail,
  Camera
} from "lucide-react"

interface CoachingSession {
  id: string
  date: string
  time: string
  type: 'video' | 'phone' | 'in-person'
  status: 'scheduled' | 'completed' | 'cancelled'
  notes?: string
  duration: number
}

interface CoachingMetrics {
  sessionsCompleted: number
  totalHours: number
  goalsAchieved: number
  nextSession: string
  progressScore: number
}

interface OneOnOneCoachingSectionProps {
  userId: string
  userPlan?: string
  className?: string
}

export function OneOnOneCoachingSection({ 
  userId, 
  userPlan = "Foundation",
  className = ""
}: OneOnOneCoachingSectionProps) {
  const [coachingData, setCoachingData] = useState<{
    sessions: CoachingSession[]
    metrics: CoachingMetrics
    isLoading: boolean
  }>({
    sessions: [],
    metrics: {
      sessionsCompleted: 0,
      totalHours: 0,
      goalsAchieved: 0,
      nextSession: '',
      progressScore: 0
    },
    isLoading: true
  })

  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'progress'>('overview')

  useEffect(() => {
    fetchCoachingData()
  }, [userId])

  const fetchCoachingData = async () => {
    try {
      setCoachingData(prev => ({ ...prev, isLoading: true }))
      
      // Fetch coaching sessions
      const sessionsResponse = await fetch(`/api/coaching/check-ins?userId=${userId}`)
      const sessionsData = await sessionsResponse.json()
      
      // Fetch progress metrics
      const progressResponse = await fetch(`/api/coaching/progress?userId=${userId}`)
      const progressData = await progressResponse.json()

      setCoachingData({
        sessions: sessionsData.sessions || [],
        metrics: {
          sessionsCompleted: progressData.sessionsCompleted || 0,
          totalHours: progressData.totalHours || 0,
          goalsAchieved: progressData.goalsAchieved || 0,
          nextSession: progressData.nextSession || '',
          progressScore: progressData.progressScore || 0
        },
        isLoading: false
      })
    } catch (error) {
      console.error('Error fetching coaching data:', error)
      setCoachingData(prev => ({ ...prev, isLoading: false }))
    }
  }

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />
      case 'phone':
        return <Phone className="w-4 h-4" />
      case 'in-person':
        return <Users className="w-4 h-4" />
      default:
        return <Calendar className="w-4 h-4" />
    }
  }

  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'phone':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'in-person':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'scheduled':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  if (coachingData.isLoading) {
    return (
      <div className={`${className}`}>
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-orange-400" />
              1-on-1 Coaching
            </h2>
            <p className="text-white/70 mt-1">Personalized coaching sessions and progress tracking</p>
          </div>
          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
            {userPlan} Plan
          </Badge>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-white/5 p-1 rounded-lg border border-orange-500/30">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all duration-300 ${
              activeTab === 'overview'
                ? 'bg-orange-500 text-black font-medium'
                : 'text-white/70 hover:text-orange-400 hover:bg-white/10'
            }`}
          >
            <Target className="w-4 h-4" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all duration-300 ${
              activeTab === 'sessions'
                ? 'bg-orange-500 text-black font-medium'
                : 'text-white/70 hover:text-orange-400 hover:bg-white/10'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Sessions
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all duration-300 ${
              activeTab === 'progress'
                ? 'bg-orange-500 text-black font-medium'
                : 'text-white/70 hover:text-orange-400 hover:bg-white/10'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Progress
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white/5 border-orange-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">Sessions Completed</p>
                    <p className="text-2xl font-bold text-orange-400">{coachingData.metrics.sessionsCompleted}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-orange-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 border-orange-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">Total Hours</p>
                    <p className="text-2xl font-bold text-green-400">{coachingData.metrics.totalHours}</p>
                  </div>
                  <Clock className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 border-orange-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">Goals Achieved</p>
                    <p className="text-2xl font-bold text-blue-400">{coachingData.metrics.goalsAchieved}</p>
                  </div>
                  <Award className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 border-orange-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">Progress Score</p>
                    <p className="text-2xl font-bold text-yellow-400">{coachingData.metrics.progressScore}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Next Session */}
          {coachingData.metrics.nextSession && (
            <Card className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border-orange-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-orange-400" />
                  Next Session
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/90 text-lg font-semibold">
                      {formatDate(coachingData.metrics.nextSession)}
                    </p>
                    <p className="text-white/70">
                      {coachingData.sessions.find(s => s.date === coachingData.metrics.nextSession)?.type === 'video' ? 'Video Call' : 
                       coachingData.sessions.find(s => s.date === coachingData.metrics.nextSession)?.type === 'phone' ? 'Phone Call' : 
                       'In-Person Session'}
                    </p>
                  </div>
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    <Video className="w-4 h-4 mr-2" />
                    Join Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white/5 border-orange-500/30 hover:border-orange-400/50 transition-all duration-300 cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">Schedule Session</h3>
                <p className="text-white/70 text-sm">Book your next coaching session</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 border-orange-500/30 hover:border-orange-400/50 transition-all duration-300 cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">Send Message</h3>
                <p className="text-white/70 text-sm">Contact your coach directly</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 border-orange-500/30 hover:border-orange-400/50 transition-all duration-300 cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">View Resources</h3>
                <p className="text-white/70 text-sm">Access training materials</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Sessions Tab */}
      {activeTab === 'sessions' && (
        <div className="space-y-4">
          {coachingData.sessions.length > 0 ? (
            coachingData.sessions.map((session) => (
              <Card key={session.id} className="bg-white/5 border-orange-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${getSessionTypeColor(session.type)} rounded-full flex items-center justify-center`}>
                        {getSessionTypeIcon(session.type)}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">
                          {formatDate(session.date)} at {formatTime(session.time)}
                        </h3>
                        <p className="text-white/70 text-sm">
                          {session.type === 'video' ? 'Video Call' : 
                           session.type === 'phone' ? 'Phone Call' : 
                           'In-Person Session'} • {session.duration} minutes
                        </p>
                        {session.notes && (
                          <p className="text-white/60 text-sm mt-1">{session.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(session.status)}>
                        {session.status}
                      </Badge>
                      {session.status === 'scheduled' && (
                        <Button size="sm" variant="outline" className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10">
                          <Video className="w-4 h-4 mr-1" />
                          Join
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-white/5 border-orange-500/30">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Sessions Scheduled</h3>
                <p className="text-white/70 mb-4">Your coaching sessions will appear here once scheduled.</p>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Your First Session
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Progress Tab */}
      {activeTab === 'progress' && (
        <div className="space-y-6">
          {/* Progress Overview */}
          <Card className="bg-white/5 border-orange-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-400" />
                Progress Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Overall Progress</span>
                  <span className="text-orange-400 font-semibold">{coachingData.metrics.progressScore}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-orange-400 to-yellow-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${coachingData.metrics.progressScore}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievement Badges */}
          <Card className="bg-white/5 border-orange-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-orange-400" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="w-6 h-6 text-orange-400" />
                  </div>
                  <p className="text-white/70 text-sm">Sessions</p>
                  <p className="text-white font-semibold">{coachingData.metrics.sessionsCompleted}</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Clock className="w-6 h-6 text-green-400" />
                  </div>
                  <p className="text-white/70 text-sm">Hours</p>
                  <p className="text-white font-semibold">{coachingData.metrics.totalHours}</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Target className="w-6 h-6 text-blue-400" />
                  </div>
                  <p className="text-white/70 text-sm">Goals</p>
                  <p className="text-white font-semibold">{coachingData.metrics.goalsAchieved}</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Star className="w-6 h-6 text-yellow-400" />
                  </div>
                  <p className="text-white/70 text-sm">Score</p>
                  <p className="text-white font-semibold">{coachingData.metrics.progressScore}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
