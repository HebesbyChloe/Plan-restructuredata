"use client";

import { useState, useMemo } from "react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Badge } from "../../ui/badge";
import { Switch } from "../../ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import {
  Shield,
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  CheckSquare,
  Lock,
  Eye,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { motion } from "motion/react";
import { Checkbox } from "../../ui/checkbox";
import { useTenantContext } from "../../../contexts/TenantContext";
import { useRoles, usePermissions, useRolePermissions, useUserRoles } from "../../../hooks/useSystem";
import { supabase } from "../../../lib/supabase/client";
import { toast } from "sonner";
import type { SysRoleInsert } from "../../../types/database/system";

export function RolePermissionPage() {
  const { currentTenantId } = useTenantContext();
  const { roles, loading: rolesLoading, error: rolesError, createRole, updateRole, deleteRole, refresh: refreshRoles } = useRoles(currentTenantId);
  const { permissions, loading: permissionsLoading } = usePermissions();
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const { permissions: rolePermissions, addPermission, removePermission } = useRolePermissions(selectedRoleId);
  const { userRoles } = useUserRoles(currentTenantId);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<number | null>(null);
  
  const [newRoleForm, setNewRoleForm] = useState({
    name: "",
    key: "",
    description: "",
    priority: 0,
    is_system: false,
    is_default: false,
  });
  
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

  // Group permissions by resource
  const permissionCategories = useMemo(() => {
    if (!permissions) return [];
    
    const grouped: Record<string, Array<{ id: number; key: string; name: string; action: string | null }>> = {};
    
    permissions.forEach((perm) => {
      const resource = perm.resource || "other";
      if (!grouped[resource]) {
        grouped[resource] = [];
      }
      grouped[resource].push({
        id: perm.id,
        key: perm.key,
        name: perm.name,
        action: perm.action,
      });
    });
    
    return Object.entries(grouped).map(([resource, perms]) => ({
      name: resource.charAt(0).toUpperCase() + resource.slice(1),
      permissions: perms,
    }));
  }, [permissions]);

  // Get user count for each role
  const roleUserCounts = useMemo(() => {
    if (!userRoles || !roles) return {};
    const counts: Record<number, number> = {};
    roles.forEach((role) => {
      counts[role.id] = userRoles.filter((ur) => ur.role_id === role.id).length;
    });
    return counts;
  }, [userRoles, roles]);

  // Filter roles by search term
  const filteredRoles = useMemo(() => {
    if (!roles) return [];
    if (!searchTerm) return roles;
    const term = searchTerm.toLowerCase();
    return roles.filter(
      (role) =>
        role.name.toLowerCase().includes(term) ||
        role.description?.toLowerCase().includes(term) ||
        role.key.toLowerCase().includes(term)
    );
  }, [roles, searchTerm]);

  const handleCreateRole = async () => {
    if (!currentTenantId) {
      toast.error("Please select a tenant first");
      return;
    }

    if (!newRoleForm.name || !newRoleForm.key) {
      toast.error("Role name and key are required");
      return;
    }

    try {
      const roleData: SysRoleInsert = {
        tenant_id: currentTenantId,
        name: newRoleForm.name,
        key: newRoleForm.key.toLowerCase().replace(/\s+/g, "_"),
        description: newRoleForm.description || null,
        priority: newRoleForm.priority,
        is_system: newRoleForm.is_system,
        is_default: newRoleForm.is_default,
      };

      const newRole = await createRole(roleData);
      
      // Assign selected permissions
      if (selectedPermissions.length > 0 && newRole) {
        // Temporarily set selectedRoleId to load the role permissions hook
        setSelectedRoleId(newRole.id);
        
        // Wait a bit for the hook to initialize
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Now assign permissions
        for (const permId of selectedPermissions) {
          try {
            // Use supabase directly since we need roleId
            const { error: err } = await supabase
              .from('sys_role_permissions')
              .insert({ role_id: newRole.id, permission_id: permId });
            
            if (err) throw err;
          } catch (err) {
            console.error("Failed to assign permission:", err);
            toast.error(`Failed to assign permission: ${err}`);
          }
        }
        
        setSelectedRoleId(null);
      }

      toast.success("Role created successfully");
      setIsCreateDialogOpen(false);
      setNewRoleForm({
        name: "",
        key: "",
        description: "",
        priority: 0,
        is_system: false,
        is_default: false,
      });
      setSelectedPermissions([]);
      await refreshRoles();
    } catch (error: any) {
      toast.error("Failed to create role: " + error.message);
    }
  };

  const handleEditRole = (roleId: number) => {
    const role = roles?.find((r) => r.id === roleId);
    if (!role) return;
    
    setEditingRole(roleId);
    setSelectedRoleId(roleId);
    setNewRoleForm({
      name: role.name,
      key: role.key,
      description: role.description || "",
      priority: role.priority,
      is_system: role.is_system,
      is_default: role.is_default,
    });
    
    // Load role permissions
    if (rolePermissions) {
      setSelectedPermissions(rolePermissions.map((p) => p.id));
    }
    
    setIsEditDialogOpen(true);
  };

  const handleUpdateRole = async () => {
    if (!editingRole) return;

    try {
      await updateRole(editingRole, {
        name: newRoleForm.name,
        key: newRoleForm.key.toLowerCase().replace(/\s+/g, "_"),
        description: newRoleForm.description || null,
        priority: newRoleForm.priority,
        is_system: newRoleForm.is_system,
        is_default: newRoleForm.is_default,
      });

      // Update permissions
      const currentPermIds = rolePermissions?.map((p) => p.id) || [];
      const toAdd = selectedPermissions.filter((id) => !currentPermIds.includes(id));
      const toRemove = currentPermIds.filter((id) => !selectedPermissions.includes(id));

      for (const permId of toAdd) {
        await addPermission(permId);
      }
      for (const permId of toRemove) {
        await removePermission(permId);
      }

      toast.success("Role updated successfully");
      setIsEditDialogOpen(false);
      setEditingRole(null);
      setSelectedRoleId(null);
      await refreshRoles();
    } catch (error: any) {
      toast.error("Failed to update role: " + error.message);
    }
  };

  const handleDeleteRole = async (roleId: number) => {
    if (!confirm("Are you sure you want to delete this role? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteRole(roleId);
      toast.success("Role deleted successfully");
      await refreshRoles();
    } catch (error: any) {
      toast.error("Failed to delete role: " + error.message);
    }
  };

  const needsDatabaseSetup = rolesError?.message?.includes("relation") || rolesError?.message?.includes("does not exist");

  if (needsDatabaseSetup) {
    return (
      <div className="space-y-6">
        <Card className="p-8 bg-white dark:bg-card border-[#E5E5E5]">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="mb-2">Database Setup Required</h2>
              <p className="text-muted-foreground mb-0">
                The <code className="px-2 py-1 bg-muted rounded">sys_roles</code>, <code className="px-2 py-1 bg-muted rounded">sys_permissions</code>, and <code className="px-2 py-1 bg-muted rounded">sys_role_permissions</code> tables need to be created in your Supabase database.
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!currentTenantId) {
    return (
      <div className="space-y-6">
        <Card className="p-8 bg-white dark:bg-card border-[#E5E5E5]">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="mb-2">Select a Tenant</h2>
              <p className="text-muted-foreground mb-0">
                Please select a tenant from Company Settings to manage roles and permissions.
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4B6BFB] to-[#6B8AFF] flex items-center justify-center shadow-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="mb-1">Role & Permission</h1>
            <p className="text-sm text-muted-foreground mb-0">
              Configure roles and access permissions
            </p>
          </div>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <Button 
            className="gap-2 bg-gradient-to-r from-[#4B6BFB] to-[#6B8AFF] hover:from-[#3B5BEB] to-[#5B7AEF] text-white"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Create Role
          </Button>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
              <DialogDescription>
                Define a new role with specific permissions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm mb-2 block">Role Name</label>
                  <Input
                    value={newRoleForm.name}
                    onChange={(e) => setNewRoleForm({ ...newRoleForm, name: e.target.value })}
                    placeholder="e.g., Content Manager"
                    className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                  />
                </div>
                <div>
                  <label className="text-sm mb-2 block">Role Key</label>
                  <Input
                    value={newRoleForm.key}
                    onChange={(e) => setNewRoleForm({ ...newRoleForm, key: e.target.value })}
                    placeholder="content_manager"
                    className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm mb-2 block">Description</label>
                <Input
                  value={newRoleForm.description}
                  onChange={(e) => setNewRoleForm({ ...newRoleForm, description: e.target.value })}
                  placeholder="Brief description of this role"
                  className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm mb-2 block">Priority</label>
                  <Input
                    type="number"
                    value={newRoleForm.priority}
                    onChange={(e) => setNewRoleForm({ ...newRoleForm, priority: parseInt(e.target.value) || 0 })}
                    className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                  />
                </div>
                <div className="flex items-center gap-6 pt-6">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="create-system-role"
                      checked={newRoleForm.is_system}
                      onCheckedChange={(checked) => {
                        setNewRoleForm({ ...newRoleForm, is_system: checked === true });
                      }}
                      className="h-5 w-5 border-2"
                    />
                    <label 
                      htmlFor="create-system-role" 
                      className="text-sm font-medium cursor-pointer select-none"
                    >
                      System Role
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="create-default-role"
                      checked={newRoleForm.is_default}
                      onCheckedChange={(checked) => {
                        setNewRoleForm({ ...newRoleForm, is_default: checked === true });
                      }}
                      className="h-5 w-5 border-2"
                    />
                    <label 
                      htmlFor="create-default-role" 
                      className="text-sm font-medium cursor-pointer select-none"
                    >
                      Default Role
                    </label>
                  </div>
                </div>
              </div>

              {/* Permissions */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4>Permissions</h4>
                  {permissionCategories.length === 0 && !permissionsLoading && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        try {
                          // Create some default permissions
                          const defaultPermissions = [
                            { key: 'order.read', name: 'Read Orders', resource: 'orders', action: 'read' },
                            { key: 'order.write', name: 'Write Orders', resource: 'orders', action: 'write' },
                            { key: 'order.delete', name: 'Delete Orders', resource: 'orders', action: 'delete' },
                            { key: 'product.read', name: 'Read Products', resource: 'products', action: 'read' },
                            { key: 'product.write', name: 'Write Products', resource: 'products', action: 'write' },
                            { key: 'product.delete', name: 'Delete Products', resource: 'products', action: 'delete' },
                            { key: 'customer.read', name: 'Read Customers', resource: 'customers', action: 'read' },
                            { key: 'customer.write', name: 'Write Customers', resource: 'customers', action: 'write' },
                            { key: 'customer.delete', name: 'Delete Customers', resource: 'customers', action: 'delete' },
                            { key: 'user.manage', name: 'Manage Users', resource: 'users', action: 'manage' },
                            { key: 'role.manage', name: 'Manage Roles', resource: 'roles', action: 'manage' },
                            { key: 'settings.manage', name: 'Manage Settings', resource: 'settings', action: 'manage' },
                          ];
                          
                          for (const perm of defaultPermissions) {
                            const { error } = await supabase
                              .from('sys_permissions')
                              .insert(perm);
                            if (error && !error.message.includes('duplicate')) {
                              console.error('Error creating permission:', error);
                            }
                          }
                          
                          toast.success('Default permissions created. Please refresh the page.');
                        } catch (error: any) {
                          toast.error('Failed to create permissions: ' + error.message);
                        }
                      }}
                    >
                      Create Default Permissions
                    </Button>
                  )}
                </div>
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {permissionsLoading ? (
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : permissionCategories.length === 0 ? (
                    <Card className="p-6 bg-[#F8F8F8] dark:bg-muted/30 border-[#E5E5E5]">
                      <div className="text-center space-y-3">
                        <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto" />
                        <div>
                          <p className="text-sm font-medium mb-1">No Permissions Available</p>
                          <p className="text-xs text-muted-foreground mb-3">
                            Permissions define what actions can be performed in the system (e.g., "Read Orders", "Write Products").
                            Each permission has a resource (like "orders", "products") and an action (like "read", "write", "delete").
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Click "Create Default Permissions" above to add common permissions, or create custom permissions in the database.
                          </p>
                        </div>
                      </div>
                    </Card>
                  ) : (
                    permissionCategories.map((category) => (
                      <Card key={category.name} className="p-4 bg-[#F8F8F8] dark:bg-muted/30 border-[#E5E5E5]">
                        <h5 className="mb-3">{category.name}</h5>
                        <div className="space-y-2">
                          {category.permissions.map((permission) => (
                            <div key={permission.id} className="flex items-center gap-2">
                              <Checkbox
                                id={`perm-${permission.id}`}
                                checked={selectedPermissions.includes(permission.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedPermissions([...selectedPermissions, permission.id]);
                                  } else {
                                    setSelectedPermissions(selectedPermissions.filter((id) => id !== permission.id));
                                  }
                                }}
                              />
                              <label htmlFor={`perm-${permission.id}`} className="text-sm cursor-pointer flex-1">
                                <span className="font-medium">{permission.name}</span>
                                {permission.action && (
                                  <span className="text-xs text-muted-foreground ml-2">({permission.action})</span>
                                )}
                              </label>
                            </div>
                          ))}
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-[#4B6BFB] to-[#6B8AFF] text-white"
                  onClick={handleCreateRole}
                >
                  Create Role
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5] dark:border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
          />
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Roles</p>
              <h2 className="mb-0">{roles?.length || 0}</h2>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#4B6BFB]" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Users</p>
              <h2 className="mb-0">
                {Object.values(roleUserCounts).reduce((acc, count) => acc + count, 0)}
              </h2>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Custom Roles</p>
              <h2 className="mb-0">
                {roles?.filter((r) => !r.is_system).length || 0}
              </h2>
            </div>
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">System Roles</p>
              <h2 className="mb-0">
                {roles?.filter((r) => r.is_system).length || 0}
              </h2>
            </div>
            <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <Lock className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Roles Table */}
      <Card className="bg-white dark:bg-card border-[#E5E5E5] dark:border-border overflow-hidden">
        {rolesLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F8F8F8] dark:bg-muted/30">
                <TableHead>Role Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No roles found. Create your first role to get started.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRoles.map((role) => {
                  const userCount = roleUserCounts[role.id] || 0;
                  const permCount = rolePermissions?.length || 0;
                  
                  return (
                    <TableRow key={role.id} className="hover:bg-accent/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#4B6BFB] to-[#6B8AFF] flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="mb-0">{role.name}</p>
                            {role.is_system && (
                              <Badge variant="outline" className="mt-1 text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                                System Role
                              </Badge>
                            )}
                            {role.is_default && (
                              <Badge variant="outline" className="mt-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 ml-1">
                                Default
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {role.description || "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>{userCount}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {permCount} permissions
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              setSelectedRoleId(role.id);
                              // View role details
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditRole(role.id)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {!role.is_system && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-red-600"
                              onClick={() => handleDeleteRole(role.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              Update role details and permissions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm mb-2 block">Role Name</label>
                <Input
                  value={newRoleForm.name}
                  onChange={(e) => setNewRoleForm({ ...newRoleForm, name: e.target.value })}
                  className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                />
              </div>
              <div>
                <label className="text-sm mb-2 block">Role Key</label>
                <Input
                  value={newRoleForm.key}
                  onChange={(e) => setNewRoleForm({ ...newRoleForm, key: e.target.value })}
                  className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                />
              </div>
            </div>

            <div>
              <label className="text-sm mb-2 block">Description</label>
              <Input
                value={newRoleForm.description}
                onChange={(e) => setNewRoleForm({ ...newRoleForm, description: e.target.value })}
                className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm mb-2 block">Priority</label>
                <Input
                  type="number"
                  value={newRoleForm.priority}
                  onChange={(e) => setNewRoleForm({ ...newRoleForm, priority: parseInt(e.target.value) || 0 })}
                  className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                />
              </div>
              <div className="flex items-center gap-6 pt-6">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="edit-system-role"
                    checked={newRoleForm.is_system}
                    onCheckedChange={(checked) => {
                      setNewRoleForm({ ...newRoleForm, is_system: checked === true });
                    }}
                    className="h-5 w-5 border-2"
                  />
                  <label 
                    htmlFor="edit-system-role" 
                    className="text-sm font-medium cursor-pointer select-none"
                  >
                    System Role
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="edit-default-role"
                    checked={newRoleForm.is_default}
                    onCheckedChange={(checked) => {
                      setNewRoleForm({ ...newRoleForm, is_default: checked === true });
                    }}
                    className="h-5 w-5 border-2"
                  />
                  <label 
                    htmlFor="edit-default-role" 
                    className="text-sm font-medium cursor-pointer select-none"
                  >
                    Default Role
                  </label>
                </div>
              </div>
            </div>

            {/* Permissions */}
            <div>
              <h4 className="mb-3">Permissions</h4>
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {permissionsLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : permissionCategories.length === 0 ? (
                  <Card className="p-6 bg-[#F8F8F8] dark:bg-muted/30 border-[#E5E5E5]">
                    <div className="text-center space-y-3">
                      <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto" />
                      <div>
                        <p className="text-sm font-medium mb-1">No Permissions Available</p>
                        <p className="text-xs text-muted-foreground">
                          Permissions define what actions can be performed. Create permissions in the database first.
                        </p>
                      </div>
                    </div>
                  </Card>
                ) : (
                  permissionCategories.map((category) => (
                    <Card key={category.name} className="p-4 bg-[#F8F8F8] dark:bg-muted/30 border-[#E5E5E5]">
                      <h5 className="mb-3">{category.name}</h5>
                      <div className="space-y-2">
                        {category.permissions.map((permission) => (
                          <div key={permission.id} className="flex items-center gap-2">
                            <Checkbox
                              id={`edit-perm-${permission.id}`}
                              checked={selectedPermissions.includes(permission.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedPermissions([...selectedPermissions, permission.id]);
                                } else {
                                  setSelectedPermissions(selectedPermissions.filter((id) => id !== permission.id));
                                }
                              }}
                            />
                            <label htmlFor={`edit-perm-${permission.id}`} className="text-sm cursor-pointer flex-1">
                              <span className="font-medium">{permission.name}</span>
                              {permission.action && (
                                <span className="text-xs text-muted-foreground ml-2">({permission.action})</span>
                              )}
                            </label>
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setEditingRole(null);
                  setSelectedRoleId(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-[#4B6BFB] to-[#6B8AFF] text-white"
                onClick={handleUpdateRole}
              >
                Update Role
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
