import { Card } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { motion } from "motion/react";
import {
  Folder,
  FolderOpen,
  Share2,
  Trash2,
  Edit2,
  MoreVertical,
  Sparkles,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../../ui/dropdown-menu";

interface FolderItem {
  id: string;
  name: string;
  description?: string;
  itemCount: number;
  lastModified: string;
  modifiedBy: string;
  color: string;
  tags?: string[];
  aiOptimized?: boolean;
  subFolders?: FolderItem[];
}

interface FolderCardProps {
  folder: FolderItem;
  index: number;
  onClick: (folderId: string) => void;
  onDelete: (folderId: string) => void;
}

export function FolderCard({ folder, index, onClick, onDelete }: FolderCardProps) {
  return (
    <motion.div
      key={folder.id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.03 }}
    >
      <Card
        className="overflow-hidden border-glass-border bg-glass-bg/30 backdrop-blur-sm hover:shadow-lg transition-all cursor-pointer group"
        onClick={() => onClick(folder.id)}
      >
        <div className="p-6">
          {/* Folder Icon & Actions */}
          <div className="flex items-start justify-between mb-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
              style={{ backgroundColor: `${folder.color}15` }}
            >
              <Folder className="w-8 h-8" style={{ color: folder.color }} />
            </div>

            <div className="flex items-center gap-2">
              {folder.aiOptimized && (
                <Badge
                  variant="outline"
                  className="gap-1 border-[#4B6BFB]/30 text-[#4B6BFB] bg-[#4B6BFB]/5"
                >
                  <Sparkles className="w-3 h-3" />
                  AI
                </Badge>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                    <FolderOpen className="w-4 h-4 mr-2" />
                    Open Folder
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(folder.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Folder Info */}
          <h4 className="mb-2 truncate">{folder.name}</h4>

          {folder.description && (
            <p className="text-sm opacity-60 mb-3 line-clamp-2">{folder.description}</p>
          )}

          {/* Tags */}
          {folder.tags && folder.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {folder.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Item Count */}
          <div className="pt-3 border-t border-glass-border">
            <div className="flex items-center justify-between">
              <span className="text-sm opacity-60">{folder.itemCount} items</span>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#4B6BFB] to-[#6B8AFF] flex items-center justify-center">
                  <span className="text-white text-xs">{folder.modifiedBy.charAt(0)}</span>
                </div>
              </div>
            </div>
            <div className="text-xs opacity-50 mt-1">Updated {folder.lastModified}</div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
