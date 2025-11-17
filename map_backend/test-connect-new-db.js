require('dotenv').config();
const { Client } = require('pg');

// PostgreSQL connection configuration
const client = new Client({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

// Get list of tables
async function getTables() {
  try {
    const query = `
      SELECT 
        table_schema,
        table_name,
        table_type
      FROM information_schema.tables
      WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
      ORDER BY table_schema, table_name;
    `;
    
    const result = await client.query(query);
    return result.rows;
  } catch (error) {
    throw error;
  }
}

// Test database connection
async function testConnection() {
  try {
    console.log('🔌 Connecting to PostgreSQL database...');
    console.log(`   Host: ${process.env.POSTGRES_HOST}`);
    console.log(`   Port: ${process.env.POSTGRES_PORT}`);
    console.log(`   Database: ${process.env.POSTGRES_DB}`);
    
    await client.connect();
    console.log('✅ Database connection successful!\n');
    
    // Test query - Get server info
    const serverInfo = await client.query('SELECT NOW() as current_time, version() as pg_version');
    console.log('📅 Server Time:', serverInfo.rows[0].current_time);
    console.log('📦 PostgreSQL Version:', serverInfo.rows[0].pg_version.split(',')[0]);
    
    // Get list of tables
    console.log('\n📋 Database Tables:');
    console.log('─'.repeat(60));
    const tables = await getTables();
    
    if (tables.length === 0) {
      console.log('   No tables found in database.');
    } else {
      // Group by schema
      const tablesBySchema = {};
      tables.forEach(table => {
        if (!tablesBySchema[table.table_schema]) {
          tablesBySchema[table.table_schema] = [];
        }
        tablesBySchema[table.table_schema].push(table);
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
    await client.end();
    console.log('\n✅ Connection closed successfully.');
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.error('   Stack:', error.stack);
    process.exit(1);
  }
}

// Run test
testConnection();

