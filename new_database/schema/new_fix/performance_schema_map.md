# Performance Management Department

## Overview
This document shows the complete Performance Management schema structure with data types, foreign keys, and change indicators. The schema is designed following enterprise best practices for multi-tenant performance evaluation systems.

**Legend:**
- 🆕 **NEW** - Newly created tables
- 🔄 **NORMALIZED** - Comma-separated values moved to junction tables
- 🗑️ **REMOVED** - Fields/tables removed or consolidated
- ✏️ **RENAMED** - Table/column renamed
- 📊 **DENORMALIZED** - Denormalized for performance (if any)
- ⭐ **ENHANCED** - Enhanced with enterprise features

---

## Core Tables

#### `department` 🆕 NEW
**Status**: Department/division management

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `tenant_id` | BIGINT | NOT NULL | 🆕 Multi-tenancy support |
| `code` | VARCHAR(50) | NOT NULL | Unique code (e.g., 'SALES', 'HR', 'IT') |
| `name` | VARCHAR(256) | NOT NULL | Display name |
| `description` | TEXT | DEFAULT NULL | |
| `is_active` | BOOLEAN | NOT NULL DEFAULT TRUE | ⭐ Enable/disable department |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ⭐ Last update timestamp |

**Constraints:**
- UNIQUE(`tenant_id`, `code`) - Department code unique per tenant
- CHECK(`code` != '') - Code cannot be empty

**Foreign Keys:** None (root table)

**Indexes:**
- `idx_department_tenant` (tenant_id) - 🆕 Multi-tenancy index
- `idx_department_code_tenant` (UNIQUE, tenant_id, code) - 🆕 Unique code per tenant
- `idx_department_active` (tenant_id, is_active) WHERE is_active = TRUE - 🆕 Partial index for active departments

---

#### `performance_criteria` 🆕 NEW
**Status**: Performance evaluation criteria (global and department-specific)

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `tenant_id` | BIGINT | NOT NULL | 🆕 Multi-tenancy support |
| `name` | VARCHAR(256) | NOT NULL | Criteria name |
| `description` | TEXT | DEFAULT NULL | |
| `department_id` | BIGINT | FK → `department.id`, DEFAULT NULL | 🔄 NULL = global criteria, NOT NULL = department-specific |
| `type` | VARCHAR(50) | NOT NULL DEFAULT 'quantitative' | ⭐ Enum: quantitative, qualitative |
| `weight` | NUMERIC(5,2) | NOT NULL DEFAULT 0 | ⭐ Percentage (0-100) |
| `max_score` | NUMERIC(5,2) | DEFAULT 100 | ⭐ Maximum possible score (default 100) |
| `is_active` | BOOLEAN | NOT NULL DEFAULT TRUE | ⭐ Enable/disable criteria |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ⭐ Last update timestamp |

**Constraints:**
- UNIQUE(`tenant_id`, `name`, `department_id`) - Criteria name unique per tenant/department
- CHECK(`weight` >= 0 AND `weight` <= 100) - Weight must be 0-100%
- CHECK(`max_score` > 0) - Maximum score must be positive
- CHECK(`type` IN ('quantitative', 'qualitative')) - Validate type enum

**Foreign Keys:**
- `department_id` → `department(id)` ON DELETE SET NULL

**Indexes:**
- `idx_performance_criteria_tenant` (tenant_id) - 🆕 Multi-tenancy index
- `idx_performance_criteria_department` (department_id)
- `idx_performance_criteria_type` (type) - 🆕 Type queries
- `idx_performance_criteria_active` (tenant_id, is_active) WHERE is_active = TRUE - 🆕 Partial index for active criteria
- `idx_performance_criteria_tenant_department` (tenant_id, department_id) - 🆕 Composite for tenant queries
- `idx_performance_criteria_global` (tenant_id) WHERE department_id IS NULL - 🆕 Partial index for global criteria

---

#### `performance_evaluation` 🆕 NEW
**Status**: Performance evaluation periods with approval workflow

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `tenant_id` | BIGINT | NOT NULL | 🆕 Multi-tenancy support |
| `staff_id` | BIGINT | FK → `sys_users(id)`, NOT NULL | ⭐ Staff being evaluated |
| `evaluator_id` | BIGINT | FK → `sys_users(id)`, NOT NULL | ⭐ Who evaluates |
| `period_start` | DATE | NOT NULL | Evaluation period start date |
| `period_end` | DATE | NOT NULL | Evaluation period end date |
| `overall_score` | NUMERIC(5,2) | DEFAULT NULL | ⭐ Calculated total score (0-100) |
| `status` | VARCHAR(50) | NOT NULL DEFAULT 'draft' | ⭐ Enum: draft, submitted, approved, rejected |
| `notes` | TEXT | DEFAULT NULL | Overall feedback/comments |
| `created_by_id` | BIGINT | FK → `sys_users(id)`, DEFAULT NULL | ⭐ Who created the evaluation |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ⭐ Last update timestamp |
| `submitted_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | ⭐ When submitted for approval |
| `approved_by_id` | BIGINT | FK → `sys_users(id)`, DEFAULT NULL | ⭐ Who approved |
| `approved_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | ⭐ When approved |
| `rejected_by_id` | BIGINT | FK → `sys_users(id)`, DEFAULT NULL | ⭐ Who rejected |
| `rejected_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | ⭐ When rejected |
| `rejection_reason` | TEXT | DEFAULT NULL | ⭐ Reason for rejection |

**ENUM Types:**
- `evaluation_status`: 'draft', 'submitted', 'approved', 'rejected'

**Constraints:**
- UNIQUE(`tenant_id`, `staff_id`, `period_start`, `period_end`) - 🆕 Prevent duplicate evaluations per period
- CHECK(`period_end` >= `period_start`) - Validate date range
- CHECK(`overall_score` IS NULL OR (`overall_score` >= 0 AND `overall_score` <= 100)) - Score must be 0-100
- CHECK(`status` IN ('draft', 'submitted', 'approved', 'rejected')) - Validate status enum
- CHECK(`submitted_at` IS NULL OR `submitted_at` >= `created_at`) - Validate submission timestamp
- CHECK(`approved_at` IS NULL OR `approved_at` >= `submitted_at`) - Validate approval timeline
- CHECK(`rejected_at` IS NULL OR `rejected_at` >= `submitted_at`) - Validate rejection timeline
- CHECK((`status` = 'approved' AND `approved_by_id` IS NOT NULL) OR (`status` != 'approved')) - Approved must have approver
- CHECK((`status` = 'rejected' AND `rejected_by_id` IS NOT NULL) OR (`status` != 'rejected')) - Rejected must have rejector

**Foreign Keys:**
- `staff_id` → `sys_users(id)` ON DELETE CASCADE
- `evaluator_id` → `sys_users(id)` ON DELETE SET NULL
- `created_by_id` → `sys_users(id)` ON DELETE SET NULL
- `approved_by_id` → `sys_users(id)` ON DELETE SET NULL
- `rejected_by_id` → `sys_users(id)` ON DELETE SET NULL

**Indexes:**
- `idx_performance_evaluation_tenant` (tenant_id) - 🆕 Multi-tenancy index
- `idx_performance_evaluation_staff` (staff_id)
- `idx_performance_evaluation_evaluator` (evaluator_id)
- `idx_performance_evaluation_status` (status)
- `idx_performance_evaluation_period` (period_start, period_end)
- `idx_performance_evaluation_tenant_staff` (tenant_id, staff_id) - 🆕 Composite for tenant queries
- `idx_performance_evaluation_tenant_status` (tenant_id, status) - 🆕 Composite for tenant queries
- `idx_performance_evaluation_tenant_period` (tenant_id, period_start, period_end) - 🆕 Composite for tenant period queries
- `idx_performance_evaluation_pending` (tenant_id, status) WHERE status IN ('draft', 'submitted') - 🆕 Partial index for pending evaluations
- `idx_performance_evaluation_approved` (tenant_id, staff_id, period_end DESC) WHERE status = 'approved' - 🆕 Partial index for approved evaluations

---

#### `performance_score` 🆕 NEW
**Status**: Detailed scores for each criteria in an evaluation

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `tenant_id` | BIGINT | NOT NULL | 🆕 Multi-tenancy support |
| `evaluation_id` | BIGINT | FK → `performance_evaluation.id`, NOT NULL | |
| `criteria_id` | BIGINT | FK → `performance_criteria.id`, NOT NULL | |
| `score` | NUMERIC(5,2) | NOT NULL | ⭐ Score achieved (0 to max_score) |
| `comments` | TEXT | DEFAULT NULL | Specific feedback for this criteria |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ⭐ Last update timestamp |
| UNIQUE(`evaluation_id`, `criteria_id`) | | | 🆕 Prevent duplicate scores per criteria |

**Constraints:**
- CHECK(`score` >= 0) - Score must be non-negative
- CHECK(`score` <= (SELECT max_score FROM performance_criteria WHERE id = criteria_id)) - Score cannot exceed criteria max_score

**Foreign Keys:**
- `evaluation_id` → `performance_evaluation(id)` ON DELETE CASCADE
- `criteria_id` → `performance_criteria(id)` ON DELETE RESTRICT - ⭐ Prevent deleting used criteria

**Indexes:**
- `idx_performance_score_tenant` (tenant_id) - 🆕 Multi-tenancy index
- `idx_performance_score_evaluation` (evaluation_id)
- `idx_performance_score_criteria` (criteria_id)
- `idx_performance_score_tenant_evaluation` (tenant_id, evaluation_id) - 🆕 Composite for tenant queries
- `idx_performance_score_tenant_criteria` (tenant_id, criteria_id) - 🆕 Composite for tenant queries

---

## Summary

### Tables in Performance Management Department

#### Core Tables
1. **department** - Department/division management with unique codes
2. **performance_criteria** - Evaluation criteria (global and department-specific)
3. **performance_evaluation** - Performance evaluation periods with approval workflow
4. **performance_score** - Detailed scores for each criteria in evaluations

### Key Enterprise Features

#### Multi-Tenancy Support 🆕
- **All tables** include `tenant_id` BIGINT NOT NULL for complete data isolation
- Unique constraints are tenant-scoped (e.g., `UNIQUE(tenant_id, code)`, `UNIQUE(tenant_id, staff_id, period_start, period_end)`)
- Composite indexes added for efficient tenant-scoped queries

#### Flexible Criteria System 🆕
- **Global Criteria**: `department_id` = NULL for company-wide criteria
- **Department-Specific**: `department_id` = specific department for custom criteria
- **Weight System**: Each criteria has a weight (0-100%) for weighted scoring
- **Type Support**: Quantitative (numeric) and qualitative (text-based) criteria

#### Evaluation Workflow ⭐
- **Status Workflow**: Draft → Submitted → Approved/Rejected
- **Approval Tracking**: Complete audit trail with `approved_by_id`, `approved_at`, `rejected_by_id`, `rejected_at`
- **Period Management**: Date range validation and duplicate prevention
- **Score Calculation**: `overall_score` calculated from weighted criteria scores

#### Data Integrity
- **ENUM Types**: evaluation_status for workflow management
- **Constraints**: Date ranges, score ranges, weight validation, status validation
- **Foreign Keys**: All have appropriate ON DELETE behaviors
- **Unique Constraints**: Prevent duplicate evaluations and scores

#### Performance
- **Multi-tenancy indexes**: Every table has `idx_<table>_tenant`
- **Composite indexes**: Tenant + common query fields
- **Partial indexes**: For active departments, active criteria, pending evaluations, approved evaluations

### Relationships

#### Core Relationships
- `department` - Root table, referenced by `performance_criteria`
- `performance_criteria.department_id` → `department(id)` ON DELETE SET NULL
- `performance_evaluation.staff_id` → `sys_users(id)` ON DELETE CASCADE
- `performance_evaluation.evaluator_id` → `sys_users(id)` ON DELETE SET NULL
- `performance_evaluation.created_by_id` → `sys_users(id)` ON DELETE SET NULL
- `performance_evaluation.approved_by_id` → `sys_users(id)` ON DELETE SET NULL
- `performance_evaluation.rejected_by_id` → `sys_users(id)` ON DELETE SET NULL
- `performance_score.evaluation_id` → `performance_evaluation(id)` ON DELETE CASCADE
- `performance_score.criteria_id` → `performance_criteria(id)` ON DELETE RESTRICT

#### Evaluation Flow
1. **Create Evaluation**: `performance_evaluation` created with status 'draft'
2. **Add Scores**: `performance_score` records added for each criteria
3. **Submit**: Status changed to 'submitted', `submitted_at` set
4. **Approve/Reject**: Status changed to 'approved'/'rejected' with approver/rejector tracking
5. **Calculate Overall**: `overall_score` calculated from weighted criteria scores

### Design Principles

1. **Multi-Tenancy**: All tables include `tenant_id` for complete data isolation and scalability
2. **Flexibility**: Support for both global and department-specific criteria
3. **Workflow Management**: Complete approval workflow with status tracking
4. **Data Integrity**: CHECK constraints, UNIQUE constraints, and foreign keys with appropriate ON DELETE behaviors
5. **Auditability**: Complete audit trail with created_at, updated_at, submitted_at, approved_at, rejected_at
6. **Performance**: Strategic composite indexes for tenant-scoped queries and partial indexes for filtered queries
7. **Weighted Scoring**: Flexible weight system for criteria importance
8. **Score Validation**: Scores validated against criteria max_score limits

---

## Entity Relationship Diagram (ERD)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        PERFORMANCE MANAGEMENT ERD                              │
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
│    department        │                                    │performance_evaluation│
│──────────────────────│                                    │──────────────────────│
│ PK  id               │                                    │ PK  id               │
│     tenant_id        │                                    │     tenant_id        │
│ UK  code             │ (UNIQUE per tenant)                │ FK  staff_id ────────┼───► sys_users.id (CASCADE)
│     name             │                                    │ FK  evaluator_id ────┼───► sys_users.id (SET NULL)
│     is_active        │                                    │ FK  created_by_id ────┼───► sys_users.id (SET NULL)
└──────────────────────┘                                    │ FK  approved_by_id ───┼───► sys_users.id (SET NULL)
         │                                                  │ FK  rejected_by_id ───┼───► sys_users.id (SET NULL)
         │ N:1                                             │     period_start      │
         │                                                  │     period_end        │
         │                                                  │     overall_score     │
         │                                                  │     status            │
         │                                                  │     notes             │
         │                                                  └──────────────────────┘
         │                                                           │
         │                                                           │ 1:N
         │                                                           │
         │                                                           ▼
         │                                                  ┌──────────────────────┐
         │                                                  │  performance_score   │
         │                                                  │──────────────────────│
         │                                                  │ PK  id               │
         │                                                  │     tenant_id        │
         │                                                  │ FK  evaluation_id ────┼───► performance_evaluation.id (CASCADE)
         │                                                  │ FK  criteria_id ─────┼───► performance_criteria.id (RESTRICT)
         │                                                  │     score            │
         │                                                  │     comments         │
         │                                                  │ UK  (evaluation_id, criteria_id)
         │                                                  └──────────────────────┘
         │
         │ N:1
         │
         ▼
┌──────────────────────┐
│performance_criteria  │
│──────────────────────│
│ PK  id               │
│     tenant_id        │
│ FK  department_id ───┼───► department.id (SET NULL)
│     name             │
│     type             │
│     weight           │
│     max_score        │
│     is_active        │
│ UK  (tenant_id, name, department_id)
└──────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              RELATIONSHIP SUMMARY                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Core Hierarchy:                                                             │
│    department ──N:1──► performance_criteria                                  │
│    staff ──1:N──► performance_evaluation (as staff_id)                     │
│    staff ──1:N──► performance_evaluation (as evaluator_id)                   │
│    staff ──1:N──► performance_evaluation (as created_by_id)                  │
│    staff ──1:N──► performance_evaluation (as approved_by_id)                  │
│    staff ──1:N──► performance_evaluation (as rejected_by_id)                  │
│                                                                              │
│  Evaluation Relationships:                                                    │
│    performance_evaluation ──1:N──► performance_score                        │
│    performance_criteria ──N:1──► performance_score                           │
│                                                                              │
│  Criteria System:                                                           │
│    • Global Criteria: department_id IS NULL (company-wide)                    │
│    • Department-Specific: department_id = specific department                 │
│    • Weight System: Each criteria has weight (0-100%)                        │
│    • Score Calculation: overall_score = Σ(score × weight) / Σ(weight)        │
│                                                                              │
│  Evaluation Workflow:                                                        │
│    • Draft: Evaluation being created/edited                                  │
│    • Submitted: Evaluation submitted for approval                            │
│    • Approved: Evaluation approved by manager                                │
│    • Rejected: Evaluation rejected with reason                              │
│                                                                              │
│  Staff References:                                                          │
│    • performance_evaluation: staff_id (being evaluated)                      │
│    • performance_evaluation: evaluator_id (who evaluates)                   │
│    • performance_evaluation: created_by_id (who created)                    │
│    • performance_evaluation: approved_by_id (who approved)                   │
│    • performance_evaluation: rejected_by_id (who rejected)                   │
│                                                                              │
│  Multi-Tenancy:                                                             │
│    • All tables include tenant_id for data isolation                        │
│    • Unique constraints are tenant-scoped                                   │
│    • All indexes include tenant_id for efficient filtering                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                            CARDINALITY LEGEND                                │
├─────────────────────────────────────────────────────────────────────────────┤
│  1:N  = One-to-Many    (e.g., one evaluation has many scores)              │
│  N:1  = Many-to-One    (e.g., many criteria belong to one department)      │
│  0:N  = Zero-to-Many   (e.g., department may have zero or more criteria)   │
│                                                                              │
│  FK   = Foreign Key                                                          │
│  PK   = Primary Key                                                          │
│  UK   = Unique Key                                                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

