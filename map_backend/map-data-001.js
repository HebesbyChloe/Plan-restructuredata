require('dotenv').config();
const { Client } = require('pg');
const mysql = require('mysql2/promise');
const { randomUUID } = require('crypto');

// ============================================================================
// Database Connections
// ============================================================================

const pgClient = new Client({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

const mysqlConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_DB_USER,
  password: process.env.MYSQL_DB_PASSWORD,
  database: process.env.MYSQL_DB_NAME,
};

// ============================================================================
// Constants & Data Definitions
// ============================================================================

// Permissions (Global - no tenant dependency)
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

// Tenants
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

// Brands
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

// Stores
// Brand 1 (HEBES): hebes, ebes, offline
// Brand 2 (Ritamie): ritamie, offline
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

// Role definitions
const roleDefinitions = [
  { key: 'admin', name: 'Administrator', is_system: true, is_default: false, priority: 100 },
  { key: 'manager', name: 'Manager', is_system: false, is_default: false, priority: 50 },
  { key: 'editor', name: 'Editor', is_system: false, is_default: true, priority: 30 },
  { key: 'viewer', name: 'Viewer', is_system: false, is_default: false, priority: 10 },
];

// Role mapping from old system to new system
// Old roles: Admin, Leader, Member
// New roles: admin, manager, editor, viewer
const roleMapping = {
  'Admin': 'admin',
  'Leader': 'manager',
  'Member': 'editor',
  'admin': 'admin',
  'leader': 'manager',
  'member': 'editor',
};

// Role permission mapping
const rolePermissionMap = {
  admin: ['order.manage', 'product.manage', 'customer.manage', 'store.manage', 'user.manage', 'tenant.manage'],
  manager: ['order.read', 'order.write', 'product.read', 'product.write', 'customer.read', 'customer.write', 'store.read', 'store.write', 'user.read'],
  editor: ['order.read', 'order.write', 'product.read', 'product.write', 'customer.read', 'customer.write', 'store.read'],
  viewer: ['order.read', 'product.read', 'customer.read', 'store.read'],
};

// ============================================================================
// Helper Functions
// ============================================================================

function generateUUID() {
  return randomUUID();
}

function getTimezoneByLocation(location) {
  const locationUpper = (location || 'VN').toUpperCase().trim();
  if (locationUpper === 'VN' || locationUpper === 'VIETNAM') {
    return 'Asia/Ho_Chi_Minh';
  } else if (locationUpper === 'US' || locationUpper === 'USA' || locationUpper === 'UNITED STATES') {
    return 'America/Los_Angeles';
  }
  return 'Asia/Ho_Chi_Minh';
}

function toUTCString(date) {
  if (!date) return null;
  if (date instanceof Date) {
    return date.toISOString();
  }
  const parsed = new Date(date);
  return isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

// ============================================================================
// Database Functions
// ============================================================================

async function clearNewDatabase() {
  try {
    // Delete in reverse order of dependencies
    // Step 1: Delete order-related tables (they reference sys_stores, sys_users, sys_tenants)
    // Delete child tables of orders first
    await pgClient.query('DELETE FROM item_after_sales');
    await pgClient.query('DELETE FROM item_pre_orders');
    await pgClient.query('DELETE FROM item_customization');
    await pgClient.query('DELETE FROM orders_meta');
    await pgClient.query('DELETE FROM order_meta_crm');
    await pgClient.query('DELETE FROM order_images');
    await pgClient.query('DELETE FROM order_payments');
    // Delete order_items (references orders)
    await pgClient.query('DELETE FROM order_items');
    // Delete orders (references sys_stores, sys_users, sys_tenants)
    await pgClient.query('DELETE FROM orders');
    
    // Step 2: Delete other business tables that might reference system tables
    // (Add more tables here if they have FK to sys_* tables)
    
    // Step 3: Delete system relationship tables
    await pgClient.query('DELETE FROM sys_user_roles');
    await pgClient.query('DELETE FROM sys_role_permissions');
    
    // Step 4: Delete stores and brands BEFORE users (they reference users via created_by, updated_by, manager_user_id)
    await pgClient.query('DELETE FROM sys_stores');
    await pgClient.query('DELETE FROM sys_brands');
    
    // Step 5: Now safe to delete users (no other tables reference them)
    await pgClient.query('DELETE FROM sys_users');
    
    // Step 6: Delete roles and tenants
    await pgClient.query('DELETE FROM sys_roles');
    await pgClient.query('DELETE FROM sys_tenants');
    
    // Step 7: Delete permissions (global, no dependencies)
    await pgClient.query('DELETE FROM sys_permissions');

    // Reset identity sequences
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

// ============================================================================
// Main Migration Function
// ============================================================================

async function seedFakeData() {
  try {
    await pgClient.connect();
    await pgClient.query('BEGIN');

    // Clear existing data first
    await clearNewDatabase();

    // 1. Insert Permissions
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

    // 3. Migrate Users from old database
    const employees = await getEmployeesFromOldDB();
    const userIds = [];
    const userRoleMap = {}; // Map user_id to their role key for later assignment
    const primaryTenantId = tenantIds[0];

    for (const employee of employees) {
      if (!employee.email || employee.email.trim() === '') {
        continue;
      }

      const authUserId = generateUUID();
      const oldRole = (employee.role || '').trim();
      const newRoleKey = roleMapping[oldRole] || 'editor';
      const phone = null;
      const title = oldRole || null;
      const department = employee.team || null;
      const timezone = getTimezoneByLocation(employee.location);
      const locale = employee.location === 'VN' ? 'vi-VN' : 'en-US';
      const is_active = employee.status_work === 'active';
      const oldDateCreated = toUTCString(employee.date_created);
      const oldId = employee.id;

      try {
        // Try to insert with old_id as new_id
        const result = await pgClient.query(
          `INSERT INTO sys_users (id, auth_user_id, email, full_name, phone, title, department, primary_tenant_id, locale, timezone, is_active, metadata) 
           OVERRIDING SYSTEM VALUE
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
           ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, full_name = EXCLUDED.full_name
           RETURNING id`,
          [
            oldId,
            authUserId,
            employee.email.trim(),
            employee.full_name,
            phone,
            title,
            department,
            primaryTenantId,
            locale,
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

        // Update sequence to prevent conflicts
        if (oldId && oldId > 0) {
          await pgClient.query(
            `SELECT setval('sys_users_id_seq', GREATEST($1, (SELECT MAX(id) FROM sys_users)))`,
            [oldId]
          );
        }
      } catch (error) {
        // Fall back to auto-increment if inserting with old_id fails
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
              primaryTenantId,
              locale,
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
          console.error(`Failed to create user ${employee.email}: ${fallbackError.message}`);
        }
      }
    }

    // Update defaultUserId after users are created
    const updatedDefaultUserId = userIds.length > 0 ? userIds[0] : null;

    // 4. Insert Brands
    const brandIds = {};
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
          updatedDefaultUserId
        ]
      );
      brandIds[brand.code] = result.rows[0].id;
    }

    // 5. Insert Stores
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
          updatedDefaultUserId
        ]
      );
    }

    // 6. Insert Roles for each tenant
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

    // 7. Assign Permissions to Roles
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
        }
      }
    }

    // 8. Assign Users to Roles based on their old role
    for (const userId of userIds) {
      const roleKey = userRoleMap[userId] || 'editor';
      const roleId = roleIds[primaryTenantId][roleKey];

      if (roleId) {
        try {
          await pgClient.query(
            `INSERT INTO sys_user_roles (tenant_id, user_id, role_id, assigned_by) 
             VALUES ($1, $2, $3, $4) 
             ON CONFLICT (tenant_id, user_id, role_id) DO NOTHING`,
            [primaryTenantId, userId, roleId, userId]
          );
        } catch (error) {
          console.error(`Failed to assign role ${roleKey} to user ${userId}: ${error.message}`);
        }
      }
    }

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

// ============================================================================
// Execution
// ============================================================================

console.log('🔄 Starting data migration...');
seedFakeData();
