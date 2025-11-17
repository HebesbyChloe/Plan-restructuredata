"use client";

/**
 * ReturnWarrantyBoardPage
 * 
 * Manage returns, warranties, repairs, and service requests.
 * 
 * Features:
 * - View my returns or all returns
 * - Filter by request type, status, shipping, refund, and staff
 * - Date range filtering
 * - Expandable filter panel
 * - Search functionality
 * - View customer and order details
 * 
 * Access: CRM → Service Orders Board
 */

import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Badge } from "../../ui/badge";
import { Label } from "../../ui/label";
import { Separator } from "../../ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../ui/popover";
import { Calendar as CalendarComp } from "../../ui/calendar";
import {
  Search,
  Download,
  RefreshCw,
  RotateCcw,
  Calendar,
  Filter,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ReturnWarrantyTableModule } from "../../Modules/CRM";
import { mockOrderBoardData } from "../../../sampledata/orderBoardData";
import { RETURN_WARRANTY_STAFF } from "../../../sampledata/returnWarrantyData";
import { REQUEST_TYPE, RETURN_WARRANTY_STATUS } from "../../../sampledata/returnWarrantyExtraData";
import { CustomerDetailPanel } from "../../Modules/CRM/Panels/CustomerDetailPanel";
import { OrderDetailPanel } from "../../Modules/CRM/Panels/OrderDetailPanel";
import { OrderData } from "../../../types/modules/crm";

export function ReturnWarrantyBoardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [orderViewTab, setOrderViewTab] = useState<"my" | "all">("my");
  
  // Combined filter states
  const [reasonFilter, setReasonFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [shippingFilter, setShippingFilter] = useState("All");
  const [refundFilter, setRefundFilter] = useState("All");
  const [staffFilter, setStaffFilter] = useState("All");
  const [filterExpanded, setFilterExpanded] = useState(false);
  
  // Date range states
  const [dateRangeOpen, setDateRangeOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [dateRangeLabel, setDateRangeLabel] = useState("Date Range");

  // Panel states
  const [selectedCustomer, setSelectedCustomer] = useState<OrderData | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [isCustomerPanelOpen, setIsCustomerPanelOpen] = useState(false);
  const [isOrderPanelOpen, setIsOrderPanelOpen] = useState(false);

  // Mock logged-in user
  const currentUser = "Hai Lam";

  // Handle customer click
  const handleCustomerClick = (order: OrderData) => {
    setSelectedCustomer(order);
    setIsCustomerPanelOpen(true);
    setIsOrderPanelOpen(false);
  };

  // Handle order click
  const handleOrderClick = (order: OrderData) => {
    setSelectedOrder(order);
    setIsOrderPanelOpen(true);
    setIsCustomerPanelOpen(false);
  };

  // Filter orders based on view tab and orderType
  const getFilteredOrders = () => {
    // First filter by orderType = "return-warranty"
    let filtered = mockOrderBoardData.filter(order => order.orderType === "return-warranty");
    
    // Then filter by view tab
    if (orderViewTab === "my") {
      filtered = filtered.filter(order => order.saleRepMain === currentUser);
    }
    
    return filtered;
  };

  // Date range preset handlers
  const handleDatePreset = (preset: "7days" | "thisMonth" | "lastMonth") => {
    const today = new Date();
    let from: Date;
    let to: Date = today;

    switch (preset) {
      case "7days":
        from = new Date(today);
        from.setDate(today.getDate() - 7);
        setDateRangeLabel("Last 7 Days");
        break;
      case "thisMonth":
        from = new Date(today.getFullYear(), today.getMonth(), 1);
        to = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        setDateRangeLabel("This Month");
        break;
      case "lastMonth":
        from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        to = new Date(today.getFullYear(), today.getMonth(), 0);
        setDateRangeLabel("Last Month");
        break;
    }

    setDateRange({ from, to });
    setDateRangeOpen(false);
  };

  // Count active filters
  const activeFilterCount = [
    reasonFilter !== "All",
    statusFilter !== "All",
    shippingFilter !== "All",
    refundFilter !== "All",
    staffFilter !== "All",
  ].filter(Boolean).length;

  return (
    <div className="w-full h-full space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 pb-6 border-b border-border/50">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
              <RotateCcw className="w-5 h-5 text-white" />
            </div>
            <h1 className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent mb-0">
              Service Orders Board
            </h1>
          </div>
          <p className="text-muted-foreground">
            Manage returns, warranties, repairs, and service requests
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Search & Tabs Bar */}
      <Card className="p-3 sm:p-4 bg-card/50 backdrop-blur-sm border-border/50">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* View Tabs - My Orders / All Orders */}
          <div className="inline-flex rounded-md border border-border bg-background p-1">
            <button
              onClick={() => setOrderViewTab("my")}
              className={`px-3 py-1.5 text-sm rounded transition-colors ${
                orderViewTab === "my"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              My Returns
            </button>
            <button
              onClick={() => setOrderViewTab("all")}
              className={`px-3 py-1.5 text-sm rounded transition-colors ${
                orderViewTab === "all"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              All Returns
            </button>
          </div>

          {/* Filter Toggle Button */}
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 relative"
            onClick={() => setFilterExpanded(!filterExpanded)}
          >
            <Filter className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-primary text-xs">
                {activeFilterCount}
              </Badge>
            )}
            {filterExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>

          {/* Date Range Picker */}
          <Popover open={dateRangeOpen} onOpenChange={setDateRangeOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Calendar className="w-4 h-4" />
                {dateRangeLabel}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <div className="flex">
                {/* Presets */}
                <div className="border-r border-border p-3 space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm"
                    onClick={() => handleDatePreset("7days")}
                  >
                    Last 7 Days
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm"
                    onClick={() => handleDatePreset("thisMonth")}
                  >
                    This Month
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm"
                    onClick={() => handleDatePreset("lastMonth")}
                  >
                    Last Month
                  </Button>
                  <Separator className="my-2" />
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm"
                    onClick={() => {
                      setDateRange({ from: undefined, to: undefined });
                      setDateRangeLabel("Date Range");
                      setDateRangeOpen(false);
                    }}
                  >
                    Clear
                  </Button>
                </div>
                
                {/* Calendar */}
                <div className="p-3">
                  <CalendarComp
                    mode="range"
                    selected={dateRange}
                    onSelect={(range) => {
                      if (range) {
                        setDateRange(range as any);
                        if (range.from && range.to) {
                          setDateRangeLabel(
                            `${range.from.toLocaleDateString()} - ${range.to.toLocaleDateString()}`
                          );
                          setDateRangeOpen(false);
                        }
                      }
                    }}
                    numberOfMonths={2}
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Expandable Filter Section */}
        <AnimatePresence>
          {filterExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <Separator className="my-3" />
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {/* Request Type Filter */}
                <div className="space-y-1.5">
                  <Label className="text-xs opacity-60">Request Type</Label>
                  <Select value={reasonFilter} onValueChange={setReasonFilter}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      {Object.values(REQUEST_TYPE).map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Filter */}
                <div className="space-y-1.5">
                  <Label className="text-xs opacity-60">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      {Object.values(RETURN_WARRANTY_STATUS).map((status) => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Shipping Filter */}
                <div className="space-y-1.5">
                  <Label className="text-xs opacity-60">Shipping</Label>
                  <Select value={shippingFilter} onValueChange={setShippingFilter}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      <SelectItem value="Not Yet">Not Yet</SelectItem>
                      <SelectItem value="Label Sent">Label Sent</SelectItem>
                      <SelectItem value="In Transit">In Transit</SelectItem>
                      <SelectItem value="Received">Received</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Refund Filter */}
                <div className="space-y-1.5">
                  <Label className="text-xs opacity-60">Refund</Label>
                  <Select value={refundFilter} onValueChange={setRefundFilter}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      <SelectItem value="Pending Refund">Pending Refund</SelectItem>
                      <SelectItem value="Processed">Processed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Staff Filter */}
                <div className="space-y-1.5">
                  <Label className="text-xs opacity-60">Staff</Label>
                  <Select value={staffFilter} onValueChange={setStaffFilter}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Staff</SelectItem>
                      {RETURN_WARRANTY_STAFF.map((staff) => (
                        <SelectItem key={staff} value={staff}>
                          {staff}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Clear All Filters Button */}
              {activeFilterCount > 0 && (
                <div className="mt-3 flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setReasonFilter("All");
                      setStatusFilter("All");
                      setShippingFilter("All");
                      setRefundFilter("All");
                      setStaffFilter("All");
                    }}
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Return/Warranty Table - Using Module */}
      <ReturnWarrantyTableModule 
        orders={getFilteredOrders()} 
        onOrderClick={handleOrderClick}
        onCustomerClick={handleCustomerClick}
      />

      {/* Customer Detail Panel */}
      {selectedCustomer && (
        <CustomerDetailPanel
          isOpen={isCustomerPanelOpen}
          onClose={() => setIsCustomerPanelOpen(false)}
          customer={{
            id: selectedCustomer.id,
            name: selectedCustomer.customerName,
            email: "",
            phone: "",
            address: "",
            tier: selectedCustomer.customerRank,
            totalOrders: 0,
            totalSpent: selectedCustomer.amount,
            lastOrderDate: selectedCustomer.createdDate,
            notes: "",
          }}
        />
      )}

      {/* Order Detail Panel */}
      {selectedOrder && (
        <OrderDetailPanel
          isOpen={isOrderPanelOpen}
          onClose={() => setIsOrderPanelOpen(false)}
          order={selectedOrder}
        />
      )}
    </div>
  );
}
