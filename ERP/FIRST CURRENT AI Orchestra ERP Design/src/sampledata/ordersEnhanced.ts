// Enhanced Order Data Structure with Line Items
// Links to: Products, Customers, Shipments

export interface OrderLineItem {
  id: string;
  productId: string;
  sku: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  subtotal: number;
  customization?: {
    size?: string;
    engraving?: string;
    notes?: string;
  };
}

export interface OrderEnhanced {
  id: string;
  orderNumber: string;
  // Customer Info
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  // Shipping Address
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  // Billing Address (can be same as shipping)
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  // Order Items
  items: OrderLineItem[];
  // Financials
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;
  // Status
  status: "pending" | "confirmed" | "processing" | "ready-to-ship" | "shipped" | "delivered" | "cancelled" | "refunded";
  paymentStatus: "pending" | "authorized" | "paid" | "partially-refunded" | "refunded" | "failed";
  fulfillmentStatus: "unfulfilled" | "partially-fulfilled" | "fulfilled";
  // Shipping
  shippingMethod: "standard" | "express" | "overnight" | "international";
  warehouse: "US" | "VN";
  // Dates
  orderDate: string;
  paidDate?: string;
  shippedDate?: string;
  deliveredDate?: string;
  estimatedDelivery?: string;
  // Metadata
  source: "website" | "instagram" | "facebook" | "marketplace" | "phone" | "email";
  assignedTo?: string;
  priority: "low" | "normal" | "high" | "urgent";
  tags?: string[];
  notes?: string;
  internalNotes?: string;
  // References
  shipmentIds?: string[]; // Can have multiple shipments
  returnIds?: string[];
}

export const mockOrdersEnhanced: OrderEnhanced[] = [
  {
    id: "ORD-001",
    orderNumber: "ORD-12345",
    customerId: "CUST-001",
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
    items: [
      {
        id: "LINE-001",
        productId: "1",
        sku: "JW-GLD-001",
        name: "Golden Lotus Bracelet",
        image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=200",
        quantity: 1,
        price: 79.99,
        subtotal: 79.99,
      },
    ],
    subtotal: 79.99,
    tax: 7.20,
    shippingCost: 12.50,
    discount: 0,
    total: 99.69,
    status: "shipped",
    paymentStatus: "paid",
    fulfillmentStatus: "fulfilled",
    shippingMethod: "express",
    warehouse: "US",
    orderDate: "2025-11-01T10:30:00",
    paidDate: "2025-11-01T10:35:00",
    shippedDate: "2025-11-01T15:00:00",
    estimatedDelivery: "2025-11-03",
    source: "website",
    assignedTo: "Maria Garcia",
    priority: "high",
    tags: ["VIP", "Express"],
    notes: "Customer requested gift wrapping",
    shipmentIds: ["SHP-001"],
  },
  {
    id: "ORD-002",
    orderNumber: "ORD-12346",
    customerId: "CUST-002",
    customerName: "Michael Chen",
    customerEmail: "michael.c@email.com",
    customerPhone: "+1-555-0124",
    shippingAddress: {
      street: "456 Oak Avenue",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001",
      country: "USA",
    },
    items: [
      {
        id: "LINE-002",
        productId: "2",
        sku: "JW-SLV-002",
        name: "Moonlight Pearl Necklace",
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200",
        quantity: 1,
        price: 129.99,
        subtotal: 129.99,
      },
      {
        id: "LINE-003",
        productId: "3",
        sku: "JW-RG-003",
        name: "Rose Quartz Ring",
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200",
        quantity: 1,
        price: 69.99,
        subtotal: 69.99,
        customization: {
          size: "7",
          notes: "Please ensure proper sizing",
        },
      },
    ],
    subtotal: 199.98,
    tax: 18.00,
    shippingCost: 8.99,
    discount: 20.00,
    total: 206.97,
    status: "processing",
    paymentStatus: "paid",
    fulfillmentStatus: "unfulfilled",
    shippingMethod: "standard",
    warehouse: "US",
    orderDate: "2025-11-02T09:15:00",
    paidDate: "2025-11-02T09:20:00",
    estimatedDelivery: "2025-11-08",
    source: "instagram",
    assignedTo: "Tom Martinez",
    priority: "normal",
    tags: ["First-Time Customer"],
    notes: "Include care instructions",
  },
  {
    id: "ORD-003",
    orderNumber: "ORD-12347",
    customerId: "CUST-003",
    customerName: "Emily Rodriguez",
    customerEmail: "emily.r@email.com",
    customerPhone: "+1-555-0125",
    shippingAddress: {
      street: "789 Pine Road",
      city: "Miami",
      state: "FL",
      zipCode: "33101",
      country: "USA",
    },
    items: [
      {
        id: "LINE-004",
        productId: "1",
        sku: "JW-GLD-001",
        name: "Golden Lotus Bracelet",
        image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=200",
        quantity: 2,
        price: 79.99,
        subtotal: 159.98,
      },
    ],
    subtotal: 159.98,
    tax: 14.40,
    shippingCost: 25.00,
    discount: 0,
    total: 199.38,
    status: "shipped",
    paymentStatus: "paid",
    fulfillmentStatus: "fulfilled",
    shippingMethod: "overnight",
    warehouse: "US",
    orderDate: "2025-11-02T14:20:00",
    paidDate: "2025-11-02T14:22:00",
    shippedDate: "2025-11-02T16:00:00",
    estimatedDelivery: "2025-11-03",
    source: "website",
    assignedTo: "Maria Garcia",
    priority: "urgent",
    tags: ["Urgent", "Same-Day"],
    shipmentIds: ["SHP-002"],
  },
  {
    id: "ORD-004",
    orderNumber: "ORD-12348",
    customerId: "CUST-004",
    customerName: "Nguyen Van A",
    customerEmail: "nguyen.a@email.com",
    customerPhone: "+84-123-456-789",
    shippingAddress: {
      street: "123 Le Loi Street",
      city: "Ho Chi Minh City",
      state: "HCM",
      zipCode: "700000",
      country: "Vietnam",
    },
    items: [
      {
        id: "LINE-005",
        productId: "4",
        sku: "JW-GLD-004",
        name: "Dragon Jade Pendant",
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200",
        quantity: 1,
        price: 199.99,
        subtotal: 199.99,
      },
    ],
    subtotal: 199.99,
    tax: 0,
    shippingCost: 15.00,
    discount: 0,
    total: 214.99,
    status: "delivered",
    paymentStatus: "paid",
    fulfillmentStatus: "fulfilled",
    shippingMethod: "standard",
    warehouse: "VN",
    orderDate: "2025-10-28T10:00:00",
    paidDate: "2025-10-28T10:05:00",
    shippedDate: "2025-10-28T15:00:00",
    deliveredDate: "2025-10-30T11:00:00",
    source: "facebook",
    assignedTo: "Pham Van D",
    priority: "normal",
    shipmentIds: ["SHP-008"],
  },
  {
    id: "ORD-005",
    orderNumber: "ORD-12349",
    customerId: "CUST-005",
    customerName: "David Thompson",
    customerEmail: "david.t@email.com",
    customerPhone: "+1-555-0126",
    shippingAddress: {
      street: "321 Elm Street",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      country: "USA",
    },
    items: [
      {
        id: "LINE-006",
        productId: "5",
        sku: "JW-SLV-005",
        name: "Celtic Knot Bracelet",
        image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=200",
        quantity: 1,
        price: 94.99,
        subtotal: 94.99,
      },
      {
        id: "LINE-007",
        productId: "6",
        sku: "JW-GLD-006",
        name: "Prosperity Coin Charm",
        image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=200",
        quantity: 1,
        price: 54.99,
        subtotal: 54.99,
      },
    ],
    subtotal: 149.98,
    tax: 13.50,
    shippingCost: 8.99,
    discount: 15.00,
    total: 157.47,
    status: "ready-to-ship",
    paymentStatus: "paid",
    fulfillmentStatus: "unfulfilled",
    shippingMethod: "standard",
    warehouse: "US",
    orderDate: "2025-11-02T11:30:00",
    paidDate: "2025-11-02T11:35:00",
    estimatedDelivery: "2025-11-07",
    source: "marketplace",
    assignedTo: "Tom Martinez",
    priority: "normal",
  },
];
