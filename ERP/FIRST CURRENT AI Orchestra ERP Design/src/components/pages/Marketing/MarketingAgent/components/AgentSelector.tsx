import { motion, AnimatePresence } from "motion/react";
import { Agent, AgentType } from "../types";
import { RoboticAvatar } from "./RoboticAvatar";

interface AgentSelectorProps {
  agents: Agent[];
  selectedAgent: AgentType;
  currentAgent: Agent;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (agentId: AgentType) => void;
}

export function AgentSelector({
  agents,
  selectedAgent,
  currentAgent,
  isOpen,
  onToggle,
  onSelect,
}: AgentSelectorProps) {
  return (
    <>
      {/* Main Clickable Robot Avatar */}
      <motion.button
        key={selectedAgent}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        onClick={onToggle}
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
        {isOpen && (
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
                    onSelect(agent.id);
                    onToggle();
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
                    className={`transition-colors ${
                      isSelected ? "opacity-100" : "opacity-60 group-hover:opacity-100"
                    }`}
                    style={{ color: isSelected ? agent.color : "inherit" }}
                  >
                    {agent.name.replace(" Agent", "")}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
