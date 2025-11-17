// Sample product catalog for order editing

export interface ProductCatalogItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  stockInHouse: number;
  stockGlobal: number;
  category: string;
  imageUrl?: string;
}

export const PRODUCT_CATALOG: ProductCatalogItem[] = [
  {
    id: "prod-1",
    name: "Amethyst Crystal Bracelet",
    sku: "BRC-AME-001",
    price: 120.00,
    stockInHouse: 15,
    stockGlobal: 48,
    category: "Bracelets",
  },
  {
    id: "prod-2",
    name: "Rose Quartz Pendant",
    sku: "PND-RQ-003",
    price: 45.00,
    stockInHouse: 8,
    stockGlobal: 32,
    category: "Pendants",
  },
  {
    id: "prod-3",
    name: "Citrine Ring - Size 7",
    sku: "RNG-CIT-007",
    price: 89.00,
    stockInHouse: 5,
    stockGlobal: 20,
    category: "Rings",
  },
  {
    id: "prod-4",
    name: "Clear Quartz Necklace",
    sku: "NCK-CQ-012",
    price: 65.00,
    stockInHouse: 12,
    stockGlobal: 45,
    category: "Necklaces",
  },
  {
    id: "prod-5",
    name: "Turquoise Earrings",
    sku: "EAR-TRQ-008",
    price: 55.00,
    stockInHouse: 18,
    stockGlobal: 62,
    category: "Earrings",
  },
  {
    id: "prod-6",
    name: "Black Tourmaline Bracelet",
    sku: "BRC-BT-004",
    price: 95.00,
    stockInHouse: 7,
    stockGlobal: 28,
    category: "Bracelets",
  },
  {
    id: "prod-7",
    name: "Moonstone Pendant",
    sku: "PND-MS-015",
    price: 78.00,
    stockInHouse: 10,
    stockGlobal: 35,
    category: "Pendants",
  },
  {
    id: "prod-8",
    name: "Sapphire Ring - Size 6",
    sku: "RNG-SAP-006",
    price: 250.00,
    stockInHouse: 3,
    stockGlobal: 12,
    category: "Rings",
  },
  {
    id: "prod-9",
    name: "Garnet Necklace",
    sku: "NCK-GAR-019",
    price: 135.00,
    stockInHouse: 6,
    stockGlobal: 24,
    category: "Necklaces",
  },
  {
    id: "prod-10",
    name: "Pearl Earrings",
    sku: "EAR-PRL-011",
    price: 145.00,
    stockInHouse: 9,
    stockGlobal: 38,
    category: "Earrings",
  },
  {
    id: "prod-11",
    name: "Lapis Lazuli Bracelet",
    sku: "BRC-LL-022",
    price: 110.00,
    stockInHouse: 11,
    stockGlobal: 42,
    category: "Bracelets",
  },
  {
    id: "prod-12",
    name: "Opal Pendant",
    sku: "PND-OPL-025",
    price: 185.00,
    stockInHouse: 4,
    stockGlobal: 16,
    category: "Pendants",
  },
  {
    id: "prod-13",
    name: "Emerald Ring - Size 8",
    sku: "RNG-EMR-008",
    price: 320.00,
    stockInHouse: 2,
    stockGlobal: 8,
    category: "Rings",
  },
  {
    id: "prod-14",
    name: "Aquamarine Necklace",
    sku: "NCK-AQM-030",
    price: 198.00,
    stockInHouse: 5,
    stockGlobal: 22,
    category: "Necklaces",
  },
  {
    id: "prod-15",
    name: "Ruby Earrings",
    sku: "EAR-RBY-017",
    price: 275.00,
    stockInHouse: 3,
    stockGlobal: 14,
    category: "Earrings",
  },
  {
    id: "prod-16",
    name: "Tiger's Eye Bracelet",
    sku: "BRC-TE-033",
    price: 68.00,
    stockInHouse: 20,
    stockGlobal: 75,
    category: "Bracelets",
  },
  {
    id: "prod-17",
    name: "Jade Pendant",
    sku: "PND-JDE-028",
    price: 92.00,
    stockInHouse: 13,
    stockGlobal: 48,
    category: "Pendants",
  },
  {
    id: "prod-18",
    name: "Diamond Ring - Size 7",
    sku: "RNG-DIA-007",
    price: 899.00,
    stockInHouse: 1,
    stockGlobal: 5,
    category: "Rings",
  },
  {
    id: "prod-19",
    name: "Tanzanite Necklace",
    sku: "NCK-TNZ-041",
    price: 425.00,
    stockInHouse: 2,
    stockGlobal: 9,
    category: "Necklaces",
  },
  {
    id: "prod-20",
    name: "Peridot Earrings",
    sku: "EAR-PRD-023",
    price: 88.00,
    stockInHouse: 14,
    stockGlobal: 52,
    category: "Earrings",
  },
];

export const searchProducts = (query: string): ProductCatalogItem[] => {
  const lowerQuery = query.toLowerCase();
  return PRODUCT_CATALOG.filter(
    (product) =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.sku.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery)
  );
};

export const getProductById = (id: string): ProductCatalogItem | undefined => {
  return PRODUCT_CATALOG.find((product) => product.id === id);
};

export const getProductsBySKU = (sku: string): ProductCatalogItem | undefined => {
  return PRODUCT_CATALOG.find((product) => product.sku === sku);
};
