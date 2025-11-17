import { motion, AnimatePresence } from "motion/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import { COLUMN_WIDTHS } from "./utils/productBoardTableConstants";

// Types
interface ProductBoardData {
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
  status: "draft" | "updated" | "pending";
  lastUpdate: string;
  thumbnail: string;
}

interface ProductBoardTableModuleProps {
  products: ProductBoardData[];
  selectedProduct: ProductBoardData | null;
  onProductClick: (product: ProductBoardData) => void;
  searchTerm?: string;
}
import {
  ImageColumn,
  ProductInfoColumn,
  PriceColumn,
  StockColumn,
  TotalStockColumn,
  StatusColumn,
  LastUpdateColumn,
} from "./columns";

export function ProductBoardTableModule({
  products,
  selectedProduct,
  onProductClick,
}: ProductBoardTableModuleProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#F8F8F8] dark:bg-muted/50 hover:bg-[#F8F8F8] dark:hover:bg-muted/50">
            <TableHead className={COLUMN_WIDTHS.IMAGE}>Image</TableHead>
            <TableHead className={COLUMN_WIDTHS.PRODUCT_INFO}>Product Info</TableHead>
            <TableHead className={`${COLUMN_WIDTHS.PRICE} text-right`}>Price</TableHead>
            <TableHead className={`${COLUMN_WIDTHS.VN_STOCK} text-right`}>VN Stock</TableHead>
            <TableHead className={`${COLUMN_WIDTHS.US_STOCK} text-right`}>US Stock</TableHead>
            <TableHead className={`${COLUMN_WIDTHS.TOTAL} text-right`}>Total</TableHead>
            <TableHead className={COLUMN_WIDTHS.STATUS}>Status</TableHead>
            <TableHead className={COLUMN_WIDTHS.LAST_UPDATE}>Last Update</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence>
            {products.map((product, index) => (
              <motion.tr
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className={`border-b border-[#E5E5E5] dark:border-border cursor-pointer transition-colors ${
                  selectedProduct?.id === product.id
                    ? "bg-[#DAB785]/10 dark:bg-[#DAB785]/20"
                    : "hover:bg-[#F8F8F8] dark:hover:bg-muted/30"
                }`}
                onClick={() => onProductClick(product)}
              >
                <TableCell className={COLUMN_WIDTHS.IMAGE}>
                  <ImageColumn product={product} />
                </TableCell>
                <TableCell className={COLUMN_WIDTHS.PRODUCT_INFO}>
                  <ProductInfoColumn product={product} />
                </TableCell>
                <TableCell className={`${COLUMN_WIDTHS.PRICE}`}>
                  <PriceColumn product={product} />
                </TableCell>
                <TableCell className={`${COLUMN_WIDTHS.VN_STOCK}`}>
                  <StockColumn value={product.vnStock} />
                </TableCell>
                <TableCell className={`${COLUMN_WIDTHS.US_STOCK}`}>
                  <StockColumn value={product.usStock} />
                </TableCell>
                <TableCell className={`${COLUMN_WIDTHS.TOTAL}`}>
                  <TotalStockColumn product={product} />
                </TableCell>
                <TableCell className={COLUMN_WIDTHS.STATUS}>
                  <StatusColumn product={product} />
                </TableCell>
                <TableCell className={COLUMN_WIDTHS.LAST_UPDATE}>
                  <LastUpdateColumn product={product} />
                </TableCell>
              </motion.tr>
            ))}
          </AnimatePresence>
        </TableBody>
      </Table>
    </div>
  );
}
