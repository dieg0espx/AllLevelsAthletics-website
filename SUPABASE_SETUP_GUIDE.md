# Supabase Database Setup Guide for Orders System

## 🚨 IMPORTANT: Your orders aren't showing because the database tables don't exist yet!

## 📋 Step-by-Step Setup Instructions

### 1. Go to Your Supabase Dashboard
- Visit [https://supabase.com/dashboard](https://supabase.com/dashboard)
- Sign in and select your project

### 2. Navigate to SQL Editor
- In the left sidebar, click on "SQL Editor"
- Click "New Query"

### 3. Create the Orders Table
Copy and paste this SQL code:

```sql
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_session_id TEXT UNIQUE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'shipped', 'delivered', 'cancelled')),
  tracking_number TEXT,
  estimated_delivery DATE,
  actual_delivery DATE,
  shipping_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

Click "Run" to execute.

### 4. Create the Order Items Table
Create another new query and paste:

```sql
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  product_description TEXT,
  product_image TEXT,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

Click "Run" to execute.

### 5. Enable Row Level Security (RLS)
Create another query and paste:

```sql
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
```

Click "Run" to execute.

### 6. Create Security Policies
Create another query and paste:

```sql
-- Users can view their own orders
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- Users can insert their own orders
CREATE POLICY "Users can insert their own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Users can update their own orders
CREATE POLICY "Users can update their own orders" ON orders
  FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Users can view their own order items
CREATE POLICY "Users can view their own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id::text = auth.uid()::text
    )
  );

-- Users can insert their own order items
CREATE POLICY "Users can insert their own order items" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id::text = auth.uid()::text
    )
  );
```

Click "Run" to execute.

### 7. Verify Tables Exist
Go to "Table Editor" in the left sidebar. You should see:
- `orders` table
- `order_items` table

## 🔧 After Setup

Once you've created the tables:

1. **Test the checkout process again** - Make a new purchase
2. **Check the browser console** for any errors when saving orders
3. **Check your dashboard** - Orders should now appear

## 🐛 Troubleshooting

If orders still don't appear:

1. **Check browser console** for JavaScript errors
2. **Check Network tab** to see if API calls are failing
3. **Verify table names** match exactly: `orders` and `order_items`
4. **Check RLS policies** are properly applied

## 📞 Need Help?

If you're still having issues after following these steps, check:
- Browser console errors
- Network request failures
- Supabase logs in your dashboard
