// Test script for email functionality
// Run with: node test-email.js

const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

async function testEmail() {
  console.log('🧪 Testing email configuration...');
  
  // Check if environment variables are set
  const requiredVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing environment variables:', missingVars.join(', '));
    console.log('📝 Please add these to your .env.local file');
    return;
  }
  
  console.log('✅ Environment variables found');
  console.log('📧 SMTP Host:', process.env.SMTP_HOST);
  console.log('📧 SMTP Port:', process.env.SMTP_PORT);
  console.log('📧 SMTP User:', process.env.SMTP_USER);
  
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  
  try {
    // Verify connection
    console.log('🔍 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP server is ready to take our messages');
    
    // Send test email
    console.log('📤 Sending test email...');
    const info = await transporter.sendMail({
      from: `"All Levels Athletics" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // Send to yourself for testing
      subject: 'Test Email - All Levels Athletics',
      html: `
        <h2>🎉 Email Test Successful!</h2>
        <p>Your email configuration is working correctly.</p>
        <p><strong>Order Status Tracking System</strong> is ready to send notifications.</p>
        <hr>
        <p><em>This is a test email from your All Levels Athletics website.</em></p>
      `,
      text: `
        Email Test Successful!
        
        Your email configuration is working correctly.
        Order Status Tracking System is ready to send notifications.
        
        This is a test email from your All Levels Athletics website.
      `
    });
    
    console.log('✅ Test email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📬 Check your inbox for the test email');
    
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    
    if (error.message.includes('Invalid login')) {
      console.log('💡 Tip: Check your email credentials and app password');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.log('💡 Tip: Check your SMTP host and port settings');
    } else if (error.message.includes('timeout')) {
      console.log('💡 Tip: Check your internet connection and firewall settings');
    }
  }
}

// Run the test
testEmail().catch(console.error);
