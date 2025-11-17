import { motion, AnimatePresence } from "motion/react";
import { X, Save, Box, Plus, Trash2, Search } from "lucide-react";
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

interface BundleProduct {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  price: number;
}

interface CreateBundlePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (bundle: any) => void;
}

export function CreateBundlePanel({
  isOpen,
  onClose,
  onSave,
}: CreateBundlePanelProps) {
  const initialFormData = {
    sku: "",
    name: "",
    description: "",
    bundleType: "fixed",
    pricing: "discount",
    discountType: "percentage",
    discountValue: "",
    fixedPrice: "",
    status: "active",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [products, setProducts] = useState<BundleProduct[]>([]);
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
    if (!formData.name || !formData.sku) {
      toast.error("Please fill in required fields");
      return;
    }

    if (products.length === 0) {
      toast.error("Please add at least one product to the bundle");
      return;
    }

    onSave?.({ ...formData, products });
    toast.success("Bundle created successfully");
    setIsDirty(false);
    onClose();
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const addProduct = (product: BundleProduct) => {
    if (products.find((p) => p.id === product.id)) {
      toast.error("Product already in bundle");
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

  const updateProductQuantity = (id: string, quantity: number) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, quantity } : p))
    );
    setIsDirty(true);
  };

  const calculateTotal = () => {
    return products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  };

  const calculateFinalPrice = () => {
    const total = calculateTotal();
    if (formData.pricing === "fixed") {
      return parseFloat(formData.fixedPrice) || 0;
    }
    if (formData.discountType === "percentage") {
      return total * (1 - (parseFloat(formData.discountValue) || 0) / 100);
    }
    return total - (parseFloat(formData.discountValue) || 0);
  };

  const mockProducts = [
    { id: "1", sku: "RING-001", name: "Gold Diamond Ring", quantity: 1, price: 1200 },
    { id: "2", sku: "NCK-001", name: "Pearl Necklace", quantity: 1, price: 800 },
    { id: "3", sku: "EAR-001", name: "Diamond Earrings", quantity: 1, price: 600 },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="bundle-panel-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            key="bundle-panel-content"
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
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
                        <Box className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="mb-0">Create New Bundle</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-0">
                      Combine products into a special bundle offer
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
                    className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white"
                    onClick={handleSave}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Create Bundle
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
                    <TabsTrigger value="pricing">Pricing</TabsTrigger>
                  </TabsList>

                  {/* Basic Info Tab */}
                  <TabsContent value="basic" className="p-6 space-y-4">
                    <div className="space-y-2">
                      <Label>Bundle SKU *</Label>
                      <Input
                        placeholder="e.g., BUNDLE-001"
                        value={formData.sku}
                        onChange={(e) => updateField("sku", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Bundle Name *</Label>
                      <Input
                        placeholder="e.g., Bridal Set"
                        value={formData.name}
                        onChange={(e) => updateField("name", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Bundle Type</Label>
                      <Select value={formData.bundleType} onValueChange={(v) => updateField("bundleType", v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixed">Fixed Bundle</SelectItem>
                          <SelectItem value="flexible">Flexible Bundle</SelectItem>
                          <SelectItem value="custom">Custom Bundle</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        {formData.bundleType === 'fixed' && 'Predefined products and quantities'}
                        {formData.bundleType === 'flexible' && 'Customer can choose from options'}
                        {formData.bundleType === 'custom' && 'Fully customizable by customer'}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        placeholder="Describe this bundle offer..."
                        rows={4}
                        value={formData.description}
                        onChange={(e) => updateField("description", e.target.value)}
                      />
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
                          <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>

                  {/* Products Tab */}
                  <TabsContent value="products" className="p-6 space-y-4">
                    <div className="space-y-2">
                      <Label>Add Products</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Search products by SKU or name..."
                          className="pl-9"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      {searchTerm && (
                        <div className="border border-border rounded-lg divide-y">
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
                                  <p className="text-xs text-muted-foreground mb-0">{product.sku}</p>
                                </div>
                                <Plus className="w-4 h-4" />
                              </button>
                            ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Bundle Products</Label>
                      {products.length === 0 ? (
                        <div className="p-8 text-center border-2 border-dashed border-border rounded-lg">
                          <Box className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mb-0">
                            No products added yet. Search and add products above.
                          </p>
                        </div>
                      ) : (
                        <div className="border border-border rounded-lg divide-y">
                          {products.map((product) => (
                            <div key={product.id} className="p-3 space-y-2">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="text-sm mb-0">{product.name}</p>
                                  <p className="text-xs text-muted-foreground mb-0">{product.sku}</p>
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
                              <div className="flex items-center gap-3">
                                <div className="flex-1">
                                  <Label className="text-xs">Quantity</Label>
                                  <Input
                                    type="number"
                                    min="1"
                                    value={product.quantity}
                                    onChange={(e) =>
                                      updateProductQuantity(product.id, parseInt(e.target.value) || 1)
                                    }
                                    className="h-8"
                                  />
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-muted-foreground mb-0">Price</p>
                                  <p className="text-sm mb-0">${product.price * product.quantity}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Pricing Tab */}
                  <TabsContent value="pricing" className="p-6 space-y-4">
                    <div className="space-y-2">
                      <Label>Pricing Strategy</Label>
                      <Select value={formData.pricing} onValueChange={(v) => updateField("pricing", v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="discount">Discounted Price</SelectItem>
                          <SelectItem value="fixed">Fixed Price</SelectItem>
                          <SelectItem value="regular">Regular Price (No Discount)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.pricing === "discount" && (
                      <>
                        <div className="space-y-2">
                          <Label>Discount Type</Label>
                          <Select
                            value={formData.discountType}
                            onValueChange={(v) => updateField("discountType", v)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="percentage">Percentage (%)</SelectItem>
                              <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Discount Value</Label>
                          <Input
                            type="number"
                            placeholder={formData.discountType === "percentage" ? "10" : "100"}
                            value={formData.discountValue}
                            onChange={(e) => updateField("discountValue", e.target.value)}
                          />
                        </div>
                      </>
                    )}

                    {formData.pricing === "fixed" && (
                      <div className="space-y-2">
                        <Label>Fixed Bundle Price</Label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={formData.fixedPrice}
                          onChange={(e) => updateField("fixedPrice", e.target.value)}
                        />
                      </div>
                    )}

                    <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Regular Price</span>
                        <span className="text-sm">${calculateTotal().toFixed(2)}</span>
                      </div>
                      {formData.pricing !== "regular" && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              {formData.pricing === "discount" ? "Discount" : "Bundle Price"}
                            </span>
                            <span className="text-sm text-green-600 dark:text-green-400">
                              {formData.pricing === "discount"
                                ? formData.discountType === "percentage"
                                  ? `-${formData.discountValue || 0}%`
                                  : `-$${formData.discountValue || 0}`
                                : `$${formData.fixedPrice || 0}`}
                            </span>
                          </div>
                          <div className="h-px bg-border" />
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Final Price</span>
                            <span className="text-lg font-medium text-green-600 dark:text-green-400">
                              ${calculateFinalPrice().toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Savings</span>
                            <span className="text-green-600 dark:text-green-400">
                              ${(calculateTotal() - calculateFinalPrice()).toFixed(2)} (
                              {((1 - calculateFinalPrice() / calculateTotal()) * 100).toFixed(1)}%)
                            </span>
                          </div>
                        </>
                      )}
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
