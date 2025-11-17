import { LucideIcon } from "lucide-react";

export type AgentType = "marketing" | "copywriter" | "analytics" | "ecommerce" | "design";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface Agent {
  id: AgentType;
  name: string;
  icon: LucideIcon;
  color: string;
  gradient: string;
  description: string;
  quote: string;
}

export interface Notice {
  id: string;
  message: string;
  color: string;
  bgColor: string;
}

export interface PromptItem {
  icon: LucideIcon;
  text: string;
  color: string;
}

export interface AgentPrompts {
  [key: string]: PromptItem[];
}
