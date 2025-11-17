import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Sparkles, Users } from "lucide-react";

export interface Agent {
  id: string;
  name: string;
  icon: any;
  color: string;
  gradient: string;
  description: string;
  quote: string;
}

export interface PromptItem {
  icon: any;
  text: string;
  color: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AIchatboxdepartmentmainProps {
  agents: Agent[];
  defaultAgent: string;
  agentPrompts: { [key: string]: PromptItem[] };
  onSendMessage: (message: string, agentId: string) => Promise<string>;
}

export function AIchatboxdepartmentmain({
  agents,
  defaultAgent,
  agentPrompts,
  onSendMessage,
}: AIchatboxdepartmentmainProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isAgentSelectorOpen, setIsAgentSelectorOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(defaultAgent);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentAgent = agents.find((a) => a.id === selectedAgent) || agents[0];
  const suggestedPrompts = agentPrompts[selectedAgent] || [];

  // Robotic Avatar SVG Component
  const RoboticAvatar = ({ color, size = 64 }: { color: string; size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect x="12" y="16" width="24" height="20" rx="4" fill={color} opacity="0.9" />
      <line x1="24" y1="16" x2="24" y2="10" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="24" cy="9" r="2" fill={color} />
      <motion.circle
        cx="24"
        cy="9"
        r="3"
        fill={color}
        opacity="0.3"
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <rect x="17" y="22" width="5" height="4" rx="1" fill="white" opacity="0.9" />
      <rect x="26" y="22" width="5" height="4" rx="1" fill="white" opacity="0.9" />
      <rect x="18" y="23" width="3" height="2" rx="0.5" fill={color} opacity="0.4" />
      <rect x="27" y="23" width="3" height="2" rx="0.5" fill={color} opacity="0.4" />
      <path
        d="M 19 30 L 21 32 L 23 30 L 25 32 L 27 30 L 29 32"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />
      <rect x="10" y="20" width="2" height="8" rx="1" fill={color} opacity="0.7" />
      <rect x="36" y="20" width="2" height="8" rx="1" fill={color} opacity="0.7" />
      <line x1="14" y1="18" x2="34" y2="18" stroke="white" strokeWidth="0.5" opacity="0.3" />
      <line x1="14" y1="34" x2="34" y2="34" stroke="white" strokeWidth="0.5" opacity="0.3" />
      <circle cx="15" cy="19" r="1" fill="white" opacity="0.5" />
      <circle cx="33" cy="19" r="1" fill="white" opacity="0.5" />
    </svg>
  );

  // Auto-rotate suggested prompts
  useEffect(() => {
    if (suggestedPrompts.length === 0) return;
    const interval = setInterval(() => {
      setCurrentPromptIndex((prev) => (prev + 1) % suggestedPrompts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [suggestedPrompts.length]);

  const currentPrompt = suggestedPrompts[currentPromptIndex];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await onSendMessage(inputMessage, selectedAgent);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptClick = (prompt: string) => {
    setInputMessage(prompt);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Main Container */}
      <div className="flex-1 flex flex-col">
        {messages.length === 0 ? (
          // Welcome Screen
          <div className="flex-1 flex items-center justify-center p-6">
            <Card className="w-full max-w-5xl bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-2xl">
              <div className="p-8 md:p-12">
                {/* AI Agent Header */}
                <div className="text-center space-y-6 mb-8">
                  {/* Clickable Robot Avatar */}
                  <div className="flex justify-center">
                    <motion.button
                      key={selectedAgent}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      onClick={() => setIsAgentSelectorOpen(!isAgentSelectorOpen)}
                      className="w-24 h-24 rounded-full shadow-2xl cursor-pointer hover:scale-110 transition-all relative"
                      style={{
                        background: `linear-gradient(135deg, ${currentAgent.color}, ${currentAgent.color}dd)`,
                        boxShadow: `0 20px 60px ${currentAgent.color}40`,
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <RoboticAvatar color="white" size={80} />
                      </div>
                      <motion.div
                        className="absolute inset-0 rounded-full opacity-30 blur-2xl"
                        style={{ backgroundColor: currentAgent.color }}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                    </motion.button>
                  </div>

                  {/* Agent Selector Lineup */}
                  <AnimatePresence>
                    {isAgentSelectorOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center justify-center gap-6 overflow-hidden"
                      >
                        {agents.map((agent, index) => {
                          const isSelected = selectedAgent === agent.id;
                          return (
                            <motion.button
                              key={agent.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 20 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ scale: 1.1, y: -5 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setSelectedAgent(agent.id);
                                setIsAgentSelectorOpen(false);
                                setMessages([]);
                              }}
                              className="flex flex-col items-center gap-2 group"
                            >
                              <div
                                className={`relative w-16 h-16 rounded-full transition-all ${
                                  isSelected ? "ring-4 ring-offset-4 ring-offset-background" : "opacity-60 hover:opacity-100"
                                }`}
                                style={{
                                  background: `linear-gradient(135deg, ${agent.color}, ${agent.color}dd)`,
                                  boxShadow: isSelected ? `0 10px 30px ${agent.color}40` : "none",
                                }}
                              >
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <RoboticAvatar color="white" size={48} />
                                </div>
                              </div>
                              <span
                                className={`text-xs transition-colors ${
                                  isSelected ? "opacity-100" : "opacity-60 group-hover:opacity-100"
                                }`}
                                style={{ color: isSelected ? agent.color : "inherit" }}
                              >
                                {agent.name.replace(" AI", "")}
                              </span>
                            </motion.button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Agent Name and Quote */}
                  <div>
                    <h2
                      className="mb-3 bg-gradient-to-r bg-clip-text text-transparent"
                      style={{
                        backgroundImage: `linear-gradient(to right, ${currentAgent.color}, ${currentAgent.color}dd)`,
                      }}
                    >
                      {currentAgent.name}
                    </h2>
                    <p className="text-sm opacity-60 italic max-w-xl mx-auto">"{currentAgent.quote}"</p>
                  </div>

                  <p className="text-muted-foreground max-w-2xl mx-auto">{currentAgent.description}</p>
                </div>

                {/* Suggested Prompts Section */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-ai-blue" />
                      <h3 className="mb-0">Quick Actions</h3>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-xs border-ai-blue/30"
                      style={{ backgroundColor: `${currentAgent.color}10` }}
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-2 h-2 rounded-full mr-2"
                        style={{ backgroundColor: currentAgent.color }}
                      />
                      AI Powered
                    </Badge>
                  </div>

                  {/* Prompt Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {suggestedPrompts.map((prompt, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handlePromptClick(prompt.text)}
                        className="flex items-start gap-3 p-4 rounded-xl bg-muted/40 hover:bg-muted/60 border border-border/50 hover:border-border transition-all text-left group"
                      >
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                          style={{ backgroundColor: `${prompt.color}15` }}
                        >
                          <prompt.icon className="w-5 h-5" style={{ color: prompt.color }} />
                        </div>
                        <span className="text-sm flex-1">{prompt.text}</span>
                      </motion.button>
                    ))}
                  </div>

                  {/* Featured Rotating Prompt */}
                  {currentPrompt && (
                    <motion.div
                      key={currentPromptIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="p-4 rounded-xl border bg-white dark:bg-card border-[#E5E5E5] dark:border-border"
                      style={{
                        borderColor: `${currentPrompt.color}30`,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          className="flex-shrink-0"
                        >
                          <currentPrompt.icon className="w-5 h-5" style={{ color: currentPrompt.color }} />
                        </motion.div>
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground mb-1">Trending question</p>
                          <p className="text-sm mb-0">{currentPrompt.text}</p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handlePromptClick(currentPrompt.text)}
                          className="text-white flex-shrink-0"
                          style={{ backgroundColor: currentPrompt.color }}
                        >
                          Ask
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        ) : (
          // Chat Messages
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${currentAgent.color}, ${currentAgent.color}dd)`,
                      }}
                    >
                      <RoboticAvatar color="white" size={24} />
                    </div>
                  )}
                  <Card
                    className={`max-w-[80%] p-4 ${
                      message.role === "user"
                        ? "bg-ai-blue text-white border-ai-blue"
                        : "bg-white dark:bg-card border-[#E5E5E5] dark:border-border"
                    }`}
                  >
                    <p className="whitespace-pre-wrap mb-0">{message.content}</p>
                  </Card>
                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                  )}
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3 justify-start"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${currentAgent.color}, ${currentAgent.color}dd)`,
                    }}
                  >
                    <RoboticAvatar color="white" size={24} />
                  </div>
                  <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5] dark:border-border">
                    <div className="flex gap-1">
                      <motion.div
                        className="w-2 h-2 rounded-full bg-ai-blue"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 rounded-full bg-ai-blue"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.div
                        className="w-2 h-2 rounded-full bg-ai-blue"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                      />
                    </div>
                  </Card>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </div>

      {/* Input Area - Fixed at Bottom */}
      <div className="border-t bg-white dark:bg-card border-[#E5E5E5] dark:border-border">
        <div className="max-w-5xl mx-auto p-6">
          <div className="flex gap-3">
            <Input
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask ${currentAgent.name} anything...`}
              disabled={isLoading}
              className="flex-1 h-12 px-4 text-base bg-muted/50 border-border/50 focus:border-ai-blue/50 focus:ring-ai-blue/20"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="h-12 px-6 text-white"
              style={{ backgroundColor: currentAgent.color }}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3 mb-0 text-center">
            Press Enter to send • Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
