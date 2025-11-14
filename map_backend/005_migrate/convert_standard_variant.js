const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { Client } = require('pg');

// PostgreSQL connection (new database)
const pgClient = new Client({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

// Convert standard products to variant products
async function convertStandardToVariant(limit = 100, offset = 0) {
  try {
    console.log('🔌 Connecting to PostgreSQL database...');
    await pgClient.connect();
    console.log('✅ PostgreSQL connection successful!\n');

    // 1. Query products có category.name = 'bracelet' và có product_attribute.type = 'size'
    console.log('📂 Finding products with category="bracelet" and size attribute...');
    const query = `
      SELECT DISTINCT
        p.id as product_id,
        p.sku,
        p.name,
        p.product_type,
        p.retail_price,
        p.sale_price,
        p.description,
        p.is_pre_order,
        p.promotion_id,
        p.created_at,
        p.updated_at,
        p.created_by_id,
        p.updated_by_id,
        p.status,
        p.published_at,
        pav.value as size_value,
        pa.name as attribute_name
      FROM product p
      INNER JOIN product_category pc ON p.id = pc.product_id
      INNER JOIN category c ON pc.category_id = c.id
      INNER JOIN product_attribute_value pav ON p.id = pav.product_id
      INNER JOIN product_attribute pa ON pav.attribute_id = pa.id
      WHERE LOWER(c.name) = 'bracelet'
        AND LOWER(pa.type) = 'size'
      ORDER BY p.id
      LIMIT $1 OFFSET $2
    `;

    const result = await pgClient.query(query, [limit, offset]);
    const products = result.rows;
    console.log(`   Found ${products.length} products with size attributes\n`);

    if (products.length === 0) {
      console.log('⚠️  No products to process');
      await pgClient.end();
      return;
    }

    // Group products by product_id và collect size values
    const productMap = new Map();
    products.forEach(row => {
      if (!productMap.has(row.product_id)) {
        productMap.set(row.product_id, {
          product_id: row.product_id,
          sku: row.sku,
          name: row.name,
          product_type: row.product_type,
          retail_price: row.retail_price,
          sale_price: row.sale_price,
          description: row.description,
          is_pre_order: row.is_pre_order,
          promotion_id: row.promotion_id,
          created_at: row.created_at,
          updated_at: row.updated_at,
          created_by_id: row.created_by_id,
          updated_by_id: row.updated_by_id,
          status: row.status,
          published_at: row.published_at,
          size_values: []
        });
      }
      // Tách size values (có thể comma-separated hoặc pipe-separated)
      const sizeValue = row.size_value;
      if (sizeValue) {
        let values = [];
        if (sizeValue.includes('|')) {
          values = sizeValue.split('|').map(v => v.trim()).filter(v => v !== '');
        } else if (sizeValue.includes(',')) {
          values = sizeValue.split(',').map(v => v.trim()).filter(v => v !== '');
        } else {
          values = [sizeValue.trim()];
        }
        values.forEach(v => {
          if (v && !productMap.get(row.product_id).size_values.includes(v)) {
            productMap.get(row.product_id).size_values.push(v);
          }
        });
      }
    });

    console.log(`📋 Processing ${productMap.size} unique products\n`);

    // Load categories và attributes cho từng product
    console.log('📂 Loading categories and attributes for each product...');
    for (const [productId, productData] of productMap.entries()) {
      // Load categories
      const categoryResult = await pgClient.query(
        `SELECT c.id, c.name 
         FROM product_category pc
         INNER JOIN category c ON pc.category_id = c.id
         WHERE pc.product_id = $1`,
        [productId]
      );
      productData.categories = categoryResult.rows;

      // Load attributes
      const attributeResult = await pgClient.query(
        `SELECT pa.id, pa.name, pa.type, pav.value, pav.is_variant_value
         FROM product_attribute_value pav
         INNER JOIN product_attribute pa ON pav.attribute_id = pa.id
         WHERE pav.product_id = $1`,
        [productId]
      );
      productData.attributes = attributeResult.rows;
    }
    console.log('   Loaded categories and attributes\n');

    // Hiển thị data của từng product
    if (productMap.size > 0) {
      console.log('📊 Product data:');
      let index = 0;
      for (const [productId, productData] of productMap.entries()) {
        index++;
        console.log(`\n   Product ${index}:`);
        console.log(`     - ID: ${productData.product_id}`);
        console.log(`     - SKU: ${productData.sku}`);
        console.log(`     - Name: ${productData.name}`);
        console.log(`     - Product Type: ${productData.product_type}`);
        console.log(`     - Retail Price: ${productData.retail_price}`);
        console.log(`     - Sale Price: ${productData.sale_price}`);
        console.log(`     - Description: ${productData.description ? productData.description.substring(0, 100) + '...' : '(empty)'}`);
        console.log(`     - Is Pre Order: ${productData.is_pre_order}`);
        console.log(`     - Promotion ID: ${productData.promotion_id}`);
        console.log(`     - Status: ${productData.status}`);
        console.log(`     - Created At: ${productData.created_at}`);
        console.log(`     - Updated At: ${productData.updated_at}`);
        console.log(`     - Created By ID: ${productData.created_by_id || 'NULL'}`);
        console.log(`     - Updated By ID: ${productData.updated_by_id || 'NULL'}`);
        console.log(`     - Published At: ${productData.published_at || 'NULL'}`);
        
        // Hiển thị categories
        console.log(`     - Categories:`);
        if (productData.categories && productData.categories.length > 0) {
          productData.categories.forEach(cat => {
            console.log(`       • ${cat.name} (id=${cat.id})`);
          });
        } else {
          console.log(`       (none)`);
        }
        
        // Hiển thị attributes
        console.log(`     - Attributes:`);
        if (productData.attributes && productData.attributes.length > 0) {
          productData.attributes.forEach(attr => {
            console.log(`       • ${attr.name} (type=${attr.type}, value=${attr.value}, is_variant=${attr.is_variant_value})`);
          });
        } else {
          console.log(`       (none)`);
        }
        
        console.log(`     - Size Values: [${productData.size_values.join(', ')}]`);
        console.log(`     - Number of variants to create: ${productData.size_values.length}`);
      }
      console.log('');
    }

    // Start transaction
    await pgClient.query('BEGIN');

    let successCount = 0;
    let errorCount = 0;
    let variantCount = 0;
    const errors = [];

    for (const [productId, productData] of productMap.entries()) {
      const savepointName = `sp_variant_${productId}`;

      try {
        await pgClient.query(`SAVEPOINT ${savepointName}`);

        // Update parent product type to 'variant'
        await pgClient.query(
          `UPDATE product 
           SET product_type = 'variant', updated_at = now()
           WHERE id = $1`,
          [productId]
        );

        // Sắp xếp size values để tính sort_order
        // "Made to Measure" luôn ở cuối (sort_order lớn nhất)
        const sortedSizeValues = [...productData.size_values].sort((a, b) => {
          const aLower = a.toLowerCase().trim();
          const bLower = b.toLowerCase().trim();
          
          // "Made to Measure" luôn lớn nhất
          if (aLower.includes('made to measure') || aLower.includes('made-to-measure') || aLower === 'mtm') {
            return 1;
          }
          if (bLower.includes('made to measure') || bLower.includes('made-to-measure') || bLower === 'mtm') {
            return -1;
          }
          
          // Parse số để so sánh
          const aNum = parseFloat(a);
          const bNum = parseFloat(b);
          
          if (!isNaN(aNum) && !isNaN(bNum)) {
            return aNum - bNum;
          }
          
          // Nếu không phải số, so sánh string
          return a.localeCompare(b);
        });

        // Với mỗi size value, tạo variant product
        for (let i = 0; i < sortedSizeValues.length; i++) {
          const sizeValue = sortedSizeValues[i];
          const sortOrder = i + 1; // sort_order bắt đầu từ 1
          
          // Xử lý "Made to Measure" -> SKU = sku-mtm
          let variantSku;
          const sizeValueLower = sizeValue.toLowerCase().trim();
          if (sizeValueLower.includes('made to measure') || sizeValueLower.includes('made-to-measure') || sizeValueLower === 'mtm') {
            variantSku = `${productData.sku}-mtm`.substring(0, 100);
          } else {
            variantSku = `${productData.sku}-${sizeValue}`.substring(0, 100);
          }

          // Check if variant SKU already exists
          const existingCheck = await pgClient.query(
            'SELECT id FROM product WHERE sku = $1',
            [variantSku]
          );

          if (existingCheck.rows.length > 0) {
            // Variant đã tồn tại, skip
            continue;
          }

          // Insert variant product (copy toàn bộ data từ product gốc)
          // Variant products có product_type = 'variant'
          const variantResult = await pgClient.query(
            `INSERT INTO product (
              sku, name, product_type, retail_price, sale_price, description,
              is_pre_order, promotion_id, created_at, updated_at,
              created_by_id, updated_by_id, status, published_at
            ) VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
            ) RETURNING id`,
            [
              variantSku,
              productData.name,
              'variant', // Variant products (sản phẩm con) có product_type = 'variant'
              productData.retail_price,
              productData.sale_price,
              productData.description,
              productData.is_pre_order,
              productData.promotion_id,
              productData.created_at,
              productData.updated_at,
              productData.created_by_id,
              productData.updated_by_id,
              productData.status,
              productData.published_at
            ]
          );

          const variantProductId = variantResult.rows[0].id;

          // Insert vào product_variant với sort_order
          await pgClient.query(
            `INSERT INTO product_variant (
              parent_product_id, variant_product_id, variant_attribute, variant_value, sort_order, created_at
            ) VALUES ($1, $2, $3, $4, $5, now())
            ON CONFLICT (parent_product_id, variant_attribute, variant_value) DO NOTHING`,
            [productId, variantProductId, 'size', sizeValue, sortOrder]
          );

          variantCount++;
        }

        await pgClient.query(`RELEASE SAVEPOINT ${savepointName}`);
        successCount++;

        if (successCount % 10 === 0) {
          process.stdout.write(`   Processed ${successCount}/${productMap.size} products, created ${variantCount} variants...\r`);
        }
      } catch (error) {
        try {
          await pgClient.query(`ROLLBACK TO SAVEPOINT ${savepointName}`);
        } catch (rollbackError) {
          // Savepoint might not exist
        }

        errorCount++;
        errors.push({
          product_id: productId,
          sku: productData.sku,
          error: error.message
        });
        console.error(`\n   ❌ Error processing product ${productId} (${productData.sku}): ${error.message}`);
      }
    }

    console.log(`\n\n✅ Processed ${successCount} products`);
    console.log(`📦 Created ${variantCount} variant products`);
    if (errorCount > 0) {
      console.log(`❌ Failed ${errorCount} products`);
      console.log('\nFirst 10 errors:');
      errors.slice(0, 10).forEach(err => {
        console.log(`   - Product ID ${err.product_id} (SKU: ${err.sku}): ${err.error}`);
      });
    }

    // Commit transaction
    await pgClient.query('COMMIT');
    console.log('\n✅ Transaction committed successfully!\n');

    // Summary
    console.log('📊 Migration Summary:');
    console.log(`   • Products processed: ${successCount}`);
    console.log(`   • Variant products created: ${variantCount}`);
    console.log(`   • Failed: ${errorCount}`);

    await pgClient.end();
    console.log('\n✅ Migration completed!');
  } catch (error) {
    await pgClient.query('ROLLBACK');
    console.error('❌ Migration error:', error.message);
    console.error('   Stack:', error.stack);
    await pgClient.end();
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const limit = args[0] ? parseInt(args[0]) : 100;
const offset = args[1] ? parseInt(args[1]) : 0;

console.log('🚀 Starting product variant conversion...\n');
console.log(`📋 Parameters: limit=${limit}, offset=${offset}\n`);

// Run migration
convertStandardToVariant(limit, offset);

