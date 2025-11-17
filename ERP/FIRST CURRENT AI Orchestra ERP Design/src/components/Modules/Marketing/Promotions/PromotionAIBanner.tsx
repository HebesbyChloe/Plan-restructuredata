import { Card } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Sparkles } from "lucide-react";

export function PromotionAIBanner() {
  return (
    <Card className="p-4 border-[#4B6BFB]/30 bg-gradient-to-r from-[#4B6BFB]/10 to-[#6B8AFF]/10 backdrop-blur-sm mb-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-[#4B6BFB]/20">
          <Sparkles className="w-5 h-5 text-[#4B6BFB]" />
        </div>
        <div className="flex-1">
          <p className="opacity-90 mb-0">
            <span className="opacity-100">AI Insight:</span> Your "Fall Flash Sale" is performing 23% better than average. Consider extending it by 3 days to maximize revenue potential.
          </p>
        </div>
        <Button variant="ghost" size="sm" className="text-[#4B6BFB]">
          Apply →
        </Button>
      </div>
    </Card>
  );
}
