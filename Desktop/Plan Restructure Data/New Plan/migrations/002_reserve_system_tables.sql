-- ============================================================================
-- Reserve System Tables
-- Migration: 002_reserve_system_tables.sql
-- Description: Create standardized reserve system tables (res_*)
-- ============================================================================

-- ============================================================================
-- RESERVE SYSTEM TABLES
-- These tables are kept separate as they appear to serve a different purpose
-- (possibly a reserve/backup system or different store)
-- ============================================================================

-- Reserve Order (renamed from res_order)
CREATE TABLE reserve_order (
    id BIGSERIAL PRIMARY KEY,
    order_number VARCHAR(300) DEFAULT NULL, -- date_created (was timestamp)
    customer_name VARCHAR(200) NOT NULL,
    closed_by_staff_id BIGINT DEFAULT 0 REFERENCES staff(id), -- id_nv_chotdon
    referred_by_staff_id BIGINT DEFAULT 0 REFERENCES staff(id), -- id_nv_gioithieu
    payment_method VARCHAR(100) NOT NULL,
    total NUMERIC(12,2) NOT NULL,
    status VARCHAR(100) NOT NULL,
    email VARCHAR(300) NOT NULL,
    is_admin_checked BOOLEAN DEFAULT FALSE, -- admin_check
    order_image VARCHAR(1000) DEFAULT '', -- hinh_order
    ship_date TIMESTAMP WITH TIME ZONE DEFAULT NULL, -- was '0000-00-00'
    delivered_date TIMESTAMP WITH TIME ZONE DEFAULT NULL, -- was '0000-00-00'
    note VARCHAR(500) DEFAULT '',
    tracking_number VARCHAR(80) DEFAULT '',
    tag VARCHAR(150) DEFAULT '',
    is_local_store BOOLEAN DEFAULT FALSE, -- local_store
    is_error_order BOOLEAN DEFAULT FALSE, -- error_order
    customer_rank VARCHAR(300) DEFAULT 'New Customer', -- rank_order
    is_live_stream BOOLEAN NOT NULL DEFAULT FALSE, -- live_stream
    social_review VARCHAR(200) DEFAULT '',
    customer_feedback VARCHAR(200) DEFAULT '',
    follow_up_note TEXT DEFAULT '', -- note_follow_up
    follow_up_status VARCHAR(200) DEFAULT '', -- status_follow_up
    approval_status VARCHAR(200) DEFAULT '',
    store VARCHAR(200) DEFAULT '',
    feedback_image VARCHAR(1000) DEFAULT '', -- img_feedback
    support_by_staff_id BIGINT DEFAULT 0 REFERENCES staff(id), -- support_by
    is_order_diamond BOOLEAN DEFAULT FALSE, -- order_diamond
    is_pre_order BOOLEAN DEFAULT FALSE, -- pre_order
    ship_carrier_status VARCHAR(20) DEFAULT '',
    facebook_source_page VARCHAR(256) DEFAULT 'by_chloe', -- source_page_fb
    batch_ship VARCHAR(256) DEFAULT '',
    order_link VARCHAR(256) DEFAULT '', -- link_order
    is_export_ship BOOLEAN DEFAULT FALSE, -- export_ship
    is_after_services BOOLEAN DEFAULT FALSE, -- after_services
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE INDEX idx_reserve_order_closed_by_staff ON reserve_order(closed_by_staff_id);
CREATE INDEX idx_reserve_order_referred_by_staff ON reserve_order(referred_by_staff_id);
CREATE INDEX idx_reserve_order_support_by_staff ON reserve_order(support_by_staff_id);
CREATE INDEX idx_reserve_order_status ON reserve_order(status);
CREATE INDEX idx_reserve_order_email ON reserve_order(email);

-- Reserve Order Detail (renamed from res_order_detail)
CREATE TABLE reserve_order_detail (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES reserve_order(id),
    status VARCHAR(20) NOT NULL DEFAULT '',
    total NUMERIC(12,2) NOT NULL DEFAULT 0,
    payment_method VARCHAR(100) DEFAULT '',
    coupon VARCHAR(500) DEFAULT '',
    customer_name VARCHAR(200) NOT NULL,
    address VARCHAR(300) DEFAULT '',
    post_code VARCHAR(500) DEFAULT '',
    email VARCHAR(100) DEFAULT '',
    phone VARCHAR(150) DEFAULT '',
    city VARCHAR(100) DEFAULT '',
    country VARCHAR(200) DEFAULT '',
    transaction_id VARCHAR(300) NOT NULL,
    items_paid TEXT NOT NULL, -- varchar(4500) -> text
    customer_feedback VARCHAR(200) DEFAULT '',
    follow_up_note TEXT DEFAULT '', -- note_follow_up
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE INDEX idx_reserve_order_detail_order ON reserve_order_detail(order_id);

-- Reserve Order Line Item (renamed from res_order_line_item)
CREATE TABLE reserve_order_line_item (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES reserve_order(id),
    status_order VARCHAR(200) NOT NULL DEFAULT '',
    status_item VARCHAR(200) NOT NULL DEFAULT '',
    line_item_id INTEGER NOT NULL, -- id_line_item
    sku VARCHAR(50) NOT NULL DEFAULT '',
    name VARCHAR(200) NOT NULL,
    price NUMERIC(12,2) NOT NULL DEFAULT 0,
    quantity INTEGER NOT NULL DEFAULT 0, -- qty
    category VARCHAR(1000) DEFAULT '',
    material VARCHAR(500) DEFAULT '',
    collection VARCHAR(500) DEFAULT '',
    thumbnail VARCHAR(50) DEFAULT '', -- thumb_nail
    created_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX idx_reserve_order_line_item_order ON reserve_order_line_item(order_id);

-- Reserve Product (renamed from res_product)
CREATE TABLE reserve_product (
    id BIGSERIAL PRIMARY KEY,
    status VARCHAR(100) DEFAULT '',
    sku VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(500) NOT NULL,
    thumbnail VARCHAR(1000) DEFAULT '', -- thumb_nail
    image_name VARCHAR(100) DEFAULT '', -- name_image
    retail_price NUMERIC(12,2) DEFAULT 0,
    sale_price NUMERIC(12,2) DEFAULT 0,
    size VARCHAR(100) DEFAULT '',
    color VARCHAR(100) DEFAULT '',
    category VARCHAR(100) DEFAULT '',
    description TEXT DEFAULT '',
    tag VARCHAR(300) DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by_id BIGINT REFERENCES staff(id) -- by_user
);

CREATE INDEX idx_reserve_product_sku ON reserve_product(sku);
CREATE INDEX idx_reserve_product_status ON reserve_product(status);

-- Reserve Stock (renamed from res_stock)
CREATE TABLE reserve_stock (
    id BIGSERIAL PRIMARY KEY,
    product_sku VARCHAR(100) NOT NULL, -- sku_product
    location VARCHAR(10) NOT NULL,
    quantity INTEGER DEFAULT 0, -- qty
    stock_out INTEGER DEFAULT 0,
    coming_stock INTEGER DEFAULT 0,
    product_name VARCHAR(500) NOT NULL, -- name_product
    user_name VARCHAR(300) DEFAULT '', -- user
    time_group_sku TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reserve_stock_product_sku ON reserve_stock(product_sku);
CREATE INDEX idx_reserve_stock_location ON reserve_stock(location);

-- Reserve Category (renamed from res_category)
CREATE TABLE reserve_category (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    web_id INTEGER DEFAULT 0, -- id_web
    parent_id BIGINT NOT NULL DEFAULT 0 -- parent
);

-- Reserve Attribute (renamed from res_attributes)
CREATE TABLE reserve_attribute (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(300) NOT NULL,
    type VARCHAR(100) NOT NULL,
    description VARCHAR(1000) DEFAULT NULL
);

-- Reserve Category Auto SKU (renamed from res_cat_autosku)
CREATE TABLE reserve_category_autosku (
    id BIGSERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    last_sku VARCHAR(100) NOT NULL
);

-- Reserve Stock History (renamed from res_history_stock)
CREATE TABLE reserve_stock_history (
    id BIGSERIAL PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL, -- user
    stock VARCHAR(100) NOT NULL,
    detail VARCHAR(500) NOT NULL,
    source VARCHAR(100) NOT NULL,
    quantity_change INTEGER DEFAULT 0, -- qty_change
    line_item_id VARCHAR(20) NOT NULL, -- id_line_item
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reserve_stock_history_user ON reserve_stock_history(user_name);
CREATE INDEX idx_reserve_stock_history_created_at ON reserve_stock_history(created_at);

-- Apply update triggers
CREATE TRIGGER update_reserve_product_updated_at BEFORE UPDATE ON reserve_product
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reserve_stock_updated_at BEFORE UPDATE ON reserve_stock
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

