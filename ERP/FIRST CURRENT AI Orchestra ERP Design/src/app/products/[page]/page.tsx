"use client";

import { notFound } from 'next/navigation';
import { slugToSidebarItem } from '@/utils/routing';
import App from '@/App';

export default function ProductsPage({ params }: { params: { page: string } }) {
  const pageName = slugToSidebarItem(params.page);
  
  const validPages = [
    'Overview',
    'Product',
    'Material',
    'Diamond & Gemstone',
    'Attributes & Variants',
    'Custom & Bundle',
    'Pricing Matrix',
    'Collections Manager',
    'Product Insights',
  ];
  
  if (!validPages.includes(pageName)) {
    notFound();
  }
  
  return <App />;
}

