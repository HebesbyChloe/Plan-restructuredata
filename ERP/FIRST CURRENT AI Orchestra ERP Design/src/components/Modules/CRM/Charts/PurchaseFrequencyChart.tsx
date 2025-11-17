import { Card } from "../../../ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface FrequencyData {
  frequency: string;
  customers: number;
}

interface PurchaseFrequencyChartProps {
  data: FrequencyData[];
}

export function PurchaseFrequencyChart({ data }: PurchaseFrequencyChartProps) {
  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
      <h3 className="mb-6">Purchase Frequency Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
          <XAxis dataKey="frequency" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
            }}
          />
          <Bar dataKey="customers" fill="#4B6BFB" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
