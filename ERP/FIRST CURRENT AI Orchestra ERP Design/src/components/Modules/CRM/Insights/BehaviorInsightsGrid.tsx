import { motion } from "motion/react";
import { Card } from "../../../ui/card";
import { Badge } from "../../../ui/badge";
import { ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react";

interface BehaviorInsight {
  id: number;
  title: string;
  insight: string;
  metric: string;
  trend: "up" | "down";
  icon: LucideIcon;
}

interface BehaviorInsightsGridProps {
  insights: BehaviorInsight[];
}

export function BehaviorInsightsGrid({ insights }: BehaviorInsightsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {insights.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: item.id * 0.1 }}
        >
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-ai-blue/30 transition-all duration-300">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-ai-blue" />
                </div>
                <Badge
                  className={
                    item.trend === "up"
                      ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                      : "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                  }
                >
                  {item.trend === "up" ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{item.title}</p>
                <p className="text-2xl mb-2">{item.metric}</p>
                <p className="text-xs text-muted-foreground">{item.insight}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
