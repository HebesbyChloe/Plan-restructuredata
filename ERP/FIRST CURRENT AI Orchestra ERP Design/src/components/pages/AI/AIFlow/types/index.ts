export interface AIFlow {
  id: string;
  name: string;
  description: string;
  status: "active" | "paused" | "requested";
  layer: 1 | 2 | 3 | 4; // Updated to include layer 4
  category: string;
  source?: 'internal' | 'external' | 'n8n' | 'gpts' | 'zapier' | 'make'; // Platform/source
  metrics: {
    tasksProcessed: number;
    successRate: number;
    avgTime: string;
    quality: number; // Quality compared to human work (percentage)
    efficiency: number; // Time saved compared to human work (percentage)
  };
  createdDate: string;
  updatedDate?: string; // Optional updated date
}

export interface ExternalTool {
  id: string;
  name: string;
  description: string;
  category: string;
  url: string;
  icon: string;
  status: "connected" | "available";
}

export interface AIFlowPageProps {
  department?: string;
}

export type SheetMode = "view" | "request" | "designer";

export type FlowStatus = "active" | "paused" | "requested";

export type FlowLayer = 1 | 2 | 3 | 4;
