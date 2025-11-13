# Schedule Management Department

## Overview
This document shows the complete Schedule Management schema structure with data types, foreign keys, and change indicators. The schema is designed following enterprise best practices for multi-tenant scheduling systems.

**Legend:**
- 🆕 **NEW** - Newly created tables
- 🔄 **NORMALIZED** - Comma-separated values moved to junction tables
- 🗑️ **REMOVED** - Fields/tables removed or consolidated
- ✏️ **RENAMED** - Table/column renamed
- 📊 **DENORMALIZED** - Denormalized for performance (if any)
- ⭐ **ENHANCED** - Enhanced with enterprise features

---

## Core Tables

#### `leave_type` 🆕 NEW
**Status**: Leave type lookup table (normalized)

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `tenant_id` | BIGINT | NOT NULL | 🆕 Multi-tenancy support |
| `code` | VARCHAR(50) | NOT NULL | Unique code (e.g., 'sick', 'vacation', 'personal') |
| `name` | VARCHAR(256) | NOT NULL | Display name |
| `description` | TEXT | DEFAULT NULL | |
| `requires_approval` | BOOLEAN | NOT NULL DEFAULT TRUE | |
| `is_paid` | BOOLEAN | NOT NULL DEFAULT FALSE | |
| `is_active` | BOOLEAN | NOT NULL DEFAULT TRUE | |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |

**Constraints:**
- UNIQUE(`tenant_id`, `code`) - Leave type code unique per tenant
- CHECK(`code` != '') - Code cannot be empty

**Foreign Keys:** None (lookup table)

**Indexes:**
- `idx_leave_type_tenant` (tenant_id) - 🆕 Multi-tenancy index
- `idx_leave_type_code_tenant` (UNIQUE, tenant_id, code) - 🆕 Unique code per tenant
- `idx_leave_type_active` (tenant_id, is_active) WHERE is_active = TRUE - 🆕 Partial index for active types

---

#### `schedule` ✏️ ⭐ (consolidated from `db_shift_schedule_sales` and `db_draft_shift_schedule_sales`)
**Status**: Staff shift scheduling with enterprise features

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `tenant_id` | BIGINT | NOT NULL | 🆕 Multi-tenancy support |
| `staff_id` | BIGINT | FK → `sys_users(id)`, NOT NULL | ✏️ Renamed from `id_staff` |
| `start_time` | TIMESTAMP WITH TIME ZONE | NOT NULL | ✏️ Renamed from `date_time_start` |
| `end_time` | TIMESTAMP WITH TIME ZONE | NOT NULL | ✏️ Renamed from `date_time_end` |
| `shift_name` | VARCHAR(256) | NOT NULL DEFAULT '' | ✏️ Renamed from `shift` |
| `total_minutes` | INTEGER | NOT NULL DEFAULT 0 | 📊 Denormalized for performance |
| `leave_type_id` | BIGINT | FK → `leave_type.id`, DEFAULT NULL | 🔄 Normalized from `leave_type` VARCHAR |
| `is_authorized` | BOOLEAN | NOT NULL DEFAULT FALSE | ✏️ Renamed from `status_authorization` |
| `reason` | VARCHAR(500) | NOT NULL DEFAULT '' | 🔄 Increased from VARCHAR(256) |
| `status` | schedule_status | NOT NULL DEFAULT 'draft' | ⭐ ENUM: 'draft', 'confirmed', 'completed', 'failed' |
| `shift_report_id` | BIGINT | FK → `shift_report.id`, DEFAULT NULL | ✏️ Renamed from `id_report_shift` |
| `is_confirmed` | BOOLEAN | NOT NULL DEFAULT TRUE | ✏️ Renamed from `confirm` |
| `is_leader_shift` | BOOLEAN | DEFAULT FALSE | ✏️ Renamed from `leader_shift` |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date_created` |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ⭐ Last update timestamp |
| `updated_by_id` | BIGINT | FK → `sys_users(id)`, DEFAULT NULL | ⭐ Track who last updated |
| `authorized_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | ⭐ Authorization timestamp |
| `authorized_by_id` | BIGINT | FK → `sys_users(id)`, DEFAULT NULL | ⭐ Who authorized |

**ENUM Types:**
- `schedule_status`: 'draft', 'confirmed', 'completed', 'failed'
- `time_off_request_status`: 'pending', 'approved', 'rejected', 'cancelled'

**Constraints:**
- CHECK(`end_time` > `start_time`) - Validate time range
- CHECK(`total_minutes` >= 0) - Validate non-negative minutes
- CHECK(`authorized_at` IS NULL OR `authorized_at` >= `created_at`) - Validate authorization timestamp
- EXCLUDE USING gist (`tenant_id` WITH =, `staff_id` WITH =, tstzrange(`start_time`, `end_time`) WITH &&) WHERE (`status` IN ('confirmed', 'completed')) - 🆕 Prevent overlapping confirmed schedules per tenant

**Removed Fields:**
- 🗑️ `leave_type` (VARCHAR) - Normalized to `leave_type_id` FK
- 🗑️ `complete_shift` (TINYINT) - Replaced by `status` ENUM

**Foreign Keys:**
- `staff_id` → `sys_users(id)` ON DELETE CASCADE
- `leave_type_id` → `leave_type(id)` ON DELETE SET NULL
- `shift_report_id` → `shift_report(id)` ON DELETE SET NULL
- `authorized_by_id` → `sys_users(id)` ON DELETE SET NULL
- `updated_by_id` → `sys_users(id)` ON DELETE SET NULL

**Indexes:**
- `idx_schedule_tenant` (tenant_id) - 🆕 Multi-tenancy index
- `idx_schedule_staff` (staff_id)
- `idx_schedule_start_time` (start_time)
- `idx_schedule_end_time` (end_time)
- `idx_schedule_status` (status)
- `idx_schedule_leave_type` (leave_type_id) - 🆕 Leave type queries
- `idx_schedule_tenant_staff` (tenant_id, staff_id) - 🆕 Composite for tenant queries
- `idx_schedule_tenant_status` (tenant_id, status) - 🆕 Composite for tenant queries
- `idx_schedule_dates` (start_time, end_time)
- `idx_schedule_staff_dates` (staff_id, start_time, end_time)
- `idx_schedule_active` (tenant_id, staff_id, start_time) WHERE status IN ('confirmed', 'completed') - 🆕 Partial index for active schedules
- `idx_schedule_pending_authorization` (tenant_id, staff_id, created_at) WHERE is_authorized = FALSE AND status = 'confirmed' - 🆕 Partial index for pending authorization

---

#### `schedule_preferences` ✏️ ⭐ (renamed from `db_schedule_preferences`)
**Status**: Staff schedule preferences

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `tenant_id` | BIGINT | NOT NULL | 🆕 Multi-tenancy support |
| `staff_id` | BIGINT | FK → `sys_users(id)`, NOT NULL | ✏️ Renamed from `id_staff` |
| `week_number` | INTEGER | NOT NULL DEFAULT 1 | ✏️ Renamed from `week` |
| `year` | INTEGER | NOT NULL | 🔄 Changed from YEAR(4) |
| `preferences` | JSONB | NOT NULL DEFAULT '{}' | ⭐ Changed from VARCHAR(500) to JSONB |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date_created` |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ⭐ Last update timestamp |
| UNIQUE(`tenant_id`, `staff_id`, `week_number`, `year`) | | | 🆕 Tenant-scoped unique constraint |

**Foreign Keys:**
- `staff_id` → `sys_users(id)` ON DELETE CASCADE

**Indexes:**
- `idx_schedule_preferences_tenant` (tenant_id) - 🆕 Multi-tenancy index
- `idx_schedule_preferences_staff` (staff_id)
- `idx_schedule_preferences_week_year` (week_number, year)
- `idx_schedule_preferences_tenant_staff` (tenant_id, staff_id) - 🆕 Composite for tenant queries
- `idx_schedule_preferences_tenant_week_year` (tenant_id, week_number, year) - 🆕 Composite for tenant queries

---

#### `schedule_revision` ✏️ ⭐ (consolidated from `db_info_revision_schedule` and `db_revision_shift_schedule`)
**Status**: Schedule revision history

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `tenant_id` | BIGINT | NOT NULL | 🆕 Multi-tenancy support |
| `revision_type` | VARCHAR(256) | NOT NULL DEFAULT '' | ✏️ Renamed from `type` |
| `updated_by_id` | BIGINT | FK → `sys_users(id)`, DEFAULT NULL | ✏️ Renamed from `update_by` |
| `updated_by_name` | VARCHAR(256) | DEFAULT '' | ⭐ Fallback for legacy data |
| `start_date` | DATE | DEFAULT NULL | ✏️ Renamed from `date_time_start` |
| `end_date` | DATE | DEFAULT NULL | ✏️ Renamed from `date_time_end` |
| `description` | TEXT | DEFAULT NULL | ⭐ Revision description |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date_created` |

**Migration Note:**
- Old schema `update_by` was VARCHAR(256). New schema uses `updated_by_id` (FK to staff).
- `updated_by_name` provides fallback for legacy data that cannot be mapped to staff IDs.

**Foreign Keys:**
- `updated_by_id` → `sys_users(id)` ON DELETE SET NULL

**Constraints:**
- CHECK(`end_date` IS NULL OR `start_date` IS NULL OR `end_date` >= `start_date`) - Validate date range

**Indexes:**
- `idx_schedule_revision_tenant` (tenant_id) - 🆕 Multi-tenancy index
- `idx_schedule_revision_updated_by` (updated_by_id)
- `idx_schedule_revision_type` (revision_type)
- `idx_schedule_revision_dates` (start_date, end_date)
- `idx_schedule_revision_tenant_dates` (tenant_id, start_date, end_date) - 🆕 Composite for tenant queries

---

#### `schedule_revision_detail` 🆕 ⭐
**Status**: Individual schedule changes in a revision

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `tenant_id` | BIGINT | NOT NULL | 🆕 Multi-tenancy support |
| `revision_id` | BIGINT | FK → `schedule_revision.id`, NOT NULL | |
| `schedule_id` | BIGINT | FK → `schedule.id`, DEFAULT NULL | ⭐ Reference to original schedule |
| `staff_id` | BIGINT | FK → `sys_users(id)`, NOT NULL | |
| `start_time` | TIMESTAMP WITH TIME ZONE | NOT NULL | |
| `end_time` | TIMESTAMP WITH TIME ZONE | NOT NULL | |
| `shift_name` | VARCHAR(256) | NOT NULL DEFAULT '' | |
| `total_minutes` | INTEGER | NOT NULL DEFAULT 0 | |
| `leave_type_id` | BIGINT | FK → `leave_type.id`, DEFAULT NULL | 🔄 Normalized from `leave_type` VARCHAR |
| `is_authorized` | BOOLEAN | NOT NULL DEFAULT FALSE | ✏️ From `status_authorization` |
| `reason` | VARCHAR(500) | NOT NULL DEFAULT '' | 🔄 Increased from VARCHAR(256) |
| `is_confirmed` | BOOLEAN | NOT NULL DEFAULT TRUE | ✏️ From `confirm` |
| `is_leader_shift` | BOOLEAN | DEFAULT FALSE | ✏️ From `leader_shift` |
| `shift_report_id` | BIGINT | FK → `shift_report.id`, DEFAULT NULL | ✏️ From `id_report_shift` |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL DEFAULT CURRENT_TIMESTAMP | |

**Constraints:**
- CHECK(`end_time` > `start_time`) - Validate time range
- CHECK(`total_minutes` >= 0) - Validate non-negative minutes

**Removed Fields:**
- 🗑️ `leave_type` (VARCHAR) - Normalized to `leave_type_id` FK
- 🗑️ `complete_shift` (TINYINT) - Status tracking handled at revision level

**Foreign Keys:**
- `revision_id` → `schedule_revision(id)` ON DELETE CASCADE
- `schedule_id` → `schedule(id)` ON DELETE SET NULL
- `staff_id` → `sys_users(id)` ON DELETE CASCADE
- `leave_type_id` → `leave_type(id)` ON DELETE SET NULL
- `shift_report_id` → `shift_report(id)` ON DELETE SET NULL

**Indexes:**
- `idx_schedule_revision_detail_tenant` (tenant_id) - 🆕 Multi-tenancy index
- `idx_schedule_revision_detail_revision` (revision_id)
- `idx_schedule_revision_detail_schedule` (schedule_id)
- `idx_schedule_revision_detail_staff` (staff_id)
- `idx_schedule_revision_detail_leave_type` (leave_type_id) - 🆕 Leave type queries
- `idx_schedule_revision_detail_dates` (start_time, end_time)
- `idx_schedule_revision_detail_tenant_revision` (tenant_id, revision_id) - 🆕 Composite for tenant queries

---

#### `schedule_time_off_request` ✏️ ⭐ (renamed from `db_request_off_sales`)
**Status**: Time off requests

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `tenant_id` | BIGINT | NOT NULL | 🆕 Multi-tenancy support |
| `staff_id` | BIGINT | FK → `sys_users(id)`, NOT NULL | ✏️ Renamed from `id_staff` |
| `leave_type_id` | BIGINT | FK → `leave_type.id`, DEFAULT NULL | 🔄 Normalized from implicit leave type |
| `group` | VARCHAR(100) | DEFAULT '' | |
| `reason` | VARCHAR(500) | NOT NULL DEFAULT '' | 🔄 Increased from VARCHAR(256) |
| `email_body` | TEXT | DEFAULT NULL | ✏️ Renamed from `body_email` |
| `day_off` | DATE | DEFAULT NULL | |
| `status` | time_off_request_status | NOT NULL DEFAULT 'pending' | ⭐ ENUM type for data integrity |
| `schedule_id` | BIGINT | FK → `schedule.id`, DEFAULT NULL | ✏️ Renamed from `id_shift_schedule` |
| `hr_comment` | VARCHAR(600) | DEFAULT '' | |
| `confirmed_by_id` | BIGINT | FK → `sys_users(id)`, DEFAULT NULL | ✏️ Renamed from `confirm_by` |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date_created` |
| `confirmed_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | ✏️ Renamed from `date_confirm` |

**Constraints:**
- CHECK(`confirmed_at` IS NULL OR `confirmed_at` >= `created_at`) - Validate confirmation timestamp
- CHECK(`day_off` IS NULL OR `day_off` >= CURRENT_DATE) - Validate day_off is not in the past (optional)

**Foreign Keys:**
- `staff_id` → `sys_users(id)` ON DELETE CASCADE
- `leave_type_id` → `leave_type(id)` ON DELETE SET NULL
- `schedule_id` → `schedule(id)` ON DELETE SET NULL
- `confirmed_by_id` → `sys_users(id)` ON DELETE SET NULL

**Indexes:**
- `idx_schedule_time_off_request_tenant` (tenant_id) - 🆕 Multi-tenancy index
- `idx_schedule_time_off_request_staff` (staff_id)
- `idx_schedule_time_off_request_status` (status)
- `idx_schedule_time_off_request_day_off` (day_off)
- `idx_schedule_time_off_request_schedule` (schedule_id)
- `idx_schedule_time_off_request_leave_type` (leave_type_id) - 🆕 Leave type queries
- `idx_schedule_time_off_request_tenant_staff` (tenant_id, staff_id) - 🆕 Composite for tenant queries
- `idx_schedule_time_off_request_tenant_status` (tenant_id, status) - 🆕 Composite for tenant queries
- `idx_schedule_time_off_request_pending` (tenant_id, staff_id, day_off) WHERE status = 'pending' - 🆕 Partial index for pending requests
- `idx_schedule_time_off_request_approved` (tenant_id, staff_id, day_off) WHERE status = 'approved' - 🆕 Partial index for approved requests

---

## Summary

### Tables in Schedule Management Department

#### Core Tables
1. **leave_type** - Leave type lookup table (normalized)
2. **schedule** - Staff shift schedules (consolidated from shift_schedule and draft_shift_schedule)
3. **schedule_preferences** - Staff schedule preferences
4. **schedule_revision** - Schedule revision history
5. **schedule_revision_detail** - Individual schedule changes in revisions
6. **schedule_time_off_request** - Time off requests

### Key Enterprise Features

#### Multi-Tenancy Support 🆕
- **All tables** include `tenant_id` BIGINT NOT NULL for complete data isolation
- Unique constraints are tenant-scoped (e.g., `UNIQUE(tenant_id, staff_id, week_number, year)`)
- Composite indexes added for efficient tenant-scoped queries

#### Data Normalization 🆕
- **Leave Type**: Normalized from VARCHAR to `leave_type` lookup table
- **Benefits**: Better data integrity, easier reporting, metadata support (is_paid, requires_approval)

#### Schedule Management
- **Status Workflow**: Draft → Confirmed → Completed/Failed
- **Overlap Prevention**: EXCLUDE constraint prevents overlapping confirmed schedules per tenant
- **Time Tracking**: Denormalized `total_minutes` for performance
- **Authorization**: Complete audit trail with authorized_by_id, authorized_at

#### Data Integrity
- **ENUM Types**: schedule_status, time_off_request_status
- **Constraints**: Time validation, date ranges, non-negative values
- **Foreign Keys**: All have appropriate ON DELETE behaviors

#### Performance
- **Multi-tenancy indexes**: Every table has `idx_<table>_tenant`
- **Composite indexes**: Tenant + common query fields
- **Partial indexes**: For active schedules, pending requests, approved requests

### Relationships

#### Core Relationships
- `schedule.staff_id` → `sys_users(id)` ON DELETE CASCADE
- `schedule.leave_type_id` → `leave_type(id)` ON DELETE SET NULL
- `schedule.shift_report_id` → `shift_report(id)` ON DELETE SET NULL
- `schedule.authorized_by_id` → `sys_users(id)` ON DELETE SET NULL
- `schedule.updated_by_id` → `sys_users(id)` ON DELETE SET NULL

#### Preferences & Revisions
- `schedule_preferences.staff_id` → `sys_users(id)` ON DELETE CASCADE
- `schedule_revision.updated_by_id` → `sys_users(id)` ON DELETE SET NULL
- `schedule_revision_detail.revision_id` → `schedule_revision(id)` ON DELETE CASCADE
- `schedule_revision_detail.schedule_id` → `schedule(id)` ON DELETE SET NULL
- `schedule_revision_detail.staff_id` → `sys_users(id)` ON DELETE CASCADE
- `schedule_revision_detail.leave_type_id` → `leave_type(id)` ON DELETE SET NULL

#### Time Off Requests
- `schedule_time_off_request.staff_id` → `sys_users(id)` ON DELETE CASCADE
- `schedule_time_off_request.leave_type_id` → `leave_type(id)` ON DELETE SET NULL
- `schedule_time_off_request.schedule_id` → `schedule(id)` ON DELETE SET NULL
- `schedule_time_off_request.confirmed_by_id` → `sys_users(id)` ON DELETE SET NULL

### Design Principles

1. **Multi-Tenancy**: All tables include `tenant_id` for complete data isolation and scalability
2. **Normalization**: Leave types normalized to lookup table for better data integrity
3. **Data Integrity**: EXCLUDE constraints, CHECK constraints, and ENUM types
4. **Performance**: Strategic composite indexes for tenant-scoped queries and partial indexes for filtered queries
5. **Auditability**: Complete audit trail with created_at, updated_at, updated_by_id, authorized_by_id, authorized_at
6. **Timezone Support**: All timestamps use `TIMESTAMP WITH TIME ZONE`
7. **Flexibility**: JSONB for schedule preferences, normalized leave types with metadata

---

## Entity Relationship Diagram (ERD)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SCHEDULE MANAGEMENT ERD                               │
│                        (Multi-Tenant Architecture)                           │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│       staff          │ (External - Sales/HR Department)
│──────────────────────│
│ PK  id               │
│     full_name        │
│     email            │
│     ...              │
└──────────────────────┘
         │
         │ (referenced by multiple tables)
         │
         ├─────────────────────────────────────────────────────────────┐
         │                                                               │
         ▼                                                               ▼
┌──────────────────────┐                                    ┌──────────────────────┐
│    leave_type        │                                    │      schedule        │
│──────────────────────│                                    │──────────────────────│
│ PK  id               │                                    │ PK  id               │
│     tenant_id        │                                    │     tenant_id        │
│ UK  code             │ (UNIQUE per tenant)                │ FK  staff_id ────────┼───► sys_users.id (CASCADE)
│     name             │                                    │ FK  leave_type_id ───┼───► leave_type.id (SET NULL)
│     is_paid          │                                    │ FK  shift_report_id ─┼───► shift_report.id (SET NULL)
│     requires_approval│                                    │ FK  authorized_by_id ─┼───► sys_users.id (SET NULL)
│     is_active        │                                    │ FK  updated_by_id ────┼───► sys_users.id (SET NULL)
└──────────────────────┘                                    │     start_time        │
         │                                                  │     end_time          │
         │ N:1                                             │     shift_name        │
         │                                                  │     status            │
         │                                                  │     is_authorized     │
         │                                                  │     is_leader_shift   │
         │                                                  └──────────────────────┘
         │                                                           │
         │                                                           │ 1:N
         │                                                           ├──────────────────────────────┐
         │                                                           │                              │
         │                                                           ▼                              ▼
         │                                                  ┌──────────────────────┐    ┌──────────────────────┐
         │                                                  │ schedule_preferences  │    │schedule_time_off_req │
         │                                                  │──────────────────────│    │──────────────────────│
         │                                                  │ PK  id               │    │ PK  id               │
         │                                                  │     tenant_id        │    │     tenant_id        │
         │                                                  │ FK  staff_id ─────────┼───►│ FK  staff_id ─────────┼───► sys_users.id
         │                                                  │     week_number      │    │ FK  leave_type_id ────┼───► leave_type.id
         │                                                  │     year              │    │ FK  schedule_id ─────┼───► schedule.id
         │                                                  │     preferences(JSONB)│    │ FK  confirmed_by_id ─┼───► sys_users.id
         │                                                  │ UK  (tenant_id, staff_id, week, year)│     day_off          │
         │                                                  └──────────────────────┘    │     status            │
         │                                                                              └──────────────────────┘
         │
         │
         ▼
┌──────────────────────┐
│ schedule_revision    │
│──────────────────────│
│ PK  id               │
│     tenant_id        │
│ FK  updated_by_id ───┼───► sys_users.id (SET NULL)
│     revision_type    │
│     start_date       │
│     end_date         │
│     description      │
└──────────────────────┘
         │
         │ 1:N
         │
         ▼
┌──────────────────────┐
│schedule_revision_detail│
│──────────────────────│
│ PK  id               │
│     tenant_id        │
│ FK  revision_id ─────┼───► schedule_revision.id (CASCADE)
│ FK  schedule_id ─────┼───► schedule.id (SET NULL)
│ FK  staff_id ────────┼───► sys_users.id (CASCADE)
│ FK  leave_type_id ───┼───► leave_type.id (SET NULL)
│ FK  shift_report_id ─┼───► shift_report.id (SET NULL)
│     start_time       │
│     end_time         │
│     shift_name       │
│     is_authorized    │
│     is_leader_shift  │
└──────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              RELATIONSHIP SUMMARY                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Core Hierarchy:                                                             │
│    staff ──1:N──► schedule                                                  │
│    leave_type ──N:1──► schedule                                             │
│    leave_type ──N:1──► schedule_revision_detail                             │
│    leave_type ──N:1──► schedule_time_off_request                            │
│                                                                              │
│  Schedule Relationships:                                                     │
│    schedule ──1:N──► schedule_time_off_request                              │
│    schedule ──1:N──► schedule_revision_detail                               │
│    schedule ──N:1──► shift_report (external)                                │
│                                                                              │
│  Revision System:                                                           │
│    schedule_revision ──1:N──► schedule_revision_detail                      │
│    schedule_revision_detail ──N:1──► schedule (optional reference)          │
│                                                                              │
│  Staff References (All tables):                                             │
│    • schedule: staff_id, authorized_by_id, updated_by_id                    │
│    • schedule_preferences: staff_id                                         │
│    • schedule_revision: updated_by_id                                       │
│    • schedule_revision_detail: staff_id                                     │
│    • schedule_time_off_request: staff_id, confirmed_by_id                   │
│                                                                              │
│  Leave Type References:                                                     │
│    • schedule: leave_type_id                                                │
│    • schedule_revision_detail: leave_type_id                                │
│    • schedule_time_off_request: leave_type_id                                │
│                                                                              │
│  Multi-Tenancy:                                                             │
│    • All tables include tenant_id for data isolation                        │
│    • Unique constraints are tenant-scoped                                   │
│    • All indexes include tenant_id for efficient filtering                  │
│    • EXCLUDE constraint includes tenant_id to prevent overlaps per tenant   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                            CARDINALITY LEGEND                                │
├─────────────────────────────────────────────────────────────────────────────┤
│  1:N  = One-to-Many    (e.g., one staff has many schedules)                 │
│  N:1  = Many-to-One    (e.g., many schedules belong to one staff)           │
│  0:N  = Zero-to-Many   (e.g., schedule may have zero or more time off reqs) │
│                                                                              │
│  FK   = Foreign Key                                                          │
│  PK   = Primary Key                                                          │
│  UK   = Unique Key                                                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

