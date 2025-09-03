# 🔑 Environment Setup Guide

## Quick Fix for Stripe 500 Error

The 500 error you're seeing is because Stripe environment variables are not set up.

### 1. Create `.env.local` file
Create a file called `.env.local` in your project root (same folder as `package.json`):

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

### 2. Get Your Stripe Keys
1. Go to [stripe.com](https://stripe.com) and create an account
2. Visit [Stripe Dashboard > API Keys](https://dashboard.stripe.com/apikeys)
3. Copy the **test keys** (they start with `pk_test_` and `sk_test_`)

### 3. Restart Your Development Server
After creating `.env.local`, restart your Next.js server:
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### 4. Test Again
Try clicking the "Order Now" button again - it should work now!

---

## 🚨 Important Notes

- **Never commit** `.env.local` to git (it's already in `.gitignore`)
- Use **test keys** for development, **live keys** for production
- The file must be named exactly `.env.local` (not `.env` or anything else)
- Restart the server after creating the file

---

## 🧪 Test Card Numbers

Once working, use these test cards:
- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- Any future expiry date and any 3-digit CVC

---

**That's it!** This should fix your Stripe 500 error. 🎉
