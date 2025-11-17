import { Card } from "../../../ui/card";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
import {
  AlertCircle,
  Gift,
  Package,
  Grid3x3,
  Layers,
  X,
  Link,
  GitMerge,
  ExternalLink,
  Save,
} from "lucide-react";

interface PromotionProductsTabProps {
  editedType: string;
  editedBuyQuantity: number;
  editedGetQuantity: number;
  bogoDiscountPercent: number;
  bmgmMode: "discount" | "product";
  editingField: string | null;
  setEditingField: (field: string | null) => void;
  selectedGiftItem: string;
  setSelectedGiftItem: (item: string) => void;
  selectedBmgmProducts: string[];
  setSelectedBmgmProducts: (products: string[]) => void;
  editedProducts: string[];
  setEditedProducts: (products: string[]) => void;
  editedCategories: string[];
  setEditedCategories: (categories: string[]) => void;
  editedAttributes: string[];
  setEditedAttributes: (attributes: string[]) => void;
  excludedProducts: string[];
  setExcludedProducts: (products: string[]) => void;
  excludedCategories: string[];
  setExcludedCategories: (categories: string[]) => void;
  excludedAttributes: string[];
  setExcludedAttributes: (attributes: string[]) => void;
  ruleLogic: "AND" | "OR";
  setRuleLogic: (logic: "AND" | "OR") => void;
  handleSync: () => void;
  handleSave: () => void;
}

export function PromotionProductsTab({
  editedType,
  editedBuyQuantity,
  editedGetQuantity,
  bogoDiscountPercent,
  bmgmMode,
  editingField,
  setEditingField,
  selectedGiftItem,
  setSelectedGiftItem,
  selectedBmgmProducts,
  setSelectedBmgmProducts,
  editedProducts,
  setEditedProducts,
  editedCategories,
  setEditedCategories,
  editedAttributes,
  setEditedAttributes,
  excludedProducts,
  setExcludedProducts,
  excludedCategories,
  setExcludedCategories,
  excludedAttributes,
  setExcludedAttributes,
  ruleLogic,
  setRuleLogic,
  handleSync,
  handleSave,
}: PromotionProductsTabProps) {
  return (
    <div className="space-y-4 mt-4">
      {/* Type-specific guidance */}
      <Card className="p-3 bg-[#4B6BFB]/5 border-[#4B6BFB]/20">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-[#4B6BFB] mt-0.5" />
          <div>
            <p className="text-sm mb-0">
              {editedType === "percentage" && "Apply percentage discount to selected products, categories, or attributes."}
              {editedType === "fixed_amount" && "Apply fixed value discount to selected products or categories meeting minimum purchase."}
              {editedType === "buy_x_get_y" && `Buy ${editedBuyQuantity || "X"} Get ${editedGetQuantity || "Y"} at ${bogoDiscountPercent}% off - select eligible products for the offer.`}
              {editedType === "free_shipping" && "Select the free gift item below, then define qualifying purchase conditions."}
              {editedType === "buy_more_get_more" && bmgmMode === "product" && "Select the free product below, then define qualifying purchase conditions."}
              {editedType === "buy_more_get_more" && bmgmMode === "discount" && "Buy More Get More - define products eligible for volume discounts."}
            </p>
          </div>
        </div>
      </Card>

      {/* Gift Item Selection - For Free Items */}
      {editedType === "free_shipping" && (
        <Card className="p-4 border-glass-border bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <div className="flex items-center gap-2 mb-3">
            <Gift className="w-5 h-5 text-purple-600" />
            <h4 className="mb-0">Free Gift Item</h4>
            <Badge variant="outline" className="text-xs border-purple-300 text-purple-600">Required</Badge>
          </div>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="gift-item">Select Gift Item *</Label>
              {editingField === "giftItem" ? (
                <Input
                  id="gift-item"
                  value={selectedGiftItem}
                  onChange={(e) => setSelectedGiftItem(e.target.value)}
                  onBlur={() => setEditingField(null)}
                  autoFocus
                  placeholder="Enter gift item name or ID"
                  className="border-input bg-background"
                />
              ) : (
                <div 
                  className="p-3 rounded-lg border border-input bg-background cursor-pointer hover:border-purple-400 transition-colors"
                  onClick={() => setEditingField("giftItem")}
                >
                  {selectedGiftItem ? (
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-purple-600" />
                      <span>{selectedGiftItem}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">Click to select gift item...</span>
                  )}
                </div>
              )}
              <p className="text-xs opacity-60">This item will be given free when conditions are met</p>
            </div>
          </div>
        </Card>
      )}

      {/* Free Product Selection - For BMGM Product Mode */}
      {editedType === "buy_more_get_more" && bmgmMode === "product" && (
        <Card className="p-4 border-glass-border bg-gradient-to-br from-pink-50 to-orange-50 dark:from-pink-900/20 dark:to-orange-900/20">
          <div className="flex items-center gap-2 mb-3">
            <Gift className="w-5 h-5 text-pink-600" />
            <h4 className="mb-0">Free Product(s)</h4>
            <Badge variant="outline" className="text-xs border-pink-300 text-pink-600">Required</Badge>
          </div>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Free Products (click to edit)</Label>
              {editingField === "bmgmProducts" ? (
                <Input
                  value={selectedBmgmProducts.join(", ")}
                  onChange={(e) => setSelectedBmgmProducts(e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                  onBlur={() => setEditingField(null)}
                  autoFocus
                  placeholder="Enter product names or IDs, separated by comma"
                  className="border-input bg-background"
                />
              ) : (
                <div 
                  className="p-3 rounded-lg border border-input bg-background cursor-pointer hover:border-pink-400 transition-colors"
                  onClick={() => setEditingField("bmgmProducts")}
                >
                  {selectedBmgmProducts && selectedBmgmProducts.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedBmgmProducts.map((product, idx) => (
                        <Badge key={idx} variant="secondary" className="gap-1 border-pink-300 text-pink-600">
                          <Gift className="w-3 h-3" />
                          {product}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">Click to select free products...</span>
                  )}
                </div>
              )}
              <p className="text-xs opacity-60">These products will be given as rewards</p>
            </div>
          </div>
        </Card>
      )}

      {/* Inclusion Rules */}
      <Card className="p-4 border-glass-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h4 className="mb-0">Inclusion Rules</h4>
            <Badge variant="secondary" className="text-xs">Apply To</Badge>
          </div>
          
          {/* AND/OR Logic Toggle */}
          <div className="flex items-center gap-2">
            <Label className="text-xs opacity-60">Rule Logic:</Label>
            <div className="flex rounded-lg border border-input bg-background overflow-hidden">
              <button
                onClick={() => setRuleLogic("AND")}
                className={`px-3 py-1.5 text-xs transition-colors flex items-center gap-1.5 ${
                  ruleLogic === "AND"
                    ? "bg-[#4B6BFB] text-white"
                    : "hover:bg-accent"
                }`}
              >
                <Link className="w-3 h-3" />
                AND
              </button>
              <button
                onClick={() => setRuleLogic("OR")}
                className={`px-3 py-1.5 text-xs transition-colors flex items-center gap-1.5 ${
                  ruleLogic === "OR"
                    ? "bg-[#4B6BFB] text-white"
                    : "hover:bg-accent"
                }`}
              >
                <GitMerge className="w-3 h-3" />
                OR
              </button>
            </div>
          </div>
        </div>

        {/* Logic Explanation */}
        <div className="mb-4 p-3 rounded-lg bg-accent/30 border border-border">
          <p className="text-xs mb-0">
            {ruleLogic === "AND" ? (
              <>
                <span className="opacity-100">AND Logic:</span> Product must match <strong>all</strong> selected criteria (Products <strong>AND</strong> Categories <strong>AND</strong> Attributes)
              </>
            ) : (
              <>
                <span className="opacity-100">OR Logic:</span> Product matches if it meets <strong>any</strong> selected criteria (Products <strong>OR</strong> Categories <strong>OR</strong> Attributes)
              </>
            )}
          </p>
        </div>
        
        <div className="space-y-1">
          {/* Products */}
          <div className="p-3 rounded-lg border border-border bg-background">
            <Label className="text-xs opacity-60">Products (click to edit)</Label>
            {editingField === "products" ? (
              <Input
                value={editedProducts.join(", ")}
                onChange={(e) => setEditedProducts(e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                onBlur={() => setEditingField(null)}
                autoFocus
                placeholder="Enter products, separated by comma"
                className="mt-1"
              />
            ) : (
              <div className="cursor-pointer mt-1" onClick={() => setEditingField("products")}>
                {editedProducts && editedProducts.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {editedProducts.map((product, idx) => (
                      <Badge key={idx} variant="secondary" className="gap-1">
                        <Package className="w-3 h-3" />
                        {product}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mb-0 py-2">Click to add products</p>
                )}
              </div>
            )}
          </div>

          {/* Logic Connector */}
          <div className="flex items-center justify-center py-1">
            <Badge 
              variant="outline" 
              className={`text-xs ${ruleLogic === "AND" ? "bg-[#4B6BFB]/10 text-[#4B6BFB] border-[#4B6BFB]/30" : "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-300"}`}
            >
              {ruleLogic}
            </Badge>
          </div>

          {/* Categories */}
          <div className="p-3 rounded-lg border border-border bg-background">
            <Label className="text-xs opacity-60">Categories (click to edit)</Label>
            {editingField === "categories" ? (
              <Input
                value={editedCategories.join(", ")}
                onChange={(e) => setEditedCategories(e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                onBlur={() => setEditingField(null)}
                autoFocus
                placeholder="Enter categories, separated by comma"
                className="mt-1"
              />
            ) : (
              <div className="flex flex-wrap gap-2 mt-1 cursor-pointer" onClick={() => setEditingField("categories")}>
                {editedCategories && editedCategories.length > 0 ? (
                  editedCategories.map((category, idx) => (
                    <Badge key={idx} variant="secondary" className="gap-1">
                      <Grid3x3 className="w-3 h-3" />
                      {category}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground mb-0 py-2">Click to add categories</p>
                )}
              </div>
            )}
          </div>

          {/* Logic Connector */}
          <div className="flex items-center justify-center py-1">
            <Badge 
              variant="outline" 
              className={`text-xs ${ruleLogic === "AND" ? "bg-[#4B6BFB]/10 text-[#4B6BFB] border-[#4B6BFB]/30" : "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-300"}`}
            >
              {ruleLogic}
            </Badge>
          </div>

          {/* Attributes */}
          <div className="p-3 rounded-lg border border-border bg-background">
            <Label className="text-xs opacity-60">Attributes (click to edit)</Label>
            {editingField === "attributes" ? (
              <Input
                value={editedAttributes.join(", ")}
                onChange={(e) => setEditedAttributes(e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                onBlur={() => setEditingField(null)}
                autoFocus
                placeholder="Enter attributes, separated by comma"
                className="mt-1"
              />
            ) : (
              <div className="flex flex-wrap gap-2 mt-1 cursor-pointer" onClick={() => setEditingField("attributes")}>
                {editedAttributes && editedAttributes.length > 0 ? (
                  editedAttributes.map((attribute, idx) => (
                    <Badge key={idx} variant="secondary" className="gap-1">
                      <Layers className="w-3 h-3" />
                      {attribute}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground mb-0 py-2">Click to add attributes</p>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Exclusion Rules */}
      <Card className="p-4 border-glass-border">
        <div className="flex items-center gap-2 mb-3">
          <h4 className="mb-0">Exclusion Rules</h4>
          <Badge variant="outline" className="text-xs border-red-300 text-red-600">Exclude</Badge>
        </div>
        
        <div className="space-y-4">
          {/* Excluded Products */}
          <div>
            <Label className="text-xs opacity-60">Excluded Products (click to edit)</Label>
            {editingField === "excludedProducts" ? (
              <Input
                value={excludedProducts.join(", ")}
                onChange={(e) => setExcludedProducts(e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                onBlur={() => setEditingField(null)}
                autoFocus
                placeholder="Enter excluded products, separated by comma"
                className="mt-1"
              />
            ) : (
              <div className="cursor-pointer mt-1" onClick={() => setEditingField("excludedProducts")}>
                {excludedProducts && excludedProducts.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {excludedProducts.map((product, idx) => (
                      <Badge key={idx} variant="outline" className="gap-1 border-red-300 text-red-600">
                        <X className="w-3 h-3" />
                        {product}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mb-0 py-2">Click to exclude products</p>
                )}
              </div>
            )}
          </div>

          {/* Excluded Categories */}
          <div>
            <Label className="text-xs opacity-60">Excluded Categories (click to edit)</Label>
            {editingField === "excludedCategories" ? (
              <Input
                value={excludedCategories.join(", ")}
                onChange={(e) => setExcludedCategories(e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                onBlur={() => setEditingField(null)}
                autoFocus
                placeholder="Enter excluded categories, separated by comma"
                className="mt-1"
              />
            ) : (
              <div className="flex flex-wrap gap-2 mt-1 cursor-pointer" onClick={() => setEditingField("excludedCategories")}>
                {excludedCategories && excludedCategories.length > 0 ? (
                  excludedCategories.map((category, idx) => (
                    <Badge key={idx} variant="outline" className="gap-1 border-red-300 text-red-600">
                      <X className="w-3 h-3" />
                      {category}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground mb-0 py-2">Click to exclude categories</p>
                )}
              </div>
            )}
          </div>

          {/* Excluded Attributes */}
          <div>
            <Label className="text-xs opacity-60">Excluded Attributes (click to edit)</Label>
            {editingField === "excludedAttributes" ? (
              <Input
                value={excludedAttributes.join(", ")}
                onChange={(e) => setExcludedAttributes(e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                onBlur={() => setEditingField(null)}
                autoFocus
                placeholder="Enter excluded attributes, separated by comma"
                className="mt-1"
              />
            ) : (
              <div className="flex flex-wrap gap-2 mt-1 cursor-pointer" onClick={() => setEditingField("excludedAttributes")}>
                {excludedAttributes && excludedAttributes.length > 0 ? (
                  excludedAttributes.map((attribute, idx) => (
                    <Badge key={idx} variant="outline" className="gap-1 border-red-300 text-red-600">
                      <X className="w-3 h-3" />
                      {attribute}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground mb-0 py-2">Click to exclude attributes</p>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Save and Sync Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          className="gap-2 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
          onClick={handleSync}
        >
          <ExternalLink className="w-4 h-4" />
          Sync
        </Button>
        <Button
          className="gap-2 h-12 bg-[#4B6BFB] hover:bg-[#4B6BFB]/90"
          onClick={handleSave}
        >
          <Save className="w-4 h-4" />
          Save
        </Button>
      </div>
    </div>
  );
}
