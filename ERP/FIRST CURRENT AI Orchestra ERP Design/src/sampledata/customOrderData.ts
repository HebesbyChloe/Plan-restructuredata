// Custom Order Board Sample Data

export interface CustomOrderData {
  id: string;
  customer: {
    name: string;
    tier: string;
    assignedTo: string;
  };
  amount: number;
  paymentPlan: string;
  createdDate: string;
  status: string;
  design3D: string;
  designDate: string;
  material: string;
  productComplete: string;
  processingTime: string;
  fulfillmentType?: "Tracking" | "Store Pickup" | "Manual Mark Shipped";
  tracking?: Array<{
    trackingNumber: string;
    carrier: string;
    dateShipped: string;
    status: string;
  }>;
}

export const mockCustomOrderData: CustomOrderData[] = [
  {
    id: "666021909B",
    customer: { name: "Ngoc Anh Ng...", tier: "VVIP", assignedTo: "Hai Lam" },
    amount: 380,
    paymentPlan: "$90,383.40",
    createdDate: "Oct 09 2025",
    status: "Processing",
    design3D: "",
    designDate: "",
    material: "Highland Brand",
    productComplete: "Ship Date",
    processingTime: "Data Chgd",
    fulfillmentType: "Store Pickup"
  },
  {
    id: "555005155B",
    customer: { name: "Kim Vo", tier: "VIP", assignedTo: "Hang Tran" },
    amount: 360,
    paymentPlan: "",
    createdDate: "Oct 08 2025",
    status: "Processing",
    design3D: "Date Design",
    designDate: "Requested",
    material: "Data Material",
    productComplete: "Ship Date",
    processingTime: "Data Chgd",
    fulfillmentType: "Tracking",
    tracking: [
      {
        trackingNumber: "1Z999AA10123456785",
        carrier: "UPS",
        dateShipped: "Oct 09 2025",
        status: "Out for Delivery"
      }
    ]
  },
  {
    id: "555005154T",
    customer: { name: "Samson Pham", tier: "New", assignedTo: "Chuyet Vo" },
    amount: 699.99,
    paymentPlan: "",
    createdDate: "Oct 08 2025",
    status: "Processing",
    design3D: "Design",
    designDate: "Requested",
    material: "Data Material",
    productComplete: "Ship Date",
    processingTime: "Data Chgd",
    fulfillmentType: "Manual Mark Shipped"
  },
  {
    id: "666021907B",
    customer: { name: "Ngoc Anh Ng...", tier: "VVIP", assignedTo: "Hai Lam" },
    amount: 360,
    paymentPlan: "",
    createdDate: "Oct 09 2025",
    status: "Processing",
    design3D: "Date Design",
    designDate: "Requested",
    material: "Highland Brand",
    productComplete: "Status",
    processingTime: "Status",
    fulfillmentType: "Tracking",
    tracking: [
      {
        trackingNumber: "9270120122345678901234",
        carrier: "USPS",
        dateShipped: "Oct 10 2025",
        status: "Delivered"
      },
      {
        trackingNumber: "987654321098",
        carrier: "FedEx",
        dateShipped: "Oct 11 2025",
        status: "In Transit"
      }
    ]
  },
  {
    id: "666021984S",
    customer: { name: "Thao Nguyen", tier: "Repeat", assignedTo: "Le My Nguyen" },
    amount: 1500,
    paymentPlan: "$90: $2840",
    createdDate: "Oct 09 2025",
    status: "Processing",
    design3D: "",
    designDate: "",
    material: "Highland Brand",
    productComplete: "Ship Date",
    processingTime: "Data Chgd"
  },
];

export const CUSTOM_ORDER_STAFF = ["Hai Lam", "Hang Tran", "Chuyet Vo", "Le My Nguyen"];
