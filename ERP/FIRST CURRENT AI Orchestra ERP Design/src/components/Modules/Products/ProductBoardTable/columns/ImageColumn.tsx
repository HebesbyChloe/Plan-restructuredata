import { ProductBoardData } from "../types";

interface ImageColumnProps {
  product: ProductBoardData;
}

export function ImageColumn({ product }: ImageColumnProps) {
  return (
    <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#F8F8F8] dark:bg-muted shadow-sm flex-shrink-0">
      <img
        src={product.thumbnail}
        alt={product.name}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
