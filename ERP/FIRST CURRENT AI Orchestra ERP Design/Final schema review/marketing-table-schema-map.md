# Marketing Department - Database Tables Schema Map

## Overview
This document shows the complete Marketing Department schema structure with data types, foreign keys, and change indicators. The schema supports campaigns, promotions, assets, brand management, and resources.

**Legend:**
- 🆕 **NEW** - Newly created tables
- 🔄 **NORMALIZED** - Comma-separated values moved to junction tables
- 🗑️ **REMOVED** - Fields/tables removed or consolidated
- ✏️ **RENAMED** - Table/column renamed
- 📊 **DENORMALIZED** - Denormalized for performance (if any)
- ⭐ **ENHANCED** - Enhanced with enterprise features
- 🔗 **Foreign Key** - Relationship to another table
- ⏰ **Timestamp** - Time tracking column
- ✅ **Check Constraint** - Value validation constraint

---

## Schema Skeleton Map (ERD)

```
┌─────────────────────────────────────────────────────────────────┐
│                  MARKETING DEPARTMENT SCHEMA                     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         CAMPAIGNS                                │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│   mkt_campaigns      │
│──────────────────────│
│ id (PK)              │
│ tenant_id (FK) ──────┼──► sys_tenants.id
│ name                 │
│ type                 │
│ status               │
│ budget               │
│ spent                │
│ owner_id (FK) ───────┼──► hr_staff.id
│ ...                  │
└────┬─────────────────┘
     │
     ├─── 1:N ────► mkt_campaign_goals (campaign_id)
     ├─── 1:N ────► mkt_campaign_activities (campaign_id)
     ├─── 1:N ────► mkt_campaign_tasks (campaign_id)
     ├─── 1:N ────► mkt_campaign_metrics (campaign_id)
     └─── 1:N ────► mkt_campaign_files (campaign_id)

┌──────────────────────┐
│  mkt_milestones      │
│──────────────────────│
│ id (PK)              │
│ tenant_id (FK) ──────┼──► sys_tenants.id
│ project_id (FK) ─────┼──► project.id
│ title                │
│ target_date          │
│ status               │
└──────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                        PROMOTIONS                                │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│   mkt_promotions     │
│──────────────────────│
│ id (PK)              │
│ tenant_id (FK) ──────┼──► sys_tenants.id
│ name                 │
│ code (UNIQUE)        │
│ type                 │
│ status               │
│ ...                  │
└────┬─────────────────┘
     │
     ├─── N:M ────► mkt_promotion_campaigns (promotion_id, campaign_id)
     ├─── N:M ────► mkt_promotion_channels (promotion_id, channel_id)
     ├─── N:M ────► mkt_promotion_products (promotion_id, product_id)
     ├─── N:M ────► mkt_promotion_categories (promotion_id, category_id)
     ├─── N:M ────► mkt_promotion_attributes (promotion_id, attribute_id)
     ├─── 1:N ────► mkt_promotion_exclusions (promotion_id)
     ├─── 1:N ────► mkt_promotion_free_items (promotion_id)
     └─── N:M ────► mkt_promotion_bmgm_products (promotion_id, product_id)


┌─────────────────────────────────────────────────────────────────┐
│                      ASSET LIBRARY                               │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│  mkt_asset_folders   │
│──────────────────────│
│ id (PK)              │
│ tenant_id (FK) ──────┼──► sys_tenants.id
│ name                 │
│ parent_folder_id ────┼──► mkt_asset_folders.id (self-ref)
│ ...                  │
└────┬─────────────────┘
     │
     └─── 1:N ────► mkt_marketing_assets (folder_id)

┌──────────────────────┐
│ mkt_marketing_assets │
│──────────────────────│
│ id (PK)              │
│ tenant_id (FK) ──────┼──► sys_tenants.id
│ folder_id (FK) ──────┼──► mkt_asset_folders.id
│ name                 │
│ type                 │
│ added_by_id (FK) ────┼──► hr_staff.id
│ ...                  │
└──────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                        BRAND HUB                                 │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│  mkt_brand_settings  │
│──────────────────────│
│ id (PK, default: 1) │
│ tenant_id (FK) ──────┼──► sys_tenants.id
│ story                │
│ slogan               │
│ tagline              │
│ vision               │
│ mission              │
└──────────────────────┘

┌──────────────────────┐
│  mkt_brand_colors    │
│──────────────────────│
│ id (PK)              │
│ tenant_id (FK) ──────┼──► sys_tenants.id
│ name                 │
│ hex                  │
│ category             │
│ sort_order           │
└──────────────────────┘

┌──────────────────────┐
│ mkt_brand_typography │
│──────────────────────│
│ id (PK)              │
│ tenant_id (FK) ──────┼──► sys_tenants.id
│ name                 │
│ size                 │
│ weight               │
│ category             │
│ sort_order           │
└──────────────────────┘

┌──────────────────────┐
│  mkt_brand_logos     │
│──────────────────────│
│ id (PK)              │
│ tenant_id (FK) ──────┼──► sys_tenants.id
│ name                 │
│ variation_type       │
│ logo_url             │
│ sort_order           │
└──────────────────────┘

┌──────────────────────┐
│ mkt_brand_guidelines │
│──────────────────────│
│ id (PK)              │
│ tenant_id (FK) ──────┼──► sys_tenants.id
│ title                │
│ category             │
│ items (JSONB)        │
│ sort_order           │
└──────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                        RESOURCES                                │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│  mkt_affiliates      │
│──────────────────────│
│ id (PK)              │
│ tenant_id (FK) ──────┼──► sys_tenants.id
│ name                 │
│ type                 │
│ email                │
│ commission_rate      │
│ status               │
└──────────────────────┘

┌──────────────────────┐
│   mkt_utm_links      │
│──────────────────────│
│ id (PK)              │
│ tenant_id (FK) ──────┼──► sys_tenants.id
│ name                 │
│ url                  │
│ campaign             │
│ source               │
│ medium               │
│ clicks               │
│ conversions          │
└──────────────────────┘

┌──────────────────────┐
│ mkt_reference_docs   │
│──────────────────────│
│ id (PK)              │
│ tenant_id (FK) ──────┼──► sys_tenants.id
│ title                │
│ category             │
│ file_url             │
└──────────────────────┘

┌──────────────────────┐
│ mkt_marketing_channels│
│──────────────────────│
│ id (PK)              │
│ tenant_id (FK) ──────┼──► sys_tenants.id
│ name                 │
│ platform             │
│ reach                │
│ engagement           │
│ status               │
└──────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                    GLOBAL ALERT SYSTEM                          │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│  sys_alert_keys      │
│──────────────────────│
│ id (PK)              │
│ code (UNIQUE)        │
│ name                 │
│ category             │
│ severity             │
│ icon                 │
│ color                │
└────┬─────────────────┘
     │
     └─── 1:N ────► sys_alerts (alert_key_id)

┌──────────────────────┐
│     sys_alerts       │
│──────────────────────│
│ id (PK)              │
│ tenant_id (FK) ──────┼──► sys_tenants.id
│ alert_key_id (FK) ───┼──► sys_alert_keys.id
│ entity_type          │
│ entity_id            │
│ message              │
│ is_resolved          │
│ resolved_by (FK) ────┼──► sys_users.id
└──────────────────────┘
```

---

## Core Campaign Management Tables

#### `mkt_campaigns` 🆕 NEW
**Status**: Marketing campaigns

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `tenant_id` | INTEGER | FK → `sys_tenants.id`, NOT NULL | 🆕 Multi-tenancy |
| `name` | VARCHAR(500) | NOT NULL | Campaign name/title |
| `type` | VARCHAR(50) | NOT NULL | ✅ 'email', 'social', 'paid-ads', 'content', 'event', 'launch' |
| `status` | VARCHAR(50) | NOT NULL DEFAULT 'planning' | ✅ 'planning', 'in-progress', 'launching', 'completed', 'draft', 'paused' |
| `description` | TEXT | DEFAULT NULL | |
| `budget` | NUMERIC(12,2) | DEFAULT 0 | Campaign budget |
| `spent` | NUMERIC(12,2) | DEFAULT 0 | Amount spent |
| `start_date` | DATE | NOT NULL | Campaign start date |
| `end_date` | DATE | DEFAULT NULL | Campaign end date |
| `owner_id` | INTEGER | FK → `hr_staff.id`, NOT NULL | ✏️ Changed from staff.id |
| `priority` | VARCHAR(20) | DEFAULT 'medium' | ✅ 'high', 'medium', 'low' |
| `progress` | INTEGER | DEFAULT 0 | ✅ CHECK (0-100) |
| `ai_score` | INTEGER | DEFAULT NULL | ✅ CHECK (0-100) |
| `purpose` | TEXT | DEFAULT NULL | Campaign purpose |
| `notes` | TEXT | DEFAULT NULL | Internal notes |
| `reach` | INTEGER | DEFAULT 0 | Current reach |
| `reach_goal` | INTEGER | DEFAULT 0 | Target reach |
| `engagement` | NUMERIC(5,2) | DEFAULT 0 | Engagement percentage |
| `engagement_goal` | NUMERIC(5,2) | DEFAULT 0 | Target engagement |
| `impressions` | INTEGER | DEFAULT 0 | Total impressions |
| `clicks` | INTEGER | DEFAULT 0 | Total clicks |
| `conversions` | INTEGER | DEFAULT 0 | Total conversions |
| `revenue` | NUMERIC(12,2) | DEFAULT 0 | Revenue generated |
| `channels` | TEXT[] | DEFAULT '{}' | 📊 Array of channel names |
| `tags` | TEXT[] | DEFAULT '{}' | 📊 Array of tags (includes priority) |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | |
| `updated_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | |
| `deleted_at` | TIMESTAMPTZ | DEFAULT NULL | 🆕 Soft delete |

**Foreign Keys:**
- `tenant_id` → `sys_tenants(id)`
- `owner_id` → `hr_staff(id)`

**Indexes:**
- `idx_mkt_campaigns_tenant_id` (tenant_id)
- `idx_mkt_campaigns_tenant_status` (tenant_id, status)
- `idx_mkt_campaigns_tenant_type` (tenant_id, type)
- `idx_mkt_campaigns_owner_id` (owner_id)
- `idx_mkt_campaigns_dates` (start_date, end_date)
- `idx_mkt_campaigns_tags` USING GIN(tags)
- `idx_mkt_campaigns_deleted_at` (deleted_at) WHERE deleted_at IS NULL

---

#### `mkt_campaign_goals` 🆕 NEW
**Status**: Campaign goals and objectives

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `campaign_id` | BIGINT | FK → `mkt_campaigns.id`, NOT NULL | |
| `goal_text` | TEXT | NOT NULL | Goal description |
| `target_value` | NUMERIC(12,2) | DEFAULT NULL | Target metric value |
| `achieved_value` | NUMERIC(12,2) | DEFAULT NULL | Achieved metric value |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | |
| `updated_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | |

**Foreign Keys:**
- `campaign_id` → `mkt_campaigns(id)` ON DELETE CASCADE

**Indexes:**
- `idx_mkt_campaign_goals_campaign_id` (campaign_id)

---

#### `mkt_campaign_activities` 🆕 NEW
**Status**: Individual activities within campaigns

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `campaign_id` | BIGINT | FK → `mkt_campaigns.id`, NOT NULL | |
| `title` | VARCHAR(500) | NOT NULL | Activity title |
| `type` | VARCHAR(50) | NOT NULL | ✅ 'email', 'social', 'paid-ads', 'content', 'event', 'launch' |
| `status` | VARCHAR(50) | NOT NULL DEFAULT 'scheduled' | ✅ 'scheduled', 'active', 'completed', 'draft' |
| `date` | DATE | NOT NULL | Activity date |
| `start_time` | TIME | DEFAULT NULL | Activity start time |
| `end_time` | TIME | DEFAULT NULL | Activity end time |
| `duration` | INTEGER | DEFAULT 1 | Duration in days |
| `budget` | NUMERIC(12,2) | DEFAULT NULL | Activity budget |
| `reach` | INTEGER | DEFAULT NULL | Expected reach |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | |
| `updated_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | |

**Foreign Keys:**
- `campaign_id` → `mkt_campaigns(id)` ON DELETE CASCADE

**Indexes:**
- `idx_mkt_campaign_activities_campaign_id` (campaign_id)
- `idx_mkt_campaign_activities_date` (date)
- `idx_mkt_campaign_activities_status` (status)

---

#### `mkt_campaign_tasks` 🆕 NEW
**Status**: Tasks associated with campaigns

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `campaign_id` | BIGINT | FK → `mkt_campaigns.id`, NOT NULL | |
| `title` | VARCHAR(500) | NOT NULL | Task title |
| `status` | VARCHAR(50) | NOT NULL DEFAULT 'pending' | ✅ 'pending', 'in-progress', 'completed' |
| `assignee_id` | INTEGER | FK → `hr_staff.id`, DEFAULT NULL | ✏️ Changed from staff.id |
| `due_date` | DATE | DEFAULT NULL | Task due date |
| `priority` | VARCHAR(20) | DEFAULT 'medium' | ✅ 'high', 'medium', 'low' |
| `description` | TEXT | DEFAULT NULL | Task description |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | |
| `updated_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | |

**Foreign Keys:**
- `campaign_id` → `mkt_campaigns(id)` ON DELETE CASCADE
- `assignee_id` → `hr_staff(id)` ON DELETE SET NULL

**Indexes:**
- `idx_mkt_campaign_tasks_campaign_id` (campaign_id)
- `idx_mkt_campaign_tasks_assignee_id` (assignee_id)
- `idx_mkt_campaign_tasks_status` (status)
- `idx_mkt_campaign_tasks_due_date` (due_date)

---

#### `mkt_campaign_metrics` 🆕 NEW
**Status**: Campaign performance metrics

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `campaign_id` | BIGINT | FK → `mkt_campaigns.id`, NOT NULL | |
| `metric_name` | VARCHAR(200) | NOT NULL | Metric name |
| `goal_value` | TEXT | DEFAULT NULL | Target value |
| `result_value` | TEXT | DEFAULT NULL | Actual value |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | |
| `updated_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | |

**Foreign Keys:**
- `campaign_id` → `mkt_campaigns(id)` ON DELETE CASCADE

**Indexes:**
- `idx_mkt_campaign_metrics_campaign_id` (campaign_id)

---

#### `mkt_campaign_files` 🆕 NEW
**Status**: Files attached to campaigns

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `campaign_id` | BIGINT | FK → `mkt_campaigns.id`, NOT NULL | |
| `file_name` | VARCHAR(500) | NOT NULL | File name |
| `file_size` | VARCHAR(50) | DEFAULT NULL | File size (e.g., "2.4 MB") |
| `file_url` | VARCHAR(1000) | NOT NULL | File URL/path |
| `upload_date` | DATE | DEFAULT CURRENT_DATE | |
| `uploaded_by` | INTEGER | FK → `hr_staff.id`, DEFAULT NULL | ✏️ Changed from staff.id |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | |

**Foreign Keys:**
- `campaign_id` → `mkt_campaigns(id)` ON DELETE CASCADE
- `uploaded_by` → `hr_staff(id)` ON DELETE SET NULL

**Indexes:**
- `idx_mkt_campaign_files_campaign_id` (campaign_id)

---

## Promotions Management Tables

#### `mkt_promotions` 🆕 NEW
**Status**: Promotional campaigns and discount codes

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `tenant_id` | INTEGER | FK → `sys_tenants.id`, NOT NULL | 🆕 Multi-tenancy |
| `name` | VARCHAR(200) | NOT NULL | Promotion name |
| `code` | VARCHAR(100) | NOT NULL | ✅ UNIQUE per tenant |
| `type` | VARCHAR(50) | NOT NULL | ✅ 'percentage', 'fixed_amount', 'free_shipping', 'buy_x_get_y', 'buy_more_get_more' |
| `status` | VARCHAR(50) | NOT NULL DEFAULT 'draft' | ✅ 'active', 'scheduled', 'draft', 'expired', 'archived' |
| `is_active` | BOOLEAN | DEFAULT TRUE | Active flag |
| `percentage_value` | NUMERIC(5,2) | DEFAULT NULL | Discount percentage (0-100) |
| `value_amount` | NUMERIC(12,2) | DEFAULT NULL | Fixed discount amount |
| `buy_quantity` | INTEGER | DEFAULT NULL | Buy X quantity |
| `get_quantity` | INTEGER | DEFAULT NULL | Get Y quantity |
| `bogo_discount_percent` | INTEGER | DEFAULT NULL | BOGO discount percentage |
| `bmgm_mode` | VARCHAR(20) | DEFAULT NULL | ✅ 'discount', 'product' |
| `bmgm_discount_percent` | INTEGER | DEFAULT NULL | BMGM discount percentage |
| `minimum_purchase` | NUMERIC(12,2) | DEFAULT NULL | Minimum purchase amount |
| `max_discount` | NUMERIC(12,2) | DEFAULT NULL | Maximum discount cap |
| `start_date` | DATE | NOT NULL | Promotion start date |
| `end_date` | DATE | NOT NULL | Promotion end date |
| `target_audience` | VARCHAR(200) | DEFAULT NULL | Target audience |
| `redemptions` | INTEGER | DEFAULT 0 | Number of redemptions |
| `revenue` | VARCHAR(100) | DEFAULT NULL | Revenue impact (text) |
| `usage_limit` | INTEGER | DEFAULT NULL | Maximum usage limit |
| `used_count` | INTEGER | DEFAULT 0 | Current usage count |
| `description` | TEXT | DEFAULT NULL | Promotion description |
| `is_auto_apply` | BOOLEAN | DEFAULT FALSE | Auto-apply flag |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | |
| `updated_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | |
| `deleted_at` | TIMESTAMPTZ | DEFAULT NULL | 🆕 Soft delete |

**Foreign Keys:**
- `tenant_id` → `sys_tenants(id)`

**Constraints:**
- UNIQUE(`tenant_id`, `code`)
- CHECK(`end_date` >= `start_date`)
- CHECK(`percentage_value` IS NULL OR (`percentage_value` >= 0 AND `percentage_value` <= 100))

**Indexes:**
- `idx_mkt_promotions_tenant_id` (tenant_id)
- `idx_mkt_promotions_tenant_code` (UNIQUE, tenant_id, code)
- `idx_mkt_promotions_status` (status)
- `idx_mkt_promotions_dates` (start_date, end_date)
- `idx_mkt_promotions_type` (type)

---

#### `mkt_promotion_campaigns` 🆕 NEW (Junction Table)
**Status**: Links promotions to campaigns

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `promotion_id` | BIGINT | FK → `mkt_promotions.id`, NOT NULL | |
| `campaign_id` | BIGINT | FK → `mkt_campaigns.id`, NOT NULL | |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | |
| PRIMARY KEY (`promotion_id`, `campaign_id`) | | | |

**Foreign Keys:**
- `promotion_id` → `mkt_promotions(id)` ON DELETE CASCADE
- `campaign_id` → `mkt_campaigns(id)` ON DELETE CASCADE

**Indexes:**
- `idx_mkt_promotion_campaigns_promotion` (promotion_id)
- `idx_mkt_promotion_campaigns_campaign` (campaign_id)

---

#### `mkt_promotion_channels` 🆕 NEW (Junction Table)
**Status**: Links promotions to marketing channels

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `promotion_id` | BIGINT | FK → `mkt_promotions.id`, NOT NULL | |
| `channel_id` | BIGINT | FK → `mkt_marketing_channels.id`, NOT NULL | |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | |
| PRIMARY KEY (`promotion_id`, `channel_id`) | | | |

**Foreign Keys:**
- `promotion_id` → `mkt_promotions(id)` ON DELETE CASCADE
- `channel_id` → `mkt_marketing_channels(id)` ON DELETE CASCADE

---

#### `mkt_promotion_products` 🆕 NEW (Junction Table)
**Status**: Links promotions to products

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `promotion_id` | BIGINT | FK → `mkt_promotions.id`, NOT NULL | |
| `product_id` | BIGINT | FK → `product.id`, NOT NULL | |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | |
| PRIMARY KEY (`promotion_id`, `product_id`) | | | |

**Foreign Keys:**
- `promotion_id` → `mkt_promotions(id)` ON DELETE CASCADE
- `product_id` → `product(id)` ON DELETE CASCADE

---

#### `mkt_promotion_categories` 🆕 NEW (Junction Table)
**Status**: Links promotions to product categories

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `promotion_id` | BIGINT | FK → `mkt_promotions.id`, NOT NULL | |
| `category_id` | BIGINT | FK → `category.id`, NOT NULL | |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | |
| PRIMARY KEY (`promotion_id`, `category_id`) | | | |

**Foreign Keys:**
- `promotion_id` → `mkt_promotions(id)` ON DELETE CASCADE
- `category_id` → `category(id)` ON DELETE CASCADE

---

#### `mkt_promotion_attributes` 🆕 NEW (Junction Table)
**Status**: Links promotions to product attributes

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `promotion_id` | BIGINT | FK → `mkt_promotions.id`, NOT NULL | |
| `attribute_id` | BIGINT | FK → `product_attribute.id`, NOT NULL | |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | |
| PRIMARY KEY (`promotion_id`, `attribute_id`) | | | |

**Foreign Keys:**
- `promotion_id` → `mkt_promotions(id)` ON DELETE CASCADE
- `attribute_id` → `product_attribute(id)` ON DELETE CASCADE

---

#### `mkt_promotion_exclusions` 🆕 NEW
**Status**: Products/categories/attributes excluded from promotions

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `promotion_id` | BIGINT | FK → `mkt_promotions.id`, NOT NULL | |
| `exclusion_type` | VARCHAR(50) | NOT NULL | ✅ 'product', 'category', 'attribute' |
| `excluded_id` | BIGINT | NOT NULL | ID of excluded entity (polymorphic) |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | |

**Foreign Keys:**
- `promotion_id` → `mkt_promotions(id)` ON DELETE CASCADE

**Indexes:**
- `idx_mkt_promotion_exclusions_promotion` (promotion_id)
- `idx_mkt_promotion_exclusions_type` (exclusion_type, excluded_id)

---

#### `mkt_promotion_bmgm_products` 🆕 NEW (Junction Table)
**Status**: Products for Buy More Get More promotions

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `promotion_id` | BIGINT | FK → `mkt_promotions.id`, NOT NULL | |
| `product_id` | BIGINT | FK → `product.id`, NOT NULL | |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | |
| PRIMARY KEY (`promotion_id`, `product_id`) | | | |

**Foreign Keys:**
- `promotion_id` → `mkt_promotions(id)` ON DELETE CASCADE
- `product_id` → `product(id)` ON DELETE CASCADE

---

#### `mkt_promotion_free_items` 🆕 NEW
**Status**: Free items for promotions

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `promotion_id` | BIGINT | FK → `mkt_promotions.id`, NOT NULL | |
| `product_id` | BIGINT | FK → `product.id`, NOT NULL | |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | |

**Foreign Keys:**
- `promotion_id` → `mkt_promotions(id)` ON DELETE CASCADE
- `product_id` → `product(id)` ON DELETE CASCADE

**Indexes:**
- `idx_mkt_promotion_free_items_promotion` (promotion_id)

---

## Asset Library Management Tables

#### `mkt_asset_folders` 🆕 NEW
**Status**: Asset folder organization

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `tenant_id` | INTEGER | FK → `sys_tenants.id`, NOT NULL | 🆕 Multi-tenancy |
| `name` | VARCHAR(200) | NOT NULL | Folder name |
| `description` | TEXT | DEFAULT NULL | Folder description |
| `parent_folder_id` | BIGINT | FK → `mkt_asset_folders.id`, DEFAULT NULL | Self-referential |
| `item_count` | INTEGER | DEFAULT 0 | Number of items in folder |
| `color` | VARCHAR(20) | DEFAULT NULL | Folder color (hex) |
| `last_modified` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | |
| `modified_by` | INTEGER | FK → `hr_staff.id`, DEFAULT NULL | ✏️ Changed from staff.id |
| `ai_optimized` | BOOLEAN | DEFAULT FALSE | AI optimization flag |
| `tags` | TEXT[] | DEFAULT '{}' | 📊 Array of tags |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | |
| `updated_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | |
| `deleted_at` | TIMESTAMPTZ | DEFAULT NULL | 🆕 Soft delete |

**Foreign Keys:**
- `tenant_id` → `sys_tenants(id)`
- `parent_folder_id` → `mkt_asset_folders(id)` ON DELETE SET NULL
- `modified_by` → `hr_staff(id)` ON DELETE SET NULL

**Indexes:**
- `idx_mkt_asset_folders_tenant_id` (tenant_id)
- `idx_mkt_asset_folders_parent` (parent_folder_id)
- `idx_mkt_asset_folders_tags` USING GIN(tags)
- `idx_mkt_asset_folders_deleted_at` (deleted_at) WHERE deleted_at IS NULL

---

#### `mkt_marketing_assets` 🆕 NEW
**Status**: Marketing assets (images, videos, documents, templates)

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `tenant_id` | INTEGER | FK → `sys_tenants.id`, NOT NULL | 🆕 Multi-tenancy |
| `name` | VARCHAR(500) | NOT NULL | Asset name |
| `type` | VARCHAR(50) | NOT NULL | ✅ 'image', 'video', 'document', 'template', 'graphic' |
| `category` | VARCHAR(200) | DEFAULT NULL | Asset category |
| `size` | VARCHAR(50) | DEFAULT NULL | File size (e.g., "2.4 MB") |
| `format` | VARCHAR(50) | DEFAULT NULL | File format (e.g., "PNG", "MP4") |
| `dimensions` | VARCHAR(100) | DEFAULT NULL | Dimensions (e.g., "1920x1080") |
| `url` | VARCHAR(1000) | NOT NULL | Asset URL |
| `thumbnail_url` | VARCHAR(1000) | DEFAULT NULL | Thumbnail URL |
| `folder_id` | BIGINT | FK → `mkt_asset_folders.id`, DEFAULT NULL | |
| `date_added` | DATE | DEFAULT CURRENT_DATE | |
| `added_by` | INTEGER | FK → `hr_staff.id`, DEFAULT NULL | ✏️ Changed from staff.id |
| `usage_count` | INTEGER | DEFAULT 0 | Number of times used |
| `ai_score` | INTEGER | DEFAULT NULL | ✅ CHECK (0-100) |
| `tags` | TEXT[] | DEFAULT '{}' | 📊 Array of tags |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | |
| `updated_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | |
| `deleted_at` | TIMESTAMPTZ | DEFAULT NULL | 🆕 Soft delete |

**Foreign Keys:**
- `tenant_id` → `sys_tenants(id)`
- `folder_id` → `mkt_asset_folders(id)` ON DELETE SET NULL
- `added_by` → `hr_staff(id)` ON DELETE SET NULL

**Indexes:**
- `idx_mkt_marketing_assets_tenant_id` (tenant_id)
- `idx_mkt_marketing_assets_type` (type)
- `idx_mkt_marketing_assets_folder_id` (folder_id)
- `idx_mkt_marketing_assets_tags` USING GIN(tags)
- `idx_mkt_marketing_assets_deleted_at` (deleted_at) WHERE deleted_at IS NULL

---

## Brand Hub Management Tables (Optimized - 4 tables)

#### `mkt_brand_settings` 🆕 NEW
**Status**: Brand identity (single row per tenant)

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | INTEGER | PRIMARY KEY, DEFAULT 1 | Single row per tenant |
| `tenant_id` | INTEGER | FK → `sys_tenants.id`, NOT NULL, UNIQUE | 🆕 Multi-tenancy |
| `story` | TEXT | DEFAULT NULL | Brand story |
| `slogan` | VARCHAR(500) | DEFAULT NULL | Brand slogan |
| `tagline` | VARCHAR(500) | DEFAULT NULL | Brand tagline |
| `vision` | TEXT | DEFAULT NULL | Brand vision |
| `mission` | TEXT | DEFAULT NULL | Brand mission |
| `updated_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | |

**Foreign Keys:**
- `tenant_id` → `sys_tenants(id)`

**Constraints:**
- UNIQUE(`tenant_id`)

**Indexes:**
- `idx_mkt_brand_settings_tenant_id` (UNIQUE, tenant_id)

**Note:** This is a single-row configuration table. Only one brand identity exists per tenant.

---

#### `mkt_brand_colors` 🆕 NEW
**Status**: Brand color palette

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `tenant_id` | INTEGER | FK → `sys_tenants.id`, NOT NULL | 🆕 Multi-tenancy |
| `name` | VARCHAR(200) | NOT NULL | Color name |
| `hex` | VARCHAR(20) | NOT NULL | Hex color code |
| `category` | VARCHAR(50) | NOT NULL | ✅ 'primary', 'secondary', 'neutral' |
| `usage` | VARCHAR(500) | DEFAULT NULL | Usage description |
| `sort_order` | INTEGER | DEFAULT 0 | Display order |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | |
| `updated_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | |

**Foreign Keys:**
- `tenant_id` → `sys_tenants(id)`

**Indexes:**
- `idx_mkt_brand_colors_tenant_id` (tenant_id)
- `idx_mkt_brand_colors_category` (category)
- `idx_mkt_brand_colors_sort` (tenant_id, category, sort_order)

---

#### `mkt_brand_typography` 🆕 NEW
**Status**: Brand typography styles

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `tenant_id` | INTEGER | FK → `sys_tenants.id`, NOT NULL | 🆕 Multi-tenancy |
| `name` | VARCHAR(200) | NOT NULL | Typography name |
| `size` | VARCHAR(50) | NOT NULL | Font size (e.g., "48px") |
| `weight` | VARCHAR(50) | NOT NULL | Font weight (e.g., "600") |
| `line_height` | VARCHAR(50) | NOT NULL | Line height (e.g., "1.2") |
| `category` | VARCHAR(50) | NOT NULL | ✅ 'headings', 'body' |
| `usage` | VARCHAR(500) | DEFAULT NULL | Usage description |
| `sort_order` | INTEGER | DEFAULT 0 | Display order |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | |
| `updated_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | |

**Foreign Keys:**
- `tenant_id` → `sys_tenants(id)`

**Indexes:**
- `idx_mkt_brand_typography_tenant_id` (tenant_id)
- `idx_mkt_brand_typography_category` (category)
- `idx_mkt_brand_typography_sort` (tenant_id, category, sort_order)

---

#### `mkt_brand_logos` 🆕 NEW
**Status**: Brand logo variations

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `tenant_id` | INTEGER | FK → `sys_tenants.id`, NOT NULL | 🆕 Multi-tenancy |
| `name` | VARCHAR(200) | NOT NULL | Logo name |
| `variation_type` | VARCHAR(50) | NOT NULL | ✅ 'primary', 'dark', 'icon_only', 'monochrome' |
| `logo_url` | VARCHAR(1000) | NOT NULL | Logo URL |
| `thumbnail_url` | VARCHAR(1000) | DEFAULT NULL | Thumbnail URL |
| `background_color` | VARCHAR(20) | DEFAULT NULL | Background color (hex) |
| `is_dark` | BOOLEAN | DEFAULT FALSE | Dark background variant |
| `description` | TEXT | DEFAULT NULL | Logo description |
| `sort_order` | INTEGER | DEFAULT 0 | Display order |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | |
| `updated_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | |

**Foreign Keys:**
- `tenant_id` → `sys_tenants(id)`

**Indexes:**
- `idx_mkt_brand_logos_tenant_id` (tenant_id)
- `idx_mkt_brand_logos_variation` (variation_type)
- `idx_mkt_brand_logos_sort` (tenant_id, sort_order)

---

#### `mkt_brand_guidelines` 🆕 NEW
**Status**: Brand guidelines and rules

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `tenant_id` | INTEGER | FK → `sys_tenants.id`, NOT NULL | 🆕 Multi-tenancy |
| `title` | VARCHAR(200) | NOT NULL | Guideline title |
| `category` | VARCHAR(50) | NOT NULL | ✅ 'logo_usage', 'typography_rules', 'color_application', 'voice_tone' |
| `items` | JSONB | DEFAULT '[]' | 📊 Array of guideline items (stored as JSON) |
| `sort_order` | INTEGER | DEFAULT 0 | Display order |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | |
| `updated_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | |

**Foreign Keys:**
- `tenant_id` → `sys_tenants(id)`

**Indexes:**
- `idx_mkt_brand_guidelines_tenant_id` (tenant_id)
- `idx_mkt_brand_guidelines_category` (category)
- `idx_mkt_brand_guidelines_items` USING GIN(items)

**Note:** `items` stored as JSONB array instead of separate junction table for simplicity.

---

## Resources Management Tables

#### `mkt_affiliates` 🆕 NEW
**Status**: Affiliates, KOLs, and influencers

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `tenant_id` | INTEGER | FK → `sys_tenants.id`, NOT NULL | 🆕 Multi-tenancy |
| `name` | VARCHAR(200) | NOT NULL | Affiliate name |
| `type` | VARCHAR(50) | NOT NULL | ✅ 'Affiliate', 'KOL', 'Influencer' |
| `email` | VARCHAR(200) | NOT NULL | Contact email |
| `platform` | VARCHAR(200) | DEFAULT NULL | Platform (e.g., "Instagram") |
| `commission_rate` | NUMERIC(5,2) | DEFAULT 0 | Commission rate percentage |
| `revenue` | NUMERIC(12,2) | DEFAULT 0 | Total revenue generated |
| `status` | VARCHAR(50) | NOT NULL DEFAULT 'pending' | ✅ 'active', 'inactive', 'pending' |
| `join_date` | DATE | DEFAULT CURRENT_DATE | Join date |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | |
| `updated_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | |
| `deleted_at` | TIMESTAMPTZ | DEFAULT NULL | 🆕 Soft delete |

**Foreign Keys:**
- `tenant_id` → `sys_tenants(id)`

**Indexes:**
- `idx_mkt_affiliates_tenant_id` (tenant_id)
- `idx_mkt_affiliates_type` (type)
- `idx_mkt_affiliates_status` (status)
- `idx_mkt_affiliates_email` (email)

---

#### `mkt_utm_links` 🆕 NEW
**Status**: UTM tracking links

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `tenant_id` | INTEGER | FK → `sys_tenants.id`, NOT NULL | 🆕 Multi-tenancy |
| `name` | VARCHAR(200) | NOT NULL | Link name |
| `url` | TEXT | NOT NULL | Full URL with UTM parameters |
| `short_url` | VARCHAR(200) | NOT NULL | Shortened URL |
| `campaign` | VARCHAR(200) | NOT NULL | UTM campaign |
| `source` | VARCHAR(200) | NOT NULL | UTM source |
| `medium` | VARCHAR(200) | NOT NULL | UTM medium |
| `clicks` | INTEGER | DEFAULT 0 | Total clicks |
| `conversions` | INTEGER | DEFAULT 0 | Total conversions |
| `created_date` | DATE | DEFAULT CURRENT_DATE | Creation date |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | |
| `updated_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | |
| `deleted_at` | TIMESTAMPTZ | DEFAULT NULL | 🆕 Soft delete |

**Foreign Keys:**
- `tenant_id` → `sys_tenants(id)`

**Indexes:**
- `idx_mkt_utm_links_tenant_id` (tenant_id)
- `idx_mkt_utm_links_campaign` (campaign)
- `idx_mkt_utm_links_short_url` (short_url)

---

#### `mkt_reference_documents` 🆕 NEW
**Status**: Reference documents and resources

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `tenant_id` | INTEGER | FK → `sys_tenants.id`, NOT NULL | 🆕 Multi-tenancy |
| `title` | VARCHAR(500) | NOT NULL | Document title |
| `category` | VARCHAR(200) | NOT NULL | Document category |
| `description` | TEXT | DEFAULT NULL | Document description |
| `file_url` | VARCHAR(1000) | DEFAULT NULL | File URL |
| `size` | VARCHAR(50) | DEFAULT NULL | File size |
| `updated_date` | DATE | DEFAULT CURRENT_DATE | Last update date |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | |
| `updated_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | |
| `deleted_at` | TIMESTAMPTZ | DEFAULT NULL | 🆕 Soft delete |

**Foreign Keys:**
- `tenant_id` → `sys_tenants(id)`

**Indexes:**
- `idx_mkt_reference_docs_tenant_id` (tenant_id)
- `idx_mkt_reference_docs_category` (category)

---

#### `mkt_marketing_channels` 🆕 NEW
**Status**: Marketing channels

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `tenant_id` | INTEGER | FK → `sys_tenants.id`, NOT NULL | 🆕 Multi-tenancy |
| `name` | VARCHAR(200) | NOT NULL | Channel name |
| `type` | VARCHAR(200) | NOT NULL | Channel type |
| `platform` | VARCHAR(200) | NOT NULL | Platform name |
| `reach` | INTEGER | DEFAULT 0 | Channel reach |
| `engagement` | NUMERIC(5,2) | DEFAULT 0 | Engagement percentage |
| `status` | VARCHAR(50) | NOT NULL DEFAULT 'active' | ✅ 'active', 'inactive' |
| `budget` | NUMERIC(12,2) | DEFAULT NULL | Channel budget |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | |
| `updated_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | |
| `deleted_at` | TIMESTAMPTZ | DEFAULT NULL | 🆕 Soft delete |

**Foreign Keys:**
- `tenant_id` → `sys_tenants(id)`

**Indexes:**
- `idx_mkt_marketing_channels_tenant_id` (tenant_id)
- `idx_mkt_marketing_channels_status` (status)
- `idx_mkt_marketing_channels_platform` (platform)

---

## Supporting Tables

#### `mkt_campaign_activities_history` 🆕 NEW
**Status**: History of activity date changes

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `activity_id` | BIGINT | FK → `mkt_campaign_activities.id`, NOT NULL | |
| `old_date` | DATE | NOT NULL | Previous date |
| `new_date` | DATE | NOT NULL | New date |
| `changed_by` | INTEGER | FK → `sys_users.id`, NOT NULL | |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | |

**Foreign Keys:**
- `activity_id` → `mkt_campaign_activities(id)` ON DELETE CASCADE
- `changed_by` → `sys_users(id)`

**Indexes:**
- `idx_mkt_campaign_activities_history_activity` (activity_id)

---

#### `mkt_promotion_redemptions` 🆕 NEW
**Status**: Promotion redemption tracking

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `promotion_id` | BIGINT | FK → `mkt_promotions.id`, NOT NULL | |
| `order_id` | BIGINT | FK → `orders.id`, DEFAULT NULL | |
| `customer_id` | BIGINT | FK → `crm_customers.id`, DEFAULT NULL | |
| `discount_amount` | NUMERIC(12,2) | DEFAULT 0 | Discount applied |
| `redeemed_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | |

**Foreign Keys:**
- `promotion_id` → `mkt_promotions(id)` ON DELETE CASCADE
- `order_id` → `orders(id)` ON DELETE SET NULL
- `customer_id` → `crm_customers(id)` ON DELETE SET NULL

**Indexes:**
- `idx_mkt_promotion_redemptions_promotion` (promotion_id)
- `idx_mkt_promotion_redemptions_order` (order_id)
- `idx_mkt_promotion_redemptions_customer` (customer_id)
- `idx_mkt_promotion_redemptions_date` (redeemed_at)

---

## Summary

### Tables in Marketing Department
1. **mkt_campaigns** - Marketing campaigns
2. **mkt_campaign_goals** - Campaign goals
3. **mkt_campaign_activities** - Campaign activities
4. **mkt_campaign_tasks** - Campaign tasks
5. **mkt_campaign_metrics** - Campaign metrics
6. **mkt_campaign_files** - Campaign files
7. **mkt_promotions** - Promotions
8. **mkt_promotion_campaigns** - Promotion-campaign junction
9. **mkt_promotion_channels** - Promotion-channel junction
10. **mkt_promotion_products** - Promotion-product junction
11. **mkt_promotion_categories** - Promotion-category junction
12. **mkt_promotion_attributes** - Promotion-attribute junction
13. **mkt_promotion_exclusions** - Promotion exclusions
14. **mkt_promotion_bmgm_products** - BMGM products junction
15. **mkt_promotion_free_items** - Free items for promotions
16. **mkt_asset_folders** - Asset folders
17. **mkt_marketing_assets** - Marketing assets
18. **mkt_brand_settings** - Brand identity (single row)
19. **mkt_brand_colors** - Brand colors
20. **mkt_brand_typography** - Brand typography
21. **mkt_brand_logos** - Brand logos
22. **mkt_brand_guidelines** - Brand guidelines
23. **mkt_affiliates** - Affiliates/KOLs/Influencers
24. **mkt_utm_links** - UTM tracking links
25. **mkt_reference_documents** - Reference documents
26. **mkt_marketing_channels** - Marketing channels
27. **mkt_campaign_activities_history** - Activity change history
28. **mkt_promotion_redemptions** - Promotion redemption tracking

**Total: 28 tables**

### Key Features
- **Multi-tenancy**: All tables include `tenant_id` for data isolation
- **Staff Integration**: All staff references use `hr_staff.id`
- **Normalization**: Junction tables for many-to-many relationships
- **Soft Deletes**: `deleted_at` fields for main entities
- **Tags System**: Campaigns and assets use tags array (includes priority)
- **Brand Hub Optimization**: Reduced from 6 tables to 4 tables
- **Alert System**: Uses global `sys_alerts` and `sys_alert_keys` tables
- **Data Types**: Proper NUMERIC for monetary values, TIMESTAMPTZ for dates
- **Indexes**: Optimized for common queries with partial indexes
- **Constraints**: CHECK constraints for data validation

### Relationships
- All tables → `sys_tenants.id` (multi-tenancy)
- Staff references → `hr_staff.id`
- Campaigns → `mkt_campaign_*` related tables
- Promotions → Multiple junction tables for products/categories/attributes
- Assets → `mkt_asset_folders` (hierarchical)
- Brand Hub → 4 optimized tables
- Resources → Independent tables for affiliates, UTM, docs, channels

### Integration with Global Systems
- **Alerts**: Uses `sys_alerts` and `sys_alert_keys` (polymorphic)
- **Products**: Links to `product` table for promotions
- **Categories**: Links to `category` table for promotions
- **Orders**: Links to `orders` for promotion redemptions
- **Customers**: Links to `crm_customers` for promotion redemptions

