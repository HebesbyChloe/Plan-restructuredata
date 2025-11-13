-- ============================================================================
-- Performance Management & Schedule Domain Module
-- ============================================================================
-- This migration creates tables for performance evaluation and schedule management
-- Dependencies: sys_tenants, sys_users (001_system_tenant.sql)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- PERFORMANCE MANAGEMENT TABLES
-- ----------------------------------------------------------------------------

-- 1. department
CREATE TABLE IF NOT EXISTS department (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(256) NOT NULL,
    description TEXT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_department_code CHECK (code != ''),
    CONSTRAINT uq_department_tenant_code UNIQUE (tenant_id, code)
);

COMMENT ON TABLE department IS 'Department/division management with unique codes';
COMMENT ON COLUMN department.code IS 'Unique code (e.g., SALES, HR, IT)';

-- Foreign Keys
ALTER TABLE department 
    ADD CONSTRAINT fk_department_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_department_tenant ON department(tenant_id);
CREATE INDEX IF NOT EXISTS idx_department_code_tenant ON department(tenant_id, code);
CREATE INDEX IF NOT EXISTS idx_department_active ON department(tenant_id, is_active) WHERE is_active = TRUE;

-- 2. performance_criteria
CREATE TABLE IF NOT EXISTS performance_criteria (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    name VARCHAR(256) NOT NULL,
    description TEXT NULL,
    department_id BIGINT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'quantitative',
    weight NUMERIC(5,2) NOT NULL DEFAULT 0,
    max_score NUMERIC(5,2) NOT NULL DEFAULT 100,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_performance_criteria_type CHECK (type IN ('quantitative', 'qualitative')),
    CONSTRAINT chk_performance_criteria_weight CHECK (weight >= 0 AND weight <= 100),
    CONSTRAINT chk_performance_criteria_max_score CHECK (max_score > 0),
    CONSTRAINT uq_performance_criteria_tenant_name_department UNIQUE (tenant_id, name, department_id)
);

COMMENT ON TABLE performance_criteria IS 'Performance evaluation criteria (global and department-specific)';
COMMENT ON COLUMN performance_criteria.department_id IS 'NULL = global criteria, NOT NULL = department-specific';
COMMENT ON COLUMN performance_criteria.type IS 'Criteria type: quantitative, qualitative';
COMMENT ON COLUMN performance_criteria.weight IS 'Percentage (0-100)';

-- Foreign Keys
ALTER TABLE performance_criteria 
    ADD CONSTRAINT fk_performance_criteria_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;
    
ALTER TABLE performance_criteria 
    ADD CONSTRAINT fk_performance_criteria_department_id 
    FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_performance_criteria_tenant ON performance_criteria(tenant_id);
CREATE INDEX IF NOT EXISTS idx_performance_criteria_department ON performance_criteria(department_id);
CREATE INDEX IF NOT EXISTS idx_performance_criteria_type ON performance_criteria(type);
CREATE INDEX IF NOT EXISTS idx_performance_criteria_active ON performance_criteria(tenant_id, is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_performance_criteria_tenant_department ON performance_criteria(tenant_id, department_id);
CREATE INDEX IF NOT EXISTS idx_performance_criteria_global ON performance_criteria(tenant_id) WHERE department_id IS NULL;

-- 3. performance_evaluation
CREATE TABLE IF NOT EXISTS performance_evaluation (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    staff_id BIGINT NOT NULL,
    evaluator_id BIGINT NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    overall_score NUMERIC(5,2) NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'draft',
    notes TEXT NULL,
    created_by_id BIGINT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMPTZ NULL,
    approved_by_id BIGINT NULL,
    approved_at TIMESTAMPTZ NULL,
    rejected_by_id BIGINT NULL,
    rejected_at TIMESTAMPTZ NULL,
    rejection_reason TEXT NULL,
    
    CONSTRAINT chk_performance_evaluation_status CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
    CONSTRAINT chk_performance_evaluation_dates CHECK (period_end >= period_start),
    CONSTRAINT chk_performance_evaluation_score CHECK (overall_score IS NULL OR (overall_score >= 0 AND overall_score <= 100)),
    CONSTRAINT chk_performance_evaluation_submitted_at CHECK (submitted_at IS NULL OR submitted_at >= created_at),
    CONSTRAINT chk_performance_evaluation_approved_at CHECK (approved_at IS NULL OR approved_at >= submitted_at),
    CONSTRAINT chk_performance_evaluation_rejected_at CHECK (rejected_at IS NULL OR rejected_at >= submitted_at),
    CONSTRAINT chk_performance_evaluation_approved CHECK ((status = 'approved' AND approved_by_id IS NOT NULL) OR (status != 'approved')),
    CONSTRAINT chk_performance_evaluation_rejected CHECK ((status = 'rejected' AND rejected_by_id IS NOT NULL) OR (status != 'rejected')),
    CONSTRAINT uq_performance_evaluation_tenant_staff_period UNIQUE (tenant_id, staff_id, period_start, period_end)
);

COMMENT ON TABLE performance_evaluation IS 'Performance evaluation periods with approval workflow';
COMMENT ON COLUMN performance_evaluation.status IS 'Evaluation status: draft, submitted, approved, rejected';

-- Foreign Keys
ALTER TABLE performance_evaluation 
    ADD CONSTRAINT fk_performance_evaluation_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;
    
ALTER TABLE performance_evaluation 
    ADD CONSTRAINT fk_performance_evaluation_staff_id 
    FOREIGN KEY (staff_id) REFERENCES sys_users(id) ON DELETE CASCADE;
    
ALTER TABLE performance_evaluation 
    ADD CONSTRAINT fk_performance_evaluation_evaluator_id 
    FOREIGN KEY (evaluator_id) REFERENCES sys_users(id) ON DELETE SET NULL;
    
ALTER TABLE performance_evaluation 
    ADD CONSTRAINT fk_performance_evaluation_created_by_id 
    FOREIGN KEY (created_by_id) REFERENCES sys_users(id) ON DELETE SET NULL;
    
ALTER TABLE performance_evaluation 
    ADD CONSTRAINT fk_performance_evaluation_approved_by_id 
    FOREIGN KEY (approved_by_id) REFERENCES sys_users(id) ON DELETE SET NULL;
    
ALTER TABLE performance_evaluation 
    ADD CONSTRAINT fk_performance_evaluation_rejected_by_id 
    FOREIGN KEY (rejected_by_id) REFERENCES sys_users(id) ON DELETE SET NULL;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_performance_evaluation_tenant ON performance_evaluation(tenant_id);
CREATE INDEX IF NOT EXISTS idx_performance_evaluation_staff ON performance_evaluation(staff_id);
CREATE INDEX IF NOT EXISTS idx_performance_evaluation_evaluator ON performance_evaluation(evaluator_id);
CREATE INDEX IF NOT EXISTS idx_performance_evaluation_status ON performance_evaluation(status);
CREATE INDEX IF NOT EXISTS idx_performance_evaluation_period ON performance_evaluation(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_performance_evaluation_tenant_staff ON performance_evaluation(tenant_id, staff_id);
CREATE INDEX IF NOT EXISTS idx_performance_evaluation_tenant_status ON performance_evaluation(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_performance_evaluation_tenant_period ON performance_evaluation(tenant_id, period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_performance_evaluation_pending ON performance_evaluation(tenant_id, status) WHERE status IN ('draft', 'submitted');
CREATE INDEX IF NOT EXISTS idx_performance_evaluation_approved ON performance_evaluation(tenant_id, staff_id, period_end DESC) WHERE status = 'approved';

-- 4. performance_score
CREATE TABLE IF NOT EXISTS performance_score (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    evaluation_id BIGINT NOT NULL,
    criteria_id BIGINT NOT NULL,
    score NUMERIC(5,2) NOT NULL,
    comments TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_performance_score_score CHECK (score >= 0),
    CONSTRAINT uq_performance_score_evaluation_criteria UNIQUE (evaluation_id, criteria_id)
);

COMMENT ON TABLE performance_score IS 'Detailed scores for each criteria in an evaluation';

-- Foreign Keys
ALTER TABLE performance_score 
    ADD CONSTRAINT fk_performance_score_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;
    
ALTER TABLE performance_score 
    ADD CONSTRAINT fk_performance_score_evaluation_id 
    FOREIGN KEY (evaluation_id) REFERENCES performance_evaluation(id) ON DELETE CASCADE;
    
ALTER TABLE performance_score 
    ADD CONSTRAINT fk_performance_score_criteria_id 
    FOREIGN KEY (criteria_id) REFERENCES performance_criteria(id) ON DELETE RESTRICT;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_performance_score_tenant ON performance_score(tenant_id);
CREATE INDEX IF NOT EXISTS idx_performance_score_evaluation ON performance_score(evaluation_id);
CREATE INDEX IF NOT EXISTS idx_performance_score_criteria ON performance_score(criteria_id);
CREATE INDEX IF NOT EXISTS idx_performance_score_tenant_evaluation ON performance_score(tenant_id, evaluation_id);
CREATE INDEX IF NOT EXISTS idx_performance_score_tenant_criteria ON performance_score(tenant_id, criteria_id);

-- ----------------------------------------------------------------------------
-- SCHEDULE MANAGEMENT TABLES
-- ----------------------------------------------------------------------------

-- 5. leave_type
CREATE TABLE IF NOT EXISTS leave_type (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(256) NOT NULL,
    description TEXT NULL,
    requires_approval BOOLEAN NOT NULL DEFAULT TRUE,
    is_paid BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_leave_type_code CHECK (code != ''),
    CONSTRAINT uq_leave_type_tenant_code UNIQUE (tenant_id, code)
);

COMMENT ON TABLE leave_type IS 'Leave type lookup table (normalized)';
COMMENT ON COLUMN leave_type.code IS 'Unique code (e.g., sick, vacation, personal)';

-- Foreign Keys
ALTER TABLE leave_type 
    ADD CONSTRAINT fk_leave_type_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_leave_type_tenant ON leave_type(tenant_id);
CREATE INDEX IF NOT EXISTS idx_leave_type_code_tenant ON leave_type(tenant_id, code);
CREATE INDEX IF NOT EXISTS idx_leave_type_active ON leave_type(tenant_id, is_active) WHERE is_active = TRUE;

-- 6. schedule
CREATE TABLE IF NOT EXISTS schedule (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    staff_id BIGINT NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    shift_name VARCHAR(256) NOT NULL DEFAULT '',
    total_minutes INTEGER NOT NULL DEFAULT 0,
    leave_type_id BIGINT NULL,
    is_authorized BOOLEAN NOT NULL DEFAULT FALSE,
    reason VARCHAR(500) NOT NULL DEFAULT '',
    status VARCHAR(50) NOT NULL DEFAULT 'draft',
    shift_report_id BIGINT NULL,
    is_confirmed BOOLEAN NOT NULL DEFAULT TRUE,
    is_leader_shift BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by_id BIGINT NULL,
    authorized_at TIMESTAMPTZ NULL,
    authorized_by_id BIGINT NULL,
    
    CONSTRAINT chk_schedule_status CHECK (status IN ('draft', 'confirmed', 'completed', 'failed')),
    CONSTRAINT chk_schedule_time CHECK (end_time > start_time),
    CONSTRAINT chk_schedule_total_minutes CHECK (total_minutes >= 0),
    CONSTRAINT chk_schedule_authorized_at CHECK (authorized_at IS NULL OR authorized_at >= created_at)
);

COMMENT ON TABLE schedule IS 'Staff shift schedules with enterprise features';
COMMENT ON COLUMN schedule.status IS 'Schedule status: draft, confirmed, completed, failed';

-- Foreign Keys
ALTER TABLE schedule 
    ADD CONSTRAINT fk_schedule_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;
    
ALTER TABLE schedule 
    ADD CONSTRAINT fk_schedule_staff_id 
    FOREIGN KEY (staff_id) REFERENCES sys_users(id) ON DELETE CASCADE;
    
ALTER TABLE schedule 
    ADD CONSTRAINT fk_schedule_leave_type_id 
    FOREIGN KEY (leave_type_id) REFERENCES leave_type(id) ON DELETE SET NULL;
    
ALTER TABLE schedule 
    ADD CONSTRAINT fk_schedule_updated_by_id 
    FOREIGN KEY (updated_by_id) REFERENCES sys_users(id) ON DELETE SET NULL;
    
ALTER TABLE schedule 
    ADD CONSTRAINT fk_schedule_authorized_by_id 
    FOREIGN KEY (authorized_by_id) REFERENCES sys_users(id) ON DELETE SET NULL;

-- Note: shift_report_id FK will be added after shift_report table is created

-- Indexes
CREATE INDEX IF NOT EXISTS idx_schedule_tenant ON schedule(tenant_id);
CREATE INDEX IF NOT EXISTS idx_schedule_staff ON schedule(staff_id);
CREATE INDEX IF NOT EXISTS idx_schedule_start_time ON schedule(start_time);
CREATE INDEX IF NOT EXISTS idx_schedule_end_time ON schedule(end_time);
CREATE INDEX IF NOT EXISTS idx_schedule_status ON schedule(status);
CREATE INDEX IF NOT EXISTS idx_schedule_leave_type ON schedule(leave_type_id);
CREATE INDEX IF NOT EXISTS idx_schedule_tenant_staff ON schedule(tenant_id, staff_id);
CREATE INDEX IF NOT EXISTS idx_schedule_tenant_status ON schedule(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_schedule_dates ON schedule(start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_schedule_staff_dates ON schedule(staff_id, start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_schedule_active ON schedule(tenant_id, staff_id, start_time) WHERE status IN ('confirmed', 'completed');
CREATE INDEX IF NOT EXISTS idx_schedule_pending_authorization ON schedule(tenant_id, staff_id, created_at) WHERE is_authorized = FALSE AND status = 'confirmed';

-- EXCLUDE constraint to prevent overlapping confirmed schedules per tenant
CREATE INDEX IF NOT EXISTS idx_schedule_overlap ON schedule USING GIST (
    tenant_id WITH =,
    staff_id WITH =,
    tstzrange(start_time, end_time) WITH &&
) WHERE status IN ('confirmed', 'completed');

-- 7. schedule_preferences
CREATE TABLE IF NOT EXISTS schedule_preferences (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    staff_id BIGINT NOT NULL,
    week_number INTEGER NOT NULL DEFAULT 1,
    year INTEGER NOT NULL,
    preferences JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT uq_schedule_preferences_tenant_staff_week_year UNIQUE (tenant_id, staff_id, week_number, year)
);

COMMENT ON TABLE schedule_preferences IS 'Staff schedule preferences';
COMMENT ON COLUMN schedule_preferences.preferences IS 'Schedule preferences (JSONB)';

-- Foreign Keys
ALTER TABLE schedule_preferences 
    ADD CONSTRAINT fk_schedule_preferences_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;
    
ALTER TABLE schedule_preferences 
    ADD CONSTRAINT fk_schedule_preferences_staff_id 
    FOREIGN KEY (staff_id) REFERENCES sys_users(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_schedule_preferences_tenant ON schedule_preferences(tenant_id);
CREATE INDEX IF NOT EXISTS idx_schedule_preferences_staff ON schedule_preferences(staff_id);
CREATE INDEX IF NOT EXISTS idx_schedule_preferences_week_year ON schedule_preferences(week_number, year);
CREATE INDEX IF NOT EXISTS idx_schedule_preferences_tenant_staff ON schedule_preferences(tenant_id, staff_id);
CREATE INDEX IF NOT EXISTS idx_schedule_preferences_tenant_week_year ON schedule_preferences(tenant_id, week_number, year);
CREATE INDEX IF NOT EXISTS idx_schedule_preferences_preferences ON schedule_preferences USING GIN(preferences);

-- 8. schedule_revision
CREATE TABLE IF NOT EXISTS schedule_revision (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    revision_type VARCHAR(256) NOT NULL DEFAULT '',
    updated_by_id BIGINT NULL,
    updated_by_name VARCHAR(256) DEFAULT '',
    start_date DATE NULL,
    end_date DATE NULL,
    description TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_schedule_revision_dates CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);

COMMENT ON TABLE schedule_revision IS 'Schedule revision history';

-- Foreign Keys
ALTER TABLE schedule_revision 
    ADD CONSTRAINT fk_schedule_revision_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;
    
ALTER TABLE schedule_revision 
    ADD CONSTRAINT fk_schedule_revision_updated_by_id 
    FOREIGN KEY (updated_by_id) REFERENCES sys_users(id) ON DELETE SET NULL;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_schedule_revision_tenant ON schedule_revision(tenant_id);
CREATE INDEX IF NOT EXISTS idx_schedule_revision_updated_by ON schedule_revision(updated_by_id);
CREATE INDEX IF NOT EXISTS idx_schedule_revision_type ON schedule_revision(revision_type);
CREATE INDEX IF NOT EXISTS idx_schedule_revision_dates ON schedule_revision(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_schedule_revision_tenant_dates ON schedule_revision(tenant_id, start_date, end_date);

-- 9. schedule_revision_detail
CREATE TABLE IF NOT EXISTS schedule_revision_detail (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    revision_id BIGINT NOT NULL,
    schedule_id BIGINT NULL,
    staff_id BIGINT NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    shift_name VARCHAR(256) NOT NULL DEFAULT '',
    total_minutes INTEGER NOT NULL DEFAULT 0,
    leave_type_id BIGINT NULL,
    is_authorized BOOLEAN NOT NULL DEFAULT FALSE,
    reason VARCHAR(500) NOT NULL DEFAULT '',
    is_confirmed BOOLEAN NOT NULL DEFAULT TRUE,
    is_leader_shift BOOLEAN NOT NULL DEFAULT FALSE,
    shift_report_id BIGINT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_schedule_revision_detail_time CHECK (end_time > start_time),
    CONSTRAINT chk_schedule_revision_detail_total_minutes CHECK (total_minutes >= 0)
);

COMMENT ON TABLE schedule_revision_detail IS 'Individual schedule changes in a revision';

-- Foreign Keys
ALTER TABLE schedule_revision_detail 
    ADD CONSTRAINT fk_schedule_revision_detail_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;
    
ALTER TABLE schedule_revision_detail 
    ADD CONSTRAINT fk_schedule_revision_detail_revision_id 
    FOREIGN KEY (revision_id) REFERENCES schedule_revision(id) ON DELETE CASCADE;
    
ALTER TABLE schedule_revision_detail 
    ADD CONSTRAINT fk_schedule_revision_detail_staff_id 
    FOREIGN KEY (staff_id) REFERENCES sys_users(id) ON DELETE CASCADE;
    
ALTER TABLE schedule_revision_detail 
    ADD CONSTRAINT fk_schedule_revision_detail_leave_type_id 
    FOREIGN KEY (leave_type_id) REFERENCES leave_type(id) ON DELETE SET NULL;

-- Note: schedule_id and shift_report_id FKs will be added after those tables are created

-- Indexes
CREATE INDEX IF NOT EXISTS idx_schedule_revision_detail_tenant ON schedule_revision_detail(tenant_id);
CREATE INDEX IF NOT EXISTS idx_schedule_revision_detail_revision ON schedule_revision_detail(revision_id);
CREATE INDEX IF NOT EXISTS idx_schedule_revision_detail_schedule ON schedule_revision_detail(schedule_id);
CREATE INDEX IF NOT EXISTS idx_schedule_revision_detail_staff ON schedule_revision_detail(staff_id);
CREATE INDEX IF NOT EXISTS idx_schedule_revision_detail_leave_type ON schedule_revision_detail(leave_type_id);
CREATE INDEX IF NOT EXISTS idx_schedule_revision_detail_dates ON schedule_revision_detail(start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_schedule_revision_detail_tenant_revision ON schedule_revision_detail(tenant_id, revision_id);

-- 10. schedule_time_off_request
CREATE TABLE IF NOT EXISTS schedule_time_off_request (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    staff_id BIGINT NOT NULL,
    leave_type_id BIGINT NULL,
    "group" VARCHAR(100) DEFAULT '',
    reason VARCHAR(500) NOT NULL DEFAULT '',
    email_body TEXT NULL,
    day_off DATE NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    schedule_id BIGINT NULL,
    hr_comment VARCHAR(600) DEFAULT '',
    confirmed_by_id BIGINT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMPTZ NULL,
    
    CONSTRAINT chk_schedule_time_off_request_status CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
    CONSTRAINT chk_schedule_time_off_request_confirmed_at CHECK (confirmed_at IS NULL OR confirmed_at >= created_at)
);

COMMENT ON TABLE schedule_time_off_request IS 'Time off requests';
COMMENT ON COLUMN schedule_time_off_request.status IS 'Request status: pending, approved, rejected, cancelled';

-- Foreign Keys
ALTER TABLE schedule_time_off_request 
    ADD CONSTRAINT fk_schedule_time_off_request_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;
    
ALTER TABLE schedule_time_off_request 
    ADD CONSTRAINT fk_schedule_time_off_request_staff_id 
    FOREIGN KEY (staff_id) REFERENCES sys_users(id) ON DELETE CASCADE;
    
ALTER TABLE schedule_time_off_request 
    ADD CONSTRAINT fk_schedule_time_off_request_leave_type_id 
    FOREIGN KEY (leave_type_id) REFERENCES leave_type(id) ON DELETE SET NULL;
    
ALTER TABLE schedule_time_off_request 
    ADD CONSTRAINT fk_schedule_time_off_request_confirmed_by_id 
    FOREIGN KEY (confirmed_by_id) REFERENCES sys_users(id) ON DELETE SET NULL;

-- Note: schedule_id FK will be added after schedule table is created (self-reference)

-- Indexes
CREATE INDEX IF NOT EXISTS idx_schedule_time_off_request_tenant ON schedule_time_off_request(tenant_id);
CREATE INDEX IF NOT EXISTS idx_schedule_time_off_request_staff ON schedule_time_off_request(staff_id);
CREATE INDEX IF NOT EXISTS idx_schedule_time_off_request_status ON schedule_time_off_request(status);
CREATE INDEX IF NOT EXISTS idx_schedule_time_off_request_day_off ON schedule_time_off_request(day_off);
CREATE INDEX IF NOT EXISTS idx_schedule_time_off_request_schedule ON schedule_time_off_request(schedule_id);
CREATE INDEX IF NOT EXISTS idx_schedule_time_off_request_leave_type ON schedule_time_off_request(leave_type_id);
CREATE INDEX IF NOT EXISTS idx_schedule_time_off_request_tenant_staff ON schedule_time_off_request(tenant_id, staff_id);
CREATE INDEX IF NOT EXISTS idx_schedule_time_off_request_tenant_status ON schedule_time_off_request(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_schedule_time_off_request_pending ON schedule_time_off_request(tenant_id, staff_id, day_off) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_schedule_time_off_request_approved ON schedule_time_off_request(tenant_id, staff_id, day_off) WHERE status = 'approved';

-- Add self-reference FK for schedule_time_off_request.schedule_id
ALTER TABLE schedule_time_off_request 
    ADD CONSTRAINT fk_schedule_time_off_request_schedule_id 
    FOREIGN KEY (schedule_id) REFERENCES schedule(id) ON DELETE SET NULL;

-- ----------------------------------------------------------------------------
-- Triggers
-- ----------------------------------------------------------------------------

-- Auto-update updated_at timestamp for department
CREATE TRIGGER trg_department_updated_at
    BEFORE UPDATE ON department
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at timestamp for performance_criteria
CREATE TRIGGER trg_performance_criteria_updated_at
    BEFORE UPDATE ON performance_criteria
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at timestamp for performance_evaluation
CREATE TRIGGER trg_performance_evaluation_updated_at
    BEFORE UPDATE ON performance_evaluation
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at timestamp for performance_score
CREATE TRIGGER trg_performance_score_updated_at
    BEFORE UPDATE ON performance_score
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at timestamp for schedule
CREATE TRIGGER trg_schedule_updated_at
    BEFORE UPDATE ON schedule
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at timestamp for schedule_preferences
CREATE TRIGGER trg_schedule_preferences_updated_at
    BEFORE UPDATE ON schedule_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Note: Foreign keys from schedule.shift_report_id and 
--       schedule_revision_detail.shift_report_id will be added after 
--       shift_report table is created
-- ============================================================================

