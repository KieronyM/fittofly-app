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
          change_code: string | null
          change_date: string | null
          change_id: number
          created_at: string
          data_category: string | null
          data_categoty: string | null
          data_item: string | null
          date: string | null
          from_duty_id: string | null
          from_duty_period_id: string | null
          from_flight_id: string | null
          from_value: string | null
          raw_duty_id: string | null
          raw_duty_period_id: string | null
          raw_flight_id: string | null
          roster_id: string | null
          to_duty_id: string | null
          to_duty_period_id: string | null
          to_flight_id: string | null
          to_value: string | null
          user_id: string | null
        }
        Insert: {
          change_code?: string | null
          change_date?: string | null
          change_id?: number
          created_at?: string
          data_category?: string | null
          data_categoty?: string | null
          data_item?: string | null
          date?: string | null
          from_duty_id?: string | null
          from_duty_period_id?: string | null
          from_flight_id?: string | null
          from_value?: string | null
          raw_duty_id?: string | null
          raw_duty_period_id?: string | null
          raw_flight_id?: string | null
          roster_id?: string | null
          to_duty_id?: string | null
          to_duty_period_id?: string | null
          to_flight_id?: string | null
          to_value?: string | null
          user_id?: string | null
        }
        Update: {
          change_code?: string | null
          change_date?: string | null
          change_id?: number
          created_at?: string
          data_category?: string | null
          data_categoty?: string | null
          data_item?: string | null
          date?: string | null
          from_duty_id?: string | null
          from_duty_period_id?: string | null
          from_flight_id?: string | null
          from_value?: string | null
          raw_duty_id?: string | null
          raw_duty_period_id?: string | null
          raw_flight_id?: string | null
          roster_id?: string | null
          to_duty_id?: string | null
          to_duty_period_id?: string | null
          to_flight_id?: string | null
          to_value?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      duty: {
        Row: {
          created_at: string
          current_from: string | null
          current_to: string | null
          date: string
          debrief_time: string | null
          delay_hhmm: string | null
          duty_code: string
          duty_description: string
          duty_id: number
          duty_period_hhmm: string | null
          duty_period_id: number | null
          duty_type: Database["public"]["Enums"]["duty_type"]
          end_time: string | null
          flight_duty_period_hhmm: string | null
          indicators: string | null
          is_all_day: boolean | null
          is_current: boolean | null
          raw_duty_ids: number[] | null
          report_time: string | null
          roster_ids: number[]
          sectors: number | null
          start_time: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          current_from?: string | null
          current_to?: string | null
          date: string
          debrief_time?: string | null
          delay_hhmm?: string | null
          duty_code: string
          duty_description: string
          duty_id?: number
          duty_period_hhmm?: string | null
          duty_period_id?: number | null
          duty_type: Database["public"]["Enums"]["duty_type"]
          end_time?: string | null
          flight_duty_period_hhmm?: string | null
          indicators?: string | null
          is_all_day?: boolean | null
          is_current?: boolean | null
          raw_duty_ids?: number[] | null
          report_time?: string | null
          roster_ids: number[]
          sectors?: number | null
          start_time?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string
          current_from?: string | null
          current_to?: string | null
          date?: string
          debrief_time?: string | null
          delay_hhmm?: string | null
          duty_code?: string
          duty_description?: string
          duty_id?: number
          duty_period_hhmm?: string | null
          duty_period_id?: number | null
          duty_type?: Database["public"]["Enums"]["duty_type"]
          end_time?: string | null
          flight_duty_period_hhmm?: string | null
          indicators?: string | null
          is_all_day?: boolean | null
          is_current?: boolean | null
          raw_duty_ids?: number[] | null
          report_time?: string | null
          roster_ids?: number[]
          sectors?: number | null
          start_time?: string | null
          user_id?: string
        }
        Relationships: []
      }
      duty_period: {
        Row: {
          created_at: string
          current_from: string | null
          current_to: string | null
          debrief_time: string | null
          delay_hhmm: string | null
          duty_ids: string | null
          duty_period_hhmm: string | null
          duty_period_id: number
          duty_types: number | null
          earliest_dp_start_time: string | null
          earliest_nxt_dp_start_time: string | null
          end_time: string | null
          flight_duty_period_hhmm: string | null
          flight_ids: string | null
          is_current: boolean | null
          max_fdp: string | null
          max_fdp_tolerance_hhmm: string | null
          report_time: string | null
          sectors: number | null
          start_time: string | null
        }
        Insert: {
          created_at?: string
          current_from?: string | null
          current_to?: string | null
          debrief_time?: string | null
          delay_hhmm?: string | null
          duty_ids?: string | null
          duty_period_hhmm?: string | null
          duty_period_id?: number
          duty_types?: number | null
          earliest_dp_start_time?: string | null
          earliest_nxt_dp_start_time?: string | null
          end_time?: string | null
          flight_duty_period_hhmm?: string | null
          flight_ids?: string | null
          is_current?: boolean | null
          max_fdp?: string | null
          max_fdp_tolerance_hhmm?: string | null
          report_time?: string | null
          sectors?: number | null
          start_time?: string | null
        }
        Update: {
          created_at?: string
          current_from?: string | null
          current_to?: string | null
          debrief_time?: string | null
          delay_hhmm?: string | null
          duty_ids?: string | null
          duty_period_hhmm?: string | null
          duty_period_id?: number
          duty_types?: number | null
          earliest_dp_start_time?: string | null
          earliest_nxt_dp_start_time?: string | null
          end_time?: string | null
          flight_duty_period_hhmm?: string | null
          flight_ids?: string | null
          is_current?: boolean | null
          max_fdp?: string | null
          max_fdp_tolerance_hhmm?: string | null
          report_time?: string | null
          sectors?: number | null
          start_time?: string | null
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
      flight: {
        Row: {
          aircraft: string | null
          created_at: string
          current_from: string | null
          current_to: string | null
          debrief_time: string | null
          delay_hhmm: string | null
          destination: string | null
          distance_nm: number | null
          duty_id: number | null
          end_time: string | null
          expected_pax: number | null
          flight_id: number
          gate: string | null
          indicators: string | null
          is_current: boolean | null
          is_positioning: boolean | null
          origin: string | null
          raw_flight_ids: string | null
          registration: string | null
          report_time: string | null
          stand: string | null
          start_time: string | null
        }
        Insert: {
          aircraft?: string | null
          created_at?: string
          current_from?: string | null
          current_to?: string | null
          debrief_time?: string | null
          delay_hhmm?: string | null
          destination?: string | null
          distance_nm?: number | null
          duty_id?: number | null
          end_time?: string | null
          expected_pax?: number | null
          flight_id?: number
          gate?: string | null
          indicators?: string | null
          is_current?: boolean | null
          is_positioning?: boolean | null
          origin?: string | null
          raw_flight_ids?: string | null
          registration?: string | null
          report_time?: string | null
          stand?: string | null
          start_time?: string | null
        }
        Update: {
          aircraft?: string | null
          created_at?: string
          current_from?: string | null
          current_to?: string | null
          debrief_time?: string | null
          delay_hhmm?: string | null
          destination?: string | null
          distance_nm?: number | null
          duty_id?: number | null
          end_time?: string | null
          expected_pax?: number | null
          flight_id?: number
          gate?: string | null
          indicators?: string | null
          is_current?: boolean | null
          is_positioning?: boolean | null
          origin?: string | null
          raw_flight_ids?: string | null
          registration?: string | null
          report_time?: string | null
          stand?: string | null
          start_time?: string | null
        }
        Relationships: []
      }
      raw_duty: {
        Row: {
          created_at: string
          date: string
          debrief_time: string | null
          delay_hhmm: string | null
          duty_code: string
          duty_description: string
          duty_id: number | null
          duty_type: Database["public"]["Enums"]["duty_type"]
          ecrew_duty_id: string
          end_time: string
          indicators: string | null
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
          delay_hhmm?: string | null
          duty_code: string
          duty_description: string
          duty_id?: number | null
          duty_type: Database["public"]["Enums"]["duty_type"]
          ecrew_duty_id: string
          end_time: string
          indicators?: string | null
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
          delay_hhmm?: string | null
          duty_code?: string
          duty_description?: string
          duty_id?: number | null
          duty_type?: Database["public"]["Enums"]["duty_type"]
          ecrew_duty_id?: string
          end_time?: string
          indicators?: string | null
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
            foreignKeyName: "raw_duty_raw_duty_period_id_fkey"
            columns: ["raw_duty_period_id"]
            isOneToOne: false
            referencedRelation: "raw_duty_period"
            referencedColumns: ["raw_duty_periodid"]
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
          debrief_time: string
          delay_hhmm: string | null
          duty_period_hhmm: string | null
          duty_period_id: number | null
          duty_types: string | null
          end_time: string
          flight_duty_period_hhmm: string | null
          no_duty_types: number
          raw_duty_periodid: number
          raw_flight_ids: string | null
          report_time: string
          roster_id: number
          sectors: number
          start_time: string
        }
        Insert: {
          created_at?: string
          date: string
          debrief_time: string
          delay_hhmm?: string | null
          duty_period_hhmm?: string | null
          duty_period_id?: number | null
          duty_types?: string | null
          end_time: string
          flight_duty_period_hhmm?: string | null
          no_duty_types: number
          raw_duty_periodid?: number
          raw_flight_ids?: string | null
          report_time: string
          roster_id: number
          sectors: number
          start_time: string
        }
        Update: {
          created_at?: string
          date?: string
          debrief_time?: string
          delay_hhmm?: string | null
          duty_period_hhmm?: string | null
          duty_period_id?: number | null
          duty_types?: string | null
          end_time?: string
          flight_duty_period_hhmm?: string | null
          no_duty_types?: number
          raw_duty_periodid?: number
          raw_flight_ids?: string | null
          report_time?: string
          roster_id?: number
          sectors?: number
          start_time?: string
        }
        Relationships: []
      }
      raw_flight: {
        Row: {
          aircraft: string | null
          created_at: string
          debrief_time: string | null
          delay_hhmm: string | null
          destination: string
          distance_nm: number | null
          ecrew_flight_id: string | null
          end_time: string
          expected_pax: string | null
          flight_number: string
          gate: string | null
          is_positioning: boolean
          origin: string
          raw_duty_id: number | null
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
          ecrew_flight_id?: string | null
          end_time: string
          expected_pax?: string | null
          flight_number: string
          gate?: string | null
          is_positioning?: boolean
          origin: string
          raw_duty_id?: number | null
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
          ecrew_flight_id?: string | null
          end_time?: string
          expected_pax?: string | null
          flight_number?: string
          gate?: string | null
          is_positioning?: boolean
          origin?: string
          raw_duty_id?: number | null
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
          flight_ids: number[]
          old_duty_ids: number[]
          old_duty_period_ids: number[]
          old_flight_ids: number[]
          raw_duty_ids: number[]
          raw_duty_period_ids: number[]
          raw_flight_ids: number[]
          roster_id: number
          start_date: string
          user_id: string
        }
        Insert: {
          created_at?: string
          duty_ids: number[]
          duty_period_ids: number[]
          end_date: string
          flight_ids: number[]
          old_duty_ids: number[]
          old_duty_period_ids: number[]
          old_flight_ids: number[]
          raw_duty_ids: number[]
          raw_duty_period_ids: number[]
          raw_flight_ids: number[]
          roster_id?: number
          start_date: string
          user_id?: string
        }
        Update: {
          created_at?: string
          duty_ids?: number[]
          duty_period_ids?: number[]
          end_date?: string
          flight_ids?: number[]
          old_duty_ids?: number[]
          old_duty_period_ids?: number[]
          old_flight_ids?: number[]
          raw_duty_ids?: number[]
          raw_duty_period_ids?: number[]
          raw_flight_ids?: number[]
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
      duty_type: "Flight" | "Hotel" | "Default" | "Standby" | "Off" | "Training"
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
