import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { checkInId, userId } = await request.json()

    if (!checkInId || !userId) {
      return NextResponse.json(
        { error: 'Check-in ID and User ID are required' },
        { status: 400 }
      )
    }

    // Fetch check-in details
    const { data: checkIn, error: checkInError } = await supabaseAdmin
      .from('coaching_check_ins')
      .select('*')
      .eq('id', checkInId)
      .single()

    if (checkInError || !checkIn) {
      console.error('Error fetching check-in:', checkInError)
      return NextResponse.json(
        { error: 'Check-in not found' },
        { status: 404 }
      )
    }

    // Fetch user profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (profileError || !profile) {
      console.error('Error fetching user profile:', profileError)
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    // Fetch user auth data to get email
    const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId)

    if (userError || !user || !user.email) {
      console.error('Error fetching user email:', userError)
      return NextResponse.json(
        { error: 'User email not found' },
        { status: 404 }
      )
    }

    // Format date and time for email (San Diego/Pacific timezone)
    const scheduledDate = new Date(checkIn.scheduled_date)
    const dateString = scheduledDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'America/Los_Angeles'
    })
    const timeString = scheduledDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/Los_Angeles'
    })

    // Setup email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const checkInTypeName = checkIn.check_in_type.replace('_', ' ')
      .split(' ')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    // Email content for client
    const clientEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: #f9fafb;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .appointment-details {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #f97316;
          }
          .detail-row {
            margin: 10px 0;
          }
          .label {
            font-weight: bold;
            color: #f97316;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background: #f97316;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Appointment Confirmed!</h1>
            <p>Your coaching session has been scheduled</p>
          </div>
          <div class="content">
            <p>Hi ${profile.full_name || user.email?.split('@')[0] || 'there'},</p>
            
            <p>Great news! Your one-on-one coaching appointment has been successfully scheduled.</p>
            
            <div class="appointment-details">
              <h2 style="margin-top: 0; color: #f97316;">Appointment Details</h2>
              <div class="detail-row">
                <span class="label">Date:</span> ${dateString}
              </div>
              <div class="detail-row">
                <span class="label">Time:</span> ${timeString} (Pacific Time)
              </div>
              <div class="detail-row">
                <span class="label">Session Type:</span> ${checkInTypeName}
              </div>
              ${checkIn.notes ? `
              <div class="detail-row">
                <span class="label">Notes:</span><br>
                ${checkIn.notes}
              </div>
              ` : ''}
            </div>
            
            <p><strong>What to expect:</strong></p>
            <ul>
              <li>You'll receive a reminder 24 hours before your session</li>
              <li>Please be ready 5 minutes before the scheduled time</li>
              <li>Have any questions or concerns ready to discuss</li>
            </ul>
            
            <center>
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard/coaching" class="button">
                View in Dashboard
              </a>
            </center>
            
            <p>If you need to reschedule or cancel, please do so at least 24 hours in advance through your dashboard.</p>
            
            <p>See you soon!</p>
            <p><strong>All Levels Athletics Team</strong></p>
            
            <div class="footer">
              <p>All Levels Athletics - One-on-One Coaching</p>
              <p>This is an automated confirmation email. Please do not reply to this email.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `

    // Email content for admin
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: #f9fafb;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .appointment-details {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #3b82f6;
          }
          .detail-row {
            margin: 10px 0;
          }
          .label {
            font-weight: bold;
            color: #3b82f6;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Coaching Appointment</h1>
            <p>A client has scheduled a coaching session</p>
          </div>
          <div class="content">
            <p>Hi Coach,</p>
            
            <p>A new coaching appointment has been scheduled in the system.</p>
            
            <div class="appointment-details">
              <h2 style="margin-top: 0; color: #3b82f6;">Appointment Details</h2>
              <div class="detail-row">
                <span class="label">Client:</span> ${profile.full_name || user.email}
              </div>
              <div class="detail-row">
                <span class="label">Email:</span> ${user.email}
              </div>
              <div class="detail-row">
                <span class="label">Date:</span> ${dateString}
              </div>
              <div class="detail-row">
                <span class="label">Time:</span> ${timeString} (Pacific Time)
              </div>
              <div class="detail-row">
                <span class="label">Session Type:</span> ${checkInTypeName}
              </div>
              ${checkIn.notes ? `
              <div class="detail-row">
                <span class="label">Client Notes:</span><br>
                ${checkIn.notes}
              </div>
              ` : ''}
            </div>
            
            <p>The client has received a confirmation email with all the details.</p>
            
            <div class="footer">
              <p>All Levels Athletics - Coaching Management System</p>
              <p>This is an automated notification email.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `

    // Send email to client
    const clientMailOptions = {
      from: {
        name: 'All Levels Athletics',
        address: process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@alllevelsathletics.com'
      },
      to: user.email,
      subject: 'Coaching Appointment Confirmed - All Levels Athletics',
      html: clientEmailHtml,
    }

    // Send email to admin/coach
    const adminMailOptions = {
      from: {
        name: 'All Levels Athletics',
        address: process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@alllevelsathletics.com'
      },
      to: process.env.CONTACT_EMAIL || 'aletxa.pascual@gmail.com',
      subject: `New Coaching Appointment - ${dateString} at ${timeString}`,
      html: adminEmailHtml,
    }

    // Send both emails
    console.log('Sending confirmation email to client:', user.email)
    await transporter.sendMail(clientMailOptions)
    console.log('Client email sent successfully')

    console.log('Sending notification email to admin:', process.env.CONTACT_EMAIL || 'aletxa.pascual@gmail.com')
    await transporter.sendMail(adminMailOptions)
    console.log('Admin email sent successfully')

    return NextResponse.json({
      success: true,
      message: 'Confirmation emails sent successfully'
    })

  } catch (error) {
    console.error('Error sending appointment confirmation:', error)
    return NextResponse.json(
      {
        error: 'Failed to send confirmation email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

