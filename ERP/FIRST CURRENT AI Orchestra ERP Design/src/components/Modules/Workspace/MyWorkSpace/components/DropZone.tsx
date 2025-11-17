import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Task } from "../types";

interface DropZoneProps {
  draggedTask: Task | null;
  isDropZoneActive: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
}

export function DropZone({
  draggedTask,
  isDropZoneActive,
  onDragOver,
  onDragLeave,
  onDrop,
}: DropZoneProps) {
  if (!draggedTask) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`absolute inset-0 flex items-center justify-center z-20 ${
        isDropZoneActive
          ? "bg-[#4B6BFB]/20 backdrop-blur-sm"
          : "bg-black/5 backdrop-blur-sm"
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="text-center">
        <motion.div
          animate={{
            scale: isDropZoneActive ? 1.1 : 1,
          }}
          className="w-20 h-20 rounded-full bg-gradient-to-r from-[#4B6BFB] to-[#6B8AFF] flex items-center justify-center mb-4 mx-auto"
        >
          <ArrowRight className="w-10 h-10 text-white" />
        </motion.div>
        <h3 className="mb-2">Drop Task Here</h3>
        <p className="text-sm text-muted-foreground mb-0">
          Let AI help you with this task
        </p>
      </div>
    </motion.div>
  );
}
