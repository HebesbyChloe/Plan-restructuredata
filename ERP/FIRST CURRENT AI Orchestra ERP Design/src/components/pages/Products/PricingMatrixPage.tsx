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
  DollarSign,
  Upload,
  TrendingUp,
  Percent,
  Tag,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CreatePricingRulePanel } from "../../panels";
import { PricingRuleTableModule } from "../../Modules/Products";
import { PricingRule } from "../../Modules/Products/PricingRuleTable/types";
import { mockPricingRules } from "../../../sampledata/pricingRules";
import { ProductDetailPanel } from "../../Modules/Products/ProductDetailPanel";

export function PricingMatrixPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRule, setSelectedRule] = useState<PricingRule | null>(null);
  const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false);

  // Use sample data
  const [pricingRules] = useState<PricingRule[]>(mockPricingRules);

  const handleRuleClick = (rule: PricingRule) => {
    setSelectedRule(rule);
  };

  const filteredRules = pricingRules.filter(
    (rule) =>
      rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRules = pricingRules.length;
  const activeRules = pricingRules.filter((r) => r.status === "active").length;
  // Calculate average discount from all tiers
  const allDiscounts = pricingRules.flatMap(r => r.tiers.map(t => t.discount));
  const avgMarkup = allDiscounts.length > 0 
    ? allDiscounts.reduce((sum, d) => sum + d, 0) / allDiscounts.length 
    : 0;

  return (
    <div className="w-full h-full bg-[#FAFAFA] dark:bg-background -m-8 p-8">
      {/* Summary Bar */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Rules</p>
              <h3 className="text-2xl mb-0">{totalRules}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#4B6BFB] to-[#6B8AFF] flex items-center justify-center">
              <Tag className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Active Rules</p>
              <h3 className="text-2xl mb-0">{activeRules}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Avg. Markup</p>
              <h3 className="text-2xl mb-0">{avgMarkup.toFixed(1)}%</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
              <Percent className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Pricing Tiers</p>
              <h3 className="text-2xl mb-0">8</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="mb-2">Pricing Matrix</h1>
          <p className="text-muted-foreground mb-0">
            Manage pricing rules and strategies
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
            className="gap-2 bg-gradient-to-r from-[#4B6BFB] to-[#6B8AFF] hover:from-[#3B5BEB] to-[#4B6BFB] text-white shadow-md"
            onClick={() => setIsCreatePanelOpen(true)}
          >
            <Plus className="w-4 h-4" />
            New Pricing Rule
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-sm mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search pricing rules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5] dark:border-border"
            />
          </div>

          <Select>
            <SelectTrigger className="w-[160px] bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="bracelet">Bracelet</SelectItem>
              <SelectItem value="necklace">Necklace</SelectItem>
              <SelectItem value="ring">Ring</SelectItem>
              <SelectItem value="earring">Earring</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[160px] bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Pricing Rules Table - Using Module */}
      <Card className="bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-md">
        <PricingRuleTableModule
          rules={filteredRules}
          selectedRule={selectedRule}
          onRuleClick={handleRuleClick}
        />
      </Card>

      {/* Create Pricing Rule Panel */}
      <CreatePricingRulePanel
        isOpen={isCreatePanelOpen}
        onClose={() => setIsCreatePanelOpen(false)}
        onSave={(rule) => {
          console.log("New pricing rule:", rule);
          toast.success("Pricing rule created successfully!");
        }}
      />
    </div>
  );
}
