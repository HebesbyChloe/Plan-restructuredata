/**
 * Enums for Type-Safe Configuration
 * All enum types used across the application
 */

// ============================================
// CRM ENUMS
// ============================================

export enum CustomerStatus {
  New = "New",
  Potential = "Potential",
  AwaitingPayment = "Awaiting Payment",
  Converted = "Converted",
  Ordered = "Ordered",
  ReEngaged = "Re-engaged",
  Inactive30 = "Inactive30",
  Inactive90 = "Inactive90",
  Lost = "Lost",
}

export enum CustomerStage {
  Awareness = "Awareness",
  Engagement = "Engagement",
  Interest = "Interest",
  Consideration = "Consideration",
  TrustBuilding = "Trust Building",
  Decision = "Decision",
  PendingPayment = "Pending Payment",
  Purchase = "Purchase",
  Retention = "Retention",
  PostPurchaseSupport = "Post-Purchase Support",
}

export enum CustomerPriority {
  Low = "low",
  Medium = "medium",
  High = "high",
  Urgent = "urgent",
}

export enum CustomerRank {
  New = "New",
  First = "First",
  Repeat = "Repeat",
  Loyal = "Loyal",
  VIP = "VIP",
  VVIP = "VVIP",
}

export enum CustomerEmotion {
  // Positive
  InterestedPleasant = "Interested / Pleasant",
  ExcitedLoving = "Excited / Loving",
  RelievedComfortable = "Relieved / Comfortable",
  HappySatisfied = "Happy / Satisfied",
  GratefulAppreciative = "Grateful / Appreciative",
  ProudConfident = "Proud / Confident",
  CaringTrusting = "Caring / Trusting",
  // Negative
  Angry = "Angry",
  AnnoyedIrritated = "Annoyed / Irritated",
  Disappointed = "Disappointed",
  HesitantUnsure = "Hesitant / Unsure",
  NervousDoubtful = "Nervous / Doubtful",
  // Neutral
  NeutralUnclear = "Neutral / Unclear",
  DisengagedCold = "Disengaged / Cold",
}

export enum EmotionGroup {
  Positive = "Positive",
  Negative = "Negative",
  Neutral = "Neutral",
}

export enum CustomerBadge {
  VIP = "VIP",
  New = "New",
  Returning = "Returning",
  AtRisk = "At Risk",
}

// ============================================
// CAMPAIGN ENUMS
// ============================================

export enum CampaignStatus {
  Draft = "draft",
  Scheduled = "scheduled",
  InProgress = "in-progress",
  Completed = "completed",
  Paused = "paused",
  Cancelled = "cancelled",
}

export enum CampaignType {
  Email = "email",
  Social = "social",
  PPC = "ppc",
  Content = "content",
  SEO = "seo",
  Influencer = "influencer",
}

// ============================================
// ORDER ENUMS
// ============================================

export enum OrderStatus {
  Pending = "pending",
  Processing = "processing",
  Shipped = "shipped",
  Delivered = "delivered",
  Cancelled = "cancelled",
  Refunded = "refunded",
}

export enum PaymentStatus {
  Pending = "pending",
  Paid = "paid",
  Failed = "failed",
  Refunded = "refunded",
}

// ============================================
// PRODUCT ENUMS
// ============================================

export enum ProductStatus {
  Active = "active",
  Draft = "draft",
  Archived = "archived",
  OutOfStock = "out-of-stock",
}

// ============================================
// USER/HR ENUMS
// ============================================

export enum UserRole {
  MasterAdmin = "Master Admin",
  Marketing = "Marketing",
  SalesTeam = "Sales Team",
  OperationTeam = "Operation Team",
  AdministrationTeam = "Administration Team",
  HR = "HR",
  Accounting = "Accounting",
}

export enum EmployeeStatus {
  Active = "active",
  Inactive = "inactive",
  OnLeave = "on-leave",
  Terminated = "terminated",
}

// ============================================
// TASK/PROJECT ENUMS
// ============================================

export enum TaskStatus {
  Todo = "todo",
  InProgress = "in-progress",
  Review = "review",
  Done = "done",
  Blocked = "blocked",
}

export enum TaskPriority {
  Low = "low",
  Medium = "medium",
  High = "high",
  Urgent = "urgent",
}

// ============================================
// TIMESHEET ENUMS
// ============================================

export enum TimesheetStatus {
  InProgress = "in-progress",
  Completed = "completed",
  Late = "late",
  Missed = "missed",
  NoShow = "no-show",
}

export enum AdjustmentRequestStatus {
  None = "none",
  Pending = "pending",
  Approved = "approved",
  Rejected = "rejected",
}
