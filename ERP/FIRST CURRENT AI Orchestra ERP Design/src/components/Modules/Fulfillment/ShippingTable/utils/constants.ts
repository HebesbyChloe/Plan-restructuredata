import { ShipmentData } from "../types";

export const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    bgColor: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    dotColor: "bg-gray-500",
    icon: "⏳",
  },
  picking: {
    label: "Picking",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    bgColor: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    dotColor: "bg-amber-500",
    icon: "👋",
  },
  picked: {
    label: "Picked",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    bgColor: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    dotColor: "bg-blue-500",
    icon: "✅",
  },
  packing: {
    label: "Packing",
    color: "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300",
    bgColor: "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300",
    dotColor: "bg-violet-500",
    icon: "📦",
  },
  packed: {
    label: "Packed",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    bgColor: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    dotColor: "bg-purple-500",
    icon: "📦",
  },
  ready: {
    label: "Ready",
    color: "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
    bgColor: "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
    dotColor: "bg-teal-500",
    icon: "✔️",
  },
  "label-printed": {
    label: "Label Printed",
    color: "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300",
    bgColor: "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300",
    dotColor: "bg-sky-500",
    icon: "🏷️",
  },
  shipped: {
    label: "Shipped",
    color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300",
    bgColor: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300",
    dotColor: "bg-cyan-500",
    icon: "🚚",
  },
  "in-transit": {
    label: "In Transit",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    bgColor: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    dotColor: "bg-blue-500",
    icon: "🚛",
  },
  "out-for-delivery": {
    label: "Out for Delivery",
    color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
    bgColor: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
    dotColor: "bg-indigo-500",
    icon: "🏃",
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    bgColor: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    dotColor: "bg-green-500",
    icon: "✅",
  },
  exception: {
    label: "Exception",
    color: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    bgColor: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    dotColor: "bg-red-500",
    icon: "⚠️",
  },
  returned: {
    label: "Returned",
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
    bgColor: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
    dotColor: "bg-orange-500",
    icon: "↩️",
  },
} as const;

export const PRIORITY_CONFIG = {
  low: {
    label: "Low",
    color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  },
  normal: {
    label: "Normal",
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400",
  },
  high: {
    label: "High",
    color: "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400",
  },
  urgent: {
    label: "Urgent",
    color: "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400",
  },
} as const;

export const CARRIER_CONFIG = {
  USPS: { label: "USPS", icon: "📮" },
  UPS: { label: "UPS", icon: "📦" },
  FedEx: { label: "FedEx", icon: "✈️" },
  DHL: { label: "DHL", icon: "🚚" },
  "VN Post": { label: "VN Post", icon: "🇻🇳" },
  DPD: { label: "DPD", icon: "📦" },
  GLS: { label: "GLS", icon: "🚛" },
} as const;

export const WAREHOUSE_CONFIG = {
  US: { label: "United States", icon: "🇺🇸", color: "text-blue-600" },
  VN: { label: "Vietnam", icon: "🇻🇳", color: "text-red-600" },
} as const;

export const SHIPPING_METHOD_CONFIG = {
  standard: { label: "Standard", icon: "🚶" },
  express: { label: "Express", icon: "🏃" },
  overnight: { label: "Overnight", icon: "⚡" },
  international: { label: "International", icon: "🌍" },
} as const;

// Full service names combining carrier + method
export const getFullServiceName = (
  carrier: keyof typeof CARRIER_CONFIG,
  method: keyof typeof SHIPPING_METHOD_CONFIG
): string => {
  const serviceNames: Record<string, Record<string, string>> = {
    USPS: {
      standard: "USPS Priority",
      express: "USPS Express",
      overnight: "USPS Overnight",
      international: "USPS International",
    },
    UPS: {
      standard: "UPS Ground Saver",
      express: "UPS 2nd Day Air",
      overnight: "UPS Overnight",
      international: "UPS International Standard",
    },
    FedEx: {
      standard: "FedEx Ground",
      express: "FedEx 2 Business Days",
      overnight: "FedEx Overnight",
      international: "FedEx International",
    },
    DHL: {
      standard: "DHL Standard",
      express: "DHL Express",
      overnight: "DHL Overnight",
      international: "DHL International",
    },
    "VN Post": {
      standard: "VN Post Standard",
      express: "VN Post Express",
      overnight: "VN Post Fast",
      international: "VN Post International",
    },
    DPD: {
      standard: "DPD Classic",
      express: "DPD Express",
      overnight: "DPD Overnight",
      international: "DPD International",
    },
    GLS: {
      standard: "GLS Standard",
      express: "GLS Express",
      overnight: "GLS Overnight",
      international: "GLS International",
    },
  };

  return serviceNames[carrier]?.[method] || `${carrier} ${SHIPPING_METHOD_CONFIG[method]?.label || method}`;
};

// Carrier options for dropdown
export const CARRIER_OPTIONS = [
  { value: "USPS", label: "USPS 📮" },
  { value: "UPS", label: "UPS 📦" },
  { value: "FedEx", label: "FedEx ✈️" },
  { value: "DHL", label: "DHL 🚚" },
  { value: "VN Post", label: "VN Post 🇻🇳" },
  { value: "DPD", label: "DPD 📦" },
  { value: "GLS", label: "GLS 🚛" },
] as const;

// Tag options for shipping
export const TAGS_OPTIONS = [
  { value: "fragile", label: "Fragile", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  { value: "rush", label: "Rush Order", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  { value: "gift", label: "Gift", color: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400" },
  { value: "oversized", label: "Oversized", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  { value: "international", label: "International", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  { value: "heavy", label: "Heavy Package", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  { value: "cold-chain", label: "Cold Chain", color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400" },
  { value: "hazmat", label: "Hazmat", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  { value: "signature", label: "Signature Required", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400" },
  { value: "insurance", label: "Insured", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
] as const;

// Sales reps for assignment
export const SALE_REPS = [
  "Hang Tran",
  "Ngoc Vo",
  "Hai Lam",
  "Hoang My",
  "Laura Sale",
  "Michael Chen",
  "Sarah Park",
  "David Kim",
  "Jennifer Lee",
  "Alex Johnson"
] as const;
