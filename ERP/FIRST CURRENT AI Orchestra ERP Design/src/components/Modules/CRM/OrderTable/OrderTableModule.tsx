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
import { OrderTableModuleProps } from "../../../../types/modules/crm";
import { DEFAULT_SALE_REPS } from "../../../../utils/modules/crm";
import { CustomerColumnForOrderTable } from "./CustomerColumnForOrderTable";
import { OrderInfoColumnForOrderTable } from "./OrderInfoColumnForOrderTable";
import { CreatedColumnForOrderTable } from "./CreatedColumnForOrderTable";
import { FollowUpColumnForOrderTable } from "./FollowUpColumnForOrderTable";
import { CustomerServiceColumnForOrderTable } from "./CustomerServiceColumnForOrderTable";
import { CustomerDetailPanel } from "../Panels/CustomerDetailPanel";
import { OrderDetailPanel } from "../Panels/OrderDetailPanel";
import { Customer } from "../../../../sampledata/customers";

export function OrderTableModule({ orders, onOrderClick, saleReps = DEFAULT_SALE_REPS }: OrderTableModuleProps) {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isCustomerPanelOpen, setIsCustomerPanelOpen] = useState(false);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<any | null>(null);
  const [isOrderPanelOpen, setIsOrderPanelOpen] = useState(false);

  // Helper to get status color for CustomerDetailPanel
  const getStatusColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      green: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
      blue: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
      amber: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
      red: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
      purple: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
      orange: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
    };
    return colorMap[color] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  };

  // Handle customer click - create a mock customer object from order data
  const handleCustomerClick = (order: any) => {
    const mockCustomer: Customer = {
      id: order.id,
      name: order.customerName,
      emotion: "neutral" as const,
      badge: order.customerRank === "New" ? "New" : order.customerRank === "VIP" || order.customerRank === "VVIP" ? "VIP" : "Regular",
      rank: order.customerRank.toLowerCase() as any,
      priority: "normal" as const,
      contactMethods: ["email", "phone"],
      status: order.orderStatus,
      statusColor: "blue",
      stage: "Purchase",
      stageColor: "green",
      nextAction: order.followUp.status,
      summary: `Order #${order.orderNumber} - ${order.customerService.feedback || "No additional notes"}`,
      dateCreated: order.createdDate,
      createdBy: order.saleRepConverted,
      lastUpdated: order.createdDate,
      updatedBy: order.saleRepMain,
    };
    
    setSelectedCustomer(mockCustomer);
    setIsCustomerPanelOpen(true);
  };

  // Handle order info click - open order detail panel
  const handleOrderInfoClick = (order: any) => {
    setSelectedOrderDetail(order);
    setIsOrderPanelOpen(true);
  };

  return (
    <>
      <Card className="p-4 sm:p-6 bg-card/50 backdrop-blur-sm border-border/50">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 border-b border-border">
                <TableHead className="w-[20%] px-5 py-4">Customer</TableHead>
                <TableHead className="w-[20%] px-5 py-4">Order</TableHead>
                <TableHead className="w-[20%] px-5 py-4">Created</TableHead>
                <TableHead className="w-[20%] px-5 py-4">Actions</TableHead>
                <TableHead className="w-[20%] px-5 py-4">Customer Service</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order, index) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`border-b border-border/50 hover:bg-muted/20 cursor-pointer transition-colors ${
                    selectedOrder === order.id ? "bg-ai-blue/5" : ""
                  }`}
                  onClick={() => {
                    setSelectedOrder(order.id);
                    onOrderClick?.(order);
                  }}
                >
                  <CustomerColumnForOrderTable order={order} onCustomerClick={handleCustomerClick} />
                  <OrderInfoColumnForOrderTable order={order} saleReps={saleReps} onOrderInfoClick={handleOrderInfoClick} />
                  <CreatedColumnForOrderTable order={order} onOrderInfoClick={handleOrderInfoClick} />
                  <FollowUpColumnForOrderTable order={order} onOrderInfoClick={handleOrderInfoClick} />
                  <CustomerServiceColumnForOrderTable order={order} onOrderInfoClick={handleOrderInfoClick} />
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <CustomerDetailPanel
        customer={selectedCustomer}
        isOpen={isCustomerPanelOpen}
        onClose={() => setIsCustomerPanelOpen(false)}
        getStatusColor={getStatusColor}
      />

      <OrderDetailPanel
        order={selectedOrderDetail}
        isOpen={isOrderPanelOpen}
        onClose={() => setIsOrderPanelOpen(false)}
      />
    </>
  );
}
