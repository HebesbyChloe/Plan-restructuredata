"use client";

import { useState, useEffect } from "react";
import { Eye, Calendar, ShoppingCart, Target, Construction } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog";
import { Button } from "../../ui/button";
import {
  KeyMetricsCards,
  CustomerGrowthChart,
  BehaviorInsightsGrid,
  TopProductCategoriesCard,
  CustomerSegmentsCharts,
  PurchaseFrequencyChart,
  BehaviorCharts,
  CustomerJourneyFunnel,
  JourneyMetricsCards,
  CustomerInsightsFilter,
} from "../../Modules/CRM";
import {
  customerMetrics,
  customerSegmentData,
  monthlyTrendData,
  purchaseFrequencyData,
  customerJourneyData,
  behaviorInsights,
  topProductCategories,
} from "../../../sampledata/computed";
import { subDays } from "date-fns";

// Add icons to behavior insights
const behaviorInsightsWithIcons = behaviorInsights.map((insight) => {
  let icon;
  switch (insight.id) {
    case 1:
      icon = Eye;
      break;
    case 2:
      icon = Calendar;
      break;
    case 3:
      icon = ShoppingCart;
      break;
    case 4:
      icon = Target;
      break;
    default:
      icon = Eye;
  }
  return { ...insight, icon };
});

export function CustomerInsightsPage() {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [channelFilter, setChannelFilter] = useState("all");
  const [showDevDialog, setShowDevDialog] = useState(false);

  // Show dialog on mount
  useEffect(() => {
    setShowDevDialog(true);
  }, []);

  return (
    <>
      {/* Under Development Dialog */}
      <AlertDialog open={showDevDialog} onOpenChange={setShowDevDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-ai-blue/20 to-purple-500/20 flex items-center justify-center">
                <Construction className="w-8 h-8 text-ai-blue" />
              </div>
            </div>
            <AlertDialogTitle className="text-center">
              Under Development
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Customer Insights page is currently under development. 
              <br />
              <span className="inline-block mt-2">
                <strong className="text-ai-blue">Coming Soon!</strong>
              </span>
              <br />
              <span className="text-xs text-muted-foreground mt-2 inline-block">
                You can preview the layout and components below.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center">
            <Button
              onClick={() => setShowDevDialog(false)}
              className="bg-ai-blue hover:bg-ai-blue/90"
            >
              Got it, thanks!
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="space-y-8 max-w-[1600px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">Customer Insights</h1>
          <p className="text-muted-foreground">
            Deep dive into customer behavior, trends, and analytics
          </p>
        </div>
        <CustomerInsightsFilter
          dateRange={dateRange}
          setDateRange={setDateRange}
          channelFilter={channelFilter}
          setChannelFilter={setChannelFilter}
        />
      </div>

      {/* Key Metrics */}
      <KeyMetricsCards data={customerMetrics} />

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
          <TabsTrigger value="journey">Journey</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <CustomerGrowthChart data={monthlyTrendData} />
          <BehaviorInsightsGrid insights={behaviorInsightsWithIcons} />
          <TopProductCategoriesCard categories={topProductCategories} />
        </TabsContent>

        {/* Segments Tab */}
        <TabsContent value="segments" className="space-y-6">
          <CustomerSegmentsCharts segments={customerSegmentData} />
          <PurchaseFrequencyChart data={purchaseFrequencyData} />
        </TabsContent>

        {/* Behavior Tab */}
        <TabsContent value="behavior" className="space-y-6">
          <BehaviorCharts trendData={monthlyTrendData} />
        </TabsContent>

        {/* Journey Tab */}
        <TabsContent value="journey" className="space-y-6">
          <CustomerJourneyFunnel data={customerJourneyData} />
          <JourneyMetricsCards />
        </TabsContent>
      </Tabs>
    </div>
    </>
  );
}
