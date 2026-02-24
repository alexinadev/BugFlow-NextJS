'use client'

import { useAuth } from '@/components/auth'
import { IfRole } from '@/lib/ui-helpers'

/**
 * AGENT Dashboard
 * 
 * Shows IT Support staff:
 * - List of assigned tickets (Kanban board view)
 * - Quick actions (update status, add notes, upload attachments)
 * - Assignment queue (unassigned tickets waiting)
 */
export default function AgentDashboard() {
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
      allowed={['AGENT', 'MANAGER', 'ADMIN']}
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Access Denied
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              You don't have permission to view this dashboard.
            </p>
          </div>
        </div>
      }
    >
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            My Queue
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            {user?.name} • Assigned Tickets for Resolution
          </p>
        </div>

        {/* Placeholder content - to be replaced with actual Kanban board */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-8 border border-slate-200 dark:border-slate-700">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Assigned Tickets (Kanban)
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              This section will display assigned tickets in columns: Open, In Progress, Pending Info, Resolved
            </p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">0</div>
            <div className="text-sm text-blue-800 dark:text-blue-300">Assigned</div>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">0</div>
            <div className="text-sm text-amber-800 dark:text-amber-300">In Progress</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">0</div>
            <div className="text-sm text-purple-800 dark:text-purple-300">Pending Info</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">0</div>
            <div className="text-sm text-green-800 dark:text-green-300">Resolved</div>
          </div>
        </div>
      </div>
    </IfRole>
  )
}
