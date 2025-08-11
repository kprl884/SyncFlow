import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      workspaces: {
        Row: {
          id: string
          name: string
          description: string | null
          owner_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          owner_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          owner_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      workspace_members: {
        Row: {
          id: string
          workspace_id: string
          user_id: string
          role: 'admin' | 'member' | 'viewer'
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          user_id: string
          role?: 'admin' | 'member' | 'viewer'
          created_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          user_id?: string
          role?: 'admin' | 'member' | 'viewer'
          created_at?: string
        }
      }
      invitations: {
        Row: {
          id: string
          workspace_id: string
          invited_by_id: string
          invitee_email: string
          role: 'admin' | 'member' | 'viewer'
          token: string
          status: 'pending' | 'accepted' | 'expired'
          created_at: string
          expires_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          invited_by_id: string
          invitee_email: string
          role?: 'admin' | 'member' | 'viewer'
          token: string
          status?: 'pending' | 'accepted' | 'expired'
          created_at?: string
          expires_at: string
        }
        Update: {
          id?: string
          workspace_id?: string
          invited_by_id?: string
          invitee_email?: string
          role?: 'admin' | 'member' | 'viewer'
          token?: string
          status?: 'pending' | 'accepted' | 'expired'
          created_at?: string
          expires_at?: string
        }
      }
    }
  }
}
