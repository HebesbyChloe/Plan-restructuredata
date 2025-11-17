import { motion } from "motion/react";
import { Card } from "../../ui/card";
import { DollarSign, TrendingUp, ArrowUpRight } from "lucide-react";

interface ChannelRevenue {
  channel: string;
  revenue: number;
  percentage: number;
  change: number;
  color: string;
}

interface ChannelRevenueBarProps {
  channels: ChannelRevenue[];
  totalRevenue: number;
  index?: number;
}

export function ChannelRevenueBar({ channels, totalRevenue, index = 0 }: ChannelRevenueBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="p-6 bg-gradient-to-br from-ai-blue/5 to-purple-500/5 backdrop-blur-sm border-ai-blue/20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ai-blue/20 to-purple-500/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-ai-blue" />
            </div>
            <div>
              <h3 className="mb-0">Revenue Across Channels</h3>
              <p className="text-sm text-muted-foreground">Channel performance breakdown</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
            <p className="text-2xl font-semibold text-ai-blue mb-0">
              ${totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Revenue Bar - Stacked */}
        <div className="mb-6">
          <div className="h-2 bg-border/20 rounded-full overflow-hidden flex gap-0.5">
            {channels.map((channel, idx) => (
              <motion.div
                key={channel.channel}
                className="relative group cursor-pointer first:rounded-l-full last:rounded-r-full"
                style={{ 
                  width: `${channel.percentage}%`,
                  backgroundColor: channel.color,
                  opacity: 0.8,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${channel.percentage}%` }}
                transition={{ duration: 0.8, delay: 0.2 + idx * 0.1 }}
              >
                <div className="absolute inset-0 bg-white/0 group-hover:opacity-100 transition-opacity" 
                     style={{ opacity: 0.8 }} 
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Channel Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {channels.map((channel, idx) => (
            <motion.div
              key={channel.channel}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 + idx * 0.05 }}
              className="p-4 rounded-lg bg-background/50 border border-border/50 hover:border-ai-blue/30 transition-all"
            >
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: channel.color }}
                />
                <p className="text-sm font-medium mb-0">{channel.channel}</p>
              </div>
              <p className="text-xl font-semibold mb-1">
                ${channel.revenue.toLocaleString()}
              </p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground mb-0">
                  {channel.percentage.toFixed(1)}%
                </p>
                <div className={`flex items-center gap-1 text-xs ${
                  channel.change >= 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {channel.change >= 0 ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <TrendingUp className="w-3 h-3 rotate-180" />
                  )}
                  <span className="mb-0">{Math.abs(channel.change)}%</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
