import { Badge } from "../../../../ui/badge";
import { ProductBoardData } from "../types";

interface ProductInfoColumnProps {
  product: ProductBoardData;
}

export function ProductInfoColumn({ product }: ProductInfoColumnProps) {
  return (
    <div>
      <p className="mb-1">{product.name}</p>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">{product.sku}</span>
        <span className="text-xs text-muted-foreground">•</span>
        <Badge variant="outline" className="text-xs">
          {product.category}
        </Badge>
      </div>
    </div>
  );
}
