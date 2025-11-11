# Staff & HR Department

## Overview
This document shows the complete Staff & HR schema structure with data types, foreign keys, and change indicators.

**Legend:**
- 🆕 **NEW** - Newly created tables
- 🔄 **NORMALIZED** - Comma-separated values moved to junction tables
- 🗑️ **REMOVED** - Fields/tables removed or consolidated
- ✏️ **RENAMED** - Table/column renamed
- 📊 **DENORMALIZED** - Denormalized for performance (if any)

---

## Core Tables

#### `staff` ✏️ (renamed from `db_staff`)
**Status**: Employee management

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `full_name` | VARCHAR(300) | NOT NULL | |
| `monthly_revenue` | INTEGER | NOT NULL DEFAULT 0 | ✏️ Renamed from `doanh_so_thang` |
| `is_sales` | BOOLEAN | DEFAULT FALSE | ✏️ Renamed from `sales` |
| `pancake_user_id` | VARCHAR(356) | DEFAULT '' | ✏️ Renamed from `id_user_pancake` |
| `location` | VARCHAR(20) | DEFAULT 'VN' | Indexed |
| `target_livestream` | NUMERIC(12,2) | DEFAULT 0 | 🔄 Changed from `float` |
| `target_ritamie` | NUMERIC(12,2) | DEFAULT 0 | 🔄 Changed from `float` |
| `work_status` | VARCHAR(100) | DEFAULT 'active' | ✏️ Renamed from `status_work` |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | 🆕 New |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | 🆕 New |

**Indexes:**
- `idx_staff_location`
- `idx_staff_work_status`

---

#### `shift_schedule` ✏️ (renamed from `db_shift_schedule_sales`)
**Status**: Staff scheduling

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `staff_id` | BIGINT | FK → `staff.id`, NOT NULL | ✏️ Renamed from `id_staff` |
| `start_time` | TIMESTAMP WITH TIME ZONE | NOT NULL | ✏️ Renamed from `date_time_start` |
| `end_time` | TIMESTAMP WITH TIME ZONE | NOT NULL | ✏️ Renamed from `date_time_end` |
| `is_authorized` | BOOLEAN | NOT NULL DEFAULT FALSE | ✏️ Renamed from `status_authorization` |
| `is_confirmed` | BOOLEAN | NOT NULL DEFAULT TRUE | ✏️ Renamed from `confirm` |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date_created` |
| CHECK(`end_time` > `start_time`) | | | 🆕 New constraint |

**Foreign Keys:**
- `staff_id` → `staff(id)`

**Indexes:**
- `idx_shift_schedule_staff`
- `idx_shift_schedule_start_time`
- `idx_shift_schedule_dates`
- `idx_shift_schedule_shift`

---

#### `shift_report` ✏️ (renamed from `db_list_end_shift`)
**Status**: End of shift reports

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `staff_id` | BIGINT | FK → `staff.id`, NOT NULL | ✏️ Renamed from `id_staff` |
| `report_date` | DATE | NOT NULL | ✏️ Renamed from `date_report` |
| `total_revenue` | NUMERIC(12,2) | NOT NULL DEFAULT 0 | 🔄 Changed from `float` |
| `complete_tasks` | BOOLEAN | NOT NULL DEFAULT TRUE | ✏️ Renamed from `complete_tasks` |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date_created` |

**Foreign Keys:**
- `staff_id` → `staff(id)`

**Indexes:**
- `idx_shift_report_staff`
- `idx_shift_report_date`
- `idx_shift_report_staff_date`

---

#### `sales_performance` ✏️ (renamed from `db_sales_performance_tracker`)
**Status**: Performance tracking

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `staff_id` | BIGINT | FK → `staff.id`, NOT NULL | ✏️ Renamed from `id_staff` |
| `staff_name` | VARCHAR(100) | DEFAULT NULL | ✏️ Renamed from `name_staff` |
| `points` | INTEGER | DEFAULT NULL | |
| `points_this_month` | INTEGER | DEFAULT NULL | |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date_created` |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date_updated` |

**Foreign Keys:**
- `staff_id` → `staff(id)`

**Indexes:**
- `idx_sales_performance_staff`

---

#### `lead_sale` ✏️ (renamed from `db_lead_sale`)
**Status**: Sales leads

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | ✏️ Renamed from `id_lead_sale` |
| `staff_id` | BIGINT | FK → `staff.id`, NOT NULL | ✏️ Renamed from `id_staff` |
| `customer_name` | VARCHAR(300) | DEFAULT '' | ✏️ Renamed from `ten_khach` |
| `lead_status` | CHAR(100) | NOT NULL | ✏️ Renamed from `tinh_trang_lead` |
| `total` | NUMERIC(12,2) | DEFAULT 0 | 🔄 Changed from `float` |
| `is_confirmed` | BOOLEAN | DEFAULT TRUE | ✏️ Renamed from `confirm` |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date_created` |

**Foreign Keys:**
- `staff_id` → `staff(id)`

**Indexes:**
- `idx_lead_sale_staff`
- `idx_lead_sale_order`
- `idx_lead_sale_status`
- `idx_lead_sale_source`

---

## Summary

### Tables in Staff & HR Department
1. **staff** - Employee records
2. **shift_schedule** - Staff shift schedules
3. **shift_report** - End of shift reports
4. **sales_performance** - Sales performance tracking
5. **lead_sale** - Sales leads

### Key Features
- **Data Types**: All monetary values changed from `float` to `NUMERIC(12,2)`
- **Foreign Keys**: Proper relationships with staff table
- **Indexes**: Optimized for common queries (location, work_status, dates)
- **Constraints**: Check constraint for shift schedule (end_time > start_time)

### Relationships
- `shift_schedule.staff_id` → `staff.id`
- `shift_report.staff_id` → `staff.id`
- `sales_performance.staff_id` → `staff.id`
- `lead_sale.staff_id` → `staff.id`

### Related Tables (Referenced by other departments)
- `customer.created_by_id` → `staff.id`
- `customer.updated_by_id` → `staff.id`
- `order.closed_by_staff_id` → `staff.id`
- `order.referred_by_staff_id` → `staff.id`
- `order.support_by_staff_id` → `staff.id`
- `product.created_by_id` → `staff.id`
- `customer_batch.assigned_to_staff_id` → `staff.id`

