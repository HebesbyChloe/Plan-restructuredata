import { motion, AnimatePresence } from "motion/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../ui/table";
import { Badge } from "../../../ui/badge";
import { PricingRule } from "@/sampledata";

// Types
interface PricingRuleTableModuleProps {
  rules: PricingRule[];
  selectedRule: PricingRule | null;
  onRuleClick: (rule: PricingRule) => void;
}

const STATUS_COLORS = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  draft: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  scheduled: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  expired: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
} as const;

const TYPE_COLORS = {
  tier: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
  volume: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  customer: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  promotional: "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-400",
} as const;

export function PricingRuleTableModule({
  rules = [],
  selectedRule,
  onRuleClick,
}: PricingRuleTableModuleProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#F8F8F8] dark:bg-muted/50 hover:bg-[#F8F8F8] dark:hover:bg-muted/50">
            <TableHead className="min-w-[240px]">Rule Name</TableHead>
            <TableHead className="w-[120px]">Type</TableHead>
            <TableHead className="w-[140px]">Apply To</TableHead>
            <TableHead className="w-[140px]">Customer Group</TableHead>
            <TableHead className="w-[100px] text-center">Tiers</TableHead>
            <TableHead className="w-[100px] text-center">Priority</TableHead>
            <TableHead className="w-[120px]">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence>
            {rules.map((rule, index) => (
              <motion.tr
                key={rule.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className={`border-b border-[#E5E5E5] dark:border-border cursor-pointer transition-colors ${
                  selectedRule?.id === rule.id
                    ? "bg-[#DAB785]/10 dark:bg-[#DAB785]/20"
                    : "hover:bg-[#F8F8F8] dark:hover:bg-muted/30"
                }`}
                onClick={() => onRuleClick(rule)}
              >
                <TableCell>
                  <div>
                    <p className="mb-0">{rule.name}</p>
                    <p className="text-xs text-muted-foreground mb-0 line-clamp-1">{rule.description}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={`text-xs capitalize ${TYPE_COLORS[rule.type]}`}>
                    {rule.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm capitalize">{rule.applyTo}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm capitalize">{rule.customerGroup}</span>
                </TableCell>
                <TableCell className="text-center text-sm">
                  {rule.tiers.length}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className="text-xs">
                    {rule.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={`text-xs capitalize ${STATUS_COLORS[rule.status]}`}>
                    {rule.status}
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
