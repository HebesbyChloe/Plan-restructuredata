/**
 * CRM Module - Centralized Utils & Constants
 * All helpers, constants, and utility functions for CRM modules
 */

import React from "react";
import {
  Smile,
  Meh,
  Frown,
  Clock,
  AlertCircle,
  MessageCircle,
  Facebook,
  Globe,
  Star,
  MessageSquare,
  Crown,
  Award,
  RefreshCw,
  UserPlus,
  Package,
  ShoppingCart,
  Wrench,
  Palette,
} from "lucide-react";
import { ReengageBatch } from "../../sampledata";
import { SortColumn, SortDirection } from "../../types/modules/crm";

// ============================================
// CONSTANTS - ORDER TABLE
// ============================================

export const DEFAULT_SALE_REPS = [
  "Hang Tran",
  "Ngoc Vo",
  "Hai Lam",
  "Hoang My",
  "Laura Sale",
  "Michael Chen",
  "Sarah Park",
  "David Kim",
  "Jennifer Lee",
  "Alex Johnson"
];

export const ORDER_STATUSES = [
  "Processing",
  "Shipped",
  "Delivered",
  "Canceled",
  "Refunded",
  "Partial Paid",
  "Ready to Ship",
  "On Hold",
  "Pending Payment"
];

export const PAYMENT_METHODS = [
  "Zelle",
  "Venmo",
  "Check",
  "Stripe",
  "Square",
  "Shopify Pay",
  "Klarna",
  "Afterpay",
  "Cash"
];

export const APPROVAL_STATUS = [
  "Pending Admin Review",
  "Under Review",
  "Approved",
  "Qualified",
  "Excellent",
  "Bad"
];

export const STATUS_ORDER_NEXT_ACTION = [
  "Follow up Processing",
  "Send Tracking",
  "Keep customer updated",
  "Ask for feedback",
  "Suggest cross sale",
  "Need win back"
];

export const REVIEW_SOURCE = [
  "Facebook",
  "Google",
  "Yelp",
  "UGC"
];

export const CSAT_STATUS = [
  "Love It",
  "Neutral",
  "No Respond",
  "Not Satisfied",
  "Complain"
];

export const TRACKING_STATUSES = [
  "Label Created",
  "Processing",
  "In Transit",
  "Out for Delivery",
  "Delivered",
  "Shipping Delay"
];

// Status Process Groups and their statuses
export const STATUS_PROCESS_GROUPS = {
  Regular: ["Assigned Batch", "Warehouse Transfer"],
  "Pre Ordered": ["Supplier Confirm", "Incoming", "Ready to Process", "Assign Batch"],
  "Service Order": ["Customer Shipped", "Warehouse Received", "Assign Batch"],
  Customize: ["Design Pending", "Design Approved", "Production Start", "In Transit", "Assign Batch"]
} as const;

export type StatusProcessGroup = keyof typeof STATUS_PROCESS_GROUPS;
export type StatusProcessStatus = typeof STATUS_PROCESS_GROUPS[StatusProcessGroup][number];

// Flatten all processing statuses for dropdown
export const ALL_PROCESSING_STATUSES = [
  ...STATUS_PROCESS_GROUPS.Regular,
  ...STATUS_PROCESS_GROUPS["Pre Ordered"],
  ...STATUS_PROCESS_GROUPS["Service Order"],
  ...STATUS_PROCESS_GROUPS.Customize,
].filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates

// ============================================
// CONSTANTS - CUSTOM ORDER TABLE
// ============================================

export const DEFAULT_STAFF_LIST = ["Hai Lam", "Hang Tran", "Chuyet Vo", "Le My Nguyen"];

export const CUSTOMER_TIERS = ["VVIP", "VIP", "Repeat", "New"] as const;

export const CUSTOM_ORDER_STATUSES = ["Processing", "Completed", "Pending"] as const;

export const MATERIAL_TYPES = ["Highland Brand", "Data Material"] as const;

// ============================================
// CONSTANTS - CUSTOMER SERVICE TABLE
// ============================================

export const SERVICE_STATUS = {
  Open: "Open",
  "In Progress": "In Progress",
  "Waiting on Customer": "Waiting on Customer",
  Resolved: "Resolved",
  Closed: "Closed",
} as const;

export const PRIORITY = {
  Low: "Low",
  Medium: "Medium",
  High: "High",
  Urgent: "Urgent",
} as const;

export const ISSUE_TYPE = {
  "Product Inquiry": "Product Inquiry",
  "Order Status": "Order Status",
  "Shipping Issue": "Shipping Issue",
  "Return/Refund": "Return/Refund",
  "Product Defect": "Product Defect",
  "Payment Issue": "Payment Issue",
  "Account Issue": "Account Issue",
  "Technical Support": "Technical Support",
  "General Question": "General Question",
  Other: "Other",
} as const;

export const CUSTOMER_TIER = {
  VVIP: "VVIP",
  VIP: "VIP",
  Repeat: "Repeat",
  New: "New",
} as const;

export const SATISFACTION = {
  "Love It": "positive",
  Neutral: "neutral",
  "Not Satisfied": "negative",
  Complain: "negative",
} as const;

// ============================================
// CONSTANTS - PRE-ORDER TABLE
// ============================================

export const PRODUCT_TYPES = [
  "Product Only",
  "Product + Charms",
  "Loose Bead - Multi Orders",
  "Loose Bead - Future Use",
];

export const REASON_STATUS = [
  "Material Shortage",
  "Bead Production",
  "Charm Production",
  "Partner Production",
];

export const PREORDER_STATUS = [
  "Not Yet",
  "Partial Receipt",
  "Full Received",
  "Readyment Sent",
  "Partial Sent",
  "Done",
];

export const VENDORS = [
  "Highland Brand",
  "Data Material",
  "Global Supplier",
  "Local Partner",
];

// ============================================
// CONSTANTS - RETURN WARRANTY TABLE
// ============================================

export const RETURN_WARRANTY_TYPES = [
  "Return",
  "Warranty",
  "Exchange",
  "Repair",
  "Cancel/Inquiry",
] as const;

export const REQUEST_TYPES = [
  "Defective Product",
  "Wrong Item",
  "Size Issue",
  "Color Issue",
  "Quality Issue",
  "Not as Described",
  "Changed Mind",
  "Other",
] as const;

export const RETURN_WARRANTY_STATUS = [
  "Pending Review",
  "Approved",
  "Rejected",
  "In Transit",
  "Received",
  "Processing",
  "Completed",
  "Refunded",
] as const;

// ============================================
// HELPERS - ORDER TABLE
// ============================================

export const getRankIcon = (rank: string) => {
  switch (rank) {
    case "VVIP":
      return <Crown className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
    case "VIP":
      return <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
    case "Repeat":
      return <RefreshCw className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    case "New":
      return <UserPlus className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
    default:
      return <UserPlus className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
  }
};

export const getRankColor = (rank: string) => {
  switch (rank) {
    case "VVIP":
      return "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950 dark:text-amber-400";
    case "VIP":
      return "bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-950 dark:text-purple-400";
    case "Repeat":
      return "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-950 dark:text-blue-400";
    case "New":
      return "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-400";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-400";
  }
};

export const getStatusColor = (status: string) => {
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
      return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
};

export const getTrackingStatusColor = (status: string) => {
  switch (status) {
    case "Delivered":
      return "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400";
    case "Processing":
      return "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400";
    case "In Transit":
      return "bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-400";
    case "Out for Delivery":
      return "bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-400";
    case "Label Created":
      return "bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-400";
    case "Shipping Delay":
      return "bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-400";
    default:
      return "bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-400";
  }
};

export const getApprovalColor = (status: string) => {
  switch (status) {
    case "Pending":
      return "bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-400 border-slate-300";
    case "Under Review":
      return "bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400 border-yellow-300";
    case "Approved":
    case "Qualified":
      return "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 border-green-300";
    case "Excellent":
      return "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-300";
    case "Bad":
      return "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 border-red-300";
    default:
      return "bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-400 border-gray-300";
  }
};

export const getCSATIcon = (status: string) => {
  switch (status) {
    case "Love It":
      return <Smile className="w-4 h-4 text-green-600 dark:text-green-400" />;
    case "Neutral":
      return <Meh className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
    case "No Respond":
      return <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
    case "Not Satisfied":
      return <Frown className="w-4 h-4 text-orange-600 dark:text-orange-400" />;
    case "Complain":
      return <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />;
    default:
      return <MessageCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
  }
};

export const getCSATColor = (status: string) => {
  const colors: { [key: string]: string } = {
    "Love It": "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
    "Neutral": "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400",
    "No Respond": "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
    "Not Satisfied": "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
    "Complain": "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  };
  return colors[status] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
};

export const getReviewSourceIcon = (source: string) => {
  switch (source) {
    case "Facebook":
      return <Facebook className="w-4 h-4" />;
    case "Google":
      return <Globe className="w-4 h-4" />;
    case "Yelp":
      return <Star className="w-4 h-4" />;
    case "UGC":
      return <MessageSquare className="w-4 h-4" />;
    default:
      return <MessageSquare className="w-4 h-4" />;
  }
};

export const getFollowUpStatusColor = (status: string) => {
  switch (status) {
    case "Follow up Processing":
      return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
    case "Send Tracking":
      return "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400";
    case "Keep customer updated":
      return "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-400";
    case "Ask for feedback":
      return "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-400";
    case "Suggest cross sale":
      return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400";
    case "Need win back":
      return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
};

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Failed to copy:", err);
    return false;
  }
};

export const getTrackingUrl = (carrier: string, trackingNumber: string): string => {
  const baseUrls: { [key: string]: string } = {
    USPS: "https://tools.usps.com/go/TrackConfirmAction?tLabels=",
    UPS: "https://www.ups.com/track?tracknum=",
    FedEx: "https://www.fedex.com/fedextrack/?trknbr=",
    DHL: "https://www.dhl.com/en/express/tracking.html?AWB=",
  };
  
  const baseUrl = baseUrls[carrier] || baseUrls.USPS;
  return `${baseUrl}${trackingNumber}`;
};

export const getStatusProcessColor = (group: string) => {
  switch (group) {
    case "Regular":
      return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
    case "Pre Ordered":
      return "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400";
    case "Service Order":
      return "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400";
    case "Customize":
      return "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
};

export const getStatusProcessIcon = (group: string) => {
  switch (group) {
    case "Regular":
      return <Package className="w-4 h-4" />;
    case "Pre Ordered":
      return <ShoppingCart className="w-4 h-4" />;
    case "Service Order":
      return <Wrench className="w-4 h-4" />;
    case "Customize":
      return <Palette className="w-4 h-4" />;
    default:
      return <Package className="w-4 h-4" />;
  }
};

// ============================================
// HELPERS - CUSTOM ORDER TABLE
// ============================================

export const getTierColor = (tier: string): string => {
  switch (tier) {
    case "VVIP":
      return "bg-gradient-to-r from-amber-400 to-yellow-500 text-white";
    case "VIP":
      return "bg-gradient-to-r from-purple-400 to-pink-500 text-white";
    case "Repeat":
      return "bg-gradient-to-r from-blue-400 to-cyan-500 text-white";
    case "New":
      return "bg-gradient-to-r from-gray-400 to-slate-500 text-white";
    default:
      return "bg-gray-400 text-white";
  }
};

export const getPaymentColor = (plan: string): string => {
  return plan.toLowerCase().includes("paid")
    ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
    : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400";
};

export const calculateDaysBetween = (startDateStr: string, endDateStr: string): number => {
  try {
    // Parse dates in format "MM/DD/YY"
    const [startMonth, startDay, startYear] = startDateStr.split("/").map(Number);
    const [endMonth, endDay, endYear] = endDateStr.split("/").map(Number);
    
    // Convert 2-digit year to 4-digit year
    const fullStartYear = startYear < 100 ? 2000 + startYear : startYear;
    const fullEndYear = endYear < 100 ? 2000 + endYear : endYear;
    
    const start = new Date(fullStartYear, startMonth - 1, startDay);
    const end = new Date(fullEndYear, endMonth - 1, endDay);
    
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  } catch (error) {
    console.error("Error calculating days between dates:", error);
    return 0;
  }
};

export const formatDaysDisplay = (days: number): string => {
  if (days === 0) return "Today";
  if (days === 1) return "1 day";
  if (days > 0) return `${days} days`;
  if (days === -1) return "-1 day";
  return `${days} days`;
};

// ============================================
// HELPERS - CUSTOMER SERVICE TABLE
// ============================================

export const getServiceStatusVariant = (status: string) => {
  switch (status) {
    case "Open":
      return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
    case "In Progress":
      return "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400";
    case "Waiting on Customer":
      return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400";
    case "Resolved":
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
    case "Closed":
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
};

export const getPriorityVariant = (priority: string) => {
  switch (priority) {
    case "Urgent":
      return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
    case "High":
      return "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400";
    case "Medium":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400";
    case "Low":
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
};

export const getAlertDayBadgeVariant = (days: number, isResolved: boolean) => {
  if (isResolved) {
    return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
  }
  
  if (days <= 1) {
    return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
  } else if (days <= 3) {
    return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400";
  } else {
    return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
  }
};

export const calculateDaysSinceOpened = (createdDate: string, lastUpdate?: string, isResolved?: boolean): number => {
  const referenceDate = isResolved && lastUpdate ? new Date(lastUpdate) : new Date();
  const created = new Date(createdDate);
  const diffTime = Math.abs(referenceDate.getTime() - created.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const formatDaysSinceOpened = (days: number): string => {
  if (days === 0) return "Today";
  if (days === 1) return "1d";
  return `${days}d`;
};

// ============================================
// HELPERS - RE-ENGAGE BATCH TABLE
// ============================================

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getBatchStatusColor = (status: string): string => {
  switch (status) {
    case "new":
      return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
    case "in-progress":
      return "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400";
    case "assigned":
      return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400";
    case "done":
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
};

// Re-engage batch sorting
export const sortBatches = <T extends Record<string, any>>(
  batches: T[],
  sortColumn: string | null,
  sortDirection: "asc" | "desc" | null
): T[] => {
  if (!sortColumn || !sortDirection) return batches;

  return [...batches].sort((a, b) => {
    let aValue = a[sortColumn];
    let bValue = b[sortColumn];

    // Handle different data types
    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });
};

// ============================================
// CONSTANTS - PRE-ORDER TABLE
// ============================================

export const PRE_ORDER_STAFF_LIST = ["Hang Tran", "Ngoc Vo", "Hai Lam"];

export const PRE_ORDER_PRODUCT_TYPES = [
  "Jewelry",
  "Material: Charms / Stones",
  "Others Products",
  "Carved / Handcraft"
] as const;

export const PRE_ORDER_REASON_STATUS = [
  "Out of Stock",
  "Out of Material",
  "Customize Order",
  "Pre Order"
] as const;

export const PRE_ORDER_STATUS_OPTIONS = [
  "Pending",
  "US Processing",
  "VN Processing",
  "Notify OOS",
  "Model Change",
  "Awaiting Batch",
  "Supplier Sourcing"
] as const;

export const PRE_ORDER_VENDORS = [
  "Golden Gems Supply",
  "Silver Star Materials",
  "Premium Pack Solutions",
  "Express Logistics VN",
  "Jade Masters Workshop",
  "Crystal Clear Stones"
] as const;

// Legacy constants (kept for backward compatibility)
export const PRE_ORDER_STATUSES = ["Processing", "Completed"] as const;
export const ESTATE_SENT_STATUSES = ["Pending", "VN Processing", "Completed"] as const;
export const REASON_CATEGORIES = ["Pre Order", "Custom"] as const;

// ============================================
// HELPERS - PRE-ORDER TABLE
// ============================================

export const getPreOrderStatusColor = (status: string): string => {
  switch (status) {
    case "Processing":
      return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400";
    case "Completed":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
};

export const getEstateColor = (estate: string): string => {
  switch (estate) {
    case "Pre Order":
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
    case "VN Processing":
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
    case "Pending":
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
};

export const getReasonCategoryColor = (category: string): string => {
  switch (category) {
    case "Pre Order":
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
    case "Custom":
      return "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
};

// ============================================
// HELPERS - RE-ENGAGE BATCH TABLE
// ============================================

export const getReengageBatchStatusColor = (status: string) => {
  switch (status) {
    case "New":
      return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300";
    case "In Progress":
      return "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";
    case "Done":
      return "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400";
    case "Assigned":
      return "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
    default:
      return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300";
  }
};

export const formatReengageCurrency = (value: number): string => {
  return `$${value.toLocaleString()}`;
};

export const formatReengageDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// ============================================
// SORTING - RE-ENGAGE BATCH TABLE
// ============================================

export const sortReengageBatches = (
  batches: ReengageBatch[],
  sortColumn: SortColumn | null,
  sortDirection: SortDirection
): ReengageBatch[] => {
  if (!sortColumn || !sortDirection) return batches;

  return [...batches].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortColumn) {
      case "name":
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case "assignedRep":
        aValue = a.assignedRep.toLowerCase();
        bValue = b.assignedRep.toLowerCase();
        break;
      case "batchSize":
        aValue = a.batchSize;
        bValue = b.batchSize;
        break;
      case "historicalValue":
        aValue = a.historicalValue;
        bValue = b.historicalValue;
        break;
      case "status":
        aValue = a.status.toLowerCase();
        bValue = b.status.toLowerCase();
        break;
      case "responseRate":
        aValue = a.responseRate;
        bValue = b.responseRate;
        break;
      case "conversionRate":
        aValue = a.conversionRate;
        bValue = b.conversionRate;
        break;
      case "createdDate":
        aValue = new Date(a.createdDate).getTime();
        bValue = new Date(b.createdDate).getTime();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });
};

