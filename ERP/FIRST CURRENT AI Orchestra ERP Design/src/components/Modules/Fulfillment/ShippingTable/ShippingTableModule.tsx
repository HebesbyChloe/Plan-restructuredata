import React, { useState, useRef, useEffect } from "react";
import { Card } from "../../../ui/card";
import { Checkbox } from "../../../ui/checkbox";
import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";
import {
  Search,
  Filter,
  Download,
  Printer,
  ChevronDown,
  CheckCircle2,
  LayoutGrid,
  TableIcon,
  Layers,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "../../../ui/dropdown-menu";
import { filterOrders, getTrackingUrl, getOrdersByOrderNumber } from "./utils/helpers";
import { ShipmentEnhanced } from "../../../../sampledata/shipmentsEnhanced";
import { OrderData } from "../../../../types/modules/crm";

// Types
type ShipmentData = ShipmentEnhanced;

interface ShippingTableModuleProps {
  orders: OrderData[];
  onOrderClick: (order: OrderData) => void;
  onStatusChange?: (orderId: string, newStatus: OrderData["orderStatus"]) => void;
  onBulkPrintLabels?: (orderIds: string[]) => void;
  selectedOrders?: string[];
  onSelectionChange?: (orderIds: string[]) => void;
  showImages?: boolean;
  expandedLineItems?: string[];
  onToggleLineItems?: (orderId: string) => void;
  onImageClick?: (imageUrl: string) => void;
}
import { getAISuggestions } from "./utils/aiSuggestions";
import {
  OrderInfoSection,
  ShippingInfoSection,
  CarrierTrackingSection,
  LineItemsSection,
  OrderTagsSection,
  OrderActionsSection,
  ProductGallerySection,
  ShipmentPanel,
} from "./components";
import { ShippingTableView } from "./ShippingTableView";
import { toast } from "sonner";
import { OrderDetailPanel } from "../../CRM/Panels/OrderDetailPanel";
import { CustomerDetailPanel } from "../../CRM/Panels/CustomerDetailPanel";

export function ShippingTableModule({
  orders,
  onOrderClick,
  onStatusChange,
  onBulkPrintLabels,
  selectedOrders = [],
  onSelectionChange,
  onImageClick,
}: ShippingTableModuleProps) {
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | "all">("all");
  const [batchFilter, setBatchFilter] = useState<string | "all">("all");
  const [tagsFilter, setTagsFilter] = useState<string[]>([]);
  const [expandedLineItems, setExpandedLineItems] = useState<Set<string>>(new Set());
  const [copiedTracking, setCopiedTracking] = useState<string | null>(null);
  const [showAISuggestions, setShowAISuggestions] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedShipmentOrder, setSelectedShipmentOrder] = useState<OrderData | null>(null);
  const [isShipmentPanelOpen, setIsShipmentPanelOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [isOrderPanelOpen, setIsOrderPanelOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<{
    id: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    tier?: string;
    totalOrders?: number;
    totalSpent?: number;
    lastOrderDate?: string;
  } | null>(null);
  const [isCustomerPanelOpen, setIsCustomerPanelOpen] = useState(false);

  // Filter orders
  const filteredOrders = filterOrders(
    orders,
    searchQuery,
    statusFilter,
    batchFilter,
    tagsFilter
  );

  // Selection handlers with keyboard support
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);
  const [lastClickTime, setLastClickTime] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleRowClick = (orderId: string, index: number, event: React.MouseEvent) => {
    if (!onSelectionChange) return;

    const now = Date.now();
    const timeSinceLastClick = now - lastClickTime;
    
    // Double-click detection (within 300ms)
    if (timeSinceLastClick < 300 && selectedOrders.includes(orderId)) {
      onSelectionChange([]);
      setLastClickTime(0);
      return;
    }
    
    setLastClickTime(now);

    const isCtrlOrCmd = event.ctrlKey || event.metaKey;
    const isShift = event.shiftKey;

    if (isShift && lastSelectedIndex !== null) {
      // Shift-click: select range
      const start = Math.min(lastSelectedIndex, index);
      const end = Math.max(lastSelectedIndex, index);
      const rangeIds = filteredOrders.slice(start, end + 1).map((o) => o.id);
      
      // Merge with existing selection
      const newSelection = Array.from(new Set([...selectedOrders, ...rangeIds]));
      onSelectionChange(newSelection);
    } else if (isCtrlOrCmd) {
      // Ctrl-click: toggle individual
      if (selectedOrders.includes(orderId)) {
        onSelectionChange(selectedOrders.filter((id) => id !== orderId));
      } else {
        onSelectionChange([...selectedOrders, orderId]);
      }
      setLastSelectedIndex(index);
    } else {
      // Regular click: select only this one
      onSelectionChange([orderId]);
      setLastSelectedIndex(index);
    }
  };

  // Click outside to clear selection
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (selectedOrders.length > 0 && onSelectionChange) {
          onSelectionChange([]);
        }
      }
    };

    if (typeof document !== 'undefined') {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [selectedOrders, onSelectionChange]);

  // Bulk actions
  const handleBulkStatusUpdate = (status: OrderData["orderStatus"]) => {
    if (selectedOrders.length === 0) {
      toast.error("Please select orders first");
      return;
    }
    selectedOrders.forEach((id) => {
      if (onStatusChange) onStatusChange(id, status);
    });
    toast.success(`Updated ${selectedOrders.length} order(s) to ${status}`);
  };

  const handleBulkPrint = () => {
    if (selectedOrders.length === 0) {
      toast.error("Please select orders first");
      return;
    }
    if (onBulkPrintLabels) {
      onBulkPrintLabels(selectedOrders);
    }
  };

  // Tracking handlers
  const handleCopyTracking = (e: React.MouseEvent, order: OrderData) => {
    e.stopPropagation();
    const tracking = order.tracking && order.tracking.length > 0 ? order.tracking[0] : null;
    if (tracking?.trackingNumber) {
      const url = getTrackingUrl(tracking.carrier, tracking.trackingNumber);
      if (url) {
        navigator.clipboard.writeText(url);
        setCopiedTracking(order.id);
        toast.success("Tracking link copied!");
        setTimeout(() => setCopiedTracking(null), 2000);
      }
    }
  };

  const handleOpenTracking = (e: React.MouseEvent, order: OrderData) => {
    e.stopPropagation();
    const tracking = order.tracking && order.tracking.length > 0 ? order.tracking[0] : null;
    if (tracking?.trackingNumber) {
      const url = getTrackingUrl(tracking.carrier, tracking.trackingNumber);
      if (url) {
        if (typeof window !== 'undefined') {
          window.open(url, '_blank');
        }
      }
    }
  };

  // Toggle handlers
  const toggleAISuggestions = (e: React.MouseEvent, orderId: string) => {
    e.stopPropagation();
    const newSet = new Set(showAISuggestions);
    if (newSet.has(orderId)) {
      newSet.delete(orderId);
    } else {
      newSet.add(orderId);
    }
    setShowAISuggestions(newSet);
  };

  const toggleLineItems = (e: React.MouseEvent, orderId: string) => {
    e.stopPropagation();
    const newSet = new Set(expandedLineItems);
    if (newSet.has(orderId)) {
      newSet.delete(orderId);
    } else {
      newSet.add(orderId);
    }
    setExpandedLineItems(newSet);
  };

  const handleExport = () => {
    toast.success("Exporting orders...");
  };

  // Shipment Panel Handlers
  const handleOpenShipmentPanel = (e: React.MouseEvent, order: OrderData) => {
    e.stopPropagation();
    setSelectedShipmentOrder(order);
    setIsShipmentPanelOpen(true);
  };

  const handleCloseShipmentPanel = () => {
    setIsShipmentPanelOpen(false);
    setTimeout(() => setSelectedShipmentOrder(null), 300);
  };

  const handleAddToBatch = (orderId: string, batchId: string) => {
    // Implementation for adding order to batch
    console.log(`Adding order ${orderId} to batch ${batchId}`);
  };

  const handleShip = (orderId: string, trackingNumber: string) => {
    // Implementation for shipping order
    console.log(`Shipping order ${orderId} with tracking ${trackingNumber}`);
  };

  const handleSplit = (orderId: string) => {
    // Implementation for splitting order
    console.log(`Splitting order ${orderId}`);
  };

  const handleCombine = (orderIds: string[]) => {
    // Implementation for combining orders
    console.log(`Combining orders:`, orderIds);
  };

  // Order Detail Panel Handlers
  const handleOpenOrderPanel = (e: React.MouseEvent, order: OrderData) => {
    e.stopPropagation();
    setSelectedOrder(order);
    setIsOrderPanelOpen(true);
  };

  const handleCloseOrderPanel = () => {
    setIsOrderPanelOpen(false);
    setTimeout(() => setSelectedOrder(null), 300);
  };

  // Customer Detail Panel Handlers
  const handleOpenCustomerPanel = (e: React.MouseEvent, customerName: string) => {
    e.stopPropagation();
    
    // Find all orders for this customer to build customer profile
    const customerOrders = orders.filter(o => o.customerName === customerName);
    const totalOrders = customerOrders.length;
    const totalSpent = customerOrders.reduce((sum, o) => sum + (o.amount || 0), 0);
    const sortedOrders = [...customerOrders].sort((a, b) => 
      new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
    );
    const lastOrderDate = sortedOrders[0]?.createdDate;
    
    // Get the first order to extract additional data
    const firstOrder = customerOrders[0];
    
    // Build customer object
    const customer = {
      id: `customer-${customerName.toLowerCase().replace(/\s+/g, '-')}`,
      name: customerName,
      tier: firstOrder?.customerRank,
      totalOrders,
      totalSpent,
      lastOrderDate,
      address: firstOrder?.shippingAddress ? 
        `${firstOrder.shippingAddress.city}, ${firstOrder.shippingAddress.state}, ${firstOrder.shippingAddress.country}` : 
        undefined,
    };
    
    setSelectedCustomer(customer);
    setIsCustomerPanelOpen(true);
  };

  const handleCloseCustomerPanel = () => {
    setIsCustomerPanelOpen(false);
    setTimeout(() => setSelectedCustomer(null), 300);
  };

  // Get unique statuses, batches, and tags from orders
  const uniqueStatuses = Array.from(new Set(orders.map(o => o.orderStatus)));
  const uniqueBatches = Array.from(new Set(
    orders.filter(o => o.statusProcess?.group).map(o => o.statusProcess!.group)
  ));
  const uniqueTags = Array.from(new Set(
    orders.flatMap(o => o.tags || [])
  ));

  return (
    <div className="space-y-4">
      {/* Bulk Actions Bar */}
      {selectedOrders.length > 0 && (
        <Card className="glass-card p-4 bg-[#4B6BFB]/10 border-[#4B6BFB]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-sm">
                <span className="font-semibold text-[#4B6BFB]">{selectedOrders.length}</span>
                <span className="text-muted-foreground"> order{selectedOrders.length !== 1 ? 's' : ''} selected</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onSelectionChange?.([])}
                className="h-7 text-xs"
              >
                Clear Selection
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => toast.info("Batch management")}
              >
                <Layers className="w-4 h-4 mr-2" />
                Batch
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleBulkPrint}
              >
                <Printer className="w-4 h-4 mr-2" />
                Print Label
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => toast.info("Printing packing slips...")}
              >
                <Download className="w-4 h-4 mr-2" />
                Packing Slips
              </Button>
            </div>
          </div>
        </Card>
      )}

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
                  Status
                  {statusFilter !== "all" && <span className="ml-2 px-1.5 py-0.5 rounded-full bg-[#4B6BFB]/10 text-[#4B6BFB] text-xs">1</span>}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="max-h-[300px] overflow-y-auto">
                <DropdownMenuCheckboxItem
                  checked={statusFilter === "all"}
                  onCheckedChange={() => setStatusFilter("all")}
                >
                  All Status
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                {uniqueStatuses.map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={statusFilter === status}
                    onCheckedChange={() => setStatusFilter(status)}
                  >
                    {status}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Batch Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Batch
                  {batchFilter !== "all" && <span className="ml-2 px-1.5 py-0.5 rounded-full bg-[#4B6BFB]/10 text-[#4B6BFB] text-xs">1</span>}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuCheckboxItem
                  checked={batchFilter === "all"}
                  onCheckedChange={() => setBatchFilter("all")}
                >
                  All Batches
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                {uniqueBatches.map((batch) => (
                  <DropdownMenuCheckboxItem
                    key={batch}
                    checked={batchFilter === batch}
                    onCheckedChange={() => setBatchFilter(batch)}
                  >
                    {batch}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Tags Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Tags
                  {tagsFilter.length > 0 && <span className="ml-2 px-1.5 py-0.5 rounded-full bg-[#4B6BFB]/10 text-[#4B6BFB] text-xs">{tagsFilter.length}</span>}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="max-h-[300px] overflow-y-auto">
                <DropdownMenuCheckboxItem
                  checked={tagsFilter.length === 0}
                  onCheckedChange={() => setTagsFilter([])}
                >
                  All Tags
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                {uniqueTags.map((tag) => (
                  <DropdownMenuCheckboxItem
                    key={tag}
                    checked={tagsFilter.includes(tag)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setTagsFilter([...tagsFilter, tag]);
                      } else {
                        setTagsFilter(tagsFilter.filter(t => t !== tag));
                      }
                    }}
                  >
                    {tag.charAt(0).toUpperCase() + tag.slice(1).replace(/-/g, ' ')}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Advanced Filters Button */}
            <Button 
              variant={showAdvancedFilters ? "secondary" : "outline"} 
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Advanced
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {/* View Toggle */}
            <div className="flex border border-border rounded-md overflow-hidden">
              <Button
                variant={viewMode === "card" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("card")}
                className="rounded-none border-r border-border"
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "table" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="rounded-none"
              >
                <TableIcon className="w-4 h-4" />
              </Button>
            </div>

            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </Card>

      {/* Orders View */}
      <div className="space-y-0" ref={containerRef}>
        {filteredOrders.length === 0 ? (
          <Card className="glass-card p-12 text-center text-muted-foreground">
            No orders found
          </Card>
        ) : viewMode === "table" ? (
          <ShippingTableView
            shipments={filteredOrders as any}
            selectedShipments={selectedOrders}
            onSelectionChange={onSelectionChange || (() => {})}
            onShipmentClick={onOrderClick as any}
          />
        ) : (
          <>
            {/* Table Header */}
            <div className="glass-card rounded-b-none border border-border bg-card/50">
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-6">
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

            {/* Order Rows */}
            {filteredOrders.map((order, index) => {
              const isLastItem = index === filteredOrders.length - 1;
              const sameOrders = getOrdersByOrderNumber(orders, order.orderNumber);
              const aiSuggestions: any[] = []; // Placeholder for AI suggestions

              return (
                <div
                  key={order.id}
                  onClick={(e) => handleRowClick(order.id, index, e)}
                  className={`glass-card border border-border bg-card/50 hover:shadow-md transition-all cursor-pointer ${
                    isLastItem ? 'rounded-t-none' : 'rounded-none border-t-0'
                  } ${selectedOrders.includes(order.id) ? 'ring-1 ring-[#4B6BFB]/30 bg-[#4B6BFB]/5' : ''}`}
                >
                  <div className="p-4">
                    <div className="flex items-start gap-6">

                      {/* Column 1: Order Details - 1/4 width */}
                      <div 
                        className="w-1/4 flex-shrink-0 space-y-3 p-4 bg-muted/30 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={(e) => handleOpenShipmentPanel(e, order)}
                      >
                        {/* Order Info */}
                        <OrderInfoSection
                          order={order}
                          showAISuggestions={showAISuggestions.has(order.id)}
                          aiSuggestions={aiSuggestions}
                          onOrderClick={handleOpenOrderPanel}
                          onToggleAISuggestions={(e) => toggleAISuggestions(e, order.id)}
                          itemsExpanded={expandedLineItems.has(order.id)}
                          onToggleItems={(e) => toggleLineItems(e, order.id)}
                        />

                        <div className="border-t border-border" />

                        {/* Customer & Shipping Info */}
                        <ShippingInfoSection 
                          order={order}
                          onCustomerClick={handleOpenCustomerPanel}
                        />

                        {/* Carrier & Tracking */}
                        <CarrierTrackingSection
                          order={order}
                          sameOrders={sameOrders}
                          copiedTracking={copiedTracking}
                          onOpenTracking={handleOpenTracking}
                          onCopyTracking={handleCopyTracking}
                        />

                        <div className="border-t border-border" />

                        {/* Batch & Status */}
                        <OrderActionsSection
                          order={order}
                          onBulkPrintLabels={onBulkPrintLabels}
                        />

                        {/* Tags & Alerts Combined */}
                        <OrderTagsSection
                          order={order}
                        />

                        {/* Line Items */}
                        {expandedLineItems.has(order.id) && (
                          <LineItemsSection
                            order={order}
                            onImageClick={onImageClick}
                          />
                        )}
                      </div>

                      {/* Column 2: Products Images - 3/4 width */}
                      <div 
                        className="flex-1 border-l border-border pl-6"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ProductGallerySection
                          order={order}
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

      {/* Shipment Panel */}
      <ShipmentPanel
        order={selectedShipmentOrder}
        isOpen={isShipmentPanelOpen}
        onClose={handleCloseShipmentPanel}
        onAddToBatch={handleAddToBatch}
        onShip={handleShip}
        onSplit={handleSplit}
        onCombine={handleCombine}
      />

      {/* Order Detail Panel */}
      {selectedOrder && (
        <OrderDetailPanel
          order={selectedOrder}
          isOpen={isOrderPanelOpen}
          onClose={handleCloseOrderPanel}
        />
      )}

      {/* Customer Detail Panel */}
      <CustomerDetailPanel
        customer={selectedCustomer}
        isOpen={isCustomerPanelOpen}
        onClose={handleCloseCustomerPanel}
      />
    </div>
  );
}
