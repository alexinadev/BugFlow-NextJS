'use client'

import { useState } from 'react'
import { useAuth } from './AuthProvider'
import { X, Phone, Lock, Loader2 } from 'lucide-react'

interface LoginDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginDialog({ isOpen, onClose }: LoginDialogProps) {
  const { login } = useAuth()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(phone, password)
    
    setLoading(false)
    
    if (result.success) {
      setPhone('')
      setPassword('')
      onClose()
    } else {
      setError(result.error || 'Login failed')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Welcome Back
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Sign in to your BugFlow account
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="09123456789"
                required
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
            Demo credentials:
          </p>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-500 text-center space-y-1">
            <p>Admin: 09123456789 / admin123</p>
            <p>User: 09987654321 / user123</p>
          </div>
        </div>
      </div>
    </div>
  )
}