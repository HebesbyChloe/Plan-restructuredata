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
  FileText,
  Building,
  Calendar,
  DollarSign,
  Package,
  Plus,
  Minus,
  AlertCircle,
  Truck,
} from "lucide-react";
import { toast } from "sonner";

interface CreatePurchaseOrderPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (poData: any) => void;
}

interface LineItem {
  id: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export function CreatePurchaseOrderPanel({
  isOpen,
  onClose,
  onSave,
}: CreatePurchaseOrderPanelProps) {
  const [formData, setFormData] = useState({
    vendor: "",
    deliveryDate: "",
    warehouse: "",
    paymentTerms: "",
    shippingMethod: "",
    priority: "",
    notes: "",
  });

  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: "1", productName: "", sku: "", quantity: 1, unitPrice: 0, total: 0 },
  ]);

  const handleAddLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        id: Date.now().toString(),
        productName: "",
        sku: "",
        quantity: 1,
        unitPrice: 0,
        total: 0,
      },
    ]);
  };

  const handleRemoveLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((item) => item.id !== id));
    }
  };

  const handleLineItemChange = (
    id: string,
    field: keyof LineItem,
    value: string | number
  ) => {
    setLineItems(
      lineItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          // Recalculate total
          if (field === "quantity" || field === "unitPrice") {
            updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  const calculateTotals = () => {
    const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.08; // 8% tax
    const shipping = 50; // Flat shipping
    const total = subtotal + tax + shipping;
    return { subtotal, tax, shipping, total };
  };

  const handleSubmit = () => {
    // Validation
    if (
      !formData.vendor ||
      !formData.deliveryDate ||
      !formData.warehouse ||
      !formData.priority
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const hasInvalidItems = lineItems.some(
      (item) => !item.productName || !item.sku || item.quantity < 1 || item.unitPrice <= 0
    );
    if (hasInvalidItems) {
      toast.error("Please complete all line item information");
      return;
    }

    const totals = calculateTotals();
    const poData = {
      ...formData,
      lineItems,
      poNumber: `PO-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      status: "Planning",
      items: lineItems.reduce((sum, item) => sum + item.quantity, 0),
      totalAmount: totals.total,
      subtotal: totals.subtotal,
      tax: totals.tax,
      shipping: totals.shipping,
      createdDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    };

    onSave(poData);
    toast.success("Purchase Order created successfully!");
    onClose();

    // Reset form
    setFormData({
      vendor: "",
      deliveryDate: "",
      warehouse: "",
      paymentTerms: "",
      shippingMethod: "",
      priority: "",
      notes: "",
    });
    setLineItems([
      { id: "1", productName: "", sku: "", quantity: 1, unitPrice: 0, total: 0 },
    ]);
  };

  const totals = calculateTotals();

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
            className="fixed top-0 right-0 h-full w-full max-w-3xl bg-white dark:bg-[#1a1a1a] border-l border-border shadow-2xl z-50 flex flex-col"
            style={{ backgroundColor: 'var(--background)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#DAB785] to-[#C9A874] flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="mb-0">Create Purchase Order</h2>
                  <p className="text-sm text-muted-foreground mb-0">
                    Add a new purchase order from vendor
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
              {/* Vendor & Delivery Information */}
              <Card className="p-5 bg-card/50 backdrop-blur-sm border-border/50">
                <h3 className="mb-4 flex items-center gap-2">
                  <Building className="w-5 h-5 text-[#DAB785]" />
                  Vendor & Delivery Information
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vendor" className="flex items-center gap-1">
                        Vendor <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.vendor}
                        onValueChange={(value) =>
                          setFormData({ ...formData, vendor: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select vendor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Vietnam Supplier Co.">
                            Vietnam Supplier Co.
                          </SelectItem>
                          <SelectItem value="US Gemstone Inc.">
                            US Gemstone Inc.
                          </SelectItem>
                          <SelectItem value="Diamond Direct LLC">
                            Diamond Direct LLC
                          </SelectItem>
                          <SelectItem value="Gold Metals Supply">
                            Gold Metals Supply
                          </SelectItem>
                          <SelectItem value="Thai Jewelry Components">
                            Thai Jewelry Components
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deliveryDate" className="flex items-center gap-1">
                        Expected Delivery <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="deliveryDate"
                        type="date"
                        value={formData.deliveryDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            deliveryDate: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="warehouse" className="flex items-center gap-1">
                        Warehouse/Location <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.warehouse}
                        onValueChange={(value) =>
                          setFormData({ ...formData, warehouse: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select warehouse" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Main Warehouse">Main Warehouse</SelectItem>
                          <SelectItem value="Internal Hub">Internal Hub</SelectItem>
                          <SelectItem value="Warehouse A">Warehouse A</SelectItem>
                          <SelectItem value="Warehouse B">Warehouse B</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority" className="flex items-center gap-1">
                        Priority <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value) =>
                          setFormData({ ...formData, priority: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="paymentTerms">Payment Terms</Label>
                      <Select
                        value={formData.paymentTerms}
                        onValueChange={(value) =>
                          setFormData({ ...formData, paymentTerms: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select terms" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Net 30">Net 30</SelectItem>
                          <SelectItem value="Net 60">Net 60</SelectItem>
                          <SelectItem value="Net 90">Net 90</SelectItem>
                          <SelectItem value="COD">Cash on Delivery</SelectItem>
                          <SelectItem value="Prepaid">Prepaid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="shippingMethod">Shipping Method</Label>
                      <Select
                        value={formData.shippingMethod}
                        onValueChange={(value) =>
                          setFormData({ ...formData, shippingMethod: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Air Freight">Air Freight</SelectItem>
                          <SelectItem value="Sea Freight">Sea Freight</SelectItem>
                          <SelectItem value="Express">Express Courier</SelectItem>
                          <SelectItem value="Ground">Ground Shipping</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Line Items */}
              <Card className="p-5 bg-card/50 backdrop-blur-sm border-border/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="mb-0 flex items-center gap-2">
                    <Package className="w-5 h-5 text-[#DAB785]" />
                    Line Items
                  </h3>
                  <Button
                    size="sm"
                    onClick={handleAddLineItem}
                    className="gap-2 bg-gradient-to-r from-[#DAB785] to-[#C9A874]"
                  >
                    <Plus className="w-4 h-4" />
                    Add Item
                  </Button>
                </div>

                <div className="space-y-3">
                  {lineItems.map((item, index) => (
                    <Card
                      key={item.id}
                      className="p-4 bg-muted/30 border-border/50"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label className="text-xs">Product Name</Label>
                              <Input
                                placeholder="e.g., Gold Chain 18K"
                                value={item.productName}
                                onChange={(e) =>
                                  handleLineItemChange(
                                    item.id,
                                    "productName",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs">SKU</Label>
                              <Input
                                placeholder="e.g., GLD-001"
                                value={item.sku}
                                onChange={(e) =>
                                  handleLineItemChange(
                                    item.id,
                                    "sku",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-2">
                              <Label className="text-xs">Quantity</Label>
                              <Input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) =>
                                  handleLineItemChange(
                                    item.id,
                                    "quantity",
                                    parseInt(e.target.value) || 1
                                  )
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs">Unit Price ($)</Label>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.unitPrice}
                                onChange={(e) =>
                                  handleLineItemChange(
                                    item.id,
                                    "unitPrice",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs">Total</Label>
                              <Input
                                value={`$${item.total.toFixed(2)}`}
                                disabled
                                className="bg-muted"
                              />
                            </div>
                          </div>
                        </div>
                        {lineItems.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveLineItem(item.id)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="mt-4 pt-4 border-t border-border space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span>${totals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (8%):</span>
                    <span>${totals.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping:</span>
                    <span>${totals.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border">
                    <span className="">Total:</span>
                    <span className="">${totals.total.toFixed(2)}</span>
                  </div>
                </div>
              </Card>

              {/* Notes */}
              <Card className="p-5 bg-card/50 backdrop-blur-sm border-border/50">
                <h3 className="mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#DAB785]" />
                  Additional Notes
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any special instructions, requirements, or notes..."
                    rows={4}
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                  />
                </div>
              </Card>

              {/* Info Banner */}
              <Card className="p-4 bg-gradient-to-br from-ai-blue/5 to-ai-blue/10 border-ai-blue/20">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-ai-blue flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm mb-2">
                      <span className="">
                        Total: {lineItems.length} item types
                      </span>{" "}
                      •{" "}
                      <span className="">
                        {lineItems.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                        units
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground mb-0">
                      The purchase order will be created with "Planning" status
                      and will require approval before processing.
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
                Create Purchase Order
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
