import type { ReactNode } from 'react'
import { MainNav } from './MainNav'
import { UserMenu } from './UserMenu'

interface AppShellProps {
  children: ReactNode
  navigationItems: Array<{ label: string; href: string; isActive?: boolean }>
  user?: { name: string; avatarUrl?: string }
  onNavigate?: (href: string) => void
  onLogout?: () => void
}

export function AppShell({ 
  children, 
  navigationItems, 
  user, 
  onNavigate, 
  onLogout 
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <MainNav 
        navigationItems={navigationItems}
        onNavigate={onNavigate}
      />
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
      <UserMenu 
        user={user}
        onLogout={onLogout}
      />
    </div>
  )
}
