import { motion, AnimatePresence } from "motion/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../ui/table";
import { Badge } from "../../../ui/badge";
import { CustomProduct } from "@/sampledata/customProducts";

// Types
interface CustomProductTableModuleProps {
  customProducts: CustomProduct[];
  selectedProduct: CustomProduct | null;
  onProductClick: (product: CustomProduct) => void;
}

const STATUS_COLORS = {
  pending_approval: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  in_design: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  in_production: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
  quality_check: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-400",
  completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
} as const;

const TYPE_COLORS = {
  engraving: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400",
  design: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400",
  sizing: "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-400",
  stone_selection: "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-400",
  full_custom: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950 dark:text-fuchsia-400",
} as const;

export function CustomProductTableModule({
  customProducts = [],
  selectedProduct,
  onProductClick,
}: CustomProductTableModuleProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#F8F8F8] dark:bg-muted/50 hover:bg-[#F8F8F8] dark:hover:bg-muted/50">
            <TableHead className="w-[140px]">Order #</TableHead>
            <TableHead className="min-w-[180px]">Customer</TableHead>
            <TableHead className="min-w-[140px]">Type</TableHead>
            <TableHead className="min-w-[120px]">Product</TableHead>
            <TableHead className="min-w-[200px]">Specifications</TableHead>
            <TableHead className="w-[120px] text-right">Price</TableHead>
            <TableHead className="w-[130px]">Est. Completion</TableHead>
            <TableHead className="w-[140px]">Assigned To</TableHead>
            <TableHead className="w-[140px]">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence>
            {customProducts.map((product, index) => (
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
                <TableCell>
                  <span className="font-mono text-sm">{product.orderNumber}</span>
                </TableCell>
                <TableCell>
                  <p className="mb-0">{product.customerName}</p>
                </TableCell>
                <TableCell>
                  <Badge className={`text-xs capitalize ${TYPE_COLORS[product.customizationType]}`}>
                    {product.customizationType.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <p className="text-sm mb-0 capitalize">{product.productType}</p>
                  {product.baseProduct && (
                    <p className="text-xs text-muted-foreground mb-0">{product.baseProduct}</p>
                  )}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {Object.entries(product.specifications).slice(0, 2).map(([key, value]) => (
                      value && (
                        <div key={key} className="text-xs">
                          <span className="text-muted-foreground capitalize">{key.replace('_', ' ')}: </span>
                          <span className="truncate">{value}</span>
                        </div>
                      )
                    ))}
                    {Object.keys(product.specifications).length > 2 && (
                      <p className="text-xs text-muted-foreground mb-0">
                        +{Object.keys(product.specifications).length - 2} more
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="text-sm">{formatCurrency(product.totalPrice)}</div>
                  {product.customizationFee > 0 && (
                    <div className="text-xs text-muted-foreground">
                      +{formatCurrency(product.customizationFee)} custom
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <p className="text-sm mb-0">{formatDate(product.estimatedCompletion)}</p>
                </TableCell>
                <TableCell>
                  <p className="text-sm mb-0">{product.assignedTo}</p>
                </TableCell>
                <TableCell>
                  <Badge className={`text-xs capitalize ${STATUS_COLORS[product.status]}`}>
                    {product.status.replace('_', ' ')}
                  </Badge>
                </TableCell>
              </motion.tr>
            ))}
          </AnimatePresence>
        </TableBody>
      </Table>
    </div>
  );
}
