import { supabase } from "./client";

export interface AIFlowRow {
  id: number;
  tenant_id: number;
  name: string;
  description: string | null;
  source: 'internal' | 'external' | 'n8n' | 'gpts' | 'zapier' | 'make';
  status: 'active' | 'paused' | 'draft';
  layer: 1 | 2 | 3 | 4; // 🆕 NEW: Separate column for easy filtering
  trigger_type: 'webhook' | 'event' | 'schedule' | 'manual' | null; // Optional, stored in external system
  trigger_config: Record<string, any> | null; // Kept for backward compatibility
  metadata: Record<string, any> | null; // 🆕 NEW: Flexible JSONB for category, url, icon, etc.
  nodes: any[] | null; // Optional, stored in external system
  edges: any[] | null; // Optional, stored in external system
  runs_count: number; // Optional, can come from external system
  success_rate: number; // Optional, can come from external system
  last_run_at: Date | null; // Optional, can come from external system
  external_system_id: string | null; // 🆕 NEW: Reference to external AI system
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface AIFlowRequest {
  name: string;
  description?: string;
  layer?: 1 | 2 | 3 | 4; // Updated to include layer 4
  category?: string;
  businessPurpose?: string;
}

/**
 * Create a new AI flow request
 */
export async function createAIFlowRequest(
  request: AIFlowRequest,
  tenantId: number
): Promise<{ data: AIFlowRow | null; error: Error | null }> {
  try {
    // Use layer directly from request (default to 1 if not provided)
    const layer = request.layer || 1;

    // Store business purpose and category in metadata JSONB
    const metadata = request.businessPurpose || request.category
      ? { 
          businessPurpose: request.businessPurpose || null, 
          category: request.category || null
        }
      : null;

    const insertData: any = {
      tenant_id: tenantId,
      name: request.name,
      description: request.description || null,
      source: 'internal',
      status: 'draft', // New requests start as 'draft' (pending admin approval)
      layer: layer, // 🆕 NEW: Use layer column directly
      runs_count: 0,
      success_rate: 0,
      last_run_at: null,
    };

    // Only include metadata if it has content
    if (metadata) {
      insertData.metadata = metadata;
    }

    // Only include trigger_config, nodes, edges if they exist (for backward compatibility)
    // These are optional and stored in external system
    insertData.trigger_type = null;
    insertData.trigger_config = null;
    insertData.nodes = null;
    insertData.edges = null;

    const { data, error } = await supabase
      .from('ai_flows')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Error creating AI flow request:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as AIFlowRow, error: null };
  } catch (err) {
    console.error('Unexpected error creating AI flow request:', err);
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error'),
    };
  }
}

/**
 * Get all AI flows for a tenant
 */
export async function getAIFlows(
  tenantId: number,
  options?: {
    layer?: 1 | 2 | 3 | 4;
    source?: 'internal' | 'external' | 'n8n' | 'gpts' | 'zapier' | 'make';
    status?: 'active' | 'paused' | 'draft';
  }
): Promise<{ data: AIFlowRow[] | null; error: Error | null }> {
  try {
    let query = supabase
      .from('ai_flows')
      .select('*')
      .eq('tenant_id', tenantId)
      .is('deleted_at', null);

    // Filter by layer if provided
    if (options?.layer) {
      query = query.eq('layer', options.layer);
    }

    // Filter by source if provided
    if (options?.source) {
      query = query.eq('source', options.source);
    }

    // Filter by status if provided
    if (options?.status) {
      query = query.eq('status', options.status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching AI flows:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as AIFlowRow[], error: null };
  } catch (err) {
    console.error('Unexpected error fetching AI flows:', err);
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error'),
    };
  }
}

/**
 * Get AI flows by layer
 */
export async function getAIFlowsByLayer(
  tenantId: number,
  layer: 1 | 2 | 3 | 4
): Promise<{ data: AIFlowRow[] | null; error: Error | null }> {
  return getAIFlows(tenantId, { layer });
}

/**
 * Get external tools (source = 'external')
 */
export async function getExternalTools(
  tenantId: number
): Promise<{ data: AIFlowRow[] | null; error: Error | null }> {
  return getAIFlows(tenantId, { source: 'external' });
}

/**
 * Update AI flow status
 */
export async function updateAIFlowStatus(
  flowId: number,
  status: 'active' | 'paused' | 'draft',
  tenantId: number
): Promise<{ data: AIFlowRow | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('ai_flows')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', flowId)
      .eq('tenant_id', tenantId)
      .select()
      .single();

    if (error) {
      console.error('Error updating AI flow status:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as AIFlowRow, error: null };
  } catch (err) {
    console.error('Unexpected error updating AI flow status:', err);
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error'),
    };
  }
}

/**
 * Update AI flow (general update for name, description, metadata, etc.)
 */
export async function updateAIFlow(
  flowId: number,
  updates: {
    name?: string;
    description?: string;
    metadata?: Record<string, any>;
    status?: 'active' | 'paused' | 'draft';
    layer?: 1 | 2 | 3 | 4;
    source?: 'internal' | 'external' | 'n8n' | 'gpts' | 'zapier' | 'make';
  },
  tenantId: number
): Promise<{ data: AIFlowRow | null; error: Error | null }> {
  try {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.metadata !== undefined) updateData.metadata = updates.metadata;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.layer !== undefined) updateData.layer = updates.layer;
    if (updates.source !== undefined) updateData.source = updates.source;

    const { data, error } = await supabase
      .from('ai_flows')
      .update(updateData)
      .eq('id', flowId)
      .eq('tenant_id', tenantId)
      .select()
      .single();

    if (error) {
      console.error('Error updating AI flow:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as AIFlowRow, error: null };
  } catch (err) {
    console.error('Unexpected error updating AI flow:', err);
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error'),
    };
  }
}

/**
 * Delete AI flow (soft delete)
 */
export async function deleteAIFlow(
  flowId: number,
  tenantId: number
): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from('ai_flows')
      .update({
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', flowId)
      .eq('tenant_id', tenantId);

    if (error) {
      console.error('Error deleting AI flow:', error);
      return { error: new Error(error.message) };
    }

    return { error: null };
  } catch (err) {
    console.error('Unexpected error deleting AI flow:', err);
    return {
      error: err instanceof Error ? err : new Error('Unknown error'),
    };
  }
}

