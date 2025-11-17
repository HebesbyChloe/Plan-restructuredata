/**
 * CRM Module - Centralized Type Definitions
 * All types for CRM modules (OrderTable, CustomerServiceTable, etc.)
 */

import { CustomerServiceTicket } from "../../sampledata/customerServiceData";
import { ReengageBatch } from "../../sampledata";
import { StatusProcessGroup } from "../../utils/modules/crm";

// ============================================
// ORDER TABLE TYPES
// ============================================

export interface OrderData {
  id: string;
  orderNumber: string;
  amount: number;
  paidAmount?: number;
  dueAmount?: number;
  paymentBreakdown?: Array<{
    orderNumber: string;
    amount: number;
    paidAmount: number;
    dueAmount: number;
  }>;
  saleRepConverted: string;
  customerName: string;
  customerRank: "VVIP" | "VIP" | "Repeat" | "New";
  saleRepMain: string;
  createdDate: string;
  createdTime: string;
  orderStatus: "Processing" | "Partial Payment" | "Completed" | "Shipped" | "In Transit" | "Out for Delivery" | "Shipping Delay" | "Delivered" | "Refunded";
  orderType: "regular" | "pre-order" | "customize" | "return-warranty";
  alerts: {
    imageMissing?: boolean;
    customerNote?: boolean;
    addressMissing?: boolean;
    linkedOrders?: boolean;
    late?: number;
    serviceRequest?: boolean;
    refundRequest?: boolean;
  };
  followUp: {
    tagColor: string;
    status: string;
    approvalStatus?: string;
  };
  statusProcess?: {
    group: StatusProcessGroup;
    currentStatus: string;
  };
  fulfillmentType?: "Tracking" | "Store Pickup" | "Manual Mark Shipped";
  tracking: Array<{
    trackingNumber: string;
    carrier: string;
    dateShipped: string;
    status: string;
  }>;
  customerService: {
    feedback?: string;
    socialReview?: string;
    satisfaction?: "positive" | "neutral" | "negative";
  };
  customization?: {
    designStatus: "Pending" | "In Progress" | "Completed" | "Approved";
    approvalStatus: "Pending" | "Approved" | "Revision Needed";
    designer: string;
    notes?: string;
  };
  preOrder?: {
    expectedDate: string;
    depositAmount: number;
    depositStatus: "Paid" | "Pending";
    productionStatus: "Not Started" | "In Progress" | "Completed";
  };
  returnWarranty?: {
    returnType?: "Return" | "Warranty" | "Exchange" | "Repair" | "Cancel/Inquiry";
    requestType?: string;
    returnWarrantyStatus?: string;
    receivedDate?: string;
    shippingStatus?: string;
    refundStatus?: string;
    note?: string;
  };
}

export interface OrderTableModuleProps {
  orders: OrderData[];
  onOrderClick?: (order: OrderData) => void;
  saleReps?: string[];
}

export interface OrderColumnProps {
  order: OrderData;
  saleReps?: string[];
  onCustomerClick?: (order: OrderData) => void;
  onOrderInfoClick?: (order: OrderData) => void;
}

// ============================================
// CUSTOM ORDER TABLE TYPES
// ============================================

export interface CustomOrderTableModuleProps {
  orders: OrderData[];
  onOrderClick?: (order: OrderData) => void;
  onCustomerClick?: (order: OrderData) => void;
  staffList?: string[];
}

export interface CustomOrderColumnProps {
  order: OrderData;
  staffList?: string[];
  onCustomerClick?: (order: OrderData) => void;
  onOrderInfoClick?: (order: OrderData) => void;
}

// ============================================
// PRE-ORDER TABLE TYPES
// ============================================

export interface PreOrderTableModuleProps {
  orders: OrderData[];
  onOrderClick?: (order: OrderData) => void;
  onCustomerClick?: (order: OrderData) => void;
  staffList?: string[];
}

export interface PreOrderColumnProps {
  order: OrderData;
  staffList?: string[];
  onCustomerClick?: (order: OrderData) => void;
  onOrderInfoClick?: (order: OrderData) => void;
}

// ============================================
// RETURN WARRANTY TABLE TYPES
// ============================================

export interface ReturnWarrantyTableModuleProps {
  orders: OrderData[];
  onOrderClick?: (order: OrderData) => void;
  onCustomerClick?: (order: OrderData) => void;
  staffList?: string[];
}

export interface ReturnWarrantyColumnProps {
  order: OrderData;
  staffList?: string[];
  onCustomerClick?: (order: OrderData) => void;
  onOrderInfoClick?: (order: OrderData) => void;
}

// ============================================
// CUSTOMER SERVICE TABLE TYPES
// ============================================

export type { CustomerServiceTicket };

export interface CustomerServiceTableModuleProps {
  tickets: CustomerServiceTicket[];
  onTicketClick?: (ticket: CustomerServiceTicket) => void;
  onCustomerClick?: (ticket: CustomerServiceTicket) => void;
  onOrderClick?: (ticket: CustomerServiceTicket) => void;
  staffList?: string[];
}

export interface CustomerServiceColumnProps {
  ticket: CustomerServiceTicket;
  staffList?: string[];
  onCustomerClick?: (ticket: CustomerServiceTicket) => void;
  onTicketInfoClick?: (ticket: CustomerServiceTicket) => void;
  onOrderClick?: (ticket: CustomerServiceTicket) => void;
}

// ============================================
// CUSTOMER SERVICE BOARD HEADER TYPES
// ============================================

export interface CustomerServiceBoardHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
  onNewTicket?: () => void;
}

// ============================================
// CUSTOMER SERVICE BOARD FILTERS TYPES
// ============================================

export interface CustomerServiceFilterValues {
  statusFilter: string;
  priorityFilter: string;
  categoryFilter: string;
  assignedFilter: string;
  satisfactionFilter: string;
}

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export interface CustomerServiceBoardFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  ticketViewTab: "my" | "all";
  onTicketViewTabChange: (value: "my" | "all") => void;
  filterValues: CustomerServiceFilterValues;
  onFilterChange: (values: CustomerServiceFilterValues) => void;
  filterExpanded: boolean;
  onFilterExpandedChange: (expanded: boolean) => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  dateRangeLabel: string;
  onDateRangeLabelChange: (label: string) => void;
  dateRangeOpen: boolean;
  onDateRangeOpenChange: (open: boolean) => void;
  staffList?: string[];
}

// ============================================
// RE-ENGAGE BATCH TABLE TYPES
// ============================================

export type SortColumn = "name" | "assignedRep" | "batchSize" | "historicalValue" | "status" | "responseRate" | "conversionRate" | "createdDate";
export type SortDirection = "asc" | "desc" | null;

export interface FilterCounts {
  all: number;
  new: number;
  inProgress: number;
  assigned: number;
  done: number;
}

export interface ReengageBatchTableProps {
  batches: ReengageBatch[];
  selectedStatusFilter: string;
  selectedRepFilter: string;
  filterCounts: FilterCounts;
  onStatusFilterChange: (filter: string) => void;
  onRepFilterChange: (rep: string) => void;
  onBatchClick: (batch: ReengageBatch) => void;
  onStatusUpdate: (batchId: string, newStatus: ReengageBatch["status"]) => void;
  onRepUpdate: (batchId: string, newRep: string) => void;
  onNameEdit: (batch: ReengageBatch) => void;
}
