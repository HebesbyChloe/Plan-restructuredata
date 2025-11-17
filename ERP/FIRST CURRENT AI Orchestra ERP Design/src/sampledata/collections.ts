export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  collectionType: "manual" | "automatic" | "smart";
  condition: "all" | "any";
  category?: string;
  priceRange?: string;
  minPrice?: number;
  maxPrice?: number;
  tags: string[];
  visibility: "visible" | "hidden";
  featured: boolean;
  startDate?: string;
  endDate?: string;
  seoTitle: string;
  seoDescription: string;
  status: "active" | "draft" | "scheduled" | "archived";
  productIds: string[];
  productCount: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export const mockCollections: Collection[] = [
  {
    id: "col-001",
    name: "Sacred Lotus",
    slug: "sacred-lotus",
    description: "Inspired by the sacred lotus flower, symbolizing purity, enlightenment, and spiritual awakening. Each piece features lotus motifs combined with natural stones.",
    collectionType: "manual",
    condition: "all",
    tags: ["lotus", "spiritual", "prosperity", "new-arrival"],
    visibility: "visible",
    featured: true,
    seoTitle: "Sacred Lotus Collection | Spiritual Jewelry",
    seoDescription: "Discover our Sacred Lotus collection featuring handcrafted jewelry inspired by the sacred lotus flower.",
    status: "active",
    productIds: ["prod-001", "prod-004", "prod-008", "prod-012"],
    productCount: 12,
    imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600",
    createdAt: "2024-06-01T10:00:00Z",
    updatedAt: "2025-10-28T14:20:00Z",
    createdBy: "user-admin-001",
  },
  {
    id: "col-002",
    name: "Celestial",
    slug: "celestial",
    description: "Moon, star, and celestial-themed jewelry for those who connect with the cosmos. Features moonstone, labradorite, and pearl.",
    collectionType: "manual",
    condition: "all",
    tags: ["moon", "stars", "celestial", "harmony"],
    visibility: "visible",
    featured: true,
    seoTitle: "Celestial Collection | Moon & Star Jewelry",
    seoDescription: "Explore our celestial-inspired jewelry featuring moons, stars, and cosmic crystals.",
    status: "active",
    productIds: ["prod-002", "prod-006", "prod-010"],
    productCount: 8,
    imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600",
    createdAt: "2024-07-15T10:00:00Z",
    updatedAt: "2025-10-25T11:15:00Z",
    createdBy: "user-admin-001",
  },
  {
    id: "col-003",
    name: "Love & Light",
    slug: "love-and-light",
    description: "Rose quartz and pink gemstone collection for attracting love, compassion, and emotional healing.",
    collectionType: "automatic",
    condition: "any",
    priceRange: "custom",
    minPrice: 50,
    maxPrice: 200,
    tags: ["love", "rose-quartz", "pink", "healing"],
    visibility: "visible",
    featured: true,
    seoTitle: "Love & Light Collection | Rose Quartz Jewelry",
    seoDescription: "Beautiful rose quartz and pink gemstone jewelry for love and emotional healing.",
    status: "active",
    productIds: ["prod-003", "prod-007", "prod-011"],
    productCount: 15,
    imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600",
    createdAt: "2024-02-14T10:00:00Z",
    updatedAt: "2025-10-20T09:30:00Z",
    createdBy: "user-admin-001",
  },
  {
    id: "col-004",
    name: "Protection",
    slug: "protection",
    description: "Black obsidian, black tourmaline, and protective stones for grounding and shielding negative energy.",
    collectionType: "manual",
    condition: "all",
    tags: ["protection", "black-obsidian", "grounding", "shield"],
    visibility: "visible",
    featured: false,
    seoTitle: "Protection Collection | Black Stone Jewelry",
    seoDescription: "Protective jewelry featuring black obsidian and tourmaline for grounding and energy shielding.",
    status: "active",
    productIds: ["prod-005", "prod-009", "prod-013"],
    productCount: 10,
    imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600",
    createdAt: "2024-08-01T10:00:00Z",
    updatedAt: "2025-10-22T16:45:00Z",
    createdBy: "user-admin-002",
  },
  {
    id: "col-005",
    name: "Healing Stones",
    slug: "healing-stones",
    description: "Curated collection of crystals and gemstones known for their healing properties and energetic benefits.",
    collectionType: "automatic",
    condition: "any",
    tags: ["healing", "crystals", "wellness", "energy"],
    visibility: "visible",
    featured: true,
    seoTitle: "Healing Stones Collection | Crystal Jewelry",
    seoDescription: "Discover healing crystal jewelry with natural stones for wellness and energy balance.",
    status: "active",
    productIds: ["prod-001", "prod-003", "prod-005", "prod-014", "prod-015"],
    productCount: 18,
    imageUrl: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600",
    createdAt: "2024-05-01T10:00:00Z",
    updatedAt: "2025-10-28T10:00:00Z",
    createdBy: "user-admin-001",
  },
  {
    id: "col-006",
    name: "Summer 2025",
    slug: "summer-2025",
    description: "Limited edition summer collection featuring vibrant citrine, turquoise, and coral-inspired designs.",
    collectionType: "manual",
    condition: "all",
    startDate: "2025-06-01",
    endDate: "2025-08-31",
    tags: ["summer", "limited-edition", "seasonal", "vibrant"],
    visibility: "visible",
    featured: true,
    seoTitle: "Summer 2025 Collection | Limited Edition Jewelry",
    seoDescription: "Shop our limited edition Summer 2025 collection with vibrant crystals and coastal designs.",
    status: "scheduled",
    productIds: [],
    productCount: 0,
    imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600",
    createdAt: "2025-10-15T10:00:00Z",
    updatedAt: "2025-10-28T14:00:00Z",
    createdBy: "user-admin-001",
  },
  {
    id: "col-007",
    name: "Bridal Collection",
    slug: "bridal-collection",
    description: "Elegant jewelry sets perfect for brides and special occasions, featuring pearls, diamonds, and luxury materials.",
    collectionType: "manual",
    condition: "all",
    priceRange: "luxury",
    minPrice: 200,
    tags: ["bridal", "wedding", "luxury", "pearls"],
    visibility: "visible",
    featured: true,
    seoTitle: "Bridal Collection | Wedding Jewelry",
    seoDescription: "Elegant bridal jewelry collection for your special day featuring pearls and luxury materials.",
    status: "active",
    productIds: ["prod-002", "prod-016", "prod-017"],
    productCount: 6,
    imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600",
    createdAt: "2024-03-01T10:00:00Z",
    updatedAt: "2025-10-25T13:20:00Z",
    createdBy: "user-admin-002",
  },
];
