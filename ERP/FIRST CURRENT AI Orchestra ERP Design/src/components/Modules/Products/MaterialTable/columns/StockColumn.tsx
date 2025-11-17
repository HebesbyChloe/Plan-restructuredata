import { Material } from "../types";
import { isLowStock } from "../utils/materialTableHelpers";

interface StockColumnProps {
  material: Material;
}

export function StockColumn({ material }: StockColumnProps) {
  const lowStock = isLowStock(material);
  
  return (
    <div className="text-right">
      <div className={lowStock ? "text-red-600 dark:text-red-400" : ""}>
        {material.quantityInStock.toLocaleString()}
      </div>
      <div className="text-xs text-muted-foreground">
        {material.unit}
      </div>
    </div>
  );
}
