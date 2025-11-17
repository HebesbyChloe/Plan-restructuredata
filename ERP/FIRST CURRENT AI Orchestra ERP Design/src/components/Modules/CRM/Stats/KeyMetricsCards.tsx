import { Card } from "../../../ui/card";
import { Badge } from "../../../ui/badge";
import {
  Users,
  DollarSign,
  UserPlus,
  Heart,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface MetricData {
  totalCustomers: number;
  customerGrowth: number;
  customersAdded: number;
  avgLifetimeValue: number;
  lifetimeValueGrowth: number;
  lifetimeValueIncrease: number;
  newCustomers: number;
  newCustomerGrowth: number;
  retentionRate: number;
  retentionChange: number;
}

interface KeyMetricsCardsProps {
  data: MetricData;
}

export function KeyMetricsCards({ data }: KeyMetricsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Total Customers */}
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-ai-blue/30 transition-all duration-300">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
              <Users className="w-5 h-5 text-ai-blue" />
            </div>
            <Badge className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              {data.customerGrowth}%
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Customers</p>
            <p className="text-3xl mb-0">{data.totalCustomers.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">
              +{data.customersAdded} this month
            </p>
          </div>
        </div>
      </Card>

      {/* Customer Lifetime Value */}
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-ai-blue/30 transition-all duration-300">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <Badge className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              {data.lifetimeValueGrowth}%
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Avg Lifetime Value</p>
            <p className="text-3xl mb-0">${data.avgLifetimeValue}</p>
            <p className="text-xs text-muted-foreground mt-1">
              +${data.lifetimeValueIncrease} from last period
            </p>
          </div>
        </div>
      </Card>

      {/* New Customers */}
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-ai-blue/30 transition-all duration-300">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <Badge className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              {data.newCustomerGrowth}%
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">New Customers</p>
            <p className="text-3xl mb-0">{data.newCustomers}</p>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </div>
        </div>
      </Card>

      {/* Retention Rate */}
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-ai-blue/30 transition-all duration-300">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
              <Heart className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <Badge
              className={
                data.retentionChange >= 0
                  ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                  : "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400"
              }
            >
              {data.retentionChange >= 0 ? (
                <ArrowUpRight className="w-3 h-3 mr-1" />
              ) : (
                <ArrowDownRight className="w-3 h-3 mr-1" />
              )}
              {Math.abs(data.retentionChange)}%
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Retention Rate</p>
            <p className="text-3xl mb-0">{data.retentionRate}%</p>
            <p className="text-xs text-muted-foreground mt-1">
              {data.retentionChange >= 0 ? "+" : ""}
              {data.retentionChange}% from last period
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
