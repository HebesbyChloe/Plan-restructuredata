const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { Client } = require('pg');
const fs = require('fs');
const csv = require('csv-parser');

// PostgreSQL connection (new database)
const pgClient = new Client({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

// Parse price string like "$990.00" or "$1,830.08" to number
function parsePrice(priceStr) {
  if (!priceStr || priceStr.trim() === '') return 0;
  // Remove $, commas, and spaces
  const cleaned = priceStr.replace(/[$,\s]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : Math.max(0, parsed);
}

// Parse dimension string like "7.21*7.25*4.55" to {length, width, height}
function parseDimension(dimensionStr) {
  if (!dimensionStr || dimensionStr.trim() === '') {
    return { length: 0, width: 0, height: 0 };
  }
  
  const parts = dimensionStr.split('*').map(p => p.trim());
  if (parts.length >= 3) {
    return {
      length: parseFloat(parts[0]) || 0,
      width: parseFloat(parts[1]) || 0,
      height: parseFloat(parts[2]) || 0
    };
  }
  return { length: 0, width: 0, height: 0 };
}

// Parse weight to carat
function parseCarat(weightStr) {
  if (!weightStr || weightStr.trim() === '') return 0;
  const parsed = parseFloat(weightStr);
  return isNaN(parsed) ? 0 : Math.max(0, parsed);
}

// Determine grading lab from certificate number
function getGradingLab(certificateNumber) {
  if (!certificateNumber) return '';
  const cert = certificateNumber.toUpperCase();
  if (cert.startsWith('IGI')) return 'IGI';
  if (cert.startsWith('GIA')) return 'GIA';
  if (cert.startsWith('HRD')) return 'HRD';
  if (cert.startsWith('AGS')) return 'AGS';
  return '';
}

// Map status from CSV
function mapStatus(statusStr) {
  if (!statusStr) return 'draft';
  const status = statusStr.toLowerCase().trim();
  if (status.includes('sold')) return 'publish';
  if (status.includes('stock')) return 'publish';
  if (status.includes('gift')) return 'draft';
  if (status.includes('refund')) return 'draft';
  return 'draft';
}

// Detect CSV format based on column names
function detectCsvFormat(headers) {
  if (headers.includes('Certificate Number') && headers.includes('Carat')) {
    return 'labgrown'; // New format (labgrown-diamond.csv)
  }
  if (headers.includes('Certificate #') && headers.includes('Weight')) {
    return 'publish'; // Old format (Publish Lab Diamond)
  }
  return 'unknown';
}

// Get next SKU for diamond
async function getNextDiamondSku() {
  // Get all SKUs for diamonds
  const checkResult = await pgClient.query(
    `SELECT sku FROM product 
     WHERE product_type = 'diamond'`
  );

  if (checkResult.rows.length === 0) {
    // No diamonds exist, start with 880001
    return '880001';
  }

  // Find the maximum numeric SKU value
  let maxSkuNumber = 0;
  
  for (const row of checkResult.rows) {
    const sku = row.sku;
    // Extract number from SKU (assuming SKU is numeric or ends with number)
    const skuMatch = sku.match(/(\d+)$/);
    if (skuMatch) {
      const number = parseInt(skuMatch[1], 10);
      if (number > maxSkuNumber) {
        maxSkuNumber = number;
      }
    }
  }

  // If we found a valid SKU number, increment it
  if (maxSkuNumber > 0) {
    const nextNumber = maxSkuNumber + 1;
    // Format as 6-digit number with leading zeros
    return String(nextNumber).padStart(6, '0');
  }

  // If no valid numeric SKU found, start from 880001
  return '880001';
}

// Clean and transform diamond data from CSV row (support both formats)
function cleanDiamondData(row, skuNumber, format) {
  let certNumber, weight, shape, color, clarity, retailPrice, dimension, status, certificatePath, imagePath, cutGrade, itemId, country, guaranteedAvailability, gradingLab;

  if (format === 'labgrown') {
    // New format (labgrown-diamond.csv)
    certNumber = (row['Certificate Number'] || '').trim();
    weight = parseCarat(row['Carat']);
    shape = (row['Cut'] || '').trim(); // Cut column contains shape
    color = (row['Color'] || '').trim();
    clarity = (row['Clarity'] || '').trim();
    retailPrice = parseFloat(row['Total Price']) || 0;
    dimension = {
      length: parseFloat(row['Measurements Length']) || 0,
      width: parseFloat(row['Measurements Width']) || 0,
      height: parseFloat(row['Measurements Height']) || 0
    };
    status = 'publish'; // Default for labgrown format
    certificatePath = (row['Certificate Path'] || '').trim();
    imagePath = (row['Image Path'] || '').trim();
    cutGrade = (row['Cut Grade'] || '').trim();
    itemId = (row['Item ID #'] || '').trim();
    country = (row['Country'] || '').trim();
    const guaranteedStr = (row['Guaranteed Availability'] || '').trim();
    guaranteedAvailability = guaranteedStr.toLowerCase().includes('guaranteed');
    gradingLab = (row['Grading Lab'] || '').trim();
  } else {
    // Old format (Publish Lab Diamond)
    certNumber = (row['Certificate #'] || '').trim();
    weight = parseCarat(row['Weight']);
    shape = (row['Shape'] || '').trim();
    color = (row['Color'] || '').trim();
    clarity = (row['Color clarity'] || '').trim();
    retailPrice = parsePrice(row['EST Retail (USD)']);
    dimension = parseDimension(row['Dimension']);
    status = mapStatus(row['Status']);
    certificatePath = (row['Cer Link'] || '').trim();
    const fullLink = (row['Full link'] || '').trim();
    certificatePath = certificatePath || fullLink;
    imagePath = '';
    cutGrade = '';
    itemId = '';
    country = '';
    guaranteedAvailability = false;
    gradingLab = getGradingLab(certNumber);
  }

  if (!certNumber) {
    return null; // Skip rows without certificate number
  }

  if (weight <= 0) {
    return null; // Skip rows without valid weight
  }

  // Generate SKU from number (6-digit format)
  const sku = String(skuNumber).padStart(6, '0');
  
  // Generate product name
  const nameParts = [];
  if (weight > 0) nameParts.push(`${weight}ct`);
  if (color) nameParts.push(color);
  if (clarity) nameParts.push(clarity);
  if (shape) nameParts.push(shape);
  const name = nameParts.length > 0 
    ? nameParts.join(' ') 
    : `Diamond ${certNumber}`;
  const productName = name.substring(0, 500); // VARCHAR(500)

  // Generate description
  const descParts = [];
  if (shape) descParts.push(`Shape: ${shape}`);
  if (color) descParts.push(`Color: ${color}`);
  if (clarity) descParts.push(`Clarity: ${clarity}`);
  if (certNumber) descParts.push(`Certificate: ${certNumber}`);
  if (cutGrade) descParts.push(`Cut Grade: ${cutGrade}`);
  const description = descParts.join('\n');

  return {
    // Product fields
    sku,
    name: productName,
    product_type: 'diamond',
    retail_price: retailPrice,
    sale_price: retailPrice, // Use same as retail for now
    description,
    status,
    // Diamond fields
    certificate_number: certNumber,
    item_id: itemId || null,
    shape,
    cut_grade: cutGrade,
    carat: weight,
    color,
    clarity,
    grading_lab: gradingLab || getGradingLab(certNumber),
    certificate_path: certificatePath,
    image_path: imagePath,
    total_price: retailPrice,
    measurement_length: dimension.length,
    measurement_width: dimension.width,
    measurement_height: dimension.height,
    country: country,
    guaranteed_availability: guaranteedAvailability
  };
}

// Migrate diamonds from CSV
async function migrateDiamondsFromCSV(csvFilePath) {
  try {
    console.log('🔌 Connecting to PostgreSQL database...');
    await pgClient.connect();
    console.log('✅ PostgreSQL connection successful!\n');

    // Get starting SKU
    console.log('🔍 Determining starting SKU for diamonds...');
    const startingSku = await getNextDiamondSku();
    console.log(`   Starting SKU: ${startingSku}\n`);

    console.log(`📂 Reading CSV file: ${csvFilePath}`);
    const rows = [];
    let csvFormat = null;
    let headers = [];
    
    await new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('headers', (headerList) => {
          headers = headerList;
          csvFormat = detectCsvFormat(headers);
          console.log(`   Detected CSV format: ${csvFormat}`);
          if (csvFormat === 'unknown') {
            console.error('   ⚠️  Warning: Unknown CSV format, trying default mapping');
            csvFormat = 'publish'; // Default to old format
          }
        })
        .on('data', (row) => {
          rows.push(row);
        })
        .on('end', resolve)
        .on('error', reject);
    });

    console.log(`   Read ${rows.length} rows from CSV\n`);

    // Clean and transform data
    console.log('🧹 Cleaning and transforming data...');
    const cleaned = [];
    const skipped = [];
    let currentSkuNumber = parseInt(startingSku, 10);

    rows.forEach((row, index) => {
      const cleanedItem = cleanDiamondData(row, currentSkuNumber, csvFormat);
      if (cleanedItem) {
        cleaned.push(cleanedItem);
        currentSkuNumber++; // Increment for next diamond
      } else {
        skipped.push({
          row: index + 2, // +2 because CSV has header and 1-based index
          certificate: row['Certificate Number'] || row['Certificate #'] || 'N/A',
          reason: !(row['Certificate Number'] || row['Certificate #']) ? 'Missing certificate number' : 'Missing or invalid weight'
        });
      }
    });

    console.log(`   Cleaned: ${cleaned.length} diamonds`);
    if (skipped.length > 0) {
      console.log(`   Skipped: ${skipped.length} rows`);
      console.log('   First 5 skipped items:');
      skipped.slice(0, 5).forEach(item => {
        console.log(`     - Row ${item.row}: ${item.certificate} - ${item.reason}`);
      });
    }
    console.log('');

    // Check for duplicate SKUs in this batch
    const skuMap = new Map();
    const duplicates = [];
    cleaned.forEach(item => {
      if (skuMap.has(item.sku)) {
        duplicates.push({ sku: item.sku, certificate: item.certificate_number });
      } else {
        skuMap.set(item.sku, item);
      }
    });

    if (duplicates.length > 0) {
      console.log(`⚠️  Warning: Found ${duplicates.length} duplicate SKUs in CSV`);
      console.log('   First 5 duplicates:');
      duplicates.slice(0, 5).forEach(dup => {
        console.log(`     - SKU: ${dup.sku}, Certificate: ${dup.certificate}`);
      });
      console.log('');
    }

    // Start transaction
    await pgClient.query('BEGIN');

    console.log('📝 Inserting products and diamonds...\n');

    let successCount = 0;
    let errorCount = 0;
    let duplicateSkuCount = 0;
    const errors = [];
    const idMapping = [];

    for (const diamond of cleaned) {
      const savepointName = `sp_diamond_${diamond.sku.replace(/[^a-zA-Z0-9]/g, '_')}`;
      
      try {
        // Create savepoint
        await pgClient.query(`SAVEPOINT ${savepointName}`);

        // Check if SKU already exists
        const existingCheck = await pgClient.query(
          'SELECT id FROM product WHERE sku = $1',
          [diamond.sku]
        );

        let productId;

        if (existingCheck.rows.length > 0) {
          // Product exists, check if diamond record exists
          productId = existingCheck.rows[0].id;
          
          const diamondCheck = await pgClient.query(
            'SELECT id FROM diamond WHERE product_id = $1',
            [productId]
          );

          if (diamondCheck.rows.length > 0) {
            duplicateSkuCount++;
            await pgClient.query(`ROLLBACK TO SAVEPOINT ${savepointName}`);
            console.log(`   ⚠️  SKU ${diamond.sku} already exists, skipping...`);
            continue;
          }
          
          // Product exists but no diamond record, update product and insert diamond
          await pgClient.query(
            `UPDATE product 
             SET name = $1, retail_price = $2, sale_price = $3, description = $4, status = $5, product_type = 'diamond'
             WHERE id = $6`,
            [diamond.name, diamond.retail_price, diamond.sale_price, diamond.description, diamond.status, productId]
          );
        } else {
          // Insert new product
          const productResult = await pgClient.query(
            `INSERT INTO product (
              sku, name, product_type, retail_price, sale_price, description, status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
            [
              diamond.sku,
              diamond.name,
              diamond.product_type,
              diamond.retail_price,
              diamond.sale_price,
              diamond.description,
              diamond.status
            ]
          );
          productId = productResult.rows[0].id;
        }

        // Insert diamond record
        await pgClient.query(
          `INSERT INTO diamond (
            product_id, item_id, certificate_number, shape, cut_grade, carat, color, clarity, grading_lab,
            certificate_path, image_path, total_price, measurement_length, measurement_width, measurement_height,
            country, guaranteed_availability
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
          [
            productId,
            diamond.item_id,
            diamond.certificate_number,
            diamond.shape,
            diamond.cut_grade,
            diamond.carat,
            diamond.color,
            diamond.clarity,
            diamond.grading_lab,
            diamond.certificate_path,
            diamond.image_path,
            diamond.total_price,
            diamond.measurement_length,
            diamond.measurement_width,
            diamond.measurement_height,
            diamond.country,
            diamond.guaranteed_availability
          ]
        );

        idMapping.push({
          sku: diamond.sku,
          certificate: diamond.certificate_number,
          product_id: productId
        });

        await pgClient.query(`RELEASE SAVEPOINT ${savepointName}`);
        successCount++;

        if (successCount % 50 === 0) {
          process.stdout.write(`   Processed ${successCount}/${cleaned.length}...\r`);
        }
      } catch (error) {
        try {
          await pgClient.query(`ROLLBACK TO SAVEPOINT ${savepointName}`);
        } catch (rollbackError) {
          // Savepoint might not exist
        }

        errorCount++;
        errors.push({
          sku: diamond.sku,
          certificate: diamond.certificate_number,
          error: error.message
        });
        console.error(`\n   ❌ Error with ${diamond.sku} (${diamond.certificate_number}): ${error.message}`);
      }
    }

    // Commit transaction
    await pgClient.query('COMMIT');
    console.log(`\n\n✅ Transaction committed successfully!\n`);

    // Summary
    console.log('📊 Migration Summary:');
    console.log(`   • Total rows in CSV: ${rows.length}`);
    console.log(`   • Successfully processed: ${successCount}`);
    console.log(`   • Failed: ${errorCount}`);
    console.log(`   • Skipped (invalid data): ${skipped.length}`);
    console.log(`   • Skipped (duplicate SKU): ${duplicateSkuCount}`);
    console.log(`   • SKU range: ${startingSku} to ${String(currentSkuNumber - 1).padStart(6, '0')}`);

    if (errors.length > 0) {
      console.log('\n❌ First 10 errors:');
      errors.slice(0, 10).forEach(err => {
        console.log(`   - ${err.sku} (${err.certificate}): ${err.error}`);
      });
    }

    // Save ID mapping to file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const mappingFile = `diamond_id_mapping_${timestamp}.json`;
    fs.writeFileSync(mappingFile, JSON.stringify(idMapping, null, 2));
    console.log(`\n💾 ID mapping saved to: ${mappingFile}`);

    if (skipped.length > 0) {
      const skippedFile = `diamond_skipped_${timestamp}.json`;
      fs.writeFileSync(skippedFile, JSON.stringify(skipped, null, 2));
      console.log(`💾 Skipped items saved to: ${skippedFile}`);
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
if (args.length === 0) {
  console.error('❌ Error: CSV file path is required');
  console.error('Usage: node migrate-diamond-from-csv.js <csv_file_path>');
  process.exit(1);
}

// Get workspace root (2 levels up from this file)
const workspaceRoot = path.resolve(__dirname, '..', '..');
let csvFilePath = args[0];

// If path is relative or just filename, try to resolve from workspace root
if (!path.isAbsolute(csvFilePath)) {
  // Try workspace root first
  const rootPath = path.join(workspaceRoot, csvFilePath);
  if (fs.existsSync(rootPath)) {
    csvFilePath = rootPath;
  } else {
    // Try relative to current directory
    const relativePath = path.resolve(csvFilePath);
    if (fs.existsSync(relativePath)) {
      csvFilePath = relativePath;
    } else {
      csvFilePath = rootPath; // Will check existence below
    }
  }
}

if (!fs.existsSync(csvFilePath)) {
  console.error(`❌ Error: File not found: ${csvFilePath}`);
  console.error(`   Tried: ${csvFilePath}`);
  console.error(`   Workspace root: ${workspaceRoot}`);
  process.exit(1);
}

console.log('🚀 Starting diamond migration from CSV...\n');
migrateDiamondsFromCSV(csvFilePath);

