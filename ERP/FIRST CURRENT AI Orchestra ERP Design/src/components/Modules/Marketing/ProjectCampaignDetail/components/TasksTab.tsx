/**
 * Tasks Tab Component
 * Displays tasks with expandable deliverables and comments
 */

import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "../../../../ui/card";
import { Button } from "../../../../ui/button";
import { Badge } from "../../../../ui/badge";
import { Avatar, AvatarFallback } from "../../../../ui/avatar";
import {
  CheckSquare,
  ExternalLink,
  FileText,
  ChevronDown,
  ChevronUp,
  Flag,
  MessageSquare,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { TASK_DETAILS } from "../utils/constants";
import { getDeliverableSummaryColor, getDeliverableStatusColor } from "../utils/helpers";
import type { Task } from "../types";

interface TasksTabProps {
  tasks: Task[];
}

export function TasksTab({ tasks }: TasksTabProps) {
  const [showAllTasks, setShowAllTasks] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  return (
    <div className="space-y-3 mt-4">
      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-2 bg-gradient-to-r from-[#4B6BFB]/5 to-[#6B8AFF]/5 hover:from-[#4B6BFB]/10 hover:to-[#6B8AFF]/10 border-[#4B6BFB]/20 text-[#4B6BFB] hover:text-[#4B6BFB]"
          onClick={() => {
            toast.success("Opening project tasks in new tab...");
          }}
        >
          <CheckSquare className="w-3.5 h-3.5" />
          <span>All Tasks</span>
          <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 bg-gradient-to-r from-[#4B6BFB]/5 to-[#6B8AFF]/5 hover:from-[#4B6BFB]/10 hover:to-[#6B8AFF]/10 border-[#4B6BFB]/20 text-[#4B6BFB] hover:text-[#4B6BFB]"
          onClick={() => {
            toast.success("Opening project assets in new tab...");
          }}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>All Assets</span>
          <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
        </Button>
      </div>

      {/* Expandable Tasks List */}
      <Card className="bg-white dark:bg-card border-[#E5E5E5]">
        <div className="p-3 border-b border-[#E5E5E5] dark:border-border">
          <div className="flex items-center justify-between">
            <h4 className="mb-0 flex items-center gap-2 text-sm">
              <CheckSquare className="w-3.5 h-3.5 text-[#4B6BFB]" />
              Tasks & Deliverables ({tasks.length})
            </h4>
            {tasks.length > 5 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto py-1 px-2 text-xs"
                onClick={() => setShowAllTasks(!showAllTasks)}
              >
                {showAllTasks ? (
                  <>Show Less <ChevronUp className="w-3 h-3 ml-1" /></>
                ) : (
                  <>Show All ({tasks.length}) <ChevronDown className="w-3 h-3 ml-1" /></>
                )}
              </Button>
            )}
          </div>
        </div>

        <div className="max-h-[500px] overflow-y-auto">
          <div className="divide-y divide-[#E5E5E5] dark:divide-border">
            {(showAllTasks ? tasks : tasks.slice(0, 5)).map((task) => {
              const isExpanded = expandedTaskId === task.id;
              const details = TASK_DETAILS[task.id] || { deliverables: [], comments: [] };
              const approvedCount = details.deliverables.filter(d => d.status === "Approved").length;
              const totalDeliverables = details.deliverables.length;
              
              return (
                <div key={task.id}>
                  {/* Task Row - Clickable */}
                  <button
                    className="w-full p-3 flex items-center gap-3 hover:bg-accent/50 transition-colors text-left"
                    onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                  >
                    {/* Expand Icon */}
                    <div className="flex-shrink-0">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>

                    {/* Task Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm mb-0.5 truncate">{task.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{task.assignee}</span>
                        <span>•</span>
                        <span>{task.date}</span>
                      </div>
                    </div>

                    {/* Deliverable Status Icon */}
                    {totalDeliverables > 0 && (
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] ${
                          getDeliverableSummaryColor(approvedCount, totalDeliverables)
                        }`}>
                          <FileText className="w-3 h-3" />
                          <span>{approvedCount}/{totalDeliverables}</span>
                        </div>
                      </div>
                    )}

                    {/* Task Status Badge */}
                    <Badge 
                      variant="outline" 
                      className="flex-shrink-0 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.success(`Task status updated!`);
                      }}
                    >
                      {task.status}
                    </Badge>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="bg-[#F8F8F8] dark:bg-muted/30 border-t border-[#E5E5E5] dark:border-border"
                    >
                      <div className="p-3 space-y-3">
                        {/* Deliverables Section */}
                        {details.deliverables.length > 0 && (
                          <div>
                            <h5 className="text-xs mb-2 flex items-center gap-1.5 text-muted-foreground">
                              <Flag className="w-3 h-3" />
                              Deliverables
                            </h5>
                            <div className="space-y-1.5">
                              {details.deliverables.map((deliverable, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center p-2 rounded-lg bg-white dark:bg-card gap-2"
                                >
                                  <FileText className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                                  <span className="text-xs flex-1 min-w-0 truncate">{deliverable.name}</span>
                                  <div className="flex items-center gap-1.5 flex-shrink-0">
                                    <Badge
                                      variant="outline"
                                      className={`text-[10px] px-2 py-0.5 cursor-pointer hover:opacity-80 w-[70px] justify-center ${
                                        getDeliverableStatusColor(deliverable.status)
                                      }`}
                                      onClick={() => {
                                        toast.success(`Deliverable "${deliverable.name}" approved!`);
                                      }}
                                    >
                                      {deliverable.status}
                                    </Badge>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 flex-shrink-0"
                                      onClick={() => {
                                        toast.success(`Opening ${deliverable.name}...`);
                                      }}
                                    >
                                      <Eye className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Comments Section */}
                        {details.comments.length > 0 && (
                          <div>
                            <h5 className="text-xs mb-2 flex items-center gap-1.5 text-muted-foreground">
                              <MessageSquare className="w-3 h-3" />
                              Comments
                            </h5>
                            <div className="space-y-2">
                              {details.comments.map((comment, idx) => (
                                <div
                                  key={idx}
                                  className="p-2 rounded-lg bg-white dark:bg-card"
                                >
                                  <div className="flex items-center gap-1.5 mb-1">
                                    <Avatar className="w-5 h-5">
                                      <AvatarFallback className="text-[10px]">
                                        {comment.author.split(" ").map((n) => n[0]).join("")}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                      <p className="text-xs mb-0">{comment.author}</p>
                                      <p className="text-[10px] text-muted-foreground mb-0">
                                        {comment.date}
                                      </p>
                                    </div>
                                  </div>
                                  <p className="text-xs mb-0 pl-6 leading-relaxed">{comment.text}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* No deliverables or comments */}
                        {details.deliverables.length === 0 && details.comments.length === 0 && (
                          <p className="text-xs text-muted-foreground text-center py-2">
                            No deliverables or comments yet
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}
