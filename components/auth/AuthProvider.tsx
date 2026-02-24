'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { AuthUser } from '@/types'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  permissions: string[]
  login: (phone: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [permissions, setPermissions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const refreshUser = useCallback(async () => {
    try {
      const [userResponse, permissionsResponse] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/auth/permissions'),
      ])
      
      const userData = await userResponse.json()
      const permissionsData = await permissionsResponse.json()
      
      if (userData.success) {
        setUser(userData.user)
        setPermissions(permissionsData.permissions || [])
      } else {
        setUser(null)
        setPermissions([])
      }
    } catch {
      setUser(null)
      setPermissions([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const login = async (phone: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      })
      const data = await response.json()
      
      if (data.success) {
        setUser(data.user)
        // Fetch permissions after successful login
        const permissionsResponse = await fetch('/api/auth/permissions')
        const permissionsData = await permissionsResponse.json()
        setPermissions(permissionsData.permissions || [])
      } else {
        setPermissions([])
      }
      
      return data
    } catch (error) {
      setPermissions([])
      return { success: false, error: 'Network error' }
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      setPermissions([])
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, permissions, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}