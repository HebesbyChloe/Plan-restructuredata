import { CustomProduct } from "@/sampledata/customProducts";

export interface CustomProductTableModuleProps {
  customProducts: CustomProduct[];
  selectedProduct: CustomProduct | null;
  onProductClick: (product: CustomProduct) => void;
}

export type { CustomProduct };
