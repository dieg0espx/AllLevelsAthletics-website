-- Create programs table for managing training programs
CREATE TABLE IF NOT EXISTS programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) DEFAULT 0,
  duration TEXT, -- e.g., "4 weeks", "8 weeks", "3 months"
  category TEXT, -- e.g., "Strength Training", "Weight Loss", "Mobility"
  level TEXT DEFAULT 'beginner', -- beginner, intermediate, advanced
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_programs_is_active ON programs(is_active);
CREATE INDEX IF NOT EXISTS idx_programs_category ON programs(category);
CREATE INDEX IF NOT EXISTS idx_programs_level ON programs(level);

-- Add RLS policies
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

-- Allow admins to do everything
CREATE POLICY "Admins can do everything with programs"
  ON programs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Allow all users to view active programs
CREATE POLICY "Anyone can view active programs"
  ON programs
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Insert Tension Release Program (real program with real clients - 18 video modules)
INSERT INTO programs (name, description, price, duration, category, level, is_active) VALUES
  ('Tension Release Program', 'Premium program with 18 video modules for tension release and performance enhancement. Complete body tension release system covering glutes, back, hips, legs, and recovery techniques.', 297, '18 modules', 'Recovery', 'beginner', true)
ON CONFLICT DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_programs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS programs_updated_at_trigger ON programs;
CREATE TRIGGER programs_updated_at_trigger
  BEFORE UPDATE ON programs
  FOR EACH ROW
  EXECUTE FUNCTION update_programs_updated_at();

COMMENT ON TABLE programs IS 'Master table for all training programs available in the system';
COMMENT ON COLUMN programs.name IS 'Display name of the program';
COMMENT ON COLUMN programs.description IS 'Detailed description of what the program offers';
COMMENT ON COLUMN programs.price IS 'Price in USD';
COMMENT ON COLUMN programs.duration IS 'Duration description (e.g., "8 weeks", "3 months")';
COMMENT ON COLUMN programs.category IS 'Program category for filtering';
COMMENT ON COLUMN programs.level IS 'Difficulty level: beginner, intermediate, or advanced';
COMMENT ON COLUMN programs.is_active IS 'Whether the program is currently available for enrollment';

