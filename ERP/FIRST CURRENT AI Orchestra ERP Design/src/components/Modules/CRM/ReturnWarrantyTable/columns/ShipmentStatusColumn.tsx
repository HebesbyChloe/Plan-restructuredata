import { TableCell } from "../../../../ui/table";
import { Button } from "../../../../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../ui/popover";
import { Copy, Package, PackageCheck, PackageX, Truck, CheckCircle, Clock, PackageOpen } from "lucide-react";
import { ColumnProps } from "../types";
import { InfoBadge } from "../../../../ui/info-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../ui/dropdown-menu";
import { 
  RETURN_SHIPMENT_STATUS,
  RETURN_WARRANTY_STATUS,
  getReturnWarrantyExtraByOrderNumber 
} from "../../../../../sampledata/returnWarrantyExtraData";
import { 
  copyToClipboard, 
  getTrackingUrl, 
  getTrackingStatusColor
} from "../utils/returnWarrantyTableHelpers";

const PROCESSING_STATUSES = Object.values(RETURN_WARRANTY_STATUS);

// Get icon for shipment status
const getShipmentStatusIcon = (status: string) => {
  switch (status) {
    case RETURN_SHIPMENT_STATUS.NOT_STARTED:
      return <Clock className="w-3.5 h-3.5 text-muted-foreground" />;
    case RETURN_SHIPMENT_STATUS.LABEL_CREATED:
      return <PackageOpen className="w-3.5 h-3.5 text-blue-500" />;
    case RETURN_SHIPMENT_STATUS.LABEL_SENT:
      return <Package className="w-3.5 h-3.5 text-blue-500" />;
    case RETURN_SHIPMENT_STATUS.IN_TRANSIT:
      return <Truck className="w-3.5 h-3.5 text-orange-500" />;
    case RETURN_SHIPMENT_STATUS.RECEIVED:
      return <PackageCheck className="w-3.5 h-3.5 text-green-500" />;
    case RETURN_SHIPMENT_STATUS.PROCESSING:
      return <PackageOpen className="w-3.5 h-3.5 text-purple-500" />;
    case RETURN_SHIPMENT_STATUS.COMPLETED:
      return <CheckCircle className="w-3.5 h-3.5 text-green-500" />;
    default:
      return <Package className="w-3.5 h-3.5 text-muted-foreground" />;
  }
};

export function ShipmentStatusColumn({ order, onOrderInfoClick }: ColumnProps) {
  // Get extra data mapped by order number
  const extraData = getReturnWarrantyExtraByOrderNumber(order.orderNumber);
  const returnWarrantyDetails = order.returnWarrantyDetails;
  
  // Get shipment data - prioritize extraData, fallback to returnWarrantyDetails
  const shipmentStatus = extraData?.returnShipmentStatus || returnWarrantyDetails?.shippingStatus || RETURN_SHIPMENT_STATUS.NOT_STARTED;
  
  // Get date and updated by info
  const requestDate = order.createdDate || "—";
  const updatedBy = order.saleRepMain || order.saleRepConverted || "—";
  
  // Get processing status data (internal return/warranty status)
  const processingStatus = extraData?.returnWarrantyStatus || RETURN_WARRANTY_STATUS.INQUIRY_START;

  return (
    <TableCell 
      className="px-5 py-6 align-top cursor-pointer hover:bg-muted/10 transition-colors"
      onClick={(e) => {
        e.stopPropagation();
        onOrderInfoClick?.(order);
      }}
    >
      <div className="flex flex-col gap-2.5">
        {/* Date + Updated By - First div - min-h-[28px] */}
        <div className="text-sm text-muted-foreground min-h-[28px] flex items-center hover:text-ai-blue transition-colors">
          <span>{requestDate}</span>
          {updatedBy !== "—" && (
            <>
              <span className="mx-1.5">•</span>
              <span>{updatedBy}</span>
            </>
          )}
        </div>
        
        {/* Tracking Badge with Shipment Status Icon - Second div - min-h-[28px] */}
        <div className="min-h-[28px] flex items-center">
          {!order.tracking || order.tracking.length === 0 ? (
            // No tracking - show dash with status icon
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">—</span>
              {getShipmentStatusIcon(shipmentStatus)}
            </div>
          ) : order.tracking.length === 1 ? (
            // Single tracking - carrier - date, status icon, and copy icon
            <InfoBadge variant="default" size="md" className="w-full flex items-center gap-1.5 flex-wrap">
              <a
                href={getTrackingUrl(order.tracking[0].carrier, order.tracking[0].trackingNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-ai-blue hover:underline cursor-pointer flex items-center gap-1.5"
                onClick={(e) => e.stopPropagation()}
              >
                <span>{order.tracking[0].carrier}</span>
                <span>-</span>
                <span>{order.tracking[0].dateShipped}</span>
              </a>
              {getShipmentStatusIcon(shipmentStatus)}
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 ml-auto hover:bg-muted/50"
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(order.tracking[0].trackingNumber);
                }}
              >
                <Copy className="w-3 h-3" />
              </Button>
            </InfoBadge>
          ) : (
            // Multiple tracking - show popover with status icon
            <Popover>
              <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
                <InfoBadge variant="default" size="md" className="w-full flex items-center gap-1.5">
                  <Package className="w-3 h-3" />
                  <span>Multiple Shipment ({order.tracking.length})</span>
                  {getShipmentStatusIcon(shipmentStatus)}
                </InfoBadge>
              </PopoverTrigger>
              <PopoverContent 
                className="w-80 p-3" 
                align="start"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-col gap-3">
                  {order.tracking.map((track, idx) => (
                    <div key={idx} className="flex flex-col gap-2 pb-3 border-b border-border/50 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2">
                        <a
                          href={getTrackingUrl(track.carrier, track.trackingNumber)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-muted-foreground hover:text-ai-blue hover:underline cursor-pointer leading-tight"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {track.carrier} - {track.dateShipped}
                        </a>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0 ml-auto flex-shrink-0 hover:bg-muted/50"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(track.trackingNumber);
                          }}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      {track.status && (
                        <div className={`inline-flex items-center justify-center px-2 py-1 rounded text-xs ${getTrackingStatusColor(track.status)}`}>
                          {track.status}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
        
        {/* Return/Warranty Status Dropdown - Third div - min-h-[26px] */}
        <div className="min-h-[26px] flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <div className="w-full">
                <InfoBadge 
                  variant="blue"
                  size="sm"
                  className="w-full hover:opacity-80 transition-opacity"
                >
                  {processingStatus}
                </InfoBadge>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {PROCESSING_STATUSES.map((status) => (
                <DropdownMenuItem key={status}>{status}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </TableCell>
  );
}
