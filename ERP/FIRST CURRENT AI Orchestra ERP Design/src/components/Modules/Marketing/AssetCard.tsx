import { Card } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { motion } from "motion/react";
import {
  Download,
  Share2,
  Eye,
  Trash2,
  MoreVertical,
  Sparkles,
  Image as ImageIcon,
  Video,
  FileText,
  Layout,
  Palette,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../../ui/dropdown-menu";

interface Asset {
  id: string;
  name: string;
  type: "image" | "video" | "document" | "template" | "graphic";
  category: string;
  size: string;
  format: string;
  dimensions?: string;
  dateAdded: string;
  addedBy: string;
  tags: string[];
  url?: string;
  thumbnail?: string;
  usageCount?: number;
  aiScore?: number;
}

interface AssetCardProps {
  asset: Asset;
  index: number;
  viewMode: "grid" | "list";
}

const assetTypeColors = {
  image: "#4B6BFB",
  video: "#EC4899",
  document: "#10B981",
  template: "#F59E0B",
  graphic: "#8B5CF6",
};

const assetTypeIcons = {
  image: ImageIcon,
  video: Video,
  document: FileText,
  template: Layout,
  graphic: Palette,
};

export function AssetCard({ asset, index, viewMode }: AssetCardProps) {
  const Icon = assetTypeIcons[asset.type];

  if (viewMode === "list") {
    return (
      <motion.div
        key={asset.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.02 }}
      >
        <Card className="p-4 border-glass-border bg-glass-bg/30 backdrop-blur-sm hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${assetTypeColors[asset.type]}20` }}
            >
              <Icon className="w-8 h-8" style={{ color: assetTypeColors[asset.type] }} />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="mb-1 truncate">{asset.name}</h4>
              <div className="flex items-center gap-3 opacity-60">
                <span>{asset.format}</span>
                <span>•</span>
                <span>{asset.size}</span>
                {asset.dimensions && (
                  <>
                    <span>•</span>
                    <span>{asset.dimensions}</span>
                  </>
                )}
                <span>•</span>
                <span>{asset.dateAdded}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="opacity-60">Used</div>
                <div>{asset.usageCount}x</div>
              </div>

              {asset.aiScore && (
                <Badge variant="outline" className="gap-1 border-[#4B6BFB]/30 text-[#4B6BFB]">
                  <Sparkles className="w-3 h-3" />
                  {asset.aiScore}
                </Badge>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Edit Details</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      key={asset.id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.03 }}
    >
      <Card className="overflow-hidden border-glass-border bg-glass-bg/30 backdrop-blur-sm hover:shadow-lg transition-shadow group">
        <div
          className="h-40 flex items-center justify-center relative"
          style={{ backgroundColor: `${assetTypeColors[asset.type]}10` }}
        >
          <Icon className="w-16 h-16" style={{ color: assetTypeColors[asset.type] }} />

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <Button size="icon" variant="secondary" className="rounded-full">
              <Eye className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="secondary" className="rounded-full">
              <Download className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="secondary" className="rounded-full">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>

          {asset.aiScore && (
            <Badge
              variant="outline"
              className="absolute top-3 right-3 gap-1 border-[#4B6BFB]/30 text-[#4B6BFB] bg-background/90 backdrop-blur-sm"
            >
              <Sparkles className="w-3 h-3" />
              {asset.aiScore}
            </Badge>
          )}
        </div>

        <div className="p-4">
          <h4 className="mb-2 truncate">{asset.name}</h4>

          <div className="flex items-center gap-2 mb-3 opacity-60">
            <span>{asset.format}</span>
            <span>•</span>
            <span>{asset.size}</span>
          </div>

          {asset.dimensions && <div className="mb-3 opacity-60">{asset.dimensions}</div>}

          <div className="flex flex-wrap gap-1 mb-3">
            {asset.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-glass-border">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#4B6BFB] flex items-center justify-center">
                <span className="text-white text-xs">{asset.addedBy.charAt(0)}</span>
              </div>
              <span className="opacity-60">{asset.addedBy}</span>
            </div>
            <div className="opacity-60">{asset.usageCount}x</div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
