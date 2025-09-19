import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, planType } = body
    
    console.log('Schedule check-ins POST request:', { userId, planType })
    
    // For now, just return success - this can be expanded later
    return NextResponse.json({ 
      success: true,
      message: 'Check-ins scheduled successfully',
      userId,
      planType
    })
  } catch (error) {
    console.error('Error in schedule POST API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    
    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service role not configured' }, { status: 500 })
    }
    
    // Get all check-ins for the specified date (all users)
    const { data: existingCheckIns, error } = await supabaseAdmin
      .from('coaching_check_ins')
      .select('scheduled_date')
      .gte('scheduled_date', `${date}T00:00:00.000Z`)
      .lt('scheduled_date', `${date}T23:59:59.999Z`)
      .eq('status', 'scheduled')

    if (error) {
      console.error('Error fetching existing check-ins:', error)
      return NextResponse.json({ error: 'Failed to fetch schedule' }, { status: 500 })
    }

    // Generate all possible time slots from 8:00 AM to 6:00 PM (every 30 minutes)
    const allHours = []
    for (let hour = 8; hour <= 17; hour++) {
      allHours.push(`${hour.toString().padStart(2, '0')}:00`)
      allHours.push(`${hour.toString().padStart(2, '0')}:30`)
    }
    // Add 6:00 PM
    allHours.push('18:00')

    // Get booked time slots
    const bookedHours = new Set()
    existingCheckIns?.forEach(checkIn => {
      const scheduledDate = new Date(checkIn.scheduled_date)
      // Convert to San Diego timezone for proper hour extraction
      const sanDiegoTime = scheduledDate.toLocaleString('en-US', {
        timeZone: 'America/Los_Angeles',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      })
      const [hour, minutes] = sanDiegoTime.split(':')
      bookedHours.add(`${hour}:${minutes}`)
    })

    // Filter out booked hours
    const availableHours = allHours.filter(hour => !bookedHours.has(hour))

    console.log('Schedule API Debug:', {
      date,
      existingCheckIns: existingCheckIns?.length || 0,
      bookedHours: Array.from(bookedHours),
      availableHours: availableHours.length
    })

    return NextResponse.json({ 
      availableHours,
      bookedHours: Array.from(bookedHours),
      date 
    })
  } catch (error) {
    console.error('Error in schedule API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}