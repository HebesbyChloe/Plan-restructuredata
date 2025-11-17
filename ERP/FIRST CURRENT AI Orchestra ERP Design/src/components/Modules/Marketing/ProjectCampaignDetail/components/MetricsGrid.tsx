/**
 * Metrics Grid Component
 * Displays customizable metric cards with editable values
 */

import { Card } from "../../../../ui/card";
import { Input } from "../../../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../ui/select";
import { METRIC_OPTIONS } from "../utils/constants";
import type { MetricValues } from "../types";

interface MetricsGridProps {
  selectedMetrics: string[];
  metricValues: Record<string, MetricValues>;
  onMetricChange: (index: number, newMetric: string) => void;
  onValueChange: (metricKey: string, field: "goal" | "result", value: string) => void;
}

export function MetricsGrid({
  selectedMetrics,
  metricValues,
  onMetricChange,
  onValueChange,
}: MetricsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {selectedMetrics.map((metricKey, index) => {
        const metric = METRIC_OPTIONS.find(m => m.value === metricKey) || METRIC_OPTIONS[0];
        const values = metricValues[metricKey] || { goal: metric.defaultGoal, result: metric.defaultResult };
        
        return (
          <Card key={index} className="p-2 bg-accent/30 border-glass-border">
            {/* Metric Type Selector */}
            <Select 
              value={metricKey}
              onValueChange={(newMetric) => onMetricChange(index, newMetric)}
            >
              <SelectTrigger className="h-auto w-full border-0 bg-transparent p-0 mb-1 opacity-60 hover:opacity-100 transition-opacity text-xs focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                {METRIC_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Editable Values */}
            <div className="flex items-center justify-between gap-2">
              <Input
                value={values.goal}
                onChange={(e) => onValueChange(metricKey, "goal", e.target.value)}
                className="border-transparent hover:border-input focus:border-input bg-transparent p-0 h-auto w-20 text-sm"
              />
              <div className="flex items-center gap-1 text-sm">
                <span className="opacity-60 text-xs">{metric.resultLabel}:</span>
                <Input
                  value={values.result}
                  onChange={(e) => onValueChange(metricKey, "result", e.target.value)}
                  className="border-transparent hover:border-input focus:border-input bg-transparent p-0 h-auto w-20 opacity-60 text-sm"
                />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
