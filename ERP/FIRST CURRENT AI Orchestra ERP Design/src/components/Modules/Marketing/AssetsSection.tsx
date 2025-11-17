import { Card } from "../../ui/card";
import { Download, Image } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";

interface BrandAsset {
  category: string;
  count: number;
  updated: string;
}

interface AssetsSectionProps {
  brandAssets: BrandAsset[];
}

export function AssetsSection({ brandAssets }: AssetsSectionProps) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brandAssets.map((asset, index) => (
          <motion.div
            key={asset.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="p-6 border-glass-border bg-glass-bg/30 backdrop-blur-sm hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-[#4B6BFB]/10 group-hover:bg-[#4B6BFB]/20 transition-colors">
                  <Image className="w-6 h-6 text-[#4B6BFB]" />
                </div>
                <Badge variant="secondary">{asset.count}</Badge>
              </div>
              <h4 className="mb-2">{asset.category}</h4>
              <p className="opacity-60 mb-4">Updated {asset.updated}</p>
              <Button variant="outline" size="sm" className="w-full gap-2">
                <Download className="w-4 h-4" />
                Download All
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="p-6 border-glass-border bg-glass-bg/30 backdrop-blur-sm mt-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="mb-2">Complete Brand Asset Package</h3>
            <p className="opacity-60">Download all brand assets in one comprehensive package</p>
          </div>
          <Button className="gap-2 bg-[#4B6BFB] hover:bg-[#3A5BEB]">
            <Download className="w-4 h-4" />
            Download (124 MB)
          </Button>
        </div>
      </Card>
    </div>
  );
}
