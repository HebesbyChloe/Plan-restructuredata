import { motion, AnimatePresence } from "motion/react";
import { X, Save, DollarSign, Plus, Minus } from "lucide-react";
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

interface PricingTier {
  minQty: number;
  maxQty: number | null;
  price: number;
  discount: number;
}

interface CreatePricingRulePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (rule: any) => void;
}

export function CreatePricingRulePanel({
  isOpen,
  onClose,
  onSave,
}: CreatePricingRulePanelProps) {
  const initialFormData = {
    name: "",
    type: "tier",
    applyTo: "all",
    category: "",
    product: "",
    customerGroup: "all",
    basePrice: "",
    currency: "USD",
    startDate: "",
    endDate: "",
    status: "active",
    description: "",
  };

  const initialTiers: PricingTier[] = [
    { minQty: 1, maxQty: 10, price: 0, discount: 0 },
    { minQty: 11, maxQty: 50, price: 0, discount: 5 },
    { minQty: 51, maxQty: null, price: 0, discount: 10 },
  ];

  const [formData, setFormData] = useState(initialFormData);
  const [tiers, setTiers] = useState<PricingTier[]>(initialTiers);
  const [isDirty, setIsDirty] = useState(false);
  const [showCloseWarning, setShowCloseWarning] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setFormData(initialFormData);
      setTiers(initialTiers);
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
      toast.error("Please enter rule name");
      return;
    }

    onSave?.({ ...formData, tiers });
    toast.success("Pricing rule created successfully");
    setIsDirty(false);
    onClose();
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const addTier = () => {
    const lastTier = tiers[tiers.length - 1];
    setTiers([
      ...tiers,
      { minQty: (lastTier.maxQty || 0) + 1, maxQty: null, price: 0, discount: 0 },
    ]);
    setIsDirty(true);
  };

  const removeTier = (index: number) => {
    if (tiers.length > 1) {
      setTiers(tiers.filter((_, i) => i !== index));
      setIsDirty(true);
    }
  };

  const updateTier = (index: number, field: keyof PricingTier, value: any) => {
    setTiers(
      tiers.map((tier, i) =>
        i === index ? { ...tier, [field]: value } : tier
      )
    );
    setIsDirty(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="pricing-panel-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            key="pricing-panel-content"
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
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="mb-0">Create Pricing Rule</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-0">
                      Define dynamic pricing rules and tiers
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
                    className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
                    onClick={handleSave}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Create Rule
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent px-6">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="conditions">Conditions</TabsTrigger>
                    <TabsTrigger value="tiers">Pricing Tiers</TabsTrigger>
                  </TabsList>

                  {/* Basic Info Tab */}
                  <TabsContent value="basic" className="p-6 space-y-4">
                    <div className="space-y-2">
                      <Label>Rule Name *</Label>
                      <Input
                        placeholder="e.g., Wholesale Pricing Tier"
                        value={formData.name}
                        onChange={(e) => updateField("name", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Pricing Type</Label>
                      <Select value={formData.type} onValueChange={(v) => updateField("type", v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tier">Tiered Pricing</SelectItem>
                          <SelectItem value="volume">Volume Discount</SelectItem>
                          <SelectItem value="customer">Customer Group Pricing</SelectItem>
                          <SelectItem value="promotional">Promotional Pricing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Base Price ($)</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={formData.basePrice}
                        onChange={(e) => updateField("basePrice", e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Starting price before discounts
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Select value={formData.currency} onValueChange={(v) => updateField("currency", v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="VND">VND (₫)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="h-px bg-border my-4" />

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
                      <Label>Description</Label>
                      <Textarea
                        placeholder="Describe this pricing rule..."
                        rows={3}
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

                  {/* Conditions Tab */}
                  <TabsContent value="conditions" className="p-6 space-y-4">
                    <div className="space-y-2">
                      <Label>Apply To</Label>
                      <Select value={formData.applyTo} onValueChange={(v) => updateField("applyTo", v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Products</SelectItem>
                          <SelectItem value="category">Specific Category</SelectItem>
                          <SelectItem value="product">Specific Product</SelectItem>
                          <SelectItem value="collection">Specific Collection</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.applyTo === "category" && (
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
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {formData.applyTo === "product" && (
                      <div className="space-y-2">
                        <Label>Product</Label>
                        <Input
                          placeholder="Search product..."
                          value={formData.product}
                          onChange={(e) => updateField("product", e.target.value)}
                        />
                      </div>
                    )}

                    <div className="h-px bg-border my-4" />

                    <div className="space-y-2">
                      <Label>Customer Group</Label>
                      <Select
                        value={formData.customerGroup}
                        onValueChange={(v) => updateField("customerGroup", v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Customers</SelectItem>
                          <SelectItem value="wholesale">Wholesale</SelectItem>
                          <SelectItem value="vip">VIP Members</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-blue-900 dark:text-blue-100 mb-0">
                        💡 Rules are applied in order of specificity. More specific rules override general ones.
                      </p>
                    </div>
                  </TabsContent>

                  {/* Pricing Tiers Tab */}
                  <TabsContent value="tiers" className="p-6 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <Label>Quantity-Based Pricing Tiers</Label>
                      <Button variant="outline" size="sm" onClick={addTier} className="h-7 gap-1">
                        <Plus className="w-3 h-3" />
                        Add Tier
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {tiers.map((tier, index) => (
                        <div
                          key={index}
                          className="p-4 border border-border rounded-lg space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">Tier {index + 1}</Badge>
                            {tiers.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeTier(index)}
                                className="h-7 w-7 p-0 text-red-600"
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label className="text-xs">Min Quantity</Label>
                              <Input
                                type="number"
                                value={tier.minQty}
                                onChange={(e) =>
                                  updateTier(index, "minQty", parseInt(e.target.value) || 0)
                                }
                                className="h-9"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Max Quantity</Label>
                              <Input
                                type="number"
                                placeholder="No limit"
                                value={tier.maxQty || ""}
                                onChange={(e) =>
                                  updateTier(
                                    index,
                                    "maxQty",
                                    e.target.value ? parseInt(e.target.value) : null
                                  )
                                }
                                className="h-9"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label className="text-xs">Unit Price ($)</Label>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={tier.price}
                                onChange={(e) =>
                                  updateTier(index, "price", parseFloat(e.target.value) || 0)
                                }
                                className="h-9"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Discount (%)</Label>
                              <Input
                                type="number"
                                step="0.1"
                                placeholder="0"
                                value={tier.discount}
                                onChange={(e) =>
                                  updateTier(index, "discount", parseFloat(e.target.value) || 0)
                                }
                                className="h-9"
                              />
                            </div>
                          </div>

                          {formData.basePrice && tier.discount > 0 && (
                            <div className="p-2 rounded bg-muted/50 text-xs">
                              <span className="text-muted-foreground">Final Price: </span>
                              <span className="font-medium">
                                ${(parseFloat(formData.basePrice) * (1 - tier.discount / 100)).toFixed(2)}
                              </span>
                              <span className="text-green-600 dark:text-green-400 ml-2">
                                Save ${(parseFloat(formData.basePrice) * (tier.discount / 100)).toFixed(2)}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                      <p className="text-sm text-amber-900 dark:text-amber-100 mb-0">
                        💡 Example: Buy 1-10 items at full price, 11-50 items get 5% off, 51+ items get 10% off
                      </p>
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
