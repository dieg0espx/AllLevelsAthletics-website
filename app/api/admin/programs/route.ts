import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 Admin: Fetching programs...')
    
    // For now, return mock data since we don't have a programs table yet
    // TODO: Replace with actual database query when programs table is created
    const mockPrograms = [
      {
        id: '1',
        name: 'Beginner Fitness Program',
        description: 'A comprehensive 8-week program designed for fitness beginners. Focus on building strength, endurance, and proper form.',
        price: 299,
        duration: 8,
        enrolledClients: 12,
        status: 'active',
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-02-26T00:00:00Z'
      },
      {
        id: '2',
        name: 'Advanced Strength Training',
        description: 'Intensive 12-week program for experienced athletes. Advanced techniques, periodization, and performance optimization.',
        price: 499,
        duration: 12,
        enrolledClients: 8,
        status: 'active',
        startDate: '2024-01-15T00:00:00Z',
        endDate: '2024-04-08T00:00:00Z'
      },
      {
        id: '3',
        name: 'Weight Loss Transformation',
        description: '16-week program combining nutrition guidance, cardio, and strength training for sustainable weight loss.',
        price: 399,
        duration: 16,
        enrolledClients: 15,
        status: 'active',
        startDate: '2024-01-08T00:00:00Z',
        endDate: '2024-04-29T00:00:00Z'
      },
      {
        id: '4',
        name: 'Mobility & Flexibility',
        description: '6-week program focused on improving range of motion, reducing stiffness, and preventing injuries.',
        price: 199,
        duration: 6,
        enrolledClients: 6,
        status: 'inactive',
        startDate: '2023-12-01T00:00:00Z',
        endDate: '2024-01-12T00:00:00Z'
      }
    ]

    console.log('✅ Admin: Fetched programs:', mockPrograms.length)

    return NextResponse.json({ 
      programs: mockPrograms,
      success: true 
    })

  } catch (error) {
    console.error('Error fetching admin programs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, price, duration, startDate, endDate } = body
    
    console.log('🔄 Admin: Creating new program...', body)
    
    // TODO: Implement actual program creation when programs table is created
    // For now, return success with mock data
    const newProgram = {
      id: Date.now().toString(),
      name,
      description,
      price,
      duration,
      enrolledClients: 0,
      status: 'active',
      startDate,
      endDate
    }

    console.log('✅ Admin: Created program:', newProgram.id)

    return NextResponse.json({ 
      program: newProgram,
      success: true 
    })

  } catch (error) {
    console.error('Error creating program:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

