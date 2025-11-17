import { Card } from "../../../ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface TrendData {
  month: string;
  customers: number;
  revenue: number;
  avgValue: number;
}

interface CustomerGrowthChartProps {
  data: TrendData[];
}

export function CustomerGrowthChart({ data }: CustomerGrowthChartProps) {
  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
      <h3 className="mb-6">Customer Growth & Revenue Trend</h3>
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4B6BFB" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#4B6BFB" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#27AE60" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#27AE60" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
          <XAxis dataKey="month" stroke="#888" />
          <YAxis yAxisId="left" stroke="#888" />
          <YAxis yAxisId="right" orientation="right" stroke="#888" />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
            }}
          />
          <Legend />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="customers"
            stroke="#4B6BFB"
            fillOpacity={1}
            fill="url(#colorCustomers)"
            strokeWidth={2}
          />
          <Area
            yAxisId="right"
            type="monotone"
            dataKey="revenue"
            stroke="#27AE60"
            fillOpacity={1}
            fill="url(#colorRevenue)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
