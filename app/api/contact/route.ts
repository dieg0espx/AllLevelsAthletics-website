import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, goals, experience, timeline, questions } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !goals) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Support both SMTP_ and EMAIL_ prefixes (prefer SMTP_)
    const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER
    const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS
    const smtpHost = process.env.SMTP_HOST || process.env.EMAIL_HOST || 'smtp.gmail.com'
    const smtpPort = Number(process.env.SMTP_PORT || process.env.EMAIL_PORT || '587')
    const smtpSecure = (process.env.SMTP_SECURE || process.env.EMAIL_SECURE) === 'true'
    const smtpFrom = process.env.SMTP_FROM || smtpUser || 'noreply@alllevelsathletics.com'

    if (!smtpUser || !smtpPass) {
      console.error('❌ EMAIL CREDENTIALS MISSING - Cannot send contact form email')
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      )
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Simple email template with black, white, and grey colors only
    const emailTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>New Contact Form Submission</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { background-color: #333; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { padding: 20px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #333; margin-bottom: 5px; }
            .value { color: #666; padding: 10px; background-color: #f9f9f9; border-radius: 4px; }
            .footer { background-color: #f5f5f5; padding: 15px; text-align: center; color: #666; font-size: 12px; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Contact Form Submission</h1>
              <p>From: ${firstName} ${lastName}</p>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Name:</div>
                <div class="value">${firstName} ${lastName}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div class="value">${email}</div>
              </div>
              ${phone ? `
              <div class="field">
                <div class="label">Phone:</div>
                <div class="value">${phone}</div>
              </div>
              ` : ''}
              <div class="field">
                <div class="label">Fitness Goals:</div>
                <div class="value">${goals}</div>
              </div>
              ${experience ? `
              <div class="field">
                <div class="label">Current Experience:</div>
                <div class="value">${experience}</div>
              </div>
              ` : ''}
              ${timeline ? `
              <div class="field">
                <div class="label">Timeline:</div>
                <div class="value">${timeline}</div>
              </div>
              ` : ''}
              ${questions ? `
              <div class="field">
                <div class="label">Questions:</div>
                <div class="value">${questions}</div>
              </div>
              ` : ''}
            </div>
            <div class="footer">
              <p>This message was sent from the All Levels Athletics contact form.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: smtpFrom,
      to: process.env.CONTACT_EMAIL || 'aletxa.pascual@gmail.com',           // Main recipient    // You get a copy
      subject: 'Contact Form Submission',
      html: emailTemplate,
      replyTo: email
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
