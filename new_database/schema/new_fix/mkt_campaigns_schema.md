# Marketing Campaigns Schema

## Overview
This document defines the schema for marketing campaigns with integration to the project and task management system. Simple action milestones use `mkt_campaign_activities`, while complex activities are managed as projects. All tasks are handled through the unified task system.

**Design Philosophy:**
- **Full Integration**: Complex activities are projects (via `mkt_campaign_projects`)
- **Simple Activities**: Quick action milestones use `mkt_campaign_activities` (independent of projects/tasks)
- **Unified Task System**: All tasks use the `task` table with metadata
- **Normalization**: Campaigns link to projects via junction table (N:M relationship)
- **Flexibility**: Projects can store marketing-specific data in `metadata` JSONB field

**Legend:**
- 🆕 **NEW** - Newly created tables
- 🔄 **NORMALIZED** - Normalized relationships
- 🗑️ **REMOVED** - Tables/fields removed (mkt_campaign_tasks)
- ⭐ **ENHANCED** - Enhanced with enterprise features
- 🔗 **Foreign Key** - Relationship to another table
- ⏰ **Timestamp** - Time tracking column

---

## Schema Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                    MARKETING CAMPAIGNS SCHEMA                    │
│                    (Full Integration Approach)                   │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│   mkt_campaigns      │ (Main campaign table)
│──────────────────────│
│ id (PK)              │
│ tenant_id (FK) ──────┼──► sys_tenants.id
│ name                 │
│ type                 │
│ status               │
│ budget               │
│ spent                │
│ owner_id (FK) ───────┼──► sys_users.id
│ ...                  │
└────┬─────────────────┘
     │
     ├─── 1:N ────► mkt_campaign_goals (campaign_id)
     │
     ├─── 1:N ────► mkt_campaign_activities (campaign_id) [Action milestones]
     │
     └─── N:M ────► mkt_campaign_projects (campaign_id, project_id)
                    │
                    └───► project (1)
                            └───► task (N) [with metadata.campaign_id]
```

---

## Core Tables

### `mkt_campaigns` 🆕 NEW
**Status**: Marketing campaigns

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `tenant_id` | BIGINT | NOT NULL, FK → `sys_tenants(id)` | 🔗 Multi-tenancy |
| `name` | VARCHAR(500) | NOT NULL | Campaign name/title |
| `type` | VARCHAR(50) | NOT NULL | ✅ 'email', 'social', 'paid-ads', 'content', 'event', 'launch' |
| `status` | VARCHAR(50) | NOT NULL DEFAULT 'planning' | ✅ 'planning', 'in-progress', 'launching', 'completed', 'draft', 'paused' |
| `description` | TEXT | DEFAULT NULL | Campaign description |
| `budget` | NUMERIC(12,2) | DEFAULT 0 | Campaign budget |
| `spent` | NUMERIC(12,2) | DEFAULT 0 | Amount spent |
| `start_date` | DATE | NOT NULL | Campaign start date |
| `end_date` | DATE | DEFAULT NULL | Campaign end date |
| `owner_id` | INTEGER | FK → `sys_users(id)`, NOT NULL | Campaign owner |
| `priority` | VARCHAR(20) | DEFAULT 'medium' | ✅ 'high', 'medium', 'low' |
| `progress` | INTEGER | DEFAULT 0 | ✅ CHECK (0-100) |
| `ai_score` | INTEGER | DEFAULT NULL | ✅ CHECK (0-100) |
| `purpose` | TEXT | DEFAULT NULL | Campaign purpose |
| `notes` | TEXT | DEFAULT NULL | Internal notes |
| `reach` | INTEGER | DEFAULT 0 | Current reach |
| `reach_goal` | INTEGER | DEFAULT 0 | Target reach |
| `engagement` | NUMERIC(5,2) | DEFAULT 0 | Engagement percentage |
| `engagement_goal` | NUMERIC(5,2) | DEFAULT 0 | Target engagement |
| `impressions` | INTEGER | DEFAULT 0 | Total impressions |
| `clicks` | INTEGER | DEFAULT 0 | Total clicks |
| `conversions` | INTEGER | DEFAULT 0 | Total conversions |
| `revenue` | NUMERIC(12,2) | DEFAULT 0 | Revenue generated |
| `channels` | TEXT[] | DEFAULT '{}' | 📊 Array of channel names |
| `tags` | TEXT[] | DEFAULT '{}' | 📊 Array of tags |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | ⏰ |
| `updated_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | ⏰ |
| `deleted_at` | TIMESTAMPTZ | DEFAULT NULL | 🆕 Soft delete |

**Foreign Keys:**
- `tenant_id` → `sys_tenants(id)`
- `owner_id` → `sys_users(id)`

**Constraints:**
- CHECK(`status` IN ('planning', 'in-progress', 'launching', 'completed', 'draft', 'paused'))
- CHECK(`type` IN ('email', 'social', 'paid-ads', 'content', 'event', 'launch'))
- CHECK(`priority` IN ('high', 'medium', 'low'))
- CHECK(`progress` >= 0 AND `progress` <= 100)
- CHECK(`ai_score` IS NULL OR (`ai_score` >= 0 AND `ai_score` <= 100))
- CHECK(`end_date` IS NULL OR `end_date` >= `start_date`)
- CHECK(`engagement` >= 0 AND `engagement` <= 100)
- CHECK(`engagement_goal` >= 0 AND `engagement_goal` <= 100)

**Indexes:**
- `idx_mkt_campaigns_tenant_id` (tenant_id)
- `idx_mkt_campaigns_tenant_status` (tenant_id, status)
- `idx_mkt_campaigns_tenant_type` (tenant_id, type)
- `idx_mkt_campaigns_owner_id` (owner_id)
- `idx_mkt_campaigns_dates` (start_date, end_date)
- `idx_mkt_campaigns_tags` USING GIN(tags)
- `idx_mkt_campaigns_deleted_at` (deleted_at) WHERE deleted_at IS NULL

---

### `mkt_campaign_goals` 🆕 NEW
**Status**: Campaign goals and objectives

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `campaign_id` | BIGINT | FK → `mkt_campaigns.id`, NOT NULL | 🔗 |
| `goal_text` | TEXT | NOT NULL | Goal description |
| `target_value` | NUMERIC(12,2) | DEFAULT NULL | Target metric value |
| `achieved_value` | NUMERIC(12,2) | DEFAULT NULL | Achieved metric value |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | ⏰ |
| `updated_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | ⏰ |

**Foreign Keys:**
- `campaign_id` → `mkt_campaigns(id)` ON DELETE CASCADE

**Indexes:**
- `idx_mkt_campaign_goals_campaign_id` (campaign_id)

---

### `mkt_campaign_activities` 🆕 NEW
**Status**: Action milestones/events within campaigns (independent of projects/tasks)

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `campaign_id` | BIGINT | FK → `mkt_campaigns.id`, NOT NULL | 🔗 |
| `title` | VARCHAR(500) | NOT NULL | Activity title/name |
| `type` | VARCHAR(50) | NOT NULL | ✅ 'email', 'social', 'paid-ads', 'content', 'event', 'announcement', 'launch' |
| `status` | VARCHAR(50) | NOT NULL DEFAULT 'scheduled' | ✅ 'scheduled', 'active', 'completed', 'cancelled' |
| `date` | DATE | NOT NULL | Activity date |
| `start_time` | TIME | DEFAULT NULL | Activity start time |
| `end_time` | TIME | DEFAULT NULL | Activity end time |
| `duration` | INTEGER | DEFAULT 1 | Duration in days |
| `description` | TEXT | DEFAULT NULL | Activity description |
| `location` | VARCHAR(500) | DEFAULT NULL | Location (for events) |
| `budget` | NUMERIC(12,2) | DEFAULT NULL | Activity budget |
| `reach` | INTEGER | DEFAULT NULL | Expected reach |
| `notes` | TEXT | DEFAULT NULL | Internal notes |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | ⏰ |
| `updated_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | ⏰ |
| `deleted_at` | TIMESTAMPTZ | DEFAULT NULL | 🆕 Soft delete |

**Foreign Keys:**
- `campaign_id` → `mkt_campaigns(id)` ON DELETE CASCADE

**Constraints:**
- CHECK(`type` IN ('email', 'social', 'paid-ads', 'content', 'event', 'announcement', 'launch'))
- CHECK(`status` IN ('scheduled', 'active', 'completed', 'cancelled'))
- CHECK(`end_time` IS NULL OR `start_time` IS NULL OR `end_time` >= `start_time`)
- CHECK(`duration` > 0)

**Indexes:**
- `idx_mkt_campaign_activities_campaign_id` (campaign_id)
- `idx_mkt_campaign_activities_date` (date)
- `idx_mkt_campaign_activities_status` (status)
- `idx_mkt_campaign_activities_type` (type)
- `idx_mkt_campaign_activities_campaign_date` (campaign_id, date)
- `idx_mkt_campaign_activities_deleted_at` (deleted_at) WHERE deleted_at IS NULL

**Notes:**
- **Independent of Projects/Tasks**: These are simple action milestones, not full projects
- **Use Cases**: Quick actions like "Send email", "Post on Facebook", "Launch ad campaign", "Announcement"
- **Not for Complex Work**: Complex activities should use Projects (via `mkt_campaign_projects`)
- **Timeline Tracking**: Used for campaign timeline and scheduling

---

### `mkt_campaign_projects` 🆕 NEW (Junction Table)
**Status**: Links campaigns to projects (N:M relationship)

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `campaign_id` | BIGINT | FK → `mkt_campaigns.id`, NOT NULL | 🔗 |
| `project_id` | BIGINT | FK → `project.id`, NOT NULL | 🔗 |
| `role` | VARCHAR(50) | DEFAULT NULL | ✅ 'main', 'sub', 'support' - Role of project in campaign |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | ⏰ |
| PRIMARY KEY (`campaign_id`, `project_id`) | | | |

**Foreign Keys:**
- `campaign_id` → `mkt_campaigns(id)` ON DELETE CASCADE
- `project_id` → `project(id)` ON DELETE CASCADE

**Constraints:**
- CHECK(`role` IS NULL OR `role` IN ('main', 'sub', 'support'))

**Indexes:**
- `idx_mkt_campaign_projects_campaign` (campaign_id)
- `idx_mkt_campaign_projects_project` (project_id)
- `idx_mkt_campaign_projects_role` (role) WHERE role IS NOT NULL

**Notes:**
- One campaign can have multiple projects (activities)
- One project can belong to multiple campaigns (if needed)
- `role` indicates the importance/type of project in the campaign

---

## Integration with Project & Task System

### Projects for Campaign Activities

All campaign activities are managed as **projects**. Marketing-specific data is stored in the `project.metadata` JSONB field:

```json
{
  "campaign_id": 1,
  "activity_type": "email",
  "budget": 5000000,
  "reach": 500000,
  "marketing_metrics": {
    "open_rate": 25.5,
    "click_rate": 3.2,
    "conversion_rate": 2.1
  }
}
```

**Project fields used for campaigns:**
- `title` - Activity name
- `description` - Activity description
- `status` - Activity status (active, on_hold, completed, archived)
- `start_date` - Activity start date
- `end_date` - Activity end date
- `owner_id` - Activity owner
- `metadata` - Marketing-specific data (JSONB)

---

### Tasks for Campaign Work Items

All campaign tasks are managed in the **`task`** table. Campaign context is stored in `task.metadata` JSONB field:

```json
{
  "campaign_id": 1,
  "project_id": 10,
  "activity_type": "paid-ads",
  "marketing_context": {
    "channel": "google-ads",
    "priority": "high"
  }
}
```

**Task fields used for campaigns:**
- `project_id` - Links to project (which links to campaign)
- `title` - Task name
- `status` - Task status
- `assignee_id` - Task assignee
- `due_date` - Task due date
- `priority` - Task priority
- `metadata` - Campaign context (JSONB)

---

## Example Data

### Campaign: "Black Friday 2024 - Siêu Sale"

```sql
-- 1. Campaign chính
mkt_campaigns:
├── id: 1
├── tenant_id: 1
├── name: "Black Friday 2024 - Siêu Sale"
├── type: "launch"
├── status: "in-progress"
├── budget: 2000000000  -- 2 tỷ VNĐ
├── spent: 1168000000   -- 1.168 tỷ
├── start_date: 2024-11-24
├── end_date: 2024-11-26
├── owner_id: 101
├── priority: "high"
├── progress: 58
├── reach: 6500000
├── reach_goal: 10000000
├── revenue: 12500000000
└── tags: ['black-friday', 'high-priority', 'seasonal']

-- 2. Campaign Goals
mkt_campaign_goals:
├── id: 1, campaign_id: 1, goal_text: "Đạt 10 triệu lượt tiếp cận", target: 10000000, achieved: 6500000
├── id: 2, campaign_id: 1, goal_text: "Tăng doanh thu 20 tỷ VNĐ", target: 20000000000, achieved: 12500000000
└── id: 3, campaign_id: 1, goal_text: "Thu hút 100,000 khách hàng mới", target: 100000, achieved: 45000

-- 3. Campaign Activities (Action Milestones)
mkt_campaign_activities:
├── id: 1, campaign_id: 1, title: "Email khởi động - Thông báo Black Friday", type: "email", 
│   status: "completed", date: "2024-11-20", start_time: "08:00", budget: 5000000, reach: 500000
│
├── id: 2, campaign_id: 1, title: "Post Facebook - Countdown teaser", type: "social",
│   status: "completed", date: "2024-11-22", start_time: "09:00", budget: 3000000, reach: 800000
│
├── id: 3, campaign_id: 1, title: "Instagram Story - Flash sale", type: "social",
│   status: "active", date: "2024-11-24", start_time: "10:00", budget: 2000000, reach: 300000
│
├── id: 4, campaign_id: 1, title: "TikTok Video - Unboxing deal", type: "content",
│   status: "scheduled", date: "2024-11-25", start_time: "18:00", budget: 8000000, reach: 1200000
│
└── id: 5, campaign_id: 1, title: "Thông báo chính thức - Black Friday bắt đầu", type: "announcement",
    status: "scheduled", date: "2024-11-24", start_time: "00:00", budget: 0, reach: 0

-- 4. Projects (Complex Activities)
project:
├── id: 10, title: "Google Ads Campaign - Black Friday", code: "PROJ-BF-001"
│   └── metadata: {"campaign_id": 1, "activity_type": "paid-ads", "budget": 500000000, "reach": 2000000}
│
├── id: 11, title: "Event Roadshow tại 5 TTTM", code: "PROJ-BF-002"
│   └── metadata: {"campaign_id": 1, "activity_type": "event", "budget": 300000000, "reach": 10000}
│
├── id: 12, title: "Content Creation - Black Friday", code: "PROJ-BF-003"
│   └── metadata: {"campaign_id": 1, "activity_type": "content", "budget": 150000000}
│
└── id: 13, title: "KOL/Influencer Campaign", code: "PROJ-BF-004"
    └── metadata: {"campaign_id": 1, "activity_type": "social", "budget": 200000000, "reach": 3000000}

-- 5. Campaign-Project Links
mkt_campaign_projects:
├── campaign_id: 1 → project_id: 10, role: "main"
├── campaign_id: 1 → project_id: 11, role: "main"
├── campaign_id: 1 → project_id: 12, role: "sub"
└── campaign_id: 1 → project_id: 13, role: "main"

-- 6. Tasks (in task system)
task:
├── id: 100, project_id: 10, title: "Setup Google Ads account"
│   └── metadata: {"campaign_id": 1, "activity_type": "paid-ads"}
│
├── id: 101, project_id: 10, title: "Tạo ad groups và keywords"
│   └── metadata: {"campaign_id": 1, "activity_type": "paid-ads"}
│
├── id: 102, project_id: 11, title: "Đặt chỗ tại 5 trung tâm thương mại"
│   └── metadata: {"campaign_id": 1, "activity_type": "event"}
│
└── id: 103, project_id: 12, title: "Thiết kế 20 banner"
    └── metadata: {"campaign_id": 1, "activity_type": "content"}
```

---

## Common Queries

### Get all activities (action milestones) for a campaign

```sql
SELECT 
  id,
  title,
  type,
  status,
  date,
  start_time,
  end_time,
  budget,
  reach,
  description
FROM mkt_campaign_activities
WHERE campaign_id = 1
  AND deleted_at IS NULL
ORDER BY date, start_time;
```

### Get all projects (complex activities) for a campaign

```sql
SELECT 
  p.id,
  p.title,
  p.code,
  p.status,
  p.start_date,
  p.end_date,
  cp.role,
  p.metadata->>'activity_type' as activity_type,
  (p.metadata->>'budget')::numeric as budget,
  (p.metadata->>'reach')::integer as reach
FROM mkt_campaign_projects cp
JOIN project p ON cp.project_id = p.id
WHERE cp.campaign_id = 1
  AND p.archived_at IS NULL
ORDER BY cp.role, p.start_date;
```

### Get all tasks for a campaign

```sql
SELECT 
  t.id,
  t.task_number,
  t.title,
  t.status,
  t.priority,
  t.assignee_id,
  t.due_date,
  p.title as project_title,
  p.code as project_code,
  t.metadata->>'activity_type' as activity_type
FROM mkt_campaign_projects cp
JOIN project p ON cp.project_id = p.id
JOIN task t ON t.project_id = p.id
WHERE cp.campaign_id = 1
  AND t.archived_at IS NULL
ORDER BY t.due_date, t.priority;
```

### Get campaign dashboard summary

```sql
SELECT 
  c.id,
  c.name,
  c.status,
  c.progress,
  c.budget,
  c.spent,
  c.reach,
  c.reach_goal,
  c.revenue,
  
  -- Goals
  (SELECT COUNT(*) FROM mkt_campaign_goals WHERE campaign_id = c.id) as goals_count,
  
  -- Activities (Action Milestones)
  (SELECT COUNT(*) FROM mkt_campaign_activities 
   WHERE campaign_id = c.id AND deleted_at IS NULL) as activities_count,
  
  -- Projects (Complex Activities)
  (SELECT COUNT(*) FROM mkt_campaign_projects cp
   JOIN project p ON cp.project_id = p.id
   WHERE cp.campaign_id = c.id AND p.archived_at IS NULL) as projects_count,
  
  -- Tasks
  (SELECT COUNT(*) FROM mkt_campaign_projects cp
   JOIN project p ON cp.project_id = p.id
   JOIN task t ON t.project_id = p.id
   WHERE cp.campaign_id = c.id AND t.archived_at IS NULL) as tasks_count,
  
  -- Completed tasks
  (SELECT COUNT(*) FROM mkt_campaign_projects cp
   JOIN project p ON cp.project_id = p.id
   JOIN task t ON t.project_id = p.id
   WHERE cp.campaign_id = c.id 
     AND t.status = 'done'
     AND t.archived_at IS NULL) as completed_tasks_count

FROM mkt_campaigns c
WHERE c.id = 1
  AND c.deleted_at IS NULL;
```

### Get campaign metrics aggregated from projects

```sql
SELECT 
  c.id,
  c.name,
  SUM((p.metadata->>'budget')::numeric) as total_project_budget,
  SUM((p.metadata->>'reach')::integer) as total_project_reach,
  COUNT(DISTINCT p.id) as project_count,
  COUNT(DISTINCT t.id) as task_count,
  COUNT(DISTINCT CASE WHEN t.status = 'done' THEN t.id END) as completed_task_count
FROM mkt_campaigns c
LEFT JOIN mkt_campaign_projects cp ON c.id = cp.campaign_id
LEFT JOIN project p ON cp.project_id = p.id AND p.archived_at IS NULL
LEFT JOIN task t ON t.project_id = p.id AND t.archived_at IS NULL
WHERE c.id = 1
GROUP BY c.id, c.name;
```

---

## Views (Recommended)

### View: Campaign Action Milestones (Simple Activities)

```sql
CREATE OR REPLACE VIEW v_campaign_action_milestones AS
SELECT 
  c.id as campaign_id,
  c.name as campaign_name,
  ca.id as activity_id,
  ca.title,
  ca.type,
  ca.status,
  ca.date,
  ca.start_time,
  ca.end_time,
  ca.duration,
  ca.budget,
  ca.reach,
  ca.description,
  ca.location,
  ca.created_at,
  ca.updated_at
FROM mkt_campaigns c
JOIN mkt_campaign_activities ca ON c.id = ca.campaign_id
WHERE c.deleted_at IS NULL
  AND ca.deleted_at IS NULL;
```

### View: Campaign Projects (Complex Activities)

```sql
CREATE OR REPLACE VIEW v_campaign_projects AS
SELECT 
  c.id as campaign_id,
  c.name as campaign_name,
  p.id as project_id,
  p.title as project_title,
  p.code as project_code,
  p.status as project_status,
  p.start_date as project_start_date,
  p.end_date as project_end_date,
  cp.role as project_role,
  p.metadata->>'activity_type' as activity_type,
  (p.metadata->>'budget')::numeric as budget,
  (p.metadata->>'reach')::integer as reach,
  p.owner_id,
  p.created_at,
  p.updated_at
FROM mkt_campaigns c
JOIN mkt_campaign_projects cp ON c.id = cp.campaign_id
JOIN project p ON cp.project_id = p.id
WHERE c.deleted_at IS NULL
  AND p.archived_at IS NULL;
```

### View: Campaign Tasks

```sql
CREATE OR REPLACE VIEW v_campaign_tasks AS
SELECT 
  c.id as campaign_id,
  c.name as campaign_name,
  p.id as project_id,
  p.title as project_title,
  t.id as task_id,
  t.task_number,
  t.title as task_title,
  t.status as task_status,
  t.priority,
  t.assignee_id,
  t.due_date,
  t.metadata->>'activity_type' as activity_type
FROM mkt_campaigns c
JOIN mkt_campaign_projects cp ON c.id = cp.campaign_id
JOIN project p ON cp.project_id = p.id
JOIN task t ON t.project_id = p.id
WHERE c.deleted_at IS NULL
  AND p.archived_at IS NULL
  AND t.archived_at IS NULL;
```

---

## Summary

### Tables
1. **mkt_campaigns** - Main campaign table
2. **mkt_campaign_goals** - Campaign goals and objectives
3. **mkt_campaign_activities** - Action milestones/events (simple activities, independent of projects/tasks)
4. **mkt_campaign_projects** - Junction table linking campaigns to projects (N:M) for complex activities

### Removed Tables
- ❌ **mkt_campaign_tasks** - Replaced by `task` table with metadata
- ❌ **mkt_campaign_metrics** - Can use `mkt_campaign_goals` or project metadata
- ❌ **mkt_campaign_files** - Use `project_repository` table

### Integration Points
- **Simple Activities**: Quick action milestones in `mkt_campaign_activities` (independent, no projects/tasks needed)
- **Complex Activities**: Managed as projects (via `mkt_campaign_projects`)
- **Tasks**: All campaign tasks are in `task` table (via `project_id` → `project` → `mkt_campaign_projects`)
- **Metadata**: Marketing-specific data stored in `project.metadata` and `task.metadata` JSONB fields

### When to Use What

| Use Case | Use Table | Example |
|----------|-----------|---------|
| Quick action, single step | `mkt_campaign_activities` | "Send email", "Post on Facebook", "Announcement" |
| Complex work, multiple steps | `mkt_campaign_projects` → `project` | "Google Ads Campaign", "Event Roadshow", "Content Creation" |
| Work items, assignments | `task` (via project) | "Design banner", "Write copy", "Setup tracking" |

### Key Features
- **Full Integration**: Leverages existing project and task system
- **Normalization**: No duplicate data structures
- **Flexibility**: JSONB metadata for marketing-specific fields
- **Scalability**: Can handle any number of projects and tasks per campaign
- **Multi-tenancy**: All tables support tenant isolation

### Design Benefits
1. **Single Source of Truth**: Projects and tasks managed in one place
2. **Feature Rich**: Full project/task features available (milestones, dependencies, comments, etc.)
3. **Consistency**: Same workflow for all projects, whether marketing or not
4. **Maintainability**: Less code to maintain, fewer tables to manage

---

## Migration Notes

### From Old Schema
If migrating from schema with `mkt_campaign_activities` and `mkt_campaign_tasks`:

1. **Activities → Projects:**
   ```sql
   -- Create projects from activities
   INSERT INTO project (tenant_id, title, code, status, start_date, end_date, metadata)
   SELECT 
     tenant_id,
     title,
     'PROJ-' || id::text,
     CASE status
       WHEN 'scheduled' THEN 'active'
       WHEN 'active' THEN 'active'
       WHEN 'completed' THEN 'completed'
       ELSE 'active'
     END,
     date,
     date + (duration || ' days')::interval,
     jsonb_build_object(
       'campaign_id', campaign_id,
       'activity_type', type,
       'budget', budget,
       'reach', reach
     )
   FROM mkt_campaign_activities;
   
   -- Link to campaigns
   INSERT INTO mkt_campaign_projects (campaign_id, project_id)
   SELECT campaign_id, id FROM project WHERE metadata->>'campaign_id' IS NOT NULL;
   ```

2. **Tasks → Task System:**
   ```sql
   -- Create tasks from campaign tasks
   INSERT INTO task (tenant_id, project_id, title, status, assignee_id, due_date, priority, metadata)
   SELECT 
     (SELECT tenant_id FROM mkt_campaigns WHERE id = ct.campaign_id),
     (SELECT project_id FROM mkt_campaign_projects WHERE campaign_id = ct.campaign_id LIMIT 1),
     ct.title,
     ct.status,
     ct.assignee_id,
     ct.due_date,
     ct.priority,
     jsonb_build_object('campaign_id', ct.campaign_id)
   FROM mkt_campaign_tasks ct;
   ```

---

## Relationships Diagram

```
mkt_campaigns (1)
    ├── mkt_campaign_goals (N)
    │
    ├── mkt_campaign_activities (N) [Action milestones - independent]
    │
    └── mkt_campaign_projects (N:M)
            │
            └── project (1)
                    ├── milestone (N)
                    ├── task (N)
                    │       ├── task_watcher (N)
                    │       ├── task_dependency (N)
                    │       ├── task_comment (N)
                    │       ├── task_attachment (N)
                    │       └── task_activity (N)
                    │
                    └── project_repository (N)
```

---

## Best Practices

1. **Activities vs Projects**: 
   - Use `mkt_campaign_activities` for simple, one-step actions (email, post, announcement)
   - Use `mkt_campaign_projects` for complex work requiring multiple tasks and coordination
   
2. **Project Metadata**: Always include `campaign_id` and `activity_type` in project metadata
3. **Task Metadata**: Include `campaign_id` in task metadata for easy filtering
4. **Project Codes**: Use consistent naming (e.g., PROJ-CAMP-001)
5. **Role Assignment**: Use `role` in `mkt_campaign_projects` to indicate project importance
6. **Views**: Use views (`v_campaign_action_milestones`, `v_campaign_projects`, `v_campaign_tasks`) for simplified queries
7. **Soft Deletes**: Always check `deleted_at` and `archived_at` in queries
8. **Activity Timeline**: Use `mkt_campaign_activities` for campaign timeline visualization

