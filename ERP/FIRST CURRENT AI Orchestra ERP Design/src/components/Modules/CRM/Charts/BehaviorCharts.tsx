import { Card } from "../../../ui/card";
import { Brain, Zap, Target } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface TrendData {
  month: string;
  avgValue: number;
}

interface BehaviorChartsProps {
  trendData: TrendData[];
}

export function BehaviorCharts({ trendData }: BehaviorChartsProps) {
  return (
    <div className="space-y-6">
      {/* Average Order Value Trend */}
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
        <h3 className="mb-6">Average Order Value Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            <XAxis dataKey="month" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="avgValue"
              stroke="#F2C94C"
              strokeWidth={3}
              dot={{ r: 6 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Behavioral Patterns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
              <Brain className="w-6 h-6 text-ai-blue" />
            </div>
            <div>
              <h3 className="mb-2">Preferred Channel</h3>
              <p className="text-3xl mb-2">Mobile App</p>
              <p className="text-sm text-muted-foreground">
                62% of customers prefer mobile
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
              <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="mb-2">Avg Response Time</h3>
              <p className="text-3xl mb-2">2.5 hrs</p>
              <p className="text-sm text-muted-foreground">
                To marketing campaigns
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
              <Target className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="mb-2">Engagement Score</h3>
              <p className="text-3xl mb-2">7.8/10</p>
              <p className="text-sm text-muted-foreground">
                Above industry average
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
