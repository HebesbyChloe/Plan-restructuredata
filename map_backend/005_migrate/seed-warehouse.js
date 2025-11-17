const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { Client } = require('pg');

// PostgreSQL connection configuration
const client = new Client({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

// Seed warehouses
async function seedWarehouses() {
  try {
    console.log('🔌 Connecting to PostgreSQL database...');
    await client.connect();
    console.log('✅ Database connection successful!\n');

    // Start transaction
    await client.query('BEGIN');

    console.log('📝 Inserting warehouses...\n');

    const warehouses = [
      {
        code: 'US',
        name: 'United States Warehouse',
        address: null,
        city: null,
        country: 'USA',
        phone: null,
        email: null,
        status: 'active'
      },
      {
        code: 'VN',
        name: 'Vietnam Warehouse',
        address: null,
        city: null,
        country: 'Vietnam',
        phone: null,
        email: null,
        status: 'active'
      }
    ];

    const inserted = [];

    for (const warehouse of warehouses) {
      try {
        const result = await client.query(
          `INSERT INTO warehouse (code, name, address, city, country, phone, email, status) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
           ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, country = EXCLUDED.country
           RETURNING id, code, name, country`,
          [
            warehouse.code,
            warehouse.name,
            warehouse.address,
            warehouse.city,
            warehouse.country,
            warehouse.phone,
            warehouse.email,
            warehouse.status
          ]
        );

        const insertedWarehouse = result.rows[0];
        inserted.push(insertedWarehouse);
        console.log(`   ✅ Inserted: ${insertedWarehouse.code} - ${insertedWarehouse.name} (ID: ${insertedWarehouse.id})`);
      } catch (error) {
        console.error(`   ❌ Error inserting warehouse ${warehouse.code}: ${error.message}`);
        throw error;
      }
    }

    // Commit transaction
    await client.query('COMMIT');
    console.log('\n✅ Transaction committed successfully!\n');

    // Summary
    console.log('📊 Summary:');
    console.log(`   • Inserted ${inserted.length} warehouses`);
    inserted.forEach(w => {
      console.log(`     - ${w.code}: ${w.name} (${w.country})`);
    });

    await client.end();
    console.log('\n✅ Seeding completed!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Seeding error:', error.message);
    console.error('   Stack:', error.stack);
    await client.end();
    process.exit(1);
  }
}

// Run seeding
seedWarehouses();

