-- ==========================================
-- Eyeglam relational catalog architecture
-- ==========================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1) Frame shapes (predefined list)
CREATE TABLE IF NOT EXISTS frame_shapes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO frame_shapes (slug, label, sort_order) VALUES
  ('round', 'Round', 1),
  ('aviator', 'Aviator', 2),
  ('wayfarer', 'Wayfarer', 3),
  ('cat-eye', 'Cat-Eye', 4),
  ('rectangle', 'Rectangle', 5),
  ('square', 'Square', 6),
  ('oval', 'Oval', 7),
  ('browline', 'Browline', 8)
ON CONFLICT (slug) DO NOTHING;

-- 2) Keep existing product columns for backwards compatibility
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS shape_id UUID REFERENCES frame_shapes(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
  ADD COLUMN IF NOT EXISTS gallery_urls TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS video_url TEXT,
  ADD COLUMN IF NOT EXISTS frame_shape TEXT;

-- Normalize legacy frame_shape -> shape_id
UPDATE products p
SET shape_id = fs.id
FROM frame_shapes fs
WHERE p.shape_id IS NULL
  AND p.frame_shape = fs.slug;

-- 3) Colors (master table)
CREATE TABLE IF NOT EXISTS colors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hex_code TEXT NOT NULL,
  color_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (hex_code, color_name)
);

-- 4) Product variants (per-color stock)
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  color_id UUID NOT NULL REFERENCES colors(id) ON DELETE RESTRICT,
  stock INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5) Product images (per variant gallery)
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_products_shape_id ON products(shape_id);
CREATE INDEX IF NOT EXISTS idx_products_frame_shape ON products(frame_shape);
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_variant_id ON product_images(variant_id);

-- 6) Storage bucket + upload policies for admin dashboard image uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('public', 'public', true)
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Allow public read access on public bucket'
  ) THEN
    CREATE POLICY "Allow public read access on public bucket"
      ON storage.objects
      FOR SELECT
      USING (bucket_id = 'public');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Allow authenticated uploads on public bucket'
  ) THEN
    CREATE POLICY "Allow authenticated uploads on public bucket"
      ON storage.objects
      FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = 'public');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Allow authenticated updates on public bucket'
  ) THEN
    CREATE POLICY "Allow authenticated updates on public bucket"
      ON storage.objects
      FOR UPDATE
      TO authenticated
      USING (bucket_id = 'public')
      WITH CHECK (bucket_id = 'public');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Allow authenticated deletes on public bucket'
  ) THEN
    CREATE POLICY "Allow authenticated deletes on public bucket"
      ON storage.objects
      FOR DELETE
      TO authenticated
      USING (bucket_id = 'public');
  END IF;
END $$;

-- ==========================================
-- 7) RLS policies for admin/dashboard writes
-- ==========================================

-- Helper function: admin check from JWT metadata
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean, false);
$$;

-- Enable RLS (safe to run repeatedly)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE frame_shapes ENABLE ROW LEVEL SECURITY;
ALTER TABLE colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  tbl text;
BEGIN
  -- Public storefront read policies (only active records where applicable)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='products' AND policyname='Public can read active products'
  ) THEN
    CREATE POLICY "Public can read active products" ON products
      FOR SELECT USING (is_active = true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='categories' AND policyname='Public can read active categories'
  ) THEN
    CREATE POLICY "Public can read active categories" ON categories
      FOR SELECT USING (is_active = true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='hero_slides' AND policyname='Public can read active hero slides'
  ) THEN
    CREATE POLICY "Public can read active hero slides" ON hero_slides
      FOR SELECT USING (is_active = true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='testimonials' AND policyname='Public can read active testimonials'
  ) THEN
    CREATE POLICY "Public can read active testimonials" ON testimonials
      FOR SELECT USING (is_active = true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='frame_shapes' AND policyname='Public can read frame shapes'
  ) THEN
    CREATE POLICY "Public can read frame shapes" ON frame_shapes
      FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='colors' AND policyname='Public can read colors'
  ) THEN
    CREATE POLICY "Public can read colors" ON colors
      FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='product_variants' AND policyname='Public can read product variants'
  ) THEN
    CREATE POLICY "Public can read product variants" ON product_variants
      FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='product_images' AND policyname='Public can read product images'
  ) THEN
    CREATE POLICY "Public can read product images" ON product_images
      FOR SELECT USING (true);
  END IF;

  -- Admin full access policies for dashboard tables
  FOREACH tbl IN ARRAY ARRAY[
    'products',
    'categories',
    'hero_slides',
    'testimonials',
    'orders',
    'site_settings',
    'frame_shapes',
    'colors',
    'product_variants',
    'product_images'
  ]
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies
      WHERE schemaname='public'
        AND tablename=tbl
        AND policyname='Admin full access on ' || tbl
    ) THEN
      EXECUTE format(
        'CREATE POLICY %I ON %I FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin())',
        'Admin full access on ' || tbl,
        tbl
      );
    END IF;
  END LOOP;
END $$;
