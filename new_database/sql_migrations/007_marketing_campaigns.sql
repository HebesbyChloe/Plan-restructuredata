-- ============================================================================
-- Marketing & Campaigns Domain Module
-- ============================================================================
-- This migration creates tables for marketing campaigns, promotions, assets, and brand management
-- Dependencies: sys_tenants, sys_users (001_system_tenant.sql),
--               project (006_tasks_projects.sql),
--               product, category, product_attribute (005_product_inventory.sql),
--               channels_platform_pages (002_channels_platforms.sql)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. mkt_campaigns
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mkt_campaigns (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    name VARCHAR(500) NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'planning',
    description TEXT NULL,
    budget NUMERIC(12,2) NOT NULL DEFAULT 0,
    spent NUMERIC(12,2) NOT NULL DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE NULL,
    owner_id BIGINT NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'medium',
    progress INTEGER NOT NULL DEFAULT 0,
    ai_score INTEGER NULL,
    purpose TEXT NULL,
    notes TEXT NULL,
    reach INTEGER NOT NULL DEFAULT 0,
    reach_goal INTEGER NOT NULL DEFAULT 0,
    engagement NUMERIC(5,2) NOT NULL DEFAULT 0,
    engagement_goal NUMERIC(5,2) NOT NULL DEFAULT 0,
    impressions INTEGER NOT NULL DEFAULT 0,
    clicks INTEGER NOT NULL DEFAULT 0,
    conversions INTEGER NOT NULL DEFAULT 0,
    revenue NUMERIC(12,2) NOT NULL DEFAULT 0,
    channels TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL,
    
    CONSTRAINT chk_mkt_campaigns_status CHECK (status IN ('planning', 'in-progress', 'launching', 'completed', 'draft', 'paused')),
    CONSTRAINT chk_mkt_campaigns_type CHECK (type IN ('email', 'social', 'paid-ads', 'content', 'event', 'launch')),
    CONSTRAINT chk_mkt_campaigns_priority CHECK (priority IN ('high', 'medium', 'low')),
    CONSTRAINT chk_mkt_campaigns_progress CHECK (progress >= 0 AND progress <= 100),
    CONSTRAINT chk_mkt_campaigns_ai_score CHECK (ai_score IS NULL OR (ai_score >= 0 AND ai_score <= 100)),
    CONSTRAINT chk_mkt_campaigns_dates CHECK (end_date IS NULL OR end_date >= start_date),
    CONSTRAINT chk_mkt_campaigns_engagement CHECK (engagement >= 0 AND engagement <= 100),
    CONSTRAINT chk_mkt_campaigns_engagement_goal CHECK (engagement_goal >= 0 AND engagement_goal <= 100)
);

COMMENT ON TABLE mkt_campaigns IS 'Marketing campaigns';
COMMENT ON COLUMN mkt_campaigns.type IS 'Campaign type: email, social, paid-ads, content, event, launch';
COMMENT ON COLUMN mkt_campaigns.status IS 'Campaign status: planning, in-progress, launching, completed, draft, paused';

-- Foreign Keys
ALTER TABLE mkt_campaigns 
    ADD CONSTRAINT fk_mkt_campaigns_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;
    
ALTER TABLE mkt_campaigns 
    ADD CONSTRAINT fk_mkt_campaigns_owner_id 
    FOREIGN KEY (owner_id) REFERENCES sys_users(id) ON DELETE SET NULL;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_mkt_campaigns_tenant_id ON mkt_campaigns(tenant_id);
CREATE INDEX IF NOT EXISTS idx_mkt_campaigns_tenant_status ON mkt_campaigns(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_mkt_campaigns_tenant_type ON mkt_campaigns(tenant_id, type);
CREATE INDEX IF NOT EXISTS idx_mkt_campaigns_owner_id ON mkt_campaigns(owner_id);
CREATE INDEX IF NOT EXISTS idx_mkt_campaigns_dates ON mkt_campaigns(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_mkt_campaigns_tags ON mkt_campaigns USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_mkt_campaigns_deleted_at ON mkt_campaigns(deleted_at) WHERE deleted_at IS NULL;

-- ----------------------------------------------------------------------------
-- 2. mkt_campaign_goals
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mkt_campaign_goals (
    id BIGSERIAL PRIMARY KEY,
    campaign_id BIGINT NOT NULL,
    goal_text TEXT NOT NULL,
    target_value NUMERIC(12,2) NULL,
    achieved_value NUMERIC(12,2) NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE mkt_campaign_goals IS 'Campaign goals and objectives';

-- Foreign Keys
ALTER TABLE mkt_campaign_goals 
    ADD CONSTRAINT fk_mkt_campaign_goals_campaign_id 
    FOREIGN KEY (campaign_id) REFERENCES mkt_campaigns(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_mkt_campaign_goals_campaign_id ON mkt_campaign_goals(campaign_id);

-- ----------------------------------------------------------------------------
-- 3. mkt_campaign_activities
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mkt_campaign_activities (
    id BIGSERIAL PRIMARY KEY,
    campaign_id BIGINT NOT NULL,
    title VARCHAR(500) NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'scheduled',
    date DATE NOT NULL,
    start_time TIME NULL,
    end_time TIME NULL,
    duration INTEGER NOT NULL DEFAULT 1,
    description TEXT NULL,
    location VARCHAR(500) NULL,
    budget NUMERIC(12,2) NULL,
    reach INTEGER NULL,
    notes TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL,
    
    CONSTRAINT chk_mkt_campaign_activities_type CHECK (type IN ('email', 'social', 'paid-ads', 'content', 'event', 'announcement', 'launch')),
    CONSTRAINT chk_mkt_campaign_activities_status CHECK (status IN ('scheduled', 'active', 'completed', 'cancelled')),
    CONSTRAINT chk_mkt_campaign_activities_time CHECK (end_time IS NULL OR start_time IS NULL OR end_time >= start_time),
    CONSTRAINT chk_mkt_campaign_activities_duration CHECK (duration > 0)
);

COMMENT ON TABLE mkt_campaign_activities IS 'Action milestones/events within campaigns (independent of projects/tasks)';
COMMENT ON COLUMN mkt_campaign_activities.type IS 'Activity type: email, social, paid-ads, content, event, announcement, launch';
COMMENT ON COLUMN mkt_campaign_activities.status IS 'Activity status: scheduled, active, completed, cancelled';

-- Foreign Keys
ALTER TABLE mkt_campaign_activities 
    ADD CONSTRAINT fk_mkt_campaign_activities_campaign_id 
    FOREIGN KEY (campaign_id) REFERENCES mkt_campaigns(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_mkt_campaign_activities_campaign_id ON mkt_campaign_activities(campaign_id);
CREATE INDEX IF NOT EXISTS idx_mkt_campaign_activities_date ON mkt_campaign_activities(date);
CREATE INDEX IF NOT EXISTS idx_mkt_campaign_activities_status ON mkt_campaign_activities(status);
CREATE INDEX IF NOT EXISTS idx_mkt_campaign_activities_type ON mkt_campaign_activities(type);
CREATE INDEX IF NOT EXISTS idx_mkt_campaign_activities_campaign_date ON mkt_campaign_activities(campaign_id, date);
CREATE INDEX IF NOT EXISTS idx_mkt_campaign_activities_deleted_at ON mkt_campaign_activities(deleted_at) WHERE deleted_at IS NULL;

-- ----------------------------------------------------------------------------
-- 4. mkt_campaign_projects
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mkt_campaign_projects (
    campaign_id BIGINT NOT NULL,
    project_id BIGINT NOT NULL,
    role VARCHAR(50) NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_mkt_campaign_projects_role CHECK (role IS NULL OR role IN ('main', 'sub', 'support')),
    CONSTRAINT pk_mkt_campaign_projects PRIMARY KEY (campaign_id, project_id)
);

COMMENT ON TABLE mkt_campaign_projects IS 'Junction table linking campaigns to projects (N:M relationship) for complex activities';
COMMENT ON COLUMN mkt_campaign_projects.role IS 'Role of project in campaign: main, sub, support';

-- Foreign Keys
ALTER TABLE mkt_campaign_projects 
    ADD CONSTRAINT fk_mkt_campaign_projects_campaign_id 
    FOREIGN KEY (campaign_id) REFERENCES mkt_campaigns(id) ON DELETE CASCADE;
    
ALTER TABLE mkt_campaign_projects 
    ADD CONSTRAINT fk_mkt_campaign_projects_project_id 
    FOREIGN KEY (project_id) REFERENCES project(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_mkt_campaign_projects_campaign ON mkt_campaign_projects(campaign_id);
CREATE INDEX IF NOT EXISTS idx_mkt_campaign_projects_project ON mkt_campaign_projects(project_id);
CREATE INDEX IF NOT EXISTS idx_mkt_campaign_projects_role ON mkt_campaign_projects(role) WHERE role IS NOT NULL;

-- ----------------------------------------------------------------------------
-- 5. mkt_promotions
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mkt_promotions (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    name VARCHAR(200) NOT NULL,
    code VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'draft',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    percentage_value NUMERIC(5,2) NULL,
    value_amount NUMERIC(12,2) NULL,
    buy_quantity INTEGER NULL,
    get_quantity INTEGER NULL,
    bogo_discount_percent INTEGER NULL,
    bmgm_mode VARCHAR(20) NULL,
    bmgm_discount_percent INTEGER NULL,
    minimum_purchase NUMERIC(12,2) NULL,
    max_discount NUMERIC(12,2) NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    target_audience VARCHAR(200) NULL,
    redemptions INTEGER NOT NULL DEFAULT 0,
    revenue VARCHAR(100) NULL,
    usage_limit INTEGER NULL,
    used_count INTEGER NOT NULL DEFAULT 0,
    description TEXT NULL,
    is_auto_apply BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL,
    
    CONSTRAINT chk_mkt_promotions_type CHECK (type IN ('percentage', 'fixed_amount', 'free_shipping', 'buy_x_get_y', 'buy_more_get_more')),
    CONSTRAINT chk_mkt_promotions_status CHECK (status IN ('active', 'scheduled', 'draft', 'expired', 'archived')),
    CONSTRAINT chk_mkt_promotions_bmgm_mode CHECK (bmgm_mode IS NULL OR bmgm_mode IN ('discount', 'product')),
    CONSTRAINT chk_mkt_promotions_dates CHECK (end_date >= start_date),
    CONSTRAINT chk_mkt_promotions_percentage CHECK (percentage_value IS NULL OR (percentage_value >= 0 AND percentage_value <= 100)),
    CONSTRAINT uq_mkt_promotions_tenant_code UNIQUE (tenant_id, code)
);

COMMENT ON TABLE mkt_promotions IS 'Promotional campaigns and discount codes';
COMMENT ON COLUMN mkt_promotions.type IS 'Promotion type: percentage, fixed_amount, free_shipping, buy_x_get_y, buy_more_get_more';
COMMENT ON COLUMN mkt_promotions.status IS 'Promotion status: active, scheduled, draft, expired, archived';

-- Foreign Keys
ALTER TABLE mkt_promotions 
    ADD CONSTRAINT fk_mkt_promotions_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_mkt_promotions_tenant_id ON mkt_promotions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_mkt_promotions_tenant_code ON mkt_promotions(tenant_id, code);
CREATE INDEX IF NOT EXISTS idx_mkt_promotions_status ON mkt_promotions(status);
CREATE INDEX IF NOT EXISTS idx_mkt_promotions_dates ON mkt_promotions(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_mkt_promotions_type ON mkt_promotions(type);
CREATE INDEX IF NOT EXISTS idx_mkt_promotions_deleted_at ON mkt_promotions(deleted_at) WHERE deleted_at IS NULL;

-- ----------------------------------------------------------------------------
-- 6. mkt_promotion_campaigns
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mkt_promotion_campaigns (
    promotion_id BIGINT NOT NULL,
    campaign_id BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT pk_mkt_promotion_campaigns PRIMARY KEY (promotion_id, campaign_id)
);

COMMENT ON TABLE mkt_promotion_campaigns IS 'Junction table linking promotions to campaigns';

-- Foreign Keys
ALTER TABLE mkt_promotion_campaigns 
    ADD CONSTRAINT fk_mkt_promotion_campaigns_promotion_id 
    FOREIGN KEY (promotion_id) REFERENCES mkt_promotions(id) ON DELETE CASCADE;
    
ALTER TABLE mkt_promotion_campaigns 
    ADD CONSTRAINT fk_mkt_promotion_campaigns_campaign_id 
    FOREIGN KEY (campaign_id) REFERENCES mkt_campaigns(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_mkt_promotion_campaigns_promotion ON mkt_promotion_campaigns(promotion_id);
CREATE INDEX IF NOT EXISTS idx_mkt_promotion_campaigns_campaign ON mkt_promotion_campaigns(campaign_id);

-- ----------------------------------------------------------------------------
-- 7. mkt_promotion_channels
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mkt_promotion_channels (
    promotion_id BIGINT NOT NULL,
    channel_id BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT pk_mkt_promotion_channels PRIMARY KEY (promotion_id, channel_id)
);

COMMENT ON TABLE mkt_promotion_channels IS 'Junction table linking promotions to marketing channels';

-- Foreign Keys
ALTER TABLE mkt_promotion_channels 
    ADD CONSTRAINT fk_mkt_promotion_channels_promotion_id 
    FOREIGN KEY (promotion_id) REFERENCES mkt_promotions(id) ON DELETE CASCADE;

-- Note: channel_id FK will be added after mkt_marketing_channels table is created

-- Indexes
CREATE INDEX IF NOT EXISTS idx_mkt_promotion_channels_promotion ON mkt_promotion_channels(promotion_id);
CREATE INDEX IF NOT EXISTS idx_mkt_promotion_channels_channel ON mkt_promotion_channels(channel_id);

-- ----------------------------------------------------------------------------
-- 8. mkt_promotion_products
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mkt_promotion_products (
    promotion_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT pk_mkt_promotion_products PRIMARY KEY (promotion_id, product_id)
);

COMMENT ON TABLE mkt_promotion_products IS 'Junction table linking promotions to products';

-- Foreign Keys
ALTER TABLE mkt_promotion_products 
    ADD CONSTRAINT fk_mkt_promotion_products_promotion_id 
    FOREIGN KEY (promotion_id) REFERENCES mkt_promotions(id) ON DELETE CASCADE;
    
ALTER TABLE mkt_promotion_products 
    ADD CONSTRAINT fk_mkt_promotion_products_product_id 
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_mkt_promotion_products_promotion ON mkt_promotion_products(promotion_id);
CREATE INDEX IF NOT EXISTS idx_mkt_promotion_products_product ON mkt_promotion_products(product_id);

-- ----------------------------------------------------------------------------
-- 9. mkt_promotion_categories
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mkt_promotion_categories (
    promotion_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT pk_mkt_promotion_categories PRIMARY KEY (promotion_id, category_id)
);

COMMENT ON TABLE mkt_promotion_categories IS 'Junction table linking promotions to product categories';

-- Foreign Keys
ALTER TABLE mkt_promotion_categories 
    ADD CONSTRAINT fk_mkt_promotion_categories_promotion_id 
    FOREIGN KEY (promotion_id) REFERENCES mkt_promotions(id) ON DELETE CASCADE;
    
ALTER TABLE mkt_promotion_categories 
    ADD CONSTRAINT fk_mkt_promotion_categories_category_id 
    FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_mkt_promotion_categories_promotion ON mkt_promotion_categories(promotion_id);
CREATE INDEX IF NOT EXISTS idx_mkt_promotion_categories_category ON mkt_promotion_categories(category_id);

-- ----------------------------------------------------------------------------
-- 10. mkt_promotion_attributes
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mkt_promotion_attributes (
    promotion_id BIGINT NOT NULL,
    attribute_id BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT pk_mkt_promotion_attributes PRIMARY KEY (promotion_id, attribute_id)
);

COMMENT ON TABLE mkt_promotion_attributes IS 'Junction table linking promotions to product attributes';

-- Foreign Keys
ALTER TABLE mkt_promotion_attributes 
    ADD CONSTRAINT fk_mkt_promotion_attributes_promotion_id 
    FOREIGN KEY (promotion_id) REFERENCES mkt_promotions(id) ON DELETE CASCADE;
    
ALTER TABLE mkt_promotion_attributes 
    ADD CONSTRAINT fk_mkt_promotion_attributes_attribute_id 
    FOREIGN KEY (attribute_id) REFERENCES product_attribute(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_mkt_promotion_attributes_promotion ON mkt_promotion_attributes(promotion_id);
CREATE INDEX IF NOT EXISTS idx_mkt_promotion_attributes_attribute ON mkt_promotion_attributes(attribute_id);

-- ----------------------------------------------------------------------------
-- 11. mkt_promotion_exclusions
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mkt_promotion_exclusions (
    id BIGSERIAL PRIMARY KEY,
    promotion_id BIGINT NOT NULL,
    exclusion_type VARCHAR(50) NOT NULL,
    excluded_id BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_mkt_promotion_exclusions_type CHECK (exclusion_type IN ('product', 'category', 'attribute'))
);

COMMENT ON TABLE mkt_promotion_exclusions IS 'Products/categories/attributes excluded from promotions';
COMMENT ON COLUMN mkt_promotion_exclusions.exclusion_type IS 'Exclusion type: product, category, attribute';
COMMENT ON COLUMN mkt_promotion_exclusions.excluded_id IS 'ID of excluded entity (polymorphic)';

-- Foreign Keys
ALTER TABLE mkt_promotion_exclusions 
    ADD CONSTRAINT fk_mkt_promotion_exclusions_promotion_id 
    FOREIGN KEY (promotion_id) REFERENCES mkt_promotions(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_mkt_promotion_exclusions_promotion ON mkt_promotion_exclusions(promotion_id);
CREATE INDEX IF NOT EXISTS idx_mkt_promotion_exclusions_type ON mkt_promotion_exclusions(exclusion_type, excluded_id);

-- ----------------------------------------------------------------------------
-- 12. mkt_promotion_bmgm_products
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mkt_promotion_bmgm_products (
    promotion_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT pk_mkt_promotion_bmgm_products PRIMARY KEY (promotion_id, product_id)
);

COMMENT ON TABLE mkt_promotion_bmgm_products IS 'Junction table for products in Buy More Get More promotions';

-- Foreign Keys
ALTER TABLE mkt_promotion_bmgm_products 
    ADD CONSTRAINT fk_mkt_promotion_bmgm_products_promotion_id 
    FOREIGN KEY (promotion_id) REFERENCES mkt_promotions(id) ON DELETE CASCADE;
    
ALTER TABLE mkt_promotion_bmgm_products 
    ADD CONSTRAINT fk_mkt_promotion_bmgm_products_product_id 
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_mkt_promotion_bmgm_products_promotion ON mkt_promotion_bmgm_products(promotion_id);
CREATE INDEX IF NOT EXISTS idx_mkt_promotion_bmgm_products_product ON mkt_promotion_bmgm_products(product_id);

-- ----------------------------------------------------------------------------
-- 13. mkt_promotion_free_items
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mkt_promotion_free_items (
    id BIGSERIAL PRIMARY KEY,
    promotion_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE mkt_promotion_free_items IS 'Free items for promotions';

-- Foreign Keys
ALTER TABLE mkt_promotion_free_items 
    ADD CONSTRAINT fk_mkt_promotion_free_items_promotion_id 
    FOREIGN KEY (promotion_id) REFERENCES mkt_promotions(id) ON DELETE CASCADE;
    
ALTER TABLE mkt_promotion_free_items 
    ADD CONSTRAINT fk_mkt_promotion_free_items_product_id 
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_mkt_promotion_free_items_promotion ON mkt_promotion_free_items(promotion_id);
CREATE INDEX IF NOT EXISTS idx_mkt_promotion_free_items_product ON mkt_promotion_free_items(product_id);

-- ----------------------------------------------------------------------------
-- 14. mkt_asset_folders
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mkt_asset_folders (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT NULL,
    parent_folder_id BIGINT NULL,
    item_count INTEGER NOT NULL DEFAULT 0,
    color VARCHAR(20) NULL,
    last_modified TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by BIGINT NULL,
    ai_optimized BOOLEAN NOT NULL DEFAULT FALSE,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL
);

COMMENT ON TABLE mkt_asset_folders IS 'Asset folder organization';

-- Foreign Keys
ALTER TABLE mkt_asset_folders 
    ADD CONSTRAINT fk_mkt_asset_folders_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;
    
ALTER TABLE mkt_asset_folders 
    ADD CONSTRAINT fk_mkt_asset_folders_parent_folder_id 
    FOREIGN KEY (parent_folder_id) REFERENCES mkt_asset_folders(id) ON DELETE SET NULL;
    
ALTER TABLE mkt_asset_folders 
    ADD CONSTRAINT fk_mkt_asset_folders_modified_by 
    FOREIGN KEY (modified_by) REFERENCES sys_users(id) ON DELETE SET NULL;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_mkt_asset_folders_tenant_id ON mkt_asset_folders(tenant_id);
CREATE INDEX IF NOT EXISTS idx_mkt_asset_folders_parent ON mkt_asset_folders(parent_folder_id);
CREATE INDEX IF NOT EXISTS idx_mkt_asset_folders_tags ON mkt_asset_folders USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_mkt_asset_folders_deleted_at ON mkt_asset_folders(deleted_at) WHERE deleted_at IS NULL;

-- ----------------------------------------------------------------------------
-- 15. mkt_marketing_assets
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mkt_marketing_assets (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    name VARCHAR(500) NOT NULL,
    type VARCHAR(50) NOT NULL,
    category VARCHAR(200) NULL,
    size VARCHAR(50) NULL,
    format VARCHAR(50) NULL,
    dimensions VARCHAR(100) NULL,
    url VARCHAR(1000) NOT NULL,
    thumbnail_url VARCHAR(1000) NULL,
    folder_id BIGINT NULL,
    date_added DATE NOT NULL DEFAULT CURRENT_DATE,
    added_by BIGINT NULL,
    usage_count INTEGER NOT NULL DEFAULT 0,
    ai_score INTEGER NULL,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL,
    
    CONSTRAINT chk_mkt_marketing_assets_type CHECK (type IN ('image', 'video', 'document', 'template', 'graphic')),
    CONSTRAINT chk_mkt_marketing_assets_ai_score CHECK (ai_score IS NULL OR (ai_score >= 0 AND ai_score <= 100))
);

COMMENT ON TABLE mkt_marketing_assets IS 'Marketing assets (images, videos, documents, templates)';
COMMENT ON COLUMN mkt_marketing_assets.type IS 'Asset type: image, video, document, template, graphic';

-- Foreign Keys
ALTER TABLE mkt_marketing_assets 
    ADD CONSTRAINT fk_mkt_marketing_assets_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;
    
ALTER TABLE mkt_marketing_assets 
    ADD CONSTRAINT fk_mkt_marketing_assets_folder_id 
    FOREIGN KEY (folder_id) REFERENCES mkt_asset_folders(id) ON DELETE SET NULL;
    
ALTER TABLE mkt_marketing_assets 
    ADD CONSTRAINT fk_mkt_marketing_assets_added_by 
    FOREIGN KEY (added_by) REFERENCES sys_users(id) ON DELETE SET NULL;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_mkt_marketing_assets_tenant_id ON mkt_marketing_assets(tenant_id);
CREATE INDEX IF NOT EXISTS idx_mkt_marketing_assets_type ON mkt_marketing_assets(type);
CREATE INDEX IF NOT EXISTS idx_mkt_marketing_assets_folder_id ON mkt_marketing_assets(folder_id);
CREATE INDEX IF NOT EXISTS idx_mkt_marketing_assets_tags ON mkt_marketing_assets USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_mkt_marketing_assets_deleted_at ON mkt_marketing_assets(deleted_at) WHERE deleted_at IS NULL;

-- ----------------------------------------------------------------------------
-- 16. mkt_brand_settings
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mkt_brand_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    tenant_id BIGINT NOT NULL,
    story TEXT NULL,
    slogan VARCHAR(500) NULL,
    tagline VARCHAR(500) NULL,
    vision TEXT NULL,
    mission TEXT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT uq_mkt_brand_settings_tenant UNIQUE (tenant_id)
);

COMMENT ON TABLE mkt_brand_settings IS 'Brand identity (single row per tenant)';

-- Foreign Keys
ALTER TABLE mkt_brand_settings 
    ADD CONSTRAINT fk_mkt_brand_settings_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_mkt_brand_settings_tenant_id ON mkt_brand_settings(tenant_id);

-- ----------------------------------------------------------------------------
-- 17. mkt_brand_colors
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mkt_brand_colors (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    name VARCHAR(200) NOT NULL,
    hex VARCHAR(20) NOT NULL,
    category VARCHAR(50) NOT NULL,
    usage VARCHAR(500) NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_mkt_brand_colors_category CHECK (category IN ('primary', 'secondary', 'neutral'))
);

COMMENT ON TABLE mkt_brand_colors IS 'Brand color palette';
COMMENT ON COLUMN mkt_brand_colors.category IS 'Color category: primary, secondary, neutral';

-- Foreign Keys
ALTER TABLE mkt_brand_colors 
    ADD CONSTRAINT fk_mkt_brand_colors_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_mkt_brand_colors_tenant_id ON mkt_brand_colors(tenant_id);
CREATE INDEX IF NOT EXISTS idx_mkt_brand_colors_category ON mkt_brand_colors(category);
CREATE INDEX IF NOT EXISTS idx_mkt_brand_colors_sort ON mkt_brand_colors(tenant_id, category, sort_order);

-- ----------------------------------------------------------------------------
-- 18. mkt_brand_typography
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mkt_brand_typography (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    name VARCHAR(200) NOT NULL,
    size VARCHAR(50) NOT NULL,
    weight VARCHAR(50) NOT NULL,
    line_height VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    usage VARCHAR(500) NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_mkt_brand_typography_category CHECK (category IN ('headings', 'body'))
);

COMMENT ON TABLE mkt_brand_typography IS 'Brand typography styles';
COMMENT ON COLUMN mkt_brand_typography.category IS 'Typography category: headings, body';

-- Foreign Keys
ALTER TABLE mkt_brand_typography 
    ADD CONSTRAINT fk_mkt_brand_typography_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_mkt_brand_typography_tenant_id ON mkt_brand_typography(tenant_id);
CREATE INDEX IF NOT EXISTS idx_mkt_brand_typography_category ON mkt_brand_typography(category);
CREATE INDEX IF NOT EXISTS idx_mkt_brand_typography_sort ON mkt_brand_typography(tenant_id, category, sort_order);

-- ----------------------------------------------------------------------------
-- 19. mkt_brand_logos
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mkt_brand_logos (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    name VARCHAR(200) NOT NULL,
    variation_type VARCHAR(50) NOT NULL,
    logo_url VARCHAR(1000) NOT NULL,
    thumbnail_url VARCHAR(1000) NULL,
    background_color VARCHAR(20) NULL,
    is_dark BOOLEAN NOT NULL DEFAULT FALSE,
    description TEXT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_mkt_brand_logos_variation_type CHECK (variation_type IN ('primary', 'dark', 'icon_only', 'monochrome'))
);

COMMENT ON TABLE mkt_brand_logos IS 'Brand logo variations';
COMMENT ON COLUMN mkt_brand_logos.variation_type IS 'Logo variation type: primary, dark, icon_only, monochrome';

-- Foreign Keys
ALTER TABLE mkt_brand_logos 
    ADD CONSTRAINT fk_mkt_brand_logos_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_mkt_brand_logos_tenant_id ON mkt_brand_logos(tenant_id);
CREATE INDEX IF NOT EXISTS idx_mkt_brand_logos_variation ON mkt_brand_logos(variation_type);
CREATE INDEX IF NOT EXISTS idx_mkt_brand_logos_sort ON mkt_brand_logos(tenant_id, sort_order);

-- ----------------------------------------------------------------------------
-- 20. mkt_brand_guidelines
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mkt_brand_guidelines (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    items JSONB NOT NULL DEFAULT '[]',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_mkt_brand_guidelines_category CHECK (category IN ('logo_usage', 'typography_rules', 'color_application', 'voice_tone'))
);

COMMENT ON TABLE mkt_brand_guidelines IS 'Brand guidelines and rules';
COMMENT ON COLUMN mkt_brand_guidelines.category IS 'Guideline category: logo_usage, typography_rules, color_application, voice_tone';
COMMENT ON COLUMN mkt_brand_guidelines.items IS 'Array of guideline items (stored as JSON)';

-- Foreign Keys
ALTER TABLE mkt_brand_guidelines 
    ADD CONSTRAINT fk_mkt_brand_guidelines_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_mkt_brand_guidelines_tenant_id ON mkt_brand_guidelines(tenant_id);
CREATE INDEX IF NOT EXISTS idx_mkt_brand_guidelines_category ON mkt_brand_guidelines(category);
CREATE INDEX IF NOT EXISTS idx_mkt_brand_guidelines_items ON mkt_brand_guidelines USING GIN(items);

-- ----------------------------------------------------------------------------
-- 21. mkt_affiliates
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mkt_affiliates (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(50) NOT NULL,
    email VARCHAR(200) NOT NULL,
    platform VARCHAR(200) NULL,
    commission_rate NUMERIC(5,2) NOT NULL DEFAULT 0,
    revenue NUMERIC(12,2) NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    join_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL,
    
    CONSTRAINT chk_mkt_affiliates_type CHECK (type IN ('Affiliate', 'KOL', 'Influencer')),
    CONSTRAINT chk_mkt_affiliates_status CHECK (status IN ('active', 'inactive', 'pending'))
);

COMMENT ON TABLE mkt_affiliates IS 'Affiliates, KOLs, and influencers';
COMMENT ON COLUMN mkt_affiliates.type IS 'Affiliate type: Affiliate, KOL, Influencer';
COMMENT ON COLUMN mkt_affiliates.status IS 'Status: active, inactive, pending';

-- Foreign Keys
ALTER TABLE mkt_affiliates 
    ADD CONSTRAINT fk_mkt_affiliates_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_mkt_affiliates_tenant_id ON mkt_affiliates(tenant_id);
CREATE INDEX IF NOT EXISTS idx_mkt_affiliates_type ON mkt_affiliates(type);
CREATE INDEX IF NOT EXISTS idx_mkt_affiliates_status ON mkt_affiliates(status);
CREATE INDEX IF NOT EXISTS idx_mkt_affiliates_email ON mkt_affiliates(email);
CREATE INDEX IF NOT EXISTS idx_mkt_affiliates_deleted_at ON mkt_affiliates(deleted_at) WHERE deleted_at IS NULL;

-- ----------------------------------------------------------------------------
-- 22. mkt_utm_links
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mkt_utm_links (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    name VARCHAR(200) NOT NULL,
    url TEXT NOT NULL,
    short_url VARCHAR(200) NOT NULL,
    campaign VARCHAR(200) NOT NULL,
    source VARCHAR(200) NOT NULL,
    medium VARCHAR(200) NOT NULL,
    clicks INTEGER NOT NULL DEFAULT 0,
    conversions INTEGER NOT NULL DEFAULT 0,
    created_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL
);

COMMENT ON TABLE mkt_utm_links IS 'UTM tracking links';

-- Foreign Keys
ALTER TABLE mkt_utm_links 
    ADD CONSTRAINT fk_mkt_utm_links_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_mkt_utm_links_tenant_id ON mkt_utm_links(tenant_id);
CREATE INDEX IF NOT EXISTS idx_mkt_utm_links_campaign ON mkt_utm_links(campaign);
CREATE INDEX IF NOT EXISTS idx_mkt_utm_links_short_url ON mkt_utm_links(short_url);
CREATE INDEX IF NOT EXISTS idx_mkt_utm_links_deleted_at ON mkt_utm_links(deleted_at) WHERE deleted_at IS NULL;

-- ----------------------------------------------------------------------------
-- 23. mkt_reference_documents
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mkt_reference_documents (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    title VARCHAR(500) NOT NULL,
    category VARCHAR(200) NOT NULL,
    description TEXT NULL,
    file_url VARCHAR(1000) NULL,
    size VARCHAR(50) NULL,
    updated_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL
);

COMMENT ON TABLE mkt_reference_documents IS 'Reference documents and resources';

-- Foreign Keys
ALTER TABLE mkt_reference_documents 
    ADD CONSTRAINT fk_mkt_reference_documents_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_mkt_reference_docs_tenant_id ON mkt_reference_documents(tenant_id);
CREATE INDEX IF NOT EXISTS idx_mkt_reference_docs_category ON mkt_reference_documents(category);
CREATE INDEX IF NOT EXISTS idx_mkt_reference_docs_deleted_at ON mkt_reference_documents(deleted_at) WHERE deleted_at IS NULL;

-- ----------------------------------------------------------------------------
-- 24. mkt_marketing_channels
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mkt_marketing_channels (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(200) NOT NULL,
    platform VARCHAR(200) NOT NULL,
    reach INTEGER NOT NULL DEFAULT 0,
    engagement NUMERIC(5,2) NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    budget NUMERIC(12,2) NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL,
    
    CONSTRAINT chk_mkt_marketing_channels_status CHECK (status IN ('active', 'inactive'))
);

COMMENT ON TABLE mkt_marketing_channels IS 'Marketing channels';
COMMENT ON COLUMN mkt_marketing_channels.status IS 'Channel status: active, inactive';

-- Foreign Keys
ALTER TABLE mkt_marketing_channels 
    ADD CONSTRAINT fk_mkt_marketing_channels_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;

-- Now add FK from mkt_promotion_channels.channel_id
ALTER TABLE mkt_promotion_channels 
    ADD CONSTRAINT fk_mkt_promotion_channels_channel_id 
    FOREIGN KEY (channel_id) REFERENCES mkt_marketing_channels(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_mkt_marketing_channels_tenant_id ON mkt_marketing_channels(tenant_id);
CREATE INDEX IF NOT EXISTS idx_mkt_marketing_channels_status ON mkt_marketing_channels(status);
CREATE INDEX IF NOT EXISTS idx_mkt_marketing_channels_platform ON mkt_marketing_channels(platform);
CREATE INDEX IF NOT EXISTS idx_mkt_marketing_channels_deleted_at ON mkt_marketing_channels(deleted_at) WHERE deleted_at IS NULL;

-- ----------------------------------------------------------------------------
-- 25. mkt_campaign_activities_history
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mkt_campaign_activities_history (
    id BIGSERIAL PRIMARY KEY,
    activity_id BIGINT NOT NULL,
    old_date DATE NOT NULL,
    new_date DATE NOT NULL,
    changed_by BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE mkt_campaign_activities_history IS 'History of activity date changes';

-- Foreign Keys
ALTER TABLE mkt_campaign_activities_history 
    ADD CONSTRAINT fk_mkt_campaign_activities_history_activity_id 
    FOREIGN KEY (activity_id) REFERENCES mkt_campaign_activities(id) ON DELETE CASCADE;
    
ALTER TABLE mkt_campaign_activities_history 
    ADD CONSTRAINT fk_mkt_campaign_activities_history_changed_by 
    FOREIGN KEY (changed_by) REFERENCES sys_users(id) ON DELETE SET NULL;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_mkt_campaign_activities_history_activity ON mkt_campaign_activities_history(activity_id);

-- ----------------------------------------------------------------------------
-- 26. mkt_promotion_redemptions
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mkt_promotion_redemptions (
    id BIGSERIAL PRIMARY KEY,
    promotion_id BIGINT NOT NULL,
    order_id BIGINT NULL,
    customer_id BIGINT NULL,
    discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    redeemed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE mkt_promotion_redemptions IS 'Promotion redemption tracking';

-- Foreign Keys
ALTER TABLE mkt_promotion_redemptions 
    ADD CONSTRAINT fk_mkt_promotion_redemptions_promotion_id 
    FOREIGN KEY (promotion_id) REFERENCES mkt_promotions(id) ON DELETE CASCADE;
    
-- Note: order_id and customer_id FKs will be added after orders and crm_customers tables exist

-- Indexes
CREATE INDEX IF NOT EXISTS idx_mkt_promotion_redemptions_promotion ON mkt_promotion_redemptions(promotion_id);
CREATE INDEX IF NOT EXISTS idx_mkt_promotion_redemptions_order ON mkt_promotion_redemptions(order_id);
CREATE INDEX IF NOT EXISTS idx_mkt_promotion_redemptions_customer ON mkt_promotion_redemptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_mkt_promotion_redemptions_date ON mkt_promotion_redemptions(redeemed_at);

-- ----------------------------------------------------------------------------
-- Triggers
-- ----------------------------------------------------------------------------

-- Auto-update updated_at timestamp for mkt_campaigns
CREATE TRIGGER trg_mkt_campaigns_updated_at
    BEFORE UPDATE ON mkt_campaigns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at timestamp for mkt_campaign_goals
CREATE TRIGGER trg_mkt_campaign_goals_updated_at
    BEFORE UPDATE ON mkt_campaign_goals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at timestamp for mkt_campaign_activities
CREATE TRIGGER trg_mkt_campaign_activities_updated_at
    BEFORE UPDATE ON mkt_campaign_activities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at timestamp for mkt_promotions
CREATE TRIGGER trg_mkt_promotions_updated_at
    BEFORE UPDATE ON mkt_promotions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at timestamp for mkt_asset_folders
CREATE TRIGGER trg_mkt_asset_folders_updated_at
    BEFORE UPDATE ON mkt_asset_folders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at timestamp for mkt_marketing_assets
CREATE TRIGGER trg_mkt_marketing_assets_updated_at
    BEFORE UPDATE ON mkt_marketing_assets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at timestamp for mkt_brand_settings
CREATE TRIGGER trg_mkt_brand_settings_updated_at
    BEFORE UPDATE ON mkt_brand_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at timestamp for mkt_brand_colors
CREATE TRIGGER trg_mkt_brand_colors_updated_at
    BEFORE UPDATE ON mkt_brand_colors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at timestamp for mkt_brand_typography
CREATE TRIGGER trg_mkt_brand_typography_updated_at
    BEFORE UPDATE ON mkt_brand_typography
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at timestamp for mkt_brand_logos
CREATE TRIGGER trg_mkt_brand_logos_updated_at
    BEFORE UPDATE ON mkt_brand_logos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at timestamp for mkt_brand_guidelines
CREATE TRIGGER trg_mkt_brand_guidelines_updated_at
    BEFORE UPDATE ON mkt_brand_guidelines
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at timestamp for mkt_affiliates
CREATE TRIGGER trg_mkt_affiliates_updated_at
    BEFORE UPDATE ON mkt_affiliates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at timestamp for mkt_utm_links
CREATE TRIGGER trg_mkt_utm_links_updated_at
    BEFORE UPDATE ON mkt_utm_links
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at timestamp for mkt_reference_documents
CREATE TRIGGER trg_mkt_reference_documents_updated_at
    BEFORE UPDATE ON mkt_reference_documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at timestamp for mkt_marketing_channels
CREATE TRIGGER trg_mkt_marketing_channels_updated_at
    BEFORE UPDATE ON mkt_marketing_channels
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Note: Foreign keys from mkt_promotion_redemptions to orders and crm_customers
--       will be added after those tables are created
-- ============================================================================

