import { Card } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Progress } from "../../ui/progress";
import { Avatar, AvatarFallback } from "../../ui/avatar";
import {
  Briefcase,
  Calendar,
  Users,
  CheckSquare,
  MoreVertical,
  Sparkles,
  Star,
} from "lucide-react";
import { motion } from "motion/react";

export interface ProjectCampaignData {
  id: string;
  name: string;
  description: string;
  type: "project" | "campaign";
  status: "Active" | "Planning" | "Completed" | "On Hold" | "In Progress" | "Launching";
  progress: number;
  startDate: string;
  endDate: string;
  team: string[];
  totalTasks: number;
  completedTasks: number;
  color: string;
  leader?: string; // First team member or specified leader
}

interface CardProjectCampaignProps {
  project: ProjectCampaignData;
  onClick?: () => void;
}

export function CardProjectCampaign({ project, onClick }: CardProjectCampaignProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
      case "Launching":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      case "Planning":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800";
      case "Completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200 dark:border-gray-800";
      case "On Hold":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200 dark:border-gray-800";
    }
  };

  const leader = project.leader || project.team[0] || "Unassigned";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="p-6 bg-white dark:bg-card border-[#E5E5E5] dark:border-border hover:shadow-lg transition-all cursor-pointer overflow-hidden"
        onClick={onClick}
      >
        {/* Colored Top Border */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ backgroundColor: project.color }}
        />

        <div className="space-y-4 pt-1">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${project.color}20` }}
              >
                {project.type === "campaign" ? (
                  <Sparkles
                    className="w-6 h-6"
                    style={{ color: project.color }}
                  />
                ) : (
                  <Briefcase
                    className="w-6 h-6"
                    style={{ color: project.color }}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="mb-1 truncate">{project.name}</h3>
                <p className="text-sm text-muted-foreground mb-0 line-clamp-2">
                  {project.description}
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 flex-shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-[#4B6BFB] [&>div]:via-[#6B8AFF] [&>div]:to-[#8BA4FF]" />
          </div>

          <div className="flex items-center justify-between">
            <Badge className={getStatusColor(project.status)} variant="outline">
              {project.status}
            </Badge>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <CheckSquare className="w-3 h-3" />
                <span>{project.completedTasks}/{project.totalTasks}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{project.team.length}</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E5E5E5] dark:border-border">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>{project.startDate} - {project.endDate}</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Star className="w-3 h-3 text-[#DAB785]" />
                <span className="max-w-[100px] truncate">{leader}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
