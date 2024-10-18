export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          sector_count: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          crew_type?: string
          id?: number
          max_fdp: unknown
          period_finish_time: string
          period_start_time: string
          sector_count?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          crew_type?: string
          id?: number
          max_fdp?: unknown
          period_finish_time?: string
          period_start_time?: string
          sector_count?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      raw_duty: {
        Row: {
          created_at: string
          date: string
          debrief_time: string | null
          duty_code: string
          duty_description: string
          duty_id: number
          duty_type: Database["public"]["Enums"]["duty_type"]
          end_time: string
          is_all_day: boolean
          raw_duty_id: number
          raw_duty_period_id: number | null
          report_time: string | null
          roster_id: number
          start_time: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          debrief_time?: string | null
          duty_code: string
          duty_description: string
          duty_id: number
          duty_type: Database["public"]["Enums"]["duty_type"]
          end_time: string
          is_all_day: boolean
          raw_duty_id?: number
          raw_duty_period_id?: number | null
          report_time?: string | null
          roster_id: number
          start_time: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          debrief_time?: string | null
          duty_code?: string
          duty_description?: string
          duty_id?: number
          duty_type?: Database["public"]["Enums"]["duty_type"]
          end_time?: string
          is_all_day?: boolean
          raw_duty_id?: number
          raw_duty_period_id?: number | null
          report_time?: string | null
          roster_id?: number
          start_time?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "raw_duty_roster_id_fkey"
            columns: ["roster_id"]
            isOneToOne: false
            referencedRelation: "roster"
            referencedColumns: ["roster_id"]
          },
        ]
      }
      raw_flight: {
        Row: {
          aircraft: string | null
          created_at: string
          debrief_time: string | null
          delay_hhmm: string | null
          destination: string
          distance_nm: number | null
          end_time: string
          expected_pax: string | null
          flight_number: string
          gate: string | null
          is_positioning: boolean
          origin: string
          raw_duty_id: number
          raw_flight_id: number
          registration: string | null
          report_time: string | null
          stand: string | null
          start_time: string
        }
        Insert: {
          aircraft?: string | null
          created_at?: string
          debrief_time?: string | null
          delay_hhmm?: string | null
          destination: string
          distance_nm?: number | null
          end_time: string
          expected_pax?: string | null
          flight_number: string
          gate?: string | null
          is_positioning?: boolean
          origin: string
          raw_duty_id: number
          raw_flight_id?: number
          registration?: string | null
          report_time?: string | null
          stand?: string | null
          start_time: string
        }
        Update: {
          aircraft?: string | null
          created_at?: string
          debrief_time?: string | null
          delay_hhmm?: string | null
          destination?: string
          distance_nm?: number | null
          end_time?: string
          expected_pax?: string | null
          flight_number?: string
          gate?: string | null
          is_positioning?: boolean
          origin?: string
          raw_duty_id?: number
          raw_flight_id?: number
          registration?: string | null
          report_time?: string | null
          stand?: string | null
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "raw_flight_raw_duty_id_fkey"
            columns: ["raw_duty_id"]
            isOneToOne: false
            referencedRelation: "raw_duty"
            referencedColumns: ["raw_duty_id"]
          },
        ]
      }
      roster: {
        Row: {
          created_at: string
          duty_ids: number[]
          duty_period_ids: number[]
          end_date: string
          old_duty_ids: number[]
          old_duty_period_ids: number | null
          raw_duty_ids: number[]
          raw_duty_period_ids: number[]
          roster_id: number
          start_date: string
          user_id: string
        }
        Insert: {
          created_at?: string
          duty_ids: number[]
          duty_period_ids: number[]
          end_date: string
          old_duty_ids: number[]
          old_duty_period_ids?: number | null
          raw_duty_ids: number[]
          raw_duty_period_ids: number[]
          roster_id?: number
          start_date: string
          user_id: string
        }
        Update: {
          created_at?: string
          duty_ids?: number[]
          duty_period_ids?: number[]
          end_date?: string
          old_duty_ids?: number[]
          old_duty_period_ids?: number | null
          raw_duty_ids?: number[]
          raw_duty_period_ids?: number[]
          roster_id?: number
          start_date?: string
          user_id?: string
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
      duty_type: "Flight" | "Hotel" | "Default" | "Standby" | "Off"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
