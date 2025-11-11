# CRM Database Restructure Project

This project contains the complete restructure plan and migration scripts for transforming the CRM database from MySQL to PostgreSQL with standardized naming, normalized data structures, and proper relationships.

## Project Structure

```
.
├── README.md                          # This file
├── MIGRATION_GUIDE.md                # Comprehensive migration guide
├── DDL_Database_CRM.sql              # Original MySQL schema
├── analysis/
│   ├── schema_analysis.md            # Detailed schema analysis
│   └── naming_conventions.md         # Naming convention mappings
└── migrations/
    ├── 001_schema_standardization.sql    # Core schema creation
    ├── 001b_additional_tables.sql         # Additional tables
    ├── 002_reserve_system_tables.sql      # Reserve system tables
    ├── 003_add_foreign_keys.sql           # Foreign key relationships
    ├── 005_data_migration.sql             # Data migration scripts
    └── 006_validation.sql                 # Validation queries
```

## Quick Start

1. **Review the Plan**: Read `crm-database-restructure-plan.plan.md` for the complete restructure strategy
2. **Understand the Schema**: Review `analysis/schema_analysis.md` for detailed analysis
3. **Check Naming**: See `analysis/naming_conventions.md` for table/column mappings
4. **Follow Migration Guide**: Use `MIGRATION_GUIDE.md` for step-by-step migration instructions

## Key Changes

### Schema Standardization
- Removed `db_*` prefixes from table names
- Standardized all primary keys to `id` (BIGSERIAL)
- Consistent audit fields: `created_at`, `updated_at`, `created_by_id`, `updated_by_id`
- Converted all monetary values from `float` to `NUMERIC(12,2)`
- Standardized timestamps to `TIMESTAMP WITH TIME ZONE`

### Normalization
- **Campaigns**: Normalized comma-separated `ids_ads`, `target_audiences`, `collection_selection` into junction tables
- **Products**: Normalized comma-separated `category` and `tag` fields into junction tables
- **Tasks**: Normalized comma-separated `ids_assignee` into junction table
- **Promotions**: Normalized comma-separated product/category/attribute lists into junction tables
- **Customer Batches**: Normalized text fields with comma-separated IDs into junction tables

### Foreign Keys
- Added foreign key constraints for referential integrity
- Created indexes on all foreign key columns
- Added check constraints for data validation

### Data Types
- MySQL `int(11)` → PostgreSQL `INTEGER` or `BIGINT`
- MySQL `bigint(15)` → PostgreSQL `BIGSERIAL`
- MySQL `float` → PostgreSQL `NUMERIC(12,2)` (for currency)
- MySQL `tinyint(1)` → PostgreSQL `BOOLEAN`
- MySQL `datetime`/`timestamp` → PostgreSQL `TIMESTAMP WITH TIME ZONE`
- MySQL `enum` → PostgreSQL `ENUM` type or `VARCHAR`

## Migration Process

### Phase 1: Schema Creation
Run the schema creation scripts in order:
1. `001_schema_standardization.sql` - Core tables
2. `001b_additional_tables.sql` - Additional tables
3. `002_reserve_system_tables.sql` - Reserve system

### Phase 2: Relationships
Run `003_add_foreign_keys.sql` to add foreign key constraints and indexes.

### Phase 3: Data Migration
Use `005_data_migration.sql` as a guide for data transformation and migration.

### Phase 4: Validation
Run `006_validation.sql` to verify data completeness and integrity.

## Documentation

- **Schema Analysis** (`analysis/schema_analysis.md`): Complete analysis of all 80+ tables, relationships, and normalization opportunities
- **Naming Conventions** (`analysis/naming_conventions.md`): Complete mapping of old → new table and column names
- **Migration Guide** (`MIGRATION_GUIDE.md`): Step-by-step migration instructions with troubleshooting

## Tables Overview

### Core Entities (20+ tables)
- `customer`, `order`, `order_detail`, `order_line_item`
- `product`, `category`, `stock`
- `staff`, `shift_schedule`, `shift_report`
- `campaign`, `promotion`
- `payment`, `refund`

### Junction Tables (15+ tables)
- `campaign_ads`, `campaign_target_audience`, `campaign_collection`
- `product_category`, `product_tag`
- `promotion_category`, `promotion_product`, `promotion_attribute`
- `task_assignee`, `customer_batch_customer`, `customer_batch_order`

### Reserve System (9 tables)
- `reserve_order`, `reserve_product`, `reserve_stock`, etc.
- Kept separate as they appear to serve a different purpose

### Twilio Integration (10 tables)
- `twilio_*` tables kept with prefix for integration clarity
- Already well-structured with proper foreign keys

## Important Notes

1. **Reserved Words**: The table name `order` is a PostgreSQL reserved word. Use quotes when needed: `"order"`

2. **Data Migration**: The migration scripts provide examples. Actual migration should use tools like `pgloader` or custom ETL processes.

3. **Normalization**: Comma-separated values must be normalized during or after data migration. See `005_data_migration.sql` for examples.

4. **Validation**: Always run validation scripts after migration to ensure data integrity.

5. **Backup**: Always backup your MySQL database before starting migration.

## Next Steps

1. Review the migration guide
2. Set up PostgreSQL environment
3. Test migration on a copy of production data
4. Execute migration following the guide
5. Validate results
6. Update application code to use new schema

## Support

For questions or issues:
1. Review the documentation files
2. Check migration scripts for examples
3. Consult PostgreSQL documentation
4. Review the original plan document

## License

This project contains database migration scripts and documentation for internal use.

