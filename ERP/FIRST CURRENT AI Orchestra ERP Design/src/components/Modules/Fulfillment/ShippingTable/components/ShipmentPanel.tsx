import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../../../../ui/sheet";
import { Button } from "../../../../ui/button";
import { Input } from "../../../../ui/input";
import { Label } from "../../../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../ui/select";
import { Checkbox } from "../../../../ui/checkbox";
import { Textarea } from "../../../../ui/textarea";
import { Badge } from "../../../../ui/badge";
import { Separator } from "../../../../ui/separator";
import { ScrollArea } from "../../../../ui/scroll-area";
import {
  Package,
  Truck,
  Scale,
  Ruler,
  Shield,
  PenTool,
  Layers,
  Ship,
  Split,
  Combine,
  Save,
  AlertCircle,
  MapPin,
  User,
  Phone,
  Mail,
  Tag,
  Calendar,
  DollarSign,
  X,
  Sparkles,
} from "lucide-react";
import { OrderData } from "../../../../../types/modules/crm";
import { toast } from "sonner";

interface ShipmentPanelProps {
  order: OrderData | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToBatch?: (orderId: string, batchId: string) => void;
  onShip?: (orderId: string, trackingNumber: string) => void;
  onSplit?: (orderId: string) => void;
  onCombine?: (orderIds: string[]) => void;
}

const CARRIER_OPTIONS = [
  { value: "usps", label: "USPS", services: ["First Class", "Priority", "Priority Express", "Ground"] },
  { value: "ups", label: "UPS", services: ["Ground", "2nd Day Air", "Next Day Air", "3 Day Select"] },
  { value: "fedex", label: "FedEx", services: ["Ground", "2Day", "Express Saver", "Standard Overnight"] },
  { value: "dhl", label: "DHL", services: ["Express", "Ground", "International"] },
];

const PRESET_OPTIONS = [
  { value: "small_box", label: "Small Box (6×4×2)", weight: "1", dimensions: { length: "6", width: "4", height: "2" } },
  { value: "medium_box", label: "Medium Box (12×8×6)", weight: "3", dimensions: { length: "12", width: "8", height: "6" } },
  { value: "large_box", label: "Large Box (18×12×10)", weight: "8", dimensions: { length: "18", width: "12", height: "10" } },
  { value: "envelope", label: "Envelope (9×6×0.5)", weight: "0.5", dimensions: { length: "9", width: "6", height: "0.5" } },
];

export function ShipmentPanel({ order, isOpen, onClose, onAddToBatch, onShip, onSplit, onCombine }: ShipmentPanelProps) {
  const [selectedCarrier, setSelectedCarrier] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [requireInsurance, setRequireInsurance] = useState(false);
  const [insuranceAmount, setInsuranceAmount] = useState("");
  const [requireSignature, setRequireSignature] = useState(false);
  const [weight, setWeight] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [notes, setNotes] = useState("");

  if (!order) return null;

  const selectedCarrierData = CARRIER_OPTIONS.find(c => c.value === selectedCarrier);

  const handleApplyPreset = (presetValue: string) => {
    const preset = PRESET_OPTIONS.find(p => p.value === presetValue);
    if (preset) {
      setWeight(preset.weight);
      setLength(preset.dimensions.length);
      setWidth(preset.dimensions.width);
      setHeight(preset.dimensions.height);
      toast.success(`Applied preset: ${preset.label}`);
    }
  };

  const handleAddToBatch = () => {
    if (!selectedBatch) {
      toast.error("Please select a batch");
      return;
    }
    onAddToBatch?.(order.id, selectedBatch);
    toast.success(`Order #${order.orderNumber} added to batch ${selectedBatch}`);
  };

  const handleShip = () => {
    if (!selectedCarrier || !selectedService) {
      toast.error("Please select carrier and service");
      return;
    }
    if (!weight || !length || !width || !height) {
      toast.error("Please enter package dimensions and weight");
      return;
    }
    
    const generatedTracking = trackingNumber || `${selectedCarrier.toUpperCase()}${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
    setTrackingNumber(generatedTracking);
    
    onShip?.(order.id, generatedTracking);
    toast.success(`Shipping label created for order #${order.orderNumber}`, {
      description: `Tracking: ${generatedTracking}`,
    });
  };

  const handleSplit = () => {
    onSplit?.(order.id);
    toast.success(`Order #${order.orderNumber} split initiated`, {
      description: "You can now assign items to different shipments",
    });
  };

  const handleCombine = () => {
    toast.info("Select additional orders to combine", {
      description: "Use the checkboxes in the main table to select orders to combine",
    });
    onCombine?.([order.id]);
  };

  const handleSave = () => {
    toast.success("Shipment details saved", {
      description: `Order #${order.orderNumber} updated successfully`,
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-3xl p-0 flex flex-col gap-0 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 border-l border-border/50">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 border-b border-border/50 bg-card/30 backdrop-blur-sm">
          <div className="p-6 pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4B6BFB]/20 to-[#4B6BFB]/5 flex items-center justify-center border border-[#4B6BFB]/20">
                    <Package className="w-5 h-5 text-[#4B6BFB]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="truncate">Order #{order.orderNumber}</h2>
                    <p className="text-sm text-muted-foreground">Shipment Details</p>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="flex-shrink-0 h-8 w-8 rounded-lg hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Quick Info Pills */}
            <div className="flex flex-wrap gap-2 mt-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50 text-xs">
                <User className="w-3 h-3 text-muted-foreground" />
                <span className="truncate max-w-[150px]">{order.customer}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50 text-xs">
                <DollarSign className="w-3 h-3 text-muted-foreground" />
                <span>{order.total}</span>
              </div>
              <Badge variant="outline" className="text-xs">{order.status}</Badge>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {/* Shipping Address Card */}
            <div className="glass-card p-4 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-[#4B6BFB]" />
                <h3 className="text-sm">Shipping Address</h3>
              </div>
              <div className="pl-6 space-y-1 text-sm">
                <p>{order.shippingAddress?.street}</p>
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}</p>
                <p className="text-muted-foreground">{order.shippingAddress?.country}</p>
                {order.phone && (
                  <p className="flex items-center gap-2 text-muted-foreground pt-2">
                    <Phone className="w-3 h-3" />
                    {order.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Tags & Alerts */}
            {(order.tags && order.tags.length > 0) && (
              <div className="glass-card p-4 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <Tag className="w-4 h-4 text-[#4B6BFB]" />
                  <h3 className="text-sm">Tags</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {order.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Alerts Section */}
            {order.alerts && (
              <div className="glass-card p-4 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm">Alerts</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {order.alerts.imageMissing && (
                    <Badge variant="destructive" className="text-xs flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Image Missing
                    </Badge>
                  )}
                  {order.alerts.customerNote && (
                    <Badge variant="destructive" className="text-xs flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Customer Note
                    </Badge>
                  )}
                  {order.alerts.addressMissing && (
                    <Badge variant="destructive" className="text-xs flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Address Missing
                    </Badge>
                  )}
                  {order.alerts.linkedOrders && (
                    <Badge variant="outline" className="text-xs flex items-center gap-1 border-[#4B6BFB]/30 text-[#4B6BFB]">
                      <AlertCircle className="w-3 h-3" />
                      Linked Orders
                    </Badge>
                  )}
                  {order.alerts.late && (
                    <Badge variant="destructive" className="text-xs flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {order.alerts.late} Days Late
                    </Badge>
                  )}
                  {order.alerts.serviceRequest && (
                    <Badge variant="outline" className="text-xs flex items-center gap-1 border-amber-500/30 text-amber-600">
                      <AlertCircle className="w-3 h-3" />
                      Service Request
                    </Badge>
                  )}
                  {order.alerts.refundRequest && (
                    <Badge variant="outline" className="text-xs flex items-center gap-1 border-amber-500/30 text-amber-600">
                      <AlertCircle className="w-3 h-3" />
                      Refund Request
                    </Badge>
                  )}
                </div>
              </div>
            )}

            <Separator className="my-6" />

            {/* Package Preset */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#4B6BFB]" />
                Package Preset
              </Label>
              <Select onValueChange={handleApplyPreset}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select a preset to auto-fill dimensions..." />
                </SelectTrigger>
                <SelectContent>
                  {PRESET_OPTIONS.map((preset) => (
                    <SelectItem key={preset.value} value={preset.value}>
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        {preset.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Shipping Details */}
            <div className="glass-card p-5 space-y-5">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#4B6BFB]" />
                <h3 className="text-sm">Shipping Details</h3>
              </div>

              {/* Carrier Selection */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Carrier *</Label>
                <Select value={selectedCarrier} onValueChange={setSelectedCarrier}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select carrier..." />
                  </SelectTrigger>
                  <SelectContent>
                    {CARRIER_OPTIONS.map((carrier) => (
                      <SelectItem key={carrier.value} value={carrier.value}>
                        {carrier.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Service Selection */}
              {selectedCarrier && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Service Type *</Label>
                  <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select service..." />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedCarrierData?.services.map((service) => (
                        <SelectItem key={service} value={service.toLowerCase().replace(/\s+/g, '_')}>
                          {service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Separator />

              {/* Weight & Dimensions Grid */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Scale className="w-3.5 h-3.5" />
                    Weight (lbs) *
                  </Label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Ruler className="w-3.5 h-3.5" />
                    Dimensions (inches) *
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    <Input
                      type="number"
                      placeholder="L"
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      className="h-11"
                    />
                    <Input
                      type="number"
                      placeholder="W"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      className="h-11"
                    />
                    <Input
                      type="number"
                      placeholder="H"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="h-11"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Insurance */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="insurance" className="flex items-center gap-2 cursor-pointer text-sm">
                    <Shield className="w-4 h-4 text-[#4B6BFB]" />
                    Require Insurance
                  </Label>
                  <Checkbox
                    id="insurance"
                    checked={requireInsurance}
                    onCheckedChange={(checked) => setRequireInsurance(checked as boolean)}
                  />
                </div>
                {requireInsurance && (
                  <div className="pl-6 space-y-2 animate-in slide-in-from-top-2 duration-200">
                    <Label className="text-xs text-muted-foreground">Insurance Amount ($)</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={insuranceAmount}
                      onChange={(e) => setInsuranceAmount(e.target.value)}
                      className="h-11"
                    />
                  </div>
                )}
              </div>

              {/* Signature */}
              <div className="flex items-center justify-between">
                <Label htmlFor="signature" className="flex items-center gap-2 cursor-pointer text-sm">
                  <PenTool className="w-4 h-4 text-[#4B6BFB]" />
                  Require Signature
                </Label>
                <Checkbox
                  id="signature"
                  checked={requireSignature}
                  onCheckedChange={(checked) => setRequireSignature(checked as boolean)}
                />
              </div>

              <Separator />

              {/* Tracking Number */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Tracking Number (Optional)</Label>
                <Input
                  placeholder="Auto-generated if left blank"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="h-11"
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Shipping Notes</Label>
                <Textarea
                  placeholder="Add any special shipping instructions..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-card p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#4B6BFB]" />
                <h3 className="text-sm">Quick Actions</h3>
              </div>

              {/* Add to Batch */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Add to Batch</Label>
                <div className="flex gap-2">
                  <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                    <SelectTrigger className="h-10 flex-1">
                      <SelectValue placeholder="Select batch..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="batch-001">Batch #001 - Priority Orders</SelectItem>
                      <SelectItem value="batch-002">Batch #002 - International</SelectItem>
                      <SelectItem value="batch-003">Batch #003 - Local Delivery</SelectItem>
                      <SelectItem value="new">+ Create New Batch</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAddToBatch} variant="outline" size="icon" className="h-10 w-10 flex-shrink-0">
                    <Layers className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button onClick={handleSplit} variant="outline" className="h-10">
                  <Split className="w-4 h-4 mr-2" />
                  Split Order
                </Button>
                <Button onClick={handleCombine} variant="outline" className="h-10">
                  <Combine className="w-4 h-4 mr-2" />
                  Combine
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer - Fixed */}
        <div className="flex-shrink-0 border-t border-border/50 bg-card/30 backdrop-blur-sm p-4">
          <div className="flex gap-3">
            <Button onClick={handleSave} variant="outline" className="flex-1 h-11">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            <Button 
              onClick={handleShip} 
              className="flex-1 h-11 bg-gradient-to-r from-[#4B6BFB] to-[#4B6BFB]/80 hover:from-[#4B6BFB]/90 hover:to-[#4B6BFB]/70"
            >
              <Ship className="w-4 h-4 mr-2" />
              Create Label
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
