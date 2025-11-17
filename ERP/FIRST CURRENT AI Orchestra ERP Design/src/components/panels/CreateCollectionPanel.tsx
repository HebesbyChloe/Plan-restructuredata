import { motion, AnimatePresence } from "motion/react";
import { X, Save, Folder, Upload, Search, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface CollectionProduct {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
}

interface CreateCollectionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (collection: any) => void;
}

export function CreateCollectionPanel({
  isOpen,
  onClose,
  onSave,
}: CreateCollectionPanelProps) {
  const initialFormData = {
    name: "",
    slug: "",
    description: "",
    collectionType: "manual",
    condition: "all",
    category: "",
    priceRange: "all",
    minPrice: "",
    maxPrice: "",
    tags: "",
    visibility: "visible",
    featured: false,
    startDate: "",
    endDate: "",
    seoTitle: "",
    seoDescription: "",
    status: "active",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [products, setProducts] = useState<CollectionProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [showCloseWarning, setShowCloseWarning] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setFormData(initialFormData);
      setProducts([]);
      setSearchTerm("");
      setIsDirty(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    if (isDirty) {
      setShowCloseWarning(true);
    } else {
      onClose();
    }
  };

  const handleForceClose = () => {
    setShowCloseWarning(false);
    setIsDirty(false);
    onClose();
  };

  const handleSave = () => {
    if (!formData.name) {
      toast.error("Please enter collection name");
      return;
    }

    if (formData.collectionType === "manual" && products.length === 0) {
      toast.error("Please add at least one product to the collection");
      return;
    }

    onSave?.({ ...formData, products });
    toast.success("Collection created successfully");
    setIsDirty(false);
    onClose();
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
    
    // Auto-generate slug from name
    if (field === "name") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const addProduct = (product: CollectionProduct) => {
    if (products.find((p) => p.id === product.id)) {
      toast.error("Product already in collection");
      return;
    }
    setProducts([...products, product]);
    setSearchTerm("");
    setIsDirty(true);
  };

  const removeProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
    setIsDirty(true);
  };

  const mockProducts: CollectionProduct[] = [
    { id: "1", sku: "RING-001", name: "Gold Diamond Ring", category: "Rings", price: 1200 },
    { id: "2", sku: "NCK-001", name: "Pearl Necklace", category: "Necklaces", price: 800 },
    { id: "3", sku: "EAR-001", name: "Diamond Earrings", category: "Earrings", price: 600 },
    { id: "4", sku: "BRA-001", name: "Gold Bracelet", category: "Bracelets", price: 450 },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="collection-panel-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            key="collection-panel-content"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[90vw] md:w-[500px] lg:w-[600px] z-50"
          >
            <div className="h-full bg-white dark:bg-card border-l border-border shadow-2xl flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-border bg-muted/30 flex-shrink-0">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
                        <Folder className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="mb-0">Create New Collection</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-0">
                      Organize products into a curated collection
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleClose}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white"
                    onClick={handleSave}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Create Collection
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent px-6">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="products">
                      Products {products.length > 0 && `(${products.length})`}
                    </TabsTrigger>
                    <TabsTrigger value="rules">Rules</TabsTrigger>
                    <TabsTrigger value="seo">SEO</TabsTrigger>
                  </TabsList>

                  {/* Basic Info Tab */}
                  <TabsContent value="basic" className="p-6 space-y-4">
                    <div className="space-y-2">
                      <Label>Collection Name *</Label>
                      <Input
                        placeholder="e.g., Summer Collection 2025"
                        value={formData.name}
                        onChange={(e) => updateField("name", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>URL Slug</Label>
                      <Input
                        placeholder="summer-collection-2025"
                        value={formData.slug}
                        onChange={(e) => updateField("slug", e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        URL: /collections/{formData.slug || "..."}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        placeholder="Describe this collection..."
                        rows={4}
                        value={formData.description}
                        onChange={(e) => updateField("description", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Collection Type</Label>
                      <Select
                        value={formData.collectionType}
                        onValueChange={(v) => updateField("collectionType", v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manual">Manual (Select Products)</SelectItem>
                          <SelectItem value="automatic">Automatic (By Rules)</SelectItem>
                          <SelectItem value="smart">Smart Collection</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        {formData.collectionType === "manual" && "Manually choose which products to include"}
                        {formData.collectionType === "automatic" && "Products automatically added based on rules"}
                        {formData.collectionType === "smart" && "AI-powered product selection"}
                      </p>
                    </div>

                    <div className="h-px bg-border my-4" />

                    <div className="space-y-2">
                      <Label>Featured Image</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Upload collection banner image
                        </p>
                        <Button variant="outline" size="sm">
                          Choose File
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <p className="text-sm mb-1">Featured Collection</p>
                          <p className="text-xs text-muted-foreground mb-0">
                            Show on homepage
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.featured}
                            onChange={(e) => updateField("featured", e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => updateField("startDate", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          value={formData.endDate}
                          onChange={(e) => updateField("endDate", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={formData.status} onValueChange={(v) => updateField("status", v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>

                  {/* Products Tab */}
                  <TabsContent value="products" className="p-6 space-y-4">
                    {formData.collectionType === "manual" ? (
                      <>
                        <div className="space-y-2">
                          <Label>Add Products</Label>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              placeholder="Search products..."
                              className="pl-9"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                          </div>
                          {searchTerm && (
                            <div className="border border-border rounded-lg divide-y max-h-60 overflow-y-auto">
                              {mockProducts
                                .filter(
                                  (p) =>
                                    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map((product) => (
                                  <button
                                    key={product.id}
                                    className="w-full p-3 text-left hover:bg-muted/50 transition-colors flex items-center justify-between"
                                    onClick={() => addProduct(product)}
                                  >
                                    <div>
                                      <p className="text-sm mb-0">{product.name}</p>
                                      <p className="text-xs text-muted-foreground mb-0">
                                        {product.sku} • {product.category}
                                      </p>
                                    </div>
                                    <Plus className="w-4 h-4" />
                                  </button>
                                ))}
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Collection Products</Label>
                          {products.length === 0 ? (
                            <div className="p-8 text-center border-2 border-dashed border-border rounded-lg">
                              <Folder className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground mb-0">
                                No products added yet. Search and add products above.
                              </p>
                            </div>
                          ) : (
                            <div className="border border-border rounded-lg divide-y">
                              {products.map((product) => (
                                <div key={product.id} className="p-3 flex items-center justify-between">
                                  <div className="flex-1">
                                    <p className="text-sm mb-0">{product.name}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="outline" className="text-xs">
                                        {product.sku}
                                      </Badge>
                                      <span className="text-xs text-muted-foreground">
                                        ${product.price}
                                      </span>
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeProduct(product.id)}
                                    className="h-8 w-8 p-0 text-red-600"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="p-6 text-center border-2 border-dashed border-border rounded-lg">
                        <p className="text-sm text-muted-foreground mb-0">
                          Products will be automatically added based on the rules you define in the Rules tab
                        </p>
                      </div>
                    )}
                  </TabsContent>

                  {/* Rules Tab */}
                  <TabsContent value="rules" className="p-6 space-y-4">
                    <div className="space-y-2">
                      <Label>Match Condition</Label>
                      <Select value={formData.condition} onValueChange={(v) => updateField("condition", v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Match All Conditions</SelectItem>
                          <SelectItem value="any">Match Any Condition</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="h-px bg-border my-4" />

                    <div className="space-y-2">
                      <Label>Category Filter</Label>
                      <Select value={formData.category} onValueChange={(v) => updateField("category", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="All categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Categories</SelectItem>
                          <SelectItem value="rings">Rings</SelectItem>
                          <SelectItem value="necklaces">Necklaces</SelectItem>
                          <SelectItem value="bracelets">Bracelets</SelectItem>
                          <SelectItem value="earrings">Earrings</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Price Range</Label>
                      <Select value={formData.priceRange} onValueChange={(v) => updateField("priceRange", v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Prices</SelectItem>
                          <SelectItem value="custom">Custom Range</SelectItem>
                          <SelectItem value="budget">Budget ($0-$500)</SelectItem>
                          <SelectItem value="mid">Mid-Range ($500-$2000)</SelectItem>
                          <SelectItem value="luxury">Luxury ($2000+)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.priceRange === "custom" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Min Price ($)</Label>
                          <Input
                            type="number"
                            placeholder="0"
                            value={formData.minPrice}
                            onChange={(e) => updateField("minPrice", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Max Price ($)</Label>
                          <Input
                            type="number"
                            placeholder="No limit"
                            value={formData.maxPrice}
                            onChange={(e) => updateField("maxPrice", e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label>Tags (comma-separated)</Label>
                      <Input
                        placeholder="e.g., summer, trending, new"
                        value={formData.tags}
                        onChange={(e) => updateField("tags", e.target.value)}
                      />
                    </div>

                    <div className="p-4 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800">
                      <p className="text-sm text-indigo-900 dark:text-indigo-100 mb-0">
                        💡 Automatic collections update dynamically when products match the rules you set
                      </p>
                    </div>
                  </TabsContent>

                  {/* SEO Tab */}
                  <TabsContent value="seo" className="p-6 space-y-4">
                    <div className="space-y-2">
                      <Label>SEO Title</Label>
                      <Input
                        placeholder={formData.name || "Collection title for search engines"}
                        value={formData.seoTitle}
                        onChange={(e) => updateField("seoTitle", e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        {formData.seoTitle.length}/60 characters
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>SEO Description</Label>
                      <Textarea
                        placeholder="Description for search engines..."
                        rows={3}
                        value={formData.seoDescription}
                        onChange={(e) => updateField("seoDescription", e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        {formData.seoDescription.length}/160 characters
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                      <p className="text-xs font-medium mb-2">Search Preview</p>
                      <div className="space-y-1">
                        <p className="text-sm text-blue-600 dark:text-blue-400 mb-0">
                          {formData.seoTitle || formData.name || "Collection Name"}
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400 mb-0">
                          yourstore.com/collections/{formData.slug || "collection"}
                        </p>
                        <p className="text-xs text-muted-foreground mb-0">
                          {formData.seoDescription || formData.description || "Collection description..."}
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </motion.div>

          {/* Unsaved Changes Warning */}
          <AlertDialog open={showCloseWarning} onOpenChange={setShowCloseWarning}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
                <AlertDialogDescription>
                  You have unsaved changes. Are you sure you want to close without saving?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Continue Editing</AlertDialogCancel>
                <AlertDialogAction onClick={handleForceClose}>
                  Discard Changes
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </AnimatePresence>
  );
}
