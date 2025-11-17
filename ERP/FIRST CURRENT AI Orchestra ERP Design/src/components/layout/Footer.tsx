import { motion } from "motion/react";
import { Cpu } from "lucide-react";

interface FooterProps {
  onAIAssistantClick?: () => void;
}

export function Footer({ onAIAssistantClick }: FooterProps) {
  return (
    <div className="sticky bottom-0 w-full border-t border-glass-border backdrop-blur-xl bg-glass-bg/50 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6 opacity-60">
          <span>© 2025 AI Orchestra ERP</span>
          <span>v2.4.1</span>
        </div>

        <div 
          className="flex items-center gap-2 cursor-pointer hover:opacity-100 transition-opacity"
          onClick={onAIAssistantClick}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-green-500"
          />
          <Cpu className="w-4 h-4 text-[#4B6BFB]" />
          <span className="opacity-80">AI Engines Online</span>
        </div>
      </div>
    </div>
  );
}
