const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mysql = require('mysql2/promise');
const { Client } = require('pg');
const fs = require('fs');

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
    bySku: new Map(),
    byBaseName: new Map(),
    byBaseNameAndStone: new Map(),       // Group by base name + stone (for material grouping)
    byCategoryAndCollection: new Map(),  // Group by category + collection (for Charm)
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
  });
  
  return variantPatterns;
}

// Get default tenant_id (first active tenant)
async function getDefaultTenantId() {
  const result = await pgClient.query(
    `SELECT id FROM sys_tenants WHERE status = 'active' ORDER BY id LIMIT 1`
  );
  if (result.rows.length === 0) {
    throw new Error('No active tenant found in sys_tenants table');
  }
  return result.rows[0].id;
}

// Load sys_users from database and create mapping
async function loadSysUsersMapping() {
  const result = await pgClient.query(
    'SELECT id, full_name FROM sys_users WHERE full_name IS NOT NULL'
  );
  const mapping = new Map();
  result.rows.forEach(user => {
    if (user.full_name) {
      const key = user.full_name.toLowerCase().trim();
      mapping.set(key, user.id);
    }
  });
  return mapping;
}

// Load warehouses from new database and create mapping (code -> warehouse_id)
async function loadWarehouseMapping() {
  const result = await pgClient.query(
    'SELECT id, code FROM warehouse'
  );
  const mapping = new Map();
  result.rows.forEach(wh => {
    if (wh.code) {
      const key = wh.code.toLowerCase().trim();
      mapping.set(key, wh.id);
    }
  });
  return mapping;
}

// Find product_attribute by type and name (case-insensitive)
async function findProductAttribute(attributeType, attributeName) {
  if (!attributeName || attributeName.trim() === '') {
    return null;
  }
  
  const result = await pgClient.query(
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
  
// Generate SKU for parent material - giữ nguyên format '22xxxx' hoặc '11xxxx'
function generateParentSku(materialGroup, isSingleMaterial = false) {
  // For single material, use its original SKU
  if (isSingleMaterial && materialGroup.materials.length === 1) {
    return materialGroup.materials[0].sku_material.substring(0, 100);
  }
  
  // For variant groups, use SKU của material đầu tiên (giữ nguyên format '22xxxx' hoặc '11xxxx')
  if (materialGroup.materials.length > 0) {
    const firstMaterial = materialGroup.materials[0];
    if (firstMaterial && firstMaterial.sku_material) {
      const sku = firstMaterial.sku_material.trim();
      // Giữ nguyên SKU gốc nếu là format '22xxxx' hoặc '11xxxx'
      if (/^(22|11)\d+$/.test(sku)) {
        return sku.substring(0, 100);
      }
      // Nếu không phải format trên, vẫn dùng SKU gốc
      return sku.substring(0, 100);
    }
  }
  
  // Fallback: For Charm category with collection
  if (materialGroup.category === 'Charm' && materialGroup.collection) {
    const firstMaterial = materialGroup.materials[0];
    if (firstMaterial && firstMaterial.sku_material) {
      return firstMaterial.sku_material.substring(0, 100);
    }
  }
  
  // Fallback: use base name + stone
  const baseName = materialGroup.baseName.replace(/\s+/g, '').substring(0, 50);
  const stone = materialGroup.stone ? materialGroup.stone.replace(/\s+/g, '').substring(0, 30) : '';
  const sku = stone ? `${baseName}_${stone}` : baseName;
  return sku.substring(0, 100);
}

// Generate name for parent material
function generateParentName(materialGroup, isSingleMaterial = false) {
  // For single material, use its original name
  if (isSingleMaterial && materialGroup.materials.length === 1) {
    return materialGroup.materials[0].name_material.substring(0, 500);
  }
  
  if (materialGroup.category === 'Charm' && materialGroup.collection) {
    return materialGroup.collection.substring(0, 500);
  }
  
  const baseName = materialGroup.baseName;
  const stone = materialGroup.stone;
  
  if (stone && stone !== 'N/A') {
    return `${baseName} - ${stone}`.substring(0, 500);
  }
  
  return baseName.substring(0, 500);
}

// Get thumbnail from first material
function getThumbnail(materialGroup) {
  if (materialGroup.materials.length === 0) return '';
  
  const firstMaterial = materialGroup.materials[0];
  if (firstMaterial && firstMaterial.thumb_nail) {
    return firstMaterial.thumb_nail.substring(0, 500);
  }
  return '';
}

// Get created_at and updated_at from materials
function getTimestamps(materialGroup) {
  let earliestCreated = null;
  let latestUpdated = null;
  
  materialGroup.materials.forEach(material => {
    if (material.date_created) {
      const created = new Date(material.date_created);
      if (!earliestCreated || created < earliestCreated) {
        earliestCreated = created;
      }
    }
    if (material.last_update) {
      const updated = new Date(material.last_update);
      if (!latestUpdated || updated > latestUpdated) {
        latestUpdated = updated;
      }
    }
  });
  
  return {
    created_at: earliestCreated || new Date(),
    updated_at: latestUpdated || new Date()
  };
}

// Get created_by_id from materials (use most common user)
function getCreatedById(materialGroup, userMapping) {
  const userCounts = new Map();
  
  materialGroup.materials.forEach(material => {
    if (material.by_user) {
      const userKey = material.by_user.toLowerCase().trim();
      if (userMapping.has(userKey)) {
        const userId = userMapping.get(userKey);
        userCounts.set(userId, (userCounts.get(userId) || 0) + 1);
      }
    }
  });
  
  // Return most common user, or first found user
  if (userCounts.size > 0) {
    let maxCount = 0;
    let mostCommonUserId = null;
    userCounts.forEach((count, userId) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommonUserId = userId;
      }
    });
    return mostCommonUserId;
  }
  
  return null;
}

// Get unit, dimension, price, cost, weight, conversion_factor from material (for single materials)
function getMaterialDefaults(materialGroup, isSingleMaterial = false) {
  // For single material, use its values
  if (isSingleMaterial && materialGroup.materials.length === 1) {
    const material = materialGroup.materials[0];
    const size = (material.size || '').trim();
    return {
      unit: (material.unit || '').substring(0, 100),
      dimension: size ? size.substring(0, 100) : null,
      price: parseFloat(material.price) || 0,
      cost: parseFloat(material.cost) || 0,
      weight: material.weight ? parseFloat(material.weight) : null,
      conversion_factor: null // TODO: calculate if needed
    };
  }
  
  // For variant groups, use default values (variants will have their own values)
  return {
    unit: '',
    dimension: null,
    price: 0,
    cost: 0,
    weight: null,
    conversion_factor: null
  };
}

// Create all material groups (both variant groups and single materials)
function createAllMaterialGroups(variantPatterns) {
  const materialGroups = [];
  const processedMaterialIds = new Set();
  
  // Group by base name + stone (variant groups and single materials)
  variantPatterns.byBaseNameAndStone.forEach((materials, key) => {
    const [baseName, stone] = key.split('::');
    const firstMaterial = materials[0];
    
    // Mark all materials in this group as processed
    materials.forEach(m => processedMaterialIds.add(m.id));
    
    materialGroups.push({
      baseName,
      stone: stone === 'N/A' ? null : stone,
      category: firstMaterial.category || 'Unknown',
      collection: null,
      materials,
      isVariantGroup: materials.length > 1
    });
  });
  
  // Group by category + collection (for Charm - variant groups and single materials)
  variantPatterns.byCategoryAndCollection.forEach((materials, key) => {
    const [category, collection] = key.split('::');
    const firstMaterial = materials[0];
    
    // Only process if not already processed by byBaseNameAndStone
    const unprocessedMaterials = materials.filter(m => !processedMaterialIds.has(m.id));
    
    if (unprocessedMaterials.length > 0) {
      // Mark as processed
      unprocessedMaterials.forEach(m => processedMaterialIds.add(m.id));
      
      materialGroups.push({
        baseName: collection || category,
        stone: null,
        category: category,
        collection: collection,
        materials: unprocessedMaterials,
        isVariantGroup: unprocessedMaterials.length > 1
        });
      }
    });

  // Handle remaining materials that don't belong to any group
  // These are materials that don't have baseName+stone or category+collection grouping
  const allGroupedMaterialIds = new Set();
  variantPatterns.byBaseNameAndStone.forEach((materials) => {
    materials.forEach(m => allGroupedMaterialIds.add(m.id));
  });
  variantPatterns.byCategoryAndCollection.forEach((materials) => {
    materials.forEach(m => allGroupedMaterialIds.add(m.id));
  });
  
  // Find materials that are not in any group
  const allMaterialIds = new Set();
  variantPatterns.bySku.forEach((materials) => {
    materials.forEach(m => allMaterialIds.add(m.id));
  });
  
  const ungroupedMaterialIds = Array.from(allMaterialIds).filter(id => !allGroupedMaterialIds.has(id));
  
  // Create groups for ungrouped materials (each as a single material group)
  if (ungroupedMaterialIds.length > 0) {
    // Get the actual material objects from bySku
    const ungroupedMaterials = [];
    variantPatterns.bySku.forEach((materials) => {
      materials.forEach(m => {
        if (ungroupedMaterialIds.includes(m.id)) {
          ungroupedMaterials.push(m);
        }
      });
    });
    
    // Group ungrouped materials by their base name + stone (even if single)
    const ungroupedGroups = new Map();
    ungroupedMaterials.forEach(material => {
      const name = (material.name_material || '').trim();
      const baseName = extractBaseName(name);
      const stone = (material.stone || '').trim();
      const category = (material.category || '').trim();
      
      const key = `${baseName}::${stone || 'N/A'}`;
      if (!ungroupedGroups.has(key)) {
        ungroupedGroups.set(key, []);
      }
      ungroupedGroups.get(key).push(material);
    });
    
    ungroupedGroups.forEach((materials, key) => {
      const [baseName, stone] = key.split('::');
      const firstMaterial = materials[0];
      
      materialGroups.push({
        baseName,
        stone: stone === 'N/A' ? null : stone,
        category: firstMaterial.category || 'Unknown',
        collection: null,
        materials,
        isVariantGroup: false // These are single materials
      });
    });
  }
  
  return materialGroups;
}

// Insert material_stock for single material - luôn tạo 2 line cho VN và US
async function insertMaterialStock(materialId, material, warehouseMapping) {
  let stockCount = 0;
  
  // Luôn insert cho warehouse VN
  const vnWarehouseId = warehouseMapping.get('vn');
  if (vnWarehouseId) {
    try {
      const existingCheck = await pgClient.query(
        'SELECT id FROM material_stock WHERE material_id = $1 AND warehouse_id = $2',
        [materialId, vnWarehouseId]
      );
      
      if (existingCheck.rows.length === 0) {
        const quantity = parseFloat(material.stock_vn) || 0;
        await pgClient.query(
          `INSERT INTO material_stock (
            material_id, material_variant_id, warehouse_id,
            quantity, total_converted_quantity,
            inbound, outbound
          ) VALUES (
            $1, NULL, $2, $3, $4, 0, 0
          )`,
          [
            materialId,
            vnWarehouseId,
            quantity,
            quantity
          ]
        );
        stockCount++;
      }
    } catch (error) {
      console.error(`     ❌ Error inserting stock VN for material ${materialId}: ${error.message}`);
    }
  }
  
  // Luôn insert cho warehouse US
  const usWarehouseId = warehouseMapping.get('us');
  if (usWarehouseId) {
    try {
      const existingCheck = await pgClient.query(
        'SELECT id FROM material_stock WHERE material_id = $1 AND warehouse_id = $2',
        [materialId, usWarehouseId]
      );
      
      if (existingCheck.rows.length === 0) {
        const quantity = parseFloat(material.stock_us) || 0;
        await pgClient.query(
          `INSERT INTO material_stock (
            material_id, material_variant_id, warehouse_id,
            quantity, total_converted_quantity,
            inbound, outbound
          ) VALUES (
            $1, NULL, $2, $3, $4, 0, 0
          )`,
          [
            materialId,
            usWarehouseId,
            quantity,
            quantity
          ]
        );
        stockCount++;
      }
    } catch (error) {
      console.error(`     ❌ Error inserting stock US for material ${materialId}: ${error.message}`);
    }
  }
  
  return stockCount;
}

// Insert material_stock for variant - luôn tạo 2 line cho VN và US
async function insertVariantStock(materialVariantId, material, warehouseMapping) {
  let stockCount = 0;
  
  // Luôn insert cho warehouse VN
  const vnWarehouseId = warehouseMapping.get('vn');
  if (vnWarehouseId) {
    try {
      const existingCheck = await pgClient.query(
        'SELECT id FROM material_stock WHERE material_variant_id = $1 AND warehouse_id = $2',
        [materialVariantId, vnWarehouseId]
      );
      
      if (existingCheck.rows.length === 0) {
        const quantity = parseFloat(material.stock_vn) || 0;
        await pgClient.query(
          `INSERT INTO material_stock (
            material_id, material_variant_id, warehouse_id,
            quantity, total_converted_quantity,
            inbound, outbound
          ) VALUES (
            NULL, $1, $2, $3, $4, 0, 0
          )`,
          [
            materialVariantId,
            vnWarehouseId,
            quantity,
            quantity
          ]
        );
        stockCount++;
      }
    } catch (error) {
      console.error(`     ❌ Error inserting stock VN for variant ${materialVariantId}: ${error.message}`);
    }
  }
  
  // Luôn insert cho warehouse US
  const usWarehouseId = warehouseMapping.get('us');
  if (usWarehouseId) {
    try {
      const existingCheck = await pgClient.query(
        'SELECT id FROM material_stock WHERE material_variant_id = $1 AND warehouse_id = $2',
        [materialVariantId, usWarehouseId]
      );
      
      if (existingCheck.rows.length === 0) {
        const quantity = parseFloat(material.stock_us) || 0;
        await pgClient.query(
          `INSERT INTO material_stock (
            material_id, material_variant_id, warehouse_id,
            quantity, total_converted_quantity,
            inbound, outbound
          ) VALUES (
            NULL, $1, $2, $3, $4, 0, 0
          )`,
          [
            materialVariantId,
            usWarehouseId,
            quantity,
            quantity
          ]
        );
        stockCount++;
      }
    } catch (error) {
      console.error(`     ❌ Error inserting stock US for variant ${materialVariantId}: ${error.message}`);
    }
  }
  
  return stockCount;
}

// Tạo material variants cho mỗi material trong group
async function createMaterialVariants(materialId, materialGroup, userMapping) {
  const variants = [];
  let variantSuccessCount = 0;
  let variantErrorCount = 0;
  const variantIdMap = new Map(); // old_id -> variant_id
  
  for (const material of materialGroup.materials) {
    try {
      // Generate variant SKU = material.sku + size
      const baseSku = (material.sku_material || '').trim();
      const size = (material.size || '').trim();
      const variantSku = size ? `${baseSku}-${size}` : baseSku;
      
      // Generate variant name = material.name (không thêm size)
      const variantName = (material.name_material || '').trim();
      
      // Find size_attribute_id và metal_attribute_id
      let sizeAttributeId = null;
      if (size) {
        sizeAttributeId = await findProductAttribute('size', size);
      }
      
      let metalAttributeId = null;
      if (material.metal) {
        metalAttributeId = await findProductAttribute('metal', material.metal);
      }
      
      // Get user mapping
      let createdById = null;
      if (material.by_user) {
        const userKey = material.by_user.toLowerCase().trim();
        if (userMapping.has(userKey)) {
          createdById = userMapping.get(userKey);
        }
      }
      
      // Get timestamps
      const createdAt = material.date_created ? new Date(material.date_created) : new Date();
      const updatedAt = material.last_update ? new Date(material.last_update) : new Date();
      
      // Check if variant SKU already exists
      const existingCheck = await pgClient.query(
        'SELECT id FROM material_variant WHERE sku = $1',
        [variantSku]
      );
      
      if (existingCheck.rows.length > 0) {
        console.log(`     ⚠️  Variant SKU ${variantSku} already exists, skipping...`);
        continue;
      }
      
      // Insert material variant
      const result = await pgClient.query(
        `INSERT INTO material_variant (
          material_id, sku, name,
          size_attribute_id, metal_attribute_id,
          unit, dimension,
          price, cost, weight,
          created_at, updated_at, created_by_id, updated_by_id
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
        ) RETURNING id`,
        [
          materialId,
          variantSku.substring(0, 100),
          variantName.substring(0, 500),
          sizeAttributeId,
          metalAttributeId,
          (material.unit || '').substring(0, 100),
          size ? size.substring(0, 100) : null, // dimension
          parseFloat(material.price) || 0,
          parseFloat(material.cost) || 0,
          material.weight ? parseFloat(material.weight) : null,
          createdAt,
          updatedAt,
          createdById,
          createdById
        ]
      );
      
      variants.push({
        old_id: material.id,
        variant_id: result.rows[0].id,
        sku: variantSku
      });
      variantIdMap.set(material.id, result.rows[0].id);
      variantSuccessCount++;
    } catch (error) {
      variantErrorCount++;
      console.error(`     ❌ Error creating variant for material ${material.id} (${material.sku_material}): ${error.message}`);
    }
  }
  
  return { variants, variantSuccessCount, variantErrorCount, variantIdMap };
}

// Migrate parent materials
async function migrateMaterials() {
  let mysqlConnection;
  
  try {
    console.log('🔌 Connecting to MySQL database (old DB)...');
    mysqlConnection = await mysql.createConnection(mysqlConfig);
    console.log('✅ MySQL connection successful!\n');

    console.log('🔌 Connecting to PostgreSQL database (new DB)...');
    await pgClient.connect();
    console.log('✅ PostgreSQL connection successful!\n');

    // Get default tenant_id
    console.log('🔍 Getting default tenant_id...');
    const tenantId = await getDefaultTenantId();
    console.log(`   Using tenant_id: ${tenantId}\n`);

    // Load sys_users
    console.log('📂 Loading sys_users from new database...');
    const userMapping = await loadSysUsersMapping();
    console.log(`   Loaded ${userMapping.size} users\n`);

    // Load warehouses
    console.log('📂 Loading warehouses from new database...');
    const warehouseMapping = await loadWarehouseMapping();
    console.log(`   Loaded ${warehouseMapping.size} warehouses\n`);

    // Fetch materials from old database
    console.log('📂 Fetching material data from old database...');
    const materials = await fetchAllMaterialData(mysqlConnection);
    console.log(`   Fetched ${materials.length} materials\n`);

    if (materials.length === 0) {
      console.log('⚠️  No materials found. Exiting...');
      await mysqlConnection.end();
      await pgClient.end();
      return;
    }

    // Analyze variants
    const variantPatterns = analyzeVariants(materials);
    
    // Create all material groups (variant groups + single materials)
    console.log('📦 Creating material groups (variant groups + single materials)...');
    const materialGroups = createAllMaterialGroups(variantPatterns);
    console.log(`   Created ${materialGroups.length} material groups`);
    const variantGroupsCount = materialGroups.filter(g => g.isVariantGroup).length;
    const singleMaterialsCount = materialGroups.filter(g => !g.isVariantGroup).length;
    console.log(`   - Variant groups: ${variantGroupsCount}`);
    console.log(`   - Single materials: ${singleMaterialsCount}\n`);

    // Start transaction
    await pgClient.query('BEGIN');

    let successCount = 0;
    let errorCount = 0;
    let duplicateSkuCount = 0;
    let totalVariantsCreated = 0;
    let totalVariantsFailed = 0;
    const errors = [];
    const parentMaterialMap = new Map(); // variantGroup key -> new material_id

    console.log('📝 Creating parent materials...\n');

    // Process all material groups
    for (let i = 0; i < materialGroups.length; i++) {
      const materialGroup = materialGroups[i];
      const savepointName = `sp_parent_${i}`;
      const isSingleMaterial = !materialGroup.isVariantGroup;
      
      try {
        await pgClient.query(`SAVEPOINT ${savepointName}`);

        // Generate parent material data
        const sku = generateParentSku(materialGroup, isSingleMaterial);
        const name = generateParentName(materialGroup, isSingleMaterial);
        const category = materialGroup.category || 'Unknown';
        const thumbnail = getThumbnail(materialGroup);
        const timestamps = getTimestamps(materialGroup);
        const createdById = getCreatedById(materialGroup, userMapping);
        const defaults = getMaterialDefaults(materialGroup, isSingleMaterial);

        // Find stone_attribute_id
        let stoneAttributeId = null;
        if (materialGroup.stone) {
          stoneAttributeId = await findProductAttribute('stone', materialGroup.stone);
        }

        // Find charm_attribute_id (for Charm category)
        let charmAttributeId = null;
        if (materialGroup.category === 'Charm' && materialGroup.collection) {
          charmAttributeId = await findProductAttribute('charm', materialGroup.collection);
        }

        // Check if SKU already exists
        const existingCheck = await pgClient.query(
          'SELECT id FROM material WHERE tenant_id = $1 AND sku = $2',
          [tenantId, sku]
        );

        if (existingCheck.rows.length > 0) {
          duplicateSkuCount++;
          const existingId = existingCheck.rows[0].id;
          const groupKey = `${materialGroup.baseName}::${materialGroup.stone || 'N/A'}`;
          parentMaterialMap.set(groupKey, existingId);
          await pgClient.query(`ROLLBACK TO SAVEPOINT ${savepointName}`);
          console.log(`   ⚠️  SKU ${sku} already exists, using existing material_id: ${existingId}`);
          continue;
        }

        // Insert parent material
        const result = await pgClient.query(
          `INSERT INTO material (
            tenant_id, sku, name, category,
            stone_attribute_id, charm_attribute_id,
            thumbnail, description,
            unit, dimension, price, cost, weight, conversion_factor,
            is_active,
            created_at, updated_at, created_by_id, updated_by_id
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
          ) RETURNING id`,
          [
            tenantId,
            sku,
            name,
            category,
            stoneAttributeId,
            charmAttributeId,
            thumbnail,
            '', // description
            defaults.unit,
            defaults.dimension,
            defaults.price,
            defaults.cost,
            defaults.weight,
            defaults.conversion_factor,
            true, // is_active
            timestamps.created_at,
            timestamps.updated_at,
            createdById,
            createdById // updated_by_id
          ]
        );

        const newMaterialId = result.rows[0].id;
        const groupKey = `${materialGroup.baseName}::${materialGroup.stone || 'N/A'}`;
        parentMaterialMap.set(groupKey, newMaterialId);
        successCount++;

        // Single material: insert stock vào material_stock với material_id
        if (isSingleMaterial && materialGroup.materials.length === 1) {
          const material = materialGroup.materials[0];
          const stockCount = await insertMaterialStock(newMaterialId, material, warehouseMapping);
          if (stockCount > 0) {
            console.log(`     ✅ Inserted ${stockCount} stock records for material ${newMaterialId}`);
          }
        }

        // Variant group: chỉ tạo variants khi isVariantGroup = true
        if (materialGroup.isVariantGroup && materialGroup.materials.length > 0) {
          const variantResult = await createMaterialVariants(newMaterialId, materialGroup, userMapping);
          totalVariantsCreated += variantResult.variantSuccessCount;
          totalVariantsFailed += variantResult.variantErrorCount;
          
          // Insert stock cho từng variant
          for (const material of materialGroup.materials) {
            const variantId = variantResult.variantIdMap.get(material.id);
            if (variantId) {
              await insertVariantStock(variantId, material, warehouseMapping);
            }
          }
          
          if (variantResult.variantSuccessCount > 0) {
            console.log(`     ✅ Created ${variantResult.variantSuccessCount} variants for material ${newMaterialId}`);
          }
          if (variantResult.variantErrorCount > 0) {
            console.log(`     ⚠️  Failed ${variantResult.variantErrorCount} variants for material ${newMaterialId}`);
          }
        }

        await pgClient.query(`RELEASE SAVEPOINT ${savepointName}`);

        if ((i + 1) % 10 === 0) {
          process.stdout.write(`   Created ${i + 1}/${materialGroups.length} parent materials...\r`);
        }
      } catch (error) {
        try {
          await pgClient.query(`ROLLBACK TO SAVEPOINT ${savepointName}`);
        } catch (rollbackError) {
          // Savepoint might not exist
        }
        
        errorCount++;
        errors.push({
          variantGroup: materialGroup.baseName,
          stone: materialGroup.stone,
          error: error.message
        });
        console.error(`\n   ❌ Error creating parent material for ${materialGroup.baseName}: ${error.message}`);
      }
    }

    console.log(`\n\n✅ Created ${successCount} parent materials`);
    if (errorCount > 0) {
      console.log(`❌ Failed ${errorCount} parent materials`);
      console.log('\nFirst 10 errors:');
      errors.slice(0, 10).forEach(err => {
        console.log(`   - ${err.variantGroup} (stone: ${err.stone || 'N/A'}): ${err.error}`);
      });
    }
    if (duplicateSkuCount > 0) {
      console.log(`⚠️  Skipped ${duplicateSkuCount} parent materials (duplicate SKU)`);
    }

    // Commit transaction
    await pgClient.query('COMMIT');
    console.log('\n✅ Transaction committed successfully!\n');

    // Save parent material mapping
    const mappingData = Array.from(parentMaterialMap.entries()).map(([key, materialId]) => {
      const [baseName, stone] = key.split('::');
      return {
        group_key: key,
        base_name: baseName,
        stone: stone === 'N/A' ? null : stone,
        material_id: materialId
      };
    });
    
    const mappingFile = `material_parent_mapping_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    fs.writeFileSync(mappingFile, JSON.stringify(mappingData, null, 2));
    console.log(`💾 Parent material mapping saved to: ${mappingFile}`);

    // Summary
    console.log('\n📊 Migration Summary:');
    console.log(`   • Total materials fetched: ${materials.length}`);
    console.log(`   • Material groups created: ${materialGroups.length}`);
    console.log(`   • Variant groups: ${variantGroupsCount}`);
    console.log(`   • Single materials: ${singleMaterialsCount}`);
    console.log(`   • Parent materials created: ${successCount}`);
    console.log(`   • Parent materials failed: ${errorCount}`);
    console.log(`   • Parent materials skipped (duplicate SKU): ${duplicateSkuCount}`);
    console.log(`   • Material variants created: ${totalVariantsCreated}`);
    console.log(`   • Material variants failed: ${totalVariantsFailed}`);
    console.log(`   • Parent material mapping: ${parentMaterialMap.size} entries`);

    await mysqlConnection.end();
    await pgClient.end();
    console.log('\n✅ Migration completed!');
  } catch (error) {
    await pgClient.query('ROLLBACK');
    console.error('❌ Migration error:', error.message);
    console.error('   Stack:', error.stack);
    if (mysqlConnection) await mysqlConnection.end();
    if (pgClient) await pgClient.end();
    process.exit(1);
  }
}

// Run migration
migrateMaterials();

