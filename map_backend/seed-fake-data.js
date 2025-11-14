require('dotenv').config();
const { Client } = require('pg');
const { randomUUID } = require('crypto');

// PostgreSQL connection configuration
const client = new Client({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

// Helper function to generate fake UUID
function generateUUID() {
  return randomUUID();
}

// Helper function to generate random date
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Seed fake data
async function seedFakeData() {
  try {
    console.log('🔌 Connecting to PostgreSQL database...');
    await client.connect();
    console.log('✅ Database connection successful!\n');

    // Start transaction
    await client.query('BEGIN');

    console.log('🌱 Starting to seed fake data...\n');

    // 1. Insert Permissions (Global - no tenant dependency)
    console.log('📝 Inserting permissions...');
    const permissions = [
      { key: 'order.read', name: 'Read Orders', resource: 'orders', action: 'read' },
      { key: 'order.write', name: 'Write Orders', resource: 'orders', action: 'write' },
      { key: 'order.delete', name: 'Delete Orders', resource: 'orders', action: 'delete' },
      { key: 'order.manage', name: 'Manage Orders', resource: 'orders', action: 'manage' },
      { key: 'product.read', name: 'Read Products', resource: 'products', action: 'read' },
      { key: 'product.write', name: 'Write Products', resource: 'products', action: 'write' },
      { key: 'product.delete', name: 'Delete Products', resource: 'products', action: 'delete' },
      { key: 'product.manage', name: 'Manage Products', resource: 'products', action: 'manage' },
      { key: 'customer.read', name: 'Read Customers', resource: 'customers', action: 'read' },
      { key: 'customer.write', name: 'Write Customers', resource: 'customers', action: 'write' },
      { key: 'customer.delete', name: 'Delete Customers', resource: 'customers', action: 'delete' },
      { key: 'customer.manage', name: 'Manage Customers', resource: 'customers', action: 'manage' },
      { key: 'store.read', name: 'Read Stores', resource: 'stores', action: 'read' },
      { key: 'store.write', name: 'Write Stores', resource: 'stores', action: 'write' },
      { key: 'store.manage', name: 'Manage Stores', resource: 'stores', action: 'manage' },
      { key: 'user.read', name: 'Read Users', resource: 'users', action: 'read' },
      { key: 'user.write', name: 'Write Users', resource: 'users', action: 'write' },
      { key: 'user.manage', name: 'Manage Users', resource: 'users', action: 'manage' },
      { key: 'tenant.read', name: 'Read Tenants', resource: 'tenants', action: 'read' },
      { key: 'tenant.write', name: 'Write Tenants', resource: 'tenants', action: 'write' },
      { key: 'tenant.manage', name: 'Manage Tenants', resource: 'tenants', action: 'manage' },
    ];

    const permissionIds = {};
    for (const perm of permissions) {
      const result = await client.query(
        `INSERT INTO sys_permissions (key, name, description, resource, action) 
         VALUES ($1, $2, $3, $4, $5) 
         ON CONFLICT (key) DO UPDATE SET name = EXCLUDED.name
         RETURNING id`,
        [perm.key, perm.name, `Permission to ${perm.action} ${perm.resource}`, perm.resource, perm.action]
      );
      permissionIds[perm.key] = result.rows[0].id;
    }
    console.log(`   ✅ Inserted ${permissions.length} permissions\n`);

    // 2. Insert Tenants
    console.log('🏢 Inserting tenants...');
    const tenants = [
      {
        name: 'DFC Flow',
        slug: 'dfc-flow',
        status: 'active',
        billing_plan: 'enterprise',
        timezone: 'America/New_York',
        locale: 'en-US',
        domain: 'https://admin.dfcflow.com/',
        is_personal: false,
      }
    ];

    const tenantIds = [];
    for (const tenant of tenants) {
      const result = await client.query(
        `INSERT INTO sys_tenants (name, slug, status, billing_plan, timezone, locale, domain, is_personal, metadata) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
         ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
         RETURNING id`,
        [
          tenant.name,
          tenant.slug,
          tenant.status,
          tenant.billing_plan,
          tenant.timezone,
          tenant.locale,
          tenant.domain,
          tenant.is_personal,
          JSON.stringify({ company_size: 'medium', industry: 'retail' }),
        ]
      );
      tenantIds.push(result.rows[0].id);
      console.log(`   ✅ Created tenant: ${tenant.name} (ID: ${result.rows[0].id})`);
    }
    console.log(`\n   ✅ Inserted ${tenants.length} tenants\n`);

    // 3. Insert Users
    console.log('👥 Inserting users...');
    //này phải lấy từ old database 
    // CREATE TABLE `db_employee_dashboard` (
    //     `id` int(11) NOT NULL AUTO_INCREMENT,
    //     `order_schedule` int(11) NOT NULL DEFAULT 99,
    //     `email` varchar(300) NOT NULL DEFAULT '',
    //     `full_name` varchar(256) NOT NULL DEFAULT '',
    //     `team` varchar(256) NOT NULL DEFAULT '',
    //     `role` varchar(256) NOT NULL DEFAULT '',
    //     `status_work` varchar(100) NOT NULL DEFAULT 'active',
    //     `date_created` datetime NOT NULL DEFAULT current_timestamp(),
    //     `motivational_quote_today` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
    //     `location` varchar(256) NOT NULL DEFAULT 'VN',
    //     PRIMARY KEY (`id`)
    //   ) ENGINE=InnoDB AUTO_INCREMENT=1590 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
      //phone = 0 || null hết
      //
    const users = [
      {
        email: 'john.doe@acme.com',
        full_name: 'John Doe',
        phone: '+1-555-0101',
        title: 'CEO',
        department: 'Executive',
        primary_tenant_id: tenantIds[0],
      },
      {
        email: 'jane.smith@acme.com',
        full_name: 'Jane Smith',
        phone: '+1-555-0102',
        title: 'CTO',
        department: 'Technology',
        primary_tenant_id: tenantIds[0],
      },
      {
        email: 'bob.johnson@techstart.io',
        full_name: 'Bob Johnson',
        phone: '+1-555-0201',
        title: 'Founder',
        department: 'Executive',
        primary_tenant_id: tenantIds[1],
      },
      {
        email: 'alice.williams@techstart.io',
        full_name: 'Alice Williams',
        phone: '+1-555-0202',
        title: 'Product Manager',
        department: 'Product',
        primary_tenant_id: tenantIds[1],
      },
      {
        email: 'charlie.brown@globalretail.com',
        full_name: 'Charlie Brown',
        phone: '+1-555-0301',
        title: 'Operations Director',
        department: 'Operations',
        primary_tenant_id: tenantIds[2],
      },
    ];

    const userIds = [];
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      // Generate fake UUID for auth_user_id (Note: This won't exist in auth.users table)
      // In production, you should create actual auth users first
      const authUserId = generateUUID();
      
      const result = await client.query(
        `INSERT INTO sys_users (auth_user_id, email, full_name, phone, title, department, primary_tenant_id, locale, timezone, metadata) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
         ON CONFLICT (auth_user_id) DO UPDATE SET email = EXCLUDED.email
         RETURNING id`,
        [
          authUserId,
          user.email,
          user.full_name,
          user.phone,
          user.title,
          user.department,
          user.primary_tenant_id,
          'en-US',
          'America/New_York',
          JSON.stringify({ source: 'seed_data' }),
        ]
      );
      userIds.push(result.rows[0].id);
      console.log(`   ✅ Created user: ${user.full_name} (ID: ${result.rows[0].id})`);
    }
    console.log(`\n   ✅ Inserted ${users.length} users\n`);

    // Set manager relationships
    console.log('🔗 Setting manager relationships...');
    await client.query(
      `UPDATE sys_users SET manager_user_id = $1 WHERE id = $2`,
      [userIds[0], userIds[1]] // Jane reports to John
    );
    await client.query(
      `UPDATE sys_users SET manager_user_id = $1 WHERE id = $2`,
      [userIds[2], userIds[3]] // Alice reports to Bob
    );
    console.log('   ✅ Manager relationships set\n');

    // 4. Insert Roles for each tenant
    console.log('🎭 Inserting roles...');
    const roleDefinitions = [
      { key: 'admin', name: 'Administrator', is_system: true, is_default: false, priority: 100 },
      { key: 'manager', name: 'Manager', is_system: false, is_default: false, priority: 50 },
      { key: 'editor', name: 'Editor', is_system: false, is_default: true, priority: 30 },
      { key: 'viewer', name: 'Viewer', is_system: false, is_default: false, priority: 10 },
    ];

    const roleIds = {};
    for (const tenantId of tenantIds) {
      roleIds[tenantId] = {};
      for (const roleDef of roleDefinitions) {
        const result = await client.query(
          `INSERT INTO sys_roles (tenant_id, key, name, description, is_system, is_default, priority, metadata) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
           ON CONFLICT (tenant_id, key) DO UPDATE SET name = EXCLUDED.name
           RETURNING id`,
          [
            tenantId,
            roleDef.key,
            roleDef.name,
            `Role: ${roleDef.name}`,
            roleDef.is_system,
            roleDef.is_default,
            roleDef.priority,
            JSON.stringify({ created_by: 'seed_script' }),
          ]
        );
        roleIds[tenantId][roleDef.key] = result.rows[0].id;
      }
    }
    console.log(`   ✅ Inserted roles for ${tenantIds.length} tenants\n`);

    // 5. Assign Permissions to Roles
    console.log('🔐 Assigning permissions to roles...');
    const rolePermissionMap = {
      admin: ['order.manage', 'product.manage', 'customer.manage', 'store.manage', 'user.manage', 'tenant.manage'],
      manager: ['order.read', 'order.write', 'product.read', 'product.write', 'customer.read', 'customer.write', 'store.read', 'store.write', 'user.read'],
      editor: ['order.read', 'order.write', 'product.read', 'product.write', 'customer.read', 'customer.write', 'store.read'],
      viewer: ['order.read', 'product.read', 'customer.read', 'store.read'],
    };

    let permissionCount = 0;
    for (const tenantId of tenantIds) {
      for (const [roleKey, permissionKeys] of Object.entries(rolePermissionMap)) {
        const roleId = roleIds[tenantId][roleKey];
        for (const permKey of permissionKeys) {
          const permId = permissionIds[permKey];
          await client.query(
            `INSERT INTO sys_role_permissions (role_id, permission_id) 
             VALUES ($1, $2) 
             ON CONFLICT (role_id, permission_id) DO NOTHING`,
            [roleId, permId]
          );
          permissionCount++;
        }
      }
    }
    console.log(`   ✅ Assigned ${permissionCount} role-permission relationships\n`);

    // 6. Assign Users to Roles
    console.log('👤 Assigning users to roles...');
    const userRoleAssignments = [
      { userId: userIds[0], tenantId: tenantIds[0], roleKey: 'admin' }, // John - Admin of Acme
      { userId: userIds[1], tenantId: tenantIds[0], roleKey: 'manager' }, // Jane - Manager of Acme
      { userId: userIds[2], tenantId: tenantIds[1], roleKey: 'admin' }, // Bob - Admin of TechStart
      { userId: userIds[3], tenantId: tenantIds[1], roleKey: 'editor' }, // Alice - Editor of TechStart
      { userId: userIds[4], tenantId: tenantIds[2], roleKey: 'manager' }, // Charlie - Manager of Global Retail
    ];

    for (const assignment of userRoleAssignments) {
      const roleId = roleIds[assignment.tenantId][assignment.roleKey];
      await client.query(
        `INSERT INTO sys_user_roles (tenant_id, user_id, role_id, assigned_by) 
         VALUES ($1, $2, $3, $4) 
         ON CONFLICT (tenant_id, user_id, role_id) DO NOTHING`,
        [assignment.tenantId, assignment.userId, roleId, assignment.userId]
      );
    }
    console.log(`   ✅ Assigned ${userRoleAssignments.length} user-role relationships\n`);

    // 7. Insert Stores
    console.log('🏪 Inserting stores...');
    const stores = [
      {
        tenant_id: tenantIds[0],
        code: 'ACME-HQ',
        name: 'Acme Headquarters',
        description: 'Main headquarters store',
        address_line1: '123 Main Street',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        postal_code: '10001',
        phone: '+1-555-1001',
        email: 'hq@acme.com',
        status: 'active',
        is_headquarters: true,
        manager_user_id: userIds[0],
        opening_date: '2020-01-15',
        timezone: 'America/New_York',
        created_by: userIds[0],
      },
      {
        tenant_id: tenantIds[0],
        code: 'ACME-BRANCH-01',
        name: 'Acme Downtown Branch',
        description: 'Downtown location',
        address_line1: '456 Broadway',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        postal_code: '10002',
        phone: '+1-555-1002',
        email: 'downtown@acme.com',
        status: 'active',
        is_headquarters: false,
        manager_user_id: userIds[1],
        opening_date: '2021-03-20',
        timezone: 'America/New_York',
        created_by: userIds[0],
      },
      {
        tenant_id: tenantIds[1],
        code: 'TECH-HQ',
        name: 'TechStart Main Office',
        description: 'Primary office location',
        address_line1: '789 Silicon Valley Blvd',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        postal_code: '94105',
        phone: '+1-555-2001',
        email: 'office@techstart.io',
        status: 'active',
        is_headquarters: true,
        manager_user_id: userIds[2],
        opening_date: '2019-06-10',
        timezone: 'America/Los_Angeles',
        created_by: userIds[2],
      },
      {
        tenant_id: tenantIds[2],
        code: 'GRG-LONDON',
        name: 'Global Retail London Store',
        description: 'London flagship store',
        address_line1: '10 Oxford Street',
        city: 'London',
        state: null,
        country: 'UK',
        postal_code: 'W1D 1BS',
        phone: '+44-20-7123-4567',
        email: 'london@globalretail.com',
        status: 'active',
        is_headquarters: true,
        manager_user_id: userIds[4],
        opening_date: '2018-09-01',
        timezone: 'Europe/London',
        created_by: userIds[4],
      },
    ];

    for (const store of stores) {
      const result = await client.query(
        `INSERT INTO stores (
          tenant_id, code, name, description, address_line1, city, state, country, 
          postal_code, phone, email, status, is_headquarters, manager_user_id, 
          opening_date, timezone, created_by, metadata
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        ON CONFLICT (tenant_id, code) DO UPDATE SET name = EXCLUDED.name
        RETURNING id`,
        [
          store.tenant_id,
          store.code,
          store.name,
          store.description,
          store.address_line1,
          store.city,
          store.state,
          store.country,
          store.postal_code,
          store.phone,
          store.email,
          store.status,
          store.is_headquarters,
          store.manager_user_id,
          store.opening_date,
          store.timezone,
          store.created_by,
          JSON.stringify({ floor_area: '5000 sqft', capacity: 100 }),
        ]
      );
      console.log(`   ✅ Created store: ${store.name} (ID: ${result.rows[0].id})`);
    }
    console.log(`\n   ✅ Inserted ${stores.length} stores\n`);

    // Commit transaction
    await client.query('COMMIT');
    console.log('✅ All fake data seeded successfully!\n');

    // Summary
    console.log('📊 Summary:');
    console.log(`   • ${permissions.length} permissions`);
    console.log(`   • ${tenants.length} tenants`);
    console.log(`   • ${users.length} users`);
    console.log(`   • ${roleDefinitions.length} roles per tenant (${roleDefinitions.length * tenants.length} total)`);
    console.log(`   • ${permissionCount} role-permission assignments`);
    console.log(`   • ${userRoleAssignments.length} user-role assignments`);
    console.log(`   • ${stores.length} stores`);

    await client.end();
    console.log('\n✅ Database connection closed.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error seeding data:', error.message);
    console.error('   Stack:', error.stack);
    await client.end();
    process.exit(1);
  }
}

// Run seed
seedFakeData();

