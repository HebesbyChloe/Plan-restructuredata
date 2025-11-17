import { ProductBoardData } from "../types";

interface PriceColumnProps {
  product: ProductBoardData;
}

export function PriceColumn({ product }: PriceColumnProps) {
  return (
    <div className="text-right">
      <p className="mb-0">${product.retailPrice}</p>
      {product.salePrice && (
        <p className="text-xs text-[#DAB785] mb-0">${product.salePrice}</p>
      )}
    </div>
  );
}
