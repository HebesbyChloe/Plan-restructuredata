"use client";

import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
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
  Gem,
  Upload,
  Sparkles,
  DollarSign,
  Package,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CreateDiamondGemstonePanel } from "../../panels";
import { DiamondTableModule, GemstoneTableModule } from "../../Modules/Products";
import { Diamond, Gemstone } from "../../Modules/Products/DiamondGemstoneTable/types";
import { mockDiamonds } from "../../../sampledata/diamonds";
import { mockGemstones } from "../../../sampledata/gemstones";
import { ProductDetailPanel } from "../../Modules/Products/ProductDetailPanel";

export function DiamondGemstoneBoardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDiamond, setSelectedDiamond] = useState<Diamond | null>(null);
  const [selectedGemstone, setSelectedGemstone] = useState<Gemstone | null>(null);
  const [isDiamondPanelOpen, setIsDiamondPanelOpen] = useState(false);
  const [isGemstonePanelOpen, setIsGemstonePanelOpen] = useState(false);
  const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false);
  const [createMode, setCreateMode] = useState<"diamond" | "gemstone">("diamond");

  // Use sample data
  const [diamonds] = useState<Diamond[]>(mockDiamonds);
  const [gemstones] = useState<Gemstone[]>(mockGemstones);

  const handleDiamondClick = (diamond: Diamond) => {
    setSelectedDiamond(diamond);
    setIsDiamondPanelOpen(true);
  };

  const handleGemstoneClick = (gemstone: Gemstone) => {
    setSelectedGemstone(gemstone);
    setIsGemstonePanelOpen(true);
  };

  const filteredDiamonds = diamonds.filter(
    (diamond) =>
      diamond.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diamond.shape.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredGemstones = gemstones.filter(
    (gemstone) =>
      gemstone.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gemstone.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalDiamonds = diamonds.length;
  const totalGemstones = gemstones.length;
  const diamondsValue = diamonds.reduce((sum, d) => sum + d.pricePerCarat * d.weight, 0);
  const gemstonesValue = gemstones.reduce((sum, g) => sum + g.pricePerCarat * g.weight, 0);

  return (
    <div className="w-full h-full bg-[#FAFAFA] dark:bg-background -m-8 p-8">
      {/* Summary Bar */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Diamonds</p>
              <h3 className="text-2xl mb-0">{totalDiamonds}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Gemstones</p>
              <h3 className="text-2xl mb-0">{totalGemstones}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#EC4899] to-[#F472B6] flex items-center justify-center">
              <Gem className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Diamonds Value</p>
              <h3 className="text-2xl mb-0">${diamondsValue.toLocaleString()}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Gemstones Value</p>
              <h3 className="text-2xl mb-0">${gemstonesValue.toLocaleString()}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-950 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="mb-2">Diamonds & Gemstones</h1>
          <p className="text-muted-foreground mb-0">
            Manage precious stones inventory
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
            className="gap-2 bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] hover:from-[#7C3AED] to-[#8B5CF6] text-white shadow-md"
            onClick={() => {
              setCreateMode("diamond");
              setIsCreatePanelOpen(true);
            }}
          >
            <Plus className="w-4 h-4" />
            Add Stone
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-sm mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search stones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5] dark:border-border"
            />
          </div>

          <Select>
            <SelectTrigger className="w-[160px] bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]">
              <SelectValue placeholder="Clarity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clarity</SelectItem>
              <SelectItem value="FL">FL</SelectItem>
              <SelectItem value="IF">IF</SelectItem>
              <SelectItem value="VVS1">VVS1</SelectItem>
              <SelectItem value="VVS2">VVS2</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[160px] bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]">
              <SelectValue placeholder="Cut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cuts</SelectItem>
              <SelectItem value="Excellent">Excellent</SelectItem>
              <SelectItem value="Very Good">Very Good</SelectItem>
              <SelectItem value="Good">Good</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Tabs with Tables */}
      <Tabs defaultValue="diamonds" className="space-y-6">
        <TabsList className="bg-[#F8F8F8] dark:bg-muted">
          <TabsTrigger value="diamonds">Diamonds</TabsTrigger>
          <TabsTrigger value="gemstones">Gemstones</TabsTrigger>
        </TabsList>

        <TabsContent value="diamonds">
          <Card className="bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-md">
            <DiamondTableModule
              diamonds={filteredDiamonds}
              selectedDiamond={selectedDiamond}
              onDiamondClick={handleDiamondClick}
            />
          </Card>
        </TabsContent>

        <TabsContent value="gemstones">
          <Card className="bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-md">
            <GemstoneTableModule
              gemstones={filteredGemstones}
              selectedGemstone={selectedGemstone}
              onGemstoneClick={handleGemstoneClick}
            />
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Diamond/Gemstone Panel */}
      <CreateDiamondGemstonePanel
        isOpen={isCreatePanelOpen}
        onClose={() => setIsCreatePanelOpen(false)}
        mode={createMode}
        onSave={(stone) => {
          console.log("New stone:", stone);
          toast.success(`${createMode === "diamond" ? "Diamond" : "Gemstone"} added successfully!`);
        }}
      />

      {/* Diamond Detail Panel */}
      {selectedDiamond && (
        <ProductDetailPanel
          isOpen={isDiamondPanelOpen}
          onClose={() => {
            setIsDiamondPanelOpen(false);
            setSelectedDiamond(null);
          }}
          title={selectedDiamond.name}
          subtitle={`SKU: ${selectedDiamond.sku}`}
          productType="diamond"
          tabs={[
            {
              value: "overview",
              label: "Overview",
              content: (
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Type</p>
                      <p className="mb-0 capitalize">{selectedDiamond.type ?? 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Shape</p>
                      <p className="mb-0 capitalize">{selectedDiamond.shape ?? 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Carat</p>
                      <p className="mb-0">{selectedDiamond.carat ?? 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Color</p>
                      <p className="mb-0">{selectedDiamond.color ?? 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Clarity</p>
                      <p className="mb-0">{selectedDiamond.clarity ?? 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Cut</p>
                      <p className="mb-0">{selectedDiamond.cut ?? 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Unit Cost</p>
                      <p className="mb-0">${selectedDiamond.unitCost?.toLocaleString() ?? 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Retail Price</p>
                      <p className="mb-0">${selectedDiamond.retailPrice?.toLocaleString() ?? 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Stock</p>
                      <p className="mb-0">{selectedDiamond.quantityInStock ?? 0} ({selectedDiamond.location})</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Certification</p>
                      <p className="mb-0">{selectedDiamond.certificationLab ?? 'None'}</p>
                    </div>
                  </div>
                </div>
              ),
            },
          ]}
        />
      )}

      {/* Gemstone Detail Panel */}
      {selectedGemstone && (
        <ProductDetailPanel
          isOpen={isGemstonePanelOpen}
          onClose={() => {
            setIsGemstonePanelOpen(false);
            setSelectedGemstone(null);
          }}
          title={selectedGemstone.name}
          subtitle={`SKU: ${selectedGemstone.sku}`}
          productType="diamond"
          tabs={[
            {
              value: "overview",
              label: "Overview",
              content: (
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Type</p>
                      <p className="mb-0 capitalize">{selectedGemstone.type ?? 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Shape</p>
                      <p className="mb-0 capitalize">{selectedGemstone.shape ?? 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Carat</p>
                      <p className="mb-0">{selectedGemstone.carat ?? 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Color</p>
                      <p className="mb-0 capitalize">{selectedGemstone.color ?? 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Clarity</p>
                      <p className="mb-0">{selectedGemstone.clarity ?? 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Origin</p>
                      <p className="mb-0">{selectedGemstone.origin ?? 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Unit Cost</p>
                      <p className="mb-0">${selectedGemstone.unitCost?.toLocaleString() ?? 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Retail Price</p>
                      <p className="mb-0">${selectedGemstone.retailPrice?.toLocaleString() ?? 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Stock</p>
                      <p className="mb-0">{selectedGemstone.quantityInStock ?? 0} ({selectedGemstone.location})</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Treatment</p>
                      <p className="mb-0 capitalize">{selectedGemstone.treatment?.replace('_', ' ') ?? 'None'}</p>
                    </div>
                  </div>
                </div>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}
