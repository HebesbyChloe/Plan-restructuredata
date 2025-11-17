import { motion } from "motion/react";
import { Card } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";

interface KPICardProps {
  kpi: {
    id: string;
    title: string;
    value: number;
    goal: number;
    color: string;
    change: number;
    trend: number[];
    icon: LucideIcon;
  };
  index: number;
}

export function KPICard({ kpi, index }: KPICardProps) {
  const percentage = (kpi.value / kpi.goal) * 100;
  const Icon = kpi.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-ai-blue/30 transition-all group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
              style={{ backgroundColor: `${kpi.color}20` }}
            >
              <Icon className="w-6 h-6" style={{ color: kpi.color }} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">{kpi.title}</p>
              <div className="flex items-baseline gap-2">
                <h2 className="mb-0">{kpi.value.toLocaleString()}</h2>
                <span className="text-sm text-muted-foreground">
                  / {kpi.goal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          <Badge
            variant={kpi.change >= 0 ? "default" : "destructive"}
            className="gap-1"
          >
            {kpi.change >= 0 ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            {Math.abs(kpi.change)}%
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: kpi.color }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(percentage, 100)}%` }}
              transition={{ duration: 1, delay: index * 0.1 }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {percentage.toFixed(1)}% complete
          </p>
        </div>

        {/* Sparkline */}
        <div className="h-12">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={kpi.trend.map((val) => ({ value: val }))}>
              <defs>
                <linearGradient id={`gradient-${kpi.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={kpi.color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={kpi.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={kpi.color}
                strokeWidth={2}
                fill={`url(#gradient-${kpi.id})`}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  );
}
