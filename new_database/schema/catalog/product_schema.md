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
| `product_type` | VARCHAR(50) | DEFAULT 'standard' | 🆕 'standard', 'custom', 'variant', 'set', 'jewelry', 'diamond', 'gemstone' |
| `retail_price` | NUMERIC(12,2) | DEFAULT 0 | 🔄 Changed from `float` |
| `sale_price` | NUMERIC(12,2) | DEFAULT 0 | 🔄 Changed from `float` |
| `description_en` | TEXT | DEFAULT '' | ✏️ Renamed from `eng_description` |
| `description_vn` | TEXT | DEFAULT '' | ✏️ Renamed from `vn_description` |
| `is_pre_order` | BOOLEAN | DEFAULT FALSE | ✏️ Renamed from `pre_order` |
| `promotion_id` | INTEGER | DEFAULT 0 | ✏️ Renamed from `id_promo` |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date_created` |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `last_update` |
| `created_by_id` | BIGINT | FK → `staff.id` | ✏️ Renamed from `by_user` |
| `updated_by_id` | BIGINT | FK → `staff.id`, NULL | 🆕 Staff who last updated the product |
| `status` | VARCHAR(50) | DEFAULT 'draft' | Product status: 'draft', 'publish', 'updated', 'do_not_import' |
| `published_at` | TIMESTAMP WITH TIME ZONE | NULL | Date when product was published (NULL if not published yet) |

**Foreign Keys:**
- `created_by_id` → `staff(id)`
- `updated_by_id` → `staff(id)` ON DELETE SET NULL
- `promotion_id` → `promotion(id)` (via ALTER TABLE)

**Junction Tables (Normalized):**
- 🆕 `product_category` - Normalized from `category` (VARCHAR(1000) comma-separated)
- 🆕 `product_tag` - Normalized from `tag` (VARCHAR(300) comma-separated)
- 🆕 `product_attribute_value` - Normalized from multiple attribute columns (see Removed Fields below)
- 🆕 `product_set_item` - Links set/bundle products to their component items
- 🆕 `product_variant` - Links variant parent products to their variant children
- 🆕 `product_image` - Product images, thumbnails, and gallery (normalized from `thumb_nail`, `name_image`)

**Removed Fields:**
- 🗑️ `category` (VARCHAR(1000)) - Moved to `product_category` junction table
- 🗑️ `tag` (VARCHAR(300)) - Moved to `product_tag` junction table
- 🗑️ `thumb_nail` (VARCHAR(1000)) - Moved to `product_image` table (image_type='thumbnail')
- 🗑️ `name_image` (VARCHAR(100)) - Moved to `product_image` table (image_type='gallery')
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
- `idx_product_status` (on `status`)
- `idx_product_published_at` (on `published_at`)

**Product Types:**
- `standard` - Regular products with predefined attributes
- `custom` - Customized products with unique fields stored in `product_attribute_value`
- `variant` - Product variants parent (creates child variant products with different attribute values, linked via `product_variant` junction table)
- `set` - Bundle/composite products containing multiple items (linked via `product_set_item` junction table)
- `jewelry` - Jewelry products (uses standard attributes via `product_attribute_value`)
- `diamond` - Certified diamond products (has certificate information in `diamond` table)
- `gemstone` - Gemstone products (has certificate information in `gemstone` table)

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

**Note**: Status field manages product lifecycle states (draft, publish, updated, do_not_import)

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

#### `warehouse` 🆕 NEW
**Status**: Warehouse/Location master data

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `code` | VARCHAR(10) | NOT NULL, UNIQUE | ✏️ Warehouse code (e.g., 'VN', 'US', 'WH-001') |
| `name` | VARCHAR(200) | NOT NULL | Warehouse name (e.g., 'Vietnam Warehouse', 'US Warehouse') |
| `address` | TEXT | DEFAULT NULL | Warehouse address |
| `city` | VARCHAR(100) | DEFAULT NULL | City |
| `country` | VARCHAR(100) | DEFAULT NULL | Country |
| `phone` | VARCHAR(50) | DEFAULT NULL | Contact phone |
| `email` | VARCHAR(200) | DEFAULT NULL | Contact email |
| `manager_id` | BIGINT | FK → `staff.id`, NULL | Warehouse manager |
| `status` | VARCHAR(50) | DEFAULT 'active' | Warehouse status: 'active', 'inactive', 'closed' |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |
| `created_by_id` | BIGINT | FK → `staff.id`, NULL | |
| `updated_by_id` | BIGINT | FK → `staff.id`, NULL | |

**Foreign Keys:**
- `manager_id` → `staff(id)` ON DELETE SET NULL
- `created_by_id` → `staff(id)` ON DELETE SET NULL
- `updated_by_id` → `staff(id)` ON DELETE SET NULL

**Indexes:**
- `idx_warehouse_code` (UNIQUE on `code`)
- `idx_warehouse_name` (on `name`)
- `idx_warehouse_status` (on `status`)
- `idx_warehouse_manager` (on `manager_id`)

**Note**: 
- `code` is unique and used as identifier (e.g., 'VN', 'US', 'WH-001')
- Warehouse can be active, inactive, or closed
- Manager can be assigned to warehouse for responsibility tracking

---

#### `stock` ✏️ (renamed from `db_iv_stock`)
**Status**: Inventory stock

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `product_sku` | VARCHAR(100) | NOT NULL | ✏️ Renamed from `sku_product` |
| `warehouse_id` | BIGINT | FK → `warehouse.id`, NOT NULL | 🆕 Changed from `location` (VARCHAR) to FK |
| `qty` | INTEGER | DEFAULT 0, CHECK >= 0 | ✏️ Số lượng tồn kho |
| `outbound` | INTEGER | DEFAULT 0, CHECK >= 0 | ✏️ Số lượng đã xuất/chuyển |
| `inbound` | INTEGER | DEFAULT 0, CHECK >= 0 | ✏️ Số lượng sắp về/dự kiến về |
| `name_product` | VARCHAR(500) | NOT NULL | 📊 Denormalized from `product.name` for performance |
| `updated_by_id` | BIGINT | FK → `staff.id`, NULL | ✏️ Renamed from `user` |
| `time_group_sku` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ✏️ Group SKU giống nhau theo thời gian để render |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date_created` |
| `updated_at` | TIMESTAMP WITH TIME ZONE | NOT NULL DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `last_update` |
| UNIQUE(`product_sku`, `warehouse_id`) | | | Một sản phẩm chỉ có 1 record cho mỗi warehouse |

**Foreign Keys:**
- `warehouse_id` → `warehouse(id)` ON DELETE CASCADE
- `updated_by_id` → `staff(id)` ON DELETE SET NULL

**Indexes:**
- `idx_stock_product_sku` (on `product_sku`)
- `idx_stock_warehouse` (on `warehouse_id`)
- `idx_stock_product_sku_warehouse` (on `product_sku`, `warehouse_id`) - UNIQUE constraint
- `idx_stock_time_group_sku` (on `time_group_sku`)

**Design Notes:**
- **Warehouse-based rows**: Mỗi sản phẩm có thể có nhiều rows (một row cho mỗi warehouse)
- **Field mapping từ schema cũ**:
  - `sku_product` → `product_sku`
  - `location` → `warehouse_id` (đổi từ VARCHAR sang FK)
  - `qty` → `qty` (giữ nguyên tên)
  - `stock_out` → `outbound` (đổi tên)
  - `coming_stock` → `inbound` (đổi tên)
  - `name_product` → `name_product` (giữ nguyên tên)
  - `user` → `updated_by_id` (FK to staff)
  - `date_created` → `created_at`
  - `last_update` → `updated_at`
  - `time_group_sku` → `time_group_sku` (giữ nguyên)
- **Total quantity**: Có thể tính tổng bằng: `SELECT SUM(qty) FROM stock WHERE product_sku = 'SKU-001'`
- **Warehouse relationship**: Now uses proper FK relationship instead of string matching

**Note**: 
- `product_sku` is soft FK to `product.sku` (string match)
- `warehouse_id` is FK to `warehouse.id` for proper referential integrity
- `name_product` is denormalized from `product.name` for faster queries and historical data preservation
- UNIQUE constraint on (`product_sku`, `warehouse_id`) ensures one record per product per warehouse

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
| `is_variant_value` | BOOLEAN | DEFAULT FALSE | If TRUE, this attribute value is used as variant identifier (e.g., Size="S" for variant SKU generation) |
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

**Variant Products:**
- Variant Product #201 (Size S) has Size="S" → `product_id=201, attribute_id=(Size), value="S", is_variant_value=TRUE` → Used for SKU: "SHIRT-001-S"
- Variant Product #201 (Size S) has Color="Red" → `product_id=201, attribute_id=(Color), value="Red", is_variant_value=FALSE` → Regular attribute, not used for SKU

**Note**: For custom products, create new attribute definitions in `product_attribute` table as needed. The system is flexible and supports any custom fields without schema changes. For variant products, set `is_variant_value=TRUE` on attribute values that should be used for variant SKU generation.

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
- **Note**: No stock record in `stock` table for SET-001 (stock is calculated from items)

**Components in Set:**
- `set_product_id=100`, `item_product_id=101`, `quantity=1`, `sort_order=1` (Nhẫn - SKU: RING-001, stock: 10)
- `set_product_id=100`, `item_product_id=102`, `quantity=1`, `sort_order=2` (Dây chuyền - SKU: CHAIN-001, stock: 8)
- `set_product_id=100`, `item_product_id=103`, `quantity=2`, `sort_order=3` (Bông tai - SKU: EARRING-001, stock: 15)

**Stock Calculation:**
- Set stock = MIN(10/1, 8/1, 15/2) = MIN(10, 8, 7) = **7 bundles available**

**Note**: 
- Set products (`product_type='set'`) can contain multiple items, each with its own quantity
- Items can be reused across different sets
- **Stock management**: Set stock is automatically calculated from component items (no separate stock record for set)
  - Formula: `set_stock = MIN(item_stock / item_quantity_in_set)` for all items in the set
  - Example: If set contains Item A (qty=1, stock=10), Item B (qty=1, stock=8), Item C (qty=2, stock=15)
    - Set stock = MIN(10/1, 8/1, 15/2) = MIN(10, 8, 7) = 7
  - Stock is calculated in real-time when querying, ensuring bundle availability matches actual item inventory
- Pricing: Set price can be sum of items or a separate bundle price

---

#### `product_variant` 🆕 NEW
**Status**: Junction table - Links variant parent products to their variant children

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `parent_product_id` | BIGINT | FK → `product.id`, NOT NULL | Parent product (variant parent) |
| `variant_product_id` | BIGINT | FK → `product.id`, NOT NULL | Child product (variant instance) |
| `variant_attribute` | VARCHAR(100) | NOT NULL | Attribute name (e.g., "Size", "Color") |
| `variant_value` | VARCHAR(100) | NOT NULL | Attribute value (e.g., "S", "M", "L", "Red", "Blue") |
| `sort_order` | INTEGER | DEFAULT 0 | Thứ tự hiển thị variants |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |
| UNIQUE(`parent_product_id`, `variant_attribute`, `variant_value`) | | | Một variant chỉ có 1 giá trị cho mỗi attribute |
| UNIQUE(`variant_product_id`) | | | Mỗi variant product chỉ thuộc về 1 parent |

**Foreign Keys:**
- `parent_product_id` → `product(id)` ON DELETE CASCADE
- `variant_product_id` → `product(id)` ON DELETE CASCADE

**Indexes:**
- `idx_product_variant_parent` (on `parent_product_id`)
- `idx_product_variant_variant` (on `variant_product_id`)
- `idx_product_variant_attribute` (on `variant_attribute`, `variant_value`)

**Example Usage:**

**Variant Parent:**
- Product #200: `sku='SHIRT-001'`, `name='Áo Thun Cơ Bản'`, `product_type='variant'`

**Variants:**
- `parent_product_id=200`, `variant_product_id=201`, `variant_attribute='Size'`, `variant_value='S'` → SKU: "SHIRT-001-S"
- `parent_product_id=200`, `variant_product_id=202`, `variant_attribute='Size'`, `variant_value='M'` → SKU: "SHIRT-001-M"
- `parent_product_id=200`, `variant_product_id=203`, `variant_attribute='Size'`, `variant_value='L'` → SKU: "SHIRT-001-L"

**Note**: 
- Variant products (`product_type='variant'` for parent) create child products that inherit parent information
- Variant SKU is automatically generated: `parent_sku + "-" + variant_value`
- Variant children inherit: name, description, price (can be overridden), images, etc.
- Stock and pricing can be managed per variant or inherited from parent
- The `variant_attribute` and `variant_value` should match the attribute value in `product_attribute_value` with `is_variant_value=TRUE`

---

#### `product_image` 🆕 NEW
**Status**: Product images, thumbnails, and gallery

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `product_id` | BIGINT | FK → `product.id`, NOT NULL, UNIQUE | One-to-one with product |
| `thumbnail` | VARCHAR(1000) | DEFAULT '' | Thumbnail image URL |
| `gallery` | TEXT | DEFAULT '' | Gallery images as JSON array or comma-separated URLs |
| `updated_by_id` | BIGINT | FK → `staff.id` | User who last updated the images |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Foreign Keys:**
- `product_id` → `product(id)` ON DELETE CASCADE
- `updated_by_id` → `staff(id)`

**Indexes:**
- `idx_product_image_product` (UNIQUE on `product_id`)

**Example Usage:**

**Standard Product:**
- Product #123: `sku='PROD-001'`, `name='Sản phẩm A'`
- `product_id=123, thumbnail='/images/prod-001-thumb.jpg', gallery='["/images/prod-001-1.jpg","/images/prod-001-2.jpg","/images/prod-001-3.jpg"]'`

**Variant Product:**
- Parent Product #200: `sku='SHIRT-001'`, `product_type='variant'`
- Variant Child #201: `sku='SHIRT-001-S'`
  - **Option 1 - Inherit from parent**: No record in `product_image` for variant #201, use parent images
  - **Option 2 - Override with variant-specific images**: 
    - `product_id=201, thumbnail='/images/shirt-001-s-red.jpg', gallery='["/images/shirt-001-s-red-1.jpg","/images/shirt-001-s-red-2.jpg"]'`

**Note**: 
- Variant children can inherit images from parent: Query parent images if variant has no record in `product_image`
- Variant children can override: Add specific images for variant (e.g., different color variant image)
- Gallery field stores array of image URLs (JSON format recommended)

---

#### `diamond` 🆕 NEW
**Status**: Certified diamond specifications (optional, one-to-one with product)

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `product_id` | BIGINT | FK → `product.id`, NOT NULL, UNIQUE | One-to-one with product (only for certified diamonds) |
| `item_id` | VARCHAR(100) | UNIQUE | External Item ID (e.g., "155556519") |
| `shape` | VARCHAR(100) | DEFAULT '' | Diamond shape (e.g., "Round", "Princess", "Emerald", "Oval", "Cushion", "Pear", "Marquise", "Asscher", "Radiant", "Heart") |
| `cut_grade` | VARCHAR(50) | DEFAULT '' | Cut grade (e.g., "Excellent", "Very Good", "Good", "Fair", "Poor") |
| `carat` | NUMERIC(5,3) | DEFAULT 0, CHECK > 0 | Carat weight (e.g., 0.650) |
| `color` | VARCHAR(50) | DEFAULT '' | Diamond color grade (e.g., "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "Z") |
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
- `idx_diamond_color` (on `color`)
- `idx_diamond_clarity` (on `clarity`)
- `idx_diamond_shape` (on `shape`)
- `idx_diamond_cut_grade` (on `cut_grade`)
- `idx_diamond_grading_lab` (on `grading_lab`)

**Product Types for Diamond, Gemstone, and Jewelry:**

There are three product types:

1. **Certified Diamond** (`product_type='diamond'`):
   - Must have record in `diamond` table
   - Contains certificate information (Shape, Cut Grade, Carat, Color, Clarity, Certificate Number, etc.)
   - Used for diamonds with GIA/IGI certificates
   - Diamond color is stored in `diamond.color` field (not in `product_attribute_value`) as it's specific to diamond grading
   - Example: `product_type='diamond'` + record in `diamond` table

2. **Gemstone** (`product_type='gemstone'`):
   - Must have record in `gemstone` table
   - Contains certificate information (Shape, Cut Grade, Carat, Color, Clarity, Certificate Number, etc.)
   - Used for gemstones with certificates
   - Gemstone color is stored in `gemstone.color` field (not in `product_attribute_value`) as it's specific to gemstone grading
   - Example: `product_type='gemstone'` + record in `gemstone` table

3. **Jewelry** (`product_type='jewelry'`):
   - No record in `diamond` or `gemstone` table
   - Uses standard product attributes via `product_attribute_value`
   - Same as standard products (size, color, material, etc.)
   - Example: `product_type='jewelry'` + attributes in `product_attribute_value`

**Example Usage:**

**Certified Diamond:**
- Product #200: `sku='DIA-001'`, `name='Certified Diamond 0.65ct VS1'`, `product_type='diamond'`
- Diamond record: `product_id=200`, `carat=0.650`, `clarity='VS1'`, `certificate_number='5182112308'`, `grading_lab='GIA'`, ...

**Gemstone:**
- Product #202: `sku='GEM-001'`, `name='Certified Ruby 1.0ct'`, `product_type='gemstone'`
- Gemstone record: `product_id=202`, `carat=1.000`, `clarity='VS1'`, `certificate_number='GEM123456'`, `grading_lab='GIA'`, ...

**Jewelry:**
- Product #201: `sku='JEW-001'`, `name='Jewelry Product'`, `product_type='jewelry'`
- No record in `diamond` table
- Attributes in `product_attribute_value`:
  - `product_id=201`, `attribute_id=(Color)`, `value='White'`
  - `product_id=201`, `attribute_id=(Size)`, `value='1.0ct'`
  - `product_id=201`, `attribute_id=(Material)`, `value='Gold'`

**Note**: 
- `product_type='diamond'` → must have record in `diamond` table
- `product_type='gemstone'` → must have record in `gemstone` table
- `product_type='jewelry'` → jewelry products, uses `product_attribute_value` (no record in `diamond` or `gemstone` table)
- Certified diamonds and gemstones can also have additional attributes in `product_attribute_value` if needed

---

#### `gemstone` 🆕 NEW
**Status**: Certified gemstone specifications (optional, one-to-one with product)

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `product_id` | BIGINT | FK → `product.id`, NOT NULL, UNIQUE | One-to-one with product (only for certified gemstones) |
| `item_id` | VARCHAR(100) | UNIQUE | External Item ID (e.g., "155556519") |
| `shape` | VARCHAR(100) | DEFAULT '' | Gemstone shape (e.g., "Round", "Princess", "Emerald", "Oval", "Cushion", "Pear", "Marquise", "Asscher", "Radiant", "Heart") |
| `cut_grade` | VARCHAR(50) | DEFAULT '' | Cut grade (e.g., "Excellent", "Very Good", "Good", "Fair", "Poor") |
| `carat` | NUMERIC(5,3) | DEFAULT 0, CHECK > 0 | Carat weight (e.g., 1.000) |
| `color` | VARCHAR(50) | DEFAULT '' | Gemstone color grade |
| `clarity` | VARCHAR(50) | DEFAULT '' | Clarity grade (e.g., "VS1", "VVS2") |
| `grading_lab` | VARCHAR(100) | DEFAULT '' | Grading laboratory (e.g., "GIA", "IGI") |
| `certificate_number` | VARCHAR(100) | UNIQUE | Certificate number (e.g., "GEM123456") |
| `certificate_path` | VARCHAR(1000) | DEFAULT '' | URL to certificate |
| `image_path` | VARCHAR(1000) | DEFAULT '' | URL to gemstone image |
| `total_price` | NUMERIC(12,2) | DEFAULT 0 | Gemstone price |
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
- `idx_gemstone_product_id` (UNIQUE on `product_id`)
- `idx_gemstone_item_id` (UNIQUE on `item_id`)
- `idx_gemstone_certificate_number` (UNIQUE on `certificate_number`)
- `idx_gemstone_carat` (on `carat`)
- `idx_gemstone_color` (on `color`)
- `idx_gemstone_clarity` (on `clarity`)
- `idx_gemstone_shape` (on `shape`)
- `idx_gemstone_cut_grade` (on `cut_grade`)
- `idx_gemstone_grading_lab` (on `grading_lab`)

**Note**: 
- Gemstone table structure is similar to diamond table
- Used for certified gemstones (ruby, sapphire, emerald, etc.) with certificates
- Gemstone color is stored in `gemstone.color` field (not in `product_attribute_value`) as it's specific to gemstone grading

---

## Materials

#### `material` ✏️ (renamed from `db_material_stock`)
**Status**: Material inventory and specifications

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `sku` | VARCHAR(100) | NOT NULL, UNIQUE | Material SKU | ✏️ Renamed from `sku_material` |
| `name` | VARCHAR(500) | NOT NULL | Material name | ✏️ Renamed from `name_material` |
| `category` | VARCHAR(100) | NOT NULL | Material category |
| `unit` | VARCHAR(100) | NOT NULL | Unit of measurement |
| `price` | NUMERIC(12,2) | DEFAULT 0 | Material price | 🔄 Changed from `float` |
| `cost` | NUMERIC(12,2) | DEFAULT 0 | Material cost | 🔄 Changed from `float` |
| `weight` | NUMERIC(10,3) | DEFAULT NULL | Material weight | 🔄 Changed from `float` |
| `bead` | NUMERIC(10,3) | DEFAULT NULL | Bead size/quantity | 🔄 Changed from `float` |
| `stock_vn` | NUMERIC(10,2) | DEFAULT 0, CHECK >= 0 | Stock quantity at VN location | 🔄 Changed from `float` |
| `stock_us` | NUMERIC(10,2) | DEFAULT 0, CHECK >= 0 | Stock quantity at US location | 🔄 Changed from `float` |
| `total_bead_vn` | INTEGER | DEFAULT NULL | Total beads at VN location |
| `total_bead_us` | INTEGER | DEFAULT NULL | Total beads at US location |
| `metal` | VARCHAR(100) | DEFAULT NULL | Material metal type |
| `stone` | VARCHAR(100) | DEFAULT NULL | Material stone type |
| `size` | VARCHAR(100) | DEFAULT NULL | Material size |
| `collection` | VARCHAR(500) | DEFAULT '' | Material collection |
| `thumbnail` | VARCHAR(500) | DEFAULT '' | Thumbnail image URL | ✏️ Renamed from `thumb_nail` |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date_created` |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `last_update` |
| `updated_by_id` | BIGINT | FK → `staff.id` | ✏️ Renamed from `by_user` |

**Foreign Keys:**
- `updated_by_id` → `staff(id)`

**Indexes:**
- `idx_material_sku` (UNIQUE on `sku`)
- `idx_material_category` (on `category`)
- `idx_material_name` (on `name`)

**Note**: 
- Materials are raw materials/components used in product manufacturing
- Stock is managed separately for VN and US locations
- `collection` and `stone` values should reference valid values from `material_attribute` lookup table (for data consistency and UI dropdowns)

---

#### `material_attribute` ✏️ (renamed from `db_material_attributes`)
**Status**: Material attribute lookup/master table - Contains valid values for collection, stone, and other material attributes

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `name` | VARCHAR(200) | NOT NULL | Attribute name (e.g., "Collection", "Stone", "Color", "Charm") |
| `type` | VARCHAR(100) | NOT NULL | Attribute type (e.g., "collection", "stone", "color", "charm") |
| `value` | VARCHAR(300) | DEFAULT '' | Attribute value (e.g., "Spring 2024", "Diamond", "Red", "10mm") | ✏️ Renamed from `Value` (capital V) |

**Note**: 
- This is a lookup/master table containing valid values for material attributes
- Used for data validation and UI dropdowns (e.g., collection dropdown, stone dropdown)
- Values in `material.collection` and `material.stone` should reference valid values from this table
- The `value` field comment in old schema: "value color (element support), value charm (size charm)"

**Indexes:**
- `idx_material_attribute_name` (on `name`)
- `idx_material_attribute_type` (on `type`)
- `idx_material_attribute_type_value` (on `type`, `value`)

**Example Usage:**
- Collection values: `name='Collection'`, `type='collection'`, `value='Spring 2024'`
- Stone values: `name='Stone'`, `type='stone'`, `value='Diamond'`
- Color values: `name='Color'`, `type='color'`, `value='Red'`
- Charm values: `name='Charm'`, `type='charm'`, `value='10mm'`

---

#### `material_product` ✏️ (renamed from `db_material_per_product`)
**Status**: Junction table - Links materials to products (materials used in products)

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `material_id` | BIGINT | FK → `material.id`, NOT NULL | ✏️ Changed from `sku_material` (string) to FK |
| `product_id` | BIGINT | FK → `product.id`, NOT NULL | ✏️ Changed from `sku_product` (string) to FK |
| `quantity` | NUMERIC(10,3) | NOT NULL | Quantity of material used in product | ✏️ Renamed from `qty`, 🔄 Changed from `float` |
| `unit` | VARCHAR(100) | NOT NULL | Unit of measurement |
| `inbound` | INTEGER | DEFAULT 0 | Inbound quantity | 🔄 Changed from `int(11)` |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date_created` |

**Foreign Keys:**
- `material_id` → `material(id)` ON DELETE CASCADE
- `product_id` → `product(id)` ON DELETE CASCADE

**Indexes:**
- `idx_material_product_material` (on `material_id`)
- `idx_material_product_product` (on `product_id`)
- `idx_material_product_material_product` (on `material_id`, `product_id`)

**Example Usage:**
- Product #123 uses Material #100: `material_id=100, product_id=123, quantity=2.5, unit='gram'`
- Product #123 uses Material #101: `material_id=101, product_id=123, quantity=1, unit='piece'`

**Note**: 
- This table tracks which materials are used in which products and in what quantities
- Used for bill of materials (BOM) and inventory planning

---



## Product Reviews

#### `product_review` 🆕 NEW
**Status**: Product reviews and ratings

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `product_id` | BIGINT | FK → `product.id`, NOT NULL | |
| `personal_key_id` | BIGINT | FK → `crm_personal_keys.id`, NULL | 🆕 Links to personal_key table (can be NULL for anonymous reviews) |
| `rating` | INTEGER | NOT NULL, CHECK (rating >= 1 AND rating <= 5) | ⭐ Rating from 1 to 5 stars |
| `title` | VARCHAR(500) | DEFAULT '' | Review title/headline |
| `comment` | TEXT | DEFAULT '' | Review content/comment |
| `status` | VARCHAR(50) | DEFAULT 'pending' | Review status: 'pending', 'approved', 'rejected', 'hidden' |
| `helpful_count` | INTEGER | DEFAULT 0, CHECK >= 0 | 👍 Number of helpful votes |
| `reviewer_name` | VARCHAR(200) | DEFAULT '' | Display name (can be different from customer name for privacy) |
| `reviewer_email` | VARCHAR(300) | DEFAULT '' | Reviewer email (for anonymous reviews) |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | |
| `approved_at` | TIMESTAMP WITH TIME ZONE | NULL | Date when review was approved |
| `approved_by_id` | BIGINT | FK → `staff.id`, NULL | Staff who approved the review |

**Foreign Keys:**
- `product_id` → `product(id)` ON DELETE CASCADE
- `personal_key_id` → `crm_personal_keys(id)` ON DELETE SET NULL
- `approved_by_id` → `staff(id)` ON DELETE SET NULL

**Indexes:**
- `idx_product_review_product` (on `product_id`)
- `idx_product_review_personal_key` (on `personal_key_id`)
- `idx_product_review_status` (on `status`)
- `idx_product_review_rating` (on `rating`)
- `idx_product_review_created_at` (on `created_at`)
- `idx_product_review_product_status` (on `product_id`, `status`) - For filtering approved reviews by product

**Example Usage:**

**Review from registered customer:**
- Product #123, Personal Key #456
- `product_id=123, personal_key_id=456, rating=5, title='Excellent product!', comment='Very satisfied with the quality', status='approved'`

**Anonymous Review:**
- Product #123, No personal key
- `product_id=123, personal_key_id=NULL, rating=4, title='Good value', comment='Nice product', reviewer_name='John D.', reviewer_email='john@example.com', status='approved'`

**Note**: 
- Each product can have multiple reviews (one-to-many relationship)
- Reviews can be from registered customers (linked to `crm_personal_keys`) or anonymous
- Reviews go through moderation workflow: `pending` → `approved`/`rejected`
- `helpful_count` tracks how many users found the review helpful
- Average rating can be calculated: `AVG(rating) WHERE product_id=X AND status='approved'`

---

## Summary

### Tables in Catalog Department
1. **product** - Main product catalog
2. **category** - Product categories (hierarchical)
3. **product_category** - Product-category junction table (normalized)
4. **product_tag** - Product tags junction table (normalized)
5. **warehouse** - Warehouse/Location master data
6. **stock** - Inventory stock levels
7. **product_attribute** - Product attribute definitions (master table)
8. **product_attribute_value** - Product-attribute value junction table (normalized)
9. **product_set_item** - Product set/bundle component junction table (links set products to their items)
10. **product_variant** - Product variant junction table (links variant parent products to their variant children)
11. **product_image** - Product images, thumbnails, and gallery (normalized from thumb_nail, name_image)
12. **diamond** - Certified diamond specifications (optional, one-to-one with product)
13. **gemstone** - Certified gemstone specifications (optional, one-to-one with product)
14. **material** - Material inventory and specifications
15. **material_attribute** - Material attribute lookup/master table (valid values for collection, stone, etc.)
16. **material_product** - Material-product junction table (links materials to products, BOM)
17. **promotion** - Promotions
18. **product_review** - Product reviews and ratings

### Key Features
- **Normalization**: Comma-separated category, tag, and image fields moved to junction tables. Promotion fields (category, product, attribute) kept as pipe-separated strings for simplicity
- **Image Management**: Product images (thumbnails, gallery) normalized from direct columns to `product_image` table - supports multiple images per product, variant image inheritance, and flexible media types (thumbnail, gallery, video, certificate, 360_view)
- **Attribute System**: Product attributes (size, color, material, etc.) normalized from direct columns to `product_attribute_value` junction table
- **Custom Products**: Support for customized products with flexible fields via `product_type='custom'` and `product_attribute_value` - no schema changes needed for new custom fields
- **Set/Bundle Products**: Support for composite products via `product_type='set'` and `product_set_item` junction table - allows products to contain multiple items with quantities
- **Diamond/Gemstone Products**: Support for certified diamonds (`product_type='diamond'` with certificate via `diamond` table) and gemstones (`product_type='gemstone'` with certificate via `gemstone` table), and jewelry products (`product_type='jewelry'` using standard attributes via `product_attribute_value`)
- **Materials**: Material inventory management with attributes (metal, stone, size, collection) stored directly in `material` table, lookup values in `material_attribute` table for data consistency and UI dropdowns, and BOM tracking via `material_product` junction table
- **Warehouse Management**: Warehouse master data table with proper FK relationships. Stock table uses `warehouse_id` FK instead of location strings for better referential integrity and data consistency
- **Data Types**: All monetary values changed from `float` to `NUMERIC(12,2)`
- **Foreign Keys**: Proper relationships with staff and promotion tables
- **Indexes**: Optimized for common queries (SKU, product_type, status, attributes, diamond fields)
- **Promotion System**: Promotion rules with categories, products, and attributes stored as pipe-separated IDs (e.g., "23|89|7741") for simple querying without junction tables
- **Product Reviews**: Customer reviews and ratings system with moderation workflow, helpful voting, and support for both registered customers (via `crm_personal_keys`) and anonymous reviews

### Relationships
- `product.created_by_id` → `staff.id`
- `product.updated_by_id` → `staff.id`
- `product.promotion_id` → `promotion.id`
- `product_category.product_id` → `product.id`
- `product_category.category_id` → `category.id`
- `product_tag.product_id` → `product.id`
- `product_attribute_value.product_id` → `product.id`
- `product_attribute_value.attribute_id` → `product_attribute.id`
- `product_set_item.set_product_id` → `product.id`
- `product_set_item.item_product_id` → `product.id`
- `diamond.product_id` → `product.id` (optional, only for certified diamonds)
- `gemstone.product_id` → `product.id` (optional, only for certified gemstones)
- `warehouse.manager_id` → `staff.id`
- `warehouse.created_by_id` → `staff.id`
- `warehouse.updated_by_id` → `staff.id`
- `stock.warehouse_id` → `warehouse.id`
- `stock.updated_by_id` → `staff.id`
- `material.updated_by_id` → `staff.id`
- `material_product.material_id` → `material.id`
- `material_product.product_id` → `product.id`
- `category.parent_id` → `category.id` (self-referencing)
- `product_review.product_id` → `product.id`
- `product_review.personal_key_id` → `crm_personal_keys.id`
- `product_review.approved_by_id` → `staff.id`

