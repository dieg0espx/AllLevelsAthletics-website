# Email Configuration Guide

## Problem
Emails (subscription confirmation and coupon codes) are not being sent because email credentials are not configured.

## Solution
Configure the following environment variables in your Vercel project settings.

## Required Environment Variables

Add these to your Vercel project under **Settings → Environment Variables**:

### For Gmail SMTP:
```bash
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password  # Use App Password, not regular password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

### For Other SMTP Providers:

**Outlook/Hotmail:**
```bash
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

**SendGrid:**
```bash
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
```

**Mailgun:**
```bash
EMAIL_USER=your-mailgun-username
EMAIL_PASS=your-mailgun-password
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_SECURE=false
```

## How to Get Gmail App Password

If using Gmail, you **cannot** use your regular Gmail password. You must create an "App Password":

1. Go to your Google Account: https://myaccount.google.com/
2. Click **Security** → **2-Step Verification** (must be enabled)
3. Scroll down to **App passwords**
4. Click **Select app** → Choose "Mail"
5. Click **Select device** → Choose "Other (Custom name)"
6. Enter "All Levels Athletics" or similar
7. Click **Generate**
8. Copy the 16-character password (no spaces)
9. Use this as your `EMAIL_PASS` value

## Testing

After setting up environment variables:

1. **Redeploy your Vercel project** (environment variables only apply to new deployments)
2. Complete a test subscription purchase
3. Check Vercel logs to see if email was sent successfully
4. Check the customer's email inbox (and spam folder)

## Verification in Logs

After deployment, check Vercel logs. You should see:
- ✅ `Subscription confirmation email sent successfully` (if working)
- ❌ `EMAIL CREDENTIALS MISSING` (if credentials are not set)
- ❌ `Missing credentials for "PLAIN"` (if credentials are invalid)

## Troubleshooting

**Emails still not sending?**
1. Verify all environment variables are set correctly in Vercel
2. Make sure you **redeployed** after adding variables
3. Check Vercel logs for specific error messages
4. Verify the email address in `EMAIL_USER` is correct
5. For Gmail: Make sure you're using an App Password, not your regular password
6. Check your spam folder

**Getting authentication errors?**
- Gmail requires App Passwords (see above)
- Some providers require OAuth2 instead of basic auth
- Verify your SMTP host and port are correct
- Make sure 2FA is enabled for Gmail (required for App Passwords)

