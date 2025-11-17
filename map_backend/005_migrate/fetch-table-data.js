const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mysql = require('mysql2/promise');
const fs = require('fs');

// MySQL connection configuration
const connectionConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_DB_USER,
  password: process.env.MYSQL_DB_PASSWORD,
  database: process.env.MYSQL_DB_NAME,
};

// Get list of all tables
async function getAllTables(connection) {
  try {
    const query = `
      SELECT 
        TABLE_NAME as table_name,
        TABLE_TYPE as table_type
      FROM information_schema.TABLES
      WHERE TABLE_SCHEMA = ?
      ORDER BY TABLE_NAME;
    `;
    const [rows] = await connection.execute(query, [process.env.MYSQL_DB_NAME]);
    return rows;
  } catch (error) {
    throw error;
  }
}

// Check if table exists
async function tableExists(connection, tableName) {
  try {
    const [result] = await connection.execute(
      `SELECT COUNT(*) as count FROM information_schema.TABLES 
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?`,
      [process.env.MYSQL_DB_NAME, tableName]
    );
    return result[0].count > 0;
  } catch (error) {
    throw error;
  }
}

// Get table structure (columns)
async function getTableStructure(connection, tableName) {
  try {
    const [columns] = await connection.execute(
      `SELECT 
        COLUMN_NAME, 
        DATA_TYPE, 
        IS_NULLABLE,
        COLUMN_DEFAULT,
        CHARACTER_MAXIMUM_LENGTH,
        COLUMN_KEY,
        EXTRA
       FROM information_schema.COLUMNS 
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? 
       ORDER BY ORDINAL_POSITION`,
      [process.env.MYSQL_DB_NAME, tableName]
    );
    return columns;
  } catch (error) {
    throw error;
  }
}

// Get table row count
async function getTableRowCount(connection, tableName) {
  try {
    const [result] = await connection.execute(`SELECT COUNT(*) as total FROM \`${tableName}\``);
    return result[0].total;
  } catch (error) {
    throw error;
  }
}

// Fetch data from table
async function fetchTableData(connection, tableName, limit = 100, offset = 0, orderBy = null) {
  try {
    let query = `SELECT * FROM \`${tableName}\``;
    const params = [];
    
    // Add ORDER BY clause if provided
    if (orderBy) {
      query += ` ORDER BY ${orderBy}`;
    }
    
    query += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);
    
    const [rows] = await connection.execute(query, params);
    return rows;
  } catch (error) {
    throw error;
  }
}

// Main function
async function fetchData() {
  let connection;
  try {
    // Parse command line arguments
    const args = process.argv.slice(2);
    const tableName = args[0];
    const limit = args[1] ? parseInt(args[1]) : 100;
    const offset = args[2] ? parseInt(args[2]) : 0;
    const outputFormat = args[3] || 'json'; // json or csv

    console.log('🔌 Connecting to MySQL database...');
    connection = await mysql.createConnection(connectionConfig);
    console.log('✅ Database connection successful!\n');

    // If no table name provided, list all tables
    if (!tableName) {
      console.log('📋 Available tables in database:\n');
      const tables = await getAllTables(connection);
      
      tables.forEach((table, index) => {
        const type = table.table_type === 'BASE TABLE' ? '📊' : '👁️';
        console.log(`   ${index + 1}. ${type} ${table.table_name} (${table.table_type})`);
      });
      
      console.log(`\n💡 Usage: node fetch-table-data.js <table_name> [limit] [offset] [format]`);
      console.log(`   Example: node fetch-table-data.js db_iv_product 100 0 json`);
      console.log(`   Example: node fetch-table-data.js db_order 50`);
      
      await connection.end();
      return;
    }

    // Validate table exists
    console.log(`📋 Checking table: ${tableName}`);
    const exists = await tableExists(connection, tableName);
    
    if (!exists) {
      console.error(`❌ Table '${tableName}' not found!`);
      console.log('\n💡 Available tables:');
      const tables = await getAllTables(connection);
      const matchingTables = tables.filter(t => 
        t.table_name.toLowerCase().includes(tableName.toLowerCase())
      );
      
      if (matchingTables.length > 0) {
        console.log('\n   Similar tables found:');
        matchingTables.slice(0, 10).forEach(table => {
          console.log(`   - ${table.table_name}`);
        });
      } else {
        console.log('\n   Showing first 20 tables:');
        tables.slice(0, 20).forEach(table => {
          console.log(`   - ${table.table_name}`);
        });
      }
      process.exit(1);
    }

    // Get table structure
    const columns = await getTableStructure(connection, tableName);
    console.log(`\n📊 Table structure (${columns.length} columns):`);
    console.log('─'.repeat(80));
    columns.forEach((col, index) => {
      const nullable = col.IS_NULLABLE === 'YES' ? 'NULL' : 'NOT NULL';
      const key = col.COLUMN_KEY ? `[${col.COLUMN_KEY}]` : '';
      const length = col.CHARACTER_MAXIMUM_LENGTH ? `(${col.CHARACTER_MAXIMUM_LENGTH})` : '';
      console.log(`   ${(index + 1).toString().padStart(3)}. ${col.COLUMN_NAME.padEnd(30)} ${col.DATA_TYPE}${length} ${nullable} ${key}`);
    });

    // Check if date_created or created_at column exists
    const dateColumn = columns.find(col => {
      const colName = col.COLUMN_NAME.toLowerCase();
      return colName === 'date_created' || colName === 'created_at';
    });

    // Determine default ORDER BY
    let defaultOrderBy = null;
    if (dateColumn) {
      defaultOrderBy = `\`${dateColumn.COLUMN_NAME}\` DESC`;
      console.log(`\n📅 Found date column: ${dateColumn.COLUMN_NAME} (will sort by this DESC)`);
    }

    // Get total row count
    const totalRows = await getTableRowCount(connection, tableName);
    console.log(`\n📈 Total rows in table: ${totalRows}`);

    // Fetch data with default sort by date_created if available
    const sortInfo = defaultOrderBy ? ` ORDER BY ${defaultOrderBy}` : '';
    console.log(`\n🔍 Fetching ${limit} rows from ${tableName}${sortInfo} (offset: ${offset})...\n`);
    const rows = await fetchTableData(connection, tableName, limit, offset, defaultOrderBy);

    console.log(`✅ Fetched ${rows.length} rows\n`);

    if (rows.length === 0) {
      console.log('⚠️  No data found in table.');
      await connection.end();
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
      outputFile = `${tableName}_${timestamp}.csv`;
    } else {
      // JSON format
      outputData = JSON.stringify(rows, null, 2);
      outputFile = `${tableName}_${timestamp}.json`;
    }

    fs.writeFileSync(outputFile, outputData, 'utf8');
    console.log(`💾 Data saved to: ${outputFile}`);
    console.log(`📁 File size: ${(fs.statSync(outputFile).size / 1024).toFixed(2)} KB`);

    // Close connection
    await connection.end();
    console.log('\n✅ Connection closed successfully.');
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
fetchData();

