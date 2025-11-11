# Order Management Department

## Overview
This document shows a clean, normalized Order Management schema following database best practices.

**Design Principles:**
- **Separation of Concerns**: Shipping, payment, feedback, and metadata are in separate tables
- **Normalization**: Tags, images, and follow-ups are normalized
- **Data Integrity**: Proper foreign keys, constraints, and data types
- **Audit Trail**: Created/updated timestamps and staff tracking
- **Performance**: Strategic indexes on frequently queried fields

**Legend:**
- 🆕 **NEW** - Newly created tables/fields
- 🔄 **NORMALIZED** - Moved from denormalized structure
- ✏️ **RENAMED** - Field/table renamed for clarity
- 📊 **DENORMALIZED** - Intentionally denormalized for performance

---

## Core Tables

#### `order` ✏️ (renamed from `db_order`)
**Status**: Core entity - contains only essential order information

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `order_number` | VARCHAR(100) | UNIQUE, NOT NULL | External order number |
| `parent_order_id` | BIGINT | FK → `order.id` | Self-referencing for order groups |
| `customer_id` | BIGINT | FK → `customer.id` | 🆕 Link to customer table |
| `store` | VARCHAR(50) | NOT NULL | Store identifier |
| `status` | VARCHAR(50) | NOT NULL | Order status (pending, processing, shipped, delivered, cancelled, refunded) |
| `order_type` | VARCHAR(50) | DEFAULT 'standard' | standard, pre_order, diamond, custom |
| `source` | VARCHAR(100) | DEFAULT 'phone' | Order source (phone, live_stream, ritamie, etc.) |
| `total_amount` | NUMERIC(12,2) | NOT NULL, CHECK >= 0 | Total order value |
| `net_payment` | NUMERIC(12,2) | DEFAULT 0, CHECK >= 0 | Net amount after discounts |
| `total_refunded` | NUMERIC(12,2) | DEFAULT 0, CHECK >= 0 | Total refunded amount |
| `approval_status` | VARCHAR(50) | DEFAULT 'pending' | approval workflow status |
| `has_error` | BOOLEAN | DEFAULT FALSE | ✏️ Renamed from `error_order` |
| `is_claim` | BOOLEAN | DEFAULT FALSE | ✏️ Renamed from `claim_order` |
| `closed_by_staff_id` | BIGINT | FK → `staff.id` | Staff who closed the order |
| `referred_by_staff_id` | BIGINT | FK → `staff.id` | Staff who referred the customer |
| `support_by_staff_id` | BIGINT | FK → `staff.id` | Staff providing support |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | Auto-update trigger |
| `created_by_id` | BIGINT | FK → `staff.id` | 🆕 Audit field |
| `updated_by_id` | BIGINT | FK → `staff.id` | 🆕 Audit field |

**Foreign Keys:**
- `parent_order_id` → `order(id)` ON DELETE SET NULL
- `customer_id` → `customer(id)`
- `closed_by_staff_id` → `staff(id)`
- `referred_by_staff_id` → `staff(id)`
- `support_by_staff_id` → `staff(id)`
- `created_by_id` → `staff(id)`
- `updated_by_id` → `staff(id)`

**Indexes:**
- `idx_order_order_number` - UNIQUE on `order_number`
- `idx_order_customer_id` - On `customer_id`
- `idx_order_status` - On `status`
- `idx_order_store` - On `store`
- `idx_order_created_at` - On `created_at`
- `idx_order_parent_order_id` - On `parent_order_id`
- `idx_order_order_type` - On `order_type`
- `idx_order_source` - On `source`

---

#### `order_shipping` 🆕 NEW
**Status**: Shipping information separated from main order table

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `order_id` | BIGINT | FK → `order.id`, NOT NULL, UNIQUE | One-to-one with order |
| `tracking_number` | VARCHAR(100) | DEFAULT '' | |
| `carrier` | VARCHAR(50) | DEFAULT '' | Shipping carrier name |
| `carrier_status` | VARCHAR(50) | DEFAULT '' | ✏️ Renamed from `ship_carrier_status` |
| `ship_date` | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | |
| `delivered_date` | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | |
| `estimated_delivery_date` | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | |
| `batch_ship_id` | BIGINT | FK → `shipment_batch.id` | 🆕 Link to shipment batch |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | Auto-update trigger |

**Foreign Keys:**
- `order_id` → `order(id)` ON DELETE CASCADE
- `batch_ship_id` → `shipment_batch(id)` ON DELETE SET NULL

**Indexes:**
- `idx_order_shipping_order_id` - UNIQUE on `order_id`
- `idx_order_shipping_tracking` - On `tracking_number`
- `idx_order_shipping_carrier` - On `carrier`
- `idx_order_shipping_ship_date` - On `ship_date`

---

#### `order_payment` 🆕 NEW
**Status**: Payment information separated from main order table

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `order_id` | BIGINT | FK → `order.id`, NOT NULL | One order can have multiple payments |
| `payment_method` | VARCHAR(100) | NOT NULL | |
| `amount` | NUMERIC(12,2) | NOT NULL, CHECK > 0 | Payment amount |
| `status` | VARCHAR(50) | NOT NULL DEFAULT 'pending' | pending, paid, failed, refunded |
| `transaction_id` | VARCHAR(300) | DEFAULT '' | External transaction ID |
| `due_date` | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | |
| `paid_date` | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | |
| `is_deposit` | BOOLEAN | DEFAULT FALSE | ✏️ Renamed from `deposit` |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | Auto-update trigger |

**Foreign Keys:**
- `order_id` → `order(id)` ON DELETE CASCADE

**Indexes:**
- `idx_order_payment_order_id` - On `order_id`
- `idx_order_payment_status` - On `status`
- `idx_order_payment_transaction_id` - On `transaction_id`
- `idx_order_payment_paid_date` - On `paid_date`

---

#### `order_line_item` ✏️ (renamed from `db_order_line_item`)
**Status**: Order line items - normalized product information

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `order_id` | BIGINT | FK → `order.id`, NOT NULL | |
| `line_number` | INTEGER | NOT NULL | Sequential line number in order |
| `product_sku` | VARCHAR(100) | NOT NULL | Soft FK to `product.sku` |
| `product_name` | VARCHAR(500) | NOT NULL | Snapshot of product name at order time |
| `quantity` | INTEGER | NOT NULL, CHECK > 0 | |
| `unit_price` | NUMERIC(12,2) | NOT NULL, CHECK >= 0 | Price per unit at order time |
| `line_total` | NUMERIC(12,2) | NOT NULL, CHECK >= 0 | Calculated: quantity * unit_price |
| `status` | VARCHAR(50) | DEFAULT 'pending' | pending, fulfilled, cancelled, refunded |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |

**Foreign Keys:**
- `order_id` → `order(id)` ON DELETE CASCADE

**Indexes:**
- `idx_order_line_item_order_id` - On `order_id`
- `idx_order_line_item_product_sku` - On `product_sku`
- `idx_order_line_item_status` - On `status`

---

#### `order_feedback` 🆕 NEW
**Status**: Customer feedback and reviews separated

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `order_id` | BIGINT | FK → `order.id`, NOT NULL, UNIQUE | One-to-one with order |
| `customer_feedback` | TEXT | DEFAULT '' | |
| `social_review` | VARCHAR(200) | DEFAULT '' | Social media review link |
| `rating` | INTEGER | CHECK (rating >= 1 AND rating <= 5) | 🆕 1-5 star rating |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | Auto-update trigger |

**Foreign Keys:**
- `order_id` → `order(id)` ON DELETE CASCADE

**Indexes:**
- `idx_order_feedback_order_id` - UNIQUE on `order_id`
- `idx_order_feedback_rating` - On `rating`

---

#### `order_feedback_image` 🆕 NEW
**Status**: Images associated with order feedback

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `order_feedback_id` | BIGINT | FK → `order_feedback.id`, NOT NULL | |
| `image_url` | VARCHAR(1000) | NOT NULL | |
| `display_order` | INTEGER | DEFAULT 0 | For ordering multiple images |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |

**Foreign Keys:**
- `order_feedback_id` → `order_feedback(id)` ON DELETE CASCADE

**Indexes:**
- `idx_order_feedback_image_feedback_id` - On `order_feedback_id`

---

#### `order_note` 🆕 NEW
**Status**: General notes and follow-up information

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `order_id` | BIGINT | FK → `order.id`, NOT NULL | One order can have multiple notes |
| `note_type` | VARCHAR(50) | DEFAULT 'general' | general, follow_up, internal, customer |
| `content` | TEXT | NOT NULL | |
| `follow_up_status` | VARCHAR(50) | DEFAULT '' | ✏️ Renamed from `status_follow_up` |
| `created_by_id` | BIGINT | FK → `staff.id` | 🆕 Staff who created the note |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | Auto-update trigger |

**Foreign Keys:**
- `order_id` → `order(id)` ON DELETE CASCADE
- `created_by_id` → `staff(id)`

**Indexes:**
- `idx_order_note_order_id` - On `order_id`
- `idx_order_note_type` - On `note_type`
- `idx_order_note_created_at` - On `created_at`

---

#### `order_tag` 🆕 NEW
**Status**: Normalized tags for orders

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `order_id` | BIGINT | FK → `order.id`, NOT NULL | |
| `tag` | VARCHAR(150) | NOT NULL | |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |
| UNIQUE(`order_id`, `tag`) | | | Prevent duplicate tags |

**Foreign Keys:**
- `order_id` → `order(id)` ON DELETE CASCADE

**Indexes:**
- `idx_order_tag_order_id` - On `order_id`
- `idx_order_tag_tag` - On `tag`
- `idx_order_tag_unique` - UNIQUE on (`order_id`, `tag`)

---

#### `order_image` 🆕 NEW
**Status**: Order images separated from main table

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `order_id` | BIGINT | FK → `order.id`, NOT NULL | |
| `image_url` | VARCHAR(1000) | NOT NULL | |
| `image_type` | VARCHAR(50) | DEFAULT 'order' | order, receipt, custom, other |
| `display_order` | INTEGER | DEFAULT 0 | For ordering multiple images |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |

**Foreign Keys:**
- `order_id` → `order(id)` ON DELETE CASCADE

**Indexes:**
- `idx_order_image_order_id` - On `order_id`
- `idx_order_image_type` - On `image_type`

---

#### `order_after_service` 🆕 NEW
**Status**: After-sales service tracking

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `order_id` | BIGINT | FK → `order.id`, NOT NULL, UNIQUE | One-to-one with order |
| `service_type` | VARCHAR(100) | DEFAULT '' | Type of after-service |
| `status` | VARCHAR(50) | DEFAULT 'pending' | pending, in_progress, completed, cancelled |
| `notes` | TEXT | DEFAULT '' | Service notes |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | Auto-update trigger |

**Foreign Keys:**
- `order_id` → `order(id)` ON DELETE CASCADE

**Indexes:**
- `idx_order_after_service_order_id` - UNIQUE on `order_id`
- `idx_order_after_service_status` - On `status`

---

## Special Order Types

#### `order_diamond_status` ✏️ (renamed from `db_status_diamond`)
**Status**: Custom diamond order tracking (one-to-one with order)

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY, FK → `order.id` | Same as order.id |
| `actual_amount` | NUMERIC(12,2) | DEFAULT 0, CHECK >= 0 | Actual final amount |
| `balance_due` | NUMERIC(12,2) | DEFAULT 0, CHECK >= 0 | Remaining balance to pay |
| `payment_status` | VARCHAR(50) | DEFAULT '' | ✏️ Renamed from `status_payment` |
| `design_3d_image_url` | VARCHAR(500) | DEFAULT '' | ✏️ Renamed from `img_3d_design` |
| `design_status` | VARCHAR(50) | DEFAULT '' | ✏️ Renamed from `status_design` |
| `design_date` | DATE | DEFAULT NULL | ✏️ Renamed from `time_design` |
| `material_status` | VARCHAR(50) | DEFAULT '' | ✏️ Renamed from `status_material` |
| `material_date` | DATE | DEFAULT NULL | ✏️ Renamed from `time_material` |
| `completion_status` | VARCHAR(50) | DEFAULT '' | ✏️ Renamed from `status_complete` |
| `completion_date` | DATE | DEFAULT NULL | ✏️ Renamed from `time_complete` |
| `is_third_party_brand` | BOOLEAN | DEFAULT FALSE | ✏️ Renamed from `third_party_brand` |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | Auto-update trigger |

**Foreign Keys:**
- `id` → `order(id)` ON DELETE CASCADE

**Indexes:**
- `idx_order_diamond_status_id` - PRIMARY KEY on `id`
- `idx_order_diamond_status_design_status` - On `design_status`
- `idx_order_diamond_status_completion_status` - On `completion_status`
- `idx_order_diamond_status_payment_status` - On `payment_status`

**Note:** `check_status` field (pipe-delimited format) should be normalized into `order_diamond_specification` table below.

---

#### `order_diamond_specification` 🆕 NEW
**Status**: Normalized specification details for diamond orders

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `order_id` | BIGINT | FK → `order.id`, NOT NULL | |
| `spec_type` | VARCHAR(50) | NOT NULL | size, metal, stone, main_stone, engrave, perfection, note |
| `spec_value` | VARCHAR(500) | DEFAULT '' | Specification value |
| `status` | VARCHAR(50) | DEFAULT 'pending' | pending, approved, rejected |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | Auto-update trigger |
| UNIQUE(`order_id`, `spec_type`) | | | One spec per type per order |

**Foreign Keys:**
- `order_id` → `order(id)` ON DELETE CASCADE

**Indexes:**
- `idx_order_diamond_spec_order_id` - On `order_id`
- `idx_order_diamond_spec_type` - On `spec_type`
- `idx_order_diamond_spec_unique` - UNIQUE on (`order_id`, `spec_type`)

---

#### `order_pre_order_status` ✏️ (renamed from `db_status_pre_order`)
**Status**: Pre-order tracking (one-to-one with order)

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY, FK → `order.id` | Same as order.id |
| `status` | VARCHAR(50) | NOT NULL DEFAULT 'pending' | pending, on_hold, processing, completed, cancelled |
| `hold_until_date` | DATE | DEFAULT NULL | ✏️ Renamed from `hold_until` |
| `hold_reason` | VARCHAR(256) | DEFAULT '' | ✏️ Renamed from `reason` |
| `category` | VARCHAR(256) | DEFAULT '' | Product category |
| `vendor` | VARCHAR(300) | DEFAULT '' | Vendor/supplier name |
| `processing_date` | DATE | DEFAULT NULL | When processing started |
| `note` | TEXT | DEFAULT '' | Internal notes |
| `updated_by_id` | BIGINT | FK → `staff.id` | ✏️ Renamed from `update_by` |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | Auto-update trigger |

**Foreign Keys:**
- `id` → `order(id)` ON DELETE CASCADE
- `updated_by_id` → `staff(id)`

**Indexes:**
- `idx_order_pre_order_status_id` - PRIMARY KEY on `id`
- `idx_order_pre_order_status_status` - On `status`
- `idx_order_pre_order_status_vendor` - On `vendor`
- `idx_order_pre_order_status_processing_date` - On `processing_date`

---

## Returns & Refunds

#### `order_return` ✏️ (renamed from `db_order_return`)
**Status**: Order returns management

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `order_id` | BIGINT | FK → `order.id`, NOT NULL | |
| `return_number` | VARCHAR(100) | UNIQUE, NOT NULL | 🆕 RMA number |
| `return_reason` | VARCHAR(256) | DEFAULT '' | |
| `return_status` | VARCHAR(50) | DEFAULT 'pending' | pending, approved, rejected, completed |
| `total_amount` | NUMERIC(12,2) | DEFAULT NULL | |
| `tracking_number` | VARCHAR(100) | DEFAULT '' | Return shipment tracking |
| `received_date` | DATE | DEFAULT NULL | Date return was received |
| `processed_by_id` | BIGINT | FK → `staff.id` | Staff who processed the return |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | Auto-update trigger |

**Foreign Keys:**
- `order_id` → `order(id)` ON DELETE RESTRICT
- `processed_by_id` → `staff(id)`

**Indexes:**
- `idx_order_return_order_id` - On `order_id`
- `idx_order_return_number` - UNIQUE on `return_number`
- `idx_order_return_status` - On `return_status`

---

#### `refund` ✏️ (renamed from `db_list_refunded_order`)
**Status**: Refunds tracking

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `order_id` | BIGINT | FK → `order.id`, NOT NULL | |
| `order_payment_id` | BIGINT | FK → `order_payment.id` | 🆕 Link to specific payment |
| `amount` | NUMERIC(12,2) | NOT NULL, CHECK > 0 | |
| `refund_method` | VARCHAR(100) | NOT NULL | Payment method used for refund |
| `refund_status` | VARCHAR(50) | DEFAULT 'pending' | pending, processing, completed, failed |
| `transaction_id` | VARCHAR(300) | DEFAULT '' | Refund transaction ID |
| `refunded_by_id` | BIGINT | FK → `staff.id` | Staff who processed refund |
| `refunded_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | When refund was completed |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | Auto-update trigger |

**Foreign Keys:**
- `order_id` → `order(id)` ON DELETE RESTRICT
- `order_payment_id` → `order_payment(id)` ON DELETE SET NULL
- `refunded_by_id` → `staff(id)`

**Indexes:**
- `idx_refund_order_id` - On `order_id`
- `idx_refund_status` - On `refund_status`
- `idx_refund_refunded_at` - On `refunded_at`

---

## Summary

### Tables in Order Management
1. **order** - Core order information
2. **order_shipping** - Shipping details (one-to-one)
3. **order_payment** - Payment transactions (one-to-many)
4. **order_line_item** - Order line items (one-to-many)
5. **order_feedback** - Customer feedback (one-to-one)
6. **order_feedback_image** - Feedback images (one-to-many)
7. **order_note** - Notes and follow-ups (one-to-many)
8. **order_tag** - Order tags (many-to-many normalized)
9. **order_image** - Order images (one-to-many)
10. **order_after_service** - After-sales service (one-to-one)
11. **order_diamond_status** - Diamond/custom order tracking (one-to-one)
12. **order_diamond_specification** - Diamond order specifications (one-to-many)
13. **order_pre_order_status** - Pre-order tracking (one-to-one)
14. **order_return** - Returns (one-to-many)
15. **refund** - Refunds (one-to-many)

### Key Design Decisions

#### Normalization
- **Shipping separated**: `order_shipping` table for all shipping-related fields
- **Payment separated**: `order_payment` allows multiple payments per order
- **Feedback separated**: `order_feedback` and `order_feedback_image` for reviews
- **Tags normalized**: `order_tag` junction table instead of comma-separated values
- **Images normalized**: `order_image` table instead of comma-separated URLs
- **Notes normalized**: `order_note` table for multiple notes per order
- **Diamond specs normalized**: `order_diamond_specification` table instead of pipe-delimited `check_status`

#### Data Integrity
- **Foreign Keys**: All relationships properly defined with appropriate CASCADE/SET NULL/RESTRICT
- **Constraints**: CHECK constraints on amounts, quantities, and ratings
- **UNIQUE constraints**: Order numbers, return numbers, and one-to-one relationships
- **Data Types**: NUMERIC for all monetary values (no float)

#### Performance
- **Strategic Indexes**: On foreign keys, status fields, dates, and frequently queried fields
- **Composite Indexes**: For unique constraints and common query patterns

#### Audit Trail
- **Timestamps**: `created_at` and `updated_at` on all tables
- **Staff Tracking**: `created_by_id` and `updated_by_id` on main tables
- **Auto-update Triggers**: `updated_at` automatically maintained

#### Removed/Consolidated Fields
- `customer_name`, `email` → Now linked via `customer_id` FK
- `hinh_order` → Moved to `order_image` table
- `note`, `note_follow_up` → Moved to `order_note` table
- `tag` → Normalized to `order_tag` table
- `rank_order` → Can be derived from `customer.rank`
- `source_page_fb` → Consolidated into `source` field
- `local_store`, `live_stream`, `source_ritamie`, `order_diamond`, `pre_order`, `after_services` → Consolidated into `order_type` and flags
- `error_order` → Renamed to `has_error` (boolean)
- `claim_order` → Renamed to `is_claim` (boolean)
- `deposit` → Moved to `order_payment.is_deposit`
- `db_status_diamond` → Split into `order_diamond_status` and `order_diamond_specification`
- `db_status_pre_order` → Renamed to `order_pre_order_status` with improved structure

### Relationships
- `order.parent_order_id` → `order(id)` (self-referencing)
- `order.customer_id` → `customer(id)`
- `order.closed_by_staff_id` → `staff(id)`
- `order.referred_by_staff_id` → `staff(id)`
- `order.support_by_staff_id` → `staff(id)`
- `order_shipping.order_id` → `order(id)` (one-to-one)
- `order_payment.order_id` → `order(id)` (one-to-many)
- `order_line_item.order_id` → `order(id)` (one-to-many)
- `order_feedback.order_id` → `order(id)` (one-to-one)
- `order_feedback_image.order_feedback_id` → `order_feedback(id)` (one-to-many)
- `order_note.order_id` → `order(id)` (one-to-many)
- `order_tag.order_id` → `order(id)` (many-to-many)
- `order_image.order_id` → `order(id)` (one-to-many)
- `order_after_service.order_id` → `order(id)` (one-to-one)
- `order_diamond_status.id` → `order(id)` (one-to-one, same ID)
- `order_diamond_specification.order_id` → `order(id)` (one-to-many)
- `order_pre_order_status.id` → `order(id)` (one-to-one, same ID)
- `order_pre_order_status.updated_by_id` → `staff(id)`
- `order_return.order_id` → `order(id)` (one-to-many)
- `refund.order_id` → `order(id)` (one-to-many)
- `refund.order_payment_id` → `order_payment(id)`
