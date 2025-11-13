-- ============================================================================
-- Omnichannel Integration Domain Module
-- ============================================================================
-- This migration creates tables for unified messaging across all platforms
-- (Facebook, Instagram, Zalo, YouTube, etc.)
-- Dependencies: sys_tenants, sys_users (001_system_tenant.sql),
--               channels_platform_pages (002_channels_platforms.sql)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. omnichannel_contact
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS omnichannel_contact (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    page_id BIGINT NULL,
    personal_key_id VARCHAR(256) NOT NULL,
    platform_user_id VARCHAR(200) NULL,
    external_customer_id VARCHAR(256) NULL,
    integration_via VARCHAR(50) NULL,
    link VARCHAR(500) NULL,
    metadata JSONB NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_omnichannel_contact_personal_key CHECK (personal_key_id != ''),
    CONSTRAINT chk_omnichannel_contact_link CHECK (link IS NULL OR link != ''),
    CONSTRAINT chk_omnichannel_contact_integration_via CHECK (integration_via IS NULL OR integration_via IN ('pancake', 'meta', 'direct', 'custom', 'zalo', 'other')),
    CONSTRAINT uq_omnichannel_contact_tenant_personal_external_integration UNIQUE (tenant_id, personal_key_id, external_customer_id, integration_via) WHERE external_customer_id IS NOT NULL
);

COMMENT ON TABLE omnichannel_contact IS 'Unified contact table for all messaging platforms (Facebook, Instagram, Zalo, YouTube, etc.)';
COMMENT ON COLUMN omnichannel_contact.page_id IS 'Platform page/account (FK to channels_platform_pages)';
COMMENT ON COLUMN omnichannel_contact.personal_key_id IS 'Personal identifier (links to crm_personal_keys.external_key, NOT FK)';
COMMENT ON COLUMN omnichannel_contact.platform_user_id IS 'Platform-specific user ID (fb_id, instagram_user_id, zalo_user_id, etc.)';
COMMENT ON COLUMN omnichannel_contact.external_customer_id IS 'Generic external customer ID (pancake_customer_id, meta_customer_id, etc.)';
COMMENT ON COLUMN omnichannel_contact.integration_via IS 'Integration service: pancake, meta, direct, custom, zalo, other';
COMMENT ON COLUMN omnichannel_contact.metadata IS 'Platform-specific metadata (JSONB)';

-- Foreign Keys
ALTER TABLE omnichannel_contact 
    ADD CONSTRAINT fk_omnichannel_contact_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;
    
ALTER TABLE omnichannel_contact 
    ADD CONSTRAINT fk_omnichannel_contact_page_id 
    FOREIGN KEY (page_id) REFERENCES channels_platform_pages(id) ON DELETE SET NULL;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_omnichannel_contact_tenant ON omnichannel_contact(tenant_id);
CREATE INDEX IF NOT EXISTS idx_omnichannel_contact_page ON omnichannel_contact(page_id);
CREATE INDEX IF NOT EXISTS idx_omnichannel_contact_personal_key_id ON omnichannel_contact(personal_key_id);
CREATE INDEX IF NOT EXISTS idx_omnichannel_contact_external_customer ON omnichannel_contact(external_customer_id) WHERE external_customer_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_omnichannel_contact_integration_via ON omnichannel_contact(integration_via);
CREATE INDEX IF NOT EXISTS idx_omnichannel_contact_platform_user_id ON omnichannel_contact(platform_user_id) WHERE platform_user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_omnichannel_contact_tenant_personal ON omnichannel_contact(tenant_id, personal_key_id);
CREATE INDEX IF NOT EXISTS idx_omnichannel_contact_tenant_page ON omnichannel_contact(tenant_id, page_id);
CREATE INDEX IF NOT EXISTS idx_omnichannel_contact_metadata ON omnichannel_contact USING GIN(metadata) WHERE metadata IS NOT NULL;

-- ----------------------------------------------------------------------------
-- 2. omnichannel_message
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS omnichannel_message (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    page_id BIGINT NOT NULL,
    contact_id BIGINT NULL,
    admin_id BIGINT NULL,
    conversation_id VARCHAR(100) NULL,
    sender_type VARCHAR(50) NULL,
    sender_name VARCHAR(256) NULL,
    message TEXT NULL,
    attachments JSONB NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_omnichannel_message_sender_type CHECK (sender_type IS NULL OR sender_type IN ('user', 'admin', 'system')),
    CONSTRAINT chk_omnichannel_message_message CHECK (message IS NULL OR message != '')
);

COMMENT ON TABLE omnichannel_message IS 'Unified message table for all messaging platforms (Facebook, Instagram, Zalo, YouTube, etc.)';
COMMENT ON COLUMN omnichannel_message.page_id IS 'Platform page/account (FK to channels_platform_pages)';
COMMENT ON COLUMN omnichannel_message.contact_id IS 'Link to contact if available (FK to omnichannel_contact)';
COMMENT ON COLUMN omnichannel_message.admin_id IS 'Staff member who sent message (FK to sys_users)';
COMMENT ON COLUMN omnichannel_message.conversation_id IS 'Conversation thread ID';
COMMENT ON COLUMN omnichannel_message.sender_type IS 'Sender type: user, admin, system';
COMMENT ON COLUMN omnichannel_message.attachments IS 'Attachments as JSONB array';

-- Foreign Keys
ALTER TABLE omnichannel_message 
    ADD CONSTRAINT fk_omnichannel_message_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;
    
ALTER TABLE omnichannel_message 
    ADD CONSTRAINT fk_omnichannel_message_page_id 
    FOREIGN KEY (page_id) REFERENCES channels_platform_pages(id) ON DELETE CASCADE;
    
ALTER TABLE omnichannel_message 
    ADD CONSTRAINT fk_omnichannel_message_contact_id 
    FOREIGN KEY (contact_id) REFERENCES omnichannel_contact(id) ON DELETE SET NULL;
    
ALTER TABLE omnichannel_message 
    ADD CONSTRAINT fk_omnichannel_message_admin_id 
    FOREIGN KEY (admin_id) REFERENCES sys_users(id) ON DELETE SET NULL;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_omnichannel_message_tenant ON omnichannel_message(tenant_id);
CREATE INDEX IF NOT EXISTS idx_omnichannel_message_page ON omnichannel_message(page_id);
CREATE INDEX IF NOT EXISTS idx_omnichannel_message_contact ON omnichannel_message(contact_id) WHERE contact_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_omnichannel_message_admin ON omnichannel_message(admin_id) WHERE admin_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_omnichannel_message_conversation ON omnichannel_message(conversation_id) WHERE conversation_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_omnichannel_message_sender_type ON omnichannel_message(sender_type) WHERE sender_type IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_omnichannel_message_created_at ON omnichannel_message(created_at);
CREATE INDEX IF NOT EXISTS idx_omnichannel_message_tenant_page ON omnichannel_message(tenant_id, page_id);
CREATE INDEX IF NOT EXISTS idx_omnichannel_message_tenant_contact ON omnichannel_message(tenant_id, contact_id) WHERE contact_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_omnichannel_message_tenant_created ON omnichannel_message(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_omnichannel_message_conversation_created ON omnichannel_message(conversation_id, created_at) WHERE conversation_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_omnichannel_message_attachments ON omnichannel_message USING GIN(attachments) WHERE attachments IS NOT NULL;

-- ----------------------------------------------------------------------------
-- Triggers
-- ----------------------------------------------------------------------------

-- Auto-update updated_at timestamp for omnichannel_contact
CREATE TRIGGER trg_omnichannel_contact_updated_at
    BEFORE UPDATE ON omnichannel_contact
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Note: Platform type is determined by joining through channels_platform_pages
--       to channels_platforms, not stored in omnichannel tables
-- ============================================================================

