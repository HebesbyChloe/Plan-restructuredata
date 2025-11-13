# SQL Migrations for PostgreSQL

This directory contains SQL migration files for creating the complete database schema for the ERP system.

## Migration Files

### Completed Migrations

1. **001_system_tenant.sql** - System & Multi-Tenancy Module
   - `sys_tenants` - Multi-tenant organizations
   - `sys_users` - Application users linked to Supabase auth
   - `sys_roles` - Role catalog per tenant
   - `sys_permissions` - Global permission catalog
   - `sys_role_permissions` - Role-permission bridge table
   - `sys_user_roles` - User-role assignments per tenant

2. **002_channels_platforms.sql** - Channels & Platforms Module
   - `channels_platforms` - Top-level marketing platforms
   - `channels_platform_pages` - Individual pages/accounts within platforms

3. **003_crm_customer.sql** - CRM Customer Module
   - `crm_personal_keys` - Canonical person identifier
   - `crm_personal_contacts` - Multiple contacts per person
   - `crm_personal_addresses` - Address information
   - `crm_personal_profile` - Profile data with JSONB
   - `crm_personal_journey` - Customer journey tracking
   - `crm_leads` - Lead lifecycle management
   - `crm_customers` - Canonical customer record
   - `crm_potential` - Sales opportunity/pipeline
   - `crm_reengaged_batches` - Re-engagement campaign grouping
   - `crm_reengage_personal_keys` - Batch membership and outcomes
   - `crm_reengage_batches_stats` - Daily batch performance metrics

4. **004_orders_domain.sql** - Orders Domain Module
   - `orders` - Order headers
   - `order_items` - Order line items
   - `order_items_after_sales` - After-sales service cases
   - `order_item_pre_orders` - Pre-order records
   - `order_item_customization` - Custom item workflow
   - `orders_meta` - Order metadata (1:1)
   - `order_meta_crm` - CRM metadata for orders (1:1)
   - `order_images` - Order images and attachments
   - `order_payments` - Payment transactions

### Pending Migrations

The following migration files still need to be created:

5. **005_product_inventory.sql** - Product & Inventory Domain
   - Product catalog, categories, variants
   - Inventory management
   - Materials and BOM
   - Product attributes and tags

6. **006_tasks_projects.sql** - Tasks & Projects Domain
   - Project management
   - Task system
   - Milestones, dependencies
   - Comments, attachments, activity logs

7. **007_marketing_campaigns.sql** - Marketing & Campaigns Domain
   - Marketing campaigns
   - Promotions and discounts
   - Marketing assets
   - Brand settings
   - UTM tracking

8. **008_omnichannel.sql** - Omnichannel Domain
   - Unified contacts
   - Unified messages
   - Message attachments and reactions
   - Conversation tracking

9. **009_sms_module.sql** - SMS Module
   - SMS sender accounts
   - SMS service accounts
   - SMS messages
   - SMS conversations
   - SMS attachments and reactions

10. **010_performance_schedule.sql** - Performance & Schedule Domain
    - Performance evaluations
    - Schedule management
    - Time off requests
    - Shift reports

11. **011_logs_alerts.sql** - Logs & Alerts Domain
    - System logs
    - Human action logs
    - Webhook logs
    - Alerts system
    - Notes system

## Usage

### Running Migrations

Execute migrations in order:

```bash
# Connect to PostgreSQL
psql -U postgres -d your_database

# Run migrations in order
\i 001_system_tenant.sql
\i 002_channels_platforms.sql
\i 003_crm_customer.sql
\i 004_orders_domain.sql
# ... continue with remaining migrations
```

### Using psql

```bash
psql -U postgres -d your_database -f 001_system_tenant.sql
psql -U postgres -d your_database -f 002_channels_platforms.sql
psql -U postgres -d your_database -f 003_crm_customer.sql
psql -U postgres -d your_database -f 004_orders_domain.sql
```

### Using pgAdmin or DBeaver

1. Open the SQL file
2. Execute the entire script
3. Verify tables were created successfully

## Dependencies

Migration files have dependencies and must be run in order:

```
001_system_tenant.sql (no dependencies)
    ↓
002_channels_platforms.sql (depends on: sys_tenants)
    ↓
003_crm_customer.sql (depends on: sys_tenants, sys_users)
    ↓
004_orders_domain.sql (depends on: sys_tenants, sys_users, crm_customers, crm_personal_addresses, channels_platform_pages)
    ↓
005_product_inventory.sql (depends on: sys_tenants, sys_users)
    ↓
006_tasks_projects.sql (depends on: sys_tenants, sys_users)
    ↓
007_marketing_campaigns.sql (depends on: sys_tenants, sys_users, channels_platform_pages, product)
    ↓
008_omnichannel.sql (depends on: sys_tenants, sys_users, channels_platform_pages)
    ↓
009_sms_module.sql (depends on: sys_tenants, sys_users, crm_customers, mkt_campaigns, project)
    ↓
010_performance_schedule.sql (depends on: sys_tenants, sys_users)
    ↓
011_logs_alerts.sql (depends on: sys_tenants, sys_users)
```

## Notes

### External Dependencies

- **Supabase Auth**: The `sys_tenants` and `sys_users` tables reference `auth.users` from Supabase Auth. Ensure Supabase Auth is set up before running migrations.

### Deferred Foreign Keys

Some foreign keys are commented out in migration files because they reference tables that will be created in later migrations. These should be added after all migrations are complete:

- `order_items.product_id` → `product(id)`
- `crm_leads.order_id` → `orders(id)`
- `crm_potential.campaign_id` → `mkt_campaigns(id)`
- `crm_potential.converted_to_order_id` → `orders(id)`
- `crm_reengage_personal_keys.converted_order_id` → `orders(id)`

### Data Types

- Most primary keys use `BIGINT` for scalability
- `crm_personal_keys.id` uses `INTEGER` (legacy, consider migration to BIGINT in future)
- All `tenant_id` fields use `BIGINT`
- All user references use `sys_users.id` (BIGINT)
- Money amounts use `NUMERIC` with appropriate precision
- Timestamps use `TIMESTAMPTZ` for timezone support

### Indexes

- All foreign keys have corresponding indexes
- Composite indexes for common query patterns
- Partial indexes for soft-delete filtering (`WHERE deleted_at IS NULL`)
- GIN indexes for JSONB columns

### Triggers

- Auto-update `updated_at` timestamps via `update_updated_at_column()` function
- Function is defined in `001_system_tenant.sql` and reused across all migrations

## Verification

After running migrations, verify tables were created:

```sql
-- Check table count
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';

-- List all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Check foreign keys
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
ORDER BY tc.table_name, kcu.column_name;
```

## Troubleshooting

### Error: relation "auth.users" does not exist

**Solution**: Ensure Supabase Auth is set up. If not using Supabase, you may need to:
1. Create a stub `auth.users` table, or
2. Modify the foreign key constraints to reference your auth system

### Error: relation "sys_tenants" does not exist

**Solution**: Ensure migrations are run in order. `001_system_tenant.sql` must be run first.

### Error: duplicate key value violates unique constraint

**Solution**: The migration may have been partially run. Drop existing tables and re-run the migration.

## Next Steps

1. Complete remaining migration files (005-011)
2. Add any missing foreign key constraints
3. Create initial seed data (optional)
4. Set up Row Level Security (RLS) policies
5. Create database functions and stored procedures
6. Set up database backups

## Support

For issues or questions, refer to the schema documentation in `new_database/schema/new_fix/`.

