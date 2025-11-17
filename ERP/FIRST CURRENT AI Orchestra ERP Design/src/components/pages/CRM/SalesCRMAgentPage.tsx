"use client";

import { Card } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Send,
  Sparkles,
  Users,
  Target,
  TrendingUp,
  MessageSquare,
  Calendar,
  DollarSign,
  Brain,
  Zap,
  Clock,
  UserPlus,
  BarChart3,
  Heart,
  CalendarDays,
  Store,
  ShoppingBag,
  Briefcase,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

type AgentType = "sales-leader" | "conversation" | "product-expert";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Agent {
  id: AgentType;
  name: string;
  icon: any;
  color: string;
  gradient: string;
  description: string;
  quote: string;
}

interface Notice {
  id: string;
  message: string;
  color: string;
  bgColor: string;
}

export function SalesCRMAgentPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isAgentSelectorOpen, setIsAgentSelectorOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AgentType>("sales-leader");
  const [dateRange, setDateRange] = useState("today");
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [notices, setNotices] = useState<Notice[]>([
    {
      id: "1",
      message: "🎯 Q4 sales target: $2.5M - Currently at 68% completion. Great momentum team!",
      color: "#4B6BFB",
      bgColor: "rgba(75, 107, 251, 0.1)",
    },
    {
      id: "2",
      message: "⚡ 23 hot leads require follow-up today. Priority: TechCorp Industries ($250K potential)",
      color: "#10B981",
      bgColor: "rgba(16, 185, 129, 0.1)",
    },
  ]);

  // Sales data based on selected date range
  const getSalesData = () => {
    const dataByRange: { [key: string]: any } = {
      today: {
        revenue: 8450,
        target: 10000,
        shifts: [
          { name: "Morning (6AM-2PM)", revenue: 3200, percentage: 37.9 },
          { name: "Afternoon (2PM-10PM)", revenue: 4100, percentage: 48.5 },
          { name: "Night (10PM-6AM)", revenue: 1150, percentage: 13.6 },
        ],
        channels: [
          { name: "Ebes", revenue: 2100, color: "#4B6BFB" },
          { name: "Hebes", revenue: 1800, color: "#9B51E0" },
          { name: "Ritamie", revenue: 1500, color: "#27AE60" },
          { name: "Ecommerce", revenue: 2050, color: "#F2C94C" },
          { name: "Showroom Flagship", revenue: 1000, color: "#EB5757" },
        ],
        segments: [
          { name: "New", count: 45, color: "#4B6BFB" },
          { name: "Returning", count: 128, color: "#27AE60" },
          { name: "Loyal", count: 67, color: "#F2C94C" },
          { name: "VIP", count: 23, color: "#9B51E0" },
        ],
      },
      yesterday: {
        revenue: 9200,
        target: 10000,
        shifts: [
          { name: "Morning (6AM-2PM)", revenue: 3500, percentage: 38.0 },
          { name: "Afternoon (2PM-10PM)", revenue: 4600, percentage: 50.0 },
          { name: "Night (10PM-6AM)", revenue: 1100, percentage: 12.0 },
        ],
        channels: [
          { name: "Ebes", revenue: 2300, color: "#4B6BFB" },
          { name: "Hebes", revenue: 1900, color: "#9B51E0" },
          { name: "Ritamie", revenue: 1600, color: "#27AE60" },
          { name: "Ecommerce", revenue: 2400, color: "#F2C94C" },
          { name: "Showroom Flagship", revenue: 1000, color: "#EB5757" },
        ],
        segments: [
          { name: "New", count: 52, color: "#4B6BFB" },
          { name: "Returning", count: 135, color: "#27AE60" },
          { name: "Loyal", count: 71, color: "#F2C94C" },
          { name: "VIP", count: 28, color: "#9B51E0" },
        ],
      },
    };
    return dataByRange[dateRange] || dataByRange.today;
  };

  const salesData = getSalesData();
  const revenuePercentage = (salesData.revenue / salesData.target) * 100;

  const agents: Agent[] = [
    {
      id: "sales-leader",
      name: "Sales Leader AI",
      icon: Briefcase,
      color: "#4B6BFB",
      gradient: "from-[#4B6BFB] to-[#6B8AFF]",
      description: "Your intelligent sales strategist. I analyze pipelines, forecast revenue, identify opportunities, and help you close more deals faster.",
      quote: "Success in sales is 10% inspiration and 90% preparation.",
    },
    {
      id: "conversation",
      name: "Conversation AI",
      icon: MessageSquare,
      color: "#EC4899",
      gradient: "from-[#EC4899] to-[#F472B6]",
      description: "Expert in customer engagement and communication. I craft personalized outreach, follow-ups, and help you build lasting relationships.",
      quote: "The art of conversation is the art of hearing as well as being heard.",
    },
    {
      id: "product-expert",
      name: "Product Expert AI",
      icon: Target,
      color: "#10B981",
      gradient: "from-[#10B981] to-[#34D399]",
      description: "Deep product knowledge specialist. I help position products, handle objections, and create compelling value propositions.",
      quote: "People don't buy products, they buy better versions of themselves.",
    },
  ];

  const currentAgent = agents.find((a) => a.id === selectedAgent) || agents[0];

  const agentPrompts = {
    "sales-leader": [
      { icon: BarChart3, text: "Analyze my pipeline and suggest actions", color: "#4B6BFB" },
      { icon: Target, text: "Which deals need immediate attention?", color: "#10B981" },
      { icon: TrendingUp, text: "Forecast revenue for next quarter", color: "#F59E0B" },
      { icon: Zap, text: "Identify top conversion opportunities", color: "#8B5CF6" },
    ],
    "conversation": [
      { icon: MessageSquare, text: "Draft follow-up email for TechCorp", color: "#EC4899" },
      { icon: UserPlus, text: "Create cold outreach sequence", color: "#10B981" },
      { icon: Heart, text: "Re-engagement message for dormant VIPs", color: "#4B6BFB" },
      { icon: Sparkles, text: "Personalized proposal for high-value lead", color: "#F59E0B" },
    ],
    "product-expert": [
      { icon: Target, text: "Best product match for enterprise client", color: "#10B981" },
      { icon: TrendingUp, text: "Handle pricing objections effectively", color: "#8B5CF6" },
      { icon: Briefcase, text: "Create competitive comparison sheet", color: "#4B6BFB" },
      { icon: Zap, text: "Craft compelling product demo script", color: "#F59E0B" },
    ],
  };

  const suggestedPrompts = agentPrompts[selectedAgent];

  // Auto-rotate suggested prompts
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromptIndex((prev) => (prev + 1) % suggestedPrompts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [suggestedPrompts.length]);

  const currentPrompt = suggestedPrompts[currentPromptIndex];

  // Robotic Avatar SVG Component
  const RoboticAvatar = ({ color, size = 64 }: { color: string; size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Robot head */}
      <rect x="12" y="16" width="24" height="20" rx="4" fill={color} opacity="0.9" />
      
      {/* Antenna */}
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
      
      {/* Eyes - glowing rectangles */}
      <rect x="17" y="22" width="5" height="4" rx="1" fill="white" opacity="0.9" />
      <rect x="26" y="22" width="5" height="4" rx="1" fill="white" opacity="0.9" />
      
      {/* Eye glow */}
      <rect x="18" y="23" width="3" height="2" rx="0.5" fill={color} opacity="0.4" />
      <rect x="27" y="23" width="3" height="2" rx="0.5" fill={color} opacity="0.4" />
      
      {/* Mouth - digital smile */}
      <path
        d="M 19 30 L 21 32 L 23 30 L 25 32 L 27 30 L 29 32"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />
      
      {/* Side panels */}
      <rect x="10" y="20" width="2" height="8" rx="1" fill={color} opacity="0.7" />
      <rect x="36" y="20" width="2" height="8" rx="1" fill={color} opacity="0.7" />
      
      {/* Detail lines */}
      <line x1="14" y1="18" x2="34" y2="18" stroke="white" strokeWidth="0.5" opacity="0.3" />
      <line x1="14" y1="34" x2="34" y2="34" stroke="white" strokeWidth="0.5" opacity="0.3" />
      
      {/* Corner details */}
      <circle cx="15" cy="19" r="1" fill="white" opacity="0.5" />
      <circle cx="33" cy="19" r="1" fill="white" opacity="0.5" />
    </svg>
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    // Simulate AI response
    setTimeout(() => {
      const responses = {
        "sales-leader": `Analyzing "${inputMessage}" from a sales leadership perspective. I can help you with:\n\n• Pipeline health and deal progression\n• Revenue forecasting and trends\n• Team performance insights\n• Strategic opportunity identification\n• Win/loss analysis\n\nWhat specific area would you like to focus on?`,
        "conversation": `Looking at "${inputMessage}" for optimal customer engagement. I can assist with:\n\n• Personalized outreach strategies\n• Email and message templates\n• Follow-up sequences\n• Objection handling scripts\n• Relationship nurturing tactics\n\nLet's craft the perfect message together!`,
        "product-expert": `Considering "${inputMessage}" from a product perspective. I can provide:\n\n• Product positioning strategies\n• Feature-benefit mapping\n• Competitive differentiation\n• Pricing justification\n• Demo and presentation guidance\n\nWhich product challenge can I help solve?`,
      };

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responses[selectedAgent],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
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
    <div className="w-full h-full flex flex-col">
      {/* Notice Banners */}
      {notices.length > 0 && (
        <div className="space-y-3 mb-6">
          {notices.map((notice) => (
            <motion.div
              key={notice.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-lg border backdrop-blur-sm p-4 flex items-start gap-4"
              style={{
                borderLeftWidth: '4px',
                borderLeftColor: notice.color,
                backgroundColor: notice.bgColor,
                borderTopColor: 'var(--border)',
                borderRightColor: 'var(--border)',
                borderBottomColor: 'var(--border)',
              }}
            >
              <div
                className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                style={{ backgroundColor: notice.color }}
              />
              <p className="flex-1 leading-relaxed">{notice.message}</p>
              <button
                onClick={() => setNotices(notices.filter((n) => n.id !== notice.id))}
                className="flex-shrink-0 w-6 h-6 rounded-full hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-center transition-colors"
              >
                <X className="w-3 h-3 opacity-40 hover:opacity-100" />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Sales Statistics Dashboard - Compact */}
      <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50 mb-6">
        {/* Header with Date Range Selector */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="mb-0">Sales Overview</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <CalendarDays className="w-4 h-4" />
                <span>
                  {dateRange === "today"
                    ? "Today"
                    : dateRange === "yesterday"
                    ? "Yesterday"
                    : dateRange === "last7days"
                    ? "Last 7 Days"
                    : dateRange === "thismonth"
                    ? "This Month"
                    : "Custom Range"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => setDateRange("today")}
                className="cursor-pointer"
              >
                Today
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDateRange("yesterday")}
                className="cursor-pointer"
              >
                Yesterday
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDateRange("last7days")}
                className="cursor-pointer"
              >
                Last 7 Days
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDateRange("thismonth")}
                className="cursor-pointer"
              >
                This Month
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDateRange("custom")}
                className="cursor-pointer"
              >
                Custom Range
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Revenue Target Circle */}
          <div className="lg:col-span-1">
            <Card className="p-4 bg-gradient-to-br from-ai-blue/10 to-purple-500/10 border-ai-blue/30 h-full flex flex-col items-center justify-center">
              <p className="text-xs text-muted-foreground mb-2">Revenue Target</p>
              <div className="relative w-28 h-28 mb-2">
                {/* Background Circle */}
                <svg className="w-28 h-28 transform -rotate-90">
                  <circle
                    cx="56"
                    cy="56"
                    r="50"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-muted/20"
                  />
                  <motion.circle
                    cx="56"
                    cy="56"
                    r="50"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 50}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                    animate={{
                      strokeDashoffset: 2 * Math.PI * 50 * (1 - revenuePercentage / 100),
                    }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4B6BFB" />
                      <stop offset="100%" stopColor="#9B51E0" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-xl mb-0">{revenuePercentage.toFixed(0)}%</p>
                  <p className="text-xs text-muted-foreground">Complete</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-lg text-emerald-600 dark:text-emerald-400 mb-0">
                  ${salesData.revenue.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mb-0">
                  of ${salesData.target.toLocaleString()}
                </p>
              </div>
            </Card>
          </div>

          {/* Revenue by Shift */}
          <div className="lg:col-span-1">
            <Card className="p-4 bg-muted/30 border-border/50 h-full">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-ai-blue" />
                <h4 className="mb-0">Revenue by Shift</h4>
              </div>
              <div className="space-y-3">
                {salesData.shifts.map((shift: any, index: number) => (
                  <div key={shift.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs">{shift.name}</span>
                      <span className="text-xs">${shift.revenue.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background: index === 0 ? "#4B6BFB" : index === 1 ? "#27AE60" : "#F2C94C",
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${shift.percentage}%` }}
                        transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{shift.percentage}%</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Revenue by Omnichannel */}
          <div className="lg:col-span-1">
            <Card className="p-4 bg-muted/30 border-border/50 h-full">
              <div className="flex items-center gap-2 mb-3">
                <Store className="w-4 h-4 text-ai-blue" />
                <h4 className="mb-0">Omnichannel</h4>
              </div>
              <div className="space-y-2">
                {salesData.channels.map((channel: any, index: number) => (
                  <div key={channel.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: channel.color }}
                      />
                      <span className="text-xs truncate">{channel.name}</span>
                    </div>
                    <motion.span
                      className="text-xs ml-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      ${channel.revenue.toLocaleString()}
                    </motion.span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-xs opacity-60">Total</span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400">
                    ${salesData.revenue.toLocaleString()}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Customer Order Segments */}
          <div className="lg:col-span-1">
            <Card className="p-4 bg-muted/30 border-border/50 h-full">
              <div className="flex items-center gap-2 mb-3">
                <ShoppingBag className="w-4 h-4 text-ai-blue" />
                <h4 className="mb-0">Customer Segments</h4>
              </div>
              <div className="space-y-2.5">
                {salesData.segments.map((segment: any, index: number) => {
                  const total = salesData.segments.reduce((sum: number, s: any) => sum + s.count, 0);
                  const percentage = (segment.count / total) * 100;
                  return (
                    <div key={segment.name}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded"
                            style={{ backgroundColor: segment.color }}
                          />
                          <span className="text-xs">{segment.name}</span>
                        </div>
                        <span className="text-xs">{segment.count}</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: segment.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{percentage.toFixed(1)}%</p>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </Card>

      <div className="flex-1 flex flex-col items-center justify-center">
        {messages.length === 0 ? (
          // Welcome Screen
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl w-full space-y-8"
          >
            {/* AI Agent Header */}
            <div className="text-center space-y-4">
              {/* Clickable Robot Avatar */}
              <motion.button
                key={selectedAgent}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                onClick={() => setIsAgentSelectorOpen(!isAgentSelectorOpen)}
                className="inline-flex items-center justify-center w-24 h-24 rounded-full shadow-lg mb-4 cursor-pointer hover:scale-110 transition-transform"
                style={{
                  background: `linear-gradient(135deg, ${currentAgent.color}, ${currentAgent.color}dd)`,
                  boxShadow: `0 10px 40px ${currentAgent.color}40`,
                }}
              >
                <RoboticAvatar color="white" size={80} />
              </motion.button>
              
              {/* Agent Selector Lineup */}
              <AnimatePresence>
                {isAgentSelectorOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center justify-center gap-4 mb-4 overflow-hidden"
                  >
                    {agents.map((agent, index) => {
                      const isSelected = selectedAgent === agent.id;
                      return (
                        <motion.button
                          key={agent.id}
                          initial={{ opacity: 0, x: -50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.1, y: -5 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedAgent(agent.id);
                            setIsAgentSelectorOpen(false);
                          }}
                          className="flex flex-col items-center gap-2 group"
                        >
                          <div
                            className={`relative w-16 h-16 rounded-full transition-all ${
                              isSelected ? "ring-4 ring-offset-2" : "opacity-60 hover:opacity-100"
                            }`}
                            style={{
                              background: `linear-gradient(135deg, ${agent.color}, ${agent.color}dd)`,
                              ringColor: isSelected ? agent.color : "transparent",
                            }}
                          >
                            <div className="absolute inset-0 flex items-center justify-center">
                              <RoboticAvatar color="white" size={48} />
                            </div>
                            
                            {isSelected && (
                              <motion.div
                                className="absolute -inset-1 rounded-full opacity-50 blur-md"
                                style={{ backgroundColor: agent.color }}
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                            )}
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
              
              <h1 className={`bg-gradient-to-r ${currentAgent.gradient} bg-clip-text text-transparent`}>
                {currentAgent.name}
              </h1>
              
              <div className="max-w-2xl mx-auto">
                <p className="opacity-60 italic text-center">
                  "{currentAgent.quote}"
                </p>

                <p className="opacity-80 max-w-xl mx-auto">
                  {currentAgent.description}
                </p>
              </div>
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
                    className="p-6 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border-border/50 hover:border-ai-blue/50 transition-all duration-300 cursor-pointer h-full flex items-center gap-4 group"
                    onClick={() => handlePromptClick(currentPrompt.text)}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                      style={{
                        background: `linear-gradient(135deg, ${currentPrompt.color}20, ${currentPrompt.color}10)`,
                      }}
                    >
                      <currentPrompt.icon
                        className="w-6 h-6"
                        style={{ color: currentPrompt.color }}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="mb-0 group-hover:translate-x-1 transition-transform">
                        {currentPrompt.text}
                      </p>
                    </div>
                    <Zap
                      className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: currentPrompt.color }}
                    />
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Input Area */}
            <Card className="p-4 bg-card/80 backdrop-blur-sm border-border/50">
              <div className="flex gap-3">
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Ask ${currentAgent.name} anything...`}
                  className="flex-1 bg-background/50"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="px-6"
                  style={{
                    background: `linear-gradient(135deg, ${currentAgent.color}, ${currentAgent.color}dd)`,
                  }}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ) : (
          // Chat Messages
          <div className="w-full max-w-4xl flex flex-col h-full">
            {/* Chat Header */}
            <div className="flex items-center gap-3 mb-6 p-4 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${currentAgent.color}, ${currentAgent.color}dd)`,
                }}
              >
                <RoboticAvatar color="white" size={40} />
              </div>
              <div className="flex-1">
                <h3
                  className="mb-0"
                  style={{
                    background: `linear-gradient(135deg, ${currentAgent.color}, ${currentAgent.color}dd)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {currentAgent.name}
                </h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs text-muted-foreground">Online</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMessages([])}
              >
                New Chat
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`flex gap-3 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${currentAgent.color}, ${currentAgent.color}dd)`,
                        }}
                      >
                        <RoboticAvatar color="white" size={28} />
                      </div>
                    )}
                    <div
                      className={`max-w-[70%] ${
                        message.role === "user" ? "order-first" : ""
                      }`}
                    >
                      <div
                        className={`p-4 rounded-2xl ${
                          message.role === "user"
                            ? "bg-ai-blue text-white"
                            : "bg-muted/50"
                        }`}
                      >
                        <p className="mb-0 whitespace-pre-line">
                          {message.content}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 px-2">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {message.role === "user" && (
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                        <Users className="w-4 h-4" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <Card className="p-4 bg-card/80 backdrop-blur-sm border-border/50">
              <div className="flex gap-3">
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Message ${currentAgent.name}...`}
                  className="flex-1 bg-background/50"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="px-6"
                  style={{
                    background: `linear-gradient(135deg, ${currentAgent.color}, ${currentAgent.color}dd)`,
                  }}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
