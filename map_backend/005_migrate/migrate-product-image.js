const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mysql = require('mysql2/promise');
const { Client } = require('pg');

// MySQL connection configuration (old database)
const mysqlConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_DB_USER,
  password: process.env.MYSQL_DB_PASSWORD,
  database: process.env.MYSQL_DB_NAME,
  connectTimeout: 60000,
  acquireTimeout: 60000,
  timeout: 60000,
};

// PostgreSQL connection configuration (new database)
const pgClient = new Client({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  connectTimeout: 60000,
});

// Migrate product images
async function migrateProductImages(limit = null, offset = 0) {
  let mysqlConnection;
  
  try {
    console.log('🔌 Connecting to MySQL database (old DB)...');
    mysqlConnection = await mysql.createConnection(mysqlConfig);
    console.log('✅ MySQL connection successful!\n');

    console.log('🔌 Connecting to PostgreSQL database (new DB)...');
    await pgClient.connect();
    console.log('✅ PostgreSQL connection successful!\n');

    // Get products from new database (id, sku, updated_by_id, updated_at)
    console.log('📂 Loading products from new database...');
    let productsQuery = `
      SELECT id, sku, updated_by_id, updated_at 
      FROM product
    `;
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
    const productMap = new Map(products.map(p => [p.sku, {
      id: p.id,
      updated_by_id: p.updated_by_id,
      updated_at: p.updated_at
    }]));

    // Fetch image data from old database
    console.log('📂 Fetching image data from old database (db_iv_product)...');
    const placeholders = skus.map(() => '?').join(',');
    const [oldProducts] = await mysqlConnection.execute(
      `SELECT sku, name_image, thumb_nail 
       FROM \`db_iv_product\` 
       WHERE sku IN (${placeholders})`,
      skus
    );
    console.log(`   Found ${oldProducts.length} products with image data\n`);

    // Start transaction
    await pgClient.query('BEGIN');

    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;
    let updatedCount = 0;
    const errors = [];

    console.log('📝 Processing product images...\n');

    for (const oldProduct of oldProducts) {
      const productInfo = productMap.get(oldProduct.sku);
      
      if (!productInfo) {
        skippedCount++;
        continue;
      }

      // Skip if no image data
      const nameImage = (oldProduct.name_image || '').trim();
      const thumbNail = (oldProduct.thumb_nail || '').trim();
      
      if (!nameImage && !thumbNail) {
        skippedCount++;
        continue;
      }

      const savepointName = `sp_img_${productInfo.id}`;
      
      try {
        await pgClient.query(`SAVEPOINT ${savepointName}`);

        // Format gallery from name_image
        // name_image might be comma-separated or JSON array
        let gallery = '';
        if (nameImage) {
          // Check if it's JSON array
          if (nameImage.startsWith('[') && nameImage.endsWith(']')) {
            try {
              const parsed = JSON.parse(nameImage);
              if (Array.isArray(parsed)) {
                gallery = JSON.stringify(parsed);
              } else {
                gallery = nameImage.substring(0, 65535); // TEXT field
              }
            } catch {
              // Not valid JSON, treat as string
              gallery = nameImage.substring(0, 65535);
            }
          } else {
            // Comma-separated or single value
            gallery = nameImage.substring(0, 65535);
          }
        }

        // Format thumbnail from thumb_nail
        const thumbnail = thumbNail ? thumbNail.substring(0, 1000) : '';

        // Check if product_image already exists
        const existingCheck = await pgClient.query(
          'SELECT id FROM product_image WHERE product_id = $1',
          [productInfo.id]
        );

        if (existingCheck.rows.length > 0) {
          // Update existing record
          await pgClient.query(
            `UPDATE product_image 
             SET thumbnail = $1, 
                 gallery = $2, 
                 updated_by_id = $3, 
                 updated_at = $4
             WHERE product_id = $5`,
            [
              thumbnail,
              gallery,
              productInfo.updated_by_id,
              productInfo.updated_at,
              productInfo.id
            ]
          );
          updatedCount++;
        } else {
          // Insert new record
          await pgClient.query(
            `INSERT INTO product_image (
              product_id, thumbnail, gallery, updated_by_id, updated_at
            ) VALUES ($1, $2, $3, $4, $5)`,
            [
              productInfo.id,
              thumbnail,
              gallery,
              productInfo.updated_by_id,
              productInfo.updated_at
            ]
          );
          successCount++;
        }

        await pgClient.query(`RELEASE SAVEPOINT ${savepointName}`);

        if ((successCount + updatedCount) % 50 === 0) {
          process.stdout.write(`   Processed ${successCount + updatedCount}/${oldProducts.length} products...\r`);
        }
      } catch (error) {
        try {
          await pgClient.query(`ROLLBACK TO SAVEPOINT ${savepointName}`);
        } catch (rollbackError) {
          // Savepoint might not exist
        }
        
        errorCount++;
        errors.push({
          product_id: productInfo.id,
          sku: oldProduct.sku,
          error: error.message
        });
        console.error(`\n   ❌ Error processing product ${productInfo.id} (${oldProduct.sku}): ${error.message}`);
      }
    }

    console.log(`\n\n✅ Inserted ${successCount} product images`);
    console.log(`🔄 Updated ${updatedCount} existing product images`);
    if (errorCount > 0) {
      console.log(`❌ Failed ${errorCount} products`);
      console.log('\nFirst 10 errors:');
      errors.slice(0, 10).forEach(err => {
        console.log(`   - Product ID ${err.product_id} (SKU: ${err.sku}): ${err.error}`);
      });
    }
    if (skippedCount > 0) {
      console.log(`⚠️  Skipped ${skippedCount} products (no image data or product not found)`);
    }

    // Commit transaction
    await pgClient.query('COMMIT');
    console.log('\n✅ Transaction committed successfully!\n');

    // Summary
    console.log('📊 Migration Summary:');
    console.log(`   • Total products processed: ${oldProducts.length}`);
    console.log(`   • Successfully inserted: ${successCount} product images`);
    console.log(`   • Updated: ${updatedCount} existing product images`);
    console.log(`   • Failed: ${errorCount} products`);
    console.log(`   • Skipped: ${skippedCount} products`);

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

console.log('🚀 Starting product-image migration...\n');
if (limit) {
  console.log(`📋 Parameters: limit=${limit}, offset=${offset}\n`);
} else {
  console.log(`📋 Processing all products\n`);
}

// Run migration
migrateProductImages(limit, offset);

