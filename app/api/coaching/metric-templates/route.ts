import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service role not configured' }, { status: 500 })
    }
    
    // Get user's metric templates
    const { data: templates, error } = await supabaseAdmin
      .from('metric_templates')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching metric templates:', error)
      return NextResponse.json({ error: 'Failed to fetch metric templates' }, { status: 500 })
    }

    return NextResponse.json({ templates })
  } catch (error) {
    console.error('Error in metric templates API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, metricName, defaultUnit } = body
    
    if (!userId || !metricName) {
      return NextResponse.json({ error: 'User ID and metric name are required' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service role not configured' }, { status: 500 })
    }
    
    // Create or update metric template
    const { data: template, error } = await supabaseAdmin
      .from('metric_templates')
      .upsert({
        user_id: userId,
        metric_name: metricName,
        default_unit: defaultUnit || null
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating metric template:', error)
      return NextResponse.json({ error: 'Failed to create metric template' }, { status: 500 })
    }

    return NextResponse.json({ template })
  } catch (error) {
    console.error('Error in metric templates API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const templateId = searchParams.get('templateId')
    
    if (!templateId) {
      return NextResponse.json({ error: 'Template ID is required' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service role not configured' }, { status: 500 })
    }
    
    // Delete metric template
    const { error } = await supabaseAdmin
      .from('metric_templates')
      .delete()
      .eq('id', templateId)

    if (error) {
      console.error('Error deleting metric template:', error)
      return NextResponse.json({ error: 'Failed to delete metric template' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in metric templates API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
