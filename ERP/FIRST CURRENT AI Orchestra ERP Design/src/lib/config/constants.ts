/**
 * Static Data & Options Configuration
 * All dropdown options, filter values, and constants
 */

import { 
  CustomerStatus, 
  CustomerStage, 
  CustomerPriority, 
  CustomerRank, 
  CustomerEmotion,
  CustomerBadge,
  EmotionGroup,
  CampaignStatus,
  CampaignType,
  UserRole,
} from "./enums";

// ============================================
// CRM CONSTANTS
// ============================================

export const CUSTOMER_STATUSES = [
  { value: CustomerStatus.New, label: "New" },
  { value: CustomerStatus.Potential, label: "Potential" },
  { value: CustomerStatus.AwaitingPayment, label: "Awaiting Payment" },
  { value: CustomerStatus.Converted, label: "Converted" },
  { value: CustomerStatus.Ordered, label: "Ordered" },
  { value: CustomerStatus.ReEngaged, label: "Re-engaged" },
  { value: CustomerStatus.Inactive30, label: "Inactive 30 Days" },
  { value: CustomerStatus.Inactive90, label: "Inactive 90 Days" },
  { value: CustomerStatus.Lost, label: "Lost" },
] as const;

export const CUSTOMER_STAGES = [
  { value: CustomerStage.Awareness, label: "1. Awareness", order: 1, percentage: null },
  { value: CustomerStage.Engagement, label: "2. Engagement", order: 2, percentage: null },
  { value: CustomerStage.Interest, label: "3. Interest", order: 3, percentage: null },
  { value: CustomerStage.Consideration, label: "4. Consideration", order: 4, percentage: 40 },
  { value: CustomerStage.TrustBuilding, label: "5. Trust Building", order: 5, percentage: null },
  { value: CustomerStage.Decision, label: "6. Decision", order: 6, percentage: 60 },
  { value: CustomerStage.PendingPayment, label: "7. Pending Payment", order: 7, percentage: 90 },
  { value: CustomerStage.Purchase, label: "8. Purchase", order: 8, percentage: null },
  { value: CustomerStage.Retention, label: "9. Retention", order: 9, percentage: null },
  { value: CustomerStage.PostPurchaseSupport, label: "10. Post-Purchase Support", order: 10, percentage: null },
] as const;

export const CUSTOMER_PRIORITIES = [
  { value: CustomerPriority.Low, label: "Low", weight: 1 },
  { value: CustomerPriority.Medium, label: "Medium", weight: 2 },
  { value: CustomerPriority.High, label: "High", weight: 3 },
  { value: CustomerPriority.Urgent, label: "Urgent", weight: 4 },
] as const;

export const CUSTOMER_RANKS = [
  { value: CustomerRank.New, label: "New", description: "New customers", order: 1 },
  { value: CustomerRank.First, label: "First", description: "First-time purchasers", order: 2 },
  { value: CustomerRank.Repeat, label: "Repeat", description: "Repeat customers", order: 3 },
  { value: CustomerRank.Loyal, label: "Loyal", description: "Loyal customers", order: 4 },
  { value: CustomerRank.VIP, label: "VIP", description: "VIP customers", order: 5 },
  { value: CustomerRank.VVIP, label: "VVIP", description: "Very VIP customers", order: 6 },
] as const;

export const CUSTOMER_EMOTIONS = [
  // Positive emotions
  { value: CustomerEmotion.InterestedPleasant, label: "😊 Interested / Pleasant", group: "Positive", score: 8 },
  { value: CustomerEmotion.ExcitedLoving, label: "😍 Excited / Loving", group: "Positive", score: 10 },
  { value: CustomerEmotion.RelievedComfortable, label: "😌 Relieved / Comfortable", group: "Positive", score: 7 },
  { value: CustomerEmotion.HappySatisfied, label: "🥳 Happy / Satisfied", group: "Positive", score: 9 },
  { value: CustomerEmotion.GratefulAppreciative, label: "🤗 Grateful / Appreciative", group: "Positive", score: 9 },
  { value: CustomerEmotion.ProudConfident, label: "🫶 Proud / Confident", group: "Positive", score: 8 },
  { value: CustomerEmotion.CaringTrusting, label: "💬 Caring / Trusting", group: "Positive", score: 8 },
  // Negative emotions
  { value: CustomerEmotion.Angry, label: "😡 Angry", group: "Negative", score: 1 },
  { value: CustomerEmotion.AnnoyedIrritated, label: "😤 Annoyed / Irritated", group: "Negative", score: 2 },
  { value: CustomerEmotion.Disappointed, label: "😕 Disappointed", group: "Negative", score: 3 },
  { value: CustomerEmotion.HesitantUnsure, label: "🤔 Hesitant / Unsure", group: "Negative", score: 4 },
  { value: CustomerEmotion.NervousDoubtful, label: "😬 Nervous / Doubtful", group: "Negative", score: 3 },
  // Neutral emotions
  { value: CustomerEmotion.NeutralUnclear, label: "😐 Neutral / Unclear", group: "Neutral", score: 5 },
  { value: CustomerEmotion.DisengagedCold, label: "💤 Disengaged / Cold", group: "Neutral", score: 4 },
] as const;

// Emotion groups for filtering
export const EMOTION_GROUPS = [
  { value: "Positive", label: "Positive", count: 7 },
  { value: "Negative", label: "Negative", count: 5 },
  { value: "Neutral", label: "Neutral", count: 2 },
] as const;

export const CUSTOMER_BADGES = [
  { value: CustomerBadge.VIP, label: "VIP" },
  { value: CustomerBadge.New, label: "New" },
  { value: CustomerBadge.Returning, label: "Returning" },
  { value: CustomerBadge.AtRisk, label: "At Risk" },
] as const;

// Contact Methods
export const CONTACT_METHODS = [
  { value: "hebes-jewelry-meta", label: "Hebes Jewelry (Meta)", platform: "meta" },
  { value: "hebes-by-chloe-meta", label: "Hebes by Chloe (Meta)", platform: "meta" },
  { value: "ritamie-meta", label: "Ritamie (Meta)", platform: "meta" },
  { value: "ebes-meta", label: "Ebes (Meta)", platform: "meta" },
  { value: "hebesbychloe-ig", label: "HebesbyChloe (IG)", platform: "instagram" },
  { value: "phone", label: "Phone", platform: "phone" },
  { value: "email", label: "Email", platform: "email" },
] as const;

// Sales Representatives (Sample Data)
export const SALES_REPS = [
  { value: "sarah-chen", label: "Sarah Chen" },
  { value: "john-smith", label: "John Smith" },
  { value: "emma-wilson", label: "Emma Wilson" },
  { value: "michael-brown", label: "Michael Brown" },
  { value: "olivia-davis", label: "Olivia Davis" },
] as const;

// ============================================
// CAMPAIGN CONSTANTS
// ============================================

export const CAMPAIGN_STATUSES = [
  { value: CampaignStatus.Draft, label: "Draft" },
  { value: CampaignStatus.Scheduled, label: "Scheduled" },
  { value: CampaignStatus.InProgress, label: "In Progress" },
  { value: CampaignStatus.Completed, label: "Completed" },
  { value: CampaignStatus.Paused, label: "Paused" },
  { value: CampaignStatus.Cancelled, label: "Cancelled" },
] as const;

export const CAMPAIGN_TYPES = [
  { value: CampaignType.Email, label: "Email Marketing", icon: "Mail" },
  { value: CampaignType.Social, label: "Social Media", icon: "Share2" },
  { value: CampaignType.PPC, label: "PPC Advertising", icon: "DollarSign" },
  { value: CampaignType.Content, label: "Content Marketing", icon: "FileText" },
  { value: CampaignType.SEO, label: "SEO", icon: "Search" },
  { value: CampaignType.Influencer, label: "Influencer", icon: "Users" },
] as const;

// ============================================
// USER/TEAM CONSTANTS
// ============================================

export const USER_ROLES = [
  { value: UserRole.MasterAdmin, label: "Master Admin", color: "purple" },
  { value: UserRole.Marketing, label: "Marketing", color: "pink" },
  { value: UserRole.SalesTeam, label: "Sales Team", color: "blue" },
  { value: UserRole.OperationTeam, label: "Operation Team", color: "green" },
  { value: UserRole.AdministrationTeam, label: "Administration Team", color: "orange" },
  { value: UserRole.HR, label: "HR", color: "cyan" },
  { value: UserRole.Accounting, label: "Accounting", color: "yellow" },
] as const;

// ============================================
// TIME FILTER CONSTANTS
// ============================================

export const TIME_FILTERS = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "last-7-days", label: "Last 7 Days" },
  { value: "last-30-days", label: "Last 30 Days" },
  { value: "this-month", label: "This Month" },
  { value: "last-month", label: "Last Month" },
  { value: "this-quarter", label: "This Quarter" },
  { value: "this-year", label: "This Year" },
  { value: "custom", label: "Custom Range" },
] as const;

// ============================================
// DATE FILTER CONSTANTS
// ============================================

export const DATE_FILTERS = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "7-days", label: "Last 7 Days" },
  { value: "this-week", label: "This Week" },
  { value: "this-month", label: "This Month" },
  { value: "last-3-months", label: "Last 3 Months" },
  { value: "last-6-months", label: "Last 6 Months" },
  { value: "this-year", label: "This Year" },
] as const;

// ============================================
// PAGINATION CONSTANTS
// ============================================

export const PAGINATION = {
  defaultPageSize: 10,
  pageSizeOptions: [10, 25, 50, 100],
  maxPagesShown: 5,
} as const;

// ============================================
// CURRENCY & FORMAT CONSTANTS
// ============================================

export const CURRENCIES = [
  { value: "USD", label: "USD ($)", symbol: "$" },
  { value: "EUR", label: "EUR (€)", symbol: "€" },
  { value: "GBP", label: "GBP (£)", symbol: "£" },
  { value: "JPY", label: "JPY (¥)", symbol: "¥" },
  { value: "THB", label: "THB (฿)", symbol: "฿" },
] as const;

export const DATE_FORMATS = {
  short: "MMM DD",              // Oct 27
  medium: "MMM DD, YYYY",       // Oct 27, 2025
  long: "MMMM DD, YYYY",        // October 27, 2025
  time: "HH:mm",                // 14:30
  dateTime: "MMM DD, YYYY HH:mm", // Oct 27, 2025 14:30
} as const;

// ============================================
// WORKSPACE / SHIFT CONSTANTS
// ============================================

export type ShiftType = "Night" | "Morning" | "Office Hours" | "Full" | "Evening" | "Custom";

export interface ShiftConfig {
  type: ShiftType;
  label: string;
  startHour: number;
  endHour: number;
  duration: number;
  color: string;
  timeRange: string;
}

export const SHIFT_TYPES: Record<ShiftType, ShiftConfig> = {
  "Night": {
    type: "Night",
    label: "Night",
    startHour: 0,
    endHour: 7,
    duration: 7,
    color: "bg-slate-500",
    timeRange: "12:00 AM - 7:00 AM"
  },
  "Morning": {
    type: "Morning",
    label: "Morning",
    startHour: 7,
    endHour: 14,
    duration: 7,
    color: "bg-sky-500",
    timeRange: "7:00 AM - 2:00 PM"
  },
  "Office Hours": {
    type: "Office Hours",
    label: "Office Hours",
    startHour: 8,
    endHour: 17,
    duration: 9,
    color: "bg-ai-blue",
    timeRange: "8:00 AM - 5:00 PM"
  },
  "Full": {
    type: "Full",
    label: "Full",
    startHour: 7,
    endHour: 16,
    duration: 9,
    color: "bg-emerald-500",
    timeRange: "7:00 AM - 4:00 PM"
  },
  "Evening": {
    type: "Evening",
    label: "Evening",
    startHour: 18,
    endHour: 24,
    duration: 6,
    color: "bg-violet-500",
    timeRange: "6:00 PM - 12:00 AM"
  },
  "Custom": {
    type: "Custom",
    label: "Custom",
    startHour: 9,
    endHour: 17,
    duration: 8,
    color: "bg-orange-500",
    timeRange: "Custom Hours"
  }
} as const;

// Shift Requirements by Team
export interface ShiftRequirement {
  team: string;
  morning: number;      // 6am-12pm (4 people = 100%)
  afternoon: number;    // 12pm-6pm
  evening: number;      // 6pm-12am
  night: number;        // 12am-6am
}

export const SHIFT_REQUIREMENTS: Record<string, ShiftRequirement> = {
  "All": {
    team: "All",
    morning: 4,
    afternoon: 4,
    evening: 3,
    night: 2,
  },
  "Sales": {
    team: "Sales",
    morning: 3,
    afternoon: 4,
    evening: 2,
    night: 1,
  },
  "Customer Service": {
    team: "Customer Service",
    morning: 3,
    afternoon: 3,
    evening: 3,
    night: 2,
  },
  "Operations": {
    team: "Operations",
    morning: 4,
    afternoon: 4,
    evening: 2,
    night: 1,
  },
  "Marketing": {
    team: "Marketing",
    morning: 2,
    afternoon: 3,
    evening: 1,
    night: 0,
  },
  "HR": {
    team: "HR",
    morning: 2,
    afternoon: 2,
    evening: 1,
    night: 0,
  },
} as const;

// ============================================
// TIMESHEET STATUS CONSTANTS
// ============================================

export type TimesheetStatus = "in-progress" | "completed" | "late" | "missed" | "no-show";

export interface TimesheetStatusConfig {
  value: TimesheetStatus;
  label: string;
  color: string;
  icon: string;
  description: string;
}

export const TIMESHEET_STATUSES: Record<TimesheetStatus, TimesheetStatusConfig> = {
  "in-progress": {
    value: "in-progress",
    label: "In Progress",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-500/30",
    icon: "Clock",
    description: "Employee has clocked in and shift is active"
  },
  "completed": {
    value: "completed",
    label: "Completed",
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-500/30",
    icon: "CheckCircle",
    description: "Shift completed successfully"
  },
  "late": {
    value: "late",
    label: "Late",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-500/30",
    icon: "AlertCircle",
    description: "Clocked in after scheduled start time"
  },
  "missed": {
    value: "missed",
    label: "Missed",
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-500/30",
    icon: "XCircle",
    description: "Did not clock in for scheduled shift"
  },
  "no-show": {
    value: "no-show",
    label: "No Show",
    color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400 border-gray-500/30",
    icon: "CircleSlash",
    description: "Did not show up for shift without notice"
  }
} as const;

export type AdjustmentRequestStatus = "none" | "pending" | "approved" | "rejected";

export interface AdjustmentRequestConfig {
  value: AdjustmentRequestStatus;
  label: string;
  color: string;
  description: string;
}

export const ADJUSTMENT_REQUEST_STATUSES: Record<AdjustmentRequestStatus, AdjustmentRequestConfig> = {
  "none": {
    value: "none",
    label: "No Request",
    color: "text-muted-foreground",
    description: "No adjustment request"
  },
  "pending": {
    value: "pending",
    label: "Pending Review",
    color: "text-amber-600 dark:text-amber-400",
    description: "Adjustment request pending admin review"
  },
  "approved": {
    value: "approved",
    label: "Approved",
    color: "text-green-600 dark:text-green-400",
    description: "Adjustment request approved"
  },
  "rejected": {
    value: "rejected",
    label: "Rejected",
    color: "text-red-600 dark:text-red-400",
    description: "Adjustment request rejected"
  }
} as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get label from value in a constants array
 */
export function getLabelFromValue<T extends readonly { value: any; label: string }[]>(
  constants: T,
  value: any
): string {
  const found = constants.find(item => item.value === value);
  return found?.label || value;
}

/**
 * Get all values from a constants array
 */
export function getValues<T extends readonly { value: any }[]>(
  constants: T
): T[number]["value"][] {
  return constants.map(item => item.value);
}

/**
 * Check if value exists in constants
 */
export function isValidValue<T extends readonly { value: any }[]>(
  constants: T,
  value: any
): boolean {
  return constants.some(item => item.value === value);
}
