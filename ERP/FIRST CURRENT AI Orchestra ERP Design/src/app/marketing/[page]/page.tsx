"use client";

import { notFound } from 'next/navigation';
import { slugToSidebarItem } from '@/utils/routing';
import App from '@/App';

export default function MarketingPage({ params }: { params: { page: string } }) {
  const pageName = slugToSidebarItem(params.page);
  
  // Validate the page exists
  const validPages = [
    'Campaign Calendar',
    'Campaign',
    'Brand Hub',
    'Promotion',
    'Asset Library',
    'Inspiration',
    'Resources',
    'Reports',
    'AI Flow',
  ];
  
  if (!validPages.includes(pageName)) {
    notFound();
  }
  
  // Render the full App component so sidebar and navigation work correctly
  return <App />;
}

