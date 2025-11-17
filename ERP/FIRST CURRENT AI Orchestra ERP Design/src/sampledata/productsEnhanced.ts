/**
 * Enhanced Products Data with Full Relationships
 * Links to: categories, collections, materials, diamonds, gemstones, attributes, variants
 */

export interface ProductEnhanced {
  id: string;
  sku: string;
  name: string;
  
  // Category & Collection Links
  categoryId: string;
  categoryName: string;
  collectionIds: string[];
  
  // Pricing
  retailPrice: number;
  salePrice?: number;
  costPrice: number;
  
  // Stock
  vnStock: number;
  usStock: number;
  lowStockThreshold: number;
  
  // Materials & Components (linked to materials, diamonds, gemstones)
  materialIds: string[];
  diamondIds: string[];
  gemstoneIds: string[];
  
  // Attributes (linked to attributes)
  attributeIds: string[];
  
  // Variants (has many variants)
  hasVariants: boolean;
  variantCount: number;
  
  // Physical Properties
  weight?: number;
  dimensions?: string;
  
  // Additional Info
  intention: string;
  element?: string;
  gender?: string;
  origin: string;
  year: string;
  grade: "Standard" | "Premium" | "Luxury";
  
  // Content
  description: string;
  shortDescription: string;
  
  // Media
  images: string[];
  thumbnail: string;
  
  // SEO
  seoTitle?: string;
  seoDescription?: string;
  tags: string[];
  
  // Status
  status: "draft" | "updated" | "pending" | "active" | "archived";
  featured: boolean;
  lastUpdate: string;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export const mockProductsEnhanced: ProductEnhanced[] = [
  {
    id: "prod-001",
    sku: "JW-GLD-001",
    name: "Golden Lotus Bracelet",
    
    categoryId: "cat-001",
    categoryName: "Bracelets",
    collectionIds: ["col-001", "col-005"],
    
    retailPrice: 89.99,
    salePrice: 79.99,
    costPrice: 42.50,
    
    vnStock: 45,
    usStock: 23,
    lowStockThreshold: 15,
    
    materialIds: ["3", "5", "10"], // Gold wire, Lotus charm, Clasp
    diamondIds: [],
    gemstoneIds: ["gem-001"], // Citrine
    
    attributeIds: ["attr-001", "attr-002", "attr-003", "attr-004", "attr-008"],
    
    hasVariants: true,
    variantCount: 3,
    
    weight: 13.0,
    dimensions: "Adjustable 16-20cm",
    
    intention: "Prosperity",
    element: "Earth",
    gender: "Unisex",
    origin: "Vietnam",
    year: "2025",
    grade: "Premium",
    
    description: "Handcrafted golden lotus bracelet featuring natural citrine stones and 18K gold-plated charms. The lotus symbolizes purity, enlightenment, and rebirth, while citrine attracts prosperity and abundance. Each bead is carefully selected and strung to create a harmonious energy flow.",
    shortDescription: "Prosperity bracelet with citrine and lotus charm",
    
    images: [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800",
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800",
    ],
    thumbnail: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=200",
    
    seoTitle: "Golden Lotus Citrine Bracelet | Prosperity Jewelry",
    seoDescription: "Handcrafted golden lotus bracelet with natural citrine for prosperity and abundance. 18K gold plated, adjustable size.",
    tags: ["lotus", "citrine", "prosperity", "gold", "bracelet", "bestseller"],
    
    status: "updated",
    featured: true,
    lastUpdate: "2 hours ago",
    
    createdAt: "2024-06-01T10:00:00Z",
    updatedAt: "2025-10-28T14:30:00Z",
    createdBy: "user-admin-001",
  },
  {
    id: "prod-002",
    sku: "JW-SLV-002",
    name: "Moonlight Pearl Necklace",
    
    categoryId: "cat-002",
    categoryName: "Necklaces",
    collectionIds: ["col-002", "col-007"],
    
    retailPrice: 129.99,
    costPrice: 58.00,
    
    vnStock: 12,
    usStock: 8,
    lowStockThreshold: 10,
    
    materialIds: ["4", "6"], // Silver wire, Moon charm
    diamondIds: [],
    gemstoneIds: ["gem-008", "gem-012"], // Moonstone, Pearl
    
    attributeIds: ["attr-002", "attr-003", "attr-005", "attr-008"],
    
    hasVariants: true,
    variantCount: 2,
    
    weight: 19.0,
    dimensions: "16-18 inches adjustable",
    
    intention: "Harmony",
    element: "Water",
    gender: "Female",
    origin: "Vietnam",
    year: "2025",
    grade: "Premium",
    
    description: "Elegant pearl necklace with moonstone accents and sterling silver moon charm. Moonstone enhances intuition and promotes emotional balance, while pearls symbolize purity and wisdom. Perfect for special occasions or daily wear.",
    shortDescription: "Elegant pearl and moonstone necklace with moon charm",
    
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800",
    ],
    thumbnail: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200",
    
    seoTitle: "Moonlight Pearl Necklace | Sterling Silver Jewelry",
    seoDescription: "Elegant moonstone and pearl necklace with sterling silver moon charm. Perfect for harmony and emotional balance.",
    tags: ["pearl", "moonstone", "moon", "silver", "necklace", "bridal"],
    
    status: "updated",
    featured: true,
    lastUpdate: "5 hours ago",
    
    createdAt: "2024-07-15T10:00:00Z",
    updatedAt: "2025-10-27T11:45:00Z",
    createdBy: "user-admin-001",
  },
  {
    id: "prod-003",
    sku: "JW-RG-003",
    name: "Rose Quartz Heart Ring",
    
    categoryId: "cat-003",
    categoryName: "Rings",
    collectionIds: ["col-003"],
    
    retailPrice: 149.99,
    salePrice: 129.99,
    costPrice: 68.00,
    
    vnStock: 8,
    usStock: 15,
    lowStockThreshold: 10,
    
    materialIds: [], // Custom rose gold casting
    diamondIds: [],
    gemstoneIds: ["gem-002"], // Rose Quartz
    
    attributeIds: ["attr-002", "attr-003", "attr-006", "attr-007", "attr-008"],
    
    hasVariants: true,
    variantCount: 3,
    
    weight: 4.3,
    dimensions: "Heart: 8x8mm",
    
    intention: "Love",
    element: "Fire",
    gender: "Female",
    origin: "Vietnam",
    year: "2024",
    grade: "Luxury",
    
    description: "Beautiful rose quartz ring set in rose gold with a delicate heart shape. Rose quartz is the stone of unconditional love, promoting self-love, compassion, and deep healing of the heart. The rose gold setting adds warmth and feminine energy.",
    shortDescription: "Rose quartz heart ring in rose gold setting",
    
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800",
    ],
    thumbnail: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200",
    
    seoTitle: "Rose Quartz Heart Ring | Love Jewelry",
    seoDescription: "Beautiful rose quartz heart ring in rose gold. Stone of love, compassion, and emotional healing.",
    tags: ["rose-quartz", "heart", "love", "ring", "rose-gold", "valentine"],
    
    status: "pending",
    featured: false,
    lastUpdate: "1 day ago",
    
    createdAt: "2024-02-14T10:00:00Z",
    updatedAt: "2025-10-26T10:15:00Z",
    createdBy: "user-admin-002",
  },
  {
    id: "prod-004",
    sku: "JW-BRC-004",
    name: "Black Obsidian Protection Bracelet",
    
    categoryId: "cat-001",
    categoryName: "Bracelets",
    collectionIds: ["col-004"],
    
    retailPrice: 79.99,
    costPrice: 35.00,
    
    vnStock: 30,
    usStock: 20,
    lowStockThreshold: 15,
    
    materialIds: ["7", "10"], // Obsidian beads, Clasp
    diamondIds: [],
    gemstoneIds: ["gem-004"], // Black Obsidian
    
    attributeIds: ["attr-001", "attr-003", "attr-004", "attr-008", "attr-009"],
    
    hasVariants: true,
    variantCount: 1,
    
    weight: 15.0,
    dimensions: "Adjustable",
    
    intention: "Protection",
    element: "Earth",
    gender: "Unisex",
    origin: "Vietnam",
    year: "2025",
    grade: "Standard",
    
    description: "Powerful black obsidian bracelet for protection and grounding. Black obsidian is a volcanic glass that shields against negativity, absorbs toxic energy, and provides strong psychic protection. Features evil eye charm for additional protection.",
    shortDescription: "Protection bracelet with black obsidian and evil eye",
    
    images: [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800",
    ],
    thumbnail: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=200",
    
    seoTitle: "Black Obsidian Protection Bracelet | Grounding Jewelry",
    seoDescription: "Powerful black obsidian protection bracelet with evil eye charm. Shield against negativity and toxic energy.",
    tags: ["obsidian", "protection", "evil-eye", "grounding", "bracelet"],
    
    status: "updated",
    featured: true,
    lastUpdate: "3 hours ago",
    
    createdAt: "2024-08-01T10:00:00Z",
    updatedAt: "2025-10-28T13:20:00Z",
    createdBy: "user-admin-002",
  },
  {
    id: "prod-005",
    sku: "JW-AME-005",
    name: "Amethyst Energy Bracelet",
    
    categoryId: "cat-001",
    categoryName: "Bracelets",
    collectionIds: ["col-005"],
    
    retailPrice: 75.99,
    costPrice: 32.50,
    
    vnStock: 28,
    usStock: 19,
    lowStockThreshold: 15,
    
    materialIds: ["4", "10"], // Silver, Clasp
    diamondIds: [],
    gemstoneIds: ["gem-003"], // Amethyst
    
    attributeIds: ["attr-001", "attr-002", "attr-003", "attr-004", "attr-007", "attr-008"],
    
    hasVariants: true,
    variantCount: 2,
    
    weight: 12.0,
    dimensions: "Adjustable",
    
    intention: "Peace",
    element: "Air",
    gender: "Unisex",
    origin: "Vietnam",
    year: "2025",
    grade: "Standard",
    
    description: "Natural amethyst bead bracelet for spiritual healing and peace. Amethyst is known for its calming energy, enhancing intuition, and promoting spiritual awareness. Perfect for meditation and stress relief.",
    shortDescription: "Amethyst healing bracelet for peace and clarity",
    
    images: [
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800",
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800",
    ],
    thumbnail: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=200",
    
    seoTitle: "Amethyst Energy Bracelet | Healing Crystal Jewelry",
    seoDescription: "Natural amethyst healing bracelet for peace, intuition, and spiritual awareness. Perfect for meditation.",
    tags: ["amethyst", "healing", "peace", "spiritual", "bracelet", "meditation"],
    
    status: "draft",
    featured: false,
    lastUpdate: "2 days ago",
    
    createdAt: "2024-05-01T10:00:00Z",
    updatedAt: "2025-10-26T09:45:00Z",
    createdBy: "user-admin-001",
  },
];
