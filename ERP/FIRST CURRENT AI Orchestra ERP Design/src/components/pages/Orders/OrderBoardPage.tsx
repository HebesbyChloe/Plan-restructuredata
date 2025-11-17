"use client";

/**
 * Order Board Page
 * 
 * Main page for managing and tracking all customer orders.
 * Refactored to use modular components for better maintainability.
 */

import { useState } from "react";
import {
  OrderTableModule,
  OrderBoardHeaderModule,
  OrderBoardFiltersModule,
  CreateOrderPanelModule,
  CreateCouponPanelModule,
  CreateCartPanelModule,
  type OrderData,
  type FilterValues,
  type DateRange,
} from "../../Modules/Orders";
import { mockOrderBoardData, SALE_REPS } from "../../../sampledata/orderBoardData";

export function OrderBoardPage() {
  // Search & View State
  const [searchTerm, setSearchTerm] = useState("");
  const [orderViewTab, setOrderViewTab] = useState<"my" | "all">("my");
  
  // Filter States
  const [filters, setFilters] = useState<FilterValues>({
    shift: "All",
    status: "All",
    store: "All",
    csat: "All",
    approveRft: "All",
    staff: "All",
  });
  
  // Date Range State
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [dateRangeLabel, setDateRangeLabel] = useState("Date Range");
  
  // Panel States
  const [createOrderPanel, setCreateOrderPanel] = useState(false);
  const [createCouponPanel, setCreateCouponPanel] = useState(false);
  const [createCartPanel, setCreateCartPanel] = useState(false);
  const [selectedStore, setSelectedStore] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);

  // Constants
  const stores = [
    { value: "hebesbychloe", label: "HebesbyChloe.com" },
    { value: "ritamie", label: "Ritamie.com" },
    { value: "ebesmarket", label: "Ebesmarket.com" },
  ];

  // Mock logged-in user
  const currentUser = "Sarah Nguyen";

  // Filter orders based on view tab
  const getFilteredOrders = () => {
    if (orderViewTab === "my") {
      return mockOrderBoardData.filter(order => 
        order.saleRepMain === currentUser || order.saleRepConverted === currentUser
      );
    }
    return mockOrderBoardData;
  };

  // Store selection handler
  const handleStoreSelect = (store: string, type: "order" | "coupon" | "cart") => {
    setSelectedStore(store);
    if (type === "order") {
      setCreateOrderPanel(true);
    } else if (type === "coupon") {
      setCreateCouponPanel(true);
    } else if (type === "cart") {
      setCreateCartPanel(true);
    }
  };

  // Order click handler
  const handleOrderClick = (order: OrderData) => {
    setSelectedOrder(order);
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
  };

  const handleDateRangeClear = () => {
    setDateRange({ from: undefined, to: undefined });
    setDateRangeLabel("Date Range");
  };

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    if (range.from && range.to) {
      setDateRangeLabel(
        `${range.from.toLocaleDateString()} - ${range.to.toLocaleDateString()}`
      );
    }
  };

  // Filter handlers
  const handleFilterChange = (key: keyof FilterValues, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      shift: "All",
      status: "All",
      store: "All",
      csat: "All",
      approveRft: "All",
      staff: "All",
    });
  };

  // Count active filters
  const activeFilterCount = Object.values(filters).filter(v => v !== "All").length;

  // Submit handlers (placeholder implementations)
  const handleCreateOrder = (orderData: any) => {
    console.log("Create order:", orderData);
  };

  const handleCreateCoupon = (couponData: any) => {
    console.log("Create coupon:", couponData);
  };

  const handleCreateCart = (cartData: any) => {
    console.log("Create cart:", cartData);
  };

  return (
    <div className="w-full h-full space-y-6">
      {/* Header */}
      <OrderBoardHeaderModule
        onCreateOrder={(store) => handleStoreSelect(store, "order")}
        onCreateCoupon={(store) => handleStoreSelect(store, "coupon")}
        onCreateCart={(store) => handleStoreSelect(store, "cart")}
        onRefresh={() => {
          if (typeof window !== 'undefined') {
            window.location.reload();
          }
        }}
        stores={stores}
      />

      {/* Search & Filters */}
      <OrderBoardFiltersModule
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        viewTab={orderViewTab}
        onViewTabChange={setOrderViewTab}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        activeFilterCount={activeFilterCount}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        dateRangeLabel={dateRangeLabel}
        onDatePreset={handleDatePreset}
        onDateRangeClear={handleDateRangeClear}
        staffOptions={SALE_REPS}
      />

      {/* Orders Table */}
      <OrderTableModule 
        orders={getFilteredOrders()} 
        onOrderClick={handleOrderClick}
        saleReps={SALE_REPS}
      />

      {/* Create Order Panel */}
      <CreateOrderPanelModule
        open={createOrderPanel}
        onOpenChange={setCreateOrderPanel}
        selectedStore={selectedStore}
        stores={stores}
        onSubmit={handleCreateOrder}
      />

      {/* Create Coupon Panel */}
      <CreateCouponPanelModule
        open={createCouponPanel}
        onOpenChange={setCreateCouponPanel}
        selectedStore={selectedStore}
        stores={stores}
        onSubmit={handleCreateCoupon}
      />

      {/* Create Cart Panel */}
      <CreateCartPanelModule
        open={createCartPanel}
        onOpenChange={setCreateCartPanel}
        selectedStore={selectedStore}
        stores={stores}
        onSubmit={handleCreateCart}
      />
    </div>
  );
}
