require('dotenv').config();
const mysql = require('mysql2/promise');
const { Client } = require('pg');
const fs = require('fs');

// MySQL connection (old database)
const mysqlConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_DB_USER,
  password: process.env.MYSQL_DB_PASSWORD,
  database: process.env.MYSQL_DB_NAME,
};

// PostgreSQL connection (new database)
const pgClient = new Client({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

// Load warehouses from new database and create mapping (location -> warehouse_id)
async function loadWarehouseMapping() {
  const result = await pgClient.query(
    'SELECT id, code FROM warehouse'
  );
  const mapping = new Map();
  result.rows.forEach(wh => {
    if (wh.code) {
      // Case-insensitive mapping
      const key = wh.code.toLowerCase().trim();
      mapping.set(key, wh.id);
    }
  });
  return mapping;
}

// Load sys_users from new database and create mapping
async function loadSysUsersMapping() {
  const result = await pgClient.query(
    'SELECT id, full_name FROM sys_users WHERE full_name IS NOT NULL'
  );
  const mapping = new Map();
  result.rows.forEach(user => {
    if (user.full_name) {
      // Case-insensitive mapping
      const key = user.full_name.toLowerCase().trim();
      mapping.set(key, user.id);
    }
  });
  return mapping;
}

// Migrate stock
async function migrateStock(limit = null, offset = 0) {
  let mysqlConnection;
  
  try {
    console.log('🔌 Connecting to MySQL database (old DB)...');
    mysqlConnection = await mysql.createConnection(mysqlConfig);
    console.log('✅ MySQL connection successful!\n');

    console.log('🔌 Connecting to PostgreSQL database (new DB)...');
    await pgClient.connect();
    console.log('✅ PostgreSQL connection successful!\n');

    // Load warehouse mapping
    console.log('📂 Loading warehouses from new database...');
    const warehouseMapping = await loadWarehouseMapping();
    console.log(`   Loaded ${warehouseMapping.size} warehouses\n`);

    // Load sys_users mapping
    console.log('📂 Loading sys_users from new database...');
    const userMapping = await loadSysUsersMapping();
    console.log(`   Loaded ${userMapping.size} users\n`);

    // Get products from new database
    console.log('📂 Loading products from new database...');
    let productsQuery = 'SELECT sku FROM product';
    const productsParams = [];
    
    if (limit) {
      productsQuery += ' ORDER BY id LIMIT $1 OFFSET $2';
      productsParams.push(limit, offset);
    } else {
      productsQuery += ' ORDER BY id';
    }
    
    const productsResult = await pgClient.query(productsQuery, productsParams);
    const products = productsResult.rows;
    console.log(`   Found ${products.length} products to process\n`);

    if (products.length === 0) {
      console.log('⚠️  No products found. Exiting...');
      await mysqlConnection.end();
      await pgClient.end();
      return;
    }

    // Get SKUs
    const skus = products.map(p => p.sku);

    // Fetch stock data from old database
    console.log('📂 Fetching stock data from old database...');
    const placeholders = skus.map(() => '?').join(',');
    const [oldStocks] = await mysqlConnection.execute(
      `SELECT sku_product, location, qty, stock_out, coming_stock, 
              name_product, user, time_group_sku, date_created, last_update
       FROM \`db_iv_stock\` 
       WHERE sku_product IN (${placeholders})`,
      skus
    );
    console.log(`   Found ${oldStocks.length} stock records\n`);

    // Start transaction
    await pgClient.query('BEGIN');

    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;
    let notFoundWarehouseCount = 0;
    const errors = [];
    const stats = {
      warehouses: new Map(),
      users: new Map()
    };

    console.log('📝 Processing stock records...\n');

    for (const oldStock of oldStocks) {
      // Lấy phần sau dấu "-" nếu SKU có chứa dấu "-"
      let productSku = oldStock.sku_product || '';
      if (productSku.includes('-')) {
        const parts = productSku.split('-');
        productSku = parts[parts.length - 1].trim(); // Lấy phần cuối cùng
      }
      
      if (!productSku) {
        skippedCount++;
        continue;
      }

      const savepointName = `sp_stock_${productSku.replace(/[^a-zA-Z0-9]/g, '_')}_${oldStock.location}`;
      
      try {
        await pgClient.query(`SAVEPOINT ${savepointName}`);

        // Map location to warehouse_id
        const locationKey = (oldStock.location || '').toLowerCase().trim();
        const warehouseId = warehouseMapping.get(locationKey);

        if (!warehouseId) {
          notFoundWarehouseCount++;
          skippedCount++;
          await pgClient.query(`ROLLBACK TO SAVEPOINT ${savepointName}`);
          continue;
        }

        // Map user to updated_by_id
        let updatedById = null;
        if (oldStock.user) {
          const userKey = oldStock.user.toLowerCase().trim();
          if (userMapping.has(userKey)) {
            updatedById = userMapping.get(userKey);
            stats.users.set(updatedById, (stats.users.get(updatedById) || 0) + 1);
          }
        }

        // Check if already exists
        const existingCheck = await pgClient.query(
          `SELECT id FROM stock 
           WHERE product_sku = $1 AND warehouse_id = $2`,
          [productSku, warehouseId]
        );

        if (existingCheck.rows.length > 0) {
          skippedCount++;
          await pgClient.query(`ROLLBACK TO SAVEPOINT ${savepointName}`);
          continue;
        }

        // Insert stock
        await pgClient.query(
          `INSERT INTO stock (
            product_sku, warehouse_id, qty, outbound, inbound,
            name_product, updated_by_id, time_group_sku,
            created_at, updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
          )`,
          [
            productSku.substring(0, 100),
            warehouseId,
            Math.max(0, parseInt(oldStock.qty) || 0),
            Math.max(0, parseInt(oldStock.stock_out) || 0),
            Math.max(0, parseInt(oldStock.coming_stock) || 0),
            oldStock.name_product.substring(0, 500),
            updatedById,
            oldStock.time_group_sku ? new Date(oldStock.time_group_sku) : new Date(),
            oldStock.date_created ? new Date(oldStock.date_created) : new Date(),
            oldStock.last_update ? new Date(oldStock.last_update) : new Date()
          ]
        );

        successCount++;
        stats.warehouses.set(warehouseId, (stats.warehouses.get(warehouseId) || 0) + 1);
        await pgClient.query(`RELEASE SAVEPOINT ${savepointName}`);

        if (successCount % 50 === 0) {
          process.stdout.write(`   Processed ${oldStocks.indexOf(oldStock) + 1}/${oldStocks.length} records, inserted ${successCount}...\r`);
        }
      } catch (error) {
        try {
          await pgClient.query(`ROLLBACK TO SAVEPOINT ${savepointName}`);
        } catch (rollbackError) {
          // Savepoint might not exist
        }
        
        errorCount++;
        errors.push({
          sku: oldStock.sku_product,
          location: oldStock.location,
          error: error.message
        });
        console.error(`\n   ❌ Error inserting stock for SKU ${oldStock.sku_product} (location: ${oldStock.location}): ${error.message}`);
      }
    }

    console.log(`\n\n✅ Inserted ${successCount} stock records`);
    if (errorCount > 0) {
      console.log(`❌ Failed ${errorCount} records`);
      console.log('\nFirst 10 errors:');
      errors.slice(0, 10).forEach(err => {
        console.log(`   - SKU: ${err.sku}, Location: ${err.location}: ${err.error}`);
      });
    }
    if (notFoundWarehouseCount > 0) {
      console.log(`⚠️  ${notFoundWarehouseCount} records skipped (warehouse not found)`);
    }
    if (skippedCount > 0) {
      console.log(`⚠️  Skipped ${skippedCount} records (duplicate or warehouse not found)`);
    }

    // Commit transaction
    await pgClient.query('COMMIT');
    console.log('\n✅ Transaction committed successfully!\n');

    // Summary
    console.log('📊 Migration Summary:');
    console.log(`   • Total stock records processed: ${oldStocks.length}`);
    console.log(`   • Successfully inserted: ${successCount}`);
    console.log(`   • Failed: ${errorCount}`);
    console.log(`   • Skipped: ${skippedCount}`);
    console.log(`   • Warehouse not found: ${notFoundWarehouseCount}`);
    
    console.log('\n📊 Warehouse statistics:');
    Array.from(stats.warehouses.entries()).forEach(([warehouseId, count]) => {
      console.log(`   • Warehouse ID ${warehouseId}: ${count} records`);
    });

    if (stats.users.size > 0) {
      console.log('\n📊 User mapping statistics:');
      Array.from(stats.users.entries()).slice(0, 10).forEach(([userId, count]) => {
        console.log(`   • User ID ${userId}: ${count} records`);
      });
    }

    await mysqlConnection.end();
    await pgClient.end();
    console.log('\n✅ Migration completed!');
  } catch (error) {
    await pgClient.query('ROLLBACK');
    console.error('❌ Migration error:', error.message);
    console.error('   Stack:', error.stack);
    if (mysqlConnection) await mysqlConnection.end();
    await pgClient.end();
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const limit = args[0] ? parseInt(args[0]) : null;
const offset = args[1] ? parseInt(args[1]) : 0;

console.log('🚀 Starting stock migration...\n');
if (limit) {
  console.log(`📋 Parameters: limit=${limit}, offset=${offset}\n`);
} else {
  console.log(`📋 Processing all products\n`);
}

// Run migration
migrateStock(limit, offset);

