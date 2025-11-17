/**
 * AutomationRulesListModule
 * 
 * Displays list of automation rules with:
 * - Rule name and description
 * - Trigger and action badges
 * - Status indicators
 * - Last run time and run count
 * - Toggle, edit actions
 */

import { Card } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
import {
  Workflow,
  Zap,
  Clock,
  Activity,
  CheckCircle2,
  Pause,
  AlertCircle,
  Play,
  Edit2,
  Plus,
} from "lucide-react";
import { motion } from "motion/react";
import { AutomationRule } from "../../../../sampledata/automationData";

// Types
interface AutomationRulesListProps {
  rules: AutomationRule[];
  onNewRule?: () => void;
  onToggleRule?: (ruleId: string) => void;
  onEditRule?: (ruleId: string) => void;
}

// Helpers
const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
    case "connected":
      return "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800";
    case "paused":
    case "draft":
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800";
    case "error":
    case "disconnected":
      return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";
  }
};

export function AutomationRulesListModule({
  rules,
  onNewRule,
  onToggleRule,
  onEditRule,
}: AutomationRulesListProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="mb-0">Automation Rules</h3>
        <Button
          size="sm"
          variant="outline"
          className="gap-2"
          onClick={onNewRule}
        >
          <Plus className="w-4 h-4" />
          New Rule
        </Button>
      </div>

      {/* Rules List */}
      <div className="space-y-3">
        {rules.map((rule) => (
          <motion.div
            key={rule.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="p-4 glass-card hover:shadow-md transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-9 h-9 rounded-lg bg-[#4B6BFB]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Workflow className="w-4 h-4 text-[#4B6BFB]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="mb-2">{rule.name}</h4>
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <Badge
                        variant="outline"
                        className="text-xs bg-[#4B6BFB]/5 border-[#4B6BFB]/20"
                      >
                        <Zap className="w-3 h-3 mr-1 text-[#4B6BFB]" />
                        {rule.trigger}
                      </Badge>
                      <span className="text-xs text-muted-foreground">→</span>
                      <Badge variant="outline" className="text-xs bg-accent">
                        {rule.action}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {rule.lastRun && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {rule.lastRun}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        {rule.runsToday} runs today
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge className={getStatusColor(rule.status)}>
                    {rule.status === "active" && (
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                    )}
                    {rule.status === "paused" && (
                      <Pause className="w-3 h-3 mr-1" />
                    )}
                    {rule.status === "error" && (
                      <AlertCircle className="w-3 h-3 mr-1" />
                    )}
                    {rule.status}
                  </Badge>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => onToggleRule?.(rule.id)}
                  >
                    {rule.status === "active" ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => onEditRule?.(rule.id)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
