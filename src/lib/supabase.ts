import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          profession: string
          role: 'admin' | 'professional' | 'student'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          profession: string
          role?: 'admin' | 'professional' | 'student'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          profession?: string
          role?: 'admin' | 'professional' | 'student'
          created_at?: string
          updated_at?: string
        }
      }
      patients: {
        Row: {
          id: string
          name: string
          birth_date: string
          cpf: string
          phone: string
          email: string
          address: string
          emergency_contact: string
          medical_history: string
          created_at: string
          updated_at: string
          created_by: string
        }
        Insert: {
          id?: string
          name: string
          birth_date: string
          cpf: string
          phone: string
          email?: string
          address?: string
          emergency_contact?: string
          medical_history?: string
          created_at?: string
          updated_at?: string
          created_by: string
        }
        Update: {
          id?: string
          name?: string
          birth_date?: string
          cpf?: string
          phone?: string
          email?: string
          address?: string
          emergency_contact?: string
          medical_history?: string
          created_at?: string
          updated_at?: string
          created_by?: string
        }
      }
      evolutions: {
        Row: {
          id: string
          patient_id: string
          professional_id: string
          profession: string
          date: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          professional_id: string
          profession: string
          date: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          professional_id?: string
          profession?: string
          date?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          patient_id: string
          name: string
          type: string
          category: string
          file_url: string
          uploaded_by: string
          created_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          name: string
          type: string
          category: string
          file_url: string
          uploaded_by: string
          created_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          name?: string
          type?: string
          category?: string
          file_url?: string
          uploaded_by?: string
          created_at?: string
        }
      }
      document_templates: {
        Row: {
          id: string
          name: string
          profession: string
          template_content: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          profession: string
          template_content: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          profession?: string
          template_content?: string
          created_at?: string
        }
      }
    }
  }
}