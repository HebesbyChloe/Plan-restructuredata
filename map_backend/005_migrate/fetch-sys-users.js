require('dotenv').config();
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

// Get table structure
async function getTableStructure(tableName) {
  try {
    const query = `
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default,
        character_maximum_length
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = $1
      ORDER BY ordinal_position;
    `;
    
    const result = await client.query(query, [tableName]);
    return result.rows;
  } catch (error) {
    throw error;
  }
}

// Get table row count
async function getTableRowCount(tableName) {
  try {
    const result = await client.query(`SELECT COUNT(*) as total FROM ${tableName}`);
    return parseInt(result.rows[0].total);
  } catch (error) {
    throw error;
  }
}

// Fetch data from sys_users table
async function fetchSysUsers(limit = 100, offset = 0, orderBy = 'created_at DESC') {
  try {
    let query = `SELECT * FROM sys_users`;
    
    if (orderBy) {
      query += ` ORDER BY ${orderBy}`;
    }
    
    query += ` LIMIT $1 OFFSET $2`;
    
    const result = await client.query(query, [limit, offset]);
    return result.rows;
  } catch (error) {
    throw error;
  }
}

// Main function
async function fetchData() {
  try {
    // Parse command line arguments
    const args = process.argv.slice(2);
    const limit = args[0] ? parseInt(args[0]) : 100;
    const offset = args[1] ? parseInt(args[1]) : 0;
    const outputFormat = args[2] || 'json'; // json or csv

    console.log('🔌 Connecting to PostgreSQL database...');
    await client.connect();
    console.log('✅ Database connection successful!\n');

    // Get table structure
    const columns = await getTableStructure('sys_users');
    console.log(`📊 Table structure (${columns.length} columns):`);
    console.log('─'.repeat(80));
    columns.forEach((col, index) => {
      const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
      const length = col.character_maximum_length ? `(${col.character_maximum_length})` : '';
      console.log(`   ${(index + 1).toString().padStart(3)}. ${col.column_name.padEnd(30)} ${col.data_type}${length} ${nullable}`);
    });

    // Get total row count
    const totalRows = await getTableRowCount('sys_users');
    console.log(`\n📈 Total rows in table: ${totalRows}`);

    // Fetch data
    console.log(`\n🔍 Fetching ${limit} rows from sys_users (offset: ${offset})...\n`);
    const rows = await fetchSysUsers(limit, offset);

    console.log(`✅ Fetched ${rows.length} rows\n`);

    if (rows.length === 0) {
      console.log('⚠️  No data found in table.');
      await client.end();
      return;
    }

    // Display sample (first row)
    console.log('📦 Sample data (first row):');
    console.log(JSON.stringify(rows[0], null, 2));
    console.log(`\n... (showing ${Math.min(3, rows.length)} of ${rows.length} rows)\n`);

    // Save to file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    let outputFile;
    let outputData;

    if (outputFormat.toLowerCase() === 'csv') {
      // Convert to CSV
      const headers = Object.keys(rows[0]);
      const csvRows = [
        headers.join(','),
        ...rows.map(row => 
          headers.map(header => {
            const value = row[header];
            if (value === null || value === undefined) return '';
            const stringValue = String(value);
            // Escape quotes and wrap in quotes if contains comma, newline, or quote
            if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
              return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
          }).join(',')
        )
      ];
      outputData = csvRows.join('\n');
      outputFile = `sys_users_${timestamp}.csv`;
    } else {
      // JSON format
      outputData = JSON.stringify(rows, null, 2);
      outputFile = `sys_users_${timestamp}.json`;
    }

    fs.writeFileSync(outputFile, outputData, 'utf8');
    console.log(`💾 Data saved to: ${outputFile}`);
    console.log(`📁 File size: ${(fs.statSync(outputFile).size / 1024).toFixed(2)} KB`);

    // Close connection
    await client.end();
    console.log('\n✅ Connection closed successfully.');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('   Stack:', error.stack);
    if (client) {
      await client.end();
    }
    process.exit(1);
  }
}

// Run
fetchData();

