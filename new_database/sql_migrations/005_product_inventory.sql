-- ============================================================================
-- Product & Inventory Domain Module
-- ============================================================================
-- This migration creates tables for product catalog, inventory, materials, and promotions
-- Dependencies: sys_tenants, sys_users (001_system_tenant.sql)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. product
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    sku VARCHAR(100) NOT NULL,
    name VARCHAR(500) NOT NULL,
    product_type VARCHAR(50) NOT NULL DEFAULT 'standard',
    retail_price NUMERIC(12,2) NOT NULL DEFAULT 0,
    sale_price NUMERIC(12,2) NOT NULL DEFAULT 0,
    description TEXT DEFAULT '',
    is_pre_order BOOLEAN NOT NULL DEFAULT FALSE,
    promotion_id INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by_id BIGINT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'draft',
    published_at TIMESTAMPTZ NULL,
    
    CONSTRAINT chk_product_type CHECK (product_type IN ('standard', 'customize', 'variant', 'set', 'jewelry', 'diamond', 'gemstone')),
    CONSTRAINT chk_product_status CHECK (status IN ('draft', 'publish', 'updated', 'do_not_import')),
    CONSTRAINT chk_product_retail_price CHECK (retail_price >= 0),
    CONSTRAINT chk_product_sale_price CHECK (sale_price >= 0),
    CONSTRAINT uq_product_sku UNIQUE (sku),
    CONSTRAINT uq_product_tenant_sku UNIQUE (tenant_id, sku)
);

COMMENT ON TABLE product IS 'Main product catalog - all products in the system';
COMMENT ON COLUMN product.id IS 'Auto-incrementing primary key';
COMMENT ON COLUMN product.tenant_id IS 'Multi-tenant support';
COMMENT ON COLUMN product.sku IS 'Stock Keeping Unit - unique product identifier';
COMMENT ON COLUMN product.product_type IS 'Product type: standard, customize, variant, set, jewelry, diamond, gemstone';
COMMENT ON COLUMN product.status IS 'Product status: draft, publish, updated, do_not_import';

-- Foreign Keys
ALTER TABLE product 
    ADD CONSTRAINT fk_product_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;
    
ALTER TABLE product 
    ADD CONSTRAINT fk_product_created_by_id 
    FOREIGN KEY (created_by_id) REFERENCES sys_users(id) ON DELETE SET NULL;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_product_tenant ON product(tenant_id);
CREATE INDEX IF NOT EXISTS idx_product_sku ON product(sku);
CREATE INDEX IF NOT EXISTS idx_product_name ON product(name);
CREATE INDEX IF NOT EXISTS idx_product_type ON product(product_type);
CREATE INDEX IF NOT EXISTS idx_product_status ON product(status);
CREATE INDEX IF NOT EXISTS idx_product_published_at ON product(published_at) WHERE published_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_product_tenant_status ON product(tenant_id, status);

-- ----------------------------------------------------------------------------
-- 2. category
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS category (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    name VARCHAR(200) NOT NULL,
    parent_id BIGINT NULL,
    
    CONSTRAINT uq_category_tenant_name UNIQUE (tenant_id, name)
);

COMMENT ON TABLE category IS 'Product categories - hierarchical structure';
COMMENT ON COLUMN category.id IS 'Auto-incrementing primary key';
COMMENT ON COLUMN category.parent_id IS 'Parent category (self-referencing for hierarchy)';

-- Foreign Keys
ALTER TABLE category 
    ADD CONSTRAINT fk_category_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;
    
ALTER TABLE category 
    ADD CONSTRAINT fk_category_parent_id 
    FOREIGN KEY (parent_id) REFERENCES category(id) ON DELETE SET NULL;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_category_tenant ON category(tenant_id);
CREATE INDEX IF NOT EXISTS idx_category_parent ON category(parent_id);

-- ----------------------------------------------------------------------------
-- 3. product_category
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_category (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT uq_product_category UNIQUE (product_id, category_id)
);

COMMENT ON TABLE product_category IS 'Junction table linking products to categories (normalized)';

-- Foreign Keys
ALTER TABLE product_category 
    ADD CONSTRAINT fk_product_category_product_id 
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE;
    
ALTER TABLE product_category 
    ADD CONSTRAINT fk_product_category_category_id 
    FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_product_category_product ON product_category(product_id);
CREATE INDEX IF NOT EXISTS idx_product_category_category ON product_category(category_id);

-- ----------------------------------------------------------------------------
-- 4. product_tag
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_tag (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    tag_name VARCHAR(200) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT uq_product_tag UNIQUE (product_id, tag_name)
);

COMMENT ON TABLE product_tag IS 'Junction table for product tags (normalized)';

-- Foreign Keys
ALTER TABLE product_tag 
    ADD CONSTRAINT fk_product_tag_product_id 
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_product_tag_product ON product_tag(product_id);
CREATE INDEX IF NOT EXISTS idx_product_tag_tag_name ON product_tag(tag_name);

-- ----------------------------------------------------------------------------
-- 5. stock
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS stock (
    id BIGSERIAL PRIMARY KEY,
    product_sku VARCHAR(100) NOT NULL,
    quantity_vn INTEGER NOT NULL DEFAULT 0,
    quantity_us INTEGER NOT NULL DEFAULT 0,
    outbound_vn INTEGER NOT NULL DEFAULT 0,
    outbound_us INTEGER NOT NULL DEFAULT 0,
    inbound_vn INTEGER NOT NULL DEFAULT 0,
    inbound_us INTEGER NOT NULL DEFAULT 0,
    name_product VARCHAR(500) NOT NULL,
    updated_by_id BIGINT NULL,
    time_group_sku TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_stock_quantity_vn CHECK (quantity_vn >= 0),
    CONSTRAINT chk_stock_quantity_us CHECK (quantity_us >= 0),
    CONSTRAINT chk_stock_outbound_vn CHECK (outbound_vn >= 0),
    CONSTRAINT chk_stock_outbound_us CHECK (outbound_us >= 0),
    CONSTRAINT chk_stock_inbound_vn CHECK (inbound_vn >= 0),
    CONSTRAINT chk_stock_inbound_us CHECK (inbound_us >= 0),
    CONSTRAINT uq_stock_product_sku UNIQUE (product_sku)
);

COMMENT ON TABLE stock IS 'Inventory stock levels - consolidated from 2 rows per product to 1 row with separate columns for VN/US locations';
COMMENT ON COLUMN stock.product_sku IS 'Product SKU (soft FK to product.sku)';
COMMENT ON COLUMN stock.quantity_vn IS 'Current quantity at VN warehouse';
COMMENT ON COLUMN stock.quantity_us IS 'Current quantity at US warehouse';

-- Foreign Keys
ALTER TABLE stock 
    ADD CONSTRAINT fk_stock_updated_by_id 
    FOREIGN KEY (updated_by_id) REFERENCES sys_users(id) ON DELETE SET NULL;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_stock_product_sku ON stock(product_sku);
CREATE INDEX IF NOT EXISTS idx_stock_time_group_sku ON stock(time_group_sku);

-- ----------------------------------------------------------------------------
-- 6. product_attribute
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_attribute (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    name VARCHAR(300) NOT NULL,
    type VARCHAR(100) NOT NULL,
    value VARCHAR(300) DEFAULT '',
    description VARCHAR(1000) DEFAULT '',
    
    CONSTRAINT uq_product_attribute_tenant_name UNIQUE (tenant_id, name)
);

COMMENT ON TABLE product_attribute IS 'Product attribute definitions (master table) - defines attribute types like Color, Size, Material';
COMMENT ON COLUMN product_attribute.name IS 'Attribute name (e.g., "Color", "Size", "Material")';
COMMENT ON COLUMN product_attribute.type IS 'Attribute type (e.g., "text", "number", "select")';

-- Foreign Keys
ALTER TABLE product_attribute 
    ADD CONSTRAINT fk_product_attribute_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_product_attribute_tenant ON product_attribute(tenant_id);
CREATE INDEX IF NOT EXISTS idx_product_attribute_name ON product_attribute(name);

-- ----------------------------------------------------------------------------
-- 7. product_attribute_value
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_attribute_value (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    attribute_id BIGINT NOT NULL,
    value VARCHAR(500) NOT NULL,
    is_variant_value BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT uq_product_attribute_value UNIQUE (product_id, attribute_id)
);

COMMENT ON TABLE product_attribute_value IS 'Junction table linking products to their attribute values (normalized)';
COMMENT ON COLUMN product_attribute_value.is_variant_value IS 'If TRUE, this attribute value is used for variant SKU generation';

-- Foreign Keys
ALTER TABLE product_attribute_value 
    ADD CONSTRAINT fk_product_attribute_value_product_id 
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE;
    
ALTER TABLE product_attribute_value 
    ADD CONSTRAINT fk_product_attribute_value_attribute_id 
    FOREIGN KEY (attribute_id) REFERENCES product_attribute(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_product_attribute_value_product ON product_attribute_value(product_id);
CREATE INDEX IF NOT EXISTS idx_product_attribute_value_attribute ON product_attribute_value(attribute_id);
CREATE INDEX IF NOT EXISTS idx_product_attribute_value_variant ON product_attribute_value(is_variant_value) WHERE is_variant_value = TRUE;

-- ----------------------------------------------------------------------------
-- 8. product_set_item
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_set_item (
    id BIGSERIAL PRIMARY KEY,
    set_product_id BIGINT NOT NULL,
    item_product_id BIGINT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_product_set_item_quantity CHECK (quantity > 0),
    CONSTRAINT uq_product_set_item UNIQUE (set_product_id, item_product_id)
);

COMMENT ON TABLE product_set_item IS 'Junction table linking set/bundle products to their component items';
COMMENT ON COLUMN product_set_item.set_product_id IS 'Parent product (set/bundle/composite)';
COMMENT ON COLUMN product_set_item.item_product_id IS 'Child product (component item)';

-- Foreign Keys
ALTER TABLE product_set_item 
    ADD CONSTRAINT fk_product_set_item_set_product_id 
    FOREIGN KEY (set_product_id) REFERENCES product(id) ON DELETE CASCADE;
    
ALTER TABLE product_set_item 
    ADD CONSTRAINT fk_product_set_item_item_product_id 
    FOREIGN KEY (item_product_id) REFERENCES product(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_product_set_item_set ON product_set_item(set_product_id);
CREATE INDEX IF NOT EXISTS idx_product_set_item_item ON product_set_item(item_product_id);

-- ----------------------------------------------------------------------------
-- 9. product_variant
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_variant (
    id BIGSERIAL PRIMARY KEY,
    parent_product_id BIGINT NOT NULL,
    variant_product_id BIGINT NOT NULL,
    variant_attribute VARCHAR(100) NOT NULL,
    variant_value VARCHAR(100) NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT uq_product_variant_parent_attribute_value UNIQUE (parent_product_id, variant_attribute, variant_value),
    CONSTRAINT uq_product_variant_variant_product UNIQUE (variant_product_id)
);

COMMENT ON TABLE product_variant IS 'Junction table linking variant parent products to their variant children';
COMMENT ON COLUMN product_variant.parent_product_id IS 'Parent product (variant parent)';
COMMENT ON COLUMN product_variant.variant_product_id IS 'Child product (variant instance)';

-- Foreign Keys
ALTER TABLE product_variant 
    ADD CONSTRAINT fk_product_variant_parent_product_id 
    FOREIGN KEY (parent_product_id) REFERENCES product(id) ON DELETE CASCADE;
    
ALTER TABLE product_variant 
    ADD CONSTRAINT fk_product_variant_variant_product_id 
    FOREIGN KEY (variant_product_id) REFERENCES product(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_product_variant_parent ON product_variant(parent_product_id);
CREATE INDEX IF NOT EXISTS idx_product_variant_variant ON product_variant(variant_product_id);
CREATE INDEX IF NOT EXISTS idx_product_variant_attribute ON product_variant(variant_attribute, variant_value);

-- ----------------------------------------------------------------------------
-- 10. product_image
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_image (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    thumbnail VARCHAR(1000) DEFAULT '',
    gallery TEXT DEFAULT '',
    updated_by_id BIGINT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT uq_product_image_product UNIQUE (product_id)
);

COMMENT ON TABLE product_image IS 'Product images, thumbnails, and gallery (normalized from thumb_nail, name_image)';

-- Foreign Keys
ALTER TABLE product_image 
    ADD CONSTRAINT fk_product_image_product_id 
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE;
    
ALTER TABLE product_image 
    ADD CONSTRAINT fk_product_image_updated_by_id 
    FOREIGN KEY (updated_by_id) REFERENCES sys_users(id) ON DELETE SET NULL;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_product_image_product ON product_image(product_id);

-- ----------------------------------------------------------------------------
-- 11. product_customize
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_customize (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    customization JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by_id BIGINT NULL,
    
    CONSTRAINT uq_product_customize_product UNIQUE (product_id)
);

COMMENT ON TABLE product_customize IS 'Customization data for customize products (with external data references) - JSONB format';
COMMENT ON COLUMN product_customize.customization IS 'Flexible JSON storage for all customization values (can reference external data)';

-- Foreign Keys
ALTER TABLE product_customize 
    ADD CONSTRAINT fk_product_customize_product_id 
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE;
    
ALTER TABLE product_customize 
    ADD CONSTRAINT fk_product_customize_updated_by_id 
    FOREIGN KEY (updated_by_id) REFERENCES sys_users(id) ON DELETE SET NULL;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_product_customize_product ON product_customize(product_id);
CREATE INDEX IF NOT EXISTS idx_product_customize_json ON product_customize USING GIN(customization);

-- ----------------------------------------------------------------------------
-- 12. diamond
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS diamond (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    item_id VARCHAR(100) NULL,
    shape VARCHAR(100) DEFAULT '',
    cut_grade VARCHAR(50) DEFAULT '',
    carat NUMERIC(5,3) DEFAULT 0,
    color VARCHAR(50) DEFAULT '',
    clarity VARCHAR(50) DEFAULT '',
    grading_lab VARCHAR(100) DEFAULT '',
    certificate_number VARCHAR(100) NULL,
    certificate_path VARCHAR(1000) DEFAULT '',
    image_path VARCHAR(1000) DEFAULT '',
    total_price NUMERIC(12,2) DEFAULT 0,
    measurement_length NUMERIC(6,2) DEFAULT 0,
    measurement_width NUMERIC(6,2) DEFAULT 0,
    measurement_height NUMERIC(6,2) DEFAULT 0,
    country VARCHAR(100) DEFAULT '',
    state_region VARCHAR(100) DEFAULT '',
    guaranteed_availability BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_diamond_carat CHECK (carat > 0),
    CONSTRAINT uq_diamond_product UNIQUE (product_id),
    CONSTRAINT uq_diamond_item_id UNIQUE (item_id) WHERE item_id IS NOT NULL,
    CONSTRAINT uq_diamond_certificate_number UNIQUE (certificate_number) WHERE certificate_number IS NOT NULL
);

COMMENT ON TABLE diamond IS 'Certified diamond specifications (optional, one-to-one with product)';
COMMENT ON COLUMN diamond.product_id IS 'Product (one-to-one, only for certified diamonds)';

-- Foreign Keys
ALTER TABLE diamond 
    ADD CONSTRAINT fk_diamond_product_id 
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_diamond_product_id ON diamond(product_id);
CREATE INDEX IF NOT EXISTS idx_diamond_item_id ON diamond(item_id) WHERE item_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_diamond_certificate_number ON diamond(certificate_number) WHERE certificate_number IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_diamond_carat ON diamond(carat);
CREATE INDEX IF NOT EXISTS idx_diamond_color ON diamond(color);
CREATE INDEX IF NOT EXISTS idx_diamond_clarity ON diamond(clarity);
CREATE INDEX IF NOT EXISTS idx_diamond_shape ON diamond(shape);
CREATE INDEX IF NOT EXISTS idx_diamond_cut_grade ON diamond(cut_grade);
CREATE INDEX IF NOT EXISTS idx_diamond_grading_lab ON diamond(grading_lab);

-- ----------------------------------------------------------------------------
-- 13. gemstone
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS gemstone (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    item_id VARCHAR(100) NULL,
    shape VARCHAR(100) DEFAULT '',
    cut_grade VARCHAR(50) DEFAULT '',
    carat NUMERIC(5,3) DEFAULT 0,
    color VARCHAR(50) DEFAULT '',
    clarity VARCHAR(50) DEFAULT '',
    grading_lab VARCHAR(100) DEFAULT '',
    certificate_number VARCHAR(100) NULL,
    certificate_path VARCHAR(1000) DEFAULT '',
    image_path VARCHAR(1000) DEFAULT '',
    total_price NUMERIC(12,2) DEFAULT 0,
    measurement_length NUMERIC(6,2) DEFAULT 0,
    measurement_width NUMERIC(6,2) DEFAULT 0,
    measurement_height NUMERIC(6,2) DEFAULT 0,
    country VARCHAR(100) DEFAULT '',
    state_region VARCHAR(100) DEFAULT '',
    guaranteed_availability BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_gemstone_carat CHECK (carat > 0),
    CONSTRAINT uq_gemstone_product UNIQUE (product_id),
    CONSTRAINT uq_gemstone_item_id UNIQUE (item_id) WHERE item_id IS NOT NULL,
    CONSTRAINT uq_gemstone_certificate_number UNIQUE (certificate_number) WHERE certificate_number IS NOT NULL
);

COMMENT ON TABLE gemstone IS 'Certified gemstone specifications (optional, one-to-one with product)';
COMMENT ON COLUMN gemstone.product_id IS 'Product (one-to-one, only for certified gemstones)';

-- Foreign Keys
ALTER TABLE gemstone 
    ADD CONSTRAINT fk_gemstone_product_id 
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_gemstone_product_id ON gemstone(product_id);
CREATE INDEX IF NOT EXISTS idx_gemstone_item_id ON gemstone(item_id) WHERE item_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_gemstone_certificate_number ON gemstone(certificate_number) WHERE certificate_number IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_gemstone_carat ON gemstone(carat);
CREATE INDEX IF NOT EXISTS idx_gemstone_color ON gemstone(color);
CREATE INDEX IF NOT EXISTS idx_gemstone_clarity ON gemstone(clarity);
CREATE INDEX IF NOT EXISTS idx_gemstone_shape ON gemstone(shape);
CREATE INDEX IF NOT EXISTS idx_gemstone_cut_grade ON gemstone(cut_grade);
CREATE INDEX IF NOT EXISTS idx_gemstone_grading_lab ON gemstone(grading_lab);

-- ----------------------------------------------------------------------------
-- 14. material
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS material (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    sku VARCHAR(100) NOT NULL,
    name VARCHAR(500) NOT NULL,
    category VARCHAR(100) NOT NULL,
    unit VARCHAR(100) NOT NULL,
    price NUMERIC(12,2) NOT NULL DEFAULT 0,
    cost NUMERIC(12,2) NOT NULL DEFAULT 0,
    weight NUMERIC(10,3) NULL,
    bead NUMERIC(10,3) NULL,
    stock_vn NUMERIC(10,2) NOT NULL DEFAULT 0,
    stock_us NUMERIC(10,2) NOT NULL DEFAULT 0,
    total_bead_vn INTEGER NULL,
    total_bead_us INTEGER NULL,
    metal VARCHAR(100) NULL,
    stone VARCHAR(100) NULL,
    size VARCHAR(100) NULL,
    collection VARCHAR(500) DEFAULT '',
    thumbnail VARCHAR(500) DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by_id BIGINT NULL,
    
    CONSTRAINT chk_material_stock_vn CHECK (stock_vn >= 0),
    CONSTRAINT chk_material_stock_us CHECK (stock_us >= 0),
    CONSTRAINT chk_material_price CHECK (price >= 0),
    CONSTRAINT chk_material_cost CHECK (cost >= 0),
    CONSTRAINT uq_material_tenant_sku UNIQUE (tenant_id, sku)
);

COMMENT ON TABLE material IS 'Material inventory and specifications - raw materials/components used in product manufacturing';
COMMENT ON COLUMN material.tenant_id IS 'Multi-tenant support';
COMMENT ON COLUMN material.sku IS 'Material SKU';

-- Foreign Keys
ALTER TABLE material 
    ADD CONSTRAINT fk_material_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;
    
ALTER TABLE material 
    ADD CONSTRAINT fk_material_updated_by_id 
    FOREIGN KEY (updated_by_id) REFERENCES sys_users(id) ON DELETE SET NULL;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_material_tenant ON material(tenant_id);
CREATE INDEX IF NOT EXISTS idx_material_sku ON material(sku);
CREATE INDEX IF NOT EXISTS idx_material_category ON material(category);
CREATE INDEX IF NOT EXISTS idx_material_name ON material(name);

-- ----------------------------------------------------------------------------
-- 15. material_attribute
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS material_attribute (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(100) NOT NULL,
    value VARCHAR(300) DEFAULT '',
    
    CONSTRAINT uq_material_attribute_tenant_name_type_value UNIQUE (tenant_id, name, type, value)
);

COMMENT ON TABLE material_attribute IS 'Material attribute lookup/master table - Contains valid values for collection, stone, and other material attributes';
COMMENT ON COLUMN material_attribute.name IS 'Attribute name (e.g., "Collection", "Stone", "Color", "Charm")';
COMMENT ON COLUMN material_attribute.type IS 'Attribute type (e.g., "collection", "stone", "color", "charm")';

-- Foreign Keys
ALTER TABLE material_attribute 
    ADD CONSTRAINT fk_material_attribute_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_material_attribute_tenant ON material_attribute(tenant_id);
CREATE INDEX IF NOT EXISTS idx_material_attribute_name ON material_attribute(name);
CREATE INDEX IF NOT EXISTS idx_material_attribute_type ON material_attribute(type);
CREATE INDEX IF NOT EXISTS idx_material_attribute_type_value ON material_attribute(type, value);

-- ----------------------------------------------------------------------------
-- 16. material_product
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS material_product (
    id BIGSERIAL PRIMARY KEY,
    material_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity NUMERIC(10,3) NOT NULL,
    unit VARCHAR(100) NOT NULL,
    inbound INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_material_product_quantity CHECK (quantity > 0),
    CONSTRAINT uq_material_product UNIQUE (material_id, product_id)
);

COMMENT ON TABLE material_product IS 'Junction table - Links materials to products (materials used in products) - BOM relationships';
COMMENT ON COLUMN material_product.quantity IS 'Quantity of material used in product';

-- Foreign Keys
ALTER TABLE material_product 
    ADD CONSTRAINT fk_material_product_material_id 
    FOREIGN KEY (material_id) REFERENCES material(id) ON DELETE CASCADE;
    
ALTER TABLE material_product 
    ADD CONSTRAINT fk_material_product_product_id 
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_material_product_material ON material_product(material_id);
CREATE INDEX IF NOT EXISTS idx_material_product_product ON material_product(product_id);
CREATE INDEX IF NOT EXISTS idx_material_product_material_product ON material_product(material_id, product_id);

-- ----------------------------------------------------------------------------
-- 17. promotion
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS promotion (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    project_id INTEGER DEFAULT NULL,
    project_name VARCHAR(100) DEFAULT '',
    name VARCHAR(100) DEFAULT '',
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    promo_type INTEGER NOT NULL DEFAULT 0,
    amount INTEGER NULL,
    description VARCHAR(1000) DEFAULT '',
    text_bar TEXT DEFAULT '',
    sync BOOLEAN NOT NULL DEFAULT FALSE,
    reset BOOLEAN NOT NULL DEFAULT FALSE,
    category VARCHAR(1000) DEFAULT '',
    not_category VARCHAR(1000) DEFAULT '',
    product VARCHAR(1000) DEFAULT '',
    not_product VARCHAR(1000) DEFAULT '',
    attribute VARCHAR(1000) DEFAULT '',
    not_attribute VARCHAR(1000) DEFAULT '',
    start_date TIMESTAMPTZ NULL,
    end_date TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_promotion_dates CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);

COMMENT ON TABLE promotion IS 'Promotions - discount rules with categories, products, and attributes stored as pipe-separated IDs';
COMMENT ON COLUMN promotion.project_id IS 'Campaign/Period group ID (not FK to project table, used for grouping promotions)';
COMMENT ON COLUMN promotion.category IS 'Category IDs (pipe-separated, e.g., "23|89|7741")';
COMMENT ON COLUMN promotion.product IS 'Product IDs (pipe-separated)';
COMMENT ON COLUMN promotion.attribute IS 'Attribute IDs (pipe-separated)';

-- Foreign Keys
ALTER TABLE promotion 
    ADD CONSTRAINT fk_promotion_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_promotion_tenant ON promotion(tenant_id);
CREATE INDEX IF NOT EXISTS idx_promotion_project_id ON promotion(project_id);
CREATE INDEX IF NOT EXISTS idx_promotion_is_active ON promotion(is_active);
CREATE INDEX IF NOT EXISTS idx_promotion_dates ON promotion(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_promotion_type ON promotion(promo_type);

-- ----------------------------------------------------------------------------
-- Triggers
-- ----------------------------------------------------------------------------

-- Auto-update updated_at timestamp for product
CREATE TRIGGER trg_product_updated_at
    BEFORE UPDATE ON product
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at timestamp for stock
CREATE TRIGGER trg_stock_updated_at
    BEFORE UPDATE ON stock
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at timestamp for product_attribute_value
CREATE TRIGGER trg_product_attribute_value_updated_at
    BEFORE UPDATE ON product_attribute_value
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at timestamp for product_image
CREATE TRIGGER trg_product_image_updated_at
    BEFORE UPDATE ON product_image
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at timestamp for product_customize
CREATE TRIGGER trg_product_customize_updated_at
    BEFORE UPDATE ON product_customize
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at timestamp for diamond
CREATE TRIGGER trg_diamond_updated_at
    BEFORE UPDATE ON diamond
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at timestamp for gemstone
CREATE TRIGGER trg_gemstone_updated_at
    BEFORE UPDATE ON gemstone
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at timestamp for material
CREATE TRIGGER trg_material_updated_at
    BEFORE UPDATE ON material
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at timestamp for promotion
CREATE TRIGGER trg_promotion_updated_at
    BEFORE UPDATE ON promotion
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Note: Foreign key from product.promotion_id to promotion.id will be added
--       after promotion table is created (via ALTER TABLE)
-- ============================================================================

