-- Fix existing database schema for AllLevelsAthletics website
-- Run this in your Supabase SQL Editor

-- 1. Add missing product_id column to order_items table
ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS product_id TEXT;

-- 2. Update existing records to have a default product_id if they don't have one
UPDATE order_items 
SET product_id = 'unknown-' || id::text 
WHERE product_id IS NULL;

-- 3. Make product_id NOT NULL after updating existing records
ALTER TABLE order_items 
ALTER COLUMN product_id SET NOT NULL;

-- 4. Verify the table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'order_items' 
ORDER BY ordinal_position;

-- 5. Check if there are any existing orders that need fixing
SELECT COUNT(*) as total_orders FROM orders;
SELECT COUNT(*) as total_order_items FROM order_items;
