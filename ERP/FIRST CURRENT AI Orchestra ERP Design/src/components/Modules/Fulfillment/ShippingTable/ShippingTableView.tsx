import React, { useState, useRef, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../ui/table";
import { Checkbox } from "../../../ui/checkbox";
import { Settings2, GripVertical, Package, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "../../../ui/button";
import { Switch } from "../../../ui/switch";
import { Label } from "../../../ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "../../../ui/dropdown-menu";
import type { ShipmentData } from "./types";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Badge } from "../../../ui/badge";
import { formatShippedDate } from "./utils/helpers";
import type { ShipmentData } from "./types";

// Get icon based on shipment status
const getStatusIcon = (status: ShipmentData["status"]): string => {
  const iconMap: Record<ShipmentData["status"], string> = {
    "pending": "⏳",
    "picking": "🔍",
    "picked": "✅",
    "packing": "📦",
    "packed": "📦",
    "ready": "✓",
    "label-printed": "🏷️",
    "shipped": "📮",
    "in-transit": "🚚",
    "out-for-delivery": "🚛",
    "delivered": "✅",
    "exception": "⚠️",
    "returned": "↩️"
  };
  return iconMap[status] || "📦";
};
import { ImageWithFallback } from "../../../figma/ImageWithFallback";

export interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
  width?: string;
}

interface ShippingTableViewProps {
  shipments: ShipmentData[];
  selectedShipments: string[];
  onSelectionChange: (shipmentIds: string[]) => void;
  onShipmentClick: (shipment: ShipmentData) => void;
}

const DEFAULT_COLUMNS: ColumnConfig[] = [
  { id: "orderNumber", label: "Order #", visible: true, width: "120px" },
  { id: "batch", label: "Batch", visible: true, width: "100px" },
  { id: "assignedTo", label: "Assigned To", visible: true, width: "140px" },
  { id: "age", label: "Age", visible: true, width: "80px" },
  { id: "orderDate", label: "Order Date", visible: true, width: "120px" },
  { id: "notes", label: "Notes", visible: false, width: "150px" },
  { id: "recipient", label: "Recipient", visible: true, width: "180px" },
  { id: "quantity", label: "Quantity", visible: true, width: "90px" },
  { id: "orderTotal", label: "Order Total", visible: true, width: "110px" },
  { id: "country", label: "Country", visible: true, width: "100px" },
  { id: "tags", label: "Tags", visible: true, width: "150px" },
  { id: "service", label: "Service", visible: true, width: "160px" },
  { id: "zone", label: "Zone", visible: false, width: "80px" },
  { id: "rate", label: "Rate", visible: true, width: "100px" },
  { id: "itemName", label: "Item Name", visible: false, width: "180px" },
];

const TAG_COLORS: Record<string, string> = {
  fragile: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  rush: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  gift: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  oversized: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  international: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  heavy: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

// Draggable Column Header
function DraggableColumnHeader({ 
  column, 
  columnId,
  index, 
  moveColumn 
}: { 
  column: ColumnConfig; 
  columnId: string;
  index: number; 
  moveColumn: (dragIndex: number, hoverIndex: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: "column",
    item: () => ({ id: columnId, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "column",
    hover: (item: { id: string; index: number }, monitor) => {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get horizontal middle
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the left
      const hoverClientX = clientOffset!.x - hoverBoundingRect.left;

      // Only perform the move when the mouse has crossed half of the items width
      // When dragging left, only move when the cursor is below 50%
      // When dragging right, only move when the cursor is above 50%

      // Dragging left
      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return;
      }

      // Dragging right
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
        return;
      }

      // Time to actually perform the action
      moveColumn(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <TableHead
      style={{ 
        opacity: isDragging ? 0.5 : 1,
        width: column.width,
        minWidth: column.width,
        cursor: 'move',
      }}
      className="relative group"
    >
      <div 
        ref={ref}
        className="flex items-center gap-1"
      >
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="w-3.5 h-3.5 text-muted-foreground" />
        </div>
        <span>{column.label}</span>
      </div>
    </TableHead>
  );
}

export function ShippingTableView({ 
  shipments, 
  selectedShipments, 
  onSelectionChange,
  onShipmentClick 
}: ShippingTableViewProps) {
  const [columns, setColumns] = useState<ColumnConfig[]>(DEFAULT_COLUMNS);
  const [showLineItems, setShowLineItems] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const visibleColumns = columns.filter(col => col.visible);
  const allSelected = shipments.length > 0 && selectedShipments.length === shipments.length;

  // Auto-expand all rows when Line Items toggle is turned on
  useEffect(() => {
    if (showLineItems) {
      setExpandedRows(new Set(shipments.map(s => s.id)));
    } else {
      setExpandedRows(new Set());
    }
  }, [showLineItems, shipments]);

  const toggleColumn = (columnId: string) => {
    setColumns(prev =>
      prev.map(col =>
        col.id === columnId ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const moveColumn = (dragIndex: number, hoverIndex: number) => {
    setColumns(prev => {
      // Get the visible columns with their original indices
      const visibleWithIndices = prev
        .map((col, idx) => ({ col, originalIndex: idx }))
        .filter(({ col }) => col.visible);
      
      // Get the actual column indices in the full array
      const dragOriginalIndex = visibleWithIndices[dragIndex].originalIndex;
      const hoverOriginalIndex = visibleWithIndices[hoverIndex].originalIndex;
      
      // Create new array and move the columns
      const newColumns = [...prev];
      const dragColumn = newColumns[dragOriginalIndex];
      
      // Remove from old position
      newColumns.splice(dragOriginalIndex, 1);
      
      // Insert at new position
      newColumns.splice(hoverOriginalIndex, 0, dragColumn);
      
      return newColumns;
    });
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(shipments.map(s => s.id));
    }
  };

  const toggleSelect = (shipmentId: string) => {
    if (selectedShipments.includes(shipmentId)) {
      onSelectionChange(selectedShipments.filter(id => id !== shipmentId));
    } else {
      onSelectionChange([...selectedShipments, shipmentId]);
    }
  };

  const toggleRowExpansion = (shipmentId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(shipmentId)) {
        newSet.delete(shipmentId);
      } else {
        newSet.add(shipmentId);
      }
      return newSet;
    });
  };

  const getCellValue = (shipment: ShipmentData, columnId: string) => {
    switch (columnId) {
      case "orderNumber":
        return (
          <button
            onClick={() => onShipmentClick(shipment)}
            className="text-[#4B6BFB] hover:underline"
          >
            {shipment.orderNumber}
          </button>
        );
      case "assignedTo":
        return shipment.assignedTo || "-";
      case "age":
        const age = shipment.orderDate ? Math.floor((new Date().getTime() - new Date(shipment.orderDate).getTime()) / (1000 * 60 * 60 * 24)) : 0;
        return `${age}d`;
      case "orderDate":
        return shipment.orderDate ? new Date(shipment.orderDate).toLocaleDateString() : "-";
      case "notes":
        return shipment.notes || "-";
      case "batch":
        return shipment.batch || "-";
      case "recipient":
        return (
          <div>
            <div>{shipment.customerName}</div>
            <div className="text-xs text-muted-foreground">{shipment.shippingCity}, {shipment.shippingState}</div>
          </div>
        );
      case "quantity":
        return shipment.items?.length || 0;
      case "orderTotal":
        return `$${shipment.orderTotal?.toFixed(2) || "0.00"}`;
      case "country":
        return shipment.shippingCountry || "US";
      case "tags":
        return (
          <div className="flex items-center gap-1 flex-wrap">
            {shipment.priority === 'urgent' && (
              <Badge variant="destructive" className="h-5 text-xs">Urgent</Badge>
            )}
            {shipment.tags?.slice(0, 2).map((tag, i) => (
              <Badge 
                key={i} 
                variant="secondary" 
                className={`h-5 text-xs ${TAG_COLORS[tag] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'}`}
              >
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
              </Badge>
            ))}
            {shipment.tags && shipment.tags.length > 2 && (
              <span className="text-xs text-muted-foreground">+{shipment.tags.length - 2}</span>
            )}
          </div>
        );
      case "service":
        return (
          <div className="flex items-center gap-1.5">
            {shipment.status && (
              <span className="text-sm">{getStatusIcon(shipment.status)}</span>
            )}
            <span className="text-sm">{shipment.carrier}</span>
            {shipment.shipDate && (
              <span className="text-xs text-muted-foreground">• {formatShippedDate(shipment.shipDate)}</span>
            )}
          </div>
        );
      case "zone":
        return shipment.shippingZone || "-";
      case "rate":
        return `$${shipment.shippingCost?.toFixed(2) || "0.00"}`;
      case "itemName":
        return shipment.items?.[0]?.name || "-";
      default:
        return "-";
    }
  };

  const renderLineItems = (shipment: ShipmentData) => {
    if (!shipment.items || shipment.items.length === 0) {
      return <div className="text-sm text-muted-foreground px-3 py-3">No items</div>;
    }

    return (
      <div className="space-y-2 px-3 py-3">
        {shipment.items.map((item, index) => (
          <div key={index} className="flex items-center gap-3 text-sm">
            {item.image && (
              <ImageWithFallback
                src={item.image}
                alt={item.name || 'Product'}
                className="w-10 h-10 rounded object-cover flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="truncate">{item.name || 'Unnamed Item'}</div>
              <div className="text-sm text-muted-foreground">
                Qty: {item.quantity || 0} • ${(item.price || 0).toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {selectedShipments.length > 0 && (
              <span>{selectedShipments.length} selected</span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Show Line Items Toggle */}
            <div className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-md bg-background">
              <Package className="w-4 h-4 text-muted-foreground" />
              <Label htmlFor="line-items-toggle" className="cursor-pointer">
                Line Items
              </Label>
              <Switch
                id="line-items-toggle"
                checked={showLineItems}
                onCheckedChange={setShowLineItems}
              />
            </div>

            {/* Columns Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Settings2 className="w-4 h-4" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {columns.map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.visible}
                    onCheckedChange={() => toggleColumn(column.id)}
                  >
                    {column.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Table */}
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead style={{ width: "40px", minWidth: "40px" }} className="sticky left-0 bg-background z-10">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  {showLineItems && (
                    <TableHead style={{ width: "50px", minWidth: "50px" }}>
                      <Package className="w-4 h-4" />
                    </TableHead>
                  )}
                  {visibleColumns.map((column, index) => (
                    <DraggableColumnHeader
                      key={column.id}
                      column={column}
                      columnId={column.id}
                      index={index}
                      moveColumn={moveColumn}
                    />
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {shipments.map((shipment) => {
                  const isExpanded = expandedRows.has(shipment.id);
                  return (
                    <React.Fragment key={shipment.id}>
                      <TableRow className="hover:bg-muted/50">
                        <TableCell className="sticky left-0 bg-background z-10">
                          <Checkbox
                            checked={selectedShipments.includes(shipment.id)}
                            onCheckedChange={() => toggleSelect(shipment.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </TableCell>
                        {showLineItems && (
                          <TableCell 
                            style={{ width: "50px", minWidth: "50px" }}
                            className="align-top"
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleRowExpansion(shipment.id);
                              }}
                              className="p-1 hover:bg-muted rounded transition-colors"
                            >
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                              )}
                            </button>
                          </TableCell>
                        )}
                        {visibleColumns.map((column) => (
                          <TableCell 
                            key={column.id}
                            style={{ 
                              width: column.width,
                              minWidth: column.width,
                            }}
                            className="align-top"
                          >
                            {getCellValue(shipment, column.id)}
                          </TableCell>
                        ))}
                      </TableRow>
                      {showLineItems && isExpanded && (
                        <TableRow className="bg-muted/30">
                          <TableCell colSpan={visibleColumns.length + 2} className="p-0">
                            <div className="border-t border-border bg-muted/20">
                              {renderLineItems(shipment)}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
