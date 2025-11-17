import { Card } from "../../ui/card";
import { Truck, TrendingUp, Package, ShoppingCart, Building, Receipt, Layers, Sparkles, BarChart3, AlertTriangle } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";

export function LogisticsInsights() {
  const stats = [
    { label: "Active Shipments", value: "47", change: "+8", trend: "up" },
    { label: "Pending POs", value: "12", change: "+3", trend: "up" },
    { label: "Total Vendors", value: "34", change: "+2", trend: "up" },
    { label: "In Transit Value", value: "$156K", change: "+15%", trend: "up" },
  ];

  const quickActions = [
    {
      icon: TrendingUp,
      title: "Inbound Shipments",
      description: "Track incoming inventory",
      color: "#10B981",
      gradient: "from-[#10B981] to-[#34D399]",
    },
    {
      icon: Truck,
      title: "Outbound Shipments",
      description: "Manage outgoing deliveries",
      color: "#4B6BFB",
      gradient: "from-[#4B6BFB] to-[#6B8AFF]",
    },
    {
      icon: Receipt,
      title: "Purchase Orders",
      description: "Create and track POs",
      color: "#DAB785",
      gradient: "from-[#DAB785] to-[#C9A874]",
    },
    {
      icon: ShoppingCart,
      title: "Procurement",
      description: "Reorder inventory items",
      color: "#F59E0B",
      gradient: "from-[#F59E0B] to-[#FBBF24]",
    },
    {
      icon: Building,
      title: "Vendors & Suppliers",
      description: "Manage supplier relationships",
      color: "#8B5CF6",
      gradient: "from-[#8B5CF6] to-[#A78BFA]",
    },
    {
      icon: Layers,
      title: "Batch Management",
      description: "Track production batches",
      color: "#EC4899",
      gradient: "from-[#EC4899] to-[#F472B6]",
    },
  ];

  const shipmentStatus = [
    { label: "In Transit", count: 23, color: "bg-blue-500" },
    { label: "Delivered", count: 15, color: "bg-green-500" },
    { label: "Processing", count: 7, color: "bg-yellow-500" },
    { label: "Delayed", count: 2, color: "bg-red-500" },
  ];

  const criticalItems = [
    { item: "Blue Sapphire 2ct", vendor: "US Gemstone Inc.", status: "Critical Stock", eta: "Oct 15" },
    { item: "14K Gold Wire", vendor: "Vietnam Supplier Co.", status: "Low Stock", eta: "Oct 18" },
    { item: "Diamond 1.5ct", vendor: "Diamond Direct LLC", status: "Pending Order", eta: "Oct 20" },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <Card className="p-8 bg-gradient-to-br from-blue-500/10 via-white to-green-500/5 dark:from-blue-500/20 dark:via-card dark:to-green-500/10 border-blue-500/20">
          <div className="flex items-start justify-between">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center shadow-lg">
                  <Truck className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="mb-1">Logistics & Supply Chain</h1>
                  <p className="text-muted-foreground mb-0">
                    End-to-end logistics management
                  </p>
                </div>
              </div>

              <p className="text-muted-foreground max-w-2xl leading-relaxed">
                Streamline your supply chain operations from procurement to delivery. 
                Track shipments, manage vendors, optimize inventory, and ensure timely fulfillment.
              </p>

              <div className="flex flex-wrap gap-3">
                <Button className="gap-2 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 to-green-600 text-white">
                  <Sparkles className="w-4 h-4" />
                  AI Logistics Assistant
                </Button>
                <Button variant="outline" className="gap-2 border-blue-500 text-blue-500 hover:bg-blue-500/10">
                  <BarChart3 className="w-4 h-4" />
                  Supply Chain Analytics
                </Button>
              </div>
            </div>

            {/* Decorative Element */}
            <div className="hidden lg:block">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/20 to-green-500/10 flex items-center justify-center"
              >
                <Truck className="w-16 h-16 text-blue-500 opacity-30" />
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
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    <TrendingUp className="w-3 h-3 mr-1" />
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

      {/* Shipment Status & Critical Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 bg-white dark:bg-card border-[#E5E5E5] dark:border-border">
          <h3 className="mb-4">Shipment Status</h3>
          <div className="space-y-4">
            {shipmentStatus.map((status, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${status.color}`} />
                  <span className="text-sm">{status.label}</span>
                </div>
                <span className="text-lg">{status.count}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-[#E5E5E5] dark:border-border">
            <Button variant="outline" className="w-full">
              View All Shipments
            </Button>
          </div>
        </Card>

        <div className="lg:col-span-2">
          <Card className="p-6 bg-white dark:bg-card border-[#E5E5E5] dark:border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="mb-0">Critical Procurement</h3>
              <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Attention Required
              </Badge>
            </div>
            <div className="space-y-4">
              {criticalItems.map((item, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border border-[#E5E5E5] dark:border-border hover:bg-[#F8F8F8] dark:hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="mb-1">{item.item}</p>
                      <p className="text-sm text-muted-foreground mb-0">{item.vendor}</p>
                    </div>
                    <Badge
                      className={
                        item.status === "Critical Stock"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                          : item.status === "Low Stock"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                      }
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">ETA: {item.eta}</span>
                    <Button size="sm" variant="outline" className="h-7">
                      Create PO
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
