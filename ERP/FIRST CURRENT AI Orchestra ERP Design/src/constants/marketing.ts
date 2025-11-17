/**
 * Marketing Module - Type Constants
 * Constants for campaign and promotion types matching database exactly
 * 
 * Note: No type mapping needed - frontend types match database exactly
 */

// ============================================
// CAMPAIGN TYPES
// ============================================

export const CAMPAIGN_TYPES = {
  'email': 'email',
  'social': 'social',
  'paid-ads': 'paid-ads', // Frontend now uses 'paid-ads' (not 'ads')
  'content': 'content',
  'event': 'event',
  'launch': 'launch'
} as const;

export type CampaignType = typeof CAMPAIGN_TYPES[keyof typeof CAMPAIGN_TYPES];

// ============================================
// CAMPAIGN STATUS
// ============================================

export const CAMPAIGN_STATUS = {
  'planning': 'planning',
  'in-progress': 'in-progress',
  'launching': 'launching',
  'completed': 'completed',
  'draft': 'draft',
  'paused': 'paused'
} as const;

export type CampaignStatus = typeof CAMPAIGN_STATUS[keyof typeof CAMPAIGN_STATUS];

// ============================================
// CAMPAIGN PRIORITY
// ============================================

export const CAMPAIGN_PRIORITY = {
  'high': 'high',
  'medium': 'medium',
  'low': 'low'
} as const;

export type CampaignPriority = typeof CAMPAIGN_PRIORITY[keyof typeof CAMPAIGN_PRIORITY];

// ============================================
// PROMOTION TYPES
// ============================================

export const PROMOTION_TYPES = {
  'percentage': 'percentage',
  'fixed_amount': 'fixed_amount', // Frontend now uses 'fixed_amount' (not 'value')
  'free_shipping': 'free_shipping', // Frontend now uses 'free_shipping' (not 'free-items')
  'buy_x_get_y': 'buy_x_get_y', // Frontend now uses 'buy_x_get_y' (not 'bogo')
  'buy_more_get_more': 'buy_more_get_more' // Frontend now uses 'buy_more_get_more' (not 'bmgm')
} as const;

export type PromotionType = typeof PROMOTION_TYPES[keyof typeof PROMOTION_TYPES];

// ============================================
// PROMOTION STATUS
// ============================================

export const PROMOTION_STATUS = {
  'active': 'active',
  'scheduled': 'scheduled',
  'draft': 'draft',
  'expired': 'expired',
  'archived': 'archived'
} as const;

export type PromotionStatus = typeof PROMOTION_STATUS[keyof typeof PROMOTION_STATUS];

// ============================================
// BMGM MODES
// ============================================

export const BMGM_MODES = {
  'discount': 'discount',
  'product': 'product'
} as const;

export type BmgmMode = typeof BMGM_MODES[keyof typeof BMGM_MODES];

