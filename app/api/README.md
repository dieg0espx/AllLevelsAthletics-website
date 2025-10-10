# 📡 API Routes Documentation

## Overview
This directory contains all Next.js API routes for the All Levels Athletics platform.

## 🗂️ Directory Structure

### `/admin` - Admin-Only Endpoints
- `GET/PUT /admin/clients` - Client management
- `GET/PUT /admin/orders` - Order management
- `GET /admin/coaching-clients` - Coaching client list
- `GET /admin/coaching-sessions` - Coaching sessions
- `GET/PUT /admin/discounts` - Discount management
- `GET /admin/check-ins` - Check-in management
- `GET /admin/programs` - Program management
- `GET /admin/sessions` - Session management

### `/coaching` - Coaching Management
- `GET/POST /coaching/check-ins` - Check-in CRUD operations
- `GET /coaching/progress` - User progress tracking
- `GET /coaching/schedule` - Session scheduling
- `GET /coaching/metric-history` - Metric tracking
- `GET /coaching/metric-templates` - Metric templates
- `POST /coaching/send-appointment-confirmation` - Email confirmations

### `/discounts` - Discount System
- `GET /discounts` - Public endpoint for active discounts
- `GET/PUT /admin/discounts` - Admin discount management

### Stripe Integration
- `POST /create-checkout-session` - Product checkout
- `POST /create-subscription-checkout` - Subscription checkout
- `POST /create-customer-portal-session` - Customer portal access
- `POST /create-plan-checkout-session` - Plan purchase
- `POST /stripe-webhook` - Stripe event webhooks
- `GET /get-checkout-session` - Session details

### Subscription Management
- `GET /check-subscription` - Check subscription status
- `GET /check-subscription-status` - Status verification
- `POST /upgrade-subscription` - Upgrade tier
- `POST /downgrade-subscription` - Downgrade tier
- `POST /manual-upgrade` - Manual tier change
- `POST /force-upgrade` - Force tier change
- `POST /sync-subscription-status` - Sync with Stripe
- `POST /sync-subscription-after-upgrade` - Post-upgrade sync

### User Endpoints
- `GET /user-profile` - User profile data
- `GET /user-programs` - User's enrolled programs
- `GET /user-orders` - User's order history
- `GET /user-subscription` - User's subscription details

### Orders & Email
- `POST /save-order` - Save order to database
- `POST /send-order-confirmation` - Email order confirmation
- `POST /send-status-notification` - Order status updates
- `POST /send-subscription-confirmation` - Subscription email
- `PUT /update-order-status` - Update order status

### Programs
- `POST /add-user-program` - Enroll user in program
- `PUT /update-program-progress` - Update progress
- `GET /user-programs` - Get user programs

### Utilities
- `POST /contact` - Contact form submission
- `GET /tiktok-embed` - TikTok embed handler
- `POST /set-admin` - Set admin role
- `POST /setup-database` - Database initialization
- `POST /setup-programs-table` - Programs table setup

## 🔐 Authentication

Most endpoints require authentication via Supabase JWT token.

### Public Endpoints (No Auth Required)
- `GET /discounts`
- `POST /contact`
- `GET /tiktok-embed`

### Authenticated Endpoints
All user-specific routes require valid session

### Admin Endpoints
All `/admin/*` routes require `role: 'admin'` in user metadata

## 🎯 Request/Response Examples

### Get Active Discounts
```typescript
GET /api/discounts

Response:
{
  "discounts": {
    "coaching": 15,
    "products": 10
  },
  "coaching": 15,
  "products": 10
}
```

### Create Subscription Checkout
```typescript
POST /api/create-subscription-checkout
Body: {
  "planId": "foundation" | "growth" | "elite",
  "billingPeriod": "monthly" | "annual",
  "userId": "user_uuid"
}

Response:
{
  "sessionId": "cs_...",
  "sessionUrl": "https://checkout.stripe.com/...",
  "success": true
}
```

### Update Discount (Admin)
```typescript
PUT /api/admin/discounts
Body: {
  "discountType": "coaching" | "products",
  "percentage": 15,
  "userId": "admin_user_uuid"
}

Response:
{
  "success": true,
  "discount": {
    "type": "coaching",
    "percentage": 15,
    "isActive": true
  }
}
```

## ⚠️ Important Notes

### Stripe Webhooks
- Endpoint: `/api/stripe-webhook`
- Validates webhook signature
- Handles: checkout.session.completed, subscription events, invoice events

### Email Sending
- Uses Gmail SMTP via Nodemailer
- Requires Gmail App Password (not regular password)
- Configure in environment variables

### Database
- All tables use Row Level Security (RLS)
- Policies enforce authentication and role-based access
- Migrations in `/supabase-migrations/`

## 🔧 Development Tips

### Adding New API Route
1. Create directory: `app/api/your-route/`
2. Add `route.ts` with handlers (GET, POST, etc.)
3. Use TypeScript for type safety
4. Add error handling
5. Document in this README

### Testing Locally
Use tools like:
- Postman
- Thunder Client
- `curl` commands

### Debugging
- Check browser Network tab
- View API logs in terminal
- Check Supabase logs for database errors
- Check Stripe dashboard for webhook events

## 📚 Related Documentation

- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)

---

**Last Updated:** October 2025

