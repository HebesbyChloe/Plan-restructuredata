import { Card } from "../../ui/card";
import { Settings, Shield, Globe, Zap, Users, Database, Lock, Bell, Sparkles, CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";

export function AdministrationMainPage() {
  const stats = [
    { label: "Active Users", value: "127", change: "+5", trend: "up" },
    { label: "System Uptime", value: "99.9%", change: "Stable", trend: "up" },
    { label: "API Calls (Today)", value: "45.2K", change: "+12%", trend: "up" },
    { label: "Storage Used", value: "67%", change: "+3%", trend: "up" },
  ];

  const quickActions = [
    {
      icon: Users,
      title: "User Management",
      description: "Manage users and permissions",
      color: "#4B6BFB",
      gradient: "from-[#4B6BFB] to-[#6B8AFF]",
    },
    {
      icon: Shield,
      title: "Security & Compliance",
      description: "Access controls and audit logs",
      color: "#EF4444",
      gradient: "from-[#EF4444] to-[#F87171]",
    },
    {
      icon: Globe,
      title: "System Settings",
      description: "Configure global preferences",
      color: "#10B981",
      gradient: "from-[#10B981] to-[#34D399]",
    },
    {
      icon: Database,
      title: "Data Management",
      description: "Backup and data operations",
      color: "#8B5CF6",
      gradient: "from-[#8B5CF6] to-[#A78BFA]",
    },
    {
      icon: Zap,
      title: "Integrations",
      description: "Third-party connections",
      color: "#F59E0B",
      gradient: "from-[#F59E0B] to-[#FBBF24]",
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "System alerts and updates",
      color: "#EC4899",
      gradient: "from-[#EC4899] to-[#F472B6]",
    },
  ];

  const systemHealth = [
    { service: "API Gateway", status: "Operational", uptime: "99.99%" },
    { service: "Database Cluster", status: "Operational", uptime: "99.97%" },
    { service: "Authentication", status: "Operational", uptime: "100%" },
    { service: "Storage Service", status: "Operational", uptime: "99.95%" },
  ];

  const recentActivity = [
    { action: "User role updated", user: "Admin Team", time: "2 hours ago" },
    { action: "System backup completed", user: "System", time: "5 hours ago" },
    { action: "Security policy updated", user: "IT Team", time: "1 day ago" },
    { action: "New integration added", user: "Admin Team", time: "2 days ago" },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <Card className="p-8 bg-gradient-to-br from-slate-500/10 via-white to-blue-500/5 dark:from-slate-500/20 dark:via-card dark:to-blue-500/10 border-slate-500/20">
          <div className="flex items-start justify-between">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-500 flex items-center justify-center shadow-lg">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="mb-1">Administration</h1>
                  <p className="text-muted-foreground mb-0">
                    System management and configuration
                  </p>
                </div>
              </div>

              <p className="text-muted-foreground max-w-2xl leading-relaxed">
                Centralized control center for system administration. 
                Manage users, configure settings, monitor security, and maintain system health.
              </p>

              <div className="flex flex-wrap gap-3">
                <Button className="gap-2 bg-gradient-to-r from-slate-700 to-slate-500 hover:from-slate-800 to-slate-600 text-white">
                  <Sparkles className="w-4 h-4" />
                  AI Admin Assistant
                </Button>
                <Button variant="outline" className="gap-2 border-slate-500 text-slate-700 hover:bg-slate-500/10">
                  <Shield className="w-4 h-4" />
                  Security Dashboard
                </Button>
              </div>
            </div>

            {/* Decorative Element */}
            <div className="hidden lg:block">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-32 h-32 rounded-full bg-gradient-to-br from-slate-500/20 to-blue-500/10 flex items-center justify-center"
              >
                <Settings className="w-16 h-16 text-slate-500 opacity-30" />
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

      {/* System Health & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 bg-white dark:bg-card border-[#E5E5E5] dark:border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="mb-0">System Health</h3>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
              <CheckCircle className="w-3 h-3 mr-1" />
              All Systems Operational
            </Badge>
          </div>
          <div className="space-y-4">
            {systemHealth.map((system, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-[#F8F8F8] dark:bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <div>
                    <p className="text-sm mb-0">{system.service}</p>
                    <p className="text-xs text-muted-foreground mb-0">{system.status}</p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">{system.uptime}</span>
              </div>
            ))}
          </div>
        </Card>

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
                    <p className="text-sm text-muted-foreground mb-0">{activity.user}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
