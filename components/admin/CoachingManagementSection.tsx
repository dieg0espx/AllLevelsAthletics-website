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

interface CoachingManagementSectionProps {
  coachingLoading: boolean
  onRefresh: () => void
}

export function CoachingManagementSection({ 
  coachingLoading, 
  onRefresh 
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
                      <Button size="sm" variant="outline" className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10 flex-1">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Message
                      </Button>
                      <Button size="sm" variant="outline" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 flex-1">
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

      {/* Sessions Tab */}
      {activeTab === 'sessions' && (
        <div className="space-y-4">
          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search sessions by client name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-orange-500/30 text-white placeholder-white/50 focus:ring-orange-500/50"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white/5 border border-orange-500/30 rounded-lg text-white"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no-show">No Show</option>
            </select>
          </div>

          {/* Sessions List */}
          {filteredSessions.length > 0 ? (
            <div className="space-y-3">
              {filteredSessions.map((session) => (
                <Card key={session.id} className="bg-white/5 border-orange-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 ${getSessionTypeColor(session.check_in_type)} rounded-full flex items-center justify-center`}>
                          {getSessionTypeIcon(session.check_in_type)}
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{session.client_name}</h3>
                          <p className="text-white/70 text-sm">{session.client_email}</p>
                          <p className="text-white/60 text-sm">
                            {formatDate(session.scheduled_date)} at {formatTime(session.scheduled_date)}
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
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingSession(session)}
                          className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-white/5 border-orange-500/30">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Sessions Found</h3>
                <p className="text-white/70">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'No sessions match your search criteria.' 
                    : 'No coaching sessions have been scheduled yet.'}
                </p>
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
