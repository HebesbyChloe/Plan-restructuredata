"use client";

import { slugToSidebarItem } from '@/utils/routing';
import App from '@/App';

export default function MarketingPage({ params }: { params: { page: string } }) {
  // All marketing pages are handled by App component
  return <App />;
}

