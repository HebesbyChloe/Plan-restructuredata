-- ============================================================================
-- Shipment & Fulfilment Domain Module
-- ============================================================================
-- This migration creates tables for logistics, fulfilment, and inventory movements
-- Dependencies: sys_tenants, sys_users (001_system_tenant.sql)
-- Note: Some FKs to orders, order_line_items_properties, locations, hr_staff
--       will be added after those tables are created
-- ============================================================================

-- ----------------------------------------------------------------------------
-- LOGISTICS TABLES
-- ----------------------------------------------------------------------------

-- 1. logistic_vendors
CREATE TABLE IF NOT EXISTS logistic_vendors (
    id SERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL DEFAULT 1,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    contact_info JSONB NULL,
    address TEXT NULL,
    city VARCHAR(255) NULL,
    state VARCHAR(255) NULL,
    country VARCHAR(255) NULL,
    postal_code VARCHAR(50) NULL,
    phone VARCHAR(50) NULL,
    email VARCHAR(255) NULL,
    website VARCHAR(255) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT uq_logistic_vendors_code UNIQUE (code)
);

COMMENT ON TABLE logistic_vendors IS 'Vendor/supplier information management';
COMMENT ON COLUMN logistic_vendors.code IS 'Unique vendor code/identifier';
COMMENT ON COLUMN logistic_vendors.contact_info IS 'Flexible JSON structure for contact information';

-- Foreign Keys
ALTER TABLE logistic_vendors 
    ADD CONSTRAINT fk_logistic_vendors_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_vendors_code ON logistic_vendors(code);
CREATE INDEX IF NOT EXISTS idx_vendors_active ON logistic_vendors(is_active);
CREATE INDEX IF NOT EXISTS idx_vendors_tenant ON logistic_vendors(tenant_id);
CREATE INDEX IF NOT EXISTS idx_vendors_contact_info ON logistic_vendors USING GIN(contact_info) WHERE contact_info IS NOT NULL;

-- 2. logistic_inbounds
CREATE TABLE IF NOT EXISTS logistic_inbounds (
    id SERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL DEFAULT 1,
    code VARCHAR(255) NOT NULL,
    outbound_code VARCHAR(255) NULL,
    hub_id INTEGER NULL,
    location_id INTEGER NULL,
    vendor_id INTEGER NULL,
    status INTEGER NULL,
    tracking_number VARCHAR(255) NULL,
    ship_date DATE NULL,
    estimated_arrival_date DATE NULL,
    arrived_date DATE NULL,
    images TEXT[] NULL,
    notes TEXT NULL,
    updated_by INTEGER NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT uq_logistic_inbounds_code UNIQUE (code)
);

COMMENT ON TABLE logistic_inbounds IS 'Inbound shipment tracking and logistics management';
COMMENT ON COLUMN logistic_inbounds.code IS 'Unique shipment code/identifier';
COMMENT ON COLUMN logistic_inbounds.outbound_code IS 'Reference to related outbound shipment code';
COMMENT ON COLUMN logistic_inbounds.status IS 'Shipment status (e.g., 0=pending, 1=in_transit, 2=arrived, 3=received, 4=cancelled)';

-- Foreign Keys
ALTER TABLE logistic_inbounds 
    ADD CONSTRAINT fk_logistic_inbounds_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;
    
ALTER TABLE logistic_inbounds 
    ADD CONSTRAINT fk_logistic_inbounds_vendor_id 
    FOREIGN KEY (vendor_id) REFERENCES logistic_vendors(id) ON DELETE SET NULL;
    
ALTER TABLE logistic_inbounds 
    ADD CONSTRAINT fk_logistic_inbounds_updated_by 
    FOREIGN KEY (updated_by) REFERENCES sys_users(id) ON DELETE SET NULL;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_inbound_shipments_code ON logistic_inbounds(code);
CREATE INDEX IF NOT EXISTS idx_inbound_shipments_status ON logistic_inbounds(status);
CREATE INDEX IF NOT EXISTS idx_inbound_shipments_vendor ON logistic_inbounds(vendor_id);
CREATE INDEX IF NOT EXISTS idx_inbound_shipments_tenant ON logistic_inbounds(tenant_id);
CREATE INDEX IF NOT EXISTS idx_inbound_shipments_dates ON logistic_inbounds(ship_date, estimated_arrival_date, arrived_date);

-- 3. logistic_outbounds
CREATE TABLE IF NOT EXISTS logistic_outbounds (
    id SERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL DEFAULT 1,
    code VARCHAR(255) NOT NULL,
    status INTEGER NULL,
    ship_date DATE NULL,
    delivery_date DATE NULL,
    estimated_arrival_date DATE NULL,
    tracking_number VARCHAR(255) NULL,
    image VARCHAR(255) NULL,
    batch_notes TEXT NULL,
    notes TEXT NULL,
    updated_by INTEGER NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT uq_logistic_outbounds_code UNIQUE (code)
);

COMMENT ON TABLE logistic_outbounds IS 'Outbound shipment tracking and logistics management';
COMMENT ON COLUMN logistic_outbounds.code IS 'Unique outbound shipment code/identifier';
COMMENT ON COLUMN logistic_outbounds.status IS 'Shipment status (e.g., 0=pending, 1=preparing, 2=shipped, 3=delivered, 4=cancelled)';

-- Foreign Keys
ALTER TABLE logistic_outbounds 
    ADD CONSTRAINT fk_logistic_outbounds_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;
    
ALTER TABLE logistic_outbounds 
    ADD CONSTRAINT fk_logistic_outbounds_updated_by 
    FOREIGN KEY (updated_by) REFERENCES sys_users(id) ON DELETE SET NULL;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_outbound_shipments_code ON logistic_outbounds(code);
CREATE INDEX IF NOT EXISTS idx_outbound_shipments_status ON logistic_outbounds(status);
CREATE INDEX IF NOT EXISTS idx_outbound_shipments_tenant ON logistic_outbounds(tenant_id);
CREATE INDEX IF NOT EXISTS idx_outbound_shipments_dates ON logistic_outbounds(ship_date, estimated_arrival_date, delivery_date);

-- 4. logistic_items_inbound
CREATE TABLE IF NOT EXISTS logistic_items_inbound (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id BIGINT NOT NULL DEFAULT 1,
    inbound_id INTEGER NOT NULL,
    order_id BIGINT NULL,
    movement_id UUID NULL,
    po_id BIGINT NULL,
    product_id TEXT NOT NULL,
    sku TEXT NULL,
    quantity INTEGER NOT NULL,
    code TEXT NULL,
    item_type TEXT NULL,
    notes TEXT NULL,
    processed_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_logistic_items_inbound_quantity CHECK (quantity > 0)
);

COMMENT ON TABLE logistic_items_inbound IS 'Individual items in inbound logistics movements';
COMMENT ON COLUMN logistic_items_inbound.inbound_id IS 'Reference to inbound shipment';
COMMENT ON COLUMN logistic_items_inbound.product_id IS 'Product identifier (text format)';

-- Foreign Keys
ALTER TABLE logistic_items_inbound 
    ADD CONSTRAINT fk_logistic_items_inbound_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;
    
ALTER TABLE logistic_items_inbound 
    ADD CONSTRAINT fk_logistic_items_inbound_inbound_id 
    FOREIGN KEY (inbound_id) REFERENCES logistic_inbounds(id) ON DELETE CASCADE;

-- Note: order_id FK will be added after orders table is created

-- Indexes
CREATE INDEX IF NOT EXISTS idx_log_items_inbound_tenant ON logistic_items_inbound(tenant_id);
CREATE INDEX IF NOT EXISTS idx_log_items_inbound_order ON logistic_items_inbound(order_id);
CREATE INDEX IF NOT EXISTS idx_log_items_inbound_product ON logistic_items_inbound(product_id);
CREATE INDEX IF NOT EXISTS idx_log_items_inbound_inbound ON logistic_items_inbound(inbound_id);
CREATE INDEX IF NOT EXISTS idx_log_items_inbound_sku ON logistic_items_inbound(sku) WHERE sku IS NOT NULL;

-- 5. logistic_items_outbound
CREATE TABLE IF NOT EXISTS logistic_items_outbound (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id BIGINT NOT NULL DEFAULT 1,
    outbound_id INTEGER NOT NULL,
    order_id BIGINT NULL,
    movement_id UUID NULL,
    product_id TEXT NOT NULL,
    sku TEXT NULL,
    quantity INTEGER NOT NULL,
    code TEXT NULL,
    item_type TEXT NULL,
    notes TEXT NULL,
    processed_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_logistic_items_outbound_quantity CHECK (quantity > 0)
);

COMMENT ON TABLE logistic_items_outbound IS 'Individual items in outbound logistics movements';
COMMENT ON COLUMN logistic_items_outbound.outbound_id IS 'Reference to outbound shipment';
COMMENT ON COLUMN logistic_items_outbound.product_id IS 'Product identifier (text format)';

-- Foreign Keys
ALTER TABLE logistic_items_outbound 
    ADD CONSTRAINT fk_logistic_items_outbound_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;
    
ALTER TABLE logistic_items_outbound 
    ADD CONSTRAINT fk_logistic_items_outbound_outbound_id 
    FOREIGN KEY (outbound_id) REFERENCES logistic_outbounds(id) ON DELETE CASCADE;

-- Note: order_id FK will be added after orders table is created

-- Indexes
CREATE INDEX IF NOT EXISTS idx_log_items_outbound_tenant ON logistic_items_outbound(tenant_id);
CREATE INDEX IF NOT EXISTS idx_log_items_outbound_order ON logistic_items_outbound(order_id);
CREATE INDEX IF NOT EXISTS idx_log_items_outbound_product ON logistic_items_outbound(product_id);
CREATE INDEX IF NOT EXISTS idx_log_items_outbound_outbound ON logistic_items_outbound(outbound_id);
CREATE INDEX IF NOT EXISTS idx_log_items_outbound_sku ON logistic_items_outbound(sku) WHERE sku IS NOT NULL;

-- ----------------------------------------------------------------------------
-- FULFILMENT TABLES
-- ----------------------------------------------------------------------------

-- 6. shipment_statuses
CREATE TABLE IF NOT EXISTS shipment_statuses (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT uq_shipment_statuses_code UNIQUE (code)
);

COMMENT ON TABLE shipment_statuses IS 'Lookup table for shipment status definitions';
COMMENT ON COLUMN shipment_statuses.code IS 'Unique status code (e.g., pending, processing, shipped, delivered)';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_shipment_statuses_code ON shipment_statuses(code);
CREATE INDEX IF NOT EXISTS idx_shipment_statuses_active ON shipment_statuses(is_active) WHERE is_active = TRUE;

-- 7. fulfilment_batches
CREATE TABLE IF NOT EXISTS fulfilment_batches (
    id SERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL DEFAULT 1,
    name VARCHAR(200) NULL,
    status INTEGER NULL,
    ship_date DATE NULL,
    created_by INTEGER NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE fulfilment_batches IS 'Batch management for grouping and processing multiple shipments together';
COMMENT ON COLUMN fulfilment_batches.status IS 'Batch status (e.g., 0=draft, 1=processing, 2=completed, 3=cancelled)';

-- Foreign Keys
ALTER TABLE fulfilment_batches 
    ADD CONSTRAINT fk_fulfilment_batches_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;
    
ALTER TABLE fulfilment_batches 
    ADD CONSTRAINT fk_fulfilment_batches_created_by 
    FOREIGN KEY (created_by) REFERENCES sys_users(id) ON DELETE SET NULL;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_fulfilment_batches_tenant ON fulfilment_batches(tenant_id);
CREATE INDEX IF NOT EXISTS idx_fulfilment_batches_status ON fulfilment_batches(status);
CREATE INDEX IF NOT EXISTS idx_fulfilment_batches_ship_date ON fulfilment_batches(ship_date);

-- 8. fulfilment_batches_meta
CREATE TABLE IF NOT EXISTS fulfilment_batches_meta (
    batch_id INTEGER PRIMARY KEY,
    current_status INTEGER NULL,
    shipments_count INTEGER NOT NULL DEFAULT 0,
    orders_count INTEGER NOT NULL DEFAULT 0,
    items_count INTEGER NOT NULL DEFAULT 0,
    total_estimated_cost NUMERIC(12,2) NULL,
    total_actual_cost NUMERIC(12,2) NULL,
    shipped_at DATE NULL,
    delivered_at DATE NULL,
    last_error TEXT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE fulfilment_batches_meta IS 'Metadata and statistics for fulfilment batches';
COMMENT ON COLUMN fulfilment_batches_meta.batch_id IS 'Reference to fulfilment batch (1:1 relationship)';

-- Foreign Keys
ALTER TABLE fulfilment_batches_meta 
    ADD CONSTRAINT fk_fulfilment_batches_meta_batch_id 
    FOREIGN KEY (batch_id) REFERENCES fulfilment_batches(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_fulfilment_batches_meta_status ON fulfilment_batches_meta(current_status);

-- 9. fulfilment_shipments
CREATE TABLE IF NOT EXISTS fulfilment_shipments (
    id SERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL DEFAULT 1,
    shipment_number VARCHAR(200) NOT NULL,
    ship_from_location VARCHAR(200) NULL,
    ship_to_name VARCHAR(200) NULL,
    ship_to_phone VARCHAR(50) NULL,
    ship_to_email VARCHAR(200) NULL,
    ship_to_address TEXT NULL,
    ship_to_city VARCHAR(200) NULL,
    ship_to_state VARCHAR(200) NULL,
    ship_to_country VARCHAR(200) NULL,
    ship_to_post_code VARCHAR(50) NULL,
    address_residential BOOLEAN NOT NULL DEFAULT FALSE,
    carrier VARCHAR(100) NULL,
    service VARCHAR(100) NULL,
    package_weight NUMERIC(10,2) NULL,
    package_length NUMERIC(10,2) NULL,
    package_width NUMERIC(10,2) NULL,
    package_height NUMERIC(10,2) NULL,
    package_code VARCHAR(50) NULL,
    tracking_number VARCHAR(200) NULL,
    tracking_url TEXT NULL,
    status VARCHAR(50) NULL,
    label_download_url TEXT NULL,
    label_expires_at TIMESTAMPTZ NULL,
    label_format VARCHAR(20) NOT NULL DEFAULT 'pdf',
    estimated_shipping_cost NUMERIC(12,2) NULL,
    actual_shipping_cost NUMERIC(12,2) NULL,
    insurance_amount NUMERIC(12,2) NULL,
    confirmation_amount NUMERIC(12,2) NULL,
    total_cost NUMERIC(12,2) NULL,
    require_insurance BOOLEAN NOT NULL DEFAULT FALSE,
    require_signature BOOLEAN NOT NULL DEFAULT FALSE,
    saturday_delivery BOOLEAN NOT NULL DEFAULT FALSE,
    contains_alcohol BOOLEAN NOT NULL DEFAULT FALSE,
    ship_date DATE NULL,
    estimated_delivery_date DATE NULL,
    actual_delivery_date DATE NULL,
    label_printed BOOLEAN NOT NULL DEFAULT FALSE,
    label_voided BOOLEAN NOT NULL DEFAULT FALSE,
    label_voided_at TIMESTAMPTZ NULL,
    batch_id INTEGER NULL,
    note TEXT NULL,
    created_by INTEGER NULL,
    updated_by INTEGER NULL,
    date_created TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status_id INTEGER NULL,
    
    CONSTRAINT uq_fulfilment_shipments_shipment_number UNIQUE (shipment_number)
);

COMMENT ON TABLE fulfilment_shipments IS 'Main fulfilment shipment tracking table with complete shipping details';
COMMENT ON COLUMN fulfilment_shipments.shipment_number IS 'Unique shipment number/identifier';
COMMENT ON COLUMN fulfilment_shipments.status IS 'Legacy status field (deprecated, use status_id)';
COMMENT ON COLUMN fulfilment_shipments.status_id IS 'Reference to standardized status';

-- Foreign Keys
ALTER TABLE fulfilment_shipments 
    ADD CONSTRAINT fk_fulfilment_shipments_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;
    
ALTER TABLE fulfilment_shipments 
    ADD CONSTRAINT fk_fulfilment_shipments_status_id 
    FOREIGN KEY (status_id) REFERENCES shipment_statuses(id) ON DELETE SET NULL;
    
ALTER TABLE fulfilment_shipments 
    ADD CONSTRAINT fk_fulfilment_shipments_batch_id 
    FOREIGN KEY (batch_id) REFERENCES fulfilment_batches(id) ON DELETE SET NULL;
    
ALTER TABLE fulfilment_shipments 
    ADD CONSTRAINT fk_fulfilment_shipments_created_by 
    FOREIGN KEY (created_by) REFERENCES sys_users(id) ON DELETE SET NULL;
    
ALTER TABLE fulfilment_shipments 
    ADD CONSTRAINT fk_fulfilment_shipments_updated_by 
    FOREIGN KEY (updated_by) REFERENCES sys_users(id) ON DELETE SET NULL;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_fulfilment_shipments_shipment_number ON fulfilment_shipments(shipment_number);
CREATE INDEX IF NOT EXISTS idx_fulfilment_shipments_tenant ON fulfilment_shipments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_fulfilment_shipments_status_id ON fulfilment_shipments(status_id);
CREATE INDEX IF NOT EXISTS idx_fulfilment_shipments_batch_id ON fulfilment_shipments(batch_id);
CREATE INDEX IF NOT EXISTS idx_fulfilment_shipments_tracking_number ON fulfilment_shipments(tracking_number);
CREATE INDEX IF NOT EXISTS idx_fulfilment_shipments_dates ON fulfilment_shipments(ship_date, estimated_delivery_date, actual_delivery_date);

-- 10. shipment_line_items
CREATE TABLE IF NOT EXISTS shipment_line_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    line_item_id INTEGER NOT NULL,
    shipment_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_shipment_line_items_quantity CHECK (quantity > 0)
);

COMMENT ON TABLE shipment_line_items IS 'Junction table linking order line items to fulfilment shipments';
COMMENT ON COLUMN shipment_line_items.quantity IS 'Quantity of items in shipment (must be positive)';

-- Foreign Keys
-- Note: line_item_id FK will be added after order_line_items_properties table is created
ALTER TABLE shipment_line_items 
    ADD CONSTRAINT fk_shipment_line_items_shipment_id 
    FOREIGN KEY (shipment_id) REFERENCES fulfilment_shipments(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_shipment_line_items_line_item ON shipment_line_items(line_item_id);
CREATE INDEX IF NOT EXISTS idx_shipment_line_items_shipment ON shipment_line_items(shipment_id);
CREATE INDEX IF NOT EXISTS idx_shipment_line_items_shipment_line_item ON shipment_line_items(shipment_id, line_item_id);

-- 11. shipment_orders
CREATE TABLE IF NOT EXISTS shipment_orders (
    shipment_id INTEGER NOT NULL,
    order_id BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT pk_shipment_orders PRIMARY KEY (shipment_id, order_id)
);

COMMENT ON TABLE shipment_orders IS 'Junction table linking fulfilment shipments to orders';

-- Foreign Keys
ALTER TABLE shipment_orders 
    ADD CONSTRAINT fk_shipment_orders_shipment_id 
    FOREIGN KEY (shipment_id) REFERENCES fulfilment_shipments(id) ON DELETE CASCADE;

-- Note: order_id FK will be added after orders table is created

-- Indexes
CREATE INDEX IF NOT EXISTS idx_shipment_orders_shipment ON shipment_orders(shipment_id);
CREATE INDEX IF NOT EXISTS idx_shipment_orders_order ON shipment_orders(order_id);

-- ----------------------------------------------------------------------------
-- INVENTORY MOVEMENTS
-- ----------------------------------------------------------------------------

-- 12. inv_movements
CREATE TABLE IF NOT EXISTS inv_movements (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL DEFAULT 1,
    movement_type VARCHAR(50) NULL,
    movement_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reference_number VARCHAR(200) NULL,
    product_id VARCHAR(200) NULL,
    sku VARCHAR(200) NULL,
    from_location_id INTEGER NULL,
    to_location_id INTEGER NULL,
    batch_number VARCHAR(200) NULL,
    quantity_change INTEGER NOT NULL,
    quantity_before INTEGER NULL,
    quantity_after INTEGER NULL,
    unit_cost NUMERIC(12,2) NULL,
    order_id BIGINT NULL,
    order_line_item_id BIGINT NULL,
    shipment_id INTEGER NULL,
    inbound_shipment_id INTEGER NULL,
    outbound_shipment_id INTEGER NULL,
    adjustment_reason VARCHAR(200) NULL,
    source_document_type VARCHAR(100) NULL,
    performed_by INTEGER NULL,
    notes TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_inv_movements_qty_change_nonzero CHECK (quantity_change != 0),
    CONSTRAINT chk_inv_movements_qty_math CHECK (
        (quantity_before IS NULL AND quantity_after IS NULL) OR
        (quantity_before IS NOT NULL AND quantity_after IS NOT NULL AND quantity_after = quantity_before + quantity_change)
    )
);

COMMENT ON TABLE inv_movements IS 'Inventory movement tracking with complete audit trail';
COMMENT ON COLUMN inv_movements.movement_type IS 'Type of movement (e.g., receipt, shipment, transfer, adjustment, return)';
COMMENT ON COLUMN inv_movements.quantity_change IS 'Quantity change (positive for increase, negative for decrease)';

-- Foreign Keys
ALTER TABLE inv_movements 
    ADD CONSTRAINT fk_inv_movements_tenant_id 
    FOREIGN KEY (tenant_id) REFERENCES sys_tenants(id) ON DELETE CASCADE;
    
ALTER TABLE inv_movements 
    ADD CONSTRAINT fk_inv_movements_shipment_id 
    FOREIGN KEY (shipment_id) REFERENCES fulfilment_shipments(id) ON DELETE SET NULL;
    
ALTER TABLE inv_movements 
    ADD CONSTRAINT fk_inv_movements_inbound_shipment_id 
    FOREIGN KEY (inbound_shipment_id) REFERENCES logistic_inbounds(id) ON DELETE SET NULL;
    
ALTER TABLE inv_movements 
    ADD CONSTRAINT fk_inv_movements_outbound_shipment_id 
    FOREIGN KEY (outbound_shipment_id) REFERENCES logistic_outbounds(id) ON DELETE SET NULL;
    
ALTER TABLE inv_movements 
    ADD CONSTRAINT fk_inv_movements_performed_by 
    FOREIGN KEY (performed_by) REFERENCES sys_users(id) ON DELETE SET NULL;

-- Note: from_location_id, to_location_id, order_id, order_line_item_id FKs will be added after those tables are created

-- Indexes
CREATE INDEX IF NOT EXISTS idx_inv_movements_product ON inv_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_inv_movements_sku ON inv_movements(sku);
CREATE INDEX IF NOT EXISTS idx_inv_movements_from_location ON inv_movements(from_location_id);
CREATE INDEX IF NOT EXISTS idx_inv_movements_to_location ON inv_movements(to_location_id);
CREATE INDEX IF NOT EXISTS idx_inv_movements_movement_date ON inv_movements(movement_date);
CREATE INDEX IF NOT EXISTS idx_inv_movements_tenant ON inv_movements(tenant_id);
CREATE INDEX IF NOT EXISTS idx_inv_movements_order_id ON inv_movements(order_id);
CREATE INDEX IF NOT EXISTS idx_inv_movements_shipment_ids ON inv_movements(shipment_id, inbound_shipment_id, outbound_shipment_id);
CREATE INDEX IF NOT EXISTS idx_inv_movements_movement_type ON inv_movements(movement_type);
CREATE INDEX IF NOT EXISTS idx_inv_movements_tenant_date ON inv_movements(tenant_id, movement_date DESC);

-- ----------------------------------------------------------------------------
-- Triggers
-- ----------------------------------------------------------------------------

-- Auto-update updated_at timestamp for logistic_vendors
CREATE TRIGGER trg_logistic_vendors_updated_at
    BEFORE UPDATE ON logistic_vendors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at timestamp for logistic_inbounds
CREATE TRIGGER trg_logistic_inbounds_updated_at
    BEFORE UPDATE ON logistic_inbounds
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at timestamp for logistic_outbounds
CREATE TRIGGER trg_logistic_outbounds_updated_at
    BEFORE UPDATE ON logistic_outbounds
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at timestamp for logistic_items_inbound
CREATE TRIGGER trg_logistic_items_inbound_updated_at
    BEFORE UPDATE ON logistic_items_inbound
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at timestamp for logistic_items_outbound
CREATE TRIGGER trg_logistic_items_outbound_updated_at
    BEFORE UPDATE ON logistic_items_outbound
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at timestamp for fulfilment_batches_meta
CREATE TRIGGER trg_fulfilment_batches_meta_updated_at
    BEFORE UPDATE ON fulfilment_batches_meta
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at timestamp for fulfilment_shipments
CREATE TRIGGER trg_fulfilment_shipments_updated_at
    BEFORE UPDATE ON fulfilment_shipments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at timestamp for shipment_line_items
CREATE TRIGGER trg_shipment_line_items_updated_at
    BEFORE UPDATE ON shipment_line_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Note: Foreign keys from:
--       - logistic_items_inbound.order_id to orders.id
--       - logistic_items_outbound.order_id to orders.id
--       - shipment_line_items.line_item_id to order_line_items_properties.id
--       - shipment_orders.order_id to orders.id
--       - inv_movements.from_location_id, to_location_id to locations.id
--       - inv_movements.order_id to orders.id
--       - inv_movements.order_line_item_id to order_items.id
--       will be added after those tables are created
-- ============================================================================

