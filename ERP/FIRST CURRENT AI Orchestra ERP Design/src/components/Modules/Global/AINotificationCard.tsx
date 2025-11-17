import { Card } from "../../ui/card";
import { Sparkles, LucideIcon } from "lucide-react";
import { Button } from "../../ui/button";
import { motion } from "motion/react";
import { ReactNode } from "react";

interface AINotificationCardProps {
  title?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: LucideIcon;
  details?: ReactNode;
  animated?: boolean;
}

export function AINotificationCard({
  title,
  message,
  actionLabel,
  onAction,
  icon: Icon = Sparkles,
  details,
  animated = true,
}: AINotificationCardProps) {
  const content = (
    <Card className="p-4 border-[#4B6BFB]/30 bg-gradient-to-r from-[#4B6BFB]/10 to-[#6B8AFF]/10 backdrop-blur-sm">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-[#4B6BFB]/20 shrink-0">
          <Icon className="w-5 h-5 text-[#4B6BFB]" />
        </div>
        <div className="flex-1 min-w-0">
          {title && <h4 className="mb-1">{title}</h4>}
          <p className="opacity-90 mb-0">{message}</p>
          {details && <div className="mt-3">{details}</div>}
        </div>
        {actionLabel && onAction && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onAction}
            className="text-[#4B6BFB] shrink-0"
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </Card>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
}
