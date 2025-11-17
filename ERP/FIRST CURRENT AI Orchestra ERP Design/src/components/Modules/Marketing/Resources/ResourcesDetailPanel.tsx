import { Card } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { Badge } from "../../../ui/badge";
import { Textarea } from "../../../ui/textarea";
import { ScrollArea } from "../../../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../ui/select";
import { X, Copy, Upload } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import {
  type Affiliate,
  type UTMLink,
  type ReferenceDoc,
  type Channel,
  type PanelMode,
  type ResourceTab,
  getStatusColor,
} from "./resourcesData";

interface ResourcesDetailPanelProps {
  mode: PanelMode;
  activeTab: ResourceTab;
  selectedAffiliate: Affiliate | null;
  selectedUTM: UTMLink | null;
  selectedDoc: ReferenceDoc | null;
  selectedChannel: Channel | null;
  affiliateForm: {
    name: string;
    type: "Affiliate" | "KOL" | "Influencer";
    email: string;
    platform: string;
    commissionRate: number;
  };
  setAffiliateForm: (form: any) => void;
  utmForm: {
    name: string;
    url: string;
    campaign: string;
    source: string;
    medium: string;
  };
  setUtmForm: (form: any) => void;
  docForm: {
    title: string;
    category: string;
    description: string;
  };
  setDocForm: (form: any) => void;
  channelForm: {
    name: string;
    type: string;
    platform: string;
    reach: number;
    engagement: number;
    budget: number;
  };
  setChannelForm: (form: any) => void;
  onClose: () => void;
  onSave: () => void;
  onDelete: () => void;
  onSetMode: (mode: PanelMode) => void;
}

export function ResourcesDetailPanel({
  mode,
  activeTab,
  selectedAffiliate,
  selectedUTM,
  selectedDoc,
  selectedChannel,
  affiliateForm,
  setAffiliateForm,
  utmForm,
  setUtmForm,
  docForm,
  setDocForm,
  channelForm,
  setChannelForm,
  onClose,
  onSave,
  onDelete,
  onSetMode,
}: ResourcesDetailPanelProps) {
  const getPanelTitle = () => {
    if (mode === "create") {
      return `Add ${activeTab === "affiliates" ? "Affiliate" : activeTab === "utm-links" ? "UTM Link" : activeTab === "references" ? "Document" : "Channel"}`;
    }
    return mode === "edit" ? "Edit Details" : "Details";
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-[400px] flex-shrink-0"
      >
        <Card className="p-6 border-glass-border bg-glass-bg/30 backdrop-blur-sm sticky top-6 max-h-[calc(100vh-8rem)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="mb-0">{getPanelTitle()}</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <ScrollArea className="h-[calc(100vh-16rem)]">
            <div className="space-y-4 pr-4">
              {/* Affiliate Form */}
              {activeTab === "affiliates" && (
                <>
                  <div>
                    <label className="text-sm mb-2 block opacity-60">Name</label>
                    {mode === "view" ? (
                      <div>{selectedAffiliate?.name}</div>
                    ) : (
                      <Input
                        value={affiliateForm.name}
                        onChange={(e) => setAffiliateForm({ ...affiliateForm, name: e.target.value })}
                        placeholder="Partner name"
                      />
                    )}
                  </div>
                  <div>
                    <label className="text-sm mb-2 block opacity-60">Type</label>
                    {mode === "view" ? (
                      <Badge variant="outline">{selectedAffiliate?.type}</Badge>
                    ) : (
                      <Select
                        value={affiliateForm.type}
                        onValueChange={(value: "Affiliate" | "KOL" | "Influencer") =>
                          setAffiliateForm({ ...affiliateForm, type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Affiliate">Affiliate</SelectItem>
                          <SelectItem value="KOL">KOL</SelectItem>
                          <SelectItem value="Influencer">Influencer</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  <div>
                    <label className="text-sm mb-2 block opacity-60">Email</label>
                    {mode === "view" ? (
                      <div className="opacity-80">{selectedAffiliate?.email}</div>
                    ) : (
                      <Input
                        type="email"
                        value={affiliateForm.email}
                        onChange={(e) => setAffiliateForm({ ...affiliateForm, email: e.target.value })}
                        placeholder="email@example.com"
                      />
                    )}
                  </div>
                  <div>
                    <label className="text-sm mb-2 block opacity-60">Platform (Optional)</label>
                    {mode === "view" ? (
                      <div className="opacity-80">{selectedAffiliate?.platform || "—"}</div>
                    ) : (
                      <Input
                        value={affiliateForm.platform}
                        onChange={(e) => setAffiliateForm({ ...affiliateForm, platform: e.target.value })}
                        placeholder="Instagram, TikTok, etc."
                      />
                    )}
                  </div>
                  <div>
                    <label className="text-sm mb-2 block opacity-60">Commission Rate</label>
                    {mode === "view" ? (
                      <div>{selectedAffiliate?.commissionRate}%</div>
                    ) : (
                      <Input
                        type="number"
                        value={affiliateForm.commissionRate}
                        onChange={(e) => setAffiliateForm({ ...affiliateForm, commissionRate: Number(e.target.value) })}
                        min="0"
                        max="100"
                      />
                    )}
                  </div>
                  {mode === "view" && selectedAffiliate && (
                    <>
                      <div>
                        <label className="text-sm mb-2 block opacity-60">Revenue</label>
                        <div>${selectedAffiliate.revenue.toLocaleString()}</div>
                      </div>
                      <div>
                        <label className="text-sm mb-2 block opacity-60">Status</label>
                        <Badge className={getStatusColor(selectedAffiliate.status)}>
                          {selectedAffiliate.status}
                        </Badge>
                      </div>
                      <div>
                        <label className="text-sm mb-2 block opacity-60">Join Date</label>
                        <div className="opacity-80">{selectedAffiliate.joinDate}</div>
                      </div>
                    </>
                  )}
                </>
              )}

              {/* UTM Link Form */}
              {activeTab === "utm-links" && (
                <>
                  <div>
                    <label className="text-sm mb-2 block opacity-60">Link Name</label>
                    {mode === "view" ? (
                      <div>{selectedUTM?.name}</div>
                    ) : (
                      <Input
                        value={utmForm.name}
                        onChange={(e) => setUtmForm({ ...utmForm, name: e.target.value })}
                        placeholder="Holiday Campaign 2024"
                      />
                    )}
                  </div>
                  <div>
                    <label className="text-sm mb-2 block opacity-60">Base URL</label>
                    {mode === "view" ? (
                      <div className="opacity-80 break-all text-sm">{selectedUTM?.url.split('?')[0]}</div>
                    ) : (
                      <Input
                        value={utmForm.url}
                        onChange={(e) => setUtmForm({ ...utmForm, url: e.target.value })}
                        placeholder="https://example.com/products"
                      />
                    )}
                  </div>
                  <div>
                    <label className="text-sm mb-2 block opacity-60">Campaign</label>
                    {mode === "view" ? (
                      <Badge variant="outline">{selectedUTM?.campaign}</Badge>
                    ) : (
                      <Input
                        value={utmForm.campaign}
                        onChange={(e) => setUtmForm({ ...utmForm, campaign: e.target.value })}
                        placeholder="holiday2024"
                      />
                    )}
                  </div>
                  <div>
                    <label className="text-sm mb-2 block opacity-60">Source</label>
                    {mode === "view" ? (
                      <div className="opacity-80">{selectedUTM?.source}</div>
                    ) : (
                      <Input
                        value={utmForm.source}
                        onChange={(e) => setUtmForm({ ...utmForm, source: e.target.value })}
                        placeholder="newsletter"
                      />
                    )}
                  </div>
                  <div>
                    <label className="text-sm mb-2 block opacity-60">Medium</label>
                    {mode === "view" ? (
                      <div className="opacity-80">{selectedUTM?.medium}</div>
                    ) : (
                      <Input
                        value={utmForm.medium}
                        onChange={(e) => setUtmForm({ ...utmForm, medium: e.target.value })}
                        placeholder="email"
                      />
                    )}
                  </div>
                  {mode === "view" && selectedUTM && (
                    <>
                      <div>
                        <label className="text-sm mb-2 block opacity-60">Short URL</label>
                        <div className="flex items-center gap-2">
                          <code className="text-sm opacity-80">{selectedUTM.shortUrl}</code>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2"
                            onClick={() => {
                              navigator.clipboard.writeText(selectedUTM.shortUrl);
                              toast.success("Short URL copied!");
                            }}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm mb-2 block opacity-60">Full URL</label>
                        <div className="flex items-center gap-2">
                          <code className="text-xs opacity-80 break-all flex-1">{selectedUTM.url}</code>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 flex-shrink-0"
                            onClick={() => {
                              navigator.clipboard.writeText(selectedUTM.url);
                              toast.success("URL copied!");
                            }}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm mb-2 block opacity-60">Clicks</label>
                        <div>{selectedUTM.clicks.toLocaleString()}</div>
                      </div>
                      <div>
                        <label className="text-sm mb-2 block opacity-60">Conversions</label>
                        <div>{selectedUTM.conversions}</div>
                      </div>
                      <div>
                        <label className="text-sm mb-2 block opacity-60">Created</label>
                        <div className="opacity-80">{selectedUTM.createdDate}</div>
                      </div>
                    </>
                  )}
                  {mode !== "view" && utmForm.url && utmForm.campaign && utmForm.source && utmForm.medium && (
                    <div className="p-3 rounded-lg bg-accent/30">
                      <label className="text-xs opacity-60 mb-1 block">Generated URL Preview</label>
                      <code className="text-xs break-all">
                        {utmForm.url}?utm_source={utmForm.source}&utm_medium={utmForm.medium}&utm_campaign={utmForm.campaign}
                      </code>
                    </div>
                  )}
                </>
              )}

              {/* Reference Doc Form */}
              {activeTab === "references" && (
                <>
                  <div>
                    <label className="text-sm mb-2 block opacity-60">Document Title</label>
                    {mode === "view" ? (
                      <div>{selectedDoc?.title}</div>
                    ) : (
                      <Input
                        value={docForm.title}
                        onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
                        placeholder="Brand Guidelines 2025"
                      />
                    )}
                  </div>
                  <div>
                    <label className="text-sm mb-2 block opacity-60">Category</label>
                    {mode === "view" ? (
                      <Badge variant="outline">{selectedDoc?.category}</Badge>
                    ) : (
                      <Input
                        value={docForm.category}
                        onChange={(e) => setDocForm({ ...docForm, category: e.target.value })}
                        placeholder="Brand, Campaign Templates, etc."
                      />
                    )}
                  </div>
                  <div>
                    <label className="text-sm mb-2 block opacity-60">Description</label>
                    {mode === "view" ? (
                      <div className="opacity-80">{selectedDoc?.description}</div>
                    ) : (
                      <Textarea
                        value={docForm.description}
                        onChange={(e) => setDocForm({ ...docForm, description: e.target.value })}
                        placeholder="Brief description of the document..."
                        rows={3}
                      />
                    )}
                  </div>
                  {mode !== "view" && (
                    <div>
                      <label className="text-sm mb-2 block opacity-60">Upload File</label>
                      <Button variant="outline" className="w-full gap-2">
                        <Upload className="w-4 h-4" />
                        Choose File
                      </Button>
                      <p className="text-xs opacity-60 mt-1">PDF, DOC, DOCX up to 10MB</p>
                    </div>
                  )}
                  {mode === "view" && selectedDoc && (
                    <>
                      <div>
                        <label className="text-sm mb-2 block opacity-60">File Size</label>
                        <div className="opacity-80">{selectedDoc.size || "—"}</div>
                      </div>
                      <div>
                        <label className="text-sm mb-2 block opacity-60">Last Updated</label>
                        <div className="opacity-80">{selectedDoc.updatedDate}</div>
                      </div>
                    </>
                  )}
                </>
              )}

              {/* Channel Form */}
              {activeTab === "channels" && (
                <>
                  <div>
                    <label className="text-sm mb-2 block opacity-60">Channel Name</label>
                    {mode === "view" ? (
                      <div>{selectedChannel?.name}</div>
                    ) : (
                      <Input
                        value={channelForm.name}
                        onChange={(e) => setChannelForm({ ...channelForm, name: e.target.value })}
                        placeholder="Instagram Main"
                      />
                    )}
                  </div>
                  <div>
                    <label className="text-sm mb-2 block opacity-60">Channel Type</label>
                    {mode === "view" ? (
                      <Badge variant="outline">{selectedChannel?.type}</Badge>
                    ) : (
                      <Select
                        value={channelForm.type}
                        onValueChange={(value) => setChannelForm({ ...channelForm, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Social Media">Social Media</SelectItem>
                          <SelectItem value="Email Marketing">Email Marketing</SelectItem>
                          <SelectItem value="Paid Advertising">Paid Advertising</SelectItem>
                          <SelectItem value="Content Marketing">Content Marketing</SelectItem>
                          <SelectItem value="SEO">SEO</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  <div>
                    <label className="text-sm mb-2 block opacity-60">Platform</label>
                    {mode === "view" ? (
                      <div className="opacity-80">{selectedChannel?.platform}</div>
                    ) : (
                      <Input
                        value={channelForm.platform}
                        onChange={(e) => setChannelForm({ ...channelForm, platform: e.target.value })}
                        placeholder="Instagram"
                      />
                    )}
                  </div>
                  <div>
                    <label className="text-sm mb-2 block opacity-60">Reach</label>
                    {mode === "view" ? (
                      <div>{(selectedChannel!.reach / 1000).toFixed(0)}K</div>
                    ) : (
                      <Input
                        type="number"
                        value={channelForm.reach}
                        onChange={(e) => setChannelForm({ ...channelForm, reach: Number(e.target.value) })}
                        placeholder="850000"
                      />
                    )}
                  </div>
                  <div>
                    <label className="text-sm mb-2 block opacity-60">Engagement (%)</label>
                    {mode === "view" ? (
                      <div>{selectedChannel?.engagement}%</div>
                    ) : (
                      <Input
                        type="number"
                        step="0.1"
                        value={channelForm.engagement}
                        onChange={(e) => setChannelForm({ ...channelForm, engagement: Number(e.target.value) })}
                        placeholder="7.2"
                      />
                    )}
                  </div>
                  <div>
                    <label className="text-sm mb-2 block opacity-60">Monthly Budget ($)</label>
                    {mode === "view" ? (
                      <div>${selectedChannel?.budget?.toLocaleString() || "—"}</div>
                    ) : (
                      <Input
                        type="number"
                        value={channelForm.budget}
                        onChange={(e) => setChannelForm({ ...channelForm, budget: Number(e.target.value) })}
                        placeholder="5000"
                      />
                    )}
                  </div>
                  {mode === "view" && selectedChannel && (
                    <div>
                      <label className="text-sm mb-2 block opacity-60">Status</label>
                      <Badge className={getStatusColor(selectedChannel.status)}>
                        {selectedChannel.status}
                      </Badge>
                    </div>
                  )}
                </>
              )}
            </div>
          </ScrollArea>

          <div className="flex gap-2 mt-6 pt-6 border-t">
            {mode === "view" ? (
              <>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={onDelete}
                >
                  Delete
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-[#4B6BFB] to-[#6B8AFF] text-white"
                  onClick={() => onSetMode("edit")}
                >
                  Edit
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    if (mode === "create") {
                      onClose();
                    } else {
                      onSetMode("view");
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-[#4B6BFB] to-[#6B8AFF] text-white"
                  onClick={onSave}
                >
                  {mode === "create" ? "Create" : "Save"}
                </Button>
              </>
            )}
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
