'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { Ticket } from '@/types'

interface SubmissionChartProps {
  tickets: Ticket[]
}

export function SubmissionChart({ tickets }: SubmissionChartProps) {
  // Group tickets by month
  const monthlyData = tickets.reduce((acc, ticket) => {
    const date = new Date(ticket.createdAt)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const monthName = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    
    if (!acc[monthKey]) {
      acc[monthKey] = { month: monthName, submissions: 0, resolved: 0 }
    }
    
    acc[monthKey].submissions++
    
    if (ticket.status === 'resolved' || ticket.status === 'closed') {
      acc[monthKey].resolved++
    }
    
    return acc
  }, {} as Record<string, { month: string; submissions: number; resolved: number }>)

  // Convert to array and sort by date
  const chartData = Object.entries(monthlyData)
    .map(([key, value]) => ({ ...value, key }))
    .sort((a, b) => a.key.localeCompare(b.key))
    .slice(-12) // Last 12 months

  if (chartData.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Submission Trends
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
        Submission Trends
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorSubmissions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
            <XAxis 
              dataKey="month" 
              className="text-xs"
              tick={{ fill: '#64748b' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: '#64748b' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e2e8f0',
                borderRadius: '8px'
              }}
            />
            <Area
              type="monotone"
              dataKey="submissions"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#colorSubmissions)"
              name="Submissions"
            />
            <Area
              type="monotone"
              dataKey="resolved"
              stroke="#10b981"
              fillOpacity={1}
              fill="url(#colorResolved)"
              name="Resolved"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full" />
          <span className="text-sm text-slate-600 dark:text-slate-400">Submissions</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full" />
          <span className="text-sm text-slate-600 dark:text-slate-400">Resolved</span>
        </div>
      </div>
    </div>
  )
}