import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL_KEY = 'VITE_SUPABASE_URL'
const SUPABASE_ANON_KEY = 'VITE_SUPABASE_ANON_KEY'

function getEnvVal(key: string): string | undefined {
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key]
    }
  } catch (e) {}
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env[key]) {
      return (import.meta as any).env[key]
    }
  } catch (e) {}
  try {
    const raKey = `REACT_APP_${key.replace('VITE_', '')}`
    if (typeof process !== 'undefined' && process.env && process.env[raKey]) {
      return process.env[raKey]
    }
  } catch (e) {}
  return undefined
}

const supabaseUrl = getEnvVal(SUPABASE_URL_KEY)
const supabaseAnonKey = getEnvVal(SUPABASE_ANON_KEY)

if (!supabaseUrl || !supabaseAnonKey) {
  const missingKeys = [
    !supabaseUrl && SUPABASE_URL_KEY,
    !supabaseAnonKey && SUPABASE_ANON_KEY,
  ].filter(Boolean)

  throw new Error(
    `Missing Supabase config: ${missingKeys.join(', ')}. ` +
      `Add these values to your environment variables.`
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase: SupabaseClient<any> = createClient(supabaseUrl, supabaseAnonKey)

export type { SupabaseClient }