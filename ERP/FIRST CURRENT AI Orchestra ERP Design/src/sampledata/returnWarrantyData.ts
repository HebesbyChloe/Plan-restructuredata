// Return & Warranty Board Sample Data

export interface ReturnWarrantyData {
  id: string;
  customer: {
    name: string;
    tier: string;
    assignedTo: string;
  };
  amount: number;
  orderDate: string;
  reason: string;
  status: string;
  shippingStatus: string;
  receivedDate: string;
  refundStatus: string;
  note: string;
  fulfillmentType?: "Tracking" | "Store Pickup" | "Manual Mark Shipped";
  tracking?: Array<{
    trackingNumber: string;
    carrier: string;
    dateShipped: string;
    status: string;
  }>;
  // New fields for simplified table structure
  requestType?: "Return" | "Warranty" | "Exchange";
  requestReason?: string;
  requestedBy?: string;
  returnShipmentStatus?: string;
  returnShipmentTracking?: string;
  shipmentDate?: string;
  carrier?: string;
  processingStatus?: string;
  processingUpdatedDate?: string;
  processingUpdatedBy?: string;
}

export const mockReturnWarrantyData: ReturnWarrantyData[] = [
  {
    id: "666021909B",
    customer: { name: "Ngoc Anh Ng...", tier: "VVIP", assignedTo: "Hai Lam" },
    amount: 380,
    orderDate: "Oct 09 2025",
    reason: "Return",
    status: "Pending",
    shippingStatus: "Not Yet",
    receivedDate: "",
    refundStatus: "Pending",
    note: "",
    fulfillmentType: "Store Pickup",
    requestType: "Return",
    requestReason: "Changed Mind",
    requestedBy: "Hai Lam",
    returnShipmentStatus: "Not Started",
    returnShipmentTracking: "—",
    shipmentDate: "—",
    carrier: "—",
    processingStatus: "Pending",
    processingUpdatedDate: "Oct 09",
    processingUpdatedBy: "Hai Lam"
  },
  {
    id: "555005155B",
    customer: { name: "Kim Vo", tier: "VIP", assignedTo: "Hang Tran" },
    amount: 360,
    orderDate: "Oct 08 2025",
    reason: "Warranty",
    status: "Processing",
    shippingStatus: "In Transit",
    receivedDate: "Oct 10 2025",
    refundStatus: "N/A",
    note: "",
    fulfillmentType: "Tracking",
    tracking: [
      {
        trackingNumber: "1Z999AA10123456789",
        carrier: "UPS",
        dateShipped: "Oct 09 2025",
        status: "In Transit"
      }
    ],
    requestType: "Warranty",
    requestReason: "Warranty Claim",
    requestedBy: "Hang Tran",
    returnShipmentStatus: "In Transit",
    returnShipmentTracking: "1Z999AA10123456789",
    shipmentDate: "Oct 09",
    carrier: "UPS",
    processingStatus: "Processing",
    processingUpdatedDate: "Oct 10",
    processingUpdatedBy: "Hang Tran"
  },
  {
    id: "555005154T",
    customer: { name: "Samson Pham", tier: "New", assignedTo: "Chuyet Vo" },
    amount: 699.99,
    orderDate: "Oct 08 2025",
    reason: "Exchange",
    status: "Completed",
    shippingStatus: "Received",
    receivedDate: "Oct 12 2025",
    refundStatus: "Processed",
    note: "",
    fulfillmentType: "Tracking",
    tracking: [
      {
        trackingNumber: "9400123456789012345679",
        carrier: "USPS",
        dateShipped: "Oct 10 2025",
        status: "Delivered"
      }
    ],
    requestType: "Exchange",
    requestReason: "Size Issue",
    requestedBy: "Chuyet Vo",
    returnShipmentStatus: "Received",
    returnShipmentTracking: "9400123456789012345679",
    shipmentDate: "Oct 10",
    carrier: "USPS",
    processingStatus: "Completed",
    processingUpdatedDate: "Oct 12",
    processingUpdatedBy: "Chuyet Vo"
  },
  {
    id: "666021907B",
    customer: { name: "Ngoc Anh Ng...", tier: "VVIP", assignedTo: "Hai Lam" },
    amount: 360,
    orderDate: "Oct 09 2025",
    reason: "Return",
    status: "Pending",
    shippingStatus: "Label Sent",
    receivedDate: "",
    refundStatus: "Pending",
    note: "",
    fulfillmentType: "Manual Mark Shipped",
    requestType: "Return",
    requestReason: "Defective",
    requestedBy: "Hai Lam",
    returnShipmentStatus: "Label Sent",
    returnShipmentTracking: "TRK-666021907B",
    shipmentDate: "Oct 09",
    carrier: "—",
    processingStatus: "Under Review",
    processingUpdatedDate: "Oct 09",
    processingUpdatedBy: "Hai Lam"
  },
  {
    id: "666021984S",
    customer: { name: "Thao Nguyen", tier: "Repeat", assignedTo: "Le My Nguyen" },
    amount: 1500,
    orderDate: "Oct 09 2025",
    reason: "Warranty",
    status: "Processing",
    shippingStatus: "Not Yet",
    receivedDate: "",
    refundStatus: "N/A",
    note: "",
    fulfillmentType: "Tracking",
    tracking: [
      {
        trackingNumber: "987654321012",
        carrier: "FedEx",
        dateShipped: "Oct 11 2025",
        status: "Processing"
      },
      {
        trackingNumber: "1234567890987",
        carrier: "DHL",
        dateShipped: "Oct 12 2025",
        status: "Label Created"
      }
    ],
    requestType: "Warranty",
    requestReason: "Damaged",
    requestedBy: "Le My Nguyen",
    returnShipmentStatus: "Label Created",
    returnShipmentTracking: "987654321012",
    shipmentDate: "Oct 11",
    carrier: "FedEx",
    processingStatus: "Processing",
    processingUpdatedDate: "Oct 11",
    processingUpdatedBy: "Le My Nguyen"
  },
];

export const RETURN_WARRANTY_STAFF = ["Hai Lam", "Hang Tran", "Chuyet Vo", "Le My Nguyen"];
