import { motion, AnimatePresence } from "motion/react";
import { X, Send, Sparkles } from "lucide-react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { useAgents } from "../../hooks/useAgents";
import { useTenantContext } from "../../contexts/TenantContext";

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  currentCategory: string;
}

interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  category?: string;
  color: string;
  gradient: string;
  greeting: string;
}

// Map category names to department names
const categoryToDepartment: Record<string, string> = {
  "Marketing": "marketing",
  "CRM": "crm",
  "Orders": "orders",
  "Products": "products",
  "Logistics": "logistics",
  "Fulfilment": "fulfillment",
  "Administration": "administration",
  "Reports": "reports",
  "Workspace": "workspace",
};

// Cute Robotic Avatar Component (same as AIAgentSelectionMain)
const RoboticAvatar = ({ color, size = 48 }: { color: string; size?: number }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Antenna with pulsing light */}
      <line x1="24" y1="18" x2="24" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <motion.circle
        cx="24"
        cy="10"
        r="3"
        fill={color}
        animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Main head - rounded rectangle */}
      <rect x="10" y="18" width="28" height="24" rx="8" fill={color} opacity="0.95" />
      
      {/* Cute big eyes */}
      <g>
        {/* Left eye */}
        <ellipse cx="18" cy="26" rx="4" ry="5" fill="white" opacity="0.95" />
        <motion.circle
          cx="18"
          cy="27"
          r="2.5"
          fill={color}
          animate={{ y: [0, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <circle cx="17.5" cy="26" r="1" fill="white" opacity="0.8" />
        
        {/* Right eye */}
        <ellipse cx="30" cy="26" rx="4" ry="5" fill="white" opacity="0.95" />
        <motion.circle
          cx="30"
          cy="27"
          r="2.5"
          fill={color}
          animate={{ y: [0, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <circle cx="29.5" cy="26" r="1" fill="white" opacity="0.8" />
      </g>
      
      {/* Cute smile */}
      <motion.path
        d="M 16 34 Q 24 38 32 34"
        stroke="white"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.9"
        animate={{ d: ["M 16 34 Q 24 38 32 34", "M 16 34 Q 24 39 32 34", "M 16 34 Q 24 38 32 34"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Cheek blush */}
      <circle cx="13" cy="30" r="2.5" fill="white" opacity="0.2" />
      <circle cx="35" cy="30" r="2.5" fill="white" opacity="0.2" />
      
      {/* Cute ears/handles */}
      <motion.rect
        x="6"
        y="24"
        width="3"
        height="10"
        rx="1.5"
        fill={color}
        opacity="0.7"
        animate={{ height: [10, 12, 10] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      <motion.rect
        x="39"
        y="24"
        width="3"
        height="10"
        rx="1.5"
        fill={color}
        opacity="0.7"
        animate={{ height: [10, 12, 10] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      
      {/* Small decorative dots */}
      <circle cx="24" cy="22" r="0.8" fill="white" opacity="0.4" />
      <circle cx="20" cy="22" r="0.6" fill="white" opacity="0.3" />
      <circle cx="28" cy="22" r="0.6" fill="white" opacity="0.3" />
    </svg>
  );
};

// Transform database agent to AIAssistant Agent format
function transformToAIAssistantAgent(dbAgent: any, category?: string): Agent {
  // Determine role based on agent name or department
  let role = "AI Assistant";
  if (dbAgent.id === "captain") {
    role = "Global AI Orchestra Leader";
  } else if (dbAgent.name.includes("Lead")) {
    role = dbAgent.name.replace(" Lead", "") + " Specialist";
  } else {
    role = dbAgent.name + " Specialist";
  }

  // Get greeting from description or quote, or create default
  const greeting = dbAgent.description 
    ? `Hello! I'm ${dbAgent.name}. ${dbAgent.description} How can I help you today?`
    : `Hi! I'm ${dbAgent.name}. I'm here to assist you. What would you like to know?`;

  return {
    id: dbAgent.id,
    name: dbAgent.name,
    role: role,
    description: dbAgent.description || "",
    category: category,
    color: dbAgent.color,
    gradient: dbAgent.gradient,
    greeting: greeting,
  };
}

export function AIAssistant({ isOpen, onClose, currentCategory }: AIAssistantProps) {
  const { currentTenantId } = useTenantContext();
  
  // Fetch all agents (global + department-specific)
  const { agents: dbAgents, loading: agentsLoading } = useAgents(undefined, currentTenantId);
  
  // Transform database agents to AIAssistant format
  const agents: Agent[] = dbAgents.map((agent: any) => {
    // agent.department is already a string array from the hook transformation
    // Find category from department array
    const dept = agent.department && Array.isArray(agent.department) && agent.department.length > 0 
      ? agent.department[0] 
      : undefined;
    const category = dept 
      ? Object.keys(categoryToDepartment).find(
          key => categoryToDepartment[key].toLowerCase() === dept.toLowerCase()
        ) || undefined
      : undefined;
    
    // Pass the full agent object with all properties
    return transformToAIAssistantAgent({
      id: agent.id,
      name: agent.name,
      description: agent.description,
      quote: agent.quote,
      color: agent.color,
      gradient: agent.gradient,
      department: agent.department || [],
    }, category);
  });

  // Get the function-specific agent based on current category
  const getFunctionAgent = () => {
    const department = categoryToDepartment[currentCategory];
    if (!department) return null;
    
    // Find agent where department array contains this department, or is a lead agent
    return agents.find(a => {
      if (a.id === `${department}-lead`) return true;
      // Check if agent's department array contains this department
      const dbAgent = dbAgents.find(da => da.id === a.id);
      return dbAgent?.department?.includes(department);
    });
  };

  const functionAgent = getFunctionAgent();
  const captainAgent = agents.find(a => a.id === "captain");

  // Default to function agent if available, otherwise Captain
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(
    functionAgent || captainAgent || null
  );
  
  const [isAgentSelectorOpen, setIsAgentSelectorOpen] = useState(false);

  // Update selected agent when category changes or agents load
  useEffect(() => {
    if (agentsLoading || !captainAgent) return;
    
    const newFunctionAgent = getFunctionAgent();
    if (newFunctionAgent && selectedAgent && selectedAgent.category !== currentCategory && selectedAgent.id !== "captain") {
      // If current agent doesn't match category, switch to new function agent
      setSelectedAgent(newFunctionAgent);
      setMessages([
        {
          role: "assistant",
          content: newFunctionAgent.greeting,
        },
      ]);
    } else if (!selectedAgent && captainAgent) {
      // Initialize with captain if no agent selected
      setSelectedAgent(captainAgent);
      setMessages([
        {
          role: "assistant",
          content: captainAgent.greeting,
        },
      ]);
    }
  }, [currentCategory, agentsLoading, agents, captainAgent]);

  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>(
    selectedAgent ? [
      {
        role: "assistant",
        content: selectedAgent.greeting,
      },
    ] : []
  );
  const [input, setInput] = useState("");

  const handleAgentChange = (agent: Agent) => {
    setSelectedAgent(agent);
    setMessages([
      {
        role: "assistant",
        content: agent.greeting,
      },
    ]);
    setIsAgentSelectorOpen(false);
  };

  const handleSend = () => {
    if (!input.trim() || !selectedAgent) return;

    const agentResponse = selectedAgent.id === "captain"
      ? "I'm analyzing your request across all ERP modules and coordinating the optimal solution. This is a demo response - in production, I would provide intelligent insights based on your complete ERP data."
      : `I'm processing your ${selectedAgent.category || "request"} with specialized expertise. This is a demo response - in production, I would provide function-specific insights and recommendations tailored to ${selectedAgent.category || "your needs"}.`;

    setMessages([
      ...messages,
      { role: "user", content: input },
      {
        role: "assistant",
        content: agentResponse,
      },
    ]);
    setInput("");
  };

  // Get available agents (Captain + function agent if exists)
  const availableAgents: Agent[] = [];
  if (captainAgent) {
    availableAgents.push(captainAgent);
  }
  if (functionAgent && functionAgent.id !== "captain") {
    availableAgents.push(functionAgent);
  }
  
  // Show loading state if agents are still loading
  if (agentsLoading || !selectedAgent) {
    return null; // Or show a loading state
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Assistant Panel - No backdrop, just fixed panel */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[90vw] md:w-[500px] z-50"
          >
            <Card className="h-full rounded-none border-l border-[#E5E5E5] dark:border-border bg-white dark:bg-card shadow-2xl flex flex-col">
              {/* Header with Agent Selection */}
              <div className="p-4 border-b border-[#E5E5E5] dark:border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3>AI Orchestra Assistant</h3>
                  <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Agent Selector - Horizontal Expanding Style */}
                <div className="flex flex-col items-center">
                  {/* Main Clickable Robot Avatar */}
                  <motion.button
                    key={selectedAgent.id}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    onClick={() => setIsAgentSelectorOpen(!isAgentSelectorOpen)}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform relative"
                    style={{
                      background: `linear-gradient(135deg, ${selectedAgent.color}, ${selectedAgent.color}dd)`,
                      boxShadow: `0 10px 40px ${selectedAgent.color}40`,
                    }}
                  >
                    <RoboticAvatar color="white" size={80} />
                    
                    {/* Floating sparkles for Captain */}
                    {selectedAgent.id === "captain" && (
                      <motion.div
                        className="absolute -top-2 -right-2 w-4 h-4"
                        animate={{ 
                          scale: [1, 1.2, 1],
                          rotate: [0, 180, 360]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <Sparkles className="w-4 h-4 text-yellow-300" />
                      </motion.div>
                    )}
                  </motion.button>

                  {/* Agent Name and Role */}
                  <div className="text-center mt-3">
                    <div className="flex items-center gap-2 justify-center">
                      <span className="font-medium">{selectedAgent.name}</span>
                      {selectedAgent.id === "captain" && (
                        <Sparkles className="w-3 h-3 text-[#4B6BFB]" />
                      )}
                    </div>
                    <div className="text-xs opacity-60 mt-0.5">{selectedAgent.role}</div>
                  </div>
                  
                  {/* Agent Selector Lineup - Horizontal Expanding */}
                  <AnimatePresence>
                    {isAgentSelectorOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center justify-center gap-4 mt-4 overflow-hidden"
                      >
                        {availableAgents.map((agent, index) => {
                          const isSelected = selectedAgent.id === agent.id;
                          return (
                            <motion.button
                              key={agent.id}
                              initial={{ opacity: 0, x: -50 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -50 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ scale: 1.1, y: -5 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleAgentChange(agent)}
                              className="flex flex-col items-center gap-2 group"
                            >
                              <div
                                className={`relative w-14 h-14 rounded-full transition-all ${
                                  isSelected ? "ring-4 ring-offset-2" : "opacity-60 hover:opacity-100"
                                }`}
                                style={{
                                  background: `linear-gradient(135deg, ${agent.color}, ${agent.color}dd)`,
                                  ringColor: isSelected ? agent.color : "transparent",
                                  boxShadow: isSelected ? `0 8px 24px ${agent.color}50` : "none",
                                }}
                              >
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <RoboticAvatar color="white" size={56} />
                                </div>
                              </div>
                              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors font-medium">
                                {agent.name}
                              </span>
                            </motion.button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" && (
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center mr-2 flex-shrink-0 shadow-md"
                        style={{
                          background: `linear-gradient(135deg, ${selectedAgent.color}, ${selectedAgent.color}dd)`,
                        }}
                      >
                        <RoboticAvatar color="white" size={40} />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] p-3 rounded-xl ${
                        message.role === "user"
                          ? "bg-[#4B6BFB] text-white"
                          : "bg-white dark:bg-card border border-[#E5E5E5] dark:border-border"
                      }`}
                    >
                      {message.content}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-[#E5E5E5] dark:border-border">
                <div className="mb-2 text-xs opacity-60 flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: `linear-gradient(135deg, ${selectedAgent.color}, ${selectedAgent.color}dd)`,
                    }}
                  />
                  <span>Chatting with {selectedAgent.name}</span>
                </div>
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    placeholder={`Ask ${selectedAgent.name.split(" ")[0]}...`}
                    className="flex-1"
                  />
                  <Button onClick={handleSend} size="icon" className="bg-[#4B6BFB] hover:bg-[#3A5BEB]">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
