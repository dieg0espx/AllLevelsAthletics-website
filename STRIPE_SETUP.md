# Stripe Integration Setup Guide

## Overview
This project now includes Stripe checkout functionality for the All Levels Knot Roller and other products on the services page.

## Setup Steps

### 1. Create a Stripe Account
- Go to [stripe.com](https://stripe.com) and create an account
- Complete the account verification process

### 2. Get Your API Keys
- Go to your [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
- Copy your **Publishable Key** and **Secret Key**
- For development, use the **test keys** (they start with `pk_test_` and `sk_test_`)

### 3. Environment Variables
Create a `.env.local` file in your project root with:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

**Important:** 
- Never commit your `.env.local` file to version control
- The `NEXT_PUBLIC_` prefix makes the publishable key available to the browser
- Keep your secret key secure and server-side only

### 4. Test the Integration
- Use Stripe's test card numbers for testing:
  - **Success:** 4242 4242 4242 4242
  - **Decline:** 4000 0000 0000 0002
- Any future expiry date and any 3-digit CVC will work

### 5. Production Deployment
- Replace test keys with live keys when going to production
- Update the `apiVersion` in `/app/api/create-checkout-session/route.ts` if needed
- Ensure your domain is added to Stripe's allowed origins

## Products Available for Purchase

### All Levels Knot Roller
- **Price:** $99 + shipping
- **Product ID:** `knot-roller`
- **Description:** Professional myofascial release tool

### Body Tension Reset Course
- **Price:** $49 (50% off from $99)
- **Product ID:** `tension-reset-course`
- **Description:** 30-day self-guided program

### Complete Bundle
- **Price:** $149 (Save $50)
- **Product ID:** `complete-bundle`
- **Description:** Knot Roller + Course Package

## How It Works

1. **User clicks "Order Now"** on any product
2. **Stripe checkout session is created** via our API
3. **User is redirected to Stripe** for secure payment
4. **After successful payment**, user is redirected to `/success` page
5. **Order confirmation** is displayed with next steps

## Customization

### Adding New Products
1. Update the `StripeCheckout` component call with new product details
2. Add the product to the Stripe dashboard if needed
3. Update the success page to handle new products

### Modifying Prices
- Update the `price` prop in the `StripeCheckout` component
- Ensure the price matches what's configured in Stripe

### Styling
- The checkout buttons use the existing design system
- Customize the `className` prop for different styles

## Support

For Stripe-related issues:
- Check the [Stripe Documentation](https://stripe.com/docs)
- Review the [Stripe API Reference](https://stripe.com/docs/api)
- Contact Stripe Support for account-specific issues

For application issues:
- Check the browser console for errors
- Review the API route logs
- Ensure environment variables are set correctly
