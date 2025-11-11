-- admin_admin_new.db_campaigns definition

CREATE TABLE `db_campaigns` (
  `id` bigint(15) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `status` enum('draft','active','paused','completed','archived') DEFAULT 'draft',
  `spend` decimal(12,2) NOT NULL DEFAULT 0.00,
  `budget` decimal(12,2) NOT NULL DEFAULT 0.00,
  `budget_cycle` enum('daily','weekly','monthly','total') NOT NULL DEFAULT 'monthly',
  `ids_ads` varchar(500) DEFAULT NULL,
  `ids_ads_running` varchar(300) DEFAULT NULL,
  `target_audiences` varchar(500) DEFAULT NULL,
  `cost_impression_goal` decimal(10,2) NOT NULL DEFAULT 0.00,
  `cost_lead_goal` decimal(10,2) NOT NULL DEFAULT 0.00,
  `cost_new_lead_goal` decimal(10,2) NOT NULL DEFAULT 0.00,
  `cost_order_goal` decimal(10,2) NOT NULL DEFAULT 0.00,
  `roas_goal` decimal(5,2) NOT NULL DEFAULT 0.00,
  `collection_selection` varchar(500) DEFAULT NULL,
  `time_start` date NOT NULL,
  `time_end` date DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `date_created` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6900713495300 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


-- admin_admin_new.db_cat_autosku definition

CREATE TABLE `db_cat_autosku` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) NOT NULL,
  `last_sku` int(11) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


-- admin_admin_new.db_contact_pancake definition

CREATE TABLE `db_contact_pancake` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_customer` int(11) NOT NULL,
  `fb_id` varchar(100) DEFAULT '',
  `page_id` varchar(100) DEFAULT '',
  `page` varchar(256) DEFAULT '',
  `id_cus_pancake` varchar(256) DEFAULT '',
  `link` varchar(256) DEFAULT '',
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17480 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


-- admin_admin_new.db_conversation_task definition

CREATE TABLE `db_conversation_task` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_task` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `message` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `date_created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1536 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


-- admin_admin_new.db_customer definition

CREATE TABLE `db_customer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT 'No Name',
  `email` varchar(300) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `phone` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `id_lead` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `address` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `city` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `country` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `post_code` varchar(30) DEFAULT '',
  `total` float DEFAULT 0,
  `qty_paid` int(11) DEFAULT 0,
  `five_element` varchar(30) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `infor_customer` varchar(2000) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `intention` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `note` varchar(2000) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `birth` date DEFAULT '0001-01-01',
  `link_profile` varchar(300) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `date_created` timestamp NULL DEFAULT current_timestamp(),
  `future_sales_opportunities` varchar(1000) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `sale_label` int(10) DEFAULT 0,
  `source` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT 'phone',
  `rank` varchar(300) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT 'New Customer',
  `last_time_order` datetime DEFAULT NULL,
  `error_phone` tinyint(1) DEFAULT 0,
  `error_email` tinyint(1) DEFAULT 0,
  `last_time_reachout` date NOT NULL DEFAULT current_timestamp(),
  `birth_month_day` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `birth_year` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `recommend_merge` tinyint(1) DEFAULT 0,
  `link_pancake` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `update_date` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `update_by` int(11) DEFAULT 0,
  `status_lead_contact` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `status_potential` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `current_amount` float DEFAULT 0,
  `new_lead_label` tinyint(1) NOT NULL DEFAULT 0,
  `date_created_potential` datetime DEFAULT NULL,
  `check_bug` tinyint(4) DEFAULT NULL,
  `id_batch` int(10) DEFAULT 0,
  `last_summary` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '',
  `emotion` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'neutral',
  `next_action` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `journey_stage` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_email` (`email`),
  KEY `idx_rank` (`rank`),
  KEY `idx_date_created` (`date_created`)
) ENGINE=InnoDB AUTO_INCREMENT=102047 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


-- admin_admin_new.db_customer_batch definition

CREATE TABLE `db_customer_batch` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `batch_name` varchar(100) NOT NULL,
  `assigned_to` int(10) DEFAULT 0,
  `size` int(100) DEFAULT 0,
  `historical_value` int(10) DEFAULT 0,
  `status` varchar(100) DEFAULT 'new',
  `contact` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '',
  `response` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '',
  `conversion` int(10) DEFAULT 0,
  `conversion_customer_id` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '',
  `reactive_revenue` float DEFAULT 0,
  `created_date` date NOT NULL DEFAULT current_timestamp(),
  `conversion_order_id` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=144 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


-- admin_admin_new.db_draft_shift_schedule_sales definition

CREATE TABLE `db_draft_shift_schedule_sales` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_staff` int(11) NOT NULL DEFAULT 0,
  `date_time_start` datetime NOT NULL,
  `date_time_end` datetime NOT NULL,
  `shift` varchar(256) NOT NULL DEFAULT '',
  `total_time` int(11) NOT NULL DEFAULT 0,
  `type_sales_off` varchar(256) NOT NULL DEFAULT '',
  `status_authorization` tinyint(1) NOT NULL DEFAULT 0,
  `reason` varchar(256) NOT NULL DEFAULT '',
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `complete_shift` tinyint(1) DEFAULT 2 COMMENT '0 failed, 1 completed, 2 no confirm',
  `id_report_shift` int(11) DEFAULT 0,
  `confirm` tinyint(1) NOT NULL DEFAULT 1,
  `leader_shift` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8465 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


-- admin_admin_new.db_employee_dashboard definition

CREATE TABLE `db_employee_dashboard` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_schedule` int(11) NOT NULL DEFAULT 99,
  `email` varchar(300) NOT NULL DEFAULT '',
  `full_name` varchar(256) NOT NULL DEFAULT '',
  `team` varchar(256) NOT NULL DEFAULT '',
  `role` varchar(256) NOT NULL DEFAULT '',
  `status_work` varchar(100) NOT NULL DEFAULT 'active',
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `motivational_quote_today` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `location` varchar(256) NOT NULL DEFAULT 'VN',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1590 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


-- admin_admin_new.db_history_action definition

CREATE TABLE `db_history_action` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `user` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `id_type` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `action` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `detail` varchar(5000) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `response` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `time` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4715170 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


-- admin_admin_new.db_history_inventory definition

CREATE TABLE `db_history_inventory` (
  `id` int(11) NOT NULL,
  `date` datetime DEFAULT current_timestamp(),
  `times` int(11) DEFAULT 1,
  `status` tinyint(4) DEFAULT 0,
  `sku_product` varchar(100) NOT NULL,
  `name_product` varchar(100) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `actual` int(11) NOT NULL DEFAULT 0,
  `discrepancy` int(11) NOT NULL DEFAULT 0,
  `detail` varchar(10000) DEFAULT NULL,
  `location` varchar(100) NOT NULL,
  `user` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


-- admin_admin_new.db_history_report_ads definition

CREATE TABLE `db_history_report_ads` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `update_at` datetime NOT NULL DEFAULT current_timestamp(),
  `report` text DEFAULT NULL,
  `type` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


-- admin_admin_new.db_history_sales_performance_tracker definition

CREATE TABLE `db_history_sales_performance_tracker` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name_staff` varchar(100) DEFAULT NULL,
  `id_staff` int(11) DEFAULT NULL,
  `actions` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `total_points_this_month` varchar(10) DEFAULT NULL,
  `sub_staff_name` varchar(100) DEFAULT NULL,
  `date_created` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24945 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


-- admin_admin_new.db_history_stock definition

CREATE TABLE `db_history_stock` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `sku` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `stock` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `detail` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `time` datetime NOT NULL DEFAULT current_timestamp(),
  `source` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `qty_change` int(11) DEFAULT 0,
  `id_line_item` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `id_order` bigint(15) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=751873 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


-- admin_admin_new.db_history_webhook_cb definition

CREATE TABLE `db_history_webhook_cb` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `end_point` varchar(255) NOT NULL,
  `send_by` varchar(255) NOT NULL,
  `data` longtext NOT NULL,
  `date_created` timestamp NULL DEFAULT current_timestamp(),
  `status` varchar(100) NOT NULL,
  `response` longtext DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=71950 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


-- admin_admin_new.db_inbound_shipment definition

CREATE TABLE `db_inbound_shipment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `code_outbound` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `hub` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `location` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `vendor` varchar(256) DEFAULT NULL,
  `status` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '''''',
  `products` int(11) DEFAULT 0,
  `orders` int(11) DEFAULT 0,
  `items` int(11) DEFAULT 0,
  `update_date` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `update_by` int(11) DEFAULT NULL,
  `tracking_number` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `ship_date` date DEFAULT NULL,
  `estimated_arrival_date` date DEFAULT NULL,
  `arrived_date` date DEFAULT NULL,
  `date_created` date NOT NULL DEFAULT current_timestamp(),
  `note` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `images` varchar(1500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=274 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


-- admin_admin_new.db_info_revision_schedule definition

CREATE TABLE `db_info_revision_schedule` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `update_by` varchar(256) NOT NULL DEFAULT '',
  `type` varchar(256) NOT NULL DEFAULT '',
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `date_time_start` date DEFAULT NULL,
  `date_time_end` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=677 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


-- admin_admin_new.db_item_notes_inbound_shipment definition

CREATE TABLE `db_item_notes_inbound_shipment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `shipment_id` int(11) NOT NULL,
  `code` varchar(256) NOT NULL DEFAULT '',
  `sku` varchar(256) DEFAULT NULL,
  `thumb_nail` varchar(100) DEFAULT '',
  `name` varchar(500) NOT NULL,
  `note` varchar(256) DEFAULT '',
  `update_by` int(11) DEFAULT NULL,
  `date_created` datetime DEFAULT current_timestamp(),
  `update_date` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


-- admin_admin_new.db_items_inbound_shipment definition

CREATE TABLE `db_items_inbound_shipment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_shipment` int(11) NOT NULL,
  `id_order` bigint(15) NOT NULL DEFAULT 0,
  `code` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '''''',
  `sku` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `thumb_nail` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '''''',
  `name` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `size` varchar(100) DEFAULT NULL,
  `qty` int(11) DEFAULT 0,
  `act_qty` int(11) DEFAULT 0,
  `qty_diff` int(11) DEFAULT 0,
  `qty_during` int(11) DEFAULT 0,
  `update_by` int(11) DEFAULT 0,
  `date_created` datetime DEFAULT current_timestamp(),
  `update_date` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `reason_add` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3269 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


-- admin_admin_new.db_iv_attributes definition

CREATE TABLE `db_iv_attributes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(300) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `type` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `value` varchar(300) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '' COMMENT '- value color (element support)\r\n- value charm (size charm)',
  `eng_description` varchar(1000) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `vn_description` varchar(1000) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `vn_name` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '' COMMENT '- bao gom (stone, color, charm)',
  `id_hb` int(11) NOT NULL DEFAULT 0,
  `id_eb` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=630 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


-- admin_admin_new.db_iv_category definition

CREATE TABLE `db_iv_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `parent` int(11) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=239 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


-- admin_admin_new.db_iv_product definition

CREATE TABLE `db_iv_product` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `status` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `sku` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `thumb_nail` varchar(1000) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `name_image` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `retail_price` float DEFAULT 0,
  `sale_price` float DEFAULT 0,
  `size` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `name` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `grade` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `year` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `bead_size` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `collection` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `origin` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `gender` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `material` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `element` varchar(300) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `eng_description` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `vn_description` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `box_dimension` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `category` varchar(1000) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `intention` varchar(300) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `color` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `stone` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `charm` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `charm_size` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `last_update` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `by_user` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `tag` varchar(300) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `total_sales` int(3) DEFAULT 0,
  `pre_order` tinyint(1) DEFAULT 0,
  `id_promo` int(11) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3301 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


-- admin_admin_new.db_iv_stock definition

CREATE TABLE `db_iv_stock` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sku_product` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `location` varchar(10) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `qty` int(4) DEFAULT 0,
  `stock_out` int(11) DEFAULT 0,
  `coming_stock` int(11) DEFAULT 0,
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `name_product` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `last_update` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `user` varchar(300) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `time_group_sku` datetime DEFAULT current_timestamp() COMMENT 'Mục đích dành cho việc group 2 sku giống nhau cho việc render theo time',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8773 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


-- admin_admin_new.db_iv_tag definition

CREATE TABLE `db_iv_tag` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


-- admin_admin_new.db_lead_sale definition

CREATE TABLE `db_lead_sale` (
  `id_lead_sale` int(11) NOT NULL AUTO_INCREMENT,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp(),
  `id_staff` int(11) NOT NULL,
  `ten_khach` varchar(300) DEFAULT '',
  `tinh_trang_lead` char(100) NOT NULL,
  `total` float DEFAULT 0,
  `id_order` bigint(11) DEFAULT 0,
  `id_lead` varchar(300) DEFAULT '0',
  `phone` varchar(20) DEFAULT '0',
  `source` varchar(100) DEFAULT '',
  `confirm` tinyint(1) DEFAULT 1,
  `late_assignee` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id_lead_sale`)
) ENGINE=InnoDB AUTO_INCREMENT=14218 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


-- admin_admin_new.db_list_batch definition

CREATE TABLE `db_list_batch` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `status` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT 'publish',
  `note` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=300797542 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


-- admin_admin_new.db_list_cart_share definition

CREATE TABLE `db_list_cart_share` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cart_key` varchar(100) DEFAULT NULL,
  `processed` tinyint(1) DEFAULT 0,
  `used` tinyint(1) DEFAULT 0,
  `amount` float DEFAULT 0,
  `type_cart` varchar(100) NOT NULL DEFAULT '''''',
  `date_created` datetime DEFAULT current_timestamp(),
  `store` varchar(100) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1857 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


-- admin_admin_new.db_list_end_shift definition

CREATE TABLE `db_list_end_shift` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_staff` int(11) NOT NULL,
  `shift` varchar(100) NOT NULL,
  `date_report` date NOT NULL,
  `total_revenue` float NOT NULL DEFAULT 0,
  `total_order` int(11) NOT NULL DEFAULT 0,
  `purchase_first_time_order` float NOT NULL DEFAULT 0,
  `count_first_time_order` int(11) NOT NULL DEFAULT 0,
  `purchase_cart_sent` float NOT NULL DEFAULT 0,
  `count_cart_sent` int(11) NOT NULL DEFAULT 0,
  `purchase_potential_customers` float NOT NULL DEFAULT 0,
  `count_potential_customers` int(11) NOT NULL DEFAULT 0,
  `new_leads` int(11) NOT NULL DEFAULT 0,
  `customers_contacted` int(11) NOT NULL DEFAULT 0,
  `messages_sent` int(11) NOT NULL DEFAULT 0,
  `note` varchar(500) DEFAULT '',
  `complete_tasks` tinyint(1) NOT NULL DEFAULT 1,
  `date_created` timestamp NULL DEFAULT current_timestamp(),
  `time_zone` varchar(50) DEFAULT 'VN',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3054 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


-- admin_admin_new.db_list_refunded_order definition

CREATE TABLE `db_list_refunded_order` (
  `id` bigint(15) NOT NULL AUTO_INCREMENT,
  `id_order` bigint(15) NOT NULL,
  `id_staff` int(11) DEFAULT 0,
  `store` varchar(100) NOT NULL DEFAULT '',
  `amount` float DEFAULT 0,
  `payment_method` varchar(200) DEFAULT '',
  `date_created` datetime DEFAULT NULL,
  `source` varchar(100) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5550052577 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


-- admin_admin_new.db_log_ads_customer_pancake definition

CREATE TABLE `db_log_ads_customer_pancake` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ads_id` varchar(100) NOT NULL,
  `id_customer_crm` int(11) NOT NULL,
  `fb_id` varchar(100) DEFAULT '',
  `page_id` varchar(100) DEFAULT '',
  `conversation_id` varchar(256) DEFAULT '',
  `date_click_ads` datetime DEFAULT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17977 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


-- admin_admin_new.db_log_merge_customer definition

CREATE TABLE `db_log_merge_customer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `old_value` varchar(300) NOT NULL DEFAULT '',
  `new_value` varchar(300) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1281 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


-- admin_admin_new.db_material_attributes definition

CREATE TABLE `db_material_attributes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `type` varchar(100) NOT NULL,
  `Value` varchar(300) DEFAULT '""' COMMENT '- value color (element support)\r\n- value charm (size charm)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=271 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


-- admin_admin_new.db_material_per_product definition

CREATE TABLE `db_material_per_product` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sku_material` varchar(100) NOT NULL,
  `unit` varchar(100) NOT NULL,
  `sku_product` varchar(100) NOT NULL,
  `qty` float NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `inbound` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1019 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


-- admin_admin_new.db_material_stock definition

CREATE TABLE `db_material_stock` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sku_material` varchar(100) NOT NULL,
  `category` varchar(100) NOT NULL,
  `thumb_nail` varchar(500) NOT NULL,
  `name_material` varchar(500) NOT NULL,
  `price` float DEFAULT 0,
  `unit` varchar(100) NOT NULL,
  `metal` varchar(100) DEFAULT NULL,
  `stone` varchar(100) DEFAULT NULL,
  `size` varchar(100) DEFAULT NULL,
  `stock_vn` float NOT NULL DEFAULT 0,
  `stock_us` float NOT NULL DEFAULT 0,
  `collection` varchar(500) NOT NULL,
  `bead` float DEFAULT NULL,
  `cost` float DEFAULT 0,
  `weight` float DEFAULT NULL,
  `total_bead_vn` int(11) DEFAULT NULL,
  `total_bead_us` int(11) DEFAULT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `last_update` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `by_user` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1656 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


-- admin_admin_new.db_messages_pancake definition

CREATE TABLE `db_messages_pancake` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `page_id` varchar(100) NOT NULL DEFAULT '',
  `customer_id` varchar(100) DEFAULT '',
  `customer_id_crm` int(11) DEFAULT NULL,
  `conversation_id` varchar(100) DEFAULT '',
  `admin_id` varchar(100) DEFAULT '',
  `admin_uid` varchar(100) DEFAULT '',
  `admin_name` varchar(100) DEFAULT '',
  `sender_type` varchar(100) DEFAULT '',
  `sender_name` varchar(256) DEFAULT NULL,
  `message` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '',
  `attachments` varchar(3000) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=625479 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


-- admin_admin_new.db_new_promo_two definition

CREATE TABLE `db_new_promo_two` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `start_time_promo` datetime NOT NULL,
  `end_time_promo` datetime NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


-- admin_admin_new.db_new_promo_two_item definition

CREATE TABLE `db_new_promo_two_item` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `promo_id` varchar(50) DEFAULT NULL,
  `promo` varchar(255) DEFAULT NULL,
  `item` text DEFAULT NULL,
  `categories` text DEFAULT NULL,
  `products` text DEFAULT NULL,
  `attributes` text DEFAULT NULL,
  `categories_not_list` text DEFAULT NULL,
  `products_not_list` text DEFAULT NULL,
  `attribute_not_list` text DEFAULT NULL,
  `detail` text DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `percent_sale_price` int(11) DEFAULT NULL,
  `number_sale_price` float DEFAULT NULL,
  `text_bar` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active_reset_hebes` int(11) DEFAULT 0,
  `active_reset_ebes` int(11) DEFAULT 0,
  `active_send_hebes` int(11) DEFAULT 0,
  `active_send_ebes` int(11) DEFAULT 0,
  `start_time_promo` datetime DEFAULT NULL,
  `end_time_promo` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=157 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


-- admin_admin_new.db_notification_task definition

CREATE TABLE `db_notification_task` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_assignee` int(11) NOT NULL,
  `create_by` int(11) NOT NULL DEFAULT 0,
  `id_task` int(11) NOT NULL,
  `type` varchar(256) NOT NULL DEFAULT '',
  `title` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `details` varchar(800) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `date_read` datetime DEFAULT NULL,
  `status` int(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11256 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


-- admin_admin_new.db_order definition

CREATE TABLE `db_order` (
  `id` bigint(15) NOT NULL AUTO_INCREMENT,
  `parent_id` bigint(15) DEFAULT NULL,
  `link_order_number` varchar(300) NOT NULL DEFAULT '',
  `store` varchar(200) DEFAULT '',
  `status` varchar(100) NOT NULL,
  `date_created` timestamp NULL DEFAULT NULL,
  `customer_name` varchar(200) NOT NULL DEFAULT 'No Name',
  `source_page_fb` varchar(256) DEFAULT '''phone''',
  `id_nv_chotdon` int(11) DEFAULT 0,
  `id_nv_gioithieu` int(11) DEFAULT 0,
  `support_by` int(11) DEFAULT 0,
  `payment_method` varchar(100) NOT NULL,
  `total` float NOT NULL,
  `net_payment` float DEFAULT 0,
  `total_refunded` float DEFAULT 0,
  `email` varchar(300) NOT NULL,
  `error_order` tinyint(1) DEFAULT 0,
  `hinh_order` varchar(1000) DEFAULT '',
  `ship_date` timestamp NULL DEFAULT '0000-00-00 00:00:00',
  `delivered_date` timestamp NULL DEFAULT '0000-00-00 00:00:00',
  `tracking_number` varchar(80) DEFAULT '',
  `ship_carrier_status` varchar(20) DEFAULT '',
  `batch_ship` varchar(256) DEFAULT '',
  `note` varchar(800) DEFAULT '',
  `tag` varchar(150) DEFAULT '',
  `rank_order` varchar(300) DEFAULT '''New Customer''',
  `social_review` varchar(200) DEFAULT '',
  `customer_feedback` varchar(200) DEFAULT '',
  `img_feedback` varchar(1000) DEFAULT '',
  `note_follow_up` varchar(1000) DEFAULT '',
  `status_follow_up` varchar(200) DEFAULT '',
  `local_store` tinyint(1) DEFAULT 0,
  `live_stream` tinyint(1) NOT NULL DEFAULT 0,
  `source_ritamie` tinyint(1) NOT NULL DEFAULT 0,
  `order_diamond` tinyint(1) DEFAULT 0,
  `after_services` tinyint(1) DEFAULT 0,
  `pre_order` tinyint(1) DEFAULT 0,
  `claim_order` tinyint(1) DEFAULT 0,
  `approval_status` varchar(200) DEFAULT '',
  `deposit` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9990048299 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


-- admin_admin_new.db_order_detail definition

CREATE TABLE `db_order_detail` (
  `id` bigint(15) NOT NULL AUTO_INCREMENT,
  `status` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `total` float NOT NULL DEFAULT 0,
  `net_payment` float DEFAULT 0,
  `payment_method` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `coupon` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `customer_name` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT 'No Name',
  `email` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `phone` varchar(150) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `address` varchar(300) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `city` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `country` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `post_code` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `transaction_id` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `items_paid` varchar(4500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `customer_feedback` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `note_follow_up` varchar(1000) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `date_created` timestamp NULL DEFAULT current_timestamp(),
  `total_refunded` float DEFAULT 0,
  `deposit` int(1) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9990048298 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


-- admin_admin_new.db_order_line_item definition

CREATE TABLE `db_order_line_item` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_order` bigint(15) NOT NULL,
  `status_order` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `status_item` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `id_line_item` int(11) NOT NULL,
  `sku` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `name` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `price` float NOT NULL DEFAULT 0,
  `qty` int(5) NOT NULL DEFAULT 0,
  `category` varchar(1000) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `material` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `element` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `intention` varchar(300) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `stone` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `collection` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `thumb_nail` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `date_created` datetime NOT NULL,
  `status_stock` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=53994 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


-- admin_admin_new.db_order_product_custom definition

CREATE TABLE `db_order_product_custom` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `status` varchar(100) DEFAULT 'draft',
  `thumb_nail` varchar(255) DEFAULT '',
  `id_order` bigint(15) NOT NULL,
  `size` varchar(50) NOT NULL,
  `material` varchar(500) DEFAULT '',
  `main_stone` varchar(255) DEFAULT '',
  `stone` varchar(255) DEFAULT '',
  `engrave` varchar(255) DEFAULT '',
  `created_by` int(11) DEFAULT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


-- admin_admin_new.db_order_return definition

CREATE TABLE `db_order_return` (
  `id_order` bigint(15) NOT NULL AUTO_INCREMENT,
  `id_old_order` bigint(15) DEFAULT 0,
  `status_order` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `sale_order` int(11) DEFAULT 0,
  `updated_by` int(11) DEFAULT 0,
  `tracking_number` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `customer_name` varchar(400) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `order_date` datetime DEFAULT '0000-00-00 00:00:00',
  `date_inquiry` date DEFAULT current_timestamp(),
  `total` float DEFAULT NULL,
  `details_note` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `case` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `status` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `date_created_inquiry` datetime NOT NULL DEFAULT current_timestamp(),
  `email` varchar(300) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `reason` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `status_tracking` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `code_rma` int(11) DEFAULT 0,
  `amount` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `date_received` date DEFAULT NULL,
  PRIMARY KEY (`id_order`)
) ENGINE=InnoDB AUTO_INCREMENT=5550029674 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


-- admin_admin_new.db_orders_inbound_shipment definition

CREATE TABLE `db_orders_inbound_shipment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_order` bigint(15) NOT NULL,
  `type` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT 'transfer',
  `id_shipment` int(11) NOT NULL,
  `code` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `date_created` date DEFAULT current_timestamp(),
  `confirm` tinyint(1) DEFAULT 0,
  `items` int(11) NOT NULL DEFAULT 0,
  `products` int(11) NOT NULL DEFAULT 0,
  `note` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `issues` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1752 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


-- admin_admin_new.db_outbound_shipments definition

CREATE TABLE `db_outbound_shipments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code_ship` varchar(20) NOT NULL,
  `status` varchar(250) DEFAULT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_by` varchar(100) DEFAULT NULL,
  `updated_time` datetime DEFAULT current_timestamp(),
  `ship_date` datetime DEFAULT NULL,
  `delivery_date` datetime DEFAULT NULL,
  `orders_woo_id` text DEFAULT NULL,
  `create_order_id` text NOT NULL,
  `note_batch` text DEFAULT NULL,
  `note` text DEFAULT NULL,
  `tracking_number` text DEFAULT NULL,
  `estimated_arrival_date` date DEFAULT NULL,
  `img_shipment` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=341 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


-- admin_admin_new.db_payment_order definition

CREATE TABLE `db_payment_order` (
  `id` bigint(15) NOT NULL AUTO_INCREMENT,
  `parent_id` bigint(15) DEFAULT NULL,
  `status` varchar(100) NOT NULL DEFAULT '',
  `amount` float DEFAULT 0,
  `payment_method` varchar(256) DEFAULT '',
  `due_date` datetime DEFAULT NULL,
  `paid_date` datetime DEFAULT NULL,
  `date_created` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5550051148 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


-- admin_admin_new.db_project_space definition

CREATE TABLE `db_project_space` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `space_order` int(11) NOT NULL DEFAULT 0,
  `status_priority` varchar(256) NOT NULL DEFAULT 'Neutral',
  `title` varchar(400) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `team` varchar(256) NOT NULL DEFAULT '',
  `description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `request_admin` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `target` varchar(800) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `owner_project` int(11) NOT NULL DEFAULT 0,
  `total_member` int(11) NOT NULL DEFAULT 0,
  `total_task` int(11) NOT NULL DEFAULT 0,
  `total_task_completed` int(11) NOT NULL DEFAULT 0,
  `total_time` int(11) NOT NULL DEFAULT 0,
  `total_time_task_completed` int(11) NOT NULL DEFAULT 0,
  `status` varchar(256) NOT NULL DEFAULT 'Active',
  `date_time_start` datetime DEFAULT NULL,
  `date_time_end` datetime DEFAULT NULL,
  `date_created` datetime DEFAULT current_timestamp(),
  `date_completed` datetime DEFAULT NULL,
  `type_project` varchar(256) DEFAULT '',
  `is_continuous` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=116 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


-- admin_admin_new.db_promo definition

CREATE TABLE `db_promo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_project` int(10) DEFAULT NULL,
  `name_project` varchar(100) DEFAULT '',
  `status` tinyint(1) DEFAULT 0,
  `type` tinyint(1) DEFAULT 0,
  `name_promo` varchar(100) DEFAULT '',
  `amount` int(11) DEFAULT NULL,
  `description` varchar(1000) DEFAULT '',
  `text_bar` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '',
  `category` varchar(1000) DEFAULT '',
  `not_category` varchar(1000) DEFAULT '',
  `product` varchar(1000) DEFAULT '',
  `not_product` varchar(1000) DEFAULT '',
  `attribute` varchar(1000) DEFAULT '',
  `not_attribute` varchar(1000) DEFAULT '',
  `sync` tinyint(1) DEFAULT 0,
  `reset` tinyint(1) DEFAULT 0,
  `date_created` datetime DEFAULT current_timestamp(),
  `date_update` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `date_start` datetime DEFAULT '0000-00-00 00:00:00',
  `date_end` datetime DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


-- admin_admin_new.db_repository_project definition

CREATE TABLE `db_repository_project` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_project` int(11) NOT NULL,
  `link_file` varchar(500) NOT NULL DEFAULT '',
  `type_file` varchar(256) NOT NULL DEFAULT '',
  `name_file` varchar(256) NOT NULL DEFAULT '',
  `share_by` int(11) NOT NULL DEFAULT 0,
  `date_created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=103 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


-- admin_admin_new.db_request_off_sales definition

CREATE TABLE `db_request_off_sales` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group` varchar(100) DEFAULT '',
  `id_staff` int(11) NOT NULL DEFAULT 0,
  `reason` varchar(256) NOT NULL DEFAULT '',
  `body_email` varchar(800) DEFAULT NULL,
  `day_off` date DEFAULT NULL,
  `status` varchar(256) NOT NULL DEFAULT 'Processing',
  `id_shift_schedule` int(11) DEFAULT 0,
  `date_created` datetime DEFAULT NULL,
  `hr_comment` varchar(600) DEFAULT '',
  `confirm_by` int(11) DEFAULT NULL,
  `date_confirm` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


-- admin_admin_new.db_sales_management definition

CREATE TABLE `db_sales_management` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_name` int(11) NOT NULL,
  `shift` varchar(50) NOT NULL,
  `date` date NOT NULL,
  `new_customers` int(11) NOT NULL,
  `orders_closed` int(11) NOT NULL,
  `total_orders_closed` int(11) NOT NULL,
  `potential_customers` int(11) NOT NULL,
  `links_sent` int(11) NOT NULL,
  `field_note` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=148 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


-- admin_admin_new.db_sales_performance_tracker definition

CREATE TABLE `db_sales_performance_tracker` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_staff` int(11) NOT NULL,
  `name_staff` varchar(100) DEFAULT NULL,
  `points` int(11) DEFAULT NULL,
  `points_this_month` int(11) DEFAULT NULL,
  `input_points` varchar(10) DEFAULT NULL,
  `reverted_points` varchar(10) DEFAULT NULL,
  `date_created` timestamp NULL DEFAULT current_timestamp(),
  `date_updated` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `social_review` int(11) DEFAULT NULL,
  `ugc_social_media` int(11) DEFAULT NULL,
  `order_follow_up` int(11) DEFAULT NULL,
  `repurchase_2_weeks` int(11) DEFAULT NULL,
  `buy_3_products` int(11) DEFAULT NULL,
  `new_customer_purchase` int(11) DEFAULT NULL,
  `weekly_balance_80` int(11) DEFAULT NULL,
  `daily_revenue_80` int(11) DEFAULT NULL,
  `balanced_sales_80` int(11) DEFAULT NULL,
  `bad_customer_review` varchar(10) DEFAULT NULL,
  `late_follow_up` varchar(10) DEFAULT NULL,
  `returns_exchanges_order` varchar(10) DEFAULT NULL,
  `unconverted_leads_count` varchar(10) DEFAULT NULL,
  `lost_customers_count` varchar(10) DEFAULT NULL,
  `weekly_underperformance_80` varchar(10) DEFAULT NULL,
  `no_sales_days_count` varchar(11) DEFAULT NULL,
  `missing_leads_count` varchar(10) DEFAULT NULL,
  `daily_report_failed` varchar(10) DEFAULT NULL,
  `daily_report_missed` varchar(10) DEFAULT NULL,
  `new_customer` varchar(10) DEFAULT NULL,
  `label_add_late` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=630 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


-- admin_admin_new.db_schedule_preferences definition

CREATE TABLE `db_schedule_preferences` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `week` int(11) NOT NULL DEFAULT 1,
  `year` year(4) DEFAULT NULL,
  `schedule_preferences` varchar(500) NOT NULL DEFAULT '',
  `id_staff` int(11) NOT NULL DEFAULT 0,
  `date_created` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


-- admin_admin_new.db_schedule_rm_cate definition

CREATE TABLE `db_schedule_rm_cate` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sku` varchar(60) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `date_time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2363 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


-- admin_admin_new.db_sent_link_customer definition

CREATE TABLE `db_sent_link_customer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_staff` int(11) NOT NULL,
  `id_customer` int(11) DEFAULT NULL,
  `code` varchar(256) DEFAULT NULL,
  `type_code` varchar(100) NOT NULL DEFAULT '',
  `type` varchar(256) NOT NULL DEFAULT '',
  `amount` float NOT NULL DEFAULT 0,
  `processed` tinyint(1) NOT NULL DEFAULT 0,
  `date_created` datetime DEFAULT current_timestamp(),
  `id_order` bigint(15) DEFAULT NULL,
  `actual_amount` float DEFAULT 0,
  `store` varchar(100) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1205 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


-- admin_admin_new.db_shift_schedule_sales definition

CREATE TABLE `db_shift_schedule_sales` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_staff` int(11) NOT NULL DEFAULT 0,
  `date_time_start` datetime NOT NULL,
  `date_time_end` datetime NOT NULL,
  `shift` varchar(256) NOT NULL DEFAULT '',
  `total_time` int(11) NOT NULL DEFAULT 0,
  `type_sales_off` varchar(256) NOT NULL DEFAULT '',
  `status_authorization` tinyint(1) NOT NULL DEFAULT 0,
  `reason` varchar(256) NOT NULL DEFAULT '',
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `complete_shift` tinyint(1) DEFAULT 2 COMMENT '0 failed, 1 completed, 2 no confirm',
  `id_report_shift` int(11) DEFAULT 0,
  `confirm` tinyint(1) NOT NULL DEFAULT 1,
  `leader_shift` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15485 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


-- admin_admin_new.db_shipstation_order definition

CREATE TABLE `db_shipstation_order` (
  `id` bigint(15) NOT NULL AUTO_INCREMENT,
  `id_order` bigint(15) NOT NULL,
  `order_number` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `tracking_number` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `tag` varchar(150) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `note` varchar(800) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `batch` varchar(156) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `status` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `ship_date` date DEFAULT NULL,
  `delivered_date` date DEFAULT NULL,
  `estimated_delivery` date DEFAULT NULL,
  `time` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `link_order` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `combine_id` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `list_combine` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `list_combine_number` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=920112402 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


-- admin_admin_new.db_staff definition

CREATE TABLE `db_staff` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_schedule` int(11) NOT NULL DEFAULT 0,
  `full_name` varchar(300) NOT NULL,
  `doanh_so_thang` int(11) NOT NULL DEFAULT 0,
  `sales` tinyint(1) DEFAULT 0,
  `id_user_pancake` varchar(356) DEFAULT '',
  `location` varchar(20) DEFAULT 'VN',
  `target_livestream` float DEFAULT 0,
  `target_ritamie` float DEFAULT 0,
  `status_work` varchar(100) DEFAULT 'active',
  `schedule_preferences` varchar(300) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


-- admin_admin_new.db_status_after_sales_services definition

CREATE TABLE `db_status_after_sales_services` (
  `id_order` bigint(15) NOT NULL AUTO_INCREMENT,
  `id_old_order` bigint(15) DEFAULT 0,
  `updated_by` int(11) DEFAULT 0,
  `date_inquiry` datetime DEFAULT current_timestamp(),
  `details_note` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `case_services` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `status_case` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `date_created_inquiry` date DEFAULT current_timestamp(),
  `reason` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `status_tracking` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `code_rma` int(11) DEFAULT 0,
  `date_received` date DEFAULT NULL,
  `tracking_number` varchar(80) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `amount` float DEFAULT 0,
  PRIMARY KEY (`id_order`)
) ENGINE=InnoDB AUTO_INCREMENT=5550052912 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


-- admin_admin_new.db_status_diamond definition

CREATE TABLE `db_status_diamond` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `actual_amount` float DEFAULT 0,
  `balance_due` float DEFAULT 0,
  `status_payment` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `img_3d_design` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `status_design` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `time_design` date DEFAULT '0000-00-00',
  `time_material` date DEFAULT '0000-00-00',
  `status_material` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `status_complete` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `time_complete` date DEFAULT '0000-00-00',
  `ship_date` date DEFAULT '0000-00-00',
  `check_status` varchar(5000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Size-0-0|Metal-0-0|Stone-0-0|Main Stone-0-0|Engrave-0-0|Perfection-0-0|Note-0',
  `third_party_brand` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9990048298 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


-- admin_admin_new.db_status_pre_order definition

CREATE TABLE `db_status_pre_order` (
  `id` bigint(15) NOT NULL AUTO_INCREMENT,
  `status` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT 'pending',
  `update_by` int(11) DEFAULT 0,
  `update_time` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `hold_until` date DEFAULT NULL,
  `reason` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `category` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `vendor` varchar(300) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `note` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `processing_date` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5550052694 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


-- admin_admin_new.db_sub_id_lead definition

CREATE TABLE `db_sub_id_lead` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_customer` int(11) NOT NULL,
  `id_lead` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `source` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT 'by_chloe',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=280 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


-- admin_admin_new.db_summary_messages_pancake definition

CREATE TABLE `db_summary_messages_pancake` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `page_id` varchar(100) NOT NULL,
  `customer_id` varchar(100) DEFAULT NULL,
  `customer_id_crm` int(11) DEFAULT NULL,
  `admin_uids` text DEFAULT NULL,
  `admin_names` text DEFAULT NULL,
  `customer_name` varchar(256) DEFAULT NULL,
  `conversation_id` varchar(100) DEFAULT NULL,
  `summary` text DEFAULT NULL,
  `state` varchar(100) DEFAULT 'open',
  `journey_stage` varchar(100) DEFAULT NULL,
  `emotion` varchar(100) DEFAULT 'neutral',
  `reply_quality` text DEFAULT NULL,
  `next_action` text DEFAULT NULL,
  `tags` text DEFAULT '',
  `conversation_start` datetime DEFAULT NULL,
  `conversation_end` datetime DEFAULT NULL,
  `date_created` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_customer_id` (`customer_id_crm`)
) ENGINE=InnoDB AUTO_INCREMENT=20932 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- admin_admin_new.db_target_report_end_shift definition

CREATE TABLE `db_target_report_end_shift` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_staff` int(11) NOT NULL,
  `date_start_target` date NOT NULL,
  `date_end_target` date NOT NULL,
  `total_revenue` float NOT NULL DEFAULT 0,
  `purchase_first_time_order` float NOT NULL DEFAULT 0,
  `count_first_time_order` int(11) NOT NULL DEFAULT 0,
  `purchase_cart_sent` float NOT NULL DEFAULT 0,
  `count_cart_sent` int(11) NOT NULL DEFAULT 0,
  `purchase_potential_customers` float NOT NULL DEFAULT 0,
  `count_potential_customers` int(11) NOT NULL DEFAULT 0,
  `new_leads` int(11) NOT NULL DEFAULT 0,
  `customers_contacted` int(11) NOT NULL DEFAULT 0,
  `messages_sent` int(11) NOT NULL DEFAULT 0,
  `note` varchar(256) DEFAULT '',
  `date_created` timestamp NULL DEFAULT current_timestamp(),
  `time_zone` varchar(50) DEFAULT 'VN',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


-- admin_admin_new.db_task_repeat_space definition

CREATE TABLE `db_task_repeat_space` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_assignee` int(11) NOT NULL DEFAULT 0,
  `id_project` int(11) NOT NULL DEFAULT 0,
  `team` varchar(256) NOT NULL DEFAULT '',
  `title` varchar(256) NOT NULL DEFAULT '',
  `details` varchar(700) NOT NULL,
  `frequency` varchar(100) NOT NULL DEFAULT '',
  `day_repeat` varchar(300) NOT NULL DEFAULT '',
  `time_zone` varchar(200) NOT NULL DEFAULT 'Asia/Ho_Chi_Minh',
  `next_run` datetime DEFAULT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `processing_time` int(7) NOT NULL DEFAULT 24,
  `ids_assignee` varchar(256) NOT NULL DEFAULT '',
  `days_before_insert` int(1) NOT NULL DEFAULT 7,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=201 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


-- admin_admin_new.db_task_space definition

CREATE TABLE `db_task_space` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key_repeat` varchar(100) NOT NULL DEFAULT '',
  `id_assignee` int(11) NOT NULL DEFAULT 0,
  `assignee_by` int(11) NOT NULL DEFAULT 0,
  `id_project` int(11) NOT NULL DEFAULT 0,
  `team` varchar(256) NOT NULL DEFAULT '',
  `title` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `details` varchar(700) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `status` varchar(256) NOT NULL DEFAULT '',
  `deadline` datetime DEFAULT NULL,
  `original_deadline` datetime DEFAULT NULL,
  `status_deadline` varchar(100) DEFAULT '',
  `id_order` bigint(15) NOT NULL DEFAULT 0,
  `link_after_sales` varchar(100) NOT NULL DEFAULT '',
  `id_customer` int(11) NOT NULL DEFAULT 0,
  `order_in_project` int(11) NOT NULL DEFAULT 0,
  `order_in_assignee` int(11) NOT NULL DEFAULT 0,
  `date_updated` datetime DEFAULT current_timestamp(),
  `date_completed` datetime DEFAULT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `admin_note` varchar(500) NOT NULL,
  `confirm_note` tinyint(1) NOT NULL DEFAULT 1,
  `note_by_user` int(11) NOT NULL DEFAULT 0,
  `date_admin_note` datetime DEFAULT NULL,
  `type_deliverable` varchar(100) NOT NULL DEFAULT '',
  `link_deliverable` varchar(300) NOT NULL DEFAULT '',
  `name_deliverable` varchar(100) NOT NULL,
  `status_review_deliverable` varchar(100) NOT NULL DEFAULT 'Neutral',
  `self_reivew_deliverable` varchar(800) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `leader_reivew_deliverable` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `review_by` int(11) NOT NULL DEFAULT 0,
  `total_comment` int(11) NOT NULL DEFAULT 0,
  `date_submit_deliverable` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20192 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


-- admin_admin_new.db_thanhtich definition

CREATE TABLE `db_thanhtich` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_nhanvien` int(11) NOT NULL DEFAULT 0,
  `full_name` varchar(256) DEFAULT '''''',
  `total_gioi_thieu` int(11) DEFAULT 0,
  `total_chot_don` int(11) DEFAULT 0,
  `doanh_so` float NOT NULL DEFAULT 0,
  `target_thang` int(11) DEFAULT 0,
  `month` varchar(20) NOT NULL DEFAULT '01',
  `year` year(4) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=745 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


-- admin_admin_new.db_warning_staff definition

CREATE TABLE `db_warning_staff` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_staff` int(11) NOT NULL,
  `id_order` bigint(15) NOT NULL,
  `warning` varchar(456) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `replay_notice` varchar(456) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `status_update` tinyint(1) DEFAULT 0,
  `type` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT 'follow_customer',
  `id_type` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `update_date` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17134 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


-- admin_admin_new.db_workflow_ai definition

CREATE TABLE `db_workflow_ai` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid_page` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `source` enum('internal','n8n','gpts','zapier','make') DEFAULT 'internal',
  `status` enum('active','paused','draft') DEFAULT 'draft',
  `trigger_type` enum('webhook','event','schedule','manual') DEFAULT 'manual',
  `trigger_config` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`trigger_config`)),
  `nodes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`nodes`)),
  `edges` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`edges`)),
  `runs_count` int(10) unsigned DEFAULT 0,
  `success_rate` decimal(5,2) DEFAULT 0.00,
  `last_run_at` datetime DEFAULT NULL,
  `date_created` datetime DEFAULT current_timestamp(),
  `date_updated` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_source` (`source`),
  KEY `idx_trigger_type` (`trigger_type`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- admin_admin_new.note_order_not_found definition

CREATE TABLE `note_order_not_found` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_order` bigint(15) NOT NULL DEFAULT 0,
  `note` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `id_staff` int(11) DEFAULT 0,
  `date_created` datetime DEFAULT current_timestamp(),
  `completed` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=143 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


-- admin_admin_new.res_attributes definition

CREATE TABLE `res_attributes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(300) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `type` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `description` varchar(1000) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


-- admin_admin_new.res_cat_autosku definition

CREATE TABLE `res_cat_autosku` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) NOT NULL,
  `last_sku` varchar(100) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


-- admin_admin_new.res_category definition

CREATE TABLE `res_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `id_web` int(11) DEFAULT 0,
  `parent` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


-- admin_admin_new.res_history_stock definition

CREATE TABLE `res_history_stock` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `stock` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `detail` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `time` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `source` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `qty_change` int(11) DEFAULT 0,
  `id_line_item` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


-- admin_admin_new.res_order definition

CREATE TABLE `res_order` (
  `id` bigint(15) NOT NULL AUTO_INCREMENT,
  `date_created` timestamp NULL DEFAULT NULL,
  `customer_name` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `id_nv_chotdon` int(11) DEFAULT 0,
  `id_nv_gioithieu` int(11) DEFAULT 0,
  `payment_method` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `total` float NOT NULL,
  `status` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `email` varchar(300) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `admin_check` tinyint(1) DEFAULT 0,
  `hinh_order` varchar(1000) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `ship_date` timestamp NULL DEFAULT '0000-00-00 00:00:00',
  `delivered_date` timestamp NULL DEFAULT '0000-00-00 00:00:00',
  `note` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `tracking_number` varchar(80) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `tag` varchar(150) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `local_store` tinyint(1) DEFAULT 0,
  `error_order` tinyint(1) DEFAULT 0,
  `rank_order` varchar(300) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT 'New Customer',
  `live_stream` tinyint(1) NOT NULL DEFAULT 0,
  `social_review` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `customer_feedback` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `note_follow_up` varchar(1000) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `status_follow_up` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `approval_status` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `store` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `img_feedback` varchar(1000) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `support_by` int(11) DEFAULT 0,
  `order_diamond` tinyint(1) DEFAULT 0,
  `pre_order` tinyint(1) DEFAULT 0,
  `ship_carrier_status` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `source_page_fb` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT 'by_chloe',
  `batch_ship` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `link_order` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `export_ship` tinyint(1) DEFAULT 0,
  `after_services` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1790 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


-- admin_admin_new.res_order_detail definition

CREATE TABLE `res_order_detail` (
  `id` bigint(15) NOT NULL AUTO_INCREMENT,
  `status` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `total` float NOT NULL DEFAULT 0,
  `payment_method` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `coupon` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `customer_name` varchar(200) NOT NULL,
  `address` varchar(300) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `post_code` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `email` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `phone` varchar(150) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `city` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `country` varchar(200) DEFAULT '',
  `date_created` datetime DEFAULT NULL,
  `transaction_id` varchar(300) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `items_paid` varchar(4500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `customer_feedback` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `note_follow_up` varchar(1000) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1790 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


-- admin_admin_new.res_order_line_item definition

CREATE TABLE `res_order_line_item` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_order` bigint(15) NOT NULL,
  `status_order` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `status_item` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `id_line_item` int(11) NOT NULL,
  `sku` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `name` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `price` float NOT NULL DEFAULT 0,
  `qty` int(5) NOT NULL DEFAULT 0,
  `category` varchar(1000) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `material` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `collection` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `thumb_nail` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `date_created` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


-- admin_admin_new.res_product definition

CREATE TABLE `res_product` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `status` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `sku` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `name` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `thumb_nail` varchar(1000) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `name_image` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `retail_price` float DEFAULT 0,
  `sale_price` float DEFAULT 0,
  `size` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `color` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `category` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `description` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `last_update` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `by_user` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `tag` varchar(300) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=117 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


-- admin_admin_new.res_stock definition

CREATE TABLE `res_stock` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sku_product` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `location` varchar(10) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `qty` int(4) DEFAULT 0,
  `stock_out` int(11) DEFAULT 0,
  `coming_stock` int(11) DEFAULT 0,
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `name_product` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `last_update` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `user` varchar(300) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `time_group_sku` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Mục đích dành cho việc group 2 sku giống nhau cho việc render theo time',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


-- admin_admin_new.twilio_kv_store definition

CREATE TABLE `twilio_kv_store` (
  `key` varchar(255) NOT NULL,
  `value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`value`)),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- admin_admin_new.twilio_sender_accounts definition

CREATE TABLE `twilio_sender_accounts` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `account_name` text DEFAULT NULL,
  `provider` enum('twilio','other') DEFAULT 'twilio',
  `account_sid` text DEFAULT NULL,
  `auth_token` text DEFAULT NULL,
  `settings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`settings`)),
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_twilio_sender_accounts_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- admin_admin_new.twilio_users definition

CREATE TABLE `twilio_users` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `name` text DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(64) DEFAULT NULL,
  `role` enum('admin','manager','agent','viewer') DEFAULT 'agent',
  `avatar_url` text DEFAULT NULL,
  `timezone` varchar(64) DEFAULT NULL,
  `status` enum('offline','online','away','busy') DEFAULT 'offline',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_twilio_users_email` (`email`),
  UNIQUE KEY `uq_twilio_users_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- admin_admin_new.db_outbound_shipments_orders definition

CREATE TABLE `db_outbound_shipments_orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `status` varchar(255) DEFAULT NULL,
  `shipment_id` int(11) NOT NULL,
  `create_order_id` text NOT NULL,
  `name_product` text DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `shipment_id` (`shipment_id`),
  CONSTRAINT `db_outbound_shipments_orders_ibfk_1` FOREIGN KEY (`shipment_id`) REFERENCES `db_outbound_shipments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=727 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


-- admin_admin_new.db_outbound_shipments_products definition

CREATE TABLE `db_outbound_shipments_products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `status` varchar(50) DEFAULT NULL,
  `name_product` varchar(255) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `qty_diff` int(11) NOT NULL DEFAULT 0,
  `product_id` varchar(100) DEFAULT NULL,
  `shipment_orders_id` int(11) DEFAULT NULL,
  `id_order` text DEFAULT NULL,
  `shipment_id` int(11) NOT NULL,
  `sku` varchar(100) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `code` varchar(50) DEFAULT NULL,
  `issues_status` text DEFAULT NULL,
  `id_shipstation_order` text DEFAULT NULL,
  `note` text DEFAULT NULL,
  `date_created` datetime DEFAULT current_timestamp(),
  `ship_date` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `shipment_id` (`shipment_id`),
  CONSTRAINT `db_outbound_shipments_products_ibfk_1` FOREIGN KEY (`shipment_id`) REFERENCES `db_outbound_shipments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6822 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


-- admin_admin_new.db_revision_shift_schedule definition

CREATE TABLE `db_revision_shift_schedule` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_revision` int(11) NOT NULL DEFAULT 0,
  `id_staff` int(11) NOT NULL DEFAULT 0,
  `date_time_start` datetime NOT NULL,
  `date_time_end` datetime NOT NULL,
  `shift` varchar(256) NOT NULL DEFAULT '',
  `total_time` int(11) NOT NULL DEFAULT 0,
  `type_sales_off` varchar(256) NOT NULL DEFAULT '',
  `status_authorization` tinyint(1) NOT NULL DEFAULT 0,
  `reason` varchar(256) NOT NULL DEFAULT '',
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `complete_shift` tinyint(1) DEFAULT 2 COMMENT '0 failed, 1 completed, 2 no confirm',
  `id_report_shift` int(11) DEFAULT 0,
  `confirm` tinyint(1) NOT NULL DEFAULT 1,
  `leader_shift` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `db_revision_shift_schedule_db_info_revision_schedule_FK` (`id_revision`),
  CONSTRAINT `db_revision_shift_schedule_db_info_revision_schedule_FK` FOREIGN KEY (`id_revision`) REFERENCES `db_info_revision_schedule` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=48518 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


-- admin_admin_new.twilio_sender_phone_numbers definition

CREATE TABLE `twilio_sender_phone_numbers` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `phone_number` varchar(64) NOT NULL,
  `friendly_name` text DEFAULT NULL,
  `is_primary` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `assigned_to` char(36) DEFAULT NULL,
  `account_id` char(36) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_twilio_sender_phone_numbers_number` (`phone_number`),
  KEY `idx_twilio_sender_numbers_account` (`account_id`),
  KEY `idx_twilio_sender_numbers_assigned` (`assigned_to`),
  CONSTRAINT `fk_sender_numbers_account` FOREIGN KEY (`account_id`) REFERENCES `twilio_sender_accounts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_sender_numbers_assigned_user` FOREIGN KEY (`assigned_to`) REFERENCES `twilio_users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- admin_admin_new.twilio_sms_messages definition

CREATE TABLE `twilio_sms_messages` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `direction` enum('inbound','outbound') NOT NULL,
  `from_number` varchar(64) DEFAULT NULL,
  `to_number` varchar(64) DEFAULT NULL,
  `body` longtext DEFAULT NULL,
  `media_count` int(11) DEFAULT 0,
  `status` enum('queued','sending','sent','delivered','failed','received') DEFAULT 'queued',
  `provider` enum('twilio','other') DEFAULT 'twilio',
  `provider_message_sid` varchar(191) DEFAULT NULL,
  `provider_error_code` varchar(64) DEFAULT NULL,
  `provider_payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`provider_payload`)),
  `received_at` timestamp NULL DEFAULT NULL,
  `sent_at` timestamp NULL DEFAULT NULL,
  `delivered_at` timestamp NULL DEFAULT NULL,
  `failed_at` timestamp NULL DEFAULT NULL,
  `conversation_id` char(36) DEFAULT NULL,
  `user_id` char(36) DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `message_type` varchar(64) DEFAULT NULL,
  `sender_phone_number_id` char(36) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_twilio_sms_provider_sid` (`provider_message_sid`),
  KEY `idx_twilio_sms_conversation` (`conversation_id`),
  KEY `idx_twilio_sms_user` (`user_id`),
  KEY `idx_twilio_sms_sendernum` (`sender_phone_number_id`),
  KEY `idx_twilio_sms_created` (`created_at`),
  CONSTRAINT `fk_sms_sender_number` FOREIGN KEY (`sender_phone_number_id`) REFERENCES `twilio_sender_phone_numbers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_sms_user` FOREIGN KEY (`user_id`) REFERENCES `twilio_users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- admin_admin_new.twilio_attachments definition

CREATE TABLE `twilio_attachments` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `message_id` char(36) NOT NULL,
  `file_url` text DEFAULT NULL,
  `file_type` varchar(128) DEFAULT NULL,
  `file_size` bigint(20) DEFAULT NULL,
  `thumbnail_url` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_twilio_attachments_message` (`message_id`),
  CONSTRAINT `fk_attachments_message` FOREIGN KEY (`message_id`) REFERENCES `twilio_sms_messages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- admin_admin_new.twilio_contacts definition

CREATE TABLE `twilio_contacts` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `name` text DEFAULT NULL,
  `phone` varchar(64) DEFAULT NULL,
  `country_code` varchar(8) DEFAULT NULL,
  `area_code` varchar(16) DEFAULT NULL,
  `timezone` varchar(64) DEFAULT NULL,
  `crm_id` char(36) DEFAULT NULL,
  `last_contacted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `assigned_phone_number_id` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_twilio_contacts_phone` (`phone`),
  KEY `fk_contacts_assigned_phone` (`assigned_phone_number_id`),
  CONSTRAINT `fk_contacts_assigned_phone` FOREIGN KEY (`assigned_phone_number_id`) REFERENCES `twilio_sender_phone_numbers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- admin_admin_new.twilio_conversation_meta definition

CREATE TABLE `twilio_conversation_meta` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `conversation_id` char(36) DEFAULT NULL,
  `contact_id` char(36) DEFAULT NULL,
  `crm_id` char(36) DEFAULT NULL,
  `order_id` char(36) DEFAULT NULL,
  `assigned_to` char(36) DEFAULT NULL,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `stage` varchar(64) DEFAULT NULL,
  `state` varchar(64) DEFAULT NULL,
  `emotion` varchar(64) DEFAULT NULL,
  `summary_id` char(36) DEFAULT NULL,
  `summary_text` longtext DEFAULT NULL,
  `last_activity_at` timestamp NULL DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_twilio_cmeta_contact` (`contact_id`),
  KEY `idx_twilio_cmeta_assigned` (`assigned_to`),
  KEY `idx_twilio_cmeta_last_activity` (`last_activity_at`),
  KEY `fk_cmeta_updated_by` (`updated_by`),
  KEY `fk_cmeta_conversation` (`conversation_id`),
  CONSTRAINT `fk_cmeta_assigned` FOREIGN KEY (`assigned_to`) REFERENCES `twilio_users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_cmeta_contact` FOREIGN KEY (`contact_id`) REFERENCES `twilio_contacts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_cmeta_conversation` FOREIGN KEY (`conversation_id`) REFERENCES `twilio_sms_messages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_cmeta_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `twilio_users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- admin_admin_new.twilio_customer_phone_numbers definition

CREATE TABLE `twilio_customer_phone_numbers` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `contact_id` char(36) NOT NULL,
  `phone_number` varchar(64) DEFAULT NULL,
  `type` enum('primary','secondary','work','home','other') DEFAULT 'primary',
  `is_verified` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_twilio_customer_phone_numbers_contact` (`contact_id`),
  CONSTRAINT `fk_customer_phone_numbers_contact` FOREIGN KEY (`contact_id`) REFERENCES `twilio_contacts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- admin_admin_new.twilio_message_reactions definition

CREATE TABLE `twilio_message_reactions` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `message_id` char(36) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `emoji` varchar(32) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_twilio_msgreact_message` (`message_id`),
  KEY `idx_twilio_msgreact_user` (`user_id`),
  CONSTRAINT `fk_msgreact_message` FOREIGN KEY (`message_id`) REFERENCES `twilio_sms_messages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_msgreact_user` FOREIGN KEY (`user_id`) REFERENCES `twilio_users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;