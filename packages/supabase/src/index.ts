import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL_KEY = 'VITE_SUPABASE_URL'
const SUPABASE_ANON_KEY = 'VITE_SUPABASE_ANON_KEY'

type EnvironmentValues = Record<string, string | undefined>
type ImportMetaWithEnv = ImportMeta & { readonly env?: EnvironmentValues }
type ProcessWithEnv = { readonly env?: EnvironmentValues }

function getProcessEnv(key: string): string | undefined {
  if (typeof process === 'undefined') return undefined
  return (process as ProcessWithEnv).env?.[key]
}

function getImportMetaEnv(key: string): string | undefined {
  return (import.meta as ImportMetaWithEnv).env?.[key]
}

function getEnvVal(key: string): string | undefined {
  const viteValue = getProcessEnv(key) ?? getImportMetaEnv(key)
  if (viteValue) return viteValue

  const reactAppKey = `REACT_APP_${key.replace('VITE_', '')}`
  return getProcessEnv(reactAppKey)
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