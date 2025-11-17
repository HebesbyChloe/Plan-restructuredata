/**
 * CreateCouponPanel Module
 * 
 * Sheet panel for creating coupon codes with discount settings
 * and customer restrictions.
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../ui/select";
import { Ticket, Users } from "lucide-react";

// Types
interface Store {
  value: string;
  label: string;
}

interface CreateCouponPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedStore: string;
  stores: Store[];
  onSubmit?: (couponData: any) => void;
}

export function CreateCouponPanelModule({
  open,
  onOpenChange,
  selectedStore,
  stores,
  onSubmit,
}: CreateCouponPanelProps) {
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
          <SheetTitle>Create Coupon</SheetTitle>
          <SheetDescription>
            Create a new coupon code for {selectedStoreLabel}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-8">
          {/* Store Badge */}
          <div className="flex items-center gap-2">
            <Badge className="bg-purple-500 text-white px-3 py-1">
              {selectedStoreLabel}
            </Badge>
          </div>

          {/* Coupon Details */}
          <div className="space-y-4">
            <h4 className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-[#4B6BFB]" />
              Coupon Details
            </h4>
            <div className="space-y-3">
              <div>
                <Label htmlFor="coupon-code">Coupon Code</Label>
                <Input id="coupon-code" placeholder="e.g., SAVE20" className="mt-1 uppercase" />
              </div>
              <div>
                <Label htmlFor="coupon-type">Discount Type</Label>
                <Select>
                  <SelectTrigger id="coupon-type" className="mt-1">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage Off</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                    <SelectItem value="free-shipping">Free Shipping</SelectItem>
                    <SelectItem value="buy-x-get-y">Buy X Get Y</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="coupon-value">Discount Value</Label>
                  <Input id="coupon-value" type="number" placeholder="20" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="coupon-min">Minimum Order</Label>
                  <Input id="coupon-min" type="number" placeholder="$0" className="mt-1" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="coupon-start">Start Date</Label>
                  <Input id="coupon-start" type="date" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="coupon-end">End Date</Label>
                  <Input id="coupon-end" type="date" className="mt-1" />
                </div>
              </div>
              <div>
                <Label htmlFor="coupon-usage">Usage Limit</Label>
                <Input id="coupon-usage" type="number" placeholder="Unlimited" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="coupon-description">Description</Label>
                <Textarea id="coupon-description" placeholder="Internal notes about this coupon..." className="mt-1 min-h-[60px]" />
              </div>
            </div>
          </div>

          {/* Customer Restrictions */}
          <div className="space-y-4">
            <h4 className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#4B6BFB]" />
              Customer Restrictions
            </h4>
            <div className="space-y-3">
              <div>
                <Label htmlFor="coupon-customers">Eligible Customers</Label>
                <Select>
                  <SelectTrigger id="coupon-customers" className="mt-1">
                    <SelectValue placeholder="Select customers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Customers</SelectItem>
                    <SelectItem value="new">New Customers Only</SelectItem>
                    <SelectItem value="vip">VIP Customers</SelectItem>
                    <SelectItem value="specific">Specific Customers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 mt-8 border-t">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" onClick={handleSubmit}>
              Create Coupon
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
