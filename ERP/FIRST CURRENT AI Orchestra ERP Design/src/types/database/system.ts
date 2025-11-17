/**
 * System Module - Database Type Definitions
 * Types matching the database schema from system_tenant_schema_map.md
 */

// ============================================
// SYS_TENANTS
// ============================================

export interface SysTenant {
  id: number
  name: string
  slug: string
  status: 'active' | 'suspended' | 'deleted'
  owner_user_id: string | null // UUID from auth.users
  created_at: string
  updated_at: string
  billing_plan: string | null
  metadata: Record<string, any> | null
  deleted_at: string | null
  is_personal: boolean
  timezone: string | null
  locale: string | null
  domain: string | null
  external_id: string | null
  notes: string | null
}

export interface SysTenantInsert {
  name: string
  slug: string
  status?: 'active' | 'suspended' | 'deleted'
  owner_user_id?: string | null
  billing_plan?: string | null
  metadata?: Record<string, any>
  is_personal?: boolean
  timezone?: string | null
  locale?: string | null
  domain?: string | null
  external_id?: string | null
  notes?: string | null
}

export interface SysTenantUpdate {
  name?: string
  slug?: string
  status?: 'active' | 'suspended' | 'deleted'
  owner_user_id?: string | null
  billing_plan?: string | null
  metadata?: Record<string, any>
  deleted_at?: string | null
  is_personal?: boolean
  timezone?: string | null
  locale?: string | null
  domain?: string | null
  external_id?: string | null
  notes?: string | null
  updated_at?: string
}

// ============================================
// SYS_USERS
// ============================================

export interface SysUser {
  id: number
  auth_user_id: string // UUID from auth.users
  primary_tenant_id: number | null
  email: string | null
  phone: string | null
  full_name: string | null
  avatar_url: string | null
  is_active: boolean
  last_sign_in_at: string | null
  created_at: string
  updated_at: string
  metadata: Record<string, any> | null
  external_id: string | null
  locale: string | null
  timezone: string | null
  deactivated_at: string | null
  notes: string | null
  title: string | null
  department: string | null
  manager_user_id: number | null
}

export interface SysUserInsert {
  auth_user_id: string
  primary_tenant_id?: number | null
  email?: string | null
  phone?: string | null
  full_name?: string | null
  avatar_url?: string | null
  is_active?: boolean
  metadata?: Record<string, any>
  external_id?: string | null
  locale?: string | null
  timezone?: string | null
  title?: string | null
  department?: string | null
  manager_user_id?: number | null
  notes?: string | null
}

export interface SysUserUpdate {
  primary_tenant_id?: number | null
  email?: string | null
  phone?: string | null
  full_name?: string | null
  avatar_url?: string | null
  is_active?: boolean
  last_sign_in_at?: string | null
  metadata?: Record<string, any>
  external_id?: string | null
  locale?: string | null
  timezone?: string | null
  deactivated_at?: string | null
  notes?: string | null
  title?: string | null
  department?: string | null
  manager_user_id?: number | null
  updated_at?: string
}

// ============================================
// SYS_ROLES
// ============================================

export interface SysRole {
  id: number
  tenant_id: number
  key: string
  name: string
  description: string | null
  is_system: boolean
  is_default: boolean
  priority: number
  created_at: string
  updated_at: string
  external_id: string | null
  metadata: Record<string, any> | null
}

export interface SysRoleInsert {
  tenant_id: number
  key: string
  name: string
  description?: string | null
  is_system?: boolean
  is_default?: boolean
  priority?: number
  external_id?: string | null
  metadata?: Record<string, any>
}

export interface SysRoleUpdate {
  key?: string
  name?: string
  description?: string | null
  is_system?: boolean
  is_default?: boolean
  priority?: number
  external_id?: string | null
  metadata?: Record<string, any>
  updated_at?: string
}

// ============================================
// SYS_PERMISSIONS
// ============================================

export interface SysPermission {
  id: number
  key: string
  name: string
  description: string | null
  resource: string | null
  action: string | null
  created_at: string
  updated_at: string
  tags: string[] | null
  metadata: Record<string, any> | null
}

export interface SysPermissionInsert {
  key: string
  name: string
  description?: string | null
  resource?: string | null
  action?: string | null
  tags?: string[] | null
  metadata?: Record<string, any>
}

export interface SysPermissionUpdate {
  key?: string
  name?: string
  description?: string | null
  resource?: string | null
  action?: string | null
  tags?: string[] | null
  metadata?: Record<string, any>
  updated_at?: string
}

// ============================================
// SYS_ROLE_PERMISSIONS
// ============================================

export interface SysRolePermission {
  role_id: number
  permission_id: number
  created_at: string
}

export interface SysRolePermissionInsert {
  role_id: number
  permission_id: number
}

// ============================================
// SYS_USER_ROLES
// ============================================

export interface SysUserRole {
  id: number
  tenant_id: number
  user_id: number
  role_id: number
  created_at: string
  expires_at: string | null
  assigned_by: number | null
  metadata: Record<string, any> | null
}

export interface SysUserRoleInsert {
  tenant_id: number
  user_id: number
  role_id: number
  expires_at?: string | null
  assigned_by?: number | null
  metadata?: Record<string, any>
}

export interface SysUserRoleUpdate {
  expires_at?: string | null
  assigned_by?: number | null
  metadata?: Record<string, any>
}

// ============================================
// JOINED TYPES (for queries with relations)
// ============================================

export interface SysUserWithRoles extends SysUser {
  roles?: Array<SysRole & { assigned_at: string; expires_at: string | null }>
  primary_tenant?: SysTenant | null
}

export interface SysRoleWithPermissions extends SysRole {
  permissions?: SysPermission[]
  user_count?: number
}

export interface SysTenantWithUsers extends SysTenant {
  users?: SysUser[]
  roles?: SysRole[]
}

