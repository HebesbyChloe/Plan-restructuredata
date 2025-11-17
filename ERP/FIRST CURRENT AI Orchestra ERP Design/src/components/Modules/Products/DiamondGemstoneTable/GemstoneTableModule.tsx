import { motion, AnimatePresence } from "motion/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../ui/table";
import { Gemstone } from "@/sampledata";
import { GEMSTONE_COLUMN_WIDTHS } from "./utils/constants";

// Types
interface GemstoneTableModuleProps {
  gemstones: Gemstone[];
  selectedGemstone: Gemstone | null;
  onGemstoneClick: (gemstone: Gemstone) => void;
}
import {
  GemstoneSKUColumn,
  GemstoneNameColumn,
  GemstoneVarietyColumn,
  GemstoneOriginColumn,
  GemstoneSpecsColumn,
  GemstonePriceColumn,
  GemstoneStockColumn,
  GemstoneStatusColumn,
  GemstoneLocationColumn,
} from "./columns/GemstoneColumns";

export function GemstoneTableModule({
  gemstones,
  selectedGemstone,
  onGemstoneClick,
}: GemstoneTableModuleProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#F8F8F8] dark:bg-muted/50 hover:bg-[#F8F8F8] dark:hover:bg-muted/50">
            <TableHead className={GEMSTONE_COLUMN_WIDTHS.SKU}>SKU</TableHead>
            <TableHead className={GEMSTONE_COLUMN_WIDTHS.NAME}>Gemstone</TableHead>
            <TableHead className={GEMSTONE_COLUMN_WIDTHS.VARIETY}>Variety</TableHead>
            <TableHead className={GEMSTONE_COLUMN_WIDTHS.ORIGIN}>Origin</TableHead>
            <TableHead className={GEMSTONE_COLUMN_WIDTHS.SPECS}>Specs</TableHead>
            <TableHead className={`${GEMSTONE_COLUMN_WIDTHS.PRICE} text-right`}>Price</TableHead>
            <TableHead className={`${GEMSTONE_COLUMN_WIDTHS.STOCK} text-right`}>Stock</TableHead>
            <TableHead className={GEMSTONE_COLUMN_WIDTHS.STATUS}>Status</TableHead>
            <TableHead className={GEMSTONE_COLUMN_WIDTHS.LOCATION}>Location</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence>
            {gemstones.map((gemstone, index) => (
              <motion.tr
                key={gemstone.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className={`border-b border-[#E5E5E5] dark:border-border cursor-pointer transition-colors ${
                  selectedGemstone?.id === gemstone.id
                    ? "bg-[#DAB785]/10 dark:bg-[#DAB785]/20"
                    : "hover:bg-[#F8F8F8] dark:hover:bg-muted/30"
                }`}
                onClick={() => onGemstoneClick(gemstone)}
              >
                <TableCell className={GEMSTONE_COLUMN_WIDTHS.SKU}>
                  <GemstoneSKUColumn gemstone={gemstone} />
                </TableCell>
                <TableCell className={GEMSTONE_COLUMN_WIDTHS.NAME}>
                  <GemstoneNameColumn gemstone={gemstone} />
                </TableCell>
                <TableCell className={GEMSTONE_COLUMN_WIDTHS.VARIETY}>
                  <GemstoneVarietyColumn gemstone={gemstone} />
                </TableCell>
                <TableCell className={GEMSTONE_COLUMN_WIDTHS.ORIGIN}>
                  <GemstoneOriginColumn gemstone={gemstone} />
                </TableCell>
                <TableCell className={GEMSTONE_COLUMN_WIDTHS.SPECS}>
                  <GemstoneSpecsColumn gemstone={gemstone} />
                </TableCell>
                <TableCell className={GEMSTONE_COLUMN_WIDTHS.PRICE}>
                  <GemstonePriceColumn gemstone={gemstone} />
                </TableCell>
                <TableCell className={GEMSTONE_COLUMN_WIDTHS.STOCK}>
                  <GemstoneStockColumn gemstone={gemstone} />
                </TableCell>
                <TableCell className={GEMSTONE_COLUMN_WIDTHS.STATUS}>
                  <GemstoneStatusColumn gemstone={gemstone} />
                </TableCell>
                <TableCell className={GEMSTONE_COLUMN_WIDTHS.LOCATION}>
                  <GemstoneLocationColumn gemstone={gemstone} />
                </TableCell>
              </motion.tr>
            ))}
          </AnimatePresence>
        </TableBody>
      </Table>
    </div>
  );
}
