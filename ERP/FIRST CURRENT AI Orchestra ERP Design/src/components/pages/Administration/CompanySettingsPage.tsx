"use client";

import { useState, useEffect } from "react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Switch } from "../../ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  Settings,
  Building,
  Mail,
  Phone,
  MapPin,
  Globe,
  Upload,
  Save,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { useTenantContext } from "../../../contexts/TenantContext";
import { useTenant, useTenants, useBrands, useStores, useWarehouses, type Brand, type Store, type Warehouse, type BrandInsert, type StoreInsert, type WarehouseInsert } from "../../../hooks/useSystem";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Plus, Edit, Trash2, Store as StoreIcon, Warehouse as WarehouseIcon, Tag, Calendar } from "lucide-react";

export function CompanySettingsPage() {
  const { currentTenantId, setCurrentTenantId, tenants, loading: contextLoading } = useTenantContext();
  const { tenant, loading: tenantLoading, refresh: refreshTenant } = useTenant(currentTenantId);
  const { updateTenant } = useTenants();
  const { brands, loading: brandsLoading, createBrand, updateBrand, deleteBrand } = useBrands(currentTenantId);
  const { stores, loading: storesLoading, createStore, updateStore, deleteStore } = useStores(currentTenantId);
  const { warehouses, loading: warehousesLoading, createWarehouse, updateWarehouse, deleteWarehouse } = useWarehouses(currentTenantId);
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    timezone: "",
    locale: "",
    domain: "",
    notes: "",
  });
  
  // General tab metadata fields
  const [generalMetadata, setGeneralMetadata] = useState({
    tax_id: "",
    registration_number: "",
    industry: "",
    business_hours: {
      monday: { open: "", close: "", closed: false },
      tuesday: { open: "", close: "", closed: false },
      wednesday: { open: "", close: "", closed: false },
      thursday: { open: "", close: "", closed: false },
      friday: { open: "", close: "", closed: false },
      saturday: { open: "", close: "", closed: false },
      sunday: { open: "", close: "", closed: false },
    },
    holiday_hours: [] as Array<{ date: string; name: string; open: string; close: string; closed: boolean }>,
  });
  
  // Contact Info tab metadata fields
  const [contactMetadata, setContactMetadata] = useState({
    address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    phone: "",
    support_email: "",
    sales_email: "",
    website: "",
  });
  
  // Preferences tab metadata fields
  const [preferencesMetadata, setPreferencesMetadata] = useState({
    dark_mode_enabled: false,
    notifications_enabled: false,
    ai_assistant_enabled: false,
    auto_save_enabled: false,
    date_format: "",
  });
  
  const [saving, setSaving] = useState(false);
  const [holidayDialogOpen, setHolidayDialogOpen] = useState(false);
  const [editingHolidayIndex, setEditingHolidayIndex] = useState<number | null>(null);
  const [holidayForm, setHolidayForm] = useState({
    date: "",
    name: "",
    open: "",
    close: "",
    closed: false,
  });

  // Helper functions for time parsing
  const parseTime = (timeStr: string) => {
    if (!timeStr) return { hour: 9, minute: 0, period: "AM" };
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (match) {
      let hour = parseInt(match[1]);
      const minute = parseInt(match[2]);
      const period = match[3].toUpperCase();
      if (period === "PM" && hour !== 12) hour += 12;
      if (period === "AM" && hour === 12) hour = 0;
      return { hour, minute, period: period as "AM" | "PM" };
    }
    return { hour: 9, minute: 0, period: "AM" as "AM" | "PM" };
  };

  const formatTime = (hour: number, minute: number, period: "AM" | "PM") => {
    let displayHour = hour;
    if (hour === 0) displayHour = 12;
    else if (hour > 12) displayHour = hour - 12;
    const minuteStr = minute.toString().padStart(2, "0");
    return `${displayHour}:${minuteStr} ${period}`;
  };

  // TimeSelector component
  const TimeSelector = ({ 
    value, 
    onChange, 
    placeholder = "Select time" 
  }: { 
    value: string; 
    onChange: (time: string) => void; 
    placeholder?: string;
  }) => {
    const parsed = parseTime(value || "");
    const displayHour = parsed.hour > 12 ? parsed.hour - 12 : (parsed.hour === 0 ? 12 : parsed.hour);
    
    const handleChange = (displayH: number, minute: number, period: "AM" | "PM") => {
      // Convert display hour (1-12) to 24-hour format (0-23) for formatTime
      let hour24 = displayH;
      if (period === "PM" && displayH !== 12) hour24 = displayH + 12;
      if (period === "AM" && displayH === 12) hour24 = 0;
      
      const timeStr = formatTime(hour24, minute, period);
      onChange(timeStr);
    };

    const currentPeriod: "AM" | "PM" = parsed.period === "AM" || parsed.period === "PM" ? parsed.period : "AM";

    return (
      <div className="flex items-center gap-2">
        <Select
          value={displayHour.toString()}
          onValueChange={(val) => {
            const newHour = parseInt(val);
            handleChange(newHour, parsed.minute, currentPeriod);
          }}
        >
          <SelectTrigger className="w-20 bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-card">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
              <SelectItem key={h} value={h.toString()}>
                {h}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-muted-foreground">:</span>
        <Select
          value={parsed.minute.toString()}
          onValueChange={(val) => {
            const newMinute = parseInt(val);
            handleChange(displayHour, newMinute, currentPeriod);
          }}
        >
          <SelectTrigger className="w-20 bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-card">
            {[0, 15, 30, 45].map((m) => (
              <SelectItem key={m} value={m.toString()}>
                {m.toString().padStart(2, "0")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={currentPeriod}
          onValueChange={(val) => {
            handleChange(displayHour, parsed.minute, val as "AM" | "PM");
          }}
        >
          <SelectTrigger className="w-20 bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-card">
            <SelectItem value="AM">AM</SelectItem>
            <SelectItem value="PM">PM</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  };
  
  // Brand dialog state
  const [brandDialogOpen, setBrandDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [brandForm, setBrandForm] = useState<BrandInsert>({
    tenant_id: currentTenantId || 0,
    code: "",
    name: "",
    description: "",
    logo_url: "",
    status: "active",
    website_url: "",
  });
  
  // Store dialog state
  const [storeDialogOpen, setStoreDialogOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [storeForm, setStoreForm] = useState<StoreInsert>({
    tenant_id: currentTenantId || 0,
    brand_id: null,
    code: "",
    name: "",
    status: "active",
    is_headquarters: false,
    metadata: {
      is_online: false,
      store_url: "",
    },
  });
  
  // Warehouse dialog state
  const [warehouseDialogOpen, setWarehouseDialogOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [warehouseForm, setWarehouseForm] = useState<WarehouseInsert>({
    tenant_id: currentTenantId || 0,
    code: "",
    name: "",
    status: "active",
  });

  // Load tenant data when tenant changes
  useEffect(() => {
    if (tenant) {
      setFormData({
        name: tenant.name || "",
        slug: tenant.slug || "",
        timezone: tenant.timezone || "",
        locale: tenant.locale || "",
        domain: tenant.domain || "",
        notes: tenant.notes || "",
      });
      
      // Load metadata fields
      const metadata = tenant.metadata || {};
      
      // General metadata
      setGeneralMetadata({
        tax_id: metadata.tax_id || "",
        registration_number: metadata.registration_number || "",
        industry: metadata.industry || "",
        business_hours: metadata.business_hours || {
          monday: { open: "", close: "", closed: false },
          tuesday: { open: "", close: "", closed: false },
          wednesday: { open: "", close: "", closed: false },
          thursday: { open: "", close: "", closed: false },
          friday: { open: "", close: "", closed: false },
          saturday: { open: "", close: "", closed: false },
          sunday: { open: "", close: "", closed: false },
        },
        holiday_hours: metadata.holiday_hours || [],
      });
      
      // Contact metadata
      setContactMetadata({
        address: metadata.address || "",
        city: metadata.city || "",
        state: metadata.state || "",
        postal_code: metadata.postal_code || "",
        country: metadata.country || "",
        phone: metadata.phone || "",
        support_email: metadata.support_email || "",
        sales_email: metadata.sales_email || "",
        website: metadata.website || "",
      });
      
      // Preferences metadata
      setPreferencesMetadata({
        dark_mode_enabled: metadata.dark_mode_enabled || false,
        notifications_enabled: metadata.notifications_enabled || false,
        ai_assistant_enabled: metadata.ai_assistant_enabled || false,
        auto_save_enabled: metadata.auto_save_enabled || false,
        date_format: metadata.date_format || "",
      });
    }
  }, [tenant]);
  
  // Update brand form when tenant changes
  useEffect(() => {
    if (currentTenantId) {
      setBrandForm(prev => ({ ...prev, tenant_id: currentTenantId }));
      setStoreForm(prev => ({ ...prev, tenant_id: currentTenantId }));
      setWarehouseForm(prev => ({ ...prev, tenant_id: currentTenantId }));
    }
  }, [currentTenantId]);
  
  // Brand handlers
  const handleOpenBrandDialog = (brand?: Brand) => {
    if (brand) {
      setEditingBrand(brand);
      setBrandForm({
        tenant_id: brand.tenant_id,
        code: brand.code,
        name: brand.name,
        description: brand.description || "",
        logo_url: brand.logo_url || "",
        status: brand.status,
        website_url: brand.website_url || "",
      });
    } else {
      setEditingBrand(null);
      setBrandForm({
        tenant_id: currentTenantId || 0,
        code: "",
        name: "",
        description: "",
        logo_url: "",
        status: "active",
        website_url: "",
      });
    }
    setBrandDialogOpen(true);
  };
  
  const handleSaveBrand = async () => {
    if (!currentTenantId) {
      toast.error("Please select a tenant first");
      return;
    }
    
    try {
      // Include all fields that should exist in the database
      const brandData = {
        tenant_id: brandForm.tenant_id,
        code: brandForm.code,
        name: brandForm.name,
        description: brandForm.description || null,
        logo_url: brandForm.logo_url || null,
        status: brandForm.status || 'active',
        website_url: brandForm.website_url || null,
        ...(brandForm.metadata && { metadata: brandForm.metadata }),
        ...(brandForm.created_by && { created_by: brandForm.created_by }),
      };
      
      if (editingBrand) {
        await updateBrand(editingBrand.id, brandData);
        toast.success("Brand updated successfully");
      } else {
        await createBrand(brandData);
        toast.success("Brand created successfully");
      }
      setBrandDialogOpen(false);
    } catch (error: any) {
      toast.error("Failed to save brand: " + error.message);
    }
  };
  
  const handleDeleteBrand = async (brand: Brand) => {
    if (!confirm(`Are you sure you want to delete "${brand.name}"?`)) return;
    
    try {
      await deleteBrand(brand.id);
      toast.success("Brand deleted successfully");
    } catch (error: any) {
      toast.error("Failed to delete brand: " + error.message);
    }
  };
  
  // Store handlers
  const handleOpenStoreDialog = (store?: Store) => {
    if (store) {
      const metadata = store.metadata || {};
      setEditingStore(store);
      setStoreForm({
        tenant_id: store.tenant_id,
        brand_id: store.brand_id || null,
        code: store.code,
        name: store.name,
        description: store.description || "",
        address_line1: store.address_line1 || "",
        address_line2: store.address_line2 || "",
        city: store.city || "",
        state: store.state || "",
        country: store.country || "",
        postal_code: store.postal_code || "",
        phone: store.phone || "",
        email: store.email || "",
        status: store.status,
        is_headquarters: store.is_headquarters,
        timezone: store.timezone || "",
        metadata: {
          ...metadata,
          is_online: metadata.is_online || false,
          store_url: metadata.store_url || "",
        },
      });
    } else {
      setEditingStore(null);
      setStoreForm({
        tenant_id: currentTenantId || 0,
        brand_id: null,
        code: "",
        name: "",
        status: "active",
        is_headquarters: false,
        metadata: {
          is_online: false,
          store_url: "",
        },
      });
    }
    setStoreDialogOpen(true);
  };
  
  const handleSaveStore = async () => {
    if (!currentTenantId) {
      toast.error("Please select a tenant first");
      return;
    }
    
    // Validate online store URL if is_online is true
    const metadata = storeForm.metadata as any || {};
    if (metadata.is_online && !metadata.store_url) {
      toast.error("Store URL is required for online stores");
      return;
    }
    
    try {
      // Ensure metadata is properly structured
      const storeData = {
        ...storeForm,
        metadata: {
          ...metadata,
          is_online: metadata.is_online || false,
          store_url: metadata.is_online ? metadata.store_url : null,
        },
      };
      
      if (editingStore) {
        await updateStore(editingStore.id, storeData);
        toast.success("Store updated successfully");
      } else {
        await createStore(storeData);
        toast.success("Store created successfully");
      }
      setStoreDialogOpen(false);
    } catch (error: any) {
      toast.error("Failed to save store: " + error.message);
    }
  };
  
  const handleDeleteStore = async (store: Store) => {
    if (!confirm(`Are you sure you want to delete "${store.name}"?`)) return;
    
    try {
      await deleteStore(store.id);
      toast.success("Store deleted successfully");
    } catch (error: any) {
      toast.error("Failed to delete store: " + error.message);
    }
  };
  
  // Warehouse handlers
  const handleOpenWarehouseDialog = (warehouse?: Warehouse) => {
    if (warehouse) {
      setEditingWarehouse(warehouse);
      setWarehouseForm({
        tenant_id: warehouse.tenant_id,
        code: warehouse.code,
        name: warehouse.name,
        address: warehouse.address || "",
        city: warehouse.city || "",
        country: warehouse.country || "",
        phone: warehouse.phone || "",
        email: warehouse.email || "",
        status: warehouse.status,
      });
    } else {
      setEditingWarehouse(null);
      setWarehouseForm({
        tenant_id: currentTenantId || 0,
        code: "",
        name: "",
        status: "active",
      });
    }
    setWarehouseDialogOpen(true);
  };
  
  const handleSaveWarehouse = async () => {
    if (!currentTenantId) {
      toast.error("Please select a tenant first");
      return;
    }
    
    try {
      if (editingWarehouse) {
        await updateWarehouse(editingWarehouse.id, warehouseForm);
        toast.success("Warehouse updated successfully");
      } else {
        await createWarehouse(warehouseForm);
        toast.success("Warehouse created successfully");
      }
      setWarehouseDialogOpen(false);
    } catch (error: any) {
      toast.error("Failed to save warehouse: " + error.message);
    }
  };
  
  const handleDeleteWarehouse = async (warehouse: Warehouse) => {
    if (!confirm(`Are you sure you want to delete "${warehouse.name}"?`)) return;
    
    try {
      await deleteWarehouse(warehouse.id);
      toast.success("Warehouse deleted successfully");
    } catch (error: any) {
      toast.error("Failed to delete warehouse: " + error.message);
    }
  };

  const handleSave = async () => {
    if (!currentTenantId) {
      toast.error("Please select a tenant first");
      return;
    }

    try {
      setSaving(true);
      
      // Merge all metadata
      const metadata = {
        ...(tenant?.metadata || {}),
        // General metadata
        tax_id: generalMetadata.tax_id || null,
        registration_number: generalMetadata.registration_number || null,
        industry: generalMetadata.industry || null,
        business_hours: generalMetadata.business_hours,
        holiday_hours: generalMetadata.holiday_hours || [],
        // Contact metadata
        address: contactMetadata.address || null,
        city: contactMetadata.city || null,
        state: contactMetadata.state || null,
        postal_code: contactMetadata.postal_code || null,
        country: contactMetadata.country || null,
        phone: contactMetadata.phone || null,
        support_email: contactMetadata.support_email || null,
        sales_email: contactMetadata.sales_email || null,
        website: contactMetadata.website || null,
        // Preferences metadata
        dark_mode_enabled: preferencesMetadata.dark_mode_enabled || false,
        notifications_enabled: preferencesMetadata.notifications_enabled || false,
        ai_assistant_enabled: preferencesMetadata.ai_assistant_enabled || false,
        auto_save_enabled: preferencesMetadata.auto_save_enabled || false,
        date_format: preferencesMetadata.date_format || null,
      };
      
      await updateTenant(currentTenantId, {
        name: formData.name,
        slug: formData.slug,
        timezone: formData.timezone || null,
        locale: formData.locale || null,
        domain: formData.domain || null,
        notes: formData.notes || null,
        metadata: metadata,
      });
      toast.success("Tenant settings saved successfully");
      await refreshTenant();
    } catch (error: any) {
      toast.error("Failed to save tenant settings: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const needsDatabaseSetup = !tenant && !tenantLoading && currentTenantId;

  if (contextLoading || tenantLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

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
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4B6BFB] to-[#6B8AFF] flex items-center justify-center shadow-lg">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="mb-1">Company Settings</h1>
            <p className="text-sm text-muted-foreground mb-0">
              Manage {tenant?.name || "company"} profile and preferences
            </p>
          </div>
        </div>

        <Button 
          onClick={handleSave}
          disabled={saving || !currentTenantId}
          className="gap-2 bg-gradient-to-r from-[#4B6BFB] to-[#6B8AFF] hover:from-[#3B5BEB] to-[#5B7AEF] text-white"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Changes
        </Button>
      </div>

      {/* Current Tenant Info */}
      {tenant && (
        <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Building className="w-5 h-5 text-[#4B6BFB]" />
            </div>
            <div>
              <p className="text-sm font-medium mb-0">{tenant.name}</p>
              <p className="text-xs text-muted-foreground mb-0">Slug: {tenant.slug}</p>
            </div>
          </div>
        </Card>
      )}
      
      {!currentTenantId && (
        <Card className="p-6 bg-white dark:bg-card border-[#E5E5E5]">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Building className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="mb-2">Select a Tenant</h2>
              <p className="text-muted-foreground mb-0">
                Please select a tenant from the header to manage company settings.
              </p>
            </div>
          </div>
        </Card>
      )}

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="contact">Contact Info</TabsTrigger>
          <TabsTrigger value="brands-locations">Brands & Locations</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6">
          <Card className="p-6 bg-white dark:bg-card border-[#E5E5E5]">
            <h3 className="mb-4">Tenant Company Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm mb-2 block">Company Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <label className="text-sm mb-2 block">Slug</label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                    placeholder="company-slug"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm mb-2 block">Tax ID / VAT</label>
                  <Input
                    value={generalMetadata.tax_id}
                    onChange={(e) => setGeneralMetadata({ ...generalMetadata, tax_id: e.target.value })}
                    className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                    placeholder="Enter Tax ID / VAT"
                  />
                </div>
                <div>
                  <label className="text-sm mb-2 block">Registration Number</label>
                  <Input
                    value={generalMetadata.registration_number}
                    onChange={(e) => setGeneralMetadata({ ...generalMetadata, registration_number: e.target.value })}
                    className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                    placeholder="Enter registration number"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm mb-2 block">Industry</label>
                <Select 
                  value={generalMetadata.industry || "none"}
                  onValueChange={(value) => setGeneralMetadata({ ...generalMetadata, industry: value === "none" ? "" : value })}
                >
                  <SelectTrigger className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-card">
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="retail">Retail & E-commerce</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm mb-2 block">Notes</label>
                <Textarea
                  value={formData.notes || ""}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5] min-h-[100px]"
                  placeholder="Additional notes about this tenant"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-card border-[#E5E5E5]">
            <h3 className="mb-4">Business Hours</h3>
            <div className="space-y-3">
              {[
                { key: "monday", label: "Monday" },
                { key: "tuesday", label: "Tuesday" },
                { key: "wednesday", label: "Wednesday" },
                { key: "thursday", label: "Thursday" },
                { key: "friday", label: "Friday" },
                { key: "saturday", label: "Saturday" },
                { key: "sunday", label: "Sunday" },
              ].map(({ key, label }) => {
                const dayData = generalMetadata.business_hours[key as keyof typeof generalMetadata.business_hours] as { open: string; close: string; closed?: boolean };
                const isClosed = dayData?.closed || false;
                
                return (
                  <div key={key} className="flex items-center gap-4">
                    <div className="w-32">
                      <p className="text-sm mb-0">{label}</p>
                    </div>
                    {!isClosed ? (
                      <>
                        <TimeSelector
                          value={dayData?.open || ""}
                          onChange={(time) => setGeneralMetadata({
                            ...generalMetadata,
                            business_hours: {
                              ...generalMetadata.business_hours,
                              [key]: {
                                ...dayData,
                                open: time,
                                closed: false,
                              },
                            },
                          })}
                        />
                        <span className="text-muted-foreground">to</span>
                        <TimeSelector
                          value={dayData?.close || ""}
                          onChange={(time) => setGeneralMetadata({
                            ...generalMetadata,
                            business_hours: {
                              ...generalMetadata.business_hours,
                              [key]: {
                                ...dayData,
                                close: time,
                                closed: false,
                              },
                            },
                          })}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setGeneralMetadata({
                            ...generalMetadata,
                            business_hours: {
                              ...generalMetadata.business_hours,
                              [key]: {
                                ...dayData,
                                closed: true,
                                open: "",
                                close: "",
                              },
                            },
                          })}
                          className="text-muted-foreground"
                        >
                          Mark Closed
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="flex-1 text-sm text-muted-foreground">Closed</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setGeneralMetadata({
                            ...generalMetadata,
                            business_hours: {
                              ...generalMetadata.business_hours,
                              [key]: {
                                ...dayData,
                                closed: false,
                                open: "9:00 AM",
                                close: "6:00 PM",
                              },
                            },
                          })}
                        >
                          Set Hours
                        </Button>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-card border-[#E5E5E5]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="mb-0 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#4B6BFB]" />
                Holiday Hours
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setHolidayForm({ date: "", name: "", open: "", close: "", closed: false });
                  setEditingHolidayIndex(null);
                  setHolidayDialogOpen(true);
                }}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Holiday
              </Button>
            </div>
            {generalMetadata.holiday_hours && generalMetadata.holiday_hours.length > 0 ? (
              <div className="space-y-2">
                {generalMetadata.holiday_hours.map((holiday, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-[#F8F8F8] dark:bg-muted/30 border border-[#E5E5E5]">
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-0">{holiday.name}</p>
                      <p className="text-xs text-muted-foreground mb-0">
                        {new Date(holiday.date).toLocaleDateString()} - {holiday.closed ? "Closed" : `${holiday.open} to ${holiday.close}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setHolidayForm(holiday);
                          setEditingHolidayIndex(index);
                          setHolidayDialogOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const updated = [...generalMetadata.holiday_hours];
                          updated.splice(index, 1);
                          setGeneralMetadata({
                            ...generalMetadata,
                            holiday_hours: updated,
                          });
                        }}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No holiday hours set. Click "Add Holiday" to add special hours for holidays.</p>
            )}
          </Card>

          {/* Holiday Dialog */}
          <Dialog open={holidayDialogOpen} onOpenChange={setHolidayDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingHolidayIndex !== null ? "Edit Holiday" : "Add Holiday"}</DialogTitle>
                <DialogDescription>
                  Set special business hours for a holiday
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm mb-2 block">Holiday Name *</label>
                  <Input
                    value={holidayForm.name}
                    onChange={(e) => setHolidayForm({ ...holidayForm, name: e.target.value })}
                    placeholder="Christmas Day"
                    className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm mb-2 block">Date *</label>
                  <Input
                    type="date"
                    value={holidayForm.date}
                    onChange={(e) => setHolidayForm({ ...holidayForm, date: e.target.value })}
                    className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                    required
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={holidayForm.closed}
                    onCheckedChange={(checked) => setHolidayForm({ ...holidayForm, closed: checked })}
                  />
                  <label className="text-sm">Closed on this holiday</label>
                </div>
                {!holidayForm.closed && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm mb-2 block">Open Time</label>
                      <TimeSelector
                        value={holidayForm.open}
                        onChange={(time) => setHolidayForm({ ...holidayForm, open: time })}
                      />
                    </div>
                    <div>
                      <label className="text-sm mb-2 block">Close Time</label>
                      <TimeSelector
                        value={holidayForm.close}
                        onChange={(time) => setHolidayForm({ ...holidayForm, close: time })}
                      />
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setHolidayDialogOpen(false);
                    setEditingHolidayIndex(null);
                    setHolidayForm({ date: "", name: "", open: "", close: "", closed: false });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (!holidayForm.name || !holidayForm.date) {
                      toast.error("Holiday name and date are required");
                      return;
                    }
                    const updated = [...(generalMetadata.holiday_hours || [])];
                    if (editingHolidayIndex !== null) {
                      updated[editingHolidayIndex] = holidayForm;
                    } else {
                      updated.push(holidayForm);
                    }
                    setGeneralMetadata({
                      ...generalMetadata,
                      holiday_hours: updated,
                    });
                    setHolidayDialogOpen(false);
                    setEditingHolidayIndex(null);
                    setHolidayForm({ date: "", name: "", open: "", close: "", closed: false });
                  }}
                >
                  {editingHolidayIndex !== null ? "Update" : "Add"} Holiday
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Contact Info Tab */}
        <TabsContent value="contact" className="space-y-6">
          <Card className="p-6 bg-white dark:bg-card border-[#E5E5E5]">
            <h3 className="mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#4B6BFB]" />
              Address
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm mb-2 block">Street Address</label>
                <Input
                  value={contactMetadata.address}
                  onChange={(e) => setContactMetadata({ ...contactMetadata, address: e.target.value })}
                  className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                  placeholder="Enter street address"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm mb-2 block">City</label>
                  <Input
                    value={contactMetadata.city}
                    onChange={(e) => setContactMetadata({ ...contactMetadata, city: e.target.value })}
                    className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label className="text-sm mb-2 block">State / Province</label>
                  <Input
                    value={contactMetadata.state}
                    onChange={(e) => setContactMetadata({ ...contactMetadata, state: e.target.value })}
                    className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                    placeholder="Enter state / province"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm mb-2 block">Postal Code</label>
                  <Input
                    value={contactMetadata.postal_code}
                    onChange={(e) => setContactMetadata({ ...contactMetadata, postal_code: e.target.value })}
                    className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                    placeholder="Enter postal code"
                  />
                </div>
                <div>
                  <label className="text-sm mb-2 block">Country</label>
                  <Select 
                    value={contactMetadata.country || "none"}
                    onValueChange={(value) => setContactMetadata({ ...contactMetadata, country: value === "none" ? "" : value })}
                  >
                    <SelectTrigger className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-card">
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="vn">Vietnam</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-card border-[#E5E5E5]">
            <h3 className="mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-[#4B6BFB]" />
              Contact Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm mb-2 block">Main Phone</label>
                <Input
                  value={contactMetadata.phone}
                  onChange={(e) => setContactMetadata({ ...contactMetadata, phone: e.target.value })}
                  className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label className="text-sm mb-2 block">Support Email</label>
                <Input
                  type="email"
                  value={contactMetadata.support_email}
                  onChange={(e) => setContactMetadata({ ...contactMetadata, support_email: e.target.value })}
                  className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                  placeholder="support@company.com"
                />
              </div>
              <div>
                <label className="text-sm mb-2 block">Sales Email</label>
                <Input
                  type="email"
                  value={contactMetadata.sales_email}
                  onChange={(e) => setContactMetadata({ ...contactMetadata, sales_email: e.target.value })}
                  className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                  placeholder="sales@company.com"
                />
              </div>
              <div>
                <label className="text-sm mb-2 block">Website</label>
                <Input
                  value={contactMetadata.website}
                  onChange={(e) => setContactMetadata({ ...contactMetadata, website: e.target.value })}
                  className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                  placeholder="https://company.com"
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Brands & Locations Tab */}
        <TabsContent value="brands-locations" className="space-y-6">
          {/* Brands Section */}
          <Card className="p-6 bg-white dark:bg-card border-[#E5E5E5]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#4B6BFB]" />
                <h3 className="mb-0">Brands</h3>
              </div>
              <Button 
                onClick={() => handleOpenBrandDialog()}
                className="gap-2"
                size="sm"
              >
                <Plus className="w-4 h-4" />
                Add Brand
              </Button>
            </div>
            
            {brandsLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : brands.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No brands found. Click "Add Brand" to create one.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Website</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {brands.map((brand) => (
                    <TableRow key={brand.id}>
                      <TableCell className="font-medium">{brand.code}</TableCell>
                      <TableCell>{brand.name}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          brand.status === 'active' ? 'bg-green-100 text-green-800' :
                          brand.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {brand.status}
                        </span>
                      </TableCell>
                      <TableCell>{brand.website_url || '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenBrandDialog(brand)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteBrand(brand)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>

          {/* Stores Section */}
          <Card className="p-6 bg-white dark:bg-card border-[#E5E5E5]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <StoreIcon className="w-5 h-5 text-[#4B6BFB]" />
                <h3 className="mb-0">Stores</h3>
              </div>
              <Button 
                onClick={() => handleOpenStoreDialog()}
                className="gap-2"
                size="sm"
              >
                <Plus className="w-4 h-4" />
                Add Store
              </Button>
            </div>
            
            {storesLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : stores.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No stores found. Click "Add Store" to create one.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>HQ</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stores.map((store) => {
                    const metadata = store.metadata || {};
                    const isOnline = metadata.is_online || false;
                    return (
                    <TableRow key={store.id}>
                      <TableCell className="font-medium">{store.code}</TableCell>
                      <TableCell>{store.name}</TableCell>
                      <TableCell>{store.city || '-'}</TableCell>
                      <TableCell>
                        {isOnline ? (
                          <span className="px-2 py-1 rounded text-xs bg-purple-100 text-purple-800">Online</span>
                        ) : (
                          <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">Offline</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          store.status === 'active' ? 'bg-green-100 text-green-800' :
                          store.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {store.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {store.is_headquarters ? (
                          <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">Yes</span>
                        ) : (
                          <span className="text-muted-foreground">No</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenStoreDialog(store)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteStore(store)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </Card>

          {/* Warehouses Section */}
          <Card className="p-6 bg-white dark:bg-card border-[#E5E5E5]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <WarehouseIcon className="w-5 h-5 text-[#4B6BFB]" />
                <h3 className="mb-0">Warehouses</h3>
              </div>
              <Button 
                onClick={() => handleOpenWarehouseDialog()}
                className="gap-2"
                size="sm"
              >
                <Plus className="w-4 h-4" />
                Add Warehouse
              </Button>
            </div>
            
            {warehousesLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : warehouses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No warehouses found. Click "Add Warehouse" to create one.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {warehouses.map((warehouse) => (
                    <TableRow key={warehouse.id}>
                      <TableCell className="font-medium">{warehouse.code}</TableCell>
                      <TableCell>{warehouse.name}</TableCell>
                      <TableCell>{warehouse.city || '-'}</TableCell>
                      <TableCell>{warehouse.country || '-'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          warehouse.status === 'active' ? 'bg-green-100 text-green-800' :
                          warehouse.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {warehouse.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenWarehouseDialog(warehouse)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteWarehouse(warehouse)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card className="p-6 bg-white dark:bg-card border-[#E5E5E5]">
            <h3 className="mb-4">System Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-0">Enable Dark Mode</p>
                  <p className="text-sm text-muted-foreground mb-0">
                    Allow users to toggle dark mode
                  </p>
                </div>
                <Switch 
                  checked={preferencesMetadata.dark_mode_enabled}
                  onCheckedChange={(checked) => setPreferencesMetadata({
                    ...preferencesMetadata,
                    dark_mode_enabled: checked,
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-0">Enable Notifications</p>
                  <p className="text-sm text-muted-foreground mb-0">
                    System-wide notification settings
                  </p>
                </div>
                <Switch 
                  checked={preferencesMetadata.notifications_enabled}
                  onCheckedChange={(checked) => setPreferencesMetadata({
                    ...preferencesMetadata,
                    notifications_enabled: checked,
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-0">AI Assistant</p>
                  <p className="text-sm text-muted-foreground mb-0">
                    Enable AI-powered assistance
                  </p>
                </div>
                <Switch 
                  checked={preferencesMetadata.ai_assistant_enabled}
                  onCheckedChange={(checked) => setPreferencesMetadata({
                    ...preferencesMetadata,
                    ai_assistant_enabled: checked,
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-0">Auto-save</p>
                  <p className="text-sm text-muted-foreground mb-0">
                    Automatically save changes
                  </p>
                </div>
                <Switch 
                  checked={preferencesMetadata.auto_save_enabled}
                  onCheckedChange={(checked) => setPreferencesMetadata({
                    ...preferencesMetadata,
                    auto_save_enabled: checked,
                  })}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-card border-[#E5E5E5]">
            <h3 className="mb-4">Regional Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm mb-2 block">Language (Locale)</label>
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
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm mb-2 block">Timezone</label>
                <Input
                  value={formData.timezone || ""}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                  className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                  placeholder="America/Los_Angeles"
                />
              </div>

              <div>
                <label className="text-sm mb-2 block">Domain</label>
                <Input
                  value={formData.domain || ""}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                  placeholder="example.com"
                />
              </div>

              <div>
                <label className="text-sm mb-2 block">Date Format</label>
                <Select 
                  value={preferencesMetadata.date_format || "none"}
                  onValueChange={(value) => setPreferencesMetadata({
                    ...preferencesMetadata,
                    date_format: value === "none" ? "" : value,
                  })}
                >
                  <SelectTrigger className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]">
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-card">
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Brand Dialog */}
      <Dialog open={brandDialogOpen} onOpenChange={setBrandDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingBrand ? 'Edit Brand' : 'Add Brand'}</DialogTitle>
            <DialogDescription>
              {editingBrand ? 'Update brand information' : 'Create a new brand for your company'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm mb-2 block">Code <span className="text-red-500">*</span></label>
                <Input
                  value={brandForm.code}
                  onChange={(e) => setBrandForm({ ...brandForm, code: e.target.value })}
                  placeholder="BRAND-001"
                  className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                />
              </div>
              <div>
                <label className="text-sm mb-2 block">Name <span className="text-red-500">*</span></label>
                <Input
                  value={brandForm.name}
                  onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                  placeholder="Brand Name"
                  className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                />
              </div>
            </div>
            <div>
              <label className="text-sm mb-2 block">Description</label>
              <Textarea
                value={brandForm.description || ""}
                onChange={(e) => setBrandForm({ ...brandForm, description: e.target.value })}
                placeholder="Brand description"
                className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm mb-2 block">Logo URL</label>
                <Input
                  value={brandForm.logo_url || ""}
                  onChange={(e) => setBrandForm({ ...brandForm, logo_url: e.target.value })}
                  placeholder="https://example.com/logo.png"
                  className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                />
              </div>
              <div>
                <label className="text-sm mb-2 block">Website</label>
                <Input
                  value={brandForm.website_url || ""}
                  onChange={(e) => setBrandForm({ ...brandForm, website_url: e.target.value })}
                  placeholder="https://example.com"
                  className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                />
              </div>
            </div>
            <div>
              <label className="text-sm mb-2 block">Status</label>
              <Select
                value={brandForm.status}
                onValueChange={(value: 'active' | 'inactive' | 'archived') => setBrandForm({ ...brandForm, status: value })}
              >
                <SelectTrigger className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-card">
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBrandDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveBrand} disabled={!brandForm.code || !brandForm.name}>
              {editingBrand ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Store Dialog */}
      <Dialog open={storeDialogOpen} onOpenChange={setStoreDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingStore ? 'Edit Store' : 'Add Store'}</DialogTitle>
            <DialogDescription>
              {editingStore ? 'Update store information' : 'Create a new store location'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm mb-2 block">Brand (Optional)</label>
              <Select
                value={storeForm.brand_id?.toString() || "none"}
                onValueChange={(value) => setStoreForm({ ...storeForm, brand_id: value === "none" ? null : parseInt(value) })}
              >
                <SelectTrigger className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]">
                  <SelectValue placeholder="Select a brand (optional)" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-card">
                  <SelectItem value="none">None</SelectItem>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id.toString()}>
                      {brand.name} ({brand.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm mb-2 block">Code <span className="text-red-500">*</span></label>
                <Input
                  value={storeForm.code}
                  onChange={(e) => setStoreForm({ ...storeForm, code: e.target.value })}
                  placeholder="STORE-001"
                  className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                />
              </div>
              <div>
                <label className="text-sm mb-2 block">Name <span className="text-red-500">*</span></label>
                <Input
                  value={storeForm.name}
                  onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
                  placeholder="Store Name"
                  className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                />
              </div>
            </div>
            <div>
              <label className="text-sm mb-2 block">Description</label>
              <Textarea
                value={storeForm.description || ""}
                onChange={(e) => setStoreForm({ ...storeForm, description: e.target.value })}
                placeholder="Store description"
                className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                rows={2}
              />
            </div>
            <div>
              <label className="text-sm mb-2 block">Address Line 1</label>
              <Input
                value={storeForm.address_line1 || ""}
                onChange={(e) => setStoreForm({ ...storeForm, address_line1: e.target.value })}
                placeholder="Street address"
                className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
              />
            </div>
            <div>
              <label className="text-sm mb-2 block">Address Line 2</label>
              <Input
                value={storeForm.address_line2 || ""}
                onChange={(e) => setStoreForm({ ...storeForm, address_line2: e.target.value })}
                placeholder="Apartment, suite, etc."
                className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm mb-2 block">City</label>
                <Input
                  value={storeForm.city || ""}
                  onChange={(e) => setStoreForm({ ...storeForm, city: e.target.value })}
                  placeholder="City"
                  className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                />
              </div>
              <div>
                <label className="text-sm mb-2 block">State</label>
                <Input
                  value={storeForm.state || ""}
                  onChange={(e) => setStoreForm({ ...storeForm, state: e.target.value })}
                  placeholder="State"
                  className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                />
              </div>
              <div>
                <label className="text-sm mb-2 block">Postal Code</label>
                <Input
                  value={storeForm.postal_code || ""}
                  onChange={(e) => setStoreForm({ ...storeForm, postal_code: e.target.value })}
                  placeholder="ZIP Code"
                  className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                />
              </div>
            </div>
            <div>
              <label className="text-sm mb-2 block">Country</label>
              <Input
                value={storeForm.country || ""}
                onChange={(e) => setStoreForm({ ...storeForm, country: e.target.value })}
                placeholder="Country"
                className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm mb-2 block">Phone</label>
                <Input
                  value={storeForm.phone || ""}
                  onChange={(e) => setStoreForm({ ...storeForm, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                  className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                />
              </div>
              <div>
                <label className="text-sm mb-2 block">Email</label>
                <Input
                  type="email"
                  value={storeForm.email || ""}
                  onChange={(e) => setStoreForm({ ...storeForm, email: e.target.value })}
                  placeholder="store@example.com"
                  className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm mb-2 block">Status</label>
                <Select
                  value={storeForm.status}
                  onValueChange={(value: 'active' | 'inactive' | 'closed') => setStoreForm({ ...storeForm, status: value })}
                >
                  <SelectTrigger className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-card">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm mb-2 block">Timezone</label>
                <Input
                  value={storeForm.timezone || ""}
                  onChange={(e) => setStoreForm({ ...storeForm, timezone: e.target.value })}
                  placeholder="America/New_York"
                  className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={storeForm.is_headquarters}
                onCheckedChange={(checked) => setStoreForm({ ...storeForm, is_headquarters: checked })}
              />
              <label className="text-sm">Is Headquarters</label>
            </div>
            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={(storeForm.metadata as any)?.is_online || false}
                  onCheckedChange={(checked) => setStoreForm({ 
                    ...storeForm, 
                    metadata: {
                      ...(storeForm.metadata as any || {}),
                      is_online: checked,
                    }
                  })}
                />
                <label className="text-sm font-medium">Online Store</label>
              </div>
              {(storeForm.metadata as any)?.is_online && (
                <div>
                  <label className="text-sm mb-2 block">Store URL <span className="text-red-500">*</span></label>
                  <Input
                    value={(storeForm.metadata as any)?.store_url || ""}
                    onChange={(e) => setStoreForm({ 
                      ...storeForm, 
                      metadata: {
                        ...(storeForm.metadata as any || {}),
                        store_url: e.target.value,
                      }
                    })}
                    placeholder="https://store.example.com"
                    className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                  />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStoreDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveStore} disabled={!storeForm.code || !storeForm.name}>
              {editingStore ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Warehouse Dialog */}
      <Dialog open={warehouseDialogOpen} onOpenChange={setWarehouseDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingWarehouse ? 'Edit Warehouse' : 'Add Warehouse'}</DialogTitle>
            <DialogDescription>
              {editingWarehouse ? 'Update warehouse information' : 'Create a new warehouse location'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm mb-2 block">Code <span className="text-red-500">*</span></label>
                <Input
                  value={warehouseForm.code}
                  onChange={(e) => setWarehouseForm({ ...warehouseForm, code: e.target.value })}
                  placeholder="WH-001"
                  className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                />
              </div>
              <div>
                <label className="text-sm mb-2 block">Name <span className="text-red-500">*</span></label>
                <Input
                  value={warehouseForm.name}
                  onChange={(e) => setWarehouseForm({ ...warehouseForm, name: e.target.value })}
                  placeholder="Warehouse Name"
                  className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                />
              </div>
            </div>
            <div>
              <label className="text-sm mb-2 block">Address</label>
              <Textarea
                value={warehouseForm.address || ""}
                onChange={(e) => setWarehouseForm({ ...warehouseForm, address: e.target.value })}
                placeholder="Warehouse address"
                className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm mb-2 block">City</label>
                <Input
                  value={warehouseForm.city || ""}
                  onChange={(e) => setWarehouseForm({ ...warehouseForm, city: e.target.value })}
                  placeholder="City"
                  className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                />
              </div>
              <div>
                <label className="text-sm mb-2 block">Country</label>
                <Input
                  value={warehouseForm.country || ""}
                  onChange={(e) => setWarehouseForm({ ...warehouseForm, country: e.target.value })}
                  placeholder="Country"
                  className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm mb-2 block">Phone</label>
                <Input
                  value={warehouseForm.phone || ""}
                  onChange={(e) => setWarehouseForm({ ...warehouseForm, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                  className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                />
              </div>
              <div>
                <label className="text-sm mb-2 block">Email</label>
                <Input
                  type="email"
                  value={warehouseForm.email || ""}
                  onChange={(e) => setWarehouseForm({ ...warehouseForm, email: e.target.value })}
                  placeholder="warehouse@example.com"
                  className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                />
              </div>
            </div>
            <div>
              <label className="text-sm mb-2 block">Status</label>
              <Select
                value={warehouseForm.status}
                onValueChange={(value) => setWarehouseForm({ ...warehouseForm, status: value })}
              >
                <SelectTrigger className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-card">
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWarehouseDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveWarehouse} disabled={!warehouseForm.code || !warehouseForm.name}>
              {editingWarehouse ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
