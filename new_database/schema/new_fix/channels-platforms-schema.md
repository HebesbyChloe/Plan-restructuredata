# Channels & Platforms Schema

## Overview
This document defines the schema for marketing platforms and their associated pages/accounts. The structure supports hierarchical organization: Platforms (top-level channels like Facebook, Instagram, YouTube) contain multiple Pages/Accounts (specific instances within each platform).

**Legend:**
- 🆕 **NEW** - Newly created tables
- ⭐ **ENHANCED** - Enhanced with enterprise features
- 🔗 **Foreign Key** - Relationship to another table
- ⏰ **Timestamp** - Time tracking column

---

## Schema Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                    CHANNELS & PLATFORMS SCHEMA                  │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│  channels_platforms  │ (Top-level: Facebook, Instagram, YouTube, etc.)
│──────────────────────│
│ id (PK)              │
│ tenant_id (FK) ──────┼──► sys_tenants.id
│ name                 │
│ platform_type        │
│ status               │
│ total_reach          │
│ total_engagement     │
│ total_budget         │
│ page_count           │
└────┬─────────────────┘
     │
     └─── 1:N ────► channels_platform_pages (platform_id)

┌──────────────────────┐
│ channels_platform_pages│ (Pages/Accounts within platforms)
│──────────────────────│
│ id (PK)              │
│ tenant_id (FK) ──────┼──► sys_tenants.id
│ platform_id (FK) ────┼──► channels_platforms.id
│ name                 │
│ entity_id            │ (External ID: page_id_meta, account_id, etc.)
│ entity_id_secondary  │ (Secondary external ID: page_id_pancake, etc.)
│ reach                │
│ engagement           │
│ status               │
│ budget               │
└──────────────────────┘
```

---

## Core Tables

### `channels_platforms` 🆕 NEW
**Status**: Marketing platforms (Facebook, Instagram, YouTube, Google Ads, etc.)

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `tenant_id` | INTEGER | FK → `sys_tenants.id`, NOT NULL | 🆕 Multi-tenancy |
| `name` | VARCHAR(200) | NOT NULL | Platform name |
| `platform_type` | VARCHAR(100) | NOT NULL | ✅ 'facebook', 'instagram', 'youtube', 'google-ads', 'tiktok', 'zalo', 'email', 'linkedin' |
| `status` | VARCHAR(50) | NOT NULL DEFAULT 'active' | ✅ 'active', 'inactive' |
| `total_reach` | INTEGER | DEFAULT 0 | Total reach across all pages |
| `total_engagement` | NUMERIC(5,2) | DEFAULT 0 | Total engagement percentage |
| `total_budget` | NUMERIC(12,2) | DEFAULT 0 | Total budget allocated |
| `page_count` | INTEGER | DEFAULT 0 | Number of pages/accounts |
| `metadata` | JSONB | DEFAULT NULL | ⭐ Additional platform data |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | ⏰ |
| `updated_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | ⏰ |
| `deleted_at` | TIMESTAMPTZ | DEFAULT NULL | 🆕 Soft delete |

**Foreign Keys:**
- `tenant_id` → `sys_tenants(id)`

**Constraints:**
- UNIQUE(`tenant_id`, `platform_type`)
- CHECK(`name` != '')
- CHECK(`platform_type` IN ('facebook', 'instagram', 'youtube', 'google-ads', 'tiktok', 'zalo', 'email', 'linkedin', 'twitter', 'pinterest'))

**Indexes:**
- `idx_channels_platforms_tenant_id` (tenant_id)
- `idx_channels_platforms_platform_type` (platform_type)
- `idx_channels_platforms_status` (status)
- `idx_channels_platforms_tenant_platform` (UNIQUE, tenant_id, platform_type)
- `idx_channels_platforms_deleted_at` (deleted_at) WHERE deleted_at IS NULL

**Notes:**
- One platform type per tenant (e.g., only one "Facebook" platform per tenant)
- Aggregated metrics (`total_reach`, `total_engagement`, `total_budget`) can be calculated from child pages
- `page_count` should be maintained via triggers or application logic

---

### `channels_platform_pages` 🆕 NEW
**Status**: Individual pages/accounts within platforms

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `tenant_id` | INTEGER | FK → `sys_tenants.id`, NOT NULL | 🆕 Multi-tenancy |
| `platform_id` | BIGINT | FK → `channels_platforms.id`, NOT NULL | 🔗 Parent platform |
| `name` | VARCHAR(256) | NOT NULL | Page/Account name |
| `entity_id` | VARCHAR(200) | DEFAULT NULL | External entity ID (page_id_meta, account_id, channel_id, etc.) |
| `entity_id_secondary` | VARCHAR(200) | DEFAULT NULL | Secondary external ID (page_id_pancake, etc.) |
| `reach` | INTEGER | DEFAULT 0 | Page reach |
| `engagement` | NUMERIC(5,2) | DEFAULT 0 | Engagement percentage |
| `status` | VARCHAR(50) | NOT NULL DEFAULT 'active' | ✅ 'active', 'inactive' |
| `budget` | NUMERIC(12,2) | DEFAULT NULL | Page budget |
| `metadata` | JSONB | DEFAULT NULL | ⭐ Additional page data (followers, likes, etc.) |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | ⏰ |
| `updated_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | ⏰ |
| `deleted_at` | TIMESTAMPTZ | DEFAULT NULL | 🆕 Soft delete |

**Foreign Keys:**
- `tenant_id` → `sys_tenants(id)`
- `platform_id` → `channels_platforms(id)` ON DELETE CASCADE

**Constraints:**
- UNIQUE(`tenant_id`, `platform_id`, `entity_id`) WHERE `entity_id` IS NOT NULL
- CHECK(`name` != '')
- CHECK(`engagement` >= 0 AND `engagement` <= 100)

**Indexes:**
- `idx_channels_platform_pages_tenant_id` (tenant_id)
- `idx_channels_platform_pages_platform_id` (platform_id)
- `idx_channels_platform_pages_entity_id` (entity_id) WHERE entity_id IS NOT NULL
- `idx_channels_platform_pages_status` (status)
- `idx_channels_platform_pages_tenant_platform` (tenant_id, platform_id)
- `idx_channels_platform_pages_deleted_at` (deleted_at) WHERE deleted_at IS NULL

**Notes:**
- `entity_id` stores external system identifiers (Facebook page ID, Instagram account ID, YouTube channel ID, etc.)
- `entity_id_secondary` can store additional external IDs (e.g., Pancake CRM page ID)
- `metadata` JSONB can store platform-specific data:
  - Facebook: `{"followers": 50000, "likes": 45000, "page_id_meta": "123456789"}`
  - Instagram: `{"followers": 30000, "posts": 500, "username": "@shopchinhthuc"}`
  - YouTube: `{"subscribers": 200000, "videos": 150, "channel_id": "UC1234567890"}`

---

## Example Data

### `channels_platforms` (Top-level platforms)

```sql
Platform 1: Facebook
├── id: 1
├── tenant_id: 1
├── name: "Facebook"
├── platform_type: "facebook"
├── status: "active"
├── total_reach: 800000
├── total_engagement: 8.5
├── total_budget: 50000000
└── page_count: 3

Platform 2: Instagram
├── id: 2
├── tenant_id: 1
├── name: "Instagram"
├── platform_type: "instagram"
├── status: "active"
├── total_reach: 500000
├── total_engagement: 12.3
├── total_budget: 30000000
└── page_count: 2

Platform 3: YouTube
├── id: 3
├── tenant_id: 1
├── name: "YouTube"
├── platform_type: "youtube"
├── status: "active"
├── total_reach: 2000000
├── total_engagement: 5.2
├── total_budget: 100000000
└── page_count: 2
```

### `channels_platform_pages` (Individual pages/accounts)

```sql
-- Facebook Pages
Page 1:
├── id: 1
├── tenant_id: 1
├── platform_id: 1 (Facebook)
├── name: "Shop Chính thức"
├── entity_id: "123456789" (page_id_meta)
├── entity_id_secondary: "PANC123" (page_id_pancake)
├── reach: 500000
├── engagement: 8.5
├── status: "active"
└── metadata: {"followers": 50000, "likes": 45000, "page_id_pancake": "PANC123"}

Page 2:
├── id: 2
├── tenant_id: 1
├── platform_id: 1 (Facebook)
├── name: "Shop Bán hàng"
├── entity_id: "987654321"
├── reach: 200000
├── engagement: 7.2
├── status: "active"
└── metadata: {"followers": 20000, "likes": 18000}

Page 3:
├── id: 3
├── tenant_id: 1
├── platform_id: 1 (Facebook)
├── name: "Shop Hỗ trợ"
├── entity_id: "555555555"
├── reach: 100000
├── engagement: 9.1
├── status: "active"
└── metadata: {"followers": 10000, "likes": 9500}

-- Instagram Accounts
Page 4:
├── id: 4
├── tenant_id: 1
├── platform_id: 2 (Instagram)
├── name: "@shopchinhthuc"
├── entity_id: "@shopchinhthuc"
├── reach: 300000
├── engagement: 12.5
├── status: "active"
└── metadata: {"followers": 30000, "posts": 500, "username": "@shopchinhthuc"}

Page 5:
├── id: 5
├── tenant_id: 1
├── platform_id: 2 (Instagram)
├── name: "@shopbanhang"
├── entity_id: "@shopbanhang"
├── reach: 200000
├── engagement: 12.0
├── status: "active"
└── metadata: {"followers": 20000, "posts": 300, "username": "@shopbanhang"}

-- YouTube Channels
Page 6:
├── id: 6
├── tenant_id: 1
├── platform_id: 3 (YouTube)
├── name: "Shop Official"
├── entity_id: "UC1234567890"
├── reach: 1500000
├── engagement: 5.5
├── status: "active"
└── metadata: {"subscribers": 150000, "videos": 200, "channel_id": "UC1234567890"}

Page 7:
├── id: 7
├── tenant_id: 1
├── platform_id: 3 (YouTube)
├── name: "Shop Reviews"
├── entity_id: "UC9876543210"
├── reach: 500000
├── engagement: 4.8
├── status: "active"
└── metadata: {"subscribers": 50000, "videos": 50, "channel_id": "UC9876543210"}
```

---

## Relationships

### Core Hierarchy
- `channels_platforms` (1) → `channels_platform_pages` (N)
- One platform can have many pages/accounts
- Pages belong to exactly one platform

### Integration with Other Systems
- `channels_platform_pages.id` can be referenced by:
  - `mkt_promotion_channels` (renamed from `mkt_promotion_channels` to use `channels_platform_pages`)
  - `pancake_contact.page_id` → `channels_platform_pages.id` (for Facebook pages)
  - `pancake_message.page_id` → `channels_platform_pages.id` (for Facebook pages)

---

## Common Queries

### Get all pages for a platform
```sql
SELECT pp.*
FROM channels_platform_pages pp
JOIN channels_platforms p ON pp.platform_id = p.id
WHERE p.platform_type = 'facebook' 
  AND pp.tenant_id = 1
  AND pp.deleted_at IS NULL;
```

### Get aggregated metrics for a platform
```sql
SELECT 
  p.name,
  p.platform_type,
  COUNT(pp.id) as page_count,
  SUM(pp.reach) as total_reach,
  AVG(pp.engagement) as avg_engagement,
  SUM(pp.budget) as total_budget
FROM channels_platforms p
LEFT JOIN channels_platform_pages pp ON p.id = pp.platform_id 
  AND pp.deleted_at IS NULL
WHERE p.id = 1
GROUP BY p.id, p.name, p.platform_type;
```

### Get all active platforms with page count
```sql
SELECT 
  p.name,
  p.platform_type,
  p.page_count,
  p.total_reach,
  p.total_engagement
FROM channels_platforms p
WHERE p.tenant_id = 1
  AND p.status = 'active'
  AND p.deleted_at IS NULL
ORDER BY p.total_reach DESC;
```

### Find page by external ID
```sql
SELECT pp.*, p.name as platform_name, p.platform_type
FROM channels_platform_pages pp
JOIN channels_platforms p ON pp.platform_id = p.id
WHERE pp.entity_id = '123456789'
  AND pp.tenant_id = 1
  AND pp.deleted_at IS NULL;
```

---

## Summary

### Tables
1. **channels_platforms** - Top-level marketing platforms (Facebook, Instagram, YouTube, etc.)
2. **channels_platform_pages** - Individual pages/accounts within each platform

### Key Features
- **Hierarchical Structure**: Platform → Pages (1:N relationship)
- **Multi-tenancy**: All tables include `tenant_id` for data isolation
- **External IDs**: Support for external system identifiers (`entity_id`, `entity_id_secondary`)
- **Flexible Metadata**: JSONB fields for platform-specific data
- **Soft Deletes**: `deleted_at` fields for main entities
- **Aggregated Metrics**: Platform-level totals calculated from pages
- **Performance**: Optimized indexes for common queries

### Design Principles
1. **Separation of Concerns**: Platforms (top-level) vs Pages (instances)
2. **Flexibility**: Support multiple platforms and their specific data structures
3. **Scalability**: Easy to add new platforms and pages
4. **Integration**: Ready to integrate with promotions, campaigns, and messaging systems

