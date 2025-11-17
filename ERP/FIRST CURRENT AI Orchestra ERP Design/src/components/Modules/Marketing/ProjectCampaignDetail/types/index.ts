/**
 * ProjectCampaignDetail Module Types
 * All TypeScript interfaces and types for the Project/Campaign detail panel
 */

export interface ProjectCampaignData {
  id: string;
  name: string;
  description: string;
  type: "project" | "campaign";
  status: string;
  progress?: number;
  startDate: string;
  endDate: string;
  team: string[];
  totalTasks?: number;
  completedTasks?: number;
  color: string;
  aiScore?: number;
}

export interface Task {
  id: string;
  title: string;
  assignee: string;
  status: string;
  date: string;
}

export interface TaskDeliverables {
  name: string;
  status: "Approved" | "Pending" | "Redo";
}

export interface TaskComment {
  author: string;
  date: string;
  text: string;
}

export interface TaskDetails {
  deliverables: TaskDeliverables[];
  comments: TaskComment[];
}

export interface MetricOption {
  value: string;
  label: string;
  goalLabel: string;
  resultLabel: string;
  defaultGoal: string;
  defaultResult: string;
}

export interface MetricValues {
  goal: string;
  result: string;
}

export interface ProjectFile {
  name: string;
  size: string;
  date: string;
}

export interface Activity {
  date: string;
  activity: string;
  status: string;
}

export interface ProjectCampaignDetailPanelProps {
  project: ProjectCampaignData;
  isOpen: boolean;
  onClose: () => void;
  tasks?: Task[];
  isNewMode?: boolean;
  defaultTab?: "tasks" | "details" | "activities";
  campaignId?: number; // Campaign ID for fetching related data
  tenantId?: number; // Tenant ID for fetching related data
  onUpdate?: (updatedCampaign: Partial<ProjectCampaignData>) => void; // Callback when campaign is updated
}
