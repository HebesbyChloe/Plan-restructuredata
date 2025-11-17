import { motion, AnimatePresence } from "motion/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import { Badge } from "../../../ui/badge";
import { Material } from "@/sampledata";
import { COLUMN_WIDTHS } from "./utils/materialTableConstants";
import { formatCurrency } from "./utils/materialTableHelpers";

// Types
interface MaterialTableModuleProps {
  materials: Material[];
  selectedMaterial: Material | null;
  onMaterialClick: (material: Material) => void;
  searchTerm?: string;
}
import {
  SKUColumn,
  NameColumn,
  CategoryColumn,
  StockColumn,
  StatusColumn,
} from "./columns";

export function MaterialTableModule({
  materials,
  selectedMaterial,
  onMaterialClick,
}: MaterialTableModuleProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#F8F8F8] dark:bg-muted/50 hover:bg-[#F8F8F8] dark:hover:bg-muted/50">
            <TableHead className={COLUMN_WIDTHS.SKU}>SKU</TableHead>
            <TableHead className={COLUMN_WIDTHS.NAME}>Material Name</TableHead>
            <TableHead className={COLUMN_WIDTHS.CATEGORY}>Category</TableHead>
            <TableHead className={COLUMN_WIDTHS.TYPE}>Type</TableHead>
            <TableHead className={`${COLUMN_WIDTHS.STOCK} text-right`}>Stock</TableHead>
            <TableHead className={`${COLUMN_WIDTHS.UNIT_COST} text-right`}>Unit Cost</TableHead>
            <TableHead className={COLUMN_WIDTHS.VENDOR}>Vendor</TableHead>
            <TableHead className={COLUMN_WIDTHS.STATUS}>Status</TableHead>
            <TableHead className={COLUMN_WIDTHS.LOCATION}>Location</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence>
            {materials.map((material, index) => (
              <motion.tr
                key={material.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className={`border-b border-[#E5E5E5] dark:border-border cursor-pointer transition-colors ${
                  selectedMaterial?.id === material.id
                    ? "bg-[#DAB785]/10 dark:bg-[#DAB785]/20"
                    : "hover:bg-[#F8F8F8] dark:hover:bg-muted/30"
                }`}
                onClick={() => onMaterialClick(material)}
              >
                <TableCell className={COLUMN_WIDTHS.SKU}>
                  <SKUColumn material={material} />
                </TableCell>
                <TableCell className={COLUMN_WIDTHS.NAME}>
                  <NameColumn material={material} />
                </TableCell>
                <TableCell className={COLUMN_WIDTHS.CATEGORY}>
                  <CategoryColumn material={material} />
                </TableCell>
                <TableCell className={COLUMN_WIDTHS.TYPE}>
                  <span className="text-sm">{material.type}</span>
                </TableCell>
                <TableCell className={COLUMN_WIDTHS.STOCK}>
                  <StockColumn material={material} />
                </TableCell>
                <TableCell className={COLUMN_WIDTHS.UNIT_COST}>
                  <div className="text-right text-sm">
                    {formatCurrency(material.unitCost)}
                  </div>
                </TableCell>
                <TableCell className={COLUMN_WIDTHS.VENDOR}>
                  <span className="text-sm">{material.vendor}</span>
                </TableCell>
                <TableCell className={COLUMN_WIDTHS.STATUS}>
                  <StatusColumn material={material} />
                </TableCell>
                <TableCell className={COLUMN_WIDTHS.LOCATION}>
                  <Badge variant="outline" className="text-xs">
                    {material.location}
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
