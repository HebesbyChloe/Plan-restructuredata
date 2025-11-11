# Tasks & Projects Department

## Overview
This document shows the complete Tasks & Projects schema structure with data types, foreign keys, and change indicators.

**Legend:**
- 🆕 **NEW** - Newly created tables
- 🔄 **NORMALIZED** - Comma-separated values moved to junction tables
- 🗑️ **REMOVED** - Fields/tables removed or consolidated
- ✏️ **RENAMED** - Table/column renamed
- 📊 **DENORMALIZED** - Denormalized for performance (if any)

---

## Core Tables

#### `project` ✏️ (renamed from `db_project_space`)
**Status**: Project management

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `title` | VARCHAR(400) | NOT NULL DEFAULT '' | |
| `team` | VARCHAR(256) | NOT NULL DEFAULT '' | |
| `owner_project_id` | BIGINT | NOT NULL DEFAULT 0 | ✏️ Renamed from `owner_project` |
| `status` | VARCHAR(256) | NOT NULL DEFAULT 'Active' | |
| `start_time` | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | ✏️ Renamed from `date_time_start` |
| `end_time` | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | ✏️ Renamed from `date_time_end` |
| `is_continuous` | BOOLEAN | NOT NULL DEFAULT FALSE | ✏️ Renamed from `is_continuous` |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date_created` |
| `completed_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | ✏️ Renamed from `date_completed` |

---

#### `task` ✏️ (renamed from `db_task_space`)
**Status**: Task management 

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `repeat_key` | VARCHAR(100) | NOT NULL DEFAULT '' | ✏️ Renamed from `key_repeat` |
| `assignee_id` | BIGINT | FK → `staff.id`, NOT NULL DEFAULT 0 | ✏️ Renamed from `id_assignee` |
| `assigned_by_id` | BIGINT | FK → `staff.id`, NOT NULL DEFAULT 0 | ✏️ Renamed from `assignee_by` |
| `project_id` | BIGINT | FK → `project.id`, NOT NULL DEFAULT 0 | ✏️ Renamed from `id_project` |
| `team` | VARCHAR(256) | NOT NULL DEFAULT '' | |
| `title` | VARCHAR(256) | NOT NULL DEFAULT '' | |
| `details` | VARCHAR(700) | NOT NULL DEFAULT '' | |
| `status` | VARCHAR(256) | NOT NULL DEFAULT '' | |
| `deadline` | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | |
| `original_deadline` | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | |
| `status_deadline` | VARCHAR(100) | DEFAULT '' | |
| `order_id` | BIGINT | FK → `order.id`, NOT NULL DEFAULT 0 | ✏️ Renamed from `id_order` |
| `after_sales_link` | VARCHAR(100) | NOT NULL DEFAULT '' | ✏️ Renamed from `link_after_sales` |
| `customer_id` | BIGINT | FK → `customer.id`, NOT NULL DEFAULT 0 | ✏️ Renamed from `id_customer` |
| `order_in_project` | INTEGER | NOT NULL DEFAULT 0 | |
| `order_in_assignee` | INTEGER | NOT NULL DEFAULT 0 | |
| `admin_note` | VARCHAR(500) | NOT NULL | |
| `is_note_confirmed` | BOOLEAN | NOT NULL DEFAULT TRUE | ✏️ Renamed from `confirm_note` |
| `note_by_user_id` | BIGINT | NOT NULL DEFAULT 0 | ✏️ Renamed from `note_by_user` |
| `admin_note_date` | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | ✏️ Renamed from `date_admin_note` |
| `deliverable_type` | VARCHAR(100) | NOT NULL DEFAULT '' | ✏️ Renamed from `type_deliverable` |
| `deliverable_link` | VARCHAR(300) | NOT NULL DEFAULT '' | ✏️ Renamed from `link_deliverable` |
| `deliverable_name` | VARCHAR(100) | NOT NULL | ✏️ Renamed from `name_deliverable` |
| `deliverable_review_status` | VARCHAR(100) | NOT NULL DEFAULT 'Neutral' | ✏️ Renamed from `status_review_deliverable` |
| `self_review_deliverable` | VARCHAR(800) | NOT NULL DEFAULT '' | ✏️ Renamed from `self_reivew_deliverable` |
| `leader_review_deliverable` | VARCHAR(500) | NOT NULL DEFAULT '' | ✏️ Renamed from `leader_reivew_deliverable` |
| `review_by_id` | BIGINT | NOT NULL DEFAULT 0 | ✏️ Renamed from `review_by` |
| `total_comment` | INTEGER | NOT NULL DEFAULT 0 | |
| `deliverable_submitted_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | ✏️ Renamed from `date_submit_deliverable` |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date_created` |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date_updated` |
| `completed_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | ✏️ Renamed from `date_completed` |

**Foreign Keys:**
- `assignee_id` → `staff(id)`
- `assigned_by_id` → `staff(id)`
- `project_id` → `project(id)`
- `order_id` → `order(id)`
- `customer_id` → `customer(id)`

**Junction Tables (Normalized):**
- 🆕 `task_assignee` - Normalized from `ids_assignee` (VARCHAR(256) comma-separated in `recurring_task`)

**Indexes:**
- `idx_task_assignee`
- `idx_task_project`
- `idx_task_order`
- `idx_task_customer`
- `idx_task_status`
- `idx_task_deadline`
- `idx_task_project_status`

---

#### `task_assignee` 🆕 NEW
**Status**: Junction table (normalized)

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `task_id` | BIGINT | FK → `task.id`, NOT NULL | |
| `staff_id` | BIGINT | FK → `staff.id`, NOT NULL | |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |
| UNIQUE(`task_id`, `staff_id`) | | | |

**Foreign Keys:**
- `task_id` → `task(id)` ON DELETE CASCADE
- `staff_id` → `staff(id)` ON DELETE CASCADE

**Indexes:**
- `idx_task_assignee_task`
- `idx_task_assignee_staff`

---

#### `recurring_task` ✏️ (renamed from `db_task_repeat_space`)
**Status**: Recurring tasks

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `assignee_id` | BIGINT | FK → `staff.id`, NOT NULL DEFAULT 0 | ✏️ Renamed from `id_assignee` |
| `project_id` | BIGINT | FK → `project.id`, NOT NULL DEFAULT 0 | ✏️ Renamed from `id_project` |
| `team` | VARCHAR(256) | NOT NULL DEFAULT '' | |
| `title` | VARCHAR(256) | NOT NULL DEFAULT '' | |
| `details` | VARCHAR(700) | NOT NULL | |
| `frequency` | VARCHAR(100) | NOT NULL DEFAULT '' | |
| `day_repeat` | VARCHAR(300) | NOT NULL DEFAULT '' | |
| `time_zone` | VARCHAR(200) | NOT NULL DEFAULT 'Asia/Ho_Chi_Minh' | |
| `next_run` | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | |
| `processing_time` | INTEGER | NOT NULL DEFAULT 24 | |
| `days_before_insert` | INTEGER | NOT NULL DEFAULT 7 | |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date_created` |

**Removed Fields (Normalized):**
- 🗑️ `ids_assignee` (VARCHAR(256)) - Use `task_assignee` junction table for related tasks

**Foreign Keys:**
- `assignee_id` → `staff(id)`
- `project_id` → `project(id)`

---

#### `task_notification` ✏️ (renamed from `db_notification_task`)
**Status**: Task notifications

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `assignee_id` | BIGINT | FK → `staff.id`, NOT NULL | ✏️ Renamed from `id_assignee` |
| `created_by_id` | BIGINT | FK → `staff.id`, NOT NULL DEFAULT 0 | ✏️ Renamed from `create_by` |
| `task_id` | BIGINT | FK → `task.id`, NOT NULL | ✏️ Renamed from `id_task` |
| `type` | VARCHAR(256) | NOT NULL DEFAULT '' | |
| `title` | VARCHAR(256) | NOT NULL | |
| `details` | VARCHAR(800) | NOT NULL | |
| `is_read` | BOOLEAN | NOT NULL DEFAULT FALSE | ✏️ Renamed from `status` |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date_created` |
| `read_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | ✏️ Renamed from `date_read` |

**Foreign Keys:**
- `assignee_id` → `staff(id)`
- `created_by_id` → `staff(id)`
- `task_id` → `task(id)`

**Indexes:**
- `idx_task_notification_assignee`
- `idx_task_notification_task`

---

#### `task_conversation` ✏️ (renamed from `db_conversation_task`)
**Status**: Task conversations

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `task_id` | BIGINT | FK → `task.id`, NOT NULL | ✏️ Renamed from `id_task` |
| `sender_id` | BIGINT | FK → `staff.id`, NOT NULL | ✏️ Renamed from `sender_id` |
| `message` | VARCHAR(500) | NOT NULL | |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | ✏️ Renamed from `date_created` |

**Foreign Keys:**
- `task_id` → `task(id)`
- `sender_id` → `staff(id)`

**Indexes:**
- `idx_task_conversation_task`
- `idx_task_conversation_sender`

---

#### `project_repository` ✏️ (renamed from `db_repository_project`)
**Status**: Project files repository

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `project_id` | BIGINT | FK → `project.id`, NOT NULL | ✏️ Renamed from `id_project` |
| `file_link` | VARCHAR(500) | NOT NULL DEFAULT '' | ✏️ Renamed from `link_file` |
| `file_type` | VARCHAR(256) | NOT NULL DEFAULT '' | ✏️ Renamed from `type_file` |
| `file_name` | VARCHAR(256) | NOT NULL DEFAULT '' | ✏️ Renamed from `name_file` |
| `shared_by_id` | BIGINT | FK → `staff.id`, NOT NULL DEFAULT 0 | ✏️ Renamed from `share_by` |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | ✏️ Renamed from `date_created` |

**Foreign Keys:**
- `project_id` → `project(id)`
- `shared_by_id` → `staff(id)`

**Indexes:**
- `idx_project_repository_project`

---

## Summary

### Tables in Tasks & Projects Department
1. **project** - Project management
2. **task** - Task management
3. **task_assignee** - Task assignees junction table (normalized)
4. **recurring_task** - Recurring task templates
5. **task_notification** - Task notifications
6. **task_conversation** - Task conversations
7. **project_repository** - Project files repository

### Key Features
- **Normalization**: Comma-separated assignee IDs moved to junction table
- **Foreign Keys**: Proper relationships with staff, project, order, and customer tables
- **Indexes**: Optimized for common queries (status, deadline, project, assignee)
- **Task Management**: Full lifecycle tracking with deadlines, deliverables, and reviews

### Relationships
- `task.assignee_id` → `staff.id`
- `task.assigned_by_id` → `staff.id`
- `task.project_id` → `project.id`
- `task.order_id` → `order.id`
- `task.customer_id` → `customer.id`
- `task_assignee.task_id` → `task(id)`
- `task_assignee.staff_id` → `staff(id)`
- `recurring_task.assignee_id` → `staff(id)`
- `recurring_task.project_id` → `project.id`
- `task_notification.assignee_id` → `staff(id)`
- `task_notification.created_by_id` → `staff(id)`
- `task_notification.task_id` → `task(id)`
- `task_conversation.task_id` → `task(id)`
- `task_conversation.sender_id` → `staff(id)`
- `project_repository.project_id` → `project(id)`
- `project_repository.shared_by_id` → `staff(id)`

