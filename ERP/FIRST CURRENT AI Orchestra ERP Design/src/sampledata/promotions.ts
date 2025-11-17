// Sample promotion and coupon code data

export interface Promotion {
  id: string;
  code: string;
  name: string;
  type: "percentage" | "fixed_amount" | "free_shipping" | "buy_x_get_y";
  discountValue: number; // Percentage (0-100) or fixed amount
  minimumPurchase?: number;
  maxDiscount?: number;
  validFrom: string;
  validTo: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  applicableProducts?: string[]; // Product IDs, empty = all products
  description: string;
}

export const PROMOTIONS: Promotion[] = [
  {
    id: "promo-1",
    code: "WELCOME15",
    name: "Welcome 15% Off",
    type: "percentage",
    discountValue: 15,
    minimumPurchase: 50,
    maxDiscount: 100,
    validFrom: "2024-01-01",
    validTo: "2024-12-31",
    usageLimit: 1000,
    usedCount: 234,
    isActive: true,
    description: "15% off for new customers (max $100 off)",
  },
  {
    id: "promo-2",
    code: "SAVE20",
    name: "Save 20% on Orders Over $100",
    type: "percentage",
    discountValue: 20,
    minimumPurchase: 100,
    maxDiscount: 200,
    validFrom: "2024-01-01",
    validTo: "2024-12-31",
    usageLimit: 500,
    usedCount: 156,
    isActive: true,
    description: "20% off orders over $100 (max $200 off)",
  },
  {
    id: "promo-3",
    code: "FREESHIP",
    name: "Free Shipping",
    type: "free_shipping",
    discountValue: 0,
    minimumPurchase: 75,
    validFrom: "2024-01-01",
    validTo: "2024-12-31",
    isActive: true,
    description: "Free shipping on orders over $75",
  },
  {
    id: "promo-4",
    code: "SUMMER25",
    name: "Summer Sale 25% Off",
    type: "percentage",
    discountValue: 25,
    minimumPurchase: 150,
    maxDiscount: 300,
    validFrom: "2024-06-01",
    validTo: "2024-08-31",
    usageLimit: 2000,
    usedCount: 892,
    isActive: true,
    description: "25% off summer collection (max $300 off)",
  },
  {
    id: "promo-5",
    code: "FLASH50",
    name: "Flash Sale $50 Off",
    type: "fixed_amount",
    discountValue: 50,
    minimumPurchase: 200,
    validFrom: "2024-10-01",
    validTo: "2024-10-31",
    usageLimit: 100,
    usedCount: 87,
    isActive: true,
    description: "$50 off orders over $200",
  },
  {
    id: "promo-6",
    code: "VIP30",
    name: "VIP 30% Discount",
    type: "percentage",
    discountValue: 30,
    minimumPurchase: 0,
    maxDiscount: 500,
    validFrom: "2024-01-01",
    validTo: "2024-12-31",
    isActive: true,
    description: "VIP member exclusive 30% off (max $500 off)",
  },
  {
    id: "promo-7",
    code: "CRYSTAL10",
    name: "Crystal Lovers 10% Off",
    type: "percentage",
    discountValue: 10,
    minimumPurchase: 30,
    validFrom: "2024-01-01",
    validTo: "2024-12-31",
    usageLimit: 5000,
    usedCount: 1234,
    isActive: true,
    applicableProducts: ["prod-1", "prod-2", "prod-3"],
    description: "10% off all crystal products",
  },
  {
    id: "promo-8",
    code: "BOGO",
    name: "Buy One Get One 50% Off",
    type: "buy_x_get_y",
    discountValue: 50,
    minimumPurchase: 0,
    validFrom: "2024-01-01",
    validTo: "2024-12-31",
    usageLimit: 1000,
    usedCount: 445,
    isActive: true,
    description: "Buy one, get one 50% off (equal or lesser value)",
  },
  {
    id: "promo-9",
    code: "LOYALTY5",
    name: "Loyalty Reward $5 Off",
    type: "fixed_amount",
    discountValue: 5,
    minimumPurchase: 25,
    validFrom: "2024-01-01",
    validTo: "2024-12-31",
    isActive: true,
    description: "Loyalty member $5 off orders over $25",
  },
  {
    id: "promo-10",
    code: "NEWYEAR2024",
    name: "New Year Special 35% Off",
    type: "percentage",
    discountValue: 35,
    minimumPurchase: 200,
    maxDiscount: 400,
    validFrom: "2024-01-01",
    validTo: "2024-01-31",
    usageLimit: 500,
    usedCount: 500,
    isActive: false,
    description: "New Year special 35% off (max $400 off) - EXPIRED",
  },
];

export const getPromotionByCode = (code: string): Promotion | undefined => {
  return PROMOTIONS.find((promo) => promo.code === code);
};

export const getActivePromotions = (): Promotion[] => {
  return PROMOTIONS.filter((promo) => promo.isActive);
};

export const calculateDiscount = (
  promotion: Promotion,
  subtotal: number
): number => {
  if (!promotion.isActive) return 0;
  
  // Check minimum purchase
  if (promotion.minimumPurchase && subtotal < promotion.minimumPurchase) {
    return 0;
  }

  let discount = 0;

  switch (promotion.type) {
    case "percentage":
      discount = (subtotal * promotion.discountValue) / 100;
      if (promotion.maxDiscount && discount > promotion.maxDiscount) {
        discount = promotion.maxDiscount;
      }
      break;
    case "fixed_amount":
      discount = promotion.discountValue;
      break;
    case "free_shipping":
      // Shipping discount would be calculated separately
      discount = 0;
      break;
    case "buy_x_get_y":
      // Would need product-level logic
      discount = 0;
      break;
  }

  return discount;
};
