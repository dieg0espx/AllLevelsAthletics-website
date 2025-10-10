# 🚀 Quick Deployment Checklist

## Before You Connect Your Domain

### ☐ STEP 1: Supabase Setup
- [ ] Go to Supabase Dashboard → Authentication → URL Configuration
- [ ] Change Site URL from `localhost:3000` to `https://yourdomain.com`
- [ ] Add Redirect URLs:
  - `https://yourdomain.com/auth/callback`
  - `https://yourdomain.com/auth/reset-password`
  - `https://yourdomain.com/dashboard`
  - `https://yourdomain.com/*`
- [ ] Update Email Templates (replace localhost with your domain)
- [ ] Run SQL migration: `supabase-migrations/create-discounts-table.sql`

### ☐ STEP 2: Stripe Setup
- [ ] Go to Stripe Dashboard → Developers → Webhooks
- [ ] Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
- [ ] Select these events:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`
- [ ] Copy Webhook Secret (starts with `whsec_`)
- [ ] Update Business URL in Stripe settings to your domain
- [ ] **When ready to go live**: Switch to LIVE mode and get LIVE API keys

### ☐ STEP 3: Email Setup
- [ ] Enable 2-Factor Authentication on Gmail
- [ ] Create Gmail App Password:
  - Google Account → Security → App Passwords
  - Name: "All Levels Athletics Website"
  - Copy the 16-character password
- [ ] This goes in `EMAIL_PASS` and `SMTP_PASS` variables

### ☐ STEP 4: Deploy to Vercel
- [ ] Create Vercel account: https://vercel.com
- [ ] Import GitHub repository
- [ ] Add ALL environment variables (see below)
- [ ] Deploy

### ☐ STEP 5: Connect Domain
- [ ] Buy domain (if not already owned)
- [ ] In Vercel: Settings → Domains → Add your domain
- [ ] Update DNS settings (Vercel will show you what to do)
- [ ] Wait for DNS propagation (24-48 hours)

### ☐ STEP 6: Final Testing
- [ ] Test user registration
- [ ] Test login
- [ ] Test password reset email
- [ ] Test product checkout (use test card: 4242 4242 4242 4242)
- [ ] Test subscription checkout
- [ ] Test discount system
- [ ] Test Calendly booking
- [ ] Check emails arrive properly

### ☐ STEP 7: Go LIVE
- [ ] Switch Stripe to LIVE mode
- [ ] Update Stripe keys to LIVE keys
- [ ] Redeploy
- [ ] Monitor for first 24 hours

---

## 📋 Environment Variables for Vercel

Add these in Vercel → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

STRIPE_FOUNDATION_MONTHLY_PRICE_ID=price_...
STRIPE_FOUNDATION_ANNUAL_PRICE_ID=price_...
STRIPE_GROWTH_MONTHLY_PRICE_ID=price_...
STRIPE_GROWTH_ANNUAL_PRICE_ID=price_...
STRIPE_ELITE_MONTHLY_PRICE_ID=price_...
STRIPE_ELITE_ANNUAL_PRICE_ID=price_...

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=AllLevelsAthletics@gmail.com
EMAIL_PASS=your_16_char_app_password

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=AllLevelsAthletics@gmail.com
SMTP_PASS=your_16_char_app_password
SMTP_FROM=AllLevelsAthletics@gmail.com
CONTACT_EMAIL=AllLevelsAthletics@gmail.com

NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
SITE_URL=https://yourdomain.com
```

---

## ⚠️ CRITICAL: Don't Forget

1. **Gmail App Password** (not regular password!)
2. **Stripe LIVE keys** (not test keys) when going live
3. **Run discount migration** in Supabase
4. **Test before switching Stripe to LIVE mode**
5. **Update Supabase redirect URLs**

---

## 🎯 Order of Operations

**Correct order:**
1. Deploy to Vercel first (get staging URL)
2. Test everything on staging
3. Connect custom domain
4. Update Supabase/Stripe with production domain
5. Switch Stripe to LIVE mode (last step!)

**Wrong order:**
❌ Don't switch Stripe to LIVE before testing
❌ Don't add domain before deploying

---

## ✅ You're Ready When:

- Site loads on your domain with HTTPS
- Can register new user and receive email
- Can login successfully
- Can complete test purchase
- Order confirmation emails arrive
- Admin dashboard works
- Discounts display correctly

**Then switch Stripe to LIVE and go! 🚀**

