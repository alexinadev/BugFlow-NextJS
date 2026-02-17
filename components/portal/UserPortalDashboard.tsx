'use client'

import { useState, useMemo } from 'react'
import { FileText, CheckCircle, Clock, TrendingUp, FileBarChart, RefreshCw } from 'lucide-react'
import { MetricCard } from './MetricCard'
import { SubmissionChart } from './SubmissionChart'
import { StatusDistributionChart } from './StatusDistributionChart'
import { ReportGenerator } from './ReportGenerator'
import type { Ticket } from '@/types'

interface UserPortalDashboardProps {
  tickets: Ticket[]
  isLoading?: boolean
  onRefresh?: () => void
  onViewTicket?: (ticketId: string) => void
}

export function UserPortalDashboard({
  tickets,
  isLoading,
  onRefresh,
  onViewTicket,
}: UserPortalDashboardProps) {
  const [showReportGenerator, setShowReportGenerator] = useState(false)

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalSubmissions = tickets.length
    const resolvedCount = tickets.filter(
      (t) => t.status === 'resolved' || t.status === 'closed'
    ).length
    const pendingCount = tickets.filter(
      (t) => t.status !== 'resolved' && t.status !== 'closed'
    ).length

    // Calculate average resolution time
    const resolvedTickets = tickets.filter((t) => t.resolvedAt)
    let avgResolutionTime = 'N/A'
    if (resolvedTickets.length > 0) {
      const totalDays = resolvedTickets.reduce((sum, t) => {
        const created = new Date(t.createdAt).getTime()
        const resolved = new Date(t.resolvedAt!).getTime()
        return sum + (resolved - created) / (1000 * 60 * 60 * 24)
      }, 0)
      const avgDays = totalDays / resolvedTickets.length
      avgResolutionTime = avgDays < 1 
        ? `${Math.round(avgDays * 24)}h` 
        : `${avgDays.toFixed(1)}d`
    }

    const resolutionRate = totalSubmissions > 0 
      ? `${Math.round((resolvedCount / totalSubmissions) * 100)}%` 
      : '0%'

    return {
      totalSubmissions,
      resolvedCount,
      pendingCount,
      avgResolutionTime,
      resolutionRate,
    }
  }, [tickets])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Overview of your bug submissions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowReportGenerator(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <FileBarChart className="h-4 w-4" />
            Generate Report
          </button>
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Submissions"
          value={metrics.totalSubmissions}
          icon={<FileText className="h-6 w-6" />}
          color="blue"
        />
        <MetricCard
          title="Resolved"
          value={metrics.resolvedCount}
          subtitle={metrics.resolutionRate + ' resolution rate'}
          icon={<CheckCircle className="h-6 w-6" />}
          color="emerald"
        />
        <MetricCard
          title="Pending"
          value={metrics.pendingCount}
          subtitle="Awaiting resolution"
          icon={<Clock className="h-6 w-6" />}
          color="yellow"
        />
        <MetricCard
          title="Avg Resolution"
          value={metrics.avgResolutionTime}
          subtitle="Average time to resolve"
          icon={<TrendingUp className="h-6 w-6" />}
          color="purple"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SubmissionChart tickets={tickets} />
        <StatusDistributionChart tickets={tickets} />
      </div>

      {/* Recent Tickets */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Recent Tickets
        </h3>
        {tickets.length === 0 ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No tickets submitted yet</p>
            <p className="text-sm mt-1">Submit your first bug report to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.slice(0, 5).map((ticket) => (
              <button
                key={ticket.id}
                onClick={() => onViewTicket?.(ticket.id)}
                className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 dark:text-white truncate">
                    {ticket.title}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {ticket.id} • {new Date(ticket.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  ticket.status === 'resolved' || ticket.status === 'closed'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                    : ticket.status === 'in_progress'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                }`}>
                  {ticket.status}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Report Generator Modal */}
      <ReportGenerator
        isOpen={showReportGenerator}
        onClose={() => setShowReportGenerator(false)}
        tickets={tickets}
        metrics={metrics}
      />
    </div>
  )
}