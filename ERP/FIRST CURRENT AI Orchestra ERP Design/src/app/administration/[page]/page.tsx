"use client";

import { notFound } from 'next/navigation';
import { slugToSidebarItem } from '@/utils/routing';
import App from '@/App';

export default function AdministrationPage({ params }: { params: { page: string } }) {
  const pageName = slugToSidebarItem(params.page);
  
  const validPages = [
    'Overview',
    'User Management',
    'Role & Permission',
    'Tenant Management',
    'Company Settings',
    'AI Agents',
    'AI Flow',
    'Automation / Integration',
    'Audit Logs',
  ];
  
  if (!validPages.includes(pageName)) {
    notFound();
  }
  
  // Render the full App component so sidebar and navigation work correctly
  return <App />;
}
