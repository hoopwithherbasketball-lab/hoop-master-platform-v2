-- Add profile image URL to player_profiles
ALTER TABLE player_profiles ADD COLUMN IF NOT EXISTS profile_image_url text;

-- Add steps and notes to nil_tasks
ALTER TABLE nil_tasks ADD COLUMN IF NOT EXISTS steps jsonb DEFAULT '[]'::jsonb;
ALTER TABLE nil_tasks ADD COLUMN IF NOT EXISTS notes text;

-- RLS: profile_image_url is covered by existing player_profiles policies
-- RLS: steps/notes covered by existing nil_tasks policies
