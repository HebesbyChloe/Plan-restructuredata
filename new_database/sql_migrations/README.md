# SQL Migrations

This directory contains PostgreSQL migration scripts generated from the schema markdown files.

## Migration Order

Migrations should be run in the following order due to foreign key dependencies:

### 1. Foundation Tables (Run First)
These tables are referenced by other tables:

- **Sales/Staff** (`sales/001_create_staff_tables.sql`)
  - `staff` - Employee records (referenced by many tables)
  - `shift_schedule`, `shift_report`, `sales_performance`, `lead_sale`

### 2. Core Business Tables
- **Sales/Customers** (`sales/003_create_customers_tables.sql`) - TODO
  - `customer` and related tables
  
- **Sales/Orders** (`sales/004_create_orders_tables.sql`) - TODO
  - `order`, `order_detail`, `order_line_item`, etc.

### 3. CRM Tables
- **CRM/Schedule** (`crm/001_create_schedule_tables.sql`) ✅
  - `schedule`, `schedule_preferences`, `schedule_revision`, etc.
  - **Dependencies**: `staff`, `shift_report`

- **CRM/Tasks** (`crm/002_create_tasks_tables.sql`) ✅
  - `project`, `task`, `task_assignee`, `recurring_task`, etc.
  - **Dependencies**: `staff`, `project`, `order`, `customer`

### 4. Shipping & Logistics
- **Sales/Shipping** (`sales/002_create_shipping_tables.sql`) ✅
  - `inbound_shipment`, `outbound_shipment` and related tables
  - **Dependencies**: `staff`, `order`, `order_line_item`

### 5. Catalog & Products
- **Catalog** (`catalog/001_create_catalog_tables.sql`) - TODO
  - `product`, `category`, `stock`, etc.

### 6. Other Tables
- **Others/Campaign** (`others/001_create_campaign_tables.sql`) - TODO
- **Others/History** (`others/002_create_history_tables.sql`) - TODO
- **Others/Workflow** (`others/003_create_workflow_tables.sql`) - TODO

## Running Migrations

### Using psql:
```bash
# Set your database connection
export PGHOST=localhost
export PGDATABASE=your_database
export PGUSER=your_user

# Run migrations in order
psql -f sales/001_create_staff_tables.sql
psql -f crm/001_create_schedule_tables.sql
psql -f crm/002_create_tasks_tables.sql
psql -f sales/002_create_shipping_tables.sql
# ... continue with other migrations
```

### Using a migration tool:
If you're using a migration tool like Flyway, Liquibase, or Django migrations, ensure the files are numbered correctly and run in order.

## Notes

1. **Extensions Required**: Some migrations require PostgreSQL extensions:
   - `btree_gist` (for EXCLUDE constraints in schedule table)

2. **ENUM Types**: Some migrations create ENUM types that are used by multiple tables:
   - `schedule_status`, `time_off_request_status`
   - `inbound_shipment_status`, `outbound_shipment_status`

3. **Foreign Key Dependencies**: Pay attention to the order as foreign keys will fail if referenced tables don't exist.

4. **Data Migration**: Some tables have migration notes for legacy data:
   - `schedule_revision.updated_by_name` - fallback for legacy VARCHAR data

## Status

✅ **Completed Migrations:**
- `crm/001_create_schedule_tables.sql`
- `crm/002_create_tasks_tables.sql`
- `sales/001_create_staff_tables.sql`
- `sales/002_create_shipping_tables.sql`

⏳ **Pending Migrations:**
- `sales/003_create_customers_tables.sql`
- `sales/004_create_orders_tables.sql`
- `catalog/001_create_catalog_tables.sql`
- `others/001_create_campaign_tables.sql`
- `others/002_create_history_tables.sql`
- `others/003_create_workflow_tables.sql`

## Schema Source

All migrations are generated from markdown schema files in `../schema/` directory:
- `schema/crm/` - CRM related schemas
- `schema/sales/` - Sales related schemas
- `schema/catalog/` - Product catalog schemas
- `schema/others/` - Other schemas

