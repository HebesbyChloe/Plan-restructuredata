import { motion, AnimatePresence } from "motion/react";
import { Card } from "../../../../ui/card";
import { Button } from "../../../../ui/button";
import { Textarea } from "../../../../ui/textarea";
import { Send } from "lucide-react";
import { Agent, PromptItem } from "../types";
import { AgentSelector } from "./AgentSelector";

interface WelcomeScreenProps {
  agents: Agent[];
  currentAgent: Agent;
  selectedAgent: string;
  suggestedPrompts: PromptItem[];
  currentPromptIndex: number;
  currentPrompt: PromptItem;
  inputValue: string;
  isAgentSelectorOpen: boolean;
  onAgentToggle: () => void;
  onAgentSelect: (agentId: any) => void;
  onPromptClick: (text: string) => void;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export function WelcomeScreen({
  agents,
  currentAgent,
  selectedAgent,
  suggestedPrompts,
  currentPromptIndex,
  currentPrompt,
  inputValue,
  isAgentSelectorOpen,
  onAgentToggle,
  onAgentSelect,
  onPromptClick,
  onInputChange,
  onSend,
  onKeyDown,
}: WelcomeScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl w-full space-y-8"
    >
      {/* AI Agent Header */}
      <div className="text-center space-y-4">
        <AgentSelector
          agents={agents}
          selectedAgent={selectedAgent as any}
          currentAgent={currentAgent}
          isOpen={isAgentSelectorOpen}
          onToggle={onAgentToggle}
          onSelect={onAgentSelect}
        />
        
        <h1 className={`bg-gradient-to-r ${currentAgent.gradient} bg-clip-text text-transparent`}>
          {currentAgent.name}
        </h1>
        
        <div className="max-w-2xl mx-auto">
          <p className="opacity-60 italic text-center">
            "{currentAgent.quote}"
          </p>
        </div>

        <p className="opacity-80 max-w-xl mx-auto">
          {currentAgent.description}
        </p>
      </div>

      {/* Suggested Prompt - Animated Single Card */}
      <div className="relative h-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPromptIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Card
              className="p-5 border-glass-border bg-glass-bg/30 backdrop-blur-sm hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer group h-full"
              onClick={() => onPromptClick(currentPrompt.text)}
            >
              <div className="flex items-center gap-4 h-full">
                <div
                  className="p-3 rounded-lg flex-shrink-0"
                  style={{ backgroundColor: `${currentPrompt.color}20` }}
                >
                  <currentPrompt.icon className="w-5 h-5" style={{ color: currentPrompt.color }} />
                </div>
                <div className="flex-1">
                  <p className="group-hover:text-[#4B6BFB] transition-colors">
                    {currentPrompt.text}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
        
        {/* Progress Dots */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {suggestedPrompts.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentPromptIndex ? "bg-[#4B6BFB] w-6" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Input Area */}
      <Card className="p-4 border-glass-border bg-glass-bg/30 backdrop-blur-sm shadow-xl">
        <div className="flex items-end gap-3">
          <Textarea
            placeholder={`Ask ${currentAgent.name} anything...`}
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={onKeyDown}
            className="min-h-[60px] max-h-[200px] resize-none bg-background/50 border-glass-border"
          />
          <Button
            onClick={onSend}
            disabled={!inputValue.trim()}
            className="gap-2 h-[60px] px-6"
            style={{
              backgroundColor: currentAgent.color,
            }}
          >
            <Send className="w-4 h-4" />
            Send
          </Button>
        </div>
        <p className="opacity-40 mt-3">
          Press Enter to send, Shift + Enter for new line
        </p>
      </Card>
    </motion.div>
  );
}
