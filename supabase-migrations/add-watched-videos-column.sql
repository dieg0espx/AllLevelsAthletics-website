-- Add watched_videos column to user_programs table
-- This stores an array of video IDs that the user has watched for each program

ALTER TABLE user_programs 
ADD COLUMN IF NOT EXISTS watched_videos integer[] DEFAULT '{}';

-- Add a comment to document the column
COMMENT ON COLUMN user_programs.watched_videos IS 'Array of video IDs that the user has completed for this program';

-- Create an index to improve query performance
CREATE INDEX IF NOT EXISTS idx_user_programs_watched_videos ON user_programs USING GIN (watched_videos);

