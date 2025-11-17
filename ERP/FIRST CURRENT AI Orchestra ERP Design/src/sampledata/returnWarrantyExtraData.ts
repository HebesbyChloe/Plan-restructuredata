// Return & Warranty Extra Data - mapped by order number
// This file contains additional fields specific to return and warranty orders
// Maps to orders with orderType: "return-warranty" in orderBoardData.ts

export interface ReturnWarrantyExtra {
  orderNumber: string;
  requestType: string;              // Type of request: Return, Exchange, Repair, Warranty, Cancel/Inquiry
  returnWarrantyStatus: string;     // Main status tracking
  returnShipmentStatus: string;     // Shipment tracking status
  returnShipmentTracking: string;   // Tracking number
  refundStatus: string;             // Refund/payment status
  completedDate?: string;           // Date when status became Completed (format: "Oct 11, 2025")
}

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
  LABEL_CREATED: "Label Created",           // return label generated for customer
  CUSTOMER_SHIPPED: "Customer Shipped",     // customer sent item back
  WAREHOUSE_RECEIVED: "Warehouse Received", // item received & inspected
  RECEIVED_BUT_DAMAGED: "Received but Damaged", // item received but damaged during return shipment
  PROCESSING: "Processing",                 // under repair / replacement / refund
  RETURNED_TO_CUSTOMER: "Returned to Customer", // replacement or repaired item shipped back
  COMPLETED: "Completed",                   // closed successfully
  ON_HOLD: "On Hold",                       // optional – pending or unclear case
} as const;

export type ReturnWarrantyStatus = typeof RETURN_WARRANTY_STATUS[keyof typeof RETURN_WARRANTY_STATUS];

// Constants for Return Shipment Status Fields
export const RETURN_SHIPMENT_STATUS = {
  NOT_STARTED: "Not Started",
  LABEL_CREATED: "Label Created",
  LABEL_SENT: "Label Sent",
  IN_TRANSIT: "In Transit",
  RECEIVED: "Received",
  PROCESSING: "Processing",
  COMPLETED: "Completed",
} as const;

// Refund Status Constants
export const REFUND_STATUS = {
  NOT_APPLICABLE: "N/A",
  PENDING_REFUND: "Pending Refund",
  APPROVED: "Approved",
  PROCESSING: "Processing",
  COMPLETED: "Completed",
  REJECTED: "Rejected",
  PARTIAL_REFUND: "Partial Refund",
} as const;

// Sample data mapped by order number
export const returnWarrantyExtraData: ReturnWarrantyExtra[] = [
  {
    orderNumber: "555005164A",
    requestType: REQUEST_TYPE.RETURN,
    returnWarrantyStatus: RETURN_WARRANTY_STATUS.WAREHOUSE_RECEIVED,
    returnShipmentStatus: RETURN_SHIPMENT_STATUS.RECEIVED,
    returnShipmentTracking: "TRK-RET-987654321",
    refundStatus: REFUND_STATUS.PENDING_REFUND,
  },
  {
    orderNumber: "555005171G",
    requestType: REQUEST_TYPE.WARRANTY,
    returnWarrantyStatus: RETURN_WARRANTY_STATUS.COMPLETED,
    returnShipmentStatus: RETURN_SHIPMENT_STATUS.COMPLETED,
    returnShipmentTracking: "TRK-RET-123456789",
    refundStatus: REFUND_STATUS.COMPLETED,
    completedDate: "Oct 20, 2025",
  },
  {
    orderNumber: "666021909B",
    requestType: REQUEST_TYPE.RETURN,
    returnWarrantyStatus: RETURN_WARRANTY_STATUS.INQUIRY_START,
    returnShipmentStatus: RETURN_SHIPMENT_STATUS.NOT_STARTED,
    returnShipmentTracking: "",
    refundStatus: REFUND_STATUS.PENDING_REFUND,
  },
  {
    orderNumber: "555005155B",
    requestType: REQUEST_TYPE.WARRANTY,
    returnWarrantyStatus: RETURN_WARRANTY_STATUS.CUSTOMER_SHIPPED,
    returnShipmentStatus: RETURN_SHIPMENT_STATUS.IN_TRANSIT,
    returnShipmentTracking: "TRK-RET-555005155B",
    refundStatus: REFUND_STATUS.NOT_APPLICABLE,
  },
  {
    orderNumber: "555005154T",
    requestType: REQUEST_TYPE.EXCHANGE,
    returnWarrantyStatus: RETURN_WARRANTY_STATUS.PROCESSING,
    returnShipmentStatus: RETURN_SHIPMENT_STATUS.RECEIVED,
    returnShipmentTracking: "TRK-RET-555005154T",
    refundStatus: REFUND_STATUS.PROCESSING,
  },
  {
    orderNumber: "666021907B",
    requestType: REQUEST_TYPE.RETURN,
    returnWarrantyStatus: RETURN_WARRANTY_STATUS.WAITING_CUSTOMER,
    returnShipmentStatus: RETURN_SHIPMENT_STATUS.LABEL_SENT,
    returnShipmentTracking: "TRK-RET-666021907B",
    refundStatus: REFUND_STATUS.PENDING_REFUND,
  },
  {
    orderNumber: "666021984S",
    requestType: REQUEST_TYPE.REPAIR,
    returnWarrantyStatus: RETURN_WARRANTY_STATUS.INQUIRY_START,
    returnShipmentStatus: RETURN_SHIPMENT_STATUS.NOT_STARTED,
    returnShipmentTracking: "",
    refundStatus: REFUND_STATUS.NOT_APPLICABLE,
  },
];

// Helper function to get return/warranty extra data by order number
export const getReturnWarrantyExtraByOrderNumber = (
  orderNumber: string
): ReturnWarrantyExtra | undefined => {
  return returnWarrantyExtraData.find(
    (extra) => extra.orderNumber === orderNumber
  );
};

// Helper function to check if order number has return/warranty extra data
export const hasReturnWarrantyExtra = (orderNumber: string): boolean => {
  return returnWarrantyExtraData.some(
    (extra) => extra.orderNumber === orderNumber
  );
};
