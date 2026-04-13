// @ts-nocheck
import NextAuth from 'next-auth'
import type { NextAuthOptions } from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import GoogleProvider from 'next-auth/providers/google'
import { createAdminSupabaseClient } from './supabase'

export const authOptions: NextAuthOptions = {
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST || 'smtp.resend.com',
        port: Number(process.env.EMAIL_SERVER_PORT) || 587,
        auth: {
          user: process.env.EMAIL_SERVER_USER || 'resend',
          pass: process.env.EMAIL_SERVER_PASSWORD || '',
        },
      },
      from: process.env.EMAIL_FROM || 'noreply@clinicpages.io',
    }),
    ...(process.env.GOOGLE_CLIENT_ID ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
    ] : []),
  ],
  
  pages: {
    signIn: '/login',
    error: '/login',
  },
  
  session: { strategy: 'jwt' },
  
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false
      const supabase = createAdminSupabaseClient()
      
      await supabase.from('users').upsert({
        id: user.id,
        email: user.email,
        name: user.name,
        credits: 3,
        plan: 'free',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email', ignoreDuplicates: true })
      
      return true
    },
    
    async jwt({ token, user }) {
      if (user) {
        const supabase = createAdminSupabaseClient()
        const { data } = await supabase
          .from('users')
          .select('id, credits, plan')
          .eq('email', token.email)
          .single()
        
        if (data) {
          token.userId = data.id
          token.credits = data.credits
          token.plan = data.plan
        }
      }
      return token
    },
    
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId
        session.user.credits = token.credits
        session.user.plan = token.plan
      }
      return session
    },
  },
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      credits: number
      plan: string
    }
  }
}
