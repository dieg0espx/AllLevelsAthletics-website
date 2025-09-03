# Complete Environment Setup Guide

## 🚨 Current Issue
Your application is failing because the environment variables contain placeholder values instead of actual credentials.

## 🔧 Step-by-Step Setup

### 1. Get Your Supabase Credentials

1. **Go to [Supabase Dashboard](https://app.supabase.com/)**
2. **Sign in or create an account**
3. **Create a new project or select existing one**
4. **Go to Settings → API**
5. **Copy these values:**
   - **Project URL** (looks like: `https://abcdefghijklmnop.supabase.co`)
   - **anon public key** (starts with: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### 2. Get Your Stripe Credentials

1. **Go to [Stripe Dashboard](https://dashboard.stripe.com/)**
2. **Sign in or create an account**
3. **Go to Developers → API keys**
4. **Copy these values:**
   - **Publishable key** (starts with: `pk_test_...` or `pk_live_...`)
   - **Secret key** (starts with: `sk_test_...` or `sk_live_...`)

### 3. Update Your .env.local File

Replace the placeholder values in your `.env.local` file with your actual credentials:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_ACTUAL_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ACTUAL_ANON_KEY_HERE

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_STRIPE_KEY
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_STRIPE_KEY

# Site URL (for Stripe checkout redirects)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SITE_URL=http://localhost:3000
```

### 4. Example of What It Should Look Like

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNjU2NzI5MCwiZXhwIjoxOTUyMTQzMjkwfQ.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51H1234567890abcdefghijklmnopqrstuvwxyz
STRIPE_SECRET_KEY=sk_test_51H1234567890abcdefghijklmnopqrstuvwxyz

# Site URL (for Stripe checkout redirects)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SITE_URL=http://localhost:3000
```

## ⚠️ Important Notes

- **Never commit `.env.local` to version control**
- **Use test keys for development, live keys for production**
- **Restart your development server after making changes**

## 🔍 Verification Steps

After updating your `.env.local` file:

1. **Restart your development server:**
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

2. **Check browser console for:**
   ```
   Stripe publishable key loaded: Yes
   Stripe key length: [number > 0]
   Stripe key starts with pk_: true
   ```

3. **Try logging in/registering** - should work without network errors

## 🆘 Troubleshooting

### If you still get "ERR_NAME_NOT_RESOLVED":
- Check that your Supabase URL is correct
- Ensure no extra spaces or quotes in `.env.local`
- Restart your development server

### If Stripe checkout still fails:
- Verify your Stripe keys are correct
- Check that keys start with `pk_test_` and `sk_test_`
- Ensure `NEXT_PUBLIC_SITE_URL` is set correctly

### If environment variables show as undefined:
- Make sure `.env.local` is in your project root
- Check file permissions
- Restart your development server

## 📞 Need Help?

If you're still having issues:
1. Check the browser console for specific error messages
2. Verify your credentials are correct
3. Ensure you've restarted your development server
4. Check that all required environment variables are set
