import { motion } from "motion/react";
import { Card } from "../../../ui/card";

interface JourneyStage {
  stage: string;
  count: number;
}

interface CustomerJourneyFunnelProps {
  data: JourneyStage[];
}

export function CustomerJourneyFunnel({ data }: CustomerJourneyFunnelProps) {
  const colors = ["#4B6BFB", "#9B51E0", "#27AE60", "#F2C94C", "#EB5757"];

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
      <h3 className="mb-6">Customer Journey Funnel</h3>
      <div className="space-y-4">
        {data.map((stage, index) => {
          const percentage = (stage.count / data[0].count) * 100;
          return (
            <div key={stage.stage} className="space-y-2">
              <div className="flex items-center justify-between">
                <span>{stage.stage}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {stage.count.toLocaleString()} customers
                  </span>
                  <span className="text-sm">{percentage.toFixed(1)}%</span>
                </div>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-8 overflow-hidden relative">
                <motion.div
                  className="h-full rounded-full flex items-center justify-end pr-4"
                  style={{
                    background: `linear-gradient(to right, #4B6BFB, ${colors[index]})`,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }}
                >
                  <span className="text-white text-sm">
                    {percentage.toFixed(0)}%
                  </span>
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
