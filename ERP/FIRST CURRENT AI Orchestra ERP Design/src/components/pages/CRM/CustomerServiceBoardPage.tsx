"use client";

import { useState } from "react";
import { 
  CustomerServiceTableModule,
  CustomerServiceDetailPanel,
  CustomerDetailPanel,
  CustomerServiceBoardHeaderModule,
  CustomerServiceBoardFiltersModule,
  CustomerServiceFilterValues,
} from "../../Modules/CRM";
import { OrderDetailPanel } from "../../Modules/Orders";
import { 
  mockCustomerServiceTickets, 
  CUSTOMER_SERVICE_STAFF, 
  CustomerServiceTicket 
} from "../../../sampledata/customerServiceData";
import { mockOrderBoardData } from "../../../sampledata/orderBoardData";

/**
 * CustomerServiceBoardPage
 * 
 * Manage customer support tickets and service requests with:
 * - Ticket status tracking
 * - Priority management
 * - Category organization
 * - Staff assignment
 * - Customer satisfaction tracking
 * 
 * Features:
 * - My/All tickets view
 * - 5 specialized filters (Status, Priority, Category, Assigned To, Satisfaction)
 * - Date range filtering
 * - Customer, order, and ticket detail panels
 * - New ticket creation
 */
export function CustomerServiceBoardPage() {
  const currentUser = "Hang Tran"; // Current logged-in user
  
  const [searchTerm, setSearchTerm] = useState("");
  const [ticketViewTab, setTicketViewTab] = useState<"my" | "all">("my");
  
  // Combined filter states
  const [filterValues, setFilterValues] = useState<CustomerServiceFilterValues>({
    statusFilter: "All",
    priorityFilter: "All",
    categoryFilter: "All",
    assignedFilter: "All",
    satisfactionFilter: "All",
  });
  const [filterExpanded, setFilterExpanded] = useState(false);
  
  // Date range states
  const [dateRangeOpen, setDateRangeOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [dateRangeLabel, setDateRangeLabel] = useState("Date Range");

  // Panel states
  const [selectedTicket, setSelectedTicket] = useState<CustomerServiceTicket | null>(null);
  const [selectedCustomerTicket, setSelectedCustomerTicket] = useState<CustomerServiceTicket | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isCreatingNewTicket, setIsCreatingNewTicket] = useState(false);

  // Filter tickets based on view tab
  const getFilteredTickets = () => {
    if (ticketViewTab === "my") {
      return mockCustomerServiceTickets.filter(ticket => ticket.customer.assignedTo === currentUser);
    }
    return mockCustomerServiceTickets;
  };

  // Handle refresh
  const handleRefresh = () => {
    console.log("Refreshing customer service tickets...");
    // Add refresh logic here
  };

  // Handle export
  const handleExport = () => {
    console.log("Exporting customer service tickets...");
    // Add export logic here
  };

  // Handle new ticket
  const handleNewTicket = () => {
    setIsCreatingNewTicket(true);
  };

  return (
    <div className="w-full h-full space-y-6">
      {/* Header */}
      <CustomerServiceBoardHeaderModule
        onRefresh={handleRefresh}
        onExport={handleExport}
        onNewTicket={handleNewTicket}
      />

      {/* Filters */}
      <CustomerServiceBoardFiltersModule
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        ticketViewTab={ticketViewTab}
        onTicketViewTabChange={setTicketViewTab}
        filterValues={filterValues}
        onFilterChange={setFilterValues}
        filterExpanded={filterExpanded}
        onFilterExpandedChange={setFilterExpanded}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        dateRangeLabel={dateRangeLabel}
        onDateRangeLabelChange={setDateRangeLabel}
        dateRangeOpen={dateRangeOpen}
        onDateRangeOpenChange={setDateRangeOpen}
        staffList={CUSTOMER_SERVICE_STAFF}
      />

      {/* Service Tickets Table - Using Module */}
      <CustomerServiceTableModule 
        tickets={getFilteredTickets()} 
        onTicketClick={(ticket) => setSelectedTicket(ticket)}
        onCustomerClick={(ticket) => setSelectedCustomerTicket(ticket)}
        onOrderClick={(ticket) => {
          if (ticket.orderId) {
            setSelectedOrderId(ticket.orderId);
          }
        }}
        staffList={CUSTOMER_SERVICE_STAFF}
      />

      {/* Customer Service Detail Panel */}
      {(selectedTicket || isCreatingNewTicket) && (
        <CustomerServiceDetailPanel 
          ticket={selectedTicket || {
            id: "NEW",
            customer: { name: "", tier: "New", assignedTo: currentUser },
            issueType: "General",
            issueDetail: "",
            priority: "Medium",
            status: "Open",
            createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            lastUpdate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            updatedBy: currentUser,
            messages: 0,
          }}
          onClose={() => {
            setSelectedTicket(null);
            setIsCreatingNewTicket(false);
          }}
          onOrderClick={(orderId) => setSelectedOrderId(orderId)}
          isNewTicket={isCreatingNewTicket}
        />
      )}

      {/* Customer Detail Panel */}
      {selectedCustomerTicket && (
        <CustomerDetailPanel
          customer={{
            id: selectedCustomerTicket.customer.name,
            name: selectedCustomerTicket.customer.name,
            email: `${selectedCustomerTicket.customer.name.toLowerCase().replace(" ", ".")}@email.com`,
            phone: "(555) 123-4567",
            company: "Company Name",
            location: "New York, USA",
            registeredDate: "Jan 15, 2024",
            totalOrders: 12,
            totalSpent: "$8,450.00",
            averageOrderValue: "$704.17",
            lastOrderDate: "Oct 28, 2024",
            customerRank: selectedCustomerTicket.customer.tier as any,
            saleRepMain: "John Doe",
            saleRepConverted: selectedCustomerTicket.customer.assignedTo,
            notes: "VIP customer with high engagement",
            tags: [selectedCustomerTicket.customer.tier, "Active"],
          }}
          isOpen={!!selectedCustomerTicket}
          onClose={() => setSelectedCustomerTicket(null)}
        />
      )}

      {/* Order Detail Panel */}
      {selectedOrderId && (
        <OrderDetailPanel
          order={mockOrderBoardData.find(o => o.orderNumber === selectedOrderId) || null}
          isOpen={!!selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )}
    </div>
  );
}
