import { Card } from "../../../ui/card";
import { Label } from "../../../ui/label";
import { Button } from "../../../ui/button";
import { Progress } from "../../../ui/progress";
import { Sparkles, BarChart3, ExternalLink } from "lucide-react";
import { Promotion } from "./promotionData";
import { toast } from "sonner";

interface PromotionReportTabProps {
  selectedPromotion: Promotion;
}

export function PromotionReportTab({ selectedPromotion }: PromotionReportTabProps) {
  const hasReportData = selectedPromotion.status === "active" || selectedPromotion.status === "expired";

  return (
    <div className="space-y-4 mt-4">
      {hasReportData ? (
        <>
          {/* Performance Summary Card */}
          <Card className="p-4 border-glass-border">
            <h4 className="mb-3">Performance Summary</h4>
            <div className="space-y-4">
              {/* Performance Progress */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <div className="space-y-2">
                    <Label className="text-xs opacity-60">Performance</Label>
                    <div className="flex items-center gap-2">
                      <Progress value={selectedPromotion.performance} className="h-2 flex-1" />
                      <span className="text-sm">{selectedPromotion.performance}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Redemptions */}
              <div className="grid grid-cols-2 gap-4 py-3 border-t border-border">
                <div>
                  <Label className="text-xs opacity-60">Total Redemptions</Label>
                  <p className="mt-1 mb-0">{selectedPromotion.redemptions.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-xs opacity-60">Redemption Limit</Label>
                  <p className="mt-1 mb-0">
                    {selectedPromotion.redemptionLimit 
                      ? selectedPromotion.redemptionLimit.toLocaleString() 
                      : "Unlimited"}
                  </p>
                </div>
              </div>

              {/* Revenue */}
              <div className="grid grid-cols-2 gap-4 py-3 border-t border-border">
                <div>
                  <Label className="text-xs opacity-60">Total Revenue</Label>
                  <p className="mt-1 mb-0">{selectedPromotion.revenue}</p>
                </div>
                <div>
                  <Label className="text-xs opacity-60">Total Discount</Label>
                  <p className="mt-1 mb-0">{selectedPromotion.discount}</p>
                </div>
              </div>

              {/* Conversion Rate */}
              <div className="py-3 border-t border-border">
                <Label className="text-xs opacity-60">Conversion Rate</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Progress value={parseFloat(selectedPromotion.conversionRate)} className="h-2 flex-1" />
                  <span className="text-sm">{selectedPromotion.conversionRate}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* AI Insights Card - Only for active promotions with high AI score */}
          {selectedPromotion.status === "active" && selectedPromotion.aiScore && selectedPromotion.aiScore > 80 && (
            <Card className="p-4 bg-gradient-to-br from-[#4B6BFB]/5 to-[#6B8AFF]/5 border-[#4B6BFB]/20">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#4B6BFB]/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-[#4B6BFB]" />
                </div>
                <div className="flex-1">
                  <h4 className="mb-2 text-[#4B6BFB]">Optimization Tip</h4>
                  <p className="text-sm mb-0">
                    Peak redemption hours are between 2-4 PM. Schedule email reminders during this window to boost conversions.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Export Report Button */}
          <Button
            variant="outline"
            className="w-full justify-center gap-2 h-12"
            onClick={() => toast.success("Exporting report...")}
          >
            <BarChart3 className="w-4 h-4" />
            Export Full Report
            <ExternalLink className="w-4 h-4 ml-auto opacity-50" />
          </Button>
        </>
      ) : (
        // Empty State for scheduled/draft promotions
        <Card className="p-12 text-center border-glass-border">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p className="opacity-60 mb-0">No performance data available yet</p>
          <p className="text-sm opacity-40 mb-0 mt-1">Report will be available once the promotion is active</p>
        </Card>
      )}
    </div>
  );
}
