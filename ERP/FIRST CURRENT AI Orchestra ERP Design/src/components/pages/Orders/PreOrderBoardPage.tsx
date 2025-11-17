"use client";

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
import { Calendar } from "../../ui/calendar";
import {
  Search,
  Download,
  RefreshCw,
  Calendar as CalendarIcon,
  Filter,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PreOrderTableModule, OrderDetailPanel } from "../../Modules/Orders";
import { mockOrderBoardData, SALE_REPS } from "../../../sampledata/orderBoardData";
import { CustomerDetailPanel } from "../../Modules/CRM/Panels/CustomerDetailPanel";
import { OrderData } from "../../../types/modules/crm";

export function PreOrderBoardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [orderViewTab, setOrderViewTab] = useState<"my" | "all">("my");
  
  // Combined filter states
  const [statusFilter, setStatusFilter] = useState("All");
  const [staffFilter, setStaffFilter] = useState("All");
  const [reasonFilter, setReasonFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [srHandleFilter, setSrHandleFilter] = useState("All");
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
  const currentUser = "Hang Tran";

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
    // First filter by orderType = "pre-order"
    let filtered = mockOrderBoardData.filter(order => order.orderType === "pre-order");
    
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
    statusFilter !== "All",
    staffFilter !== "All",
    reasonFilter !== "All",
    categoryFilter !== "All",
    srHandleFilter !== "All",
  ].filter(Boolean).length;

  return (
    <div className="w-full h-full space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 pb-6 border-b border-border/50">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <CalendarIcon className="w-5 h-5 text-white" />
            </div>
            <h1 className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-0">
              Pre Order Board
            </h1>
          </div>
          <p className="text-muted-foreground">
            Track and manage pre-orders and upcoming inventory
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
              My Pre-Orders
            </button>
            <button
              onClick={() => setOrderViewTab("all")}
              className={`px-3 py-1.5 text-sm rounded transition-colors ${
                orderViewTab === "all"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              All Pre-Orders
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
                <CalendarIcon className="w-4 h-4" />
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
                  <Calendar
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
                {/* Status Filter */}
                <div className="space-y-1.5">
                  <Label className="text-xs opacity-60">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      <SelectItem value="Processing">Processing</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
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
                      {SALE_REPS.map((staff) => (
                        <SelectItem key={staff} value={staff}>
                          {staff}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Reason Filter */}
                <div className="space-y-1.5">
                  <Label className="text-xs opacity-60">Reason</Label>
                  <Select value={reasonFilter} onValueChange={setReasonFilter}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      <SelectItem value="Pre Order">Pre Order</SelectItem>
                      <SelectItem value="Custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Category Filter */}
                <div className="space-y-1.5">
                  <Label className="text-xs opacity-60">Category</Label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      <SelectItem value="Jewelry">Jewelry</SelectItem>
                      <SelectItem value="Necklace">Necklace</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* SR Handle Filter */}
                <div className="space-y-1.5">
                  <Label className="text-xs opacity-60">SR Handle</Label>
                  <Select value={srHandleFilter} onValueChange={setSrHandleFilter}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Processing">Processing</SelectItem>
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
                      setStatusFilter("All");
                      setStaffFilter("All");
                      setReasonFilter("All");
                      setCategoryFilter("All");
                      setSrHandleFilter("All");
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

      {/* Pre-Orders Table - Using Module */}
      <PreOrderTableModule 
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
