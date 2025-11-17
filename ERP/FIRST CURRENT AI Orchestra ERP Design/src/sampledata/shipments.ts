export interface Shipment {
  id: string;
  orderNumber: string;
  batchId?: string;
  trackingNumber: string;
  carrier: "USPS" | "UPS" | "FedEx" | "DHL" | "VN Post";
  status: "pending" | "picked" | "packed" | "shipped" | "in-transit" | "out-for-delivery" | "delivered" | "exception";
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  warehouse: "US" | "VN";
  packageWeight: number; // in kg
  packageDimensions: {
    length: number;
    width: number;
    height: number;
  };
  items: ShipmentItem[];
  shippingCost: number;
  shippingMethod: "standard" | "express" | "overnight";
  createdDate: string;
  shipDate?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  notes?: string;
  priority: "low" | "normal" | "high" | "urgent";
  labelPrinted: boolean;
  packingSlipPrinted: boolean;
}

export interface ShipmentItem {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  image?: string;
  location?: string; // Warehouse location
  picked: boolean;
  packed: boolean;
}

export const mockShipments: Shipment[] = [
  {
    id: "SHP-001",
    orderNumber: "ORD-12345",
    batchId: "BATCH-001",
    trackingNumber: "1Z999AA10123456784",
    carrier: "UPS",
    status: "in-transit",
    customerName: "Sarah Johnson",
    customerEmail: "sarah.j@email.com",
    customerPhone: "+1-555-0123",
    shippingAddress: {
      street: "123 Main Street, Apt 4B",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    warehouse: "US",
    packageWeight: 0.5,
    packageDimensions: {
      length: 30,
      width: 20,
      height: 10,
    },
    items: [
      {
        id: "1",
        sku: "JW-GLD-001",
        name: "Golden Lotus Bracelet",
        quantity: 1,
        image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=200",
        location: "A-12-3",
        picked: true,
        packed: true,
      },
    ],
    shippingCost: 12.50,
    shippingMethod: "express",
    createdDate: "2025-11-01T10:30:00",
    shipDate: "2025-11-01T15:00:00",
    estimatedDelivery: "2025-11-03",
    priority: "high",
    labelPrinted: true,
    packingSlipPrinted: true,
  },
  {
    id: "SHP-002",
    orderNumber: "ORD-12346",
    trackingNumber: "9400111899560123456789",
    carrier: "USPS",
    status: "pending",
    customerName: "Michael Chen",
    customerEmail: "m.chen@email.com",
    customerPhone: "+1-555-0124",
    shippingAddress: {
      street: "456 Oak Avenue",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001",
      country: "USA",
    },
    warehouse: "US",
    packageWeight: 0.3,
    packageDimensions: {
      length: 25,
      width: 15,
      height: 8,
    },
    items: [
      {
        id: "2",
        sku: "JW-SLV-002",
        name: "Moonlight Pearl Necklace",
        quantity: 1,
        location: "B-05-2",
        picked: false,
        packed: false,
      },
    ],
    shippingCost: 8.99,
    shippingMethod: "standard",
    createdDate: "2025-11-02T09:15:00",
    estimatedDelivery: "2025-11-07",
    priority: "normal",
    labelPrinted: false,
    packingSlipPrinted: false,
  },
  {
    id: "SHP-003",
    orderNumber: "ORD-12347",
    batchId: "BATCH-001",
    trackingNumber: "794612345678",
    carrier: "FedEx",
    status: "delivered",
    customerName: "Emily Rodriguez",
    customerEmail: "emily.r@email.com",
    customerPhone: "+1-555-0125",
    shippingAddress: {
      street: "789 Pine Street",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      country: "USA",
    },
    warehouse: "US",
    packageWeight: 0.7,
    packageDimensions: {
      length: 35,
      width: 25,
      height: 12,
    },
    items: [
      {
        id: "3",
        sku: "JW-GLD-003",
        name: "Diamond Ring Set",
        quantity: 2,
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200",
        location: "A-08-1",
        picked: true,
        packed: true,
      },
    ],
    shippingCost: 15.00,
    shippingMethod: "overnight",
    createdDate: "2025-10-28T14:20:00",
    shipDate: "2025-10-29T08:00:00",
    estimatedDelivery: "2025-10-30",
    actualDelivery: "2025-10-30T16:45:00",
    priority: "urgent",
    labelPrinted: true,
    packingSlipPrinted: true,
  },
  {
    id: "SHP-004",
    orderNumber: "ORD-12348",
    trackingNumber: "VN20231102001234",
    carrier: "VN Post",
    status: "packed",
    customerName: "Nguyen Van A",
    customerEmail: "nguyen.a@email.com",
    customerPhone: "+84-90-123-4567",
    shippingAddress: {
      street: "123 Nguyen Hue Street",
      city: "Ho Chi Minh City",
      state: "HCM",
      zipCode: "700000",
      country: "Vietnam",
    },
    warehouse: "VN",
    packageWeight: 0.4,
    packageDimensions: {
      length: 28,
      width: 18,
      height: 9,
    },
    items: [
      {
        id: "4",
        sku: "JW-BRC-001",
        name: "Jade Bangle",
        quantity: 1,
        location: "VN-C-10-5",
        picked: true,
        packed: true,
      },
    ],
    shippingCost: 5.00,
    shippingMethod: "standard",
    createdDate: "2025-11-01T11:30:00",
    estimatedDelivery: "2025-11-05",
    priority: "normal",
    labelPrinted: true,
    packingSlipPrinted: true,
  },
  {
    id: "SHP-005",
    orderNumber: "ORD-12349",
    batchId: "BATCH-002",
    trackingNumber: "1Z999AA10123456790",
    carrier: "UPS",
    status: "picked",
    customerName: "David Thompson",
    customerEmail: "d.thompson@email.com",
    customerPhone: "+1-555-0126",
    shippingAddress: {
      street: "321 Elm Street",
      city: "Miami",
      state: "FL",
      zipCode: "33101",
      country: "USA",
    },
    warehouse: "US",
    packageWeight: 0.6,
    packageDimensions: {
      length: 32,
      width: 22,
      height: 11,
    },
    items: [
      {
        id: "5",
        sku: "JW-GLD-005",
        name: "Gold Charm Bracelet",
        quantity: 1,
        location: "A-15-2",
        picked: true,
        packed: false,
      },
      {
        id: "6",
        sku: "JW-SLV-006",
        name: "Silver Earrings",
        quantity: 1,
        location: "B-12-4",
        picked: true,
        packed: false,
      },
    ],
    shippingCost: 10.50,
    shippingMethod: "express",
    createdDate: "2025-11-02T08:00:00",
    estimatedDelivery: "2025-11-04",
    priority: "high",
    labelPrinted: true,
    packingSlipPrinted: false,
  },
  {
    id: "SHP-006",
    orderNumber: "ORD-12350",
    trackingNumber: "9261299998765432109876",
    carrier: "USPS",
    status: "exception",
    customerName: "Jessica Martinez",
    customerEmail: "j.martinez@email.com",
    customerPhone: "+1-555-0127",
    shippingAddress: {
      street: "567 Maple Drive",
      city: "Seattle",
      state: "WA",
      zipCode: "98101",
      country: "USA",
    },
    warehouse: "US",
    packageWeight: 0.8,
    packageDimensions: {
      length: 40,
      width: 30,
      height: 15,
    },
    items: [
      {
        id: "7",
        sku: "JW-GLD-007",
        name: "Gold Necklace Set",
        quantity: 1,
        location: "A-20-1",
        picked: true,
        packed: true,
      },
    ],
    shippingCost: 18.00,
    shippingMethod: "express",
    createdDate: "2025-10-30T13:45:00",
    shipDate: "2025-10-31T10:00:00",
    estimatedDelivery: "2025-11-02",
    notes: "Address not accessible - customer contacted for alternative delivery",
    priority: "urgent",
    labelPrinted: true,
    packingSlipPrinted: true,
  },
  {
    id: "SHP-007",
    orderNumber: "ORD-12351",
    trackingNumber: "794612345679",
    carrier: "FedEx",
    status: "out-for-delivery",
    customerName: "Robert Lee",
    customerEmail: "r.lee@email.com",
    customerPhone: "+1-555-0128",
    shippingAddress: {
      street: "890 Broadway",
      city: "Boston",
      state: "MA",
      zipCode: "02101",
      country: "USA",
    },
    warehouse: "US",
    packageWeight: 0.45,
    packageDimensions: {
      length: 27,
      width: 17,
      height: 9,
    },
    items: [
      {
        id: "8",
        sku: "JW-SLV-008",
        name: "Silver Ring",
        quantity: 2,
        location: "B-18-3",
        picked: true,
        packed: true,
      },
    ],
    shippingCost: 11.99,
    shippingMethod: "standard",
    createdDate: "2025-10-29T16:30:00",
    shipDate: "2025-10-30T09:00:00",
    estimatedDelivery: "2025-11-02",
    priority: "normal",
    labelPrinted: true,
    packingSlipPrinted: true,
  },
  {
    id: "SHP-008",
    orderNumber: "ORD-12352",
    batchId: "BATCH-002",
    trackingNumber: "",
    carrier: "UPS",
    status: "pending",
    customerName: "Amanda White",
    customerEmail: "a.white@email.com",
    customerPhone: "+1-555-0129",
    shippingAddress: {
      street: "234 River Road",
      city: "Portland",
      state: "OR",
      zipCode: "97201",
      country: "USA",
    },
    warehouse: "US",
    packageWeight: 0.35,
    packageDimensions: {
      length: 26,
      width: 16,
      height: 8,
    },
    items: [
      {
        id: "9",
        sku: "JW-GLD-009",
        name: "Gold Pendant",
        quantity: 1,
        location: "A-22-4",
        picked: false,
        packed: false,
      },
    ],
    shippingCost: 9.50,
    shippingMethod: "standard",
    createdDate: "2025-11-02T12:00:00",
    estimatedDelivery: "2025-11-07",
    priority: "normal",
    labelPrinted: false,
    packingSlipPrinted: false,
  },
];

// Utility functions
export function getShipmentsByStatus(status: Shipment["status"]) {
  return mockShipments.filter(s => s.status === status);
}

export function getShipmentsByWarehouse(warehouse: "US" | "VN") {
  return mockShipments.filter(s => s.warehouse === warehouse);
}

export function getShipmentsByCarrier(carrier: Shipment["carrier"]) {
  return mockShipments.filter(s => s.carrier === carrier);
}

export function getPendingShipments() {
  return mockShipments.filter(s => s.status === "pending" || s.status === "picked");
}

export function getActiveShipments() {
  return mockShipments.filter(s => 
    s.status === "shipped" || 
    s.status === "in-transit" || 
    s.status === "out-for-delivery"
  );
}
