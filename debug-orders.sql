-- Debug Orders for AllLevelsAthletics website
-- Run this in your Supabase SQL Editor to see what's happening

-- 1. Check if orders table exists and has data
SELECT 
  'orders' as table_name,
  COUNT(*) as total_records,
  COUNT(DISTINCT user_id) as unique_users
FROM orders;

-- 2. Check if order_items table exists and has data
SELECT 
  'order_items' as table_name,
  COUNT(*) as total_records,
  COUNT(DISTINCT order_id) as unique_orders
FROM order_items;

-- 3. Look at the actual orders data
SELECT 
  id,
  user_id,
  stripe_session_id,
  total_amount,
  status,
  created_at,
  LENGTH(user_id::text) as user_id_length
FROM orders 
ORDER BY created_at DESC 
LIMIT 5;

-- 4. Check the user_id format in orders
SELECT 
  user_id,
  pg_typeof(user_id) as user_id_type,
  LENGTH(user_id::text) as user_id_length
FROM orders 
GROUP BY user_id;

-- 5. Check if there are any RLS policy violations
-- This will show if RLS is blocking access
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename IN ('orders', 'order_items');

-- 6. Test a simple query without RLS (replace with actual user ID)
-- SELECT * FROM orders WHERE user_id = 'your-actual-user-id-here';
