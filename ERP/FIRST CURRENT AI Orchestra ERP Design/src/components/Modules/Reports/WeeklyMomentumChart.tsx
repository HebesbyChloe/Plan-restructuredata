import { motion } from "motion/react";
import { Card } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { ArrowUpRight, ArrowDownRight, Zap } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface WeeklyData {
  day: string;
  value: number;
  target: number;
}

interface WeeklyMomentumChartProps {
  data: WeeklyData[];
  title?: string;
  weekChange?: number;
  currentValue?: number;
  targetValue?: number;
  periodLabel?: string;
  index?: number;
}

export function WeeklyMomentumChart({
  data,
  title = "Weekly Momentum",
  weekChange = 0,
  currentValue = 0,
  targetValue = 0,
  periodLabel = "7-day",
  index = 0,
}: WeeklyMomentumChartProps) {
  const percentage = targetValue > 0 ? (currentValue / targetValue) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-ai-blue/30 transition-all">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h3 className="mb-0">{title}</h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge
              variant={weekChange >= 0 ? "default" : "destructive"}
              className={`text-sm ${weekChange >= 0 ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400' : ''}`}
            >
              {weekChange >= 0 ? (
                <ArrowUpRight className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDownRight className="w-4 h-4 mr-1" />
              )}
              {Math.abs(weekChange)}% vs last period
            </Badge>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 rounded-lg bg-background/50">
            <p className="text-sm text-muted-foreground mb-1">Current</p>
            <p className="text-xl font-semibold text-amber-500">
              {currentValue.toLocaleString()}
            </p>
          </div>
          <div className="text-center p-3 rounded-lg bg-background/50">
            <p className="text-sm text-muted-foreground mb-1">Target</p>
            <p className="text-xl font-semibold">
              {targetValue.toLocaleString()}
            </p>
          </div>
          <div className="text-center p-3 rounded-lg bg-background/50">
            <p className="text-sm text-muted-foreground mb-1">Achievement</p>
            <p
              className="text-xl font-semibold"
              style={{
                color: percentage >= 100 ? "#10B981" : percentage >= 80 ? "#F59E0B" : "#EF4444",
              }}
            >
              {percentage.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis
                dataKey="day"
                stroke="currentColor"
                className="text-xs text-muted-foreground"
              />
              <YAxis
                stroke="currentColor"
                className="text-xs text-muted-foreground"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  backdropFilter: "blur(8px)",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#F59E0B"
                strokeWidth={2}
                fill="url(#colorValue)"
                name="Actual"
              />
              <Area
                type="monotone"
                dataKey="target"
                stroke="#10B981"
                strokeWidth={2}
                strokeDasharray="5 5"
                fill="url(#colorTarget)"
                name="Target"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Period Progress */}
        <div className={`mt-4 grid gap-2`} style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` }}>
          {data.map((day, idx) => {
            const dayPercentage = day.target > 0 ? (day.value / day.target) * 100 : 0;
            return (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 + idx * 0.05 }}
                className="text-center"
              >
                <div className="text-xs text-muted-foreground mb-1">{day.day}</div>
                <div className="h-1.5 bg-border rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      backgroundColor:
                        dayPercentage >= 100
                          ? "#10B981"
                          : dayPercentage >= 80
                          ? "#F59E0B"
                          : "#EF4444",
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(dayPercentage, 100)}%` }}
                    transition={{ duration: 0.6, delay: index * 0.05 + idx * 0.08 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
}
