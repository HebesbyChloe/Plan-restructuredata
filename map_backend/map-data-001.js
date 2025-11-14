require('dotenv').config();
const { Client } = require('pg');
const mysql = require('mysql2/promise');
const { randomUUID } = require('crypto');

// Function to clear all data from new database (in correct order to respect foreign keys)
// Reset identity sequences to 0
async function clearNewDatabase() {
  try {
    // Delete in reverse order of dependencies
    await pgClient.query('DELETE FROM sys_user_roles');
    await pgClient.query('DELETE FROM sys_role_permissions');
    await pgClient.query('DELETE FROM sys_users');
    await pgClient.query('DELETE FROM sys_roles');
    await pgClient.query('DELETE FROM sys_stores');
    await pgClient.query('DELETE FROM sys_brands');
    await pgClient.query('DELETE FROM sys_tenants');
    await pgClient.query('DELETE FROM sys_permissions');
    
    // Reset identity sequences to start from 1
    await pgClient.query('ALTER SEQUENCE sys_user_roles_id_seq RESTART WITH 1');
    await pgClient.query('ALTER SEQUENCE sys_users_id_seq RESTART WITH 1');
    await pgClient.query('ALTER SEQUENCE sys_roles_id_seq RESTART WITH 1');
    await pgClient.query('ALTER SEQUENCE sys_stores_id_seq RESTART WITH 1');
    await pgClient.query('ALTER SEQUENCE sys_brands_id_seq RESTART WITH 1');
    await pgClient.query('ALTER SEQUENCE sys_tenants_id_seq RESTART WITH 1');
    await pgClient.query('ALTER SEQUENCE sys_permissions_id_seq RESTART WITH 1');
  } catch (error) {
    throw new Error(`Failed to clear database: ${error.message}`);
  }
}

// Helper function to get timezone based on location
function getTimezoneByLocation(location) {
  const locationUpper = (location || 'VN').toUpperCase().trim();
  if (locationUpper === 'VN' || locationUpper === 'VIETNAM') {
    return 'Asia/Ho_Chi_Minh';
  } else if (locationUpper === 'US' || locationUpper === 'USA' || locationUpper === 'UNITED STATES') {
    return 'America/Los_Angeles';
  }
  // Default to Vietnam timezone
  return 'Asia/Ho_Chi_Minh';
}

// Helper function to convert date to UTC ISO string
function toUTCString(date) {
  if (!date) return null;
  if (date instanceof Date) {
    return date.toISOString();
  }
  // If it's a string, try to parse it
  const parsed = new Date(date);
  return isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

// PostgreSQL connection configuration
const pgClient = new Client({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

// MySQL connection configuration (old database)
const mysqlConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_DB_USER,
  password: process.env.MYSQL_DB_PASSWORD,
  database: process.env.MYSQL_DB_NAME,
};

// Role mapping from old system to new system
const roleMapping = {
  'Admin': 'admin',
  'Leader': 'manager',
  'Member': 'editor',
  // Handle case variations
  'admin': 'admin',
  'leader': 'manager',
  'member': 'editor',
};

// Helper function to generate fake UUID
function generateUUID() {
  return randomUUID();
}

// Helper function to generate random date (returns UTC)
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
}

// Get employees from old MySQL database
async function getEmployeesFromOldDB() {
  let mysqlConnection;
  try {
    mysqlConnection = await mysql.createConnection(mysqlConfig);

    const [rows] = await mysqlConnection.execute(
      `SELECT 
        id,
        email,
        full_name,
        team,
        role,
        status_work,
        date_created,
        location
      FROM db_employee_dashboard
      WHERE email != '' AND full_name != ''
      ORDER BY id`
    );

    await mysqlConnection.end();
    return rows;
  } catch (error) {
    if (mysqlConnection) {
      await mysqlConnection.end();
    }
    throw error;
  }
}

// Seed fake data
async function seedFakeData() {
  try {
    await pgClient.connect();

    // Start transaction
    await pgClient.query('BEGIN');

    // Clear existing data first
    await clearNewDatabase();

    // 1. Insert Permissions (Global - no tenant dependency)
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
      const result = await pgClient.query(
        `INSERT INTO sys_permissions (key, name, description, resource, action) 
         VALUES ($1, $2, $3, $4, $5) 
         ON CONFLICT (key) DO UPDATE SET name = EXCLUDED.name
         RETURNING id`,
        [perm.key, perm.name, `Permission to ${perm.action} ${perm.resource}`, perm.resource, perm.action]
      );
      permissionIds[perm.key] = result.rows[0].id;
    }

    // 2. Insert Tenants
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
      const result = await pgClient.query(
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
    }

    // 3. Get employees from old database and insert users
    const employees = await getEmployeesFromOldDB();
    const userIds = [];
    const userRoleMap = {}; // Map user_id to their old role for later assignment

    for (const employee of employees) {
      // Skip if email is empty
      if (!employee.email || employee.email.trim() === '') {
        continue;
      }

      // Generate fake UUID for auth_user_id (Note: This won't exist in auth.users table)
      // In production, you should create actual auth users first
      const authUserId = generateUUID();
      
      // Map old role to new role key
      const oldRole = (employee.role || '').trim();
      const newRoleKey = roleMapping[oldRole] || 'editor'; // Default to viewer if role not found
      
      // Phone is null (not in old database schema)
      const phone = null;
      
      // Map fields: title = role, department = team
      const title = oldRole || null;
      const department = employee.team || null;

      // Get timezone based on location
      const timezone = getTimezoneByLocation(employee.location);
      let slug_zone = 'en-US';
      if (employee.location == 'VN') {
        slug_zone = 'vi-VN';
      } 

      // Map status_work to is_active: 'active' = true, others = false
      const is_active = employee.status_work == 'active';
      
      // Convert date_created to UTC ISO string
      const oldDateCreated = toUTCString(employee.date_created);
      
      // Use old_id as new_id if possible (map id cũ = id mới)
      const oldId = employee.id;
      
      try {
        // Try to insert with specific ID (old_id = new_id)
        // Use OVERRIDING SYSTEM VALUE to insert with custom ID
        const result = await pgClient.query(
          `INSERT INTO sys_users (id, auth_user_id, email, full_name, phone, title, department, primary_tenant_id, locale, timezone, is_active, metadata) 
           OVERRIDING SYSTEM VALUE
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
           ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, full_name = EXCLUDED.full_name
           RETURNING id`,
          [
            oldId, // Use old_id as new_id
            authUserId,
            employee.email.trim(),
            employee.full_name,
            phone,
            title,
            department,
            tenantIds[0], // All users belong to first tenant (DFC Flow)
            slug_zone,
            timezone,
            is_active,
            JSON.stringify({ 
              source: 'migrated_from_old_db',
              old_id: employee.id,
              old_location: employee.location || 'VN',
              old_date_created: oldDateCreated
            }),
          ]
        );
        const userId = result.rows[0].id;
        userIds.push(userId);
        userRoleMap[userId] = newRoleKey; // Store role mapping for later
        
        // Update sequence to be at least at oldId + 1 to avoid conflicts
        if (oldId && oldId > 0) {
          await pgClient.query(`SELECT setval('sys_users_id_seq', GREATEST($1, (SELECT MAX(id) FROM sys_users)))`, [oldId]);
        }
      } catch (error) {
        // If inserting with old_id fails (e.g., ID already exists or constraint violation), fall back to auto-increment
        try {
          const result = await pgClient.query(
            `INSERT INTO sys_users (auth_user_id, email, full_name, phone, title, department, primary_tenant_id, locale, timezone, is_active, metadata) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
             ON CONFLICT (auth_user_id) DO UPDATE SET email = EXCLUDED.email, full_name = EXCLUDED.full_name
             RETURNING id`,
            [
              authUserId,
              employee.email.trim(),
              employee.full_name,
              phone,
              title,
              department,
              tenantIds[0],
              slug_zone,
              timezone,
              is_active,
              JSON.stringify({ 
                source: 'migrated_from_old_db',
                old_id: employee.id,
                old_location: employee.location || 'VN',
                old_date_created: oldDateCreated
              }),
            ]
          );
          const userId = result.rows[0].id;
          userIds.push(userId);
          userRoleMap[userId] = newRoleKey;
        } catch (fallbackError) {
          console.error(`   ⚠️  Failed to create user ${employee.email}: ${fallbackError.message}`);
        }
      }
    }

    // 3.5. Insert Brands for each tenant (after users are created)
    const brands = [
      {
        code: 'HEBES',
        name: 'Hebes',
        description: 'Premium jewelry brand specializing in high-quality pieces',
        status: 'active',
        website_url: 'https://hebesbychloe.com',
        metadata: { category: 'jewelry', target_audience: 'premium' }
      },
      {
        code: 'Ritamie',
        name: 'Ritamie',
        description: 'Contemporary jewelry brand for modern customers',
        status: 'active',
        website_url: 'https://ritamie.com',
        metadata: { category: 'jewelry', target_audience: 'contemporary' }
      }
    ];

    const brandIds = {};
    const primaryTenantId = tenantIds[0];
    const defaultUserId = userIds.length > 0 ? userIds[0] : null;

    for (const brand of brands) {
      const result = await pgClient.query(
        `INSERT INTO sys_brands (tenant_id, code, name, description, status, website_url, metadata, created_by) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
         ON CONFLICT (tenant_id, code) DO UPDATE SET name = EXCLUDED.name, status = EXCLUDED.status
         RETURNING id`,
        [
          primaryTenantId,
          brand.code,
          brand.name,
          brand.description,
          brand.status,
          brand.website_url,
          JSON.stringify(brand.metadata),
          defaultUserId
        ]
      );
      brandIds[brand.code] = result.rows[0].id;
    }

    // 3.6. Insert Stores for each brand
    // Brand 1 (HEBES) có store: hebes, ebes, offline
    // Brand 2 (Ritamie) có store: ritamie, offline
    const stores = [
      // Brand HEBES stores
      {
        brand_code: 'HEBES',
        code: 'hebes',
        name: 'Hebes',
        description: 'Hebes online store',
        address_line1: null,
        city: null,
        country: null,
        postal_code: null,
        phone: null,
        email: null,
        status: 'active',
        is_headquarters: false,
        timezone: 'Asia/Ho_Chi_Minh'
      },
      {
        brand_code: 'HEBES',
        code: 'ebes',
        name: 'Ebes',
        description: 'Ebes online store',
        address_line1: null,
        city: null,
        country: null,
        postal_code: null,
        phone: null,
        email: null,
        status: 'active',
        is_headquarters: false,
        timezone: 'Asia/Ho_Chi_Minh'
      },
      {
        brand_code: 'HEBES',
        code: 'offline',
        name: 'Offline Store',
        description: 'Offline retail store for Hebes brand',
        address_line1: '123 Jewelry Street',
        city: 'Ho Chi Minh City',
        country: 'Vietnam',
        postal_code: '70000',
        phone: '+84 28 1234 5678',
        email: 'offline@hebesbychloe.com',
        status: 'active',
        is_headquarters: true,
        timezone: 'Asia/Ho_Chi_Minh'
      },
      // Brand Ritamie stores
      {
        brand_code: 'Ritamie',
        code: 'ritamie',
        name: 'Ritamie',
        description: 'Ritamie online store',
        address_line1: null,
        city: null,
        country: null,
        postal_code: null,
        phone: null,
        email: null,
        status: 'active',
        is_headquarters: false,
        timezone: 'Asia/Ho_Chi_Minh'
      },
      {
        brand_code: 'Ritamie',
        code: 'offline',
        name: 'Offline Store',
        description: 'Offline retail store for Ritamie brand',
        address_line1: '321 Fashion Avenue',
        city: 'Ho Chi Minh City',
        country: 'Vietnam',
        postal_code: '70000',
        phone: '+84 28 3456 7890',
        email: 'offline@ritamie.com',
        status: 'active',
        is_headquarters: true,
        timezone: 'Asia/Ho_Chi_Minh'
      }
    ];

    for (const store of stores) {
      const brandId = brandIds[store.brand_code];
      if (!brandId) continue;

      await pgClient.query(
        `INSERT INTO sys_stores (
          brand_id, code, name, description, 
          address_line1, city, state, country, postal_code, 
          phone, email, status, is_headquarters, timezone, created_by
        ) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) 
         ON CONFLICT (brand_id, code) DO UPDATE SET name = EXCLUDED.name, status = EXCLUDED.status`,
        [
          brandId,
          store.code,
          store.name,
          store.description,
          store.address_line1,
          store.city,
          store.state || null,
          store.country,
          store.postal_code,
          store.phone,
          store.email,
          store.status,
          store.is_headquarters,
          store.timezone,
          defaultUserId
        ]
      );
    }

    // 4. Insert Roles for each tenant
    // ở hệ thống bảng cũ `db_employee_dashboard` đang có role Admin, Leader, Member bạn hãy map chúng qua data mới giúp tôi theo admin, manager, editor, viewer
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
        const result = await pgClient.query(
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

    // 5. Assign Permissions to Roles
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
          await pgClient.query(
            `INSERT INTO sys_role_permissions (role_id, permission_id) 
             VALUES ($1, $2) 
             ON CONFLICT (role_id, permission_id) DO NOTHING`,
            [roleId, permId]
          );
          permissionCount++;
        }
      }
    }

    // 6. Assign Users to Roles based on their old role
    let assignmentCount = 0;

    for (const userId of userIds) {
      const roleKey = userRoleMap[userId] || 'editor'; // Default to editor if not found
      const roleId = roleIds[primaryTenantId][roleKey];
      
      if (roleId) {
        try {
          await pgClient.query(
            `INSERT INTO sys_user_roles (tenant_id, user_id, role_id, assigned_by) 
             VALUES ($1, $2, $3, $4) 
             ON CONFLICT (tenant_id, user_id, role_id) DO NOTHING`,
            [primaryTenantId, userId, roleId, userId] // User assigns themselves
          );
          assignmentCount++;
        } catch (error) {
          console.error(`Failed to assign role ${roleKey} to user ${userId}: ${error.message}`);
        }
      }
    }

    // Commit transaction
    await pgClient.query('COMMIT');

    await pgClient.end();
  } catch (error) {
    await pgClient.query('ROLLBACK');
    console.error('❌ Error seeding data:', error.message);
    console.error('   Stack:', error.stack);
    await pgClient.end();
    process.exit(1);
  }
}

console.log('🔄 Starting data migration...');
// Run seed
seedFakeData();

