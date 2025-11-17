# Omnichannel Integration Schema

## Overview
This document shows the complete Omnichannel Integration schema structure. The system manages messaging integration across all platforms (Facebook, Instagram, Zalo, YouTube, etc.) through various services (Pancake CRM, Meta Direct, etc.) and connects to the unified channels management system.

**Key Design Decision:** Unified structure for all platforms - one `omnichannel_contact` and one `omnichannel_message` table that works for Facebook, Instagram, Zalo, and any future platforms.

**Legend:**
- 🆕 **NEW** - Newly created tables
- 🔄 **NORMALIZED** - Comma-separated values moved to junction tables
- 🗑️ **REMOVED** - Fields/tables removed or consolidated
- ✏️ **RENAMED** - Table/column renamed
- ⭐ **ENHANCED** - Enhanced with enterprise features
- 🔗 **Foreign Key** - Relationship to another table

---

## Entity Relationship Diagram (ERD)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    OMNICHANNEL INTEGRATION ERD                               │
│              (Unified Structure for All Platforms)                            │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                    MARKETING MODULE (Channels)                                │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│ channels_platforms   │
│──────────────────────│
│ PK  id               │
│     tenant_id        │
│     name             │
│     platform_type    │ (facebook, instagram, youtube, zalo, etc.)
│     status           │
│     total_reach       │
│     total_engagement │
│     total_budget      │
│     page_count        │
│     metadata (JSONB) │
│     created_at       │
│     updated_at       │
│     deleted_at       │
└────┬─────────────────┘
     │
     │ 1:N
     │
     ▼
┌──────────────────────┐
│channels_platform_pages│
│──────────────────────│
│ PK  id               │
│     tenant_id        │
│ FK  platform_id ─────┼───► channels_platforms.id (CASCADE)
│     name             │
│     entity_id        │ (page_id_meta, account_id, channel_id, etc.)
│     entity_id_secondary│ (page_id_pancake, etc.)
│     reach            │
│     engagement       │
│     status           │
│     budget            │
│     metadata (JSONB) │
│     created_at       │
│     updated_at       │
│     deleted_at       │
└──────────────────────┘
     │
     │ Referenced by Omnichannel (ALL platforms)
     │
     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│              OMNICHANNEL MODULE (Unified for All Platforms)                 │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│  omnichannel_contact │ (Unified: Facebook, Instagram, Zalo, YouTube, etc.)
│──────────────────────│
│ PK  id               │
│     tenant_id        │
│ FK  page_id ─────────┼───► channels_platform_pages.id (SET NULL)
│     personal_key_id  │ (Key to crm_personal_keys, NOT FK)
│     platform_user_id │ (Generic: fb_id, instagram_user_id, zalo_user_id, etc.)
│     external_customer_id│ (Generic: pancake_customer_id, meta_customer_id, etc.)
│     integration_via │ (pancake, meta, direct, custom, etc.)
│     link             │
│     metadata (JSONB) │ (Platform-specific data)
│     created_at       │
│     updated_at       │
│ UK  (tenant_id, personal_key_id, external_customer_id, integration_via)
└────┬─────────────────┘
     │
     │ 1:N
     │
     ▼
┌──────────────────────┐
│ omnichannel_message  │ (Unified: Facebook, Instagram, Zalo, YouTube, etc.)
│──────────────────────│
│ PK  id               │
│     tenant_id        │
│ FK  page_id ─────────┼───► channels_platform_pages.id (CASCADE)
│ FK  contact_id ─────┼───► omnichannel_contact.id (SET NULL)
│ FK  admin_id ────────┼───► staff.id (SET NULL)
│     conversation_id  │
│     sender_type      │ (user, admin, system)
│     sender_name      │
│     message (TEXT)    │
│     attachments(JSONB)│
│     created_at       │
└──────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                        EXTERNAL SYSTEMS                                      │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│   Pancake CRM        │ (Integration Service)
│──────────────────────│
│   • page_id_pancake  │ → channels_platform_pages.entity_id_secondary
│   • customer_id      │ → omnichannel_contact.external_customer_id
│   • integration_via  │ = 'pancake'
└──────────────────────┘

┌──────────────────────┐
│   Meta/Facebook      │ (Direct Integration)
│──────────────────────│
│   • page_id_meta     │ → channels_platform_pages.entity_id
│   • customer_id      │ → omnichannel_contact.external_customer_id
│   • integration_via │ = 'meta'
└──────────────────────┘

┌──────────────────────┐
│   Zalo               │ (Direct Integration)
│──────────────────────│
│   • zalo_page_id     │ → channels_platform_pages.entity_id
│   • customer_id      │ → omnichannel_contact.external_customer_id
│   • integration_via │ = 'zalo'
└──────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                        INTERNAL SYSTEMS                                      │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│  crm_personal_keys   │ (CRM Module)
│──────────────────────│
│ PK  id               │
│     external_key     │
└──────────────────────┘
     ▲
     │ (logical link via personal_key_id)
     │
     └─── omnichannel_contact.personal_key_id (VARCHAR, NOT FK)

┌──────────────────────┐
│      staff           │ (HR Module)
│──────────────────────│
│ PK  id               │
│     full_name        │
└──────────────────────┘
     ▲
     │
     └─── omnichannel_message.admin_id (FK)

┌─────────────────────────────────────────────────────────────────────────────┐
│                              RELATIONSHIP SUMMARY                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Channel Hierarchy:                                                          │
│    channels_platforms ──1:N──► channels_platform_pages                      │
│                                                                              │
│  Omnichannel Integration (Unified for ALL Platforms):                       │
│    channels_platform_pages ──1:N──► omnichannel_contact                     │
│    channels_platform_pages ──1:N──► omnichannel_message                    │
│    omnichannel_contact ──0:N──► omnichannel_message                        │
│                                                                              │
│  Platform Identification:                                                    │
│    • Join: omnichannel_contact.page_id → channels_platform_pages.id         │
│    • Then: channels_platform_pages.platform_id → channels_platforms.id     │
│    • Get: channels_platforms.platform_type (facebook, instagram, zalo, etc.)│
│                                                                              │
│  Integration Flexibility:                                                    │
│    • omnichannel_contact.integration_via: 'pancake', 'meta', 'direct', etc. │
│    • omnichannel_contact.external_customer_id: Generic external customer ID│
│    • Supports multiple integration services per contact                     │
│    • One contact can have multiple external_customer_ids (different services)│
│                                                                              │
│  External System Mapping:                                                    │
│    • Pancake: page_id_pancake → channels_platform_pages.entity_id_secondary│
│    • Meta: page_id_meta → channels_platform_pages.entity_id                 │
│    • Zalo: zalo_page_id → channels_platform_pages.entity_id                │
│    • Customer IDs stored in external_customer_id with integration_via tag   │
│                                                                              │
│  Internal System Links:                                                      │
│    • omnichannel_contact.personal_key_id → crm_personal_keys.external_key   │
│      (logical link, not FK - allows flexibility)                            │
│    • omnichannel_message.admin_id → staff.id (FK)                          │
│                                                                              │
│  Multi-Tenancy:                                                              │
│    • All tables include tenant_id for data isolation                        │
│    • Unique constraints are tenant-scoped                                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                            KEY DESIGN DECISIONS                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. Unified Structure (NOT Platform-Specific Tables):                         │
│     • ONE omnichannel_contact table for ALL platforms                      │
│     • ONE omnichannel_message table for ALL platforms                      │
│     • Platform type determined by joining to channels_platforms            │
│     • Avoids table proliferation (no facebook_contact, instagram_contact,  │
│       zalo_contact, etc.)                                                    │
│                                                                              │
│  2. Unified Channels:                                                       │
│     • channels_platform_pages replaces platform-specific page tables        │
│     • Supports all platforms (Facebook, Instagram, YouTube, Zalo, etc.)   │
│     • Platform type stored in channels_platforms.platform_type            │
│                                                                              │
│  3. Generic External IDs:                                                   │
│     • external_customer_id replaces platform-specific customer IDs         │
│     • integration_via identifies which service provided the ID             │
│     • platform_user_id for platform-specific user identifiers             │
│     • One contact can have multiple external_customer_ids (different services)│
│                                                                              │
│  4. Integration Service Tracking:                                          │
│     • integration_via column tracks which service integrated the contact   │
│     • Allows multiple integration services per platform                   │
│     • Example: Same contact via Pancake AND Meta direct integration       │
│                                                                              │
│  5. Flexible Contact Mapping:                                              │
│     • personal_key_id links to CRM (logical, not FK for flexibility)      │
│     • external_customer_id + integration_via for external systems         │
│     • platform_user_id for platform-specific identifiers                  │
│     • metadata JSONB for platform-specific data                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                            EXAMPLE QUERIES                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Get all Facebook contacts:                                                 │
│  ────────────────────────────────────────────────────────────────────────  │
│  SELECT oc.*                                                                 │
│  FROM omnichannel_contact oc                                                │
│  JOIN channels_platform_pages cpp ON oc.page_id = cpp.id                    │
│  JOIN channels_platforms cp ON cpp.platform_id = cp.id                     │
│  WHERE cp.platform_type = 'facebook'                                        │
│    AND oc.tenant_id = ?;                                                    │
│                                                                              │
│  Get all Instagram messages:                                                │
│  ────────────────────────────────────────────────────────────────────────  │
│  SELECT om.*                                                                 │
│  FROM omnichannel_message om                                                │
│  JOIN channels_platform_pages cpp ON om.page_id = cpp.id                   │
│  JOIN channels_platforms cp ON cpp.platform_id = cp.id                     │
│  WHERE cp.platform_type = 'instagram'                                       │
│    AND om.tenant_id = ?;                                                    │
│                                                                              │
│  Get contacts by integration service:                                       │
│  ────────────────────────────────────────────────────────────────────────  │
│  SELECT oc.*                                                                 │
│  FROM omnichannel_contact oc                                                │
│  WHERE oc.integration_via = 'pancake'                                       │
│    AND oc.tenant_id = ?;                                                    │
│                                                                              │
│  Get all contacts for a specific page:                                      │
│  ────────────────────────────────────────────────────────────────────────  │
│  SELECT oc.*                                                                 │
│  FROM omnichannel_contact oc                                                │
│  WHERE oc.page_id = ?                                                       │
│    AND oc.tenant_id = ?;                                                    │
│                                                                              │
│  Get messages with platform info:                                           │
│  ────────────────────────────────────────────────────────────────────────  │
│  SELECT                                                                      │
│    om.*,                                                                     │
│    cp.platform_type,                                                         │
│    cpp.name as page_name                                                    │
│  FROM omnichannel_message om                                                │
│  JOIN channels_platform_pages cpp ON om.page_id = cpp.id                    │
│  JOIN channels_platforms cp ON cpp.platform_id = cp.id                     │
│  WHERE om.tenant_id = ?;                                                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                            EXAMPLE DATA                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Facebook Contact (via Pancake):                                            │
│  ────────────────────────────────────────────────────────────────────────  │
│  omnichannel_contact:                                                       │
│    - page_id: 1 (channels_platform_pages.id where platform_type='facebook')│
│    - personal_key_id: "PERSON-123"                                           │
│    - platform_user_id: "FB_USER_456"                                       │
│    - external_customer_id: "PANC_CUST_789"                                   │
│    - integration_via: "pancake"                                              │
│                                                                              │
│  Instagram Contact (via Meta Direct):                                        │
│  ────────────────────────────────────────────────────────────────────────  │
│  omnichannel_contact:                                                       │
│    - page_id: 2 (channels_platform_pages.id where platform_type='instagram')│
│    - personal_key_id: "PERSON-123" (same person, different platform)       │
│    - platform_user_id: "@shopchinhthuc"                                     │
│    - external_customer_id: "META_CUST_321"                                  │
│    - integration_via: "meta"                                                 │
│                                                                              │
│  Zalo Contact (via Direct):                                                 │
│  ────────────────────────────────────────────────────────────────────────  │
│  omnichannel_contact:                                                       │
│    - page_id: 3 (channels_platform_pages.id where platform_type='zalo')   │
│    - personal_key_id: "PERSON-123" (same person, different platform)       │
│    - platform_user_id: "ZALO_USER_999"                                      │
│    - external_customer_id: "ZALO_CUST_888"                                  │
│    - integration_via: "direct"                                               │
│                                                                              │
│  Note: Same person (personal_key_id) can have contacts on multiple        │
│        platforms, each with different integration services                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Table Details

### 1. `omnichannel_contact` 🆕 NEW
**Status**: Unified contact table for all messaging platforms (Facebook, Instagram, Zalo, YouTube, etc.)

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `tenant_id` | BIGINT | NOT NULL, FK → `sys_tenants(id)` | 🔗 Multi-tenancy support |
| `page_id` | BIGINT | FK → `channels_platform_pages.id`, DEFAULT NULL | 🔗 Platform page/account |
| `personal_key_id` | VARCHAR(256) | NOT NULL | Personal identifier (links to `crm_personal_keys.external_key`, NOT FK) |
| `platform_user_id` | VARCHAR(200) | DEFAULT NULL | Platform-specific user ID (fb_id, instagram_user_id, zalo_user_id, etc.) |
| `external_customer_id` | VARCHAR(256) | DEFAULT NULL | Generic external customer ID (pancake_customer_id, meta_customer_id, etc.) |
| `integration_via` | VARCHAR(50) | DEFAULT NULL | Integration service: 'pancake', 'meta', 'direct', 'custom', 'zalo', etc. |
| `link` | VARCHAR(500) | DEFAULT NULL | Contact link/URL |
| `metadata` | JSONB | DEFAULT NULL | Platform-specific metadata |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT CURRENT_TIMESTAMP | ⏰ Creation timestamp |
| `updated_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | ⏰ Last update timestamp |

**Constraints:**
- UNIQUE(`tenant_id`, `personal_key_id`, `external_customer_id`, `integration_via`) WHERE `external_customer_id` IS NOT NULL
- CHECK(`personal_key_id` != '') - Personal key ID cannot be empty
- CHECK(`link` IS NULL OR `link` != '') - Link cannot be empty string if provided
- CHECK(`integration_via` IS NULL OR `integration_via` IN ('pancake', 'meta', 'direct', 'custom', 'zalo', 'other')) - Validate integration service

**Foreign Keys:**
- `page_id` → `channels_platform_pages(id)` ON DELETE SET NULL
- `tenant_id` → `sys_tenants(id)`

**Indexes:**
- `idx_omnichannel_contact_tenant` (tenant_id) - Multi-tenancy index
- `idx_omnichannel_contact_page` (page_id) - Page queries
- `idx_omnichannel_contact_personal_key_id` (personal_key_id) - Personal key ID queries
- `idx_omnichannel_contact_external_customer` (external_customer_id) WHERE external_customer_id IS NOT NULL - Partial index
- `idx_omnichannel_contact_integration_via` (integration_via) - Integration service queries
- `idx_omnichannel_contact_platform_user_id` (platform_user_id) WHERE platform_user_id IS NOT NULL - Partial index
- `idx_omnichannel_contact_tenant_personal` (tenant_id, personal_key_id) - Composite for tenant queries
- `idx_omnichannel_contact_tenant_page` (tenant_id, page_id) - Composite for tenant page queries

**Use Cases:**
- Store contacts from all messaging platforms
- Link contacts to CRM via `personal_key_id`
- Track which integration service provided the contact
- Support multiple integration services per platform
- Platform-specific data in `metadata` JSONB

---

### 2. `omnichannel_message` 🆕 NEW
**Status**: Unified message table for all messaging platforms (Facebook, Instagram, Zalo, YouTube, etc.)

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `tenant_id` | BIGINT | NOT NULL | Multi-tenancy support |
| `page_id` | BIGINT | FK → `channels_platform_pages.id`, NOT NULL | 🔗 Platform page/account |
| `contact_id` | BIGINT | FK → `omnichannel_contact.id`, DEFAULT NULL | 🔗 Link to contact if available |
| `admin_id` | BIGINT | FK → `staff.id`, DEFAULT NULL | 🔗 Staff member who sent message |
| `conversation_id` | VARCHAR(100) | DEFAULT NULL | Conversation thread ID |
| `sender_type` | VARCHAR(50) | DEFAULT NULL | Enum: 'user', 'admin', 'system' |
| `sender_name` | VARCHAR(256) | DEFAULT NULL | Sender display name |
| `message` | TEXT | DEFAULT NULL | Message content |
| `attachments` | JSONB | DEFAULT NULL | Attachments as JSONB array |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | ⏰ Creation timestamp |

**Constraints:**
- CHECK(`sender_type` IS NULL OR `sender_type` IN ('user', 'admin', 'system')) - Validate sender type enum
- CHECK(`message` IS NULL OR `message` != '') - Message cannot be empty string if provided

**Foreign Keys:**
- `page_id` → `channels_platform_pages(id)` ON DELETE CASCADE
- `contact_id` → `omnichannel_contact(id)` ON DELETE SET NULL
- `admin_id` → `staff(id)` ON DELETE SET NULL

**Indexes:**
- `idx_omnichannel_message_tenant` (tenant_id) - Multi-tenancy index
- `idx_omnichannel_message_page` (page_id) - Page queries
- `idx_omnichannel_message_contact` (contact_id) WHERE contact_id IS NOT NULL - Partial index
- `idx_omnichannel_message_admin` (admin_id) WHERE admin_id IS NOT NULL - Partial index
- `idx_omnichannel_message_conversation` (conversation_id) WHERE conversation_id IS NOT NULL - Partial index
- `idx_omnichannel_message_sender_type` (sender_type) WHERE sender_type IS NOT NULL - Partial index
- `idx_omnichannel_message_created_at` (created_at) - Date queries
- `idx_omnichannel_message_tenant_page` (tenant_id, page_id) - Composite for tenant page queries
- `idx_omnichannel_message_tenant_contact` (tenant_id, contact_id) WHERE contact_id IS NOT NULL - Composite
- `idx_omnichannel_message_tenant_created` (tenant_id, created_at DESC) - Composite for recent messages

**Use Cases:**
- Store messages from all messaging platforms
- Link messages to contacts and platform pages
- Track conversation threads
- Support attachments via JSONB
- Platform-agnostic message storage

---

## Relationships Summary

### Core Hierarchy
- `channels_platforms` → `channels_platform_pages` (One-to-Many)
- `channels_platform_pages` → `omnichannel_contact` (One-to-Many)
- `channels_platform_pages` → `omnichannel_message` (One-to-Many)
- `omnichannel_contact` → `omnichannel_message` (One-to-Many)

### Platform Identification
- Platform type determined by joining through `channels_platform_pages` to `channels_platforms`
- No need for platform-specific tables
- Single unified structure for all platforms

### Integration Services
- `integration_via` tracks which service integrated the contact
- Supports multiple integration services per platform
- Generic `external_customer_id` works with any service

---

## Migration from Old Schema

### Removed Tables
- 🗑️ `facebook_page` - Replaced by `channels_platform_pages` (from marketing module)
- 🗑️ `pancake_contact` - Replaced by `omnichannel_contact`
- 🗑️ `pancake_message` - Replaced by `omnichannel_message`

### Data Migration
1. Migrate `facebook_page` data to `channels_platform_pages`
2. Migrate `pancake_contact` to `omnichannel_contact` (update column names)
3. Migrate `pancake_message` to `omnichannel_message` (update column names)
4. Update foreign key references

---

## Benefits

1. **Unified Structure**: One table for all platforms, not separate tables per platform
2. **Scalable**: Easy to add new platforms without schema changes
3. **Flexible**: Supports multiple integration services per platform
4. **Maintainable**: Less code duplication, easier to maintain
5. **Queryable**: Easy to query across all platforms or filter by platform
6. **Future-proof**: Ready for new platforms and integration services

---

## Notes

- **Platform Type**: Determined via join to `channels_platforms`, not stored in omnichannel tables
- **Integration Services**: Pancake is just one service, not a core structure
- **Personal Key**: Links to CRM but not FK for flexibility
- **Metadata**: JSONB fields allow platform-specific data without schema changes
- **Multi-tenancy**: All tables support tenant isolation
