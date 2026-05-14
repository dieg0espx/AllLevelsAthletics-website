import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireUser } from '@/lib/api-auth'

export async function GET(request: NextRequest) {
  const auth = await requireUser(request)
  if (auth.error) return auth.error
  const userId = auth.user.id

  try {
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
  const auth = await requireUser(request)
  if (auth.error) return auth.error
  const userId = auth.user.id

  try {
    const body = await request.json()
    const { metricName, defaultUnit } = body

    if (!metricName) {
      return NextResponse.json({ error: 'Metric name is required' }, { status: 400 })
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
  const auth = await requireUser(request)
  if (auth.error) return auth.error
  const userId = auth.user.id

  try {
    const { searchParams } = new URL(request.url)
    const templateId = searchParams.get('templateId')

    if (!templateId) {
      return NextResponse.json({ error: 'Template ID is required' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service role not configured' }, { status: 500 })
    }

    // Delete metric template (scoped to the authenticated user)
    const { error } = await supabaseAdmin
      .from('metric_templates')
      .delete()
      .eq('id', templateId)
      .eq('user_id', userId)

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
