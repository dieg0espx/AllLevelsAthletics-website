import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 Admin: Fetching programs...')
    
    // Fetch all programs from the database
    const { data: programs, error: programsError } = await supabaseAdmin
      .from('programs')
      .select('*')
      .order('created_at', { ascending: false })

    if (programsError) {
      console.error('❌ Error fetching programs:', programsError)
      
      // If table doesn't exist, return empty array
      if (programsError.code === '42P01' || programsError.message?.includes('does not exist')) {
        console.log('⚠️ programs table does not exist, returning empty array')
        return NextResponse.json({
          success: true,
          programs: [],
          message: 'Programs table does not exist - please run database setup'
        })
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch programs', details: programsError.message },
        { status: 500 }
      )
    }

    console.log('✅ Admin: Fetched programs:', programs?.length || 0)

    // Get enrollment counts and client progress for each program
    const programsWithStats = await Promise.all((programs || []).map(async (program) => {
      // For Tension Release Program, match by program_id = 'tension-release-program'
      // For other programs, try to match by name or id
      const programSlug = program.name === 'Tension Release Program' 
        ? 'tension-release-program' 
        : program.id
      
      // Count enrollments from user_programs table (matching by program_id slug)
      const { data: enrolledUsers, count: enrollmentCount } = await supabaseAdmin
        .from('user_programs')
        .select('*, user_id', { count: 'exact' })
        .eq('program_id', programSlug)

      // Also try matching by UUID if the slug didn't work
      let finalCount = enrollmentCount || 0
      let finalUsers = enrolledUsers || []
      
      if (finalCount === 0) {
        const { data: uuidUsers, count: uuidCount } = await supabaseAdmin
          .from('user_programs')
          .select('*, user_id', { count: 'exact' })
          .eq('program_id', program.id)
        
        finalCount = uuidCount || 0
        finalUsers = uuidUsers || []
      }

      // Calculate average progress across all enrolled users
      const avgProgress = finalUsers.length > 0
        ? finalUsers.reduce((sum, user) => sum + (user.progress || 0), 0) / finalUsers.length
        : 0

      // Calculate total revenue (enrollment count * price)
      const totalRevenue = finalCount * (program.price || 0)

      return {
        id: program.id,
        name: program.name,
        description: program.description,
        price: program.price,
        duration: program.duration,
        category: program.category,
        level: program.level,
        isActive: program.is_active,
        enrollmentCount: finalCount,
        totalRevenue: totalRevenue,
        averageProgress: Math.round(avgProgress),
        createdAt: program.created_at,
        updatedAt: program.updated_at
      }
    }))

    return NextResponse.json({ 
      programs: programsWithStats,
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
    const { name, description, price, duration, category, level, isActive } = body
    
    console.log('🔄 Admin: Creating new program...', body)

    if (!name || !description) {
      return NextResponse.json(
        { error: 'Name and description are required' },
        { status: 400 }
      )
    }
    
    // Create new program in database
    const { data: newProgram, error: insertError } = await supabaseAdmin
      .from('programs')
      .insert([{
        name,
        description,
        price: price || 0,
        duration: duration || '',
        category: category || '',
        level: level || 'beginner',
        is_active: isActive !== undefined ? isActive : true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (insertError) {
      console.error('❌ Error creating program:', insertError)
      return NextResponse.json(
        { error: 'Failed to create program', details: insertError.message },
        { status: 500 }
      )
    }

    console.log('✅ Admin: Created program:', newProgram.id)

    return NextResponse.json({ 
      program: {
        id: newProgram.id,
        name: newProgram.name,
        description: newProgram.description,
        price: newProgram.price,
        duration: newProgram.duration,
        category: newProgram.category,
        level: newProgram.level,
        isActive: newProgram.is_active,
        enrollmentCount: 0,
        totalRevenue: 0,
        createdAt: newProgram.created_at,
        updatedAt: newProgram.updated_at
      },
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

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { programId, ...updates } = body
    
    console.log('🔄 Admin: Updating program...', programId, updates)

    if (!programId) {
      return NextResponse.json(
        { error: 'Program ID is required' },
        { status: 400 }
      )
    }

    // Prepare update data (map camelCase to snake_case)
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (updates.name !== undefined) updateData.name = updates.name
    if (updates.description !== undefined) updateData.description = updates.description
    if (updates.price !== undefined) updateData.price = updates.price
    if (updates.duration !== undefined) updateData.duration = updates.duration
    if (updates.category !== undefined) updateData.category = updates.category
    if (updates.level !== undefined) updateData.level = updates.level
    if (updates.isActive !== undefined) updateData.is_active = updates.isActive

    console.log('📦 Update data:', updateData)

    // Update the program
    const { data: updatedProgram, error: updateError } = await supabaseAdmin
      .from('programs')
      .update(updateData)
      .eq('id', programId)
      .select()
      .single()

    if (updateError) {
      console.error('❌ Error updating program:', updateError)
      return NextResponse.json(
        { error: `Failed to update program: ${updateError.message}` },
        { status: 500 }
      )
    }

    console.log('✅ Program updated successfully')

    return NextResponse.json({ 
      program: {
        id: updatedProgram.id,
        name: updatedProgram.name,
        description: updatedProgram.description,
        price: updatedProgram.price,
        duration: updatedProgram.duration,
        category: updatedProgram.category,
        level: updatedProgram.level,
        isActive: updatedProgram.is_active,
        createdAt: updatedProgram.created_at,
        updatedAt: updatedProgram.updated_at
      },
      success: true,
      message: 'Program updated successfully'
    })

  } catch (error) {
    console.error('Error updating program:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { programId } = body
    
    console.log('🔄 Admin: Deleting program...', programId)

    if (!programId) {
      return NextResponse.json(
        { error: 'Program ID is required' },
        { status: 400 }
      )
    }

    // Delete the program
    const { error: deleteError } = await supabaseAdmin
      .from('programs')
      .delete()
      .eq('id', programId)

    if (deleteError) {
      console.error('❌ Error deleting program:', deleteError)
      return NextResponse.json(
        { error: `Failed to delete program: ${deleteError.message}` },
        { status: 500 }
      )
    }

    console.log('✅ Program deleted successfully')

    return NextResponse.json({ 
      success: true,
      message: 'Program deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting program:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
