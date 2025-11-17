/**
 * Products Module - Centralized Type Definitions
 * All types for Products modules (ProductBoard, Materials, Diamonds, etc.)
 */

import {
  Attribute,
  Variant,
  Bundle,
  Collection,
  Diamond,
  Gemstone,
  Material,
  PricingRule,
} from "../../sampledata";
import { CustomProduct } from "../../sampledata/customProducts";

// Re-export from sampledata
export type { Attribute, Variant, Bundle, Collection, Diamond, Gemstone, Material, PricingRule, CustomProduct };

// ============================================
// PRODUCT BOARD TABLE TYPES
// ============================================

export interface ProductBoardData {
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

export interface ProductBoardTableModuleProps {
  products: ProductBoardData[];
  selectedProduct: ProductBoardData | null;
  onProductClick: (product: ProductBoardData) => void;
  searchTerm?: string;
}

// ============================================
// ATTRIBUTE & VARIANT TABLE TYPES
// ============================================

export interface AttributeTableModuleProps {
  attributes: Attribute[];
  selectedAttribute: Attribute | null;
  onAttributeClick: (attribute: Attribute) => void;
}

export interface VariantTableModuleProps {
  variants: Variant[];
  selectedVariant: Variant | null;
  onVariantClick: (variant: Variant) => void;
}

// ============================================
// BUNDLE TABLE TYPES
// ============================================

export interface BundleTableModuleProps {
  bundles: Bundle[];
  selectedBundle: Bundle | null;
  onBundleClick: (bundle: Bundle) => void;
}

// ============================================
// COLLECTION TABLE TYPES
// ============================================

export interface CollectionTableModuleProps {
  collections: Collection[];
  selectedCollection: Collection | null;
  onCollectionClick: (collection: Collection) => void;
}

// ============================================
// CUSTOM PRODUCT TABLE TYPES
// ============================================

export interface CustomProductTableModuleProps {
  customProducts: CustomProduct[];
  selectedProduct: CustomProduct | null;
  onProductClick: (product: CustomProduct) => void;
}

// ============================================
// DIAMOND & GEMSTONE TABLE TYPES
// ============================================

export interface DiamondTableModuleProps {
  diamonds: Diamond[];
  selectedDiamond: Diamond | null;
  onDiamondClick: (diamond: Diamond) => void;
}

export interface GemstoneTableModuleProps {
  gemstones: Gemstone[];
  selectedGemstone: Gemstone | null;
  onGemstoneClick: (gemstone: Gemstone) => void;
}

// ============================================
// MATERIAL TABLE TYPES
// ============================================

export interface MaterialTableModuleProps {
  materials: Material[];
  selectedMaterial: Material | null;
  onMaterialClick: (material: Material) => void;
  searchTerm?: string;
}

// ============================================
// PRICING RULE TABLE TYPES
// ============================================

export interface PricingRuleTableModuleProps {
  rules: PricingRule[];
  selectedRule: PricingRule | null;
  onRuleClick: (rule: PricingRule) => void;
}
