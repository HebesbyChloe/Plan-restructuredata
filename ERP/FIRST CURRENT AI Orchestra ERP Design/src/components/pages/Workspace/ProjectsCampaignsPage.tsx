"use client";

import { useState } from "react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Badge } from "../../ui/badge";
import { Avatar, AvatarFallback } from "../../ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../../ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Textarea } from "../../ui/textarea";
import { TabBar } from "../../layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import {
  Briefcase,
  Plus,
  Calendar,
  Users,
  CheckSquare,
  TrendingUp,
  Search,
  Filter,
  LayoutGrid,
  List as ListIcon,
  MoreVertical,
  FolderOpen,
  FileText,
  Target as TargetIcon,
  Flag,
  Upload,
  MessageSquare,
  Paperclip,
  Download,
  Eye,
  Archive,
  ExternalLink,
  Edit,
  X,
  Sparkles,
  Star,
} from "lucide-react";
import { motion } from "motion/react";
import { Progress } from "../../ui/progress";
import { toast } from "sonner";
import { Label } from "../../ui/label";
import { ProjectCampaignDetailModule } from "../../Modules/Marketing/ProjectCampaignDetail";
import { CardProjectCampaign, ProjectCampaignData } from "../../Modules/Marketing/CardProjectCampaign";
import { AINotificationCard } from "../../Modules/Global/AINotificationCard";

interface Project {
  id: string;
  name: string;
  description: string;
  type: "project" | "campaign";
  status: "Active" | "Planning" | "Completed" | "On Hold";
  progress: number;
  startDate: string;
  endDate: string;
  team: string[];
  totalTasks: number;
  completedTasks: number;
  color: string;
}

interface Task {
  id: string;
  title: string;
  assignee: string;
  status: string;
  date: string;
}

// Available metric options
const metricOptions = [
  { value: "budget", label: "Budget", goalLabel: "Budget", resultLabel: "Spent", defaultGoal: "$15,000", defaultResult: "$12,000" },
  { value: "reach", label: "Reach", goalLabel: "Goal", resultLabel: "Result", defaultGoal: "100K", defaultResult: "85K" },
  { value: "engagement", label: "Engagement", goalLabel: "Goal", resultLabel: "Result", defaultGoal: "5.0%", defaultResult: "4.2%" },
  { value: "revenue", label: "Revenue", goalLabel: "Goal", resultLabel: "Result", defaultGoal: "$35,000", defaultResult: "$28,500" },
  { value: "impressions", label: "Impressions", goalLabel: "Goal", resultLabel: "Result", defaultGoal: "500K", defaultResult: "425K" },
  { value: "clicks", label: "Clicks", goalLabel: "Goal", resultLabel: "Result", defaultGoal: "25K", defaultResult: "22K" },
  { value: "conversions", label: "Conversions", goalLabel: "Goal", resultLabel: "Result", defaultGoal: "1,200", defaultResult: "1,050" },
  { value: "ctr", label: "Click Rate (CTR)", goalLabel: "Goal", resultLabel: "Result", defaultGoal: "3.5%", defaultResult: "3.2%" },
  { value: "roi", label: "ROI", goalLabel: "Goal", resultLabel: "Result", defaultGoal: "250%", defaultResult: "220%" },
  { value: "leads", label: "Leads", goalLabel: "Goal", resultLabel: "Result", defaultGoal: "500", defaultResult: "450" },
  { value: "sales", label: "Sales", goalLabel: "Goal", resultLabel: "Result", defaultGoal: "$50,000", defaultResult: "$45,000" },
  { value: "units", label: "Units Sold", goalLabel: "Goal", resultLabel: "Result", defaultGoal: "1,000", defaultResult: "850" },
];

export function ProjectsCampaignsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedTab, setSelectedTab] = useState<"active" | "inprogress" | "planning" | "completed">("active");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newItemType, setNewItemType] = useState<"project" | "campaign" | null>(null);
  
  // Default metrics for each card (customizable per project)
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["budget", "reach", "engagement", "revenue"]);
  
  // Metric values (could be stored per project)
  const [metricValues, setMetricValues] = useState<Record<string, { goal: string; result: string }>>({
    budget: { goal: "$15,000", result: "$12,000" },
    reach: { goal: "100K", result: "85K" },
    engagement: { goal: "5.0%", result: "4.2%" },
    revenue: { goal: "$35,000", result: "$28,500" },
  });

  const allProjects: Project[] = [
    {
      id: "1",
      name: "Halloween Campaign",
      description: "Complete Halloween marketing campaign with social media, email, and in-store promotions",
      type: "campaign",
      status: "Active",
      progress: 75,
      startDate: "Oct 1, 2024",
      endDate: "Oct 31, 2024",
      team: ["Vy Ha", "Nam Lam", "Hang Tran", "Mai Nguyen"],
      totalTasks: 24,
      completedTasks: 18,
      color: "#F59E0B",
    },
    {
      id: "2",
      name: "Mid-Autumn Campaign",
      description: "Traditional Mid-Autumn festival campaign targeting family customers",
      type: "campaign",
      status: "Completed",
      progress: 100,
      startDate: "Sep 1, 2024",
      endDate: "Sep 29, 2024",
      team: ["Vy Ha", "Linh Pham"],
      totalTasks: 32,
      completedTasks: 32,
      color: "#10B981",
    },
    {
      id: "7",
      name: "Summer Collection 2024",
      description: "Archived summer campaign with social media and influencer partnerships",
      type: "campaign",
      status: "Completed",
      progress: 100,
      startDate: "Jun 1, 2024",
      endDate: "Aug 31, 2024",
      team: ["Vy Ha", "Thao Le", "Duc Nguyen"],
      totalTasks: 45,
      completedTasks: 45,
      color: "#06B6D4",
    },
    {
      id: "3",
      name: "October Collection",
      description: "New product collection launch for October with AI-generated concepts",
      type: "project",
      status: "Active",
      progress: 60,
      startDate: "Sep 15, 2024",
      endDate: "Oct 30, 2024",
      team: ["Vy Ha", "Minh Tran", "Thao Le"],
      totalTasks: 18,
      completedTasks: 11,
      color: "#8B5CF6",
    },
    {
      id: "4",
      name: "November Planning",
      description: "Strategic planning and preparation for November campaigns and launches",
      type: "project",
      status: "Planning",
      progress: 15,
      startDate: "Oct 15, 2024",
      endDate: "Nov 30, 2024",
      team: ["Vy Ha", "Nam Lam"],
      totalTasks: 12,
      completedTasks: 2,
      color: "#4B6BFB",
    },
    {
      id: "5",
      name: "Website Redesign",
      description: "Complete overhaul of company website with modern design and improved UX",
      type: "project",
      status: "Active",
      progress: 45,
      startDate: "Sep 1, 2024",
      endDate: "Dec 31, 2024",
      team: ["Nam Lam", "Hang Tran", "Duc Nguyen", "An Vo"],
      totalTasks: 56,
      completedTasks: 25,
      color: "#EC4899",
    },
    {
      id: "6",
      name: "Q4 Sales Push",
      description: "Aggressive sales campaign for Q4 targets with special promotions",
      type: "campaign",
      status: "Planning",
      progress: 10,
      startDate: "Oct 20, 2024",
      endDate: "Dec 31, 2024",
      team: ["Mai Nguyen", "Linh Pham", "Vy Ha"],
      totalTasks: 28,
      completedTasks: 3,
      color: "#EF4444",
    },
  ];

  // Apply type filter to all projects
  let projects = allProjects;
  
  if (typeFilter !== "all") {
    projects = projects.filter(p => p.type === typeFilter);
  }

  const projectTasks: Record<string, Task[]> = {
    "1": [
      { id: "t1", title: "Pre-Launch Halloween Campaign Meeting", assignee: "Vy Ha", status: "Todo", date: "Oct 13" },
      { id: "t2", title: "Create Halloween Social Media Posts", assignee: "Nam Lam", status: "Processing", date: "Oct 14" },
      { id: "t3", title: "Design Halloween Email Template", assignee: "Hang Tran", status: "Done", date: "Oct 10" },
      { id: "t4", title: "Halloween Influencer Outreach", assignee: "Mai Nguyen", status: "Processing", date: "Oct 15" },
      { id: "t5", title: "Halloween Store Decorations", assignee: "Vy Ha", status: "Done", date: "Oct 8" },
    ],
    "2": [
      { id: "t6", title: "[Report] Campaign Trung Thu Performance", assignee: "Vy Ha", status: "Done", date: "Oct 5" },
      { id: "t7", title: "Final Analysis Mid-Autumn", assignee: "Linh Pham", status: "Done", date: "Oct 3" },
    ],
    "3": [
      { id: "t8", title: "[Generate] Ảnh Concept BST Tháng 10", assignee: "Vy Ha", status: "Processing", date: "Oct 15" },
      { id: "t9", title: "Product Photography October", assignee: "Minh Tran", status: "Processing", date: "Oct 16" },
      { id: "t10", title: "October Collection Launch Event", assignee: "Thao Le", status: "Todo", date: "Oct 25" },
    ],
    "4": [
      { id: "t11", title: "[Plan] Chi tiết 3 tubing Tháng 11", assignee: "Vy Ha", status: "Todo", date: "Oct 30" },
      { id: "t12", title: "[Research] Idea/Theme cho Campaign Tháng 11", assignee: "Vy Ha", status: "Todo", date: "Oct 28" },
    ],
  };

  const handleCreateNew = (type: "project" | "campaign") => {
    setNewItemType(type);
    setIsCreatingNew(true);
  };

  const handleClosePanel = () => {
    setSelectedProject(null);
    setIsCreatingNew(false);
    setNewItemType(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "Planning":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "Completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
      case "On Hold":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const ProjectCard = ({ project }: { project: Project }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="p-6 bg-white dark:bg-card border-[#E5E5E5] dark:border-border hover:shadow-lg transition-all cursor-pointer overflow-hidden"
        onClick={() => {
          setSelectedProject(project);
          setSelectedTab("details");
        }}
      >
        {/* Colored Top Border */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ backgroundColor: project.color }}
        />

        <div className="space-y-4 pt-1">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${project.color}20` }}
              >
                <Briefcase className="w-6 h-6" style={{ color: project.color }} />
              </div>
              <div className="flex-1">
                <h3 className="mb-1">{project.name}</h3>
                <p className="text-sm text-muted-foreground mb-0 line-clamp-2">
                  {project.description}
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-[#4B6BFB] [&>div]:via-[#6B8AFF] [&>div]:to-[#8BA4FF]" />
          </div>

          <div className="flex items-center justify-between">
            <Badge className={getStatusColor(project.status)} variant="outline">
              {project.status}
            </Badge>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <CheckSquare className="w-3 h-3" />
                <span>{project.completedTasks}/{project.totalTasks}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{project.team.length}</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E5E5E5] dark:border-border">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>{project.startDate} - {project.endDate}</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4B6BFB] to-[#6B8AFF] flex items-center justify-center shadow-lg">
            <FolderOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="mb-1">Projects & Campaigns</h1>
            <p className="text-sm text-muted-foreground mb-0">
              Manage all your projects and campaigns
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-[#F8F8F8] dark:bg-muted">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className={
                viewMode === "grid"
                  ? "bg-white dark:bg-card shadow-sm"
                  : "hover:bg-white/50 dark:hover:bg-card/50"
              }
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className={
                viewMode === "list"
                  ? "bg-white dark:bg-card shadow-sm"
                  : "hover:bg-white/50 dark:hover:bg-card/50"
              }
            >
              <ListIcon className="w-4 h-4" />
            </Button>
          </div>

          {/* Type Filter */}
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px] bg-white dark:bg-card border-[#E5E5E5]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="project">Projects</SelectItem>
              <SelectItem value="campaign">Campaigns</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              className="gap-2 hover:bg-blue-50 dark:hover:bg-blue-950/20 border-[#4B6BFB]/30"
              onClick={() => handleCreateNew("project")}
            >
              <Briefcase className="w-4 h-4" />
              New Project
            </Button>
            <Button 
              className="gap-2 bg-gradient-to-r from-[#4B6BFB] to-[#6B8AFF] hover:from-[#3B5BEB] to-[#5B7AEF] text-white"
              onClick={() => handleCreateNew("campaign")}
            >
              <Sparkles className="w-4 h-4" />
              New Campaign
            </Button>
          </div>
        </div>
      </div>

      {/* AI Notification Card */}
      <AINotificationCard 
        title="3 Projects Need Attention"
        message="Halloween Campaign is 80% through its timeline but only 75% complete. Consider reallocating resources or adjusting deadlines."
        type="warning"
        actions={[
          {
            label: "View Details",
            onClick: () => toast.info("Opening campaign details..."),
          },
          {
            label: "Adjust Timeline",
            onClick: () => toast.info("Opening timeline adjustment..."),
            variant: "default",
          },
        ]}
      />

      {/* Status Tabs */}
      <TabBar
        value={selectedTab}
        onValueChange={(value: any) => setSelectedTab(value)}
        tabs={[
          { value: "active", label: "Active/Launching" },
          { value: "inprogress", label: "In Progress" },
          { value: "planning", label: "Planning" },
          { value: "completed", label: "Completed" },
        ]}
      >

        <TabsContent value="active" className="space-y-4">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects
                .filter(p => p.status === "Active" || p.status === "Launching")
                .map((project) => (
                  <CardProjectCampaign 
                    key={project.id} 
                    project={project as ProjectCampaignData}
                    onClick={() => {
                      setSelectedProject(project);
                    }}
                  />
                ))}
            </div>
          ) : (
            <Card className="bg-white dark:bg-card border-[#E5E5E5] dark:border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Leader</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects
                    .filter(p => p.status === "Active" || p.status === "Launching")
                    .map((project) => (
                      <TableRow 
                        key={project.id}
                        className="cursor-pointer hover:bg-accent/50"
                        onClick={() => setSelectedProject(project)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: `${project.color}20` }}
                            >
                              {project.type === "campaign" ? (
                                <Sparkles className="w-4 h-4" style={{ color: project.color }} />
                              ) : (
                                <Briefcase className="w-4 h-4" style={{ color: project.color }} />
                              )}
                            </div>
                            <span>{project.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {project.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(project.status)} variant="outline">
                            {project.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={project.progress} className="h-2 w-20" />
                            <span className="text-sm">{project.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex -space-x-2">
                            {project.team.slice(0, 3).map((member, i) => (
                              <Avatar key={i} className="w-7 h-7 border-2 border-background">
                                <AvatarFallback className="text-xs">
                                  {member.split(" ").map(n => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                            {project.team.length > 3 && (
                              <div className="w-7 h-7 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                                +{project.team.length - 3}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {project.startDate} - {project.endDate}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="w-3 h-3 text-[#DAB785]" />
                            <span>{project.team[0]}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="inprogress" className="space-y-4">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects
                .filter(p => p.status === "In Progress")
                .map((project) => (
                  <CardProjectCampaign 
                    key={project.id} 
                    project={project as ProjectCampaignData}
                    onClick={() => setSelectedProject(project)}
                  />
                ))}
            </div>
          ) : (
            <Card className="bg-white dark:bg-card border-[#E5E5E5] dark:border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Leader</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.filter(p => p.status === "In Progress").length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No projects in progress
                      </TableCell>
                    </TableRow>
                  ) : (
                    projects
                      .filter(p => p.status === "In Progress")
                      .map((project) => (
                        <TableRow 
                          key={project.id}
                          className="cursor-pointer hover:bg-accent/50"
                          onClick={() => setSelectedProject(project)}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: `${project.color}20` }}
                              >
                                {project.type === "campaign" ? (
                                  <Sparkles className="w-4 h-4" style={{ color: project.color }} />
                                ) : (
                                  <Briefcase className="w-4 h-4" style={{ color: project.color }} />
                                )}
                              </div>
                              <span>{project.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {project.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={project.progress} className="h-2 w-20" />
                              <span className="text-sm">{project.progress}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex -space-x-2">
                              {project.team.slice(0, 3).map((member, i) => (
                                <Avatar key={i} className="w-7 h-7 border-2 border-background">
                                  <AvatarFallback className="text-xs">
                                    {member.split(" ").map(n => n[0]).join("")}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {project.startDate} - {project.endDate}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                              <Star className="w-3 h-3 text-[#DAB785]" />
                              <span>{project.team[0]}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="planning" className="space-y-4">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects
                .filter(p => p.status === "Planning")
                .map((project) => (
                  <CardProjectCampaign 
                    key={project.id} 
                    project={project as ProjectCampaignData}
                    onClick={() => setSelectedProject(project)}
                  />
                ))}
            </div>
          ) : (
            <Card className="bg-white dark:bg-card border-[#E5E5E5] dark:border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Leader</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects
                    .filter(p => p.status === "Planning")
                    .map((project) => (
                      <TableRow 
                        key={project.id}
                        className="cursor-pointer hover:bg-accent/50"
                        onClick={() => setSelectedProject(project)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: `${project.color}20` }}
                            >
                              {project.type === "campaign" ? (
                                <Sparkles className="w-4 h-4" style={{ color: project.color }} />
                              ) : (
                                <Briefcase className="w-4 h-4" style={{ color: project.color }} />
                              )}
                            </div>
                            <span>{project.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {project.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={project.progress} className="h-2 w-20" />
                            <span className="text-sm">{project.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex -space-x-2">
                            {project.team.slice(0, 3).map((member, i) => (
                              <Avatar key={i} className="w-7 h-7 border-2 border-background">
                                <AvatarFallback className="text-xs">
                                  {member.split(" ").map(n => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {project.startDate} - {project.endDate}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="w-3 h-3 text-[#DAB785]" />
                            <span>{project.team[0]}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allProjects
                .filter(p => p.status === "Completed")
                .map((project) => (
                  <CardProjectCampaign 
                    key={project.id} 
                    project={project as ProjectCampaignData}
                    onClick={() => setSelectedProject(project)}
                  />
                ))}
            </div>
          ) : (
            <Card className="bg-white dark:bg-card border-[#E5E5E5] dark:border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Completed Date</TableHead>
                    <TableHead>Leader</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allProjects
                    .filter(p => p.status === "Completed")
                    .map((project) => (
                      <TableRow 
                        key={project.id}
                        className="cursor-pointer hover:bg-accent/50"
                        onClick={() => setSelectedProject(project)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: `${project.color}20` }}
                            >
                              {project.type === "campaign" ? (
                                <Sparkles className="w-4 h-4" style={{ color: project.color }} />
                              ) : (
                                <Briefcase className="w-4 h-4" style={{ color: project.color }} />
                              )}
                            </div>
                            <span>{project.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {project.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex -space-x-2">
                            {project.team.slice(0, 3).map((member, i) => (
                              <Avatar key={i} className="w-7 h-7 border-2 border-background">
                                <AvatarFallback className="text-xs">
                                  {member.split(" ").map(n => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {project.endDate}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="w-3 h-3 text-[#DAB785]" />
                            <span>{project.team[0]}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>
      </TabBar>

      {/* Project/Campaign Detail Panel - Modularized Component */}
      {(selectedProject || isCreatingNew) && (
        <ProjectCampaignDetailModule
          project={selectedProject || {
            id: `new-${Date.now()}`,
            name: newItemType === "campaign" ? "New Campaign" : "New Project",
            description: "",
            type: newItemType!,
            status: "Planning",
            progress: 0,
            startDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            endDate: "",
            team: [],
            totalTasks: 0,
            completedTasks: 0,
            color: newItemType === "campaign" ? "#F59E0B" : "#4B6BFB",
          }}
          isOpen={!!(selectedProject || isCreatingNew)}
          onClose={handleClosePanel}
          tasks={selectedProject ? projectTasks[selectedProject.id] || [] : []}
          isNewMode={isCreatingNew}
          defaultTab="details"
        />
      )}
    </div>
  );
}
