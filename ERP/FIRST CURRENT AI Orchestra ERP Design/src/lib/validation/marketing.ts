/**
 * Marketing Module - Validation Schemas
 * 
 * Validation functions for Campaign and Promotion data
 * 
 * NOTE: Zod is not currently installed. These are basic validation functions.
 * Consider installing Zod for more robust schema validation:
 *   npm install zod
 */

import { Campaign, Promotion } from "../../types/modules/marketing";
import { CampaignType, CampaignStatus, CampaignPriority } from "../../constants/marketing";
import { PromotionType, PromotionStatus } from "../../constants/marketing";

// ============================================
// VALIDATION RESULT TYPES
// ============================================

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// ============================================
// CAMPAIGN VALIDATION
// ============================================

/**
 * Validate a Campaign object
 */
export function validateCampaign(campaign: Partial<Campaign>): ValidationResult {
  const errors: ValidationError[] = [];

  // Required fields
  if (!campaign.name || campaign.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Campaign name is required' });
  } else if (campaign.name.length > 500) {
    errors.push({ field: 'name', message: 'Campaign name must be 500 characters or less' });
  }

  if (!campaign.type) {
    errors.push({ field: 'type', message: 'Campaign type is required' });
  } else if (!Object.values(CAMPAIGN_TYPES).includes(campaign.type as CampaignType)) {
    errors.push({ field: 'type', message: `Invalid campaign type. Must be one of: ${Object.values(CAMPAIGN_TYPES).join(', ')}` });
  }

  if (!campaign.status) {
    errors.push({ field: 'status', message: 'Campaign status is required' });
  } else if (!Object.values(CAMPAIGN_STATUS).includes(campaign.status as CampaignStatus)) {
    errors.push({ field: 'status', message: `Invalid campaign status. Must be one of: ${Object.values(CAMPAIGN_STATUS).join(', ')}` });
  }

  if (!campaign.startDate) {
    errors.push({ field: 'startDate', message: 'Start date is required' });
  } else if (!(campaign.startDate instanceof Date)) {
    errors.push({ field: 'startDate', message: 'Start date must be a Date object' });
  }

  if (campaign.endDate && campaign.startDate) {
    if (!(campaign.endDate instanceof Date)) {
      errors.push({ field: 'endDate', message: 'End date must be a Date object' });
    } else if (campaign.endDate < campaign.startDate) {
      errors.push({ field: 'endDate', message: 'End date must be after start date' });
    }
  }

  if (campaign.budget !== undefined) {
    if (typeof campaign.budget !== 'number' || campaign.budget < 0) {
      errors.push({ field: 'budget', message: 'Budget must be a non-negative number' });
    }
  }

  if (campaign.spent !== undefined) {
    if (typeof campaign.spent !== 'number' || campaign.spent < 0) {
      errors.push({ field: 'spent', message: 'Spent must be a non-negative number' });
    }
  }

  if (campaign.ownerId === undefined || campaign.ownerId === null) {
    errors.push({ field: 'ownerId', message: 'Owner ID is required' });
  } else if (typeof campaign.ownerId !== 'number' || campaign.ownerId <= 0) {
    errors.push({ field: 'ownerId', message: 'Owner ID must be a positive number' });
  }

  if (campaign.priority) {
    if (!Object.values(CAMPAIGN_PRIORITY).includes(campaign.priority as CampaignPriority)) {
      errors.push({ field: 'priority', message: `Invalid priority. Must be one of: ${Object.values(CAMPAIGN_PRIORITY).join(', ')}` });
    }
  }

  if (campaign.progress !== undefined) {
    if (typeof campaign.progress !== 'number' || campaign.progress < 0 || campaign.progress > 100) {
      errors.push({ field: 'progress', message: 'Progress must be a number between 0 and 100' });
    }
  }

  if (campaign.aiScore !== undefined && campaign.aiScore !== null) {
    if (typeof campaign.aiScore !== 'number' || campaign.aiScore < 0 || campaign.aiScore > 100) {
      errors.push({ field: 'aiScore', message: 'AI Score must be a number between 0 and 100' });
    }
  }

  if (campaign.engagement !== undefined) {
    if (typeof campaign.engagement !== 'number' || campaign.engagement < 0 || campaign.engagement > 100) {
      errors.push({ field: 'engagement', message: 'Engagement must be a number between 0 and 100' });
    }
  }

  if (campaign.engagementGoal !== undefined) {
    if (typeof campaign.engagementGoal !== 'number' || campaign.engagementGoal < 0 || campaign.engagementGoal > 100) {
      errors.push({ field: 'engagementGoal', message: 'Engagement goal must be a number between 0 and 100' });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ============================================
// PROMOTION VALIDATION
// ============================================

/**
 * Validate a Promotion object
 */
export function validatePromotion(promotion: Partial<Promotion>): ValidationResult {
  const errors: ValidationError[] = [];

  // Required fields
  if (!promotion.name || promotion.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Promotion name is required' });
  } else if (promotion.name.length > 200) {
    errors.push({ field: 'name', message: 'Promotion name must be 200 characters or less' });
  }

  if (!promotion.code || promotion.code.trim().length === 0) {
    errors.push({ field: 'code', message: 'Promotion code is required' });
  } else if (promotion.code.length > 100) {
    errors.push({ field: 'code', message: 'Promotion code must be 100 characters or less' });
  }

  if (!promotion.type) {
    errors.push({ field: 'type', message: 'Promotion type is required' });
  } else if (!Object.values(PROMOTION_TYPES).includes(promotion.type as PromotionType)) {
    errors.push({ field: 'type', message: `Invalid promotion type. Must be one of: ${Object.values(PROMOTION_TYPES).join(', ')}` });
  }

  if (!promotion.status) {
    errors.push({ field: 'status', message: 'Promotion status is required' });
  } else if (!Object.values(PROMOTION_STATUS).includes(promotion.status as PromotionStatus)) {
    errors.push({ field: 'status', message: `Invalid promotion status. Must be one of: ${Object.values(PROMOTION_STATUS).join(', ')}` });
  }

  if (!promotion.startDate) {
    errors.push({ field: 'startDate', message: 'Start date is required' });
  } else if (!(promotion.startDate instanceof Date)) {
    errors.push({ field: 'startDate', message: 'Start date must be a Date object' });
  }

  if (!promotion.endDate) {
    errors.push({ field: 'endDate', message: 'End date is required' });
  } else if (!(promotion.endDate instanceof Date)) {
    errors.push({ field: 'endDate', message: 'End date must be a Date object' });
  } else if (promotion.startDate && promotion.endDate < promotion.startDate) {
    errors.push({ field: 'endDate', message: 'End date must be after start date' });
  }

  // Type-specific validations
  if (promotion.type === 'percentage') {
    if (promotion.percentageValue === undefined || promotion.percentageValue === null) {
      errors.push({ field: 'percentageValue', message: 'Percentage value is required for percentage type promotions' });
    } else if (typeof promotion.percentageValue !== 'number' || promotion.percentageValue < 0 || promotion.percentageValue > 100) {
      errors.push({ field: 'percentageValue', message: 'Percentage value must be a number between 0 and 100' });
    }
  }

  if (promotion.type === 'fixed_amount') {
    if (promotion.valueAmount === undefined || promotion.valueAmount === null) {
      errors.push({ field: 'valueAmount', message: 'Value amount is required for fixed amount type promotions' });
    } else if (typeof promotion.valueAmount !== 'number' || promotion.valueAmount < 0) {
      errors.push({ field: 'valueAmount', message: 'Value amount must be a non-negative number' });
    }
  }

  if (promotion.type === 'buy_x_get_y') {
    if (promotion.buyQuantity === undefined || promotion.buyQuantity === null) {
      errors.push({ field: 'buyQuantity', message: 'Buy quantity is required for buy X get Y type promotions' });
    } else if (typeof promotion.buyQuantity !== 'number' || promotion.buyQuantity <= 0) {
      errors.push({ field: 'buyQuantity', message: 'Buy quantity must be a positive number' });
    }
    if (promotion.getQuantity === undefined || promotion.getQuantity === null) {
      errors.push({ field: 'getQuantity', message: 'Get quantity is required for buy X get Y type promotions' });
    } else if (typeof promotion.getQuantity !== 'number' || promotion.getQuantity <= 0) {
      errors.push({ field: 'getQuantity', message: 'Get quantity must be a positive number' });
    }
  }

  if (promotion.type === 'buy_more_get_more') {
    if (!promotion.bmgmMode) {
      errors.push({ field: 'bmgmMode', message: 'BMGM mode is required for buy more get more type promotions' });
    } else if (promotion.bmgmMode !== 'discount' && promotion.bmgmMode !== 'product') {
      errors.push({ field: 'bmgmMode', message: 'BMGM mode must be either "discount" or "product"' });
    }
  }

  if (promotion.minimumPurchase !== undefined && promotion.minimumPurchase !== null) {
    if (typeof promotion.minimumPurchase !== 'number' || promotion.minimumPurchase < 0) {
      errors.push({ field: 'minimumPurchase', message: 'Minimum purchase must be a non-negative number' });
    }
  }

  if (promotion.maxDiscount !== undefined && promotion.maxDiscount !== null) {
    if (typeof promotion.maxDiscount !== 'number' || promotion.maxDiscount < 0) {
      errors.push({ field: 'maxDiscount', message: 'Max discount must be a non-negative number' });
    }
  }

  if (promotion.redemptions !== undefined) {
    if (typeof promotion.redemptions !== 'number' || promotion.redemptions < 0) {
      errors.push({ field: 'redemptions', message: 'Redemptions must be a non-negative number' });
    }
  }

  if (promotion.redemptionLimit !== undefined && promotion.redemptionLimit !== null) {
    if (typeof promotion.redemptionLimit !== 'number' || promotion.redemptionLimit <= 0) {
      errors.push({ field: 'redemptionLimit', message: 'Redemption limit must be a positive number' });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ============================================
// CONSTANTS (for validation)
// ============================================

const CAMPAIGN_TYPES = {
  'email': 'email',
  'social': 'social',
  'paid-ads': 'paid-ads',
  'content': 'content',
  'event': 'event',
  'launch': 'launch'
} as const;

const CAMPAIGN_STATUS = {
  'planning': 'planning',
  'in-progress': 'in-progress',
  'launching': 'launching',
  'completed': 'completed',
  'draft': 'draft',
  'paused': 'paused'
} as const;

const CAMPAIGN_PRIORITY = {
  'high': 'high',
  'medium': 'medium',
  'low': 'low'
} as const;

const PROMOTION_TYPES = {
  'percentage': 'percentage',
  'fixed_amount': 'fixed_amount',
  'free_shipping': 'free_shipping',
  'buy_x_get_y': 'buy_x_get_y',
  'buy_more_get_more': 'buy_more_get_more'
} as const;

const PROMOTION_STATUS = {
  'active': 'active',
  'scheduled': 'scheduled',
  'draft': 'draft',
  'expired': 'expired',
  'archived': 'archived'
} as const;

