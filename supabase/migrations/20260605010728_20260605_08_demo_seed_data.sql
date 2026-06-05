
-- Demo seed data: events, service_offers, media_channels, nil_companies, training_tracks, community_posts

-- Events
INSERT INTO public.events (title, description, event_type, location, start_date, end_date, price, max_participants, current_participants, status, featured)
VALUES
  ('Elite Showcase — Summer 2026', 'Premier girls basketball showcase for 2026-2028 recruits. Attended by 50+ college coaches.', 'showcase', 'Atlanta, GA', '2026-07-18 08:00:00+00', '2026-07-19 18:00:00+00', 195.00, 120, 87, 'published', true),
  ('Skills & Film Camp', 'Intensive 2-day skills development and film session. Personalized coaching and HD highlight footage included.', 'camp', 'Charlotte, NC', '2026-08-09 09:00:00+00', '2026-08-10 17:00:00+00', 149.00, 60, 42, 'published', true),
  ('Recruiting Readiness Workshop', 'Full-day workshop covering NCAA rules, social media presence, coach outreach, and academic requirements.', 'workshop', 'Nashville, TN', '2026-09-06 10:00:00+00', '2026-09-06 17:00:00+00', 79.00, 40, 19, 'published', false),
  ('Fall Invitational Showcase', 'Regional showcase open to class 2027-2029. Scouts from HBCU and D2 programs confirmed.', 'showcase', 'Birmingham, AL', '2026-10-11 08:00:00+00', '2026-10-12 18:00:00+00', 175.00, 100, 0, 'published', false)
ON CONFLICT DO NOTHING;

-- Service offers
INSERT INTO public.service_offers (slug, name, category, description, price_cents, active)
VALUES
  ('recruiting-audit', 'Recruiting Profile Audit', 'evaluation', 'Comprehensive review of your recruiting profile with detailed scoring and action plan.', 19900, true),
  ('film-edit-highlight', 'Highlight Film Edit', 'media', '2-3 minute college-ready highlight reel edited from your raw footage.', 29900, true),
  ('nil-readiness', 'NIL Readiness Package', 'nil', 'Social audit, brand guide, and compliance checklist for NIL opportunities.', 14900, true),
  ('one-pager', 'Player One-Pager', 'marketing', 'Designed, printable one-pager for coaches. Includes stats, photo, and contact.', 9900, true),
  ('coaching-session', '1-on-1 Coaching Session', 'coaching', '60-minute virtual or in-person session with a GBB-certified coach.', 7500, true)
ON CONFLICT (slug) DO NOTHING;

-- Media channels
INSERT INTO public.media_channels (slug, name, description, stream_url, channel_type, is_active)
VALUES
  ('hoopwithher-tv', 'HoopWithHer TV', 'Live and on-demand girls basketball content, showcases, and training.', 'https://stream.example.com/hwh-tv', 'live', true),
  ('showcase-replays', 'Showcase Replays', 'Full game replays from GBB-hosted showcases and tournaments.', 'https://stream.example.com/replays', 'replay', true),
  ('training-vault', 'Training Vault', 'On-demand skill development videos from GBB coaches.', 'https://stream.example.com/training', 'vod', true),
  ('nil-spotlight', 'NIL Spotlight', 'Stories and interviews featuring athletes navigating NIL opportunities.', 'https://stream.example.com/nil', 'vod', true)
ON CONFLICT (slug) DO NOTHING;

-- NIL companies
INSERT INTO public.nil_companies (name, industry, contact_name, contact_email, status)
VALUES
  ('SportsSpark Apparel', 'Apparel', 'Jordan Tanner', 'jordan@sportsspark.com', 'partner'),
  ('NextGen Nutrition', 'Health & Wellness', 'Aisha Brooks', 'aisha@nextgennutrition.com', 'prospect'),
  ('Court Vision Media', 'Media & Production', 'Marcus Wells', 'marcus@courtvision.media', 'partner'),
  ('Campus Connect', 'Education Tech', 'Priya Sharma', 'priya@campusconnect.io', 'negotiating'),
  ('Elite Hoops Gear', 'Equipment', 'Dana Rivera', 'dana@elitehoopsgear.com', 'outreach')
ON CONFLICT DO NOTHING;

-- Training tracks
INSERT INTO public.training_tracks (title, description, category, level, duration_weeks, is_active)
VALUES
  ('Ball Handling Fundamentals', 'Master dribbling, handles, and change-of-direction moves used in college and pro play.', 'skills', 'beginner', 4, true),
  ('Shooting System', 'Develop a consistent shooting form with film analysis and progressive drill sequences.', 'skills', 'intermediate', 6, true),
  ('Recruiting Roadmap', 'Step-by-step guide to building your recruiting profile, outreach strategy, and visit prep.', 'recruiting', 'beginner', 8, true),
  ('NIL for Athletes', 'Understand NIL rules, build your brand, and identify partnership opportunities.', 'nil', 'beginner', 4, true),
  ('Leadership & Mindset', 'Develop captain-level leadership skills, coachability, and competitive mindset.', 'development', 'intermediate', 5, true)
ON CONFLICT DO NOTHING;
