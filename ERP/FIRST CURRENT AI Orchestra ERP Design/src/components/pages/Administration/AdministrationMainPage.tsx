import { Card } from "../../ui/card";
import { Settings, Users, Database, Bell, ChevronLeft, ChevronRight, Shield, Globe, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { useState, useEffect } from "react";
import { useUsers, useBrands, useStores, useWarehouses } from "../../../hooks/useSystem";
import { useAgents, useAgentSeedDataMap, sendAgentMessage } from "../../../hooks/useAgents";
import { useTenantContext } from "../../../contexts/TenantContext";
import { AIchatboxdepartmentmain } from "../../AI";
import { getAIFlows } from "../../../lib/supabase/ai-flows";
import { supabase } from "../../../lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getRoutePath } from "../../../utils/routing";

interface AdministrationMainPageProps {
  onNavigate?: (page: string) => void;
}

export function AdministrationMainPage({ onNavigate }: AdministrationMainPageProps) {
  const { currentTenantId } = useTenantContext();
  const router = useRouter();
  const [currentGuidanceIndex, setCurrentGuidanceIndex] = useState(0);
  
  // AI Guidance messages
  const guidanceMessages = [
    "Centralized control center for system administration. Manage users, configure settings, monitor security, and maintain system health.",
    "Streamline user access and permissions. Assign roles, manage teams, and ensure secure access across your organization.",
    "Configure company-wide settings, manage brands, stores, and warehouses. Set business hours, preferences, and operational parameters.",
    "Monitor AI agents and flows. Track performance, manage integrations, and automate workflows across departments.",
    "Maintain system integrity with audit logs, security policies, and compliance tracking. Keep your data safe and operations transparent.",
  ];

  // Auto-rotate guidance messages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGuidanceIndex((prev) => (prev + 1) % guidanceMessages.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [guidanceMessages.length]);

  const goToNextGuidance = () => {
    setCurrentGuidanceIndex((prev) => (prev + 1) % guidanceMessages.length);
  };

  const goToPrevGuidance = () => {
    setCurrentGuidanceIndex((prev) => (prev - 1 + guidanceMessages.length) % guidanceMessages.length);
  };

  // Combined stats - all in one compact row
  const [allStats, setAllStats] = useState([
    { label: "Users", value: "0" },
    { label: "AI Agents", value: "0" },
    { label: "AI Flows", value: "0" },
    { label: "Brands", value: "0" },
    { label: "Stores", value: "0" },
    { label: "Warehouses", value: "0" },
    { label: "Channels", value: "0" },
  ]);

  // Fetch real data
  const { users } = useUsers(currentTenantId);
  const { brands } = useBrands(currentTenantId);
  const { stores } = useStores(currentTenantId);
  const { warehouses } = useWarehouses(currentTenantId);
  const { agents, loading: agentsLoading } = useAgents(undefined, currentTenantId);
  
  // Fetch AI flows count
  useEffect(() => {
    const loadAIFlowsCount = async () => {
      if (!currentTenantId) return;
      try {
        const { data, error } = await getAIFlows(currentTenantId);
        if (!error && data) {
          setAllStats(prev => prev.map(stat => 
            stat.label === "AI Flows" ? { ...stat, value: data.length.toString() } : stat
          ));
        }
      } catch (err) {
        console.error("Error loading AI flows:", err);
      }
    };
    loadAIFlowsCount();
  }, [currentTenantId]);

  // Fetch channels count
  useEffect(() => {
    const loadChannelsCount = async () => {
      if (!currentTenantId) return;
      try {
        const { count, error } = await supabase
          .from('channels_platforms')
          .select('*', { count: 'exact', head: true })
          .eq('tenant_id', currentTenantId)
          .is('deleted_at', null);
        
        if (!error && count !== null) {
          setAllStats(prev => prev.map(stat => 
            stat.label === "Channels" ? { ...stat, value: count.toString() } : stat
          ));
        }
      } catch (err) {
        console.error("Error loading channels:", err);
      }
    };
    loadChannelsCount();
  }, [currentTenantId]);

  // Update stats when data loads
  useEffect(() => {
    setAllStats(prev => prev.map(stat => {
      if (stat.label === "Users") {
        return { ...stat, value: users.filter(u => u.is_active).length.toString() };
      }
      if (stat.label === "AI Agents") {
        return { ...stat, value: agents.filter(a => a.is_active).length.toString() };
      }
      if (stat.label === "Brands") {
        return { ...stat, value: brands.length.toString() };
      }
      if (stat.label === "Stores") {
        return { ...stat, value: stores.length.toString() };
      }
      if (stat.label === "Warehouses") {
        return { ...stat, value: warehouses.length.toString() };
      }
      return stat;
    }));
  }, [users, agents, brands, stores, warehouses]);

  // AI Chat setup
  const agentIds = agents.map(a => a.id);
  const { seedDataMap } = useAgentSeedDataMap(agentIds);

  const handleSendMessage = async (message: string, agentId: string): Promise<string> => {
    return await sendAgentMessage(message, agentId);
  };

  const quickActions = [
    {
      icon: Users,
      title: "User Management",
      description: "Manage users and permissions",
      color: "#4B6BFB",
      gradient: "from-[#4B6BFB] to-[#6B8AFF]",
      page: "User Management",
      available: true,
    },
    {
      icon: Shield,
      title: "Security & Compliance",
      description: "Access controls and audit logs",
      color: "#EF4444",
      gradient: "from-[#EF4444] to-[#F87171]",
      page: "Role & Permission",
      available: true,
    },
    {
      icon: Globe,
      title: "System Settings",
      description: "Configure global preferences",
      color: "#10B981",
      gradient: "from-[#10B981] to-[#34D399]",
      page: "Company Settings",
      available: true,
    },
    {
      icon: Database,
      title: "Data Management",
      description: "Backup and data operations",
      color: "#8B5CF6",
      gradient: "from-[#8B5CF6] to-[#A78BFA]",
      page: null,
      available: false,
    },
    {
      icon: Zap,
      title: "Integrations",
      description: "Third-party connections",
      color: "#F59E0B",
      gradient: "from-[#F59E0B] to-[#FBBF24]",
      page: "Automation / Integration",
      available: true,
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "System alerts and updates",
      color: "#EC4899",
      gradient: "from-[#EC4899] to-[#F472B6]",
      page: null,
      available: false,
    },
  ];

  const handleQuickActionClick = (action: typeof quickActions[0]) => {
    if (action.available && action.page) {
      // Use router for URL navigation
      const path = getRoutePath("Administration", action.page);
      router.push(path);
      
      // Also call onNavigate if provided (for state updates)
      if (onNavigate) {
        onNavigate(action.page);
      }
    } else {
      toast.info("Coming soon!");
    }
  };


  return (
    <div className="space-y-8">
      {/* Hero Section - Compact */}
      <div className="relative overflow-hidden">
        <Card className="p-4 bg-gradient-to-br from-slate-500/10 via-white to-blue-500/5 dark:from-slate-500/20 dark:via-card dark:to-blue-500/10 border-slate-500/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-500 flex items-center justify-center shadow-md flex-shrink-0">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="mb-1 text-xl">Administration</h1>
              <div className="relative h-12 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentGuidanceIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm text-muted-foreground leading-relaxed absolute inset-0"
                  >
                    {guidanceMessages[currentGuidanceIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={goToPrevGuidance}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="flex gap-1">
                {guidanceMessages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentGuidanceIndex(index)}
                    className={`h-1.5 rounded-full transition-all ${
                      index === currentGuidanceIndex
                        ? "w-6 bg-slate-700 dark:bg-slate-300"
                        : "w-1.5 bg-slate-300 dark:bg-slate-600"
                    }`}
                  />
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={goToNextGuidance}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Compact Stats Row - Single Line */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {allStats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5] dark:border-border hover:shadow-md transition-shadow">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl font-semibold mb-0">{stat.value}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* AI Agent Chat */}
      {!agentsLoading && agents.length > 0 && (
        <div>
          <h2 className="mb-4">AI Admin Assistant</h2>
          <Card className="p-0 bg-white dark:bg-card border-[#E5E5E5] dark:border-border overflow-hidden">
            <AIchatboxdepartmentmain
              agents={agents}
              defaultAgent={agents.find(a => a.id === "captain")?.id || agents[0]?.id || ""}
              agentPrompts={seedDataMap}
              onSendMessage={handleSendMessage}
            />
          </Card>
        </div>
      )}

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
              <Card 
                className={`p-6 bg-white dark:bg-card border-[#E5E5E5] dark:border-border hover:shadow-xl transition-all cursor-pointer group ${
                  !action.available ? 'opacity-75' : ''
                }`}
                onClick={() => handleQuickActionClick(action)}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow`}
                  >
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="mb-1">{action.title}</h3>
                      {!action.available && (
                        <Badge variant="outline" className="text-xs">
                          Coming Soon
                        </Badge>
                      )}
                    </div>
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
    </div>
  );
}
