/**
 * Sample Data: Outbound Shipments
 * 
 * Contains sample data for outbound shipments to customers and destinations
 * Used in: OutboundShipmentPage (Logistics)
 */

export interface OutboundShipment {
  id: string;
  code: string;
  idCodeShip?: string;
  storage?: string;
  status: "Delivered" | "Shipped" | "Processing" | "Delayed" | "Pending";
  dateCreated: string;
  updateTime: string;
  shipDate: string;
  deliveryDate: string;
  tracking: string;
  estimatedDate: string;
  updatedBy: string;
  note?: string;
  products?: number;
  items?: number;
  destination?: string;
  carrier?: string;
}

export const mockOutboundShipments: OutboundShipment[] = [
  {
    id: "1",
    code: "VNIU500725",
    idCodeShip: "📦",
    storage: "Processing",
    status: "Processing",
    dateCreated: "Oct 3, 2025",
    updateTime: "-",
    shipDate: "-",
    deliveryDate: "-",
    tracking: "1ZVHU0SYV0SN0028L",
    estimatedDate: "Oct 15, 2025",
    updatedBy: "VN 0421 shipped",
    note: "",
    products: 3,
    items: 15,
    destination: "Main Warehouse",
    carrier: "UPS",
  },
  {
    id: "2",
    code: "VNIU500625",
    idCodeShip: "✅",
    storage: "Delivered",
    status: "Delivered",
    dateCreated: "Oct 4, 2025",
    updateTime: "Oct 7, 2025",
    shipDate: "Oct 5, 2025",
    deliveryDate: "Oct 8, 2025",
    tracking: "1ZVHW2SYV0SNTL",
    estimatedDate: "Oct 10, 2025",
    updatedBy: "VN 0027 shipped",
    note: "",
    products: 5,
    items: 25,
    destination: "Customer - NY",
    carrier: "FedEx",
  },
  {
    id: "3",
    code: "VNIU500325",
    idCodeShip: "🚚",
    storage: "Shipped",
    status: "Shipped",
    dateCreated: "Oct 3, 2025",
    updateTime: "Oct 6, 2025",
    shipDate: "Oct 6, 2025",
    deliveryDate: "-",
    tracking: "1ZVHW2SYV0SNS25",
    estimatedDate: "Oct 7, 2025",
    updatedBy: "-",
    note: "",
    products: 2,
    items: 8,
    destination: "Retail Store",
    carrier: "DHL",
  },
  {
    id: "4",
    code: "VNIU593025",
    idCodeShip: "📦",
    storage: "Processing",
    status: "Processing",
    dateCreated: "Sep 30, 2025",
    updateTime: "Oct 1, 2025",
    shipDate: "Oct 1, 2025",
    deliveryDate: "Oct 3, 2025",
    tracking: "1ZVHW2SYV0SH16C",
    estimatedDate: "Oct 4, 2025",
    updatedBy: "-",
    note: "",
    products: 4,
    items: 20,
    destination: "Distribution Center",
    carrier: "UPS",
  },
  {
    id: "5",
    code: "VNIU592825",
    idCodeShip: "⚠️",
    storage: "Delayed",
    status: "Delayed",
    dateCreated: "Sep 29, 2025",
    updateTime: "Sep 30, 2025",
    shipDate: "Sep 30, 2025",
    deliveryDate: "Oct 8, 2025",
    tracking: "1ZVHW2SYV0SN16C",
    estimatedDate: "Oct 3, 2025",
    updatedBy: "-",
    note: "Customs delay",
    products: 6,
    items: 30,
    destination: "International - AU",
    carrier: "FedEx",
  },
  {
    id: "6",
    code: "VNIU592625",
    idCodeShip: "⏳",
    storage: "Pending",
    status: "Pending",
    dateCreated: "Oct 5, 2025",
    updateTime: "-",
    shipDate: "-",
    deliveryDate: "-",
    tracking: "PENDING-001",
    estimatedDate: "Oct 12, 2025",
    updatedBy: "-",
    note: "Awaiting stock",
    products: 3,
    items: 12,
    destination: "Customer - CA",
    carrier: "USPS",
  },
  {
    id: "7",
    code: "VNIU590125",
    idCodeShip: "✅",
    storage: "Delivered",
    status: "Delivered",
    dateCreated: "Sep 28, 2025",
    updateTime: "Oct 2, 2025",
    shipDate: "Sep 29, 2025",
    deliveryDate: "Oct 2, 2025",
    tracking: "1ZVHW2SYV0ABCD",
    estimatedDate: "Oct 2, 2025",
    updatedBy: "VN 0023 shipped",
    note: "",
    products: 7,
    items: 35,
    destination: "Customer - TX",
    carrier: "UPS",
  },
  {
    id: "8",
    code: "VNIU589825",
    idCodeShip: "🚚",
    storage: "Shipped",
    status: "Shipped",
    dateCreated: "Oct 1, 2025",
    updateTime: "Oct 4, 2025",
    shipDate: "Oct 4, 2025",
    deliveryDate: "-",
    tracking: "1ZVHW2SYV0EFGH",
    estimatedDate: "Oct 9, 2025",
    updatedBy: "-",
    note: "",
    products: 4,
    items: 18,
    destination: "Customer - FL",
    carrier: "FedEx",
  },
];
