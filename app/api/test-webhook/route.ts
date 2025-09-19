import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: 'Webhook endpoint is accessible',
    timestamp: new Date().toISOString(),
    url: request.url
  })
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headers = Object.fromEntries(request.headers.entries())
  
  console.log('=== TEST WEBHOOK CALLED ===')
  console.log('Headers:', headers)
  console.log('Body:', body)
  
  return NextResponse.json({ 
    message: 'Test webhook received',
    timestamp: new Date().toISOString(),
    headers: headers,
    bodyLength: body.length
  })
}
