import { motion, AnimatePresence } from "motion/react";
import { Avatar, AvatarFallback } from "../../../../ui/avatar";
import { Message, Agent } from "../types";

interface ChatMessagesProps {
  messages: Message[];
  currentAgent: Agent;
}

export function ChatMessages({ messages, currentAgent }: ChatMessagesProps) {
  return (
    <AnimatePresence>
      {messages.map((message) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`flex gap-3 ${
            message.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          {message.role === "assistant" && (
            <div 
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${currentAgent.color}, ${currentAgent.color}dd)`,
              }}
            >
              <currentAgent.icon className="w-4 h-4 text-white" />
            </div>
          )}
          <div
            className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              message.role === "user"
                ? "bg-gradient-to-r from-[#4B6BFB] to-[#6B8AFF] text-white"
                : "bg-accent"
            }`}
          >
            {message.taskContext && (
              <div className="mb-2 pb-2 border-b border-white/20">
                <p className="text-xs opacity-80 mb-0">
                  📋 Task: {message.taskContext.title}
                </p>
              </div>
            )}
            <p className="text-sm mb-0 whitespace-pre-wrap">
              {message.content}
            </p>
          </div>
          {message.role === "user" && (
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarFallback>You</AvatarFallback>
            </Avatar>
          )}
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
