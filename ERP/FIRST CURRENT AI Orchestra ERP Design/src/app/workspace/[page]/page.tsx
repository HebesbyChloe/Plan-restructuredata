"use client";

import { notFound } from 'next/navigation';
import { slugToSidebarItem } from '@/utils/routing';
import App from '@/App';

export default function WorkspacePage({ params }: { params: { page: string } }) {
  const pageName = slugToSidebarItem(params.page);
  
  const validPages = [
    'My Work Space',
    'My Tasks',
    'Projects & Campaigns',
    'Task Calendar',
    'Task Analytics',
    'Shift Schedule',
    'AI Flow',
  ];
  
  if (!validPages.includes(pageName)) {
    notFound();
  }
  
  return <App />;
}

