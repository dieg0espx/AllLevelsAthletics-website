import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * POST /api/setup-elite-coupons-table
 * 
 * Creates the elite_coupons table in the database
 * Run this once to set up the table structure
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Setting up elite_coupons table...')

    // Create the elite_coupons table
    const { data, error } = await supabaseAdmin.rpc('create_elite_coupons_table')

    if (error) {
      console.error('❌ Error creating elite_coupons table:', error)
      return NextResponse.json(
        { error: 'Failed to create table', details: error.message },
        { status: 500 }
      )
    }

    console.log('✅ elite_coupons table created successfully')

    return NextResponse.json({
      success: true,
      message: 'elite_coupons table created successfully'
    })

  } catch (error) {
    console.error('❌ Error setting up elite_coupons table:', error)
    return NextResponse.json(
      { error: 'Failed to setup table' },
      { status: 500 }
    )
  }
}

/**
 * Alternative method using direct SQL
 */
export async function GET(request: NextRequest) {
  try {
    console.log('🔧 Setting up elite_coupons table with direct SQL...')

    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS elite_coupons (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        customer_email TEXT NOT NULL,
        coupon_code TEXT UNIQUE NOT NULL,
        discount_percentage INTEGER NOT NULL DEFAULT 100,
        product_restriction TEXT NOT NULL DEFAULT 'knot-roller',
        is_used BOOLEAN NOT NULL DEFAULT FALSE,
        used_at TIMESTAMP WITH TIME ZONE,
        order_id TEXT,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        CONSTRAINT check_discount_percentage CHECK (discount_percentage >= 0 AND discount_percentage <= 100)
      );

      -- Create indexes for better performance
      CREATE INDEX IF NOT EXISTS idx_elite_coupons_user_id ON elite_coupons(user_id);
      CREATE INDEX IF NOT EXISTS idx_elite_coupons_coupon_code ON elite_coupons(coupon_code);
      CREATE INDEX IF NOT EXISTS idx_elite_coupons_customer_email ON elite_coupons(customer_email);
      CREATE INDEX IF NOT EXISTS idx_elite_coupons_is_used ON elite_coupons(is_used);
      CREATE INDEX IF NOT EXISTS idx_elite_coupons_expires_at ON elite_coupons(expires_at);
    `

    const { data, error } = await supabaseAdmin.rpc('exec_sql', { sql: createTableSQL })

    if (error) {
      console.error('❌ Error creating elite_coupons table:', error)
      return NextResponse.json(
        { error: 'Failed to create table', details: error.message },
        { status: 500 }
      )
    }

    console.log('✅ elite_coupons table created successfully')

    return NextResponse.json({
      success: true,
      message: 'elite_coupons table created successfully'
    })

  } catch (error) {
    console.error('❌ Error setting up elite_coupons table:', error)
    return NextResponse.json(
      { error: 'Failed to setup table' },
      { status: 500 }
    )
  }
}
