"use client";

import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  Search,
  Download,
  RefreshCw,
  Plus,
  ChevronDown,
  Folder,
  Upload,
  Package,
  TrendingUp,
  Eye,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CreateCollectionPanel } from "../../panels";
import { CollectionTableModule } from "../../Modules/Products";
import { Collection } from "../../Modules/Products/CollectionTable/types";
import { mockCollections } from "../../../sampledata/collections";
import { ProductDetailPanel } from "../../Modules/Products/ProductDetailPanel";

export function CollectionsManagerPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false);

  // Use sample data
  const [collections] = useState<Collection[]>(mockCollections);

  const handleCollectionClick = (collection: Collection) => {
    setSelectedCollection(collection);
    setIsDetailPanelOpen(true);
  };

  const filteredCollections = collections.filter(
    (collection) =>
      collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collection.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCollections = collections.length;
  const publishedCollections = collections.filter((c) => c.status === "published").length;
  const totalProducts = collections.reduce((sum, c) => sum + c.productCount, 0);

  return (
    <div className="w-full h-full bg-[#FAFAFA] dark:bg-background -m-8 p-8">
      {/* Summary Bar */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Collections</p>
              <h3 className="text-2xl mb-0">{totalCollections}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#F59E0B] to-[#FBBF24] flex items-center justify-center">
              <Folder className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Published</p>
              <h3 className="text-2xl mb-0">{publishedCollections}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
              <Eye className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Products</p>
              <h3 className="text-2xl mb-0">{totalProducts}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Avg. Products</p>
              <h3 className="text-2xl mb-0">{Math.round(totalProducts / totalCollections)}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="mb-2">Collections Manager</h1>
          <p className="text-muted-foreground mb-0">
            Organize products into collections
          </p>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-[#E5E5E5] bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
              Actions
              <ChevronDown className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Download className="w-4 h-4 mr-2" />
                Export
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Upload className="w-4 h-4 mr-2" />
                Import
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            className="gap-2 bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] hover:from-[#D97706] to-[#F59E0B] text-white shadow-md"
            onClick={() => setIsCreatePanelOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Create Collection
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-sm mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search collections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5] dark:border-border"
            />
          </div>

          <Select>
            <SelectTrigger className="w-[160px] bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[160px] bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="products">Product Count</SelectItem>
              <SelectItem value="created">Created Date</SelectItem>
              <SelectItem value="updated">Last Updated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Collections Table - Using Module */}
      <Card className="bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-md">
        <CollectionTableModule
          collections={filteredCollections}
          selectedCollection={selectedCollection}
          onCollectionClick={handleCollectionClick}
        />
      </Card>

      {/* Create Collection Panel */}
      <CreateCollectionPanel
        isOpen={isCreatePanelOpen}
        onClose={() => setIsCreatePanelOpen(false)}
        onSave={(collection) => {
          console.log("New collection:", collection);
          toast.success("Collection created successfully!");
        }}
      />

      {/* Collection Detail Panel */}
      {selectedCollection && (
        <ProductDetailPanel
          isOpen={isDetailPanelOpen}
          onClose={() => {
            setIsDetailPanelOpen(false);
            setSelectedCollection(null);
          }}
          title={selectedCollection.name}
          subtitle={selectedCollection.description ?? ''}
          productType="product"
          tabs={[
            {
              value: "overview",
              label: "Overview",
              content: (
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Status</p>
                      <p className="mb-0 capitalize">{selectedCollection.status ?? 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Product Count</p>
                      <p className="mb-0">{selectedCollection.productCount ?? 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Featured</p>
                      <p className="mb-0">{selectedCollection.featured ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Created</p>
                      <p className="mb-0">{selectedCollection.createdAt ? new Date(selectedCollection.createdAt).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </div>
                  {selectedCollection.tags && selectedCollection.tags.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedCollection.tags.map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 bg-muted/30 rounded text-xs">{tag}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}
