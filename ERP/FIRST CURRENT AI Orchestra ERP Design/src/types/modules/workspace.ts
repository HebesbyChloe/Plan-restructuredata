/**
 * Workspace Module - Centralized Type Definitions
 * All types for Workspace modules (Tasks, MyWorkSpace, etc.)
 */

import { Task } from "../../sampledata/tasks";

export type { Task };

// ============================================
// MY WORKSPACE TYPES
// ============================================

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface QuickTip {
  icon: string;
  text: string;
}

export interface MyWorkSpaceProps {
  tasks: Task[];
  messages: Message[];
  onSendMessage: (message: string) => void;
  quickTips: QuickTip[];
}

// ============================================
// TASKS PAGE TYPES
// ============================================

export interface TasksPageProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onTaskCreate?: (task: Omit<Task, "id">) => void;
}

export interface TasksFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  priorityFilter: string;
  onPriorityFilterChange: (value: string) => void;
  assigneeFilter: string;
  onAssigneeFilterChange: (value: string) => void;
}

export interface TasksHeaderProps {
  viewMode: "board" | "table";
  onViewModeChange: (mode: "board" | "table") => void;
  onCreateTask?: () => void;
}
