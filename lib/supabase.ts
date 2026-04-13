import { createServerClient } from '@supabase/ssr'
import { createBrowserClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Browser client (client components)
export function createBrowserSupabaseClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Server client (server components, API routes)
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch {
          // Server component — can't set cookies
        }
      },
    },
  })
}

// Admin client (service role — bypasses RLS)
export function createAdminSupabaseClient() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          credits: number
          plan: 'free' | 'starter' | 'pro' | 'agency'
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          credits?: number
          plan?: 'free' | 'starter' | 'pro' | 'agency'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          email?: string
          name?: string | null
          credits?: number
          plan?: 'free' | 'starter' | 'pro' | 'agency'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
        }
      }
      brand_settings: {
        Row: {
          id: string
          user_id: string
          clinic_name: string
          logo_url: string | null
          primary_color: string
          secondary_color: string
          accent_color: string
          phone: string | null
          email: string | null
          address: string | null
          maps_url: string | null
          created_at: string
          updated_at: string
        }
      }
      pages: {
        Row: {
          id: string
          user_id: string
          title: string
          treatment_name: string
          treatment_category: string
          status: 'draft' | 'generating' | 'ready' | 'error'
          content_json: Record<string, unknown> | null
          generated_html_dark_en: string | null
          generated_html_light_en: string | null
          generated_html_dark_de: string | null
          generated_html_light_de: string | null
          config: Record<string, unknown>
          credits_used: number
          created_at: string
          updated_at: string
        }
      }
    }
  }
}
