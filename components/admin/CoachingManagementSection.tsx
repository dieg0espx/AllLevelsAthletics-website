"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  const [activeTab, setActiveTab] = useState<'clients' | 'sessions'>('clients')
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
  
  // Cancel session confirmation modal
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false)
  const [sessionToCancel, setSessionToCancel] = useState<string | null>(null)
  
  // Limit reached modal
  const [showLimitReachedModal, setShowLimitReachedModal] = useState(false)
  const [limitReachedClient, setLimitReachedClient] = useState<CoachingClient | null>(null)
  
  // Schedule modal calendar state
  const [scheduleSelectedDate, setScheduleSelectedDate] = useState<Date>(new Date())
  const [scheduleCurrentMonth, setScheduleCurrentMonth] = useState<Date>(new Date())
  const [availableHours, setAvailableHours] = useState<string[]>([])
  const [isLoadingHours, setIsLoadingHours] = useState(false)

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
    if (!formData.client_id || !formData.scheduled_date || !formData.scheduled_time) {
      return
    }

    try {
      // Create a proper datetime string in San Diego timezone (Pacific Time)
      const [year, month, day] = formData.scheduled_date.split('-')
      const [hour, minute] = formData.scheduled_time.split(':')
      
      // Create a date string in San Diego timezone
      const sanDiegoDateTimeString = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:00-07:00`
      const utcDate = new Date(sanDiegoDateTimeString)

      const response = await fetch('/api/coaching/check-ins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: formData.client_id,
          scheduledDate: utcDate.toISOString(),
          checkInType: 'regular',
          notes: formData.notes
        })
      })

      if (response.ok) {
        const data = await response.json()
        const createdCheckInId = data.checkIn?.id
        
        // Send confirmation email
        if (createdCheckInId) {
          console.log('Sending appointment confirmation email...')
          try {
            const emailResponse = await fetch('/api/coaching/send-appointment-confirmation', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                checkInId: createdCheckInId,
                userId: formData.client_id
              })
            })
            
            if (emailResponse.ok) {
              console.log('Confirmation email sent successfully')
            } else {
              const emailError = await emailResponse.json()
              console.error('Failed to send confirmation email:', emailError)
              // Don't fail the whole operation if email fails
            }
          } catch (emailError) {
            console.error('Error sending confirmation email:', emailError)
            // Don't fail the whole operation if email fails
          }
        }
        
        setShowScheduleModal(false)
        setFormData({
          client_id: '',
          scheduled_date: '',
          scheduled_time: '',
          check_in_type: 'video',
          notes: ''
        })
        setScheduleSelectedDate(new Date())
        setScheduleCurrentMonth(new Date())
        setAvailableHours([])
        onRefreshCheckIns()
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

  // Handle schedule button click - check limit first
  const handleScheduleClick = async (client: CoachingClient) => {
    // Fetch client sessions to check limit
    const now = new Date()
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    
    const clientSessions = checkIns.filter(checkIn => 
      checkIn.user?.id === client.id &&
      new Date(checkIn.scheduled_date) >= firstOfMonth &&
      new Date(checkIn.scheduled_date) <= lastOfMonth &&
      (checkIn.status === 'scheduled' || checkIn.status === 'completed')
    )
    
    const limit = getMonthlyLimit(client.plan_name)
    
    if (clientSessions.length >= limit) {
      setLimitReachedClient(client)
      setClientScheduledSessions(clientSessions)
      setShowLimitReachedModal(true)
      return
    }
    
    setFormData({ ...formData, client_id: client.id })
    setAvailableHours(generateAllHours())
    setShowScheduleModal(true)
  }

  // Cancel a client's session
  const handleCancelClientSession = (checkInId: string) => {
    setSessionToCancel(checkInId)
    setShowCancelConfirmModal(true)
  }

  // Confirm cancel session
  const confirmCancelSession = async () => {
    if (!sessionToCancel) return

    try {
      const response = await fetch('/api/admin/check-ins', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkInId: sessionToCancel,
          status: 'cancelled'
        })
      })

      if (response.ok) {
        setShowCancelConfirmModal(false)
        setSessionToCancel(null)
        // Refresh the page to show updated data
        window.location.reload()
      }
    } catch (error) {
      console.error('Error cancelling session:', error)
    }
  }

  // Calendar helper functions for schedule modal
  const getDaysInScheduleMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfScheduleMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getScheduleDaysArray = (date: Date) => {
    const daysInMonth = getDaysInScheduleMonth(date)
    const firstDay = getFirstDayOfScheduleMonth(date)
    const days = []
    
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }
    
    return days
  }

  const isScheduleToday = (day: number, month: Date) => {
    const today = new Date()
    return day === today.getDate() && 
           month.getMonth() === today.getMonth() && 
           month.getFullYear() === today.getFullYear()
  }

  const isScheduleSelected = (day: number, month: Date) => {
    return day === scheduleSelectedDate.getDate() && 
           month.getMonth() === scheduleSelectedDate.getMonth() && 
           month.getFullYear() === scheduleSelectedDate.getFullYear()
  }

  const isSchedulePastDate = (day: number, month: Date) => {
    const date = new Date(month.getFullYear(), month.getMonth(), day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const handleScheduleDateSelect = (day: number) => {
    const newDate = new Date(scheduleCurrentMonth.getFullYear(), scheduleCurrentMonth.getMonth(), day)
    setScheduleSelectedDate(newDate)
    
    // Update the formData with the selected date
    const dateString = newDate.toISOString().split('T')[0]
    setFormData({ ...formData, scheduled_date: dateString })
    
    // Fetch available hours for the selected date
    fetchAvailableHoursForDate(newDate)
  }

  const navigateScheduleMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(scheduleCurrentMonth)
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1)
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1)
    }
    setScheduleCurrentMonth(newMonth)
  }

  const fetchAvailableHoursForDate = async (date: Date) => {
    setIsLoadingHours(true)
    try {
      const dateString = date.toISOString().split('T')[0]
      const response = await fetch(`/api/coaching/schedule?date=${dateString}`)
      
      if (response.ok) {
        const data = await response.json()
        setAvailableHours(data.availableHours || generateAllHours())
      } else {
        setAvailableHours(generateAllHours())
      }
    } catch (error) {
      console.error('Error fetching available hours:', error)
      setAvailableHours(generateAllHours())
    } finally {
      setIsLoadingHours(false)
    }
  }

  const generateAllHours = () => {
    const hours = []
    for (let hour = 8; hour <= 17; hour++) {
      hours.push(`${hour.toString().padStart(2, '0')}:00`)
      hours.push(`${hour.toString().padStart(2, '0')}:30`)
    }
    hours.push('18:00')
    return hours
  }

  if (coachingLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5 md:w-6 md:h-6 text-orange-400" />
          Coaching Management
        </h2>
        <p className="text-white/70 mt-1 text-sm md:text-base">Manage coaching clients, sessions, and progress</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-white/5 p-1 rounded-lg border border-orange-500/30">
        <button
          onClick={() => setActiveTab('clients')}
          className={`flex-1 flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-4 py-2.5 md:py-2 rounded-md transition-all duration-300 text-sm md:text-base ${
            activeTab === 'clients'
              ? 'bg-orange-500 text-black font-medium'
              : 'text-white/70 hover:text-orange-400 hover:bg-white/10'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Clients</span>
        </button>
        <button
          onClick={() => setActiveTab('sessions')}
          className={`flex-1 flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-4 py-2.5 md:py-2 rounded-md transition-all duration-300 text-sm md:text-base ${
            activeTab === 'sessions'
              ? 'bg-orange-500 text-black font-medium'
              : 'text-white/70 hover:text-orange-400 hover:bg-white/10'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Sessions</span>
        </button>
      </div>

      {/* Clients Tab */}
      {activeTab === 'clients' && (
        <div className="space-y-3 md:space-y-4">
          {clients.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {clients.map((client) => (
                <Card key={client.id} className="bg-white/5 border-orange-500/30 overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-white text-base md:text-lg truncate">{client.full_name}</CardTitle>
                        <CardDescription className="text-white/70 text-xs md:text-sm break-all">{client.email}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="text-white/70">Plan:</span>
                      <span className="text-orange-400 font-medium">{client.plan_name}</span>
                    </div>
                    {client.next_session && (
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-xs md:text-sm">
                        <span className="text-white/70">Next Session:</span>
                        <span className="text-blue-400 font-medium">{formatDate(client.next_session)}</span>
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row gap-2 mt-4 pt-3 border-t border-white/10">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10 flex-1 h-10 text-xs md:text-sm"
                        onClick={() => handleViewClientDetails(client)}
                      >
                        <User className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1" />
                        View Details
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 flex-1 h-10 text-xs md:text-sm"
                        onClick={() => handleScheduleClick(client)}
                      >
                        <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1" />
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
        <div className="space-y-4 md:space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex-1">
              <h3 className="text-lg md:text-xl font-bold text-white">Check-ins Calendar</h3>
              <div className="text-xs md:text-sm text-white/70 mt-1">
                {checkIns.filter(c => c.status === 'scheduled').length} scheduled sessions
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                onClick={() => setCalendarView('month')}
                variant={calendarView === 'month' ? 'default' : 'outline'}
                className={`${calendarView === 'month' ? 'bg-orange-500 hover:bg-orange-600' : 'border-orange-500/30 text-orange-400 hover:bg-orange-500/10'} flex-1 sm:flex-initial h-9 text-xs md:text-sm`}
                size="sm"
              >
                Month
              </Button>
              <Button
                onClick={() => setCalendarView('week')}
                variant={calendarView === 'week' ? 'default' : 'outline'}
                className={`${calendarView === 'week' ? 'bg-orange-500 hover:bg-orange-600' : 'border-orange-500/30 text-orange-400 hover:bg-orange-500/10'} flex-1 sm:flex-initial h-9 text-xs md:text-sm`}
                size="sm"
              >
                Week
              </Button>
              <Button
                onClick={() => setCalendarView('day')}
                variant={calendarView === 'day' ? 'default' : 'outline'}
                className={`${calendarView === 'day' ? 'bg-orange-500 hover:bg-orange-600' : 'border-orange-500/30 text-orange-400 hover:bg-orange-500/10'} flex-1 sm:flex-initial h-9 text-xs md:text-sm`}
                size="sm"
              >
                Day
              </Button>
            </div>
          </div>

          {/* Calendar Navigation */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3">
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
                className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10 h-9 px-3 text-xs md:text-sm"
                size="sm"
              >
                ←
              </Button>
              <h4 className="text-sm md:text-base lg:text-lg font-semibold text-white text-center flex-1 sm:flex-initial sm:min-w-[200px]">
                {calendarView === 'month' 
                  ? selectedDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                  : calendarView === 'week' 
                  ? `Week of ${getWeekDays(selectedDate)[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                  : selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
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
                className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10 h-9 px-3 text-xs md:text-sm"
                size="sm"
              >
                →
              </Button>
            </div>
            <Button
              onClick={() => setSelectedDate(new Date())}
              variant="outline"
              className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10 h-9 text-xs md:text-sm w-full sm:w-auto"
              size="sm"
            >
              Today
            </Button>
          </div>

          {/* Calendar Grid */}
          {checkInsLoading ? (
            <div className="flex items-center justify-center py-12 md:py-16">
              <div className="w-6 h-6 md:w-8 md:h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <Card className="bg-white/5 border-orange-500/30 overflow-hidden">
              <CardContent className="p-3 md:p-6 overflow-x-auto">
                {calendarView === 'month' ? (
                  <div className="min-w-[280px]">
                    <div className="grid grid-cols-7 gap-0.5 md:gap-1">
                      {/* Day headers */}
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                        <div key={day} className="text-center text-white/70 text-xs md:text-sm font-medium py-1.5 md:py-2 border-b border-white/10">
                          <span className="hidden sm:inline">{day}</span>
                          <span className="sm:hidden">{day.substring(0, 1)}</span>
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
                            className={`min-h-[60px] md:min-h-[100px] p-1 md:p-2 border border-white/10 ${
                              isCurrentMonth ? 'bg-white/5' : 'bg-white/2'
                            } ${isToday ? 'ring-1 md:ring-2 ring-orange-500' : ''}`}
                          >
                            <div className={`text-xs md:text-sm font-medium mb-0.5 md:mb-1 ${
                              isCurrentMonth ? 'text-white' : 'text-white/50'
                            } ${isToday ? 'text-orange-400' : ''}`}>
                              {day.getDate()}
                            </div>
                            
                            <div className="space-y-0.5 md:space-y-1">
                              {dayCheckIns.slice(0, calendarView === 'month' ? 2 : 3).map((checkIn) => (
                                <div 
                                  key={checkIn.id}
                                  onClick={() => handleCheckInClick(checkIn)}
                                  className="bg-orange-500/20 border border-orange-500/30 rounded p-0.5 md:p-1 text-xs cursor-pointer hover:bg-orange-500/30 hover:border-orange-500/50 transition-colors"
                                >
                                  <div className="text-orange-400 font-medium truncate text-[10px] md:text-xs">
                                    {new Date(checkIn.scheduled_date).toLocaleTimeString('en-US', {
                                      hour: 'numeric',
                                      minute: '2-digit',
                                      hour12: true,
                                      timeZone: 'America/Los_Angeles'
                                    })}
                                  </div>
                                  <div className="text-white/70 truncate hidden md:block text-xs">
                                    {checkIn.user?.raw_user_meta_data?.full_name || checkIn.user?.email || 'Unknown'}
                                  </div>
                                </div>
                              ))}
                              {dayCheckIns.length > 2 && (
                                <div className="text-orange-400 text-[10px] md:text-xs">
                                  +{dayCheckIns.length - 2}
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : calendarView === 'week' ? (
                  <div className="min-w-[600px]">
                    <div className="grid grid-cols-8 gap-1 md:gap-2">
                      {/* Time column header */}
                      <div className="text-white/70 text-xs md:text-sm font-medium py-1.5 md:py-2">Time</div>
                      
                      {/* Day headers */}
                      {getWeekDays(selectedDate).map((day, index) => (
                        <div key={index} className="text-center text-white/70 text-xs md:text-sm font-medium py-1.5 md:py-2">
                          <div className="hidden sm:block">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                          <div className="sm:hidden">{day.toLocaleDateString('en-US', { weekday: 'narrow' })}</div>
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

      {/* Client Details Modal */}
      <Dialog open={showClientDetailsModal} onOpenChange={setShowClientDetailsModal}>
        <DialogContent className="bg-gray-900 border-orange-500/30 text-white w-[96vw] sm:max-w-[600px] md:max-w-3xl lg:max-w-5xl max-h-[92vh] p-0">
          <div className="overflow-y-auto max-h-[92vh] p-4 sm:p-5 md:p-6">
            <DialogHeader className="mb-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <DialogTitle className="text-white text-lg md:text-xl flex items-center gap-2">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 md:w-6 md:h-6 text-black" />
                  </div>
                  Client Profile
                </DialogTitle>
                {selectedClientForDetails && (
                  <Badge className={`${selectedClientForDetails.subscription_status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'} text-xs flex-shrink-0`}>
                    {selectedClientForDetails.subscription_status}
                  </Badge>
                )}
              </div>
            </DialogHeader>
          
          {selectedClientForDetails && (
            <div className="space-y-4 sm:space-y-6">
              {/* Client Name Header */}
              <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-lg p-3 sm:p-4 border border-orange-500/30">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">{selectedClientForDetails.full_name}</h2>
                <p className="text-orange-400 text-sm sm:text-base">{selectedClientForDetails.plan_name} Plan</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Left Column - Contact & Subscription Info */}
                <div className="space-y-3 sm:space-y-4">
                  {/* Contact Info */}
                  <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-orange-500/20">
                    <h3 className="text-orange-400 font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
                      <MessageSquare className="w-4 h-4" />
                      Contact Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                        <span className="text-white/70 text-xs sm:text-sm">Email:</span>
                        <span className="text-white text-xs sm:text-sm break-all">{selectedClientForDetails.email}</span>
                      </div>
                      {selectedClientForDetails.phone && (
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                          <span className="text-white/70 text-xs sm:text-sm">Phone:</span>
                          <span className="text-white text-xs sm:text-sm">{selectedClientForDetails.phone}</span>
                        </div>
                      )}
                      {(selectedClientForDetails.address || selectedClientForDetails.city) && (
                        <div className="flex flex-col gap-1 mt-3">
                          <span className="text-white/70 text-xs sm:text-sm">Address:</span>
                          {selectedClientForDetails.address && (
                            <span className="text-white text-xs sm:text-sm">{selectedClientForDetails.address}</span>
                          )}
                          {(selectedClientForDetails.city || selectedClientForDetails.state) && (
                            <span className="text-white text-xs sm:text-sm">
                              {selectedClientForDetails.city}{selectedClientForDetails.city && selectedClientForDetails.state ? ', ' : ''}{selectedClientForDetails.state} {selectedClientForDetails.zip_code}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Subscription Info */}
                  <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-orange-500/20">
                    <h3 className="text-orange-400 font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
                      <Star className="w-4 h-4" />
                      Subscription Details
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-white/70 text-xs sm:text-sm">Plan:</span>
                        <span className="text-orange-400 font-medium text-xs sm:text-sm">{selectedClientForDetails.plan_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70 text-xs sm:text-sm">Monthly Limit:</span>
                        <span className="text-white font-medium text-xs sm:text-sm">{getMonthlyLimit(selectedClientForDetails.plan_name)} sessions/month</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - This Month's Sessions */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-orange-500/20">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <h3 className="text-orange-400 font-semibold flex items-center gap-2 text-sm sm:text-base">
                        <Calendar className="w-4 h-4" />
                        This Month's Sessions
                      </h3>
                      <Badge className={`${clientScheduledSessions.length >= getMonthlyLimit(selectedClientForDetails.plan_name) ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'} text-xs sm:text-sm`}>
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

                  {/* Session Info */}
                  <div className={`${clientScheduledSessions.length >= getMonthlyLimit(selectedClientForDetails.plan_name) ? 'bg-red-500/10 border-red-500/30' : 'bg-green-500/10 border-green-500/30'} border rounded-lg p-3 sm:p-4`}>
                    <div className="flex items-center gap-2 mb-2">
                      {clientScheduledSessions.length >= getMonthlyLimit(selectedClientForDetails.plan_name) ? (
                        <>
                          <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                          <h4 className="text-red-400 font-semibold text-sm sm:text-base">Monthly Limit Reached</h4>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                          <h4 className="text-green-400 font-semibold text-sm sm:text-base">Sessions Available</h4>
                        </>
                      )}
                    </div>
                    <p className="text-white/80 text-xs sm:text-sm">
                      {clientScheduledSessions.length >= getMonthlyLimit(selectedClientForDetails.plan_name) ? (
                        <>
                          Client has reached their monthly limit of {getMonthlyLimit(selectedClientForDetails.plan_name)} sessions. 
                          To schedule more, cancel/reschedule an existing session or have them upgrade their plan.
                        </>
                      ) : (
                        <>
                          {getMonthlyLimit(selectedClientForDetails.plan_name) - clientScheduledSessions.length} session{getMonthlyLimit(selectedClientForDetails.plan_name) - clientScheduledSessions.length !== 1 ? 's' : ''} remaining this month
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-4 border-t border-white/10">
                <Button
                  onClick={() => setShowClientDetailsModal(false)}
                  variant="outline"
                  className="w-full sm:w-auto border-gray-500/30 text-gray-400 hover:bg-gray-500/10 h-11 text-sm md:text-base"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setFormData({ ...formData, client_id: selectedClientForDetails.id })
                    setAvailableHours(generateAllHours())
                    setShowClientDetailsModal(false)
                    setShowScheduleModal(true)
                  }}
                  disabled={clientScheduledSessions.length >= getMonthlyLimit(selectedClientForDetails.plan_name)}
                  className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50 disabled:cursor-not-allowed h-11 text-sm md:text-base"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {clientScheduledSessions.length >= getMonthlyLimit(selectedClientForDetails.plan_name) 
                    ? 'Limit Reached' 
                    : 'Schedule New Session'}
                </Button>
              </div>
            </div>
          )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Limit Reached Modal */}
      <Dialog open={showLimitReachedModal} onOpenChange={setShowLimitReachedModal}>
        <DialogContent className="bg-gray-900 border-orange-500/30 text-white w-[96vw] sm:max-w-2xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white text-xl flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                <X className="w-5 h-5 text-red-400" />
              </div>
              Monthly Limit Reached
            </DialogTitle>
          </DialogHeader>
          
          {limitReachedClient && (
            <div className="space-y-4">
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <p className="text-white/90 font-medium mb-2">
                  {limitReachedClient.full_name} has reached their monthly limit of {getMonthlyLimit(limitReachedClient.plan_name)} sessions.
                </p>
                <p className="text-white/70 text-sm">
                  To schedule additional sessions, you can:
                </p>
                <ul className="text-white/70 text-sm mt-2 space-y-1 list-disc list-inside">
                  <li>Cancel or reschedule an existing session below</li>
                  <li>Have the client upgrade their plan (Foundation → Growth → Elite)</li>
                </ul>
              </div>

              {/* Show client's scheduled sessions */}
              {clientScheduledSessions.length > 0 && (
                <div className="bg-white/5 rounded-lg p-4 border border-orange-500/20">
                  <h4 className="text-white font-semibold mb-3">This Month's Scheduled Sessions:</h4>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {clientScheduledSessions.filter(s => s.status === 'scheduled').map((session) => (
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
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
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
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setShowLimitReachedModal(false)
                            handleCancelClientSession(session.id)
                          }}
                          className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs mt-2"
                        >
                          <X className="w-3 h-3 mr-1" />
                          Cancel This Session
                        </Button>
                      </div>
                    ))}
                  </div>
        </div>
      )}

              <div className="flex gap-3 justify-end">
                <Button
                  onClick={() => {
                    setShowLimitReachedModal(false)
                    setLimitReachedClient(null)
                  }}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Got It
                </Button>
                  </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Session Confirmation Modal */}
      <Dialog open={showCancelConfirmModal} onOpenChange={setShowCancelConfirmModal}>
        <DialogContent className="bg-gray-900 border-orange-500/30 text-white w-[96vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white text-xl flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                <X className="w-5 h-5 text-red-400" />
                  </div>
              Cancel Session
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-white/90">
                Are you sure you want to cancel this session?
              </p>
              <p className="text-white/70 text-sm mt-2">
                This action cannot be undone. The time slot will become available for others to book.
                  </p>
                </div>

            <div className="flex gap-3 justify-end">
              <Button
                onClick={() => {
                  setShowCancelConfirmModal(false)
                  setSessionToCancel(null)
                }}
                variant="outline"
                className="border-gray-500/30 text-gray-400 hover:bg-gray-500/10"
              >
                Keep Session
              </Button>
              <Button
                onClick={confirmCancelSession}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Yes, Cancel Session
              </Button>
                  </div>
                </div>
        </DialogContent>
      </Dialog>

      {/* Check-in Notes Modal */}
      <Dialog open={showCheckInModal} onOpenChange={setShowCheckInModal}>
        <DialogContent className="bg-gray-900 border-orange-500/30 text-white w-[96vw] sm:max-w-md max-h-[92vh] overflow-y-auto">
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
        <DialogContent className="bg-gray-900 border-orange-500/30 text-white w-[96vw] sm:max-w-[600px] md:max-w-3xl lg:max-w-5xl max-h-[92vh] p-0">
          <div className="overflow-y-auto max-h-[92vh] p-4 sm:p-5 md:p-6">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-white text-lg md:text-xl flex items-center gap-2">
                <Calendar className="w-4 h-4 md:w-5 md:h-5 text-orange-400" />
                Schedule New Session
              </DialogTitle>
            </DialogHeader>
          
          <div className="space-y-4 md:space-y-6">
            {/* Client Selection */}
            <div>
              <Label htmlFor="client" className="text-white text-sm font-medium mb-2 block">Select Client</Label>
              <select
                id="client"
                value={formData.client_id}
                onChange={(e) => setFormData({...formData, client_id: e.target.value})}
                className="w-full p-3 bg-white/5 border border-orange-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 h-11 text-sm md:text-base"
              >
                <option value="">Select a client</option>
                {clients.filter(c => c.subscription_status === 'active').map(client => (
                  <option key={client.id} value={client.id}>{client.full_name} - {client.plan_name} Plan</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
              {/* Left Column - Calendar */}
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-white text-sm md:text-base lg:text-lg font-medium">Select Date</h3>
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateScheduleMonth('prev')}
                      className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10 h-8 px-2 md:px-3 text-sm"
                    >
                      ←
                    </Button>
                    <span className="text-white font-medium min-w-[100px] md:min-w-[140px] text-center text-xs md:text-sm">
                      {scheduleCurrentMonth.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateScheduleMonth('next')}
                      className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10 h-8 px-2 md:px-3 text-sm"
                    >
                      →
                    </Button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="bg-white/5 rounded-lg p-1.5 md:p-2 border border-orange-500/30">
                  {/* Day Headers */}
                  <div className="grid grid-cols-7 gap-0.5 md:gap-1 mb-1">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="text-center text-orange-400 text-[10px] md:text-xs font-medium p-1">
                        <span className="hidden sm:inline">{day}</span>
                        <span className="sm:hidden">{day.substring(0, 1)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-0.5 md:gap-1">
                    {getScheduleDaysArray(scheduleCurrentMonth).map((day, index) => (
                      <div key={index} className="aspect-square">
                        {day ? (
                          <button
                            onClick={() => handleScheduleDateSelect(day)}
                            disabled={isSchedulePastDate(day, scheduleCurrentMonth)}
                            className={`
                              w-full h-full rounded-md text-xs md:text-sm font-medium transition-colors
                              ${isSchedulePastDate(day, scheduleCurrentMonth)
                                ? 'text-white/30 cursor-not-allowed'
                                : isScheduleSelected(day, scheduleCurrentMonth)
                                ? 'bg-orange-500 text-white'
                                : isScheduleToday(day, scheduleCurrentMonth)
                                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                                : 'text-white hover:bg-orange-500/20 hover:text-orange-400'
                              }
                            `}
                          >
                            {day}
                          </button>
                        ) : (
                          <div className="w-full h-full" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Time & Details */}
              <div className="space-y-4 md:space-y-6">
                {/* Time Selection */}
                <div className="space-y-2 md:space-y-3">
                  <Label htmlFor="time" className="text-white text-sm md:text-base font-medium">Select Time</Label>
                  
                  {isLoadingHours ? (
                    <div className="flex items-center justify-center p-4">
                      <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="ml-2 text-white/70 text-sm">Loading available times...</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="available-time" className="text-white text-sm font-medium">Available Times</Label>
                        <div className="text-xs text-white/60">
                          {availableHours.length} slots available
                        </div>
                      </div>
                      
                      <Select
                  value={formData.scheduled_time}
                        onValueChange={(time) => {
                          setFormData({ ...formData, scheduled_time: time })
                        }}
                      >
                        <SelectTrigger className="w-full p-4 bg-black/30 border border-orange-500/20 rounded-lg text-white hover:border-orange-500/40 hover:bg-black/40 focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 h-auto">
                          <SelectValue placeholder="Choose time slot" className="text-white/70 data-[placeholder]:text-white/70" />
                        </SelectTrigger>
                        <SelectContent className="bg-black/95 border border-orange-500/20 text-white rounded-lg shadow-xl max-h-60 overflow-y-auto">
                          {availableHours.map((hour) => {
                            const [h, m] = hour.split(':')
                            const hour24 = parseInt(h)
                            const displayTime = hour24 > 12 ? `${hour24 - 12}:${m} PM` : hour24 === 12 ? `12:${m} PM` : `${hour24}:${m} AM`
                            
                            return (
                              <SelectItem 
                                key={hour} 
                                value={hour}
                                className="text-white hover:bg-orange-500/20 hover:text-orange-300 focus:bg-orange-500/20 focus:text-orange-300 cursor-pointer"
                              >
                                {displayTime}
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
              </div>
                  )}
            </div>
            
                {/* Session Type */}
                <div className="space-y-3">
                  <Label htmlFor="type" className="text-white text-sm font-medium">Session Type</Label>
              <select
                id="type"
                value={formData.check_in_type}
                onChange={(e) => setFormData({...formData, check_in_type: e.target.value as 'video' | 'phone' | 'in-person'})}
                    className="w-full p-3 bg-white/5 border border-orange-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              >
                <option value="video">Video Call</option>
                <option value="phone">Phone Call</option>
                <option value="in-person">In-Person</option>
              </select>
            </div>
            
                {/* Notes */}
                <div className="space-y-3">
                  <Label htmlFor="notes" className="text-white text-sm font-medium">Notes (Optional)</Label>
                  <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Add meeting link, preparation notes, or any information the client should know..."
                    className="bg-white/5 border-orange-500/30 text-white p-3"
                    rows={4}
                  />
                </div>
              </div>
            </div>
            
            {/* Selected Date/Time Preview */}
            {(formData.scheduled_date && formData.scheduled_time) && (
              <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/30">
                <h4 className="text-white font-medium mb-2">Selected Session:</h4>
                <p className="text-orange-400">
                  {(() => {
                    const [year, month, day] = formData.scheduled_date.split('-')
                    const [hour, minute] = formData.scheduled_time.split(':')
                    const localDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute))
                    
                    return localDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) + ' at ' + localDate.toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })
                  })()}
                </p>
                {formData.client_id && (
                  <p className="text-white/70 text-sm mt-1">
                    Client: {clients.find(c => c.id === formData.client_id)?.full_name}
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowScheduleModal(false)}
                className="flex-1 border-orange-500/30 text-orange-400 hover:bg-orange-500/10 h-11 text-sm md:text-base"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleScheduleSession}
                className="flex-1 bg-orange-500 hover:bg-orange-600 h-11 text-sm md:text-base"
                disabled={!formData.client_id || !formData.scheduled_date || !formData.scheduled_time}
              >
                <Save className="w-4 h-4 mr-2" />
                Schedule Session
              </Button>
            </div>
          </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
