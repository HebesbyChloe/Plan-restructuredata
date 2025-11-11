# CRM Database Migration Guide

## Overview

This guide documents the migration of the CRM database from MySQL to PostgreSQL, including schema standardization, normalization, and data migration procedures.

## Table of Contents

1. [Migration Overview](#migration-overview)
2. [Schema Changes](#schema-changes)
3. [Naming Conventions](#naming-conventions)
4. [Data Type Mappings](#data-type-mappings)
5. [Normalization Changes](#normalization-changes)
6. [Migration Steps](#migration-steps)
7. [Validation Procedures](#validation-procedures)
8. [Rollback Plan](#rollback-plan)
9. [Post-Migration Tasks](#post-migration-tasks)

## Migration Overview

### Objectives
- Migrate from MySQL to PostgreSQL
- Standardize naming conventions
- Normalize denormalized data structures
- Add proper foreign key relationships
- Improve data integrity and scalability

### Scope
- **80+ tables** migrated
- **Comma-separated values** normalized into junction tables
- **Data types** standardized
- **Foreign keys** added for referential integrity
- **Indexes** optimized for performance

## Schema Changes

### Table Name Changes

All `db_*` prefix tables have been renamed to remove the prefix. See `analysis/naming_conventions.md` for complete mapping.

Key changes:
- `db_customer` → `customer`
- `db_order` → `order` (note: PostgreSQL reserved word, may need quotes)
- `db_staff` → `staff`
- `db_iv_product` → `product`
- `db_campaigns` → `campaign`

### Reserve System Tables

`res_*` tables are kept separate and renamed with `reserve_` prefix:
- `res_order` → `reserve_order`
- `res_product` → `reserve_product`
- etc.

## Naming Conventions

### Table Names
- **Singular nouns** for main entities
- **Plural nouns** for junction/lookup tables
- **No prefixes** (except `twilio_*` and `reserve_*`)
- **Snake_case** throughout

### Column Names
- **Primary keys**: `id` (BIGSERIAL)
- **Foreign keys**: `{table}_id` (e.g., `customer_id`, `order_id`)
- **Audit fields**: `created_at`, `updated_at`, `created_by_id`, `updated_by_id`
- **Boolean fields**: `is_*` or descriptive names (e.g., `error_phone`)

See `analysis/naming_conventions.md` for complete details.

## Data Type Mappings

### MySQL → PostgreSQL

| MySQL Type | PostgreSQL Type | Notes |
|------------|----------------|-------|
| `int(11)` | `INTEGER` or `BIGINT` | Based on usage |
| `bigint(15)` | `BIGSERIAL` | For primary keys |
| `float` | `NUMERIC(12,2)` | For monetary values |
| `decimal(12,2)` | `NUMERIC(12,2)` | Direct mapping |
| `varchar(n)` | `VARCHAR(n)` or `TEXT` | TEXT for > 500 chars |
| `datetime` | `TIMESTAMP WITH TIME ZONE` | Standardized |
| `timestamp` | `TIMESTAMP WITH TIME ZONE` | Standardized |
| `date` | `DATE` | Direct mapping |
| `tinyint(1)` | `BOOLEAN` | Boolean values |
| `enum(...)` | `ENUM` type or `VARCHAR` | PostgreSQL ENUM or VARCHAR |
| `text` | `TEXT` | Direct mapping |
| `longtext` | `TEXT` | Direct mapping |

### Special Handling

1. **Invalid Dates**: MySQL `'0000-00-00'` → PostgreSQL `NULL`
2. **Character Sets**: All converted to UTF-8 (PostgreSQL default)
3. **ENUM Types**: Created as PostgreSQL ENUM types where appropriate
4. **JSON Fields**: Converted to `JSONB` for better performance

## Normalization Changes

### Campaigns Table

**Before**: Comma-separated values in varchar fields
```sql
ids_ads VARCHAR(500)
target_audiences VARCHAR(500)
collection_selection VARCHAR(500)
```

**After**: Junction tables
- `campaign_ads` (campaign_id, ad_id)
- `campaign_ads_running` (campaign_id, ad_id)
- `campaign_target_audience` (campaign_id, audience_id)
- `campaign_collection` (campaign_id, collection_id)

### Product Categories

**Before**: Comma-separated category names
```sql
category VARCHAR(1000)
```

**After**: Junction table
- `product_category` (product_id, category_id)

### Product Tags

**Before**: Comma-separated tags
```sql
tag VARCHAR(300)
```

**After**: Junction table
- `product_tag` (product_id, tag_name)

### Task Assignees

**Before**: Comma-separated staff IDs
```sql
ids_assignee VARCHAR(256)
```

**After**: Junction table
- `task_assignee` (task_id, staff_id)

### Promotion Items

**Before**: Comma-separated lists
```sql
category VARCHAR(1000)
product VARCHAR(1000)
attribute VARCHAR(1000)
```

**After**: Junction tables
- `promotion_category` (promotion_id, category_id)
- `promotion_product` (promotion_id, product_id)
- `promotion_attribute` (promotion_id, attribute_id)
- Plus excluded versions: `promotion_excluded_*`

### Customer Batch Conversions

**Before**: Text fields with comma-separated IDs
```sql
conversion_customer_id TEXT
conversion_order_id TEXT
```

**After**: Junction tables
- `customer_batch_customer` (batch_id, customer_id)
- `customer_batch_order` (batch_id, order_id)

## Migration Steps

### Prerequisites

1. **Backup MySQL Database**
   ```bash
   mysqldump -u user -p database_name > backup.sql
   ```

2. **Install PostgreSQL** (if not already installed)
   ```bash
   # Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib
   
   # macOS
   brew install postgresql
   ```

3. **Create PostgreSQL Database**
   ```sql
   CREATE DATABASE crm_database;
   \c crm_database
   ```

### Step 1: Create Schema

Run schema creation scripts in order:

```bash
psql -U postgres -d crm_database -f migrations/001_schema_standardization.sql
psql -U postgres -d crm_database -f migrations/001b_additional_tables.sql
psql -U postgres -d crm_database -f migrations/002_reserve_system_tables.sql
```

### Step 2: Add Foreign Keys

```bash
psql -U postgres -d crm_database -f migrations/003_add_foreign_keys.sql
```

### Step 3: Migrate Data

**Option A: Using pgloader** (Recommended)
```bash
pgloader mysql://user:password@mysql-host/database_name \
         postgresql://user:password@postgres-host/crm_database
```

**Option B: Manual Migration**
1. Export data from MySQL
2. Transform data using scripts in `migrations/005_data_migration.sql`
3. Import into PostgreSQL

### Step 4: Normalize Data

After initial data load, normalize comma-separated values:

```sql
-- Example: Normalize campaign ads
INSERT INTO campaign_ads (campaign_id, ad_id)
SELECT 
    c.id,
    TRIM(unnest(string_to_array(c.ids_ads, ',')))
FROM campaign c
WHERE c.ids_ads IS NOT NULL AND c.ids_ads != '';
```

See `migrations/005_data_migration.sql` for complete normalization scripts.

### Step 5: Validate

Run validation script:

```bash
psql -U postgres -d crm_database -f migrations/006_validation.sql
```

Review output and address any issues.

### Step 6: Update Sequences

After data migration, update sequences:

```sql
SELECT setval('customer_id_seq', (SELECT MAX(id) FROM customer));
SELECT setval('order_id_seq', (SELECT MAX(id) FROM "order"));
SELECT setval('product_id_seq', (SELECT MAX(id) FROM product));
-- Repeat for all tables with sequences
```

## Validation Procedures

### Data Completeness

1. Check for missing required fields
2. Verify all records migrated
3. Compare row counts between MySQL and PostgreSQL

### Referential Integrity

1. Check for orphaned records
2. Verify foreign key constraints
3. Validate junction table relationships

### Data Quality

1. Check for negative amounts
2. Validate date ranges
3. Verify enum values
4. Check constraint violations

See `migrations/006_validation.sql` for complete validation queries.

## Rollback Plan

### If Migration Fails

1. **Keep MySQL Database Running**
   - Don't delete MySQL database until migration is verified
   - Maintain read access during transition

2. **Database Backup**
   - Full backup before migration
   - Point-in-time recovery capability

3. **Application Rollback**
   - Maintain application code compatible with MySQL
   - Feature flags for PostgreSQL features
   - Gradual cutover strategy

### Rollback Steps

1. Stop application writes to PostgreSQL
2. Revert application configuration to MySQL
3. Restore from backup if needed
4. Investigate and fix issues
5. Retry migration

## Post-Migration Tasks

### Immediate (Day 1)

1. **Monitor Performance**
   - Check query performance
   - Monitor connection pools
   - Review slow query logs

2. **Verify Functionality**
   - Test critical user flows
   - Verify reports and dashboards
   - Check data exports

3. **Update Documentation**
   - Update API documentation
   - Update developer guides
   - Document any issues encountered

### Short-term (Week 1)

1. **Optimize Queries**
   - Analyze query plans
   - Add missing indexes
   - Optimize slow queries

2. **Train Team**
   - PostgreSQL-specific training
   - New schema documentation
   - Best practices

3. **Monitor Data Quality**
   - Run validation queries regularly
   - Check for data inconsistencies
   - Monitor application errors

### Long-term (Month 1+)

1. **Performance Tuning**
   - PostgreSQL configuration tuning
   - Partition large tables if needed
   - Consider materialized views

2. **Additional Optimizations**
   - Implement connection pooling
   - Set up replication if needed
   - Configure backups

3. **Cleanup**
   - Remove old MySQL database (after verification)
   - Archive migration scripts
   - Update runbooks

## Troubleshooting

### Common Issues

1. **Character Encoding**
   - Ensure UTF-8 encoding throughout
   - Check collation settings

2. **Date Handling**
   - Handle '0000-00-00' dates
   - Verify timezone settings

3. **Foreign Key Violations**
   - Check for orphaned records
   - Verify data integrity before adding FKs

4. **Performance Issues**
   - Check indexes
   - Analyze query plans
   - Consider partitioning

### Getting Help

- Review `analysis/schema_analysis.md` for schema details
- Check `analysis/naming_conventions.md` for naming mappings
- Review migration scripts for transformation logic
- Consult PostgreSQL documentation

## Migration Checklist

- [ ] Backup MySQL database
- [ ] Create PostgreSQL database
- [ ] Run schema creation scripts
- [ ] Add foreign keys
- [ ] Migrate data
- [ ] Normalize comma-separated values
- [ ] Run validation scripts
- [ ] Update sequences
- [ ] Test application
- [ ] Monitor performance
- [ ] Update documentation
- [ ] Train team
- [ ] Plan cutover
- [ ] Execute cutover
- [ ] Verify functionality
- [ ] Monitor for issues

## Additional Resources

- **Schema Analysis**: `analysis/schema_analysis.md`
- **Naming Conventions**: `analysis/naming_conventions.md`
- **Migration Scripts**: `migrations/` directory
- **PostgreSQL Documentation**: https://www.postgresql.org/docs/

## Support

For questions or issues during migration:
1. Review this guide and related documentation
2. Check migration scripts for examples
3. Consult PostgreSQL documentation
4. Contact database administrator

