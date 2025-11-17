/**
 * Marketing Campaigns - Supabase Query Utilities
 * 
 * CRUD operations for mkt_campaigns table
 * Includes brand_id field handling
 */

import { supabase } from "../client";
import { MktCampaignRow, MktCampaignInsert, MktCampaignUpdate } from "../../../types/database/marketing";
import { Campaign } from "../../../types/modules/marketing";
import { mapCampaignFromDB, mapCampaignToDB, mapCampaignToDBUpdate } from "../../../utils/marketing/mappers";

// ============================================
// QUERY INTERFACES
// ============================================

export interface CampaignFilters {
  status?: Campaign['status'];
  type?: Campaign['type'];
  priority?: Campaign['priority'];
  ownerId?: number;
  brandId?: number | null;
  search?: string; // Search in name, description
}

// ============================================
// READ OPERATIONS
// ============================================

/**
 * Get all campaigns for a tenant with optional filters
 */
export async function getCampaigns(
  tenantId: number,
  filters?: CampaignFilters
): Promise<{ data: Campaign[] | null; error: Error | null }> {
  try {
    let query = supabase
      .from('mkt_campaigns')
      .select('*')
      .eq('tenant_id', tenantId)
      .is('deleted_at', null); // Only non-deleted campaigns

    // Apply filters
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.type) {
      query = query.eq('type', filters.type);
    }
    if (filters?.priority) {
      query = query.eq('priority', filters.priority);
    }
    if (filters?.ownerId) {
      query = query.eq('owner_id', filters.ownerId);
    }
    if (filters?.brandId !== undefined) {
      if (filters.brandId === null) {
        query = query.is('brand_id', null);
      } else {
        query = query.eq('brand_id', filters.brandId);
      }
    }
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    // Order by created_at descending
    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching campaigns:', error);
      return { data: null, error: new Error(error.message) };
    }

    if (!data) {
      return { data: [], error: null };
    }

    // Map database rows to frontend types
    const campaigns = data.map((row: MktCampaignRow) => mapCampaignFromDB(row));

    return { data: campaigns, error: null };
  } catch (err) {
    console.error('Unexpected error fetching campaigns:', err);
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

/**
 * Get a single campaign by ID
 */
export async function getCampaignById(
  id: number,
  tenantId: number
): Promise<{ data: Campaign | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('mkt_campaigns')
      .select('*')
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .is('deleted_at', null)
      .single();

    if (error) {
      console.error('Error fetching campaign:', error);
      return { data: null, error: new Error(error.message) };
    }

    if (!data) {
      return { data: null, error: null };
    }

    const campaign = mapCampaignFromDB(data as MktCampaignRow);
    return { data: campaign, error: null };
  } catch (err) {
    console.error('Unexpected error fetching campaign:', err);
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

// ============================================
// CREATE OPERATIONS
// ============================================

/**
 * Create a new campaign
 */
export async function createCampaign(
  campaign: Partial<Campaign>,
  tenantId: number
): Promise<{ data: Campaign | null; error: Error | null }> {
  try {
    const insertData = mapCampaignToDB(campaign);
    insertData.tenant_id = tenantId;

    const { data, error } = await supabase
      .from('mkt_campaigns')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Error creating campaign:', error);
      return { data: null, error: new Error(error.message) };
    }

    if (!data) {
      return { data: null, error: new Error('No data returned from insert') };
    }

    const newCampaign = mapCampaignFromDB(data as MktCampaignRow);
    return { data: newCampaign, error: null };
  } catch (err) {
    console.error('Unexpected error creating campaign:', err);
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

// ============================================
// UPDATE OPERATIONS
// ============================================

/**
 * Update an existing campaign
 */
export async function updateCampaign(
  id: number,
  updates: Partial<Campaign>,
  tenantId: number
): Promise<{ data: Campaign | null; error: Error | null }> {
  try {
    const updateData = mapCampaignToDBUpdate(updates);
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('mkt_campaigns')
      .update(updateData)
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .is('deleted_at', null)
      .select()
      .single();

    if (error) {
      console.error('Error updating campaign:', error);
      return { data: null, error: new Error(error.message) };
    }

    if (!data) {
      return { data: null, error: new Error('Campaign not found or already deleted') };
    }

    const updatedCampaign = mapCampaignFromDB(data as MktCampaignRow);
    return { data: updatedCampaign, error: null };
  } catch (err) {
    console.error('Unexpected error updating campaign:', err);
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

// ============================================
// DELETE OPERATIONS
// ============================================

/**
 * Soft delete a campaign (sets deleted_at timestamp)
 */
export async function deleteCampaign(
  id: number,
  tenantId: number
): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from('mkt_campaigns')
      .update({ 
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .is('deleted_at', null);

    if (error) {
      console.error('Error deleting campaign:', error);
      return { error: new Error(error.message) };
    }

    return { error: null };
  } catch (err) {
    console.error('Unexpected error deleting campaign:', err);
    return { error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

