import { Card } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  Cell,
} from "recharts";
import { motion } from "motion/react";

interface SalesChartsProps {
  salesTrendData: Array<{ day: string; sales: number; target: number }>;
  teamComparisonData: Array<{ team: string; revenue: number; color: string }>;
  funnelData: Array<{ stage: string; count: number; percentage: number; color: string }>;
}

export function SalesChartsSection({
  salesTrendData,
  teamComparisonData,
  funnelData,
}: SalesChartsProps) {
  return (
    <Card className="lg:col-span-2 p-6 bg-card/50 backdrop-blur-sm border-border/50">
      <Tabs defaultValue="trend" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="trend">7-Day Trend</TabsTrigger>
          <TabsTrigger value="teams">Team Comparison</TabsTrigger>
          <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
        </TabsList>

        <TabsContent value="trend" className="mt-0">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrendData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  fill="url(#colorSales)"
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#9CA3AF"
                  strokeDasharray="5 5"
                  strokeWidth={1}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="teams" className="mt-0">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamComparisonData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                <XAxis type="number" stroke="var(--muted-foreground)" />
                <YAxis type="category" dataKey="team" stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="revenue" radius={[0, 8, 8, 0]}>
                  {teamComparisonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="funnel" className="mt-0">
          <div className="space-y-4 py-4">
            {funnelData.map((stage, index) => (
              <motion.div
                key={stage.stage}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span>{stage.stage}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">{stage.percentage}%</span>
                    <Badge
                      style={{ backgroundColor: `${stage.color}20`, color: stage.color }}
                    >
                      {stage.count}
                    </Badge>
                  </div>
                </div>
                <div className="relative h-12 bg-muted/30 rounded-lg overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: stage.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${stage.percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  >
                    <span className="text-white px-4">{stage.count} leads</span>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
