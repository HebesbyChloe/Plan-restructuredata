# Promotion Module Schema

## Overview
This document provides a complete skeleton map and detailed listing of all promotion-related tables in the ERP system. The Promotion Module manages discount promotions, BOGO (Buy One Get One) rules, bundle promotions, tiered pricing, coupon codes, product eligibility, product price overrides, and usage tracking. It supports integration with external e-commerce platforms (Shopify, WooCommerce, etc.) and integrates with Orders, CRM, and Marketing Campaign modules.

**Key Design:**
- **`promo`** - Base promotion table with all promotion logic
- **`promo_campaigns`** - Junction table (many-to-many) linking promotions to marketing campaigns (`mkt_campaigns`)
- All rule tables link to `promo` instead of campaigns

**Legend:**
- 🔗 **Foreign Key** - Relationship to another table
- 📊 **Indexed** - Column has an index for performance
- 🔒 **Unique** - Column has unique constraint
- ⏰ **Timestamp** - Time tracking column
- ✅ **Check Constraint** - Value validation constraint
- 🌐 **External** - External/referenced table

---

## Schema Skeleton Map

```
┌─────────────────────────────────────────────────────────────────┐
│                    PROMOTION MODULE SCHEMA                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    sys_tenants (Multi-tenant)                    │
│  ────────────────────────────────────────────────────────────  │
│  • Multi-tenant boundary for all promotion data                 │
│  • Tracks: name, slug, plan, status, settings                   │
└─────────────────────────────────────────────────────────────────┘
         │
         ├─── 1:N ────► promo (tenant_id)
         └─── 1:N ────► promo_usage_history (tenant_id)


┌─────────────────────────────────────────────────────────────────┐
│                    mkt_campaigns (External)                      │
│  ────────────────────────────────────────────────────────────  │
│  • Marketing campaigns (used globally across departments)        │
│  • Tracks: name, type, status, budget, dates                    │
└─────────────────────────────────────────────────────────────────┘
         │
         └─── M:N ────► promo (via promo_campaigns)


┌─────────────────────────────────────────────────────────────────┐
│                         promo                                    │
│  ────────────────────────────────────────────────────────────  │
│  • Base promotion table with all promotion logic                 │
│  • Tracks: promo_code, promo_name, promo_type, status, dates    │
│  • Links to: discount rules, BOGO rules, bundle rules, codes   │
└─────────────────────────────────────────────────────────────────┘
         │
         ├─── 1:1 ────► promo_discount_rules (promo_id)
         ├─── 1:1 ────► promo_bogo_rules (promo_id)
         ├─── 1:1 ────► promo_bundle_rules (promo_id)
         ├─── 1:1 ────► promo_tiered_rules (promo_id)
         ├─── 1:N ────► promo_codes (promo_id)
         ├─── 1:N ────► promo_eligible_products (promo_id)
         ├─── 1:N ────► promo_product_price_overrides (promo_id)
         ├─── 1:N ────► promo_usage_history (promo_id)
         ├─── M:N ────► mkt_campaigns (via promo_campaigns)
         ├─── N:1 ────► sys_tenants (tenant_id)
         └─── N:1 ────► hr_staff (created_by, logical)


┌─────────────────────────────────────────────────────────────────┐
│                    promo_campaigns                               │
│  ────────────────────────────────────────────────────────────  │
│  • Junction table (many-to-many)                                 │
│  • Links: promo ↔ mkt_campaigns                                  │
│  • Tracks: promo_id, mkt_campaign_id, timestamps                │
└─────────────────────────────────────────────────────────────────┘
         │
         ├─── N:1 ────► promo (promo_id)
         └─── N:1 ────► mkt_campaigns (mkt_campaign_id)


┌─────────────────────────────────────────────────────────────────┐
│                  promo_discount_rules ⭐                           │
│  ────────────────────────────────────────────────────────────  │
│  • Separated for query performance (most common queries)        │
│  • Tracks: discount type, value, max amount, allocation         │
│  • Why separate: Most queries filter by discount type/value      │
└─────────────────────────────────────────────────────────────────┘
         │
         └─── N:1 ────► promo (promo_id)


┌─────────────────────────────────────────────────────────────────┐
│                    promo_bogo_rules ⭐                             │
│  ────────────────────────────────────────────────────────────  │
│  • BOGO needs separate table for complex logic                   │
│  • Tracks: buy/get rules, product rules, max applications       │
│  • Why separate: Complex BOGO logic needs dedicated structure   │
└─────────────────────────────────────────────────────────────────┘
         │
         └─── N:1 ────► promo (promo_id)


┌─────────────────────────────────────────────────────────────────┐
│                  promo_bundle_rules ⭐                              │
│  ────────────────────────────────────────────────────────────  │
│  • Bundle/combo promotion rules                                  │
│  • Multiple products purchased together                          │
└─────────────────────────────────────────────────────────────────┘
         │
         └─── N:1 ────► promo (promo_id)


┌─────────────────────────────────────────────────────────────────┐
│                  promo_tiered_rules ⭐                             │
│  ────────────────────────────────────────────────────────────  │
│  • Volume/spend tiers (if you use them)                          │
│  • Tracks: tier level, threshold, discount                       │
│  • Why separate: Easy to query "which tier does $150 qualify?"  │
└─────────────────────────────────────────────────────────────────┘
         │
         └─── N:1 ────► promo (promo_id)


┌─────────────────────────────────────────────────────────────────┐
│                promo_product_price_overrides ⭐                    │
│  ────────────────────────────────────────────────────────────  │
│  • Direct product price overrides                                │
│  • Temporarily changes product sale_price                       │
└─────────────────────────────────────────────────────────────────┘
         │
         └─── N:1 ────► promo (promo_id)


┌─────────────────────────────────────────────────────────────────┐
│                      promo_codes                                  │
│  ────────────────────────────────────────────────────────────  │
│  • Individual coupon codes                                      │
│  • Tracks: code, status, usage limits, customer assignment      │
│  • Links to: promotions, customers, usage history                │
└─────────────────────────────────────────────────────────────────┘
         │
         ├─── N:1 ────► promo (promo_id)
         ├─── N:1 ────► crm_customers (assigned_to_customer_id)
         └─── 1:N ────► promo_usage_history (coupon_code_id)


┌─────────────────────────────────────────────────────────────────┐
│                promo_eligible_products                            │
│  ────────────────────────────────────────────────────────────  │
│  • Product-level inclusions/exclusions                          │
│  • Tracks: product, variant, collection, SKU, context           │
│  • Why separate: High-frequency lookups during cart calculation  │
└─────────────────────────────────────────────────────────────────┘
         │
         └─── N:1 ────► promo (promo_id)


┌─────────────────────────────────────────────────────────────────┐
│                  promo_usage_history                              │
│  ────────────────────────────────────────────────────────────  │
│  • Redemption tracking & analytics                               │
│  • Tracks: discount amount, order totals, breakdown             │
│  • Links to: promotions, codes, orders, customers                │
└─────────────────────────────────────────────────────────────────┘
         │
         ├─── N:1 ────► promo (promo_id)
         ├─── N:1 ────► promo_codes (coupon_code_id)
         ├─── N:1 ────► orders (order_id)
         ├─── N:1 ────► crm_customers (customer_id)
         └─── N:1 ────► sys_tenants (tenant_id)


┌─────────────────────────────────────────────────────────────────┐
│                    REFERENCED TABLES (External)                  │
│  ────────────────────────────────────────────────────────────  │
│  • sys_tenants            - Tenant management                    │
│  • mkt_campaigns          - Marketing campaigns                  │
│  • hr_staff               - Staff/employee records              │
│  • crm_customers          - Customer records                     │
│  • orders                 - Order records                       │
└─────────────────────────────────────────────────────────────────┘


Relationship Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Promotion Structure:
  promo 1──1 promo_discount_rules
  promo 1──1 promo_bogo_rules
  promo 1──1 promo_bundle_rules
  promo 1──1 promo_tiered_rules
  promo 1──N promo_codes
  promo 1──N promo_eligible_products
  promo 1──N promo_product_price_overrides
  promo 1──N promo_usage_history

Campaign Association:
  promo M──N mkt_campaigns (via promo_campaigns)

Code & Usage:
  promo_codes N──1 promo
  promo_codes N──1 crm_customers
  promo_usage_history N──1 promo_codes
  promo_usage_history N──1 orders
  promo_usage_history N──1 crm_customers

Multi-tenant:
  sys_tenants 1──N promo
  sys_tenants 1──N promo_usage_history
```

---

## Table Details

### 1. `promo`
**Purpose:** Base promotion table with all promotion logic. Central table for all promotions.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | Promotion identifier |
| `promo_code` | VARCHAR(100) | UNIQUE | 🔒 Unique promotion code |
| `promo_name` | VARCHAR(500) | NOT NULL | Promotion name |
| `promo_type` | VARCHAR(50) | NOT NULL, CHECK | ✅ ENUM: 'discount', 'bogo', 'bundle', 'tiered', 'free_shipping' |
| `status` | VARCHAR(50) | NOT NULL, DEFAULT 'draft' | Promotion status: 'draft', 'active', 'paused', 'expired', 'archived' |
| `start_date` | TIMESTAMPTZ | NULL | ⏰ Promotion start date |
| `end_date` | TIMESTAMPTZ | NULL | ⏰ Promotion end date |
| `usage_limit_total` | INTEGER | NULL | Total usage limit across all customers |
| `usage_count` | INTEGER | NOT NULL, DEFAULT 0 | Current usage count |
| `usage_limit_per_customer` | INTEGER | NULL | Usage limit per customer |
| `eligibility_rules` | JSONB | NULL | Advanced eligibility rules (customer segments, tags, shipping countries, prerequisites, etc.) |
| `platform_sync` | JSONB | NULL | Platform integration data (price_rule_id, status, last_synced) |
| `tenant_id` | INTEGER | NOT NULL, FK → `sys_tenants(id)` | 🔗 Tenant |
| `created_by` | INTEGER | NULL | Staff who created (logical link to hr_staff) |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Last update timestamp |

**Foreign Keys:**
- `tenant_id` → `sys_tenants(id)`

**Indexes:**
- `idx_promo_tenant_id(tenant_id)` - Tenant filtering 📊
- `idx_promo_promo_code(promo_code)` - Code lookup 📊
- `idx_promo_status(status)` - Status filtering 📊
- `idx_promo_type(promo_type)` - Type filtering 📊
- `idx_promo_dates(start_date, end_date)` - Date range queries 📊
- `idx_promo_platform_sync(platform_sync)` - GIN index for JSONB queries 📊
- `idx_promo_eligibility_rules(eligibility_rules)` - GIN index for JSONB queries 📊

**Use Cases:**
- Promotion management
- Promotion lifecycle tracking
- Multi-platform synchronization
- Usage limit enforcement

**Notes:**
- `platform_sync` JSONB structure: `{"platform_name": "shopify", "price_rule_id": "12345", "status": "synced", "last_synced": "2024-01-15T10:00:00Z"}`
- `eligibility_rules` JSONB structure (flexible - UI can add any fields):
  ```json
  {
    "customer_segments": ["vip", "new"],
    "customer_tags": ["loyalty", "premium"],
    "shipping_countries": ["US", "CA"],
    "excluded_shipping_countries": ["CN"],
    "prerequisite_products": ["prod_123", "prod_456"],
    "prerequisite_collections": ["col_summer"],
    "min_purchase_amount": 100.00,
    "first_time_customer_only": false,
    "stacking_allowed": false
  }
  ```

---

### 2. `promo_campaigns`
**Purpose:** Junction table (many-to-many) linking promotions to marketing campaigns.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | Junction identifier |
| `promo_id` | BIGSERIAL | NOT NULL, FK → `promo(id)` | 🔗 Promotion |
| `mkt_campaign_id` | BIGINT | NOT NULL, FK → `mkt_campaigns(id)` | 🔗 Marketing campaign |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Last update timestamp |

**Foreign Keys:**
- `promo_id` → `promo(id)` ON DELETE CASCADE
- `mkt_campaign_id` → `mkt_campaigns(id)` ON DELETE CASCADE

**Unique Constraints:**
- `(promo_id, mkt_campaign_id)` - One link per promotion-campaign pair

**Indexes:**
- `UNIQUE(promo_id, mkt_campaign_id)` - Already defined 📊
- `idx_promo_campaigns_promo_id(promo_id)` - Promotion lookup 📊
- `idx_promo_campaigns_mkt_campaign_id(mkt_campaign_id)` - Campaign lookup 📊

**Use Cases:**
- Link promotions to marketing campaigns
- Track which promotions belong to which campaigns
- Support multiple campaigns per promotion

**Notes:**
- Many-to-many relationship: One promotion can be in multiple campaigns, one campaign can have multiple promotions
- No campaign-specific promotion settings stored here (all promotion logic in `promo` table)

---

### 3. `promo_discount_rules` ⭐
**Purpose:** Separated for query performance (most common queries). Handles percentage, fixed amount, fixed price, and free shipping discounts.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | Discount rule identifier |
| `promo_id` | BIGSERIAL | NOT NULL, FK → `promo(id)`, UNIQUE | 🔗 🔒 Promotion (one-to-one) |
| `discount_type` | VARCHAR(50) | NOT NULL, CHECK | ✅ ENUM: 'percentage', 'fixed_amount', 'fixed_price', 'free_shipping' |
| `discount_value` | NUMERIC(10,2) | NULL | Discount value (percentage or amount) |
| `max_discount_amount` | NUMERIC(10,2) | NULL | Maximum discount cap (for percentage discounts) |
| `apply_to` | VARCHAR(50) | NOT NULL, CHECK | ✅ ENUM: 'order', 'line_item', 'shipping' |
| `allocation_method` | VARCHAR(50) | NULL, CHECK | ✅ ENUM: 'across', 'each' (for line item discounts) |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Last update timestamp |

**Foreign Keys:**
- `promo_id` → `promo(id)` ON DELETE CASCADE

**Unique Constraints:**
- `promo_id` (one discount rule per promotion)

**Indexes:**
- `UNIQUE(promo_id)` - Already defined 📊
- `idx_promo_discount_rules_type(discount_type)` - Type filtering 📊
- `idx_promo_discount_rules_apply_to(apply_to)` - Apply target filtering 📊

**Use Cases:**
- Discount calculation
- Cart discount application
- Line item discount allocation
- Free shipping rules

**Notes:**
- **Why separate:** Most queries filter by discount type/value, separating improves query performance
- `discount_value` interpretation:
  - `discount_type='percentage'`: value is percentage (e.g., 20.00 = 20%)
  - `discount_type='fixed_amount'`: value is fixed amount (e.g., 10.00 = $10 off)
  - `discount_type='fixed_price'`: value is final price (e.g., 50.00 = $50 final price)
  - `discount_type='free_shipping'`: value is NULL
- `allocation_method`:
  - `'across'`: Discount distributed across all eligible items
  - `'each'`: Discount applied to each eligible item separately

---

### 4. `promo_bogo_rules` ⭐
**Purpose:** BOGO needs separate table for complex logic. Handles Buy One Get One promotions with flexible product matching.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | BOGO rule identifier |
| `promo_id` | BIGSERIAL | NOT NULL, FK → `promo(id)`, UNIQUE | 🔗 🔒 Promotion (one-to-one) |
| `buy_type` | VARCHAR(50) | NOT NULL, CHECK | ✅ ENUM: 'quantity', 'amount', 'specific_products' |
| `buy_quantity` | INTEGER | NULL | Required quantity to buy |
| `buy_amount` | NUMERIC(10,2) | NULL | Required amount to buy |
| `buy_product_rules` | JSONB | NULL | Buy-side product matching rules |
| `get_type` | VARCHAR(50) | NOT NULL, CHECK | ✅ ENUM: 'same_product', 'specific_products', 'cheapest', 'any' |
| `get_quantity` | INTEGER | NOT NULL, DEFAULT 1 | Quantity to get (free or discounted) |
| `get_product_rules` | JSONB | NULL | Get-side product matching rules |
| `max_applications_per_order` | INTEGER | NULL | Maximum times BOGO can apply per order |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Last update timestamp |

**Foreign Keys:**
- `promo_id` → `promo(id)` ON DELETE CASCADE

**Unique Constraints:**
- `promo_id` (one BOGO rule per promotion)

**Indexes:**
- `UNIQUE(promo_id)` - Already defined 📊
- `idx_promo_bogo_rules_buy_type(buy_type)` - Buy type filtering 📊
- `idx_promo_bogo_rules_get_type(get_type)` - Get type filtering 📊
- `idx_promo_bogo_rules_product_rules(buy_product_rules, get_product_rules)` - GIN index for JSONB queries 📊

**Use Cases:**
- BOGO promotion calculation
- Product matching logic
- Cart discount application
- Complex promotion rules

**Notes:**
- **Why separate:** Complex BOGO logic needs dedicated structure, frequent queries for "What BOGOs apply to this product?"
- `buy_product_rules` JSONB structure:
  ```json
  {
    "products": ["prod_123", "prod_456"],
    "collections": ["col_789"],
    "match_type": "any|all"
  }
  ```
- `get_product_rules` JSONB structure:
  ```json
  {
    "products": ["prod_999"],
    "collections": ["col_111"],
    "discount_type": "percentage|fixed|free",
    "discount_value": 100
  }
  ```
- `buy_type`:
  - `'quantity'`: Buy X items
  - `'amount'`: Buy items totaling $X
  - `'specific_products'`: Buy specific products (defined in `buy_product_rules`)
- `get_type`:
  - `'same_product'`: Get same product as bought
  - `'specific_products'`: Get specific products (defined in `get_product_rules`)
  - `'cheapest'`: Get cheapest eligible item
  - `'any'`: Get any eligible item

---

### 5. `promo_bundle_rules` ⭐
**Purpose:** Bundle/combo promotion rules. Handles bundle discounts when multiple products are purchased together.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | Bundle rule identifier |
| `promo_id` | BIGSERIAL | NOT NULL, FK → `promo(id)`, UNIQUE | 🔗 🔒 Promotion (one-to-one) |
| `bundle_type` | VARCHAR(50) | NOT NULL, CHECK | ✅ ENUM: 'quantity', 'amount', 'specific_products' |
| `required_quantity` | INTEGER | NULL | Required quantity of items in bundle |
| `required_amount` | NUMERIC(10,2) | NULL | Required total amount for bundle |
| `bundle_product_rules` | JSONB | NULL | Products/collections that must be in bundle |
| `discount_type` | VARCHAR(50) | NOT NULL, CHECK | ✅ ENUM: 'percentage', 'fixed_amount', 'fixed_price' |
| `discount_value` | NUMERIC(10,2) | NOT NULL | Discount value for bundle |
| `max_discount_amount` | NUMERIC(10,2) | NULL | Maximum discount cap |
| `min_items_in_bundle` | INTEGER | NULL | Minimum items required in bundle |
| `max_items_in_bundle` | INTEGER | NULL | Maximum items allowed in bundle |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Last update timestamp |

**Foreign Keys:**
- `promo_id` → `promo(id)` ON DELETE CASCADE

**Unique Constraints:**
- `promo_id` (one bundle rule per promotion)

**Indexes:**
- `UNIQUE(promo_id)` - Already defined 📊
- `idx_promo_bundle_rules_bundle_type(bundle_type)` - Bundle type filtering 📊
- `idx_promo_bundle_rules_product_rules(bundle_product_rules)` - GIN index for JSONB queries 📊

**Use Cases:**
- Bundle promotion calculation
- Multiple product discount rules
- Cart discount application
- Combo promotions

**Notes:**
- **Why separate:** Bundle logic needs dedicated structure for complex product matching
- `bundle_product_rules` JSONB structure:
  ```json
  {
    "products": ["prod_300", "prod_301", "prod_302"],
    "collections": ["col_jewelry"],
    "match_type": "any|all"
  }
  ```
- `bundle_type`:
  - `'quantity'`: Buy X items
  - `'amount'`: Buy items totaling $X
  - `'specific_products'`: Buy specific products (defined in `bundle_product_rules`)

---

### 6. `promo_tiered_rules` ⭐
**Purpose:** Volume/spend tiers (if you use them). Handles tiered pricing based on quantity or amount thresholds.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | Tiered rule identifier |
| `promo_id` | BIGSERIAL | NOT NULL, FK → `promo(id)` | 🔗 Promotion |
| `tier_level` | INTEGER | NOT NULL | Tier level (1, 2, 3, etc.) |
| `threshold_type` | VARCHAR(50) | NOT NULL, CHECK | ✅ ENUM: 'quantity', 'amount' |
| `threshold_value` | NUMERIC(10,2) | NOT NULL | Threshold value (quantity or amount) |
| `discount_type` | VARCHAR(50) | NOT NULL, CHECK | ✅ ENUM: 'percentage', 'fixed_amount' |
| `discount_value` | NUMERIC(10,2) | NOT NULL | Discount value for this tier |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Last update timestamp |

**Foreign Keys:**
- `promo_id` → `promo(id)` ON DELETE CASCADE

**Indexes:**
- `idx_promo_tiered_rules_promo_id(promo_id, tier_level)` - Promotion tier lookup 📊
- `idx_promo_tiered_rules_threshold(promo_id, threshold_type, threshold_value)` - Threshold queries 📊

**Use Cases:**
- Tiered pricing calculation
- Volume discount rules
- Spend-based discounts
- Bulk order pricing

**Notes:**
- **Why separate:** Easy to query "which tier does $150 order qualify for?"
- Multiple tiers per campaign (one row per tier)
- Tiers should be ordered by `tier_level` ascending
- Example: Buy 10+ items get 10% off, Buy 20+ items get 20% off
- `threshold_type`:
  - `'quantity'`: Threshold based on item quantity
  - `'amount'`: Threshold based on order total amount

---

### 7. `promo_product_price_overrides` ⭐
**Purpose:** Direct product price overrides during promotions. Temporarily changes product sale_price for display and platform sync.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | Override identifier |
| `promo_id` | BIGSERIAL | NOT NULL, FK → `promo(id)` | 🔗 Promotion |
| `product_id` | VARCHAR(100) | NULL | Product identifier |
| `variant_id` | VARCHAR(100) | NULL | Product variant identifier |
| `product_sku` | VARCHAR(100) | NULL | Product SKU |
| `override_price` | NUMERIC(10,2) | NOT NULL | New sale price during promotion |
| `original_price` | NUMERIC(10,2) | NULL | Original price (for rollback) |
| `price_override_type` | VARCHAR(50) | NOT NULL, DEFAULT 'sale_price', CHECK | ✅ ENUM: 'sale_price', 'retail_price', 'both' |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Last update timestamp |

**Foreign Keys:**
- `promo_id` → `promo(id)` ON DELETE CASCADE

**Indexes:**
- `idx_promo_price_overrides_promo_id(promo_id)` - Promotion lookup 📊
- `idx_promo_price_overrides_product_id(product_id)` - Product lookup 📊
- `idx_promo_price_overrides_variant_id(variant_id)` - Variant lookup 📊
- `idx_promo_price_overrides_sku(product_sku)` - SKU lookup 📊
- Composite: `(promo_id, product_id, variant_id)` - Product override lookup 📊

**Use Cases:**
- Direct product price changes during promotions
- Platform price synchronization (Shopify, WooCommerce)
- Product page display of sale prices
- Scheduled price changes

**Notes:**
- **Why separate:** Direct price modification needs dedicated table for tracking and rollback
- At least one of `product_id`, `variant_id`, or `product_sku` must be provided
- `original_price` stores the price before override (for rollback when promotion ends)
- `price_override_type`:
  - `'sale_price'`: Override only sale_price
  - `'retail_price'`: Override only retail_price
  - `'both'`: Override both prices
- When promotion is active, product's sale_price should reflect `override_price`
- When promotion ends, price should revert to `original_price` (if stored)
- Multiple promotions can override same product (last active promotion wins or stacking rules apply)

---

### 8. `promo_codes`
**Purpose:** Individual coupon codes. Tracks individual coupon codes with usage limits and customer assignments.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | Coupon code identifier |
| `promo_id` | BIGSERIAL | NOT NULL, FK → `promo(id)` | 🔗 Parent promotion |
| `code` | VARCHAR(100) | NOT NULL, UNIQUE | 🔒 Coupon code |
| `status` | VARCHAR(50) | NOT NULL, DEFAULT 'active', CHECK | ✅ ENUM: 'active', 'used', 'expired', 'revoked' |
| `usage_limit` | INTEGER | NULL | Usage limit for this code |
| `usage_count` | INTEGER | NOT NULL, DEFAULT 0 | Current usage count |
| `assigned_to_customer_id` | BIGINT | NULL, FK → `crm_customers(id)` | 🔗 Assigned customer (nullable) |
| `platform_sync` | JSONB | NULL | Platform integration data |
| `first_used_at` | TIMESTAMPTZ | NULL | ⏰ First usage timestamp |
| `last_used_at` | TIMESTAMPTZ | NULL | ⏰ Last usage timestamp |
| `expires_at` | TIMESTAMPTZ | NULL | ⏰ Code expiration date |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Last update timestamp |

**Foreign Keys:**
- `promo_id` → `promo(id)` ON DELETE CASCADE
- `assigned_to_customer_id` → `crm_customers(id)`

**Unique Constraints:**
- `code` (unique coupon codes)

**Indexes:**
- `UNIQUE(code)` - Already defined 📊
- `idx_promo_codes_promo_id(promo_id)` - Promotion lookup 📊
- `idx_promo_codes_status(status)` - Status filtering 📊
- `idx_promo_codes_customer_id(assigned_to_customer_id)` - Customer lookup 📊
- `idx_promo_codes_expires_at(expires_at)` - Expiration queries 📊

**Use Cases:**
- Coupon code management
- Code validation
- Customer-specific codes
- Usage tracking

**Notes:**
- `platform_sync` JSONB structure: `{"platform_name": "shopify", "discount_code_id": "67890", "status": "synced"}`
- `assigned_to_customer_id` is nullable - NULL means code is available to all customers
- Code status transitions: `active` → `used` (when limit reached) or `expired` (when expires_at passed) or `revoked` (manually revoked)

---

### 9. `promo_eligible_products`
**Purpose:** Product-level inclusions/exclusions. High-frequency lookups during cart calculation.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | Eligibility rule identifier |
| `promo_id` | BIGSERIAL | NOT NULL, FK → `promo(id)` | 🔗 Parent promotion |
| `product_id` | VARCHAR(100) | NULL | Product identifier |
| `variant_id` | VARCHAR(100) | NULL | Product variant identifier |
| `collection_id` | VARCHAR(100) | NULL | Collection identifier |
| `product_sku` | VARCHAR(100) | NULL | Product SKU |
| `inclusion_type` | VARCHAR(50) | NOT NULL, CHECK | ✅ ENUM: 'include', 'exclude' |
| `context` | VARCHAR(50) | NULL, CHECK | ✅ ENUM: 'buy_side', 'get_side', 'both' (for BOGO) |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Creation timestamp |

**Foreign Keys:**
- `promo_id` → `promo(id)` ON DELETE CASCADE

**Indexes:**
- `idx_promo_eligible_products_promo_id(promo_id, inclusion_type)` - Promotion eligibility lookup 📊
- `idx_promo_eligible_products_product_id(product_id)` - Product lookup 📊
- `idx_promo_eligible_products_variant_id(variant_id)` - Variant lookup 📊
- `idx_promo_eligible_products_collection_id(collection_id)` - Collection lookup 📊
- `idx_promo_eligible_products_sku(product_sku)` - SKU lookup 📊
- `idx_promo_eligible_products_context(context)` - Context filtering 📊

**Use Cases:**
- Product eligibility checking
- Cart discount calculation
- BOGO product matching
- Exclusion rules

**Notes:**
- **Why separate:** High-frequency lookups during cart calculation
- At least one of `product_id`, `variant_id`, `collection_id`, or `product_sku` must be provided
- `inclusion_type`:
  - `'include'`: Product is included in promotion
  - `'exclude'`: Product is excluded from promotion
- `context` (for BOGO campaigns):
  - `'buy_side'`: Applies to buy side of BOGO
  - `'get_side'`: Applies to get side of BOGO
  - `'both'`: Applies to both sides
  - NULL: Applies to all contexts (for non-BOGO campaigns)

---

### 10. `promo_usage_history`
**Purpose:** Redemption tracking & analytics. Tracks all promotion redemptions with detailed breakdown.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | Usage history identifier |
| `promo_id` | BIGSERIAL | NOT NULL, FK → `promo(id)` | 🔗 Promotion used |
| `coupon_code_id` | BIGSERIAL | NULL, FK → `promo_codes(id)` | 🔗 Coupon code used (nullable) |
| `order_id` | BIGINT | NOT NULL, FK → `orders(id)` | 🔗 Order where promotion was applied |
| `customer_id` | BIGINT | NULL, FK → `crm_customers(id)` | 🔗 Customer who used promotion |
| `discount_amount` | NUMERIC(10,2) | NOT NULL | Total discount amount applied |
| `original_order_total` | NUMERIC(10,2) | NOT NULL | Order total before discount |
| `final_order_total` | NUMERIC(10,2) | NOT NULL | Order total after discount |
| `discount_breakdown` | JSONB | NULL | Detailed calculation breakdown |
| `platform_order_id` | VARCHAR(200) | NULL | External platform order ID |
| `platform_discount_application_id` | VARCHAR(200) | NULL | External platform discount application ID |
| `used_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Usage timestamp |
| `tenant_id` | INTEGER | NOT NULL, FK → `sys_tenants(id)` | 🔗 Tenant |

**Foreign Keys:**
- `promo_id` → `promo(id)`
- `coupon_code_id` → `promo_codes(id)`
- `order_id` → `orders(id)`
- `customer_id` → `crm_customers(id)`
- `tenant_id` → `sys_tenants(id)`

**Indexes:**
- `idx_promo_usage_history_promo_id(promo_id, used_at)` - Promotion usage lookup 📊
- `idx_promo_usage_history_order_id(order_id)` - Order lookup 📊
- `idx_promo_usage_history_customer_id(customer_id, used_at)` - Customer usage lookup 📊
- `idx_promo_usage_history_coupon_code_id(coupon_code_id)` - Code usage lookup 📊
- `idx_promo_usage_history_tenant_id(tenant_id, used_at)` - Tenant filtering 📊
- `idx_promo_usage_history_used_at(used_at)` - Time-based queries 📊
- `idx_promo_usage_history_breakdown(discount_breakdown)` - GIN index for JSONB queries 📊

**Use Cases:**
- Promotion analytics
- Usage tracking
- Customer behavior analysis
- Platform synchronization
- Financial reporting

**Notes:**
- `discount_breakdown` JSONB structure:
  ```json
  {
    "bogo_applied": {
      "buy_items": ["item_1", "item_2"],
      "get_items": ["item_3"],
      "discount_per_item": 25.00
    },
    "tier_applied": 2,
    "products_affected": ["prod_123", "prod_456"],
    "line_item_discounts": [
      {"item_id": "item_1", "discount": 10.00},
      {"item_id": "item_2", "discount": 15.00}
    ]
  }
  ```
- `platform_order_id` and `platform_discount_application_id` store external platform references for synchronization
- `coupon_code_id` is nullable - promotions can be applied without codes (automatic promotions)

---

## Relationships Summary

### Promotion Structure

1. **`promo` → `promo_discount_rules`** (One-to-One)
   - One promotion has one discount rule (if promo type is 'discount')
   - `promo_discount_rules.promo_id` → `promo.id` (UNIQUE)

2. **`promo` → `promo_bogo_rules`** (One-to-One)
   - One promotion has one BOGO rule (if promo type is 'bogo')
   - `promo_bogo_rules.promo_id` → `promo.id` (UNIQUE)

3. **`promo` → `promo_bundle_rules`** (One-to-One)
   - One promotion has one bundle rule (if promo type is 'bundle')
   - `promo_bundle_rules.promo_id` → `promo.id` (UNIQUE)

4. **`promo` → `promo_tiered_rules`** (One-to-Many)
   - One promotion can have multiple tiered rules (multiple tiers)
   - `promo_tiered_rules.promo_id` → `promo.id`

5. **`promo` → `promo_codes`** (One-to-Many)
   - One promotion can have multiple coupon codes
   - `promo_codes.promo_id` → `promo.id`

6. **`promo` → `promo_eligible_products`** (One-to-Many)
   - One promotion can have multiple product eligibility rules
   - `promo_eligible_products.promo_id` → `promo.id`

7. **`promo` → `promo_product_price_overrides`** (One-to-Many)
   - One promotion can have multiple product price overrides
   - `promo_product_price_overrides.promo_id` → `promo.id`

8. **`promo` → `promo_usage_history`** (One-to-Many)
   - One promotion can have multiple usage records
   - `promo_usage_history.promo_id` → `promo.id`

### Campaign Association

9. **`promo` ↔ `mkt_campaigns`** (Many-to-Many)
   - Many promotions can belong to many marketing campaigns
   - Junction table: `promo_campaigns`
   - `promo_campaigns.promo_id` → `promo.id`
   - `promo_campaigns.mkt_campaign_id` → `mkt_campaigns.id`

### Code & Usage

10. **`promo_codes` → `promo`** (Many-to-One)
    - Many codes belong to one promotion
    - `promo_codes.promo_id` → `promo.id`

11. **`promo_codes` → `crm_customers`** (Many-to-One, Optional)
    - Codes can be assigned to specific customers
    - `promo_codes.assigned_to_customer_id` → `crm_customers.id` (nullable)

12. **`promo_usage_history` → `promo_codes`** (Many-to-One, Optional)
    - Usage records can reference coupon codes
    - `promo_usage_history.coupon_code_id` → `promo_codes.id` (nullable)

13. **`promo_usage_history` → `orders`** (Many-to-One)
    - Usage records link to orders
    - `promo_usage_history.order_id` → `orders.id`

14. **`promo_usage_history` → `crm_customers`** (Many-to-One, Optional)
    - Usage records link to customers
    - `promo_usage_history.customer_id` → `crm_customers.id` (nullable)

### Multi-Tenant

15. **`sys_tenants` → `promo`** (One-to-Many)
    - Many promotions belong to one tenant
    - `promo.tenant_id` → `sys_tenants.id`

16. **`sys_tenants` → `promo_usage_history`** (One-to-Many)
    - Many usage records belong to one tenant
    - `promo_usage_history.tenant_id` → `sys_tenants.id`

---

## Index Recommendations

### `promo`
- `idx_promo_tenant_id(tenant_id)` - Tenant filtering 📊
- `idx_promo_promo_code(promo_code)` - Code lookup 📊
- `idx_promo_status(status)` - Status filtering 📊
- `idx_promo_type(promo_type)` - Type filtering 📊
- `idx_promo_dates(start_date, end_date)` - Date range queries 📊
- `idx_promo_platform_sync(platform_sync)` - GIN index for JSONB queries 📊
- `idx_promo_eligibility_rules(eligibility_rules)` - GIN index for JSONB queries 📊
- Composite: `(tenant_id, status, start_date, end_date)` - Common query pattern

### `promo_campaigns`
- `UNIQUE(promo_id, mkt_campaign_id)` - Already defined 📊
- `idx_promo_campaigns_promo_id(promo_id)` - Promotion lookup 📊
- `idx_promo_campaigns_mkt_campaign_id(mkt_campaign_id)` - Campaign lookup 📊

### `promo_discount_rules`
- `UNIQUE(promo_id)` - Already defined 📊
- `idx_promo_discount_rules_type(discount_type)` - Type filtering 📊
- `idx_promo_discount_rules_apply_to(apply_to)` - Apply target filtering 📊

### `promo_bogo_rules`
- `UNIQUE(promo_id)` - Already defined 📊
- `idx_promo_bogo_rules_buy_type(buy_type)` - Buy type filtering 📊
- `idx_promo_bogo_rules_get_type(get_type)` - Get type filtering 📊
- `idx_promo_bogo_rules_product_rules(buy_product_rules, get_product_rules)` - GIN index for JSONB queries 📊

### `promo_bundle_rules`
- `UNIQUE(promo_id)` - Already defined 📊
- `idx_promo_bundle_rules_bundle_type(bundle_type)` - Bundle type filtering 📊
- `idx_promo_bundle_rules_product_rules(bundle_product_rules)` - GIN index for JSONB queries 📊

### `promo_tiered_rules`
- `idx_promo_tiered_rules_promo_id(promo_id, tier_level)` - Promotion tier lookup 📊
- `idx_promo_tiered_rules_threshold(promo_id, threshold_type, threshold_value)` - Threshold queries 📊

### `promo_codes`
- `UNIQUE(code)` - Already defined 📊
- `idx_promo_codes_promo_id(promo_id)` - Promotion lookup 📊
- `idx_promo_codes_status(status)` - Status filtering 📊
- `idx_promo_codes_customer_id(assigned_to_customer_id)` - Customer lookup 📊
- `idx_promo_codes_expires_at(expires_at)` - Expiration queries 📊
- Composite: `(promo_id, status)` - Promotion active codes

### `promo_eligible_products`
- `idx_promo_eligible_products_promo_id(promo_id, inclusion_type)` - Promotion eligibility lookup 📊
- `idx_promo_eligible_products_product_id(product_id)` - Product lookup 📊
- `idx_promo_eligible_products_variant_id(variant_id)` - Variant lookup 📊
- `idx_promo_eligible_products_collection_id(collection_id)` - Collection lookup 📊
- `idx_promo_eligible_products_sku(product_sku)` - SKU lookup 📊
- `idx_promo_eligible_products_context(context)` - Context filtering 📊
- Composite: `(promo_id, product_id, inclusion_type)` - Product eligibility check

### `promo_product_price_overrides`
- `idx_promo_price_overrides_promo_id(promo_id)` - Promotion lookup 📊
- `idx_promo_price_overrides_product_id(product_id)` - Product lookup 📊
- `idx_promo_price_overrides_variant_id(variant_id)` - Variant lookup 📊
- `idx_promo_price_overrides_sku(product_sku)` - SKU lookup 📊
- Composite: `(promo_id, product_id, variant_id)` - Product override lookup 📊

### `promo_usage_history`
- `idx_promo_usage_history_promo_id(promo_id, used_at)` - Promotion usage lookup 📊
- `idx_promo_usage_history_order_id(order_id)` - Order lookup 📊
- `idx_promo_usage_history_customer_id(customer_id, used_at)` - Customer usage lookup 📊
- `idx_promo_usage_history_coupon_code_id(coupon_code_id)` - Code usage lookup 📊
- `idx_promo_usage_history_tenant_id(tenant_id, used_at)` - Tenant filtering 📊
- `idx_promo_usage_history_used_at(used_at)` - Time-based queries 📊
- `idx_promo_usage_history_breakdown(discount_breakdown)` - GIN index for JSONB queries 📊
- Composite: `(tenant_id, promo_id, used_at)` - Promotion analytics

---

## Design Considerations

### Hybrid Table Design

The 10-table hybrid design separates concerns for optimal performance:

1. **`promo`** - Base promotion configuration
2. **`promo_campaigns`** - Junction table linking promotions to marketing campaigns
3. **`promo_discount_rules`** ⭐ - Separated for query performance (most common queries)
4. **`promo_bogo_rules`** ⭐ - Complex BOGO logic needs dedicated structure
5. **`promo_bundle_rules`** ⭐ - Bundle promotion logic
6. **`promo_tiered_rules`** ⭐ - Easy tier threshold queries
7. **`promo_product_price_overrides`** ⭐ - Direct product price overrides
8. **`promo_codes`** - Individual coupon code management
9. **`promo_eligible_products`** - High-frequency product eligibility lookups
10. **`promo_usage_history`** - Redemption tracking and analytics

**Benefits:**
- Optimized for complex BOGO + <100 orders/day + No A/B Testing
- Separated tables improve query performance for specific use cases
- Easy to extend with new promotion types
- Clear separation of concerns

### Multi-Platform Integration

Platform integration is handled generically via JSONB fields:

- **`promo.platform_sync`**: Stores platform-specific data (e.g., Shopify price_rule_id, WooCommerce coupon_id)
- **`promo_codes.platform_sync`**: Stores platform-specific code data
- **`promo_usage_history.platform_order_id`**: Links to external platform orders
- **`promo_usage_history.platform_discount_application_id`**: Links to external platform discount applications

**Platform-Agnostic Design:**
- No platform-specific tables or columns
- All platform data stored in JSONB for flexibility
- Easy to add new platforms without schema changes
- Platform name stored in JSONB: `{"platform_name": "shopify"}` or `{"platform_name": "woocommerce"}`

### Campaign Types

Supported campaign types:
- **`discount`**: Standard discounts (percentage, fixed amount, fixed price, free shipping)
- **`bogo`**: Buy One Get One promotions
- **`bundle`**: Bundle/combo promotions
- **`tiered`**: Tiered pricing based on quantity or amount
- **`free_shipping`**: Free shipping promotions

### Usage Limits

Three levels of usage limits:
1. **Promotion-level**: `promo.usage_limit_total` - Total usage across all customers
2. **Code-level**: `promo_codes.usage_limit` - Usage limit per coupon code
3. **Customer-level**: `promo.usage_limit_per_customer` - Usage limit per customer

### Eligibility Rules

Eligibility is managed through:
- **`promo.eligibility_rules`** (JSONB): Flexible eligibility rules - UI can add any fields (customer segments, tags, shipping countries, prerequisites, min purchase, stacking rules, etc.)
- **`promo_eligible_products`**: Product-level inclusions/exclusions
- **`promo_codes.assigned_to_customer_id`**: Customer-specific codes

**Advanced Eligibility Options (stored in JSONB):**
- Customer segments, customer tags
- Shipping countries (included/excluded)
- Prerequisite products/collections
- Minimum purchase amount
- First-time customer only flag
- Stacking allowed flag
- Any other eligibility criteria (flexible - no schema changes needed)

### BOGO Logic

BOGO promotions support:
- **Buy side**: Quantity-based, amount-based, or specific products
- **Get side**: Same product, specific products, cheapest, or any eligible
- **Product matching**: Products, variants, collections, SKUs
- **Context**: Buy side, get side, or both

---

## Query Patterns

### Promotion Queries

**Get active promotions:**
```sql
SELECT p.*
FROM promo p
WHERE p.tenant_id = ?
  AND p.status = 'active'
  AND (p.start_date IS NULL OR p.start_date <= NOW())
  AND (p.end_date IS NULL OR p.end_date >= NOW())
ORDER BY p.created_at DESC;
```

**Get promotion with rules:**
```sql
SELECT 
  p.*,
  pdr.* as discount_rule,
  pbr.* as bogo_rule,
  pbur.* as bundle_rule,
  json_agg(ptr.*) as tiered_rules
FROM promo p
LEFT JOIN promo_discount_rules pdr ON p.id = pdr.promo_id
LEFT JOIN promo_bogo_rules pbr ON p.id = pbr.promo_id
LEFT JOIN promo_bundle_rules pbur ON p.id = pbur.promo_id
LEFT JOIN promo_tiered_rules ptr ON p.id = ptr.promo_id
WHERE p.id = ?
GROUP BY p.id, pdr.id, pbr.id, pbur.id;
```

**Get promotions for marketing campaign:**
```sql
SELECT p.*
FROM promo p
JOIN promo_campaigns pc ON p.id = pc.promo_id
WHERE pc.mkt_campaign_id = ?
  AND p.tenant_id = ?
  AND p.status = 'active';
```

**Get marketing campaigns for promotion:**
```sql
SELECT mc.*
FROM mkt_campaigns mc
JOIN promo_campaigns pc ON mc.id = pc.mkt_campaign_id
WHERE pc.promo_id = ?;
```

### Code Queries

**Validate coupon code:**
```sql
SELECT pc.*, p.promo_name, p.status as promo_status
FROM promo_codes pc
JOIN promo p ON pc.promo_id = p.id
WHERE pc.code = ?
  AND pc.status = 'active'
  AND (pc.expires_at IS NULL OR pc.expires_at >= NOW())
  AND (pc.usage_limit IS NULL OR pc.usage_count < pc.usage_limit)
  AND p.status = 'active'
  AND (p.start_date IS NULL OR p.start_date <= NOW())
  AND (p.end_date IS NULL OR p.end_date >= NOW());
```

**Get customer-specific codes:**
```sql
SELECT pc.*
FROM promo_codes pc
WHERE pc.assigned_to_customer_id = ?
  AND pc.status = 'active'
  AND (pc.expires_at IS NULL OR pc.expires_at >= NOW());
```

### Product Eligibility Queries

**Check if product is eligible:**
```sql
SELECT 
  pep.inclusion_type,
  pep.context
FROM promo_eligible_products pep
JOIN promo p ON pep.promo_id = p.id
WHERE p.status = 'active'
  AND (p.start_date IS NULL OR p.start_date <= NOW())
  AND (p.end_date IS NULL OR p.end_date >= NOW())
  AND (
    pep.product_id = ?
    OR pep.variant_id = ?
    OR pep.collection_id = ?
    OR pep.product_sku = ?
  )
ORDER BY pep.inclusion_type DESC; -- Excludes first, then includes
```

### Usage History Queries

**Get promotion usage statistics:**
```sql
SELECT 
  COUNT(*) as total_uses,
  COUNT(DISTINCT customer_id) as unique_customers,
  SUM(discount_amount) as total_discount,
  AVG(discount_amount) as avg_discount
FROM promo_usage_history
WHERE promo_id = ?
  AND tenant_id = ?
  AND used_at >= ?;
```

**Get customer promotion history:**
```sql
SELECT puh.*, p.promo_name, pc.code
FROM promo_usage_history puh
JOIN promo p ON puh.promo_id = p.id
LEFT JOIN promo_codes pc ON puh.coupon_code_id = pc.id
WHERE puh.customer_id = ?
  AND puh.tenant_id = ?
ORDER BY puh.used_at DESC;
```

### BOGO Queries

**Find applicable BOGO promotions for cart:**
```sql
SELECT pbr.*, p.*
FROM promo_bogo_rules pbr
JOIN promo p ON pbr.promo_id = p.id
WHERE p.status = 'active'
  AND p.promo_type = 'bogo'
  AND (p.start_date IS NULL OR p.start_date <= NOW())
  AND (p.end_date IS NULL OR p.end_date >= NOW())
  AND (
    pbr.buy_product_rules @> '{"products": ["prod_123"]}'::jsonb
    OR pbr.buy_product_rules @> '{"collections": ["col_789"]}'::jsonb
  );
```

### Price Override Queries

**Get active price overrides for product:**
```sql
SELECT pppo.*, p.promo_name, p.status, p.start_date, p.end_date
FROM promo_product_price_overrides pppo
JOIN promo p ON pppo.promo_id = p.id
WHERE (pppo.product_id = ? OR pppo.variant_id = ? OR pppo.product_sku = ?)
  AND p.status = 'active'
  AND (p.start_date IS NULL OR p.start_date <= NOW())
  AND (p.end_date IS NULL OR p.end_date >= NOW())
ORDER BY p.created_at DESC;
```

**Get all price overrides for promotion:**
```sql
SELECT pppo.*
FROM promo_product_price_overrides pppo
WHERE pppo.promo_id = ?
ORDER BY pppo.product_id, pppo.variant_id;
```

**Get products with price overrides (for platform sync):**
```sql
SELECT DISTINCT
  pppo.product_id,
  pppo.variant_id,
  pppo.product_sku,
  pppo.override_price,
  p.platform_sync
FROM promo_product_price_overrides pppo
JOIN promo p ON pppo.promo_id = p.id
WHERE p.status = 'active'
  AND (p.start_date IS NULL OR p.start_date <= NOW())
  AND (p.end_date IS NULL OR p.end_date >= NOW())
  AND p.platform_sync IS NOT NULL;
```

---

## Promotion Examples (JSON Payloads)

### 1. Product Price Override (Direct Sale Price Change)

**Purpose:** Directly modify product sale_price during promotion period.

```json
{
  "promo": {
    "promo_code": "SUMMER2024",
    "promo_name": "Summer Sale - Product Price Override",
    "promo_type": "discount",
    "status": "active",
    "start_date": "2024-06-01T00:00:00Z",
    "end_date": "2024-08-31T23:59:59Z",
    "usage_limit_total": null,
    "usage_limit_per_customer": null,
    "eligibility_rules": {
      "customer_segments": [],
      "min_purchase_amount": null,
      "stacking_allowed": false
    },
    "platform_sync": {
      "platform_name": "shopify",
      "price_rule_id": "pr_12345",
      "status": "synced",
      "last_synced": "2024-05-30T10:00:00Z"
    },
    "tenant_id": 1
  },
  "price_overrides": [
    {
      "product_id": "prod_123",
      "variant_id": null,
      "product_sku": "RING-GOLD-001",
      "override_price": 299.99,
      "original_price": 399.99,
      "price_override_type": "sale_price"
    }
  ],
  "eligible_products": [
    { 
      "product_id": "prod_123",
      "inclusion_type": "include",
      "context": null
    }
  ],
  "campaigns": [
    {
      "mkt_campaign_id": 5
    }
  ]
}
```

---

### 2. Discount to Products (Auto Apply - Percentage)

**Purpose:** Automatic percentage discount applied to specific products.

```json
{
  "promo": {
    "promo_code": "PROD20OFF",
    "promo_name": "20% Off Selected Products",
    "promo_type": "discount",
    "status": "active",
    "start_date": "2024-07-01T00:00:00Z",
    "end_date": "2024-07-31T23:59:59Z",
    "usage_limit_total": 1000,
    "usage_limit_per_customer": 1,
    "eligibility_rules": {
      "customer_segments": [],
      "min_purchase_amount": null,
      "stacking_allowed": false
    },
    "platform_sync": {
      "platform_name": "shopify",
      "price_rule_id": "pr_67890",
      "status": "synced"
    },
    "tenant_id": 1
  },
  "discount_rule": {
    "discount_type": "percentage",
    "discount_value": 20.00,
    "max_discount_amount": null,
    "apply_to": "line_item",
    "allocation_method": "each"
  },
  "eligible_products": [
    {
      "product_id": "prod_100",
      "inclusion_type": "include",
      "context": null
    },
    {
      "collection_id": "col_summer",
      "inclusion_type": "include",
      "context": null
    }
  ],
  "campaigns": [
    {
      "mkt_campaign_id": 6
    }
  ]
}
```

---

### 3. Discount to Orders - Fixed Amount (Auto Apply)

**Purpose:** Automatic fixed amount discount applied to entire order.

```json
{
  "promo": {
    "promo_code": "ORDER10OFF",
    "promo_name": "$10 Off Orders Over $100",
    "promo_type": "discount",
    "status": "active",
    "start_date": "2024-08-01T00:00:00Z",
    "end_date": "2024-08-31T23:59:59Z",
    "usage_limit_total": null,
    "usage_limit_per_customer": 3,
    "eligibility_rules": {
      "customer_segments": [],
      "min_purchase_amount": 100.00,
      "stacking_allowed": false
    },
    "platform_sync": {
      "platform_name": "shopify",
      "price_rule_id": "pr_11111",
      "status": "synced"
    },
    "tenant_id": 1
  },
  "discount_rule": {
    "discount_type": "fixed_amount",
    "discount_value": 10.00,
    "max_discount_amount": null,
    "apply_to": "order",
    "allocation_method": null
  },
  "eligible_products": [],
  "campaigns": [
    {
      "mkt_campaign_id": 7
    }
  ]
}
```

---

### 4. Discount to Orders - Percentage (Auto Apply)

**Purpose:** Automatic percentage discount applied to entire order.

```json
{
  "promo": {
    "promo_code": "ORDER15PCT",
    "promo_name": "15% Off All Orders",
    "promo_type": "discount",
    "status": "active",
    "start_date": "2024-09-01T00:00:00Z",
    "end_date": "2024-09-30T23:59:59Z",
    "usage_limit_total": 5000,
    "usage_limit_per_customer": null,
    "eligibility_rules": {
      "customer_segments": ["vip", "new"],
      "min_purchase_amount": 50.00,
      "stacking_allowed": false
    },
    "platform_sync": {
      "platform_name": "shopify",
      "price_rule_id": "pr_22222",
      "status": "synced"
    },
    "tenant_id": 1
  },
  "discount_rule": {
    "discount_type": "percentage",
    "discount_value": 15.00,
    "max_discount_amount": 50.00,
    "apply_to": "order",
    "allocation_method": null
  },
  "eligible_products": [],
  "campaigns": [
    {
      "mkt_campaign_id": 8
    }
  ]
}
```

---

### 5. Discount with Coupon Codes

**Purpose:** Discount that requires coupon code to apply.

```json
{
  "promo": {
    "promo_code": "BLACKFRIDAY",
    "promo_name": "Black Friday Sale - Code Required",
    "promo_type": "discount",
    "status": "active",
    "start_date": "2024-11-25T00:00:00Z",
    "end_date": "2024-11-30T23:59:59Z",
    "usage_limit_total": 10000,
    "usage_limit_per_customer": 1,
    "eligibility_rules": {
      "customer_segments": [],
      "min_purchase_amount": 200.00,
      "stacking_allowed": false
    },
    "platform_sync": {
      "platform_name": "shopify",
      "price_rule_id": "pr_33333",
      "status": "synced"
    },
    "tenant_id": 1
  },
  "discount_rule": {
    "discount_type": "percentage",
    "discount_value": 30.00,
    "max_discount_amount": 100.00,
    "apply_to": "order",
    "allocation_method": null
  },
  "codes": [
    {
      "code": "BF2024",
      "status": "active",
      "usage_limit": 5000,
      "usage_count": 0,
      "assigned_to_customer_id": null,
      "expires_at": "2024-11-30T23:59:59Z"
    }
  ],
  "eligible_products": [],
  "campaigns": [
    {
      "mkt_campaign_id": 9
    }
  ]
}
```

---

### 6. BOGO (Buy One Get One)

**Purpose:** Buy One Get One promotion with flexible product matching.

```json
{
  "promo": {
    "promo_code": "BOGO50",
    "promo_name": "Buy One Get One 50% Off",
    "promo_type": "bogo",
    "status": "active",
    "start_date": "2024-10-01T00:00:00Z",
    "end_date": "2024-10-31T23:59:59Z",
    "usage_limit_total": null,
    "usage_limit_per_customer": 5,
    "eligibility_rules": {
      "customer_segments": [],
      "min_purchase_amount": null,
      "stacking_allowed": false
    },
    "platform_sync": {
      "platform_name": "shopify",
      "price_rule_id": "pr_44444",
      "status": "synced"
    },
    "tenant_id": 1
  },
  "bogo_rule": {
    "buy_type": "quantity",
    "buy_quantity": 1,
    "buy_amount": null,
    "buy_product_rules": {
      "products": ["prod_200", "prod_201"],
      "collections": ["col_rings"],
      "match_type": "any"
    },
    "get_type": "same_product",
    "get_quantity": 1,
    "get_product_rules": {
      "discount_type": "percentage",
      "discount_value": 50
    },
    "max_applications_per_order": 3
  },
  "eligible_products": [
    {
      "product_id": "prod_200",
      "inclusion_type": "include",
      "context": "both"
    },
    {
      "collection_id": "col_rings",
      "inclusion_type": "include",
      "context": "both"
    }
  ],
  "campaigns": [
    {
      "mkt_campaign_id": 10
    }
  ]
}
```

---

### 7. Free Shipping

**Purpose:** Free shipping promotion.

```json
{
  "promo": {
    "promo_code": "FREESHIP",
    "promo_name": "Free Shipping on Orders Over $75",
    "promo_type": "free_shipping",
    "status": "active",
    "start_date": "2024-12-01T00:00:00Z",
    "end_date": "2024-12-31T23:59:59Z",
    "usage_limit_total": null,
    "usage_limit_per_customer": null,
    "eligibility_rules": {
      "customer_segments": [],
      "min_purchase_amount": 75.00,
      "stacking_allowed": false
    },
    "platform_sync": {
      "platform_name": "shopify",
      "price_rule_id": "pr_55555",
      "status": "synced"
    },
    "tenant_id": 1
  },
  "discount_rule": {
    "discount_type": "free_shipping",
    "discount_value": null,
    "max_discount_amount": null,
    "apply_to": "shipping",
    "allocation_method": null
  },
  "eligible_products": [],
  "campaigns": [
    {
      "mkt_campaign_id": 11
    }
  ]
}
```

---

### 8. Bundle Promotion

**Purpose:** Bundle/combo promotion - buy multiple products together at discount.

```json
{
  "promo": {
    "promo_code": "BUNDLE30",
    "promo_name": "Buy 3 Items Get 30% Off Bundle",
    "promo_type": "bundle",
    "status": "active",
    "start_date": "2024-11-01T00:00:00Z",
    "end_date": "2024-11-30T23:59:59Z",
    "usage_limit_total": null,
    "usage_limit_per_customer": 2,
    "eligibility_rules": {
      "customer_segments": [],
      "min_purchase_amount": null,
      "stacking_allowed": false
    },
    "platform_sync": {
      "platform_name": "shopify",
      "price_rule_id": "pr_66666",
      "status": "synced"
    },
    "tenant_id": 1
  },
  "bundle_rule": {
    "bundle_type": "quantity",
    "required_quantity": 3,
    "required_amount": null,
    "bundle_product_rules": {
      "products": ["prod_300", "prod_301", "prod_302"],
      "collections": ["col_jewelry"],
      "match_type": "any"
    },
    "discount_type": "percentage",
    "discount_value": 30.00,
    "max_discount_amount": 150.00,
    "min_items_in_bundle": 3,
    "max_items_in_bundle": null
  },
  "eligible_products": [
    {
      "product_id": "prod_300",
      "inclusion_type": "include",
      "context": null
    },
    {
      "collection_id": "col_jewelry",
      "inclusion_type": "include",
      "context": null
    }
  ],
  "campaigns": [
    {
      "mkt_campaign_id": 12
    }
  ]
}
```

---

## Integration Points

### Orders Integration
- **`promo_usage_history.order_id`** → `orders.id`
- Track which orders used which promotions
- Calculate discount amounts during order creation
- Store discount breakdown in `discount_breakdown` JSONB

### CRM Integration
- **`promo_codes.assigned_to_customer_id`** → `crm_customers.id`
- **`promo_usage_history.customer_id`** → `crm_customers.id`
- Customer-specific coupon codes
- Track customer promotion usage history

### Marketing Campaign Integration
- **`promo_campaigns`**: Junction table linking promotions to `mkt_campaigns`
- Many-to-many relationship: promotions can belong to multiple campaigns
- Campaigns can have multiple promotions
- No campaign-specific promotion settings (all logic in `promo` table)

### Platform Integration
- **`promo.platform_sync`**: Sync promotions to external platforms
- **`promo_codes.platform_sync`**: Sync codes to external platforms
- **`promo_usage_history.platform_order_id`**: Link to external platform orders
- **`promo_product_price_overrides`**: Direct price sync to platforms
- Generic JSONB structure supports multiple platforms

### Product Integration
- **`promo_product_price_overrides.product_id`**: Links to product catalog
- Direct price modification for product display
- Platform synchronization of sale prices
- Automatic price rollback when promotions end

### Multi-Tenancy
- **`promo.tenant_id`** → `sys_tenants.id`
- **`promo_usage_history.tenant_id`** → `sys_tenants.id`
- All queries must filter by `tenant_id` for proper isolation

---

## Notes

- **Hybrid Design:** 10-table design optimized for complex BOGO + <100 orders/day + No A/B Testing
- **Promotion vs Campaign:** `promo` table contains all promotion logic; `promo_campaigns` is junction table linking to `mkt_campaigns`
- **Platform-Agnostic:** Generic platform integration via JSONB, supports Shopify, WooCommerce, and others
- **Performance:** Separated tables (discount_rules, bogo_rules, bundle_rules, tiered_rules, price_overrides) improve query performance
- **Usage Tracking:** Complete redemption history with detailed breakdown in JSONB
- **Eligibility:** Flexible product eligibility with inclusions/exclusions and BOGO context
- **Advanced Eligibility:** `eligibility_rules` JSONB field allows UI to add any eligibility criteria without schema changes
- **Product Price Overrides:** Direct product price modification via `promo_product_price_overrides` table
- **Price Rollback:** Original prices stored for automatic restoration when promotions end
- **Multi-Tenancy:** All tables support tenant isolation via `tenant_id`
- **JSONB Usage:** Use GIN indexes on JSONB columns (`eligibility_rules`, `platform_sync`, `discount_breakdown`) for efficient querying
- **Code Management:** Individual coupon codes with usage limits and customer assignments
- **Promotion Lifecycle:** Status management (draft, active, paused, expired, archived)
- **Date Ranges:** Promotion start/end dates and code expiration dates
- **Cascade Deletes:** Rules, codes, and overrides cascade delete when promotion is deleted
- **Campaign Association:** Many-to-many relationship between promotions and marketing campaigns via `promo_campaigns` junction table

