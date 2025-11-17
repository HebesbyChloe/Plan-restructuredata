"use client";

import { Users, TrendingUp, AlertCircle, DollarSign } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "../../Modules/Global/PageHeader";
import { AINotificationCard } from "../../Modules/Global/AINotificationCard";
import { FilterCustomerModule } from "../../Modules/CRM/Filters/FilterCustomerModule";
import { TableCustomerModule } from "../../Modules/CRM/Insights/TableCustomerModule";
import { ClickableStatsCards, StatCardData } from "../../Modules/CRM/Stats/ClickableStatsCards";
import { mockCustomers } from "../../../sampledata/customers";

export function CustomerBoardPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [repFilter, setRepFilter] = useState("all");
  const [contactFilter, setContactFilter] = useState("all");
  const [rankFilter, setRankFilter] = useState("all");
  const [emotionFilter, setEmotionFilter] = useState("all");
  const [createdDateFilter, setCreatedDateFilter] = useState("all");
  const [selectedStatCard, setSelectedStatCard] = useState<string | null>(null);

  // Filter customers based on selected stat card
  const getFilteredCustomers = () => {
    if (!selectedStatCard) return mockCustomers;

    switch (selectedStatCard) {
      case "total-potential":
        // Filter customers with "Potential" status
        return mockCustomers.filter(c => c.status === "Potential");
      case "need-follow-up":
        // Filter customers with urgent priority
        return mockCustomers.filter(c => c.priority === "urgent" || c.priority === "high");
      case "awaiting-payment":
        // Filter customers with "Awaiting Payment" status
        return mockCustomers.filter(c => c.status === "Awaiting Payment");
      default:
        return mockCustomers;
    }
  };

  const filteredCustomers = getFilteredCustomers();

  // Calculate stats dynamically
  const potentialCustomers = mockCustomers.filter(c => c.status === "Potential");
  const totalPotential = potentialCustomers.length * 15000; // Assuming avg $15k per potential
  const needFollowUpCount = mockCustomers.filter(c => c.priority === "urgent" || c.priority === "high").length;
  const awaitingPaymentCustomers = mockCustomers.filter(c => c.status === "Awaiting Payment");
  const totalAwaitingPayment = awaitingPaymentCustomers.length * 18000; // Assuming avg $18k per order

  const stats: StatCardData[] = [
    {
      id: "total-potential",
      label: "Total Potential Revenue",
      value: `$${totalPotential.toLocaleString()}`,
      icon: TrendingUp,
      iconColor: "text-emerald-600 dark:text-emerald-400",
      iconBgColor: "bg-emerald-500/10",
      subtitle: `${potentialCustomers.length} potential customers`,
      filterValue: "Potential",
    },
    {
      id: "awaiting-payment",
      label: "Awaiting Payment Customers",
      value: `$${totalAwaitingPayment.toLocaleString()}`,
      icon: DollarSign,
      iconColor: "text-amber-600 dark:text-amber-400",
      iconBgColor: "bg-amber-500/10",
      subtitle: `${awaitingPaymentCustomers.length} customers awaiting payment`,
    },
    {
      id: "need-follow-up",
      label: "Need Follow Up",
      value: needFollowUpCount,
      icon: AlertCircle,
      iconColor: "text-orange-600 dark:text-orange-400",
      iconBgColor: "bg-orange-500/10",
      subtitle: "Urgent customer attention required",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col space-y-6">
      {/* Header */}
      <PageHeader
        icon={Users}
        title="Customer Relationship Management"
        description="Manage and track your customer journey"
        rightContent={
          <>
            <p className="opacity-60 mb-0">Total Customers</p>
            <p className="text-2xl mb-0">{mockCustomers.length}</p>
          </>
        }
      />

      {/* AI Notification Card */}
      <AINotificationCard
        title="AI Customer Insights Ready"
        message="We've analyzed customer behavior patterns and identified 3 high-priority follow-ups that could convert to sales within 24-48 hours."
        actionText="View Insights"
        onAction={() => console.log("View insights clicked")}
      />

      {/* Stats Cards */}
      <ClickableStatsCards 
        stats={stats} 
        selectedId={selectedStatCard}
        onSelect={setSelectedStatCard}
      />

      {/* Filters */}
      <FilterCustomerModule
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        stageFilter={stageFilter}
        setStageFilter={setStageFilter}
        timeFilter={timeFilter}
        setTimeFilter={setTimeFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showAdvancedFilters={showAdvancedFilters}
        setShowAdvancedFilters={setShowAdvancedFilters}
        repFilter={repFilter}
        setRepFilter={setRepFilter}
        contactFilter={contactFilter}
        setContactFilter={setContactFilter}
        rankFilter={rankFilter}
        setRankFilter={setRankFilter}
        emotionFilter={emotionFilter}
        setEmotionFilter={setEmotionFilter}
        createdDateFilter={createdDateFilter}
        setCreatedDateFilter={setCreatedDateFilter}
      />

      {/* Customer Table */}
      <TableCustomerModule customers={filteredCustomers} />
      
      {/* Filter Info */}
      {selectedStatCard && (
        <div className="fixed bottom-6 right-6 bg-[#4B6BFB] text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <span>Showing {filteredCustomers.length} of {mockCustomers.length} customers</span>
          <button 
            onClick={() => setSelectedStatCard(null)}
            className="ml-2 hover:bg-white/20 rounded px-2 py-0.5 transition-colors"
          >
            Clear Filter
          </button>
        </div>
      )}
    </div>
  );
}
