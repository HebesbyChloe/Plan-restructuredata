require('dotenv').config();
const mysql = require('mysql2/promise');

// MySQL connection configuration
const connectionConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_DB_USER,
  password: process.env.MYSQL_DB_PASSWORD,
  database: process.env.MYSQL_DB_NAME,
};

// Get list of tables
async function getTables(connection) {
  try {
    const query = `
      SELECT 
        TABLE_SCHEMA as table_schema,
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

// Test database connection
async function testConnection() {
  let connection;
  try {
    console.log('🔌 Connecting to MySQL database...');
    console.log(`   Host: ${process.env.MYSQL_HOST}`);
    console.log(`   Database: ${process.env.MYSQL_DB_NAME}`);
    console.log(`   User: ${process.env.MYSQL_DB_USER}`);
    
    connection = await mysql.createConnection(connectionConfig);
    console.log('✅ Database connection successful!\n');
    
    // Test query - Get server info
    const [serverInfo] = await connection.execute('SELECT NOW() as server_time, VERSION() as mysql_version');
    console.log('📅 Server Time:', serverInfo[0].server_time);
    console.log('📦 MySQL Version:', serverInfo[0].mysql_version);
    
    // Get database name
    const [dbInfo] = await connection.execute('SELECT DATABASE() as current_database');
    console.log('💾 Current Database:', dbInfo[0].current_database);
    
    // Get list of tables
    console.log('\n📋 Database Tables:');
    console.log('─'.repeat(60));
    const tables = await getTables(connection);
    
    if (tables.length === 0) {
      console.log('   No tables found in database.');
    } else {
      // Group by schema (though MySQL typically uses one schema per database)
      const tablesBySchema = {};
      tables.forEach(table => {
        const schema = table.table_schema || process.env.MYSQL_DB_NAME;
        if (!tablesBySchema[schema]) {
          tablesBySchema[schema] = [];
        }
        tablesBySchema[schema].push(table);
      });
      
      // Display by schema
      Object.keys(tablesBySchema).forEach(schema => {
        console.log(`\n📁 Schema: ${schema}`);
        tablesBySchema[schema].forEach((table, index) => {
          console.log(`   ${index + 1}. ${table.table_name} (${table.table_type})`);
        });
      });
      
      console.log(`\n📊 Total tables: ${tables.length}`);
    }
    
    // Close connection
    await connection.end();
    console.log('\n✅ Connection closed successfully.');
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.error('   Stack:', error.stack);
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

// Run test
testConnection();

