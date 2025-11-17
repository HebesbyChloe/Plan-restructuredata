"use client";

import { useState } from "react";
import { 
  CustomOrderTableModule,
  CustomOrderBoardHeaderModule,
  CustomOrderBoardFiltersModule,
  CustomOrderFilterValues,
  OrderDetailPanel
} from "../../Modules/Orders";
import { mockOrderBoardData, SALE_REPS } from "../../../sampledata/orderBoardData";
import { CustomerDetailPanel } from "../../Modules/CRM/Panels/CustomerDetailPanel";
import { OrderData } from "../../../types/modules/crm";

/**
 * CustomizeOrderBoardPage
 * 
 * Manage custom design orders with specialized tracking for:
 * - 3D Design status
 * - Material procurement
 * - Production progress
 * - Payment plans
 * 
 * Features:
 * - My/All custom orders view
 * - 8 specialized filters (Rank, Status, Store, Staff, Payment, Design, Material, Completion)
 * - Date range filtering
 * - Customer and order detail panels
 */
export function CustomizeOrderBoardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [orderViewTab, setOrderViewTab] = useState<"my" | "all">("my");
  
  // Combined filter states
  const [filterValues, setFilterValues] = useState<CustomOrderFilterValues>({
    rankFilter: "All",
    statusFilter: "All",
    storeFilter: "All",
    staffFilter: "All",
    paymentFilter: "All",
    designFilter: "All",
    materialFilter: "All",
    completionFilter: "All",
  });
  const [filterExpanded, setFilterExpanded] = useState(false);
  
  // Date range states
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
    // First filter by orderType = "customize"
    let filtered = mockOrderBoardData.filter(order => order.orderType === "customize");
    
    // Then filter by view tab
    if (orderViewTab === "my") {
      filtered = filtered.filter(order => order.saleRepMain === currentUser);
    }
    
    return filtered;
  };

  // Handle refresh
  const handleRefresh = () => {
    console.log("Refreshing custom orders...");
    // Add refresh logic here
  };

  // Handle export
  const handleExport = () => {
    console.log("Exporting custom orders...");
    // Add export logic here
  };

  return (
    <div className="w-full h-full space-y-6">
      {/* Header */}
      <CustomOrderBoardHeaderModule
        onRefresh={handleRefresh}
        onExport={handleExport}
      />

      {/* Filters */}
      <CustomOrderBoardFiltersModule
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        orderViewTab={orderViewTab}
        onOrderViewTabChange={setOrderViewTab}
        filterValues={filterValues}
        onFilterChange={setFilterValues}
        filterExpanded={filterExpanded}
        onFilterExpandedChange={setFilterExpanded}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        dateRangeLabel={dateRangeLabel}
        onDateRangeLabelChange={setDateRangeLabel}
        staffList={SALE_REPS}
      />

      {/* Custom Orders Table - Using Module */}
      <CustomOrderTableModule 
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
