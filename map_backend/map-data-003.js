require('dotenv').config();
const { Client } = require('pg');
const mysql = require('mysql2/promise');

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

// Helper function to parse birth date
function parseBirthDate(birth, birthMonthDay, birthYear) {
  if (birth && birth !== '0001-01-01' && birth !== '1970-01-01' && birth !== '0000-00-00') {
    const parsed = new Date(birth);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString().split('T')[0]; // Return YYYY-MM-DD
    }
  }
  // Try to construct from birth_month_day and birth_year
  if (birthMonthDay && birthYear) {
    const [month, day] = birthMonthDay.split('-');
    if (month && day && birthYear) {
      try {
        const date = new Date(`${birthYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
        if (!isNaN(date.getTime())) {
          return date.toISOString().split('T')[0];
        }
      } catch (e) {
        // Ignore
      }
    }
  }
  return null;
}

// Function to clear CRM data
async function clearCRMData() {
  try {
    // Delete in reverse order of dependencies
    await pgClient.query('DELETE FROM crm_reengage_batches_stats');
    await pgClient.query('DELETE FROM crm_reengage_personal_keys');
    await pgClient.query('DELETE FROM crm_reengaged_batches');
    await pgClient.query('DELETE FROM crm_potential');
    await pgClient.query('DELETE FROM crm_customers');
    await pgClient.query('DELETE FROM crm_leads');
    await pgClient.query('DELETE FROM crm_personal_journey');
    await pgClient.query('DELETE FROM crm_personal_profile');
    await pgClient.query('DELETE FROM crm_personal_addresses');
    await pgClient.query('DELETE FROM crm_personal_contacts');
    await pgClient.query('DELETE FROM crm_personal_keys');
    
    // Reset identity sequences
    await pgClient.query('ALTER SEQUENCE crm_reengage_batches_stats_id_seq RESTART WITH 1');
    await pgClient.query('ALTER SEQUENCE crm_reengage_personal_keys_id_seq RESTART WITH 1');
    await pgClient.query('ALTER SEQUENCE crm_reengaged_batches_id_seq RESTART WITH 1');
    await pgClient.query('ALTER SEQUENCE crm_potential_id_seq RESTART WITH 1');
    await pgClient.query('ALTER SEQUENCE crm_customers_id_seq RESTART WITH 1');
    await pgClient.query('ALTER SEQUENCE crm_leads_id_seq RESTART WITH 1');
    await pgClient.query('ALTER SEQUENCE crm_personal_journey_id_seq RESTART WITH 1');
    await pgClient.query('ALTER SEQUENCE crm_personal_profile_id_seq RESTART WITH 1');
    await pgClient.query('ALTER SEQUENCE crm_personal_addresses_id_seq RESTART WITH 1');
    await pgClient.query('ALTER SEQUENCE crm_personal_contacts_id_seq RESTART WITH 1');
    await pgClient.query('ALTER SEQUENCE crm_personal_keys_id_seq RESTART WITH 1');
  } catch (error) {
    throw new Error(`Failed to clear CRM data: ${error.message}`);
  }
}

// Get customers from old MySQL database
async function getCustomersFromOldDB() {
  let mysqlConnection;
  try {
    mysqlConnection = await mysql.createConnection(mysqlConfig);

    // Get 100 customers who have purchased (qty_paid > 0)
    const [customersWithOrders] = await mysqlConnection.execute(
      `SELECT 
        id,
        full_name,
        email,
        phone,
        id_lead,
        address,
        city,
        country,
        post_code,
        total,
        qty_paid,
        five_element,
        infor_customer,
        intention,
        note,
        birth,
        birth_month_day,
        birth_year,
        link_profile,
        date_created,
        source,
        rank,
        last_time_order,
        status_lead_contact,
        status_potential,
        current_amount,
        last_summary,
        emotion,
        next_action,
        journey_stage
      FROM db_customer
      WHERE email != '' AND rank = 'VIP Cus' 
      ORDER BY id
      LIMIT 100`
    );

    // Get 20 leads who haven't purchased (qty_paid = 0)
    const [leadsWithoutOrders] = await mysqlConnection.execute(
      `SELECT 
        id,
        full_name,
        email,
        phone,
        id_lead,
        address,
        city,
        country,
        post_code,
        total,
        qty_paid,
        five_element,
        infor_customer,
        intention,
        note,
        birth,
        birth_month_day,
        birth_year,
        link_profile,
        date_created,
        source,
        rank,
        last_time_order,
        status_lead_contact,
        status_potential,
        current_amount,
        last_summary,
        emotion,
        next_action,
        journey_stage
      FROM db_customer
      WHERE email != '' AND qty_paid = 0
      ORDER BY id
      LIMIT 20`
    );

    await mysqlConnection.end();
    return {
      customers: customersWithOrders,
      leads: leadsWithoutOrders
    };
  } catch (error) {
    if (mysqlConnection) {
      await mysqlConnection.end();
    }
    throw error;
  }
}

// Seed CRM data
async function seedCRMData() {
  try {
    await pgClient.connect();

    // Start transaction
    await pgClient.query('BEGIN');

    // Clear existing data first
    await clearCRMData();

    // Get tenant ID
    const tenantResult = await pgClient.query(
      `SELECT id FROM sys_tenants WHERE slug = 'dfc-flow' LIMIT 1`
    );

    if (tenantResult.rows.length === 0) {
      throw new Error('Tenant "dfc-flow" not found. Please run map-data-001.js first.');
    }

    const tenantId = tenantResult.rows[0].id;

    // Get a random user for assigned_to fields
    const userResult = await pgClient.query(
      `SELECT id FROM sys_users WHERE is_active = true LIMIT 1`
    );
    const defaultUserId = userResult.rows.length > 0 ? userResult.rows[0].id : null;

    // Get customers and leads from old database
    const { customers, leads } = await getCustomersFromOldDB();

    // Process customers (qty_paid > 0)
    for (const oldCustomer of customers) {
      try {
        // 1. Create personal_key
        const externalKey = oldCustomer.email || `old_customer_${oldCustomer.id}`;
        const personalKeyResult = await pgClient.query(
          `INSERT INTO crm_personal_keys (external_key) 
           VALUES ($1) 
           ON CONFLICT (external_key) DO UPDATE SET external_key = EXCLUDED.external_key
           RETURNING id`,
          [externalKey]
        );
        const personalKeyId = personalKeyResult.rows[0].id;

        // 2. Create contacts (email and phone)
        if (oldCustomer.email && oldCustomer.email.trim() !== '') {
          await pgClient.query(
            `INSERT INTO crm_personal_contacts (personal_key_id, contact_type, contact_value, is_primary, is_verified) 
             VALUES ($1, $2, $3, $4, $5)`,
            [personalKeyId, 'email', oldCustomer.email.trim(), true, !oldCustomer.error_email]
          );
        }

        if (oldCustomer.phone && oldCustomer.phone.trim() !== '' && oldCustomer.phone !== '0') {
          await pgClient.query(
            `INSERT INTO crm_personal_contacts (personal_key_id, contact_type, contact_value, is_primary, is_verified) 
             VALUES ($1, $2, $3, $4, $5)`,
            [personalKeyId, 'phone', oldCustomer.phone.trim(), false, !oldCustomer.error_phone]
          );
        }

        // 3. Create address
        if (oldCustomer.address || oldCustomer.city || oldCustomer.country) {
          await pgClient.query(
            `INSERT INTO crm_personal_addresses (personal_key_id, type, address_line1, city, country, postal_code, is_default) 
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              personalKeyId,
              'primary',
              oldCustomer.address || null,
              oldCustomer.city || null,
              oldCustomer.country || null,
              oldCustomer.post_code || null,
              true
            ]
          );
        }

        // 4. Create profile
        const birthDate = parseBirthDate(oldCustomer.birth, oldCustomer.birth_month_day, oldCustomer.birth_year);
        const customAttributes = {};
        if (oldCustomer.infor_customer) {
          customAttributes.infor_customer = oldCustomer.infor_customer;
        }
        if (oldCustomer.future_sales_opportunities) {
          customAttributes.future_sales_opportunities = oldCustomer.future_sales_opportunities;
        }
        if (oldCustomer.link_profile) {
          customAttributes.link_profile = oldCustomer.link_profile;
        }
        if (oldCustomer.link_pancake) {
          customAttributes.link_pancake = oldCustomer.link_pancake;
        }

        await pgClient.query(
          `INSERT INTO crm_personal_profile (personal_key_id, birth_date, custom_attributes, notes, display_name, five_element, intention) 
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            personalKeyId,
            birthDate,
            Object.keys(customAttributes).length > 0 ? JSON.stringify(customAttributes) : null,
            oldCustomer.note || null,
            oldCustomer.full_name || null,
            oldCustomer.five_element || null,
            oldCustomer.intention || null
          ]
        );

        // 5. Create customer record
        const lastOrderAt = toUTCString(oldCustomer.last_time_order);
        const customerResult = await pgClient.query(
          `INSERT INTO crm_customers (
            personal_key_id, 
            lifetime_value, 
            paid_orders_count, 
            lead_status, 
            potential_status, 
            source, 
            customer_rank, 
            last_order_at, 
            tenant_id
          ) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
           RETURNING id`,
          [
            personalKeyId,
            oldCustomer.total || 0,
            oldCustomer.qty_paid || 0,
            oldCustomer.status_lead_contact || null,
            oldCustomer.status_potential || null,
            oldCustomer.source || 'phone',
            oldCustomer.rank || 'New Customer',
            lastOrderAt,
            tenantId
          ]
        );

        // 6. Create journey entry if exists
        if (oldCustomer.journey_stage || oldCustomer.emotion || oldCustomer.next_action || oldCustomer.last_summary) {
          await pgClient.query(
            `INSERT INTO crm_personal_journey (
              personal_key_id, 
              stage, 
              emotion, 
              next_action, 
              summary_text, 
              recorded_by, 
              source
            ) 
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              personalKeyId,
              oldCustomer.journey_stage || null,
              oldCustomer.emotion || 'neutral',
              oldCustomer.next_action || null,
              oldCustomer.last_summary || null,
              defaultUserId,
              'migrated_from_old_db'
            ]
          );
        }
      } catch (error) {
        console.error(`Failed to migrate customer ${oldCustomer.id} (${oldCustomer.email}): ${error.message}`);
      }
    }

    // Process leads (qty_paid = 0)
    for (const oldLead of leads) {
      try {
        // 1. Create personal_key
        const externalKey = oldLead.email || `old_customer_${oldLead.id}`;
        const personalKeyResult = await pgClient.query(
          `INSERT INTO crm_personal_keys (external_key) 
           VALUES ($1) 
           ON CONFLICT (external_key) DO UPDATE SET external_key = EXCLUDED.external_key
           RETURNING id`,
          [externalKey]
        );
        const personalKeyId = personalKeyResult.rows[0].id;

        // 2. Create contacts (email and phone)
        if (oldLead.email && oldLead.email.trim() !== '') {
          await pgClient.query(
            `INSERT INTO crm_personal_contacts (personal_key_id, contact_type, contact_value, is_primary, is_verified) 
             VALUES ($1, $2, $3, $4, $5)`,
            [personalKeyId, 'email', oldLead.email.trim(), true, !oldLead.error_email]
          );
        }

        if (oldLead.phone && oldLead.phone.trim() !== '' && oldLead.phone !== '0') {
          await pgClient.query(
            `INSERT INTO crm_personal_contacts (personal_key_id, contact_type, contact_value, is_primary, is_verified) 
             VALUES ($1, $2, $3, $4, $5)`,
            [personalKeyId, 'phone', oldLead.phone.trim(), false, !oldLead.error_phone]
          );
        }

        // 3. Create address
        if (oldLead.address || oldLead.city || oldLead.country) {
          await pgClient.query(
            `INSERT INTO crm_personal_addresses (personal_key_id, type, address_line1, city, country, postal_code, is_default) 
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              personalKeyId,
              'primary',
              oldLead.address || null,
              oldLead.city || null,
              oldLead.country || null,
              oldLead.post_code || null,
              true
            ]
          );
        }

        // 4. Create profile
        const birthDate = parseBirthDate(oldLead.birth, oldLead.birth_month_day, oldLead.birth_year);
        const customAttributes = {};
        if (oldLead.infor_customer) {
          customAttributes.infor_customer = oldLead.infor_customer;
        }
        if (oldLead.future_sales_opportunities) {
          customAttributes.future_sales_opportunities = oldLead.future_sales_opportunities;
        }
        if (oldLead.link_profile) {
          customAttributes.link_profile = oldLead.link_profile;
        }
        if (oldLead.link_pancake) {
          customAttributes.link_pancake = oldLead.link_pancake;
        }

        await pgClient.query(
          `INSERT INTO crm_personal_profile (personal_key_id, birth_date, custom_attributes, notes, display_name, five_element, intention) 
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            personalKeyId,
            birthDate,
            Object.keys(customAttributes).length > 0 ? JSON.stringify(customAttributes) : null,
            oldLead.note || null,
            oldLead.full_name || null,
            oldLead.five_element || null,
            oldLead.intention || null
          ]
        );

        // 5. Create lead record
        const leadResult = await pgClient.query(
          `INSERT INTO crm_leads (
            personal_key_id, 
            status, 
            source, 
            assigned_to, 
            tenant_id
          ) 
           VALUES ($1, $2, $3, $4, $5) 
           RETURNING id`,
          [
            personalKeyId,
            oldLead.status_lead_contact || 'new',
            oldLead.source || 'phone',
            defaultUserId,
            tenantId
          ]
        );
        const leadId = leadResult.rows[0].id;

        // Update contacts with lead_id
        await pgClient.query(
          `UPDATE crm_personal_contacts SET lead_id = $1 WHERE personal_key_id = $2`,
          [leadId, personalKeyId]
        );

        // 6. Create journey entry if exists
        if (oldLead.journey_stage || oldLead.emotion || oldLead.next_action || oldLead.last_summary) {
          await pgClient.query(
            `INSERT INTO crm_personal_journey (
              personal_key_id, 
              stage, 
              emotion, 
              next_action, 
              summary_text, 
              recorded_by, 
              source
            ) 
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              personalKeyId,
              oldLead.journey_stage || null,
              oldLead.emotion || 'neutral',
              oldLead.next_action || null,
              oldLead.last_summary || null,
              defaultUserId,
              'migrated_from_old_db'
            ]
          );
        }
      } catch (error) {
        console.error(`Failed to migrate lead ${oldLead.id} (${oldLead.email}): ${error.message}`);
      }
    }

    // Commit transaction
    await pgClient.query('COMMIT');

    await pgClient.end();
  } catch (error) {
    await pgClient.query('ROLLBACK');
    console.error('Error seeding CRM data:', error.message);
    console.error('Stack:', error.stack);
    await pgClient.end();
    process.exit(1);
  }
}

console.log('🔄 Starting data migration...');
// Run seed
seedCRMData();
