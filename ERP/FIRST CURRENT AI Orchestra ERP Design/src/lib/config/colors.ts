/**
 * Global Color Palette
 * Centralized color configuration for consistent theming
 */

// ============================================
// BRAND COLORS
// ============================================

export const brandColors = {
  primary: "#4B6BFB", // AI Blue
  primaryLight: "#6B8AFB",
  primaryDark: "#3B5BE8",
  primaryGlow: "rgba(75, 107, 251, 0.3)",
  
  // Glass morphism
  glassBg: "rgba(255, 255, 255, 0.05)",
  glassBorder: "rgba(255, 255, 255, 0.1)",
  glassHover: "rgba(255, 255, 255, 0.08)",
} as const;

// ============================================
// STATUS COLORS
// ============================================

export const statusColors = {
  // Customer Status
  customerStatus: {
    "New": {
      bg: "bg-cyan-500/10",
      text: "text-cyan-600 dark:text-cyan-400",
      border: "border-cyan-500/30",
      hex: "#06B6D4",
    },
    "Potential": {
      bg: "bg-blue-500/10",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-500/30",
      hex: "#3B82F6",
    },
    "Awaiting Payment": {
      bg: "bg-amber-500/10",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-500/30",
      hex: "#F59E0B",
    },
    "Converted": {
      bg: "bg-emerald-500/10",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-500/30",
      hex: "#10B981",
    },
    "Ordered": {
      bg: "bg-green-500/10",
      text: "text-green-600 dark:text-green-400",
      border: "border-green-500/30",
      hex: "#22C55E",
    },
    "Re-engaged": {
      bg: "bg-purple-500/10",
      text: "text-purple-600 dark:text-purple-400",
      border: "border-purple-500/30",
      hex: "#A855F7",
    },
    "Inactive30": {
      bg: "bg-orange-500/10",
      text: "text-orange-600 dark:text-orange-400",
      border: "border-orange-500/30",
      hex: "#F97316",
    },
    "Inactive90": {
      bg: "bg-red-500/10",
      text: "text-red-600 dark:text-red-400",
      border: "border-red-500/30",
      hex: "#EF4444",
    },
    "Lost": {
      bg: "bg-gray-500/10",
      text: "text-gray-600 dark:text-gray-400",
      border: "border-gray-500/30",
      hex: "#6B7280",
    },
  },
  
  // Priority
  priority: {
    low: {
      bg: "bg-gray-500/10",
      text: "text-gray-600 dark:text-gray-400",
      border: "border-gray-500/30",
      hex: "#6B7280",
    },
    medium: {
      bg: "bg-blue-500/10",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-500/30",
      hex: "#3B82F6",
    },
    high: {
      bg: "bg-orange-500/10",
      text: "text-orange-600 dark:text-orange-400",
      border: "border-orange-500/30",
      hex: "#F97316",
    },
    urgent: {
      bg: "bg-red-500/10",
      text: "text-red-600 dark:text-red-400",
      border: "border-red-500/30",
      hex: "#EF4444",
    },
  },
  
  // Customer Rank
  rank: {
    "New": {
      bg: "bg-cyan-500/10",
      text: "text-cyan-600 dark:text-cyan-400",
      border: "border-cyan-500/30",
      hex: "#06B6D4",
    },
    "First": {
      bg: "bg-blue-500/10",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-500/30",
      hex: "#3B82F6",
    },
    "Repeat": {
      bg: "bg-emerald-500/10",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-500/30",
      hex: "#10B981",
    },
    "Loyal": {
      bg: "bg-amber-500/10",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-500/30",
      hex: "#F59E0B",
    },
    "VIP": {
      bg: "bg-purple-500/10",
      text: "text-purple-600 dark:text-purple-400",
      border: "border-purple-500/30",
      hex: "#A855F7",
    },
    "VVIP": {
      bg: "bg-pink-500/10",
      text: "text-pink-600 dark:text-pink-400",
      border: "border-pink-500/30",
      hex: "#EC4899",
    },
  },

  // Customer Stage
  stage: {
    "Awareness": {
      bg: "bg-slate-500/10",
      text: "text-slate-600 dark:text-slate-400",
      border: "border-slate-500/30",
      hex: "#64748B",
    },
    "Engagement": {
      bg: "bg-cyan-500/10",
      text: "text-cyan-600 dark:text-cyan-400",
      border: "border-cyan-500/30",
      hex: "#06B6D4",
    },
    "Interest": {
      bg: "bg-blue-500/10",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-500/30",
      hex: "#3B82F6",
    },
    "Consideration": {
      bg: "bg-indigo-500/10",
      text: "text-indigo-600 dark:text-indigo-400",
      border: "border-indigo-500/30",
      hex: "#6366F1",
    },
    "Trust Building": {
      bg: "bg-purple-500/10",
      text: "text-purple-600 dark:text-purple-400",
      border: "border-purple-500/30",
      hex: "#A855F7",
    },
    "Decision": {
      bg: "bg-violet-500/10",
      text: "text-violet-600 dark:text-violet-400",
      border: "border-violet-500/30",
      hex: "#8B5CF6",
    },
    "Pending Payment": {
      bg: "bg-amber-500/10",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-500/30",
      hex: "#F59E0B",
    },
    "Purchase": {
      bg: "bg-emerald-500/10",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-500/30",
      hex: "#10B981",
    },
    "Retention": {
      bg: "bg-green-500/10",
      text: "text-green-600 dark:text-green-400",
      border: "border-green-500/30",
      hex: "#22C55E",
    },
    "Post-Purchase Support": {
      bg: "bg-teal-500/10",
      text: "text-teal-600 dark:text-teal-400",
      border: "border-teal-500/30",
      hex: "#14B8A6",
    },
  },
  
  // Emotion - Positive Group
  emotion: {
    "Interested / Pleasant": {
      emoji: "😊",
      group: "Positive",
      bg: "bg-blue-500/10",
      text: "text-blue-600 dark:text-blue-400",
      hex: "#3B82F6",
    },
    "Excited / Loving": {
      emoji: "😍",
      group: "Positive",
      bg: "bg-pink-500/10",
      text: "text-pink-600 dark:text-pink-400",
      hex: "#EC4899",
    },
    "Relieved / Comfortable": {
      emoji: "😌",
      group: "Positive",
      bg: "bg-cyan-500/10",
      text: "text-cyan-600 dark:text-cyan-400",
      hex: "#06B6D4",
    },
    "Happy / Satisfied": {
      emoji: "🥳",
      group: "Positive",
      bg: "bg-emerald-500/10",
      text: "text-emerald-600 dark:text-emerald-400",
      hex: "#10B981",
    },
    "Grateful / Appreciative": {
      emoji: "🤗",
      group: "Positive",
      bg: "bg-green-500/10",
      text: "text-green-600 dark:text-green-400",
      hex: "#22C55E",
    },
    "Proud / Confident": {
      emoji: "🫶",
      group: "Positive",
      bg: "bg-purple-500/10",
      text: "text-purple-600 dark:text-purple-400",
      hex: "#A855F7",
    },
    "Caring / Trusting": {
      emoji: "💬",
      group: "Positive",
      bg: "bg-indigo-500/10",
      text: "text-indigo-600 dark:text-indigo-400",
      hex: "#6366F1",
    },
    // Negative Group
    "Angry": {
      emoji: "😡",
      group: "Negative",
      bg: "bg-red-500/10",
      text: "text-red-600 dark:text-red-400",
      hex: "#EF4444",
    },
    "Annoyed / Irritated": {
      emoji: "😤",
      group: "Negative",
      bg: "bg-orange-500/10",
      text: "text-orange-600 dark:text-orange-400",
      hex: "#F97316",
    },
    "Disappointed": {
      emoji: "😕",
      group: "Negative",
      bg: "bg-amber-500/10",
      text: "text-amber-600 dark:text-amber-400",
      hex: "#F59E0B",
    },
    "Hesitant / Unsure": {
      emoji: "🤔",
      group: "Negative",
      bg: "bg-yellow-500/10",
      text: "text-yellow-600 dark:text-yellow-400",
      hex: "#EAB308",
    },
    "Nervous / Doubtful": {
      emoji: "😬",
      group: "Negative",
      bg: "bg-rose-500/10",
      text: "text-rose-600 dark:text-rose-400",
      hex: "#F43F5E",
    },
    // Neutral Group
    "Neutral / Unclear": {
      emoji: "😐",
      group: "Neutral",
      bg: "bg-gray-500/10",
      text: "text-gray-600 dark:text-gray-400",
      hex: "#6B7280",
    },
    "Disengaged / Cold": {
      emoji: "💤",
      group: "Neutral",
      bg: "bg-slate-500/10",
      text: "text-slate-600 dark:text-slate-400",
      hex: "#64748B",
    },
  },
  
  // Emotion Group (for filtering)
  emotionGroup: {
    "Positive": {
      bg: "bg-emerald-500/10",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-500/30",
      hex: "#10B981",
    },
    "Negative": {
      bg: "bg-red-500/10",
      text: "text-red-600 dark:text-red-400",
      border: "border-red-500/30",
      hex: "#EF4444",
    },
    "Neutral": {
      bg: "bg-gray-500/10",
      text: "text-gray-600 dark:text-gray-400",
      border: "border-gray-500/30",
      hex: "#6B7280",
    },
  },

  // Badge
  badge: {
    VIP: {
      bg: "bg-purple-500/10",
      text: "text-purple-600 dark:text-purple-400",
      border: "border-purple-500/30",
      hex: "#A855F7",
    },
    New: {
      bg: "bg-blue-500/10",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-500/30",
      hex: "#3B82F6",
    },
    Returning: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-500/30",
      hex: "#10B981",
    },
    "At Risk": {
      bg: "bg-red-500/10",
      text: "text-red-600 dark:text-red-400",
      border: "border-red-500/30",
      hex: "#EF4444",
    },
  },
  
  // Campaign Status
  campaignStatus: {
    draft: {
      bg: "bg-gray-500/10",
      text: "text-gray-600 dark:text-gray-400",
      hex: "#6B7280",
    },
    scheduled: {
      bg: "bg-blue-500/10",
      text: "text-blue-600 dark:text-blue-400",
      hex: "#3B82F6",
    },
    "in-progress": {
      bg: "bg-orange-500/10",
      text: "text-orange-600 dark:text-orange-400",
      hex: "#F97316",
    },
    completed: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-600 dark:text-emerald-400",
      hex: "#10B981",
    },
    paused: {
      bg: "bg-yellow-500/10",
      text: "text-yellow-600 dark:text-yellow-400",
      hex: "#EAB308",
    },
    cancelled: {
      bg: "bg-red-500/10",
      text: "text-red-600 dark:text-red-400",
      hex: "#EF4444",
    },
  },
} as const;

// ============================================
// SEMANTIC COLORS
// ============================================

export const semanticColors = {
  success: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-500/30",
    hex: "#10B981",
  },
  error: {
    bg: "bg-red-500/10",
    text: "text-red-600 dark:text-red-400",
    border: "border-red-500/30",
    hex: "#EF4444",
  },
  warning: {
    bg: "bg-orange-500/10",
    text: "text-orange-600 dark:text-orange-400",
    border: "border-orange-500/30",
    hex: "#F97316",
  },
  info: {
    bg: "bg-blue-500/10",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-500/30",
    hex: "#3B82F6",
  },
} as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getStatusColor(category: keyof typeof statusColors, status: string) {
  const categoryColors = statusColors[category] as Record<string, any>;
  return categoryColors[status] || {
    bg: "bg-gray-500/10",
    text: "text-gray-600 dark:text-gray-400",
    border: "border-gray-500/30",
    hex: "#6B7280",
  };
}

export function getEmotionGroup(emotion: string): string {
  const emotionData = statusColors.emotion[emotion as keyof typeof statusColors.emotion];
  return emotionData?.group || "Neutral";
}

export function getEmotionEmoji(emotion: string): string {
  const emotionData = statusColors.emotion[emotion as keyof typeof statusColors.emotion];
  return emotionData?.emoji || "😐";
}
