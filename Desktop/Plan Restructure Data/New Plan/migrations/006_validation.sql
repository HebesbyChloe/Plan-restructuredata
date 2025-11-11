-- ============================================================================
-- Validation Script
-- Migration: 006_validation.sql
-- Description: Verify data completeness, referential integrity, and constraints
-- ============================================================================

-- ============================================================================
-- DATA COMPLETENESS CHECKS
-- ============================================================================

-- Check for missing required fields
DO $$
DECLARE
    missing_count INTEGER;
BEGIN
    -- Check customers without email
    SELECT COUNT(*) INTO missing_count FROM customer WHERE email IS NULL OR email = '';
    IF missing_count > 0 THEN
        RAISE NOTICE 'WARNING: % customers missing email', missing_count;
    END IF;

    -- Check orders without status
    SELECT COUNT(*) INTO missing_count FROM "order" WHERE status IS NULL OR status = '';
    IF missing_count > 0 THEN
        RAISE NOTICE 'WARNING: % orders missing status', missing_count;
    END IF;

    -- Check products without SKU
    SELECT COUNT(*) INTO missing_count FROM product WHERE sku IS NULL OR sku = '';
    IF missing_count > 0 THEN
        RAISE NOTICE 'WARNING: % products missing SKU', missing_count;
    END IF;
END $$;

-- ============================================================================
-- REFERENTIAL INTEGRITY CHECKS
-- ============================================================================

-- Check for orphaned order line items
SELECT 
    'Orphaned order line items' AS check_type,
    COUNT(*) AS issue_count
FROM order_line_item oli
LEFT JOIN "order" o ON oli.order_id = o.id
WHERE o.id IS NULL;

-- Check for orphaned payments
SELECT 
    'Orphaned payments' AS check_type,
    COUNT(*) AS issue_count
FROM payment p
LEFT JOIN "order" o ON p.order_id = o.id
WHERE o.id IS NULL;

-- Check for orphaned order details
SELECT 
    'Orphaned order details' AS check_type,
    COUNT(*) AS issue_count
FROM order_detail od
LEFT JOIN "order" o ON od.order_id = o.id
WHERE o.id IS NULL;

-- Check for orphaned shift schedules
SELECT 
    'Orphaned shift schedules' AS check_type,
    COUNT(*) AS issue_count
FROM shift_schedule ss
LEFT JOIN staff s ON ss.staff_id = s.id
WHERE s.id IS NULL;

-- Check for orphaned tasks
SELECT 
    'Orphaned tasks' AS check_type,
    COUNT(*) AS issue_count
FROM task t
LEFT JOIN staff s ON t.assignee_id = s.id
WHERE t.assignee_id != 0 AND s.id IS NULL;

-- Check for orphaned customer batches
SELECT 
    'Orphaned customer batch assignments' AS check_type,
    COUNT(*) AS issue_count
FROM customer_batch cb
LEFT JOIN staff s ON cb.assigned_to_staff_id = s.id
WHERE cb.assigned_to_staff_id IS NOT NULL AND s.id IS NULL;

-- Check for orphaned campaign ads
SELECT 
    'Orphaned campaign ads' AS check_type,
    COUNT(*) AS issue_count
FROM campaign_ads ca
LEFT JOIN campaign c ON ca.campaign_id = c.id
WHERE c.id IS NULL;

-- Check for orphaned product categories
SELECT 
    'Orphaned product categories' AS check_type,
    COUNT(*) AS issue_count
FROM product_category pc
LEFT JOIN product p ON pc.product_id = p.id
WHERE p.id IS NULL;

-- ============================================================================
-- CONSTRAINT VALIDATION
-- ============================================================================

-- Check for negative amounts
SELECT 
    'Negative order totals' AS check_type,
    COUNT(*) AS issue_count
FROM "order"
WHERE total < 0;

SELECT 
    'Negative payment amounts' AS check_type,
    COUNT(*) AS issue_count
FROM payment
WHERE amount < 0;

SELECT 
    'Negative product prices' AS check_type,
    COUNT(*) AS issue_count
FROM product
WHERE retail_price < 0 OR sale_price < 0;

-- Check for invalid dates
SELECT 
    'Invalid campaign dates' AS check_type,
    COUNT(*) AS issue_count
FROM campaign
WHERE end_date IS NOT NULL AND end_date < start_date;

SELECT 
    'Invalid promotion dates' AS check_type,
    COUNT(*) AS issue_count
FROM promotion
WHERE end_date IS NOT NULL AND end_date < start_date;

SELECT 
    'Invalid shift times' AS check_type,
    COUNT(*) AS issue_count
FROM shift_schedule
WHERE end_time <= start_time;

-- Check for invalid quantities
SELECT 
    'Invalid order line item quantities' AS check_type,
    COUNT(*) AS issue_count
FROM order_line_item
WHERE quantity <= 0;

SELECT 
    'Negative stock quantities' AS check_type,
    COUNT(*) AS issue_count
FROM stock
WHERE quantity < 0;

-- ============================================================================
-- NORMALIZATION VALIDATION
-- ============================================================================

-- Check campaign normalization completeness
-- This query should return 0 if normalization was complete
SELECT 
    'Campaign ads not normalized' AS check_type,
    COUNT(*) AS issue_count
FROM campaign c
WHERE EXISTS (
    SELECT 1 FROM campaign_ads ca WHERE ca.campaign_id = c.id
) = FALSE
AND c.id IN (
    -- This would need to check original data source
    -- For now, just a placeholder
    SELECT id FROM campaign WHERE id > 0
);

-- Check product category normalization
-- Verify all products with categories have entries in product_category
-- Note: This is a simplified check - actual validation would compare with source data

-- ============================================================================
-- DATA CONSISTENCY CHECKS
-- ============================================================================

-- Check for duplicate SKUs
SELECT 
    'Duplicate product SKUs' AS check_type,
    COUNT(*) AS issue_count
FROM (
    SELECT sku, COUNT(*) as cnt
    FROM product
    GROUP BY sku
    HAVING COUNT(*) > 1
) duplicates;

-- Check for duplicate order numbers (if unique constraint not applied)
SELECT 
    'Duplicate order numbers' AS check_type,
    COUNT(*) AS issue_count
FROM (
    SELECT order_number, COUNT(*) as cnt
    FROM "order"
    WHERE order_number != ''
    GROUP BY order_number
    HAVING COUNT(*) > 1
) duplicates;

-- Check for orders without line items
SELECT 
    'Orders without line items' AS check_type,
    COUNT(*) AS issue_count
FROM "order" o
LEFT JOIN order_line_item oli ON o.id = oli.order_id
WHERE oli.id IS NULL;

-- Check for customers without orders (informational)
SELECT 
    'Customers without orders' AS check_type,
    COUNT(*) AS issue_count
FROM customer c
LEFT JOIN "order" o ON c.email = o.email
WHERE o.id IS NULL;

-- ============================================================================
-- INDEX VALIDATION
-- ============================================================================

-- Check if indexes exist (PostgreSQL system query)
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN (
    'customer', 'order', 'product', 'staff', 'campaign',
    'order_line_item', 'payment', 'shift_schedule'
)
ORDER BY tablename, indexname;

-- ============================================================================
-- SEQUENCE VALIDATION
-- ============================================================================

-- Check sequence values vs actual max IDs
SELECT 
    'customer_id_seq' AS sequence_name,
    last_value AS sequence_value,
    (SELECT MAX(id) FROM customer) AS max_id,
    (SELECT MAX(id) FROM customer) - last_value AS difference
FROM customer_id_seq;

SELECT 
    'order_id_seq' AS sequence_name,
    last_value AS sequence_value,
    (SELECT MAX(id) FROM "order") AS max_id,
    (SELECT MAX(id) FROM "order") - last_value AS difference
FROM order_id_seq;

SELECT 
    'product_id_seq' AS sequence_name,
    last_value AS sequence_value,
    (SELECT MAX(id) FROM product) AS max_id,
    (SELECT MAX(id) FROM product) - last_value AS difference
FROM product_id_seq;

-- ============================================================================
-- STATISTICS VALIDATION
-- ============================================================================

-- Generate table statistics
SELECT 
    schemaname,
    tablename,
    n_live_tup AS row_count,
    n_dead_tup AS dead_rows,
    last_vacuum,
    last_autovacuum,
    last_analyze,
    last_autoanalyze
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY n_live_tup DESC;

-- ============================================================================
-- FOREIGN KEY VALIDATION
-- ============================================================================

-- Check all foreign key constraints
SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    tc.constraint_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;

-- ============================================================================
-- COMPREHENSIVE VALIDATION REPORT
-- ============================================================================

-- Create a validation summary view
CREATE OR REPLACE VIEW validation_summary AS
SELECT 
    'Total Customers' AS metric,
    COUNT(*)::TEXT AS value
FROM customer
UNION ALL
SELECT 
    'Total Orders',
    COUNT(*)::TEXT
FROM "order"
UNION ALL
SELECT 
    'Total Products',
    COUNT(*)::TEXT
FROM product
UNION ALL
SELECT 
    'Total Staff',
    COUNT(*)::TEXT
FROM staff
UNION ALL
SELECT 
    'Orders with Payments',
    COUNT(DISTINCT order_id)::TEXT
FROM payment
UNION ALL
SELECT 
    'Orders with Line Items',
    COUNT(DISTINCT order_id)::TEXT
FROM order_line_item
UNION ALL
SELECT 
    'Campaigns with Ads',
    COUNT(DISTINCT campaign_id)::TEXT
FROM campaign_ads
UNION ALL
SELECT 
    'Products with Categories',
    COUNT(DISTINCT product_id)::TEXT
FROM product_category;

-- Query the validation summary
SELECT * FROM validation_summary;

-- ============================================================================
-- DATA QUALITY METRICS
-- ============================================================================

-- Calculate data quality scores
SELECT 
    'Email Completeness' AS metric,
    ROUND(
        (COUNT(*) FILTER (WHERE email IS NOT NULL AND email != '')::NUMERIC / 
         COUNT(*)::NUMERIC) * 100, 2
    ) AS percentage
FROM customer
UNION ALL
SELECT 
    'Phone Completeness',
    ROUND(
        (COUNT(*) FILTER (WHERE phone IS NOT NULL AND phone != '')::NUMERIC / 
         COUNT(*)::NUMERIC) * 100, 2
    )
FROM customer
UNION ALL
SELECT 
    'Order Status Completeness',
    ROUND(
        (COUNT(*) FILTER (WHERE status IS NOT NULL AND status != '')::NUMERIC / 
         COUNT(*)::NUMERIC) * 100, 2
    )
FROM "order"
UNION ALL
SELECT 
    'Product SKU Completeness',
    ROUND(
        (COUNT(*) FILTER (WHERE sku IS NOT NULL AND sku != '')::NUMERIC / 
         COUNT(*)::NUMERIC) * 100, 2
    )
FROM product;

-- ============================================================================
-- VALIDATION COMPLETION
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE 'Validation checks completed. Review results above.';
    RAISE NOTICE 'If any issues found, address them before going to production.';
END $$;

