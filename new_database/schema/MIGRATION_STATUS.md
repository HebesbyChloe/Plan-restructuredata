# Migration Status - Database Schema Restructuring

## Overview
This document tracks the migration progress from the old schema (`DDL_Database_CRM.sql`) to the new restructured schema. The new schema is organized by business domains and follows modern database design principles with multi-tenancy, normalization, and enterprise features.

**Total Tables in Old Schema:** 91  
**Migration Status:** In Progress

---

## 📊 Migration Summary

| Status | Count | Percentage |
|--------|-------|------------|
| ✅ **Migrated** | ~60 | ~66% |
| 🔄 **In Progress** | ~10 | ~11% |
| ❌ **Not Migrated** | ~21 | ~23% |

---

## ✅ MIGRATED TABLES

### 1. Customer Management (`new_fix/crm_customer_schema_map.md`)
**Status:** ✅ Complete

| Old Table | New Table | Notes |
|-----------|-----------|-------|
| `db_customer` | `crm_customers` | Enhanced with multi-tenancy, personal keys |
| `db_customer_batch` | `crm_customer_batches` | Batch processing |
| `db_contact_pancake` | `crm_personal_contacts` | Unified contact system |
| `db_sub_id_lead` | `crm_leads` | Lead management |
| `db_log_merge_customer` | `crm_customer_merge_logs` | Customer deduplication |

**New Tables Added:**
- `crm_personal_keys` - Canonical person identifier
- `crm_personal_addresses` - Address management
- `crm_personal_profile` - Profile data with JSONB
- `crm_personal_journey` - Customer journey tracking
- `crm_potential` - Opportunities
- `crm_reengage_personal_keys` - Re-engagement campaigns

---

### 2. Order Management (`new_fix/orders_domain_schema_map.md`)
**Status:** ✅ Complete

| Old Table | New Table | Notes |
|-----------|-----------|-------|
| `db_order` | `orders` | Enhanced with multi-tenancy |
| `db_order_detail` | `order_items` | Normalized structure |
| `db_order_line_item` | `order_line_items` | Line item properties |
| `db_payment_order` | `order_payments` | Payment tracking |
| `db_order_return` | `order_returns` | Return management |
| `db_order_product_custom` | `order_customization` | Custom products |
| `db_status_diamond` | `order_statuses` | Status tracking |
| `db_status_pre_order` | `order_pre_order_statuses` | Pre-order statuses |
| `db_list_refunded_order` | `order_refunds` | Refund management |
| `db_status_after_sales_services` | `orders_after_sales` | After-sales tracking |

**New Tables Added:**
- `order_item_statuses` - Item-level status tracking
- `order_pre_orders` - Pre-order management
- `orders_meta` - Order metadata (JSONB)

---

### 3. Shipping & Logistics (`sales/shipping.md`)
**Status:** ✅ Complete

| Old Table | New Table | Notes |
|-----------|-----------|-------|
| `db_inbound_shipment` | `inbound_shipments` | Inbound logistics |
| `db_items_inbound_shipment` | `inbound_shipment_items` | Shipment items |
| `db_item_notes_inbound_shipment` | `inbound_shipment_notes` | Notes |
| `db_outbound_shipments` | `outbound_shipments` | Outbound logistics |
| `db_outbound_shipments_orders` | `outbound_shipment_orders` | Order links |
| `db_outbound_shipments_products` | `outbound_shipment_products` | Product links |
| `db_shipstation_order` | `shipstation_orders` | ShipStation integration |
| `db_orders_inbound_shipment` | (implied in `inbound_shipment_items`) | Consolidated |

---

### 4. Staff & HR (`sales/staff.md`)
**Status:** ✅ Complete

| Old Table | New Table | Notes |
|-----------|-----------|-------|
| `db_staff` | `hr_staff` | Enhanced HR system |
| `db_list_end_shift` | `shift_reports` | Shift reporting |
| `db_sales_performance_tracker` | `sales_performance` | Performance tracking |
| `db_lead_sale` | `lead_sales` | Lead sales tracking |

**Note:** Schedule-related tables moved to Schedule Management module.

---

### 5. Schedule Management (`new_fix/schedule_schema_map.md`)
**Status:** ✅ Complete

| Old Table | New Table | Notes |
|-----------|-----------|-------|
| `db_shift_schedule_sales` | `schedule` | Consolidated |
| `db_draft_shift_schedule_sales` | `schedule` | Consolidated |
| `db_schedule_preferences` | `schedule_preferences` | Staff preferences |
| `db_info_revision_schedule` | `schedule_revision` | Consolidated |
| `db_revision_shift_schedule` | `schedule_revision_detail` | Revision details |
| `db_request_off_sales` | `schedule_time_off_request` | Time off requests |

**New Tables Added:**
- `leave_type` - Leave type definitions

---

### 6. Tasks & Projects (`new_fix/tasks_schema_map.md`)
**Status:** ✅ Complete

| Old Table | New Table | Notes |
|-----------|-----------|-------|
| `db_project_space` | `project` | Enhanced with enterprise features |
| `db_task_space` | `task` | Enhanced task system |
| `db_task_repeat_space` | `recurring_task` | Recurring tasks |
| `db_notification_task` | `task_notification` | Notifications |
| `db_conversation_task` | `task_comment` | Comments system |
| `db_repository_project` | `project_repository` | File attachments |

**New Tables Added:**
- `milestone` - Project milestones
- `task_watcher` - Task watchers
- `task_dependency` - Task dependencies
- `task_attachment` - File attachments
- `task_comment_mention` - Comment mentions
- `task_activity` - Activity log
- `recurring_task_assignee` - Recurring task assignees

---

### 7. Product & Inventory (`new_fix/product_schema_map.md`)
**Status:** ✅ Complete

| Old Table | New Table | Notes |
|-----------|-----------|-------|
| `db_iv_product` | `product` | Enhanced product catalog |
| `db_iv_category` | `category` | Hierarchical categories |
| `db_iv_stock` | `stock` | Inventory levels |
| `db_iv_attributes` | `product_attribute` | Attribute definitions |
| `db_iv_tag` | (via `product_tag` junction) | Normalized tags |
| `db_material_stock` | `material` | Material inventory |
| `db_material_per_product` | `material_product` | BOM relationships |
| `db_material_attributes` | `material_attribute` | Material attributes |
| `db_cat_autosku` | `category_autosku` | Auto SKU generation |
| `db_promo` | `promotion` | Promotions |

**New Tables Added:**
- `product_category` - Product-category junction (normalized)
- `product_tag` - Product-tag junction (normalized)
- `product_attribute_value` - Product-attribute values (normalized)
- `product_set_item` - Product sets/bundles
- `product_variant` - Product variants
- `product_image` - Product images/gallery
- `product_customize` - Customization data
- `diamond` - Diamond specifications
- `gemstone` - Gemstone specifications

---

### 8. Marketing & Campaigns (`new_fix/marketing-table-schema-map.md`)
**Status:** ✅ Complete

| Old Table | New Table | Notes |
|-----------|-----------|-------|
| `db_campaigns` | `mkt_campaigns` | Enhanced campaign system |

**New Tables Added:**
- `mkt_campaign_goals` - Campaign goals
- `mkt_campaign_activities` - Action milestones
- `mkt_campaign_projects` - Campaign-project links (N:M)
- `mkt_promotions` - Promotional campaigns
- `mkt_promotion_campaigns` - Promotion-campaign junction
- `mkt_promotion_channels` - Promotion-channel junction
- `mkt_promotion_products` - Promotion-product junction
- `mkt_promotion_categories` - Promotion-category junction
- `mkt_promotion_attributes` - Promotion-attribute junction
- `mkt_promotion_exclusions` - Promotion exclusions
- `mkt_promotion_bmgm_products` - BMGM products
- `mkt_promotion_free_items` - Free items
- `mkt_asset_folders` - Asset folders
- `mkt_marketing_assets` - Marketing assets
- `mkt_brand_settings` - Brand identity
- `mkt_brand_colors` - Brand colors
- `mkt_brand_typography` - Brand typography
- `mkt_brand_logos` - Brand logos
- `mkt_brand_guidelines` - Brand guidelines
- `mkt_affiliates` - Affiliates/KOLs
- `mkt_utm_links` - UTM tracking
- `mkt_reference_documents` - Reference docs
- `mkt_marketing_channels` - Marketing channels
- `mkt_campaign_activities_history` - Activity history
- `mkt_promotion_redemptions` - Promotion redemptions

**Removed Tables:**
- ❌ `mkt_campaign_tasks` → Replaced by `task` table with metadata
- ❌ `mkt_campaign_metrics` → Replaced by `mkt_campaign_goals` or project metadata
- ❌ `mkt_campaign_files` → Replaced by `project_repository` table

---

### 9. Omnichannel Integration (`new_fix/ommichannel_schema_map.md`)
**Status:** ✅ Complete

**New Tables Added:**
- `omnichannel_contact` - Unified contacts (Facebook, Instagram, Zalo, etc.)
- `omnichannel_message` - Unified messages (all platforms)
- `omnichannel_message_attachment` - Message attachments
- `omnichannel_message_reaction` - Message reactions
- `omnichannel_conversation` - Conversation tracking

**Migration Notes:**
- Replaces `db_messages_pancake` (migrated to unified structure)
- Replaces `db_summary_messages_pancake` (handled via conversation metadata)
- Replaces `db_log_ads_customer_pancake` (handled via message metadata)

---

### 10. SMS Module (`new_fix/sms_module_schema_map.md`)
**Status:** ✅ Complete

| Old Table | New Table | Notes |
|-----------|-----------|-------|
| `twilio_sender_accounts` | `SMS_sender_accounts` | Provider accounts |
| `twilio_sender_phone_numbers` | `SMS_sender_phone_numbers` | Phone number pool |
| `twilio_users` | (removed) | Not needed |
| `twilio_sms_messages` | `SMS_messages` | Message log |
| `twilio_attachments` | `SMS_attachments` | Message attachments |
| `twilio_contacts` | `SMS_contacts` | Contact address book |
| `twilio_conversation_meta` | `SMS_meta_conversation` | Conversation analytics |
| `twilio_customer_phone_numbers` | (via `SMS_contacts`) | Consolidated |
| `twilio_message_reactions` | `SMS_reactions` | Message reactions |
| `twilio_kv_store` | (removed) | Not needed in new schema |

**New Tables Added:**
- `SMS_service_accounts` - Logical messaging services

---

### 11. Channels & Platforms (`new_fix/channels-platforms-schema.md`)
**Status:** ✅ Complete

**New Tables Added:**
- `channels_platforms` - Top-level platforms (Facebook, Instagram, Zalo, etc.)
- `channels_platform_pages` - Individual pages/accounts per platform

---

### 12. System & Multi-Tenancy (`new_fix/system_tenant_schema_map.md`)
**Status:** ✅ Complete

**New Tables Added:**
- `sys_tenants` - Multi-tenant support
- `sys_users` - System users
- `sys_roles` - Role definitions
- `sys_permissions` - Permission definitions
- `sys_role_permissions` - Role-permission junction
- `sys_user_roles` - User-role assignment

---

### 13. Performance Management (`new_fix/performance_schema_map.md`)
**Status:** ✅ Complete

**New Tables Added:**
- `department` - Department definitions
- `performance_criteria` - Performance criteria
- `performance_evaluation` - Performance evaluations
- `performance_score` - Performance scores

**Migration Notes:**
- Replaces `db_target_report_end_shift` (handled via performance_evaluation)
- Replaces `db_history_sales_performance_tracker` (handled via performance_score)

---

### 14. Logs & Audit (`new_fix/logs_schema_map.md`)
**Status:** ✅ Complete

| Old Table | New Table | Notes |
|-----------|-----------|-------|
| `db_history_action` | `logs_human` | Human action logs |
| `db_history_stock` | (via `logs_system`) | System logs |
| `db_history_webhook_cb` | `logs_webhook` | Webhook logs |

**New Tables Added:**
- `logs_system` - System/automated logs

---

### 15. Alerts & Notes (`new_fix/alerts_notes_schema_map.md`)
**Status:** ✅ Complete

**New Tables Added:**
- `alert_keys` - Alert type definitions
- `alerts` - Alert instances (polymorphic)
- `notes` - Notes system (polymorphic)

---

### 16. History & Audit (`others/history.md`)
**Status:** ✅ Complete

| Old Table | New Table | Notes |
|-----------|-----------|-------|
| `db_history_action` | `action_history` | Action audit trail |
| `db_history_stock` | `stock_history` | Stock change history |
| `db_history_webhook_cb` | `webhook_history` | Webhook callbacks |

---

### 17. Workflow & AI (`others/workflow.md`)
**Status:** ✅ Complete

| Old Table | New Table | Notes |
|-----------|-----------|-------|
| `db_workflow_ai` | `workflow` | AI workflow automation |

---

## 🔄 IN PROGRESS / PARTIALLY MIGRATED

### Promotions
- 🔄 `db_new_promo_two` → May consolidate with `mkt_promotions`
- 🔄 `db_new_promo_two_item` → May consolidate with promotion system

**Status:** Design in progress - evaluating consolidation approach

---

## ❌ NOT YET MIGRATED

### Customer Related
- ❌ `db_sent_link_customer` - Customer link sharing/cart sharing
- ❌ `db_log_ads_customer_pancake` - Ads click tracking (may be handled via omnichannel metadata)

**Note:** Some functionality may be covered by new omnichannel and marketing modules.

---

### Order Related
- ❌ `note_order_not_found` - Notes for orders not found

**Note:** May be handled via `orders_meta` JSONB field or `notes` table.

---

### Staff & Performance
- ❌ `db_employee_dashboard` - Employee dashboard settings
- ❌ `db_sales_management` - Sales management records
- ❌ `db_thanhtich` - Achievement/performance records (Vietnamese)
- ❌ `db_warning_staff` - Staff warnings

**Note:** Some functionality may be covered by performance management module.

---

### Product & Inventory
- ❌ `db_history_inventory` - Inventory history/audit

**Note:** May be handled via `logs_system` or dedicated inventory history table.

---

### Other
- ❌ `db_list_batch` - Batch lists
- ❌ `db_list_cart_share` - Cart sharing lists
- ❌ `db_history_report_ads` - Ads report history
- ❌ `db_schedule_rm_cate` - Schedule removal category (unclear purpose)

---

### Archive/Reserved Tables
- ❌ `res_*` tables (res_attributes, res_cat_autosku, res_category, res_history_stock, res_order, res_order_detail, res_order_line_item, res_product, res_stock)

**Note:** These appear to be reserved/archive tables. Verify if still in use before migrating.

---

## 📋 Migration Priority

### High Priority (Core Business Logic)
1. ✅ **Customer Management** - Complete
2. ✅ **Order Management** - Complete
3. ✅ **Product & Inventory** - Complete
4. ✅ **Marketing & Campaigns** - Complete
5. ✅ **Tasks & Projects** - Complete
6. ✅ **Omnichannel Integration** - Complete
7. ✅ **SMS Module** - Complete
8. 🔄 **Promotions** - In progress (evaluating consolidation)

### Medium Priority (Supporting Features)
9. ❌ `db_employee_dashboard` - Dashboard settings
10. ❌ `db_sales_management` - Sales management
11. ❌ `db_thanhtich` - Achievement tracking
12. ❌ `db_warning_staff` - Staff management
13. ❌ `db_history_inventory` - Inventory audit
14. ❌ `note_order_not_found` - Order management
15. ❌ `db_list_batch` - Batch management
16. ❌ `db_list_cart_share` - Cart sharing
17. ❌ `db_history_report_ads` - Ads reporting
18. ❌ `db_schedule_rm_cate` - Schedule management

### Low Priority (External Integrations / Archive)
19. ❌ All `res_*` tables - Reserved/archive tables (verify usage first)

---

## 🎯 Key Improvements in New Schema

### 1. Multi-Tenancy
- All tables include `tenant_id` for data isolation
- Centralized tenant management via `sys_tenants`

### 2. Normalization
- Comma-separated values moved to junction tables
- Proper many-to-many relationships
- Reduced data redundancy

### 3. Enterprise Features
- Soft deletes (`deleted_at` fields)
- Audit trails and activity logs
- JSONB metadata for flexibility
- Enhanced indexing strategies

### 4. Integration
- Unified task system (campaigns use `task` table)
- Unified project system (campaigns use `project` table)
- Unified contact system (omnichannel)
- Unified messaging system (omnichannel + SMS)

### 5. Modern Design
- Proper data types (NUMERIC for money, TIMESTAMPTZ for dates)
- CHECK constraints for data validation
- Optimized indexes (including partial indexes)
- GIN indexes for JSONB and arrays

---

## 📝 Notes

1. **Twilio → SMS Module**: All Twilio tables migrated to unified SMS module with better structure.

2. **Pancake Integration**: 
   - `db_messages_pancake` → `omnichannel_message` (unified)
   - `db_summary_messages_pancake` → Handled via conversation metadata
   - `db_contact_pancake` → `crm_personal_contacts` (unified)

3. **Campaign Integration**: 
   - Campaign tasks now use unified `task` table
   - Campaign files use `project_repository` table
   - Complex activities use `project` table via `mkt_campaign_projects`

4. **Consolidation Opportunities**: 
   - `db_new_promo_two` might consolidate with `mkt_promotions`
   - `db_sent_link_customer` and `db_list_cart_share` might be related
   - Message-related tables unified in omnichannel module

5. **Archive Tables**: The `res_*` tables appear to be reserved/archive tables. Verify if they're still in use before migrating.

---

## 📊 Statistics

- **Total Old Tables**: 91
- **Migrated Tables**: ~60 (66%)
- **New Tables Added**: ~100+ (enhanced functionality)
- **Tables Removed/Consolidated**: ~10
- **Remaining to Migrate**: ~21 (23%)

---

## 🔗 Related Documents

- Schema Files: `new_database/schema/new_fix/`
- SQL Migrations: `new_database/sql_migrations/`
- Old Schema: `old_schema/DDL_Database_CRM.sql`

---

**Last Updated:** 2024-12-19  
**Status:** Active Migration
