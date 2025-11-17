import { Message, Task, AgentType } from "../types";

export const generateAIResponse = (
  task: Task,
  selectedAgent: AgentType
): string => {
  const responses = {
    "task-assistant": `I'll help you with "${task.title}"! Here's my suggested approach:\n\n✓ Break down into smaller steps\n✓ Set clear milestones\n✓ Allocate time blocks\n\nLet's start with the first step. What specific aspect would you like help with?`,
    "productivity": `Great! Let's boost your productivity on "${task.title}":\n\n⚡ Recommended time: ${task.priority === "High" ? "2 hours" : "1 hour"}\n⚡ Best time slot: Morning when energy is high\n⚡ Suggested breaks: Every 25 minutes\n\nShall I create a detailed workflow for you?`,
    "planning": `Let me help you plan "${task.title}" effectively:\n\n📋 Current progress: ${task.progress}%\n📋 Remaining effort: ${100 - task.progress}%\n📋 Priority level: ${task.priority}\n\nI recommend focusing on [key aspects]. Would you like a detailed action plan?`,
    "analysis": `Analyzing "${task.title}" for you:\n\n📊 Time allocation: Optimal\n📊 Complexity: ${task.priority === "High" ? "High" : "Medium"}\n📊 Dependencies: Need to check\n\nBased on similar tasks, average completion time is [X hours]. Want detailed insights?`,
  };
  
  return responses[selectedAgent];
};

export const createUserMessage = (
  content: string,
  taskContext?: Task
): Message => {
  return {
    id: Date.now().toString(),
    role: "user",
    content,
    timestamp: new Date(),
    taskContext,
  };
};

export const createAssistantMessage = (content: string): Message => {
  return {
    id: (Date.now() + 1).toString(),
    role: "assistant",
    content,
    timestamp: new Date(),
  };
};

export const generateTaskPrompt = (task: Task): string => {
  return `Help me with this task: "${task.title}"\n\nDescription: ${task.description}\nDue: ${task.dueDate}\nPriority: ${task.priority}\nProgress: ${task.progress}%`;
};
