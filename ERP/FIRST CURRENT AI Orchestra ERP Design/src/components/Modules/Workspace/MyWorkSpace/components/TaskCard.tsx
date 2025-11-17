import { motion } from "motion/react";
import { Calendar, User, Briefcase, Sparkles } from "lucide-react";
import { Card } from "../../../../ui/card";
import { Badge } from "../../../../ui/badge";
import { Task } from "../types";
import { getStatusColor } from "../utils/helpers";

interface TaskCardProps {
  task: Task;
  onDragStart: (task: Task) => void;
  onDragEnd: () => void;
  onSendToAI: (task: Task) => void;
}

export function TaskCard({ task, onDragStart, onDragEnd, onSendToAI }: TaskCardProps) {
  return (
    <motion.div
      key={task.id}
      draggable
      onDragStart={() => onDragStart(task)}
      onDragEnd={onDragEnd}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-move"
    >
      <Card className="bg-white dark:bg-card border-[#E5E5E5] dark:border-border hover:shadow-md transition-all overflow-hidden">
        <div className="p-4 cursor-pointer group">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-sm mb-0 line-clamp-2 flex-1 group-hover:text-[#4B6BFB] transition-colors">
                {task.title}
              </h4>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSendToAI(task);
                }}
                className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-r from-[#4B6BFB] to-[#6B8AFF] flex items-center justify-center text-white hover:shadow-lg hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
                title="Send to AI Assistant"
              >
                <Sparkles className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground mb-0 line-clamp-2">
              {task.description}
            </p>

            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(task.status)} variant="outline">
                  {task.status}
                </Badge>

                <Badge
                  variant="outline"
                  className="bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                >
                  <Briefcase className="w-3 h-3 mr-1" />
                  {task.project}
                </Badge>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{task.dueDate}</span>
                </div>

                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{task.assignee}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
