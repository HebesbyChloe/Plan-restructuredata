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
import { OrderData, CustomOrderTableModuleProps } from "../../../../types/modules/crm";
import { DEFAULT_STAFF_LIST } from "../../../../utils/modules/crm";
import { CustomerColumnForCustomOrderTable } from "./CustomerColumnForCustomOrderTable";
import { OrderInfoColumnForCustomOrderTable } from "./OrderInfoColumnForCustomOrderTable";
import { StatusColumnForCustomOrderTable } from "./StatusColumnForCustomOrderTable";
import { Design3DColumnForCustomOrderTable } from "./Design3DColumnForCustomOrderTable";
import { MaterialColumnForCustomOrderTable } from "./MaterialColumnForCustomOrderTable";
import { ProductionStatusColumnForCustomOrderTable } from "./ProductionStatusColumnForCustomOrderTable";

export function CustomOrderTableModule({ 
  orders, 
  onOrderClick,
  onCustomerClick,
  staffList = DEFAULT_STAFF_LIST 
}: CustomOrderTableModuleProps) {
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
              <TableHead className="w-[16.66%] px-5 py-4">Customer</TableHead>
              <TableHead className="w-[16.66%] px-5 py-4">Order</TableHead>
              <TableHead className="w-[16.66%] px-5 py-4">Status</TableHead>
              <TableHead className="w-[16.66%] px-5 py-4">3D Design Status</TableHead>
              <TableHead className="w-[16.66%] px-5 py-4">Material Status</TableHead>
              <TableHead className="w-[16.66%] px-5 py-4">Production Status</TableHead>
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
                <CustomerColumnForCustomOrderTable order={order} onCustomerClick={handleCustomerClick} />
                <OrderInfoColumnForCustomOrderTable order={order} staffList={staffList} onOrderInfoClick={handleOrderInfoClick} />
                <StatusColumnForCustomOrderTable order={order} onOrderInfoClick={handleOrderInfoClick} />
                <Design3DColumnForCustomOrderTable order={order} onOrderInfoClick={handleOrderInfoClick} />
                <MaterialColumnForCustomOrderTable order={order} onOrderInfoClick={handleOrderInfoClick} />
                <ProductionStatusColumnForCustomOrderTable order={order} onOrderInfoClick={handleOrderInfoClick} />
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
