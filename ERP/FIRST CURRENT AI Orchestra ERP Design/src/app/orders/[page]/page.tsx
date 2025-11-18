"use client";

import { notFound } from 'next/navigation';
import { slugToSidebarItem } from '@/utils/routing';
import App from '@/App';

export default function OrdersPage({ params }: { params: { page: string } }) {
  const pageName = slugToSidebarItem(params.page);
  
  // Validate the page exists, otherwise show 404
  const validPages = [
    'Overview',
    'Orders',
    'Pre-Orders',
    'Customize Orders',
    'Service Orders',
    'Customer Service',
    'Order Insights',
    'AI Flow',
  ];
  
  if (!validPages.includes(pageName)) {
    notFound();
  }
  
  // Render the full App component so sidebar and navigation work correctly
  return <App />;
}

