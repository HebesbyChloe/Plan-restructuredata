import { motion, AnimatePresence } from "motion/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../ui/table";
import { Diamond } from "@/sampledata";
import { DIAMOND_COLUMN_WIDTHS } from "./utils/constants";

// Types
interface DiamondTableModuleProps {
  diamonds: Diamond[];
  selectedDiamond: Diamond | null;
  onDiamondClick: (diamond: Diamond) => void;
}
import {
  DiamondSKUColumn,
  DiamondNameColumn,
  DiamondSpecsColumn,
  DiamondShapeColumn,
  DiamondCertColumn,
  DiamondPriceColumn,
  DiamondStockColumn,
  DiamondStatusColumn,
  DiamondLocationColumn,
} from "./columns/DiamondColumns";

export function DiamondTableModule({
  diamonds,
  selectedDiamond,
  onDiamondClick,
}: DiamondTableModuleProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#F8F8F8] dark:bg-muted/50 hover:bg-[#F8F8F8] dark:hover:bg-muted/50">
            <TableHead className={DIAMOND_COLUMN_WIDTHS.SKU}>SKU</TableHead>
            <TableHead className={DIAMOND_COLUMN_WIDTHS.NAME}>Diamond</TableHead>
            <TableHead className={DIAMOND_COLUMN_WIDTHS.SPECS}>Specs (4Cs)</TableHead>
            <TableHead className={DIAMOND_COLUMN_WIDTHS.SHAPE}>Shape</TableHead>
            <TableHead className={DIAMOND_COLUMN_WIDTHS.CERT}>Cert</TableHead>
            <TableHead className={`${DIAMOND_COLUMN_WIDTHS.PRICE} text-right`}>Price</TableHead>
            <TableHead className={`${DIAMOND_COLUMN_WIDTHS.STOCK} text-right`}>Stock</TableHead>
            <TableHead className={DIAMOND_COLUMN_WIDTHS.STATUS}>Status</TableHead>
            <TableHead className={DIAMOND_COLUMN_WIDTHS.LOCATION}>Location</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence>
            {diamonds.map((diamond, index) => (
              <motion.tr
                key={diamond.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className={`border-b border-[#E5E5E5] dark:border-border cursor-pointer transition-colors ${
                  selectedDiamond?.id === diamond.id
                    ? "bg-[#DAB785]/10 dark:bg-[#DAB785]/20"
                    : "hover:bg-[#F8F8F8] dark:hover:bg-muted/30"
                }`}
                onClick={() => onDiamondClick(diamond)}
              >
                <TableCell className={DIAMOND_COLUMN_WIDTHS.SKU}>
                  <DiamondSKUColumn diamond={diamond} />
                </TableCell>
                <TableCell className={DIAMOND_COLUMN_WIDTHS.NAME}>
                  <DiamondNameColumn diamond={diamond} />
                </TableCell>
                <TableCell className={DIAMOND_COLUMN_WIDTHS.SPECS}>
                  <DiamondSpecsColumn diamond={diamond} />
                </TableCell>
                <TableCell className={DIAMOND_COLUMN_WIDTHS.SHAPE}>
                  <DiamondShapeColumn diamond={diamond} />
                </TableCell>
                <TableCell className={DIAMOND_COLUMN_WIDTHS.CERT}>
                  <DiamondCertColumn diamond={diamond} />
                </TableCell>
                <TableCell className={DIAMOND_COLUMN_WIDTHS.PRICE}>
                  <DiamondPriceColumn diamond={diamond} />
                </TableCell>
                <TableCell className={DIAMOND_COLUMN_WIDTHS.STOCK}>
                  <DiamondStockColumn diamond={diamond} />
                </TableCell>
                <TableCell className={DIAMOND_COLUMN_WIDTHS.STATUS}>
                  <DiamondStatusColumn diamond={diamond} />
                </TableCell>
                <TableCell className={DIAMOND_COLUMN_WIDTHS.LOCATION}>
                  <DiamondLocationColumn diamond={diamond} />
                </TableCell>
              </motion.tr>
            ))}
          </AnimatePresence>
        </TableBody>
      </Table>
    </div>
  );
}
