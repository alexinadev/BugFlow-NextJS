'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell, Check, CheckCheck, X, Ticket, User, AlertCircle } from 'lucide-react'

interface Notification {
  id: string
  ticketId: string
  type: 'status_change' | 'assignment' | 'resolution' | 'update'
  message: string
  createdAt: string
  read: boolean
}

interface NotificationBellProps {
  notifications: Notification[]
  onMarkRead: (id: string) => void
  onMarkAllRead: () => void
  onViewTicket: (ticketId: string) => void
}

const typeIcons = {
  status_change: <AlertCircle className="h-4 w-4 text-blue-500" />,
  assignment: <User className="h-4 w-4 text-purple-500" />,
  resolution: <Check className="h-4 w-4 text-emerald-500" />,
  update: <Ticket className="h-4 w-4 text-orange-500" />,
}

export function NotificationBell({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onViewTicket,
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllRead}
                className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">You're all caught up</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer ${
                    !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                  }`}
                  onClick={() => {
                    onMarkRead(notification.id)
                    onViewTicket(notification.ticketId)
                    setIsOpen(false)
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {typeIcons[notification.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-900 dark:text-white line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}