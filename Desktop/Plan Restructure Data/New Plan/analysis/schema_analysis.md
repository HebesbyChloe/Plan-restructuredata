# CRM Database Schema Analysis

## Overview
Total Tables: 80+
- `db_*` tables: 71 tables (main system)
- `res_*` tables: 9 tables (reserve/alternative system)
- `twilio_*` tables: 10 tables (Twilio integration)
- Other: 1 table (`note_order_not_found`)

## Table Categories

### Core Business Entities
1. **Customers** (`db_customer`)
   - Primary entity with 40+ fields
   - Relationships: orders, leads, batches, contacts
   - Issues: Mixed data types, calculated fields stored

2. **Orders** (`db_order`, `db_order_detail`, `db_order_line_item`)
   - Complex order management
   - Relationships: customers, staff, payments, shipments
   - Issues: Redundant customer data, missing FKs

3. **Products** (`db_iv_product`, `res_product`)
   - Product catalog with inventory
   - Relationships: categories, attributes, stock, orders
   - Issues: Denormalized attributes, comma-separated categories

4. **Staff** (`db_staff`, `db_employee_dashboard`)
   - Employee management
   - Relationships: orders, shifts, tasks, performance
   - Issues: Duplicate data between tables

### Campaigns & Marketing
5. **Campaigns** (`db_campaigns`)
   - Marketing campaign management
   - **CRITICAL**: Contains comma-separated values needing normalization
   - Fields to normalize: `ids_ads`, `ids_ads_running`, `target_audiences`, `collection_selection`

6. **Promotions** (`db_promo`, `db_new_promo_two`, `db_new_promo_two_item`)
   - Promotion management
   - Issues: Multiple promo tables, comma-separated product/category lists

### Inventory Management
7. **Stock** (`db_iv_stock`, `res_stock`, `db_material_stock`)
   - Inventory tracking
   - Relationships: products, locations, shipments
   - Issues: Multiple stock tables, location as varchar

8. **Shipments** (`db_inbound_shipment`, `db_outbound_shipments`)
   - Shipping management
   - Relationships: orders, products, staff
   - Issues: Missing FKs, text fields for order IDs

### Sales & Performance
9. **Sales Tracking** (`db_lead_sale`, `db_sales_performance_tracker`, `db_list_end_shift`)
   - Sales performance metrics
   - Relationships: staff, customers, orders
   - Issues: Calculated fields stored, missing indexes

10. **Shifts** (`db_shift_schedule_sales`, `db_draft_shift_schedule_sales`, `db_revision_shift_schedule`)
    - Staff scheduling
    - Relationships: staff, reports
    - Issues: Multiple shift tables, missing FKs

### Tasks & Projects
11. **Projects** (`db_project_space`, `db_task_space`, `db_task_repeat_space`)
    - Project and task management
    - Relationships: staff, orders, customers
    - Issues: Comma-separated assignee IDs

### Communication
12. **Messages** (`db_messages_pancake`, `db_summary_messages_pancake`, `db_conversation_task`)
    - Customer communication tracking
    - Relationships: customers, staff
    - Issues: Text fields for IDs, missing FKs

13. **Twilio Integration** (`twilio_*` tables)
    - SMS/communication platform
    - Well-structured with proper FKs
    - Uses UUIDs instead of integers

### History & Logging
14. **History Tables** (`db_history_*`)
    - Audit trails and logs
    - Issues: Missing indexes, inconsistent timestamps

## Key Relationships Identified

### Customer Relationships
- `db_customer` → `db_order` (one-to-many, via `id` → customer fields)
- `db_customer` → `db_lead_sale` (one-to-many, via `id_lead`)
- `db_customer` → `db_customer_batch` (many-to-many, via `id_batch`)
- `db_customer` → `db_contact_pancake` (one-to-many, via `id_customer`)
- `db_customer` → `db_sub_id_lead` (one-to-many, via `id_customer`)

### Order Relationships
- `db_order` → `db_order_detail` (one-to-one, via `id`)
- `db_order` → `db_order_line_item` (one-to-many, via `id_order`)
- `db_order` → `db_payment_order` (one-to-many, via `parent_id`)
- `db_order` → `db_staff` (many-to-one, via `id_nv_chotdon`, `id_nv_gioithieu`, `support_by`)
- `db_order` → `db_shipstation_order` (one-to-one, via `id_order`)

### Product Relationships
- `db_iv_product` → `db_iv_category` (many-to-many, via comma-separated `category`)
- `db_iv_product` → `db_iv_stock` (one-to-many, via `sku`)
- `db_iv_product` → `db_order_line_item` (one-to-many, via `sku`)
- `db_iv_product` → `db_iv_attributes` (many-to-many, via denormalized fields)

### Campaign Relationships
- `db_campaigns` → Ads (many-to-many, via comma-separated `ids_ads`)
- `db_campaigns` → Audiences (many-to-many, via comma-separated `target_audiences`)
- `db_campaigns` → Collections (many-to-many, via comma-separated `collection_selection`)

### Staff Relationships
- `db_staff` → `db_order` (one-to-many, multiple roles)
- `db_staff` → `db_shift_schedule_sales` (one-to-many, via `id_staff`)
- `db_staff` → `db_sales_performance_tracker` (one-to-many, via `id_staff`)
- `db_staff` → `db_task_space` (one-to-many, via `id_assignee`)

## Normalization Opportunities

### High Priority
1. **Campaigns Table**
   - `ids_ads` → `campaign_ads` junction table
   - `ids_ads_running` → `campaign_ads_running` junction table
   - `target_audiences` → `campaign_target_audiences` junction table
   - `collection_selection` → `campaign_collections` junction table

2. **Product Categories**
   - `db_iv_product.category` (comma-separated) → `product_categories` junction table
   - `db_iv_product.collection` (comma-separated) → `product_collections` junction table

3. **Task Assignees**
   - `db_task_repeat_space.ids_assignee` → `task_assignees` junction table

4. **Promotion Items**
   - `db_promo.category`, `db_promo.product`, `db_promo.attribute` → junction tables
   - `db_new_promo_two_item` has similar issues

5. **Customer Batch Conversions**
   - `db_customer_batch.conversion_customer_id` (text) → `customer_batch_conversions` junction table
   - `db_customer_batch.conversion_order_id` (text) → `customer_batch_order_conversions` junction table

### Medium Priority
6. **Order Tags**
   - `db_order.tag` (comma-separated) → `order_tags` junction table

7. **Product Tags**
   - `db_iv_product.tag` (comma-separated) → `product_tags` junction table

8. **Outbound Shipment Orders**
   - `db_outbound_shipments.create_order_id` (text) → `outbound_shipment_orders` junction table

## Data Type Issues

### Monetary Values
- **Issue**: Using `float` for currency (imprecise)
- **Fix**: Convert to `DECIMAL(12,2)` or `NUMERIC(12,2)`
- **Affected Tables**: 
  - `db_customer.total`, `current_amount`
  - `db_order.total`, `net_payment`, `total_refunded`
  - `db_payment_order.amount`
  - `db_material_stock.price`, `cost`
  - All revenue/amount fields

### Integer Types
- **Issue**: Inconsistent use of `int(11)` vs `bigint(15)`
- **Fix**: Standardize to `BIGINT` for IDs, `INTEGER` for counts
- **Note**: PostgreSQL doesn't support display width like MySQL

### Timestamps
- **Issue**: Mix of `datetime`, `timestamp`, `date`
- **Fix**: Use `TIMESTAMP WITH TIME ZONE` for all datetime fields
- **Affected**: All date/time fields

### Booleans
- **Issue**: Using `tinyint(1)` for boolean values
- **Fix**: Use `BOOLEAN` type
- **Affected**: All flag fields (error_phone, error_email, etc.)

### Text Fields
- **Issue**: Using `varchar` for long text
- **Fix**: Use `TEXT` for fields > 500 chars or variable length content
- **Affected**: Description fields, notes, JSON data

## Missing Foreign Keys

### Critical Missing FKs
1. `db_order.id_nv_chotdon` → `db_staff.id`
2. `db_order.id_nv_gioithieu` → `db_staff.id`
3. `db_order.support_by` → `db_staff.id`
4. `db_order_line_item.id_order` → `db_order.id`
5. `db_order_line_item.sku` → `db_iv_product.sku`
6. `db_payment_order.parent_id` → `db_order.id`
7. `db_customer_batch.assigned_to` → `db_staff.id`
8. `db_lead_sale.id_staff` → `db_staff.id`
9. `db_shift_schedule_sales.id_staff` → `db_staff.id`
10. `db_task_space.id_assignee` → `db_staff.id`
11. `db_task_space.assignee_by` → `db_staff.id`
12. `db_contact_pancake.id_customer` → `db_customer.id`
13. `db_items_inbound_shipment.id_shipment` → `db_inbound_shipment.id`
14. `db_orders_inbound_shipment.id_shipment` → `db_inbound_shipment.id`
15. `db_orders_inbound_shipment.id_order` → `db_order.id`

### Index Requirements
All foreign key columns need indexes for performance.

## Duplicate Tables Analysis

### res_* Tables
These appear to be a separate system (possibly reserve/backup or different store):

1. `res_order` vs `db_order` - Similar structure, fewer fields in res
2. `res_order_detail` vs `db_order_detail` - Similar structure
3. `res_order_line_item` vs `db_order_line_item` - Similar structure
4. `res_product` vs `db_iv_product` - Different schemas, res is simpler
5. `res_stock` vs `db_iv_stock` - Similar structure
6. `res_category` vs `db_iv_category` - Similar structure
7. `res_attributes` vs `db_iv_attributes` - Different schemas
8. `res_cat_autosku` vs `db_cat_autosku` - Similar structure
9. `res_history_stock` vs `db_history_stock` - Similar structure

**Recommendation**: Keep separate, standardize both independently. Consider adding `system_type` enum or using schema namespace.

## Character Set Issues

- **utf8mb3**: Deprecated, should be utf8mb4
- **latin1**: Should be UTF-8
- **utf8mb4**: Correct for modern applications
- **PostgreSQL**: Uses UTF-8 by default, no charset specification needed

## Audit Field Standardization

### Current State
- Inconsistent naming: `date_created`, `created_at`, `date_updated`, `updated_at`, `last_update`
- Missing `created_by`/`updated_by` in most tables
- Inconsistent timestamp types

### Standard
- `created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`
- `updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`
- `created_by_id BIGINT REFERENCES staff(id)`
- `updated_by_id BIGINT REFERENCES staff(id)`

## Special Considerations

### Workflow AI Table
- Uses JSONB-like structure (good for PostgreSQL)
- Already has proper JSON validation
- Can use PostgreSQL JSONB type directly

### Twilio Tables
- Well-structured with proper FKs
- Uses UUIDs (good practice)
- Minimal changes needed

### Status Fields
- Many use `varchar` for status
- Consider ENUM types in PostgreSQL for fixed value sets
- Or create lookup tables for maintainability

## Performance Considerations

### Large Tables
- `db_history_action`: 4.7M+ records
- `db_history_stock`: 751K+ records
- `db_messages_pancake`: 625K+ records
- `db_order`: 9.9B+ records (based on AUTO_INCREMENT)

### Indexing Strategy
1. All foreign keys
2. Frequently queried: email, phone, status, dates
3. Composite indexes for common query patterns
4. Consider partitioning for very large tables

## Migration Complexity

### Low Complexity
- Data type conversions
- Character set handling
- Adding audit fields

### Medium Complexity
- Normalizing comma-separated values
- Adding foreign keys (need to verify data integrity first)
- Standardizing naming

### High Complexity
- Handling duplicate tables (res_*)
- Large table migrations
- Data validation and cleanup

