/*
# MR.ONE Shop Manager — Core Schema

## Overview
Creates the full database schema for MR.ONE Shop Manager based on the locked
MASTER HANDOFF BLUEPRINT architecture. This is a single-tenant control center
with no authentication — all policies use anon+authenticated so the anon-key
frontend can read and write its own data.

## Tables

### 1. products
The top-level entity representing a single Product ID (e.g. MRONE-001).
- product_code (unique, e.g. "MRONE-001")
- name, category, product_type (PDF, XLSX, ZIP, etc.)
- production_mode (AUTO, SEMI-AUTO, MANUAL, NOT AVAILABLE)
- overall_status (draft, in_production, qc1_pending, master_stored, archived)

### 2. assets
Individual A or B assets belonging to a product. Each product has at least
one A (Digital Product Master) and one B (Digital Content Master).
- product_id (FK to products)
- asset_type ('A' = Digital Product, 'B' = Digital Content)
- asset_code (e.g. "MRONE-001-A", "MRONE-001-B")
- content_type (for A: pdf/xlsx/zip/template; for B: video/mp4)
- production_mode, production_status
- version (e.g. "V1")
- master_url (Cloudinary URL — stored only after QC-1 pass + save master)
- cloudinary_status (not_stored, pending, stored, error)
- qc1_status (pending, passed, failed)
- qc1_notes
- console2_available (boolean — whether B is available for Console 2)

### 3. marketing_campaigns
Console 2 distribution campaigns that reference a B asset.
- asset_id (FK to assets — the B content being distributed)
- product_id (FK to products — for convenience)
- title, description, cta, product_link
- target_platform (tiktok, facebook, youtube)
- channel_name, channel_id
- campaign_status (draft, preview, qc2_pending, approved, scheduled, distributing, completed, rejected)
- scheduled_at
- qc2_status (pending, passed, failed)
- qc2_notes

## Security
- RLS enabled on all tables.
- All policies use TO anon, authenticated with USING (true) / WITH CHECK (true)
  because this is a single-tenant app with no sign-in screen — the data is
  intentionally shared/public within the single operator context.

## Important Notes
1. Products and assets use ON DELETE CASCADE so deleting a product cleans up
   its assets and campaigns automatically.
2. Marketing campaigns cascade-delete when their referenced asset is deleted.
3. Timestamps track creation and updates on all tables.
4. The schema deliberately does NOT store Cloudinary credentials or API keys —
   those are runtime/environment concerns, not persisted in business tables.
5. No fake integrations are modeled — cloudinary_status starts as 'not_stored'
   and only changes to 'stored' when a real master URL is registered manually.
*/

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_code text UNIQUE NOT NULL,
  name text NOT NULL,
  category text,
  product_type text NOT NULL DEFAULT 'pdf',
  production_mode text NOT NULL DEFAULT 'MANUAL'
    CHECK (production_mode IN ('AUTO', 'SEMI-AUTO', 'MANUAL', 'NOT AVAILABLE')),
  overall_status text NOT NULL DEFAULT 'draft'
    CHECK (overall_status IN ('draft', 'in_production', 'qc1_pending', 'master_stored', 'archived')),
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_products" ON products;
CREATE POLICY "anon_select_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_products" ON products;
CREATE POLICY "anon_insert_products" ON products FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_products" ON products;
CREATE POLICY "anon_update_products" ON products FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_products" ON products;
CREATE POLICY "anon_delete_products" ON products FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- ASSETS (A = Digital Product Master, B = Digital Content Master)
-- ============================================================
CREATE TABLE IF NOT EXISTS assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  asset_type text NOT NULL CHECK (asset_type IN ('A', 'B')),
  asset_code text NOT NULL,
  content_type text NOT NULL DEFAULT 'pdf',
  production_mode text NOT NULL DEFAULT 'MANUAL'
    CHECK (production_mode IN ('AUTO', 'SEMI-AUTO', 'MANUAL', 'NOT AVAILABLE')),
  production_status text NOT NULL DEFAULT 'pending'
    CHECK (production_status IN ('pending', 'in_production', 'result_ready', 'registered', 'qc1_pending', 'qc1_passed', 'qc1_failed', 'master_stored')),
  version text NOT NULL DEFAULT 'V1',
  master_url text,
  cloudinary_status text NOT NULL DEFAULT 'not_stored'
    CHECK (cloudinary_status IN ('not_stored', 'pending', 'stored', 'error')),
  qc1_status text NOT NULL DEFAULT 'pending'
    CHECK (qc1_status IN ('pending', 'passed', 'failed')),
  qc1_notes text,
  console2_available boolean NOT NULL DEFAULT false,
  file_name text,
  file_size_bytes bigint,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_assets_product_id ON assets(product_id);
CREATE INDEX IF NOT EXISTS idx_assets_asset_type ON assets(asset_type);
CREATE INDEX IF NOT EXISTS idx_assets_asset_code ON assets(asset_code);

ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_assets" ON assets;
CREATE POLICY "anon_select_assets" ON assets FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_assets" ON assets;
CREATE POLICY "anon_insert_assets" ON assets FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_assets" ON assets;
CREATE POLICY "anon_update_assets" ON assets FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_assets" ON assets;
CREATE POLICY "anon_delete_assets" ON assets FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- MARKETING CAMPAIGNS (Console 2)
-- ============================================================
CREATE TABLE IF NOT EXISTS marketing_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id uuid NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  cta text,
  product_link text,
  target_platform text NOT NULL DEFAULT 'tiktok'
    CHECK (target_platform IN ('tiktok', 'facebook', 'youtube')),
  channel_name text,
  channel_id text,
  campaign_status text NOT NULL DEFAULT 'draft'
    CHECK (campaign_status IN ('draft', 'preview', 'qc2_pending', 'approved', 'scheduled', 'distributing', 'completed', 'rejected')),
  qc2_status text NOT NULL DEFAULT 'pending'
    CHECK (qc2_status IN ('pending', 'passed', 'failed')),
  qc2_notes text,
  scheduled_at timestamptz,
  buffer_status text NOT NULL DEFAULT 'not_scheduled'
    CHECK (buffer_status IN ('not_scheduled', 'scheduled', 'distributed', 'error')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_campaigns_asset_id ON marketing_campaigns(asset_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_product_id ON marketing_campaigns(product_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON marketing_campaigns(campaign_status);

ALTER TABLE marketing_campaigns ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_campaigns" ON marketing_campaigns;
CREATE POLICY "anon_select_campaigns" ON marketing_campaigns FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_campaigns" ON marketing_campaigns;
CREATE POLICY "anon_insert_campaigns" ON marketing_campaigns FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_campaigns" ON marketing_campaigns;
CREATE POLICY "anon_update_campaigns" ON marketing_campaigns FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_campaigns" ON marketing_campaigns;
CREATE POLICY "anon_delete_campaigns" ON marketing_campaigns FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_updated_at ON products;
CREATE TRIGGER products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS assets_updated_at ON assets;
CREATE TRIGGER assets_updated_at BEFORE UPDATE ON assets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS campaigns_updated_at ON marketing_campaigns;
CREATE TRIGGER campaigns_updated_at BEFORE UPDATE ON marketing_campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
