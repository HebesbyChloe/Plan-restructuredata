"use client";

import { Card } from "../../ui/card";
import { useState } from "react";
import { motion } from "motion/react";
import {
  Package,
  Truck,
  CheckCircle,
  TrendingUp,
  AlertCircle,
  Calendar,
  BarChart3,
  Layers,
  Warehouse,
  X,
  Sparkles,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { AIchatboxdepartmentmain, ChatAgent as Agent, PromptItem } from "../../AI";

interface Notice {
  id: string;
  message: string;
  color: string;
  bgColor: string;
}

export function FulfillmentMainPage() {
  const [dateRange, setDateRange] = useState("today");

  const [notices, setNotices] = useState<Notice[]>([
    {
      id: "1",
      message: "🚀 142 shipments ready for batch processing - Estimated time savings: 3.2 hours with AI optimization",
      color: "#4B6BFB",
      bgColor: "rgba(75, 107, 251, 0.1)",
    },
    {
      id: "2",
      message: "⚡ 8 items approaching low stock threshold. AI suggests restocking within 48 hours",
      color: "#F59E0B",
      bgColor: "rgba(245, 158, 11, 0.1)",
    },
  ]);

  // Fulfillment data based on selected date range
  const getFulfillmentData = () => {
    const dataByRange: { [key: string]: any } = {
      today: {
        totalShipments: 1847,
        readyToShip: 142,
        inTransit: 468,
        delivered: 892,
        avgDeliveryTime: 2.3,
        statusBreakdown: [
          { name: "Ready to Ship", count: 142, percentage: 28, color: "#4B6BFB" },
          { name: "In Transit", count: 468, percentage: 38, color: "#10B981" },
          { name: "Out for Delivery", count: 245, percentage: 24, color: "#8B5CF6" },
          { name: "Exception", count: 89, percentage: 10, color: "#F59E0B" },
        ],
        carrierBreakdown: [
          { name: "USPS", count: 687, percentage: 37, color: "#4B6BFB" },
          { name: "UPS", count: 534, percentage: 29, color: "#10B981" },
          { name: "FedEx", count: 412, percentage: 22, color: "#8B5CF6" },
          { name: "DHL", count: 214, percentage: 12, color: "#EC4899" },
        ],
        priorities: [
          { name: "Urgent", count: 23, color: "#EF4444" },
          { name: "High", count: 87, color: "#F59E0B" },
          { name: "Normal", count: 412, color: "#10B981" },
          { name: "Low", count: 154, color: "#6B7280" },
        ],
        inventoryMetrics: {
          lowStock: 8,
          outOfStock: 2,
          adequate: 187,
          overstocked: 12,
        },
        performanceMetrics: {
          onTimeRate: 94.2,
          returnRate: 2.1,
          avgPackingTime: 4.2,
          batchEfficiency: 89.7,
        },
      },
      yesterday: {
        totalShipments: 1923,
        readyToShip: 156,
        inTransit: 512,
        delivered: 934,
        avgDeliveryTime: 2.4,
        statusBreakdown: [
          { name: "Ready to Ship", count: 156, percentage: 26, color: "#4B6BFB" },
          { name: "In Transit", count: 512, percentage: 40, color: "#10B981" },
          { name: "Out for Delivery", count: 267, percentage: 22, color: "#8B5CF6" },
          { name: "Exception", count: 94, percentage: 12, color: "#F59E0B" },
        ],
        carrierBreakdown: [
          { name: "USPS", count: 712, percentage: 37, color: "#4B6BFB" },
          { name: "UPS", count: 558, percentage: 29, color: "#10B981" },
          { name: "FedEx", count: 431, percentage: 22, color: "#8B5CF6" },
          { name: "DHL", count: 222, percentage: 12, color: "#EC4899" },
        ],
        priorities: [
          { name: "Urgent", count: 28, color: "#EF4444" },
          { name: "High", count: 92, color: "#F59E0B" },
          { name: "Normal", count: 438, color: "#10B981" },
          { name: "Low", count: 162, color: "#6B7280" },
        ],
        inventoryMetrics: {
          lowStock: 12,
          outOfStock: 3,
          adequate: 184,
          overstocked: 14,
        },
        performanceMetrics: {
          onTimeRate: 93.8,
          returnRate: 2.3,
          avgPackingTime: 4.4,
          batchEfficiency: 88.2,
        },
      },
    };
    return dataByRange[dateRange] || dataByRange.today;
  };

  const fulfillmentData = getFulfillmentData();

  const agents: Agent[] = [
    {
      id: "fulfillment-optimizer",
      name: "Fulfillment Optimizer AI",
      icon: Package,
      color: "#4B6BFB",
      gradient: "from-[#4B6BFB] to-[#6B8AFF]",
      description:
        "Your intelligent fulfillment assistant. I optimize shipping routes, batch processing, and warehouse operations to maximize efficiency and reduce costs.",
      quote: "Speed and accuracy together create exceptional delivery experiences.",
    },
    {
      id: "logistics-coordinator",
      name: "Logistics Coordinator AI",
      icon: Truck,
      color: "#10B981",
      gradient: "from-[#10B981] to-[#34D399]",
      description:
        "Expert in carrier management and delivery optimization. I help select the best carriers, track shipments in real-time, and predict delivery exceptions before they happen.",
      quote: "Every shipment is an opportunity to exceed expectations.",
    },
    {
      id: "inventory-analyst",
      name: "Inventory Analyst AI",
      icon: Warehouse,
      color: "#8B5CF6",
      gradient: "from-[#8B5CF6] to-[#A78BFA]",
      description:
        "Specialized in inventory management and demand forecasting. I monitor stock levels, predict reorder points, and optimize warehouse space allocation.",
      quote: "Smart inventory management is the backbone of efficient fulfillment.",
    },
  ];

  const agentPrompts: { [key: string]: PromptItem[] } = {
    "fulfillment-optimizer": [
      { icon: Layers, text: "Create optimal batch groups for today's shipments", color: "#4B6BFB" },
      { icon: BarChart3, text: "Analyze packing efficiency trends", color: "#10B981" },
      { icon: TrendingUp, text: "Suggest workflow improvements", color: "#F59E0B" },
      { icon: Clock, text: "Predict fulfillment time for current queue", color: "#8B5CF6" },
    ],
    "logistics-coordinator": [
      { icon: Truck, text: "Which carrier is best for priority shipments?", color: "#10B981" },
      { icon: AlertCircle, text: "Identify potential delivery exceptions", color: "#EF4444" },
      { icon: BarChart3, text: "Compare carrier performance metrics", color: "#4B6BFB" },
      { icon: CheckCircle, text: "Generate daily shipment status report", color: "#8B5CF6" },
    ],
    "inventory-analyst": [
      { icon: Warehouse, text: "Show items needing immediate restock", color: "#8B5CF6" },
      { icon: TrendingUp, text: "Predict next week's inventory needs", color: "#4B6BFB" },
      { icon: AlertCircle, text: "Identify overstocked items for clearance", color: "#F59E0B" },
      { icon: BarChart3, text: "Optimize warehouse space allocation", color: "#10B981" },
    ],
  };

  const handleSendMessage = async (message: string, agentId: string): Promise<string> => {
    // Simulate AI response
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const responses: { [key: string]: string } = {
      "fulfillment-optimizer": `Analyzing "${message}" for fulfillment optimization. I can help you with:\n\n• Batch processing strategies\n• Packing efficiency improvements\n• Workflow automation suggestions\n• Resource allocation optimization\n• Time and cost savings analysis\n\nWhat specific aspect would you like to optimize?`,
      "logistics-coordinator": `Evaluating "${message}" from a logistics perspective. I can assist with:\n\n• Carrier selection and routing\n• Delivery time predictions\n• Exception management\n• Real-time tracking insights\n• Performance benchmarking\n\nLet's ensure smooth deliveries!`,
      "inventory-analyst": `Examining "${message}" for inventory optimization. I can provide:\n\n• Stock level monitoring\n• Reorder point calculations\n• Demand forecasting\n• Space optimization strategies\n• Turnover rate analysis\n\nHow can I help optimize your inventory?`,
    };

    return responses[agentId] || responses["fulfillment-optimizer"];
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

      {/* Fulfillment Statistics Dashboard - Compact */}
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

        {/* Stats Grid - Row 1: Primary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Total Shipments - AI Powered */}
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
                    <Package className="w-5 h-5 text-ai-blue" />
                  </div>
                  <Badge variant="outline" className="text-xs border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +18%
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Total Shipments</p>
                <p className="text-3xl mb-0">{fulfillmentData.totalShipments.toLocaleString()}</p>
              </div>
            </Card>
          </motion.div>

          {/* Ready to Ship */}
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
                    <Layers className="w-5 h-5 text-purple-500" />
                  </div>
                  <Badge variant="outline" className="text-xs border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400">
                    Pending
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Ready to Ship</p>
                <p className="text-3xl mb-0">{fulfillmentData.readyToShip.toLocaleString()}</p>
              </div>
            </Card>
          </motion.div>

          {/* In Transit */}
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
                    <Truck className="w-5 h-5 text-green-500" />
                  </div>
                  <Badge variant="outline" className="text-xs border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400">
                    Active
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">In Transit</p>
                <p className="text-3xl mb-0">{fulfillmentData.inTransit.toLocaleString()}</p>
              </div>
            </Card>
          </motion.div>

          {/* Delivered */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-teal-500/10 via-teal-500/5 to-transparent border-teal-500/20 backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl" />
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-teal-500" />
                  </div>
                  <Badge variant="outline" className="text-xs border-teal-500/30 bg-teal-500/10 text-teal-600 dark:text-teal-400">
                    Done
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Delivered</p>
                <p className="text-3xl mb-0">{fulfillmentData.delivered.toLocaleString()}</p>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Stats Grid - Row 2: Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* On-Time Rate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 border-border/50 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">On-Time Rate</p>
              <p className="text-3xl mb-0">{fulfillmentData.performanceMetrics.onTimeRate}%</p>
            </Card>
          </motion.div>

          {/* Return Rate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6 border-border/50 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-orange-500" />
                </div>
                <ArrowDownRight className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Return Rate</p>
              <p className="text-3xl mb-0">{fulfillmentData.performanceMetrics.returnRate}%</p>
            </Card>
          </motion.div>

          {/* Avg Packing Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-6 border-border/50 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-500" />
                </div>
                <ArrowDownRight className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Avg Packing Time</p>
              <p className="text-3xl mb-0">{fulfillmentData.performanceMetrics.avgPackingTime} min</p>
            </Card>
          </motion.div>

          {/* Batch Efficiency */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="p-6 border-border/50 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-purple-500" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Batch Efficiency</p>
              <p className="text-3xl mb-0">{fulfillmentData.performanceMetrics.batchEfficiency}%</p>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* AI Chatbox */}
      <AIchatboxdepartmentmain
        agents={agents}
        defaultAgent="fulfillment-optimizer"
        agentPrompts={agentPrompts}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
