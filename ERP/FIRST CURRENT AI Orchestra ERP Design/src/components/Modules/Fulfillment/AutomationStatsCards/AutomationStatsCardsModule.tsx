/**
 * AutomationStatsCardsModule
 * 
 * Displays quick stats for automation control:
 * - Active Flows
 * - Runs Today
 * - Connections
 * - Templates
 */

import { Card } from "../../../ui/card";
import { Activity, Zap, Network, FileText } from "lucide-react";

// Types
interface AutomationStatsCardsProps {
  activeFlows: number;
  runsToday: number;
  connections: number;
  templates: number;
}

export function AutomationStatsCardsModule({
  activeFlows,
  runsToday,
  connections,
  templates,
}: AutomationStatsCardsProps) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {/* Active Flows */}
      <Card className="p-4 glass-card border-[#4B6BFB]/20 hover:border-[#4B6BFB]/40 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Active Flows</p>
            <p className="text-2xl mb-0">{activeFlows}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#4B6BFB]/10 flex items-center justify-center">
            <Activity className="w-5 h-5 text-[#4B6BFB]" />
          </div>
        </div>
      </Card>

      {/* Runs Today */}
      <Card className="p-4 glass-card border-purple-200/50 dark:border-purple-800/30 hover:border-purple-300 dark:hover:border-purple-700 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Runs Today</p>
            <p className="text-2xl mb-0">{runsToday}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </Card>

      {/* Connections */}
      <Card className="p-4 glass-card border-cyan-200/50 dark:border-cyan-800/30 hover:border-cyan-300 dark:hover:border-cyan-700 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Connections</p>
            <p className="text-2xl mb-0">{connections}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
            <Network className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          </div>
        </div>
      </Card>

      {/* Templates */}
      <Card className="p-4 glass-card border-pink-200/50 dark:border-pink-800/30 hover:border-pink-300 dark:hover:border-pink-700 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Templates</p>
            <p className="text-2xl mb-0">{templates}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
            <FileText className="w-5 h-5 text-pink-600 dark:text-pink-400" />
          </div>
        </div>
      </Card>
    </div>
  );
}
