import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import { Task } from "../types";
import { TaskCard } from "./TaskCard";

interface TasksListProps {
  tasks: Task[];
  onTaskDragStart: (task: Task) => void;
  onTaskDragEnd: () => void;
  onTaskSendToAI: (task: Task) => void;
}

export function TasksList({ tasks, onTaskDragStart, onTaskDragEnd, onTaskSendToAI }: TasksListProps) {
  const tasksScrollRef = useRef<HTMLDivElement>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);

  // Check if tasks container is scrollable
  useEffect(() => {
    const checkScrollable = () => {
      if (tasksScrollRef.current) {
        const { scrollHeight, clientHeight, scrollTop } = tasksScrollRef.current;
        const isScrollable = scrollHeight > clientHeight;
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 10;
        setShowScrollIndicator(isScrollable && !isAtBottom);
      }
    };

    checkScrollable();
    window.addEventListener('resize', checkScrollable);
    
    const scrollContainer = tasksScrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScrollable);
    }

    return () => {
      window.removeEventListener('resize', checkScrollable);
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', checkScrollable);
      }
    };
  }, [tasks]);

  return (
    <div className="space-y-3 relative">
      <h3 className="mb-0">Tasks Due Today</h3>
      <div 
        ref={tasksScrollRef}
        className="space-y-3 max-h-[600px] overflow-y-auto pr-2 scroll-smooth"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#4B6BFB transparent',
        }}
      >
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDragStart={onTaskDragStart}
            onDragEnd={onTaskDragEnd}
            onSendToAI={onTaskSendToAI}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <AnimatePresence>
        {showScrollIndicator && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none flex items-end justify-center pb-2"
          >
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center"
            >
              <ChevronDown className="w-5 h-5 text-[#4B6BFB]" />
              <span className="text-xs text-[#4B6BFB]">Scroll for more</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
