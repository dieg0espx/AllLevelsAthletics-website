import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/resend';

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

    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured')
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      )
    }

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

    await sendEmail({
      to: process.env.CONTACT_EMAIL || 'aletxa.pascual@gmail.com',
      subject: 'Contact Form Submission',
      html: emailTemplate,
    });

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
