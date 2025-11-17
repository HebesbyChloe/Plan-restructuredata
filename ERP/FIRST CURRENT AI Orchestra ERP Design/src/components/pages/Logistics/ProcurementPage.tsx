import { Card } from "../../ui/card";
import { motion } from "motion/react";
import {
  Sparkles,
  CheckCircle,
  TrendingDown,
  Zap,
  Brain,
  Target,
  Clock,
  DollarSign,
  AlertTriangle,
  Package,
  Truck,
  Users,
  BarChart3,
  FileCheck,
  GitCompare,
  Boxes,
  ArrowRight,
  Star,
  Shield,
  Calendar,
} from "lucide-react";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

export function ProcurementPage() {
  // Mock vendor comparison data
  const vendorComparisonData = [
    { metric: "Price", vendorA: 85, vendorB: 92, vendorC: 78 },
    { metric: "Quality", vendorA: 90, vendorB: 85, vendorC: 88 },
    { metric: "Delivery", vendorA: 88, vendorB: 95, vendorC: 82 },
    { metric: "Service", vendorA: 92, vendorB: 87, vendorC: 90 },
    { metric: "Reliability", vendorA: 95, vendorB: 90, vendorC: 85 },
  ];

  // Mock cost savings trend
  const costSavingsData = [
    { month: "Jan", manual: 12500, ai: 8200 },
    { month: "Feb", manual: 13200, ai: 8500 },
    { month: "Mar", manual: 14100, ai: 8900 },
    { month: "Apr", manual: 13800, ai: 8700 },
    { month: "May", manual: 15200, ai: 9100 },
    { month: "Jun", manual: 14900, ai: 9000 },
  ];

  const aiFeatures = [
    {
      icon: GitCompare,
      title: "Smart Vendor Comparison",
      description: "AI analyzes vendor performance, pricing, quality, and delivery times to recommend the best supplier for each order",
      metrics: ["30% faster decisions", "15% cost savings", "98% accuracy"],
      color: "#4B6BFB",
      gradient: "from-blue-500/20 to-purple-500/20",
    },
    {
      icon: FileCheck,
      title: "Auto-Approve Purchase Orders",
      description: "Intelligent approval routing based on order value, vendor history, and budget constraints. Auto-approve trusted orders",
      metrics: ["85% auto-approved", "2 min avg time", "Zero errors"],
      color: "#10B981",
      gradient: "from-green-500/20 to-emerald-500/20",
    },
    {
      icon: Sparkles,
      title: "Auto-Generate Draft POs",
      description: "AI predicts inventory needs and creates draft purchase orders based on sales velocity, seasonality, and lead times",
      metrics: ["24/7 monitoring", "Prevent stockouts", "Optimal quantities"],
      color: "#8B5CF6",
      gradient: "from-purple-500/20 to-pink-500/20",
    },
    {
      icon: Truck,
      title: "Optimize Inbound Transfers",
      description: "Smart warehouse allocation and transfer optimization to reduce transit time and balance inventory across locations",
      metrics: ["40% faster transfers", "Balanced stock", "Lower shipping cost"],
      color: "#F59E0B",
      gradient: "from-orange-500/20 to-yellow-500/20",
    },
    {
      icon: AlertTriangle,
      title: "Intelligent Smart Alerts",
      description: "Proactive notifications for price changes, delivery delays, quality issues, and supplier risks before they impact operations",
      metrics: ["Real-time monitoring", "Predictive alerts", "Risk mitigation"],
      color: "#EF4444",
      gradient: "from-red-500/20 to-orange-500/20",
    },
    {
      icon: TrendingDown,
      title: "Cost Optimization Engine",
      description: "Continuous analysis of spending patterns to identify bulk discounts, alternative suppliers, and consolidation opportunities",
      metrics: ["15-25% savings", "Price tracking", "Contract optimization"],
      color: "#06B6D4",
      gradient: "from-cyan-500/20 to-blue-500/20",
    },
  ];

  const upcomingCapabilities = [
    {
      icon: Brain,
      title: "Predictive Demand Planning",
      status: "Q2 2024",
      description: "AI forecasts demand 90 days ahead with 95% accuracy",
    },
    {
      icon: Shield,
      title: "Supplier Risk Assessment",
      status: "Q3 2024",
      description: "Real-time monitoring of supplier financial health and compliance",
    },
    {
      icon: Target,
      title: "Contract Intelligence",
      status: "Q4 2024",
      description: "Automated contract analysis and renewal recommendations",
    },
  ];

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="p-6 space-y-8">
        {/* Hero Section - Coming Soon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-ai-blue/10 via-purple-500/10 to-pink-500/10" />
          <div className="absolute inset-0 backdrop-blur-3xl" />
          
          <Card className="relative border-ai-blue/20 p-12">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-ai-blue to-purple-600 flex items-center justify-center mb-6"
              >
                <Sparkles className="w-10 h-10 text-white" />
              </motion.div>
              
              <Badge className="mb-4 bg-ai-blue/10 text-ai-blue border-ai-blue/30 px-4 py-1">
                Coming Soon • Q1 2024
              </Badge>
              
              <h1 className="mb-4 bg-gradient-to-r from-ai-blue via-purple-500 to-pink-500 bg-clip-text text-transparent">
                AI-Powered Procurement
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
                The future of intelligent purchasing is here. Experience autonomous vendor selection, 
                predictive ordering, and cost optimization powered by advanced AI.
              </p>
              
              <div className="flex items-center gap-4">
                <Button size="lg" className="gap-2 bg-gradient-to-r from-ai-blue to-purple-600 hover:opacity-90">
                  <Star className="w-4 h-4" />
                  Get Early Access
                </Button>
                <Button size="lg" variant="outline" className="gap-2">
                  Watch Demo
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Stats Bar */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12 w-full">
                <div className="text-center">
                  <div className="text-3xl mb-1 bg-gradient-to-r from-ai-blue to-purple-500 bg-clip-text text-transparent">85%</div>
                  <p className="text-sm text-muted-foreground">Faster Approvals</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-1 bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">$45K</div>
                  <p className="text-sm text-muted-foreground">Avg Monthly Savings</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-1 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">98%</div>
                  <p className="text-sm text-muted-foreground">Prediction Accuracy</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-1 bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">24/7</div>
                  <p className="text-sm text-muted-foreground">Automated Monitoring</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* AI Features Grid */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Zap className="w-6 h-6 text-ai-blue" />
            <h2 className="mb-0">Intelligent Procurement Features</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {aiFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className="p-6 h-full hover:shadow-xl transition-all border-l-4 group" style={{ borderLeftColor: feature.color }}>
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
                    >
                      <feature.icon className="w-7 h-7" style={{ color: feature.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {feature.metrics.map((metric, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="text-xs"
                        style={{
                          borderColor: `${feature.color}30`,
                          backgroundColor: `${feature.color}10`,
                          color: feature.color,
                        }}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {metric}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Intelligence Preview Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Smart Vendor Comparison */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="mb-1">AI Vendor Intelligence</h3>
                  <p className="text-sm text-muted-foreground">Multi-dimensional supplier analysis</p>
                </div>
                <Badge className="bg-ai-blue/10 text-ai-blue border-ai-blue/30">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI Powered
                </Badge>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={vendorComparisonData}>
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="metric" stroke="var(--muted-foreground)" fontSize={12} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="var(--muted-foreground)" fontSize={10} />
                  <Radar name="Vendor A" dataKey="vendorA" stroke="#4B6BFB" fill="#4B6BFB" fillOpacity={0.3} />
                  <Radar name="Vendor B" dataKey="vendorB" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                  <Radar name="Vendor C" dataKey="vendorC" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-ai-blue" />
                  <span className="text-sm text-muted-foreground">Vendor A - Recommended</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm text-muted-foreground">Vendor B</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-sm text-muted-foreground">Vendor C</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Cost Optimization */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="mb-1">AI Cost Optimization</h3>
                  <p className="text-sm text-muted-foreground">Automated vs Manual procurement costs</p>
                </div>
                <Badge className="bg-green-500/10 text-green-600 border-green-500/30">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  -38% Cost
                </Badge>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={costSavingsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="manual"
                    stroke="#94A3B8"
                    strokeWidth={2}
                    name="Manual Process"
                    strokeDasharray="5 5"
                  />
                  <Line
                    type="monotone"
                    dataKey="ai"
                    stroke="#10B981"
                    strokeWidth={3}
                    name="AI Optimized"
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                  <p className="text-xs text-muted-foreground mb-1">Total Saved (6 months)</p>
                  <p className="text-2xl text-green-600">$36,400</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                  <p className="text-xs text-muted-foreground mb-1">Avg Time Saved</p>
                  <p className="text-2xl text-ai-blue">18.5 hrs</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Smart Alerts Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <h3 className="mb-0">Intelligent Alert System</h3>
              <Badge className="ml-auto bg-orange-500/10 text-orange-600 border-orange-500/30">
                3 Active Alerts
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">Price Spike Detected</p>
                      <Badge variant="outline" className="text-xs border-red-500/30 bg-red-500/10 text-red-600">
                        High Priority
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Steel supplier "Global Metals Inc" increased prices by 23% - recommend switching to "MetalCraft Co" (18% cheaper)
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>2 hours ago</span>
                      <span>•</span>
                      <span>Potential savings: $4,200/month</span>
                    </div>
                  </div>
                  <Button size="sm" className="bg-red-500 hover:bg-red-600">
                    Review
                  </Button>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-orange-500/5 border border-orange-500/20">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                    <Truck className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">Delivery Delay Predicted</p>
                      <Badge variant="outline" className="text-xs border-orange-500/30 bg-orange-500/10 text-orange-600">
                        Medium Priority
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      PO #12847 from "TechParts Supply" is 87% likely to be delayed by 3-5 days based on carrier performance
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>5 hours ago</span>
                      <span>•</span>
                      <span>Suggest expedited shipping</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Action
                  </Button>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">Stock Reorder Recommended</p>
                      <Badge variant="outline" className="text-xs border-blue-500/30 bg-blue-500/10 text-blue-600">
                        Low Priority
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      8 SKUs will reach reorder point in 5-7 days - draft PO generated for review ($12,450 total)
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>1 day ago</span>
                      <span>•</span>
                      <span>Auto-generated draft ready</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Review PO
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Upcoming Capabilities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-6 h-6 text-purple-500" />
            <h2 className="mb-0">Product Roadmap</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingCapabilities.map((capability, index) => (
              <Card key={index} className="p-6 border-dashed hover:border-solid transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center flex-shrink-0">
                    <capability.icon className="w-6 h-6 text-purple-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Badge variant="outline" className="mb-2 text-xs border-purple-500/30 bg-purple-500/10 text-purple-600">
                      {capability.status}
                    </Badge>
                    <h4 className="mb-2">{capability.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {capability.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
        >
          <Card className="p-8 bg-gradient-to-br from-ai-blue/5 via-purple-500/5 to-pink-500/5 border-ai-blue/20">
            <div className="text-center max-w-2xl mx-auto">
              <Sparkles className="w-12 h-12 text-ai-blue mx-auto mb-4" />
              <h3 className="mb-3">Be Among the First to Experience AI Procurement</h3>
              <p className="text-muted-foreground mb-6">
                Join our early access program to unlock intelligent procurement automation and save an average of $45,000 monthly
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button size="lg" className="gap-2 bg-gradient-to-r from-ai-blue to-purple-600 hover:opacity-90">
                  <Star className="w-4 h-4" />
                  Request Early Access
                </Button>
                <Button size="lg" variant="outline" className="gap-2">
                  <Calendar className="w-4 h-4" />
                  Schedule Demo
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
