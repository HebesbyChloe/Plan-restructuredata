"use client";

import { notFound } from 'next/navigation';
import { slugToSidebarItem } from '@/utils/routing';
import App from '@/App';

export default function LogisticsPage({ params }: { params: { page: string } }) {
  const pageName = slugToSidebarItem(params.page);
  
  const validPages = [
    'Overview',
    'Inbound Shipments',
    'Outbound Shipments',
    'Purchase Orders',
    'Procurement',
    'Vendors & Suppliers',
    'Logistic Insights',
  ];
  
  if (!validPages.includes(pageName)) {
    notFound();
  }
  
  return <App />;
}

