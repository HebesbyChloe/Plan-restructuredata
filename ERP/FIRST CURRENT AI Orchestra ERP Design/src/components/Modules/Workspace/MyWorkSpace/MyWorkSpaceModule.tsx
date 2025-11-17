import { useState } from "react";
import { Calendar, Clock, Brain } from "lucide-react";
import { Badge } from "../../../ui/badge";
import { QuickTipCard } from "./components/QuickTipCard";
import { TasksList } from "./components/TasksList";
import { ChatInterface } from "./components/ChatInterface";
import { Message, Task, AgentType } from "./types";
import { agents, todayTasks } from "./utils/constants";
import {
  generateAIResponse,
  createUserMessage,
  createAssistantMessage,
  generateTaskPrompt,
} from "./utils/chatHandlers";

export function MyWorkSpaceModule() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<AgentType>("task-assistant");
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [isDropZoneActive, setIsDropZoneActive] = useState(false);
  const [showQuickTip, setShowQuickTip] = useState(true);

  const currentAgent = agents.find((a) => a.id === selectedAgent) || agents[0];

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setIsDropZoneActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDropZoneActive(true);
  };

  const handleDragLeave = () => {
    setIsDropZoneActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDropZoneActive(false);
    
    if (draggedTask) {
      sendTaskToAI(draggedTask);
    }
  };

  const sendTaskToAI = (task: Task) => {
    const taskPrompt = generateTaskPrompt(task);
    const userMessage = createUserMessage(taskPrompt, task);
    setMessages([...messages, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const response = generateAIResponse(task, selectedAgent);
      const aiMessage = createAssistantMessage(response);
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = createUserMessage(inputValue);
    setMessages([...messages, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = createAssistantMessage(
        `I'm here to help! As your ${currentAgent.name}, I can assist you with your tasks and work management. What would you like to focus on?`
      );
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);

    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt);
    setTimeout(() => handleSendMessage(), 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4B6BFB] to-[#6B8AFF] flex items-center justify-center shadow-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="mb-1">My Work Space</h1>
            <p className="text-sm text-muted-foreground mb-0">
              Today's tasks with AI assistance
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
          </Badge>
          <Badge variant="outline" className="gap-2">
            <Clock className="w-4 h-4" />
            {todayTasks.length} tasks due today
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Today's Tasks (1 column) */}
        <div className="space-y-4 lg:col-span-1">
          <QuickTipCard 
            show={showQuickTip} 
            onClose={() => setShowQuickTip(false)} 
          />

          <TasksList
            tasks={todayTasks}
            onTaskDragStart={handleDragStart}
            onTaskDragEnd={handleDragEnd}
            onTaskSendToAI={sendTaskToAI}
          />
        </div>

        {/* Right Column - AI Chat (2 columns) */}
        <div className="lg:sticky lg:top-8 h-fit lg:col-span-2">
          <ChatInterface
            messages={messages}
            agents={agents}
            selectedAgent={selectedAgent}
            currentAgent={currentAgent}
            draggedTask={draggedTask}
            isDropZoneActive={isDropZoneActive}
            inputValue={inputValue}
            onAgentSelect={setSelectedAgent}
            onPromptClick={handlePromptClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onInputChange={setInputValue}
            onSendMessage={handleSendMessage}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
    </div>
  );
}
