'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import type { Role, NavigationItem } from '@/types'

interface MainNavProps {
  userRole?: Role
}

const allNavigationItems: NavigationItem[] = [
  // USER items
  { label: 'Submit Ticket', href: '/submit', roles: ['USER', 'AGENT', 'MANAGER'] },
  { label: 'Your Tickets', href: '/portal', roles: ['USER'] },
  { label: 'Status Tracking', href: '/status', roles: ['USER', 'AGENT', 'MANAGER', 'ADMIN'] },
  
  // AGENT items
  { label: 'Assigned Tickets', href: '/admin/agent', roles: ['AGENT'] },
  
  // MANAGER items
  { label: 'All Tickets', href: '/admin/tickets', roles: ['MANAGER', 'ADMIN'] },
  { label: 'Analytics', href: '/admin/analytics', roles: ['MANAGER', 'ADMIN'] },
  { label: 'Configuration', href: '/admin/config', roles: ['MANAGER', 'ADMIN'] },
  
  // ADMIN items
  { label: 'System Settings', href: '/admin/system', roles: ['ADMIN'] },
  { label: 'User Management', href: '/admin/system/users', roles: ['ADMIN'] },
  { label: 'Audit Logs', href: '/admin/system/audit', roles: ['ADMIN'] },
]

export function MainNav({ userRole }: MainNavProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigationItems = userRole
    ? allNavigationItems.filter(item => item.roles.includes(userRole))
    : []

  const handleNavigate = (href: string) => {
    router.push(href)
    setMobileMenuOpen(false)
  }

  return (
    <nav className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <button 
              onClick={() => handleNavigate('/portal')}
              className="flex-shrink-0 flex items-center"
            >
              <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">BF</span>
              </div>
              <span className="text-xl font-semibold text-slate-900 dark:text-white">
                BugFlow
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavigate(item.href)}
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors duration-200 ${
                  pathname === item.href
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-slate-600'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
            {navigationItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavigate(item.href)}
                className={`block pl-3 pr-4 py-2 text-base font-medium w-full text-left transition-colors duration-200 ${
                  pathname === item.href
                    ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                    : 'border-l-4 border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-300 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}