"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  Calendar,
  MessageSquare
} from "lucide-react"

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

interface CheckInsSectionProps {
  checkIns: CheckIn[]
  checkInsLoading: boolean
  onRefresh: () => void
}

export function CheckInsSection({ checkIns, checkInsLoading, onRefresh }: CheckInsSectionProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'day'>('month')
  const [selectedCheckIn, setSelectedCheckIn] = useState<CheckIn | null>(null)
  const [showCheckInModal, setShowCheckInModal] = useState(false)
  const [checkInNotes, setCheckInNotes] = useState('')

  // Calendar helper functions
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

  const handleSaveNotes = async () => {
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
        onRefresh()
      } else {
        console.error('Failed to save notes')
        alert('Failed to save notes. Please try again.')
      }
    } catch (error) {
      console.error('Error saving notes:', error)
      alert('An error occurred while saving notes.')
    }
  }

  if (checkInsLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Check-ins Calendar</h2>
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
          <h3 className="text-lg font-semibold text-white">
            {calendarView === 'month' 
              ? selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
              : calendarView === 'week' 
              ? `Week of ${getWeekDays(selectedDate)[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`
              : selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
            }
          </h3>
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
                  onClick={handleSaveNotes}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Save Notes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

