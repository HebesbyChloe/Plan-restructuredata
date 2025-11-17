/**
 * CreateCartPanel Module
 * 
 * Sheet panel for creating shareable carts with products,
 * share settings, and link generation.
 */

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../../../ui/sheet";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { Textarea } from "../../../ui/textarea";
import { Badge } from "../../../ui/badge";
import { Card } from "../../../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../ui/select";
import { Search, ShoppingCart, Package, Share2, Plus, Copy } from "lucide-react";

// Types
interface Store {
  value: string;
  label: string;
}

interface CreateCartPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedStore: string;
  stores: Store[];
  onSubmit?: (cartData: any) => void;
}

export function CreateCartPanelModule({
  open,
  onOpenChange,
  selectedStore,
  stores,
  onSubmit,
}: CreateCartPanelProps) {
  const handleSubmit = () => {
    // In a real app, this would collect form data
    if (onSubmit) {
      onSubmit({});
    }
    onOpenChange(false);
  };

  const selectedStoreLabel = stores.find(s => s.value === selectedStore)?.label;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto p-8">
        <SheetHeader className="mb-8">
          <SheetTitle>Create Cart to Share</SheetTitle>
          <SheetDescription>
            Create a shareable cart for {selectedStoreLabel}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-8">
          {/* Store Badge */}
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500 text-white px-3 py-1">
              {selectedStoreLabel}
            </Badge>
          </div>

          {/* Cart Information */}
          <div className="space-y-4">
            <h4 className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-[#4B6BFB]" />
              Cart Information
            </h4>
            <div className="space-y-3">
              <div>
                <Label htmlFor="cart-name">Cart Name</Label>
                <Input id="cart-name" placeholder="e.g., Spring Collection Bundle" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="cart-customer">For Customer (Optional)</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="cart-customer" placeholder="Search customer name or email" className="pl-9" />
                </div>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h4 className="flex items-center gap-2">
              <Package className="w-4 h-4 text-[#4B6BFB]" />
              Products
            </h4>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Plus className="w-4 h-4" />
                Add Products to Cart
              </Button>
              <div className="p-4 rounded-lg border border-dashed border-border/50 text-center text-sm text-muted-foreground">
                No products added yet
              </div>
            </div>
          </div>

          {/* Share Settings */}
          <div className="space-y-4">
            <h4 className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-[#4B6BFB]" />
              Share Settings
            </h4>
            <div className="space-y-3">
              <div>
                <Label htmlFor="cart-expiry">Link Expiration</Label>
                <Select>
                  <SelectTrigger id="cart-expiry" className="mt-1">
                    <SelectValue placeholder="Select expiration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1day">1 Day</SelectItem>
                    <SelectItem value="3days">3 Days</SelectItem>
                    <SelectItem value="1week">1 Week</SelectItem>
                    <SelectItem value="1month">1 Month</SelectItem>
                    <SelectItem value="never">Never Expire</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="cart-discount">Apply Discount (Optional)</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input type="number" placeholder="Amount" />
                </div>
              </div>
              <div>
                <Label htmlFor="cart-notes">Notes for Customer</Label>
                <Textarea id="cart-notes" placeholder="Add a personal message..." className="mt-1 min-h-[80px]" />
              </div>
            </div>
          </div>

          {/* Generated Link Preview */}
          <Card className="p-4 bg-muted/50">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Shareable Link (Generated after creation)</Label>
              <div className="flex items-center gap-2">
                <Input value="https://hebesbychloe.com/cart/abc123..." disabled className="text-xs" />
                <Button variant="outline" size="sm">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 pt-6 mt-8 border-t">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600" onClick={handleSubmit}>
              Create & Share Cart
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
