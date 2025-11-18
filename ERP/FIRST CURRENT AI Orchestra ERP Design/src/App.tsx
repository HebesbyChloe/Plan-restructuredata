"use client";

import { useState, useEffect } from "react";
import { TopNavBar, ContextualSidebar, Footer, CategoryContent } from "./components/layout";
import { AIAssistant } from "./components/AI";
import { HomePage } from "./components/HomePage";
import { CampaignCalendarPage, CampaignBoardPage, BrandHubPage, AssetLibraryPage, PromotionPage, ResourcesPage } from "./components/pages/Marketing";
import { AIFlowPage } from "./components/pages/AI";
import Inspiration from "./components/pages/Marketing/Inspiration";
import { MarketingAgentPage } from "./components/pages/Marketing";
import { CustomerBoardPage } from "./components/pages/CRM/CustomerBoardPage";
import { PerformancePage } from "./components/pages/CRM/PerformancePage";
import { ReEngageBoardPage } from "./components/pages/CRM/ReEngageBoardPage";
import { CustomerInsightsPage } from "./components/pages/CRM/CustomerInsightsPage";
import { CustomerServiceBoardPage } from "./components/pages/CRM/CustomerServiceBoardPage";
import { ReturnWarrantyBoardPage } from "./components/pages/CRM/ReturnWarrantyBoardPage";
import { SalesCRMAgentPage } from "./components/pages/CRM/SalesCRMAgentPage";
import { OrderInsightsPage, OrderBoardPage, PreOrderBoardPage, CustomizeOrderBoardPage, OrderMainPage } from "./components/pages/Orders";
import { ShippingBoardPage } from "./components/pages/Fulfillment/ShippingBoardPage";
import { ReturnManagementPage } from "./components/pages/Fulfillment/ReturnManagementPage";
import AutomationControlPage from "./components/pages/Fulfillment/AutomationControlPage";
import { ProductBoardPage } from "./components/pages/Products/ProductBoardPage";
import { MaterialBoardPage } from "./components/pages/Products/MaterialBoardPage";
import { DiamondGemstoneBoardPage } from "./components/pages/Products/DiamondGemstoneBoardPage";
import { AttributesVariantsPage } from "./components/pages/Products/AttributesVariantsPage";
import { CustomBundleBoardPage } from "./components/pages/Products/CustomBundleBoardPage";
import { PricingMatrixPage } from "./components/pages/Products/PricingMatrixPage";
import { CollectionsManagerPage } from "./components/pages/Products/CollectionsManagerPage";
import { InboundShipmentPage } from "./components/pages/Logistics/InboundShipmentPage";
import { OutboundShipmentPage } from "./components/pages/Logistics/OutboundShipmentPage";
import { PurchaseOrdersPage } from "./components/pages/Logistics/PurchaseOrdersPage";
import { ProcurementPage } from "./components/pages/Logistics/ProcurementPage";
import { VendorsSuppliersPage } from "./components/pages/Logistics/VendorsSuppliersPage";
import { ProductsMainPage } from "./components/pages/Products/ProductsMainPage";
import { ProductMainPage } from "./components/pages/Products/ProductMainPage";
import { ProductInsightsPage } from "./components/pages/Products/ProductInsightsPage";
import { LogisticsMainPage } from "./components/pages/Logistics/LogisticsMainPage";
import { LogisticsInsights } from "./components/pages/Logistics/LogisticsInsights";
import { ReportsMainPage } from "./components/pages/Reports/ReportsMainPage";
import { FulfillmentMainPage } from "./components/pages/Fulfillment/FulfillmentMainPage";
import { FulfilmentInsights } from "./components/pages/Fulfillment/FulfilmentInsights";
import {
  MyWorkSpacePage,
  ProjectsCampaignsPage,
  ShiftSchedulePage,
  TasksPage,
  TaskCalendarPage,
  TaskAnalyticsPage,
} from "./components/pages/Workspace";
import {
  AdministrationMainPage,
  UserManagementPage,
  RolePermissionPage,
  TenantManagementPage,
  CompanySettingsPage,
  AIAgentsPage,
  AutomationIntegrationPage,
  AuditLogsPage,
} from "./components/pages/Administration";
import IntroPage from "./components/IntroPage";

export default function App() {
  // Initialize all state first
  // Read default category and team from environment variables (for parallel development)
  // Each worktree can have its own .env.local to set different defaults
  const [currentCategory, setCurrentCategory] = useState(
    process.env.NEXT_PUBLIC_DEFAULT_CATEGORY || "Administration"
  );
  const [selectedTeam, setSelectedTeam] = useState(
    process.env.NEXT_PUBLIC_DEFAULT_TEAM || "Sale Team"
  );
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedSidebarItem, setSelectedSidebarItem] = useState<string | undefined>("User Management");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [sidebarCollapsedByAI, setSidebarCollapsedByAI] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  useEffect(() => {
    setMounted(true);
    // Only access localStorage on client side after mount
    if (typeof window !== 'undefined') {
      const hasSeenIntro = localStorage.getItem('amoiq-intro-seen');
      setShowIntro(!hasSeenIntro);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Auto-collapse sidebar when AI opens, restore when AI closes
  useEffect(() => {
    if (isAIAssistantOpen && !isSidebarCollapsed) {
      // AI is opening and sidebar is not collapsed - collapse it
      setIsSidebarCollapsed(true);
      setSidebarCollapsedByAI(true);
    } else if (!isAIAssistantOpen && sidebarCollapsedByAI) {
      // AI is closing and it was the one that collapsed the sidebar - restore it
      setIsSidebarCollapsed(false);
      setSidebarCollapsedByAI(false);
    }
  }, [isAIAssistantOpen, isSidebarCollapsed, sidebarCollapsedByAI]);
  
  // Show loading state instead of null to prevent white screen
  // This must come AFTER all hooks
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const handleIntroComplete = () => {
    setShowIntro(false);
    localStorage.setItem('amoiq-intro-seen', 'true');
  };

  const showSidebar = currentCategory !== "Home";

  const handleCategoryChange = (category: string) => {
    setCurrentCategory(category);
    // Auto-select sidebar items for certain categories
    if (category === "Orders") {
      setSelectedSidebarItem("Overview");
    } else if (category === "Fulfilment") {
      setSelectedSidebarItem("Overview");
    } else if (category === "Logistics") {
      setSelectedSidebarItem("Overview");
    } else if (category === "Workspace") {
      setSelectedSidebarItem("My Work Space");
    } else {
      setSelectedSidebarItem(undefined);
    }
  };

  const handleSidebarItemClick = (item: string) => {
    setSelectedSidebarItem(item);
    // Auto-collapse sidebar for specific pages
    if (item === "Shipping") {
      setIsSidebarCollapsed(true);
    } else if (isSidebarCollapsed && !sidebarCollapsedByAI) {
      // Auto-expand sidebar when navigating to other pages (unless AI collapsed it)
      setIsSidebarCollapsed(false);
    }
  };

  const renderMainContent = () => {
    if (currentCategory === "Home") {
      return <HomePage selectedTeam={selectedTeam} />;
    }
    
    // Show AI Marketing Agent when Marketing is selected but no sidebar item is chosen
    if (currentCategory === "Marketing" && !selectedSidebarItem) {
      return <MarketingAgentPage />;
    }
    
    // Show AI Sales CRM Agent when CRM is selected but no sidebar item is chosen
    if (currentCategory === "CRM" && !selectedSidebarItem) {
      return <SalesCRMAgentPage />;
    }
    
    // Show main pages when category selected but no sidebar item
    if (currentCategory === "Products" && !selectedSidebarItem) {
      return <ProductMainPage />;
    }
    
    if (currentCategory === "Orders" && !selectedSidebarItem) {
      return <OrderMainPage />;
    }
    
    if (currentCategory === "Logistics" && !selectedSidebarItem) {
      return <LogisticsMainPage />;
    }
    
    if (currentCategory === "Reports" && !selectedSidebarItem) {
      return <ReportsMainPage />;
    }
    
    if (currentCategory === "Administration" && !selectedSidebarItem) {
      return <AdministrationMainPage onNavigate={handleSidebarItemClick} />;
    }
    
    if (currentCategory === "Fulfilment" && !selectedSidebarItem) {
      return <FulfillmentMainPage onNavigate={handleSidebarItemClick} />;
    }
    
    if (selectedSidebarItem === "Overview" && currentCategory === "Fulfilment") {
      return <FulfillmentMainPage onNavigate={handleSidebarItemClick} />;
    }
    
    if (selectedSidebarItem === "Fulfilment Insights" && currentCategory === "Fulfilment") {
      return <FulfilmentInsights />;
    }
    
    if (selectedSidebarItem === "Shipping") {
      return <ShippingBoardPage />;
    }
    
    if (selectedSidebarItem === "Return") {
      return <ReturnManagementPage />;
    }
    
    if (selectedSidebarItem === "Automation Control") {
      return <AutomationControlPage />;
    }
    
    if (selectedSidebarItem === "Resources") {
      return <ResourcesPage />;
    }
    
    if (selectedSidebarItem === "Campaign Calendar") {
      return <CampaignCalendarPage />;
    }
    
    if (selectedSidebarItem === "Brand Hub") {
      return <BrandHubPage />;
    }
    
    if (selectedSidebarItem === "Campaign") {
      return <CampaignBoardPage />;
    }
    
    if (selectedSidebarItem === "Promotion") {
      return <PromotionPage />;
    }
    
    if (selectedSidebarItem === "AI Flow") {
      return <AIFlowPage department={currentCategory} />;
    }
    
    if (selectedSidebarItem === "Asset Library") {
      return <AssetLibraryPage />;
    }
    
    if (selectedSidebarItem === "Inspiration") {
      return <Inspiration />;
    }
    
    if (selectedSidebarItem === "Customer") {
      return <CustomerBoardPage />;
    }
    
    if (selectedSidebarItem === "Re-Engage") {
      return <ReEngageBoardPage />;
    }
    
    if (selectedSidebarItem === "Customer Insights") {
      return <CustomerInsightsPage />;
    }
    
    if (selectedSidebarItem === "Performance") {
      return <PerformancePage />;
    }
    
    if (selectedSidebarItem === "Overview" && currentCategory === "Orders") {
      return <OrderMainPage />;
    }
    
    if (selectedSidebarItem === "Orders") {
      return <OrderBoardPage />;
    }
    
    if (selectedSidebarItem === "Pre-Orders") {
      return <PreOrderBoardPage />;
    }
    
    if (selectedSidebarItem === "Customize Orders") {
      return <CustomizeOrderBoardPage />;
    }
    
    if (selectedSidebarItem === "Service Orders") {
      return <ReturnWarrantyBoardPage />;
    }
    
    if (selectedSidebarItem === "Customer Service") {
      return <CustomerServiceBoardPage />;
    }
    
    if (selectedSidebarItem === "Order Insights") {
      return <OrderInsightsPage />;
    }
    
    if (selectedSidebarItem === "Overview" && currentCategory === "Products") {
      return <ProductMainPage />;
    }
    
    if (selectedSidebarItem === "Product") {
      return <ProductBoardPage />;
    }
    
    if (selectedSidebarItem === "Material") {
      return <MaterialBoardPage />;
    }
    
    if (selectedSidebarItem === "Diamond & Gemstone") {
      return <DiamondGemstoneBoardPage />;
    }
    
    if (selectedSidebarItem === "Attributes & Variants") {
      return <AttributesVariantsPage />;
    }
    
    if (selectedSidebarItem === "Custom & Bundle") {
      return <CustomBundleBoardPage />;
    }
    
    if (selectedSidebarItem === "Pricing Matrix") {
      return <PricingMatrixPage />;
    }
    
    if (selectedSidebarItem === "Collections Manager") {
      return <CollectionsManagerPage />;
    }
    
    if (selectedSidebarItem === "Product Insights") {
      return <ProductInsightsPage />;
    }
    
    if (selectedSidebarItem === "Overview" && currentCategory === "Logistics") {
      return <LogisticsMainPage />;
    }
    
    if (selectedSidebarItem === "Inbound Shipments") {
      return <InboundShipmentPage />;
    }
    
    if (selectedSidebarItem === "Outbound Shipments") {
      return <OutboundShipmentPage />;
    }
    
    if (selectedSidebarItem === "Purchase Orders") {
      return <PurchaseOrdersPage />;
    }
    
    if (selectedSidebarItem === "Procurement") {
      return <ProcurementPage />;
    }
    
    if (selectedSidebarItem === "Vendors & Suppliers") {
      return <VendorsSuppliersPage />;
    }
    
    if (selectedSidebarItem === "Logistic Insights") {
      return <LogisticsInsights />;
    }
    
    if (selectedSidebarItem === "My Work Space") {
      return <MyWorkSpacePage />;
    }
    
    if (selectedSidebarItem === "My Tasks") {
      return <TasksPage />;
    }
    
    if (selectedSidebarItem === "Projects & Campaigns") {
      return <ProjectsCampaignsPage />;
    }
    
    if (selectedSidebarItem === "Task Calendar") {
      return <TaskCalendarPage />;
    }
    
    if (selectedSidebarItem === "Task Analytics") {
      return <TaskAnalyticsPage />;
    }
    
    if (selectedSidebarItem === "AI Flow" && currentCategory === "Workspace") {
      return <AIFlowPage />;
    }
    
    if (selectedSidebarItem === "Shift Schedule") {
      return <ShiftSchedulePage />;
    }
    
    if (selectedSidebarItem === "Role & Permission") {
      return <RolePermissionPage />;
    }
    
    if (selectedSidebarItem === "Tenant Management") {
      return <TenantManagementPage />;
    }
    
    if (selectedSidebarItem === "Company Settings") {
      return <CompanySettingsPage />;
    }
    
    if (selectedSidebarItem === "AI Agents") {
      return <AIAgentsPage />;
    }
    
    if (selectedSidebarItem === "Audit Logs") {
      return <AuditLogsPage />;
    }
    
    if (selectedSidebarItem === "Automation / Integration") {
      return <AutomationIntegrationPage />;
    }
    
    if (selectedSidebarItem === "User Management") {
      return <UserManagementPage />;
    }
    
    if (selectedSidebarItem === "Overview" && currentCategory === "Administration") {
      return <AdministrationMainPage onNavigate={handleSidebarItemClick} />;
    }
    
    return <CategoryContent category={currentCategory} />;
  };

  // Show intro page first
  if (showIntro) {
    return <IntroPage onComplete={handleIntroComplete} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-accent/10">
      {/* Top Navigation */}
      <TopNavBar
        currentCategory={currentCategory}
        onCategoryChange={handleCategoryChange}
        selectedTeam={selectedTeam}
        onTeamChange={setSelectedTeam}
        onAIAssistantClick={() => setIsAIAssistantOpen(true)}
        isDarkMode={isDarkMode}
        onDarkModeToggle={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Contextual Sidebar (only shown when not on Home) */}
        {showSidebar && (
          <ContextualSidebar
            category={currentCategory}
            onSidebarItemClick={handleSidebarItemClick}
            selectedSidebarItem={selectedSidebarItem}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => {
              setIsSidebarCollapsed(!isSidebarCollapsed);
              setSidebarCollapsedByAI(false); // User manually toggled, so reset AI flag
            }}
          />
        )}

        {/* Main Content - Responsive padding and margin */}
        <main 
          className={`flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto transition-all duration-300 ${
            isAIAssistantOpen ? 'lg:mr-[500px]' : 'mr-0'
          }`}
        >
          {renderMainContent()}
        </main>
      </div>

      {/* Footer - Hidden on mobile when AI is open */}
      <div className={isAIAssistantOpen ? 'hidden lg:block' : ''}>
        <Footer onAIAssistantClick={() => setIsAIAssistantOpen(true)} />
      </div>

      {/* AI Assistant */}
      <AIAssistant
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        currentCategory={currentCategory}
      />
    </div>
  );
}
