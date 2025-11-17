import { Card } from "../../../ui/card";
import { DollarSign, TrendingUp, Users, Percent } from "lucide-react";
import { motion } from "motion/react";

interface PromotionStatsCardsProps {
  totalRevenue: number;
  totalRedemptions: number;
  avgConversionRate: number;
  activePromotionsCount: number;
}

export function PromotionStatsCards({
  totalRevenue,
  totalRedemptions,
  avgConversionRate,
  activePromotionsCount,
}: PromotionStatsCardsProps) {
  const stats = [
    {
      label: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "#10B981",
      bgColor: "bg-green-500/10",
    },
    {
      label: "Total Redemptions",
      value: totalRedemptions.toLocaleString(),
      icon: Users,
      color: "#4B6BFB",
      bgColor: "bg-[#4B6BFB]/10",
    },
    {
      label: "Avg. Conversion",
      value: `${avgConversionRate.toFixed(1)}%`,
      icon: Percent,
      color: "#F59E0B",
      bgColor: "bg-amber-500/10",
    },
    {
      label: "Active Promotions",
      value: activePromotionsCount.toString(),
      icon: TrendingUp,
      color: "#8B5CF6",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="p-6 border-glass-border bg-glass-bg/30 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}
              >
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
            </div>
            <p className="text-xs opacity-60 mb-1">{stat.label}</p>
            <p className="text-2xl mb-0">{stat.value}</p>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
