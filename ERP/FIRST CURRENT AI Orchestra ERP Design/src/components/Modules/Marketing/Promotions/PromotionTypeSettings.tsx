import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../ui/select";
import { DollarSign, Percent } from "lucide-react";
import { Promotion } from "./promotionData";

interface PromotionTypeSettingsProps {
  promotionType: string;
  selectedPromotion?: Promotion | null;
}

export function PromotionTypeSettings({
  promotionType,
  selectedPromotion,
}: PromotionTypeSettingsProps) {
  switch (promotionType) {
    case "percentage":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="percentage-value">Percentage Discount *</Label>
            <div className="flex gap-2">
              <Input 
                id="percentage-value" 
                type="number"
                defaultValue={selectedPromotion?.percentageValue || ""}
                placeholder="25"
                className="border-input bg-background"
              />
              <div className="flex items-center px-3 rounded-lg border border-input bg-muted">
                <Percent className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xs opacity-60">Enter percentage discount (e.g., 25 for 25% off)</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="min-purchase">Minimum Purchase Amount (Optional)</Label>
            <div className="flex gap-2">
              <div className="flex items-center px-3 rounded-lg border border-input bg-muted">
                <DollarSign className="w-4 h-4" />
              </div>
              <Input 
                id="min-purchase" 
                type="number"
                defaultValue={selectedPromotion?.minimumPurchase || ""}
                placeholder="100"
                className="border-input bg-background"
              />
            </div>
          </div>
        </div>
      );
    
    case "value":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="value-amount">Fixed Discount Amount *</Label>
            <div className="flex gap-2">
              <div className="flex items-center px-3 rounded-lg border border-input bg-muted">
                <DollarSign className="w-4 h-4" />
              </div>
              <Input 
                id="value-amount" 
                type="number"
                defaultValue={selectedPromotion?.valueAmount || ""}
                placeholder="50"
                className="border-input bg-background"
              />
            </div>
            <p className="text-xs opacity-60">Enter fixed dollar amount off (e.g., 50 for $50 off)</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="min-purchase-value">Minimum Purchase Amount *</Label>
            <div className="flex gap-2">
              <div className="flex items-center px-3 rounded-lg border border-input bg-muted">
                <DollarSign className="w-4 h-4" />
              </div>
              <Input 
                id="min-purchase-value" 
                type="number"
                defaultValue={selectedPromotion?.minimumPurchase || ""}
                placeholder="200"
                className="border-input bg-background"
              />
            </div>
            <p className="text-xs opacity-60">Customer must spend at least this amount</p>
          </div>
        </div>
      );
    
    case "bogo":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="buy-quantity">Buy Quantity *</Label>
              <Input 
                id="buy-quantity" 
                type="number"
                defaultValue={selectedPromotion?.buyQuantity || "1"}
                placeholder="1"
                className="border-input bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="get-quantity">Get Quantity *</Label>
              <Input 
                id="get-quantity" 
                type="number"
                defaultValue={selectedPromotion?.getQuantity || "1"}
                placeholder="1"
                className="border-input bg-background"
              />
            </div>
          </div>
          <p className="text-xs opacity-60">Example: Buy 1 Get 1, Buy 2 Get 1, etc.</p>
          <div className="space-y-2">
            <Label htmlFor="bogo-discount">Discount on Free Items</Label>
            <Select defaultValue="100">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="!bg-white dark:!bg-card border-border z-[100]">
                <SelectItem value="100">100% Off (Free)</SelectItem>
                <SelectItem value="50">50% Off</SelectItem>
                <SelectItem value="25">25% Off</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    
    case "free-items":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="free-item">Free Item</Label>
            <Select defaultValue={selectedPromotion?.freeItemId || ""}>
              <SelectTrigger>
                <SelectValue placeholder="Select item to give for free" />
              </SelectTrigger>
              <SelectContent className="!bg-white dark:!bg-card border-border z-[100]">
                <SelectItem value="shipping">Free Shipping</SelectItem>
                <SelectItem value="gift-wrap">Free Gift Wrapping</SelectItem>
                <SelectItem value="sample">Free Sample Product</SelectItem>
                <SelectItem value="custom">Custom Free Item</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="min-purchase-free">Minimum Purchase Amount *</Label>
            <div className="flex gap-2">
              <div className="flex items-center px-3 rounded-lg border border-input bg-muted">
                <DollarSign className="w-4 h-4" />
              </div>
              <Input 
                id="min-purchase-free" 
                type="number"
                defaultValue={selectedPromotion?.minimumPurchase || ""}
                placeholder="100"
                className="border-input bg-background"
              />
            </div>
            <p className="text-xs opacity-60">Minimum order value to qualify for free item</p>
          </div>
        </div>
      );
    
    case "bmgm":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bmgm-buy">Buy Quantity *</Label>
              <Input 
                id="bmgm-buy" 
                type="number"
                defaultValue={selectedPromotion?.buyQuantity || "3"}
                placeholder="3"
                className="border-input bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bmgm-get">Additional Items *</Label>
              <Input 
                id="bmgm-get" 
                type="number"
                defaultValue={selectedPromotion?.getQuantity || "1"}
                placeholder="1"
                className="border-input bg-background"
              />
            </div>
          </div>
          <p className="text-xs opacity-60">Example: Buy 3 Get 1 More, Buy 5 Get 2 More</p>
          <div className="space-y-2">
            <Label htmlFor="bmgm-discount">Discount on Additional Items *</Label>
            <div className="flex gap-2">
              <Input 
                id="bmgm-discount" 
                type="number"
                defaultValue="100"
                placeholder="100"
                className="border-input bg-background"
              />
              <div className="flex items-center px-3 rounded-lg border border-input bg-muted">
                <Percent className="w-4 h-4" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Apply to</Label>
            <Select defaultValue="same">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="!bg-white dark:!bg-card border-border z-[100]">
                <SelectItem value="same">Same Products</SelectItem>
                <SelectItem value="category">Same Category</SelectItem>
                <SelectItem value="any">Any Products</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    
    default:
      return null;
  }
}
