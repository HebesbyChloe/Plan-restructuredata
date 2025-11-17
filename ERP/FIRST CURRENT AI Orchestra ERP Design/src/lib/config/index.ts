/**
 * Configuration Module - Central Export
 * Import all configs from a single location
 */

// Export all enums
export * from "./enums";

// Export all colors
export * from "./colors";

// Export all theme configs
export * from "./theme";

// Export all constants
export * from "./constants";

// Re-export commonly used items for convenience
export { brandColors, statusColors, semanticColors, getStatusColor, getEmotionEmoji, getEmotionGroup } from "./colors";
export { typography, spacing, radius, shadows, transitions, zIndex, breakpoints, animation } from "./theme";
export {
  CUSTOMER_STATUSES,
  CUSTOMER_STAGES,
  CUSTOMER_PRIORITIES,
  CUSTOMER_RANKS,
  CUSTOMER_EMOTIONS,
  CUSTOMER_BADGES,
  CONTACT_METHODS,
  SALES_REPS,
  TIME_FILTERS,
  EMOTION_GROUPS,
  SHIFT_TYPES,
  getLabelFromValue,
  getValues,
  isValidValue,
} from "./constants";
