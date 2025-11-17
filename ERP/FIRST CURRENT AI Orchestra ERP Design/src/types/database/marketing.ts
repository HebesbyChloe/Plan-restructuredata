/**
 * Marketing Module - Database Type Definitions
 * Types matching the actual Supabase database schema (snake_case)
 * 
 * IMPORTANT: 
 * - Promotion table is named `promo` (not `mkt_promotions`)
 * - All promotion junction tables use `promo_` prefix
 * - Dates are stored as DATE/TIMESTAMPTZ in database
 */

// ============================================
// MKT_CAMPAIGNS
// ============================================

export interface MktCampaignRow {
  id: number; // BIGSERIAL
  tenant_id: number; // BIGINT, NOT NULL
  name: string; // VARCHAR(500), NOT NULL
  type: 'email' | 'social' | 'paid-ads' | 'content' | 'event' | 'launch'; // VARCHAR(50), NOT NULL
  status: 'planning' | 'in-progress' | 'launching' | 'completed' | 'draft' | 'paused'; // VARCHAR(50), NOT NULL
  description: string | null; // TEXT
  budget: number; // NUMERIC(12,2), NOT NULL, DEFAULT 0
  spent: number; // NUMERIC(12,2), NOT NULL, DEFAULT 0
  start_date: string; // DATE, NOT NULL (ISO date string: YYYY-MM-DD)
  end_date: string | null; // DATE
  owner_id: number; // BIGINT, NOT NULL
  brand_id: number | null; // BIGINT, FK → sys_brands.id, DEFAULT NULL
  priority: 'high' | 'medium' | 'low'; // VARCHAR(20), NOT NULL, DEFAULT 'medium'
  progress: number; // INTEGER, NOT NULL, DEFAULT 0 (0-100)
  ai_score: number | null; // INTEGER (0-100)
  purpose: string | null; // TEXT
  notes: string | null; // TEXT
  reach: number; // INTEGER, NOT NULL, DEFAULT 0
  reach_goal: number; // INTEGER, NOT NULL, DEFAULT 0
  engagement: number; // NUMERIC(5,2), NOT NULL, DEFAULT 0 (0-100)
  engagement_goal: number; // NUMERIC(5,2), NOT NULL, DEFAULT 0 (0-100)
  impressions: number; // INTEGER, NOT NULL, DEFAULT 0
  clicks: number; // INTEGER, NOT NULL, DEFAULT 0
  conversions: number; // INTEGER, NOT NULL, DEFAULT 0
  revenue: number; // NUMERIC(12,2), NOT NULL, DEFAULT 0
  channels: string[] | null; // TEXT[]
  tags: string[] | null; // TEXT[]
  created_at: string; // TIMESTAMPTZ, NOT NULL
  updated_at: string; // TIMESTAMPTZ, NOT NULL
  deleted_at: string | null; // TIMESTAMPTZ (soft delete)
}

export interface MktCampaignInsert {
  tenant_id: number;
  name: string;
  type: 'email' | 'social' | 'paid-ads' | 'content' | 'event' | 'launch';
  status?: 'planning' | 'in-progress' | 'launching' | 'completed' | 'draft' | 'paused';
  description?: string | null;
  budget?: number;
  spent?: number;
  start_date: string; // DATE (ISO date string: YYYY-MM-DD)
  end_date?: string | null; // DATE
  owner_id: number;
  brand_id?: number | null;
  priority?: 'high' | 'medium' | 'low';
  progress?: number;
  ai_score?: number | null;
  purpose?: string | null;
  notes?: string | null;
  reach?: number;
  reach_goal?: number;
  engagement?: number;
  engagement_goal?: number;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  revenue?: number;
  channels?: string[] | null;
  tags?: string[] | null;
}

export interface MktCampaignUpdate {
  name?: string;
  type?: 'email' | 'social' | 'paid-ads' | 'content' | 'event' | 'launch';
  status?: 'planning' | 'in-progress' | 'launching' | 'completed' | 'draft' | 'paused';
  description?: string | null;
  budget?: number;
  spent?: number;
  start_date?: string; // DATE
  end_date?: string | null; // DATE
  owner_id?: number;
  brand_id?: number | null;
  priority?: 'high' | 'medium' | 'low';
  progress?: number;
  ai_score?: number | null;
  purpose?: string | null;
  notes?: string | null;
  reach?: number;
  reach_goal?: number;
  engagement?: number;
  engagement_goal?: number;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  revenue?: number;
  channels?: string[] | null;
  tags?: string[] | null;
  updated_at?: string; // TIMESTAMPTZ
}

// ============================================
// PROMO (Promotion table - NOT mkt_promotions)
// ============================================

export interface PromoRow {
  id: number; // BIGSERIAL
  tenant_id: number; // BIGINT, NOT NULL
  name: string; // VARCHAR(200), NOT NULL
  code: string; // VARCHAR(100), NOT NULL, UNIQUE per tenant
  type: 'percentage' | 'fixed_amount' | 'free_shipping' | 'buy_x_get_y' | 'buy_more_get_more'; // VARCHAR(50), NOT NULL
  status: 'active' | 'scheduled' | 'draft' | 'expired' | 'archived'; // VARCHAR(50), NOT NULL, DEFAULT 'draft'
  is_active: boolean; // BOOLEAN, NOT NULL, DEFAULT TRUE
  percentage_value: number | null; // NUMERIC(5,2) (0-100)
  value_amount: number | null; // NUMERIC(12,2)
  buy_quantity: number | null; // INTEGER
  get_quantity: number | null; // INTEGER
  bogo_discount_percent: number | null; // INTEGER
  bmgm_mode: 'discount' | 'product' | null; // VARCHAR(20)
  bmgm_discount_percent: number | null; // INTEGER
  minimum_purchase: number | null; // NUMERIC(12,2)
  max_discount: number | null; // NUMERIC(12,2)
  start_date: string; // DATE, NOT NULL (ISO date string: YYYY-MM-DD)
  end_date: string; // DATE, NOT NULL (ISO date string: YYYY-MM-DD)
  target_audience: string | null; // VARCHAR(200)
  redemptions: number; // INTEGER, NOT NULL, DEFAULT 0
  revenue: string | null; // VARCHAR(100) - stored as text
  usage_limit: number | null; // INTEGER
  used_count: number; // INTEGER, NOT NULL, DEFAULT 0
  description: string | null; // TEXT
  is_auto_apply: boolean; // BOOLEAN, NOT NULL, DEFAULT FALSE
  created_at: string; // TIMESTAMPTZ, NOT NULL
  updated_at: string; // TIMESTAMPTZ, NOT NULL
  deleted_at: string | null; // TIMESTAMPTZ (soft delete)
}

export interface PromoInsert {
  tenant_id: number;
  name: string;
  code: string;
  type: 'percentage' | 'fixed_amount' | 'free_shipping' | 'buy_x_get_y' | 'buy_more_get_more';
  status?: 'active' | 'scheduled' | 'draft' | 'expired' | 'archived';
  is_active?: boolean;
  percentage_value?: number | null;
  value_amount?: number | null;
  buy_quantity?: number | null;
  get_quantity?: number | null;
  bogo_discount_percent?: number | null;
  bmgm_mode?: 'discount' | 'product' | null;
  bmgm_discount_percent?: number | null;
  minimum_purchase?: number | null;
  max_discount?: number | null;
  start_date: string; // DATE (ISO date string: YYYY-MM-DD)
  end_date: string; // DATE (ISO date string: YYYY-MM-DD)
  target_audience?: string | null;
  redemptions?: number;
  revenue?: string | null;
  usage_limit?: number | null;
  used_count?: number;
  description?: string | null;
  is_auto_apply?: boolean;
}

export interface PromoUpdate {
  name?: string;
  code?: string;
  type?: 'percentage' | 'fixed_amount' | 'free_shipping' | 'buy_x_get_y' | 'buy_more_get_more';
  status?: 'active' | 'scheduled' | 'draft' | 'expired' | 'archived';
  is_active?: boolean;
  percentage_value?: number | null;
  value_amount?: number | null;
  buy_quantity?: number | null;
  get_quantity?: number | null;
  bogo_discount_percent?: number | null;
  bmgm_mode?: 'discount' | 'product' | null;
  bmgm_discount_percent?: number | null;
  minimum_purchase?: number | null;
  max_discount?: number | null;
  start_date?: string; // DATE
  end_date?: string; // DATE
  target_audience?: string | null;
  redemptions?: number;
  revenue?: string | null;
  usage_limit?: number | null;
  used_count?: number;
  description?: string | null;
  is_auto_apply?: boolean;
  updated_at?: string; // TIMESTAMPTZ
}

// ============================================
// PROMO JUNCTION TABLES
// ============================================

export interface PromoCampaignRow {
  promotion_id: number; // BIGINT, FK → promo.id
  campaign_id: number; // BIGINT, FK → mkt_campaigns.id
  created_at: string; // TIMESTAMPTZ
}

export interface PromoChannelRow {
  promotion_id: number; // BIGINT, FK → promo.id
  channel_id: number; // BIGINT, FK → mkt_marketing_channels.id
  created_at: string; // TIMESTAMPTZ
}

export interface PromoProductRow {
  promotion_id: number; // BIGINT, FK → promo.id
  product_id: number; // BIGINT, FK → product.id
  created_at: string; // TIMESTAMPTZ
}

export interface PromoCategoryRow {
  promotion_id: number; // BIGINT, FK → promo.id
  category_id: number; // BIGINT, FK → category.id
  created_at: string; // TIMESTAMPTZ
}

export interface PromoAttributeRow {
  promotion_id: number; // BIGINT, FK → promo.id
  attribute_id: number; // BIGINT, FK → product_attribute.id
  created_at: string; // TIMESTAMPTZ
}

export interface PromoExclusionRow {
  promotion_id: number; // BIGINT, FK → promo.id
  exclusion_id: number; // BIGINT (polymorphic - could be product_id, category_id, etc.)
  exclusion_type: string; // VARCHAR(50) (e.g., 'product', 'category')
  created_at: string; // TIMESTAMPTZ
}

export interface PromoFreeItemRow {
  promotion_id: number; // BIGINT, FK → promo.id
  product_id: number; // BIGINT, FK → product.id
  quantity: number; // INTEGER
  created_at: string; // TIMESTAMPTZ
}

export interface PromoBmgmProductRow {
  promotion_id: number; // BIGINT, FK → promo.id
  product_id: number; // BIGINT, FK → product.id
  created_at: string; // TIMESTAMPTZ
}

export interface PromoRedemptionRow {
  id: number; // BIGSERIAL
  promotion_id: number; // BIGINT, FK → promo.id
  order_id: number | null; // BIGINT, FK → orders.id
  customer_id: number | null; // BIGINT, FK → crm_customers.id
  redeemed_at: string; // TIMESTAMPTZ
  created_at: string; // TIMESTAMPTZ
}

