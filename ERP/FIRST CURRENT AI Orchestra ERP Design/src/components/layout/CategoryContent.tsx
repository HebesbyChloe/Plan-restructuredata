import { motion } from "motion/react";
import { Card } from "../ui/card";
import { BarChart3, TrendingUp, Users, Package, DollarSign } from "lucide-react";

interface CategoryContentProps {
  category: string;
}

export function CategoryContent({ category }: CategoryContentProps) {
  const getContent = () => {
    switch (category) {
      case "Marketing":
        return {
          title: "Marketing Dashboard",
          stats: [
            { label: "Active Campaigns", value: "12", change: "+3", icon: TrendingUp },
            { label: "Total Reach", value: "1.2M", change: "+15%", icon: Users },
            { label: "Conversion Rate", value: "3.8%", change: "+0.4%", icon: BarChart3 },
            { label: "Ad Spend", value: "$24.5K", change: "-5%", icon: DollarSign },
          ],
        };
      case "CRM":
        return {
          title: "Customer Relationship Dashboard",
          stats: [
            { label: "Total Customers", value: "8,429", change: "+124", icon: Users },
            { label: "Active Segments", value: "18", change: "+2", icon: BarChart3 },
            { label: "Avg Lifetime Value", value: "$2,840", change: "+12%", icon: DollarSign },
            { label: "Customer Satisfaction", value: "4.6/5", change: "+0.2", icon: TrendingUp },
          ],
        };
      case "Orders":
        return {
          title: "Orders Management",
          stats: [
            { label: "Pending Orders", value: "234", change: "+45", icon: Package },
            { label: "Processing", value: "89", change: "-12", icon: TrendingUp },
            { label: "Order Value", value: "$124K", change: "+8%", icon: DollarSign },
            { label: "Returns", value: "12", change: "-3", icon: BarChart3 },
          ],
        };
      case "Products":
        return {
          title: "Product Management",
          stats: [
            { label: "Total SKUs", value: "1,248", change: "+24", icon: Package },
            { label: "In Stock", value: "1,089", change: "+18", icon: TrendingUp },
            { label: "Low Stock", value: "42", change: "+8", icon: BarChart3 },
            { label: "Avg Price", value: "$84.50", change: "+2%", icon: DollarSign },
          ],
        };
      case "Logistics":
        return {
          title: "Logistics Dashboard",
          stats: [
            { label: "Active Shipments", value: "156", change: "+23", icon: Package },
            { label: "Purchase Orders", value: "89", change: "+12", icon: TrendingUp },
            { label: "Vendors", value: "45", change: "+3", icon: Users },
            { label: "Logistics Cost", value: "$34.2K", change: "-8%", icon: DollarSign },
          ],
        };
      case "Reports":
        return {
          title: "Reports & Analytics",
          stats: [
            { label: "Total Reports", value: "124", change: "+18", icon: BarChart3 },
            { label: "Scheduled Reports", value: "34", change: "+5", icon: TrendingUp },
            { label: "Data Points", value: "2.4M", change: "+124K", icon: Package },
            { label: "Automations", value: "12", change: "+2", icon: Users },
          ],
        };
      case "Admin":
        return {
          title: "System Administration",
          stats: [
            { label: "Active Users", value: "248", change: "+8", icon: Users },
            { label: "User Roles", value: "12", change: "0", icon: TrendingUp },
            { label: "Integrations", value: "18", change: "+3", icon: Package },
            { label: "System Health", value: "98.9%", change: "+0.5%", icon: BarChart3 },
          ],
        };
      case "Task":
        return {
          title: "Task Management",
          stats: [
            { label: "Active Tasks", value: "87", change: "+12", icon: Package },
            { label: "Completed Today", value: "23", change: "+5", icon: TrendingUp },
            { label: "Overdue", value: "4", change: "-2", icon: BarChart3 },
            { label: "Team Completion", value: "78%", change: "+6%", icon: Users },
          ],
        };
      default:
        return null;
    }
  };

  const content = getContent();
  if (!content) return null;

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="mb-2">{content.title}</h1>
        <p className="opacity-60">Overview and key metrics</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {content.stats.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.change.startsWith("+");
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-6 border-glass-border bg-glass-bg/30 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 rounded-lg bg-[#4B6BFB]/10">
                    <Icon className="w-5 h-5 text-[#4B6BFB]" />
                  </div>
                  <span
                    className={`${
                      isPositive ? "text-green-500" : "text-orange-500"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
                <div className="mb-1">{stat.value}</div>
                <div className="opacity-60">{stat.label}</div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Placeholder Content Area */}
      <Card className="p-8 border-glass-border bg-glass-bg/30 backdrop-blur-sm">
        <div className="text-center opacity-60">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p>Detailed {category} content and visualizations would appear here</p>
          <p className="mt-2">Charts, tables, and interactive tools for this module</p>
        </div>
      </Card>
    </div>
  );
}
