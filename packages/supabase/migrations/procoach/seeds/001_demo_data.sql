-- Demo Seed Data
-- Run this in Supabase Dashboard -> SQL Editor
-- This seeds demo records so admin dashboards show real content

-- === LEADS ===
INSERT INTO leads (lead_type, first_name, last_name, email, phone, source, interest, status) VALUES
  ('player', 'Aaliyah', 'Johnson', 'aaliyah.j@email.com', '555-0101', 'instagram', 'Player Development Program', 'new'),
  ('player', 'Maya', 'Williams', 'maya.w@email.com', '555-0102', 'referral', 'College Recruiting Package', 'contacted'),
  ('parent', 'Sarah', 'Chen', 'sarah.c@email.com', '555-0103', 'google', 'Youth Skills Clinic', 'qualified'),
  ('player', 'Jasmine', 'Brown', 'jasmine.b@email.com', '555-0104', 'facebook', 'Elite Training Camp', 'booked'),
  ('coach', 'Coach', 'Davis', 'davis.hs@email.com', '555-0105', 'email', 'Team Training Package', 'nurture'),
  ('player', 'Taylor', 'Miller', 'taylor.m@email.com', '555-0106', 'tiktok', 'Player Development Program', 'new'),
  ('player', 'Destiny', 'Wilson', 'destiny.w@email.com', '555-0107', 'instagram', 'College Recruiting Package', 'won'),
  ('player', 'Kennedy', 'Moore', 'kennedy.m@email.com', '555-0108', 'referral', 'Elite Training Camp', 'lost'),
  ('parent', 'Lisa', 'Anderson', 'lisa.a@email.com', '555-0109', 'google', 'Youth Skills Clinic', 'new'),
  ('player', 'Sydney', 'Taylor', 'sydney.t@email.com', '555-0110', 'event', 'College Recruiting Package', 'qualified')
ON CONFLICT DO NOTHING;

-- === SERVICE OFFERS ===
INSERT INTO service_offers (slug, name, category, description, price_cents, active) VALUES
  ('player-dev-bronze', 'Player Development - Bronze', 'player_dev', 'Basic skills assessment and development plan', 49900, true),
  ('player-dev-silver', 'Player Development - Silver', 'player_dev', 'Advanced skills training with film breakdown', 99900, true),
  ('player-dev-gold', 'Player Development - Gold', 'player_dev', 'Comprehensive elite training + recruiting support', 199900, true),
  ('recruiting-basic', 'Recruiting Package - Basic', 'recruiting', 'Profile creation, highlight reel, coach outreach', 79900, true),
  ('recruiting-premium', 'Recruiting Package - Premium', 'recruiting', 'Full recruiting concierge with video production', 149900, true),
  ('skills-clinic', 'Youth Skills Clinic', 'clinic', 'Weekend skills clinic for ages 10-14', 14900, true),
  ('elite-camp', 'Elite Training Camp', 'camp', 'Week-long elite training camp', 49900, true)
ON CONFLICT DO NOTHING;

-- === PLAYER PROFILES (need to be linked to real auth users or left with null user_id) ===
INSERT INTO player_profiles (first_name, last_name, display_name, class_year, grade, position, height, city, state, school_name, is_public) VALUES
  ('Aaliyah', 'Johnson', 'Aaliyah J', 2026, '11th', 'PG', '5''8"', 'Los Angeles', 'CA', 'Sierra Canyon', true),
  ('Maya', 'Williams', 'Maya W', 2027, '10th', 'SG', '5''10"', 'Dallas', 'TX', 'Duncanville', true),
  ('Jasmine', 'Brown', 'Jazzy B', 2026, '11th', 'SF', '5''11"', 'Miami', 'FL', 'Montverde Academy', true),
  ('Taylor', 'Miller', 'Tay M', 2028, '9th', 'PG', '5''6"', 'Chicago', 'IL', 'Whitney Young', true),
  ('Destiny', 'Wilson', 'Des W', 2025, '12th', 'PF', '6''1"', 'Atlanta', 'GA', 'Wheeler', true),
  ('Kennedy', 'Moore', 'Ken M', 2027, '10th', 'C', '6''3"', 'Houston', 'TX', 'Cypress Creek', true),
  ('Sydney', 'Taylor', 'Syd T', 2026, '11th', 'SG', '5''9"', 'Phoenix', 'AZ', 'Desert Vista', true),
  ('Ava', 'Grant', 'Ava G', 2026, '11th', 'SG', '5''11"', 'Los Angeles', 'CA', 'Sierra Canyon', true)
ON CONFLICT DO NOTHING;

-- === SERVICE ORDERS ===
-- Use subqueries to get real IDs from inserted data
DO $$
DECLARE
  p1 uuid; p2 uuid; p3 uuid; p4 uuid; p5 uuid;
  o1 uuid; o2 uuid; o3 uuid; o4 uuid; o5 uuid;
  offer_dev_silver uuid; offer_recruit_basic uuid; offer_dev_gold uuid; offer_clinic uuid; offer_elite uuid;
BEGIN
  SELECT id INTO p1 FROM player_profiles WHERE first_name = 'Aaliyah' AND last_name = 'Johnson' LIMIT 1;
  SELECT id INTO p2 FROM player_profiles WHERE first_name = 'Maya' AND last_name = 'Williams' LIMIT 1;
  SELECT id INTO p3 FROM player_profiles WHERE first_name = 'Jasmine' AND last_name = 'Brown' LIMIT 1;
  SELECT id INTO p4 FROM player_profiles WHERE first_name = 'Taylor' AND last_name = 'Miller' LIMIT 1;
  SELECT id INTO p5 FROM player_profiles WHERE first_name = 'Destiny' AND last_name = 'Wilson' LIMIT 1;

  SELECT id INTO offer_dev_silver FROM service_offers WHERE slug = 'player-dev-silver' LIMIT 1;
  SELECT id INTO offer_recruit_basic FROM service_offers WHERE slug = 'recruiting-basic' LIMIT 1;
  SELECT id INTO offer_dev_gold FROM service_offers WHERE slug = 'player-dev-gold' LIMIT 1;
  SELECT id INTO offer_clinic FROM service_offers WHERE slug = 'skills-clinic' LIMIT 1;
  SELECT id INTO offer_elite FROM service_offers WHERE slug = 'elite-camp' LIMIT 1;

  INSERT INTO service_orders (service_offer_id, player_profile_id, status, intake_complete, due_at) VALUES
    (offer_dev_silver, p1, 'in_progress', true, NOW() + INTERVAL '30 days'),
    (offer_recruit_basic, p2, 'awaiting_intake', false, NOW() + INTERVAL '45 days'),
    (offer_dev_gold, p3, 'new', false, NOW() + INTERVAL '60 days'),
    (offer_clinic, p4, 'complete', true, NOW() - INTERVAL '5 days'),
    (offer_elite, p5, 'in_review', true, NOW() + INTERVAL '15 days'),
    (offer_dev_silver, NULL, 'needs_assets', false, NOW() + INTERVAL '20 days'),
    (offer_recruit_basic, NULL, 'new', false, NOW() + INTERVAL '90 days')
  ON CONFLICT DO NOTHING;
END $$;
