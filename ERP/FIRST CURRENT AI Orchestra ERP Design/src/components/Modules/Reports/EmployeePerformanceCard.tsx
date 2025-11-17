import { motion } from "motion/react";
import { Card } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { 
  Clock, 
  Circle,
  Activity
} from "lucide-react";
import { EmployeeShift, getTimeAgo } from "../../../sampledata/computed";

interface EmployeePerformanceCardProps {
  employee: EmployeeShift;
  index: number;
}

export function EmployeePerformanceCard({ employee, index }: EmployeePerformanceCardProps) {
  const achievementPercentage = (employee.todayRevenue / employee.targetRevenue) * 100;
  
  const getShiftColor = (shift: string) => {
    switch (shift) {
      case "morning":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "afternoon":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "night":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const getShiftLabel = (shift: string) => {
    switch (shift) {
      case "morning":
        return "Morning (8AM-4PM)";
      case "afternoon":
        return "Afternoon (4PM-12AM)";
      case "night":
        return "Night (12AM-8AM)";
      default:
        return shift;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className={`p-5 bg-card/50 backdrop-blur-sm border-border/50 transition-all ${
        employee.isOnShift 
          ? 'border-ai-blue/50 shadow-lg shadow-ai-blue/10' 
          : 'hover:border-ai-blue/30'
      }`}>
        {/* Header with Name and Status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="mb-0">{employee.name}</h4>
              {employee.isOnShift && (
                <div className="flex items-center gap-1">
                  <Circle className="w-2 h-2 fill-green-500 text-green-500 animate-pulse" />
                  <span className="text-xs text-green-600 dark:text-green-400">Live</span>
                </div>
              )}
            </div>
            <Badge 
              variant="outline" 
              className={`text-xs ${getShiftColor(employee.shift)}`}
            >
              <Clock className="w-3 h-3 mr-1" />
              {getShiftLabel(employee.shift)}
            </Badge>
          </div>
          
          {/* Last Activity */}
          <div className="text-right">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Activity className="w-3 h-3" />
              {getTimeAgo(employee.lastActivity)}
            </div>
          </div>
        </div>

        {/* Revenue Display */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-ai-blue">
              ${employee.todayRevenue.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground">
              / ${employee.targetRevenue.toLocaleString()}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-2 h-2 bg-border rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-ai-blue to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(achievementPercentage, 100)}%` }}
              transition={{ duration: 0.8, delay: index * 0.05 }}
            />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-4 gap-2">
          {/* New Leads */}
          <div className="text-center p-2 rounded-lg bg-background/50">
            <p className="text-lg font-semibold mb-1">{employee.newLeads}</p>
            <p className="text-xs text-muted-foreground mb-0">New Leads</p>
          </div>

          {/* Customer Conversations */}
          <div className="text-center p-2 rounded-lg bg-background/50">
            <p className="text-lg font-semibold mb-1">{employee.customerConversations}</p>
            <p className="text-xs text-muted-foreground mb-0">Conversations</p>
          </div>

          {/* Total Messages */}
          <div className="text-center p-2 rounded-lg bg-background/50">
            <p className="text-lg font-semibold mb-1">{employee.totalMessages}</p>
            <p className="text-xs text-muted-foreground mb-0">Messages</p>
          </div>

          {/* Reach */}
          <div className="text-center p-2 rounded-lg bg-background/50">
            <p className="text-lg font-semibold mb-1">{employee.reach.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mb-0">Reach</p>
          </div>
        </div>

        {/* Achievement Badge */}
        {achievementPercentage >= 100 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 + 0.3 }}
            className="mt-3 pt-3 border-t border-border/50"
          >
            <Badge className="w-full justify-center bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400">
              🎉 Target Achieved!
            </Badge>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}
