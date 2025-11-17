import { motion, AnimatePresence } from "motion/react";
import { X, Save, Layers, Upload } from "lucide-react";
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

interface CreateMaterialPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (material: any) => void;
}

export function CreateMaterialPanel({
  isOpen,
  onClose,
  onSave,
}: CreateMaterialPanelProps) {
  const initialFormData = {
    sku: "",
    name: "",
    type: "",
    purity: "",
    unit: "gram",
    unitPrice: "",
    vnStock: "",
    usStock: "",
    minStock: "",
    supplier: "",
    description: "",
    status: "active",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isDirty, setIsDirty] = useState(false);
  const [showCloseWarning, setShowCloseWarning] = useState(false);

  // Reset form when panel closes
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
    toast.success("Material created successfully");
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
            key="material-panel-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            key="material-panel-content"
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
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                        <Layers className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="mb-0">Create New Material</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-0">
                      Add a new raw material to inventory
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
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
                    onClick={handleSave}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Create Material
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent px-6">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="pricing">Pricing & Stock</TabsTrigger>
                    <TabsTrigger value="supplier">Supplier</TabsTrigger>
                  </TabsList>

                  {/* Basic Info Tab */}
                  <TabsContent value="basic" className="p-6 space-y-4">
                    <div className="space-y-2">
                      <Label>Material SKU *</Label>
                      <Input
                        placeholder="e.g., MAT-GOLD-18K"
                        value={formData.sku}
                        onChange={(e) => updateField("sku", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Material Name *</Label>
                      <Input
                        placeholder="e.g., 18K Yellow Gold"
                        value={formData.name}
                        onChange={(e) => updateField("name", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Material Type</Label>
                      <Select value={formData.type} onValueChange={(v) => updateField("type", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gold">Gold</SelectItem>
                          <SelectItem value="silver">Silver</SelectItem>
                          <SelectItem value="platinum">Platinum</SelectItem>
                          <SelectItem value="metal">Other Metal</SelectItem>
                          <SelectItem value="component">Component</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Purity/Grade</Label>
                      <Select value={formData.purity} onValueChange={(v) => updateField("purity", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select purity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="24k">24K</SelectItem>
                          <SelectItem value="18k">18K</SelectItem>
                          <SelectItem value="14k">14K</SelectItem>
                          <SelectItem value="10k">10K</SelectItem>
                          <SelectItem value="925">925 Sterling</SelectItem>
                          <SelectItem value="950">950 Platinum</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Unit of Measurement</Label>
                      <Select value={formData.unit} onValueChange={(v) => updateField("unit", v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gram">Gram (g)</SelectItem>
                          <SelectItem value="ounce">Ounce (oz)</SelectItem>
                          <SelectItem value="piece">Piece</SelectItem>
                          <SelectItem value="set">Set</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        placeholder="Enter material description..."
                        rows={3}
                        value={formData.description}
                        onChange={(e) => updateField("description", e.target.value)}
                      />
                    </div>
                  </TabsContent>

                  {/* Pricing & Stock Tab */}
                  <TabsContent value="pricing" className="p-6 space-y-4">
                    <div className="space-y-2">
                      <Label>Unit Price ($)</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={formData.unitPrice}
                        onChange={(e) => updateField("unitPrice", e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Price per {formData.unit || "unit"}
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

                    <div className="space-y-2">
                      <Label>Minimum Stock Level</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={formData.minStock}
                        onChange={(e) => updateField("minStock", e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Alert when stock falls below this level
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Total Stock</span>
                        <span className="font-medium">
                          {(parseInt(formData.vnStock) || 0) + (parseInt(formData.usStock) || 0)} {formData.unit}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Total Value</span>
                        <span className="font-medium">
                          ${((parseInt(formData.vnStock) || 0) + (parseInt(formData.usStock) || 0)) * (parseFloat(formData.unitPrice) || 0)}
                        </span>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Supplier Tab */}
                  <TabsContent value="supplier" className="p-6 space-y-4">
                    <div className="space-y-2">
                      <Label>Primary Supplier</Label>
                      <Select value={formData.supplier} onValueChange={(v) => updateField("supplier", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select supplier" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="supplier-1">Gold Suppliers Ltd.</SelectItem>
                          <SelectItem value="supplier-2">Premium Metals Co.</SelectItem>
                          <SelectItem value="supplier-3">International Metals</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={formData.status} onValueChange={(v) => updateField("status", v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="discontinued">Discontinued</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-blue-900 dark:text-blue-100 mb-0">
                        💡 You can manage supplier details and create purchase orders from the Procurement page.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </motion.div>
        </>
      )}

      {/* Unsaved Changes Warning */}
      <AlertDialog open={showCloseWarning} onOpenChange={setShowCloseWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to close this panel? All changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Editing</AlertDialogCancel>
            <AlertDialogAction onClick={handleForceClose} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AnimatePresence>
  );
}
