import { Card } from "../../../ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import { motion } from "motion/react";
import { useState } from "react";
import { OrderData } from "../OrderTable/types";
import { DEFAULT_STAFF_LIST } from "./utils/returnWarrantyTableConstants";

// Types
interface ReturnWarrantyTableModuleProps {
  orders: OrderData[];
  onOrderClick?: (order: OrderData) => void;
  onCustomerClick?: (order: OrderData) => void;
  staffList?: string[];
}

interface ColumnProps {
  order: OrderData;
  staffList?: string[];
  onCustomerClick?: (order: OrderData) => void;
  onOrderInfoClick?: (order: OrderData) => void;
}
import { CustomerColumn } from "./columns/CustomerColumn";
import { OrderInfoColumn } from "./columns/OrderInfoColumn";
import { RequestColumn } from "./columns/RequestColumn";
import { ShipmentStatusColumn } from "./columns/ShipmentStatusColumn";
import { CreatedColumn } from "./columns/CreatedColumn";

export function ReturnWarrantyTableModule({ 
  orders, 
  onOrderClick, 
  onCustomerClick,
  staffList = DEFAULT_STAFF_LIST 
}: ReturnWarrantyTableModuleProps) {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  // Handle order info click - opens order detail panel
  const handleOrderInfoClick = (order: any) => {
    setSelectedOrder(order.id);
    onOrderClick?.(order);
  };

  // Handle customer click - opens customer detail panel
  const handleCustomerClick = (order: any) => {
    onCustomerClick?.(order);
  };

  return (
    <Card className="p-4 sm:p-6 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 border-b border-border">
              <TableHead className="w-[20%] px-5 py-4">Customer</TableHead>
              <TableHead className="w-[20%] px-5 py-4">Order</TableHead>
              <TableHead className="w-[20%] px-5 py-4">Request</TableHead>
              <TableHead className="w-[20%] px-5 py-4">Request Status</TableHead>
              <TableHead className="w-[20%] px-5 py-4">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order, index) => (
              <motion.tr
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`border-b border-border/50 hover:bg-muted/20 transition-colors ${
                  selectedOrder === order.id ? "bg-ai-blue/5" : ""
                }`}
              >
                <CustomerColumn order={order} onCustomerClick={handleCustomerClick} />
                <OrderInfoColumn order={order} staffList={staffList} onOrderInfoClick={handleOrderInfoClick} />
                <RequestColumn order={order} onOrderInfoClick={handleOrderInfoClick} />
                <ShipmentStatusColumn order={order} onOrderInfoClick={handleOrderInfoClick} />
                <CreatedColumn order={order} onOrderInfoClick={handleOrderInfoClick} />
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
