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
function loadAttributeData() {
  const jsonData = fs.readFileSync('db_iv_attributes_merged.json', 'utf8');
  return JSON.parse(jsonData);
}

// Clean and transform data
function cleanAttribute(item) {
  // Clean name (required, max 300)
  let name = (item.name || '').trim();
  if (!name) return null;
  if (name.length > 300) name = name.substring(0, 300);

  // Clean type (required, max 100)
  let type = (item.type || '').trim();
  if (!type) return null;
  if (type.length > 100) type = type.substring(0, 100);

  // Clean value (optional, max 300)
  let value = (item.value || '').trim() || '';
  if (value.length > 300) value = value.substring(0, 300);

  // Clean description (optional, max 1000)
  // Combine eng_description and vn_description
  let engDesc = (item.eng_description || '').trim();
  let vnDesc = (item.vn_description || '').trim();
  let description = '';
  
  if (engDesc && vnDesc) {
    description = `EN: ${engDesc} | VN: ${vnDesc}`;
  } else if (engDesc) {
    description = engDesc;
  } else if (vnDesc) {
    description = vnDesc;
  }
  
  if (description.length > 1000) description = description.substring(0, 1000);

  return { name, type, value, description };
}

// Migrate attributes
async function migrateAttributes() {
  try {
    console.log('🔌 Connecting to PostgreSQL database...');
    await client.connect();
    console.log('✅ Database connection successful!\n');

    // Load and clean data
    console.log('📂 Loading attribute data from JSON...');
    const attributes = loadAttributeData();
    console.log(`   Loaded ${attributes.length} attributes\n`);

    console.log('🧹 Cleaning data...');
    const cleaned = [];
    const skipped = [];
    
    attributes.forEach((item, index) => {
      const cleanedItem = cleanAttribute(item);
      if (cleanedItem) {
        cleaned.push({ oldId: item.id, ...cleanedItem });
      } else {
        skipped.push({ id: item.id, name: item.name });
      }
    });

    console.log(`   Cleaned: ${cleaned.length} attributes`);
    if (skipped.length > 0) {
      console.log(`   Skipped: ${skipped.length} attributes (missing name or type)`);
    }
    console.log('');

    // Start transaction
    await client.query('BEGIN');

    // Map old_id -> new_id
    const idMapping = new Map();
    const nameMap = new Map(); // Track inserted names to handle duplicates
    
    console.log('📝 Inserting attributes...\n');

    let successCount = 0;
    let errorCount = 0;
    let duplicateCount = 0;
    const errors = [];

    for (const attr of cleaned) {
      try {
        // Check if name already exists (UNIQUE constraint)
        if (nameMap.has(attr.name)) {
          // Use existing ID for duplicate names
          const existingId = nameMap.get(attr.name);
          idMapping.set(attr.oldId, existingId);
          duplicateCount++;
          continue;
        }

        // Insert attribute
        const result = await client.query(
          `INSERT INTO product_attribute (name, type, value, description) 
           VALUES ($1, $2, $3, $4) 
           ON CONFLICT (name) DO UPDATE SET type = EXCLUDED.type
           RETURNING id`,
          [attr.name, attr.type, attr.value || '', attr.description || '']
        );

        const newId = result.rows[0].id;
        idMapping.set(attr.oldId, newId);
        nameMap.set(attr.name, newId);
        successCount++;

        if (successCount % 50 === 0) {
          process.stdout.write(`   Inserted ${successCount}/${cleaned.length}...\r`);
        }
      } catch (error) {
        errorCount++;
        errors.push({
          oldId: attr.oldId,
          name: attr.name,
          error: error.message
        });
        console.error(`\n   ❌ Error inserting attribute ${attr.oldId} (${attr.name}): ${error.message}`);
      }
    }

    console.log(`\n\n✅ Inserted ${successCount} attributes`);
    if (duplicateCount > 0) {
      console.log(`   Duplicate names (mapped to existing): ${duplicateCount}`);
    }
    if (errorCount > 0) {
      console.log(`❌ Failed ${errorCount} attributes`);
      console.log('\nErrors:');
      errors.forEach(err => {
        console.log(`   - ID ${err.oldId}: ${err.name} - ${err.error}`);
      });
    }

    // Commit transaction
    await client.query('COMMIT');
    console.log('\n✅ Transaction committed successfully!\n');

    // Summary
    console.log('📊 Migration Summary:');
    console.log(`   • Total attributes in JSON: ${attributes.length}`);
    console.log(`   • Cleaned: ${cleaned.length}`);
    console.log(`   • Skipped: ${skipped.length}`);
    console.log(`   • Successfully inserted: ${successCount}`);
    console.log(`   • Duplicate names: ${duplicateCount}`);
    console.log(`   • Failed: ${errorCount}`);
    console.log(`   • ID mapping created: ${idMapping.size} entries`);

    // Save ID mapping to file for reference
    const mappingData = Array.from(idMapping.entries()).map(([oldId, newId]) => ({
      old_id: oldId,
      new_id: newId
    }));
    fs.writeFileSync('product_attribute_id_mapping.json', JSON.stringify(mappingData, null, 2));
    console.log('\n💾 ID mapping saved to: product_attribute_id_mapping.json');

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
migrateAttributes();

