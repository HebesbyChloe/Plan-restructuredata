import { Card } from "../../ui/card";
import { motion } from "motion/react";

interface TypographyType {
  name: string;
  size: string;
  weight: string;
  lineHeight: string;
  usage: string;
}

interface Typography {
  headings: TypographyType[];
  body: TypographyType[];
}

interface TypographySectionProps {
  typography: Typography;
}

export function TypographySection({ typography }: TypographySectionProps) {
  return (
    <div className="space-y-6">
      {/* Headings */}
      <div>
        <h3 className="mb-4">Headings</h3>
        <Card className="p-6 border-glass-border bg-glass-bg/30 backdrop-blur-sm">
          <div className="space-y-6">
            {typography.headings.map((type, index) => (
              <motion.div
                key={type.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="pb-6 border-b border-glass-border last:border-b-0 last:pb-0"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div>
                    <div
                      style={{
                        fontSize: type.size,
                        fontWeight: type.weight,
                        lineHeight: type.lineHeight,
                      }}
                    >
                      The quick brown fox
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="opacity-60">Type:</span>
                      <span>{type.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="opacity-60">Size:</span>
                      <span>{type.size}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="opacity-60">Weight:</span>
                      <span>{type.weight}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="opacity-60">Usage:</span>
                      <span>{type.usage}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Body Text */}
      <div>
        <h3 className="mb-4">Body Text</h3>
        <Card className="p-6 border-glass-border bg-glass-bg/30 backdrop-blur-sm">
          <div className="space-y-6">
            {typography.body.map((type, index) => (
              <motion.div
                key={type.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="pb-6 border-b border-glass-border last:border-b-0 last:pb-0"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div>
                    <div
                      style={{
                        fontSize: type.size,
                        fontWeight: type.weight,
                        lineHeight: type.lineHeight,
                      }}
                    >
                      The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="opacity-60">Type:</span>
                      <span>{type.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="opacity-60">Size:</span>
                      <span>{type.size}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="opacity-60">Weight:</span>
                      <span>{type.weight}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="opacity-60">Usage:</span>
                      <span>{type.usage}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Font Stack */}
      <Card className="p-6 border-glass-border bg-glass-bg/30 backdrop-blur-sm">
        <h3 className="mb-4">Font Stack</h3>
        <div className="p-4 rounded-lg bg-accent/30 font-mono">
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        </div>
        <p className="mt-4 opacity-60">
          We use system fonts for optimal performance and native feel across all platforms.
        </p>
      </Card>
    </div>
  );
}
