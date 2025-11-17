import { motion } from "motion/react";
import { X } from "lucide-react";
import { Notice } from "../types";

interface NoticesBannerProps {
  notices: Notice[];
  onDismiss: (id: string) => void;
}

export function NoticesBanner({ notices, onDismiss }: NoticesBannerProps) {
  if (notices.length === 0) return null;

  return (
    <div className="space-y-3 mb-6">
      {notices.map((notice) => (
        <motion.div
          key={notice.id}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="rounded-lg border backdrop-blur-sm p-4 flex items-start gap-4"
          style={{
            borderLeftWidth: '4px',
            borderLeftColor: notice.color,
            backgroundColor: notice.bgColor,
            borderTopColor: 'var(--border)',
            borderRightColor: 'var(--border)',
            borderBottomColor: 'var(--border)',
          }}
        >
          <div
            className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
            style={{ backgroundColor: notice.color }}
          />
          <p className="flex-1 leading-relaxed">{notice.message}</p>
          <button
            onClick={() => onDismiss(notice.id)}
            className="flex-shrink-0 w-6 h-6 rounded-full hover:bg-black/5 flex items-center justify-center transition-colors"
          >
            <X className="w-3 h-3 opacity-40 hover:opacity-100" />
          </button>
        </motion.div>
      ))}
    </div>
  );
}
