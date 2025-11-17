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

// Load all categories from new database and create mapping
async function loadCategoryMapping() {
  const result = await pgClient.query(
    'SELECT id, name FROM category'
  );
  const mapping = new Map();
  result.rows.forEach(cat => {
    if (cat.name) {
      // Case-insensitive mapping
      const key = cat.name.toLowerCase().trim();
      mapping.set(key, cat.id);
    }
  });
  return mapping;
}

// Migrate product categories
async function migrateProductCategories(limit = null, offset = 0) {
  let mysqlConnection;
  
  try {
    console.log('🔌 Connecting to MySQL database (old DB)...');
    mysqlConnection = await mysql.createConnection(mysqlConfig);
    console.log('✅ MySQL connection successful!\n');

    console.log('🔌 Connecting to PostgreSQL database (new DB)...');
    await pgClient.connect();
    console.log('✅ PostgreSQL connection successful!\n');

    // Load category mapping
    console.log('📂 Loading categories from new database...');
    const categoryMapping = await loadCategoryMapping();
    console.log(`   Loaded ${categoryMapping.size} categories\n`);

    // Get products from new database
    console.log('📂 Loading products from new database...');
    let productsQuery = 'SELECT id, sku FROM product';
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
    const productMap = new Map(products.map(p => [p.sku, p.id]));

    // Fetch category data from old database
    console.log('📂 Fetching category data from old database...');
    const placeholders = skus.map(() => '?').join(',');
    const [oldProducts] = await mysqlConnection.execute(
      `SELECT sku, category FROM \`db_iv_product\` 
       WHERE sku IN (${placeholders})`,
      skus
    );
    console.log(`   Found ${oldProducts.length} products with category data\n`);

    // Start transaction
    await pgClient.query('BEGIN');

    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;
    let notFoundCount = 0;
    const errors = [];
    const stats = {
      totalCategories: 0,
      foundCategories: 0,
      notFoundCategories: 0
    };

    console.log('📝 Processing product categories...\n');

    for (const oldProduct of oldProducts) {
      const productId = productMap.get(oldProduct.sku);
      
      if (!productId) {
        skippedCount++;
        continue;
      }

      if (!oldProduct.category || oldProduct.category.trim() === '') {
        skippedCount++;
        continue;
      }

      // Split category string by pipe separator
      const categoryNames = oldProduct.category
        .split('|')
        .map(name => name.trim())
        .filter(name => name !== '');

      if (categoryNames.length === 0) {
        skippedCount++;
        continue;
      }

      stats.totalCategories += categoryNames.length;

      // Process each category
      for (const categoryName of categoryNames) {
        const savepointName = `sp_cat_${productId}_${categoryName.replace(/[^a-zA-Z0-9]/g, '_')}`;
        
        try {
          await pgClient.query(`SAVEPOINT ${savepointName}`);

          // Find category_id by name (case-insensitive)
          const categoryKey = categoryName.toLowerCase().trim();
          const categoryId = categoryMapping.get(categoryKey);

          if (!categoryId) {
            notFoundCount++;
            stats.notFoundCategories++;
            await pgClient.query(`ROLLBACK TO SAVEPOINT ${savepointName}`);
            continue;
          }

          // Check if already exists
          const existingCheck = await pgClient.query(
            `SELECT id FROM product_category 
             WHERE product_id = $1 AND category_id = $2`,
            [productId, categoryId]
          );

          if (existingCheck.rows.length > 0) {
            await pgClient.query(`ROLLBACK TO SAVEPOINT ${savepointName}`);
            continue;
          }

          // Insert product_category
          await pgClient.query(
            `INSERT INTO product_category (product_id, category_id, created_at)
             VALUES ($1, $2, NOW())
             ON CONFLICT (product_id, category_id) DO NOTHING`,
            [productId, categoryId]
          );

          successCount++;
          stats.foundCategories++;
          await pgClient.query(`RELEASE SAVEPOINT ${savepointName}`);

        } catch (error) {
          try {
            await pgClient.query(`ROLLBACK TO SAVEPOINT ${savepointName}`);
          } catch (rollbackError) {
            // Savepoint might not exist
          }
          
          errorCount++;
          errors.push({
            product_id: productId,
            sku: oldProduct.sku,
            category_name: categoryName,
            error: error.message
          });
          console.error(`\n   ❌ Error inserting category "${categoryName}" for product ${productId} (${oldProduct.sku}): ${error.message}`);
        }
      }

      if ((oldProducts.indexOf(oldProduct) + 1) % 50 === 0) {
        process.stdout.write(`   Processed ${oldProducts.indexOf(oldProduct) + 1}/${oldProducts.length} products, inserted ${successCount} categories...\r`);
      }
    }

    console.log(`\n\n✅ Inserted ${successCount} product-category relationships`);
    if (errorCount > 0) {
      console.log(`❌ Failed ${errorCount} categories`);
      console.log('\nFirst 10 errors:');
      errors.slice(0, 10).forEach(err => {
        console.log(`   - Product ID ${err.product_id} (SKU: ${err.sku}), Category: "${err.category_name}": ${err.error}`);
      });
    }
    if (notFoundCount > 0) {
      console.log(`⚠️  ${notFoundCount} categories not found in category table`);
    }
    if (skippedCount > 0) {
      console.log(`⚠️  Skipped ${skippedCount} products (no category data or product not found)`);
    }

    // Commit transaction
    await pgClient.query('COMMIT');
    console.log('\n✅ Transaction committed successfully!\n');

    // Summary
    console.log('📊 Migration Summary:');
    console.log(`   • Total products processed: ${oldProducts.length}`);
    console.log(`   • Successfully inserted: ${successCount} product-category relationships`);
    console.log(`   • Failed: ${errorCount} categories`);
    console.log(`   • Skipped: ${skippedCount} products`);
    console.log(`   • Categories not found: ${notFoundCount}`);
    console.log('\n📊 Category statistics:');
    console.log(`   • Total category names parsed: ${stats.totalCategories}`);
    console.log(`   • Found and inserted: ${stats.foundCategories}`);
    console.log(`   • Not found in category table: ${stats.notFoundCategories}`);

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

console.log('🚀 Starting product-category migration...\n');
if (limit) {
  console.log(`📋 Parameters: limit=${limit}, offset=${offset}\n`);
} else {
  console.log(`📋 Processing all products\n`);
}

// Run migration
migrateProductCategories(limit, offset);

