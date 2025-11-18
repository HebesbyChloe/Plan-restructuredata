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
import { useState, useEffect } from "react";
import { Progress } from "../../../ui/progress";
import { TabBar } from "../../../layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../ui/tabs";
import { toast } from "sonner";
import { useTenantContext } from "../../../../contexts/TenantContext";
import { createAIFlowRequest, getAIFlows, updateAIFlowStatus, updateAIFlow, deleteAIFlow, getExternalTools, type AIFlowRow } from "../../../../lib/supabase/ai-flows";
import { format } from "date-fns";
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

import type { AIFlow, AIFlowPageProps, SheetMode } from "./types";
import { statusConfig, departmentConfig } from "./utils/constants";
import { FlowTable, LayerExplainer } from "./components";

// Map database row to frontend AIFlow type
const mapAIFlowFromDB = (row: AIFlowRow): AIFlow => {
  // Use layer column directly (supports layers 1, 2, 3, 4)
  // Get layer from row, default to 1 if not set
  const layer: 1 | 2 | 3 | 4 = (row.layer !== undefined && row.layer !== null) 
    ? row.layer as 1 | 2 | 3 | 4 
    : 1;

  // Map status: 'draft' in DB = 'requested' in frontend
  const status: "active" | "paused" | "requested" = 
    row.status === 'draft' ? 'requested' : row.status;

  // Extract category from metadata
  const category = row.metadata?.category || 'General';

  // Format dates
  const createdDate = row.created_at 
    ? format(new Date(row.created_at), "MMM d, yyyy")
    : "Unknown";

  const updatedDate = row.updated_at
    ? format(new Date(row.updated_at), "MMM d, yyyy")
    : undefined;

  return {
    id: row.id.toString(),
    name: row.name,
    description: row.description || "No description provided",
    status,
    layer,
    category,
    source: row.source,
    metrics: {
      tasksProcessed: 0, // Not tracked in database anymore
      successRate: 0, // Not tracked in database anymore
      avgTime: "N/A", // Not tracked in database anymore
      quality: 0, // Not tracked in database anymore
      efficiency: 0, // Not tracked in database anymore
    },
    createdDate,
    updatedDate,
  };
};

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

  // Data state
  const [aiFlows, setAIFlows] = useState<AIFlow[]>([]);
  const [externalTools, setExternalTools] = useState<AIFlow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedCategory, setEditedCategory] = useState("");
  const [editedStatus, setEditedStatus] = useState<"active" | "paused" | "draft">("draft");
  const [editedLayer, setEditedLayer] = useState<1 | 2 | 3 | 4>(1);
  const [editedSource, setEditedSource] = useState<'internal' | 'external' | 'n8n' | 'gpts' | 'zapier' | 'make'>('internal');
  const [editedUrl, setEditedUrl] = useState("");
  const [editedIcon, setEditedIcon] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Get tenant from context
  const { currentTenantId } = useTenantContext();

  const config = departmentConfig[department] || departmentConfig.Marketing;

  // Fetch AI flows from database
  useEffect(() => {
    if (!currentTenantId) {
      setLoading(false);
      return;
    }

    const loadFlows = async () => {
      setLoading(true);
      setError(null);
      try {
        // Load all flows (no source filter - we'll filter by layer instead)
        const { data, error: fetchError } = await getAIFlows(currentTenantId);
        if (fetchError) {
          setError(fetchError);
          toast.error(`Failed to load AI flows: ${fetchError.message}`);
        } else {
          const mappedFlows = (data || []).map(mapAIFlowFromDB);
          // Separate flows by layer: 1-3 go to aiFlows, layer 4 goes to externalTools
          const internalFlows = mappedFlows.filter(f => f.layer !== 4);
          const externalFlows = mappedFlows.filter(f => f.layer === 4);
          setAIFlows(internalFlows);
          setExternalTools(externalFlows);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        toast.error(`Failed to load AI flows: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadFlows();
  }, [currentTenantId]);

  const activeFlows = aiFlows.filter((f) => f.status === "active").length;
  const totalTasks = aiFlows.reduce((sum, f) => sum + f.metrics.tasksProcessed, 0);
  const avgSuccessRate =
    activeFlows > 0
      ? aiFlows
          .filter((f) => f.status === "active")
          .reduce((sum, f) => sum + f.metrics.successRate, 0) / activeFlows
      : 0;

  const getFlowsByLayer = (layer: 1 | 2 | 3 | 4) => {
    return aiFlows.filter((flow) => flow.layer === layer);
  };

  const handleFlowClick = async (flow: AIFlow) => {
    setSelectedFlow(flow);
    setSheetMode("view");
    setIsSheetOpen(true);
    setIsEditing(false);
    // Initialize edit fields
    setEditedName(flow.name);
    setEditedDescription(flow.description);
    setEditedCategory(flow.category);
    setEditedStatus(flow.status === "requested" ? "draft" : flow.status);
    setEditedLayer(flow.layer);
    
    // Fetch the full row data to get source and metadata
    if (currentTenantId) {
      const { data: allFlows } = await getAIFlows(currentTenantId);
      const flowRow = allFlows?.find(f => f.id === parseInt(flow.id));
      if (flowRow) {
        setEditedSource(flowRow.source);
        // For external tools, extract url and icon from metadata
        if (flow.layer === 4) {
          setEditedUrl(flowRow.metadata?.url || "");
          setEditedIcon(flowRow.metadata?.icon || "");
        } else {
          setEditedUrl("");
          setEditedIcon("");
        }
      } else {
        // Try external tools
        const { data: externalData } = await getExternalTools(currentTenantId);
        const externalRow = externalData?.find(f => f.id === parseInt(flow.id));
        if (externalRow) {
          setEditedSource(externalRow.source);
          setEditedUrl(externalRow.metadata?.url || "");
          setEditedIcon(externalRow.metadata?.icon || "");
        } else {
          setEditedSource('internal');
          setEditedUrl("");
          setEditedIcon("");
        }
      }
    }
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

  const handleStatusToggle = async (flow: AIFlow) => {
    if (!currentTenantId) {
      toast.error("No tenant selected");
      return;
    }

    const newStatus = flow.status === "active" ? "paused" : "active";
    
    try {
      const { data, error: updateError } = await updateAIFlowStatus(
        parseInt(flow.id),
        newStatus,
        currentTenantId
      );

      if (updateError) {
        toast.error(`Failed to update flow status: ${updateError.message}`);
      } else {
        // Update local state
        setAIFlows(prevFlows =>
          prevFlows.map(f =>
            f.id === flow.id
              ? { ...f, status: newStatus }
              : f
          )
        );

        // Update selected flow if it's the one being toggled
        if (selectedFlow?.id === flow.id) {
          setSelectedFlow({ ...selectedFlow, status: newStatus });
        }

        toast.success(`${flow.name} ${newStatus === "active" ? "activated" : "paused"}`);
      }
    } catch (err) {
      toast.error(`Failed to update flow status: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleDelete = async (flow: AIFlow) => {
    if (!currentTenantId) {
      toast.error("No tenant selected");
      return;
    }

    if (!confirm(`Are you sure you want to delete "${flow.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error: deleteError } = await deleteAIFlow(
        parseInt(flow.id),
        currentTenantId
      );

      if (deleteError) {
        toast.error(`Failed to delete flow: ${deleteError.message}`);
      } else {
        toast.success(`"${flow.name}" deleted successfully`);
        setIsSheetOpen(false);
        // Refresh flows list
        const { data: refreshedData } = await getAIFlows(currentTenantId, { source: 'internal' });
        if (refreshedData) {
          const mappedFlows = refreshedData.map(mapAIFlowFromDB);
          setAIFlows(mappedFlows);
        }
        const { data: externalData } = await getExternalTools(currentTenantId);
        if (externalData) {
          const mappedExternal = externalData.map(mapAIFlowFromDB);
          setExternalTools(mappedExternal);
        }
      }
    } catch (err) {
      toast.error(`Failed to delete flow: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedFlow || !currentTenantId) {
      return;
    }

    if (!editedName.trim()) {
      toast.error("Flow name is required");
      return;
    }

    setIsSaving(true);
    try {
      const metadata: any = {
        category: editedCategory,
      };

      // Add URL and icon for external tools (layer 4)
      if (editedLayer === 4) {
        if (editedUrl) metadata.url = editedUrl;
        if (editedIcon) metadata.icon = editedIcon;
      }

      const updateData: any = {
        name: editedName.trim(),
        description: editedDescription.trim() || null,
        status: editedStatus,
        layer: editedLayer,
        source: editedSource,
        metadata: metadata,
      };

      const { error: updateError } = await updateAIFlow(
        parseInt(selectedFlow.id),
        updateData,
        currentTenantId
      );

      if (updateError) {
        toast.error(`Failed to update flow: ${updateError.message}`);
      } else {
        toast.success("Flow updated successfully");
        setIsEditing(false);
        // Refresh all flows (no source filter - filter by layer instead)
        const { data: allFlows } = await getAIFlows(currentTenantId);
        if (allFlows) {
          const mappedFlows = allFlows.map(mapAIFlowFromDB);
          // Separate flows by layer: 1-3 go to aiFlows, layer 4 goes to externalTools
          const internalFlows = mappedFlows.filter(f => f.layer !== 4);
          const externalFlows = mappedFlows.filter(f => f.layer === 4);
          setAIFlows(internalFlows);
          setExternalTools(externalFlows);
          
          // Reload the selected flow to get updated data
          const updatedRow = allFlows.find(f => f.id === parseInt(selectedFlow.id));
          if (updatedRow) {
            const updatedFlow = mapAIFlowFromDB(updatedRow);
            setSelectedFlow(updatedFlow);
            // Re-initialize edit fields with updated data
            setEditedName(updatedFlow.name);
            setEditedDescription(updatedFlow.description);
            setEditedCategory(updatedFlow.category);
            setEditedStatus(updatedFlow.status === "requested" ? "draft" : updatedFlow.status);
            setEditedLayer(updatedFlow.layer);
            setEditedSource(updatedRow.source);
            if (updatedFlow.layer === 4) {
              setEditedUrl(updatedRow.metadata?.url || "");
              setEditedIcon(updatedRow.metadata?.icon || "");
            }
          }
        }
      }
    } catch (err) {
      toast.error(`Failed to update flow: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
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
              value: "layer4",
              label: "Layer 4: External Tools",
              icon: ExternalLink,
              count: externalTools.length,
            },
          ]}
        >
          {/* Layer 1: Automated */}
          <TabsContent value="layer1" className="space-y-4">
            <LayerExplainer layer={1} />
            {loading ? (
              <Card className="p-8 text-center">
                <p className="opacity-60">Loading AI flows...</p>
              </Card>
            ) : error ? (
              <Card className="p-8 text-center border-red-200 dark:border-red-800">
                <p className="text-red-600 dark:text-red-400">Error loading flows: {error.message}</p>
              </Card>
            ) : (
              <FlowTable flows={getFlowsByLayer(1)} onFlowClick={handleFlowClick} />
            )}
          </TabsContent>

          {/* Layer 2: On-Demand */}
          <TabsContent value="layer2" className="space-y-4">
            <LayerExplainer layer={2} />
            {loading ? (
              <Card className="p-8 text-center">
                <p className="opacity-60">Loading AI flows...</p>
              </Card>
            ) : error ? (
              <Card className="p-8 text-center border-red-200 dark:border-red-800">
                <p className="text-red-600 dark:text-red-400">Error loading flows: {error.message}</p>
              </Card>
            ) : (
              <FlowTable flows={getFlowsByLayer(2)} onFlowClick={handleFlowClick} />
            )}
          </TabsContent>

          {/* Layer 3: Interactive */}
          <TabsContent value="layer3" className="space-y-4">
            <LayerExplainer layer={3} />
            {loading ? (
              <Card className="p-8 text-center">
                <p className="opacity-60">Loading AI flows...</p>
              </Card>
            ) : error ? (
              <Card className="p-8 text-center border-red-200 dark:border-red-800">
                <p className="text-red-600 dark:text-red-400">Error loading flows: {error.message}</p>
              </Card>
            ) : (
              <FlowTable flows={getFlowsByLayer(3)} onFlowClick={handleFlowClick} />
            )}
          </TabsContent>

          {/* Layer 4: External Tools */}
          <TabsContent value="layer4" className="space-y-4">
            <LayerExplainer layer={4} />
            {loading ? (
              <Card className="p-8 text-center">
                <p className="opacity-60">Loading external tools...</p>
              </Card>
            ) : error ? (
              <Card className="p-8 text-center border-red-200 dark:border-red-800">
                <p className="text-red-600 dark:text-red-400">Error loading external tools: {error.message}</p>
              </Card>
            ) : (
              <FlowTable flows={externalTools} onFlowClick={handleFlowClick} />
            )}
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
                        <SelectItem value="3">Layer 3: Interactive (Conversational)</SelectItem>
                        <SelectItem value="4">Layer 4: External Tools</SelectItem>
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
                            // Refresh the flows list
                            if (currentTenantId) {
                              const { data: refreshedData } = await getAIFlows(currentTenantId);
                              if (refreshedData) {
                                const mappedFlows = refreshedData.map(mapAIFlowFromDB);
                                setAIFlows(mappedFlows);
                              }
                            }
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
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-12 h-12 rounded-xl bg-[#4B6BFB]/10 flex items-center justify-center flex-shrink-0">
                          <Brain className="w-6 h-6 text-[#4B6BFB]" />
                        </div>
                        <div className="flex-1">
                          {isEditing ? (
                            <div className="space-y-3">
                              <div>
                                <Label className="text-xs opacity-60 mb-1">Flow Name *</Label>
                                <Input
                                  value={editedName}
                                  onChange={(e) => setEditedName(e.target.value)}
                                  className="text-xl font-semibold"
                                  placeholder="Flow name"
                                />
                              </div>
                              <div>
                                <Label className="text-xs opacity-60 mb-1">Description</Label>
                                <Textarea
                                  value={editedDescription}
                                  onChange={(e) => setEditedDescription(e.target.value)}
                                  placeholder="Flow description"
                                  rows={3}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <Label className="text-xs opacity-60 mb-1">Category</Label>
                                  <Input
                                    value={editedCategory}
                                    onChange={(e) => setEditedCategory(e.target.value)}
                                    placeholder="Category"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs opacity-60 mb-1">Status</Label>
                                  <Select value={editedStatus} onValueChange={(value) => setEditedStatus(value as "active" | "paused" | "draft")}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="active">Active</SelectItem>
                                      <SelectItem value="paused">Paused</SelectItem>
                                      <SelectItem value="draft">Draft</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <Label className="text-xs opacity-60 mb-1">Layer</Label>
                                  <Select value={editedLayer.toString()} onValueChange={(value) => setEditedLayer(parseInt(value) as 1 | 2 | 3 | 4)}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="1">Layer 1: Automated</SelectItem>
                                      <SelectItem value="2">Layer 2: On-Demand</SelectItem>
                                      <SelectItem value="3">Layer 3: Interactive</SelectItem>
                                      <SelectItem value="4">Layer 4: External Tools</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label className="text-xs opacity-60 mb-1">Source</Label>
                                  <Select value={editedSource} onValueChange={(value) => setEditedSource(value as typeof editedSource)}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="internal">Internal</SelectItem>
                                      <SelectItem value="external">External</SelectItem>
                                      <SelectItem value="n8n">n8n</SelectItem>
                                      <SelectItem value="gpts">GPTs</SelectItem>
                                      <SelectItem value="zapier">Zapier</SelectItem>
                                      <SelectItem value="make">Make</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              {editedLayer === 4 && (
                                <>
                                  <div>
                                    <Label className="text-xs opacity-60 mb-1">Tool URL</Label>
                                    <Input
                                      value={editedUrl}
                                      onChange={(e) => setEditedUrl(e.target.value)}
                                      placeholder="https://example.com"
                                      type="url"
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-xs opacity-60 mb-1">Icon</Label>
                                    <Input
                                      value={editedIcon}
                                      onChange={(e) => setEditedIcon(e.target.value)}
                                      placeholder="🎨 (emoji or text)"
                                    />
                                  </div>
                                </>
                              )}
                            </div>
                          ) : (
                            <>
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
                            </>
                          )}
                        </div>
                      </div>
                      {!isEditing && (
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditing(true)}
                            className="gap-2"
                          >
                            <Edit3 className="w-4 h-4" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(selectedFlow)}
                            className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </Button>
                        </div>
                      )}
                      {isEditing && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              setIsEditing(false);
                              // Reset to original values from selectedFlow
                              setEditedName(selectedFlow.name);
                              setEditedDescription(selectedFlow.description);
                              setEditedCategory(selectedFlow.category);
                              setEditedStatus(selectedFlow.status === "requested" ? "draft" : selectedFlow.status);
                              setEditedLayer(selectedFlow.layer);
                              // Reload source and metadata from database
                              if (currentTenantId) {
                                const { data: allFlows } = await getAIFlows(currentTenantId);
                                const flowRow = allFlows?.find(f => f.id === parseInt(selectedFlow.id));
                                if (flowRow) {
                                  setEditedSource(flowRow.source);
                                  if (selectedFlow.layer === 4) {
                                    setEditedUrl(flowRow.metadata?.url || "");
                                    setEditedIcon(flowRow.metadata?.icon || "");
                                  } else {
                                    setEditedUrl("");
                                    setEditedIcon("");
                                  }
                                } else {
                                  const { data: externalData } = await getExternalTools(currentTenantId);
                                  const externalRow = externalData?.find(f => f.id === parseInt(selectedFlow.id));
                                  if (externalRow) {
                                    setEditedSource(externalRow.source);
                                    setEditedUrl(externalRow.metadata?.url || "");
                                    setEditedIcon(externalRow.metadata?.icon || "");
                                  } else {
                                    setEditedSource('internal');
                                    setEditedUrl("");
                                    setEditedIcon("");
                                  }
                                }
                              }
                            }}
                            disabled={isSaving}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleSaveEdit}
                            disabled={isSaving}
                            className="gap-2 bg-[#4B6BFB] hover:bg-[#3A5BEB]"
                          >
                            {isSaving ? "Saving..." : "Save"}
                          </Button>
                        </div>
                      )}
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
                              {selectedFlow.layer === 1 ? "Automated" : selectedFlow.layer === 2 ? "On-Demand" : selectedFlow.layer === 3 ? "Interactive" : "External Tools"}
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
                            Layer {selectedFlow.layer}: {selectedFlow.layer === 1 ? "Automated (Background)" : selectedFlow.layer === 2 ? "On-Demand" : selectedFlow.layer === 3 ? "Interactive (Conversational)" : "External Tools"}
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-[#4B6BFB]/10 text-[#4B6BFB] border-[#4B6BFB]/20">
                          {selectedFlow.layer === 1 ? "Automated" : selectedFlow.layer === 2 ? "On-Demand" : selectedFlow.layer === 3 ? "Interactive" : "External Tools"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 py-2 border-b border-border">
                        <div>
                          <Label className="text-xs opacity-60">Category</Label>
                          {isEditing ? (
                            <Input
                              value={editedCategory}
                              onChange={(e) => setEditedCategory(e.target.value)}
                              className="mt-1"
                              placeholder="Category"
                            />
                          ) : (
                            <p className="mt-1 mb-0">{selectedFlow.category}</p>
                          )}
                        </div>
                        <div>
                          <Label className="text-xs opacity-60">Platform</Label>
                          {isEditing ? (
                            <Select value={editedSource} onValueChange={(value) => setEditedSource(value as typeof editedSource)}>
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="internal">Internal</SelectItem>
                                <SelectItem value="external">External</SelectItem>
                                <SelectItem value="n8n">n8n</SelectItem>
                                <SelectItem value="gpts">GPTs</SelectItem>
                                <SelectItem value="zapier">Zapier</SelectItem>
                                <SelectItem value="make">Make</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <p className="mt-1 mb-0">{selectedFlow.source || 'Internal'}</p>
                          )}
                        </div>
                      </div>

                      {selectedFlow.status !== "requested" && (
                        <div className="grid grid-cols-2 gap-4 py-2 border-b border-border">
                          <div>
                            <Label className="text-xs opacity-60">Created Date</Label>
                            <p className="mt-1 mb-0">{selectedFlow.createdDate}</p>
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
                          <p className="mt-1 mb-0">{selectedFlow.updatedDate || selectedFlow.createdDate}</p>
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
