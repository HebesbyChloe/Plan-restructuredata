import { Card } from "../../ui/card";
import { Download, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../../ui/button";

interface LogoVariation {
  name: string;
  bg: string;
  description: string;
  isDark?: boolean;
}

interface LogoSectionProps {
  logoVariations: LogoVariation[];
}

export function LogoSection({ logoVariations }: LogoSectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {logoVariations.map((logo, index) => (
          <motion.div
            key={logo.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden border-glass-border bg-glass-bg/30 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <div
                className="h-48 flex items-center justify-center p-8"
                style={{ backgroundColor: logo.bg }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#4B6BFB] to-[#6B8AFF] flex items-center justify-center"
                  >
                    <Sparkles className={`w-7 h-7 ${logo.isDark ? 'text-white' : 'text-white'}`} />
                  </div>
                  {logo.name !== "Icon Only" && (
                    <span
                      className={`text-2xl ${logo.isDark ? 'text-white' : 'text-gray-900'}`}
                      style={{ fontWeight: '600' }}
                    >
                      AI Orchestra
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4>{logo.name}</h4>
                  <Button size="sm" variant="ghost">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
                <p className="opacity-60">{logo.description}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Logo Specifications */}
      <Card className="p-6 border-glass-border bg-glass-bg/30 backdrop-blur-sm">
        <h3 className="mb-4">Logo Specifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-lg bg-accent/30">
            <h4 className="mb-2">Clear Space</h4>
            <p className="opacity-60">Maintain minimum clear space of 0.5x the logo height on all sides</p>
          </div>
          <div className="p-4 rounded-lg bg-accent/30">
            <h4 className="mb-2">Minimum Size</h4>
            <p className="opacity-60">Digital: 24px height | Print: 0.5 inches height</p>
          </div>
          <div className="p-4 rounded-lg bg-accent/30">
            <h4 className="mb-2">File Formats</h4>
            <p className="opacity-60">SVG for web, PNG for raster, PDF for print</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
