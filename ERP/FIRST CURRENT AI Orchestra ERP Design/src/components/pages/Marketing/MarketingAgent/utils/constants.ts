import {
  Sparkles,
  PenTool,
  Database,
  ShoppingCart,
  Palette,
  TrendingUp,
  Target,
  Zap,
  BarChart3,
} from "lucide-react";
import { Agent, AgentPrompts } from "../types";

export const AGENTS: Agent[] = [
  {
    id: "marketing",
    name: "AI Marketing Agent",
    icon: Sparkles,
    color: "#4B6BFB",
    gradient: "from-[#4B6BFB] to-[#6B8AFF]",
    description: "Your intelligent marketing companion powered by AI. I can help you strategize campaigns, analyze performance, create content, and optimize your marketing efforts.",
    quote: "Marketing is no longer about the stuff you make, but the stories you tell.",
  },
  {
    id: "copywriter",
    name: "Copywriter Agent",
    icon: PenTool,
    color: "#EC4899",
    gradient: "from-[#EC4899] to-[#F472B6]",
    description: "Expert in crafting compelling copy that converts. I help you write engaging headlines, persuasive product descriptions, and impactful ad copy.",
    quote: "Words have the power to inspire action and create lasting impressions.",
  },
  {
    id: "analytics",
    name: "Data Analytics Agent",
    icon: Database,
    color: "#8B5CF6",
    gradient: "from-[#8B5CF6] to-[#A78BFA]",
    description: "Turn your data into actionable insights. I analyze metrics, identify trends, and provide data-driven recommendations to improve your marketing ROI.",
    quote: "In God we trust. All others must bring data.",
  },
  {
    id: "ecommerce",
    name: "E-commerce Expert Agent",
    icon: ShoppingCart,
    color: "#10B981",
    gradient: "from-[#10B981] to-[#34D399]",
    description: "Specialized in online retail success. I help optimize product listings, improve conversion rates, and maximize your e-commerce performance.",
    quote: "Your margin is my opportunity.",
  },
  {
    id: "design",
    name: "Visual & Design Agent",
    icon: Palette,
    color: "#F59E0B",
    gradient: "from-[#F59E0B] to-[#FBBF24]",
    description: "Creative visual strategist. I guide you on design principles, brand aesthetics, visual content creation, and maintaining consistent brand identity.",
    quote: "Design is not just what it looks like. Design is how it works.",
  },
];

export const AGENT_PROMPTS: AgentPrompts = {
  marketing: [
    { icon: TrendingUp, text: "Analyze our Q4 campaign performance", color: "#4B6BFB" },
    { icon: Target, text: "Create a social media strategy for product launch", color: "#10B981" },
    { icon: Zap, text: "Generate email campaign ideas for holiday season", color: "#F59E0B" },
    { icon: BarChart3, text: "Review our current marketing budget allocation", color: "#8B5CF6" },
  ],
  copywriter: [
    { icon: PenTool, text: "Write compelling product descriptions for new items", color: "#EC4899" },
    { icon: Target, text: "Create email subject lines with high open rates", color: "#10B981" },
    { icon: Sparkles, text: "Generate social media captions for this week", color: "#4B6BFB" },
    { icon: Zap, text: "Craft a persuasive landing page headline", color: "#F59E0B" },
  ],
  analytics: [
    { icon: BarChart3, text: "Compare performance across all marketing channels", color: "#8B5CF6" },
    { icon: TrendingUp, text: "Identify our top performing content types", color: "#10B981" },
    { icon: Database, text: "Analyze customer journey conversion funnel", color: "#4B6BFB" },
    { icon: Target, text: "Recommend budget optimization based on ROI", color: "#F59E0B" },
  ],
  ecommerce: [
    { icon: ShoppingCart, text: "Optimize product page conversion rates", color: "#10B981" },
    { icon: TrendingUp, text: "Analyze shopping cart abandonment reasons", color: "#8B5CF6" },
    { icon: Target, text: "Suggest cross-selling and upselling strategies", color: "#4B6BFB" },
    { icon: Zap, text: "Review and improve checkout flow", color: "#F59E0B" },
  ],
  design: [
    { icon: Palette, text: "Review brand consistency across all materials", color: "#F59E0B" },
    { icon: Sparkles, text: "Suggest visual improvements for social media", color: "#4B6BFB" },
    { icon: Target, text: "Create a color palette for holiday campaign", color: "#EC4899" },
    { icon: TrendingUp, text: "Design principles for better engagement", color: "#10B981" },
  ],
};

export const DEFAULT_NOTICES = [
  {
    id: "1",
    message: "This week is very important! Focus on the New Collection Launch - this will be a big win. Everyone stay focused.",
    color: "#4B6BFB",
    bgColor: "rgba(75, 107, 251, 0.1)",
  },
  {
    id: "2",
    message: "Q4 Campaign review meeting scheduled for Thursday 3PM. Please prepare your metrics.",
    color: "#10B981",
    bgColor: "rgba(16, 185, 129, 0.1)",
  },
];
