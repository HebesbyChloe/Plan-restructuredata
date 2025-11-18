"use client";

import { notFound } from 'next/navigation';
import { slugToSidebarItem } from '@/utils/routing';
import App from '@/App';

export default function FulfillmentPage({ params }: { params: { page: string } }) {
  const pageName = slugToSidebarItem(params.page);
  
  const validPages = [
    'Overview',
    'Shipping',
    'Return',
    'Automation Control',
    'Fulfilment Insights',
    'AI Flow',
  ];
  
  if (!validPages.includes(pageName)) {
    notFound();
  }
  
  return <App />;
}

