const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
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

// Load sys_users from new database
async function loadSysUsersFromDB() {
  const result = await pgClient.query(
    'SELECT id, full_name FROM sys_users WHERE full_name IS NOT NULL'
  );
  return result.rows;
}

// Create mapping from full_name (case-insensitive) to user id
function createUserMapping(users) {
  const mapping = new Map();
  
  users.forEach(user => {
    if (user.full_name) {
      // Create lowercase key for case-insensitive matching
      const key = user.full_name.toLowerCase().trim();
      // Store the user id
      mapping.set(key, user.id);
    }
  });
  
  return mapping;
}

// Clean and transform product data
function cleanProduct(item, userMapping) {
  // Required fields
  const sku = (item.sku || '').trim();
  const name = (item.name || '').trim();
  
  // Validate required fields
  if (!sku || !name) {
    return null;
  }

  // Map by_user to created_by_id and updated_by_id
  let createdById = null;
  let updatedById = null;
  
  if (item.by_user) {
    const userKey = item.by_user.toLowerCase().trim();
    if (userMapping.has(userKey)) {
      const userId = userMapping.get(userKey);
      createdById = userId;
      updatedById = userId; // Use same user for both if only by_user is available
    }
  }

  // Map status
  let status = 'draft';
  if (item.status) {
    const statusLower = item.status.toLowerCase().trim();
    if (['publish', 'published'].includes(statusLower)) {
      status = 'publish';
    } else if (['updated'].includes(statusLower)) {
      status = 'updated';
    } else if (['do_not_import'].includes(statusLower)) {
      status = 'do_not_import';
    }
  }

  // Map product_type (default to 'standard')
  let productType = 'standard';
  // You can add logic here to determine product_type based on other fields if needed

  // Transform data
  return {
    sku: sku.substring(0, 100), // VARCHAR(100)
    name: name.substring(0, 500), // VARCHAR(500)
    product_type: productType,
    retail_price: Math.max(0, parseFloat(item.retail_price) || 0),
    sale_price: Math.max(0, parseFloat(item.sale_price) || 0),
    description: (item.eng_description || item.vn_description || '').substring(0, 65535), // TEXT
    is_pre_order: item.pre_order ? Boolean(item.pre_order) : false,
    promotion_id: item.id_promo ? parseInt(item.id_promo, 10) : 0,
    created_at: item.date_created ? new Date(item.date_created) : new Date(),
    updated_at: item.last_update ? new Date(item.last_update) : new Date(),
    created_by_id: createdById,
    updated_by_id: updatedById,
    status: status,
    published_at: status === 'publish' && item.date_created ? new Date(item.date_created) : null,
    old_id: item.id // Keep for reference
  };
}

// Migrate products
async function migrateProducts(limit = 100, offset = 0, skuFilter = null) {
  let mysqlConnection;
  
  try {
    console.log('🔌 Connecting to MySQL database (old DB)...');
    mysqlConnection = await mysql.createConnection(mysqlConfig);
    console.log('✅ MySQL connection successful!\n');

    console.log('🔌 Connecting to PostgreSQL database (new DB)...');
    await pgClient.connect();
    console.log('✅ PostgreSQL connection successful!\n');

    // Load sys_users from new database
    console.log('📂 Loading sys_users from new database...');
    const users = await loadSysUsersFromDB();
    console.log(`   Loaded ${users.length} users\n`);

    // Create user mapping
    console.log('🔍 Creating user mapping (by_user -> user_id)...');
    const userMapping = createUserMapping(users);
    console.log(`   Created mapping for ${userMapping.size} users\n`);

    // Get total count from old database
    let countQuery = 'SELECT COUNT(*) as total FROM `db_iv_product`';
    let countParams = [];
    
    if (skuFilter) {
      countQuery += ' WHERE sku = ?';
      countParams = [skuFilter];
    }
    
    const [countResult] = await mysqlConnection.execute(countQuery, countParams);
    const totalProducts = countResult[0].total;
    console.log(`📊 Total products in old database: ${totalProducts}`);
    
    if (skuFilter) {
      console.log(`🔍 Filtering by SKU: ${skuFilter}\n`);
    } else {
      console.log(`📄 Fetching products: limit=${limit}, offset=${offset}\n`);
    }

    // Fetch products from old database
    console.log('📂 Fetching products from old database...');
    let query = 'SELECT * FROM `db_iv_product`';
    let queryParams = [];
    
    if (skuFilter) {
      query += ' WHERE sku = ? ORDER BY id';
      queryParams = [skuFilter];
    } else {
      query += ' ORDER BY id LIMIT ? OFFSET ?';
      queryParams = [limit, offset];
    }
    
    const [products] = await mysqlConnection.execute(query, queryParams);
    console.log(`   Fetched ${products.length} products\n`);

    // Clean and transform data
    console.log('🧹 Cleaning and transforming data...');
    const cleaned = [];
    const skipped = [];
    
    products.forEach((item) => {
      const cleanedItem = cleanProduct(item, userMapping);
      if (cleanedItem) {
        cleaned.push(cleanedItem);
      } else {
        skipped.push({ 
          old_id: item.id, 
          sku: item.sku, 
          name: item.name,
          reason: 'Missing required fields (sku or name)'
        });
      }
    });

    console.log(`   Cleaned: ${cleaned.length} products`);
    if (skipped.length > 0) {
      console.log(`   Skipped: ${skipped.length} products`);
      console.log('   First 5 skipped items:');
      skipped.slice(0, 5).forEach(item => {
        console.log(`     - ID ${item.old_id}: ${item.sku} - ${item.reason}`);
      });
    }
    console.log('');

    // Check for duplicate SKUs
    const skuMap = new Map();
    const duplicates = [];
    cleaned.forEach(item => {
      if (skuMap.has(item.sku)) {
        duplicates.push({ sku: item.sku, old_id: item.old_id });
      } else {
        skuMap.set(item.sku, item);
      }
    });

    if (duplicates.length > 0) {
      console.log(`⚠️  Warning: Found ${duplicates.length} duplicate SKUs in this batch`);
      console.log('   First 5 duplicates:');
      duplicates.slice(0, 5).forEach(dup => {
        console.log(`     - SKU: ${dup.sku}, Old ID: ${dup.old_id}`);
      });
      console.log('');
    }

    // Start transaction
    await pgClient.query('BEGIN');

    // Map old_id -> new_id
    const idMapping = new Map();
    
    console.log('📝 Inserting products...\n');

    let successCount = 0;
    let errorCount = 0;
    let duplicateSkuCount = 0;
    const errors = [];

    for (const product of cleaned) {
      const savepointName = `sp_prod_${product.old_id}`;
      try {
        // Create savepoint for this record
        await pgClient.query(`SAVEPOINT ${savepointName}`);

        // Check if SKU already exists
        const existingCheck = await pgClient.query(
          'SELECT id FROM product WHERE sku = $1',
          [product.sku]
        );

        if (existingCheck.rows.length > 0) {
          duplicateSkuCount++;
          await pgClient.query(`ROLLBACK TO SAVEPOINT ${savepointName}`);
          console.log(`   ⚠️  SKU ${product.sku} already exists, skipping...`);
          continue;
        }

        // Insert product
        const result = await pgClient.query(
          `INSERT INTO product (
            sku, name, product_type, retail_price, sale_price, description,
            is_pre_order, promotion_id, created_at, updated_at,
            created_by_id, updated_by_id, status, published_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
          ) RETURNING id`,
          [
            product.sku,
            product.name,
            product.product_type,
            product.retail_price,
            product.sale_price,
            product.description,
            product.is_pre_order,
            product.promotion_id,
            product.created_at,
            product.updated_at,
            product.created_by_id,
            product.updated_by_id,
            product.status,
            product.published_at
          ]
        );

        const newId = result.rows[0].id;
        idMapping.set(product.old_id, newId);
        successCount++;

        // Release savepoint on success
        await pgClient.query(`RELEASE SAVEPOINT ${savepointName}`);

        if (successCount % 50 === 0) {
          process.stdout.write(`   Inserted ${successCount}/${cleaned.length}...\r`);
        }
      } catch (error) {
        // Rollback to savepoint to continue with next record
        try {
          await pgClient.query(`ROLLBACK TO SAVEPOINT ${savepointName}`);
        } catch (rollbackError) {
          // Savepoint might not exist if error occurred before creating it
        }
        
        errorCount++;
        errors.push({
          oldId: product.old_id,
          sku: product.sku,
          name: product.name,
          error: error.message
        });
        console.error(`\n   ❌ Error inserting product ${product.old_id} (${product.sku}): ${error.message}`);
      }
    }

    console.log(`\n\n✅ Inserted ${successCount} products`);
    if (errorCount > 0) {
      console.log(`❌ Failed ${errorCount} products`);
      console.log('\nFirst 10 errors:');
      errors.slice(0, 10).forEach(err => {
        console.log(`   - ID ${err.oldId} (SKU: ${err.sku}): ${err.error}`);
      });
    }
    if (duplicateSkuCount > 0) {
      console.log(`⚠️  Skipped ${duplicateSkuCount} products (duplicate SKU)`);
    }

    // Commit transaction
    await pgClient.query('COMMIT');
    console.log('\n✅ Transaction committed successfully!\n');

    // Summary
    console.log('📊 Migration Summary:');
    console.log(`   • Total products in old DB: ${totalProducts}`);
    console.log(`   • Fetched in this batch: ${products.length}`);
    console.log(`   • Successfully inserted: ${successCount}`);
    console.log(`   • Failed: ${errorCount}`);
    console.log(`   • Skipped (missing fields): ${skipped.length}`);
    console.log(`   • Skipped (duplicate SKU): ${duplicateSkuCount}`);
    console.log(`   • ID mapping created: ${idMapping.size} entries`);

    // User mapping statistics
    const userMappingStats = new Map();
    cleaned.forEach(p => {
      const userId = p.created_by_id || 'NULL';
      userMappingStats.set(userId, (userMappingStats.get(userId) || 0) + 1);
    });
    console.log('\n📊 User mapping statistics:');
    console.log(`   • Products with created_by_id = NULL (not found): ${userMappingStats.get('NULL') || 0}`);
    Array.from(userMappingStats.entries())
      .filter(([id]) => id !== 'NULL')
      .slice(0, 10)
      .forEach(([id, count]) => {
        console.log(`   • User ID ${id}: ${count} products`);
      });

    // Save ID mapping to file for reference
    const mappingData = Array.from(idMapping.entries()).map(([oldId, newId]) => ({
      old_id: oldId,
      new_id: newId
    }));
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const mappingFile = `product_id_mapping_${timestamp}.json`;
    fs.writeFileSync(mappingFile, JSON.stringify(mappingData, null, 2));
    console.log(`\n💾 ID mapping saved to: ${mappingFile}`);

    // Save skipped items for review
    if (skipped.length > 0) {
      const skippedFile = `product_skipped_${timestamp}.json`;
      fs.writeFileSync(skippedFile, JSON.stringify(skipped, null, 2));
      console.log(`💾 Skipped items saved to: ${skippedFile}`);
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
let limit = 100;
let offset = 0;
let skuFilter = null;

// Parse arguments - support --sku or -s flag for SKU filtering
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  
  if (arg === '--sku' || arg === '-s') {
    // Next argument is the SKU
    if (i + 1 < args.length) {
      skuFilter = args[i + 1];
      i++; // Skip next argument as we've consumed it
    } else {
      console.error('❌ Error: --sku flag requires a value');
      process.exit(1);
    }
  } else if (!skuFilter) {
    // If no SKU filter is set, treat as limit/offset
    if (i === 0) {
      limit = parseInt(arg);
      if (isNaN(limit)) {
        console.error(`❌ Error: Invalid limit value: ${arg}`);
        process.exit(1);
      }
    } else if (i === 1) {
      offset = parseInt(arg);
      if (isNaN(offset)) {
        console.error(`❌ Error: Invalid offset value: ${arg}`);
        process.exit(1);
      }
    }
  }
}

console.log('🚀 Starting product migration...\n');
if (skuFilter) {
  console.log(`📋 Parameters: SKU=${skuFilter}\n`);
} else {
  console.log(`📋 Parameters: limit=${limit}, offset=${offset}\n`);
}

// Run migration
migrateProducts(limit, offset, skuFilter);

