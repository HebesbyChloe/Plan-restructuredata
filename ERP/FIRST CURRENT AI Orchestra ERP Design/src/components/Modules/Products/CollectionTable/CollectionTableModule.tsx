import { motion, AnimatePresence } from "motion/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../ui/table";
import { Badge } from "../../../ui/badge";
import { Star } from "lucide-react";
import { Collection } from "@/sampledata";
import { COLUMN_WIDTHS } from "./utils/constants";
import { getStatusColor, getTypeColor } from "./utils/helpers";

// Types
interface CollectionTableModuleProps {
  collections: Collection[];
  selectedCollection: Collection | null;
  onCollectionClick: (collection: Collection) => void;
}

export function CollectionTableModule({
  collections,
  selectedCollection,
  onCollectionClick,
}: CollectionTableModuleProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#F8F8F8] dark:bg-muted/50 hover:bg-[#F8F8F8] dark:hover:bg-muted/50">
            <TableHead className={COLUMN_WIDTHS.NAME}>Collection</TableHead>
            <TableHead className={COLUMN_WIDTHS.TYPE}>Type</TableHead>
            <TableHead className={`${COLUMN_WIDTHS.PRODUCTS} text-right`}>Products</TableHead>
            <TableHead className={COLUMN_WIDTHS.FEATURED}>Featured</TableHead>
            <TableHead className={COLUMN_WIDTHS.STATUS}>Status</TableHead>
            <TableHead className={COLUMN_WIDTHS.DATES}>Date Range</TableHead>
            <TableHead className={COLUMN_WIDTHS.UPDATED}>Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence>
            {collections.map((collection, index) => (
              <motion.tr
                key={collection.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className={`border-b border-[#E5E5E5] dark:border-border cursor-pointer transition-colors ${
                  selectedCollection?.id === collection.id
                    ? "bg-[#DAB785]/10 dark:bg-[#DAB785]/20"
                    : "hover:bg-[#F8F8F8] dark:hover:bg-muted/30"
                }`}
                onClick={() => onCollectionClick(collection)}
              >
                <TableCell className={COLUMN_WIDTHS.NAME}>
                  <div>
                    <p className="mb-0">{collection.name}</p>
                    <p className="text-xs text-muted-foreground mb-0">{collection.slug}</p>
                  </div>
                </TableCell>
                <TableCell className={COLUMN_WIDTHS.TYPE}>
                  <Badge className={`text-xs capitalize ${getTypeColor(collection.collectionType)}`}>
                    {collection.collectionType}
                  </Badge>
                </TableCell>
                <TableCell className={COLUMN_WIDTHS.PRODUCTS}>
                  <div className="text-right text-sm">{collection.productCount}</div>
                </TableCell>
                <TableCell className={COLUMN_WIDTHS.FEATURED}>
                  {collection.featured && (
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  )}
                </TableCell>
                <TableCell className={COLUMN_WIDTHS.STATUS}>
                  <Badge className={`text-xs capitalize ${getStatusColor(collection.status)}`}>
                    {collection.status}
                  </Badge>
                </TableCell>
                <TableCell className={COLUMN_WIDTHS.DATES}>
                  {collection.startDate && collection.endDate ? (
                    <div className="text-xs">
                      <div>{collection.startDate}</div>
                      <div className="text-muted-foreground">to {collection.endDate}</div>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">Ongoing</span>
                  )}
                </TableCell>
                <TableCell className={COLUMN_WIDTHS.UPDATED}>
                  <span className="text-xs text-muted-foreground">
                    {new Date(collection.updatedAt).toLocaleDateString()}
                  </span>
                </TableCell>
              </motion.tr>
            ))}
          </AnimatePresence>
        </TableBody>
      </Table>
    </div>
  );
}
