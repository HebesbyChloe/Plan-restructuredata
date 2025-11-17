/**
 * Orders Module - Centralized Utils & Constants
 * All helpers, constants, and utility functions for Orders modules
 */

// ============================================
// CONSTANTS
// ============================================

export const ORDER_STATUSES = [
  "Processing",
  "Partial Payment",
  "Completed",
  "Shipped",
  "In Transit",
  "Out for Delivery",
  "Shipping Delay",
  "Delivered",
  "Refunded",
  "Cancelled",
] as const;

export const PAYMENT_STATUSES = [
  "Paid",
  "Partial",
  "Unpaid",
  "Refunded",
] as const;

export const APPROVAL_STATUSES = [
  "Pending",
  "Approved",
  "Rejected",
  "Under Review",
] as const;

export const DESIGN_STATUSES = [
  "Pending",
  "In Progress",
  "Completed",
  "Approved",
  "Revision Needed",
] as const;

export const MATERIAL_SOURCES = [
  "Highland Brand",
  "Data Material",
  "Custom Source",
] as const;

// ============================================
// HELPERS
// ============================================

export const getOrderStatusColor = (status: string): string => {
  switch (status) {
    case "Completed":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400";
    case "Delivered":
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
    case "Processing":
      return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
    case "Partial Payment":
      return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400";
    case "Shipped":
      return "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-400";
    case "In Transit":
      return "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400";
    case "Out for Delivery":
      return "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-400";
    case "Shipping Delay":
      return "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400";
    case "Refunded":
    case "Cancelled":
      return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
};

export const getPaymentStatusColor = (status: string): string => {
  switch (status) {
    case "Paid":
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
    case "Partial":
      return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400";
    case "Unpaid":
      return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
    case "Refunded":
      return "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
};

export const getDesignStatusColor = (status: string): string => {
  switch (status) {
    case "Pending":
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    case "In Progress":
      return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
    case "Completed":
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
    case "Approved":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400";
    case "Revision Needed":
      return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
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
