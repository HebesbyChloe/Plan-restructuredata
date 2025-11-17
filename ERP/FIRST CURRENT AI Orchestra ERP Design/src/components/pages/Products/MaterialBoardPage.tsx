"use client";

import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  Search,
  Download,
  RefreshCw,
  Plus,
  ChevronDown,
  Layers,
  Upload,
  AlertTriangle,
  Package2,
  TrendingUp,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { CreateMaterialPanel } from "../../panels";
import { MaterialTableModule } from "../../Modules/Products";
import { ProductDetailPanel } from "../../Modules/Products/ProductDetailPanel";
import { useTenantContext } from "../../../contexts/TenantContext";
import { useMaterials, useMaterialAttributes } from "../../../hooks/useProducts";
import type { Material } from "../../../types/database/products";

export function MaterialBoardPage() {
  const { currentTenantId } = useTenantContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Load materials from database
  const { materials, loading, error, refresh } = useMaterials(currentTenantId);
  const { attributes: materialAttributes } = useMaterialAttributes();

  const handleMaterialClick = (material: Material) => {
    setSelectedMaterial(material);
    setIsDetailPanelOpen(true);
  };

  // Filter materials
  const filteredMaterials = useMemo(() => {
    let filtered = materials.filter(
      (material) =>
        material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (categoryFilter !== "all") {
      filtered = filtered.filter(m => m.category === categoryFilter);
    }

    return filtered;
  }, [materials, searchTerm, categoryFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalStock = materials.reduce((sum, m) => sum + Number(m.stock_vn || 0) + Number(m.stock_us || 0), 0);
    const lowStock = materials.filter(m => {
      const total = Number(m.stock_vn || 0) + Number(m.stock_us || 0);
      return total > 0 && total < 10; // Low stock threshold for materials
    }).length;
    const outOfStock = materials.filter(m => {
      const total = Number(m.stock_vn || 0) + Number(m.stock_us || 0);
      return total === 0;
    }).length;
    const totalValue = materials.reduce((sum, m) => {
      const total = Number(m.stock_vn || 0) + Number(m.stock_us || 0);
      return sum + total * Number(m.cost || 0);
    }, 0);

    return { total: materials.length, lowStock, outOfStock, totalValue };
  }, [materials]);

  // Get unique categories for filter
  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(materials.map(m => m.category))).sort();
  }, [materials]);

  const needsDatabaseSetup = error?.message?.includes("relation") || error?.message?.includes("does not exist");

  if (needsDatabaseSetup) {
    return (
      <div className="w-full h-full bg-[#FAFAFA] dark:bg-background -m-8 p-8">
        <Card className="p-8 bg-white dark:bg-card border-[#E5E5E5]">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="mb-2">Database Setup Required</h2>
              <p className="text-muted-foreground mb-0">
                The <code className="px-2 py-1 bg-muted rounded">material</code> table needs to be created in your Supabase database.
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!currentTenantId) {
    return (
      <div className="w-full h-full bg-[#FAFAFA] dark:bg-background -m-8 p-8">
        <Card className="p-8 bg-white dark:bg-card border-[#E5E5E5]">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="mb-2">Select a Tenant</h2>
              <p className="text-muted-foreground mb-0">
                Please select a tenant from Company Settings to manage materials.
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#FAFAFA] dark:bg-background -m-8 p-8">
      {/* Summary Bar */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Materials</p>
              <h3 className="text-2xl mb-0">{loading ? "..." : stats.total}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#10B981] to-[#34D399] flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Low Stock</p>
              <h3 className="text-2xl mb-0">{loading ? "..." : stats.lowStock}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Out of Stock</p>
              <h3 className="text-2xl mb-0">{loading ? "..." : stats.outOfStock}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-950 flex items-center justify-center">
              <Package2 className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Value</p>
              <h3 className="text-2xl mb-0">{loading ? "..." : `$${stats.totalValue.toLocaleString()}`}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="mb-2">Materials Board</h1>
          <p className="text-muted-foreground mb-0">
            Manage raw materials and inventory
          </p>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-[#E5E5E5] bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
              Actions
              <ChevronDown className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Download className="w-4 h-4 mr-2" />
                Export
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Upload className="w-4 h-4 mr-2" />
                Import
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            className="gap-2 bg-gradient-to-r from-[#10B981] to-[#34D399] hover:from-[#059669] to-[#10B981] text-white shadow-md"
            onClick={() => setIsCreatePanelOpen(true)}
          >
            <Plus className="w-4 h-4" />
            New Material
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-sm mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5] dark:border-border"
            />
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[160px] bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {uniqueCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[160px] bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="in_stock">In Stock</SelectItem>
              <SelectItem value="low_stock">Low Stock</SelectItem>
              <SelectItem value="out_of_stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[160px] bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="VN">Vietnam</SelectItem>
              <SelectItem value="US">United States</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Material Table - Using Module */}
      <Card className="bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-md">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : error && !needsDatabaseSetup ? (
          <div className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <p className="text-destructive">Error loading materials: {error.message}</p>
          </div>
        ) : filteredMaterials.length === 0 ? (
          <div className="p-8 text-center">
            <Layers className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No materials found. Create your first material to get started.</p>
          </div>
        ) : (
          <MaterialTableModule
            materials={filteredMaterials}
            selectedMaterial={selectedMaterial}
            onMaterialClick={handleMaterialClick}
          />
        )}
      </Card>

      {/* Create Material Panel */}
      <CreateMaterialPanel
        isOpen={isCreatePanelOpen}
        onClose={() => setIsCreatePanelOpen(false)}
        onSave={(material) => {
          console.log("New material:", material);
          toast.success("Material created successfully!");
        }}
      />

      {/* Material Detail Panel */}
      {selectedMaterial && (
        <ProductDetailPanel
          isOpen={isDetailPanelOpen}
          onClose={() => {
            setIsDetailPanelOpen(false);
            setSelectedMaterial(null);
          }}
          title={selectedMaterial.name}
          subtitle={`SKU: ${selectedMaterial.sku}`}
          productType="material"
          tabs={[
            {
              value: "overview",
              label: "Overview",
              content: (
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Category</p>
                      <p className="mb-0">{selectedMaterial.category ?? 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Type</p>
                      <p className="mb-0 capitalize">{selectedMaterial.type ?? 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Unit</p>
                      <p className="mb-0">{selectedMaterial.unit ?? 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Price/Unit</p>
                      <p className="mb-0">${selectedMaterial.pricePerUnit?.toFixed(2) ?? 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Stock (VN)</p>
                      <p className="mb-0">{selectedMaterial.vnStock ?? 0} {selectedMaterial.unit ?? ''}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Stock (US)</p>
                      <p className="mb-0">{selectedMaterial.usStock ?? 0} {selectedMaterial.unit ?? ''}</p>
                    </div>
                  </div>
                </div>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}
