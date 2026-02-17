'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import type { Ticket, TicketStatus } from '@/types'

interface StatusDistributionChartProps {
  tickets: Ticket[]
}

const statusColors: Record<string, string> = {
  pending_verification: '#64748b',
  open: '#3b82f6',
  in_progress: '#f59e0b',
  resolved: '#10b981',
  closed: '#8b5cf6',
  incoming: '#06b6d4',
  acknowledged: '#6366f1',
  review: '#ec4899',
  triaged: '#f97316',
  investigating: '#eab308',
  pending: '#78716c',
}

const statusLabels: Record<string, string> = {
  pending_verification: 'Pending Review',
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
  incoming: 'Incoming',
  acknowledged: 'Acknowledged',
  review: 'In Review',
  triaged: 'Triaged',
  investigating: 'Investigating',
  pending: 'Pending',
}

export function StatusDistributionChart({ tickets }: StatusDistributionChartProps) {
  // Group tickets by status
  const statusData = tickets.reduce((acc, ticket) => {
    const status = ticket.status as TicketStatus
    if (!acc[status]) {
      acc[status] = 0
    }
    acc[status]++
    return acc
  }, {} as Record<string, number>)

  // Convert to chart data
  const chartData = Object.entries(statusData)
    .map(([status, count]) => ({
      name: statusLabels[status] || status,
      value: count,
      color: statusColors[status] || '#64748b',
    }))
    .filter(item => item.value > 0)

  if (chartData.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Status Distribution
        </h3>
        <div className="h-64 flex items-center justify-center text-slate-400">
          No data available
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
        Status Distribution
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e2e8f0',
                borderRadius: '8px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {item.name}: {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}