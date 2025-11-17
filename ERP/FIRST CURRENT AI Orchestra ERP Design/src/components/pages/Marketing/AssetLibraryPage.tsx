"use client";

import { Card } from "../../ui/card";
import { Plus, Grid3x3, List, Upload, FolderOpen, ChevronLeft, Image as ImageIcon, Video, FileText, Layout, Megaphone } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../../ui/button";
import { TabsContent } from "../../ui/tabs";
import { useState } from "react";
import { TabBar } from "../../layout";
import { toast } from "sonner";
import { AssetCard } from "../../Modules/Marketing/AssetCard";
import { FolderCard } from "../../Modules/Marketing/FolderCard";
import { LibraryStatsCards } from "../../Modules/Marketing/LibraryStatsCards";
import { AssetFilters } from "../../Modules/Marketing/AssetFilters";
import { AIOrganizationBanner } from "../../Modules/Marketing/AIOrganizationBanner";
import { sampleAssets, mainFolders, type Asset, type FolderItem } from "../../Modules/Marketing/assetLibraryData";

export default function AssetLibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedMainFolder, setSelectedMainFolder] = useState<string | null>(null);

  const assets = sampleAssets;
  const campaignAssets = assets.filter(a => a.tags.some(tag => ["Campaign", "Marketing", "Promotion"].includes(tag)));

  const getCurrentFolders = (): FolderItem[] => {
    if (selectedMainFolder === null) {
      return mainFolders;
    }
    const mainFolder = mainFolders.find((f) => f.id === selectedMainFolder);
    return mainFolder?.subFolders || [];
  };

  const getFilteredFolders = () => {
    const currentFolders = getCurrentFolders();
    if (!searchQuery) return currentFolders;
    return currentFolders.filter((folder) =>
      folder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      folder.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      folder.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const getFilteredAssets = () => {
    let filtered = assets;
    if (searchQuery) {
      filtered = filtered.filter((a) =>
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    if (selectedTags.length > 0) {
      filtered = filtered.filter((a) =>
        selectedTags.some((tag) => a.tags.includes(tag))
      );
    }
    return filtered;
  };

  const getAssetsByType = (type: Asset["type"]) => {
    return getFilteredAssets().filter((a) => a.type === type);
  };

  const handleFolderClick = (folderId: string) => {
    if (selectedMainFolder === null) {
      setSelectedMainFolder(folderId);
    } else {
      toast.info("Opening folder...");
    }
  };

  const handleBackClick = () => {
    setSelectedMainFolder(null);
  };

  const handleDeleteFolder = (folderId: string) => {
    toast.success(`Folder deleted successfully`);
  };

  const getBreadcrumb = () => {
    if (selectedMainFolder === null) return "All Folders";
    const mainFolder = mainFolders.find((f) => f.id === selectedMainFolder);
    return mainFolder?.name || "All Folders";
  };

  // Get all unique tags
  const allTags = Array.from(new Set(assets.flatMap((a) => a.tags)));

  // Calculate stats
  const currentFolders = getCurrentFolders();
  const totalFolderItems = currentFolders.reduce((sum, f) => sum + f.itemCount, 0);
  const aiOptimizedCount = currentFolders.filter((f) => f.aiOptimized).length;

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4 sm:mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl mb-1 sm:mb-2">Asset Library</h1>
            <p className="text-sm sm:text-base opacity-60">Centralized repository for all marketing and brand assets</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="flex-shrink-0"
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="flex-shrink-0"
            >
              <List className="w-4 h-4" />
            </Button>
            <AssetFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              allTags={allTags}
              isFilterOpen={isFilterOpen}
              setIsFilterOpen={setIsFilterOpen}
            />
            <Button className="gap-2 bg-[#4B6BFB] hover:bg-[#3A5BEB] w-full sm:w-auto">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Upload Assets</span>
              <span className="sm:hidden">Upload</span>
            </Button>
          </div>
        </div>

        {/* AI Organization Banner */}
        <AIOrganizationBanner />
      </motion.div>

      {/* Tabs */}
      <TabBar
        defaultValue="folders"
        tabs={[
          { value: "folders", label: "Folders", icon: FolderOpen },
          { value: "campaign", label: "Campaign", icon: Megaphone, count: campaignAssets.length },
          { value: "images", label: "Images", icon: ImageIcon, count: getAssetsByType("image").length },
          { value: "videos", label: "Videos", icon: Video, count: getAssetsByType("video").length },
          { value: "documents", label: "Documents", icon: FileText, count: getAssetsByType("document").length },
          { value: "templates", label: "Templates", icon: Layout, count: getAssetsByType("template").length },
        ]}
      >
        {/* Folders Tab */}
        <TabsContent value="folders">
          {/* Breadcrumb and Back Button */}
          {selectedMainFolder !== null && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Button
                variant="ghost"
                onClick={handleBackClick}
                className="gap-2 mb-4"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to All Folders
              </Button>
              <div className="flex items-center gap-2 text-sm opacity-60">
                <FolderOpen className="w-4 h-4" />
                <span>{getBreadcrumb()}</span>
              </div>
            </motion.div>
          )}

          {/* Stats Overview */}
          <LibraryStatsCards
            totalFolders={currentFolders.length}
            totalItems={totalFolderItems}
            aiOptimizedCount={aiOptimizedCount}
          />

          {/* Folders Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedMainFolder || "main"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {getFilteredFolders().map((folder, index) => (
                <FolderCard
                  key={folder.id}
                  folder={folder}
                  index={index}
                  onClick={handleFolderClick}
                  onDelete={handleDeleteFolder}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Empty State */}
          {getFilteredFolders().length === 0 && (
            <Card className="p-12 text-center border-glass-border bg-glass-bg/30 backdrop-blur-sm">
              <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <h3 className="mb-2">No folders found</h3>
              <p className="opacity-60 mb-4">
                {searchQuery ? "Try adjusting your search query" : "Create your first folder to get started"}
              </p>
              {!searchQuery && (
                <Button className="gap-2 bg-[#4B6BFB] hover:bg-[#3A5BEB]">
                  <Plus className="w-4 h-4" />
                  Create Folder
                </Button>
              )}
            </Card>
          )}
        </TabsContent>

        {/* Campaign */}
        <TabsContent value="campaign">
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6" : "space-y-3"}>
            {campaignAssets.map((asset, index) => (
              <AssetCard key={asset.id} asset={asset} index={index} viewMode={viewMode} />
            ))}
          </div>
          {campaignAssets.length === 0 && (
            <Card className="p-12 text-center border-glass-border bg-glass-bg/30 backdrop-blur-sm">
              <Megaphone className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <p className="opacity-60 mb-0">No campaign assets found</p>
            </Card>
          )}
        </TabsContent>

        {/* Images */}
        <TabsContent value="images">
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6" : "space-y-3"}>
            {getAssetsByType("image").map((asset, index) => (
              <AssetCard key={asset.id} asset={asset} index={index} viewMode={viewMode} />
            ))}
          </div>
          {getAssetsByType("image").length === 0 && (
            <Card className="p-12 text-center border-glass-border bg-glass-bg/30 backdrop-blur-sm">
              <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <p className="opacity-60 mb-0">No image assets found</p>
            </Card>
          )}
        </TabsContent>

        {/* Videos */}
        <TabsContent value="videos">
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6" : "space-y-3"}>
            {getAssetsByType("video").map((asset, index) => (
              <AssetCard key={asset.id} asset={asset} index={index} viewMode={viewMode} />
            ))}
          </div>
          {getAssetsByType("video").length === 0 && (
            <Card className="p-12 text-center border-glass-border bg-glass-bg/30 backdrop-blur-sm">
              <Video className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <p className="opacity-60 mb-0">No video assets found</p>
            </Card>
          )}
        </TabsContent>

        {/* Documents */}
        <TabsContent value="documents">
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6" : "space-y-3"}>
            {getAssetsByType("document").map((asset, index) => (
              <AssetCard key={asset.id} asset={asset} index={index} viewMode={viewMode} />
            ))}
          </div>
          {getAssetsByType("document").length === 0 && (
            <Card className="p-12 text-center border-glass-border bg-glass-bg/30 backdrop-blur-sm">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <p className="opacity-60 mb-0">No document assets found</p>
            </Card>
          )}
        </TabsContent>

        {/* Templates */}
        <TabsContent value="templates">
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6" : "space-y-3"}>
            {getAssetsByType("template").map((asset, index) => (
              <AssetCard key={asset.id} asset={asset} index={index} viewMode={viewMode} />
            ))}
          </div>
          {getAssetsByType("template").length === 0 && (
            <Card className="p-12 text-center border-glass-border bg-glass-bg/30 backdrop-blur-sm">
              <Layout className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <p className="opacity-60 mb-0">No template assets found</p>
            </Card>
          )}
        </TabsContent>
      </TabBar>
    </div>
  );
}
