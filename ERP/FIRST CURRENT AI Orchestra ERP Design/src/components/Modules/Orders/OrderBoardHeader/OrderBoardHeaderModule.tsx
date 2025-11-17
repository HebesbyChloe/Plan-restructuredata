/**
 * OrderBoardHeader Module
 * 
 * Displays the page header with title, description, and action buttons
 * for creating orders, coupons, and shareable carts.
 */

import { Button } from "../../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import {
  RefreshCw,
  Package,
  ChevronDown,
  Ticket,
  Share2,
} from "lucide-react";

// Types
interface Store {
  value: string;
  label: string;
}

interface OrderBoardHeaderProps {
  onCreateOrder: (store: string) => void;
  onCreateCoupon: (store: string) => void;
  onCreateCart: (store: string) => void;
  onRefresh?: () => void;
  stores: Store[];
}

export function OrderBoardHeaderModule({
  onCreateOrder,
  onCreateCoupon,
  onCreateCart,
  onRefresh,
  stores,
}: OrderBoardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 pb-6 border-b border-border/50">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <h1 className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-0">
            Order Board
          </h1>
        </div>
        <p className="text-muted-foreground">
          Manage and track all customer orders
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {onRefresh && (
          <Button variant="outline" size="sm" className="gap-2" onClick={onRefresh}>
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        )}
        
        {/* Create Order Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
              <Package className="w-4 h-4" />
              Create Order
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {stores.map((store) => (
              <DropdownMenuItem
                key={store.value}
                onClick={() => onCreateOrder(store.value)}
              >
                {store.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Create Coupon Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <Ticket className="w-4 h-4" />
              Create Coupon
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {stores.map((store) => (
              <DropdownMenuItem
                key={store.value}
                onClick={() => onCreateCoupon(store.value)}
              >
                {store.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Create Cart to Share Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
              <Share2 className="w-4 h-4" />
              Create Cart
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {stores.map((store) => (
              <DropdownMenuItem
                key={store.value}
                onClick={() => onCreateCart(store.value)}
              >
                {store.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
