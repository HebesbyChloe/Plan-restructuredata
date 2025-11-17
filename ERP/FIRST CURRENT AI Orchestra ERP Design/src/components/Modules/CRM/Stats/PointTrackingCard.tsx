import { motion } from "motion/react";
import { Card } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Star } from "lucide-react";

interface PointLog {
  id: string;
  employeeId: string;
  type: "earned" | "deducted";
  points: number;
  description: string;
  date: Date;
  relatedData?: {
    customerName?: string;
    orderId?: string;
    taskId?: string;
  };
}

interface PointsData {
  employeeId: string;
  currentPoints: number;
  monthlyPointsChange: number;
  totalPointsThisMonth: number;
}

interface PointTrackingCardProps {
  pointsData: PointsData;
  recentLogs: PointLog[];
}

export function PointTrackingCard({ pointsData, recentLogs }: PointTrackingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
    >
      <Card className="p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border-indigo-500/30">
        <h2 className="text-xl mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-indigo-500" />
          Point Tracking
        </h2>

        {/* Current Points Display */}
        <div className="text-center mb-6">
          <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 opacity-20"></div>
            <div className="relative">
              <p className="text-4xl font-semibold text-indigo-600 dark:text-indigo-400 mb-0">
                {pointsData.currentPoints}
              </p>
              <p className="text-sm text-muted-foreground mb-0">Points</p>
            </div>
          </div>

          <div className="mb-4">
            <p
              className={`text-lg font-semibold mb-0 ${
                pointsData.monthlyPointsChange < 0
                  ? "text-red-600 dark:text-red-400"
                  : "text-green-600 dark:text-green-400"
              }`}
            >
              {pointsData.monthlyPointsChange > 0 ? "+" : ""}
              {pointsData.monthlyPointsChange} Points this month
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button variant="outline" className="w-full">
            Submit Review
          </Button>
          <Button variant="outline" className="w-full">
            View Rewards
          </Button>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="font-semibold mb-3">Recent Activity</h3>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {recentLogs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: 0.5 + index * 0.03 }}
                className="p-3 rounded-lg bg-background/50 border border-border/50"
              >
                <div className="flex items-start justify-between mb-1">
                  <p
                    className={`font-semibold mb-0 ${
                      log.type === "earned"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {log.type === "earned" ? "+" : ""}
                    {log.points} points
                  </p>
                  <p className="text-xs text-muted-foreground mb-0">
                    {log.date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    {log.date.toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground mb-0">{log.description}</p>
                {log.relatedData?.customerName && (
                  <p className="text-xs text-muted-foreground mt-1 mb-0">
                    Customer: {log.relatedData.customerName}
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          <Button variant="ghost" className="w-full mt-3">
            View More
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
