// Product Table Modules - Central Export

export { ProductBoardTableModule } from "./ProductBoardTable";
export type { ProductBoardData, ProductBoardTableModuleProps } from "./ProductBoardTable";

export { MaterialTableModule } from "./MaterialTable";
export type { Material, MaterialTableModuleProps } from "./MaterialTable";

export { DiamondTableModule, GemstoneTableModule } from "./DiamondGemstoneTable";
export type { Diamond, Gemstone, DiamondTableModuleProps, GemstoneTableModuleProps } from "./DiamondGemstoneTable";

export { CollectionTableModule } from "./CollectionTable";
export type { Collection, CollectionTableModuleProps } from "./CollectionTable";

export { BundleTableModule } from "./BundleTable";
export type { Bundle, BundleTableModuleProps } from "./BundleTable";

export { PricingRuleTableModule } from "./PricingRuleTable";
export type { PricingRule, PricingRuleTableModuleProps } from "./PricingRuleTable";

export { AttributeTableModule, VariantTableModule } from "./AttributeVariantTable";
export type { Attribute, Variant, AttributeTableModuleProps, VariantTableModuleProps } from "./AttributeVariantTable";

export { CustomProductTableModule } from "./CustomProductTable";
export type { CustomProduct, CustomProductTableModuleProps } from "./CustomProductTable";

// Product Detail Panel & Helper Components
export { ProductDetailPanel, InfoCard, StockCard, FormField } from "./ProductDetailPanel";
