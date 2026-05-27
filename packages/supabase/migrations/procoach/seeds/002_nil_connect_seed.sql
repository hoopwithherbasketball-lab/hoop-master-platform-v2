-- NIL and ConnectGBB demo seed data
-- Run in Supabase Dashboard -> SQL Editor after creating the tables

-- === NIL COMPANIES ===
INSERT INTO nil_companies (name, category, stage, description) VALUES
  ('Rise Sports', 'Apparel', 'prospecting', 'Premium basketball apparel brand seeking athlete ambassadors'),
  ('Athlete Fuel', 'Nutrition', 'matched', 'Sports nutrition company focused on plant-based supplements'),
  ('Court Vision', 'Training', 'outreach', 'Basketball training technology and analytics platform'),
  ('Gatorade', 'Beverage', 'negotiation', 'Major sports drink brand with NIL ambassador program'),
  ('Nike', 'Apparel', 'active', 'Global sportswear brand with elite athlete partnerships'),
  ('Hoops Nutrition', 'Nutrition', 'matched', 'Nutrition education and meal planning for athletes')
ON CONFLICT DO NOTHING;

-- === NIL OPPORTUNITIES ===
INSERT INTO nil_opportunities (athlete_name, brand, value_cents, status) VALUES
  ('Sarah Jenkins', 'Gatorade', 4500000, 'negotiation'),
  ('Maya Thompson', 'Nike', 6200000, 'review'),
  ('Jordan Lee', 'Hoops Nutrition', 180000, 'matched'),
  ('Ava Grant', 'Rise Sports', 2500000, 'negotiation'),
  ('Destiny Wilson', 'Athlete Fuel', 900000, 'active')
ON CONFLICT DO NOTHING;

-- === NIL OUTREACH ===
INSERT INTO nil_outreach (from_entity, subject, body, status) VALUES
  ('Gatorade', 'Partnership interest', 'We are interested in discussing an NIL partnership.', 'open'),
  ('Nike', 'Sponsorship package review', 'Please review the attached sponsorship proposal.', 'pending'),
  ('Hoops Nutrition', 'Contract terms', 'Here are the updated contract terms for your review.', 'replied')
ON CONFLICT DO NOTHING;

-- === NIL COMPLIANCE ITEMS ===
INSERT INTO nil_compliance_items (athlete_name, opportunity_name, items, status) VALUES
  ('Sarah Jenkins', 'Nike Summer Series', ARRAY['Disclosure','Contract'], 'pending'),
  ('Maya Thompson', 'Red Bull Promo', ARRAY['Institutional Policy'], 'pending'),
  ('Jordan Lee', 'Local Cafe Deal', ARRAY['Tax Notice'], 'error')
ON CONFLICT DO NOTHING;

-- === NIL TASKS ===
INSERT INTO nil_tasks (title, target, priority, status, due_date) VALUES
  ('Research Local Beverage Brands', 'Company', 'medium', 'todo', NOW() + INTERVAL '7 days'),
  ('Update Sarah Media Kit', 'Sarah Jenkins', 'high', 'todo', NOW()),
  ('Nike Contract Review', 'Compliance', 'urgent', 'in_progress', NOW() + INTERVAL '1 day'),
  ('Initial Email to Gatorade', 'Outreach', 'low', 'completed', NOW() - INTERVAL '2 days')
ON CONFLICT DO NOTHING;

-- === NIL ATHLETE PROFILES (links to player_profiles by name subquery) ===
DO $$
DECLARE
  p1 uuid; p2 uuid; p3 uuid;
BEGIN
  SELECT id INTO p1 FROM player_profiles WHERE first_name = 'Aaliyah' AND last_name = 'Johnson' LIMIT 1;
  SELECT id INTO p2 FROM player_profiles WHERE first_name = 'Maya' AND last_name = 'Williams' LIMIT 1;
  SELECT id INTO p3 FROM player_profiles WHERE first_name = 'Jordan' AND last_name = 'Something' LIMIT 1;

  -- Only insert if we found the referenced profile
  IF p1 IS NOT NULL THEN
    INSERT INTO nil_athlete_profiles (player_profile_id, display_name, position, class_year, followers, readiness_score, tier) VALUES
      (p1, 'Sarah Jenkins', 'PG', 2026, '12.4K', 88, 'gold')
    ON CONFLICT DO NOTHING;
  END IF;
  IF p2 IS NOT NULL THEN
    INSERT INTO nil_athlete_profiles (player_profile_id, display_name, position, class_year, followers, readiness_score, tier) VALUES
      (p2, 'Maya Thompson', 'SG/SF', 2027, '8.1K', 74, 'silver')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- === TRAINING VIDEOS ===
INSERT INTO training_videos (title, description, category, level, duration_minutes, lesson_count) VALUES
  ('Ball Handling Fundamentals', 'Master the basics of dribbling and ball control', 'ball_handling', 'beginner', 25, 4),
  ('Advanced Shooting Mechanics', 'Perfect your shooting form with pro techniques', 'shooting', 'advanced', 35, 6),
  ('On-Ball Defense Drills', 'Become a lockdown defender with these drills', 'defense', 'intermediate', 20, 3),
  ('Explosive First Step', 'Develop a quick first step to beat your defender', 'skill', 'intermediate', 15, 2),
  ('Strength Training for Guards', 'Build functional strength for perimeter players', 'strength', 'intermediate', 30, 5),
  ('Film Study: Reading Defenses', 'Learn to recognize defensive sets and adjust', 'film', 'advanced', 40, 8),
  ('Recruiting 101', 'Understand the recruiting process and timeline', 'recruiting', 'beginner', 20, 4),
  ('NIL Brand Building', 'Build your personal brand for NIL opportunities', 'recruiting', 'intermediate', 25, 5)
ON CONFLICT DO NOTHING;
