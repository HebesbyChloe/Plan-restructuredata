import { Badge } from "../../../../ui/badge";
import { ProductBoardData } from "../types";
import { getStatusColor } from "../utils/productBoardTableHelpers";

interface StatusColumnProps {
  product: ProductBoardData;
}

export function StatusColumn({ product }: StatusColumnProps) {
  return (
    <Badge className={`text-xs ${getStatusColor(product.status)}`}>
      {product.status}
    </Badge>
  );
}
