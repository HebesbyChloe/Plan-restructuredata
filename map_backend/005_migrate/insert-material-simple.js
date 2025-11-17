const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { Client } = require('pg');
const fs = require('fs');

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
  const jsonData = fs.readFileSync('db_material_stock_2025-11-17T09-57-23-905Z.json', 'utf8');
  return JSON.parse(jsonData);
}

// Load material analysis to get variant groups
function loadMaterialAnalysis() {
  const jsonData = fs.readFileSync('material_analysis_2025-11-17T10-08-51-779Z.json', 'utf8');
  return JSON.parse(jsonData);
}

// Get default tenant_id
async function getDefaultTenantId() {
  const result = await client.query(
    `SELECT id FROM sys_tenants WHERE status = 'active' ORDER BY id LIMIT 1`
  );
  if (result.rows.length === 0) {
    throw new Error('No active tenant found in sys_tenants table');
  }
  return result.rows[0].id;
}

// Extract base name from material name (remove size suffix after dash)
function extractBaseName(name) {
  if (!name) return name;
  const dashIndex = name.lastIndexOf(' - ');
  if (dashIndex > 0) {
    return name.substring(0, dashIndex).trim();
  }
  return name.trim();
}

// Build description from material item
function buildDescription(item) {
  const descriptionParts = [];
  if (item.stone) descriptionParts.push(`Stone: ${item.stone}`);
  if (item.collection) descriptionParts.push(`Collection: ${item.collection}`);
  if (item.size) descriptionParts.push(`Size: ${item.size}`);
  if (item.metal && item.metal !== 'Stone') descriptionParts.push(`Metal: ${item.metal}`);
  if (item.bead) descriptionParts.push(`Bead: ${item.bead}`);
  if (item.total_bead_vn) descriptionParts.push(`Total Bead VN: ${item.total_bead_vn}`);
  if (item.total_bead_us) descriptionParts.push(`Total Bead US: ${item.total_bead_us}`);
  if (item.price) descriptionParts.push(`Price: ${item.price}`);
  if (item.cost) descriptionParts.push(`Cost: ${item.cost}`);
  if (item.weight) descriptionParts.push(`Weight: ${item.weight}`);
  if (item.unit) descriptionParts.push(`Unit: ${item.unit}`);
  if (item.stock_vn !== undefined) descriptionParts.push(`Stock VN: ${item.stock_vn}`);
  if (item.stock_us !== undefined) descriptionParts.push(`Stock US: ${item.stock_us}`);
  return descriptionParts.join('\n');
}

// Clean and transform material data
function cleanMaterial(item, isVariantGroup = false, baseName = null) {
  const sku = (item.sku_material || '').trim();
  const name = isVariantGroup ? (baseName || extractBaseName(item.name_material)) : (item.name_material || '').trim();
  const category = (item.category || '').trim();
  
  // Validate required fields
  if (!sku || !name || !category) {
    return null;
  }
  
  const description = buildDescription(item);
  
  return {
    sku: sku.substring(0, 100),
    name: name.substring(0, 500),
    category: category.substring(0, 100),
    thumbnail: (item.thumb_nail || '').substring(0, 500),
    description: description.substring(0, 65535),
    created_at: item.date_created ? new Date(item.date_created) : new Date(),
    updated_at: item.last_update ? new Date(item.last_update) : new Date(),
    old_id: item.id
  };
}

// Insert materials (simple, no variants, no mapping)
async function insertMaterials() {
  try {
    console.log('🔌 Connecting to PostgreSQL database...');
    await client.connect();
    console.log('✅ Database connection successful!\n');

    // Get default tenant_id
    console.log('🔍 Getting default tenant_id...');
    const tenantId = await getDefaultTenantId();
    console.log(`   Using tenant_id: ${tenantId}\n`);

    // Load data
    console.log('📂 Loading material data from JSON...');
    const materials = loadMaterialData();
    console.log(`   Loaded ${materials.length} materials\n`);

    // Load analysis to get variant groups
    console.log('📂 Loading material analysis...');
    const analysis = loadMaterialAnalysis();
    const variantGroups = analysis.variantGroups || [];
    console.log(`   Found ${variantGroups.length} variant groups\n`);

    // Create set of variant IDs (materials that are part of variant groups)
    const variantIds = new Set();
    variantGroups.forEach(group => {
      group.variants.forEach(variant => {
        variantIds.add(variant.id);
      });
    });

    console.log(`   Materials in variant groups: ${variantIds.size}`);
    console.log(`   Materials without variants: ${materials.length - variantIds.size}\n`);

    // Process materials
    console.log('🧹 Processing materials...');
    const cleaned = [];
    const skipped = [];
    const variantGroupMaterials = new Map(); // baseName+stone or category+collection -> first variant data
    
    // First, process variant groups - only insert base material
    variantGroups.forEach(group => {
      if (group.variants && group.variants.length > 0) {
        const firstVariant = group.variants[0];
        // Find original material data
        const originalMaterial = materials.find(m => m.id === firstVariant.id);
        if (originalMaterial) {
          // Create key based on group type
          let key;
          let baseName;
          
          if (group.category && group.collection) {
            // Charm category with collection
            key = `${group.category}::${group.collection}`;
            baseName = group.collection || group.category;
          } else {
            // Base name + stone
            key = `${group.baseName}::${group.stone || 'N/A'}`;
            baseName = group.baseName;
          }
          
          if (!variantGroupMaterials.has(key)) {
            const cleanedItem = cleanMaterial(originalMaterial, true, baseName);
            if (cleanedItem) {
              // Use first variant's SKU
              cleanedItem.sku = originalMaterial.sku_material.substring(0, 100);
              cleanedItem.old_id = firstVariant.id; // Keep first variant's ID for mapping
              variantGroupMaterials.set(key, cleanedItem);
              cleaned.push(cleanedItem);
            }
          }
        }
      }
    });

    // Then, process materials that are NOT in variant groups
    materials.forEach((item, index) => {
      if (!variantIds.has(item.id)) {
        const cleanedItem = cleanMaterial(item, false);
        if (cleanedItem) {
          cleaned.push(cleanedItem);
        } else {
          skipped.push({ 
            old_id: item.id, 
            sku: item.sku_material, 
            name: item.name_material,
            reason: 'Missing required fields (sku, name, or category)'
          });
        }
      }
      
      if ((index + 1) % 100 === 0) {
        process.stdout.write(`   Processed ${index + 1}/${materials.length}...\r`);
      }
    });

    console.log(`\n   Cleaned: ${cleaned.length} materials`);
    console.log(`   - From variant groups: ${variantGroupMaterials.size}`);
    console.log(`   - Without variants: ${cleaned.length - variantGroupMaterials.size}`);
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

        // Check if SKU already exists (tenant_id + sku is unique)
        const existingCheck = await client.query(
          'SELECT id FROM material WHERE tenant_id = $1 AND sku = $2',
          [tenantId, material.sku]
        );

        if (existingCheck.rows.length > 0) {
          duplicateSkuCount++;
          await client.query(`ROLLBACK TO SAVEPOINT ${savepointName}`);
          console.log(`   ⚠️  SKU ${material.sku} already exists, skipping...`);
          continue;
        }

        // Insert material (simple, no variants, no mapping)
        const result = await client.query(
          `INSERT INTO material (
            tenant_id, sku, name, category,
            thumbnail, description, created_at, updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8
          ) RETURNING id`,
          [
            tenantId,
            material.sku,
            material.name,
            material.category,
            material.thumbnail,
            material.description,
            material.created_at,
            material.updated_at
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
    console.log(`   • Variant groups: ${variantGroups.length}`);
    console.log(`   • Materials from variant groups: ${variantGroupMaterials.size}`);
    console.log(`   • Materials without variants: ${cleaned.length - variantGroupMaterials.size}`);
    console.log(`   • Successfully inserted: ${successCount}`);
    console.log(`   • Failed: ${errorCount}`);
    console.log(`   • Skipped (missing fields): ${skipped.length}`);
    console.log(`   • Skipped (duplicate SKU): ${duplicateSkuCount}`);
    console.log(`   • ID mapping created: ${idMapping.size} entries`);

    // Save ID mapping to file for reference
    const mappingData = Array.from(idMapping.entries()).map(([oldId, newId]) => ({
      old_id: oldId,
      new_id: newId
    }));
    fs.writeFileSync('material_id_mapping_simple.json', JSON.stringify(mappingData, null, 2));
    console.log('\n💾 ID mapping saved to: material_id_mapping_simple.json');

    // Save skipped items for review
    if (skipped.length > 0) {
      fs.writeFileSync('material_skipped_simple.json', JSON.stringify(skipped, null, 2));
      console.log('💾 Skipped items saved to: material_skipped_simple.json');
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
insertMaterials();

