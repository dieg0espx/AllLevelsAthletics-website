import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/resend'

export async function GET() {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'RESEND_API_KEY is not configured' },
        { status: 500 }
      )
    }

    const to = process.env.CONTACT_EMAIL || 'aletxa.pascual@gmail.com'

    const result = await sendEmail({
      to,
      subject: 'Test Email - All Levels Athletics',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #f97316;">All Levels Athletics</h1>
          <p>This is a test email sent via Resend.</p>
          <p>If you're seeing this, your email configuration is working correctly!</p>
          <p style="color: #666; font-size: 12px; margin-top: 40px;">
            Sent at: ${new Date().toISOString()}
          </p>
        </div>
      `,
      text: 'This is a test email from All Levels Athletics sent via Resend.',
    })

    return NextResponse.json({
      success: true,
      message: `Test email sent to ${to}`,
      id: result?.id,
    })
  } catch (error) {
    console.error('Test email error:', error)
    return NextResponse.json(
      {
        error: 'Failed to send test email',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
