/**
 * Return Shipments Enhanced Data
 * Maps return shipments to orders and original shipments
 */

export interface ReturnShipmentData {
  id: string;
  returnShipmentNumber: string;
  orderId: string;
  orderNumber: string;
  originalShipmentId?: string; // Reference to original shipment if applicable
  
  // Customer Info
  customerName: string;
  customerEmail: string;
  customerRank?: string;
  
  // Sales Rep Info
  salesRepName?: string;
  
  // Return Details
  returnType: "return" | "warranty" | "exchange" | "repair";
  returnReason: string;
  returnStatus: "pending" | "approved" | "rejected" | "received" | "inspected" | "refunded" | "completed";
  
  // Dates
  requestDate: string;
  approvalDate?: string;
  receivedDate?: string;
  processedDate?: string;
  
  // Shipment Tracking
  returnTrackingNumber?: string;
  returnCarrier?: string;
  returnShippingStatus?: "label-created" | "picked-up" | "in-transit" | "out-for-delivery" | "delivered" | "delay" | "on-hold";
  trackingStatusDate?: string; // Date when status was last updated
  trackingLabelCreatedDate?: string;
  trackingCreatedBy?: string; // "Customer" or sales rep name
  trackingCreatedByType?: "customer" | "sales-rep";
  
  // Refund/Processing
  refundStatus: "n/a" | "pending" | "approved" | "processed" | "completed" | "rejected";
  refundAmount?: number;
  restockFee?: number;
  
  // Condition & Inspection
  itemCondition?: "new" | "like-new" | "used" | "damaged" | "defective";
  inspectionNotes?: string;
  inspectionBy?: string;
  
  // Resolution
  resolutionType?: "refund" | "exchange" | "store-credit" | "repair";
  resolutionNotes?: string;
  
  // Items
  returnItems: {
    productId: string;
    sku: string;
    name: string;
    quantity: number;
    returnQuantity: number;
    price: number;
    image?: string;
  }[];
  
  // Assignment
  assignedTo?: string;
  department?: string;
  
  // Notes
  customerNote?: string;
  internalNote?: string;
  
  // Priority
  priority?: "low" | "normal" | "high" | "urgent";
  
  // Total
  totalAmount: number;
}

export const mockReturnShipmentsEnhanced: ReturnShipmentData[] = [
  {
    id: "ret-001",
    returnShipmentNumber: "RET-2025-001",
    orderId: "13",
    orderNumber: "555005171G",
    originalShipmentId: "ship-013",
    customerName: "Robert Johnson",
    customerEmail: "robert.j@email.com",
    customerRank: "Repeat",
    returnType: "warranty",
    returnReason: "Product defect - clasp broken",
    returnStatus: "completed",
    requestDate: "Oct 06 2025",
    approvalDate: "Oct 07 2025",
    receivedDate: "Oct 08 2025",
    processedDate: "Oct 10 2025",
    returnTrackingNumber: "1Z999AA10123456810",
    returnCarrier: "UPS",
    returnShippingStatus: "delivered",
    trackingStatusDate: "Oct 08 2025",
    trackingLabelCreatedDate: "Oct 06 2025",
    trackingCreatedBy: "Customer",
    trackingCreatedByType: "customer",
    refundStatus: "completed",
    refundAmount: 250.00,
    restockFee: 0,
    itemCondition: "defective",
    inspectionNotes: "Clasp mechanism broken, covered under warranty",
    inspectionBy: "Quality Team",
    resolutionType: "refund",
    resolutionNotes: "Full refund processed due to manufacturing defect",
    returnItems: [
      {
        productId: "prod-001",
        sku: "JW-GLD-001",
        name: "Golden Lotus Bracelet",
        quantity: 1,
        returnQuantity: 1,
        price: 250.00,
        image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=200",
      },
    ],
    assignedTo: "Michael Chen",
    department: "Returns & Warranty",
    customerNote: "The clasp broke after 2 weeks of normal wear",
    internalNote: "Warranty claim approved - manufacturing defect confirmed",
    priority: "normal",
    totalAmount: 250.00,
  },
  {
    id: "ret-002",
    returnShipmentNumber: "RET-2025-002",
    orderId: "16",
    orderNumber: "555005154T",
    originalShipmentId: "ship-016",
    customerName: "Samson Pham",
    customerEmail: "samson.pham@email.com",
    customerRank: "New",
    returnType: "exchange",
    returnReason: "Size Issue",
    returnStatus: "completed",
    requestDate: "Oct 08 2025",
    approvalDate: "Oct 08 2025",
    receivedDate: "Oct 12 2025",
    processedDate: "Oct 13 2025",
    returnTrackingNumber: "9400123456789012345680",
    returnCarrier: "USPS",
    returnShippingStatus: "delivered",
    trackingStatusDate: "Oct 12 2025",
    trackingLabelCreatedDate: "Oct 08 2025",
    trackingCreatedBy: "Chuyet Vo",
    trackingCreatedByType: "sales-rep",
    refundStatus: "n/a",
    itemCondition: "new",
    inspectionNotes: "Item in perfect condition, eligible for exchange",
    inspectionBy: "Returns Team",
    resolutionType: "exchange",
    resolutionNotes: "Exchanged for correct size",
    returnItems: [
      {
        productId: "prod-016",
        sku: "JW-RNG-016",
        name: "White Gold Wedding Band",
        quantity: 1,
        returnQuantity: 1,
        price: 699.99,
        image: "https://images.unsplash.com/photo-1611652022419-a9419f74343a?w=200",
      },
    ],
    assignedTo: "Chuyet Vo",
    department: "Returns & Warranty",
    customerNote: "Ring is too small, need size 8 instead of size 7",
    internalNote: "Exchange approved - size 8 shipped as replacement order",
    priority: "normal",
    totalAmount: 699.99,
  },
  {
    id: "ret-003",
    returnShipmentNumber: "RET-2025-003",
    orderId: "17",
    orderNumber: "666021907B",
    originalShipmentId: "ship-017",
    customerName: "Ngoc Anh Nguyen",
    customerEmail: "ngoc.anh@email.com",
    customerRank: "VVIP",
    returnType: "return",
    returnReason: "Color not as expected",
    returnStatus: "received",
    requestDate: "Oct 09 2025",
    approvalDate: "Oct 10 2025",
    receivedDate: "Oct 14 2025",
    returnTrackingNumber: "1Z999AA10123456811",
    returnCarrier: "UPS",
    returnShippingStatus: "in-transit",
    trackingStatusDate: "Oct 13 2025",
    trackingLabelCreatedDate: "Oct 10 2025",
    trackingCreatedBy: "Hai Lam",
    trackingCreatedByType: "sales-rep",
    refundStatus: "pending",
    refundAmount: 360.00,
    restockFee: 0,
    itemCondition: "like-new",
    inspectionNotes: "Item worn once, minor signs of use but acceptable",
    inspectionBy: "Quality Team",
    resolutionType: "refund",
    returnItems: [
      {
        productId: "prod-017",
        sku: "JW-EAR-017",
        name: "Rose Gold Hoop Earrings",
        quantity: 1,
        returnQuantity: 1,
        price: 360.00,
        image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=200",
      },
    ],
    assignedTo: "Hai Lam",
    department: "Returns & Warranty",
    customerNote: "The rose gold color appears more pink than expected from the photos",
    internalNote: "VIP customer - process refund quickly. Consider updating product photos",
    priority: "high",
    totalAmount: 360.00,
  },
  {
    id: "ret-004",
    returnShipmentNumber: "RET-2025-004",
    orderId: "15",
    orderNumber: "555005155B",
    originalShipmentId: "ship-015",
    customerName: "Kim Vo",
    customerEmail: "kim.vo@email.com",
    customerRank: "VIP",
    returnType: "warranty",
    returnReason: "Warranty Claim - Tarnishing",
    returnStatus: "inspected",
    requestDate: "Oct 08 2025",
    approvalDate: "Oct 09 2025",
    receivedDate: "Oct 10 2025",
    returnTrackingNumber: "1Z999AA10123456812",
    returnCarrier: "UPS",
    returnShippingStatus: "out-for-delivery",
    trackingStatusDate: "Oct 10 2025",
    trackingLabelCreatedDate: "Oct 09 2025",
    trackingCreatedBy: "Hang Tran",
    trackingCreatedByType: "sales-rep",
    refundStatus: "approved",
    refundAmount: 360.00,
    restockFee: 0,
    itemCondition: "used",
    inspectionNotes: "Silver tarnishing beyond normal wear - possible material issue",
    inspectionBy: "Quality Team",
    resolutionType: "refund",
    resolutionNotes: "Warranty claim approved - unusual tarnishing pattern",
    returnItems: [
      {
        productId: "prod-015",
        sku: "JW-BRC-015",
        name: "Silver Chain Bracelet",
        quantity: 1,
        returnQuantity: 1,
        price: 360.00,
        image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=200",
      },
    ],
    assignedTo: "Hang Tran",
    department: "Returns & Warranty",
    customerNote: "The bracelet started tarnishing after just one week",
    internalNote: "Check with supplier about silver quality for this batch",
    priority: "high",
    totalAmount: 360.00,
  },
  {
    id: "ret-005",
    returnShipmentNumber: "RET-2025-005",
    orderId: "5",
    orderNumber: "555005149A",
    customerName: "Emily Davis",
    customerEmail: "emily.davis@email.com",
    customerRank: "VIP",
    returnType: "return",
    returnReason: "Changed mind",
    returnStatus: "approved",
    requestDate: "Oct 15 2025",
    approvalDate: "Oct 16 2025",
    returnTrackingNumber: "1Z999AA10123456813",
    returnCarrier: "FedEx",
    returnShippingStatus: "picked-up",
    trackingStatusDate: "Oct 17 2025",
    trackingLabelCreatedDate: "Oct 16 2025",
    trackingCreatedBy: "Customer",
    trackingCreatedByType: "customer",
    refundStatus: "pending",
    refundAmount: 599.99,
    restockFee: 29.99,
    resolutionType: "refund",
    returnItems: [
      {
        productId: "prod-005",
        sku: "JW-DIA-005",
        name: "Diamond Stud Earrings",
        quantity: 1,
        returnQuantity: 1,
        price: 599.99,
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200",
      },
    ],
    assignedTo: "Sarah Park",
    department: "Returns & Warranty",
    customerNote: "Decided to go with a different style",
    internalNote: "Return within policy window - 5% restocking fee applied",
    priority: "normal",
    totalAmount: 599.99,
  },
  {
    id: "ret-006",
    returnShipmentNumber: "RET-2025-006",
    orderId: "8",
    orderNumber: "666021905C",
    customerName: "Anna Williams",
    customerEmail: "anna.w@email.com",
    customerRank: "Repeat",
    returnType: "repair",
    returnReason: "Stone loose in setting",
    returnStatus: "pending",
    requestDate: "Oct 16 2025",
    approvalDate: "Oct 16 2025",
    refundStatus: "n/a",
    resolutionType: "repair",
    returnItems: [
      {
        productId: "prod-008",
        sku: "JW-SAP-008",
        name: "Sapphire Pendant",
        quantity: 1,
        returnQuantity: 1,
        price: 520.00,
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200",
      },
    ],
    assignedTo: "Le My Nguyen",
    department: "Repairs",
    customerNote: "The center stone seems loose and I'm worried it will fall out",
    internalNote: "Priority repair - send to workshop for re-setting",
    priority: "urgent",
    totalAmount: 520.00,
  },
  {
    id: "ret-007",
    returnShipmentNumber: "RET-2025-007",
    orderId: "3",
    orderNumber: "555005147M",
    customerName: "Michael Brown",
    customerEmail: "michael.b@email.com",
    customerRank: "New",
    returnType: "return",
    returnReason: "Not as described",
    returnStatus: "rejected",
    requestDate: "Oct 18 2025",
    approvalDate: "Oct 19 2025",
    refundStatus: "rejected",
    itemCondition: "used",
    inspectionNotes: "Item shows significant wear beyond try-on. Photos provided show damaged packaging",
    inspectionBy: "Returns Manager",
    resolutionType: "refund",
    resolutionNotes: "Return rejected - item condition does not meet return policy standards",
    returnItems: [
      {
        productId: "prod-003",
        sku: "JW-EME-003",
        name: "Emerald Ring Set",
        quantity: 1,
        returnQuantity: 1,
        price: 450.00,
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200",
      },
    ],
    assignedTo: "Michael Chen",
    department: "Returns & Warranty",
    customerNote: "The emerald color is different from the website",
    internalNote: "Return rejected - item worn extensively. Customer contacted with explanation",
    priority: "normal",
    totalAmount: 450.00,
  },
  {
    id: "ret-008",
    returnShipmentNumber: "RET-2025-008",
    orderId: "10",
    orderNumber: "666021906A",
    customerName: "Jennifer Smith",
    customerEmail: "jennifer.s@email.com",
    customerRank: "VVIP",
    returnType: "exchange",
    returnReason: "Prefer different design",
    returnStatus: "received",
    requestDate: "Oct 17 2025",
    approvalDate: "Oct 17 2025",
    receivedDate: "Oct 20 2025",
    returnTrackingNumber: "1Z999AA10123456814",
    returnCarrier: "UPS",
    returnShippingStatus: "delay",
    trackingStatusDate: "Oct 19 2025",
    trackingLabelCreatedDate: "Oct 17 2025",
    trackingCreatedBy: "Hai Lam",
    trackingCreatedByType: "sales-rep",
    refundStatus: "n/a",
    itemCondition: "new",
    inspectionNotes: "Perfect condition, all original packaging intact",
    inspectionBy: "Quality Team",
    resolutionType: "exchange",
    resolutionNotes: "VVIP customer - processing expedited exchange",
    returnItems: [
      {
        productId: "prod-010",
        sku: "JW-PRL-010",
        name: "Pearl Cluster Earrings",
        quantity: 1,
        returnQuantity: 1,
        price: 310.00,
        image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=200",
      },
    ],
    assignedTo: "Hai Lam",
    department: "Returns & Warranty",
    customerNote: "Would like to exchange for the pearl drop earrings instead",
    internalNote: "VVIP - waive any price difference and expedite new shipment",
    priority: "urgent",
    totalAmount: 310.00,
  },
];

// Helper functions
export const getReturnsByStatus = (status: ReturnShipmentData["returnStatus"]) => {
  return mockReturnShipmentsEnhanced.filter((ret) => ret.returnStatus === status);
};

export const getReturnsByType = (type: ReturnShipmentData["returnType"]) => {
  return mockReturnShipmentsEnhanced.filter((ret) => ret.returnType === type);
};

export const getReturnsByPriority = (priority: ReturnShipmentData["priority"]) => {
  return mockReturnShipmentsEnhanced.filter((ret) => ret.priority === priority);
};

export const getPendingReturns = () => {
  return mockReturnShipmentsEnhanced.filter(
    (ret) => ret.returnStatus === "pending" || ret.returnStatus === "approved"
  );
};

export const getActiveReturns = () => {
  return mockReturnShipmentsEnhanced.filter(
    (ret) => ret.returnStatus !== "completed" && ret.returnStatus !== "rejected"
  );
};
