# Product & Inventory Department

## Overview
This document shows the complete Product & Inventory schema structure with data types, foreign keys, and change indicators.

**Legend:**
- 🆕 **NEW** - Newly created tables
- 🔄 **NORMALIZED** - Comma-separated values moved to junction tables
- 🗑️ **REMOVED** - Fields/tables removed or consolidated
- ✏️ **RENAMED** - Table/column renamed
- 📊 **DENORMALIZED** - Denormalized for performance (if any)

---

## Core Tables

#### `product` ✏️ (renamed from `db_iv_product`)
**Status**: Main product catalog

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `sku` | VARCHAR(100) | NOT NULL, UNIQUE | Indexed |
| `name` | VARCHAR(500) | NOT NULL | |
| `retail_price` | NUMERIC(12,2) | DEFAULT 0 | 🔄 Changed from `float` |
| `sale_price` | NUMERIC(12,2) | DEFAULT 0 | 🔄 Changed from `float` |
| `description_en` | TEXT | DEFAULT '' | ✏️ Renamed from `eng_description` |
| `description_vn` | TEXT | DEFAULT '' | ✏️ Renamed from `vn_description` |
| `is_pre_order` | BOOLEAN | DEFAULT FALSE | ✏️ Renamed from `pre_order` |
| `promotion_id` | INTEGER | DEFAULT 0 | ✏️ Renamed from `id_promo` |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date_created` |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `last_update` |
| `created_by_id` | BIGINT | FK → `staff.id` | ✏️ Renamed from `by_user` |

**Foreign Keys:**
- `created_by_id` → `staff(id)`
- `promotion_id` → `promotion(id)` (via ALTER TABLE)

**Junction Tables (Normalized):**
- 🆕 `product_category` - Normalized from `category` (VARCHAR(1000) comma-separated)
- 🆕 `product_tag` - Normalized from `tag` (VARCHAR(300) comma-separated)

**Removed Fields:**
- 🗑️ `category` (VARCHAR) - Moved to `product_category` junction table
- 🗑️ `tag` (VARCHAR) - Moved to `product_tag` junction table

**Indexes:**
- `idx_product_sku`
- `idx_product_status`
- `idx_product_name`
- `idx_product_status_price`

---

#### `category` ✏️ (renamed from `db_iv_category`)
**Status**: Product categories

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `name` | VARCHAR(200) | NOT NULL | |
| `parent_id` | BIGINT | FK → `category.id`, DEFAULT 0 | ✏️ Renamed from `parent` |

**Foreign Keys:**
- `parent_id` → `category(id)` (self-referencing)

---

#### `product_category` 🆕 NEW
**Status**: Junction table (normalized)

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `product_id` | BIGINT | FK → `product.id`, NOT NULL | |
| `category_id` | BIGINT | FK → `category.id`, NOT NULL | |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |
| UNIQUE(`product_id`, `category_id`) | | | |

**Foreign Keys:**
- `product_id` → `product(id)` ON DELETE CASCADE
- `category_id` → `category(id)` ON DELETE CASCADE

**Indexes:**
- `idx_product_category_product`
- `idx_product_category_category`

---

#### `product_tag` 🆕 NEW
**Status**: Junction table (normalized)

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `product_id` | BIGINT | FK → `product.id`, NOT NULL | |
| `tag_name` | VARCHAR(200) | NOT NULL | |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |
| UNIQUE(`product_id`, `tag_name`) | | | |

**Foreign Keys:**
- `product_id` → `product(id)` ON DELETE CASCADE

**Indexes:**
- `idx_product_tag_product`

---

#### `stock` ✏️ (renamed from `db_iv_stock`)
**Status**: Inventory stock

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `product_sku` | VARCHAR(100) | NOT NULL | ✏️ Renamed from `sku_product` |
| `location` | VARCHAR(10) | NOT NULL | Indexed |
| `quantity` | INTEGER | DEFAULT 0, CHECK >= 0 | ✏️ Renamed from `qty` |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date_created` |
| `updated_at` | TIMESTAMP WITH TIME ZONE | NOT NULL DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `last_update` |

**Indexes:**
- `idx_stock_product_sku`
- `idx_stock_location`
- `idx_stock_product_location`

**Note**: `product_sku` is soft FK to `product.sku` (string match)

---

#### `product_attribute` ✏️ (renamed from `db_iv_attributes`)
**Status**: Product attributes

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `name` | VARCHAR(300) | NOT NULL | |
| `type` | VARCHAR(100) | NOT NULL | |
| `value` | VARCHAR(300) | DEFAULT '' | |
| `description_en` | VARCHAR(1000) | DEFAULT '' | ✏️ Renamed from `eng_description` |
| `description_vn` | VARCHAR(1000) | DEFAULT '' | ✏️ Renamed from `vn_description` |

---

## Promotions

#### `promotion` ✏️ (renamed from `db_promo`)
**Status**: Promotions

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `name` | VARCHAR(100) | DEFAULT '' | ✏️ Renamed from `name_promo` |
| `is_active` | BOOLEAN | DEFAULT FALSE | ✏️ Renamed from `status` |
| `promo_type` | INTEGER | DEFAULT 0 | ✏️ Renamed from `type` |
| `start_date` | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | ✏️ Renamed from `date_start` |
| `end_date` | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | ✏️ Renamed from `date_end` |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date_created` |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date_update` |

**Removed Fields (Normalized):**
- 🗑️ `category` (VARCHAR(1000)) - Moved to `promotion_category` junction table
- 🗑️ `not_category` (VARCHAR(1000)) - Moved to `promotion_excluded_category` junction table
- 🗑️ `product` (VARCHAR(1000)) - Moved to `promotion_product` junction table
- 🗑️ `not_product` (VARCHAR(1000)) - Moved to `promotion_excluded_product` junction table
- 🗑️ `attribute` (VARCHAR(1000)) - Moved to `promotion_attribute` junction table
- 🗑️ `not_attribute` (VARCHAR(1000)) - Moved to `promotion_excluded_attribute` junction table

**Junction Tables (Normalized):**
- 🆕 `promotion_category`
- 🆕 `promotion_excluded_category`
- 🆕 `promotion_product`
- 🆕 `promotion_excluded_product`
- 🆕 `promotion_attribute`
- 🆕 `promotion_excluded_attribute`

---

#### `promotion_category` 🆕 NEW
**Status**: Junction table (normalized)

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `promotion_id` | BIGINT | FK → `promotion.id`, NOT NULL | |
| `category_id` | BIGINT | FK → `category.id`, NOT NULL | |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |
| UNIQUE(`promotion_id`, `category_id`) | | | |

**Foreign Keys:**
- `promotion_id` → `promotion(id)` ON DELETE CASCADE
- `category_id` → `category(id)` ON DELETE CASCADE

**Indexes:**
- `idx_promotion_category_promotion`
- `idx_promotion_category_category`

---

#### `promotion_excluded_category` 🆕 NEW
**Status**: Junction table (normalized)

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `promotion_id` | BIGINT | FK → `promotion.id`, NOT NULL | |
| `category_id` | BIGINT | FK → `category.id`, NOT NULL | |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |
| UNIQUE(`promotion_id`, `category_id`) | | | |

**Foreign Keys:**
- `promotion_id` → `promotion(id)` ON DELETE CASCADE
- `category_id` → `category(id)` ON DELETE CASCADE

**Indexes:**
- `idx_promotion_excluded_category_promotion`

---

#### `promotion_product` 🆕 NEW
**Status**: Junction table (normalized)

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `promotion_id` | BIGINT | FK → `promotion.id`, NOT NULL | |
| `product_id` | BIGINT | FK → `product.id`, NOT NULL | |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |
| UNIQUE(`promotion_id`, `product_id`) | | | |

**Foreign Keys:**
- `promotion_id` → `promotion(id)` ON DELETE CASCADE
- `product_id` → `product(id)` ON DELETE CASCADE

**Indexes:**
- `idx_promotion_product_promotion`
- `idx_promotion_product_product`

---

#### `promotion_excluded_product` 🆕 NEW
**Status**: Junction table (normalized)

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `promotion_id` | BIGINT | FK → `promotion.id`, NOT NULL | |
| `product_id` | BIGINT | FK → `product.id`, NOT NULL | |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |
| UNIQUE(`promotion_id`, `product_id`) | | | |

**Foreign Keys:**
- `promotion_id` → `promotion(id)` ON DELETE CASCADE
- `product_id` → `product(id)` ON DELETE CASCADE

**Indexes:**
- `idx_promotion_excluded_product_promotion`

---

#### `promotion_attribute` 🆕 NEW
**Status**: Junction table (normalized)

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `promotion_id` | BIGINT | FK → `promotion.id`, NOT NULL | |
| `attribute_id` | BIGINT | FK → `product_attribute.id`, NOT NULL | |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |
| UNIQUE(`promotion_id`, `attribute_id`) | | | |

**Foreign Keys:**
- `promotion_id` → `promotion(id)` ON DELETE CASCADE
- `attribute_id` → `product_attribute(id)` ON DELETE CASCADE

**Indexes:**
- `idx_promotion_attribute_promotion`

---

#### `promotion_excluded_attribute` 🆕 NEW
**Status**: Junction table (normalized)

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `promotion_id` | BIGINT | FK → `promotion.id`, NOT NULL | |
| `attribute_id` | BIGINT | FK → `product_attribute.id`, NOT NULL | |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |
| UNIQUE(`promotion_id`, `attribute_id`) | | | |

**Foreign Keys:**
- `promotion_id` → `promotion(id)` ON DELETE CASCADE
- `attribute_id` → `product_attribute(id)` ON DELETE CASCADE

**Indexes:**
- `idx_promotion_excluded_attribute_promotion`

---

## Summary

### Tables in Catalog Department
1. **product** - Main product catalog
2. **category** - Product categories (hierarchical)
3. **product_category** - Product-category junction table (normalized)
4. **product_tag** - Product tags junction table (normalized)
5. **stock** - Inventory stock levels
6. **product_attribute** - Product attributes
7. **promotion** - Promotions
8. **promotion_category** - Promotion-category junction table (normalized)
9. **promotion_excluded_category** - Promotion excluded categories junction table (normalized)
10. **promotion_product** - Promotion-product junction table (normalized)
11. **promotion_excluded_product** - Promotion excluded products junction table (normalized)
12. **promotion_attribute** - Promotion-attribute junction table (normalized)
13. **promotion_excluded_attribute** - Promotion excluded attributes junction table (normalized)

### Key Features
- **Normalization**: Comma-separated category, tag, and promotion fields moved to junction tables
- **Data Types**: All monetary values changed from `float` to `NUMERIC(12,2)`
- **Foreign Keys**: Proper relationships with staff and promotion tables
- **Indexes**: Optimized for common queries (SKU, status, location)
- **Promotion System**: Flexible promotion rules with included/excluded categories, products, and attributes

### Relationships
- `product.created_by_id` → `staff.id`
- `product.promotion_id` → `promotion.id`
- `product_category.product_id` → `product.id`
- `product_category.category_id` → `category.id`
- `product_tag.product_id` → `product.id`
- `category.parent_id` → `category.id` (self-referencing)
- `promotion_category.promotion_id` → `promotion.id`
- `promotion_category.category_id` → `category.id`
- `promotion_product.promotion_id` → `promotion.id`
- `promotion_product.product_id` → `product.id`
- `promotion_attribute.promotion_id` → `promotion.id`
- `promotion_attribute.attribute_id` → `product_attribute.id`

