"use client";

import { Card } from "../../ui/card";
import { useState } from "react";
import { motion } from "motion/react";
import {
  Package,
  Gem,
  Layers,
  Box,
  DollarSign,
  Folder,
  TrendingUp,
  AlertCircle,
  BarChart3,
  Tag,
  X,
  Sparkles,
  Calendar,
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

export function ProductMainPage() {
  const [dateRange, setDateRange] = useState("today");

  const [notices, setNotices] = useState<Notice[]>([
    {
      id: "1",
      message: "📦 18 products have low stock levels - Consider replenishment for optimal inventory",
      color: "#4B6BFB",
      bgColor: "rgba(75, 107, 251, 0.1)",
    },
    {
      id: "2",
      message: "💎 New gemstone shipment received - 47 items ready for cataloging and pricing",
      color: "#10B981",
      bgColor: "rgba(16, 185, 129, 0.1)",
    },
  ]);

  // Products data based on selected date range
  const getProductsData = () => {
    const dataByRange: { [key: string]: any } = {
      today: {
        totalProducts: 1247,
        activeProducts: 1089,
        draftProducts: 78,
        lowStockItems: 18,
        categoryBreakdown: [
          { name: "Rings", count: 342, percentage: 28, color: "#DAB785" },
          { name: "Necklaces", count: 287, percentage: 23, color: "#8B5CF6" },
          { name: "Earrings", count: 246, percentage: 20, color: "#EC4899" },
          { name: "Bracelets", count: 189, percentage: 15, color: "#10B981" },
          { name: "Others", count: 183, percentage: 14, color: "#F59E0B" },
        ],
        materialTypes: [
          { name: "Gold Products", count: 645, color: "#DAB785" },
          { name: "Diamond Items", count: 389, color: "#8B5CF6" },
          { name: "Silver Products", count: 156, color: "#6B7280" },
          { name: "Gemstone Items", count: 57, color: "#EC4899" },
        ],
        inventoryStatus: [
          { name: "In Stock", count: 1089, color: "#10B981" },
          { name: "Low Stock", count: 78, color: "#F59E0B" },
          { name: "Out of Stock", count: 45, color: "#EF4444" },
          { name: "Pre-order", count: 35, color: "#4B6BFB" },
        ],
      },
      yesterday: {
        totalProducts: 1245,
        activeProducts: 1087,
        draftProducts: 76,
        lowStockItems: 23,
        categoryBreakdown: [
          { name: "Rings", count: 340, percentage: 27, color: "#DAB785" },
          { name: "Necklaces", count: 289, percentage: 23, color: "#8B5CF6" },
          { name: "Earrings", count: 244, percentage: 20, color: "#EC4899" },
          { name: "Bracelets", count: 188, percentage: 15, color: "#10B981" },
          { name: "Others", count: 184, percentage: 15, color: "#F59E0B" },
        ],
        materialTypes: [
          { name: "Gold Products", count: 643, color: "#DAB785" },
          { name: "Diamond Items", count: 387, color: "#8B5CF6" },
          { name: "Silver Products", count: 158, color: "#6B7280" },
          { name: "Gemstone Items", count: 57, color: "#EC4899" },
        ],
        inventoryStatus: [
          { name: "In Stock", count: 1087, color: "#10B981" },
          { name: "Low Stock", count: 76, color: "#F59E0B" },
          { name: "Out of Stock", count: 47, color: "#EF4444" },
          { name: "Pre-order", count: 35, color: "#4B6BFB" },
        ],
      },
      thisWeek: {
        totalProducts: 1240,
        activeProducts: 1082,
        draftProducts: 74,
        lowStockItems: 21,
        categoryBreakdown: [
          { name: "Rings", count: 338, percentage: 27, color: "#DAB785" },
          { name: "Necklaces", count: 285, percentage: 23, color: "#8B5CF6" },
          { name: "Earrings", count: 242, percentage: 20, color: "#EC4899" },
          { name: "Bracelets", count: 186, percentage: 15, color: "#10B981" },
          { name: "Others", count: 189, percentage: 15, color: "#F59E0B" },
        ],
        materialTypes: [
          { name: "Gold Products", count: 640, color: "#DAB785" },
          { name: "Diamond Items", count: 385, color: "#8B5CF6" },
          { name: "Silver Products", count: 160, color: "#6B7280" },
          { name: "Gemstone Items", count: 55, color: "#EC4899" },
        ],
        inventoryStatus: [
          { name: "In Stock", count: 1082, color: "#10B981" },
          { name: "Low Stock", count: 74, color: "#F59E0B" },
          { name: "Out of Stock", count: 49, color: "#EF4444" },
          { name: "Pre-order", count: 35, color: "#4B6BFB" },
        ],
      },
      thisMonth: {
        totalProducts: 1230,
        activeProducts: 1075,
        draftProducts: 68,
        lowStockItems: 25,
        categoryBreakdown: [
          { name: "Rings", count: 335, percentage: 27, color: "#DAB785" },
          { name: "Necklaces", count: 283, percentage: 23, color: "#8B5CF6" },
          { name: "Earrings", count: 239, percentage: 19, color: "#EC4899" },
          { name: "Bracelets", count: 184, percentage: 15, color: "#10B981" },
          { name: "Others", count: 189, percentage: 16, color: "#F59E0B" },
        ],
        materialTypes: [
          { name: "Gold Products", count: 635, color: "#DAB785" },
          { name: "Diamond Items", count: 380, color: "#8B5CF6" },
          { name: "Silver Products", count: 162, color: "#6B7280" },
          { name: "Gemstone Items", count: 53, color: "#EC4899" },
        ],
        inventoryStatus: [
          { name: "In Stock", count: 1075, color: "#10B981" },
          { name: "Low Stock", count: 68, color: "#F59E0B" },
          { name: "Out of Stock", count: 52, color: "#EF4444" },
          { name: "Pre-order", count: 35, color: "#4B6BFB" },
        ],
      },
    };

    return dataByRange[dateRange];
  };

  const data = getProductsData();

  const dismissNotice = (id: string) => {
    setNotices((prev) => prev.filter((notice) => notice.id !== id));
  };

  const productAgents: Agent[] = [
    {
      id: "catalog-assistant",
      name: "Product Catalog Assistant",
      description: "Manage products, create SKUs, and optimize catalog",
      icon: Package,
      color: "#DAB785",
      gradient: "from-[#DAB785] to-[#C9A874]",
      quote: "A well-organized catalog is the foundation of great sales.",
    },
    {
      id: "inventory-optimizer",
      name: "Inventory Optimizer",
      description: "Track stock levels and prevent stockouts",
      icon: BarChart3,
      color: "#10B981",
      gradient: "from-[#10B981] to-[#34D399]",
      quote: "Perfect inventory balance drives profitability.",
    },
    {
      id: "pricing-strategist",
      name: "Pricing Strategist",
      description: "Set competitive prices and manage margins",
      icon: DollarSign,
      color: "#4B6BFB",
      gradient: "from-[#4B6BFB] to-[#6B8AFF]",
      quote: "Smart pricing maximizes value for both seller and buyer.",
    },
    {
      id: "collection-curator",
      name: "Collection Curator",
      description: "Create and organize product collections",
      icon: Folder,
      color: "#F59E0B",
      gradient: "from-[#F59E0B] to-[#FBBF24]",
      quote: "Great collections tell a story and inspire purchases.",
    },
  ];

  const agentPrompts: { [key: string]: PromptItem[] } = {
    "catalog-assistant": [
      { icon: Package, text: "Show me all products with low stock levels", color: "#DAB785" },
      { icon: Tag, text: "Create new product variants", color: "#10B981" },
      { icon: Sparkles, text: "Optimize product descriptions with AI", color: "#4B6BFB" },
      { icon: BarChart3, text: "Analyze product performance", color: "#F59E0B" },
    ],
    "inventory-optimizer": [
      { icon: AlertCircle, text: "Which products need restocking?", color: "#EF4444" },
      { icon: TrendingUp, text: "Predict inventory needs for next month", color: "#10B981" },
      { icon: BarChart3, text: "Generate inventory value report", color: "#4B6BFB" },
      { icon: Package, text: "Suggest inventory optimization", color: "#F59E0B" },
    ],
    "pricing-strategist": [
      { icon: DollarSign, text: "Suggest pricing optimization for my catalog", color: "#4B6BFB" },
      { icon: TrendingUp, text: "Analyze margin trends", color: "#10B981" },
      { icon: BarChart3, text: "Compare prices with market", color: "#F59E0B" },
      { icon: Gem, text: "Price new gemstone collection", color: "#DAB785" },
    ],
    "collection-curator": [
      { icon: Folder, text: "Create a seasonal collection", color: "#F59E0B" },
      { icon: Box, text: "Help me create a new product bundle", color: "#DAB785" },
      { icon: Sparkles, text: "Suggest trending collection ideas", color: "#4B6BFB" },
      { icon: Tag, text: "Organize products by category", color: "#10B981" },
    ],
  };

  const handleSendMessage = async (message: string, agentId: string): Promise<string> => {
    // Simulate AI response
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const responses: { [key: string]: string } = {
      "catalog-assistant": `Analyzing "${message}" from a product catalog perspective. I can help you with:\n\n• Product organization and categorization\n• SKU management and optimization\n• Variant creation and management\n• Product description enhancement\n• Catalog performance analysis\n\nWhat specific aspect would you like to explore?`,
      "inventory-optimizer": `Looking at "${message}" for inventory optimization. I can assist with:\n\n• Stock level monitoring\n• Restock recommendations\n• Inventory forecasting\n• Value reporting\n• Stockout prevention\n\nLet's optimize your inventory management!`,
      "pricing-strategist": `Considering "${message}" from a pricing perspective. I can provide:\n\n• Price optimization suggestions\n• Margin analysis\n• Competitive pricing insights\n• Dynamic pricing strategies\n• Promotional pricing recommendations\n\nHow can I help maximize your profitability?`,
      "collection-curator": `Exploring "${message}" for collection management. I can help with:\n\n• Seasonal collection creation\n• Product bundling strategies\n• Collection organization\n• Trend-based curation\n• Cross-selling opportunities\n\nLet's create compelling product collections!`,
    };

    return responses[agentId] || responses["catalog-assistant"];
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

      {/* Product Statistics Dashboard - Compact */}
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
                    : dateRange === "thisWeek"
                    ? "This Week"
                    : dateRange === "thisMonth"
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
              <DropdownMenuItem onClick={() => setDateRange("thisWeek")} className="cursor-pointer">
                This Week
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateRange("thisMonth")} className="cursor-pointer">
                This Month
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Products - AI Powered */}
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
                    <Package className="w-5 h-5 text-[#DAB785]" />
                  </div>
                  <Badge variant="outline" className="text-xs border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +2.1%
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Total Products</p>
                <p className="text-3xl mb-0">{data.totalProducts.toLocaleString()}</p>
              </div>
            </Card>
          </motion.div>

          {/* Active Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent border-green-500/20 backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl" />
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <Tag className="w-5 h-5 text-green-500" />
                  </div>
                  <Badge variant="outline" className="text-xs border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400">
                    Active
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Active Products</p>
                <p className="text-3xl mb-0">{data.activeProducts.toLocaleString()}</p>
              </div>
            </Card>
          </motion.div>

          {/* Draft Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent border-purple-500/20 backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <Layers className="w-5 h-5 text-purple-500" />
                  </div>
                  <Badge variant="outline" className="text-xs border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400">
                    Draft
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Draft Products</p>
                <p className="text-3xl mb-0">{data.draftProducts}</p>
              </div>
            </Card>
          </motion.div>

          {/* Low Stock Items */}
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
                <p className="text-sm text-muted-foreground mb-1">Low Stock</p>
                <p className="text-3xl mb-0">{data.lowStockItems}</p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* AI Chatbox */}
      <AIchatboxdepartmentmain
        agents={productAgents}
        defaultAgent="catalog-assistant"
        agentPrompts={agentPrompts}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
