# CRM Module Schema

## Overview
This document provides a complete skeleton map and detailed listing of all CRM-related tables in the ERP system. The CRM module manages customer relationships, leads, opportunities, personal data, addresses, contacts, customer journey tracking, re-engagement campaigns, and integrates with Orders, Marketing, Projects, and SMS services.

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
│                        CRM MODULE SCHEMA                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    sys_tenants (Multi-tenant)                    │
│  ────────────────────────────────────────────────────────────  │
│  • Multi-tenant boundary for all CRM data                       │
│  • Tracks: name, slug, plan, status, settings                   │
└─────────────────────────────────────────────────────────────────┘
         │
         ├─── 1:N ────► sys_users (primary_tenant_id)
         ├─── 1:N ────► crm_customers (tenant_id)
         ├─── 1:N ────► crm_leads (tenant_id)
         ├─── 1:N ────► crm_potential (tenant_id)
         ├─── 1:N ────► orders (tenant_id)
         ├─── 1:N ────► mkt_campaigns (tenant_id)
         └─── 1:N ────► project (tenant_id)


┌─────────────────────────────────────────────────────────────────┐
│                    crm_personal_keys                             │
│  ────────────────────────────────────────────────────────────  │
│  • Canonical person identifier used across CRM                 │
│  • Tracks: external_key (unique), created_at                    │
│  • Central hub for all person-related data                      │
└─────────────────────────────────────────────────────────────────┘
         │
         ├─── 1:N ────► crm_personal_contacts (personal_key_id)
         ├─── 1:N ────► crm_personal_addresses (personal_key_id)
         ├─── 1:N ────► crm_personal_profile (personal_key_id)
         ├─── 1:N ────► crm_personal_journey (personal_key_id)
         ├─── 1:N ────► crm_leads (personal_key_id)
         ├─── 1:N ────► crm_customers (personal_key_id)
         └─── 1:N ────► crm_reengage_personal_keys (personal_key_id)


┌─────────────────────────────────────────────────────────────────┐
│                  crm_personal_contacts                           │
│  ────────────────────────────────────────────────────────────  │
│  • Multiple contacts per person (email, phone, social)         │
│  • Tracks: contact_type, contact_value, verification status    │
│  • Links to: leads (current and original)                      │
└─────────────────────────────────────────────────────────────────┘
         │
         ├─── N:1 ────► crm_personal_keys (personal_key_id)
         ├─── N:1 ────► crm_leads (lead_id)
         └─── N:1 ────► crm_leads (original_lead_id)


┌─────────────────────────────────────────────────────────────────┐
│                 crm_personal_addresses                           │
│  ────────────────────────────────────────────────────────────  │
│  • Address information for persons                              │
│  • Tracks: type, address fields, is_default                    │
└─────────────────────────────────────────────────────────────────┘
         │
         ├─── N:1 ────► crm_personal_keys (personal_key_id)
         └─── 1:N ────► orders (billing_address_id, shipping_address_id)


┌─────────────────────────────────────────────────────────────────┐
│                  crm_personal_profile                            │
│  ────────────────────────────────────────────────────────────  │
│  • Profile data with custom attributes                         │
│  • Tracks: birth_date, display_name, title, notes              │
│  • Custom attributes stored as JSONB                            │
└─────────────────────────────────────────────────────────────────┘
         │
         └─── N:1 ────► crm_personal_keys (personal_key_id)


┌─────────────────────────────────────────────────────────────────┐
│                  crm_personal_journey                            │
│  ────────────────────────────────────────────────────────────  │
│  • Timeline entries for person's journey                        │
│  • Tracks: stage, emotion, next_action, summary                │
│  • AI/analytics: confidence_score, sentiment_score              │
└─────────────────────────────────────────────────────────────────┘
         │
         ├─── N:1 ────► crm_personal_keys (personal_key_id)
         └─── N:1 ────► sys_users (recorded_by, logical)


┌─────────────────────────────────────────────────────────────────┐
│                      crm_leads                                   │
│  ────────────────────────────────────────────────────────────  │
│  • Lead lifecycle prior to or alongside customer               │
│  • Tracks: status, source, assigned_to, order_id               │
│  • Links to: orders, converts to customers                     │
└─────────────────────────────────────────────────────────────────┘
         │
         ├─── N:1 ────► crm_personal_keys (personal_key_id)
         ├─── N:1 ────► sys_users (assigned_to)
         ├─── N:1 ────► orders (order_id)
         ├─── N:1 ────► sys_tenants (tenant_id)
         └─── 1:N ────► crm_customers (first_lead_id)


┌─────────────────────────────────────────────────────────────────┐
│                    crm_customers                                 │
│  ────────────────────────────────────────────────────────────  │
│  • Canonical customer record                                    │
│  • Tracks: lifetime_value, paid_orders_count, status             │
│  • Links to: first lead, re-engagement batches                  │
└─────────────────────────────────────────────────────────────────┘
         │
         ├─── N:1 ────► crm_personal_keys (personal_key_id)
         ├─── N:1 ────► sys_tenants (tenant_id)
         ├─── N:1 ────► crm_leads (first_lead_id)
         ├─── N:1 ────► crm_reengaged_batches (id_batch)
         ├─── 1:N ────► orders (id_customer)
         └─── 1:N ────► SMS_meta_conversation (customer_id_crm)


┌─────────────────────────────────────────────────────────────────┐
│                    crm_potential                                 │
│  ────────────────────────────────────────────────────────────  │
│  • Sales opportunity/pipeline entity                            │
│  • Tracks: status, stage, priority, estimated_value             │
│  • Links to: campaigns, orders (conversion)                     │
└─────────────────────────────────────────────────────────────────┘
         │
         ├─── N:1 ────► crm_personal_keys (personal_key_id)
         ├─── N:1 ────► sys_users (assigned_to)
         ├─── N:1 ────► mkt_campaigns (campaign_id)
         ├─── N:1 ────► orders (converted_to_order_id)
         └─── N:1 ────► sys_tenants (tenant_id)


┌─────────────────────────────────────────────────────────────────┐
│                 crm_reengaged_batches                            │
│  ────────────────────────────────────────────────────────────  │
│  • Re-engagement campaign grouping                             │
│  • Tracks: batch_name, status, date range, metrics              │
│  • Created by staff                                             │
└─────────────────────────────────────────────────────────────────┘
         │
         ├─── 1:N ────► crm_reengage_personal_keys (batch_id)
         └─── 1:N ────► crm_reengage_batches_stats (batch_id)


┌─────────────────────────────────────────────────────────────────┐
│              crm_reengage_personal_keys                          │
│  ────────────────────────────────────────────────────────────  │
│  • Batch membership and contact outcomes                        │
│  • Tracks: status, priority, contact attempts, conversion      │
│  • Links to: orders (converted_order_id)                        │
└─────────────────────────────────────────────────────────────────┘
         │
         ├─── N:1 ────► crm_reengaged_batches (batch_id)
         ├─── N:1 ────► crm_personal_keys (personal_key_id)
         ├─── N:1 ────► sys_users (assigned_to)
         └─── N:1 ────► orders (converted_order_id)


┌─────────────────────────────────────────────────────────────────┐
│              crm_reengage_batches_stats                          │
│  ────────────────────────────────────────────────────────────  │
│  • Aggregations by day/batch                                   │
│  • Tracks: snapshot_date, totals, metrics, rates                │
└─────────────────────────────────────────────────────────────────┘
         │
         └─── N:1 ────► crm_reengaged_batches (batch_id)


┌─────────────────────────────────────────────────────────────────┐
│                    REFERENCED TABLES (External)                  │
│  ────────────────────────────────────────────────────────────  │
│  • sys_users             - Staff/employee accounts (system users) │
│    └── Referenced by: crm_leads.assigned_to,                   │
│        crm_potential.assigned_to,                               │
│        SMS_meta_conversation.assigned_staff_id,                 │
│        crm_personal_journey.recorded_by,                         │
│        crm_reengaged_batches.assigned_to,                       │
│        crm_reengaged_batches.created_by,                        │
│        crm_reengage_personal_keys.assigned_to,                  │
│        orders_after_sales.updated_by,                           │
│        project_tasks.id_assignee,                               │
│        project_tasks.assignee_by                                │
│  • orders                - Order records                         │
│    └── Referenced by: crm_leads.order_id,                      │
│        crm_potential.converted_to_order_id,                    │
│        crm_reengage_personal_keys.converted_order_id           │
│  • mkt_campaigns         - Marketing campaigns                  │
│    └── Referenced by: crm_potential.campaign_id,              │
│        SMS_service_accounts.linked_campaign_id                  │
│  • project                - Project management                   │
│    └── Referenced by: project_tasks.id_project,                │
│        SMS_service_accounts.linked_project_id                  │
│  • SMS_meta_conversation - SMS conversation analytics           │
│    └── Referenced by: crm_customers (via customer_id_crm)      │
└─────────────────────────────────────────────────────────────────┘


Relationship Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Person-Centric:
  crm_personal_keys 1──N crm_personal_contacts
  crm_personal_keys 1──N crm_personal_addresses
  crm_personal_keys 1──N crm_personal_profile
  crm_personal_keys 1──N crm_personal_journey
  crm_personal_keys 1──N crm_leads
  crm_personal_keys 1──N crm_customers
  crm_personal_keys 1──N crm_reengage_personal_keys

Lead/Opportunity:
  sys_users 1──N crm_leads.assigned_to
  sys_users 1──N crm_potential.assigned_to
  mkt_campaigns 1──N crm_potential
  crm_potential N──1 orders (via converted_to_order_id)
  crm_leads N──1 orders (via order_id)

Customer Lifecycle:
  crm_customers 1──N orders
  crm_customers 1──N SMS_meta_conversation
  crm_reengaged_batches 1──N crm_reengage_personal_keys
  crm_reengaged_batches 1──N crm_reengage_batches_stats

SMS to CRM:
  SMS_service_accounts N──1 mkt_campaigns
  SMS_service_accounts N──1 project
  SMS_meta_conversation N──1 crm_customers
  SMS_meta_conversation N──1 sys_users

Multi-tenant:
  sys_tenants 1──N crm_customers, crm_leads, crm_potential,
                  sys_users, orders, mkt_campaigns, project
```

---

## Table Details

### 1. `sys_tenants`
**Purpose:** Multi-tenant boundary for all CRM data, providing data isolation across tenants.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGINT | PRIMARY KEY, GENERATED BY DEFAULT AS IDENTITY | Tenant identifier |
| `name` | VARCHAR | NULL | Tenant name |
| `slug` | VARCHAR | UNIQUE | 🔒 Tenant slug (unique identifier) |
| `plan` | VARCHAR | NULL | Subscription plan |
| `status` | VARCHAR | NULL | Tenant status |
| `settings` | JSONB | NULL | Tenant-specific settings |
| `created_at` | TIMESTAMPTZ | NULL | ⏰ Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NULL | ⏰ Last update timestamp |

**Use Cases:**
- Multi-tenant data isolation
- Tenant-specific configuration
- Subscription management

---


### 2. `crm_personal_keys`
**Purpose:** Canonical person identifier used across CRM. Central hub for all person-related data.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | INTEGER | PRIMARY KEY | Personal key identifier |
| `external_key` | TEXT | UNIQUE | 🔒 External identifier (unique) |
| `created_at` | TIMESTAMPTZ | NULL | ⏰ Creation timestamp |

**Unique Constraints:**
- `external_key` (one key per person)

**Indexes:**
- `UNIQUE(external_key)` - Already defined 📊
- `idx_crm_personal_keys_created_at(created_at)` - Time-based queries 📊

**Use Cases:**
- Person identity management
- Cross-system integration
- Data deduplication

**Notes:**
- This is the central identifier for all person-related data
- All CRM entities link to this table via `personal_key_id`

---

### 4. `crm_personal_contacts`
**Purpose:** Multiple contacts per person (email, phone, social media). Relates to leads historically.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | INTEGER | PRIMARY KEY | Contact identifier |
| `personal_key_id` | INTEGER | FK → `crm_personal_keys(id)` | 🔗 Person identifier |
| `lead_id` | BIGINT | FK → `crm_leads(id)` | 🔗 Current lead |
| `original_lead_id` | BIGINT | FK → `crm_leads(id)` | 🔗 Original lead |
| `contact_type` | TEXT | NULL | Contact type (email, phone, social) |
| `contact_value` | TEXT | NULL | Contact value (email address, phone number, etc.) |
| `is_primary` | BOOLEAN | DEFAULT false | Primary contact flag |
| `is_verified` | BOOLEAN | DEFAULT false | Verification status |
| `verified_at` | TIMESTAMPTZ | NULL | ⏰ Verification timestamp |
| `platform_name` | TEXT | NULL | Platform name (for social contacts) |
| `platform_user_id` | TEXT | NULL | Platform user ID |
| `platform_page_id` | TEXT | NULL | Platform page ID |
| `platform_profile_url` | TEXT | NULL | Platform profile URL |
| `created_at` | TIMESTAMPTZ | NULL | ⏰ Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NULL | ⏰ Last update timestamp |

**Foreign Keys:**
- `personal_key_id` → `crm_personal_keys(id)`
- `lead_id` → `crm_leads(id)`
- `original_lead_id` → `crm_leads(id)`

**Indexes:**
- `idx_crm_personal_contacts_personal_key(personal_key_id, is_primary)` - Person lookup with primary filter 📊
- `idx_crm_personal_contacts_lead_id(lead_id)` - Lead lookup 📊
- `idx_crm_personal_contacts_contact_value(contact_value)` - Contact value lookup 📊
- `idx_crm_personal_contacts_type(contact_type)` - Type filtering 📊

**Use Cases:**
- Contact information management
- Multi-channel contact tracking
- Contact verification
- Social media integration

---

### 5. `crm_personal_addresses`
**Purpose:** Address information for persons. Used for billing and shipping in orders.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | INTEGER | PRIMARY KEY | Address identifier |
| `personal_key_id` | INTEGER | FK → `crm_personal_keys(id)` | 🔗 Person identifier |
| `type` | VARCHAR | DEFAULT 'primary' | Address type |
| `address_line1` | VARCHAR | NULL | Address line 1 |
| `address_line2` | VARCHAR | NULL | Address line 2 |
| `city` | VARCHAR | NULL | City |
| `state` | VARCHAR | NULL | State/Province |
| `country` | VARCHAR | NULL | Country |
| `postal_code` | VARCHAR | NULL | Postal/ZIP code |
| `is_default` | BOOLEAN | DEFAULT false | Default address flag |
| `created_at` | TIMESTAMPTZ | NULL | ⏰ Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NULL | ⏰ Last update timestamp |

**Foreign Keys:**
- `personal_key_id` → `crm_personal_keys(id)`

**Indexes:**
- `idx_crm_personal_addresses_personal_key(personal_key_id, is_default)` - Person lookup with default filter 📊
- `idx_crm_personal_addresses_type(type)` - Type filtering 📊

**Use Cases:**
- Address management
- Billing/shipping address selection
- Address validation

---

### 6. `crm_personal_profile`
**Purpose:** Profile data with custom attributes stored as JSONB. Additional person information.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | INTEGER | PRIMARY KEY | Profile identifier |
| `personal_key_id` | INTEGER | FK → `crm_personal_keys(id)` | 🔗 Person identifier |
| `birth_date` | DATE | NULL | Birth date |
| `custom_attributes` | JSONB | NULL | Custom attributes (flexible storage) |
| `notes` | TEXT | NULL | Profile notes |
| `display_name` | TEXT | NULL | Display name |
| `title` | TEXT | NULL | Title |
| `five_element` | TEXT | NULL | Five element classification |
| `intention` | TEXT | NULL | Intention/goal |
| `created_at` | TIMESTAMPTZ | NULL | ⏰ Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NULL | ⏰ Last update timestamp |

**Foreign Keys:**
- `personal_key_id` → `crm_personal_keys(id)`

**Indexes:**
- `idx_crm_personal_profile_personal_key(personal_key_id)` - Person lookup 📊
- `idx_crm_personal_profile_custom_attrs(custom_attributes)` - GIN index for JSONB queries 📊

**Use Cases:**
- Extended profile information
- Custom attribute storage
- Person categorization
- Notes and annotations

---

### 7. `crm_personal_journey`
**Purpose:** Timeline entries for a person's journey. Tracks stages, emotions, actions, and analytics.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | INTEGER | PRIMARY KEY | Journey entry identifier |
| `personal_key_id` | INTEGER | FK → `crm_personal_keys(id)` | 🔗 Person identifier |
| `stage` | VARCHAR | NULL | Journey stage |
| `emotion` | VARCHAR | NULL | Detected emotion |
| `next_action` | TEXT | NULL | Suggested next action |
| `summary_text` | TEXT | NULL | Summary text |
| `confidence_score` | NUMERIC | NULL | Confidence score |
| `sentiment_score` | NUMERIC | NULL | Sentiment score |
| `recorded_by` | BIGINT | NULL, FK → `sys_users(id)` | 🔗 Staff who recorded |
| `source` | TEXT | NULL | Source of journey entry |
| `interaction_type` | VARCHAR | NULL | Interaction type: 'email', 'sms', 'call', 'visit', 'chat' |
| `channel_id` | BIGINT | NULL, FK → `marketing_channels(id)` | 🔗 Marketing channel |
| `campaign_id` | BIGINT | NULL, FK → `mkt_campaigns(id)` | 🔗 Campaign |
| `store_id` | INTEGER | NULL, FK → `stores(id)` | 🔗 Store location |
| `brand_id` | BIGINT | NULL, FK → `brands(id)` | 🔗 Brand |
| `related_order_id` | BIGINT | NULL, FK → `orders(id)` | 🔗 Related order |
| `created_at` | TIMESTAMPTZ | NULL | ⏰ Creation timestamp |

**Foreign Keys:**
- `personal_key_id` → `crm_personal_keys(id)`
- `recorded_by` → `sys_users(id)`
- `channel_id` → `marketing_channels(id)`
- `campaign_id` → `mkt_campaigns(id)`
- `store_id` → `stores(id)`
- `brand_id` → `brands(id)`
- `related_order_id` → `orders(id)`

**Indexes:**
- `idx_crm_personal_journey_personal_key(personal_key_id, created_at)` - Person journey timeline 📊
- `idx_crm_personal_journey_recorded_by(recorded_by)` - Staff lookup 📊
- `idx_crm_personal_journey_stage(stage)` - Stage filtering 📊
- `idx_crm_personal_journey_created_at(created_at)` - Time-based queries 📊
- `idx_crm_personal_journey_interaction_type(interaction_type)` - Interaction type filtering 📊
- `idx_crm_personal_journey_channel_id(channel_id)` - Channel lookup 📊
- `idx_crm_personal_journey_campaign_id(campaign_id)` - Campaign lookup 📊
- `idx_crm_personal_journey_store_id(store_id)` - Store lookup 📊
- `idx_crm_personal_journey_brand_id(brand_id)` - Brand lookup 📊
- `idx_crm_personal_journey_related_order_id(related_order_id)` - Order lookup 📊

**Use Cases:**
- Customer journey tracking
- Timeline visualization
- AI-powered insights
- Sentiment analysis
- Multi-channel interaction tracking
- Campaign attribution
- Store visit tracking
- Order-related journey entries

---

### 8. `crm_leads`
**Purpose:** Lead lifecycle management prior to or alongside customer conversion.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGINT | PRIMARY KEY, GENERATED BY DEFAULT AS IDENTITY | Lead identifier |
| `personal_key_id` | INTEGER | FK → `crm_personal_keys(id)` | 🔗 Person identifier |
| `status` | VARCHAR | NULL | Lead status |
| `source` | VARCHAR | NULL | Lead source |
| `assigned_to` | BIGINT | NULL, FK → `sys_users(id)` | 🔗 Assigned staff |
| `order_id` | BIGINT | FK → `orders(id)` | 🔗 Linked order |
| `tenant_id` | BIGINT | NOT NULL, FK → `sys_tenants(id)` | 🔗 Tenant |
| `converted_at` | TIMESTAMPTZ | NULL | ⏰ Conversion timestamp |
| `created_at` | TIMESTAMPTZ | NULL | ⏰ Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NULL | ⏰ Last update timestamp |

**Foreign Keys:**
- `personal_key_id` → `crm_personal_keys(id)`
- `assigned_to` → `sys_users(id)`
- `order_id` → `orders(id)`
- `tenant_id` → `sys_tenants(id)`

**Indexes:**
- `idx_crm_leads_personal_key(personal_key_id)` - Person lookup 📊
- `idx_crm_leads_tenant_id(tenant_id)` - Tenant filtering 📊
- `idx_crm_leads_assigned_to(assigned_to)` - Staff assignment lookup 📊
- `idx_crm_leads_status(status)` - Status filtering 📊
- `idx_crm_leads_created_at(created_at)` - Time-based queries 📊

**Use Cases:**
- Lead management
- Lead conversion tracking
- Sales pipeline
- Assignment management

---

### 9. `crm_customers`
**Purpose:** Canonical customer record. Tracks lifetime value, order history, and customer status.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGINT | PRIMARY KEY, GENERATED BY DEFAULT AS IDENTITY | Customer identifier |
| `personal_key_id` | INTEGER | FK → `crm_personal_keys(id)` | 🔗 Person identifier |
| `lifetime_value` | NUMERIC | NULL | Customer lifetime value |
| `paid_orders_count` | INTEGER | NULL | Number of paid orders |
| `lead_status` | VARCHAR | NULL | Lead status |
| `potential_status` | VARCHAR | NULL | Potential status |
| `source` | VARCHAR | NULL | Customer source |
| `customer_rank` | VARCHAR | NULL | Customer rank/segment |
| `last_order_at` | TIMESTAMPTZ | NULL | ⏰ Last order timestamp |
| `tenant_id` | BIGINT | NOT NULL, FK → `sys_tenants(id)` | 🔗 Tenant |
| `first_lead_id` | BIGINT | FK → `crm_leads(id)` | 🔗 First lead |
| `id_batch` | INTEGER | FK → `crm_reengaged_batches(id)` | 🔗 Re-engagement batch |
| `created_at` | TIMESTAMPTZ | NULL | ⏰ Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NULL | ⏰ Last update timestamp |

**Foreign Keys:**
- `personal_key_id` → `crm_personal_keys(id)`
- `tenant_id` → `sys_tenants(id)`
- `first_lead_id` → `crm_leads(id)`
- `id_batch` → `crm_reengaged_batches(id)`

**Indexes:**
- `idx_crm_customers_personal_key(personal_key_id)` - Person lookup 📊
- `idx_crm_customers_tenant_id(tenant_id)` - Tenant filtering 📊
- `idx_crm_customers_first_lead_id(first_lead_id)` - First lead lookup 📊
- `idx_crm_customers_last_order_at(last_order_at)` - Recent customers 📊
- `idx_crm_customers_lifetime_value(lifetime_value)` - Value-based queries 📊

**Use Cases:**
- Customer management
- Lifetime value tracking
- Customer segmentation
- Re-engagement tracking

---

### 10. `crm_potential`
**Purpose:** Sales opportunity/pipeline entity. Tracks sales opportunities with stages, priorities, and conversion.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGINT | PRIMARY KEY | Potential identifier |
| `personal_key_id` | INTEGER | FK → `crm_personal_keys(id)` | 🔗 Person identifier |
| `assigned_to` | BIGINT | NULL, FK → `sys_users(id)` | 🔗 Assigned staff |
| `status` | VARCHAR | NULL | Opportunity status |
| `stage` | VARCHAR | NULL | Sales stage |
| `priority` | VARCHAR | NULL | Priority level |
| `campaign_id` | BIGINT | FK → `mkt_campaigns(id)` | 🔗 Marketing campaign |
| `converted_to_order_id` | BIGINT | FK → `orders(id)` | 🔗 Converted order |
| `tenant_id` | BIGINT | NOT NULL, FK → `sys_tenants(id)` | 🔗 Tenant |
| `estimated_value` | NUMERIC | NULL | Estimated opportunity value |
| `probability_score` | INTEGER | NULL | Probability score (0-100) |
| `expected_close_date` | DATE | NULL | Expected close date |
| `interested_products` | TEXT[] | NULL | Array of interested products |
| `created_at` | TIMESTAMPTZ | NULL | ⏰ Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NULL | ⏰ Last update timestamp |

**Foreign Keys:**
- `personal_key_id` → `crm_personal_keys(id)`
- `assigned_to` → `sys_users(id)`
- `campaign_id` → `mkt_campaigns(id)`
- `converted_to_order_id` → `orders(id)`
- `tenant_id` → `sys_tenants(id)`

**Indexes:**
- `idx_crm_potential_personal_key(personal_key_id)` - Person lookup 📊
- `idx_crm_potential_assigned_to(assigned_to)` - Staff assignment lookup 📊
- `idx_crm_potential_campaign_id(campaign_id)` - Campaign lookup 📊
- `idx_crm_potential_tenant_id(tenant_id)` - Tenant filtering 📊
- `idx_crm_potential_status_stage(status, stage)` - Status/stage filtering 📊
- `idx_crm_potential_expected_close_date(expected_close_date)` - Date-based queries 📊

**Use Cases:**
- Sales pipeline management
- Opportunity tracking
- Conversion tracking
- Campaign attribution

---

### 11. `crm_reengaged_batches`
**Purpose:** Re-engagement campaign grouping. Tracks batch campaigns for customer re-engagement.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | INTEGER | PRIMARY KEY | Batch identifier |
| `batch_name` | VARCHAR | NULL | Batch name |
| `assigned_to` | BIGINT | NULL, FK → `sys_users(id)` | 🔗 Assigned staff |
| `historical_value` | INTEGER | NULL | Historical value |
| `status` | VARCHAR | NULL | Batch status |
| `created_date` | DATE | NULL | Creation date |
| `target_size` | INTEGER | NULL | Target batch size |
| `start_date` | DATE | NULL | Start date |
| `end_date` | DATE | NULL | End date |
| `contacted_count` | INTEGER | NULL | Number contacted |
| `response_count` | INTEGER | NULL | Number responded |
| `conversion_count` | INTEGER | NULL | Number converted |
| `reactivated_revenue` | NUMERIC | NULL | Reactivated revenue |
| `target_revenue` | NUMERIC | NULL | Target revenue |
| `target_response_rate` | NUMERIC | NULL | Target response rate |
| `created_by` | BIGINT | NULL, FK → `sys_users(id)` | 🔗 Created by staff |

**Foreign Keys:**
- `assigned_to` → `sys_users(id)`
- `created_by` → `sys_users(id)`

**Indexes:**
- `idx_crm_reengaged_batches_status(status)` - Status filtering 📊
- `idx_crm_reengaged_batches_created_date(created_date)` - Date-based queries 📊
- `idx_crm_reengaged_batches_dates(start_date, end_date)` - Date range queries 📊

**Use Cases:**
- Re-engagement campaign management
- Batch campaign tracking
- Performance metrics

---

### 12. `crm_reengage_personal_keys`
**Purpose:** Batch membership and contact outcomes. Tracks individual person participation in re-engagement batches.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGINT | PRIMARY KEY | Re-engagement entry identifier |
| `batch_id` | INTEGER | FK → `crm_reengaged_batches(id)` | 🔗 Batch identifier |
| `personal_key_id` | INTEGER | FK → `crm_personal_keys(id)` | 🔗 Person identifier |
| `assigned_to` | BIGINT | NULL, FK → `sys_users(id)` | 🔗 Assigned staff |
| `priority` | VARCHAR | NULL | Priority level |
| `status` | VARCHAR | NULL | Status (enum via check) |
| `contact_attempts` | INTEGER | NULL | Number of contact attempts |
| `last_contact_method` | VARCHAR | NULL | Last contact method used |
| `added_to_batch_at` | TIMESTAMPTZ | NULL | ⏰ Added to batch timestamp |
| `contacted_at` | TIMESTAMPTZ | NULL | ⏰ Contacted timestamp |
| `responded_at` | TIMESTAMPTZ | NULL | ⏰ Responded timestamp |
| `converted_at` | TIMESTAMPTZ | NULL | ⏰ Converted timestamp |
| `opted_out_at` | TIMESTAMPTZ | NULL | ⏰ Opted out timestamp |
| `converted_order_id` | BIGINT | FK → `orders(id)` | 🔗 Converted order |
| `conversion_value` | NUMERIC | NULL | Conversion value |
| `failure_reason` | VARCHAR | NULL | Failure reason |
| `notes` | TEXT | NULL | Notes |
| `updated_at` | TIMESTAMPTZ | NULL | ⏰ Last update timestamp |

**Foreign Keys:**
- `batch_id` → `crm_reengaged_batches(id)`
- `personal_key_id` → `crm_personal_keys(id)`
- `assigned_to` → `sys_users(id)`
- `converted_order_id` → `orders(id)`

**Indexes:**
- `idx_crm_reengage_personal_keys_batch_id(batch_id, personal_key_id, assigned_to, status)` - Batch lookup with filters 📊
- `idx_crm_reengage_personal_keys_personal_key(personal_key_id)` - Person lookup 📊
- `idx_crm_reengage_personal_keys_status(status)` - Status filtering 📊
- `idx_crm_reengage_personal_keys_priority(priority)` - Priority filtering 📊

**Use Cases:**
- Individual batch member tracking
- Contact attempt tracking
- Conversion tracking
- Performance analysis

---

### 13. `crm_reengage_batches_stats`
**Purpose:** Aggregations by day/batch. Daily snapshot of batch performance metrics.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGINT | PRIMARY KEY | Stats identifier |
| `batch_id` | INTEGER | FK → `crm_reengaged_batches(id)` | 🔗 Batch identifier |
| `snapshot_date` | DATE | NULL | Snapshot date |
| `contacted_count` | INTEGER | NULL | Contacted count |
| `response_count` | INTEGER | NULL | Response count |
| `conversion_count` | INTEGER | NULL | Conversion count |
| `revenue_generated` | NUMERIC | NULL | Revenue generated |
| `total_contacted` | INTEGER | NULL | Total contacted |
| `total_responses` | INTEGER | NULL | Total responses |
| `total_conversions` | INTEGER | NULL | Total conversions |
| `total_revenue` | NUMERIC | NULL | Total revenue |
| `response_rate` | NUMERIC | NULL | Response rate |
| `conversion_rate` | NUMERIC | NULL | Conversion rate |
| `avg_revenue_per_conversion` | NUMERIC | NULL | Average revenue per conversion |
| `sms_sent` | INTEGER | NULL | SMS sent count |
| `email_sent` | INTEGER | NULL | Email sent count |
| `phone_calls` | INTEGER | NULL | Phone calls count |
| `notes` | TEXT | NULL | Notes |

**Foreign Keys:**
- `batch_id` → `crm_reengaged_batches(id)`

**Indexes:**
- `idx_crm_reengage_batches_stats_batch_id(batch_id, snapshot_date)` - Batch stats lookup 📊
- `idx_crm_reengage_batches_stats_snapshot_date(snapshot_date)` - Date-based queries 📊

**Use Cases:**
- Batch performance tracking
- Daily metrics aggregation
- Reporting and analytics

---

### 14. `orders`
**Purpose:** Order records linked to customers. Financial and status tracking.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGINT | PRIMARY KEY | Order identifier |
| `id_customer` | BIGINT | FK → `crm_customers(id)` | 🔗 Customer identifier |
| `date_created` | TIMESTAMPTZ | NULL | ⏰ Order creation timestamp |
| `status` | VARCHAR | NULL | Order status |
| `total` | NUMERIC | NULL | Order total |
| `net_payment` | NUMERIC | NULL | Net payment amount |
| `total_refunded` | NUMERIC | NULL | Total refunded amount |
| `tenant_id` | BIGINT | NOT NULL, FK → `sys_tenants(id)` | 🔗 Tenant |
| `billing_address_id` | BIGINT | FK → `crm_personal_addresses(id)` | 🔗 Billing address |
| `shipping_address_id` | BIGINT | FK → `crm_personal_addresses(id)` | 🔗 Shipping address |
| `updated_at` | TIMESTAMPTZ | NULL | ⏰ Last update timestamp |

**Foreign Keys:**
- `id_customer` → `crm_customers(id)`
- `tenant_id` → `sys_tenants(id)`
- `billing_address_id` → `crm_personal_addresses(id)`
- `shipping_address_id` → `crm_personal_addresses(id)`

**Indexes:**
- `idx_orders_id_customer(id_customer, created_at, tenant_id)` - Customer order history 📊
- `idx_orders_tenant_id(tenant_id)` - Tenant filtering 📊
- `idx_orders_status(status)` - Status filtering 📊
- `idx_orders_date_created(date_created)` - Time-based queries 📊

**Use Cases:**
- Order management
- Customer order history
- Financial tracking
- Address management

---

### 15. `order_items`
**Purpose:** Order line items. Products and quantities in orders.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | INTEGER | PRIMARY KEY | Order item identifier |
| `order_id` | BIGINT | FK → `orders(id)` | 🔗 Order identifier |
| `product_id` | VARCHAR | NULL | Product identifier (temporary) |
| `quantity` | INTEGER | NULL | Quantity |
| `unit_price` | NUMERIC | NULL | Unit price |
| `total_price` | NUMERIC | NULL | Total price |
| `created_at` | TIMESTAMPTZ | NULL | ⏰ Creation timestamp |

**Foreign Keys:**
- `order_id` → `orders(id)`

**Indexes:**
- `idx_order_items_order_id(order_id)` - Order lookup 📊
- `idx_order_items_product_id(product_id)` - Product lookup 📊

**Use Cases:**
- Order line item management
- Product tracking
- Pricing calculations

---

### 16. `order_line_items_properties`
**Purpose:** Custom properties for order line items. Used by shipment_line_items.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | INTEGER | PRIMARY KEY | Property identifier |
| `order_id` | BIGINT | FK → `orders(id)` | 🔗 Order identifier |
| `order_item_id` | INTEGER | NULL | Order item identifier |
| `properties` | JSONB | NULL | Custom properties (flexible storage) |
| `is_preorder` | BOOLEAN | NULL | Preorder flag |
| `preorder_release_at` | TIMESTAMPTZ | NULL | ⏰ Preorder release timestamp |
| `preorder_notes` | TEXT | NULL | Preorder notes |
| `created_at` | TIMESTAMPTZ | NULL | ⏰ Creation timestamp |

**Foreign Keys:**
- `order_id` → `orders(id)`

**Indexes:**
- `idx_order_line_items_properties_order_id(order_id, order_item_id)` - Order/item lookup 📊
- `idx_order_line_items_properties_properties(properties)` - GIN index for JSONB queries 📊

**Use Cases:**
- Custom order item properties
- Preorder management
- Flexible property storage

---

### 17. `order_payments`
**Purpose:** Payment records for orders. Tracks payment methods, amounts, and status.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGINT | PRIMARY KEY | Payment identifier |
| `order_id` | BIGINT | FK → `orders(id)` | 🔗 Order identifier |
| `payment_method` | VARCHAR | NULL | Payment method |
| `amount` | NUMERIC | NULL | Payment amount |
| `status` | VARCHAR | NULL | Payment status |
| `transaction_id` | VARCHAR | NULL | Transaction identifier |
| `due_date` | TIMESTAMPTZ | NULL | ⏰ Due date |
| `paid_date` | TIMESTAMPTZ | NULL | ⏰ Paid date |
| `is_deposit` | BOOLEAN | NULL | Deposit flag |
| `created_at` | TIMESTAMPTZ | NULL | ⏰ Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NULL | ⏰ Last update timestamp |

**Foreign Keys:**
- `order_id` → `orders(id)`

**Indexes:**
- `idx_order_payments_order_id(order_id)` - Order lookup 📊
- `idx_order_payments_status(status)` - Status filtering 📊
- `idx_order_payments_paid_date(paid_date)` - Payment date queries 📊

**Use Cases:**
- Payment tracking
- Payment method management
- Transaction reconciliation

---

### 18. `order_refunds`
**Purpose:** Refund records for orders. Tracks refund amounts and methods.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | INTEGER | PRIMARY KEY | Refund identifier |
| `order_id` | BIGINT | FK → `orders(id)` | 🔗 Order identifier |
| `amount` | NUMERIC | NULL | Refund amount |
| `payment_method_id` | INTEGER | NULL | Payment method identifier |
| `created_at` | TIMESTAMPTZ | NULL | ⏰ Creation timestamp |

**Foreign Keys:**
- `order_id` → `orders(id)`

**Indexes:**
- `idx_order_refunds_order_id(order_id)` - Order lookup 📊
- `idx_order_refunds_created_at(created_at)` - Time-based queries 📊

**Use Cases:**
- Refund tracking
- Financial reconciliation
- Customer service

---

### 19. `orders_after_sales`
**Purpose:** After-sales service records. Tracks returns, exchanges, and support cases.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | INTEGER | PRIMARY KEY | After-sales identifier |
| `order_id` | BIGINT | FK → `orders(id)` | 🔗 Order identifier |
| `case_type` | VARCHAR | NULL | Case type |
| `status` | INTEGER | NULL | Status |
| `rma_code` | VARCHAR | NULL | RMA (Return Merchandise Authorization) code |
| `amount` | NUMERIC | NULL | Amount |
| `tracking_number` | VARCHAR | NULL | Tracking number |
| `details` | TEXT | NULL | Case details |
| `received_date` | DATE | NULL | Received date |
| `inquiry_date` | DATE | NULL | Inquiry date |
| `updated_by` | BIGINT | NULL, FK → `sys_users(id)` | 🔗 Updated by staff |
| `created_at` | TIMESTAMPTZ | NULL | ⏰ Creation timestamp |

**Foreign Keys:**
- `order_id` → `orders(id)`
- `updated_by` → `sys_users(id)`

**Indexes:**
- `idx_orders_after_sales_order_id(order_id)` - Order lookup 📊
- `idx_orders_after_sales_updated_by(updated_by)` - Staff lookup 📊
- `idx_orders_after_sales_status(status)` - Status filtering 📊
- `idx_orders_after_sales_rma_code(rma_code)` - RMA lookup 📊

**Use Cases:**
- After-sales service tracking
- Return management
- Customer support cases

---

### 20. `order_pre_orders`
**Purpose:** Pre-order records. Tracks pre-orders with status, category, and vendor information.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | INTEGER | PRIMARY KEY | Pre-order identifier |
| `order_id` | BIGINT | FK → `orders(id)` | 🔗 Order identifier |
| `status` | INTEGER | NULL | Pre-order status |
| `category` | VARCHAR | NULL | Category |
| `vendor` | VARCHAR | NULL | Vendor |
| `hold_until` | DATE | NULL | Hold until date |
| `processing_date` | DATE | NULL | Processing date |
| `reason` | TEXT | NULL | Reason |
| `notes` | TEXT | NULL | Notes |
| `updated_at` | TIMESTAMPTZ | NULL | ⏰ Last update timestamp |
| `created_at` | TIMESTAMPTZ | NULL | ⏰ Creation timestamp |

**Foreign Keys:**
- `order_id` → `orders(id)`

**Indexes:**
- `idx_order_pre_orders_order_id(order_id)` - Order lookup 📊
- `idx_order_pre_orders_status(status)` - Status filtering 📊
- `idx_order_pre_orders_hold_until(hold_until)` - Date-based queries 📊

**Use Cases:**
- Pre-order management
- Vendor coordination
- Release date tracking

---

### 21. `mkt_campaigns`
**Purpose:** Marketing campaigns. Links to CRM potential and SMS services.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGINT | PRIMARY KEY | Campaign identifier |
| `name` | VARCHAR | NULL | Campaign name |
| `status` | VARCHAR | NULL | Campaign status |
| `spend` | NUMERIC | NULL | Campaign spend |
| `budget` | NUMERIC | NULL | Campaign budget |
| `budget_cycle` | VARCHAR | NULL | Budget cycle |
| `tenant_id` | BIGINT | NOT NULL, FK → `sys_tenants(id)` | 🔗 Tenant |
| `time_start` | TIMESTAMPTZ | NULL | ⏰ Start timestamp |
| `time_end` | TIMESTAMPTZ | NULL | ⏰ End timestamp |
| `updated_at` | TIMESTAMPTZ | NULL | ⏰ Last update timestamp |
| `date_created` | TIMESTAMPTZ | NULL | ⏰ Creation timestamp |

**Foreign Keys:**
- `tenant_id` → `sys_tenants(id)`

**Indexes:**
- `idx_mkt_campaigns_tenant_id(tenant_id)` - Tenant filtering 📊
- `idx_mkt_campaigns_status(status)` - Status filtering 📊
- `idx_mkt_campaigns_dates(time_start, time_end)` - Date range queries 📊

**Use Cases:**
- Marketing campaign management
- Budget tracking
- Campaign attribution

---

### 22. `project`
**Purpose:** Project management. Links to SMS services and tasks. (See tasks_schema_map.md for full definition)

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGINT | PRIMARY KEY, GENERATED BY DEFAULT AS IDENTITY | Project identifier |
| `title` | VARCHAR | NULL | Project title |
| `status` | VARCHAR | NULL | Project status |
| `space_order` | INTEGER | NULL | Space order |
| `total_member` | INTEGER | NULL | Total members |
| `total_task` | INTEGER | NULL | Total tasks |
| `total_task_completed` | INTEGER | NULL | Total completed tasks |
| `date_time_start` | TIMESTAMPTZ | NULL | ⏰ Start timestamp |
| `date_time_end` | TIMESTAMPTZ | NULL | ⏰ End timestamp |
| `date_created` | TIMESTAMPTZ | NULL | ⏰ Creation timestamp |
| `tenant_id` | BIGINT | NOT NULL, FK → `sys_tenants(id)` | 🔗 Tenant |

**Foreign Keys:**
- `tenant_id` → `sys_tenants(id)`

**Indexes:**
- `idx_project_tenant_id(tenant_id)` - Tenant filtering 📊
- `idx_project_status(status)` - Status filtering 📊
- `idx_project_dates(date_time_start, date_time_end)` - Date range queries 📊

**Use Cases:**
- Project management
- Task organization
- Team collaboration

---

### 23. `project_tasks`
**Purpose:** Project tasks. Links to projects and staff assignees.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | INTEGER | PRIMARY KEY | Task identifier |
| `id_project` | BIGINT | NULL, FK → `project(id)` | 🔗 Project identifier |
| `id_assignee` | BIGINT | NULL, FK → `sys_users(id)` | 🔗 Assignee |
| `assignee_by` | BIGINT | NULL, FK → `sys_users(id)` | 🔗 Assigned by |
| `status` | VARCHAR | NULL | Task status |
| `deadline` | TIMESTAMPTZ | NULL | ⏰ Deadline |
| `date_updated` | TIMESTAMPTZ | NULL | ⏰ Last update timestamp |
| `date_completed` | TIMESTAMPTZ | NULL | ⏰ Completion timestamp |
| `date_created` | TIMESTAMPTZ | NULL | ⏰ Creation timestamp |
| `tenant_id` | BIGINT | NOT NULL, FK → `sys_tenants(id)` | 🔗 Tenant |

**Foreign Keys:**
- `id_project` → `project(id)`
- `tenant_id` → `sys_tenants(id)`
- `id_assignee` → `sys_users(id)`
- `assignee_by` → `sys_users(id)`

**Indexes:**
- `idx_project_tasks_id_project(id_project)` - Project lookup 📊
- `idx_project_tasks_tenant_id(tenant_id)` - Tenant filtering 📊
- `idx_project_tasks_status(status)` - Status filtering 📊
- `idx_project_tasks_deadline(deadline)` - Deadline queries 📊
- `idx_project_tasks_assignee(id_assignee)` - Assignee lookup 📊

**Use Cases:**
- Task management
- Project tracking
- Assignment management

---

### 24. `SMS_service_accounts`
**Purpose:** SMS service accounts linking to campaigns and projects. Binds messaging to campaigns/projects.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | UUID | PRIMARY KEY | Service account identifier |
| `sender_account_id` | UUID | FK → `SMS_sender_accounts(id)` | 🔗 Sender account |
| `linked_campaign_id` | BIGINT | NULL, FK → `mkt_campaigns(id)` | 🔗 Linked campaign |
| `linked_project_id` | BIGINT | NULL, FK → `project(id)` | 🔗 Linked project |

**Foreign Keys:**
- `sender_account_id` → `SMS_sender_accounts(id)`
- `linked_campaign_id` → `mkt_campaigns(id)`
- `linked_project_id` → `project(id)`

**Indexes:**
- `idx_sms_service_accounts_campaign(linked_campaign_id)` - Campaign lookup 📊
- `idx_sms_service_accounts_project(linked_project_id)` - Project lookup 📊

**Use Cases:**
- Campaign SMS integration
- Project SMS integration
- Service account management

**Notes:**
- See SMS Module Schema for full table definition

---

### 25. `SMS_messages`
**Purpose:** SMS messages linking to conversations and indirectly to CRM via conversation metadata.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | UUID | PRIMARY KEY | Message identifier |
| `sender_phone_number_id` | UUID | FK → `SMS_sender_phone_numbers(id)` | 🔗 Sender phone number |
| `service_account_id` | UUID | FK → `SMS_service_accounts(id)` | 🔗 Service account |
| `conversation_id` | VARCHAR | NULL | Conversation identifier (logical link to SMS_meta_conversation) |

**Foreign Keys:**
- `sender_phone_number_id` → `SMS_sender_phone_numbers(id)`
- `service_account_id` → `SMS_service_accounts(id)`

**Indexes:**
- `idx_sms_messages_conversation_id(conversation_id)` - Conversation lookup 📊
- `idx_sms_messages_service_account_id(service_account_id)` - Service account lookup 📊

**Use Cases:**
- Message tracking
- Conversation threading
- CRM integration

**Notes:**
- See SMS Module Schema for full table definition
- Logical link: `conversation_id` links to `SMS_meta_conversation.conversation_id`

---

### 26. `SMS_meta_conversation`
**Purpose:** CRM-facing conversation rollup. Links SMS conversations to CRM customers and staff.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | UUID | PRIMARY KEY | Conversation identifier |
| `conversation_id` | VARCHAR | UNIQUE | 🔒 Conversation ID (matches SMS_messages.conversation_id) |
| `customer_id_crm` | BIGINT | NULL, FK → `crm_customers(id)` | 🔗 CRM customer |
| `assigned_staff_id` | BIGINT | NULL, FK → `sys_users(id)` | 🔗 Assigned staff |

**Foreign Keys:**
- `customer_id_crm` → `crm_customers(id)`
- `assigned_staff_id` → `sys_users(id)`

**Unique Constraints:**
- `conversation_id` (one meta record per conversation)

**Indexes:**
- `UNIQUE(conversation_id)` - Already defined 📊
- `idx_sms_meta_conversation_customer_id_crm(customer_id_crm, assigned_staff_id, last_message_at)` - Customer/staff lookup 📊

**Use Cases:**
- CRM-SMS integration
- Customer conversation tracking
- Staff assignment

**Notes:**
- See SMS Module Schema for full table definition
- Logical link: `conversation_id` links to `SMS_messages.conversation_id`

---

### 27. `SMS_contacts`
**Purpose:** SMS contacts with optional linkage to CRM records.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | UUID | PRIMARY KEY | Contact identifier |
| `crm_id` | TEXT | NULL | CRM identifier (optional link to CRM records) |

**Indexes:**
- `idx_sms_contacts_crm_id(crm_id)` - CRM lookup 📊

**Use Cases:**
- Contact management
- CRM integration

**Notes:**
- See SMS Module Schema for full table definition

---

## Relationships Summary

### Person-Centric Relationships

1. **`crm_personal_keys` → `crm_personal_contacts`** (One-to-Many)
   - One person can have many contacts
   - `crm_personal_contacts.personal_key_id` → `crm_personal_keys.id`

2. **`crm_personal_keys` → `crm_personal_addresses`** (One-to-Many)
   - One person can have many addresses
   - `crm_personal_addresses.personal_key_id` → `crm_personal_keys.id`

3. **`crm_personal_keys` → `crm_personal_profile`** (One-to-Many)
   - One person can have profile data
   - `crm_personal_profile.personal_key_id` → `crm_personal_keys.id`

4. **`crm_personal_keys` → `crm_personal_journey`** (One-to-Many)
   - One person can have many journey entries
   - `crm_personal_journey.personal_key_id` → `crm_personal_keys.id`

5. **`crm_personal_keys` → `crm_leads`** (One-to-Many)
   - One person can have many leads
   - `crm_leads.personal_key_id` → `crm_personal_keys.id`

6. **`crm_personal_keys` → `crm_customers`** (One-to-Many)
   - One person can have customer records
   - `crm_customers.personal_key_id` → `crm_personal_keys.id`

7. **`crm_personal_keys` → `crm_reengage_personal_keys`** (One-to-Many)
   - One person can be in multiple re-engagement batches
   - `crm_reengage_personal_keys.personal_key_id` → `crm_personal_keys.id`

### Lead/Opportunity Relationships

8. **`sys_users` → `crm_leads`** (One-to-Many)
   - Staff can be assigned to many leads
   - `crm_leads.assigned_to` → `sys_users.id`

9. **`sys_users` → `crm_potential`** (One-to-Many)
   - Staff can be assigned to many opportunities
   - `crm_potential.assigned_to` → `sys_users.id`

10. **`mkt_campaigns` → `crm_potential`** (One-to-Many)
    - Campaigns can generate many opportunities
    - `crm_potential.campaign_id` → `mkt_campaigns.id`

11. **`crm_potential` → `orders`** (Many-to-One)
    - Opportunities can convert to orders
    - `crm_potential.converted_to_order_id` → `orders.id`

12. **`crm_leads` → `orders`** (Many-to-One)
    - Leads can link to orders
    - `crm_leads.order_id` → `orders.id`

### Customer Lifecycle Relationships

13. **`crm_customers` → `orders`** (One-to-Many)
    - Customers can place many orders
    - `orders.id_customer` → `crm_customers.id`

14. **`crm_customers` → `SMS_meta_conversation`** (One-to-Many)
    - Customers can have many SMS conversations
    - `SMS_meta_conversation.customer_id_crm` → `crm_customers.id`

15. **`crm_reengaged_batches` → `crm_reengage_personal_keys`** (One-to-Many)
    - Batches contain many personal keys
    - `crm_reengage_personal_keys.batch_id` → `crm_reengaged_batches.id`

16. **`crm_reengaged_batches` → `crm_reengage_batches_stats`** (One-to-Many)
    - Batches have many daily stats
    - `crm_reengage_batches_stats.batch_id` → `crm_reengaged_batches.id`

### SMS to CRM Relationships

17. **`SMS_service_accounts` → `mkt_campaigns`** (Many-to-One)
    - Service accounts can link to campaigns
    - `SMS_service_accounts.linked_campaign_id` → `mkt_campaigns.id`

18. **`SMS_service_accounts` → `project`** (Many-to-One)
    - Service accounts can link to projects
    - `SMS_service_accounts.linked_project_id` → `project.id`

19. **`SMS_meta_conversation` → `crm_customers`** (Many-to-One)
    - Conversations link to CRM customers
    - `SMS_meta_conversation.customer_id_crm` → `crm_customers.id`

20. **`SMS_meta_conversation` → `sys_users`** (Many-to-One)
    - Conversations can be assigned to staff
    - `SMS_meta_conversation.assigned_staff_id` → `sys_users.id`

21. **`SMS_meta_conversation` ↔ `SMS_messages`** (One-to-Many, Logical)
    - One conversation can have many messages
    - Linked via `SMS_messages.conversation_id` = `SMS_meta_conversation.conversation_id`
    - **Note:** Logical link (no FK constraint)

### Multi-Tenant Relationships

22. **`sys_tenants` → Multiple Tables** (One-to-Many)
    - All CRM tables support multi-tenancy
    - Tables: `crm_customers`, `crm_leads`, `crm_potential`, `sys_users`, `orders`, `mkt_campaigns`, `project`

---

## Index Recommendations

### Core CRM Tables

**`crm_personal_contacts`:**
- `idx_crm_personal_contacts_personal_key(personal_key_id, is_primary)` - Person lookup with primary filter 📊
- `idx_crm_personal_contacts_contact_value(contact_value)` - Contact value lookup 📊

**`crm_personal_addresses`:**
- `idx_crm_personal_addresses_personal_key(personal_key_id, is_default)` - Person lookup with default filter 📊

**`crm_customers`:**
- `idx_crm_customers_personal_key(personal_key_id)` - Person lookup 📊
- `idx_crm_customers_tenant_id(tenant_id)` - Tenant filtering 📊
- `idx_crm_customers_first_lead_id(first_lead_id)` - First lead lookup 📊

**`crm_leads`:**
- `idx_crm_leads_personal_key(personal_key_id)` - Person lookup 📊
- `idx_crm_leads_tenant_id(tenant_id)` - Tenant filtering 📊
- `idx_crm_leads_assigned_to(assigned_to)` - Staff assignment lookup (sys_users) 📊

**`crm_potential`:**
- `idx_crm_potential_personal_key(personal_key_id)` - Person lookup 📊
- `idx_crm_potential_assigned_to(assigned_to)` - Staff assignment lookup (sys_users) 📊
- `idx_crm_potential_campaign_id(campaign_id)` - Campaign lookup 📊
- `idx_crm_potential_tenant_id(tenant_id)` - Tenant filtering 📊

**`crm_reengage_personal_keys`:**
- `idx_crm_reengage_personal_keys_batch_id(batch_id, personal_key_id, assigned_to, status)` - Batch lookup with filters 📊

### Orders Domain

**`orders`:**
- `idx_orders_id_customer(id_customer, created_at, tenant_id)` - Customer order history 📊
- `idx_orders_tenant_id(tenant_id)` - Tenant filtering 📊

### SMS Integration

**`SMS_meta_conversation`:**
- `idx_sms_meta_conversation_customer_id_crm(customer_id_crm, assigned_staff_id, last_message_at)` - Customer/staff lookup 📊

**`SMS_messages`:**
- `idx_sms_messages_conversation_id(conversation_id)` - Conversation lookup 📊
- `idx_sms_messages_service_account_id(service_account_id)` - Service account lookup 📊

---

## Design Considerations

### Person-Centric Architecture

The CRM is built around `crm_personal_keys` as the central identifier:
- All person-related data links to `personal_key_id`
- Enables unified person view across leads, customers, contacts, addresses
- Supports data deduplication and identity resolution

### Multi-Tenancy

All CRM tables support multi-tenancy via `tenant_id`:
- Data isolation per tenant
- Tenant-specific configuration via `sys_tenants.settings`
- Indexes include `tenant_id` for efficient filtering

### Lead to Customer Conversion

- Leads can convert to customers via `crm_customers.first_lead_id`
- Leads can link to orders via `crm_leads.order_id`
- Customers track their first lead for attribution

### Re-Engagement Campaigns

- Batches group re-engagement efforts
- Individual tracking via `crm_reengage_personal_keys`
- Daily stats aggregation in `crm_reengage_batches_stats`
- Conversion tracking via `converted_order_id`

### SMS Integration

- SMS conversations link to CRM customers via `SMS_meta_conversation.customer_id_crm`
- Service accounts link to campaigns and projects
- Logical link between `SMS_messages.conversation_id` and `SMS_meta_conversation.conversation_id`

### Address Management

- Addresses stored in `crm_personal_addresses`
- Used for billing and shipping in orders
- Supports multiple addresses per person with default flag

### Custom Attributes

- `crm_personal_profile.custom_attributes` uses JSONB for flexible storage
- `order_line_items_properties.properties` uses JSONB for order item customization
- GIN indexes recommended for JSONB query performance

---

## Notes

- **Person Identity:** `crm_personal_keys` is the central hub for all person-related data
- **Multi-Tenancy:** All tables support tenant isolation via `tenant_id`
- **Lead Conversion:** Leads can convert to customers and link to orders
- **Re-Engagement:** Batch-based re-engagement with individual tracking and stats
- **SMS Integration:** Conversations link to CRM customers and staff assignments
- **Address Reuse:** Addresses can be reused across multiple orders
- **Custom Attributes:** JSONB fields enable flexible attribute storage
- **Performance:** Composite indexes recommended for common query patterns
- **Data Quality:** Consider validation triggers for contact values, addresses, and status enums

