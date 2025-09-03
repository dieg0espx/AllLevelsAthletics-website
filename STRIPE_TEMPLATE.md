# 🚀 STRIPE INTEGRATION TEMPLATE
## Copy-Paste Ready for Any Project

This template provides everything you need to implement Stripe checkout in any Next.js project. Just change the variables and you're ready to go!

---

## 📁 REQUIRED FILES

### 1. API Route: `app/api/create-checkout-session/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia', // UPDATE: Use latest Stripe API version
})

export async function POST(request: NextRequest) {
  try {
    const { productId, productName, price, quantity = 1 } = await request.json()

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd', // UPDATE: Change currency if needed
            product_data: {
              name: productName,
              description: 'YOUR_COMPANY_NAME - Premium Product', // UPDATE: Change company name
              images: ['YOUR_PRODUCT_IMAGE_URL'], // UPDATE: Add your product image URL
            },
            unit_amount: Math.round(price * 100), // Convert to cents
          },
          quantity,
        },
      ],
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`, // UPDATE: Change success page path
      cancel_url: `${request.nextUrl.origin}/YOUR_CANCEL_PAGE`, // UPDATE: Change cancel page path
      metadata: {
        productId,
        productName,
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
```

### 2. Checkout Component: `components/stripe-checkout.tsx`
```typescript
"use client"

import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Button } from "@/components/ui/button" // UPDATE: Change to your button component
import { ShoppingCart, Loader2 } from "lucide-react" // UPDATE: Change icons if needed

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface StripeCheckoutProps {
  productId: string
  productName: string
  price: number
  quantity?: number
  className?: string
  children?: React.ReactNode
}

export default function StripeCheckout({
  productId,
  productName,
  price,
  quantity = 1,
  className = "",
  children
}: StripeCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    setIsLoading(true)
    
    try {
      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          productName,
          price,
          quantity,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { sessionId } = await response.json()

      // Redirect to Stripe checkout
      const stripe = await stripePromise
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId })
        if (error) {
          console.error('Stripe error:', error)
          alert('Payment failed. Please try again.') // UPDATE: Change error handling
        }
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Something went wrong. Please try again.') // UPDATE: Change error handling
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleCheckout}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <ShoppingCart className="w-4 h-4 mr-2" />
      )}
      {children || `Buy Now - $${price}`} // UPDATE: Change button text
    </Button>
  )
}
```

### 3. Success Page: `app/success/page.tsx`
```typescript
"use client"

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle, Package, Home, ShoppingBag } from 'lucide-react' // UPDATE: Change icons

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Processing your order...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Order Confirmed! 🎉
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your purchase! Your order has been successfully processed.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
            <div className="text-left space-y-2">
              <p><strong>Order ID:</strong> {sessionId}</p>
              <p><strong>Status:</strong> <span className="text-green-600 font-semibold">Paid</span></p>
              <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">What's Next?</h2>
            <div className="text-left space-y-3">
              <div className="flex items-center">
                <Package className="w-5 h-5 text-blue-600 mr-3" />
                <span>You'll receive an order confirmation email shortly</span>
              </div>
              <div className="flex items-center">
                <Package className="w-5 h-5 text-blue-600 mr-3" />
                <span>Physical products will be shipped within 2-3 business days</span>
              </div>
              <div className="flex items-center">
                <Package className="w-5 h-5 text-blue-600 mr-3" />
                <span>Digital products are available immediately</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
            <Link 
              href="/services" // UPDATE: Change to your services page
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Browse More Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

## 🔧 SETUP STEPS

### 1. Install Dependencies
```bash
npm install stripe @stripe/stripe-js --legacy-peer-deps
```

### 2. Create Environment File
Create `.env.local` in your project root:
```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

### 3. Get Stripe Keys
- Go to [stripe.com](https://stripe.com) and create an account
- Visit [Stripe Dashboard > API Keys](https://dashboard.stripe.com/apikeys)
- Copy the test keys (they start with `pk_test_` and `sk_test_`)

### 4. Use the Component
```typescript
import StripeCheckout from '@/components/stripe-checkout'

// In your product page:
<StripeCheckout
  productId="your-product-id"
  productName="Your Product Name"
  price={99.99}
  className="your-custom-class"
>
  Custom Button Text
</StripeCheckout>
```

---

## 📝 VARIABLES TO CHANGE

| Variable | Location | What to Change |
|----------|----------|----------------|
| `YOUR_COMPANY_NAME` | API route | Your company/brand name |
| `YOUR_PRODUCT_IMAGE_URL` | API route | Your product image URL |
| `YOUR_CANCEL_PAGE` | API route | Page to redirect on cancel |
| `YOUR_SUCCESS_PAGE` | API route | Page to redirect after success |
| `Button` component | Checkout component | Your button component |
| Icons | All files | Your preferred icon library |
| Error handling | Checkout component | Your error handling method |
| Button text | Checkout component | Your button text |
| Success page styling | Success page | Your design system |

---

## 🧪 TESTING

Use these test card numbers:
- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- Any future expiry date and any 3-digit CVC

---

## 🚀 PRODUCTION

1. Replace test keys with live keys
2. Update API version if needed
3. Add your domain to Stripe's allowed origins
4. Test with real cards

---

## 💡 TIPS

- **Keep it simple:** This template handles one-time payments only
- **Customize gradually:** Start with basic functionality, then add features
- **Test thoroughly:** Always test with Stripe's test mode first
- **Handle errors:** Add proper error handling for production use
- **Monitor logs:** Check Stripe dashboard for payment analytics

---

**That's it!** Copy these files, change the variables, and you'll have Stripe checkout working in any Next.js project! 🎉
