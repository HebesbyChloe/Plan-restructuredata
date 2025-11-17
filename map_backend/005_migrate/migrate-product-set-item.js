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

// Get product ID by SKU
async function getProductIdBySku(sku) {
  const result = await pgClient.query(
    'SELECT id FROM product WHERE sku = $1',
    [sku]
  );
  
  if (result.rows.length === 0) {
    return null;
  }
  
  return result.rows[0].id;
}

// Parse sub items string: "SKU1 QTY1 SORT1,SKU2 QTY2 SORT2,..."
function parseSubItems(subItemsStr) {
  const items = [];
  const parts = subItemsStr.split(',');
  
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    
    const fields = trimmed.split(/\s+/);
    if (fields.length < 3) {
      throw new Error(`Invalid sub item format: ${trimmed}. Expected: SKU QUANTITY SORT_ORDER`);
    }
    
    const sku = fields[0];
    const quantity = parseInt(fields[1], 10);
    const sortOrder = parseInt(fields[2], 10);
    
    if (isNaN(quantity) || isNaN(sortOrder)) {
      throw new Error(`Invalid quantity or sort_order in: ${trimmed}`);
    }
    
    items.push({ sku, quantity, sortOrder });
  }
  
  return items;
}

// Insert product set items
async function insertProductSetItems(setSku, subItems) {
  try {
    console.log('🔌 Connecting to PostgreSQL database...');
    await pgClient.connect();
    console.log('✅ PostgreSQL connection successful!\n');

    // Get set product ID
    console.log(`🔍 Looking up set product SKU: ${setSku}`);
    const setProductId = await getProductIdBySku(setSku);
    
    if (!setProductId) {
      throw new Error(`Set product with SKU "${setSku}" not found in database`);
    }
    
    console.log(`   Found set product ID: ${setProductId}\n`);

    // Validate all item SKUs exist
    console.log('🔍 Validating item SKUs...');
    const itemIds = new Map();
    
    for (const item of subItems) {
      const productId = await getProductIdBySku(item.sku);
      if (!productId) {
        throw new Error(`Item product with SKU "${item.sku}" not found in database`);
      }
      itemIds.set(item.sku, productId);
      console.log(`   ✓ ${item.sku} → ID: ${productId}`);
    }
    console.log('');

    // Check for existing items
    console.log('🔍 Checking for existing set items...');
    const existingCheck = await pgClient.query(
      'SELECT item_product_id FROM product_set_item WHERE set_product_id = $1',
      [setProductId]
    );
    
    if (existingCheck.rows.length > 0) {
      console.log(`   ⚠️  Found ${existingCheck.rows.length} existing items for this set product`);
      console.log('   Existing item IDs:', existingCheck.rows.map(r => r.item_product_id).join(', '));
      console.log('');
    }

    // Start transaction
    await pgClient.query('BEGIN');

    // Update product_type for set product (parent)
    console.log('🔄 Updating product_type for set product...');
    await pgClient.query(
      'UPDATE product SET product_type = $1 WHERE id = $2',
      ['set', setProductId]
    );
    console.log(`   ✓ Updated set product (ID: ${setProductId}) → product_type = 'set'`);

    // Update product_type for all item products (children) to 'set'
    console.log('🔄 Updating product_type for item products...');
    for (const item of subItems) {
      const itemProductId = itemIds.get(item.sku);
      await pgClient.query(
        'UPDATE product SET product_type = $1 WHERE id = $2',
        ['set', itemProductId]
      );
      console.log(`   ✓ Updated item ${item.sku} (ID: ${itemProductId}) → product_type = 'set'`);
    }
    console.log('');

    console.log('📝 Inserting product set items...\n');
    
    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    for (const item of subItems) {
      const itemProductId = itemIds.get(item.sku);
      const savepointName = `sp_set_item_${setProductId}_${itemProductId}`;
      
      try {
        // Create savepoint
        await pgClient.query(`SAVEPOINT ${savepointName}`);

        // Check for duplicate (same set_product_id and item_product_id)
        const duplicateCheck = await pgClient.query(
          'SELECT id FROM product_set_item WHERE set_product_id = $1 AND item_product_id = $2',
          [setProductId, itemProductId]
        );

        if (duplicateCheck.rows.length > 0) {
          // Update existing record
          await pgClient.query(
            `UPDATE product_set_item 
             SET quantity = $1, sort_order = $2 
             WHERE set_product_id = $3 AND item_product_id = $4`,
            [item.quantity, item.sortOrder, setProductId, itemProductId]
          );
          console.log(`   ✓ Updated: ${item.sku} (qty: ${item.quantity}, sort: ${item.sortOrder})`);
        } else {
          // Insert new record
          await pgClient.query(
            `INSERT INTO product_set_item (set_product_id, item_product_id, quantity, sort_order)
             VALUES ($1, $2, $3, $4)`,
            [setProductId, itemProductId, item.quantity, item.sortOrder]
          );
          console.log(`   ✓ Inserted: ${item.sku} (qty: ${item.quantity}, sort: ${item.sortOrder})`);
        }

        await pgClient.query(`RELEASE SAVEPOINT ${savepointName}`);
        successCount++;
      } catch (error) {
        try {
          await pgClient.query(`ROLLBACK TO SAVEPOINT ${savepointName}`);
        } catch (rollbackError) {
          // Savepoint might not exist
        }
        
        errorCount++;
        errors.push({
          sku: item.sku,
          error: error.message
        });
        console.error(`   ❌ Error with ${item.sku}: ${error.message}`);
      }
    }

    // Commit transaction
    await pgClient.query('COMMIT');
    console.log('\n✅ Transaction committed successfully!\n');

    // Summary
    console.log('📊 Summary:');
    console.log(`   • Set product SKU: ${setSku} (ID: ${setProductId})`);
    console.log(`   • Total items: ${subItems.length}`);
    console.log(`   • Successfully processed: ${successCount}`);
    console.log(`   • Failed: ${errorCount}`);

    if (errors.length > 0) {
      console.log('\n❌ Errors:');
      errors.forEach(err => {
        console.log(`   - ${err.sku}: ${err.error}`);
      });
    }

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
let setSku = null;
let subItemsStr = null;

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  
  if (arg === '-m' || arg === '--main') {
    if (i + 1 < args.length) {
      setSku = args[i + 1];
      i++;
    } else {
      console.error('❌ Error: -m flag requires a SKU value');
      process.exit(1);
    }
  } else if (arg === '-sub' || arg === '--sub') {
    if (i + 1 < args.length) {
      subItemsStr = args[i + 1];
      i++;
    } else {
      console.error('❌ Error: -sub flag requires a value');
      process.exit(1);
    }
  }
}

// Validate required parameters
if (!setSku) {
  console.error('❌ Error: Set product SKU is required. Use -m SKU');
  console.error('Usage: node migrate-product-set-item.js -m SET_SKU -sub "SKU1 QTY1 SORT1,SKU2 QTY2 SORT2"');
  process.exit(1);
}

if (!subItemsStr) {
  console.error('❌ Error: Sub items are required. Use -sub "SKU1 QTY1 SORT1,SKU2 QTY2 SORT2"');
  console.error('Usage: node migrate-product-set-item.js -m SET_SKU -sub "SKU1 QTY1 SORT1,SKU2 QTY2 SORT2"');
  process.exit(1);
}

// Parse sub items
let subItems;
try {
  subItems = parseSubItems(subItemsStr);
} catch (error) {
  console.error(`❌ Error parsing sub items: ${error.message}`);
  process.exit(1);
}

console.log('🚀 Starting product set item migration...\n');
console.log(`📋 Parameters:`);
console.log(`   Set SKU: ${setSku}`);
console.log(`   Sub items: ${subItems.length} items\n`);

// Run migration
insertProductSetItems(setSku, subItems);

