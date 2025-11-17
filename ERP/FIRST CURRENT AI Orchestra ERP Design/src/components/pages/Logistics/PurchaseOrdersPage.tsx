"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Badge } from "../../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import {
  Plus,
  Search,
  Download,
  Calendar,
  FileText,
  Sparkles,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../ui/tabs";
import { PurchaseOrderTableModule } from "../../Modules/Logistics/PurchaseOrderTable/PurchaseOrderTableModule";
import { PurchaseOrder, MOCK_PURCHASE_ORDERS } from "../../Modules/Logistics/PurchaseOrderTable";
import { toast } from "sonner";
import { CreatePurchaseOrderPanel } from "../../panels/CreatePurchaseOrderPanel";

export function PurchaseOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(MOCK_PURCHASE_ORDERS);
  const [showCreatePanel, setShowCreatePanel] = useState(false);

  const handlePOClick = (po: PurchaseOrder) => {
    setSelectedPO(po);
    toast.success(`Opening PO: ${po.poNumber}`);
  };

  const handleCreateNew = () => {
    setShowCreatePanel(true);
  };

  const handleSavePO = (poData: any) => {
    const newPO: PurchaseOrder = {
      id: (purchaseOrders.length + 1).toString(),
      poNumber: poData.poNumber,
      vendor: poData.vendor,
      status: poData.status,
      items: poData.items,
      totalAmount: poData.totalAmount,
      createdDate: poData.createdDate,
      deliveryDate: poData.deliveryDate,
      warehouse: poData.warehouse,
      priority: poData.priority,
      paymentTerms: poData.paymentTerms || "Net 30",
      notes: poData.notes,
    };
    setPurchaseOrders([newPO, ...purchaseOrders]);
  };

  const getFilteredPOsByTab = (tab: string) => {
    let filtered = purchaseOrders;

    if (tab === "pending") {
      filtered = purchaseOrders.filter(po => po.status === "Pending");
    } else if (tab === "planning") {
      filtered = purchaseOrders.filter(po => po.status === "Planning");
    } else if (tab === "approved") {
      filtered = purchaseOrders.filter(po => po.status === "Approved");
    } else if (tab === "processed") {
      filtered = purchaseOrders.filter(po => po.status === "Processed");
    } else if (tab === "all") {
      // Apply search filter
      if (searchTerm) {
        filtered = filtered.filter(po =>
          po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          po.vendor.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Apply status filter
      if (selectedStatus !== "all") {
        filtered = filtered.filter(po => po.status.toLowerCase() === selectedStatus.toLowerCase());
      }
    }

    return filtered;
  };

  const filteredPOs = getFilteredPOsByTab(activeTab);

  // Calculate metrics
  const pendingPOs = purchaseOrders.filter(po => po.status === "Pending");
  const approvedPOs = purchaseOrders.filter(po => po.status === "Approved");
  const processedPOs = purchaseOrders.filter(po => po.status === "Processed");
  const planningPOs = purchaseOrders.filter(po => po.status === "Planning");

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#DAB785] to-[#C9A874] flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="mb-1">Purchase Orders</h1>
              <p className="text-sm text-muted-foreground mb-0">
                Manage and track all purchase orders
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Export as CSV</DropdownMenuItem>
                <DropdownMenuItem>Export as Excel</DropdownMenuItem>
                <DropdownMenuItem>Export as PDF</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              onClick={handleCreateNew}
              className="gap-2 bg-gradient-to-r from-[#DAB785] to-[#C9A874] hover:from-[#C9A874] to-[#B89763] text-white shadow-md"
            >
              <Plus className="w-4 h-4" />
              Create PO
            </Button>
          </div>
        </div>

        {/* AI Recommendation + Compact Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Recommendation Card */}
          <Card className="lg:col-span-2 p-5 bg-gradient-to-br from-ai-blue/5 to-ai-blue/10 border-ai-blue/20">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-ai-blue/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-ai-blue" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2">AI Insights</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  You have <span className="text-ai-blue">{ pendingPOs.length} pending orders</span> waiting for approval. Based on historical data, approving these orders by end of day could optimize delivery timelines by 15%.
                </p>
                <div className="flex gap-2">
                  <Button size="sm" className="h-8 bg-ai-blue hover:bg-ai-blue/90">
                    Review Pending
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 border-ai-blue/30 hover:bg-ai-blue/10">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Compact Metrics Card */}
          <Card className="p-5 bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
            <h3 className="mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Pending</span>
                <div className="text-right">
                  <p className="mb-0">{pendingPOs.reduce((sum, po) => sum + po.items, 0)} items</p>
                  <p className="text-xs text-yellow-600 mb-0">${pendingPOs.reduce((sum, po) => sum + po.totalAmount, 0).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Approved</span>
                <div className="text-right">
                  <p className="mb-0">{approvedPOs.reduce((sum, po) => sum + po.items, 0)} items</p>
                  <p className="text-xs text-blue-600 mb-0">${approvedPOs.reduce((sum, po) => sum + po.totalAmount, 0).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Processed</span>
                <div className="text-right">
                  <p className="mb-0">{processedPOs.reduce((sum, po) => sum + po.items, 0)} items</p>
                  <p className="text-xs text-purple-600 mb-0">${processedPOs.reduce((sum, po) => sum + po.totalAmount, 0).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="pending" className="gap-2">
                Pending
                {pendingPOs.length > 0 && (
                  <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                    {pendingPOs.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="planning" className="gap-2">
                Planning
                {planningPOs.length > 0 && (
                  <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                    {planningPOs.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="approved" className="gap-2">
                Approved
                {approvedPOs.length > 0 && (
                  <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                    {approvedPOs.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="processed" className="gap-2">
                Processed
                {processedPOs.length > 0 && (
                  <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                    {processedPOs.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>

            {/* Date Range Filter */}
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2">
                <Calendar className="w-4 h-4" />
                Date Range
              </Button>
            </div>
          </div>

          {/* Search and Status Filter - Only in All tab */}
          {activeTab === "all" && (
            <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50 mb-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[250px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by PO number or vendor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Planning">Planning</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Processed">Processed</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Shipped">Shipped</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Delayed">Delayed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>
          )}

          {/* Purchase Orders Table - Using Module */}
          <TabsContent value={activeTab} className="mt-0">
            <PurchaseOrderTableModule
              data={filteredPOs}
              onPOClick={handlePOClick}
              searchTerm={searchTerm}
              selectedStatus={selectedStatus}
            />
          </TabsContent>
        </Tabs>

        {/* Create Purchase Order Panel */}
        <CreatePurchaseOrderPanel
          isOpen={showCreatePanel}
          onClose={() => setShowCreatePanel(false)}
          onSave={handleSavePO}
        />

        {/* Future: Add Detail Panel for selectedPO */}
        {selectedPO && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="fixed top-0 right-0 h-full w-[500px] bg-card border-l border-border shadow-2xl z-50"
          >
            <div className="p-6">
              <h2>Purchase Order Details</h2>
              <p className="text-muted-foreground">PO: {selectedPO.poNumber}</p>
              <Button onClick={() => setSelectedPO(null)} variant="outline" className="mt-4">
                Close
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
