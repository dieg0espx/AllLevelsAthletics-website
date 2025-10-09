import nodemailer from 'nodemailer'

interface EmailData {
  orderId: number
  orderNumber: string
  customerEmail: string
  customerName: string
  items: any[]
  totalAmount: number
  shippingAddress: any
  orderDate: string
}

export async function sendOrderConfirmationEmail(data: EmailData) {
  try {
    console.log('Sending order confirmation emails...')

    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Verify SMTP connection
    console.log('Verifying SMTP connection...')
    await transporter.verify()
    console.log('SMTP connection verified successfully')

    // Generate customer email content
    const customerEmailContent = generateCustomerEmailContent(data)

    // Generate admin email content
    const adminEmailContent = generateAdminEmailContent(data)

    // Send customer confirmation email
    const customerMailOptions = {
      from: `"All Levels Athletics" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: data.customerEmail,
      subject: `Order Confirmation - ${data.orderNumber}`,
      html: customerEmailContent.html,
      text: customerEmailContent.text,
    }

    console.log('Sending customer email to:', data.customerEmail)
    const customerInfo = await transporter.sendMail(customerMailOptions)
    console.log('Customer email sent successfully! Message ID:', customerInfo.messageId)

    // Send admin notification email
    const adminMailOptions = {
      from: `"All Levels Athletics" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || 'aletxa.pascual@gmail.com',
      subject: `New Order Received - ${data.orderNumber}`,
      html: adminEmailContent.html,
      text: adminEmailContent.text,
    }

    console.log('Sending admin email to:', process.env.CONTACT_EMAIL || 'aletxa.pascual@gmail.com')
    const adminInfo = await transporter.sendMail(adminMailOptions)
    console.log('Admin email sent successfully! Message ID:', adminInfo.messageId)

    return {
      success: true,
      message: 'Order confirmation emails sent successfully',
      customerEmailId: customerInfo.messageId,
      adminEmailId: adminInfo.messageId
    }

  } catch (error) {
    console.error('Error sending order confirmation emails:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

function generateCustomerEmailContent({ orderNumber, customerName, items, totalAmount, shippingAddress, orderDate }: EmailData) {
  const itemsList = items.map((item: any) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">
        <strong>${item.name}</strong><br>
        <small style="color: #666;">${item.description || ''}</small>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('')

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation - All Levels Athletics</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #ff6b35, #f7931e); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
        .content { padding: 30px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #333; margin-bottom: 5px; }
        .value { color: #666; padding: 10px; background-color: #f9f9f9; border-radius: 4px; }
        .footer { background-color: #f5f5f5; padding: 15px; text-align: center; color: #666; font-size: 12px; border-radius: 0 0 8px 8px; }
        .order-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff6b35; }
        .items-table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .items-table th { background: #ff6b35; color: white; padding: 12px; text-align: left; }
        .items-table td { padding: 12px; border-bottom: 1px solid #eee; }
        .items-table tfoot { background: #f5f5f5; font-weight: bold; }
        .shipping-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff6b35; }
        .next-steps { background: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff6b35; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="color: white; margin: 0; font-size: 28px;">All Levels Athletics</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Order Confirmation</p>
        </div>
        
        <div class="content">
          <h2 style="color: #ff6b35; margin-top: 0;">Thank you for your order, ${customerName}!</h2>
          
          <p>Your order has been received and is being processed. Here are the details:</p>
          
          <div class="order-info">
            <h3 style="margin-top: 0; color: #ff6b35;">Order Information</h3>
            <div class="field">
              <div class="label">Order Number:</div>
              <div class="value">${orderNumber}</div>
            </div>
            <div class="field">
              <div class="label">Order Date:</div>
              <div class="value">${new Date(orderDate).toLocaleDateString()}</div>
            </div>
            <div class="field">
              <div class="label">Status:</div>
              <div class="value">Processing</div>
            </div>
          </div>
          
          <h3 style="color: #ff6b35;">Order Items</h3>
          <table class="items-table">
            <thead>
              <tr>
                <th>Product</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="text-align: right;">Total Amount:</td>
                <td style="text-align: right; color: #ff6b35; font-size: 18px;">$${totalAmount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
          
          <div class="shipping-info">
            <h3 style="margin-top: 0; color: #ff6b35;">Shipping Address</h3>
            <div class="field">
              <div class="label">Name:</div>
              <div class="value">${shippingAddress.firstName} ${shippingAddress.lastName}</div>
            </div>
            <div class="field">
              <div class="label">Address:</div>
              <div class="value">${shippingAddress.address}</div>
            </div>
            <div class="field">
              <div class="label">City, State ZIP:</div>
              <div class="value">${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}</div>
            </div>
            <div class="field">
              <div class="label">Country:</div>
              <div class="value">${shippingAddress.country}</div>
            </div>
          </div>
          
          <div class="next-steps">
            <h3 style="margin-top: 0; color: #ff6b35;">What's Next?</h3>
            <ul>
              <li>We'll process your order within 1-2 business days</li>
              <li>You'll receive a shipping confirmation with tracking information</li>
              <li>Your order will be delivered within 5-7 business days</li>
            </ul>
          </div>
          
          <p>Need help? Contact us at <a href="mailto:AllLevelsAthletics@gmail.com" style="color: #ff6b35;">AllLevelsAthletics@gmail.com</a></p>
        </div>
        
        <div class="footer">
          <p>Thank you for choosing All Levels Athletics!<br>
          <strong>The All Levels Athletics Team</strong></p>
        </div>
      </div>
    </body>
    </html>
  `

  const text = `
    All Levels Athletics - Order Confirmation
    
    Thank you for your order, ${customerName}!
    
    Order Information:
    - Order Number: ${orderNumber}
    - Order Date: ${new Date(orderDate).toLocaleDateString()}
    - Status: Processing
    
    Order Items:
    ${items.map((item: any) => `- ${item.name} (Qty: ${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`).join('\n')}
    
    Total Amount: $${totalAmount.toFixed(2)}
    
    Shipping Address:
    ${shippingAddress.firstName} ${shippingAddress.lastName}
    ${shippingAddress.address}
    ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}
    ${shippingAddress.country}
    
    What's Next?
    - We'll process your order within 1-2 business days
    - You'll receive a shipping confirmation with tracking information
    - Your order will be delivered within 5-7 business days
    
    Need help? Contact us at AllLevelsAthletics@gmail.com
    
    Thank you for choosing All Levels Athletics!
    The All Levels Athletics Team
  `

  return { html, text }
}

function generateAdminEmailContent({ orderNumber, customerName, customerEmail, items, totalAmount, shippingAddress, orderDate }: EmailData) {
  const itemsList = items.map((item: any) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">
        <strong>${item.name}</strong><br>
        <small style="color: #666;">${item.description || ''}</small>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('')

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Order - All Levels Athletics</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #ff6b35, #f7931e); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
        .content { padding: 30px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #333; margin-bottom: 5px; }
        .value { color: #666; padding: 10px; background-color: #f9f9f9; border-radius: 4px; }
        .footer { background-color: #f5f5f5; padding: 15px; text-align: center; color: #666; font-size: 12px; border-radius: 0 0 8px 8px; }
        .order-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff6b35; }
        .customer-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff6b35; }
        .items-table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .items-table th { background: #ff6b35; color: white; padding: 12px; text-align: left; }
        .items-table td { padding: 12px; border-bottom: 1px solid #eee; }
        .items-table tfoot { background: #f5f5f5; font-weight: bold; }
        .shipping-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff6b35; }
        .action-required { background: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff6b35; }
        .admin-button { background: #ff6b35; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="color: white; margin: 0; font-size: 28px;">All Levels Athletics</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">New Order Notification</p>
        </div>
        
        <div class="content">
          <h2 style="color: #ff6b35; margin-top: 0;">New Order Received!</h2>
          
          <div class="order-info">
            <h3 style="margin-top: 0; color: #ff6b35;">Order Information</h3>
            <div class="field">
              <div class="label">Order Number:</div>
              <div class="value">${orderNumber}</div>
            </div>
            <div class="field">
              <div class="label">Order Date:</div>
              <div class="value">${new Date(orderDate).toLocaleDateString()}</div>
            </div>
            <div class="field">
              <div class="label">Status:</div>
              <div class="value">Processing</div>
            </div>
          </div>
          
          <div class="customer-info">
            <h3 style="margin-top: 0; color: #ff6b35;">Customer Information</h3>
            <div class="field">
              <div class="label">Name:</div>
              <div class="value">${customerName}</div>
            </div>
            <div class="field">
              <div class="label">Email:</div>
              <div class="value"><a href="mailto:${customerEmail}" style="color: #ff6b35;">${customerEmail}</a></div>
            </div>
          </div>
          
          <h3 style="color: #ff6b35;">Order Items</h3>
          <table class="items-table">
            <thead>
              <tr>
                <th>Product</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="text-align: right;">Total Amount:</td>
                <td style="text-align: right; color: #ff6b35; font-size: 18px;">$${totalAmount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
          
          <div class="shipping-info">
            <h3 style="margin-top: 0; color: #ff6b35;">Shipping Address</h3>
            <div class="field">
              <div class="label">Name:</div>
              <div class="value">${shippingAddress.firstName} ${shippingAddress.lastName}</div>
            </div>
            <div class="field">
              <div class="label">Address:</div>
              <div class="value">${shippingAddress.address}</div>
            </div>
            <div class="field">
              <div class="label">City, State ZIP:</div>
              <div class="value">${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}</div>
            </div>
            <div class="field">
              <div class="label">Country:</div>
              <div class="value">${shippingAddress.country}</div>
            </div>
          </div>
          
          <div class="action-required">
            <h3 style="margin-top: 0; color: #ff6b35;">Action Required</h3>
            <p>Please process this order and update the status in the admin dashboard.</p>
            <p><a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin" class="admin-button">View in Admin Dashboard</a></p>
          </div>
        </div>
        
        <div class="footer">
          <p>This is an automated notification from All Levels Athletics<br>
          <strong>Order Management System</strong></p>
        </div>
      </div>
    </body>
    </html>
  `

  const text = `
    All Levels Athletics - New Order Notification
    
    New Order Received!
    
    Order Information:
    - Order Number: ${orderNumber}
    - Order Date: ${new Date(orderDate).toLocaleDateString()}
    - Status: Processing
    
    Customer Information:
    - Name: ${customerName}
    - Email: ${customerEmail}
    
    Order Items:
    ${items.map((item: any) => `- ${item.name} (Qty: ${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`).join('\n')}
    
    Total Amount: $${totalAmount.toFixed(2)}
    
    Shipping Address:
    ${shippingAddress.firstName} ${shippingAddress.lastName}
    ${shippingAddress.address}
    ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}
    ${shippingAddress.country}
    
    Action Required: Please process this order and update the status in the admin dashboard.
    
    This is an automated notification from All Levels Athletics Order Management System.
  `

  return { html, text }
}





