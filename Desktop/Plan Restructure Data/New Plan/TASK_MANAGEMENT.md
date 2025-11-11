# Task Management System Documentation

## Overview
This document describes the task management system, including all related tables, relationships, and usage examples.

---

## Tables Structure

### 1. `project` - Project Management
Main table for organizing tasks into projects.

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| `id` | BIGSERIAL | PRIMARY KEY | Unique project identifier |
| `space_order` | INTEGER | DEFAULT 0 | Display order |
| `status_priority` | VARCHAR(256) | DEFAULT 'Neutral' | Priority level |
| `title` | VARCHAR(400) | NOT NULL | Project title |
| `team` | VARCHAR(256) | NOT NULL | Team name |
| `description` | VARCHAR(500) | NOT NULL | Project description |
| `request_admin` | VARCHAR(300) | NOT NULL | Admin requests |
| `target` | VARCHAR(800) | NOT NULL | Project targets |
| `owner_project_id` | BIGINT | DEFAULT 0 | Project owner (staff ID) |
| `total_member` | INTEGER | DEFAULT 0 | Total team members |
| `total_task` | INTEGER | DEFAULT 0 | Total tasks count |
| `total_task_completed` | INTEGER | DEFAULT 0 | Completed tasks count |
| `total_time` | INTEGER | DEFAULT 0 | Total time allocated |
| `total_time_task_completed` | INTEGER | DEFAULT 0 | Time spent on completed tasks |
| `status` | VARCHAR(256) | DEFAULT 'Active' | Project status |
| `start_time` | TIMESTAMP WITH TIME ZONE | NULL | Project start date |
| `end_time` | TIMESTAMP WITH TIME ZONE | NULL | Project end date |
| `is_continuous` | BOOLEAN | DEFAULT FALSE | Continuous project flag |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `completed_at` | TIMESTAMP WITH TIME ZONE | NULL | Completion timestamp |
| `project_type` | VARCHAR(256) | DEFAULT '' | Project type |

**Indexes:**
- Primary key on `id`
- Recommended: Index on `status` for filtering active projects
- Recommended: Index on `owner_project_id` for filtering by owner

---

### 2. `task` - Main Task Table
Core table for individual tasks.

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| `id` | BIGSERIAL | PRIMARY KEY | Unique task identifier |
| `repeat_key` | VARCHAR(100) | DEFAULT '' | Key linking to recurring task |
| `assignee_id` | BIGINT | FK → `staff.id`, DEFAULT 0 | Primary assignee |
| `assigned_by_id` | BIGINT | FK → `staff.id`, DEFAULT 0 | Person who assigned task |
| `project_id` | BIGINT | FK → `project.id`, DEFAULT 0 | Parent project |
| `team` | VARCHAR(256) | DEFAULT '' | Team name |
| `title` | VARCHAR(256) | NOT NULL | Task title |
| `details` | VARCHAR(700) | NOT NULL | Task details |
| `status` | VARCHAR(256) | DEFAULT '' | Task status |
| `deadline` | TIMESTAMP WITH TIME ZONE | NULL | Task deadline |
| `original_deadline` | TIMESTAMP WITH TIME ZONE | NULL | Original deadline (if changed) |
| `status_deadline` | VARCHAR(100) | DEFAULT '' | Deadline status |
| `order_id` | BIGINT | FK → `order.id`, DEFAULT 0 | Related order |
| `after_sales_link` | VARCHAR(100) | DEFAULT '' | After sales link |
| `customer_id` | BIGINT | FK → `customer.id`, DEFAULT 0 | Related customer |
| `order_in_project` | INTEGER | DEFAULT 0 | Display order in project |
| `order_in_assignee` | INTEGER | DEFAULT 0 | Display order for assignee |
| `admin_note` | VARCHAR(500) | NOT NULL | Admin notes |
| `is_note_confirmed` | BOOLEAN | DEFAULT TRUE | Note confirmation status |
| `note_by_user_id` | BIGINT | DEFAULT 0 | User who created note |
| `admin_note_date` | TIMESTAMP WITH TIME ZONE | NULL | Admin note timestamp |
| `deliverable_type` | VARCHAR(100) | DEFAULT '' | Type of deliverable |
| `deliverable_link` | VARCHAR(300) | DEFAULT '' | Link to deliverable |
| `deliverable_name` | VARCHAR(100) | NOT NULL | Deliverable name |
| `deliverable_review_status` | VARCHAR(100) | DEFAULT 'Neutral' | Review status |
| `self_review_deliverable` | VARCHAR(800) | DEFAULT '' | Self review text |
| `leader_review_deliverable` | VARCHAR(500) | DEFAULT '' | Leader review text |
| `review_by_id` | BIGINT | DEFAULT 0 | Reviewer ID |
| `total_comment` | INTEGER | DEFAULT 0 | Total comments count |
| `deliverable_submitted_at` | TIMESTAMP WITH TIME ZONE | NULL | Submission timestamp |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |
| `completed_at` | TIMESTAMP WITH TIME ZONE | NULL | Completion timestamp |

**Foreign Keys:**
- `assignee_id` → `staff(id)`
- `assigned_by_id` → `staff(id)`
- `project_id` → `project(id)`
- `order_id` → `order(id)`
- `customer_id` → `customer(id)`

**Indexes:**
- `idx_task_assignee` on `assignee_id` - For filtering by assignee
- `idx_task_project` on `project_id` - For filtering by project
- `idx_task_order` on `order_id` - For linking to orders
- `idx_task_customer` on `customer_id` - For linking to customers
- `idx_task_status` on `status` - For filtering by status (recommended)
- `idx_task_deadline` on `deadline` - For sorting by deadline (recommended)
- `idx_task_assignee_status` on `(assignee_id, status)` - Composite index for common queries (recommended)

---

### 3. `task_assignee` - Multiple Assignees Junction Table
Junction table for tasks with multiple assignees (normalized from comma-separated values).

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| `id` | BIGSERIAL | PRIMARY KEY | Unique identifier |
| `task_id` | BIGINT | FK → `task.id`, NOT NULL | Task reference |
| `staff_id` | BIGINT | FK → `staff.id`, NOT NULL | Additional assignee |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| UNIQUE(`task_id`, `staff_id`) | | | Prevents duplicate assignments |

**Foreign Keys:**
- `task_id` → `task(id)` ON DELETE CASCADE
- `staff_id` → `staff(id)` ON DELETE CASCADE

**Indexes:**
- `idx_task_assignee_task` on `task_id`
- `idx_task_assignee_staff` on `staff_id`

**Note:** This table stores additional assignees. The primary assignee is stored in `task.assignee_id`.

---

### 4. `recurring_task` - Recurring Task Templates
Template table for tasks that repeat on a schedule.

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| `id` | BIGSERIAL | PRIMARY KEY | Unique identifier |
| `assignee_id` | BIGINT | FK → `staff.id`, DEFAULT 0 | Primary assignee |
| `project_id` | BIGINT | FK → `project.id`, DEFAULT 0 | Parent project |
| `team` | VARCHAR(256) | DEFAULT '' | Team name |
| `title` | VARCHAR(256) | NOT NULL | Task title |
| `details` | VARCHAR(700) | NOT NULL | Task details |
| `frequency` | VARCHAR(100) | DEFAULT '' | Recurrence frequency |
| `day_repeat` | VARCHAR(300) | DEFAULT '' | Days to repeat |
| `time_zone` | VARCHAR(200) | DEFAULT 'Asia/Ho_Chi_Minh' | Timezone |
| `next_run` | TIMESTAMP WITH TIME ZONE | NULL | Next execution time |
| `processing_time` | INTEGER | DEFAULT 24 | Processing time in hours |
| `days_before_insert` | INTEGER | DEFAULT 7 | Days before deadline to create task |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

**Foreign Keys:**
- `assignee_id` → `staff(id)`
- `project_id` → `project(id)`

**Note:** The `ids_assignee` field (comma-separated) from the original schema is normalized into `task_assignee` junction table when recurring tasks create actual tasks.

---

### 5. `task_notification` - Task Notifications
Notifications related to tasks.

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| `id` | BIGSERIAL | PRIMARY KEY | Unique identifier |
| `assignee_id` | BIGINT | FK → `staff.id`, NOT NULL | Notification recipient |
| `created_by_id` | BIGINT | FK → `staff.id`, DEFAULT 0 | Notification creator |
| `task_id` | BIGINT | FK → `task.id`, NOT NULL | Related task |
| `type` | VARCHAR(256) | DEFAULT '' | Notification type |
| `title` | VARCHAR(256) | NOT NULL | Notification title |
| `details` | VARCHAR(800) | NOT NULL | Notification details |
| `is_read` | BOOLEAN | DEFAULT FALSE | Read status |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `read_at` | TIMESTAMP WITH TIME ZONE | NULL | Read timestamp |

**Foreign Keys:**
- `assignee_id` → `staff(id)`
- `created_by_id` → `staff(id)`
- `task_id` → `task(id)`

**Indexes:**
- `idx_task_notification_assignee` on `assignee_id`
- `idx_task_notification_task` on `task_id`

---

### 6. `task_conversation` - Task Comments/Conversations
Comments and conversations on tasks.

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| `id` | BIGSERIAL | PRIMARY KEY | Unique identifier |
| `task_id` | BIGINT | FK → `task.id`, NOT NULL | Related task |
| `sender_id` | BIGINT | FK → `staff.id`, NOT NULL | Message sender |
| `message` | VARCHAR(500) | NOT NULL | Message content |
| `created_at` | TIMESTAMP WITH TIME ZONE | NULL | Creation timestamp |

**Foreign Keys:**
- `task_id` → `task(id)`
- `sender_id` → `staff(id)`

**Indexes:**
- `idx_task_conversation_task` on `task_id`
- `idx_task_conversation_sender` on `sender_id`

---

### 7. `project_repository` - Project Files
Files and documents associated with projects.

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| `id` | BIGSERIAL | PRIMARY KEY | Unique identifier |
| `project_id` | BIGINT | FK → `project.id`, NOT NULL | Parent project |
| `file_link` | VARCHAR(500) | DEFAULT '' | File URL/link |
| `file_type` | VARCHAR(256) | DEFAULT '' | File type |
| `file_name` | VARCHAR(256) | DEFAULT '' | File name |
| `shared_by_id` | BIGINT | FK → `staff.id`, DEFAULT 0 | Person who shared file |
| `created_at` | TIMESTAMP WITH TIME ZONE | NULL | Creation timestamp |

**Foreign Keys:**
- `project_id` → `project(id)`
- `shared_by_id` → `staff(id)`

**Indexes:**
- `idx_project_repository_project` on `project_id`

---

## Relationships Diagram

```
project (1) ────< (many) task
                │
                ├───< (many) task_assignee ────> (many) staff
                │
                ├───< (many) task_notification
                │
                ├───< (many) task_conversation
                │
                └───< (many) order (optional)
                     └───< (many) customer (optional)

recurring_task ────> (creates) task (via repeat_key)
```

---

## Sample Data Examples

### Example 1: Simple Task with Single Assignee

#### Database Approach (Single Task)
```sql
-- Create a project
INSERT INTO project (id, title, team, description, status) VALUES
(1, 'Website Redesign', 'Design Team', 'Redesign company website', 'Active');

-- Create a task with single assignee
INSERT INTO task (id, assignee_id, project_id, title, details, status, deadline) VALUES
(1, 101, 1, 'Create homepage mockup', 'Design new homepage layout', 'in_progress', '2024-02-15 18:00:00+00');

-- Query task with assignee (Database JOIN - best for single record)
SELECT 
    t.id,
    t.title,
    t.status,
    t.deadline,
    s.full_name as assignee,
    p.title as project
FROM task t
JOIN staff s ON t.assignee_id = s.id
JOIN project p ON t.project_id = p.id
WHERE t.id = 1;

-- Result:
-- id | title                | status      | deadline              | assignee    | project
-- 1  | Create homepage mockup | in_progress | 2024-02-15 18:00:00+00 | John Doe    | Website Redesign
```

#### Backend Approach (Single Task)
```javascript
// Backend code
async function getTaskDetail(taskId) {
    // Database JOIN for single task (fastest)
    const result = await db.query(`
        SELECT 
            t.*,
            s.full_name as assignee,
            s.email as assignee_email,
            p.title as project
        FROM task t
        JOIN staff s ON t.assignee_id = s.id
        JOIN project p ON t.project_id = p.id
        WHERE t.id = $1
    `, [taskId]);
    
    return result[0];
}
```

---

### Example 2: Task with Multiple Assignees

#### Database Approach
```sql
-- Create task with primary assignee
INSERT INTO task (id, assignee_id, project_id, title, details, status) VALUES
(2, 101, 1, 'Review design system', 'Review and approve design system', 'pending');

-- Add additional assignees via junction table
INSERT INTO task_assignee (task_id, staff_id) VALUES
(2, 102),  -- Jane Smith
(2, 103),  -- Bob Wilson
(2, 104);  -- Alice Brown

-- Query all assignees (primary + additional)
SELECT 
    t.id,
    t.title,
    s_primary.full_name as primary_assignee,
    s_additional.full_name as additional_assignee
FROM task t
JOIN staff s_primary ON t.assignee_id = s_primary.id
LEFT JOIN task_assignee ta ON t.id = ta.task_id
LEFT JOIN staff s_additional ON ta.staff_id = s_additional.id
WHERE t.id = 2;
```

#### Backend Approach (Recommended)
```javascript
// Backend code - More efficient for multiple assignees
async function getTaskWithAllAssignees(taskId) {
    // Query 1: Get task
    const [task] = await db.query('SELECT * FROM task WHERE id = $1', [taskId]);
    
    if (!task) return null;

    // Query 2: Get additional assignees
    const additionalAssignees = await db.query(`
        SELECT ta.staff_id, s.full_name, s.email
        FROM task_assignee ta
        JOIN staff s ON ta.staff_id = s.id
        WHERE ta.task_id = $1
    `, [taskId]);

    // Combine with cached primary assignee
    const primaryAssignee = cache.getStaff(task.assignee_id);
    const project = cache.getProject(task.project_id);

    return {
        ...task,
        assignee: { ...primaryAssignee, is_primary: true },
        additional_assignees: additionalAssignees.map(a => ({ ...a, is_primary: false })),
        all_assignees: [
            { id: task.assignee_id, ...primaryAssignee, is_primary: true },
            ...additionalAssignees.map(a => ({ ...a, is_primary: false }))
        ],
        project
    };
}
```

---

### Example 3: Recurring Task Creating Tasks

```sql
-- Create recurring task template
INSERT INTO recurring_task (
    id, assignee_id, project_id, title, details, 
    frequency, day_repeat, next_run, days_before_insert
) VALUES (
    1, 101, 1, 'Weekly team standup', 'Daily standup meeting',
    'weekly', 'Monday,Wednesday,Friday', '2024-02-12 09:00:00+00', 1
);

-- When recurring task executes, it creates a task:
INSERT INTO task (
    id, repeat_key, assignee_id, project_id, title, details, 
    status, deadline
) VALUES (
    10, 'recurring_1', 101, 1, 'Weekly team standup', 
    'Daily standup meeting', 'pending', '2024-02-12 09:00:00+00'
);

-- If recurring task had multiple assignees (ids_assignee = "102,103,104"),
-- they would be normalized into task_assignee:
INSERT INTO task_assignee (task_id, staff_id) VALUES
(10, 102),
(10, 103),
(10, 104);
```

---

### Example 4: Task with Notifications and Conversations

```sql
-- Create task
INSERT INTO task (id, assignee_id, project_id, title, status) VALUES
(3, 101, 1, 'Fix bug in checkout', 'in_progress');

-- Create notification for assignee
INSERT INTO task_notification (
    assignee_id, created_by_id, task_id, type, title, details
) VALUES (
    101, 105, 3, 'assignment', 'New task assigned', 
    'You have been assigned to: Fix bug in checkout'
);

-- Add conversation/comment
INSERT INTO task_conversation (task_id, sender_id, message) VALUES
(3, 101, 'I found the issue, working on fix'),
(3, 105, 'Great! Let me know when ready for review'),
(3, 101, 'Fixed! Ready for testing');

-- Query task with notifications and conversations
SELECT 
    t.id,
    t.title,
    COUNT(DISTINCT tn.id) as notification_count,
    COUNT(DISTINCT tc.id) as conversation_count
FROM task t
LEFT JOIN task_notification tn ON t.id = tn.task_id
LEFT JOIN task_conversation tc ON t.id = tc.task_id
WHERE t.id = 3
GROUP BY t.id, t.title;

-- Result:
-- id | title              | notification_count | conversation_count
-- 3  | Fix bug in checkout | 1                  | 3
```

---

### Example 5: Task Linked to Order and Customer

```sql
-- Create task related to an order
INSERT INTO task (
    id, assignee_id, order_id, customer_id, title, 
    details, status, after_sales_link
) VALUES (
    4, 101, 12345, 567, 'Follow up on order', 
    'Customer requested status update', 'pending', '/after-sales/12345'
);

-- Query task with order and customer info
SELECT 
    t.id,
    t.title,
    t.status,
    o.order_number,
    c.full_name as customer_name,
    c.email as customer_email,
    s.full_name as assignee
FROM task t
JOIN "order" o ON t.order_id = o.id
JOIN customer c ON t.customer_id = c.id
JOIN staff s ON t.assignee_id = s.id
WHERE t.id = 4;

-- Result:
-- id | title              | status  | order_number | customer_name | customer_email      | assignee
-- 4  | Follow up on order | pending | ORD-12345     | Jane Customer | jane@example.com   | John Doe
```

---

### Example 6: Project with Multiple Tasks

#### Database Approach
```sql
-- Create project
INSERT INTO project (id, title, team, status, total_task) VALUES
(2, 'Q1 Marketing Campaign', 'Marketing Team', 'Active', 5);

-- Create multiple tasks for the project
INSERT INTO task (id, project_id, assignee_id, title, status, order_in_project) VALUES
(5, 2, 201, 'Create campaign brief', 'completed', 1),
(6, 2, 202, 'Design social media posts', 'in_progress', 2),
(7, 2, 203, 'Write blog content', 'pending', 3),
(8, 2, 204, 'Schedule posts', 'pending', 4),
(9, 2, 205, 'Analyze results', 'pending', 5);

-- Query project with all tasks
SELECT 
    p.id as project_id,
    p.title as project_title,
    p.total_task,
    COUNT(t.id) as actual_task_count,
    COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed_count,
    COUNT(CASE WHEN t.status = 'in_progress' THEN 1 END) as in_progress_count,
    COUNT(CASE WHEN t.status = 'pending' THEN 1 END) as pending_count
FROM project p
LEFT JOIN task t ON p.id = t.project_id
WHERE p.id = 2
GROUP BY p.id, p.title, p.total_task;
```

#### Backend Approach (Recommended for Pagination)
```javascript
// Backend code - Better for large projects
async function getProjectWithTasks(projectId, page = 1, limit = 50) {
    // Query 1: Get project (from cache if available)
    const project = cache.getProject(projectId) || 
        await db.query('SELECT * FROM project WHERE id = $1', [projectId])[0];

    // Query 2: Get tasks with pagination
    const tasks = await db.query(`
        SELECT * FROM task
        WHERE project_id = $1
        ORDER BY order_in_project ASC, created_at DESC
        LIMIT $2 OFFSET $3
    `, [projectId, limit, (page - 1) * limit]);

    // Query 3: Get task counts
    const counts = await db.query(`
        SELECT 
            status,
            COUNT(*) as count
        FROM task
        WHERE project_id = $1
        GROUP BY status
    `, [projectId]);

    // Backend JOIN with cache
    const tasksWithDetails = tasks.map(task => ({
        ...task,
        assignee: cache.getStaff(task.assignee_id),
        project: project
    }));

    return {
        project,
        tasks: tasksWithDetails,
        counts: counts.reduce((acc, row) => {
            acc[row.status] = parseInt(row.count);
            return acc;
        }, {}),
        pagination: {
            page,
            limit,
            total: project.total_task
        }
    };
}
```

---

### Example 7: Task with Deliverables and Reviews

```sql
-- Create task with deliverable
INSERT INTO task (
    id, assignee_id, project_id, title, status,
    deliverable_type, deliverable_link, deliverable_name,
    deliverable_review_status
) VALUES (
    10, 301, 3, 'Create API documentation', 'pending',
    'document', 'https://docs.example.com/api', 'API_Documentation_v1.pdf',
    'Neutral'
);

-- Submit deliverable
UPDATE task 
SET 
    deliverable_submitted_at = CURRENT_TIMESTAMP,
    status = 'submitted'
WHERE id = 10;

-- Add self review
UPDATE task 
SET 
    self_review_deliverable = 'Documentation covers all endpoints with examples',
    deliverable_review_status = 'Pending Review'
WHERE id = 10;

-- Leader reviews
UPDATE task 
SET 
    leader_review_deliverable = 'Good work! Minor formatting improvements needed',
    review_by_id = 305,
    deliverable_review_status = 'Approved with Changes',
    status = 'in_review'
WHERE id = 10;

-- Query task with deliverable info
SELECT 
    t.id,
    t.title,
    t.deliverable_name,
    t.deliverable_review_status,
    t.self_review_deliverable,
    t.leader_review_deliverable,
    s_reviewer.full_name as reviewer,
    t.deliverable_submitted_at
FROM task t
LEFT JOIN staff s_reviewer ON t.review_by_id = s_reviewer.id
WHERE t.id = 10;

-- Result:
-- id | title                  | deliverable_name      | deliverable_review_status | self_review_deliverable                    | leader_review_deliverable              | reviewer   | deliverable_submitted_at
-- 10 | Create API documentation | API_Documentation_v1.pdf | Approved with Changes    | Documentation covers all endpoints...     | Good work! Minor formatting needed...  | Manager    | 2024-02-10 14:30:00+00
```

---

## Common Queries

### Get All Tasks for a Staff Member

#### Database Approach
```sql
-- Get all tasks assigned to a staff member (primary + additional)
SELECT 
    t.id,
    t.title,
    t.status,
    t.deadline,
    p.title as project,
    CASE 
        WHEN t.assignee_id = 101 THEN 'Primary'
        ELSE 'Additional'
    END as assignment_type
FROM task t
LEFT JOIN project p ON t.project_id = p.id
WHERE t.assignee_id = 101
   OR t.id IN (
       SELECT task_id 
       FROM task_assignee 
       WHERE staff_id = 101
   )
ORDER BY t.deadline NULLS LAST;
```

#### Backend Approach (Recommended)
```javascript
// Backend code - More efficient with pagination
async function getTasksByStaff(staffId, filters = {}, page = 1, limit = 50) {
    // Query 1: Get primary assigned tasks
    const primaryTasks = await db.query(`
        SELECT * FROM task
        WHERE assignee_id = $1
        ${filters.status ? `AND status = $2` : ''}
        ORDER BY deadline NULLS LAST, created_at DESC
        LIMIT $${filters.status ? 3 : 2} OFFSET $${filters.status ? 4 : 3}
    `, filters.status 
        ? [staffId, filters.status, limit, (page - 1) * limit]
        : [staffId, limit, (page - 1) * limit]
    );

    // Query 2: Get additional assigned tasks
    const additionalTaskIds = await db.query(`
        SELECT task_id FROM task_assignee
        WHERE staff_id = $1
    `, [staffId]);

    const additionalTasks = additionalTaskIds.length > 0
        ? await db.query(`
            SELECT * FROM task
            WHERE id = ANY($1::bigint[])
            ${filters.status ? `AND status = $2` : ''}
            ORDER BY deadline NULLS LAST, created_at DESC
        `, filters.status 
            ? [additionalTaskIds.map(t => t.task_id), filters.status]
            : [additionalTaskIds.map(t => t.task_id)]
        )
        : [];

    // Combine and deduplicate
    const allTasks = [...primaryTasks, ...additionalTasks]
        .filter((task, index, self) => 
            index === self.findIndex(t => t.id === task.id)
        )
        .sort((a, b) => {
            if (!a.deadline) return 1;
            if (!b.deadline) return -1;
            return new Date(a.deadline) - new Date(b.deadline);
        });

    // Backend JOIN with cache
    return allTasks.map(task => ({
        ...task,
        assignee: cache.getStaff(task.assignee_id),
        project: cache.getProject(task.project_id),
        assignment_type: task.assignee_id === staffId ? 'Primary' : 'Additional'
    }));
}
```

### Get Tasks by Status

```sql
SELECT 
    status,
    COUNT(*) as task_count,
    COUNT(CASE WHEN deadline < CURRENT_TIMESTAMP AND status != 'completed' THEN 1 END) as overdue_count
FROM task
GROUP BY status
ORDER BY task_count DESC;
```

### Get Project Progress

```sql
SELECT 
    p.id,
    p.title,
    p.total_task,
    COUNT(t.id) as actual_tasks,
    COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed_tasks,
    ROUND(
        COUNT(CASE WHEN t.status = 'completed' THEN 1 END)::NUMERIC / 
        NULLIF(COUNT(t.id), 0) * 100, 
        2
    ) as completion_percentage
FROM project p
LEFT JOIN task t ON p.id = t.project_id
WHERE p.status = 'Active'
GROUP BY p.id, p.title, p.total_task
ORDER BY completion_percentage DESC;
```

### Get Unread Notifications for Staff

```sql
SELECT 
    tn.id,
    tn.title,
    tn.details,
    tn.type,
    t.title as task_title,
    tn.created_at
FROM task_notification tn
JOIN task t ON tn.task_id = t.id
WHERE tn.assignee_id = 101
  AND tn.is_read = FALSE
ORDER BY tn.created_at DESC;
```

### Get Task Conversation Thread

```sql
SELECT 
    tc.id,
    tc.message,
    s.full_name as sender,
    tc.created_at
FROM task_conversation tc
JOIN staff s ON tc.sender_id = s.id
WHERE tc.task_id = 3
ORDER BY tc.created_at ASC;
```

---

## Backend Join Approach (Recommended)

### Overview
For CRM task management with pagination and frequent queries, **Backend Join + Caching** is the recommended approach.

### Why Backend Join?
- **Staff and Projects change rarely** → Perfect for caching
- **Tasks change frequently** → Query fresh data only
- **Pagination is common** → Reduce data transfer
- **Better scalability** → Parallel queries possible

### Implementation Strategy

#### 1. Caching Layer Setup

```javascript
// Cache service for reference data
class ReferenceCache {
    constructor() {
        this.staff = new Map();
        this.projects = new Map();
        this.lastRefresh = null;
        this.refreshInterval = 5 * 60 * 1000; // 5 minutes
    }

    async init() {
        await this.refresh();
        // Auto-refresh every 5 minutes
        setInterval(() => this.refresh(), this.refreshInterval);
    }

    async refresh() {
        const [staff, projects] = await Promise.all([
            db.query('SELECT id, full_name, email FROM staff WHERE work_status = $1', ['active']),
            db.query('SELECT id, title, status FROM project WHERE status = $1', ['Active'])
        ]);

        this.staff = new Map(staff.map(s => [s.id, s]));
        this.projects = new Map(projects.map(p => [p.id, p]));
        this.lastRefresh = new Date();
    }

    getStaff(id) {
        return this.staff.get(id);
    }

    getProject(id) {
        return this.projects.get(id);
    }
}

const cache = new ReferenceCache();
```

#### 2. Query Patterns

**Pattern 1: Single Task Detail (Use Database JOIN)**
```javascript
// For single task: Database JOIN is fastest
async function getTaskDetail(taskId) {
    return await db.query(`
        SELECT 
            t.*,
            s.full_name as assignee,
            s.email as assignee_email,
            p.title as project
        FROM task t
        JOIN staff s ON t.assignee_id = s.id
        JOIN project p ON t.project_id = p.id
        WHERE t.id = $1
    `, [taskId]);
}
```

**Pattern 2: List Tasks with Pagination (Use Backend JOIN)**
```javascript
// For paginated lists: Backend JOIN + Cache
async function listTasks(filters = {}, page = 1, limit = 50) {
    // Build WHERE clause
    const conditions = [];
    const params = [];
    let paramIndex = 1;

    if (filters.status) {
        conditions.push(`t.status = $${paramIndex++}`);
        params.push(filters.status);
    }
    if (filters.assignee_id) {
        conditions.push(`t.assignee_id = $${paramIndex++}`);
        params.push(filters.assignee_id);
    }
    if (filters.project_id) {
        conditions.push(`t.project_id = $${paramIndex++}`);
        params.push(filters.project_id);
    }

    const whereClause = conditions.length > 0 
        ? `WHERE ${conditions.join(' AND ')}` 
        : '';

    // Query 1: Get tasks only (fresh data)
    const tasks = await db.query(`
        SELECT 
            t.*,
            t.assignee_id,
            t.project_id
        FROM task t
        ${whereClause}
        ORDER BY t.created_at DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `, [...params, limit, (page - 1) * limit]);

    // Backend JOIN with cached data
    return tasks.map(task => ({
        ...task,
        assignee: cache.getStaff(task.assignee_id),
        project: cache.getProject(task.project_id)
    }));
}
```

**Pattern 3: Tasks with Multiple Assignees**
```javascript
async function getTaskWithAllAssignees(taskId) {
    // Query 1: Get task
    const [task] = await db.query('SELECT * FROM task WHERE id = $1', [taskId]);
    
    if (!task) return null;

    // Query 2: Get additional assignees
    const additionalAssignees = await db.query(`
        SELECT ta.staff_id, s.full_name, s.email
        FROM task_assignee ta
        JOIN staff s ON ta.staff_id = s.id
        WHERE ta.task_id = $1
    `, [taskId]);

    // Combine primary + additional assignees
    const primaryAssignee = cache.getStaff(task.assignee_id);
    const allAssignees = [
        { id: task.assignee_id, ...primaryAssignee, is_primary: true },
        ...additionalAssignees.map(a => ({ ...a, is_primary: false }))
    ];

    return {
        ...task,
        assignees: allAssignees,
        project: cache.getProject(task.project_id)
    };
}
```

**Pattern 4: Dashboard/Reports (Backend JOIN)**
```javascript
async function getTaskDashboard(assigneeId) {
    // Query 1: Get task counts
    const counts = await db.query(`
        SELECT 
            status,
            COUNT(*) as count
        FROM task
        WHERE assignee_id = $1
        GROUP BY status
    `, [assigneeId]);

    // Query 2: Get recent tasks
    const recentTasks = await db.query(`
        SELECT * FROM task
        WHERE assignee_id = $1
        ORDER BY updated_at DESC
        LIMIT 10
    `, [assigneeId]);

    // Backend JOIN with cache
    const tasksWithDetails = recentTasks.map(task => ({
        ...task,
        assignee: cache.getStaff(task.assignee_id),
        project: cache.getProject(task.project_id)
    }));

    return {
        counts,
        recentTasks: tasksWithDetails
    };
}
```

#### 3. Cache Invalidation

```javascript
// Invalidate cache when staff/project changes
async function updateStaff(staffId, data) {
    await db.query('UPDATE staff SET ... WHERE id = $1', [staffId]);
    await cache.refresh(); // Refresh cache
}

async function updateProject(projectId, data) {
    await db.query('UPDATE project SET ... WHERE id = $1', [projectId]);
    await cache.refresh(); // Refresh cache
}
```

### Performance Comparison

| Query Type | Records | Database JOIN | Backend JOIN + Cache | Winner |
|------------|---------|---------------|---------------------|--------|
| Single task | 1 | ~1ms | ~2ms | Database JOIN |
| List (50/page) | 50 | ~5ms | ~3ms | **Backend JOIN** |
| List (100/page) | 100 | ~10ms | ~5ms | **Backend JOIN** |
| Dashboard | 200+ | ~50ms | ~20ms | **Backend JOIN** |
| Filtered list | 20-100 | ~5ms | ~4ms | Backend JOIN |

### Best Practices for Backend Join

1. **Cache Reference Data:**
   - Staff (changes rarely)
   - Projects (changes rarely)
   - Categories, Statuses (static data)

2. **Query Fresh Data:**
   - Tasks (changes frequently)
   - Notifications (real-time)
   - Conversations (real-time)

3. **Use Database JOIN for:**
   - Single record lookups
   - Small result sets (< 20 records)
   - Complex filtering/ordering

4. **Use Backend JOIN for:**
   - Paginated lists
   - Large result sets (> 50 records)
   - Dashboard/reports
   - Frequent queries

5. **Cache Strategy:**
   - Refresh interval: 5 minutes
   - Invalidate on updates
   - Use Redis for distributed systems
   - Monitor cache hit rate

## Best Practices

1. **Single vs Multiple Assignees:**
   - Use `task.assignee_id` for the primary assignee
   - Use `task_assignee` junction table for additional assignees
   - Always have at least one assignee (primary)

2. **Task Status Workflow:**
   - `pending` → `in_progress` → `submitted` → `in_review` → `completed`
   - Track status changes in `updated_at` timestamp

3. **Recurring Tasks:**
   - Create template in `recurring_task`
   - System creates actual tasks based on `next_run` schedule
   - Link via `task.repeat_key` to track origin

4. **Notifications:**
   - Create notification when task is assigned
   - Mark as read when user views notification
   - Track read status for analytics

5. **Deliverables:**
   - Submit deliverable updates `deliverable_submitted_at`
   - Self review before submission
   - Leader review after submission
   - Update `deliverable_review_status` accordingly

6. **Query Optimization:**
   - Use Database JOIN for single records
   - Use Backend JOIN + Cache for paginated lists
   - Cache reference data (staff, projects)
   - Query fresh data (tasks) directly
   - Monitor and optimize slow queries

---

## Migration Notes

### From Original Schema

**Original:** `db_task_space`
- `id_assignee` → `task.assignee_id`
- `assignee_by` → `task.assigned_by_id`
- `id_project` → `task.project_id`
- `id_order` → `task.order_id`
- `id_customer` → `task.customer_id`
- `date_created` → `task.created_at`
- `date_updated` → `task.updated_at`
- `date_completed` → `task.completed_at`

**Original:** `db_task_repeat_space`
- `ids_assignee` (comma-separated) → Normalized into `task_assignee` junction table
- `id_assignee` → `recurring_task.assignee_id`

**Normalization:**
- Comma-separated `ids_assignee` values are split and stored in `task_assignee` table
- Each assignee gets a separate row in the junction table
- Maintains referential integrity with foreign keys

---

## Summary

The task management system consists of 7 main tables:
1. **project** - Organizes tasks into projects
2. **task** - Core task entity with primary assignee
3. **task_assignee** - Junction table for multiple assignees
4. **recurring_task** - Templates for repeating tasks
5. **task_notification** - Notifications for task events
6. **task_conversation** - Comments and discussions
7. **project_repository** - Files and documents

The system supports:
- Single and multiple assignees
- Task linking to orders and customers
- Deliverable management with reviews
- Recurring task automation
- Notifications and conversations
- Project organization and tracking

