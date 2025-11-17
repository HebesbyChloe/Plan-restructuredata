export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentId: string | null;
  imageUrl: string;
  productCount: number;
  isActive: boolean;
  sortOrder: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export const mockCategories: Category[] = [
  {
    id: "cat-001",
    name: "Bracelets",
    slug: "bracelets",
    description: "Handcrafted bracelets with natural stones and precious metals",
    parentId: null,
    imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400",
    productCount: 48,
    isActive: true,
    sortOrder: 1,
    seoTitle: "Handcrafted Bracelets | Natural Stone Jewelry",
    seoDescription: "Discover our collection of handcrafted bracelets featuring natural stones, crystals, and precious metals.",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2025-10-20T15:30:00Z",
  },
  {
    id: "cat-002",
    name: "Necklaces",
    slug: "necklaces",
    description: "Elegant necklaces and pendants",
    parentId: null,
    imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400",
    productCount: 35,
    isActive: true,
    sortOrder: 2,
    seoTitle: "Necklaces & Pendants | Crystal Jewelry",
    seoDescription: "Browse our stunning collection of necklaces and pendants with healing crystals.",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2025-10-20T15:30:00Z",
  },
  {
    id: "cat-003",
    name: "Rings",
    slug: "rings",
    description: "Stunning rings with precious stones",
    parentId: null,
    imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400",
    productCount: 27,
    isActive: true,
    sortOrder: 3,
    seoTitle: "Crystal & Gemstone Rings | Handmade Jewelry",
    seoDescription: "Shop our collection of handcrafted rings featuring crystals and gemstones.",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2025-10-20T15:30:00Z",
  },
  {
    id: "cat-004",
    name: "Earrings",
    slug: "earrings",
    description: "Beautiful earrings for every occasion",
    parentId: null,
    imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400",
    productCount: 32,
    isActive: true,
    sortOrder: 4,
    seoTitle: "Crystal Earrings | Handmade Jewelry",
    seoDescription: "Discover our handcrafted earrings collection with natural crystals.",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2025-10-20T15:30:00Z",
  },
  {
    id: "cat-005",
    name: "Pendants",
    slug: "pendants",
    description: "Meaningful pendant charms and amulets",
    parentId: null,
    imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400",
    productCount: 22,
    isActive: true,
    sortOrder: 5,
    seoTitle: "Crystal Pendants & Amulets | Spiritual Jewelry",
    seoDescription: "Explore our spiritual pendants and amulets with healing crystals.",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2025-10-20T15:30:00Z",
  },
  {
    id: "cat-101",
    name: "Beaded Bracelets",
    slug: "beaded-bracelets",
    description: "Natural stone beaded bracelets",
    parentId: "cat-001",
    imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400",
    productCount: 32,
    isActive: true,
    sortOrder: 11,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2025-10-20T15:30:00Z",
  },
  {
    id: "cat-102",
    name: "Charm Bracelets",
    slug: "charm-bracelets",
    description: "Symbolic charm bracelets with meaning",
    parentId: "cat-001",
    imageUrl: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400",
    productCount: 16,
    isActive: true,
    sortOrder: 12,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2025-10-20T15:30:00Z",
  },
];
