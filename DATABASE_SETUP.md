# Database Setup for Orders System

## Required Tables

### 1. Orders Table
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

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" ON orders
  FOR UPDATE USING (auth.uid() = user_id);
```

### 2. Order Items Table
```sql
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_description TEXT,
  product_image TEXT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view items from their own orders" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert items to their own orders" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );
```

### 3. Create Indexes
```sql
-- Index for faster user order queries
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Index for order items
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
```

## Setup Instructions

1. **Go to your Supabase Dashboard**
2. **Navigate to SQL Editor**
3. **Run the above SQL commands in order**
4. **Verify tables are created in the Table Editor**

## Testing the Setup

After creating the tables, you can test with:

```sql
-- Insert a test order
INSERT INTO orders (user_id, stripe_session_id, total_amount, status)
VALUES ('your-user-id', 'test-session-123', 99.99, 'processing');

-- Insert test order items
INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price)
VALUES (
  (SELECT id FROM orders WHERE stripe_session_id = 'test-session-123'),
  'test-product-1',
  'Test Product',
  1,
  99.99,
  99.99
);
```

## Notes

- The system uses Row Level Security (RLS) to ensure users can only access their own orders
- Orders are linked to Stripe sessions for payment verification
- The status field tracks order progress: processing → shipped → delivered
- Shipping information is stored as JSONB for flexibility
- All timestamps are in UTC with timezone information
