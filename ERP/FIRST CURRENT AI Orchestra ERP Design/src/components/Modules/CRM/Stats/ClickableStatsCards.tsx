import { Card } from "../../../ui/card";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "motion/react";

/**
 * ClickableStatsCards - A reusable module for displaying 3 clickable stat cards
 * 
 * @description
 * This module displays up to 3 statistical cards in a responsive grid layout.
 * Each card can be made interactive with an onClick handler.
 * 
 * @usage
 * ```tsx
 * import { ClickableStatsCards, StatCardData } from "./Modules/CRM/ClickableStatsCards";
 * import { TrendingUp, Users, DollarSign } from "lucide-react";
 * 
 * const stats: StatCardData[] = [
 *   {
 *     id: "revenue",
 *     label: "Total Revenue",
 *     value: "$45,680",
 *     icon: DollarSign,
 *     iconColor: "text-emerald-600",
 *     iconBgColor: "bg-emerald-500/10",
 *     trend: { value: "+12.5%", isPositive: true },
 *     subtitle: "vs last month",
 *     onClick: () => console.log("View details"),
 *   },
 *   // ... more stats
 * ];
 * 
 * <ClickableStatsCards stats={stats} />
 * ```
 */

export interface StatCardData {
  id: string;
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  subtitle?: string;
  onClick?: () => void;
  filterValue?: string; // Value to use for filtering
}

interface ClickableStatsCardsProps {
  stats: StatCardData[];
  selectedId?: string | null; // Track which card is selected
  onSelect?: (id: string | null) => void; // Callback when card is clicked
}

export function ClickableStatsCards({ stats, selectedId, onSelect }: ClickableStatsCardsProps) {
  const handleCardClick = (stat: StatCardData) => {
    // Toggle selection - if already selected, deselect it
    const newSelectedId = selectedId === stat.id ? null : stat.id;
    onSelect?.(newSelectedId);
    stat.onClick?.();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const isSelected = selectedId === stat.id;
        const iconColor = stat.iconColor || "text-[#4B6BFB]";
        const iconBgColor = stat.iconBgColor || "bg-[#4B6BFB]/10";
        
        return (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={`p-4 backdrop-blur-sm transition-all duration-300 ${
                isSelected
                  ? 'bg-[#4B6BFB]/10 border-[#4B6BFB] shadow-lg scale-[1.02] ring-2 ring-[#4B6BFB]/20'
                  : 'bg-glass-bg border-glass-border'
              } ${
                stat.onClick || onSelect
                  ? 'cursor-pointer hover:shadow-lg hover:scale-[1.02] hover:border-[#4B6BFB]/30' 
                  : ''
              }`}
              onClick={() => (stat.onClick || onSelect) && handleCardClick(stat)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm opacity-60 mb-2">{stat.label}</p>
                  <div className="flex items-baseline gap-2 mb-1">
                    <h3 className="text-2xl mb-0">{stat.value}</h3>
                    {stat.trend && (
                      <div className={`flex items-center gap-1 text-sm ${
                        stat.trend.isPositive 
                          ? 'text-emerald-600 dark:text-emerald-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {stat.trend.isPositive ? (
                          <TrendingUp className="w-3.5 h-3.5" />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5" />
                        )}
                        <span>{stat.trend.value}</span>
                      </div>
                    )}
                  </div>
                  {stat.subtitle && (
                    <p className="text-xs opacity-50 mb-0">{stat.subtitle}</p>
                  )}
                </div>
                <div className={`w-12 h-12 rounded-xl ${iconBgColor} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
              </div>

              {(stat.onClick || onSelect) && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className={`text-xs mb-0 flex items-center gap-1 transition-all ${
                    isSelected ? 'text-[#4B6BFB] opacity-90' : 'opacity-60'
                  }`}>
                    {isSelected ? '✓ Filtering active' : 'Click to view'}
                    {!isSelected && <span className="inline-block transition-transform group-hover:translate-x-1">→</span>}
                  </p>
                </div>
              )}
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
