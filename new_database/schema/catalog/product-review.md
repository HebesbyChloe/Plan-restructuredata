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
| `product_type` | VARCHAR(50) | DEFAULT 'standard' | 🆕 'standard', 'custom', 'variant', 'set', 'diamond', 'diamond_certified' |
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
- 🆕 `product_attribute_value` - Normalized from multiple attribute columns (see Removed Fields below)
- 🆕 `product_set_item` - Links set/bundle products to their component items

**Removed Fields:**
- 🗑️ `category` (VARCHAR(1000)) - Moved to `product_category` junction table
- 🗑️ `tag` (VARCHAR(300)) - Moved to `product_tag` junction table
- 🗑️ `status` (VARCHAR(100)) - Moved to `product_attribute_value` junction table (attribute: "Status")
- 🗑️ `thumb_nail` (VARCHAR(1000)) - Moved to separate media/image table (to be defined)
- 🗑️ `name_image` (VARCHAR(100)) - Moved to separate media/image table (to be defined)
- 🗑️ `size` (VARCHAR(100)) - Moved to `product_attribute_value` junction table (attribute: "Size")
- 🗑️ `grade` (VARCHAR(100)) - Moved to `product_attribute_value` junction table (attribute: "Grade")
- 🗑️ `year` (VARCHAR(100)) - Moved to `product_attribute_value` junction table (attribute: "Year")
- 🗑️ `bead_size` (VARCHAR(50)) - Moved to `product_attribute_value` junction table (attribute: "Bead Size")
- 🗑️ `collection` (VARCHAR(500)) - Moved to `product_attribute_value` junction table (attribute: "Collection")
- 🗑️ `origin` (VARCHAR(200)) - Moved to `product_attribute_value` junction table (attribute: "Origin")
- 🗑️ `gender` (VARCHAR(100)) - Moved to `product_attribute_value` junction table (attribute: "Gender")
- 🗑️ `material` (VARCHAR(500)) - Moved to `product_attribute_value` junction table (attribute: "Material")
- 🗑️ `element` (VARCHAR(300)) - Moved to `product_attribute_value` junction table (attribute: "Element")
- 🗑️ `box_dimension` (VARCHAR(50)) - Moved to `product_attribute_value` junction table (attribute: "Box Dimension")
- 🗑️ `intention` (VARCHAR(300)) - Moved to `product_attribute_value` junction table (attribute: "Intention")
- 🗑️ `color` (VARCHAR(100)) - Moved to `product_attribute_value` junction table (attribute: "Color")
- 🗑️ `stone` (VARCHAR(500)) - Moved to `product_attribute_value` junction table (attribute: "Stone")
- 🗑️ `charm` (VARCHAR(500)) - Moved to `product_attribute_value` junction table (attribute: "Charm")
- 🗑️ `charm_size` (VARCHAR(100)) - Moved to `product_attribute_value` junction table (attribute: "Charm Size")
- 🗑️ `total_sales` (INT(3)) - Moved to analytics/reporting table (calculated field, not stored in product table)

**Indexes:**
- `idx_product_sku`
- `idx_product_name`
- `idx_product_type` (on `product_type`)
- `idx_product_price` (on `retail_price`, `sale_price`)

**Product Types:**
- `standard` - Regular products with predefined attributes
- `custom` - Customized products with unique fields stored in `product_attribute_value`
- `variant` - Product variants (if needed)
- `set` - Bundle/composite products containing multiple items (linked via `product_set_item` junction table)
- `diamond` - Regular diamond products (uses standard attributes via `product_attribute_value`, no certificate)
- `diamond_certified` - Certified diamond products (has certificate information in `diamond` table)

**Custom Products:**
Custom products (`product_type='custom'`) can have any fields that don't exist in the `product` table. All custom fields are stored in `product_attribute_value`:
- Create attribute definitions in `product_attribute` table (e.g., "Customer Name", "Special Instructions", "Custom Design Notes")
- Store values in `product_attribute_value` linked to the product
- No schema changes needed when adding new custom fields

**Example Custom Product:**
- Product #456: `product_type='custom'`, `name='Custom Ring for John'`
- Custom fields stored in `product_attribute_value`:
  - `attribute_id=(Customer Name)`, `value='John Doe'`
  - `attribute_id=(Ring Size)`, `value='7.5'`
  - `attribute_id=(Special Instructions)`, `value='Engrave "Forever" inside'`
  - `attribute_id=(Custom Material)`, `value='White Gold'`

**Note**: Status queries should use `product_attribute_value` with attribute name "Status"

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
| `product_sku` | VARCHAR(100) | NOT NULL, UNIQUE | ✏️ Renamed from `sku_product` |
| `quantity_vn` | INTEGER | DEFAULT 0, CHECK >= 0 | 🆕 Số lượng tại kho VN |
| `quantity_us` | INTEGER | DEFAULT 0, CHECK >= 0 | 🆕 Số lượng tại kho US |
| `outbound_vn` | INTEGER | DEFAULT 0, CHECK >= 0 | 🆕 Số lượng đã xuất/chuyển từ kho VN |
| `outbound_us` | INTEGER | DEFAULT 0, CHECK >= 0 | 🆕 Số lượng đã xuất/chuyển từ kho US |
| `inbound_vn` | INTEGER | DEFAULT 0, CHECK >= 0 | 🆕 Số lượng sắp về/dự kiến về kho VN |
| `inbound_us` | INTEGER | DEFAULT 0, CHECK >= 0 | 🆕 Số lượng sắp về/dự kiến về kho US |
| `name_product` | VARCHAR(500) | NOT NULL | 📊 Denormalized from `product.name` for performance |
| `updated_by_id` | BIGINT | FK → `staff.id` | ✏️ Renamed from `user` |
| `time_group_sku` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ✏️ Group SKU giống nhau theo thời gian để render |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date_created` |
| `updated_at` | TIMESTAMP WITH TIME ZONE | NOT NULL DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `last_update` |

**Foreign Keys:**
- `updated_by_id` → `staff(id)`

**Indexes:**
- `idx_stock_product_sku` (on `product_sku`)
- `idx_stock_time_group_sku` (on `time_group_sku`)

**Design Changes:**
- 🔄 **Normalized from 2 rows to 1 row**: Previously each product had 2 rows (one per location: VN/US). Now consolidated into 1 row with separate columns for each location.
- **Benefits**: 
  - 50% fewer rows (1 row per product instead of 2)
  - Faster total quantity queries (no GROUP BY needed)
  - Better data integrity (guaranteed both locations exist)
  - Simpler updates (direct column updates)
- **Trade-offs**: 
  - Less flexible if more locations needed in future (would require schema changes)
  - More columns per row (6 quantity-related columns: quantity_vn, quantity_us, outbound_vn, outbound_us, inbound_vn, inbound_us)

**Note**: 
- `product_sku` is soft FK to `product.sku` (string match) and has UNIQUE constraint (1 row per product)
- `name_product` is denormalized from `product.name` for faster queries and historical data preservation
- Total quantity can be calculated as: `quantity_vn + quantity_us`

---

#### `product_attribute` ✏️ (renamed from `db_iv_attributes`)
**Status**: Product attribute definitions (master table)

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `name` | VARCHAR(300) | NOT NULL, UNIQUE | Attribute name (e.g., "Color", "Size", "Material") |
| `type` | VARCHAR(100) | NOT NULL | Attribute type (e.g., "text", "number", "select") |
| `value` | VARCHAR(300) | DEFAULT '' | Default/example value (not product-specific) |
| `description_en` | VARCHAR(1000) | DEFAULT '' | ✏️ Renamed from `eng_description` |
| `description_vn` | VARCHAR(1000) | DEFAULT '' | ✏️ Renamed from `vn_description` |

**Note**: This table defines attribute types. Actual product attribute values are stored in `product_attribute_value` junction table.

**Indexes:**
- `idx_product_attribute_name`

---

#### `product_attribute_value` 🆕 NEW
**Status**: Junction table (normalized) - Links products to their attribute values

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `product_id` | BIGINT | FK → `product.id`, NOT NULL | |
| `attribute_id` | BIGINT | FK → `product_attribute.id`, NOT NULL | |
| `value` | VARCHAR(500) | NOT NULL | The actual attribute value for this product |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |
| UNIQUE(`product_id`, `attribute_id`) | | | One value per attribute per product |

**Foreign Keys:**
- `product_id` → `product(id)` ON DELETE CASCADE
- `attribute_id` → `product_attribute(id)` ON DELETE CASCADE

**Indexes:**
- `idx_product_attribute_value_product`
- `idx_product_attribute_value_attribute`
- `idx_product_attribute_value_product_attribute`

**Example Usage:**

**Standard Products:**
- Product #123 has Color="Red" → `product_id=123, attribute_id=(Color), value="Red"`
- Product #123 has Size="Large" → `product_id=123, attribute_id=(Size), value="Large"`
- Product #123 has Material="Gold" → `product_id=123, attribute_id=(Material), value="Gold"`

**Custom Products:**
- Custom Product #456 has Customer Name="John Doe" → `product_id=456, attribute_id=(Customer Name), value="John Doe"`
- Custom Product #456 has Special Instructions="Engrave initials" → `product_id=456, attribute_id=(Special Instructions), value="Engrave initials"`
- Custom Product #456 has Custom Field="Any value" → `product_id=456, attribute_id=(Custom Field), value="Any value"`

**Note**: For custom products, create new attribute definitions in `product_attribute` table as needed. The system is flexible and supports any custom fields without schema changes.

---

#### `product_set_item` 🆕 NEW
**Status**: Junction table - Links set/bundle products to their component items

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `set_product_id` | BIGINT | FK → `product.id`, NOT NULL | Parent product (set/bundle/composite) |
| `item_product_id` | BIGINT | FK → `product.id`, NOT NULL | Child product (component item) |
| `quantity` | INTEGER | DEFAULT 1, CHECK > 0 | Số lượng item trong set |
| `sort_order` | INTEGER | DEFAULT 0 | Thứ tự hiển thị items |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |
| UNIQUE(`set_product_id`, `item_product_id`) | | | Một item chỉ xuất hiện 1 lần trong set |

**Foreign Keys:**
- `set_product_id` → `product(id)` ON DELETE CASCADE
- `item_product_id` → `product(id)` ON DELETE CASCADE

**Indexes:**
- `idx_product_set_item_set` (on `set_product_id`)
- `idx_product_set_item_item` (on `item_product_id`)

**Example Usage:**

**Set Product:**
- Product #100: `sku='SET-001'`, `name='Bộ Trang Sức Vàng'`, `product_type='set'`

**Components in Set:**
- `set_product_id=100`, `item_product_id=101`, `quantity=1`, `sort_order=1` (Nhẫn)
- `set_product_id=100`, `item_product_id=102`, `quantity=1`, `sort_order=2` (Dây chuyền)
- `set_product_id=100`, `item_product_id=103`, `quantity=2`, `sort_order=3` (Bông tai - 2 cái)

**Note**: 
- Set products (`product_type='set'`) can contain multiple items, each with its own quantity
- Items can be reused across different sets
- Stock management: Set stock can be calculated from minimum item stock or managed separately
- Pricing: Set price can be sum of items or a separate bundle price

---

#### `diamond` 🆕 NEW
**Status**: Certified diamond specifications (optional, one-to-one with product)

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `product_id` | BIGINT | FK → `product.id`, NOT NULL, UNIQUE | One-to-one with product (only for certified diamonds) |
| `item_id` | VARCHAR(100) | UNIQUE | External Item ID (e.g., "155556519") |
| `cut` | VARCHAR(100) | DEFAULT '' | Cut grade (e.g., "Special", "Round", "Princess") |
| `carat` | NUMERIC(5,3) | DEFAULT 0, CHECK > 0 | Carat weight (e.g., 0.650) |
| `clarity` | VARCHAR(50) | DEFAULT '' | Clarity grade (e.g., "VS1", "VVS2") |
| `grading_lab` | VARCHAR(100) | DEFAULT '' | Grading laboratory (e.g., "GIA", "IGI") |
| `certificate_number` | VARCHAR(100) | UNIQUE | Certificate number (e.g., "5182112308") |
| `certificate_path` | VARCHAR(1000) | DEFAULT '' | URL to certificate |
| `image_path` | VARCHAR(1000) | DEFAULT '' | URL to diamond image |
| `total_price` | NUMERIC(12,2) | DEFAULT 0 | Diamond price |
| `measurement_length` | NUMERIC(6,2) | DEFAULT 0 | Length in mm (e.g., 6.7) |
| `measurement_width` | NUMERIC(6,2) | DEFAULT 0 | Width in mm (e.g., 5.1) |
| `measurement_height` | NUMERIC(6,2) | DEFAULT 0 | Height in mm (e.g., 2.6) |
| `country` | VARCHAR(100) | DEFAULT '' | Country of origin |
| `state_region` | VARCHAR(100) | DEFAULT '' | State/Region |
| `guaranteed_availability` | BOOLEAN | DEFAULT FALSE | Guaranteed availability flag |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |

**Foreign Keys:**
- `product_id` → `product(id)` ON DELETE CASCADE

**Indexes:**
- `idx_diamond_product_id` (UNIQUE on `product_id`)
- `idx_diamond_item_id` (UNIQUE on `item_id`)
- `idx_diamond_certificate_number` (UNIQUE on `certificate_number`)
- `idx_diamond_carat` (on `carat`)
- `idx_diamond_clarity` (on `clarity`)
- `idx_diamond_cut` (on `cut`)
- `idx_diamond_grading_lab` (on `grading_lab`)

**Diamond Product Types:**

There are two types of diamond products:

1. **Certified Diamond** (`product_type='diamond_certified'`):
   - Must have record in `diamond` table
   - Contains certificate information (Cut, Carat, Clarity, Certificate Number, etc.)
   - Used for diamonds with GIA/IGI certificates
   - Example: `product_type='diamond_certified'` + record in `diamond` table

2. **Regular Diamond** (`product_type='diamond'`):
   - No record in `diamond` table
   - Uses standard product attributes via `product_attribute_value`
   - Same as standard products (size, color, material, etc.)
   - Example: `product_type='diamond'` + attributes in `product_attribute_value`

**Example Usage:**

**Certified Diamond:**
- Product #200: `sku='DIA-001'`, `name='Certified Diamond 0.65ct VS1'`, `product_type='diamond_certified'`
- Diamond record: `product_id=200`, `carat=0.650`, `clarity='VS1'`, `certificate_number='5182112308'`, `grading_lab='GIA'`, ...

**Regular Diamond:**
- Product #201: `sku='DIA-002'`, `name='Regular Diamond'`, `product_type='diamond'`
- No record in `diamond` table
- Attributes in `product_attribute_value`:
  - `product_id=201`, `attribute_id=(Color)`, `value='White'`
  - `product_id=201`, `attribute_id=(Size)`, `value='1.0ct'`
  - `product_id=201`, `attribute_id=(Material)`, `value='Gold'`

**Note**: 
- `product_type='diamond_certified'` → must have record in `diamond` table
- `product_type='diamond'` → regular diamond, uses `product_attribute_value` (no record in `diamond` table)
- Certified diamonds can also have additional attributes in `product_attribute_value` if needed

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
6. **product_attribute** - Product attribute definitions (master table)
7. **product_attribute_value** - Product-attribute value junction table (normalized)
8. **product_set_item** - Product set/bundle component junction table (links set products to their items)
9. **diamond** - Certified diamond specifications (optional, one-to-one with product)
10. **promotion** - Promotions
11. **promotion_category** - Promotion-category junction table (normalized)
12. **promotion_excluded_category** - Promotion excluded categories junction table (normalized)
13. **promotion_product** - Promotion-product junction table (normalized)
14. **promotion_excluded_product** - Promotion excluded products junction table (normalized)
15. **promotion_attribute** - Promotion-attribute junction table (normalized)
16. **promotion_excluded_attribute** - Promotion excluded attributes junction table (normalized)

### Key Features
- **Normalization**: Comma-separated category, tag, and promotion fields moved to junction tables
- **Attribute System**: Product attributes (size, color, material, etc.) normalized from direct columns to `product_attribute_value` junction table
- **Custom Products**: Support for customized products with flexible fields via `product_type='custom'` and `product_attribute_value` - no schema changes needed for new custom fields
- **Set/Bundle Products**: Support for composite products via `product_type='set'` and `product_set_item` junction table - allows products to contain multiple items with quantities
- **Diamond Products**: Support for two types of diamond products - certified diamonds (`product_type='diamond_certified'` with certificate via `diamond` table) and regular diamonds (`product_type='diamond'` using standard attributes via `product_attribute_value`)
- **Stock Consolidation**: Stock table consolidated from 2 rows per product (one per location) to 1 row with separate columns for VN and US locations (`quantity_vn`, `quantity_us`, `outbound_vn`, `outbound_us`, `inbound_vn`, `inbound_us`) - reduces rows by 50% and improves query performance
- **Data Types**: All monetary values changed from `float` to `NUMERIC(12,2)`
- **Foreign Keys**: Proper relationships with staff and promotion tables
- **Indexes**: Optimized for common queries (SKU, product_type, status, attributes, diamond fields)
- **Promotion System**: Flexible promotion rules with included/excluded categories, products, and attributes

### Relationships
- `product.created_by_id` → `staff.id`
- `product.promotion_id` → `promotion.id`
- `product_category.product_id` → `product.id`
- `product_category.category_id` → `category.id`
- `product_tag.product_id` → `product.id`
- `product_attribute_value.product_id` → `product.id`
- `product_attribute_value.attribute_id` → `product_attribute.id`
- `product_set_item.set_product_id` → `product.id`
- `product_set_item.item_product_id` → `product.id`
- `diamond.product_id` → `product.id` (optional, only for certified diamonds)
- `stock.updated_by_id` → `staff.id`
- `category.parent_id` → `category.id` (self-referencing)
- `promotion_category.promotion_id` → `promotion.id`
- `promotion_category.category_id` → `category.id`
- `promotion_product.promotion_id` → `promotion.id`
- `promotion_product.product_id` → `product.id`
- `promotion_attribute.promotion_id` → `promotion.id`
- `promotion_attribute.attribute_id` → `product_attribute.id`

