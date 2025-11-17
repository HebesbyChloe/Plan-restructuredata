export interface PricingTier {
  minQty: number;
  maxQty: number | null;
  price: number;
  discount: number;
}

export interface PricingRule {
  id: string;
  name: string;
  type: "tier" | "volume" | "customer" | "promotional";
  applyTo: "all" | "category" | "product" | "collection";
  categoryId?: string;
  productIds?: string[];
  collectionId?: string;
  customerGroup: "all" | "wholesale" | "vip" | "retail";
  basePrice?: number;
  currency: "USD" | "VND" | "EUR";
  startDate?: string;
  endDate?: string;
  status: "active" | "draft" | "scheduled" | "expired";
  description: string;
  tiers: PricingTier[];
  priority: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export const mockPricingRules: PricingRule[] = [
  {
    id: "price-001",
    name: "Wholesale Tier Pricing - Bracelets",
    type: "tier",
    applyTo: "category",
    categoryId: "cat-001",
    customerGroup: "wholesale",
    basePrice: 89.99,
    currency: "USD",
    status: "active",
    description: "Volume-based pricing for wholesale customers purchasing bracelets. Higher quantities unlock better pricing.",
    tiers: [
      { minQty: 1, maxQty: 10, price: 89.99, discount: 0 },
      { minQty: 11, maxQty: 50, price: 85.49, discount: 5 },
      { minQty: 51, maxQty: 100, price: 80.99, discount: 10 },
      { minQty: 101, maxQty: null, price: 76.49, discount: 15 },
    ],
    priority: 1,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2025-10-20T14:30:00Z",
    createdBy: "user-admin-001",
  },
  {
    id: "price-002",
    name: "VIP Member Discount - All Products",
    type: "customer",
    applyTo: "all",
    customerGroup: "vip",
    currency: "USD",
    status: "active",
    description: "Flat 20% discount for VIP members across all products year-round.",
    tiers: [
      { minQty: 1, maxQty: null, price: 0, discount: 20 },
    ],
    priority: 2,
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2025-10-22T09:15:00Z",
    createdBy: "user-admin-001",
  },
  {
    id: "price-003",
    name: "Holiday Sale - Rings Collection",
    type: "promotional",
    applyTo: "category",
    categoryId: "cat-003",
    customerGroup: "all",
    currency: "USD",
    startDate: "2025-11-20",
    endDate: "2025-12-31",
    status: "scheduled",
    description: "Special holiday promotion offering 25% off all rings for the holiday season.",
    tiers: [
      { minQty: 1, maxQty: null, price: 0, discount: 25 },
    ],
    priority: 10,
    createdAt: "2025-10-15T10:00:00Z",
    updatedAt: "2025-10-28T11:00:00Z",
    createdBy: "user-admin-001",
  },
  {
    id: "price-004",
    name: "Bulk Order Discount - All Products",
    type: "volume",
    applyTo: "all",
    customerGroup: "all",
    currency: "USD",
    status: "active",
    description: "Volume discount applied to all products for bulk orders. Great for retailers and resellers.",
    tiers: [
      { minQty: 1, maxQty: 5, price: 0, discount: 0 },
      { minQty: 6, maxQty: 15, price: 0, discount: 8 },
      { minQty: 16, maxQty: 30, price: 0, discount: 12 },
      { minQty: 31, maxQty: null, price: 0, discount: 18 },
    ],
    priority: 3,
    createdAt: "2024-03-01T10:00:00Z",
    updatedAt: "2025-10-25T15:20:00Z",
    createdBy: "user-admin-002",
  },
  {
    id: "price-005",
    name: "Sacred Lotus Collection Special",
    type: "promotional",
    applyTo: "collection",
    collectionId: "col-001",
    customerGroup: "all",
    currency: "USD",
    startDate: "2025-10-01",
    endDate: "2025-11-30",
    status: "active",
    description: "Limited time offer: 15% off the entire Sacred Lotus collection to celebrate its popularity.",
    tiers: [
      { minQty: 1, maxQty: null, price: 0, discount: 15 },
    ],
    priority: 5,
    createdAt: "2025-09-25T10:00:00Z",
    updatedAt: "2025-10-28T10:30:00Z",
    createdBy: "user-admin-001",
  },
  {
    id: "price-006",
    name: "Retail Standard Pricing",
    type: "customer",
    applyTo: "all",
    customerGroup: "retail",
    currency: "USD",
    status: "active",
    description: "Standard retail pricing for walk-in customers and online orders.",
    tiers: [
      { minQty: 1, maxQty: null, price: 0, discount: 0 },
    ],
    priority: 0,
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2025-10-20T10:00:00Z",
    createdBy: "user-admin-001",
  },
  {
    id: "price-007",
    name: "New Customer Welcome Discount",
    type: "promotional",
    applyTo: "all",
    customerGroup: "all",
    currency: "USD",
    status: "active",
    description: "First-time customers receive 10% off their first order (single-use discount code).",
    tiers: [
      { minQty: 1, maxQty: null, price: 0, discount: 10 },
    ],
    priority: 8,
    createdAt: "2024-04-01T10:00:00Z",
    updatedAt: "2025-10-27T14:45:00Z",
    createdBy: "user-admin-002",
  },
  {
    id: "price-008",
    name: "Wholesale Diamond Jewelry Pricing",
    type: "tier",
    applyTo: "product",
    productIds: ["prod-016", "prod-017", "prod-018"],
    customerGroup: "wholesale",
    basePrice: 1500.00,
    currency: "USD",
    status: "active",
    description: "Special tiered pricing for wholesale customers purchasing diamond jewelry pieces.",
    tiers: [
      { minQty: 1, maxQty: 3, price: 1500.00, discount: 0 },
      { minQty: 4, maxQty: 10, price: 1350.00, discount: 10 },
      { minQty: 11, maxQty: null, price: 1200.00, discount: 20 },
    ],
    priority: 1,
    createdAt: "2024-05-15T10:00:00Z",
    updatedAt: "2025-10-26T11:30:00Z",
    createdBy: "user-admin-001",
  },
  {
    id: "price-009",
    name: "Flash Sale - Protection Collection",
    type: "promotional",
    applyTo: "collection",
    collectionId: "col-004",
    customerGroup: "all",
    currency: "USD",
    startDate: "2025-10-28",
    endDate: "2025-10-30",
    status: "active",
    description: "48-hour flash sale: 30% off all Protection Collection items!",
    tiers: [
      { minQty: 1, maxQty: null, price: 0, discount: 30 },
    ],
    priority: 15,
    createdAt: "2025-10-27T10:00:00Z",
    updatedAt: "2025-10-28T08:00:00Z",
    createdBy: "user-admin-001",
  },
  {
    id: "price-010",
    name: "Seasonal Bundle Discount",
    type: "promotional",
    applyTo: "product",
    productIds: ["bun-001", "bun-002", "bun-003", "bun-005"],
    customerGroup: "all",
    currency: "USD",
    startDate: "2025-10-01",
    endDate: "2025-12-31",
    status: "active",
    description: "Additional 5% off on top of bundle savings when purchasing any featured bundle.",
    tiers: [
      { minQty: 1, maxQty: null, price: 0, discount: 5 },
    ],
    priority: 7,
    createdAt: "2025-09-28T10:00:00Z",
    updatedAt: "2025-10-28T13:15:00Z",
    createdBy: "user-admin-002",
  },
];
