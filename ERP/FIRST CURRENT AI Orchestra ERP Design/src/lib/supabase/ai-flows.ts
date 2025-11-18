import { supabase } from "./client";

export interface AIFlowRow {
  id: number;
  tenant_id: number;
  name: string;
  description: string | null;
  source: 'internal' | 'external' | 'n8n' | 'gpts' | 'zapier' | 'make';
  status: 'active' | 'paused' | 'draft';
  layer?: 1 | 2 | 3 | 4; // Layer classification: 1=Internal, 2=External Tools, 3=AI Orchestration, 4=External Systems
  metadata?: Record<string, any> | null; // Flexible JSONB for category, url, icon, businessPurpose, etc.
  external_system_id?: string | null; // Reference to external AI system (for layer 4 flows)
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
    };

    // Include layer (error handling for missing column is done after insert)
    insertData.layer = layer;

    // Only include metadata if it has content
    if (metadata) {
      insertData.metadata = metadata;
    }

    const { data, error } = await supabase
      .from('ai_flows')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      // If error is about missing column (like 'layer' or 'metadata'), try without it
      if (error.message?.includes('column')) {
        let retryData = { ...insertData };
        let retried = false;
        
        // Try removing layer if it exists
        if (retryData.layer !== undefined) {
          console.warn('Layer column may not exist, retrying without layer');
          delete retryData.layer;
          retried = true;
        }
        
        // Try removing metadata if it exists
        if (retryData.metadata !== undefined) {
          console.warn('Metadata column may not exist, retrying without metadata');
          delete retryData.metadata;
          retried = true;
        }
        
        if (retried) {
          const { data: retryDataResult, error: retryError } = await supabase
            .from('ai_flows')
            .insert(retryData)
            .select()
            .single();
          
          if (retryError) {
            console.error('Error creating AI flow request:', retryError);
            return { data: null, error: new Error(retryError.message) };
          }
          return { data: retryDataResult as AIFlowRow, error: null };
        }
      }
      
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

    // Filter by layer if provided (error handling for missing column is done after query execution)
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
      // If error is about missing column (like 'layer'), try without layer filter
      if (error.message?.includes('column') && options?.layer) {
        console.warn('Layer column may not exist, retrying without layer filter');
        let retryQuery = supabase
          .from('ai_flows')
          .select('*')
          .eq('tenant_id', tenantId)
          .is('deleted_at', null);
        
        if (options?.source) {
          retryQuery = retryQuery.eq('source', options.source);
        }
        if (options?.status) {
          retryQuery = retryQuery.eq('status', options.status);
        }
        
        const { data: retryData, error: retryError } = await retryQuery.order('created_at', { ascending: false });
        if (retryError) {
          console.error('Error fetching AI flows:', retryError);
          return { data: null, error: new Error(retryError.message) };
        }
        return { data: (retryData || []) as AIFlowRow[], error: null };
      }
      
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
    if (updates.source !== undefined) updateData.source = updates.source;
    
    // Only include layer if column exists (may not exist if migration hasn't run)
    if (updates.layer !== undefined) {
      updateData.layer = updates.layer;
    }

    const { data, error } = await supabase
      .from('ai_flows')
      .update(updateData)
      .eq('id', flowId)
      .eq('tenant_id', tenantId)
      .select()
      .single();

    if (error) {
      // If error is about missing column (like 'layer' or 'metadata'), try without it
      if (error.message?.includes('column')) {
        let retryData = { ...updateData };
        let retried = false;
        
        // Try removing layer if it exists
        if (retryData.layer !== undefined) {
          console.warn('Layer column may not exist, retrying without layer');
          delete retryData.layer;
          retried = true;
        }
        
        // Try removing metadata if it exists
        if (retryData.metadata !== undefined) {
          console.warn('Metadata column may not exist, retrying without metadata');
          delete retryData.metadata;
          retried = true;
        }
        
        if (retried) {
          const { data: retryDataResult, error: retryError } = await supabase
            .from('ai_flows')
            .update(retryData)
            .eq('id', flowId)
            .eq('tenant_id', tenantId)
            .select()
            .single();
          
          if (retryError) {
            console.error('Error updating AI flow:', retryError);
            return { data: null, error: new Error(retryError.message) };
          }
          return { data: retryDataResult as AIFlowRow, error: null };
        }
      }
      
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

