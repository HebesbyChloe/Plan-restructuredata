# Inventory Audit & History

## Overview
This document shows the Inventory Audit & History schema structure with data types, foreign keys, and change indicators. This module tracks inventory audit cycles, stock discrepancies, and audit history for compliance and inventory management.

**Legend:**
- 🆕 **NEW** - Newly created tables
- 🔄 **NORMALIZED** - Comma-separated values moved to junction tables
- 🗑️ **REMOVED** - Fields/tables removed or consolidated
- ✏️ **RENAMED** - Table/column renamed
- 📊 **DENORMALIZED** - Denormalized for performance (if any)

---

## Core Tables

#### `inventory_history` ✏️ (renamed from `db_history_inventory`)
**Status**: Inventory audit history and stock discrepancy tracking

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `product_id` | BIGINT | FK → `product.id`, NOT NULL | 🆕 Links to product table |
| `stock_id` | BIGINT | FK → `stock.id`, NOT NULL | 🆕 Links to stock table |
| `audit_date` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date` - Date/time of audit |
| `cycle_number` | INTEGER | DEFAULT 1 | ✏️ Renamed from `times` - Audit cycle/round number |
| `status` | VARCHAR(50) | DEFAULT 'pending' | ✏️ Changed from `tinyint` - Audit status: 'pending', 'in_progress', 'completed', 'cancelled' |
| `product_sku` | VARCHAR(100) | NOT NULL | ✏️ Renamed from `sku_product` - 📊 Denormalized from `product.sku` for historical accuracy |
| `product_name` | VARCHAR(500) | NOT NULL | ✏️ Renamed from `name_product` - 📊 Denormalized from `product.name` for historical accuracy |
| `recorded_quantity` | INTEGER | NOT NULL DEFAULT 0 | ✏️ Renamed from `stock` - Quantity recorded in system before audit (from stock table based on location) |
| `actual_quantity` | INTEGER | NOT NULL DEFAULT 0 | ✏️ Renamed from `actual` - Actual quantity counted during audit |
| `quantity_discrepancy` | INTEGER | NOT NULL DEFAULT 0 | ✏️ Renamed from `discrepancy` - Calculated: actual_quantity - recorded_quantity |
| `details` | TEXT | DEFAULT NULL | ✏️ Renamed from `detail` - Audit notes and details |
| `warehouse_id` | BIGINT | FK → `warehouse.id`, NOT NULL | 🆕 Changed from `location` (VARCHAR) to FK |
| `audited_by_id` | BIGINT | FK → `staff.id`, NULL | ✏️ Renamed from `user` - Staff who performed the audit |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | 🆕 Record creation timestamp |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | 🆕 Last update timestamp |

**Foreign Keys:**
- `product_id` → `product(id)` ON DELETE CASCADE
- `stock_id` → `stock(id)` ON DELETE CASCADE
- `warehouse_id` → `warehouse(id)` ON DELETE CASCADE
- `audited_by_id` → `staff(id)` ON DELETE SET NULL

**Indexes:**
- `idx_inventory_history_product` (on `product_id`)
- `idx_inventory_history_stock` (on `stock_id`)
- `idx_inventory_history_product_sku` (on `product_sku`)
- `idx_inventory_history_warehouse` (on `warehouse_id`)
- `idx_inventory_history_audit_date` (on `audit_date`)
- `idx_inventory_history_status` (on `status`)
- `idx_inventory_history_cycle_number` (on `cycle_number`)
- `idx_inventory_history_audited_by` (on `audited_by_id`)
- `idx_inventory_history_product_warehouse` (on `product_id`, `warehouse_id`) - For product-warehouse queries

**Design Notes:**
- **Purpose**: Tracks inventory audit cycles and stock discrepancies
- **Audit Workflow**: 
  - `pending` → Audit scheduled but not started
  - `in_progress` → Audit currently being performed
  - `completed` → Audit finished, discrepancies recorded
  - `cancelled` → Audit cancelled
- **Discrepancy Calculation**: `quantity_discrepancy = actual_quantity - recorded_quantity`
  - Positive discrepancy: More items found than recorded (overage)
  - Negative discrepancy: Fewer items found than recorded (shortage)
  - Zero discrepancy: Count matches system records
- **Warehouse Relationship**: Links to `warehouse` table for proper referential integrity
- **Product & Stock Links**: 
  - `product_id` links directly to `product.id` for product information
  - `stock_id` links directly to `stock.id` for stock information
  - `warehouse_id` links directly to `warehouse.id` for warehouse information
  - `recorded_quantity` should be populated from `stock.qty` where `stock.product_sku` matches and `stock.warehouse_id` matches the audit warehouse
- **Historical Data**: `product_sku` and `product_name` are denormalized to preserve historical accuracy even if product/stock records are updated or deleted
- **Data Source**: When creating audit record, get product info from `product` table and stock quantity from `stock` table: `SELECT id, qty FROM stock WHERE product_sku = 'PROD-001' AND warehouse_id = 1`

**Example Usage:**

**Inventory Audit Record:**
- Product ID: 123, Stock ID: 456, Warehouse ID: 1 (VN Warehouse), Cycle: 1
- `product_id=123`, `stock_id=456`, `warehouse_id=1`, `product_sku='PROD-001'`, `product_name='Sản phẩm A'`, `cycle_number=1`
- `recorded_quantity=100` (from `stock.qty` where `stock.warehouse_id=1`), `actual_quantity=95`, `quantity_discrepancy=-5` (shortage of 5 units)
- `status='completed'`, `audited_by_id=123`, `details='Found 5 units missing during cycle count'`

**How to populate data:**
1. Get product info from `product` table: `SELECT id, sku, name FROM product WHERE sku = 'PROD-001'`
2. Get stock info from `stock` table: `SELECT id, qty, warehouse_id FROM stock WHERE product_sku = 'PROD-001' AND warehouse_id = 1`
3. Use `stock.qty` as `recorded_quantity` for the matching warehouse
4. Insert audit record with `product_id`, `stock_id`, `warehouse_id`, and denormalized `product_sku`, `product_name`

**Multiple Audit Cycles:**
- Same product, same warehouse, different cycles
- Cycle 1: `cycle_number=1`, `audit_date='2024-01-15'`, `quantity_discrepancy=-5`
- Cycle 2: `cycle_number=2`, `audit_date='2024-02-15'`, `quantity_discrepancy=+2` (overage)

**Note**: 
- Each audit cycle creates a new record, allowing tracking of inventory accuracy over time
- Discrepancies can be analyzed to identify patterns (theft, damage, data entry errors, etc.)
- Warehouse-based queries help identify which warehouses have accuracy issues

---

## Summary

### Tables in Inventory Audit Module
1. **inventory_history** - Inventory audit history and stock discrepancy tracking

### Key Features
- **Product & Stock Integration**: Direct foreign keys to `product` and `stock` tables for easy data retrieval
- **Warehouse Integration**: Direct foreign key to `warehouse` table for proper warehouse tracking
- **Audit Tracking**: Complete history of inventory audits with cycle numbers and timestamps
- **Discrepancy Management**: Automatic calculation of quantity discrepancies (actual vs recorded)
- **Warehouse Support**: Track audits by warehouse using FK relationship for better data integrity
- **Status Workflow**: Audit lifecycle management (pending → in_progress → completed/cancelled)
- **Historical Accuracy**: Denormalized product SKU and name preserve historical data even if product/stock records are updated or deleted
- **Staff Attribution**: Links audits to staff members for accountability
- **Data Source**: `recorded_quantity` is populated from `stock.qty` where `stock.warehouse_id` matches the audit warehouse
- **Data Types**: All quantities use INTEGER, timestamps use TIMESTAMP WITH TIME ZONE

### Relationships
- `inventory_history.product_id` → `product.id`
- `inventory_history.stock_id` → `stock.id`
- `inventory_history.warehouse_id` → `warehouse.id`
- `inventory_history.audited_by_id` → `staff.id`

### Query Patterns

**Get all discrepancies for a product (with product and stock info):**
```sql
SELECT ih.*, p.name as current_product_name, p.sku as current_product_sku,
       s.qty, w.code as warehouse_code, w.name as warehouse_name, s.outbound, s.inbound
FROM inventory_history ih
JOIN product p ON ih.product_id = p.id
JOIN stock s ON ih.stock_id = s.id
JOIN warehouse w ON ih.warehouse_id = w.id
WHERE ih.product_id = 123 
  AND ih.status = 'completed'
ORDER BY ih.audit_date DESC;
```

**Find products with recurring discrepancies:**
```sql
SELECT ih.product_id, ih.product_sku, ih.product_name, w.code as warehouse_code, 
       COUNT(*) as audit_count,
       AVG(ih.quantity_discrepancy) as avg_discrepancy
FROM inventory_history ih
JOIN warehouse w ON ih.warehouse_id = w.id
WHERE ih.status = 'completed'
GROUP BY ih.product_id, ih.product_sku, ih.product_name, w.code
HAVING COUNT(*) > 1 AND AVG(ABS(ih.quantity_discrepancy)) > 5
ORDER BY avg_discrepancy DESC;
```

**Get latest audit for each product-warehouse:**
```sql
SELECT DISTINCT ON (ih.product_id, ih.warehouse_id) 
       ih.*, p.name as current_product_name, s.qty, w.code as warehouse_code, w.name as warehouse_name
FROM inventory_history ih
JOIN product p ON ih.product_id = p.id
JOIN stock s ON ih.stock_id = s.id AND s.warehouse_id = ih.warehouse_id
JOIN warehouse w ON ih.warehouse_id = w.id
WHERE ih.status = 'completed'
ORDER BY ih.product_id, ih.warehouse_id, ih.audit_date DESC;
```

**Get audit records with product and stock details:**
```sql
SELECT ih.*, 
       p.name as current_product_name, 
       p.sku as current_product_sku,
       s.qty as current_stock_quantity,
       w.code as warehouse_code,
       w.name as warehouse_name
FROM inventory_history ih
JOIN product p ON ih.product_id = p.id
JOIN stock s ON ih.stock_id = s.id AND s.warehouse_id = ih.warehouse_id
JOIN warehouse w ON ih.warehouse_id = w.id
WHERE ih.status = 'completed'
ORDER BY ih.audit_date DESC;
```

---

