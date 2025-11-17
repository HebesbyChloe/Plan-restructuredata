import { supabase } from "./client";

export interface AIFlowRow {
  id: number;
  tenant_id: number;
  name: string;
  description: string | null;
  source: 'internal' | 'n8n' | 'gpts' | 'zapier' | 'make';
  status: 'active' | 'paused' | 'draft';
  trigger_type: 'webhook' | 'event' | 'schedule' | 'manual';
  trigger_config: Record<string, any> | null;
  nodes: any[] | null;
  edges: any[] | null;
  runs_count: number;
  success_rate: number;
  last_run_at: Date | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface AIFlowRequest {
  name: string;
  description?: string;
  layer?: 1 | 2 | 3;
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
    // Map layer to trigger_type
    const triggerTypeMap: Record<number, 'webhook' | 'event' | 'schedule' | 'manual'> = {
      1: 'schedule', // Layer 1: Automated (scheduled)
      2: 'manual',   // Layer 2: On-Demand (manual trigger)
      3: 'manual',   // Layer 3: Interactive (manual trigger)
    };

    const triggerType = request.layer ? triggerTypeMap[request.layer] : 'manual';

    // Store business purpose in trigger_config as JSONB
    const triggerConfig = request.businessPurpose || request.category
      ? { 
          businessPurpose: request.businessPurpose || null, 
          category: request.category || null 
        }
      : null;

    const { data, error } = await supabase
      .from('ai_flows')
      .insert({
        tenant_id: tenantId,
        name: request.name,
        description: request.description || null,
        source: 'internal',
        status: 'draft', // New requests start as 'draft' (pending admin approval)
        trigger_type: triggerType,
        trigger_config: triggerConfig,
        nodes: [],
        edges: [],
        runs_count: 0,
        success_rate: 0,
        last_run_at: null,
      })
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
  tenantId: number
): Promise<{ data: AIFlowRow[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('ai_flows')
      .select('*')
      .eq('tenant_id', tenantId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

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

