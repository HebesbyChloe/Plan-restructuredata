import { Send } from "lucide-react";
import { Textarea } from "../../../../ui/textarea";
import { Button } from "../../../../ui/button";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export function ChatInput({ value, onChange, onSend, onKeyDown }: ChatInputProps) {
  return (
    <div className="p-4 border-t border-[#E5E5E5] dark:border-border bg-[#F8F8F8] dark:bg-muted/30">
      <div className="flex gap-2">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask me anything about your tasks..."
          className="resize-none bg-white dark:bg-card border-[#E5E5E5] focus:border-[#4B6BFB] transition-colors"
          rows={2}
        />
        <Button
          onClick={onSend}
          className="self-end bg-gradient-to-r from-[#4B6BFB] to-[#6B8AFF] hover:from-[#3B5BEB] hover:to-[#5B7AEF] text-white"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
