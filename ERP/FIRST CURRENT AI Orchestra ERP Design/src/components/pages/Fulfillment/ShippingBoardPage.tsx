"use client";

import { useState, useMemo } from "react";
import { Truck, Download, Plus, Layers, Printer, FileText } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "../../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Label } from "../../ui/label";
import { ShippingTableModule } from "../../Modules/Fulfillment/ShippingTable";
import { mockShipmentsEnhanced, type ShipmentEnhanced } from "../../../sampledata/shipmentsEnhanced";
import { mockBatchesEnhanced, type BatchEnhanced } from "../../../sampledata/batchesEnhanced";
import { mockOrderBoardData } from "../../../sampledata/orderBoardData";
import { type OrderData } from "../../../types/modules/crm";
import { PageHeader } from "../../Modules/Global/PageHeader";
import { toast } from "sonner";

export function ShippingBoardPage() {
  const [orders, setOrders] = useState<OrderData[]>(mockOrderBoardData);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  
  // Add to batch modal
  const [isAddToBatchOpen, setIsAddToBatchOpen] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState<string>("");

  const handleOrderClick = (order: OrderData) => {
    setSelectedOrder(order);
    setIsDetailPanelOpen(true);
  };

  const handleStatusChange = (orderId: string, newStatus: OrderData["orderStatus"]) => {
    // Update order status
    setOrders(prevOrders =>
      prevOrders.map(o =>
        o.id === orderId ? { ...o, orderStatus: newStatus } : o
      )
    );
    toast.success("Order status updated");
  };

  const handleBulkPrintLabels = (orderIds?: string[]) => {
    const ids = orderIds || selectedOrders;
    if (ids.length === 0) {
      toast.error("Please select orders to print labels");
      return;
    }
    
    toast.success(`Printing ${ids.length} shipping labels...`, {
      description: "Labels will be downloaded shortly"
    });
  };

  const handleBulkPrintPackingSlips = () => {
    if (selectedOrders.length === 0) {
      toast.error("Please select orders to print packing slips");
      return;
    }
    
    toast.success(`Printing ${selectedOrders.length} packing slips...`, {
      description: "Packing slips will be downloaded shortly"
    });
  };

  const handleAddToBatch = () => {
    if (selectedOrders.length === 0) {
      toast.error("Please select orders to add to batch");
      return;
    }
    setIsAddToBatchOpen(true);
  };

  const confirmAddToBatch = () => {
    if (!selectedBatchId) {
      toast.error("Please select a batch");
      return;
    }
    
    const batch = mockBatchesEnhanced.find(b => b.id === selectedBatchId);
    
    toast.success(`Added ${selectedOrders.length} orders to ${batch?.name}`, {
      description: "Orders have been assigned to the batch"
    });
    
    setIsAddToBatchOpen(false);
    setSelectedBatchId("");
    setSelectedOrders([]);
  };

  // Filter orders by status
  // New: Orders with status = "Processing" and NO statusProcess.group yet
  const newOrders = useMemo(() => 
    orders.filter(o => o.orderStatus === "Processing" && !o.statusProcess?.group),
    [orders]
  );
  
  // Awaiting: Orders with status = "Processing" and HAS statusProcess.group
  const awaitingOrders = useMemo(() =>
    orders.filter(o => o.orderStatus === "Processing" && o.statusProcess?.group),
    [orders]
  );
  
  // Shipped: Orders with status = "Shipped", "In Transit", "Out for Delivery", or "Shipping Delay"
  const shippedOrders = useMemo(() =>
    orders.filter(o => 
      o.orderStatus === "Shipped" || 
      o.orderStatus === "In Transit" || 
      o.orderStatus === "Out for Delivery" ||
      o.orderStatus === "Shipping Delay"
    ),
    [orders]
  );
  
  // On Hold: Orders with "Partial Payment" status (waiting for full payment)
  const onHoldOrders = useMemo(() =>
    orders.filter(o => o.orderStatus === "Partial Payment"),
    [orders]
  );

  // Debug logging
  console.log("=== ORDERS COUNT ===");
  console.log(`New Orders: ${newOrders.length}`, newOrders);
  console.log(`Awaiting Orders: ${awaitingOrders.length}`, awaitingOrders);
  console.log(`Shipped Orders: ${shippedOrders.length}`, shippedOrders);
  console.log(`On Hold Orders: ${onHoldOrders.length}`, onHoldOrders);
  console.log(`All Orders: ${orders.length}`, orders);

  return (
    <div className="h-full overflow-hidden bg-gradient-to-br from-blue-50/50 via-white to-green-50/30 dark:from-blue-950/20 dark:via-gray-900 dark:to-green-950/20">
      <div className="h-full overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <PageHeader
              icon={Truck}
              title="Shipping Board"
              description="Manage shipments across all warehouses"
              actions={
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              }
            />
          </motion.div>

          {/* Bulk Actions */}
          {selectedOrders.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="flex items-center gap-2"
            >
              <span className="text-sm text-muted-foreground">
                {selectedOrders.length} selected:
              </span>
              <Button variant="outline" size="sm" onClick={handleAddToBatch}>
                <Layers className="w-4 h-4 mr-2" />
                Add to Batch
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleBulkPrintLabels()}>
                <Printer className="w-4 h-4 mr-2" />
                Print Labels
              </Button>
              <Button variant="outline" size="sm" onClick={handleBulkPrintPackingSlips}>
                <FileText className="w-4 h-4 mr-2" />
                Packing Slips
              </Button>
            </motion.div>
          )}

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Tabs defaultValue="new" className="space-y-6">
              <TabsList className="glass-card inline-flex h-auto p-1">
                <TabsTrigger value="new" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                  New
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-[#4B6BFB]/10 text-[#4B6BFB] dark:bg-[#4B6BFB]/20 text-xs">
                    {newOrders.length}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="awaiting" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                  Awaiting
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900 text-xs">
                    {awaitingOrders.length}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="shipped" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                  Shipped
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-xs">
                    {shippedOrders.length}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="all" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                  All
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-xs">
                    {orders.length}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="onhold" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                  On Hold
                  {onHoldOrders.length > 0 && (
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900 text-xs">
                      {onHoldOrders.length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="new" className="space-y-4">
                <ShippingTableModule
                  orders={newOrders}
                  onOrderClick={handleOrderClick}
                  onStatusChange={handleStatusChange}
                  onBulkPrintLabels={handleBulkPrintLabels}
                  selectedOrders={selectedOrders}
                  onSelectionChange={setSelectedOrders}
                />
              </TabsContent>

              <TabsContent value="awaiting" className="space-y-4">
                <ShippingTableModule
                  orders={awaitingOrders}
                  onOrderClick={handleOrderClick}
                  onStatusChange={handleStatusChange}
                  onBulkPrintLabels={handleBulkPrintLabels}
                  selectedOrders={selectedOrders}
                  onSelectionChange={setSelectedOrders}
                />
              </TabsContent>

              <TabsContent value="shipped" className="space-y-4">
                <ShippingTableModule
                  orders={shippedOrders}
                  onOrderClick={handleOrderClick}
                  onStatusChange={handleStatusChange}
                  selectedOrders={selectedOrders}
                  onSelectionChange={setSelectedOrders}
                />
              </TabsContent>

              <TabsContent value="all" className="space-y-4">
                <ShippingTableModule
                  orders={orders}
                  onOrderClick={handleOrderClick}
                  onStatusChange={handleStatusChange}
                  onBulkPrintLabels={handleBulkPrintLabels}
                  selectedOrders={selectedOrders}
                  onSelectionChange={setSelectedOrders}
                />
              </TabsContent>

              <TabsContent value="onhold" className="space-y-4">
                <ShippingTableModule
                  orders={onHoldOrders}
                  onOrderClick={handleOrderClick}
                  onStatusChange={handleStatusChange}
                  selectedOrders={selectedOrders}
                  onSelectionChange={setSelectedOrders}
                />
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>

      {/* Add to Batch Dialog */}
      <Dialog open={isAddToBatchOpen} onOpenChange={setIsAddToBatchOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Shipments to Batch</DialogTitle>
            <DialogDescription>
              Select a batch to add the selected shipments to.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select Batch</Label>
              <Select value={selectedBatchId} onValueChange={setSelectedBatchId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a batch..." />
                </SelectTrigger>
                <SelectContent>
                  {mockBatchesEnhanced
                    .filter(b => b.status !== "shipped" && b.status !== "completed")
                    .map((batch) => (
                      <SelectItem key={batch.id} value={batch.id}>
                        {batch.name} ({batch.totalOrders} orders, {batch.status})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-muted-foreground">
              {selectedOrders.length} order{selectedOrders.length !== 1 ? "s" : ""} will be added to the selected batch
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddToBatchOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmAddToBatch}>
              Add to Batch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* TODO: Add ShipmentDetailPanel when created */}
    </div>
  );
}
