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
      change_log: {
        Row: {
          change_code: Database["public"]["Enums"]["change_codes"]
          change_id: number
          created_at: string
          data_item: string | null
          duty_date: string
          duty_match_id: number | null
          effective_change_date: string
          from_duty_id: number | null
          from_duty_period_id: number | null
          from_value: string | null
          raw_duty_id: number | null
          raw_duty_period_id: number | null
          roster_id: number
          to_duty_id: number | null
          to_duty_period_id: number | null
          to_value: string | null
          user_id: string
        }
        Insert: {
          change_code: Database["public"]["Enums"]["change_codes"]
          change_id?: number
          created_at?: string
          data_item?: string | null
          duty_date: string
          duty_match_id?: number | null
          effective_change_date?: string
          from_duty_id?: number | null
          from_duty_period_id?: number | null
          from_value?: string | null
          raw_duty_id?: number | null
          raw_duty_period_id?: number | null
          roster_id: number
          to_duty_id?: number | null
          to_duty_period_id?: number | null
          to_value?: string | null
          user_id: string
        }
        Update: {
          change_code?: Database["public"]["Enums"]["change_codes"]
          change_id?: number
          created_at?: string
          data_item?: string | null
          duty_date?: string
          duty_match_id?: number | null
          effective_change_date?: string
          from_duty_id?: number | null
          from_duty_period_id?: number | null
          from_value?: string | null
          raw_duty_id?: number | null
          raw_duty_period_id?: number | null
          roster_id?: number
          to_duty_id?: number | null
          to_duty_period_id?: number | null
          to_value?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "change_log_roster_id_fkey"
            columns: ["roster_id"]
            isOneToOne: false
            referencedRelation: "roster"
            referencedColumns: ["roster_id"]
          },
        ]
      }
      duty: {
        Row: {
          aircraft: string | null
          created_at: string
          current_from: string
          current_to: string | null
          date: string
          debrief_time: string | null
          delay_hhmm: string | null
          destination: string | null
          distance_nm: number | null
          duty_code: string
          duty_description: string
          duty_id: number
          duty_period_id: number | null
          duty_type: Database["public"]["Enums"]["duty_type"]
          end_time: string | null
          expected_pax: string | null
          flight_number: string | null
          gate: string | null
          indicators: string | null
          is_all_day: boolean | null
          is_current: boolean
          is_positioning: boolean | null
          origin: string | null
          raw_duty_ids: number[] | null
          registration: string | null
          report_time: string | null
          roster_ids: number[]
          stand: string | null
          start_time: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          aircraft?: string | null
          created_at?: string
          current_from?: string
          current_to?: string | null
          date: string
          debrief_time?: string | null
          delay_hhmm?: string | null
          destination?: string | null
          distance_nm?: number | null
          duty_code: string
          duty_description: string
          duty_id?: number
          duty_period_id?: number | null
          duty_type: Database["public"]["Enums"]["duty_type"]
          end_time?: string | null
          expected_pax?: string | null
          flight_number?: string | null
          gate?: string | null
          indicators?: string | null
          is_all_day?: boolean | null
          is_current: boolean
          is_positioning?: boolean | null
          origin?: string | null
          raw_duty_ids?: number[] | null
          registration?: string | null
          report_time?: string | null
          roster_ids: number[]
          stand?: string | null
          start_time?: string | null
          updated_at?: string
          user_id?: string
        }
        Update: {
          aircraft?: string | null
          created_at?: string
          current_from?: string
          current_to?: string | null
          date?: string
          debrief_time?: string | null
          delay_hhmm?: string | null
          destination?: string | null
          distance_nm?: number | null
          duty_code?: string
          duty_description?: string
          duty_id?: number
          duty_period_id?: number | null
          duty_type?: Database["public"]["Enums"]["duty_type"]
          end_time?: string | null
          expected_pax?: string | null
          flight_number?: string | null
          gate?: string | null
          indicators?: string | null
          is_all_day?: boolean | null
          is_current?: boolean
          is_positioning?: boolean | null
          origin?: string | null
          raw_duty_ids?: number[] | null
          registration?: string | null
          report_time?: string | null
          roster_ids?: number[]
          stand?: string | null
          start_time?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      duty_match: {
        Row: {
          created_at: string
          date: string
          duty_id: number | null
          duty_period_id: number | null
          id: number
          is_duty_period: boolean
          is_found: boolean
          match_type: Database["public"]["Enums"]["match_types"]
          no_of_changes: number | null
          old_duty_id: number | null
          old_duty_period_id: number | null
          raw_duty_id: number | null
          raw_duty_period_id: number | null
          roster_id: number
        }
        Insert: {
          created_at?: string
          date: string
          duty_id?: number | null
          duty_period_id?: number | null
          id?: number
          is_duty_period?: boolean
          is_found: boolean
          match_type: Database["public"]["Enums"]["match_types"]
          no_of_changes?: number | null
          old_duty_id?: number | null
          old_duty_period_id?: number | null
          raw_duty_id?: number | null
          raw_duty_period_id?: number | null
          roster_id: number
        }
        Update: {
          created_at?: string
          date?: string
          duty_id?: number | null
          duty_period_id?: number | null
          id?: number
          is_duty_period?: boolean
          is_found?: boolean
          match_type?: Database["public"]["Enums"]["match_types"]
          no_of_changes?: number | null
          old_duty_id?: number | null
          old_duty_period_id?: number | null
          raw_duty_id?: number | null
          raw_duty_period_id?: number | null
          roster_id?: number
        }
        Relationships: []
      }
      duty_period: {
        Row: {
          created_at: string
          current_from: string
          current_to: string | null
          date: string
          debrief_time: string | null
          delay_hhmm: string | null
          duty_ids: number[] | null
          duty_period_hhmm: string | null
          duty_period_id: number
          earliest_dp_start_time: string | null
          earliest_nxt_dp_start_time: string | null
          end_time: string
          flight_duty_period_hhmm: string | null
          includes_flights: boolean
          includes_hotel: boolean
          includes_standby: boolean
          is_current: boolean
          max_fdp: string | null
          max_fdp_tolerance_hhmm: string | null
          raw_duty_period_ids: number[]
          report_time: string | null
          roster_ids: number[]
          sectors: number | null
          start_time: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          current_from?: string
          current_to?: string | null
          date: string
          debrief_time?: string | null
          delay_hhmm?: string | null
          duty_ids?: number[] | null
          duty_period_hhmm?: string | null
          duty_period_id?: number
          earliest_dp_start_time?: string | null
          earliest_nxt_dp_start_time?: string | null
          end_time: string
          flight_duty_period_hhmm?: string | null
          includes_flights: boolean
          includes_hotel?: boolean
          includes_standby: boolean
          is_current: boolean
          max_fdp?: string | null
          max_fdp_tolerance_hhmm?: string | null
          raw_duty_period_ids: number[]
          report_time?: string | null
          roster_ids: number[]
          sectors?: number | null
          start_time: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          current_from?: string
          current_to?: string | null
          date?: string
          debrief_time?: string | null
          delay_hhmm?: string | null
          duty_ids?: number[] | null
          duty_period_hhmm?: string | null
          duty_period_id?: number
          earliest_dp_start_time?: string | null
          earliest_nxt_dp_start_time?: string | null
          end_time?: string
          flight_duty_period_hhmm?: string | null
          includes_flights?: boolean
          includes_hotel?: boolean
          includes_standby?: boolean
          is_current?: boolean
          max_fdp?: string | null
          max_fdp_tolerance_hhmm?: string | null
          raw_duty_period_ids?: number[]
          report_time?: string | null
          roster_ids?: number[]
          sectors?: number | null
          start_time?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
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
      hotel_duty: {
        Row: {
          created_at: string
          date: string
          duty_code: string
          duty_description: string
          duty_type: Database["public"]["Enums"]["duty_type"]
          ecrew_duty_id: string
          end_time: string
          hotel_id: number
          roster_id: number
          start_time: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          duty_code: string
          duty_description: string
          duty_type: Database["public"]["Enums"]["duty_type"]
          ecrew_duty_id: string
          end_time: string
          hotel_id?: number
          roster_id: number
          start_time: string
          user_id?: string
        }
        Update: {
          created_at?: string
          date?: string
          duty_code?: string
          duty_description?: string
          duty_type?: Database["public"]["Enums"]["duty_type"]
          ecrew_duty_id?: string
          end_time?: string
          hotel_id?: number
          roster_id?: number
          start_time?: string
          user_id?: string
        }
        Relationships: []
      }
      raw_duty: {
        Row: {
          aircraft: string | null
          created_at: string
          date: string
          debrief_time: string | null
          delay_hhmm: string | null
          destination: string | null
          distance_nm: number | null
          duty_code: string
          duty_description: string
          duty_id: number | null
          duty_type: Database["public"]["Enums"]["duty_type"]
          ecrew_duty_id: string
          end_time: string
          expected_pax: string | null
          flight_number: string | null
          gate: string | null
          indicators: string | null
          is_all_day: boolean
          is_positioning: boolean
          origin: string | null
          raw_duty_id: number
          raw_duty_period_id: number | null
          registration: string | null
          report_time: string | null
          roster_id: number
          stand: string | null
          start_time: string
          updated_at: string
          user_id: string
        }
        Insert: {
          aircraft?: string | null
          created_at?: string
          date: string
          debrief_time?: string | null
          delay_hhmm?: string | null
          destination?: string | null
          distance_nm?: number | null
          duty_code: string
          duty_description: string
          duty_id?: number | null
          duty_type: Database["public"]["Enums"]["duty_type"]
          ecrew_duty_id: string
          end_time: string
          expected_pax?: string | null
          flight_number?: string | null
          gate?: string | null
          indicators?: string | null
          is_all_day: boolean
          is_positioning?: boolean
          origin?: string | null
          raw_duty_id?: number
          raw_duty_period_id?: number | null
          registration?: string | null
          report_time?: string | null
          roster_id: number
          stand?: string | null
          start_time: string
          updated_at?: string
          user_id: string
        }
        Update: {
          aircraft?: string | null
          created_at?: string
          date?: string
          debrief_time?: string | null
          delay_hhmm?: string | null
          destination?: string | null
          distance_nm?: number | null
          duty_code?: string
          duty_description?: string
          duty_id?: number | null
          duty_type?: Database["public"]["Enums"]["duty_type"]
          ecrew_duty_id?: string
          end_time?: string
          expected_pax?: string | null
          flight_number?: string | null
          gate?: string | null
          indicators?: string | null
          is_all_day?: boolean
          is_positioning?: boolean
          origin?: string | null
          raw_duty_id?: number
          raw_duty_period_id?: number | null
          registration?: string | null
          report_time?: string | null
          roster_id?: number
          stand?: string | null
          start_time?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "raw_duty_raw_duty_period_id_fkey"
            columns: ["raw_duty_period_id"]
            isOneToOne: false
            referencedRelation: "raw_duty_period"
            referencedColumns: ["raw_duty_period_id"]
          },
          {
            foreignKeyName: "raw_duty_roster_id_fkey"
            columns: ["roster_id"]
            isOneToOne: false
            referencedRelation: "roster"
            referencedColumns: ["roster_id"]
          },
        ]
      }
      raw_duty_period: {
        Row: {
          created_at: string
          date: string
          debrief_time: string | null
          duty_ids: number[] | null
          duty_period_id: number | null
          ecrew_duty_id: string
          end_time: string
          includes_flights: boolean
          includes_hotel: boolean
          includes_standby: boolean
          raw_duty_ids: number[]
          raw_duty_period_id: number
          report_time: string | null
          roster_id: number
          sectors: number | null
          start_time: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          date: string
          debrief_time?: string | null
          duty_ids?: number[] | null
          duty_period_id?: number | null
          ecrew_duty_id: string
          end_time: string
          includes_flights: boolean
          includes_hotel?: boolean
          includes_standby: boolean
          raw_duty_ids: number[]
          raw_duty_period_id?: number
          report_time?: string | null
          roster_id: number
          sectors?: number | null
          start_time: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          debrief_time?: string | null
          duty_ids?: number[] | null
          duty_period_id?: number | null
          ecrew_duty_id?: string
          end_time?: string
          includes_flights?: boolean
          includes_hotel?: boolean
          includes_standby?: boolean
          raw_duty_ids?: number[]
          raw_duty_period_id?: number
          report_time?: string | null
          roster_id?: number
          sectors?: number | null
          start_time?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      roster: {
        Row: {
          created_at: string
          duty_ids: number[]
          duty_period_ids: number[]
          end_date: string
          old_duty_ids: number[]
          old_duty_period_ids: number[]
          raw_duty_ids: number[]
          raw_duty_period_ids: number[]
          roster_id: number
          start_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          duty_ids: number[]
          duty_period_ids: number[]
          end_date: string
          old_duty_ids: number[]
          old_duty_period_ids: number[]
          raw_duty_ids: number[]
          raw_duty_period_ids: number[]
          roster_id?: number
          start_date: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          duty_ids?: number[]
          duty_period_ids?: number[]
          end_date?: string
          old_duty_ids?: number[]
          old_duty_period_ids?: number[]
          raw_duty_ids?: number[]
          raw_duty_period_ids?: number[]
          roster_id?: number
          start_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      roster_match: {
        Row: {
          created_at: string
          date: string
          duty_id: number | null
          duty_period_id: number | null
          id: number
          is_duty_period: boolean
          is_found: boolean
          match_type: Database["public"]["Enums"]["match_types"]
          no_of_changes: number | null
          old_duty_id: number | null
          old_duty_period_id: number | null
          raw_duty_id: number | null
          raw_duty_period_id: number | null
          roster_id: number
        }
        Insert: {
          created_at?: string
          date: string
          duty_id?: number | null
          duty_period_id?: number | null
          id?: number
          is_duty_period?: boolean
          is_found: boolean
          match_type: Database["public"]["Enums"]["match_types"]
          no_of_changes?: number | null
          old_duty_id?: number | null
          old_duty_period_id?: number | null
          raw_duty_id?: number | null
          raw_duty_period_id?: number | null
          roster_id: number
        }
        Update: {
          created_at?: string
          date?: string
          duty_id?: number | null
          duty_period_id?: number | null
          id?: number
          is_duty_period?: boolean
          is_found?: boolean
          match_type?: Database["public"]["Enums"]["match_types"]
          no_of_changes?: number | null
          old_duty_id?: number | null
          old_duty_period_id?: number | null
          raw_duty_id?: number | null
          raw_duty_period_id?: number | null
          roster_id?: number
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
      change_codes: "New" | "Update" | "Delete"
      duty_type: "Flight" | "Hotel" | "Default" | "Standby" | "Off" | "Training"
      match_types: "New" | "Match" | "Update" | "Delete"
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
