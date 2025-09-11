-- Update user metadata to include admin role
-- Run this in Supabase SQL Editor

-- Update the user metadata for aletxa.pascual@gmail.com
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'aletxa.pascual@gmail.com';

-- Verify the update
SELECT 
    id,
    email,
    raw_user_meta_data
FROM auth.users 
WHERE email = 'aletxa.pascual@gmail.com';