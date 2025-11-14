const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mysql = require('mysql2/promise');
const { Client } = require('pg');

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

// Mapping từ column name trong db_iv_product sang attribute type trong product_attribute
const COLUMN_TO_ATTRIBUTE_TYPE_MAP = {
  'size': 'size',
  'color': 'color',
  'stone': 'stone',
  'material': 'material',
  'collection': 'collection',
  'grade': 'grade',
  'year': 'year',
  'bead_size': 'bead_size',
  'origin': 'origin',
  'gender': 'gender',
  'element': 'element',
  'intention': 'intention',
  'charm': 'charm',
  'charm_size': 'charm_size',
  'box_dimension': 'box_dimension',
};

// Load product_attribute từ new database (type + name -> id mapping)
async function loadProductAttributes() {
  const result = await pgClient.query(
    'SELECT id, name, type FROM product_attribute'
  );
  const mapping = new Map();
  result.rows.forEach(row => {
    // Key: type|name (lowercase) để match
    const key = `${row.type.toLowerCase().trim()}|${row.name.toLowerCase().trim()}`;
    mapping.set(key, { id: row.id, name: row.name, type: row.type });
  });
  return mapping;
}

// Load products từ new database với LIMIT và OFFSET (sku -> product_id mapping)
async function loadProducts(limit, offset) {
  const result = await pgClient.query(
    'SELECT id, sku FROM product ORDER BY id LIMIT $1 OFFSET $2',
    [limit, offset]
  );
  const mapping = new Map();
  result.rows.forEach(row => {
    mapping.set(row.sku.trim(), row.id);
  });
  return { mapping, count: result.rows.length };
}

// Migrate product attribute values
async function migrateProductAttributeValues(limit = 100, offset = 0) {
  let mysqlConnection;
  
  try {
    console.log('🔌 Connecting to MySQL database (old DB)...');
    mysqlConnection = await mysql.createConnection(mysqlConfig);
    console.log('✅ MySQL connection successful!\n');

    console.log('🔌 Connecting to PostgreSQL database (new DB)...');
    await pgClient.connect();
    console.log('✅ PostgreSQL connection successful!\n');

    // 1. Load product_attribute từ new database
    console.log('📂 Loading product_attribute from new database...');
    const attributeMapping = await loadProductAttributes();
    console.log(`   Loaded ${attributeMapping.size} attribute mappings\n`);

    // 2. Load products từ new database với LIMIT và OFFSET (id, sku)
    console.log(`📂 Loading products (id, sku) from new database (limit=${limit}, offset=${offset})...`);
    const { mapping: productMapping, count: productCount } = await loadProducts(limit, offset);
    console.log(`   Loaded ${productCount} products\n`);

    if (productCount === 0) {
      console.log('⚠️  No products to process in this batch');
      await mysqlConnection.end();
      await pgClient.end();
      return;
    }

    // 3. Lấy list SKU từ products đã load
    const skuList = Array.from(productMapping.keys());
    console.log(`📋 Processing ${skuList.length} SKUs\n`);

    // 4. Fetch products từ old database bằng list SKU
    console.log('📂 Fetching products from old database (db_iv_product)...');
    const placeholders = skuList.map(() => '?').join(',');
    const [products] = await mysqlConnection.execute(
      `SELECT * FROM \`db_iv_product\` 
       WHERE sku IN (${placeholders})`,
      skuList
    );
    console.log(`   Fetched ${products.length} products from old database\n`);

    // Hiển thị data từ db_iv_product
    if (products.length > 0) {
      console.log('📊 Data from db_iv_product:');
      products.forEach((product, index) => {
        console.log(`\n   Product ${index + 1}:`);
        console.log(`     - ID: ${product.id}`);
        console.log(`     - SKU: ${product.sku}`);
        console.log(`     - Name: ${product.name}`);
        console.log(`     - Attributes with values:`);
        
        // Hiển thị các attribute columns có giá trị
        Object.entries(COLUMN_TO_ATTRIBUTE_TYPE_MAP).forEach(([columnName, attributeType]) => {
          const value = product[columnName];
          if (value && (typeof value === 'string' ? value.trim() !== '' : value !== null && value !== undefined)) {
            console.log(`       • ${columnName} (type=${attributeType}): ${value}`);
          }
        });
      });
      console.log('');
    }

    // Start transaction
    await pgClient.query('BEGIN');

    console.log('📝 Processing product attribute values...\n');

    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;
    const errors = [];
    const skippedProducts = [];

    for (const product of products) {
      const sku = (product.sku || '').trim();
      
      // Tìm product_id trong new database
      if (!productMapping.has(sku)) {
        skippedProducts.push({ sku, reason: 'SKU not found in new database' });
        skippedCount++;
        continue;
      }

      const productId = productMapping.get(sku);
      const savepointName = `sp_attr_${product.id}`;

      try {
        await pgClient.query(`SAVEPOINT ${savepointName}`);

        // Xử lý từng attribute column
        for (const [columnName, attributeType] of Object.entries(COLUMN_TO_ATTRIBUTE_TYPE_MAP)) {
          // Lấy giá trị từ column trong old database
          const columnValue = product[columnName];
          
          // Bỏ qua nếu giá trị rỗng
          if (!columnValue || (typeof columnValue === 'string' && columnValue.trim() === '')) {
            continue;
          }

          // Tách giá trị (có thể là comma-separated hoặc pipe-separated)
          // Hỗ trợ cả 2 trường hợp: "Large,Medium" và "Large|Medium"
          const rawValue = String(columnValue).trim();
          let values = [];
          
          if (rawValue.includes('|')) {
            // Tách theo pipe
            values = rawValue.split('|').map(v => v.trim()).filter(v => v !== '');
          } else if (rawValue.includes(',')) {
            // Tách theo comma
            values = rawValue.split(',').map(v => v.trim()).filter(v => v !== '');
          } else {
            // Chỉ có 1 giá trị
            values = [rawValue];
          }
          
          if (values.length === 0) {
            continue;
          }

          // Tìm các attribute_id tương ứng với từng giá trị
          const attributeIdToNames = new Map(); // attribute_id -> [names]
          
          for (const value of values) {
            // Tìm attribute có type và name match
            const key = `${attributeType.toLowerCase()}|${value.toLowerCase()}`;
            if (attributeMapping.has(key)) {
              const attrInfo = attributeMapping.get(key);
              const attrId = attrInfo.id;
              
              // Group theo attribute_id
              if (!attributeIdToNames.has(attrId)) {
                attributeIdToNames.set(attrId, []);
              }
              attributeIdToNames.get(attrId).push(attrInfo.name);
            }
          }

          // Với mỗi attribute_id, join các name lại và insert
          for (const [attributeId, names] of attributeIdToNames.entries()) {
            // Join các name bằng comma
            const value = names.join(',');
            const finalValue = value.substring(0, 500); // VARCHAR(500)

            // Check if already exists (UNIQUE constraint on product_id, attribute_id)
            const existingCheck = await pgClient.query(
              'SELECT id, value FROM product_attribute_value WHERE product_id = $1 AND attribute_id = $2',
              [productId, attributeId]
            );

            if (existingCheck.rows.length > 0) {
              // Update existing value
              await pgClient.query(
                `UPDATE product_attribute_value 
                 SET value = $1, updated_at = now()
                 WHERE product_id = $2 AND attribute_id = $3`,
                [finalValue, productId, attributeId]
              );
            } else {
              // Insert new value
              await pgClient.query(
                `INSERT INTO product_attribute_value (
                  product_id, attribute_id, value, is_variant_value, created_at, updated_at
                ) VALUES ($1, $2, $3, $4, now(), now())`,
                [productId, attributeId, finalValue, false]
              );
            }
          }
        }

        await pgClient.query(`RELEASE SAVEPOINT ${savepointName}`);
        successCount++;

        if (successCount % 50 === 0) {
          process.stdout.write(`   Processed ${successCount}/${products.length} products...\r`);
        }
      } catch (error) {
        try {
          await pgClient.query(`ROLLBACK TO SAVEPOINT ${savepointName}`);
        } catch (rollbackError) {
          // Savepoint might not exist
        }
        
        errorCount++;
        errors.push({
          sku: sku,
          old_id: product.id,
          error: error.message
        });
        console.error(`\n   ❌ Error processing product ${product.id} (${sku}): ${error.message}`);
      }
    }

    console.log(`\n\n✅ Processed ${successCount} products`);
    if (errorCount > 0) {
      console.log(`❌ Failed ${errorCount} products`);
      console.log('\nFirst 10 errors:');
      errors.slice(0, 10).forEach(err => {
        console.log(`   - SKU ${err.sku} (Old ID: ${err.old_id}): ${err.error}`);
      });
    }
    if (skippedCount > 0) {
      console.log(`⚠️  Skipped ${skippedCount} products (SKU not found in new database)`);
      if (skippedProducts.length > 0) {
        console.log('   First 5 skipped products:');
        skippedProducts.slice(0, 5).forEach(item => {
          console.log(`     - SKU: ${item.sku} - ${item.reason}`);
        });
      }
    }

    // Commit transaction
    await pgClient.query('COMMIT');
    console.log('\n✅ Transaction committed successfully!\n');

    // Summary
    console.log('📊 Migration Summary:');
    console.log(`   • Products loaded from new DB: ${productCount}`);
    console.log(`   • Fetched from old DB: ${products.length}`);
    console.log(`   • Successfully processed: ${successCount}`);
    console.log(`   • Failed: ${errorCount}`);
    console.log(`   • Skipped (SKU not found): ${skippedCount}`);

    // Attribute mapping statistics
    console.log('\n📊 Attribute mapping (column → type):');
    Object.entries(COLUMN_TO_ATTRIBUTE_TYPE_MAP).forEach(([column, attrType]) => {
      console.log(`   • ${column} → type='${attrType}'`);
      // Đếm số lượng attributes có type này
      let count = 0;
      for (const [key, attrInfo] of attributeMapping.entries()) {
        if (key.startsWith(`${attrType.toLowerCase()}|`)) {
          count++;
        }
      }
      console.log(`     Found ${count} attribute(s) with type='${attrType}' in product_attribute`);
    });

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
const limit = args[0] ? parseInt(args[0]) : 100;
const offset = args[1] ? parseInt(args[1]) : 0;

console.log('🚀 Starting product attribute value migration...\n');
console.log(`📋 Parameters: limit=${limit}, offset=${offset}\n`);

// Run migration
migrateProductAttributeValues(limit, offset);

