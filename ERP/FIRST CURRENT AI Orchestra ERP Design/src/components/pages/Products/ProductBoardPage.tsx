"use client";

import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Badge } from "../../ui/badge";
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
  Package,
  Upload,
  Layers,
  CheckCircle2,
  TrendingDown,
  Edit3,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { CreateProductPanel } from "../../panels";
import { ProductBoardTableModule } from "../../Modules/Products";
import { ProductBoardData } from "../../Modules/Products/ProductBoardTable/types";
import { ProductDetailPanel } from "../../Modules/Products/ProductDetailPanel";
import { useTenantContext } from "../../../contexts/TenantContext";
import { useProducts, useCategories, useStock } from "../../../hooks/useProducts";
import { transformProductFromDB, isLowStock } from "../../../utils/products";
import type { Product } from "../../../types/database/products";

export function ProductBoardPage() {
  const { currentTenantId } = useTenantContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<ProductBoardData | null>(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");
  const [productTypeFilter, setProductTypeFilter] = useState<string>("all");

  // Load products from database
  const { products: dbProducts, loading, error, refresh } = useProducts(currentTenantId, {
    search: searchTerm || undefined,
    status: statusFilter !== "all" ? statusFilter as Product['status'] : undefined,
  });
  
  const { categories } = useCategories(currentTenantId);
  const { stock: allStock } = useStock(currentTenantId);

  // Transform products to UI format
  const products = useMemo(() => {
    if (!dbProducts || !allStock) return [];
    
    const stockMap = new Map(allStock.map(s => [s.product_sku, s]));
    
    return dbProducts.map((product: any) => {
      const productStock = stockMap.get(product.sku);
      const productWithRelations = {
        ...product,
        stock: productStock,
        categories: product.categories || [],
        images: product.images || null,
        tags: product.tags || [],
      };
      return transformProductFromDB(productWithRelations as any);
    });
  }, [dbProducts, allStock]);

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Category filter
    if (categoryFilter !== "all") {
      const categoryId = parseInt(categoryFilter, 10);
      if (!isNaN(categoryId)) {
        // Filter by category (would need to load product_category relations)
        // For now, filter by category name in transformed data
        filtered = filtered.filter(p => p.category.includes(categories.find(c => c.id === categoryId)?.name || ''));
      }
    }

    // Stock filter
    if (stockFilter !== "all") {
      const stockMap = new Map(allStock?.map(s => [s.product_sku, s]) || []);
      filtered = filtered.filter(p => {
        const stock = stockMap.get(p.sku);
        const totalStock = (stock?.quantity_vn || 0) + (stock?.quantity_us || 0);
        if (stockFilter === "in-stock") return totalStock > 0;
        if (stockFilter === "low-stock") return totalStock > 0 && totalStock < 15;
        if (stockFilter === "out-of-stock") return totalStock === 0;
        return true;
      });
    }

    // Product type filter
    if (productTypeFilter !== "all") {
      filtered = filtered.filter(p => p.product_type === productTypeFilter);
    }

    return filtered;
  }, [products, categoryFilter, stockFilter, productTypeFilter, categories, allStock]);

  const handleProductClick = (product: ProductBoardData) => {
    setSelectedProduct(product);
    setIsDetailPanelOpen(true);
  };

  const handleSync = () => {
    refresh();
    toast.success("Products refreshed!");
  };

  // Calculate stats
  const stats = useMemo(() => {
    const stockMap = new Map(allStock?.map(s => [s.product_sku, s]) || []);
    return {
      total: products.length,
      draft: products.filter(p => p.status === "draft").length,
      updated: products.filter(p => p.status === "updated" || p.status === "publish").length,
      lowStock: products.filter(p => {
        const stock = stockMap.get(p.sku);
        return isLowStock(stock, 15);
      }).length,
    };
  }, [products, allStock]);

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
                The <code className="px-2 py-1 bg-muted rounded">product</code>, <code className="px-2 py-1 bg-muted rounded">stock</code>, and related tables need to be created in your Supabase database.
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
                Please select a tenant from Company Settings to manage products.
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
              <p className="text-xs text-muted-foreground mb-1">Total Products</p>
              <h3 className="text-2xl mb-0">{loading ? "..." : stats.total}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#DAB785] to-[#C9A874] flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Draft</p>
              <h3 className="text-2xl mb-0">{loading ? "..." : stats.draft}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Edit3 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Published</p>
              <h3 className="text-2xl mb-0">{loading ? "..." : stats.updated}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Low Stock</p>
              <h3 className="text-2xl mb-0">{loading ? "..." : stats.lowStock}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-950 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="mb-2">Product Board</h1>
          <p className="text-muted-foreground mb-0">
            Manage your product catalog and inventory
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
                <Layers className="w-4 h-4 mr-2" />
                Bulk Action
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSync}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            className="gap-2 bg-gradient-to-r from-[#DAB785] to-[#C9A874] hover:from-[#C9A874] to-[#B89763] text-white shadow-md"
            onClick={() => setIsCreatePanelOpen(true)}
          >
            <Plus className="w-4 h-4" />
            New Product
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-sm mb-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
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
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[160px] bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]">
                <SelectValue placeholder="Collection" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Collections</SelectItem>
                <SelectItem value="lotus">Sacred Lotus</SelectItem>
                <SelectItem value="celestial">Celestial</SelectItem>
                <SelectItem value="love">Love & Light</SelectItem>
                <SelectItem value="healing">Healing Stones</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-[#DAB785] text-[#DAB785] hover:bg-[#DAB785]/10"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              Advanced Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showAdvancedFilters ? "rotate-180" : ""}`} />
            </Button>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showAdvancedFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-3 border-t border-[#E5E5E5] dark:border-border">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground">Stock Status</label>
                      <Select value={stockFilter} onValueChange={setStockFilter}>
                        <SelectTrigger className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]">
                          <SelectValue placeholder="All Stock" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Stock</SelectItem>
                          <SelectItem value="in-stock">In Stock</SelectItem>
                          <SelectItem value="low-stock">Low Stock (&lt;15)</SelectItem>
                          <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground">Material</label>
                      <Select>
                        <SelectTrigger className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]">
                          <SelectValue placeholder="All Materials" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Materials</SelectItem>
                          <SelectItem value="gold">18K Gold</SelectItem>
                          <SelectItem value="silver">Sterling Silver</SelectItem>
                          <SelectItem value="rose-gold">Rose Gold</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground">Status</label>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]">
                          <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="publish">Published</SelectItem>
                          <SelectItem value="updated">Updated</SelectItem>
                          <SelectItem value="do_not_import">Do Not Import</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground">Product Type</label>
                      <Select value={productTypeFilter} onValueChange={setProductTypeFilter}>
                        <SelectTrigger className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]">
                          <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="variant">Variant</SelectItem>
                          <SelectItem value="set">Bundle/Set</SelectItem>
                          <SelectItem value="customize">Custom</SelectItem>
                          <SelectItem value="jewelry">Jewelry</SelectItem>
                          <SelectItem value="diamond">Diamond</SelectItem>
                          <SelectItem value="gemstone">Gemstone</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-end">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-[#E5E5E5]"
                        onClick={() => {
                          setStatusFilter("all");
                          setCategoryFilter("all");
                          setStockFilter("all");
                          setProductTypeFilter("all");
                        }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>

      {/* Product Table - Using Module */}
      <Card className="bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-md">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : error && !needsDatabaseSetup ? (
          <div className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <p className="text-destructive">Error loading products: {error.message}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-8 text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No products found. Create your first product to get started.</p>
          </div>
        ) : (
          <ProductBoardTableModule
            products={filteredProducts}
            selectedProduct={selectedProduct}
            onProductClick={handleProductClick}
          />
        )}
      </Card>

      {/* Create Product Panel */}
      <CreateProductPanel
        isOpen={isCreatePanelOpen}
        onClose={() => setIsCreatePanelOpen(false)}
        onSave={(product) => {
          console.log("New product:", product);
          toast.success("Product created successfully!");
        }}
      />

      {/* Product Detail Panel */}
      {selectedProduct && (
        <ProductDetailPanel
          isOpen={isDetailPanelOpen}
          onClose={() => {
            setIsDetailPanelOpen(false);
            setSelectedProduct(null);
          }}
          title={selectedProduct.name}
          subtitle={`SKU: ${selectedProduct.sku}`}
          productType="product"
          tabs={[
            {
              value: "overview",
              label: "Overview",
              content: (
                <div className="space-y-6">
                  {/* Main Product Image */}
                  {selectedProduct.thumbnail && (
                    <div className="aspect-square rounded-lg overflow-hidden bg-muted/30">
                      <img
                        src={selectedProduct.thumbnail}
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Description */}
                  {selectedProduct.description && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Description</p>
                      <p className="text-sm mb-0">{selectedProduct.description}</p>
                    </div>
                  )}

                  {/* Basic Info Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground mb-1">Category</p>
                      <p className="text-sm mb-0">{selectedProduct.category}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground mb-1">Collection</p>
                      <p className="text-sm mb-0">{selectedProduct.collection}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground mb-1">Material</p>
                      <p className="text-sm mb-0">{selectedProduct.material ?? 'N/A'}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground mb-1">Status</p>
                      <Badge variant={selectedProduct.status === 'updated' ? 'default' : 'secondary'} className="capitalize">
                        {selectedProduct.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              value: "images",
              label: "Images",
              content: (
                <div className="space-y-4">
                  {selectedProduct.images && selectedProduct.images.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      {selectedProduct.images.map((image, index) => (
                        <div key={index} className="aspect-square rounded-lg overflow-hidden bg-muted/30 border border-border">
                          <img
                            src={image}
                            alt={`${selectedProduct.name} - Image ${index + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">No images available</p>
                    </div>
                  )}
                </div>
              ),
            },
            {
              value: "pricing",
              label: "Pricing & Stock",
              content: (
                <div className="space-y-6">
                  {/* Pricing */}
                  <div>
                    <p className="text-sm mb-4">Pricing</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">Retail Price</p>
                        <p className="text-xl mb-0">${selectedProduct.retailPrice?.toLocaleString() ?? 'N/A'}</p>
                      </div>
                      {selectedProduct.salePrice && (
                        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                          <p className="text-xs text-green-700 dark:text-green-400 mb-1">Sale Price</p>
                          <p className="text-xl text-green-700 dark:text-green-400 mb-0">
                            ${selectedProduct.salePrice.toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stock */}
                  <div>
                    <p className="text-sm mb-4">Stock Levels</p>
                    <div className="space-y-3">
                      <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs text-muted-foreground">Vietnam Stock</p>
                          <p className="text-sm mb-0">{selectedProduct.vnStock ?? 0} units</p>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500"
                            style={{ width: `${Math.min((selectedProduct.vnStock ?? 0) / 100 * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs text-muted-foreground">US Stock</p>
                          <p className="text-sm mb-0">{selectedProduct.usStock ?? 0} units</p>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-purple-500"
                            style={{ width: `${Math.min((selectedProduct.usStock ?? 0) / 100 * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-gradient-to-br from-[#DAB785]/10 to-[#C9A874]/10 border border-[#DAB785]/20">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-[#C9A874] dark:text-[#DAB785]">Total Stock</p>
                          <p className="text-xl text-[#C9A874] dark:text-[#DAB785] mb-0">
                            {(selectedProduct.vnStock ?? 0) + (selectedProduct.usStock ?? 0)} units
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              value: "details",
              label: "Details",
              content: (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    {selectedProduct.stone && (
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">Stone</p>
                        <p className="text-sm mb-0">{selectedProduct.stone}</p>
                      </div>
                    )}
                    {selectedProduct.charm && (
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">Charm</p>
                        <p className="text-sm mb-0">{selectedProduct.charm}</p>
                      </div>
                    )}
                    {selectedProduct.charmSize && (
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">Charm Size</p>
                        <p className="text-sm mb-0">{selectedProduct.charmSize}</p>
                      </div>
                    )}
                    {selectedProduct.beadSize && (
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">Bead Size</p>
                        <p className="text-sm mb-0">{selectedProduct.beadSize}</p>
                      </div>
                    )}
                    {selectedProduct.color && (
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">Color</p>
                        <p className="text-sm mb-0">{selectedProduct.color}</p>
                      </div>
                    )}
                    {selectedProduct.element && (
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">Element</p>
                        <p className="text-sm mb-0">{selectedProduct.element}</p>
                      </div>
                    )}
                    {selectedProduct.size && (
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">Size</p>
                        <p className="text-sm mb-0">{selectedProduct.size}</p>
                      </div>
                    )}
                    {selectedProduct.gender && (
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">Gender</p>
                        <p className="text-sm mb-0">{selectedProduct.gender}</p>
                      </div>
                    )}
                    {selectedProduct.origin && (
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">Origin</p>
                        <p className="text-sm mb-0">{selectedProduct.origin}</p>
                      </div>
                    )}
                    {selectedProduct.year && (
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">Year</p>
                        <p className="text-sm mb-0">{selectedProduct.year}</p>
                      </div>
                    )}
                    {selectedProduct.grade && (
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">Grade</p>
                        <p className="text-sm mb-0">{selectedProduct.grade}</p>
                      </div>
                    )}
                    {selectedProduct.intention && (
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">Intention</p>
                        <p className="text-sm mb-0">{selectedProduct.intention}</p>
                      </div>
                    )}
                  </div>

                  {/* Last Update */}
                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Last Updated</span>
                      <span>{selectedProduct.lastUpdate}</span>
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
