import { Card } from "../../../ui/card";
import { Badge } from "../../../ui/badge";
import { Switch } from "../../../ui/switch";
import { Progress } from "../../../ui/progress";
import { TrendingUp, Tag, Copy } from "lucide-react";
import { motion } from "motion/react";
import { Promotion, promotionTypeColors, promotionTypeLabels } from "./promotionData";
import { useState } from "react";
import { format } from "date-fns";

interface PromotionTableProps {
  promotions: Promotion[];
  onRowClick: (promotion: Promotion) => void;
  onToggleActive: (promotionId: string, e: React.MouseEvent) => void;
}

export function PromotionTable({
  promotions,
  onRowClick,
  onToggleActive,
}: PromotionTableProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Helper function to compute display value based on promotion type
  const getDisplayValue = (promotion: Promotion): string => {
    switch (promotion.type) {
      case "percentage":
        return promotion.percentageValue ? `${promotion.percentageValue}%` : "N/A";
      case "fixed_amount":
        return promotion.valueAmount ? `$${promotion.valueAmount.toFixed(2)}` : "N/A";
      case "free_shipping":
        return "Free";
      case "buy_x_get_y":
        return promotion.buyQuantity && promotion.getQuantity
          ? `Buy ${promotion.buyQuantity} Get ${promotion.getQuantity}`
          : "N/A";
      case "buy_more_get_more":
        return promotion.bmgmMode === "discount" && promotion.bmgmDiscountPercent
          ? `${promotion.bmgmDiscountPercent}% Off`
          : promotion.bmgmMode === "product"
          ? "Free Product"
          : "N/A";
      default:
        return "N/A";
    }
  };

  return (
    <Card className="border-glass-border bg-glass-bg/30 backdrop-blur-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-glass-border">
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Promotion</th>
              <th className="text-left p-4">Code</th>
              <th className="text-left p-4">Type</th>
              <th className="text-left p-4">Value</th>
              <th className="text-left p-4">Period</th>
              <th className="text-left p-4">Redemptions</th>
              <th className="text-left p-4">Revenue</th>
              <th className="text-left p-4">Conv. Rate</th>
              <th className="text-left p-4">AI Score</th>
            </tr>
          </thead>
          <tbody>
            {promotions.map((promotion, index) => (
              <motion.tr
                key={promotion.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="border-b border-glass-border/50 hover:bg-accent/20 transition-colors cursor-pointer"
                onClick={() => onRowClick(promotion)}
              >
                <td className="p-4" onClick={(e) => e.stopPropagation()}>
                  <Switch
                    checked={promotion.isActive ?? true}
                    onCheckedChange={() => onToggleActive(promotion.id, {} as React.MouseEvent)}
                    disabled={promotion.status === "expired"}
                  />
                </td>
                <td className="p-4">
                  <div>
                    <div className="mb-1">{promotion.name}</div>
                    {promotion.targetAudience && (
                      <div className="opacity-60">{promotion.targetAudience}</div>
                    )}
                  </div>
                </td>
                <td className="p-4" onClick={(e) => e.stopPropagation()}>
                  <div 
                    className="flex items-center gap-2 px-3 py-1 rounded-lg bg-accent/50 cursor-pointer hover:bg-accent transition-colors w-fit"
                    onClick={() => copyCode(promotion.code)}
                  >
                    <code className="font-mono">{promotion.code}</code>
                    {copiedCode === promotion.code ? (
                      <Badge variant="secondary" className="h-5">Copied!</Badge>
                    ) : (
                      <Copy className="w-3 h-3 opacity-40" />
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <Badge
                    style={{
                      backgroundColor: `${promotionTypeColors[promotion.type]}20`,
                      color: promotionTypeColors[promotion.type],
                      border: `1px solid ${promotionTypeColors[promotion.type]}30`,
                    }}
                  >
                    {promotionTypeLabels[promotion.type]}
                  </Badge>
                </td>
                <td className="p-4">
                  <Badge variant="outline" className="gap-1">
                    <Tag className="w-3 h-3" />
                    {getDisplayValue(promotion)}
                  </Badge>
                </td>
                <td className="p-4">
                  <div className="opacity-60">
                    {promotion.startDate instanceof Date 
                      ? format(promotion.startDate, "MMM d, yyyy")
                      : String(promotion.startDate)} - {promotion.endDate instanceof Date
                      ? format(promotion.endDate, "MMM d, yyyy")
                      : String(promotion.endDate)}
                  </div>
                </td>
                <td className="p-4">
                  {promotion.redemptionLimit ? (
                    <div>
                      <div className="mb-1">
                        {promotion.redemptions.toLocaleString()} / {promotion.redemptionLimit.toLocaleString()}
                      </div>
                      <Progress 
                        value={(promotion.redemptions / promotion.redemptionLimit) * 100} 
                        className="h-1.5"
                      />
                    </div>
                  ) : (
                    <div>{promotion.redemptions.toLocaleString()}</div>
                  )}
                </td>
                <td className="p-4">
                  <div>
                    <div>{promotion.revenue || "$0"}</div>
                    {promotion.discount && (
                      <div className="opacity-40">-{promotion.discount}</div>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {promotion.conversionRate || "0%"}
                    {promotion.conversionRate && parseFloat(promotion.conversionRate) > 8 && (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                </td>
                <td className="p-4">
                  {promotion.aiScore && (
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <Progress value={promotion.aiScore} className="h-1.5" />
                      </div>
                      <span className="opacity-60">{promotion.aiScore}%</span>
                    </div>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
