/**
 * AI Agents Module - Data Access Hook
 * Always fetches from database (no hardcoded fallback)
 */

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase/client'
import type { AiAgent, AiSeedData, AiAgentInsert, AiAgentUpdate, AiSeedDataInsert } from '../types/database/ai'
import type { Agent, PromptItem } from '../components/AI/AIchatboxdepartmentmain'
import {
  ShoppingCart,
  Truck,
  Users,
  Package,
  BarChart3,
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle,
  Sparkles,
  Bot,
  Settings,
  PenTool,
  Database,
  Palette,
  Target,
  Zap,
  Briefcase,
} from 'lucide-react'

// Icon name to component mapping
const ICON_MAP: Record<string, any> = {
  ShoppingCart,
  Truck,
  Users,
  Package,
  BarChart3,
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle,
  Sparkles,
  Bot,
  Settings,
  PenTool,
  Database,
  Palette,
  Target,
  Zap,
  Briefcase,
}

// Transform database agent to UI Agent format
function transformAgent(agent: AiAgent): Agent {
  return {
    id: agent.id,
    name: agent.name,
    icon: agent.icon_name ? ICON_MAP[agent.icon_name] || ShoppingCart : ShoppingCart,
    color: agent.color,
    gradient: agent.gradient,
    description: agent.description || '',
    quote: agent.quote || '',
  }
}

// Transform database seed data to UI PromptItem format
function transformSeedData(seedData: AiSeedData): PromptItem {
  return {
    icon: seedData.icon_name ? ICON_MAP[seedData.icon_name] || Sparkles : Sparkles,
    text: seedData.text,
    color: seedData.color,
  }
}

// ============================================
// AGENTS HOOK
// ============================================

export function useAgents(department?: string, tenantId?: number | null) {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const loadAgents = async () => {
    try {
      setLoading(true)
      setError(null)

      // Build query step by step
      let query = supabase
        .from('ai_agents')
        .select('*')
        .eq('is_active', true)

      // Filter by tenant: show tenant-specific OR global agents
      // Note: Supabase PostgREST doesn't support .or() with multiple conditions easily
      // So we'll fetch all active agents and filter in JavaScript
      // This is simpler and more reliable
      
      const { data, error: err } = await query.order('name', { ascending: true })

      if (err) {
        console.error('Database error:', err)
        throw err
      }
      
      // Filter by tenant in JavaScript after fetching
      let tenantFilteredData = data || []
      if (tenantId !== undefined && tenantId !== null) {
        // Show agents for this tenant OR global agents (null tenant_id)
        tenantFilteredData = tenantFilteredData.filter((agent: any) => 
          agent.tenant_id === tenantId || agent.tenant_id === null
        )
      } else {
        // Show only global agents when no tenant is selected
        tenantFilteredData = tenantFilteredData.filter((agent: any) => 
          agent.tenant_id === null
        )
      }

      // Transform department from JSONB to string array
      let transformedData = tenantFilteredData.map((agent: any) => ({
        ...agent,
        department: Array.isArray(agent.department) 
          ? agent.department 
          : (typeof agent.department === 'string' 
              ? JSON.parse(agent.department || '[]') 
              : [])
      }))

      // Filter by department in JavaScript (after fetching)
      // This is more reliable than complex PostgREST queries
      if (department) {
        transformedData = transformedData.filter((agent: any) => {
          const deptArray = agent.department || []
          // Include if department array contains the department OR is empty (global agent)
          return deptArray.length === 0 || deptArray.includes(department)
        })
      }

      setAgents(transformedData.map(transformAgent))
    } catch (err) {
      console.error('Error loading agents:', err)
      setError(err instanceof Error ? err : new Error('Failed to load agents'))
      setAgents([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAgents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [department, tenantId])

  const createAgent = async (agent: AiAgentInsert) => {
    // Ensure department is JSONB array
    const agentData = {
      ...agent,
      department: Array.isArray(agent.department) ? agent.department : []
    }
    
    const { data, error: err } = await supabase
      .from('ai_agents')
      .insert(agentData)
      .select()
      .single()

    if (err) throw err
    await loadAgents()
    return data
  }

  const updateAgent = async (id: string, updates: AiAgentUpdate) => {
    // Ensure department is JSONB array if provided
    const updateData: any = { ...updates, updated_at: new Date().toISOString() }
    if (updates.department !== undefined) {
      updateData.department = Array.isArray(updates.department) ? updates.department : []
    }
    
    const { data, error: err } = await supabase
      .from('ai_agents')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (err) throw err
    await loadAgents()
    return data
  }

  const deleteAgent = async (id: string) => {
    const { error: err } = await supabase
      .from('ai_agents')
      .delete()
      .eq('id', id)

    if (err) throw err
    await loadAgents()
  }

  return {
    agents,
    loading,
    error,
    refresh: loadAgents,
    createAgent,
    updateAgent,
    deleteAgent,
  }
}

// ============================================
// SEED DATA HOOK (for prompts/suggestions)
// ============================================

export function useAgentSeedData(agentId: string) {
  const [seedData, setSeedData] = useState<PromptItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Don't load if agentId is empty or dummy
    if (!agentId || agentId === "dummy-id-to-prevent-empty-string") {
      setSeedData([])
      setLoading(false)
      return
    }
    loadSeedData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentId])

  const loadSeedData = async () => {
    try {
      setLoading(true)

      const { data, error } = await supabase
        .from('ai_seed_data')
        .select('*')
        .eq('agent_id', agentId)
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      if (error) throw error

      setSeedData((data || []).map(transformSeedData))
    } catch (err) {
      console.error('Error loading seed data:', err)
      setSeedData([])
    } finally {
      setLoading(false)
    }
  }

  const createSeedData = async (seedDataItem: AiSeedDataInsert) => {
    const { data, error: err } = await supabase
      .from('ai_seed_data')
      .insert(seedDataItem)
      .select()
      .single()

    if (err) throw err
    await loadSeedData()
    return data
  }

  const updateSeedData = async (id: number, updates: Partial<AiSeedDataInsert>) => {
    const { data, error: err } = await supabase
      .from('ai_seed_data')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (err) throw err
    await loadSeedData()
    return data
  }

  const deleteSeedData = async (id: number) => {
    const { error: err } = await supabase
      .from('ai_seed_data')
      .delete()
      .eq('id', id)

    if (err) throw err
    await loadSeedData()
  }

  return {
    seedData,
    loading,
    refresh: loadSeedData,
    createSeedData,
    updateSeedData,
    deleteSeedData,
  }
}

// Get seed data for multiple agents
export function useAgentSeedDataMap(agentIds: string[]) {
  const [seedDataMap, setSeedDataMap] = useState<Record<string, PromptItem[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAllSeedData()
  }, [agentIds.join(',')])

  const loadAllSeedData = async () => {
    try {
      setLoading(true)
      const map: Record<string, PromptItem[]> = {}

      for (const agentId of agentIds) {
        const { data, error } = await supabase
          .from('ai_seed_data')
          .select('*')
          .eq('agent_id', agentId)
          .eq('is_active', true)
          .order('display_order', { ascending: true })

        if (!error && data) {
          map[agentId] = data.map(transformSeedData)
        } else {
          map[agentId] = []
        }
      }

      setSeedDataMap(map)
    } catch (err) {
      console.error('Error loading seed data map:', err)
      setSeedDataMap({})
    } finally {
      setLoading(false)
    }
  }

  return { seedDataMap, loading }
}

// Message sending function
export async function sendAgentMessage(
  message: string,
  agentId: string
): Promise<string> {
  try {
    // Fetch agent to get API endpoint
    const { data: agent, error } = await supabase
      .from('ai_agents')
      .select('api_endpoint, api_key')
      .eq('id', agentId)
      .single()

    if (error) throw error

    // If agent has custom API endpoint, use it
    if (agent?.api_endpoint) {
      const response = await fetch(agent.api_endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(agent.api_key && { 'Authorization': `Bearer ${agent.api_key}` }),
        },
        body: JSON.stringify({ message, agent_id: agentId }),
      })

      if (!response.ok) throw new Error(`API error: ${response.statusText}`)

      const data = await response.json()
      return data.response || data.message || 'Response received'
    }

    // Otherwise, use default AI service
    // TODO: Replace with actual AI API call (OpenAI, Anthropic, etc.)
    await new Promise(resolve => setTimeout(resolve, 1000))
    return `[Agent: ${agentId}] Processing: "${message}"\n\nThis is a demo response. Configure an API endpoint in the agent settings to use a real AI service.`
  } catch (error) {
    console.error('Error sending message to agent:', error)
    throw error
  }
}

