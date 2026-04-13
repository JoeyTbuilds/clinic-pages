'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const result = await signIn('email', {
        email,
        redirect: false,
        callbackUrl: '/dashboard',
      })
      
      if (result?.error) {
        setError('Something went wrong. Please try again.')
      } else {
        setSent(true)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleSignIn() {
    setLoading(true)
    signIn('google', { callbackUrl: '/dashboard' })
  }

  return (
    <div className="min-h-screen bg-[#070710] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Back */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={14} /> Back to home
        </Link>
        
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-8">
          {/* Logo */}
          <div className="text-2xl font-bold mb-2">
            Clinic<span className="text-blue-500">Pages</span>
          </div>
          
          {!sent ? (
            <>
              <h1 className="text-2xl font-bold mb-1">Sign in</h1>
              <p className="text-gray-500 text-sm mb-8">
                New here? You'll get 3 free credits to build your first page.
              </p>

              {/* Google */}
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 border border-white/10 hover:border-white/20 text-white py-3 rounded-lg text-sm font-medium transition-all mb-4 disabled:opacity-50"
              >
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path d="M16.5 9.2c0-.6-.1-1.2-.2-1.7H9v3.3h4.2c-.2 1-.8 1.8-1.7 2.4v2h2.7c1.6-1.5 2.3-3.7 2.3-6z" fill="#4285f4"/>
                  <path d="M9 17c2.2 0 4-0.7 5.3-2l-2.7-2c-.7.5-1.6.8-2.6.8-2 0-3.7-1.3-4.3-3.1H1.9v2.1C3.2 15.4 6 17 9 17z" fill="#34a853"/>
                  <path d="M4.7 10.7c-.2-.5-.3-1-.3-1.6s.1-1.1.3-1.6V5.5H1.9C1.3 6.8 1 8.3 1 9.1s.3 2.3.9 3.6l2.8-2z" fill="#fbbc05"/>
                  <path d="M9 3.8c1.1 0 2.1.4 2.8 1.1l2.1-2.1C12.6 1.7 10.9 1 9 1 6 1 3.2 2.6 1.9 5.1L4.7 7c.6-1.8 2.3-3.2 4.3-3.2z" fill="#ea4335"/>
                </svg>
                Continue with Google
              </button>

              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/5" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-[#12121f] px-3 text-gray-600">or continue with email</span>
                </div>
              </div>

              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="you@clinic.com"
                    className="w-full bg-white/[0.05] border border-white/10 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 placeholder-gray-600 transition-colors"
                  />
                </div>
                
                {error && (
                  <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                    {error}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white py-3 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                  Send Magic Link
                </button>
              </form>
              
              <p className="text-center text-xs text-gray-600 mt-6">
                By signing in, you agree to our{' '}
                <a href="#" className="text-gray-500 hover:text-white">Terms</a>
                {' '}and{' '}
                <a href="#" className="text-gray-500 hover:text-white">Privacy Policy</a>.
              </p>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="text-4xl mb-4">📬</div>
              <h2 className="text-xl font-bold mb-2">Check your inbox</h2>
              <p className="text-gray-400 text-sm mb-4">
                We sent a magic link to <strong className="text-white">{email}</strong>.
                Click the link to sign in — no password needed.
              </p>
              <p className="text-gray-600 text-xs">
                Didn't receive it? Check your spam folder or{' '}
                <button 
                  onClick={() => setSent(false)} 
                  className="text-blue-400 hover:underline"
                >
                  try again
                </button>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
