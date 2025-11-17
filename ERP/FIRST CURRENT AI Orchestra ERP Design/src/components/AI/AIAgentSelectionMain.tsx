import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, LucideIcon } from "lucide-react";

// Cute Robotic Avatar Component
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

export interface Agent {
  id: string;
  name: string;
  description: string;
  color: string;
  gradient: string;
  icon: LucideIcon;
}

interface AIAgentSelectionMainProps {
  agents: Agent[];
  selectedAgentId: string;
  onAgentSelect: (agentId: string) => void;
  size?: "small" | "medium" | "large";
  showSparkle?: boolean;
}

export function AIAgentSelectionMain({
  agents,
  selectedAgentId,
  onAgentSelect,
  size = "large",
  showSparkle = true,
}: AIAgentSelectionMainProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const currentAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];

  // Size configurations
  const sizeConfig = {
    small: {
      mainAvatar: 48,
      mainAvatarPx: "w-12 h-12",
      agentAvatar: 40,
      agentAvatarPx: "w-10 h-10",
      sparkleSize: "w-3 h-3",
      sparklePosition: "-top-1 -right-1",
    },
    medium: {
      mainAvatar: 80,
      mainAvatarPx: "w-20 h-20",
      agentAvatar: 56,
      agentAvatarPx: "w-14 h-14",
      sparkleSize: "w-4 h-4",
      sparklePosition: "-top-2 -right-2",
    },
    large: {
      mainAvatar: 128,
      mainAvatarPx: "w-32 h-32",
      agentAvatar: 80,
      agentAvatarPx: "w-20 h-20",
      sparkleSize: "w-5 h-5",
      sparklePosition: "-top-2 -right-2",
    },
  };

  const config = sizeConfig[size];

  const handleAgentClick = (agentId: string) => {
    onAgentSelect(agentId);
    setIsExpanded(false);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Main Clickable Robot Avatar */}
      <motion.button
        key={selectedAgentId}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className={`inline-flex items-center justify-center ${config.mainAvatarPx} rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform relative`}
        style={{
          background: `linear-gradient(135deg, ${currentAgent.color}, ${currentAgent.color}dd)`,
          boxShadow: `0 10px 40px ${currentAgent.color}40`,
        }}
      >
        <RoboticAvatar color="white" size={config.mainAvatar} />
        
        {/* Floating sparkles */}
        {showSparkle && (
          <motion.div
            className={`absolute ${config.sparklePosition} ${config.sparkleSize}`}
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Sparkles className={`${config.sparkleSize} text-yellow-300`} />
          </motion.div>
        )}
      </motion.button>
      
      {/* Agent Selector Lineup */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center justify-center gap-4 mt-4 overflow-hidden"
          >
            {agents.map((agent, index) => {
              const isSelected = selectedAgentId === agent.id;
              return (
                <motion.button
                  key={agent.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAgentClick(agent.id)}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div
                    className={`relative ${config.agentAvatarPx} rounded-full transition-all ${
                      isSelected ? "ring-4 ring-offset-2" : "opacity-60 hover:opacity-100"
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${agent.color}, ${agent.color}dd)`,
                      ringColor: isSelected ? agent.color : "transparent",
                      boxShadow: isSelected ? `0 8px 24px ${agent.color}50` : "none",
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <RoboticAvatar color="white" size={config.agentAvatar} />
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors font-medium">
                    {agent.name.replace(" Agent", "").replace(" Coach", "")}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
