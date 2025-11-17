import { motion } from "motion/react";
import {
  Megaphone,
  Target,
  Image,
  Palette,
  Calendar,
  BarChart3,
  Users as UsersIcon,
  Link2,
  FileText,
  Radio,
  Users,
  Brain,
  MessageSquare,
  Workflow,
  ShoppingCart,
  Package,
  Headphones,
  RotateCcw,
  Box,
  Layers,
  DollarSign,
  Tag,
  Boxes,
  TrendingUp,
  Truck,
  Building,
  Award,
  BookOpen,
  Receipt,
  Settings,
  Shield,
  Globe,
  Zap,
  FolderOpen,
  History,
  Cpu,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Trophy,
} from "lucide-react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface ContextualSidebarProps {
  category: string;
  onSidebarItemClick?: (item: string) => void;
  selectedSidebarItem?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const sidebarMenus = {
  Marketing: [
    { icon: Megaphone, label: "Campaign" },
    { icon: Calendar, label: "Campaign Calendar" },
    { icon: Target, label: "Promotion" },
    { icon: Workflow, label: "AI Flow" },
    { icon: Image, label: "Asset Library" },
    { icon: Palette, label: "Brand Hub" },
    { icon: Brain, label: "Inspiration" },
    { icon: BarChart3, label: "Reports" },
    { icon: BookOpen, label: "Resources" },
  ],
  CRM: [
    { icon: Users, label: "Customer" },
    { icon: Target, label: "Re-Engage" },
    { icon: BarChart3, label: "Performance" },
    { icon: Brain, label: "Customer Insights" },
    { icon: Workflow, label: "AI Flow" },
  ],
  Orders: [
    { icon: BarChart3, label: "Overview" },
    { icon: ShoppingCart, label: "Orders" },
    { icon: Calendar, label: "Pre-Orders" },
    { icon: Palette, label: "Customize Orders" },
    { icon: RotateCcw, label: "Service Orders" },
    { icon: Headphones, label: "Customer Service" },
    { icon: Brain, label: "Order Insights" },
    { icon: Workflow, label: "AI Flow" },
  ],
  Products: [
    { icon: BarChart3, label: "Overview" },
    { icon: Package, label: "Product" },
    { icon: Layers, label: "Material" },
    { icon: Award, label: "Diamond & Gemstone" },
    { icon: Tag, label: "Attributes & Variants" },
    { icon: Boxes, label: "Custom & Bundle" },
    { icon: DollarSign, label: "Pricing Matrix" },
    { icon: FolderOpen, label: "Collections Manager" },
    { icon: Brain, label: "Product Insights" },
  ],
  Fulfilment: [
    { icon: BarChart3, label: "Overview" },
    { icon: Truck, label: "Shipping" },
    { icon: RotateCcw, label: "Return" },
    { icon: Zap, label: "Automation Control" },
    { icon: Workflow, label: "AI Flow" },
    { icon: Brain, label: "Fulfilment Insights" },
  ],
  Logistics: [
    { icon: BarChart3, label: "Overview" },
    { icon: Receipt, label: "Purchase Orders" },
    { icon: TrendingUp, label: "Inbound Shipments" },
    { icon: Truck, label: "Outbound Shipments" },
    { icon: ShoppingCart, label: "Procurement" },
    { icon: Building, label: "Vendors & Suppliers" },
    { icon: Brain, label: "Logistic Insights" },
  ],
  Reports: [],
  Workspace: [
    { icon: Brain, label: "My Work Space" },
    { icon: CheckSquare, label: "My Tasks" },
    { icon: FolderOpen, label: "Projects & Campaigns" },
    { icon: Calendar, label: "Task Calendar" },
    { icon: BarChart3, label: "Task Analytics" },
    { icon: Workflow, label: "AI Flow" },
    { icon: Calendar, label: "Shift Schedule" },
  ],
  Administration: [
    { icon: Users, label: "User Management" },
    { icon: Shield, label: "Role & Permission" },
    { icon: Building, label: "Tenant Management" },
    { icon: Settings, label: "Company Settings" },
    { icon: Brain, label: "AI Agents" },
    { icon: Zap, label: "Automation / Integration" },
    { icon: History, label: "Audit Logs" },
  ],
};

export function ContextualSidebar({ 
  category, 
  onSidebarItemClick, 
  selectedSidebarItem,
  isCollapsed = false,
  onToggleCollapse,
}: ContextualSidebarProps) {
  const menuItems = sidebarMenus[category as keyof typeof sidebarMenus] || [];

  if (menuItems.length === 0) return null;

  return (
    <TooltipProvider>
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ 
          x: 0, 
          opacity: 1,
          width: isCollapsed ? "4rem" : "16rem",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden md:block relative border-r border-glass-border bg-glass-bg/30 backdrop-blur-sm p-4"
      >
        {/* Toggle Button */}
        <button
          onClick={onToggleCollapse}
          className={`absolute z-10 flex items-center justify-center transition-colors ${
            isCollapsed
              ? "bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-lg bg-violet-50 dark:bg-violet-950/50 border border-violet-200 dark:border-violet-800 shadow-lg hover:bg-violet-100 dark:hover:bg-violet-900/50"
              : "-right-3 bottom-6 w-8 h-8 rounded-full bg-glass-bg border border-glass-border shadow-lg hover:bg-accent"
          }`}
          title={isCollapsed ? "Expand Menu" : "Collapse Menu"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>

        <div className="space-y-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isSelected = selectedSidebarItem === item.label;
            
            const button = (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => onSidebarItemClick?.(item.label)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group text-left ${
                  isSelected ? "bg-accent" : "hover:bg-accent/50"
                } ${isCollapsed ? "justify-center" : ""}`}
              >
                <Icon className={`w-4 h-4 transition-colors flex-shrink-0 ${
                  isSelected ? "opacity-100 text-[#4B6BFB]" : "opacity-60 group-hover:opacity-100 group-hover:text-[#4B6BFB]"
                }`} />
                {!isCollapsed && (
                  <span className={isSelected ? "opacity-100" : "opacity-80 group-hover:opacity-100"}>
                    {item.label}
                  </span>
                )}
              </motion.button>
            );

            if (isCollapsed) {
              return (
                <Tooltip key={item.label}>
                  <TooltipTrigger asChild>
                    {button}
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              );
            }

            return button;
          })}
        </div>
      </motion.div>
    </TooltipProvider>
  );
}
