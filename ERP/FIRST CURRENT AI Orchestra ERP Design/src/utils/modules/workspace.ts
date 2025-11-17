/**
 * Workspace Module - Centralized Utils & Constants
 * All helpers, constants, and utility functions for Workspace modules
 */

// ============================================
// CONSTANTS - TASKS
// ============================================

export const TASK_STATUSES = [
  "To Do",
  "In Progress",
  "In Review",
  "Blocked",
  "Completed",
] as const;

export const TASK_PRIORITIES = [
  "Low",
  "Medium",
  "High",
  "Urgent",
] as const;

export const TASK_CATEGORIES = [
  "Development",
  "Design",
  "Marketing",
  "Sales",
  "Support",
  "Operations",
  "Admin",
] as const;

// ============================================
// CONSTANTS - MY WORKSPACE
// ============================================

export const CHAT_PLACEHOLDERS = [
  "Ask me anything...",
  "What would you like to know?",
  "How can I assist you today?",
] as const;

export const QUICK_ACTIONS = [
  "Create new task",
  "View calendar",
  "Check notifications",
  "Open reports",
] as const;

// ============================================
// HELPERS - TASKS
// ============================================

export const getTaskStatusColor = (status: string): string => {
  switch (status) {
    case "To Do":
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    case "In Progress":
      return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
    case "In Review":
      return "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400";
    case "Blocked":
      return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
    case "Completed":
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
};

export const getTaskPriorityColor = (priority: string): string => {
  switch (priority) {
    case "Low":
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    case "Medium":
      return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
    case "High":
      return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400";
    case "Urgent":
      return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
};

export const getTaskCategoryColor = (category: string): string => {
  switch (category) {
    case "Development":
      return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
    case "Design":
      return "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400";
    case "Marketing":
      return "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-400";
    case "Sales":
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
    case "Support":
      return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400";
    case "Operations":
      return "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-400";
    case "Admin":
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
};

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ============================================
// HELPERS - CHAT
// ============================================

export const generateChatResponse = (message: string): string => {
  // This is a placeholder - in real implementation would use AI
  const lowercaseMessage = message.toLowerCase();
  
  if (lowercaseMessage.includes("hello") || lowercaseMessage.includes("hi")) {
    return "Hello! How can I assist you today?";
  }
  
  if (lowercaseMessage.includes("task")) {
    return "I can help you manage your tasks. Would you like to create a new task, view existing ones, or update a task status?";
  }
  
  if (lowercaseMessage.includes("help")) {
    return "I'm here to help! You can ask me about tasks, projects, schedules, or any other work-related questions.";
  }
  
  return "I understand. Let me help you with that. What specific information do you need?";
};

export const getQuickTips = (): Array<{ icon: string; text: string }> => {
  return [
    { icon: "💡", text: "Use keyboard shortcuts to work faster" },
    { icon: "🎯", text: "Set daily goals to stay focused" },
    { icon: "⏰", text: "Take breaks every 2 hours" },
    { icon: "📊", text: "Review your weekly progress" },
  ];
};
