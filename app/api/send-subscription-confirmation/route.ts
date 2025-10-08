import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { email, planName, planPrice, billingPeriod, trialEnd } = await request.json()

    if (!email || !planName) {
      return NextResponse.json(
        { error: 'Email and plan name are required' },
        { status: 400 }
      )
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const trialInfo = trialEnd 
      ? `<p style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 16px; margin: 20px 0; border-radius: 4px;">
           <strong>🎉 Free Trial Active!</strong><br>
           Your 7-day free trial ends on <strong>${new Date(trialEnd).toLocaleDateString()}</strong>. 
           You'll be charged automatically unless you cancel before then.
         </p>`
      : ''

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to All Levels Athletics</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
    <div style="background-color: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="font-size: 28px; font-weight: bold; background: linear-gradient(135deg, #f97316, #eab308); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 10px;">
                All Levels Athletics
            </div>
            <div style="color: #666; font-size: 16px; margin-bottom: 30px;">
                Elite Online Personal Training
            </div>
        </div>
        
        <div style="font-size: 18px; color: #333; margin-bottom: 20px;">
            <strong>Welcome to All Levels Athletics!</strong>
        </div>
        
        <p>Hi there,</p>
        
        <p>Thank you for subscribing to the <strong>${planName} Plan</strong>! We're excited to have you join our community and can't wait to help you achieve your fitness goals.</p>
        
        ${trialInfo}
        
        <div style="background-color: #f97316; color: #000000; padding: 20px; border-radius: 8px; margin: 30px 0; text-align: center;">
            <h3 style="margin: 0 0 10px 0; font-size: 20px;">Your Subscription Details</h3>
            <p style="margin: 5px 0;"><strong>Plan:</strong> ${planName}</p>
            <p style="margin: 5px 0;"><strong>Billing:</strong> $${planPrice}/${billingPeriod}</p>
        </div>
        
        <p><strong>What happens next?</strong></p>
        <ul style="padding-left: 20px;">
            <li>Access your personalized dashboard immediately</li>
            <li>Complete your fitness profile</li>
            <li>Start your customized training program</li>
            <li>Schedule your first check-in with Daniel</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://alllevelsathletics.com'}/dashboard" style="display: inline-block; background-color: #f97316; color: #000000; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                Go to Dashboard
            </a>
        </div>
        
        <div style="margin-top: 20px; padding: 20px; background-color: #f8f9fa; border-radius: 8px; text-align: center;">
            <strong>Need help?</strong><br>
            Email: <a href="mailto:AllLevelsAthletics@gmail.com" style="color: #f97316; text-decoration: none;">AllLevelsAthletics@gmail.com</a><br>
            Phone: <a href="tel:760-585-8832" style="color: #f97316; text-decoration: none;">760-585-8832</a>
        </div>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 14px;">
            <p>© 2024 All Levels Athletics. All rights reserved.</p>
            <p>Transform your fitness with elite online personal training.</p>
        </div>
    </div>
</body>
</html>
    `

    const info = await transporter.sendMail({
      from: `"All Levels Athletics" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Welcome to All Levels Athletics - ${planName} Plan Activated`,
      html: emailHtml,
    })

    console.log('✅ Subscription confirmation email sent:', info.messageId)

    return NextResponse.json({ 
      success: true, 
      messageId: info.messageId 
    })

  } catch (error) {
    console.error('❌ Error sending subscription confirmation email:', error)
    return NextResponse.json(
      { error: 'Failed to send confirmation email' },
      { status: 500 }
    )
  }
}



