-- ============================================================
-- Hotel Shuktara — Complete Supabase Schema & Seed Data
-- Paste & run this entire script in Supabase SQL Editor
-- ============================================================

-- 1. Rooms table
create table if not exists rooms (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text unique,
  description text,
  price       numeric default 3500,
  status      text default 'published',
  category    text default 'standard',
  amenities   text[],
  image       text,
  sort_order  int default 0,
  created_at  timestamptz default now()
);

-- Ensure sort_order column exists if table was created previously
alter table rooms add column if not exists sort_order int default 0;

-- 2. Homepage settings (always single row, id=1)
create table if not exists homepage_settings (
  id          int primary key default 1,
  hero        jsonb default '{}',
  experiences jsonb default '{}',
  rasun       jsonb default '{}',
  banquet     jsonb default '{}',
  skylight    jsonb default '{}',
  contact     jsonb default '{}'
);

-- Ensure rasun, banquet, skylight & contact columns exist if homepage_settings was created previously
alter table homepage_settings add column if not exists rasun jsonb default '{}';
alter table homepage_settings add column if not exists banquet jsonb default '{}';
alter table homepage_settings add column if not exists skylight jsonb default '{}';
alter table homepage_settings add column if not exists contact jsonb default '{}';

-- 3. Bookings table
create table if not exists bookings (
  id              text primary key,
  full_name       text,
  email           text,
  phone           text,
  room_preference text,
  check_in        date,
  check_out       date,
  num_rooms       int default 1,
  num_guests      int default 1,
  status          text default 'Pending',
  message         text,
  created_at      timestamptz default now()
);

-- 4. Storage bucket for images (public)
insert into storage.buckets (id, name, public)
values ('hotel-images', 'hotel-images', true)
on conflict (id) do nothing;

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

alter table rooms enable row level security;
drop policy if exists "Public read rooms" on rooms;
drop policy if exists "Auth write rooms" on rooms;
create policy "Public read rooms"  on rooms for select using (true);
create policy "Auth write rooms"   on rooms for all    using (auth.role() = 'authenticated');

alter table homepage_settings enable row level security;
drop policy if exists "Public read homepage" on homepage_settings;
drop policy if exists "Auth write homepage"  on homepage_settings;
create policy "Public read homepage" on homepage_settings for select using (true);
create policy "Auth write homepage"  on homepage_settings for all    using (auth.role() = 'authenticated');

alter table bookings enable row level security;
drop policy if exists "Public insert bookings" on bookings;
drop policy if exists "Auth manage bookings"   on bookings;
create policy "Public insert bookings" on bookings for insert with check (true);
create policy "Auth manage bookings"   on bookings for all    using (auth.role() = 'authenticated');

drop policy if exists "Public read images"  on storage.objects;
drop policy if exists "Auth upload images"  on storage.objects;
drop policy if exists "Auth delete images"  on storage.objects;
create policy "Public read images" on storage.objects
  for select using (bucket_id = 'hotel-images');
create policy "Auth upload images" on storage.objects
  for insert with check (bucket_id = 'hotel-images' and auth.role() = 'authenticated');
create policy "Auth delete images" on storage.objects
  for delete using (bucket_id = 'hotel-images' and auth.role() = 'authenticated');

-- ============================================================
-- Seed Initial Hotel Shuktara Rooms
-- ============================================================

insert into rooms (name, slug, description, price, status, category, image, amenities)
values
  (
    'Premium Triple',
    'premium-triple',
    'Spacious and ideal for families or groups seeking extra comfort with three beds, private bathroom, and room service.',
    6500,
    'published',
    'triple',
    '/images/rooms/premium-triple.png',
    array['Three Comfortable Beds', 'Private Bathroom', 'Air Conditioning', 'Flat-Screen TV', 'Complimentary Wi-Fi', 'Refrigerator', 'Minibar', '24/7 Room Service', 'Wardrobe & Storage']
  ),
  (
    'Deluxe Twin',
    'deluxe-twin',
    'Stylish and relaxing environment decorated in soothing warm tones, featuring two comfortable twin single beds.',
    4500,
    'published',
    'twin',
    '/images/rooms/deluxe-twin.png',
    array['Two Comfortable Twin Beds', 'Private Bathroom', 'Air Conditioning', 'Flat-Screen TV', 'Complimentary Wi-Fi', 'Refrigerator', 'Minibar', '24/7 Room Service', 'Wardrobe']
  ),
  (
    'Superior Twin',
    'superior-twin',
    'Finest twin rooms designed to accommodate guests with comfortable twin beds in a serene, inviting atmosphere.',
    5500,
    'published',
    'twin',
    '/images/rooms/superior-twin.png',
    array['Two Superior Twin Beds', 'Private Bathroom', 'Air Conditioning', 'Flat-Screen TV', 'Complimentary Wi-Fi', 'Refrigerator', 'Minibar', '24/7 Room Service', 'Spacious Wardrobe']
  ),
  (
    'Premium Deluxe King',
    'premium-deluxe-king',
    'Our largest and most luxurious option with plush king-sized bed, seating area, writing desk, and upscale amenities.',
    8500,
    'published',
    'king',
    '/images/rooms/premium-deluxe-king.png',
    array['King-Size Bed', 'Private Bathroom', 'Air Conditioning', 'Flat-Screen TV', 'Complimentary Wi-Fi', 'Refrigerator', 'Minibar', '24/7 Room Service', 'Spacious Wardrobe']
  ),
  (
    'Deluxe King',
    'deluxe-king',
    'Luxurious experience with stylish decor, king-sized bed, modern security, high-speed internet, and customized services.',
    5000,
    'published',
    'king',
    '/images/rooms/deluxe-king.png',
    array['King-Size Bed', 'Private Bathroom', 'Air Conditioning', 'Flat-Screen TV', 'Complimentary Wi-Fi', 'Refrigerator', 'Minibar', '24/7 Room Service', 'Spacious Wardrobe']
  ),
  (
    'Superior King',
    'superior-king',
    'Cozy and inviting atmosphere with king-size bed, private bathroom, refrigerator, flat-screen TV, and city views.',
    4200,
    'published',
    'king',
    '/images/rooms/superior-king.png',
    array['King-Size Bed', 'Private Bathroom', 'Air Conditioning', 'Flat-Screen TV', 'Complimentary Wi-Fi', 'Refrigerator', 'Spacious Wardrobe']
  ),
  (
    'Standard Single',
    'standard-single',
    'Budget-friendly yet cozy, comfortable, and secure stay with essential amenities, Wi-Fi, and desk for solo travelers.',
    3500,
    'published',
    'single',
    '/images/rooms/standard-single.png',
    array['Single Bed', 'Private Bathroom', 'Air Conditioning', 'Flat-Screen TV', 'Complimentary Wi-Fi', 'Refrigerator', 'Minibar', '24/7 Room Service', 'In-Room Wardrobe', 'On-Site Parking']
  )
on conflict (slug) do nothing;

-- ============================================================
-- Seed Homepage Hero & Experiences
-- ============================================================

insert into homepage_settings (id, hero, experiences)
values (
  1,
  '{
    "titleLine1": "WELCOME TO",
    "titleHighlight": "HOTEL SHUKTARA",
    "titleLine2": "DHAKA",
    "description": "Experience contemporary luxury infused with warm Bengali hospitality in the heart of Dhaka.",
    "backgroundImage": "/images/hero/hero-bg.jpg"
  }'::jsonb,
  '{
    "images": [
      { "id": 1, "src": "/images/experiences/experience-1.png", "caption": "Skylight Rooftop Restaurant", "alt": "Skylight Rooftop Restaurant" },
      { "id": 2, "src": "/images/experiences/experience-2.png", "caption": "Fitness & Wellness Center", "alt": "Fitness & Wellness Center" },
      { "id": 3, "src": "/images/experiences/experience-3.png", "caption": "Conference & Event Spaces", "alt": "Conference & Event Spaces" },
      { "id": 4, "src": "/images/experiences/experience-4.png", "caption": "Luxury Suite Experience", "alt": "Luxury Suite Experience" }
    ]
  }'::jsonb
)
on conflict (id) do update set
  hero = excluded.hero,
  experiences = excluded.experiences;

-- ============================================================
-- Seed Sample Bookings
-- ============================================================

insert into bookings (id, full_name, email, phone, room_preference, check_in, check_out, num_rooms, num_guests, status, message)
values
  ('BK-1042', 'Rafiqul Islam', 'rafiqul.islam@gmail.com', '+880 1712-345678', 'Premium Deluxe King', '2026-09-25', '2026-09-28', 1, 2, 'Confirmed', 'Airport pickup required at 4:00 PM.'),
  ('BK-1089', 'Sarah Jenkins', 's.jenkins@globexcorp.com', '+44 7911 123456', 'Deluxe King', '2026-10-02', '2026-10-05', 1, 1, 'Pending', 'Quiet room on higher floor preferred.')
on conflict (id) do nothing;
