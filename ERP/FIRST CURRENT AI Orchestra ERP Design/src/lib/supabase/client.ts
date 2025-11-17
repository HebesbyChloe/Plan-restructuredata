import { createClient } from '@supabase/supabase-js'
import { projectId, publicAnonKey } from '../../utils/supabase/info'

// Use environment variables if available, otherwise fallback to info file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || `https://${projectId}.supabase.co`
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || publicAnonKey

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.')
}

// Log Supabase configuration (without exposing the key)
if (typeof window !== 'undefined') {
  console.log('Supabase URL:', supabaseUrl)
  console.log('Supabase configured:', !!supabaseUrl && !!supabaseAnonKey)
  console.log('Using env var:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  // Log first/last few chars of key for debugging (without exposing full key)
  if (supabaseAnonKey && supabaseAnonKey !== 'your_anon_key_here' && supabaseAnonKey !== 'YOUR_ANON_KEY_HERE') {
    const keyPreview = supabaseAnonKey.length > 10 
      ? `${supabaseAnonKey.substring(0, 10)}...${supabaseAnonKey.substring(supabaseAnonKey.length - 10)}`
      : '***'
    console.log('Key preview:', keyPreview, '(length:', supabaseAnonKey.length, ')')
  } else {
    console.warn('⚠️ Supabase anon key appears to be a placeholder! Please update .env.local or info.tsx')
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-client-info': 'first-current-ai-orchestra-erp',
    },
  },
})

