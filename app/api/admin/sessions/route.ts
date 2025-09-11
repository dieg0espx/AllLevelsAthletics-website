import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 Admin: Fetching one-on-one sessions...')
    
    // For now, return mock data since we don't have a sessions table yet
    // TODO: Replace with actual database query when sessions table is created
    const mockSessions = [
      {
        id: '1',
        clientId: 'client-1',
        clientName: 'John Doe',
        clientEmail: 'john.doe@example.com',
        sessionDate: '2024-01-15T10:00:00Z',
        duration: 60,
        status: 'completed',
        notes: 'Great session focusing on mobility and flexibility. Client showed significant improvement.',
        price: 150
      },
      {
        id: '2',
        clientId: 'client-2',
        clientName: 'Jane Smith',
        clientEmail: 'jane.smith@example.com',
        sessionDate: '2024-01-16T14:00:00Z',
        duration: 45,
        status: 'scheduled',
        notes: 'Upcoming session to work on strength training fundamentals.',
        price: 120
      },
      {
        id: '3',
        clientId: 'client-3',
        clientName: 'Mike Johnson',
        clientEmail: 'mike.johnson@example.com',
        sessionDate: '2024-01-14T16:00:00Z',
        duration: 90,
        status: 'completed',
        notes: 'Intensive session covering advanced techniques. Client ready for next level.',
        price: 200
      }
    ]

    console.log('✅ Admin: Fetched sessions:', mockSessions.length)

    return NextResponse.json({ 
      sessions: mockSessions,
      success: true 
    })

  } catch (error) {
    console.error('Error fetching admin sessions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { clientId, sessionDate, duration, notes, price } = body
    
    console.log('🔄 Admin: Creating new session...', body)
    
    // TODO: Implement actual session creation when sessions table is created
    // For now, return success with mock data
    const newSession = {
      id: Date.now().toString(),
      clientId,
      clientName: 'New Client',
      clientEmail: 'client@example.com',
      sessionDate,
      duration,
      status: 'scheduled',
      notes,
      price
    }

    console.log('✅ Admin: Created session:', newSession.id)

    return NextResponse.json({ 
      session: newSession,
      success: true 
    })

  } catch (error) {
    console.error('Error creating session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

