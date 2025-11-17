// Default staff list for return & warranty
export const DEFAULT_STAFF_LIST = ["Hai Lam", "Hang Tran", "Chuyet Vo", "Le My Nguyen"];

// Customer tier constants
export const CUSTOMER_TIERS = ["VVIP", "VIP", "Repeat", "New"] as const;

// Request Type Constants
export const REQUEST_TYPE = {
  RETURN: "Return",
  EXCHANGE: "Exchange",
  REPAIR: "Repair",
  WARRANTY: "Warranty",
  CANCEL_INQUIRY: "Cancel/Inquiry",
} as const;

export type RequestType = typeof REQUEST_TYPE[keyof typeof REQUEST_TYPE];

// Return & Warranty Status Constants
export const RETURN_WARRANTY_STATUS = {
  INQUIRY_START: "Inquiry Start",           // request created
  WAITING_CUSTOMER: "Waiting Customer",     // waiting info or shipment from customer
  CUSTOMER_SHIPPED: "Customer Shipped",     // customer sent item back
  WAREHOUSE_RECEIVED: "Warehouse Received", // item received & inspected
  PROCESSING: "Processing",                 // under repair / replacement / refund
  RETURNED_TO_CUSTOMER: "Returned to Customer", // replacement or repaired item shipped back
  COMPLETED: "Completed",                   // closed successfully
  ON_HOLD: "On Hold",                       // optional – pending or unclear case
} as const;

export type ReturnWarrantyStatus = typeof RETURN_WARRANTY_STATUS[keyof typeof RETURN_WARRANTY_STATUS];

// Legacy Reason constants (kept for backward compatibility)
export const RETURN_REASONS = ["Return", "Warranty", "Exchange"] as const;

// Legacy Status constants (kept for backward compatibility)
export const RETURN_STATUSES = ["Pending", "Processing", "Completed"] as const;

// Shipping status constants
export const SHIPPING_STATUSES = ["Not Yet", "Label Sent", "In Transit", "Received"] as const;

// Refund status constants
export const REFUND_STATUSES = ["Pending", "Processing", "Processed", "N/A"] as const;
