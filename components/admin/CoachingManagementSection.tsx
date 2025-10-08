"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  Users,
  Calendar,
  MessageSquare,
  Video,
  Phone,
  User,
  Clock,
  CheckCircle,
  X,
  Plus,
  BarChart3,
  Edit,
  Save,
  Search,
  TrendingUp,
  Award,
  Star,
  Filter
} from "lucide-react"

interface CoachingClient {
  id: string
  email: string
  full_name: string
  plan_name: string
  subscription_status: string
  total_sessions: number
  completed_sessions: number
  next_session?: string
  progress_score: number
  last_check_in?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
}

interface CoachingSession {
  id: string
  client_id: string
  client_name: string
  client_email: string
  scheduled_date: string
  check_in_type: 'video' | 'phone' | 'in-person'
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show'
  notes?: string
  feedback?: string
  goals_achieved?: string[]
  next_goals?: string[]
  duration_minutes?: number
}

interface CheckIn {
  id: string
  scheduled_date: string
  check_in_type: string
  status: string
  notes?: string
  user?: {
    id: string
    email: string
    raw_user_meta_data?: {
      full_name?: string
    }
  }
}

interface CoachingManagementSectionProps {
  coachingLoading: boolean
  onRefresh: () => void
  checkIns: CheckIn[]
  checkInsLoading: boolean
  onRefreshCheckIns: () => void
}

export function CoachingManagementSection({ 
  coachingLoading, 
  onRefresh,
  checkIns,
  checkInsLoading,
  onRefreshCheckIns
}: CoachingManagementSectionProps) {
  const [activeTab, setActiveTab] = useState<'clients' | 'sessions' | 'analytics'>('clients')
  const [clients, setClients] = useState<CoachingClient[]>([])
  const [sessions, setSessions] = useState<CoachingSession[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [editingSession, setEditingSession] = useState<CoachingSession | null>(null)
  const [formData, setFormData] = useState({
    client_id: '',
    scheduled_date: '',
    scheduled_time: '',
    check_in_type: 'video' as 'video' | 'phone' | 'in-person',
    notes: ''
  })
  
  // Calendar state for check-ins
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'day'>('month')
  const [selectedCheckIn, setSelectedCheckIn] = useState<CheckIn | null>(null)
  const [showCheckInModal, setShowCheckInModal] = useState(false)
  const [checkInNotes, setCheckInNotes] = useState('')
  
  // Client details modal
  const [showClientDetailsModal, setShowClientDetailsModal] = useState(false)
  const [selectedClientForDetails, setSelectedClientForDetails] = useState<CoachingClient | null>(null)
  const [clientScheduledSessions, setClientScheduledSessions] = useState<CheckIn[]>([])
  const [loadingClientSessions, setLoadingClientSessions] = useState(false)

  useEffect(() => {
    fetchCoachingData()
  }, [])

  const fetchCoachingData = async () => {
    try {
      // Fetch coaching clients
      const clientsResponse = await fetch('/api/admin/coaching-clients')
      if (clientsResponse.ok) {
        const clientsData = await clientsResponse.json()
        setClients(clientsData.clients || [])
      }

      // Fetch coaching sessions
      const sessionsResponse = await fetch('/api/admin/coaching-sessions')
      if (sessionsResponse.ok) {
        const sessionsData = await sessionsResponse.json()
        setSessions(sessionsData.sessions || [])
      }
    } catch (error) {
      console.error('Error fetching coaching data:', error)
    }
  }

  const handleScheduleSession = async () => {
    try {
      const response = await fetch('/api/admin/coaching-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          scheduled_date: `${formData.scheduled_date}T${formData.scheduled_time}:00`
        })
      })

      if (response.ok) {
        setShowScheduleModal(false)
        setFormData({
          client_id: '',
          scheduled_date: '',
          scheduled_time: '',
          check_in_type: 'video',
          notes: ''
        })
        fetchCoachingData()
        onRefresh()
      }
    } catch (error) {
      console.error('Error scheduling session:', error)
    }
  }

  const handleUpdateSession = async (sessionId: string, updates: Partial<CoachingSession>) => {
    try {
      const response = await fetch('/api/admin/coaching-sessions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, ...updates })
      })

      if (response.ok) {
        setSessions(sessions.map(s => s.id === sessionId ? { ...s, ...updates } : s))
        setEditingSession(null)
        fetchCoachingData()
      }
    } catch (error) {
      console.error('Error updating session:', error)
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
      case 'no-show':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />
      case 'phone':
        return <Phone className="w-4 h-4" />
      case 'in-person':
        return <User className="w-4 h-4" />
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.client_email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || session.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    totalClients: clients.length,
    activeClients: clients.filter(c => c.subscription_status === 'active').length,
    totalSessions: sessions.length,
    completedSessions: sessions.filter(s => s.status === 'completed').length,
    scheduledSessions: sessions.filter(s => s.status === 'scheduled').length,
    averageProgress: clients.length > 0 ? Math.round(clients.reduce((sum, c) => sum + c.progress_score, 0) / clients.length) : 0
  }

  // Calendar helper functions for check-ins
  const getCheckInsForDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`
    
    return checkIns.filter(checkIn => {
      const checkInDate = new Date(checkIn.scheduled_date)
      const checkInYear = checkInDate.getFullYear()
      const checkInMonth = String(checkInDate.getMonth() + 1).padStart(2, '0')
      const checkInDay = String(checkInDate.getDate()).padStart(2, '0')
      const checkInDateStr = `${checkInYear}-${checkInMonth}-${checkInDay}`
      
      return checkInDateStr === dateStr && checkIn.status === 'scheduled'
    })
  }

  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - date.getDay())
    const days = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      days.push(day)
    }
    return days
  }

  const getMonthDays = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    
    const startDate = new Date(firstDay)
    startDate.setDate(firstDay.getDate() - firstDay.getDay())
    
    const endDate = new Date(lastDay)
    endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()))
    
    const days = []
    const current = new Date(startDate)
    
    while (current <= endDate) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    
    return days
  }

  const getTimeSlots = () => {
    const slots = []
    for (let hour = 8; hour <= 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`)
      if (hour < 18) {
        slots.push(`${hour.toString().padStart(2, '0')}:30`)
      }
    }
    return slots
  }

  const getCheckInForTimeSlot = (date: Date, timeSlot: string) => {
    const checkInsForDate = getCheckInsForDate(date)
    
    return checkInsForDate.find(checkIn => {
      const checkInTime = new Date(checkIn.scheduled_date).toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Los_Angeles'
      })
      return checkInTime === timeSlot
    })
  }

  const handleCheckInClick = (checkIn: CheckIn) => {
    setSelectedCheckIn(checkIn)
    setCheckInNotes(checkIn.notes || '')
    setShowCheckInModal(true)
  }

  const handleSaveCheckInNotes = async () => {
    if (!selectedCheckIn) return

    try {
      const response = await fetch('/api/admin/check-ins', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkInId: selectedCheckIn.id,
          notes: checkInNotes
        })
      })

      if (response.ok) {
        setShowCheckInModal(false)
        setSelectedCheckIn(null)
        onRefreshCheckIns()
      }
    } catch (error) {
      console.error('Error saving notes:', error)
    }
  }

  // Get monthly check-in limit based on plan
  const getMonthlyLimit = (planName: string) => {
    switch (planName?.toLowerCase()) {
      case 'foundation':
        return 1
      case 'growth':
        return 2
      case 'elite':
        return 4
      default:
        return 1
    }
  }

  // Fetch client's scheduled sessions when opening details
  const fetchClientSessions = async (clientId: string) => {
    setLoadingClientSessions(true)
    try {
      const now = new Date()
      const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const lastOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      
      const clientSessions = checkIns.filter(checkIn => 
        checkIn.user?.id === clientId &&
        new Date(checkIn.scheduled_date) >= firstOfMonth &&
        new Date(checkIn.scheduled_date) <= lastOfMonth &&
        (checkIn.status === 'scheduled' || checkIn.status === 'completed')
      )
      
      setClientScheduledSessions(clientSessions)
    } catch (error) {
      console.error('Error fetching client sessions:', error)
    } finally {
      setLoadingClientSessions(false)
    }
  }

  // Open client details and fetch their sessions
  const handleViewClientDetails = (client: CoachingClient) => {
    setSelectedClientForDetails(client)
    fetchClientSessions(client.id)
    setShowClientDetailsModal(true)
  }

  // Cancel a client's session
  const handleCancelClientSession = async (checkInId: string) => {
    if (!confirm('Are you sure you want to cancel this session?')) return

    try {
      const response = await fetch('/api/admin/check-ins', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkInId: checkInId,
          status: 'cancelled'
        })
      })

      if (response.ok) {
        onRefreshCheckIns()
        if (selectedClientForDetails) {
          fetchClientSessions(selectedClientForDetails.id)
        }
      }
    } catch (error) {
      console.error('Error cancelling session:', error)
    }
  }

  if (coachingLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-orange-400" />
            Coaching Management
          </h2>
          <p className="text-white/70 mt-1">Manage coaching clients, sessions, and progress</p>
        </div>
        <Button
          onClick={() => setShowScheduleModal(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Schedule Session
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-white/5 border-orange-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Total Clients</p>
                <p className="text-2xl font-bold text-orange-400">{stats.totalClients}</p>
              </div>
              <Users className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 border-orange-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Active Clients</p>
                <p className="text-2xl font-bold text-green-400">{stats.activeClients}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 border-orange-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Total Sessions</p>
                <p className="text-2xl font-bold text-blue-400">{stats.totalSessions}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 border-orange-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Completed</p>
                <p className="text-2xl font-bold text-green-400">{stats.completedSessions}</p>
              </div>
              <Award className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 border-orange-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Avg Progress</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.averageProgress}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-white/5 p-1 rounded-lg border border-orange-500/30">
        <button
          onClick={() => setActiveTab('clients')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all duration-300 ${
            activeTab === 'clients'
              ? 'bg-orange-500 text-black font-medium'
              : 'text-white/70 hover:text-orange-400 hover:bg-white/10'
          }`}
        >
          <Users className="w-4 h-4" />
          Clients
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
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all duration-300 ${
            activeTab === 'analytics'
              ? 'bg-orange-500 text-black font-medium'
              : 'text-white/70 hover:text-orange-400 hover:bg-white/10'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Analytics
        </button>
      </div>

      {/* Clients Tab */}
      {activeTab === 'clients' && (
        <div className="space-y-4">
          {clients.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clients.map((client) => (
                <Card key={client.id} className="bg-white/5 border-orange-500/30">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white text-lg">{client.full_name}</CardTitle>
                        <CardDescription className="text-white/70">{client.email}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Plan:</span>
                      <span className="text-orange-400">{client.plan_name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Sessions:</span>
                      <span className="text-white">{client.completed_sessions}/{client.total_sessions}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Progress:</span>
                      <span className="text-green-400 font-semibold">{client.progress_score}%</span>
                    </div>
                    {client.next_session && (
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Next Session:</span>
                        <span className="text-blue-400">{formatDate(client.next_session)}</span>
                      </div>
                    )}
                    <div className="flex gap-2 mt-4">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10 flex-1"
                        onClick={() => handleViewClientDetails(client)}
                      >
                        <User className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 flex-1"
                        onClick={() => {
                          setFormData({ ...formData, client_id: client.id })
                          setShowScheduleModal(true)
                        }}
                      >
                        <Calendar className="w-4 h-4 mr-1" />
                        Schedule
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-white/5 border-orange-500/30">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Coaching Clients</h3>
                <p className="text-white/70">Clients with active coaching subscriptions will appear here.</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Sessions Tab - Check-ins Calendar */}
      {activeTab === 'sessions' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Check-ins Calendar</h3>
            <div className="flex items-center gap-4">
              <div className="text-sm text-white/70">
                {checkIns.filter(c => c.status === 'scheduled').length} scheduled sessions
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setCalendarView('month')}
                  variant={calendarView === 'month' ? 'default' : 'outline'}
                  className={calendarView === 'month' ? 'bg-orange-500 hover:bg-orange-600' : 'border-orange-500/30 text-orange-400 hover:bg-orange-500/10'}
                  size="sm"
                >
                  Month
                </Button>
                <Button
                  onClick={() => setCalendarView('week')}
                  variant={calendarView === 'week' ? 'default' : 'outline'}
                  className={calendarView === 'week' ? 'bg-orange-500 hover:bg-orange-600' : 'border-orange-500/30 text-orange-400 hover:bg-orange-500/10'}
                  size="sm"
                >
                  Week
                </Button>
                <Button
                  onClick={() => setCalendarView('day')}
                  variant={calendarView === 'day' ? 'default' : 'outline'}
                  className={calendarView === 'day' ? 'bg-orange-500 hover:bg-orange-600' : 'border-orange-500/30 text-orange-400 hover:bg-orange-500/10'}
                  size="sm"
                >
                  Day
                </Button>
              </div>
            </div>
          </div>

          {/* Calendar Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => {
                  const newDate = new Date(selectedDate)
                  if (calendarView === 'month') {
                    newDate.setMonth(selectedDate.getMonth() - 1)
                  } else if (calendarView === 'week') {
                    newDate.setDate(selectedDate.getDate() - 7)
                  } else {
                    newDate.setDate(selectedDate.getDate() - 1)
                  }
                  setSelectedDate(newDate)
                }}
                variant="outline"
                className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
              >
                ← Previous
              </Button>
              <h4 className="text-lg font-semibold text-white">
                {calendarView === 'month' 
                  ? selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                  : calendarView === 'week' 
                  ? `Week of ${getWeekDays(selectedDate)[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`
                  : selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
                }
              </h4>
              <Button
                onClick={() => {
                  const newDate = new Date(selectedDate)
                  if (calendarView === 'month') {
                    newDate.setMonth(selectedDate.getMonth() + 1)
                  } else if (calendarView === 'week') {
                    newDate.setDate(selectedDate.getDate() + 7)
                  } else {
                    newDate.setDate(selectedDate.getDate() + 1)
                  }
                  setSelectedDate(newDate)
                }}
                variant="outline"
                className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
              >
                Next →
              </Button>
            </div>
            <Button
              onClick={() => setSelectedDate(new Date())}
              variant="outline"
              className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
            >
              Today
            </Button>
          </div>

          {/* Calendar Grid */}
          {checkInsLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <Card className="bg-white/5 border-orange-500/30">
              <CardContent className="p-6">
                {calendarView === 'month' ? (
                  <div className="grid grid-cols-7 gap-1">
                    {/* Day headers */}
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="text-center text-white/70 text-sm font-medium py-2 border-b border-white/10">
                        {day}
                      </div>
                    ))}
                    
                    {/* Month days */}
                    {getMonthDays(selectedDate).map((day, index) => {
                      const isCurrentMonth = day.getMonth() === selectedDate.getMonth()
                      const isToday = day.toDateString() === new Date().toDateString()
                      const dayCheckIns = getCheckInsForDate(day)
                      
                      return (
                        <div 
                          key={index} 
                          className={`min-h-[100px] p-2 border border-white/10 ${
                            isCurrentMonth ? 'bg-white/5' : 'bg-white/2'
                          } ${isToday ? 'ring-2 ring-orange-500' : ''}`}
                        >
                          <div className={`text-sm font-medium mb-1 ${
                            isCurrentMonth ? 'text-white' : 'text-white/50'
                          } ${isToday ? 'text-orange-400' : ''}`}>
                            {day.getDate()}
                          </div>
                          
                          <div className="space-y-1">
                            {dayCheckIns.slice(0, 3).map((checkIn) => (
                              <div 
                                key={checkIn.id}
                                onClick={() => handleCheckInClick(checkIn)}
                                className="bg-orange-500/20 border border-orange-500/30 rounded p-1 text-xs cursor-pointer hover:bg-orange-500/30 hover:border-orange-500/50 transition-colors"
                              >
                                <div className="text-orange-400 font-medium truncate">
                                  {new Date(checkIn.scheduled_date).toLocaleTimeString('en-US', {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true,
                                    timeZone: 'America/Los_Angeles'
                                  })}
                                </div>
                                <div className="text-white/70 truncate">
                                  {checkIn.user?.raw_user_meta_data?.full_name || checkIn.user?.email || 'Unknown'}
                                </div>
                                {checkIn.notes && (
                                  <div className="text-white/50 truncate text-xs">
                                    📝 {checkIn.notes.substring(0, 20)}...
                                  </div>
                                )}
                              </div>
                            ))}
                            {dayCheckIns.length > 3 && (
                              <div className="text-orange-400 text-xs">
                                +{dayCheckIns.length - 3} more
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : calendarView === 'week' ? (
                  <div className="grid grid-cols-8 gap-2">
                    {/* Time column header */}
                    <div className="text-white/70 text-sm font-medium py-2">Time</div>
                    
                    {/* Day headers */}
                    {getWeekDays(selectedDate).map((day, index) => (
                      <div key={index} className="text-center text-white/70 text-sm font-medium py-2">
                        <div>{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                        <div className="text-orange-400">{day.getDate()}</div>
                      </div>
                    ))}
                    
                    {/* Time slots */}
                    {getTimeSlots().map((timeSlot) => (
                      <React.Fragment key={timeSlot}>
                        <div className="text-white/60 text-xs py-2 border-t border-white/10">
                          {timeSlot}
                        </div>
                        {getWeekDays(selectedDate).map((day, dayIndex) => {
                          const checkIn = getCheckInForTimeSlot(day, timeSlot)
                          return (
                            <div key={`${dayIndex}-${timeSlot}`} className="min-h-[40px] border-t border-white/10 p-1">
                              {checkIn && (
                                <div 
                                  onClick={() => handleCheckInClick(checkIn)}
                                  className="bg-orange-500/20 border border-orange-500/30 rounded p-2 text-xs cursor-pointer hover:bg-orange-500/30 hover:border-orange-500/50 transition-colors"
                                >
                                  <div className="text-orange-400 font-medium truncate">
                                    {checkIn.user?.raw_user_meta_data?.full_name || checkIn.user?.email || 'Unknown'}
                                  </div>
                                  <div className="text-white/70 truncate">
                                    {checkIn.check_in_type.replace('_', ' ')}
                                  </div>
                                  {checkIn.notes && (
                                    <div className="text-white/60 truncate" title={checkIn.notes}>
                                      📝 {checkIn.notes.substring(0, 20)}...
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </React.Fragment>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="text-white font-medium mb-4">Time Slots</h4>
                      {getTimeSlots().map((timeSlot) => {
                        const checkIn = getCheckInForTimeSlot(selectedDate, timeSlot)
                        return (
                          <div key={timeSlot} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-orange-500/20">
                            <div className="text-white font-medium">{timeSlot}</div>
                            {checkIn ? (
                              <div className="text-right">
                                <div className="text-orange-400 font-medium text-sm">
                                  {checkIn.user?.raw_user_meta_data?.full_name || checkIn.user?.email || 'Unknown'}
                                </div>
                                <div className="text-white/70 text-xs">
                                  {checkIn.check_in_type.replace('_', ' ')}
                                </div>
                              </div>
                            ) : (
                              <div className="text-white/40 text-sm">Available</div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-white font-medium">Scheduled Sessions</h4>
                      {getCheckInsForDate(selectedDate).map((checkIn) => (
                        <Card 
                          key={checkIn.id} 
                          className="bg-orange-500/10 border-orange-500/30 cursor-pointer hover:bg-orange-500/20 hover:border-orange-500/50 transition-colors"
                          onClick={() => handleCheckInClick(checkIn)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="text-orange-400 font-medium">
                                {new Date(checkIn.scheduled_date).toLocaleTimeString('en-US', {
                                  hour: 'numeric',
                                  minute: '2-digit',
                                  hour12: true
                                })}
                              </div>
                              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                                {checkIn.status === 'scheduled' ? 'Scheduled' : checkIn.status}
                              </Badge>
                            </div>
                            <div className="text-white font-medium mb-1">
                              {checkIn.user?.raw_user_meta_data?.full_name || checkIn.user?.email || 'Unknown'}
                            </div>
                            <div className="text-white/70 text-sm capitalize mb-2">
                              {checkIn.check_in_type.replace('_', ' ')} Session
                            </div>
                            {checkIn.notes && (
                              <div className="text-white/60 text-xs bg-white/5 p-2 rounded">
                                📝 {checkIn.notes}
                              </div>
                            )}
                            {!checkIn.notes && (
                              <div className="text-white/40 text-xs italic">
                                Click to add notes...
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                      {getCheckInsForDate(selectedDate).length === 0 && (
                        <div className="text-center py-8 text-white/60">
                          No sessions scheduled for this day
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/5 border-orange-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-400" />
                  Session Completion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400 mb-2">
                    {stats.totalSessions > 0 ? Math.round((stats.completedSessions / stats.totalSessions) * 100) : 0}%
                  </div>
                  <p className="text-white/70">
                    {stats.completedSessions} of {stats.totalSessions} sessions completed
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-orange-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-orange-400" />
                  Client Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {stats.averageProgress}%
                  </div>
                  <p className="text-white/70">Average progress across all clients</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/5 border-orange-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-orange-400" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Detailed Analytics Coming Soon</h3>
                <p className="text-white/70">
                  Advanced coaching analytics and reporting features will be available here.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Client Details Modal */}
      <Dialog open={showClientDetailsModal} onOpenChange={setShowClientDetailsModal}>
        <DialogContent className="bg-gray-900 border-orange-500/30 text-white max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-white text-2xl flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-black" />
                </div>
                Client Profile
              </DialogTitle>
              {selectedClientForDetails && (
                <Badge className={selectedClientForDetails.subscription_status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}>
                  {selectedClientForDetails.subscription_status}
                </Badge>
              )}
            </div>
          </DialogHeader>
          
          {selectedClientForDetails && (
            <div className="space-y-6">
              {/* Client Name Header */}
              <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-lg p-4 border border-orange-500/30">
                <h2 className="text-2xl font-bold text-white mb-1">{selectedClientForDetails.full_name}</h2>
                <p className="text-orange-400">{selectedClientForDetails.plan_name} Plan</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Contact & Subscription Info */}
                <div className="space-y-4">
                  {/* Contact Info */}
                  <div className="bg-white/5 rounded-lg p-4 border border-orange-500/20">
                    <h3 className="text-orange-400 font-semibold mb-3 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Contact Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-white/70">Email:</span>
                        <span className="text-white">{selectedClientForDetails.email}</span>
                      </div>
                      {selectedClientForDetails.phone && (
                        <div className="flex justify-between">
                          <span className="text-white/70">Phone:</span>
                          <span className="text-white">{selectedClientForDetails.phone}</span>
                        </div>
                      )}
                      {(selectedClientForDetails.address || selectedClientForDetails.city) && (
                        <div className="flex flex-col gap-1 mt-3">
                          <span className="text-white/70 text-sm">Address:</span>
                          {selectedClientForDetails.address && (
                            <span className="text-white text-sm">{selectedClientForDetails.address}</span>
                          )}
                          {(selectedClientForDetails.city || selectedClientForDetails.state) && (
                            <span className="text-white text-sm">
                              {selectedClientForDetails.city}{selectedClientForDetails.city && selectedClientForDetails.state ? ', ' : ''}{selectedClientForDetails.state} {selectedClientForDetails.zip_code}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Subscription Info */}
                  <div className="bg-white/5 rounded-lg p-4 border border-orange-500/20">
                    <h3 className="text-orange-400 font-semibold mb-3 flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Subscription Details
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-white/70">Plan:</span>
                        <span className="text-orange-400 font-medium">{selectedClientForDetails.plan_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Monthly Limit:</span>
                        <span className="text-white font-medium">{getMonthlyLimit(selectedClientForDetails.plan_name)} sessions/month</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Info */}
                  <div className="bg-white/5 rounded-lg p-4 border border-orange-500/20">
                    <h3 className="text-orange-400 font-semibold mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Progress Tracking
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-white/70">Total Sessions:</span>
                        <span className="text-white font-medium">{selectedClientForDetails.completed_sessions}/{selectedClientForDetails.total_sessions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Progress Score:</span>
                        <span className="text-green-400 font-semibold">{selectedClientForDetails.progress_score}%</span>
                      </div>
                      {selectedClientForDetails.last_check_in && (
                        <div className="flex justify-between">
                          <span className="text-white/70">Last Check-in:</span>
                          <span className="text-white">{formatDate(selectedClientForDetails.last_check_in)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column - This Month's Sessions */}
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-orange-500/20">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-orange-400 font-semibold flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        This Month's Sessions
                      </h3>
                      <Badge className={clientScheduledSessions.length >= getMonthlyLimit(selectedClientForDetails.plan_name) ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'}>
                        {clientScheduledSessions.length}/{getMonthlyLimit(selectedClientForDetails.plan_name)} Used
                      </Badge>
                    </div>

                    {loadingClientSessions ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : clientScheduledSessions.length > 0 ? (
                      <div className="space-y-3">
                        {clientScheduledSessions.map((session) => (
                          <div key={session.id} className="bg-white/5 rounded-lg p-3 border border-orange-500/20">
                            <div className="flex items-center justify-between mb-2">
                              <div className="text-white font-medium text-sm">
                                {new Date(session.scheduled_date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  timeZone: 'America/Los_Angeles'
                                })} at {new Date(session.scheduled_date).toLocaleTimeString('en-US', {
                                  hour: 'numeric',
                                  minute: '2-digit',
                                  hour12: true,
                                  timeZone: 'America/Los_Angeles'
                                })}
                              </div>
                              <Badge className={session.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'}>
                                {session.status}
                              </Badge>
                            </div>
                            <p className="text-white/60 text-xs capitalize mb-2">
                              {session.check_in_type.replace('_', ' ')} Session
                            </p>
                            {session.notes && (
                              <div className="text-white/70 text-xs bg-white/5 p-2 rounded mb-2">
                                📝 {session.notes}
                              </div>
                            )}
                            {session.status === 'scheduled' && (
                              <div className="flex gap-2 mt-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedCheckIn(session)
                                    setCheckInNotes(session.notes || '')
                                    setShowCheckInModal(true)
                                  }}
                                  className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10 text-xs flex-1"
                                >
                                  <Edit className="w-3 h-3 mr-1" />
                                  Edit Notes
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleCancelClientSession(session.id)}
                                  className="border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs flex-1"
                                >
                                  <X className="w-3 h-3 mr-1" />
                                  Cancel
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="w-12 h-12 text-white/40 mx-auto mb-3" />
                        <p className="text-white/60 text-sm">No sessions scheduled this month</p>
                      </div>
                    )}
                  </div>

                  {/* Limit Warning/Info */}
                  {clientScheduledSessions.length >= getMonthlyLimit(selectedClientForDetails.plan_name) ? (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <X className="w-5 h-5 text-red-400" />
                        <h4 className="text-red-400 font-semibold">Monthly Limit Reached</h4>
                      </div>
                      <p className="text-white/80 text-sm">
                        This client has reached their monthly limit of {getMonthlyLimit(selectedClientForDetails.plan_name)} sessions. 
                        To schedule more, they need to cancel/reschedule an existing session or upgrade their plan.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <h4 className="text-green-400 font-semibold">Sessions Available</h4>
                      </div>
                      <p className="text-white/80 text-sm">
                        {getMonthlyLimit(selectedClientForDetails.plan_name) - clientScheduledSessions.length} session{getMonthlyLimit(selectedClientForDetails.plan_name) - clientScheduledSessions.length !== 1 ? 's' : ''} remaining this month
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-white/10">
                <Button
                  onClick={() => setShowClientDetailsModal(false)}
                  variant="outline"
                  className="border-gray-500/30 text-gray-400 hover:bg-gray-500/10"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setFormData({ ...formData, client_id: selectedClientForDetails.id })
                    setShowClientDetailsModal(false)
                    setShowScheduleModal(true)
                  }}
                  disabled={clientScheduledSessions.length >= getMonthlyLimit(selectedClientForDetails.plan_name)}
                  className="bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {clientScheduledSessions.length >= getMonthlyLimit(selectedClientForDetails.plan_name) 
                    ? 'Limit Reached' 
                    : 'Schedule New Session'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Check-in Notes Modal */}
      <Dialog open={showCheckInModal} onOpenChange={setShowCheckInModal}>
        <DialogContent className="bg-gray-900 border-orange-500/30 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-400" />
              Session Notes
            </DialogTitle>
          </DialogHeader>
          
          {selectedCheckIn && (
            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-orange-400 font-medium mb-2">
                  {new Date(selectedCheckIn.scheduled_date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })} at {new Date(selectedCheckIn.scheduled_date).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                    timeZone: 'America/Los_Angeles'
                  })}
                </div>
                <div className="text-white font-medium mb-1">
                  {selectedCheckIn.user?.raw_user_meta_data?.full_name || selectedCheckIn.user?.email || 'Unknown'}
                </div>
                <div className="text-white/70 text-sm capitalize">
                  {selectedCheckIn.check_in_type.replace('_', ' ')} Session
                </div>
              </div>

              <div>
                <Label htmlFor="notes" className="text-white text-sm font-medium">
                  Notes for Client
                </Label>
                <textarea
                  id="notes"
                  value={checkInNotes}
                  onChange={(e) => setCheckInNotes(e.target.value)}
                  placeholder="Add meeting link, preparation notes, or any information the client should know..."
                  className="w-full mt-2 p-3 bg-white/5 border border-orange-500/30 rounded-lg text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  rows={6}
                />
                <p className="text-white/60 text-xs mt-1">
                  These notes will be visible to the client in their dashboard.
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  onClick={() => setShowCheckInModal(false)}
                  variant="outline"
                  className="border-gray-500/30 text-gray-400 hover:bg-gray-500/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveCheckInNotes}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Save Notes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Schedule Session Modal */}
      <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
        <DialogContent className="bg-gray-900 border-orange-500/30 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-400" />
              Schedule New Session
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="client" className="text-white">Client</Label>
              <select
                id="client"
                value={formData.client_id}
                onChange={(e) => setFormData({...formData, client_id: e.target.value})}
                className="w-full p-3 bg-white/5 border border-orange-500/30 rounded-lg text-white"
              >
                <option value="">Select a client</option>
                {clients.filter(c => c.subscription_status === 'active').map(client => (
                  <option key={client.id} value={client.id}>{client.full_name} ({client.email})</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date" className="text-white">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.scheduled_date}
                  onChange={(e) => setFormData({...formData, scheduled_date: e.target.value})}
                  className="bg-white/5 border-orange-500/30 text-white"
                />
              </div>
              <div>
                <Label htmlFor="time" className="text-white">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.scheduled_time}
                  onChange={(e) => setFormData({...formData, scheduled_time: e.target.value})}
                  className="bg-white/5 border-orange-500/30 text-white"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="type" className="text-white">Session Type</Label>
              <select
                id="type"
                value={formData.check_in_type}
                onChange={(e) => setFormData({...formData, check_in_type: e.target.value as 'video' | 'phone' | 'in-person'})}
                className="w-full p-3 bg-white/5 border border-orange-500/30 rounded-lg text-white"
              >
                <option value="video">Video Call</option>
                <option value="phone">Phone Call</option>
                <option value="in-person">In-Person</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="notes" className="text-white">Notes (Optional)</Label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full p-3 bg-white/5 border border-orange-500/30 rounded-lg text-white placeholder-white/50 resize-none"
                rows={3}
                placeholder="Add any notes for this session..."
              />
            </div>
            
            <div className="flex gap-3 justify-end">
              <Button
                onClick={() => setShowScheduleModal(false)}
                variant="outline"
                className="border-gray-500/30 text-gray-400 hover:bg-gray-500/10"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleScheduleSession}
                className="bg-orange-500 hover:bg-orange-600 text-white"
                disabled={!formData.client_id || !formData.scheduled_date || !formData.scheduled_time}
              >
                <Save className="w-4 h-4 mr-2" />
                Schedule Session
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
