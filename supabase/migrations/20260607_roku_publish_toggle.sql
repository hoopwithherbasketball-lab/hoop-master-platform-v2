-- Add publish_to_roku column to media_assets
ALTER TABLE media_assets 
ADD COLUMN publish_to_roku BOOLEAN DEFAULT false;

-- Create an index to optimize Roku API feed queries
CREATE INDEX idx_media_assets_roku ON media_assets(publish_to_roku) WHERE publish_to_roku = true;
