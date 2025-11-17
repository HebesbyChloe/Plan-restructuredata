"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTenants, useTenant } from '../hooks/useSystem';
import type { SysTenant } from '../types/database/system';

interface TenantContextType {
  currentTenantId: number | null;
  currentTenant: SysTenant | null;
  tenants: SysTenant[];
  loading: boolean;
  error: Error | null;
  setCurrentTenantId: (tenantId: number | null) => void;
  refreshTenants: () => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

interface TenantProviderProps {
  children: ReactNode;
  defaultTenantId?: number | null;
}

export function TenantProvider({ children, defaultTenantId = null }: TenantProviderProps) {
  const [currentTenantId, setCurrentTenantIdState] = useState<number | null>(defaultTenantId);
  const { tenants, loading: tenantsLoading, error: tenantsError, refresh: refreshTenants } = useTenants();
  const { tenant: currentTenant, loading: tenantLoading } = useTenant(currentTenantId);

  // Load tenant ID from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTenantId = localStorage.getItem('current_tenant_id');
      if (savedTenantId) {
        const tenantId = parseInt(savedTenantId, 10);
        if (!isNaN(tenantId)) {
          setCurrentTenantIdState(tenantId);
        }
      } else if (tenants.length > 0 && !currentTenantId) {
        // Auto-select first tenant if none selected
        setCurrentTenantIdState(tenants[0].id);
      }
    }
  }, [tenants, currentTenantId]);

  // Save tenant ID to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && currentTenantId) {
      localStorage.setItem('current_tenant_id', currentTenantId.toString());
    }
  }, [currentTenantId]);

  const setCurrentTenantId = (tenantId: number | null) => {
    setCurrentTenantIdState(tenantId);
    if (tenantId && typeof window !== 'undefined') {
      localStorage.setItem('current_tenant_id', tenantId.toString());
    } else if (typeof window !== 'undefined') {
      localStorage.removeItem('current_tenant_id');
    }
  };

  const value: TenantContextType = {
    currentTenantId,
    currentTenant: currentTenant || null,
    tenants,
    loading: tenantsLoading || tenantLoading,
    error: tenantsError,
    setCurrentTenantId,
    refreshTenants,
  };

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

export function useTenantContext() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenantContext must be used within a TenantProvider');
  }
  return context;
}

