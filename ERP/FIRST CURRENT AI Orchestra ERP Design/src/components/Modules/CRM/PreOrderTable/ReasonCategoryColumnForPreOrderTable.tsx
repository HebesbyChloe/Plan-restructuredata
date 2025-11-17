import { TableCell } from "../../../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import { PreOrderColumnProps } from "../../../../types/modules/crm";
import { InfoBadge } from "../../../ui/info-badge";
import { PRE_ORDER_REASON_STATUS, PRE_ORDER_PRODUCT_TYPES, PRE_ORDER_VENDORS } from "../../../../utils/modules/crm";

export function ReasonCategoryColumnForPreOrderTable({ order, onOrderInfoClick }: PreOrderColumnProps) {
  const reasonStatus = order.preOrderDetails?.reasonStatus || "Pre Order";
  const productType = order.preOrderDetails?.productType || "Jewelry";
  const vendor = order.preOrderDetails?.vendor || "Golden Gems Supply";
  
  return (
    <TableCell 
      className="px-5 py-6 align-top cursor-pointer hover:bg-muted/10 transition-colors"
      onClick={(e) => {
        e.stopPropagation();
        onOrderInfoClick?.(order);
      }}
    >
      <div className="flex flex-col gap-2.5">
        {/* Reason Status - First div - min-h-[28px] */}
        <div className="min-h-[28px] flex items-center">
          <span className="text-sm text-muted-foreground">{reasonStatus}</span>
        </div>
        
        {/* Product Type - Second div - min-h-[26px] */}
        <div className="min-h-[26px] flex items-center">
          <span className="text-sm text-muted-foreground">{productType}</span>
        </div>
        
        {/* Supplier (Vendor) - Third div - h-8 */}
        <div className="h-8 flex items-center">
          <InfoBadge variant="default" size="md" className="w-full">
            <span className="truncate">{vendor}</span>
          </InfoBadge>
        </div>
      </div>
    </TableCell>
  );
}
