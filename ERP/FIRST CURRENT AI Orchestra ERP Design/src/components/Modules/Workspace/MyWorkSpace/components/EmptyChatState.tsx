import { motion } from "motion/react";
import { Target, Zap, Brain, BarChart3 } from "lucide-react";
import { AIAgentSelectionMain } from "../../../../AI";
import { Agent, AgentType } from "../types";

interface EmptyChatStateProps {
  agents: Agent[];
  selectedAgentId: AgentType;
  currentAgent: Agent;
  onAgentSelect: (agentId: AgentType) => void;
  onPromptClick: (prompt: string) => void;
}

export function EmptyChatState({
  agents,
  selectedAgentId,
  currentAgent,
  onAgentSelect,
  onPromptClick,
}: EmptyChatStateProps) {
  const suggestedPrompts = [
    { icon: Target, text: "Help me prioritize tasks", color: currentAgent.color },
    { icon: Zap, text: "Break down complex task", color: currentAgent.color },
    { icon: Brain, text: "Suggest productivity tips", color: currentAgent.color },
    { icon: BarChart3, text: "Analyze my workload", color: currentAgent.color },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      {/* AI Agent Selection Main - Reusable Component */}
      <div className="mb-6">
        <AIAgentSelectionMain
          agents={agents}
          selectedAgentId={selectedAgentId}
          onAgentSelect={(agentId) => onAgentSelect(agentId as AgentType)}
          size="large"
          showSparkle={true}
        />
      </div>

      <h3 className="mb-2">{currentAgent.name}</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
        {currentAgent.description}
      </p>

      {/* Suggested Prompts */}
      <div className="grid grid-cols-2 gap-3 max-w-xl w-full">
        {suggestedPrompts.map((prompt, idx) => (
          <motion.button
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => onPromptClick(prompt.text)}
            className="p-4 rounded-xl bg-accent/50 hover:bg-accent transition-all text-left group"
          >
            <prompt.icon
              className="w-5 h-5 mb-2 opacity-60 group-hover:opacity-100 transition-opacity"
              style={{ color: prompt.color }}
            />
            <p className="text-sm mb-0">{prompt.text}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
