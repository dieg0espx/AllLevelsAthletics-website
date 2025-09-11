import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    console.log('📧 Sending status notification email...')
    
    const body = await request.json()
    const { 
      orderId, 
      orderNumber, 
      customerEmail, 
      customerName, 
      status, 
      trackingNumber, 
      estimatedDelivery,
      productName 
    } = body
    
    console.log('📧 Email request:', { orderId, orderNumber, customerEmail, status })

    if (!customerEmail || !status || !orderNumber) {
      return NextResponse.json(
        { error: 'Customer email, status, and order number are required' },
        { status: 400 }
      )
    }

    // Generate email content
    const emailContent = generateEmailContent({
      orderNumber,
      customerName: customerName || 'Valued Customer',
      status,
      trackingNumber,
      estimatedDelivery,
      productName
    })

    console.log('📧 Email content generated')

    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Verify transporter configuration
    try {
      await transporter.verify()
      console.log('📧 SMTP server is ready to take our messages')
    } catch (error) {
      console.error('📧 SMTP verification failed:', error)
      return NextResponse.json(
        { error: 'Email service configuration error' },
        { status: 500 }
      )
    }

    // Send email
    const mailOptions = {
      from: `"All Levels Athletics" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: customerEmail,
      subject: `Order ${orderNumber} Status Update - ${getStatusTitle(status)}`,
      html: emailContent.html,
      text: emailContent.text,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('📧 Email sent successfully:', info.messageId)

    return NextResponse.json({ 
      success: true,
      message: 'Status notification email sent successfully',
      messageId: info.messageId
    })

  } catch (error) {
    console.error('Error sending status notification:', error)
    return NextResponse.json(
      { error: 'Failed to send email notification' },
      { status: 500 }
    )
  }
}

function getStatusTitle(status: string): string {
  const statusTitles = {
    processing: 'Order Confirmed',
    shipped: 'Order Shipped',
    delivered: 'Order Delivered',
    cancelled: 'Order Cancelled'
  }
  return statusTitles[status as keyof typeof statusTitles] || 'Order Update'
}

function generateEmailContent({ 
  orderNumber, 
  customerName, 
  status, 
  trackingNumber, 
  estimatedDelivery, 
  productName 
}: {
  orderNumber: string
  customerName: string
  status: string
  trackingNumber?: string
  estimatedDelivery?: string
  productName?: string
}) {
  const statusMessages = {
    processing: {
      title: 'Order Confirmed',
      message: 'Your order has been confirmed and is being prepared for shipping.',
      nextStep: 'We will notify you once your order ships.'
    },
    shipped: {
      title: 'Order Shipped',
      message: 'Great news! Your order has been shipped and is on its way.',
      nextStep: trackingNumber ? `Track your package with tracking number: ${trackingNumber}` : 'You will receive tracking information soon.'
    },
    delivered: {
      title: 'Order Delivered',
      message: 'Your order has been successfully delivered!',
      nextStep: 'Thank you for your business. We hope you enjoy your purchase!'
    },
    cancelled: {
      title: 'Order Cancelled',
      message: 'Your order has been cancelled.',
      nextStep: 'If you have any questions, please contact our support team.'
    }
  }

  const statusInfo = statusMessages[status as keyof typeof statusMessages] || statusMessages.processing

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Status Update</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f97316; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .status-badge { 
          display: inline-block; 
          padding: 8px 16px; 
          border-radius: 20px; 
          font-weight: bold; 
          text-transform: uppercase;
          margin: 10px 0;
        }
        .processing { background: #fbbf24; color: #92400e; }
        .shipped { background: #3b82f6; color: white; }
        .delivered { background: #10b981; color: white; }
        .cancelled { background: #ef4444; color: white; }
        .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>All Levels Athletics</h1>
          <h2>Order Status Update</h2>
        </div>
        
        <div class="content">
          <p>Hello ${customerName},</p>
          
          <p>We have an update regarding your order <strong>${orderNumber}</strong>:</p>
          
          <div class="status-badge ${status}">${statusInfo.title}</div>
          
          <p>${statusInfo.message}</p>
          
          <div class="order-details">
            <h3>Order Details:</h3>
            <p><strong>Order Number:</strong> ${orderNumber}</p>
            ${productName ? `<p><strong>Product:</strong> ${productName}</p>` : ''}
            ${trackingNumber ? `<p><strong>Tracking Number:</strong> ${trackingNumber}</p>` : ''}
            ${estimatedDelivery ? `<p><strong>Estimated Delivery:</strong> ${estimatedDelivery}</p>` : ''}
          </div>
          
          <p>${statusInfo.nextStep}</p>
          
          <p>If you have any questions about your order, please don't hesitate to contact our support team.</p>
          
          <p>Thank you for choosing All Levels Athletics!</p>
          
          <div class="footer">
            <p>All Levels Athletics<br>
            <a href="mailto:support@alllevelsathletics.com">support@alllevelsathletics.com</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  const text = `
All Levels Athletics - Order Status Update

Hello ${customerName},

We have an update regarding your order ${orderNumber}:

${statusInfo.title.toUpperCase()}

${statusInfo.message}

Order Details:
- Order Number: ${orderNumber}
${productName ? `- Product: ${productName}` : ''}
${trackingNumber ? `- Tracking Number: ${trackingNumber}` : ''}
${estimatedDelivery ? `- Estimated Delivery: ${estimatedDelivery}` : ''}

${statusInfo.nextStep}

If you have any questions about your order, please don't hesitate to contact our support team.

Thank you for choosing All Levels Athletics!

All Levels Athletics
support@alllevelsathletics.com
  `

  return { html, text }
}
