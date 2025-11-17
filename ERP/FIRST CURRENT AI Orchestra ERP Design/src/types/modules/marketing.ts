/**
 * Marketing Module - Centralized Type Definitions
 * All types for Marketing modules (Campaigns, Projects, Assets, etc.)
 * 
 * Updated to match database schema:
 * - Campaign types: use 'paid-ads' (not 'ads'), include 'launch'
 * - Promotion types: match database exactly ('fixed_amount', 'buy_x_get_y', etc.)
 * - Use Date objects for dates (not strings)
 * - Include brandId field
 */

import { CampaignType, CampaignStatus, CampaignPriority } from "../../constants/marketing";
import { PromotionType, PromotionStatus } from "../../constants/marketing";

// ============================================
// CAMPAIGN
// ============================================

export interface Campaign {
  id: string | number; // Can be string (from UI) or number (from DB)
  name: string;
  type: CampaignType; // 'email' | 'social' | 'paid-ads' | 'content' | 'event' | 'launch'
  status: CampaignStatus; // 'planning' | 'in-progress' | 'launching' | 'completed' | 'draft' | 'paused'
  startDate: Date; // Date object (not string)
  endDate?: Date | null; // Date object (not string)
  budget: number; // NUMERIC(12,2)
  spent: number; // NUMERIC(12,2)
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  owner: string; // Owner name (for display)
  ownerId: number; // owner_id from database
  priority: CampaignPriority; // 'high' | 'medium' | 'low'
  progress?: number; // 0-100
  aiScore?: number | null; // 0-100
  reach?: number;
  reachGoal?: number;
  engagement?: number; // 0-100
  engagementGoal?: number; // 0-100
  channels?: string[];
  tags?: string[];
  description?: string;
  purpose?: string;
  notes?: string;
  brandId?: number | null; // brand_id from database
  tasksCompleted?: number; // Computed from related tasks
  tasksTotal?: number; // Computed from related tasks
  goals?: string[]; // Computed from campaign goals
  created_at?: string; // TIMESTAMPTZ
  updated_at?: string; // TIMESTAMPTZ
  deleted_at?: string | null; // TIMESTAMPTZ
}

// ============================================
// PROMOTION
// ============================================

export interface Promotion {
  id: string | number; // Can be string (from UI) or number (from DB)
  name: string;
  code: string;
  type: PromotionType; // 'percentage' | 'fixed_amount' | 'free_shipping' | 'buy_x_get_y' | 'buy_more_get_more'
  status: PromotionStatus; // 'active' | 'scheduled' | 'draft' | 'expired' | 'archived'
  startDate: Date; // Date object (not string)
  endDate: Date; // Date object (not string)
  isActive?: boolean;
  // Type-specific values
  percentageValue?: number | null; // For 'percentage' type
  valueAmount?: number | null; // For 'fixed_amount' type
  buyQuantity?: number | null; // For 'buy_x_get_y' type
  getQuantity?: number | null; // For 'buy_x_get_y' type
  bogoDiscountPercent?: number | null; // For 'buy_x_get_y' type
  bmgmMode?: 'discount' | 'product' | null; // For 'buy_more_get_more' type
  bmgmDiscountPercent?: number | null; // For 'buy_more_get_more' type
  minimumPurchase?: number | null;
  maxDiscount?: number | null;
  // Metrics
  redemptions: number;
  redemptionLimit?: number; // usage_limit
  revenue?: string; // Stored as text in DB
  conversionRate?: string; // Computed
  performance?: number; // Computed
  // Relationships
  channels?: string[]; // From promo_channels junction table
  products?: string[]; // From promo_products junction table
  categories?: string[]; // From promo_categories junction table
  attributes?: string[]; // From promo_attributes junction table
  campaigns?: string[]; // From promo_campaigns junction table
  stores?: string[]; // From promo_stores junction table (if exists)
  // Other
  targetAudience?: string;
  description?: string;
  isAutoApply?: boolean;
  aiScore?: number; // Computed
  created_at?: string; // TIMESTAMPTZ
  updated_at?: string; // TIMESTAMPTZ
  deleted_at?: string | null; // TIMESTAMPTZ
}

// ============================================
// PROJECT CAMPAIGN DETAIL TYPES
// ============================================

export interface Task {
  id: string;
  title: string;
  status: "pending" | "in-progress" | "completed";
  assignee: string;
  dueDate: string;
}

export interface Activity {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  details?: string;
}

export interface ProjectCampaignDetailProps {
  project: Campaign;
  onClose: () => void;
  onUpdate?: (projectData: Partial<Campaign>) => void;
}
