// Computed statistics and metrics for customer analytics

export interface CustomerStats {
  totalPotentialRevenue: number;
  awaitingPayment: number;
  needFollowUp: number;
}

export interface CustomerStatusBreakdown {
  status: string;
  count: number;
  color: string;
}

export interface CustomerStageBreakdown {
  stage: string;
  count: number;
  color: string;
}

export interface CustomerSourceBreakdown {
  source: string;
  count: number;
  percentage: number;
}

// Aggregate customer statistics
export const customerStats: CustomerStats = {
  totalPotentialRevenue: 52420,
  awaitingPayment: 8,
  needFollowUp: 12,
};

// Customer status distribution
export const customerStatusBreakdown: CustomerStatusBreakdown[] = [
  { status: "High Potential", count: 15, color: "blue" },
  { status: "Need Follow Up", count: 12, color: "amber" },
  { status: "Multiple Follow Up", count: 5, color: "red" },
  { status: "Closed Won", count: 23, color: "green" },
  { status: "Closed Lost", count: 8, color: "gray" },
];

// Customer stage distribution
export const customerStageBreakdown: CustomerStageBreakdown[] = [
  { stage: "Interest", count: 18, color: "blue" },
  { stage: "Price Consider", count: 14, color: "amber" },
  { stage: "Hesitation", count: 7, color: "orange" },
  { stage: "Purchase", count: 24, color: "green" },
];

// Customer acquisition sources
export const customerSourceBreakdown: CustomerSourceBreakdown[] = [
  { source: "Instagram", count: 28, percentage: 44.4 },
  { source: "Facebook", count: 18, percentage: 28.6 },
  { source: "Website", count: 12, percentage: 19.0 },
  { source: "Referral", count: 5, percentage: 7.9 },
];

// Customer lifetime value tiers
export const customerLTVTiers = [
  { tier: "VVIP", minValue: 5000, count: 3, avgValue: 7500 },
  { tier: "VIP", minValue: 2000, count: 12, avgValue: 3200 },
  { tier: "Loyal", minValue: 1000, count: 25, avgValue: 1450 },
  { tier: "Repeat", minValue: 500, count: 38, avgValue: 720 },
  { tier: "First", minValue: 100, count: 45, avgValue: 180 },
  { tier: "New", minValue: 0, count: 52, avgValue: 0 },
];

// Monthly customer growth
export const monthlyCustomerGrowth = [
  { month: "Jan", new: 42, returning: 28, total: 70 },
  { month: "Feb", new: 38, returning: 32, total: 70 },
  { month: "Mar", new: 45, returning: 35, total: 80 },
  { month: "Apr", new: 52, returning: 38, total: 90 },
  { month: "May", new: 48, returning: 42, total: 90 },
  { month: "Jun", new: 55, returning: 45, total: 100 },
  { month: "Jul", new: 58, returning: 48, total: 106 },
  { month: "Aug", new: 62, returning: 52, total: 114 },
  { month: "Sep", new: 65, returning: 55, total: 120 },
];

// Customer retention rate by cohort
export const customerRetentionByCohort = [
  { cohort: "Q1 2025", month1: 100, month2: 85, month3: 72, month4: 65, month5: 58, month6: 52 },
  { cohort: "Q2 2025", month1: 100, month2: 88, month3: 75, month4: 68, month5: 62, month6: 55 },
  { cohort: "Q3 2025", month1: 100, month2: 90, month3: 78, month4: 70, month5: 64, month6: 58 },
];
