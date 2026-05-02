-- NakMakanApa? — initial schema + seed (Bahasa Melayu)

-- Questions
create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_ms text not null,
  subtitle_ms text,
  sort_order int not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Options per question
create table if not exists public.question_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions (id) on delete cascade,
  label_ms text not null,
  value_key text not null,
  icon text,
  sort_order int not null,
  created_at timestamptz not null default now(),
  unique (question_id, value_key)
);

-- Food catalog for constrained AI + Places search
create table if not exists public.food_menu (
  id uuid primary key default gen_random_uuid(),
  name_ms text not null,
  description_ms text,
  places_query text not null,
  places_types text[] default null,
  sort_order int,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create unique index if not exists food_menu_name_ms_unique on public.food_menu (name_ms);

-- RLS
alter table public.questions enable row level security;
alter table public.question_options enable row level security;
alter table public.food_menu enable row level security;

create policy "Public read active questions"
  on public.questions for select
  using (is_active = true);

create policy "Public read options for active questions"
  on public.question_options for select
  using (
    exists (
      select 1 from public.questions q
      where q.id = question_options.question_id and q.is_active = true
    )
  );

create policy "Public read active food_menu"
  on public.food_menu for select
  using (is_active = true);

-- Seed: questions
insert into public.questions (slug, title_ms, subtitle_ms, sort_order) values
  ('weather', 'Cuaca hari ini macam mana?', 'Pilih yang paling rapat dengan perasaan anda.', 1),
  ('companion', 'Anda makan dengan siapa?', null, 2),
  ('nostalgia', 'Nostalgia atau benda baru?', null, 3),
  ('cravings', 'Selera pedas / manis / berlemak?', null, 4)
on conflict (slug) do nothing;

-- Seed: options (lookup question ids by slug)
insert into public.question_options (question_id, label_ms, value_key, sort_order, icon)
select q.id, v.label_ms, v.value_key, v.sort_order, v.icon
from public.questions q
cross join (values
  -- weather
  ('weather', 'Panas terik', 'panas', 1, 'sun'),
  ('weather', 'Hujan / mendung', 'hujan', 2, 'cloud-rain'),
  ('weather', 'Sejuk / hujan renyai', 'sejuk', 3, 'cloud'),
  -- companion
  ('companion', 'Solo', 'solo', 1, 'user'),
  ('companion', 'Pasangan / romantik', 'pasangan', 2, 'heart'),
  ('companion', 'Keluarga / ramai orang', 'keluarga', 3, 'users'),
  ('companion', 'Rakan sekerja / networking', 'kerja', 4, 'briefcase'),
  -- nostalgia
  ('nostalgia', 'Nak rasa klasik / nostalgia', 'klasik', 1, 'clock'),
  ('nostalgia', 'Nak cuba trend / viral', 'trend', 2, 'sparkles'),
  ('nostalgia', 'Campuran — ikut mood', 'campur', 3, 'shuffle'),
  -- cravings
  ('cravings', 'Pedas & berapi', 'pedas', 1, 'flame'),
  ('cravings', 'Manis / penutup', 'manis', 2, 'candy'),
  ('cravings', 'Berlemak & puas', 'berlemak', 3, 'beef'),
  ('cravings', 'Segar & ringan', 'segar', 4, 'leaf')
) as v(qslug, label_ms, value_key, sort_order, icon)
where q.slug = v.qslug
on conflict (question_id, value_key) do nothing;

-- Seed: food_menu
insert into public.food_menu (name_ms, description_ms, places_query, places_types, sort_order) values
  ('Nasi Lemak', 'Santan, sambal, rangup — sarapan atau malam pun ngam.', 'nasi lemak restaurant', array['restaurant']::text[], 1),
  ('Char Kuey Teow', 'Rasa wok hei, taugeh, udang.', 'char kuey teow', array['restaurant']::text[], 2),
  ('Nasi Kandar', 'Kuah campur, puas hati.', 'nasi kandar', array['restaurant']::text[], 3),
  ('Laksa', 'Santan atau asam — ikut negeri.', 'laksa', array['restaurant']::text[], 4),
  ('Satay & Kuah Kacang', 'Bakar, sesuai kongsi.', 'satay', array['restaurant']::text[], 5),
  ('Roti Canai / Mamak', 'Telur banjir, kuah dhal, teh tarik.', 'mamak roti canai', array['restaurant']::text[], 6),
  ('Ramen / Mi Jepun', 'Sup pekat, telur, chashu.', 'ramen', array['restaurant']::text[], 7),
  ('Korean BBQ / K-food', 'Grill, banchan, vibe ramai.', 'korean restaurant', array['restaurant']::text[], 8),
  ('Burger & Fast Casual', 'Puas, cepat, messy sedap.', 'gourmet burger', array['restaurant']::text[], 9),
  ('Pizza Itali-style', 'Bakar, cheesy, kongsi besar.', 'pizza restaurant', array['restaurant']::text[], 10),
  ('Sushi / Jepun Ringan', 'Segar, porsi kecil-kecil banyak.', 'sushi', array['restaurant']::text[], 11),
  ('Middle Eastern / Shawarma', 'Grill, hummus, warp.', 'shawarma middle eastern restaurant', array['restaurant']::text[], 12),
  ('Thai Pedas-Pedas', 'Tomyam, pandan, lenggeng.', 'thai restaurant', array['restaurant']::text[], 13),
  ('Vegan / Salad Bowl', 'Segar selepas cuaca panas.', 'vegan restaurant', array['restaurant']::text[], 14),
  ('Manisan / Kek / Cafe', 'Manis untuk penutup mood.', 'dessert cafe cake', array['cafe']::text[], 15)
on conflict (name_ms) do nothing;
