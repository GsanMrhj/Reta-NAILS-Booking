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
      admins: {
        Row: {
          user_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          created_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          first_name: string
          last_name: string
          phone_number: string
          is_blacklisted: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name: string
          last_name: string
          phone_number: string
          is_blacklisted?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          phone_number?: string
          is_blacklisted?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          name_ar: string
          name_he: string
          name_en: string
          duration_minutes: number
          buffer_minutes: number
          price: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name_ar: string
          name_he: string
          name_en: string
          duration_minutes: number
          buffer_minutes?: number
          price: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name_ar?: string
          name_he?: string
          name_en?: string
          duration_minutes?: number
          buffer_minutes?: number
          price?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          customer_id: string
          service_id: string
          start_time: string
          end_time: string
          status: 'pending' | 'confirmed' | 'cancelled_by_customer' | 'cancelled_by_admin' | 'completed' | 'no_show'
          created_at: string
          updated_at: string
          buffer_minutes_snapshot: number
        }
        Insert: {
          id?: string
          customer_id: string
          service_id: string
          start_time: string
          end_time?: string // Handled by DB trigger
          status?: 'pending' | 'confirmed' | 'cancelled_by_customer' | 'cancelled_by_admin' | 'completed' | 'no_show'
          created_at?: string
          updated_at?: string
          buffer_minutes_snapshot?: number
        }
        Update: {
          id?: string
          customer_id?: string
          service_id?: string
          start_time?: string
          end_time?: string
          status?: 'pending' | 'confirmed' | 'cancelled_by_customer' | 'cancelled_by_admin' | 'completed' | 'no_show'
          created_at?: string
          updated_at?: string
          buffer_minutes_snapshot?: number
        }
      }
      working_hours: {
        Row: {
          id: string
          date: string
          start_time: string | null
          end_time: string | null
          is_day_off: boolean
          created_at: string
        }
        Insert: {
          id?: string
          date: string
          start_time?: string | null
          end_time?: string | null
          is_day_off?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          date?: string
          start_time?: string | null
          end_time?: string | null
          is_day_off?: boolean
          created_at?: string
        }
      }
      breaks: {
        Row: {
          id: string
          date: string
          start_time: string
          end_time: string
          reason: string | null
          created_at: string
        }
        Insert: {
          id?: string
          date: string
          start_time: string
          end_time: string
          reason?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          date?: string
          start_time?: string
          end_time?: string
          reason?: string | null
          created_at?: string
        }
      }
    }
  }
}