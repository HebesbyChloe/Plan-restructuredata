export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  image?: string;
  warehouses: {
    US: {
      quantity: number;
      location: string;
      reserved: number;
      available: number;
      lastUpdated: string;
    };
    VN: {
      quantity: number;
      location: string;
      reserved: number;
      available: number;
      lastUpdated: string;
    };
  };
  reorderPoint: number;
  reorderQuantity: number;
  status: "in-stock" | "low-stock" | "out-of-stock" | "discontinued";
  cost: number;
  supplier?: string;
  lastRestocked?: string;
  notes?: string;
}

export const mockInventory: InventoryItem[] = [
  {
    id: "INV-001",
    sku: "JW-GLD-001",
    name: "Golden Lotus Bracelet",
    category: "Bracelets",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=200",
    warehouses: {
      US: {
        quantity: 45,
        location: "A-12-3",
        reserved: 5,
        available: 40,
        lastUpdated: "2025-11-02T10:30:00",
      },
      VN: {
        quantity: 120,
        location: "VN-B-08-2",
        reserved: 12,
        available: 108,
        lastUpdated: "2025-11-01T15:00:00",
      },
    },
    reorderPoint: 20,
    reorderQuantity: 50,
    status: "in-stock",
    cost: 35.00,
    supplier: "Golden Jewelry Co.",
    lastRestocked: "2025-10-25",
  },
  {
    id: "INV-002",
    sku: "JW-SLV-002",
    name: "Moonlight Pearl Necklace",
    category: "Necklaces",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200",
    warehouses: {
      US: {
        quantity: 12,
        location: "B-05-2",
        reserved: 3,
        available: 9,
        lastUpdated: "2025-11-02T09:15:00",
      },
      VN: {
        quantity: 35,
        location: "VN-A-15-1",
        reserved: 5,
        available: 30,
        lastUpdated: "2025-11-01T14:30:00",
      },
    },
    reorderPoint: 15,
    reorderQuantity: 30,
    status: "low-stock",
    cost: 45.50,
    supplier: "Pearl Masters Ltd.",
    lastRestocked: "2025-10-20",
    notes: "US warehouse running low - reorder needed",
  },
  {
    id: "INV-003",
    sku: "JW-GLD-003",
    name: "Diamond Ring Set",
    category: "Rings",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200",
    warehouses: {
      US: {
        quantity: 28,
        location: "A-08-1",
        reserved: 8,
        available: 20,
        lastUpdated: "2025-11-02T11:00:00",
      },
      VN: {
        quantity: 55,
        location: "VN-A-10-3",
        reserved: 10,
        available: 45,
        lastUpdated: "2025-11-01T16:00:00",
      },
    },
    reorderPoint: 25,
    reorderQuantity: 40,
    status: "in-stock",
    cost: 120.00,
    supplier: "Diamond Direct",
    lastRestocked: "2025-10-28",
  },
  {
    id: "INV-004",
    sku: "JW-BRC-001",
    name: "Jade Bangle",
    category: "Bracelets",
    warehouses: {
      US: {
        quantity: 0,
        location: "A-15-2",
        reserved: 0,
        available: 0,
        lastUpdated: "2025-11-01T08:00:00",
      },
      VN: {
        quantity: 85,
        location: "VN-C-10-5",
        reserved: 5,
        available: 80,
        lastUpdated: "2025-11-02T10:00:00",
      },
    },
    reorderPoint: 10,
    reorderQuantity: 25,
    status: "out-of-stock",
    cost: 28.00,
    supplier: "Asia Jade Inc.",
    lastRestocked: "2025-10-15",
    notes: "Out of stock in US warehouse - transfer from VN scheduled",
  },
  {
    id: "INV-005",
    sku: "JW-GLD-005",
    name: "Gold Charm Bracelet",
    category: "Bracelets",
    warehouses: {
      US: {
        quantity: 65,
        location: "A-15-2",
        reserved: 15,
        available: 50,
        lastUpdated: "2025-11-02T08:30:00",
      },
      VN: {
        quantity: 140,
        location: "VN-B-12-4",
        reserved: 20,
        available: 120,
        lastUpdated: "2025-11-01T13:00:00",
      },
    },
    reorderPoint: 30,
    reorderQuantity: 60,
    status: "in-stock",
    cost: 42.00,
    supplier: "Golden Jewelry Co.",
    lastRestocked: "2025-10-30",
  },
  {
    id: "INV-006",
    sku: "JW-SLV-006",
    name: "Silver Earrings",
    category: "Earrings",
    warehouses: {
      US: {
        quantity: 8,
        location: "B-12-4",
        reserved: 2,
        available: 6,
        lastUpdated: "2025-11-02T07:45:00",
      },
      VN: {
        quantity: 22,
        location: "VN-B-18-2",
        reserved: 4,
        available: 18,
        lastUpdated: "2025-11-01T12:00:00",
      },
    },
    reorderPoint: 15,
    reorderQuantity: 40,
    status: "low-stock",
    cost: 18.50,
    supplier: "Silver Crafts Co.",
    lastRestocked: "2025-10-22",
    notes: "Popular item - consider increasing reorder quantity",
  },
  {
    id: "INV-007",
    sku: "JW-GLD-007",
    name: "Gold Necklace Set",
    category: "Necklaces",
    warehouses: {
      US: {
        quantity: 32,
        location: "A-20-1",
        reserved: 7,
        available: 25,
        lastUpdated: "2025-11-01T16:30:00",
      },
      VN: {
        quantity: 78,
        location: "VN-A-22-4",
        reserved: 12,
        available: 66,
        lastUpdated: "2025-11-01T11:00:00",
      },
    },
    reorderPoint: 20,
    reorderQuantity: 35,
    status: "in-stock",
    cost: 95.00,
    supplier: "Golden Jewelry Co.",
    lastRestocked: "2025-10-26",
  },
  {
    id: "INV-008",
    sku: "JW-SLV-008",
    name: "Silver Ring",
    category: "Rings",
    warehouses: {
      US: {
        quantity: 95,
        location: "B-18-3",
        reserved: 18,
        available: 77,
        lastUpdated: "2025-11-02T12:00:00",
      },
      VN: {
        quantity: 180,
        location: "VN-B-20-1",
        reserved: 25,
        available: 155,
        lastUpdated: "2025-11-01T17:00:00",
      },
    },
    reorderPoint: 40,
    reorderQuantity: 80,
    status: "in-stock",
    cost: 22.00,
    supplier: "Silver Crafts Co.",
    lastRestocked: "2025-11-01",
  },
  {
    id: "INV-009",
    sku: "JW-GLD-009",
    name: "Gold Pendant",
    category: "Pendants",
    warehouses: {
      US: {
        quantity: 18,
        location: "A-22-4",
        reserved: 4,
        available: 14,
        lastUpdated: "2025-11-02T09:00:00",
      },
      VN: {
        quantity: 42,
        location: "VN-A-25-2",
        reserved: 6,
        available: 36,
        lastUpdated: "2025-11-01T10:30:00",
      },
    },
    reorderPoint: 20,
    reorderQuantity: 30,
    status: "low-stock",
    cost: 55.00,
    supplier: "Golden Jewelry Co.",
    lastRestocked: "2025-10-18",
  },
  {
    id: "INV-010",
    sku: "JW-DIA-010",
    name: "Diamond Stud Earrings",
    category: "Earrings",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200",
    warehouses: {
      US: {
        quantity: 52,
        location: "A-28-1",
        reserved: 8,
        available: 44,
        lastUpdated: "2025-11-02T13:30:00",
      },
      VN: {
        quantity: 68,
        location: "VN-A-30-3",
        reserved: 10,
        available: 58,
        lastUpdated: "2025-11-01T18:00:00",
      },
    },
    reorderPoint: 25,
    reorderQuantity: 50,
    status: "in-stock",
    cost: 180.00,
    supplier: "Diamond Direct",
    lastRestocked: "2025-10-29",
  },
];

// Utility functions
export function getInventoryByStatus(status: InventoryItem["status"]) {
  return mockInventory.filter((item) => item.status === status);
}

export function getLowStockItems() {
  return mockInventory.filter((item) => {
    const usAvailable = item.warehouses.US.available;
    const vnAvailable = item.warehouses.VN.available;
    const totalAvailable = usAvailable + vnAvailable;
    return totalAvailable <= item.reorderPoint;
  });
}

export function getInventoryByWarehouse(warehouse: "US" | "VN") {
  return mockInventory.map((item) => ({
    ...item,
    quantity: item.warehouses[warehouse].quantity,
    available: item.warehouses[warehouse].available,
    reserved: item.warehouses[warehouse].reserved,
    location: item.warehouses[warehouse].location,
  }));
}

export function getTotalInventoryValue() {
  return mockInventory.reduce((total, item) => {
    const usQuantity = item.warehouses.US.quantity;
    const vnQuantity = item.warehouses.VN.quantity;
    return total + (usQuantity + vnQuantity) * item.cost;
  }, 0);
}

export function getInventoryByCategory(category: string) {
  return mockInventory.filter((item) => item.category === category);
}
