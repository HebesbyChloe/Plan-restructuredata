const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mysql = require('mysql2/promise');
const fs = require('fs');

// MySQL connection configuration (old database)
const connectionConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_DB_USER,
  password: process.env.MYSQL_DB_PASSWORD,
  database: process.env.MYSQL_DB_NAME,
};

// Fetch all material data from old database
async function fetchAllMaterialData(connection) {
  try {
    const query = `
      SELECT 
        id,
        sku_material,
        category,
        thumb_nail,
        name_material,
        price,
        unit,
        metal,
        stone,
        size,
        stock_vn,
        stock_us,
        collection,
        bead,
        cost,
        weight,
        total_bead_vn,
        total_bead_us,
        date_created,
        last_update,
        by_user
      FROM db_material_stock
      ORDER BY sku_material, id
    `;
    
    const [rows] = await connection.execute(query);
    return rows;
  } catch (error) {
    throw error;
  }
}

// Extract base name from material name (remove size suffix after dash)
// Pattern: "Base Name - Size" or "Base Name - Stone"
function extractBaseName(name) {
  if (!name) return name;
  
  // Remove everything after the last " - " (dash with spaces)
  const dashIndex = name.lastIndexOf(' - ');
  if (dashIndex > 0) {
    return name.substring(0, dashIndex).trim();
  }
  
  return name.trim();
}

// Analyze data to identify variant patterns
function analyzeVariants(materials) {
  console.log('\n🔍 Analyzing variant patterns...\n');
  
  const variantPatterns = {
    bySku: new Map(),                    // Group by exact SKU
    byBaseName: new Map(),               // Group by base name (without size suffix)
    byBaseNameAndStone: new Map(),       // Group by base name + stone (for material grouping)
    byCategoryAndCollection: new Map(),  // Group by category + collection (for Charm)
    byStone: new Map(),                  // Group by stone only
    bySize: new Map(),                   // Group by size
    byMetal: new Map(),                  // Group by metal
    bySizeMetal: new Map()               // Group by size + metal combination
  };
  
  materials.forEach(material => {
    const sku = (material.sku_material || '').trim();
    const name = (material.name_material || '').trim();
    const size = (material.size || '').trim();
    const metal = (material.metal || '').trim();
    const stone = (material.stone || '').trim();
    const category = (material.category || '').trim();
    const collection = (material.collection || '').trim();
    
    // Group by exact SKU
    if (!variantPatterns.bySku.has(sku)) {
      variantPatterns.bySku.set(sku, []);
    }
    variantPatterns.bySku.get(sku).push(material);
    
    // Extract base name (remove size suffix after " - ")
    const baseName = extractBaseName(name);
    
    // Group by base name
    if (!variantPatterns.byBaseName.has(baseName)) {
      variantPatterns.byBaseName.set(baseName, []);
    }
    variantPatterns.byBaseName.get(baseName).push(material);
    
    // Group by base name + stone (this is the key for material grouping)
    const baseNameStoneKey = `${baseName}::${stone || 'N/A'}`;
    if (!variantPatterns.byBaseNameAndStone.has(baseNameStoneKey)) {
      variantPatterns.byBaseNameAndStone.set(baseNameStoneKey, []);
    }
    variantPatterns.byBaseNameAndStone.get(baseNameStoneKey).push(material);
    
    // Group by category + collection (for Charm category)
    if (category.toLowerCase() === 'charm' && collection) {
      const categoryCollectionKey = `${category}::${collection}`;
      if (!variantPatterns.byCategoryAndCollection.has(categoryCollectionKey)) {
        variantPatterns.byCategoryAndCollection.set(categoryCollectionKey, []);
      }
      variantPatterns.byCategoryAndCollection.get(categoryCollectionKey).push(material);
    }
    
    // Group by stone
    if (stone) {
      if (!variantPatterns.byStone.has(stone)) {
        variantPatterns.byStone.set(stone, []);
      }
      variantPatterns.byStone.get(stone).push(material);
    }
    
    // Group by size
    if (size) {
      const key = `${category}::${size}`;
      if (!variantPatterns.bySize.has(key)) {
        variantPatterns.bySize.set(key, []);
      }
      variantPatterns.bySize.get(key).push(material);
    }
    
    // Group by metal
    if (metal) {
      const key = `${category}::${metal}`;
      if (!variantPatterns.byMetal.has(key)) {
        variantPatterns.byMetal.set(key, []);
      }
      variantPatterns.byMetal.get(key).push(material);
    }
    
    // Group by size + metal
    if (size || metal) {
      const key = `${category}::${size || 'N/A'}::${metal || 'N/A'}`;
      if (!variantPatterns.bySizeMetal.has(key)) {
        variantPatterns.bySizeMetal.set(key, []);
      }
      variantPatterns.bySizeMetal.get(key).push(material);
    }
  });
  
  return variantPatterns;
}

// Generate analysis report
function generateAnalysisReport(materials, variantPatterns) {
  const report = {
    summary: {
      totalMaterials: materials.length,
      uniqueSkus: variantPatterns.bySku.size,
      uniqueBaseNames: variantPatterns.byBaseName.size,
      uniqueBaseNameStoneGroups: variantPatterns.byBaseNameAndStone.size,
      uniqueCategoryCollectionGroups: variantPatterns.byCategoryAndCollection.size,
      materialsWithSize: 0,
      materialsWithMetal: 0,
      materialsWithStone: 0,
      materialsWithBoth: 0,
      materialsWithoutVariants: 0
    },
    variantGroups: [],
    duplicateSkus: [],
    sampleVariants: []
  };
  
  // Count materials with variants
  materials.forEach(m => {
    const hasSize = !!(m.size && m.size.trim());
    const hasMetal = !!(m.metal && m.metal.trim());
    const hasStone = !!(m.stone && m.stone.trim());
    
    if (hasSize) report.summary.materialsWithSize++;
    if (hasMetal) report.summary.materialsWithMetal++;
    if (hasStone) report.summary.materialsWithStone++;
    if (hasSize && hasMetal) report.summary.materialsWithBoth++;
    if (!hasSize && !hasMetal && !hasStone) report.summary.materialsWithoutVariants++;
  });
  
  // Find duplicate SKUs (same SKU but different size/metal)
  variantPatterns.bySku.forEach((items, sku) => {
    if (items.length > 1) {
      report.duplicateSkus.push({
        sku,
        count: items.length,
        items: items.map(i => ({
          id: i.id,
          name: i.name_material,
          size: i.size,
          metal: i.metal,
          stone: i.stone
        }))
      });
    }
  });
  
  // Find variant groups (same base name + stone with different sizes)
  variantPatterns.byBaseNameAndStone.forEach((items, key) => {
    if (items.length > 1) {
      const [baseName, stone] = key.split('::');
      const variants = items.map(i => ({
        id: i.id,
        sku: i.sku_material,
        name: i.name_material,
        size: i.size,
        metal: i.metal,
        unit: i.unit,
        price: i.price,
        cost: i.cost,
        weight: i.weight,
        stock_vn: i.stock_vn,
        stock_us: i.stock_us
      }));
      
      report.variantGroups.push({
        baseName,
        stone: stone === 'N/A' ? null : stone,
        variantCount: items.length,
        variants
      });
    }
  });
  
  // Find variant groups for Charm category (same category + collection)
  variantPatterns.byCategoryAndCollection.forEach((items, key) => {
    if (items.length > 1) {
      const [category, collection] = key.split('::');
      const variants = items.map(i => ({
        id: i.id,
        sku: i.sku_material,
        name: i.name_material,
        size: i.size,
        metal: i.metal,
        unit: i.unit,
        price: i.price,
        cost: i.cost,
        weight: i.weight,
        stock_vn: i.stock_vn,
        stock_us: i.stock_us
      }));
      
      report.variantGroups.push({
        baseName: collection || category, // Use collection as base name, fallback to category
        stone: null,
        category: category,
        collection: collection,
        variantCount: items.length,
        variants
      });
    }
  });
  
  // Sort variant groups by count (descending)
  report.variantGroups.sort((a, b) => b.variantCount - a.variantCount);
  
  // Sample variants (first 10 groups)
  report.sampleVariants = report.variantGroups.slice(0, 10);
  
  return report;
}

// Main function
async function fetchMaterialData() {
  let connection;
  try {
    console.log('🔌 Connecting to MySQL database (old DB)...');
    connection = await mysql.createConnection(connectionConfig);
    console.log('✅ Database connection successful!\n');
    
    // Fetch all material data
    console.log('📂 Fetching all material data from db_material_stock...');
    const materials = await fetchAllMaterialData(connection);
    console.log(`✅ Fetched ${materials.length} materials\n`);
    
    if (materials.length === 0) {
      console.log('⚠️  No data found in db_material_stock table.');
      await connection.end();
      return;
    }
    
    // Display sample data
    console.log('📦 Sample data (first 3 rows):');
    materials.slice(0, 3).forEach((m, i) => {
      console.log(`\n   Row ${i + 1}:`);
      console.log(`     ID: ${m.id}`);
      console.log(`     SKU: ${m.sku_material}`);
      console.log(`     Name: ${m.name_material}`);
      console.log(`     Category: ${m.category}`);
      console.log(`     Size: ${m.size || 'N/A'}`);
      console.log(`     Metal: ${m.metal || 'N/A'}`);
      console.log(`     Stone: ${m.stone || 'N/A'}`);
      console.log(`     Unit: ${m.unit}`);
      console.log(`     Price: ${m.price}`);
      console.log(`     Stock VN: ${m.stock_vn}, Stock US: ${m.stock_us}`);
    });
    
    // Analyze variants
    const variantPatterns = analyzeVariants(materials);
    
    // Generate report
    const report = generateAnalysisReport(materials, variantPatterns);
    
    // Display analysis summary
    console.log('\n📊 Analysis Summary:');
    console.log('─'.repeat(60));
    console.log(`   Total materials: ${report.summary.totalMaterials}`);
    console.log(`   Unique SKUs: ${report.summary.uniqueSkus}`);
    console.log(`   Unique base names: ${report.summary.uniqueBaseNames}`);
    console.log(`   Unique base name + stone groups: ${report.summary.uniqueBaseNameStoneGroups}`);
    console.log(`   Unique category + collection groups (Charm): ${report.summary.uniqueCategoryCollectionGroups}`);
    console.log(`   Materials with size: ${report.summary.materialsWithSize}`);
    console.log(`   Materials with metal: ${report.summary.materialsWithMetal}`);
    console.log(`   Materials with stone: ${report.summary.materialsWithStone}`);
    console.log(`   Materials with both size & metal: ${report.summary.materialsWithBoth}`);
    console.log(`   Materials without variants: ${report.summary.materialsWithoutVariants}`);
    console.log(`   Duplicate SKUs: ${report.duplicateSkus.length}`);
    console.log(`   Variant groups (same base name + stone): ${report.variantGroups.length}`);
    
    // Show duplicate SKUs
    if (report.duplicateSkus.length > 0) {
      console.log('\n⚠️  Duplicate SKUs found:');
      report.duplicateSkus.slice(0, 5).forEach(dup => {
        console.log(`   - SKU: ${dup.sku} (${dup.count} records)`);
        dup.items.forEach(item => {
          console.log(`     • ID ${item.id}: name=${item.name}, size=${item.size || 'N/A'}, metal=${item.metal || 'N/A'}, stone=${item.stone || 'N/A'}`);
        });
      });
      if (report.duplicateSkus.length > 5) {
        console.log(`   ... and ${report.duplicateSkus.length - 5} more`);
      }
    }
    
    // Show variant groups
    if (report.variantGroups.length > 0) {
      console.log('\n📦 Variant Groups (same base name + stone with different sizes):');
      report.sampleVariants.forEach((group, i) => {
        console.log(`\n   Group ${i + 1}: Base Name = "${group.baseName}"`);
        console.log(`              Stone = "${group.stone || 'N/A'}" (${group.variantCount} variants)`);
        group.variants.forEach(v => {
          console.log(`     - SKU: ${v.sku}, Name: ${v.name}, Size: ${v.size || 'N/A'}, Price: ${v.price}`);
        });
      });
      if (report.variantGroups.length > 10) {
        console.log(`\n   ... and ${report.variantGroups.length - 10} more variant groups`);
      }
    }
    
    // Save raw data
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const rawDataFile = `db_material_stock_${timestamp}.json`;
    fs.writeFileSync(rawDataFile, JSON.stringify(materials, null, 2), 'utf8');
    console.log(`\n💾 Raw data saved to: ${rawDataFile}`);
    console.log(`📁 File size: ${(fs.statSync(rawDataFile).size / 1024).toFixed(2)} KB`);
    
    // Save analysis report
    const reportFile = `material_analysis_${timestamp}.json`;
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2), 'utf8');
    console.log(`💾 Analysis report saved to: ${reportFile}`);
    
    // Save variant patterns
    const patternsFile = `material_variant_patterns_${timestamp}.json`;
    const patternsData = {
      bySku: Array.from(variantPatterns.bySku.entries()).map(([sku, items]) => ({
        sku,
        count: items.length,
        ids: items.map(i => i.id)
      })),
      byBaseName: Array.from(variantPatterns.byBaseName.entries())
        .filter(([_, items]) => items.length > 1)
        .map(([baseName, items]) => ({
          baseName,
          count: items.length,
          variants: items.map(i => ({
            id: i.id,
            sku: i.sku_material,
            name: i.name_material,
            size: i.size,
            metal: i.metal,
            stone: i.stone
          }))
        })),
      byBaseNameAndStone: Array.from(variantPatterns.byBaseNameAndStone.entries())
        .filter(([_, items]) => items.length > 1)
        .map(([key, items]) => {
          const [baseName, stone] = key.split('::');
          return {
            baseName,
            stone: stone === 'N/A' ? null : stone,
            count: items.length,
            variants: items.map(i => ({
              id: i.id,
              sku: i.sku_material,
              name: i.name_material,
              size: i.size,
              metal: i.metal
            }))
          };
        }),
      byCategoryAndCollection: Array.from(variantPatterns.byCategoryAndCollection.entries())
        .filter(([_, items]) => items.length > 1)
        .map(([key, items]) => {
          const [category, collection] = key.split('::');
          return {
            category,
            collection: collection || null,
            count: items.length,
            variants: items.map(i => ({
              id: i.id,
              sku: i.sku_material,
              name: i.name_material,
              size: i.size,
              metal: i.metal
            }))
          };
        }),
      summary: {
        totalGroups: variantPatterns.byBaseNameAndStone.size,
        groupsWithVariants: Array.from(variantPatterns.byBaseNameAndStone.values())
          .filter(items => items.length > 1).length,
        charmGroupsWithVariants: Array.from(variantPatterns.byCategoryAndCollection.values())
          .filter(items => items.length > 1).length
      }
    };
    fs.writeFileSync(patternsFile, JSON.stringify(patternsData, null, 2), 'utf8');
    console.log(`💾 Variant patterns saved to: ${patternsFile}`);
    
    // Close connection
    await connection.end();
    console.log('\n✅ Connection closed successfully.');
    console.log('\n💡 Next steps:');
    console.log('   1. Review the analysis report to understand variant structure');
    console.log('   2. Update migrate-material.js based on variant patterns');
    console.log('   3. Run migration script');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('   Stack:', error.stack);
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

// Run
fetchMaterialData();

