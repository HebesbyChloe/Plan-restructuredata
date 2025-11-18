"use client";

import { Card } from "../../ui/card";
import { useState } from "react";
import { motion } from "motion/react";
import {
  ShoppingCart,
  Package,
  Clock,
  CheckCircle,
  TrendingUp,
  AlertCircle,
  Calendar,
  BarChart3,
  Truck,
  Users,
  X,
  Sparkles,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { AIchatboxdepartmentmain } from "../../AI";
import { useAgents, useAgentSeedDataMap, sendAgentMessage } from "../../../hooks/useAgents";
import { useTenantContext } from "../../../contexts/TenantContext";

interface Notice {
  id: string;
  message: string;
  color: string;
  bgColor: string;
}

export function OrderMainPage() {
  const { currentTenantId } = useTenantContext();
  const [dateRange, setDateRange] = useState("today");
  
  // Fetch agents from database
  const { agents, loading: agentsLoading } = useAgents('orders', currentTenantId);
  const agentIds = agents.map(a => a.id);
  const { seedDataMap } = useAgentSeedDataMap(agentIds);

  const [notices, setNotices] = useState<Notice[]>([
    {
      id: "1",
      message: "🎯 342 orders in processing - 23 require immediate attention for on-time delivery",
      color: "#4B6BFB",
      bgColor: "rgba(75, 107, 251, 0.1)",
    },
    {
      id: "2",
      message: "⚡ 24 orders ready for batch processing. Estimated time savings: 2.5 hours",
      color: "#10B981",
      bgColor: "rgba(16, 185, 129, 0.1)",
    },
  ]);

  // Orders data based on selected date range
  const getOrdersData = () => {
    const dataByRange: { [key: string]: any } = {
      today: {
        totalOrders: 2847,
        processing: 342,
        completed: 1124,
        avgValue: 1247,
        statusBreakdown: [
          { name: "Processing", count: 342, percentage: 38, color: "#4B6BFB" },
          { name: "In Production", count: 287, percentage: 32, color: "#8B5CF6" },
          { name: "Ready to Ship", count: 156, percentage: 17, color: "#10B981" },
          { name: "On Hold", count: 115, percentage: 13, color: "#F59E0B" },
        ],
        orderTypes: [
          { name: "Regular Orders", count: 2340, color: "#4B6BFB" },
          { name: "Pre-Orders", count: 342, color: "#8B5CF6" },
          { name: "Custom Orders", count: 156, color: "#EC4899" },
          { name: "Warranty", count: 89, color: "#F59E0B" },
        ],
        priorities: [
          { name: "Urgent", count: 45, color: "#EF4444" },
          { name: "High", count: 128, color: "#F59E0B" },
          { name: "Normal", count: 567, color: "#10B981" },
          { name: "Low", count: 267, color: "#6B7280" },
        ],
      },
      yesterday: {
        totalOrders: 2912,
        processing: 358,
        completed: 1086,
        avgValue: 1189,
        statusBreakdown: [
          { name: "Processing", count: 358, percentage: 36, color: "#4B6BFB" },
          { name: "In Production", count: 312, percentage: 31, color: "#8B5CF6" },
          { name: "Ready to Ship", count: 187, percentage: 19, color: "#10B981" },
          { name: "On Hold", count: 138, percentage: 14, color: "#F59E0B" },
        ],
        orderTypes: [
          { name: "Regular Orders", count: 2389, color: "#4B6BFB" },
          { name: "Pre-Orders", count: 358, color: "#8B5CF6" },
          { name: "Custom Orders", count: 143, color: "#EC4899" },
          { name: "Warranty", count: 92, color: "#F59E0B" },
        ],
        priorities: [
          { name: "Urgent", count: 52, color: "#EF4444" },
          { name: "High", count: 135, color: "#F59E0B" },
          { name: "Normal", count: 594, color: "#10B981" },
          { name: "Low", count: 277, color: "#6B7280" },
        ],
      },
    };
    return dataByRange[dateRange] || dataByRange.today;
  };

  const ordersData = getOrdersData();

  const handleSendMessage = async (message: string, agentId: string): Promise<string> => {
    return await sendAgentMessage(message, agentId);
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Notice Banners */}
      {notices.length > 0 && (
        <div className="space-y-3 mb-6">
          {notices.map((notice) => (
            <motion.div
              key={notice.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-lg border backdrop-blur-sm p-4 flex items-start gap-4"
              style={{
                borderLeftWidth: "4px",
                borderLeftColor: notice.color,
                backgroundColor: notice.bgColor,
                borderTopColor: "var(--border)",
                borderRightColor: "var(--border)",
                borderBottomColor: "var(--border)",
              }}
            >
              <div
                className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                style={{ backgroundColor: notice.color }}
              />
              <p className="flex-1 leading-relaxed">{notice.message}</p>
              <button
                onClick={() => setNotices(notices.filter((n) => n.id !== notice.id))}
                className="flex-shrink-0 w-6 h-6 rounded-full hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-center transition-colors"
              >
                <X className="w-3 h-3 opacity-40 hover:opacity-100" />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Orders Statistics Dashboard - Compact */}
      <div className="mb-6">
        {/* Header with Date Range Selector */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-ai-blue" />
            <h3 className="mb-0">AI Insights</h3>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {dateRange === "today"
                    ? "Today"
                    : dateRange === "yesterday"
                    ? "Yesterday"
                    : dateRange === "last7days"
                    ? "Last 7 Days"
                    : dateRange === "thismonth"
                    ? "This Month"
                    : "Custom Range"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setDateRange("today")} className="cursor-pointer">
                Today
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateRange("yesterday")} className="cursor-pointer">
                Yesterday
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateRange("last7days")} className="cursor-pointer">
                Last 7 Days
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateRange("thismonth")} className="cursor-pointer">
                This Month
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateRange("custom")} className="cursor-pointer">
                Custom Range
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Orders - AI Powered */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-ai-blue/10 via-purple-500/5 to-transparent border-ai-blue/20 backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-ai-blue/10 rounded-full blur-3xl" />
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-ai-blue/10 flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-ai-blue" />
                  </div>
                  <Badge variant="outline" className="text-xs border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +22%
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
                <p className="text-3xl mb-0">{ordersData.totalOrders.toLocaleString()}</p>
              </div>
            </Card>
          </motion.div>

          {/* Processing Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent border-purple-500/20 backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-purple-500" />
                  </div>
                  <Badge variant="outline" className="text-xs border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400">
                    Active
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Processing</p>
                <p className="text-3xl mb-0">{ordersData.processing.toLocaleString()}</p>
              </div>
            </Card>
          </motion.div>

          {/* Completed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent border-green-500/20 backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl" />
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <Badge variant="outline" className="text-xs border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400">
                    Done
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Completed</p>
                <p className="text-3xl mb-0">{ordersData.completed.toLocaleString()}</p>
              </div>
            </Card>
          </motion.div>

          {/* Urgent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-transparent border-orange-500/20 backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl" />
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                  </div>
                  <Badge variant="outline" className="text-xs border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400">
                    Priority
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Urgent</p>
                <p className="text-3xl mb-0">
                  {ordersData.priorities.find((p: any) => p.name === "Urgent")?.count || 0}
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* AI Chatbox */}
      {!agentsLoading && agents.length > 0 && (
      <AIchatboxdepartmentmain
        agents={agents}
          defaultAgent={agents[0]?.id || "order-manager"}
          agentPrompts={seedDataMap}
        onSendMessage={handleSendMessage}
      />
      )}
    </div>
  );
}
