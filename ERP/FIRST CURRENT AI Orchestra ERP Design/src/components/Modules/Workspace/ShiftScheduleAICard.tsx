import { Card } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Sparkles, Brain, Calendar, Users, TrendingUp, MessageSquare, Zap } from "lucide-react";
import { motion } from "motion/react";

export function ShiftScheduleAICard() {
  const aiCapabilities = [
    {
      icon: Brain,
      label: "Smart Scheduling",
      description: "AI optimizes shift assignments based on skills, availability, and workload"
    },
    {
      icon: TrendingUp,
      label: "Predictive Analytics",
      description: "Forecasts staffing needs and identifies potential scheduling conflicts"
    },
    {
      icon: Users,
      label: "Balanced Distribution",
      description: "Ensures fair shift distribution across team members"
    },
    {
      icon: MessageSquare,
      label: "Request Intelligence",
      description: "AI analyzes request patterns and suggests optimal approvals"
    },
    {
      icon: Calendar,
      label: "Auto-Fill Gaps",
      description: "Automatically suggests replacements for open shifts"
    },
    {
      icon: Zap,
      label: "Real-time Adjustments",
      description: "Instantly adapts schedules to last-minute changes"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-5 border-ai-blue/30 bg-gradient-to-br from-ai-blue/10 via-purple-500/5 to-ai-blue/5 backdrop-blur-sm">
        <div className="flex items-start gap-4">
          {/* AI Icon */}
          <div className="p-3 rounded-xl bg-ai-blue/20 shrink-0 animate-pulse-slow">
            <Sparkles className="w-6 h-6 text-ai-blue" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <h3 className="mb-0">AI-Powered Shift Management</h3>
              <Badge className="bg-ai-blue/20 text-ai-blue border-ai-blue/30">
                6 AI Features Active
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Our AI assistant helps you create optimal schedules, predict staffing needs, and manage requests intelligently.
            </p>

            {/* Capabilities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {aiCapabilities.map((capability, index) => {
                const Icon = capability.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-start gap-2 p-3 rounded-lg bg-background/50 border border-ai-blue/10 hover:border-ai-blue/30 hover:bg-ai-blue/5 transition-all"
                  >
                    <Icon className="w-4 h-4 text-ai-blue mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm mb-0.5">{capability.label}</p>
                      <p className="text-xs text-muted-foreground mb-0">{capability.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
