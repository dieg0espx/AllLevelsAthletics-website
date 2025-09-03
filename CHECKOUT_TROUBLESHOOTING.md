# Checkout Error Troubleshooting Guide

## Error: "Invalid checkout URLs. Please check your site configuration"

This error occurs when Stripe cannot validate the checkout redirect URLs. Here's how to fix it:

## 🔧 Quick Fix Steps

### 1. Check Environment Variables
Make sure your `.env.local` file has the correct values:

```bash
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here
STRIPE_SECRET_KEY=sk_test_your_actual_key_here

# Site URL (for Stripe checkout redirects)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SITE_URL=http://localhost:3000
```

### 2. Get Your Stripe Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Copy your **Publishable key** (starts with `pk_test_` or `pk_live_`)
3. Copy your **Secret key** (starts with `sk_test_` or `sk_live_`)
4. Update your `.env.local` file with these values

### 3. Restart Your Development Server
After updating environment variables:
```bash
# Stop your current server (Ctrl+C)
# Then restart:
npm run dev
# or
yarn dev
# or
pnpm dev
```

## 🚨 Common Issues & Solutions

### Issue 1: Missing Stripe Keys
**Symptoms:**
- Console shows "Stripe publishable key loaded: No"
- Stripe key length is 0

**Solution:**
- Ensure `.env.local` file exists in your project root
- Add your actual Stripe keys (not placeholder text)
- Restart the development server

### Issue 2: Invalid URL Format
**Symptoms:**
- Error mentions "Not a valid URL"
- URLs are too long (>2048 characters)

**Solution:**
- Check that `NEXT_PUBLIC_SITE_URL` is properly formatted
- For local development: `http://localhost:3000`
- For production: `https://yourdomain.com`

### Issue 3: Environment Variables Not Loading
**Symptoms:**
- Variables show as `undefined` in console
- Server can't access environment variables

**Solution:**
- Ensure `.env.local` is in the project root (same level as `package.json`)
- Check that the file has no extra spaces or quotes
- Restart the development server

## 🔍 Debug Information

The checkout page now includes enhanced logging. Check your browser console for:

```
Stripe publishable key loaded: Yes/No
Stripe key length: [number]
Stripe key starts with pk_: true/false
```

The API route also logs detailed information about:
- Environment variables
- URL construction
- Stripe session creation

## 📋 Environment Variables Checklist

- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key
- [ ] `STRIPE_SECRET_KEY` - Your Stripe secret key  
- [ ] `NEXT_PUBLIC_SITE_URL` - Your site URL (http://localhost:3000 for local dev)
- [ ] `SITE_URL` - Your site URL (http://localhost:3000 for local dev)

## 🆘 Still Having Issues?

If the problem persists:

1. **Check the browser console** for detailed error messages
2. **Check the server logs** for API route errors
3. **Verify Stripe keys** are correct and active
4. **Ensure URLs** are accessible and properly formatted
5. **Check network tab** for failed API requests

## 🔗 Useful Links

- [Stripe API Keys](https://dashboard.stripe.com/apikeys)
- [Stripe Checkout Documentation](https://stripe.com/docs/checkout)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
