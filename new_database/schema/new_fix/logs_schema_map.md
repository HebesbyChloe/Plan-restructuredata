# Logging System Schema

## Overview
This document provides a complete skeleton map and detailed listing of all logging tables in the ERP system. The logging system tracks three types of activities: human actions, system automation, and webhook events.

**Legend:**
- 🔗 **Foreign Key** - Relationship to another table
- 📊 **Indexed** - Column has an index for performance
- 🔒 **Unique** - Column has unique constraint
- ⏰ **Timestamp** - Time tracking column

---

## Schema Skeleton Map

```
┌─────────────────────────────────────────────────────────────────┐
│                      LOGGING SYSTEM SCHEMA                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       logs_human                                 │
│  ────────────────────────────────────────────────────────────  │
│  • Tracks all human (end-user/staff) activities                │
│  • Links to: sys_tenants, hr_staff, auth.users                 │
│  • Tracks: actor, action, entity, IP, user agent                │
└─────────────────────────────────────────────────────────────────┘
         │
         ├─── FK: tenant_id ────► sys_tenants
         ├─── FK: actor_id ──────► hr_staff
         └─── FK: actor_user_id ─► auth.users


┌─────────────────────────────────────────────────────────────────┐
│                      logs_system                                 │
│  ────────────────────────────────────────────────────────────  │
│  • Tracks all system automated activities                       │
│  • Links to: sys_tenants                                        │
│  • Tracks: entity, action, user, details, response             │
└─────────────────────────────────────────────────────────────────┘
         │
         └─── FK: tenant_id ────► sys_tenants


┌─────────────────────────────────────────────────────────────────┐
│                      logs_webhook                                │
│  ────────────────────────────────────────────────────────────  │
│  • Tracks all webhook activities                                │
│  • Links to: sys_tenants                                        │
│  • Tracks: endpoint, sender, request/response, status           │
└─────────────────────────────────────────────────────────────────┘
         │
         └─── FK: tenant_id ────► sys_tenants


┌─────────────────────────────────────────────────────────────────┐
│                    REFERENCED TABLES (External)                  │
│  ────────────────────────────────────────────────────────────  │
│  • sys_tenants          - Tenant management                     │
│  • hr_staff             - Staff/employee records                │
│  • auth.users           - User authentication (Supabase)        │
└─────────────────────────────────────────────────────────────────┘
```

---

## Table Details

### 1. `logs_human`
**Purpose:** Tracks all human activities performed by end-users and staff members.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGINT | PRIMARY KEY, GENERATED BY DEFAULT AS IDENTITY | Auto-incrementing primary key |
| `actor_id` | INTEGER | NULL, FK → `hr_staff(id)` | 🔗 Staff member who performed action |
| `actor_user_id` | UUID | NULL, FK → `auth.users(id)` | 🔗 User account (Supabase auth) |
| `action` | VARCHAR | NULL | Action type (e.g., 'create', 'update', 'delete', 'view') |
| `entity_type` | VARCHAR | NULL | Entity type (e.g., 'order', 'product', 'customer') |
| `entity_id` | BIGINT | NULL | ID of the affected entity |
| `details` | JSONB | NULL | Additional action details in JSON format |
| `ip_address` | INET | NULL | IP address of the actor |
| `user_agent` | TEXT | NULL | Browser/client user agent string |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Action timestamp |
| `tenant_id` | INTEGER | NOT NULL, DEFAULT 1, FK → `sys_tenants(id)` | 🔗 Multi-tenant support |

**Foreign Keys:**
- `tenant_id` → `public.sys_tenants(id)` (Constraint: `logs_human_tenant_id_fkey`)
- `actor_id` → `public.hr_staff(id)` (Constraint: `logs_human_actor_id_fkey`)
- `actor_user_id` → `auth.users(id)` (Constraint: `logs_human_actor_user_id_fkey`)

**Use Cases:**
- Audit trail for compliance
- Track user actions for security
- Monitor staff activity
- Debug user-reported issues
- Compliance reporting (GDPR, SOX, etc.)

---

### 2. `logs_system`
**Purpose:** Tracks all system automated activities and background processes.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | INTEGER | PRIMARY KEY, GENERATED BY DEFAULT AS IDENTITY | Auto-incrementing primary key |
| `entity_type` | VARCHAR | NULL | Entity type affected by system action |
| `entity_id` | INTEGER | NULL | ID of the affected entity |
| `action` | INTEGER | NULL | Action code/type (integer enum) |
| `user_id` | INTEGER | NULL | User ID (if action was triggered by user) |
| `details` | JSONB | NULL | Additional action details in JSON format |
| `response` | TEXT | NULL | System response or result message |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Action timestamp |
| `tenant_id` | INTEGER | NOT NULL, DEFAULT 1, FK → `sys_tenants(id)` | 🔗 Multi-tenant support |

**Foreign Keys:**
- `tenant_id` → `public.sys_tenants(id)` (Constraint: `fk_audit_logs_tenant`)

**Use Cases:**
- Track automated workflows
- Monitor background job execution
- Debug system processes
- Track scheduled task runs
- System health monitoring

---

### 3. `logs_webhook`
**Purpose:** Tracks all webhook activities (incoming and outgoing).

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | INTEGER | PRIMARY KEY, GENERATED BY DEFAULT AS IDENTITY | Auto-incrementing primary key |
| `endpoint` | VARCHAR | NULL | Webhook endpoint URL |
| `sent_by` | VARCHAR | NULL | Source system or service that sent webhook |
| `request_data` | JSONB | NULL | Incoming webhook request payload |
| `response_data` | JSONB | NULL | Webhook response payload |
| `status` | INTEGER | NULL | HTTP status code (e.g., 200, 400, 500) |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Webhook event timestamp |
| `tenant_id` | INTEGER | NOT NULL, DEFAULT 1, FK → `sys_tenants(id)` | 🔗 Multi-tenant support |

**Foreign Keys:**
- `tenant_id` → `public.sys_tenants(id)` (Constraint: `fk_webhook_logs_tenant`)

**Use Cases:**
- Track webhook deliveries
- Debug webhook failures
- Monitor third-party integrations
- Audit external system communications
- Retry failed webhooks

---

## Relationships Summary

### External Dependencies
All logging tables depend on the following external tables:

1. **`sys_tenants`** - Referenced by:
   - `logs_human.tenant_id`
   - `logs_system.tenant_id`
   - `logs_webhook.tenant_id`

2. **`hr_staff`** - Referenced by:
   - `logs_human.actor_id`

3. **`auth.users`** (Supabase) - Referenced by:
   - `logs_human.actor_user_id`

---

## Index Recommendations

For optimal query performance, consider adding indexes on:

### `logs_human`
- `actor_id` (staff activity queries)
- `actor_user_id` (user activity queries)
- `entity_type, entity_id` (composite index for entity lookups)
- `action` (action type filtering)
- `created_at` (time-based queries)
- `tenant_id` (multi-tenant filtering)

### `logs_system`
- `entity_type, entity_id` (composite index for entity lookups)
- `action` (action type filtering)
- `created_at` (time-based queries)
- `tenant_id` (multi-tenant filtering)

### `logs_webhook`
- `endpoint` (endpoint-based queries)
- `sent_by` (source filtering)
- `status` (status code filtering)
- `created_at` (time-based queries)
- `tenant_id` (multi-tenant filtering)

---

## Data Retention Considerations

Consider implementing:
- **Partitioning** by `created_at` for large tables (monthly/quarterly partitions)
- **Archival strategy** for old logs (move to cold storage after X months)
- **Retention policies** based on log type:
  - `logs_human`: 2-7 years (compliance requirements)
  - `logs_system`: 30-90 days (operational data)
  - `logs_webhook`: 30-90 days (integration data)

---

## Query Patterns

### Common Queries

**Get user activity for last 24 hours:**
```sql
SELECT * FROM logs_human 
WHERE actor_user_id = ? 
  AND created_at >= NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;
```

**Find failed webhooks:**
```sql
SELECT * FROM logs_webhook 
WHERE status >= 400 
  AND created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
```

**System actions on specific entity:**
```sql
SELECT * FROM logs_system 
WHERE entity_type = ? AND entity_id = ?
ORDER BY created_at DESC;
```

---

## Notes

- All tables use `TIMESTAMPTZ` for timezone-aware timestamps
- Multi-tenant support is built into `logs_human`, `logs_system`, and `logs_webhook`
- JSONB columns (`details`, `request_data`, `response_data`) allow flexible schema and efficient querying

