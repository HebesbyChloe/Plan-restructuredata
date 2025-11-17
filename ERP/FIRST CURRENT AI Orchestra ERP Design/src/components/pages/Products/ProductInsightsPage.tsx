"use client";

import { Card } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { motion } from "motion/react";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Sparkles,
  Target,
  DollarSign,
  Package,
  Tag,
  Zap,
  Brain,
  ArrowUpRight,
  ArrowDownRight,
  Gem,
  Layers,
  ShoppingBag,
  BarChart3,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import { AIchatboxdepartmentmain, ChatAgent as Agent, PromptItem } from "../../AI";
import { useState } from "react";

// Mock Data
const productPerformanceData = [
  { month: "Jan", revenue: 245000, units: 1240, margin: 42.5 },
  { month: "Feb", revenue: 268000, units: 1340, margin: 43.2 },
  { month: "Mar", revenue: 289000, units: 1450, margin: 44.1 },
  { month: "Apr", revenue: 312000, units: 1560, margin: 45.0 },
  { month: "May", revenue: 295000, units: 1480, margin: 43.8 },
  { month: "Jun", revenue: 334000, units: 1670, margin: 46.2 },
];

const categoryPerformance = [
  { name: "Rings", value: 28, revenue: 892000, margin: 48.2 },
  { name: "Necklaces", value: 23, revenue: 734000, margin: 45.8 },
  { name: "Earrings", value: 20, revenue: 638000, margin: 44.1 },
  { name: "Bracelets", value: 15, revenue: 478000, margin: 42.5 },
  { name: "Others", value: 14, revenue: 446000, margin: 40.2 },
];

const inventoryTrends = [
  { week: "W1", inStock: 1089, lowStock: 45, outOfStock: 23 },
  { week: "W2", inStock: 1102, lowStock: 38, outOfStock: 19 },
  { week: "W3", inStock: 1095, lowStock: 42, outOfStock: 21 },
  { week: "W4", inStock: 1108, lowStock: 35, outOfStock: 18 },
];

const topSellingProducts = [
  { name: "Diamond Solitaire Ring", units: 245, revenue: 245000, growth: 12.5 },
  { name: "Gold Chain Necklace", units: 189, revenue: 151200, growth: 8.3 },
  { name: "Pearl Stud Earrings", units: 312, revenue: 124800, growth: 15.2 },
  { name: "Silver Bracelet Set", units: 156, revenue: 93600, growth: -2.1 },
  { name: "Ruby Pendant", units: 98, revenue: 117600, growth: 22.8 },
];

const COLORS = ["#DAB785", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];

export function ProductInsightsPage() {
  const [activeTab, setActiveTab] = useState<"insights" | "chat">("insights");

  const aiAgents: Agent[] = [
    {
      id: "product-analyst",
      name: "Product Analyst",
      description: "Analyzes product performance and trends",
      icon: BarChart3,
      color: "#DAB785",
      gradient: "from-[#DAB785] to-[#C9A874]",
      quote: "Data reveals the story behind every product.",
    },
    {
      id: "inventory-forecaster",
      name: "Inventory Forecaster",
      description: "Predicts stock needs and trends",
      icon: Package,
      color: "#10B981",
      gradient: "from-[#10B981] to-[#34D399]",
      quote: "Anticipate demand, prevent stockouts.",
    },
    {
      id: "pricing-optimizer",
      name: "Pricing Optimizer",
      description: "Suggests optimal pricing strategies",
      icon: DollarSign,
      color: "#4B6BFB",
      gradient: "from-[#4B6BFB] to-[#6B8AFF]",
      quote: "The right price at the right time maximizes value.",
    },
  ];

  const agentPrompts: { [key: string]: PromptItem[] } = {
    "product-analyst": [
      { icon: Target, text: "What are my best performing product categories?", color: "#DAB785" },
      { icon: TrendingDown, text: "Show me products with declining sales", color: "#EF4444" },
      { icon: BarChart3, text: "Analyze profit margins by category", color: "#4B6BFB" },
      { icon: TrendingUp, text: "Compare this month vs last month", color: "#10B981" },
    ],
    "inventory-forecaster": [
      { icon: AlertTriangle, text: "Which products need restocking this week?", color: "#EF4444" },
      { icon: Package, text: "Predict inventory needs for next 30 days", color: "#10B981" },
      { icon: BarChart3, text: "Compare inventory levels to last quarter", color: "#4B6BFB" },
      { icon: TrendingUp, text: "Forecast seasonal demand", color: "#F59E0B" },
    ],
    "pricing-optimizer": [
      { icon: DollarSign, text: "Suggest optimal pricing for new products", color: "#4B6BFB" },
      { icon: Tag, text: "Suggest products for upcoming promotion", color: "#F59E0B" },
      { icon: TrendingUp, text: "Analyze price elasticity", color: "#10B981" },
      { icon: Target, text: "Optimize margins without losing sales", color: "#DAB785" },
    ],
  };

  const handleSendMessage = async (message: string, agentId: string): Promise<string> => {
    // Simulate AI response
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const responses: { [key: string]: string } = {
      "product-analyst": `Analyzing "${message}" from a product analytics perspective. I can help you with:\n\n• Performance trend analysis\n• Category comparisons\n• Margin optimization\n• Sales pattern identification\n• Growth opportunity detection\n\nWhat specific metrics would you like to explore?`,
      "inventory-forecaster": `Looking at "${message}" for inventory forecasting. I can assist with:\n\n• Demand prediction\n• Restock scheduling\n• Seasonal trend analysis\n• Safety stock calculations\n• Supply chain optimization\n\nLet's ensure optimal inventory levels!`,
      "pricing-optimizer": `Considering "${message}" from a pricing optimization perspective. I can provide:\n\n• Price elasticity analysis\n• Competitive pricing insights\n• Promotional strategy recommendations\n• Margin maximization\n• Dynamic pricing suggestions\n\nHow can I help optimize your pricing strategy?`,
    };

    return responses[agentId] || responses["product-analyst"];
  };

  return (
    <div className="space-y-6 max-w-[1600px]">
      {/* Header */}
      <div>
        <h1 className="mb-2">Product Insights</h1>
        <p className="text-muted-foreground">
          Analytics and insights for your product catalog performance
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-3">
        <Button
          variant={activeTab === "insights" ? "default" : "outline"}
          onClick={() => setActiveTab("insights")}
          className="gap-2"
        >
          <BarChart3 className="w-4 h-4" />
          Insights Dashboard
        </Button>
        <Button
          variant={activeTab === "chat" ? "default" : "outline"}
          onClick={() => setActiveTab("chat")}
          className="gap-2"
        >
          <Sparkles className="w-4 h-4" />
          AI Assistant
        </Button>
      </div>

      {activeTab === "insights" ? (
        <>
          {/* AI Insights Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 bg-gradient-to-br from-emerald-500/10 to-emerald-400/5 border-emerald-500/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-400 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Best Performer</p>
                  <p className="mb-0">Diamond Solitaire Ring</p>
                  <Badge className="mt-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    +22.8% growth
                  </Badge>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-amber-500/10 to-amber-400/5 border-amber-500/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-400 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Low Stock Alert</p>
                  <p className="mb-0">18 products</p>
                  <Badge className="mt-2 bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    Requires restocking
                  </Badge>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-[#DAB785]/10 to-[#C9A874]/5 border-[#DAB785]/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#DAB785] to-[#C9A874] flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Avg Margin</p>
                  <p className="mb-0">44.6%</p>
                  <Badge className="mt-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    +2.3% vs last month
                  </Badge>
                </div>
              </div>
            </Card>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Revenue (YTD)</p>
                  <h2 className="mb-0">$2.1M</h2>
                  <Badge className="mt-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +18.5%
                  </Badge>
                </div>
                <div className="w-10 h-10 rounded-lg bg-ai-blue/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-ai-blue" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Units Sold</p>
                  <h2 className="mb-0">8,740</h2>
                  <Badge className="mt-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12.3%
                  </Badge>
                </div>
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-purple-500" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Inventory Value</p>
                  <h2 className="mb-0">$2.4M</h2>
                  <Badge className="mt-2 bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    Optimized
                  </Badge>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-emerald-500" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Avg Order Value</p>
                  <h2 className="mb-0">$242</h2>
                  <Badge className="mt-2 bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    -3.2%
                  </Badge>
                </div>
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Tag className="w-5 h-5 text-amber-500" />
                </div>
              </div>
            </Card>
          </div>

          {/* Performance Trend Chart */}
          <Card className="p-6">
            <h3 className="mb-6">Product Performance Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={productPerformanceData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DAB785" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#DAB785" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorUnits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4B6BFB" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4B6BFB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#DAB785"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  name="Revenue ($)"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="units"
                  stroke="#4B6BFB"
                  fillOpacity={1}
                  fill="url(#colorUnits)"
                  name="Units Sold"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Performance */}
            <Card className="p-6">
              <h3 className="mb-6">Performance by Category</h3>
              <div className="grid grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryPerformance}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {categoryPerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3">
                  {categoryPerformance.map((cat, index) => (
                    <div key={cat.name}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[index] }}
                          />
                          <span className="text-muted-foreground">{cat.name}</span>
                        </div>
                        <span>{cat.value}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-0">
                        ${(cat.revenue / 1000).toFixed(0)}K • {cat.margin}% margin
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Inventory Trends */}
            <Card className="p-6">
              <h3 className="mb-6">Inventory Trends</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={inventoryTrends}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="inStock" fill="#10B981" name="In Stock" />
                  <Bar dataKey="lowStock" fill="#F59E0B" name="Low Stock" />
                  <Bar dataKey="outOfStock" fill="#EF4444" name="Out of Stock" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Top Selling Products */}
          <Card className="p-6">
            <h3 className="mb-6">Top Selling Products</h3>
            <div className="space-y-4">
              {topSellingProducts.map((product, index) => (
                <motion.div
                  key={product.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#DAB785] to-[#C9A874] flex items-center justify-center">
                      <span className="text-white">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="mb-0">{product.name}</p>
                      <p className="text-sm text-muted-foreground mb-0">
                        {product.units} units sold • ${product.revenue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={
                      product.growth > 0
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-red-500/10 text-red-600 dark:text-red-400"
                    }
                  >
                    {product.growth > 0 ? (
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 mr-1" />
                    )}
                    {Math.abs(product.growth)}%
                  </Badge>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* AI Recommendations */}
          <Card className="p-6 bg-gradient-to-br from-ai-blue/5 to-purple-500/5 border-ai-blue/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-ai-blue to-purple-500 flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2">AI Recommendations</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Zap className="w-4 h-4 mt-0.5 text-ai-blue flex-shrink-0" />
                    <span>
                      Consider increasing inventory for "Pearl Stud Earrings" - showing 15.2% growth trend
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="w-4 h-4 mt-0.5 text-ai-blue flex-shrink-0" />
                    <span>
                      Review pricing for "Silver Bracelet Set" - experiencing 2.1% decline in sales
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="w-4 h-4 mt-0.5 text-ai-blue flex-shrink-0" />
                    <span>
                      18 products need restocking to maintain optimal inventory levels
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </>
      ) : (
        <AIchatboxdepartmentmain
          agents={aiAgents}
          defaultAgent="product-analyst"
          agentPrompts={agentPrompts}
          onSendMessage={handleSendMessage}
        />
      )}
    </div>
  );
}
