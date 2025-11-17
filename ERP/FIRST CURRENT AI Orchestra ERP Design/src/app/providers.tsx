"use client";

import { ThemeProvider } from 'next-themes'
import { Toaster } from '../components/ui/sonner'
import { TenantProvider } from '../contexts/TenantContext'

export function Providers({ children }: { children: React.ReactNode }) {
  try {
    return (
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <TenantProvider>
          {children}
          <Toaster />
        </TenantProvider>
      </ThemeProvider>
    );
  } catch (error) {
    console.error('Error in Providers:', error);
    return <>{children}</>;
  }
}

