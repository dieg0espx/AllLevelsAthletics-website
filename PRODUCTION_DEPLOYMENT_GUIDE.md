# 🚀 Production Deployment Guide
## Connecting All Levels Athletics to Your Real Domain

### Overview
This guide covers everything you need to do to move from localhost to your production domain.

---

## 📋 STEP-BY-STEP CHECKLIST

### **STEP 1: Choose Your Domain & Hosting Platform**

#### Option A: Vercel (Recommended for Next.js)
1. **Create Vercel account**: https://vercel.com
2. **Connect your GitHub repository**
3. **Deploy the project** (it will give you a `.vercel.app` domain first)
4. **Add your custom domain** in Vercel dashboard → Settings → Domains
   - Example: `alllevelsathletics.com` and `www.alllevelsathletics.com`

#### Option B: Netlify
1. Similar process to Vercel
2. Deploy from GitHub
3. Add custom domain in settings

#### Your Custom Domain Setup:
- **Get a domain**: From GoDaddy, Namecheap, Google Domains, etc.
- **Point DNS to hosting**: 
  - For Vercel: Add A record to `76.76.21.21`
  - For CNAME: point to `cname.vercel-dns.com`
- **Wait for DNS propagation** (can take 24-48 hours)

**✅ What you'll get**: Your production URL (e.g., `https://alllevelsathletics.com`)

---

### **STEP 2: Update Supabase Settings**

#### 2.1 Add Production URLs to Supabase Auth
1. **Go to Supabase Dashboard** → Authentication → URL Configuration
2. **Site URL**: Change from `http://localhost:3000` to `https://yourdomain.com`
3. **Redirect URLs** - Add these:
   ```
   https://yourdomain.com/auth/callback
   https://yourdomain.com/auth/reset-password
   https://yourdomain.com/dashboard
   https://yourdomain.com/*
   ```

#### 2.2 Update Email Templates (Important!)
1. **Go to**: Authentication → Email Templates
2. **Update these templates** to use your domain:
   - **Confirm signup**: Replace localhost with `https://yourdomain.com`
   - **Reset password**: Replace localhost with `https://yourdomain.com`
   - **Magic Link**: Replace localhost with `https://yourdomain.com`

#### 2.3 Email Settings
1. **Go to**: Authentication → Email
2. **Configure custom SMTP** (optional but recommended):
   - Use your domain email (e.g., `noreply@alllevelsathletics.com`)
   - Or keep Supabase default emails

**✅ Result**: Users can register, login, and reset passwords on production

---

### **STEP 3: Update Stripe Configuration**

#### 3.1 Get Stripe Price IDs (if not already done)
You need these environment variables (check if you have them):
- `STRIPE_FOUNDATION_MONTHLY_PRICE_ID`
- `STRIPE_FOUNDATION_ANNUAL_PRICE_ID`
- `STRIPE_GROWTH_MONTHLY_PRICE_ID`
- `STRIPE_GROWTH_ANNUAL_PRICE_ID`
- `STRIPE_ELITE_MONTHLY_PRICE_ID`
- `STRIPE_ELITE_ANNUAL_PRICE_ID`

**To create them** (if missing):
1. Go to Stripe Dashboard → Products
2. Create products for each tier (Foundation, Growth, Elite)
3. Add monthly and annual prices to each
4. Copy the Price IDs (start with `price_...`)

#### 3.2 Update Webhook Endpoints
1. **Go to**: Stripe Dashboard → Developers → Webhooks
2. **Add new endpoint**: `https://yourdomain.com/api/webhooks/stripe`
3. **Select events to listen to**:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. **Copy the Webhook Secret** (starts with `whsec_...`)
5. **Test the webhook** (Stripe has a test feature)

#### 3.3 Update Stripe Business Settings
1. **Business name**: All Levels Athletics
2. **Business URL**: `https://yourdomain.com`
3. **Support email**: `AllLevelsAthletics@gmail.com`
4. **Support phone**: `760-585-8832`

**✅ Result**: Payments work on production, webhooks process correctly

---

### **STEP 4: Update Environment Variables**

#### 4.1 Create `.env.production` or update deployment platform:

```env
# Supabase Configuration (same as development)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe Configuration (use LIVE mode keys, not test!)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_... (NOT pk_test_!)
STRIPE_SECRET_KEY=sk_live_... (NOT sk_test_!)
STRIPE_WEBHOOK_SECRET=whsec_... (from Step 3.2)

# Stripe Price IDs (LIVE mode)
STRIPE_FOUNDATION_MONTHLY_PRICE_ID=price_...
STRIPE_FOUNDATION_ANNUAL_PRICE_ID=price_...
STRIPE_GROWTH_MONTHLY_PRICE_ID=price_...
STRIPE_GROWTH_ANNUAL_PRICE_ID=price_...
STRIPE_ELITE_MONTHLY_PRICE_ID=price_...
STRIPE_ELITE_ANNUAL_PRICE_ID=price_...

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=AllLevelsAthletics@gmail.com
EMAIL_PASS=your_gmail_app_password

# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=AllLevelsAthletics@gmail.com
SMTP_PASS=your_gmail_app_password
SMTP_FROM=AllLevelsAthletics@gmail.com
CONTACT_EMAIL=AllLevelsAthletics@gmail.com

# App Configuration (⚠️ CRITICAL - Change these!)
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
SITE_URL=https://yourdomain.com
```

#### 4.2 Where to Add These:

**If using Vercel:**
1. Go to: Project Settings → Environment Variables
2. Add each variable one by one
3. Make sure to select "Production" environment
4. **Redeploy** after adding all variables

**If using Netlify:**
1. Go to: Site Settings → Build & Deploy → Environment
2. Add all variables
3. Trigger a new deploy

**✅ Result**: App knows its production URL, all redirects work correctly

---

### **STEP 5: Email Configuration**

#### 5.1 Gmail Setup (Current email provider)
**IMPORTANT**: Gmail requires App Passwords (not regular password)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Create App Password**:
   - Go to: Google Account → Security → 2-Step Verification → App Passwords
   - Select "Mail" and "Other (Custom name)"
   - Name it: "All Levels Athletics Website"
   - Copy the 16-character password
3. **Use this App Password** in your `EMAIL_PASS` and `SMTP_PASS` variables

#### 5.2 Update Email Addresses
Replace test emails with production:
```env
EMAIL_USER=AllLevelsAthletics@gmail.com
SMTP_USER=AllLevelsAthletics@gmail.com
SMTP_FROM=AllLevelsAthletics@gmail.com
CONTACT_EMAIL=AllLevelsAthletics@gmail.com
```

**✅ Result**: Order confirmations and notifications send properly

---

### **STEP 6: Run Database Migration**

⚠️ **CRITICAL**: Before going live, run the discount table migration:

1. **Open Supabase Dashboard** → SQL Editor
2. **Run this file**: `supabase-migrations/create-discounts-table.sql`
3. **Verify**:
   ```sql
   SELECT * FROM public.discounts;
   ```
   You should see 2 rows (coaching and products, both at 0%)

**✅ Result**: Discount system works without errors

---

### **STEP 7: Calendly Configuration**

Check if Calendly needs domain updates:
1. **Go to**: Calendly Account Settings
2. **Allowed Domains**: Add `yourdomain.com`
3. **Verify**: Calendly popup works on production

**✅ Result**: Booking system works

---

### **STEP 8: Update Code Configuration**

#### Update `lib/config.ts`:
```typescript
domain: "youractualdomian.com", // Change this
```

**✅ Result**: Metadata uses correct domain

---

### **STEP 9: Test Everything**

#### Before Going Live, Test These:
- ✅ User registration (check email verification)
- ✅ User login
- ✅ Password reset (check email)
- ✅ Add MFRoller to cart
- ✅ Complete checkout (use Stripe test card: 4242 4242 4242 4242)
- ✅ Subscribe to coaching package
- ✅ Webhooks receive events (check Stripe dashboard)
- ✅ Order confirmation emails send
- ✅ Admin dashboard access
- ✅ Set a discount in admin
- ✅ Verify discount shows on all pages
- ✅ Calendly popup opens

#### Stripe Test Cards (for final testing):
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Auth**: `4000 0025 0000 3155`
- Any future date for expiry, any 3-digit CVC

---

### **STEP 10: Switch Stripe to LIVE Mode**

⚠️ **DO THIS LAST - After all testing is complete!**

1. **Stripe Dashboard** → Toggle from "Test mode" to "Live mode" (top right)
2. **Get LIVE API keys**:
   - Publishable key: `pk_live_...`
   - Secret key: `sk_live_...`
3. **Create LIVE products and prices** (same as test mode):
   - Foundation Monthly/Annual
   - Growth Monthly/Annual
   - Elite Monthly/Annual
4. **Copy LIVE Price IDs**
5. **Update environment variables** with LIVE keys
6. **Update webhook** to use LIVE endpoint
7. **Redeploy** your application

**✅ Result**: Real payments will be processed!

---

## 🔒 SECURITY CHECKLIST

Before going live, verify:
- [ ] All API keys are in environment variables (not in code)
- [ ] `.env.local` is in `.gitignore`
- [ ] Service role keys are kept secret
- [ ] Stripe webhook secret is configured
- [ ] Row Level Security is enabled on all Supabase tables
- [ ] Admin role is properly protected
- [ ] HTTPS is enabled (automatic with Vercel/Netlify)

---

## 📝 QUICK DEPLOYMENT SUMMARY

### Minimum Required Changes:

1. **Environment Variables** (in Vercel/Netlify):
   ```
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   SITE_URL=https://yourdomain.com
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

2. **Supabase**:
   - Add production URLs to Redirect URLs
   - Update email templates

3. **Stripe**:
   - Add webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Switch to LIVE mode when ready
   - Update business settings with production URL

4. **Email**:
   - Generate Gmail App Password
   - Update SMTP settings

5. **Database**:
   - Run discount migration SQL

---

## 🎯 DEPLOYMENT PLATFORMS COMPARISON

### Vercel (Recommended)
**Pros:**
- Best for Next.js (made by same team)
- Automatic HTTPS
- Automatic deployments from GitHub
- Free tier available
- Fast global CDN

**Cons:**
- Serverless functions have timeout limits

### Netlify
**Pros:**
- Good Next.js support
- Free tier
- Easy setup

**Cons:**
- Slightly slower than Vercel for Next.js

---

## 📞 NEED HELP?

Common issues and solutions:

**Issue**: Stripe webhooks not working
- **Solution**: Check webhook URL matches exactly, verify webhook secret

**Issue**: Emails not sending
- **Solution**: Verify Gmail App Password, check 2FA is enabled

**Issue**: Auth redirects fail
- **Solution**: Add ALL redirect URLs to Supabase, verify site URL

**Issue**: 404 on API routes
- **Solution**: Ensure serverless functions are enabled, check build logs

---

## ✅ FINAL PRE-LAUNCH CHECKLIST

Before announcing:
- [ ] Domain is connected and working
- [ ] SSL certificate is active (shows 🔒 in browser)
- [ ] All pages load correctly
- [ ] Test purchase works end-to-end
- [ ] Emails arrive in inbox (not spam)
- [ ] Admin dashboard accessible
- [ ] Discount system working
- [ ] Mobile responsive on real devices
- [ ] Analytics connected (if using)
- [ ] Backup plan in place

---

## 🚨 IMPORTANT WARNINGS

### DO NOT:
- ❌ Commit `.env.local` to GitHub
- ❌ Use test Stripe keys in production
- ❌ Skip webhook testing
- ❌ Forget to update Supabase redirect URLs
- ❌ Use regular Gmail password (must use App Password)

### DO:
- ✅ Test everything in test mode first
- ✅ Keep backups of environment variables
- ✅ Monitor error logs after deployment
- ✅ Test on multiple devices
- ✅ Have a rollback plan

---

## 📧 Email Addresses to Update

Search and replace these test emails with production emails:

**Current (found in env-template.txt):**
- `analytics@comcreate.org` → `AllLevelsAthletics@gmail.com`
- `aletxa.pascual@gmail.com` → `AllLevelsAthletics@gmail.com`

**Where to update:**
1. Environment variables (Vercel/Netlify dashboard)
2. Email templates in code (if any)
3. Contact forms

---

## 🎨 Optional: Custom Domain Email

For more professional emails (optional):
- Use Google Workspace: `daniel@alllevelsathletics.com`
- Or email forwarding from your domain registrar

---

## 📊 Post-Deployment Monitoring

After going live, monitor:
1. **Vercel/Netlify logs** for errors
2. **Stripe Dashboard** → Events for webhook activity
3. **Supabase** → Auth logs for user activity
4. **Browser console** on production site
5. **Email inbox** for order confirmations

---

## 🔄 DEPLOYMENT WORKFLOW

```
1. Push to GitHub
   ↓
2. Vercel auto-deploys
   ↓
3. Check deployment preview
   ↓
4. Test on staging URL
   ↓
5. If good → Promote to production
   ↓
6. Monitor for 24 hours
```

---

## 💰 Costs to Expect

- **Domain**: $10-15/year
- **Vercel/Netlify**: Free tier should work (upgrade if needed: $20/month)
- **Supabase**: Free tier likely sufficient (paid: $25/month if needed)
- **Stripe**: No monthly fee, just transaction fees (2.9% + 30¢)
- **Email**: Free with Gmail App Password

**Total estimated**: $10-15/year on free tiers!

---

## 🎯 QUICK START (TL;DR)

**Fastest path to production:**

1. **Deploy to Vercel** (5 minutes)
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   ```

2. **Add environment variables** in Vercel dashboard (10 minutes)

3. **Update Supabase redirect URLs** (2 minutes)

4. **Add Stripe webhook** with production URL (3 minutes)

5. **Test everything** (30 minutes)

6. **Go live!** 🚀

---

## 📝 ENVIRONMENT VARIABLE TEMPLATE FOR PRODUCTION

Copy this template and fill in your values:

```env
# === SUPABASE ===
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# === STRIPE (LIVE MODE!) ===
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# === STRIPE PRICE IDs (LIVE MODE!) ===
STRIPE_FOUNDATION_MONTHLY_PRICE_ID=price_...
STRIPE_FOUNDATION_ANNUAL_PRICE_ID=price_...
STRIPE_GROWTH_MONTHLY_PRICE_ID=price_...
STRIPE_GROWTH_ANNUAL_PRICE_ID=price_...
STRIPE_ELITE_MONTHLY_PRICE_ID=price_...
STRIPE_ELITE_ANNUAL_PRICE_ID=price_...

# === EMAIL ===
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=AllLevelsAthletics@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx (16-char App Password)

# === SMTP (Nodemailer) ===
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=AllLevelsAthletics@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx (same App Password)
SMTP_FROM=AllLevelsAthletics@gmail.com
CONTACT_EMAIL=AllLevelsAthletics@gmail.com

# === PRODUCTION URLS ===
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
SITE_URL=https://yourdomain.com
```

---

## ⚡ VERCEL DEPLOYMENT STEPS (DETAILED)

### Option 1: Using Vercel Dashboard

1. **Go to**: https://vercel.com
2. **Click**: "Add New" → "Project"
3. **Import**: Your GitHub repository
4. **Configure**:
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. **Add Environment Variables** (copy all from above)
6. **Deploy**

### Option 2: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to production
vercel --prod

# Add environment variables via CLI
vercel env add NEXT_PUBLIC_SITE_URL production
# (Enter your domain when prompted)
# Repeat for all variables

# Redeploy with new variables
vercel --prod
```

---

## 🌐 DOMAIN VERIFICATION

After connecting domain, verify:

```bash
# Check DNS propagation
nslookup yourdomain.com

# Check SSL certificate
curl -I https://yourdomain.com
```

Should show:
- Status: 200 OK
- SSL/TLS certificate valid

---

## 📞 SUPPORT RESOURCES

- **Vercel Docs**: https://vercel.com/docs
- **Stripe Docs**: https://stripe.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment

---

## 🎉 YOU'RE READY!

After completing all steps:
1. Your site will be live on your custom domain
2. Payments will process through Stripe (LIVE mode)
3. Emails will send from your domain
4. Users can register and subscribe
5. Admin dashboard accessible
6. Discount system active

**Good luck with your launch! 🚀**

