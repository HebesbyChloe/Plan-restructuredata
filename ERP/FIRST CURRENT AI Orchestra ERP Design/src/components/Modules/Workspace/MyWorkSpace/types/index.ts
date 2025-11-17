export type AgentType = "task-assistant" | "productivity" | "planning" | "analysis";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  taskContext?: Task;
}

export interface Agent {
  id: AgentType;
  name: string;
  icon: any;
  color: string;
  gradient: string;
  description: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "High" | "Medium" | "Low";
  status: "Todo" | "In Progress" | "Review";
  assignee: string;
  project: string;
  progress: number;
  tags: string[];
}
