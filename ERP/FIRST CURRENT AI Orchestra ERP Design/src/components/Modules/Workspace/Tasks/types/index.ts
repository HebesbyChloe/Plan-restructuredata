export interface Task {
  id: string;
  title: string;
  description: string;
  actions: string[];
  deliverable?: string;
  purpose?: string;
  timeEstimate?: string;
  status: "Todo" | "Processing" | "Early" | "Done";
  date: string;
  assignee: string;
  assigneeAvatar?: string;
  project: string;
  comments: Comment[];
  expanded?: boolean;
}

export interface Comment {
  id: string;
  user: string;
  content: string;
  timestamp: string;
}

export interface Column {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
}

export type ViewMode = "week" | "board" | "table";

export interface EditingField {
  taskId: string;
  field: string;
}
