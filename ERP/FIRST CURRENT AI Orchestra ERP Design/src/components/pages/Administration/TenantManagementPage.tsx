"use client";

import { useState, useEffect } from "react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
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
} from "../../ui/dialog";
import {
  Building,
  Plus,
  Search,
  Edit,
  Trash2,
  AlertCircle,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { useTenants } from "../../../hooks/useSystem";
import { useTenantContext } from "../../../contexts/TenantContext";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import type { SysTenantInsert, SysTenantUpdate } from "../../../types/database/system";

export function TenantManagementPage() {
  const { currentTenantId, setCurrentTenantId, refreshTenants } = useTenantContext();
  const { tenants, loading, error, createTenant, updateTenant, deleteTenant } = useTenants();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all-status");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    status: "active" as "active" | "suspended" | "deleted",
    timezone: "",
    locale: "",
    domain: "",
    notes: "",
  });

  // Filter tenants
  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch = 
      !searchTerm ||
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.slug.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all-status" ||
      tenant.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCreateTenant = async () => {
    if (!formData.name || !formData.slug) {
      toast.error("Name and slug are required");
      return;
    }

    try {
      const tenantData: SysTenantInsert = {
        name: formData.name,
        slug: formData.slug.toLowerCase().replace(/\s+/g, "-"),
        status: formData.status,
        timezone: formData.timezone || null,
        locale: formData.locale || null,
        domain: formData.domain || null,
        notes: formData.notes || null,
        is_personal: false,
      };

      const newTenant = await createTenant(tenantData);
      toast.success("Tenant created successfully");
      setIsCreateDialogOpen(false);
      resetForm();
      await refreshTenants();
      
      // Auto-select the new tenant if none is selected
      if (!currentTenantId) {
        setCurrentTenantId(newTenant.id);
      }
    } catch (error: any) {
      toast.error("Failed to create tenant: " + error.message);
    }
  };

  const handleEditTenant = (tenantId: number) => {
    const tenant = tenants.find((t) => t.id === tenantId);
    if (!tenant) return;
    
    setEditingTenant(tenantId);
    setFormData({
      name: tenant.name,
      slug: tenant.slug,
      status: tenant.status,
      timezone: tenant.timezone || "",
      locale: tenant.locale || "",
      domain: tenant.domain || "",
      notes: tenant.notes || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateTenant = async () => {
    if (!editingTenant) return;
    if (!formData.name || !formData.slug) {
      toast.error("Name and slug are required");
      return;
    }

    try {
      const updateData: SysTenantUpdate = {
        name: formData.name,
        slug: formData.slug.toLowerCase().replace(/\s+/g, "-"),
        status: formData.status,
        timezone: formData.timezone || null,
        locale: formData.locale || null,
        domain: formData.domain || null,
        notes: formData.notes || null,
      };

      await updateTenant(editingTenant, updateData);
      toast.success("Tenant updated successfully");
      setIsEditDialogOpen(false);
      setEditingTenant(null);
      resetForm();
      await refreshTenants();
    } catch (error: any) {
      toast.error("Failed to update tenant: " + error.message);
    }
  };

  const handleDeleteTenant = async (tenantId: number) => {
    const tenant = tenants.find((t) => t.id === tenantId);
    if (!tenant) return;

    if (tenant.status === "deleted") {
      toast.error("Tenant is already deleted");
      return;
    }

    if (!confirm(`Are you sure you want to delete "${tenant.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteTenant(tenantId);
      toast.success("Tenant deleted successfully");
      
      // If deleted tenant was the current one, clear selection
      if (currentTenantId === tenantId) {
        setCurrentTenantId(null);
      }
      
      await refreshTenants();
    } catch (error: any) {
      toast.error("Failed to delete tenant: " + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      status: "active",
      timezone: "",
      locale: "",
      domain: "",
      notes: "",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        );
      case "suspended":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
            <Clock className="w-3 h-3 mr-1" />
            Suspended
          </Badge>
        );
      case "deleted":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
            <XCircle className="w-3 h-3 mr-1" />
            Deleted
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const needsDatabaseSetup = error?.message?.includes("relation") || error?.message?.includes("does not exist");
  const isNetworkError = error?.message?.includes("Failed to fetch") || error?.message?.includes("NetworkError");

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
                The <code className="px-2 py-1 bg-muted rounded">sys_tenants</code> table needs to be created in your Supabase database.
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (isNetworkError) {
    return (
      <div className="space-y-6">
        <Card className="p-8 bg-white dark:bg-card border-[#E5E5E5]">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="mb-2">Connection Error</h2>
              <p className="text-muted-foreground mb-2">
                Unable to connect to Supabase. Please check:
              </p>
              <ul className="text-sm text-muted-foreground text-left list-disc list-inside space-y-1 mb-4">
                <li>Your internet connection</li>
                <li>Supabase project is active (not paused)</li>
                <li>Supabase URL and API key are correct</li>
                <li>Browser console for detailed error messages</li>
              </ul>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="mt-4"
              >
                Retry Connection
              </Button>
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
            <Building className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="mb-1">Tenant Management</h1>
            <p className="text-sm text-muted-foreground mb-0">
              Create and manage tenants (organizations/companies)
            </p>
          </div>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <Button 
            className="gap-2 bg-gradient-to-r from-[#4B6BFB] to-[#6B8AFF] text-white"
            onClick={() => {
              resetForm();
              setIsCreateDialogOpen(true);
            }}
          >
            <Plus className="w-4 h-4" />
            Create Tenant
          </Button>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Tenant</DialogTitle>
              <DialogDescription>
                Create a new tenant (organization/company) in the system
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm mb-2 block">Tenant Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Acme Corporation"
                    className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm mb-2 block">Slug *</label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="acme-corp"
                    className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    URL-friendly identifier (e.g., acme-corp)
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm mb-2 block">Status</label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "active" | "suspended" | "deleted") => 
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-card">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="deleted">Deleted</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm mb-2 block">Timezone</label>
                  <Input
                    value={formData.timezone}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                    placeholder="America/Los_Angeles"
                    className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                  />
                </div>
                <div>
                  <label className="text-sm mb-2 block">Locale</label>
                  <Select
                    value={formData.locale || "en"}
                    onValueChange={(value) => setFormData({ ...formData, locale: value })}
                  >
                    <SelectTrigger className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-card">
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="vi">Vietnamese</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm mb-2 block">Domain</label>
                <Input
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  placeholder="example.com"
                  className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                />
              </div>

              <div>
                <label className="text-sm mb-2 block">Notes</label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes about this tenant"
                  className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5] min-h-[100px]"
                />
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    resetForm();
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-[#4B6BFB] to-[#6B8AFF] text-white"
                  onClick={handleCreateTenant}
                >
                  Create Tenant
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search & Filter */}
      <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5]">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tenants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-[#F8F8F8] dark:bg-muted">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-card">
              <SelectItem value="all-status">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="deleted">Deleted</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Tenants</p>
              <h2 className="mb-0">{tenants.length}</h2>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Building className="w-5 h-5 text-[#4B6BFB]" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Active</p>
              <h2 className="mb-0">
                {tenants.filter((t) => t.status === "active").length}
              </h2>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Suspended</p>
              <h2 className="mb-0">
                {tenants.filter((t) => t.status === "suspended").length}
              </h2>
            </div>
            <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current Tenant</p>
              <h2 className="mb-0 text-sm">
                {currentTenantId 
                  ? tenants.find((t) => t.id === currentTenantId)?.name || "—"
                  : "None"}
              </h2>
            </div>
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Building className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tenants Table */}
      <Card className="bg-white dark:bg-card border-[#E5E5E5] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : error && !needsDatabaseSetup ? (
          <div className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <p className="text-destructive">Error loading tenants: {error.message}</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F8F8F8] dark:bg-muted/30">
                <TableHead>Tenant Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTenants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No tenants found. Create your first tenant to get started.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTenants.map((tenant) => (
                  <TableRow 
                    key={tenant.id} 
                    className={`hover:bg-accent/50 ${currentTenantId === tenant.id ? "bg-blue-50 dark:bg-blue-900/10" : ""}`}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#4B6BFB] to-[#6B8AFF] flex items-center justify-center">
                          <Building className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="mb-0 font-medium">{tenant.name}</p>
                          {currentTenantId === tenant.id && (
                            <Badge variant="outline" className="mt-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                              Current
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <code className="px-2 py-1 bg-muted rounded text-xs">{tenant.slug}</code>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(tenant.status)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {tenant.domain || "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(tenant.created_at), { addSuffix: true })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => {
                            setCurrentTenantId(tenant.id);
                            toast.success(`Switched to tenant: ${tenant.name}`);
                          }}
                          title="Set as current tenant"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleEditTenant(tenant.id)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        {tenant.status !== "deleted" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600"
                            onClick={() => handleDeleteTenant(tenant.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Tenant</DialogTitle>
            <DialogDescription>
              Update tenant information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm mb-2 block">Tenant Name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                  required
                />
              </div>
              <div>
                <label className="text-sm mb-2 block">Slug *</label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm mb-2 block">Status</label>
              <Select
                value={formData.status}
                onValueChange={(value: "active" | "suspended" | "deleted") => 
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-card">
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="deleted">Deleted</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm mb-2 block">Timezone</label>
                <Input
                  value={formData.timezone}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                  className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                />
              </div>
              <div>
                <label className="text-sm mb-2 block">Locale</label>
                <Select
                  value={formData.locale || "en"}
                  onValueChange={(value) => setFormData({ ...formData, locale: value })}
                >
                  <SelectTrigger className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-card">
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="vi">Vietnamese</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                  </Select>
                </div>
              </div>

            <div>
              <label className="text-sm mb-2 block">Domain</label>
              <Input
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
              />
            </div>

            <div>
              <label className="text-sm mb-2 block">Notes</label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5] min-h-[100px]"
              />
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setEditingTenant(null);
                  resetForm();
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-[#4B6BFB] to-[#6B8AFF] text-white"
                onClick={handleUpdateTenant}
              >
                Update Tenant
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

