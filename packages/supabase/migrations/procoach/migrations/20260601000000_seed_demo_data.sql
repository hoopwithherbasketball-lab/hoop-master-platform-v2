-- ============================================================
-- Seed Data — Demo data for hoop-master-platform-v2
-- Run AFTER all other migrations have been applied.
-- ============================================================

-- ======== SERVICE OFFERS ========
INSERT INTO service_offers (slug, name, category, description, price_cents, active) VALUES
  ('profile-optimizer', 'Profile Optimizer', 'recruiting', 'Full profile review and optimization for college recruiting visibility', 14900, true),
  ('highlight-film', 'Highlight Film Editing', 'media', 'Professional highlight film editing and production', 29900, true),
  ('recruiting-audit', 'Recruiting Readiness Audit', 'recruiting', 'Comprehensive audit of your recruiting readiness with action plan', 9900, true),
  ('one-pager', 'Recruiting One-Pager', 'marketing', 'Professional one-page recruiting resume for coaches', 7900, true),
  ('college-camp', 'College Camp Package', 'events', 'Curated college camp recommendations and preparation', 19900, true),
  ('social-media-kit', 'Social Media Kit', 'marketing', 'Branded social media templates and strategy guide', 12900, true)
ON CONFLICT (slug) DO NOTHING;

-- ======== LEADS ========
INSERT INTO leads (first_name, last_name, email, phone, source, interest, status) VALUES
  ('Sarah', 'Johnson', 'sarah.j@example.com', '555-0101', 'instagram', 'Profile Optimization', 'new'),
  ('Marcus', 'Williams', 'marcus.w@example.com', '555-0102', 'website', 'Highlight Film', 'contacted'),
  ('Aisha', 'Brown', 'aisha.b@example.com', '555-0103', 'referral', 'Recruiting Audit', 'qualified'),
  ('Jaylen', 'Davis', 'jaylen.d@example.com', '555-0104', 'twitter', 'Full Package', 'booked'),
  ('Mia', 'Garcia', 'mia.g@example.com', '555-0105', 'website', 'One-Pager', 'won'),
  ('Tyler', 'Miller', 'tyler.m@example.com', '555-0106', 'instagram', 'Profile Optimization', 'nurture'),
  ('Zoe', 'Anderson', 'zoe.a@example.com', '555-0107', 'event', 'Highlight Film', 'new'),
  ('DeAndre', 'Thomas', 'd.thomas@example.com', '555-0108', 'referral', 'College Camp', 'contacted')
ON CONFLICT DO NOTHING;

-- ======== NIL COMPANIES ========
INSERT INTO nil_companies (name, category, stage, logo_url, website, description) VALUES
  ('Gatorade', 'sports_nutrition', 'active', 'https://placehold.co/200x200/0134BD/ffffff?text=G', 'https://gatorade.com', 'Official sports nutrition partner for elite athletes'),
  ('Nike', 'apparel', 'negotiation', 'https://placehold.co/200x200/0134BD/ffffff?text=N', 'https://nike.com', 'Premium athletic apparel and footwear brand'),
  ('State Farm', 'insurance', 'outreach', 'https://placehold.co/200x200/0134BD/ffffff?text=SF', 'https://statefarm.com', 'Insurance and financial services for athletes'),
  ('Powerade', 'sports_nutrition', 'matched', 'https://placehold.co/200x200/0134BD/ffffff?text=PA', 'https://powerade.com', 'Sports hydration brand'),
  ('Under Armour', 'apparel', 'prospecting', 'https://placehold.co/200x200/0134BD/ffffff?text=UA', 'https://underarmour.com', 'Performance athletic apparel'),
  ('AT&T', 'telecommunications', 'active', 'https://placehold.co/200x200/0134BD/ffffff?text=A', 'https://att.com', 'Telecommunications and media company')
ON CONFLICT DO NOTHING;

-- ======== NIL OPPORTUNITIES ========
INSERT INTO nil_opportunities (athlete_name, brand, value_cents, status) VALUES
  ('Sarah Johnson', 'Gatorade', 500000, 'active'),
  ('Marcus Williams', 'Nike', 250000, 'negotiation'),
  ('Aisha Brown', 'State Farm', 150000, 'review'),
  ('Jaylen Davis', 'Powerade', 300000, 'matched'),
  ('Mia Garcia', 'Under Armour', 200000, 'completed'),
  ('Zoe Anderson', 'AT&T', 400000, 'active')
ON CONFLICT DO NOTHING;

-- ======== NIL TASKS ========
INSERT INTO nil_tasks (title, target, priority, status, due_date) VALUES
  ('Review Gatorade contract terms', 'Sarah Johnson', 'high', 'in_progress', '2026-06-05'),
  ('Submit Nike compliance documents', 'Marcus Williams', 'high', 'todo', '2026-06-07'),
  ('Schedule State Farm call', 'Aisha Brown', 'medium', 'todo', '2026-06-10'),
  ('Film social media content for Powerade', 'Jaylen Davis', 'medium', 'completed', '2026-06-01'),
  ('Update athlete portfolio for Under Armour', 'Mia Garcia', 'low', 'completed', '2026-05-28'),
  ('Prepare AT&T campaign pitch deck', 'Zoe Anderson', 'high', 'in_progress', '2026-06-03')
ON CONFLICT DO NOTHING;

-- ======== NIL COMPLIANCE ITEMS ========
INSERT INTO nil_compliance_items (athlete_name, opportunity_name, items, status) VALUES
  ('Sarah Johnson', 'Gatorade Partnership', '{"contract_reviewed", "disclosure_posted", "tax_document_submitted"}', 'approved'),
  ('Marcus Williams', 'Nike Endorsement', '{"contract_reviewed", "compliance_form_pending"}', 'pending'),
  ('Aisha Brown', 'State Farm Ambassador', '{"disclosure_posted"}', 'pending'),
  ('Jaylen Davis', 'Powerade Sponsorship', '{"contract_reviewed", "disclosure_posted", "content_approved"}', 'approved')
ON CONFLICT DO NOTHING;

-- ======== COMMUNITY POSTS ========
-- These require an existing auth user. Replace the author_id with a real user ID after signup.
-- For demo purposes, we use a placeholder UUID. Update after creating a real user.
DO $$
DECLARE
  demo_user_id uuid := '00000000-0000-0000-0000-000000000001';
BEGIN
  -- Only insert if no community posts exist yet
  IF (SELECT count(*) FROM community_posts) = 0 THEN
    INSERT INTO community_posts (author_id, author_name, author_role, content, image_url, like_count, comment_count) VALUES
      (demo_user_id, 'Coach Thompson', 'coach', 'Excited to announce our summer showcase camp! Applications open now for 2026-27 recruits. DM for details.', 'https://placehold.co/800x400/0134BD/ffffff?text=Summer+Showcase', 24, 8),
      (demo_user_id, 'Sarah Johnson', 'player', 'Just completed my profile optimization session with Hoop With Her. My recruiting visibility has already improved! Highly recommend.', 'https://placehold.co/800x400/0134BD/ffffff?text=Profile+Done', 42, 12),
      (demo_user_id, 'Marcus Williams', 'player', 'Great workout session today. Focused on my crossover and finishing at the rim. Film coming soon!', 'https://placehold.co/800x400/0134BD/ffffff?text=Workout+Day', 31, 5),
      (demo_user_id, 'Aisha Brown', 'parent', 'Thank you to the Hoop With Her team for helping my daughter navigate the recruiting process. The audit was eye-opening.', '', 18, 3),
      (demo_user_id, 'Coach Davis', 'coach', 'Looking for point guards in the class of 2027. Must have strong academics and court vision. Reach out if interested.', 'https://placehold.co/800x400/0134BD/ffffff?text=Recruiting', 15, 7);
  END IF;
END $$;

-- ======== TRAINING VIDEOS ========
INSERT INTO training_videos (title, description, category, level, duration_minutes, thumbnail_url, video_url, lesson_count) VALUES
  ('Elite Ball Handling Drills', 'Advanced ball handling drills for guards looking to improve their handle under pressure', 'ball_handling', 'advanced', 45, 'https://placehold.co/640x360/0134BD/ffffff?text=Ball+Handling', 'https://storage.example.com/training/ball-handling-advanced.mp4', 8),
  ('Shooting Form Fundamentals', 'Break down the mechanics of a perfect jump shot from release to follow-through', 'shooting', 'beginner', 30, 'https://placehold.co/640x360/0134BD/ffffff?text=Shooting+Form', 'https://storage.example.com/training/shooting-fundamentals.mp4', 6),
  ('Defensive Slide Mastery', 'Improve lateral quickness and defensive positioning with these game-speed drills', 'defense', 'intermediate', 35, 'https://placehold.co/640x360/0134BD/ffffff?text=Defense', 'https://storage.example.com/training/defensive-slides.mp4', 7),
  ('Post Moves for Guards', 'Unorthodox post moves that give guards an advantage in mismatches', 'post_play', 'intermediate', 40, 'https://placehold.co/640x360/0134BD/ffffff?text=Post+Moves', 'https://storage.example.com/training/post-moves-guards.mp4', 5),
  ('Game Film Breakdown: Point Guard Reads', 'Learn to read defenses like a D1 point guard with real game film analysis', 'basketball_iq', 'advanced', 55, 'https://placehold.co/640x360/0134BD/ffffff?text=Film+Study', 'https://storage.example.com/training/pg-reads.mp4', 10),
  ('Conditioning for Basketball', 'Sport-specific conditioning program to build stamina for the full 32 minutes', 'conditioning', 'beginner', 25, 'https://placehold.co/640x360/0134BD/ffffff?text=Conditioning', 'https://storage.example.com/training/conditioning.mp4', 4),
  ('Triple Threat Position Mastery', 'Master the triple threat position — jab steps, shot fakes, and first step explosion', 'fundamentals', 'beginner', 20, 'https://placehold.co/640x360/0134BD/ffffff?text=Triple+Threat', 'https://storage.example.com/training/triple-threat.mp4', 5),
  ('Pick and Roll Reads', 'Advanced pick and roll reads for guards — short roll, pocket pass, and reject', 'basketball_iq', 'advanced', 50, 'https://placehold.co/640x360/0134BD/ffffff?text=PnR+Reads', 'https://storage.example.com/training/pnr-reads.mp4', 9)
ON CONFLICT DO NOTHING;

-- ======== TOURNAMENTS ========
INSERT INTO tournaments (title, description, location, address, start_date, end_date, registration_deadline, entry_fee, max_teams, current_teams, age_groups, divisions, format, prize_description, image_url, registration_link, status, featured) VALUES
  ('Hoop With Her Summer Showdown', 'Premier girls basketball summer tournament featuring top AAU programs', 'Atlanta Convention Center', '200 Andrew Young International Blvd NW, Atlanta, GA 30303', '2026-07-15', '2026-07-17', '2026-07-01', 35000, 32, 24, '{"14U", "16U", "17U"}', '{"Elite", "Competitive", "Development"}', 'Pool play into single elimination', 'Trophies + $5,000 scholarship fund', 'https://placehold.co/800x400/0134BD/ffffff?text=Summer+Showdown', 'https://hoopwithher.com/tournaments/summer-showdown', 'published', true),
  ('Fall Classic Invitational', 'End-of-season invitational tournament for varsity programs', 'Sports Complex of Georgia', '1200 Sports Way, Buford, GA 30519', '2026-11-20', '2026-11-22', '2026-11-05', 25000, 24, 18, '{"15U", "17U"}', '{"Open"}', 'Bracket play', '$2,000 scholarship fund', 'https://placehold.co/800x400/0134BD/ffffff?text=Fall+Classic', 'https://hoopwithher.com/tournaments/fall-classic', 'published', false)
ON CONFLICT DO NOTHING;

-- ======== EVENTS ========
INSERT INTO events (title, description, event_type, location, address, start_date, end_date, price, max_participants, current_participants, image_url, registration_link, age_groups, status, featured, is_active) VALUES
  ('Recruiting 101 Workshop', 'Learn the fundamentals of the college recruiting process from former D1 coaches', 'workshop', 'Hoop With Her Training Center', '500 Peachtree St, Atlanta, GA 30308', '2026-06-15', '2026-06-15', 0, 50, 32, 'https://placehold.co/800x400/0134BD/ffffff?text=Recruiting+101', 'https://hoopwithher.com/events/recruiting-101', '{"9th-12th Grade"}', 'published', true, true),
  ('Elite Skills Camp', 'Intensive 3-day skills development camp with college-level coaching staff', 'camp', 'Georgia Tech Athletic Facility', '150 Bobby Dodd Way NW, Atlanta, GA 30332', '2026-07-08', '2026-07-10', 29900, 60, 45, 'https://placehold.co/800x400/0134BD/ffffff?text=Skills+Camp', 'https://hoopwithher.com/events/skills-camp', '{"12U", "14U", "16U"}', 'published', true, true),
  ('College Coach Meet & Greet', 'Intimate networking event with college coaches from D1, D2, and D3 programs', 'showcase', 'Hoop With Her Training Center', '500 Peachtree St, Atlanta, GA 30308', '2026-08-20', '2026-08-20', 5000, 100, 67, 'https://placehold.co/800x400/0134BD/ffffff?text=Coach+Meet', 'https://hoopwithher.com/events/coach-meet-greet', '{"14U", "16U", "17U"}', 'published', false, true)
ON CONFLICT DO NOTHING;

-- ======== SITE CONTENT (Landing Page) ========
INSERT INTO site_content (page, section, content) VALUES
  ('home', 'hero_title', 'Empowering the Next Generation of Women''s Basketball'),
  ('home', 'hero_subtitle', 'Recruiting tools, player development, and community for serious athletes'),
  ('home', 'cta_text', 'Start Your Journey'),
  ('home', 'features_title', 'Everything You Need to Get Recruited'),
  ('services', 'page_title', 'Our Services'),
  ('services', 'subtitle', 'Professional recruiting and development services tailored for you')
ON CONFLICT DO NOTHING;

-- ======== MEDIA CHANNELS ========
INSERT INTO media_channels (slug, name, description, channel_type, status, branding, is_public) VALUES
  ('hoop-with-her-live', 'Hoop With Her Live', 'Live coverage of events, games, and showcases featuring elite girls basketball talent', 'live', 'active', '{"logo_url": "", "primary_color": "#0134BD", "secondary_color": "#ffffff", "font_family": "Inter"}', true),
  ('skills-showcase', 'Skills Showcase', '24/7 channel featuring the best skills drills, training sessions, and player highlights', 'linear', 'active', '{"logo_url": "", "primary_color": "#ff6b35", "secondary_color": "#ffffff", "font_family": "Inter"}', true),
  ('recruiting-tips', 'Recruiting Tips', 'On-demand content covering recruiting strategies, college prep, and player development', 'vod', 'active', '{"logo_url": "", "primary_color": "#10b981", "secondary_color": "#ffffff", "font_family": "Inter"}', true),
  ('game-film-room', 'Game Film Room', 'Breakdowns of game film, play analysis, and coaching insights from top programs', 'linear', 'active', '{"logo_url": "", "primary_color": "#8b5cf6", "secondary_color": "#ffffff", "font_family": "Inter"}', true)
ON CONFLICT (slug) DO NOTHING;

-- ======== MEDIA ASSETS ========
INSERT INTO media_assets (title, description, duration_seconds, storage_path, thumbnail_url, status, category, tags) VALUES
  ('Elite Ball Handling Drills', 'Advanced ball handling drills for guards looking to improve their handle under pressure', 2700, 'https://storage.example.com/training/ball-handling-advanced.mp4', 'https://placehold.co/640x360/0134BD/ffffff?text=Ball+Handling', 'ready', 'training', '{"drills", "ball-handling", "advanced"}'),
  ('Shooting Form Fundamentals', 'Break down the mechanics of a perfect jump shot from release to follow-through', 1800, 'https://storage.example.com/training/shooting-fundamentals.mp4', 'https://placehold.co/640x360/0134BD/ffffff?text=Shooting', 'ready', 'training', '{"shooting", "fundamentals", "beginner"}'),
  ('Defensive Slide Mastery', 'Improve lateral quickness and defensive positioning with game-speed drills', 2100, 'https://storage.example.com/training/defensive-slides.mp4', 'https://placehold.co/640x360/0134BD/ffffff?text=Defense', 'ready', 'training', '{"defense", "footwork", "intermediate"}'),
  ('Game Film Breakdown: Point Guard Reads', 'Learn to read defenses like a D1 point guard with real game film analysis', 3300, 'https://storage.example.com/training/pg-reads.mp4', 'https://placehold.co/640x360/0134BD/ffffff?text=Film+Study', 'ready', 'film', '{"film-study", "basketball-iq", "advanced"}'),
  ('Summer Showcase Highlights 2025', 'Best plays from the 2025 Summer Showcase featuring top prospects', 1200, 'https://storage.example.com/highlights/summer-showcase-2025.mp4', 'https://placehold.co/640x360/0134BD/ffffff?text=Highlights', 'ready', 'highlight', '{"highlights", "showcase", "2025"}'),
  ('Recruiting 101: What Coaches Look For', 'Comprehensive guide on what college coaches look for in recruits', 2400, 'https://storage.example.com/recruiting/recruiting-101.mp4', 'https://placehold.co/640x360/0134BD/ffffff?text=Recruiting', 'ready', 'recruiting', '{"recruiting", "guide", "college"}'),
  ('Post Moves for Guards', 'Unorthodox post moves that give guards an advantage in mismatches', 2400, 'https://storage.example.com/training/post-moves-guards.mp4', 'https://placehold.co/640x360/0134BD/ffffff?text=Post+Moves', 'ready', 'training', '{"post-play", "guards", "intermediate"}'),
  ('Conditioning for Basketball', 'Sport-specific conditioning program to build stamina for the full 32 minutes', 1500, 'https://storage.example.com/training/conditioning.mp4', 'https://placehold.co/640x360/0134BD/ffffff?text=Conditioning', 'ready', 'training', '{"conditioning", "fitness", "beginner"}')
ON CONFLICT DO NOTHING;

-- ======== CHANNEL SCHEDULES (sample for linear channels) ========
DO $$
DECLARE
  showcase_id uuid;
  skills_id uuid;
  asset1 uuid;
  asset2 uuid;
  asset3 uuid;
  asset4 uuid;
BEGIN
  SELECT id INTO showcase_id FROM media_channels WHERE slug = 'skills-showcase';
  SELECT id INTO skills_id FROM media_channels WHERE slug = 'game-film-room';

  SELECT id INTO asset1 FROM media_assets WHERE title = 'Elite Ball Handling Drills' LIMIT 1;
  SELECT id INTO asset2 FROM media_assets WHERE title = 'Shooting Form Fundamentals' LIMIT 1;
  SELECT id INTO asset3 FROM media_assets WHERE title = 'Defensive Slide Mastery' LIMIT 1;
  SELECT id INTO asset4 FROM media_assets WHERE title = 'Game Film Breakdown: Point Guard Reads' LIMIT 1;

  IF showcase_id IS NOT NULL AND asset1 IS NOT NULL AND asset2 IS NOT NULL AND asset3 IS NOT NULL THEN
    INSERT INTO channel_schedules (channel_id, asset_id, scheduled_start, scheduled_end, position, repeat_rule) VALUES
      (showcase_id, asset1, now(), now() + interval '45 minutes', 0, 'daily'),
      (showcase_id, asset2, now() + interval '45 minutes', now() + interval '1 hour 15 minutes', 1, 'daily'),
      (showcase_id, asset3, now() + interval '1 hour 15 minutes', now() + interval '1 hour 50 minutes', 2, 'daily');
  END IF;

  IF skills_id IS NOT NULL AND asset4 IS NOT NULL AND asset1 IS NOT NULL THEN
    INSERT INTO channel_schedules (channel_id, asset_id, scheduled_start, scheduled_end, position, repeat_rule) VALUES
      (skills_id, asset4, now(), now() + interval '55 minutes', 0, 'daily'),
      (skills_id, asset1, now() + interval '55 minutes', now() + interval '1 hour 40 minutes', 1, 'daily');
  END IF;
END $$;
