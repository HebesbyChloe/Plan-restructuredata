"use client";

import { Card } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
import {
  Calendar,
  MapPin,
  Package,
  Truck,
  DollarSign,
  User,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  CreditCard,
  Home,
  Building,
  AlertCircle,
  CheckCircle,
  Clock,
  Upload,
  Trash2,
  Image as ImageIcon,
  X,
  Edit,
  FileText,
  RefreshCw,
  Printer,
  Ban,
  Archive,
  ListOrdered,
  Send,
  MessageSquare,
  Star,
  Facebook,
  Instagram,
  Tag,
  Plus,
  Minus,
  Search,
} from "lucide-react";
import { motion } from "motion/react";
import { useState, useRef } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../../ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../ui/tabs";
import { Separator } from "../../../ui/separator";
import { Textarea } from "../../../ui/textarea";
import { Input } from "../../../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "../../../ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../ui/dialog";
import { InfoBadge } from "../../../ui/info-badge";
import { OrderData } from "../../../../types/modules/crm";
import { 
  getStatusColor, 
  getApprovalColor, 
  getRankIcon, 
  copyToClipboard,
  getTrackingUrl,
  getTrackingStatusColor,
  getCSATIcon,
  getReviewSourceIcon,
  getStatusProcessColor,
  getStatusProcessIcon
} from "../../Orders/OrderTable/utils/orderTableHelpers";
import { ImageWithFallback } from "../../../figma/ImageWithFallback";
import { DEFAULT_SALE_REPS, APPROVAL_STATUS, STATUS_ORDER_NEXT_ACTION, ORDER_STATUSES, PAYMENT_METHODS, REVIEW_SOURCE, CSAT_STATUS, TRACKING_STATUSES, ALL_PROCESSING_STATUSES } from "../../Orders/OrderTable/utils/orderTableConstants";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../../ui/collapsible";
import { getSocialReviewByOrderId, SOCIAL_PLATFORMS, SocialReview } from "../../../../sampledata/socialReviewData";
import { PRODUCT_CATALOG, searchProducts, ProductCatalogItem } from "../../../../sampledata/productCatalog";
import { PROMOTIONS, getActivePromotions, Promotion } from "../../../../sampledata/promotions";
import { getInternalNotesByOrderId, getOrderImagesByOrderId } from "../../../../sampledata/internalOrderDataExtra";

interface OrderDetailPanelProps {
  order: OrderData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderDetailPanel({
  order,
  isOpen,
  onClose,
}: OrderDetailPanelProps) {
  const [showShippingInfo, setShowShippingInfo] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showSocialReviewForm, setShowSocialReviewForm] = useState(false);
  const [nextActionExpanded, setNextActionExpanded] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [productSearchQuery, setProductSearchQuery] = useState("");
  
  // Get order images from internalOrderDataExtra
  const orderImagesData = order ? getOrderImagesByOrderId(order.id) : [];
  const [orderImages, setOrderImages] = useState<string[]>(
    orderImagesData.map(img => img.url)
  );
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reviewImageInputRef = useRef<HTMLInputElement>(null);
  
  // Editable state - Initialize from order data
  const [editableOrderStatus, setEditableOrderStatus] = useState(order?.orderStatus || ORDER_STATUSES[0]);
  const [editableApprovalStatus, setEditableApprovalStatus] = useState(order?.followUp.approvalStatus || "");
  const [editableAssignedTo, setEditableAssignedTo] = useState(order?.saleRepMain || "");
  const [editableFeedbackStatus, setEditableFeedbackStatus] = useState(order?.customerService?.csatStatus || CSAT_STATUS[0]);
  const [editableReviewSource, setEditableReviewSource] = useState(
    order?.customerService?.reviewSources?.[0] || 
    order?.customerService?.socialReview?.platform || 
    REVIEW_SOURCE[0]
  );
  const [editablePaymentMethod, setEditablePaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [editableTrackingStatus, setEditableTrackingStatus] = useState(order?.tracking?.[0]?.status || TRACKING_STATUSES[0]);
  const [editableProcessingStatus, setEditableProcessingStatus] = useState(order?.statusProcess?.currentStatus || ALL_PROCESSING_STATUSES[0]);
  const [editableProcessingGroup, setEditableProcessingGroup] = useState(order?.statusProcess?.group || "Regular");
  
  // Get customer note from order data
  const [customerNote, setCustomerNote] = useState(order?.customerNote || "");
  
  // Get internal notes from internalOrderDataExtra
  const internalNotesData = order ? getInternalNotesByOrderId(order.id) : [];
  const [internalNote, setInternalNote] = useState("");
  
  // Contact form state
  const [contactMethod, setContactMethod] = useState("Email");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  // Social review state
  const existingReview = getSocialReviewByOrderId(order?.orderNumber || "");
  const [socialReviewPlatform, setSocialReviewPlatform] = useState(existingReview?.platform || "None");
  const [socialReviewText, setSocialReviewText] = useState(existingReview?.reviewText || "");
  const [socialReviewImages, setSocialReviewImages] = useState<string[]>(existingReview?.images || []);
  const [socialReviewNotes, setSocialReviewNotes] = useState(existingReview?.notes || "");

  // Editable order details state for Edit Mode
  const [editableProducts, setEditableProducts] = useState([
    {
      id: "1",
      name: "Amethyst Crystal Bracelet",
      sku: "BRC-AME-001",
      qty: 1,
      price: 120.00,
      stockInHouse: 15,
      stockGlobal: 48,
    },
    {
      id: "2",
      name: "Rose Quartz Pendant",
      sku: "PND-RQ-003",
      qty: 2,
      price: 45.00,
      stockInHouse: 8,
      stockGlobal: 32,
    },
  ]);
  const [editableSubtotal, setEditableSubtotal] = useState(0);
  const [editableShipping, setEditableShipping] = useState(12.99);
  const [editableTax, setEditableTax] = useState(0);
  const [editableDiscount, setEditableDiscount] = useState(15.00);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(
    PROMOTIONS.find(p => p.code === "WELCOME15") || null
  );
  const [editableShippingAddress, setEditableShippingAddress] = useState({
    name: "",
    street: "123 Crystal Lane",
    city: "Los Angeles",
    state: "CA",
    zip: "90001",
    country: "USA",
  });
  const [editableShippingMethod, setEditableShippingMethod] = useState("Standard Shipping");

  if (!order) return null;

  // Mock data - in real app, this would come from the order
  const orderDetails = {
    subtotal: order.amount,
    shipping: 12.99,
    tax: order.amount * 0.08,
    discount: 15.00,
    couponCode: "WELCOME15",
    total: order.amount + 12.99 + (order.amount * 0.08) - 15.00,
    customerPhone: "+1 (555) 123-4567",
    customerEmail: "customer@email.com",
    shippingMethod: order.fulfillmentType === "Store Pickup" ? "Store Pickup" : order.fulfillmentType === "Manual Mark Shipped" ? "Manual Shipping" : "Standard Shipping",
    shippingAddress: {
      name: order.customerName,
      street: "123 Crystal Lane",
      city: "Los Angeles",
      state: "CA",
      zip: "90001",
      country: "USA",
    },
    billingAddress: {
      name: order.customerName,
      street: "123 Crystal Lane",
      city: "Los Angeles",
      state: "CA",
      zip: "90001",
      country: "USA",
    },
    paymentMethod: "Visa ****4242",
    products: [
      {
        id: "1",
        name: "Amethyst Crystal Bracelet",
        sku: "BRC-AME-001",
        qty: 1,
        price: 120.00,
        stockInHouse: 15,
        stockGlobal: 48,
      },
      {
        id: "2",
        name: "Rose Quartz Pendant",
        sku: "PND-RQ-003",
        qty: 2,
        price: 45.00,
        stockInHouse: 8,
        stockGlobal: 32,
      },
    ],
    linkedOrders: order.alerts.linkedOrders ? [
      { orderNumber: "#12340", date: "2024-01-10", amount: "$89.99", status: "Delivered" },
      { orderNumber: "#12342", date: "2024-01-12", amount: "$156.50", status: "Processing" },
      { orderNumber: "#12344", date: "2024-01-14", amount: "$234.00", status: "Shipped" },
    ] : [],
    timeline: [
      {
        id: "1",
        date: order.createdDate,
        time: order.createdTime,
        event: "Order Created",
        description: `Order placed by ${order.customerName}`,
        status: "completed",
        user: order.saleRepConverted,
      },
      {
        id: "2",
        date: order.createdDate,
        time: "10:35 AM",
        event: "Payment Received",
        description: `Payment of $${order.amount.toLocaleString()} received via ${order.orderStatus.includes("Partial") ? "Partial Payment" : "Credit Card"}`,
        status: "completed",
        user: "System",
      },
      {
        id: "3",
        date: order.tracking[0]?.dateShipped || order.createdDate,
        time: "2:15 PM",
        event: "Order Shipped",
        description: order.tracking[0] ? `Shipped via ${order.tracking[0].carrier}` : "Awaiting shipment",
        status: order.tracking[0] ? "completed" : "pending",
        user: order.saleRepMain,
      },
      {
        id: "4",
        date: "Pending",
        time: "-",
        event: STATUS_ORDER_NEXT_ACTION[0], // Using constant
        description: "Next scheduled action",
        status: "pending",
        user: order.saleRepMain,
      },
    ],
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // In real app, upload to server and get URLs
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setOrderImages([...orderImages, ...newImages]);
    }
  };

  const handleDeleteImage = (index: number) => {
    setOrderImages(orderImages.filter((_, i) => i !== index));
  };

  const getAlertsList = () => {
    const alerts = [];
    if (order.alerts.imageMissing) alerts.push({ type: "warning", text: "Image Missing" });
    if (order.alerts.customerNote) alerts.push({ type: "info", text: "Customer Note" });
    if (order.alerts.addressMissing) alerts.push({ type: "warning", text: "Address Missing" });
    if (order.alerts.linkedOrders) alerts.push({ type: "info", text: "Linked Orders" });
    if (order.alerts.late) alerts.push({ type: "error", text: `Late by ${order.alerts.late} days` });
    if (order.alerts.serviceRequest) alerts.push({ type: "warning", text: "Service Request" });
    if (order.alerts.refundRequest) alerts.push({ type: "error", text: "Refund Request" });
    return alerts;
  };

  const alerts = getAlertsList();

  const handleAddInternalNote = () => {
    if (internalNote.trim()) {
      console.log("Adding internal note:", internalNote);
      setInternalNote("");
      // In real app, save to backend
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-3xl overflow-y-auto bg-background p-0" aria-describedby="order-detail-description">
        <SheetHeader className="sr-only">
          <SheetTitle>Order {order.orderNumber} - Order Details</SheetTitle>
        </SheetHeader>
        <p id="order-detail-description" className="sr-only">
          Detailed order information including customer details, tracking, and order history
        </p>

        {/* Fixed Header Section */}
        <div className="sticky top-0 z-10 bg-background border-b border-border p-4 space-y-3">
          {/* Primary Info Row - Order Number & Date */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="mb-0 text-2xl">{order.orderNumber}</h2>
              <div className="flex items-center gap-1.5 text-sm opacity-60">
                <Calendar className="w-3.5 h-3.5" />
                <span>{order.createdDate} {order.createdTime}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Action Buttons */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`h-8 px-3 gap-1 ${isEditMode ? 'bg-amber-50 dark:bg-amber-950 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400' : ''}`}
                  >
                    {isEditMode && <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1 animate-pulse" />}
                    Actions
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditMode(!isEditMode)}>
                    <Edit className="w-4 h-4 mr-2" />
                    {isEditMode ? "Exit Edit Mode" : "Edit Order"}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ListOrdered className="w-4 h-4 mr-2" />
                    Add to Pre-Order
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Package className="w-4 h-4 mr-2" />
                    Add to Custom
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Add to Return
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Printer className="w-4 h-4 mr-2" />
                    Print Label
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <DollarSign className="w-4 h-4 mr-2" />
                    Request Refund
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Ban className="w-4 h-4 mr-2" />
                    Request Hold
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Customer & Shipping Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Customer Info */}
            <Card className="p-3 bg-muted/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-ai-blue" />
                  <p className="text-xs opacity-60 mb-0">Customer</p>
                </div>
                <div className="flex items-center gap-1">
                  {getRankIcon(order.customerRank)}
                  <span className="text-xs opacity-60">{order.customerRank}</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <p className="mb-0">{order.customerName}</p>
                <div className="flex items-center gap-1.5 text-xs opacity-70">
                  <Phone className="w-3 h-3 flex-shrink-0" />
                  <span>{orderDetails.customerPhone}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs opacity-70">
                  <Mail className="w-3 h-3 flex-shrink-0" />
                  <span>{orderDetails.customerEmail}</span>
                </div>
              </div>
            </Card>

            {/* Shipping Address */}
            <Card className="p-3 bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <Truck className="w-4 h-4 text-ai-blue" />
                <p className="text-xs opacity-60 mb-0">Shipping Address</p>
              </div>
              {isEditMode ? (
                <div className="space-y-2">
                  <Input
                    type="text"
                    value={editableShippingAddress.street}
                    onChange={(e) => setEditableShippingAddress({...editableShippingAddress, street: e.target.value})}
                    placeholder="Street address"
                    className="h-7 text-sm"
                  />
                  <div className="grid grid-cols-3 gap-1.5">
                    <Input
                      type="text"
                      value={editableShippingAddress.city}
                      onChange={(e) => setEditableShippingAddress({...editableShippingAddress, city: e.target.value})}
                      placeholder="City"
                      className="h-7 text-xs"
                    />
                    <Input
                      type="text"
                      value={editableShippingAddress.state}
                      onChange={(e) => setEditableShippingAddress({...editableShippingAddress, state: e.target.value})}
                      placeholder="State"
                      className="h-7 text-xs"
                    />
                    <Input
                      type="text"
                      value={editableShippingAddress.zip}
                      onChange={(e) => setEditableShippingAddress({...editableShippingAddress, zip: e.target.value})}
                      placeholder="ZIP"
                      className="h-7 text-xs"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 pt-1.5 border-t border-border/50">
                    <Package className="w-3 h-3 opacity-60 flex-shrink-0" />
                    <Input
                      type="text"
                      value={editableShippingMethod}
                      onChange={(e) => setEditableShippingMethod(e.target.value)}
                      placeholder="Shipping method"
                      className="h-6 text-xs flex-1"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <p className="mb-0">{orderDetails.shippingAddress.street}</p>
                  <p className="mb-0 text-xs opacity-70">
                    {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.zip}
                  </p>
                  <p className="mb-0 text-xs opacity-70">{orderDetails.shippingAddress.country}</p>
                  <div className="flex items-center gap-1.5 pt-1.5 border-t border-border/50">
                    <Package className="w-3 h-3 opacity-60" />
                    <span className="text-xs opacity-70">{orderDetails.shippingMethod}</span>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Row 1: Order Status, Process States, Tracking, Payment Method */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
            {/* 1. Order Status - Combined Order Status + Tracking Status */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className={`px-2 h-6 flex items-center gap-1.5 w-full rounded border text-xs ${
                  editableTrackingStatus && editableTrackingStatus !== "Not Shipped" 
                    ? getTrackingStatusColor(editableTrackingStatus) 
                    : getStatusColor(editableOrderStatus)
                }`}>
                  {editableTrackingStatus && editableTrackingStatus !== "Not Shipped" ? (
                    <Truck className="w-3 h-3 flex-shrink-0" />
                  ) : (
                    <Package className="w-3 h-3 flex-shrink-0" />
                  )}
                  <span className="truncate flex-1">
                    {editableTrackingStatus && editableTrackingStatus !== "Not Shipped" 
                      ? editableTrackingStatus 
                      : editableOrderStatus}
                  </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Order Status</div>
                {ORDER_STATUSES.map((status) => (
                  <DropdownMenuItem key={status} onClick={() => setEditableOrderStatus(status)}>
                    <Package className="w-3 h-3 mr-2" />
                    {status}
                  </DropdownMenuItem>
                ))}
                <Separator className="my-1" />
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Tracking Status</div>
                {TRACKING_STATUSES.map((status) => (
                  <DropdownMenuItem key={status} onClick={() => setEditableTrackingStatus(status)}>
                    <Truck className="w-3 h-3 mr-2" />
                    {status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 2. Process Status - Order Type & Current Status */}
            {order.statusProcess && (
              <div className={`h-6 px-2 flex items-center justify-center gap-1.5 w-full rounded text-xs ${getStatusProcessColor(editableProcessingGroup)}`}>
                {getStatusProcessIcon(editableProcessingGroup)}
                <span>{editableProcessingStatus}</span>
              </div>
            )}

            {/* 3. Tracking Number/Shipment Type Badge */}
            {order.fulfillmentType === "Store Pickup" ? (
              <InfoBadge variant="default" size="md" className="h-6 w-full">
                Store Pick up
              </InfoBadge>
            ) : order.fulfillmentType === "Manual Mark Shipped" ? (
              <InfoBadge variant="default" size="md" className="h-6 w-full">
                Manual Mark Shipped
              </InfoBadge>
            ) : order.tracking.length === 0 ? (
              <div className="px-2 h-6 flex items-center gap-1 w-full rounded border bg-muted/30 border-muted-foreground/20 text-xs text-muted-foreground">
                No tracking
              </div>
            ) : order.tracking.length === 1 ? (
              <InfoBadge variant="default" size="md" className="h-6 w-full flex items-center gap-1.5 flex-wrap">
                <a
                  href={getTrackingUrl(order.tracking[0].carrier, order.tracking[0].trackingNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-ai-blue hover:underline cursor-pointer flex items-center gap-1.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>{order.tracking[0].carrier}</span>
                  <span>-</span>
                  <span>{order.tracking[0].dateShipped}</span>
                </a>
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
              <Popover>
                <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <div className="cursor-pointer w-full">
                    <InfoBadge variant="default" size="md" icon={<Package className="w-3 h-3" />} className="h-6 w-full">
                      Multiple Shipment ({order.tracking.length})
                    </InfoBadge>
                  </div>
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
                        <div className={`inline-flex items-center justify-center px-2 py-1 rounded text-xs ${getTrackingStatusColor(track.status)}`}>
                          {track.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}

            {/* 4. Payment Method - Auto from data */}
            {isEditMode ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="px-2 h-6 flex items-center gap-1 w-full rounded border bg-muted/30 border-muted-foreground/20 cursor-pointer hover:bg-muted/50 text-xs">
                    <CreditCard className="w-3 h-3 opacity-60 flex-shrink-0" />
                    <span className="truncate flex-1">{editablePaymentMethod}</span>
                    <ChevronDown className="w-3 h-3 flex-shrink-0 opacity-60" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {PAYMENT_METHODS.map((method) => (
                    <DropdownMenuItem key={method} onClick={() => setEditablePaymentMethod(method)}>
                      <CreditCard className="w-3 h-3 mr-2" />
                      {method}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="px-2 h-6 flex items-center gap-1 w-full rounded border bg-muted/30 border-muted-foreground/20 text-xs">
                <CreditCard className="w-3 h-3 opacity-60 flex-shrink-0" />
                <span className="truncate flex-1">{editablePaymentMethod}</span>
              </div>
            )}
          </div>

          {/* Row 2: Alerts */}
          {alerts.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {alerts.map((alert, idx) => {
                // Special handling for Linked Orders alert - show as popover
                if (alert.text === "Linked Orders") {
                  return (
                    <Popover key={idx}>
                      <PopoverTrigger asChild>
                        <div className="cursor-pointer">
                          <Badge
                            variant="outline"
                            className={`text-xs hover:bg-blue-500/10 ${
                              alert.type === "error"
                                ? "border-red-500 text-red-600 dark:text-red-400"
                                : alert.type === "warning"
                                ? "border-amber-500 text-amber-600 dark:text-amber-400"
                                : "border-blue-500 text-blue-600 dark:text-blue-400"
                            }`}
                          >
                            <AlertCircle className="w-3 h-3 mr-1" />
                            {alert.text}
                          </Badge>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent 
                        className="w-80 p-3" 
                        align="start"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-2 pb-2 border-b border-border">
                            <ListOrdered className="w-4 h-4 text-ai-blue" />
                            <span className="text-sm">Linked Orders</span>
                          </div>
                          {orderDetails.linkedOrders.length > 0 ? (
                            orderDetails.linkedOrders.map((linkedOrder, orderIdx) => (
                              <div key={orderIdx} className="flex flex-col gap-2 pb-3 border-b border-border/50 last:border-0 last:pb-0">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Package className="w-4 h-4 text-ai-blue" />
                                    <span className="text-sm">{linkedOrder.orderNumber}</span>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 hover:bg-muted/50"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // In real app, navigate to order
                                      console.log("View order:", linkedOrder.orderNumber);
                                    }}
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                  </Button>
                                </div>
                                <div className="flex items-center gap-3 text-xs opacity-70">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>{linkedOrder.date}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <DollarSign className="w-3 h-3" />
                                    <span>{linkedOrder.amount}</span>
                                  </div>
                                </div>
                                <Badge variant="outline" className="text-xs w-fit">
                                  {linkedOrder.status}
                                </Badge>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-4 opacity-60">
                              <ListOrdered className="w-8 h-8 mx-auto mb-2 opacity-40" />
                              <p className="text-xs mb-0">No linked orders</p>
                            </div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  );
                }
                
                // Regular alert badges
                return (
                  <Badge
                    key={idx}
                    variant="outline"
                    className={`text-xs ${
                      alert.type === "error"
                        ? "border-red-500 text-red-600 dark:text-red-400"
                        : alert.type === "warning"
                        ? "border-amber-500 text-amber-600 dark:text-amber-400"
                        : "border-blue-500 text-blue-600 dark:text-blue-400"
                    }`}
                  >
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {alert.text}
                  </Badge>
                );
              })}
            </div>
          )}

          {/* Row 3: Sale Rep, Approval, Feedback, Review */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
            {/* 5. Sale Rep (Assigned Staff) - Editable */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="px-2 h-6 flex items-center gap-1 w-full rounded border bg-muted/30 border-muted-foreground/20 cursor-pointer hover:bg-muted/50 text-xs">
                  <User className="w-3 h-3 opacity-60 flex-shrink-0" />
                  <span className="truncate flex-1">{editableAssignedTo}</span>
                  <ChevronDown className="w-3 h-3 flex-shrink-0 opacity-60" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {DEFAULT_SALE_REPS.map((staff) => (
                  <DropdownMenuItem key={staff} onClick={() => setEditableAssignedTo(staff)}>
                    {staff}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 6. Approval Status - Editable */}
            {order.followUp.approvalStatus && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className={`px-2 h-6 flex items-center gap-1 w-full rounded border cursor-pointer text-xs ${getApprovalColor(editableApprovalStatus)}`}>
                    <CheckCircle className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate flex-1">{editableApprovalStatus}</span>
                    <ChevronDown className="w-3 h-3 flex-shrink-0 opacity-60" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {APPROVAL_STATUS.map((status) => (
                    <DropdownMenuItem key={status} onClick={() => setEditableApprovalStatus(status)}>
                      {status}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* 7. Customer Feedback (CSAT) - Editable */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="px-2 h-6 flex items-center gap-1 w-full rounded border bg-muted/30 border-muted-foreground/20 cursor-pointer hover:bg-muted/50 text-xs">
                  <span className="w-3 h-3 flex-shrink-0 flex items-center justify-center">
                    {getCSATIcon(editableFeedbackStatus)}
                  </span>
                  <span className="truncate flex-1">{editableFeedbackStatus}</span>
                  <ChevronDown className="w-3 h-3 flex-shrink-0 opacity-60" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {CSAT_STATUS.map((status) => (
                  <DropdownMenuItem key={status} onClick={() => setEditableFeedbackStatus(status)}>
                    <div className="flex items-center gap-2">
                      {getCSATIcon(status)}
                      <span>{status}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 8. Social Review - Shows icon of uploaded review */}
            <div 
              className="px-2 h-6 flex items-center gap-1 w-full rounded border bg-muted/30 border-muted-foreground/20 cursor-pointer hover:bg-muted/50 text-xs"
              onClick={() => setShowSocialReviewForm(!showSocialReviewForm)}
            >
              <span className="w-3 h-3 flex-shrink-0 flex items-center justify-center">
                {getReviewSourceIcon(socialReviewPlatform)}
              </span>
              <span className="truncate flex-1">{socialReviewPlatform}</span>
              {showSocialReviewForm ? (
                <ChevronUp className="w-3 h-3 flex-shrink-0 opacity-60" />
              ) : (
                <ChevronDown className="w-3 h-3 flex-shrink-0 opacity-60" />
              )}
            </div>
          </div>

          {/* Social Review Form - Expandable */}
          {showSocialReviewForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="px-4 pb-3 space-y-3"
            >
              <Card className="p-3 space-y-3 bg-muted/20">
                <div className="flex items-center justify-between">
                  <p className="text-sm opacity-70">Social Review Details</p>
                  {/* Platform Selector */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-7 px-2 gap-1 text-xs">
                        <span className="flex items-center gap-1">
                          {getReviewSourceIcon(socialReviewPlatform)}
                          <span>{socialReviewPlatform}</span>
                        </span>
                        <ChevronDown className="w-3 h-3 opacity-60" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {SOCIAL_PLATFORMS.map((platform) => (
                        <DropdownMenuItem 
                          key={platform} 
                          onClick={() => setSocialReviewPlatform(platform)}
                        >
                          <div className="flex items-center gap-2">
                            {getReviewSourceIcon(platform)}
                            <span>{platform}</span>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Review Text */}
                <div className="space-y-1.5">
                  <label className="text-xs opacity-70">Customer Review</label>
                  <Textarea
                    placeholder="Enter customer review text..."
                    value={socialReviewText}
                    onChange={(e) => setSocialReviewText(e.target.value)}
                    className="min-h-[80px] text-xs resize-none"
                  />
                </div>

                {/* Image Upload */}
                <div className="space-y-1.5">
                  <label className="text-xs opacity-70">Review Images</label>
                  <div 
                    className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-ai-blue/50 transition-colors"
                    onClick={() => reviewImageInputRef.current?.click()}
                  >
                    <Upload className="w-6 h-6 mx-auto mb-2 opacity-40" />
                    <p className="text-xs opacity-60">Click or drag images here</p>
                    <p className="text-xs opacity-40 mt-1">PNG, JPG up to 10MB</p>
                  </div>
                  <input
                    ref={reviewImageInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files) {
                        const newImages = Array.from(files).map(file => URL.createObjectURL(file));
                        setSocialReviewImages([...socialReviewImages, ...newImages]);
                      }
                    }}
                  />
                  
                  {/* Display uploaded images */}
                  {socialReviewImages.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {socialReviewImages.map((img, idx) => (
                        <div key={idx} className="relative group aspect-square">
                          <ImageWithFallback
                            src={img}
                            alt={`Review image ${idx + 1}`}
                            className="w-full h-full object-cover rounded"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSocialReviewImages(socialReviewImages.filter((_, i) => i !== idx));
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Internal Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs opacity-70">Internal Notes</label>
                  <Textarea
                    placeholder="Add notes about this review (e.g., view count, engagement, impact)..."
                    value={socialReviewNotes}
                    onChange={(e) => setSocialReviewNotes(e.target.value)}
                    className="min-h-[60px] text-xs resize-none"
                  />
                </div>

                {/* Save Button */}
                <div className="flex gap-2 justify-end pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 text-xs"
                    onClick={() => setShowSocialReviewForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    className="h-7 text-xs bg-ai-blue hover:bg-ai-blue/90"
                    onClick={() => {
                      console.log("Saving social review:", {
                        platform: socialReviewPlatform,
                        text: socialReviewText,
                        images: socialReviewImages,
                        notes: socialReviewNotes
                      });
                      setShowSocialReviewForm(false);
                    }}
                  >
                    Save Review
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Row 4: Next Action Button - Centered, Different Color */}
          <Button 
            size="sm" 
            className="w-full h-7 px-3 text-xs justify-center bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={() => setShowContactForm(!showContactForm)}
          >
            <MessageSquare className="w-3 h-3 mr-2" />
            <span className="opacity-90">Next Action:</span>
            <span className="ml-1">{STATUS_ORDER_NEXT_ACTION[0]}</span>
            {showContactForm ? <ChevronUp className="w-3 h-3 ml-2" /> : <ChevronDown className="w-3 h-3 ml-2" />}
          </Button>
        </div>

        {/* Contact Methods - Collapsible */}
        {showContactForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-b border-border bg-muted/30 p-3"
          >
            <p className="text-xs opacity-60 mb-2">Contact via:</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 justify-start"
                onClick={() => {
                  console.log("Contact via Meta");
                  setShowContactForm(false);
                }}
              >
                <Facebook className="w-4 h-4" />
                Meta
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 justify-start"
                onClick={() => {
                  console.log("Contact via Instagram");
                  setShowContactForm(false);
                }}
              >
                <Instagram className="w-4 h-4" />
                IG
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 justify-start"
                onClick={() => {
                  console.log("Contact via Phone");
                  setShowContactForm(false);
                }}
              >
                <Phone className="w-4 h-4" />
                Phone
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 justify-start"
                onClick={() => {
                  console.log("Contact via Email");
                  setShowContactForm(false);
                }}
              >
                <Mail className="w-4 h-4" />
                Email
              </Button>
            </div>
          </motion.div>
        )}

        {/* Edit Mode Banner */}
        {isEditMode && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-amber-50 dark:bg-amber-950 border-b border-amber-200 dark:border-amber-800 px-6 py-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <div>
                  <p className="text-sm mb-0">Edit Mode Active</p>
                  <p className="text-xs opacity-60 mb-0">Make changes to order details, products, shipping, and payment</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsEditMode(false)}
                  className="h-8"
                >
                  Cancel
                </Button>
                <Button 
                  size="sm"
                  onClick={() => {
                    console.log("Saving order changes...", {
                      products: editableProducts,
                      shipping: editableShipping,
                      discount: editableDiscount,
                      promotion: selectedPromotion,
                      shippingAddress: editableShippingAddress,
                      shippingMethod: editableShippingMethod,
                      paymentMethod: editablePaymentMethod,
                    });
                    setIsEditMode(false);
                  }}
                  className="h-8 bg-emerald-600 hover:bg-emerald-700"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Save Changes
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Scrollable Tabs Section */}
        <div className="p-6">
          <Tabs defaultValue="images" className="w-full">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="images">Order Images</TabsTrigger>
            </TabsList>
            
            {/* Details Tab */}
            <TabsContent value="details" className="mt-4 space-y-3">
              {(isEditMode ? editableProducts : orderDetails.products).map((product, index) => (
                <Card key={product.id} className="p-4 bg-muted/30">
                  <div className="flex gap-4">
                    {/* Product Image Placeholder */}
                    <div className="w-16 h-16 rounded-md bg-gradient-to-br from-purple-400 to-pink-400 flex-shrink-0" />
                    
                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="mb-1 truncate">{product.name}</h4>
                          <p className="text-sm opacity-60 mb-0">SKU: {product.sku}</p>
                        </div>
                        {isEditMode && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                            onClick={() => {
                              setEditableProducts(editableProducts.filter((_, i) => i !== index));
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <p className="text-xs opacity-60 mb-0.5">Quantity</p>
                          {isEditMode ? (
                            <Input
                              type="number"
                              value={product.qty}
                              onChange={(e) => {
                                const newProducts = [...editableProducts];
                                newProducts[index].qty = parseInt(e.target.value) || 0;
                                setEditableProducts(newProducts);
                              }}
                              className="h-7 w-20 text-sm"
                              min="1"
                            />
                          ) : (
                            <p className="mb-0">{product.qty}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-xs opacity-60 mb-0.5">Price</p>
                          {isEditMode ? (
                            <Input
                              type="number"
                              value={product.price}
                              onChange={(e) => {
                                const newProducts = [...editableProducts];
                                newProducts[index].price = parseFloat(e.target.value) || 0;
                                setEditableProducts(newProducts);
                              }}
                              className="h-7 w-24 text-sm"
                              step="0.01"
                              min="0"
                            />
                          ) : (
                            <p className="mb-0 text-emerald-600 dark:text-emerald-400">
                              ${product.price.toFixed(2)}
                            </p>
                          )}
                        </div>
                        <div>
                          <p className="text-xs opacity-60 mb-0.5">Stock (House)</p>
                          <p className="mb-0">{product.stockInHouse}</p>
                        </div>
                        <div>
                          <p className="text-xs opacity-60 mb-0.5">Stock (Global)</p>
                          <p className="mb-0">{product.stockGlobal}</p>
                        </div>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs opacity-60 mb-1">Total</p>
                      <p className="text-lg text-emerald-600 dark:text-emerald-400 mb-0">
                        ${(product.price * product.qty).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}

              {/* Add Product Button - Only in Edit Mode */}
              {isEditMode && (
                <Button
                  variant="outline"
                  className="w-full h-12 border-dashed"
                  onClick={() => {
                    setShowProductSearch(true);
                    setProductSearchQuery("");
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              )}

              {/* Order Summary Card */}
              <Card className="p-3 bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-950 dark:to-cyan-950 border-emerald-200 dark:border-emerald-800">
                <div className="space-y-2">
                  {/* First Row: Subtotal, Shipping, Tax */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <span className="opacity-60">Subtotal:</span>{" "}
                        <span>${(isEditMode ? editableProducts.reduce((sum, p) => sum + (p.price * p.qty), 0) : orderDetails.subtotal).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="opacity-60">Shipping:</span>{" "}
                        {isEditMode ? (
                          <Input
                            type="number"
                            value={editableShipping}
                            onChange={(e) => setEditableShipping(parseFloat(e.target.value) || 0)}
                            className="h-6 w-20 text-xs"
                            step="0.01"
                          />
                        ) : (
                          <span>${orderDetails.shipping.toFixed(2)}</span>
                        )}
                      </div>
                      <div>
                        <span className="opacity-60">Tax:</span>{" "}
                        <span>${(isEditMode ? editableTax : orderDetails.tax).toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm opacity-60 mb-0">Total</p>
                      <p className="text-2xl text-emerald-600 dark:text-emerald-400 mb-0">
                        ${(isEditMode 
                          ? editableProducts.reduce((sum, p) => sum + (p.price * p.qty), 0) + editableShipping + editableTax - editableDiscount
                          : orderDetails.total
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Second Row: Promotion/Coupon Code */}
                  <div className="pt-2 border-t border-emerald-200/50 dark:border-emerald-700/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-emerald-600 dark:text-emerald-400 opacity-60" />
                      <span className="text-sm opacity-60">Promotion:</span>
                      {isEditMode ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-7 px-2 text-xs bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700 hover:bg-emerald-200 dark:hover:bg-emerald-900/50">
                              {selectedPromotion ? selectedPromotion.code : "Select promotion"}
                              <ChevronDown className="w-3 h-3 ml-1" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-64">
                            <DropdownMenuItem onClick={() => setSelectedPromotion(null)}>
                              <X className="w-3 h-3 mr-2" />
                              No promotion
                            </DropdownMenuItem>
                            {getActivePromotions().map((promo) => (
                              <DropdownMenuItem 
                                key={promo.id} 
                                onClick={() => {
                                  setSelectedPromotion(promo);
                                  setEditableDiscount(promo.discountValue);
                                }}
                              >
                                <div className="flex flex-col">
                                  <div className="flex items-center gap-2">
                                    <Tag className="w-3 h-3" />
                                    <span>{promo.code}</span>
                                  </div>
                                  <span className="text-xs opacity-60 ml-5">{promo.description}</span>
                                </div>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        orderDetails.couponCode && (
                          <Badge variant="outline" className="bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300">
                            {orderDetails.couponCode}
                          </Badge>
                        )
                      )}
                    </div>
                    <div className="text-sm text-emerald-600 dark:text-emerald-400">
                      <span className="opacity-80">Discount:</span>{" "}
                      <span>-${(isEditMode ? editableDiscount : orderDetails.discount).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Tracking Information */}
              {order.tracking.length > 0 && (
                <div className="mt-6">
                  <h4 className="mb-3 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-ai-blue" />
                    Shipping & Tracking
                  </h4>
                  <div className="space-y-2">
                    {order.tracking.map((track, idx) => (
                      <Card key={idx} className="p-4 bg-muted/30">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Truck className="w-4 h-4 opacity-60" />
                            <a
                              href={getTrackingUrl(track.carrier, track.trackingNumber)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-ai-blue hover:underline cursor-pointer flex items-center gap-1"
                            >
                              <span>{track.carrier}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2"
                            onClick={() => copyToClipboard(track.trackingNumber)}
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="opacity-60">Shipped: {track.dateShipped}</span>
                          <Badge className={`${getTrackingStatusColor(track.status)} text-xs`}>
                            {track.status}
                          </Badge>
                        </div>
                        <p className="text-xs opacity-60 mt-2 mb-0 font-mono">
                          {track.trackingNumber}
                        </p>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Notes Tab - Restructured */}
            <TabsContent value="notes" className="mt-4 space-y-4">
              {/* Customer Note Section - Always at top */}
              <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="mb-0 flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    Customer Note
                  </h4>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                    <Edit className="w-3.5 h-3.5" />
                  </Button>
                </div>
                <Textarea
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  placeholder="Add customer note..."
                  className="min-h-[80px] bg-white dark:bg-gray-900"
                />
              </Card>

              {/* Internal Notes Section */}
              <Card className="p-4 bg-muted/30">
                <h4 className="mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-ai-blue" />
                  Internal Notes
                </h4>
                <div className="space-y-2 mb-3">
                  <div className="p-3 bg-background rounded-md">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm opacity-60">{order.saleRepConverted}</span>
                      <span className="text-xs opacity-60">{order.createdDate}</span>
                    </div>
                    <p className="text-sm mb-0">
                      Customer converted by {order.saleRepConverted}. Currently handled by {order.saleRepMain}.
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Textarea
                    value={internalNote}
                    onChange={(e) => setInternalNote(e.target.value)}
                    placeholder="Add internal note..."
                    className="min-h-[80px]"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={handleAddInternalNote}
                  >
                    Add Internal Note
                  </Button>
                </div>
              </Card>

              <Separator />

              {/* Timeline Section */}
              <div>
                <h4 className="mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-ai-blue" />
                  Timeline
                </h4>
                <div className="space-y-4">
                  {orderDetails.timeline.map((event, idx) => (
                    <div key={event.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          event.status === "completed"
                            ? "bg-green-100 dark:bg-green-900"
                            : "bg-amber-100 dark:bg-amber-900"
                        }`}>
                          {event.status === "completed" ? (
                            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                          ) : (
                            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          )}
                        </div>
                        {idx < orderDetails.timeline.length - 1 && (
                          <div className="w-0.5 h-full bg-border mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        {event.status === "pending" ? (
                          <Collapsible open={nextActionExpanded} onOpenChange={setNextActionExpanded}>
                            <CollapsibleTrigger className="w-full">
                              <div className="flex items-start justify-between gap-4 mb-1 cursor-pointer hover:opacity-80 transition-opacity">
                                <div className="flex items-center gap-2">
                                  <h4 className="mb-0">{event.event}</h4>
                                  {nextActionExpanded ? (
                                    <ChevronUp className="w-4 h-4 opacity-60" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4 opacity-60" />
                                  )}
                                </div>
                                <span className="text-sm opacity-60 whitespace-nowrap">
                                  {event.date} {event.time !== "-" && event.time}
                                </span>
                              </div>
                            </CollapsibleTrigger>
                            <p className="text-sm opacity-70 mb-2 text-left">{event.description}</p>
                            <CollapsibleContent>
                              <div className="mt-3 p-3 bg-muted/30 rounded-lg border border-border/50">
                                <p className="text-xs opacity-60 mb-2">Contact via:</p>
                                <div className="grid grid-cols-2 gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2 justify-start"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      console.log("Contact via Meta");
                                    }}
                                  >
                                    <Facebook className="w-4 h-4" />
                                    Meta
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2 justify-start"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      console.log("Contact via Instagram");
                                    }}
                                  >
                                    <Instagram className="w-4 h-4" />
                                    IG
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2 justify-start"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      console.log("Contact via Phone");
                                    }}
                                  >
                                    <Phone className="w-4 h-4" />
                                    Phone
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2 justify-start"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      console.log("Contact via Email");
                                    }}
                                  >
                                    <Mail className="w-4 h-4" />
                                    Email
                                  </Button>
                                </div>
                              </div>
                            </CollapsibleContent>
                            <p className="text-xs opacity-60 mb-0 mt-2 text-left">By: {event.user}</p>
                          </Collapsible>
                        ) : (
                          <>
                            <div className="flex items-start justify-between gap-4 mb-1">
                              <h4 className="mb-0">{event.event}</h4>
                              <span className="text-sm opacity-60 whitespace-nowrap">
                                {event.date} {event.time !== "-" && event.time}
                              </span>
                            </div>
                            <p className="text-sm opacity-70 mb-1">{event.description}</p>
                            <p className="text-xs opacity-60 mb-0">By: {event.user}</p>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Order Images Tab */}
            <TabsContent value="images" className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="mb-0">Order Images ({orderImages.length})</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Add Images
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Image Grid */}
              {orderImages.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {orderImages.map((image, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="relative group aspect-square rounded-lg overflow-hidden bg-muted"
                    >
                      <ImageWithFallback
                        src={image}
                        alt={`Order image ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteImage(idx)}
                          className="gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <Card
                  className="p-12 border-2 border-dashed border-border/50 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="flex flex-col items-center justify-center gap-3 text-center">
                    <ImageIcon className="w-12 h-12 opacity-40" />
                    <div>
                      <p className="mb-1">No images uploaded yet</p>
                      <p className="text-sm opacity-60 mb-0">
                        Click to upload or drag and drop images here
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>

      {/* Product Search Dialog */}
      <Dialog open={showProductSearch} onOpenChange={setShowProductSearch}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Add Product to Order</DialogTitle>
            <DialogDescription>
              Search and select products to add to this order.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 flex-1 overflow-hidden">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
              <Input
                type="text"
                placeholder="Search by product name, SKU, or category..."
                value={productSearchQuery}
                onChange={(e) => setProductSearchQuery(e.target.value)}
                className="pl-10"
                autoFocus
              />
            </div>

            {/* Product List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
              {(productSearchQuery ? searchProducts(productSearchQuery) : PRODUCT_CATALOG).map((product) => (
                <Card
                  key={product.id}
                  className="p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => {
                    const newProduct = {
                      id: product.id,
                      name: product.name,
                      sku: product.sku,
                      qty: 1,
                      price: product.price,
                      stockInHouse: product.stockInHouse,
                      stockGlobal: product.stockGlobal,
                    };
                    setEditableProducts([...editableProducts, newProduct]);
                    setShowProductSearch(false);
                    setProductSearchQuery("");
                  }}
                >
                  <div className="flex items-center gap-4">
                    {/* Product Image Placeholder */}
                    <div className="w-12 h-12 rounded bg-gradient-to-br from-purple-400 to-pink-400 flex-shrink-0" />
                    
                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="mb-0.5 truncate">{product.name}</h4>
                      <p className="text-xs opacity-60 mb-0">SKU: {product.sku}</p>
                    </div>

                    {/* Price and Stock */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-emerald-600 dark:text-emerald-400 mb-0.5">
                        ${product.price.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2 text-xs opacity-60">
                        <span>In Stock: {product.stockInHouse}</span>
                        <span className="opacity-40">|</span>
                        <span>Global: {product.stockGlobal}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              
              {productSearchQuery && searchProducts(productSearchQuery).length === 0 && (
                <div className="text-center py-12 opacity-60">
                  <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p className="mb-0">No products found matching "{productSearchQuery}"</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Sheet>
  );
}
