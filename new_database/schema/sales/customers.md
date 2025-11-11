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
| `lead_id` | VARCHAR(256) | DEFAULT '' | |
| `address` | VARCHAR(500) | DEFAULT '' | |
| `city` | VARCHAR(100) | DEFAULT '' | |
| `country` | VARCHAR(100) | DEFAULT '' | |
| `post_code` | VARCHAR(30) | DEFAULT '' | |
| `total_amount` | NUMERIC(12,2) | DEFAULT 0 | 🔄 Changed from `float` |
| `quantity_paid` | INTEGER | DEFAULT 0 | ✏️ Renamed from `qty_paid` |
| `current_amount` | NUMERIC(12,2) | DEFAULT 0 | 🔄 Changed from `float` |
| `error_phone` | BOOLEAN | DEFAULT FALSE | 🔄 Changed from `tinyint(1)` |
| `error_email` | BOOLEAN | DEFAULT FALSE | 🔄 Changed from `tinyint(1)` |
| `is_new_lead` | BOOLEAN | DEFAULT FALSE | ✏️ Renamed from `new_lead_label` |
| `recommend_merge` | BOOLEAN | DEFAULT FALSE | 🔄 Changed from `tinyint(1)` |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date_created` |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | 🆕 Auto-update trigger |
| `created_by_id` | BIGINT | FK → `staff.id` | 🆕 New audit field |
| `updated_by_id` | BIGINT | FK → `staff.id` | 🆕 New audit field |

**Foreign Keys:**
- `created_by_id` → `staff(id)`
- `updated_by_id` → `staff(id)`
- `batch_id` → `customer_batch(id)` (via ALTER TABLE)

**Indexes:**
- `idx_customer_email`
- `idx_customer_rank`
- `idx_customer_created_at`
- `idx_customer_batch_id`
- `idx_customer_phone`
- `idx_customer_source`

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

#### `customer_lead` ✏️ (renamed from `db_sub_id_lead`)
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
- `idx_customer_lead_customer`

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
5. **customer_lead** - Customer leads
6. **pancake_contact** - Pancake contact integration

### Key Features
- **Normalization**: Comma-separated customer and order IDs moved to junction tables
- **Data Types**: All monetary values changed from `float` to `NUMERIC(12,2)`
- **Audit Fields**: `created_by_id`, `updated_by_id` for tracking staff actions
- **Indexes**: Optimized for common queries (email, phone, source, batch_id)

### Relationships
- `customer.created_by_id` → `staff.id`
- `customer.updated_by_id` → `staff.id`
- `customer.batch_id` → `customer_batch.id`
- `customer_batch.assigned_to_staff_id` → `staff.id`
- `customer_batch_customer.batch_id` → `customer_batch.id`
- `customer_batch_customer.customer_id` → `customer.id`
- `customer_batch_order.batch_id` → `customer_batch.id`
- `customer_batch_order.order_id` → `order.id`
- `customer_lead.customer_id` → `customer.id`
- `pancake_contact.customer_id` → `customer.id`

