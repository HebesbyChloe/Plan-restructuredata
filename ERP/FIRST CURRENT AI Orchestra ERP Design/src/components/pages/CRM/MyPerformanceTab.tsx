"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Badge } from "../../ui/badge";
import { TrendingUp } from "lucide-react";
import { EmployeePerformanceCard } from "../../Modules/Reports/EmployeePerformanceCard";
import { MonthlyMomentumCard } from "../../Modules/CRM/Stats/MonthlyMomentumCard";
import { CurrentShiftReportCard } from "../../Modules/CRM/Stats/CurrentShiftReportCard";
import { MyShiftReportsTable } from "../../Modules/CRM/Insights/MyShiftReportsTable";
import { ActiveChallengesCard } from "../../Modules/CRM/Stats/ActiveChallengesCard";
import { PointTrackingCard } from "../../Modules/CRM/Stats/PointTrackingCard";
import {
  currentEmployeePerformance,
  currentEmployeePoints,
  endShiftReports,
  pointLogs,
  challenges,
  monthlyMomentumSummary,
  currentShiftPreview,
} from "../../../sampledata/endShiftReports";
import { toast } from "sonner";

export function MyPerformanceTab() {
  const [shiftNotes, setShiftNotes] = useState("");
  const [showDetailedShifts, setShowDetailedShifts] = useState(false);
  const [showAllChallenges, setShowAllChallenges] = useState(false);

  const handleSubmitShiftReport = () => {
    if (!shiftNotes.trim()) {
      toast.error("Please add notes before submitting");
      return;
    }

    toast.success("Shift report submitted successfully!");
    setShiftNotes("");
  };

  // Safety check for data
  if (!currentEmployeePerformance || !endShiftReports || !pointLogs || !challenges) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Loading performance data...</p>
      </div>
    );
  }

  // Use monthly momentum summary
  const {
    totalRevenue,
    totalNewLeads,
    totalConverted,
    totalOrders,
    returningCustomerOrders,
    newCustomerOrders,
    returningCustomerRevenue,
    newCustomerRevenue,
    dailyRevenueGoal,
    monthlyRevenueGoal,
    daysWorked,
  } = monthlyMomentumSummary;

  const avgDailyRevenueActual = totalRevenue / daysWorked;
  const monthProgress = (totalRevenue / monthlyRevenueGoal) * 100;

  return (
    <div className="space-y-6">
      {/* Header Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Badge className="bg-gradient-to-r from-purple-500/20 to-ai-blue/20 text-ai-blue border-ai-blue/30 px-4 py-1.5">
          <TrendingUp className="w-4 h-4 mr-2" />
          Track Your Performance & Earn Rewards
        </Badge>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Performance Card & Shift Report */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Performance Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <EmployeePerformanceCard employee={currentEmployeePerformance} />
          </motion.div>

          {/* Monthly Momentum */}
          <MonthlyMomentumCard
            totalRevenue={totalRevenue}
            avgDailyRevenueActual={avgDailyRevenueActual}
            dailyRevenueGoal={dailyRevenueGoal}
            totalNewLeads={totalNewLeads}
            totalConverted={totalConverted}
            totalOrders={totalOrders}
            returningCustomerOrders={returningCustomerOrders}
            newCustomerOrders={newCustomerOrders}
            returningCustomerRevenue={returningCustomerRevenue}
            newCustomerRevenue={newCustomerRevenue}
            monthProgress={monthProgress}
            monthlyRevenueGoal={monthlyRevenueGoal}
          />

          {/* Current Shift Report Form */}
          <CurrentShiftReportCard
            shiftData={currentShiftPreview}
            shiftNotes={shiftNotes}
            onNotesChange={setShiftNotes}
            onSubmit={handleSubmitShiftReport}
          />

          {/* Shift Reports History - Table */}
          <MyShiftReportsTable
            reports={endShiftReports}
            showDetailed={showDetailedShifts}
            onToggleDetailed={setShowDetailedShifts}
          />
        </div>

        {/* Right Column - Challenges & Points */}
        <div className="space-y-6">
          {/* Active Challenges */}
          <ActiveChallengesCard
            challenges={challenges}
            showAll={showAllChallenges}
            onToggleShowAll={() => setShowAllChallenges(!showAllChallenges)}
          />

          {/* Point Tracking */}
          <PointTrackingCard pointsData={currentEmployeePoints} recentLogs={pointLogs} />
        </div>
      </div>
    </div>
  );
}
