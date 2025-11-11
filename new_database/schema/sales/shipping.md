# Shipping & Logistics Department

## Overview
This document shows the complete Shipping & Logistics schema structure with data types, foreign keys, and change indicators.

**Legend:**
- 🆕 **NEW** - Newly created tables
- 🔄 **NORMALIZED** - Comma-separated values moved to junction tables
- 🗑️ **REMOVED** - Fields/tables removed or consolidated
- ✏️ **RENAMED** - Table/column renamed
- 📊 **DENORMALIZED** - Denormalized for performance (if any)

---

## Inbound Shipments

#### `inbound_shipment` ✏️ (renamed from `db_inbound_shipment`)
**Status**: Incoming shipments

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `code` | VARCHAR(256) | NOT NULL | |
| `outbound_code` | VARCHAR(256) | DEFAULT '' | ✏️ Renamed from `code_outbound` |
| `hub` | VARCHAR(256) | NOT NULL | |
| `location` | VARCHAR(256) | NOT NULL | |
| `vendor` | VARCHAR(256) | DEFAULT NULL | |
| `status` | VARCHAR(256) | DEFAULT '' | |
| `products_count` | INTEGER | DEFAULT 0 | ✏️ Renamed from `products` |
| `orders_count` | INTEGER | DEFAULT 0 | ✏️ Renamed from `orders` |
| `items_count` | INTEGER | DEFAULT 0 | ✏️ Renamed from `items` |
| `tracking_number` | VARCHAR(256) | DEFAULT '' | |
| `ship_date` | DATE | DEFAULT NULL | |
| `estimated_arrival_date` | DATE | DEFAULT NULL | |
| `arrived_date` | DATE | DEFAULT NULL | |
| `note` | VARCHAR(500) | DEFAULT '' | |
| `images` | VARCHAR(1500) | NOT NULL | |
| `updated_by_id` | BIGINT | FK → `staff.id` | ✏️ Renamed from `update_by` |
| `created_at` | DATE | NOT NULL DEFAULT CURRENT_DATE | ✏️ Renamed from `date_created` |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `update_date` |

**Foreign Keys:**
- `updated_by_id` → `staff(id)`

---

#### `inbound_shipment_item` ✏️ (renamed from `db_items_inbound_shipment`)
**Status**: Shipment items

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `shipment_id` | BIGINT | FK → `inbound_shipment.id`, NOT NULL | ✏️ Renamed from `id_shipment` |
| `order_id` | BIGINT | NOT NULL DEFAULT 0 | ✏️ Renamed from `id_order` |
| `code` | VARCHAR(256) | DEFAULT '' | |
| `sku` | VARCHAR(256) | NOT NULL DEFAULT '' | |
| `thumbnail` | VARCHAR(256) | DEFAULT '' | ✏️ Renamed from `thumb_nail` |
| `name` | VARCHAR(500) | NOT NULL | |
| `size` | VARCHAR(100) | DEFAULT NULL | |
| `quantity` | INTEGER | DEFAULT 0 | ✏️ Renamed from `qty` |
| `actual_quantity` | INTEGER | DEFAULT 0 | ✏️ Renamed from `act_qty` |
| `quantity_difference` | INTEGER | DEFAULT 0 | ✏️ Renamed from `qty_diff` |
| `quantity_during` | INTEGER | DEFAULT 0 | ✏️ Renamed from `qty_during` |
| `reason_add` | VARCHAR(256) | NOT NULL DEFAULT '' | |
| `updated_by_id` | BIGINT | DEFAULT 0 | ✏️ Renamed from `update_by` |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date_created` |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `update_date` |

**Foreign Keys:**
- `shipment_id` → `inbound_shipment(id)`

**Indexes:**
- `idx_inbound_shipment_item_shipment`

---

#### `inbound_shipment_note` ✏️ (renamed from `db_item_notes_inbound_shipment`)
**Status**: Inbound shipment notes

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `shipment_id` | BIGINT | FK → `inbound_shipment.id`, NOT NULL | ✏️ Renamed from `shipment_id` |
| `code` | VARCHAR(256) | NOT NULL DEFAULT '' | |
| `sku` | VARCHAR(256) | DEFAULT NULL | |
| `thumbnail` | VARCHAR(100) | DEFAULT '' | ✏️ Renamed from `thumb_nail` |
| `name` | VARCHAR(500) | NOT NULL | |
| `note` | VARCHAR(256) | DEFAULT '' | |
| `updated_by_id` | BIGINT | FK → `staff.id`, DEFAULT NULL | ✏️ Renamed from `update_by` |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date_created` |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `update_date` |

**Foreign Keys:**
- `shipment_id` → `inbound_shipment(id)`
- `updated_by_id` → `staff(id)`

**Indexes:**
- `idx_inbound_shipment_note_shipment`

---

#### `inbound_shipment_order` ✏️ (renamed from `db_orders_inbound_shipment`)
**Status**: Inbound shipment-order mapping

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `order_id` | BIGINT | FK → `order.id`, NOT NULL | ✏️ Renamed from `id_order` |
| `type` | VARCHAR(256) | NOT NULL DEFAULT 'transfer' | |
| `shipment_id` | BIGINT | FK → `inbound_shipment.id`, NOT NULL | ✏️ Renamed from `id_shipment` |
| `code` | VARCHAR(256) | NOT NULL DEFAULT '' | |
| `is_confirmed` | BOOLEAN | DEFAULT FALSE | ✏️ Renamed from `confirm` |
| `items_count` | INTEGER | NOT NULL DEFAULT 0 | ✏️ Renamed from `items` |
| `products_count` | INTEGER | NOT NULL DEFAULT 0 | ✏️ Renamed from `products` |
| `note` | VARCHAR(256) | DEFAULT '' | |
| `has_issues` | BOOLEAN | NOT NULL DEFAULT FALSE | ✏️ Renamed from `issues` |
| `created_at` | DATE | DEFAULT CURRENT_DATE | ✏️ Renamed from `date_created` |

**Foreign Keys:**
- `order_id` → `order(id)`
- `shipment_id` → `inbound_shipment(id)`

**Indexes:**
- `idx_inbound_shipment_order_order`
- `idx_inbound_shipment_order_shipment`

---

## Outbound Shipments

#### `outbound_shipment` ✏️ (renamed from `db_outbound_shipments`)
**Status**: Outgoing shipments

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `code` | VARCHAR(20) | NOT NULL | ✏️ Renamed from `code_ship` |
| `status` | VARCHAR(250) | DEFAULT NULL | |
| `ship_date` | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | |
| `delivery_date` | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | |
| `tracking_number` | TEXT | DEFAULT NULL | |
| `estimated_arrival_date` | DATE | DEFAULT NULL | |
| `shipment_image` | TEXT | DEFAULT NULL | ✏️ Renamed from `img_shipment` |
| `note_batch` | TEXT | DEFAULT NULL | |
| `note` | TEXT | DEFAULT NULL | |
| `updated_by_id` | BIGINT | FK → `staff.id` | ✏️ Renamed from `updated_by` |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date_created` |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `updated_time` |

**Foreign Keys:**
- `updated_by_id` → `staff(id)`

---

#### `outbound_shipment_order` ✏️ (renamed from `db_outbound_shipments_orders`)
**Status**: Shipment-order mapping

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `shipment_id` | BIGINT | FK → `outbound_shipment.id`, NOT NULL | 🆕 New FK |
| `order_id` | VARCHAR(100) | NOT NULL | Note: Text field, not FK |
| `status` | VARCHAR(255) | DEFAULT NULL | |
| `product_name` | TEXT | DEFAULT NULL | ✏️ Renamed from `name_product` |
| `updated_by_id` | BIGINT | FK → `staff.id` | ✏️ Renamed from `updated_by` |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date_created` |

**Foreign Keys:**
- `shipment_id` → `outbound_shipment(id)` ON DELETE CASCADE
- `updated_by_id` → `staff(id)`

**Indexes:**
- `idx_outbound_shipment_order_shipment`

---

#### `outbound_shipment_product` ✏️ (renamed from `db_outbound_shipments_products`)
**Status**: Outbound shipment products

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `shipment_id` | BIGINT | FK → `outbound_shipment.id`, NOT NULL | |
| `shipment_order_id` | BIGINT | FK → `outbound_shipment_order.id` | |
| `status` | VARCHAR(50) | DEFAULT NULL | |
| `product_name` | VARCHAR(255) | DEFAULT NULL | ✏️ Renamed from `name_product` |
| `quantity` | INTEGER | DEFAULT NULL | |
| `quantity_difference` | INTEGER | NOT NULL DEFAULT 0 | ✏️ Renamed from `qty_diff` |
| `product_id` | VARCHAR(100) | DEFAULT NULL | |
| `order_id` | TEXT | DEFAULT NULL | ✏️ Renamed from `id_order` |
| `sku` | VARCHAR(100) | DEFAULT NULL | |
| `type` | VARCHAR(50) | DEFAULT NULL | |
| `code` | VARCHAR(50) | DEFAULT NULL | |
| `issues_status` | TEXT | DEFAULT NULL | |
| `shipstation_order_id` | TEXT | DEFAULT NULL | ✏️ Renamed from `id_shipstation_order` |
| `note` | TEXT | DEFAULT NULL | |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date_created` |
| `ship_date` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date_ship` |

**Foreign Keys:**
- `shipment_id` → `outbound_shipment(id)` ON DELETE CASCADE
- `shipment_order_id` → `outbound_shipment_order(id)`

**Indexes:**
- `idx_outbound_shipment_product_shipment`
- `idx_outbound_shipment_product_order`

---

#### `shipstation_order` ✏️ (renamed from `db_shipstation_order`)
**Status**: ShipStation integration orders

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `order_id` | BIGINT | FK → `order.id`, NOT NULL | ✏️ Renamed from `id_order` |
| `order_number` | VARCHAR(256) | DEFAULT '' | |
| `tracking_number` | VARCHAR(256) | DEFAULT '' | |
| `tag` | VARCHAR(150) | DEFAULT '' | |
| `note` | VARCHAR(800) | DEFAULT '' | |
| `batch` | VARCHAR(156) | DEFAULT '' | |
| `status` | VARCHAR(20) | DEFAULT '' | |
| `ship_date` | DATE | DEFAULT NULL | |
| `delivered_date` | DATE | DEFAULT NULL | |
| `estimated_delivery` | DATE | DEFAULT NULL | |
| `combine_id` | VARCHAR(256) | DEFAULT '' | |
| `list_combine` | VARCHAR(256) | DEFAULT '' | |
| `list_combine_number` | VARCHAR(256) | DEFAULT '' | |
| `order_link` | VARCHAR(256) | DEFAULT '' | ✏️ Renamed from `link_order` |
| `updated_at` | TIMESTAMP WITH TIME ZONE | NOT NULL DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `time` |

**Foreign Keys:**
- `order_id` → `order(id)`

**Indexes:**
- `idx_shipstation_order_order`

---

## Summary

### Tables in Shipping & Logistics Department
1. **inbound_shipment** - Incoming shipments
2. **inbound_shipment_item** - Shipment items
3. **inbound_shipment_note** - Shipment notes
4. **inbound_shipment_order** - Inbound shipment-order mapping
5. **outbound_shipment** - Outgoing shipments
6. **outbound_shipment_order** - Outbound shipment-order mapping
7. **outbound_shipment_product** - Outbound shipment products
8. **shipstation_order** - ShipStation integration orders

### Key Features
- **Inbound Tracking**: Complete tracking of incoming shipments with items, notes, and orders
- **Outbound Tracking**: Full tracking of outgoing shipments with products and orders
- **Integration**: ShipStation integration for order fulfillment
- **Foreign Keys**: Proper relationships with staff, order, and shipment tables
- **Indexes**: Optimized for common queries (shipment_id, order_id)

### Relationships
- `inbound_shipment.updated_by_id` → `staff.id`
- `inbound_shipment_item.shipment_id` → `inbound_shipment(id)`
- `inbound_shipment_note.shipment_id` → `inbound_shipment(id)`
- `inbound_shipment_note.updated_by_id` → `staff.id`
- `inbound_shipment_order.order_id` → `order(id)`
- `inbound_shipment_order.shipment_id` → `inbound_shipment(id)`
- `outbound_shipment.updated_by_id` → `staff.id`
- `outbound_shipment_order.shipment_id` → `outbound_shipment(id)`
- `outbound_shipment_order.updated_by_id` → `staff.id`
- `outbound_shipment_product.shipment_id` → `outbound_shipment(id)`
- `outbound_shipment_product.shipment_order_id` → `outbound_shipment_order(id)`
- `shipstation_order.order_id` → `order(id)`

