require('dotenv').config();
const { Client } = require('pg');

// PostgreSQL connection configuration
const client = new Client({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

// Get default tenant_id (first active tenant)
async function getDefaultTenantId() {
  const result = await client.query(
    `SELECT id FROM sys_tenants WHERE status = 'active' ORDER BY id LIMIT 1`
  );
  if (result.rows.length === 0) {
    throw new Error('No active tenant found in sys_tenants table');
  }
  return result.rows[0].id;
}

// Find product_attribute by type and name (case-insensitive)
// type: 'stone', 'metal', 'size', 'collection' (attribute type in product_attribute)
// name: giá trị từ material (stone, metal, size, collection)
async function findProductAttribute(attributeType, attributeName) {
  if (!attributeName || attributeName.trim() === '') {
    return null;
  }
  
  const result = await client.query(
    `SELECT id FROM product_attribute 
     WHERE LOWER(TRIM(type)) = LOWER(TRIM($1)) 
       AND LOWER(TRIM(name)) = LOWER(TRIM($2))`,
    [attributeType, attributeName]
  );
  
  if (result.rows.length > 0) {
    return result.rows[0].id;
  }
  
  return null;
}

// Migrate material attributes
async function migrateMaterialAttributes() {
  try {
    console.log('🔌 Connecting to PostgreSQL database...');
    await client.connect();
    console.log('✅ Database connection successful!\n');

    // Get default tenant_id
    console.log('🔍 Getting default tenant_id...');
    const tenantId = await getDefaultTenantId();
    console.log(`   Using tenant_id: ${tenantId}\n`);

    // Get all materials with attributes
    console.log('📂 Loading materials from database...');
    const materialsResult = await client.query(
      `SELECT id, sku, name, category, collection, stone, metal, size 
       FROM material 
       WHERE collection IS NOT NULL AND collection != ''
          OR stone IS NOT NULL AND stone != ''
          OR metal IS NOT NULL AND metal != ''
          OR size IS NOT NULL AND size != ''`
    );
    const materials = materialsResult.rows;
    console.log(`   Found ${materials.length} materials with attributes\n`);

    // Start transaction
    await client.query('BEGIN');

    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;
    let notFoundCount = 0;
    const errors = [];
    const stats = {}; // Dynamic stats based on category types

    console.log('📝 Processing material attributes...\n');

    for (const material of materials) {
      const savepointName = `sp_mat_${material.id}`;
      
      try {
        await client.query(`SAVEPOINT ${savepointName}`);

        // Logic: Mỗi material chỉ có 1 dòng trong material_attribute
        // Dựa vào category để quyết định lấy giá trị từ cột nào:
        // - category = 'stone' → lấy từ cột stone
        // - category = 'charm' → lấy từ cột size (hoặc charm nếu có)
        // - category = 'metal' → lấy từ cột metal
        // - category = 'collection' → lấy từ cột collection
        
        const categoryType = material.category.trim().toLowerCase();
        let attributeName = null;
        let attributeType = null; // type để tìm trong product_attribute
        
        // Xác định attribute name và type dựa vào category
        if (categoryType === 'stone' && material.stone && material.stone.trim() !== '') {
          attributeName = material.stone.trim();
          attributeType = 'stone';
        } else if (categoryType === 'charm' && material.size && material.size.trim() !== '') {
          attributeName = material.size.trim();
          attributeType = 'charm'; // hoặc 'size' tùy vào product_attribute
        } else if (categoryType === 'metal' && material.metal && material.metal.trim() !== '') {
          attributeName = material.metal.trim();
          attributeType = 'metal';
        } else if (categoryType === 'collection' && material.collection && material.collection.trim() !== '') {
          attributeName = material.collection.trim();
          attributeType = 'collection';
        }

        // Nếu không tìm thấy attribute name, skip material này
        if (!attributeName) {
          skippedCount++;
          await client.query(`RELEASE SAVEPOINT ${savepointName}`);
          continue;
        }

        // Tìm product_attribute có type=attributeType và name=attributeName
        const attributeId = await findProductAttribute(attributeType, attributeName);
        
        // Check if already exists
        const existingCheck = await client.query(
          `SELECT id FROM material_attribute 
           WHERE material_id = $1 AND type = $2 AND name = $3`,
          [material.id, material.category.trim(), attributeName]
        );

        if (existingCheck.rows.length === 0) {
          await client.query(
            `INSERT INTO material_attribute (
              material_id, tenant_id, attribute_id, name, type, value
            ) VALUES ($1, $2, $3, $4, $5, NULL)`,
            [
              material.id,
              tenantId,
              attributeId, // NULL nếu không tìm thấy
              attributeName.substring(0, 200), // name từ cột tương ứng
              material.category.trim().substring(0, 100), // type từ material.category
              // value = NULL
            ]
          );
          successCount++;
          if (attributeId) {
            stats[attributeType] = stats[attributeType] || { found: 0, notFound: 0 };
            stats[attributeType].found++;
          } else {
            stats[attributeType] = stats[attributeType] || { found: 0, notFound: 0 };
            stats[attributeType].notFound++;
            notFoundCount++;
          }
        } else {
          skippedCount++;
        }

        await client.query(`RELEASE SAVEPOINT ${savepointName}`);

        if ((materials.indexOf(material) + 1) % 50 === 0) {
          process.stdout.write(`   Processed ${materials.indexOf(material) + 1}/${materials.length} materials, inserted ${successCount} attributes...\r`);
        }
      } catch (error) {
        try {
          await client.query(`ROLLBACK TO SAVEPOINT ${savepointName}`);
        } catch (rollbackError) {
          // Savepoint might not exist
        }
        
        errorCount++;
        errors.push({
          material_id: material.id,
          sku: material.sku,
          name: material.name,
          category: material.category,
          error: error.message
        });
        console.error(`\n   ❌ Error processing material ${material.id} (${material.sku}): ${error.message}`);
      }
    }

    console.log(`\n\n✅ Inserted ${successCount} material attributes`);
    if (errorCount > 0) {
      console.log(`❌ Failed ${errorCount} materials`);
      console.log('\nFirst 10 errors:');
      errors.slice(0, 10).forEach(err => {
        console.log(`   - Material ID ${err.material_id} (SKU: ${err.sku}, Category: ${err.category}): ${err.error}`);
      });
    }
    if (skippedCount > 0) {
      console.log(`⚠️  Skipped ${skippedCount} attributes (already exist)`);
    }
    if (notFoundCount > 0) {
      console.log(`⚠️  ${notFoundCount} attributes not found in product_attribute (inserted with attribute_id = NULL)`);
    }

    // Commit transaction
    await client.query('COMMIT');
    console.log('\n✅ Transaction committed successfully!\n');

    // Summary
    console.log('📊 Migration Summary:');
    console.log(`   • Total materials processed: ${materials.length}`);
    console.log(`   • Successfully inserted: ${successCount} attributes`);
    console.log(`   • Failed: ${errorCount} materials`);
    console.log(`   • Skipped (duplicates): ${skippedCount} attributes`);
    console.log(`   • Not found in product_attribute: ${notFoundCount} attributes`);
    console.log('\n📊 Attribute type statistics:');
    Object.keys(stats).sort().forEach(categoryType => {
      const stat = stats[categoryType];
      console.log(`   • ${categoryType}: ${stat.found} found, ${stat.notFound} not found`);
    });

    await client.end();
    console.log('\n✅ Migration completed!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration error:', error.message);
    console.error('   Stack:', error.stack);
    await client.end();
    process.exit(1);
  }
}

// Run migration
migrateMaterialAttributes();

