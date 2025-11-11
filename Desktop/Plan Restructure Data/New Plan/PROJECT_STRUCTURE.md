# Project Structure

This document describes the folder structure of the CRM database restructure project.

## Root Structure

```
New Plan/
├── analysis/                    # Schema analysis documents
├── backend/                     # Backend implementation code
├── database/                    # Database files
│   ├── old_schema/             # Original MySQL schema
│   ├── new_schema/             # New PostgreSQL schema
│   └── postgres_inserts/      # PostgreSQL INSERT statements
├── migrations/                  # Migration scripts
├── Product Inventory (Khoa)/   # Product & Inventory department
├── Customer and Order (Quy)/   # Customer & Order department
├── Campaign and Marketing/     # Marketing department
├── Staff and HR/               # HR department
├── Tasks and Projects/          # Task management department
├── Shipping and Logistics/      # Logistics department
├── History and Audit/           # Audit department
├── Reserve System/              # Reserve system
└── Workflow and AI/             # Workflow automation
```

## Department Folders

Each department folder contains:
- Documentation specific to that department
- Code implementations
- Queries and examples
- Department-specific migrations

## Key Files

### Root Level
- `DDL_Database_CRM.sql` - Original MySQL DDL
- `NEW_SCHEMA_STRUCTURE.md` - Complete new schema documentation
- `TASK_MANAGEMENT.md` - Task management guide
- `MIGRATION_GUIDE.md` - Migration instructions
- `IMPLEMENTATION_SUMMARY.md` - Implementation overview

### Database Folder
- `old_schema/` - Original schema files
- `new_schema/` - New schema files
- `postgres_inserts/` - Sample data scripts

### Migrations Folder
- `001_schema_standardization.sql` - Core schema migration
- `001b_additional_tables.sql` - Additional tables
- `002_reserve_system_tables.sql` - Reserve system
- `003_add_foreign_keys.sql` - Foreign key constraints
- `005_data_migration.sql` - Data migration
- `006_validation.sql` - Validation scripts

## Department Responsibilities

### Product Inventory (Khoa)
- Product catalog
- Inventory management
- Stock tracking
- Categories and attributes

### Customer and Order (Quy)
- Customer management
- Order processing
- Payments and refunds
- Customer batches

### Campaign and Marketing
- Marketing campaigns
- Promotions
- Ad management
- Audience targeting

### Staff and HR
- Employee management
- Shift scheduling
- Performance tracking
- Sales management

### Tasks and Projects
- Project management
- Task assignment
- Recurring tasks
- Notifications

### Shipping and Logistics
- Inbound/outbound shipments
- Order fulfillment
- Logistics tracking

### History and Audit
- Audit trails
- Change history
- Action logging

### Reserve System
- Backup system
- Alternative catalog
- Separate inventory

### Workflow and AI
- Automation workflows
- AI integrations
- Process automation

## Backend Implementation

The `backend/` folder should contain:
- API endpoints organized by department
- Services for business logic
- Controllers for request handling
- Middleware for authentication/authorization
- Utilities and helpers

## Database Organization

### Old Schema
- Original MySQL DDL files
- Reference for migration
- Original table structures

### New Schema
- PostgreSQL DDL files
- Standardized table definitions
- Migration scripts

### Postgres Inserts
- Sample data
- Test data
- Seed scripts

## Best Practices

1. **Department Separation**: Each department has its own folder for organization
2. **Code Organization**: Backend code organized by feature/department
3. **Database Files**: Separated by schema version
4. **Documentation**: Each folder has README explaining its purpose
5. **Migrations**: All migration scripts in dedicated folder

