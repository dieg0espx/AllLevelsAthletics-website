import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: 'Webhook endpoint is accessible',
    timestamp: new Date().toISOString(),
    endpoint: '/api/stripe-webhook'
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')
    
    console.log('🔔 TEST WEBHOOK RECEIVED')
    console.log('Body length:', body.length)
    console.log('Signature present:', !!signature)
    console.log('Body preview:', body.substring(0, 200))
    
    return NextResponse.json({ 
      received: true,
      bodyLength: body.length,
      hasSignature: !!signature,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Test webhook error:', error)
    return NextResponse.json({ 
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
