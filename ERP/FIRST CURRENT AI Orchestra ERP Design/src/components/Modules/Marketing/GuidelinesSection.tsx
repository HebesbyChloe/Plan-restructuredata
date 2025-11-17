import { Card } from "../../ui/card";
import { Check } from "lucide-react";
import { motion } from "motion/react";

interface GuidelineItem {
  title: string;
  items: string[];
}

interface GuidelinesSectionProps {
  brandGuidelines: GuidelineItem[];
}

export function GuidelinesSection({ brandGuidelines }: GuidelinesSectionProps) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {brandGuidelines.map((guideline, index) => (
          <motion.div
            key={guideline.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 border-glass-border bg-glass-bg/30 backdrop-blur-sm h-full">
              <h3 className="mb-4">{guideline.title}</h3>
              <div className="space-y-3">
                {guideline.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-green-500" />
                    </div>
                    <span className="opacity-80">{item}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="p-6 border-glass-border bg-glass-bg/30 backdrop-blur-sm mt-6">
        <h3 className="mb-4">Brand Voice Principles</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {["Clear", "Confident", "Helpful", "Innovative"].map((principle, index) => (
            <div key={principle} className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#4B6BFB]/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">
                  {index === 0 ? "💬" : index === 1 ? "💪" : index === 2 ? "🤝" : "✨"}
                </span>
              </div>
              <h4>{principle}</h4>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
