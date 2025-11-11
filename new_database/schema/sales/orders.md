# Order Management Department

## Overview
This document shows the complete Order Management schema structure with data types, foreign keys, and change indicators.

**Legend:**
- 🆕 **NEW** - Newly created tables
- 🔄 **NORMALIZED** - Comma-separated values moved to junction tables
- 🗑️ **REMOVED** - Fields/tables removed or consolidated
- ✏️ **RENAMED** - Table/column renamed
- 📊 **DENORMALIZED** - Denormalized for performance (if any)

---

## Core Tables

#### `order` ✏️ (renamed from `db_order`)
**Status**: Core entity, PostgreSQL reserved word (use quotes)

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `parent_id` | BIGINT | FK → `order.id` | Self-referencing |
| `order_number` | VARCHAR(300) | NOT NULL DEFAULT '' | ✏️ Renamed from `link_order_number` |
| `store` | VARCHAR(200) | DEFAULT '' | |
| `status` | VARCHAR(100) | NOT NULL | Indexed |
| `customer_name` | VARCHAR(200) | NOT NULL DEFAULT 'No Name' | |
| `email` | VARCHAR(300) | NOT NULL | Indexed |
| `closed_by_staff_id` | BIGINT | FK → `staff.id` | ✏️ Renamed from `id_nv_chotdon` |
| `referred_by_staff_id` | BIGINT | FK → `staff.id` | ✏️ Renamed from `id_nv_gioithieu` |
| `support_by_staff_id` | BIGINT | FK → `staff.id` | ✏️ Renamed from `support_by` |
| `payment_method` | VARCHAR(100) | NOT NULL | |
| `total` | NUMERIC(12,2) | NOT NULL, CHECK >= 0 | 🔄 Changed from `float` |
| `net_payment` | NUMERIC(12,2) | DEFAULT 0 | 🔄 Changed from `float` |
| `total_refunded` | NUMERIC(12,2) | DEFAULT 0 | 🔄 Changed from `float` |
| `is_local_store` | BOOLEAN | DEFAULT FALSE | ✏️ Renamed from `local_store` |
| `is_live_stream` | BOOLEAN | NOT NULL DEFAULT FALSE | ✏️ Renamed from `live_stream` |
| `is_pre_order` | BOOLEAN | DEFAULT FALSE | ✏️ Renamed from `pre_order` |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | ✏️ Renamed from `date_created` |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `updated_at` |

**Foreign Keys:**
- `parent_id` → `order(id)`
- `closed_by_staff_id` → `staff(id)`
- `referred_by_staff_id` → `staff(id)`
- `support_by_staff_id` → `staff(id)`

**Indexes:**
- `idx_order_parent_id`
- `idx_order_closed_by_staff`
- `idx_order_referred_by_staff`
- `idx_order_support_by_staff`
- `idx_order_status`
- `idx_order_created_at`
- `idx_order_email`
- `idx_order_customer_name`
- `idx_order_store`

---

#### `order_detail` ✏️ (renamed from `db_order_detail`)
**Status**: One-to-one with order

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `order_id` | BIGINT | FK → `order.id`, NOT NULL | 🆕 New FK |
| `status` | VARCHAR(20) | NOT NULL DEFAULT '' | |
| `total` | NUMERIC(12,2) | NOT NULL DEFAULT 0 | 🔄 Changed from `float` |
| `transaction_id` | VARCHAR(300) | NOT NULL | |
| `items_paid` | TEXT | NOT NULL | 🔄 Changed from `varchar(4500)` |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date_created` |

**Foreign Keys:**
- `order_id` → `order(id)`

---

#### `order_line_item` ✏️ (renamed from `db_order_line_item`)
**Status**: Order items

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `order_id` | BIGINT | FK → `order.id`, NOT NULL | 🆕 New FK |
| `product_sku` | VARCHAR(50) | NOT NULL | ✏️ Renamed from `sku` |
| `price` | NUMERIC(12,2) | NOT NULL DEFAULT 0 | 🔄 Changed from `float` |
| `quantity` | INTEGER | NOT NULL DEFAULT 0, CHECK > 0 | ✏️ Renamed from `qty` |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date_created` |

**Foreign Keys:**
- `order_id` → `order(id)`
- Note: `product_sku` is soft FK to `product.sku` (string match)

**Indexes:**
- `idx_order_line_item_order`
- `idx_order_line_item_product_sku`

---

#### `payment` ✏️ (renamed from `db_payment_order`)
**Status**: Order payments

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `order_id` | BIGINT | FK → `order.id`, NOT NULL | ✏️ Renamed from `parent_id` |
| `status` | VARCHAR(100) | NOT NULL DEFAULT '' | |
| `amount` | NUMERIC(12,2) | DEFAULT 0, CHECK >= 0 | 🔄 Changed from `float` |
| `payment_method` | VARCHAR(256) | DEFAULT '' | |
| `due_date` | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | |
| `paid_date` | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date_created` |

**Foreign Keys:**
- `order_id` → `order(id)`

**Indexes:**
- `idx_payment_order`
- `idx_payment_status`
- `idx_payment_method`

---

## Returns & Refunds

#### `order_return` ✏️ (renamed from `db_order_return`)
**Status**: Returns management

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | ✏️ Changed from `id_order` |
| `original_order_id` | BIGINT | DEFAULT 0 | ✏️ Renamed from `id_old_order` |
| `total` | NUMERIC(12,2) | DEFAULT NULL | 🔄 Changed from `float` |
| `updated_by_id` | BIGINT | FK → `staff.id`, DEFAULT 0 | ✏️ Renamed from `updated_by` |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date_created_inquiry` |

**Foreign Keys:**
- `updated_by_id` → `staff(id)`

---

#### `refund` ✏️ (renamed from `db_list_refunded_order`)
**Status**: Refunds tracking

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `order_id` | BIGINT | FK → `order.id`, NOT NULL | 🆕 New FK |
| `staff_id` | BIGINT | FK → `staff.id`, DEFAULT 0 | ✏️ Renamed from `id_staff` |
| `amount` | NUMERIC(12,2) | DEFAULT 0 | 🔄 Changed from `float` |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | ✏️ Renamed from `date_created` |

**Foreign Keys:**
- `order_id` → `order(id)`
- `staff_id` → `staff(id)`

---

## Summary

### Tables in Order Management
1. **order** - Main order table
2. **order_detail** - Order details (one-to-one)
3. **order_line_item** - Order line items
4. **payment** - Order payments
5. **order_return** - Order returns
6. **refund** - Refunds tracking

### Key Features
- **Data Types**: All monetary values changed from `float` to `NUMERIC(12,2)`
- **Foreign Keys**: Proper relationships with staff and order tables
- **Indexes**: Optimized for common queries (status, email, customer_name, dates)
- **Self-referencing**: Orders can have parent orders

### Relationships
- `order.parent_id` → `order(id)` (self-referencing)
- `order.closed_by_staff_id` → `staff.id`
- `order.referred_by_staff_id` → `staff.id`
- `order.support_by_staff_id` → `staff.id`
- `order_detail.order_id` → `order(id)`
- `order_line_item.order_id` → `order(id)`
- `payment.order_id` → `order(id)`
- `order_return.updated_by_id` → `staff.id`
- `refund.order_id` → `order(id)`
- `refund.staff_id` → `staff.id`

