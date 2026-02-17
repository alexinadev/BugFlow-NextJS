'use client'

import { useSyncExternalStore, useCallback } from 'react'
import { Sun, Moon } from 'lucide-react'

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback)
  return () => window.removeEventListener('storage', callback)
}

function getSnapshot(): boolean {
  if (typeof window === 'undefined') return false
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return savedTheme === 'dark' || (!savedTheme && prefersDark)
}

function getServerSnapshot(): boolean {
  return false
}

export function DarkModeToggle() {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const toggleDarkMode = useCallback(() => {
    const newDarkMode = !isDark
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
    
    // Dispatch storage event to sync across tabs
    window.dispatchEvent(new StorageEvent('storage'))
  }, [isDark])

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-700 transition-colors"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  )
}