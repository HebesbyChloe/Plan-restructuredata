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
  totalStock?: number;
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
  status: "draft" | "updated" | "pending" | "published";
  lastUpdate: string;
  thumbnail: string;
  product_type?: 'standard' | 'customize' | 'variant' | 'set' | 'jewelry' | 'diamond' | 'gemstone';
}

export interface ProductBoardTableModuleProps {
  products: ProductBoardData[];
  selectedProduct: ProductBoardData | null;
  onProductClick: (product: ProductBoardData) => void;
  searchTerm?: string;
}
