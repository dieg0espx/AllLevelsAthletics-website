# Environment Setup Complete

## ✅ What's Already Set Up

- Next.js project structure
- Supabase client configuration
- Authentication context
- Shopping cart functionality
- Stripe checkout integration
- Order management system

## 🔑 Missing Environment Variables

You need to add these to your `.env.local` file:

### Supabase Service Role Key (CRITICAL for Orders)
```
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Why this is needed:**
- The orders API needs to bypass Row Level Security (RLS) policies
- Without this key, orders will fail with "row-level security policy violation"
- This key allows the API to create orders on behalf of users

**How to get it:**
1. Go to your Supabase dashboard
2. Navigate to Settings → API
3. Copy the "service_role" key (NOT the anon key)
4. Add it to your `.env.local` file

## 🚨 Current Issue

Your orders are failing because:
1. The API route uses the anonymous client
2. RLS policies require authenticated user context
3. The service role key bypasses RLS for admin operations

## 🔧 Quick Fix

1. **Add the service role key** to `.env.local`
2. **Restart your development server**
3. **Test the checkout process again**

## 📋 Complete .env.local Example

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 🧪 Test After Setup

1. Make a test purchase
2. Check browser console for success messages
3. Verify orders appear in your dashboard
4. Check Supabase dashboard for new records

## 🆘 Still Having Issues?

If orders still fail after adding the service role key:
1. Check that the key is correct
2. Restart your dev server
3. Verify the database tables exist
4. Check the API route logs
