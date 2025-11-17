import { X, Plus, Search, Send, Paperclip, Clock, User, Package, AlertCircle, Headphones, FileText, DollarSign } from "lucide-react";
import { Button } from "../../../ui/button";
import { Card } from "../../../ui/card";
import { Badge } from "../../../ui/badge";
import { Input } from "../../../ui/input";
import { Textarea } from "../../../ui/textarea";
import { Separator } from "../../../ui/separator";
import { ScrollArea } from "../../../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../ui/dialog";
import { useState } from "react";
import { CustomerServiceTicket } from "../../../../sampledata/customerServiceData";
import { InfoBadge } from "../../../ui/info-badge";
import { SERVICE_STATUS, ISSUE_TYPE, PRIORITY, SATISFACTION, getServiceStatusVariant, getPriorityVariant } from "../../../../utils/modules/crm";

interface CustomerServiceDetailPanelProps {
  ticket: CustomerServiceTicket | null;
  onClose: () => void;
  onOrderClick?: (orderId: string) => void;
  isNewTicket?: boolean;
}

export function CustomerServiceDetailPanel({ ticket, onClose, onOrderClick, isNewTicket = false }: CustomerServiceDetailPanelProps) {
  const [newMessage, setNewMessage] = useState("");
  const [orderSearchOpen, setOrderSearchOpen] = useState(false);
  const [orderSearchTerm, setOrderSearchTerm] = useState("");

  if (!ticket) return null;

  // Mock comments - Internal notes between sale reps and managers
  const comments = [
    {
      id: 1,
      sender: ticket.customer.assignedTo,
      message: "This customer has had quality issues in the past. Escalating to production team for review.",
      timestamp: ticket.createdDate,
      type: "staff" as const,
    },
    {
      id: 2,
      sender: "Manager - Sarah Park",
      message: "Approved for replacement. Let's prioritize this for VIP customer satisfaction.",
      timestamp: ticket.createdDate,
      type: "manager" as const,
    },
    {
      id: 3,
      sender: ticket.customer.assignedTo,
      message: "Replacement order created. Tracking customer communication closely.",
      timestamp: ticket.lastUpdate,
      type: "staff" as const,
    },
  ];

  // Mock available orders for search
  const mockOrders = [
    { id: "666021905", date: "Oct 10 2025", total: "$1,250.00" },
    { id: "666021904", date: "Oct 8 2025", total: "$890.50" },
    { id: "555005163A", date: "Oct 5 2025", total: "$2,100.00" },
    { id: "555005163S", date: "Oct 3 2025", total: "$750.00" },
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Handle sending message
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  const handleAddOrder = (orderId: string) => {
    console.log("Adding order:", orderId);
    setOrderSearchOpen(false);
    setOrderSearchTerm("");
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      <div className="fixed inset-y-0 right-0 w-full sm:w-[500px] lg:w-[600px] bg-white dark:bg-[#1a1a1a] border-l border-border shadow-2xl z-50 flex flex-col" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="p-6 border-b border-border/50 bg-muted/20">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl">{isNewTicket ? "New Ticket" : `Ticket #${ticket.id}`}</h2>
              {!isNewTicket && (
                <InfoBadge variant={getServiceStatusVariant(ticket.status)} size="sm">
                  {ticket.status}
                </InfoBadge>
              )}
            </div>
            {isNewTicket ? (
              <p className="text-sm text-muted-foreground">
                Create new customer service ticket
              </p>
            ) : (
              <div className="text-sm text-muted-foreground space-y-0.5">
                <p>Created: {ticket.createdDate}</p>
                <p>Updated: {ticket.lastUpdate} by {ticket.updatedBy}</p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-6">
        <div className="space-y-6">
          {/* Customer Info Card */}
          <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
            {isNewTicket ? (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs opacity-60">Customer Name</label>
                  <Input placeholder="Enter customer name..." defaultValue={ticket.customer.name} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs opacity-60">Customer Tier</label>
                    <Select defaultValue={ticket.customer.tier}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="VVIP">VVIP</SelectItem>
                        <SelectItem value="VIP">VIP</SelectItem>
                        <SelectItem value="Repeat">Repeat</SelectItem>
                        <SelectItem value="New">New</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs opacity-60">Assigned To</label>
                    <Select defaultValue={ticket.customer.assignedTo}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hang Tran">Hang Tran</SelectItem>
                        <SelectItem value="Ngoc Vo">Ngoc Vo</SelectItem>
                        <SelectItem value="Hai Lam">Hai Lam</SelectItem>
                        <SelectItem value="Hoang My">Hoang My</SelectItem>
                        <SelectItem value="Laura Sale">Laura Sale</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white">
                  {ticket.customer.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span>{ticket.customer.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {ticket.customer.tier}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <User className="w-3 h-3" />
                    <span>Assigned to: {ticket.customer.assignedTo}</span>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Ticket Details */}
          <div className="space-y-4">
            <h3 className="text-sm opacity-60">Ticket Details</h3>
            
            <div className="grid grid-cols-2 gap-3">
              {/* Issue Type */}
              <div className="space-y-1.5">
                <label className="text-xs opacity-60">Issue Type</label>
                <Select defaultValue={ticket.issueType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ISSUE_TYPE).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Priority */}
              <div className="space-y-1.5">
                <label className="text-xs opacity-60">Priority</label>
                <Select defaultValue={ticket.priority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(PRIORITY).map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {priority}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Service Status */}
              <div className="space-y-1.5">
                <label className="text-xs opacity-60">Service Status</label>
                <Select defaultValue={ticket.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(SERVICE_STATUS).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Assigned To */}
              <div className="space-y-1.5">
                <label className="text-xs opacity-60">Assigned To</label>
                <Select defaultValue={ticket.customer.assignedTo}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hang Tran">Hang Tran</SelectItem>
                    <SelectItem value="Ngoc Vo">Ngoc Vo</SelectItem>
                    <SelectItem value="Hai Lam">Hai Lam</SelectItem>
                    <SelectItem value="Hoang My">Hoang My</SelectItem>
                    <SelectItem value="Laura Sale">Laura Sale</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Satisfaction */}
              <div className="space-y-1.5">
                <label className="text-xs opacity-60">Satisfaction</label>
                <Select defaultValue={ticket.satisfaction || "Average"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(SATISFACTION).map((satisfaction) => (
                      <SelectItem key={satisfaction} value={satisfaction}>
                        {satisfaction}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Issue Detail */}
            <div className="space-y-1.5">
              <label className="text-xs opacity-60">Issue Detail</label>
              <Textarea
                defaultValue={ticket.issueDetail}
                className="min-h-[80px]"
                placeholder="Describe the issue..."
              />
            </div>
          </div>

          {/* Related Order */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm opacity-60">Related Order</h3>
              <Dialog open={orderSearchOpen} onOpenChange={setOrderSearchOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="w-3 h-3" />
                    {ticket.orderId ? "Change Order" : "Add Order"}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Search Order</DialogTitle>
                    <DialogDescription>
                      Search and select an order to link to this ticket
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by order number..."
                        value={orderSearchTerm}
                        onChange={(e) => setOrderSearchTerm(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {mockOrders
                        .filter((order) =>
                          order.id.toLowerCase().includes(orderSearchTerm.toLowerCase())
                        )
                        .map((order) => (
                          <Card
                            key={order.id}
                            className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => handleAddOrder(order.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <Package className="w-4 h-4 text-muted-foreground" />
                                  <span>{order.id}</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {order.date}
                                </p>
                              </div>
                              <span className="text-sm">{order.total}</span>
                            </div>
                          </Card>
                        ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {ticket.orderId ? (
              <Card
                className="p-3 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors"
                onClick={() => onOrderClick?.(ticket.orderId!)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-blue-900 dark:text-blue-100">
                      Order #{ticket.orderId}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 text-xs">
                    View Order
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="p-4 bg-muted/20 border-dashed">
                <p className="text-sm text-muted-foreground text-center">
                  No order linked to this ticket
                </p>
              </Card>
            )}
          </div>

          {/* Action Buttons - Quick actions to resolve tickets */}
          {!isNewTicket && (
            <div className="space-y-3">
              <h3 className="text-sm opacity-60">Quick Actions</h3>
              <Card className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-border/50">
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline"
                    className="gap-2 h-auto py-3 flex-col items-start bg-background/50 backdrop-blur-sm hover:bg-background"
                    onClick={() => {
                      console.log("Create Service Order for ticket:", ticket.id);
                      // Handle creating service order
                    }}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm">Create Service Order</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Generate replacement or repair order
                    </span>
                  </Button>

                  <Button 
                    variant="outline"
                    className="gap-2 h-auto py-3 flex-col items-start bg-background/50 backdrop-blur-sm hover:bg-background"
                    onClick={() => {
                      console.log("Request Refund for ticket:", ticket.id);
                      // Handle refund request
                    }}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm">Request Refund</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Process customer refund request
                    </span>
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {!isNewTicket && <Separator />}

          {/* Comments - Internal notes between sale reps and managers */}
          {!isNewTicket && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm opacity-60">Comments</h3>
                <Badge variant="outline" className="text-xs">
                  {ticket.messages} Comments
                </Badge>
              </div>

              <div className="space-y-3">
                {comments.map((comment) => (
                <Card
                  key={comment.id}
                  className={`p-3 ${
                    comment.type === "manager"
                      ? "bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900"
                      : "bg-ai-blue/5 border-ai-blue/20"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                        comment.type === "manager"
                          ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                          : "bg-gradient-to-br from-green-500 to-teal-500 text-white"
                      }`}
                    >
                      {comment.sender.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">{comment.sender}</span>
                        {comment.type === "manager" && (
                          <Badge variant="outline" className="text-xs">Manager</Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {comment.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{comment.message}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          )}
        </div>
      </ScrollArea>

      {/* Comment Input Footer / Create Ticket Footer */}
      <div className="p-4 border-t border-border/50 bg-muted/20">
        {isNewTicket ? (
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
              onClick={() => {
                // Handle creating new ticket
                console.log("Creating new ticket");
                onClose();
              }}
            >
              <Headphones className="w-4 h-4" />
              Create Ticket
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Paperclip className="w-4 h-4" />
            </Button>
            <Input
              placeholder="Add internal comment..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button onClick={handleSendMessage} className="gap-2">
              <Send className="w-4 h-4" />
              Add Comment
            </Button>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
