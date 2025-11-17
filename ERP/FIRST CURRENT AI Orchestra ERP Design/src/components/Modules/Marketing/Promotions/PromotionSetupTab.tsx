import { useState, useEffect } from "react";
import { Card } from "../../../ui/card";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
import { Checkbox } from "../../../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../ui/select";
import {
  Plus,
  DollarSign,
  Percent,
  Tag,
  Gift,
  ExternalLink,
  Save,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { Promotion, promotionTypeColors, promotionTypeLabels } from "./promotionData";
import { Popover, PopoverContent, PopoverTrigger } from "../../../ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../../../ui/command";
import { cn } from "../../../ui/utils";
import { getMarketingChannels } from "../../../../lib/supabase/marketing/resources";
import { getCampaigns } from "../../../../lib/supabase/marketing/campaigns";
import { useStores } from "../../../../hooks/useSystem";

interface PromotionSetupTabProps {
  selectedPromotion: Promotion;
  editingField: string | null;
  setEditingField: (field: string | null) => void;
  editedType: string;
  setEditedType: (type: string) => void;
  editedCode: string;
  setEditedCode: (code: string) => void;
  isAutoApply: boolean;
  setIsAutoApply: (value: boolean) => void;
  editedStartDate: string;
  setEditedStartDate: (date: string) => void;
  editedEndDate: string;
  setEditedEndDate: (date: string) => void;
  editedCampaigns: string[];
  setEditedCampaigns: (campaigns: string[]) => void;
  editedTarget: string;
  setEditedTarget: (target: string) => void;
  editedChannels: string[];
  setEditedChannels: (channels: string[]) => void;
  editedStores: string[];
  setEditedStores: (stores: string[]) => void;
  tenantId?: number;
  editedPercentageValue: number;
  setEditedPercentageValue: (value: number) => void;
  editedValueAmount: number;
  setEditedValueAmount: (value: number) => void;
  editedBuyQuantity: number;
  setEditedBuyQuantity: (value: number) => void;
  editedGetQuantity: number;
  setEditedGetQuantity: (value: number) => void;
  editedMinPurchase: number;
  setEditedMinPurchase: (value: number) => void;
  bogoDiscountPercent: number;
  setBogoDiscountPercent: (value: number) => void;
  bmgmMode: "discount" | "product";
  setBmgmMode: (mode: "discount" | "product") => void;
  bmgmDiscountPercent: number;
  setBmgmDiscountPercent: (value: number) => void;
  selectedBmgmProducts: string[];
  handleCreateCode: () => void;
  handleSync: () => void;
  handleSave: () => void;
}

export function PromotionSetupTab({
  selectedPromotion,
  editingField,
  setEditingField,
  editedType,
  setEditedType,
  editedCode,
  setEditedCode,
  isAutoApply,
  setIsAutoApply,
  editedStartDate,
  setEditedStartDate,
  editedEndDate,
  setEditedEndDate,
  editedCampaigns,
  setEditedCampaigns,
  editedTarget,
  setEditedTarget,
  editedChannels,
  setEditedChannels,
  editedStores,
  setEditedStores,
  tenantId,
  editedPercentageValue,
  setEditedPercentageValue,
  editedValueAmount,
  setEditedValueAmount,
  editedBuyQuantity,
  setEditedBuyQuantity,
  editedGetQuantity,
  setEditedGetQuantity,
  editedMinPurchase,
  setEditedMinPurchase,
  bogoDiscountPercent,
  setBogoDiscountPercent,
  bmgmMode,
  setBmgmMode,
  bmgmDiscountPercent,
  setBmgmDiscountPercent,
  selectedBmgmProducts,
  handleCreateCode,
  handleSync,
  handleSave,
}: PromotionSetupTabProps) {
  const [availableChannels, setAvailableChannels] = useState<Array<{ id: string; name: string }>>([]);
  const [channelsOpen, setChannelsOpen] = useState(false);
  const [loadingChannels, setLoadingChannels] = useState(false);
  
  const [availableCampaigns, setAvailableCampaigns] = useState<Array<{ id: number; name: string }>>([]);
  const [campaignsOpen, setCampaignsOpen] = useState(false);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  
  const [availableStores, setAvailableStores] = useState<Array<{ id: number; name: string }>>([]);
  const [storesOpen, setStoresOpen] = useState(false);
  const [loadingStores, setLoadingStores] = useState(false);
  
  const { stores } = useStores(tenantId || null);

  // Load channels from database
  useEffect(() => {
    if (tenantId && editingField === "channels") {
      setLoadingChannels(true);
      getMarketingChannels(tenantId)
        .then(({ data, error }) => {
          if (error) {
            console.error('Error loading channels:', error);
          } else {
            setAvailableChannels((data || []).map(ch => ({ id: ch.id, name: ch.name })));
          }
        })
        .finally(() => setLoadingChannels(false));
    }
  }, [tenantId, editingField]);

  // Load campaigns from database
  useEffect(() => {
    if (tenantId && editingField === "campaigns") {
      setLoadingCampaigns(true);
      getCampaigns(tenantId)
        .then(({ data, error }) => {
          if (error) {
            console.error('Error loading campaigns:', error);
          } else {
            setAvailableCampaigns((data || []).map(c => ({ id: c.id, name: c.name })));
          }
        })
        .finally(() => setLoadingCampaigns(false));
    }
  }, [tenantId, editingField]);

  // Load stores from database
  useEffect(() => {
    if (tenantId && editingField === "stores") {
      setLoadingStores(true);
      if (stores && stores.length > 0) {
        setAvailableStores(stores.map(s => ({ id: s.id, name: s.name })));
      }
      setLoadingStores(false);
    }
  }, [tenantId, editingField, stores]);

  const toggleChannel = (channelName: string) => {
    if (editedChannels.includes(channelName)) {
      setEditedChannels(editedChannels.filter(ch => ch !== channelName));
    } else {
      setEditedChannels([...editedChannels, channelName]);
    }
  };

  const toggleCampaign = (campaignName: string) => {
    if (editedCampaigns.includes(campaignName)) {
      setEditedCampaigns(editedCampaigns.filter(c => c !== campaignName));
    } else {
      setEditedCampaigns([...editedCampaigns, campaignName]);
    }
  };

  const toggleStore = (storeName: string) => {
    if (editedStores.includes(storeName)) {
      setEditedStores(editedStores.filter(s => s !== storeName));
    } else {
      setEditedStores([...editedStores, storeName]);
    }
  };

  return (
    <div className="space-y-4 mt-4">
      {/* Promotion Details Card */}
      <Card className="p-4 border-glass-border">
        <h4 className="mb-3">Promotion Details</h4>
        <div className="space-y-3">
          {/* Promotion Type */}
          <div className="flex items-center justify-between py-2 border-b border-border">
            <div className="flex-1">
              <Label className="text-xs opacity-60">Promotion Type</Label>
              {editingField === "type" ? (
                <Select 
                  value={editedType} 
                  onValueChange={(value) => {
                    setEditedType(value);
                    setEditingField(null); // Close editing after selection
                  }}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select promotion type" />
                  </SelectTrigger>
                  <SelectContent className="!bg-white dark:!bg-card border-border z-[100]">
                    <SelectItem value="percentage">Percentage Off</SelectItem>
                    <SelectItem value="fixed_amount">Fixed Amount Off</SelectItem>
                    <SelectItem value="buy_x_get_y">Buy X Get Y (BOGO)</SelectItem>
                    <SelectItem value="free_shipping">Free Shipping</SelectItem>
                    <SelectItem value="buy_more_get_more">Buy More Get More (BMGM)</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="mt-1 mb-0 cursor-pointer hover:text-[#4B6BFB] transition-colors" onClick={() => setEditingField("type")}>
                  {promotionTypeLabels[editedType as keyof typeof promotionTypeLabels]}
                </p>
              )}
            </div>
            <Badge 
              variant="outline" 
              style={{ 
                backgroundColor: `${promotionTypeColors[editedType as keyof typeof promotionTypeColors]}20`,
                color: promotionTypeColors[editedType as keyof typeof promotionTypeColors],
                borderColor: `${promotionTypeColors[editedType as keyof typeof promotionTypeColors]}40`
              }}
            >
              {selectedPromotion.value}
            </Badge>
          </div>

          {/* Promotion Code */}
          <div className="py-2 border-b border-border">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs opacity-60">Promotion Code</Label>
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="auto-apply" 
                  checked={isAutoApply}
                  onCheckedChange={(checked) => setIsAutoApply(checked as boolean)}
                />
                <Label htmlFor="auto-apply" className="text-xs cursor-pointer">Auto Apply</Label>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {editingField === "code" && !isAutoApply ? (
                <Input
                  value={editedCode}
                  onChange={(e) => setEditedCode(e.target.value)}
                  onBlur={() => setEditingField(null)}
                  autoFocus
                  className="flex-1"
                />
              ) : (
                <code 
                  className={`flex-1 px-3 py-2 rounded-lg bg-muted text-sm font-mono ${!isAutoApply ? 'cursor-pointer hover:bg-muted/70' : 'blur-sm select-none'} transition-all`} 
                  onClick={() => !isAutoApply && setEditingField("code")}
                >
                  {isAutoApply ? "AUTO_APPLY" : editedCode}
                </code>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleCreateCode}
                disabled={isAutoApply}
              >
                <Plus className="w-4 h-4 mr-1" />
                Create
              </Button>
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4 py-2 border-b border-border">
            <div>
              <Label className="text-xs opacity-60">Start Date</Label>
              {editingField === "startDate" ? (
                <Input
                  value={editedStartDate}
                  onChange={(e) => setEditedStartDate(e.target.value)}
                  onBlur={() => setEditingField(null)}
                  autoFocus
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 mb-0 cursor-pointer hover:text-[#4B6BFB] transition-colors" onClick={() => setEditingField("startDate")}>
                  {editedStartDate}
                </p>
              )}
            </div>
            <div>
              <Label className="text-xs opacity-60">End Date</Label>
              {editingField === "endDate" ? (
                <Input
                  value={editedEndDate}
                  onChange={(e) => setEditedEndDate(e.target.value)}
                  onBlur={() => setEditingField(null)}
                  autoFocus
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 mb-0 cursor-pointer hover:text-[#4B6BFB] transition-colors" onClick={() => setEditingField("endDate")}>
                  {editedEndDate}
                </p>
              )}
            </div>
          </div>

          {/* Campaign | Target Audience */}
          <div className="grid grid-cols-2 gap-4 py-2 border-b border-border">
            <div>
              <Label className="text-xs opacity-60">Campaign</Label>
              {editingField === "campaigns" ? (
                <Popover open={campaignsOpen} onOpenChange={setCampaignsOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={campaignsOpen}
                      className="w-full justify-between mt-1"
                    >
                      <div className="flex flex-wrap gap-1 flex-1">
                        {editedCampaigns.length > 0 ? (
                          editedCampaigns.map((campaign, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {campaign}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground">Select campaigns...</span>
                        )}
                      </div>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0 !bg-white dark:!bg-card border-border z-[100]" align="start">
                    <Command className="!bg-white dark:!bg-card">
                      <CommandInput placeholder="Search campaigns..." className="!bg-white dark:!bg-card" />
                      <CommandList className="!bg-white dark:!bg-card">
                        <CommandEmpty className="!bg-white dark:!bg-card">
                          {loadingCampaigns ? "Loading campaigns..." : "No campaigns found."}
                        </CommandEmpty>
                        <CommandGroup className="!bg-white dark:!bg-card">
                          {availableCampaigns.map((campaign) => {
                            const isSelected = editedCampaigns.includes(campaign.name);
                            return (
                              <CommandItem
                                key={campaign.id}
                                value={campaign.name}
                                onSelect={() => {
                                  toggleCampaign(campaign.name);
                                }}
                                className="!bg-white dark:!bg-card hover:!bg-muted"
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    isSelected ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {campaign.name}
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              ) : (
                <div className="flex flex-wrap gap-1 mt-1 cursor-pointer" onClick={() => setEditingField("campaigns")}>
                  {editedCampaigns.length > 0 ? (
                    editedCampaigns.map((campaign, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {campaign}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground mb-0">Click to select campaigns</p>
                  )}
                </div>
              )}
            </div>
            <div>
              <Label className="text-xs opacity-60">Target Audience</Label>
              {editingField === "target" ? (
                <Input
                  value={editedTarget}
                  onChange={(e) => setEditedTarget(e.target.value)}
                  onBlur={() => setEditingField(null)}
                  autoFocus
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 mb-0 cursor-pointer hover:text-[#4B6BFB] transition-colors" onClick={() => setEditingField("target")}>
                  {editedTarget}
                </p>
              )}
            </div>
          </div>

          {/* Channels */}
          <div className="py-2 border-b border-border">
            <Label className="text-xs opacity-60">Active Channels</Label>
            {editingField === "channels" ? (
              <Popover open={channelsOpen} onOpenChange={setChannelsOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={channelsOpen}
                    className="w-full justify-between mt-1"
                  >
                    <div className="flex flex-wrap gap-1 flex-1">
                      {editedChannels.length > 0 ? (
                        editedChannels.map((channel, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {channel}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground">Select channels...</span>
                      )}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 !bg-white dark:!bg-card border-border z-[100]" align="start">
                  <Command className="!bg-white dark:!bg-card">
                    <CommandInput placeholder="Search channels..." className="!bg-white dark:!bg-card" />
                    <CommandList className="!bg-white dark:!bg-card">
                      <CommandEmpty className="!bg-white dark:!bg-card">
                        {loadingChannels ? "Loading channels..." : "No channels found."}
                      </CommandEmpty>
                      <CommandGroup className="!bg-white dark:!bg-card">
                        {availableChannels.map((channel) => {
                          const isSelected = editedChannels.includes(channel.name);
                          return (
                            <CommandItem
                              key={channel.id}
                              value={channel.name}
                              onSelect={() => {
                                toggleChannel(channel.name);
                              }}
                              className="!bg-white dark:!bg-card hover:!bg-muted"
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  isSelected ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {channel.name}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            ) : (
              <div className="flex flex-wrap gap-1 mt-1 cursor-pointer" onClick={() => setEditingField("channels")}>
                {editedChannels.length > 0 ? (
                  editedChannels.map((channel, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {channel}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground mb-0">Click to select channels</p>
                )}
              </div>
            )}
          </div>

          {/* Stores */}
          <div className="py-2">
            <Label className="text-xs opacity-60">Apply to Stores</Label>
            {editingField === "stores" ? (
              <Popover open={storesOpen} onOpenChange={setStoresOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={storesOpen}
                    className="w-full justify-between mt-1"
                  >
                    <div className="flex flex-wrap gap-1 flex-1">
                      {editedStores.length > 0 ? (
                        editedStores.map((store, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {store}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground">Select stores...</span>
                      )}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 !bg-white dark:!bg-card border-border z-[100]" align="start">
                  <Command className="!bg-white dark:!bg-card">
                    <CommandInput placeholder="Search stores..." className="!bg-white dark:!bg-card" />
                    <CommandList className="!bg-white dark:!bg-card">
                      <CommandEmpty className="!bg-white dark:!bg-card">
                        {loadingStores ? "Loading stores..." : "No stores found."}
                      </CommandEmpty>
                      <CommandGroup className="!bg-white dark:!bg-card">
                        {availableStores.map((store) => {
                          const isSelected = editedStores.includes(store.name);
                          return (
                            <CommandItem
                              key={store.id}
                              value={store.name}
                              onSelect={() => {
                                toggleStore(store.name);
                              }}
                              className="!bg-white dark:!bg-card hover:!bg-muted"
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  isSelected ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {store.name}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            ) : (
              <div className="flex flex-wrap gap-1 mt-1 cursor-pointer" onClick={() => setEditingField("stores")}>
                {editedStores.length > 0 ? (
                  editedStores.map((store, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {store}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground mb-0">Click to select stores</p>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Type-Specific Configuration */}
      <Card className="p-4 border-glass-border bg-gradient-to-br from-[#4B6BFB]/5 to-transparent">
        <div className="flex items-center gap-2 mb-3">
          <h4 className="mb-0">Promotion Value Configuration</h4>
          <Badge 
            variant="outline" 
            style={{ 
              backgroundColor: `${promotionTypeColors[editedType as keyof typeof promotionTypeColors]}20`,
              color: promotionTypeColors[editedType as keyof typeof promotionTypeColors],
              borderColor: `${promotionTypeColors[editedType as keyof typeof promotionTypeColors]}40`
            }}
          >
            {promotionTypeLabels[editedType as keyof typeof promotionTypeLabels]}
          </Badge>
        </div>

        {/* Percentage Off */}
        {editedType === "percentage" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="percentage-value">Percentage Discount *</Label>
              <div className="flex gap-2">
                <Input 
                  id="percentage-value" 
                  type="number"
                  value={editedPercentageValue || ""}
                  onChange={(e) => setEditedPercentageValue(Number(e.target.value))}
                  placeholder="25"
                  className="border-input bg-background"
                />
                <div className="flex items-center px-3 rounded-lg border border-input bg-muted">
                  <Percent className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xs opacity-60">Enter percentage discount (e.g., 25 for 25% off)</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="min-purchase">Minimum Purchase Amount (Optional)</Label>
              <div className="flex gap-2">
                <div className="flex items-center px-3 rounded-lg border border-input bg-muted">
                  <DollarSign className="w-4 h-4" />
                </div>
                <Input 
                  id="min-purchase" 
                  type="number"
                  value={editedMinPurchase || ""}
                  onChange={(e) => setEditedMinPurchase(Number(e.target.value))}
                  placeholder="100"
                  className="border-input bg-background"
                />
              </div>
            </div>
          </div>
        )}

        {/* Value Off */}
        {editedType === "fixed_amount" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="value-amount">Fixed Discount Amount *</Label>
              <div className="flex gap-2">
                <div className="flex items-center px-3 rounded-lg border border-input bg-muted">
                  <DollarSign className="w-4 h-4" />
                </div>
                <Input 
                  id="value-amount" 
                  type="number"
                  value={editedValueAmount || ""}
                  onChange={(e) => setEditedValueAmount(Number(e.target.value))}
                  placeholder="50"
                  className="border-input bg-background"
                />
              </div>
              <p className="text-xs opacity-60">Enter fixed dollar amount off (e.g., 50 for $50 off)</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="min-purchase-value">Minimum Purchase Amount *</Label>
              <div className="flex gap-2">
                <div className="flex items-center px-3 rounded-lg border border-input bg-muted">
                  <DollarSign className="w-4 h-4" />
                </div>
                <Input 
                  id="min-purchase-value" 
                  type="number"
                  value={editedMinPurchase || ""}
                  onChange={(e) => setEditedMinPurchase(Number(e.target.value))}
                  placeholder="200"
                  className="border-input bg-background"
                />
              </div>
              <p className="text-xs opacity-60">Customer must spend at least this amount</p>
            </div>
          </div>
        )}

        {/* BOGO */}
        {editedType === "buy_x_get_y" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buy-quantity">Buy Quantity *</Label>
                <Input 
                  id="buy-quantity" 
                  type="number"
                  value={editedBuyQuantity || ""}
                  onChange={(e) => setEditedBuyQuantity(Number(e.target.value))}
                  placeholder="1"
                  className="border-input bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="get-quantity">Get Quantity *</Label>
                <Input 
                  id="get-quantity" 
                  type="number"
                  value={editedGetQuantity || ""}
                  onChange={(e) => setEditedGetQuantity(Number(e.target.value))}
                  placeholder="1"
                  className="border-input bg-background"
                />
              </div>
            </div>
            <p className="text-xs opacity-60">Example: Buy 1 Get 1, Buy 2 Get 1, etc.</p>
            
            <div className="space-y-2">
              <Label htmlFor="bogo-discount">Discount on Get Items *</Label>
              <div className="flex gap-2">
                <Input 
                  id="bogo-discount" 
                  type="number"
                  value={bogoDiscountPercent || ""}
                  onChange={(e) => setBogoDiscountPercent(Number(e.target.value))}
                  placeholder="100"
                  min="0"
                  max="100"
                  className="border-input bg-background"
                />
                <div className="flex items-center px-3 rounded-lg border border-input bg-muted">
                  <Percent className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xs opacity-60">100% = Free, 50% = Half off, 25% = Quarter off</p>
            </div>
            
            <div className="p-3 rounded-lg bg-[#4B6BFB]/10 border border-[#4B6BFB]/20">
              <p className="text-xs mb-0 text-[#4B6BFB]">
                ℹ️ Define eligible products in the <strong>Products tab</strong>
              </p>
            </div>
          </div>
        )}

        {/* BMGM */}
        {editedType === "buy_more_get_more" && (
          <div className="space-y-4">
            {/* Mode Toggle */}
            <div className="space-y-2">
              <Label>Reward Type *</Label>
              <div className="flex rounded-lg border border-input bg-background overflow-hidden">
                <button
                  onClick={() => setBmgmMode("discount")}
                  className={`flex-1 px-4 py-2 text-sm transition-colors ${
                    bmgmMode === "discount"
                      ? "bg-[#4B6BFB] text-white"
                      : "hover:bg-accent"
                  }`}
                >
                  Discount on Additional Items
                </button>
                <button
                  onClick={() => setBmgmMode("product")}
                  className={`flex-1 px-4 py-2 text-sm transition-colors ${
                    bmgmMode === "product"
                      ? "bg-[#4B6BFB] text-white"
                      : "hover:bg-accent"
                  }`}
                >
                  Free Product
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bmgm-buy">Buy Quantity *</Label>
                <Input 
                  id="bmgm-buy" 
                  type="number"
                  value={editedBuyQuantity || ""}
                  onChange={(e) => setEditedBuyQuantity(Number(e.target.value))}
                  placeholder="3"
                  className="border-input bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bmgm-get">
                  {bmgmMode === "discount" ? "Additional Items *" : "Free Product Qty *"}
                </Label>
                <Input 
                  id="bmgm-get" 
                  type="number"
                  value={editedGetQuantity || ""}
                  onChange={(e) => setEditedGetQuantity(Number(e.target.value))}
                  placeholder="1"
                  className="border-input bg-background"
                />
              </div>
            </div>
            
            {bmgmMode === "discount" ? (
              <>
                <p className="text-xs opacity-60">Example: Buy 3 Get 1 More at discount, Buy 5 Get 2 More at discount</p>
                <div className="space-y-2">
                  <Label htmlFor="bmgm-discount">Discount on Additional Items *</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="bmgm-discount" 
                      type="number"
                      value={bmgmDiscountPercent || ""}
                      onChange={(e) => setBmgmDiscountPercent(Number(e.target.value))}
                      placeholder="100"
                      min="0"
                      max="100"
                      className="border-input bg-background"
                    />
                    <div className="flex items-center px-3 rounded-lg border border-input bg-muted">
                      <Percent className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-xs opacity-60">100% = Free, 50% = Half off, 25% = Quarter off</p>
                </div>
              </>
            ) : (
              <p className="text-xs opacity-60">Example: Buy 3 Get 1 Free Product, Buy 5 Get 2 Free Products (configure free product in Products tab)</p>
            )}
          </div>
        )}

        {/* Free Items */}
        {editedType === "free_shipping" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="min-purchase-free">Minimum Purchase Amount (Optional)</Label>
              <div className="flex gap-2">
                <div className="flex items-center px-3 rounded-lg border border-input bg-muted">
                  <DollarSign className="w-4 h-4" />
                </div>
                <Input 
                  id="min-purchase-free" 
                  type="number"
                  value={editedMinPurchase || ""}
                  onChange={(e) => setEditedMinPurchase(Number(e.target.value))}
                  placeholder="100"
                  className="border-input bg-background"
                />
              </div>
              <p className="text-xs opacity-60">Minimum order value to qualify for free item</p>
            </div>
            <div className="p-3 rounded-lg bg-[#4B6BFB]/10 border border-[#4B6BFB]/20">
              <p className="text-xs mb-0 text-[#4B6BFB]">
                ℹ️ Select the free gift item in the <strong>Products tab</strong>
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Promotion Summary - BOGO */}
      {editedType === "buy_x_get_y" && editedBuyQuantity > 0 && editedGetQuantity > 0 && (
        <Card className="p-4 border-glass-border bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
              <Tag className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <h4 className="mb-2 text-orange-600">Promotion Summary</h4>
              <p className="text-sm mb-0">
                Buy <strong>{editedBuyQuantity}</strong> item{editedBuyQuantity > 1 ? 's' : ''}, 
                Get <strong>{editedGetQuantity}</strong> item{editedGetQuantity > 1 ? 's' : ''} at 
                <strong> {bogoDiscountPercent}% off</strong>
                {bogoDiscountPercent === 100 && ' (Free)'}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Promotion Summary - BMGM */}
      {editedType === "buy_more_get_more" && editedBuyQuantity > 0 && editedGetQuantity > 0 && (
        <Card className="p-4 border-glass-border bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center flex-shrink-0">
              {bmgmMode === "product" ? (
                <Gift className="w-5 h-5 text-pink-600" />
              ) : (
                <Percent className="w-5 h-5 text-pink-600" />
              )}
            </div>
            <div className="flex-1">
              <h4 className="mb-2 text-pink-600">Promotion Summary</h4>
              <p className="text-sm mb-0">
                {bmgmMode === "discount" ? (
                  <>
                    Buy <strong>{editedBuyQuantity}</strong> item{editedBuyQuantity > 1 ? 's' : ''}, 
                    Get <strong>{editedGetQuantity}</strong> more at 
                    <strong> {bmgmDiscountPercent}% off</strong>
                    {bmgmDiscountPercent === 100 && ' (Free)'}
                  </>
                ) : (
                  <>
                    Buy <strong>{editedBuyQuantity}</strong> item{editedBuyQuantity > 1 ? 's' : ''}, 
                    Get <strong>{editedGetQuantity}</strong> free product{editedGetQuantity > 1 ? 's' : ''}
                    {selectedBmgmProducts.length > 0 && (
                      <span> ({selectedBmgmProducts.join(', ')})</span>
                    )}
                  </>
                )}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Save and Sync Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          className="gap-2 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
          onClick={handleSync}
        >
          <ExternalLink className="w-4 h-4" />
          Sync
        </Button>
        <Button
          className="gap-2 h-12 bg-[#4B6BFB] hover:bg-[#4B6BFB]/90"
          onClick={handleSave}
        >
          <Save className="w-4 h-4" />
          Save
        </Button>
      </div>
    </div>
  );
}
