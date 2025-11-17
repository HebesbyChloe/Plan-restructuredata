export interface BundleProduct {
  productId: string;
  variantId?: string;
  quantity: number;
  name: string;
  sku: string;
  price: number;
}

export interface Bundle {
  id: string;
  sku: string;
  name: string;
  description: string;
  bundleType: "fixed" | "flexible" | "custom";
  pricing: "discount" | "fixed" | "regular";
  discountType?: "percentage" | "fixed";
  discountValue?: number;
  fixedPrice?: number;
  status: "active" | "draft" | "scheduled" | "expired";
  products: BundleProduct[];
  totalRegularPrice: number;
  finalPrice: number;
  savings: number;
  savingsPercentage: number;
  imageUrl: string;
  featured: boolean;
  startDate?: string;
  endDate?: string;
  vnStock: number;
  usStock: number;
  createdAt: string;
  updatedAt: string;
}

export const mockBundles: Bundle[] = [
  {
    id: "bun-001",
    sku: "BUNDLE-BRIDAL-001",
    name: "Bridal Set - Moonlight & Pearl",
    description: "Complete bridal jewelry set featuring our Moonlight Pearl Necklace and matching Pearl Drop Earrings. Perfect for your special day.",
    bundleType: "fixed",
    pricing: "discount",
    discountType: "percentage",
    discountValue: 15,
    status: "active",
    products: [
      {
        productId: "prod-002",
        variantId: "var-004",
        quantity: 1,
        name: "Moonlight Pearl Necklace - 16 inches",
        sku: "JW-SLV-002-16IN",
        price: 129.99,
      },
      {
        productId: "prod-006",
        quantity: 1,
        name: "Pearl Drop Earrings",
        sku: "JW-EAR-006",
        price: 89.99,
      },
    ],
    totalRegularPrice: 219.98,
    finalPrice: 186.98,
    savings: 32.00,
    savingsPercentage: 15,
    imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600",
    featured: true,
    vnStock: 8,
    usStock: 5,
    createdAt: "2024-03-01T10:00:00Z",
    updatedAt: "2025-10-28T11:30:00Z",
  },
  {
    id: "bun-002",
    sku: "BUNDLE-PROTECTION-001",
    name: "Ultimate Protection Bundle",
    description: "Comprehensive protection kit with Black Obsidian Bracelet, Black Tourmaline Necklace, and Evil Eye Charm. Shield yourself from negative energy.",
    bundleType: "fixed",
    pricing: "fixed",
    fixedPrice: 199.99,
    status: "active",
    products: [
      {
        productId: "prod-004",
        variantId: "var-009",
        quantity: 1,
        name: "Black Obsidian Protection Bracelet",
        sku: "JW-BRC-004-ADJ-10MM",
        price: 79.99,
      },
      {
        productId: "prod-007",
        quantity: 1,
        name: "Black Tourmaline Necklace",
        sku: "JW-NCK-007",
        price: 95.99,
      },
      {
        productId: "prod-008",
        quantity: 1,
        name: "Evil Eye Charm Bracelet",
        sku: "JW-BRC-008",
        price: 69.99,
      },
    ],
    totalRegularPrice: 245.97,
    finalPrice: 199.99,
    savings: 45.98,
    savingsPercentage: 18.7,
    imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600",
    featured: true,
    vnStock: 15,
    usStock: 10,
    createdAt: "2024-08-01T10:00:00Z",
    updatedAt: "2025-10-27T15:45:00Z",
  },
  {
    id: "bun-003",
    sku: "BUNDLE-LOVE-001",
    name: "Love & Romance Set",
    description: "Express your love with this romantic bundle featuring Rose Quartz Ring and matching Rose Quartz Heart Pendant.",
    bundleType: "fixed",
    pricing: "discount",
    discountType: "percentage",
    discountValue: 20,
    status: "active",
    products: [
      {
        productId: "prod-003",
        variantId: "var-007",
        quantity: 1,
        name: "Rose Quartz Ring - Size 7",
        sku: "JW-RG-003-SIZE7",
        price: 149.99,
      },
      {
        productId: "prod-009",
        quantity: 1,
        name: "Rose Quartz Heart Pendant",
        sku: "JW-PEN-009",
        price: 85.99,
      },
    ],
    totalRegularPrice: 235.98,
    finalPrice: 188.78,
    savings: 47.20,
    savingsPercentage: 20,
    imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600",
    featured: true,
    startDate: "2025-01-14",
    endDate: "2025-02-28",
    vnStock: 12,
    usStock: 8,
    createdAt: "2025-01-01T10:00:00Z",
    updatedAt: "2025-10-28T09:20:00Z",
  },
  {
    id: "bun-004",
    sku: "BUNDLE-PROSPERITY-001",
    name: "Prosperity Abundance Set",
    description: "Attract wealth and abundance with our Golden Lotus Bracelet and Citrine Money Tree Charm combo.",
    bundleType: "fixed",
    pricing: "discount",
    discountType: "fixed",
    discountValue: 30,
    status: "active",
    products: [
      {
        productId: "prod-001",
        variantId: "var-002",
        quantity: 1,
        name: "Golden Lotus Bracelet - M / 8mm",
        sku: "JW-GLD-001-M-8MM",
        price: 89.99,
      },
      {
        productId: "prod-010",
        quantity: 1,
        name: "Citrine Money Tree Charm",
        sku: "JW-CHM-010",
        price: 45.99,
      },
    ],
    totalRegularPrice: 135.98,
    finalPrice: 105.98,
    savings: 30.00,
    savingsPercentage: 22.1,
    imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600",
    featured: false,
    vnStock: 25,
    usStock: 18,
    createdAt: "2024-06-15T10:00:00Z",
    updatedAt: "2025-10-26T14:10:00Z",
  },
  {
    id: "bun-005",
    sku: "BUNDLE-HEALING-001",
    name: "Complete Healing Crystal Set",
    description: "7-piece healing crystal collection for chakra balancing and energy work. Includes Amethyst, Rose Quartz, Citrine, and more.",
    bundleType: "fixed",
    pricing: "fixed",
    fixedPrice: 299.99,
    status: "active",
    products: [
      {
        productId: "prod-005",
        variantId: "var-010",
        quantity: 1,
        name: "Amethyst Bracelet",
        sku: "JW-AME-005-M-6MM-SLV",
        price: 75.99,
      },
      {
        productId: "prod-003",
        variantId: "var-007",
        quantity: 1,
        name: "Rose Quartz Ring",
        sku: "JW-RG-003-SIZE7",
        price: 149.99,
      },
      {
        productId: "prod-001",
        variantId: "var-002",
        quantity: 1,
        name: "Golden Lotus Bracelet (Citrine)",
        sku: "JW-GLD-001-M-8MM",
        price: 89.99,
      },
      {
        productId: "prod-011",
        quantity: 1,
        name: "Clear Quartz Pendant",
        sku: "JW-PEN-011",
        price: 65.99,
      },
    ],
    totalRegularPrice: 381.96,
    finalPrice: 299.99,
    savings: 81.97,
    savingsPercentage: 21.5,
    imageUrl: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600",
    featured: true,
    vnStock: 5,
    usStock: 3,
    createdAt: "2024-05-01T10:00:00Z",
    updatedAt: "2025-10-28T10:45:00Z",
  },
  {
    id: "bun-006",
    sku: "BUNDLE-STARTER-001",
    name: "Crystal Starter Kit",
    description: "Perfect for beginners! Essential crystal jewelry pieces to start your spiritual journey.",
    bundleType: "flexible",
    pricing: "discount",
    discountType: "percentage",
    discountValue: 25,
    status: "active",
    products: [
      {
        productId: "prod-001",
        variantId: "var-002",
        quantity: 1,
        name: "Golden Lotus Bracelet",
        sku: "JW-GLD-001-M-8MM",
        price: 89.99,
      },
      {
        productId: "prod-012",
        quantity: 1,
        name: "Crystal Guidebook & Pouch",
        sku: "ACC-012",
        price: 24.99,
      },
    ],
    totalRegularPrice: 114.98,
    finalPrice: 86.24,
    savings: 28.74,
    savingsPercentage: 25,
    imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600",
    featured: false,
    vnStock: 40,
    usStock: 30,
    createdAt: "2024-04-01T10:00:00Z",
    updatedAt: "2025-10-25T16:30:00Z",
  },
  {
    id: "bun-007",
    sku: "BUNDLE-SEASONAL-001",
    name: "Summer Solstice Special",
    description: "Limited time summer collection bundle with vibrant crystals for the season.",
    bundleType: "fixed",
    pricing: "fixed",
    fixedPrice: 175.00,
    status: "scheduled",
    products: [
      {
        productId: "prod-013",
        quantity: 1,
        name: "Turquoise Beach Bracelet",
        sku: "JW-BRC-013",
        price: 79.99,
      },
      {
        productId: "prod-014",
        quantity: 1,
        name: "Coral-Inspired Necklace",
        sku: "JW-NCK-014",
        price: 109.99,
      },
      {
        productId: "prod-015",
        quantity: 1,
        name: "Sunstone Earrings",
        sku: "JW-EAR-015",
        price: 59.99,
      },
    ],
    totalRegularPrice: 249.97,
    finalPrice: 175.00,
    savings: 74.97,
    savingsPercentage: 30,
    imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600",
    featured: true,
    startDate: "2025-06-01",
    endDate: "2025-08-31",
    vnStock: 0,
    usStock: 0,
    createdAt: "2025-10-15T10:00:00Z",
    updatedAt: "2025-10-28T14:00:00Z",
  },
];
