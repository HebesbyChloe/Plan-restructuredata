const { Client } = require('pg');

console.log("Hello World");

// Kết nối tới database
const connectionString = 'postgresql://hebes_pg_ad:H7GfTjLF4kHBuHcwA05pIHej@45.76.160.144:55432/hebes_pg';

// Tạo client PostgreSQL
const client = new Client({
  connectionString: connectionString
});

// Hàm lấy danh sách các bảng
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

// Hàm kết nối và test database
async function connectDatabase() {
  try {
    console.log('Đang kết nối tới database...');
    await client.connect();
    console.log('✅ Kết nối database thành công!');
    
    // Test query
    const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
    console.log('📅 Thời gian hiện tại:', result.rows[0].current_time);
    console.log('📦 PostgreSQL version:', result.rows[0].pg_version.split(',')[0]);
    
    // Lấy danh sách các bảng
    console.log('\n📋 Danh sách các bảng trong database:');
    console.log('─'.repeat(60));
    const tables = await getTables();
    
    if (tables.length === 0) {
      console.log('Không có bảng nào trong database.');
    } else {
      // Nhóm theo schema
      const tablesBySchema = {};
      tables.forEach(table => {
        if (!tablesBySchema[table.table_schema]) {
          tablesBySchema[table.table_schema] = [];
        }
        tablesBySchema[table.table_schema].push(table);
      });
      
      // Hiển thị theo schema
      Object.keys(tablesBySchema).forEach(schema => {
        console.log(`\n📁 Schema: ${schema}`);
        tablesBySchema[schema].forEach((table, index) => {
          console.log(`   ${index + 1}. ${table.table_name} (${table.table_type})`);
        });
      });
      
      console.log(`\n📊 Tổng số bảng: ${tables.length}`);
    }
    
    // Đóng kết nối
    await client.end();
    console.log('\n✅ Đã đóng kết nối database.');
  } catch (error) {
    console.error('❌ Lỗi kết nối database:', error.message);
    process.exit(1);
  }
}

// Chạy kết nối
connectDatabase();
