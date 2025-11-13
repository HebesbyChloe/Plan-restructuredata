# Orders Domain Schema

## Overview
This document provides a complete skeleton map and detailed listing of all orders-related tables in the ERP system. The Orders Domain manages order headers, line items, item-level customizations, pre-orders, payments, after-sales services, and their relationships with customers, addresses, shipments, and inventory.

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
│                      ORDERS DOMAIN SCHEMA                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         orders                                    │
│  ────────────────────────────────────────────────────────────  │
│  • Order headers (central table)                                │
│  • Tracks: status, payment, shipping, totals                     │
│  • Links to: customers, addresses, tenants                       │
│  • Unique: external_order_id (if applicable)                     │
└─────────────────────────────────────────────────────────────────┘
         │
         ├─── 1:N ────► order_items
         ├─── 1:1 ────► orders_meta
         ├─── 1:1 ────► order_meta_crm
         ├─── 1:N ────► order_images
         ├─── 1:N ────► order_payments
         ├─── N:1 ────► crm_customers (id_customer)
         ├─── N:1 ────► crm_personal_addresses (shipping_address_id)
         ├─── N:1 ────► crm_personal_addresses (billing_address_id)
         ├─── N:1 ────► sys_tenants (tenant_id)
         ├─── M:N ────► fulfilment_shipments (via shipment_orders)
         └─── 1:N ────► logistic_items (by order_id)


┌─────────────────────────────────────────────────────────────────┐
│                      order_items                                  │
│  ────────────────────────────────────────────────────────────  │
│  • Normalized order line items                                  │
│  • Links to: orders, products (via product_id)                  │
└─────────────────────────────────────────────────────────────────┘
         │
         ├─── N:1 ────► orders
         ├─── 1:N ────► order_item_pre_orders
         ├─── 1:1 ────► order_item_customization
         ├─── 1:N ────► order_items_after_sales
         └─── 1:N ────► inv_movements (via order_line_item_id)


┌─────────────────────────────────────────────────────────────────┐
│                    order_payments                                  │
│  ────────────────────────────────────────────────────────────  │
│  • Order payment transactions                                   │
│  • Tracks: payment method, amount, status, dates                 │
│  • Supports deposits and installments                           │
│  • Unique: transaction_id (when provided)                        │
│  • Status: 'pending', 'paid', 'failed', 'refunded'              │
└─────────────────────────────────────────────────────────────────┘
         │
         └─── N:1 ────► orders (CASCADE on delete)


┌─────────────────────────────────────────────────────────────────┐
│              order_items_after_sales                              │
│  ────────────────────────────────────────────────────────────  │
│  • After-sales service cases (returns, repairs)                 │
│  • Tracks: RMA codes, tracking, status                         │
└─────────────────────────────────────────────────────────────────┘
         │
         ├─── N:1 ────► order_items (order_item_id)
         └─── N:1 ────► order_items (original_order_item_id, optional)


┌─────────────────────────────────────────────────────────────────┐
│              order_item_pre_orders                                │
│  ────────────────────────────────────────────────────────────  │
│  • Pre-order records tied to an order item                      │
│  • Tracks: category, vendor, hold dates                         │
└─────────────────────────────────────────────────────────────────┘
         │
         └─── N:1 ────► order_items


┌─────────────────────────────────────────────────────────────────┐
│            order_item_customization                               │
│  ────────────────────────────────────────────────────────────  │
│  • Custom item-level workflow for bespoke jobs                  │
│  • Tracks: design, material, completion, payment status         │
└─────────────────────────────────────────────────────────────────┘
         │
         ├─── N:1 ────► order_items
         ├─── N:1 ────► payment_statuses (payment_status)
         ├─── N:1 ────► design_statuses (design_status)
         ├─── N:1 ────► material_statuses (material_status)
         └─── N:1 ────► completion_statuses (completion_status)


┌─────────────────────────────────────────────────────────────────┐
│                      orders_meta                                   │
│  ────────────────────────────────────────────────────────────  │
│  • Order metadata (1:1 with orders)                             │
│  • Extended order information                                    │
└─────────────────────────────────────────────────────────────────┘
         │
         └─── 1:1 ────► orders


┌─────────────────────────────────────────────────────────────────┐
│                    order_meta_crm                                  │
│  ────────────────────────────────────────────────────────────  │
│  • CRM metadata for orders (1:1 with orders)                    │
│  • Tracks: sales staff, source, feedback, follow-up            │
└─────────────────────────────────────────────────────────────────┘
         │
         ├─── 1:1 ────► orders (id is PRIMARY KEY)
         ├─── N:1 ────► channels_platform_pages (source_pancake_id)
         ├─── N:1 ────► hr_staff (sales_staff_id)
         └─── N:1 ────► hr_staff (referrer_staff_id)


┌─────────────────────────────────────────────────────────────────┐
│                      order_images                                 │
│  ────────────────────────────────────────────────────────────  │
│  • Order images/attachments                                      │
│  • Tracks: image URLs, types, descriptions                      │
└─────────────────────────────────────────────────────────────────┘
         │
         └─── N:1 ────► orders


┌─────────────────────────────────────────────────────────────────┐
│                    REFERENCED TABLES (External)                    │
│  ────────────────────────────────────────────────────────────  │
│  • crm_customers          - Customer records                    │
│  • crm_personal_addresses - Shipping/billing addresses           │
│  • sys_tenants            - Tenant management                    │
│  • fulfilment_shipments   - Shipment records                     │
│  • shipment_orders        - Bridge: orders ↔ shipments         │
│  • channels_platform_pages - Platform pages                      │
│    - Referenced by order_meta_crm (source_pancake_id)            │
│  • hr_staff               - Staff/employee records               │
│    - Referenced by order_meta_crm (sales_staff_id, referrer_staff_id) │
│  • stores                 - Store locations                     │
│  • payment_methods        - Payment method catalog              │
│  • inv_movements          - Inventory movements                  │
│  • logistic_items         - Logistics items                      │
│  • payment_statuses       - Payment status lookup               │
│  • design_statuses        - Design status lookup                │
│  • material_statuses      - Material status lookup               │
│  • completion_statuses    - Completion status lookup             │
│  • customization_statuses - Customization status lookup         │
│  • payment_methods        - Payment method catalog
│  • service_statuses       - Service status lookup               │
│  • return_statuses        - Return status lookup                │
└─────────────────────────────────────────────────────────────────┘


Relationship Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Core Order Flow:
  orders 1──N order_items

Status Lookups:
  order_item_customization → multiple status lookups (FKs)

Related Records:
  orders 1──N order_payments
  orders 1──1 orders_meta
  orders 1──1 order_meta_crm
  orders 1──N order_images

Item-Level Records:
  order_items 1──N order_item_pre_orders
  order_items 1──1 order_item_customization
  order_items 1──N order_items_after_sales

External Relationships:
  orders N──1 crm_customers
  orders N──1 crm_personal_addresses (shipping)
  orders N──1 crm_personal_addresses (billing)
  orders N──1 sys_tenants
  orders M──N fulfilment_shipments (via shipment_orders)
  orders 1──N logistic_items

Inventory Integration:
  order_items 1──N inv_movements (via order_line_item_id)
```

---

## Table Details

### 1. `orders`
**Purpose:** Order headers - the central table for all order information.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGINT | PRIMARY KEY, GENERATED BY DEFAULT AS IDENTITY | Auto-incrementing primary key |
| `status` | VARCHAR | NOT NULL | Order status |
| `date_created` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Order creation timestamp |
| `total` | NUMERIC | NULL | Total order amount |
| `id_customer` | BIGINT | NULL, FK → `crm_customers(id)` | 🔗 Customer who placed order |
| `shipping_address_id` | BIGINT | NULL, FK → `crm_personal_addresses(id)` | 🔗 Shipping address |
| `billing_address_id` | BIGINT | NULL, FK → `crm_personal_addresses(id)` | 🔗 Billing address |
| `external_order_id` | TEXT | NULL | External system order ID |
| `source_platform` | VARCHAR | NULL | Source platform (e.g., 'shopify', 'woocommerce') |
| `tenant_id` | INTEGER | NOT NULL, FK → `sys_tenants(id)` | 🔗 Multi-tenant support |
| `customer_notes` | TEXT | NULL | Customer-provided notes |

**Foreign Keys:**
- `id_customer` → `crm_customers(id)`
- `shipping_address_id` → `crm_personal_addresses(id)`
- `billing_address_id` → `crm_personal_addresses(id)`
- `tenant_id` → `sys_tenants(id)`

**Indexes:**
- `idx_orders_tenant_id(tenant_id)` - Tenant filtering
- `idx_orders_status(status)` - Status filtering
- `idx_orders_customer(id_customer)` - Customer lookup
- `idx_orders_date_created(date_created)` - Time-series queries
- `idx_orders_external_order_id(external_order_id)` - External order lookup

**Use Cases:**
- Order management and tracking
- Customer order history
- Multi-platform order aggregation
- Financial reporting
- Shipping and delivery tracking

---

### 2. `order_items`
**Purpose:** Normalized order line items - individual products/services in an order.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | INTEGER | PRIMARY KEY, GENERATED BY DEFAULT AS IDENTITY | Auto-incrementing primary key |
| `order_id` | BIGINT | NOT NULL, FK → `orders(id)` | 🔗 Parent order |
| `product_id` | VARCHAR | NULL | Product identifier (temporary SKU-like) |
| `line_item_id` | VARCHAR | NULL | External line item ID |
| `status` | INTEGER | NULL | Item status |
| `quantity` | INTEGER | NOT NULL, DEFAULT 1 | Quantity ordered |
| `unit_price` | NUMERIC | NOT NULL | Price per unit |
| `total_price` | NUMERIC | NOT NULL | Total line price (quantity × unit_price) |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Creation timestamp |

**Foreign Keys:**
- `order_id` → `orders(id)` ON DELETE CASCADE (recommended)

**Indexes:**
- `idx_order_items_order_id(order_id)` - Order lookup
- `idx_order_items_product_id(product_id)` - Product lookup

**Use Cases:**
- Order line item management
- Product sales analysis
- Inventory allocation
- Pricing calculations

---

### 3. `order_items_after_sales`
**Purpose:** After-sales service cases including returns, repairs, and exchanges at item level.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | INTEGER | PRIMARY KEY, GENERATED BY DEFAULT AS IDENTITY | Auto-incrementing primary key |
| `order_item_id` | INTEGER | NOT NULL, FK → `order_items(id)` | 🔗 Related order item |
| `original_order_item_id` | INTEGER | NULL, FK → `order_items(id)` | 🔗 Original order item (if different from order_item_id) |
| `case_type` | VARCHAR | NULL | Case type (e.g., 'return', 'repair', 'exchange') |
| `status` | INTEGER | NULL | Status (FK candidate to `service_statuses.id` or `return_statuses.id`) |
| `rma_code` | VARCHAR | NULL | Return Merchandise Authorization code |
| `amount` | NUMERIC | NULL | Refund/replacement amount |
| `tracking_number` | VARCHAR | NULL | Return tracking number |
| `status_tracking` | VARCHAR | NULL | Tracking status |
| `reason` | TEXT | NULL | Reason for return/service |
| `details` | TEXT | NULL | Additional details |
| `received_date` | DATE | NULL | Date item was received |
| `inquiry_date` | DATE | NULL | Date inquiry was made |
| `updated_by` | INTEGER | NULL | User who last updated |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Creation timestamp |

**Foreign Keys:**
- `order_item_id` → `order_items(id)`
- `original_order_item_id` → `order_items(id)` (optional cross-link)

**Indexes:**
- `idx_item_after_sales_order_item_id(order_item_id)` - Order item lookup
- `idx_item_after_sales_status(status)` - Status filtering
- `UNIQUE(rma_code)` - If business requires unique RMA codes

**Use Cases:**
- Return management at item level
- Repair tracking per item
- Exchange processing per item
- Customer service case management per item

---

### 4. `order_item_pre_orders`
**Purpose:** Pre-order records tied to order items - tracks items that are ordered but not yet available.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | INTEGER | PRIMARY KEY, GENERATED BY DEFAULT AS IDENTITY | Auto-incrementing primary key |
| `order_item_id` | INTEGER | NOT NULL, FK → `order_items(id)` | 🔗 Parent order item |
| `category` | VARCHAR | NULL | Pre-order category |
| `vendor` | VARCHAR | NULL | Vendor/supplier |
| `hold_until` | DATE | NULL | Date to hold order until |
| `processing_date` | DATE | NULL | Processing date |
| `reason` | TEXT | NULL | Reason for pre-order |
| `notes` | TEXT | NULL | Additional notes |
| `updated_by` | INTEGER | NULL | User who last updated |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Last update timestamp |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Creation timestamp |

**Foreign Keys:**
- `order_item_id` → `order_items(id)`

**Indexes:**
- `idx_item_pre_orders_order_item_id(order_item_id)` - Order item lookup
- `idx_item_pre_orders_hold_until(hold_until)` - Date-based queries

**Use Cases:**
- Pre-order management at item level
- Backorder tracking per item
- Vendor coordination per item
- Release date management per item

---

### 5. `order_item_customization`
**Purpose:** Custom item-level workflow and billing for bespoke/custom-made jobs.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | INTEGER | PRIMARY KEY, GENERATED BY DEFAULT AS IDENTITY | Auto-incrementing primary key |
| `order_item_id` | INTEGER | NOT NULL, UNIQUE, FK → `order_items(id)` | 🔗 🔒 Custom order item (1:1) |
| `actual_amount` | NUMERIC | NULL | Actual item amount |
| `balance_due` | NUMERIC | NULL | Remaining balance |
| `payment_status` | INTEGER | NULL, FK → `payment_statuses.id` | 🔗 Payment status (recommended FK) |
| `design_3d_image` | VARCHAR | NULL | 3D design image path |
| `design_status` | INTEGER | NULL, FK → `design_statuses.id` | 🔗 Design status (recommended FK) |
| `design_time` | TIMESTAMPTZ | NULL | ⏰ Design completion time |
| `material_status` | INTEGER | NULL, FK → `material_statuses.id` | 🔗 Material status (recommended FK) |
| `material_time` | TIMESTAMPTZ | NULL | ⏰ Material ready time |
| `completion_status` | INTEGER | NULL, FK → `completion_statuses.id` | 🔗 Completion status (recommended FK) |
| `completion_time` | TIMESTAMPTZ | NULL | ⏰ Completion time |
| `ship_date` | DATE | NULL | Scheduled ship date |
| `check_status` | VARCHAR | NULL | Quality check status |
| `third_party_brand` | VARCHAR | NULL | Third-party brand if applicable |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Last update timestamp |

**Foreign Keys:**
- `order_item_id` → `order_items(id)` (1:1 relationship)
- `payment_status` → `payment_statuses(id)` (recommended FK)
- `design_status` → `design_statuses(id)` (recommended FK)
- `material_status` → `material_statuses.id` (recommended FK)
- `completion_status` → `completion_statuses.id` (recommended FK)

**Unique Constraints:**
- `order_item_id` (one customization record per order item)

**Indexes:**
- `UNIQUE(order_item_id)` - Ensure 1:1 relationship
- `idx_item_customization_statuses(payment_status, design_status, material_status, completion_status)` - Status filtering

**Use Cases:**
- Custom jewelry/artwork items
- Bespoke product manufacturing per item
- Multi-stage workflow tracking per item
- Design approval process per item
- Material procurement tracking per item

---

### 6. `orders_meta`
**Purpose:** Order metadata - extended information in a 1:1 relationship with orders.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | INTEGER | PRIMARY KEY, GENERATED BY DEFAULT AS IDENTITY | Auto-incrementing primary key |
| `order_id` | BIGINT | NOT NULL, UNIQUE, FK → `orders(id)` | 🔗 🔒 Related order (1:1) |
| `metadata` | JSONB | DEFAULT '{}'::jsonb | Flexible metadata storage |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Last update timestamp |

**Foreign Keys:**
- `order_id` → `orders(id)` (1:1 relationship)

**Unique Constraints:**
- `order_id` (one metadata record per order)

**Indexes:**
- `UNIQUE(order_id)` - Ensure 1:1 relationship
- `CREATE INDEX idx_orders_meta_metadata_gin ON orders_meta USING gin (metadata);` - JSONB querying

**Use Cases:**
- Extended order information
- Platform-specific metadata
- Custom fields storage
- Integration data

---

### 7. `order_meta_crm`
**Purpose:** CRM metadata for orders - tracks sales staff, source, feedback, and follow-up status in a 1:1 relationship with orders.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGINT | PRIMARY KEY, FK → `orders(id)` | 🔗 🔒 Related order (1:1, PK) |
| `source_pancake_id` | INTEGER | NULL, FK → `channels_platform_pages(id)` | 🔗 Source platform page |
| `sales_staff_id` | INTEGER | NULL, FK → `hr_staff(id)` | 🔗 Staff who closed the order |
| `referrer_staff_id` | INTEGER | NULL, FK → `hr_staff(id)` | 🔗 Staff who referred/introduced |
| `support_by` | VARCHAR | NULL | Support staff identifier |
| `social_review` | TEXT | NULL | Social media review/rating |
| `customer_feedback` | TEXT | NULL | Customer feedback |
| `follow_up_status` | VARCHAR | NULL | Follow-up status |
| `approval_status` | VARCHAR | NULL | Approval status |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Last update timestamp |

**Foreign Keys:**
- `id` → `orders(id)` (1:1 relationship, PRIMARY KEY)
- `source_pancake_id` → `channels_platform_pages(id)` (recommended FK)
- `sales_staff_id` → `hr_staff(id)` (recommended FK)
- `referrer_staff_id` → `hr_staff(id)` (recommended FK)

**Indexes:**
- `idx_order_meta_crm_source_pancake_id(source_pancake_id)` - Source page lookup 📊
- `idx_order_meta_crm_sales_staff_id(sales_staff_id)` - Sales staff lookup 📊
- `idx_order_meta_crm_referrer_staff_id(referrer_staff_id)` - Referrer lookup 📊
- `idx_order_meta_crm_follow_up_status(follow_up_status)` - Follow-up status filtering 📊
- `idx_order_meta_crm_approval_status(approval_status)` - Approval status filtering 📊

**Use Cases:**
- Sales staff tracking and commission calculation
- Source tracking (platform pages, marketing channels)
- Customer feedback and review management
- Follow-up workflow management
- Approval workflow tracking

---

### 8. `order_images`
**Purpose:** Order images and attachments - stores image URLs and metadata for orders.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | INTEGER | PRIMARY KEY, GENERATED BY DEFAULT AS IDENTITY | Auto-incrementing primary key |
| `order_id` | BIGINT | NOT NULL, FK → `orders(id)` | 🔗 Related order |
| `image_url` | VARCHAR | NOT NULL | Image file URL/path |
| `image_type` | VARCHAR | NULL | Image type (e.g., 'receipt', 'product', 'custom') |
| `description` | TEXT | NULL | Image description |
| `sort_order` | INTEGER | NULL, DEFAULT 0 | Display order |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Creation timestamp |

**Foreign Keys:**
- `order_id` → `orders(id)` ON DELETE CASCADE (recommended)

**Indexes:**
- `idx_order_images_order_id(order_id)` - Order lookup 📊
- `idx_order_images_image_type(image_type)` - Type filtering 📊

**Use Cases:**
- Order receipt storage
- Product images for custom orders
- Customer-provided images
- Documentation attachments

---

### 9. `order_payments`
**Purpose:** Order payment transactions - tracks individual payment records for orders, supporting deposits, installments, and multiple payment methods.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY, GENERATED BY DEFAULT AS IDENTITY | Auto-incrementing primary key |
| `order_id` | BIGINT | NOT NULL, FK → `orders(id)` ON DELETE CASCADE | 🔗 Parent order (CASCADE on delete) |
| `payment_method` | VARCHAR(100) | NOT NULL | Payment method (e.g., 'credit_card', 'paypal', 'bank_transfer') |
| `amount` | NUMERIC(12,2) | NOT NULL, CHECK (amount > 0) | ✅ Payment amount (must be positive) |
| `status` | VARCHAR(50) | NOT NULL, DEFAULT 'pending', CHECK | ✅ Payment status: 'pending', 'paid', 'failed', 'refunded' |
| `transaction_id` | VARCHAR(300) | NOT NULL, DEFAULT '' | External transaction ID from payment gateway |
| `due_date` | TIMESTAMPTZ | NULL | ⏰ Payment due date |
| `paid_date` | TIMESTAMPTZ | NULL | ⏰ Payment completion date |
| `is_deposit` | BOOLEAN | NOT NULL, DEFAULT false | Whether this is a deposit payment |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Last update timestamp (auto-updated via trigger) |

**Check Constraints:**
- `amount > 0` - Payment amount must be positive
- `status IN ('pending','paid','failed','refunded')` - Valid status values
- `paid_date IS NULL OR due_date IS NULL OR paid_date >= due_date` - Paid date cannot be before due date

**Foreign Keys:**
- `order_id` → `orders(id)` ON DELETE CASCADE (payments deleted when order is deleted)

**Unique Constraints:**
- `uq_order_payment_transaction_id_nonempty(transaction_id) WHERE transaction_id <> ''` - Unique transaction IDs when provided

**Indexes:**
- `idx_order_payment_order_id(order_id)` - Order lookup 📊
- `idx_order_payment_status(status)` - Status filtering 📊
- `idx_order_payment_transaction_id(transaction_id)` - Transaction lookup 📊
- `idx_order_payment_paid_date(paid_date)` - Date-based queries 📊
- `idx_order_payment_order_status(order_id, status)` - Composite: order + status 📊
- `idx_order_payment_order_paid_date(order_id, paid_date DESC)` - Composite: order + paid date 📊
- `uq_order_payment_transaction_id_nonempty(transaction_id) WHERE transaction_id <> ''` - Unique transaction IDs 📊

**Triggers:**
- `trg_order_payments_set_updated_at` - Automatically updates `updated_at` on row update

**Use Cases:**
- Track individual payment transactions for orders
- Support multiple payments per order (installments)
- Deposit and final payment tracking
- Payment status monitoring
- Transaction reconciliation
- Payment gateway integration

**Payment Workflow:**
- **Pending:** Payment initiated but not completed
- **Paid:** Payment successfully completed
- **Failed:** Payment attempt failed
- **Refunded:** Payment was refunded

**Design Notes:**
- Supports multiple payments per order (installments, deposits)
- `is_deposit` flag distinguishes deposits from final payments
- `transaction_id` links to external payment gateway records
- `due_date` and `paid_date` support payment scheduling and tracking
- CASCADE delete ensures payments are removed with order

---

## Relationships Summary

### Core Order Flow

1. **`orders` → `order_items`** (One-to-Many)
   - One order has many line items
   - `order_items.order_id` → `orders.id`
   - **CASCADE:** Deleting an order should delete its items (recommended)

### Status Relationships

2. **`order_item_customization` → Multiple Status Lookups**
   - `payment_status` → `payment_statuses.id`
   - `design_status` → `design_statuses.id`
   - `material_status` → `material_statuses.id`
   - `completion_status` → `completion_statuses.id`

### Related Records

3. **`orders` → `order_payments`** (One-to-Many)
   - One order can have multiple payment transactions
   - `order_payments.order_id` → `orders.id`
   - **CASCADE:** Deleting an order deletes all its payments

4. **`orders` → `orders_meta`** (One-to-One)
   - One order has one metadata record
   - `orders_meta.order_id` → `orders.id` (UNIQUE)

5. **`orders` → `order_meta_crm`** (One-to-One)
   - One order has one CRM metadata record
   - `order_meta_crm.id` → `orders.id` (PRIMARY KEY)

6. **`orders` → `order_images`** (One-to-Many)
   - One order can have multiple images
   - `order_images.order_id` → `orders.id`
   - **CASCADE:** Deleting an order deletes all its images

### Item-Level Records

7. **`order_items` → `order_item_pre_orders`** (One-to-Many)
   - One order item can have multiple pre-order records
   - `order_item_pre_orders.order_item_id` → `order_items.id`

8. **`order_items` → `order_item_customization`** (One-to-One)
   - One order item can have one customization record
   - `order_item_customization.order_item_id` → `order_items.id` (UNIQUE)

9. **`order_items` → `order_items_after_sales`** (One-to-Many)
   - One order item can have multiple after-sales cases
   - `order_items_after_sales.order_item_id` → `order_items.id`
   - Optional: `order_items_after_sales.original_order_item_id` → `order_items.id`

### External Relationships

10. **`orders` → `crm_customers`** (Many-to-One)
    - Many orders belong to one customer
    - `orders.id_customer` → `crm_customers.id`

11. **`orders` → `crm_personal_addresses`** (Many-to-One, Two Relationships)
    - Shipping address: `orders.shipping_address_id` → `crm_personal_addresses.id`
    - Billing address: `orders.billing_address_id` → `crm_personal_addresses.id`

12. **`orders` → `sys_tenants`** (Many-to-One)
    - Many orders belong to one tenant
    - `orders.tenant_id` → `sys_tenants.id`

13. **`orders` ↔ `fulfilment_shipments`** (Many-to-Many)
    - Bridge table: `shipment_orders`
    - One order can have multiple shipments
    - One shipment can contain multiple orders

14. **`orders` → `logistic_items`** (One-to-Many)
    - One order can have multiple logistics items
    - `logistic_items.order_id` → `orders.id`

15. **`order_meta_crm` → `channels_platform_pages`** (Many-to-One)
    - Source page: `order_meta_crm.source_pancake_id` → `channels_platform_pages.id`

16. **`order_meta_crm` → `hr_staff`** (Many-to-One, Two Relationships)
    - Sales staff: `order_meta_crm.sales_staff_id` → `hr_staff.id`
    - Referrer staff: `order_meta_crm.referrer_staff_id` → `hr_staff.id`

### Inventory Integration

17. **`order_items` → `inv_movements`** (One-to-Many)
    - One order item can have multiple inventory movements
    - `inv_movements.order_line_item_id` → `order_items.id`


---

## Index Recommendations

### `orders`
- `idx_orders_tenant_id(tenant_id)` - Tenant filtering 📊
- `idx_orders_status(status)` - Status filtering 📊
- `idx_orders_customer(id_customer)` - Customer lookup 📊
- `idx_orders_date_created(date_created)` - Time-series queries 📊
- `idx_orders_external_order_id(external_order_id)` - External order lookup 📊
- `idx_orders_source_platform(source_platform)` - Platform filtering
- Composite: `(tenant_id, status, date_created)` - Common query pattern

### `order_items`
- `idx_order_items_order_id(order_id)` - Order lookup 📊
- `idx_order_items_product_id(product_id)` - Product lookup 📊

### `order_items_after_sales`
- `idx_item_after_sales_order_item_id(order_item_id)` - Order item lookup 📊
- `idx_item_after_sales_status(status)` - Status filtering 📊
- `UNIQUE(rma_code)` - If business requires uniqueness

### `order_item_pre_orders`
- `idx_item_pre_orders_order_item_id(order_item_id)` - Order item lookup 📊
- `idx_item_pre_orders_hold_until(hold_until)` - Date-based queries

### `order_item_customization`
- `UNIQUE(order_item_id)` - Already defined 📊
- `idx_item_customization_statuses(payment_status, design_status, material_status, completion_status)` - Status filtering 📊

### `orders_meta`
- `UNIQUE(order_id)` - Already defined 📊
- `CREATE INDEX idx_orders_meta_metadata_gin ON orders_meta USING gin (metadata);` - JSONB querying 📊

### `order_meta_crm`
- `id` is PRIMARY KEY 📊
- `idx_order_meta_crm_source_pancake_id(source_pancake_id)` - Source page lookup 📊
- `idx_order_meta_crm_sales_staff_id(sales_staff_id)` - Sales staff lookup 📊
- `idx_order_meta_crm_referrer_staff_id(referrer_staff_id)` - Referrer lookup 📊
- `idx_order_meta_crm_follow_up_status(follow_up_status)` - Follow-up status filtering 📊
- `idx_order_meta_crm_approval_status(approval_status)` - Approval status filtering 📊

### `order_images`
- `idx_order_images_order_id(order_id)` - Order lookup 📊
- `idx_order_images_image_type(image_type)` - Type filtering 📊

### `order_payments`
- `idx_order_payment_order_id(order_id)` - Order lookup 📊
- `idx_order_payment_status(status)` - Status filtering 📊
- `idx_order_payment_transaction_id(transaction_id)` - Transaction lookup 📊
- `idx_order_payment_paid_date(paid_date)` - Date-based queries 📊
- `idx_order_payment_order_status(order_id, status)` - Composite: order + status 📊
- `idx_order_payment_order_paid_date(order_id, paid_date DESC)` - Composite: order + paid date 📊
- `uq_order_payment_transaction_id_nonempty(transaction_id) WHERE transaction_id <> ''` - Unique transaction IDs 📊

### Tenant Filtering
- Add `idx_{table}_tenant_id(tenant_id)` to any table that has `tenant_id` column

### Time-Series Indexes
- Add indexes on `date_created`/`created_at` on all high-volume tables for range queries

---

## Design Considerations

### Order Lifecycle

1. **Status Management:**
   - `orders.status` stored as VARCHAR
   - Consider status workflow/state machine

2. **Pre-Order Workflow:**
   - `order_item_pre_orders` table for item-level pre-order management

### Data Integrity

1. **Recommended Foreign Keys:**
   - `order_items.order_id` → `orders(id)` ON DELETE CASCADE
   - `order_item_pre_orders.order_item_id` → `order_items(id)` ON DELETE CASCADE
   - `order_item_customization.order_item_id` → `order_items(id)` ON DELETE CASCADE
   - `order_items_after_sales.order_item_id` → `order_items(id)` ON DELETE CASCADE
   - `order_item_customization` → all status lookup tables

2. **Cascade Behaviors:**
   - Order deletion should cascade to items
   - Item deletion should cascade to pre-orders, customizations, and after-sales
   - Consider business rules for after-sales (may need RESTRICT)

3. **Unique Constraints:**
   - `orders.external_order_id` + `orders.source_platform` + `orders.tenant_id` (composite unique)
   - `order_items_after_sales.rma_code` (if business requires uniqueness)

### Multi-Tenancy

1. **Tenant Isolation:**
   - `orders.tenant_id` provides tenant context
   - All queries should filter by `tenant_id`
   - Consider adding `tenant_id` to child tables if needed for performance

2. **RLS Policies:**
   - Row-level security should filter by `tenant_id`
   - Users can only access orders for their tenant

### Performance

1. **JSONB Properties:**
   - Use GIN indexes for JSONB columns that are queried
   - Consider materialized views for complex aggregations

2. **Time-Series Queries:**
   - Index `date_created`/`created_at` on all tables
   - Consider partitioning large tables by date

3. **Materialized Views:**
   - `order_summaries`: Orders with current status, totals, flags
   - `order_item_rollups`: Aggregated quantities and prices by order

### External Order Integration

1. **External Order Tracking:**
   - `external_order_id` and `source_platform` for multi-platform support
   - Consider composite unique constraint
   - Index for fast lookups

2. **Platform-Specific Data:**
   - Store in `orders_meta.metadata` JSONB
   - Use GIN index for querying

---

## Integration Points

### CRM Integration
- **Customers:** `orders.id_customer` → `crm_customers.id`
- **Addresses:** `orders.shipping_address_id` and `billing_address_id` → `crm_personal_addresses.id`
- Use for customer order history and address management

### Fulfillment Integration
- **Shipments:** `orders` ↔ `fulfilment_shipments` via `shipment_orders` bridge table
- One order can have multiple shipments (split shipments)
- One shipment can contain multiple orders (consolidation)

### Inventory Integration
- **Movements:** `order_items` → `inv_movements` via `order_line_item_id`
- Tracks inventory allocation and fulfillment
- Reverse link from inventory to orders

### Payment Integration
- **Payment Status:** `order_item_customization.payment_status` → `payment_statuses.id`
- Track payment statuses at item level

### Logistics Integration
- **Logistics Items:** `orders` → `logistic_items` via `order_id`
- Track logistics and shipping details

### System Integration
- **Tenants:** `orders.tenant_id` → `sys_tenants.id`
- Multi-tenant isolation and data segregation

### CRM Integration
- **Source Tracking:** `order_meta_crm.source_pancake_id` → `channels_platform_pages.id` (platform pages)
- **Staff Tracking:** `order_meta_crm.sales_staff_id` → `hr_staff.id` (sales staff)
- **Referrer Tracking:** `order_meta_crm.referrer_staff_id` → `hr_staff.id` (referrer staff)
- Sales performance tracking
- Commission calculation
- Source attribution

### Media Integration
- **Order Images:** `order_images` stores images and attachments for orders
- Supports multiple images per order
- Image type categorization
- Sort order for display

---

## Notes

- **Cascade Deletes:** Implement CASCADE on `order_items` when order is deleted, and on item-level tables when item is deleted
- **JSONB Usage:** Use GIN indexes on JSONB columns (`metadata`) for efficient querying
- **External Orders:** `external_order_id` + `source_platform` enables multi-platform order aggregation
- **Pre-Orders:** `order_item_pre_orders` table for item-level pre-order management
- **Customization Workflow:** Multi-stage workflow with separate status tracking for design, material, completion at item level
- **After-Sales:** Supports returns, repairs, exchanges with RMA code tracking at item level
- **CRM Metadata:** `order_meta_crm` table tracks sales staff, source, feedback, and follow-up status at order level (id is PRIMARY KEY, references orders.id)
- **Order Images:** `order_images` table stores images and attachments for orders
- **Materialized Views:** Consider creating materialized views for order summaries and rollups for analytics
- **Tenant Isolation:** All queries must filter by `tenant_id` for proper multi-tenant data isolation

