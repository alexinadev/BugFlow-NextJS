'use client'

import { useAuth } from '@/components/auth'
import { IfRole } from '@/lib/ui-helpers'

/**
 * ADMIN System Dashboard
 * 
 * Shows administrators:
 * - User management (add, edit, disable accounts)
 * - System settings and configuration
 * - Audit logs (activity tracking)
 * - Application health and statistics
 */
export default function AdminSystemDashboard() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-slate-600 dark:text-slate-400">Loading...</div>
      </div>
    )
  }

  return (
    <IfRole
      role={user?.role}
      allowed={['ADMIN']}
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Access Denied
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Only administrators can access system settings.
            </p>
          </div>
        </div>
      }
    >
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            System Administration
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            {user?.name} • System Settings & User Management
          </p>
        </div>

        {/* Admin tabs/sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Users Management */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              User Management
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Add, edit, and manage user accounts and permissions.
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Manage Users
            </button>
          </div>

          {/* Settings */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              System Settings
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Configure system-wide settings, notifications, and defaults.
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Open Settings
            </button>
          </div>

          {/* Audit Logs */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Audit Logs
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              View activity logs and system changes for compliance tracking.
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              View Logs
            </button>
          </div>

          {/* System Health */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              System Health
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Monitor application health, database status, and statistics.
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              View Stats
            </button>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-slate-50 dark:bg-slate-900 rounded-lg shadow-md p-6 border border-slate-200 dark:border-slate-700 mt-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            System Information
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Total Users</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">0</div>
            </div>
            <div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Active Sessions</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">0</div>
            </div>
            <div>
              <div className="text-sm text-slate-600 dark:text-slate-400">DB Size</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">0 MB</div>
            </div>
            <div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Uptime</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">--</div>
            </div>
          </div>
        </div>
      </div>
    </IfRole>
  )
}
