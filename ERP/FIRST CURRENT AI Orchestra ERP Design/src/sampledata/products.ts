export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  collection: string;
  intention: string;
  retailPrice: number;
  salePrice?: number;
  vnStock: number;
  usStock: number;
  material: string;
  stone?: string;
  charm?: string;
  charmSize?: string;
  beadSize?: string;
  color?: string;
  element?: string;
  size?: string;
  gender?: string;
  origin?: string;
  year?: string;
  grade?: string;
  description: string;
  images: string[];
  status: "draft" | "updated" | "pending";
  lastUpdate: string;
  thumbnail: string;
}

export const mockProducts: Product[] = [
  {
    id: "1",
    sku: "JW-GLD-001",
    name: "Golden Lotus Bracelet",
    category: "Bracelet",
    collection: "Sacred Lotus",
    intention: "Prosperity",
    retailPrice: 89.99,
    salePrice: 79.99,
    vnStock: 45,
    usStock: 23,
    material: "18K Gold Plated",
    stone: "Citrine",
    charm: "Lotus",
    charmSize: "12mm",
    beadSize: "8mm",
    color: "Gold",
    element: "Earth",
    size: "Adjustable",
    gender: "Unisex",
    origin: "Vietnam",
    year: "2025",
    grade: "Premium",
    description: "Handcrafted golden lotus bracelet featuring natural citrine stones and 18K gold-plated charms.",
    images: [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800",
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800",
    ],
    status: "updated",
    lastUpdate: "2 hours ago",
    thumbnail: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=200",
  },
  {
    id: "2",
    sku: "JW-SLV-002",
    name: "Moonlight Pearl Necklace",
    category: "Necklace",
    collection: "Celestial",
    intention: "Harmony",
    retailPrice: 129.99,
    vnStock: 12,
    usStock: 8,
    material: "Sterling Silver",
    stone: "Pearl",
    charm: "Moon",
    charmSize: "15mm",
    beadSize: "6mm",
    color: "Silver",
    element: "Water",
    size: "18 inches",
    gender: "Female",
    origin: "Vietnam",
    year: "2025",
    grade: "Premium",
    description: "Elegant pearl necklace with sterling silver moon charm.",
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800",
    ],
    status: "updated",
    lastUpdate: "5 hours ago",
    thumbnail: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200",
  },
  {
    id: "3",
    sku: "JW-RG-003",
    name: "Rose Quartz Ring",
    category: "Ring",
    collection: "Love Collection",
    intention: "Love",
    retailPrice: 149.99,
    salePrice: 129.99,
    vnStock: 8,
    usStock: 15,
    material: "Rose Gold",
    stone: "Rose Quartz",
    color: "Rose Gold",
    element: "Fire",
    size: "Size 7",
    gender: "Female",
    origin: "Vietnam",
    year: "2024",
    grade: "Luxury",
    description: "Beautiful rose quartz ring set in rose gold.",
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800",
    ],
    status: "pending",
    lastUpdate: "1 day ago",
    thumbnail: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200",
  },
  {
    id: "4",
    sku: "JW-BRC-004",
    name: "Black Obsidian Protection Bracelet",
    category: "Bracelet",
    collection: "Protection",
    intention: "Protection",
    retailPrice: 79.99,
    vnStock: 30,
    usStock: 20,
    material: "Natural Stone",
    stone: "Black Obsidian",
    charm: "Evil Eye",
    charmSize: "10mm",
    beadSize: "10mm",
    color: "Black",
    element: "Earth",
    size: "Adjustable",
    gender: "Unisex",
    origin: "Vietnam",
    year: "2025",
    grade: "Standard",
    description: "Powerful black obsidian bracelet for protection and grounding.",
    images: [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800",
    ],
    status: "updated",
    lastUpdate: "3 hours ago",
    thumbnail: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=200",
  },
];
