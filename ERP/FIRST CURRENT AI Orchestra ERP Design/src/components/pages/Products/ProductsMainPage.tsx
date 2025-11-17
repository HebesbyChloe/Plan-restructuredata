import { Card } from "../../ui/card";
import { Package, Gem, Box, Tag, DollarSign, Folder, TrendingUp, Sparkles, BarChart3, Layers } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";

export function ProductsMainPage() {
  const stats = [
    { label: "Total Products", value: "1,247", change: "+12%", trend: "up" },
    { label: "Collections", value: "24", change: "+3", trend: "up" },
    { label: "Total Inventory Value", value: "$2.4M", change: "+8%", trend: "up" },
    { label: "Low Stock Items", value: "18", change: "-5", trend: "down" },
  ];

  const quickActions = [
    {
      icon: Package,
      title: "Product Board",
      description: "Manage all products and SKUs",
      color: "#DAB785",
      gradient: "from-[#DAB785] to-[#C9A874]",
    },
    {
      icon: Gem,
      title: "Diamonds & Gemstones",
      description: "Track precious stones inventory",
      color: "#8B5CF6",
      gradient: "from-[#8B5CF6] to-[#A78BFA]",
    },
    {
      icon: Layers,
      title: "Materials Board",
      description: "Monitor raw materials stock",
      color: "#10B981",
      gradient: "from-[#10B981] to-[#34D399]",
    },
    {
      icon: Box,
      title: "Custom & Bundles",
      description: "Create product combinations",
      color: "#EC4899",
      gradient: "from-[#EC4899] to-[#F472B6]",
    },
    {
      icon: DollarSign,
      title: "Pricing Matrix",
      description: "Set pricing rules and tiers",
      color: "#4B6BFB",
      gradient: "from-[#4B6BFB] to-[#6B8AFF]",
    },
    {
      icon: Folder,
      title: "Collections Manager",
      description: "Organize product collections",
      color: "#F59E0B",
      gradient: "from-[#F59E0B] to-[#FBBF24]",
    },
  ];

  const recentActivity = [
    { action: "New product added", item: "Diamond Solitaire Ring", time: "2 hours ago" },
    { action: "Price updated", item: "Gold Chain Collection", time: "5 hours ago" },
    { action: "Stock replenished", item: "14K Gold Wire", time: "1 day ago" },
    { action: "Collection published", item: "Summer Essentials", time: "2 days ago" },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <Card className="p-8 bg-gradient-to-br from-[#DAB785]/10 via-white to-[#C9A874]/5 dark:from-[#DAB785]/20 dark:via-card dark:to-[#C9A874]/10 border-[#DAB785]/20">
          <div className="flex items-start justify-between">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#DAB785] to-[#C9A874] flex items-center justify-center shadow-lg">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="mb-1">Product Management</h1>
                  <p className="text-muted-foreground mb-0">
                    Centralized hub for all product operations
                  </p>
                </div>
              </div>

              <p className="text-muted-foreground max-w-2xl leading-relaxed">
                Manage your entire product catalog from luxury jewelry to raw materials. 
                Track inventory, set pricing strategies, create collections, and optimize your product portfolio.
              </p>

              <div className="flex flex-wrap gap-3">
                <Button className="gap-2 bg-gradient-to-r from-[#DAB785] to-[#C9A874] hover:from-[#C9A874] to-[#B89763] text-white">
                  <Sparkles className="w-4 h-4" />
                  AI Product Assistant
                </Button>
                <Button variant="outline" className="gap-2 border-[#DAB785] text-[#DAB785] hover:bg-[#DAB785]/10">
                  <BarChart3 className="w-4 h-4" />
                  View Analytics
                </Button>
              </div>
            </div>

            {/* Decorative Element */}
            <div className="hidden lg:block">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-32 h-32 rounded-full bg-gradient-to-br from-[#DAB785]/20 to-[#C9A874]/10 flex items-center justify-center"
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#DAB785] to-[#C9A874] opacity-20" />
              </motion.div>
            </div>
          </div>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 bg-white dark:bg-card border-[#E5E5E5] dark:border-border hover:shadow-lg transition-shadow">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <div className="flex items-end justify-between">
                  <p className="text-3xl mb-0">{stat.value}</p>
                  <Badge
                    className={
                      stat.trend === "up"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                    }
                  >
                    <TrendingUp className={`w-3 h-3 mr-1 ${stat.trend === "down" ? "rotate-180" : ""}`} />
                    {stat.change}
                  </Badge>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="p-6 bg-white dark:bg-card border-[#E5E5E5] dark:border-border hover:shadow-xl transition-all cursor-pointer group">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow`}
                  >
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1">{action.title}</h3>
                    <p className="text-sm text-muted-foreground mb-0">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6 bg-white dark:bg-card border-[#E5E5E5] dark:border-border">
            <h3 className="mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-[#F8F8F8] dark:bg-muted/30 hover:bg-[#F0F0F0] dark:hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="mb-1">{activity.action}</p>
                    <p className="text-sm text-muted-foreground mb-0">{activity.item}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="p-6 bg-gradient-to-br from-[#DAB785]/5 to-[#C9A874]/5 dark:from-[#DAB785]/10 dark:to-[#C9A874]/10 border-[#DAB785]/20">
          <h3 className="mb-4">AI Insights</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-white/50 dark:bg-black/20 border border-[#DAB785]/20">
              <div className="flex items-start gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-[#DAB785] mt-1" />
                <p className="text-sm mb-0">
                  Diamond collection showing 23% increase in demand this month
                </p>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-white/50 dark:bg-black/20 border border-[#DAB785]/20">
              <div className="flex items-start gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-[#DAB785] mt-1" />
                <p className="text-sm mb-0">
                  Consider restocking 14K Gold Wire - predicted shortage in 2 weeks
                </p>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-white/50 dark:bg-black/20 border border-[#DAB785]/20">
              <div className="flex items-start gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-[#DAB785] mt-1" />
                <p className="text-sm mb-0">
                  Bridal Collection ready for seasonal promotion campaign
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
