/**
 * Sample Data: Inbound Shipments
 * 
 * Contains sample data for inbound shipments from vendors/suppliers
 * Used in: InboundShipmentPage (Logistics)
 */

export interface InboundShipment {
  id: string;
  code: string;
  poNumber?: string;
  vendor?: string;
  location: "Internal Hub" | "Outbound" | "Warehouse A" | "Warehouse B";
  status: "Complete" | "Incoming" | "Processing" | "Delayed";
  products: number;
  items: number;
  tracking: string;
  estimatedDate: string;
  updateDate: string;
  note?: string;
}

export const mockInboundShipments: InboundShipment[] = [
  {
    id: "1",
    code: "VNID07235016",
    poNumber: "PO-2025-0734",
    vendor: "Vietnam Supplier Co.",
    location: "Internal Hub",
    status: "Complete",
    products: 7,
    items: 39,
    tracking: "VN-1007",
    estimatedDate: "October 3, 2025",
    updateDate: "Oct 08 2025",
  },
  {
    id: "2",
    code: "USID09735033",
    poNumber: "PO-2025-0812",
    vendor: "US Gemstone Inc.",
    location: "Outbound",
    status: "Complete",
    products: 21,
    items: 26,
    tracking: "IZNB4K8W6H6907399",
    estimatedDate: "October 10, 2025",
    updateDate: "Oct 09 2025",
  },
  {
    id: "3",
    code: "USID06230215",
    poNumber: "PO-2025-0789",
    vendor: "Diamond Direct LLC",
    location: "Outbound",
    status: "Incoming",
    products: 23,
    items: 93,
    tracking: "IZAN5N4XH68803788",
    estimatedDate: "October 7, 2025",
    updateDate: "Oct 06 2025",
  },
  {
    id: "4",
    code: "VNID04223442",
    poNumber: "PO-2025-0701",
    vendor: "Vietnam Jewelry Co.",
    location: "Internal Hub",
    status: "Complete",
    products: 5,
    items: 11,
    tracking: "VN-1006",
    estimatedDate: "October 8, 2025",
    updateDate: "Oct 06 2025",
  },
  {
    id: "5",
    code: "VNID02330191",
    poNumber: "PO-2025-0645",
    vendor: "Asia Pacific Metals",
    location: "Internal Hub",
    status: "Complete",
    products: 4,
    items: 7,
    tracking: "VN004",
    estimatedDate: "October 4, 2025",
    updateDate: "Oct 04 2025",
  },
  {
    id: "6",
    code: "VNID03220188",
    poNumber: "PO-2025-0623",
    vendor: "Global Gemstones Ltd.",
    location: "Internal Hub",
    status: "Complete",
    products: 2,
    items: 13,
    tracking: "VN003",
    estimatedDate: "October 3, 2025",
    updateDate: "Oct 03 2025",
  },
  {
    id: "7",
    code: "USID08445621",
    poNumber: "PO-2025-0856",
    vendor: "Premium Diamonds USA",
    location: "Warehouse A",
    status: "Processing",
    products: 12,
    items: 48,
    tracking: "US-98723",
    estimatedDate: "October 15, 2025",
    updateDate: "Oct 12 2025",
  },
  {
    id: "8",
    code: "VNID09112334",
    poNumber: "PO-2025-0891",
    vendor: "Vietnam Supplier Co.",
    location: "Internal Hub",
    status: "Delayed",
    products: 8,
    items: 22,
    tracking: "VN-1009",
    estimatedDate: "October 5, 2025",
    updateDate: "Oct 10 2025",
    note: "Customs clearance delay",
  },
];
