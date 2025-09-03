import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing Supabase connection...')
    
    // Test 1: Basic connection
    console.log('🔌 Testing basic connection...')
    const { data: testData, error: testError } = await supabase
      .from('orders')
      .select('count')
      .limit(1)
    
    if (testError) {
      console.error('❌ Supabase connection test failed:', testError)
      return NextResponse.json({
        success: false,
        error: 'Supabase connection failed',
        details: testError.message,
        code: testError.code
      }, { status: 500 })
    }
    
    console.log('✅ Supabase connection successful')
    
    // Test 2: Check if tables exist
    console.log('📋 Testing table access...')
    const { data: ordersCount, error: ordersError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
    
    if (ordersError) {
      console.error('❌ Orders table access failed:', ordersError)
      return NextResponse.json({
        success: false,
        error: 'Orders table access failed',
        details: ordersError.message,
        code: ordersError.code
      }, { status: 500 })
    }
    
    console.log('✅ Orders table accessible')
    
    // Test 3: Check order_items table
    const { data: itemsCount, error: itemsError } = await supabase
      .from('order_items')
      .select('*', { count: 'exact', head: true })
    
    if (itemsError) {
      console.error('❌ Order items table access failed:', itemsError)
      return NextResponse.json({
        success: false,
        error: 'Order items table access failed',
        details: itemsError.message,
        code: itemsError.code
      }, { status: 500 })
    }
    
    console.log('✅ Order items table accessible')
    
    return NextResponse.json({
      success: true,
      message: 'All Supabase tests passed',
      ordersCount: ordersCount?.length || 0,
      itemsCount: itemsCount?.length || 0
    })
    
  } catch (error) {
    console.error('💥 CRITICAL ERROR in test-supabase API:', error)
    
    if (error instanceof Error) {
      console.error('💥 Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      })
    }
    
    return NextResponse.json({
      success: false,
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
