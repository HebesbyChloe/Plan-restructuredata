import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, X } from "lucide-react";
import { Card } from "../../../../ui/card";

interface QuickTipCardProps {
  show: boolean;
  onClose: () => void;
}

export function QuickTipCard({ show, onClose }: QuickTipCardProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-[#4B6BFB] relative">
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-6 h-6 rounded-md hover:bg-white/50 dark:hover:bg-black/20 flex items-center justify-center transition-colors group"
              aria-label="Close quick tip"
            >
              <X className="w-4 h-4 text-[#4B6BFB] group-hover:text-[#3B5BEB]" />
            </button>
            <div className="flex items-center gap-2 mb-2 pr-6">
              <AlertCircle className="w-5 h-5 text-[#4B6BFB]" />
              <h3 className="mb-0">Quick Tip</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-0">
              Drag any task card into the AI chat or click "Send to AI" for assistance!
            </p>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
