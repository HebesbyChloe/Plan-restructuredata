import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  X,
  Package,
  Truck,
  Calendar,
  MapPin,
  User,
  FileText,
  Plus,
  Minus,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "../ui/badge";

interface CreateInboundShipmentPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (shipmentData: any) => void;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  quantity: number;
}

export function CreateInboundShipmentPanel({
  isOpen,
  onClose,
  onSave,
}: CreateInboundShipmentPanelProps) {
  const [formData, setFormData] = useState({
    vendor: "",
    location: "",
    tracking: "",
    estimatedDate: "",
    note: "",
  });

  const [products, setProducts] = useState<Product[]>([
    { id: "1", name: "", sku: "", quantity: 1 },
  ]);

  const handleAddProduct = () => {
    setProducts([
      ...products,
      { id: Date.now().toString(), name: "", sku: "", quantity: 1 },
    ]);
  };

  const handleRemoveProduct = (id: string) => {
    if (products.length > 1) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleProductChange = (
    id: string,
    field: keyof Product,
    value: string | number
  ) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.vendor || !formData.location || !formData.tracking) {
      toast.error("Please fill in all required fields");
      return;
    }

    const hasInvalidProducts = products.some(
      (p) => !p.name || !p.sku || p.quantity < 1
    );
    if (hasInvalidProducts) {
      toast.error("Please complete all product information");
      return;
    }

    const shipmentData = {
      ...formData,
      products,
      code: `INBD${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      status: "Processing",
      items: products.reduce((sum, p) => sum + p.quantity, 0),
      productsCount: products.length,
      updateDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    };

    onSave(shipmentData);
    toast.success("Inbound shipment created successfully!");
    onClose();
    
    // Reset form
    setFormData({
      vendor: "",
      location: "",
      tracking: "",
      estimatedDate: "",
      note: "",
    });
    setProducts([{ id: "1", name: "", sku: "", quantity: 1 }]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white dark:bg-[#1a1a1a] border-l border-border shadow-2xl z-50 flex flex-col"
            style={{ backgroundColor: 'var(--background)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#DAB785] to-[#C9A874] flex items-center justify-center">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="mb-0">Add Inbound Shipment</h2>
                  <p className="text-sm text-muted-foreground mb-0">
                    Create a new incoming shipment
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Shipment Information */}
              <Card className="p-5 bg-card/50 backdrop-blur-sm border-border/50">
                <h3 className="mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#DAB785]" />
                  Shipment Information
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vendor" className="flex items-center gap-1">
                        Vendor <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="vendor"
                        placeholder="Enter vendor name"
                        value={formData.vendor}
                        onChange={(e) =>
                          setFormData({ ...formData, vendor: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location" className="flex items-center gap-1">
                        Location/Hub <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.location}
                        onValueChange={(value) =>
                          setFormData({ ...formData, location: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Internal Hub">Internal Hub</SelectItem>
                          <SelectItem value="Outbound">Outbound</SelectItem>
                          <SelectItem value="Warehouse A">Warehouse A</SelectItem>
                          <SelectItem value="Warehouse B">Warehouse B</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tracking" className="flex items-center gap-1">
                        Tracking Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="tracking"
                        placeholder="Enter tracking number"
                        value={formData.tracking}
                        onChange={(e) =>
                          setFormData({ ...formData, tracking: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="estimatedDate">Estimated Arrival</Label>
                      <Input
                        id="estimatedDate"
                        type="date"
                        value={formData.estimatedDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            estimatedDate: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="note">Notes (Optional)</Label>
                    <Textarea
                      id="note"
                      placeholder="Add any additional notes..."
                      rows={3}
                      value={formData.note}
                      onChange={(e) =>
                        setFormData({ ...formData, note: e.target.value })
                      }
                    />
                  </div>
                </div>
              </Card>

              {/* Products */}
              <Card className="p-5 bg-card/50 backdrop-blur-sm border-border/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="mb-0 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#DAB785]" />
                    Products
                  </h3>
                  <Button
                    size="sm"
                    onClick={handleAddProduct}
                    className="gap-2 bg-gradient-to-r from-[#DAB785] to-[#C9A874]"
                  >
                    <Plus className="w-4 h-4" />
                    Add Product
                  </Button>
                </div>

                <div className="space-y-3">
                  {products.map((product, index) => (
                    <Card
                      key={product.id}
                      className="p-4 bg-muted/30 border-border/50"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label className="text-xs">Product Name</Label>
                              <Input
                                placeholder="e.g., Gold Chain 18K"
                                value={product.name}
                                onChange={(e) =>
                                  handleProductChange(
                                    product.id,
                                    "name",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs">SKU</Label>
                              <Input
                                placeholder="e.g., GLD-001"
                                value={product.sku}
                                onChange={(e) =>
                                  handleProductChange(
                                    product.id,
                                    "sku",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Quantity</Label>
                            <Input
                              type="number"
                              min="1"
                              value={product.quantity}
                              onChange={(e) =>
                                handleProductChange(
                                  product.id,
                                  "quantity",
                                  parseInt(e.target.value) || 1
                                )
                              }
                            />
                          </div>
                        </div>
                        {products.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveProduct(product.id)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>

              {/* Summary */}
              <Card className="p-4 bg-gradient-to-br from-ai-blue/5 to-ai-blue/10 border-ai-blue/20">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-ai-blue flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm mb-2">
                      <span className="">Total: {products.length} product types</span> •{" "}
                      <span className="">
                        {products.reduce((sum, p) => sum + p.quantity, 0)} items
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground mb-0">
                      The shipment will be set to "Processing" status upon creation
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border bg-muted/30 flex items-center justify-between gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-gradient-to-r from-[#DAB785] to-[#C9A874] hover:from-[#C9A874] to-[#B89763]"
              >
                Create Shipment
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
