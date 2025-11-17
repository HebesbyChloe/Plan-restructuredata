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
