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
function loadCategoryData() {
  const jsonData = fs.readFileSync('db_iv_category_merged.json', 'utf8');
  return JSON.parse(jsonData);
}

// Sort categories: root first (parent = 0), then by parent level
function sortCategories(categories) {
  const categoryMap = new Map();
  categories.forEach(cat => {
    categoryMap.set(cat.id, cat);
  });

  const sorted = [];
  const processed = new Set();

  // First pass: add all root categories (parent = 0)
  categories.forEach(cat => {
    if (cat.parent === 0) {
      sorted.push(cat);
      processed.add(cat.id);
    }
  });

  // Second pass: add children level by level
  let currentLevel = sorted.length;
  while (currentLevel < categories.length) {
    const beforeLength = sorted.length;
    categories.forEach(cat => {
      if (!processed.has(cat.id)) {
        // Check if parent is already processed
        if (cat.parent === 0 || processed.has(cat.parent)) {
          sorted.push(cat);
          processed.add(cat.id);
        }
      }
    });
    if (sorted.length === beforeLength) {
      // No progress, might have circular reference or missing parent
      console.warn('⚠️  Warning: Some categories have missing parents, adding them anyway...');
      categories.forEach(cat => {
        if (!processed.has(cat.id)) {
          sorted.push(cat);
          processed.add(cat.id);
        }
      });
      break;
    }
  }

  return sorted;
}

// Migrate categories
async function migrateCategories() {
  try {
    console.log('🔌 Connecting to PostgreSQL database...');
    await client.connect();
    console.log('✅ Database connection successful!\n');

    // Load and sort data
    console.log('📂 Loading category data from JSON...');
    const categories = loadCategoryData();
    console.log(`   Loaded ${categories.length} categories\n`);

    console.log('🔄 Sorting categories (root first, then children)...');
    const sortedCategories = sortCategories(categories);
    console.log(`   Sorted ${sortedCategories.length} categories\n`);

    // Start transaction
    await client.query('BEGIN');

    // Map old_id -> new_id
    const idMapping = new Map();
    
    // First, check if we need to handle parent_id = 0
    // PostgreSQL FK constraint might not allow 0, so we'll use NULL for root categories
    console.log('📝 Inserting categories...\n');

    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    for (const cat of sortedCategories) {
      try {
        // Map parent_id: if parent = 0, use NULL or 0 depending on FK constraint
        // Check if parent exists in mapping
        let parentId = null;
        if (cat.parent !== 0 && idMapping.has(cat.parent)) {
          parentId = idMapping.get(cat.parent);
        } else if (cat.parent === 0) {
          // Root category - use NULL or 0
          // Try NULL first (safer for FK)
          parentId = null;
        } else if (cat.parent !== 0) {
          // Parent not found in mapping - might be missing
          console.warn(`   ⚠️  Category ${cat.id} (${cat.name}) has parent ${cat.parent} which doesn't exist, setting to NULL`);
          parentId = null;
        }

        // Insert category
        const result = await client.query(
          `INSERT INTO category (name, parent_id) 
           VALUES ($1, $2) 
           RETURNING id`,
          [cat.name, parentId]
        );

        const newId = result.rows[0].id;
        idMapping.set(cat.id, newId);
        successCount++;

        if (successCount % 10 === 0) {
          process.stdout.write(`   Inserted ${successCount}/${sortedCategories.length}...\r`);
        }
      } catch (error) {
        errorCount++;
        errors.push({
          oldId: cat.id,
          name: cat.name,
          error: error.message
        });
        console.error(`\n   ❌ Error inserting category ${cat.id} (${cat.name}): ${error.message}`);
      }
    }

    console.log(`\n\n✅ Inserted ${successCount} categories`);
    if (errorCount > 0) {
      console.log(`❌ Failed ${errorCount} categories`);
      console.log('\nErrors:');
      errors.forEach(err => {
        console.log(`   - ID ${err.oldId}: ${err.name} - ${err.error}`);
      });
    }

    // Now update parent_id for categories that should reference others
    console.log('\n🔄 Updating parent_id references...');
    let updateCount = 0;
    for (const cat of sortedCategories) {
      if (cat.parent !== 0 && idMapping.has(cat.parent) && idMapping.has(cat.id)) {
        const newId = idMapping.get(cat.id);
        const newParentId = idMapping.get(cat.parent);
        
        try {
          await client.query(
            `UPDATE category SET parent_id = $1 WHERE id = $2`,
            [newParentId, newId]
          );
          updateCount++;
        } catch (error) {
          console.error(`   ⚠️  Error updating parent for category ${newId}: ${error.message}`);
        }
      }
    }
    console.log(`   Updated ${updateCount} parent references\n`);

    // Commit transaction
    await client.query('COMMIT');
    console.log('✅ Transaction committed successfully!\n');

    // Summary
    console.log('📊 Migration Summary:');
    console.log(`   • Total categories in JSON: ${categories.length}`);
    console.log(`   • Successfully inserted: ${successCount}`);
    console.log(`   • Failed: ${errorCount}`);
    console.log(`   • Parent references updated: ${updateCount}`);
    console.log(`   • ID mapping created: ${idMapping.size} entries`);

    // Save ID mapping to file for reference
    const mappingData = Array.from(idMapping.entries()).map(([oldId, newId]) => ({
      old_id: oldId,
      new_id: newId
    }));
    fs.writeFileSync('category_id_mapping.json', JSON.stringify(mappingData, null, 2));
    console.log('\n💾 ID mapping saved to: category_id_mapping.json');

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
migrateCategories();

