require('dotenv').config();
const { Client } = require('pg');
const mysql = require('mysql2/promise');

// PostgreSQL connection configuration
const pgClient = new Client({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

// MySQL connection configuration (old database)
const mysqlConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_DB_USER,
  password: process.env.MYSQL_DB_PASSWORD,
  database: process.env.MYSQL_DB_NAME,
};

// Helper function to convert date to UTC ISO string
function toUTCString(date) {
  if (!date) return null;
  if (date instanceof Date) {
    return date.toISOString();
  }
  const parsed = new Date(date);
  return isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

// Helper function to parse date (handles MySQL zero dates)
function parseDate(date) {
  if (!date) return null;
  if (date === '0000-00-00 00:00:00' || date === '0000-00-00' || date === '1970-01-01') {
    return null;
  }
  const parsed = new Date(date);
  return isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

// Helper function to safely parse integer
function parseIntSafe(value, defaultValue = null) {
  if (value === null || value === undefined || value === '') return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

// Helper function to safely parse float
function parseFloatSafe(value, defaultValue = 0) {
  if (value === null || value === undefined || value === '') return defaultValue;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

// Function to clear orders data
async function clearOrdersData() {
  try {
    // Delete in reverse order of dependencies
    await pgClient.query('DELETE FROM order_payments');
    await pgClient.query('DELETE FROM order_images');
    await pgClient.query('DELETE FROM order_meta_crm');
    await pgClient.query('DELETE FROM orders_meta');
    await pgClient.query('DELETE FROM order_items');
    await pgClient.query('DELETE FROM orders');

    // Reset identity sequences
    await pgClient.query('ALTER SEQUENCE order_payments_id_seq RESTART WITH 1');
    await pgClient.query('ALTER SEQUENCE order_images_id_seq RESTART WITH 1');
    await pgClient.query('ALTER SEQUENCE order_items_id_seq RESTART WITH 1');
    await pgClient.query('ALTER SEQUENCE orders_id_seq RESTART WITH 1');
  } catch (error) {
    throw new Error(`Failed to clear orders data: ${error.message}`);
  }
}

// Get customers from new PostgreSQL database
async function getCustomersFromNewDB() {
  try {
    const result = await pgClient.query(
      `SELECT 
        c.id as customer_id,
        pk.external_key as email,
        c.personal_key_id
      FROM crm_customers c
      INNER JOIN crm_personal_keys pk ON c.personal_key_id = pk.id
      WHERE pk.external_key != '' AND pk.external_key IS NOT NULL
      ORDER BY c.id
      LIMIT 100`
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
}

// Get orders from old MySQL database by email
async function getOrdersByEmail(mysqlConnection, email) {
  try {
    const [orders] = await mysqlConnection.execute(
      `SELECT 
        id,
        parent_id,
        link_order_number,
        store,
        status,
        date_created,
        customer_name,
        source_page_fb,
        id_nv_chotdon,
        id_nv_gioithieu,
        support_by,
        payment_method,
        total,
        net_payment,
        total_refunded,
        email,
        error_order,
        hinh_order,
        ship_date,
        delivered_date,
        tracking_number,
        ship_carrier_status,
        batch_ship,
        note,
        tag,
        rank_order,
        social_review,
        customer_feedback,
        img_feedback,
        note_follow_up,
        status_follow_up,
        local_store,
        live_stream,
        source_ritamie,
        order_diamond,
        after_services,
        pre_order,
        claim_order,
        approval_status,
        deposit
      FROM db_order
      WHERE email = ?
      ORDER BY date_created DESC
      LIMIT 2`,
      [email]
    );
    return orders;
  } catch (error) {
    throw error;
  }
}

// Get order line items from old database
async function getOrderLineItems(mysqlConnection, orderId) {
  try {
    const [items] = await mysqlConnection.execute(
      `SELECT 
        id,
        id_order,
        status_order,
        status_item,
        id_line_item,
        sku,
        name,
        price,
        qty,
        category,
        material,
        element,
        intention,
        stone,
        collection,
        thumb_nail,
        date_created,
        status_stock
      FROM db_order_line_item
      WHERE id_order = ?
      ORDER BY id_line_item`,
      [orderId]
    );

    //dựa vào sku where bên bảng product của hệ thống mới lấy ra name 
    return items;
  } catch (error) {
    throw error;
  }
}

// Get payments from old database
async function getOrderPayments(mysqlConnection, orderId) {
  try {
    const [payments] = await mysqlConnection.execute(
      `SELECT 
        id,
        parent_id,
        status,
        amount,
        payment_method,
        due_date,
        paid_date,
        date_created
      FROM db_payment_order
      WHERE id = ? OR parent_id = ?
      ORDER BY date_created`,
      [orderId, orderId]
    );
    return payments;
  } catch (error) {
    throw error;
  }
}

// Get refunds from old database
async function getOrderRefunds(mysqlConnection, orderId) {
  try {
    const [refunds] = await mysqlConnection.execute(
      `SELECT 
        id,
        id_order,
        id_staff,
        store,
        amount,
        payment_method,
        date_created,
        source
      FROM db_list_refunded_order
      WHERE id_order = ?
      ORDER BY date_created`,
      [orderId]
    );
    return refunds;
  } catch (error) {
    throw error;
  }
}

// Get after sales services from old database (by order ID)
async function getAfterSalesServices(mysqlConnection, orderId) {
  try {
    const [services] = await mysqlConnection.execute(
      `SELECT 
        id_order,
        id_old_order,
        updated_by,
        date_inquiry,
        details_note,
        case_services,
        status_case,
        date_created_inquiry,
        reason,
        status_tracking,
        code_rma,
        date_received,
        tracking_number,
        amount
      FROM db_status_after_sales_services
      WHERE id_order = ?
      LIMIT 1`,
      [orderId]
    );
    return services.length > 0 ? services[0] : null;
  } catch (error) {
    throw error;
  }
}

// Get pre-order status from old database (by order ID)
async function getPreOrderStatus(mysqlConnection, orderId) {
  try {
    const [preOrders] = await mysqlConnection.execute(
      `SELECT 
        id,
        status,
        update_by,
        update_time,
        hold_until,
        reason,
        category,
        vendor,
        note,
        processing_date
      FROM db_status_pre_order
      WHERE id = ?
      LIMIT 1`,
      [orderId]
    );
    return preOrders.length > 0 ? preOrders[0] : null;
  } catch (error) {
    throw error;
  }
}

// Get diamond/customization status from old database (by order ID)
async function getDiamondStatus(mysqlConnection, orderId) {
  try {
    const [diamonds] = await mysqlConnection.execute(
      `SELECT 
        id,
        actual_amount,
        balance_due,
        status_payment,
        img_3d_design,
        status_design,
        time_design,
        time_material,
        status_material,
        status_complete,
        time_complete,
        ship_date,
        check_status,
        third_party_brand
      FROM db_status_diamond
      WHERE id = ?
      LIMIT 1`,
      [orderId]
    );
    return diamonds.length > 0 ? diamonds[0] : null;
  } catch (error) {
    throw error;
  }
}


// Map old order status to new status
function mapOrderStatus(oldStatus) {
  const statusMap = {
    'pending': 'pending',
    'processing': 'processing',
    'shipped': 'shipped',
    'delivered': 'delivered',
    'cancelled': 'cancelled',
    'refunded': 'refunded',
    'completed': 'completed',
  };
  return statusMap[oldStatus?.toLowerCase()] || oldStatus || 'pending';
}

const normalizeName = (str) => {
  return str
    .replace(/_/g, " ")                // đổi _ thành khoảng trắng
    .toLowerCase()                      // đổi toàn chuỗi về chữ thường
    .replace(/\b\w/g, char => char.toUpperCase()); // viết hoa chữ đầu mỗi từ
};

// Seed orders data
async function seedOrdersData() {
  let mysqlConnection;
  try {
    await pgClient.connect();
    mysqlConnection = await mysql.createConnection(mysqlConfig);

    await pgClient.query('BEGIN');

    // Clear existing data first
    await clearOrdersData();

    // Get tenant ID
    const tenantResult = await pgClient.query(
      `SELECT id FROM sys_tenants WHERE slug = 'dfc-flow' LIMIT 1`
    );
    if (tenantResult.rows.length === 0) {
      throw new Error('Tenant "dfc-flow" not found. Please run map-data-001.js first.');
    }
    const tenantId = tenantResult.rows[0].id;

    // Get default user ID
    const userResult = await pgClient.query(`SELECT id FROM sys_users WHERE is_active = true LIMIT 1`);
    const defaultUserId = userResult.rows.length > 0 ? userResult.rows[0].id : null;

    // Get all valid user IDs from sys_users (to validate old user IDs)
    const validUsersResult = await pgClient.query(`SELECT id FROM sys_users`);
    const validUserIds = new Set(validUsersResult.rows.map(row => row.id));

    // Helper function to validate and get user ID (returns null if not found, otherwise returns the ID)
    function getValidUserId(oldUserId) {
      if (!oldUserId) return null;
      const parsedId = parseIntSafe(oldUserId, null);
      if (!parsedId) return null;
      return validUserIds.has(String(parsedId)) ? parsedId : null;
    }

    // Helper function to get product_id from SKU (returns null if not found)
    async function getProductIdBySku(sku) {
      if (!sku || sku.trim() === '') return null;
      try {
        const productResult = await pgClient.query(
          `SELECT id FROM product WHERE sku = $1 LIMIT 1`,
          [sku.trim()]
        );
        return productResult.rows.length > 0 ? productResult.rows[0].id : null;
      } catch (error) {
        return null;
      }
    }

    // Get customers from new database
    const customers = await getCustomersFromNewDB();

    let totalOrdersMigrated = 0;
    let totalItemsMigrated = 0;

    // Process each customer
    for (const customer of customers) {
      const customerEmail = customer.email;
      if (!customerEmail || customerEmail.trim() === '') continue;

      // Get orders from old database for this customer
      const oldOrders = await getOrdersByEmail(mysqlConnection, customerEmail);

      for (const oldOrder of oldOrders) {
        try {
          // Get customer's default address for shipping/billing
          const addressResult = await pgClient.query(
            `SELECT id FROM crm_personal_addresses 
             WHERE personal_key_id = $1 AND is_default = true 
             LIMIT 1`,
            [customer.personal_key_id]
          );
          const defaultAddressId = addressResult.rows.length > 0 ? addressResult.rows[0].id : null;

          // Map source_page_fb to platform page ID (if exists, filter by tenant)
          let channelPlatformPageId = null;
          const oldSourcePageFb = oldOrder.source_page_fb;
          if (oldSourcePageFb && oldSourcePageFb.trim() !== '' && oldSourcePageFb !== 'phone') {
            const nameOldSourcePageFb = normalizeName(oldSourcePageFb.trim()); // biến từ by_chloe thành By Chloe
            // Try to find by name (filter by tenant)
            let platformPageResult = await pgClient.query(
              `SELECT id FROM channels_platform_pages 
               WHERE tenant_id = $1 AND name = $2
               LIMIT 1`,
              [tenantId, nameOldSourcePageFb]
            );

            if (platformPageResult.rows.length > 0) {
              channelPlatformPageId = platformPageResult.rows[0].id;
            }
          }

          // Map store name to store_id (filter by tenant through brand)
          let storeId = null;
          if (oldOrder.store && oldOrder.store.trim() !== '') {
            const storeResult = await pgClient.query(
              `SELECT s.id FROM sys_stores s
               INNER JOIN sys_brands b ON s.brand_id = b.id
               WHERE b.tenant_id = $1 AND (s.code = $2 OR LOWER(s.name) = LOWER($2))
               LIMIT 1`,
              [tenantId, oldOrder.store.toLowerCase()]
            );
            if (storeResult.rows.length > 0) {
              storeId = storeResult.rows[0].id;
            }
          }

          // Create order
          let newOrderId;
          try {
            // Parse values safely
            const orderId = parseIntSafe(oldOrder.id);
            const orderTotal = parseFloatSafe(oldOrder.total, 0);
            
            // Validate created_by user ID exists in sys_users
            const createdById = getValidUserId(oldOrder.id_nv_chotdon);
            
            if (!orderId || orderId <= 0) {
              throw new Error(`Invalid order ID: ${oldOrder.id}`);
            }

            // Try to insert with custom ID (old_id = new_id)
            const orderResult = await pgClient.query(
              `INSERT INTO orders (
                id, status, date_created, total, id_customer,
                shipping_address_id, billing_address_id,
                external_order_id, store_id, channel_platform_page_id, tenant_id,
                customer_notes, created_by, updated_by
              ) 
               OVERRIDING SYSTEM VALUE
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
               ON CONFLICT (id) DO UPDATE SET 
                 status = EXCLUDED.status,
                 total = EXCLUDED.total,
                 updated_at = NOW()
               RETURNING id`,
              [
                orderId,  // Use parsed integer
                mapOrderStatus(oldOrder.status),
                parseDate(oldOrder.date_created) || new Date().toISOString(),
                orderTotal,  // Use parsed float
                customer.customer_id,
                defaultAddressId,
                defaultAddressId, // Use same address for billing
                null,
                storeId,
                channelPlatformPageId,
                tenantId,
                oldOrder.note || null,
                createdById,
                createdById  // Use validated user ID (null if not found)
              ]
            );
            newOrderId = orderResult.rows[0].id;
            console.log(`✅ INSERT INTO orders: Order ID ${newOrderId} (Old ID: ${orderId}, Email: ${oldOrder.email})`);
            
            // Update sequence to prevent conflicts
            if (orderId > 0) {
              await pgClient.query(
                `SELECT setval('orders_id_seq', GREATEST($1, (SELECT MAX(id) FROM orders)))`,
                [orderId]
              );
            }
          } catch (error) {
            // If inserting with old_id fails, fall back to auto-increment
            console.error(`1. Failed to migrate order ${oldOrder.id} (${oldOrder.email}): ${error.message}`);
            process.exit(1);
          }

          // Create order metadata
          const orderMetadata = {};
          if (oldOrder.store) orderMetadata.store = oldOrder.store;
          if (oldOrder.tag) orderMetadata.tag = oldOrder.tag;
          if (oldOrder.rank_order) orderMetadata.rank_order = oldOrder.rank_order;
          if (oldOrder.local_store) orderMetadata.local_store = oldOrder.local_store;
          if (oldOrder.live_stream) orderMetadata.live_stream = oldOrder.live_stream;
          if (oldOrder.source_ritamie) orderMetadata.source_ritamie = oldOrder.source_ritamie;
          if (oldOrder.order_diamond) orderMetadata.order_diamond = oldOrder.order_diamond;
          if (oldOrder.claim_order) orderMetadata.claim_order = oldOrder.claim_order;
          if (oldOrder.deposit) orderMetadata.deposit = oldOrder.deposit;
          if (oldOrder.batch_ship) orderMetadata.batch_ship = oldOrder.batch_ship;
          if (oldOrder.ship_carrier_status) orderMetadata.ship_carrier_status = oldOrder.ship_carrier_status;
          if (oldOrder.tracking_number) orderMetadata.tracking_number = oldOrder.tracking_number;
          if (oldOrder.delivered_date) orderMetadata.delivered_date = parseDate(oldOrder.delivered_date);
          if (oldOrder.ship_date) orderMetadata.ship_date = parseDate(oldOrder.ship_date);

          if (Object.keys(orderMetadata).length > 0) {
            await pgClient.query(
              `INSERT INTO orders_meta (order_id, metadata) 
               VALUES ($1, $2)`,
              [newOrderId, JSON.stringify(orderMetadata)]
            );
          }

          // Create CRM metadata
          try { 
            await pgClient.query(
              `INSERT INTO order_meta_crm (
                id, sales_staff_id, referrer_staff_id,
                support_by, social_review, customer_feedback,
                follow_up_status, approval_status
              ) 
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
              [
                newOrderId,
                getValidUserId(oldOrder.id_nv_chotdon),  // Validate and return null if not found
                getValidUserId(oldOrder.id_nv_gioithieu),  // Validate and return null if not found
                getValidUserId(oldOrder.support_by),
                oldOrder.social_review || null,
                oldOrder.customer_feedback || null,
                oldOrder.status_follow_up || null,
                oldOrder.approval_status || null
              ]
            );
          } catch (error) {
            console.error(`2. Failed to migrate order ${oldOrder.id} (${oldOrder.email}): ${error.message}`);
            process.exit(1);
          }

          // Create order images
          if (oldOrder.hinh_order && oldOrder.hinh_order.trim() !== '') {
            const images = oldOrder.hinh_order.split('|').filter(img => img.trim() !== '');
            for (let i = 0; i < images.length; i++) {
              await pgClient.query(
                `INSERT INTO order_images (order_id, image_url, image_type, sort_order) 
                 VALUES ($1, $2, $3, $4)`,
                [newOrderId, images[i].trim(), 'order', i]
              );
            }
          }

          if (oldOrder.img_feedback && oldOrder.img_feedback.trim() !== '') {
            const feedbackImages = oldOrder.img_feedback.split('|').filter(img => img.trim() !== '');
            for (let i = 0; i < feedbackImages.length; i++) {
              await pgClient.query(
                `INSERT INTO order_images (order_id, image_url, image_type, sort_order) 
                 VALUES ($1, $2, $3, $4)`,
                [newOrderId, feedbackImages[i].trim(), 'feedback', 100 + i]
              );
            }
          }

          // Get and migrate order line items
          const oldLineItems = await getOrderLineItems(mysqlConnection, oldOrder.id);
          const itemIdMap = {}; // Map old item id to new item id

          for (const oldItem of oldLineItems) {
            try {
              const productId = await getProductIdBySku(oldItem.sku);
              const itemResult = await pgClient.query(
              `INSERT INTO order_items (
                order_id, product_id, line_item_id, status, quantity, unit_price, created_by
              ) 
               VALUES ($1, $2, $3, $4, $5, $6, $7)
               RETURNING id`,
              [
                newOrderId,
                productId,
                oldItem.id_line_item?.toString() || null,
                oldItem.status_item ? oldItem.status_item : null,
                oldItem.qty || 1,
                oldItem.price || 0,
                defaultUserId
              ]
            );
            const newItemId = itemResult.rows[0].id;
            // Map old item id to new item id (using id_line_item as key if available, otherwise use array index)
            const itemKey = oldItem.id_line_item || oldItem.id;
            itemIdMap[itemKey] = newItemId;
            totalItemsMigrated++;
            } catch (error) {
              console.error(`3. Failed to migrate order item ${oldItem.id_line_item} (${oldOrder.email}): ${error.message}`);
              process.exit(1);
            }
          }

          // Migrate item-level data based on order flags
          // Get all new item IDs for this order
          const allNewItemIds = Object.values(itemIdMap);

          // 1. Migrate after-sales services (if after_services = 1)
          if (oldOrder.after_services && oldOrder.after_services === 1) {
            const afterSalesData = await getAfterSalesServices(mysqlConnection, oldOrder.id);
            if (afterSalesData && allNewItemIds.length > 0) {
              for (const newItemId of allNewItemIds) {
                try {
                  await pgClient.query(
                    `INSERT INTO item_after_sales (
                      order_id, order_item_id, original_order_item_id, case_type, status,
                      rma_code, amount, tracking_number, status_tracking,
                      reason, details, received_date, inquiry_date, created_by, updated_by
                    ) 
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
                    [
                      newOrderId,  // order_id (denormalized for performance)
                      newItemId,
                      null, // original_order_item_id
                      afterSalesData.case_services || null,
                      parseIntSafe(afterSalesData.status_case, null),
                      afterSalesData.code_rma > 0 ? afterSalesData.code_rma.toString() : null,
                      parseFloatSafe(afterSalesData.amount, 0),
                      afterSalesData.tracking_number || null,
                      afterSalesData.status_tracking || null,
                      afterSalesData.reason || null,
                      afterSalesData.details_note || null,
                      parseDate(afterSalesData.date_received),
                      parseDate(afterSalesData.date_inquiry || afterSalesData.date_created_inquiry),
                      getValidUserId(afterSalesData.updated_by),
                      getValidUserId(afterSalesData.updated_by)
                    ]
                  );
                } catch (error) {
                  console.error(`8. Failed to migrate after-sales for item ${newItemId} (${oldOrder.email}): ${error.message}`);
                  // Continue with next item instead of exiting
                }
              }
            }
          }

          // 2. Migrate pre-orders (if pre_order = 1)
          if (oldOrder.pre_order && oldOrder.pre_order === 1) {
            const preOrderData = await getPreOrderStatus(mysqlConnection, oldOrder.id);
            if (preOrderData && allNewItemIds.length > 0) {
              for (const newItemId of allNewItemIds) {
                try {
                  await pgClient.query(
                    `INSERT INTO item_pre_orders (
                      order_id, order_item_id, status, category, vendor,
                      hold_until, processing_date, reason, notes,
                      created_by, updated_by
                    ) 
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
                    [
                      newOrderId,  // order_id (denormalized for performance)
                      newItemId,
                      parseIntSafe(preOrderData.status, null),
                      preOrderData.category || null,
                      preOrderData.vendor || null,
                      parseDate(preOrderData.hold_until),
                      parseDate(preOrderData.processing_date),
                      preOrderData.reason || null,
                      preOrderData.note || null,
                      getValidUserId(preOrderData.update_by),
                      getValidUserId(preOrderData.update_by)
                    ]
                  );
                } catch (error) {
                  console.error(`9. Failed to migrate pre-order for item ${newItemId} (${oldOrder.email}): ${error.message}`);
                  // Continue with next item instead of exiting
                }
              }
            }
          }

          // 3. Migrate customization/diamond (if order_diamond = 1)
          if (oldOrder.order_diamond && oldOrder.order_diamond === 1) {
            const diamondData = await getDiamondStatus(mysqlConnection, oldOrder.id);
            if (diamondData && allNewItemIds.length > 0) {
              for (const newItemId of allNewItemIds) {
                try {
                  await pgClient.query(
                    `INSERT INTO item_customization (
                      order_id, order_item_id, actual_amount, balance_due, payment_status,
                      design_3d_image, design_status, design_time,
                      material_status, material_time,
                      completion_status, completion_time, ship_date,
                      check_status, third_party_brand, created_by, updated_by
                    ) 
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
                    [
                      newOrderId,  // order_id (denormalized for performance)
                      newItemId,
                      parseFloatSafe(diamondData.actual_amount, 0),
                      parseFloatSafe(diamondData.balance_due, 0),
                      parseIntSafe(diamondData.status_payment, null),
                      diamondData.img_3d_design || null,
                      parseIntSafe(diamondData.status_design, null),
                      parseDate(diamondData.time_design),
                      parseIntSafe(diamondData.status_material, null),
                      parseDate(diamondData.time_material),
                      parseIntSafe(diamondData.status_complete, null),
                      parseDate(diamondData.time_complete),
                      parseDate(diamondData.ship_date),
                      diamondData.check_status || null,
                      diamondData.third_party_brand === 1,
                      defaultUserId, // created_by
                      defaultUserId  // updated_by
                    ]
                  );
                } catch (error) {
                  console.error(`10. Failed to migrate customization for item ${newItemId} (${oldOrder.email}): ${error.message}`);
                  // Continue with next item instead of exiting
                }
              }
            }
          }

          // Get and migrate payments
          const payments = await getOrderPayments(mysqlConnection, oldOrder.id);
          
          if (payments.length === 0) {
            // If no payment found, create one from oldOrder data
            try {
              const orderDateCreated = parseDate(oldOrder.date_created) || new Date().toISOString();
              await pgClient.query(
                `INSERT INTO order_payments (
                  order_id, payment_method, amount, status,
                  transaction_id, due_date, paid_date, is_deposit, created_by
                ) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                [
                  newOrderId,
                  oldOrder.payment_method || 'unknown',
                  parseFloatSafe(oldOrder.total, 0),
                  'paid',
                  '',  // Use empty string instead of null
                  orderDateCreated,  // due_date = date_created của order
                  orderDateCreated,  // paid_date = date_created của order
                  false,  // deposit = false
                  getValidUserId(oldOrder.id_nv_chotdon)  // created_by = id_nv_chotdon (validated)
                ]
              );
            } catch (error) {
              console.error(`4. Failed to create payment from oldOrder (${oldOrder.email}): ${error.message}`);
              process.exit(1);
            }
          } else {
            // Migrate existing payments
            for (const payment of payments) {
              try {
                await pgClient.query(
                `INSERT INTO order_payments (
                  order_id, payment_method, amount, status,
                  transaction_id, due_date, paid_date, is_deposit, created_by
                ) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                [
                  newOrderId,
                  payment.payment_method || oldOrder.payment_method || 'unknown',
                  parseFloatSafe(payment.amount, 0),  // Parse safely
                  payment.status === 'paid' ? 'paid' : 'pending',
                  parseIntSafe(payment.id, null) ? parseIntSafe(payment.id).toString() : '',  // Use empty string instead of null
                  parseDate(payment.due_date),
                  parseDate(payment.paid_date),
                  oldOrder.deposit || false,
                  defaultUserId
                ]
              ); 
              } catch (error) {
                console.error(`4. Failed to migrate payment ${payment.id} (${oldOrder.email}): ${error.message}`);
                process.exit(1);
              }
            }
          }

          // Get and migrate refunds
          const refunds = await getOrderRefunds(mysqlConnection, oldOrder.id);
          for (const refund of refunds) {
            try {
              await pgClient.query(
                `INSERT INTO order_payments (
                  order_id, payment_method, amount, status,
                  transaction_id, due_date, paid_date, is_deposit, created_by
                ) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                [
                  newOrderId,
                  refund.payment_method || oldOrder.payment_method || 'unknown',
                  -Math.abs(parseFloatSafe(refund.amount, 0)),  // Luôn lưu số âm cho trường hợp refund
                  'refunded',
                  parseIntSafe(refund.id, null) ? `refund_${refund.id}` : '',  // Use empty string instead of null
                  parseDate(refund.date_created),  // due_date = date_created của refund
                  parseDate(refund.date_created),  // paid_date = date_created của refund
                  false,  // deposit = false
                  getValidUserId(refund.id_staff)  // created_by = id_staff (validated)
                ]
              );
            } catch (error) {
              console.error(`6. Failed to migrate refund ${refund.id} (${oldOrder.email}): ${error.message}`);
              process.exit(1);
            }
          }

          totalOrdersMigrated++;
        } catch (error) {
          console.error(`7. Failed to migrate order ${oldOrder.id} (${oldOrder.email}): ${error.message}`);
          process.exit(1);
        }
      }
    }

    await pgClient.query('COMMIT');
    await mysqlConnection.end();
    await pgClient.end();

    console.error(`✅ Migration completed: ${totalOrdersMigrated} orders, ${totalItemsMigrated} items migrated`);
  } catch (error) {
    if (pgClient) {
      await pgClient.query('ROLLBACK');
      await pgClient.end();
    }
    if (mysqlConnection) {
      await mysqlConnection.end();
    }
    console.error('❌ Error seeding orders data:', error.message);
    console.error('   Stack:', error.stack);
    process.exit(1);
  }
}

console.log('🔄 Starting orders data migration...');
seedOrdersData();
