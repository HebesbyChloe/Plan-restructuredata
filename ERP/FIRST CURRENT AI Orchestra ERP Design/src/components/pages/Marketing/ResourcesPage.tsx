"use client";

import { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { Users, Link2, FileText, Radio, Plus } from "lucide-react";
import { motion } from "motion/react";
import { TabBar } from "../../layout";
import { TabsContent } from "../../ui/tabs";
import { toast } from "sonner";

// Import modular components
import { ResourcesFilters } from "../../Modules/Marketing/Resources/ResourcesFilters";
import { AffiliateTable } from "../../Modules/Marketing/Resources/AffiliateTable";
import { UTMTable } from "../../Modules/Marketing/Resources/UTMTable";
import { DocTable } from "../../Modules/Marketing/Resources/DocTable";
import { ChannelTable } from "../../Modules/Marketing/Resources/ChannelTable";
import {
  type Affiliate,
  type UTMLink,
  type ReferenceDoc,
  type Channel,
  type PanelMode,
  type ResourceTab,
} from "../../Modules/Marketing/Resources/resourcesData";

// Import Supabase functions
import {
  getAffiliates,
  createAffiliate,
  updateAffiliate,
  deleteAffiliate,
  getUTMLinks,
  createUTMLink,
  updateUTMLink,
  deleteUTMLink,
  getReferenceDocuments,
  createReferenceDocument,
  updateReferenceDocument,
  deleteReferenceDocument,
  getMarketingChannels,
  createMarketingChannel,
  updateMarketingChannel,
  deleteMarketingChannel,
} from "../../../lib/supabase/marketing/resources";
import { useTenantContext } from "../../../contexts/TenantContext";

// Import the detail panel component (will be created separately if needed)
import { ResourcesDetailPanel } from "../../Modules/Marketing/Resources/ResourcesDetailPanel";

export function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState<PanelMode>("view");
  const [activeTab, setActiveTab] = useState<ResourceTab>("affiliates");

  // Data states
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [utmLinks, setUtmLinks] = useState<UTMLink[]>([]);
  const [referenceDocs, setReferenceDocs] = useState<ReferenceDoc[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get tenant from context
  const { currentTenantId } = useTenantContext();

  // Selected items
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null);
  const [selectedUTM, setSelectedUTM] = useState<UTMLink | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<ReferenceDoc | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  // Form states
  const [affiliateForm, setAffiliateForm] = useState({
    name: "",
    type: "Affiliate" as "Affiliate" | "KOL" | "Influencer",
    email: "",
    platform: "",
    commissionRate: 10,
  });

  const [utmForm, setUtmForm] = useState({
    name: "",
    url: "",
    campaign: "",
    source: "",
    medium: "",
  });

  const [docForm, setDocForm] = useState({
    title: "",
    category: "",
    description: "",
  });

  const [channelForm, setChannelForm] = useState({
    name: "",
    type: "",
    platform: "",
    reach: 0,
    engagement: 0,
    budget: 0,
  });

  // Filter logic
  const filteredAffiliates = affiliates.filter((aff) =>
    aff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    aff.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUTMLinks = utmLinks.filter((link) =>
    link.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.campaign.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDocs = referenceDocs.filter((doc) =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredChannels = channels.filter((ch) =>
    ch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ch.platform.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Load data from Supabase
  useEffect(() => {
    if (!currentTenantId) return;
    
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [affiliatesResult, utmLinksResult, docsResult, channelsResult] = await Promise.all([
          getAffiliates(currentTenantId),
          getUTMLinks(currentTenantId),
          getReferenceDocuments(currentTenantId),
          getMarketingChannels(currentTenantId),
        ]);

        if (affiliatesResult.error) {
          console.error('Error loading affiliates:', affiliatesResult.error);
          toast.error('Failed to load affiliates');
        } else {
          setAffiliates(affiliatesResult.data || []);
        }

        if (utmLinksResult.error) {
          console.error('Error loading UTM links:', utmLinksResult.error);
          toast.error('Failed to load UTM links');
        } else {
          setUtmLinks(utmLinksResult.data || []);
        }

        if (docsResult.error) {
          console.error('Error loading reference documents:', docsResult.error);
          toast.error('Failed to load reference documents');
        } else {
          setReferenceDocs(docsResult.data || []);
        }

        if (channelsResult.error) {
          console.error('Error loading marketing channels:', channelsResult.error);
          toast.error('Failed to load marketing channels');
        } else {
          setChannels(channelsResult.data || []);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        toast.error(`Failed to load resources: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentTenantId]);

  // Handlers
  const handleOpenPanel = (mode: PanelMode, item?: any) => {
    setPanelMode(mode);

    if (activeTab === "affiliates") {
      if (mode === "create") {
        setSelectedAffiliate(null);
        setAffiliateForm({
          name: "",
          type: "Affiliate",
          email: "",
          platform: "",
          commissionRate: 10,
        });
      } else {
        setSelectedAffiliate(item);
        setAffiliateForm({
          name: item.name,
          type: item.type,
          email: item.email,
          platform: item.platform || "",
          commissionRate: item.commissionRate,
        });
      }
    } else if (activeTab === "utm-links") {
      if (mode === "create") {
        setSelectedUTM(null);
        setUtmForm({
          name: "",
          url: "",
          campaign: "",
          source: "",
          medium: "",
        });
      } else {
        setSelectedUTM(item);
        setUtmForm({
          name: item.name,
          url: item.url,
          campaign: item.campaign,
          source: item.source,
          medium: item.medium,
        });
      }
    } else if (activeTab === "references") {
      if (mode === "create") {
        setSelectedDoc(null);
        setDocForm({
          title: "",
          category: "",
          description: "",
        });
      } else {
        setSelectedDoc(item);
        setDocForm({
          title: item.title,
          category: item.category,
          description: item.description,
        });
      }
    } else if (activeTab === "channels") {
      if (mode === "create") {
        setSelectedChannel(null);
        setChannelForm({
          name: "",
          type: "",
          platform: "",
          reach: 0,
          engagement: 0,
          budget: 0,
        });
      } else {
        setSelectedChannel(item);
        setChannelForm({
          name: item.name,
          type: item.type,
          platform: item.platform,
          reach: item.reach,
          engagement: item.engagement,
          budget: item.budget || 0,
        });
      }
    }

    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setSelectedAffiliate(null);
    setSelectedUTM(null);
    setSelectedDoc(null);
    setSelectedChannel(null);
  };

  const handleSave = async () => {
    if (!currentTenantId) {
      toast.error("Please select a tenant");
      return;
    }
    
    try {
      if (activeTab === "affiliates") {
        if (panelMode === "create") {
          const { data, error } = await createAffiliate(currentTenantId, {
            ...affiliateForm,
            revenue: 0,
            status: "pending",
          });
          if (error) {
            toast.error(`Failed to create affiliate: ${error.message}`);
            return;
          }
          if (data) {
            setAffiliates([...affiliates, data]);
            toast.success("Affiliate added successfully");
          }
        } else if (selectedAffiliate) {
          const { data, error } = await updateAffiliate(
            Number(selectedAffiliate.id),
            affiliateForm,
            currentTenantId
          );
          if (error) {
            toast.error(`Failed to update affiliate: ${error.message}`);
            return;
          }
          if (data) {
            setAffiliates(affiliates.map((aff) => (aff.id === selectedAffiliate.id ? data : aff)));
            toast.success("Affiliate updated successfully");
          }
        }
      } else if (activeTab === "utm-links") {
        if (panelMode === "create") {
          const { data, error } = await createUTMLink(currentTenantId, {
            ...utmForm,
            shortUrl: `short.link/${Math.random().toString(36).substring(7)}`,
            clicks: 0,
            conversions: 0,
          });
          if (error) {
            toast.error(`Failed to create UTM link: ${error.message}`);
            return;
          }
          if (data) {
            setUtmLinks([...utmLinks, data]);
            toast.success("UTM link created successfully");
          }
        } else if (selectedUTM) {
          const { data, error } = await updateUTMLink(
            Number(selectedUTM.id),
            utmForm,
            currentTenantId
          );
          if (error) {
            toast.error(`Failed to update UTM link: ${error.message}`);
            return;
          }
          if (data) {
            setUtmLinks(utmLinks.map((link) => (link.id === selectedUTM.id ? data : link)));
            toast.success("UTM link updated successfully");
          }
        }
      } else if (activeTab === "references") {
        if (panelMode === "create") {
          const { data, error } = await createReferenceDocument(currentTenantId, docForm);
          if (error) {
            toast.error(`Failed to create document: ${error.message}`);
            return;
          }
          if (data) {
            setReferenceDocs([...referenceDocs, data]);
            toast.success("Document added successfully");
          }
        } else if (selectedDoc) {
          const { data, error } = await updateReferenceDocument(
            Number(selectedDoc.id),
            docForm,
            currentTenantId
          );
          if (error) {
            toast.error(`Failed to update document: ${error.message}`);
            return;
          }
          if (data) {
            setReferenceDocs(referenceDocs.map((doc) => (doc.id === selectedDoc.id ? data : doc)));
            toast.success("Document updated successfully");
          }
        }
      } else if (activeTab === "channels") {
        if (panelMode === "create") {
          const { data, error } = await createMarketingChannel(currentTenantId, {
            ...channelForm,
            status: "active",
          });
          if (error) {
            toast.error(`Failed to create channel: ${error.message}`);
            return;
          }
          if (data) {
            setChannels([...channels, data]);
            toast.success("Channel added successfully");
          }
        } else if (selectedChannel) {
          const { data, error } = await updateMarketingChannel(
            Number(selectedChannel.id),
            channelForm,
            currentTenantId
          );
          if (error) {
            toast.error(`Failed to update channel: ${error.message}`);
            return;
          }
          if (data) {
            setChannels(channels.map((ch) => (ch.id === selectedChannel.id ? data : ch)));
            toast.success("Channel updated successfully");
          }
        }
      }

      handleClosePanel();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      toast.error(`Failed to save: ${errorMessage}`);
    }
  };

  const handleDelete = async () => {
    if (!currentTenantId) {
      toast.error("Please select a tenant");
      return;
    }
    
    try {
      if (activeTab === "affiliates" && selectedAffiliate) {
        const { error } = await deleteAffiliate(Number(selectedAffiliate.id), currentTenantId);
        if (error) {
          toast.error(`Failed to delete affiliate: ${error.message}`);
          return;
        }
        setAffiliates(affiliates.filter((aff) => aff.id !== selectedAffiliate.id));
        toast.success("Affiliate deleted");
      } else if (activeTab === "utm-links" && selectedUTM) {
        const { error } = await deleteUTMLink(Number(selectedUTM.id), currentTenantId);
        if (error) {
          toast.error(`Failed to delete UTM link: ${error.message}`);
          return;
        }
        setUtmLinks(utmLinks.filter((link) => link.id !== selectedUTM.id));
        toast.success("UTM link deleted");
      } else if (activeTab === "references" && selectedDoc) {
        const { error } = await deleteReferenceDocument(Number(selectedDoc.id), currentTenantId);
        if (error) {
          toast.error(`Failed to delete document: ${error.message}`);
          return;
        }
        setReferenceDocs(referenceDocs.filter((doc) => doc.id !== selectedDoc.id));
        toast.success("Document deleted");
      } else if (activeTab === "channels" && selectedChannel) {
        const { error } = await deleteMarketingChannel(Number(selectedChannel.id), currentTenantId);
        if (error) {
          toast.error(`Failed to delete channel: ${error.message}`);
          return;
        }
        setChannels(channels.filter((ch) => ch.id !== selectedChannel.id));
        toast.success("Channel deleted");
      }
      handleClosePanel();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      toast.error(`Failed to delete: ${errorMessage}`);
    }
  };

  const tabs = [
    { value: "affiliates", label: "Affiliates & KOLs", icon: Users, count: affiliates.length },
    { value: "utm-links", label: "UTM Links", icon: Link2, count: utmLinks.length },
    { value: "references", label: "Reference Docs", icon: FileText, count: referenceDocs.length },
    { value: "channels", label: "Channels", icon: Radio, count: channels.length },
  ];

  return (
    <div className="w-full flex flex-col lg:flex-row gap-4 lg:gap-6">
      <div className="flex-1">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl mb-1 sm:mb-2">Marketing Resources</h1>
              <p className="text-sm sm:text-base opacity-60">
                Manage affiliates, UTM links, reference documents, and marketing channels
              </p>
            </div>
            <Button
              onClick={() => handleOpenPanel("create")}
              className="gap-2 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add New</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </motion.div>

        {/* Tabs */}
        <TabBar
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(value) => {
            setActiveTab(value as ResourceTab);
            setSearchTerm("");
          }}
        >
          {/* Affiliates Tab */}
          <TabsContent value="affiliates">
            <ResourcesFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placeholder="Search affiliates..."
            />
            <AffiliateTable
              affiliates={filteredAffiliates}
              onRowClick={(item) => handleOpenPanel("view", item)}
            />
          </TabsContent>

          {/* UTM Links Tab */}
          <TabsContent value="utm-links">
            <ResourcesFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placeholder="Search UTM links..."
            />
            <UTMTable
              utmLinks={filteredUTMLinks}
              onRowClick={(item) => handleOpenPanel("view", item)}
            />
          </TabsContent>

          {/* Reference Docs Tab */}
          <TabsContent value="references">
            <ResourcesFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placeholder="Search documents..."
            />
            <DocTable
              docs={filteredDocs}
              onRowClick={(item) => handleOpenPanel("view", item)}
            />
          </TabsContent>

          {/* Channels Tab */}
          <TabsContent value="channels">
            <ResourcesFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placeholder="Search channels..."
            />
            <ChannelTable
              channels={filteredChannels}
              onRowClick={(item) => handleOpenPanel("view", item)}
            />
          </TabsContent>
        </TabBar>
      </div>

      {/* Detail Panel */}
      {isPanelOpen && (
        <ResourcesDetailPanel
          mode={panelMode}
          activeTab={activeTab}
          selectedAffiliate={selectedAffiliate}
          selectedUTM={selectedUTM}
          selectedDoc={selectedDoc}
          selectedChannel={selectedChannel}
          affiliateForm={affiliateForm}
          setAffiliateForm={setAffiliateForm}
          utmForm={utmForm}
          setUtmForm={setUtmForm}
          docForm={docForm}
          setDocForm={setDocForm}
          channelForm={channelForm}
          setChannelForm={setChannelForm}
          onClose={handleClosePanel}
          onSave={handleSave}
          onDelete={handleDelete}
          onSetMode={setPanelMode}
        />
      )}
    </div>
  );
}
