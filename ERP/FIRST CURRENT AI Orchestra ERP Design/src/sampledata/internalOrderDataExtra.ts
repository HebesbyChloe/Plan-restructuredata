/**
 * Internal Order Data Extra
 * 
 * This file contains extended metadata for orders that is used internally
 * but not part of the main OrderData structure. This includes:
 * - Internal notes (staff-only notes with history)
 * - Order images (uploaded product/packaging images)
 * - Linked orders (related order numbers)
 * - Combined orders (orders that should be shipped together)
 * - Order flags and metadata
 */

export interface InternalNote {
  id: string;
  timestamp: string;
  date: string;
  time: string;
  user: string;
  userId: string;
  note: string;
  type?: "general" | "urgent" | "followup" | "escalation";
  isEdited?: boolean;
  editedAt?: string;
}

export interface OrderImage {
  id: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
  type: "product" | "packaging" | "damage" | "other";
  description?: string;
  thumbnail?: string;
}

export interface LinkedOrder {
  orderNumber: string;
  orderId: string;
  date: string;
  amount: number;
  status: string;
  linkType: "reorder" | "split" | "related" | "exchange" | "warranty";
  note?: string;
}

export interface CombinedOrder {
  orderNumber: string;
  orderId: string;
  customerName: string;
  amount: number;
  createdDate: string;
  status: string;
  reason: "customer_request" | "shipping_optimization" | "same_address" | "gift";
}

export interface InternalOrderDataExtra {
  orderId: string;
  orderNumber: string;
  
  // Internal Notes - Staff-only notes with full history
  internalNotes: InternalNote[];
  
  // Order Images - Uploaded product/packaging images
  orderImages: OrderImage[];
  
  // Linked Orders - Related orders (reorders, exchanges, warranties)
  linkedOrders: LinkedOrder[];
  
  // Combined Orders - Orders that should be shipped together
  combinedOrders?: CombinedOrder[];
  
  // Additional Metadata
  metadata: {
    // Order priority flag (not visible to customer)
    internalPriority?: "normal" | "high" | "urgent" | "vip";
    
    // Special handling instructions (staff-only)
    handlingInstructions?: string;
    
    // QC (Quality Control) flags
    qcRequired?: boolean;
    qcStatus?: "pending" | "passed" | "failed" | "not_required";
    qcNotes?: string;
    
    // Packaging preferences
    packagingType?: "standard" | "gift" | "fragile" | "discrete";
    
    // Internal tags (for organization/filtering)
    internalTags?: string[]; // e.g., ["rush", "vip_customer", "problematic", "high_value"]
    
    // Fraud check status
    fraudCheckStatus?: "pending" | "cleared" | "flagged" | "reviewing";
    fraudCheckNotes?: string;
    
    // Assignment history
    assignmentHistory?: Array<{
      timestamp: string;
      fromUser: string;
      toUser: string;
      reason?: string;
    }>;
    
    // Source tracking
    orderSource?: "website" | "phone" | "email" | "instagram" | "facebook" | "marketplace" | "in_store";
    referralSource?: string;
    
    // Custom fields for special order types
    customFields?: Record<string, any>;
  };
}

// Sample Data - Matched to orderBoardData.ts
export const INTERNAL_ORDER_DATA_EXTRA: InternalOrderDataExtra[] = [
  {
    orderId: "1",
    orderNumber: "666021905",
    internalNotes: [
      {
        id: "note-1",
        timestamp: "2025-10-11T09:30:00",
        date: "Oct 11, 2025",
        time: "9:30 AM",
        user: "Hang Tran",
        userId: "user-1",
        note: "Customer is a VIP. Very responsive to messages. Prefers Instagram DM communication.",
        type: "general",
      },
      {
        id: "note-2",
        timestamp: "2025-10-11T14:20:00",
        date: "Oct 11, 2025",
        time: "2:20 PM",
        user: "Hang Tran",
        userId: "user-1",
        note: "Customer requested store pickup. Confirmed pickup location and time window.",
        type: "general",
      },
      {
        id: "note-3",
        timestamp: "2025-10-11T16:15:00",
        date: "Oct 11, 2025",
        time: "4:15 PM",
        user: "Hang Tran",
        userId: "user-1",
        note: "Order assigned to batch for processing. Estimated completion: Oct 13.",
        type: "followup",
      },
    ],
    orderImages: [
      {
        id: "img-1",
        url: "https://images.unsplash.com/photo-1611652022419-a9419f74343a?w=400",
        uploadedBy: "Hang Tran",
        uploadedAt: "2025-10-11T09:45:00",
        type: "product",
        description: "Product photo - Customer's selected item",
      },
    ],
    linkedOrders: [],
    metadata: {
      internalPriority: "high",
      handlingInstructions: "VIP customer - ensure quality check before pickup notification",
      qcRequired: true,
      qcStatus: "pending",
      packagingType: "standard",
      internalTags: ["vip_customer", "store_pickup", "instagram_conversion"],
      fraudCheckStatus: "cleared",
      orderSource: "instagram",
      referralSource: "Instagram Story",
    },
  },
  {
    orderId: "2",
    orderNumber: "666021904",
    internalNotes: [
      {
        id: "note-4",
        timestamp: "2025-10-11T11:00:00",
        date: "Oct 11, 2025",
        time: "11:00 AM",
        user: "Ngoc Vo",
        userId: "user-2",
        note: "VVIP customer with partial payment. Pre-order item - vendor confirmed ETA Nov 15.",
        type: "general",
      },
      {
        id: "note-5",
        timestamp: "2025-10-11T15:45:00",
        date: "Oct 11, 2025",
        time: "3:45 PM",
        user: "Ngoc Vo",
        userId: "user-2",
        note: "URGENT: Missing shipping address and product image. Customer contacted for updates.",
        type: "urgent",
      },
      {
        id: "note-6",
        timestamp: "2025-10-11T17:30:00",
        date: "Oct 11, 2025",
        time: "5:30 PM",
        user: "Ngoc Vo",
        userId: "user-2",
        note: "Customer confirmed they will provide address when item arrives. Keeping them updated weekly.",
        type: "followup",
      },
    ],
    orderImages: [
      {
        id: "img-2a",
        url: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400",
        uploadedBy: "Ngoc Vo",
        uploadedAt: "2025-10-11T12:00:00",
        type: "product",
        description: "Vendor sample photo - pending final product",
      },
    ],
    linkedOrders: [],
    metadata: {
      internalPriority: "urgent",
      handlingInstructions: "Pre-order item. Keep customer updated weekly. Missing critical info.",
      qcRequired: true,
      qcStatus: "pending",
      packagingType: "standard",
      internalTags: ["vvip_customer", "pre_order", "missing_info", "partial_payment"],
      fraudCheckStatus: "cleared",
      orderSource: "instagram",
    },
  },
  {
    orderId: "3",
    orderNumber: "555005163A",
    internalNotes: [
      {
        id: "note-7",
        timestamp: "2025-10-11T09:15:00",
        date: "Oct 11, 2025",
        time: "9:15 AM",
        user: "Hai Lam",
        userId: "user-3",
        note: "Customize order - Design approved. Production started. Customer very excited!",
        type: "general",
      },
      {
        id: "note-8",
        timestamp: "2025-10-11T13:45:00",
        date: "Oct 11, 2025",
        time: "1:45 PM",
        user: "Hai Lam",
        userId: "user-3",
        note: "Production completed. QC passed. Sending tracking number to customer.",
        type: "followup",
      },
    ],
    orderImages: [
      {
        id: "img-2",
        url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400",
        uploadedBy: "Hai Lam",
        uploadedAt: "2025-10-11T10:30:00",
        type: "product",
        description: "3D design mockup - Approved by customer",
      },
      {
        id: "img-3",
        url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400",
        uploadedBy: "Hai Lam",
        uploadedAt: "2025-10-11T14:00:00",
        type: "product",
        description: "Final product - Ready to ship",
      },
    ],
    linkedOrders: [
      {
        orderNumber: "555005160A",
        orderId: "prev-order-1",
        date: "Sep 20, 2025",
        amount: 280.00,
        status: "Delivered",
        linkType: "reorder",
        note: "Previous custom order - customer loved it",
      },
    ],
    metadata: {
      internalPriority: "normal",
      handlingInstructions: "Custom product - handle with extra care during packaging",
      qcRequired: true,
      qcStatus: "passed",
      packagingType: "fragile",
      internalTags: ["custom_order", "vip_customer", "repeat_customer", "design_approved"],
      fraudCheckStatus: "cleared",
      orderSource: "facebook",
    },
  },
  {
    orderId: "4",
    orderNumber: "555005163S",
    internalNotes: [
      {
        id: "note-9",
        timestamp: "2025-10-03T10:30:00",
        date: "Oct 3, 2025",
        time: "10:30 AM",
        user: "Hoang My",
        userId: "user-4",
        note: "Order 7 days late. Customer not satisfied with delay. Offered compensation.",
        type: "escalation",
      },
      {
        id: "note-10",
        timestamp: "2025-10-03T16:30:00",
        date: "Oct 3, 2025",
        time: "4:30 PM",
        user: "Hoang My",
        userId: "user-4",
        note: "Split payment order - both payments complete. Shipped with tracking. Following up for feedback.",
        type: "followup",
      },
      {
        id: "note-11",
        timestamp: "2025-10-04T09:00:00",
        date: "Oct 4, 2025",
        time: "9:00 AM",
        user: "Hoang My",
        userId: "user-4",
        note: "URGENT: Customer still not responding. Need to reach out for satisfaction check.",
        type: "urgent",
      },
    ],
    orderImages: [
      {
        id: "img-4a",
        url: "https://images.unsplash.com/photo-1611652022419-a9419f74343a?w=400",
        uploadedBy: "Hoang My",
        uploadedAt: "2025-10-03T11:00:00",
        type: "product",
        description: "Order item - shipped with tracking",
      },
      {
        id: "img-4b",
        url: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400",
        uploadedBy: "Hoang My",
        uploadedAt: "2025-10-03T11:15:00",
        type: "packaging",
        description: "Package photo before shipping",
      },
    ],
    linkedOrders: [],
    metadata: {
      internalPriority: "high",
      handlingInstructions: "Customer complaint - offer 10% discount on next order if feedback requested",
      qcRequired: false,
      qcStatus: "not_required",
      packagingType: "standard",
      internalTags: ["late_order", "customer_complaint", "compensation_offered", "split_payment"],
      fraudCheckStatus: "cleared",
      orderSource: "website",
    },
  },
  {
    orderId: "5",
    orderNumber: "555005163Z",
    internalNotes: [
      {
        id: "note-12",
        timestamp: "2025-10-10T08:45:00",
        date: "Oct 10, 2025",
        time: "8:45 AM",
        user: "Laura Sale",
        userId: "user-5",
        note: "VVIP customer - 20+ previous orders. Excellent payment history. Priority handling.",
        type: "general",
      },
      {
        id: "note-13",
        timestamp: "2025-10-10T14:30:00",
        date: "Oct 10, 2025",
        time: "2:30 PM",
        user: "Laura Sale",
        userId: "user-5",
        note: "Customer waiting for custom engraving confirmation. Will update by EOD.",
        type: "followup",
      },
      {
        id: "note-14",
        timestamp: "2025-10-10T17:00:00",
        date: "Oct 10, 2025",
        time: "5:00 PM",
        user: "Laura Sale",
        userId: "user-5",
        note: "Engraving confirmed. Order out for delivery. Suggested cross-sell items for next purchase.",
        type: "followup",
      },
    ],
    orderImages: [
      {
        id: "img-4",
        url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400",
        uploadedBy: "Laura Sale",
        uploadedAt: "2025-10-10T09:00:00",
        type: "product",
        description: "Engraving mockup sent to customer for approval",
      },
    ],
    linkedOrders: [
      {
        orderNumber: "555005100Z",
        orderId: "prev-order-2",
        date: "Sep 15, 2025",
        amount: 389.00,
        status: "Delivered",
        linkType: "reorder",
        note: "Customer's previous order - very satisfied",
      },
      {
        orderNumber: "555005050Z",
        orderId: "prev-order-3",
        date: "Aug 10, 2025",
        amount: 520.00,
        status: "Delivered",
        linkType: "reorder",
        note: "Regular customer - buys monthly",
      },
    ],
    metadata: {
      internalPriority: "vip",
      handlingInstructions: "VVIP - Include thank you note and loyalty reward info. Suggest new collection.",
      qcRequired: true,
      qcStatus: "passed",
      packagingType: "gift",
      internalTags: ["vvip_customer", "high_value", "loyalty_member", "custom_engraving", "repeat_customer"],
      fraudCheckStatus: "cleared",
      orderSource: "email",
      referralSource: "Yelp Review",
      assignmentHistory: [
        {
          timestamp: "2025-10-10T08:45:00",
          fromUser: "Auto-assign",
          toUser: "Laura Sale",
          reason: "VVIP customer - assigned to senior rep",
        },
      ],
    },
  },
  {
    orderId: "6",
    orderNumber: "555005164A",
    internalNotes: [
      {
        id: "note-15",
        timestamp: "2025-10-10T09:00:00",
        date: "Oct 10, 2025",
        time: "9:00 AM",
        user: "Michael Chen",
        userId: "user-6",
        note: "New customer. Return request due to color dissatisfaction. Processing refund.",
        type: "general",
      },
      {
        id: "note-16",
        timestamp: "2025-10-10T13:45:00",
        date: "Oct 10, 2025",
        time: "1:45 PM",
        user: "Michael Chen",
        userId: "user-6",
        note: "URGENT: Customer complaint escalated. Offered full refund + 20% discount on future order.",
        type: "escalation",
      },
      {
        id: "note-17",
        timestamp: "2025-10-10T16:30:00",
        date: "Oct 10, 2025",
        time: "4:30 PM",
        user: "Michael Chen",
        userId: "user-6",
        note: "Return received. Refund processed. Need to win back customer - personal follow-up required.",
        type: "followup",
      },
    ],
    orderImages: [
      {
        id: "img-6a",
        url: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400",
        uploadedBy: "Michael Chen",
        uploadedAt: "2025-10-10T10:00:00",
        type: "damage",
        description: "Return item photo - color discrepancy documented",
      },
      {
        id: "img-6b",
        url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400",
        uploadedBy: "Michael Chen",
        uploadedAt: "2025-10-10T10:15:00",
        type: "product",
        description: "Original listing photo for comparison",
      },
    ],
    linkedOrders: [],
    metadata: {
      internalPriority: "high",
      handlingInstructions: "First time customer with bad experience - priority win-back campaign",
      qcRequired: true,
      qcStatus: "failed",
      qcNotes: "Product color not as advertised - need to update listing photos",
      packagingType: "standard",
      internalTags: ["return", "customer_complaint", "refund_processed", "win_back_needed", "new_customer"],
      fraudCheckStatus: "cleared",
      orderSource: "website",
    },
  },
  {
    orderId: "7",
    orderNumber: "555005165B",
    internalNotes: [
      {
        id: "note-18",
        timestamp: "2025-10-09T10:15:00",
        date: "Oct 9, 2025",
        time: "10:15 AM",
        user: "Sarah Park",
        userId: "user-7",
        note: "VVIP customer - split payment completed. High-value order. Premium packaging requested.",
        type: "general",
      },
      {
        id: "note-19",
        timestamp: "2025-10-09T15:00:00",
        date: "Oct 9, 2025",
        time: "3:00 PM",
        user: "Sarah Park",
        userId: "user-7",
        note: "QC passed. DHL expedited shipping. Customer loves our service - left excellent review!",
        type: "followup",
      },
    ],
    orderImages: [
      {
        id: "img-5",
        url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400",
        uploadedBy: "Sarah Park",
        uploadedAt: "2025-10-09T11:00:00",
        type: "product",
        description: "High-value items - certificate of authenticity included",
      },
      {
        id: "img-6",
        url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400",
        uploadedBy: "Sarah Park",
        uploadedAt: "2025-10-09T14:30:00",
        type: "packaging",
        description: "Premium gift packaging - ready for delivery",
      },
    ],
    linkedOrders: [],
    metadata: {
      internalPriority: "vip",
      handlingInstructions: "High-value VVIP order. Premium packaging. Include loyalty rewards.",
      qcRequired: true,
      qcStatus: "passed",
      packagingType: "gift",
      internalTags: ["vvip_customer", "high_value", "split_payment", "excellent_review", "premium_packaging"],
      fraudCheckStatus: "cleared",
      orderSource: "instagram",
    },
  },
  {
    orderId: "8",
    orderNumber: "555005166C",
    internalNotes: [
      {
        id: "note-20",
        timestamp: "2025-10-09T11:30:00",
        date: "Oct 9, 2025",
        time: "11:30 AM",
        user: "David Kim",
        userId: "user-8",
        note: "Service order - customer has special request. Warehouse received item for processing.",
        type: "general",
      },
      {
        id: "note-21",
        timestamp: "2025-10-09T14:00:00",
        date: "Oct 9, 2025",
        time: "2:00 PM",
        user: "David Kim",
        userId: "user-8",
        note: "Missing product images. Follow up with customer to provide photos for documentation.",
        type: "followup",
      },
    ],
    orderImages: [
      {
        id: "img-8a",
        url: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400",
        uploadedBy: "David Kim",
        uploadedAt: "2025-10-09T12:00:00",
        type: "other",
        description: "Service request documentation",
      },
    ],
    linkedOrders: [],
    metadata: {
      internalPriority: "normal",
      handlingInstructions: "Service order - manual shipment mark. Coordinate with warehouse team.",
      qcRequired: false,
      qcStatus: "not_required",
      packagingType: "standard",
      internalTags: ["service_order", "manual_mark_shipped", "repeat_customer"],
      fraudCheckStatus: "cleared",
      orderSource: "phone",
    },
  },
];

// Helper functions
export function getInternalDataByOrderId(orderId: string): InternalOrderDataExtra | undefined {
  return INTERNAL_ORDER_DATA_EXTRA.find(data => data.orderId === orderId);
}

export function getInternalDataByOrderNumber(orderNumber: string): InternalOrderDataExtra | undefined {
  return INTERNAL_ORDER_DATA_EXTRA.find(data => data.orderNumber === orderNumber);
}

export function getInternalNotesByOrderId(orderId: string): InternalNote[] {
  const data = getInternalDataByOrderId(orderId);
  return data?.internalNotes || [];
}

export function getOrderImagesByOrderId(orderId: string): OrderImage[] {
  const data = getInternalDataByOrderId(orderId);
  return data?.orderImages || [];
}

export function getLinkedOrdersByOrderId(orderId: string): LinkedOrder[] {
  const data = getInternalDataByOrderId(orderId);
  return data?.linkedOrders || [];
}

export function getCombinedOrdersByOrderId(orderId: string): CombinedOrder[] {
  const data = getInternalDataByOrderId(orderId);
  return data?.combinedOrders || [];
}

// Export for use in other modules
export default INTERNAL_ORDER_DATA_EXTRA;
