import { Card } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
import {
  Users,
  Mail,
  Phone,
  Instagram,
  ChevronDown,
  Target,
  Bell,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import { Customer } from "../../../sampledata/customers";
import { CustomerDetailPanel } from "../Panels/CustomerDetailPanel";
import { statusColors, getEmotionEmoji } from "../../../../lib/config";

interface TableCustomerModuleProps {
  customers: Customer[];
}

type SortField = 'status' | 'stage' | 'nextAction' | 'dateCreated' | 'lastUpdated' | null;
type SortDirection = 'asc' | 'desc' | null;

export function TableCustomerModule({ customers }: TableCustomerModuleProps) {
  const [expandedSummary, setExpandedSummary] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Sort handler
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortField(null);
        setSortDirection(null);
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort customers
  const sortedCustomers = [...customers].sort((a, b) => {
    if (!sortField || !sortDirection) return 0;

    let aValue: string | number = '';
    let bValue: string | number = '';

    switch (sortField) {
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      case 'stage':
        aValue = a.stage;
        bValue = b.stage;
        break;
      case 'nextAction':
        aValue = a.nextAction;
        bValue = b.nextAction;
        break;
      case 'dateCreated':
        aValue = new Date(a.dateCreated).getTime();
        bValue = new Date(b.dateCreated).getTime();
        break;
      case 'lastUpdated':
        aValue = new Date(a.lastUpdated).getTime();
        bValue = new Date(b.lastUpdated).getTime();
        break;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return sortDirection === 'asc' 
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  });

  // Helper function to render sort icon
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 ml-1 opacity-40" />;
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="w-3.5 h-3.5 ml-1 text-[#4B6BFB]" />;
    }
    return <ArrowDown className="w-3.5 h-3.5 ml-1 text-[#4B6BFB]" />;
  };

  // Helper function to get badge styling from centralized config
  const getBadgeStyle = (badge: string) => {
    const badgeColors = statusColors.badge[badge as keyof typeof statusColors.badge];
    if (badgeColors) {
      return `${badgeColors.bg} ${badgeColors.text} ${badgeColors.border}`;
    }
    return `${statusColors.badge["New"].bg} ${statusColors.badge["New"].text} ${statusColors.badge["New"].border}`;
  };

  // Helper function to get status styling from centralized config
  const getCustomerStatusStyle = (status: string) => {
    const statusStyle = statusColors.customerStatus[status as keyof typeof statusColors.customerStatus];
    if (statusStyle) {
      return `${statusStyle.bg} ${statusStyle.text}`;
    }
    return `${statusColors.customerStatus.Potential.bg} ${statusColors.customerStatus.Potential.text}`;
  };

  // Helper function to get stage styling from centralized config
  const getStageStyle = (stage: string) => {
    const stageStyle = statusColors.stage[stage as keyof typeof statusColors.stage];
    if (stageStyle) {
      return `${stageStyle.bg} ${stageStyle.text}`;
    }
    return `${statusColors.stage.Awareness.bg} ${statusColors.stage.Awareness.text}`;
  };

  const getPriorityIndicator = (priority: string, customerName: string) => {
    const getNotifications = () => {
      switch (priority) {
        case "urgent":
          return [
            { type: "task", message: "Follow-up call overdue by 2 days", time: "2d ago" },
            { type: "notification", message: "Customer requested price adjustment", time: "1d ago" },
            { type: "task", message: "Manager escalation required", time: "Today" },
          ];
        case "high":
          return [
            { type: "task", message: "Send product catalog", time: "Today" },
            { type: "notification", message: "Customer showed high interest", time: "Yesterday" },
          ];
        default:
          return [];
      }
    };

    const notifications = getNotifications();
    
    if (!notifications.length) return null;

    const badge = (
      <div className={`absolute -top-1 -right-1 w-4 h-4 ${priority === "urgent" ? "bg-orange-500" : "bg-blue-500"} border-2 border-white dark:border-gray-900 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform`}>
        {priority === "urgent" && <Bell className="w-2 h-2 text-white" />}
      </div>
    );

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {badge}
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-xs p-3">
          <div className="space-y-2">
            <p className="mb-2 opacity-80">Tasks & Notifications for {customerName}</p>
            {notifications.map((notif, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm border-l-2 border-[#4B6BFB] pl-2 py-1">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {notif.type === "task" ? (
                      <Target className="w-3 h-3 text-[#4B6BFB]" />
                    ) : (
                      <Bell className="w-3 h-3 text-amber-500" />
                    )}
                    <span className="opacity-60">{notif.time}</span>
                  </div>
                  <p className="mt-1 mb-0">{notif.message}</p>
                </div>
              </div>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    );
  };

  const EmotionIndicator = ({ emotion }: { emotion: string }) => {
    // Use centralized emotion config
    const emotionConfig = statusColors.emotion[emotion as keyof typeof statusColors.emotion];
    
    const getEmotionGradient = () => {
      if (emotionConfig) {
        // Map emotion colors to gradients
        const colorMap: Record<string, string> = {
          "Very Happy": "from-emerald-400 to-green-500",
          "Happy": "from-green-400 to-emerald-500",
          "Neutral": "from-gray-400 to-slate-500",
          "Unhappy": "from-orange-400 to-red-500",
          "Very Unhappy": "from-red-500 to-rose-600",
        };
        return colorMap[emotion] || "from-gray-400 to-slate-500";
      }
      return "from-gray-400 to-slate-500";
    };

    const gradient = getEmotionGradient();
    const emoji = emotionConfig?.emoji || "😐";

    return (
      <div className="relative w-10 h-10">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 rounded-full blur-sm`} />
        <div
          className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center text-lg`}
        >
          {emoji}
        </div>
      </div>
    );
  };

  return (
    <TooltipProvider>
      <Card className="flex-1 overflow-hidden backdrop-blur-sm bg-glass-bg border-glass-border">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="p-4 opacity-60">Customer Name</TableHead>
              <TableHead className="p-4 opacity-60">Contact</TableHead>
              <TableHead 
                className="p-4 opacity-60 cursor-pointer hover:opacity-100 transition-opacity select-none"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center">
                  Status
                  <SortIcon field="status" />
                </div>
              </TableHead>
              <TableHead 
                className="p-4 opacity-60 cursor-pointer hover:opacity-100 transition-opacity select-none"
                onClick={() => handleSort('stage')}
              >
                <div className="flex items-center">
                  Stage
                  <SortIcon field="stage" />
                </div>
              </TableHead>
              <TableHead 
                className="p-4 opacity-60 cursor-pointer hover:opacity-100 transition-opacity select-none"
                onClick={() => handleSort('nextAction')}
              >
                <div className="flex items-center">
                  Next Action
                  <SortIcon field="nextAction" />
                </div>
              </TableHead>
              <TableHead className="p-4 opacity-60">Last Summary</TableHead>
              <TableHead 
                className="p-4 opacity-60 cursor-pointer hover:opacity-100 transition-opacity select-none"
                onClick={() => handleSort('dateCreated')}
              >
                <div className="flex items-center">
                  Date Created
                  <SortIcon field="dateCreated" />
                </div>
              </TableHead>
              <TableHead 
                className="p-4 opacity-60 cursor-pointer hover:opacity-100 transition-opacity select-none"
                onClick={() => handleSort('lastUpdated')}
              >
                <div className="flex items-center">
                  Last Updated
                  <SortIcon field="lastUpdated" />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCustomers.map((customer, index) => (
              <motion.tr
                key={customer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-border hover:bg-accent/30 transition-colors cursor-pointer"
                onClick={() => setSelectedCustomer(customer)}
              >
                <TableCell className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <EmotionIndicator emotion={customer.emotion} />
                        {getPriorityIndicator(customer.priority, customer.name)}
                      </div>
                      <div>
                        <p className="mb-0">{customer.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Users className="w-3 h-3 opacity-40" />
                          <Badge variant="outline" className={getBadgeStyle(customer.badge)}>
                            {customer.badge}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="p-4">
                    <div className="flex items-center gap-2">
                      {customer.contactMethods.includes("email") && (
                        <div className="w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <Mail className="w-2.5 h-2.5 text-blue-600" />
                        </div>
                      )}
                      {customer.contactMethods.includes("phone") && (
                        <div className="w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <Phone className="w-2.5 h-2.5 text-blue-600" />
                        </div>
                      )}
                      {customer.contactMethods.includes("instagram") && (
                        <div className="w-4 h-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                          <Instagram className="w-2.5 h-2.5 text-purple-600" />
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="p-4">
                    <Badge className={getCustomerStatusStyle(customer.status)}>
                      {customer.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="p-4">
                    <Badge className={getStageStyle(customer.stage)}>
                      {customer.stage}
                    </Badge>
                  </TableCell>

                  <TableCell className="p-4">
                    <p className="opacity-70 mb-0">{customer.nextAction}</p>
                  </TableCell>

                  <TableCell className="p-4 max-w-xs whitespace-normal">
                    <div className="relative">
                      <p className={`opacity-70 mb-0 ${expandedSummary === customer.id ? '' : 'line-clamp-3'}`}>
                        {customer.summary}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedSummary(expandedSummary === customer.id ? null : customer.id);
                        }}
                      >
                        {expandedSummary === customer.id ? 'Less' : 'More'}
                        <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${expandedSummary === customer.id ? 'rotate-180' : ''}`} />
                      </Button>
                    </div>
                  </TableCell>

                  <TableCell className="p-4">
                    <div className="space-y-1">
                      <p className="mb-0">{customer.dateCreated}</p>
                      <p className="opacity-60 mb-0">{customer.createdBy}</p>
                    </div>
                  </TableCell>

                  <TableCell className="p-4">
                    <div className="space-y-1">
                      <p className="mb-0">{customer.lastUpdated}</p>
                      <p className="opacity-60 mb-0">{customer.updatedBy}</p>
                    </div>
                  </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Customer Detail Panel */}
      <CustomerDetailPanel
        customer={selectedCustomer}
        isOpen={selectedCustomer !== null}
        onClose={() => setSelectedCustomer(null)}
        getStatusColor={getCustomerStatusStyle}
      />
    </TooltipProvider>
  );
}
