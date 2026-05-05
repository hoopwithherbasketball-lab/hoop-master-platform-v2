import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL_KEY = 'VITE_SUPABASE_URL'
const SUPABASE_ANON_KEY = 'VITE_SUPABASE_ANON_KEY'

const supabaseUrl = (import.meta as any).env[SUPABASE_URL_KEY] as string | undefined
const supabaseAnonKey = (import.meta as any).env[SUPABASE_ANON_KEY] as string | undefined

if (!supabaseUrl || !supabaseAnonKey) {
  const missingKeys = [
    !supabaseUrl && SUPABASE_URL_KEY,
    !supabaseAnonKey && SUPABASE_ANON_KEY,
  ].filter(Boolean)

  throw new Error(
    `Missing Supabase config: ${missingKeys.join(', ')}. ` +
      `Add these values to your Vite environment (e.g. apps/web/.env).`
  )
}

export const supabase: SupabaseClient<any> = createClient(supabaseUrl, supabaseAnonKey)
