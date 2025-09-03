# Quick Setup for Stripe Integration

## 1. Create Environment File
Create a `.env.local` file in your project root:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

## 2. Get Your Stripe Keys
- Go to [stripe.com](https://stripe.com) and create an account
- Visit [Stripe Dashboard > API Keys](https://dashboard.stripe.com/apikeys)
- Copy the test keys (they start with `pk_test_` and `sk_test_`)

## 3. Test the Integration
- Click "Order Now" on any product on the services page
- Use test card: 4242 4242 4242 4242
- Any future expiry date and any 3-digit CVC

## 4. What's Included
- ✅ Stripe checkout for All Levels Knot Roller ($99)
- ✅ Stripe checkout for Body Tension Reset Course ($49)
- ✅ Stripe checkout for Complete Bundle ($149)
- ✅ Success page after payment
- ✅ Updated dashboard products page
- ✅ Full payment processing flow

## 5. Files Modified
- `app/api/create-checkout-session/route.ts` - Stripe API endpoint
- `app/success/page.tsx` - Success page after payment
- `components/stripe-checkout.tsx` - Checkout component
- `app/services/page.tsx` - Updated with Stripe buttons
- `app/dashboard/products/page.tsx` - Updated product list

## 6. Next Steps
- Test the checkout flow
- Customize the success page if needed
- Add more products as required
- Switch to live keys for production

For detailed setup, see `STRIPE_SETUP.md`
