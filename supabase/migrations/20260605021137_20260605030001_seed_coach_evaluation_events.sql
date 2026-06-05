
INSERT INTO events (title, event_type, location, start_date, end_date, status, is_active)
VALUES
  ('Adidas Earn Your Stripes', 'evaluation', 'Rock Hill, SC', '2026-04-25', '2026-04-26', 'published', true),
  ('Beast of the East', 'evaluation', 'Greensboro, NC', '2026-05-15', '2026-05-17', 'published', true),
  ('PXB Showcase', 'evaluation', 'Bermuda Run, NC', '2026-05-30', '2026-05-31', 'published', true),
  ('Big Shots Spring Nationals', 'evaluation', 'Rock Hill, SC', '2026-06-06', '2026-06-07', 'published', true),
  ('Phenom Hoops Summer Nationals', 'live_period', 'Bermuda Run, NC', '2026-07-10', '2026-07-12', 'published', true),
  ('Adidas 3SSB Palmetto Championships', 'live_period', 'Rock Hill, SC', '2026-07-24', '2026-07-27', 'published', true)
ON CONFLICT DO NOTHING;
