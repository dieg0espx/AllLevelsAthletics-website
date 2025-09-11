# All Levels Athletics - Setup Guide

This guide will help you fix the profile saving and bought products display issues.

## Issues Identified

1. **Profile Information Not Saving**: Missing environment variables and potential database schema issues
2. **Bought Products Not Showing**: Missing database tables and authentication issues

## Step 1: Environment Variables Setup

1. Create a `.env.local` file in your project root
2. Copy the contents from `env-template.txt` and fill in your actual values:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Email Configuration (for order confirmations)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### How to get Supabase credentials:
1. Go to your Supabase project dashboard
2. Go to Settings > API
3. Copy the Project URL and anon/public key
4. Copy the service_role key (keep this secret!)

## Step 2: Database Setup

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the entire contents of `database-schema.sql`
4. Run the SQL script

This will create all necessary tables:
- `user_profiles` - for storing user contact information
- `orders` - for storing purchase orders
- `order_items` - for storing individual items in orders
- `user_subscriptions` - for storing subscription data

## Step 3: Test the Fixes

1. Start your development server:
```bash
npm run dev
```

2. Open your browser and go to `http://localhost:3000`

3. **Test Profile Saving**:
   - Log in to your account
   - Go to Dashboard > Profile
   - Try editing and saving your contact information
   - Check the browser console for detailed logs

4. **Test Bought Products**:
   - Go to Dashboard > Products
   - Check if your purchased products are displayed
   - Check the browser console for detailed logs

## Step 4: Debugging

If issues persist, check the browser console for detailed error messages. The improved code now includes comprehensive logging:

- 🔄 Process indicators
- ✅ Success messages
- ❌ Error messages
- 📊 Data information
- 🔐 Authentication status

## Common Issues and Solutions

### Issue: "SupabaseAdmin not available"
**Solution**: Make sure `SUPABASE_SERVICE_ROLE_KEY` is set in your `.env.local` file

### Issue: "Database table does not exist"
**Solution**: Run the SQL script from `database-schema.sql` in your Supabase SQL Editor

### Issue: "Authentication required"
**Solution**: Make sure you're logged in and the session is valid

### Issue: "No orders found"
**Solution**: This might be normal if you haven't made any purchases yet

## File Changes Made

1. **Enhanced API Error Handling**:
   - `app/api/user-profile/route.ts` - Better error messages and logging
   - `app/api/user-orders/route.ts` - Database connection testing and improved error handling

2. **Improved User Interface**:
   - `app/dashboard/profile/page.tsx` - Better error feedback for profile saving
   - `app/dashboard/products/page.tsx` - Better error handling for order loading

3. **Database Schema**:
   - `database-schema.sql` - Complete database setup with proper RLS policies

4. **Environment Template**:
   - `env-template.txt` - Template for required environment variables

## Next Steps

After completing the setup:

1. Test all functionality thoroughly
2. Make a test purchase to verify the order system works
3. Update your profile information to test the saving functionality
4. Check that all data persists after page refreshes

If you continue to experience issues, check the browser console for specific error messages and contact support with the detailed error information.
