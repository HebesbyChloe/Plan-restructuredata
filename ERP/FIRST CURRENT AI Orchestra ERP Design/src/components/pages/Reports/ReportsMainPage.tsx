import { Card } from "../../ui/card";
import { 
  BarChart3, 
  Sparkles, 
  ShoppingCart, 
  Users, 
  Package, 
  TrendingUp, 
  Megaphone,
  Truck,
  Settings
} from "lucide-react";
import { motion } from "motion/react";
import { Badge } from "../../ui/badge";

export function ReportsMainPage() {
  const departmentReports = [
    {
      icon: ShoppingCart,
      title: "Sales Team Reports",
      description: "Performance, conversions, and revenue analytics",
      gradient: "from-[#4B6BFB] to-[#6B8AFF]",
      department: "Sales",
    },
    {
      icon: Users,
      title: "CRM Reports",
      description: "Customer insights and engagement metrics",
      gradient: "from-[#10B981] to-[#34D399]",
      department: "CRM",
    },
    {
      icon: Package,
      title: "Product Reports",
      description: "Inventory, stock levels, and product performance",
      gradient: "from-[#DAB785] to-[#C9A874]",
      department: "Products",
    },
    {
      icon: Megaphone,
      title: "Marketing Reports",
      description: "Campaign ROI, ads performance, and reach",
      gradient: "from-[#EC4899] to-[#F472B6]",
      department: "Marketing",
    },
    {
      icon: TrendingUp,
      title: "Operations Reports",
      description: "Fulfillment, shipping, and operational efficiency",
      gradient: "from-[#8B5CF6] to-[#A78BFA]",
      department: "Operations",
    },
    {
      icon: Truck,
      title: "Logistics Reports",
      description: "Supply chain, procurement, and vendor analytics",
      gradient: "from-[#F59E0B] to-[#FBBF24]",
      department: "Logistics",
    },
    {
      icon: Settings,
      title: "Administration Reports",
      description: "Team performance, compliance, and system usage",
      gradient: "from-[#06B6D4] to-[#22D3EE]",
      department: "Administration",
    },
    {
      icon: BarChart3,
      title: "Financial Reports",
      description: "P&L, cash flow, and financial summaries",
      gradient: "from-[#EF4444] to-[#F87171]",
      department: "Finance",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <Card className="p-8 bg-gradient-to-br from-purple-500/10 via-white to-blue-500/5 dark:from-purple-500/20 dark:via-card dark:to-blue-500/10 border-purple-500/20">
          <div className="flex items-start justify-between">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="mb-1">AI-Powered Reports & Analytics</h1>
                  <p className="text-muted-foreground mb-0">
                    Intelligent insights across all departments
                  </p>
                </div>
              </div>

              <p className="text-muted-foreground max-w-2xl leading-relaxed">
                Our AI engine is learning your business patterns to generate comprehensive, 
                automated reports across all departments. Get ready for intelligent insights 
                that help you make better decisions faster.
              </p>

              <div className="flex items-center gap-2">
                <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 gap-1.5 px-3 py-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Reports Coming Soon
                </Badge>
              </div>
            </div>

            {/* Decorative Element */}
            <div className="hidden lg:block">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/10 flex items-center justify-center"
              >
                <Sparkles className="w-16 h-16 text-purple-500 opacity-30" />
              </motion.div>
            </div>
          </div>
        </Card>
      </div>

      {/* Department Reports Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="mb-1">Department Reports</h2>
            <p className="text-muted-foreground mb-0">
              AI-generated insights tailored for each team
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {departmentReports.map((report, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="p-6 bg-white dark:bg-card border-[#E5E5E5] dark:border-border hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden">
                {/* Coming Soon Badge */}
                <div className="absolute top-3 right-3">
                  <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 text-xs">
                    Coming Soon
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${report.gradient} flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow`}
                    >
                      <report.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 pt-1">
                      <h3 className="mb-2">{report.title}</h3>
                      <p className="text-sm text-muted-foreground mb-0">
                        {report.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E5E5E5] dark:border-border">
                    <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-sm">AI-Powered Analytics</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Features Preview */}
      <Card className="p-8 bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10 border-blue-500/20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="mb-1">Automated Insights</h3>
            <p className="text-sm text-muted-foreground mb-0">
              AI automatically identifies trends, anomalies, and opportunities in your data
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="mb-1">Smart Visualizations</h3>
            <p className="text-sm text-muted-foreground mb-0">
              Interactive charts and graphs that adapt to your viewing preferences
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="mb-1">Predictive Analytics</h3>
            <p className="text-sm text-muted-foreground mb-0">
              Forecast future trends and get recommendations based on historical data
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
