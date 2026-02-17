'use client'

import type { ReactNode } from 'react'
import { useAuth } from '@/components/auth'
import { MainNav } from './MainNav'
import { UserMenu } from './UserMenu'
import { DarkModeToggle } from './DarkModeToggle'
import { LoginDialog } from '@/components/auth'
import { useState } from 'react'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const { user, loading } = useAuth()
  const [showLoginDialog, setShowLoginDialog] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <MainNav userRole={user?.role} />
      
      {/* Header actions - Dark mode toggle and User menu */}
      {user && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
          <DarkModeToggle />
          <UserMenu />
        </div>
      )}
      
      {/* Login button for non-authenticated users */}
      {!user && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
          <DarkModeToggle />
          <button
            onClick={() => setShowLoginDialog(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Sign In
          </button>
        </div>
      )}
      
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Login Dialog */}
      <LoginDialog 
        isOpen={showLoginDialog} 
        onClose={() => setShowLoginDialog(false)} 
      />
    </div>
  )
}