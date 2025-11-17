import { motion } from "motion/react";
import { Card } from "../../ui/card";
import { Clock, Calendar } from "lucide-react";

interface HoursSummaryCardsProps {
  scheduledHours?: number;
  workedHours?: number;
  monthHours?: number;
}

export function HoursSummaryCards({
  scheduledHours = 0,
  workedHours = 0,
  monthHours = 0,
}: HoursSummaryCardsProps) {
  // Get current month name
  const monthName = new Date().toLocaleDateString('en-US', { month: 'long' });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* This Week Hours */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-4 bg-gradient-to-br from-ai-blue/10 to-blue-500/5 backdrop-blur-sm border-ai-blue/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-ai-blue/10">
                <Clock className="w-5 h-5 text-ai-blue" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-0">This Week</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{workedHours.toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">hours</span>
                </div>
              </div>
            </div>
            {scheduledHours !== undefined && scheduledHours > 0 && (
              <div className="text-right">
                <p className="text-xs text-muted-foreground mb-0">Scheduled</p>
                <p className="text-sm font-semibold mb-0">{scheduledHours.toFixed(1)}h</p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* This Month Hours */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5 backdrop-blur-sm border-purple-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-0">{monthName}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">{monthHours.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">hours</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
