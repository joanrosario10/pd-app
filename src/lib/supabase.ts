import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() ?? ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? ''

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

export const isSupabaseConfigured = (): boolean => supabase !== null

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          phone: string | null
          full_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          phone?: string | null
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          email?: string | null
          phone?: string | null
          full_name?: string | null
          updated_at?: string
        }
      }
      medications: {
        Row: {
          id: string
          user_id: string
          name: string
          dosage: string
          frequency: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          dosage: string
          frequency?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          name?: string
          dosage?: string
          frequency?: string | null
          notes?: string | null
          updated_at?: string
        }
      }
      medication_logs: {
        Row: {
          id: string
          medication_id: string
          user_id: string
          taken_at: string
          date: string
          notes: string | null
        }
        Insert: {
          id?: string
          medication_id: string
          user_id: string
          taken_at?: string
          date: string
          notes?: string | null
        }
        Update: {
          taken_at?: string
          date?: string
          notes?: string | null
        }
      }
    }
  }
}
