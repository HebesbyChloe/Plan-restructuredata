# Campaign & Marketing Department

## Overview
This document shows the complete Campaign & Marketing schema structure with data types, foreign keys, and change indicators.

**Legend:**
- 🆕 **NEW** - Newly created tables
- 🔄 **NORMALIZED** - Comma-separated values moved to junction tables
- 🗑️ **REMOVED** - Fields/tables removed or consolidated
- ✏️ **RENAMED** - Table/column renamed
- 📊 **DENORMALIZED** - Denormalized for performance (if any)

---

## Core Tables

#### `campaign` ✏️ (renamed from `db_campaigns`)
**Status**: Marketing campaigns

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `name` | VARCHAR(255) | NOT NULL | |
| `status` | campaign_status | DEFAULT 'draft' | 🆕 ENUM type |
| `spend` | NUMERIC(12,2) | NOT NULL DEFAULT 0.00 | |
| `budget` | NUMERIC(12,2) | NOT NULL DEFAULT 0.00 | |
| `budget_cycle` | budget_cycle | NOT NULL DEFAULT 'monthly' | 🆕 ENUM type |
| `cost_impression_goal` | NUMERIC(10,2) | NOT NULL DEFAULT 0.00 | |
| `cost_lead_goal` | NUMERIC(10,2) | NOT NULL DEFAULT 0.00 | |
| `cost_new_lead_goal` | NUMERIC(10,2) | NOT NULL DEFAULT 0.00 | |
| `cost_order_goal` | NUMERIC(10,2) | NOT NULL DEFAULT 0.00 | |
| `roas_goal` | NUMERIC(5,2) | NOT NULL DEFAULT 0.00 | |
| `start_date` | DATE | NOT NULL | ✏️ Renamed from `time_start` |
| `end_date` | DATE | DEFAULT NULL | ✏️ Renamed from `time_end` |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date_created` |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `updated_at` |

**Removed Fields (Normalized):**
- 🗑️ `ids_ads` (VARCHAR(500)) - Moved to `campaign_ads` junction table
- 🗑️ `ids_ads_running` (VARCHAR(300)) - Moved to `campaign_ads_running` junction table
- 🗑️ `target_audiences` (VARCHAR(500)) - Moved to `campaign_target_audience` junction table
- 🗑️ `collection_selection` (VARCHAR(500)) - Moved to `campaign_collection` junction table

**Junction Tables (Normalized):**
- 🆕 `campaign_ads` - Normalized from `ids_ads`
- 🆕 `campaign_ads_running` - Normalized from `ids_ads_running`
- 🆕 `campaign_target_audience` - Normalized from `target_audiences`
- 🆕 `campaign_collection` - Normalized from `collection_selection`

**Indexes:**
- `idx_campaign_status`
- `idx_campaign_dates`

---

#### `campaign_ads` 🆕 NEW
**Status**: Junction table (normalized)

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `campaign_id` | BIGINT | FK → `campaign.id`, NOT NULL | |
| `ad_id` | VARCHAR(100) | NOT NULL | |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |
| UNIQUE(`campaign_id`, `ad_id`) | | | |

**Foreign Keys:**
- `campaign_id` → `campaign(id)` ON DELETE CASCADE

**Indexes:**
- `idx_campaign_ads_campaign`

---

#### `campaign_ads_running` 🆕 NEW
**Status**: Junction table (normalized)

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `campaign_id` | BIGINT | FK → `campaign.id`, NOT NULL | |
| `ad_id` | VARCHAR(100) | NOT NULL | |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |
| UNIQUE(`campaign_id`, `ad_id`) | | | |

**Foreign Keys:**
- `campaign_id` → `campaign(id)` ON DELETE CASCADE

**Indexes:**
- `idx_campaign_ads_running_campaign`

---

#### `campaign_target_audience` 🆕 NEW
**Status**: Junction table (normalized)

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `campaign_id` | BIGINT | FK → `campaign.id`, NOT NULL | |
| `audience_id` | VARCHAR(100) | NOT NULL | |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |
| UNIQUE(`campaign_id`, `audience_id`) | | | |

**Foreign Keys:**
- `campaign_id` → `campaign(id)` ON DELETE CASCADE

**Indexes:**
- `idx_campaign_target_audience_campaign`

---

#### `campaign_collection` 🆕 NEW
**Status**: Junction table (normalized)

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `campaign_id` | BIGINT | FK → `campaign.id`, NOT NULL | |
| `collection_id` | VARCHAR(100) | NOT NULL | |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |
| UNIQUE(`campaign_id`, `collection_id`) | | | |

**Foreign Keys:**
- `campaign_id` → `campaign(id)` ON DELETE CASCADE

**Indexes:**
- `idx_campaign_collection_campaign`

---

## Communication

#### `pancake_message` ✏️ (renamed from `db_messages_pancake`)
**Status**: Pancake messages

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `page_id` | VARCHAR(100) | NOT NULL DEFAULT '' | |
| `customer_id` | VARCHAR(100) | DEFAULT '' | |
| `crm_customer_id` | BIGINT | FK → `customer.id` | ✏️ Renamed from `customer_id_crm` |
| `conversation_id` | VARCHAR(100) | DEFAULT '' | |
| `admin_id` | VARCHAR(100) | DEFAULT '' | |
| `admin_uid` | VARCHAR(100) | DEFAULT '' | |
| `admin_name` | VARCHAR(100) | DEFAULT '' | |
| `sender_type` | VARCHAR(100) | DEFAULT '' | |
| `sender_name` | VARCHAR(256) | DEFAULT NULL | |
| `message` | TEXT | DEFAULT '' | 🔄 Changed from `varchar(1000)` |
| `attachments` | VARCHAR(3000) | DEFAULT NULL | |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | ✏️ Renamed from `date_created` |

**Foreign Keys:**
- `crm_customer_id` → `customer(id)`

**Indexes:**
- `idx_pancake_message_customer`
- `idx_pancake_message_conversation`

---

#### `pancake_message_summary` ✏️ (renamed from `db_summary_messages_pancake`)
**Status**: Pancake message summaries

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `page_id` | VARCHAR(100) | NOT NULL | |
| `customer_id` | VARCHAR(100) | DEFAULT NULL | |
| `crm_customer_id` | BIGINT | FK → `customer.id` | ✏️ Renamed from `customer_id_crm` |
| `admin_uids` | TEXT | DEFAULT NULL | |
| `admin_names` | TEXT | DEFAULT NULL | |
| `customer_name` | VARCHAR(256) | DEFAULT NULL | |
| `conversation_id` | VARCHAR(100) | DEFAULT NULL | |
| `summary` | TEXT | DEFAULT NULL | |
| `state` | VARCHAR(100) | DEFAULT 'open' | |
| `journey_stage` | VARCHAR(100) | DEFAULT NULL | |
| `emotion` | VARCHAR(100) | DEFAULT 'neutral' | |
| `reply_quality` | TEXT | DEFAULT NULL | |
| `next_action` | TEXT | DEFAULT NULL | |
| `tags` | TEXT | DEFAULT '' | |
| `conversation_start` | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | |
| `conversation_end` | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date_created` |

**Foreign Keys:**
- `crm_customer_id` → `customer(id)`

**Indexes:**
- `idx_pancake_message_summary_customer`

---

## Summary

### Tables in Campaign & Marketing Department
1. **campaign** - Marketing campaigns
2. **campaign_ads** - Campaign ads junction table (normalized)
3. **campaign_ads_running** - Running ads junction table (normalized)
4. **campaign_target_audience** - Target audiences junction table (normalized)
5. **campaign_collection** - Campaign collections junction table (normalized)
6. **pancake_message** - Pancake messages
7. **pancake_message_summary** - Pancake message summaries

### Key Features
- **Normalization**: Comma-separated ad IDs, audiences, and collections moved to junction tables
- **ENUM Types**: Campaign status and budget cycle use ENUM types
- **Foreign Keys**: Proper relationships with customer tables
- **Indexes**: Optimized for common queries (status, dates, customer)

### Relationships
- `campaign_ads.campaign_id` → `campaign(id)`
- `campaign_ads_running.campaign_id` → `campaign(id)`
- `campaign_target_audience.campaign_id` → `campaign(id)`
- `campaign_collection.campaign_id` → `campaign(id)`
- `pancake_message.crm_customer_id` → `customer(id)`
- `pancake_message_summary.crm_customer_id` → `customer(id)`

