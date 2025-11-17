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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import {
  Search,
  Download,
  RefreshCw,
  Plus,
  ChevronDown,
  Box,
  Upload,
  Package,
  TrendingUp,
  Layers,
  Wand2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CreateBundlePanel } from "../../panels";
import { BundleTableModule, CustomProductTableModule } from "../../Modules/Products";
import { Bundle } from "../../Modules/Products/BundleTable/types";
import { CustomProduct } from "../../Modules/Products/CustomProductTable/types";
import { mockBundles } from "../../../sampledata/bundles";
import { mockCustomProducts } from "../../../sampledata/customProducts";
import { ProductDetailPanel } from "../../Modules/Products/ProductDetailPanel";

export function CustomBundleBoardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);
  const [selectedCustomProduct, setSelectedCustomProduct] = useState<CustomProduct | null>(null);
  const [isBundlePanelOpen, setIsBundlePanelOpen] = useState(false);
  const [isCustomProductPanelOpen, setIsCustomProductPanelOpen] = useState(false);
  const [isCreateBundlePanelOpen, setIsCreateBundlePanelOpen] = useState(false);
  const [isCreateCustomPanelOpen, setIsCreateCustomPanelOpen] = useState(false);

  // Use sample data
  const [bundles] = useState<Bundle[]>(mockBundles);
  const [customProducts] = useState<CustomProduct[]>(mockCustomProducts);

  const handleBundleClick = (bundle: Bundle) => {
    setSelectedBundle(bundle);
    setIsBundlePanelOpen(true);
  };

  const handleCustomProductClick = (product: CustomProduct) => {
    setSelectedCustomProduct(product);
    setIsCustomProductPanelOpen(true);
  };

  const filteredBundles = bundles.filter(
    (bundle) =>
      bundle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bundle.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCustomProducts = customProducts.filter(
    (product) =>
      product.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats
  const totalBundles = bundles.length;
  const activeBundles = bundles.filter((b) => b.status === "active").length;
  const totalProductsInBundles = bundles.reduce((sum, b) => sum + b.products.length, 0);
  const totalBundleValue = bundles.reduce((sum, b) => sum + b.bundlePrice, 0);

  const totalCustom = customProducts.length;
  const inProductionCustom = customProducts.filter((c) => 
    c.status === "in_production" || c.status === "in_design"
  ).length;
  const completedCustom = customProducts.filter((c) => c.status === "completed").length;
  const totalCustomValue = customProducts.reduce((sum, c) => sum + c.totalPrice, 0);

  return (
    <div className="w-full h-full bg-[#FAFAFA] dark:bg-background -m-8 p-8">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="mb-2">Custom & Bundles</h1>
          <p className="text-muted-foreground mb-0">
            Manage custom orders and product bundles
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
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="custom" className="space-y-6">
        <TabsList className="bg-[#F8F8F8] dark:bg-muted">
          <TabsTrigger value="custom">Custom Orders</TabsTrigger>
          <TabsTrigger value="bundles">Bundles</TabsTrigger>
        </TabsList>

        {/* Custom Products Tab */}
        <TabsContent value="custom" className="space-y-6">
          {/* Summary Bar */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total Custom</p>
                  <h3 className="text-2xl mb-0">{totalCustom}</h3>
                </div>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#EC4899] to-[#F472B6] flex items-center justify-center">
                  <Wand2 className="w-5 h-5 text-white" />
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">In Production</p>
                  <h3 className="text-2xl mb-0">{inProductionCustom}</h3>
                </div>
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
                  <Package className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Completed</p>
                  <h3 className="text-2xl mb-0">{completedCustom}</h3>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total Value</p>
                  <h3 className="text-2xl mb-0">${totalCustomValue.toLocaleString()}</h3>
                </div>
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button
              className="gap-2 bg-gradient-to-r from-[#EC4899] to-[#F472B6] hover:from-[#DB2777] to-[#EC4899] text-white shadow-md"
              onClick={() => setIsCreateCustomPanelOpen(true)}
            >
              <Plus className="w-4 h-4" />
              New Custom Order
            </Button>
          </div>

          {/* Filters */}
          <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[250px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search custom orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5] dark:border-border"
                />
              </div>

              <Select>
                <SelectTrigger className="w-[160px] bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending_approval">Pending Approval</SelectItem>
                  <SelectItem value="in_design">In Design</SelectItem>
                  <SelectItem value="in_production">In Production</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-[180px] bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="engraving">Engraving</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="sizing">Sizing</SelectItem>
                  <SelectItem value="stone_selection">Stone Selection</SelectItem>
                  <SelectItem value="full_custom">Full Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Custom Products Table */}
          <Card className="bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-md">
            <CustomProductTableModule
              customProducts={filteredCustomProducts}
              selectedProduct={selectedCustomProduct}
              onProductClick={handleCustomProductClick}
            />
          </Card>
        </TabsContent>

        {/* Bundles Tab */}
        <TabsContent value="bundles" className="space-y-6">
          {/* Summary Bar */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total Bundles</p>
                  <h3 className="text-2xl mb-0">{totalBundles}</h3>
                </div>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#EC4899] to-[#F472B6] flex items-center justify-center">
                  <Box className="w-5 h-5 text-white" />
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Active Bundles</p>
                  <h3 className="text-2xl mb-0">{activeBundles}</h3>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
                  <Package className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total Products</p>
                  <h3 className="text-2xl mb-0">{totalProductsInBundles}</h3>
                </div>
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total Value</p>
                  <h3 className="text-2xl mb-0">${totalBundleValue.toLocaleString()}</h3>
                </div>
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button
              className="gap-2 bg-gradient-to-r from-[#EC4899] to-[#F472B6] hover:from-[#DB2777] to-[#EC4899] text-white shadow-md"
              onClick={() => setIsCreateBundlePanelOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Create Bundle
            </Button>
          </div>

          {/* Filters */}
          <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[250px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search bundles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5] dark:border-border"
                />
              </div>

              <Select>
                <SelectTrigger className="w-[160px] bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-[160px] bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="fixed">Fixed Bundle</SelectItem>
                  <SelectItem value="custom">Custom Bundle</SelectItem>
                  <SelectItem value="gift">Gift Set</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Bundle Table */}
          <Card className="bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-md">
            <BundleTableModule
              bundles={filteredBundles}
              selectedBundle={selectedBundle}
              onBundleClick={handleBundleClick}
            />
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Bundle Panel */}
      <CreateBundlePanel
        isOpen={isCreateBundlePanelOpen}
        onClose={() => setIsCreateBundlePanelOpen(false)}
        onSave={(bundle) => {
          console.log("New bundle:", bundle);
          toast.success("Bundle created successfully!");
        }}
      />

      {/* Bundle Detail Panel */}
      {selectedBundle && (
        <ProductDetailPanel
          isOpen={isBundlePanelOpen}
          onClose={() => {
            setIsBundlePanelOpen(false);
            setSelectedBundle(null);
          }}
          title={selectedBundle.name}
          subtitle={`SKU: ${selectedBundle.sku}`}
          productType="bundle"
          tabs={[
            {
              value: "overview",
              label: "Overview",
              content: (
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Status</p>
                      <p className="mb-0 capitalize">{selectedBundle.status ?? 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Type</p>
                      <p className="mb-0 capitalize">{selectedBundle.type?.replace('_', ' ') ?? 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Bundle Price</p>
                      <p className="mb-0">${selectedBundle.bundlePrice?.toLocaleString() ?? 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Individual Price</p>
                      <p className="mb-0">${selectedBundle.individualPrice?.toLocaleString() ?? 'N/A'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Products in Bundle ({selectedBundle.products?.length ?? 0})</p>
                    <div className="space-y-2">
                      {(selectedBundle.products ?? []).map((product, idx) => (
                        <div key={idx} className="p-3 bg-muted/30 rounded-lg">
                          <p className="text-sm mb-0">{product.name} (x{product.quantity})</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ),
            },
          ]}
        />
      )}

      {/* Custom Product Detail Panel */}
      {selectedCustomProduct && (
        <ProductDetailPanel
          isOpen={isCustomProductPanelOpen}
          onClose={() => {
            setIsCustomProductPanelOpen(false);
            setSelectedCustomProduct(null);
          }}
          title={`Custom Order - ${selectedCustomProduct.customerName}`}
          subtitle={`Order #${selectedCustomProduct.orderNumber}`}
          productType="custom"
          tabs={[
            {
              value: "overview",
              label: "Overview",
              content: (
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Status</p>
                      <p className="mb-0 capitalize">{selectedCustomProduct.status?.replace('_', ' ') ?? 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Type</p>
                      <p className="mb-0 capitalize">{selectedCustomProduct.customizationType?.replace('_', ' ') ?? 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Product Type</p>
                      <p className="mb-0 capitalize">{selectedCustomProduct.productType ?? 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Assigned To</p>
                      <p className="mb-0">{selectedCustomProduct.assignedTo ?? 'Unassigned'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Base Price</p>
                      <p className="mb-0">${selectedCustomProduct.basePrice?.toLocaleString() ?? '0'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Customization Fee</p>
                      <p className="mb-0">${selectedCustomProduct.customizationFee?.toLocaleString() ?? '0'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Price</p>
                      <p className="mb-0">${selectedCustomProduct.totalPrice?.toLocaleString() ?? '0'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Est. Completion</p>
                      <p className="mb-0">{selectedCustomProduct.estimatedCompletion ? new Date(selectedCustomProduct.estimatedCompletion).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </div>
                  {selectedCustomProduct.specifications && Object.keys(selectedCustomProduct.specifications).length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Specifications</p>
                      <div className="space-y-2">
                        {Object.entries(selectedCustomProduct.specifications).map(([key, value]) => (
                          value && (
                            <div key={key} className="flex justify-between p-2 bg-muted/30 rounded">
                              <span className="text-sm capitalize">{key.replace('_', ' ')}:</span>
                              <span className="text-sm">{value}</span>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedCustomProduct.notes && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Notes</p>
                      <p className="text-sm bg-muted/30 p-3 rounded">{selectedCustomProduct.notes}</p>
                    </div>
                  )}
                </div>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}
