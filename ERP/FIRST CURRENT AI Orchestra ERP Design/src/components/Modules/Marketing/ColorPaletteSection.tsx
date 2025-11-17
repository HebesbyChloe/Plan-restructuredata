import { Card } from "../../ui/card";
import { Check, Copy } from "lucide-react";
import { motion } from "motion/react";
import { Badge } from "../../ui/badge";

interface ColorItem {
  name: string;
  hex: string;
  usage: string;
}

interface BrandColors {
  primary: ColorItem[];
  secondary: ColorItem[];
  neutral: ColorItem[];
}

interface ColorPaletteSectionProps {
  brandColors: BrandColors;
  copiedColor: string | null;
  onCopyColor: (hex: string, name: string) => void;
}

export function ColorPaletteSection({
  brandColors,
  copiedColor,
  onCopyColor,
}: ColorPaletteSectionProps) {
  return (
    <div className="space-y-6">
      {/* Primary Colors */}
      <div>
        <h3 className="mb-4">Primary Colors</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {brandColors.primary.map((color, index) => (
            <motion.div
              key={color.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="overflow-hidden border-glass-border bg-glass-bg/30 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <div
                  className="h-32 relative group cursor-pointer"
                  style={{ backgroundColor: color.hex }}
                  onClick={() => onCopyColor(color.hex, color.name)}
                >
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    {copiedColor === color.name ? (
                      <Badge className="bg-white text-black">Copied!</Badge>
                    ) : (
                      <Copy className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <div className="mb-1">{color.name}</div>
                  <div className="opacity-60 mb-2">{color.hex}</div>
                  <div className="opacity-50">{color.usage}</div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Secondary Colors */}
      <div>
        <h3 className="mb-4">Secondary Colors</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {brandColors.secondary.map((color, index) => (
            <motion.div
              key={color.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="overflow-hidden border-glass-border bg-glass-bg/30 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <div
                  className="h-24 relative group cursor-pointer"
                  style={{ backgroundColor: color.hex }}
                  onClick={() => onCopyColor(color.hex, color.name)}
                >
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    {copiedColor === color.name ? (
                      <Badge className="bg-white text-black">Copied!</Badge>
                    ) : (
                      <Copy className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                </div>
                <div className="p-3">
                  <div className="mb-1">{color.name}</div>
                  <div className="opacity-60">{color.hex}</div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Neutral Colors */}
      <div>
        <h3 className="mb-4">Neutral Palette</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {brandColors.neutral.map((color, index) => (
            <motion.div
              key={color.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="overflow-hidden border-glass-border bg-glass-bg/30 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <div
                  className="h-20 relative group cursor-pointer"
                  style={{ backgroundColor: color.hex }}
                  onClick={() => onCopyColor(color.hex, color.name)}
                >
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    {copiedColor === color.name ? (
                      <Badge className="bg-white text-black">Copied!</Badge>
                    ) : (
                      <Copy className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                </div>
                <div className="p-3">
                  <div className="mb-1">{color.name}</div>
                  <div className="opacity-60">{color.hex}</div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Color Accessibility */}
      <Card className="p-6 border-glass-border bg-glass-bg/30 backdrop-blur-sm">
        <h3 className="mb-4">Accessibility Guidelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-accent/30">
            <div className="flex items-center gap-2 mb-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>WCAG AAA Compliant</span>
            </div>
            <p className="opacity-60">All color combinations meet accessibility standards</p>
          </div>
          <div className="p-4 rounded-lg bg-accent/30">
            <div className="flex items-center gap-2 mb-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>Contrast Ratio: 4.5:1</span>
            </div>
            <p className="opacity-60">Ensures readability for all users</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
