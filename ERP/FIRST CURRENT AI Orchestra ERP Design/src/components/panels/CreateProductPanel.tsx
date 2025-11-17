import { motion, AnimatePresence } from "motion/react";
import { X, Save, Package, Upload, Plus, Minus } from "lucide-react";
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

interface CreateProductPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (product: any) => void;
}

export function CreateProductPanel({
  isOpen,
  onClose,
  onSave,
}: CreateProductPanelProps) {
  const initialFormData = {
    sku: "",
    name: "",
    category: "",
    collection: "",
    material: "",
    retailPrice: "",
    salePrice: "",
    vnStock: "",
    usStock: "",
    description: "",
    status: "draft",
    images: [] as string[],
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isDirty, setIsDirty] = useState(false);
  const [showCloseWarning, setShowCloseWarning] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setFormData(initialFormData);
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

    onSave?.(formData);
    toast.success("Product created successfully");
    setIsDirty(false);
    onClose();
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="product-panel-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            key="product-panel-content"
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
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#DAB785] to-[#C9A874] flex items-center justify-center">
                        <Package className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="mb-0">Create New Product</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-0">
                      Add a new product to your catalog
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
                    className="flex-1 bg-gradient-to-r from-[#DAB785] to-[#C9A874] hover:from-[#C9A874] hover:to-[#B89763] text-white"
                    onClick={handleSave}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Create Product
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent px-6">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="pricing">Pricing & Stock</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                  </TabsList>

                  {/* Basic Info Tab */}
                  <TabsContent value="basic" className="p-6 space-y-4">
                    <div className="space-y-2">
                      <Label>SKU *</Label>
                      <Input
                        placeholder="e.g., RING-001"
                        value={formData.sku}
                        onChange={(e) => updateField("sku", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Product Name *</Label>
                      <Input
                        placeholder="e.g., Gold Diamond Ring"
                        value={formData.name}
                        onChange={(e) => updateField("name", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select value={formData.category} onValueChange={(v) => updateField("category", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rings">Rings</SelectItem>
                          <SelectItem value="necklaces">Necklaces</SelectItem>
                          <SelectItem value="bracelets">Bracelets</SelectItem>
                          <SelectItem value="earrings">Earrings</SelectItem>
                          <SelectItem value="pendants">Pendants</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Collection</Label>
                      <Select value={formData.collection} onValueChange={(v) => updateField("collection", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select collection" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="signature">Signature</SelectItem>
                          <SelectItem value="luxury">Luxury</SelectItem>
                          <SelectItem value="classic">Classic</SelectItem>
                          <SelectItem value="modern">Modern</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Material</Label>
                      <Select value={formData.material} onValueChange={(v) => updateField("material", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select material" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="18k-gold">18K Gold</SelectItem>
                          <SelectItem value="14k-gold">14K Gold</SelectItem>
                          <SelectItem value="platinum">Platinum</SelectItem>
                          <SelectItem value="silver">Silver</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        placeholder="Enter product description..."
                        rows={4}
                        value={formData.description}
                        onChange={(e) => updateField("description", e.target.value)}
                      />
                    </div>
                  </TabsContent>

                  {/* Pricing & Stock Tab */}
                  <TabsContent value="pricing" className="p-6 space-y-4">
                    <div className="space-y-2">
                      <Label>Retail Price ($)</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={formData.retailPrice}
                        onChange={(e) => updateField("retailPrice", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Sale Price ($)</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={formData.salePrice}
                        onChange={(e) => updateField("salePrice", e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Leave empty if not on sale
                      </p>
                    </div>

                    <div className="h-px bg-border my-4" />

                    <div className="space-y-2">
                      <Label>Vietnam Stock</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={formData.vnStock}
                        onChange={(e) => updateField("vnStock", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>US Stock</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={formData.usStock}
                        onChange={(e) => updateField("usStock", e.target.value)}
                      />
                    </div>

                    <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Total Stock</span>
                        <span className="font-medium">
                          {(parseInt(formData.vnStock) || 0) + (parseInt(formData.usStock) || 0)}
                        </span>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Details Tab */}
                  <TabsContent value="details" className="p-6 space-y-4">
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={formData.status} onValueChange={(v) => updateField("status", v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Product Images</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Drag and drop images here, or click to browse
                        </p>
                        <Button variant="outline" size="sm">
                          Choose Files
                        </Button>
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
