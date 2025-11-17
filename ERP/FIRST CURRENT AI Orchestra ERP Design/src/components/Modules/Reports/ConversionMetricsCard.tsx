import { motion } from "motion/react";
import { Card } from "../../ui/card";
import { Badge } from "../../ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";

interface ConversionMetric {
  label: string;
  value: string;
  percentage: number;
  change: number;
  color: string;
}

interface ConversionMetricsCardProps {
  metrics: ConversionMetric[];
  title?: string;
  index?: number;
}

export function ConversionMetricsCard({ 
  metrics, 
  title = "Conversion Metrics",
  index = 0 
}: ConversionMetricsCardProps) {
  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-ai-blue/30 transition-all">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
            <h3 className="mb-0">{title}</h3>
          </div>

          <div className="space-y-4">
            {metrics.map((metric, idx) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 + idx * 0.05 }}
                className="flex items-center justify-between p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-muted-foreground">{metric.label}</span>
                    <Badge
                      variant={metric.change >= 0 ? "default" : "destructive"}
                      className={`text-xs ${metric.change >= 0 ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400' : ''}`}
                    >
                      {metric.change >= 0 ? (
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 mr-1" />
                      )}
                      {Math.abs(metric.change)}%
                    </Badge>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-semibold" style={{ color: metric.color }}>
                      {metric.value}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({metric.percentage}%)
                    </span>
                  </div>
                </div>

                {/* Progress Bar with Tooltip */}
                <div className="w-24 ml-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="h-2 bg-border rounded-full overflow-hidden cursor-pointer">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: metric.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${metric.percentage}%` }}
                          transition={{ duration: 0.8, delay: index * 0.05 + idx * 0.1 }}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="mb-0">
                        <strong>{metric.label}:</strong> {metric.value} of {Math.round(parseInt(metric.value) / (metric.percentage / 100))}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </TooltipProvider>
  );
}
