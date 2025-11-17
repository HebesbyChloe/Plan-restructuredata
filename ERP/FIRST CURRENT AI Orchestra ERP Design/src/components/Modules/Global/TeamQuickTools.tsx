import { Card } from "../../ui/card";
import {
  Users,
  TrendingUp,
  ShoppingCart,
  Megaphone,
  Package,
  DollarSign,
  FileText,
  Target,
  Truck,
  UserCheck,
  BarChart3,
  Calendar,
} from "lucide-react";
import { motion } from "motion/react";

interface TeamQuickToolsProps {
  team: string;
}

const teamTools = {
  "Sale Team": [
    { icon: Users, label: "Leads Today", value: "24 new", color: "#4B6BFB" },
    { icon: TrendingUp, label: "Pipeline", value: "$124K", color: "#10B981" },
    { icon: ShoppingCart, label: "Quick Create Order", value: "Start", color: "#F59E0B" },
    { icon: Target, label: "Targets", value: "89% MTD", color: "#8B5CF6" },
  ],
  Marketing: [
    { icon: Megaphone, label: "Campaign Builder", value: "Create", color: "#4B6BFB" },
    { icon: FileText, label: "Asset Library", value: "1,248", color: "#EC4899" },
    { icon: BarChart3, label: "Ad Report", value: "View", color: "#10B981" },
    { icon: Calendar, label: "Campaign Calendar", value: "8 active", color: "#F59E0B" },
  ],
  Operations: [
    { icon: Package, label: "PO Summary", value: "42 pending", color: "#4B6BFB" },
    { icon: Truck, label: "Shipment Tracker", value: "18 in transit", color: "#10B981" },
    { icon: Users, label: "Vendor Portal", value: "Access", color: "#8B5CF6" },
    { icon: BarChart3, label: "Inventory Status", value: "View", color: "#F59E0B" },
  ],
  HR: [
    { icon: UserCheck, label: "Attendance Review", value: "Today", color: "#4B6BFB" },
    { icon: Users, label: "Hiring Tracker", value: "6 positions", color: "#10B981" },
    { icon: Target, label: "KPI Monitor", value: "Dashboard", color: "#F59E0B" },
    { icon: FileText, label: "Employee Portal", value: "Access", color: "#8B5CF6" },
  ],
  Accounting: [
    { icon: DollarSign, label: "Bill Approval", value: "12 pending", color: "#4B6BFB" },
    { icon: FileText, label: "Expense Entry", value: "Submit", color: "#10B981" },
    { icon: BarChart3, label: "Cash Flow Snapshot", value: "$2.4M", color: "#F59E0B" },
    { icon: TrendingUp, label: "Financial Dashboard", value: "View", color: "#8B5CF6" },
  ],
  "Operation Team": [
    { icon: Package, label: "PO Summary", value: "42 pending", color: "#4B6BFB" },
    { icon: Truck, label: "Shipment Tracker", value: "18 in transit", color: "#10B981" },
    { icon: Users, label: "Vendor Portal", value: "Access", color: "#8B5CF6" },
    { icon: BarChart3, label: "Inventory Status", value: "View", color: "#F59E0B" },
  ],
  "Administration Team": [
    { icon: Target, label: "System Overview", value: "Dashboard", color: "#4B6BFB" },
    { icon: Users, label: "User Management", value: "248 users", color: "#10B981" },
    { icon: FileText, label: "Documentation", value: "Access", color: "#F59E0B" },
    { icon: BarChart3, label: "Analytics", value: "View", color: "#8B5CF6" },
  ],
  "Master Admin": [
    { icon: Target, label: "System Health", value: "98.9%", color: "#10B981" },
    { icon: Users, label: "All Users", value: "248 active", color: "#4B6BFB" },
    { icon: BarChart3, label: "Global Analytics", value: "View", color: "#F59E0B" },
  ],
  Product: [
    { icon: Package, label: "Product Board", value: "124 SKUs", color: "#4B6BFB" },
    { icon: FileText, label: "Pricing Matrix", value: "Manage", color: "#10B981" },
    { icon: Target, label: "Collections", value: "8 active", color: "#F59E0B" },
    { icon: BarChart3, label: "Performance", value: "View", color: "#8B5CF6" },
  ],
  Engineering: [
    { icon: Target, label: "Sprint Board", value: "24 tasks", color: "#4B6BFB" },
    { icon: FileText, label: "Documentation", value: "Wiki", color: "#10B981" },
    { icon: BarChart3, label: "System Health", value: "98.9%", color: "#10B981" },
    { icon: Users, label: "Team Capacity", value: "View", color: "#F59E0B" },
  ],
};

export function TeamQuickTools({ team }: TeamQuickToolsProps) {
  const tools = teamTools[team as keyof typeof teamTools] || teamTools["Sale Team"];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="opacity-60">Quick Tools — {team}</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {tools.map((tool, index) => {
          const Icon = tool.icon;
          return (
            <motion.div
              key={tool.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer border-glass-border bg-glass-bg/30 backdrop-blur-sm group">
                <div className="flex items-start gap-3">
                  <div
                    className="p-2 rounded-lg group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: `${tool.color}15` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: tool.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="opacity-60 mb-1">{tool.label}</div>
                    <div className="truncate" style={{ color: tool.color }}>
                      {tool.value}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
