import { Clock } from "lucide-react";
import { ProductBoardData } from "../types";

interface LastUpdateColumnProps {
  product: ProductBoardData;
}

export function LastUpdateColumn({ product }: LastUpdateColumnProps) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <Clock className="w-3 h-3" />
      {product.lastUpdate}
    </div>
  );
}
