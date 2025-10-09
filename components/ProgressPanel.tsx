"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  Target,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Video,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CheckIn {
  id: string
  scheduled_date: string
  completed_date?: string
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
  check_in_type: 'regular' | 'progress_review' | 'form_check' | 'goal_setting'
  notes?: string
  feedback?: string
  goals_achieved?: any
  next_goals?: any
  progress_metrics?: any
}

interface ProgressEntry {
  id: string
  metric_name: string
  metric_value?: number
  metric_unit?: string
  notes?: string
  recorded_date: string
}

interface MetricTemplate {
  id: string
  metric_name: string
  default_unit?: string
  created_at: string
}

interface MetricHistory {
  id: string
  metric_name: string
  metric_value?: number
  metric_unit?: string
  notes?: string
  recorded_date: string
}

interface ProgressPanelProps {
  userId: string
  currentPlan: string
}

export function ProgressPanel({ userId, currentPlan }: ProgressPanelProps) {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([])
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([])
  const [metricTemplates, setMetricTemplates] = useState<MetricTemplate[]>([])
  const [metricHistory, setMetricHistory] = useState<MetricHistory[]>([])
  const [selectedMetric, setSelectedMetric] = useState<string>('')
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [showAllMetricsModal, setShowAllMetricsModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showAddCheckIn, setShowAddCheckIn] = useState(false)
  const [showAddProgress, setShowAddProgress] = useState(false)
  const [showAllUpcoming, setShowAllUpcoming] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [checkInToCancel, setCheckInToCancel] = useState<string | null>(null)
  const [userRegistrationDate, setUserRegistrationDate] = useState<Date | null>(null)
  const checkInSectionRef = useRef<HTMLDivElement>(null)
  const [newCheckIn, setNewCheckIn] = useState({
    scheduled_date: '',
    check_in_type: 'regular' as const,
    notes: ''
  })
  const [newProgress, setNewProgress] = useState({
    metric_name: '',
    metric_value: '',
    metric_unit: '',
    notes: ''
  })
  const [isAddingProgress, setIsAddingProgress] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [availableHours, setAvailableHours] = useState<string[]>([])
  const [isLoadingHours, setIsLoadingHours] = useState(false)
  const [showNotesModal, setShowNotesModal] = useState(false)
  const [selectedCheckInForNotes, setSelectedCheckInForNotes] = useState<CheckIn | null>(null)
  const [notesText, setNotesText] = useState('')
  const [isUpdatingNotes, setIsUpdatingNotes] = useState(false)

  useEffect(() => {
    fetchCheckIns()
    fetchProgress()
    fetchMetricTemplates()
    fetchUserProfile()
  }, [userId])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`/api/user-profile?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.profile && data.profile.created_at) {
          setUserRegistrationDate(new Date(data.profile.created_at))
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const fetchCheckIns = async () => {
    try {
      console.log('Fetching check-ins for userId:', userId) // Debug log
      const response = await fetch(`/api/coaching/check-ins?userId=${userId}`)
      console.log('Check-ins API response status:', response.status) // Debug log
      
      if (response.ok) {
        const data = await response.json()
        console.log('Raw check-ins API data:', data) // Debug log
        
        // Filter out any test or invalid data
        const validCheckIns = (data.checkIns || []).filter((checkIn: any) => {
          // Ensure required fields exist and are valid
          return checkIn.id && 
                 checkIn.scheduled_date && 
                 checkIn.status &&
                 checkIn.user_id === userId
        })
        
        console.log('Filtered valid check-ins:', validCheckIns) // Debug log
        setCheckIns(validCheckIns)
      } else {
        const errorData = await response.json()
        console.error('Check-ins API error:', errorData)
      }
    } catch (error) {
      console.error('Error fetching check-ins:', error)
    }
  }

  const fetchProgress = async () => {
    try {
      console.log('Fetching progress for userId:', userId) // Debug log
      const response = await fetch(`/api/coaching/progress?userId=${userId}`)
      console.log('Progress API response status:', response.status) // Debug log
      
      if (response.ok) {
        const data = await response.json()
        console.log('Progress API data:', data) // Debug log
        setProgressEntries(data.progress || [])
      } else {
        const errorData = await response.json()
        console.error('Progress API error:', errorData)
      }
    } catch (error) {
      console.error('Error fetching progress:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMetricTemplates = async () => {
    try {
      const response = await fetch(`/api/coaching/metric-templates?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setMetricTemplates(data.templates || [])
      }
    } catch (error) {
      console.error('Error fetching metric templates:', error)
    }
  }

  const fetchMetricHistory = async (metricName: string) => {
    try {
      const response = await fetch(`/api/coaching/metric-history?userId=${userId}&metricName=${encodeURIComponent(metricName)}`)
      if (response.ok) {
        const data = await response.json()
        setMetricHistory(data.history || [])
        setSelectedMetric(metricName)
        setShowHistoryModal(true)
      }
    } catch (error) {
      console.error('Error fetching metric history:', error)
    }
  }

  const deleteAllCheckIns = async () => {
    if (!confirm(`Are you sure you want to delete ALL ${checkIns.length} check-ins? This cannot be undone.`)) {
      return
    }

    try {
      console.log('Deleting all check-ins for userId:', userId)
      
      // Delete each check-in individually
      const deletePromises = checkIns.map(checkIn => 
        fetch(`/api/coaching/check-ins?checkInId=${checkIn.id}`, {
          method: 'DELETE'
        })
      )

      const results = await Promise.all(deletePromises)
      const failed = results.filter(response => !response.ok)
      
      if (failed.length === 0) {
        console.log('Successfully deleted all check-ins')
        fetchCheckIns() // Refresh the list
      } else {
        console.error('Some deletions failed:', failed)
        console.error(`Deleted ${results.length - failed.length} check-ins, but ${failed.length} failed to delete.`)
      }
    } catch (error) {
      console.error('Error deleting check-ins:', error)
    }
  }

  const handleCancelCheckIn = (checkInId: string) => {
    setCheckInToCancel(checkInId)
    setShowCancelModal(true)
  }

  const confirmCancelCheckIn = async () => {
    if (!checkInToCancel) return

    try {
      const response = await fetch('/api/coaching/check-ins', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          checkInId: checkInToCancel, 
          status: 'cancelled' 
        })
      })

      if (response.ok) {
        setShowCancelModal(false)
        setCheckInToCancel(null)
        // Refresh the page to show updated data
        window.location.reload()
      } else {
        console.error('Error cancelling check-in')
      }
    } catch (error) {
      console.error('Error cancelling check-in:', error)
    }
  }

  const fetchAvailableHours = async (selectedDate: Date) => {
    setIsLoadingHours(true)
    try {
      const dateString = selectedDate.toISOString().split('T')[0]
      const response = await fetch(`/api/coaching/schedule?date=${dateString}`)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Available hours updated:', data.availableHours) // Debug log
        setAvailableHours(data.availableHours || [])
        
        // Reset selected time if it's no longer available
        if (newCheckIn.scheduled_date) {
          const selectedTime = newCheckIn.scheduled_date.split('T')[1]
          if (!data.availableHours?.includes(selectedTime)) {
            console.log('Selected time no longer available, resetting')
            setNewCheckIn({ ...newCheckIn, scheduled_date: newCheckIn.scheduled_date.split('T')[0] + 'T' })
          }
        }
      } else {
        console.error('Error fetching available hours')
        // Fallback to all hours if API fails
        setAvailableHours(generateAllHours())
      }
    } catch (error) {
      console.error('Error fetching available hours:', error)
      // Fallback to all hours if API fails
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
    hours.push('18:00') // Add 6:00 PM
    return hours
  }

  const handleAddCheckIn = async () => {
    // Basic validation
    if (!newCheckIn.scheduled_date) {
      console.log('Please select a date and time for your check-in')
      return
    }

    // Check monthly limit
    if (getRemainingCheckIns() === 0) {
      console.log(`You've reached your monthly limit of ${getMonthlyCheckInLimit()} check-ins. Please wait until next month or upgrade your plan.`)
      return
    }

    try {
      // Create a proper datetime string in San Diego timezone (Pacific Time)
      const [datePart, timePart] = newCheckIn.scheduled_date.split('T')
      const [year, month, day] = datePart.split('-')
      const [hour, minute] = timePart.split(':')
      
      // Create a date string in San Diego timezone and let JavaScript handle the conversion
      // Use -07:00 for PDT (Pacific Daylight Time) which is current for San Diego
      const sanDiegoDateTimeString = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:00-07:00`
      const utcDate = new Date(sanDiegoDateTimeString)
      
      const response = await fetch('/api/coaching/check-ins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          scheduledDate: utcDate.toISOString(),
          checkInType: 'regular', // Default to regular since we removed the selection
          notes: newCheckIn.notes
        })
      })

      if (response.ok) {
        const data = await response.json()
        const createdCheckInId = data.checkIn?.id
        
        // Immediately remove the selected time from available hours
        const selectedTime = newCheckIn.scheduled_date.split('T')[1]
        setAvailableHours(prev => prev.filter(hour => hour !== selectedTime))
        
        setNewCheckIn({ scheduled_date: '', check_in_type: 'regular', notes: '' })
        setShowAddCheckIn(false)
        fetchCheckIns()
        
        // Send confirmation email
        if (createdCheckInId) {
          console.log('Sending appointment confirmation email...')
          try {
            const emailResponse = await fetch('/api/coaching/send-appointment-confirmation', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                checkInId: createdCheckInId,
                userId
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
        
        // Also refresh available hours after creating a check-in (with small delay to ensure DB update)
        setTimeout(() => {
          fetchAvailableHours(selectedDate)
        }, 500)
      } else {
        const errorData = await response.json()
        console.error('Error response:', errorData)
        console.error('Failed to schedule check-in. Please try again.')
      }
    } catch (error) {
      console.error('Error adding check-in:', error)
    }
  }

  const handleAddProgress = async () => {
    // Basic validation
    if (!newProgress.metric_name.trim()) {
      console.log('Please enter a metric name')
      return
    }

    if (isAddingProgress) return // Prevent multiple clicks

    setIsAddingProgress(true)

    try {
      console.log('Adding progress:', newProgress) // Debug log
      
      const response = await fetch('/api/coaching/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          metricName: newProgress.metric_name,
          metricValue: newProgress.metric_value ? parseFloat(newProgress.metric_value) : null,
          metricUnit: newProgress.metric_unit,
          notes: newProgress.notes
        })
      })

      console.log('Response status:', response.status) // Debug log

      if (response.ok) {
        const data = await response.json()
        console.log('Progress added successfully:', data) // Debug log
        setNewProgress({ metric_name: '', metric_value: '', metric_unit: '', notes: '' })
        setShowAddProgress(false)
        console.log('Refreshing progress list...') // Debug log
        await fetchProgress() // Wait for fetch to complete
        await fetchMetricTemplates() // Refresh templates
      } else {
        const errorData = await response.json()
        console.error('Error response:', errorData)
        console.error('Failed to add progress entry. Please try again.')
      }
    } catch (error) {
      console.error('Error adding progress:', error)
    } finally {
      setIsAddingProgress(false)
    }
  }

  const handleUpdateNotes = async () => {
    if (!selectedCheckInForNotes) return

    if (isUpdatingNotes) return // Prevent multiple clicks

    setIsUpdatingNotes(true)

    try {
      const response = await fetch('/api/coaching/check-ins', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkInId: selectedCheckInForNotes.id,
          notes: notesText
        })
      })

      if (response.ok) {
        // Update the local state
        setCheckIns(prev => prev.map(checkIn => 
          checkIn.id === selectedCheckInForNotes.id 
            ? { ...checkIn, notes: notesText }
            : checkIn
        ))
        
        setShowNotesModal(false)
        setSelectedCheckInForNotes(null)
        setNotesText('')
      } else {
        const errorData = await response.json()
        console.error('Error response:', errorData)
        console.error('Failed to update notes. Please try again.')
      }
    } catch (error) {
      console.error('Error updating notes:', error)
    } finally {
      setIsUpdatingNotes(false)
    }
  }

  const openNotesModal = (checkIn: CheckIn) => {
    setSelectedCheckInForNotes(checkIn)
    setNotesText(checkIn.notes || '')
    setShowNotesModal(true)
  }

  const getCheckInFrequency = () => {
    switch (currentPlan.toLowerCase()) {
      case 'starter':
      case 'foundation':
        return 'Once per month'
      case 'growth':
        return 'Twice per month'
      case 'elite':
        return 'Weekly'
      default:
        return 'Once per month'
    }
  }

  const getMonthlyCheckInLimit = () => {
    switch (currentPlan.toLowerCase()) {
      case 'starter':
      case 'foundation':
        return 1
      case 'growth':
        return 2
      case 'elite':
        return 4 // Weekly = 4 times per month
      default:
        return 1
    }
  }

  const getCurrentMonthCheckIns = () => {
    if (!userRegistrationDate) {
      // Fallback to calendar month if registration date not available
      const now = new Date()
      const currentMonth = now.getMonth()
      const currentYear = now.getFullYear()
      
      return checkIns.filter(checkIn => {
        const checkInDate = new Date(checkIn.scheduled_date)
        return checkInDate.getMonth() === currentMonth && 
               checkInDate.getFullYear() === currentYear &&
               (checkIn.status === 'scheduled' || checkIn.status === 'completed')
      })
    }

    const now = new Date()
    const registrationDate = new Date(userRegistrationDate)
    
    // Calculate the billing month based on registration date
    const monthsSinceRegistration = (now.getFullYear() - registrationDate.getFullYear()) * 12 + 
                                   (now.getMonth() - registrationDate.getMonth())
    
    // Get the start and end of the current billing month
    const billingMonthStart = new Date(registrationDate)
    billingMonthStart.setMonth(registrationDate.getMonth() + monthsSinceRegistration)
    billingMonthStart.setDate(registrationDate.getDate())
    billingMonthStart.setHours(0, 0, 0, 0)
    
    const billingMonthEnd = new Date(billingMonthStart)
    billingMonthEnd.setMonth(billingMonthStart.getMonth() + 1)
    billingMonthEnd.setDate(billingMonthStart.getDate() - 1)
    billingMonthEnd.setHours(23, 59, 59, 999)
    
    return checkIns.filter(checkIn => {
      const checkInDate = new Date(checkIn.scheduled_date)
      return checkInDate >= billingMonthStart && 
             checkInDate <= billingMonthEnd &&
             (checkIn.status === 'scheduled' || checkIn.status === 'completed')
    })
  }

  const getRemainingCheckIns = () => {
    const currentMonthCheckIns = getCurrentMonthCheckIns()
    const limit = getMonthlyCheckInLimit()
    return Math.max(0, limit - currentMonthCheckIns.length)
  }

  const getOrdinalSuffix = (day: number) => {
    if (day >= 11 && day <= 13) {
      return 'th'
    }
    switch (day % 10) {
      case 1: return 'st'
      case 2: return 'nd'
      case 3: return 'rd'
      default: return 'th'
    }
  }

  const scrollToCheckInSection = () => {
    if (checkInSectionRef.current) {
      checkInSectionRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  const getLatestMetrics = () => {
    const metricMap = new Map()
    
    progressEntries.forEach(entry => {
      if (!metricMap.has(entry.metric_name) || 
          new Date(entry.recorded_date) > new Date(metricMap.get(entry.metric_name).recorded_date)) {
        metricMap.set(entry.metric_name, entry)
      }
    })
    
    return Array.from(metricMap.values()).sort((a, b) => 
      new Date(b.recorded_date).getTime() - new Date(a.recorded_date).getTime()
    )
  }

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getDaysArray = (date: Date) => {
    const daysInMonth = getDaysInMonth(date)
    const firstDay = getFirstDayOfMonth(date)
    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }
    
    return days
  }

  const isToday = (day: number, month: Date) => {
    const today = new Date()
    return day === today.getDate() && 
           month.getMonth() === today.getMonth() && 
           month.getFullYear() === today.getFullYear()
  }

  const isSelected = (day: number, month: Date) => {
    return day === selectedDate.getDate() && 
           month.getMonth() === selectedDate.getMonth() && 
           month.getFullYear() === selectedDate.getFullYear()
  }

  const isPastDate = (day: number, month: Date) => {
    const date = new Date(month.getFullYear(), month.getMonth(), day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    setSelectedDate(newDate)
    
    // Fetch available hours for the selected date
    fetchAvailableHours(newDate)
    
    // Update the newCheckIn with the selected date and current time
    const time = newCheckIn.scheduled_date ? newCheckIn.scheduled_date.split('T')[1] : '09:00'
    const dateString = newDate.toISOString().split('T')[0]
    setNewCheckIn({ ...newCheckIn, scheduled_date: `${dateString}T${time}` })
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth)
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1)
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1)
    }
    setCurrentMonth(newMonth)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-400" />
      case 'rescheduled':
        return <Clock className="w-4 h-4 text-yellow-400" />
      default:
        return <Clock className="w-4 h-4 text-orange-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'rescheduled':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      default:
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'progress_review':
        return <TrendingUp className="w-4 h-4" />
      case 'form_check':
        return <Video className="w-4 h-4" />
      case 'goal_setting':
        return <Target className="w-4 h-4" />
      default:
        return <MessageSquare className="w-4 h-4" />
    }
  }

  const upcomingCheckIns = checkIns.filter(ci => 
    ci.status === 'scheduled' && new Date(ci.scheduled_date) >= new Date()
  )

  const pastCheckIns = checkIns.filter(ci => 
    ci.status === 'completed' || (ci.status === 'scheduled' && new Date(ci.scheduled_date) < new Date())
  ).sort((a, b) => new Date(b.scheduled_date).getTime() - new Date(a.scheduled_date).getTime())


  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="bg-white/5 border-orange-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-400" />
            Progress Panel
          </CardTitle>
          <CardDescription className="text-white/70">
            Track your coaching progress and scheduled check-ins
          </CardDescription>
        </CardHeader>
        <CardContent>
          
          
          {/* Next Check-in */}
          {upcomingCheckIns.length > 0 && (
            <div className="mb-6 p-4 bg-orange-500/10 rounded-lg border border-orange-500/30">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-400" />
                Next Check-in
              </h3>
              {(() => {
                const nextCheckIn = upcomingCheckIns.sort((a, b) => 
                  new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime()
                )[0]
                return (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium text-lg">
                        {new Date(nextCheckIn.scheduled_date).toLocaleDateString('en-US', { 
                          weekday: 'long',
                          month: 'long', 
                          day: 'numeric',
                          timeZone: 'America/Los_Angeles' 
                        })} at {new Date(nextCheckIn.scheduled_date).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                          timeZone: 'America/Los_Angeles'
                        })}
                      </p>
                      <p className="text-white/70 text-sm capitalize">
                        {nextCheckIn.check_in_type.replace('_', ' ')} Session
                      </p>
                      {nextCheckIn.notes && (
                        <p className="text-orange-400 text-sm mt-1">
                          Coach has added notes
                        </p>
                      )}
                    </div>
                    <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                      Scheduled
                    </Badge>
                  </div>
                )
              })()}
            </div>
          )}

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white">Current Plan: {currentPlan}</h3>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-white/70">Check-in frequency: {getCheckInFrequency()}</p>
              <div className="text-orange-400 font-medium">
                {getCurrentMonthCheckIns().length}/{getMonthlyCheckInLimit()} used this billing period
              </div>
            </div>
            {userRegistrationDate && (
              <p className="text-white/50 text-sm mt-1">
                Billing resets on the {userRegistrationDate.getDate()}{getOrdinalSuffix(userRegistrationDate.getDate())} of each month
              </p>
            )}
          </div>
        </CardContent>
      </Card>


      {/* Two Column Layout: Upcoming Check-ins and Progress Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Check-in */}
        <Card ref={checkInSectionRef} data-checkin-section className="bg-white/5 border-orange-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-400" />
              Check-in
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Schedule Check-in Button */}
            <div className="mb-4">
              <Button
                onClick={() => {
                  if (getRemainingCheckIns() > 0) {
                    scrollToCheckInSection()
                    // Open the modal after scrolling
                    setTimeout(() => setShowAddCheckIn(true), 500)
                  }
                }}
                disabled={getRemainingCheckIns() === 0}
                className={`w-full ${
                  getRemainingCheckIns() === 0 
                    ? 'bg-gray-500 cursor-not-allowed opacity-50' 
                    : 'bg-orange-500 hover:bg-orange-600'
                }`}
              >
                <Plus className="w-4 h-4 mr-2" />
                {getRemainingCheckIns() === 0 ? 'Monthly Limit Reached' : 'Schedule Check-in'}
              </Button>
              {getRemainingCheckIns() === 0 && (
                <p className="text-red-400 text-sm mt-2 text-center">
                  You've reached your monthly limit of {getMonthlyCheckInLimit()} check-ins
                </p>
              )}
            </div>
            
            {upcomingCheckIns.length > 0 ? (
              <div className="space-y-3">
                {(showAllUpcoming ? upcomingCheckIns : upcomingCheckIns.slice(0, 3)).map((checkIn) => (
                  <div key={checkIn.id} className="p-3 bg-white/5 rounded-lg border border-orange-500/20">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(checkIn.check_in_type)}
                        <div>
                          <p className="text-white font-medium">
                            {new Date(checkIn.scheduled_date).toLocaleDateString('en-US', { timeZone: 'America/Los_Angeles' })} at {new Date(checkIn.scheduled_date).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true,
                              timeZone: 'America/Los_Angeles'
                            })}
                          </p>
                          <p className="text-white/70 text-sm capitalize">
                            {checkIn.check_in_type.replace('_', ' ')} Session
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(checkIn.status)}>
                          {checkIn.status === 'scheduled' ? 'Scheduled' : 
                           checkIn.status === 'cancelled' ? 'Cancelled' : 
                           checkIn.status}
                        </Badge>
                        {checkIn.status === 'scheduled' && (
                          <Button
                            onClick={() => handleCancelCheckIn(checkIn.id)}
                            variant="outline"
                            size="sm"
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {/* Coach's Notes */}
                    {checkIn.notes && (
                      <div className="mt-3 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center">
                            <MessageSquare className="w-3 h-3 text-orange-400" />
                          </div>
                          <span className="text-orange-400 text-sm font-medium">Coach's Notes</span>
                        </div>
                        <p className="text-white/80 text-sm whitespace-pre-wrap">
                          {checkIn.notes}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
                
                {upcomingCheckIns.length > 3 && (
                  <Button
                    onClick={() => setShowAllUpcoming(!showAllUpcoming)}
                    variant="outline"
                    className="w-full border-orange-500/30 text-white hover:bg-orange-500/10"
                  >
                    {showAllUpcoming ? 'Show Less' : `See More (${upcomingCheckIns.length - 3} more)`}
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-white/40 mx-auto mb-3" />
                <p className="text-white/60">No upcoming check-ins scheduled</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Progress Metrics */}
        <Card className="bg-white/5 border-orange-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-400" />
              Progress Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add Progress Button */}
            <div className="mb-4">
              <Button
                onClick={() => setShowAddProgress(true)}
                className="w-full bg-orange-500 hover:bg-orange-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Progress Entry
              </Button>
            </div>
            
            {progressEntries.length > 0 ? (
              <div className="space-y-3">
                {getLatestMetrics().slice(0, 3).map((metric) => (
                  <div 
                    key={metric.metric_name} 
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-orange-500/20 hover:border-orange-400/50 cursor-pointer transition-all duration-300"
                    onClick={() => fetchMetricHistory(metric.metric_name)}
                  >
                    <div>
                      <p className="text-white font-medium">{metric.metric_name}</p>
                      <p className="text-white/70 text-sm">
                        Last: {new Date(metric.recorded_date).toLocaleDateString()}
                      </p>
                      {metric.notes && (
                        <p className="text-white/60 text-xs mt-1">{metric.notes}</p>
                      )}
                    </div>
                    <div className="text-right">
                      {metric.metric_value && (
                        <p className="text-orange-400 font-semibold">
                          {metric.metric_value} {metric.metric_unit}
                        </p>
                      )}
                      <p className="text-white/50 text-xs">Click to view history</p>
                    </div>
                  </div>
                ))}
                
                {getLatestMetrics().length > 3 && (
                  <div className="pt-2">
                    <Button
                      onClick={() => setShowAllMetricsModal(true)}
                      className="w-full border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                      variant="outline"
                    >
                      Show All Metrics ({getLatestMetrics().length})
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 text-white/40 mx-auto mb-3" />
                <p className="text-white/60">No progress metrics recorded yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Past Check-ins Section */}
      {pastCheckIns.length > 0 && (
        <Card className="bg-white/5 border-orange-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-orange-400" />
              Past Check-ins & Notes
            </CardTitle>
            <CardDescription className="text-white/70">
              Review your completed check-ins and add notes for future reference
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pastCheckIns.slice(0, 5).map((checkIn) => (
                <div key={checkIn.id} className="p-4 bg-white/5 rounded-lg border border-orange-500/20">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(checkIn.check_in_type)}
                      <div>
                        <p className="text-white font-medium">
                          {new Date(checkIn.scheduled_date).toLocaleDateString('en-US', { 
                            timeZone: 'America/Los_Angeles',
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })} at {new Date(checkIn.scheduled_date).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                            timeZone: 'America/Los_Angeles'
                          })}
                        </p>
                        <p className="text-white/70 text-sm capitalize">
                          {checkIn.check_in_type.replace('_', ' ')} Session
                        </p>
                        {checkIn.completed_date && (
                          <p className="text-green-400 text-xs">
                            Completed: {new Date(checkIn.completed_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(checkIn.status)}>
                        {checkIn.status === 'completed' ? 'Completed' : 
                         checkIn.status === 'cancelled' ? 'Cancelled' : 
                         'Past Due'}
                      </Badge>
                      <Button
                        onClick={() => openNotesModal(checkIn)}
                        variant="outline"
                        size="sm"
                        className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:border-orange-500/50"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        {checkIn.notes ? 'Edit Notes' : 'Add Notes'}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Existing Notes Display */}
                  {checkIn.notes && (
                    <div className="mt-3 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center">
                          <MessageSquare className="w-3 h-3 text-orange-400" />
                        </div>
                        <span className="text-orange-400 text-sm font-medium">Notes</span>
                      </div>
                      <p className="text-white/80 text-sm whitespace-pre-wrap">
                        {checkIn.notes}
                      </p>
                    </div>
                  )}

                  {/* Feedback Display */}
                  {checkIn.feedback && (
                    <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                          <MessageSquare className="w-3 h-3 text-blue-400" />
                        </div>
                        <span className="text-blue-400 text-sm font-medium">Coach Feedback</span>
                      </div>
                      <p className="text-white/80 text-sm whitespace-pre-wrap">
                        {checkIn.feedback}
                      </p>
                    </div>
                  )}
                </div>
              ))}
              
              {pastCheckIns.length > 5 && (
                <div className="text-center pt-4">
                  <p className="text-white/60 text-sm">
                    Showing 5 of {pastCheckIns.length} past check-ins
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Check-in Modal */}
      {showAddCheckIn && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-black border-orange-500/30 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-white text-xl">Schedule Check-in</CardTitle>
              <CardDescription className="text-white/70">
                Choose a date and time for your coaching session
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Calendar */}
                <div className="space-y-4">
                  {/* Monthly Calendar */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white text-lg font-medium">Select Date</h3>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigateMonth('prev')}
                          className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                        >
                          ←
                        </Button>
                        <span className="text-white font-medium min-w-[120px] text-center">
                          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigateMonth('next')}
                          className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                        >
                          →
                        </Button>
                      </div>
                    </div>

                {/* Calendar Grid */}
                <div className="bg-white/5 rounded-lg p-2 border border-orange-500/30">
                  {/* Day Headers */}
                  <div className="grid grid-cols-7 gap-1 mb-1">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="text-center text-orange-400 text-xs font-medium p-1">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-1">
                    {getDaysArray(currentMonth).map((day, index) => (
                      <div key={index} className="aspect-square">
                        {day ? (
                          <button
                            onClick={() => handleDateSelect(day)}
                            disabled={isPastDate(day, currentMonth)}
                            className={`
                              w-full h-full rounded-md text-xs font-medium transition-colors
                              ${isPastDate(day, currentMonth)
                                ? 'text-white/30 cursor-not-allowed'
                                : isSelected(day, currentMonth)
                                ? 'bg-orange-500 text-white'
                                : isToday(day, currentMonth)
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
                </div>

                {/* Right Column - Time & Notes */}
                <div className="space-y-6">
                  {/* Time Selection */}
                  <div className="space-y-3">
                    <Label htmlFor="time" className="text-white text-lg font-medium">Select Time</Label>
                    
                    {isLoadingHours ? (
                      <div className="flex items-center justify-center p-4">
                        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="ml-2 text-white/70 text-sm">Loading available times...</span>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        
                        {/* Enhanced Available Hours Dropdown */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="available-time" className="text-white text-sm font-medium">Available Times</Label>
                            <div className="text-xs text-white/60">
                              {availableHours.length} slots available
                            </div>
                          </div>
                          
                          <Select
                            value={newCheckIn.scheduled_date ? newCheckIn.scheduled_date.split('T')[1] : ''}
                            onValueChange={(time) => {
                              const date = newCheckIn.scheduled_date ? newCheckIn.scheduled_date.split('T')[0] : selectedDate.toISOString().split('T')[0]
                              // Store the time as the user selected it (local time)
                              setNewCheckIn({ ...newCheckIn, scheduled_date: `${date}T${time}` })
                            }}
                          >
                            <SelectTrigger className="w-full p-4 bg-black/30 border border-orange-500/20 rounded-lg text-white hover:border-orange-500/40 hover:bg-black/40 focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 h-auto">
                              <SelectValue placeholder="Choose your preferred time" className="text-white/70 data-[placeholder]:text-white/70" />
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
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  <div className="space-y-3">
                    <Label htmlFor="notes" className="text-white text-lg font-medium">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={newCheckIn.notes}
                      onChange={(e) => setNewCheckIn({ ...newCheckIn, notes: e.target.value })}
                      placeholder="Add any specific notes or topics you'd like to discuss..."
                      className="bg-white/5 border-orange-500/30 text-white p-3"
                      rows={6}
                    />
                  </div>
                </div>
              </div>

              {/* Selected Date/Time Preview */}
              {(selectedDate || newCheckIn.scheduled_date) && (
                <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/30">
                  <h4 className="text-white font-medium mb-2">Selected Date:</h4>
                  <p className="text-orange-400">
                    {newCheckIn.scheduled_date ? (
                      // Show the selected date and time (parse as local time, no timezone conversion)
                      <>
                        {(() => {
                          const [datePart, timePart] = newCheckIn.scheduled_date.split('T')
                          const [year, month, day] = datePart.split('-')
                          const [hour, minute] = timePart.split(':')
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
                      </>
                    ) : (
                      // Show just the selected date (no time yet)
                      selectedDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        timeZone: 'America/Los_Angeles'
                      }) + ' (select a time)'
                    )}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleAddCheckIn}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 py-3"
                >
                  Schedule Check-in
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddCheckIn(false)}
                  className="flex-1 border-orange-500/30 text-orange-400 hover:bg-orange-500/10 py-3"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Progress Modal */}
      {showAddProgress && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-black border-orange-500/30 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader className="pb-6">
              <CardTitle className="text-white text-xl">Add Progress Entry</CardTitle>
              <CardDescription className="text-white/70">
                Track your fitness progress with detailed metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="metric" className="text-white text-sm font-medium">Metric Name</Label>
                <div className="space-y-2">
                  <Input
                    id="metric"
                    value={newProgress.metric_name}
                    onChange={(e) => setNewProgress({ ...newProgress, metric_name: e.target.value })}
                    placeholder="Type or select a metric..."
                    className="bg-white/5 border-orange-500/30 text-white p-3"
                    list="metric-options"
                  />
                  <datalist id="metric-options">
                    {metricTemplates.map((template) => (
                      <option key={template.id} value={template.metric_name} />
                    ))}
                  </datalist>
                  {metricTemplates.length > 0 && (
                    <div className="text-xs text-white/60">
                      Or select from your saved metrics: {metricTemplates.map(t => t.metric_name).join(', ')}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="value" className="text-white text-sm font-medium">Value</Label>
                  <Input
                    id="value"
                    type="number"
                    step="0.1"
                    value={newProgress.metric_value}
                    onChange={(e) => setNewProgress({ ...newProgress, metric_value: e.target.value })}
                    placeholder="Enter value"
                    className="bg-white/5 border-orange-500/30 text-white p-3 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="unit" className="text-white text-sm font-medium">Unit</Label>
                  <Input
                    id="unit"
                    value={newProgress.metric_unit}
                    onChange={(e) => setNewProgress({ ...newProgress, metric_unit: e.target.value })}
                    placeholder="e.g., lbs, kg, %, reps, miles, minutes"
                    className="bg-white/5 border-orange-500/30 text-white p-3"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="progress-notes" className="text-white text-sm font-medium">Notes (Optional)</Label>
                <Textarea
                  id="progress-notes"
                  value={newProgress.notes}
                  onChange={(e) => setNewProgress({ ...newProgress, notes: e.target.value })}
                  placeholder="Add any additional notes about your progress..."
                  className="bg-white/5 border-orange-500/30 text-white p-3"
                  rows={4}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleAddProgress}
                  disabled={isAddingProgress}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAddingProgress ? 'Adding...' : 'Add Progress Entry'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddProgress(false)}
                  disabled={isAddingProgress}
                  className="flex-1 border-orange-500/30 text-orange-400 hover:bg-orange-500/10 py-3 disabled:opacity-50"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Metric History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-black border-orange-500/30 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-400" />
                {selectedMetric} History
              </CardTitle>
              <CardDescription className="text-white/70">
                Track your progress over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              {metricHistory.length > 0 ? (
                <div className="space-y-3">
                  {metricHistory.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-orange-500/20">
                      <div>
                        <p className="text-white font-medium">
                          {new Date(entry.recorded_date).toLocaleDateString()}
                        </p>
                        {entry.notes && (
                          <p className="text-white/60 text-sm mt-1">{entry.notes}</p>
                        )}
                      </div>
                      <div className="text-right">
                        {entry.metric_value && (
                          <p className="text-orange-400 font-semibold">
                            {entry.metric_value} {entry.metric_unit}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 text-white/40 mx-auto mb-3" />
                  <p className="text-white/60">No history found for this metric</p>
                </div>
              )}
              
              <div className="flex justify-end mt-6">
                <Button
                  onClick={() => setShowHistoryModal(false)}
                  className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                  variant="outline"
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Show All Metrics Modal */}
      {showAllMetricsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-black border-orange-500/30 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-400" />
                All Progress Metrics
              </CardTitle>
              <CardDescription className="text-white/70">
                Click any metric to view its history
              </CardDescription>
            </CardHeader>
            <CardContent>
              {getLatestMetrics().length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getLatestMetrics().map((metric) => (
                    <div 
                      key={metric.metric_name} 
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-orange-500/20 hover:border-orange-400/50 cursor-pointer transition-all duration-300"
                      onClick={() => {
                        setShowAllMetricsModal(false)
                        fetchMetricHistory(metric.metric_name)
                      }}
                    >
                      <div>
                        <p className="text-white font-medium">{metric.metric_name}</p>
                        <p className="text-white/70 text-sm">
                          Last: {new Date(metric.recorded_date).toLocaleDateString()}
                        </p>
                        {metric.notes && (
                          <p className="text-white/60 text-xs mt-1">{metric.notes}</p>
                        )}
                      </div>
                      <div className="text-right">
                        {metric.metric_value && (
                          <p className="text-orange-400 font-semibold">
                            {metric.metric_value} {metric.metric_unit}
                          </p>
                        )}
                        <p className="text-white/50 text-xs">Click for history</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 text-white/40 mx-auto mb-3" />
                  <p className="text-white/60">No progress metrics recorded yet</p>
                </div>
              )}
              
              <div className="flex justify-end mt-6">
                <Button
                  onClick={() => setShowAllMetricsModal(false)}
                  className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                  variant="outline"
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Cancel Check-in Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-orange-500/30 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Cancel Check-in</h3>
                <p className="text-white/70 text-sm">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-white/80 mb-6">
              Are you sure you want to cancel this check-in? The time slot will become available for others to book.
            </p>
            
            <div className="flex gap-3 justify-end">
              <Button
                onClick={() => {
                  setShowCancelModal(false)
                  setCheckInToCancel(null)
                }}
                variant="outline"
                className="border-gray-500/30 text-gray-400 hover:bg-gray-500/10"
              >
                Keep Check-in
              </Button>
              <Button
                onClick={confirmCancelCheckIn}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Yes, Cancel It
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Notes Modal */}
      {showNotesModal && selectedCheckInForNotes && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-black border-orange-500/30 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-orange-400" />
                {selectedCheckInForNotes.notes ? 'Edit Notes' : 'Add Notes'}
              </CardTitle>
              <CardDescription className="text-white/70">
                Add notes for your check-in on {new Date(selectedCheckInForNotes.scheduled_date).toLocaleDateString('en-US', { 
                  timeZone: 'America/Los_Angeles',
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="notes-text" className="text-white text-sm font-medium">Notes</Label>
                <Textarea
                  id="notes-text"
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  placeholder="Add your notes about this check-in session..."
                  className="bg-white/5 border-orange-500/30 text-white p-3 min-h-[200px]"
                  rows={8}
                />
                <p className="text-white/60 text-xs">
                  These notes will be saved and can be viewed by both you and your coach.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleUpdateNotes}
                  disabled={isUpdatingNotes}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdatingNotes ? 'Saving...' : 'Save Notes'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowNotesModal(false)
                    setSelectedCheckInForNotes(null)
                    setNotesText('')
                  }}
                  disabled={isUpdatingNotes}
                  className="flex-1 border-orange-500/30 text-orange-400 hover:bg-orange-500/10 py-3 disabled:opacity-50"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
