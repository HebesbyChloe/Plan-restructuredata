import { motion } from "motion/react";
import { Card } from "../../../ui/card";
import { Badge } from "../../../ui/badge";
import { Target } from "lucide-react";

interface MonthlyMomentumCardProps {
  totalRevenue: number;
  avgDailyRevenueActual: number;
  dailyRevenueGoal: number;
  totalNewLeads: number;
  totalConverted: number;
  totalOrders: number;
  returningCustomerOrders: number;
  newCustomerOrders: number;
  returningCustomerRevenue: number;
  newCustomerRevenue: number;
  monthProgress: number;
  monthlyRevenueGoal: number;
}

export function MonthlyMomentumCard({
  totalRevenue,
  avgDailyRevenueActual,
  dailyRevenueGoal,
  totalNewLeads,
  totalConverted,
  totalOrders,
  returningCustomerOrders,
  newCustomerOrders,
  returningCustomerRevenue,
  newCustomerRevenue,
  monthProgress,
  monthlyRevenueGoal,
}: MonthlyMomentumCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-ai-blue/10 backdrop-blur-sm border-purple-500/30">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl mb-0 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-500" />
            Monthly Momentum
          </h2>
          <Badge className="bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30">
            October 2025
          </Badge>
        </div>

        {/* Progress Bar - Moved to Top */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground mb-0">Monthly Target Progress</p>
            <p className="font-semibold text-purple-600 dark:text-purple-400 mb-0">
              {monthProgress.toFixed(1)}%
            </p>
          </div>
          <div className="h-3 bg-border rounded-full overflow-hidden mb-2">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-ai-blue"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(monthProgress, 100)}%` }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-semibold text-purple-600 dark:text-purple-400 mb-0">
              ${totalRevenue.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground mb-0">
              / ${monthlyRevenueGoal.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Stats Grid - Row 1 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="text-center p-3 rounded-lg bg-background/50">
            <p className="text-sm text-muted-foreground mb-1">Revenue</p>
            <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-0">
              ${returningCustomerRevenue.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mb-0">Returning</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-background/50">
            <p className="text-sm text-muted-foreground mb-1">Revenue</p>
            <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-0">
              ${newCustomerRevenue.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mb-0">New</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-background/50">
            <p className="text-sm text-muted-foreground mb-1">Avg per Day</p>
            <p className="text-lg font-semibold text-ai-blue mb-0">
              ${Math.round(avgDailyRevenueActual).toLocaleString()}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 mb-0">
              Goal: ${dailyRevenueGoal.toLocaleString()}
            </p>
          </div>
          <div className="text-center p-3 rounded-lg bg-background/50">
            <p className="text-sm text-muted-foreground mb-1">New Leads</p>
            <p className="text-lg font-semibold text-cyan-600 dark:text-cyan-400 mb-0">
              {totalNewLeads}
            </p>
            <p className="text-xs text-ai-blue mb-0">Converted: {totalConverted}</p>
          </div>
        </div>

        {/* Stats Grid - Row 2 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 rounded-lg bg-background/50">
            <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
            <p className="text-lg font-semibold text-green-600 dark:text-green-400 mb-0">
              {totalOrders}
            </p>
            <p className="text-xs text-muted-foreground mb-0">
              Returning: {returningCustomerOrders} / New: {newCustomerOrders}
            </p>
          </div>
          <div className="text-center p-3 rounded-lg bg-background/50">
            <p className="text-sm text-muted-foreground mb-1">&nbsp;</p>
            <p className="text-lg font-semibold mb-0">&nbsp;</p>
            <p className="text-xs text-muted-foreground mb-0">&nbsp;</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
