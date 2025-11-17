import { Card } from "../../../../ui/card";
import { Message, Agent, AgentType, Task } from "../types";
import { EmptyChatState } from "./EmptyChatState";
import { ChatMessages } from "./ChatMessages";
import { DropZone } from "./DropZone";
import { ChatInput } from "./ChatInput";

interface ChatInterfaceProps {
  messages: Message[];
  agents: Agent[];
  selectedAgent: AgentType;
  currentAgent: Agent;
  draggedTask: Task | null;
  isDropZoneActive: boolean;
  inputValue: string;
  onAgentSelect: (agentId: AgentType) => void;
  onPromptClick: (prompt: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export function ChatInterface({
  messages,
  agents,
  selectedAgent,
  currentAgent,
  draggedTask,
  isDropZoneActive,
  inputValue,
  onAgentSelect,
  onPromptClick,
  onDragOver,
  onDragLeave,
  onDrop,
  onInputChange,
  onSendMessage,
  onKeyDown,
}: ChatInterfaceProps) {
  return (
    <Card className="bg-white dark:bg-card border-[#E5E5E5] overflow-hidden min-h-[600px] flex flex-col">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-[400px]">
        {messages.length === 0 ? (
          <EmptyChatState
            agents={agents}
            selectedAgentId={selectedAgent}
            currentAgent={currentAgent}
            onAgentSelect={onAgentSelect}
            onPromptClick={onPromptClick}
          />
        ) : (
          <ChatMessages messages={messages} currentAgent={currentAgent} />
        )}
      </div>

      {/* Drop Zone Overlay */}
      <DropZone
        draggedTask={draggedTask}
        isDropZoneActive={isDropZoneActive}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      />

      {/* Input Area */}
      <ChatInput
        value={inputValue}
        onChange={onInputChange}
        onSend={onSendMessage}
        onKeyDown={onKeyDown}
      />
    </Card>
  );
}
