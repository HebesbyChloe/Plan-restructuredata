# Naming Convention Mapping

## Table Naming Rules

### Old Convention (MySQL)
- Prefixes: `db_*`, `res_*`, `twilio_*`, `note_*`
- Mixed singular/plural
- Abbreviations: `iv_`, `cat_`, `id_`, `nv_`

### New Convention (PostgreSQL)
- **No prefixes** (except `twilio_*` kept for integration clarity)
- **Singular nouns** for main entities
- **Plural nouns** for junction/lookup tables
- **Snake_case** throughout
- **Descriptive names** (no abbreviations)

## Table Name Mappings

### Core Entities
| Old Name | New Name | Notes |
|----------|----------|-------|
| `db_customer` | `customer` | Core entity |
| `db_order` | `order` | Core entity |
| `db_order_detail` | `order_detail` | One-to-one with order |
| `db_order_line_item` | `order_line_item` | Order items |
| `db_staff` | `staff` | Employee management |
| `db_employee_dashboard` | `employee_dashboard` | Employee UI data |

### Products & Inventory
| Old Name | New Name | Notes |
|----------|----------|-------|
| `db_iv_product` | `product` | Main product catalog |
| `db_iv_category` | `category` | Product categories |
| `db_iv_stock` | `stock` | Inventory stock |
| `db_iv_attributes` | `product_attribute` | Product attributes |
| `db_iv_tag` | `product_tag` | Product tags |
| `db_material_stock` | `material_stock` | Raw materials inventory |
| `db_material_attributes` | `material_attribute` | Material attributes |
| `db_material_per_product` | `product_material` | Product-material relationship |
| `db_cat_autosku` | `category_autosku` | Auto SKU generation |

### Campaigns & Marketing
| Old Name | New Name | Notes |
|----------|----------|-------|
| `db_campaigns` | `campaign` | Marketing campaigns |
| `db_promo` | `promotion` | Promotions |
| `db_new_promo_two` | `promotion_period` | Promotion time periods |
| `db_new_promo_two_item` | `promotion_item` | Promotion items |

### Sales & Leads
| Old Name | New Name | Notes |
|----------|----------|-------|
| `db_lead_sale` | `lead_sale` | Sales leads |
| `db_customer_batch` | `customer_batch` | Customer batches |
| `db_sub_id_lead` | `customer_lead` | Customer-lead mapping |
| `db_sales_performance_tracker` | `sales_performance` | Performance tracking |
| `db_sales_management` | `sales_management` | Sales management data |
| `db_list_end_shift` | `shift_report` | End of shift reports |
| `db_target_report_end_shift` | `shift_target` | Shift targets |

### Orders & Payments
| Old Name | New Name | Notes |
|----------|----------|-------|
| `db_payment_order` | `payment` | Order payments |
| `db_order_return` | `order_return` | Returns/exchanges |
| `db_list_refunded_order` | `refund` | Refunds |
| `db_status_after_sales_services` | `after_sales_service` | After-sales services |
| `db_status_diamond` | `diamond_order_status` | Diamond order status |
| `db_status_pre_order` | `pre_order_status` | Pre-order status |
| `db_order_product_custom` | `custom_product_order` | Custom product orders |

### Shipping
| Old Name | New Name | Notes |
|----------|----------|-------|
| `db_inbound_shipment` | `inbound_shipment` | Incoming shipments |
| `db_outbound_shipments` | `outbound_shipment` | Outgoing shipments |
| `db_outbound_shipments_orders` | `outbound_shipment_order` | Shipment-order mapping |
| `db_outbound_shipments_products` | `outbound_shipment_product` | Shipment-product mapping |
| `db_items_inbound_shipment` | `inbound_shipment_item` | Inbound shipment items |
| `db_item_notes_inbound_shipment` | `inbound_shipment_note` | Inbound shipment notes |
| `db_orders_inbound_shipment` | `inbound_shipment_order` | Inbound shipment orders |
| `db_shipstation_order` | `shipstation_order` | ShipStation integration |

### Staff & Scheduling
| Old Name | New Name | Notes |
|----------|----------|-------|
| `db_shift_schedule_sales` | `shift_schedule` | Staff shift schedules |
| `db_draft_shift_schedule_sales` | `draft_shift_schedule` | Draft shift schedules |
| `db_revision_shift_schedule` | `shift_schedule_revision` | Shift schedule revisions |
| `db_info_revision_schedule` | `schedule_revision` | Schedule revision metadata |
| `db_schedule_preferences` | `schedule_preference` | Staff schedule preferences |
| `db_request_off_sales` | `time_off_request` | Time off requests |
| `db_warning_staff` | `staff_warning` | Staff warnings |

### Tasks & Projects
| Old Name | New Name | Notes |
|----------|----------|-------|
| `db_project_space` | `project` | Projects |
| `db_task_space` | `task` | Tasks |
| `db_task_repeat_space` | `recurring_task` | Recurring tasks |
| `db_notification_task` | `task_notification` | Task notifications |
| `db_conversation_task` | `task_conversation` | Task conversations |
| `db_repository_project` | `project_repository` | Project files |

### Communication
| Old Name | New Name | Notes |
|----------|----------|-------|
| `db_messages_pancake` | `pancake_message` | Pancake messages |
| `db_summary_messages_pancake` | `pancake_message_summary` | Message summaries |
| `db_contact_pancake` | `pancake_contact` | Pancake contacts |
| `db_log_ads_customer_pancake` | `pancake_ads_log` | Ads click logs |

### History & Logging
| Old Name | New Name | Notes |
|----------|----------|-------|
| `db_history_action` | `action_history` | Action audit log |
| `db_history_stock` | `stock_history` | Stock change history |
| `db_history_inventory` | `inventory_history` | Inventory audit |
| `db_history_report_ads` | `ads_report_history` | Ads report history |
| `db_history_sales_performance_tracker` | `sales_performance_history` | Performance history |
| `db_history_webhook_cb` | `webhook_history` | Webhook logs |
| `db_log_merge_customer` | `customer_merge_log` | Customer merge logs |

### Other
| Old Name | New Name | Notes |
|----------|----------|-------|
| `db_list_batch` | `batch` | Generic batches |
| `db_list_cart_share` | `cart_share` | Shared carts |
| `db_sent_link_customer` | `customer_link` | Sent customer links |
| `db_schedule_rm_cate` | `category_removal_schedule` | Category removal schedule |
| `db_thanhtich` | `achievement` | Staff achievements |
| `db_workflow_ai` | `workflow` | AI workflows |
| `note_order_not_found` | `order_not_found_note` | Order not found notes |

### Reserve System (res_*)
| Old Name | New Name | Notes |
|----------|----------|-------|
| `res_order` | `reserve_order` | Reserve system orders |
| `res_order_detail` | `reserve_order_detail` | Reserve order details |
| `res_order_line_item` | `reserve_order_line_item` | Reserve order items |
| `res_product` | `reserve_product` | Reserve products |
| `res_stock` | `reserve_stock` | Reserve stock |
| `res_category` | `reserve_category` | Reserve categories |
| `res_attributes` | `reserve_attribute` | Reserve attributes |
| `res_cat_autosku` | `reserve_category_autosku` | Reserve auto SKU |
| `res_history_stock` | `reserve_stock_history` | Reserve stock history |

### Twilio (Keep Prefix)
| Old Name | New Name | Notes |
|----------|----------|-------|
| `twilio_*` | `twilio_*` | Keep prefix for integration clarity |

## Column Naming Conventions

### Standard Mappings

#### Primary Keys
- All tables: `id` (BIGSERIAL)
- Exception: `db_cat_autosku.ID` → `id`

#### Foreign Keys
- Format: `{referenced_table}_id`
- Examples:
  - `id_customer` → `customer_id`
  - `id_order` → `order_id`
  - `id_staff` → `staff_id`
  - `id_nv_chotdon` → `closed_by_staff_id` (descriptive)
  - `id_nv_gioithieu` → `referred_by_staff_id` (descriptive)

#### Audit Fields
- `date_created` → `created_at`
- `date_updated` → `updated_at`
- `update_date` → `updated_at`
- `last_update` → `updated_at`
- `update_by` → `updated_by_id`
- `created_by` → `created_by_id`
- `by_user` → `updated_by_id` (if update) or `created_by_id` (if create)

#### Status Fields
- Keep descriptive names: `status`, `status_order`, `status_item`
- Consider ENUM types for fixed values

#### Boolean Fields
- Keep descriptive names: `error_phone`, `error_email`, `is_active`
- Convert `tinyint(1)` to `BOOLEAN`

#### Timestamp Fields
- Standardize to `TIMESTAMP WITH TIME ZONE`
- Naming: `{event}_at` (e.g., `created_at`, `updated_at`, `shipped_at`)

## Junction Tables (New)

### Campaign Normalization
- `campaign_ads` (campaign_id, ad_id)
- `campaign_ads_running` (campaign_id, ad_id)
- `campaign_target_audience` (campaign_id, audience_id)
- `campaign_collection` (campaign_id, collection_id)

### Product Normalization
- `product_category` (product_id, category_id)
- `product_collection` (product_id, collection_id)
- `product_tag` (product_id, tag_id)
- `product_attribute_value` (product_id, attribute_id, value)

### Task Normalization
- `task_assignee` (task_id, staff_id)

### Promotion Normalization
- `promotion_category` (promotion_id, category_id)
- `promotion_product` (promotion_id, product_id)
- `promotion_attribute` (promotion_id, attribute_id)
- `promotion_excluded_category` (promotion_id, category_id)
- `promotion_excluded_product` (promotion_id, product_id)
- `promotion_excluded_attribute` (promotion_id, attribute_id)

### Customer Batch Normalization
- `customer_batch_customer` (batch_id, customer_id)
- `customer_batch_order` (batch_id, order_id)

### Order Normalization
- `order_tag` (order_id, tag_id)

## Special Column Mappings

### Vietnamese Field Names
- `ten_khach` → `customer_name`
- `tinh_trang_lead` → `lead_status`
- `doanh_so_thang` → `monthly_revenue`
- `id_nhanvien` → `staff_id`
- `total_gioi_thieu` → `total_referrals`
- `total_chot_don` → `total_closed_orders`
- `target_thang` → `monthly_target`

### Abbreviated Fields
- `id_nv_chotdon` → `closed_by_staff_id`
- `id_nv_gioithieu` → `referred_by_staff_id`
- `id_cus_pancake` → `pancake_customer_id`
- `id_crm` → `crm_id`
- `id_hb` → `hebes_id`
- `id_eb` → `ebes_id`

### Descriptive Renames
- `hinh_order` → `order_image`
- `link_order_number` → `order_number`
- `source_page_fb` → `facebook_source_page`
- `rank_order` → `customer_rank`
- `qty_paid` → `quantity_paid`
- `qty` → `quantity`
- `act_qty` → `actual_quantity`
- `qty_diff` → `quantity_difference`

## Backward Compatibility

For migration period, consider:
1. Creating views with old names pointing to new tables
2. Maintaining mapping table for reference
3. Gradual application update to use new names

## PostgreSQL-Specific Considerations

1. **Reserved Words**: Avoid PostgreSQL reserved words
   - `order` is reserved → use `sales_order` or `customer_order`
   - `user` is reserved → use `staff_user` or keep as `staff`
   - `date` is reserved → use `event_date` or `created_date`

2. **Case Sensitivity**: PostgreSQL is case-sensitive
   - Use lowercase with underscores
   - Quote identifiers if needed

3. **Naming Length**: Keep under 63 characters (PostgreSQL limit)

