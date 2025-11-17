import { Card } from "../../../ui/card";
import { Badge } from "../../../ui/badge";
import { Button } from "../../../ui/button";
import { motion } from "motion/react";
import {
  Plus,
  Play,
  Pause,
  Clock,
  Sparkles,
  Zap,
  Brain,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Cpu,
  MousePointer,
  MessageSquare,
  ExternalLink,
  X,
  Trash2,
  Edit3,
  Workflow,
  Link,
  Code,
  Globe,
  Mail,
  FileText,
  Database,
  Filter,
  Calendar,
  Users,
  ShoppingCart,
} from "lucide-react";
import { useState } from "react";
import { Progress } from "../../../ui/progress";
import { TabBar } from "../../../layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../ui/tabs";
import { toast } from "sonner";
import { useTenantContext } from "../../../../contexts/TenantContext";
import { createAIFlowRequest } from "../../../../lib/supabase/ai-flows";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "../../../ui/sheet";
import { Input } from "../../../ui/input";
import { Textarea } from "../../../ui/textarea";
import { Label } from "../../../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../ui/select";
import { Switch } from "../../../ui/switch";

import type { AIFlow, AIFlowPageProps, SheetMode, ExternalTool } from "./types";
import { aiFlows, externalTools } from "./utils/aiFlowData";
import { statusConfig, departmentConfig } from "./utils/constants";
import { FlowTable, LayerExplainer } from "./components";

export function AIFlowPage({ department = "Marketing" }: AIFlowPageProps) {
  const [activeTab, setActiveTab] = useState<string>("layer1");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<SheetMode>("view");
  const [selectedFlow, setSelectedFlow] = useState<AIFlow | null>(null);

  // Form state for new flow request
  const [flowName, setFlowName] = useState("");
  const [flowDescription, setFlowDescription] = useState("");
  const [flowLayer, setFlowLayer] = useState<string>("");
  const [flowCategory, setFlowCategory] = useState("");
  const [flowPurpose, setFlowPurpose] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get tenant from context
  const { currentTenantId } = useTenantContext();

  const config = departmentConfig[department] || departmentConfig.Marketing;

  const activeFlows = aiFlows.filter((f) => f.status === "active").length;
  const totalTasks = aiFlows.reduce((sum, f) => sum + f.metrics.tasksProcessed, 0);
  const avgSuccessRate =
    aiFlows
      .filter((f) => f.status === "active")
      .reduce((sum, f) => sum + f.metrics.successRate, 0) /
    aiFlows.filter((f) => f.status === "active").length;

  const getFlowsByLayer = (layer: 1 | 2 | 3) => {
    return aiFlows.filter((flow) => flow.layer === layer);
  };

  const handleFlowClick = (flow: AIFlow) => {
    setSelectedFlow(flow);
    setSheetMode("view");
    setIsSheetOpen(true);
  };

  const handleRequestNew = () => {
    setSelectedFlow(null);
    setSheetMode("request");
    setIsSheetOpen(true);
    // Reset form fields
    setFlowName("");
    setFlowDescription("");
    setFlowLayer("");
    setFlowCategory("");
    setFlowPurpose("");
  };

  const handleStatusToggle = (flow: AIFlow) => {
    if (flow.status === "active") {
      toast.success(`${flow.name} paused`);
    } else if (flow.status === "paused") {
      toast.success(`${flow.name} activated`);
    }
  };

  const handleDelete = (flow: AIFlow) => {
    toast.success(`Request to delete "${flow.name}" sent to admin`);
    setIsSheetOpen(false);
  };

  const handleExternalToolClick = (tool: ExternalTool) => {
    if (tool.url && tool.url !== "#") {
      window.open(tool.url, "_blank");
      toast.success(`Opening ${tool.name}...`);
    } else {
      toast.info(`${tool.name} coming soon`);
    }
  };

  return (
    <div className="w-full">
      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="mb-2">{config.title}</h1>
              <p className="opacity-60">{config.description}</p>
            </div>
            <Button className="gap-2" onClick={handleRequestNew}>
              <Plus className="w-4 h-4" />
              Request New Flow
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card className="p-4 border-glass-border bg-gradient-to-br from-[#4B6BFB]/10 to-[#6B8AFF]/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs opacity-60 mb-1">Active Flows</p>
                  <h2 className="mb-0">{activeFlows}</h2>
                </div>
                <div className="p-3 rounded-xl bg-[#4B6BFB]/20">
                  <Zap className="w-5 h-5 text-[#4B6BFB]" />
                </div>
              </div>
            </Card>

            <Card className="p-4 border-glass-border bg-gradient-to-br from-green-500/10 to-green-500/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs opacity-60 mb-1">Tasks Processed</p>
                  <h2 className="mb-0">{totalTasks.toLocaleString()}</h2>
                </div>
                <div className="p-3 rounded-xl bg-green-500/20">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </Card>

            <Card className="p-4 border-glass-border bg-gradient-to-br from-purple-500/10 to-purple-500/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs opacity-60 mb-1">Avg Success Rate</p>
                  <h2 className="mb-0">{avgSuccessRate.toFixed(0)}%</h2>
                </div>
                <div className="p-3 rounded-xl bg-purple-500/20">
                  <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </Card>
          </div>

          {/* AI Insight Card */}
          <Card className="p-4 border-[#4B6BFB]/30 bg-gradient-to-r from-[#4B6BFB]/10 to-[#6B8AFF]/10 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#4B6BFB]/20">
                <Sparkles className="w-5 h-5 text-[#4B6BFB]" />
              </div>
              <div className="flex-1">
                <p className="opacity-90 mb-0">
                  <span className="opacity-100">AI Tip:</span> Your automated flows are
                  processing 89% of routine tasks, freeing your team for strategic work.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Tabs for Layers + External Tools */}
        <TabBar
          defaultValue="layer1"
          onValueChange={(value) => setActiveTab(value)}
          tabs={[
            {
              value: "layer1",
              label: "Layer 1: Automated",
              icon: Cpu,
              count: getFlowsByLayer(1).length,
            },
            {
              value: "layer2",
              label: "Layer 2: On-Demand",
              icon: MousePointer,
              count: getFlowsByLayer(2).length,
            },
            {
              value: "layer3",
              label: "Layer 3: Interactive",
              icon: MessageSquare,
              count: getFlowsByLayer(3).length,
            },
            {
              value: "external",
              label: "External Tools",
              icon: ExternalLink,
              count: externalTools.length,
            },
          ]}
        >
          {/* Layer 1: Automated */}
          <TabsContent value="layer1" className="space-y-4">
            <LayerExplainer layer={1} />
            <FlowTable flows={getFlowsByLayer(1)} onFlowClick={handleFlowClick} />
          </TabsContent>

          {/* Layer 2: On-Demand */}
          <TabsContent value="layer2" className="space-y-4">
            <LayerExplainer layer={2} />
            <FlowTable flows={getFlowsByLayer(2)} onFlowClick={handleFlowClick} />
          </TabsContent>

          {/* Layer 3: Interactive */}
          <TabsContent value="layer3" className="space-y-4">
            <LayerExplainer layer={3} />
            <FlowTable flows={getFlowsByLayer(3)} onFlowClick={handleFlowClick} />
          </TabsContent>

          {/* External Tools */}
          <TabsContent value="external" className="space-y-4">
            {/* External Tools Explainer */}
            <Card className="p-6 border-glass-border bg-gradient-to-r from-orange-500/10 to-orange-500/5 backdrop-blur-sm mb-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-orange-500/20">
                  <ExternalLink className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1">
                  <div className="mb-3">
                    <h3 className="mb-1">External Tools</h3>
                    <p className="text-sm opacity-60 mb-0">Third-party integrations</p>
                  </div>
                  <p className="opacity-80 mb-3">
                    Connect popular external AI and creative tools to enhance your marketing workflows.
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex gap-2 items-start">
                      <CheckCircle2 className="w-4 h-4 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm opacity-70 mb-0">Quick access to external platforms</p>
                    </div>
                    <div className="flex gap-2 items-start">
                      <CheckCircle2 className="w-4 h-4 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm opacity-70 mb-0">Integrated with your workflows</p>
                    </div>
                    <div className="flex gap-2 items-start">
                      <CheckCircle2 className="w-4 h-4 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm opacity-70 mb-0">Expand your AI capabilities</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-glass-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Tool Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {externalTools.map((tool) => (
                    <TableRow
                      key={tool.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleExternalToolClick(tool)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{tool.icon}</div>
                          <div>
                            <p className="mb-0">{tool.name}</p>
                            <p className="text-xs opacity-60 mb-0">{tool.description}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{tool.category}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          className={
                            tool.status === "connected"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                              : "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300"
                          }
                        >
                          {tool.status === "connected" ? "Connected" : "Available"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExternalToolClick(tool);
                          }}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Open
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </TabBar>
      </div>

      {/* Right Side Sheet for Flow Details or Request */}
      <Sheet open={isSheetOpen} onOpenChange={(open) => {
        setIsSheetOpen(open);
        if (!open) {
          setTimeout(() => {
            setSheetMode("view");
            // Reset form fields when sheet closes
            setFlowName("");
            setFlowDescription("");
            setFlowLayer("");
            setFlowCategory("");
            setFlowPurpose("");
          }, 300);
        }
      }}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto p-0 [&>button]:z-[60]">
          <div className="p-6 space-y-4 pb-24">
            {sheetMode === "request" ? (
              // Request New Flow Form
              <>
                <SheetHeader>
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#4B6BFB]/10 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-6 h-6 text-[#4B6BFB]" />
                    </div>
                    <div className="flex-1">
                      <SheetTitle className="text-3xl mb-1">Request New AI Flow</SheetTitle>
                      <SheetDescription className="mb-0">
                        Submit a request to admin for a new AI flow to be added to the system
                      </SheetDescription>
                    </div>
                  </div>
                </SheetHeader>

                <Card className="p-4 bg-gradient-to-br from-[#4B6BFB]/5 to-[#6B8AFF]/5 border-[#4B6BFB]/20">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#4B6BFB]/10 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-[#4B6BFB]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-1 text-[#4B6BFB]">AI Will Help You</h4>
                      <p className="text-sm opacity-80 mb-0">
                        Once approved, the admin will configure and deploy your AI flow. You'll be notified when it's ready to use.
                      </p>
                    </div>
                  </div>
                </Card>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="flow-name">Flow Name *</Label>
                    <Input 
                      id="flow-name" 
                      placeholder="e.g., Product Launch Coordinator"
                      value={flowName}
                      onChange={(e) => setFlowName(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="flow-description">Description</Label>
                    <Textarea
                      id="flow-description"
                      placeholder="Describe what this AI flow should do..."
                      rows={4}
                      value={flowDescription}
                      onChange={(e) => setFlowDescription(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="flow-layer">Layer Type *</Label>
                    <Select value={flowLayer} onValueChange={setFlowLayer} disabled={isSubmitting}>
                      <SelectTrigger id="flow-layer">
                        <SelectValue placeholder="Select layer type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Layer 1: Automated (Background)</SelectItem>
                        <SelectItem value="2">Layer 2: On-Demand (Click to Run)</SelectItem>
                        <SelectItem value="3">
                          Layer 3: Interactive (Conversational)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="flow-category">Category</Label>
                    <Input 
                      id="flow-category" 
                      placeholder="e.g., Content Creation"
                      value={flowCategory}
                      onChange={(e) => setFlowCategory(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="flow-purpose">Business Purpose</Label>
                    <Textarea
                      id="flow-purpose"
                      placeholder="Explain why you need this flow and how it will help..."
                      rows={3}
                      value={flowPurpose}
                      onChange={(e) => setFlowPurpose(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      className="flex-1"
                      onClick={async () => {
                        if (!currentTenantId) {
                          toast.error("No tenant selected. Please select a tenant first.");
                          return;
                        }

                        if (!flowName.trim()) {
                          toast.error("Flow name is required");
                          return;
                        }

                        if (!flowLayer) {
                          toast.error("Layer type is required");
                          return;
                        }

                        setIsSubmitting(true);
                        try {
                          const { data, error } = await createAIFlowRequest(
                            {
                              name: flowName.trim(),
                              description: flowDescription.trim() || undefined,
                              layer: parseInt(flowLayer) as 1 | 2 | 3,
                              category: flowCategory.trim() || undefined,
                              businessPurpose: flowPurpose.trim() || undefined,
                            },
                            currentTenantId
                          );

                          if (error) {
                            toast.error(`Failed to submit request: ${error.message}`);
                          } else {
                            toast.success("Request submitted to admin for review");
                            // Reset form
                            setFlowName("");
                            setFlowDescription("");
                            setFlowLayer("");
                            setFlowCategory("");
                            setFlowPurpose("");
                            setIsSheetOpen(false);
                            // Optionally refresh the flows list here
                          }
                        } catch (err) {
                          toast.error(`Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}`);
                        } finally {
                          setIsSubmitting(false);
                        }
                      }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Request"}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsSheetOpen(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              // View Flow Details
              selectedFlow && (
                <>
                  {/* Header */}
                  <SheetHeader>
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#4B6BFB]/10 flex items-center justify-center flex-shrink-0">
                        <Brain className="w-6 h-6 text-[#4B6BFB]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <SheetTitle className="text-3xl">{selectedFlow.name}</SheetTitle>
                          <Badge
                            className={`${statusConfig[selectedFlow.status].bgColor} ${
                              statusConfig[selectedFlow.status].textColor
                            }`}
                          >
                            {selectedFlow.status.charAt(0).toUpperCase() +
                              selectedFlow.status.slice(1)}
                          </Badge>
                        </div>
                        <SheetDescription className="mb-0">
                          {selectedFlow.description}
                        </SheetDescription>
                      </div>
                    </div>
                  </SheetHeader>

                  {/* AI Performance Insights */}
                  {selectedFlow.status !== "requested" && (
                    <Card className="p-4 bg-gradient-to-br from-[#4B6BFB]/5 to-[#6B8AFF]/5 border-[#4B6BFB]/20">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#4B6BFB]/10 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-4 h-4 text-[#4B6BFB]" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="mb-0 text-[#4B6BFB]">AI Performance Insights</h4>
                            <Badge variant="outline" className="bg-[#4B6BFB]/10 text-[#4B6BFB] border-[#4B6BFB]/20">
                              {selectedFlow.layer === 1 ? "Automated" : selectedFlow.layer === 2 ? "On-Demand" : "Interactive"}
                            </Badge>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-start gap-2">
                              <TrendingUp className="w-4 h-4 text-[#4B6BFB] mt-0.5 flex-shrink-0" />
                              <p className="mb-0">
                                <strong>Quality Score:</strong> This flow performs at {selectedFlow.metrics.quality}% of human quality benchmark.
                              </p>
                            </div>
                            <div className="flex items-start gap-2">
                              <Zap className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                              <p className="mb-0">
                                <strong>Efficiency:</strong> Saves {selectedFlow.metrics.efficiency}% of time compared to manual work.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}

                  {/* Pending Approval Alert */}
                  {selectedFlow.status === "requested" && (
                    <Card className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                      <div className="flex gap-3">
                        <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="mb-1 text-orange-900 dark:text-orange-100">
                            Pending Admin Approval
                          </h4>
                          <p className="text-sm opacity-80 mb-0">
                            This flow request is awaiting review by an administrator. You'll
                            be notified once it's been approved or if changes are needed.
                          </p>
                        </div>
                      </div>
                    </Card>
                  )}

                  {/* Metrics Grid */}
                  {selectedFlow.status !== "requested" && (
                    <div className="grid grid-cols-2 gap-2">
                      <Card className="p-3 bg-accent/30 border-glass-border">
                        <p className="text-xs opacity-60 mb-1">Quality vs Human</p>
                        <div className="flex items-center gap-2">
                          <p className="text-2xl mb-0">{selectedFlow.metrics.quality}%</p>
                          <Progress value={selectedFlow.metrics.quality} className="h-1.5 flex-1" />
                        </div>
                      </Card>

                      <Card className="p-3 bg-accent/30 border-glass-border">
                        <p className="text-xs opacity-60 mb-1">Time Saved</p>
                        <div className="flex items-center gap-2">
                          <p className="text-2xl mb-0">{selectedFlow.metrics.efficiency}%</p>
                          <Progress value={selectedFlow.metrics.efficiency} className="h-1.5 flex-1" />
                        </div>
                      </Card>

                      <Card className="p-3 bg-accent/30 border-glass-border">
                        <p className="text-xs opacity-60 mb-1">Success Rate</p>
                        <div className="flex items-center gap-2">
                          <p className="text-2xl mb-0">{selectedFlow.metrics.successRate}%</p>
                          <Progress value={selectedFlow.metrics.successRate} className="h-1.5 flex-1" />
                        </div>
                      </Card>

                      <Card className="p-3 bg-accent/30 border-glass-border">
                        <p className="text-xs opacity-60 mb-1">Tasks Processed</p>
                        <p className="text-2xl mb-0">{selectedFlow.metrics.tasksProcessed.toLocaleString()}</p>
                      </Card>
                    </div>
                  )}

                  {/* Status Control */}
                  {selectedFlow.status !== "requested" && (
                    <Card className="p-4 border-glass-border">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            selectedFlow.status === "active" 
                              ? "bg-green-100 dark:bg-green-900/30" 
                              : "bg-gray-100 dark:bg-gray-900/30"
                          }`}>
                            {selectedFlow.status === "active" ? (
                              <Play className="w-5 h-5 text-green-600 dark:text-green-400" />
                            ) : (
                              <Pause className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <Label className="mb-1">Flow Status</Label>
                            <p className="text-xs text-muted-foreground mb-0">
                              {selectedFlow.status === "active" 
                                ? "Flow is currently active and processing tasks" 
                                : "Flow is paused and not processing tasks"}
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={selectedFlow.status === "active"}
                          onCheckedChange={() => handleStatusToggle(selectedFlow)}
                        />
                      </div>
                    </Card>
                  )}

                  {/* Flow Information */}
                  <Card className="p-4 border-glass-border">
                    <h4 className="mb-3">Flow Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-border">
                        <div>
                          <Label className="text-xs opacity-60">Layer Type</Label>
                          <p className="mt-1 mb-0">
                            Layer {selectedFlow.layer}: {selectedFlow.layer === 1 ? "Automated (Background)" : selectedFlow.layer === 2 ? "On-Demand" : "Interactive (Conversational)"}
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-[#4B6BFB]/10 text-[#4B6BFB] border-[#4B6BFB]/20">
                          {selectedFlow.layer === 1 ? "Automated" : selectedFlow.layer === 2 ? "On-Demand" : "Interactive"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 py-2 border-b border-border">
                        <div>
                          <Label className="text-xs opacity-60">Category</Label>
                          <p className="mt-1 mb-0">{selectedFlow.category}</p>
                        </div>
                        <div>
                          <Label className="text-xs opacity-60">Platform</Label>
                          <p className="mt-1 mb-0">n8n</p>
                        </div>
                      </div>

                      {selectedFlow.status !== "requested" && (
                        <div className="grid grid-cols-2 gap-4 py-2 border-b border-border">
                          <div>
                            <Label className="text-xs opacity-60">Last Run</Label>
                            <p className="mt-1 mb-0">{selectedFlow.lastRun}</p>
                          </div>
                          <div>
                            <Label className="text-xs opacity-60">Average Processing Time</Label>
                            <p className="mt-1 mb-0">{selectedFlow.metrics.avgTime}</p>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4 py-2">
                        <div>
                          <Label className="text-xs opacity-60">Created Date</Label>
                          <p className="mt-1 mb-0">{selectedFlow.createdDate}</p>
                        </div>
                        <div>
                          <Label className="text-xs opacity-60">Updated Date</Label>
                          <p className="mt-1 mb-0">Oct 18, 2024</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </>
              )
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
