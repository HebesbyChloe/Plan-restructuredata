import { Card } from "../../../ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SegmentData {
  name: string;
  value: number;
  color: string;
}

interface CustomerSegmentsChartsProps {
  segments: SegmentData[];
}

export function CustomerSegmentsCharts({ segments }: CustomerSegmentsChartsProps) {
  const totalCustomers = segments.reduce((sum, segment) => sum + segment.value, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Customer Segments Pie Chart */}
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
        <h3 className="mb-6">Customer Segments Distribution</h3>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={segments}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {segments.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* Segment Details */}
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
        <h3 className="mb-6">Segment Details</h3>
        <div className="space-y-4">
          {segments.map((segment) => (
            <div
              key={segment.name}
              className="flex items-center justify-between p-4 rounded-lg bg-muted/30"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: segment.color }}
                />
                <div>
                  <p className="mb-0">{segment.name}</p>
                  <p className="text-sm text-muted-foreground mb-0">
                    {segment.value} customers
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="mb-0">
                  {((segment.value / totalCustomers) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
