"use client";

import { useState } from "react";
import { Card } from "../../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { motion } from "motion/react";
import { TrendingUp, User, Users, Radio } from "lucide-react";
import {
  ConversionMetricsCard,
  WeeklyMomentumChart,
  TeamMetricsTable,
  TeamLeaderboard,
  DateRangeFilter,
  ChannelRevenueBar,
} from "../../Modules/Reports";
import {
  crmConversionMetrics,
  crmWeeklyMomentumData,
  crmMonthlyMomentumData,
  crmWeeklyStats,
  crmMonthlyStats,
  crmTeamMembers,
  channelRevenueData,
} from "../../../sampledata/computed";
import { LiveRepsPerformancePage } from "../Reports/LiveRepsPerformancePage";
import { MyPerformanceTab } from "./MyPerformanceTab";

export function PerformancePage() {
  const [activeTab, setActiveTab] = useState("my-performance");
  const [dateRange, setDateRange] = useState("7-days");
  const [channelFilter, setChannelFilter] = useState("all");

  // Dynamic data based on filter
  const isMonthlyView = dateRange === "this-month" || dateRange === "last-3-months" || dateRange === "last-6-months" || dateRange === "this-year";
  const momentumData = isMonthlyView ? crmMonthlyMomentumData : crmWeeklyMomentumData;
  const momentumStats = isMonthlyView ? crmMonthlyStats : crmWeeklyStats;
  const periodLabel = isMonthlyView ? "4-week" : "7-day";

  return (
    <div className="w-full h-full space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-border/50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h1 className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-0">
              Performance
            </h1>
          </div>
          <p className="text-muted-foreground">
            Track your CRM performance metrics and team analytics
          </p>
        </motion.div>
      </div>

      {/* Main Content with Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3 mb-6">
          <TabsTrigger value="my-performance" className="gap-2">
            <User className="w-4 h-4" />
            My Performance
          </TabsTrigger>
          <TabsTrigger value="team-performance" className="gap-2">
            <Users className="w-4 h-4" />
            Team Performance
          </TabsTrigger>
          <TabsTrigger value="live-performance" className="gap-2">
            <Radio className="w-4 h-4" />
            Live Performance
          </TabsTrigger>
        </TabsList>

        {/* My Performance Tab */}
        <TabsContent value="my-performance" className="space-y-6">
          <MyPerformanceTab />
        </TabsContent>

        {/* Team Performance Tab */}
        <TabsContent value="team-performance" className="space-y-6">
          {/* Date Range Filter - Top of page to affect all metrics */}
          <DateRangeFilter
            dateRange={dateRange}
            setDateRange={setDateRange}
            channelFilter={channelFilter}
            setChannelFilter={setChannelFilter}
          />

          {/* Channel Revenue Bar - Full Width */}
          <ChannelRevenueBar
            channels={channelRevenueData.channels}
            totalRevenue={channelRevenueData.totalRevenue}
            index={0}
          />

          {/* Sales Reps Ranking & Conversion Funnel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Reps Ranking */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-ai-blue/30 transition-all">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-violet-500/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-500" />
                  </div>
                  <h3 className="mb-0">Sales Reps Ranking</h3>
                </div>
                <TeamLeaderboard members={crmTeamMembers} />
              </Card>
            </motion.div>

            {/* Conversion Funnel */}
            <ConversionMetricsCard
              metrics={crmConversionMetrics}
              title="Conversion Funnel"
              index={1}
            />
          </div>

          {/* Performance Momentum - Full Width */}
          <div>
            <WeeklyMomentumChart
              data={momentumData}
              title="Performance Momentum"
              weekChange={momentumStats.weekChange}
              currentValue={momentumStats.currentValue}
              targetValue={momentumStats.targetValue}
              periodLabel={periodLabel}
              index={0}
            />
          </div>

          {/* Detailed Performance Metrics - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="mb-0">Detailed Performance Metrics</h3>
              </div>
              <TeamMetricsTable members={crmTeamMembers} />
            </Card>
          </motion.div>
        </TabsContent>

        {/* Live Performance Tab */}
        <TabsContent value="live-performance" className="space-y-6">
          <LiveRepsPerformancePage />
        </TabsContent>
      </Tabs>
    </div>
  );
}
