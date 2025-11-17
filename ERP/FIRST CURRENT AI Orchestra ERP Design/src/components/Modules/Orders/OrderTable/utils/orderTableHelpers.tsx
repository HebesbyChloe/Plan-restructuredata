import React from "react";
import {
  Smile,
  Meh,
  Frown,
  Clock,
  AlertCircle,
  MessageCircle,
  Facebook,
  Globe,
  Star,
  MessageSquare,
  Crown,
  Award,
  RefreshCw,
  UserPlus,
  Package,
  ShoppingCart,
  Wrench,
  Palette,
} from "lucide-react";

export const getRankIcon = (rank: string) => {
  switch (rank) {
    case "VVIP":
      return <Crown className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
    case "VIP":
      return <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
    case "Repeat":
      return <RefreshCw className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    case "New":
      return <UserPlus className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
    default:
      return <UserPlus className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
  }
};

export const getRankColor = (rank: string) => {
  switch (rank) {
    case "VVIP":
      return "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950 dark:text-amber-400";
    case "VIP":
      return "bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-950 dark:text-purple-400";
    case "Repeat":
      return "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-950 dark:text-blue-400";
    case "New":
      return "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-400";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-400";
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400";
    case "Delivered":
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
    case "Processing":
      return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
    case "Partial Payment":
      return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400";
    case "Shipped":
      return "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-400";
    case "In Transit":
      return "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400";
    case "Out for Delivery":
      return "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-400";
    case "Shipping Delay":
      return "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400";
    case "Refunded":
      return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
};

export const getTrackingStatusColor = (status: string) => {
  switch (status) {
    case "Delivered":
      return "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400";
    case "Processing":
      return "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400";
    case "In Transit":
      return "bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-400";
    case "Out for Delivery":
      return "bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-400";
    case "Label Created":
      return "bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-400";
    case "Shipping Delay":
      return "bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-400";
    default:
      return "bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-400";
  }
};

export const getApprovalColor = (status: string) => {
  switch (status) {
    case "Pending":
      return "bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-400 border-slate-300";
    case "Under Review":
      return "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-300";
    case "Approved":
      return "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 border-green-300";
    case "Qualified":
      return "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border-blue-300";
    case "Excellent":
      return "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-300";
    case "Bad":
      return "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 border-red-300";
    default:
      return "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-400 border-gray-300";
  }
};

export const getCSATIcon = (status: string) => {
  switch (status) {
    case "Love It":
      return <Smile className="w-4 h-4 text-green-600 dark:text-green-400" />;
    case "Neutral":
      return <Meh className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
    case "No Respond":
      return <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
    case "Not Satisfied":
      return <Frown className="w-4 h-4 text-orange-600 dark:text-orange-400" />;
    case "Complain":
      return <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />;
    default:
      return <MessageCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
  }
};

export const getCSATColor = (status: string) => {
  // Unified pastel background with mono color text - only icon has color
  return "bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-800";
};

export const getReviewSourceIcon = (source: string) => {
  switch (source) {
    case "Facebook":
      return <Facebook className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    case "Google":
      return <Globe className="w-4 h-4 text-red-600 dark:text-red-400" />;
    case "Yelp":
      return <Star className="w-4 h-4 text-red-600 dark:text-red-400" />;
    case "UGC":
      return <MessageSquare className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
    default:
      return null;
  }
};

export const getFollowUpStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 border-green-300";
    case "In Progress":
      return "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border-blue-300";
    case "Pending":
      return "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-300";
    case "Not Started":
      return "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-400 border-gray-300";
    default:
      return "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-400 border-gray-300";
  }
};

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    // Optional: You can add a toast notification here if needed
    console.log('Copied to clipboard:', text);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};

export const getTrackingUrl = (carrier: string, trackingNumber: string): string => {
  const carrierLower = carrier.toLowerCase();
  
  if (carrierLower.includes('ups')) {
    return `https://www.ups.com/track?tracknum=${trackingNumber}`;
  } else if (carrierLower.includes('fedex')) {
    return `https://www.fedex.com/fedextrack/?tracknumbers=${trackingNumber}`;
  } else if (carrierLower.includes('usps')) {
    return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`;
  } else if (carrierLower.includes('dhl')) {
    return `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`;
  } else {
    // Generic tracking search
    return `https://www.google.com/search?q=track+${carrier}+${trackingNumber}`;
  }
};

export const getStatusProcessColor = (group: string) => {
  switch (group) {
    case "Regular":
      return "bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-400";
    case "Pre Ordered":
      return "bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400";
    case "Service Order":
      return "bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-400";
    case "Customize":
      return "bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-400";
    default:
      return "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-400";
  }
};

export const getStatusProcessIcon = (group: string) => {
  switch (group) {
    case "Regular":
      return <Package className="w-3.5 h-3.5" />;
    case "Pre Ordered":
      return <ShoppingCart className="w-3.5 h-3.5" />;
    case "Service Order":
      return <Wrench className="w-3.5 h-3.5" />;
    case "Customize":
      return <Palette className="w-3.5 h-3.5" />;
    default:
      return null;
  }
};

