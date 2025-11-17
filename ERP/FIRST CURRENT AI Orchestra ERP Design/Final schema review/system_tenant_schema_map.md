# System Module Schema (Multi-Tenant RBAC)

## Overview
This document provides a complete skeleton map and detailed listing of the multi-tenant RBAC (Role-Based Access Control) system in the ERP. The system manages tenants, users, roles, and permissions with full multi-tenancy support and tenant-scoped role assignments.

**Legend:**
- 🔗 **Foreign Key** - Relationship to another table
- 📊 **Indexed** - Column has an index for performance
- 🔒 **Unique** - Column has unique constraint
- ⏰ **Timestamp** - Time tracking column
- ✅ **Check Constraint** - Value validation constraint
- 🌐 **Global** - Not tenant-scoped (shared across all tenants)

---

## Schema Skeleton Map

```
┌─────────────────────────────────────────────────────────────────┐
│              MULTI-TENANT RBAC SYSTEM SCHEMA                     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      sys_tenants                                 │
│  ────────────────────────────────────────────────────────────  │
│  • Multi-tenant organizations/businesses                        │
│  • Central tenant table (isolated data per tenant)              │
│  • Unique: name, slug                                           │
│  • Status: 'active', 'suspended', 'deleted'                     │
│  • Links to: auth.users (owner)                                 │
└─────────────────────────────────────────────────────────────────┘
         │
         ├─── 1:N ────► sys_roles (tenant-scoped)
         ├─── 1:N ────► sys_user_roles (tenant context)
         └─── 1:N ────► sys_users (via primary_tenant_id, optional)


┌─────────────────────────────────────────────────────────────────┐
│                      sys_users                                   │
│  ────────────────────────────────────────────────────────────  │
│  • Application users linked to auth.users                       │
│  • Can belong to multiple tenants                               │
│  • Unique: auth_user_id                                         │
│  • Self-referential: manager_user_id                            │
│  • Links to: auth.users, sys_tenants (primary)                 │
└─────────────────────────────────────────────────────────────────┘
         │
         ├─── N:1 ────► auth.users (via auth_user_id)
         ├─── N:1 ────► sys_tenants (via primary_tenant_id, optional)
         ├─── 1:N ────► sys_user_roles (user-role memberships)
         └─── 1:N ────► sys_users (self: manager_user_id)


┌─────────────────────────────────────────────────────────────────┐
│                      sys_roles                                   │
│  ────────────────────────────────────────────────────────────  │
│  • Role catalog per tenant                                      │
│  • Tenant-scoped (e.g., 'admin', 'editor', 'viewer')          │
│  • Unique per tenant: (tenant_id, key), (tenant_id, name)      │
│  • System roles vs custom roles                                 │
│  • Default role assignment                                      │
│  • Links to: sys_tenants                                        │
└─────────────────────────────────────────────────────────────────┘
         │
         ├─── N:1 ────► sys_tenants (tenant owner)
         ├─── N:N ────► sys_permissions (via sys_role_permissions)
         └─── 1:N ────► sys_user_roles (role assignments)


┌─────────────────────────────────────────────────────────────────┐
│                    sys_permissions                               │
│  ────────────────────────────────────────────────────────────  │
│  • Global permission catalog (capabilities/actions)            │
│  • 🌐 Shared across all tenants                                │
│  • Unique: key (e.g., 'order.read', 'order.write')             │
│  • Resource + action pattern                                    │
│  • Not tenant-scoped                                            │
└─────────────────────────────────────────────────────────────────┘
         │
         └─── N:N ────► sys_roles (via sys_role_permissions)


┌─────────────────────────────────────────────────────────────────┐
│                 sys_role_permissions                             │
│  ────────────────────────────────────────────────────────────  │
│  • Many-to-many bridge: roles ↔ permissions                     │
│  • Composite PK: (role_id, permission_id)                      │
│  • Cascade: ON DELETE CASCADE (role), RESTRICT (permission)     │
└─────────────────────────────────────────────────────────────────┘
         │
         ├─── N:1 ────► sys_roles
         └─── N:1 ────► sys_permissions


┌─────────────────────────────────────────────────────────────────┐
│                    sys_user_roles                               │
│  ────────────────────────────────────────────────────────────  │
│  • User-role membership per tenant                              │
│  • Assigns users to roles within tenant context                 │
│  • Unique: (tenant_id, user_id, role_id)                       │
│  • Supports expiring assignments (expires_at)                   │
│  • Tracks assigner (assigned_by)                                │
└─────────────────────────────────────────────────────────────────┘
         │
         ├─── N:1 ────► sys_tenants (tenant context)
         ├─── N:1 ────► sys_users (user)
         └─── N:1 ────► sys_roles (role)


┌─────────────────────────────────────────────────────────────────┐
│                    REFERENCED TABLES (External)                  │
│  ────────────────────────────────────────────────────────────  │
│  • auth.users (Supabase) - User authentication                 │
│    └── Referenced by: sys_tenants.owner_user_id                │
│    └── Referenced by: sys_users.auth_user_id                   │
└─────────────────────────────────────────────────────────────────┘


Relationship Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
sys_tenants 1──N sys_roles                    (CASCADE on delete)
sys_tenants 1──N sys_user_roles               (CASCADE on delete)
sys_tenants 1──N sys_users (primary_tenant_id) (optional reference)

sys_users N──1 auth.users                     (via auth_user_id)
sys_users N──1 sys_tenants                    (via primary_tenant_id)
sys_users 1──N sys_user_roles                 (user memberships)
sys_users 1──N sys_users                       (manager hierarchy)

sys_roles N──1 sys_tenants                    (tenant owner)
sys_roles N──N sys_permissions                 (via sys_role_permissions)
sys_roles 1──N sys_user_roles                 (role assignments)

sys_permissions (global, no tenant FK)
sys_permissions N──N sys_roles                 (via sys_role_permissions)

sys_role_permissions: Bridge table
  - role_id → sys_roles (CASCADE)
  - permission_id → sys_permissions (RESTRICT)

sys_user_roles: Bridge table with tenant context
  - tenant_id → sys_tenants (CASCADE)
  - user_id → sys_users (CASCADE)
  - role_id → sys_roles (CASCADE)
```

---

## Table Details

### 1. `sys_tenants`
**Purpose:** Multi-tenant organizations/businesses. Each tenant has isolated data and can have its own users, roles, and configurations.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGINT | PRIMARY KEY, GENERATED BY DEFAULT AS IDENTITY | Auto-incrementing primary key |
| `name` | VARCHAR | NOT NULL, UNIQUE | 🔒 Organization/business name |
| `slug` | VARCHAR | NOT NULL, UNIQUE | 🔒 URL-friendly identifier (e.g., 'acme-corp') |
| `status` | VARCHAR | NOT NULL, DEFAULT 'active', CHECK | ✅ Status: 'active', 'suspended', 'deleted' |
| `owner_user_id` | UUID | NULL, FK → `auth.users(id)` | 🔗 Tenant owner (Supabase auth user) |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Last update timestamp |
| `billing_plan` | VARCHAR | NULL | Billing plan identifier (e.g., 'free', 'pro', 'enterprise') |
| `metadata` | JSONB | DEFAULT '{}'::jsonb | Flexible metadata storage |
| `deleted_at` | TIMESTAMPTZ | NULL | ⏰ Soft delete timestamp |
| `is_personal` | BOOLEAN | DEFAULT false | Flag for personal vs business tenants |
| `timezone` | VARCHAR | NULL | Tenant timezone (e.g., 'America/New_York') |
| `locale` | VARCHAR | NULL | Locale setting (e.g., 'en-US', 'vi-VN') |
| `domain` | VARCHAR | NULL | Custom domain for tenant |
| `external_id` | VARCHAR | NULL | External system identifier |
| `notes` | TEXT | NULL | Internal notes about tenant |

**Check Constraints:**
- `status` must be one of: 'active', 'suspended', 'deleted'

**Unique Constraints:**
- `name` (unique across all tenants)
- `slug` (unique across all tenants)

**Foreign Keys:**
- `owner_user_id` → `auth.users(id)` (Supabase auth)

**Indexes:**
- `UNIQUE(slug)` - Ensure unique slugs
- `idx_sys_tenants_owner_user_id(owner_user_id)` - Lookup by owner

**Use Cases:**
- Multi-tenant SaaS applications
- Organization/business isolation
- Tenant-specific configurations
- Billing and subscription management
- Soft delete for data retention

**RLS Considerations:**
- Typically enabled with policies filtering by tenant context
- Users can only access data for tenants they belong to

---

### 2. `sys_users`
**Purpose:** Application users linked to Supabase auth.users, with profile information and tenant metadata. Users can belong to multiple tenants.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGINT | PRIMARY KEY, GENERATED BY DEFAULT AS IDENTITY | Auto-incrementing primary key |
| `auth_user_id` | UUID | UNIQUE, NOT NULL, FK → `auth.users(id)` | 🔗 🔒 Link to Supabase auth user |
| `primary_tenant_id` | BIGINT | NULL, FK → `sys_tenants(id)` | 🔗 User's primary/default tenant |
| `email` | CITEXT | NULL | User email (case-insensitive) |
| `phone` | VARCHAR | NULL | Phone number |
| `full_name` | VARCHAR | NULL | User's full name |
| `avatar_url` | TEXT | NULL | Profile picture URL |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT true | Whether user account is active |
| `last_sign_in_at` | TIMESTAMPTZ | NULL | ⏰ Last sign-in timestamp |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Account creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Last update timestamp |
| `metadata` | JSONB | DEFAULT '{}'::jsonb | Flexible metadata storage |
| `external_id` | VARCHAR | NULL | External system identifier |
| `locale` | VARCHAR | NULL | User locale preference |
| `timezone` | VARCHAR | NULL | User timezone preference |
| `deactivated_at` | TIMESTAMPTZ | NULL | ⏰ Account deactivation timestamp |
| `notes` | TEXT | NULL | Internal notes about user |
| `title` | VARCHAR | NULL | Job title |
| `department` | VARCHAR | NULL | Department name |
| `manager_user_id` | BIGINT | NULL, FK → `sys_users(id)` | 🔗 Self-referential: user's manager |

**Unique Constraints:**
- `auth_user_id` (one-to-one with auth.users)

**Foreign Keys:**
- `auth_user_id` → `auth.users(id)` (Supabase auth)
- `primary_tenant_id` → `sys_tenants(id)` (optional primary tenant)
- `manager_user_id` → `sys_users(id)` (self-referential, organizational hierarchy)

**Indexes:**
- `UNIQUE(auth_user_id)` - Ensure one-to-one with auth
- `idx_sys_users_email(email)` - Email lookup
- `idx_sys_users_primary_tenant(primary_tenant_id)` - Primary tenant lookup

**Use Cases:**
- User profile management
- Multi-tenant user membership
- Organizational hierarchy (manager relationships)
- User preferences and settings
- Account status tracking

**RLS Considerations:**
- Users may only see/update themselves and related tenant data
- Policies should filter by tenant membership

---

### 3. `sys_roles`
**Purpose:** Role catalog per tenant. Defines roles like 'admin', 'editor', 'viewer' that are scoped to a specific tenant.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGINT | PRIMARY KEY, GENERATED BY DEFAULT AS IDENTITY | Auto-incrementing primary key |
| `tenant_id` | BIGINT | NOT NULL, FK → `sys_tenants(id)` ON DELETE CASCADE | 🔗 Tenant owner (CASCADE on tenant delete) |
| `key` | VARCHAR | NOT NULL | Machine-readable key (e.g., 'admin', 'editor', 'viewer') |
| `name` | VARCHAR | NOT NULL | Human-readable name (e.g., 'Administrator', 'Editor', 'Viewer') |
| `description` | TEXT | NULL | Role description |
| `is_system` | BOOLEAN | NOT NULL, DEFAULT false | ✅ Reserved system roles (protected from deletion) |
| `is_default` | BOOLEAN | NOT NULL, DEFAULT false | ✅ Assigned automatically when user joins tenant |
| `priority` | INTEGER | NOT NULL, DEFAULT 0 | Priority for conflict resolution (higher = more important) |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Last update timestamp |
| `external_id` | VARCHAR | NULL | External system identifier |
| `metadata` | JSONB | DEFAULT '{}'::jsonb | Flexible metadata storage |

**Unique Constraints:**
- `(tenant_id, key)` - Unique key per tenant
- `(tenant_id, name)` - Unique name per tenant

**Foreign Keys:**
- `tenant_id` → `sys_tenants(id)` ON DELETE CASCADE (roles deleted when tenant is deleted)

**Indexes:**
- `idx_sys_roles_tenant(tenant_id)` - Tenant lookup
- `idx_sys_roles_is_default(tenant_id, is_default) WHERE is_default = true` - Partial index for default roles

**Use Cases:**
- Define tenant-specific roles
- System roles (admin, viewer) vs custom roles
- Default role assignment for new tenant members
- Role priority for permission conflict resolution

**Design Notes:**
- Roles are tenant-scoped (same role key can exist in different tenants with different permissions)
- System roles should be protected from deletion/modification
- Default roles are automatically assigned when users join a tenant

---

### 4. `sys_permissions`
**Purpose:** Global permission catalog (capabilities/actions) shared across all tenants. Defines what actions can be performed.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGINT | PRIMARY KEY, GENERATED BY DEFAULT AS IDENTITY | Auto-incrementing primary key |
| `key` | VARCHAR | NOT NULL, UNIQUE | 🔒 Machine-readable key (e.g., 'order.read', 'order.write', 'product.delete') |
| `name` | VARCHAR | NOT NULL | Human-readable name (e.g., 'Read Orders', 'Write Orders') |
| `description` | TEXT | NULL | Permission description |
| `resource` | VARCHAR | NULL | Resource type (e.g., 'orders', 'products', 'customers') |
| `action` | VARCHAR | NULL | Action type (e.g., 'read', 'write', 'delete', 'manage') |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Last update timestamp |
| `tags` | TEXT[] | DEFAULT '{}' | Array of tags for categorization |
| `metadata` | JSONB | DEFAULT '{}'::jsonb | Flexible metadata storage |

**Unique Constraints:**
- `key` (unique across all permissions)

**Indexes:**
- `UNIQUE(key)` - Ensure unique permission keys
- `idx_sys_permissions_resource_action(resource, action)` - Lookup by resource and action

**Use Cases:**
- Define all available permissions in the system
- Resource-action pattern (e.g., 'orders.read', 'orders.write')
- Permission catalog for role assignment
- Global permissions (not tenant-scoped)

**Design Notes:**
- Permissions are global and shared across all tenants
- Should be protected from accidental deletion (ON DELETE RESTRICT in role_permissions)
- Resource + action pattern allows flexible permission modeling
- Tags enable permission grouping and filtering

**Example Permissions:**
- `order.read` - "Read Orders" (resource: 'orders', action: 'read')
- `order.write` - "Write Orders" (resource: 'orders', action: 'write')
- `product.delete` - "Delete Products" (resource: 'products', action: 'delete')
- `customer.manage` - "Manage Customers" (resource: 'customers', action: 'manage')

---

### 5. `sys_role_permissions`
**Purpose:** Many-to-many bridge table linking roles to permissions. Defines what permissions each role has.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `role_id` | BIGINT | NOT NULL, FK → `sys_roles(id)` ON DELETE CASCADE | 🔗 Role (CASCADE on role delete) |
| `permission_id` | BIGINT | NOT NULL, FK → `sys_permissions(id)` ON DELETE RESTRICT | 🔗 Permission (RESTRICT on permission delete) |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Assignment timestamp |

**Primary Key:**
- `(role_id, permission_id)` - Composite primary key

**Foreign Keys:**
- `role_id` → `sys_roles(id)` ON DELETE CASCADE (removed when role is deleted)
- `permission_id` → `sys_permissions(id)` ON DELETE RESTRICT (prevents deleting permissions in use)

**Indexes:**
- `PRIMARY KEY(role_id, permission_id)` - Composite primary key
- `idx_role_permissions_permission(permission_id)` - Reverse lookup (which roles have this permission)

**Use Cases:**
- Assign permissions to roles
- Build permission sets for roles
- Query which permissions a role has
- Query which roles have a specific permission

**Design Notes:**
- CASCADE on role delete: when a role is deleted, all its permission assignments are removed
- RESTRICT on permission delete: prevents deleting permissions that are assigned to roles
- Composite primary key ensures no duplicate role-permission pairs

---

### 6. `sys_user_roles`
**Purpose:** Assigns users to roles within a tenant context. Tracks user-role membership per tenant.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGINT | PRIMARY KEY, GENERATED BY DEFAULT AS IDENTITY | Auto-incrementing primary key |
| `tenant_id` | BIGINT | NOT NULL, FK → `sys_tenants(id)` ON DELETE CASCADE | 🔗 Tenant context (CASCADE on tenant delete) |
| `user_id` | BIGINT | NOT NULL, FK → `sys_users(id)` ON DELETE CASCADE | 🔗 User (CASCADE on user delete) |
| `role_id` | BIGINT | NOT NULL, FK → `sys_roles(id)` ON DELETE CASCADE | 🔗 Role (CASCADE on role delete) |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Assignment timestamp |
| `expires_at` | TIMESTAMPTZ | NULL | ⏰ Expiration timestamp (NULL = permanent) |
| `assigned_by` | BIGINT | NULL, FK → `sys_users(id)` | 🔗 User who assigned this role |
| `metadata` | JSONB | DEFAULT '{}'::jsonb | Flexible metadata storage |

**Unique Constraints:**
- `(tenant_id, user_id, role_id)` - One role assignment per user per tenant

**Foreign Keys:**
- `tenant_id` → `sys_tenants(id)` ON DELETE CASCADE (removed when tenant is deleted)
- `user_id` → `sys_users(id)` ON DELETE CASCADE (removed when user is deleted)
- `role_id` → `sys_roles(id)` ON DELETE CASCADE (removed when role is deleted)
- `assigned_by` → `sys_users(id)` (who assigned the role)

**Indexes:**
- `UNIQUE(tenant_id, user_id, role_id)` - Prevent duplicate assignments
- `idx_user_roles_user_tenant(user_id, tenant_id)` - Lookup user roles in tenant
- `idx_user_roles_role(role_id)` - Lookup users with specific role

**Use Cases:**
- Assign roles to users within tenant context
- Track role assignments with expiration
- Audit who assigned roles (assigned_by)
- Multi-tenant role membership
- Temporary role assignments (via expires_at)

**Design Notes:**
- All three FKs cascade on delete for data consistency
- Composite unique constraint ensures one role per user per tenant
- Expiring assignments: `expires_at IS NULL` = permanent, `expires_at < NOW()` = expired
- Users can have multiple roles in the same tenant (via multiple rows)

---

## Relationships Summary

### Primary Relationships

1. **`sys_tenants` → `sys_roles`** (One-to-Many)
   - One tenant can have many roles
   - `sys_roles.tenant_id` → `sys_tenants.id`
   - **CASCADE:** Deleting a tenant deletes all its roles

2. **`sys_tenants` → `sys_user_roles`** (One-to-Many)
   - One tenant can have many user-role assignments
   - `sys_user_roles.tenant_id` → `sys_tenants.id`
   - **CASCADE:** Deleting a tenant deletes all user-role assignments

3. **`sys_tenants` → `sys_users`** (One-to-Many, Optional)
   - One tenant can be the primary tenant for many users
   - `sys_users.primary_tenant_id` → `sys_tenants.id`
   - **Optional:** Users may not have a primary tenant

4. **`sys_users` → `sys_user_roles`** (One-to-Many)
   - One user can have many role assignments (across tenants)
   - `sys_user_roles.user_id` → `sys_users.id`
   - **CASCADE:** Deleting a user deletes all their role assignments

5. **`sys_users` → `sys_users`** (One-to-Many, Self-Referential)
   - One user can have many direct reports (manager hierarchy)
   - `sys_users.manager_user_id` → `sys_users.id`
   - Enables organizational hierarchy

6. **`sys_roles` → `sys_user_roles`** (One-to-Many)
   - One role can be assigned to many users
   - `sys_user_roles.role_id` → `sys_roles.id`
   - **CASCADE:** Deleting a role removes all user assignments

7. **`sys_roles` ↔ `sys_permissions`** (Many-to-Many)
   - Roles can have many permissions, permissions can be in many roles
   - Bridge: `sys_role_permissions`
   - `sys_role_permissions.role_id` → `sys_roles.id` (CASCADE)
   - `sys_role_permissions.permission_id` → `sys_permissions.id` (RESTRICT)

8. **`sys_users` ↔ `sys_roles`** (Many-to-Many, Per Tenant)
   - Users can have many roles, roles can be assigned to many users
   - Bridge: `sys_user_roles` (includes tenant context)
   - `sys_user_roles.user_id` → `sys_users.id` (CASCADE)
   - `sys_user_roles.role_id` → `sys_roles.id` (CASCADE)
   - `sys_user_roles.tenant_id` → `sys_tenants.id` (CASCADE)

### External Dependencies

1. **`auth.users`** (Supabase Auth)
   - Referenced by `sys_tenants.owner_user_id`
   - Referenced by `sys_users.auth_user_id` (one-to-one)

### Cascade Behaviors

- **Tenant Deletion:** Cascades to `sys_roles` and `sys_user_roles`
- **Role Deletion:** Cascades to `sys_role_permissions` and `sys_user_roles`
- **User Deletion:** Cascades to `sys_user_roles`
- **Permission Deletion:** RESTRICTED (cannot delete if assigned to roles)

---

## Index Recommendations

### `sys_tenants`
- `UNIQUE(slug)` - Already defined
- `idx_sys_tenants_owner_user_id(owner_user_id)` - Already defined
- `idx_sys_tenants_status(status)` - Filter by status
- `idx_sys_tenants_deleted_at(deleted_at) WHERE deleted_at IS NULL` - Partial index for active tenants

### `sys_users`
- `UNIQUE(auth_user_id)` - Already defined
- `idx_sys_users_email(email)` - Already defined
- `idx_sys_users_primary_tenant(primary_tenant_id)` - Already defined
- `idx_sys_users_is_active(is_active) WHERE is_active = true` - Partial index for active users
- `idx_sys_users_manager(manager_user_id)` - Manager hierarchy queries

### `sys_roles`
- `UNIQUE(tenant_id, key)` - Already defined
- `UNIQUE(tenant_id, name)` - Already defined
- `idx_sys_roles_tenant(tenant_id)` - Already defined
- `idx_sys_roles_is_default(tenant_id, is_default) WHERE is_default = true` - Already defined (partial)
- `idx_sys_roles_is_system(is_system)` - Filter system roles

### `sys_permissions`
- `UNIQUE(key)` - Already defined
- `idx_sys_permissions_resource_action(resource, action)` - Already defined
- `idx_sys_permissions_resource(resource)` - Filter by resource type

### `sys_role_permissions`
- `PRIMARY KEY(role_id, permission_id)` - Already defined
- `idx_role_permissions_permission(permission_id)` - Already defined
- Consider: `idx_role_permissions_role(role_id)` if not covered by PK

### `sys_user_roles`
- `UNIQUE(tenant_id, user_id, role_id)` - Already defined
- `idx_user_roles_user_tenant(user_id, tenant_id)` - Already defined
- `idx_user_roles_role(role_id)` - Already defined
- `idx_user_roles_expires(expires_at) WHERE expires_at IS NOT NULL` - Partial index for expiring roles
- `idx_user_roles_tenant_user(tenant_id, user_id)` - Composite for tenant user lookup

---

## RBAC Query Patterns

### Permission Checks

**Check if user has specific permission in tenant:**
```sql
SELECT EXISTS(
  SELECT 1
  FROM sys_user_roles ur
  JOIN sys_role_permissions rp ON ur.role_id = rp.role_id
  JOIN sys_permissions p ON rp.permission_id = p.id
  WHERE ur.user_id = ?
    AND ur.tenant_id = ?
    AND p.key = ?
    AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
) AS has_permission;
```

**Get all permissions for user in tenant:**
```sql
SELECT DISTINCT p.*
FROM sys_user_roles ur
JOIN sys_role_permissions rp ON ur.role_id = rp.role_id
JOIN sys_permissions p ON rp.permission_id = p.id
WHERE ur.user_id = ?
  AND ur.tenant_id = ?
  AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
ORDER BY p.resource, p.action;
```

**Check if user has any permission for resource:**
```sql
SELECT EXISTS(
  SELECT 1
  FROM sys_user_roles ur
  JOIN sys_role_permissions rp ON ur.role_id = rp.role_id
  JOIN sys_permissions p ON rp.permission_id = p.id
  WHERE ur.user_id = ?
    AND ur.tenant_id = ?
    AND p.resource = ?
    AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
) AS has_resource_access;
```

### User Role Queries

**Get all roles for user in tenant:**
```sql
SELECT r.*, ur.expires_at, ur.assigned_by
FROM sys_user_roles ur
JOIN sys_roles r ON ur.role_id = r.id
WHERE ur.user_id = ?
  AND ur.tenant_id = ?
  AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
ORDER BY r.priority DESC, r.name;
```

**Get all users with specific role in tenant:**
```sql
SELECT u.*, ur.expires_at, ur.assigned_by
FROM sys_user_roles ur
JOIN sys_users u ON ur.user_id = u.id
WHERE ur.role_id = ?
  AND ur.tenant_id = ?
  AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
  AND u.is_active = true
ORDER BY u.full_name;
```

**Get users with expired role assignments:**
```sql
SELECT u.*, r.name as role_name, ur.expires_at
FROM sys_user_roles ur
JOIN sys_users u ON ur.user_id = u.id
JOIN sys_roles r ON ur.role_id = r.id
WHERE ur.tenant_id = ?
  AND ur.expires_at IS NOT NULL
  AND ur.expires_at < NOW()
ORDER BY ur.expires_at DESC;
```

### Tenant-Scoped Queries

**Get all active roles in tenant:**
```sql
SELECT r.*
FROM sys_roles r
WHERE r.tenant_id = ?
ORDER BY r.priority DESC, r.name;
```

**Get default roles for tenant:**
```sql
SELECT r.*
FROM sys_roles r
WHERE r.tenant_id = ?
  AND r.is_default = true
ORDER BY r.priority DESC;
```

**Get all users in tenant with their roles:**
```sql
SELECT 
  u.id,
  u.full_name,
  u.email,
  ARRAY_AGG(r.name) as roles,
  ARRAY_AGG(r.key) as role_keys
FROM sys_users u
JOIN sys_user_roles ur ON u.id = ur.user_id
JOIN sys_roles r ON ur.role_id = r.id
WHERE ur.tenant_id = ?
  AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
  AND u.is_active = true
GROUP BY u.id, u.full_name, u.email
ORDER BY u.full_name;
```

### Role Management Queries

**Get all permissions for a role:**
```sql
SELECT p.*
FROM sys_role_permissions rp
JOIN sys_permissions p ON rp.permission_id = p.id
WHERE rp.role_id = ?
ORDER BY p.resource, p.action;
```

**Get roles that have a specific permission:**
```sql
SELECT r.*
FROM sys_roles r
JOIN sys_role_permissions rp ON r.id = rp.role_id
JOIN sys_permissions p ON rp.permission_id = p.id
WHERE p.key = ?
  AND r.tenant_id = ?
ORDER BY r.name;
```

**Assign role to user in tenant:**
```sql
INSERT INTO sys_user_roles (tenant_id, user_id, role_id, assigned_by)
VALUES (?, ?, ?, ?)
ON CONFLICT (tenant_id, user_id, role_id) DO NOTHING;
```

**Remove role from user:**
```sql
DELETE FROM sys_user_roles
WHERE tenant_id = ?
  AND user_id = ?
  AND role_id = ?;
```

**Assign permission to role:**
```sql
INSERT INTO sys_role_permissions (role_id, permission_id)
VALUES (?, ?)
ON CONFLICT (role_id, permission_id) DO NOTHING;
```

---

## Design Considerations

### Multi-Tenancy Patterns

1. **Tenant Isolation:**
   - All tenant-scoped tables include `tenant_id`
   - RLS policies filter by tenant membership
   - Users can belong to multiple tenants with different roles

2. **Data Isolation:**
   - Tenant deletion cascades to all tenant-scoped data
   - Soft delete pattern (`deleted_at`) for data retention
   - Tenant status controls access ('active', 'suspended', 'deleted')

3. **Primary Tenant:**
   - `sys_users.primary_tenant_id` provides default tenant context
   - Users can still access other tenants via `sys_user_roles`

### RBAC Best Practices

1. **Role Hierarchy:**
   - Use `priority` field for role importance
   - System roles (`is_system = true`) should be protected
   - Default roles (`is_default = true`) auto-assigned to new members

2. **Permission Model:**
   - Resource-action pattern: `{resource}.{action}` (e.g., 'order.read')
   - Global permissions ensure consistency across tenants
   - RESTRICT on permission delete prevents breaking role assignments

3. **Role Assignment:**
   - Track who assigned roles (`assigned_by`)
   - Support expiring assignments (`expires_at`)
   - Composite unique constraint prevents duplicate assignments

4. **Security:**
   - Always check `expires_at` when querying active roles
   - Filter by `is_active` for users
   - Use RLS policies for tenant isolation

### RLS (Row Level Security) Notes

1. **Tenant Isolation:**
   ```sql
   -- Example policy for sys_roles
   CREATE POLICY tenant_isolation ON sys_roles
   FOR ALL
   USING (
     tenant_id IN (
       SELECT tenant_id FROM sys_user_roles
       WHERE user_id = auth.uid()
     )
   );
   ```

2. **User Data Access:**
   - Users can see their own profile
   - Users can see data for tenants they belong to
   - Admins can see all data in their tenant

3. **Permission Checks:**
   - Application-level permission checks recommended
   - RLS can enforce tenant isolation
   - Combine RLS with application logic for full security

---

## Integration Points

### With Auth System (Supabase)
- `auth.users` provides authentication
- `sys_users.auth_user_id` links to auth users (one-to-one)
- `sys_tenants.owner_user_id` links tenant to owner

### With Other Modules
- **Logging:** `logs_human`, `logs_system`, `logs_webhook` reference `tenant_id`
- **Alerts/Notes:** Can reference `tenant_id` for tenant-scoped alerts/notes
- **All Modules:** Should include `tenant_id` for multi-tenant isolation

### Tenant Context
- All queries should filter by `tenant_id`
- RLS policies enforce tenant isolation
- Users can switch between tenants they belong to

---

## Notes

- **Global vs Tenant-Scoped:**
  - `sys_permissions` is global (shared across all tenants)
  - `sys_roles` is tenant-scoped (each tenant has its own roles)
  - `sys_user_roles` includes tenant context (users have roles per tenant)

- **Cascade Behaviors:**
  - Tenant deletion removes all tenant-scoped data
  - Role deletion removes role-permission and user-role links
  - Permission deletion is RESTRICTED to prevent breaking roles

- **Soft Delete Patterns:**
  - `sys_tenants.deleted_at` for tenant soft delete
  - `sys_users.deactivated_at` for user deactivation
  - Consider adding soft delete to other tables if needed

- **Expiring Assignments:**
  - `sys_user_roles.expires_at` supports temporary role assignments
  - NULL = permanent, non-NULL = expires at that time
  - Always filter by expiration when querying active roles

- **System Roles:**
  - `is_system = true` roles should be protected from deletion
  - Typically include: 'admin', 'viewer', 'editor'
  - Custom roles can be created per tenant

- **Default Roles:**
  - `is_default = true` roles are auto-assigned to new tenant members
  - Typically 'viewer' or 'member' role
  - Can have multiple default roles per tenant

