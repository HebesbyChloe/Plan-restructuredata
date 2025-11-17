/**
 * Logistics Module - Centralized Utils & Constants
 * All helpers, constants, and utility functions for Logistics modules
 */

// ============================================
// CONSTANTS - INBOUND SHIPMENTS
// ============================================

export const INBOUND_COLUMN_WIDTHS = {
  shipmentId: "w-[140px]",
  vendor: "w-[180px]",
  items: "w-[200px]",
  expectedDate: "w-[130px]",
  actualDate: "w-[130px]",
  status: "w-[130px]",
  value: "w-[120px]",
} as const;

export const INBOUND_STATUSES = [
  "In Transit",
  "Received",
  "Delayed",
  "Pending",
  "Cancelled",
] as const;

export const DEFAULT_VENDOR_LIST = [
  "Highland Brand",
  "Data Material",
  "Global Supplier Co.",
  "Premium Materials Ltd.",
  "Elite Supply Chain",
];

// ============================================
// CONSTANTS - OUTBOUND SHIPMENTS
// ============================================

export const OUTBOUND_COLUMN_WIDTHS = {
  shipmentId: "w-[140px]",
  destination: "w-[180px]",
  items: "w-[200px]",
  shippedDate: "w-[130px]",
  expectedDelivery: "w-[130px]",
  carrier: "w-[130px]",
  status: "w-[130px]",
} as const;

export const OUTBOUND_STATUSES = [
  "In Transit",
  "Delivered",
  "Delayed",
  "Processing",
  "Cancelled",
] as const;

export const DEFAULT_CARRIER_LIST = [
  "USPS",
  "UPS",
  "FedEx",
  "DHL",
  "Local Courier",
];

// ============================================
// CONSTANTS - VENDORS
// ============================================

export const VENDOR_COLUMN_WIDTHS = {
  vendorName: "w-[200px]",
  category: "w-[150px]",
  contact: "w-[180px]",
  activeOrders: "w-[120px]",
  totalSpent: "w-[130px]",
  rating: "w-[100px]",
  status: "w-[120px]",
} as const;

export const VENDOR_CATEGORIES = [
  "Materials",
  "Packaging",
  "Equipment",
  "Services",
  "Logistics",
  "Other",
] as const;

export const VENDOR_STATUSES = [
  "Active",
  "Inactive",
  "Pending",
  "Suspended",
] as const;

// ============================================
// CONSTANTS - PURCHASE ORDERS
// ============================================

export const PO_COLUMN_WIDTHS = {
  poNumber: "w-[140px]",
  vendor: "w-[180px]",
  items: "w-[200px]",
  orderDate: "w-[130px]",
  expectedDate: "w-[130px]",
  total: "w-[120px]",
  status: "w-[130px]",
} as const;

export const PO_STATUSES = [
  "Draft",
  "Pending Approval",
  "Approved",
  "Sent to Vendor",
  "In Transit",
  "Received",
  "Partially Received",
  "Cancelled",
] as const;

// ============================================
// HELPERS - GENERAL
// ============================================

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

export const calculateDaysUntil = (targetDate: string): number => {
  const today = new Date();
  const target = new Date(targetDate);
  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// ============================================
// HELPERS - INBOUND SHIPMENTS
// ============================================

export const getInboundStatusColor = (status: string): string => {
  switch (status) {
    case "In Transit":
      return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
    case "Received":
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
    case "Delayed":
      return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
    case "Pending":
      return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400";
    case "Cancelled":
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
};

// ============================================
// HELPERS - OUTBOUND SHIPMENTS
// ============================================

export const getOutboundStatusColor = (status: string): string => {
  switch (status) {
    case "In Transit":
      return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
    case "Delivered":
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
    case "Delayed":
      return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
    case "Processing":
      return "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400";
    case "Cancelled":
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
};

export const getCarrierColor = (carrier: string): string => {
  switch (carrier) {
    case "USPS":
      return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
    case "UPS":
      return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400";
    case "FedEx":
      return "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400";
    case "DHL":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
};

// ============================================
// HELPERS - VENDORS
// ============================================

export const getVendorStatusColor = (status: string): string => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
    case "Inactive":
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    case "Pending":
      return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400";
    case "Suspended":
      return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
};

export const getRatingStars = (rating: number): string => {
  return "★".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating));
};

// ============================================
// HELPERS - PURCHASE ORDERS
// ============================================

export const getPOStatusColor = (status: string): string => {
  switch (status) {
    case "Draft":
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    case "Pending Approval":
      return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400";
    case "Approved":
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
    case "Sent to Vendor":
      return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
    case "In Transit":
      return "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-400";
    case "Received":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400";
    case "Partially Received":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400";
    case "Cancelled":
      return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
};
