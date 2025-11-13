# Shipment & Logistics

## Overview
This document shows the Shipment & Logistics schema structure with data types, foreign keys, and change indicators. This module tracks complete logistics operations including inbound shipments (from vendors), outbound shipments (to customers), individual items within shipments, and vendor/supplier information management.

**Legend:**
- 🆕 **NEW** - Newly created tables
- 🔄 **NORMALIZED** - Comma-separated values moved to junction tables
- 🗑️ **REMOVED** - Fields/tables removed or consolidated
- ✏️ **RENAMED** - Table/column renamed
- 📊 **DENORMALIZED** - Denormalized for performance (if any)

---

## Core Tables

#### `logistic_inbounds` 🆕
**Status**: Inbound shipment tracking and logistics management

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | SERIAL | PRIMARY KEY | Auto-incrementing unique identifier |
| `code` | VARCHAR(255) | NOT NULL, UNIQUE | 🆕 Unique shipment code/identifier |
| `outbound_code` | VARCHAR(255) | NULL | 🆕 Reference to related outbound shipment code |
| `hub_id` | INTEGER | NULL | 🆕 Hub/warehouse identifier where shipment is received |
| `location_id` | INTEGER | NULL | 🆕 Specific location within hub/warehouse |
| `vendor_id` | INTEGER | NULL | 🆕 Vendor/supplier identifier |
| `status` | INTEGER | NULL | 🆕 Shipment status (e.g., 0=pending, 1=in_transit, 2=arrived, 3=received, 4=cancelled) |
| `tracking_number` | VARCHAR(255) | NULL | 🆕 Carrier tracking number for shipment |
| `ship_date` | DATE | NULL | 🆕 Date when shipment was sent/dispatched |
| `estimated_arrival_date` | DATE | NULL | 🆕 Expected arrival date |
| `arrived_date` | DATE | NULL | 🆕 Actual arrival date |
| `images` | TEXT[] | NULL | 🆕 Array of image URLs/paths for shipment documentation |
| `notes` | TEXT | NULL | 🆕 Additional notes and comments |
| `updated_by` | INTEGER | NULL | 🆕 Staff/user ID who last updated the record |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 🆕 Last update timestamp |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 🆕 Record creation timestamp |
| `tenant_id` | INTEGER | NOT NULL, DEFAULT 1 | FK → `sys_tenants.id` - Multi-tenant support |

**Foreign Keys:**
- `tenant_id` → `sys_tenants(id)` ON DELETE CASCADE

**Indexes:**
- `idx_inbound_shipments_code` (on `code`) - For quick lookup by shipment code
- `idx_inbound_shipments_status` (on `status`) - For filtering by status
- `idx_inbound_shipments_vendor` (on `vendor_id`) - For vendor-based queries
- `idx_inbound_shipments_tenant` (on `tenant_id`) - For tenant isolation

**Design Notes:**
- **Purpose**: Tracks inbound shipments from vendors/suppliers to hubs/warehouses
- **Shipment Workflow**: 
  - Status values typically: 0=pending, 1=in_transit, 2=arrived, 3=received, 4=cancelled
  - Dates track shipment lifecycle: `ship_date` → `estimated_arrival_date` → `arrived_date`
- **Code Uniqueness**: `code` must be unique across all tenants (or per tenant if tenant-scoped)
- **Outbound Reference**: `outbound_code` links to related outbound shipments for round-trip tracking
- **Multi-tenant**: All records are tenant-scoped via `tenant_id` foreign key
- **Image Storage**: `images` array stores multiple image references for shipment documentation (damage reports, packing lists, etc.)
- **Location Hierarchy**: `hub_id` and `location_id` provide two-level location tracking
- **Vendor Management**: `vendor_id` links to vendor/supplier records (table structure TBD)
- **Tracking Integration**: `tracking_number` supports integration with carrier tracking systems

**Example Usage:**

**Inbound Shipment Record:**
- Code: 'INB-2024-001', Vendor: 123, Hub: 5, Status: 2 (arrived)
- `code='INB-2024-001'`, `outbound_code='OUT-2024-050'`, `vendor_id=123`, `hub_id=5`, `location_id=12`
- `status=2`, `tracking_number='1Z999AA10123456784'`, `ship_date='2024-01-15'`, `estimated_arrival_date='2024-01-20'`, `arrived_date='2024-01-19'`
- `images=ARRAY['https://storage.example.com/shipment1.jpg', 'https://storage.example.com/packing_list.pdf']`
- `notes='Received in good condition, all items accounted for'`, `updated_by=456`, `tenant_id=1`

**Status Transitions:**
- Pending (0): Shipment created, awaiting dispatch
- In Transit (1): Shipment dispatched, `ship_date` set, `tracking_number` assigned
- Arrived (2): Shipment arrived at destination, `arrived_date` set
- Received (3): Shipment processed and received into inventory
- Cancelled (4): Shipment cancelled

**Date Tracking:**
- `ship_date`: When vendor/supplier dispatched the shipment
- `estimated_arrival_date`: Expected arrival based on carrier estimates
- `arrived_date`: Actual arrival date (may differ from estimated)

**Note**: 
- Each inbound shipment has a unique code for tracking and reference
- Outbound code links to related outbound shipments for complete logistics flow
- Images array allows multiple documentation files per shipment
- Status integer allows for custom status workflows per tenant

---

#### `logistic_outbounds` 🆕
**Status**: Outbound shipment tracking and logistics management

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | SERIAL | PRIMARY KEY | Auto-incrementing unique identifier |
| `code` | VARCHAR(255) | NOT NULL, UNIQUE | 🆕 Unique outbound shipment code/identifier |
| `status` | INTEGER | NULL | 🆕 Shipment status (e.g., 0=pending, 1=preparing, 2=shipped, 3=delivered, 4=cancelled) |
| `ship_date` | DATE | NULL | 🆕 Date when shipment was dispatched |
| `delivery_date` | DATE | NULL | 🆕 Actual delivery date to customer |
| `estimated_arrival_date` | DATE | NULL | 🆕 Expected delivery date |
| `tracking_number` | VARCHAR(255) | NULL | 🆕 Carrier tracking number for shipment |
| `image` | VARCHAR(255) | NULL | 🆕 Single image URL/path for shipment documentation |
| `batch_notes` | TEXT | NULL | 🆕 Batch-level notes for the shipment |
| `notes` | TEXT | NULL | 🆕 Additional notes and comments |
| `updated_by` | INTEGER | NULL | 🆕 Staff/user ID who last updated the record |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 🆕 Last update timestamp |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 🆕 Record creation timestamp |
| `tenant_id` | INTEGER | NOT NULL, DEFAULT 1 | FK → `sys_tenants.id` - Multi-tenant support |

**Foreign Keys:**
- `tenant_id` → `sys_tenants(id)` ON DELETE CASCADE

**Indexes:**
- `idx_outbound_shipments_code` (on `code`) - For quick lookup by shipment code
- `idx_outbound_shipments_status` (on `status`) - For filtering by status
- `idx_outbound_shipments_tenant` (on `tenant_id`) - For tenant isolation

**Design Notes:**
- **Purpose**: Tracks outbound shipments from warehouses to customers/destinations
- **Shipment Workflow**: 
  - Status values typically: 0=pending, 1=preparing, 2=shipped, 3=delivered, 4=cancelled
  - Dates track shipment lifecycle: `ship_date` → `estimated_arrival_date` → `delivery_date`
- **Code Uniqueness**: `code` must be unique across all tenants (or per tenant if tenant-scoped)
- **Multi-tenant**: All records are tenant-scoped via `tenant_id` foreign key
- **Image Storage**: Single `image` field stores one image reference (unlike inbound which uses array)
- **Batch Notes**: `batch_notes` for shipment-level notes, `notes` for general comments
- **Tracking Integration**: `tracking_number` supports integration with carrier tracking systems
- **Delivery Tracking**: `delivery_date` tracks actual customer delivery, `estimated_arrival_date` for expected delivery

**Example Usage:**

**Outbound Shipment Record:**
- Code: 'OUT-2024-001', Status: 2 (shipped)
- `code='OUT-2024-001'`, `status=2`, `tracking_number='1Z999AA10123456784'`
- `ship_date='2024-01-15'`, `estimated_arrival_date='2024-01-20'`, `delivery_date='2024-01-19'`
- `image='https://storage.example.com/shipment_label.jpg'`
- `batch_notes='Priority shipment, handle with care'`, `notes='Delivered to customer successfully'`, `updated_by=456`, `tenant_id=1`

**Status Transitions:**
- Pending (0): Shipment created, awaiting preparation
- Preparing (1): Items being picked and packed
- Shipped (2): Shipment dispatched, `ship_date` set, `tracking_number` assigned
- Delivered (3): Shipment delivered to customer, `delivery_date` set
- Cancelled (4): Shipment cancelled

**Note**: 
- Each outbound shipment has a unique code for tracking and reference
- Can be linked to inbound shipments via `logistic_inbounds.outbound_code`
- Single image field (unlike inbound's array) for simpler documentation

---

#### `logistic_items` 🆕
**Status**: Individual items in logistics movements (inbound/outbound)

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | 🆕 Unique identifier using UUID |
| `direction` | TEXT | NOT NULL, CHECK ('in' or 'out') | 🆕 Movement direction: 'in' (inbound) or 'out' (outbound) |
| `order_id` | BIGINT | NULL, FK → `orders.id` | 🆕 Reference to order (for outbound shipments) |
| `movement_id` | UUID | NULL | 🆕 Internal movement/transfer identifier |
| `po_id` | BIGINT | NULL | 🆕 Purchase order identifier (for inbound shipments) |
| `inbound_id` | INTEGER | NULL | 🆕 FK → `logistic_inbounds.id` - Links to inbound shipment |
| `outbound_id` | INTEGER | NULL | 🆕 FK → `logistic_outbounds.id` - Links to outbound shipment |
| `product_id` | TEXT | NOT NULL | 🆕 Product identifier (text format) |
| `sku` | TEXT | NULL | 🆕 Product SKU (denormalized for historical accuracy) |
| `quantity` | INTEGER | NOT NULL, CHECK (> 0) | 🆕 Quantity of items (must be positive) |
| `code` | TEXT | NULL | 🆕 Item code/identifier |
| `item_type` | TEXT | NULL | 🆕 Type/category of item |
| `notes` | TEXT | NULL | 🆕 Additional notes for this item |
| `processed_at` | TIMESTAMP WITH TIME ZONE | NULL | 🆕 When item was processed/received |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 🆕 Record creation timestamp |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 🆕 Last update timestamp |
| `tenant_id` | INTEGER | NOT NULL, DEFAULT 1 | FK → `sys_tenants.id` - Multi-tenant support |

**Foreign Keys:**
- `order_id` → `orders(id)` ON DELETE SET NULL
- `tenant_id` → `sys_tenants(id)`
- `inbound_id` → `logistic_inbounds(id)` (expected)
- `outbound_id` → `logistic_outbounds(id)` (expected)

**Indexes:**
- `idx_log_items_tenant` (on `tenant_id`) - For tenant isolation
- `idx_log_items_order` (on `order_id`) - For order-based queries
- `idx_log_items_product` (on `product_id`) - For product-based queries
- `idx_log_items_direction` (on `direction`) - For filtering by direction

**Constraints:**
- `logistic_items_direction_check`: `direction` must be 'in' or 'out'
- `logistic_items_direction_refs`: 
  - If `direction = 'in'`, then `outbound_id` must be NULL
  - If `direction = 'out'`, then `inbound_id` must be NULL
- `logistic_items_quantity_check`: `quantity` must be greater than 0
- `logistic_items_ref_presence`: At least one reference must be present (`order_id`, `movement_id`, `po_id`, `inbound_id`, or `outbound_id`)

**Design Notes:**
- **Purpose**: Tracks individual items/products within logistics movements (both inbound and outbound)
- **Direction Logic**: 
  - `direction = 'in'`: Item coming into warehouse (inbound), must have `inbound_id`, `outbound_id` must be NULL
  - `direction = 'out'`: Item going out of warehouse (outbound), must have `outbound_id`, `inbound_id` must be NULL
- **Reference Flexibility**: Item can be linked via multiple reference types:
  - `order_id`: For outbound shipments related to customer orders
  - `po_id`: For inbound shipments related to purchase orders
  - `inbound_id`: Direct link to inbound shipment
  - `outbound_id`: Direct link to outbound shipment
  - `movement_id`: For internal transfers/movements
- **Product Tracking**: `product_id` is TEXT (not FK) for flexibility, `sku` is denormalized for historical accuracy
- **Quantity Validation**: Quantity must always be positive (> 0)
- **Processing Timestamp**: `processed_at` tracks when item was actually processed/received
- **Multi-tenant**: All records are tenant-scoped via `tenant_id` foreign key

**Example Usage:**

**Inbound Item Record:**
- Direction: 'in', Inbound: 123, Product: 'PROD-001', Quantity: 50
- `direction='in'`, `inbound_id=123`, `outbound_id=NULL`, `po_id=456`
- `product_id='PROD-001'`, `sku='PROD-001'`, `quantity=50`, `code='ITEM-001'`
- `item_type='raw_material'`, `processed_at='2024-01-19 10:30:00'`, `tenant_id=1`

**Outbound Item Record:**
- Direction: 'out', Outbound: 789, Order: 101, Product: 'PROD-002', Quantity: 25
- `direction='out'`, `outbound_id=789`, `inbound_id=NULL`, `order_id=101`
- `product_id='PROD-002'`, `sku='PROD-002'`, `quantity=25`, `code='ITEM-002'`
- `item_type='finished_good'`, `processed_at='2024-01-15 14:20:00'`, `tenant_id=1`

**Internal Movement:**
- Direction: 'in', Movement: UUID, Product: 'PROD-003', Quantity: 10
- `direction='in'`, `movement_id='550e8400-e29b-41d4-a716-446655440000'`, `inbound_id=NULL`, `outbound_id=NULL`
- `product_id='PROD-003'`, `quantity=10`, `item_type='transfer'`, `tenant_id=1`

**Note**: 
- Direction constraint ensures data integrity: inbound items can't have outbound_id and vice versa
- At least one reference field must be populated (order, PO, inbound, outbound, or movement)
- UUID primary key allows for distributed systems and better uniqueness
- SKU is denormalized to preserve historical accuracy even if product records change

---

#### `logistic_vendors` 🆕
**Status**: Vendor/supplier information management

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | SERIAL | PRIMARY KEY | Auto-incrementing unique identifier |
| `code` | VARCHAR(50) | NOT NULL, UNIQUE | 🆕 Unique vendor code/identifier |
| `name` | VARCHAR(255) | NOT NULL | 🆕 Vendor/supplier name |
| `contact_info` | JSONB | NULL | 🆕 Flexible JSON structure for contact information |
| `address` | TEXT | NULL | 🆕 Street address |
| `city` | VARCHAR(255) | NULL | 🆕 City |
| `state` | VARCHAR(255) | NULL | 🆕 State/province |
| `country` | VARCHAR(255) | NULL | 🆕 Country |
| `postal_code` | VARCHAR(50) | NULL | 🆕 Postal/ZIP code |
| `phone` | VARCHAR(50) | NULL | 🆕 Phone number |
| `email` | VARCHAR(255) | NULL | 🆕 Email address |
| `website` | VARCHAR(255) | NULL | 🆕 Website URL |
| `is_active` | BOOLEAN | DEFAULT TRUE | 🆕 Active status flag |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 🆕 Record creation timestamp |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 🆕 Last update timestamp |
| `tenant_id` | INTEGER | NOT NULL, DEFAULT 1 | FK → `sys_tenants.id` - Multi-tenant support |

**Foreign Keys:**
- `tenant_id` → `sys_tenants(id)` ON DELETE CASCADE

**Indexes:**
- `idx_vendors_code` (on `code`) - For quick lookup by vendor code
- `idx_vendors_active` (on `is_active`) - For filtering active/inactive vendors
- `idx_vendors_tenant` (on `tenant_id`) - For tenant isolation

**Design Notes:**
- **Purpose**: Manages vendor/supplier information for logistics operations
- **Code Uniqueness**: `code` must be unique across all tenants (or per tenant if tenant-scoped)
- **Contact Information**: 
  - Structured fields: `phone`, `email`, `website`
  - Flexible JSONB `contact_info` for additional contact details (e.g., multiple contacts, social media, etc.)
- **Address Structure**: Separate fields for address components (address, city, state, country, postal_code)
- **Active Status**: `is_active` flag allows soft-deletion/archiving of vendors
- **Multi-tenant**: All records are tenant-scoped via `tenant_id` foreign key
- **Vendor Linking**: Referenced by `logistic_inbounds.vendor_id` for inbound shipments

**Example Usage:**

**Vendor Record:**
- Code: 'VEND-001', Name: 'ABC Suppliers Inc.'
- `code='VEND-001'`, `name='ABC Suppliers Inc.'`
- `address='123 Main Street'`, `city='New York'`, `state='NY'`, `country='USA'`, `postal_code='10001'`
- `phone='+1-555-123-4567'`, `email='contact@abcsuppliers.com'`, `website='https://www.abcsuppliers.com'`
- `contact_info='{"primary_contact": "John Doe", "secondary_contact": "Jane Smith", "fax": "+1-555-123-4568"}'`
- `is_active=true`, `tenant_id=1`

**JSONB Contact Info Example:**
```json
{
  "primary_contact": {
    "name": "John Doe",
    "title": "Sales Manager",
    "phone": "+1-555-123-4567",
    "email": "john@abcsuppliers.com"
  },
  "secondary_contact": {
    "name": "Jane Smith",
    "title": "Operations Manager",
    "phone": "+1-555-123-4568",
    "email": "jane@abcsuppliers.com"
  },
  "social_media": {
    "linkedin": "https://linkedin.com/company/abc-suppliers",
    "twitter": "@abcsuppliers"
  }
}
```

**Note**: 
- Each vendor has a unique code for tracking and reference
- JSONB `contact_info` provides flexibility for varying contact structures
- Active flag allows filtering active vendors for dropdowns/selection
- Links to inbound shipments via `logistic_inbounds.vendor_id`

---

#### `shipment_statuses` 🆕
**Status**: Lookup table for shipment status definitions

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | INTEGER | PRIMARY KEY, DEFAULT nextval() | Auto-incrementing unique identifier |
| `code` | VARCHAR | NOT NULL, UNIQUE | 🆕 Unique status code (e.g., 'pending', 'processing', 'shipped', 'delivered') |
| `name` | VARCHAR | NOT NULL | 🆕 Human-readable status name |
| `description` | TEXT | NULL | 🆕 Detailed description of the status |
| `is_active` | BOOLEAN | DEFAULT TRUE | 🆕 Active status flag (for soft-deletion) |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 🆕 Record creation timestamp |

**Indexes:**
- Unique index on `code` (enforced by UNIQUE constraint)

**Design Notes:**
- **Purpose**: Provides standardized status definitions for fulfilment shipments
- **Status Management**: Centralized lookup table for shipment statuses used by `fulfilment_shipments.status_id`
- **Code Uniqueness**: `code` must be unique (e.g., 'pending', 'processing', 'shipped', 'delivered', 'cancelled')
- **Active Flag**: `is_active` allows disabling statuses without deleting them (maintains referential integrity)
- **Referenced By**: `fulfilment_shipments.status_id` foreign key references this table

**Example Usage:**

**Status Records:**
- Code: 'pending', Name: 'Pending', Description: 'Shipment created but not yet processed'
- Code: 'processing', Name: 'Processing', Description: 'Shipment is being prepared'
- Code: 'shipped', Name: 'Shipped', Description: 'Shipment has been dispatched'
- Code: 'delivered', Name: 'Delivered', Description: 'Shipment delivered to customer'
- Code: 'cancelled', Name: 'Cancelled', Description: 'Shipment cancelled'

**Note**: 
- This is a lookup/reference table for standardized status values
- Referenced by `fulfilment_shipments` table via `status_id` foreign key
- Active flag allows deprecating old statuses while maintaining data integrity

---

#### `shipment_line_items` 🆕
**Status**: Junction table linking order line items to fulfilment shipments

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | 🆕 Unique identifier using UUID |
| `line_item_id` | INTEGER | NOT NULL, FK → `order_line_items_properties.id` | 🆕 Reference to order line item |
| `shipment_id` | INTEGER | NOT NULL, FK → `fulfilment_shipments.id` | 🆕 Reference to fulfilment shipment |
| `quantity` | INTEGER | NOT NULL, CHECK (> 0) | 🆕 Quantity of items in shipment (must be positive) |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 🆕 Record creation timestamp |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 🆕 Last update timestamp |

**Foreign Keys:**
- `line_item_id` → `order_line_items_properties(id)`
- `shipment_id` → `fulfilment_shipments(id)`

**Constraints:**
- `quantity` must be greater than 0

**Design Notes:**
- **Purpose**: Links order line items to fulfilment shipments, tracking which items are included in each shipment
- **Many-to-Many Relationship**: 
  - One shipment can contain multiple line items
  - One line item can be split across multiple shipments (partial fulfilment)
- **Quantity Tracking**: `quantity` represents how many units of the line item are in this specific shipment
- **Partial Fulfilment**: Allows splitting a single order line item across multiple shipments
- **UUID Primary Key**: Uses UUID for distributed system compatibility

**Example Usage:**

**Shipment Line Item Record:**
- Line Item: 456, Shipment: 789, Quantity: 5
- `line_item_id=456`, `shipment_id=789`, `quantity=5`
- Links order line item 456 to shipment 789 with quantity 5

**Partial Fulfilment Example:**
- Order line item 456 has quantity 10
- Shipment 789: `line_item_id=456`, `shipment_id=789`, `quantity=5`
- Shipment 790: `line_item_id=456`, `shipment_id=790`, `quantity=5`
- Total: 5 + 5 = 10 (complete fulfilment across two shipments)

**Note**: 
- Enables partial fulfilment by allowing line items to be split across shipments
- Quantity must be positive (enforced by CHECK constraint)
- Links order fulfilment to shipment tracking

---

#### `shipment_orders` 🆕
**Status**: Junction table linking fulfilment shipments to orders

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `shipment_id` | INTEGER | NOT NULL, FK → `fulfilment_shipments.id`, PRIMARY KEY | 🆕 Reference to fulfilment shipment |
| `order_id` | BIGINT | NOT NULL, FK → `orders.id`, PRIMARY KEY | 🆕 Reference to order |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 🆕 Record creation timestamp |

**Foreign Keys:**
- `shipment_id` → `fulfilment_shipments(id)`
- `order_id` → `orders(id)`

**Primary Key:**
- Composite primary key on (`shipment_id`, `order_id`)

**Design Notes:**
- **Purpose**: Links fulfilment shipments to orders, enabling many-to-many relationship
- **Many-to-Many Relationship**: 
  - One shipment can contain items from multiple orders (consolidated shipping)
  - One order can be fulfilled by multiple shipments (split shipments)
- **Composite Primary Key**: Prevents duplicate shipment-order pairs
- **Consolidated Shipping**: Allows combining multiple orders into a single shipment
- **Split Shipments**: Allows fulfilling one order across multiple shipments

**Example Usage:**

**Shipment-Order Link:**
- Shipment: 789, Order: 101
- `shipment_id=789`, `order_id=101`
- Links shipment 789 to order 101

**Consolidated Shipping Example:**
- Shipment 789 contains items from multiple orders:
  - `shipment_id=789`, `order_id=101`
  - `shipment_id=789`, `order_id=102`
  - `shipment_id=789`, `order_id=103`
- Single shipment fulfils three orders

**Split Shipment Example:**
- Order 101 is fulfilled by multiple shipments:
  - `shipment_id=789`, `order_id=101`
  - `shipment_id=790`, `order_id=101`
  - `shipment_id=791`, `order_id=101`
- One order split across three shipments

**Note**: 
- Composite primary key ensures unique shipment-order pairs
- Enables both consolidated shipping and split shipments
- Links order fulfilment to shipment tracking

---

#### `fulfilment_shipments` 🆕
**Status**: Main fulfilment shipment tracking table with complete shipping details

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | INTEGER | PRIMARY KEY, DEFAULT nextval() | Auto-incrementing unique identifier |
| `shipment_number` | VARCHAR | UNIQUE | 🆕 Unique shipment number/identifier |
| `ship_from_location` | VARCHAR | NULL | 🆕 Origin location/warehouse code |
| `ship_to_name` | VARCHAR | NULL | 🆕 Recipient name |
| `ship_to_phone` | VARCHAR | NULL | 🆕 Recipient phone number |
| `ship_to_email` | VARCHAR | NULL | 🆕 Recipient email address |
| `ship_to_address` | TEXT | NULL | 🆕 Recipient street address |
| `ship_to_city` | VARCHAR | NULL | 🆕 Recipient city |
| `ship_to_state` | VARCHAR | NULL | 🆕 Recipient state/province |
| `ship_to_country` | VARCHAR | NULL | 🆕 Recipient country |
| `ship_to_post_code` | VARCHAR | NULL | 🆕 Recipient postal/ZIP code |
| `address_residential` | BOOLEAN | DEFAULT FALSE | 🆕 Whether address is residential (vs commercial) |
| `carrier` | VARCHAR | NULL | 🆕 Shipping carrier (e.g., 'UPS', 'FedEx', 'USPS') |
| `service` | VARCHAR | NULL | 🆕 Shipping service level (e.g., 'Ground', 'Express', 'Overnight') |
| `package_weight` | NUMERIC | NULL | 🆕 Package weight |
| `package_length` | NUMERIC | NULL | 🆕 Package length |
| `package_width` | NUMERIC | NULL | 🆕 Package width |
| `package_height` | NUMERIC | NULL | 🆕 Package height |
| `package_code` | VARCHAR | NULL | 🆕 Package type/code |
| `tracking_number` | VARCHAR | NULL | 🆕 Carrier tracking number |
| `tracking_url` | TEXT | NULL | 🆕 URL to track shipment |
| `status` | VARCHAR | NULL | 🆕 Legacy status field (deprecated, use `status_id`) |
| `label_download_url` | TEXT | NULL | 🆕 URL to download shipping label |
| `label_expires_at` | TIMESTAMP WITH TIME ZONE | NULL | 🆕 When label download URL expires |
| `label_format` | VARCHAR | DEFAULT 'pdf' | 🆕 Label format (e.g., 'pdf', 'png', 'zpl') |
| `estimated_shipping_cost` | NUMERIC | NULL | 🆕 Estimated shipping cost |
| `actual_shipping_cost` | NUMERIC | NULL | 🆕 Actual shipping cost charged |
| `insurance_amount` | NUMERIC | NULL | 🆕 Insurance coverage amount |
| `confirmation_amount` | NUMERIC | NULL | 🆕 Confirmation/delivery confirmation cost |
| `total_cost` | NUMERIC | NULL | 🆕 Total shipping cost (shipping + insurance + confirmation) |
| `require_insurance` | BOOLEAN | DEFAULT FALSE | 🆕 Whether insurance is required |
| `require_signature` | BOOLEAN | DEFAULT FALSE | 🆕 Whether signature is required on delivery |
| `saturday_delivery` | BOOLEAN | DEFAULT FALSE | 🆕 Whether Saturday delivery is requested |
| `contains_alcohol` | BOOLEAN | DEFAULT FALSE | 🆕 Whether package contains alcohol (special handling) |
| `ship_date` | DATE | NULL | 🆕 Date when shipment was dispatched |
| `estimated_delivery_date` | DATE | NULL | 🆕 Estimated delivery date |
| `actual_delivery_date` | DATE | NULL | 🆕 Actual delivery date |
| `label_printed` | BOOLEAN | DEFAULT FALSE | 🆕 Whether shipping label has been printed |
| `label_voided` | BOOLEAN | DEFAULT FALSE | 🆕 Whether shipping label has been voided |
| `label_voided_at` | TIMESTAMP WITH TIME ZONE | NULL | 🆕 When label was voided |
| `batch_id` | INTEGER | NULL | 🆕 Reference to fulfilment batch |
| `note` | TEXT | NULL | 🆕 Additional notes/comments |
| `created_by` | INTEGER | NULL | 🆕 Staff/user ID who created the record |
| `updated_by` | INTEGER | NULL | 🆕 Staff/user ID who last updated the record |
| `date_created` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 🆕 Record creation timestamp |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 🆕 Last update timestamp |
| `tenant_id` | INTEGER | DEFAULT 1 | FK → `sys_tenants.id` - Multi-tenant support |
| `status_id` | INTEGER | NULL, FK → `shipment_statuses.id` | 🆕 Reference to standardized status |

**Foreign Keys:**
- `tenant_id` → `sys_tenants(id)`
- `status_id` → `shipment_statuses(id)`

**Indexes:**
- Unique index on `shipment_number` (enforced by UNIQUE constraint)

**Design Notes:**
- **Purpose**: Comprehensive fulfilment shipment tracking with complete shipping details, carrier integration, and label management
- **Status Management**: 
  - `status_id` references `shipment_statuses` for standardized status (preferred)
  - `status` field is legacy/deprecated but may still be used
- **Shipping Address**: Complete recipient address stored in separate fields for structured data
- **Package Dimensions**: Weight and dimensions for shipping calculations and carrier requirements
- **Carrier Integration**: 
  - `carrier` and `service` for carrier/service selection
  - `tracking_number` and `tracking_url` for tracking
  - `label_download_url` and `label_expires_at` for label management
- **Label Management**: 
  - `label_printed` tracks if label has been printed
  - `label_voided` and `label_voided_at` for voided labels
  - `label_format` for different label formats (PDF, PNG, ZPL)
- **Cost Tracking**: 
  - `estimated_shipping_cost` vs `actual_shipping_cost` for cost analysis
  - `insurance_amount`, `confirmation_amount`, `total_cost` for complete cost breakdown
- **Special Options**: 
  - `require_insurance`, `require_signature`, `saturday_delivery`, `contains_alcohol` for special handling
- **Batch Processing**: `batch_id` links to `fulfilment_batches` for batch operations
- **Date Tracking**: `ship_date` → `estimated_delivery_date` → `actual_delivery_date`
- **Referenced By**: 
  - `shipment_orders.shipment_id`
  - `shipment_line_items.shipment_id`
  - `inv_movements.shipment_id` (inventory movements)

**Example Usage:**

**Fulfilment Shipment Record:**
- Shipment Number: 'SHIP-2024-001', Carrier: 'UPS', Service: 'Ground'
- `shipment_number='SHIP-2024-001'`, `carrier='UPS'`, `service='Ground'`
- `ship_from_location='WAREHOUSE-001'`, `ship_to_name='John Doe'`, `ship_to_address='123 Main St'`, `ship_to_city='New York'`, `ship_to_state='NY'`, `ship_to_country='USA'`, `ship_to_post_code='10001'`
- `package_weight=5.5`, `package_length=12`, `package_width=8`, `package_height=6`, `package_code='BOX'`
- `tracking_number='1Z999AA10123456784'`, `tracking_url='https://www.ups.com/track?tracknum=1Z999AA10123456784'`
- `status_id=3` (shipped), `estimated_shipping_cost=15.99`, `actual_shipping_cost=15.99`, `total_cost=15.99`
- `ship_date='2024-01-15'`, `estimated_delivery_date='2024-01-20'`, `actual_delivery_date='2024-01-19'`
- `label_printed=true`, `label_format='pdf'`, `batch_id=10`, `tenant_id=1`

**Label Management:**
- Label created: `label_download_url='https://labels.example.com/shipment-123.pdf'`, `label_expires_at='2024-01-16 23:59:59'`
- Label printed: `label_printed=true`
- Label voided: `label_voided=true`, `label_voided_at='2024-01-15 14:30:00'`

**Special Options:**
- High-value shipment: `require_insurance=true`, `insurance_amount=500.00`, `require_signature=true`
- Alcohol shipment: `contains_alcohol=true`, `require_signature=true`
- Saturday delivery: `saturday_delivery=true`

**Note**: 
- This is the main fulfilment shipment table with comprehensive shipping details
- Links to orders via `shipment_orders` and line items via `shipment_line_items`
- Supports carrier integration with tracking and label management
- Batch processing via `batch_id` for bulk operations

---

#### `fulfilment_batches` 🆕
**Status**: Batch management for grouping and processing multiple shipments together

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | INTEGER | PRIMARY KEY, DEFAULT nextval() | Auto-incrementing unique identifier |
| `name` | VARCHAR | NULL | 🆕 Batch name/identifier |
| `status` | INTEGER | NULL | 🆕 Batch status (e.g., 0=draft, 1=processing, 2=completed, 3=cancelled) |
| `ship_date` | DATE | NULL | 🆕 Planned or actual ship date for the batch |
| `created_by` | INTEGER | NULL | 🆕 Staff/user ID who created the batch |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 🆕 Batch creation timestamp |
| `tenant_id` | INTEGER | DEFAULT 1 | FK → `sys_tenants.id` - Multi-tenant support |

**Foreign Keys:**
- `tenant_id` → `sys_tenants(id)`

**Design Notes:**
- **Purpose**: Groups multiple shipments together for batch processing and management
- **Batch Processing**: Allows processing multiple shipments as a single unit
- **Status Management**: Integer-based status for batch workflow (draft, processing, completed, cancelled)
- **Ship Date**: Can be used for planned ship date or actual ship date when batch is processed
- **Multi-tenant**: All records are tenant-scoped via `tenant_id` foreign key
- **Referenced By**: 
  - `fulfilment_shipments.batch_id` - Links shipments to batch
  - `fulfilment_batches_meta.batch_id` - Batch metadata/statistics

**Example Usage:**

**Fulfilment Batch Record:**
- Name: 'Batch-2024-001', Status: 1 (processing), Ship Date: '2024-01-15'
- `name='Batch-2024-001'`, `status=1`, `ship_date='2024-01-15'`
- `created_by=123`, `created_at='2024-01-14 10:00:00'`, `tenant_id=1`

**Batch Workflow:**
- Draft (0): Batch created, shipments being added
- Processing (1): Batch being processed, labels being generated
- Completed (2): All shipments in batch processed
- Cancelled (3): Batch cancelled

**Note**: 
- Groups shipments for efficient batch processing
- Links to batch metadata table for statistics and tracking
- Enables bulk operations on multiple shipments

---

#### `fulfilment_batches_meta` 🆕
**Status**: Metadata and statistics for fulfilment batches

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `batch_id` | INTEGER | PRIMARY KEY, FK → `fulfilment_batches.id` | 🆕 Reference to fulfilment batch |
| `current_status` | INTEGER | NULL | 🆕 Current batch status (denormalized from batch) |
| `shipments_count` | INTEGER | DEFAULT 0 | 🆕 Number of shipments in batch |
| `orders_count` | INTEGER | DEFAULT 0 | 🆕 Number of orders in batch |
| `items_count` | INTEGER | DEFAULT 0 | 🆕 Total number of items in batch |
| `total_estimated_cost` | NUMERIC | NULL | 🆕 Sum of estimated shipping costs |
| `total_actual_cost` | NUMERIC | NULL | 🆕 Sum of actual shipping costs |
| `shipped_at` | DATE | NULL | 🆕 Date when batch was shipped |
| `delivered_at` | DATE | NULL | 🆕 Date when all shipments in batch were delivered |
| `last_error` | TEXT | NULL | 🆕 Last error message (if any) during batch processing |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 🆕 Last update timestamp |

**Foreign Keys:**
- `batch_id` → `fulfilment_batches(id)`

**Design Notes:**
- **Purpose**: Stores aggregated statistics and metadata for fulfilment batches
- **One-to-One Relationship**: One metadata record per batch (enforced by primary key on `batch_id`)
- **Statistics Aggregation**: 
  - `shipments_count`: Total shipments in batch
  - `orders_count`: Total unique orders in batch
  - `items_count`: Total items across all shipments
- **Cost Tracking**: 
  - `total_estimated_cost`: Sum of all `estimated_shipping_cost` from shipments
  - `total_actual_cost`: Sum of all `actual_shipping_cost` from shipments
- **Date Tracking**: 
  - `shipped_at`: When batch was shipped (earliest `ship_date` from shipments)
  - `delivered_at`: When all shipments were delivered (latest `actual_delivery_date`)
- **Error Tracking**: `last_error` stores the most recent error during batch processing
- **Status Denormalization**: `current_status` is denormalized from `fulfilment_batches.status` for quick access
- **Performance**: Pre-calculated statistics for fast batch reporting without joins

**Example Usage:**

**Batch Metadata Record:**
- Batch: 10, Shipments: 25, Orders: 18, Items: 150
- `batch_id=10`, `current_status=2` (completed)
- `shipments_count=25`, `orders_count=18`, `items_count=150`
- `total_estimated_cost=399.75`, `total_actual_cost=385.50`
- `shipped_at='2024-01-15'`, `delivered_at='2024-01-20'`
- `updated_at='2024-01-20 15:30:00'`

**Statistics Calculation:**
- `shipments_count`: COUNT(*) FROM fulfilment_shipments WHERE batch_id = 10
- `orders_count`: COUNT(DISTINCT order_id) FROM shipment_orders WHERE shipment_id IN (SELECT id FROM fulfilment_shipments WHERE batch_id = 10)
- `items_count`: SUM(quantity) FROM shipment_line_items WHERE shipment_id IN (SELECT id FROM fulfilment_shipments WHERE batch_id = 10)
- `total_estimated_cost`: SUM(estimated_shipping_cost) FROM fulfilment_shipments WHERE batch_id = 10
- `total_actual_cost`: SUM(actual_shipping_cost) FROM fulfilment_shipments WHERE batch_id = 10

**Note**: 
- One metadata record per batch (1:1 relationship)
- Pre-calculated statistics for performance
- Updated when batch or shipments change
- Useful for batch reporting and analytics

---

#### `inv_movements` 🆕
**Status**: Inventory movement tracking with complete audit trail

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | Auto-incrementing unique identifier |
| `movement_type` | VARCHAR | NULL | 🆕 Type of movement (e.g., 'receipt', 'shipment', 'transfer', 'adjustment', 'return') |
| `movement_date` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 🆕 Date/time when movement occurred |
| `reference_number` | VARCHAR | NULL | 🆕 Reference number/document number |
| `product_id` | VARCHAR | NULL | 🆕 Product identifier |
| `sku` | VARCHAR | NULL | 🆕 Product SKU (denormalized for historical accuracy) |
| `from_location_id` | INTEGER | NULL, FK → `locations.id` | 🆕 Source location (NULL for receipts) |
| `to_location_id` | INTEGER | NULL, FK → `locations.id` | 🆕 Destination location (NULL for shipments) |
| `batch_number` | VARCHAR | NULL | 🆕 Batch/lot number for tracking |
| `quantity_change` | INTEGER | NOT NULL, CHECK (≠ 0) | 🆕 Quantity change (positive for increase, negative for decrease) |
| `quantity_before` | INTEGER | NULL | 🆕 Inventory quantity before movement |
| `quantity_after` | INTEGER | NULL | 🆕 Inventory quantity after movement |
| `unit_cost` | NUMERIC | NULL | 🆕 Unit cost for cost tracking |
| `order_id` | BIGINT | NULL, FK → `orders.id` | 🆕 Reference to order (for order-related movements) |
| `order_line_item_id` | INTEGER | NULL, FK → `order_items.id` | 🆕 Reference to order line item |
| `shipment_id` | INTEGER | NULL, FK → `fulfilment_shipments.id` | 🆕 Reference to fulfilment shipment |
| `inbound_shipment_id` | INTEGER | NULL, FK → `logistic_inbounds.id` | 🆕 Reference to inbound shipment |
| `outbound_shipment_id` | INTEGER | NULL, FK → `logistic_outbounds.id` | 🆕 Reference to outbound shipment |
| `adjustment_reason` | VARCHAR | NULL | 🆕 Reason for adjustment (if movement_type = 'adjustment') |
| `source_document_type` | VARCHAR | NULL | 🆕 Type of source document (e.g., 'purchase_order', 'sales_order', 'transfer_order') |
| `performed_by` | INTEGER | NULL, FK → `hr_staff.id` | 🆕 Staff member who performed the movement |
| `notes` | TEXT | NULL | 🆕 Additional notes/comments |
| `tenant_id` | INTEGER | NOT NULL, DEFAULT 1 | FK → `sys_tenants.id` - Multi-tenant support |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 🆕 Record creation timestamp |

**Foreign Keys:**
- `from_location_id` → `locations(id)` ON UPDATE CASCADE ON DELETE SET NULL
- `to_location_id` → `locations(id)` ON UPDATE CASCADE ON DELETE SET NULL
- `order_id` → `orders(id)` ON UPDATE CASCADE ON DELETE SET NULL
- `order_line_item_id` → `order_items(id)` ON UPDATE CASCADE ON DELETE SET NULL
- `shipment_id` → `fulfilment_shipments(id)` ON UPDATE CASCADE ON DELETE SET NULL
- `inbound_shipment_id` → `logistic_inbounds(id)` ON UPDATE CASCADE ON DELETE SET NULL
- `outbound_shipment_id` → `logistic_outbounds(id)` ON UPDATE CASCADE ON DELETE SET NULL
- `performed_by` → `hr_staff(id)` ON UPDATE CASCADE ON DELETE SET NULL
- `tenant_id` → `sys_tenants(id)` ON UPDATE CASCADE

**Indexes:**
- `idx_inv_movements_product` (on `product_id`) - For product-based queries
- `idx_inv_movements_sku` (on `sku`) - For SKU-based queries
- `idx_inv_movements_from_location` (on `from_location_id`) - For source location queries
- `idx_inv_movements_to_location` (on `to_location_id`) - For destination location queries
- `idx_inv_movements_movement_date` (on `movement_date`) - For date-based queries
- `idx_inv_movements_tenant` (on `tenant_id`) - For tenant isolation
- `idx_inv_movements_order_id` (on `order_id`) - For order-based queries
- `idx_inv_movements_shipment_ids` (on `shipment_id`, `inbound_shipment_id`, `outbound_shipment_id`) - Composite index for shipment queries

**Constraints:**
- `chk_inv_movements_qty_math`: If both `quantity_before` and `quantity_after` are provided, they must satisfy: `quantity_after = quantity_before + quantity_change`
- `chk_inv_movements_qty_change_nonzero`: `quantity_change` must not be zero (enforced by CHECK constraint)

**Design Notes:**
- **Purpose**: Complete audit trail of all inventory movements with full traceability
- **Movement Types**: 
  - 'receipt': Goods received (inbound, `to_location_id` set, `from_location_id` NULL)
  - 'shipment': Goods shipped (outbound, `from_location_id` set, `to_location_id` NULL)
  - 'transfer': Internal transfer (both locations set)
  - 'adjustment': Inventory adjustment (correction, damage, etc.)
  - 'return': Returned goods
- **Quantity Tracking**: 
  - `quantity_change`: The change amount (positive for increase, negative for decrease)
  - `quantity_before`: Inventory level before movement (optional, for validation)
  - `quantity_after`: Inventory level after movement (optional, calculated: `quantity_before + quantity_change`)
- **Mathematical Validation**: Constraint ensures `quantity_after = quantity_before + quantity_change` when both are provided
- **Non-Zero Change**: `quantity_change` cannot be zero (enforced by CHECK constraint)
- **Shipment References**: Can link to three types of shipments:
  - `shipment_id`: Fulfilment shipments (customer orders)
  - `inbound_shipment_id`: Inbound logistics shipments (from vendors)
  - `outbound_shipment_id`: Outbound logistics shipments (to customers)
- **Order References**: Links to orders and order line items for order-related movements
- **Location Tracking**: 
  - `from_location_id`: Source location (warehouse, bin, etc.)
  - `to_location_id`: Destination location
  - Both can be NULL for certain movement types (e.g., receipt from external source, shipment to customer)
- **Cost Tracking**: `unit_cost` for inventory valuation and cost accounting
- **Batch/Lot Tracking**: `batch_number` for lot tracking and traceability
- **Audit Trail**: 
  - `performed_by`: Staff member who performed the movement
  - `movement_date`: When movement occurred
  - `reference_number`: Document reference
  - `source_document_type`: Type of source document
- **Adjustment Tracking**: `adjustment_reason` for inventory adjustments (damage, loss, found, etc.)
- **Multi-tenant**: All records are tenant-scoped via `tenant_id` foreign key

**Example Usage:**

**Receipt Movement (Inbound):**
- Type: 'receipt', Product: 'PROD-001', Quantity: +50, To Location: 5
- `movement_type='receipt'`, `product_id='PROD-001'`, `sku='PROD-001'`
- `to_location_id=5`, `from_location_id=NULL`, `quantity_change=50`
- `quantity_before=100`, `quantity_after=150`
- `inbound_shipment_id=123`, `unit_cost=10.50`, `reference_number='PO-2024-001'`
- `source_document_type='purchase_order'`, `performed_by=456`, `tenant_id=1`

**Shipment Movement (Outbound):**
- Type: 'shipment', Product: 'PROD-002', Quantity: -25, From Location: 5
- `movement_type='shipment'`, `product_id='PROD-002'`, `sku='PROD-002'`
- `from_location_id=5`, `to_location_id=NULL`, `quantity_change=-25`
- `quantity_before=200`, `quantity_after=175`
- `shipment_id=789`, `order_id=101`, `order_line_item_id=456`
- `source_document_type='sales_order'`, `performed_by=456`, `tenant_id=1`

**Transfer Movement:**
- Type: 'transfer', Product: 'PROD-003', Quantity: -10, From: 5, To: 8
- `movement_type='transfer'`, `product_id='PROD-003'`, `sku='PROD-003'`
- `from_location_id=5`, `to_location_id=8`, `quantity_change=-10`
- `quantity_before=50`, `quantity_after=40` (at from_location)
- `reference_number='TRF-2024-001'`, `source_document_type='transfer_order'`, `performed_by=456`, `tenant_id=1`

**Adjustment Movement:**
- Type: 'adjustment', Product: 'PROD-004', Quantity: -5, Reason: 'damaged'
- `movement_type='adjustment'`, `product_id='PROD-004'`, `sku='PROD-004'`
- `from_location_id=5`, `to_location_id=NULL`, `quantity_change=-5`
- `quantity_before=100`, `quantity_after=95`
- `adjustment_reason='damaged'`, `reference_number='ADJ-2024-001'`
- `source_document_type='adjustment'`, `performed_by=456`, `tenant_id=1`

**Note**: 
- Complete audit trail of all inventory movements
- Links to all shipment types (fulfilment, inbound, outbound)
- Mathematical validation ensures data integrity
- Supports multiple movement types and scenarios
- Full traceability with staff attribution and timestamps

---

## Summary

### Tables in Shipment Module
1. **logistic_inbounds** - Inbound shipment tracking and logistics management
2. **logistic_outbounds** - Outbound shipment tracking and logistics management
3. **logistic_items** - Individual items in logistics movements (inbound/outbound)
4. **logistic_vendors** - Vendor/supplier information management
5. **shipment_statuses** - Lookup table for shipment status definitions
6. **shipment_line_items** - Junction table linking order line items to fulfilment shipments
7. **shipment_orders** - Junction table linking fulfilment shipments to orders
8. **fulfilment_shipments** - Main fulfilment shipment tracking with complete shipping details
9. **fulfilment_batches** - Batch management for grouping and processing multiple shipments
10. **fulfilment_batches_meta** - Metadata and statistics for fulfilment batches
11. **inv_movements** - Inventory movement tracking with complete audit trail

### Key Features
- **Complete Logistics Flow**: Tracks both inbound (from vendors) and outbound (to customers) shipments
- **Item-Level Tracking**: Detailed item tracking within shipments via `logistic_items`
- **Vendor Management**: Centralized vendor/supplier information with flexible contact storage
- **Fulfilment Shipment Tracking**: Comprehensive fulfilment shipment tracking with carrier integration, links orders and line items via junction tables
- **Carrier Integration**: Full carrier support with tracking numbers, labels, and service levels
- **Label Management**: Complete label lifecycle (creation, printing, voiding) with multiple formats
- **Batch Processing**: Group and process multiple shipments together for efficiency
- **Batch Statistics**: Pre-calculated batch metadata for fast reporting and analytics
- **Status Standardization**: Centralized status lookup table for consistent status management
- **Partial Fulfilment**: Supports splitting order line items across multiple shipments
- **Consolidated Shipping**: Enables combining multiple orders into a single shipment
- **Split Shipments**: Allows fulfilling one order across multiple shipments
- **Cost Tracking**: Estimated vs actual shipping costs with insurance and confirmation tracking
- **Package Management**: Complete package dimensions and weight tracking
- **Special Handling**: Support for insurance, signature, Saturday delivery, and alcohol shipments
- **Multi-tenant Support**: All tables are tenant-scoped with CASCADE delete (where applicable)
- **Status Management**: Integer-based status fields for flexible workflow states (logistic tables) and standardized lookup (fulfilment tables)
- **Date Tracking**: Ship dates, estimated arrival, and actual delivery dates
- **Image Documentation**: Image storage for shipment documentation (array for inbound, single for outbound)
- **Tracking Integration**: Carrier tracking number support for both inbound and outbound
- **Direction Logic**: Enforced constraints ensure data integrity for inbound vs outbound items
- **Reference Flexibility**: Items can be linked via orders, POs, shipments, or internal movements
- **Inventory Movement Tracking**: Complete audit trail of all inventory movements with full traceability
- **Movement Types**: Supports receipt, shipment, transfer, adjustment, and return movements
- **Mathematical Validation**: Ensures quantity calculations are correct (quantity_after = quantity_before + quantity_change)
- **Multi-Shipment Support**: Links to fulfilment shipments, inbound shipments, and outbound shipments
- **Location Tracking**: Tracks from/to locations for complete movement visibility
- **Cost Tracking**: Unit cost tracking for inventory valuation
- **Audit Trail**: `updated_by` and timestamps for change tracking, plus staff attribution for movements

### Relationships
- `logistic_inbounds.tenant_id` → `sys_tenants.id`
- `logistic_inbounds.vendor_id` → `logistic_vendors.id`
- `logistic_outbounds.tenant_id` → `sys_tenants.id`
- `logistic_items.tenant_id` → `sys_tenants.id`
- `logistic_items.order_id` → `orders.id` ON DELETE SET NULL
- `logistic_items.inbound_id` → `logistic_inbounds.id`
- `logistic_items.outbound_id` → `logistic_outbounds.id`
- `logistic_vendors.tenant_id` → `sys_tenants.id`
- `fulfilment_shipments.tenant_id` → `sys_tenants.id`
- `fulfilment_shipments.status_id` → `shipment_statuses.id`
- `fulfilment_shipments.batch_id` → `fulfilment_batches.id`
- `fulfilment_batches.tenant_id` → `sys_tenants.id`
- `fulfilment_batches_meta.batch_id` → `fulfilment_batches.id`
- `shipment_line_items.line_item_id` → `order_line_items_properties.id`
- `shipment_line_items.shipment_id` → `fulfilment_shipments.id`
- `shipment_orders.shipment_id` → `fulfilment_shipments.id`
- `shipment_orders.order_id` → `orders.id`
- `inv_movements.tenant_id` → `sys_tenants.id` ON UPDATE CASCADE
- `inv_movements.from_location_id` → `locations.id` ON UPDATE CASCADE ON DELETE SET NULL
- `inv_movements.to_location_id` → `locations.id` ON UPDATE CASCADE ON DELETE SET NULL
- `inv_movements.order_id` → `orders.id` ON UPDATE CASCADE ON DELETE SET NULL
- `inv_movements.order_line_item_id` → `order_items.id` ON UPDATE CASCADE ON DELETE SET NULL
- `inv_movements.shipment_id` → `fulfilment_shipments.id` ON UPDATE CASCADE ON DELETE SET NULL
- `inv_movements.inbound_shipment_id` → `logistic_inbounds.id` ON UPDATE CASCADE ON DELETE SET NULL
- `inv_movements.outbound_shipment_id` → `logistic_outbounds.id` ON UPDATE CASCADE ON DELETE SET NULL
- `inv_movements.performed_by` → `hr_staff.id` ON UPDATE CASCADE ON DELETE SET NULL

### Query Patterns

**Get all inbound shipments by status:**
```sql
SELECT * 
FROM logistic_inbounds 
WHERE status = 2  -- arrived
  AND tenant_id = 1
ORDER BY arrived_date DESC;
```

**Find inbound shipments by vendor:**
```sql
SELECT li.*, 
       lv.name as vendor_name,
       lv.code as vendor_code
FROM logistic_inbounds li
LEFT JOIN logistic_vendors lv ON li.vendor_id = lv.id
WHERE li.vendor_id = 123
  AND li.tenant_id = 1
ORDER BY li.ship_date DESC;
```

**Get shipments with tracking numbers:**
```sql
SELECT code, tracking_number, ship_date, estimated_arrival_date, arrived_date, status
FROM logistic_inbounds
WHERE tracking_number IS NOT NULL
  AND status IN (1, 2)  -- in_transit or arrived
  AND tenant_id = 1
ORDER BY ship_date DESC;
```

**Find delayed shipments:**
```sql
SELECT code, estimated_arrival_date, arrived_date, 
       CASE 
         WHEN arrived_date > estimated_arrival_date THEN arrived_date - estimated_arrival_date
         ELSE NULL
       END as delay_days
FROM logistic_inbounds
WHERE status >= 2  -- arrived or received
  AND arrived_date > estimated_arrival_date
  AND tenant_id = 1
ORDER BY delay_days DESC;
```

**Get shipments by hub:**
```sql
SELECT li.*, h.name as hub_name
FROM logistic_inbounds li
LEFT JOIN hub h ON li.hub_id = h.id
WHERE li.hub_id = 5
  AND li.tenant_id = 1
ORDER BY li.arrived_date DESC;
```

**Find shipments with images:**
```sql
SELECT code, images, arrived_date, notes
FROM logistic_inbounds
WHERE images IS NOT NULL 
  AND array_length(images, 1) > 0
  AND tenant_id = 1
ORDER BY arrived_date DESC;
```

**Get inbound shipment statistics by status:**
```sql
SELECT status, 
       COUNT(*) as shipment_count,
       COUNT(tracking_number) as tracked_count,
       AVG(arrived_date - ship_date) as avg_transit_days
FROM logistic_inbounds
WHERE tenant_id = 1
GROUP BY status
ORDER BY status;
```

**Get all outbound shipments by status:**
```sql
SELECT * 
FROM logistic_outbounds 
WHERE status = 2  -- shipped
  AND tenant_id = 1
ORDER BY ship_date DESC;
```

**Find outbound shipments with tracking numbers:**
```sql
SELECT code, tracking_number, ship_date, estimated_arrival_date, delivery_date, status
FROM logistic_outbounds
WHERE tracking_number IS NOT NULL
  AND status IN (2, 3)  -- shipped or delivered
  AND tenant_id = 1
ORDER BY ship_date DESC;
```

**Find delayed outbound deliveries:**
```sql
SELECT code, estimated_arrival_date, delivery_date, 
       CASE 
         WHEN delivery_date > estimated_arrival_date THEN delivery_date - estimated_arrival_date
         ELSE NULL
       END as delay_days
FROM logistic_outbounds
WHERE status >= 3  -- delivered
  AND delivery_date > estimated_arrival_date
  AND tenant_id = 1
ORDER BY delay_days DESC;
```

**Get outbound shipment statistics:**
```sql
SELECT status, 
       COUNT(*) as shipment_count,
       COUNT(tracking_number) as tracked_count,
       AVG(delivery_date - ship_date) as avg_delivery_days
FROM logistic_outbounds
WHERE tenant_id = 1
GROUP BY status
ORDER BY status;
```

**Get items in an inbound shipment:**
```sql
SELECT li.*, 
       lin.code as inbound_code,
       lin.status as inbound_status
FROM logistic_items li
JOIN logistic_inbounds lin ON li.inbound_id = lin.id
WHERE li.inbound_id = 123
  AND li.direction = 'in'
  AND li.tenant_id = 1
ORDER BY li.created_at;
```

**Get items in an outbound shipment:**
```sql
SELECT li.*, 
       lout.code as outbound_code,
       lout.status as outbound_status,
       o.order_number
FROM logistic_items li
JOIN logistic_outbounds lout ON li.outbound_id = lout.id
LEFT JOIN orders o ON li.order_id = o.id
WHERE li.outbound_id = 789
  AND li.direction = 'out'
  AND li.tenant_id = 1
ORDER BY li.created_at;
```

**Get all items for a product:**
```sql
SELECT li.*,
       CASE 
         WHEN li.direction = 'in' THEN lin.code
         WHEN li.direction = 'out' THEN lout.code
       END as shipment_code
FROM logistic_items li
LEFT JOIN logistic_inbounds lin ON li.inbound_id = lin.id
LEFT JOIN logistic_outbounds lout ON li.outbound_id = lout.id
WHERE li.product_id = 'PROD-001'
  AND li.tenant_id = 1
ORDER BY li.created_at DESC;
```

**Get item statistics by direction:**
```sql
SELECT direction,
       COUNT(*) as item_count,
       SUM(quantity) as total_quantity,
       COUNT(DISTINCT product_id) as unique_products
FROM logistic_items
WHERE tenant_id = 1
GROUP BY direction;
```

**Get items by order:**
```sql
SELECT li.*, 
       o.order_number,
       o.status as order_status
FROM logistic_items li
JOIN orders o ON li.order_id = o.id
WHERE li.order_id = 101
  AND li.direction = 'out'
  AND li.tenant_id = 1
ORDER BY li.created_at;
```

**Get all active vendors:**
```sql
SELECT * 
FROM logistic_vendors
WHERE is_active = true
  AND tenant_id = 1
ORDER BY name;
```

**Find vendors by location:**
```sql
SELECT * 
FROM logistic_vendors
WHERE country = 'USA'
  AND is_active = true
  AND tenant_id = 1
ORDER BY state, city;
```

**Get vendor statistics:**
```sql
SELECT lv.*,
       COUNT(li.id) as inbound_shipment_count,
       SUM(CASE WHEN li.status = 2 THEN 1 ELSE 0 END) as arrived_count
FROM logistic_vendors lv
LEFT JOIN logistic_inbounds li ON lv.id = li.vendor_id
WHERE lv.tenant_id = 1
GROUP BY lv.id
ORDER BY inbound_shipment_count DESC;
```

**Get complete shipment with items and vendor:**
```sql
SELECT lin.*,
       lv.name as vendor_name,
       lv.code as vendor_code,
       json_agg(
         json_build_object(
           'item_id', li.id,
           'product_id', li.product_id,
           'sku', li.sku,
           'quantity', li.quantity,
           'processed_at', li.processed_at
         )
       ) as items
FROM logistic_inbounds lin
LEFT JOIN logistic_vendors lv ON lin.vendor_id = lv.id
LEFT JOIN logistic_items li ON lin.id = li.inbound_id AND li.direction = 'in'
WHERE lin.id = 123
  AND lin.tenant_id = 1
GROUP BY lin.id, lv.name, lv.code;
```

**Get outbound shipment with items and order:**
```sql
SELECT lout.*,
       json_agg(
         json_build_object(
           'item_id', li.id,
           'product_id', li.product_id,
           'sku', li.sku,
           'quantity', li.quantity,
           'order_id', li.order_id,
           'order_number', o.order_number
         )
       ) as items
FROM logistic_outbounds lout
LEFT JOIN logistic_items li ON lout.id = li.outbound_id AND li.direction = 'out'
LEFT JOIN orders o ON li.order_id = o.id
WHERE lout.id = 789
  AND lout.tenant_id = 1
GROUP BY lout.id;
```

**Get all active shipment statuses:**
```sql
SELECT * 
FROM shipment_statuses
WHERE is_active = true
ORDER BY code;
```

**Get shipment with status details:**
```sql
SELECT fs.*,
       ss.code as status_code,
       ss.name as status_name,
       ss.description as status_description
FROM fulfilment_shipments fs
LEFT JOIN shipment_statuses ss ON fs.status_id = ss.id
WHERE fs.id = 789;
```

**Get line items in a shipment:**
```sql
SELECT sli.*,
       olip.product_id,
       olip.quantity as order_quantity,
       olip.price
FROM shipment_line_items sli
JOIN order_line_items_properties olip ON sli.line_item_id = olip.id
WHERE sli.shipment_id = 789
ORDER BY sli.created_at;
```

**Get shipments for an order:**
```sql
SELECT so.*,
       fs.code as shipment_code,
       fs.status_id,
       ss.name as status_name
FROM shipment_orders so
JOIN fulfilment_shipments fs ON so.shipment_id = fs.id
LEFT JOIN shipment_statuses ss ON fs.status_id = ss.id
WHERE so.order_id = 101
ORDER BY so.created_at;
```

**Get orders in a shipment:**
```sql
SELECT so.*,
       o.order_number,
       o.status as order_status,
       o.total_amount
FROM shipment_orders so
JOIN orders o ON so.order_id = o.id
WHERE so.shipment_id = 789
ORDER BY so.created_at;
```

**Get complete shipment with line items and orders:**
```sql
SELECT fs.*,
       ss.code as status_code,
       ss.name as status_name,
       json_agg(DISTINCT jsonb_build_object(
         'order_id', o.id,
         'order_number', o.order_number,
         'order_status', o.status
       )) as orders,
       json_agg(jsonb_build_object(
         'line_item_id', olip.id,
         'product_id', olip.product_id,
         'quantity', sli.quantity,
         'order_quantity', olip.quantity
       )) as line_items
FROM fulfilment_shipments fs
LEFT JOIN shipment_statuses ss ON fs.status_id = ss.id
LEFT JOIN shipment_orders so ON fs.id = so.shipment_id
LEFT JOIN orders o ON so.order_id = o.id
LEFT JOIN shipment_line_items sli ON fs.id = sli.shipment_id
LEFT JOIN order_line_items_properties olip ON sli.line_item_id = olip.id
WHERE fs.id = 789
GROUP BY fs.id, ss.code, ss.name;
```

**Check partial fulfilment status:**
```sql
SELECT olip.id as line_item_id,
       olip.quantity as order_quantity,
       COALESCE(SUM(sli.quantity), 0) as shipped_quantity,
       olip.quantity - COALESCE(SUM(sli.quantity), 0) as remaining_quantity
FROM order_line_items_properties olip
LEFT JOIN shipment_line_items sli ON olip.id = sli.line_item_id
WHERE olip.order_id = 101
GROUP BY olip.id, olip.quantity
HAVING olip.quantity - COALESCE(SUM(sli.quantity), 0) > 0;
```

**Get consolidated shipment details:**
```sql
SELECT fs.id as shipment_id,
       fs.shipment_number,
       COUNT(DISTINCT so.order_id) as order_count,
       COUNT(DISTINCT sli.line_item_id) as line_item_count,
       SUM(sli.quantity) as total_items
FROM fulfilment_shipments fs
LEFT JOIN shipment_orders so ON fs.id = so.shipment_id
LEFT JOIN shipment_line_items sli ON fs.id = sli.shipment_id
WHERE fs.id = 789
GROUP BY fs.id, fs.shipment_number;
```

**Get fulfilment shipment with complete details:**
```sql
SELECT fs.*,
       ss.code as status_code,
       ss.name as status_name,
       fb.name as batch_name
FROM fulfilment_shipments fs
LEFT JOIN shipment_statuses ss ON fs.status_id = ss.id
LEFT JOIN fulfilment_batches fb ON fs.batch_id = fb.id
WHERE fs.id = 789;
```

**Get shipments by carrier:**
```sql
SELECT carrier,
       service,
       COUNT(*) as shipment_count,
       SUM(actual_shipping_cost) as total_cost,
       AVG(actual_shipping_cost) as avg_cost
FROM fulfilment_shipments
WHERE tenant_id = 1
  AND actual_shipping_cost IS NOT NULL
GROUP BY carrier, service
ORDER BY shipment_count DESC;
```

**Get shipments requiring special handling:**
```sql
SELECT *
FROM fulfilment_shipments
WHERE (require_insurance = true
   OR require_signature = true
   OR saturday_delivery = true
   OR contains_alcohol = true)
  AND tenant_id = 1
ORDER BY date_created DESC;
```

**Get shipments with voided labels:**
```sql
SELECT *
FROM fulfilment_shipments
WHERE label_voided = true
  AND tenant_id = 1
ORDER BY label_voided_at DESC;
```

**Get shipments by batch:**
```sql
SELECT fs.*,
       fb.name as batch_name,
       fb.status as batch_status
FROM fulfilment_shipments fs
JOIN fulfilment_batches fb ON fs.batch_id = fb.id
WHERE fs.batch_id = 10
  AND fs.tenant_id = 1
ORDER BY fs.ship_date;
```

**Get batch with metadata:**
```sql
SELECT fb.*,
       fbm.shipments_count,
       fbm.orders_count,
       fbm.items_count,
       fbm.total_estimated_cost,
       fbm.total_actual_cost,
       fbm.shipped_at,
       fbm.delivered_at
FROM fulfilment_batches fb
LEFT JOIN fulfilment_batches_meta fbm ON fb.id = fbm.batch_id
WHERE fb.id = 10
  AND fb.tenant_id = 1;
```

**Get batch statistics:**
```sql
SELECT fb.id,
       fb.name,
       fb.status,
       COUNT(fs.id) as shipment_count,
       COUNT(DISTINCT so.order_id) as order_count,
       SUM(sli.quantity) as item_count,
       SUM(fs.estimated_shipping_cost) as total_estimated_cost,
       SUM(fs.actual_shipping_cost) as total_actual_cost
FROM fulfilment_batches fb
LEFT JOIN fulfilment_shipments fs ON fb.id = fs.batch_id
LEFT JOIN shipment_orders so ON fs.id = so.shipment_id
LEFT JOIN shipment_line_items sli ON fs.id = sli.shipment_id
WHERE fb.tenant_id = 1
GROUP BY fb.id, fb.name, fb.status
ORDER BY fb.created_at DESC;
```

**Get batches by status:**
```sql
SELECT fb.*,
       fbm.shipments_count,
       fbm.orders_count,
       fbm.total_actual_cost
FROM fulfilment_batches fb
LEFT JOIN fulfilment_batches_meta fbm ON fb.id = fbm.batch_id
WHERE fb.status = 1  -- processing
  AND fb.tenant_id = 1
ORDER BY fb.created_at;
```

**Get cost variance analysis:**
```sql
SELECT fs.id,
       fs.shipment_number,
       fs.estimated_shipping_cost,
       fs.actual_shipping_cost,
       (fs.actual_shipping_cost - fs.estimated_shipping_cost) as cost_variance,
       fs.carrier,
       fs.service
FROM fulfilment_shipments fs
WHERE fs.estimated_shipping_cost IS NOT NULL
  AND fs.actual_shipping_cost IS NOT NULL
  AND fs.tenant_id = 1
ORDER BY ABS(fs.actual_shipping_cost - fs.estimated_shipping_cost) DESC;
```

**Get shipments with expired labels:**
```sql
SELECT *
FROM fulfilment_shipments
WHERE label_download_url IS NOT NULL
  AND label_expires_at < NOW()
  AND label_voided = false
  AND tenant_id = 1
ORDER BY label_expires_at;
```

**Get delivery performance:**
```sql
SELECT fs.carrier,
       fs.service,
       COUNT(*) as shipment_count,
       AVG(fs.actual_delivery_date - fs.ship_date) as avg_delivery_days,
       AVG(fs.actual_delivery_date - fs.estimated_delivery_date) as avg_delay_days
FROM fulfilment_shipments fs
WHERE fs.ship_date IS NOT NULL
  AND fs.actual_delivery_date IS NOT NULL
  AND fs.tenant_id = 1
GROUP BY fs.carrier, fs.service
ORDER BY shipment_count DESC;
```

**Get inventory movements for a product:**
```sql
SELECT im.*,
       fl.name as from_location_name,
       tl.name as to_location_name,
       s.name as staff_name
FROM inv_movements im
LEFT JOIN locations fl ON im.from_location_id = fl.id
LEFT JOIN locations tl ON im.to_location_id = tl.id
LEFT JOIN hr_staff s ON im.performed_by = s.id
WHERE im.product_id = 'PROD-001'
  AND im.tenant_id = 1
ORDER BY im.movement_date DESC;
```

**Get movements by shipment:**
```sql
SELECT im.*,
       fs.shipment_number as fulfilment_shipment,
       lin.code as inbound_shipment,
       lout.code as outbound_shipment
FROM inv_movements im
LEFT JOIN fulfilment_shipments fs ON im.shipment_id = fs.id
LEFT JOIN logistic_inbounds lin ON im.inbound_shipment_id = lin.id
LEFT JOIN logistic_outbounds lout ON im.outbound_shipment_id = lout.id
WHERE (im.shipment_id = 789 
   OR im.inbound_shipment_id = 123 
   OR im.outbound_shipment_id = 456)
  AND im.tenant_id = 1
ORDER BY im.movement_date;
```

**Get movements by movement type:**
```sql
SELECT movement_type,
       COUNT(*) as movement_count,
       SUM(CASE WHEN quantity_change > 0 THEN quantity_change ELSE 0 END) as total_increase,
       SUM(CASE WHEN quantity_change < 0 THEN ABS(quantity_change) ELSE 0 END) as total_decrease
FROM inv_movements
WHERE tenant_id = 1
GROUP BY movement_type
ORDER BY movement_count DESC;
```

**Get movements by location:**
```sql
SELECT im.*,
       l.name as location_name
FROM inv_movements im
JOIN locations l ON (im.from_location_id = l.id OR im.to_location_id = l.id)
WHERE (im.from_location_id = 5 OR im.to_location_id = 5)
  AND im.tenant_id = 1
ORDER BY im.movement_date DESC;
```

**Get movements by order:**
```sql
SELECT im.*,
       o.order_number,
       o.status as order_status
FROM inv_movements im
JOIN orders o ON im.order_id = o.id
WHERE im.order_id = 101
  AND im.tenant_id = 1
ORDER BY im.movement_date;
```

**Get adjustment movements:**
```sql
SELECT im.*,
       fl.name as from_location_name,
       s.name as staff_name
FROM inv_movements im
LEFT JOIN locations fl ON im.from_location_id = fl.id
LEFT JOIN hr_staff s ON im.performed_by = s.id
WHERE im.movement_type = 'adjustment'
  AND im.tenant_id = 1
ORDER BY im.movement_date DESC;
```

**Get transfer movements:**
```sql
SELECT im.*,
       fl.name as from_location_name,
       tl.name as to_location_name,
       s.name as staff_name
FROM inv_movements im
JOIN locations fl ON im.from_location_id = fl.id
JOIN locations tl ON im.to_location_id = tl.id
LEFT JOIN hr_staff s ON im.performed_by = s.id
WHERE im.movement_type = 'transfer'
  AND im.tenant_id = 1
ORDER BY im.movement_date DESC;
```

**Get movements with cost analysis:**
```sql
SELECT im.movement_type,
       im.product_id,
       im.sku,
       COUNT(*) as movement_count,
       SUM(im.quantity_change) as total_quantity_change,
       AVG(im.unit_cost) as avg_unit_cost,
       SUM(im.quantity_change * im.unit_cost) as total_cost
FROM inv_movements im
WHERE im.unit_cost IS NOT NULL
  AND im.tenant_id = 1
GROUP BY im.movement_type, im.product_id, im.sku
ORDER BY total_cost DESC;
```

**Get movements by date range:**
```sql
SELECT im.*,
       fl.name as from_location_name,
       tl.name as to_location_name
FROM inv_movements im
LEFT JOIN locations fl ON im.from_location_id = fl.id
LEFT JOIN locations tl ON im.to_location_id = tl.id
WHERE im.movement_date >= '2024-01-01'
  AND im.movement_date < '2024-02-01'
  AND im.tenant_id = 1
ORDER BY im.movement_date;
```

**Get movements by staff member:**
```sql
SELECT im.*,
       s.name as staff_name,
       fl.name as from_location_name,
       tl.name as to_location_name
FROM inv_movements im
JOIN hr_staff s ON im.performed_by = s.id
LEFT JOIN locations fl ON im.from_location_id = fl.id
LEFT JOIN locations tl ON im.to_location_id = tl.id
WHERE im.performed_by = 456
  AND im.tenant_id = 1
ORDER BY im.movement_date DESC;
```

**Get movements with quantity validation errors:**
```sql
SELECT im.*,
       (im.quantity_before + im.quantity_change) as calculated_quantity_after,
       im.quantity_after as stored_quantity_after
FROM inv_movements im
WHERE im.quantity_before IS NOT NULL
  AND im.quantity_after IS NOT NULL
  AND im.quantity_after != (im.quantity_before + im.quantity_change)
  AND im.tenant_id = 1;
```

**Get movement summary by product and location:**
```sql
SELECT im.product_id,
       im.sku,
       im.to_location_id as location_id,
       l.name as location_name,
       SUM(CASE WHEN im.quantity_change > 0 THEN im.quantity_change ELSE 0 END) as total_received,
       SUM(CASE WHEN im.quantity_change < 0 THEN ABS(im.quantity_change) ELSE 0 END) as total_shipped,
       SUM(im.quantity_change) as net_change
FROM inv_movements im
LEFT JOIN locations l ON im.to_location_id = l.id
WHERE im.tenant_id = 1
GROUP BY im.product_id, im.sku, im.to_location_id, l.name
ORDER BY im.product_id, im.to_location_id;
```

---

