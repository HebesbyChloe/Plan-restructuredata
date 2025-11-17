/**
 * Marketing Resources - Supabase Query Utilities
 * 
 * CRUD operations for:
 * - mkt_affiliates
 * - mkt_utm_links
 * - mkt_reference_documents
 * - mkt_marketing_channels
 */

import { supabase } from "../client";
import type { Affiliate, UTMLink, ReferenceDoc, Channel } from "../../../components/Modules/Marketing/Resources/resourcesData";

// ============================================
// AFFILIATES
// ============================================

export async function getAffiliates(
  tenantId: number
): Promise<{ data: Affiliate[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('mkt_affiliates')
      .select('*')
      .eq('tenant_id', tenantId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching affiliates:', error);
      return { data: null, error: new Error(error.message) };
    }

    if (!data) {
      return { data: [], error: null };
    }

    const affiliates: Affiliate[] = data.map((row: any) => ({
      id: String(row.id),
      name: row.name,
      type: row.type as "Affiliate" | "KOL" | "Influencer",
      email: row.email,
      platform: row.platform || undefined,
      commissionRate: Number(row.commission_rate) || 0,
      revenue: Number(row.revenue) || 0,
      status: row.status as "active" | "inactive" | "pending",
      joinDate: row.join_date 
        ? new Date(row.join_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    }));

    return { data: affiliates, error: null };
  } catch (err) {
    console.error('Unexpected error fetching affiliates:', err);
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

export async function createAffiliate(
  tenantId: number,
  affiliate: Omit<Affiliate, 'id' | 'joinDate'>
): Promise<{ data: Affiliate | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('mkt_affiliates')
      .insert({
        tenant_id: tenantId,
        name: affiliate.name,
        type: affiliate.type,
        email: affiliate.email,
        platform: affiliate.platform || null,
        commission_rate: affiliate.commissionRate,
        revenue: affiliate.revenue || 0,
        status: affiliate.status,
        join_date: new Date().toISOString().split('T')[0],
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating affiliate:', error);
      return { data: null, error: new Error(error.message) };
    }

    return {
      data: {
        id: String(data.id),
        name: data.name,
        type: data.type as "Affiliate" | "KOL" | "Influencer",
        email: data.email,
        platform: data.platform || undefined,
        commissionRate: Number(data.commission_rate) || 0,
        revenue: Number(data.revenue) || 0,
        status: data.status as "active" | "inactive" | "pending",
        joinDate: data.join_date 
          ? new Date(data.join_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      },
      error: null,
    };
  } catch (err) {
    console.error('Unexpected error creating affiliate:', err);
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

export async function updateAffiliate(
  id: number,
  updates: Partial<Omit<Affiliate, 'id' | 'joinDate'>>,
  tenantId: number
): Promise<{ data: Affiliate | null; error: Error | null }> {
  try {
    const updateData: any = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.type !== undefined) updateData.type = updates.type;
    if (updates.email !== undefined) updateData.email = updates.email;
    if (updates.platform !== undefined) updateData.platform = updates.platform || null;
    if (updates.commissionRate !== undefined) updateData.commission_rate = updates.commissionRate;
    if (updates.revenue !== undefined) updateData.revenue = updates.revenue;
    if (updates.status !== undefined) updateData.status = updates.status;

    const { data, error } = await supabase
      .from('mkt_affiliates')
      .update(updateData)
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .select()
      .single();

    if (error) {
      console.error('Error updating affiliate:', error);
      return { data: null, error: new Error(error.message) };
    }

    return {
      data: {
        id: String(data.id),
        name: data.name,
        type: data.type as "Affiliate" | "KOL" | "Influencer",
        email: data.email,
        platform: data.platform || undefined,
        commissionRate: Number(data.commission_rate) || 0,
        revenue: Number(data.revenue) || 0,
        status: data.status as "active" | "inactive" | "pending",
        joinDate: data.join_date 
          ? new Date(data.join_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      },
      error: null,
    };
  } catch (err) {
    console.error('Unexpected error updating affiliate:', err);
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

export async function deleteAffiliate(
  id: number,
  tenantId: number
): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from('mkt_affiliates')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .eq('tenant_id', tenantId);

    if (error) {
      console.error('Error deleting affiliate:', error);
      return { error: new Error(error.message) };
    }

    return { error: null };
  } catch (err) {
    console.error('Unexpected error deleting affiliate:', err);
    return { error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

// ============================================
// UTM LINKS
// ============================================

export async function getUTMLinks(
  tenantId: number
): Promise<{ data: UTMLink[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('mkt_utm_links')
      .select('*')
      .eq('tenant_id', tenantId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching UTM links:', error);
      return { data: null, error: new Error(error.message) };
    }

    if (!data) {
      return { data: [], error: null };
    }

    const utmLinks: UTMLink[] = data.map((row: any) => ({
      id: String(row.id),
      name: row.name,
      url: row.url,
      shortUrl: row.short_url,
      campaign: row.campaign,
      source: row.source,
      medium: row.medium,
      clicks: row.clicks || 0,
      conversions: row.conversions || 0,
      createdDate: row.created_date 
        ? new Date(row.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    }));

    return { data: utmLinks, error: null };
  } catch (err) {
    console.error('Unexpected error fetching UTM links:', err);
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

export async function createUTMLink(
  tenantId: number,
  utmLink: Omit<UTMLink, 'id' | 'createdDate'>
): Promise<{ data: UTMLink | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('mkt_utm_links')
      .insert({
        tenant_id: tenantId,
        name: utmLink.name,
        url: utmLink.url,
        short_url: utmLink.shortUrl,
        campaign: utmLink.campaign,
        source: utmLink.source,
        medium: utmLink.medium,
        clicks: utmLink.clicks || 0,
        conversions: utmLink.conversions || 0,
        created_date: new Date().toISOString().split('T')[0],
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating UTM link:', error);
      return { data: null, error: new Error(error.message) };
    }

    return {
      data: {
        id: String(data.id),
        name: data.name,
        url: data.url,
        shortUrl: data.short_url,
        campaign: data.campaign,
        source: data.source,
        medium: data.medium,
        clicks: data.clicks || 0,
        conversions: data.conversions || 0,
        createdDate: data.created_date 
          ? new Date(data.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      },
      error: null,
    };
  } catch (err) {
    console.error('Unexpected error creating UTM link:', err);
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

export async function updateUTMLink(
  id: number,
  updates: Partial<Omit<UTMLink, 'id' | 'createdDate'>>,
  tenantId: number
): Promise<{ data: UTMLink | null; error: Error | null }> {
  try {
    const updateData: any = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.url !== undefined) updateData.url = updates.url;
    if (updates.shortUrl !== undefined) updateData.short_url = updates.shortUrl;
    if (updates.campaign !== undefined) updateData.campaign = updates.campaign;
    if (updates.source !== undefined) updateData.source = updates.source;
    if (updates.medium !== undefined) updateData.medium = updates.medium;
    if (updates.clicks !== undefined) updateData.clicks = updates.clicks;
    if (updates.conversions !== undefined) updateData.conversions = updates.conversions;

    const { data, error } = await supabase
      .from('mkt_utm_links')
      .update(updateData)
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .select()
      .single();

    if (error) {
      console.error('Error updating UTM link:', error);
      return { data: null, error: new Error(error.message) };
    }

    return {
      data: {
        id: String(data.id),
        name: data.name,
        url: data.url,
        shortUrl: data.short_url,
        campaign: data.campaign,
        source: data.source,
        medium: data.medium,
        clicks: data.clicks || 0,
        conversions: data.conversions || 0,
        createdDate: data.created_date 
          ? new Date(data.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      },
      error: null,
    };
  } catch (err) {
    console.error('Unexpected error updating UTM link:', err);
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

export async function deleteUTMLink(
  id: number,
  tenantId: number
): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from('mkt_utm_links')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .eq('tenant_id', tenantId);

    if (error) {
      console.error('Error deleting UTM link:', error);
      return { error: new Error(error.message) };
    }

    return { error: null };
  } catch (err) {
    console.error('Unexpected error deleting UTM link:', err);
    return { error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

// ============================================
// REFERENCE DOCUMENTS
// ============================================

export async function getReferenceDocuments(
  tenantId: number
): Promise<{ data: ReferenceDoc[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('mkt_reference_documents')
      .select('*')
      .eq('tenant_id', tenantId)
      .is('deleted_at', null)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching reference documents:', error);
      return { data: null, error: new Error(error.message) };
    }

    if (!data) {
      return { data: [], error: null };
    }

    const docs: ReferenceDoc[] = data.map((row: any) => ({
      id: String(row.id),
      title: row.title,
      category: row.category,
      description: row.description || '',
      fileUrl: row.file_url || undefined,
      updatedDate: row.updated_at 
        ? new Date(row.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      size: row.size || undefined,
    }));

    return { data: docs, error: null };
  } catch (err) {
    console.error('Unexpected error fetching reference documents:', err);
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

export async function createReferenceDocument(
  tenantId: number,
  doc: Omit<ReferenceDoc, 'id' | 'updatedDate'>
): Promise<{ data: ReferenceDoc | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('mkt_reference_documents')
      .insert({
        tenant_id: tenantId,
        title: doc.title,
        category: doc.category,
        description: doc.description || null,
        file_url: doc.fileUrl || null,
        size: doc.size || null,
        updated_date: new Date().toISOString().split('T')[0],
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating reference document:', error);
      return { data: null, error: new Error(error.message) };
    }

    return {
      data: {
        id: String(data.id),
        title: data.title,
        category: data.category,
        description: data.description || '',
        fileUrl: data.file_url || undefined,
        updatedDate: data.updated_at 
          ? new Date(data.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        size: data.size || undefined,
      },
      error: null,
    };
  } catch (err) {
    console.error('Unexpected error creating reference document:', err);
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

export async function updateReferenceDocument(
  id: number,
  updates: Partial<Omit<ReferenceDoc, 'id' | 'updatedDate'>>,
  tenantId: number
): Promise<{ data: ReferenceDoc | null; error: Error | null }> {
  try {
    const updateData: any = {};
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.description !== undefined) updateData.description = updates.description || null;
    if (updates.fileUrl !== undefined) updateData.file_url = updates.fileUrl || null;
    if (updates.size !== undefined) updateData.size = updates.size || null;
    updateData.updated_date = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('mkt_reference_documents')
      .update(updateData)
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .select()
      .single();

    if (error) {
      console.error('Error updating reference document:', error);
      return { data: null, error: new Error(error.message) };
    }

    return {
      data: {
        id: String(data.id),
        title: data.title,
        category: data.category,
        description: data.description || '',
        fileUrl: data.file_url || undefined,
        updatedDate: data.updated_at 
          ? new Date(data.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        size: data.size || undefined,
      },
      error: null,
    };
  } catch (err) {
    console.error('Unexpected error updating reference document:', err);
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

export async function deleteReferenceDocument(
  id: number,
  tenantId: number
): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from('mkt_reference_documents')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .eq('tenant_id', tenantId);

    if (error) {
      console.error('Error deleting reference document:', error);
      return { error: new Error(error.message) };
    }

    return { error: null };
  } catch (err) {
    console.error('Unexpected error deleting reference document:', err);
    return { error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

// ============================================
// MARKETING CHANNELS
// ============================================

export async function getMarketingChannels(
  tenantId: number
): Promise<{ data: Channel[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('mkt_marketing_channels')
      .select('*')
      .eq('tenant_id', tenantId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching marketing channels:', error);
      return { data: null, error: new Error(error.message) };
    }

    if (!data) {
      return { data: [], error: null };
    }

    const channels: Channel[] = data.map((row: any) => ({
      id: String(row.id),
      name: row.name,
      type: row.type,
      platform: row.platform,
      reach: row.reach || 0,
      engagement: Number(row.engagement) || 0,
      status: row.status as "active" | "inactive",
      budget: row.budget ? Number(row.budget) : undefined,
    }));

    return { data: channels, error: null };
  } catch (err) {
    console.error('Unexpected error fetching marketing channels:', err);
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

export async function createMarketingChannel(
  tenantId: number,
  channel: Omit<Channel, 'id'>
): Promise<{ data: Channel | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('mkt_marketing_channels')
      .insert({
        tenant_id: tenantId,
        name: channel.name,
        type: channel.type,
        platform: channel.platform,
        reach: channel.reach || 0,
        engagement: channel.engagement || 0,
        status: channel.status,
        budget: channel.budget || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating marketing channel:', error);
      return { data: null, error: new Error(error.message) };
    }

    return {
      data: {
        id: String(data.id),
        name: data.name,
        type: data.type,
        platform: data.platform,
        reach: data.reach || 0,
        engagement: Number(data.engagement) || 0,
        status: data.status as "active" | "inactive",
        budget: data.budget ? Number(data.budget) : undefined,
      },
      error: null,
    };
  } catch (err) {
    console.error('Unexpected error creating marketing channel:', err);
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

export async function updateMarketingChannel(
  id: number,
  updates: Partial<Omit<Channel, 'id'>>,
  tenantId: number
): Promise<{ data: Channel | null; error: Error | null }> {
  try {
    const updateData: any = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.type !== undefined) updateData.type = updates.type;
    if (updates.platform !== undefined) updateData.platform = updates.platform;
    if (updates.reach !== undefined) updateData.reach = updates.reach;
    if (updates.engagement !== undefined) updateData.engagement = updates.engagement;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.budget !== undefined) updateData.budget = updates.budget || null;

    const { data, error } = await supabase
      .from('mkt_marketing_channels')
      .update(updateData)
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .select()
      .single();

    if (error) {
      console.error('Error updating marketing channel:', error);
      return { data: null, error: new Error(error.message) };
    }

    return {
      data: {
        id: String(data.id),
        name: data.name,
        type: data.type,
        platform: data.platform,
        reach: data.reach || 0,
        engagement: Number(data.engagement) || 0,
        status: data.status as "active" | "inactive",
        budget: data.budget ? Number(data.budget) : undefined,
      },
      error: null,
    };
  } catch (err) {
    console.error('Unexpected error updating marketing channel:', err);
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

export async function deleteMarketingChannel(
  id: number,
  tenantId: number
): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from('mkt_marketing_channels')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .eq('tenant_id', tenantId);

    if (error) {
      console.error('Error deleting marketing channel:', error);
      return { error: new Error(error.message) };
    }

    return { error: null };
  } catch (err) {
    console.error('Unexpected error deleting marketing channel:', err);
    return { error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

