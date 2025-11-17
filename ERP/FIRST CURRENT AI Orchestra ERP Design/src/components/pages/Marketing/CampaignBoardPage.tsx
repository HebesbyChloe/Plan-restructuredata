"use client";

import { Card } from "../../ui/card";
import { Plus, Search, Filter, TrendingUp, Users, DollarSign, Target, MoreVertical, Sparkles, Rocket, Play, Calendar as CalendarIcon, CheckCircle, ExternalLink, FileText, Image, CheckSquare, Edit, Zap } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Badge } from "../../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { useState, useEffect } from "react";
import { AINotificationCard } from "../../Modules/Global/AINotificationCard";
import { ClickableStatsCards, StatCardData } from "../../Modules/CRM/Stats/ClickableStatsCards";
import { toast } from "sonner";
import { Progress } from "../../ui/progress";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../../ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../../ui/sheet";
import { Separator } from "../../ui/separator";
import { ProjectCampaignDetailModule } from "../../Modules/Marketing/ProjectCampaignDetail";
import { CardProjectCampaign, ProjectCampaignData } from "../../Modules/Marketing/CardProjectCampaign";
import { Campaign } from "../../../types/modules/marketing";
import { getCampaigns } from "../../../lib/supabase/marketing/campaigns";
import { getCampaignTasks, getCampaignActivities, getCampaignFiles, getTeamMembers, type CampaignTask } from "../../../lib/supabase/marketing/campaign-data";
import { useTenantContext } from "../../../contexts/TenantContext";
import { format } from "date-fns";

const campaignTypeColors = {
  email: "#4B6BFB",
  social: "#EC4899",
  "paid-ads": "#F59E0B",
  content: "#10B981",
  event: "#8B5CF6",
  launch: "#EF4444",
};

const priorityColors = {
  high: "#EF4444",
  medium: "#F59E0B",
  low: "#10B981",
};

export function CampaignBoardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const [isNewCampaign, setIsNewCampaign] = useState(false);
  const [selectedStatCard, setSelectedStatCard] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [campaignTasks, setCampaignTasks] = useState<CampaignTask[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);

  // Get tenant from context
  const { currentTenantId } = useTenantContext();

  // Load campaigns from Supabase
  useEffect(() => {
    if (!currentTenantId) return;
    
    const loadCampaigns = async () => {
      setLoading(true);
      setError(null);
      try {
        const tenantId = currentTenantId;
        const { data, error: fetchError } = await getCampaigns(tenantId, {
          search: searchQuery || undefined,
          type: filterType as any || undefined,
        });

        if (fetchError) {
          setError(fetchError.message);
          toast.error(`Failed to load campaigns: ${fetchError.message}`);
        } else {
          setCampaigns(data || []);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        toast.error(`Failed to load campaigns: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    loadCampaigns();
  }, [searchQuery, filterType, currentTenantId]);

  // Helper function to format campaign for display
  const formatCampaignForDisplay = (campaign: Campaign) => {
    return {
      id: String(campaign.id),
      title: campaign.name,
      status: campaign.status,
      type: campaign.type,
      budget: `$${campaign.budget.toLocaleString()}`,
      spent: campaign.spent ? `$${campaign.spent.toLocaleString()}` : undefined,
      reach: campaign.reach ? `${(campaign.reach / 1000).toFixed(0)}K` : "0",
      reachGoal: campaign.reachGoal ? `${(campaign.reachGoal / 1000).toFixed(0)}K` : "0",
      engagement: campaign.engagement ? `${campaign.engagement.toFixed(1)}%` : undefined,
      engagementGoal: campaign.engagementGoal ? `${campaign.engagementGoal.toFixed(1)}%` : undefined,
      startDate: format(campaign.startDate, "MMM d"),
      endDate: campaign.endDate ? format(campaign.endDate, "MMM d") : "",
      owner: campaign.owner,
      priority: campaign.priority,
      progress: campaign.progress,
      aiScore: campaign.aiScore,
      description: campaign.description,
      tasksCompleted: campaign.tasksCompleted || 0,
      tasksTotal: campaign.tasksTotal || 0,
      purpose: campaign.purpose,
      notes: campaign.notes,
      goals: campaign.goals,
    };
  };

  // Mock campaigns data (fallback if needed)
  const mockCampaigns: any[] = [
    {
      id: "1",
      title: "Spring Sale Email Campaign",
      status: "in-progress",
      type: "email",
      budget: "$5,000",
      spent: "$2,400",
      reach: "45K",
      reachGoal: "50K",
      engagement: "3.2%",
      engagementGoal: "4.0%",
      startDate: "Oct 15",
      endDate: "Oct 22",
      owner: "Sarah Chen",
      priority: "high",
      progress: 48,
      aiScore: 87,
      description: "Multi-channel email campaign promoting spring sale with personalized offers",
      tasksCompleted: 12,
      tasksTotal: 25,
      purpose: "Drive sales during spring season with targeted email campaigns featuring personalized product recommendations",
      notes: "Focus on segmented lists for better conversion. A/B test subject lines.",
      goals: ["Achieve 50K reach", "Maintain 4%+ engagement rate", "Generate $15K in revenue", "Grow email list by 5%"],
    },
    {
      id: "2",
      title: "Product Launch Social Blitz",
      status: "planning",
      type: "social",
      budget: "$12,000",
      reach: "0",
      reachGoal: "200K",
      engagementGoal: "5.5%",
      startDate: "Oct 20",
      endDate: "Nov 5",
      owner: "Mike Johnson",
      priority: "high",
      aiScore: 92,
      description: "Comprehensive social media campaign across all platforms for new product",
      tasksCompleted: 3,
      tasksTotal: 18,
      purpose: "Create buzz and awareness for new product launch across social media channels",
      notes: "Coordinate with influencer partnerships. Schedule posts for peak engagement times.",
      goals: ["Reach 200K users", "Generate 10K+ engagements", "Drive 5K website visits", "Achieve 5.5% engagement rate"],
    },
    {
      id: "3",
      title: "Q4 Google Ads Campaign",
      status: "in-progress",
      type: "paid-ads",
      budget: "$25,000",
      spent: "$8,900",
      reach: "500K",
      reachGoal: "1.2M",
      engagement: "4.1%",
      engagementGoal: "4.5%",
      startDate: "Oct 1",
      endDate: "Dec 31",
      owner: "Anna Martinez",
      priority: "medium",
      progress: 35,
      aiScore: 78,
      description: "Performance-driven Google Ads campaign targeting holiday shoppers",
      tasksCompleted: 8,
      tasksTotal: 22,
      purpose: "Maximize ROI through targeted Google Ads during Q4 shopping season",
      notes: "Monitor CPC closely. Adjust bids for high-performing keywords.",
      goals: ["1.2M impressions", "4.5% CTR", "$50K revenue", "3.5 ROAS"],
    },
    {
      id: "4",
      title: "Summer Feature Launch",
      status: "launching",
      type: "launch",
      budget: "$45,000",
      spent: "$42,000",
      reach: "1M",
      reachGoal: "1M",
      engagement: "6.2%",
      engagementGoal: "6.0%",
      startDate: "Oct 11",
      endDate: "Oct 18",
      owner: "Sarah Chen",
      priority: "high",
      progress: 95,
      aiScore: 94,
      description: "Major product feature launch with cross-channel marketing push",
      tasksCompleted: 28,
      tasksTotal: 30,
      purpose: "Successfully launch and promote new summer features to existing and new customers",
      notes: "Final push this week. Ensure all assets are live across channels.",
      goals: ["1M reach achieved", "6% engagement", "10K feature activations", "95% customer satisfaction"],
    },
    {
      id: "5",
      title: "Holiday Campaign 2025",
      status: "launching",
      type: "paid-ads",
      budget: "$35,000",
      spent: "$33,000",
      reach: "800K",
      reachGoal: "850K",
      engagement: "5.5%",
      engagementGoal: "5.0%",
      startDate: "Oct 10",
      endDate: "Oct 20",
      owner: "Anna Martinez",
      priority: "high",
      progress: 92,
      aiScore: 91,
      description: "Holiday season advertising blitz across multiple channels",
      tasksCompleted: 24,
      tasksTotal: 26,
      purpose: "Maximize holiday season sales with integrated multi-channel advertising",
      notes: "Monitor daily performance. Adjust spend allocation based on channel performance.",
      goals: ["850K+ reach", "5% engagement", "$100K revenue", "20K conversions"],
    },
    {
      id: "6",
      title: "Virtual Product Demo Event",
      status: "planning",
      type: "event",
      budget: "$8,000",
      reach: "0",
      reachGoal: "5K",
      engagementGoal: "15%",
      startDate: "Oct 25",
      endDate: "Oct 25",
      owner: "Emma Wilson",
      priority: "medium",
      aiScore: 81,
      description: "Live webinar showcasing new product features and capabilities",
      tasksCompleted: 5,
      tasksTotal: 15,
      purpose: "Engage prospects and customers with live product demonstrations",
      notes: "Prepare demo scripts. Test webinar platform thoroughly.",
      goals: ["5K registrations", "2.5K attendees", "15% engagement", "500 qualified leads"],
    },
    {
      id: "7",
      title: "Brand Awareness LinkedIn",
      status: "in-progress",
      type: "social",
      budget: "$4,500",
      spent: "$1,200",
      reach: "80K",
      reachGoal: "120K",
      engagement: "2.9%",
      engagementGoal: "3.5%",
      startDate: "Oct 10",
      endDate: "Oct 30",
      owner: "Mike Johnson",
      priority: "low",
      progress: 25,
      aiScore: 73,
      description: "B2B focused LinkedIn campaign to build brand authority",
      tasksCompleted: 6,
      tasksTotal: 20,
      purpose: "Establish thought leadership and brand presence in B2B space",
      notes: "Focus on long-form content. Engage with comments actively.",
      goals: ["120K reach", "3.5% engagement", "500 new followers", "100 lead gen forms"],
    },
    {
      id: "8",
      title: "Customer Success Stories",
      status: "completed",
      type: "content",
      budget: "$3,000",
      spent: "$2,800",
      reach: "35K",
      reachGoal: "30K",
      engagement: "5.8%",
      engagementGoal: "5.0%",
      startDate: "Sep 1",
      endDate: "Sep 30",
      owner: "David Lee",
      priority: "low",
      progress: 100,
      aiScore: 85,
      description: "Video series featuring customer testimonials and case studies",
      tasksCompleted: 12,
      tasksTotal: 12,
      purpose: "Build trust and credibility through authentic customer success stories",
      notes: "Campaign performed above expectations. Consider similar campaigns.",
      goals: ["30K+ views", "5% engagement", "8 video testimonials", "2K website visits"],
    },
    {
      id: "9",
      title: "Newsletter Redesign",
      status: "completed",
      type: "email",
      budget: "$2,000",
      spent: "$1,900",
      reach: "45K",
      reachGoal: "45K",
      engagement: "4.5%",
      engagementGoal: "4.0%",
      startDate: "Sep 5",
      endDate: "Sep 28",
      owner: "Emma Wilson",
      priority: "medium",
      progress: 100,
      aiScore: 89,
      description: "Complete overhaul of monthly newsletter with new templates",
      tasksCompleted: 10,
      tasksTotal: 10,
      purpose: "Improve newsletter engagement with modern design and better content",
      notes: "New template received positive feedback. Continue using this format.",
      goals: ["45K subscribers", "4%+ open rate", "15%+ CTR", "New template launch"],
    },
    {
      id: "10",
      title: "Back to School Campaign",
      status: "completed",
      type: "paid-ads",
      budget: "$18,000",
      spent: "$17,200",
      reach: "450K",
      reachGoal: "400K",
      engagement: "4.8%",
      engagementGoal: "4.5%",
      startDate: "Aug 1",
      endDate: "Sep 15",
      owner: "Anna Martinez",
      priority: "high",
      progress: 100,
      aiScore: 88,
      description: "Seasonal campaign targeting students and educators",
      tasksCompleted: 20,
      tasksTotal: 20,
      purpose: "Capture back-to-school shopping season with targeted advertising",
      notes: "Exceeded reach and engagement goals. Strong ROI.",
      goals: ["400K+ reach", "4.5% engagement", "$60K revenue", "5,000 conversions"],
    },
  ];

  const getFilteredCampaigns = () => {
    let filtered = campaigns;
    
    if (searchQuery) {
      filtered = filtered.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.owner.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (filterType) {
      filtered = filtered.filter((c) => c.type === filterType);
    }
    
    return filtered;
  };

  const getCampaignsByStatus = (status: Campaign["status"]) => {
    return getFilteredCampaigns().filter((c) => c.status === status);
  };

  const totalBudget = campaigns.reduce(
    (sum, c) => sum + (typeof c.budget === 'number' ? c.budget : parseFloat(String(c.budget).replace(/[$,]/g, ""))),
    0
  );
  const totalSpent = campaigns.reduce(
    (sum, c) => sum + (typeof c.spent === 'number' ? c.spent : parseFloat(String(c.spent || 0).replace(/[$,]/g, ""))),
    0
  );
  const activeCampaigns = campaigns.filter(
    (c) => c.status === "in-progress" || c.status === "launching"
  ).length;
  const avgAiScore = campaigns.length > 0 
    ? Math.round(campaigns.reduce((sum, c) => sum + (c.aiScore || 0), 0) / campaigns.length)
    : 0;

  const handleCampaignClick = async (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsNewCampaign(false);
    setIsEditPanelOpen(true);
    
    // Load tasks for this campaign
    if (typeof campaign.id === 'number' && currentTenantId) {
      setLoadingTasks(true);
      const { data: tasks, error: tasksError } = await getCampaignTasks(campaign.id, currentTenantId);
      if (tasksError) {
        console.error('Error loading tasks:', tasksError);
        toast.error('Failed to load tasks');
      } else {
        setCampaignTasks(tasks || []);
      }
      setLoadingTasks(false);
    } else {
      // New campaign, no tasks yet
      setCampaignTasks([]);
    }
  };

  const handleNewCampaign = () => {
    // Create a new empty campaign object
    const newCampaign: Campaign = {
      id: "new",
      name: "",
      type: "email",
      status: "planning",
      startDate: new Date(),
      endDate: null,
      budget: 0,
      spent: 0,
      impressions: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      owner: "Marketing Team",
      ownerId: 21, // TODO: Get from auth context
      priority: "medium",
      progress: 0,
      reach: 0,
      reachGoal: 0,
      engagement: 0,
      engagementGoal: 0,
      channels: [],
      tags: [],
      tasksCompleted: 0,
      tasksTotal: 0,
    };
    setSelectedCampaign(newCampaign);
    setIsNewCampaign(true);
    setIsEditPanelOpen(true);
  };

  const handleOpenInNewTab = (page: string) => {
    // In a real app, this would open the actual page
    toast.success(`Opening ${page} in new tab...`);
    // window.open(`/${page}`, '_blank');
  };

  // Convert Campaign to ProjectCampaignData format
  const convertToProjectData = (campaign: Campaign): ProjectCampaignData => {
    // Map campaign status to ProjectCampaignData status
    let status: ProjectCampaignData["status"] = "Planning";
    if (campaign.status === "in-progress") status = "In Progress";
    if (campaign.status === "launching") status = "Launching";
    if (campaign.status === "completed") status = "Completed";
    if (campaign.status === "planning") status = "Planning";
    
    // Handle Date objects - convert to string format expected by ProjectCampaignData
    const startDateStr = campaign.startDate instanceof Date 
      ? format(campaign.startDate, "MMM d")
      : String(campaign.startDate);
    const endDateStr = campaign.endDate instanceof Date
      ? format(campaign.endDate, "MMM d")
      : (campaign.endDate ? String(campaign.endDate) : "");
    
    return {
      id: String(campaign.id),
      name: campaign.name,
      description: campaign.description || "",
      type: "campaign" as const,
      status: status,
      progress: campaign.progress || 0,
      startDate: startDateStr,
      endDate: endDateStr,
      team: [campaign.owner],
      totalTasks: campaign.tasksTotal || 0,
      completedTasks: campaign.tasksCompleted || 0,
      color: campaignTypeColors[campaign.type],
      leader: campaign.owner,
    };
  };

  // Tasks are now loaded from Supabase when a campaign is selected

  const renderCampaignCard = (campaign: Campaign, index: number) => (
    <CardProjectCampaign
      key={String(campaign.id)}
      project={convertToProjectData(campaign)}
      onClick={() => handleCampaignClick(campaign)}
    />
  );

  // Show loading state
  if (loading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4B6BFB] mx-auto mb-4"></div>
          <p className="opacity-60">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading campaigns: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className={`transition-all duration-300 ${isEditPanelOpen ? 'lg:mr-[600px]' : 'mr-0'}`}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl mb-1 sm:mb-2">Campaign Board</h1>
              <p className="text-sm sm:text-base opacity-60">Manage and track all marketing campaigns in one place</p>
            </div>
            <Button 
              className="gap-2 bg-[#4B6BFB] hover:bg-[#3A5BEB] w-full sm:w-auto"
              onClick={handleNewCampaign}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Campaign</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </motion.div>

        {/* AI Insights Banner */}
        <div className="mb-6">
          <AINotificationCard
            message={<><span className="opacity-100">AI Campaign Insight:</span> Your "Spring Sale Email Campaign" is performing well! Consider increasing budget by 15% to maximize reach during the final week. Predicted ROI increase: +24%.</>}
            actionLabel="Optimize →"
            onAction={() => toast.success("Opening campaign optimizer...")}
            animated={true}
          />
        </div>

        {/* Campaign Stats */}
        <div className="mb-8">
          <ClickableStatsCards 
            stats={[
              {
                id: "total-budget",
                label: "Total Campaign Budget",
                value: `$${totalBudget.toLocaleString()}`,
                icon: DollarSign,
                iconColor: "text-emerald-600 dark:text-emerald-400",
                iconBgColor: "bg-emerald-500/10",
                trend: {
                  value: `$${totalSpent.toLocaleString()} spent`,
                  isPositive: totalSpent < totalBudget,
                },
                subtitle: `${Math.round((totalSpent / totalBudget) * 100)}% utilized`,
              },
              {
                id: "active-campaigns",
                label: "Active Campaigns",
                value: activeCampaigns,
                icon: Rocket,
                iconColor: "text-blue-600 dark:text-blue-400",
                iconBgColor: "bg-blue-500/10",
                subtitle: `${campaigns.length} total campaigns`,
              },
              {
                id: "ai-performance",
                label: "Avg AI Performance Score",
                value: `${avgAiScore}%`,
                icon: Zap,
                iconColor: "text-purple-600 dark:text-purple-400",
                iconBgColor: "bg-purple-500/10",
                trend: {
                  value: avgAiScore >= 80 ? "Excellent" : "Good",
                  isPositive: avgAiScore >= 80,
                },
                subtitle: "AI-optimized campaigns",
              },
            ]}
            selectedId={selectedStatCard}
            onSelect={setSelectedStatCard}
          />
        </div>

        {/* Campaigns by Status */}
        <Tabs defaultValue="planning" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-4 sm:mb-6 gap-1 sm:gap-0">
            <TabsTrigger value="planning" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <Target className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Planning</span>
              <span className="sm:hidden">Plan</span>
              <span className="hidden lg:inline"> ({getCampaignsByStatus("planning").length})</span>
            </TabsTrigger>
            <TabsTrigger value="in-progress" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <Play className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">In Progress</span>
              <span className="sm:hidden">Active</span>
              <span className="hidden lg:inline"> ({getCampaignsByStatus("in-progress").length})</span>
            </TabsTrigger>
            <TabsTrigger value="launching" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <Rocket className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Launching</span>
              <span className="sm:hidden">Launch</span>
              <span className="hidden lg:inline"> ({getCampaignsByStatus("launching").length})</span>
            </TabsTrigger>
            <TabsTrigger value="completed" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Completed</span>
              <span className="sm:hidden">Done</span>
              <span className="hidden lg:inline"> ({getCampaignsByStatus("completed").length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="planning">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {getCampaignsByStatus("planning").map((campaign, index) =>
                renderCampaignCard(campaign, index)
              )}
            </div>
          </TabsContent>

          <TabsContent value="in-progress">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {getCampaignsByStatus("in-progress").map((campaign, index) =>
                renderCampaignCard(campaign, index)
              )}
            </div>
          </TabsContent>

          <TabsContent value="launching">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {getCampaignsByStatus("launching").map((campaign, index) =>
                renderCampaignCard(campaign, index)
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            {/* Search and Filter - Only in Completed Tab */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4 sm:mb-6">
              <div className="relative flex-1 sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                <Input
                  type="search"
                  placeholder="Search completed campaigns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-glass-bg/50 border-glass-border"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors w-full sm:w-auto">
                    <Filter className="w-4 h-4" />
                    <span className="hidden sm:inline">{filterType ? filterType.replace("-", " ") : "All Types"}</span>
                    <span className="sm:hidden">{filterType ? filterType.replace("-", " ").substring(0, 3) : "All"}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setFilterType(null)}>
                    All Types
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterType("email")}>
                    Email Marketing
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType("social")}>
                    Social Media
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType("paid-ads")}>
                    Paid Advertising
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType("content")}>
                    Content Marketing
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType("event")}>
                    Events
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType("launch")}>
                    Product Launch
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {getCampaignsByStatus("completed").map((campaign, index) =>
                renderCampaignCard(campaign, index)
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Campaign Detail Panel - Using Modularized Component */}
      {selectedCampaign && (
        <ProjectCampaignDetailModule
          project={convertToProjectData(selectedCampaign)}
          isOpen={isEditPanelOpen}
          onClose={() => {
            setIsEditPanelOpen(false);
            setSelectedCampaign(null);
            setIsNewCampaign(false);
          }}
          tasks={campaignTasks}
          isNewMode={isNewCampaign}
          defaultTab="details"
          campaignId={typeof selectedCampaign?.id === 'number' ? selectedCampaign.id : undefined}
          tenantId={currentTenantId || undefined}
          onUpdate={async (updatedData) => {
            // Refresh campaigns list to get updated data
            if (!currentTenantId) return;
            const { data: updatedCampaigns, error } = await getCampaigns(currentTenantId, {
              search: searchQuery || undefined,
              type: filterType as any || undefined,
            });
            
            if (!error && updatedCampaigns) {
              setCampaigns(updatedCampaigns);
              
              // Update selected campaign if it's the one being edited
              if (selectedCampaign && typeof selectedCampaign.id === 'number') {
                const updatedCampaign = updatedCampaigns.find(c => c.id === selectedCampaign.id);
                if (updatedCampaign) {
                  setSelectedCampaign(updatedCampaign);
                }
              }
            }
          }}
        />
      )}
    </div>
  );
}
