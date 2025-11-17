import { motion } from "motion/react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { TeamQuickTools } from "./Modules/Global";
import { 
  Sparkles, 
  TrendingUp,
  Target,
  Zap,
  ChevronRight,
  Rocket,
  Brain,
  ArrowRight,
} from "lucide-react";

interface HomePageProps {
  selectedTeam: string;
}

export function HomePage({ selectedTeam }: HomePageProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // AI-powered motivational insights based on team
  const getAIMotivation = () => {
    const motivationMap: Record<string, { title: string; message: string; stat: string }> = {
      "Sale Team": {
        title: "You're on fire! 🔥",
        message: "Your team is crushing it — 85% to quarterly quota with momentum building every day.",
        stat: "+12% this week"
      },
      "Marketing": {
        title: "Campaigns shining bright! ✨",
        message: "Spring campaign engagement is 28% above predictions. Your creativity is paying off.",
        stat: "+28% engagement"
      },
      "Operation Team": {
        title: "Efficiency at its peak! 🚀",
        message: "Processing speed up 18% this month. Your operational excellence is remarkable.",
        stat: "+18% efficiency"
      },
      "HR": {
        title: "Building the dream team! 💪",
        message: "Smooth onboarding and team growth. Your people-first approach is transforming culture.",
        stat: "99% satisfaction"
      },
      "Accounting": {
        title: "Financial mastery! 💎",
        message: "Healthy 3-month runway and strong cash flow. Your precision drives stability.",
        stat: "75% close complete"
      },
      "Administration Team": {
        title: "Systems running smoothly! ⚡",
        message: "99.9% uptime and all services operational. Your vigilance keeps us secure.",
        stat: "99.9% uptime"
      },
    };

    return motivationMap[selectedTeam] || motivationMap["Marketing"];
  };

  // AI Focus - single most important thing
  const getAIFocus = () => {
    const focusMap: Record<string, { action: string; context: string; urgency: "high" | "medium" | "low" }> = {
      "Sale Team": {
        action: "Close 4 warm leads",
        context: "Pipeline value increased 12% — capitalize on the momentum",
        urgency: "high"
      },
      "Marketing": {
        action: "Upload 5 product images",
        context: "Asset library needs refreshing for Q2 campaign launch",
        urgency: "medium"
      },
      "Operation Team": {
        action: "Ship 15 priority orders",
        context: "Same-day shipping SLA requires immediate attention",
        urgency: "high"
      },
      "HR": {
        action: "Approve monthly payroll",
        context: "Due in 3 days — team is counting on you",
        urgency: "high"
      },
      "Accounting": {
        action: "Review 15 vendor invoices",
        context: "$24,500 pending approval for smooth vendor relations",
        urgency: "high"
      },
      "Administration Team": {
        action: "Review 3 access requests",
        context: "New team members waiting for system access",
        urgency: "medium"
      },
    };

    return focusMap[selectedTeam] || focusMap["Marketing"];
  };

  // Quick Actions - top 3 only
  const getQuickActions = () => {
    const actionsMap: Record<string, Array<{ label: string; icon: any; color: string }>> = {
      "Sale Team": [
        { label: "View Pipeline", icon: Target, color: "#4B6BFB" },
        { label: "Contact Leads", icon: Zap, color: "#10B981" },
        { label: "Track Performance", icon: TrendingUp, color: "#F59E0B" },
      ],
      "Marketing": [
        { label: "Launch Campaign", icon: Rocket, color: "#4B6BFB" },
        { label: "View Analytics", icon: TrendingUp, color: "#10B981" },
        { label: "Upload Assets", icon: Target, color: "#F59E0B" },
      ],
      "Operation Team": [
        { label: "Process Orders", icon: Target, color: "#4B6BFB" },
        { label: "Check Inventory", icon: TrendingUp, color: "#10B981" },
        { label: "Track Shipments", icon: Rocket, color: "#F59E0B" },
      ],
      "HR": [
        { label: "Approve Payroll", icon: Target, color: "#4B6BFB" },
        { label: "Review Performance", icon: TrendingUp, color: "#10B981" },
        { label: "Onboard Team", icon: Rocket, color: "#F59E0B" },
      ],
      "Accounting": [
        { label: "Review Invoices", icon: Target, color: "#4B6BFB" },
        { label: "Financial Dashboard", icon: TrendingUp, color: "#10B981" },
        { label: "Cash Flow", icon: Rocket, color: "#F59E0B" },
      ],
      "Administration Team": [
        { label: "User Management", icon: Target, color: "#4B6BFB" },
        { label: "System Health", icon: TrendingUp, color: "#10B981" },
      ],
    };

    return actionsMap[selectedTeam] || actionsMap["Marketing"];
  };

  const motivation = getAIMotivation();
  const focus = getAIFocus();
  const quickActions = getQuickActions();

  return (
    <div className="w-full min-h-[calc(100vh-200px)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl space-y-8">
        {/* Hero Greeting */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-block"
          >
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-[#4B6BFB] via-purple-500 to-cyan-400 flex items-center justify-center shadow-2xl shadow-[#4B6BFB]/30">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-[#4B6BFB] via-purple-500 to-cyan-400 bg-clip-text text-transparent"
          >
            {getGreeting()}, Anna
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground text-lg"
          >
            Let's make today extraordinary
          </motion.p>
        </motion.div>

        {/* AI Motivation Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Card className="border-[#4B6BFB]/20 bg-gradient-to-br from-[#4B6BFB]/5 via-background to-purple-500/5 backdrop-blur-xl overflow-hidden relative">
            {/* Animated background effect */}
            <motion.div
              className="absolute inset-0 opacity-10"
              animate={{
                background: [
                  "radial-gradient(circle at 0% 0%, #4B6BFB 0%, transparent 50%)",
                  "radial-gradient(circle at 100% 100%, #4B6BFB 0%, transparent 50%)",
                  "radial-gradient(circle at 0% 0%, #4B6BFB 0%, transparent 50%)",
                ],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            
            <div className="p-8 sm:p-10 relative z-10">
              <div className="flex items-start gap-4 mb-6">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="p-3 rounded-2xl bg-gradient-to-br from-[#4B6BFB] to-purple-500 shadow-lg shadow-[#4B6BFB]/30"
                >
                  <Brain className="w-7 h-7 text-white" />
                </motion.div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="bg-gradient-to-r from-[#4B6BFB] to-purple-500 bg-clip-text text-transparent">
                      {motivation.title}
                    </h2>
                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                      {motivation.stat}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-lg">
                    {motivation.message}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* AI Focus - Most Important Thing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Card className="border-glass-border bg-glass-bg backdrop-blur-xl">
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-[#4B6BFB]" />
                <h3>AI Focus for Today</h3>
                {focus.urgency === "high" && (
                  <Badge className="bg-red-500/10 text-red-600 border-red-500/20 ml-auto">
                    High Priority
                  </Badge>
                )}
                {focus.urgency === "medium" && (
                  <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20 ml-auto">
                    Medium Priority
                  </Badge>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h2 className="mb-2">{focus.action}</h2>
                  <p className="text-muted-foreground">
                    {focus.context}
                  </p>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-[#4B6BFB] to-purple-500 hover:opacity-90 transition-opacity group"
                  size="lg"
                >
                  <span>Let's Do This</span>
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </motion.div>
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <div className="text-center mb-6">
            <h3 className="text-muted-foreground">Quick Actions</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -8 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className="p-6 cursor-pointer border-glass-border hover:border-[#4B6BFB]/40 transition-all duration-300 hover:shadow-xl hover:shadow-[#4B6BFB]/10 bg-gradient-to-br from-background to-accent/5 group">
                    <div className="text-center space-y-3">
                      <div 
                        className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                        style={{
                          backgroundColor: `${action.color}15`,
                          border: `2px solid ${action.color}30`,
                        }}
                      >
                        <Icon className="w-7 h-7 transition-transform duration-300 group-hover:scale-110" style={{ color: action.color }} />
                      </div>
                      <h4 className="group-hover:text-[#4B6BFB] transition-colors">
                        {action.label}
                      </h4>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Bottom Motivational Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-center pt-8"
        >
          <motion.p 
            className="text-muted-foreground italic text-sm"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            "Every great achievement starts with a single focused step"
          </motion.p>
        </motion.div>

        {/* Team Quick Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.5 }}
        >
          <TeamQuickTools team={selectedTeam} />
        </motion.div>
      </div>
    </div>
  );
}
