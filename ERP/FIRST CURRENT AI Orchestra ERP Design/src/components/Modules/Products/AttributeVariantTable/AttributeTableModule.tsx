import { motion, AnimatePresence } from "motion/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../ui/table";
import { Badge } from "../../../ui/badge";
import { Check, X } from "lucide-react";
import { Attribute } from "@/sampledata";

// Types
interface AttributeTableModuleProps {
  attributes: Attribute[];
  selectedAttribute: Attribute | null;
  onAttributeClick: (attribute: Attribute) => void;
}

const TYPE_COLORS = {
  single: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  multiple: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
  text: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
} as const;

export function AttributeTableModule({
  attributes,
  selectedAttribute,
  onAttributeClick,
}: AttributeTableModuleProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#F8F8F8] dark:bg-muted/50 hover:bg-[#F8F8F8] dark:hover:bg-muted/50">
            <TableHead className="min-w-[200px]">Attribute Name</TableHead>
            <TableHead className="w-[120px]">Type</TableHead>
            <TableHead className="min-w-[300px]">Values</TableHead>
            <TableHead className="w-[200px]">Apply To</TableHead>
            <TableHead className="w-[100px] text-center">Required</TableHead>
            <TableHead className="w-[100px] text-center">Visible</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence>
            {attributes.map((attribute, index) => (
              <motion.tr
                key={attribute.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className={`border-b border-[#E5E5E5] dark:border-border cursor-pointer transition-colors ${
                  selectedAttribute?.id === attribute.id
                    ? "bg-[#DAB785]/10 dark:bg-[#DAB785]/20"
                    : "hover:bg-[#F8F8F8] dark:hover:bg-muted/30"
                }`}
                onClick={() => onAttributeClick(attribute)}
              >
                <TableCell>
                  <p className="mb-0">{attribute.name}</p>
                </TableCell>
                <TableCell>
                  <Badge className={`text-xs capitalize ${TYPE_COLORS[attribute.type]}`}>
                    {attribute.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {attribute.values.slice(0, 5).map((value, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {value}
                      </Badge>
                    ))}
                    {attribute.values.length > 5 && (
                      <Badge variant="outline" className="text-xs">
                        +{attribute.values.length - 5} more
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {attribute.applyTo.slice(0, 3).map((category, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {attribute.required ? (
                    <Check className="w-4 h-4 text-green-600 dark:text-green-400 mx-auto" />
                  ) : (
                    <X className="w-4 h-4 text-gray-400 mx-auto" />
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {attribute.visibleOnStore ? (
                    <Check className="w-4 h-4 text-green-600 dark:text-green-400 mx-auto" />
                  ) : (
                    <X className="w-4 h-4 text-gray-400 mx-auto" />
                  )}
                </TableCell>
              </motion.tr>
            ))}
          </AnimatePresence>
        </TableBody>
      </Table>
    </div>
  );
}
