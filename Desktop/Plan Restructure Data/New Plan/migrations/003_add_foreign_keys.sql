-- ============================================================================
-- Foreign Keys Migration
-- Migration: 003_add_foreign_keys.sql
-- Description: Add all foreign key relationships with proper constraints
-- Note: Some FKs are already defined in table creation, this adds missing ones
-- ============================================================================

-- ============================================================================
-- CUSTOMER RELATIONSHIPS
-- ============================================================================

-- Customer -> Batch relationship
ALTER TABLE customer 
    ADD CONSTRAINT fk_customer_batch 
    FOREIGN KEY (batch_id) REFERENCES customer_batch(id);

-- ============================================================================
-- ORDER RELATIONSHIPS
-- ============================================================================

-- Order Line Item -> Product relationship (via SKU)
-- Note: This is a soft FK since we're using SKU string, not product.id
-- Consider adding product_id to order_line_item in future refactor

-- Order -> Customer relationship (soft, via email/name)
-- Note: Consider adding customer_id to order table in future refactor

-- ============================================================================
-- PRODUCT RELATIONSHIPS
-- ============================================================================

-- Product -> Promotion relationship
ALTER TABLE product 
    ADD CONSTRAINT fk_product_promotion 
    FOREIGN KEY (promotion_id) REFERENCES promotion(id);

-- Stock -> Product relationship (via SKU)
-- Note: This is a soft FK since we're using SKU string

-- ============================================================================
-- STAFF RELATIONSHIPS
-- ============================================================================

-- Employee Dashboard -> Staff (via email, but no direct FK)
-- Note: Consider adding staff_id to employee_dashboard in future refactor

-- ============================================================================
-- TASK RELATIONSHIPS
-- ============================================================================

-- Recurring Task -> Staff
ALTER TABLE recurring_task 
    ADD CONSTRAINT fk_recurring_task_assignee 
    FOREIGN KEY (assignee_id) REFERENCES staff(id);

-- Recurring Task -> Project
ALTER TABLE recurring_task 
    ADD CONSTRAINT fk_recurring_task_project 
    FOREIGN KEY (project_id) REFERENCES project(id);

-- ============================================================================
-- SHIPPING RELATIONSHIPS
-- ============================================================================

-- Inbound Shipment Item -> Order (soft FK, order_id is bigint)
-- Note: Consider adding proper FK if order_id always references order.id

-- Inbound Shipment Order -> Order
-- Already defined in table creation

-- ============================================================================
-- ADDITIONAL INDEXES FOR PERFORMANCE
-- ============================================================================

-- Order indexes for common queries
CREATE INDEX IF NOT EXISTS idx_order_customer_name ON "order"(customer_name);
CREATE INDEX IF NOT EXISTS idx_order_store ON "order"(store);
CREATE INDEX IF NOT EXISTS idx_order_created_at_status ON "order"(created_at, status);

-- Customer indexes
CREATE INDEX IF NOT EXISTS idx_customer_phone ON customer(phone);
CREATE INDEX IF NOT EXISTS idx_customer_source ON customer(source);

-- Product indexes
CREATE INDEX IF NOT EXISTS idx_product_name ON product(name);
CREATE INDEX IF NOT EXISTS idx_product_status_sku ON product(status, sku);

-- Staff indexes
CREATE INDEX IF NOT EXISTS idx_staff_location ON staff(location);
CREATE INDEX IF NOT EXISTS idx_staff_work_status ON staff(work_status);

-- Task indexes
CREATE INDEX IF NOT EXISTS idx_task_status ON task(status);
CREATE INDEX IF NOT EXISTS idx_task_deadline ON task(deadline);
CREATE INDEX IF NOT EXISTS idx_task_project_status ON task(project_id, status);

-- Campaign indexes
CREATE INDEX IF NOT EXISTS idx_campaign_status ON campaign(status);
CREATE INDEX IF NOT EXISTS idx_campaign_dates ON campaign(start_date, end_date);

-- Payment indexes
CREATE INDEX IF NOT EXISTS idx_payment_status ON payment(status);
CREATE INDEX IF NOT EXISTS idx_payment_method ON payment(payment_method);

-- Stock indexes
CREATE INDEX IF NOT EXISTS idx_stock_product_location ON stock(product_sku, location);

-- Lead Sale indexes
CREATE INDEX IF NOT EXISTS idx_lead_sale_status ON lead_sale(lead_status);
CREATE INDEX IF NOT EXISTS idx_lead_sale_source ON lead_sale(source);

-- Shift Schedule indexes
CREATE INDEX IF NOT EXISTS idx_shift_schedule_dates ON shift_schedule(start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_shift_schedule_shift ON shift_schedule(shift);

-- Message indexes
CREATE INDEX IF NOT EXISTS idx_pancake_message_page ON pancake_message(page_id);
CREATE INDEX IF NOT EXISTS idx_pancake_message_created ON pancake_message(created_at);

-- History indexes
CREATE INDEX IF NOT EXISTS idx_action_history_user ON action_history(user_name);
CREATE INDEX IF NOT EXISTS idx_stock_history_sku_time ON stock_history(sku, created_at);

-- ============================================================================
-- COMPOSITE INDEXES FOR COMMON QUERY PATTERNS
-- ============================================================================

-- Order queries by staff and date
CREATE INDEX IF NOT EXISTS idx_order_closed_by_date ON "order"(closed_by_staff_id, created_at);
CREATE INDEX IF NOT EXISTS idx_order_referred_by_date ON "order"(referred_by_staff_id, created_at);

-- Customer queries by source and date
CREATE INDEX IF NOT EXISTS idx_customer_source_created ON customer(source, created_at);

-- Product queries by status and price
CREATE INDEX IF NOT EXISTS idx_product_status_price ON product(status, sale_price);

-- Task queries by assignee and status
CREATE INDEX IF NOT EXISTS idx_task_assignee_status ON task(assignee_id, status);

-- Shift report queries by staff and date
CREATE INDEX IF NOT EXISTS idx_shift_report_staff_date ON shift_report(staff_id, report_date);

-- ============================================================================
-- UNIQUE CONSTRAINTS
-- ============================================================================

-- Ensure unique SKUs
-- Already defined in product table creation

-- Ensure unique order numbers (if needed)
-- CREATE UNIQUE INDEX IF NOT EXISTS idx_order_number_unique ON "order"(order_number) WHERE order_number != '';

-- Ensure unique customer emails (if business rule requires)
-- Note: Not adding as constraint since multiple customers might share email
-- CREATE UNIQUE INDEX IF NOT EXISTS idx_customer_email_unique ON customer(email);

-- ============================================================================
-- CHECK CONSTRAINTS
-- ============================================================================

-- Ensure positive amounts
ALTER TABLE "order" 
    ADD CONSTRAINT chk_order_total_positive 
    CHECK (total >= 0);

ALTER TABLE payment 
    ADD CONSTRAINT chk_payment_amount_positive 
    CHECK (amount >= 0);

ALTER TABLE product 
    ADD CONSTRAINT chk_product_prices_positive 
    CHECK (retail_price >= 0 AND sale_price >= 0);

-- Ensure valid dates
ALTER TABLE campaign 
    ADD CONSTRAINT chk_campaign_dates 
    CHECK (end_date IS NULL OR end_date >= start_date);

ALTER TABLE promotion 
    ADD CONSTRAINT chk_promotion_dates 
    CHECK (end_date IS NULL OR end_date >= start_date);

-- Ensure valid shift times
ALTER TABLE shift_schedule 
    ADD CONSTRAINT chk_shift_times 
    CHECK (end_time > start_time);

-- Ensure valid quantities
ALTER TABLE order_line_item 
    ADD CONSTRAINT chk_order_line_item_quantity 
    CHECK (quantity > 0);

ALTER TABLE stock 
    ADD CONSTRAINT chk_stock_quantity 
    CHECK (quantity >= 0);

-- ============================================================================
-- NOTES ON MISSING FOREIGN KEYS
-- ============================================================================

-- The following relationships exist but don't have FKs due to data integrity concerns:
-- 1. order_line_item.product_sku -> product.sku (string match, not FK)
-- 2. stock.product_sku -> product.sku (string match, not FK)
-- 3. order.customer_name/email -> customer (soft relationship)
-- 4. employee_dashboard.email -> staff (no direct relationship)

-- Consider future refactoring:
-- 1. Add product_id to order_line_item and stock tables
-- 2. Add customer_id to order table
-- 3. Add staff_id to employee_dashboard table

