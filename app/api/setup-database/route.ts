import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    console.log('=== SETTING UP DATABASE ===')
    
    // Check if user_programs table exists
    const { data: tables, error: tableError } = await supabaseAdmin
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'user_programs')

    if (tableError) {
      console.error('Error checking tables:', tableError)
      return NextResponse.json(
        { error: 'Failed to check tables' },
        { status: 500 }
      )
    }

    if (tables && tables.length > 0) {
      console.log('✅ user_programs table already exists')
      return NextResponse.json({
        success: true,
        message: 'Table already exists',
        tableExists: true
      })
    }

    console.log('❌ user_programs table does not exist, creating...')

    // Create the table
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS user_programs (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        program_id VARCHAR(255) NOT NULL,
        program_name VARCHAR(500) NOT NULL,
        program_type VARCHAR(100) DEFAULT 'premium',
        status VARCHAR(50) DEFAULT 'active',
        progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
        start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        end_date TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_user_programs_user_id ON user_programs(user_id);
      CREATE INDEX IF NOT EXISTS idx_user_programs_program_id ON user_programs(program_id);
      CREATE INDEX IF NOT EXISTS idx_user_programs_status ON user_programs(status);

      CREATE UNIQUE INDEX IF NOT EXISTS idx_user_programs_unique_user_program 
      ON user_programs(user_id, program_id);

      ALTER TABLE user_programs ENABLE ROW LEVEL SECURITY;

      CREATE POLICY IF NOT EXISTS "Users can view their own programs" ON user_programs
        FOR SELECT USING (auth.uid() = user_id);

      CREATE POLICY IF NOT EXISTS "Users can insert their own programs" ON user_programs
        FOR INSERT WITH CHECK (auth.uid() = user_id);

      CREATE POLICY IF NOT EXISTS "Users can update their own programs" ON user_programs
        FOR UPDATE USING (auth.uid() = user_id);

      GRANT ALL ON user_programs TO authenticated;
      GRANT ALL ON user_programs TO service_role;
    `

    const { error: createError } = await supabaseAdmin.rpc('exec_sql', {
      sql: createTableSQL
    })

    if (createError) {
      console.error('Error creating table:', createError)
      return NextResponse.json(
        { error: 'Failed to create table', details: createError.message },
        { status: 500 }
      )
    }

    console.log('✅ user_programs table created successfully')

    return NextResponse.json({
      success: true,
      message: 'Table created successfully',
      tableExists: true
    })

  } catch (error) {
    console.error('Error in setup-database:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('=== CHECKING DATABASE STATUS ===')
    
    // Check if user_programs table exists
    const { data: tables, error: tableError } = await supabaseAdmin
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'user_programs')

    if (tableError) {
      console.error('Error checking tables:', tableError)
      return NextResponse.json(
        { error: 'Failed to check tables' },
        { status: 500 }
      )
    }

    const tableExists = tables && tables.length > 0

    // If table exists, check if there are any programs
    let programCount = 0
    if (tableExists) {
      const { count, error: countError } = await supabaseAdmin
        .from('user_programs')
        .select('*', { count: 'exact', head: true })

      if (!countError) {
        programCount = count || 0
      }
    }

    return NextResponse.json({
      success: true,
      tableExists,
      programCount,
      message: tableExists ? 'Table exists' : 'Table does not exist'
    })

  } catch (error) {
    console.error('Error in setup-database GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
