import { ProductBoardData } from "../types";
import { isLowStock, getTotalStock } from "../utils/productBoardTableHelpers";

interface TotalStockColumnProps {
  product: ProductBoardData;
}

export function TotalStockColumn({ product }: TotalStockColumnProps) {
  const total = getTotalStock(product);
  const isLow = isLowStock(product);

  return (
    <div className="text-right">
      <span
        className={
          isLow ? "text-red-600 dark:text-red-400" : ""
        }
      >
        {total}
      </span>
    </div>
  );
}
