import { StatusProcessGroup } from "../utils/orderTableConstants";

export interface OrderData {
  id: string;
  orderNumber: string;
  amount: number;
  paidAmount?: number; // Optional: amount already paid
  dueAmount?: number; // Optional: amount still owed
  paymentBreakdown?: Array<{ // Optional: detailed payment breakdown
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
  orderType: "regular" | "pre-order" | "customize" | "return-warranty"; // Type of order for filtering
  alerts: {
    imageMissing?: boolean;
    customerNote?: boolean;
    addressMissing?: boolean;
    linkedOrders?: boolean;
    late?: number; // number of days late
    serviceRequest?: boolean;
    refundRequest?: boolean;
  };
  followUp: {
    tagColor: string;
    status: string;
    approvalStatus?: string; // Optional - some orders may not have approval status
  };
  statusProcess?: {
    group: StatusProcessGroup;
    currentStatus: string;
  };
  fulfillmentType?: "Tracking" | "Store Pickup" | "Manual Mark Shipped"; // Type of fulfillment
  tracking: Array<{
    trackingNumber: string;
    carrier: string;
    dateShipped: string;
    status: string;
  }>;
  customerService: {
    feedback?: string;
    socialReview?: {
      platform: string;
      rating: number;
      comment?: string;
    };
    reviewSources?: string[]; // Array of review sources: "Facebook", "Google", "Yelp", "UGC"
    csatStatus?: string; // "Love It", "Neutral", "No Respond", "Not Satisfied", "Complain"
  };
  // Pre-order specific fields
  preOrderDetails?: {
    reasonStatus?: string;
    productType?: string;
    preorderStatus?: string;
    vendor?: string;
    updatedBy?: string;
    updatedDate?: string;
    estDate?: string;
  };
  // Customize order specific fields
  customizeDetails?: {
    design3DStatus?: string;
    materialStatus?: string;
    productCompleteStatus?: string;
  };
  // Return & Warranty specific fields
  returnWarrantyDetails?: {
    returnType?: "Return" | "Warranty" | "Exchange" | "Repair" | "Cancel/Inquiry";
    requestType?: string;           // New: uses REQUEST_TYPE constants
    returnWarrantyStatus?: string;  // New: uses RETURN_WARRANTY_STATUS constants
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

export interface ColumnProps {
  order: OrderData;
  saleReps?: string[];
  onCustomerClick?: (order: OrderData) => void;
  onOrderInfoClick?: (order: OrderData) => void;
}
