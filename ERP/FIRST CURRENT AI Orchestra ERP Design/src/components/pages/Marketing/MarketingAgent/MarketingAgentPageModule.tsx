"use client";

import { useState, useEffect } from "react";
import { AgentType, Message } from "./types";
import { AGENTS, AGENT_PROMPTS, DEFAULT_NOTICES } from "./utils/constants";
import { generateAIResponse } from "./utils/helpers";
import { NoticesBanner, WelcomeScreen, ChatScreen } from "./components";

export function MarketingAgentPageModule() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [isAgentSelectorOpen, setIsAgentSelectorOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AgentType>("marketing");
  const [notices, setNotices] = useState(DEFAULT_NOTICES);

  const currentAgent = AGENTS.find((a) => a.id === selectedAgent) || AGENTS[0];
  const suggestedPrompts = AGENT_PROMPTS[selectedAgent];

  // Auto-rotate suggested prompts
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromptIndex((prev) => (prev + 1) % suggestedPrompts.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [suggestedPrompts.length]);

  const currentPrompt = suggestedPrompts[currentPromptIndex];

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateAIResponse(inputValue, selectedAgent),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);

    setInputValue("");
  };

  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDismissNotice = (id: string) => {
    setNotices(notices.filter((n) => n.id !== id));
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Notice Banners */}
      <NoticesBanner notices={notices} onDismiss={handleDismissNotice} />

      <div className="flex-1 flex flex-col items-center justify-center">
        {messages.length === 0 ? (
          <WelcomeScreen
            agents={AGENTS}
            currentAgent={currentAgent}
            selectedAgent={selectedAgent}
            suggestedPrompts={suggestedPrompts}
            currentPromptIndex={currentPromptIndex}
            currentPrompt={currentPrompt}
            inputValue={inputValue}
            isAgentSelectorOpen={isAgentSelectorOpen}
            onAgentToggle={() => setIsAgentSelectorOpen(!isAgentSelectorOpen)}
            onAgentSelect={setSelectedAgent}
            onPromptClick={handlePromptClick}
            onInputChange={setInputValue}
            onSend={handleSendMessage}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <ChatScreen
            messages={messages}
            currentAgent={currentAgent}
            inputValue={inputValue}
            onInputChange={setInputValue}
            onSend={handleSendMessage}
            onKeyDown={handleKeyDown}
          />
        )}
      </div>
    </div>
  );
}
