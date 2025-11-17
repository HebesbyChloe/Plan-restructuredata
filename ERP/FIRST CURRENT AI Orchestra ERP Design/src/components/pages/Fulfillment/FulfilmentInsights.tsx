"use client";

import { Card } from "../../ui/card";
import { useState } from "react";
import { motion } from "motion/react";
import {
  Package,
  Truck,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Clock,
  CheckCircle,
  BarChart3,
  Sparkles,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Zap,
  DollarSign,
  Users,
  Box,
  MapPin,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
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
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

export function FulfilmentInsights() {
  const [dateRange, setDateRange] = useState("last7days");

  // Delivery Performance Trend Data
  const deliveryTrendData = [
    { date: "Mon", onTime: 94, delayed: 4, exceptions: 2 },
    { date: "Tue", onTime: 96, delayed: 3, exceptions: 1 },
    { date: "Wed", onTime: 93, delayed: 5, exceptions: 2 },
    { date: "Thu", onTime: 95, delayed: 4, exceptions: 1 },
    { date: "Fri", onTime: 97, delayed: 2, exceptions: 1 },
    { date: "Sat", onTime: 92, delayed: 6, exceptions: 2 },
    { date: "Sun", onTime: 94, delayed: 5, exceptions: 1 },
  ];

  // Carrier Performance Data
  const carrierPerformanceData = [
    { carrier: "USPS", deliveryRate: 94.2, avgTime: 2.8, cost: 12.5, volume: 687 },
    { carrier: "UPS", deliveryRate: 96.8, avgTime: 2.3, cost: 18.2, volume: 534 },
    { carrier: "FedEx", deliveryRate: 95.5, avgTime: 2.5, cost: 16.8, volume: 412 },
    { carrier: "DHL", deliveryRate: 93.1, avgTime: 3.1, cost: 22.4, volume: 214 },
  ];

  // Fulfillment Volume Trend
  const volumeTrendData = [
    { week: "Week 1", shipped: 1240, delivered: 1180, returns: 28 },
    { week: "Week 2", shipped: 1380, delivered: 1320, returns: 32 },
    { week: "Week 3", shipped: 1520, delivered: 1460, returns: 35 },
    { week: "Week 4", shipped: 1680, delivered: 1620, returns: 38 },
  ];

  // Warehouse Efficiency
  const warehouseData = [
    { name: "Warehouse A", efficiency: 92, throughput: 450, accuracy: 98.5 },
    { name: "Warehouse B", efficiency: 88, throughput: 380, accuracy: 97.2 },
    { name: "Warehouse C", efficiency: 95, throughput: 520, accuracy: 99.1 },
  ];

  // AI Predictions
  const aiPredictions = [
    {
      icon: Truck,
      title: "Delivery Time Optimization",
      prediction: "Switch 45% of USPS shipments to UPS for 0.5 day faster delivery",
      impact: "+12% customer satisfaction, +$450/week cost",
      confidence: 94,
      color: "#4B6BFB",
    },
    {
      icon: Box,
      title: "Inventory Restock Alert",
      prediction: "8 SKUs will reach critical stock in 3 days based on current velocity",
      impact: "Reorder now to avoid stockouts",
      confidence: 89,
      color: "#F59E0B",
    },
    {
      icon: DollarSign,
      title: "Cost Optimization",
      prediction: "Batch processing 142 ready orders can save 3.2 hours of labor",
      impact: "Save $240 in operational costs",
      confidence: 96,
      color: "#10B981",
    },
    {
      icon: MapPin,
      title: "Zone-Based Routing",
      prediction: "Optimize East Coast routes to reduce avg delivery time by 0.8 days",
      impact: "+8% on-time delivery rate",
      confidence: 91,
      color: "#8B5CF6",
    },
  ];

  // Performance Metrics
  const performanceMetrics = [
    {
      label: "Avg Fulfillment Time",
      value: "18.4 hrs",
      change: -8.2,
      trend: "down",
      target: "< 20 hrs",
      status: "good",
    },
    {
      label: "Pick Accuracy",
      value: "98.7%",
      change: 1.3,
      trend: "up",
      target: "> 98%",
      status: "excellent",
    },
    {
      label: "Pack Efficiency",
      value: "89.7%",
      change: 4.2,
      trend: "up",
      target: "> 85%",
      status: "excellent",
    },
    {
      label: "Return Rate",
      value: "2.1%",
      change: -0.4,
      trend: "down",
      target: "< 3%",
      status: "good",
    },
  ];

  // Shipping Zones Distribution
  const zoneDistributionData = [
    { name: "Zone 1-2", value: 420, color: "#4B6BFB" },
    { name: "Zone 3-4", value: 680, color: "#10B981" },
    { name: "Zone 5-6", value: 520, color: "#F59E0B" },
    { name: "Zone 7-8", value: 227, color: "#8B5CF6" },
  ];

  // Hourly Processing Volume
  const hourlyVolumeData = [
    { hour: "8AM", volume: 45 },
    { hour: "9AM", volume: 78 },
    { hour: "10AM", volume: 124 },
    { hour: "11AM", volume: 156 },
    { hour: "12PM", volume: 132 },
    { hour: "1PM", volume: 98 },
    { hour: "2PM", volume: 142 },
    { hour: "3PM", volume: 167 },
    { hour: "4PM", volume: 189 },
    { hour: "5PM", volume: 145 },
  ];

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ai-blue to-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="mb-0">AI-Powered Fulfillment Insights</h2>
                <p className="text-sm text-muted-foreground">
                  Smart analytics and predictive intelligence for optimal operations
                </p>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {dateRange === "today"
                    ? "Today"
                    : dateRange === "yesterday"
                    ? "Yesterday"
                    : dateRange === "last7days"
                    ? "Last 7 Days"
                    : dateRange === "last30days"
                    ? "Last 30 Days"
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
              <DropdownMenuItem onClick={() => setDateRange("last30days")} className="cursor-pointer">
                Last 30 Days
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* AI Predictions Grid */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-ai-blue" />
            <h3 className="mb-0">AI Predictions & Recommendations</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiPredictions.map((prediction, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 border-l-4 hover:shadow-lg transition-all" style={{ borderLeftColor: prediction.color }}>
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${prediction.color}15` }}
                    >
                      <prediction.icon className="w-6 h-6" style={{ color: prediction.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="mb-0">{prediction.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {prediction.confidence}% confident
                        </Badge>
                      </div>
                      <p className="text-sm mb-2">{prediction.prediction}</p>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">{prediction.impact}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-ai-blue" />
            <h3 className="mb-0">Performance Metrics</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {performanceMetrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
              >
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                    {metric.trend === "up" ? (
                      <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                        <ArrowUpRight className="w-4 h-4" />
                        <span className="text-xs">{Math.abs(metric.change)}%</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                        <ArrowDownRight className="w-4 h-4" />
                        <span className="text-xs">{Math.abs(metric.change)}%</span>
                      </div>
                    )}
                  </div>
                  <p className="text-3xl mb-2">{metric.value}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">Target: {metric.target}</p>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        metric.status === "excellent"
                          ? "border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400"
                          : "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                      }`}
                    >
                      {metric.status === "excellent" ? "Excellent" : "Good"}
                    </Badge>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Delivery Performance Trend */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="mb-1">Delivery Performance Trend</h4>
                  <p className="text-sm text-muted-foreground">Last 7 days on-time delivery rate</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={deliveryTrendData}>
                  <defs>
                    <linearGradient id="colorOnTime" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorDelayed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                  <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="onTime"
                    stroke="#10B981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorOnTime)"
                    name="On Time %"
                  />
                  <Area
                    type="monotone"
                    dataKey="delayed"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorDelayed)"
                    name="Delayed %"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Carrier Performance Comparison */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="mb-1">Carrier Performance</h4>
                  <p className="text-sm text-muted-foreground">On-time delivery rate by carrier</p>
                </div>
                <Truck className="w-5 h-5 text-ai-blue" />
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={carrierPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                  <XAxis dataKey="carrier" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="deliveryRate" fill="#4B6BFB" radius={[8, 8, 0, 0]} name="Delivery Rate %" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Fulfillment Volume Trend */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="mb-1">Fulfillment Volume Trend</h4>
                  <p className="text-sm text-muted-foreground">Weekly shipment volume analysis</p>
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={volumeTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                  <XAxis dataKey="week" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="shipped" stroke="#4B6BFB" strokeWidth={2} name="Shipped" />
                  <Line type="monotone" dataKey="delivered" stroke="#10B981" strokeWidth={2} name="Delivered" />
                  <Line type="monotone" dataKey="returns" stroke="#F59E0B" strokeWidth={2} name="Returns" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Shipping Zones Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="mb-1">Shipping Zones Distribution</h4>
                  <p className="text-sm text-muted-foreground">Orders by shipping zone</p>
                </div>
                <MapPin className="w-5 h-5 text-purple-500" />
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={zoneDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {zoneDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </div>

        {/* Detailed Analytics Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Carrier Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="w-5 h-5 text-ai-blue" />
                <h4 className="mb-0">Carrier Analytics</h4>
              </div>
              <div className="space-y-3">
                {carrierPerformanceData.map((carrier, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-ai-blue/20 to-purple-500/20 flex items-center justify-center">
                          <Truck className="w-5 h-5 text-ai-blue" />
                        </div>
                        <div>
                          <p className="font-medium">{carrier.carrier}</p>
                          <p className="text-xs text-muted-foreground">{carrier.volume} shipments</p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={`${
                          carrier.deliveryRate >= 96
                            ? "border-green-500/30 bg-green-500/10 text-green-600"
                            : carrier.deliveryRate >= 94
                            ? "border-blue-500/30 bg-blue-500/10 text-blue-600"
                            : "border-orange-500/30 bg-orange-500/10 text-orange-600"
                        }`}
                      >
                        {carrier.deliveryRate}%
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground mb-1">Avg Delivery</p>
                        <p className="font-medium">{carrier.avgTime} days</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Avg Cost</p>
                        <p className="font-medium">${carrier.cost}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Warehouse Efficiency */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-green-500" />
                <h4 className="mb-0">Warehouse Efficiency</h4>
              </div>
              <div className="space-y-3">
                {warehouseData.map((warehouse, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                          <Package className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                          <p className="font-medium">{warehouse.name}</p>
                          <p className="text-xs text-muted-foreground">{warehouse.throughput} orders/day</p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={`${
                          warehouse.efficiency >= 92
                            ? "border-green-500/30 bg-green-500/10 text-green-600"
                            : "border-blue-500/30 bg-blue-500/10 text-blue-600"
                        }`}
                      >
                        {warehouse.efficiency}%
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground mb-1">Efficiency</p>
                        <p className="font-medium">{warehouse.efficiency}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Accuracy</p>
                        <p className="font-medium">{warehouse.accuracy}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Hourly Processing Volume */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="mb-1">Hourly Processing Volume</h4>
                <p className="text-sm text-muted-foreground">Orders processed by hour - optimize staffing</p>
              </div>
              <Clock className="w-5 h-5 text-purple-500" />
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={hourlyVolumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                <XAxis dataKey="hour" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="volume" fill="#8B5CF6" radius={[8, 8, 0, 0]} name="Orders Processed" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
