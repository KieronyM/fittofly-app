export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      ezy_max_fdp: {
        Row: {
          created_at: string
          crew_type: string
          id: number
          max_fdp: unknown
          period_finish_time: string
          period_start_time: string
          sector_count: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          crew_type?: string
          id?: number
          max_fdp: unknown
          period_finish_time: string
          period_start_time: string
          sector_count: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          crew_type?: string
          id?: number
          max_fdp?: unknown
          period_finish_time?: string
          period_start_time?: string
          sector_count?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
