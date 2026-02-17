'use client'

import { useState, useRef, useEffect } from 'react'
import { User, LogOut, ChevronDown } from 'lucide-react'
import { useAuth } from '@/components/auth'

export function UserMenu() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await logout()
    setIsOpen(false)
  }

  if (!user) return null

  return (
    <div className="fixed top-4 right-4 z-50" ref={dropdownRef}>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-2 rounded-md bg-white dark:bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full" />
            ) : (
              <User className="h-4 w-4 text-white" />
            )}
          </div>
          <span className="hidden sm:inline">{user.name}</span>
          <ChevronDown className="-mr-1 h-4 w-4 text-slate-400" />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-slate-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <div className="px-4 py-2 text-sm text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
                <div className="font-medium">{user.name}</div>
                <div className="text-slate-500 dark:text-slate-400 text-xs">{user.phone}</div>
                <div className="text-xs mt-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    user.role === 'ADMIN' 
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' 
                      : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                  }`}>
                    {user.role}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut className="mr-3 h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}