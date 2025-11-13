-- ============================================================================
-- Logs & Alerts Domain Module
-- ============================================================================
-- This migration creates tables for logging system (human, system, webhook)
-- and alerts & notes system
-- Dependencies: sys_tenants, sys_users (001_system_tenant.sql),
--               auth.users (Supabase Auth - external)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- LOGGING SYSTEM TABLES
-- ----------------------------------------------------------------------------

-- 1. logs_human
CREATE TABLE IF NOT EXISTS logs_human (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL DEFAULT 1,
    actor_id BIGINT NULL,
    actor_user_id UUID NULL,
    action VARCHAR(100) NULL,
    entity_type VARCHAR(100) NULL,
    entity_id BIGINT NULL,
    details JSONB NULL,
    ip_address INET NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE logs_human IS 'Tracks all human (end-user/staff) activities';
COMMENT ON COLUMN logs_human.actor_id IS 'Staff member who performed action (FK to sys_users)';
COMMENT ON COLUMN logs_human.actor_user_id IS 'User account (Supabase auth.users)';
COMMENT ON COLUMN logs_human.action IS 'Action type (e.g., create, update, delete, view)';
COMMENT ON COLUMN logs_human.entity_type IS 'Entity type (e.g., order, product, customer)';
COMMENT ON COLUMN logs_human.details IS 'Additional action details (JSONB)';

-- Foreign Keys
ALTER TABLE logs_human 
    ADD CONSTRAINT fk_logs_human_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;
    
ALTER TABLE logs_human 
    ADD CONSTRAINT fk_logs_human_actor_id 
    FOREIGN KEY (actor_id) REFERENCES sys_users(id) ON DELETE SET NULL;

-- Note: actor_user_id FK to auth.users will be added manually if Supabase Auth is available

-- Indexes
CREATE INDEX IF NOT EXISTS idx_logs_human_tenant ON logs_human(tenant_id);
CREATE INDEX IF NOT EXISTS idx_logs_human_actor_id ON logs_human(actor_id);
CREATE INDEX IF NOT EXISTS idx_logs_human_actor_user_id ON logs_human(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_logs_human_entity ON logs_human(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_logs_human_action ON logs_human(action);
CREATE INDEX IF NOT EXISTS idx_logs_human_created_at ON logs_human(created_at);
CREATE INDEX IF NOT EXISTS idx_logs_human_tenant_created ON logs_human(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_logs_human_details ON logs_human USING GIN(details) WHERE details IS NOT NULL;

-- 2. logs_system
CREATE TABLE IF NOT EXISTS logs_system (
    id SERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL DEFAULT 1,
    entity_type VARCHAR(100) NULL,
    entity_id INTEGER NULL,
    action INTEGER NULL,
    user_id INTEGER NULL,
    details JSONB NULL,
    response TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE logs_system IS 'Tracks all system automated activities and background processes';
COMMENT ON COLUMN logs_system.entity_type IS 'Entity type affected by system action';
COMMENT ON COLUMN logs_system.action IS 'Action code/type (integer enum)';
COMMENT ON COLUMN logs_system.details IS 'Additional action details (JSONB)';

-- Foreign Keys
ALTER TABLE logs_system 
    ADD CONSTRAINT fk_logs_system_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_logs_system_tenant ON logs_system(tenant_id);
CREATE INDEX IF NOT EXISTS idx_logs_system_entity ON logs_system(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_logs_system_action ON logs_system(action);
CREATE INDEX IF NOT EXISTS idx_logs_system_created_at ON logs_system(created_at);
CREATE INDEX IF NOT EXISTS idx_logs_system_tenant_created ON logs_system(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_logs_system_details ON logs_system USING GIN(details) WHERE details IS NOT NULL;

-- 3. logs_webhook
CREATE TABLE IF NOT EXISTS logs_webhook (
    id SERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL DEFAULT 1,
    endpoint VARCHAR(500) NULL,
    sent_by VARCHAR(200) NULL,
    request_data JSONB NULL,
    response_data JSONB NULL,
    status INTEGER NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE logs_webhook IS 'Tracks all webhook activities (incoming and outgoing)';
COMMENT ON COLUMN logs_webhook.endpoint IS 'Webhook endpoint URL';
COMMENT ON COLUMN logs_webhook.sent_by IS 'Source system or service that sent webhook';
COMMENT ON COLUMN logs_webhook.status IS 'HTTP status code (e.g., 200, 400, 500)';
COMMENT ON COLUMN logs_webhook.request_data IS 'Incoming webhook request payload (JSONB)';
COMMENT ON COLUMN logs_webhook.response_data IS 'Webhook response payload (JSONB)';

-- Foreign Keys
ALTER TABLE logs_webhook 
    ADD CONSTRAINT fk_logs_webhook_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_logs_webhook_tenant ON logs_webhook(tenant_id);
CREATE INDEX IF NOT EXISTS idx_logs_webhook_endpoint ON logs_webhook(endpoint);
CREATE INDEX IF NOT EXISTS idx_logs_webhook_sent_by ON logs_webhook(sent_by);
CREATE INDEX IF NOT EXISTS idx_logs_webhook_status ON logs_webhook(status);
CREATE INDEX IF NOT EXISTS idx_logs_webhook_created_at ON logs_webhook(created_at);
CREATE INDEX IF NOT EXISTS idx_logs_webhook_tenant_created ON logs_webhook(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_logs_webhook_request_data ON logs_webhook USING GIN(request_data) WHERE request_data IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_logs_webhook_response_data ON logs_webhook USING GIN(response_data) WHERE response_data IS NOT NULL;

-- ----------------------------------------------------------------------------
-- ALERTS & NOTES SYSTEM TABLES
-- ----------------------------------------------------------------------------

-- 4. alert_keys
CREATE TABLE IF NOT EXISTS alert_keys (
    id BIGSERIAL PRIMARY KEY,
    key VARCHAR(100) NOT NULL,
    alert_name VARCHAR(200) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_alert_keys_severity CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    CONSTRAINT uq_alert_keys_key UNIQUE (key)
);

COMMENT ON TABLE alert_keys IS 'Registry of alert types/keys that define available alert categories';
COMMENT ON COLUMN alert_keys.key IS 'Unique identifier for alert type (e.g., low_stock, payment_failed)';
COMMENT ON COLUMN alert_keys.alert_name IS 'Human-readable name (e.g., Low Stock Alert, Payment Failed)';
COMMENT ON COLUMN alert_keys.severity IS 'Severity level: low, medium, high, critical';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_alert_keys_key ON alert_keys(key);
CREATE INDEX IF NOT EXISTS idx_alert_keys_active ON alert_keys(active);
CREATE INDEX IF NOT EXISTS idx_alert_keys_severity ON alert_keys(severity);
CREATE INDEX IF NOT EXISTS idx_alert_keys_active_severity ON alert_keys(active, severity) WHERE active = TRUE;

-- 5. alerts
CREATE TABLE IF NOT EXISTS alerts (
    id BIGSERIAL PRIMARY KEY,
    entity_type VARCHAR(100) NOT NULL,
    entity_id BIGINT NOT NULL,
    alert_key_id BIGINT NOT NULL,
    created_by BIGINT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMPTZ NULL
);

COMMENT ON TABLE alerts IS 'Alert instances tied to specific entities (polymorphic relationship)';
COMMENT ON COLUMN alerts.entity_type IS 'Type of entity (e.g., order, product, shipment, customer)';
COMMENT ON COLUMN alerts.entity_id IS 'ID of the affected entity';
COMMENT ON COLUMN alerts.alert_key_id IS 'Reference to alert type definition';
COMMENT ON COLUMN alerts.resolved_at IS 'Alert resolution timestamp (NULL = unresolved)';

-- Foreign Keys
ALTER TABLE alerts 
    ADD CONSTRAINT fk_alerts_alert_key_id 
    FOREIGN KEY (alert_key_id) REFERENCES alert_keys(id) ON DELETE RESTRICT;
    
ALTER TABLE alerts 
    ADD CONSTRAINT fk_alerts_created_by 
    FOREIGN KEY (created_by) REFERENCES sys_users(id) ON DELETE SET NULL;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_alerts_entity ON alerts(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_alerts_alert_key ON alerts(alert_key_id);
CREATE INDEX IF NOT EXISTS idx_alerts_created_by ON alerts(created_by);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at);
CREATE INDEX IF NOT EXISTS idx_alerts_resolved_at ON alerts(resolved_at);
CREATE INDEX IF NOT EXISTS idx_alerts_unresolved ON alerts(entity_type, entity_id, created_at DESC) WHERE resolved_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_alerts_entity_unresolved ON alerts(entity_type, entity_id) WHERE resolved_at IS NULL;

-- 6. notes
CREATE TABLE IF NOT EXISTS notes (
    id BIGSERIAL PRIMARY KEY,
    entity_type VARCHAR(100) NOT NULL,
    entity_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    created_by BIGINT NULL,
    tenant_id BIGINT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE notes IS 'General notes attached to entities (polymorphic relationship)';
COMMENT ON COLUMN notes.entity_type IS 'Type of entity (e.g., order, product, customer, shipment)';
COMMENT ON COLUMN notes.entity_id IS 'ID of the affected entity';
COMMENT ON COLUMN notes.content IS 'Note content/text';
COMMENT ON COLUMN notes.created_by IS 'Staff member who created the note';

-- Foreign Keys
ALTER TABLE notes 
    ADD CONSTRAINT fk_notes_created_by 
    FOREIGN KEY (created_by) REFERENCES sys_users(id) ON DELETE SET NULL;
    
ALTER TABLE notes 
    ADD CONSTRAINT fk_notes_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_notes_entity ON notes(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_notes_created_by ON notes(created_by);
CREATE INDEX IF NOT EXISTS idx_notes_tenant ON notes(tenant_id);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at);
CREATE INDEX IF NOT EXISTS idx_notes_tenant_entity ON notes(tenant_id, entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_notes_tenant_created ON notes(tenant_id, created_at DESC);

-- ----------------------------------------------------------------------------
-- Triggers
-- ----------------------------------------------------------------------------

-- Auto-update updated_at timestamp for notes
CREATE TRIGGER trg_notes_updated_at
    BEFORE UPDATE ON notes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Note: Foreign key from logs_human.actor_user_id to auth.users will be
--       added manually if Supabase Auth is available
-- ============================================================================

