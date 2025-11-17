/**
 * AI Agents Module - Database Type Definitions
 */

// ============================================
// AI_AGENTS
// ============================================

export interface AiAgent {
  id: string
  name: string
  description: string | null
  quote: string | null
  department: string[] // JSONB array - empty array [] means global agent
  api_endpoint: string | null
  api_key: string | null
  icon_name: string | null
  color: string
  gradient: string
  is_active: boolean
  metadata: Record<string, any>
  tenant_id: number | null
  created_at: string
  updated_at: string
}

export interface AiAgentInsert {
  id: string
  name: string
  description?: string | null
  quote?: string | null
  department: string[] // JSONB array - empty array [] means global agent
  api_endpoint?: string | null
  api_key?: string | null
  icon_name?: string | null
  color?: string
  gradient?: string
  is_active?: boolean
  metadata?: Record<string, any>
  tenant_id?: number | null
}

export interface AiAgentUpdate {
  name?: string
  description?: string | null
  quote?: string | null
  department?: string[] // JSONB array - empty array [] means global agent
  api_endpoint?: string | null
  api_key?: string | null
  icon_name?: string | null
  color?: string
  gradient?: string
  is_active?: boolean
  metadata?: Record<string, any>
}

// ============================================
// AI_SEED_DATA (formerly ai_agent_prompts)
// ============================================

export interface AiSeedData {
  id: number
  agent_id: string
  text: string
  icon_name: string | null
  color: string
  display_order: number
  is_active: boolean
  created_at: string
}

export interface AiSeedDataInsert {
  agent_id: string
  text: string
  icon_name?: string | null
  color?: string
  display_order?: number
  is_active?: boolean
}

