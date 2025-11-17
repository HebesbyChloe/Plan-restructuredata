import { motion } from "motion/react";
import { Badge } from "../../../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import {
  Check,
  Clock,
  X,
  Truck,
  Package,
  AlertTriangle,
  CheckCircle2,
  Flag,
} from "lucide-react";
import { STATUS_CONFIG } from "./utils/constants";
import { filterPurchaseOrders } from "./utils/helpers";

// Types
interface POProduct {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image?: string;
}

interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendor: string;
  description?: string;
  date: string;
  updatedDate: string;
  items: number;
  totalAmount: number;
  status: "Planning" | "Pending" | "Approved" | "Processed" | "Completed" | "Cancelled" | "Shipped" | "Delivered" | "Delayed";
  shipmentId?: string;
  billId?: string;
  notes?: string;
  paymentTerms?: string;
  leadTime?: string;
  deliveryAddress?: string;
  products: POProduct[];
  isUrgent?: boolean;
  createdBy?: string;
  approvedBy?: string;
  estDeliveredDate?: string;
  shippingMethod?: string;
}

interface PurchaseOrderTableProps {
  data: PurchaseOrder[];
  onPOClick: (po: PurchaseOrder) => void;
  searchTerm?: string;
  selectedStatus?: string;
}

const statusIcons = {
  Clock,
  Check,
  Package,
  Truck,
  CheckCircle2,
  X,
  AlertTriangle,
};

export function PurchaseOrderTableModule({
  data,
  onPOClick,
  searchTerm = "",
  selectedStatus = "all",
}: PurchaseOrderTableProps) {
  const filteredPOs = data.filter((po) => {
    const matchesSearch =
      !searchTerm ||
      po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === "all" || po.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: PurchaseOrder["status"]) => {
    const iconName = STATUS_CONFIG[status]?.icon || "Clock";
    const IconComponent = statusIcons[iconName as keyof typeof statusIcons];
    return IconComponent ? <IconComponent className="w-3.5 h-3.5" /> : null;
  };

  return (
    <div className="border border-border/50 rounded-lg overflow-hidden bg-card/30 backdrop-blur-sm">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border/50 bg-muted/30">
            <TableHead className="w-[200px]">PO Number</TableHead>
            <TableHead>Vendor & Description</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Est. Delivery</TableHead>
            <TableHead className="text-right">Items</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPOs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-12">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground mb-0">No purchase orders found</p>
              </TableCell>
            </TableRow>
          ) : (
            filteredPOs.map((po) => (
              <motion.tr
                key={po.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`border-b border-border/50 hover:bg-muted/20 cursor-pointer transition-colors ${
                  po.isUrgent ? "bg-orange-50 dark:bg-orange-950/10 hover:bg-orange-100 dark:hover:bg-orange-950/20" : ""
                }`}
                onClick={() => onPOClick(po)}
              >
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    {po.isUrgent && (
                      <Flag className="w-4 h-4 text-orange-500 flex-shrink-0" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{po.poNumber}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 mb-0">Updated {po.updatedDate}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm mb-0">{po.vendor || <span className="text-muted-foreground italic">Not set</span>}</p>
                    {po.description && (
                      <p className="text-xs text-muted-foreground mt-0.5 mb-0 line-clamp-1">{po.description}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">{po.date}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">{po.estDeliveredDate || "TBD"}</span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-sm tabular-nums">{po.items}</span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-sm tabular-nums">
                    ${po.totalAmount.toLocaleString()}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`gap-1.5 ${STATUS_CONFIG[po.status]?.color || ""}`}
                  >
                    {getStatusIcon(po.status)}
                    {po.status}
                  </Badge>
                </TableCell>
              </motion.tr>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
