-- ============================================================================
-- Product Variant Optimization Migration
-- ============================================================================
-- This migration optimizes product_variant table to store variant metadata
-- directly instead of creating separate product records for each variant.
-- This prevents the product table from scaling too quickly.
-- ============================================================================
-- Dependencies: 005_product.sql (product_variant table must exist)
-- ============================================================================

-- ============================================================================
-- Step 1: Add new columns to product_variant
-- ============================================================================

-- Add variant_sku (unique SKU for each variant, used for stock management)
-- Note: NULL allowed temporarily for backward compatibility with old data
-- New variants should always have variant_sku set
ALTER TABLE product_variant 
    ADD COLUMN IF NOT EXISTS variant_sku VARCHAR(100) NULL;

-- Add price override fields (NULL means inherit from parent)
ALTER TABLE product_variant 
    ADD COLUMN IF NOT EXISTS retail_price_override NUMERIC(12,2) NULL;

ALTER TABLE product_variant 
    ADD COLUMN IF NOT EXISTS sale_price_override NUMERIC(12,2) NULL;

-- Add status override (NULL means inherit from parent)
ALTER TABLE product_variant 
    ADD COLUMN IF NOT EXISTS status VARCHAR(50) NULL;

-- Add metadata fields
ALTER TABLE product_variant 
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- ============================================================================
-- Step 2: Add CHECK constraints for new columns
-- ============================================================================

ALTER TABLE product_variant 
    ADD CONSTRAINT chk_product_variant_retail_price_override 
    CHECK (retail_price_override IS NULL OR retail_price_override >= 0);

ALTER TABLE product_variant 
    ADD CONSTRAINT chk_product_variant_sale_price_override 
    CHECK (sale_price_override IS NULL OR sale_price_override >= 0);

ALTER TABLE product_variant 
    ADD CONSTRAINT chk_product_variant_status 
    CHECK (status IS NULL OR status IN ('draft', 'publish', 'updated', 'do_not_import'));

-- ============================================================================
-- Step 3: Drop old constraints and foreign keys related to variant_product_id
-- ============================================================================

-- Drop unique constraint on variant_product_id
ALTER TABLE product_variant 
    DROP CONSTRAINT IF EXISTS uq_product_variant_variant_product;

-- Drop foreign key to variant_product_id
ALTER TABLE product_variant 
    DROP CONSTRAINT IF EXISTS fk_product_variant_variant_product_id;

-- ============================================================================
-- Step 4: Add new UNIQUE constraint for variant_sku
-- ============================================================================

-- variant_sku must be unique across all variants (only for non-NULL values)
-- Using partial unique index to allow NULL values (for backward compatibility with old data)
CREATE UNIQUE INDEX IF NOT EXISTS uq_product_variant_sku 
    ON product_variant(variant_sku) 
    WHERE variant_sku IS NOT NULL;

-- ============================================================================
-- Step 5: Drop old index on variant_product_id and add new indexes
-- ============================================================================

-- Drop old index
DROP INDEX IF EXISTS idx_product_variant_variant;

-- Add index for variant_sku (for stock lookups)
CREATE INDEX IF NOT EXISTS idx_product_variant_sku ON product_variant(variant_sku);

-- Add composite index for parent + attribute + value (common query pattern)
CREATE INDEX IF NOT EXISTS idx_product_variant_parent_attribute_value 
    ON product_variant(parent_product_id, variant_attribute, variant_value);

-- ============================================================================
-- Step 6: Update comments
-- ============================================================================

COMMENT ON TABLE product_variant IS 'Variant metadata table - stores variant information directly without creating separate product records. Prevents product table from scaling too quickly.';

COMMENT ON COLUMN product_variant.parent_product_id IS 'Parent product (variant parent with product_type=''variant'')';

COMMENT ON COLUMN product_variant.variant_product_id IS 'DEPRECATED: Will be removed in future migration. Use variant_sku instead.';

COMMENT ON COLUMN product_variant.variant_attribute IS 'Attribute name (e.g., "Size", "Color")';

COMMENT ON COLUMN product_variant.variant_value IS 'Attribute value (e.g., "S", "M", "L", "Red", "Blue")';

COMMENT ON COLUMN product_variant.variant_sku IS 'Unique SKU for this variant (e.g., "SHIRT-001-S"). Used for stock management and order processing.';

COMMENT ON COLUMN product_variant.retail_price_override IS 'Retail price override for this variant (NULL = inherit from parent)';

COMMENT ON COLUMN product_variant.sale_price_override IS 'Sale price override for this variant (NULL = inherit from parent)';

COMMENT ON COLUMN product_variant.status IS 'Status override for this variant (NULL = inherit from parent)';

COMMENT ON COLUMN product_variant.sort_order IS 'Display order for variants (1, 2, 3, ...)';

-- ============================================================================
-- Step 7: Migration notes
-- ============================================================================

-- NOTE: After this migration:
-- 1. New variants should be created by inserting into product_variant with variant_sku
-- 2. Stock management uses variant_sku (not variant_product_id)
-- 3. variant_product_id column will be dropped in a future migration after data migration
-- 4. To query variant info: JOIN product_variant ON parent_product_id
-- 5. To get variant SKU: SELECT variant_sku FROM product_variant WHERE parent_product_id = X AND variant_value = Y

