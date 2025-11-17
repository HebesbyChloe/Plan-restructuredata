import React, { useState } from "react";
import { Card } from "../../../ui/card";
import { Checkbox } from "../../../ui/checkbox";
import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";
import { ScrollArea } from "../../../ui/scroll-area";
import {
  Search,
  Filter,
  Download,
  Printer,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "../../../ui/dropdown-menu";
import type { ShippingTableModuleProps, ShipmentData } from "./types";
import { STATUS_CONFIG } from "./utils/constants";
import { filterShipments, getTrackingUrl, getShipmentsByOrder } from "./utils/helpers";
import { getAISuggestions } from "./utils/aiSuggestions";
import {
  OrderInfoSection,
  ShippingInfoSection,
  CarrierTrackingSection,
  LineItemsSection,
  OrderTagsSection,
  OrderAlertsSection,
  OrderActionsSection,
  ProductGallerySection,
} from "./components";
import { toast } from "sonner";

export function ShippingTableModule({
  shipments,
  onShipmentClick,
  onStatusChange,
  onBulkPrintLabels,
  selectedShipments = [],
  onSelectionChange,
  onImageClick,
}: ShippingTableModuleProps) {
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ShipmentData["status"] | "all">("all");
  const [warehouseFilter, setWarehouseFilter] = useState<"all" | "US" | "VN">("all");
  const [carrierFilter, setCarrierFilter] = useState<ShipmentData["carrier"] | "all">("all");
  const [expandedLineItems, setExpandedLineItems] = useState<Set<string>>(new Set());
  const [copiedTracking, setCopiedTracking] = useState<string | null>(null);
  const [showAISuggestions, setShowAISuggestions] = useState<Set<string>>(new Set());

  // Filter shipments
  const filteredShipments = filterShipments(
    shipments,
    searchQuery,
    statusFilter,
    warehouseFilter,
    carrierFilter
  );

  // Selection handlers
  const isAllSelected =
    onSelectionChange &&
    filteredShipments.length > 0 &&
    filteredShipments.every((s) => selectedShipments.includes(s.id));

  const handleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return;
    if (checked) {
      onSelectionChange(filteredShipments.map((s) => s.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectShipment = (id: string, checked: boolean) => {
    if (!onSelectionChange) return;
    if (checked) {
      onSelectionChange([...selectedShipments, id]);
    } else {
      onSelectionChange(selectedShipments.filter((sId) => sId !== id));
    }
  };

  // Bulk actions
  const handleBulkStatusUpdate = (status: ShipmentData["status"]) => {
    if (selectedShipments.length === 0) {
      toast.error("Please select shipments first");
      return;
    }
    selectedShipments.forEach((id) => {
      if (onStatusChange) onStatusChange(id, status);
    });
    toast.success(`Updated ${selectedShipments.length} shipment(s) to ${status}`);
  };

  const handleBulkPrint = () => {
    if (selectedShipments.length === 0) {
      toast.error("Please select shipments first");
      return;
    }
    if (onBulkPrintLabels) {
      onBulkPrintLabels(selectedShipments);
    }
  };

  // Tracking handlers
  const handleCopyTracking = (e: React.MouseEvent, shipment: ShipmentData) => {
    e.stopPropagation();
    const url = getTrackingUrl(shipment);
    if (url) {
      navigator.clipboard.writeText(url);
      setCopiedTracking(shipment.id);
      toast.success("Tracking link copied!");
      setTimeout(() => setCopiedTracking(null), 2000);
    }
  };

  const handleOpenTracking = (e: React.MouseEvent, shipment: ShipmentData) => {
    e.stopPropagation();
    const url = getTrackingUrl(shipment);
    if (url) {
      window.open(url, '_blank');
    }
  };

  // Toggle handlers
  const toggleAISuggestions = (e: React.MouseEvent, shipmentId: string) => {
    e.stopPropagation();
    const newSet = new Set(showAISuggestions);
    if (newSet.has(shipmentId)) {
      newSet.delete(shipmentId);
    } else {
      newSet.add(shipmentId);
    }
    setShowAISuggestions(newSet);
  };

  const toggleLineItems = (e: React.MouseEvent, shipmentId: string) => {
    e.stopPropagation();
    const newSet = new Set(expandedLineItems);
    if (newSet.has(shipmentId)) {
      newSet.delete(shipmentId);
    } else {
      newSet.add(shipmentId);
    }
    setExpandedLineItems(newSet);
  };

  const handleExport = () => {
    toast.success("Exporting shipments...");
  };

  // Get unique values for filters
  const uniqueCarriers = Array.from(new Set(shipments.map((s) => s.carrier)));

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <Card className="glass-card p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by order, customer, or tracking..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            {/* Status Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Status
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuCheckboxItem
                  checked={statusFilter === "all"}
                  onCheckedChange={() => setStatusFilter("all")}
                >
                  All Status
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                {Object.keys(STATUS_CONFIG).map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={statusFilter === status}
                    onCheckedChange={() => setStatusFilter(status as ShipmentData["status"])}
                  >
                    {STATUS_CONFIG[status as ShipmentData["status"]].label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Warehouse Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Warehouse
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuCheckboxItem
                  checked={warehouseFilter === "all"}
                  onCheckedChange={() => setWarehouseFilter("all")}
                >
                  All Warehouses
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={warehouseFilter === "US"}
                  onCheckedChange={() => setWarehouseFilter("US")}
                >
                  🇺🇸 US
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={warehouseFilter === "VN"}
                  onCheckedChange={() => setWarehouseFilter("VN")}
                >
                  🇻🇳 VN
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Carrier Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Carrier
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuCheckboxItem
                  checked={carrierFilter === "all"}
                  onCheckedChange={() => setCarrierFilter("all")}
                >
                  All Carriers
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                {uniqueCarriers.map((carrier) => (
                  <DropdownMenuCheckboxItem
                    key={carrier}
                    checked={carrierFilter === carrier}
                    onCheckedChange={() => setCarrierFilter(carrier as ShipmentData["carrier"])}
                  >
                    {carrier}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {selectedShipments.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Bulk Actions ({selectedShipments.length})
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleBulkStatusUpdate("pending")}>
                    Mark as Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkStatusUpdate("in_transit")}>
                    Mark as In Transit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkStatusUpdate("delivered")}>
                    Mark as Delivered
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleBulkPrint}>
                    <Printer className="w-4 h-4 mr-2" />
                    Print Labels
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </Card>

      {/* Shipments Table */}
      <div className="space-y-0">
        {filteredShipments.length === 0 ? (
          <Card className="glass-card p-12 text-center text-muted-foreground">
            No shipments found
          </Card>
        ) : (
          <>
            {/* Table Header */}
            <div className="glass-card rounded-b-none border border-border bg-card/50">
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-6">
                  {/* Checkbox Column */}
                  {onSelectionChange && (
                    <div className="w-10 flex-shrink-0">
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={handleSelectAll}
                      />
                    </div>
                  )}

                  {/* Order Details Header - 1/4 width */}
                  <div className="w-1/4 flex-shrink-0">
                    <p className="tracking-wider">Order Details</p>
                  </div>

                  {/* Products Images Header - 3/4 width */}
                  <div className="flex-1 border-l border-border pl-6">
                    <p className="tracking-wider">Products Images</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipment Rows */}
            {filteredShipments.map((shipment, index) => {
              const isLastItem = index === filteredShipments.length - 1;
              const sameOrderShipments = getShipmentsByOrder(shipments, shipment.orderNumber);
              const aiSuggestions = getAISuggestions(
                shipment,
                shipments,
                (msg) => toast.info(msg)
              );

              return (
                <div
                  key={shipment.id}
                  className={`glass-card border border-border bg-card/50 hover:shadow-md transition-all ${
                    isLastItem ? 'rounded-t-none' : 'rounded-none border-t-0'
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-start gap-6">
                      {/* Checkbox */}
                      {onSelectionChange && (
                        <div className="w-10 flex-shrink-0 pt-0.5">
                          <Checkbox
                            checked={selectedShipments.includes(shipment.id)}
                            onCheckedChange={(checked) =>
                              handleSelectShipment(shipment.id, checked as boolean)
                            }
                          />
                        </div>
                      )}

                      {/* Column 1: Order Details - 1/4 width */}
                      <div className="w-1/4 flex-shrink-0 space-y-3 p-4 bg-muted/30 rounded-lg border border-border/50">
                        {/* Order Info */}
                        <OrderInfoSection
                          shipment={shipment}
                          showAISuggestions={showAISuggestions.has(shipment.id)}
                          aiSuggestions={aiSuggestions}
                          onOrderClick={onShipmentClick}
                          onToggleAISuggestions={(e) => toggleAISuggestions(e, shipment.id)}
                        />

                        <div className="border-t border-border" />

                        {/* Customer & Shipping Info */}
                        <ShippingInfoSection shipment={shipment} />

                        {/* Carrier & Tracking */}
                        <CarrierTrackingSection
                          shipment={shipment}
                          sameOrderShipments={sameOrderShipments}
                          copiedTracking={copiedTracking}
                          onOpenTracking={handleOpenTracking}
                          onCopyTracking={handleCopyTracking}
                        />

                        {/* Line Items */}
                        {expandedLineItems.has(shipment.id) && (
                          <LineItemsSection
                            shipment={shipment}
                            onImageClick={onImageClick}
                          />
                        )}

                        {/* Tags */}
                        <OrderTagsSection
                          shipment={shipment}
                          itemsExpanded={expandedLineItems.has(shipment.id)}
                          onToggleItems={(e) => toggleLineItems(e, shipment.id)}
                        />

                        {/* Alerts */}
                        <OrderAlertsSection shipment={shipment} />

                        {/* Actions */}
                        <OrderActionsSection
                          shipment={shipment}
                          onBulkPrintLabels={onBulkPrintLabels}
                        />
                      </div>

                      {/* Column 2: Products Images - 3/4 width */}
                      <div className="flex-1 border-l border-border pl-6">
                        <ProductGallerySection
                          shipment={shipment}
                          onImageClick={onImageClick}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
