-- ============================================================================
-- SMS Module Domain
-- ============================================================================
-- This migration creates tables for SMS messaging infrastructure, including
-- sender accounts, phone numbers, service accounts, messages, attachments,
-- reactions, and conversation analytics
-- Dependencies: sys_tenants, sys_users (001_system_tenant.sql),
--               mkt_campaigns (007_marketing_campaigns.sql),
--               project (006_tasks_projects.sql)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. SMS_sender_accounts
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS SMS_sender_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_name VARCHAR(200) NULL,
    provider VARCHAR(100) NULL,
    account_sid VARCHAR(200) NULL,
    auth_token VARCHAR(500) NULL,
    settings JSONB NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_sms_sender_accounts_is_active CHECK (is_active IN (0, 1))
);

COMMENT ON TABLE SMS_sender_accounts IS 'Upstream SMS provider accounts (e.g., Twilio) with credentials and settings';
COMMENT ON COLUMN SMS_sender_accounts.provider IS 'Provider name (e.g., Twilio, Vonage)';
COMMENT ON COLUMN SMS_sender_accounts.account_sid IS 'Provider account SID/identifier';
COMMENT ON COLUMN SMS_sender_accounts.auth_token IS 'Authentication token (should be encrypted)';
COMMENT ON COLUMN SMS_sender_accounts.settings IS 'Additional settings (JSONB)';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sms_sender_accounts_provider ON SMS_sender_accounts(provider);
CREATE INDEX IF NOT EXISTS idx_sms_sender_accounts_active ON SMS_sender_accounts(is_active) WHERE is_active = 1;

-- ----------------------------------------------------------------------------
-- 2. SMS_sender_phone_numbers
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS SMS_sender_phone_numbers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number VARCHAR(20) NOT NULL,
    friendly_name VARCHAR(200) NULL,
    is_primary INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    assigned_to TEXT NULL,
    account_id UUID NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_sms_sender_phone_numbers_is_primary CHECK (is_primary IN (0, 1)),
    CONSTRAINT chk_sms_sender_phone_numbers_is_active CHECK (is_active IN (0, 1)),
    CONSTRAINT chk_sms_sender_phone_numbers_phone CHECK (phone_number ~ '^\+[1-9]\d{1,14}$')
);

COMMENT ON TABLE SMS_sender_phone_numbers IS 'Pool of phone numbers for sending/receiving SMS';
COMMENT ON COLUMN SMS_sender_phone_numbers.phone_number IS 'Phone number (E.164 format, e.g., +1234567890)';
COMMENT ON COLUMN SMS_sender_phone_numbers.friendly_name IS 'Human-readable name for the number';
COMMENT ON COLUMN SMS_sender_phone_numbers.is_primary IS 'Primary number flag (0/1)';

-- Foreign Keys
ALTER TABLE SMS_sender_phone_numbers 
    ADD CONSTRAINT fk_sms_sender_phone_numbers_account_id 
    FOREIGN KEY (account_id) REFERENCES SMS_sender_accounts(id) ON DELETE SET NULL;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sms_phone_numbers_account_id ON SMS_sender_phone_numbers(account_id);
CREATE INDEX IF NOT EXISTS idx_sms_phone_numbers_is_active ON SMS_sender_phone_numbers(is_active);
CREATE INDEX IF NOT EXISTS idx_sms_phone_numbers_is_primary ON SMS_sender_phone_numbers(is_primary);
CREATE INDEX IF NOT EXISTS idx_sms_phone_numbers_phone ON SMS_sender_phone_numbers(phone_number);

-- ----------------------------------------------------------------------------
-- 3. SMS_service_accounts
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS SMS_service_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_account_id UUID NULL,
    service_name VARCHAR(200) NULL,
    service_type VARCHAR(50) NULL,
    provider_service_sid VARCHAR(200) NULL,
    settings JSONB NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    linked_campaign_id BIGINT NULL,
    linked_project_id BIGINT NULL,
    description TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_sms_service_accounts_type CHECK (service_type IN ('campaign', 'conversation', 'support', 'marketing', 'transactional'))
);

COMMENT ON TABLE SMS_service_accounts IS 'Logical messaging services layered over provider accounts, linkable to campaigns/projects';
COMMENT ON COLUMN SMS_service_accounts.service_type IS 'Service type: campaign, conversation, support, marketing, transactional';
COMMENT ON COLUMN SMS_service_accounts.provider_service_sid IS 'Provider service SID (e.g., Twilio MessagingServiceSid)';

-- Foreign Keys
ALTER TABLE SMS_service_accounts 
    ADD CONSTRAINT fk_sms_service_accounts_sender_account_id 
    FOREIGN KEY (sender_account_id) REFERENCES SMS_sender_accounts(id) ON DELETE SET NULL;
    
ALTER TABLE SMS_service_accounts 
    ADD CONSTRAINT fk_sms_service_accounts_linked_campaign_id 
    FOREIGN KEY (linked_campaign_id) REFERENCES mkt_campaigns(id) ON DELETE SET NULL;
    
ALTER TABLE SMS_service_accounts 
    ADD CONSTRAINT fk_sms_service_accounts_linked_project_id 
    FOREIGN KEY (linked_project_id) REFERENCES project(id) ON DELETE SET NULL;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sms_service_accounts_sender_account ON SMS_service_accounts(sender_account_id);
CREATE INDEX IF NOT EXISTS idx_sms_service_accounts_campaign ON SMS_service_accounts(linked_campaign_id);
CREATE INDEX IF NOT EXISTS idx_sms_service_accounts_project ON SMS_service_accounts(linked_project_id);
CREATE INDEX IF NOT EXISTS idx_sms_service_accounts_type ON SMS_service_accounts(service_type);
CREATE INDEX IF NOT EXISTS idx_sms_service_accounts_active ON SMS_service_accounts(is_active) WHERE is_active = TRUE;

-- ----------------------------------------------------------------------------
-- 4. SMS_contacts
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS SMS_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NULL,
    phone VARCHAR(20) NULL,
    country_code TEXT NULL,
    area_code TEXT NULL,
    timezone TEXT NULL,
    crm_id TEXT NULL,
    last_contacted_at TIMESTAMPTZ NULL,
    assigned_phone_number_id UUID NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_sms_contacts_phone CHECK (phone IS NULL OR phone ~ '^\+[1-9]\d{1,14}$')
);

COMMENT ON TABLE SMS_contacts IS 'Address book of SMS recipients with contact information';
COMMENT ON COLUMN SMS_contacts.phone IS 'Phone number (E.164 format, e.g., +1234567890)';
COMMENT ON COLUMN SMS_contacts.crm_id IS 'CRM customer ID (link to crm_customers)';
COMMENT ON COLUMN SMS_contacts.assigned_phone_number_id IS 'Assigned phone number (FK to SMS_sender_phone_numbers)';

-- Foreign Keys
ALTER TABLE SMS_contacts 
    ADD CONSTRAINT fk_sms_contacts_assigned_phone_number_id 
    FOREIGN KEY (assigned_phone_number_id) REFERENCES SMS_sender_phone_numbers(id) ON DELETE SET NULL;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sms_contacts_phone ON SMS_contacts(phone);
CREATE INDEX IF NOT EXISTS idx_sms_contacts_crm_id ON SMS_contacts(crm_id);
CREATE INDEX IF NOT EXISTS idx_sms_contacts_assigned_phone ON SMS_contacts(assigned_phone_number_id);

-- ----------------------------------------------------------------------------
-- 5. SMS_messages
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS SMS_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    direction VARCHAR(20) NULL,
    from_number VARCHAR(20) NULL,
    to_number VARCHAR(20) NULL,
    body TEXT NULL,
    media_count INTEGER NULL,
    status VARCHAR(50) NULL,
    provider VARCHAR(100) NULL,
    provider_message_sid VARCHAR(200) NULL,
    provider_error_code TEXT NULL,
    provider_payload TEXT NULL,
    received_at TIMESTAMPTZ NULL,
    sent_at TIMESTAMPTZ NULL,
    delivered_at TIMESTAMPTZ NULL,
    failed_at TIMESTAMPTZ NULL,
    conversation_id VARCHAR(100) NULL,
    user_id TEXT NULL,
    metadata JSONB NULL,
    message_type TEXT NULL,
    sender_phone_number_id UUID NULL,
    service_account_id UUID NULL,
    read_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_sms_messages_direction CHECK (direction IN ('inbound', 'outbound'))
);

COMMENT ON TABLE SMS_messages IS 'Core message log for all inbound and outbound SMS messages';
COMMENT ON COLUMN SMS_messages.direction IS 'Message direction: inbound, outbound';
COMMENT ON COLUMN SMS_messages.body IS 'Message body (up to 1600 chars for concatenated SMS)';
COMMENT ON COLUMN SMS_messages.conversation_id IS 'Conversation identifier (links to SMS_meta_conversation)';
COMMENT ON COLUMN SMS_messages.metadata IS 'Additional metadata (JSONB)';

-- Foreign Keys
ALTER TABLE SMS_messages 
    ADD CONSTRAINT fk_sms_messages_sender_phone_number_id 
    FOREIGN KEY (sender_phone_number_id) REFERENCES SMS_sender_phone_numbers(id) ON DELETE SET NULL;
    
ALTER TABLE SMS_messages 
    ADD CONSTRAINT fk_sms_messages_service_account_id 
    FOREIGN KEY (service_account_id) REFERENCES SMS_service_accounts(id) ON DELETE SET NULL;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sms_messages_conversation_id ON SMS_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_sms_messages_to_number ON SMS_messages(to_number);
CREATE INDEX IF NOT EXISTS idx_sms_messages_from_number ON SMS_messages(from_number);
CREATE INDEX IF NOT EXISTS idx_sms_messages_status ON SMS_messages(status);
CREATE INDEX IF NOT EXISTS idx_sms_messages_service_account ON SMS_messages(service_account_id);
CREATE INDEX IF NOT EXISTS idx_sms_messages_sender_phone ON SMS_messages(sender_phone_number_id);
CREATE INDEX IF NOT EXISTS idx_sms_messages_received_at ON SMS_messages(received_at);
CREATE INDEX IF NOT EXISTS idx_sms_messages_created_at ON SMS_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_sms_messages_read_at ON SMS_messages(read_at);
CREATE INDEX IF NOT EXISTS idx_sms_messages_conversation_created ON SMS_messages(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_sms_messages_to_number_created ON SMS_messages(to_number, created_at);
CREATE INDEX IF NOT EXISTS idx_sms_messages_metadata ON SMS_messages USING GIN(metadata) WHERE metadata IS NOT NULL;

-- ----------------------------------------------------------------------------
-- 6. SMS_attachments
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS SMS_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL,
    file_url TEXT NULL,
    file_name VARCHAR(500) NULL,
    file_type VARCHAR(100) NULL,
    file_size INTEGER NULL,
    mime_type VARCHAR(100) NULL,
    provider_media_sid VARCHAR(200) NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_sms_attachments_file_size CHECK (file_size IS NULL OR file_size >= 0)
);

COMMENT ON TABLE SMS_attachments IS 'Media attachments for SMS messages (images, videos, documents)';
COMMENT ON COLUMN SMS_attachments.provider_media_sid IS 'Provider media ID (e.g., Twilio MediaSid)';

-- Foreign Keys
ALTER TABLE SMS_attachments 
    ADD CONSTRAINT fk_sms_attachments_message_id 
    FOREIGN KEY (message_id) REFERENCES SMS_messages(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sms_attachments_message_id ON SMS_attachments(message_id);
CREATE INDEX IF NOT EXISTS idx_sms_attachments_provider_media ON SMS_attachments(provider_media_sid);

-- ----------------------------------------------------------------------------
-- 7. SMS_reactions
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS SMS_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL,
    reaction_type VARCHAR(50) NULL,
    reaction_value VARCHAR(50) NULL,
    reacted_by TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE SMS_reactions IS 'Message reactions (e.g., emoji reactions, thumbs up/down)';
COMMENT ON COLUMN SMS_reactions.reaction_value IS 'Reaction value (e.g., 👍, ❤️)';

-- Foreign Keys
ALTER TABLE SMS_reactions 
    ADD CONSTRAINT fk_sms_reactions_message_id 
    FOREIGN KEY (message_id) REFERENCES SMS_messages(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sms_reactions_message_id ON SMS_reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_sms_reactions_reacted_by ON SMS_reactions(reacted_by);

-- ----------------------------------------------------------------------------
-- 8. SMS_meta_conversation
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS SMS_meta_conversation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id VARCHAR(100) NOT NULL,
    customer_id_crm BIGINT NULL,
    assigned_staff_id BIGINT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    priority VARCHAR(20) NOT NULL DEFAULT 'medium',
    tags TEXT[] NULL,
    state VARCHAR(50) NOT NULL DEFAULT 'open',
    conversation_start TIMESTAMPTZ NULL,
    conversation_end TIMESTAMPTZ NULL,
    last_message_at TIMESTAMPTZ NULL,
    message_count INTEGER NOT NULL DEFAULT 0,
    journey_stage VARCHAR(100) NULL,
    emotion VARCHAR(50) NULL,
    next_action TEXT NULL,
    summary_text TEXT NULL,
    reply_quality VARCHAR(50) NULL,
    key_points TEXT[] NULL,
    sentiment_score NUMERIC(3,2) NULL,
    ai_model VARCHAR(100) NULL,
    confidence_score NUMERIC(3,2) NULL,
    summary_updated_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    unread_count INTEGER NOT NULL DEFAULT 0,
    
    CONSTRAINT chk_sms_meta_conversation_priority CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    CONSTRAINT chk_sms_meta_conversation_state CHECK (state IN ('open', 'closed', 'archived')),
    CONSTRAINT chk_sms_meta_conversation_sentiment_score CHECK (sentiment_score IS NULL OR (sentiment_score >= -1 AND sentiment_score <= 1)),
    CONSTRAINT chk_sms_meta_conversation_confidence_score CHECK (confidence_score IS NULL OR (confidence_score >= 0 AND confidence_score <= 1)),
    CONSTRAINT chk_sms_meta_conversation_message_count CHECK (message_count >= 0),
    CONSTRAINT chk_sms_meta_conversation_unread_count CHECK (unread_count >= 0),
    CONSTRAINT uq_sms_meta_conversation_conversation_id UNIQUE (conversation_id)
);

COMMENT ON TABLE SMS_meta_conversation IS 'Conversation rollup/analytics with AI-generated summaries, sentiment analysis, and metadata';
COMMENT ON COLUMN SMS_meta_conversation.conversation_id IS 'Conversation ID (matches SMS_messages.conversation_id)';
COMMENT ON COLUMN SMS_meta_conversation.customer_id_crm IS 'CRM customer (FK to crm_customers)';
COMMENT ON COLUMN SMS_meta_conversation.assigned_staff_id IS 'Assigned staff member (FK to sys_users)';
COMMENT ON COLUMN SMS_meta_conversation.sentiment_score IS 'Sentiment score (-1 to 1)';
COMMENT ON COLUMN SMS_meta_conversation.confidence_score IS 'AI confidence score (0 to 1)';

-- Foreign Keys
-- Note: customer_id_crm FK will be added after crm_customers table is created
ALTER TABLE SMS_meta_conversation 
    ADD CONSTRAINT fk_sms_meta_conversation_assigned_staff_id 
    FOREIGN KEY (assigned_staff_id) REFERENCES sys_users(id) ON DELETE SET NULL;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sms_meta_conversation_customer ON SMS_meta_conversation(customer_id_crm);
CREATE INDEX IF NOT EXISTS idx_sms_meta_conversation_staff ON SMS_meta_conversation(assigned_staff_id);
CREATE INDEX IF NOT EXISTS idx_sms_meta_conversation_last_message ON SMS_meta_conversation(last_message_at);
CREATE INDEX IF NOT EXISTS idx_sms_meta_conversation_status ON SMS_meta_conversation(status);
CREATE INDEX IF NOT EXISTS idx_sms_meta_conversation_state ON SMS_meta_conversation(state);
CREATE INDEX IF NOT EXISTS idx_sms_meta_conversation_unread ON SMS_meta_conversation(unread_count) WHERE unread_count > 0;
CREATE INDEX IF NOT EXISTS idx_sms_meta_conversation_tags ON SMS_meta_conversation USING GIN(tags) WHERE tags IS NOT NULL;

-- ----------------------------------------------------------------------------
-- Triggers
-- ----------------------------------------------------------------------------

-- Auto-update updated_at timestamp for SMS_sender_phone_numbers
CREATE TRIGGER trg_sms_sender_phone_numbers_updated_at
    BEFORE UPDATE ON SMS_sender_phone_numbers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at timestamp for SMS_service_accounts
CREATE TRIGGER trg_sms_service_accounts_updated_at
    BEFORE UPDATE ON SMS_service_accounts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at timestamp for SMS_contacts
CREATE TRIGGER trg_sms_contacts_updated_at
    BEFORE UPDATE ON SMS_contacts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at timestamp for SMS_messages
CREATE TRIGGER trg_sms_messages_updated_at
    BEFORE UPDATE ON SMS_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at timestamp for SMS_meta_conversation
CREATE TRIGGER trg_sms_meta_conversation_updated_at
    BEFORE UPDATE ON SMS_meta_conversation
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Note: Foreign key from SMS_meta_conversation.customer_id_crm to crm_customers
--       will be added after crm_customers table is created
-- ============================================================================

