import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for authentication
export interface AuthUser {
  id: string
  email: string
  full_name?: string
  created_at: string
}

export interface AuthError {
  message: string
  status?: number
}
