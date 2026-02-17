'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth'
import { AdminDashboard } from '@/components/admin'
import type { Ticket, TicketStatus } from '@/types'

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [admins, setAdmins] = useState<{ id: string; name: string }[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Redirect non-admins
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/')
    }
  }, [user, authLoading, router])

  // Fetch tickets and admins
  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [ticketsRes, adminsRes] = await Promise.all([
        fetch('/api/tickets'),
        fetch('/api/admin/users'),
      ])

      const ticketsData = await ticketsRes.json()
      const adminsData = await adminsRes.json()

      if (ticketsData.success) {
        setTickets(ticketsData.tickets)
      }

      if (adminsData.success) {
        setAdmins(adminsData.admins)
      }
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      fetchData()
    }
  }, [user, fetchData])

  const handleUpdateTicket = async (ticketId: string, updates: Partial<Ticket>) => {
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      const data = await res.json()

      if (data.success) {
        setTickets((prev) =>
          prev.map((t) => (t.id === ticketId ? { ...t, ...updates } : t))
        )
      } else {
        alert(data.error || 'Failed to update ticket')
      }
    } catch (error) {
      console.error('Update error:', error)
      alert('Failed to update ticket')
    }
  }

  const handleBulkUpdate = async (ticketIds: string[], updates: Partial<Ticket>) => {
    try {
      const res = await fetch('/api/tickets/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketIds, ...updates }),
      })

      const data = await res.json()

      if (data.success) {
        setTickets((prev) =>
          prev.map((t) => (ticketIds.includes(t.id) ? { ...t, ...updates } : t))
        )
      } else {
        alert(data.error || 'Failed to update tickets')
      }
    } catch (error) {
      console.error('Bulk update error:', error)
      alert('Failed to update tickets')
    }
  }

  const handleExport = (ticketIds: string[]) => {
    const selectedTickets = tickets.filter((t) => ticketIds.includes(t.id))
    const csv = [
      ['ID', 'Title', 'Status', 'Severity', 'Created', 'Assigned To'].join(','),
      ...selectedTickets.map((t) =>
        [
          t.id,
          `"${t.title.replace(/"/g, '""')}"`,
          t.status,
          t.severity,
          new Date(t.createdAt).toLocaleDateString(),
          t.assignedTo?.join('; ') || '',
        ].join(',')
      ),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tickets-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (authLoading || !user || user.role !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-slate-500">Loading...</div>
      </div>
    )
  }

  return (
    <AdminDashboard
      tickets={tickets}
      admins={admins}
      isLoading={isLoading}
      onRefresh={fetchData}
      onUpdateTicket={handleUpdateTicket}
      onBulkUpdate={handleBulkUpdate}
      onExport={handleExport}
    />
  )
}