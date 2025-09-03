# 🚀 STRIPE QUICK REFERENCE CARD
## Copy-Paste Checklist for Any Project

---

## 📋 WHAT TO COPY (3 Files)

1. **`app/api/create-checkout-session/route.ts`** - Stripe API endpoint
2. **`components/stripe-checkout.tsx`** - Checkout button component  
3. **`app/success/page.tsx`** - Success page after payment

---

## 🔄 WHAT TO CHANGE (Variables Only)

### In `route.ts`:
```typescript
// Change these 4 things:
description: 'YOUR_COMPANY_NAME - Premium Product'
images: ['YOUR_PRODUCT_IMAGE_URL']
success_url: `${request.nextUrl.origin}/YOUR_SUCCESS_PAGE?session_id={CHECKOUT_SESSION_ID}`
cancel_url: `${request.nextUrl.origin}/YOUR_CANCEL_PAGE`
```

### In `stripe-checkout.tsx`:
```typescript
// Change these 2 things:
import { Button } from "@/components/ui/button" // Your button component
import { ShoppingCart, Loader2 } from "lucide-react" // Your icons
```

### In `success/page.tsx`:
```typescript
// Change these 2 things:
href="/YOUR_SERVICES_PAGE" // Your services page path
// Update any company-specific text
```

---

## ⚡ QUICK SETUP

1. **Install:** `npm install stripe @stripe/stripe-js --legacy-peer-deps`
2. **Copy** the 3 files above
3. **Change** the variables listed above
4. **Add** your Stripe keys to `.env.local`
5. **Use** the component: `<StripeCheckout productId="id" productName="name" price={99} />`

---

## 🎯 EXAMPLE USAGE

```typescript
// In your product page:
<StripeCheckout
  productId="my-product"
  productName="My Awesome Product"
  price={49.99}
>
  Buy Now!
</StripeCheckout>
```

---

**That's it!** Copy 3 files, change ~8 variables, and you're done! 🎉
