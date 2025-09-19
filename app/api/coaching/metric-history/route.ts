import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const metricName = searchParams.get('metricName')
    
    if (!userId || !metricName) {
      return NextResponse.json({ error: 'User ID and metric name are required' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service role not configured' }, { status: 500 })
    }
    
    // Get metric history for specific metric name
    const { data: history, error } = await supabaseAdmin
      .from('coaching_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('metric_name', metricName)
      .order('recorded_date', { ascending: false })

    if (error) {
      console.error('Error fetching metric history:', error)
      return NextResponse.json({ error: 'Failed to fetch metric history' }, { status: 500 })
    }

    return NextResponse.json({ history })
  } catch (error) {
    console.error('Error in metric history API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
