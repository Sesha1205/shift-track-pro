export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ai_chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          message_type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          message_type: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          message_type?: string
          user_id?: string
        }
        Relationships: []
      }
      bills: {
        Row: {
          amount: number
          auto_pay_enabled: boolean
          category: string
          created_at: string
          due_date: string
          frequency: string
          id: string
          is_paid: boolean
          name: string
          notes: string | null
          payment_method_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          auto_pay_enabled?: boolean
          category: string
          created_at?: string
          due_date: string
          frequency?: string
          id?: string
          is_paid?: boolean
          name: string
          notes?: string | null
          payment_method_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          auto_pay_enabled?: boolean
          category?: string
          created_at?: string
          due_date?: string
          frequency?: string
          id?: string
          is_paid?: boolean
          name?: string
          notes?: string | null
          payment_method_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          booking_status: string | null
          created_at: string | null
          end_date: string
          id: string
          payment_status: string | null
          pickup_location: string
          price_per_day: number
          start_date: string
          total_amount: number
          total_days: number
          updated_at: string | null
          user_id: string | null
          vehicle_id: string | null
        }
        Insert: {
          booking_status?: string | null
          created_at?: string | null
          end_date: string
          id?: string
          payment_status?: string | null
          pickup_location: string
          price_per_day: number
          start_date: string
          total_amount: number
          total_days: number
          updated_at?: string | null
          user_id?: string | null
          vehicle_id?: string | null
        }
        Update: {
          booking_status?: string | null
          created_at?: string | null
          end_date?: string
          id?: string
          payment_status?: string | null
          pickup_location?: string
          price_per_day?: number
          start_date?: string
          total_amount?: number
          total_days?: number
          updated_at?: string | null
          user_id?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_queries: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          status: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      employees: {
        Row: {
          created_at: string
          department: string
          email: string
          employee_id: string
          id: string
          name: string
          phone: string | null
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          department: string
          email: string
          employee_id: string
          id?: string
          name: string
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          department?: string
          email?: string
          employee_id?: string
          id?: string
          name?: string
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          ai_prompt: string | null
          content: string
          created_at: string
          id: string
          mood: string | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_prompt?: string | null
          content: string
          created_at?: string
          id?: string
          mood?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_prompt?: string | null
          content?: string
          created_at?: string
          id?: string
          mood?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      meditation_sessions: {
        Row: {
          completed_at: string
          duration_completed: number
          id: string
          meditation_id: string | null
          mood_after: string | null
          mood_before: string | null
          notes: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string
          duration_completed: number
          id?: string
          meditation_id?: string | null
          mood_after?: string | null
          mood_before?: string | null
          notes?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string
          duration_completed?: number
          id?: string
          meditation_id?: string | null
          mood_after?: string | null
          mood_before?: string | null
          notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meditation_sessions_meditation_id_fkey"
            columns: ["meditation_id"]
            isOneToOne: false
            referencedRelation: "meditations"
            referencedColumns: ["id"]
          },
        ]
      }
      meditations: {
        Row: {
          audio_url: string | null
          category: string
          created_at: string
          description: string | null
          difficulty_level: string | null
          duration_minutes: number
          id: string
          image_url: string | null
          instructor: string | null
          play_count: number | null
          rating: number | null
          title: string
          updated_at: string
        }
        Insert: {
          audio_url?: string | null
          category: string
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          duration_minutes: number
          id?: string
          image_url?: string | null
          instructor?: string | null
          play_count?: number | null
          rating?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          audio_url?: string | null
          category?: string
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          duration_minutes?: number
          id?: string
          image_url?: string | null
          instructor?: string | null
          play_count?: number | null
          rating?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          created_at: string
          id: string
          is_default: boolean
          last_four: string | null
          name: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_default?: boolean
          last_four?: string | null
          name: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_default?: boolean
          last_four?: string | null
          name?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          meditation_streak: number | null
          minutes_meditated: number | null
          total_sessions: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          meditation_streak?: number | null
          minutes_meditated?: number | null
          total_sessions?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          meditation_streak?: number | null
          minutes_meditated?: number | null
          total_sessions?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      time_entries: {
        Row: {
          clock_in_time: string | null
          clock_out_time: string | null
          created_at: string
          date: string
          employee_id: string
          employee_name: string
          id: string
          notes: string | null
          status: string
          total_hours: number | null
          updated_at: string
        }
        Insert: {
          clock_in_time?: string | null
          clock_out_time?: string | null
          created_at?: string
          date?: string
          employee_id: string
          employee_name: string
          id?: string
          notes?: string | null
          status?: string
          total_hours?: number | null
          updated_at?: string
        }
        Update: {
          clock_in_time?: string | null
          clock_out_time?: string | null
          created_at?: string
          date?: string
          employee_id?: string
          employee_name?: string
          id?: string
          notes?: string | null
          status?: string
          total_hours?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          availability: boolean | null
          brand: string
          category: string
          created_at: string | null
          description: string | null
          engine_capacity: string | null
          features: string[] | null
          fuel_type: string
          id: string
          image_urls: string[]
          location: string
          mileage: number | null
          model: string
          pickup_locations: string[] | null
          price_per_day: number
          rating: number | null
          seating_capacity: number | null
          subcategory: string | null
          title: string
          transmission: string | null
          updated_at: string | null
          year: number | null
        }
        Insert: {
          availability?: boolean | null
          brand: string
          category: string
          created_at?: string | null
          description?: string | null
          engine_capacity?: string | null
          features?: string[] | null
          fuel_type: string
          id?: string
          image_urls?: string[]
          location?: string
          mileage?: number | null
          model: string
          pickup_locations?: string[] | null
          price_per_day: number
          rating?: number | null
          seating_capacity?: number | null
          subcategory?: string | null
          title: string
          transmission?: string | null
          updated_at?: string | null
          year?: number | null
        }
        Update: {
          availability?: boolean | null
          brand?: string
          category?: string
          created_at?: string | null
          description?: string | null
          engine_capacity?: string | null
          features?: string[] | null
          fuel_type?: string
          id?: string
          image_urls?: string[]
          location?: string
          mileage?: number | null
          model?: string
          pickup_locations?: string[] | null
          price_per_day?: number
          rating?: number | null
          seating_capacity?: number | null
          subcategory?: string | null
          title?: string
          transmission?: string | null
          updated_at?: string | null
          year?: number | null
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
