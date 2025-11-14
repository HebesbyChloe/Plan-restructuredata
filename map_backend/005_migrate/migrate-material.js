require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// PostgreSQL connection configuration
const client = new Client({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

// Read JSON data
function loadMaterialData() {
  const jsonData = fs.readFileSync('db_material_stock_2025-11-14T06-41-32-630Z.json', 'utf8');
  return JSON.parse(jsonData);
}

function loadSysUsersData() {
  const jsonData = fs.readFileSync('sys_users_2025-11-14T06-54-25-856Z.json', 'utf8');
  return JSON.parse(jsonData);
}

// Create mapping from full_name (case-insensitive) to user id
function createUserMapping(users) {
  const mapping = new Map();
  
  users.forEach(user => {
    if (user.full_name) {
      // Create lowercase key for case-insensitive matching
      const key = user.full_name.toLowerCase().trim();
      // Store the user id (convert string to number if needed)
      const userId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
      mapping.set(key, userId);
    }
  });
  
  return mapping;
}

// Clean and transform material data
function cleanMaterial(item, userMapping) {
  // Required fields
  const sku = (item.sku_material || '').trim();
  const name = (item.name_material || '').trim();
  const category = (item.category || '').trim();
  const unit = (item.unit || '').trim();
  
  // Validate required fields
  if (!sku || !name || !category || !unit) {
    return null;
  }
  
  // Map by_user to updated_by_id
  let updatedById = null; // Default to NULL if not found (FK constraint)
  if (item.by_user) {
    const userKey = item.by_user.toLowerCase().trim();
    if (userMapping.has(userKey)) {
      updatedById = userMapping.get(userKey);
    }
  }
  
  // Transform data
  return {
    sku: sku.substring(0, 100), // VARCHAR(100)
    name: name.substring(0, 500), // VARCHAR(500)
    category: category.substring(0, 100), // VARCHAR(100)
    unit: unit.substring(0, 100), // VARCHAR(100)
    price: parseFloat(item.price) || 0,
    cost: parseFloat(item.cost) || 0,
    weight: item.weight ? parseFloat(item.weight) : null,
    bead: item.bead ? parseFloat(item.bead) : null,
    stock_vn: Math.max(0, parseFloat(item.stock_vn) || 0), // Ensure >= 0
    stock_us: Math.max(0, parseFloat(item.stock_us) || 0), // Ensure >= 0
    total_bead_vn: item.total_bead_vn ? parseInt(item.total_bead_vn, 10) : null,
    total_bead_us: item.total_bead_us ? parseInt(item.total_bead_us, 10) : null,
    metal: item.metal ? item.metal.substring(0, 100) : null,
    stone: item.stone ? item.stone.substring(0, 100) : null,
    size: item.size ? item.size.substring(0, 100) : null,
    collection: item.collection ? item.collection.substring(0, 500) : '',
    thumbnail: item.thumb_nail ? item.thumb_nail.substring(0, 500) : '',
    created_at: item.date_created ? new Date(item.date_created) : new Date(),
    updated_at: item.last_update ? new Date(item.last_update) : new Date(),
    updated_by_id: updatedById,
    old_id: item.id // Keep for reference
  };
}

// Migrate materials
async function migrateMaterials() {
  try {
    console.log('🔌 Connecting to PostgreSQL database...');
    await client.connect();
    console.log('✅ Database connection successful!\n');

    // Load data
    console.log('📂 Loading material data from JSON...');
    const materials = loadMaterialData();
    console.log(`   Loaded ${materials.length} materials\n`);

    console.log('📂 Loading sys_users data from JSON...');
    const users = loadSysUsersData();
    console.log(`   Loaded ${users.length} users\n`);

    // Create user mapping
    console.log('🔍 Creating user mapping (by_user -> user_id)...');
    const userMapping = createUserMapping(users);
    console.log(`   Created mapping for ${userMapping.size} users\n`);

    // Clean and transform data
    console.log('🧹 Cleaning and transforming data...');
    const cleaned = [];
    const skipped = [];
    
    materials.forEach((item, index) => {
      const cleanedItem = cleanMaterial(item, userMapping);
      if (cleanedItem) {
        cleaned.push(cleanedItem);
      } else {
        skipped.push({ 
          old_id: item.id, 
          sku: item.sku_material, 
          name: item.name_material,
          reason: 'Missing required fields (sku, name, category, or unit)'
        });
      }
    });

    console.log(`   Cleaned: ${cleaned.length} materials`);
    if (skipped.length > 0) {
      console.log(`   Skipped: ${skipped.length} materials`);
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
      console.log(`⚠️  Warning: Found ${duplicates.length} duplicate SKUs`);
      console.log('   First 5 duplicates:');
      duplicates.slice(0, 5).forEach(dup => {
        console.log(`     - SKU: ${dup.sku}, Old ID: ${dup.old_id}`);
      });
      console.log('');
    }

    // Start transaction
    await client.query('BEGIN');

    // Map old_id -> new_id
    const idMapping = new Map();
    
    console.log('📝 Inserting materials...\n');

    let successCount = 0;
    let errorCount = 0;
    let duplicateSkuCount = 0;
    const errors = [];

    for (const material of cleaned) {
      const savepointName = `sp_${material.old_id}`;
      try {
        // Create savepoint for this record
        await client.query(`SAVEPOINT ${savepointName}`);

        // Check if SKU already exists
        const existingCheck = await client.query(
          'SELECT id FROM material WHERE sku = $1',
          [material.sku]
        );

        if (existingCheck.rows.length > 0) {
          duplicateSkuCount++;
          await client.query(`ROLLBACK TO SAVEPOINT ${savepointName}`);
          console.log(`   ⚠️  SKU ${material.sku} already exists, skipping...`);
          continue;
        }

        // Insert material
        const result = await client.query(
          `INSERT INTO material (
            sku, name, category, unit, price, cost, weight, bead,
            stock_vn, stock_us, total_bead_vn, total_bead_us,
            metal, stone, size, collection, thumbnail,
            created_at, updated_at, updated_by_id
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
          ) RETURNING id`,
          [
            material.sku,
            material.name,
            material.category,
            material.unit,
            material.price,
            material.cost,
            material.weight,
            material.bead,
            material.stock_vn,
            material.stock_us,
            material.total_bead_vn,
            material.total_bead_us,
            material.metal,
            material.stone,
            material.size,
            material.collection,
            material.thumbnail,
            material.created_at,
            material.updated_at,
            material.updated_by_id
          ]
        );

        const newId = result.rows[0].id;
        idMapping.set(material.old_id, newId);
        successCount++;

        // Release savepoint on success
        await client.query(`RELEASE SAVEPOINT ${savepointName}`);

        if (successCount % 50 === 0) {
          process.stdout.write(`   Inserted ${successCount}/${cleaned.length}...\r`);
        }
      } catch (error) {
        // Rollback to savepoint to continue with next record
        try {
          await client.query(`ROLLBACK TO SAVEPOINT ${savepointName}`);
        } catch (rollbackError) {
          // Savepoint might not exist if error occurred before creating it
        }
        
        errorCount++;
        errors.push({
          oldId: material.old_id,
          sku: material.sku,
          name: material.name,
          error: error.message
        });
        console.error(`\n   ❌ Error inserting material ${material.old_id} (${material.sku}): ${error.message}`);
      }
    }

    console.log(`\n\n✅ Inserted ${successCount} materials`);
    if (errorCount > 0) {
      console.log(`❌ Failed ${errorCount} materials`);
      console.log('\nFirst 10 errors:');
      errors.slice(0, 10).forEach(err => {
        console.log(`   - ID ${err.oldId} (SKU: ${err.sku}): ${err.error}`);
      });
    }
    if (duplicateSkuCount > 0) {
      console.log(`⚠️  Skipped ${duplicateSkuCount} materials (duplicate SKU)`);
    }

    // Commit transaction
    await client.query('COMMIT');
    console.log('\n✅ Transaction committed successfully!\n');

    // Summary
    console.log('📊 Migration Summary:');
    console.log(`   • Total materials in JSON: ${materials.length}`);
    console.log(`   • Successfully inserted: ${successCount}`);
    console.log(`   • Failed: ${errorCount}`);
    console.log(`   • Skipped (missing fields): ${skipped.length}`);
    console.log(`   • Skipped (duplicate SKU): ${duplicateSkuCount}`);
    console.log(`   • ID mapping created: ${idMapping.size} entries`);

    // User mapping statistics
    const userMappingStats = new Map();
    cleaned.forEach(m => {
      const userId = m.updated_by_id || 'NULL';
      userMappingStats.set(userId, (userMappingStats.get(userId) || 0) + 1);
    });
    console.log('\n📊 User mapping statistics:');
    console.log(`   • Materials with updated_by_id = NULL (not found): ${userMappingStats.get('NULL') || 0}`);
    Array.from(userMappingStats.entries())
      .filter(([id]) => id !== 'NULL')
      .slice(0, 10)
      .forEach(([id, count]) => {
        console.log(`   • User ID ${id}: ${count} materials`);
      });

    // Save ID mapping to file for reference
    const mappingData = Array.from(idMapping.entries()).map(([oldId, newId]) => ({
      old_id: oldId,
      new_id: newId
    }));
    fs.writeFileSync('material_id_mapping.json', JSON.stringify(mappingData, null, 2));
    console.log('\n💾 ID mapping saved to: material_id_mapping.json');

    // Save skipped items for review
    if (skipped.length > 0) {
      fs.writeFileSync('material_skipped.json', JSON.stringify(skipped, null, 2));
      console.log('💾 Skipped items saved to: material_skipped.json');
    }

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
migrateMaterials();

