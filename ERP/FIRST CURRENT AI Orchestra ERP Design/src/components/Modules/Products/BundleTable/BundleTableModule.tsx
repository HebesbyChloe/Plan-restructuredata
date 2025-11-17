import { motion, AnimatePresence } from "motion/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../ui/table";
import { Badge } from "../../../ui/badge";
import { Bundle } from "@/sampledata";

// Types
interface BundleTableModuleProps {
  bundles: Bundle[];
  selectedBundle: Bundle | null;
  onBundleClick: (bundle: Bundle) => void;
}

const STATUS_COLORS = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  draft: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  scheduled: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  expired: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
} as const;

export function BundleTableModule({
  bundles,
  selectedBundle,
  onBundleClick,
}: BundleTableModuleProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#F8F8F8] dark:bg-muted/50 hover:bg-[#F8F8F8] dark:hover:bg-muted/50">
            <TableHead className="min-w-[240px]">Bundle Name</TableHead>
            <TableHead className="w-[100px]">Products</TableHead>
            <TableHead className="w-[140px] text-right">Regular Price</TableHead>
            <TableHead className="w-[140px] text-right">Bundle Price</TableHead>
            <TableHead className="w-[120px] text-right">Savings</TableHead>
            <TableHead className="w-[100px] text-right">Stock</TableHead>
            <TableHead className="w-[120px]">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence>
            {bundles.map((bundle, index) => (
              <motion.tr
                key={bundle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className={`border-b border-[#E5E5E5] dark:border-border cursor-pointer transition-colors ${
                  selectedBundle?.id === bundle.id
                    ? "bg-[#DAB785]/10 dark:bg-[#DAB785]/20"
                    : "hover:bg-[#F8F8F8] dark:hover:bg-muted/30"
                }`}
                onClick={() => onBundleClick(bundle)}
              >
                <TableCell>
                  <div>
                    <p className="mb-0">{bundle.name}</p>
                    <p className="text-xs text-muted-foreground mb-0 capitalize">{bundle.bundleType}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{bundle.products.length}</span>
                </TableCell>
                <TableCell className="text-right text-sm">
                  {formatCurrency(bundle.totalRegularPrice)}
                </TableCell>
                <TableCell className="text-right text-sm">
                  {formatCurrency(bundle.finalPrice)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="text-sm text-green-600 dark:text-green-400">
                    -{bundle.savingsPercentage.toFixed(0)}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatCurrency(bundle.savings)}
                  </div>
                </TableCell>
                <TableCell className="text-right text-sm">
                  {bundle.vnStock + bundle.usStock}
                </TableCell>
                <TableCell>
                  <Badge className={`text-xs capitalize ${STATUS_COLORS[bundle.status]}`}>
                    {bundle.status}
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
