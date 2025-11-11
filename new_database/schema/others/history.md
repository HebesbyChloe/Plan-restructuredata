# History & Audit Department

## Overview
This document shows the complete History & Audit schema structure with data types, foreign keys, and change indicators.

**Legend:**
- 🆕 **NEW** - Newly created tables
- 🔄 **NORMALIZED** - Comma-separated values moved to junction tables
- 🗑️ **REMOVED** - Fields/tables removed or consolidated
- ✏️ **RENAMED** - Table/column renamed
- 📊 **DENORMALIZED** - Denormalized for performance (if any)

---

## Core Tables

#### `action_history` ✏️ (renamed from `db_history_action`)
**Status**: Action audit log

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `type` | VARCHAR(50) | NOT NULL | Indexed |
| `user_name` | VARCHAR(100) | NOT NULL | ✏️ Renamed from `user` |
| `type_id` | VARCHAR(20) | NOT NULL DEFAULT '' | ✏️ Renamed from `id_type` |
| `action` | VARCHAR(50) | NOT NULL | |
| `detail` | VARCHAR(5000) | NOT NULL | |
| `response` | VARCHAR(200) | NOT NULL | |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `time` |

**Indexes:**
- `idx_action_history_type`
- `idx_action_history_created_at`
- `idx_action_history_user`

---

#### `stock_history` ✏️ (renamed from `db_history_stock`)
**Status**: Stock change history

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `user_name` | VARCHAR(100) | NOT NULL | ✏️ Renamed from `user` |
| `sku` | VARCHAR(100) | NOT NULL | Indexed |
| `stock` | VARCHAR(100) | NOT NULL DEFAULT '' | |
| `detail` | VARCHAR(500) | NOT NULL | |
| `source` | VARCHAR(100) | NOT NULL DEFAULT '' | |
| `quantity_change` | INTEGER | DEFAULT 0 | ✏️ Renamed from `qty_change` |
| `line_item_id` | VARCHAR(20) | NOT NULL DEFAULT '' | ✏️ Renamed from `id_line_item` |
| `order_id` | BIGINT | NOT NULL DEFAULT 0 | |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `time` |

**Indexes:**
- `idx_stock_history_sku`
- `idx_stock_history_order`
- `idx_stock_history_created_at`
- `idx_stock_history_sku_time`

---

#### `inventory_history` ✏️ (renamed from `db_history_inventory`)
**Status**: Inventory audit history

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `inventory_date` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date` |
| `times` | INTEGER | DEFAULT 1 | |
| `status` | INTEGER | DEFAULT 0 | |
| `product_sku` | VARCHAR(100) | NOT NULL | ✏️ Renamed from `sku_product` |
| `product_name` | VARCHAR(100) | NOT NULL | ✏️ Renamed from `name_product` |
| `stock` | INTEGER | NOT NULL DEFAULT 0 | |
| `actual` | INTEGER | NOT NULL DEFAULT 0 | |
| `discrepancy` | INTEGER | NOT NULL DEFAULT 0 | |
| `detail` | VARCHAR(10000) | DEFAULT NULL | |
| `location` | VARCHAR(100) | NOT NULL | |
| `user_name` | VARCHAR(100) | NOT NULL | ✏️ Renamed from `user` |

**Indexes:**
- `idx_inventory_history_product_sku`
- `idx_inventory_history_date`

---

#### `ads_report_history` ✏️ (renamed from `db_history_report_ads`)
**Status**: Ads report history

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `report` | TEXT | DEFAULT NULL | |
| `report_type` | VARCHAR(50) | NOT NULL | ✏️ Renamed from `type` |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date_created` |
| `updated_at` | TIMESTAMP WITH TIME ZONE | NOT NULL DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `update_at` |

---

#### `sales_performance_history` ✏️ (renamed from `db_history_sales_performance_tracker`)
**Status**: Sales performance history

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `staff_name` | VARCHAR(100) | DEFAULT NULL | ✏️ Renamed from `name_staff` |
| `staff_id` | BIGINT | FK → `staff.id`, DEFAULT NULL | ✏️ Renamed from `id_staff` |
| `actions` | VARCHAR(255) | DEFAULT NULL | |
| `status` | INTEGER | DEFAULT NULL | |
| `total_points_this_month` | VARCHAR(10) | DEFAULT NULL | |
| `sub_staff_name` | VARCHAR(100) | DEFAULT NULL | |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date_created` |

**Foreign Keys:**
- `staff_id` → `staff(id)`

**Indexes:**
- `idx_sales_performance_history_staff`

---

#### `webhook_history` ✏️ (renamed from `db_history_webhook_cb`)
**Status**: Webhook call history

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `endpoint` | VARCHAR(255) | NOT NULL | ✏️ Renamed from `end_point` |
| `sent_by` | VARCHAR(255) | NOT NULL | ✏️ Renamed from `send_by` |
| `data` | TEXT | NOT NULL | 🔄 Changed from `longtext` |
| `status` | VARCHAR(100) | NOT NULL | |
| `response` | TEXT | DEFAULT NULL | 🔄 Changed from `longtext` |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date_created` |

**Indexes:**
- `idx_webhook_history_endpoint`
- `idx_webhook_history_created_at`

---

#### `customer_merge_log` ✏️ (renamed from `db_log_merge_customer`)
**Status**: Customer merge log

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `old_value` | VARCHAR(300) | NOT NULL DEFAULT '' | |
| `new_value` | VARCHAR(300) | NOT NULL DEFAULT '' | |

---

#### `pancake_ads_log` ✏️ (renamed from `db_log_ads_customer_pancake`)
**Status**: Pancake ads click log

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `ads_id` | VARCHAR(100) | NOT NULL | |
| `crm_customer_id` | BIGINT | FK → `customer.id`, NOT NULL | ✏️ Renamed from `id_customer_crm` |
| `facebook_id` | VARCHAR(100) | DEFAULT '' | ✏️ Renamed from `fb_id` |
| `page_id` | VARCHAR(100) | DEFAULT '' | |
| `conversation_id` | VARCHAR(256) | DEFAULT '' | |
| `click_date` | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | ✏️ Renamed from `date_click_ads` |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date_created` |

**Foreign Keys:**
- `crm_customer_id` → `customer(id)`

**Indexes:**
- `idx_pancake_ads_log_customer`

---

## Summary

### Tables in History & Audit Department
1. **action_history** - Action audit log
2. **stock_history** - Stock change history
3. **inventory_history** - Inventory audit history
4. **ads_report_history** - Ads report history
5. **sales_performance_history** - Sales performance history
6. **webhook_history** - Webhook call history
7. **customer_merge_log** - Customer merge log
8. **pancake_ads_log** - Pancake ads click log

### Key Features
- **Audit Trail**: Complete tracking of all system actions and changes
- **History Tracking**: Stock, inventory, and performance history
- **Integration Logs**: Webhook and ads integration logs
- **Data Types**: Text fields for detailed logs
- **Indexes**: Optimized for common queries (dates, SKU, staff, customer)

### Relationships
- `sales_performance_history.staff_id` → `staff.id`
- `pancake_ads_log.crm_customer_id` → `customer.id`

