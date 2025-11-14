-- ============================================================================
-- Promotion Module
-- ============================================================================
-- This migration creates tables for promotion management, discount rules, BOGO rules,
-- bundle rules, tiered rules, coupon codes, product eligibility, price overrides, and usage tracking
-- Dependencies: sys_tenants (001_system_tenant.sql),
--               mkt_campaigns (will be created later),
--               crm_customers (003_crm_customer.sql),
--               orders (004_orders_domain.sql)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. promo
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS promo (
    id BIGSERIAL PRIMARY KEY,
    promo_code VARCHAR(100) UNIQUE NOT NULL,
    promo_name VARCHAR(500) NOT NULL,
    promo_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'draft',
    start_date TIMESTAMPTZ NULL,
    end_date TIMESTAMPTZ NULL,
    usage_limit_total INTEGER NULL,
    usage_count INTEGER NOT NULL DEFAULT 0,
    usage_limit_per_customer INTEGER NULL,
    eligibility_rules JSONB NULL,
    platform_sync JSONB NULL,
    tenant_id INTEGER NOT NULL,
    created_by INTEGER NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT chk_promo_type CHECK (promo_type IN ('discount', 'bogo', 'bundle', 'tiered', 'free_shipping')),
    CONSTRAINT chk_promo_status CHECK (status IN ('draft', 'active', 'paused', 'expired', 'archived'))
);

COMMENT ON TABLE promo IS 'Base promotion table with all promotion logic. Central table for all promotions.';
COMMENT ON COLUMN promo.id IS 'Promotion identifier';
COMMENT ON COLUMN promo.promo_code IS 'Unique promotion code';
COMMENT ON COLUMN promo.promo_name IS 'Promotion name';
COMMENT ON COLUMN promo.promo_type IS 'Promotion type: discount, bogo, bundle, tiered, free_shipping';
COMMENT ON COLUMN promo.status IS 'Promotion status: draft, active, paused, expired, archived';
COMMENT ON COLUMN promo.start_date IS 'Promotion start date';
COMMENT ON COLUMN promo.end_date IS 'Promotion end date';
COMMENT ON COLUMN promo.usage_limit_total IS 'Total usage limit across all customers';
COMMENT ON COLUMN promo.usage_count IS 'Current usage count';
COMMENT ON COLUMN promo.usage_limit_per_customer IS 'Usage limit per customer';
COMMENT ON COLUMN promo.eligibility_rules IS 'Advanced eligibility rules (customer segments, tags, shipping countries, prerequisites, etc.)';
COMMENT ON COLUMN promo.platform_sync IS 'Platform integration data (price_rule_id, status, last_synced)';
COMMENT ON COLUMN promo.tenant_id IS 'Tenant identifier';
COMMENT ON COLUMN promo.created_by IS 'Staff who created (logical link to hr_staff)';

-- Foreign Keys
ALTER TABLE promo 
    ADD CONSTRAINT fk_promo_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_promo_tenant_id ON promo(tenant_id);
CREATE INDEX IF NOT EXISTS idx_promo_promo_code ON promo(promo_code);
CREATE INDEX IF NOT EXISTS idx_promo_status ON promo(status);
CREATE INDEX IF NOT EXISTS idx_promo_type ON promo(promo_type);
CREATE INDEX IF NOT EXISTS idx_promo_dates ON promo(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_promo_platform_sync ON promo USING GIN(platform_sync);
CREATE INDEX IF NOT EXISTS idx_promo_eligibility_rules ON promo USING GIN(eligibility_rules);

-- ----------------------------------------------------------------------------
-- 2. promo_campaigns
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS promo_campaigns (
    id BIGSERIAL PRIMARY KEY,
    promo_id BIGINT NOT NULL,
    mkt_campaign_id BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT uq_promo_campaigns_promo_campaign UNIQUE (promo_id, mkt_campaign_id)
);

COMMENT ON TABLE promo_campaigns IS 'Junction table (many-to-many) linking promotions to marketing campaigns.';
COMMENT ON COLUMN promo_campaigns.id IS 'Junction identifier';
COMMENT ON COLUMN promo_campaigns.promo_id IS 'Promotion identifier';
COMMENT ON COLUMN promo_campaigns.mkt_campaign_id IS 'Marketing campaign identifier';

-- Foreign Keys
-- Note: mkt_campaigns table will be created later, so we'll add this FK constraint after that table exists
-- ALTER TABLE promo_campaigns 
--     ADD CONSTRAINT fk_promo_campaigns_promo_id 
--     FOREIGN KEY (promo_id) REFERENCES promo(id) ON DELETE CASCADE;
-- 
-- ALTER TABLE promo_campaigns 
--     ADD CONSTRAINT fk_promo_campaigns_mkt_campaign_id 
--     FOREIGN KEY (mkt_campaign_id) REFERENCES mkt_campaigns(id) ON DELETE CASCADE;

ALTER TABLE promo_campaigns 
    ADD CONSTRAINT fk_promo_campaigns_promo_id 
    FOREIGN KEY (promo_id) REFERENCES promo(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_promo_campaigns_promo_id ON promo_campaigns(promo_id);
CREATE INDEX IF NOT EXISTS idx_promo_campaigns_mkt_campaign_id ON promo_campaigns(mkt_campaign_id);

-- ----------------------------------------------------------------------------
-- 3. promo_discount_rules
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS promo_discount_rules (
    id BIGSERIAL PRIMARY KEY,
    promo_id BIGSERIAL NOT NULL UNIQUE,
    discount_type VARCHAR(50) NOT NULL,
    discount_value NUMERIC(10,2) NULL,
    max_discount_amount NUMERIC(10,2) NULL,
    apply_to VARCHAR(50) NOT NULL,
    allocation_method VARCHAR(50) NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT chk_promo_discount_rules_discount_type CHECK (discount_type IN ('percentage', 'fixed_amount', 'fixed_price', 'free_shipping')),
    CONSTRAINT chk_promo_discount_rules_apply_to CHECK (apply_to IN ('order', 'line_item', 'shipping')),
    CONSTRAINT chk_promo_discount_rules_allocation_method CHECK (allocation_method IS NULL OR allocation_method IN ('across', 'each'))
);

COMMENT ON TABLE promo_discount_rules IS 'Separated for query performance (most common queries). Handles percentage, fixed amount, fixed price, and free shipping discounts.';
COMMENT ON COLUMN promo_discount_rules.id IS 'Discount rule identifier';
COMMENT ON COLUMN promo_discount_rules.promo_id IS 'Promotion (one-to-one)';
COMMENT ON COLUMN promo_discount_rules.discount_type IS 'Discount type: percentage, fixed_amount, fixed_price, free_shipping';
COMMENT ON COLUMN promo_discount_rules.discount_value IS 'Discount value (percentage or amount)';
COMMENT ON COLUMN promo_discount_rules.max_discount_amount IS 'Maximum discount cap (for percentage discounts)';
COMMENT ON COLUMN promo_discount_rules.apply_to IS 'Apply to: order, line_item, shipping';
COMMENT ON COLUMN promo_discount_rules.allocation_method IS 'Allocation method: across, each (for line item discounts)';

-- Foreign Keys
ALTER TABLE promo_discount_rules 
    ADD CONSTRAINT fk_promo_discount_rules_promo_id 
    FOREIGN KEY (promo_id) REFERENCES promo(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_promo_discount_rules_type ON promo_discount_rules(discount_type);
CREATE INDEX IF NOT EXISTS idx_promo_discount_rules_apply_to ON promo_discount_rules(apply_to);

-- ----------------------------------------------------------------------------
-- 4. promo_bogo_rules
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS promo_bogo_rules (
    id BIGSERIAL PRIMARY KEY,
    promo_id BIGSERIAL NOT NULL UNIQUE,
    buy_type VARCHAR(50) NOT NULL,
    buy_quantity INTEGER NULL,
    buy_amount NUMERIC(10,2) NULL,
    buy_product_rules JSONB NULL,
    get_type VARCHAR(50) NOT NULL,
    get_quantity INTEGER NOT NULL DEFAULT 1,
    get_product_rules JSONB NULL,
    max_applications_per_order INTEGER NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT chk_promo_bogo_rules_buy_type CHECK (buy_type IN ('quantity', 'amount', 'specific_products')),
    CONSTRAINT chk_promo_bogo_rules_get_type CHECK (get_type IN ('same_product', 'specific_products', 'cheapest', 'any'))
);

COMMENT ON TABLE promo_bogo_rules IS 'BOGO needs separate table for complex logic. Handles Buy One Get One promotions with flexible product matching.';
COMMENT ON COLUMN promo_bogo_rules.id IS 'BOGO rule identifier';
COMMENT ON COLUMN promo_bogo_rules.promo_id IS 'Promotion (one-to-one)';
COMMENT ON COLUMN promo_bogo_rules.buy_type IS 'Buy type: quantity, amount, specific_products';
COMMENT ON COLUMN promo_bogo_rules.buy_quantity IS 'Required quantity to buy';
COMMENT ON COLUMN promo_bogo_rules.buy_amount IS 'Required amount to buy';
COMMENT ON COLUMN promo_bogo_rules.buy_product_rules IS 'Buy-side product matching rules';
COMMENT ON COLUMN promo_bogo_rules.get_type IS 'Get type: same_product, specific_products, cheapest, any';
COMMENT ON COLUMN promo_bogo_rules.get_quantity IS 'Quantity to get (free or discounted)';
COMMENT ON COLUMN promo_bogo_rules.get_product_rules IS 'Get-side product matching rules';
COMMENT ON COLUMN promo_bogo_rules.max_applications_per_order IS 'Maximum times BOGO can apply per order';

-- Foreign Keys
ALTER TABLE promo_bogo_rules 
    ADD CONSTRAINT fk_promo_bogo_rules_promo_id 
    FOREIGN KEY (promo_id) REFERENCES promo(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_promo_bogo_rules_buy_type ON promo_bogo_rules(buy_type);
CREATE INDEX IF NOT EXISTS idx_promo_bogo_rules_get_type ON promo_bogo_rules(get_type);
CREATE INDEX IF NOT EXISTS idx_promo_bogo_rules_product_rules ON promo_bogo_rules USING GIN(buy_product_rules, get_product_rules);

-- ----------------------------------------------------------------------------
-- 5. promo_bundle_rules
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS promo_bundle_rules (
    id BIGSERIAL PRIMARY KEY,
    promo_id BIGSERIAL NOT NULL UNIQUE,
    bundle_type VARCHAR(50) NOT NULL,
    required_quantity INTEGER NULL,
    required_amount NUMERIC(10,2) NULL,
    bundle_product_rules JSONB NULL,
    discount_type VARCHAR(50) NOT NULL,
    discount_value NUMERIC(10,2) NOT NULL,
    max_discount_amount NUMERIC(10,2) NULL,
    min_items_in_bundle INTEGER NULL,
    max_items_in_bundle INTEGER NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT chk_promo_bundle_rules_bundle_type CHECK (bundle_type IN ('quantity', 'amount', 'specific_products')),
    CONSTRAINT chk_promo_bundle_rules_discount_type CHECK (discount_type IN ('percentage', 'fixed_amount', 'fixed_price'))
);

COMMENT ON TABLE promo_bundle_rules IS 'Bundle/combo promotion rules. Handles bundle discounts when multiple products are purchased together.';
COMMENT ON COLUMN promo_bundle_rules.id IS 'Bundle rule identifier';
COMMENT ON COLUMN promo_bundle_rules.promo_id IS 'Promotion (one-to-one)';
COMMENT ON COLUMN promo_bundle_rules.bundle_type IS 'Bundle type: quantity, amount, specific_products';
COMMENT ON COLUMN promo_bundle_rules.required_quantity IS 'Required quantity of items in bundle';
COMMENT ON COLUMN promo_bundle_rules.required_amount IS 'Required total amount for bundle';
COMMENT ON COLUMN promo_bundle_rules.bundle_product_rules IS 'Products/collections that must be in bundle';
COMMENT ON COLUMN promo_bundle_rules.discount_type IS 'Discount type: percentage, fixed_amount, fixed_price';
COMMENT ON COLUMN promo_bundle_rules.discount_value IS 'Discount value for bundle';
COMMENT ON COLUMN promo_bundle_rules.max_discount_amount IS 'Maximum discount cap';
COMMENT ON COLUMN promo_bundle_rules.min_items_in_bundle IS 'Minimum items required in bundle';
COMMENT ON COLUMN promo_bundle_rules.max_items_in_bundle IS 'Maximum items allowed in bundle';

-- Foreign Keys
ALTER TABLE promo_bundle_rules 
    ADD CONSTRAINT fk_promo_bundle_rules_promo_id 
    FOREIGN KEY (promo_id) REFERENCES promo(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_promo_bundle_rules_bundle_type ON promo_bundle_rules(bundle_type);
CREATE INDEX IF NOT EXISTS idx_promo_bundle_rules_product_rules ON promo_bundle_rules USING GIN(bundle_product_rules);

-- ----------------------------------------------------------------------------
-- 6. promo_tiered_rules
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS promo_tiered_rules (
    id BIGSERIAL PRIMARY KEY,
    promo_id BIGINT NOT NULL,
    tier_level INTEGER NOT NULL,
    threshold_type VARCHAR(50) NOT NULL,
    threshold_value NUMERIC(10,2) NOT NULL,
    discount_type VARCHAR(50) NOT NULL,
    discount_value NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT chk_promo_tiered_rules_threshold_type CHECK (threshold_type IN ('quantity', 'amount')),
    CONSTRAINT chk_promo_tiered_rules_discount_type CHECK (discount_type IN ('percentage', 'fixed_amount'))
);

COMMENT ON TABLE promo_tiered_rules IS 'Volume/spend tiers. Handles tiered pricing based on quantity or amount thresholds.';
COMMENT ON COLUMN promo_tiered_rules.id IS 'Tiered rule identifier';
COMMENT ON COLUMN promo_tiered_rules.promo_id IS 'Promotion';
COMMENT ON COLUMN promo_tiered_rules.tier_level IS 'Tier level (1, 2, 3, etc.)';
COMMENT ON COLUMN promo_tiered_rules.threshold_type IS 'Threshold type: quantity, amount';
COMMENT ON COLUMN promo_tiered_rules.threshold_value IS 'Threshold value (quantity or amount)';
COMMENT ON COLUMN promo_tiered_rules.discount_type IS 'Discount type: percentage, fixed_amount';
COMMENT ON COLUMN promo_tiered_rules.discount_value IS 'Discount value for this tier';

-- Foreign Keys
ALTER TABLE promo_tiered_rules 
    ADD CONSTRAINT fk_promo_tiered_rules_promo_id 
    FOREIGN KEY (promo_id) REFERENCES promo(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_promo_tiered_rules_promo_id ON promo_tiered_rules(promo_id, tier_level);
CREATE INDEX IF NOT EXISTS idx_promo_tiered_rules_threshold ON promo_tiered_rules(promo_id, threshold_type, threshold_value);

-- ----------------------------------------------------------------------------
-- 7. promo_product_price_overrides
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS promo_product_price_overrides (
    id BIGSERIAL PRIMARY KEY,
    promo_id BIGINT NOT NULL,
    product_id VARCHAR(100) NULL,
    variant_id VARCHAR(100) NULL,
    product_sku VARCHAR(100) NULL,
    override_price NUMERIC(10,2) NOT NULL,
    original_price NUMERIC(10,2) NULL,
    price_override_type VARCHAR(50) NOT NULL DEFAULT 'sale_price',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT chk_promo_price_overrides_type CHECK (price_override_type IN ('sale_price', 'retail_price', 'both'))
);

COMMENT ON TABLE promo_product_price_overrides IS 'Direct product price overrides during promotions. Temporarily changes product sale_price for display and platform sync.';
COMMENT ON COLUMN promo_product_price_overrides.id IS 'Override identifier';
COMMENT ON COLUMN promo_product_price_overrides.promo_id IS 'Promotion';
COMMENT ON COLUMN promo_product_price_overrides.product_id IS 'Product identifier';
COMMENT ON COLUMN promo_product_price_overrides.variant_id IS 'Product variant identifier';
COMMENT ON COLUMN promo_product_price_overrides.product_sku IS 'Product SKU';
COMMENT ON COLUMN promo_product_price_overrides.override_price IS 'New sale price during promotion';
COMMENT ON COLUMN promo_product_price_overrides.original_price IS 'Original price (for rollback)';
COMMENT ON COLUMN promo_product_price_overrides.price_override_type IS 'Price override type: sale_price, retail_price, both';

-- Foreign Keys
ALTER TABLE promo_product_price_overrides 
    ADD CONSTRAINT fk_promo_price_overrides_promo_id 
    FOREIGN KEY (promo_id) REFERENCES promo(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_promo_price_overrides_promo_id ON promo_product_price_overrides(promo_id);
CREATE INDEX IF NOT EXISTS idx_promo_price_overrides_product_id ON promo_product_price_overrides(product_id);
CREATE INDEX IF NOT EXISTS idx_promo_price_overrides_variant_id ON promo_product_price_overrides(variant_id);
CREATE INDEX IF NOT EXISTS idx_promo_price_overrides_sku ON promo_product_price_overrides(product_sku);
CREATE INDEX IF NOT EXISTS idx_promo_price_overrides_composite ON promo_product_price_overrides(promo_id, product_id, variant_id);

-- ----------------------------------------------------------------------------
-- 8. promo_codes
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS promo_codes (
    id BIGSERIAL PRIMARY KEY,
    promo_id BIGINT NOT NULL,
    code VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    usage_limit INTEGER NULL,
    usage_count INTEGER NOT NULL DEFAULT 0,
    assigned_to_customer_id BIGINT NULL,
    platform_sync JSONB NULL,
    first_used_at TIMESTAMPTZ NULL,
    last_used_at TIMESTAMPTZ NULL,
    expires_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT chk_promo_codes_status CHECK (status IN ('active', 'used', 'expired', 'revoked'))
);

COMMENT ON TABLE promo_codes IS 'Individual coupon codes. Tracks individual coupon codes with usage limits and customer assignments.';
COMMENT ON COLUMN promo_codes.id IS 'Coupon code identifier';
COMMENT ON COLUMN promo_codes.promo_id IS 'Parent promotion';
COMMENT ON COLUMN promo_codes.code IS 'Coupon code';
COMMENT ON COLUMN promo_codes.status IS 'Code status: active, used, expired, revoked';
COMMENT ON COLUMN promo_codes.usage_limit IS 'Usage limit for this code';
COMMENT ON COLUMN promo_codes.usage_count IS 'Current usage count';
COMMENT ON COLUMN promo_codes.assigned_to_customer_id IS 'Assigned customer (nullable)';
COMMENT ON COLUMN promo_codes.platform_sync IS 'Platform integration data';
COMMENT ON COLUMN promo_codes.first_used_at IS 'First usage timestamp';
COMMENT ON COLUMN promo_codes.last_used_at IS 'Last usage timestamp';
COMMENT ON COLUMN promo_codes.expires_at IS 'Code expiration date';

-- Foreign Keys
ALTER TABLE promo_codes 
    ADD CONSTRAINT fk_promo_codes_promo_id 
    FOREIGN KEY (promo_id) REFERENCES promo(id) ON DELETE CASCADE;

ALTER TABLE promo_codes 
    ADD CONSTRAINT fk_promo_codes_customer_id 
    FOREIGN KEY (assigned_to_customer_id) REFERENCES crm_customers(id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_promo_codes_promo_id ON promo_codes(promo_id);
CREATE INDEX IF NOT EXISTS idx_promo_codes_status ON promo_codes(status);
CREATE INDEX IF NOT EXISTS idx_promo_codes_customer_id ON promo_codes(assigned_to_customer_id);
CREATE INDEX IF NOT EXISTS idx_promo_codes_expires_at ON promo_codes(expires_at);

-- ----------------------------------------------------------------------------
-- 9. promo_eligible_products
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS promo_eligible_products (
    id BIGSERIAL PRIMARY KEY,
    promo_id BIGINT NOT NULL,
    product_id VARCHAR(100) NULL,
    variant_id VARCHAR(100) NULL,
    collection_id VARCHAR(100) NULL,
    product_sku VARCHAR(100) NULL,
    inclusion_type VARCHAR(50) NOT NULL,
    context VARCHAR(50) NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT chk_promo_eligible_products_inclusion_type CHECK (inclusion_type IN ('include', 'exclude')),
    CONSTRAINT chk_promo_eligible_products_context CHECK (context IS NULL OR context IN ('buy_side', 'get_side', 'both'))
);

COMMENT ON TABLE promo_eligible_products IS 'Product-level inclusions/exclusions. High-frequency lookups during cart calculation.';
COMMENT ON COLUMN promo_eligible_products.id IS 'Eligibility rule identifier';
COMMENT ON COLUMN promo_eligible_products.promo_id IS 'Parent promotion';
COMMENT ON COLUMN promo_eligible_products.product_id IS 'Product identifier';
COMMENT ON COLUMN promo_eligible_products.variant_id IS 'Product variant identifier';
COMMENT ON COLUMN promo_eligible_products.collection_id IS 'Collection identifier';
COMMENT ON COLUMN promo_eligible_products.product_sku IS 'Product SKU';
COMMENT ON COLUMN promo_eligible_products.inclusion_type IS 'Include or exclude: include, exclude';
COMMENT ON COLUMN promo_eligible_products.context IS 'Context: buy_side, get_side, both (for BOGO)';

-- Foreign Keys
ALTER TABLE promo_eligible_products 
    ADD CONSTRAINT fk_promo_eligible_products_promo_id 
    FOREIGN KEY (promo_id) REFERENCES promo(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_promo_eligible_products_promo_id ON promo_eligible_products(promo_id, inclusion_type);
CREATE INDEX IF NOT EXISTS idx_promo_eligible_products_product_id ON promo_eligible_products(product_id);
CREATE INDEX IF NOT EXISTS idx_promo_eligible_products_variant_id ON promo_eligible_products(variant_id);
CREATE INDEX IF NOT EXISTS idx_promo_eligible_products_collection_id ON promo_eligible_products(collection_id);
CREATE INDEX IF NOT EXISTS idx_promo_eligible_products_sku ON promo_eligible_products(product_sku);
CREATE INDEX IF NOT EXISTS idx_promo_eligible_products_context ON promo_eligible_products(context);

-- ----------------------------------------------------------------------------
-- 10. promo_usage_history
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS promo_usage_history (
    id BIGSERIAL PRIMARY KEY,
    promo_id BIGINT NOT NULL,
    coupon_code_id BIGINT NULL,
    order_id BIGINT NOT NULL,
    customer_id BIGINT NULL,
    discount_amount NUMERIC(10,2) NOT NULL,
    original_order_total NUMERIC(10,2) NOT NULL,
    final_order_total NUMERIC(10,2) NOT NULL,
    discount_breakdown JSONB NULL,
    platform_order_id VARCHAR(200) NULL,
    platform_discount_application_id VARCHAR(200) NULL,
    used_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    tenant_id INTEGER NOT NULL
);

COMMENT ON TABLE promo_usage_history IS 'Redemption tracking & analytics. Tracks all promotion redemptions with detailed breakdown.';
COMMENT ON COLUMN promo_usage_history.id IS 'Usage history identifier';
COMMENT ON COLUMN promo_usage_history.promo_id IS 'Promotion used';
COMMENT ON COLUMN promo_usage_history.coupon_code_id IS 'Coupon code used (nullable)';
COMMENT ON COLUMN promo_usage_history.order_id IS 'Order where promotion was applied';
COMMENT ON COLUMN promo_usage_history.customer_id IS 'Customer who used promotion';
COMMENT ON COLUMN promo_usage_history.discount_amount IS 'Total discount amount applied';
COMMENT ON COLUMN promo_usage_history.original_order_total IS 'Order total before discount';
COMMENT ON COLUMN promo_usage_history.final_order_total IS 'Order total after discount';
COMMENT ON COLUMN promo_usage_history.discount_breakdown IS 'Detailed calculation breakdown';
COMMENT ON COLUMN promo_usage_history.platform_order_id IS 'External platform order ID';
COMMENT ON COLUMN promo_usage_history.platform_discount_application_id IS 'External platform discount application ID';
COMMENT ON COLUMN promo_usage_history.used_at IS 'Usage timestamp';
COMMENT ON COLUMN promo_usage_history.tenant_id IS 'Tenant identifier';

-- Foreign Keys
ALTER TABLE promo_usage_history 
    ADD CONSTRAINT fk_promo_usage_history_promo_id 
    FOREIGN KEY (promo_id) REFERENCES promo(id);

ALTER TABLE promo_usage_history 
    ADD CONSTRAINT fk_promo_usage_history_coupon_code_id 
    FOREIGN KEY (coupon_code_id) REFERENCES promo_codes(id);

ALTER TABLE promo_usage_history 
    ADD CONSTRAINT fk_promo_usage_history_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id);

-- Foreign Keys (continued)
ALTER TABLE promo_usage_history 
    ADD CONSTRAINT fk_promo_usage_history_order_id 
    FOREIGN KEY (order_id) REFERENCES orders(id);

ALTER TABLE promo_usage_history 
    ADD CONSTRAINT fk_promo_usage_history_customer_id 
    FOREIGN KEY (customer_id) REFERENCES crm_customers(id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_promo_usage_history_promo_id ON promo_usage_history(promo_id, used_at);
CREATE INDEX IF NOT EXISTS idx_promo_usage_history_order_id ON promo_usage_history(order_id);
CREATE INDEX IF NOT EXISTS idx_promo_usage_history_customer_id ON promo_usage_history(customer_id, used_at);
CREATE INDEX IF NOT EXISTS idx_promo_usage_history_coupon_code_id ON promo_usage_history(coupon_code_id);
CREATE INDEX IF NOT EXISTS idx_promo_usage_history_tenant_id ON promo_usage_history(tenant_id, used_at);
CREATE INDEX IF NOT EXISTS idx_promo_usage_history_used_at ON promo_usage_history(used_at);
CREATE INDEX IF NOT EXISTS idx_promo_usage_history_breakdown ON promo_usage_history USING GIN(discount_breakdown);

