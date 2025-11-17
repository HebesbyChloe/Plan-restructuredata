/**
 * AI Recommendation Card Component
 * Displays AI-generated recommendations for the project/campaign
 */

import { Card } from "../../../../ui/card";
import { Badge } from "../../../../ui/badge";
import { Sparkles, TrendingUp, AlertCircle } from "lucide-react";

export function AIRecommendationCard() {
  return (
    <Card className="p-4 bg-gradient-to-br from-[#4B6BFB]/5 to-[#6B8AFF]/5 border-[#4B6BFB]/20">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#4B6BFB]/10 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-[#4B6BFB]" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="mb-0 text-[#4B6BFB]">AI Recommendations</h4>
            <Badge variant="outline" className="bg-[#4B6BFB]/10 text-[#4B6BFB] border-[#4B6BFB]/20">
              Monitor
            </Badge>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <TrendingUp className="w-4 h-4 text-[#4B6BFB] mt-0.5 flex-shrink-0" />
              <p className="mb-0">
                <strong>Engagement trending up:</strong> Social media engagement increased by 15% this week. Consider allocating more budget to high-performing channels.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
              <p className="mb-0">
                <strong>Budget alert:</strong> Spending is at 80% with 40% of campaign timeline remaining. Review resource allocation to avoid overruns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
