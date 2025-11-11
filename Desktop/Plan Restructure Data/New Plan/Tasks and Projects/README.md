# Tasks and Projects Department

This folder contains documentation and code related to task and project management.

## Tables

- `project` - Projects
- `task` - Tasks
- `task_assignee` - Task assignees junction table
- `recurring_task` - Recurring task templates
- `task_notification` - Task notifications
- `task_conversation` - Task conversations
- `project_repository` - Project files

## Responsibilities

- Project management
- Task assignment and tracking
- Recurring tasks
- Task notifications
- Project files management

## Related Files

- Schema: `NEW_SCHEMA_STRUCTURE.md` - Section 6: TASKS & PROJECTS DEPARTMENT
- Documentation: `TASK_MANAGEMENT.md` - Complete task management guide
- Migrations: `migrations/001_schema_standardization.sql` - Task tables

## Implementation

- Use Backend Join approach for paginated task lists
- Cache staff and projects for performance
- Use Database JOIN for single task lookups

