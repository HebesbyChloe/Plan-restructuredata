-- ============================================================================
-- Additional Tables Migration
-- Migration: 001b_additional_tables.sql
-- Description: Additional tables not in core migration
-- ============================================================================

-- ============================================================================
-- INVENTORY & STOCK
-- ============================================================================

-- Stock (renamed from db_iv_stock)
CREATE TABLE stock (
    id BIGSERIAL PRIMARY KEY,
    product_sku VARCHAR(100) NOT NULL, -- sku_product
    location VARCHAR(10) NOT NULL,
    quantity INTEGER DEFAULT 0, -- qty
    stock_out INTEGER DEFAULT 0,
    coming_stock INTEGER DEFAULT 0,
    product_name VARCHAR(500) NOT NULL, -- name_product
    user_name VARCHAR(300) DEFAULT '', -- user
    time_group_sku TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_stock_product_sku ON stock(product_sku);
CREATE INDEX idx_stock_location ON stock(location);

-- Product Attribute (renamed from db_iv_attributes)
CREATE TABLE product_attribute (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(300) NOT NULL,
    type VARCHAR(100) NOT NULL,
    value VARCHAR(300) DEFAULT '', -- value color (element support), value charm (size charm)
    description_en VARCHAR(1000) DEFAULT '', -- eng_description
    description_vn VARCHAR(1000) DEFAULT '', -- vn_description
    name_vn VARCHAR(200) DEFAULT '', -- vn_name
    hebes_id INTEGER NOT NULL DEFAULT 0, -- id_hb
    ebes_id INTEGER NOT NULL DEFAULT 0 -- id_eb
);

-- Product Tag (renamed from db_iv_tag)
CREATE TABLE product_tag (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL UNIQUE
);

-- Material Stock (renamed from db_material_stock)
CREATE TABLE material_stock (
    id BIGSERIAL PRIMARY KEY,
    material_sku VARCHAR(100) NOT NULL, -- sku_material
    category VARCHAR(100) NOT NULL,
    thumbnail VARCHAR(500) NOT NULL, -- thumb_nail
    material_name VARCHAR(500) NOT NULL, -- name_material
    price NUMERIC(12,2) DEFAULT 0,
    unit VARCHAR(100) NOT NULL,
    metal VARCHAR(100) DEFAULT NULL,
    stone VARCHAR(100) DEFAULT NULL,
    size VARCHAR(100) DEFAULT NULL,
    stock_vn NUMERIC(12,2) NOT NULL DEFAULT 0,
    stock_us NUMERIC(12,2) NOT NULL DEFAULT 0,
    collection VARCHAR(500) NOT NULL,
    bead NUMERIC(12,2) DEFAULT NULL,
    cost NUMERIC(12,2) DEFAULT 0,
    weight NUMERIC(12,2) DEFAULT NULL,
    total_bead_vn INTEGER DEFAULT NULL,
    total_bead_us INTEGER DEFAULT NULL,
    user_name VARCHAR(100) DEFAULT NULL, -- by_user
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Material Attribute (renamed from db_material_attributes)
CREATE TABLE material_attribute (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(100) NOT NULL,
    value VARCHAR(300) DEFAULT '""' -- value color (element support), value charm (size charm)
);

-- Product Material (renamed from db_material_per_product)
CREATE TABLE product_material (
    id BIGSERIAL PRIMARY KEY,
    material_sku VARCHAR(100) NOT NULL, -- sku_material
    unit VARCHAR(100) NOT NULL,
    product_sku VARCHAR(100) NOT NULL, -- sku_product
    quantity NUMERIC(12,2) NOT NULL, -- qty
    inbound INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_product_material_product_sku ON product_material(product_sku);
CREATE INDEX idx_product_material_material_sku ON product_material(material_sku);

-- Category Auto SKU (renamed from db_cat_autosku)
CREATE TABLE category_autosku (
    id BIGSERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    last_sku INTEGER NOT NULL
);

-- ============================================================================
-- PROMOTIONS
-- ============================================================================

-- Promotion (renamed from db_promo)
CREATE TABLE promotion (
    id BIGSERIAL PRIMARY KEY,
    project_id INTEGER DEFAULT NULL, -- id_project
    project_name VARCHAR(100) DEFAULT '', -- name_project
    is_active BOOLEAN DEFAULT FALSE, -- status
    promo_type INTEGER DEFAULT 0, -- type
    name VARCHAR(100) DEFAULT '', -- name_promo
    amount INTEGER DEFAULT NULL,
    description VARCHAR(1000) DEFAULT '',
    text_bar TEXT DEFAULT '',
    sync BOOLEAN DEFAULT FALSE,
    reset BOOLEAN DEFAULT FALSE,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL, -- date_start
    end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL, -- date_end
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Promotion Category Junction Table (normalized from category comma-separated)
CREATE TABLE promotion_category (
    id BIGSERIAL PRIMARY KEY,
    promotion_id BIGINT NOT NULL REFERENCES promotion(id) ON DELETE CASCADE,
    category_id BIGINT NOT NULL REFERENCES category(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(promotion_id, category_id)
);

CREATE INDEX idx_promotion_category_promotion ON promotion_category(promotion_id);
CREATE INDEX idx_promotion_category_category ON promotion_category(category_id);

-- Promotion Excluded Category Junction Table (normalized from not_category)
CREATE TABLE promotion_excluded_category (
    id BIGSERIAL PRIMARY KEY,
    promotion_id BIGINT NOT NULL REFERENCES promotion(id) ON DELETE CASCADE,
    category_id BIGINT NOT NULL REFERENCES category(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(promotion_id, category_id)
);

CREATE INDEX idx_promotion_excluded_category_promotion ON promotion_excluded_category(promotion_id);

-- Promotion Product Junction Table (normalized from product comma-separated)
CREATE TABLE promotion_product (
    id BIGSERIAL PRIMARY KEY,
    promotion_id BIGINT NOT NULL REFERENCES promotion(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(promotion_id, product_id)
);

CREATE INDEX idx_promotion_product_promotion ON promotion_product(promotion_id);
CREATE INDEX idx_promotion_product_product ON promotion_product(product_id);

-- Promotion Excluded Product Junction Table (normalized from not_product)
CREATE TABLE promotion_excluded_product (
    id BIGSERIAL PRIMARY KEY,
    promotion_id BIGINT NOT NULL REFERENCES promotion(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(promotion_id, product_id)
);

CREATE INDEX idx_promotion_excluded_product_promotion ON promotion_excluded_product(promotion_id);

-- Promotion Attribute Junction Table (normalized from attribute comma-separated)
CREATE TABLE promotion_attribute (
    id BIGSERIAL PRIMARY KEY,
    promotion_id BIGINT NOT NULL REFERENCES promotion(id) ON DELETE CASCADE,
    attribute_id BIGINT NOT NULL REFERENCES product_attribute(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(promotion_id, attribute_id)
);

CREATE INDEX idx_promotion_attribute_promotion ON promotion_attribute(promotion_id);

-- Promotion Excluded Attribute Junction Table (normalized from not_attribute)
CREATE TABLE promotion_excluded_attribute (
    id BIGSERIAL PRIMARY KEY,
    promotion_id BIGINT NOT NULL REFERENCES promotion(id) ON DELETE CASCADE,
    attribute_id BIGINT NOT NULL REFERENCES product_attribute(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(promotion_id, attribute_id)
);

CREATE INDEX idx_promotion_excluded_attribute_promotion ON promotion_excluded_attribute(promotion_id);

-- Promotion Period (renamed from db_new_promo_two)
CREATE TABLE promotion_period (
    id BIGSERIAL PRIMARY KEY,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL, -- start_time_promo
    end_time TIMESTAMP WITH TIME ZONE NOT NULL, -- end_time_promo
    title VARCHAR(255) DEFAULT NULL
);

-- Promotion Item (renamed from db_new_promo_two_item)
CREATE TABLE promotion_item (
    id BIGSERIAL PRIMARY KEY,
    promotion_id VARCHAR(50) DEFAULT NULL, -- promo_id
    promo VARCHAR(255) DEFAULT NULL,
    item TEXT DEFAULT NULL,
    categories TEXT DEFAULT NULL,
    products TEXT DEFAULT NULL,
    attributes TEXT DEFAULT NULL,
    categories_not_list TEXT DEFAULT NULL,
    products_not_list TEXT DEFAULT NULL,
    attribute_not_list TEXT DEFAULT NULL,
    detail TEXT DEFAULT NULL,
    status VARCHAR(50) DEFAULT NULL,
    percent_sale_price INTEGER DEFAULT NULL,
    number_sale_price NUMERIC(12,2) DEFAULT NULL,
    text_bar TEXT DEFAULT NULL,
    active_reset_hebes INTEGER DEFAULT 0,
    active_reset_ebes INTEGER DEFAULT 0,
    active_send_hebes INTEGER DEFAULT 0,
    active_send_ebes INTEGER DEFAULT 0,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NULL, -- start_time_promo
    end_time TIMESTAMP WITH TIME ZONE DEFAULT NULL, -- end_time_promo
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- RETURNS & REFUNDS
-- ============================================================================

-- Order Return (renamed from db_order_return)
CREATE TABLE order_return (
    id BIGSERIAL PRIMARY KEY,
    original_order_id BIGINT DEFAULT 0, -- id_old_order
    status_order VARCHAR(256) DEFAULT '',
    sale_order_staff_id INTEGER DEFAULT 0, -- sale_order
    updated_by_id BIGINT DEFAULT 0 REFERENCES staff(id), -- updated_by
    tracking_number VARCHAR(256) DEFAULT '',
    customer_name VARCHAR(400) DEFAULT '',
    order_date TIMESTAMP WITH TIME ZONE DEFAULT NULL, -- order_date (was '0000-00-00')
    inquiry_date DATE DEFAULT CURRENT_DATE, -- date_inquiry
    total NUMERIC(12,2) DEFAULT NULL,
    details_note VARCHAR(500) DEFAULT '',
    case_type VARCHAR(256) DEFAULT '', -- case
    status VARCHAR(256) DEFAULT '',
    email VARCHAR(300) DEFAULT '',
    reason VARCHAR(256) DEFAULT '',
    status_tracking VARCHAR(256) DEFAULT '',
    rma_code INTEGER DEFAULT 0, -- code_rma
    amount VARCHAR(256) DEFAULT '',
    received_date DATE DEFAULT NULL, -- date_received
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP -- date_created_inquiry
);

-- Refund (renamed from db_list_refunded_order)
CREATE TABLE refund (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES "order"(id), -- id_order
    staff_id BIGINT DEFAULT 0 REFERENCES staff(id), -- id_staff
    store VARCHAR(100) NOT NULL DEFAULT '',
    amount NUMERIC(12,2) DEFAULT 0,
    payment_method VARCHAR(200) DEFAULT '',
    source VARCHAR(100) DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE INDEX idx_refund_order ON refund(order_id);
CREATE INDEX idx_refund_staff ON refund(staff_id);

-- After Sales Service (renamed from db_status_after_sales_services)
CREATE TABLE after_sales_service (
    id BIGSERIAL PRIMARY KEY,
    original_order_id BIGINT DEFAULT 0, -- id_old_order
    updated_by_id BIGINT DEFAULT 0 REFERENCES staff(id), -- updated_by
    inquiry_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- date_inquiry
    details_note VARCHAR(500) DEFAULT '',
    case_services VARCHAR(256) DEFAULT '', -- case_services
    status_case VARCHAR(256) DEFAULT '',
    created_inquiry_date DATE DEFAULT CURRENT_DATE, -- date_created_inquiry
    reason VARCHAR(256) DEFAULT '',
    status_tracking VARCHAR(256) DEFAULT '',
    rma_code INTEGER DEFAULT 0, -- code_rma
    received_date DATE DEFAULT NULL, -- date_received
    tracking_number VARCHAR(80) DEFAULT '',
    amount NUMERIC(12,2) DEFAULT 0
);

-- Diamond Order Status (renamed from db_status_diamond)
CREATE TABLE diamond_order_status (
    id BIGSERIAL PRIMARY KEY,
    actual_amount NUMERIC(12,2) DEFAULT 0,
    balance_due NUMERIC(12,2) DEFAULT 0,
    status_payment VARCHAR(256) DEFAULT '',
    img_3d_design VARCHAR(256) DEFAULT '',
    status_design VARCHAR(256) DEFAULT '',
    design_time DATE DEFAULT NULL, -- time_design (was '0000-00-00')
    material_time DATE DEFAULT NULL, -- time_material (was '0000-00-00')
    status_material VARCHAR(256) DEFAULT '',
    status_complete VARCHAR(256) DEFAULT '',
    complete_time DATE DEFAULT NULL, -- time_complete (was '0000-00-00')
    ship_date DATE DEFAULT NULL, -- ship_date (was '0000-00-00')
    check_status VARCHAR(5000) DEFAULT 'Size-0-0|Metal-0-0|Stone-0-0|Main Stone-0-0|Engrave-0-0|Perfection-0-0|Note-0',
    is_third_party_brand BOOLEAN NOT NULL DEFAULT FALSE -- third_party_brand
);

-- Pre Order Status (renamed from db_status_pre_order)
CREATE TABLE pre_order_status (
    id BIGSERIAL PRIMARY KEY,
    status VARCHAR(256) NOT NULL DEFAULT 'pending',
    updated_by_id BIGINT DEFAULT 0 REFERENCES staff(id), -- update_by
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- update_time
    hold_until DATE DEFAULT NULL,
    reason VARCHAR(256) NOT NULL DEFAULT '',
    category VARCHAR(256) NOT NULL DEFAULT '',
    vendor VARCHAR(300) NOT NULL DEFAULT '',
    note VARCHAR(500) DEFAULT '',
    processing_date DATE DEFAULT NULL
);

-- Custom Product Order (renamed from db_order_product_custom)
CREATE TABLE custom_product_order (
    id BIGSERIAL PRIMARY KEY,
    status VARCHAR(100) DEFAULT 'draft',
    thumbnail VARCHAR(255) DEFAULT '', -- thumb_nail
    order_id BIGINT NOT NULL REFERENCES "order"(id), -- id_order
    size VARCHAR(50) NOT NULL,
    material VARCHAR(500) DEFAULT '',
    main_stone VARCHAR(255) DEFAULT '',
    stone VARCHAR(255) DEFAULT '',
    engrave VARCHAR(255) DEFAULT '',
    created_by_id BIGINT DEFAULT NULL REFERENCES staff(id), -- created_by
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_custom_product_order_order ON custom_product_order(order_id);

-- ============================================================================
-- SHIPPING CONTINUED
-- ============================================================================

-- Inbound Shipment Note (renamed from db_item_notes_inbound_shipment)
CREATE TABLE inbound_shipment_note (
    id BIGSERIAL PRIMARY KEY,
    shipment_id BIGINT NOT NULL REFERENCES inbound_shipment(id), -- shipment_id
    code VARCHAR(256) NOT NULL DEFAULT '',
    sku VARCHAR(256) DEFAULT NULL,
    thumbnail VARCHAR(100) DEFAULT '', -- thumb_nail
    name VARCHAR(500) NOT NULL,
    note VARCHAR(256) DEFAULT '',
    updated_by_id BIGINT DEFAULT NULL REFERENCES staff(id), -- update_by
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_inbound_shipment_note_shipment ON inbound_shipment_note(shipment_id);

-- Inbound Shipment Order (renamed from db_orders_inbound_shipment)
CREATE TABLE inbound_shipment_order (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES "order"(id), -- id_order
    type VARCHAR(256) NOT NULL DEFAULT 'transfer',
    shipment_id BIGINT NOT NULL REFERENCES inbound_shipment(id), -- id_shipment
    code VARCHAR(256) NOT NULL DEFAULT '',
    is_confirmed BOOLEAN DEFAULT FALSE, -- confirm
    items_count INTEGER NOT NULL DEFAULT 0, -- items
    products_count INTEGER NOT NULL DEFAULT 0, -- products
    note VARCHAR(256) DEFAULT '',
    has_issues BOOLEAN NOT NULL DEFAULT FALSE, -- issues
    created_at DATE DEFAULT CURRENT_DATE
);

CREATE INDEX idx_inbound_shipment_order_order ON inbound_shipment_order(order_id);
CREATE INDEX idx_inbound_shipment_order_shipment ON inbound_shipment_order(shipment_id);

-- ShipStation Order (renamed from db_shipstation_order)
CREATE TABLE shipstation_order (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES "order"(id), -- id_order
    order_number VARCHAR(256) DEFAULT '',
    tracking_number VARCHAR(256) DEFAULT '',
    tag VARCHAR(150) DEFAULT '',
    note VARCHAR(800) DEFAULT '',
    batch VARCHAR(156) DEFAULT '',
    status VARCHAR(20) DEFAULT '',
    ship_date DATE DEFAULT NULL,
    delivered_date DATE DEFAULT NULL,
    estimated_delivery DATE DEFAULT NULL,
    combine_id VARCHAR(256) DEFAULT '',
    list_combine VARCHAR(256) DEFAULT '',
    list_combine_number VARCHAR(256) DEFAULT '',
    order_link VARCHAR(256) DEFAULT '', -- link_order
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP -- time
);

CREATE INDEX idx_shipstation_order_order ON shipstation_order(order_id);

-- ============================================================================
-- SCHEDULING CONTINUED
-- ============================================================================

-- Draft Shift Schedule (renamed from db_draft_shift_schedule_sales)
CREATE TABLE draft_shift_schedule (
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

CREATE INDEX idx_draft_shift_schedule_staff ON draft_shift_schedule(staff_id);

-- Schedule Revision (renamed from db_info_revision_schedule)
CREATE TABLE schedule_revision (
    id BIGSERIAL PRIMARY KEY,
    updated_by_name VARCHAR(256) NOT NULL DEFAULT '', -- update_by
    revision_type VARCHAR(256) NOT NULL DEFAULT '', -- type
    start_date DATE DEFAULT NULL, -- date_time_start
    end_date DATE DEFAULT NULL, -- date_time_end
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Shift Schedule Revision (renamed from db_revision_shift_schedule)
CREATE TABLE shift_schedule_revision (
    id BIGSERIAL PRIMARY KEY,
    revision_id BIGINT NOT NULL REFERENCES schedule_revision(id) ON DELETE CASCADE, -- id_revision
    staff_id BIGINT NOT NULL REFERENCES staff(id), -- id_staff
    start_time TIMESTAMP WITH TIME ZONE NOT NULL, -- date_time_start
    end_time TIMESTAMP WITH TIME ZONE NOT NULL, -- date_time_end
    shift VARCHAR(256) NOT NULL DEFAULT '',
    total_time INTEGER NOT NULL DEFAULT 0,
    type_sales_off VARCHAR(256) NOT NULL DEFAULT '',
    is_authorized BOOLEAN NOT NULL DEFAULT FALSE, -- status_authorization
    reason VARCHAR(256) NOT NULL DEFAULT '',
    complete_shift INTEGER DEFAULT 2,
    report_shift_id INTEGER DEFAULT 0, -- id_report_shift
    is_confirmed BOOLEAN NOT NULL DEFAULT TRUE, -- confirm
    is_leader_shift BOOLEAN DEFAULT FALSE, -- leader_shift
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_shift_schedule_revision_revision ON shift_schedule_revision(revision_id);
CREATE INDEX idx_shift_schedule_revision_staff ON shift_schedule_revision(staff_id);

-- Schedule Preference (renamed from db_schedule_preferences)
CREATE TABLE schedule_preference (
    id BIGSERIAL PRIMARY KEY,
    week INTEGER NOT NULL DEFAULT 1,
    year INTEGER DEFAULT NULL, -- year(4)
    preferences VARCHAR(500) NOT NULL DEFAULT '', -- schedule_preferences
    staff_id BIGINT NOT NULL DEFAULT 0 REFERENCES staff(id), -- id_staff
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_schedule_preference_staff ON schedule_preference(staff_id);

-- Time Off Request (renamed from db_request_off_sales)
CREATE TABLE time_off_request (
    id BIGSERIAL PRIMARY KEY,
    group_name VARCHAR(100) DEFAULT '', -- group
    staff_id BIGINT NOT NULL DEFAULT 0 REFERENCES staff(id), -- id_staff
    reason VARCHAR(256) NOT NULL DEFAULT '',
    body_email VARCHAR(800) DEFAULT NULL,
    day_off DATE DEFAULT NULL,
    status VARCHAR(256) NOT NULL DEFAULT 'Processing',
    shift_schedule_id BIGINT DEFAULT 0, -- id_shift_schedule
    hr_comment VARCHAR(600) DEFAULT '',
    confirmed_by_id BIGINT DEFAULT NULL REFERENCES staff(id), -- confirm_by
    confirmed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL, -- date_confirm
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE INDEX idx_time_off_request_staff ON time_off_request(staff_id);

-- Shift Target (renamed from db_target_report_end_shift)
CREATE TABLE shift_target (
    id BIGSERIAL PRIMARY KEY,
    staff_id BIGINT NOT NULL REFERENCES staff(id), -- id_staff
    start_date DATE NOT NULL, -- date_start_target
    end_date DATE NOT NULL, -- date_end_target
    total_revenue NUMERIC(12,2) NOT NULL DEFAULT 0,
    purchase_first_time_order NUMERIC(12,2) NOT NULL DEFAULT 0,
    count_first_time_order INTEGER NOT NULL DEFAULT 0,
    purchase_cart_sent NUMERIC(12,2) NOT NULL DEFAULT 0,
    count_cart_sent INTEGER NOT NULL DEFAULT 0,
    purchase_potential_customers NUMERIC(12,2) NOT NULL DEFAULT 0,
    count_potential_customers INTEGER NOT NULL DEFAULT 0,
    new_leads INTEGER NOT NULL DEFAULT 0,
    customers_contacted INTEGER NOT NULL DEFAULT 0,
    messages_sent INTEGER NOT NULL DEFAULT 0,
    note VARCHAR(256) DEFAULT '',
    time_zone VARCHAR(50) DEFAULT 'VN',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_shift_target_staff ON shift_target(staff_id);

-- ============================================================================
-- TASKS & PROJECTS CONTINUED
-- ============================================================================

-- Task Notification (renamed from db_notification_task)
CREATE TABLE task_notification (
    id BIGSERIAL PRIMARY KEY,
    assignee_id BIGINT NOT NULL REFERENCES staff(id), -- id_assignee
    created_by_id BIGINT NOT NULL DEFAULT 0 REFERENCES staff(id), -- create_by
    task_id BIGINT NOT NULL REFERENCES task(id), -- id_task
    type VARCHAR(256) NOT NULL DEFAULT '',
    title VARCHAR(256) NOT NULL,
    details VARCHAR(800) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE, -- status
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP WITH TIME ZONE DEFAULT NULL -- date_read
);

CREATE INDEX idx_task_notification_assignee ON task_notification(assignee_id);
CREATE INDEX idx_task_notification_task ON task_notification(task_id);

-- Task Conversation (renamed from db_conversation_task)
CREATE TABLE task_conversation (
    id BIGSERIAL PRIMARY KEY,
    task_id BIGINT NOT NULL REFERENCES task(id), -- id_task
    sender_id BIGINT NOT NULL REFERENCES staff(id), -- sender_id
    message VARCHAR(500) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE INDEX idx_task_conversation_task ON task_conversation(task_id);
CREATE INDEX idx_task_conversation_sender ON task_conversation(sender_id);

-- Project Repository (renamed from db_repository_project)
CREATE TABLE project_repository (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES project(id), -- id_project
    file_link VARCHAR(500) NOT NULL DEFAULT '', -- link_file
    file_type VARCHAR(256) NOT NULL DEFAULT '', -- type_file
    file_name VARCHAR(256) NOT NULL DEFAULT '', -- name_file
    shared_by_id BIGINT NOT NULL DEFAULT 0 REFERENCES staff(id), -- share_by
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE INDEX idx_project_repository_project ON project_repository(project_id);

-- ============================================================================
-- ADDITIONAL TABLES
-- ============================================================================

-- Batch (renamed from db_list_batch)
CREATE TABLE batch (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(256) DEFAULT '',
    status VARCHAR(256) DEFAULT 'publish',
    note VARCHAR(256) DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Cart Share (renamed from db_list_cart_share)
CREATE TABLE cart_share (
    id BIGSERIAL PRIMARY KEY,
    cart_key VARCHAR(100) DEFAULT NULL,
    is_processed BOOLEAN DEFAULT FALSE, -- processed
    is_used BOOLEAN DEFAULT FALSE, -- used
    amount NUMERIC(12,2) DEFAULT 0,
    cart_type VARCHAR(100) NOT NULL DEFAULT '', -- type_cart
    store VARCHAR(100) DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Customer Link (renamed from db_sent_link_customer)
CREATE TABLE customer_link (
    id BIGSERIAL PRIMARY KEY,
    staff_id BIGINT NOT NULL REFERENCES staff(id), -- id_staff
    customer_id BIGINT DEFAULT NULL REFERENCES customer(id), -- id_customer
    code VARCHAR(256) DEFAULT NULL,
    code_type VARCHAR(100) NOT NULL DEFAULT '', -- type_code
    link_type VARCHAR(256) NOT NULL DEFAULT '', -- type
    amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    is_processed BOOLEAN NOT NULL DEFAULT FALSE, -- processed
    order_id BIGINT DEFAULT NULL REFERENCES "order"(id), -- id_order
    actual_amount NUMERIC(12,2) DEFAULT 0,
    store VARCHAR(100) DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customer_link_staff ON customer_link(staff_id);
CREATE INDEX idx_customer_link_customer ON customer_link(customer_id);
CREATE INDEX idx_customer_link_order ON customer_link(order_id);

-- Achievement (renamed from db_thanhtich)
CREATE TABLE achievement (
    id BIGSERIAL PRIMARY KEY,
    staff_id BIGINT NOT NULL DEFAULT 0 REFERENCES staff(id), -- id_nhanvien
    full_name VARCHAR(256) DEFAULT '',
    total_referrals INTEGER DEFAULT 0, -- total_gioi_thieu
    total_closed_orders INTEGER DEFAULT 0, -- total_chot_don
    revenue NUMERIC(12,2) NOT NULL DEFAULT 0, -- doanh_so
    monthly_target INTEGER DEFAULT 0, -- target_thang
    month VARCHAR(20) NOT NULL DEFAULT '01',
    year INTEGER NOT NULL -- year(4)
);

CREATE INDEX idx_achievement_staff ON achievement(staff_id);
CREATE INDEX idx_achievement_month_year ON achievement(month, year);

-- Staff Warning (renamed from db_warning_staff)
CREATE TABLE staff_warning (
    id BIGSERIAL PRIMARY KEY,
    staff_id BIGINT NOT NULL REFERENCES staff(id), -- id_staff
    order_id BIGINT NOT NULL REFERENCES "order"(id), -- id_order
    warning VARCHAR(456) NOT NULL,
    reply_notice VARCHAR(456) DEFAULT '', -- replay_notice
    warning_type VARCHAR(256) NOT NULL DEFAULT 'follow_customer', -- type
    type_id VARCHAR(256) DEFAULT '', -- id_type
    is_status_updated BOOLEAN DEFAULT FALSE, -- status_update
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_staff_warning_staff ON staff_warning(staff_id);
CREATE INDEX idx_staff_warning_order ON staff_warning(order_id);

-- Sales Management (renamed from db_sales_management)
CREATE TABLE sales_management (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL REFERENCES staff(id), -- employee_name (was int, should be FK)
    shift VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    new_customers INTEGER NOT NULL,
    orders_closed INTEGER NOT NULL,
    total_orders_closed INTEGER NOT NULL,
    potential_customers INTEGER NOT NULL,
    links_sent INTEGER NOT NULL,
    field_note TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sales_management_employee ON sales_management(employee_id);
CREATE INDEX idx_sales_management_date ON sales_management(date);

-- Category Removal Schedule (renamed from db_schedule_rm_cate)
CREATE TABLE category_removal_schedule (
    id BIGSERIAL PRIMARY KEY,
    sku VARCHAR(60) NOT NULL,
    scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL -- date_time
);

CREATE INDEX idx_category_removal_schedule_sku ON category_removal_schedule(sku);

-- ============================================================================
-- HISTORY & LOGGING CONTINUED
-- ============================================================================

-- Inventory History (renamed from db_history_inventory)
CREATE TABLE inventory_history (
    id BIGSERIAL PRIMARY KEY,
    inventory_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- date
    times INTEGER DEFAULT 1,
    status INTEGER DEFAULT 0,
    product_sku VARCHAR(100) NOT NULL, -- sku_product
    product_name VARCHAR(100) NOT NULL, -- name_product
    stock INTEGER NOT NULL DEFAULT 0,
    actual INTEGER NOT NULL DEFAULT 0,
    discrepancy INTEGER NOT NULL DEFAULT 0,
    detail VARCHAR(10000) DEFAULT NULL,
    location VARCHAR(100) NOT NULL,
    user_name VARCHAR(100) NOT NULL -- user
);

CREATE INDEX idx_inventory_history_product_sku ON inventory_history(product_sku);
CREATE INDEX idx_inventory_history_date ON inventory_history(inventory_date);

-- Ads Report History (renamed from db_history_report_ads)
CREATE TABLE ads_report_history (
    id BIGSERIAL PRIMARY KEY,
    report TEXT DEFAULT NULL,
    report_type VARCHAR(50) NOT NULL, -- type
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP -- update_at
);

-- Sales Performance History (renamed from db_history_sales_performance_tracker)
CREATE TABLE sales_performance_history (
    id BIGSERIAL PRIMARY KEY,
    staff_name VARCHAR(100) DEFAULT NULL, -- name_staff
    staff_id BIGINT DEFAULT NULL REFERENCES staff(id), -- id_staff
    actions VARCHAR(255) DEFAULT NULL,
    status INTEGER DEFAULT NULL,
    total_points_this_month VARCHAR(10) DEFAULT NULL,
    sub_staff_name VARCHAR(100) DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sales_performance_history_staff ON sales_performance_history(staff_id);

-- Webhook History (renamed from db_history_webhook_cb)
CREATE TABLE webhook_history (
    id BIGSERIAL PRIMARY KEY,
    endpoint VARCHAR(255) NOT NULL, -- end_point
    sent_by VARCHAR(255) NOT NULL, -- send_by
    data TEXT NOT NULL, -- longtext
    status VARCHAR(100) NOT NULL,
    response TEXT DEFAULT NULL, -- longtext
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_webhook_history_endpoint ON webhook_history(endpoint);
CREATE INDEX idx_webhook_history_created_at ON webhook_history(created_at);

-- Customer Merge Log (renamed from db_log_merge_customer)
CREATE TABLE customer_merge_log (
    id BIGSERIAL PRIMARY KEY,
    old_value VARCHAR(300) NOT NULL DEFAULT '',
    new_value VARCHAR(300) NOT NULL DEFAULT ''
);

-- Pancake Ads Log (renamed from db_log_ads_customer_pancake)
CREATE TABLE pancake_ads_log (
    id BIGSERIAL PRIMARY KEY,
    ads_id VARCHAR(100) NOT NULL,
    crm_customer_id BIGINT NOT NULL REFERENCES customer(id), -- id_customer_crm
    facebook_id VARCHAR(100) DEFAULT '', -- fb_id
    page_id VARCHAR(100) DEFAULT '',
    conversation_id VARCHAR(256) DEFAULT '',
    click_date TIMESTAMP WITH TIME ZONE DEFAULT NULL, -- date_click_ads
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pancake_ads_log_customer ON pancake_ads_log(crm_customer_id);

-- Apply update triggers
CREATE TRIGGER update_material_stock_updated_at BEFORE UPDATE ON material_stock
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_promotion_updated_at BEFORE UPDATE ON promotion
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_promotion_item_updated_at BEFORE UPDATE ON promotion_item
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_warning_updated_at BEFORE UPDATE ON staff_warning
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ads_report_history_updated_at BEFORE UPDATE ON ads_report_history
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

