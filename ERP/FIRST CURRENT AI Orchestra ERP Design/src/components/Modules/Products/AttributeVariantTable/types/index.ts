import { Attribute, Variant } from "@/sampledata";

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

export type { Attribute, Variant };
