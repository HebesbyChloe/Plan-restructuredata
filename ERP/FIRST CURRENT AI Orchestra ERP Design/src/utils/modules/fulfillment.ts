/**
 * Fulfillment Module - Centralized Utils & Constants
 * All helpers, constants, and utility functions for Fulfillment modules
 */

// ============================================
// CONSTANTS - SHIPPING
// ============================================

export const SHIPPING_STATUSES = [
  "Processing",
  "Ready to Ship",
  "Shipped",
  "In Transit",
  "Out for Delivery",
  "Delivered",
  "Delayed",
  "Exception",
] as const;

export const CARRIERS = [
  "USPS",
  "UPS",
  "FedEx",
  "DHL",
  "Local Courier",
] as const;

export const WAREHOUSES = [
  "VN Warehouse",
  "US Warehouse",
  "UK Warehouse",
] as const;

// ============================================
// CONSTANTS - BATCHES
// ============================================

export const BATCH_STATUSES = [
  "Pending",
  "In Progress",
  "Ready to Ship",
  "Completed",
  "On Hold",
] as const;

export const BATCH_PRIORITIES = [
  "Low",
  "Normal",
  "High",
  "Urgent",
] as const;

// ============================================
// CONSTANTS - RETURNS
// ============================================

export const RETURN_STATUSES = [
  "Requested",
  "Approved",
  "Rejected",
  "In Transit",
  "Received",
  "Inspecting",
  "Processed",
  "Refunded",
  "Exchanged",
] as const;

export const RETURN_REASONS = [
  "Defective",
  "Wrong Item",
  "Not as Described",
  "Size Issue",
  "Color Issue",
  "Changed Mind",
  "Quality Issue",
  "Other",
] as const;

// ============================================
// CONSTANTS - AUTOMATION
// ============================================

export const AUTOMATION_TRIGGERS = [
  "Order Placed",
  "Payment Received",
  "Order Packed",
  "Ready to Ship",
  "Shipped",
  "Delivered",
  "Return Requested",
  "Low Stock",
] as const;

export const AUTOMATION_ACTIONS = [
  "Send Email",
  "Update Status",
  "Create Shipping Label",
  "Assign to Warehouse",
  "Create Batch",
  "Send Notification",
  "Update Inventory",
  "Create Task",
] as const;

// ============================================
// HELPERS - SHIPPING
// ============================================

export const getShippingStatusColor = (status: string): string => {
  switch (status) {
    case "Processing":
      return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
    case "Ready to Ship":
      return "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400";
    case "Shipped":
      return "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-400";
    case "In Transit":
      return "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400";
    case "Out for Delivery":
      return "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-400";
    case "Delivered":
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
    case "Delayed":
      return "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400";
    case "Exception":
      return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
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

export const getWarehouseColor = (warehouse: string): string => {
  switch (warehouse) {
    case "VN Warehouse":
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
    case "US Warehouse":
      return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
    case "UK Warehouse":
      return "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
};

// ============================================
// HELPERS - BATCHES
// ============================================

export const getBatchStatusColor = (status: string): string => {
  switch (status) {
    case "Pending":
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    case "In Progress":
      return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
    case "Ready to Ship":
      return "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400";
    case "Completed":
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
    case "On Hold":
      return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
};

export const getBatchPriorityColor = (priority: string): string => {
  switch (priority) {
    case "Low":
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    case "Normal":
      return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
    case "High":
      return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400";
    case "Urgent":
      return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
};

// ============================================
// HELPERS - RETURNS
// ============================================

export const getReturnStatusColor = (status: string): string => {
  switch (status) {
    case "Requested":
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    case "Approved":
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
    case "Rejected":
      return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
    case "In Transit":
      return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
    case "Received":
      return "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-400";
    case "Inspecting":
      return "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400";
    case "Processed":
      return "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-400";
    case "Refunded":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400";
    case "Exchanged":
      return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
};

export const getReturnReasonColor = (reason: string): string => {
  switch (reason) {
    case "Defective":
    case "Quality Issue":
      return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
    case "Wrong Item":
    case "Not as Described":
      return "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400";
    case "Size Issue":
    case "Color Issue":
      return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400";
    case "Changed Mind":
      return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
};

// ============================================
// HELPERS - AUTOMATION
// ============================================

export const getAutomationRuleStatusColor = (enabled: boolean): string => {
  return enabled
    ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
};

export const getConnectionStatusColor = (connected: boolean): string => {
  return connected
    ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
    : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
};

export const formatTimeSaved = (hours: number): string => {
  if (hours < 1) {
    return `${Math.round(hours * 60)} min`;
  }
  return `${hours.toFixed(1)} hrs`;
};

// ============================================
// HELPERS - AI SUGGESTIONS
// ============================================

export const getAISuggestion = (shipment: any): string | null => {
  // This is a placeholder - in real implementation would use AI model
  if (shipment.alerts?.late) {
    return "Expedite shipping to meet customer expectations";
  }
  if (shipment.warehouse === "VN Warehouse" && shipment.destination?.includes("US")) {
    return "Consider using US Warehouse for faster delivery";
  }
  if (shipment.carrier === "USPS" && shipment.value > 500) {
    return "Recommend upgrading to FedEx for high-value shipment";
  }
  return null;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
