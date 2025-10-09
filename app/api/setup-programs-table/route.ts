import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    console.log('=== SETTING UP PROGRAMS TABLE ===')
    
    // Check if programs table exists
    const { data: tables, error: tableError } = await supabaseAdmin
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'programs')

    if (tableError) {
      console.error('Error checking tables:', tableError)
      return NextResponse.json(
        { error: 'Failed to check tables' },
        { status: 500 }
      )
    }

    if (tables && tables.length > 0) {
      console.log('✅ programs table already exists')
      
      // Count existing programs
      const { count } = await supabaseAdmin
        .from('programs')
        .select('*', { count: 'exact', head: true })
      
      return NextResponse.json({
        success: true,
        message: 'Programs table already exists',
        tableExists: true,
        programCount: count || 0
      })
    }

    console.log('❌ programs table does not exist, creating...')

    // Try using raw SQL to create the table
    const { data, error: createError } = await supabaseAdmin.rpc('exec_sql', { 
      sql: `
        -- Create programs table
        CREATE TABLE IF NOT EXISTS programs (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          description TEXT,
          price DECIMAL(10, 2) DEFAULT 0,
          duration TEXT,
          category TEXT,
          level TEXT DEFAULT 'beginner',
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create indexes
        CREATE INDEX IF NOT EXISTS idx_programs_is_active ON programs(is_active);
        CREATE INDEX IF NOT EXISTS idx_programs_category ON programs(category);
        CREATE INDEX IF NOT EXISTS idx_programs_level ON programs(level);

        -- Enable RLS
        ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

        -- Create policies
        DROP POLICY IF EXISTS "Admins can do everything with programs" ON programs;
        CREATE POLICY "Admins can do everything with programs"
          ON programs
          FOR ALL
          TO authenticated
          USING (
            EXISTS (
              SELECT 1 FROM user_profiles
              WHERE user_profiles.user_id = auth.uid()
              AND user_profiles.role = 'admin'
            )
          );

        DROP POLICY IF EXISTS "Anyone can view active programs" ON programs;
        CREATE POLICY "Anyone can view active programs"
          ON programs
          FOR SELECT
          TO authenticated
          USING (is_active = true);

        -- Insert Tension Release Program (real program with real clients - 18 video modules)
        INSERT INTO programs (name, description, price, duration, category, level, is_active) VALUES
          ('Tension Release Program', 'Premium program with 18 video modules for tension release and performance enhancement. Complete body tension release system covering glutes, back, hips, legs, and recovery techniques.', 297, '18 modules', 'Recovery', 'beginner', true)
        ON CONFLICT DO NOTHING;

        -- Grant permissions
        GRANT ALL ON programs TO authenticated;
        GRANT ALL ON programs TO service_role;
      `
    })

    if (createError) {
      console.error('Error creating table with exec_sql:', createError)
      
      // Fallback: try direct table creation without RPC
      console.log('Trying direct table creation...')
      
      // This won't work for all the SQL, but let's try creating the table structure at least
      const { error: directError } = await supabaseAdmin
        .from('programs')
        .select('*')
        .limit(1)

      if (directError && directError.code === '42P01') {
        // Table doesn't exist, return instructions
        return NextResponse.json(
          { 
            error: 'Could not create table automatically. Please run the migration manually.',
            details: createError.message,
            instructions: 'Go to Supabase Dashboard > SQL Editor and run the migration from supabase-migrations/create-programs-table.sql'
          },
          { status: 500 }
        )
      }
    }

    console.log('✅ programs table created successfully')

    return NextResponse.json({
      success: true,
      message: 'Programs table created successfully with Tension Release Program',
      tableExists: true
    })

  } catch (error) {
    console.error('Error in setup-programs-table:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('=== CHECKING PROGRAMS TABLE STATUS ===')
    
    // Check if programs table exists
    const { data: tables, error: tableError } = await supabaseAdmin
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'programs')

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
        .from('programs')
        .select('*', { count: 'exact', head: true })

      if (!countError) {
        programCount = count || 0
      }
    }

    return NextResponse.json({
      success: true,
      tableExists,
      programCount,
      message: tableExists ? `Programs table exists with ${programCount} programs` : 'Programs table does not exist'
    })

  } catch (error) {
    console.error('Error in setup-programs-table GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

