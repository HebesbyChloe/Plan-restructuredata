/**
 * ProjectCampaignDetail Module
 * Main orchestrator component for project/campaign detail panel
 * This is a modularized version of the original ProjectCampaignDetailPanel component
 */

import { useState, useEffect, useRef } from "react";
import { Badge } from "../../../ui/badge";
import { Edit, Check, X } from "lucide-react";
import { Briefcase } from "lucide-react";
import { Input } from "../../../ui/input";
import { Textarea } from "../../../ui/textarea";
import { Button } from "../../../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../../../ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../ui/tabs";
import { CheckSquare, FileText, ClipboardList } from "lucide-react";
import { toast } from "sonner";
import {
  AIRecommendationCard,
  MetricsGrid,
  FileBriefUpload,
  SyncButton,
  TasksTab,
  DetailsTab,
  ActivitiesTab,
} from "./components";
import { DEFAULT_METRICS, METRIC_OPTIONS } from "./utils/constants";
import { getStatusColor } from "./utils/helpers";
import type { ProjectCampaignDetailPanelProps, MetricValues } from "./types";
import { getCampaignActivities, getCampaignFiles, getTeamMembers } from "../../../../lib/supabase/marketing/campaign-data";
import { updateCampaign } from "../../../../lib/supabase/marketing/campaigns";

export function ProjectCampaignDetailModule({
  project,
  isOpen,
  onClose,
  tasks = [],
  isNewMode = false,
  defaultTab = "tasks",
  campaignId,
  tenantId,
  onUpdate,
}: ProjectCampaignDetailPanelProps) {
  const [selectedTab, setSelectedTab] = useState<"tasks" | "details" | "activities">(defaultTab);
  const [overviewText, setOverviewText] = useState(
    isNewMode ? "" : "This campaign aims to drive engagement during the Halloween season through coordinated social media, email marketing, and in-store promotional activities. Key focus areas include seasonal product promotions, themed content creation, and customer engagement initiatives."
  );
  
  // Reset tab when project changes
  useEffect(() => {
    setSelectedTab(defaultTab);
  }, [project.id, defaultTab]);
  
  // Team members state
  const [teamMembers, setTeamMembers] = useState<string[]>(project.team);
  const [allTeamMembers, setAllTeamMembers] = useState<Array<{id: number; name: string}>>([]);
  
  // Activities and files state
  const [activities, setActivities] = useState<Array<{date: string; activity: string; status: string}>>([]);
  const [files, setFiles] = useState<Array<{name: string; size: string; date: string}>>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(false);
  
  // File upload state for new mode
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessingBrief, setIsProcessingBrief] = useState(false);
  const [skipFileUpload, setSkipFileUpload] = useState(false);
  
  // Load activities, files, and team members when campaign is opened
  useEffect(() => {
    if (isOpen && campaignId && !isNewMode && tenantId) {
      // Load activities
      setLoadingActivities(true);
      getCampaignActivities(campaignId, tenantId).then(({ data, error }) => {
        if (error) {
          console.error('Error loading activities:', error);
        } else {
          setActivities(data || []);
        }
        setLoadingActivities(false);
      });
      
      // Load files
      setLoadingFiles(true);
      getCampaignFiles(campaignId, tenantId).then(({ data, error }) => {
        if (error) {
          console.error('Error loading files:', error);
        } else {
          setFiles(data || []);
        }
        setLoadingFiles(false);
      });
    }
  }, [isOpen, campaignId, isNewMode, tenantId]);
  
  // Load team members list
  useEffect(() => {
    if (isOpen && tenantId) {
      getTeamMembers(tenantId).then(({ data, error }) => {
        if (error) {
          console.error('Error loading team members:', error);
        } else {
          setAllTeamMembers(data?.map(m => ({ id: m.id, name: m.name })) || []);
        }
      });
    }
  }, [isOpen, tenantId]);
  
  // Metrics state
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(DEFAULT_METRICS);
  const [metricValues, setMetricValues] = useState<Record<string, MetricValues>>({
    budget: { goal: "$15,000", result: "$12,000" },
    reach: { goal: "100K", result: "85K" },
    engagement: { goal: "5.0%", result: "4.2%" },
    revenue: { goal: "$35,000", result: "$28,500" },
  });
  
  // Sync button visibility and updates tracking
  const [isNearBottom, setIsNearBottom] = useState(false);
  const [hasUnsyncedChanges, setHasUnsyncedChanges] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Edit state for name and description
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedName, setEditedName] = useState(project.name);
  const [editedDescription, setEditedDescription] = useState(project.description || "");
  const [isSaving, setIsSaving] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const descriptionTextareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Update local state when project changes
  useEffect(() => {
    setEditedName(project.name);
    setEditedDescription(project.description || "");
    setIsEditingName(false);
    setIsEditingDescription(false);
  }, [project.id, project.name, project.description]);
  
  // File upload handler
  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setIsProcessingBrief(true);
    setHasUnsyncedChanges(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setIsProcessingBrief(false);
      toast.success("AI has analyzed your brief and populated the details!");
      setOverviewText(`AI-generated overview from ${file.name}: This ${project.type} aims to deliver exceptional results through strategic planning and execution. Key objectives include maximizing ROI, engaging target audiences, and achieving measurable outcomes aligned with business goals.`);
    }, 2000);
  };
  
  // Track scroll position to show/hide sync button
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const scrollHeight = element.scrollHeight;
    const scrollTop = element.scrollTop;
    const clientHeight = element.clientHeight;
    
    // Show button when within 200px of bottom
    const nearBottom = scrollHeight - scrollTop - clientHeight < 200;
    setIsNearBottom(nearBottom);
  };
  
  // Handle sync action
  const handleSync = () => {
    setIsSyncing(true);
    toast.success("Syncing with AI brief...");
    
    setTimeout(() => {
      setIsSyncing(false);
      setHasUnsyncedChanges(false);
      toast.success("Successfully synced all changes to AI brief file!");
    }, 1500);
  };

  // Handle metric change
  const handleMetricChange = (index: number, newMetric: string) => {
    const newMetrics = [...selectedMetrics];
    newMetrics[index] = newMetric;
    setSelectedMetrics(newMetrics);
    
    // Initialize values for new metric if not exists
    if (!metricValues[newMetric]) {
      const newMetricOption = METRIC_OPTIONS.find(m => m.value === newMetric);
      if (newMetricOption) {
        setMetricValues({
          ...metricValues,
          [newMetric]: {
            goal: newMetricOption.defaultGoal,
            result: newMetricOption.defaultResult,
          }
        });
      }
    }
  };

  // Handle metric value change
  const handleMetricValueChange = (metricKey: string, field: "goal" | "result", value: string) => {
    setMetricValues({
      ...metricValues,
      [metricKey]: { ...metricValues[metricKey], [field]: value }
    });
    setHasUnsyncedChanges(true);
  };
  
  // Handle name edit
  const handleNameClick = () => {
    setIsEditingName(true);
    setTimeout(() => nameInputRef.current?.focus(), 0);
  };
  
  const handleNameSave = async () => {
    if (!editedName.trim()) {
      toast.error("Campaign name cannot be empty");
      return;
    }
    
    if (editedName.trim() === project.name) {
      setIsEditingName(false);
      return;
    }
    
    // For new campaigns, just update local state and notify parent
    if (isNewMode || !campaignId) {
      setIsEditingName(false);
      if (onUpdate) {
        onUpdate({ name: editedName.trim() });
      }
      return;
    }
    
    // For existing campaigns, save to database
    if (!tenantId) {
      toast.error("Please select a tenant");
      return;
    }
    
    setIsSaving(true);
    try {
      const { data, error } = await updateCampaign(campaignId, { name: editedName.trim() }, tenantId);
      if (error) {
        toast.error(`Failed to update name: ${error.message}`);
        setEditedName(project.name); // Revert on error
      } else {
        toast.success("Campaign name updated");
        setIsEditingName(false);
        // Notify parent component of update
        if (onUpdate && data) {
          onUpdate({ name: data.name });
        }
      }
    } catch (err) {
      toast.error("Failed to update campaign name");
      setEditedName(project.name); // Revert on error
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleNameCancel = () => {
    setEditedName(project.name);
    setIsEditingName(false);
  };
  
  // Handle description edit
  const handleDescriptionClick = () => {
    setIsEditingDescription(true);
    setTimeout(() => descriptionTextareaRef.current?.focus(), 0);
  };
  
  const handleDescriptionSave = async () => {
    if (editedDescription.trim() === (project.description || "")) {
      setIsEditingDescription(false);
      return;
    }
    
    // For new campaigns, just update local state and notify parent
    if (isNewMode || !campaignId) {
      setIsEditingDescription(false);
      if (onUpdate) {
        onUpdate({ description: editedDescription.trim() || "" });
      }
      return;
    }
    
    // For existing campaigns, save to database
    if (!tenantId) {
      toast.error("Please select a tenant");
      return;
    }
    
    setIsSaving(true);
    try {
      const { data, error } = await updateCampaign(
        campaignId, 
        { description: editedDescription.trim() || null }, 
        tenantId
      );
      if (error) {
        toast.error(`Failed to update description: ${error.message}`);
        setEditedDescription(project.description || ""); // Revert on error
      } else {
        toast.success("Campaign description updated");
        setIsEditingDescription(false);
        // Notify parent component of update
        if (onUpdate && data) {
          onUpdate({ description: data.description || "" });
        }
      }
    } catch (err) {
      toast.error("Failed to update campaign description");
      setEditedDescription(project.description || ""); // Revert on error
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDescriptionCancel = () => {
    setEditedDescription(project.description || "");
    setIsEditingDescription(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose} modal={true}>
      <SheetContent 
        className="w-full sm:max-w-2xl lg:max-w-3xl p-0 [&>button]:z-[60] flex flex-col"
      >
        <div className="flex-1 overflow-y-auto" onScroll={handleScroll}>
          <div className="p-4 sm:p-6 space-y-4 pb-24">
          {/* Header */}
          <SheetHeader>
            <div className="flex items-start gap-2 sm:gap-3">
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${project.color}20` }}
              >
                <Briefcase
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  style={{ color: project.color }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                  {isEditingName ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        ref={nameInputRef}
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleNameSave();
                          } else if (e.key === 'Escape') {
                            handleNameCancel();
                          }
                        }}
                        className="text-xl sm:text-2xl lg:text-3xl font-semibold h-auto py-1"
                        disabled={isSaving}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleNameSave}
                        disabled={isSaving}
                        className="h-8 w-8 p-0"
                      >
                        <Check className="w-4 h-4 text-green-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleNameCancel}
                        disabled={isSaving}
                        className="h-8 w-8 p-0"
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNameClick}
                      className="text-xl sm:text-2xl lg:text-3xl font-semibold cursor-pointer hover:text-[#4B6BFB] transition-colors group truncate text-left flex items-center gap-2"
                    >
                      <span className="truncate">{project.name}</span>
                      <Edit className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 opacity-0 group-hover:opacity-50 transition-opacity" />
                    </button>
                  )}
                  <Select 
                    value={project.status.toLowerCase()} 
                    onValueChange={async (value) => {
                      if (campaignId && !isNewMode && tenantId) {
                        try {
                          const { data, error } = await updateCampaign(
                            campaignId,
                            { status: value as any },
                            tenantId
                          );
                          if (error) {
                            toast.error(`Failed to update status: ${error.message}`);
                          } else {
                            toast.success("Campaign status updated");
                            if (onUpdate && data) {
                              onUpdate({ status: data.status });
                            }
                          }
                        } catch (err) {
                          toast.error("Failed to update campaign status");
                        }
                      }
                    }}
                  >
                    <SelectTrigger className="w-auto h-auto border-0 bg-transparent p-0 gap-0 focus:ring-0 focus:ring-offset-0">
                      <SelectValue>
                        <Badge className={getStatusColor(project.status)} variant="outline">
                          {project.status}
                        </Badge>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border">
                      <SelectItem value="planning">
                        <Badge className={getStatusColor("Planning")} variant="outline">
                          Planning
                        </Badge>
                      </SelectItem>
                      <SelectItem value="in-progress">
                        <Badge className={getStatusColor("In Progress")} variant="outline">
                          In Progress
                        </Badge>
                      </SelectItem>
                      <SelectItem value="launching">
                        <Badge className={getStatusColor("Launching")} variant="outline">
                          Launching
                        </Badge>
                      </SelectItem>
                      <SelectItem value="completed">
                        <Badge className={getStatusColor("Completed")} variant="outline">
                          Completed
                        </Badge>
                      </SelectItem>
                      <SelectItem value="draft">
                        <Badge className={getStatusColor("Draft")} variant="outline">
                          Draft
                        </Badge>
                      </SelectItem>
                      <SelectItem value="paused">
                        <Badge className={getStatusColor("Paused")} variant="outline">
                          Paused
                        </Badge>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {isEditingDescription ? (
                  <div className="space-y-2">
                    <Textarea
                      ref={descriptionTextareaRef}
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                          handleDescriptionCancel();
                        }
                      }}
                      className="text-sm min-h-[80px] resize-none"
                      disabled={isSaving}
                      placeholder="Enter campaign description..."
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={handleDescriptionSave}
                        disabled={isSaving}
                        className="h-8"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleDescriptionCancel}
                        disabled={isSaving}
                        className="h-8"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleDescriptionClick}
                    className="text-sm text-muted-foreground mb-0 cursor-pointer hover:text-foreground transition-colors group min-h-[20px] text-left w-full flex items-start gap-2"
                  >
                    <span className="flex-1">
                      {project.description && project.description.trim() ? (
                        project.description
                      ) : (
                        <span className="italic">No description provided. Click to add one.</span>
                      )}
                    </span>
                    <Edit className="w-3 h-3 flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-50 transition-opacity" />
                  </button>
                )}
              </div>
            </div>
          </SheetHeader>

          {/* File Drop Zone - Only show in new mode and if not skipped */}
          {isNewMode && !skipFileUpload && (
            <FileBriefUpload
              projectType={project.type}
              uploadedFile={uploadedFile}
              isProcessing={isProcessingBrief}
              onFileUpload={handleFileUpload}
              onSkipUpload={() => setSkipFileUpload(true)}
            />
          )}

          {/* AI Recommendation Card */}
          {!isNewMode && <AIRecommendationCard />}

          {/* Campaign-Style Metrics - Customizable */}
          <MetricsGrid
            selectedMetrics={selectedMetrics}
            metricValues={metricValues}
            onMetricChange={handleMetricChange}
            onValueChange={handleMetricValueChange}
          />

          {/* Tabs */}
          <Tabs value={selectedTab} onValueChange={(val) => setSelectedTab(val as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tasks" className="text-xs sm:text-sm">
                <CheckSquare className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Tasks</span>
              </TabsTrigger>
              <TabsTrigger value="details" className="text-xs sm:text-sm">
                <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Details</span>
              </TabsTrigger>
              <TabsTrigger value="activities" className="text-xs sm:text-sm">
                <ClipboardList className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Activities</span>
              </TabsTrigger>
            </TabsList>

            {/* Tasks Tab */}
            <TabsContent value="tasks">
              <TasksTab tasks={tasks} />
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details">
              <DetailsTab
                project={project}
                teamMembers={teamMembers}
                overviewText={overviewText}
                onTeamMembersChange={setTeamMembers}
                onOverviewChange={setOverviewText}
                onUnsyncedChange={() => setHasUnsyncedChanges(true)}
                allTeamMembers={allTeamMembers}
                files={files}
              />
            </TabsContent>

            {/* Activities Tab */}
            <TabsContent value="activities">
              <ActivitiesTab activities={activities} loading={loadingActivities} />
            </TabsContent>
          </Tabs>
          </div>
        </div>

        {/* AI Brief Sync Button - Stays at bottom */}
        <div className="mt-auto">
          <SyncButton
            isNearBottom={isNearBottom}
            hasUnsyncedChanges={hasUnsyncedChanges}
            isSyncing={isSyncing}
            onSync={handleSync}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
