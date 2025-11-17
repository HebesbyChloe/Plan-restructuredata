/**
 * CreateOrderPanel Module
 * 
 * Sheet panel for creating new orders with customer information
 * and order details.
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
import { Search, Users, Package, Plus } from "lucide-react";

// Types
interface Store {
  value: string;
  label: string;
}

interface CreateOrderPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedStore: string;
  stores: Store[];
  onSubmit?: (orderData: any) => void;
}

export function CreateOrderPanelModule({
  open,
  onOpenChange,
  selectedStore,
  stores,
  onSubmit,
}: CreateOrderPanelProps) {
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
          <SheetTitle>Create Order</SheetTitle>
          <SheetDescription>
            Create a new order for {selectedStoreLabel}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-8">
          {/* Store Badge */}
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-500 text-white px-3 py-1">
              {selectedStoreLabel}
            </Badge>
          </div>

          {/* Customer Information */}
          <div className="space-y-4">
            <h4 className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#4B6BFB]" />
              Customer Information
            </h4>
            <div className="space-y-3">
              <div>
                <Label htmlFor="customer-search">Search Customer</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="customer-search" placeholder="Search by name, email, or phone" className="pl-9" />
                </div>
              </div>
              <div>
                <Label htmlFor="customer-email">Email</Label>
                <Input id="customer-email" type="email" placeholder="customer@example.com" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="customer-phone">Phone</Label>
                <Input id="customer-phone" placeholder="+1 (555) 000-0000" className="mt-1" />
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="space-y-4">
            <h4 className="flex items-center gap-2">
              <Package className="w-4 h-4 text-[#4B6BFB]" />
              Order Details
            </h4>
            <div className="space-y-3">
              <div>
                <Label htmlFor="order-products">Products</Label>
                <Button variant="outline" className="w-full mt-1 justify-start gap-2">
                  <Plus className="w-4 h-4" />
                  Add Products
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="order-payment">Payment Method</Label>
                  <Select>
                    <SelectTrigger id="order-payment" className="mt-1">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">Credit Card</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="cod">Cash on Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="order-shipping">Shipping Method</Label>
                  <Select>
                    <SelectTrigger id="order-shipping" className="mt-1">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="express">Express</SelectItem>
                      <SelectItem value="overnight">Overnight</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="order-notes">Order Notes</Label>
                <Textarea id="order-notes" placeholder="Add any special instructions..." className="mt-1 min-h-[80px]" />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 mt-8 border-t">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600" onClick={handleSubmit}>
              Create Order
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
