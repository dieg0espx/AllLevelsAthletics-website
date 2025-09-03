import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  console.log('🧪 TEST LOGGING: This should appear in your terminal!')
  console.log('🧪 TEST LOGGING: If you see this, logging is working!')
  console.log('🧪 TEST LOGGING: Check your terminal where npm run dev is running!')
  
  return NextResponse.json({ 
    success: true, 
    message: 'Test logging endpoint working! Check your terminal for logs.' 
  })
}
