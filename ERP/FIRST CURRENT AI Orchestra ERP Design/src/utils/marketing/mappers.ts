/**
 * Marketing Module - Data Mapping Utilities
 * 
 * Converts between database rows (snake_case, DATE strings) and frontend types (camelCase, Date objects)
 * 
 * IMPORTANT:
 * - Promotion table is named `promo` (not `mkt_promotions`)
 * - Dates are converted between DATE/TIMESTAMPTZ strings and Date objects
 * - No type mapping needed - frontend types match database exactly
 */

import { MktCampaignRow, MktCampaignInsert, MktCampaignUpdate, PromoRow, PromoInsert, PromoUpdate } from "../../types/database/marketing";
import { Campaign, Promotion } from "../../types/modules/marketing";

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Convert DATE string (YYYY-MM-DD) to Date object
 */
function dateStringToDate(dateStr: string | null | undefined): Date | null {
  if (!dateStr) return null;
  return new Date(dateStr);
}

/**
 * Convert Date object to DATE string (YYYY-MM-DD)
 */
function dateToDateString(date: Date | null | undefined): string | null {
  if (!date) return null;
  // Format as YYYY-MM-DD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Convert TIMESTAMPTZ string to Date object
 */
function timestamptzToDate(timestamp: string | null | undefined): Date | null {
  if (!timestamp) return null;
  return new Date(timestamp);
}

/**
 * Convert Date object to TIMESTAMPTZ string (ISO format)
 */
function dateToTimestamptz(date: Date | null | undefined): string | null {
  if (!date) return null;
  return date.toISOString();
}

// ============================================
// CAMPAIGN MAPPERS
// ============================================

/**
 * Convert database campaign row to frontend Campaign type
 */
export function mapCampaignFromDB(row: MktCampaignRow, ownerName?: string): Campaign {
  return {
    id: row.id,
    name: row.name,
    type: row.type, // No mapping needed - types match
    status: row.status, // No mapping needed - types match
    startDate: dateStringToDate(row.start_date)!,
    endDate: dateStringToDate(row.end_date),
    budget: Number(row.budget),
    spent: Number(row.spent),
    impressions: row.impressions,
    clicks: row.clicks,
    conversions: row.conversions,
    revenue: Number(row.revenue),
    owner: ownerName || `User ${row.owner_id}`, // Default if owner name not provided
    ownerId: row.owner_id,
    priority: row.priority, // No mapping needed - types match
    progress: row.progress,
    aiScore: row.ai_score,
    reach: row.reach,
    reachGoal: row.reach_goal,
    engagement: Number(row.engagement),
    engagementGoal: Number(row.engagement_goal),
    channels: row.channels || [],
    tags: row.tags || [],
    description: row.description || undefined,
    purpose: row.purpose || undefined,
    notes: row.notes || undefined,
    brandId: row.brand_id,
    created_at: row.created_at,
    updated_at: row.updated_at,
    deleted_at: row.deleted_at || undefined,
  };
}

/**
 * Convert frontend Campaign type to database insert row
 */
export function mapCampaignToDB(campaign: Partial<Campaign>): MktCampaignInsert {
  const insert: MktCampaignInsert = {
    tenant_id: 1, // TODO: Get from context/auth
    name: campaign.name!,
    type: campaign.type!,
    status: campaign.status || 'planning',
    start_date: dateToDateString(campaign.startDate!)!,
    end_date: dateToDateString(campaign.endDate),
    owner_id: campaign.ownerId!,
    budget: campaign.budget,
    spent: campaign.spent,
    impressions: campaign.impressions,
    clicks: campaign.clicks,
    conversions: campaign.conversions,
    revenue: campaign.revenue,
    priority: campaign.priority || 'medium',
    progress: campaign.progress || 0,
    reach: campaign.reach || 0,
    reach_goal: campaign.reachGoal || 0,
    engagement: campaign.engagement || 0,
    engagement_goal: campaign.engagementGoal || 0,
    channels: campaign.channels || [],
    tags: campaign.tags || [],
  };

  // Optional fields
  if (campaign.description !== undefined) insert.description = campaign.description || null;
  if (campaign.purpose !== undefined) insert.purpose = campaign.purpose || null;
  if (campaign.notes !== undefined) insert.notes = campaign.notes || null;
  if (campaign.aiScore !== undefined) insert.ai_score = campaign.aiScore;
  if (campaign.brandId !== undefined) insert.brand_id = campaign.brandId;

  return insert;
}

/**
 * Convert frontend Campaign type to database update row
 */
export function mapCampaignToDBUpdate(campaign: Partial<Campaign>): MktCampaignUpdate {
  const update: MktCampaignUpdate = {};

  if (campaign.name !== undefined) update.name = campaign.name;
  if (campaign.type !== undefined) update.type = campaign.type;
  if (campaign.status !== undefined) update.status = campaign.status;
  if (campaign.startDate !== undefined) update.start_date = dateToDateString(campaign.startDate);
  if (campaign.endDate !== undefined) update.end_date = dateToDateString(campaign.endDate);
  if (campaign.ownerId !== undefined) update.owner_id = campaign.ownerId;
  if (campaign.budget !== undefined) update.budget = campaign.budget;
  if (campaign.spent !== undefined) update.spent = campaign.spent;
  if (campaign.impressions !== undefined) update.impressions = campaign.impressions;
  if (campaign.clicks !== undefined) update.clicks = campaign.clicks;
  if (campaign.conversions !== undefined) update.conversions = campaign.conversions;
  if (campaign.revenue !== undefined) update.revenue = campaign.revenue;
  if (campaign.priority !== undefined) update.priority = campaign.priority;
  if (campaign.progress !== undefined) update.progress = campaign.progress;
  if (campaign.reach !== undefined) update.reach = campaign.reach;
  if (campaign.reachGoal !== undefined) update.reach_goal = campaign.reachGoal;
  if (campaign.engagement !== undefined) update.engagement = campaign.engagement;
  if (campaign.engagementGoal !== undefined) update.engagement_goal = campaign.engagementGoal;
  if (campaign.channels !== undefined) update.channels = campaign.channels || null;
  if (campaign.tags !== undefined) update.tags = campaign.tags || null;
  if (campaign.description !== undefined) update.description = campaign.description || null;
  if (campaign.purpose !== undefined) update.purpose = campaign.purpose || null;
  if (campaign.notes !== undefined) update.notes = campaign.notes || null;
  if (campaign.aiScore !== undefined) update.ai_score = campaign.aiScore;
  if (campaign.brandId !== undefined) update.brand_id = campaign.brandId;
  if (campaign.updated_at !== undefined) update.updated_at = campaign.updated_at;

  return update;
}

// ============================================
// PROMOTION MAPPERS
// ============================================

/**
 * Convert database promo row to frontend Promotion type
 * IMPORTANT: Uses `promo` table (not `mkt_promotions`)
 */
export function mapPromotionFromDB(row: PromoRow): Promotion {
  return {
    id: row.id,
    name: row.name,
    code: row.code,
    type: row.type, // No mapping needed - types match
    status: row.status, // No mapping needed - types match
    startDate: dateStringToDate(row.start_date) || new Date(),
    endDate: dateStringToDate(row.end_date) || new Date(),
    isActive: row.is_active,
    percentageValue: row.percentage_value !== null ? Number(row.percentage_value) : null,
    valueAmount: row.value_amount !== null ? Number(row.value_amount) : null,
    buyQuantity: row.buy_quantity,
    getQuantity: row.get_quantity,
    bogoDiscountPercent: row.bogo_discount_percent,
    bmgmMode: row.bmgm_mode,
    bmgmDiscountPercent: row.bmgm_discount_percent,
    minimumPurchase: row.minimum_purchase !== null ? Number(row.minimum_purchase) : null,
    maxDiscount: row.max_discount !== null ? Number(row.max_discount) : null,
    redemptions: row.redemptions,
    redemptionLimit: row.usage_limit,
    revenue: row.revenue || undefined,
    targetAudience: row.target_audience || undefined,
    description: row.description || undefined,
    isAutoApply: row.is_auto_apply,
    created_at: row.created_at,
    updated_at: row.updated_at,
    deleted_at: row.deleted_at || undefined,
  };
}

/**
 * Convert frontend Promotion type to database insert row
 * IMPORTANT: Inserts into `promo` table (not `mkt_promotions`)
 */
export function mapPromotionToDB(promotion: Partial<Promotion>): PromoInsert {
  const insert: PromoInsert = {
    tenant_id: 1, // TODO: Get from context/auth
    name: promotion.name!,
    code: promotion.code!,
    type: promotion.type!,
    status: promotion.status || 'draft',
    start_date: dateToDateString(promotion.startDate!)!,
    end_date: dateToDateString(promotion.endDate!)!,
    is_active: promotion.isActive !== undefined ? promotion.isActive : true,
    redemptions: promotion.redemptions || 0,
    used_count: 0, // Default
  };

  // Optional fields
  if (promotion.percentageValue !== undefined) insert.percentage_value = promotion.percentageValue;
  if (promotion.valueAmount !== undefined) insert.value_amount = promotion.valueAmount;
  if (promotion.buyQuantity !== undefined) insert.buy_quantity = promotion.buyQuantity;
  if (promotion.getQuantity !== undefined) insert.get_quantity = promotion.getQuantity;
  if (promotion.bogoDiscountPercent !== undefined) insert.bogo_discount_percent = promotion.bogoDiscountPercent;
  if (promotion.bmgmMode !== undefined) insert.bmgm_mode = promotion.bmgmMode;
  if (promotion.bmgmDiscountPercent !== undefined) insert.bmgm_discount_percent = promotion.bmgmDiscountPercent;
  if (promotion.minimumPurchase !== undefined) insert.minimum_purchase = promotion.minimumPurchase;
  if (promotion.maxDiscount !== undefined) insert.max_discount = promotion.maxDiscount;
  if (promotion.targetAudience !== undefined) insert.target_audience = promotion.targetAudience;
  if (promotion.revenue !== undefined) insert.revenue = promotion.revenue;
  if (promotion.redemptionLimit !== undefined) insert.usage_limit = promotion.redemptionLimit;
  if (promotion.description !== undefined) insert.description = promotion.description;
  if (promotion.isAutoApply !== undefined) insert.is_auto_apply = promotion.isAutoApply;

  return insert;
}

/**
 * Convert frontend Promotion type to database update row
 * IMPORTANT: Updates `promo` table (not `mkt_promotions`)
 */
export function mapPromotionToDBUpdate(promotion: Partial<Promotion>): PromoUpdate {
  const update: PromoUpdate = {};

  if (promotion.name !== undefined) update.name = promotion.name;
  if (promotion.code !== undefined) update.code = promotion.code;
  if (promotion.type !== undefined) update.type = promotion.type;
  if (promotion.status !== undefined) update.status = promotion.status;
  if (promotion.startDate !== undefined) update.start_date = dateToDateString(promotion.startDate);
  if (promotion.endDate !== undefined) update.end_date = dateToDateString(promotion.endDate);
  if (promotion.isActive !== undefined) update.is_active = promotion.isActive;
  if (promotion.percentageValue !== undefined) update.percentage_value = promotion.percentageValue;
  if (promotion.valueAmount !== undefined) update.value_amount = promotion.valueAmount;
  if (promotion.buyQuantity !== undefined) update.buy_quantity = promotion.buyQuantity;
  if (promotion.getQuantity !== undefined) update.get_quantity = promotion.getQuantity;
  if (promotion.bogoDiscountPercent !== undefined) update.bogo_discount_percent = promotion.bogoDiscountPercent;
  if (promotion.bmgmMode !== undefined) update.bmgm_mode = promotion.bmgmMode;
  if (promotion.bmgmDiscountPercent !== undefined) update.bmgm_discount_percent = promotion.bmgmDiscountPercent;
  if (promotion.minimumPurchase !== undefined) update.minimum_purchase = promotion.minimumPurchase;
  if (promotion.maxDiscount !== undefined) update.max_discount = promotion.maxDiscount;
  if (promotion.targetAudience !== undefined) update.target_audience = promotion.targetAudience;
  if (promotion.redemptions !== undefined) update.redemptions = promotion.redemptions;
  if (promotion.revenue !== undefined) update.revenue = promotion.revenue;
  if (promotion.redemptionLimit !== undefined) update.usage_limit = promotion.redemptionLimit;
  if (promotion.description !== undefined) update.description = promotion.description;
  if (promotion.isAutoApply !== undefined) update.is_auto_apply = promotion.isAutoApply;
  if (promotion.updated_at !== undefined) update.updated_at = promotion.updated_at;

  return update;
}

