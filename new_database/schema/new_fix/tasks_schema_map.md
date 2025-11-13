# Tasks & Projects Department

## Overview
This document shows the complete Tasks & Projects schema structure with data types, foreign keys, and change indicators. The schema is designed following best practices from enterprise task management systems (Jira, Linear, Asana, Monday.com).

**Legend:**
- 🆕 **NEW** - Newly created tables
- 🔄 **NORMALIZED** - Comma-separated values moved to junction tables
- 🗑️ **REMOVED** - Fields/tables removed or consolidated
- ✏️ **RENAMED** - Table/column renamed
- 📊 **DENORMALIZED** - Denormalized for performance (if any)
- ⭐ **ENHANCED** - Enhanced with enterprise features

---

## Core Tables

#### `project` ✏️ ⭐ (renamed from `db_project_space`)
**Status**: Project management with enhanced features

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `tenant_id` | BIGINT | NOT NULL | 🆕 Multi-tenancy support |
| `title` | VARCHAR(400) | NOT NULL DEFAULT '' | |
| `description` | TEXT | DEFAULT NULL | ⭐ Project description |
| `code` | VARCHAR(50) | NOT NULL | ⭐ Project code/identifier (e.g., PROJ-001) |
| `owner_id` | BIGINT | FK → `staff.id`, NOT NULL DEFAULT 0 | ✏️ Renamed from `owner_project_id` |
| `status` | VARCHAR(50) | NOT NULL DEFAULT 'active' | ⭐ Enum: active, on_hold, completed, archived |
| `visibility` | VARCHAR(50) | NOT NULL DEFAULT 'private' | ⭐ Enum: private, team, public |
| `start_date` | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | ✏️ Renamed from `start_time` |
| `end_date` | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | ✏️ Renamed from `end_time` |
| `is_continuous` | BOOLEAN | NOT NULL DEFAULT FALSE | |
| `created_by_id` | BIGINT | FK → `staff.id`, NOT NULL DEFAULT 0 | ⭐ Who created the project |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date_created` |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ⭐ Last update timestamp |
| `completed_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | ✏️ Renamed from `date_completed` |
| `archived_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | ⭐ When project was archived |

**Constraints:**
- UNIQUE(`tenant_id`, `code`) - Project code unique per tenant
- CHECK(`end_date` IS NULL OR `start_date` IS NULL OR `end_date` >= `start_date`) - Validate date range
- CHECK(`status` IN ('active', 'on_hold', 'completed', 'archived')) - Validate status enum
- CHECK(`visibility` IN ('private', 'team', 'public')) - Validate visibility enum

**Foreign Keys:**
- `owner_id` → `staff(id)` ON DELETE SET DEFAULT
- `created_by_id` → `staff(id)` ON DELETE SET DEFAULT

**Indexes:**
- `idx_project_tenant` (tenant_id) - 🆕 Multi-tenancy index
- `idx_project_code_tenant` (UNIQUE, tenant_id, code) - 🆕 Unique code per tenant
- `idx_project_owner` (owner_id)
- `idx_project_status` (status)
- `idx_project_created_by` (created_by_id)
- `idx_project_tenant_status` (tenant_id, status) - 🆕 Composite for tenant queries
- `idx_project_dates` (start_date, end_date) - 🆕 Date range queries

---

#### `milestone` 🆕 NEW
**Status**: Project milestones for better organization

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `tenant_id` | BIGINT | NOT NULL | 🆕 Multi-tenancy support |
| `project_id` | BIGINT | FK → `project.id`, NOT NULL | |
| `title` | VARCHAR(256) | NOT NULL DEFAULT '' | |
| `description` | TEXT | DEFAULT NULL | |
| `target_date` | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | |
| `status` | VARCHAR(50) | NOT NULL DEFAULT 'pending' | Enum: pending, in_progress, completed |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |
| `completed_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | |

**Constraints:**
- CHECK(`status` IN ('pending', 'in_progress', 'completed')) - Validate status enum

**Foreign Keys:**
- `project_id` → `project(id)` ON DELETE CASCADE

**Indexes:**
- `idx_milestone_tenant` (tenant_id) - 🆕 Multi-tenancy index
- `idx_milestone_project` (project_id)
- `idx_milestone_status` (status)
- `idx_milestone_tenant_project` (tenant_id, project_id) - 🆕 Composite for tenant queries
- `idx_milestone_target_date` (target_date) - 🆕 Date queries

---

#### `task` ✏️ ⭐ (renamed from `db_task_space`)
**Status**: Enhanced task management with enterprise features

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `tenant_id` | BIGINT | NOT NULL | 🆕 Multi-tenancy support |
| `task_number` | VARCHAR(50) | NOT NULL | ⭐ Task identifier (e.g., TASK-123) |
| `parent_task_id` | BIGINT | FK → `task.id`, DEFAULT NULL | ⭐ For subtasks hierarchy |
| `project_id` | BIGINT | FK → `project.id`, NOT NULL DEFAULT 0 | ✏️ Renamed from `id_project` |
| `milestone_id` | BIGINT | FK → `milestone.id`, DEFAULT NULL | ⭐ Link to milestone |
| `title` | VARCHAR(500) | NOT NULL DEFAULT '' | ⭐ Increased length |
| `description` | TEXT | DEFAULT NULL | ⭐ Full description (replaces `details`) |
| `task_type` | VARCHAR(50) | NOT NULL DEFAULT 'task' | ⭐ Enum: task, bug, feature, epic, story |
| `status` | VARCHAR(50) | NOT NULL DEFAULT 'todo' | ⭐ Enum: todo, in_progress, in_review, done, cancelled |
| `priority` | VARCHAR(20) | NOT NULL DEFAULT 'medium' | ⭐ Enum: low, medium, high, critical |
| `assignee_id` | BIGINT | FK → `staff.id`, DEFAULT NULL | ✏️ Renamed from `id_assignee`, nullable |
| `assigned_by_id` | BIGINT | FK → `staff.id`, DEFAULT NULL | ✏️ Renamed from `assignee_by` |
| `created_by_id` | BIGINT | FK → `staff.id`, NOT NULL DEFAULT 0 | ⭐ Who created the task |
| `start_date` | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | ⭐ When work should start |
| `due_date` | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | ✏️ Renamed from `deadline` |
| `original_due_date` | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | ✏️ Renamed from `original_deadline` |
| `estimated_hours` | DECIMAL(10,2) | DEFAULT NULL | ⭐ Estimated time to complete |
| `actual_hours` | DECIMAL(10,2) | DEFAULT NULL | ⭐ Actual time spent |
| `position` | INTEGER | NOT NULL DEFAULT 0 | ⭐ For ordering within project/assignee |
| `metadata` | JSONB | DEFAULT NULL | ⭐ Flexible metadata (order_id, customer_id, etc.) |
| `recurring_task_id` | BIGINT | FK → `recurring_task.id`, DEFAULT NULL | ⭐ Link to recurring template |
| `repeat_key` | VARCHAR(100) | NOT NULL DEFAULT '' | ✏️ Renamed from `key_repeat` |
| `reviewed_by_id` | BIGINT | FK → `staff.id`, DEFAULT NULL | ✏️ Renamed from `review_by` |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date_created` |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date_updated` |
| `started_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | ⭐ When work actually started |
| `completed_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | ✏️ Renamed from `date_completed` |
| `archived_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | ⭐ When task was archived |

**Constraints:**
- UNIQUE(`tenant_id`, `task_number`) - Task number unique per tenant
- CHECK(`task_type` IN ('task', 'bug', 'feature', 'epic', 'story')) - Validate task type enum
- CHECK(`status` IN ('todo', 'in_progress', 'in_review', 'done', 'cancelled')) - Validate status enum
- CHECK(`priority` IN ('low', 'medium', 'high', 'critical')) - Validate priority enum
- CHECK(`estimated_hours` IS NULL OR `estimated_hours` >= 0) - Validate non-negative hours
- CHECK(`actual_hours` IS NULL OR `actual_hours` >= 0) - Validate non-negative hours
- CHECK(`due_date` IS NULL OR `start_date` IS NULL OR `due_date` >= `start_date`) - Validate date range
- CHECK(`completed_at` IS NULL OR `started_at` IS NULL OR `completed_at` >= `started_at`) - Validate completion timeline

**Foreign Keys:**
- `parent_task_id` → `task(id)` ON DELETE SET NULL
- `project_id` → `project(id)` ON DELETE SET DEFAULT
- `milestone_id` → `milestone(id)` ON DELETE SET NULL
- `assignee_id` → `staff(id)` ON DELETE SET NULL
- `assigned_by_id` → `staff(id)` ON DELETE SET NULL
- `created_by_id` → `staff(id)` ON DELETE SET DEFAULT
- `recurring_task_id` → `recurring_task(id)` ON DELETE SET NULL
- `reviewed_by_id` → `staff(id)` ON DELETE SET NULL

**Notes:**
- `metadata` (JSONB) can store flexible data like `order_id`, `customer_id`, or any other custom fields
- Removed direct foreign keys to `order` and `customer` as this is an internal system

**Indexes:**
- `idx_task_tenant` (tenant_id) - 🆕 Multi-tenancy index
- `idx_task_number_tenant` (UNIQUE, tenant_id, task_number) - 🆕 Unique task number per tenant
- `idx_task_parent` (parent_task_id)
- `idx_task_project` (project_id)
- `idx_task_milestone` (milestone_id)
- `idx_task_assignee` (assignee_id)
- `idx_task_status` (status)
- `idx_task_priority` (priority)
- `idx_task_type` (task_type)
- `idx_task_due_date` (due_date)
- `idx_task_project_status` (project_id, status)
- `idx_task_created_by` (created_by_id)
- `idx_task_recurring` (recurring_task_id)
- `idx_task_tenant_project` (tenant_id, project_id) - 🆕 Composite for tenant queries
- `idx_task_tenant_assignee` (tenant_id, assignee_id) - 🆕 Composite for tenant queries
- `idx_task_tenant_status` (tenant_id, status) - 🆕 Composite for tenant queries
- `idx_task_due_date_active` (due_date) WHERE status NOT IN ('done', 'cancelled', 'archived') - 🆕 Partial index for active tasks

---

#### `task_watcher` 🆕 NEW
**Status**: Task watchers/followers (separate from assignees)

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `tenant_id` | BIGINT | NOT NULL | 🆕 Multi-tenancy support |
| `task_id` | BIGINT | FK → `task.id`, NOT NULL | |
| `staff_id` | BIGINT | FK → `staff.id`, NOT NULL | |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |
| UNIQUE(`task_id`, `staff_id`) | | | |

**Foreign Keys:**
- `task_id` → `task(id)` ON DELETE CASCADE
- `staff_id` → `staff(id)` ON DELETE CASCADE

**Indexes:**
- `idx_task_watcher_tenant` (tenant_id) - 🆕 Multi-tenancy index
- `idx_task_watcher_task` (task_id)
- `idx_task_watcher_staff` (staff_id)
- `idx_task_watcher_tenant_staff` (tenant_id, staff_id) - 🆕 Composite for tenant queries

---

#### `task_dependency` 🆕 NEW
**Status**: Task dependencies (blocks/blocked by relationships)

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `tenant_id` | BIGINT | NOT NULL | 🆕 Multi-tenancy support |
| `task_id` | BIGINT | FK → `task.id`, NOT NULL | ⭐ Task that depends |
| `depends_on_task_id` | BIGINT | FK → `task.id`, NOT NULL | ⭐ Task it depends on |
| `dependency_type` | VARCHAR(50) | NOT NULL DEFAULT 'blocks' | ⭐ Enum: blocks, relates_to, duplicates |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |
| UNIQUE(`task_id`, `depends_on_task_id`, `dependency_type`) | | | |

**Constraints:**
- CHECK(`dependency_type` IN ('blocks', 'relates_to', 'duplicates')) - Validate dependency type enum
- CHECK(`task_id` != `depends_on_task_id`) - Prevent self-dependency

**Foreign Keys:**
- `task_id` → `task(id)` ON DELETE CASCADE
- `depends_on_task_id` → `task(id)` ON DELETE CASCADE

**Indexes:**
- `idx_task_dependency_tenant` (tenant_id) - 🆕 Multi-tenancy index
- `idx_task_dependency_task` (task_id)
- `idx_task_dependency_depends_on` (depends_on_task_id)
- `idx_task_dependency_type` (dependency_type) - 🆕 Dependency type queries
- `idx_task_dependency_tenant_task` (tenant_id, task_id) - 🆕 Composite for tenant queries

---

#### `task_attachment` 🆕 NEW
**Status**: Task file attachments

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `tenant_id` | BIGINT | NOT NULL | 🆕 Multi-tenancy support |
| `task_id` | BIGINT | FK → `task.id`, NOT NULL | |
| `file_name` | VARCHAR(500) | NOT NULL | |
| `file_path` | VARCHAR(1000) | NOT NULL | ⭐ Storage path |
| `file_type` | VARCHAR(100) | NOT NULL DEFAULT '' | |
| `file_size` | BIGINT | NOT NULL DEFAULT 0 | ⭐ Size in bytes |
| `uploaded_by_id` | BIGINT | FK → `staff.id`, NOT NULL | |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |

**Constraints:**
- CHECK(`file_size` >= 0) - Validate non-negative file size

**Foreign Keys:**
- `task_id` → `task(id)` ON DELETE CASCADE
- `uploaded_by_id` → `staff(id)` ON DELETE SET DEFAULT

**Indexes:**
- `idx_task_attachment_tenant` (tenant_id) - 🆕 Multi-tenancy index
- `idx_task_attachment_task` (task_id)
- `idx_task_attachment_uploaded_by` (uploaded_by_id)
- `idx_task_attachment_file_type` (file_type) - 🆕 File type queries
- `idx_task_attachment_tenant_task` (tenant_id, task_id) - 🆕 Composite for tenant queries

---

#### `task_comment` ✏️ ⭐ (renamed from `task_conversation`)
**Status**: Enhanced task comments with mentions and reactions

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `tenant_id` | BIGINT | NOT NULL | 🆕 Multi-tenancy support |
| `task_id` | BIGINT | FK → `task.id`, NOT NULL | ✏️ Renamed from `id_task` |
| `parent_comment_id` | BIGINT | FK → `task_comment.id`, DEFAULT NULL | ⭐ For threaded comments |
| `author_id` | BIGINT | FK → `staff.id`, NOT NULL | ✏️ Renamed from `sender_id` |
| `content` | TEXT | NOT NULL | ✏️ Renamed from `message`, increased size |
| `is_internal` | BOOLEAN | NOT NULL DEFAULT FALSE | ⭐ Internal vs external comment |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date_created` |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ⭐ Last update timestamp |
| `deleted_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | ⭐ Soft delete |

**Constraints:**
- CHECK(`updated_at` >= `created_at`) - Validate update timestamp
- CHECK(`deleted_at` IS NULL OR `deleted_at` >= `created_at`) - Validate deletion timestamp

**Foreign Keys:**
- `task_id` → `task(id)` ON DELETE CASCADE
- `parent_comment_id` → `task_comment(id)` ON DELETE SET NULL
- `author_id` → `staff(id)` ON DELETE SET DEFAULT

**Indexes:**
- `idx_task_comment_tenant` (tenant_id) - 🆕 Multi-tenancy index
- `idx_task_comment_task` (task_id)
- `idx_task_comment_author` (author_id)
- `idx_task_comment_parent` (parent_comment_id)
- `idx_task_comment_created_at` (created_at)
- `idx_task_comment_tenant_task` (tenant_id, task_id) - 🆕 Composite for tenant queries
- `idx_task_comment_active` (task_id, created_at) WHERE deleted_at IS NULL - 🆕 Partial index for active comments

---

#### `task_comment_mention` 🆕 NEW
**Status**: User mentions in comments

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `tenant_id` | BIGINT | NOT NULL | 🆕 Multi-tenancy support |
| `comment_id` | BIGINT | FK → `task_comment.id`, NOT NULL | |
| `mentioned_staff_id` | BIGINT | FK → `staff.id`, NOT NULL | |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |
| UNIQUE(`comment_id`, `mentioned_staff_id`) | | | |

**Foreign Keys:**
- `comment_id` → `task_comment(id)` ON DELETE CASCADE
- `mentioned_staff_id` → `staff(id)` ON DELETE CASCADE

**Indexes:**
- `idx_task_comment_mention_tenant` (tenant_id) - 🆕 Multi-tenancy index
- `idx_task_comment_mention_comment` (comment_id)
- `idx_task_comment_mention_staff` (mentioned_staff_id)
- `idx_task_comment_mention_tenant_staff` (tenant_id, mentioned_staff_id) - 🆕 Composite for tenant queries

---

#### `task_activity` 🆕 NEW
**Status**: Task activity/audit log

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `tenant_id` | BIGINT | NOT NULL | 🆕 Multi-tenancy support |
| `task_id` | BIGINT | FK → `task.id`, NOT NULL | |
| `staff_id` | BIGINT | FK → `staff.id`, NOT NULL | ⭐ Who performed the action |
| `action_type` | VARCHAR(50) | NOT NULL | ⭐ Enum: created, updated, assigned, status_changed, etc. |
| `field_name` | VARCHAR(100) | DEFAULT NULL | ⭐ Which field changed |
| `old_value` | TEXT | DEFAULT NULL | ⭐ Previous value |
| `new_value` | TEXT | DEFAULT NULL | ⭐ New value |
| `metadata` | JSONB | DEFAULT NULL | ⭐ Additional context |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |

**Foreign Keys:**
- `task_id` → `task(id)` ON DELETE CASCADE
- `staff_id` → `staff(id)` ON DELETE SET DEFAULT

**Indexes:**
- `idx_task_activity_tenant` (tenant_id) - 🆕 Multi-tenancy index
- `idx_task_activity_task` (task_id)
- `idx_task_activity_staff` (staff_id)
- `idx_task_activity_action_type` (action_type)
- `idx_task_activity_created_at` (created_at)
- `idx_task_activity_tenant_task` (tenant_id, task_id) - 🆕 Composite for tenant queries
- `idx_task_activity_tenant_created` (tenant_id, created_at DESC) - 🆕 Composite for recent activity queries

---

#### `recurring_task` ✏️ ⭐ (renamed from `db_task_repeat_space`)
**Status**: Enhanced recurring task templates

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `tenant_id` | BIGINT | NOT NULL | 🆕 Multi-tenancy support |
| `name` | VARCHAR(256) | NOT NULL DEFAULT '' | ⭐ Template name |
| `project_id` | BIGINT | FK → `project.id`, DEFAULT NULL | ✏️ Renamed from `id_project`, nullable |
| `title_template` | VARCHAR(500) | NOT NULL DEFAULT '' | ✏️ Renamed from `title` |
| `description_template` | TEXT | DEFAULT NULL | ✏️ Renamed from `details` |
| `task_type` | VARCHAR(50) | NOT NULL DEFAULT 'task' | ⭐ Task type for generated tasks |
| `priority` | VARCHAR(20) | NOT NULL DEFAULT 'medium' | ⭐ Default priority |
| `frequency` | VARCHAR(50) | NOT NULL DEFAULT '' | ⭐ Enum: daily, weekly, monthly, custom |
| `day_repeat` | VARCHAR(300) | NOT NULL DEFAULT '' | ⭐ Days of week/month |
| `time_zone` | VARCHAR(200) | NOT NULL DEFAULT 'Asia/Ho_Chi_Minh' | |
| `next_run` | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | |
| `processing_time_hours` | INTEGER | NOT NULL DEFAULT 24 | ✏️ Renamed from `processing_time` |
| `days_before_insert` | INTEGER | NOT NULL DEFAULT 7 | |
| `is_active` | BOOLEAN | NOT NULL DEFAULT TRUE | ⭐ Enable/disable template |
| `created_by_id` | BIGINT | FK → `staff.id`, NOT NULL DEFAULT 0 | ⭐ Who created the template |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date_created` |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ⭐ Last update |

**Constraints:**
- CHECK(`task_type` IN ('task', 'bug', 'feature', 'epic', 'story')) - Validate task type enum
- CHECK(`priority` IN ('low', 'medium', 'high', 'critical')) - Validate priority enum
- CHECK(`frequency` IN ('daily', 'weekly', 'monthly', 'custom')) - Validate frequency enum
- CHECK(`processing_time_hours` > 0) - Validate positive processing time
- CHECK(`days_before_insert` >= 0) - Validate non-negative days

**Foreign Keys:**
- `project_id` → `project(id)` ON DELETE SET NULL
- `created_by_id` → `staff(id)` ON DELETE SET DEFAULT

**Indexes:**
- `idx_recurring_task_tenant` (tenant_id) - 🆕 Multi-tenancy index
- `idx_recurring_task_project` (project_id)
- `idx_recurring_task_active` (is_active)
- `idx_recurring_task_next_run` (next_run)
- `idx_recurring_task_tenant_active` (tenant_id, is_active) WHERE is_active = TRUE - 🆕 Partial index for active templates
- `idx_recurring_task_tenant_next_run` (tenant_id, next_run) WHERE is_active = TRUE AND next_run IS NOT NULL - 🆕 Partial index for scheduled templates

---

#### `recurring_task_assignee` 🆕 NEW
**Status**: Multiple assignees for recurring tasks (normalized)

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `tenant_id` | BIGINT | NOT NULL | 🆕 Multi-tenancy support |
| `recurring_task_id` | BIGINT | FK → `recurring_task.id`, NOT NULL | |
| `staff_id` | BIGINT | FK → `staff.id`, NOT NULL | |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |
| UNIQUE(`recurring_task_id`, `staff_id`) | | | |

**Foreign Keys:**
- `recurring_task_id` → `recurring_task(id)` ON DELETE CASCADE
- `staff_id` → `staff(id)` ON DELETE CASCADE

**Indexes:**
- `idx_recurring_task_assignee_tenant` (tenant_id) - 🆕 Multi-tenancy index
- `idx_recurring_task_assignee_recurring` (recurring_task_id)
- `idx_recurring_task_assignee_staff` (staff_id)
- `idx_recurring_task_assignee_tenant_staff` (tenant_id, staff_id) - 🆕 Composite for tenant queries

---

#### `project_repository` ✏️ ⭐ (renamed from `db_repository_project`)
**Status**: Enhanced project files repository

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `tenant_id` | BIGINT | NOT NULL | 🆕 Multi-tenancy support |
| `project_id` | BIGINT | FK → `project.id`, NOT NULL | ✏️ Renamed from `id_project` |
| `file_name` | VARCHAR(500) | NOT NULL DEFAULT '' | ✏️ Renamed from `name_file` |
| `file_path` | VARCHAR(1000) | NOT NULL DEFAULT '' | ⭐ Storage path (replaces `file_link`) |
| `file_type` | VARCHAR(256) | NOT NULL DEFAULT '' | ✏️ Renamed from `type_file` |
| `file_size` | BIGINT | NOT NULL DEFAULT 0 | ⭐ Size in bytes |
| `uploaded_by_id` | BIGINT | FK → `staff.id`, NOT NULL DEFAULT 0 | ✏️ Renamed from `share_by` |
| `description` | VARCHAR(500) | DEFAULT NULL | ⭐ File description |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date_created` |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ⭐ Last update |

**Constraints:**
- CHECK(`file_size` >= 0) - Validate non-negative file size

**Foreign Keys:**
- `project_id` → `project(id)` ON DELETE CASCADE
- `uploaded_by_id` → `staff(id)` ON DELETE SET DEFAULT

**Indexes:**
- `idx_project_repository_tenant` (tenant_id) - 🆕 Multi-tenancy index
- `idx_project_repository_project` (project_id)
- `idx_project_repository_uploaded_by` (uploaded_by_id)
- `idx_project_repository_file_type` (file_type) - 🆕 File type queries
- `idx_project_repository_tenant_project` (tenant_id, project_id) - 🆕 Composite for tenant queries

---

## Summary

### Key Improvements Made

#### Multi-Tenancy Support 🆕
- **All tables** now include `tenant_id` BIGINT NOT NULL for complete data isolation
- Unique constraints updated to be tenant-scoped (e.g., `UNIQUE(tenant_id, code)`, `UNIQUE(tenant_id, task_number)`)
- Composite indexes added for efficient tenant-scoped queries (e.g., `idx_task_tenant_project`, `idx_task_tenant_status`)

#### Staff Table References ✅
- All foreign keys correctly reference `staff.id` (verified)
- Foreign keys use appropriate ON DELETE behaviors: CASCADE, SET NULL, or SET DEFAULT based on business logic

#### Enhanced Indexing 🆕
- **Multi-tenancy indexes**: Every table has `idx_<table>_tenant` for tenant filtering
- **Composite indexes**: Tenant + common query fields (e.g., `idx_task_tenant_project`, `idx_task_tenant_assignee`)
- **Partial indexes**: For filtered queries (e.g., active tasks, active comments, scheduled recurring tasks)
- **Additional indexes**: File types, dependency types, action types for better query performance

#### Missing Constraints Added 🆕
- **Enum validation**: CHECK constraints for all enum fields (status, priority, task_type, visibility, etc.)
- **Data validation**: Non-negative checks for hours, file sizes, processing times
- **Date validation**: Date range checks (end_date >= start_date, completed_at >= started_at)
- **Self-reference prevention**: Task dependencies cannot reference themselves
- **Timestamp validation**: Updated timestamps must be >= created timestamps

#### Foreign Key Improvements ✅
- All foreign keys now specify ON DELETE behavior (CASCADE, SET NULL, or SET DEFAULT)
- Consistent use of SET DEFAULT for staff references where 0 is the default value

### Tables in Tasks & Projects Department

#### Core Tables
1. **project** - Enhanced project management with visibility, status workflow, and audit fields
2. **milestone** - Project milestones for better organization and tracking
3. **task** - Enterprise-grade task management with hierarchy, types, priorities, and time tracking
4. **recurring_task** - Enhanced recurring task templates with multiple assignees support

#### Task Relationships & Collaboration
5. **task_watcher** - Task watchers/followers (separate from assignees)
6. **task_dependency** - Task dependencies (blocks, relates to, duplicates)

#### Task Content & Activity
7. **task_comment** - Enhanced task comments with threading and soft delete
8. **task_comment_mention** - User mentions in comments
9. **task_attachment** - Task file attachments
10. **task_activity** - Complete task activity/audit log

#### Recurring Tasks
11. **recurring_task_assignee** - Multiple assignees for recurring tasks (normalized)

#### Project Files
12. **project_repository** - Enhanced project files repository with file size tracking

### Key Enterprise Features

#### Task Management
- **Task Hierarchy**: Support for subtasks via `parent_task_id`
- **Task Types**: Bug, Feature, Task, Epic, Story classification
- **Priority Levels**: Low, Medium, High, Critical
- **Status Workflow**: Todo → In Progress → In Review → Done (with Cancelled)
- **Time Tracking**: Estimated vs actual hours
- **Task Numbering**: Unique task identifiers (e.g., TASK-123)
- **Position/Ordering**: Support for drag-and-drop ordering

#### Project Management
- **Project Codes**: Unique project identifiers (e.g., PROJ-001)
- **Visibility Levels**: Private, Team, Public
- **Milestones**: Project milestone tracking
- **Status Workflow**: Active, On Hold, Completed, Archived

#### Collaboration Features
- **Single Assignee**: Each task has one primary assignee (via `assignee_id`)
- **Watchers**: Separate watchers/followers system
- **Dependencies**: Task blocking and relationship tracking
- **Threaded Comments**: Nested comment threads
- **Mentions**: User mentions in comments
- **Attachments**: File attachments per task

#### Audit & Tracking
- **Activity Log**: Complete audit trail of all task changes
- **Soft Deletes**: Comments support soft deletion
- **Timestamps**: Comprehensive timestamp tracking (created, updated, started, completed, archived)

#### Recurring Tasks
- **Template System**: Enhanced recurring task templates
- **Multiple Assignees**: Support for multiple assignees in templates
- **Flexible Scheduling**: Daily, weekly, monthly, custom frequencies

### Relationships

#### Project Relationships
- `project.owner_id` → `staff(id)`
- `project.created_by_id` → `staff(id)`
- `milestone.project_id` → `project(id)`

#### Task Core Relationships
- `task.parent_task_id` → `task(id)` (self-referential for subtasks)
- `task.project_id` → `project(id)`
- `task.milestone_id` → `milestone(id)`
- `task.assignee_id` → `staff(id)` (single assignee)
- `task.assigned_by_id` → `staff(id)`
- `task.created_by_id` → `staff(id)`
- `task.recurring_task_id` → `recurring_task(id)`
- `task.reviewed_by_id` → `staff(id)`
- `task.metadata` → JSONB (flexible storage for order_id, customer_id, etc.)

#### Task Collaboration Relationships
- `task_watcher.task_id` → `task(id)`
- `task_watcher.staff_id` → `staff(id)`
- `task_dependency.task_id` → `task(id)`
- `task_dependency.depends_on_task_id` → `task(id)`

#### Task Content Relationships
- `task_comment.task_id` → `task(id)`
- `task_comment.parent_comment_id` → `task_comment(id)` (threading)
- `task_comment.author_id` → `staff(id)`
- `task_comment_mention.comment_id` → `task_comment(id)`
- `task_comment_mention.mentioned_staff_id` → `staff(id)`
- `task_attachment.task_id` → `task(id)`
- `task_attachment.uploaded_by_id` → `staff(id)`
- `task_activity.task_id` → `task(id)`
- `task_activity.staff_id` → `staff(id)`

#### Recurring Task Relationships
- `recurring_task.project_id` → `project(id)`
- `recurring_task.created_by_id` → `staff(id)`
- `recurring_task_assignee.recurring_task_id` → `recurring_task(id)`
- `recurring_task_assignee.staff_id` → `staff(id)`

#### Project Repository Relationships
- `project_repository.project_id` → `project(id)`
- `project_repository.uploaded_by_id` → `staff(id)`

### Design Principles

1. **Multi-Tenancy**: All tables include `tenant_id` for complete data isolation and scalability
2. **Normalization**: All many-to-many relationships use junction tables
3. **Flexibility**: Support for watchers, dependencies, and flexible metadata storage
4. **Single Assignee**: Each task has one primary assignee (simplified for internal systems)
5. **Auditability**: Complete activity log for compliance and debugging
6. **Scalability**: Proper indexing for common query patterns with composite and partial indexes
7. **User Experience**: Features like task numbering, priorities, and status workflows
8. **Data Integrity**: Foreign keys with appropriate CASCADE/SET NULL/SET DEFAULT behaviors, CHECK constraints for enum validation
9. **Soft Deletes**: Where appropriate (comments) to preserve data history
10. **Performance**: Strategic composite indexes for tenant-scoped queries and partial indexes for filtered queries

---

## Entity Relationship Diagram (ERD)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TASKS & PROJECTS ERD                                 │
│                         (Multi-Tenant Architecture)                           │
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
         ▼
┌──────────────────────┐
│      project         │
│──────────────────────│
│ PK  id               │
│     tenant_id        │
│ UK  code             │ (UNIQUE per tenant)
│     title            │
│ FK  owner_id ────────┼───► staff.id (SET DEFAULT)
│ FK  created_by_id ───┼───► staff.id (SET DEFAULT)
│     status            │
│     visibility        │
│     start_date        │
│     end_date          │
└──────────────────────┘
         │
         │ 1:N
         ├──────────────────────────────────────────────┐
         │                                              │
         ▼                                              ▼
┌──────────────────────┐                                    ┌──────────────────────┐
│     milestone        │                                    │  project_repository  │
│──────────────────────│                                    │──────────────────────│
│ PK  id               │                                    │ PK  id               │
│     tenant_id        │                                    │     tenant_id        │
│ FK  project_id ──────┼───► project.id (CASCADE)          │ FK  project_id ──────┼───► project.id (CASCADE)
│     title            │                                    │     file_name        │
│     target_date      │                                    │     file_path        │
│     status            │                                    │     file_type        │
└──────────────────────┘                                    │     file_size        │
         │                                                               │ FK  uploaded_by_id ───► staff.id
         │ 1:N                                                           └──────────────────────┘
         │
         ▼
┌──────────────────────┐
│       task           │
│──────────────────────│
│ PK  id               │
│     tenant_id        │
│ UK  task_number      │ (UNIQUE per tenant)
│ FK  parent_task_id ──┼───► task.id (SET NULL) [Self-referential]
│ FK  project_id ──────┼───► project.id (SET DEFAULT)
│ FK  milestone_id ────┼───► milestone.id (SET NULL)
│ FK  assignee_id ─────┼───► staff.id (SET NULL)
│ FK  assigned_by_id ──┼───► staff.id (SET NULL)
│ FK  created_by_id ───┼───► staff.id (SET DEFAULT)
│ FK  reviewed_by_id ───┼───► staff.id (SET NULL)
│ FK  recurring_task_id┼───► recurring_task.id (SET NULL)
│     title            │
│     task_type        │
│     status            │
│     priority          │
│     due_date          │
│     estimated_hours   │
│     actual_hours      │
│     metadata (JSONB) │
└──────────────────────┘
         │
         │ 1:N
         ├─────────────────────────────────────────────────────────────┐
         │                                                               │
         ▼                                                               ▼
┌──────────────────────┐                                    ┌──────────────────────┐
│   task_watcher       │                                    │  task_dependency     │
│──────────────────────│                                    │──────────────────────│
│ PK  id               │                                    │ PK  id               │
│     tenant_id        │                                    │     tenant_id        │
│ FK  task_id ─────────┼───► task.id (CASCADE)             │ FK  task_id ─────────┼───► task.id (CASCADE)
│ FK  staff_id ────────┼───► staff.id (CASCADE)             │ FK  depends_on_task_id┼───► task.id (CASCADE)
│ UK  (task_id, staff_id)                                   │     dependency_type  │
└──────────────────────┘                                    │ UK  (task_id, depends_on_task_id, type)
         │                                                               │
         │                                                               │
         │                                                               │
         ▼                                                               ▼
┌──────────────────────┐                                    ┌──────────────────────┐
│   task_comment       │                                    │  task_attachment     │
│──────────────────────│                                    │──────────────────────│
│ PK  id               │                                    │ PK  id               │
│     tenant_id        │                                    │     tenant_id        │
│ FK  task_id ─────────┼───► task.id (CASCADE)             │ FK  task_id ─────────┼───► task.id (CASCADE)
│ FK  parent_comment_id┼───► task_comment.id (SET NULL)    │ FK  uploaded_by_id ──┼───► staff.id (SET DEFAULT)
│ FK  author_id ───────┼───► staff.id (SET DEFAULT)        │     file_name        │
│     content          │                                    │     file_path        │
│     is_internal      │                                    │     file_type        │
│     deleted_at       │                                    │     file_size        │
└──────────────────────┘                                    └──────────────────────┘
         │
         │ 1:N
         │
         ▼
┌──────────────────────┐
│ task_comment_mention │
│──────────────────────│
│ PK  id               │
│     tenant_id        │
│ FK  comment_id ──────┼───► task_comment.id (CASCADE)
│ FK  mentioned_staff_id┼───► staff.id (CASCADE)
│ UK  (comment_id, mentioned_staff_id)
└──────────────────────┘

┌──────────────────────┐
│   task_activity      │
│──────────────────────│
│ PK  id               │
│     tenant_id        │
│ FK  task_id ─────────┼───► task.id (CASCADE)
│ FK  staff_id ────────┼───► staff.id (SET DEFAULT)
│     action_type      │
│     field_name       │
│     old_value        │
│     new_value        │
│     metadata (JSONB) │
└──────────────────────┘

┌──────────────────────┐
│  recurring_task      │
│──────────────────────│
│ PK  id               │
│     tenant_id        │
│ FK  project_id ──────┼───► project.id (SET NULL)
│ FK  created_by_id ───┼───► staff.id (SET DEFAULT)
│     name             │
│     title_template   │
│     frequency        │
│     next_run         │
│     is_active        │
└──────────────────────┘
         │
         │ 1:N
         │
         ▼
┌──────────────────────┐
│recurring_task_assignee│
│──────────────────────│
│ PK  id               │
│     tenant_id        │
│ FK  recurring_task_id┼───► recurring_task.id (CASCADE)
│ FK  staff_id ────────┼───► staff.id (CASCADE)
│ UK  (recurring_task_id, staff_id)
└──────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              RELATIONSHIP SUMMARY                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Core Hierarchy:                                                             │
│    staff ──1:N──► project ──1:N──► milestone ──1:N──► task                │
│    staff ──1:N──► project ──1:N──► project_repository                       │
│    staff ──1:N──► project ──0:N──► recurring_task                         │
│                                                                              │
│  Task Relationships:                                                         │
│    task ──1:N──► task (self-referential for subtasks)                       │
│    task ──N:1──► project                                                     │
│    task ──N:1──► milestone                                                  │
│    task ──N:1──► recurring_task                                             │
│    task ──1:N──► task_watcher ──N:1──► staff                                │
│    task ──1:N──► task_dependency ──N:1──► task (depends_on)                │
│    task ──1:N──► task_comment ──1:N──► task_comment (threading)            │
│    task ──1:N──► task_comment ──1:N──► task_comment_mention                 │
│    task ──1:N──► task_attachment                                            │
│    task ──1:N──► task_activity                                              │
│                                                                              │
│  Staff References (All tables):                                            │
│    • project: owner_id, created_by_id                                        │
│    • task: assignee_id, assigned_by_id, created_by_id, reviewed_by_id     │
│    • task_watcher: staff_id                                                  │
│    • task_attachment: uploaded_by_id                                        │
│    • task_comment: author_id                                                │
│    • task_comment_mention: mentioned_staff_id                                │
│    • task_activity: staff_id                                                │
│    • recurring_task: created_by_id                                            │
│    • recurring_task_assignee: staff_id                                      │
│    • project_repository: uploaded_by_id                                     │
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
│  1:N  = One-to-Many    (e.g., one project has many tasks)                  │
│  N:1  = Many-to-One    (e.g., many tasks belong to one project)            │
│  0:N  = Zero-to-Many   (e.g., project may have zero or more recurring_tasks)│
│  N:M  = Many-to-Many   (via junction tables)                                │
│                                                                              │
│  FK   = Foreign Key                                                          │
│  PK   = Primary Key                                                          │
│  UK   = Unique Key                                                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

