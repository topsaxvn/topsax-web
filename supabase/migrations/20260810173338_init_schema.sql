-- TOPSAX saxophone store - initial schema
-- Tables, indexes, constraints and RLS policies per project plan section 8-10.

-- ---------------------------------------------------------------------------
-- Helper: keep updated_at in sync on every UPDATE
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------------
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  parent_id uuid references public.categories (id) on delete set null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index categories_parent_id_idx on public.categories (parent_id);
create index categories_is_active_idx on public.categories (is_active);

create trigger categories_set_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- brands
-- ---------------------------------------------------------------------------
create table public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  logo_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index brands_is_active_idx on public.brands (is_active);

create trigger brands_set_updated_at
  before update on public.brands
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------------
create type public.product_condition as enum ('new', 'used', 'like_new', 'refurbished');
create type public.product_status as enum ('available', 'sold', 'hidden');

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category_id uuid references public.categories (id) on delete restrict,
  brand_id uuid references public.brands (id) on delete set null,
  model text,
  sku text,
  description text,
  short_description text,
  price numeric(12, 2) not null check (price >= 0),
  currency text not null default 'VND',
  condition public.product_condition not null default 'used',
  status public.product_status not null default 'available',
  featured boolean not null default false,
  stock_quantity integer not null default 1 check (stock_quantity >= 0),
  serial_number text,
  year integer check (year is null or (year between 1900 and 2100)),
  specifications jsonb not null default '{}'::jsonb,
  meta_title text,
  meta_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_category_id_idx on public.products (category_id);
create index products_brand_id_idx on public.products (brand_id);
create index products_status_idx on public.products (status);
create index products_featured_idx on public.products (featured) where featured = true;
create index products_specifications_idx on public.products using gin (specifications);

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- product_images
-- ---------------------------------------------------------------------------
create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  url text not null,
  public_id text not null,
  alt_text text,
  sort_order integer not null default 0,
  is_thumbnail boolean not null default false,
  created_at timestamptz not null default now()
);

create index product_images_product_id_idx on public.product_images (product_id);
create unique index product_images_one_thumbnail_per_product_idx
  on public.product_images (product_id)
  where is_thumbnail = true;

-- ---------------------------------------------------------------------------
-- blog_categories
-- ---------------------------------------------------------------------------
create table public.blog_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger blog_categories_set_updated_at
  before update on public.blog_categories
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- posts
-- ---------------------------------------------------------------------------
create type public.post_status as enum ('draft', 'published', 'archived');

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null default '',
  thumbnail_url text,
  author_id uuid references auth.users (id) on delete set null,
  category_id uuid references public.blog_categories (id) on delete set null,
  status public.post_status not null default 'draft',
  published_at timestamptz,
  meta_title text,
  meta_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index posts_category_id_idx on public.posts (category_id);
create index posts_status_idx on public.posts (status);
create index posts_published_at_idx on public.posts (published_at desc);

create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- contact_messages
-- ---------------------------------------------------------------------------
create type public.contact_message_status as enum ('new', 'contacted', 'closed');

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  message text not null,
  product_id uuid references public.products (id) on delete set null,
  status public.contact_message_status not null default 'new',
  created_at timestamptz not null default now()
);

create index contact_messages_status_idx on public.contact_messages (status);
create index contact_messages_product_id_idx on public.contact_messages (product_id);

-- ---------------------------------------------------------------------------
-- Row Level Security
--
-- There is no public customer-account model (see plan section 3.1/11): the
-- only Supabase Auth users are store admins. So `authenticated` == admin and
-- gets full CRUD; `anon` (public visitors) gets narrow, read-mostly access.
-- ---------------------------------------------------------------------------
alter table public.categories enable row level security;
alter table public.brands enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.blog_categories enable row level security;
alter table public.posts enable row level security;
alter table public.contact_messages enable row level security;

-- categories
create policy "public read active categories"
  on public.categories for select
  to anon
  using (is_active = true);

create policy "admin manage categories"
  on public.categories for all
  to authenticated
  using (true)
  with check (true);

-- brands
create policy "public read active brands"
  on public.brands for select
  to anon
  using (is_active = true);

create policy "admin manage brands"
  on public.brands for all
  to authenticated
  using (true)
  with check (true);

-- products
create policy "public read visible products"
  on public.products for select
  to anon
  using (status <> 'hidden');

create policy "admin manage products"
  on public.products for all
  to authenticated
  using (true)
  with check (true);

-- product_images (visible only alongside a visible product)
create policy "public read images of visible products"
  on public.product_images for select
  to anon
  using (
    exists (
      select 1 from public.products p
      where p.id = product_images.product_id
        and p.status <> 'hidden'
    )
  );

create policy "admin manage product images"
  on public.product_images for all
  to authenticated
  using (true)
  with check (true);

-- blog_categories
create policy "public read blog categories"
  on public.blog_categories for select
  to anon
  using (true);

create policy "admin manage blog categories"
  on public.blog_categories for all
  to authenticated
  using (true)
  with check (true);

-- posts
create policy "public read published posts"
  on public.posts for select
  to anon
  using (status = 'published');

create policy "admin manage posts"
  on public.posts for all
  to authenticated
  using (true)
  with check (true);

-- contact_messages (public can submit leads, only admin can read/manage them)
create policy "public submit contact message"
  on public.contact_messages for insert
  to anon
  with check (true);

create policy "admin manage contact messages"
  on public.contact_messages for all
  to authenticated
  using (true)
  with check (true);
