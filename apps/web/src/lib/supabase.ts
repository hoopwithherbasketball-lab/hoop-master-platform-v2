import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL as string
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_SUPABASE_ANON_KEY as string

export const supabase: SupabaseClient<any> = createClient(supabaseUrl, supabaseAnonKey)
