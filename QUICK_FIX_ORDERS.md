# 🚨 QUICK FIX: Orders Failing with RLS Policy Error

## ❌ Current Error
```
Failed to create order: new row violates row-level security policy for table "orders"
```

## 🔍 Root Cause
The orders API route is using the anonymous Supabase client, but Row Level Security (RLS) policies require authenticated user context. The API route needs to bypass RLS to create orders on behalf of users.

## ✅ Solution: Add Service Role Key

### Step 1: Get Your Service Role Key
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the **"service_role" key** (NOT the anon key)

### Step 2: Add to Environment
Create or update your `.env.local` file in the project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_key_here

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step 3: Restart Server
```bash
# Stop current server (Ctrl+C)
npm run dev
```

## 🔧 What Was Fixed

1. **Added service role client** in `lib/supabase.ts`
2. **Updated API route** to use admin client for orders
3. **Bypasses RLS policies** for order creation
4. **Maintains security** - only API routes can use admin client

## 🧪 Test After Fix

1. Make a test purchase
2. Check browser console for success messages
3. Verify orders appear in your dashboard
4. Check Supabase dashboard for new records

## 🆘 Still Having Issues?

If orders still fail:
1. ✅ Verify service role key is correct
2. ✅ Restart your dev server
3. ✅ Check that database tables exist
4. ✅ Look for new error messages in console

## 📋 Database Tables Required

Make sure you have these tables in Supabase:
- `orders` table
- `order_items` table

See `SUPABASE_SETUP_GUIDE.md` for table creation SQL.

## 🔒 Security Note

The service role key bypasses RLS but is only used in server-side API routes. Client-side code still uses the anonymous key and respects RLS policies.
