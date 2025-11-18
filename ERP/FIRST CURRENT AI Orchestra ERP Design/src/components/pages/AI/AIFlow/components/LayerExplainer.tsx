import { Card } from "../../../../ui/card";
import { Cpu, MousePointer, MessageSquare, ExternalLink, CheckCircle2 } from "lucide-react";
import type { FlowLayer } from "../types";

interface LayerExplainerProps {
  layer: FlowLayer;
}

const explainers = {
  1: {
    title: "Layer 1: Automated",
    subtitle: "Always running in background",
    icon: Cpu,
    color: "#4B6BFB",
    description: "AI flows that work 24/7 without human input. They monitor, analyze, and optimize automatically.",
    features: [
      "No clicks needed - runs continuously",
      "Real-time monitoring and adjustments",
      "Handles routine, repetitive tasks",
    ],
  },
  2: {
    title: "Layer 2: On-Demand",
    subtitle: "Click to trigger AI tasks",
    icon: MousePointer,
    color: "#8B5CF6",
    description: "AI tools you activate when needed. Click a button, AI does the work, returns results.",
    features: [
      "You decide when to run it",
      "One-click execution, fast results",
      "Perfect for creative generation",
    ],
  },
  3: {
    title: "Layer 3: Interactive",
    subtitle: "Chat & collaborate with AI",
    icon: MessageSquare,
    color: "#10B981",
    description: "Conversational AI assistants. Discuss ideas, refine plans, iterate together in real-time.",
    features: [
      "Back-and-forth conversation",
      "Edit and adjust collaboratively",
      "Best for strategy and planning",
    ],
  },
  4: {
    title: "Layer 4: External Tools",
    subtitle: "Third-party integrations",
    icon: ExternalLink,
    color: "#F59E0B",
    description: "Connect popular external AI and creative tools to enhance your marketing workflows.",
    features: [
      "Quick access to external platforms",
      "Integrated with your workflows",
      "Expand your AI capabilities",
    ],
  },
};

export function LayerExplainer({ layer }: LayerExplainerProps) {
  const config = explainers[layer];
  const Icon = config.icon;

  return (
    <Card className="p-6 border-glass-border bg-gradient-to-r from-accent/30 to-accent/10 backdrop-blur-sm mb-4">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl" style={{ backgroundColor: `${config.color}20` }}>
          <Icon className="w-6 h-6" style={{ color: config.color }} />
        </div>
        <div className="flex-1">
          <div className="mb-3">
            <h3 className="mb-1">{config.title}</h3>
            <p className="text-sm opacity-60 mb-0">{config.subtitle}</p>
          </div>
          <p className="opacity-80 mb-3">{config.description}</p>
          <div className="grid grid-cols-3 gap-4">
            {config.features.map((feature, index) => (
              <div key={index} className="flex gap-2 items-start">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: config.color }} />
                <p className="text-sm opacity-70 mb-0">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
