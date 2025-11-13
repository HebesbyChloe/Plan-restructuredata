-- ============================================================================
-- Tasks & Projects Domain Module
-- ============================================================================
-- This migration creates tables for project management and task system
-- Dependencies: sys_tenants, sys_users (001_system_tenant.sql)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. project
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS project (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    title VARCHAR(400) NOT NULL DEFAULT '',
    description TEXT NULL,
    code VARCHAR(50) NOT NULL,
    owner_id BIGINT NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    visibility VARCHAR(50) NOT NULL DEFAULT 'private',
    start_date TIMESTAMPTZ NULL,
    end_date TIMESTAMPTZ NULL,
    is_continuous BOOLEAN NOT NULL DEFAULT FALSE,
    created_by_id BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ NULL,
    archived_at TIMESTAMPTZ NULL,
    metadata JSONB DEFAULT NULL,
    
    CONSTRAINT chk_project_status CHECK (status IN ('active', 'on_hold', 'completed', 'archived')),
    CONSTRAINT chk_project_visibility CHECK (visibility IN ('private', 'team', 'public')),
    CONSTRAINT chk_project_dates CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date),
    CONSTRAINT uq_project_tenant_code UNIQUE (tenant_id, code)
);

COMMENT ON TABLE project IS 'Project management with enhanced features - renamed from db_project_space';
COMMENT ON COLUMN project.id IS 'Auto-incrementing primary key';
COMMENT ON COLUMN project.tenant_id IS 'Multi-tenancy support';
COMMENT ON COLUMN project.code IS 'Project code/identifier (e.g., PROJ-001)';
COMMENT ON COLUMN project.status IS 'Enum: active, on_hold, completed, archived';
COMMENT ON COLUMN project.visibility IS 'Enum: private, team, public';
COMMENT ON COLUMN project.metadata IS 'Flexible metadata (JSONB) for marketing-specific data, etc.';

-- Foreign Keys
ALTER TABLE project 
    ADD CONSTRAINT fk_project_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;
    
ALTER TABLE project 
    ADD CONSTRAINT fk_project_owner_id 
    FOREIGN KEY (owner_id) REFERENCES sys_users(id) ON DELETE SET DEFAULT;
    
ALTER TABLE project 
    ADD CONSTRAINT fk_project_created_by_id 
    FOREIGN KEY (created_by_id) REFERENCES sys_users(id) ON DELETE SET DEFAULT;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_project_tenant ON project(tenant_id);
CREATE INDEX IF NOT EXISTS idx_project_code_tenant ON project(tenant_id, code);
CREATE INDEX IF NOT EXISTS idx_project_owner ON project(owner_id);
CREATE INDEX IF NOT EXISTS idx_project_status ON project(status);
CREATE INDEX IF NOT EXISTS idx_project_created_by ON project(created_by_id);
CREATE INDEX IF NOT EXISTS idx_project_tenant_status ON project(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_project_dates ON project(start_date, end_date);

-- ----------------------------------------------------------------------------
-- 2. milestone
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS milestone (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    project_id BIGINT NOT NULL,
    title VARCHAR(256) NOT NULL DEFAULT '',
    description TEXT NULL,
    target_date TIMESTAMPTZ NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ NULL,
    
    CONSTRAINT chk_milestone_status CHECK (status IN ('pending', 'in_progress', 'completed'))
);

COMMENT ON TABLE milestone IS 'Project milestones for better organization';
COMMENT ON COLUMN milestone.status IS 'Enum: pending, in_progress, completed';

-- Foreign Keys
ALTER TABLE milestone 
    ADD CONSTRAINT fk_milestone_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;
    
ALTER TABLE milestone 
    ADD CONSTRAINT fk_milestone_project_id 
    FOREIGN KEY (project_id) REFERENCES project(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_milestone_tenant ON milestone(tenant_id);
CREATE INDEX IF NOT EXISTS idx_milestone_project ON milestone(project_id);
CREATE INDEX IF NOT EXISTS idx_milestone_status ON milestone(status);
CREATE INDEX IF NOT EXISTS idx_milestone_tenant_project ON milestone(tenant_id, project_id);
CREATE INDEX IF NOT EXISTS idx_milestone_target_date ON milestone(target_date);

-- ----------------------------------------------------------------------------
-- 3. task
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS task (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    task_number VARCHAR(50) NOT NULL,
    parent_task_id BIGINT NULL,
    project_id BIGINT NOT NULL DEFAULT 0,
    milestone_id BIGINT NULL,
    title VARCHAR(500) NOT NULL DEFAULT '',
    description TEXT NULL,
    task_type VARCHAR(50) NOT NULL DEFAULT 'task',
    status VARCHAR(50) NOT NULL DEFAULT 'todo',
    priority VARCHAR(20) NOT NULL DEFAULT 'medium',
    assignee_id BIGINT NULL,
    assigned_by_id BIGINT NULL,
    created_by_id BIGINT NOT NULL DEFAULT 0,
    start_date TIMESTAMPTZ NULL,
    due_date TIMESTAMPTZ NULL,
    original_due_date TIMESTAMPTZ NULL,
    estimated_hours DECIMAL(10,2) NULL,
    actual_hours DECIMAL(10,2) NULL,
    position INTEGER NOT NULL DEFAULT 0,
    metadata JSONB DEFAULT NULL,
    recurring_task_id BIGINT NULL,
    repeat_key VARCHAR(100) NOT NULL DEFAULT '',
    reviewed_by_id BIGINT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMPTZ NULL,
    completed_at TIMESTAMPTZ NULL,
    archived_at TIMESTAMPTZ NULL,
    
    CONSTRAINT chk_task_type CHECK (task_type IN ('task', 'bug', 'feature', 'epic', 'story')),
    CONSTRAINT chk_task_status CHECK (status IN ('todo', 'in_progress', 'in_review', 'done', 'cancelled')),
    CONSTRAINT chk_task_priority CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    CONSTRAINT chk_task_estimated_hours CHECK (estimated_hours IS NULL OR estimated_hours >= 0),
    CONSTRAINT chk_task_actual_hours CHECK (actual_hours IS NULL OR actual_hours >= 0),
    CONSTRAINT chk_task_dates CHECK (due_date IS NULL OR start_date IS NULL OR due_date >= start_date),
    CONSTRAINT chk_task_completion CHECK (completed_at IS NULL OR started_at IS NULL OR completed_at >= started_at),
    CONSTRAINT uq_task_tenant_number UNIQUE (tenant_id, task_number)
);

COMMENT ON TABLE task IS 'Enhanced task management with enterprise features - renamed from db_task_space';
COMMENT ON COLUMN task.task_number IS 'Task identifier (e.g., TASK-123)';
COMMENT ON COLUMN task.parent_task_id IS 'For subtasks hierarchy';
COMMENT ON COLUMN task.task_type IS 'Enum: task, bug, feature, epic, story';
COMMENT ON COLUMN task.status IS 'Enum: todo, in_progress, in_review, done, cancelled';
COMMENT ON COLUMN task.priority IS 'Enum: low, medium, high, critical';
COMMENT ON COLUMN task.metadata IS 'Flexible metadata (order_id, customer_id, campaign_id, etc.)';

-- Foreign Keys
ALTER TABLE task 
    ADD CONSTRAINT fk_task_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;
    
ALTER TABLE task 
    ADD CONSTRAINT fk_task_parent_task_id 
    FOREIGN KEY (parent_task_id) REFERENCES task(id) ON DELETE SET NULL;
    
ALTER TABLE task 
    ADD CONSTRAINT fk_task_project_id 
    FOREIGN KEY (project_id) REFERENCES project(id) ON DELETE SET DEFAULT;
    
ALTER TABLE task 
    ADD CONSTRAINT fk_task_milestone_id 
    FOREIGN KEY (milestone_id) REFERENCES milestone(id) ON DELETE SET NULL;
    
ALTER TABLE task 
    ADD CONSTRAINT fk_task_assignee_id 
    FOREIGN KEY (assignee_id) REFERENCES sys_users(id) ON DELETE SET NULL;
    
ALTER TABLE task 
    ADD CONSTRAINT fk_task_assigned_by_id 
    FOREIGN KEY (assigned_by_id) REFERENCES sys_users(id) ON DELETE SET NULL;
    
ALTER TABLE task 
    ADD CONSTRAINT fk_task_created_by_id 
    FOREIGN KEY (created_by_id) REFERENCES sys_users(id) ON DELETE SET DEFAULT;
    
ALTER TABLE task 
    ADD CONSTRAINT fk_task_reviewed_by_id 
    FOREIGN KEY (reviewed_by_id) REFERENCES sys_users(id) ON DELETE SET NULL;

-- Note: recurring_task_id FK will be added after recurring_task table is created

-- Indexes
CREATE INDEX IF NOT EXISTS idx_task_tenant ON task(tenant_id);
CREATE INDEX IF NOT EXISTS idx_task_number_tenant ON task(tenant_id, task_number);
CREATE INDEX IF NOT EXISTS idx_task_parent ON task(parent_task_id);
CREATE INDEX IF NOT EXISTS idx_task_project ON task(project_id);
CREATE INDEX IF NOT EXISTS idx_task_milestone ON task(milestone_id);
CREATE INDEX IF NOT EXISTS idx_task_assignee ON task(assignee_id);
CREATE INDEX IF NOT EXISTS idx_task_status ON task(status);
CREATE INDEX IF NOT EXISTS idx_task_priority ON task(priority);
CREATE INDEX IF NOT EXISTS idx_task_type ON task(task_type);
CREATE INDEX IF NOT EXISTS idx_task_due_date ON task(due_date);
CREATE INDEX IF NOT EXISTS idx_task_project_status ON task(project_id, status);
CREATE INDEX IF NOT EXISTS idx_task_created_by ON task(created_by_id);
CREATE INDEX IF NOT EXISTS idx_task_tenant_project ON task(tenant_id, project_id);
CREATE INDEX IF NOT EXISTS idx_task_tenant_assignee ON task(tenant_id, assignee_id);
CREATE INDEX IF NOT EXISTS idx_task_tenant_status ON task(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_task_due_date_active ON task(due_date) WHERE status NOT IN ('done', 'cancelled', 'archived');

-- ----------------------------------------------------------------------------
-- 4. task_watcher
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS task_watcher (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    task_id BIGINT NOT NULL,
    staff_id BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT uq_task_watcher UNIQUE (task_id, staff_id)
);

COMMENT ON TABLE task_watcher IS 'Task watchers/followers (separate from assignees)';

-- Foreign Keys
ALTER TABLE task_watcher 
    ADD CONSTRAINT fk_task_watcher_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;
    
ALTER TABLE task_watcher 
    ADD CONSTRAINT fk_task_watcher_task_id 
    FOREIGN KEY (task_id) REFERENCES task(id) ON DELETE CASCADE;
    
ALTER TABLE task_watcher 
    ADD CONSTRAINT fk_task_watcher_staff_id 
    FOREIGN KEY (staff_id) REFERENCES sys_users(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_task_watcher_tenant ON task_watcher(tenant_id);
CREATE INDEX IF NOT EXISTS idx_task_watcher_task ON task_watcher(task_id);
CREATE INDEX IF NOT EXISTS idx_task_watcher_staff ON task_watcher(staff_id);
CREATE INDEX IF NOT EXISTS idx_task_watcher_tenant_staff ON task_watcher(tenant_id, staff_id);

-- ----------------------------------------------------------------------------
-- 5. task_dependency
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS task_dependency (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    task_id BIGINT NOT NULL,
    depends_on_task_id BIGINT NOT NULL,
    dependency_type VARCHAR(50) NOT NULL DEFAULT 'blocks',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_task_dependency_type CHECK (dependency_type IN ('blocks', 'relates_to', 'duplicates')),
    CONSTRAINT chk_task_dependency_self CHECK (task_id != depends_on_task_id),
    CONSTRAINT uq_task_dependency UNIQUE (task_id, depends_on_task_id, dependency_type)
);

COMMENT ON TABLE task_dependency IS 'Task dependencies (blocks/blocked by relationships)';
COMMENT ON COLUMN task_dependency.dependency_type IS 'Enum: blocks, relates_to, duplicates';

-- Foreign Keys
ALTER TABLE task_dependency 
    ADD CONSTRAINT fk_task_dependency_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;
    
ALTER TABLE task_dependency 
    ADD CONSTRAINT fk_task_dependency_task_id 
    FOREIGN KEY (task_id) REFERENCES task(id) ON DELETE CASCADE;
    
ALTER TABLE task_dependency 
    ADD CONSTRAINT fk_task_dependency_depends_on_task_id 
    FOREIGN KEY (depends_on_task_id) REFERENCES task(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_task_dependency_tenant ON task_dependency(tenant_id);
CREATE INDEX IF NOT EXISTS idx_task_dependency_task ON task_dependency(task_id);
CREATE INDEX IF NOT EXISTS idx_task_dependency_depends_on ON task_dependency(depends_on_task_id);
CREATE INDEX IF NOT EXISTS idx_task_dependency_type ON task_dependency(dependency_type);
CREATE INDEX IF NOT EXISTS idx_task_dependency_tenant_task ON task_dependency(tenant_id, task_id);

-- ----------------------------------------------------------------------------
-- 6. task_attachment
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS task_attachment (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    task_id BIGINT NOT NULL,
    file_name VARCHAR(500) NOT NULL,
    file_path VARCHAR(1000) NOT NULL,
    file_type VARCHAR(100) NOT NULL DEFAULT '',
    file_size BIGINT NOT NULL DEFAULT 0,
    uploaded_by_id BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_task_attachment_file_size CHECK (file_size >= 0)
);

COMMENT ON TABLE task_attachment IS 'Task file attachments';

-- Foreign Keys
ALTER TABLE task_attachment 
    ADD CONSTRAINT fk_task_attachment_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;
    
ALTER TABLE task_attachment 
    ADD CONSTRAINT fk_task_attachment_task_id 
    FOREIGN KEY (task_id) REFERENCES task(id) ON DELETE CASCADE;
    
ALTER TABLE task_attachment 
    ADD CONSTRAINT fk_task_attachment_uploaded_by_id 
    FOREIGN KEY (uploaded_by_id) REFERENCES sys_users(id) ON DELETE SET DEFAULT;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_task_attachment_tenant ON task_attachment(tenant_id);
CREATE INDEX IF NOT EXISTS idx_task_attachment_task ON task_attachment(task_id);
CREATE INDEX IF NOT EXISTS idx_task_attachment_uploaded_by ON task_attachment(uploaded_by_id);
CREATE INDEX IF NOT EXISTS idx_task_attachment_file_type ON task_attachment(file_type);
CREATE INDEX IF NOT EXISTS idx_task_attachment_tenant_task ON task_attachment(tenant_id, task_id);

-- ----------------------------------------------------------------------------
-- 7. task_comment
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS task_comment (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    task_id BIGINT NOT NULL,
    parent_comment_id BIGINT NULL,
    author_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    is_internal BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL,
    
    CONSTRAINT chk_task_comment_updated_at CHECK (updated_at >= created_at),
    CONSTRAINT chk_task_comment_deleted_at CHECK (deleted_at IS NULL OR deleted_at >= created_at)
);

COMMENT ON TABLE task_comment IS 'Enhanced task comments with threading and soft delete - renamed from task_conversation';
COMMENT ON COLUMN task_comment.parent_comment_id IS 'For threaded comments';
COMMENT ON COLUMN task_comment.is_internal IS 'Internal vs external comment';

-- Foreign Keys
ALTER TABLE task_comment 
    ADD CONSTRAINT fk_task_comment_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;
    
ALTER TABLE task_comment 
    ADD CONSTRAINT fk_task_comment_task_id 
    FOREIGN KEY (task_id) REFERENCES task(id) ON DELETE CASCADE;
    
ALTER TABLE task_comment 
    ADD CONSTRAINT fk_task_comment_parent_comment_id 
    FOREIGN KEY (parent_comment_id) REFERENCES task_comment(id) ON DELETE SET NULL;
    
ALTER TABLE task_comment 
    ADD CONSTRAINT fk_task_comment_author_id 
    FOREIGN KEY (author_id) REFERENCES sys_users(id) ON DELETE SET DEFAULT;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_task_comment_tenant ON task_comment(tenant_id);
CREATE INDEX IF NOT EXISTS idx_task_comment_task ON task_comment(task_id);
CREATE INDEX IF NOT EXISTS idx_task_comment_author ON task_comment(author_id);
CREATE INDEX IF NOT EXISTS idx_task_comment_parent ON task_comment(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_task_comment_created_at ON task_comment(created_at);
CREATE INDEX IF NOT EXISTS idx_task_comment_tenant_task ON task_comment(tenant_id, task_id);
CREATE INDEX IF NOT EXISTS idx_task_comment_active ON task_comment(task_id, created_at) WHERE deleted_at IS NULL;

-- ----------------------------------------------------------------------------
-- 8. task_comment_mention
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS task_comment_mention (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    comment_id BIGINT NOT NULL,
    mentioned_staff_id BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT uq_task_comment_mention UNIQUE (comment_id, mentioned_staff_id)
);

COMMENT ON TABLE task_comment_mention IS 'User mentions in comments';

-- Foreign Keys
ALTER TABLE task_comment_mention 
    ADD CONSTRAINT fk_task_comment_mention_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;
    
ALTER TABLE task_comment_mention 
    ADD CONSTRAINT fk_task_comment_mention_comment_id 
    FOREIGN KEY (comment_id) REFERENCES task_comment(id) ON DELETE CASCADE;
    
ALTER TABLE task_comment_mention 
    ADD CONSTRAINT fk_task_comment_mention_mentioned_staff_id 
    FOREIGN KEY (mentioned_staff_id) REFERENCES sys_users(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_task_comment_mention_tenant ON task_comment_mention(tenant_id);
CREATE INDEX IF NOT EXISTS idx_task_comment_mention_comment ON task_comment_mention(comment_id);
CREATE INDEX IF NOT EXISTS idx_task_comment_mention_staff ON task_comment_mention(mentioned_staff_id);
CREATE INDEX IF NOT EXISTS idx_task_comment_mention_tenant_staff ON task_comment_mention(tenant_id, mentioned_staff_id);

-- ----------------------------------------------------------------------------
-- 9. task_activity
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS task_activity (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    task_id BIGINT NOT NULL,
    staff_id BIGINT NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    field_name VARCHAR(100) NULL,
    old_value TEXT NULL,
    new_value TEXT NULL,
    metadata JSONB DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE task_activity IS 'Task activity/audit log';
COMMENT ON COLUMN task_activity.action_type IS 'Enum: created, updated, assigned, status_changed, etc.';

-- Foreign Keys
ALTER TABLE task_activity 
    ADD CONSTRAINT fk_task_activity_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;
    
ALTER TABLE task_activity 
    ADD CONSTRAINT fk_task_activity_task_id 
    FOREIGN KEY (task_id) REFERENCES task(id) ON DELETE CASCADE;
    
ALTER TABLE task_activity 
    ADD CONSTRAINT fk_task_activity_staff_id 
    FOREIGN KEY (staff_id) REFERENCES sys_users(id) ON DELETE SET DEFAULT;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_task_activity_tenant ON task_activity(tenant_id);
CREATE INDEX IF NOT EXISTS idx_task_activity_task ON task_activity(task_id);
CREATE INDEX IF NOT EXISTS idx_task_activity_staff ON task_activity(staff_id);
CREATE INDEX IF NOT EXISTS idx_task_activity_action_type ON task_activity(action_type);
CREATE INDEX IF NOT EXISTS idx_task_activity_created_at ON task_activity(created_at);
CREATE INDEX IF NOT EXISTS idx_task_activity_tenant_task ON task_activity(tenant_id, task_id);
CREATE INDEX IF NOT EXISTS idx_task_activity_tenant_created ON task_activity(tenant_id, created_at DESC);

-- ----------------------------------------------------------------------------
-- 10. recurring_task
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS recurring_task (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    name VARCHAR(256) NOT NULL DEFAULT '',
    project_id BIGINT NULL,
    title_template VARCHAR(500) NOT NULL DEFAULT '',
    description_template TEXT NULL,
    task_type VARCHAR(50) NOT NULL DEFAULT 'task',
    priority VARCHAR(20) NOT NULL DEFAULT 'medium',
    frequency VARCHAR(50) NOT NULL DEFAULT '',
    day_repeat VARCHAR(300) NOT NULL DEFAULT '',
    time_zone VARCHAR(200) NOT NULL DEFAULT 'Asia/Ho_Chi_Minh',
    next_run TIMESTAMPTZ NULL,
    processing_time_hours INTEGER NOT NULL DEFAULT 24,
    days_before_insert INTEGER NOT NULL DEFAULT 7,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_by_id BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_recurring_task_type CHECK (task_type IN ('task', 'bug', 'feature', 'epic', 'story')),
    CONSTRAINT chk_recurring_task_priority CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    CONSTRAINT chk_recurring_task_frequency CHECK (frequency IN ('daily', 'weekly', 'monthly', 'custom')),
    CONSTRAINT chk_recurring_task_processing_time CHECK (processing_time_hours > 0),
    CONSTRAINT chk_recurring_task_days_before CHECK (days_before_insert >= 0)
);

COMMENT ON TABLE recurring_task IS 'Enhanced recurring task templates - renamed from db_task_repeat_space';
COMMENT ON COLUMN recurring_task.frequency IS 'Enum: daily, weekly, monthly, custom';

-- Foreign Keys
ALTER TABLE recurring_task 
    ADD CONSTRAINT fk_recurring_task_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;
    
ALTER TABLE recurring_task 
    ADD CONSTRAINT fk_recurring_task_project_id 
    FOREIGN KEY (project_id) REFERENCES project(id) ON DELETE SET NULL;
    
ALTER TABLE recurring_task 
    ADD CONSTRAINT fk_recurring_task_created_by_id 
    FOREIGN KEY (created_by_id) REFERENCES sys_users(id) ON DELETE SET DEFAULT;

-- Now add FK from task.recurring_task_id
ALTER TABLE task 
    ADD CONSTRAINT fk_task_recurring_task_id 
    FOREIGN KEY (recurring_task_id) REFERENCES recurring_task(id) ON DELETE SET NULL;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_recurring_task_tenant ON recurring_task(tenant_id);
CREATE INDEX IF NOT EXISTS idx_recurring_task_project ON recurring_task(project_id);
CREATE INDEX IF NOT EXISTS idx_recurring_task_active ON recurring_task(is_active);
CREATE INDEX IF NOT EXISTS idx_recurring_task_next_run ON recurring_task(next_run);
CREATE INDEX IF NOT EXISTS idx_recurring_task_tenant_active ON recurring_task(tenant_id, is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_recurring_task_tenant_next_run ON recurring_task(tenant_id, next_run) WHERE is_active = TRUE AND next_run IS NOT NULL;

-- ----------------------------------------------------------------------------
-- 11. recurring_task_assignee
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS recurring_task_assignee (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    recurring_task_id BIGINT NOT NULL,
    staff_id BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT uq_recurring_task_assignee UNIQUE (recurring_task_id, staff_id)
);

COMMENT ON TABLE recurring_task_assignee IS 'Multiple assignees for recurring tasks (normalized)';

-- Foreign Keys
ALTER TABLE recurring_task_assignee 
    ADD CONSTRAINT fk_recurring_task_assignee_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;
    
ALTER TABLE recurring_task_assignee 
    ADD CONSTRAINT fk_recurring_task_assignee_recurring_task_id 
    FOREIGN KEY (recurring_task_id) REFERENCES recurring_task(id) ON DELETE CASCADE;
    
ALTER TABLE recurring_task_assignee 
    ADD CONSTRAINT fk_recurring_task_assignee_staff_id 
    FOREIGN KEY (staff_id) REFERENCES sys_users(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_recurring_task_assignee_tenant ON recurring_task_assignee(tenant_id);
CREATE INDEX IF NOT EXISTS idx_recurring_task_assignee_recurring ON recurring_task_assignee(recurring_task_id);
CREATE INDEX IF NOT EXISTS idx_recurring_task_assignee_staff ON recurring_task_assignee(staff_id);
CREATE INDEX IF NOT EXISTS idx_recurring_task_assignee_tenant_staff ON recurring_task_assignee(tenant_id, staff_id);

-- ----------------------------------------------------------------------------
-- 12. project_repository
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS project_repository (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    project_id BIGINT NOT NULL,
    file_name VARCHAR(500) NOT NULL DEFAULT '',
    file_path VARCHAR(1000) NOT NULL DEFAULT '',
    file_type VARCHAR(256) NOT NULL DEFAULT '',
    file_size BIGINT NOT NULL DEFAULT 0,
    uploaded_by_id BIGINT NOT NULL DEFAULT 0,
    description VARCHAR(500) NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_project_repository_file_size CHECK (file_size >= 0)
);

COMMENT ON TABLE project_repository IS 'Enhanced project files repository - renamed from db_repository_project';

-- Foreign Keys
ALTER TABLE project_repository 
    ADD CONSTRAINT fk_project_repository_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;
    
ALTER TABLE project_repository 
    ADD CONSTRAINT fk_project_repository_project_id 
    FOREIGN KEY (project_id) REFERENCES project(id) ON DELETE CASCADE;
    
ALTER TABLE project_repository 
    ADD CONSTRAINT fk_project_repository_uploaded_by_id 
    FOREIGN KEY (uploaded_by_id) REFERENCES sys_users(id) ON DELETE SET DEFAULT;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_project_repository_tenant ON project_repository(tenant_id);
CREATE INDEX IF NOT EXISTS idx_project_repository_project ON project_repository(project_id);
CREATE INDEX IF NOT EXISTS idx_project_repository_uploaded_by ON project_repository(uploaded_by_id);
CREATE INDEX IF NOT EXISTS idx_project_repository_file_type ON project_repository(file_type);
CREATE INDEX IF NOT EXISTS idx_project_repository_tenant_project ON project_repository(tenant_id, project_id);

-- ----------------------------------------------------------------------------
-- Triggers
-- ----------------------------------------------------------------------------

-- Auto-update updated_at timestamp for project
CREATE TRIGGER trg_project_updated_at
    BEFORE UPDATE ON project
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at timestamp for task
CREATE TRIGGER trg_task_updated_at
    BEFORE UPDATE ON task
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at timestamp for task_comment
CREATE TRIGGER trg_task_comment_updated_at
    BEFORE UPDATE ON task_comment
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at timestamp for recurring_task
CREATE TRIGGER trg_recurring_task_updated_at
    BEFORE UPDATE ON recurring_task
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at timestamp for project_repository
CREATE TRIGGER trg_project_repository_updated_at
    BEFORE UPDATE ON project_repository
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

