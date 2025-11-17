/**
 * System Module - Data Access Hooks
 * React hooks for querying System module tables
 */

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase/client'
import type {
  SysTenant,
  SysTenantInsert,
  SysTenantUpdate,
  SysUser,
  SysUserInsert,
  SysUserUpdate,
  SysRole,
  SysRoleInsert,
  SysRoleUpdate,
  SysPermission,
  SysRolePermission,
  SysRolePermissionInsert,
  SysUserRole,
  SysUserRoleInsert,
  SysUserRoleUpdate,
  SysUserWithRoles,
  SysRoleWithPermissions,
} from '../types/database/system'

// ============================================
// TENANTS
// ============================================

export function useTenants() {
  const [tenants, setTenants] = useState<SysTenant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    loadTenants()
  }, [])

  const loadTenants = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Check if Supabase is configured
      if (!supabase) {
        throw new Error('Supabase client is not configured. Please check your environment variables.')
      }

      const { data, error: err } = await supabase
        .from('sys_tenants')
        .select('*')
        .is('deleted_at', null) // Only active tenants
        .order('created_at', { ascending: false })

      if (err) {
        console.error('Supabase error:', err)
        // Check for specific error types
        if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
          throw new Error('Network error: Unable to connect to Supabase. Please check your internet connection and Supabase project status.')
        }
        if (err.code === 'PGRST116') {
          throw new Error('Table not found: The sys_tenants table does not exist. Please create it in your Supabase database.')
        }
        throw new Error(err.message || 'Failed to load tenants from database')
      }
      
      setTenants(data || [])
      setError(null)
    } catch (err) {
      let errorMessage = 'Unknown error occurred'
      
      if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        errorMessage = 'Network error: Unable to connect to Supabase. Please check:\n- Your internet connection\n- Supabase project is active (not paused)\n- Browser console for CORS errors'
      } else if (err instanceof Error) {
        errorMessage = err.message
      } else if (typeof err === 'string') {
        errorMessage = err
      }
      
      setError(new Error(errorMessage))
      console.error('Error loading tenants:', err)
      
      // Log the full error object for debugging
      if (err && typeof err === 'object') {
        console.error('Full error object:', JSON.stringify(err, null, 2))
      }
    } finally {
      setLoading(false)
    }
  }

  const createTenant = async (tenant: SysTenantInsert) => {
    const { data, error: err } = await supabase
      .from('sys_tenants')
      .insert(tenant)
      .select()
      .single()

    if (err) throw err
    await loadTenants()
    return data
  }

  const updateTenant = async (id: number, updates: SysTenantUpdate) => {
    const { data, error: err } = await supabase
      .from('sys_tenants')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (err) throw err
    await loadTenants()
    return data
  }

  const deleteTenant = async (id: number) => {
    // Soft delete
    const { error: err } = await supabase
      .from('sys_tenants')
      .update({ deleted_at: new Date().toISOString(), status: 'deleted' })
      .eq('id', id)

    if (err) throw err
    await loadTenants()
  }

  return {
    tenants,
    loading,
    error,
    createTenant,
    updateTenant,
    deleteTenant,
    refresh: loadTenants,
  }
}

export function useTenant(id: number | null) {
  const [tenant, setTenant] = useState<SysTenant | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (id) {
      loadTenant()
    } else {
      setTenant(null)
      setLoading(false)
    }
  }, [id])

  const loadTenant = async () => {
    if (!id) return
    try {
      setLoading(true)
      const { data, error: err } = await supabase
        .from('sys_tenants')
        .select('*')
        .eq('id', id)
        .single()

      if (err) throw err
      setTenant(data)
      setError(null)
    } catch (err) {
      setError(err as Error)
      console.error('Error loading tenant:', err)
    } finally {
      setLoading(false)
    }
  }

  return { tenant, loading, error, refresh: loadTenant }
}

// ============================================
// USERS
// ============================================

export function useUsers(tenantId?: number) {
  const [users, setUsers] = useState<SysUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    loadUsers()
  }, [tenantId])

  const loadUsers = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('sys_users')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (tenantId) {
        query = query.eq('primary_tenant_id', tenantId)
      }

      const { data, error: err } = await query

      if (err) throw err
      setUsers(data || [])
      setError(null)
    } catch (err) {
      setError(err as Error)
      console.error('Error loading users:', err)
    } finally {
      setLoading(false)
    }
  }

  const createUser = async (user: SysUserInsert) => {
    const { data, error: err } = await supabase
      .from('sys_users')
      .insert(user)
      .select()
      .single()

    if (err) throw err
    await loadUsers()
    return data
  }

  const updateUser = async (id: number, updates: SysUserUpdate) => {
    const { data, error: err } = await supabase
      .from('sys_users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (err) throw err
    await loadUsers()
    return data
  }

  const deleteUser = async (id: number) => {
    // Soft delete by deactivating
    const { error: err } = await supabase
      .from('sys_users')
      .update({
        is_active: false,
        deactivated_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (err) throw err
    await loadUsers()
  }

  return {
    users,
    loading,
    error,
    createUser,
    updateUser,
    deleteUser,
    refresh: loadUsers,
  }
}

export function useUser(id: number | null) {
  const [user, setUser] = useState<SysUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (id) {
      loadUser()
    } else {
      setUser(null)
      setLoading(false)
    }
  }, [id])

  const loadUser = async () => {
    if (!id) return
    try {
      setLoading(true)
      const { data, error: err } = await supabase
        .from('sys_users')
        .select('*')
        .eq('id', id)
        .single()

      if (err) throw err
      setUser(data)
      setError(null)
    } catch (err) {
      setError(err as Error)
      console.error('Error loading user:', err)
    } finally {
      setLoading(false)
    }
  }

  return { user, loading, error, refresh: loadUser }
}

// ============================================
// ROLES
// ============================================

export function useRoles(tenantId: number | null) {
  const [roles, setRoles] = useState<SysRole[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (tenantId) {
      loadRoles()
    } else {
      setRoles([])
      setLoading(false)
    }
  }, [tenantId])

  const loadRoles = async () => {
    if (!tenantId) return
    try {
      setLoading(true)
      const { data, error: err } = await supabase
        .from('sys_roles')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('priority', { ascending: false })
        .order('name', { ascending: true })

      if (err) throw err
      setRoles(data || [])
      setError(null)
    } catch (err) {
      setError(err as Error)
      console.error('Error loading roles:', err)
    } finally {
      setLoading(false)
    }
  }

  const createRole = async (role: SysRoleInsert) => {
    const { data, error: err } = await supabase
      .from('sys_roles')
      .insert(role)
      .select()
      .single()

    if (err) throw err
    await loadRoles()
    return data
  }

  const updateRole = async (id: number, updates: SysRoleUpdate) => {
    const { data, error: err } = await supabase
      .from('sys_roles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (err) throw err
    await loadRoles()
    return data
  }

  const deleteRole = async (id: number) => {
    const { error: err } = await supabase
      .from('sys_roles')
      .delete()
      .eq('id', id)

    if (err) throw err
    await loadRoles()
  }

  return {
    roles,
    loading,
    error,
    createRole,
    updateRole,
    deleteRole,
    refresh: loadRoles,
  }
}

// ============================================
// PERMISSIONS
// ============================================

export function usePermissions() {
  const [permissions, setPermissions] = useState<SysPermission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    loadPermissions()
  }, [])

  const loadPermissions = async () => {
    try {
      setLoading(true)
      const { data, error: err } = await supabase
        .from('sys_permissions')
        .select('*')
        .order('resource', { ascending: true })
        .order('action', { ascending: true })

      if (err) throw err
      setPermissions(data || [])
      setError(null)
    } catch (err) {
      setError(err as Error)
      console.error('Error loading permissions:', err)
    } finally {
      setLoading(false)
    }
  }

  return {
    permissions,
    loading,
    error,
    refresh: loadPermissions,
  }
}

// ============================================
// ROLE PERMISSIONS
// ============================================

export function useRolePermissions(roleId: number | null) {
  const [permissions, setPermissions] = useState<SysPermission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (roleId) {
      loadRolePermissions()
    } else {
      setPermissions([])
      setLoading(false)
    }
  }, [roleId])

  const loadRolePermissions = async () => {
    if (!roleId) return
    try {
      setLoading(true)
      const { data, error: err } = await supabase
        .from('sys_role_permissions')
        .select(`
          permission_id,
          sys_permissions (*)
        `)
        .eq('role_id', roleId)

      if (err) throw err
      const perms = (data || []).map((rp: any) => rp.sys_permissions).filter(Boolean)
      setPermissions(perms)
      setError(null)
    } catch (err) {
      setError(err as Error)
      console.error('Error loading role permissions:', err)
    } finally {
      setLoading(false)
    }
  }

  const addPermission = async (permissionId: number) => {
    if (!roleId) return
    const { error: err } = await supabase
      .from('sys_role_permissions')
      .insert({ role_id: roleId, permission_id: permissionId })

    if (err) throw err
    await loadRolePermissions()
  }

  const removePermission = async (permissionId: number) => {
    if (!roleId) return
    const { error: err } = await supabase
      .from('sys_role_permissions')
      .delete()
      .eq('role_id', roleId)
      .eq('permission_id', permissionId)

    if (err) throw err
    await loadRolePermissions()
  }

  return {
    permissions,
    loading,
    error,
    addPermission,
    removePermission,
    refresh: loadRolePermissions,
  }
}

// ============================================
// USER ROLES
// ============================================

export function useUserRoles(tenantId: number | null, userId?: number | null) {
  const [userRoles, setUserRoles] = useState<SysUserRole[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (tenantId) {
      loadUserRoles()
    } else {
      setUserRoles([])
      setLoading(false)
    }
  }, [tenantId, userId])

  const loadUserRoles = async () => {
    if (!tenantId) return
    try {
      setLoading(true)
      let query = supabase
        .from('sys_user_roles')
        .select('*')
        .eq('tenant_id', tenantId)

      if (userId) {
        query = query.eq('user_id', userId)
      }

      const { data, error: err } = await query.order('created_at', { ascending: false })

      if (err) throw err
      setUserRoles(data || [])
      setError(null)
    } catch (err) {
      setError(err as Error)
      console.error('Error loading user roles:', err)
    } finally {
      setLoading(false)
    }
  }

  const assignRole = async (userRole: SysUserRoleInsert) => {
    const { data, error: err } = await supabase
      .from('sys_user_roles')
      .insert(userRole)
      .select()
      .single()

    if (err) throw err
    await loadUserRoles()
    return data
  }

  const removeRole = async (id: number) => {
    const { error: err } = await supabase
      .from('sys_user_roles')
      .delete()
      .eq('id', id)

    if (err) throw err
    await loadUserRoles()
  }

  const updateUserRole = async (id: number, updates: SysUserRoleUpdate) => {
    const { data, error: err } = await supabase
      .from('sys_user_roles')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (err) throw err
    await loadUserRoles()
    return data
  }

  return {
    userRoles,
    loading,
    error,
    assignRole,
    removeRole,
    updateUserRole,
    refresh: loadUserRoles,
  }
}

// ============================================
// BRANDS
// ============================================

export interface Brand {
  id: number
  tenant_id: number
  code: string
  name: string
  description?: string | null
  logo_url?: string | null
  status: 'active' | 'inactive' | 'archived'
  website_url?: string | null
  metadata?: any
  created_by?: number | null
  updated_by?: number | null
  created_at: string
  updated_at: string
  deleted_at?: string | null
}

export interface BrandInsert {
  tenant_id: number
  code: string
  name: string
  description?: string | null
  logo_url?: string | null
  status?: 'active' | 'inactive' | 'archived'
  website_url?: string | null
  metadata?: any
  created_by?: number | null
}

export interface BrandUpdate {
  code?: string
  name?: string
  description?: string | null
  logo_url?: string | null
  status?: 'active' | 'inactive' | 'archived'
  website_url?: string | null
  metadata?: any
  updated_by?: number | null
}

export function useBrands(tenantId: number | null) {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (tenantId) {
      loadBrands()
    } else {
      setBrands([])
      setLoading(false)
    }
  }, [tenantId])

  const loadBrands = async () => {
    if (!tenantId) return
    try {
      setLoading(true)
      const { data, error: err } = await supabase
        .from('sys_brands')
        .select('*')
        .eq('tenant_id', tenantId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })

      if (err) throw err
      setBrands(data || [])
      setError(null)
    } catch (err) {
      setError(err as Error)
      console.error('Error loading brands:', err)
    } finally {
      setLoading(false)
    }
  }

  const createBrand = async (brand: BrandInsert) => {
    const { data, error: err } = await supabase
      .from('sys_brands')
      .insert(brand)
      .select()
      .single()

    if (err) throw err
    await loadBrands()
    return data
  }

  const updateBrand = async (id: number, updates: BrandUpdate) => {
    const { data, error: err } = await supabase
      .from('sys_brands')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (err) throw err
    await loadBrands()
    return data
  }

  const deleteBrand = async (id: number) => {
    const { error: err } = await supabase
      .from('sys_brands')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)

    if (err) throw err
    await loadBrands()
  }

  return {
    brands,
    loading,
    error,
    createBrand,
    updateBrand,
    deleteBrand,
    refresh: loadBrands,
  }
}

// ============================================
// STORES
// ============================================

export interface Store {
  id: number
  tenant_id: number
  brand_id?: number | null
  code: string
  name: string
  description?: string | null
  address_line1?: string | null
  address_line2?: string | null
  city?: string | null
  state?: string | null
  country?: string | null
  postal_code?: string | null
  phone?: string | null
  email?: string | null
  status: 'active' | 'inactive' | 'closed'
  is_headquarters: boolean
  manager_user_id?: number | null
  opening_date?: string | null
  closing_date?: string | null
  timezone?: string | null
  metadata?: any
  created_by?: number | null
  updated_by?: number | null
  created_at: string
  updated_at: string
  deleted_at?: string | null
}

export interface StoreInsert {
  tenant_id: number
  brand_id?: number | null
  code: string
  name: string
  description?: string | null
  address_line1?: string | null
  address_line2?: string | null
  city?: string | null
  state?: string | null
  country?: string | null
  postal_code?: string | null
  phone?: string | null
  email?: string | null
  status?: 'active' | 'inactive' | 'closed'
  is_headquarters?: boolean
  manager_user_id?: number | null
  opening_date?: string | null
  closing_date?: string | null
  timezone?: string | null
  metadata?: any
  created_by?: number | null
}

export interface StoreUpdate {
  brand_id?: number | null
  code?: string
  name?: string
  description?: string | null
  address_line1?: string | null
  address_line2?: string | null
  city?: string | null
  state?: string | null
  country?: string | null
  postal_code?: string | null
  phone?: string | null
  email?: string | null
  status?: 'active' | 'inactive' | 'closed'
  is_headquarters?: boolean
  manager_user_id?: number | null
  opening_date?: string | null
  closing_date?: string | null
  timezone?: string | null
  metadata?: any
  updated_by?: number | null
}

export function useStores(tenantId: number | null) {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (tenantId) {
      loadStores()
    } else {
      setStores([])
      setLoading(false)
    }
  }, [tenantId])

  const loadStores = async () => {
    if (!tenantId) return
    try {
      setLoading(true)
      const { data, error: err } = await supabase
        .from('sys_stores')
        .select('*')
        .eq('tenant_id', tenantId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })

      if (err) throw err
      setStores(data || [])
      setError(null)
    } catch (err) {
      setError(err as Error)
      console.error('Error loading stores:', err)
    } finally {
      setLoading(false)
    }
  }

  const createStore = async (store: StoreInsert) => {
    const { data, error: err } = await supabase
      .from('sys_stores')
      .insert(store)
      .select()
      .single()

    if (err) throw err
    await loadStores()
    return data
  }

  const updateStore = async (id: number, updates: StoreUpdate) => {
    const { data, error: err } = await supabase
      .from('sys_stores')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (err) throw err
    await loadStores()
    return data
  }

  const deleteStore = async (id: number) => {
    const { error: err } = await supabase
      .from('sys_stores')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)

    if (err) throw err
    await loadStores()
  }

  return {
    stores,
    loading,
    error,
    createStore,
    updateStore,
    deleteStore,
    refresh: loadStores,
  }
}

// ============================================
// WAREHOUSES
// ============================================

export interface Warehouse {
  id: number
  tenant_id: number
  code: string
  name: string
  address?: string | null
  city?: string | null
  country?: string | null
  phone?: string | null
  email?: string | null
  manager_id?: number | null
  status: string
  created_at: string
  updated_at: string
  created_by_id?: number | null
  updated_by_id?: number | null
}

export interface WarehouseInsert {
  tenant_id: number
  code: string
  name: string
  address?: string | null
  city?: string | null
  country?: string | null
  phone?: string | null
  email?: string | null
  manager_id?: number | null
  status?: string
  created_by_id?: number | null
}

export interface WarehouseUpdate {
  code?: string
  name?: string
  address?: string | null
  city?: string | null
  country?: string | null
  phone?: string | null
  email?: string | null
  manager_id?: number | null
  status?: string
  updated_by_id?: number | null
}

export function useWarehouses(tenantId: number | null) {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (tenantId) {
      loadWarehouses()
    } else {
      setWarehouses([])
      setLoading(false)
    }
  }, [tenantId])

  const loadWarehouses = async () => {
    if (!tenantId) return
    try {
      setLoading(true)
      const { data, error: err } = await supabase
        .from('warehouse')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false })

      if (err) throw err
      setWarehouses(data || [])
      setError(null)
    } catch (err) {
      setError(err as Error)
      console.error('Error loading warehouses:', err)
    } finally {
      setLoading(false)
    }
  }

  const createWarehouse = async (warehouse: WarehouseInsert) => {
    const { data, error: err } = await supabase
      .from('warehouse')
      .insert(warehouse)
      .select()
      .single()

    if (err) throw err
    await loadWarehouses()
    return data
  }

  const updateWarehouse = async (id: number, updates: WarehouseUpdate) => {
    const { data, error: err } = await supabase
      .from('warehouse')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (err) throw err
    await loadWarehouses()
    return data
  }

  const deleteWarehouse = async (id: number) => {
    const { error: err } = await supabase
      .from('warehouse')
      .delete()
      .eq('id', id)

    if (err) throw err
    await loadWarehouses()
  }

  return {
    warehouses,
    loading,
    error,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
    refresh: loadWarehouses,
  }
}

