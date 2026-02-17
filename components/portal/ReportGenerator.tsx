'use client'

import { useState } from 'react'
import { X, FileText, Download, Loader2 } from 'lucide-react'
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer'
import type { Ticket } from '@/types'

interface ReportGeneratorProps {
  isOpen: boolean
  onClose: () => void
  tickets: Ticket[]
  metrics: {
    totalSubmissions: number
    resolvedCount: number
    pendingCount: number
    avgResolutionTime: string
    resolutionRate: string
  }
}

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 11,
    color: '#666',
  },
  metricValue: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    padding: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    padding: 8,
  },
  tableCell: {
    fontSize: 9,
    flex: 1,
  },
})

// PDF Document Component
function ReportDocument({ tickets, metrics, dateRange }: { tickets: Ticket[]; metrics: ReportGeneratorProps['metrics']; dateRange: string }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Bug Report Summary</Text>
        <Text style={styles.subtitle}>Generated on {new Date().toLocaleDateString()} | {dateRange}</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Total Submissions</Text>
            <Text style={styles.metricValue}>{metrics.totalSubmissions}</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Resolved Tickets</Text>
            <Text style={styles.metricValue}>{metrics.resolvedCount}</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Pending Tickets</Text>
            <Text style={styles.metricValue}>{metrics.pendingCount}</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Average Resolution Time</Text>
            <Text style={styles.metricValue}>{metrics.avgResolutionTime}</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Resolution Rate</Text>
            <Text style={styles.metricValue}>{metrics.resolutionRate}</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Tickets</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, { flex: 2 }]}>ID</Text>
              <Text style={[styles.tableCell, { flex: 4 }]}>Title</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>Status</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>Created</Text>
            </View>
            {tickets.slice(0, 20).map((ticket, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 2 }]}>{ticket.id}</Text>
                <Text style={[styles.tableCell, { flex: 4 }]}>{ticket.title.substring(0, 40)}</Text>
                <Text style={[styles.tableCell, { flex: 2 }]}>{ticket.status}</Text>
                <Text style={[styles.tableCell, { flex: 2 }]}>{new Date(ticket.createdAt).toLocaleDateString()}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  )
}

export function ReportGenerator({ isOpen, onClose, tickets, metrics }: ReportGeneratorProps) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  if (!isOpen) return null

  const dateRange = startDate && endDate 
    ? `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`
    : 'All time'

  const filteredTickets = tickets.filter((ticket) => {
    if (!startDate && !endDate) return true
    const ticketDate = new Date(ticket.createdAt)
    const start = startDate ? new Date(startDate) : new Date(0)
    const end = endDate ? new Date(endDate) : new Date()
    return ticketDate >= start && ticketDate <= end
  })

  const exportToCSV = () => {
    const headers = ['ID', 'Title', 'Description', 'Status', 'Severity', 'Created', 'Resolved']
    const rows = filteredTickets.map((t) => [
      t.id,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${t.description?.replace(/"/g, '""') || ''}"`,
      t.status,
      t.severity,
      new Date(t.createdAt).toLocaleDateString(),
      t.resolvedAt ? new Date(t.resolvedAt).toLocaleDateString() : '',
    ])

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bug-report-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Generate Report
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {filteredTickets.length} tickets in selected range
            </p>
          </div>

          <div className="flex gap-3">
            <PDFDownloadLink
              document={<ReportDocument tickets={filteredTickets} metrics={metrics} dateRange={dateRange} />}
              fileName={`bug-report-${new Date().toISOString().split('T')[0]}.pdf`}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {({ loading }) => (
                <>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                  Export PDF
                </>
              )}
            </PDFDownloadLink>
            
            <button
              onClick={exportToCSV}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}