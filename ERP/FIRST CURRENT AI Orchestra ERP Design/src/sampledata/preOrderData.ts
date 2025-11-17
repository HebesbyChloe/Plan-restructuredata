// Pre-Order Board Sample Data

export interface PreOrderData {
  id: string;
  amount: number;
  staff: string;
  createdDate: string;
  reasonCategory: string;
  status: string;
  jewelry: string;
  estateSent: string;
  orderDate: string;
  updateDate: string;
  note: string;
  // New fields
  reasonStatus?: string;
  productType?: string;
  preorderStatus?: string;
  vendor?: string;
  saleRep?: string;
  orderStatus?: string;
  updatedBy?: string;
  updatedDate?: string;
  estDate?: string;
  fulfillmentType?: "Tracking" | "Store Pickup" | "Manual Mark Shipped";
  tracking?: Array<{
    trackingNumber: string;
    carrier: string;
    dateShipped: string;
    status: string;
  }>;
}

export const mockPreOrderData: PreOrderData[] = [
  {
    id: "555005156B",
    amount: 360,
    staff: "Hang Tran",
    createdDate: "Oct 08 2025",
    reasonCategory: "Pre Order",
    status: "Processing",
    jewelry: "Jewelry",
    estateSent: "Pending",
    orderDate: "November 9, 25",
    updateDate: "Oct 09 2025",
    note: "",
    reasonStatus: "Pre Order",
    productType: "Jewelry",
    preorderStatus: "US Processing",
    vendor: "Golden Gems Supply",
    saleRep: "Hang Tran",
    orderStatus: "Processing",
    updatedBy: "Hang Tran",
    updatedDate: "Oct 09 2025",
    estDate: "Nov 15 2025",
    fulfillmentType: "Tracking",
    tracking: [
      {
        trackingNumber: "1Z999AA10123456784",
        carrier: "UPS",
        dateShipped: "Oct 10 2025",
        status: "In Transit"
      }
    ]
  },
  {
    id: "555005159O",
    amount: 238,
    staff: "Ngoc Vo",
    createdDate: "Oct 08 2025",
    reasonCategory: "Pre Order",
    status: "Processing",
    jewelry: "Carool / Necklace",
    estateSent: "Pending",
    orderDate: "November 9, 25",
    updateDate: "Oct 09 2025",
    note: "",
    reasonStatus: "Out of Stock",
    productType: "Material: Charms / Stones",
    preorderStatus: "Supplier Sourcing",
    vendor: "Silver Star Materials",
    saleRep: "Ngoc Vo",
    orderStatus: "Pending Payment",
    updatedBy: "Ngoc Vo",
    updatedDate: "Oct 10 2025",
    estDate: "Nov 20 2025",
    fulfillmentType: "Store Pickup"
  },
  {
    id: "555005150Z",
    amount: 320,
    staff: "Hang Tran",
    createdDate: "Oct 07 2025",
    reasonCategory: "Pre Order",
    status: "Processing",
    jewelry: "Jewelry",
    estateSent: "VN Processing",
    orderDate: "October 8, 202",
    updateDate: "Oct 08 2025",
    note: "",
    reasonStatus: "Customize Order",
    productType: "Carved / Handcraft",
    preorderStatus: "VN Processing",
    vendor: "Jade Masters Workshop",
    saleRep: "Hang Tran",
    orderStatus: "Processing",
    updatedBy: "Hai Lam",
    updatedDate: "Oct 08 2025",
    estDate: "Nov 18 2025",
    fulfillmentType: "Manual Mark Shipped"
  },
  {
    id: "555005148Z",
    amount: 500,
    staff: "Hai Lam",
    createdDate: "Oct 07 2025",
    reasonCategory: "Pre Order",
    status: "Processing",
    jewelry: "Jewelry",
    estateSent: "VN Processing",
    orderDate: "October 8, 202",
    updateDate: "Oct 08 2025",
    note: "",
    reasonStatus: "Out of Material",
    productType: "Jewelry",
    preorderStatus: "Awaiting Batch",
    vendor: "Golden Gems Supply",
    saleRep: "Hai Lam",
    orderStatus: "On Hold",
    updatedBy: "Hai Lam",
    updatedDate: "Oct 11 2025",
    estDate: "Dec 01 2025",
    fulfillmentType: "Tracking",
    tracking: [
      {
        trackingNumber: "9400123456789012345678",
        carrier: "USPS",
        dateShipped: "Oct 09 2025",
        status: "Delivered"
      },
      {
        trackingNumber: "1234567890",
        carrier: "FedEx",
        dateShipped: "Oct 11 2025",
        status: "Processing"
      }
    ]
  },
  {
    id: "555005146S",
    amount: 335,
    staff: "Ngoc Vo",
    createdDate: "Oct 09 2025",
    reasonCategory: "Pre Order",
    status: "Processing",
    jewelry: "Jewelry",
    estateSent: "VN Processing",
    orderDate: "October 14, 202",
    updateDate: "Oct 09 2025",
    note: "",
    reasonStatus: "Pre Order",
    productType: "Others Products",
    preorderStatus: "Notify OOS",
    vendor: "Premium Pack Solutions",
    saleRep: "Laura Sale",
    orderStatus: "Ready to Ship",
    updatedBy: "Laura Sale",
    updatedDate: "Oct 12 2025",
    estDate: "Nov 10 2025"
  },
];

export const PRE_ORDER_STAFF = ["Hang Tran", "Ngoc Vo", "Hai Lam"];
