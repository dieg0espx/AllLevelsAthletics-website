import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireUser } from '@/lib/api-auth'

export async function GET(request: NextRequest) {
  const auth = await requireUser(request)
  if (auth.error) return auth.error
  const userId = auth.user.id

  try {
    const { searchParams } = new URL(request.url)
    const metricName = searchParams.get('metricName')

    if (!metricName) {
      return NextResponse.json({ error: 'Metric name is required' }, { status: 400 })
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
