import { motion, AnimatePresence } from "motion/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../ui/table";
import { Badge } from "../../../ui/badge";
import { Variant } from "@/sampledata";

// Types
interface VariantTableModuleProps {
  variants: Variant[];
  selectedVariant: Variant | null;
  onVariantClick: (variant: Variant) => void;
}

export function VariantTableModule({
  variants,
  selectedVariant,
  onVariantClick,
}: VariantTableModuleProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#F8F8F8] dark:bg-muted/50 hover:bg-[#F8F8F8] dark:hover:bg-muted/50">
            <TableHead className="w-[140px]">SKU</TableHead>
            <TableHead className="min-w-[240px]">Variant Name</TableHead>
            <TableHead className="min-w-[200px]">Attributes</TableHead>
            <TableHead className="w-[120px] text-right">Price</TableHead>
            <TableHead className="w-[80px] text-right">VN</TableHead>
            <TableHead className="w-[80px] text-right">US</TableHead>
            <TableHead className="w-[100px]">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence>
            {variants.map((variant, index) => (
              <motion.tr
                key={variant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className={`border-b border-[#E5E5E5] dark:border-border cursor-pointer transition-colors ${
                  selectedVariant?.id === variant.id
                    ? "bg-[#DAB785]/10 dark:bg-[#DAB785]/20"
                    : "hover:bg-[#F8F8F8] dark:hover:bg-muted/30"
                }`}
                onClick={() => onVariantClick(variant)}
              >
                <TableCell>
                  <span className="font-mono text-sm text-muted-foreground">{variant.sku}</span>
                </TableCell>
                <TableCell>
                  <p className="mb-0">{variant.name}</p>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(variant.attributes).map(([key, value], i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {key}: {value}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="text-sm">{formatCurrency(variant.price)}</div>
                  {variant.compareAtPrice && (
                    <div className="text-xs text-muted-foreground line-through">
                      {formatCurrency(variant.compareAtPrice)}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right text-sm">
                  {variant.vnStock}
                </TableCell>
                <TableCell className="text-right text-sm">
                  {variant.usStock}
                </TableCell>
                <TableCell>
                  <Badge className={`text-xs ${variant.isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'}`}>
                    {variant.isActive ? 'Active' : 'Inactive'}
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
