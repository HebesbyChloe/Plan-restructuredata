require('dotenv').config();
const { Client } = require('pg');

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

// ============================================================================
// Constants & Data Definitions
// ============================================================================

// Platforms
const platforms = [
  {
    name: 'Facebook Marketing',
    platform_type: 'facebook',
    status: 'active',
    total_reach: 150000,
    total_engagement: 4.5,
    total_budget: 50000.00,
    page_count: 3,
    metadata: { api_version: 'v18.0', business_id: '123456789' }
  },
  {
    name: 'Instagram Marketing',
    platform_type: 'instagram',
    status: 'active',
    total_reach: 120000,
    total_engagement: 5.2,
    total_budget: 35000.00,
    page_count: 2,
    metadata: { api_version: 'v18.0', connected_accounts: 2 }
  },
  {
    name: 'YouTube Channel',
    platform_type: 'youtube',
    status: 'active',
    total_reach: 80000,
    total_engagement: 3.8,
    total_budget: 25000.00,
    page_count: 1,
    metadata: { channel_type: 'brand', subscribers: 5000 }
  },
  {
    name: 'Google Ads',
    platform_type: 'google-ads',
    status: 'active',
    total_reach: 200000,
    total_engagement: 2.1,
    total_budget: 75000.00,
    page_count: 1,
    metadata: { account_id: '123-456-7890', currency: 'USD' }
  },
  {
    name: 'TikTok Marketing',
    platform_type: 'tiktok',
    status: 'active',
    total_reach: 95000,
    total_engagement: 6.3,
    total_budget: 20000.00,
    page_count: 1,
    metadata: { business_center_id: 'tiktok_123' }
  },
  {
    name: 'Email Marketing',
    platform_type: 'email',
    status: 'active',
    total_reach: 50000,
    total_engagement: 8.5,
    total_budget: 5000.00,
    page_count: 2,
    metadata: { provider: 'sendgrid', list_count: 5 }
  }
];

// Platform Pages
const platformPages = [
  // Facebook pages (real)
  {
    platform_type: 'facebook',
    name: 'By Chloe',
    entity_id: '208051829867952',
    entity_id_secondary: null,
    reach: 35000,
    engagement: 4.2,
    status: 'active',
    budget: 12000.00,
    metadata: { page_name: 'by_chloe', category: 'Jewelry', note: 'actual shop page' }
  },
  {
    platform_type: 'facebook',
    name: 'Ebes',
    entity_id: '1761097260820359',
    entity_id_secondary: null,
    reach: 25000,
    engagement: 3.8,
    status: 'active',
    budget: 10000.00,
    metadata: { page_name: 'ebes', category: 'Jewelry' }
  },
  {
    platform_type: 'facebook',
    name: 'Hebes Jewelry',
    entity_id: '103436741059710',
    entity_id_secondary: null,
    reach: 42000,
    engagement: 3.5,
    status: 'active',
    budget: 18000.00,
    metadata: { page_name: 'hebes_jewelry', category: 'Jewelry' }
  },
  {
    platform_type: 'facebook',
    name: 'Agarwood',
    entity_id: '111749281760680',
    entity_id_secondary: null,
    reach: 16000,
    engagement: 2.9,
    status: 'active',
    budget: 7000.00,
    metadata: { page_name: 'agarwood', category: 'Jewelry' }
  },
  {
    platform_type: 'facebook',
    name: 'Hebes Official',
    entity_id: '381145268410253',
    entity_id_secondary: null,
    reach: 8000,
    engagement: 2.2,
    status: 'active',
    budget: 4000.00,
    metadata: { page_name: 'hebes_official', category: 'Jewelry' }
  },
  // Facebook pages (sample/demo)
  {
    platform_type: 'facebook',
    name: 'DFC Flow Official Page',
    entity_id: '123456789012345',
    entity_id_secondary: 'pancake_fb_001',
    reach: 50000,
    engagement: 4.8,
    status: 'active',
    budget: 20000.00,
    metadata: { page_name: 'DFC Flow', category: 'Jewelry' }
  },
  {
    platform_type: 'facebook',
    name: 'DFC Flow Vietnam',
    entity_id: '987654321098765',
    entity_id_secondary: 'pancake_fb_002',
    reach: 60000,
    engagement: 5.1,
    status: 'active',
    budget: 18000.00,
    metadata: { page_name: 'DFC Flow VN', category: 'Retail' }
  },
  {
    platform_type: 'facebook',
    name: 'DFC Flow US',
    entity_id: '555666777888999',
    entity_id_secondary: 'pancake_fb_003',
    reach: 40000,
    engagement: 4.2,
    status: 'active',
    budget: 12000.00,
    metadata: { page_name: 'DFC Flow USA', category: 'E-commerce' }
  },
  // Instagram pages
  {
    platform_type: 'instagram',
    name: '@dfcflow_official',
    entity_id: 'ig_123456789',
    entity_id_secondary: 'pancake_ig_001',
    reach: 70000,
    engagement: 6.2,
    status: 'active',
    budget: 20000.00,
    metadata: { username: 'dfcflow_official', followers: 15000 }
  },
  {
    platform_type: 'instagram',
    name: '@dfcflow_vietnam',
    entity_id: 'ig_987654321',
    entity_id_secondary: 'pancake_ig_002',
    reach: 50000,
    engagement: 5.8,
    status: 'active',
    budget: 15000.00,
    metadata: { username: 'dfcflow_vietnam', followers: 12000 }
  },
  // YouTube channel
  {
    platform_type: 'youtube',
    name: 'DFC Flow Official Channel',
    entity_id: 'UC1234567890abcdefghij',
    entity_id_secondary: 'pancake_yt_001',
    reach: 80000,
    engagement: 3.8,
    status: 'active',
    budget: 25000.00,
    metadata: { channel_id: 'UC1234567890abcdefghij', subscribers: 5000 }
  },
  // Google Ads account
  {
    platform_type: 'google-ads',
    name: 'DFC Flow Google Ads Account',
    entity_id: '123-456-7890',
    entity_id_secondary: null,
    reach: 200000,
    engagement: 2.1,
    status: 'active',
    budget: 75000.00,
    metadata: { account_id: '123-456-7890', currency: 'USD' }
  },
  // TikTok account
  {
    platform_type: 'tiktok',
    name: '@dfcflow',
    entity_id: 'tiktok_123456789',
    entity_id_secondary: 'pancake_tiktok_001',
    reach: 95000,
    engagement: 6.3,
    status: 'active',
    budget: 20000.00,
    metadata: { username: 'dfcflow', followers: 20000 }
  },
  // Email lists
  {
    platform_type: 'email',
    name: 'DFC Flow Newsletter',
    entity_id: 'email_list_001',
    entity_id_secondary: 'pancake_email_001',
    reach: 30000,
    engagement: 9.2,
    status: 'active',
    budget: 3000.00,
    metadata: { list_name: 'Newsletter', subscriber_count: 30000 }
  },
  {
    platform_type: 'email',
    name: 'DFC Flow Promotions',
    entity_id: 'email_list_002',
    entity_id_secondary: 'pancake_email_002',
    reach: 20000,
    engagement: 7.8,
    status: 'active',
    budget: 2000.00,
    metadata: { list_name: 'Promotions', subscriber_count: 20000 }
  }
];

// ============================================================================
// Database Functions
// ============================================================================

async function clearChannelsData() {
  try {
    await pgClient.query('DELETE FROM channels_platform_pages');
    await pgClient.query('DELETE FROM channels_platforms');

    await pgClient.query('ALTER SEQUENCE channels_platform_pages_id_seq RESTART WITH 1');
    await pgClient.query('ALTER SEQUENCE channels_platforms_id_seq RESTART WITH 1');
  } catch (error) {
    throw new Error(`Failed to clear channels data: ${error.message}`);
  }
}

// ============================================================================
// Main Migration Function
// ============================================================================

async function seedChannelsData() {
  try {
    await pgClient.connect();
    await pgClient.query('BEGIN');

    // Clear existing data first
    await clearChannelsData();

    // Get tenant ID
    const tenantResult = await pgClient.query(
      `SELECT id FROM sys_tenants WHERE slug = 'dfc-flow' LIMIT 1`
    );

    if (tenantResult.rows.length === 0) {
      throw new Error('Tenant "dfc-flow" not found. Please run map-data-001.js first.');
    }

    const tenantId = tenantResult.rows[0].id;

    // 1. Insert Platforms
    const platformIds = {};
    for (const platform of platforms) {
      const result = await pgClient.query(
        `INSERT INTO channels_platforms (tenant_id, name, platform_type, status, total_reach, total_engagement, total_budget, page_count, metadata) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
         ON CONFLICT (tenant_id, platform_type) DO UPDATE SET name = EXCLUDED.name, status = EXCLUDED.status
         RETURNING id`,
        [
          tenantId,
          platform.name,
          platform.platform_type,
          platform.status,
          platform.total_reach,
          platform.total_engagement,
          platform.total_budget,
          platform.page_count,
          JSON.stringify(platform.metadata)
        ]
      );
      platformIds[platform.platform_type] = result.rows[0].id;
    }

    // 2. Insert Platform Pages
    for (const page of platformPages) {
      const platformId = platformIds[page.platform_type];
      if (!platformId) continue;

      try {
        if (page.entity_id) {
          // If entity_id exists, use ON CONFLICT with unique constraint
          await pgClient.query(
            `INSERT INTO channels_platform_pages (tenant_id, platform_id, name, entity_id, entity_id_secondary, reach, engagement, status, budget, metadata) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
             ON CONFLICT (tenant_id, platform_id, entity_id) 
             WHERE entity_id IS NOT NULL
             DO UPDATE SET name = EXCLUDED.name, status = EXCLUDED.status`,
            [
              tenantId,
              platformId,
              page.name,
              page.entity_id,
              page.entity_id_secondary,
              page.reach,
              page.engagement,
              page.status,
              page.budget,
              JSON.stringify(page.metadata)
            ]
          );
        } else {
          // If entity_id is null, just insert
          await pgClient.query(
            `INSERT INTO channels_platform_pages (tenant_id, platform_id, name, entity_id, entity_id_secondary, reach, engagement, status, budget, metadata) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [
              tenantId,
              platformId,
              page.name,
              page.entity_id,
              page.entity_id_secondary,
              page.reach,
              page.engagement,
              page.status,
              page.budget,
              JSON.stringify(page.metadata)
            ]
          );
        }
      } catch (error) {
        console.error(`Failed to insert page ${page.name}: ${error.message}`);
      }
    }

    await pgClient.query('COMMIT');
    await pgClient.end();
  } catch (error) {
    await pgClient.query('ROLLBACK');
    console.error('❌ Error seeding channels data:', error.message);
    console.error('   Stack:', error.stack);
    await pgClient.end();
    process.exit(1);
  }
}

// ============================================================================
// Execution
// ============================================================================

console.log('🔄 Starting channels data migration...');
seedChannelsData();
