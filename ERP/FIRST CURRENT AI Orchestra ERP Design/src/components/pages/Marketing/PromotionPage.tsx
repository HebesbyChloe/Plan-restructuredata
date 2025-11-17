"use client";

import { useState, useEffect } from "react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "../../ui/sheet";
import { Badge } from "../../ui/badge";
import { Switch } from "../../ui/switch";
import { Plus, TrendingUp, Calendar, Edit, TrendingDown, Tag, Radio, Pause, Check, X } from "lucide-react";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { motion } from "motion/react";
import { toast } from "sonner";
import { format } from "date-fns";

// Import all promotion modules
import { PromotionTable } from "../../Modules/Marketing/Promotions/PromotionTable";
import { PromotionFilters } from "../../Modules/Marketing/Promotions/PromotionFilters";
import { PromotionAIBanner } from "../../Modules/Marketing/Promotions/PromotionAIBanner";
import { PromotionSetupTab } from "../../Modules/Marketing/Promotions/PromotionSetupTab";
import { PromotionProductsTab } from "../../Modules/Marketing/Promotions/PromotionProductsTab";
import { PromotionReportTab } from "../../Modules/Marketing/Promotions/PromotionReportTab";
import { 
  Promotion,
  promotionTypeColors,
  promotionTypeLabels,
} from "../../Modules/Marketing/Promotions/promotionData";
import { PromotionCreateDialog } from "../../Modules/Marketing/Promotions/PromotionCreateDialog";
import { getPromotions, createPromotion, updatePromotion } from "../../../lib/supabase/marketing/promotions";
import { useTenantContext } from "../../../contexts/TenantContext";

export function PromotionPage() {
  // State management
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isNewPromotion, setIsNewPromotion] = useState(false);
  const [panelTab, setPanelTab] = useState<string>("setup");
  
  // Editing states
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedCode, setEditedCode] = useState("");
  const [editedStartDate, setEditedStartDate] = useState("");
  const [editedEndDate, setEditedEndDate] = useState("");
  const [editedTarget, setEditedTarget] = useState("");
  const [editedType, setEditedType] = useState("");
  const [editedCampaigns, setEditedCampaigns] = useState<string[]>([]);
  const [editedChannels, setEditedChannels] = useState<string[]>([]);
  const [editedStores, setEditedStores] = useState<string[]>([]);
  const [editedCategories, setEditedCategories] = useState<string[]>([]);
  const [editedProducts, setEditedProducts] = useState<string[]>([]);
  const [editedAttributes, setEditedAttributes] = useState<string[]>([]);
  const [editedStatus, setEditedStatus] = useState<"active" | "scheduled" | "draft" | "expired" | "archived">("draft");
  const [isAutoApply, setIsAutoApply] = useState(false);
  const [excludedProducts, setExcludedProducts] = useState<string[]>([]);
  const [excludedCategories, setExcludedCategories] = useState<string[]>([]);
  const [excludedAttributes, setExcludedAttributes] = useState<string[]>([]);
  const [ruleLogic, setRuleLogic] = useState<"AND" | "OR">("OR");
  const [editedPercentageValue, setEditedPercentageValue] = useState<number>(0);
  const [editedValueAmount, setEditedValueAmount] = useState<number>(0);
  const [editedBuyQuantity, setEditedBuyQuantity] = useState<number>(1);
  const [editedGetQuantity, setEditedGetQuantity] = useState<number>(1);
  const [editedMinPurchase, setEditedMinPurchase] = useState<number>(0);
  const [selectedGiftItem, setSelectedGiftItem] = useState<string>("");
  const [bogoDiscountPercent, setBogoDiscountPercent] = useState<number>(100);
  const [bmgmMode, setBmgmMode] = useState<"discount" | "product">("discount");
  const [bmgmDiscountPercent, setBmgmDiscountPercent] = useState<number>(100);
  const [selectedBmgmProducts, setSelectedBmgmProducts] = useState<string[]>([]);

  // Get tenant from context
  const { currentTenantId } = useTenantContext();

  // Load promotions from Supabase
  useEffect(() => {
    if (!currentTenantId) return;
    
    const loadPromotions = async () => {
      setLoading(true);
      setError(null);
      try {
        const tenantId = currentTenantId;
        const { data, error: fetchError } = await getPromotions(tenantId, {
          search: searchQuery || undefined,
          type: filterType as any || undefined,
        });

        if (fetchError) {
          setError(fetchError.message);
          toast.error(`Failed to load promotions: ${fetchError.message}`);
        } else {
          setPromotions(data || []);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        toast.error(`Failed to load promotions: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    loadPromotions();
  }, [searchQuery, filterType, currentTenantId]);

  // Handlers
  const handleToggleActive = (promotionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPromotions(prevPromotions =>
      prevPromotions.map(p =>
        p.id === promotionId ? { ...p, isActive: !p.isActive } : p
      )
    );
    toast.success("Promotion status updated");
  };

  const handleRowClick = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setIsNewPromotion(false);
    setIsEditPanelOpen(true);
    setPanelTab("setup");
    
    // Initialize all editing states from selected promotion
    setEditedName(promotion.name);
    setEditedDescription(promotion.description || "");
    setEditedCode(promotion.code);
    // Handle Date objects - convert to string for editing
    setEditedStartDate(promotion.startDate instanceof Date ? format(promotion.startDate, "yyyy-MM-dd") : String(promotion.startDate));
    setEditedEndDate(promotion.endDate instanceof Date ? format(promotion.endDate, "yyyy-MM-dd") : String(promotion.endDate));
    setEditedTarget(promotion.targetAudience || "All customers");
    setEditedType(promotion.type);
    setEditedCampaigns(promotion.campaigns || []);
    setEditedChannels(promotion.channels || []);
    setEditedStores(promotion.stores || []);
    setEditedCategories(promotion.categories || []);
    setEditedProducts(promotion.products || []);
    setEditedAttributes(promotion.attributes || []);
    setEditedStatus(promotion.status);
    setEditedPercentageValue(promotion.percentageValue || 0);
    setEditedValueAmount(promotion.valueAmount || 0);
    setEditedBuyQuantity(promotion.buyQuantity || 1);
    setEditedGetQuantity(promotion.getQuantity || 1);
    setEditedMinPurchase(promotion.minimumPurchase || 0);
    setSelectedGiftItem(promotion.freeItemId || "");
    setIsAutoApply(promotion.isAutoApply || false);
  };

  const handleSaveName = async () => {
    if (!selectedPromotion || !currentTenantId) return;
    
    if (editedName.trim() === "") {
      toast.error("Promotion name cannot be empty");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await updatePromotion(
        selectedPromotion.id as number,
        { name: editedName },
        currentTenantId
      );

      if (error) {
        toast.error(`Failed to update promotion name: ${error.message}`);
      } else {
        toast.success("Promotion name updated");
        setIsEditingName(false);
        // Refresh promotions list and update selected promotion
        const { data: refreshedPromotions } = await getPromotions(currentTenantId);
        if (refreshedPromotions) {
          setPromotions(refreshedPromotions);
          const updated = refreshedPromotions.find(p => p.id === selectedPromotion.id);
          if (updated) {
            setSelectedPromotion(updated);
            setEditedName(updated.name);
          }
        }
      }
    } catch (err) {
      toast.error("Failed to update promotion name");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDescription = async () => {
    if (!selectedPromotion || !currentTenantId) return;

    setIsSaving(true);
    try {
      const { error } = await updatePromotion(
        selectedPromotion.id as number,
        { description: editedDescription || null },
        currentTenantId
      );

      if (error) {
        toast.error(`Failed to update promotion description: ${error.message}`);
      } else {
        toast.success("Promotion description updated");
        setIsEditingDescription(false);
        // Refresh promotions list and update selected promotion
        const { data: refreshedPromotions } = await getPromotions(currentTenantId);
        if (refreshedPromotions) {
          setPromotions(refreshedPromotions);
          const updated = refreshedPromotions.find(p => p.id === selectedPromotion.id);
          if (updated) {
            setSelectedPromotion(updated);
            setEditedDescription(updated.description || "");
          }
        }
      }
    } catch (err) {
      toast.error("Failed to update promotion description");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    if (!selectedPromotion || !currentTenantId) {
      toast.error("Please select a tenant");
      return;
    }
    
    try {
      if (isNewPromotion || selectedPromotion.id === "new") {
        // Create new promotion
        const newPromotionData: Promotion = {
          ...selectedPromotion,
          name: editedName,
          description: editedDescription || undefined,
          code: isAutoApply ? "AUTO_APPLY" : editedCode,
          startDate: new Date(editedStartDate),
          endDate: new Date(editedEndDate),
          targetAudience: editedTarget,
          type: editedType as Promotion["type"],
          campaigns: editedCampaigns,
          channels: editedChannels,
          stores: editedStores,
          categories: editedCategories,
          products: editedProducts,
          attributes: editedAttributes,
          status: editedStatus,
          percentageValue: editedPercentageValue,
          valueAmount: editedValueAmount,
          buyQuantity: editedBuyQuantity,
          getQuantity: editedGetQuantity,
          minimumPurchase: editedMinPurchase,
          bogoDiscountPercent,
          bmgmMode,
          bmgmDiscountPercent,
          isAutoApply,
        };
        
        const { data: createdPromotion, error } = await createPromotion(newPromotionData, currentTenantId);
        
        if (error) {
          toast.error(`Failed to create promotion: ${error.message}`);
          return;
        }
        
        if (createdPromotion) {
          toast.success("Promotion created successfully");
          setPromotions(prev => [createdPromotion, ...prev]);
          setSelectedPromotion(createdPromotion);
          setIsNewPromotion(false);
          setIsEditPanelOpen(false);
          
          // Reload promotions to get fresh data
          const { data: refreshedPromotions } = await getPromotions(currentTenantId);
          if (refreshedPromotions) {
            setPromotions(refreshedPromotions);
          }
        }
      } else {
        // Update existing promotion
        const updateData: Partial<Promotion> = {
          name: editedName,
          description: editedDescription || undefined,
          code: isAutoApply ? "AUTO_APPLY" : editedCode,
          startDate: new Date(editedStartDate),
          endDate: new Date(editedEndDate),
          targetAudience: editedTarget,
          type: editedType as Promotion["type"],
          campaigns: editedCampaigns,
          channels: editedChannels,
          stores: editedStores,
          categories: editedCategories,
          products: editedProducts,
          attributes: editedAttributes,
          status: editedStatus,
          percentageValue: editedPercentageValue,
          valueAmount: editedValueAmount,
          buyQuantity: editedBuyQuantity,
          getQuantity: editedGetQuantity,
          minimumPurchase: editedMinPurchase,
          bogoDiscountPercent,
          bmgmMode,
          bmgmDiscountPercent,
          isAutoApply,
        };
        
        const { data: updatedPromotion, error } = await updatePromotion(
          Number(selectedPromotion.id),
          updateData,
          currentTenantId
        );
        
        if (error) {
          toast.error(`Failed to update promotion: ${error.message}`);
          return;
        }
        
        if (updatedPromotion) {
          toast.success("Promotion updated successfully");
          setPromotions(prevPromotions =>
            prevPromotions.map(p =>
              p.id === selectedPromotion.id ? updatedPromotion : p
            )
          );
          setSelectedPromotion(updatedPromotion);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      toast.error(`Failed to save promotion: ${errorMessage}`);
    }
  };

  const handleSync = () => {
    toast.success("Syncing promotion with channels...");
  };

  const handleCreateCode = () => {
    const newCode = `PROMO${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setEditedCode(newCode);
    toast.success(`New code generated: ${newCode}`);
  };

  // Filter helpers
  const getFilteredPromotions = () => {
    let filtered = promotions;
    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (filterType) {
      filtered = filtered.filter((p) => p.type === filterType);
    }
    return filtered;
  };

  const getPromotionsByStatus = (status: Promotion["status"]) => {
    if (status === "expired") {
      return getFilteredPromotions().filter((p) => p.status === status);
    }
    return promotions.filter((p) => p.status === status);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4B6BFB] mx-auto mb-4"></div>
          <p className="opacity-60">Loading promotions...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading promotions: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className={`transition-all duration-300 ${isEditPanelOpen ? 'lg:mr-[600px]' : 'mr-0'}`}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl mb-1 sm:mb-2">Promotion</h1>
              <p className="text-sm sm:text-base opacity-60">Manage and track all promotional campaigns</p>
            </div>
            <Button className="gap-2 w-full sm:w-auto" onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create Promotion</span>
              <span className="sm:hidden">Create</span>
            </Button>
          </div>

          {/* AI Banner */}
          <PromotionAIBanner />
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-4 sm:mb-6 gap-1 sm:gap-0">
            <TabsTrigger value="active" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Active</span>
              <span className="sm:hidden">Act</span>
              <span className="hidden lg:inline"> ({getPromotionsByStatus("active").length})</span>
            </TabsTrigger>
            <TabsTrigger value="scheduled" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Scheduled</span>
              <span className="sm:hidden">Sch</span>
              <span className="hidden lg:inline"> ({getPromotionsByStatus("scheduled").length})</span>
            </TabsTrigger>
            <TabsTrigger value="draft" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Draft</span>
              <span className="sm:hidden">Dft</span>
              <span className="hidden lg:inline"> ({getPromotionsByStatus("draft").length})</span>
            </TabsTrigger>
            <TabsTrigger value="expired" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Expired</span>
              <span className="sm:hidden">Exp</span>
              <span className="hidden lg:inline"> ({getPromotionsByStatus("expired").length})</span>
            </TabsTrigger>
          </TabsList>

          {/* Active Promotions */}
          <TabsContent value="active">
            {getPromotionsByStatus("active").length === 0 ? (
              <Card className="p-12 text-center border-glass-border bg-glass-bg/30 backdrop-blur-sm">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-40" />
                <p className="opacity-60">No active promotions</p>
              </Card>
            ) : (
              <PromotionTable
                promotions={getPromotionsByStatus("active")}
                onRowClick={handleRowClick}
                onToggleActive={handleToggleActive}
              />
            )}
          </TabsContent>

          {/* Scheduled Promotions */}
          <TabsContent value="scheduled">
            {getPromotionsByStatus("scheduled").length === 0 ? (
              <Card className="p-12 text-center border-glass-border bg-glass-bg/30 backdrop-blur-sm">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-40" />
                <p className="opacity-60">No scheduled promotions</p>
              </Card>
            ) : (
              <PromotionTable
                promotions={getPromotionsByStatus("scheduled")}
                onRowClick={handleRowClick}
                onToggleActive={handleToggleActive}
              />
            )}
          </TabsContent>

          {/* Draft Promotions */}
          <TabsContent value="draft">
            {getPromotionsByStatus("draft").length === 0 ? (
              <Card className="p-12 text-center border-glass-border bg-glass-bg/30 backdrop-blur-sm">
                <Edit className="w-12 h-12 mx-auto mb-4 opacity-40" />
                <p className="opacity-60">No draft promotions</p>
              </Card>
            ) : (
              <PromotionTable
                promotions={getPromotionsByStatus("draft")}
                onRowClick={handleRowClick}
                onToggleActive={handleToggleActive}
              />
            )}
          </TabsContent>

          {/* Expired Promotions */}
          <TabsContent value="expired">
            <PromotionFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterType={filterType}
              setFilterType={setFilterType}
            />
            {getPromotionsByStatus("expired").length === 0 ? (
              <Card className="p-12 text-center border-glass-border bg-glass-bg/30 backdrop-blur-sm">
                <TrendingDown className="w-12 h-12 mx-auto mb-4 opacity-40" />
                <p className="opacity-60">No expired promotions found</p>
              </Card>
            ) : (
              <PromotionTable
                promotions={getPromotionsByStatus("expired")}
                onRowClick={handleRowClick}
                onToggleActive={handleToggleActive}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Panel */}
      <Sheet open={isEditPanelOpen} onOpenChange={setIsEditPanelOpen}>
        <SheetContent className="w-full sm:max-w-2xl lg:max-w-3xl p-0 overflow-y-auto [&>button]:z-[60]" side="right">
          <div className="p-4 sm:p-6 space-y-4 pb-24">
            {selectedPromotion && (
              <>
                {/* Header */}
                <SheetHeader>
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${promotionTypeColors[selectedPromotion.type]}20` }}
                    >
                      <Tag 
                        className="w-6 h-6" 
                        style={{ color: promotionTypeColors[selectedPromotion.type] }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {isEditingName ? (
                          <div className="flex items-center gap-2 flex-1">
                            <Input
                              value={editedName}
                              onChange={(e) => setEditedName(e.target.value)}
                              className="text-xl sm:text-2xl lg:text-3xl font-semibold h-auto py-1"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleSaveName();
                                } else if (e.key === "Escape") {
                                  setIsEditingName(false);
                                  setEditedName(selectedPromotion.name);
                                }
                              }}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleSaveName}
                              disabled={isSaving}
                              className="h-8 w-8 p-0"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setIsEditingName(false);
                                setEditedName(selectedPromotion.name);
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <SheetTitle 
                            className="text-xl sm:text-2xl lg:text-3xl cursor-pointer hover:text-[#4B6BFB] transition-colors"
                            onClick={() => setIsEditingName(true)}
                          >
                            {isNewPromotion ? "New Promotion" : (editedName || selectedPromotion.name)}
                          </SheetTitle>
                        )}
                        <Select
                          value={editedStatus}
                          onValueChange={async (value) => {
                            const newStatus = value as typeof editedStatus;
                            setEditedStatus(newStatus);
                            
                            // Auto-save status change
                            if (!isNewPromotion && selectedPromotion && currentTenantId) {
                              try {
                                const { error } = await updatePromotion(
                                  selectedPromotion.id as number,
                                  { status: newStatus },
                                  currentTenantId
                                );
                                
                                if (error) {
                                  toast.error(`Failed to update status: ${error.message}`);
                                  // Revert on error
                                  setEditedStatus(selectedPromotion.status);
                                } else {
                                  toast.success("Status updated");
                                  // Refresh promotions list
                                  const { data: refreshedPromotions } = await getPromotions(currentTenantId);
                                  if (refreshedPromotions) {
                                    setPromotions(refreshedPromotions);
                                    const updated = refreshedPromotions.find(p => p.id === selectedPromotion.id);
                                    if (updated) {
                                      setSelectedPromotion(updated);
                                    }
                                  }
                                }
                              } catch (err) {
                                toast.error("Failed to update status");
                                setEditedStatus(selectedPromotion.status);
                              }
                            }
                          }}
                        >
                          <SelectTrigger 
                            className={`h-auto w-auto border-0 bg-transparent p-0 focus:ring-0 focus:ring-offset-0 ${
                              editedStatus === "active" 
                                ? "text-green-800 dark:text-green-300"
                                : editedStatus === "scheduled"
                                ? "text-blue-800 dark:text-blue-300"
                                : editedStatus === "draft"
                                ? "text-gray-800 dark:text-gray-300"
                                : editedStatus === "archived"
                                ? "text-orange-800 dark:text-orange-300"
                                : "text-red-800 dark:text-red-300"
                            }`}
                          >
                            <Badge 
                              className={`cursor-pointer ${
                                editedStatus === "active" 
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                  : editedStatus === "scheduled"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                  : editedStatus === "draft"
                                  ? "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                                  : editedStatus === "archived"
                                  ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                              }`}
                            >
                              {editedStatus.charAt(0).toUpperCase() + editedStatus.slice(1)}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent className="!bg-white dark:!bg-card border-border z-[100]">
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                            <SelectItem value="expired">Expired</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {isEditingDescription ? (
                        <div className="flex items-start gap-2 mt-2">
                          <Textarea
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                            className="text-sm min-h-[60px]"
                            autoFocus
                            placeholder="Enter promotion description..."
                            onKeyDown={(e) => {
                              if (e.key === "Escape") {
                                setIsEditingDescription(false);
                                setEditedDescription(selectedPromotion.description || "");
                              }
                            }}
                          />
                          <div className="flex flex-col gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleSaveDescription}
                              disabled={isSaving}
                              className="h-8 w-8 p-0"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setIsEditingDescription(false);
                                setEditedDescription(selectedPromotion.description || "");
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <SheetDescription 
                          className="text-sm mb-0 cursor-pointer hover:text-[#4B6BFB] transition-colors min-h-[20px]"
                          onClick={() => setIsEditingDescription(true)}
                        >
                          {editedDescription || "Click to add description..."}
                        </SheetDescription>
                      )}
                    </div>
                  </div>
                </SheetHeader>

                {/* Status Control */}
                {selectedPromotion.status !== "expired" && (
                  <Card className="p-4 border-glass-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          selectedPromotion.isActive ?? true
                            ? "bg-green-100 dark:bg-green-900/30" 
                            : "bg-gray-100 dark:bg-gray-900/30"
                        }`}>
                          {selectedPromotion.isActive ?? true ? (
                            <Radio className="w-5 h-5 text-green-600 dark:text-green-400" />
                          ) : (
                            <Pause className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="mb-1">
                            {selectedPromotion.isActive ?? true ? "Promotion is Active" : "Promotion is Paused"}
                          </p>
                          <p className="text-sm opacity-60 mb-0">
                            {selectedPromotion.isActive ?? true 
                              ? "This promotion is currently running and accepting redemptions" 
                              : "This promotion is temporarily paused and not accepting redemptions"}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={selectedPromotion.isActive ?? true}
                        onCheckedChange={() => handleToggleActive(selectedPromotion.id, {} as React.MouseEvent)}
                      />
                    </div>
                  </Card>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Card className="p-3 bg-accent/30 border-glass-border">
                    <p className="text-xs opacity-60 mb-1">Redemptions</p>
                    <p className="text-xl sm:text-2xl mb-0">{selectedPromotion.redemptions.toLocaleString()}</p>
                  </Card>
                  <Card className="p-3 bg-accent/30 border-glass-border">
                    <p className="text-xs opacity-60 mb-1">Revenue Impact</p>
                    <p className="text-xl sm:text-2xl mb-0">{selectedPromotion.revenue}</p>
                  </Card>
                </div>

                {/* Tabs */}
                <Tabs value={panelTab} onValueChange={setPanelTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 gap-1">
                    <TabsTrigger value="setup" className="text-xs sm:text-sm">Setup</TabsTrigger>
                    <TabsTrigger value="product" className="text-xs sm:text-sm">Products</TabsTrigger>
                    <TabsTrigger value="report" className="text-xs sm:text-sm">Report</TabsTrigger>
                  </TabsList>

                  <TabsContent value="setup">
                    <PromotionSetupTab
                      selectedPromotion={selectedPromotion}
                      editingField={editingField}
                      setEditingField={setEditingField}
                      editedType={editedType}
                      setEditedType={setEditedType}
                      editedCode={editedCode}
                      setEditedCode={setEditedCode}
                      isAutoApply={isAutoApply}
                      setIsAutoApply={setIsAutoApply}
                      editedStartDate={editedStartDate}
                      setEditedStartDate={setEditedStartDate}
                      editedEndDate={editedEndDate}
                      setEditedEndDate={setEditedEndDate}
                      editedCampaigns={editedCampaigns}
                      setEditedCampaigns={setEditedCampaigns}
                      editedTarget={editedTarget}
                      setEditedTarget={setEditedTarget}
                      editedChannels={editedChannels}
                      setEditedChannels={setEditedChannels}
                      editedStores={editedStores}
                      setEditedStores={setEditedStores}
                      tenantId={currentTenantId || undefined}
                      editedPercentageValue={editedPercentageValue}
                      setEditedPercentageValue={setEditedPercentageValue}
                      editedValueAmount={editedValueAmount}
                      setEditedValueAmount={setEditedValueAmount}
                      editedBuyQuantity={editedBuyQuantity}
                      setEditedBuyQuantity={setEditedBuyQuantity}
                      editedGetQuantity={editedGetQuantity}
                      setEditedGetQuantity={setEditedGetQuantity}
                      editedMinPurchase={editedMinPurchase}
                      setEditedMinPurchase={setEditedMinPurchase}
                      bogoDiscountPercent={bogoDiscountPercent}
                      setBogoDiscountPercent={setBogoDiscountPercent}
                      bmgmMode={bmgmMode}
                      setBmgmMode={setBmgmMode}
                      bmgmDiscountPercent={bmgmDiscountPercent}
                      setBmgmDiscountPercent={setBmgmDiscountPercent}
                      selectedBmgmProducts={selectedBmgmProducts}
                      handleCreateCode={handleCreateCode}
                      handleSync={handleSync}
                      handleSave={handleSave}
                    />
                  </TabsContent>

                  <TabsContent value="product">
                    <PromotionProductsTab
                      editedType={editedType}
                      editedBuyQuantity={editedBuyQuantity}
                      editedGetQuantity={editedGetQuantity}
                      bogoDiscountPercent={bogoDiscountPercent}
                      bmgmMode={bmgmMode}
                      editingField={editingField}
                      setEditingField={setEditingField}
                      selectedGiftItem={selectedGiftItem}
                      setSelectedGiftItem={setSelectedGiftItem}
                      selectedBmgmProducts={selectedBmgmProducts}
                      setSelectedBmgmProducts={setSelectedBmgmProducts}
                      editedProducts={editedProducts}
                      setEditedProducts={setEditedProducts}
                      editedCategories={editedCategories}
                      setEditedCategories={setEditedCategories}
                      editedAttributes={editedAttributes}
                      setEditedAttributes={setEditedAttributes}
                      excludedProducts={excludedProducts}
                      setExcludedProducts={setExcludedProducts}
                      excludedCategories={excludedCategories}
                      setExcludedCategories={setExcludedCategories}
                      excludedAttributes={excludedAttributes}
                      setExcludedAttributes={setExcludedAttributes}
                      ruleLogic={ruleLogic}
                      setRuleLogic={setRuleLogic}
                      handleSync={handleSync}
                      handleSave={handleSave}
                    />
                  </TabsContent>

                  <TabsContent value="report">
                    <PromotionReportTab selectedPromotion={selectedPromotion} />
                  </TabsContent>
                </Tabs>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Create Dialog */}
      <PromotionCreateDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onAiGenerate={(mode, data) => {
          console.log("AI Generate:", mode, data);
          toast.success("AI is generating your promotion...");
        }}
        onManualCreate={() => {
          // Create empty promotion for manual setup
          const newPromotion: Promotion = {
            id: "new",
            name: "",
            code: "",
            type: "percentage",
            status: "draft",
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            isActive: false,
            redemptions: 0,
            percentageValue: 0,
            valueAmount: 0,
            buyQuantity: 1,
            getQuantity: 1,
            bogoDiscountPercent: 100,
            bmgmMode: "discount",
            bmgmDiscountPercent: 0,
            minimumPurchase: 0,
            maxDiscount: null,
            targetAudience: "",
            description: "",
            isAutoApply: false,
            channels: [],
            products: [],
            categories: [],
            attributes: [],
            campaigns: [],
          };
          setSelectedPromotion(newPromotion);
          setIsNewPromotion(true);
          setIsEditPanelOpen(true);
          setPanelTab("setup");
          setIsCreateDialogOpen(false);
          
          // Initialize editing states for new promotion
          setEditedName("");
          setEditedDescription("");
          setIsEditingName(false);
          setIsEditingDescription(false);
          setEditedCode("");
          setEditedStartDate(format(new Date(), "yyyy-MM-dd"));
          setEditedEndDate(format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"));
          setEditedTarget("All customers");
          setEditedType("percentage");
          setEditedCampaigns([]);
          setEditedChannels([]);
          setEditedStores([]);
          setEditedCategories([]);
          setEditedProducts([]);
          setEditedAttributes([]);
          setEditedStatus("draft");
          setEditedPercentageValue(0);
          setEditedValueAmount(0);
          setEditedBuyQuantity(1);
          setEditedGetQuantity(1);
          setEditedMinPurchase(0);
          setSelectedGiftItem("");
          setIsAutoApply(false);
        }}
      />
    </div>
  );
}
