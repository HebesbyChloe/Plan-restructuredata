# Customer Management Department

## Overview
This document shows the complete Customer Management schema structure with data types, foreign keys, and change indicators.

**Legend:**
- 🆕 **NEW** - Newly created tables
- 🔄 **NORMALIZED** - Comma-separated values moved to junction tables
- 🗑️ **REMOVED** - Fields/tables removed or consolidated
- ✏️ **RENAMED** - Table/column renamed
- 📊 **DENORMALIZED** - Denormalized for performance (if any)

---

## Core Tables

#### `customer` ✏️ (renamed from `db_customer`)
**Status**: Core entity, enhanced with proper data types

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | 🆕 Standardized |
| `full_name` | VARCHAR(200) | DEFAULT 'No Name' | |
| `email` | VARCHAR(300) | NOT NULL | Indexed |
| `phone` | VARCHAR(100) | DEFAULT '' | |
| `lead_id` | VARCHAR(256) | DEFAULT '' | ✏️ Renamed from `id_lead` |
| `address` | VARCHAR(500) | DEFAULT '' | |
| `city` | VARCHAR(100) | DEFAULT '' | |
| `country` | VARCHAR(100) | DEFAULT '' | |
| `post_code` | VARCHAR(30) | DEFAULT '' | |
| `total_amount` | NUMERIC(12,2) | DEFAULT 0 | ✏️ Renamed from `total`, 🔄 Changed from `float` |
| `quantity_paid` | INTEGER | DEFAULT 0 | ✏️ Renamed from `qty_paid` |
| `current_amount` | NUMERIC(12,2) | DEFAULT 0 | 🔄 Changed from `float` |
| `error_phone` | BOOLEAN | DEFAULT FALSE | 🔄 Changed from `tinyint(1)` |
| `error_email` | BOOLEAN | DEFAULT FALSE | 🔄 Changed from `tinyint(1)` |
| `is_new_lead` | BOOLEAN | DEFAULT FALSE | ✏️ Renamed from `new_lead_label`, 🔄 Changed from `tinyint(1)` |
| `recommend_merge` | BOOLEAN | DEFAULT FALSE | 🔄 Changed from `tinyint(1)` |
| `source` | VARCHAR(100) | DEFAULT 'phone' | Indexed |
| `rank` | VARCHAR(300) | DEFAULT 'New Customer' | Indexed |
| `note` | VARCHAR(2000) | DEFAULT '' | |
| `birth` | DATE | DEFAULT NULL | |
| `link_profile` | VARCHAR(300) | DEFAULT '' | |
| `sale_label` | BIGINT | FK → `staff.id`, DEFAULT 0 | Staff ID who labeled the sale |
| `status_potential` | VARCHAR(256) | DEFAULT '' | |
| `last_summary` | TEXT | DEFAULT '' | |
| `emotion` | VARCHAR(100) | DEFAULT 'neutral' | |
| `next_action` | TEXT | DEFAULT NULL | |
| `journey_stage` | VARCHAR(100) | DEFAULT NULL | |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date_created` |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `update_date`, 🆕 Auto-update trigger |
| `created_by_id` | BIGINT | FK → `staff.id` | 🆕 New audit field (replaces `update_by`) |
| `updated_by_id` | BIGINT | FK → `staff.id` | 🆕 New audit field (replaces `update_by`) |

**🗑️ REMOVED FIELDS** (from `db_customer`):
The following fields were removed from the customer table. Review if any should be migrated to other tables or preserved:

| Old Field Name | Data Type (Old) | Reason for Removal | Migration Notes |
|---------------|-----------------|-------------------|-----------------|
| `five_element` | VARCHAR(30) | Business logic removed | Consider if needed for product attributes |
| `infor_customer` | VARCHAR(2000) | Moved to notes/separate table | May need `customer_notes` table |
| `intention` | VARCHAR(100) | Moved to product attributes | See product schema |
| `future_sales_opportunities` | VARCHAR(1000) | Business logic removed | Consider if needed for CRM |
| `last_time_order` | DATETIME | Moved to order aggregation | Can be calculated from `order` table |
| `last_time_reachout` | DATE | Business logic removed | Consider if needed for CRM tracking |
| `birth_month_day` | VARCHAR(50) | Personal data normalization | May need `customer_profile` table |
| `birth_year` | VARCHAR(50) | Personal data normalization | May need `customer_profile` table |
| `link_pancake` | VARCHAR(256) | Moved to pancake_contact | Check `pancake_contact` table |
| `status_lead_contact` | VARCHAR(256) | Business logic removed | Consider if needed for lead management |
| `date_created_potential` | DATETIME | Business logic removed | Consider if needed for lead tracking |
| `check_bug` | TINYINT(4) | Debug field removed | No migration needed |
| `id_batch` | INT(10) | Moved to junction table | Now in `customer_batch_customer` table |

**Foreign Keys:**
- `created_by_id` → `staff(id)`
- `updated_by_id` → `staff(id)`
- `sale_label` → `staff(id)`
- `batch_id` → `customer_batch(id)` (via ALTER TABLE)

**Indexes:**
- `idx_customer_email` - On `email` field
- `idx_customer_rank` - On `rank` field
- `idx_customer_source` - On `source` field
- `idx_customer_created_at` - On `created_at` field
- `idx_customer_batch_id` - On `batch_id` field (if added via ALTER TABLE)
- `idx_customer_phone` - On `phone` field
- `idx_customer_emotion` - On `emotion` field
- `idx_customer_journey_stage` - On `journey_stage` field

---

#### `customer_batch` ✏️ (renamed from `db_customer_batch`)
**Status**: Enhanced with proper relationships

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `batch_name` | VARCHAR(100) | NOT NULL | |
| `assigned_to_staff_id` | BIGINT | FK → `staff.id` | ✏️ Renamed from `assigned_to` |
| `size` | INTEGER | DEFAULT 0 | |
| `status` | VARCHAR(100) | DEFAULT 'new' | |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `created_date` |

**Foreign Keys:**
- `assigned_to_staff_id` → `staff(id)`

**Junction Tables (Normalized):**
- 🆕 `customer_batch_customer` - Normalized from `conversion_customer_id` (TEXT)
- 🆕 `customer_batch_order` - Normalized from `conversion_order_id` (TEXT)

---

#### `customer_batch_customer` 🆕 NEW
**Status**: Junction table (normalized)

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `batch_id` | BIGINT | FK → `customer_batch.id`, NOT NULL | |
| `customer_id` | BIGINT | FK → `customer.id`, NOT NULL | |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |
| UNIQUE(`batch_id`, `customer_id`) | | | |

**Foreign Keys:**
- `batch_id` → `customer_batch(id)` ON DELETE CASCADE
- `customer_id` → `customer(id)` ON DELETE CASCADE

**Indexes:**
- `idx_customer_batch_customer_batch`
- `idx_customer_batch_customer_customer`

---

#### `customer_batch_order` 🆕 NEW
**Status**: Junction table (normalized)

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `batch_id` | BIGINT | FK → `customer_batch.id`, NOT NULL | |
| `order_id` | BIGINT | FK → `order.id`, NOT NULL | |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |
| UNIQUE(`batch_id`, `order_id`) | | | |

**Foreign Keys:**
- `batch_id` → `customer_batch(id)` ON DELETE CASCADE
- `order_id` → `order(id)` ON DELETE CASCADE

**Indexes:**
- `idx_customer_batch_order_batch`
- `idx_customer_batch_order_order`

---

#### `customer_lead_meta` ✏️ (renamed from `db_sub_id_lead`)
**Status**: New structure

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `customer_id` | BIGINT | FK → `customer.id`, NOT NULL | ✏️ Renamed from `id_customer` |
| `lead_id` | VARCHAR(256) | NOT NULL DEFAULT '' | |
| `source` | VARCHAR(200) | NOT NULL DEFAULT 'by_chloe' | |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | 🆕 New |

**Foreign Keys:**
- `customer_id` → `customer(id)`

**Indexes:**
- `idx_customer_lead_meta_customer`

---

#### `pancake_contact` ✏️ (renamed from `db_contact_pancake`)
**Status**: Enhanced with FK

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `customer_id` | BIGINT | FK → `customer.id`, NOT NULL | ✏️ Renamed from `id_customer` |
| `facebook_id` | VARCHAR(100) | DEFAULT '' | ✏️ Renamed from `fb_id` |
| `page_id` | VARCHAR(100) | DEFAULT '' | |
| `pancake_customer_id` | VARCHAR(256) | DEFAULT '' | ✏️ Renamed from `id_cus_pancake` |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date_created` |

**Foreign Keys:**
- `customer_id` → `customer(id)`

**Indexes:**
- `idx_pancake_contact_customer`

---

## Summary

### Tables in Customer Management
1. **customer** - Main customer records
2. **customer_batch** - Customer batches
3. **customer_batch_customer** - Customer-batch junction table (normalized)
4. **customer_batch_order** - Customer batch-order junction table (normalized)
5. **customer_lead_meta** - Customer leads
6. **pancake_contact** - Pancake contact integration

### Key Features
- **Normalization**: Comma-separated customer and order IDs moved to junction tables
- **Data Types**: All monetary values changed from `float` to `NUMERIC(12,2)`
- **Audit Fields**: `created_by_id`, `updated_by_id` for tracking staff actions
- **Indexes**: Optimized for common queries (email, phone, source, batch_id)
- **Field Removal**: 12 fields removed from `db_customer` - see REMOVED FIELDS section above for details
- **Fields Preserved**: `source`, `note`, `birth`, `link_profile`, `sale_label` (FK to staff), `rank`, `status_potential`, `last_summary`, `emotion`, `next_action`, `journey_stage` - kept in customer table

### Relationships
- `customer.created_by_id` → `staff.id`
- `customer.updated_by_id` → `staff.id`
- `customer.sale_label` → `staff.id`
- `customer.batch_id` → `customer_batch.id`
- `customer_batch.assigned_to_staff_id` → `staff.id`
- `customer_batch_customer.batch_id` → `customer_batch.id`
- `customer_batch_customer.customer_id` → `customer.id`
- `customer_batch_order.batch_id` → `customer_batch.id`
- `customer_batch_order.order_id` → `order.id`
- `customer_lead_meta.customer_id` → `customer.id`
- `pancake_contact.customer_id` → `customer.id`

