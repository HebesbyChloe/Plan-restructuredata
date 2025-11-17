"use client";

import { useState, useMemo } from "react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Badge } from "../../ui/badge";
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
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Mail,
  UserCheck,
  UserX,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Avatar, AvatarFallback } from "../../ui/avatar";
import { useUsers, useRoles, useUserRoles } from "../../../hooks/useSystem";
import { useTenantContext } from "../../../contexts/TenantContext";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export function UserManagementPage() {
  const { currentTenantId } = useTenantContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState("all-roles");
  const [statusFilter, setStatusFilter] = useState("all-status");
  const [selectedUserRoles, setSelectedUserRoles] = useState<number[]>([]);
  
  const { users, loading, error, createUser, updateUser, deleteUser } = useUsers(currentTenantId);
  const { roles } = useRoles(currentTenantId);
  const { userRoles, assignRole, removeRole, refresh: refreshUserRoles } = useUserRoles(currentTenantId);

  // Check if database table exists
  const needsDatabaseSetup = error?.message?.includes("relation") || error?.message?.includes("does not exist");

  // Filter users
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter((user) => {
      const matchesSearch = 
        !searchTerm ||
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = 
        statusFilter === "all-status" ||
        (statusFilter === "active" && user.is_active) ||
        (statusFilter === "inactive" && !user.is_active);

      return matchesSearch && matchesStatus;
    });
  }, [users, searchTerm, statusFilter]);

  // Get roles for a specific user
  const getUserRoles = (userId: number) => {
    if (!userRoles) return [];
    return userRoles
      .filter((ur) => ur.user_id === userId)
      .map((ur) => {
        const role = roles?.find((r) => r.id === ur.role_id);
        return role ? { ...ur, role } : null;
      })
      .filter(Boolean);
  };

  const handleCreateUser = async (formData: FormData) => {
    if (!currentTenantId) {
      toast.error("Please select a tenant first");
      return;
    }

    try {
      // Note: In production, you'd create the auth user first via Supabase Auth
      // For now, this is a placeholder - you'll need auth_user_id from Supabase Auth
      const firstName = formData.get("firstName") as string;
      const lastName = formData.get("lastName") as string;
      const email = formData.get("email") as string;
      
      // TODO: Create auth user first, then get auth_user_id
      // For now, show error
      toast.error("User creation requires Supabase Auth setup. Please create user via Auth first, then link to sys_users.");
      
      // If user was created, assign roles
      // const newUser = await createUser(...);
      // if (selectedUserRoles.length > 0 && newUser) {
      //   for (const roleId of selectedUserRoles) {
      //     await assignRole({
      //       tenant_id: currentTenantId,
      //       user_id: newUser.id,
      //       role_id: roleId,
      //     });
      //   }
      // }
      
      setIsCreateDialogOpen(false);
      setSelectedUserRoles([]);
    } catch (err) {
      toast.error("Failed to create user");
      console.error(err);
    }
  };

  const handleAssignRole = async (userId: number, roleId: number) => {
    if (!currentTenantId) {
      toast.error("Please select a tenant first");
      return;
    }

    try {
      await assignRole({
        tenant_id: currentTenantId,
        user_id: userId,
        role_id: roleId,
      });
      toast.success("Role assigned successfully");
      await refreshUserRoles();
    } catch (error: any) {
      toast.error("Failed to assign role: " + error.message);
    }
  };

  const handleRemoveRole = async (userRoleId: number) => {
    if (!confirm("Are you sure you want to remove this role from the user?")) return;
    
    try {
      await removeRole(userRoleId);
      toast.success("Role removed successfully");
      await refreshUserRoles();
    } catch (error: any) {
      toast.error("Failed to remove role: " + error.message);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Are you sure you want to deactivate this user?")) return;
    try {
      await deleteUser(id);
      toast.success("User deactivated successfully");
    } catch (err) {
      toast.error("Failed to deactivate user");
      console.error(err);
    }
  };

  const formatLastLogin = (dateString: string | null) => {
    if (!dateString) return "Never";
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Unknown";
    }
  };

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
                The <code className="px-2 py-1 bg-muted rounded">sys_users</code> table needs to be created in your Supabase database.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Please run the database migration to create the System module tables.
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
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="mb-1">User Management</h1>
            <p className="text-sm text-muted-foreground mb-0">
              Manage system users and permissions
            </p>
          </div>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <Button 
            className="gap-2 bg-gradient-to-r from-[#4B6BFB] to-[#6B8AFF] text-white"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Add User
          </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new user account.
              </DialogDescription>
            </DialogHeader>
            <form action={handleCreateUser} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm mb-2 block">First Name</label>
                  <Input
                    name="firstName"
                    placeholder="John"
                    className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm mb-2 block">Last Name</label>
                  <Input
                    name="lastName"
                    placeholder="Doe"
                    className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm mb-2 block">Email</label>
                <Input
                  name="email"
                  type="email"
                  placeholder="john.doe@company.com"
                  className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                  required
                />
              </div>
              <div>
                <label className="text-sm mb-2 block">Assign Roles</label>
                <div className="space-y-2 max-h-[200px] overflow-y-auto border rounded-md p-3 bg-[#F8F8F8] dark:bg-muted">
                  {roles && roles.length > 0 ? (
                    roles.map((role) => (
                      <div key={role.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`role-${role.id}`}
                          checked={selectedUserRoles.includes(role.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUserRoles([...selectedUserRoles, role.id]);
                            } else {
                              setSelectedUserRoles(selectedUserRoles.filter((id) => id !== role.id));
                            }
                          }}
                          className="rounded"
                        />
                        <label htmlFor={`role-${role.id}`} className="text-sm cursor-pointer flex-1">
                          {role.name}
                          {role.is_system && (
                            <Badge variant="outline" className="ml-2 text-xs">System</Badge>
                          )}
                        </label>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No roles available. Create roles first.</p>
                  )}
                </div>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-md border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <strong>Note:</strong> User creation requires Supabase Auth setup. 
                  Create the user via Supabase Auth first, then link to sys_users table.
                </p>
              </div>
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#4B6BFB] to-[#6B8AFF] text-white"
                >
                  Add User
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search & Filter */}
      <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5]">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
            />
          </div>

          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px] bg-[#F8F8F8] dark:bg-muted">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-card">
              <SelectItem value="all-roles">All Roles</SelectItem>
              <SelectItem value="marketing">Marketing Manager</SelectItem>
              <SelectItem value="sales">Sales Team</SelectItem>
              <SelectItem value="operations">Operations Team</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] bg-[#F8F8F8] dark:bg-muted">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-card">
              <SelectItem value="all-status">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Users</p>
              <h2 className="mb-0">{users?.length || 0}</h2>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Users className="w-5 h-5 text-[#4B6BFB]" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Active</p>
              <h2 className="mb-0">
                {users?.filter((u) => u.is_active).length || 0}
              </h2>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Inactive</p>
              <h2 className="mb-0">
                {users?.filter((u) => !u.is_active).length || 0}
              </h2>
            </div>
            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-900/30 flex items-center justify-center">
              <UserX className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Online Now</p>
              <h2 className="mb-0">
                {users?.filter((u) => u.last_sign_in_at && new Date(u.last_sign_in_at) > new Date(Date.now() - 15 * 60 * 1000)).length || 0}
              </h2>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="bg-white dark:bg-card border-[#E5E5E5] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : error && !needsDatabaseSetup ? (
          <div className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <p className="text-destructive">Error loading users: {error.message}</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F8F8F8] dark:bg-muted/30">
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => {
                  const userRolesList = getUserRoles(user.id);
                  const assignedRoleIds = userRolesList.map((ur: any) => ur.role_id);
                  
                  return (
                    <TableRow key={user.id} className="hover:bg-accent/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback>
                              {user.full_name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <span>{user.full_name || "Unknown User"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {user.email || "No email"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {userRolesList.length > 0 ? (
                            userRolesList.map((ur: any) => (
                              <Badge 
                                key={ur.id} 
                                variant="outline" 
                                className="text-xs"
                              >
                                {ur.role?.name || "Unknown"}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">No roles</span>
                          )}
                        </div>
                        {roles && roles.length > 0 && (
                          <Select
                            onValueChange={(roleId) => {
                              const roleIdNum = parseInt(roleId, 10);
                              if (!assignedRoleIds.includes(roleIdNum)) {
                                handleAssignRole(user.id, roleIdNum);
                              }
                            }}
                          >
                            <SelectTrigger className="mt-2 h-7 text-xs w-full">
                              <SelectValue placeholder="Assign role" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-card">
                              {roles
                                .filter((r) => !assignedRoleIds.includes(r.id))
                                .map((role) => (
                                  <SelectItem key={role.id} value={role.id.toString()}>
                                    {role.name}
                                  </SelectItem>
                                ))}
                              {roles.filter((r) => !assignedRoleIds.includes(r.id)).length === 0 && (
                                <SelectItem value="" disabled>All roles assigned</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.department || "N/A"}</Badge>
                      </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          user.is_active
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                        }
                        variant="outline"
                      >
                        {user.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatLastLogin(user.last_sign_in_at)}
                    </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-red-600"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
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
    </div>
  );
}
