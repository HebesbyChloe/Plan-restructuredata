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
  Clock,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Zap,
  Brain,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  CheckCircle,
  XCircle,
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
const orderProcessingData = [
  { date: "Mon", processed: 145, avgTime: 2.1, quality: 96.2 },
  { date: "Tue", processed: 168, avgTime: 2.3, quality: 95.8 },
  { date: "Wed", processed: 152, avgTime: 2.0, quality: 97.1 },
  { date: "Thu", processed: 189, avgTime: 2.5, quality: 94.5 },
  { date: "Fri", processed: 201, avgTime: 2.8, quality: 93.9 },
  { date: "Sat", processed: 178, avgTime: 2.4, quality: 95.3 },
  { date: "Sun", processed: 134, avgTime: 1.9, quality: 97.8 },
];

const orderTypeBreakdown = [
  { name: "Standard Orders", value: 58, count: 1847 },
  { name: "Custom Orders", value: 22, count: 702 },
  { name: "Pre-Orders", value: 12, count: 382 },
  { name: "Service Orders", value: 8, count: 255 },
];

const processingTimeByType = [
  { type: "Standard", avgTime: 1.2, target: 1.5 },
  { type: "Custom", avgTime: 4.8, target: 4.0 },
  { type: "Pre-Order", avgTime: 2.1, target: 2.0 },
  { type: "Service", avgTime: 3.5, target: 3.0 },
];

const COLORS = ["#4B6BFB", "#8B5CF6", "#EC4899", "#F59E0B"];

export function OrderInsightsPage() {
  const [activeTab, setActiveTab] = useState<"insights" | "chat">("insights");

  const aiAgents: Agent[] = [
    {
      id: "order-analyst",
      name: "Order Analyst",
      avatar: "🎯",
      description: "Analyzes order patterns and trends",
      status: "online",
    },
    {
      id: "demand-forecaster",
      name: "Demand Forecaster",
      avatar: "📈",
      description: "Predicts future order volumes",
      status: "online",
    },
    {
      id: "optimization-expert",
      name: "Optimization Expert",
      avatar: "⚡",
      description: "Suggests process improvements",
      status: "online",
    },
  ];

  const promptSuggestions: PromptItem[] = [
    {
      id: "1",
      icon: "⏱️",
      title: "Processing bottlenecks",
      prompt: "Identify current bottlenecks in order processing workflow",
    },
    {
      id: "2",
      icon: "📦",
      title: "Order type analysis",
      prompt: "Which order types have the highest quality issues and why?",
    },
    {
      id: "3",
      icon: "✅",
      title: "Quality improvements",
      prompt: "How can we improve quality score and reduce return rate?",
    },
    {
      id: "4",
      icon: "⚡",
      title: "Efficiency optimization",
      prompt: "What automations can reduce average processing time?",
    },
  ];

  return (
    <div className="flex-1 overflow-auto bg-gradient-to-br from-background via-background to-ai-blue/5">
      <div className="container mx-auto p-6 max-w-[1600px]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-ai-blue to-purple-600 flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="mb-0 flex items-center gap-2">
                  Order Insights
                  <Badge variant="outline" className="bg-ai-blue/10 text-ai-blue border-ai-blue/30">
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI Powered
                  </Badge>
                </h1>
                <p className="text-sm text-muted-foreground mb-0">
                  Real-time intelligence and predictive analytics for your orders
                </p>
              </div>
            </div>
            <Button variant="outline" className="gap-2">
              <Calendar className="w-4 h-4" />
              Last 7 Days
            </Button>
          </div>
        </motion.div>

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "insights" ? "default" : "outline"}
            onClick={() => setActiveTab("insights")}
            className="gap-2"
          >
            <Brain className="w-4 h-4" />
            AI Insights
          </Button>
          <Button
            variant={activeTab === "chat" ? "default" : "outline"}
            onClick={() => setActiveTab("chat")}
            className="gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Ask AI
          </Button>
        </div>

        {/* Content based on active tab */}
        {activeTab === "insights" ? (
          <>
            {/* AI Predictions & Alerts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6"
            >
              {/* Prediction Card 1 */}
              <Card className="p-5 bg-gradient-to-br from-ai-blue/10 via-purple-500/5 to-transparent border-ai-blue/20 backdrop-blur-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-ai-blue/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-ai-blue" />
                  </div>
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/30">
                    On Track
                  </Badge>
                </div>
                <h4 className="mb-1">Processing Optimization</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  AI detected efficiency improvement. Custom orders now processed 15% faster with
                  new workflow.
                </p>
                <Button variant="link" className="text-ai-blue p-0 h-auto">
                  View Details →
                </Button>
              </Card>

              {/* Alert Card */}
              <Card className="p-5 bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-transparent border-orange-500/20 backdrop-blur-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                  </div>
                  <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/30">
                    Quality Alert
                  </Badge>
                </div>
                <h4 className="mb-1">Return Rate Increasing</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Return rate for custom orders up 2.3% this week. AI suggests quality checkpoint
                  review.
                </p>
                <Button variant="link" className="text-orange-500 p-0 h-auto">
                  Review Quality Control →
                </Button>
              </Card>

              {/* Opportunity Card */}
              <Card className="p-5 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/20 backdrop-blur-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-emerald-500" />
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                    Automation Ready
                  </Badge>
                </div>
                <h4 className="mb-1">Automate Order Routing</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  AI identified 67% of orders follow predictable patterns. Auto-routing could save
                  45 min/day.
                </p>
                <Button variant="link" className="text-emerald-500 p-0 h-auto">
                  Set Up Automation →
                </Button>
              </Card>
            </motion.div>

            {/* Key Metrics Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
            >
              <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground mb-0">Orders Processed</p>
                  <ShoppingCart className="w-4 h-4 text-ai-blue" />
                </div>
                <p className="text-2xl mb-1">1,167</p>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <ArrowUpRight className="w-3 h-3" />
                  <span>+8.4% vs last week</span>
                </div>
              </Card>

              <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground mb-0">Avg Processing Time</p>
                  <Clock className="w-4 h-4 text-purple-500" />
                </div>
                <p className="text-2xl mb-1">2.3 hrs</p>
                <div className="flex items-center gap-1 text-xs text-orange-600">
                  <ArrowDownRight className="w-3 h-3" />
                  <span>+18 min vs last week</span>
                </div>
              </Card>

              <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground mb-0">Quality Score</p>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-2xl mb-1">95.7%</p>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <ArrowUpRight className="w-3 h-3" />
                  <span>+1.2% vs last week</span>
                </div>
              </Card>

              <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground mb-0">On-Time Fulfillment</p>
                  <Target className="w-4 h-4 text-emerald-500" />
                </div>
                <p className="text-2xl mb-1">92.8%</p>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <ArrowUpRight className="w-3 h-3" />
                  <span>+3.1% vs last week</span>
                </div>
              </Card>
            </motion.div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Order Processing Trends Chart */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="mb-1">Processing & Quality Trends</h4>
                      <p className="text-sm text-muted-foreground mb-0">
                        AI-detected: Friday slowdown needs attention
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-ai-blue/10 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-ai-blue" />
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={orderProcessingData}>
                      <defs>
                        <linearGradient id="colorProcessed" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4B6BFB" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#4B6BFB" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorQuality" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="date" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(0,0,0,0.8)",
                          border: "none",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="processed"
                        stroke="#4B6BFB"
                        fillOpacity={1}
                        fill="url(#colorProcessed)"
                        name="Orders Processed"
                      />
                      <Area
                        type="monotone"
                        dataKey="quality"
                        stroke="#10B981"
                        fillOpacity={1}
                        fill="url(#colorQuality)"
                        name="Quality Score (%)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
              </motion.div>

              {/* Processing Time by Type Chart */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="mb-1">Processing Time by Order Type</h4>
                      <p className="text-sm text-muted-foreground mb-0">
                        Custom orders exceeding target time
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-purple-500" />
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={processingTimeByType}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="type" fontSize={12} />
                      <YAxis fontSize={12} label={{ value: "Hours", angle: -90, position: "insideLeft" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(0,0,0,0.8)",
                          border: "none",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="avgTime" fill="#4B6BFB" radius={[8, 8, 0, 0]} name="Actual Time" />
                      <Bar dataKey="target" fill="#8B5CF6" radius={[8, 8, 0, 0]} name="Target Time" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </motion.div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Order Type Distribution */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="mb-0">Order Type Distribution</h4>
                    <Package className="w-5 h-5 text-ai-blue" />
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={orderTypeBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {orderTypeBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-4">
                    {orderTypeBreakdown.map((type, index) => (
                      <div key={type.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[index] }}
                          />
                          <span className="text-sm">{type.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{type.value}%</span>
                          <span className="text-xs text-muted-foreground">({type.count})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              {/* AI Recommendations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="lg:col-span-2"
              >
                <Card className="p-6 bg-gradient-to-br from-ai-blue/5 via-purple-500/5 to-transparent border-ai-blue/20 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ai-blue to-purple-600 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="mb-0">AI Recommendations</h4>
                      <p className="text-sm text-muted-foreground mb-0">
                        Smart actions to improve order performance
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      {
                        icon: Clock,
                        title: "Reduce Custom Order Time",
                        desc: "Custom orders 0.8 hrs over target. AI suggests adding pre-approval step to reduce revisions by 40%",
                        impact: "High",
                        color: "text-ai-blue",
                      },
                      {
                        icon: CheckCircle,
                        title: "Quality Checkpoint Gap",
                        desc: "Missing quality check at assembly stage. Adding checkpoint could reduce return rate by 3.2%",
                        impact: "Critical",
                        color: "text-red-500",
                      },
                      {
                        icon: Zap,
                        title: "Auto-Route Standard Orders",
                        desc: "67% of orders are standard type. Auto-routing to fulfillment can save 45 min/day",
                        impact: "Medium",
                        color: "text-green-500",
                      },
                      {
                        icon: Users,
                        title: "Processing Team Balance",
                        desc: "Team A handles 68% of custom orders. Rebalance workload to improve throughput by 22%",
                        impact: "High",
                        color: "text-purple-500",
                      },
                    ].map((rec, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-lg bg-card/50 border border-border/50 hover:border-ai-blue/30 transition-all cursor-pointer"
                      >
                        <div className={`w-8 h-8 rounded-lg bg-${rec.color}/10 flex items-center justify-center flex-shrink-0`}>
                          <rec.icon className={`w-4 h-4 ${rec.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm mb-0">{rec.title}</p>
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                rec.impact === "Critical"
                                  ? "bg-red-500/10 text-red-600 border-red-500/30"
                                  : rec.impact === "High"
                                  ? "bg-ai-blue/10 text-ai-blue border-ai-blue/30"
                                  : "bg-green-500/10 text-green-600 border-green-500/30"
                              }`}
                            >
                              {rec.impact}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-0">{rec.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto"
          >
            <AIchatboxdepartmentmain
              agents={aiAgents}
              promptSuggestions={promptSuggestions}
              departmentName="Orders"
              placeholderText="Ask about order trends, predictions, or optimizations..."
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
