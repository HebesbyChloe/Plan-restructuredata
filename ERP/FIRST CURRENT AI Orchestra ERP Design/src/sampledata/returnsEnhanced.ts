// Enhanced Return Data Structure
// Links to: Orders, Shipments, Service Requests (Customer Service)

export interface ReturnItem {
  id: string;
  orderLineItemId: string;
  productId: string;
  sku: string;
  name: string;
  image?: string;
  quantityOrdered: number;
  quantityReturned: number;
  price: number;
  reason: string;
  condition: "new" | "opened" | "used" | "damaged" | "defective";
  restockable: boolean;
  refundAmount: number;
}

export interface ReturnEnhanced {
  id: string;
  returnNumber: string;
  // Order Reference
  orderId: string;
  orderNumber: string;
  orderDate: string;
  // Shipment Reference (if applicable)
  shipmentId?: string;
  shipmentNumber?: string;
  // Service Request Reference (if customer contacted support)
  serviceRequestId?: string;
  serviceTicketNumber?: string;
  // Customer Info
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  // Return Address (where customer is returning from)
  returnFromAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  // Return To Warehouse
  returnToWarehouse: "US" | "VN";
  returnToAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  // Return Items
  items: ReturnItem[];
  // Return Details
  returnReason: "defective" | "wrong-item" | "not-as-described" | "damaged-in-shipping" | "changed-mind" | "size-issue" | "other";
  returnType: "refund" | "exchange" | "store-credit";
  // Status
  status: "requested" | "rma-issued" | "shipped-back" | "in-transit" | "received" | "inspecting" | "approved" | "rejected" | "refunded" | "exchanged" | "completed" | "cancelled";
  processingStatus: "pending" | "reviewing" | "inspecting" | "processed" | "completed";
  refundStatus: "pending" | "approved" | "processing" | "refunded" | "rejected";
  // Return Shipping
  returnCarrier?: "USPS" | "UPS" | "FedEx" | "DHL" | "VN Post" | "Customer-Arranged";
  returnTrackingNumber?: string;
  returnTrackingUrl?: string;
  returnShippingCost: number;
  returnShippingPaidBy: "customer" | "company" | "split";
  returnLabelGenerated: boolean;
  // Financials
  totalRefundAmount: number;
  restockingFee: number;
  shippingRefund: number;
  finalRefundAmount: number;
  // Dates
  requestedDate: string;
  rmaIssuedDate?: string;
  customerShippedDate?: string;
  receivedAtWarehouseDate?: string;
  inspectionStartDate?: string;
  inspectionCompletedDate?: string;
  refundProcessedDate?: string;
  completedDate?: string;
  // Timeline
  expectedReturnDate?: string;
  returnDeadline?: string; // RMA expiration
  // Team
  requestedBy?: string; // CSR who initiated
  assignedTo?: string; // Who is handling the return
  inspectedBy?: string;
  approvedBy?: string;
  // Photos & Documentation
  customerPhotos?: string[];
  warehousePhotos?: string[];
  inspectionNotes?: string;
  // Actions
  replacementOrderId?: string; // If exchange
  replacementShipmentId?: string;
  // Notes
  customerNotes?: string;
  internalNotes?: string;
  rejectionReason?: string;
  // Priority
  priority: "low" | "normal" | "high" | "urgent";
  // Flags
  fraudSuspected: boolean;
  customerHistory: "first-return" | "repeat-returner" | "frequent-returner";
}

export const mockReturnsEnhanced: ReturnEnhanced[] = [
  {
    id: "RET-001",
    returnNumber: "RET-001",
    orderId: "ORD-001",
    orderNumber: "ORD-12345",
    orderDate: "2025-11-01T10:30:00",
    shipmentId: "SHP-001",
    shipmentNumber: "SHP-001",
    serviceRequestId: "SRQ-001",
    serviceTicketNumber: "TICKET-001",
    customerId: "CUST-001",
    customerName: "Sarah Johnson",
    customerEmail: "sarah.j@email.com",
    customerPhone: "+1-555-0123",
    returnFromAddress: {
      street: "123 Main Street, Apt 4B",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    returnToWarehouse: "US",
    returnToAddress: {
      street: "1000 Warehouse Blvd",
      city: "Newark",
      state: "NJ",
      zipCode: "07102",
      country: "USA",
    },
    items: [
      {
        id: "RETITEM-001",
        orderLineItemId: "LINE-001",
        productId: "1",
        sku: "JW-GLD-001",
        name: "Golden Lotus Bracelet",
        image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=200",
        quantityOrdered: 1,
        quantityReturned: 1,
        price: 79.99,
        reason: "Clasp is defective",
        condition: "defective",
        restockable: false,
        refundAmount: 79.99,
      },
    ],
    returnReason: "defective",
    returnType: "refund",
    status: "refunded",
    processingStatus: "completed",
    refundStatus: "refunded",
    returnCarrier: "UPS",
    returnTrackingNumber: "1Z999AA10987654321",
    returnTrackingUrl: "https://www.ups.com/track?tracknum=1Z999AA10987654321",
    returnShippingCost: 12.50,
    returnShippingPaidBy: "company",
    returnLabelGenerated: true,
    totalRefundAmount: 79.99,
    restockingFee: 0,
    shippingRefund: 12.50,
    finalRefundAmount: 92.49,
    requestedDate: "2025-11-05T14:30:00",
    rmaIssuedDate: "2025-11-05T15:00:00",
    customerShippedDate: "2025-11-06T10:00:00",
    receivedAtWarehouseDate: "2025-11-08T09:00:00",
    inspectionStartDate: "2025-11-08T10:00:00",
    inspectionCompletedDate: "2025-11-08T11:30:00",
    refundProcessedDate: "2025-11-08T14:00:00",
    completedDate: "2025-11-08T14:00:00",
    expectedReturnDate: "2025-11-08",
    returnDeadline: "2025-11-20T23:59:59",
    requestedBy: "Emma Support",
    assignedTo: "Tom Warehouse",
    inspectedBy: "Tom Warehouse",
    approvedBy: "Manager Jane",
    warehousePhotos: [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400",
    ],
    inspectionNotes: "Clasp mechanism is broken, not repairable. Item marked as defective and disposed of.",
    customerNotes: "The clasp broke after first wear. Very disappointed.",
    internalNotes: "Quality issue - escalate to supplier",
    priority: "high",
    fraudSuspected: false,
    customerHistory: "first-return",
  },
  {
    id: "RET-002",
    returnNumber: "RET-002",
    orderId: "ORD-002",
    orderNumber: "ORD-12346",
    orderDate: "2025-11-02T09:15:00",
    serviceRequestId: "SRQ-002",
    serviceTicketNumber: "TICKET-002",
    customerId: "CUST-002",
    customerName: "Michael Chen",
    customerEmail: "michael.c@email.com",
    customerPhone: "+1-555-0124",
    returnFromAddress: {
      street: "456 Oak Avenue",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001",
      country: "USA",
    },
    returnToWarehouse: "US",
    returnToAddress: {
      street: "1000 Warehouse Blvd",
      city: "Newark",
      state: "NJ",
      zipCode: "07102",
      country: "USA",
    },
    items: [
      {
        id: "RETITEM-002",
        orderLineItemId: "LINE-003",
        productId: "3",
        sku: "JW-RG-003",
        name: "Rose Quartz Ring",
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200",
        quantityOrdered: 1,
        quantityReturned: 1,
        price: 69.99,
        reason: "Wrong size",
        condition: "new",
        restockable: true,
        refundAmount: 0, // Exchange, not refund
      },
    ],
    returnReason: "size-issue",
    returnType: "exchange",
    status: "completed",
    processingStatus: "completed",
    refundStatus: "pending",
    returnCarrier: "USPS",
    returnTrackingNumber: "9400111899560987654321",
    returnShippingCost: 8.99,
    returnShippingPaidBy: "customer",
    returnLabelGenerated: true,
    totalRefundAmount: 0,
    restockingFee: 0,
    shippingRefund: 0,
    finalRefundAmount: 0,
    requestedDate: "2025-11-10T09:00:00",
    rmaIssuedDate: "2025-11-10T09:30:00",
    customerShippedDate: "2025-11-11T14:00:00",
    receivedAtWarehouseDate: "2025-11-13T10:00:00",
    inspectionStartDate: "2025-11-13T11:00:00",
    inspectionCompletedDate: "2025-11-13T11:15:00",
    completedDate: "2025-11-13T15:00:00",
    expectedReturnDate: "2025-11-13",
    returnDeadline: "2025-11-25T23:59:59",
    requestedBy: "Sarah Support",
    assignedTo: "Alice Warehouse",
    inspectedBy: "Alice Warehouse",
    approvedBy: "Manager Jane",
    warehousePhotos: [],
    inspectionNotes: "Ring is in perfect condition, original packaging intact. Approved for exchange.",
    customerNotes: "Ordered size 7 but need size 8",
    internalNotes: "Create replacement order for size 8",
    replacementOrderId: "ORD-12360",
    replacementShipmentId: "SHP-020",
    priority: "normal",
    fraudSuspected: false,
    customerHistory: "first-return",
  },
  {
    id: "RET-003",
    returnNumber: "RET-003",
    orderId: "ORD-010",
    orderNumber: "ORD-12354",
    orderDate: "2025-10-25T11:00:00",
    customerId: "CUST-010",
    customerName: "Patricia Davis",
    customerEmail: "patricia.d@email.com",
    customerPhone: "+1-555-0130",
    returnFromAddress: {
      street: "999 Highland Ave",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
      country: "USA",
    },
    returnToWarehouse: "US",
    returnToAddress: {
      street: "1000 Warehouse Blvd",
      city: "Newark",
      state: "NJ",
      zipCode: "07102",
      country: "USA",
    },
    items: [
      {
        id: "RETITEM-003",
        orderLineItemId: "LINE-011",
        productId: "10",
        sku: "JW-GLD-010",
        name: "Diamond Eternity Band",
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200",
        quantityOrdered: 1,
        quantityReturned: 1,
        price: 499.99,
        reason: "Changed mind after purchase",
        condition: "new",
        restockable: true,
        refundAmount: 499.99,
      },
    ],
    returnReason: "changed-mind",
    returnType: "refund",
    status: "inspecting",
    processingStatus: "inspecting",
    refundStatus: "pending",
    returnCarrier: "FedEx",
    returnTrackingNumber: "9611234567890987654321",
    returnShippingCost: 15.00,
    returnShippingPaidBy: "customer",
    returnLabelGenerated: false,
    totalRefundAmount: 499.99,
    restockingFee: 25.00, // 5% restocking fee for changed mind
    shippingRefund: 0,
    finalRefundAmount: 474.99,
    requestedDate: "2025-11-08T16:00:00",
    rmaIssuedDate: "2025-11-08T16:30:00",
    customerShippedDate: "2025-11-09T12:00:00",
    receivedAtWarehouseDate: "2025-11-12T09:30:00",
    inspectionStartDate: "2025-11-12T10:00:00",
    expectedReturnDate: "2025-11-12",
    returnDeadline: "2025-11-22T23:59:59",
    requestedBy: "Mark Support",
    assignedTo: "Tom Warehouse",
    inspectedBy: "Tom Warehouse",
    customerPhotos: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400",
    ],
    inspectionNotes: "Inspecting item condition and packaging",
    customerNotes: "Decided to go with a different style",
    internalNotes: "High-value item - thorough inspection required",
    priority: "high",
    fraudSuspected: false,
    customerHistory: "first-return",
  },
  {
    id: "RET-004",
    returnNumber: "RET-004",
    orderId: "ORD-011",
    orderNumber: "ORD-12355",
    orderDate: "2025-10-20T14:00:00",
    shipmentId: "SHP-015",
    shipmentNumber: "SHP-015",
    serviceRequestId: "SRQ-005",
    serviceTicketNumber: "TICKET-005",
    customerId: "CUST-011",
    customerName: "Kevin Taylor",
    customerEmail: "kevin.t@email.com",
    customerPhone: "+1-555-0131",
    returnFromAddress: {
      street: "777 Broadway",
      city: "Portland",
      state: "OR",
      zipCode: "97201",
      country: "USA",
    },
    returnToWarehouse: "US",
    returnToAddress: {
      street: "1000 Warehouse Blvd",
      city: "Newark",
      state: "NJ",
      zipCode: "07102",
      country: "USA",
    },
    items: [
      {
        id: "RETITEM-004",
        orderLineItemId: "LINE-012",
        productId: "2",
        sku: "JW-SLV-002",
        name: "Moonlight Pearl Necklace",
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200",
        quantityOrdered: 1,
        quantityReturned: 1,
        price: 129.99,
        reason: "Package arrived damaged",
        condition: "damaged",
        restockable: false,
        refundAmount: 129.99,
      },
    ],
    returnReason: "damaged-in-shipping",
    returnType: "refund",
    status: "received",
    processingStatus: "reviewing",
    refundStatus: "approved",
    returnCarrier: "UPS",
    returnTrackingNumber: "1Z999AA10111222333",
    returnShippingCost: 12.50,
    returnShippingPaidBy: "company",
    returnLabelGenerated: true,
    totalRefundAmount: 129.99,
    restockingFee: 0,
    shippingRefund: 0,
    finalRefundAmount: 129.99,
    requestedDate: "2025-11-02T10:00:00",
    rmaIssuedDate: "2025-11-02T10:15:00",
    customerShippedDate: "2025-11-03T09:00:00",
    receivedAtWarehouseDate: "2025-11-05T14:00:00",
    expectedReturnDate: "2025-11-05",
    returnDeadline: "2025-11-17T23:59:59",
    requestedBy: "Lisa Support",
    assignedTo: "Bob Warehouse",
    customerPhotos: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400",
    ],
    customerNotes: "Box was crushed, necklace clasp is broken",
    internalNotes: "Shipping damage - file claim with carrier",
    priority: "high",
    fraudSuspected: false,
    customerHistory: "first-return",
  },
  {
    id: "RET-005",
    returnNumber: "RET-005",
    orderId: "ORD-012",
    orderNumber: "ORD-12356",
    orderDate: "2025-10-15T09:30:00",
    serviceRequestId: "SRQ-006",
    serviceTicketNumber: "TICKET-006",
    customerId: "CUST-012",
    customerName: "Nancy White",
    customerEmail: "nancy.w@email.com",
    customerPhone: "+1-555-0132",
    returnFromAddress: {
      street: "555 Market Street",
      city: "Austin",
      state: "TX",
      zipCode: "78701",
      country: "USA",
    },
    returnToWarehouse: "US",
    returnToAddress: {
      street: "1000 Warehouse Blvd",
      city: "Newark",
      state: "NJ",
      zipCode: "07102",
      country: "USA",
    },
    items: [
      {
        id: "RETITEM-005",
        orderLineItemId: "LINE-013",
        productId: "15",
        sku: "JW-SLV-015",
        name: "Star Constellation Bracelet",
        image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=200",
        quantityOrdered: 1,
        quantityReturned: 1,
        price: 89.99,
        reason: "Received wrong item",
        condition: "new",
        restockable: true,
        refundAmount: 0,
      },
    ],
    returnReason: "wrong-item",
    returnType: "exchange",
    status: "rma-issued",
    processingStatus: "pending",
    refundStatus: "pending",
    returnCarrier: "USPS",
    returnShippingCost: 8.99,
    returnShippingPaidBy: "company",
    returnLabelGenerated: true,
    totalRefundAmount: 0,
    restockingFee: 0,
    shippingRefund: 0,
    finalRefundAmount: 0,
    requestedDate: "2025-11-11T13:00:00",
    rmaIssuedDate: "2025-11-11T13:30:00",
    expectedReturnDate: "2025-11-15",
    returnDeadline: "2025-11-26T23:59:59",
    requestedBy: "Emma Support",
    assignedTo: "Tom Warehouse",
    customerNotes: "Ordered constellation bracelet but received star necklace instead",
    internalNotes: "Picking error - send correct item immediately, prioritize",
    replacementOrderId: "ORD-12365",
    priority: "urgent",
    fraudSuspected: false,
    customerHistory: "first-return",
  },
  {
    id: "RET-006",
    returnNumber: "RET-006",
    orderId: "ORD-013",
    orderNumber: "ORD-12357",
    orderDate: "2025-10-28T16:00:00",
    customerId: "CUST-013",
    customerName: "Frank Harris",
    customerEmail: "frank.h@email.com",
    customerPhone: "+1-555-0133",
    returnFromAddress: {
      street: "333 Lake Shore Dr",
      city: "Chicago",
      state: "IL",
      zipCode: "60611",
      country: "USA",
    },
    returnToWarehouse: "US",
    returnToAddress: {
      street: "1000 Warehouse Blvd",
      city: "Newark",
      state: "NJ",
      zipCode: "07102",
      country: "USA",
    },
    items: [
      {
        id: "RETITEM-006",
        orderLineItemId: "LINE-014",
        productId: "20",
        sku: "JW-GLD-020",
        name: "Luxury Gold Chain",
        image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=200",
        quantityOrdered: 1,
        quantityReturned: 1,
        price: 359.99,
        reason: "Not as described on website",
        condition: "opened",
        restockable: true,
        refundAmount: 359.99,
      },
    ],
    returnReason: "not-as-described",
    returnType: "store-credit",
    status: "requested",
    processingStatus: "pending",
    refundStatus: "pending",
    returnShippingCost: 0,
    returnShippingPaidBy: "customer",
    returnLabelGenerated: false,
    totalRefundAmount: 359.99,
    restockingFee: 0,
    shippingRefund: 0,
    finalRefundAmount: 359.99,
    requestedDate: "2025-11-13T11:00:00",
    expectedReturnDate: "2025-11-18",
    returnDeadline: "2025-11-28T23:59:59",
    customerNotes: "Chain is thinner than shown in product photos",
    internalNotes: "Review product listing photos and description",
    priority: "normal",
    fraudSuspected: false,
    customerHistory: "repeat-returner",
  },
];

// Utility functions
export function getReturnsByOrder(orderId: string): ReturnEnhanced[] {
  return mockReturnsEnhanced.filter(r => r.orderId === orderId);
}

export function getReturnsByServiceRequest(serviceRequestId: string): ReturnEnhanced[] {
  return mockReturnsEnhanced.filter(r => r.serviceRequestId === serviceRequestId);
}

export function getReturnsByStatus(status: ReturnEnhanced["status"]): ReturnEnhanced[] {
  return mockReturnsEnhanced.filter(r => r.status === status);
}

export function getReturnsByCustomer(customerId: string): ReturnEnhanced[] {
  return mockReturnsEnhanced.filter(r => r.customerId === customerId);
}

export function getPendingReturns(): ReturnEnhanced[] {
  return mockReturnsEnhanced.filter(r => 
    r.status === "requested" || 
    r.status === "rma-issued" || 
    r.status === "shipped-back" || 
    r.status === "in-transit"
  );
}

export function getReturnsNeedingInspection(): ReturnEnhanced[] {
  return mockReturnsEnhanced.filter(r => 
    r.status === "received" || 
    r.status === "inspecting"
  );
}

export function getReturnsNeedingRefund(): ReturnEnhanced[] {
  return mockReturnsEnhanced.filter(r => 
    r.refundStatus === "approved" && 
    r.status !== "refunded" && 
    r.status !== "completed"
  );
}
