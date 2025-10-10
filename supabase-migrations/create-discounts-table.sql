-- Create discounts table for storing site-wide discount settings
CREATE TABLE IF NOT EXISTS public.discounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  discount_type VARCHAR(50) NOT NULL, -- 'coaching' or 'products'
  discount_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00, -- percentage discount (0-100)
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  CONSTRAINT valid_discount_percentage CHECK (discount_percentage >= 0 AND discount_percentage <= 100)
);

-- Create unique index to ensure only one active discount per type
CREATE UNIQUE INDEX IF NOT EXISTS idx_active_discount_type ON public.discounts (discount_type, is_active) 
WHERE is_active = true;

-- Enable Row Level Security
ALTER TABLE public.discounts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow public read access to discounts" ON public.discounts;
DROP POLICY IF EXISTS "Allow admin full access to discounts" ON public.discounts;

-- Allow anyone to read discounts (needed for public price display)
CREATE POLICY "Allow public read access to discounts"
  ON public.discounts
  FOR SELECT
  TO public
  USING (is_active = true);

-- Only admins can insert/update/delete discounts
CREATE POLICY "Allow admin full access to discounts"
  ON public.discounts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Insert default discount values
INSERT INTO public.discounts (discount_type, discount_percentage, is_active)
VALUES 
  ('coaching', 0.00, true),
  ('products', 0.00, true)
ON CONFLICT DO NOTHING;

-- Add comment to table
COMMENT ON TABLE public.discounts IS 'Stores site-wide discount settings for coaching packages and products';

