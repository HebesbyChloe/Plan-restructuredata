"use client";

/**
 * AutomationControlPage
 * 
 * Comprehensive automation management page for AI Orchestra ERP.
 * 
 * Features:
 * - 6 tabs: AI & Flows, External Templates, Internal Templates, Store APIs, Shipping APIs, Settings
 * - Quick stats dashboard (Active Flows, Runs Today, Connections, Templates)
 * - AI orchestration controls with master switch
 * - Automation rules management
 * - Template management (external and internal)
 * - API connection management (store and shipping)
 * 
 * Access: Fulfilment → Automation Control
 */

import { useState } from "react";
import { Button } from "../../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import {
  Bot,
  Mail,
  FileText,
  Store,
  Truck,
  Settings,
  Plus,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import {
  AutomationStatsCardsModule,
  AIControlsCardModule,
  AutomationRulesListModule,
  TemplateCardsGridModule,
  ConnectionCardsListModule,
} from "../../Modules/Fulfillment";
import {
  mockAutomationStats,
  mockAutomationRules,
  mockExternalTemplates,
  mockInternalTemplates,
  mockStoreConnections,
  mockShippingConnections,
} from "../../../sampledata/automationData";

export default function AutomationControlPage() {
  const [activeTab, setActiveTab] = useState("ai-flows");
  
  // AI Controls State
  const [aiEnabled, setAiEnabled] = useState(true);
  const [autoAllocateInventory, setAutoAllocateInventory] = useState(true);
  const [autoAssignShipping, setAutoAssignShipping] = useState(false);
  const [autoSendNotifications, setAutoSendNotifications] = useState(true);

  // Action Handlers
  const handleCreateAutomation = () => {
    toast.info("Create automation dialog would open here");
  };

  const handleNewRule = () => {
    toast.info("Create new automation rule");
  };

  const handleToggleRule = (ruleId: string) => {
    toast.success(`Toggled rule ${ruleId}`);
  };

  const handleEditRule = (ruleId: string) => {
    toast.info(`Edit rule ${ruleId}`);
  };

  const handleNewTemplate = () => {
    toast.info("Create new template");
  };

  const handleEditTemplate = (templateId: string) => {
    toast.info(`Edit template ${templateId}`);
  };

  const handleCopyTemplate = (templateId: string) => {
    toast.success(`Template ${templateId} copied`);
  };

  const handleDeleteTemplate = (templateId: string) => {
    toast.error(`Delete template ${templateId}`);
  };

  const handleAddConnection = () => {
    toast.info("Add new connection");
  };

  const handleConfigureConnection = (connectionId: string) => {
    toast.info(`Configure connection ${connectionId}`);
  };

  const handleSyncConnection = (connectionId: string) => {
    toast.success(`Syncing connection ${connectionId}...`);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header */}
      <div className="flex-shrink-0 p-6 pb-5 border-b border-border/50 bg-background/95 backdrop-blur-lg">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4B6BFB] flex items-center justify-center shadow-lg shadow-[#4B6BFB]/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="mb-0">Automation Control</h1>
              <p className="text-sm text-muted-foreground mb-0">
                Manage AI workflows, templates, and API integrations
              </p>
            </div>
          </div>

          <Button
            className="gap-2 bg-[#4B6BFB] hover:bg-[#4B6BFB]/90 text-white shadow-md"
            onClick={handleCreateAutomation}
          >
            <Plus className="w-4 h-4" />
            Create Automation
          </Button>
        </div>

        {/* Quick Stats */}
        <AutomationStatsCardsModule
          activeFlows={mockAutomationStats.activeFlows}
          runsToday={mockAutomationStats.runsToday}
          connections={mockAutomationStats.connections}
          templates={mockAutomationStats.templates}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden p-6 pt-4">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="h-full flex flex-col"
        >
          <TabsList className="grid w-full grid-cols-6 mb-4 bg-muted/50 backdrop-blur-sm p-1">
            <TabsTrigger
              value="ai-flows"
              className="data-[state=active]:bg-[#4B6BFB] data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
            >
              <Bot className="w-4 h-4 mr-2" />
              AI & Flows
            </TabsTrigger>
            <TabsTrigger
              value="external-templates"
              className="data-[state=active]:bg-[#4B6BFB] data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
            >
              <Mail className="w-4 h-4 mr-2" />
              External
            </TabsTrigger>
            <TabsTrigger
              value="internal-templates"
              className="data-[state=active]:bg-[#4B6BFB] data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
            >
              <FileText className="w-4 h-4 mr-2" />
              Internal
            </TabsTrigger>
            <TabsTrigger
              value="store-apis"
              className="data-[state=active]:bg-[#4B6BFB] data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
            >
              <Store className="w-4 h-4 mr-2" />
              Store APIs
            </TabsTrigger>
            <TabsTrigger
              value="shipping-apis"
              className="data-[state=active]:bg-[#4B6BFB] data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
            >
              <Truck className="w-4 h-4 mr-2" />
              Shipping
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-[#4B6BFB] data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* AI & Flows Tab */}
          <TabsContent
            value="ai-flows"
            className="flex-1 overflow-y-auto mt-0 space-y-4"
          >
            {/* AI Controls */}
            <AIControlsCardModule
              aiEnabled={aiEnabled}
              onAiEnabledChange={setAiEnabled}
              autoAllocateInventory={autoAllocateInventory}
              onAutoAllocateInventoryChange={setAutoAllocateInventory}
              autoAssignShipping={autoAssignShipping}
              onAutoAssignShippingChange={setAutoAssignShipping}
              autoSendNotifications={autoSendNotifications}
              onAutoSendNotificationsChange={setAutoSendNotifications}
            />

            {/* Automation Rules */}
            <AutomationRulesListModule
              rules={mockAutomationRules}
              onNewRule={handleNewRule}
              onToggleRule={handleToggleRule}
              onEditRule={handleEditRule}
            />
          </TabsContent>

          {/* External Templates Tab */}
          <TabsContent
            value="external-templates"
            className="flex-1 overflow-y-auto mt-0 space-y-4"
          >
            <TemplateCardsGridModule
              templates={mockExternalTemplates}
              description="Customer-facing communication templates"
              onNewTemplate={handleNewTemplate}
              onEditTemplate={handleEditTemplate}
              onCopyTemplate={handleCopyTemplate}
              onDeleteTemplate={handleDeleteTemplate}
            />
          </TabsContent>

          {/* Internal Templates Tab */}
          <TabsContent
            value="internal-templates"
            className="flex-1 overflow-y-auto mt-0 space-y-4"
          >
            <TemplateCardsGridModule
              templates={mockInternalTemplates}
              description="Internal documents for packing and shipping"
              onNewTemplate={handleNewTemplate}
              onEditTemplate={handleEditTemplate}
              onCopyTemplate={handleCopyTemplate}
              onDeleteTemplate={handleDeleteTemplate}
            />
          </TabsContent>

          {/* Store APIs Tab */}
          <TabsContent
            value="store-apis"
            className="flex-1 overflow-y-auto mt-0 space-y-4"
          >
            <ConnectionCardsListModule
              connections={mockStoreConnections}
              description="Connect your online stores and sales channels"
              addButtonLabel="Add Store"
              onAddConnection={handleAddConnection}
              onConfigureConnection={handleConfigureConnection}
              onSyncConnection={handleSyncConnection}
            />
          </TabsContent>

          {/* Shipping APIs Tab */}
          <TabsContent
            value="shipping-apis"
            className="flex-1 overflow-y-auto mt-0 space-y-4"
          >
            <ConnectionCardsListModule
              connections={mockShippingConnections}
              description="Connect shipping carriers for rate calculation and label generation"
              addButtonLabel="Add Carrier"
              onAddConnection={handleAddConnection}
              onConfigureConnection={handleConfigureConnection}
              onSyncConnection={handleSyncConnection}
            />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent
            value="settings"
            className="flex-1 overflow-y-auto mt-0 space-y-4"
          >
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">
                Settings configuration coming soon...
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
