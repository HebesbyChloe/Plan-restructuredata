-- ============================================================================
-- CRM Database Schema Standardization
-- Migration: 001_schema_standardization.sql
-- Description: Create standardized PostgreSQL schema with proper data types
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- ENUMS
-- ============================================================================

-- Campaign status
CREATE TYPE campaign_status AS ENUM ('draft', 'active', 'paused', 'completed', 'archived');
CREATE TYPE budget_cycle AS ENUM ('daily', 'weekly', 'monthly', 'total');

-- Workflow enums
CREATE TYPE workflow_source AS ENUM ('internal', 'n8n', 'gpts', 'zapier', 'make');
CREATE TYPE workflow_status AS ENUM ('active', 'paused', 'draft');
CREATE TYPE workflow_trigger_type AS ENUM ('webhook', 'event', 'schedule', 'manual');

-- Twilio enums (already defined in twilio tables, but for reference)
-- CREATE TYPE twilio_provider AS ENUM ('twilio', 'other');
-- CREATE TYPE twilio_user_role AS ENUM ('admin', 'manager', 'agent', 'viewer');
-- CREATE TYPE twilio_user_status AS ENUM ('offline', 'online', 'away', 'busy');
-- CREATE TYPE twilio_sms_direction AS ENUM ('inbound', 'outbound');
-- CREATE TYPE twilio_sms_status AS ENUM ('queued', 'sending', 'sent', 'delivered', 'failed', 'received');
-- CREATE TYPE twilio_phone_type AS ENUM ('primary', 'secondary', 'work', 'home', 'other');

-- ============================================================================
-- CORE ENTITIES
-- ============================================================================

-- Staff (renamed from db_staff)
CREATE TABLE staff (
    id BIGSERIAL PRIMARY KEY,
    order_schedule INTEGER NOT NULL DEFAULT 0,
    full_name VARCHAR(300) NOT NULL,
    monthly_revenue INTEGER NOT NULL DEFAULT 0, -- doanh_so_thang
    is_sales BOOLEAN DEFAULT FALSE,
    pancake_user_id VARCHAR(356) DEFAULT '',
    location VARCHAR(20) DEFAULT 'VN',
    target_livestream NUMERIC(12,2) DEFAULT 0,
    target_ritamie NUMERIC(12,2) DEFAULT 0,
    work_status VARCHAR(100) DEFAULT 'active',
    schedule_preferences VARCHAR(300) NOT NULL DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Customer (renamed from db_customer)
CREATE TABLE customer (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(200) DEFAULT 'No Name',
    email VARCHAR(300) NOT NULL,
    phone VARCHAR(100) DEFAULT '',
    lead_id VARCHAR(256) DEFAULT '',
    address VARCHAR(500) DEFAULT '',
    city VARCHAR(100) DEFAULT '',
    country VARCHAR(100) DEFAULT '',
    post_code VARCHAR(30) DEFAULT '',
    total_amount NUMERIC(12,2) DEFAULT 0, -- total
    quantity_paid INTEGER DEFAULT 0, -- qty_paid
    five_element VARCHAR(30) DEFAULT '',
    customer_info TEXT DEFAULT '', -- infor_customer
    intention VARCHAR(100) DEFAULT '',
    note TEXT DEFAULT '',
    birth_date DATE DEFAULT NULL, -- birth
    profile_link VARCHAR(300) DEFAULT '', -- link_profile
    future_sales_opportunities TEXT DEFAULT '',
    sale_label INTEGER DEFAULT 0,
    source VARCHAR(100) DEFAULT 'phone',
    rank VARCHAR(300) DEFAULT 'New Customer',
    last_order_time TIMESTAMP WITH TIME ZONE DEFAULT NULL, -- last_time_order
    error_phone BOOLEAN DEFAULT FALSE,
    error_email BOOLEAN DEFAULT FALSE,
    last_reachout_date DATE NOT NULL DEFAULT CURRENT_DATE, -- last_time_reachout
    birth_month_day VARCHAR(50) DEFAULT '',
    birth_year VARCHAR(50) DEFAULT '',
    recommend_merge BOOLEAN DEFAULT FALSE,
    pancake_link VARCHAR(256) DEFAULT '', -- link_pancake
    status_lead_contact VARCHAR(256) DEFAULT '',
    status_potential VARCHAR(256) DEFAULT '',
    current_amount NUMERIC(12,2) DEFAULT 0,
    is_new_lead BOOLEAN NOT NULL DEFAULT FALSE, -- new_lead_label
    potential_created_date TIMESTAMP WITH TIME ZONE DEFAULT NULL, -- date_created_potential
    check_bug INTEGER DEFAULT NULL,
    batch_id INTEGER DEFAULT 0, -- id_batch
    last_summary TEXT DEFAULT '',
    emotion VARCHAR(100) DEFAULT 'neutral',
    next_action TEXT DEFAULT NULL,
    journey_stage VARCHAR(100) DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by_id BIGINT REFERENCES staff(id),
    updated_by_id BIGINT REFERENCES staff(id)
);

-- Create indexes for customer
CREATE INDEX idx_customer_email ON customer(email);
CREATE INDEX idx_customer_rank ON customer(rank);
CREATE INDEX idx_customer_created_at ON customer(created_at);
CREATE INDEX idx_customer_batch_id ON customer(batch_id);

-- Order (renamed from db_order)
-- Note: 'order' is a reserved word in PostgreSQL, but we'll use it with quotes if needed
-- Alternatively, we could use 'sales_order' but keeping 'order' for simplicity
CREATE TABLE "order" (
    id BIGSERIAL PRIMARY KEY,
    parent_id BIGINT REFERENCES "order"(id),
    order_number VARCHAR(300) NOT NULL DEFAULT '', -- link_order_number
    store VARCHAR(200) DEFAULT '',
    status VARCHAR(100) NOT NULL,
    customer_name VARCHAR(200) NOT NULL DEFAULT 'No Name',
    facebook_source_page VARCHAR(256) DEFAULT 'phone', -- source_page_fb
    closed_by_staff_id BIGINT REFERENCES staff(id), -- id_nv_chotdon
    referred_by_staff_id BIGINT REFERENCES staff(id), -- id_nv_gioithieu
    support_by_staff_id BIGINT REFERENCES staff(id), -- support_by
    payment_method VARCHAR(100) NOT NULL,
    total NUMERIC(12,2) NOT NULL,
    net_payment NUMERIC(12,2) DEFAULT 0,
    total_refunded NUMERIC(12,2) DEFAULT 0,
    email VARCHAR(300) NOT NULL,
    error_order BOOLEAN DEFAULT FALSE,
    order_image VARCHAR(1000) DEFAULT '', -- hinh_order
    ship_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    delivered_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    tracking_number VARCHAR(80) DEFAULT '',
    ship_carrier_status VARCHAR(20) DEFAULT '',
    batch_ship VARCHAR(256) DEFAULT '',
    note VARCHAR(800) DEFAULT '',
    tag VARCHAR(150) DEFAULT '',
    customer_rank VARCHAR(300) DEFAULT 'New Customer', -- rank_order
    social_review VARCHAR(200) DEFAULT '',
    customer_feedback VARCHAR(200) DEFAULT '',
    feedback_image VARCHAR(1000) DEFAULT '', -- img_feedback
    follow_up_note TEXT DEFAULT '', -- note_follow_up
    follow_up_status VARCHAR(200) DEFAULT '', -- status_follow_up
    is_local_store BOOLEAN DEFAULT FALSE, -- local_store
    is_live_stream BOOLEAN NOT NULL DEFAULT FALSE, -- live_stream
    is_source_ritamie BOOLEAN NOT NULL DEFAULT FALSE, -- source_ritamie
    is_order_diamond BOOLEAN DEFAULT FALSE, -- order_diamond
    is_after_services BOOLEAN DEFAULT FALSE, -- after_services
    is_pre_order BOOLEAN DEFAULT FALSE, -- pre_order
    is_claim_order BOOLEAN DEFAULT FALSE, -- claim_order
    approval_status VARCHAR(200) DEFAULT '',
    is_deposit BOOLEAN DEFAULT FALSE, -- deposit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NULL, -- date_created
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by_id BIGINT REFERENCES staff(id),
    updated_by_id BIGINT REFERENCES staff(id)
);

-- Create indexes for order
CREATE INDEX idx_order_parent_id ON "order"(parent_id);
CREATE INDEX idx_order_closed_by_staff ON "order"(closed_by_staff_id);
CREATE INDEX idx_order_referred_by_staff ON "order"(referred_by_staff_id);
CREATE INDEX idx_order_support_by_staff ON "order"(support_by_staff_id);
CREATE INDEX idx_order_status ON "order"(status);
CREATE INDEX idx_order_created_at ON "order"(created_at);
CREATE INDEX idx_order_email ON "order"(email);

-- Order Detail (renamed from db_order_detail)
CREATE TABLE order_detail (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES "order"(id),
    status VARCHAR(20) NOT NULL DEFAULT '',
    total NUMERIC(12,2) NOT NULL DEFAULT 0,
    net_payment NUMERIC(12,2) DEFAULT 0,
    payment_method VARCHAR(256) DEFAULT '',
    coupon VARCHAR(500) DEFAULT '',
    customer_name VARCHAR(200) NOT NULL DEFAULT 'No Name',
    email VARCHAR(256) DEFAULT '',
    phone VARCHAR(150) DEFAULT '',
    address VARCHAR(300) DEFAULT NULL,
    city VARCHAR(100) DEFAULT '',
    country VARCHAR(200) DEFAULT '',
    post_code VARCHAR(50) DEFAULT '',
    transaction_id VARCHAR(300) NOT NULL,
    items_paid TEXT NOT NULL, -- varchar(4500) -> text
    customer_feedback VARCHAR(200) DEFAULT '',
    follow_up_note TEXT DEFAULT '', -- note_follow_up
    total_refunded NUMERIC(12,2) DEFAULT 0,
    is_deposit BOOLEAN DEFAULT FALSE, -- deposit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_order_detail_order_id ON order_detail(order_id);

-- Product (renamed from db_iv_product)
CREATE TABLE product (
    id BIGSERIAL PRIMARY KEY,
    status VARCHAR(100) DEFAULT '',
    sku VARCHAR(100) NOT NULL UNIQUE,
    thumbnail VARCHAR(1000) DEFAULT '', -- thumb_nail
    image_name VARCHAR(100) DEFAULT '', -- name_image
    retail_price NUMERIC(12,2) DEFAULT 0,
    sale_price NUMERIC(12,2) DEFAULT 0,
    size VARCHAR(100) DEFAULT '',
    name VARCHAR(500) NOT NULL,
    grade VARCHAR(100) DEFAULT '',
    year VARCHAR(100) DEFAULT '',
    bead_size VARCHAR(50) DEFAULT '',
    origin VARCHAR(200) DEFAULT '',
    gender VARCHAR(100) DEFAULT '',
    material VARCHAR(500) DEFAULT '',
    element VARCHAR(300) DEFAULT '',
    description_en TEXT DEFAULT '', -- eng_description
    description_vn TEXT DEFAULT '', -- vn_description
    box_dimension VARCHAR(50) DEFAULT '',
    intention VARCHAR(300) DEFAULT '',
    color VARCHAR(100) DEFAULT '',
    stone VARCHAR(500) DEFAULT '',
    charm VARCHAR(500) DEFAULT '',
    charm_size VARCHAR(100) DEFAULT '',
    tag VARCHAR(300) DEFAULT '',
    total_sales INTEGER DEFAULT 0,
    is_pre_order BOOLEAN DEFAULT FALSE, -- pre_order
    promotion_id INTEGER DEFAULT 0, -- id_promo
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by_id BIGINT REFERENCES staff(id)
);

CREATE INDEX idx_product_sku ON product(sku);
CREATE INDEX idx_product_status ON product(status);

-- Category (renamed from db_iv_category)
CREATE TABLE category (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    parent_id BIGINT REFERENCES category(id) DEFAULT 0
);

-- Product Category Junction Table (normalized from comma-separated)
CREATE TABLE product_category (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    category_id BIGINT NOT NULL REFERENCES category(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, category_id)
);

CREATE INDEX idx_product_category_product ON product_category(product_id);
CREATE INDEX idx_product_category_category ON product_category(category_id);

-- Product Tag Junction Table (normalized from comma-separated)
CREATE TABLE product_tag (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    tag_name VARCHAR(200) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, tag_name)
);

CREATE INDEX idx_product_tag_product ON product_tag(product_id);

-- Order Line Item (renamed from db_order_line_item)
CREATE TABLE order_line_item (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES "order"(id),
    product_sku VARCHAR(50) NOT NULL, -- sku (references product.sku)
    status_order VARCHAR(200) NOT NULL DEFAULT '',
    status_item VARCHAR(200) NOT NULL DEFAULT '',
    line_item_id INTEGER NOT NULL, -- id_line_item
    name VARCHAR(200) NOT NULL,
    price NUMERIC(12,2) NOT NULL DEFAULT 0,
    quantity INTEGER NOT NULL DEFAULT 0, -- qty
    category VARCHAR(1000) DEFAULT '',
    material VARCHAR(500) DEFAULT '',
    element VARCHAR(500) DEFAULT '',
    intention VARCHAR(300) DEFAULT '',
    stone VARCHAR(500) DEFAULT '',
    collection VARCHAR(500) DEFAULT '',
    thumbnail VARCHAR(50) DEFAULT '', -- thumb_nail
    status_stock VARCHAR(256) DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_order_line_item_order ON order_line_item(order_id);
CREATE INDEX idx_order_line_item_product_sku ON order_line_item(product_sku);

-- ============================================================================
-- CAMPAIGNS & MARKETING
-- ============================================================================

-- Campaign (renamed from db_campaigns)
CREATE TABLE campaign (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status campaign_status DEFAULT 'draft',
    spend NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    budget NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    budget_cycle budget_cycle NOT NULL DEFAULT 'monthly',
    cost_impression_goal NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    cost_lead_goal NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    cost_new_lead_goal NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    cost_order_goal NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    roas_goal NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    start_date DATE NOT NULL, -- time_start
    end_date DATE DEFAULT NULL, -- time_end
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Campaign Ads Junction Table (normalized from ids_ads)
CREATE TABLE campaign_ads (
    id BIGSERIAL PRIMARY KEY,
    campaign_id BIGINT NOT NULL REFERENCES campaign(id) ON DELETE CASCADE,
    ad_id VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(campaign_id, ad_id)
);

CREATE INDEX idx_campaign_ads_campaign ON campaign_ads(campaign_id);

-- Campaign Ads Running Junction Table (normalized from ids_ads_running)
CREATE TABLE campaign_ads_running (
    id BIGSERIAL PRIMARY KEY,
    campaign_id BIGINT NOT NULL REFERENCES campaign(id) ON DELETE CASCADE,
    ad_id VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(campaign_id, ad_id)
);

CREATE INDEX idx_campaign_ads_running_campaign ON campaign_ads_running(campaign_id);

-- Campaign Target Audience Junction Table (normalized from target_audiences)
CREATE TABLE campaign_target_audience (
    id BIGSERIAL PRIMARY KEY,
    campaign_id BIGINT NOT NULL REFERENCES campaign(id) ON DELETE CASCADE,
    audience_id VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(campaign_id, audience_id)
);

CREATE INDEX idx_campaign_target_audience_campaign ON campaign_target_audience(campaign_id);

-- Campaign Collection Junction Table (normalized from collection_selection)
CREATE TABLE campaign_collection (
    id BIGSERIAL PRIMARY KEY,
    campaign_id BIGINT NOT NULL REFERENCES campaign(id) ON DELETE CASCADE,
    collection_id VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(campaign_id, collection_id)
);

CREATE INDEX idx_campaign_collection_campaign ON campaign_collection(campaign_id);

-- ============================================================================
-- PAYMENTS
-- ============================================================================

-- Payment (renamed from db_payment_order)
CREATE TABLE payment (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES "order"(id), -- parent_id
    status VARCHAR(100) NOT NULL DEFAULT '',
    amount NUMERIC(12,2) DEFAULT 0,
    payment_method VARCHAR(256) DEFAULT '',
    due_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    paid_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payment_order ON payment(order_id);

-- ============================================================================
-- SHIPPING
-- ============================================================================

-- Inbound Shipment (renamed from db_inbound_shipment)
CREATE TABLE inbound_shipment (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(256) NOT NULL,
    outbound_code VARCHAR(256) DEFAULT '', -- code_outbound
    hub VARCHAR(256) NOT NULL,
    location VARCHAR(256) NOT NULL,
    vendor VARCHAR(256) DEFAULT NULL,
    status VARCHAR(256) DEFAULT '',
    products_count INTEGER DEFAULT 0, -- products
    orders_count INTEGER DEFAULT 0, -- orders
    items_count INTEGER DEFAULT 0, -- items
    tracking_number VARCHAR(256) DEFAULT '',
    ship_date DATE DEFAULT NULL,
    estimated_arrival_date DATE DEFAULT NULL,
    arrived_date DATE DEFAULT NULL,
    note VARCHAR(500) DEFAULT '',
    images VARCHAR(1500) NOT NULL,
    created_at DATE NOT NULL DEFAULT CURRENT_DATE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by_id BIGINT REFERENCES staff(id)
);

-- Inbound Shipment Item (renamed from db_items_inbound_shipment)
CREATE TABLE inbound_shipment_item (
    id BIGSERIAL PRIMARY KEY,
    shipment_id BIGINT NOT NULL REFERENCES inbound_shipment(id),
    order_id BIGINT NOT NULL DEFAULT 0, -- id_order
    code VARCHAR(256) DEFAULT '',
    sku VARCHAR(256) NOT NULL DEFAULT '',
    thumbnail VARCHAR(256) DEFAULT '', -- thumb_nail
    name VARCHAR(500) NOT NULL,
    size VARCHAR(100) DEFAULT NULL,
    quantity INTEGER DEFAULT 0, -- qty
    actual_quantity INTEGER DEFAULT 0, -- act_qty
    quantity_difference INTEGER DEFAULT 0, -- qty_diff
    quantity_during INTEGER DEFAULT 0, -- qty_during
    reason_add VARCHAR(256) NOT NULL DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by_id BIGINT DEFAULT 0
);

CREATE INDEX idx_inbound_shipment_item_shipment ON inbound_shipment_item(shipment_id);

-- Outbound Shipment (renamed from db_outbound_shipments)
CREATE TABLE outbound_shipment (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(20) NOT NULL,
    status VARCHAR(250) DEFAULT NULL,
    ship_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    delivery_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    tracking_number TEXT DEFAULT NULL,
    estimated_arrival_date DATE DEFAULT NULL,
    shipment_image TEXT DEFAULT NULL, -- img_shipment
    note_batch TEXT DEFAULT NULL,
    note TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by_id BIGINT REFERENCES staff(id)
);

-- Outbound Shipment Order (renamed from db_outbound_shipments_orders)
CREATE TABLE outbound_shipment_order (
    id BIGSERIAL PRIMARY KEY,
    shipment_id BIGINT NOT NULL REFERENCES outbound_shipment(id) ON DELETE CASCADE,
    order_id VARCHAR(100) NOT NULL, -- create_order_id (text in original)
    status VARCHAR(255) DEFAULT NULL,
    product_name TEXT DEFAULT NULL, -- name_product
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by_id BIGINT REFERENCES staff(id)
);

CREATE INDEX idx_outbound_shipment_order_shipment ON outbound_shipment_order(shipment_id);

-- Outbound Shipment Product (renamed from db_outbound_shipments_products)
CREATE TABLE outbound_shipment_product (
    id BIGSERIAL PRIMARY KEY,
    shipment_id BIGINT NOT NULL REFERENCES outbound_shipment(id) ON DELETE CASCADE,
    shipment_order_id BIGINT REFERENCES outbound_shipment_order(id),
    status VARCHAR(50) DEFAULT NULL,
    product_name VARCHAR(255) DEFAULT NULL, -- name_product
    quantity INTEGER DEFAULT NULL,
    quantity_difference INTEGER NOT NULL DEFAULT 0, -- qty_diff
    product_id VARCHAR(100) DEFAULT NULL,
    order_id TEXT DEFAULT NULL, -- id_order
    sku VARCHAR(100) DEFAULT NULL,
    type VARCHAR(50) DEFAULT NULL,
    code VARCHAR(50) DEFAULT NULL,
    issues_status TEXT DEFAULT NULL,
    shipstation_order_id TEXT DEFAULT NULL, -- id_shipstation_order
    note TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ship_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_outbound_shipment_product_shipment ON outbound_shipment_product(shipment_id);
CREATE INDEX idx_outbound_shipment_product_order ON outbound_shipment_product(shipment_order_id);

-- ============================================================================
-- LEADS & SALES
-- ============================================================================

-- Lead Sale (renamed from db_lead_sale)
CREATE TABLE lead_sale (
    id BIGSERIAL PRIMARY KEY,
    staff_id BIGINT NOT NULL REFERENCES staff(id), -- id_staff
    customer_name VARCHAR(300) DEFAULT '', -- ten_khach
    lead_status CHAR(100) NOT NULL, -- tinh_trang_lead
    total NUMERIC(12,2) DEFAULT 0,
    order_id BIGINT DEFAULT 0, -- id_order
    lead_id VARCHAR(300) DEFAULT '0', -- id_lead
    phone VARCHAR(20) DEFAULT '0',
    source VARCHAR(100) DEFAULT '',
    is_confirmed BOOLEAN DEFAULT TRUE, -- confirm
    is_late_assignee BOOLEAN DEFAULT FALSE, -- late_assignee
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_lead_sale_staff ON lead_sale(staff_id);
CREATE INDEX idx_lead_sale_order ON lead_sale(order_id);

-- Customer Batch (renamed from db_customer_batch)
CREATE TABLE customer_batch (
    id BIGSERIAL PRIMARY KEY,
    batch_name VARCHAR(100) NOT NULL,
    assigned_to_staff_id BIGINT REFERENCES staff(id), -- assigned_to
    size INTEGER DEFAULT 0,
    historical_value INTEGER DEFAULT 0,
    status VARCHAR(100) DEFAULT 'new',
    contact TEXT DEFAULT '',
    response TEXT DEFAULT '',
    conversion_count INTEGER DEFAULT 0, -- conversion
    reactive_revenue NUMERIC(12,2) DEFAULT 0,
    created_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customer_batch_assigned_to ON customer_batch(assigned_to_staff_id);

-- Customer Batch Customer Junction Table (normalized from conversion_customer_id text)
CREATE TABLE customer_batch_customer (
    id BIGSERIAL PRIMARY KEY,
    batch_id BIGINT NOT NULL REFERENCES customer_batch(id) ON DELETE CASCADE,
    customer_id BIGINT NOT NULL REFERENCES customer(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(batch_id, customer_id)
);

CREATE INDEX idx_customer_batch_customer_batch ON customer_batch_customer(batch_id);
CREATE INDEX idx_customer_batch_customer_customer ON customer_batch_customer(customer_id);

-- Customer Batch Order Junction Table (normalized from conversion_order_id text)
CREATE TABLE customer_batch_order (
    id BIGSERIAL PRIMARY KEY,
    batch_id BIGINT NOT NULL REFERENCES customer_batch(id) ON DELETE CASCADE,
    order_id BIGINT NOT NULL REFERENCES "order"(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(batch_id, order_id)
);

CREATE INDEX idx_customer_batch_order_batch ON customer_batch_order(batch_id);
CREATE INDEX idx_customer_batch_order_order ON customer_batch_order(order_id);

-- ============================================================================
-- STAFF & SCHEDULING
-- ============================================================================

-- Shift Schedule (renamed from db_shift_schedule_sales)
CREATE TABLE shift_schedule (
    id BIGSERIAL PRIMARY KEY,
    staff_id BIGINT NOT NULL REFERENCES staff(id), -- id_staff
    start_time TIMESTAMP WITH TIME ZONE NOT NULL, -- date_time_start
    end_time TIMESTAMP WITH TIME ZONE NOT NULL, -- date_time_end
    shift VARCHAR(256) NOT NULL DEFAULT '',
    total_time INTEGER NOT NULL DEFAULT 0,
    type_sales_off VARCHAR(256) NOT NULL DEFAULT '',
    is_authorized BOOLEAN NOT NULL DEFAULT FALSE, -- status_authorization
    reason VARCHAR(256) NOT NULL DEFAULT '',
    complete_shift INTEGER DEFAULT 2, -- 0 failed, 1 completed, 2 no confirm
    report_shift_id INTEGER DEFAULT 0, -- id_report_shift
    is_confirmed BOOLEAN NOT NULL DEFAULT TRUE, -- confirm
    is_leader_shift BOOLEAN DEFAULT FALSE, -- leader_shift
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_shift_schedule_staff ON shift_schedule(staff_id);
CREATE INDEX idx_shift_schedule_start_time ON shift_schedule(start_time);

-- Shift Report (renamed from db_list_end_shift)
CREATE TABLE shift_report (
    id BIGSERIAL PRIMARY KEY,
    staff_id BIGINT NOT NULL REFERENCES staff(id), -- id_staff
    shift VARCHAR(100) NOT NULL,
    report_date DATE NOT NULL, -- date_report
    total_revenue NUMERIC(12,2) NOT NULL DEFAULT 0,
    total_order INTEGER NOT NULL DEFAULT 0,
    purchase_first_time_order NUMERIC(12,2) NOT NULL DEFAULT 0,
    count_first_time_order INTEGER NOT NULL DEFAULT 0,
    purchase_cart_sent NUMERIC(12,2) NOT NULL DEFAULT 0,
    count_cart_sent INTEGER NOT NULL DEFAULT 0,
    purchase_potential_customers NUMERIC(12,2) NOT NULL DEFAULT 0,
    count_potential_customers INTEGER NOT NULL DEFAULT 0,
    new_leads INTEGER NOT NULL DEFAULT 0,
    customers_contacted INTEGER NOT NULL DEFAULT 0,
    messages_sent INTEGER NOT NULL DEFAULT 0,
    note VARCHAR(500) DEFAULT '',
    complete_tasks BOOLEAN NOT NULL DEFAULT TRUE,
    time_zone VARCHAR(50) DEFAULT 'VN',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_shift_report_staff ON shift_report(staff_id);
CREATE INDEX idx_shift_report_date ON shift_report(report_date);

-- Sales Performance (renamed from db_sales_performance_tracker)
CREATE TABLE sales_performance (
    id BIGSERIAL PRIMARY KEY,
    staff_id BIGINT NOT NULL REFERENCES staff(id), -- id_staff
    staff_name VARCHAR(100) DEFAULT NULL, -- name_staff
    points INTEGER DEFAULT NULL,
    points_this_month INTEGER DEFAULT NULL,
    input_points VARCHAR(10) DEFAULT NULL,
    reverted_points VARCHAR(10) DEFAULT NULL,
    social_review INTEGER DEFAULT NULL,
    ugc_social_media INTEGER DEFAULT NULL,
    order_follow_up INTEGER DEFAULT NULL,
    repurchase_2_weeks INTEGER DEFAULT NULL,
    buy_3_products INTEGER DEFAULT NULL,
    new_customer_purchase INTEGER DEFAULT NULL,
    weekly_balance_80 INTEGER DEFAULT NULL,
    daily_revenue_80 INTEGER DEFAULT NULL,
    balanced_sales_80 INTEGER DEFAULT NULL,
    bad_customer_review VARCHAR(10) DEFAULT NULL,
    late_follow_up VARCHAR(10) DEFAULT NULL,
    returns_exchanges_order VARCHAR(10) DEFAULT NULL,
    unconverted_leads_count VARCHAR(10) DEFAULT NULL,
    lost_customers_count VARCHAR(10) DEFAULT NULL,
    weekly_underperformance_80 VARCHAR(10) DEFAULT NULL,
    no_sales_days_count VARCHAR(11) DEFAULT NULL,
    missing_leads_count VARCHAR(10) DEFAULT NULL,
    daily_report_failed VARCHAR(10) DEFAULT NULL,
    daily_report_missed VARCHAR(10) DEFAULT NULL,
    new_customer VARCHAR(10) DEFAULT NULL,
    label_add_late VARCHAR(10) DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sales_performance_staff ON sales_performance(staff_id);

-- ============================================================================
-- TASKS & PROJECTS
-- ============================================================================

-- Project (renamed from db_project_space)
CREATE TABLE project (
    id BIGSERIAL PRIMARY KEY,
    space_order INTEGER NOT NULL DEFAULT 0,
    status_priority VARCHAR(256) NOT NULL DEFAULT 'Neutral',
    title VARCHAR(400) NOT NULL DEFAULT '',
    team VARCHAR(256) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT '',
    request_admin VARCHAR(300) NOT NULL DEFAULT '',
    target VARCHAR(800) NOT NULL DEFAULT '',
    owner_project_id BIGINT NOT NULL DEFAULT 0, -- owner_project
    total_member INTEGER NOT NULL DEFAULT 0,
    total_task INTEGER NOT NULL DEFAULT 0,
    total_task_completed INTEGER NOT NULL DEFAULT 0,
    total_time INTEGER NOT NULL DEFAULT 0,
    total_time_task_completed INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(256) NOT NULL DEFAULT 'Active',
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NULL, -- date_time_start
    end_time TIMESTAMP WITH TIME ZONE DEFAULT NULL, -- date_time_end
    is_continuous BOOLEAN NOT NULL DEFAULT FALSE, -- is_continuous
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL, -- date_completed
    project_type VARCHAR(256) DEFAULT '' -- type_project
);

-- Task (renamed from db_task_space)
CREATE TABLE task (
    id BIGSERIAL PRIMARY KEY,
    repeat_key VARCHAR(100) NOT NULL DEFAULT '', -- key_repeat
    assignee_id BIGINT NOT NULL DEFAULT 0 REFERENCES staff(id), -- id_assignee
    assigned_by_id BIGINT NOT NULL DEFAULT 0 REFERENCES staff(id), -- assignee_by
    project_id BIGINT NOT NULL DEFAULT 0 REFERENCES project(id), -- id_project
    team VARCHAR(256) NOT NULL DEFAULT '',
    title VARCHAR(256) NOT NULL DEFAULT '',
    details VARCHAR(700) NOT NULL DEFAULT '',
    status VARCHAR(256) NOT NULL DEFAULT '',
    deadline TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    original_deadline TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    status_deadline VARCHAR(100) DEFAULT '',
    order_id BIGINT NOT NULL DEFAULT 0 REFERENCES "order"(id), -- id_order
    after_sales_link VARCHAR(100) NOT NULL DEFAULT '', -- link_after_sales
    customer_id BIGINT NOT NULL DEFAULT 0 REFERENCES customer(id), -- id_customer
    order_in_project INTEGER NOT NULL DEFAULT 0,
    order_in_assignee INTEGER NOT NULL DEFAULT 0,
    admin_note VARCHAR(500) NOT NULL,
    is_note_confirmed BOOLEAN NOT NULL DEFAULT TRUE, -- confirm_note
    note_by_user_id BIGINT NOT NULL DEFAULT 0, -- note_by_user
    admin_note_date TIMESTAMP WITH TIME ZONE DEFAULT NULL, -- date_admin_note
    deliverable_type VARCHAR(100) NOT NULL DEFAULT '', -- type_deliverable
    deliverable_link VARCHAR(300) NOT NULL DEFAULT '', -- link_deliverable
    deliverable_name VARCHAR(100) NOT NULL, -- name_deliverable
    deliverable_review_status VARCHAR(100) NOT NULL DEFAULT 'Neutral', -- status_review_deliverable
    self_review_deliverable VARCHAR(800) NOT NULL DEFAULT '', -- self_reivew_deliverable
    leader_review_deliverable VARCHAR(500) NOT NULL DEFAULT '', -- leader_reivew_deliverable
    review_by_id BIGINT NOT NULL DEFAULT 0, -- review_by
    total_comment INTEGER NOT NULL DEFAULT 0,
    deliverable_submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL, -- date_submit_deliverable
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL -- date_completed
);

CREATE INDEX idx_task_assignee ON task(assignee_id);
CREATE INDEX idx_task_project ON task(project_id);
CREATE INDEX idx_task_order ON task(order_id);
CREATE INDEX idx_task_customer ON task(customer_id);

-- Task Assignee Junction Table (normalized from ids_assignee comma-separated)
CREATE TABLE task_assignee (
    id BIGSERIAL PRIMARY KEY,
    task_id BIGINT NOT NULL REFERENCES task(id) ON DELETE CASCADE,
    staff_id BIGINT NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(task_id, staff_id)
);

CREATE INDEX idx_task_assignee_task ON task_assignee(task_id);
CREATE INDEX idx_task_assignee_staff ON task_assignee(staff_id);

-- Recurring Task (renamed from db_task_repeat_space)
CREATE TABLE recurring_task (
    id BIGSERIAL PRIMARY KEY,
    assignee_id BIGINT NOT NULL DEFAULT 0 REFERENCES staff(id), -- id_assignee
    project_id BIGINT NOT NULL DEFAULT 0 REFERENCES project(id), -- id_project
    team VARCHAR(256) NOT NULL DEFAULT '',
    title VARCHAR(256) NOT NULL DEFAULT '',
    details VARCHAR(700) NOT NULL,
    frequency VARCHAR(100) NOT NULL DEFAULT '',
    day_repeat VARCHAR(300) NOT NULL DEFAULT '',
    time_zone VARCHAR(200) NOT NULL DEFAULT 'Asia/Ho_Chi_Minh',
    next_run TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    processing_time INTEGER NOT NULL DEFAULT 24,
    days_before_insert INTEGER NOT NULL DEFAULT 7,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- COMMUNICATION
-- ============================================================================

-- Pancake Contact (renamed from db_contact_pancake)
CREATE TABLE pancake_contact (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL REFERENCES customer(id), -- id_customer
    facebook_id VARCHAR(100) DEFAULT '', -- fb_id
    page_id VARCHAR(100) DEFAULT '',
    page VARCHAR(256) DEFAULT '',
    pancake_customer_id VARCHAR(256) DEFAULT '', -- id_cus_pancake
    link VARCHAR(256) DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pancake_contact_customer ON pancake_contact(customer_id);

-- Pancake Message (renamed from db_messages_pancake)
CREATE TABLE pancake_message (
    id BIGSERIAL PRIMARY KEY,
    page_id VARCHAR(100) NOT NULL DEFAULT '',
    customer_id VARCHAR(100) DEFAULT '',
    crm_customer_id BIGINT REFERENCES customer(id), -- customer_id_crm
    conversation_id VARCHAR(100) DEFAULT '',
    admin_id VARCHAR(100) DEFAULT '',
    admin_uid VARCHAR(100) DEFAULT '',
    admin_name VARCHAR(100) DEFAULT '',
    sender_type VARCHAR(100) DEFAULT '',
    sender_name VARCHAR(256) DEFAULT NULL,
    message TEXT DEFAULT '', -- varchar(1000) -> text
    attachments VARCHAR(3000) DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE INDEX idx_pancake_message_customer ON pancake_message(crm_customer_id);
CREATE INDEX idx_pancake_message_conversation ON pancake_message(conversation_id);

-- Pancake Message Summary (renamed from db_summary_messages_pancake)
CREATE TABLE pancake_message_summary (
    id BIGSERIAL PRIMARY KEY,
    page_id VARCHAR(100) NOT NULL,
    customer_id VARCHAR(100) DEFAULT NULL,
    crm_customer_id BIGINT REFERENCES customer(id), -- customer_id_crm
    admin_uids TEXT DEFAULT NULL,
    admin_names TEXT DEFAULT NULL,
    customer_name VARCHAR(256) DEFAULT NULL,
    conversation_id VARCHAR(100) DEFAULT NULL,
    summary TEXT DEFAULT NULL,
    state VARCHAR(100) DEFAULT 'open',
    journey_stage VARCHAR(100) DEFAULT NULL,
    emotion VARCHAR(100) DEFAULT 'neutral',
    reply_quality TEXT DEFAULT NULL,
    next_action TEXT DEFAULT NULL,
    tags TEXT DEFAULT '',
    conversation_start TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    conversation_end TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pancake_message_summary_customer ON pancake_message_summary(crm_customer_id);

-- ============================================================================
-- HISTORY & LOGGING
-- ============================================================================

-- Action History (renamed from db_history_action)
CREATE TABLE action_history (
    id BIGSERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    user_name VARCHAR(100) NOT NULL, -- user
    type_id VARCHAR(20) NOT NULL DEFAULT '', -- id_type
    action VARCHAR(50) NOT NULL,
    detail VARCHAR(5000) NOT NULL,
    response VARCHAR(200) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_action_history_type ON action_history(type);
CREATE INDEX idx_action_history_created_at ON action_history(created_at);

-- Stock History (renamed from db_history_stock)
CREATE TABLE stock_history (
    id BIGSERIAL PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL, -- user
    sku VARCHAR(100) NOT NULL,
    stock VARCHAR(100) NOT NULL DEFAULT '',
    detail VARCHAR(500) NOT NULL,
    source VARCHAR(100) NOT NULL DEFAULT '',
    quantity_change INTEGER DEFAULT 0, -- qty_change
    line_item_id VARCHAR(20) NOT NULL DEFAULT '', -- id_line_item
    order_id BIGINT NOT NULL DEFAULT 0, -- id_order
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_stock_history_sku ON stock_history(sku);
CREATE INDEX idx_stock_history_order ON stock_history(order_id);
CREATE INDEX idx_stock_history_created_at ON stock_history(created_at);

-- ============================================================================
-- WORKFLOW AI
-- ============================================================================

-- Workflow (renamed from db_workflow_ai)
CREATE TABLE workflow (
    id BIGSERIAL PRIMARY KEY,
    uuid_page VARCHAR(255) DEFAULT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT DEFAULT NULL,
    source workflow_source DEFAULT 'internal',
    status workflow_status DEFAULT 'draft',
    trigger_type workflow_trigger_type DEFAULT 'manual',
    trigger_config JSONB DEFAULT NULL,
    nodes JSONB DEFAULT NULL,
    edges JSONB DEFAULT NULL,
    runs_count INTEGER DEFAULT 0,
    success_rate NUMERIC(5,2) DEFAULT 0.00,
    last_run_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_workflow_status ON workflow(status);
CREATE INDEX idx_workflow_source ON workflow(source);
CREATE INDEX idx_workflow_trigger_type ON workflow(trigger_type);

-- ============================================================================
-- ADDITIONAL TABLES (Simplified for initial migration)
-- ============================================================================

-- Note: The following tables are created with basic structure.
-- Full implementation will be in subsequent migration files.

-- Employee Dashboard (renamed from db_employee_dashboard)
CREATE TABLE employee_dashboard (
    id BIGSERIAL PRIMARY KEY,
    order_schedule INTEGER NOT NULL DEFAULT 99,
    email VARCHAR(300) NOT NULL DEFAULT '',
    full_name VARCHAR(256) NOT NULL DEFAULT '',
    team VARCHAR(256) NOT NULL DEFAULT '',
    role VARCHAR(256) NOT NULL DEFAULT '',
    work_status VARCHAR(100) NOT NULL DEFAULT 'active',
    motivational_quote_today VARCHAR(300) NOT NULL DEFAULT '',
    location VARCHAR(256) NOT NULL DEFAULT 'VN',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Customer Lead (renamed from db_sub_id_lead)
CREATE TABLE customer_lead (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL REFERENCES customer(id),
    lead_id VARCHAR(256) NOT NULL DEFAULT '',
    source VARCHAR(200) NOT NULL DEFAULT 'by_chloe',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customer_lead_customer ON customer_lead(customer_id);

-- Order Not Found Note (renamed from note_order_not_found)
CREATE TABLE order_not_found_note (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL DEFAULT 0,
    note VARCHAR(500) DEFAULT '',
    staff_id BIGINT DEFAULT 0 REFERENCES staff(id),
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_customer_updated_at BEFORE UPDATE ON customer
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_order_updated_at BEFORE UPDATE ON "order"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_updated_at BEFORE UPDATE ON product
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaign_updated_at BEFORE UPDATE ON campaign
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflow_updated_at BEFORE UPDATE ON workflow
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

