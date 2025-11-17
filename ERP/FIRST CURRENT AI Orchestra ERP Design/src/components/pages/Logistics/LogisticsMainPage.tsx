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
  Building,
  ShoppingCart,
  X,
  Sparkles,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
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

export function LogisticsMainPage() {
  const [dateRange, setDateRange] = useState("today");

  const [notices, setNotices] = useState<Notice[]>([
    {
      id: "1",
      message: "📦 12 purchase orders pending approval - AI suggests prioritizing orders from Diamond Direct LLC (5-day lead time)",
      color: "#DAB785",
      bgColor: "rgba(218, 183, 133, 0.1)",
    },
    {
      id: "2",
      message: "🚨 2 vendors have delayed shipments. AI recommends reaching out to alternative suppliers for critical items",
      color: "#F59E0B",
      bgColor: "rgba(245, 158, 11, 0.1)",
    },
  ]);

  // Logistics data based on selected date range
  const getLogisticsData = () => {
    const dataByRange: { [key: string]: any } = {
      today: {
        totalPOs: 47,
        pendingPOs: 12,
        inboundShipments: 23,
        outboundShipments: 34,
        totalVendors: 34,
        activeVendors: 28,
        statusBreakdown: [
          { name: "Pending Approval", count: 12, percentage: 26, color: "#F59E0B" },
          { name: "In Transit", count: 23, percentage: 49, color: "#10B981" },
          { name: "Delivered", count: 15, percentage: 32, color: "#4B6BFB" },
          { name: "Delayed", count: 2, percentage: 4, color: "#EF4444" },
        ],
        vendorBreakdown: [
          { name: "US Gemstone Inc.", count: 12, percentage: 35, color: "#4B6BFB" },
          { name: "Vietnam Supplier Co.", count: 9, percentage: 26, color: "#10B981" },
          { name: "Diamond Direct LLC", count: 7, percentage: 21, color: "#8B5CF6" },
          { name: "Others", count: 6, percentage: 18, color: "#EC4899" },
        ],
        priorities: [
          { name: "Urgent", count: 8, color: "#EF4444" },
          { name: "High", count: 15, color: "#F59E0B" },
          { name: "Normal", count: 18, color: "#10B981" },
          { name: "Low", count: 6, color: "#6B7280" },
        ],
        supplyChainMetrics: {
          inTransitValue: "$156K",
          avgLeadTime: 8.4,
          onTimeDeliveryRate: 92.3,
          vendorReliability: 94.7,
        },
        performanceMetrics: {
          purchaseOrderAccuracy: 97.2,
          supplierResponseTime: 4.8,
          costSavings: 12.4,
          inventoryTurnover: 6.2,
        },
      },
      yesterday: {
        totalPOs: 52,
        pendingPOs: 15,
        inboundShipments: 26,
        outboundShipments: 38,
        totalVendors: 34,
        activeVendors: 30,
        statusBreakdown: [
          { name: "Pending Approval", count: 15, percentage: 29, color: "#F59E0B" },
          { name: "In Transit", count: 26, percentage: 50, color: "#10B981" },
          { name: "Delivered", count: 18, percentage: 35, color: "#4B6BFB" },
          { name: "Delayed", count: 3, percentage: 6, color: "#EF4444" },
        ],
        vendorBreakdown: [
          { name: "US Gemstone Inc.", count: 14, percentage: 35, color: "#4B6BFB" },
          { name: "Vietnam Supplier Co.", count: 11, percentage: 27, color: "#10B981" },
          { name: "Diamond Direct LLC", count: 8, percentage: 20, color: "#8B5CF6" },
          { name: "Others", count: 7, percentage: 18, color: "#EC4899" },
        ],
        priorities: [
          { name: "Urgent", count: 10, color: "#EF4444" },
          { name: "High", count: 18, color: "#F59E0B" },
          { name: "Normal", count: 20, color: "#10B981" },
          { name: "Low", count: 4, color: "#6B7280" },
        ],
        supplyChainMetrics: {
          inTransitValue: "$168K",
          avgLeadTime: 8.7,
          onTimeDeliveryRate: 91.8,
          vendorReliability: 93.9,
        },
        performanceMetrics: {
          purchaseOrderAccuracy: 96.8,
          supplierResponseTime: 5.1,
          costSavings: 11.8,
          inventoryTurnover: 6.0,
        },
      },
    };
    return dataByRange[dateRange] || dataByRange.today;
  };

  const logisticsData = getLogisticsData();

  const agents: Agent[] = [
    {
      id: "logistics-optimizer",
      name: "Logistics Optimizer AI",
      icon: Truck,
      color: "#DAB785",
      gradient: "from-[#DAB785] to-[#C9A874]",
      description:
        "Your intelligent logistics assistant. I optimize supply chain operations, manage vendor relationships, and streamline procurement processes to reduce costs and improve efficiency.",
      quote: "Efficient supply chains are built on smart decisions and reliable partnerships.",
    },
    {
      id: "procurement-specialist",
      name: "Procurement Specialist AI",
      icon: ShoppingCart,
      color: "#10B981",
      gradient: "from-[#10B981] to-[#34D399]",
      description:
        "Expert in procurement and purchasing. I help you find the best suppliers, negotiate optimal terms, manage purchase orders, and ensure timely delivery of materials.",
      quote: "Strategic procurement transforms supply chain challenges into competitive advantages.",
    },
    {
      id: "vendor-analyst",
      name: "Vendor Analyst AI",
      icon: Building,
      color: "#8B5CF6",
      gradient: "from-[#8B5CF6] to-[#A78BFA]",
      description:
        "Specialized in vendor management and relationship optimization. I monitor vendor performance, identify reliability issues, and suggest improvements to your supplier network.",
      quote: "Strong vendor relationships are the foundation of a resilient supply chain.",
    },
  ];

  const agentPrompts: { [key: string]: PromptItem[] } = {
    "logistics-optimizer": [
      { icon: Receipt, text: "Optimize purchase order workflow", color: "#DAB785" },
      { icon: BarChart3, text: "Analyze supply chain efficiency", color: "#10B981" },
      { icon: TrendingUp, text: "Identify cost-saving opportunities", color: "#F59E0B" },
      { icon: Clock, text: "Predict delivery times for active shipments", color: "#8B5CF6" },
    ],
    "procurement-specialist": [
      { icon: ShoppingCart, text: "Create optimal reorder schedule", color: "#10B981" },
      { icon: AlertCircle, text: "Identify critical stock shortages", color: "#EF4444" },
      { icon: BarChart3, text: "Compare supplier pricing and terms", color: "#4B6BFB" },
      { icon: CheckCircle, text: "Generate procurement performance report", color: "#8B5CF6" },
    ],
    "vendor-analyst": [
      { icon: Building, text: "Evaluate vendor performance metrics", color: "#8B5CF6" },
      { icon: TrendingUp, text: "Recommend new supplier opportunities", color: "#4B6BFB" },
      { icon: AlertCircle, text: "Flag unreliable vendors for review", color: "#F59E0B" },
      { icon: BarChart3, text: "Analyze vendor delivery reliability", color: "#10B981" },
    ],
  };

  const handleSendMessage = async (message: string, agentId: string): Promise<string> => {
    // Simulate AI response
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const responses: { [key: string]: string } = {
      "logistics-optimizer": `Analyzing "${message}" for logistics optimization. I can help you with:\n\n• Supply chain workflow improvements\n• Lead time reduction strategies\n• Inventory optimization\n• Shipment tracking and visibility\n• Cost reduction opportunities\n\nWhat specific logistics challenge can I help you solve?`,
      "procurement-specialist": `Evaluating "${message}" from a procurement perspective. I can assist with:\n\n• Supplier selection and evaluation\n• Purchase order management\n• Pricing negotiation insights\n• Reorder point optimization\n• Procurement policy recommendations\n\nHow can I optimize your procurement process?`,
      "vendor-analyst": `Examining "${message}" for vendor relationship optimization. I can provide:\n\n• Vendor performance analytics\n• Reliability assessments\n• Alternative supplier suggestions\n• Contract compliance monitoring\n• Risk mitigation strategies\n\nWhat vendor insights would be most valuable?`,
    };

    return responses[agentId] || responses["logistics-optimizer"];
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

      {/* Logistics Statistics Dashboard - Compact */}
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
          {/* Total Purchase Orders - Gold Gradient */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-[#DAB785]/10 via-[#C9A874]/5 to-transparent border-[#DAB785]/20 backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#DAB785]/10 rounded-full blur-3xl" />
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#DAB785]/10 flex items-center justify-center">
                    <Receipt className="w-5 h-5 text-[#DAB785]" />
                  </div>
                  <Badge variant="outline" className="text-xs border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +8%
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Total Purchase Orders</p>
                <p className="text-3xl mb-0">{logisticsData.totalPOs.toLocaleString()}</p>
              </div>
            </Card>
          </motion.div>

          {/* Pending POs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-transparent border-orange-500/20 backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl" />
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-orange-500" />
                  </div>
                  <Badge variant="outline" className="text-xs border-orange-500/30 bg-orange-500/10 text-orange-600 dark:text-orange-400">
                    Pending
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Pending Approval</p>
                <p className="text-3xl mb-0">{logisticsData.pendingPOs.toLocaleString()}</p>
              </div>
            </Card>
          </motion.div>

          {/* Inbound Shipments */}
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
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                  <Badge variant="outline" className="text-xs border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400">
                    Active
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Inbound Shipments</p>
                <p className="text-3xl mb-0">{logisticsData.inboundShipments.toLocaleString()}</p>
              </div>
            </Card>
          </motion.div>

          {/* Outbound Shipments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border-blue-500/20 backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-blue-500" />
                  </div>
                  <Badge variant="outline" className="text-xs border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    In Transit
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Outbound Shipments</p>
                <p className="text-3xl mb-0">{logisticsData.outboundShipments.toLocaleString()}</p>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Stats Grid - Row 2: Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* In Transit Value */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 border-border/50 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-purple-500" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">In Transit Value</p>
              <p className="text-3xl mb-0">{logisticsData.supplyChainMetrics.inTransitValue}</p>
            </Card>
          </motion.div>

          {/* On-Time Delivery Rate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6 border-border/50 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">On-Time Delivery</p>
              <p className="text-3xl mb-0">{logisticsData.supplyChainMetrics.onTimeDeliveryRate}%</p>
            </Card>
          </motion.div>

          {/* Avg Lead Time */}
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
              <p className="text-sm text-muted-foreground mb-1">Avg Lead Time</p>
              <p className="text-3xl mb-0">{logisticsData.supplyChainMetrics.avgLeadTime} days</p>
            </Card>
          </motion.div>

          {/* Vendor Reliability */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="p-6 border-border/50 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#DAB785]/10 flex items-center justify-center">
                  <Building className="w-5 h-5 text-[#DAB785]" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Vendor Reliability</p>
              <p className="text-3xl mb-0">{logisticsData.supplyChainMetrics.vendorReliability}%</p>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* AI Chatbox */}
      <AIchatboxdepartmentmain
        agents={agents}
        defaultAgent="logistics-optimizer"
        agentPrompts={agentPrompts}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
