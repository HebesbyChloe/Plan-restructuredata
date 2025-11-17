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
  AlertCircle,
  Building,
} from "lucide-react";
import { toast } from "sonner";

interface CreateOutboundShipmentPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (shipmentData: any) => void;
}

export function CreateOutboundShipmentPanel({
  isOpen,
  onClose,
  onSave,
}: CreateOutboundShipmentPanelProps) {
  const [formData, setFormData] = useState({
    orderId: "",
    customerName: "",
    storage: "",
    carrier: "",
    tracking: "",
    estimatedDate: "",
    shippingAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    note: "",
  });

  const handleSubmit = () => {
    // Validation
    if (
      !formData.orderId ||
      !formData.customerName ||
      !formData.storage ||
      !formData.carrier ||
      !formData.tracking
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const shipmentData = {
      ...formData,
      code: `VNIU${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      idCodeShip: "📦",
      status: "Processing",
      dateCreated: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      updateTime: "-",
      shipDate: "-",
      deliveryDate: "-",
      updatedBy: "System",
    };

    onSave(shipmentData);
    toast.success("Outbound shipment created successfully!");
    onClose();

    // Reset form
    setFormData({
      orderId: "",
      customerName: "",
      storage: "",
      carrier: "",
      tracking: "",
      estimatedDate: "",
      shippingAddress: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      note: "",
    });
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
                  <h2 className="mb-0">Create Outbound Shipment</h2>
                  <p className="text-sm text-muted-foreground mb-0">
                    Create a new outgoing delivery
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
              {/* Order Information */}
              <Card className="p-5 bg-card/50 backdrop-blur-sm border-border/50">
                <h3 className="mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#DAB785]" />
                  Order Information
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="orderId" className="flex items-center gap-1">
                        Order ID <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="orderId"
                        placeholder="e.g., ORD-2025-001"
                        value={formData.orderId}
                        onChange={(e) =>
                          setFormData({ ...formData, orderId: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="customerName"
                        className="flex items-center gap-1"
                      >
                        Customer Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="customerName"
                        placeholder="Enter customer name"
                        value={formData.customerName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            customerName: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Shipment Details */}
              <Card className="p-5 bg-card/50 backdrop-blur-sm border-border/50">
                <h3 className="mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#DAB785]" />
                  Shipment Details
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="storage" className="flex items-center gap-1">
                        Storage/Warehouse <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.storage}
                        onValueChange={(value) =>
                          setFormData({ ...formData, storage: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select storage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Main Warehouse">
                            Main Warehouse
                          </SelectItem>
                          <SelectItem value="Processing Center">
                            Processing Center
                          </SelectItem>
                          <SelectItem value="Warehouse A">Warehouse A</SelectItem>
                          <SelectItem value="Warehouse B">Warehouse B</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="carrier" className="flex items-center gap-1">
                        Carrier <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.carrier}
                        onValueChange={(value) =>
                          setFormData({ ...formData, carrier: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select carrier" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UPS">UPS</SelectItem>
                          <SelectItem value="FedEx">FedEx</SelectItem>
                          <SelectItem value="DHL">DHL</SelectItem>
                          <SelectItem value="USPS">USPS</SelectItem>
                          <SelectItem value="Local Courier">
                            Local Courier
                          </SelectItem>
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
                      <Label htmlFor="estimatedDate">Estimated Delivery</Label>
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
                </div>
              </Card>

              {/* Shipping Address */}
              <Card className="p-5 bg-card/50 backdrop-blur-sm border-border/50">
                <h3 className="mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#DAB785]" />
                  Shipping Address
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="shippingAddress">Street Address</Label>
                    <Input
                      id="shippingAddress"
                      placeholder="Enter street address"
                      value={formData.shippingAddress}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shippingAddress: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="Enter city"
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province</Label>
                      <Input
                        id="state"
                        placeholder="Enter state"
                        value={formData.state}
                        onChange={(e) =>
                          setFormData({ ...formData, state: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                      <Input
                        id="zipCode"
                        placeholder="Enter ZIP code"
                        value={formData.zipCode}
                        onChange={(e) =>
                          setFormData({ ...formData, zipCode: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        placeholder="Enter country"
                        value={formData.country}
                        onChange={(e) =>
                          setFormData({ ...formData, country: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Additional Notes */}
              <Card className="p-5 bg-card/50 backdrop-blur-sm border-border/50">
                <h3 className="mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#DAB785]" />
                  Additional Information
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="note">Notes (Optional)</Label>
                  <Textarea
                    id="note"
                    placeholder="Add any special instructions or notes..."
                    rows={4}
                    value={formData.note}
                    onChange={(e) =>
                      setFormData({ ...formData, note: e.target.value })
                    }
                  />
                </div>
              </Card>

              {/* Info Banner */}
              <Card className="p-4 bg-gradient-to-br from-ai-blue/5 to-ai-blue/10 border-ai-blue/20">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-ai-blue flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm mb-0">
                      The shipment will be created with "Processing" status. You can
                      update the status later as it progresses through fulfillment.
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
