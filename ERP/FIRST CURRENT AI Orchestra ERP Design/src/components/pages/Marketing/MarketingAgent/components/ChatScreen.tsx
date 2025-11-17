import { motion } from "motion/react";
import { Card } from "../../../../ui/card";
import { Badge } from "../../../../ui/badge";
import { Button } from "../../../../ui/button";
import { Textarea } from "../../../../ui/textarea";
import { Send } from "lucide-react";
import { Message, Agent } from "../types";
import { RoboticAvatar } from "./RoboticAvatar";

interface ChatScreenProps {
  messages: Message[];
  currentAgent: Agent;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export function ChatScreen({
  messages,
  currentAgent,
  inputValue,
  onInputChange,
  onSend,
  onKeyDown,
}: ChatScreenProps) {
  return (
    <div className="max-w-4xl w-full h-full flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-6 mb-6">
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.role === "assistant" && (
              <div className="flex items-start gap-3 max-w-[80%]">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${currentAgent.color}, ${currentAgent.color}dd)`,
                  }}
                >
                  <RoboticAvatar color="white" size={32} />
                </div>
                <Card className="p-4 border-glass-border bg-glass-bg/30 backdrop-blur-sm">
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className="opacity-40 mt-2">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </Card>
              </div>
            )}
            
            {message.role === "user" && (
              <div className="flex items-start gap-3 max-w-[80%]">
                <Card className="p-4 bg-[#4B6BFB] text-white">
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className="opacity-60 mt-2">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </Card>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white">Y</span>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Input Area - Fixed at bottom */}
      <Card className="p-4 border-glass-border bg-glass-bg/30 backdrop-blur-sm shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: `${currentAgent.color}20` }}>
            <RoboticAvatar color={currentAgent.color} size={20} />
          </div>
          <Badge variant="outline" className="gap-1" style={{ borderColor: currentAgent.color, color: currentAgent.color }}>
            {currentAgent.name}
          </Badge>
        </div>
        <div className="flex items-end gap-3">
          <Textarea
            placeholder={`Ask ${currentAgent.name} anything...`}
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={onKeyDown}
            className="min-h-[60px] max-h-[200px] resize-none bg-background/50 border-glass-border"
          />
          <Button
            onClick={onSend}
            disabled={!inputValue.trim()}
            className="gap-2 h-[60px] px-6"
            style={{
              backgroundColor: currentAgent.color,
            }}
          >
            <Send className="w-4 h-4" />
            Send
          </Button>
        </div>
      </Card>
    </div>
  );
}
